# Network Architecture

## 1. Overview

This document defines the network architecture supporting the Avaya to Webex Contact Center migration. It covers connectivity models, network topology, Quality of Service (QoS) implementation, security boundaries, and hybrid on-premises-to-cloud integration patterns.

**Key Objectives:**
- Ensure reliable, low-latency connectivity to Webex cloud services
- Implement QoS to prioritize voice/video traffic
- Maintain security boundaries while enabling cloud integration
- Support hybrid architecture with on-premises SBC/CUBE and cloud contact center

---

## 2. Network Topology Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEBEX CONTACT CENTER CLOUD                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Webex CC   │  │  Webex Call  │  │   Identity   │         │
│  │   Platform   │  │   Platform   │  │   (SSO/MFA)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                 │                  │                   │
└─────────┼─────────────────┼──────────────────┼───────────────────┘
          │                 │                  │
          │ TLS/HTTPS       │ SIP/SRTP         │ HTTPS
          │                 │                  │
┌─────────┼─────────────────┼──────────────────┼───────────────────┐
│         │                 │                  │                   │
│    ┌────▼────┐       ┌────▼────┐       ┌────▼────┐             │
│    │ Firewall│       │ Firewall│       │ Firewall│             │
│    │  (FW1)  │       │  (FW2)  │       │  (FW3)  │             │
│    └────┬────┘       └────┬────┘       └────┬────┘             │
│         │                 │                  │                   │
│    ┌────▼──────────────────▼──────────────────▼────┐            │
│    │         DMZ Network (203.0.113.0/24)          │            │
│    │  ┌──────────────┐      ┌──────────────┐      │            │
│    │  │CUBE Primary  │      │CUBE Secondary│      │            │
│    │  │10.50.1.10    │      │10.50.1.11    │      │            │
│    │  │(Public: .110)│      │(Public: .111)│      │            │
│    │  └──────────────┘      └──────────────┘      │            │
│    └─────────────────────────────────────────────────┘           │
│         │                                                        │
│    ┌────▼───────────────────────────────────────────┐           │
│    │       Internal Firewall (FW-INT)               │           │
│    └────┬───────────────────────────────────────────┘           │
│         │                                                        │
│    ┌────▼─────────────────────────────────────────────┐         │
│    │          CORE NETWORK (10.0.0.0/8)               │         │
│    │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │         │
│    │  │   CUCM   │  │ Agents   │  │  Admins  │      │         │
│    │  │ Cluster  │  │ Subnets  │  │ Desktops │      │         │
│    │  └──────────┘  └──────────┘  └──────────┘      │         │
│    └──────────────────────────────────────────────────┘         │
│                                                                  │
│  ON-PREMISES DATA CENTER                                        │
└──────────────────────────────────────────────────────────────────┘
          │
     ┌────▼────┐
     │  PSTN   │
     │ Carrier │
     │ (SIP)   │
     └─────────┘
```

---

## 3. Connectivity Models

### 3.1 Internet Connectivity (Primary)

**Architecture:**
- Dual ISP circuits for redundancy
- Active-active configuration with BGP routing
- Direct internet access (DIA) circuits dedicated to contact center traffic

**Specifications:**

| Parameter | Value |
|-----------|-------|
| Primary ISP | ISP-A (Carrier: AT&T) |
| Secondary ISP | ISP-B (Carrier: Verizon) |
| Bandwidth per circuit | 500 Mbps symmetrical |
| Redundancy model | Active-Active (load balanced) |
| Routing protocol | BGP (AS 65001) |
| Failover time | <30 seconds |
| Public IP allocation | /28 (16 IPs) per circuit |

**Internet Circuit Capacity Planning:**

```
Voice codec: G.711 @ 87.2 kbps per call (including IP overhead)
Video codec: 720p @ 1.5 Mbps per session

Peak concurrent calls: 1,000
Peak concurrent video sessions: 50

Required bandwidth (voice): 1,000 × 87.2 kbps = 87.2 Mbps
Required bandwidth (video): 50 × 1.5 Mbps = 75 Mbps
Agent desktop traffic (HTTPS): 1,000 agents × 0.5 Mbps = 500 Mbps
Management/monitoring traffic: 20 Mbps
─────────────────────────────────────────────────────────────
Total required: ~680 Mbps
Available (dual circuits): 1,000 Mbps
Headroom: 32% ✅
```

---

### 3.2 ExpressRoute / Direct Connect (Optional)

**Purpose:** Private connectivity to Webex cloud for enhanced security and performance.

**Architecture:**

```
┌──────────────────┐
│ Webex Cloud      │
│ (US-East Region) │
└────────┬─────────┘
         │
    ┌────▼────┐
    │  Cisco  │
    │  Cloud  │
    │ Gateway │
    └────┬────┘
         │ ExpressRoute
         │ (Private Peering)
         │
┌────────▼─────────┐
│  MSEE (Microsoft │
│  Enterprise Edge)│
└────────┬─────────┘
         │
    ┌────▼────┐
    │  Edge   │
    │ Router  │
    │ (ER-01) │
    └────┬────┘
         │
┌────────▼─────────┐
│ On-Prem Network  │
└──────────────────┘
```

**Specifications:**

| Parameter | Value |
|-----------|-------|
| Connection type | Azure ExpressRoute (if Azure-hosted) |
| Bandwidth | 1 Gbps |
| SLA | 99.95% uptime |
| Latency | <10ms to Webex cloud |
| Routing | BGP with route filtering |

**Use Case:**
- Enhanced security (no public internet traversal)
- Predictable latency and jitter
- Higher SLA for mission-critical contact center
- **Recommended for enterprise deployments with >500 agents**

**Decision Criteria:**

| Requirement | Internet (DIA) | ExpressRoute |
|-------------|----------------|--------------|
| Cost | Lower | Higher ($1,500-3,000/month) |
| Setup time | 2-4 weeks | 6-8 weeks |
| Latency | 30-50ms | <10ms |
| Security | Public internet (encrypted) | Private peering |
| **Recommendation** | **Small/Medium (<500 agents)** | **Large (>500 agents)** |

---

## 4. Network Segmentation and VLANs

### 4.1 VLAN Design

| VLAN ID | Name | Subnet | Purpose | Gateway |
|---------|------|--------|---------|---------|
| 10 | MGMT-NETWORK | 10.10.10.0/24 | Management (CUBE, CUCM admin) | 10.10.10.1 |
| 20 | VOICE-NETWORK | 10.20.0.0/16 | IP phones (agent endpoints) | 10.20.0.1 |
| 30 | DATA-NETWORK | 10.30.0.0/16 | Agent desktops (PCs) | 10.30.0.1 |
| 50 | DMZ-NETWORK | 10.50.1.0/24 | CUBE/SBC (internal interface) | 10.50.1.1 |
| 100 | GUEST-NETWORK | 192.168.100.0/24 | Guest WiFi (isolated) | 192.168.100.1 |

---

### 4.2 Access Control Lists (ACLs)

**VLAN 20 (Voice) → Internet (Webex):**
```
permit tcp any host wxcc-us1.webex.com eq 443
permit tcp any host *.ciscospark.com eq 443
permit udp any 8.0.0.0 0.255.255.255 range 8000 48199
deny ip any any log
```

**VLAN 30 (Data) → Internet (Webex):**
```
permit tcp any any eq 443
permit tcp any any eq 80
permit udp any any eq 53
deny ip any any log
```

**VLAN 50 (DMZ) → Webex Cloud:**
```
permit tcp host 10.50.1.10 host wxcc-us1.webex.com eq 5061
permit tcp host 10.50.1.11 host wxcc-us1.webex.com eq 5061
permit udp host 10.50.1.10 8.0.0.0 0.255.255.255 range 8000 48199
permit udp host 10.50.1.11 8.0.0.0 0.255.255.255 range 8000 48199
deny ip any any log
```

---

## 5. Quality of Service (QoS)

### 5.1 QoS Strategy

**Objective:** Ensure voice and video traffic receives priority treatment to prevent packet loss, jitter, and latency.

**Classification Method:**
- DSCP marking at the source (CUBE, agent endpoints)
- Layer 3 QoS policies on routers and switches
- Trust boundaries at distribution layer

---

### 5.2 DSCP Marking Standards

| Traffic Type | DSCP Value | Decimal | Binary | Queue Priority |
|--------------|------------|---------|--------|----------------|
| **Voice (RTP)** | EF (Expedited Forwarding) | 46 | 101110 | Highest (P1) |
| **Video (RTP)** | AF41 (Assured Forwarding) | 34 | 100010 | High (P2) |
| **SIP Signaling** | CS3 (Class Selector 3) | 24 | 011000 | Medium (P3) |
| **Agent Desktop (HTTPS)** | AF21 | 18 | 010010 | Medium-Low (P4) |
| **Best Effort (Internet)** | 0 (Default) | 0 | 000000 | Low (P5) |

---

### 5.3 QoS Configuration Examples

#### Cisco Switch (Access Layer) - Trust DSCP

```cisco-ios
! Trust DSCP from IP phones (CDP-enabled devices)
mls qos trust dscp

! Priority queue for voice
priority-queue out

! Egress queuing on uplinks
interface GigabitEthernet1/0/1
 description Uplink to Core
 mls qos trust dscp
 srr-queue bandwidth share 10 20 30 40
 priority-queue out
```

#### Cisco Router (WAN Edge) - QoS Policy

```cisco-ios
! Class-map definitions
class-map match-any VOICE-RTP
 match dscp ef

class-map match-any VIDEO-RTP
 match dscp af41

class-map match-any SIP-SIGNALING
 match dscp cs3

class-map match-any AGENT-DESKTOP
 match dscp af21

! Policy-map for outbound traffic shaping
policy-map WAN-OUTBOUND-QOS
 class VOICE-RTP
  priority percent 40
  set dscp ef
 class VIDEO-RTP
  bandwidth percent 20
  set dscp af41
 class SIP-SIGNALING
  bandwidth percent 10
  set dscp cs3
 class AGENT-DESKTOP
  bandwidth percent 20
  set dscp af21
 class class-default
  bandwidth percent 10
  random-detect dscp-based

! Apply to WAN interface
interface GigabitEthernet0/0/0
 description WAN to ISP
 service-policy output WAN-OUTBOUND-QOS
```

---

### 5.4 CUBE DSCP Marking

```cisco-ios
voice service voip
 ip address trusted list
  ipv4 0.0.0.0 0.0.0.0
 media statistics
 media bulk-stats
 allow-connections sip to sip
 sip
  asymmetric payload full

! Mark outbound RTP with DSCP EF
dial-peer voice 100 voip
 description Outbound to Webex Contact Center
 session protocol sipv2
 session target dns:wxcc-us1.webex.com
 voice-class codec 1
 voice-class sip dscp ef media
 voice-class sip dscp cs3 signaling
 dtmf-relay rtp-nte
 no vad
```

---

## 6. Security Architecture

### 6.1 Firewall Topology

**Three-Tier Firewall Model:**

1. **External Firewall (FW1):** Internet edge, protects DMZ
2. **DMZ Firewall (FW2):** Between DMZ and internal network
3. **Internal Firewall (FW3):** Segments internal VLANs

```
Internet ←→ [FW1] ←→ DMZ (CUBE) ←→ [FW2] ←→ Internal Network
```

---

### 6.2 Firewall Rules Summary

**FW1 (External) - Inbound:**

| Source | Destination | Port | Action | Purpose |
|--------|-------------|------|--------|---------|
| Carrier SIP trunk IPs | CUBE public IP | TCP/5060 | Permit | Inbound SIP |
| Carrier SIP trunk IPs | CUBE public IP | TCP/5061 | Permit | Inbound SIP (TLS) |
| Carrier SIP trunk IPs | CUBE public IP | UDP/8000-48199 | Permit | Inbound RTP |
| Any | CUBE public IP | Any | Deny | Block unsolicited |

**FW1 (External) - Outbound:**

| Source | Destination | Port | Action | Purpose |
|--------|-------------|------|--------|---------|
| CUBE private IP | *.webex.com | TCP/5061 | Permit | SIP to Webex (TLS) |
| CUBE private IP | Webex media ranges | UDP/8000-48199 | Permit | RTP to Webex |
| Agent subnets | *.webex.com | TCP/443 | Permit | Agent desktop |
| Agent subnets | identity.webex.com | TCP/443 | Permit | SSO authentication |

**FW2 (DMZ to Internal):**

| Source | Destination | Port | Action | Purpose |
|--------|-------------|------|--------|---------|
| CUBE DMZ | CUCM cluster | TCP/5060 | Permit | SIP to CUCM |
| CUBE DMZ | CUCM cluster | UDP/8000-48199 | Permit | RTP to CUCM |
| CUBE DMZ | NTP servers | UDP/123 | Permit | Time sync |
| CUBE DMZ | DNS servers | UDP/53 | Permit | Name resolution |
| CUBE DMZ | Syslog server | UDP/514 | Permit | Logging |

---

### 6.3 NAT Configuration

**Static NAT for CUBE:**

| Internal IP | Public IP | Protocol | Purpose |
|-------------|-----------|----------|---------|
| 10.50.1.10 | 203.0.113.110 | All | CUBE Primary |
| 10.50.1.11 | 203.0.113.111 | All | CUBE Secondary |

**NAT Configuration Example (Cisco ASA):**

```cisco-asa
! Static NAT for CUBE primary
object network CUBE-PRIMARY
 host 10.50.1.10
 nat (dmz,outside) static 203.0.113.110

! Static NAT for CUBE secondary
object network CUBE-SECONDARY
 host 10.50.1.11
 nat (dmz,outside) static 203.0.113.111

! ACL to permit inbound SIP from carrier
access-list OUTSIDE-IN extended permit tcp host 198.51.100.10 host 203.0.113.110 eq 5060
access-list OUTSIDE-IN extended permit udp host 198.51.100.10 host 203.0.113.110 range 8000 48199
access-group OUTSIDE-IN in interface outside
```

---

## 7. TLS and Encryption

### 7.1 TLS Requirements

**Webex Contact Center TLS Policy:**
- **Minimum TLS version:** TLS 1.2
- **Cipher suites:** AES-256-GCM, AES-128-GCM (no 3DES, RC4)
- **Certificate validation:** Mutual TLS (mTLS) for SIP trunks

---

### 7.2 Certificate Management

**CUBE TLS Certificate:**

```
Subject: CN=cube-primary.yourcompany.com
Subject Alternative Names:
  DNS: cube-primary.yourcompany.com
  DNS: cube-secondary.yourcompany.com
  IP: 203.0.113.110
  IP: 203.0.113.111
Issuer: DigiCert SHA2 Secure Server CA
Validity: 2 years
Key Algorithm: RSA 2048-bit
Signature Algorithm: SHA-256
```

**CUBE Certificate Installation:**

```cisco-ios
! Import CA certificate
crypto pki trustpoint WEBEX-CA
 enrollment terminal
 revocation-check none
 
crypto pki authenticate WEBEX-CA
[Paste DigiCert root CA certificate]

! Import CUBE certificate
crypto pki trustpoint CUBE-CERT
 enrollment terminal
 subject-name CN=cube-primary.yourcompany.com
 revocation-check none
 
crypto pki authenticate CUBE-CERT
[Paste intermediate CA]

crypto pki import CUBE-CERT certificate
[Paste CUBE certificate and private key]
```

---

### 7.3 SRTP Configuration

**Media Encryption:**

```cisco-ios
voice service voip
 sip
  crypto signaling default trustpoint CUBE-CERT

dial-peer voice 100 voip
 session protocol sipv2
 session target dns:wxcc-us1.webex.com
 srtp
```

---

## 8. Network Monitoring and Observability

### 8.1 Monitoring Tools

| Tool | Purpose | Metrics Collected |
|------|---------|-------------------|
| **SNMP (NetFlow)** | Bandwidth utilization | Traffic volume, top talkers |
| **SolarWinds / PRTG** | Network performance | Link utilization, latency, packet loss |
| **Cisco Prime** | Infrastructure health | Device status, interface errors |
| **Thousand Eyes** | Internet path monitoring | Webex cloud reachability, hop-by-hop latency |
| **Splunk / ELK** | Log aggregation | Firewall logs, CUBE syslog |

---

### 8.2 Key Performance Indicators (KPIs)

| Metric | Target | Warning Threshold | Critical Threshold |
|--------|--------|-------------------|-------------------|
| **Latency (RTT to Webex)** | <30ms | >50ms | >100ms |
| **Packet Loss** | 0% | >0.5% | >1% |
| **Jitter** | <10ms | >20ms | >50ms |
| **Link Utilization** | <70% | >80% | >90% |
| **Firewall Session Count** | <500K | >750K | >900K |

---

### 8.3 NetFlow Configuration

**Cisco Router NetFlow Export:**

```cisco-ios
! NetFlow version 9 export
flow exporter NETFLOW-EXPORT
 destination 10.10.10.50
 transport udp 2055
 template data timeout 60

flow monitor NETFLOW-MONITOR
 exporter NETFLOW-EXPORT
 cache timeout active 60
 record netflow ipv4 original-input

! Apply to WAN interface
interface GigabitEthernet0/0/0
 ip flow monitor NETFLOW-MONITOR input
 ip flow monitor NETFLOW-MONITOR output
```

---

## 9. Disaster Recovery and Failover

### 9.1 Internet Circuit Failover

**Scenario:** Primary ISP circuit fails.

**Automatic Failover via BGP:**

```cisco-ios
router bgp 65001
 bgp log-neighbor-changes
 neighbor 203.0.113.1 remote-as 65100
 neighbor 203.0.113.1 description ISP-A
 neighbor 203.0.114.1 remote-as 65200
 neighbor 203.0.114.1 description ISP-B
 !
 address-family ipv4
  network 203.0.113.0 mask 255.255.255.0
  neighbor 203.0.113.1 activate
  neighbor 203.0.113.1 weight 200
  neighbor 203.0.114.1 activate
  neighbor 203.0.114.1 weight 100
 exit-address-family
```

**Expected Behavior:**
- Traffic prefers ISP-A (higher weight)
- Automatic failover to ISP-B if ISP-A BGP session drops
- Convergence time: <30 seconds

---

### 9.2 CUBE High Availability

**Active-Standby Configuration:**

```
┌──────────────┐         ┌──────────────┐
│CUBE Primary  │ HSRP    │CUBE Secondary│
│10.50.1.10    │◄───────►│10.50.1.11    │
│Priority 110  │         │Priority 100  │
└──────────────┘         └──────────────┘
       │                        │
       └────────┬───────────────┘
           HSRP VIP: 10.50.1.1
```

**HSRP Configuration:**

```cisco-ios
! CUBE Primary
interface GigabitEthernet0/0/1
 ip address 10.50.1.10 255.255.255.0
 standby 1 ip 10.50.1.1
 standby 1 priority 110
 standby 1 preempt
 standby 1 track 10 decrement 20

track 10 ip sla 1 reachability

ip sla 1
 icmp-echo 8.8.8.8 source-ip 10.50.1.10
 frequency 10
ip sla schedule 1 life forever start-time now
```

---

## 10. Home Agent Network Considerations

### 10.1 Home Office Network Requirements

**Minimum Requirements per Agent:**

| Parameter | Minimum | Recommended |
|-----------|---------|-------------|
| Download bandwidth | 5 Mbps | 10 Mbps |
| Upload bandwidth | 3 Mbps | 5 Mbps |
| Latency to Webex cloud | <100ms | <50ms |
| Jitter | <30ms | <10ms |
| Packet loss | <1% | <0.5% |

---

### 10.2 VPN vs Direct Internet

**Option 1: VPN to Corporate Network**

**Pros:**
- Centralized security control
- Access to internal resources (CUCM, CRM)

**Cons:**
- Increased latency (hairpin routing)
- VPN capacity constraints
- Complex troubleshooting

**Option 2: Split-Tunnel VPN (Webex Direct)**

**Pros:**
- Webex traffic bypasses VPN (direct to cloud)
- Lower latency
- Reduced VPN bandwidth consumption

**Cons:**
- Requires firewall rules on home routers
- Less centralized control

**Option 3: No VPN (Direct Internet)**

**Pros:**
- Lowest latency
- Simplest configuration

**Cons:**
- No access to internal corporate resources
- Requires separate authentication (SSO/MFA)

**Recommendation:** Split-tunnel VPN for Webex traffic, full-tunnel for CRM/internal apps.

---

### 10.3 Split-Tunnel VPN Configuration (Cisco AnyConnect)

```xml
<!-- AnyConnect profile: exclude Webex traffic from VPN -->
<ExcludePublicSubnet>*.webex.com</ExcludePublicSubnet>
<ExcludePublicSubnet>*.ciscospark.com</ExcludePublicSubnet>
<ExcludePublicSubnet>*.wbx2.com</ExcludePublicSubnet>
```

---

## 11. Capacity Planning and Scaling

### 11.1 Network Capacity Growth Plan

| Year | Agents | Peak Calls | Required Bandwidth | Planned Bandwidth |
|------|--------|------------|-------------------|-------------------|
| 2025 (current) | 1,000 | 1,000 | 680 Mbps | 1,000 Mbps ✅ |
| 2026 | 1,200 | 1,200 | 816 Mbps | 1,000 Mbps ✅ |
| 2027 | 1,500 | 1,500 | 1,020 Mbps | 2,000 Mbps (upgrade) |

**Trigger for Circuit Upgrade:**
- Link utilization consistently >70% during business hours
- 6-month lead time for circuit provisioning

---

## 12. Network Testing and Validation

### 12.1 Pre-Migration Network Tests

| Test | Tool | Target | Pass Criteria |
|------|------|--------|---------------|
| Bandwidth test | iPerf3 | Webex cloud | >500 Mbps sustained |
| Latency test | Ping | wxcc-us1.webex.com | <30ms average |
| Jitter test | iPerf3 | Webex cloud | <10ms |
| Packet loss test | iPerf3 | Webex cloud | <0.1% |
| DNS resolution | nslookup | *.webex.com | <50ms |
| Firewall rule validation | Test call | CUBE → Webex | Call completes |
| QoS verification | Packet capture | DSCP EF marked | 100% marked |

---

### 12.2 Test Commands

**Bandwidth Test (iPerf3):**

```bash
# Server (on a host near Webex cloud, if possible)
iperf3 -s

# Client (from on-premises)
iperf3 -c <webex-test-server> -t 60 -P 10
```

**Latency and Jitter Test:**

```bash
ping -c 1000 wxcc-us1.webex.com | awk '/rtt/ {print $4}'
```

**Packet Loss Test:**

```bash
ping -c 1000 wxcc-us1.webex.com | grep 'packet loss'
```

---

## 13. Troubleshooting and Common Issues

### 13.1 Common Network Issues

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| **One-way audio** | Firewall blocking RTP return path | Check firewall rules for UDP 8000-48199 |
| **Choppy audio** | Packet loss or jitter | Verify QoS, check link utilization |
| **Call setup delay** | DNS resolution slow | Check DNS server response time |
| **Calls fail intermittently** | NAT session timeout too low | Increase NAT timeout to 600 seconds |
| **SIP registration fails** | TLS certificate mismatch | Verify CUBE certificate SAN includes FQDN |

---

### 13.2 Diagnostic Commands

**Check CUBE SIP Registrations:**

```cisco-ios
show sip-ua register status
```

**Check RTP Statistics:**

```cisco-ios
show call active voice brief
show voice call summary
```

**Packet Capture for SIP:**

```cisco-ios
debug ccsip messages
```

**Check QoS Queuing:**

```cisco-ios
show policy-map interface GigabitEthernet0/0/0
```

---
