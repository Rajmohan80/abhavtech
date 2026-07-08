# 4.11 Multicast Policy

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.11 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

Multicast over SD-WAN enables efficient one-to-many traffic distribution for applications like video streaming, software updates, and real-time communications. This section defines Abhavtech's multicast policy design including PIM, IGMP, and overlay multicast replication.

### 1.1 Multicast Architecture Overview

```
+------------------------------------------------------------------+
|                  MULTICAST OVER SD-WAN                            |
+------------------------------------------------------------------+
|                                                                   |
|  Traditional Multicast Issues:                                    |
|  - MPLS required PIM/IGMP on provider network                     |
|  - Complex configuration per site                                 |
|  - Limited scalability                                            |
|                                                                   |
|  SD-WAN Multicast Solution:                                       |
|  +----------------------------------------------------------+    |
|  |  Source --> Hub WAN Edge --> Replication --> Branch       |    |
|  |                              Point                         |    |
|  |                                                           |    |
|  |  Methods:                                                 |    |
|  |  1. Headend Replication (at source)                       |    |
|  |  2. Replicator (centralized)                              |    |
|  |  3. PIM/Auto-RP (native multicast)                        |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. Multicast Methods in SD-WAN

### 2.1 Multicast Replication Options

| Method | Description | Use Case | Scalability |
|--------|-------------|----------|-------------|
| Headend Replication | Source WAN Edge replicates | Small deployments | Low (CPU intensive) |
| SD-WAN Replicator | Dedicated replicator device | Medium deployments | Medium |
| PIM/Auto-RP | Native multicast routing | Large deployments | High |

### 2.2 Abhavtech Multicast Strategy

| Application | Method | Location |
|-------------|--------|----------|
| Video Streaming | PIM/Auto-RP | Hub sites |
| Software Updates | Headend Replication | DC |
| Real-time Events | SD-WAN Replicator | Mumbai Hub |
| Voice Conferencing | Unicast (for reliability) | N/A |

---

## 3. PIM Configuration

### 3.1 PIM Sparse Mode

```
! Enable PIM Sparse Mode on WAN Edge
ip multicast-routing distributed
!
! Service VPN interface configuration
interface GigabitEthernet0/0/2
 description LAN-Employee
 ip address 172.16.1.1 255.255.255.252
 ip pim sparse-mode
!
! Tunnel interface configuration
interface Tunnel100
 ip pim sparse-mode
!
! RP configuration
ip pim rp-address 10.10.1.10  ! Mumbai DC as RP
```

### 3.2 PIM Auto-RP Configuration

```
! Configure Auto-RP for dynamic RP discovery
! Mumbai Hub as RP
ip pim autorp listener
ip pim send-rp-announce Loopback0 scope 16
ip pim send-rp-discovery Loopback0 scope 16
!
! Branch sites as Auto-RP listeners
ip pim autorp listener
```

### 3.3 PIM Timers

```
! Optimize PIM timers for WAN
ip pim spt-threshold infinity  ! Stay on shared tree
ip pim query-interval 30
ip pim neighbor-filter PIM-NEIGHBOR-ACL
!
access-list PIM-NEIGHBOR-ACL permit 10.0.0.0 0.255.255.255
```

---

## 4. IGMP Configuration

### 4.1 IGMP Snooping

```
! Enable IGMP snooping on LAN interfaces
ip igmp snooping
ip igmp snooping vlan 10
!
! IGMP version
interface GigabitEthernet0/0/2
 ip igmp version 3
 ip igmp query-interval 60
 ip igmp query-max-response-time 10
```

### 4.2 IGMP Proxy

```
! IGMP proxy for branch sites without full PIM
ip igmp proxy
!
interface GigabitEthernet0/0/2
 ip igmp proxy-service
!
interface Tunnel100
 ip igmp mroute-proxy Loopback0
```

---

## 5. Headend Replication

### 5.1 Headend Replication Configuration

```
! Enable headend replication in SD-WAN Manager
! Configuration > Templates > Feature Template > Multicast
!
! CLI equivalent:
omp
 advertise connected
 advertise static
 advertise bgp
 advertise ospf
 !
 multicast
  headend-replication
   source
   group-range 239.0.0.0/8
  !
 !
```

### 5.2 Headend Replication Topology

```
+------------------------------------------------------------------+
|               HEADEND REPLICATION TOPOLOGY                        |
+------------------------------------------------------------------+
|                                                                   |
|  Multicast Source                                                 |
|       |                                                           |
|       v                                                           |
|  +----------+                                                     |
|  | Mumbai   |     Replicates to each branch                      |
|  | WAN Edge |--+---> Bangalore WAN Edge                          |
|  | (Source) |  |---> Delhi WAN Edge                              |
|  +----------+  |---> Noida WAN Edge                              |
|                +---> London WAN Edge                              |
|                +---> Frankfurt WAN Edge                           |
|                                                                   |
|  CPU: Linear increase with receivers                              |
|  BW: N x stream size (source upload)                              |
+------------------------------------------------------------------+
```

---

## 6. SD-WAN Replicator

### 6.1 Replicator Configuration

```
! Designate Mumbai Hub as replicator
! SD-WAN Manager: Configuration > Devices > Multicast Replicator
!
! CLI on replicator device:
omp
 multicast
  replicator
   vpn 10
    ip group-range 239.0.0.0/8
    ip source 10.10.100.0/24
   !
  !
 !
```

### 6.2 Replicator Topology

```
+------------------------------------------------------------------+
|                SD-WAN REPLICATOR TOPOLOGY                         |
+------------------------------------------------------------------+
|                                                                   |
|  Multicast Source                                                 |
|       |                                                           |
|       v                                                           |
|  +----------+        +------------+                               |
|  | Source   |------->| Replicator |--+---> Branch 1               |
|  | Site     |        | (Mumbai)   |  |---> Branch 2               |
|  +----------+        +------------+  |---> Branch 3               |
|                                      +---> Branch N               |
|                                                                   |
|  Offloads replication from source                                 |
|  More scalable than headend replication                           |
+------------------------------------------------------------------+
```

---

## 7. Multicast Groups Configuration

### 7.1 Group Ranges

| Group Range | Application | VPN | Method |
|-------------|-------------|-----|--------|
| 239.1.0.0/24 | Video streaming | 10 | PIM |
| 239.2.0.0/24 | Software updates | 10 | Headend |
| 239.3.0.0/24 | Real-time events | 10 | Replicator |
| 239.10.0.0/24 | Voice (backup) | 40 | PIM |

### 7.2 Group Access Control

```
! Restrict multicast group membership
ip access-list extended MULTICAST-GROUPS-ALLOWED
 permit ip any 239.1.0.0 0.0.255.255
 permit ip any 239.2.0.0 0.0.255.255
 permit ip any 239.3.0.0 0.0.255.255
 deny ip any 224.0.0.0 15.255.255.255
!
interface GigabitEthernet0/0/2
 ip igmp access-group MULTICAST-GROUPS-ALLOWED
```

---

## 8. Per-VPN Multicast

### 8.1 VPN 10 - Employee Multicast

```
! Full multicast support for employee VPN
omp
 multicast
  vpn 10
   pim-mode sparse
   rp-address 10.10.1.10
   !
   group-range 239.0.0.0/8
   !
  !
 !
```

### 8.2 VPN 40 - Voice Multicast

```
! Limited multicast for voice (conference announcements)
omp
 multicast
  vpn 40
   pim-mode sparse
   rp-address 10.19.1.10
   !
   group-range 239.10.0.0/24  ! Limited range
   !
  !
 !
```

### 8.3 VPN 20/30/100 - No Multicast

```
! Guest, IoT, and PCI VPNs do not support multicast
! Multicast traffic is dropped by default
```

---

## 9. Multicast QoS

### 9.1 Multicast Traffic Classification

```
! Classify multicast traffic for QoS
class-map match-any MULTICAST-VIDEO
 match dscp af41
 match access-group name MULTICAST-VIDEO-ACL
!
ip access-list extended MULTICAST-VIDEO-ACL
 permit ip any 239.1.0.0 0.0.255.255
!
policy-map WAN-QOS
 class MULTICAST-VIDEO
  priority percent 20
  set dscp af41
```

### 9.2 Multicast Bandwidth Control

```
! Limit multicast bandwidth per interface
interface GigabitEthernet0/0/0
 rate-limit output access-group MULTICAST-ACL 50000000 9375000 18750000
  conform-action transmit
  exceed-action drop
!
ip access-list extended MULTICAST-ACL
 permit ip any 224.0.0.0 15.255.255.255
```

---

## 10. Monitoring and Verification

### 10.1 Verification Commands

```
! Check multicast routing
show ip mroute
show ip mroute summary
show ip mroute count

! Check PIM neighbors
show ip pim neighbor
show ip pim interface

! Check IGMP groups
show ip igmp groups
show ip igmp membership

! Check OMP multicast
show sdwan omp multicast-routes
show sdwan omp multicast-auto-discover

! Check replicator status
show sdwan replicator

! Sample output:
! MULTICAST GROUP    SOURCE           OUTGOING INTERFACES
! 239.1.1.1         10.10.100.10     Tunnel100, Tunnel200
! 239.2.1.1         10.10.100.20     Tunnel100
```

### 10.2 Multicast Metrics

| Metric | Threshold | Action |
|--------|-----------|--------|
| PIM Neighbor Count | Expected value | Investigate if low |
| IGMP Groups | Expected range | Check for storms |
| Replication Load | <80% CPU | Scale if exceeded |
| Multicast Drops | >1% | Investigate QoS |

---

## 11. Troubleshooting

### 11.1 Common Issues

| Issue | Symptom | Resolution |
|-------|---------|------------|
| No multicast traffic | Receivers don't get stream | Check PIM/IGMP |
| High CPU on source | Headend overload | Use replicator |
| Multicast storm | Network saturation | Check TTL, RP config |
| Cross-VPN leak | Wrong VPN receives | Verify VPN isolation |

### 11.2 Debug Commands

```
! Debug multicast (use with caution)
debug ip mrouting
debug ip pim
debug ip igmp

! Debug OMP multicast
debug sdwan omp multicast
```

---

## 12. Best Practices

### 12.1 Multicast Guidelines

| Guideline | Recommendation |
|-----------|----------------|
| Use PIM Sparse | For all deployments |
| Limit Group Ranges | Prevent unauthorized multicast |
| QoS for Multicast | Prioritize video streams |
| Monitor Replication | Track CPU and bandwidth |
| Test Before Production | Validate in lab |

### 12.2 Scalability Recommendations

| Deployment Size | Recommended Method |
|-----------------|-------------------|
| <50 sites | Headend replication |
| 50-200 sites | SD-WAN replicator |
| >200 sites | PIM/Auto-RP |

---

## 13. Summary

| Element | Abhavtech Configuration |
|---------|------------------------|
| Primary Method | PIM/Auto-RP |
| RP Location | Mumbai DC (10.10.1.10) |
| Replicator | Mumbai Hub (backup) |
| Multicast VPNs | VPN 10 (Employee), VPN 40 (Voice) |
| Group Ranges | 239.x.x.x (enterprise) |
| QoS | AF41 for video multicast |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Next Review: March 2026*
