# 6.6 Troubleshooting Guide

## Document Information
- **Version:** 1.0
- **Last Updated:** December 30, 2025
- **Author:** Abhavtech Network Engineering
- **Status:** Production Ready
- **Classification:** Internal Use

---

## 6.6.1 Troubleshooting Framework

### Systematic Approach

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SD-WAN TROUBLESHOOTING METHODOLOGY                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   │
│   │   IDENTIFY  │──>│   ISOLATE   │──>│  DIAGNOSE   │──>│   RESOLVE   │   │
│   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   │
│         │                 │                 │                 │            │
│         ▼                 ▼                 ▼                 ▼            │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   │
│   │ - Symptom   │   │ - Layer     │   │ - Root      │   │ - Implement │   │
│   │   capture   │   │   analysis  │   │   cause     │   │   fix       │   │
│   │ - Impact    │   │ - Component │   │ - Verify    │   │ - Validate  │   │
│   │   scope     │   │   isolation │   │   hypothesis│   │ - Document  │   │
│   │ - Timeline  │   │ - Traffic   │   │ - Collect   │   │ - Monitor   │   │
│   │   establish │   │   path      │   │   evidence  │   │   stability │   │
│   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                        DOCUMENT & LEARN                              │  │
│   │  - Update knowledge base  - Identify patterns  - Improve processes  │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Troubleshooting Layers

| Layer | Components | Tools | Common Issues |
|-------|------------|-------|---------------|
| **Physical** | Cables, optics, hardware | Interface status, CRC, LED | Link failures, CRC errors |
| **Data Link** | Interfaces, VLANs | show interface, show vlan | Interface errors, VLAN misconfig |
| **Network** | Routing, IP, BFD | show ip route, show bfd | Routing loops, BFD flaps |
| **Transport** | IPsec, DTLS, tunnels | show sdwan tunnel, show crypto | Tunnel failures, MTU issues |
| **Control Plane** | OMP, vSmart, TLOC | show omp routes, show control | OMP issues, policy problems |
| **Application** | DPI, AAR, QoS | show sdwan appqoe, show policy | AAR failures, QoS misconfig |

---

## 6.6.2 Control Plane Troubleshooting

### Control Connection Issues

#### Diagnostic Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTROL CONNECTION TROUBLESHOOTING                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────────┐                                                    │
│   │ Control Connection │                                                    │
│   │ Failure Detected  │                                                    │
│   └─────────┬─────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│   ┌───────────────────┐    No     ┌───────────────────────────────┐       │
│   │ Transport UP?     │──────────>│ Check physical/underlay first │       │
│   └─────────┬─────────┘           └───────────────────────────────┘       │
│             │ Yes                                                          │
│             ▼                                                               │
│   ┌───────────────────┐    No     ┌───────────────────────────────┐       │
│   │ vBond Reachable?  │──────────>│ Check vBond IP/port 12346     │       │
│   └─────────┬─────────┘           └───────────────────────────────┘       │
│             │ Yes                                                          │
│             ▼                                                               │
│   ┌───────────────────┐    No     ┌───────────────────────────────┐       │
│   │ Certificate Valid?│──────────>│ Check cert chain/expiry       │       │
│   └─────────┬─────────┘           └───────────────────────────────┘       │
│             │ Yes                                                          │
│             ▼                                                               │
│   ┌───────────────────┐    No     ┌───────────────────────────────┐       │
│   │ DTLS Session OK?  │──────────>│ Check crypto, MTU, firewall   │       │
│   └─────────┬─────────┘           └───────────────────────────────┘       │
│             │ Yes                                                          │
│             ▼                                                               │
│   ┌───────────────────┐    No     ┌───────────────────────────────┐       │
│   │ OMP Established?  │──────────>│ Check OMP timers, policies    │       │
│   └─────────┬─────────┘           └───────────────────────────────┘       │
│             │ Yes                                                          │
│             ▼                                                               │
│   ┌───────────────────────────────────────────────────────────────────┐   │
│   │ Control plane healthy - check application/data plane issues       │   │
│   └───────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Control Connection Commands

```bash
! === CONTROL CONNECTION STATUS ===

! Check all control connections
show sdwan control connections

! Expected output for healthy WAN Edge:
! PEER     PEER     PEER           SITE                           DOMAIN  PEER           
! TYPE     PROTOCOL SYSTEM IP      ID       STATE      UPTIME     ID      PRIVATE IP
! vbond    dtls     10.0.0.1       0        up         12:05:23:15 0      54.200.100.10
! vsmart   dtls     10.0.0.10      1000     up         12:05:23:10 1      10.100.1.10
! vsmart   dtls     10.0.0.11      1000     up         12:05:23:08 1      10.100.1.11
! vmanage  dtls     10.0.0.5       1000     up         12:05:22:55 0      10.100.1.5

! Check local control connection state
show sdwan control local-properties

! Verify vBond orchestration
show sdwan control connections-history

! Check connection attempts and failures
show sdwan control connection-history

! === CERTIFICATE VERIFICATION ===

! Check certificate status
show sdwan certificate installed

! Verify root CA
show sdwan certificate root-ca-cert

! Check certificate serial
show sdwan certificate serial

! Verify certificate chain
show sdwan certificate validity

! === CONTROL PLANE STATISTICS ===

! OMP statistics
show sdwan omp summary

! Control policy impact
show sdwan policy from-vsmart

! Route advertisements
show sdwan omp routes

! TLOC advertisements
show sdwan omp tlocs
```

### Common Control Plane Issues

| Issue | Symptoms | Root Cause | Resolution |
|-------|----------|------------|------------|
| **No vBond connection** | Control connections down | vBond unreachable, wrong IP | Verify vBond IP, check firewall |
| **Certificate expired** | DTLS handshake fails | Expired device certificate | Renew certificate via vManage |
| **Wrong org-name** | Authentication failure | Org-name mismatch | Correct system configuration |
| **DTLS timeout** | Intermittent connections | MTU issues, firewall | Check MTU, allow UDP 12346-12446 |
| **OMP not established** | Routes not received | vSmart policy blocking | Review control policies |
| **Clock skew** | Certificate validation fails | NTP not synchronized | Configure and verify NTP |

### Certificate Troubleshooting

```bash
! === CERTIFICATE CHAIN VALIDATION ===

! Show complete certificate chain
show sdwan certificate chain

! Check certificate expiry dates
show sdwan certificate installed | include Valid

! Verify organization ID
show sdwan running-config system | include organization-name

! Check serial number registration
show sdwan certificate serial

! === ROOT CA ISSUES ===

! Verify root CA installed
show sdwan certificate root-ca-cert

! Expected: Root CA certificate should be present
! If missing, install via vManage or CLI:
!
! request platform software sdwan root-cert-chain install bootflash:root-ca.pem

! === CERTIFICATE RENEWAL ===

! Generate CSR for renewal
request platform software sdwan csr upload bootflash:device.csr

! After signed cert received:
request platform software sdwan certificate install bootflash:signed-cert.pem
```

---

## 6.6.3 Data Plane Troubleshooting

### Tunnel Issues

#### IPsec Tunnel Diagnostic Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TUNNEL TROUBLESHOOTING FLOW                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────────┐                                                    │
│   │ Tunnel Down/Flap  │                                                    │
│   │ Detected          │                                                    │
│   └─────────┬─────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│   ┌───────────────────┐    No     ┌───────────────────────────────┐       │
│   │ Transport Link    │──────────>│ Check physical interface      │       │
│   │ Active?           │           │ Check ISP circuit             │       │
│   └─────────┬─────────┘           └───────────────────────────────┘       │
│             │ Yes                                                          │
│             ▼                                                               │
│   ┌───────────────────┐    No     ┌───────────────────────────────┐       │
│   │ BFD Session UP?   │──────────>│ Check BFD config & timers     │       │
│   │                   │           │ Verify path MTU               │       │
│   └─────────┬─────────┘           └───────────────────────────────┘       │
│             │ Yes                                                          │
│             ▼                                                               │
│   ┌───────────────────┐    No     ┌───────────────────────────────┐       │
│   │ IPsec SA Active?  │──────────>│ Check IKE negotiation         │       │
│   │                   │           │ Verify crypto config          │       │
│   └─────────┬─────────┘           └───────────────────────────────┘       │
│             │ Yes                                                          │
│             ▼                                                               │
│   ┌───────────────────┐    No     ┌───────────────────────────────┐       │
│   │ TLOC Advertised?  │──────────>│ Check color config            │       │
│   │                   │           │ Verify tunnel restrictions    │       │
│   └─────────┬─────────┘           └───────────────────────────────┘       │
│             │ Yes                                                          │
│             ▼                                                               │
│   ┌───────────────────────────────────────────────────────────────────┐   │
│   │ Check tunnel statistics, packet drops, MTU path discovery         │   │
│   └───────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tunnel Diagnostic Commands

```bash
! === TUNNEL STATUS ===

! View all SD-WAN tunnels
show sdwan tunnel statistics

! Check specific tunnel by color
show sdwan tunnel statistics | include mpls

! BFD session status
show sdwan bfd sessions

! Expected healthy output:
!                          DETECT   TX                              
! SYSTEM IP     SITE ID    STATE    MULT   INTERVAL   ECHO  COLOR   
! 10.100.1.1    1001       up       7      1000       1000  mpls
! 10.100.1.1    1001       up       7      1000       1000  biz-internet
! 10.100.2.1    1002       up       7      1000       1000  mpls

! === BFD TROUBLESHOOTING ===

! BFD summary
show sdwan bfd summary

! BFD history for flapping analysis
show sdwan bfd history

! BFD session detail
show sdwan bfd sessions detail

! === IPSEC TROUBLESHOOTING ===

! IPsec tunnel summary
show sdwan ipsec inbound-connections
show sdwan ipsec outbound-connections

! IPsec SA details
show crypto ipsec sa

! Check for replay errors
show sdwan ipsec pwk-stats

! === TUNNEL STATISTICS ===

! Packet counters
show sdwan tunnel statistics table

! Look for these problem indicators:
! - tx_pkts vs rx_pkts imbalance
! - High error counts
! - BFD flap counts
! - Tunnel uptime resets

! === MTU DIAGNOSTICS ===

! Check interface MTU
show interface | include MTU

! Path MTU discovery
show sdwan ipsec pmtu

! Test MTU path
ping <destination> size 1400 df-bit
```

### BFD Troubleshooting

| BFD Issue | Symptom | Cause | Resolution |
|-----------|---------|-------|------------|
| **BFD down** | Tunnel shows down | Path failure | Check transport circuit |
| **BFD flapping** | Intermittent connectivity | Congestion, latency | Adjust BFD timers |
| **High jitter** | Unstable BFD sessions | QoS issues | Apply QoS on transport |
| **One-way failure** | BFD timeout on one side | Asymmetric routing | Check return path |
| **Detect multiplier** | Quick failovers | Aggressive timers | Tune detect multiplier |

```bash
! === BFD TIMER TUNING ===

! Default BFD timers (may be too aggressive for some circuits)
! - TX interval: 1000ms
! - Detect multiplier: 7 (timeout = 7 seconds)

! Adjust BFD timers in system template for sensitive circuits
! vManage: Configuration > Templates > System > BFD

! Recommended for high-latency circuits:
! - TX interval: 1000ms
! - Detect multiplier: 15 (timeout = 15 seconds)

! Verify BFD timers
show sdwan bfd sessions | include INTERVAL

! Check BFD flap history
show sdwan bfd history | include state

! Example analysis of flapping tunnel:
! TIME                    SYSTEM IP     SITE      COLOR      STATE
! 2025-12-30T08:15:30    10.100.1.1    1001      mpls       down
! 2025-12-30T08:15:45    10.100.1.1    1001      mpls       up
! 2025-12-30T08:16:22    10.100.1.1    1001      mpls       down
! 2025-12-30T08:16:35    10.100.1.1    1001      mpls       up
! Action: Pattern suggests 15-20 second outages - increase multiplier
```

---

## 6.6.4 Routing Troubleshooting

### OMP Route Issues

```bash
! === OMP TROUBLESHOOTING ===

! OMP summary
show sdwan omp summary

! Expected healthy state:
! ADMIN STATE      OPER STATE       ROUTES RX   ROUTES TX   ROUTES INSTALLED
! enabled          connected        1547        423         1547

! Check OMP peers
show sdwan omp peers

! Verify OMP routes received
show sdwan omp routes

! Check specific VPN routes
show sdwan omp routes vpn 10

! TLOC advertisements
show sdwan omp tlocs

! Services advertisement
show sdwan omp services

! === OMP ROUTE ANALYSIS ===

! Why a route not received?
! 1. Check if advertised by peer
show sdwan omp routes vpn 10 | include <prefix>

! 2. Check for control policy blocking
show sdwan policy from-vsmart

! 3. Verify TLOC available for route
show sdwan omp tlocs advertised

! 4. Check affinity/restrictions
show sdwan omp routes vpn 10 detail | include affinity

! === BGP/OSPF SERVICE-SIDE ===

! BGP neighbors (SD-Access integration)
show ip bgp summary

! BGP routes from SD-Access border
show ip bgp vpnv4 vrf EMPLOYEE

! OSPF neighbors (if used)
show ip ospf neighbor
```

### Route Redistribution Issues

```bash
! === REDISTRIBUTION VERIFICATION ===

! Check OMP-to-BGP redistribution
show ip protocols vrf EMPLOYEE | section Redistributing

! Verify route origin
show ip route vrf EMPLOYEE <prefix> detail

! Check route leaking between VRFs
show sdwan policy service-route-policy

! === SD-ACCESS INTEGRATION ROUTING ===

! Verify BGP peering with SD-Access border
show ip bgp vpnv4 vrf EMPLOYEE summary

! Expected neighbor state: Established
! Neighbor        V  AS   MsgRcvd MsgSent  TblVer  InQ OutQ Up/Down  State/PfxRcd
! 10.100.10.1     4  65001   4523    4489     892    0    0 5d12h    125

! Routes received from SD-Access
show ip bgp vpnv4 vrf EMPLOYEE neighbors 10.100.10.1 received-routes

! Routes advertised to SD-Access
show ip bgp vpnv4 vrf EMPLOYEE neighbors 10.100.10.1 advertised-routes

! Check BGP route-map application
show route-map SDACCESS-TO-SDWAN
show route-map SDWAN-TO-SDACCESS
```

### Routing Loop Detection

```bash
! === ROUTING LOOP IDENTIFICATION ===

! Traceroute to detect loops
traceroute vrf EMPLOYEE <destination>

! Check for increasing hop count
! If same IP appears multiple times, routing loop exists

! Example loop detection:
! Type escape sequence to abort.
! Tracing the route to 10.50.1.100
!  1 10.100.1.1 5 msec 4 msec 3 msec
!  2 10.100.2.1 15 msec 14 msec 12 msec
!  3 10.100.1.1 25 msec 24 msec 22 msec    <-- LOOP DETECTED
!  4 10.100.2.1 35 msec 34 msec 33 msec    <-- LOOP DETECTED

! Check route preference
show ip route vrf EMPLOYEE <destination>

! Verify OMP path selection
show sdwan omp routes vpn 10 <prefix> detail

! Check TLOC preference
show sdwan omp tlocs | include preference
```

---

## 6.6.5 Policy Troubleshooting

### Application-Aware Routing Issues

```bash
! === AAR TROUBLESHOOTING ===

! Check app-route statistics
show sdwan app-route stats

! View SLA class definitions
show sdwan policy sla-class

! Check path loss/latency/jitter
show sdwan app-route statistics

! Example output:
! REMOTE          LOCAL           LOCAL   TOTAL   LOSS   LATENCY   JITTER
! SYSTEM IP       COLOR           COLOR   PKTS    %      MS        MS
! 10.100.1.1      mpls            mpls    54892   0.01   12        3
! 10.100.1.1      biz-internet    biz-internet 43221 0.05 25      8

! === SLA VERIFICATION ===

! Check if SLA being met
show sdwan policy app-route-policy-filter

! View current path selection
show sdwan policy access-list-counters

! Check AAR policy matches
show sdwan app-route sla-class

! === AAR NOT WORKING SCENARIOS ===

! Scenario 1: Traffic not matching AAR policy
! Check app recognition
show sdwan app-dpi flows | include <app-name>

! Scenario 2: Wrong path selected
! Verify SLA metrics
show sdwan app-route stats | include <color>

! Scenario 3: No failover occurring
! Check backup SLA class
show sdwan policy app-route-policy
```

### Data Policy Issues

```bash
! === DATA POLICY TROUBLESHOOTING ===

! Check active data policy
show sdwan policy data-policy-filter

! Policy statistics
show sdwan policy access-list-counters

! Verify policy from vSmart
show sdwan policy from-vsmart

! === POLICY NOT APPLYING ===

! Step 1: Verify policy pushed from vManage
! vManage: Monitor > Devices > <device> > Real Time > Policy

! Step 2: Check policy installed on device
show sdwan policy access-list

! Step 3: Verify traffic matching
show sdwan policy access-list-counters

! Step 4: Check policy sequence order
show sdwan policy access-list detail

! === TRAFFIC NOT MATCHING POLICY ===

! Check source/destination match
show sdwan policy data-policy-filter

! Verify VPN match
show sdwan policy access-list | include vpn

! Check app match
show sdwan app-dpi flows active
```

### Control Policy Issues

```bash
! === CONTROL POLICY VERIFICATION ===

! Policy received from vSmart
show sdwan policy from-vsmart

! Check route filtering
show sdwan omp routes | include filtered

! Verify TLOC restrictions
show sdwan omp tlocs | include restrict

! === ROUTES NOT RECEIVED ===

! Step 1: Check if route exists on originating site
! On source device:
show sdwan omp routes advertised vpn 10

! Step 2: Check vSmart control policy
! On vSmart:
show running-config policy

! Step 3: Verify no TLOC restrictions
show sdwan omp tlocs

! Step 4: Check route preference/communities
show sdwan omp routes vpn 10 detail
```

---

## 6.6.6 Application Performance Issues

### DPI and Application Recognition

```bash
! === DPI TROUBLESHOOTING ===

! Check DPI status
show sdwan app-dpi status

! View active flows
show sdwan app-dpi flows

! Check specific application
show sdwan app-dpi flows | include teams

! Application statistics
show sdwan app-dpi statistics

! === APPLICATION NOT RECOGNIZED ===

! Verify DPI enabled
show sdwan running-config | include app-visibility

! Check application family
show sdwan app-dpi applications | include <app-name>

! Custom application verification
show sdwan app-dpi custom-applications

! === CLOUD APPLICATION ISSUES ===

! Check Cloud OnRamp for SaaS status
show sdwan cloudexpress applications

! View cloud path selection
show sdwan cloudexpress path-metrics

! Office 365 optimization status
show sdwan cloudexpress o365

! === APPQOE TROUBLESHOOTING ===

! Check AppQoE status
show sdwan appqoe status

! TCP optimization statistics
show sdwan appqoe tcpopt statistics

! DRE optimization statistics
show sdwan appqoe dreopt statistics
```

### QoS Issues

```bash
! === QOS VERIFICATION ===

! Check queue configuration
show policy-map interface <interface>

! View queue statistics
show class-map

! Check DSCP markings
show sdwan policy qos-map

! === QOS NOT WORKING ===

! Step 1: Verify QoS policy applied
show running-config | section policy-map

! Step 2: Check interface service-policy
show interface <interface> | include Service

! Step 3: Verify traffic classification
show class-map type inspect match-any

! Step 4: Check queue depths and drops
show policy-map interface <interface>

! Look for:
! - packets dropped (queue overflow)
! - Class-map match conditions
! - Queue priority level

! === VOICE/VIDEO QUALITY ISSUES ===

! Check EF queue
show policy-map interface <wan-interface> | include priority

! Verify DSCP preservation
show sdwan tunnel statistics | include dscp

! Check jitter buffer statistics
show sdwan app-route stats | include JITTER
```

---

## 6.6.7 SD-Access Integration Troubleshooting

### Fabric Handoff Issues

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SD-ACCESS INTEGRATION TROUBLESHOOTING                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   SD-Access                    SD-WAN                                       │
│   Border Node                  WAN Edge                                     │
│   ┌──────────┐                ┌──────────┐                                 │
│   │          │  VRF-Lite/BGP  │          │                                 │
│   │  Border  │◄──────────────►│  C8300   │                                 │
│   │  C9500   │    802.1Q      │  WAN     │                                 │
│   │          │    Trunk       │  Edge    │                                 │
│   └──────────┘                └──────────┘                                 │
│                                                                             │
│   Check Points:                                                             │
│   1. Physical connectivity (trunk link)                                     │
│   2. VLAN/subinterface configuration                                       │
│   3. VRF mapping consistency                                               │
│   4. BGP peering state                                                     │
│   5. Route exchange                                                        │
│   6. SGT propagation                                                       │
│   7. End-to-end traffic flow                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### SD-Access Integration Commands

```bash
! === PHYSICAL LAYER ===

! Check trunk interface
show interface GigabitEthernet0/0/0

! Verify trunk status
show interface GigabitEthernet0/0/0 trunk

! Check subinterfaces
show interface GigabitEthernet0/0/0.100

! === VRF VERIFICATION ===

! List VRFs
show vrf

! Expected VRFs (matching SD-Access VNs):
! Name             Default RD          Protocols
! EMPLOYEE         65001:10            ipv4
! GUEST            65001:20            ipv4
! IOT              65001:30            ipv4
! VOICE            65001:40            ipv4
! SHARED           65001:50            ipv4

! Check VRF interfaces
show vrf interface

! Verify VRF routing table
show ip route vrf EMPLOYEE

! === BGP TROUBLESHOOTING ===

! BGP summary per VRF
show ip bgp vpnv4 vrf EMPLOYEE summary

! Expected state: Established with prefixes
! Neighbor        V  AS   MsgRcvd MsgSent  TblVer  InQ OutQ Up/Down  State/PfxRcd
! 10.100.10.1     4  65001   5234    5189     935    0    0 7d04h    142

! If state shows "Active" or "Idle":
! 1. Check physical connectivity
! 2. Verify BGP neighbor IP
! 3. Check AS number match
! 4. Verify authentication (if configured)

! BGP detailed neighbor info
show ip bgp vpnv4 vrf EMPLOYEE neighbors 10.100.10.1

! BGP routes received
show ip bgp vpnv4 vrf EMPLOYEE neighbors 10.100.10.1 routes

! BGP routes advertised
show ip bgp vpnv4 vrf EMPLOYEE neighbors 10.100.10.1 advertised-routes

! === SGT/TRUSTSEC TROUBLESHOOTING ===

! Check CTS status
show cts interface summary

! Verify SGT propagation
show cts role-based sgt-map all

! Expected SGT mappings:
! IPv4           SGT       Source
! 10.10.10.0/24  5         LEARNED
! 10.10.20.0/24  7         LEARNED

! Check inline tagging on WAN interface
show cts interface GigabitEthernet0/0/0.100

! Verify SGT on traffic
show platform hardware qfp active feature cts datapath
```

### Common SD-Access Integration Issues

| Issue | Symptom | Diagnosis | Resolution |
|-------|---------|-----------|------------|
| **BGP not establishing** | Neighbor stuck in Active | Check physical link, BGP config | Verify neighbor IP, AS number |
| **Routes not exchanged** | Empty BGP table | Check route-map filters | Review import/export policies |
| **VRF mismatch** | Traffic black-holed | show vrf, show ip route vrf | Align VRF names and RDs |
| **SGT not propagating** | No SGT in sgt-map | Check CTS config | Enable inline tagging |
| **Subinterface down** | Protocol down | show interface status | Check encapsulation, VLAN |
| **Asymmetric routing** | Traffic drops | Traceroute both directions | Verify return path routing |

### End-to-End Connectivity Test

```bash
! === END-TO-END VERIFICATION ===

! Test from WAN Edge to SD-Access endpoint
ping vrf EMPLOYEE 10.10.10.100 source 10.50.1.1

! Traceroute through fabric
traceroute vrf EMPLOYEE 10.10.10.100

! Expected path:
! 1. WAN Edge subinterface (10.100.10.2)
! 2. SD-Access border (10.100.10.1)
! 3. Fabric internal node
! 4. Destination (10.10.10.100)

! === VERIFY AT SD-ACCESS BORDER ===
! (Run on SD-Access border node)

! Check BGP neighbor from SD-WAN
show ip bgp vpnv4 vrf EMPLOYEE summary

! Verify routes from SD-WAN
show ip bgp vpnv4 vrf EMPLOYEE

! Check LISP to SD-WAN route redistribution
show lisp site

! === PACKET CAPTURE ===

! Capture on handoff interface
monitor capture CAP interface Gi0/0/0.100 both
monitor capture CAP match ipv4 host 10.10.10.100
monitor capture CAP start
! Generate traffic
monitor capture CAP stop
show monitor capture CAP buffer brief
```

---

## 6.6.8 High Availability Troubleshooting

### Controller HA Issues

```bash
! === VMANAGE CLUSTER TROUBLESHOOTING ===

! Check cluster status via API
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/clusterManagement/list" \
  -H "Cookie: JSESSIONID=${SESSION}"

! Check cluster health
! Response should show all nodes as "normal"

! Node sync status
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/clusterManagement/health/details" \
  -H "Cookie: JSESSIONID=${SESSION}"

! === VSMART TROUBLESHOOTING ===

! Check vSmart OMP state
show sdwan omp peers

! Verify all vSmarts reachable
! Each WAN Edge should have connection to both vSmarts

! vSmart sync status
show running-config system | include vSmart

! === CONTROLLER FAILOVER VERIFICATION ===

! Simulate vSmart failure
! 1. Note current active vSmart from WAN Edge
show sdwan control connections | include vsmart

! 2. After failover, verify switchover
show sdwan control connections | include vsmart

! 3. Check OMP route reconvergence time
show sdwan omp routes vpn 10 | include age
```

### WAN Edge HA Issues

```bash
! === DUAL WAN EDGE VERIFICATION ===

! Check both WAN Edges at site
! Mumbai Hub Site Example:
! IN-MUM-WAN-EDGE-01: Primary
! IN-MUM-WAN-EDGE-02: Secondary

! On IN-MUM-WAN-EDGE-01
show sdwan control connections
show sdwan omp routes

! On IN-MUM-WAN-EDGE-02
show sdwan control connections
show sdwan omp routes

! Both should have identical control connections and routes

! === FAILOVER TESTING ===

! Simulate primary failure
! 1. Note traffic path before failure
show sdwan app-route stats | include IN-MUM

! 2. Shut primary transport
interface GigabitEthernet0/0/0
shutdown

! 3. Verify traffic shifts to secondary
show sdwan app-route stats | include IN-MUM

! 4. Check convergence time
show sdwan bfd history | include IN-MUM

! 5. Restore primary
interface GigabitEthernet0/0/0
no shutdown

! 6. Verify traffic rebalances
show sdwan app-route stats | include IN-MUM
```

### Transport Failover Issues

```bash
! === TRANSPORT FAILOVER TROUBLESHOOTING ===

! Current path selection
show sdwan app-route sla-class

! Check MPLS vs Internet metrics
show sdwan app-route stats

! Example comparison:
! COLOR         LOSS%   LATENCY(ms)  JITTER(ms)
! mpls          0.01    12           3
! biz-internet  0.05    28           8

! === FAILOVER NOT OCCURRING ===

! Step 1: Check SLA class thresholds
show sdwan policy sla-class

! Step 2: Verify AAR policy
show sdwan policy app-route-policy

! Step 3: Check BFD detecting failure
show sdwan bfd sessions

! Step 4: Verify tunnel available
show sdwan tunnel statistics

! === SLOW FAILOVER ===

! Check BFD timers
show sdwan bfd sessions detail | include multiplier

! Adjust for faster detection:
! - Decrease TX interval (min 100ms)
! - Decrease detect multiplier

! Check OMP holdtime
show sdwan omp summary

! === TRAFFIC NOT RETURNING TO PRIMARY ===

! Check TLOC preference
show sdwan omp tlocs | include preference

! Verify no sticky path selection
show sdwan policy app-route-policy | include preferred-color
```

---

## 6.6.9 Performance Troubleshooting

### Latency Issues

```bash
! === LATENCY DIAGNOSIS ===

! Check tunnel latency
show sdwan app-route stats | include LATENCY

! Compare with baseline
! Baseline values:
! Mumbai-Chennai: 15ms MPLS / 25ms Internet
! Mumbai-London: 140ms MPLS / 160ms Internet

! If latency significantly higher:
! 1. Check transport provider SLA
! 2. Verify no congestion on circuit
! 3. Check for routing loops

! === LATENCY BREAKDOWN ===

! End-to-end latency components:
! - WAN transport latency (measure with ping to ISP PE)
! - Tunnel encryption overhead (~1-2ms)
! - QoS queuing delay (check queue depths)

! Test transport latency
ping <ISP-PE-IP> repeat 100

! Check overlay latency
show sdwan app-route stats

! === TCP OPTIMIZATION FOR LATENCY ===

! Enable TCP optimization
show sdwan appqoe tcpopt status

! Check TCP RTT
show sdwan appqoe tcpopt connections detail
```

### Throughput Issues

```bash
! === THROUGHPUT DIAGNOSIS ===

! Check interface utilization
show interface GigabitEthernet0/0/0 | include rate

! Example output:
! 5 minute input rate 450000000 bits/sec, 45000 packets/sec
! 5 minute output rate 520000000 bits/sec, 52000 packets/sec

! Circuit capacity check
! If utilization > 80%, consider upgrade

! === TUNNEL THROUGHPUT ===

! Check tunnel statistics
show sdwan tunnel statistics

! Look for:
! - Drops due to queue overflow
! - IPsec performance limits
! - BFD keeping tunnel utilized

! Check crypto accelerator
show platform hardware qfp active feature ipsec data

! === BANDWIDTH LIMITING ===

! Check if bandwidth limit applied
show sdwan running-config interface | include bandwidth

! Check shaper configuration
show policy-map interface <interface>

! === THROUGHPUT TEST ===

! Use iperf for baseline test (if available)
! Install iperf on WAN Edge for testing

! Alternative: Use vManage speed test
! Monitor > Network > <device> > Troubleshooting > Speed Test
```

### Packet Loss Diagnosis

```bash
! === PACKET LOSS ANALYSIS ===

! Check tunnel loss
show sdwan app-route stats | include LOSS

! Check interface errors
show interface GigabitEthernet0/0/0 | include error|drop|CRC

! Example problematic output:
! 5 minute input rate 450000000 bits/sec
!    12345 input errors, 234 CRC, 0 frame, 0 overrun
!    5678 output drops

! === IDENTIFY LOSS LOCATION ===

! Step 1: Check transport (underlay) loss
ping <ISP-PE-IP> repeat 1000 size 1400

! Step 2: Check overlay loss
show sdwan app-route stats

! Step 3: Check QoS drops
show policy-map interface <interface>

! === COMMON LOSS CAUSES ===

! 1. Circuit congestion
show interface <interface> | include output drops

! 2. QoS tail drops
show policy-map interface <interface> | include drops

! 3. IPsec anti-replay drops
show sdwan ipsec pwk-stats | include replay

! 4. MTU fragmentation
show interface <interface> | include MTU
show sdwan ipsec pmtu
```

---

## 6.6.10 Troubleshooting Scripts

### Python Diagnostic Script

```python
#!/usr/bin/env python3
"""
SD-WAN Comprehensive Diagnostic Script
Abhavtech.com - December 2025
"""

import requests
import json
import urllib3
from datetime import datetime
from typing import Dict, List, Any

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class SDWANDiagnostics:
    """SD-WAN diagnostic automation"""
    
    def __init__(self, vmanage_host: str, username: str, password: str):
        self.vmanage_host = vmanage_host
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
    
    def authenticate(self, username: str, password: str):
        """Authenticate to vManage"""
        login_url = f"{self.base_url}/j_security_check"
        payload = {
            'j_username': username,
            'j_password': password
        }
        response = self.session.post(login_url, data=payload)
        
        # Get XSRF token
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
    
    def get_device_status(self) -> List[Dict]:
        """Get all device status"""
        url = f"{self.base_url}/dataservice/device"
        response = self.session.get(url)
        return response.json().get('data', [])
    
    def get_control_connections(self, device_ip: str) -> List[Dict]:
        """Get control connections for device"""
        url = f"{self.base_url}/dataservice/device/control/connections"
        params = {'deviceId': device_ip}
        response = self.session.get(url, params=params)
        return response.json().get('data', [])
    
    def get_tunnel_status(self, device_ip: str) -> List[Dict]:
        """Get tunnel status for device"""
        url = f"{self.base_url}/dataservice/device/tunnel"
        params = {'deviceId': device_ip}
        response = self.session.get(url, params=params)
        return response.json().get('data', [])
    
    def get_bfd_sessions(self, device_ip: str) -> List[Dict]:
        """Get BFD sessions for device"""
        url = f"{self.base_url}/dataservice/device/bfd/sessions"
        params = {'deviceId': device_ip}
        response = self.session.get(url, params=params)
        return response.json().get('data', [])
    
    def get_alarms(self) -> List[Dict]:
        """Get active alarms"""
        url = f"{self.base_url}/dataservice/alarms"
        response = self.session.get(url)
        return response.json().get('data', [])
    
    def get_omp_routes(self, device_ip: str, vpn: str = None) -> List[Dict]:
        """Get OMP routes for device"""
        url = f"{self.base_url}/dataservice/device/omp/routes"
        params = {'deviceId': device_ip}
        if vpn:
            params['vpn'] = vpn
        response = self.session.get(url, params=params)
        return response.json().get('data', [])
    
    def run_diagnostics(self) -> Dict[str, Any]:
        """Run comprehensive diagnostics"""
        print("=" * 60)
        print("SD-WAN COMPREHENSIVE DIAGNOSTICS")
        print(f"Timestamp: {datetime.now().isoformat()}")
        print("=" * 60)
        
        results = {
            'timestamp': datetime.now().isoformat(),
            'overall_status': 'HEALTHY',
            'issues': [],
            'devices': []
        }
        
        # Get all devices
        devices = self.get_device_status()
        print(f"\nFound {len(devices)} devices")
        
        for device in devices:
            device_ip = device.get('system-ip')
            hostname = device.get('host-name')
            reachability = device.get('reachability')
            
            device_result = {
                'hostname': hostname,
                'system_ip': device_ip,
                'reachability': reachability,
                'issues': []
            }
            
            print(f"\n--- Diagnosing {hostname} ({device_ip}) ---")
            
            # Check reachability
            if reachability != 'reachable':
                issue = f"Device {hostname} is {reachability}"
                device_result['issues'].append(issue)
                results['issues'].append(issue)
                results['overall_status'] = 'CRITICAL'
                print(f"  [CRITICAL] {issue}")
                continue
            
            # Check control connections
            connections = self.get_control_connections(device_ip)
            expected_connections = ['vbond', 'vsmart', 'vmanage']
            
            for conn_type in expected_connections:
                conn_found = False
                for conn in connections:
                    if conn.get('peer-type') == conn_type and conn.get('state') == 'up':
                        conn_found = True
                        break
                
                if not conn_found:
                    issue = f"{hostname}: Missing {conn_type} connection"
                    device_result['issues'].append(issue)
                    results['issues'].append(issue)
                    results['overall_status'] = 'WARNING'
                    print(f"  [WARNING] {issue}")
            
            # Check tunnels
            tunnels = self.get_tunnel_status(device_ip)
            tunnels_down = [t for t in tunnels if t.get('tunnel-state') != 'up']
            
            if tunnels_down:
                issue = f"{hostname}: {len(tunnels_down)} tunnels down"
                device_result['issues'].append(issue)
                results['issues'].append(issue)
                results['overall_status'] = 'WARNING'
                print(f"  [WARNING] {issue}")
            else:
                print(f"  [OK] All {len(tunnels)} tunnels up")
            
            # Check BFD sessions
            bfd_sessions = self.get_bfd_sessions(device_ip)
            bfd_down = [b for b in bfd_sessions if b.get('state') != 'up']
            
            if bfd_down:
                issue = f"{hostname}: {len(bfd_down)} BFD sessions down"
                device_result['issues'].append(issue)
                results['issues'].append(issue)
                print(f"  [WARNING] {issue}")
            else:
                print(f"  [OK] All BFD sessions healthy")
            
            results['devices'].append(device_result)
        
        # Check alarms
        alarms = self.get_alarms()
        critical_alarms = [a for a in alarms if a.get('severity') == 'Critical']
        
        if critical_alarms:
            results['overall_status'] = 'CRITICAL'
            for alarm in critical_alarms[:5]:  # Show top 5
                issue = f"Critical alarm: {alarm.get('message')}"
                results['issues'].append(issue)
                print(f"\n[CRITICAL ALARM] {alarm.get('message')}")
        
        # Summary
        print("\n" + "=" * 60)
        print("DIAGNOSTIC SUMMARY")
        print("=" * 60)
        print(f"Overall Status: {results['overall_status']}")
        print(f"Devices Checked: {len(results['devices'])}")
        print(f"Issues Found: {len(results['issues'])}")
        
        if results['issues']:
            print("\nIssue List:")
            for i, issue in enumerate(results['issues'], 1):
                print(f"  {i}. {issue}")
        
        return results

def main():
    """Main diagnostic execution"""
    # Configuration
    VMANAGE_HOST = "vmanage.abhavtech.com"
    USERNAME = "admin"
    PASSWORD = "secure_password"
    
    # Run diagnostics
    diag = SDWANDiagnostics(VMANAGE_HOST, USERNAME, PASSWORD)
    results = diag.run_diagnostics()
    
    # Save results
    output_file = f"sdwan_diagnostics_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to: {output_file}")

if __name__ == "__main__":
    main()
```

### Bash Quick Diagnostic Script

```bash
#!/bin/bash
#
# SD-WAN Quick Health Check Script
# Abhavtech.com - December 2025
#

echo "=============================================="
echo "SD-WAN Quick Health Check"
echo "Timestamp: $(date)"
echo "=============================================="

# Check control connections
echo -e "\n--- Control Connections ---"
show sdwan control connections

# Check device health
echo -e "\n--- Device Health ---"
show sdwan system status

# Check tunnels
echo -e "\n--- Tunnel Status ---"
show sdwan tunnel statistics | head -20

# Check BFD
echo -e "\n--- BFD Sessions ---"
show sdwan bfd sessions

# Check alarms
echo -e "\n--- Active Alarms ---"
show sdwan notification stream viptela | tail -20

# Check CPU/Memory
echo -e "\n--- Resource Utilization ---"
show processes cpu platform sorted | head -10
show platform hardware qfp active datapath utilization

# Check interfaces
echo -e "\n--- Interface Status ---"
show ip interface brief | exclude unassigned

# OMP summary
echo -e "\n--- OMP Summary ---"
show sdwan omp summary

echo -e "\n=============================================="
echo "Health check complete"
echo "=============================================="
```

---

## 6.6.11 Troubleshooting Checklist

### Quick Reference Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SD-WAN TROUBLESHOOTING CHECKLIST                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ □ CONTROL PLANE                                                            │
│   □ show sdwan control connections          - All controllers up?          │
│   □ show sdwan certificate installed        - Certs valid?                 │
│   □ show sdwan omp summary                  - OMP established?             │
│   □ show sdwan omp peers                    - vSmart peers up?             │
│                                                                             │
│ □ DATA PLANE                                                               │
│   □ show sdwan tunnel statistics            - Tunnels up?                  │
│   □ show sdwan bfd sessions                 - BFD healthy?                 │
│   □ show sdwan ipsec inbound-connections    - IPsec active?                │
│   □ show interface brief                    - Physical links up?           │
│                                                                             │
│ □ ROUTING                                                                  │
│   □ show sdwan omp routes vpn <vpn>         - Routes received?             │
│   □ show ip route vrf <vrf>                 - Routes installed?            │
│   □ show ip bgp vpnv4 vrf <vrf> summary     - BGP established?             │
│                                                                             │
│ □ POLICIES                                                                 │
│   □ show sdwan policy from-vsmart           - Policy applied?              │
│   □ show sdwan policy access-list-counters  - Traffic matching?            │
│   □ show sdwan app-route sla-class          - AAR working?                 │
│                                                                             │
│ □ PERFORMANCE                                                              │
│   □ show sdwan app-route stats              - Latency/loss/jitter OK?      │
│   □ show policy-map interface <int>         - QoS working?                 │
│   □ show interface <int> | include rate     - Bandwidth OK?                │
│                                                                             │
│ □ SD-ACCESS INTEGRATION                                                    │
│   □ show ip bgp vpnv4 vrf <vrf> summary     - BGP to border up?            │
│   □ show cts interface summary              - TrustSec enabled?            │
│   □ show cts role-based sgt-map all         - SGTs learned?                │
│                                                                             │
│ □ RESOURCES                                                                │
│   □ show processes cpu platform sorted      - CPU <80%?                    │
│   □ show platform software status control   - Memory <80%?                 │
│   □ show sdwan notification stream viptela  - Recent alarms?               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.6.12 Escalation Procedures

### When to Escalate to Cisco TAC

| Scenario | Pre-TAC Requirements | TAC Severity |
|----------|---------------------|--------------|
| **Controller cluster failure** | Collect admin-tech, cluster logs | Severity 1 |
| **Multiple site outage** | Document affected sites, collect logs | Severity 1 |
| **Persistent tunnel failures** | BFD history, tunnel stats, packet captures | Severity 2 |
| **Certificate issues** | Certificate chain, serial numbers | Severity 2 |
| **Software defects** | Bug ID if known, show version, admin-tech | Severity 3 |
| **Feature questions** | Documentation reference | Severity 4 |

### Admin-Tech Collection

```bash
! Collect admin-tech for TAC case
request admin-tech

! Save to specific location
request admin-tech bootflash:admin-tech-20251230.tar.gz

! Transfer to external server
copy bootflash:admin-tech-20251230.tar.gz scp:
```

### Information for TAC Case

```yaml
TAC Case Information Checklist:
  
  Environment:
    - SD-WAN Manager version: 20.15.x
    - WAN Edge software: IOS-XE 17.15.x
    - Number of devices: 22 WAN Edges
    - Network topology: Hub and spoke with partial mesh
    
  Issue Description:
    - Symptom: [Clear description]
    - Impact: [Business impact]
    - Timeline: [When started, duration]
    - Scope: [Affected devices/sites]
    
  Troubleshooting Done:
    - Steps taken: [List]
    - Commands run: [List with output]
    - Changes made: [Before issue started]
    
  Attachments:
    - Admin-tech from affected devices
    - vManage support bundle
    - Relevant show command outputs
    - Network topology diagram
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 30, 2025 | Abhavtech | Initial troubleshooting guide |

---

**Document Classification:** Internal Use
**Next Review Date:** March 30, 2026
