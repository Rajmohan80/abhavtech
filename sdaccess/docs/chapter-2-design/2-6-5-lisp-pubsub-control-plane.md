# 2.6.5 LISP Pub/Sub Control Plane Architecture

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |
| Classification | Technical Design |

---

## 1. Overview

### 1.1 LISP Pub/Sub Introduction

LISP Pub/Sub (Publish/Subscribe) is the modern control plane architecture for SD-Access, replacing the legacy LISP/BGP control plane. Released with Cisco Catalyst Center 2.2.3.x and IOS-XE 17.6.x, it provides significant improvements in convergence, scalability, and operational simplicity.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LISP Pub/Sub Architecture                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│    ┌──────────────┐         ┌──────────────┐                       │
│    │   Edge Node  │         │   Edge Node  │                       │
│    │  (Publisher) │         │ (Subscriber) │                       │
│    └──────┬───────┘         └──────┬───────┘                       │
│           │                        │                                │
│           │  Publish EID           │  Subscribe to EID              │
│           │  Registrations         │  Notifications                 │
│           ▼                        ▼                                │
│    ┌────────────────────────────────────────┐                      │
│    │         Control Plane Node             │                      │
│    │     (Map Server / Map Resolver)        │                      │
│    │                                        │                      │
│    │  ┌─────────────────────────────────┐  │                      │
│    │  │    Pub/Sub Message Broker       │  │                      │
│    │  │  - EID Registration Database    │  │                      │
│    │  │  - Subscription Management      │  │                      │
│    │  │  - Notification Distribution    │  │                      │
│    │  └─────────────────────────────────┘  │                      │
│    └────────────────────────────────────────┘                      │
│                        │                                            │
│                        ▼                                            │
│    ┌────────────────────────────────────────┐                      │
│    │           Border Node                  │                      │
│    │  (Subscriber to All Fabric Routes)     │                      │
│    └────────────────────────────────────────┘                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Key Benefits Over Legacy LISP/BGP

| Feature | Legacy LISP/BGP | LISP Pub/Sub |
|---------|-----------------|--------------|
| Convergence Time | 30-60 seconds | 2-5 seconds |
| Control Plane Load | Higher | Significantly reduced |
| Border Node Configuration | Per-VN iBGP peering required | No iBGP peering needed |
| Route Distribution | Pull-based | Push-based notifications |
| Scalability | Limited by BGP sessions | Enhanced with Pub/Sub model |
| Wireless Roaming | Slower handoff | Faster seamless roaming |

---

## 2. Architecture Components

### 2.1 Publisher (Edge Nodes)

Edge nodes act as publishers, registering endpoint EID-to-RLOC mappings with the Control Plane.

```
Edge Node Publisher Functions:
├── EID Registration
│   ├── Publish endpoint MAC/IP when learned
│   ├── Include SGT (Security Group Tag)
│   ├── Include VN (Virtual Network) context
│   └── TTL-based registration refresh
├── EID Deregistration
│   ├── Publish removal when endpoint leaves
│   └── Immediate notification to subscribers
└── Subscription
    ├── Subscribe to remote EIDs as needed
    └── Receive push notifications for changes
```

### 2.2 Subscriber (Border Nodes)

Border nodes subscribe to all fabric host routes to maintain complete reachability.

```
Border Node Subscriber Functions:
├── Full Route Subscription
│   ├── Subscribe to all EID prefixes
│   ├── Receive push notifications
│   └── Populate local TCAM
├── External Connectivity
│   ├── Advertise fabric routes externally
│   └── Inject external routes into fabric
└── Dynamic Default Border
    ├── Automatic default route advertisement
    └── No manual per-VN configuration
```

### 2.3 Control Plane Node (Map Server/Resolver)

The CP node acts as the central message broker for Pub/Sub operations.

```
Control Plane Node Functions:
├── Map Server (MS)
│   ├── Accept EID registrations from Edge nodes
│   ├── Maintain EID-to-RLOC database
│   └── Distribute to subscribers
├── Map Resolver (MR)
│   ├── Resolve EID queries
│   └── Redirect to appropriate MS
└── Pub/Sub Broker
    ├── Manage subscriptions
    ├── Push notifications to subscribers
    └── Handle subscription lifecycle
```

---

## 3. Abhavtech.com LISP Pub/Sub Design

### 3.1 Control Plane Node Deployment

| Site | Hostname | Role | RLOC IP | Priority |
|------|----------|------|---------|----------|
| Mumbai | MUM-CP-01.abhavtech.com | Primary CP | 10.251.1.1 | 1 |
| Mumbai | MUM-CP-02.abhavtech.com | Secondary CP | 10.251.1.2 | 2 |
| Chennai | CHE-CP-01.abhavtech.com | Primary CP | 10.251.2.1 | 1 |
| Chennai | CHE-CP-02.abhavtech.com | Secondary CP | 10.251.2.2 | 2 |
| London | LON-CP-01.abhavtech.com | Primary CP | 10.251.3.1 | 1 |
| Frankfurt | FRA-CP-01.abhavtech.com | Primary CP | 10.251.4.1 | 1 |
| New Jersey | NJ-CP-01.abhavtech.com | Primary CP | 10.251.5.1 | 1 |
| New Jersey | NJ-CP-02.abhavtech.com | Secondary CP | 10.251.5.2 | 2 |
| Dallas | DAL-CP-01.abhavtech.com | Primary CP | 10.251.6.1 | 1 |

### 3.2 LISP Site Configuration

```
! Control Plane Node Configuration - MUM-CP-01
!
router lisp
 locator-table default
 locator-set RLOC-SET
  10.251.1.1 priority 1 weight 50
  exit-locator-set
 !
 service ipv4
  encapsulation vxlan
  itr map-resolver 10.251.1.1
  itr map-resolver 10.251.1.2
  etr map-server 10.251.1.1 key ABHAVTECH-LISP-KEY
  etr map-server 10.251.1.2 key ABHAVTECH-LISP-KEY
  etr
  sgt
  exit-service-ipv4
 !
 service ethernet
  encapsulation vxlan
  itr map-resolver 10.251.1.1
  itr map-resolver 10.251.1.2
  etr map-server 10.251.1.1 key ABHAVTECH-LISP-KEY
  etr map-server 10.251.1.2 key ABHAVTECH-LISP-KEY
  etr
  exit-service-ethernet
 !
 ! Pub/Sub Configuration
 instance-id 4097
  service ipv4
   eid-table vrf VN_CORPORATE
   ! Enable Pub/Sub
   map-server
   map-resolver
   ! Pub/Sub specific settings
   publish-subscribe
   exit-service-ipv4
  !
 exit-instance-id
!
```

### 3.3 Edge Node Pub/Sub Configuration

```
! Edge Node Configuration - MUM-ED-01
!
router lisp
 locator-table default
 locator-set FABRIC-RLOCS
  10.251.1.11 priority 1 weight 50
  exit-locator-set
 !
 service ipv4
  encapsulation vxlan
  ! Point to Control Plane nodes
  itr map-resolver 10.251.1.1
  itr map-resolver 10.251.1.2
  etr map-server 10.251.1.1 key ABHAVTECH-LISP-KEY
  etr map-server 10.251.1.2 key ABHAVTECH-LISP-KEY
  etr
  sgt
  ! Pub/Sub mode
  use-petr 10.251.1.1 priority 1 weight 50
  exit-service-ipv4
 !
 instance-id 4097
  service ipv4
   eid-table vrf VN_CORPORATE
   ! Enable Pub/Sub subscription
   map-request itr-rlocs FABRIC-RLOCS
   ! Dynamic EID for endpoint learning
   database-mapping dynamic
   exit-service-ipv4
  !
 exit-instance-id
!
```

### 3.4 Border Node Pub/Sub Configuration

```
! Border Node Configuration - MUM-BN-01
!
router lisp
 locator-table default
 locator-set BORDER-RLOCS
  10.251.1.21 priority 1 weight 50
  exit-locator-set
 !
 service ipv4
  encapsulation vxlan
  itr map-resolver 10.251.1.1
  itr map-resolver 10.251.1.2
  etr map-server 10.251.1.1 key ABHAVTECH-LISP-KEY
  etr map-server 10.251.1.2 key ABHAVTECH-LISP-KEY
  etr
  sgt
  ! Subscribe to all fabric routes
  proxy-itr 10.251.1.21
  proxy-etr
  exit-service-ipv4
 !
 instance-id 4097
  service ipv4
   eid-table vrf VN_CORPORATE
   ! Border subscribes to all EIDs
   map-cache publish-subscribe all
   ! No iBGP peering required with Pub/Sub
   exit-service-ipv4
  !
 exit-instance-id
!
! Dynamic Default Border Configuration
! (Automatic default route advertisement)
!
router lisp
 instance-id 4097
  service ipv4
   ! Enable dynamic default border
   default-originate
   exit-service-ipv4
  !
 exit-instance-id
!
```

---

## 4. Dynamic Default Border

### 4.1 Overview

Dynamic Default Border eliminates manual default route configuration per VN. The border automatically advertises default routes to edge nodes.

### 4.2 Requirements

```yaml
Dynamic_Default_Border_Requirements:
  Software:
    - Catalyst_Center: "2.2.3.x or later"
    - IOS-XE: "17.6.x or later"
  
  Network:
    - Default_Route: "0.0.0.0/0 must exist from upstream"
    - External_Connectivity: "BGP/OSPF to external network"
  
  Configuration:
    - LISP_Pub/Sub: "Must be enabled"
    - Border_Type: "External or Internal+External"
```

### 4.3 Configuration

```
! Dynamic Default Border on MUM-BN-01
!
router lisp
 instance-id 4097
  service ipv4
   eid-table vrf VN_CORPORATE
   ! Automatic default route origination
   default-originate route-map DEFAULT-ORIGINATE-MAP
   exit-service-ipv4
  !
 exit-instance-id
!
! Route-map for conditional default origination
route-map DEFAULT-ORIGINATE-MAP permit 10
 match ip address prefix-list EXTERNAL-CONNECTIVITY
!
ip prefix-list EXTERNAL-CONNECTIVITY permit 0.0.0.0/0
!
```

---

## 5. SD-Access Transit with Pub/Sub

### 5.1 Transit Control Plane Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│              Abhavtech.com SD-Access Transit Design                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Mumbai Fabric          SD-Access Transit          Chennai Fabric  │
│   ┌───────────┐         ┌─────────────┐           ┌───────────┐    │
│   │  Edge     │         │   Transit   │           │  Edge     │    │
│   │  Nodes    │         │   Network   │           │  Nodes    │    │
│   └─────┬─────┘         │  (IP-based) │           └─────┬─────┘    │
│         │               └──────┬──────┘                 │          │
│         ▼                      │                        ▼          │
│   ┌───────────┐               │                  ┌───────────┐    │
│   │  Border   │◄──────────────┼─────────────────►│  Border   │    │
│   │  Nodes    │   Pub/Sub     │    Pub/Sub      │  Nodes    │    │
│   └─────┬─────┘  Messaging    │    Messaging    └─────┬─────┘    │
│         │                      │                        │          │
│         ▼                      ▼                        ▼          │
│   ┌───────────┐         ┌─────────────┐           ┌───────────┐    │
│   │  Control  │◄───────►│   Transit   │◄─────────►│  Control  │    │
│   │  Plane    │         │   Control   │           │  Plane    │    │
│   │  Nodes    │         │   Plane     │           │  Nodes    │    │
│   └───────────┘         └─────────────┘           └───────────┘    │
│                                                                     │
│   Note: All sites MUST use same CP architecture (Pub/Sub)          │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Transit Configuration

```
! Transit Control Plane Node
!
router lisp
 site MUMBAI-FABRIC
  authentication-key ABHAVTECH-TRANSIT-KEY
  eid-record instance-id 4097 10.100.0.0/16 accept-more-specifics
  eid-record instance-id 4098 10.101.0.0/16 accept-more-specifics
  exit-site
 !
 site CHENNAI-FABRIC
  authentication-key ABHAVTECH-TRANSIT-KEY
  eid-record instance-id 4097 10.102.0.0/16 accept-more-specifics
  eid-record instance-id 4098 10.103.0.0/16 accept-more-specifics
  exit-site
 !
 instance-id 4097
  service ipv4
   map-server
   map-resolver
   publish-subscribe
   exit-service-ipv4
  !
 exit-instance-id
!
```

---

## 6. Migration from Legacy LISP/BGP

### 6.1 Pre-Migration Checklist

```yaml
Pre_Migration_Checklist:
  Software_Verification:
    - [ ] Catalyst Center 2.2.3.x or later installed
    - [ ] All fabric nodes running IOS-XE 17.6.x or later
    - [ ] ISE integration verified
  
  Network_Verification:
    - [ ] Default route exists at border nodes
    - [ ] External BGP peering functional
    - [ ] Underlay OSPF/IS-IS stable
  
  Planning:
    - [ ] Maintenance window scheduled
    - [ ] Rollback plan documented
    - [ ] Stakeholders notified
```

### 6.2 Migration Steps

```
Migration Procedure:
1. Upgrade all fabric nodes to IOS-XE 17.6.x+
2. Upgrade Catalyst Center to 2.2.3.x+
3. Enable Pub/Sub on Control Plane nodes first
4. Re-provision Border nodes (automatic with CC)
5. Re-provision Edge nodes (automatic with CC)
6. Verify LISP adjacencies and map-cache
7. Test endpoint connectivity
8. Remove legacy iBGP configuration (automatic)
```

### 6.3 Verification Commands

```
! Verify Pub/Sub is enabled
show lisp instance-id * service ipv4 summary
show lisp instance-id * service ethernet summary

! Verify subscriptions
show lisp instance-id 4097 ipv4 subscription

! Verify map-cache
show lisp instance-id 4097 ipv4 map-cache

! Verify publications
show lisp instance-id 4097 ipv4 publication

! Verify MS/MR status
show lisp instance-id 4097 ipv4 server summary
```

---

## 7. Troubleshooting LISP Pub/Sub

### 7.1 Common Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| No subscriptions | Empty subscription table | Verify CP connectivity, check LISP key |
| Slow convergence | Delayed route updates | Check Pub/Sub enabled on all nodes |
| Missing routes | Incomplete map-cache | Verify registrations on CP nodes |
| Border not advertising | No default route | Ensure upstream default exists |

### 7.2 Debug Commands

```
! Enable LISP debugging
debug lisp control-plane all
debug lisp control-plane pubsub

! Trace EID registration
debug lisp control-plane eid-notify

! Check Pub/Sub messages
show lisp instance-id 4097 ipv4 statistics
```

---

## 8. Best Practices

### 8.1 Design Recommendations

1. **Greenfield Deployments**: Always deploy LISP Pub/Sub
2. **Brownfield Migration**: Plan coordinated upgrade across all sites
3. **Transit Networks**: Ensure all connected sites use same CP architecture
4. **Redundancy**: Deploy dual Control Plane nodes per site
5. **Monitoring**: Use Catalyst Center Assurance for LISP health

### 8.2 Scalability Guidelines

| Metric | Recommended Limit |
|--------|-------------------|
| Endpoints per Edge Node | 4,000 |
| Edge Nodes per Fabric Site | 50 |
| Control Plane Nodes per Site | 2 (HA pair) |
| Fabric Sites per Transit | 100 |

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
