# 2.6 Multi-Region Fabric Design

## Document Information
| Field | Value |
|-------|-------|
| Document Title | Multi-Region Fabric Design |
| Section Number | 2.6 |
| Version | 1.0 |
| Last Updated | December 30, 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 2.6.1 Multi-Region Fabric Overview

### Purpose and Business Drivers

Multi-Region Fabric (MRF) enables hierarchical SD-WAN deployments that scale beyond traditional single-region limitations while optimizing control plane efficiency and regional traffic localization. For Abhavtech.com's global deployment across India, EMEA, and Americas, MRF provides critical architectural benefits.

### MRF Architecture Comparison

| Aspect | Single Region | Multi-Region Fabric | Benefit |
|--------|---------------|---------------------|---------|
| vSmart Scalability | All sites to all vSmarts | Regional vSmarts | 60% control plane reduction |
| Route Advertisement | Full mesh | Hierarchical summarization | Faster convergence |
| Inter-Region Traffic | Direct tunnels | Border router aggregation | Simplified topology |
| Failure Domain | Global | Regional isolation | Localized impact |
| Policy Scope | Global | Regional + Global | Granular control |
| Max WAN Edges | 6,000 | 20,000+ | Future scalability |

### MRF Topology Design

```
                          MULTI-REGION FABRIC ARCHITECTURE
+==============================================================================+
|                                                                              |
|                              ACCESS REGIONS                                  |
|   +------------------------------------------------------------------+      |
|   |                                                                  |      |
|   |  +------------+     +------------+     +-------------+           |      |
|   |  |  REGION 1  |     |  REGION 2  |     |  REGION 3   |           |      |
|   |  |   INDIA    |     |    EMEA    |     |  AMERICAS   |           |      |
|   |  +------+-----+     +------+-----+     +------+------+           |      |
|   |         |                  |                  |                  |      |
|   |    +---------+        +---------+        +---------+             |      |
|   |    |vSmart-1 |        |vSmart-3 |        |vSmart-5 |             |      |
|   |    |Mumbai   |        |Chennai  |        |(Future) |             |      |
|   |    +---------+        +---------+        +---------+             |      |
|   |    |vSmart-2 |        |vSmart-4 |        |vSmart-6 |             |      |
|   |    |Mumbai   |        |Chennai  |        |(Future) |             |      |
|   |    +---------+        +---------+        +---------+             |      |
|   |         |                  |                  |                  |      |
|   +---------|------------------|------------------|------------------+      |
|             |                  |                  |                         |
|             v                  v                  v                         |
|   +------------------------------------------------------------------+      |
|   |                     TRANSPORT REGIONS                            |      |
|   |                                                                  |      |
|   |   +--------------+   +--------------+   +--------------+         |      |
|   |   | BORDER       |   | BORDER       |   | BORDER       |         |      |
|   |   | ROUTER 1     |   | ROUTER 2     |   | ROUTER 3     |         |      |
|   |   | Mumbai DC    |   | Chennai DR   |   | (Future)     |         |      |
|   |   +--------------+   +--------------+   +--------------+         |      |
|   |          |                  |                  |                 |      |
|   |          +--------+---------+--------+---------+                 |      |
|   |                   |                  |                           |      |
|   |                   v                  v                           |      |
|   |            CORE TRANSPORT REGION                                 |      |
|   |   +--------------------------------------------------+           |      |
|   |   |                                                  |           |      |
|   |   |   +-----------+          +-----------+           |           |      |
|   |   |   | Core      |<========>| Core      |           |           |      |
|   |   |   | vSmart-C1 |  eBGP    | vSmart-C2 |           |           |      |
|   |   |   | Mumbai    |  Peering | Chennai   |           |           |      |
|   |   |   +-----------+          +-----------+           |           |      |
|   |   |                                                  |           |      |
|   |   +--------------------------------------------------+           |      |
|   |                                                                  |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
+==============================================================================+
```

---

## 2.6.2 Region Design and Assignment

### Region Hierarchy

| Level | Role | Components | Scope |
|-------|------|------------|-------|
| Core Region | Inter-region routing | Core vSmarts, Border Routers | Global |
| Access Region | Intra-region routing | Regional vSmarts, WAN Edges | Regional |
| Transport Region | Physical connectivity | Border Routers, Transports | Transport |

### Region Assignment for Abhavtech

| Region ID | Region Name | Region Role | Sites Included | Primary vSmart | Secondary vSmart |
|-----------|-------------|-------------|----------------|----------------|------------------|
| 1 | INDIA-ACCESS | Access | Mumbai, Chennai, Bangalore, Delhi, Noida | vSmart-1 (Mumbai) | vSmart-2 (Mumbai) |
| 2 | EMEA-ACCESS | Access | London, Frankfurt | vSmart-3 (Chennai) | vSmart-4 (Chennai) |
| 3 | AMERICAS-ACCESS | Access | New Jersey, Dallas | vSmart-3 (Chennai) | vSmart-4 (Chennai) |
| 0 | CORE | Core/Transport | Mumbai DC, Chennai DR | vSmart-C1 | vSmart-C2 |

### Site-to-Region Mapping

```
!======================================================================
! REGION ASSIGNMENT CONFIGURATION
!======================================================================
!
! Mumbai DC - Region 1 (India) + Core Border
system
 system-ip             10.1.100.1
 site-id               100
 organization-name     ABHAVTECH-COM
 region                1
 role                  border-router
 secondary-region      0
!
! Chennai DR - Region 1 (India) + Core Border  
system
 system-ip             10.1.200.1
 site-id               200
 organization-name     ABHAVTECH-COM
 region                1
 role                  border-router
 secondary-region      0
!
! London Hub - Region 2 (EMEA)
system
 system-ip             10.1.300.1
 site-id               300
 organization-name     ABHAVTECH-COM
 region                2
 role                  edge-router
!
! Frankfurt Hub - Region 2 (EMEA)
system
 system-ip             10.1.301.1
 site-id               301
 organization-name     ABHAVTECH-COM
 region                2
 role                  edge-router
!
! New Jersey Hub - Region 3 (Americas)
system
 system-ip             10.1.400.1
 site-id               400
 organization-name     ABHAVTECH-COM
 region                3
 role                  edge-router
!
! Dallas Hub - Region 3 (Americas)
system
 system-ip             10.1.401.1
 site-id               401
 organization-name     ABHAVTECH-COM
 region                3
 role                  edge-router
!
! Bangalore Branch - Region 1 (India)
system
 system-ip             10.1.103.1
 site-id               103
 organization-name     ABHAVTECH-COM
 region                1
 role                  edge-router
!
! Delhi Branch - Region 1 (India)
system
 system-ip             10.1.104.1
 site-id               104
 organization-name     ABHAVTECH-COM
 region                1
 role                  edge-router
!
! Noida Branch - Region 1 (India)
system
 system-ip             10.1.105.1
 site-id               105
 organization-name     ABHAVTECH-COM
 region                1
 role                  edge-router
```

---

## 2.6.3 Border Router Design

### Border Router Role and Placement

```
                         BORDER ROUTER ARCHITECTURE
+==============================================================================+
|                                                                              |
|   ACCESS REGION 1 (INDIA)          |    ACCESS REGION 2 (EMEA)             |
|   +---------------------------+    |    +---------------------------+       |
|   | Mumbai     Chennai        |    |    | London      Frankfurt     |       |
|   | Bangalore  Delhi   Noida  |    |    +---------------------------+       |
|   +-------------+-------------+    |                 |                      |
|                 |                  |                 |                      |
|                 v                  |                 v                      |
|   +---------------------------+    |    +---------------------------+       |
|   |      BORDER ROUTER 1      |    |    |    (Via Core Region)      |       |
|   |      Mumbai DC            |    |    +---------------------------+       |
|   |      C8500-12X4QC         |    |                                        |
|   |      Role: border-router  |    |    ACCESS REGION 3 (AMERICAS)          |
|   +-------------+-------------+    |    +---------------------------+       |
|                 |                  |    | New Jersey  Dallas        |       |
|                 |                  |    +---------------------------+       |
|                 v                  |                 |                      |
|   +---------------------------+    |                 |                      |
|   |      BORDER ROUTER 2      |    |                 v                      |
|   |      Chennai DR           |<---+----+---------------------------+       |
|   |      C8500-12X4QC         |         |    (Via Core Region)      |       |
|   |      Role: border-router  |         +---------------------------+       |
|   +-------------+-------------+                                             |
|                 |                                                            |
|                 v                                                            |
|   +----------------------------------------------------------+              |
|   |                    CORE TRANSPORT REGION                 |              |
|   |                                                          |              |
|   |   Mumbai Border <======= Core Mesh =======> Chennai Border              |
|   |                                                          |              |
|   |   - Inter-region route exchange via OMP                 |              |
|   |   - Route summarization at border                       |              |
|   |   - Policy enforcement point                            |              |
|   +----------------------------------------------------------+              |
|                                                                              |
+==============================================================================+
```

### Border Router Configuration

```
!======================================================================
! BORDER ROUTER CONFIGURATION - MUMBAI DC
!======================================================================
!
! System Configuration
system
 system-ip             10.1.100.1
 site-id               100
 organization-name     ABHAVTECH-COM
 vbond vbond.abhavtech.com
 region                1
 role                  border-router
 secondary-region      0
 affinity-group        preference 1
!
! OMP Configuration for Border Role
omp
 graceful-restart
 no shutdown
 advertise connected
 advertise static
 advertise aggregate
!
! Route Aggregation for Core Advertisement
route-aggregation
 aggregate 10.1.100.0/22
  summary-only
 aggregate 10.10.0.0/16
  summary-only
!
! Affinity Group Configuration
affinity-group preference 1
 region 1
!
affinity-group preference 2
 region 0
```

---

## 2.6.4 Route Exchange and Summarization

### OMP Route Hierarchy

| Route Type | Scope | Advertisement | Example |
|------------|-------|---------------|---------|
| OMP Routes | Intra-region | Full routes within region | 10.10.100.0/24 |
| Summary Routes | Inter-region | Aggregated at border | 10.10.0.0/16 |
| Transport Routes | Core region | Border-to-border | Via core vSmarts |
| Service Routes | Global | Service-specific | Cloud OnRamp |

### Route Summarization Design

```
                         ROUTE SUMMARIZATION HIERARCHY
+==============================================================================+
|                                                                              |
|   REGION 1 (INDIA) - Full Routes                                            |
|   +------------------------------------------------------------------+      |
|   | Site         | Network              | Advertised Within Region   |      |
|   +------------------------------------------------------------------+      |
|   | Mumbai       | 10.10.100.0/24       | Full /24                   |      |
|   | Chennai      | 10.10.200.0/24       | Full /24                   |      |
|   | Bangalore    | 10.10.103.0/24       | Full /24                   |      |
|   | Delhi        | 10.10.104.0/24       | Full /24                   |      |
|   | Noida        | 10.10.105.0/24       | Full /24                   |      |
|   +------------------------------------------------------------------+      |
|                              |                                               |
|                              v                                               |
|   +------------------------------------------------------------------+      |
|   |              BORDER AGGREGATION (Mumbai/Chennai)                 |      |
|   |              Advertise to Core: 10.10.0.0/16                     |      |
|   +------------------------------------------------------------------+      |
|                              |                                               |
|                              v                                               |
|   +------------------------------------------------------------------+      |
|   |                    CORE REGION (Region 0)                        |      |
|   |   Receives:                                                      |      |
|   |   - 10.10.0.0/16 from India Border                              |      |
|   |   - 10.20.0.0/16 from EMEA Border                               |      |
|   |   - 10.30.0.0/16 from Americas Border                           |      |
|   +------------------------------------------------------------------+      |
|                              |                                               |
|                              v                                               |
|   INTER-REGION REACHABILITY                                                  |
|   +------------------------------------------------------------------+      |
|   | From Region 1 (India) to:                                        |      |
|   |   - EMEA: 10.20.0.0/16 via Core                                 |      |
|   |   - Americas: 10.30.0.0/16 via Core                             |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
+==============================================================================+
```

### Route Policy Configuration

```
!======================================================================
! OMP ROUTE POLICY FOR MRF
!======================================================================
!
! Policy for advertising to Core Region
policy
 route-policy ADVERTISE-TO-CORE
  sequence 10
   match
    prefix-list INDIA-SUMMARY
   action accept
    set
     aggregator
     as-path prepend 65001
  sequence 20
   action reject
!
! Prefix List for Summarization
policy
 prefix-list INDIA-SUMMARY
  ip-prefix 10.10.0.0/16
!
! Policy for receiving from Core Region
policy
 route-policy RECEIVE-FROM-CORE
  sequence 10
   match
    as-path-list EMEA-ORIGINS
   action accept
    set
     preference 100
  sequence 20
   match
    as-path-list AMERICAS-ORIGINS
   action accept
    set
     preference 100
  sequence 30
   action reject
!
! AS-Path Lists
policy
 as-path-list EMEA-ORIGINS
  regex "65002"
 as-path-list AMERICAS-ORIGINS
  regex "65003"
```

---

## 2.6.5 Affinity Group Design

### Affinity Group Strategy

| Affinity Group | Preference | Sites Included | Traffic Flow |
|----------------|------------|----------------|--------------|
| AG-1 (India Primary) | 1 | Mumbai, Chennai, Bangalore, Delhi, Noida | Intra-India first |
| AG-2 (EMEA Primary) | 1 | London, Frankfurt | Intra-EMEA first |
| AG-3 (Americas Primary) | 1 | New Jersey, Dallas | Intra-Americas first |
| AG-0 (Global) | 2 | All Border Routers | Inter-region via core |

### Affinity Configuration

```
!======================================================================
! AFFINITY GROUP CONFIGURATION
!======================================================================
!
! India Sites - Prefer local region
! Mumbai DC
affinity-group
 group 1
  preference
   group 1 preference 1
   group 0 preference 2
   group 2 preference 3
   group 3 preference 3
!
! London Hub - Prefer EMEA, then nearest regions
affinity-group
 group 2
  preference
   group 2 preference 1
   group 0 preference 2
   group 1 preference 3
   group 3 preference 4
!
! New Jersey Hub - Prefer Americas, then nearest regions
affinity-group
 group 3
  preference
   group 3 preference 1
   group 0 preference 2
   group 2 preference 3
   group 1 preference 4
```

### Traffic Flow Optimization

```
                    AFFINITY-BASED TRAFFIC FLOW
+==============================================================================+
|                                                                              |
|   EXAMPLE: Bangalore to Delhi (Same Region)                                  |
|   +------------------------------------------------------------------+      |
|   | Bangalore ---> Mumbai Border ---> Delhi                          |      |
|   | Path: Regional hub-and-spoke (Affinity Group 1)                  |      |
|   | Latency: ~25ms                                                   |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
|   EXAMPLE: Bangalore to London (Cross-Region)                               |
|   +------------------------------------------------------------------+      |
|   | Bangalore ---> Mumbai Border ---> [Core] ---> Chennai Border --> |      |
|   |                                                           London |      |
|   | Path: Via Core Region (Affinity Group 0)                        |      |
|   | Latency: ~150ms                                                  |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
|   EXAMPLE: London to Frankfurt (Same Region)                                |
|   +------------------------------------------------------------------+      |
|   | London <---> Frankfurt                                           |      |
|   | Path: Direct regional tunnel (Affinity Group 2)                 |      |
|   | Latency: ~15ms                                                   |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
+==============================================================================+
```

---

## 2.6.6 vSmart Distribution for MRF

### vSmart Placement Strategy

| vSmart | Location | Role | Regions Served | Capacity |
|--------|----------|------|----------------|----------|
| vSmart-1 | Mumbai DC | Regional | Region 1 (India) | 2,000 edges |
| vSmart-2 | Mumbai DC | Regional | Region 1 (India) | 2,000 edges |
| vSmart-3 | Chennai DR | Regional | Region 2 (EMEA), Region 3 (Americas) | 2,000 edges |
| vSmart-4 | Chennai DR | Regional | Region 2 (EMEA), Region 3 (Americas) | 2,000 edges |
| vSmart-C1 | Mumbai DC | Core | Core Region 0 | Border routers |
| vSmart-C2 | Chennai DR | Core | Core Region 0 | Border routers |

### vSmart Configuration for MRF

```
!======================================================================
! vSMART CONFIGURATION FOR MRF - REGIONAL vSMART
!======================================================================
!
! vSmart-1 Mumbai (Regional)
system
 system-ip             10.255.255.1
 site-id               100
 organization-name     ABHAVTECH-COM
 vbond vbond.abhavtech.com
 region                1
 role                  vsmart
!
omp
 no shutdown
 graceful-restart
 send-path-limit       16
 send-backup-paths
 
policy
 control-policy REGION-1-POLICY
  sequence 10
   match route
    region 1
   action accept
  sequence 20
   match route
    region 0
   action accept
  sequence 30
   action reject
!
! Apply Control Policy
apply-policy
 site-list REGION-1-SITES
  control-policy REGION-1-POLICY out
```

```
!======================================================================
! vSMART CONFIGURATION FOR MRF - CORE vSMART
!======================================================================
!
! vSmart-C1 Mumbai (Core)
system
 system-ip             10.255.255.10
 site-id               100
 organization-name     ABHAVTECH-COM
 vbond vbond.abhavtech.com
 region                0
 role                  vsmart
!
omp
 no shutdown
 graceful-restart
 send-path-limit       4
 send-backup-paths
!
policy
 control-policy CORE-AGGREGATION
  sequence 10
   match route
    aggregated
   action accept
  sequence 20
   action reject
!
apply-policy
 site-list BORDER-ROUTERS
  control-policy CORE-AGGREGATION in
```

---

## 2.6.7 MRF Verification and Troubleshooting

### Verification Commands

```
!======================================================================
! MRF VERIFICATION COMMANDS
!======================================================================
!
! Verify region assignment
show sdwan system status
!
! Expected Output:
! Region ID:        1
! Role:             border-router
! Secondary Region: 0
!
! Verify affinity group membership
show sdwan affinity-group all
!
! Verify OMP routes by region
show sdwan omp routes region 1
show sdwan omp routes region 0
!
! Verify border router status
show sdwan control connections | include border
!
! Verify route summarization
show sdwan omp summary
!
! Verify inter-region connectivity
show sdwan bfd sessions region 0
```

### Troubleshooting Scenarios

| Issue | Symptom | Verification | Resolution |
|-------|---------|--------------|------------|
| Region misconfiguration | Sites not communicating | `show sdwan system status` | Correct region ID |
| Border router down | Inter-region traffic fails | `show sdwan control connections` | Check border router health |
| Route not summarized | Full routes in core | `show sdwan omp routes` | Verify aggregate config |
| Affinity mismatch | Suboptimal path | `show sdwan affinity-group` | Adjust preferences |
| Core vSmart failure | Inter-region fails | `show sdwan control connections` | Failover to secondary |

---

## 2.6.8 MRF Scalability Considerations

### Capacity Planning

| Component | Current | Year 1 | Year 3 | Capacity Limit |
|-----------|---------|--------|--------|----------------|
| Total WAN Edges | 15 | 25 | 50 | 20,000 |
| Regions | 3 + Core | 4 + Core | 5 + Core | 64 |
| vSmarts per Region | 2 | 2 | 2-4 | 20 |
| Border Routers | 2 | 4 | 6 | 16 per region |
| OMP Routes (Core) | 100 | 200 | 500 | 500,000 |

### Growth Path

```
                         MRF SCALABILITY ROADMAP
+==============================================================================+
|                                                                              |
|   YEAR 0 (Current)                                                          |
|   +------------------------------------------------------------------+      |
|   | 3 Access Regions + 1 Core Region                                 |      |
|   | 2 Border Routers (Mumbai, Chennai)                              |      |
|   | 4 Regional vSmarts + 2 Core vSmarts                             |      |
|   | 15 WAN Edges                                                    |      |
|   +------------------------------------------------------------------+      |
|                                     |                                        |
|                                     v                                        |
|   YEAR 1                                                                     |
|   +------------------------------------------------------------------+      |
|   | 4 Access Regions (add APAC)                                     |      |
|   | 4 Border Routers (add Singapore, Sydney)                        |      |
|   | 6 Regional vSmarts + 2 Core vSmarts                             |      |
|   | 25 WAN Edges                                                    |      |
|   +------------------------------------------------------------------+      |
|                                     |                                        |
|                                     v                                        |
|   YEAR 3                                                                     |
|   +------------------------------------------------------------------+      |
|   | 5 Access Regions (add LATAM)                                    |      |
|   | 6 Border Routers (add Sao Paulo)                                |      |
|   | 10 Regional vSmarts + 4 Core vSmarts                            |      |
|   | 50 WAN Edges                                                    |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
+==============================================================================+
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 30, 2025 | Network Architecture Team | Initial release |

---

*This document is part of the Abhavtech.com SD-WAN Documentation Suite*
*Confidential - Internal Use Only*
