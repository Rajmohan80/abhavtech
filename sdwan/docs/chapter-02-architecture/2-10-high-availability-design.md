# 2.10 High Availability Design

## Document Information
| Field | Value |
|-------|-------|
| Document Title | High Availability Design |
| Section Number | 2.10 |
| Version | 1.0 |
| Last Updated | December 30, 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 2.10.1 HA Architecture Overview

### Availability Requirements

| Component | Target Availability | Max Downtime/Year | Recovery Time Objective |
|-----------|---------------------|-------------------|------------------------|
| Control Plane | 99.999% | 5.26 minutes | <30 seconds |
| Data Plane | 99.99% | 52.6 minutes | <5 seconds |
| Management Plane | 99.9% | 8.76 hours | <15 minutes |
| Overall SD-WAN | 99.99% | 52.6 minutes | <60 seconds |

### HA Design Principles

```
                         HA DESIGN PRINCIPLES
+==============================================================================+
|                                                                              |
|   1. NO SINGLE POINT OF FAILURE                                             |
|   +------------------------------------------------------------------+      |
|   | - Dual controllers per region                                    |      |
|   | - Dual WAN edges at hub sites                                   |      |
|   | - Multiple transport paths                                       |      |
|   | - Geo-redundant management                                       |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
|   2. GRACEFUL DEGRADATION                                                   |
|   +------------------------------------------------------------------+      |
|   | - Continue operations during controller failure                  |      |
|   | - Maintain forwarding during management failure                 |      |
|   | - Automatic path failover during transport failure              |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
|   3. FAST CONVERGENCE                                                       |
|   +------------------------------------------------------------------+      |
|   | - BFD for sub-second detection                                  |      |
|   | - Pre-computed backup paths                                     |      |
|   | - Stateful failover where possible                             |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
|   4. CONSISTENT POLICY                                                      |
|   +------------------------------------------------------------------+      |
|   | - Policy sync across controllers                                |      |
|   | - Configuration persistence on WAN edges                        |      |
|   | - Graceful restart during upgrades                              |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
+==============================================================================+
```

---

## 2.10.2 Controller HA Design

### vManage Cluster Architecture

```
                    vMANAGE CLUSTER HA ARCHITECTURE
+==============================================================================+
|                                                                              |
|   MUMBAI DC (PRIMARY)                    CHENNAI DR (DISASTER RECOVERY)     |
|   +---------------------------+          +---------------------------+       |
|   |                           |          |                           |       |
|   |   +-------+ +-------+     |          |     +-------+ +-------+   |       |
|   |   |vMng-1 | |vMng-2 |     |          |     |vMng-4 | |vMng-5 |   |       |
|   |   |Active | |Active |     |          |     |Standby| |Standby|   |       |
|   |   +---+---+ +---+---+     |          |     +---+---+ +---+---+   |       |
|   |       |         |         |          |         |         |       |       |
|   |       +----+----+         |          |         +----+----+       |       |
|   |            |              |          |              |            |       |
|   |       +----+----+         |          |         +----+----+       |       |
|   |       |vMng-3   |         |          |         |vMng-6   |       |       |
|   |       |Active   |         |          |         |Standby  |       |       |
|   |       +---------+         |          |         +---------+       |       |
|   |                           |          |                           |       |
|   |   Cluster Network:        |          |   Cluster Network:        |       |
|   |   192.168.1.0/24          |  Async   |   192.168.2.0/24          |       |
|   |                           |  Repl.   |                           |       |
|   |   Services:               |<========>|   Services:               |       |
|   |   - Config DB (Raft)      |  15 min  |   - Config DB (Replica)   |       |
|   |   - Stats DB (Distrib)    |  RPO     |   - Stats DB (Replica)    |       |
|   |   - Application Server    |          |   - Application Server    |       |
|   |   - NMS                   |          |   - NMS                   |       |
|   |                           |          |                           |       |
|   +---------------------------+          +---------------------------+       |
|                                                                              |
|   FAILOVER:                                                                  |
|   - Intra-cluster: Automatic (<30 sec), handled by Raft consensus           |
|   - Inter-site (DR): Manual activation, RPO 15 min, RTO 30 min             |
|                                                                              |
+==============================================================================+
```

### vSmart Controller HA

| Location | Primary vSmart | Secondary vSmart | Affinity |
|----------|----------------|------------------|----------|
| Mumbai DC | vSmart-1 (10.255.255.1) | vSmart-2 (10.255.255.2) | India Region |
| Chennai DR | vSmart-3 (10.255.255.3) | vSmart-4 (10.255.255.4) | EMEA/Americas |

**vSmart Failover Behavior:**

```
!======================================================================
! vSMART HA BEHAVIOR
!======================================================================
!
! Normal Operation:
! - WAN Edges connect to both vSmarts in their affinity group
! - OMP sessions active to all reachable vSmarts
! - Routes learned from all vSmarts (best path selection)
!
! Failover Scenario (vSmart-1 failure):
! - BFD detects failure in <3 seconds
! - WAN Edges continue with vSmart-2
! - OMP graceful restart preserves routes for 12 hours
! - No traffic disruption (data plane independent)
!
! Recovery:
! - vSmart-1 rejoins cluster
! - OMP sessions re-established
! - Route sync automatic
!
! Configuration:
omp
 graceful-restart
 timers
  graceful-restart-timer 43200
  holdtime 60
  advertisement-interval 1
```

### vBond Orchestrator HA

```
                    vBOND HA ARCHITECTURE
+==============================================================================+
|                                                                              |
|   CLOUD-HOSTED vBOND (ACTIVE-ACTIVE)                                        |
|                                                                              |
|   +---------------------------+          +---------------------------+       |
|   |   AWS ap-south-1          |          |   AWS eu-west-1           |       |
|   |   (Mumbai Region)         |          |   (Ireland Region)        |       |
|   |                           |          |                           |       |
|   |   +-------------------+   |          |   +-------------------+   |       |
|   |   | vBond-1           |   |          |   | vBond-2           |   |       |
|   |   | 13.234.xxx.xxx    |   |          |   | 52.214.xxx.xxx    |   |       |
|   |   | c5.large          |   |          |   | c5.large          |   |       |
|   |   +-------------------+   |          |   +-------------------+   |       |
|   |                           |          |                           |       |
|   +---------------------------+          +---------------------------+       |
|                    |                                  |                      |
|                    +----------------+-----------------+                      |
|                                     |                                        |
|                              +------+------+                                 |
|                              | Route 53    |                                 |
|                              | Latency DNS |                                 |
|                              | vbond.      |                                 |
|                              | abhavtech.  |                                 |
|                              | com         |                                 |
|                              +-------------+                                 |
|                                                                              |
|   DNS RESOLUTION:                                                           |
|   - India/APAC clients -> vBond-1 (Mumbai)                                 |
|   - EMEA/Americas clients -> vBond-2 (Ireland)                             |
|   - Automatic failover via Route 53 health checks                          |
|                                                                              |
+==============================================================================+
```

---

## 2.10.3 WAN Edge HA Design

### Site HA Models

| Site Type | HA Model | Devices | Failover Time |
|-----------|----------|---------|---------------|
| Data Center | Active-Active | 2x C8500 | <1 second |
| Regional Hub | Active-Active | 2x C8300 | <1 second |
| Large Branch | Active-Standby | 2x C8200L | <5 seconds |
| Small Branch | Single Device | 1x C8200L | N/A (transport redundancy) |

### Active-Active Configuration (Hub Sites)

```
                    ACTIVE-ACTIVE WAN EDGE HA
+==============================================================================+
|                                                                              |
|   MUMBAI DC - ACTIVE-ACTIVE                                                 |
|                                                                              |
|   +------------------------+          +------------------------+            |
|   |     WAN EDGE 1         |          |     WAN EDGE 2         |            |
|   |     C8500-12X4QC       |          |     C8500-12X4QC       |            |
|   |     10.1.100.1         |          |     10.1.100.2         |            |
|   |                        |          |                        |            |
|   | Transport:             |          | Transport:             |            |
|   | - MPLS (Te0/0/0)       |          | - MPLS (Te0/0/0)       |            |
|   | - DIA (Te0/0/1)        |          | - DIA (Te0/0/1)        |            |
|   | - 5G (Cell0/4/0)       |          | - 5G (Cell0/4/0)       |            |
|   |                        |          |                        |            |
|   | Service VPNs:          |          | Service VPNs:          |            |
|   | - VPN 10 (Corporate)   |          | - VPN 10 (Corporate)   |            |
|   | - VPN 20 (Guest)       |          | - VPN 20 (Guest)       |            |
|   | - VPN 40 (Voice)       |          | - VPN 40 (Voice)       |            |
|   |                        |          |                        |            |
|   +----------+-------------+          +----------+-------------+            |
|              |                                   |                          |
|              |   ECMP LOAD BALANCING            |                          |
|              +----------------+-----------------+                          |
|                               |                                             |
|                        +------+------+                                      |
|                        | L3 Switch   |                                      |
|                        | (Core)      |                                      |
|                        +-------------+                                      |
|                                                                              |
|   TRAFFIC DISTRIBUTION:                                                     |
|   - 50/50 load sharing via ECMP                                            |
|   - Per-flow load balancing                                                |
|   - Independent tunnel sets per device                                     |
|   - BFD monitors both paths                                                |
|                                                                              |
+==============================================================================+
```

### Active-Standby Configuration (Branch Sites)

```
!======================================================================
! ACTIVE-STANDBY WAN EDGE CONFIGURATION - BANGALORE
!======================================================================
!
! Primary WAN Edge (Active)
system
 system-ip             10.1.103.1
 site-id               103
 organization-name     ABHAVTECH-COM
!
! TLOC Preference (Higher = Preferred)
interface GigabitEthernet0/0/0
 sdwan
  tunnel-interface
   color biz-internet
   encapsulation ipsec weight 1
   tloc-extension GigabitEthernet0/0/1
!
! Secondary WAN Edge (Standby)
system
 system-ip             10.1.103.2
 site-id               103
 organization-name     ABHAVTECH-COM
!
interface GigabitEthernet0/0/0
 sdwan
  tunnel-interface
   color biz-internet
   encapsulation ipsec weight 10  ! Lower preference
!
! VRRP for LAN Gateway
interface GigabitEthernet0/0/1
 ip address 10.103.1.2 255.255.255.0
 vrrp 1 ip 10.103.1.1
 vrrp 1 priority 110
 vrrp 1 preempt delay minimum 60
 vrrp 1 track 1 decrement 20
!
track 1 interface GigabitEthernet0/0/0 line-protocol
```

---

## 2.10.4 Transport HA Design

### Multi-Transport Redundancy

```
                    TRANSPORT REDUNDANCY MATRIX
+==============================================================================+
|                                                                              |
|   SITE          | TRANSPORT 1    | TRANSPORT 2    | TRANSPORT 3             |
|   --------------+----------------+----------------+-------------------------  |
|   Mumbai DC     | MPLS (Primary) | DIA (Active)   | 5G (Last Resort)        |
|   Chennai DR    | MPLS (Primary) | DIA (Active)   | 5G (Last Resort)        |
|   London        | MPLS (Primary) | DIA (Active)   | 5G (Last Resort)        |
|   Frankfurt     | MPLS (Primary) | DIA (Active)   | 5G (Last Resort)        |
|   New Jersey    | MPLS (Primary) | DIA (Active)   | 5G (Last Resort)        |
|   Dallas        | MPLS (Primary) | DIA (Active)   | 5G (Last Resort)        |
|   Bangalore     | DIA (Primary)  | LTE (Backup)   | -                       |
|   Delhi         | DIA (Primary)  | LTE (Backup)   | -                       |
|   Noida         | DIA (Primary)  | LTE (Backup)   | -                       |
|                                                                              |
|   FAILOVER BEHAVIOR:                                                        |
|   +------------------------------------------------------------------+      |
|   | Trigger          | Detection    | Action           | Time        |      |
|   +------------------------------------------------------------------+      |
|   | MPLS failure     | BFD (3 sec)  | Shift to DIA     | <5 sec      |      |
|   | DIA failure      | BFD (3 sec)  | Shift to MPLS/5G | <5 sec      |      |
|   | Dual failure     | BFD (3 sec)  | Activate LTE/5G  | <10 sec     |      |
|   | Quality degrade  | AAR (60 sec) | Path switch      | <90 sec     |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
+==============================================================================+
```

### BFD Configuration for Fast Failover

```
!======================================================================
! BFD CONFIGURATION FOR TRANSPORT HA
!======================================================================
!
! BFD for MPLS Transport (Tight timers - reliable transport)
interface TenGigabitEthernet0/0/0
 sdwan
  tunnel-interface
   color mpls
   encapsulation ipsec
 bfd
  color mpls
   hello-interval 1000
   multiplier 3
   pmtu-discovery
!
! BFD for Internet Transport (Standard timers)
interface TenGigabitEthernet0/0/1
 sdwan
  tunnel-interface
   color biz-internet
   encapsulation ipsec
 bfd
  color biz-internet
   hello-interval 1000
   multiplier 7
   pmtu-discovery
!
! BFD for Cellular Backup (Relaxed timers - variable latency)
interface Cellular0/4/0
 sdwan
  tunnel-interface
   color 5g
   encapsulation ipsec
   last-resort-circuit
 bfd
  color 5g
   hello-interval 1000
   multiplier 10
   pmtu-discovery
```

---

## 2.10.5 Application-Level HA

### Application-Aware Routing HA

```
                    AAR-BASED APPLICATION HA
+==============================================================================+
|                                                                              |
|   APPLICATION SLA CLASSES                                                   |
|   +------------------------------------------------------------------+      |
|   | Class          | Latency | Jitter | Loss  | Failover Behavior    |      |
|   +------------------------------------------------------------------+      |
|   | Real-Time      | <150ms  | <30ms  | <1%   | Immediate switch     |      |
|   | Business-Crit  | <200ms  | <50ms  | <2%   | Switch within 60s    |      |
|   | Default        | <300ms  | <100ms | <5%   | Switch within 120s   |      |
|   | Best-Effort    | N/A     | N/A    | N/A   | No automatic switch  |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
|   EXAMPLE: Voice Traffic (Real-Time SLA)                                    |
|                                                                              |
|   Normal: MPLS (Latency: 8ms, Loss: 0.01%)                                 |
|           |                                                                  |
|           v                                                                  |
|   Event: MPLS latency spikes to 200ms                                       |
|           |                                                                  |
|           v                                                                  |
|   AAR Action: Immediate failover to DIA (Latency: 15ms)                    |
|           |                                                                  |
|           v                                                                  |
|   Recovery: When MPLS recovers, traffic returns (after 10 min stability)    |
|                                                                              |
+==============================================================================+
```

### SLA Class Configuration

```
!======================================================================
! APPLICATION SLA CLASSES FOR HA
!======================================================================
!
! Real-Time SLA Class (Voice/Video)
policy
 sla-class Real-Time
  latency 150
  jitter 30
  loss 1
!
! Business-Critical SLA Class
policy
 sla-class Business-Critical
  latency 200
  jitter 50
  loss 2
!
! App-Route Policy for Voice
policy
 app-route-policy VOICE-HA
  vpn-list VPN-40
   sequence 10
    match
     app-list VOICE-APPS
    action
     sla-class Real-Time preferred-color mpls
     sla-class Real-Time strict
     backup-sla-preferred-color biz-internet
!
! Fallback Behavior
policy
 app-route-policy VOICE-HA
  vpn-list VPN-40
   sequence 20
    match
     app-list VOICE-APPS
    action
     sla-class Real-Time preferred-color biz-internet
     fallback-to-best-path
```

---

## 2.10.6 Site-Level DR Design

### Disaster Recovery Architecture

```
                    SITE-LEVEL DISASTER RECOVERY
+==============================================================================+
|                                                                              |
|   NORMAL OPERATION                                                          |
|   +------------------------------------------------------------------+      |
|   |                                                                  |      |
|   |   MUMBAI DC (Primary)              CHENNAI DR (Standby)         |      |
|   |   +-----------------+              +-----------------+           |      |
|   |   | vManage Cluster |   Async      | vManage Cluster |           |      |
|   |   | (Active)        |   Repl.      | (Standby)       |           |      |
|   |   +-----------------+   =====>     +-----------------+           |      |
|   |                                                                  |      |
|   |   +-----------------+              +-----------------+           |      |
|   |   | WAN Edges       |   Active     | WAN Edges       |           |      |
|   |   | (Primary Exit)  |   Tunnels    | (Backup Exit)   |           |      |
|   |   +-----------------+              +-----------------+           |      |
|   |                                                                  |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
|   DR ACTIVATION (Mumbai DC Failure)                                         |
|   +------------------------------------------------------------------+      |
|   |                                                                  |      |
|   |   1. Detect Mumbai failure (BFD/heartbeat timeout)              |      |
|   |   2. Activate Chennai vManage cluster (manual or auto)          |      |
|   |   3. Update DNS for vManage VIP                                 |      |
|   |   4. WAN Edges reconnect to Chennai controllers                 |      |
|   |   5. Traffic reroutes through Chennai WAN Edges                 |      |
|   |   6. RPO: 15 minutes (config), RTO: 30 minutes                  |      |
|   |                                                                  |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
+==============================================================================+
```

### DR Runbook Summary

| Step | Action | Owner | Time |
|------|--------|-------|------|
| 1 | Confirm Mumbai DC outage | NOC | 5 min |
| 2 | Declare DR event | Management | 5 min |
| 3 | Activate Chennai vManage | Network Team | 10 min |
| 4 | Update DNS records | Network Team | 5 min |
| 5 | Verify controller connectivity | Network Team | 5 min |
| 6 | Validate traffic flow | NOC | 10 min |
| **Total** | | | **40 min** |

---

## 2.10.7 HA Verification and Testing

### HA Verification Commands

```
!======================================================================
! HA VERIFICATION COMMANDS
!======================================================================
!
! vManage Cluster Status
show running-config cluster
show cluster status
!
! vSmart Controller Status
show sdwan control connections
show sdwan omp peers
!
! WAN Edge HA Status
show sdwan bfd sessions
show sdwan tunnel statistics
show vrrp
!
! Transport Health
show sdwan app-route statistics
show sdwan policy app-route-policy-filter
```

### HA Testing Schedule

| Test Type | Frequency | Duration | Impact |
|-----------|-----------|----------|--------|
| vManage node failover | Quarterly | 2 hours | None (cluster HA) |
| vSmart failover | Quarterly | 1 hour | None (graceful restart) |
| WAN Edge failover | Monthly | 30 min | Sub-second traffic shift |
| Transport failover | Monthly | 15 min | <5 second traffic shift |
| Full DR test | Annually | 8 hours | Planned maintenance window |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 30, 2025 | Network Architecture Team | Initial release |

---

*This document is part of the Abhavtech.com SD-WAN Documentation Suite*
*Confidential - Internal Use Only*
