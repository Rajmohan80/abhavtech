# 2.7.1 Dynamic Default Border Configuration

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Overview

### 1.1 What is Dynamic Default Border?

Dynamic Default Border is a feature in SD-Access that allows edge nodes to dynamically select the optimal border node for external (default route) traffic, rather than using a statically configured border.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Static vs Dynamic Border Selection                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  STATIC BORDER (Traditional)          DYNAMIC BORDER (Modern)      │
│  ┌─────────────────────┐              ┌─────────────────────┐      │
│  │                     │              │                     │      │
│  │  Edge-1 ──► Border-1│              │  Edge-1 ──┬► Border-1│     │
│  │  Edge-2 ──► Border-1│              │           └► Border-2│     │
│  │  Edge-3 ──► Border-2│              │                     │      │
│  │  Edge-4 ──► Border-2│              │  Edge-2 ──┬► Border-1│     │
│  │                     │              │           └► Border-2│     │
│  │  (Fixed assignment) │              │                     │      │
│  └─────────────────────┘              │  (Dynamic selection │      │
│                                       │   based on metrics)  │      │
│  Problems:                            └─────────────────────┘      │
│  • Manual configuration                                            │
│  • No automatic failover              Benefits:                    │
│  • Suboptimal paths                   • Automatic selection        │
│  • Border overload possible           • Built-in redundancy        │
│                                       • Optimal path selection     │
│                                       • Load distribution          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 When to Use Dynamic Default Border

| Scenario | Recommendation |
|----------|----------------|
| Multiple border nodes at site | ✅ Recommended |
| Single border node | Not applicable |
| LISP Pub/Sub enabled | ✅ Required for best results |
| SD-Access Transit | ✅ Required |
| Large campus (>500 endpoints) | ✅ Recommended |
| Branch with Fabric-in-a-Box | Optional |

---

## 2. Abhavtech Dynamic Border Design

### 2.1 Site-Level Configuration

| Site | Border Nodes | Dynamic Default | Reason |
|------|--------------|-----------------|--------|
| Mumbai | MUM-BN-01, MUM-BN-02 | ✅ Enabled | Dual border redundancy |
| Chennai | CHE-BN-01, CHE-BN-02 | ✅ Enabled | Dual border redundancy |
| London | LON-BN-01, LON-BN-02 | ✅ Enabled | Dual border redundancy |
| Frankfurt | FRA-BN-01, FRA-BN-02 | ✅ Enabled | Dual border redundancy |
| New Jersey | NJ-BN-01, NJ-BN-02 | ✅ Enabled | Dual border redundancy |
| Dallas | DAL-BN-01, DAL-BN-02 | ✅ Enabled | Dual border redundancy |
| Bangalore | FiaB (integrated) | ❌ N/A | Single border (FiaB) |

### 2.2 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Mumbai Site - Dynamic Default Border              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────────┐                          │
│                    │    External/WAN     │                          │
│                    │    (SD-WAN/MPLS)    │                          │
│                    └──────────┬──────────┘                          │
│                               │                                      │
│              ┌────────────────┼────────────────┐                    │
│              │                │                │                    │
│              ▼                ▼                ▼                    │
│    ┌─────────────────┐    ┌─────────────────┐                      │
│    │   MUM-BN-01     │    │   MUM-BN-02     │                      │
│    │ (Default Border)│    │ (Default Border)│                      │
│    │    Priority: 1  │    │    Priority: 2  │                      │
│    └────────┬────────┘    └────────┬────────┘                      │
│             │                      │                                │
│             │    LISP Pub/Sub      │                                │
│             │  ◄──────────────────►│                                │
│             │   Default Route      │                                │
│             │   Advertisement      │                                │
│             │                      │                                │
│    ┌────────┴──────────────────────┴────────┐                      │
│    │                                        │                       │
│    │         Control Plane Nodes            │                       │
│    │       (MUM-CP-01, MUM-CP-02)           │                       │
│    │                                        │                       │
│    └────────────────┬───────────────────────┘                      │
│                     │                                               │
│                     │  Dynamic Default                              │
│                     │  Route Selection                              │
│                     │                                               │
│    ┌────────────────┼────────────────────────────────┐             │
│    │                │                                │             │
│    ▼                ▼                ▼               ▼             │
│ ┌───────┐      ┌───────┐      ┌───────┐      ┌───────┐            │
│ │MUM-ED │      │MUM-ED │      │MUM-ED │      │MUM-ED │            │
│ │  -01  │      │  -02  │      │  -03  │      │  -04  │            │
│ └───────┘      └───────┘      └───────┘      └───────┘            │
│                                                                     │
│  Each edge node independently selects optimal border               │
│  based on LISP metrics and path cost                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Catalyst Center Configuration

### 3.1 Enable Dynamic Default Border

```
Catalyst Center → Provision → Fabric Sites → [Site] → Fabric Infrastructure

1. Select Border Node
2. Click "Edit"
3. Under "Border Settings":
   ☑ Enable as Default Border
   ☑ Dynamic Default Border (new option with Pub/Sub)
   
4. Set Border Priority (optional):
   Border Priority: 1 (lower = preferred)
   
5. Click "Save"
6. Repeat for second border node with Priority: 2
```

### 3.2 Verify Configuration

```
Provision → Fabric Sites → [Site] → Fabric Infrastructure

Border Node View:
┌──────────────────────────────────────────────────────────────┐
│ Device          │ Role          │ Default │ Dynamic │ Priority│
├──────────────────────────────────────────────────────────────┤
│ MUM-BN-01       │ Border        │ Yes     │ Yes     │ 1       │
│ MUM-BN-02       │ Border        │ Yes     │ Yes     │ 2       │
│ MUM-CP-01       │ Control Plane │ -       │ -       │ -       │
│ MUM-CP-02       │ Control Plane │ -       │ -       │ -       │
│ MUM-ED-01       │ Edge          │ -       │ -       │ -       │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. CLI Configuration

### 4.1 Border Node Configuration

```
! On MUM-BN-01 (Primary Border)
! Dynamic Default Border is automatic with LISP Pub/Sub

! Verify LISP Pub/Sub is enabled
router lisp
 locator-set RLOC
  IPv4-interface Loopback0 priority 1 weight 100
 exit-locator-set
 !
 service ethernet
  encapsulation vxlan
  default-etr-locator-set RLOC
  
! Border advertises default route to control plane
! This happens automatically when:
! 1. Border has external connectivity (fusion/handoff)
! 2. Border is marked as "Default Border" in Catalyst Center
! 3. LISP Pub/Sub is enabled

! Verify default route advertisement
show lisp instance-id * ethernet publication
```

### 4.2 Edge Node Behavior

```
! On MUM-ED-01 (Edge Node)
! Edge nodes receive default route dynamically

! Check default route in fabric VRF
show ip route vrf VN_CORPORATE 0.0.0.0

! Expected output:
! Routing entry for 0.0.0.0/0
!   Known via "lisp", distance 210
!   Tag 4097, type LISP-dynamic
!   Last update from 10.100.255.1 (MUM-BN-01) via Vlan4097
!   Last update from 10.100.255.2 (MUM-BN-02) via Vlan4097

! Check LISP default route subscription
show lisp instance-id * ethernet map-cache
```

---

## 5. Border Selection Criteria

### 5.1 Selection Algorithm

```yaml
Border_Selection_Criteria:
  
  1_Reachability:
    - Border must be reachable via underlay
    - IS-IS adjacency must be UP
    
  2_LISP_Registration:
    - Border must be registered with Control Plane
    - EID prefix must be advertised
    
  3_Priority:
    - Lower priority value preferred
    - Priority 1 selected before Priority 2
    
  4_Path_Cost:
    - IS-IS metric to border node
    - Lower cost preferred
    
  5_Load_Distribution:
    - With equal priority/cost, load is distributed
    - ECMP-like behavior across borders
```

### 5.2 Failover Behavior

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Dynamic Border Failover                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Normal Operation:                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Edge-01 ───────────────────────────────────► Border-01 (Pri)│   │
│  │ Edge-02 ───────────────────────────────────► Border-01 (Pri)│   │
│  │ Edge-03 ───────────────────────────────────► Border-02 (Sec)│   │
│  │ Edge-04 ───────────────────────────────────► Border-02 (Sec)│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Border-01 Failure:                                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Edge-01 ──────────────────────────────╳─► Border-01 (DOWN)  │   │
│  │         └────────────────────────────────► Border-02 (Auto) │   │
│  │ Edge-02 ──────────────────────────────╳─► Border-01 (DOWN)  │   │
│  │         └────────────────────────────────► Border-02 (Auto) │   │
│  │ Edge-03 ───────────────────────────────────► Border-02      │   │
│  │ Edge-04 ───────────────────────────────────► Border-02      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Convergence Time: 2-5 seconds (with LISP Pub/Sub)                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. SD-Access Transit Integration

### 6.1 Transit Border Requirements

When using SD-Access Transit for multi-site fabric:

```yaml
Transit_Border_Requirements:
  
  LISP_Pub_Sub:
    - Required for transit functionality
    - Enables cross-site route exchange
    
  Dynamic_Default_Border:
    - Required for optimal transit path selection
    - Enables automatic failover between transit borders
    
  Configuration:
    - Both border nodes configured as Transit borders
    - BGP peering to transit network (if applicable)
    - VN extension across sites
```

### 6.2 Multi-Site Topology

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SD-Access Transit - Multi-Site                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   MUMBAI SITE                           CHENNAI SITE                │
│   ┌───────────────────┐               ┌───────────────────┐         │
│   │ MUM-BN-01 ◄──────────────────────► CHE-BN-01         │         │
│   │ (Transit Border)  │   Transit     │ (Transit Border)  │         │
│   │      ▲            │   Network     │      ▲            │         │
│   │      │            │               │      │            │         │
│   │ MUM-BN-02 ◄──────────────────────► CHE-BN-02         │         │
│   │ (Transit Border)  │               │ (Transit Border)  │         │
│   └───────────────────┘               └───────────────────┘         │
│                                                                     │
│   Dynamic Default Border ensures:                                   │
│   • Traffic from Mumbai uses optimal border                         │
│   • Automatic failover if transit link fails                        │
│   • Load distribution across transit paths                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Verification Commands

### 7.1 Control Plane Verification

```
! On Control Plane Node
! Verify border registrations

show lisp instance-id * ethernet server
! Look for default route (0.0.0.0) registrations from borders

show lisp instance-id * ethernet publication
! Verify border nodes are publishing default route

show lisp instance-id * ethernet subscription
! Verify edge nodes are subscribed to default route
```

### 7.2 Edge Node Verification

```
! On Edge Node
! Verify default route received

show lisp instance-id 4097 ethernet map-cache
! Look for 0.0.0.0/0 entry pointing to border(s)

show ip route vrf VN_CORPORATE 0.0.0.0
! Verify default route in routing table

show ip cef vrf VN_CORPORATE 0.0.0.0/0
! Verify CEF entry for default route
```

### 7.3 Border Node Verification

```
! On Border Node
! Verify default route advertisement

show lisp instance-id * ethernet publication
! Verify this border is publishing default route

show ip route vrf VN_CORPORATE
! Verify external routes are present

show lisp session
! Verify LISP sessions to CP nodes
```

---

## 8. Troubleshooting

### 8.1 Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Edge not receiving default | Border not marked as default | Enable in Catalyst Center |
| Slow failover | Legacy LISP (not Pub/Sub) | Upgrade to Pub/Sub |
| Traffic asymmetry | Priority mismatch | Align border priorities |
| No load distribution | Single border configured | Add second border |

### 8.2 Debug Commands

```
! Enable LISP debugging (use sparingly)
debug lisp control-plane all

! Check LISP publication status
show lisp instance-id * ethernet publication detail

! Check LISP subscription status
show lisp instance-id * ethernet subscription detail

! Verify border to CP connectivity
show lisp session
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
