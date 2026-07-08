# 4.5 Control Policy Design

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.5 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

Control policies in Cisco Catalyst SD-WAN manipulate the routing information exchanged via OMP (Overlay Management Protocol) between SD-WAN controllers and WAN Edge routers. This section defines Abhavtech's control policy design for route filtering, TLOC manipulation, traffic load balancing, and topology control.

### 1.1 Control Policy Architecture

```
+------------------------------------------------------------------+
|                    CONTROL POLICY FRAMEWORK                       |
+------------------------------------------------------------------+
|                                                                   |
|  SD-WAN Controller (vSmart)                                       |
|  +----------------------------------------------------------+    |
|  |  OMP Route Reception        Control Policy Processing    |    |
|  |  +------------------+      +------------------------+    |    |
|  |  | Routes from      |----->| Route Manipulation     |    |    |
|  |  | WAN Edges        |      | - Accept/Reject        |    |    |
|  |  +------------------+      | - Set attributes       |    |    |
|  |                            | - Export to sites      |    |    |
|  |                            +------------------------+    |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Route Advertisement                                              |
|  +----------------------------------------------------------+    |
|  |  Site A          Site B           Site C                  |    |
|  |  +--------+     +--------+       +--------+               |    |
|  |  |WAN Edge|     |WAN Edge|       |WAN Edge|               |    |
|  |  |Filtered|     |Full    |       |Partial |               |    |
|  |  |Routes  |     |Routes  |       |Routes  |               |    |
|  |  +--------+     +--------+       +--------+               |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. Control Policy Fundamentals

### 2.1 OMP Route Types

| Route Type | Description | Control Policy Scope |
|------------|-------------|---------------------|
| OMP Routes | VPN routes advertised via OMP | Prefix manipulation |
| TLOC Routes | Transport locator routes | Color/encap manipulation |
| Service Routes | Service chain routes | Service availability |
| vSmart Routes | Controller-to-controller | Aggregation control |

### 2.2 Control Policy vs Data Policy

| Aspect | Control Policy | Data Policy |
|--------|---------------|-------------|
| Operates On | Routing information (OMP) | Data packets |
| Processing Location | SD-WAN Controller | WAN Edge |
| Effect | Route presence/absence | Packet forwarding path |
| Scope | Network-wide routing | Per-flow decisions |
| Use Cases | Topology control, route filtering | Traffic steering, NAT |

---

## 3. Route Manipulation Policies

### 3.1 Route Filtering by Prefix

```
! Filter routes advertised to specific sites
policy
 control-policy _ABHAVTECH-ROUTE-FILTER_
  sequence 10
   match route
    prefix-list DC-PREFIXES
   !
   action accept
    set
     preference 200
    !
   !
  !
  sequence 20
   match route
    prefix-list BLOCKED-PREFIXES
   !
   action reject
  !
  default-action accept
 !
```

### 3.2 Route Preference Manipulation

```
! Set route preferences for failover control
policy
 control-policy _ABHAVTECH-PREFERENCE_
  sequence 10
   match route
    prefix-list ALL-PREFIXES
    site-list MUMBAI-HUB
   !
   action accept
    set
     preference 300  ! Prefer Mumbai routes
    !
   !
  !
  sequence 20
   match route
    prefix-list ALL-PREFIXES
    site-list CHENNAI-HUB
   !
   action accept
    set
     preference 200  ! Chennai as backup
    !
   !
  !
  default-action accept
 !
```

### 3.3 Route Aggregation

```
! Aggregate branch routes at hub
policy
 control-policy _ABHAVTECH-AGGREGATION_
  sequence 10
   match route
    prefix-list INDIA-BRANCH-DETAILS
   !
   action accept
    set
     aggregator
      prefix-list INDIA-SUMMARY
     !
    !
   !
  !
```

---

## 4. TLOC Manipulation

### 4.1 TLOC Color Preference

```
! Prefer MPLS color for business-critical sites
policy
 control-policy _ABHAVTECH-TLOC-PREFERENCE_
  sequence 10
   match tloc
    color mpls
   !
   action accept
    set
     preference 200
    !
   !
  !
  sequence 20
   match tloc
    color biz-internet
   !
   action accept
    set
     preference 100
    !
   !
  !
  sequence 30
   match tloc
    color lte
   !
   action accept
    set
     preference 50
    !
   !
  !
  default-action accept
 !
```

### 4.2 TLOC Restriction

```
! Restrict specific sites to MPLS only
policy
 control-policy _ABHAVTECH-MPLS-ONLY_
  sequence 10
   match tloc
    site-list PCI-SITES
    color-list NON-MPLS-COLORS
   !
   action reject
  !
  default-action accept
 !
!
policy
 lists
  color-list NON-MPLS-COLORS
   color biz-internet
   color lte
   color 3g
  !
 !
```

### 4.3 TLOC Weight for Load Balancing

```
! Configure TLOC weights for traffic distribution
policy
 control-policy _ABHAVTECH-TLOC-WEIGHT_
  sequence 10
   match tloc
    site-list MUMBAI-HUB
    color mpls
   !
   action accept
    set
     weight 3  ! 30% of traffic
    !
   !
  !
  sequence 20
   match tloc
    site-list MUMBAI-HUB
    color biz-internet
   !
   action accept
    set
     weight 5  ! 50% of traffic
    !
   !
  !
  sequence 30
   match tloc
    site-list MUMBAI-HUB
    color lte
   !
   action accept
    set
     weight 2  ! 20% of traffic
    !
   !
  !
  default-action accept
 !
```

---

## 5. Topology Control

### 5.1 Hub-and-Spoke Topology

```
+------------------------------------------------------------------+
|                    HUB-AND-SPOKE TOPOLOGY                         |
+------------------------------------------------------------------+
|                                                                   |
|                    Mumbai Hub (Site 1)                            |
|                    +------------+                                 |
|                    |  WAN Edge  |                                 |
|                    +-----+------+                                 |
|                         /|\                                       |
|                        / | \                                      |
|                       /  |  \                                     |
|    +-----------+    /   |   \    +-----------+                   |
|    | Bangalore |---+    |    +---| Delhi     |                   |
|    | (Branch)  |        |        | (Branch)  |                   |
|    +-----------+        |        +-----------+                   |
|                   +-----------+                                   |
|                   | Noida     |                                   |
|                   | (Branch)  |                                   |
|                   +-----------+                                   |
|                                                                   |
|  Branch-to-Branch: Via Hub Only                                   |
+------------------------------------------------------------------+
```

```
! Hub-and-spoke control policy
policy
 control-policy _ABHAVTECH-HUB-SPOKE_
  sequence 10
   match route
    site-list BRANCH-SITES
   !
   action accept
    set
     tloc-action strict
     tloc-list HUB-TLOCS
    !
   !
  !
  default-action accept
 !
```

### 5.2 Regional Mesh with Hub Interconnect

```
! India region: Branches connect to India hubs only
policy
 control-policy _INDIA-REGIONAL-TOPOLOGY_
  sequence 10
   match route
    prefix-list INDIA-PREFIXES
    site-list INDIA-BRANCHES
   !
   action accept
    set
     tloc-action strict
     tloc-list INDIA-HUB-TLOCS
    !
    export-to
     site-list INDIA-SITES
    !
   !
  !
  ! Inter-region via hubs only
  sequence 20
   match route
    prefix-list EMEA-PREFIXES
   !
   action accept
    export-to
     site-list INDIA-HUBS
    !
   !
  !
  default-action accept
 !
```

### 5.3 Affinity Groups

```
! Define affinity groups for topology control
policy
 control-policy _ABHAVTECH-AFFINITY_
  sequence 10
   match route
    site-list MUMBAI-HUB
   !
   action accept
    set
     affinity-group 1
     affinity-group-preference 1 2 3
    !
   !
  !
  sequence 20
   match route
    site-list CHENNAI-HUB
   !
   action accept
    set
     affinity-group 2
     affinity-group-preference 2 1 3
    !
   !
  !
  sequence 30
   match route
    site-list INDIA-BRANCHES
   !
   action accept
    set
     affinity-group 3
     affinity-group-preference 1 2
    !
   !
  !
 !
```

---

## 6. VPN Route Control

### 6.1 Per-VPN Route Export

```
! Control which VPN routes are advertised to which sites
policy
 control-policy _ABHAVTECH-VPN-EXPORT_
  sequence 10
   match route
    vpn-list VPN-10-EMPLOYEE
   !
   action accept
    export-to
     vpn-list VPN-10-EMPLOYEE
     site-list ALL-SITES
    !
   !
  !
  sequence 20
   match route
    vpn-list VPN-20-GUEST
   !
   action accept
    export-to
     vpn-list VPN-20-GUEST
     site-list HUB-SITES  ! Guest routes only at hubs
    !
   !
  !
  sequence 30
   match route
    vpn-list VPN-100-PCI
   !
   action accept
    export-to
     vpn-list VPN-100-PCI
     site-list PCI-SITES  ! PCI routes to PCI sites only
    !
   !
  !
  default-action accept
 !
```

### 6.2 Route Leaking Between VPNs

```
! Allow shared services access from multiple VPNs
policy
 control-policy _ABHAVTECH-ROUTE-LEAK_
  sequence 10
   match route
    vpn-list VPN-50-SHARED
    prefix-list DNS-NTP-PREFIXES
   !
   action accept
    export-to
     vpn-list VPN-10-EMPLOYEE
     vpn-list VPN-30-IOT
     vpn-list VPN-40-VOICE
    !
   !
  !
  ! Do NOT leak to VPN-20-GUEST or VPN-100-PCI
  default-action accept
 !
```

---

## 7. Multi-Region Fabric (MRF) Control

### 7.1 Region Definition

```
! Abhavtech MRF Regions
! Region 1: India (Core)
! Region 2: EMEA (Access)
! Region 3: Americas (Access)
! Region 4: Cloud (Access)

policy
 lists
  site-list INDIA-CORE-REGION
   site-id 1-10
  !
  site-list EMEA-ACCESS-REGION
   site-id 11-20
  !
  site-list AMERICAS-ACCESS-REGION
   site-id 21-30
  !
  site-list CLOUD-ACCESS-REGION
   site-id 31-40
  !
 !
```

### 7.2 Inter-Region Route Control

```
! Control route exchange between regions
policy
 control-policy _ABHAVTECH-MRF-CONTROL_
  sequence 10
   match route
    region INDIA-CORE
   !
   action accept
    export-to
     region-list ALL-REGIONS
    !
    set
     preference 300
    !
   !
  !
  sequence 20
   match route
    region EMEA-ACCESS
   !
   action accept
    export-to
     region INDIA-CORE
     region AMERICAS-ACCESS
    !
    set
     preference 200
    !
   !
  !
  sequence 30
   match route
    region AMERICAS-ACCESS
   !
   action accept
    export-to
     region INDIA-CORE
     region EMEA-ACCESS
    !
    set
     preference 200
    !
   !
  !
  default-action accept
 !
```

---

## 8. Failover Control Policies

### 8.1 Primary/Backup Site Designation

```
! Designate Mumbai as primary, Chennai as backup
policy
 control-policy _ABHAVTECH-PRIMARY-BACKUP_
  sequence 10
   match route
    prefix-list DC-SERVICES
    site-list MUMBAI-HUB
   !
   action accept
    set
     preference 300
     origin egp  ! Mark as preferred
    !
   !
  !
  sequence 20
   match route
    prefix-list DC-SERVICES
    site-list CHENNAI-HUB
   !
   action accept
    set
     preference 200
     origin incomplete  ! Mark as backup
    !
   !
  !
  default-action accept
 !
```

### 8.2 DR Site Activation

```
! DR site routes suppressed until activated
policy
 control-policy _ABHAVTECH-DR-SUPPRESSION_
  sequence 10
   match route
    site-list DR-SITES
    prefix-list DR-PREFIXES
   !
   action reject  ! Routes rejected during normal operation
  !
  default-action accept
 !
!
! During DR activation, change to:
policy
 control-policy _ABHAVTECH-DR-ACTIVATED_
  sequence 10
   match route
    site-list DR-SITES
    prefix-list DR-PREFIXES
   !
   action accept
    set
     preference 400  ! Highest preference during DR
    !
   !
  !
  default-action accept
 !
```

---

## 9. Policy Application

### 9.1 Control Policy Application Modes

| Mode | Application | Use Case |
|------|-------------|----------|
| in | Inbound to vSmart | Filter routes received |
| out | Outbound from vSmart | Filter routes advertised |
| default | Both directions | Comprehensive control |

### 9.2 Application Syntax

```
! Apply control policy
apply-policy
 site-list ALL-SITES
  control-policy _ABHAVTECH-MAIN-CONTROL_
   out
  !
 !
 site-list BRANCH-SITES
  control-policy _ABHAVTECH-HUB-SPOKE_
   out
  !
 !
 site-list PCI-SITES
  control-policy _ABHAVTECH-MPLS-ONLY_
   in
  !
 !
```

---

## 10. Monitoring and Verification

### 10.1 Verification Commands

```
! View control policy from vSmart
show sdwan policy from-vsmart

! Check OMP routes
show sdwan omp routes vpn 10
show sdwan omp routes advertised

! Check TLOC routes
show sdwan omp tlocs

! Verify policy application
show sdwan control connections

! Debug control policy
debug sdwan control-policy
```

### 10.2 Troubleshooting Common Issues

| Issue | Symptom | Resolution |
|-------|---------|------------|
| Routes missing | No connectivity | Check accept/reject actions |
| Wrong path selected | Suboptimal routing | Verify preference values |
| TLOC not used | Traffic on wrong circuit | Check TLOC restrictions |
| Routes not exported | Sites isolated | Verify export-to statements |

---

## 11. Best Practices

### 11.1 Control Policy Guidelines

| Guideline | Recommendation |
|-----------|----------------|
| Default Action | Always define explicit default |
| Testing | Test in lab before production |
| Documentation | Document all policy changes |
| Monitoring | Monitor OMP route counts |
| Simplicity | Avoid overly complex policies |

### 11.2 Sequence Numbering

```
! Recommended sequence numbering
! 10-99: Critical routes (DC, services)
! 100-199: VPN-specific policies
! 200-299: Topology control
! 300-399: Failover policies
! 400-499: Site-specific exceptions
! 500+: Default and catch-all
```

---

## 12. Summary

| Element | Abhavtech Configuration |
|---------|------------------------|
| Route Preference | Mumbai 300, Chennai 200 |
| TLOC Preference | MPLS 200, Internet 100, LTE 50 |
| Topology | Hub-spoke branches, mesh hubs |
| MRF Regions | India (core), EMEA, Americas, Cloud |
| Route Leaking | Shared services to Employee/IoT/Voice |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Next Review: March 2026*
