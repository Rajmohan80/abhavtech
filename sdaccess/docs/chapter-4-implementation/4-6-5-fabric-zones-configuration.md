# 4.6.5 Fabric Zones Configuration

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Fabric Zones Overview

### 1.1 Introduction

Fabric Zones provide granular control over IP pool assignment within a fabric site. They allow network administrators to scope IP pools to specific subsets of edge nodes rather than the entire fabric site.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Abhavtech.com Fabric Site                        │
│                         Mumbai Campus                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────────────────────────────┐                          │
│   │         Fabric Zone: Building-A      │                          │
│   │                                      │                          │
│   │  ┌──────────┐  ┌──────────┐        │                          │
│   │  │ MUM-ED-01│  │ MUM-ED-02│        │  IP Pool: 10.100.10.0/24 │
│   │  │ (Edge)   │  │ (Edge)   │        │  VN: VN_CORPORATE        │
│   │  └──────────┘  └──────────┘        │                          │
│   │                                      │                          │
│   │  ┌──────────┐                       │                          │
│   │  │ MUM-EX-01│  (Extended Node)      │                          │
│   │  └──────────┘                       │                          │
│   └─────────────────────────────────────┘                          │
│                                                                     │
│   ┌─────────────────────────────────────┐                          │
│   │         Fabric Zone: Building-B      │                          │
│   │                                      │                          │
│   │  ┌──────────┐  ┌──────────┐        │                          │
│   │  │ MUM-ED-03│  │ MUM-ED-04│        │  IP Pool: 10.100.20.0/24 │
│   │  │ (Edge)   │  │ (Edge)   │        │  VN: VN_CORPORATE        │
│   │  └──────────┘  └──────────┘        │                          │
│   └─────────────────────────────────────┘                          │
│                                                                     │
│   Control Plane: MUM-CP-01, MUM-CP-02 (Site-wide)                  │
│   Border Nodes: MUM-BN-01, MUM-BN-02 (Site-wide)                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Key Concepts

| Concept | Description |
|---------|-------------|
| **Fabric Site** | Parent container for all fabric nodes |
| **Fabric Zone** | Subset of edge nodes within a site |
| **IP Pool Scoping** | IP pools assigned to zones, not entire site |
| **Inheritance** | Zones inherit VNs from parent site |

### 1.3 Node Placement Rules

```yaml
Fabric_Zone_Rules:
  Control_Plane_Nodes:
    - Always at Fabric Site level
    - Cannot be in Fabric Zones
  
  Border_Nodes:
    - Always at Fabric Site level
    - Cannot be in Fabric Zones
  
  Edge_Nodes:
    - Added to Fabric Zones
    - Inherit site-level VNs
  
  Extended_Nodes:
    - Must be in same zone as parent Edge
    - PEN and Classic types supported
  
  Policy_Extended_Nodes:
    - Must be in same zone as parent Edge
    - Full SGT enforcement capability
```

---

## 2. Abhavtech.com Fabric Zone Design

### 2.1 Mumbai Campus Zones

| Zone Name | Building | Edge Nodes | Extended Nodes | IP Pools |
|-----------|----------|------------|----------------|----------|
| MUM-ZONE-BLDG-A | Building A | MUM-ED-01, MUM-ED-02 | MUM-EX-01, MUM-EX-02 | 10.100.10.0/24, 10.100.11.0/24 |
| MUM-ZONE-BLDG-B | Building B | MUM-ED-03, MUM-ED-04 | MUM-EX-03 | 10.100.20.0/24, 10.100.21.0/24 |
| MUM-ZONE-DC | Data Center | MUM-ED-DC-01, MUM-ED-DC-02 | None | 10.100.100.0/24 |

### 2.2 Chennai Campus Zones

| Zone Name | Building | Edge Nodes | Extended Nodes | IP Pools |
|-----------|----------|------------|----------------|----------|
| CHE-ZONE-MAIN | Main Campus | CHE-ED-01, CHE-ED-02 | CHE-EX-01 | 10.102.10.0/24 |
| CHE-ZONE-ANNEX | Annex Building | CHE-ED-03 | None | 10.102.20.0/24 |

### 2.3 Global Site Hierarchy

```
Abhavtech.com
├── Global
│   ├── APAC
│   │   ├── India
│   │   │   ├── Mumbai (Fabric Site)
│   │   │   │   ├── MUM-ZONE-BLDG-A (Fabric Zone)
│   │   │   │   ├── MUM-ZONE-BLDG-B (Fabric Zone)
│   │   │   │   └── MUM-ZONE-DC (Fabric Zone)
│   │   │   └── Chennai (Fabric Site)
│   │   │       ├── CHE-ZONE-MAIN (Fabric Zone)
│   │   │       └── CHE-ZONE-ANNEX (Fabric Zone)
│   ├── EMEA
│   │   ├── UK
│   │   │   └── London (Fabric Site)
│   │   │       ├── LON-ZONE-CANARY (Fabric Zone)
│   │   │       └── LON-ZONE-CITY (Fabric Zone)
│   │   └── Germany
│   │       └── Frankfurt (Fabric Site)
│   │           └── FRA-ZONE-MAIN (Fabric Zone)
│   └── AMER
│       └── USA
│           ├── New Jersey (Fabric Site)
│           │   ├── NJ-ZONE-CAMPUS (Fabric Zone)
│           │   └── NJ-ZONE-DC (Fabric Zone)
│           └── Dallas (Fabric Site)
│               └── DAL-ZONE-MAIN (Fabric Zone)
```

---

## 3. Catalyst Center Configuration

### 3.1 Creating Fabric Zones

**Step 1: Navigate to Fabric Site**
```
Menu → Provision → Fabric Sites → Select "Mumbai"
```

**Step 2: Add Fabric Zone**
```
Actions → Add Fabric Zone

Zone Configuration:
  Zone Name: MUM-ZONE-BLDG-A
  Description: Mumbai Building A - Floors 1-5
  
Click "Add"
```

**Step 3: Add Edge Nodes to Zone**
```
Select Zone "MUM-ZONE-BLDG-A"
→ Fabric Infrastructure
→ Add → Select Edge Nodes

Selected Nodes:
  ☑ MUM-ED-01.abhavtech.com
  ☑ MUM-ED-02.abhavtech.com

Click "Add"
```

### 3.2 Assigning IP Pools to Zones

**Prerequisites:**
- VN must be assigned to parent Fabric Site first
- IP pool must be created in Network Settings

**Step 1: Assign VN to Site (if not done)**
```
Fabric Site: Mumbai
→ Host Onboarding
→ Virtual Networks
→ Add: VN_CORPORATE, VN_VOICE, VN_IOT, VN_GUEST
```

**Step 2: Assign IP Pool to Zone**
```
Select Zone: MUM-ZONE-BLDG-A
→ Host Onboarding
→ Add IP Pool

IP Pool Configuration:
  Virtual Network: VN_CORPORATE
  IP Pool: CORP-BLDG-A-POOL (10.100.10.0/24)
  
  Pool Type: LAN
  Traffic Type: Data
  Scalable Group: Employee-Full (SGT 10)
  
  DHCP Server: 10.250.1.10 (Infoblox APAC)
  DNS Server: 10.250.1.11 (Infoblox APAC)
  
Click "Add"
```

### 3.3 Zone-Specific IP Pool Matrix

| Fabric Zone | VN | IP Pool | VLAN | SGT | DHCP (Geo) | DNS (Geo) |
|-------------|-----|---------|------|-----|------------|-----------|
| MUM-ZONE-BLDG-A | VN_CORPORATE | 10.100.10.0/24 | Auto | 10 | 10.250.1.10 (APAC) | 10.250.1.11 (APAC) |
| MUM-ZONE-BLDG-A | VN_VOICE | 10.100.11.0/24 | Auto | 20 | 10.250.1.10 (APAC) | 10.250.1.11 (APAC) |
| MUM-ZONE-BLDG-B | VN_CORPORATE | 10.100.20.0/24 | Auto | 10 | 10.250.1.10 (APAC) | 10.250.1.11 (APAC) |
| MUM-ZONE-BLDG-B | VN_IOT | 10.100.21.0/24 | Auto | 50 | 10.250.1.10 (APAC) | 10.250.1.11 (APAC) |
| MUM-ZONE-DC | VN_CORPORATE | 10.100.100.0/24 | Auto | 14 | 10.250.1.10 (APAC) | 10.250.1.11 (APAC) |

---

## 4. Extended Nodes in Fabric Zones

### 4.1 Extended Node Types

| Type | Description | SGT Enforcement | Use Case |
|------|-------------|-----------------|----------|
| **Classic Extended Node** | Basic fabric extension | At parent Edge only | Legacy/IE switches |
| **Policy Extended Node (PEN)** | Full TrustSec support | On extended node itself | Cat 9000 in closets |

### 4.2 Adding Extended Node to Zone

**Step 1: Ensure Parent Edge is in Zone**
```
Zone: MUM-ZONE-BLDG-A
Edge Nodes: MUM-ED-01 (parent)
```

**Step 2: Add Extended Node**
```
Select Zone: MUM-ZONE-BLDG-A
→ Fabric Infrastructure
→ Add Extended Node

Extended Node Configuration:
  Device: MUM-EX-01.abhavtech.com
  Parent Edge: MUM-ED-01.abhavtech.com
  Extended Node Type: Policy Extended Node
  Uplink Interface: TenGigabitEthernet1/1/1
  
Click "Add"
```

### 4.3 Policy Extended Node Configuration

```
! Policy Extended Node - MUM-EX-01
! Automatically configured by Catalyst Center

! TrustSec Configuration
cts role-based enforcement
cts role-based enforcement vlan-list all

! SGACL Download
cts role-based sgt-map 10.100.10.0/24 sgt 10
cts authorization list ABHAVTECH-SGACL

! Uplink to Parent Edge
interface TenGigabitEthernet1/1/1
 description Uplink to MUM-ED-01
 switchport mode trunk
 switchport trunk allowed vlan all
 cts manual
  policy static sgt 2 trusted
!
```

---

## 5. IP Pool Scoping Examples

### 5.1 Before Fabric Zones (Site-wide Pool)

```
Fabric Site: Mumbai
├── IP Pool: 10.100.0.0/16 (entire site)
├── Edge Nodes: All 6 edges share same pool
└── Problem: No granular control, large broadcast domain
```

### 5.2 After Fabric Zones (Scoped Pools)

```
Fabric Site: Mumbai
├── Zone: MUM-ZONE-BLDG-A
│   ├── IP Pool: 10.100.10.0/24 (Building A only)
│   ├── Edge Nodes: MUM-ED-01, MUM-ED-02
│   └── Benefit: Isolated broadcast, targeted policy
├── Zone: MUM-ZONE-BLDG-B
│   ├── IP Pool: 10.100.20.0/24 (Building B only)
│   ├── Edge Nodes: MUM-ED-03, MUM-ED-04
│   └── Benefit: Separate address space
└── Zone: MUM-ZONE-DC
    ├── IP Pool: 10.100.100.0/24 (DC only)
    ├── Edge Nodes: MUM-ED-DC-01, MUM-ED-DC-02
    └── Benefit: Server isolation
```

---

## 6. Verification

### 6.1 Catalyst Center Verification

```
Provision → Fabric Sites → Mumbai → Fabric Zones

Expected Output:
┌─────────────────┬────────────┬─────────────┬──────────────┐
│ Zone Name       │ Edge Nodes │ Ext Nodes   │ IP Pools     │
├─────────────────┼────────────┼─────────────┼──────────────┤
│ MUM-ZONE-BLDG-A │ 2          │ 2           │ 2            │
│ MUM-ZONE-BLDG-B │ 2          │ 1           │ 2            │
│ MUM-ZONE-DC     │ 2          │ 0           │ 1            │
└─────────────────┴────────────┴─────────────┴──────────────┘
```

### 6.2 CLI Verification on Edge Nodes

```
! Verify LISP database on edge
show lisp instance-id 4097 ipv4 database

! Expected: Only pools assigned to this zone
LISP ETR IPv4 Mapping Database for EID-table vrf VN_CORPORATE
  10.100.10.0/24, locator-set RLOC-SET
    Locator       Pri/Wgt   Source   State
    10.251.1.11    1/50     cfg-intf Up

! Verify on edge in different zone (should NOT see other zone pools)
MUM-ED-03# show lisp instance-id 4097 ipv4 database
  10.100.20.0/24, locator-set RLOC-SET   <-- Building B pool only
```

---

## 7. Best Practices

### 7.1 Zone Design Guidelines

1. **Zone per Building/Floor**: Align zones with physical boundaries
2. **IP Pool Sizing**: Size pools for zone capacity + 20% growth
3. **Extended Node Placement**: Keep EX in same zone as parent
4. **VN Assignment Order**: Site first, then zone IP pools
5. **Naming Convention**: `<SITE>-ZONE-<BUILDING/FUNCTION>`

### 7.2 Common Mistakes to Avoid

| Mistake | Impact | Correction |
|---------|--------|------------|
| Adding Border to Zone | Provisioning failure | Keep borders at site level |
| IP pool before VN | Pool assignment fails | Add VN to site first |
| EX in different zone than parent | Invalid configuration | Match EX zone to parent Edge |
| Overlapping pools | IP conflicts | Use unique pools per zone |

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
