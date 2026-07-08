# 2.14 Wireless WAN Design

## Document Information
| Field | Value |
|-------|-------|
| Document Title | Wireless WAN Design |
| Version | 1.0 |
| Author | Network Architecture Team |
| Organization | Abhavtech.com |
| Last Updated | December 2025 |
| Status | Production |

---

## Table of Contents
1. [Wireless WAN Overview](#wireless-wan-overview)
2. [5G Integration](#5g-integration)
3. [4G LTE Design](#4g-lte-design)
4. [LEO Satellite Connectivity](#leo-satellite-connectivity)
5. [Cellular Bonding](#cellular-bonding)
6. [Wireless WAN Policies](#wireless-wan-policies)
7. [Performance Optimization](#performance-optimization)
8. [Failover Design](#failover-design)
9. [Carrier Management](#carrier-management)

---

## 1. Wireless WAN Overview

### 1.1 Wireless Strategy

Wireless WAN provides backup connectivity, primary connectivity for remote sites, and bandwidth augmentation for high-demand scenarios.

**Use Cases:**
- Last-resort backup for all sites
- Primary connectivity for temporary/remote sites
- Bandwidth augmentation during peak periods
- Business continuity during circuit outages
- Mobile/temporary office connectivity

### 1.2 Wireless WAN Architecture

```
+--------------------------------------------------------------------+
|                    WIRELESS WAN ARCHITECTURE                        |
+--------------------------------------------------------------------+
|                                                                     |
|  Abhavtech Sites                    Carrier Networks               |
|  +------------------+               +----------------------+        |
|  | Data Centers     |               | Jio 5G SA/NSA        |        |
|  | (Mumbai/Chennai) |               | Airtel 5G NSA        |        |
|  |                  |     5G        | Vodafone 4G LTE      |        |
|  | C8500 w/ 5G     -|-------------->| BSNL 4G LTE          |        |
|  | Module           |               +----------------------+        |
|  +------------------+                         |                     |
|                                               v                     |
|  +------------------+               +----------------------+        |
|  | Hub Sites        |               | Carrier Core         |        |
|  | (LON/FRA/NJ/DAL) |     5G/LTE   | +------------------+ |        |
|  |                  |-------------->| | Internet Gateway | |        |
|  | C8300 w/ LTE    -|               | | NAT/CGNAT        | |        |
|  +------------------+               | | QoS (Optional)   | |        |
|                                     | +------------------+ |        |
|  +------------------+               +----------------------+        |
|  | Branch Sites     |                         |                     |
|  | (BLR/DEL/NOI)    |     4G LTE              v                     |
|  |                  |               +----------------------+        |
|  | C8200 w/ LTE    -|-------------->| Internet             |        |
|  +------------------+               | (SD-WAN Overlay)     |        |
|                                     +----------------------+        |
+--------------------------------------------------------------------+
```

### 1.3 Wireless WAN Deployment Summary

| Site Type | Technology | Carrier | Bandwidth | Role |
|-----------|------------|---------|-----------|------|
| Mumbai DC | 5G SA | Jio | 1 Gbps | Backup |
| Chennai DR | 5G SA | Jio | 1 Gbps | Backup |
| Bangalore | 5G NSA | Airtel | 500 Mbps | Backup |
| Delhi | 4G LTE | Airtel/Jio | 100 Mbps | Backup |
| Noida | 4G LTE | Jio | 100 Mbps | Primary |
| London | 5G NSA | EE | 500 Mbps | Backup |
| Frankfurt | 4G LTE | Vodafone | 100 Mbps | Backup |
| New Jersey | 5G NSA | Verizon | 500 Mbps | Backup |
| Dallas | 4G LTE | AT&T | 100 Mbps | Backup |

---

## 2. 5G Integration

### 2.1 5G Technology Overview

**5G Deployment Modes:**
- 5G SA (Standalone): Native 5G core, full capabilities
- 5G NSA (Non-Standalone): 5G radio with 4G core

**5G Capabilities:**

| Parameter | 5G SA | 5G NSA | 4G LTE |
|-----------|-------|--------|--------|
| Peak Speed | 1-10 Gbps | 1-2 Gbps | 100-300 Mbps |
| Latency | 1-5 ms | 10-20 ms | 30-50 ms |
| Reliability | 99.999% | 99.99% | 99.9% |
| Connection Density | 1M/km² | 100K/km² | 10K/km² |
| Network Slicing | Yes | Limited | No |

### 2.2 5G Architecture for SD-WAN

```
+--------------------------------------------------------------------+
|                    5G SD-WAN INTEGRATION                            |
+--------------------------------------------------------------------+
|                                                                     |
|  WAN Edge                           5G Network                      |
|  +----------------------+           +------------------------+      |
|  | Cisco C8500-12X4QC   |           | 5G RAN                 |      |
|  |                      |           | +------------------+   |      |
|  | +------------------+ |           | | gNodeB           |   |      |
|  | | 5G Module        | |  NR Air   | | (mmWave/Sub-6)   |   |      |
|  | | (Pluggable)      |<|---------->| +------------------+   |      |
|  | |                  | |  Interface|           |            |      |
|  | | - SIM Slot 1     | |           |           v            |      |
|  | | - SIM Slot 2     | |           | +------------------+   |      |
|  | +------------------+ |           | | 5G Core (SA)     |   |      |
|  |          |           |           | | - AMF            |   |      |
|  |          v           |           | | - SMF            |   |      |
|  | +------------------+ |           | | - UPF            |   |      |
|  | | SD-WAN Control   | |           | +------------------+   |      |
|  | | - Color: 5g      | |           |           |            |      |
|  | | - TLOC           | |           |           v            |      |
|  | | - IPsec Tunnel   | |           | +------------------+   |      |
|  | +------------------+ |           | | Data Network     |   |      |
|  +----------------------+           | | (Internet/MPLS)  |   |      |
|                                     | +------------------+   |      |
|                                     +------------------------+      |
+--------------------------------------------------------------------+
```

### 2.3 5G Module Configuration

**Cisco 5G Pluggable Module (P-5GS6-GL):**

```
! 5G Module Configuration
controller cellular 0/0/0
 lte sim data-profile 1 attach-profile 1
 lte modem link-recovery rssi onset-threshold -110
 lte modem link-recovery rssi recover-threshold -100
 lte modem link-recovery monitor-timer 60
 lte modem link-recovery wait-timer 30
 lte modem link-recovery debounce-count 3
 profile id 1 apn abhavtech-enterprise authentication none
 !
 5g-nr
  nsa enable
  sa enable
  band n78 n77 n41
  frequency-priority high
```

**Interface Configuration:**

```
! 5G WAN Interface
interface Cellular0/0/0
 description 5G-JIO-PRIMARY
 ip address negotiated
 ip nat outside
 dialer in-band
 dialer idle-timeout 0
 dialer-group 1
 pulse-time 1
 !
 ! SD-WAN specific
 tunnel-interface
  encapsulation ipsec weight 10
  color 5g restrict
  carrier jio
  no allow-service all
  allow-service dhcp
  allow-service dns
  allow-service icmp
  allow-service sshd
  allow-service netconf
```

### 2.4 5G Network Slicing

**Network Slice Configuration (Future):**

| Slice | Purpose | SLA | Sites |
|-------|---------|-----|-------|
| eMBB | Enhanced Mobile Broadband | High BW | All |
| URLLC | Ultra-Reliable Low Latency | <5ms, 99.999% | DC/Hub |
| mMTC | Massive IoT | Power efficient | IoT sites |

```
! 5G Network Slice Selection (Future)
controller cellular 0/0/0
 5g-nr
  network-slice
   s-nssai sst 1 sd 000001
    description enhanced-mobile-broadband
    qos-profile qci-9
   !
   s-nssai sst 2 sd 000002
    description ultra-reliable-low-latency
    qos-profile qci-1
```

---

## 3. 4G LTE Design

### 3.1 LTE Deployment Architecture

```
+--------------------------------------------------------------------+
|                    4G LTE BACKUP DESIGN                             |
+--------------------------------------------------------------------+
|                                                                     |
|  Branch Site (Bangalore)                                           |
|  +------------------------------------------------------+          |
|  |                                                      |          |
|  |  C8200-1N-4T                                        |          |
|  |  +--------------------------------------------+     |          |
|  |  |                                            |     |          |
|  |  |  +----------+  +----------+  +----------+ |     |          |
|  |  |  | Gi0/0/0  |  | Gi0/0/1  |  | Cell0    | |     |          |
|  |  |  | MPLS     |  | DIA      |  | LTE      | |     |          |
|  |  |  | Primary  |  | Secondary|  | Backup   | |     |          |
|  |  |  +----------+  +----------+  +----------+ |     |          |
|  |  |       |             |             |       |     |          |
|  |  +-------|-------------|-------------|-------+     |          |
|  |          |             |             |             |          |
|  +----------|-------------|-------------|-------------+          |
|             v             v             v                         |
|       +----------+  +----------+  +----------+                   |
|       | MPLS PE  |  | ISP GW   |  | LTE Tower|                   |
|       | 100 Mbps |  | 200 Mbps |  | 100 Mbps |                   |
|       +----------+  +----------+  +----------+                   |
|                                                                   |
+--------------------------------------------------------------------+
```

### 3.2 LTE Module Configuration

**Cisco LTE Module (P-LTE-US/P-LTE-IN):**

```
! LTE Module Configuration
controller cellular 0/0/0
 lte sim data-profile 1 attach-profile 1
 lte failovertimer 5
 lte modem link-recovery rssi onset-threshold -100
 lte modem link-recovery rssi recover-threshold -90
 lte modem link-recovery monitor-timer 30
 lte modem link-recovery wait-timer 10
 lte modem link-recovery debounce-count 2
 !
 profile id 1 apn enterprise-apn authentication pap username abhavtech password Enterpr1se!

! LTE Interface
interface Cellular0/0/0
 description LTE-AIRTEL-BACKUP
 ip address negotiated
 ip nat outside
 dialer in-band
 dialer idle-timeout 0
 dialer-group 1
 pulse-time 1
 !
 ! SD-WAN Configuration
 tunnel-interface
  encapsulation ipsec weight 100
  color lte restrict
  carrier airtel
  no allow-service all
  allow-service dhcp
  allow-service dns
  allow-service icmp
```

### 3.3 LTE Performance Optimization

**Antenna Placement Guidelines:**

| Factor | Recommendation |
|--------|----------------|
| Mounting Height | 3-5 meters above ground |
| Orientation | Point toward nearest tower |
| Obstruction | Clear line of sight preferred |
| Cable Length | <10 meters (low-loss cable) |
| External Antenna | Required for RSRP < -90 dBm |

**Signal Quality Thresholds:**

| Metric | Excellent | Good | Fair | Poor |
|--------|-----------|------|------|------|
| RSRP | > -80 dBm | -80 to -90 | -90 to -100 | < -100 |
| RSRQ | > -10 dB | -10 to -15 | -15 to -20 | < -20 |
| SINR | > 20 dB | 13-20 | 0-13 | < 0 |

---

## 4. LEO Satellite Connectivity

### 4.1 LEO Satellite Overview

Low Earth Orbit (LEO) satellite provides connectivity for remote sites, disaster recovery, and locations without terrestrial options.

**LEO Providers:**
- Starlink (SpaceX) - Primary evaluation
- OneWeb - Secondary option
- Amazon Kuiper - Future consideration

### 4.2 LEO Satellite Architecture

```
+--------------------------------------------------------------------+
|                    LEO SATELLITE INTEGRATION                        |
+--------------------------------------------------------------------+
|                                                                     |
|  Remote/DR Site                     LEO Constellation               |
|  +----------------------+           +------------------------+      |
|  | Cisco WAN Edge       |           |     LEO Satellites     |      |
|  |                      |           |  +----+  +----+  +----+|      |
|  | +------------------+ |           |  |SAT1|  |SAT2|  |SAT3||      |
|  | | Satellite        | |  Ku/Ka   |  +----+  +----+  +----+|      |
|  | | Terminal         |<|--------->|         Mesh Links     |      |
|  | | (Starlink)       | |  Band    |            |           |      |
|  | +------------------+ |           +------------|------------+     |
|  |          |           |                        v                  |
|  |          v           |           +------------------------+      |
|  | +------------------+ |           | Ground Station          |      |
|  | | Ethernet         | |           | (Gateway)               |      |
|  | | Connection       | |           |                        |      |
|  | | to WAN Edge      | |           | +------------------+   |      |
|  | +------------------+ |           | | Internet POP     |   |      |
|  +----------------------+           | +------------------+   |      |
|                                     +------------------------+      |
+--------------------------------------------------------------------+
```

### 4.3 LEO Satellite Characteristics

| Parameter | Starlink | OneWeb | GEO (Legacy) |
|-----------|----------|--------|--------------|
| Altitude | 550 km | 1,200 km | 35,786 km |
| Latency | 20-40 ms | 32-50 ms | 600+ ms |
| Bandwidth | 50-200 Mbps | 50-150 Mbps | 10-50 Mbps |
| Coverage | Global (phased) | Global (phased) | Equatorial focus |
| Weather Impact | Moderate | Moderate | High |
| Cost/Month | $XXX-X,XXX | $XXX-X,XXX | $X,XXX-XX,XXX |

### 4.4 Starlink Integration Configuration

```
! Starlink Terminal Integration
! Terminal connects via Ethernet to WAN Edge

interface GigabitEthernet0/0/2
 description STARLINK-TERMINAL
 ip address dhcp
 ip nat outside
 !
 ! SD-WAN Configuration
 tunnel-interface
  encapsulation ipsec weight 50
  color public-internet restrict
  carrier starlink
  max-control-connections 1
  no allow-service all
  allow-service dhcp
  allow-service dns
  allow-service icmp
  !
  ! Adjust for satellite characteristics
  hello-interval 1000
  hello-tolerance 12

! NAT for Starlink CGNAT
ip nat inside source list NAT-ACL interface GigabitEthernet0/0/2 overload

! BFD tuning for satellite latency
bfd-template satellite-link
 interval min-tx 500 min-rx 500 multiplier 5
```

### 4.5 Satellite Use Cases

| Use Case | Primary | Backup | Notes |
|----------|---------|--------|-------|
| Remote Construction Site | ✅ | - | Temporary deployment |
| DR Failover | - | ✅ | When all terrestrial fails |
| Maritime/Mobile | ✅ | - | Ships, vehicles |
| Rural Branch | ✅ | LTE | Limited terrestrial options |
| Event Coverage | ✅ | - | Temporary high-bandwidth |

---

## 5. Cellular Bonding

### 5.1 Cellular Bonding Overview

Cellular bonding combines multiple cellular connections to increase bandwidth and reliability.

**Bonding Modes:**
- Active-Active: Load balance across connections
- Active-Standby: Primary with failover
- Aggregation: Combine bandwidth (requires bonding device)

### 5.2 Dual-SIM Configuration

```
+--------------------------------------------------------------------+
|                    DUAL-SIM CELLULAR DESIGN                         |
+--------------------------------------------------------------------+
|                                                                     |
|  WAN Edge with Dual LTE                                            |
|  +------------------------------------------------------+          |
|  |                                                      |          |
|  |  +------------------+      +------------------+      |          |
|  |  | Cellular0/0/0    |      | Cellular0/1/0    |      |          |
|  |  | SIM 1: Jio       |      | SIM 2: Airtel    |      |          |
|  |  | 100 Mbps         |      | 100 Mbps         |      |          |
|  |  | Primary Carrier  |      | Backup Carrier   |      |          |
|  |  +------------------+      +------------------+      |          |
|  |           |                         |                |          |
|  |           v                         v                |          |
|  |  +----------------------------------------------+   |          |
|  |  |           SD-WAN Controller                  |   |          |
|  |  |  - Load Balance (50/50)                      |   |          |
|  |  |  - Failover on signal loss                   |   |          |
|  |  |  - Application steering                      |   |          |
|  |  +----------------------------------------------+   |          |
|  |                                                      |          |
|  +------------------------------------------------------+          |
|                                                                     |
+--------------------------------------------------------------------+
```

### 5.3 Dual-SIM Configuration

```
! Dual-SIM LTE Configuration
controller cellular 0/0/0
 lte sim max-retry 3
 lte sim primary slot 0
 !
 lte failovertimer 5
 profile id 1 apn jio-enterprise
!
controller cellular 0/1/0
 lte sim max-retry 3
 lte sim primary slot 1
 !
 lte failovertimer 5
 profile id 2 apn airtel-enterprise

! Interface Configuration
interface Cellular0/0/0
 description LTE-JIO-PRIMARY
 tunnel-interface
  encapsulation ipsec weight 50
  color lte
  carrier jio

interface Cellular0/1/0
 description LTE-AIRTEL-SECONDARY
 tunnel-interface
  encapsulation ipsec weight 50
  color lte
  carrier airtel
```

---

## 6. Wireless WAN Policies

### 6.1 Traffic Steering Policy

**Wireless-Specific AAR Policy:**

```
! SLA Class for Cellular
policy
 sla-class cellular-sla
  latency 150
  loss 2
  jitter 50
 !
 sla-class cellular-voice
  latency 100
  loss 1
  jitter 30

! App-Route Policy for Cellular
policy
 app-route-policy _cellular-steering
  vpn-list VPN-ALL
   sequence 10
    match
     app-list voice-apps
    action
     sla-class cellular-voice strict
     !
     backup-sla-class cellular-sla
   !
   sequence 20
    match
     app-list business-critical
    action
     sla-class cellular-sla
   !
   sequence 30
    match
     app-list bulk-data
    action
     count cellular-bulk-counter
     ! Avoid cellular for bulk transfers
     sla-class prefer-wired
```

### 6.2 Cellular Cost Optimization

**Data Usage Control:**

```
! Data Cap Monitoring
policy
 data-policy _cellular-data-cap
  vpn-list VPN-ALL
   sequence 10
    match
     source-data-prefix-list internal-users
    action
     count cellular-usage
     set
      local-tloc-list
       color lte
        encap ipsec
        restrict
     !
     ! Rate limit per user on cellular
     policer data-cap
      rate 10000
      burst 15000
      exceed drop

! Cellular Usage Monitoring
sdwan
 omp
  advertise cellular-stats
  !
 analytics
  monitor-cellular-usage
   alert-threshold 80 percent
   cap-threshold 100 GB
```

---

## 7. Performance Optimization

### 7.1 TCP Optimization for Wireless

```
! TCP Optimization for High-Latency Links
parameter-map type inspect tcp-wireless
 tcp syn-flood rate per-destination 500
 tcp syn-flood rate per-destination action-type drop
 tcp window-scale-enforcement loose
 tcp idle-time 3600
 tcp finwait-time 10
 tcp synwait-time 30
 tcp reassembly memory limit 1024
 tcp reassembly timeout 10

! Apply to cellular interface
interface Cellular0/0/0
 service-policy type inspect tcp-wireless
```

### 7.2 MTU and Fragmentation

| Transport | Recommended MTU | Tunnel Overhead | Effective Payload |
|-----------|-----------------|-----------------|-------------------|
| 4G LTE | 1400 | 58 (IPsec) | 1342 |
| 5G | 1420 | 58 (IPsec) | 1362 |
| Starlink | 1380 | 58 (IPsec) | 1322 |

```
! MTU Configuration
interface Cellular0/0/0
 mtu 1400
 ip mtu 1400
 ip tcp adjust-mss 1360
```

### 7.3 Signal Monitoring

```
! Cellular Signal Monitoring Script
event manager applet CELLULAR-MONITOR
 event timer watchdog time 300
 action 100 cli command "show cellular 0/0/0 radio"
 action 200 regexp "RSRP.*(-[0-9]+)" "$_cli_result" match rsrp
 action 300 if $rsrp lt -100
 action 310  syslog priority warnings msg "Cellular signal weak: RSRP=$rsrp"
 action 320  cli command "test cellular 0/0/0 modem-power-cycle"
 action 330 end
```

---

## 8. Failover Design

### 8.1 Failover Hierarchy

```
+--------------------------------------------------------------------+
|                    WIRELESS FAILOVER DESIGN                         |
+--------------------------------------------------------------------+
|                                                                     |
|  Priority 1: MPLS (Weight 1)                                       |
|       |                                                             |
|       | Failover trigger: Loss >1%, Latency >100ms                 |
|       v                                                             |
|  Priority 2: DIA (Weight 1)                                        |
|       |                                                             |
|       | Failover trigger: Link down or SLA violation               |
|       v                                                             |
|  Priority 3: 5G (Weight 10)                                        |
|       |                                                             |
|       | Failover trigger: Signal loss (RSRP < -110)                |
|       v                                                             |
|  Priority 4: 4G LTE (Weight 20)                                    |
|       |                                                             |
|       | Failover trigger: Complete outage                          |
|       v                                                             |
|  Priority 5: Satellite (Weight 50)                                 |
|       |                                                             |
|       | Last resort - all other transports failed                  |
|       v                                                             |
|  [Site Isolated - Manual Intervention Required]                    |
|                                                                     |
+--------------------------------------------------------------------+
```

### 8.2 Failover Configuration

```
! Transport Preference Configuration
sdwan
 system
  site-id 100
  system-ip 10.100.1.1
  !
 omp
  graceful-restart
  advertise bgp
  advertise connected
  advertise static

! TLOC Weight Configuration (Lower = Preferred)
interface GigabitEthernet0/0/0
 tunnel-interface
  encapsulation ipsec weight 1
  color mpls

interface GigabitEthernet0/0/1
 tunnel-interface
  encapsulation ipsec weight 1
  color biz-internet

interface Cellular0/0/0
 tunnel-interface
  encapsulation ipsec weight 10
  color 5g last-resort-circuit

interface Cellular0/1/0
 tunnel-interface
  encapsulation ipsec weight 20
  color lte last-resort-circuit

interface GigabitEthernet0/0/2
 tunnel-interface
  encapsulation ipsec weight 50
  color public-internet
  carrier starlink
  last-resort-circuit
```

### 8.3 Failover Timing

| Failover Scenario | Detection Time | Switchover Time | Total RTO |
|-------------------|----------------|-----------------|-----------|
| MPLS → DIA | 3 seconds (BFD) | <1 second | <5 seconds |
| DIA → 5G | 3 seconds (BFD) | 2-3 seconds | <7 seconds |
| 5G → LTE | 5 seconds (Signal) | 3-5 seconds | <10 seconds |
| LTE → Satellite | 10 seconds | 5-10 seconds | <20 seconds |

---

## 9. Carrier Management

### 9.1 Carrier SLA Monitoring

| Carrier | Region | Technology | Committed SLA | Penalty |
|---------|--------|------------|---------------|---------|
| Jio | India | 5G SA | 99.9% / 50ms | 10% credit |
| Airtel | India | 5G NSA/LTE | 99.5% / 75ms | 5% credit |
| EE | UK | 5G NSA | 99.5% / 50ms | 5% credit |
| Verizon | US | 5G UW | 99.9% / 30ms | 10% credit |
| Starlink | Global | LEO | 99% / 50ms | Best effort |

### 9.2 Carrier Contact Matrix

| Carrier | Support Line | Escalation | Account Manager |
|---------|--------------|------------|-----------------|
| Jio | 1800-xxx-xxxx | enterprise@jio.com | Assigned |
| Airtel | 1800-xxx-xxxx | business@airtel.com | Assigned |
| EE | +44-xxx-xxxx | enterprise@ee.co.uk | Assigned |
| Verizon | 1-800-xxx-xxxx | enterprise@verizon.com | Assigned |

### 9.3 SIM Management

```
! SIM Inventory Tracking
+------+-------------+----------------+----------+------------+
| Site | SIM ICCID   | Carrier        | Plan     | Data Cap   |
+------+-------------+----------------+----------+------------+
| MUM  | 89xxx...001 | Jio 5G         | Unlimited| N/A        |
| MUM  | 89xxx...002 | Airtel 5G      | 500 GB   | 500 GB     |
| CHN  | 89xxx...003 | Jio 5G         | Unlimited| N/A        |
| BLR  | 89xxx...004 | Airtel LTE     | 100 GB   | 100 GB     |
| DEL  | 89xxx...005 | Jio LTE        | 100 GB   | 100 GB     |
+------+-------------+----------------+----------+------------+
```

---

## Summary

Wireless WAN provides critical backup and primary connectivity options for Abhavtech's SD-WAN deployment.

**Key Design Elements:**
- 5G SA/NSA at DC and hub sites (1 Gbps backup)
- 4G LTE at all sites (100-500 Mbps backup)
- LEO satellite evaluation for DR scenarios
- Dual-SIM for carrier redundancy
- Cost-aware traffic steering
- Sub-10-second failover for most scenarios

**Carrier Strategy:**
- Jio: Primary 5G provider (India)
- Airtel: Secondary LTE/5G (India)
- Regional carriers for EMEA/Americas
- Starlink for remote/DR scenarios

**Next Section:** [2.15 Catalyst Center for SD-WAN](2-15-catalyst-center-sdwan.md)

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
