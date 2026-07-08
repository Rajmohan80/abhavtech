# 2.5 Transport Design

## Document Information
| Field | Value |
|-------|-------|
| Document Title | Transport Design |
| Section Number | 2.5 |
| Version | 1.0 |
| Last Updated | December 30, 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 2.5.1 Transport Strategy Overview

### Transport Philosophy

Abhavtech.com's SD-WAN transport strategy employs a multi-transport architecture that leverages diverse connectivity options to achieve optimal application performance, cost efficiency, and resilience. The design abstracts transport complexity while maintaining deterministic SLA delivery.

### Transport Selection Criteria

| Criterion | Weight | MPLS | Internet | LTE/5G | Satellite |
|-----------|--------|------|----------|--------|-----------|
| Reliability | 25% | 9/10 | 7/10 | 6/10 | 5/10 |
| Latency | 20% | 9/10 | 7/10 | 6/10 | 3/10 |
| Bandwidth Cost | 20% | 3/10 | 9/10 | 5/10 | 4/10 |
| Availability | 15% | 8/10 | 8/10 | 7/10 | 9/10 |
| Scalability | 10% | 5/10 | 9/10 | 8/10 | 6/10 |
| Deployment Speed | 10% | 4/10 | 8/10 | 9/10 | 7/10 |
| **Weighted Score** | 100% | **6.55** | **7.80** | **6.55** | **5.45** |

### Strategic Transport Decision

```
                    TRANSPORT STRATEGY DECISION MATRIX
+==============================================================================+
|                                                                              |
|   CURRENT STATE                        TARGET STATE                          |
|   +------------------+                 +------------------+                  |
|   | MPLS Only        |    =======>    | Hybrid Transport |                  |
|   | $XX,XXX/month    |                | $XX,XXX/month    |                  |
|   | Single Provider  |                | Multi-Provider   |                  |
|   | Fixed Bandwidth  |                | Elastic Scale    |                  |
|   +------------------+                 +------------------+                  |
|                                                                              |
|   MIGRATION APPROACH: Phased Transport Addition                              |
|   +----------------------------------------------------------------------+  |
|   | Phase 1: Add Internet transport (DIA) to all sites                   |  |
|   | Phase 2: Add LTE/5G backup to branches                               |  |
|   | Phase 3: Reduce MPLS to hub-only (50% reduction)                     |  |
|   | Phase 4: Final MPLS optimization (retain critical paths only)        |  |
|   +----------------------------------------------------------------------+  |
|                                                                              |
+==============================================================================+
```

---

## 2.5.2 Transport Types and Characteristics

### Primary Transport: MPLS (Retained for Critical Paths)

| Parameter | Hub Sites | Branch Sites |
|-----------|-----------|--------------|
| Bandwidth | 100-500 Mbps | 50-100 Mbps |
| SLA Guarantee | 99.99% | 99.95% |
| Latency (intra-region) | <10ms | <15ms |
| Jitter | <2ms | <5ms |
| Packet Loss | <0.1% | <0.5% |
| QoS Classes | 6 | 4 |
| Cost per Mbps | $XXX-XXX | $XXX-XXX |

**MPLS Retention Strategy:**
- Mumbai DC ↔ Chennai DR: Retained (critical replication)
- Hub-to-Hub interconnects: Evaluate based on traffic patterns
- Branch sites: Migrate to Internet primary + LTE backup

### Secondary Transport: Business Internet (DIA)

| Site | Provider | Bandwidth | Type | SLA | Monthly Cost |
|------|----------|-----------|------|-----|--------------|
| Mumbai DC | Tata Communications | 1 Gbps | Dedicated | 99.9% | $X,XXX |
| Chennai DR | Airtel | 1 Gbps | Dedicated | 99.9% | $X,XXX |
| London | BT | 500 Mbps | DIA | 99.9% | $X,XXX |
| Frankfurt | Deutsche Telekom | 500 Mbps | DIA | 99.9% | $X,XXX |
| New Jersey | Verizon | 500 Mbps | DIA | 99.9% | $X,XXX |
| Dallas | AT&T | 500 Mbps | DIA | 99.9% | $X,XXX |
| Bangalore | Jio Fiber | 200 Mbps | Business | 99.5% | $XXX |
| Delhi | Airtel | 200 Mbps | Business | 99.5% | $XXX |
| Noida | Tata | 100 Mbps | Business | 99.5% | $XXX |

### Tertiary Transport: Cellular (LTE/5G)

| Site | Technology | Provider | Bandwidth | Purpose |
|------|------------|----------|-----------|---------|
| Mumbai DC | 5G | Jio | Up to 1 Gbps | Disaster backup |
| Chennai DR | 5G | Airtel | Up to 500 Mbps | Disaster backup |
| Bangalore | 4G LTE | Jio | 100 Mbps | Primary backup |
| Delhi | 4G LTE | Airtel | 100 Mbps | Primary backup |
| Noida | 4G LTE | Vodafone | 50 Mbps | Primary backup |
| London | 5G | EE | 500 Mbps | Disaster backup |
| Frankfurt | 5G | Vodafone DE | 500 Mbps | Disaster backup |
| New Jersey | 5G | Verizon | 500 Mbps | Disaster backup |
| Dallas | 5G | T-Mobile | 500 Mbps | Disaster backup |

---

## 2.5.3 Transport Color Mapping

### Color Assignment Strategy

```
                        SD-WAN TRANSPORT COLOR SCHEME
+==============================================================================+
|                                                                              |
|   COLOR           TRANSPORT TYPE          CHARACTERISTICS                    |
|   +----------+    +------------------+    +-----------------------------+    |
|   | mpls     | => | MPLS Private WAN | => | Low latency, guaranteed QoS |    |
|   +----------+    +------------------+    +-----------------------------+    |
|                                                                              |
|   +----------+    +------------------+    +-----------------------------+    |
|   | biz-     | => | Business DIA     | => | Dedicated, SLA-backed       |    |
|   | internet |    | (Enterprise)     |    | Higher reliability          |    |
|   +----------+    +------------------+    +-----------------------------+    |
|                                                                              |
|   +----------+    +------------------+    +-----------------------------+    |
|   | public-  | => | Public Internet  | => | Best effort, variable       |    |
|   | internet |    | (Commodity)      |    | Lower cost                  |    |
|   +----------+    +------------------+    +-----------------------------+    |
|                                                                              |
|   +----------+    +------------------+    +-----------------------------+    |
|   | lte      | => | 4G LTE Cellular  | => | Wireless backup             |    |
|   +----------+    +------------------+    +-----------------------------+    |
|                                                                              |
|   +----------+    +------------------+    +-----------------------------+    |
|   | 5g       | => | 5G Cellular      | => | High-speed wireless         |    |
|   +----------+    +------------------+    +-----------------------------+    |
|                                                                              |
|   +----------+    +------------------+    +-----------------------------+    |
|   | private1 | => | Custom Private   | => | Reserved for expansion      |    |
|   +----------+    +------------------+    +-----------------------------+    |
|                                                                              |
+==============================================================================+
```

### Site-Specific Color Configuration

| Site | Color 1 | Color 2 | Color 3 | Notes |
|------|---------|---------|---------|-------|
| Mumbai DC | mpls | biz-internet | 5g | Triple transport |
| Chennai DR | mpls | biz-internet | 5g | Triple transport |
| London | mpls | biz-internet | 5g | Triple transport |
| Frankfurt | mpls | biz-internet | 5g | Triple transport |
| New Jersey | mpls | biz-internet | 5g | Triple transport |
| Dallas | mpls | biz-internet | 5g | Triple transport |
| Bangalore | biz-internet | lte | - | Dual transport |
| Delhi | biz-internet | lte | - | Dual transport |
| Noida | biz-internet | lte | - | Dual transport |

---

## 2.5.4 Transport Interface Configuration

### WAN Edge Interface Mapping

**Hub Sites (C8300-2N2S-6T / C8500-12X4QC):**

```
!======================================================================
! MUMBAI DC - C8500-12X4QC TRANSPORT INTERFACES
!======================================================================
!
! MPLS Transport (Color: mpls)
interface TenGigabitEthernet0/0/0
 description MPLS-PRIMARY-TATA-100G
 mtu 9216
 ip address 198.51.100.1 255.255.255.252
 negotiation auto
 sdwan
  tunnel-interface
   encapsulation ipsec weight 1
   color mpls
   max-control-connections 2
   no allow-service all
   allow-service bfd
   allow-service bgp
   allow-service dhcp
   allow-service dns
   allow-service icmp
   allow-service netconf
   allow-service ntp
   allow-service ospf
   allow-service sshd
   allow-service stun
!
! Business Internet Transport (Color: biz-internet)
interface TenGigabitEthernet0/0/1
 description DIA-PRIMARY-TATA-1G
 mtu 1500
 ip address 203.0.113.1 255.255.255.252
 ip nat outside
 negotiation auto
 sdwan
  tunnel-interface
   encapsulation ipsec weight 1
   color biz-internet
   carrier Tata-Communications
   max-control-connections 2
   vbond-as-stun-server
   no allow-service all
   allow-service bfd
   allow-service bgp
   allow-service dhcp
   allow-service dns
   allow-service icmp
   allow-service https
   allow-service netconf
   allow-service ntp
   allow-service sshd
   allow-service stun
!
! 5G Cellular Backup (Color: 5g)
interface Cellular0/4/0
 description 5G-BACKUP-JIO
 ip address negotiated
 ip nat outside
 dialer in-band
 dialer-group 1
 pulse-time 1
 sdwan
  tunnel-interface
   encapsulation ipsec weight 10
   color 5g
   carrier Jio-5G
   max-control-connections 1
   last-resort-circuit
   low-bandwidth-link
   vbond-as-stun-server
   no allow-service all
   allow-service bfd
   allow-service dhcp
   allow-service dns
   allow-service icmp
   allow-service stun
```

**Branch Sites (C8200L-1N-4T):**

```
!======================================================================
! BANGALORE BRANCH - C8200L-1N-4T TRANSPORT INTERFACES
!======================================================================
!
! Business Internet Primary (Color: biz-internet)
interface GigabitEthernet0/0/0
 description DIA-PRIMARY-JIO-200M
 mtu 1500
 ip address dhcp
 ip nat outside
 negotiation auto
 sdwan
  tunnel-interface
   encapsulation ipsec weight 1
   color biz-internet
   carrier Jio-Fiber
   max-control-connections 2
   vbond-as-stun-server
   no allow-service all
   allow-service bfd
   allow-service dhcp
   allow-service dns
   allow-service icmp
   allow-service https
   allow-service ntp
   allow-service sshd
   allow-service stun
!
! LTE Backup (Color: lte)
interface Cellular0/1/0
 description LTE-BACKUP-JIO
 ip address negotiated
 ip nat outside
 dialer in-band
 dialer-group 1
 pulse-time 1
 sdwan
  tunnel-interface
   encapsulation ipsec weight 5
   color lte
   carrier Jio-LTE
   max-control-connections 1
   last-resort-circuit
   low-bandwidth-link
   vbond-as-stun-server
   no allow-service all
   allow-service bfd
   allow-service dhcp
   allow-service dns
   allow-service icmp
   allow-service stun
```

---

## 2.5.5 NAT Traversal and Firewall Requirements

### NAT Scenarios

| Scenario | Description | Solution | Notes |
|----------|-------------|----------|-------|
| Public IP | Direct routable address | Direct tunnel | MPLS, dedicated DIA |
| NAT44 | Single NAT translation | STUN | Standard broadband |
| Double NAT | CGN + local NAT | STUN + vBond relay | Cellular, some ISPs |
| Symmetric NAT | Port-restricted | vBond relay required | Problematic ISPs |

### Firewall Port Requirements

| Protocol | Port | Direction | Purpose |
|----------|------|-----------|---------|
| DTLS | UDP 12346 | Outbound | Control connections |
| TLS | TCP 23456 | Outbound | Control connections (backup) |
| IPsec | UDP 12346 | Bidirectional | Data plane tunnels |
| IPsec | UDP 4500 | Bidirectional | NAT-T encapsulation |
| IKEv2 | UDP 500 | Bidirectional | Key exchange |
| STUN | UDP 3478 | Outbound | NAT traversal |
| NTP | UDP 123 | Outbound | Time synchronization |
| DNS | UDP/TCP 53 | Outbound | Name resolution |
| HTTPS | TCP 443 | Outbound | Cloud services, software updates |

### NAT Configuration for Internet Transports

```
!======================================================================
! NAT CONFIGURATION FOR INTERNET TRANSPORTS
!======================================================================
!
! NAT Pool for Service VPNs
ip nat pool SDWAN-NAT 203.0.113.10 203.0.113.30 prefix-length 27
!
! Inside Interface Definition
interface GigabitEthernet0/0/1
 ip nat inside
!
! NAT Overload for Internet Access
ip nat inside source list NAT-ACL interface GigabitEthernet0/0/0 overload
!
! NAT ACL
ip access-list extended NAT-ACL
 10 permit ip 10.0.0.0 0.255.255.255 any
 20 permit ip 172.16.0.0 0.15.255.255 any
 30 permit ip 192.168.0.0 0.0.255.255 any
!
! TCP MSS Adjustment
ip tcp adjust-mss 1360
```

---

## 2.5.6 Transport SLA Definitions

### SLA Threshold Configuration

| SLA Class | Latency | Jitter | Loss | Application Type |
|-----------|---------|--------|------|------------------|
| Real-Time | <150ms | <30ms | <1% | Voice, Video |
| Business-Critical | <200ms | <50ms | <2% | SAP, Oracle, Citrix |
| Default | <300ms | <100ms | <5% | General business |
| Best-Effort | No limit | No limit | No limit | Bulk data, backup |

### Transport SLA Baseline per Site

| Site | Transport | Expected Latency | Expected Jitter | Expected Loss |
|------|-----------|------------------|-----------------|---------------|
| Mumbai DC | MPLS | 5ms | 1ms | 0.01% |
| Mumbai DC | DIA | 15ms | 5ms | 0.1% |
| Mumbai DC | 5G | 25ms | 10ms | 0.5% |
| Chennai DR | MPLS | 8ms | 2ms | 0.02% |
| Chennai DR | DIA | 18ms | 6ms | 0.15% |
| London | MPLS | 120ms (to India) | 5ms | 0.1% |
| London | DIA | 140ms (to India) | 15ms | 0.3% |
| Frankfurt | MPLS | 125ms (to India) | 5ms | 0.1% |
| New Jersey | MPLS | 180ms (to India) | 8ms | 0.15% |
| Dallas | MPLS | 200ms (to India) | 10ms | 0.2% |
| Bangalore | DIA | 20ms (to Mumbai) | 8ms | 0.2% |
| Delhi | DIA | 25ms (to Mumbai) | 10ms | 0.25% |
| Noida | DIA | 22ms (to Mumbai) | 8ms | 0.2% |

---

## 2.5.7 Transport Redundancy Design

### Redundancy Model

```
                    TRANSPORT REDUNDANCY ARCHITECTURE
+==============================================================================+
|                                                                              |
|   HUB SITES (Mumbai, Chennai, London, Frankfurt, NJ, Dallas)                |
|   +----------------------------------------------------------------------+  |
|   |                                                                      |  |
|   |   Transport 1: MPLS ─────────────────────> Primary (weight: 1)      |  |
|   |        │                                                             |  |
|   |        └── BFD: 1000ms hello, multiplier 3, 3-second detect         |  |
|   |                                                                      |  |
|   |   Transport 2: DIA ──────────────────────> Secondary (weight: 1)    |  |
|   |        │                                                             |  |
|   |        └── BFD: 1000ms hello, multiplier 3, 3-second detect         |  |
|   |                                                                      |  |
|   |   Transport 3: 5G ───────────────────────> Tertiary (weight: 10)    |  |
|   |        │              (last-resort-circuit)                          |  |
|   |        └── BFD: 1000ms hello, multiplier 7, 7-second detect         |  |
|   |                                                                      |  |
|   +----------------------------------------------------------------------+  |
|                                                                              |
|   BRANCH SITES (Bangalore, Delhi, Noida)                                    |
|   +----------------------------------------------------------------------+  |
|   |                                                                      |  |
|   |   Transport 1: DIA ──────────────────────> Primary (weight: 1)      |  |
|   |        │                                                             |  |
|   |        └── BFD: 1000ms hello, multiplier 3, 3-second detect         |  |
|   |                                                                      |  |
|   |   Transport 2: LTE ──────────────────────> Backup (weight: 5)       |  |
|   |        │              (last-resort-circuit)                          |  |
|   |        └── BFD: 1000ms hello, multiplier 7, 7-second detect         |  |
|   |                                                                      |  |
|   +----------------------------------------------------------------------+  |
|                                                                              |
+==============================================================================+
```

### Failover Scenarios

| Scenario | Trigger | Action | Convergence Time |
|----------|---------|--------|------------------|
| MPLS failure | BFD timeout (3s) | Shift to DIA | <5 seconds |
| DIA failure | BFD timeout (3s) | Shift to MPLS/5G | <5 seconds |
| Dual transport failure | BFD timeout | Activate LTE/5G | <10 seconds |
| Complete site failure | All BFD timeout | Traffic via alternate site | <15 seconds |

---

## 2.5.8 Transport Cost Analysis

### Monthly Transport Costs

| Site | MPLS | DIA | Cellular | Total |
|------|------|-----|----------|-------|
| Mumbai DC | $XX,XXX | $X,XXX | $XXX | $XX,XXX |
| Chennai DR | $XX,XXX | $X,XXX | $XXX | $XX,XXX |
| London | $X,XXX | $X,XXX | $XXX | $XX,XXX |
| Frankfurt | $X,XXX | $X,XXX | $XXX | $X,XXX |
| New Jersey | $X,XXX | $X,XXX | $XXX | $X,XXX |
| Dallas | $X,XXX | $X,XXX | $XXX | $X,XXX |
| Bangalore | $X | $XXX | $XXX | $XXX |
| Delhi | $X | $XXX | $XXX | $XXX |
| Noida | $X | $XXX | $XX | $XXX |
| **Total** | **$XX,XXX** | **$XX,XXX** | **$X,XXX** | **$XX,XXX** |

### Cost Comparison: Current vs. Target

| Metric | Current (MPLS Only) | Target (Hybrid) | Savings |
|--------|---------------------|-----------------|---------|
| Monthly Cost | $XX,XXX | $XX,XXX | $XX,XXX (20%) |
| Annual Cost | $XXX,XXX | $XXX,XXX | $XXX,XXX |
| 3-Year TCO | $X,XXX,XXX | $X,XXX,XXX | $XXX,XXX |
| Bandwidth (Aggregate) | 2.5 Gbps | 8.5 Gbps | +240% |
| Cost per Mbps | $XX.XX | $X.XX | -76% |

---

## 2.5.9 Transport Verification Commands

### Control Plane Verification

```
!======================================================================
! TRANSPORT CONTROL PLANE VERIFICATION
!======================================================================
!
! Verify TLOC registration
show sdwan control local-properties
!
! Expected Output:
! personality                       vedge
! sp-organization-name              ABHAVTECH-COM
! organization-name                 ABHAVTECH-COM
! root-ca-chain-status              Installed
! certificate-status                Installed
! dns-name                          vbond.abhavtech.com
! vBond                             True
! number-active-wan-interfaces      3
!
! Verify control connections
show sdwan control connections
!
! Expected Output:
! PEER     PEER    PEER            SITE      DOMAIN   PEER     PRIV     PEER      PUB     LOCAL   REMOTE  PEER     UPTIME
! TYPE     PROT    SYSTEM IP       ID        ID       PRIVATE  PORT     PUBLIC    PORT    COLOR   COLOR   STATE
! vsmart   dtls    10.255.255.1    100       1        192.168.1.1  12346  198.51.100.1  12346  mpls    default  up
! vsmart   dtls    10.255.255.2    100       1        192.168.1.2  12346  198.51.100.2  12346  mpls    default  up
! vmanage  dtls    10.255.254.1    100       0        192.168.1.10 12346  198.51.100.10 12346  mpls    default  up
```

### Data Plane Verification

```
!======================================================================
! TRANSPORT DATA PLANE VERIFICATION
!======================================================================
!
! Verify BFD sessions
show sdwan bfd sessions
!
! Expected Output:
! SOURCE         DEST           SITE    DETECT   TX      COLOR     STATE   UPTIME
! TLOC           TLOC           ID      MULT     INTVL
! 10.1.100.1     10.1.200.1     200     7        1000    mpls      up      5:12:33:05
! 10.1.100.1     10.1.200.1     200     7        1000    biz-int   up      5:12:33:02
! 10.1.100.1     10.1.300.1     300     7        1000    mpls      up      5:12:32:58
!
! Verify tunnel statistics
show sdwan tunnel statistics
!
! Verify transport health
show sdwan app-route statistics
!
! Sample Output:
! app-route statistics 10.1.100.1 12346 10.1.200.1 12346 ipsec
!  remote-system-ip  10.1.200.1
!  local-color       mpls
!  remote-color      mpls
!  mean-latency      8
!  mean-jitter       2
!  mean-loss         0.00
!  average-latency   8
!  average-jitter    2
!  average-loss      0.00
```

---

## 2.5.10 Transport Best Practices

### Design Recommendations

1. **Diverse Path Selection:** Use different carriers for different transports to avoid common points of failure
2. **Color Consistency:** Maintain consistent color assignment across all sites for policy predictability
3. **BFD Tuning:** Adjust BFD timers based on transport characteristics (faster for dedicated, slower for cellular)
4. **Weight Assignment:** Use weights to influence traffic distribution (lower weight = preferred path)
5. **Last Resort Circuits:** Mark cellular/satellite as last-resort to prevent unnecessary usage
6. **MTU Management:** Configure appropriate MTU per transport to avoid fragmentation
7. **NAT-T Enablement:** Enable NAT traversal on all Internet-facing transports
8. **STUN Server:** Use vBond as STUN server for NAT discovery

### Operational Considerations

| Area | Recommendation | Rationale |
|------|----------------|-----------|
| Monitoring | Poll transport metrics every 60 seconds | Balance visibility vs. overhead |
| Alerting | Alert on BFD flaps > 3 per hour | Identify unstable transports |
| Capacity | Plan for 70% utilization threshold | Allow headroom for bursts |
| Testing | Monthly failover testing | Validate redundancy works |
| Documentation | Update transport inventory quarterly | Track circuit changes |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 30, 2025 | Network Architecture Team | Initial release |

---

*This document is part of the Abhavtech.com SD-WAN Documentation Suite*
*Confidential - Internal Use Only*
