# 3.9 DDoS Protection

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.9 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section documents the Distributed Denial of Service (DDoS) protection mechanisms implemented in Abhavtech's SD-WAN deployment. The multi-layered defense strategy includes on-box protection capabilities, upstream ISP scrubbing services, and cloud-based DDoS mitigation for comprehensive protection against volumetric, protocol, and application-layer attacks.

### 1.1 DDoS Defense Architecture

```
+------------------------------------------------------------------+
|                   DDoS DEFENSE LAYERS                             |
+------------------------------------------------------------------+
|                                                                   |
|  Layer 1: Upstream / ISP                                          |
|  +----------------------------------------------------------+    |
|  | ISP Scrubbing Centers | BGP Flowspec | Blackhole Routing |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Layer 2: Cloud DDoS Service                                      |
|  +----------------------------------------------------------+    |
|  | Cloudflare/Akamai | DNS Protection | CDN Shield          |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Layer 3: WAN Edge On-Box                                         |
|  +----------------------------------------------------------+    |
|  | Rate Limiting | CoPP | TCP Intercept | Zone Firewall     |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Layer 4: Application Protection                                  |
|  +----------------------------------------------------------+    |
|  | WAF | Bot Protection | API Rate Limiting                 |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 Attack Categories and Mitigation

| Attack Type | Examples | Primary Defense | Secondary Defense |
|-------------|----------|-----------------|-------------------|
| Volumetric | UDP flood, ICMP flood | ISP scrubbing | Cloud DDoS |
| Protocol | SYN flood, Smurf | TCP Intercept | Rate limiting |
| Application | HTTP flood, Slowloris | WAF | Connection limits |
| Amplification | DNS, NTP, SSDP | Upstream filtering | ACLs |

---

## 2. Rate Limiting and Traffic Policing

### 2.1 Rate Limiting Strategy

```
+------------------------------------------------------------------+
|                   RATE LIMITING DESIGN                            |
+------------------------------------------------------------------+
|                                                                   |
|  Interface-Based Rate Limits:                                     |
|  +----------------------------------------------------------+    |
|  | Interface          | Inbound Limit | Outbound Limit      |    |
|  +----------------------------------------------------------+    |
|  | DIA (Internet)     | 100% BW       | 100% BW (shaped)    |    |
|  | MPLS               | 100% BW       | 100% BW             |    |
|  | Guest VPN          | 50 Mbps/user  | 50 Mbps/user        |    |
|  | IoT VPN            | 10 Mbps/device| 1 Mbps/device       |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Protocol-Based Rate Limits:                                      |
|  +----------------------------------------------------------+    |
|  | Protocol           | Limit         | Action               |    |
|  +----------------------------------------------------------+    |
|  | ICMP               | 100 pps       | Drop excess          |    |
|  | UDP (non-DNS)      | 10 Mbps       | Police               |    |
|  | DNS                | 1000 qps      | Rate limit           |    |
|  | TCP SYN            | 5000 pps      | SYN cookies          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 Rate Limiting Configuration

```
! Interface Rate Limiting - DIA
interface GigabitEthernet0/0/1
 description "DIA - Internet"
 rate-limit input 1000000000 500000000 1000000 conform-action transmit exceed-action drop
 service-policy output QOS-EGRESS-POLICY
!

! Protocol Rate Limiting with ACL
ip access-list extended ICMP-RATE-LIMIT
 permit icmp any any

class-map match-all CM-ICMP
 match access-group name ICMP-RATE-LIMIT

policy-map PM-INTERFACE-RATE-LIMIT
 class CM-ICMP
  police rate 100 pps burst 50 packets
   conform-action transmit
   exceed-action drop
 class class-default
  fair-queue
!

! Apply to DIA interface
interface GigabitEthernet0/0/1
 service-policy input PM-INTERFACE-RATE-LIMIT
!
```

### 2.3 Per-Source Rate Limiting

```
! Per-Source Connection Rate Limiting
parameter-map type inspect DDOS-PROTECTION
 max-incomplete low 500
 max-incomplete high 1000
 one-minute low 300
 one-minute high 500
 tcp max-incomplete host 50 block-time 60
 tcp synwait-time 15
 
! Apply to zone pair
zone-pair security ZP-INTERNET-TO-VPN source INTERNET-ZONE destination VPN-ZONE
 parameter-map type inspect DDOS-PROTECTION
!
```

---

## 3. Control Plane Protection (CoPP)

### 3.1 Control Plane Architecture

```
+------------------------------------------------------------------+
|                 CONTROL PLANE PROTECTION                          |
+------------------------------------------------------------------+
|                                                                   |
|                        WAN Edge Router                            |
|  +-------------------------------------------------------------+ |
|  |                                                              | |
|  |  Data Plane                        Control Plane             | |
|  |  +------------------+              +------------------+      | |
|  |  | Traffic Forward  |              | Route Processor  |      | |
|  |  | Line Rate        |              | Protected        |      | |
|  |  +--------+---------+              +--------+---------+      | |
|  |           |                                 ^                 | |
|  |           |                                 |                 | |
|  |           |     +------------------+        |                 | |
|  |           +---->| CoPP Policy      |--------+                 | |
|  |                 | - Rate Limit     |                          | |
|  |                 | - Classify       |                          | |
|  |                 | - Police         |                          | |
|  |                 +------------------+                          | |
|  |                                                              | |
|  +-------------------------------------------------------------+ |
|                                                                   |
|  Traffic Classes:                                                 |
|  - Critical: BGP, OSPF, BFD, LDP                                 |
|  - Important: SSH, SNMP, NTP, TACACS                            |
|  - Normal: ICMP, Telnet                                          |
|  - Undesirable: Everything else                                  |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 CoPP Configuration

```
! Class Maps for Control Plane Traffic
class-map match-any CM-CRITICAL
 match access-group name ACL-BGP
 match access-group name ACL-OSPF
 match access-group name ACL-BFD

class-map match-any CM-IMPORTANT
 match access-group name ACL-SSH
 match access-group name ACL-SNMP
 match access-group name ACL-TACACS
 match access-group name ACL-NTP

class-map match-any CM-NORMAL
 match access-group name ACL-ICMP
 match access-group name ACL-DTLS

class-map match-any CM-UNDESIRABLE
 match access-group name ACL-FRAGMENTS
 match access-group name ACL-TELNET

! ACLs for Classification
ip access-list extended ACL-BGP
 permit tcp any any eq bgp
 permit tcp any eq bgp any

ip access-list extended ACL-SSH
 permit tcp any any eq 22
 permit tcp any eq 22 any

ip access-list extended ACL-ICMP
 permit icmp any any echo
 permit icmp any any echo-reply
 permit icmp any any unreachable
 permit icmp any any ttl-exceeded

! CoPP Policy Map
policy-map PM-COPP
 class CM-CRITICAL
  police rate 50000 pps burst 10000 packets
   conform-action transmit
   exceed-action transmit
 class CM-IMPORTANT
  police rate 5000 pps burst 1000 packets
   conform-action transmit
   exceed-action drop
 class CM-NORMAL
  police rate 1000 pps burst 500 packets
   conform-action transmit
   exceed-action drop
 class CM-UNDESIRABLE
  police rate 100 pps burst 50 packets
   conform-action drop
   exceed-action drop
 class class-default
  police rate 500 pps burst 250 packets
   conform-action transmit
   exceed-action drop
!

! Apply CoPP
control-plane
 service-policy input PM-COPP
!
```

---

## 4. TCP SYN Flood Protection

### 4.1 TCP Intercept

```
+------------------------------------------------------------------+
|                   TCP SYN FLOOD PROTECTION                        |
+------------------------------------------------------------------+
|                                                                   |
|  Normal Connection:                                               |
|  Client          WAN Edge           Server                        |
|    |--- SYN ------->|                  |                          |
|    |                |--- SYN --------->|                          |
|    |                |<-- SYN-ACK ------|                          |
|    |<-- SYN-ACK ----|                  |                          |
|    |--- ACK ------->|                  |                          |
|    |                |--- ACK --------->|                          |
|                                                                   |
|  Under Attack (Watch Mode):                                       |
|  Client          WAN Edge           Server                        |
|    |--- SYN ------->|--- SYN --------->|                          |
|    |                | [Monitor Rate]    |                          |
|    |                | If rate > threshold, switch to intercept   |
|                                                                   |
|  Under Attack (Intercept Mode):                                   |
|  Client          WAN Edge           Server                        |
|    |--- SYN ------->| [SYN Cookie]     |                          |
|    |<-- SYN-ACK ----| [Validate First] |                          |
|    |--- ACK ------->|                  |                          |
|    |                |--- SYN --------->|                          |
|    |                |<-- SYN-ACK ------|                          |
|    |                |--- ACK --------->|                          |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.2 TCP Intercept Configuration

```
! TCP Intercept - Watch Mode (Default)
ip tcp intercept list ACL-TCP-PROTECT
ip tcp intercept mode watch
ip tcp intercept watch-timeout 15
ip tcp intercept connection-timeout 60

! Aggressive Settings Under Attack
ip tcp intercept max-incomplete low 1000
ip tcp intercept max-incomplete high 1500
ip tcp intercept one-minute low 500
ip tcp intercept one-minute high 750

! ACL for Protected Servers
ip access-list extended ACL-TCP-PROTECT
 permit tcp any host 172.16.10.100 eq 80
 permit tcp any host 172.16.10.100 eq 443
 permit tcp any host 172.16.10.101 eq 80
 permit tcp any host 172.16.10.101 eq 443
!

! SYN Cookie Configuration (Alternative)
ip tcp synwait-time 10
```

---

## 5. Amplification Attack Prevention

### 5.1 Common Amplification Vectors

| Protocol | Port | Amplification Factor | Mitigation |
|----------|------|----------------------|------------|
| DNS | 53 | 28-54x | Response rate limiting |
| NTP | 123 | 556x | Disable monlist |
| SSDP | 1900 | 30x | Block at perimeter |
| Memcached | 11211 | 50,000x | Block at perimeter |
| CLDAP | 389 | 56-70x | Block at perimeter |

### 5.2 Amplification Prevention Configuration

```
! Block Amplification Vectors at Internet Edge
ip access-list extended ACL-BLOCK-AMPLIFICATION
 ! Block inbound amplification protocols
 deny udp any any eq 1900 log     ! SSDP
 deny udp any any eq 11211 log    ! Memcached
 deny tcp any any eq 11211 log    ! Memcached
 deny udp any any eq 389 log      ! CLDAP
 
 ! Rate limit DNS responses
 permit udp any eq 53 any
 permit tcp any eq 53 any
 
 ! Rate limit NTP
 permit udp any eq 123 any
 
 ! Allow everything else
 permit ip any any

! Apply to Internet interface
interface GigabitEthernet0/0/1
 ip access-group ACL-BLOCK-AMPLIFICATION in
!

! DNS Response Rate Limiting (if DNS server)
ip dns server
 rate-limit 100
!
```

---

## 6. Upstream DDoS Mitigation

### 6.1 ISP Scrubbing Services

```
+------------------------------------------------------------------+
|                   ISP SCRUBBING SERVICE                           |
+------------------------------------------------------------------+
|                                                                   |
|  Normal Traffic Flow:                                             |
|  Internet --> ISP --> WAN Edge --> Internal Network               |
|                                                                   |
|  Under Attack (Scrubbing Activated):                              |
|  Internet --> ISP Scrubbing Center --> Clean Traffic --> WAN Edge |
|                    |                                              |
|                    v                                              |
|              Attack Traffic                                       |
|                 (Dropped)                                         |
|                                                                   |
|  Activation Methods:                                              |
|  +----------------------------------------------------------+    |
|  | Method              | Time to Activate | Use Case         |   |
|  +----------------------------------------------------------+    |
|  | Always-On           | 0 minutes        | Critical sites   |   |
|  | On-Demand (Manual)  | 5-15 minutes     | Cost savings     |   |
|  | On-Demand (Auto)    | 2-5 minutes      | Balanced         |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 BGP Blackhole Routing

```
! BGP Blackhole Community
router bgp 65100
 ! Configure blackhole next-hop
 neighbor ISP-PEER remote-as 65000
 neighbor ISP-PEER description "ISP for Blackhole"
 
 ! Blackhole route-map
 route-map BLACKHOLE permit 10
  set community 65000:666
  set ip next-hop 192.0.2.1
!

! Trigger blackhole for specific prefix under attack
ip route 198.51.100.10 255.255.255.255 Null0 tag 666
route-map BLACKHOLE-TRIGGER permit 10
 match tag 666
 set community 65000:666

! Advertise to ISP
router bgp 65100
 redistribute static route-map BLACKHOLE-TRIGGER
!
```

---

## 7. Monitoring and Detection

### 7.1 DDoS Detection Metrics

```
+------------------------------------------------------------------+
|                   DDoS DETECTION DASHBOARD                        |
+------------------------------------------------------------------+
|                                                                   |
|  Real-Time Metrics:                                               |
|  +----------------------------------------------------------+    |
|  | Metric                    | Current   | Threshold | Status|   |
|  +----------------------------------------------------------+    |
|  | Inbound Traffic           | 450 Mbps  | 800 Mbps  | OK    |   |
|  | Packets per Second        | 125,000   | 500,000   | OK    |   |
|  | New Connections/sec       | 2,500     | 10,000    | OK    |   |
|  | SYN Packets/sec           | 1,200     | 5,000     | OK    |   |
|  | UDP Packets/sec           | 45,000    | 100,000   | OK    |   |
|  | ICMP Packets/sec          | 50        | 500       | OK    |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Alert Conditions:                                                |
|  - Traffic > 80% of circuit capacity                             |
|  - SYN rate > 5,000/sec sustained 60 seconds                     |
|  - Single source > 1,000 connections                             |
|  - CoPP drops > 1,000/sec                                        |
|                                                                   |
+------------------------------------------------------------------+
```

### 7.2 Detection Configuration

```
! NetFlow for Traffic Analysis
flow record DDOS-DETECTION
 match ipv4 source address
 match ipv4 destination address
 match ipv4 protocol
 match transport source-port
 match transport destination-port
 collect counter bytes
 collect counter packets
 collect timestamp sys-uptime first
 collect timestamp sys-uptime last

flow exporter NETFLOW-EXPORT
 destination 10.254.1.60
 transport udp 2055
 source Loopback0

flow monitor DDOS-MONITOR
 record DDOS-DETECTION
 exporter NETFLOW-EXPORT
 cache timeout active 60

interface GigabitEthernet0/0/1
 ip flow monitor DDOS-MONITOR input
!

! SNMP Traps for Thresholds
snmp-server enable traps
snmp-server host 10.254.1.50 version 2c ABHAV-SNMP
!
```

---

## 8. Response Procedures

### 8.1 DDoS Response Playbook

```
+------------------------------------------------------------------+
|                   DDoS RESPONSE PLAYBOOK                          |
+------------------------------------------------------------------+
|                                                                   |
|  Phase 1: Detection (0-5 minutes)                                 |
|  +----------------------------------------------------------+    |
|  | 1. Alert triggered by monitoring system                   |    |
|  | 2. NOC validates attack (not false positive)              |    |
|  | 3. Classify attack type (volumetric/protocol/app)         |    |
|  | 4. Identify target (IP, service, site)                    |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Phase 2: Triage (5-15 minutes)                                   |
|  +----------------------------------------------------------+    |
|  | 1. Engage security team                                   |    |
|  | 2. Activate on-box mitigations                            |    |
|  | 3. Contact ISP if volumetric attack                       |    |
|  | 4. Document attack characteristics                        |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Phase 3: Mitigation (15-60 minutes)                              |
|  +----------------------------------------------------------+    |
|  | 1. Apply targeted ACLs                                    |    |
|  | 2. Activate ISP scrubbing if needed                       |    |
|  | 3. Implement blackhole routing if necessary               |    |
|  | 4. Monitor effectiveness                                  |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Phase 4: Recovery (Post-attack)                                  |
|  +----------------------------------------------------------+    |
|  | 1. Verify service restoration                             |    |
|  | 2. Remove temporary mitigations                           |    |
|  | 3. Conduct post-mortem analysis                           |    |
|  | 4. Update defenses based on lessons learned               |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 9. Best Practices Summary

### 9.1 Prevention Best Practices

- Implement defense in depth (ISP, cloud, on-box)
- Enable CoPP on all WAN Edge routers
- Rate limit all non-essential protocols
- Block known amplification vectors

### 9.2 Detection Best Practices

- Monitor traffic baselines continuously
- Set appropriate thresholds for alerts
- Use NetFlow for traffic analysis
- Integrate with SIEM for correlation

### 9.3 Response Best Practices

- Document response procedures
- Test mitigation capabilities regularly
- Maintain ISP contact information
- Practice response drills quarterly

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco DDoS Protection Guide | Official DDoS documentation | cisco.com |
| NIST SP 800-61 | Incident Response Guide | nist.gov |
| Abhavtech Incident Response | Internal IR procedures | SharePoint |
| ISP Service Agreement | Scrubbing service details | Legal |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.9*
