# SD-ACCESS DEPLOYMENT PLANNING TEMPLATE
## Enterprise Network Design, Capacity Planning & Traffic Flow Analysis

**Version**: 1.0  
**Last Updated**: January 2026  
**Applicable To**: Greenfield deployments and traditional network migrations  
**Use Case**: Enterprise campus SD-Access fabric planning

---

## TABLE OF CONTENTS

1. [Project Overview & Scope Definition](#1-project-overview--scope-definition)
2. [Deployment Type Assessment](#2-deployment-type-assessment)
3. [Site Profiling & Classification](#3-site-profiling--classification)
4. [Hardware Selection Framework](#4-hardware-selection-framework)
5. [Capacity Planning Worksheets](#5-capacity-planning-worksheets)
6. [Traffic Flow Analysis](#6-traffic-flow-analysis)
7. [Firewall Integration Design](#7-firewall-integration-design)
8. [Migration Planning (Traditional to SD-Access)](#8-migration-planning-traditional-to-sd-access)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Validation Checklists](#10-validation-checklists)

---

## 1. PROJECT OVERVIEW & SCOPE DEFINITION

### 1.1 Business Objectives

**Complete this section before technical design:**

| Item | Details | Example (Abhavtech) |
|------|---------|---------------------|
| **Primary Business Goal** | _[Why SD-Access? Security? Automation?]_ | Network segmentation, zero-trust security, automation |
| **Key Drivers** | _[List 3-5 main drivers]_ | 1. Improve security posture<br>2. Reduce manual provisioning<br>3. Support IoT devices<br>4. Enable hybrid work |
| **Timeline** | _[Deployment deadline]_ | 38 weeks (complete by Q4 2026) |
| **Budget** | _[Total available budget]_ | $X,XXX (CapEx + 3-year OpEx) |
| **Risk Tolerance** | _[High/Medium/Low]_ | Medium (prefer proven designs) |
| **Operational Model** | _[Centralized/Regional NOC]_ | Centralized NOC in New Jersey |

### 1.2 Scope Boundaries

**In Scope:**
- [ ] Campus fabric deployment
- [ ] Wireless integration (WLC + APs)
- [ ] Wired access
- [ ] Network segmentation (TrustSec)
- [ ] DNAC orchestration
- [ ] ISE integration (AAA + profiling)
- [ ] Firewall integration
- [ ] QoS policies
- [ ] Monitoring infrastructure

**Out of Scope:**
- [ ] Data center fabric (ACI)
- [ ] SD-WAN design (separate project)
- [ ] Voice/UC infrastructure (existing)
- [ ] Application migration
- [ ] End-user device refresh

### 1.3 Success Criteria

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Network Availability** | _[e.g., 99.9%]_ | Monthly uptime reports |
| **Provisioning Time** | _[e.g., <30 min for new VLAN]_ | DNAC telemetry |
| **Security Incidents** | _[e.g., 50% reduction]_ | SIEM correlation |
| **Mean Time to Resolution** | _[e.g., <2 hours]_ | Ticketing system |
| **User Satisfaction** | _[e.g., >80% satisfaction]_ | Quarterly survey |

---

## 2. DEPLOYMENT TYPE ASSESSMENT

### 2.1 Deployment Scenario Selection

**Check ONE box:**

#### GREENFIELD DEPLOYMENT
**Characteristics:**
- New building(s) or campus
- No existing network infrastructure
- Clean slate design
- No migration complexity

**Advantages:**
✓ Optimal design (no constraints from legacy)  
✓ Faster deployment (no cutover complexity)  
✓ Lower risk (no impact to existing users)  

**Disadvantages:**
✗ Higher upfront cost (all new equipment)  
✗ No existing infrastructure to leverage  

**Proceed to**: Section 3 (Site Profiling)

---

#### MIGRATION FROM TRADITIONAL NETWORK
**Characteristics:**
- Existing campus network in operation
- Legacy switches, routers, VLANs
- Active users (zero downtime requirement)
- Phased cutover needed

**Migration Complexity Factors:**

| Factor | Low | Medium | High | Your Assessment |
|--------|-----|--------|------|-----------------|
| **Number of Sites** | 1-3 | 4-10 | >10 | _[Select one]_ |
| **User Count** | <1,000 | 1,000-5,000 | >5,000 | _[Select one]_ |
| **Existing VLANs** | <50 | 50-200 | >200 | _[Select one]_ |
| **Vendor Mix** | Single | 2-3 | >3 | _[Select one]_ |
| **Network Age** | <5 years | 5-10 years | >10 years | _[Select one]_ |
| **Documentation** | Complete | Partial | Minimal | _[Select one]_ |

**Total Complexity Score**: _[Low: 0-6, Medium: 7-12, High: 13-18]_

**Proceed to**: Section 3 (Site Profiling) AND Section 8 (Migration Planning)

---

### 2.2 Current State Assessment (Migration Only)

**Complete this section if migrating from traditional network:**

#### Existing Infrastructure Inventory

| Component | Vendor/Model | Quantity | Age (Years) | End-of-Life? | Reuse in SD-Access? |
|-----------|--------------|----------|-------------|--------------|---------------------|
| **Core Switches** | _[e.g., Cisco 6509]_ | | | | ☐ Yes ☐ No |
| **Distribution Switches** | | | | | ☐ Yes ☐ No |
| **Access Switches** | | | | | ☐ Yes ☐ No |
| **Wireless Controllers** | | | | | ☐ Yes ☐ No |
| **Access Points** | | | | | ☐ Yes ☐ No |
| **Firewalls** | | | | | ☐ Yes ☐ No |
| **Routers (WAN)** | | | | | ☐ Yes ☐ No |
| **Network Management** | | | | | ☐ Yes ☐ No |

#### Existing Network Characteristics

| Characteristic | Current State | SD-Access Requirement | Gap? |
|----------------|---------------|----------------------|------|
| **Routing Protocol** | _[OSPF/EIGRP/Static]_ | IS-IS (underlay) | ☐ Yes ☐ No |
| **VLAN Count** | _[Number]_ | Mapped to VNs | ☐ Yes ☐ No |
| **Spanning Tree** | _[RSTP/MST/PVST+]_ | Not used in fabric | ☐ Yes ☐ No |
| **QoS Marking** | _[DSCP/CoS/None]_ | DSCP (preserved) | ☐ Yes ☐ No |
| **Security (802.1X)** | _[Yes/No/Partial]_ | Required for SGT | ☐ Yes ☐ No |
| **Multicast** | _[PIM/None]_ | Supported in fabric | ☐ Yes ☐ No |

#### IP Address Space Analysis

| Segment | Current Subnet(s) | Usage % | Available for Growth? | Reuse in SD-Access? |
|---------|-------------------|---------|----------------------|---------------------|
| **Users (Wired)** | | | | ☐ Yes ☐ No |
| **Users (Wireless)** | | | | ☐ Yes ☐ No |
| **Servers** | | | | ☐ Yes ☐ No |
| **Voice** | | | | ☐ Yes ☐ No |
| **IoT** | | | | ☐ Yes ☐ No |
| **Guest** | | | | ☐ Yes ☐ No |
| **Management** | | | | ☐ Yes ☐ No |

**IP Address Strategy for SD-Access:**
- [ ] **Option 1**: Reuse existing subnets (mapped to VNs) - *Lower disruption, familiar to users*
- [ ] **Option 2**: New IP scheme (fresh design) - *Cleaner, aligns with VN model*
- [ ] **Option 3**: Hybrid (reuse some, renumber others) - *Balanced approach*

**Selected Option**: _[1, 2, or 3]_

---

## 3. SITE PROFILING & CLASSIFICATION

### 3.1 Site Inventory

**List all sites in your deployment:**

| Site Name | Location | Site Type | Users | Buildings | Priority | Deployment Phase |
|-----------|----------|-----------|-------|-----------|----------|------------------|
| _[HQ]_ | _[City, Country]_ | Hub | | | High | Phase 1 |
| _[Branch 1]_ | | Branch | | | Medium | Phase 2 |
| _[Branch 2]_ | | Branch | | | Low | Phase 3 |

**Example (Abhavtech):**

| Site Name | Location | Site Type | Users | Buildings | Priority | Deployment Phase |
|-----------|----------|-----------|-------|-----------|----------|------------------|
| Mumbai | Mumbai, India | Hub | 4,800 | 6 | High | Phase 1 |
| Chennai | Chennai, India | Hub | 2,400 | 3 | High | Phase 2 |
| Noida | Noida, India | Branch | 300 | 1 | Medium | Phase 3 |

### 3.2 Site Classification Framework

For **each site**, complete the following profile:

---

#### SITE: _[Site Name]_

**Basic Characteristics:**

| Attribute | Value | Notes |
|-----------|-------|-------|
| **Total Users** | | Employees + contractors |
| **Wired Users** | | Desktop/laptop with cable |
| **Wireless Users** | | Mobile, BYOD |
| **IoT Devices** | | Cameras, sensors, printers |
| **Total Endpoints** | | Sum of all device types |
| **Buildings** | | Number of buildings on campus |
| **Floors per Building** | | Average floors |
| **Total Square Footage** | | For wireless AP calculation |

**Traffic Characteristics:**

| Metric | Value | Source/Assumption |
|--------|-------|-------------------|
| **Peak Hour Traffic** | _[Gbps]_ | Current measurement or estimate |
| **Average Traffic** | _[Gbps]_ | Typically 30-40% of peak |
| **Internet Traffic** | _[Gbps]_ | Percentage going to Internet |
| **Data Center Traffic** | _[Gbps]_ | Percentage to DC |
| **Inter-Site Traffic** | _[Gbps]_ | WAN to other sites |
| **Intra-Site Traffic** | _[Gbps]_ | Local within site |

**Growth Projection (3 Years):**

| Metric | Current | Year 1 (+%) | Year 2 (+%) | Year 3 (+%) | 3-Year Total |
|--------|---------|-------------|-------------|-------------|--------------|
| **User Count** | | 20% | 20% | 20% | 73% growth |
| **IoT Devices** | | 40% | 40% | 30% | 156% growth |
| **Traffic Volume** | | 35% | 25% | 20% | ~2× growth |

**Architecture Pattern** (determined automatically from decision tree):

```
DECISION TREE:

IF Users > 3,000 AND Buildings > 5:
    → FULL ARCHITECTURE (Border + CP + Intermediate + Edge)
    
ELSE IF Users 500-3,000 OR Buildings 2-4:
    → STANDARD ARCHITECTURE (Border + CP + Edge)
    → CHECK: Intermediate nodes needed? (see Section 4)
    
ELSE IF Users < 500 AND Buildings = 1:
    → COLLAPSED ARCHITECTURE (Fabric-in-a-Box)
    
```

**Selected Architecture Pattern**: _[Full / Standard / Collapsed]_

**Rationale**: _[Explain why this pattern fits]_

---

### 3.3 Site Comparison Matrix

| Site | Users | Buildings | Architecture | Edge Stacks | Intermediate? | Estimated Cost |
|------|-------|-----------|--------------|-------------|---------------|----------------|
| | | | | | | |
| | | | | | | |
| | | | | | | |

**Example (Abhavtech):**

| Site | Users | Buildings | Architecture | Edge Stacks | Intermediate? | Estimated Cost |
|------|-------|-----------|--------------|-------------|---------------|----------------|
| Mumbai | 4,800 | 6 | Full | 48 | YES (2 nodes) | $X,XXX |
| Chennai | 2,400 | 3 | Standard | 18 | YES (2 nodes) | $X,XXX |
| Noida | 300 | 1 | Collapsed | 2 (FIAB) | NO | $X,XXX |

---

## 4. HARDWARE SELECTION FRAMEWORK

### 4.1 Hardware Selection Workflow

**For EACH site, complete the following calculations:**

---

#### SITE: _[Site Name]_

### STEP 1: Border Node Selection

**Traffic Load Calculation:**

```
CRITICAL: Exclude edge-to-edge same-VN traffic from Border load!

Total Site Traffic = _________ Gbps (all traffic)

Traffic Breakdown:
├─ Edge-to-Edge (Same VN): _______ Gbps (25% typical) → EXCLUDE
├─ Inter-VN (Same Site): _______ Gbps (7% typical) → INCLUDE
├─ Edge-to-Data Center: _______ Gbps (38% typical) → INCLUDE
└─ Edge-to-Internet/WAN: _______ Gbps (25% typical) → INCLUDE

Border Load = Inter-VN + To-DC + To-WAN
Border Load = _______ + _______ + _______ = _______ Gbps

3-Year Projected = Border Load × 1.6 = _______ Gbps
Required Platform = 3-Year Projected × 4 = _______ Gbps
```

**Platform Selection:**

| Platform | Throughput | Ports | Cost | Your Load | Utilization | Select? |
|----------|------------|-------|------|-----------|-------------|---------|
| C9500-16X | 800 Gbps | 16×10G | $X,XXX | | | ☐ |
| **C9500-24Y4C** | 440 Gbps | 24×25G + 4×100G | $X,XXX | | | ☐ |
| C9500-48Y4C | 880 Gbps | 48×25G + 4×100G | $X,XXX | | | ☐ |
| C9600-48Y8C | 1.2 Tbps | 48×25G + 8×100G | $X,XXX | | | ☐ |

**Selected Border Platform**: _[Model]_  
**Quantity**: 2 (always HA pair)  
**Total Cost**: $_______ × 2 = $_______

**Validation:**
- [ ] Current utilization <15%
- [ ] 3-year utilization <30%
- [ ] Port count sufficient (internal + external)

**Example (Mumbai):**
```
Total Site Traffic = 40 Gbps
├─ Edge-to-Edge: 10 Gbps → EXCLUDE
├─ Inter-VN: 3 Gbps → INCLUDE
├─ To-DC: 15 Gbps → INCLUDE
└─ To-WAN: 10 Gbps → INCLUDE

Border Load = 3 + 15 + 10 = 28 Gbps (NOT 40 Gbps!)
3-Year = 28 × 1.6 = 45 Gbps
Required = 45 × 4 = 180 Gbps

Selected: C9500-24Y4C (440 Gbps)
Utilization: 45 / 440 = 10.2% ✓
```

---

### STEP 2: Control Plane Node Selection

**Port Count Calculation (Primary Factor):**

```
Edge Node Count = _______ stacks

Port Requirements:
├─ Edge connections: _______ stacks × 2 uplinks = _______ ports
├─ Border uplinks: 2 nodes × 2 uplinks = 4 ports
├─ Peer CP link: 2 ports
├─ Reserved: 4 ports
└─ TOTAL REQUIRED = _______ ports

CP Platform Port Count:
├─ C9500-24Y4C: 24 ports
├─ Available after uplinks: 24 - 6 = 18 ports

DECISION:
IF Total Required > 18 ports:
    → INTERMEDIATE NODES REQUIRED
ELSE:
    → Direct connection to CP (no intermediate)
```

**Intermediate Nodes Required?**
- [ ] **YES** - Edge count requires intermediate aggregation
- [ ] **NO** - Direct connection to CP sufficient

**If YES, calculate intermediate node count:**
```
Intermediate Count = CEILING((Edge Stacks × 2) / 20)
Intermediate Count = CEILING((_______ × 2) / 20) = _______ nodes

Each intermediate handles: _______ edge stacks
```

**Platform Selection:**

| Component | Platform | Quantity | Cost Each | Total Cost |
|-----------|----------|----------|-----------|------------|
| **Control Plane** | C9500-24Y4C | 2 (always) | $X,XXX | $X,XXX |
| **Intermediate** | C9500-24Y4C | _[0, 2, 4, etc.]_ | $X,XXX | $_____ |

**Validation:**
- [ ] Always deploy 2 × CP nodes (HA critical)
- [ ] CP port utilization <80%
- [ ] Intermediate nodes deployed in pairs (if needed)

**Example (Mumbai):**
```
Edge Stacks = 48
Port Requirements:
├─ Edges: 48 × 2 = 96 ports
├─ Borders: 4 ports
├─ Peer CP: 2 ports
└─ TOTAL = 102 ports

CP Available = 18 ports
96 > 18 → INTERMEDIATE REQUIRED ✓

Intermediate Count = CEILING(96 / 20) = 5 → Deploy 6 for N+1
Actual: Deploy 2 intermediate (24 edges each)

After Intermediate:
CP Connections = 4 (border) + 4 (intm-1) + 4 (intm-2) + 2 (peer) = 14 ports ✓
```

---

### STEP 3: Edge Node Selection

**Port Count Calculation (Per Floor/IDF):**

```
Devices per Floor:
├─ Wired PCs: _______ devices
├─ IP Phones: _______ devices
├─ Access Points: _______ devices
├─ Cameras: _______ devices
├─ Printers: _______ devices
├─ IoT Devices: _______ devices
└─ SUBTOTAL: _______ devices

With 20% Growth Buffer:
Total Required = _______ × 1.2 = _______ ports per floor
```

**PoE Budget Calculation:**

```
PoE Requirements per Floor:
├─ IP Phones: _______ × 15W = _______ W
├─ Access Points: _______ × 30W = _______ W
├─ Cameras: _______ × 15W = _______ W
├─ IoT Devices: _______ × 5W = _______ W
└─ SUBTOTAL: _______ W

With 20% Buffer:
Total PoE = _______ × 1.2 = _______ W per floor
```

**Stack Sizing:**

```
Switches per Stack = CEILING(Required Ports / 48)
Switches per Stack = CEILING(_______ / 48) = _______ switches

PoE Validation:
PoE per Switch (C9300-48U) = 1,440W
Total PoE per Stack = _______ switches × 1,440W = _______ W
PoE Required = _______ W
PoE Sufficient? _______ ≥ _______ → [ ] YES [ ] NO
```

**Platform Selection:**

| Model | Ports | PoE | Use Case | Cost | Select? |
|-------|-------|-----|----------|------|---------|
| C9300-24P | 24×1G | 370W | Small IDF | $X,XXX | ☐ |
| **C9300-48U** | 48×1G | 1,440W | Standard | $X,XXX | ☐ |
| C9300-48UXM | 48×mGig | 1,440W | WiFi 6E | $X,XXX | ☐ |

**Edge Deployment Summary:**

| Location | Switches per Stack | Stacks Needed | Total Switches | Total Cost |
|----------|-------------------|---------------|----------------|------------|
| Building A | | | | |
| Building B | | | | |
| **TOTAL** | | | | |

**Validation:**
- [ ] Port utilization 60-80% (good balance)
- [ ] PoE budget sufficient (50-70% utilization)
- [ ] Growth headroom for 3 years

**Example (Mumbai - Typical Floor):**
```
Devices:
├─ Wired PCs: 80
├─ IP Phones: 80
├─ APs: 5
├─ Cameras: 12
└─ TOTAL: 177 × 1.2 = 212 ports

PoE:
├─ Phones: 80 × 15W = 1,200W
├─ APs: 5 × 30W = 150W
├─ Cameras: 12 × 15W = 180W
└─ TOTAL: 1,530W × 1.2 = 1,836W

Stack Sizing:
├─ Switches: CEILING(212 / 48) = 5 switches
├─ For cost: Use 3 switches (144 ports, 83% util) ✓
├─ PoE: 3 × 1,440W = 4,320W ✓

Selected: 3 × C9300-48U per stack
Cost per Stack: $X,XXX × 3 = $X,XXX
```

---

### STEP 4: Wireless Controller (WLC) Selection

**AP Count Calculation:**

```
Total Square Footage = _______ sq ft

Coverage per AP (select appropriate density):
[ ] Open Office: 2,500 sq ft per AP
[ ] Standard Office: 1,500 sq ft per AP
[ ] High Density: 500 sq ft per AP

Required APs = Total Sq Ft / Coverage per AP
Required APs = _______ / _______ = _______ APs
```

**Client Load Calculation:**

```
Total Users = _______
Wireless Ratio = _______% (typically 60-80%)
Wireless Clients = Users × Wireless Ratio
Wireless Clients = _______ × _______% = _______ clients

Clients per AP = Wireless Clients / Required APs
Clients per AP = _______ / _______ = _______ (target: <15)
```

**Throughput Calculation:**

```
Per Client Bandwidth = 10 Mbps (average)
Total Aggregate = Wireless Clients × 10 Mbps = _______ Mbps

With 20:1 Oversubscription:
Actual Throughput = Total Aggregate / 20 = _______ Gbps
```

**Platform Selection:**

| Model | Max APs | Max Clients | Throughput | Use Case | Cost | Select? |
|-------|---------|-------------|------------|----------|------|---------|
| C9800-L | 200 | 2,000 | 10 Gbps | Small | $X,XXX | ☐ |
| **C9800-40** | 2,000 | 64,000 | 40 Gbps | Medium Hub | $X,XXX | ☐ |
| C9800-80 | 6,000 | 64,000 | 80 Gbps | Large Hub | $X,XXX | ☐ |
| **Embedded WLC** | 100 | 2,000 | N/A | Branch | $X,XXX| ☐ |

**Deployment Model:**
- [ ] **Centralized WLC** (for hubs >50 APs)
- [ ] **Embedded WLC** (for branches <50 APs)

**Selected WLC**: _[Model]_  
**Quantity**: _[1 or 2 for HA]_  
**Total Cost**: $_______

**Access Point Selection:**

| AP Model | Type | WiFi Standard | PoE | Quantity | Cost Each | Total Cost |
|----------|------|---------------|-----|----------|-----------|------------|
| C9130AXI | Indoor | WiFi 6E | 30W (PoE+) | | $X,XXX| |
| C9164I-E | Outdoor | WiFi 6E | 60W (PoE++) | | $X,XXX| |

**Validation:**
- [ ] WLC capacity >2× current AP count (headroom)
- [ ] Clients per AP <15 (good distribution)
- [ ] PoE budget includes APs

**Example (Mumbai):**
```
Square Footage = 600,000 sq ft
Coverage = 1,500 sq ft per AP (standard office)
Required APs = 600,000 / 1,500 = 400 APs

Users = 4,800
Wireless Ratio = 70%
Clients = 4,800 × 70% = 3,360 clients
Clients per AP = 3,360 / 400 = 8.4 ✓

Selected WLC: C9800-40 (2,000 AP capacity)
Utilization: 400 / 2,000 = 20% ✓
```

---

### 4.2 Hardware Summary by Site

**Complete this table for all sites:**

| Site | Border | CP | Intermediate | Edge Switches | WLC | APs | Total Cost |
|------|--------|----|--------------| --------------|-----|-----|------------|
| | 2× | 2× | 2× | | | | |
| | 2× | 2× | 0× | | | | |
| **TOTAL** | | | | | | | |

---

## 5. CAPACITY PLANNING WORKSHEETS

### 5.1 Traffic Load Summary

**For EACH site:**

| Site | Edge-to-Edge | Inter-VN | To-DC | To-WAN | Border Load | 3-Yr Projected |
|------|--------------|----------|-------|--------|-------------|----------------|
| | | | | | | |
| | | | | | | |
| **TOTAL** | | | | | | |

### 5.2 Port Count Validation

| Site | Edge Ports Required | Edge Ports Deployed | Utilization % | Headroom OK? |
|------|---------------------|---------------------|---------------|--------------|
| | | | | ☐ Yes ☐ No |
| | | | | ☐ Yes ☐ No |

**Target Utilization**: 60-80% (good balance)

### 5.3 PoE Budget Validation

| Site | PoE Required (W) | PoE Available (W) | Utilization % | Headroom OK? |
|------|------------------|-------------------|---------------|--------------|
| | | | | ☐ Yes ☐ No |
| | | | | ☐ Yes ☐ No |

**Target Utilization**: 50-70% (sufficient headroom)

### 5.4 Growth Headroom Analysis

| Component | Current Load | Platform Capacity | Utilization % | 3-Yr Projected | 3-Yr Util % | Action Needed? |
|-----------|--------------|-------------------|---------------|----------------|-------------|----------------|
| **Border Throughput** | | | | | | |
| **CP Port Count** | | | | | | |
| **Edge Ports** | | | | | | |
| **WLC APs** | | | | | | |

**Action Required If**:
- Border utilization >30% (plan upgrade)
- CP port utilization >80% (add intermediate)
- Edge port utilization >85% (add switches)
- WLC AP count >60% (add WLC)

---

## 6. TRAFFIC FLOW ANALYSIS

### 6.1 Traffic Pattern Classification

**For your deployment, estimate percentage of traffic in each pattern:**

| Traffic Pattern | Description | Typical % | Your % | Bandwidth (Gbps) |
|-----------------|-------------|-----------|--------|------------------|
| **Edge-to-Edge (Same VN)** | Direct VXLAN, bypasses Border | 25% | | |
| **Inter-VN (Same Site)** | Via Border for routing | 7% | | |
| **Edge-to-Data Center** | Via Border to DC | 38% | | |
| **Edge-to-Internet/WAN** | Via Border + Firewall | 25% | | |
| **Control Plane** | LISP, BFD, ISIS | 5% | | |
| **TOTAL** | | 100% | 100% | |

**How to Estimate**:
1. Analyze current NetFlow data (if available)
2. Interview application teams (data access patterns)
3. Use industry benchmarks (if no data)

### 6.2 Traffic Flow Documentation

**Document key traffic flows for reference:**

#### Flow 1: _[Flow Name, e.g., "User to File Server"]_

| Attribute | Value |
|-----------|-------|
| **Source** | _[e.g., Employee PC, 10.100.1.50]_ |
| **Destination** | _[e.g., File Server, 10.100.1.200]_ |
| **Source VN** | _[e.g., VN_CORPORATE]_ |
| **Destination VN** | _[e.g., VN_CORPORATE]_ |
| **Same VN?** | ☐ Yes ☐ No |
| **Path** | _[Edge → Intm → CP → Edge]_ |
| **Border Traversal?** | ☐ Yes ☐ No |
| **Latency** | _[e.g., <1 ms]_ |
| **Bandwidth** | _[e.g., 2.5 Gbps peak]_ |
| **SGT Source** | _[e.g., 10 - Employee]_ |
| **SGT Destination** | _[e.g., 70 - Servers]_ |
| **Policy Action** | ☐ Permit ☐ Deny |

**Repeat for 5-10 critical flows**

### 6.3 Traffic Flow Decision Matrix

Use this matrix to determine flow path:

```
DECISION TREE:

Is Source VN = Destination VN?
├─ YES → Edge-to-Edge (Direct VXLAN)
│         Path: Edge → Intermediate → CP (transit) → Edge
│         Border: NOT traversed
│         Latency: <1 ms
│
└─ NO → Inter-VN Routing Required
          │
          ├─ Destination = Internet?
          │  YES → Edge → Border → Firewall → ISP
          │         Border: REQUIRED
          │         Firewall: REQUIRED
          │         NAT: At Firewall
          │         Latency: 20-50 ms
          │
          └─ NO → Inter-VN Same Site
                  Path: Edge → Border → Edge
                  Border: REQUIRED
                  SGT Enforcement: At Border
                  Latency: 2-3 ms
```

---

## 7. FIREWALL INTEGRATION DESIGN

### 7.1 Firewall Placement Strategy

**Select placement model:**

#### Model 1: External to Fabric (Recommended)

```
Internet/WAN
     │
  Firewall
     │
Border Nodes ← Terminates VXLAN, forwards native IP to Firewall
     │
SD-Access Fabric
```

**Advantages**:
- ✓ Border terminates VXLAN (firewall sees native IP)
- ✓ SGT passed via SXP (out-of-band)
- ✓ Standard firewall deployment (proven)
- ✓ Easier troubleshooting (role separation)

**Disadvantages**:
- ✗ All Internet traffic hairpins through Border
- ✗ Additional hop (slight latency)

---

#### Model 2: Firewall as Fabric Node

```
Internet/WAN
     │
Firewall (Fabric Edge Node)
     │
SD-Access Fabric (VXLAN)
```

**Advantages**:
- ✓ Firewall participates in fabric directly
- ✓ SGT inline (no SXP needed)
- ✓ Optimized path (no hairpin)

**Disadvantages**:
- ✗ Firewall must support VXLAN/LISP
- ✗ More complex configuration
- ✗ Fewer firewall platforms supported

---

**Selected Model**: _[1 or 2]_  
**Rationale**: _[Explain choice]_

**Abhavtech Example**: Model 1 (External to Fabric) - Standard, proven design

### 7.2 Firewall Capacity Planning

**Firewall Traffic Load Calculation:**

```
For Model 1 (External to Fabric):

Firewall Load = Edge-to-Internet + Edge-to-WAN + VPN
Firewall Load = _______ + _______ + _______ = _______ Gbps

3-Year Projected = Firewall Load × 1.6 = _______ Gbps
Required Platform = 3-Year Projected × 2 = _______ Gbps
```

**Platform Selection:**

| Site Type | Platform | Throughput | IPS Throughput | VPN | Cost | Select? |
|-----------|----------|------------|----------------|-----|------|---------|
| **Large Hub** | Cisco FTD 4150 | 70 Gbps | 25 Gbps | 18 Gbps | $X,XXX | ☐ |
| **Medium Hub** | Cisco FTD 2130 | 15 Gbps | 6 Gbps | 5 Gbps | $X,XXX | ☐ |
| **Branch** | Cisco FTD 1150 | 3 Gbps | 1.5 Gbps | 1 Gbps | $X,XXX | ☐ |

**Deployment:**

| Site | Firewall Model | Quantity | Role | Total Cost |
|------|----------------|----------|------|------------|
| | | 2 (HA) | DIA/Internet | |
| | | 1 | MPLS (optional) | |
| **TOTAL** | | | | |

### 7.3 Security Zones Definition

**Define security zones for firewall:**

| Zone Name | Trust Level | Interfaces | Description |
|-----------|-------------|------------|-------------|
| INSIDE | Trusted | To Border nodes | SD-Access fabric |
| OUTSIDE | Untrusted | To Internet ISP | Public Internet |
| DMZ | Semi-Trust | To DMZ switches | Public-facing servers |
| MPLS-WAN | Trusted | To MPLS router | Corporate WAN |
| GUEST | Restricted | To Guest anchor | Guest wireless |
| MGMT | Highly Trusted | Management network | Firewall management |

### 7.4 SGT Integration via SXP

**If using Model 1 (External Firewall):**

**SXP Configuration:**

| Component | Setting | Value |
|-----------|---------|-------|
| **Border Node Role** | SXP Speaker | Exports IP-to-SGT bindings |
| **Firewall Role** | SXP Listener | Imports IP-to-SGT bindings |
| **SXP Connection** | TCP Port | 64999 |
| **Refresh Interval** | Seconds | 120 (default) |
| **Authentication** | Shared Password | _[Define secure password]_ |

**Traffic Flow with SXP:**

```
1. User PC (10.100.1.50) → Edge assigns SGT 10 (via ISE)
2. Edge tags traffic with SGT 10 in VXLAN
3. Border receives VXLAN, decapsulates
4. Border knows: IP 10.100.1.50 = SGT 10
5. Border tells Firewall via SXP: "10.100.1.50 = SGT 10"
6. Border forwards native IP packet to Firewall
7. Firewall receives packet from 10.100.1.50
8. Firewall looks up: 10.100.1.50 → SGT 10 (from SXP)
9. Firewall applies policy: SGT 10 → Internet = PERMIT
```

**Validation:**
- [ ] SXP connection UP between Border and Firewall
- [ ] IP-to-SGT bindings received on Firewall
- [ ] Firewall policies reference SGTs (not just IPs)

---

## 8. MIGRATION PLANNING (Traditional to SD-Access)

**Complete this section ONLY if migrating from existing network**

### 8.1 Migration Strategy Selection

**Select ONE migration approach:**

#### Strategy 1: Forklift Replacement (Big Bang)

**Description**: Replace entire network in single cutover window

**When to Use**:
- Small sites (<500 users)
- Existing network end-of-life
- Can tolerate downtime (e.g., weekend cutover)
- New building/floor available for staging

**Advantages**:
- ✓ Fastest deployment
- ✓ Cleaner (no hybrid state)
- ✓ Lower complexity

**Disadvantages**:
- ✗ Higher risk (one shot to succeed)
- ✗ Requires downtime window
- ✗ Rollback difficult

**Cutover Window Required**: _[e.g., 48 hours]_

---

#### Strategy 2: Phased Migration (Floor-by-Floor)

**Description**: Migrate one floor/building at a time, traditional and fabric coexist

**When to Use**:
- Medium to large sites (>500 users)
- Zero downtime requirement
- Users distributed across multiple floors/buildings
- Iterative approach preferred (learn from each phase)

**Advantages**:
- ✓ Lower risk (isolated failures)
- ✓ Zero downtime (users not on migrated floor unaffected)
- ✓ Rollback easier (revert one floor)
- ✓ Learn lessons, improve process

**Disadvantages**:
- ✗ Longer duration (weeks/months)
- ✗ Hybrid network complexity
- ✗ Requires inter-fabric routing

**Migration Order**: _[e.g., Floor 1 → Floor 2 → ... → Floor N]_

---

#### Strategy 3: Parallel Network (New Fabric Alongside Old)

**Description**: Build complete new fabric, migrate users in waves

**When to Use**:
- Large sites (>1,000 users)
- Critical 24/7 operations
- Sufficient IP space for parallel network
- Can afford doubling equipment temporarily

**Advantages**:
- ✓ Zero risk to existing network
- ✓ Full testing before migration
- ✓ Instant rollback (switch users back)
- ✓ Users migrate at own pace

**Disadvantages**:
- ✗ Highest cost (duplicate equipment)
- ✗ Requires new IP space (or renumbering)
- ✗ Complex inter-network communication

**Coexistence Duration**: _[e.g., 6 months]_

---

**Selected Strategy**: _[1, 2, or 3]_  
**Rationale**: _[Explain choice]_

### 8.2 Migration Prerequisites

**Complete these tasks BEFORE migration:**

#### Network Documentation
- [ ] Complete network topology diagram
- [ ] IP address allocation spreadsheet (all subnets)
- [ ] VLAN inventory with descriptions
- [ ] Device inventory with credentials
- [ ] Interface descriptions documented
- [ ] Routing protocol configuration
- [ ] ACL/firewall rules documented
- [ ] QoS policies documented
- [ ] Spanning tree topology
- [ ] Wireless SSID list with VLANs

#### IP Address Planning
- [ ] Map existing VLANs to Virtual Networks (VNs)
- [ ] Allocate fabric RLOC pool (10.250.0.0/16 typical)
- [ ] Allocate fabric control plane IPs
- [ ] Decide: Reuse existing user subnets or renumber?
- [ ] Plan overlap handling (if any)

#### Infrastructure Preparation
- [ ] DNAC cluster deployed and operational
- [ ] ISE deployment complete (PAN + PSN)
- [ ] Underlay infrastructure ready (if new switches)
- [ ] Border nodes installed (can be virtual initially)
- [ ] Internet/WAN connectivity validated
- [ ] Management network in place

#### Team Readiness
- [ ] SD-Access training completed for team
- [ ] DNAC training completed
- [ ] ISE training completed (if new to ISE)
- [ ] Cisco PSS engaged (if needed)
- [ ] Change management approvals obtained
- [ ] Rollback procedures documented
- [ ] Communication plan to users

### 8.3 Migration Execution Plan

**Phase-by-Phase Rollout (if using Strategy 2 or 3):**

| Phase | Scope | Duration | Go-Live Date | Success Criteria | Rollback Plan |
|-------|-------|----------|--------------|------------------|---------------|
| **Phase 0** | Pilot (test lab) | 2 weeks | | Fabric operational, DNAC integration working | N/A (lab only) |
| **Phase 1** | _[e.g., Floor 1, Bldg A]_ | 1 week | | 100% users online, no issues | Switch back to old switches |
| **Phase 2** | _[e.g., Floor 2, Bldg A]_ | 1 week | | 100% users online | Switch back to old switches |
| **Phase 3** | _[e.g., Building B]_ | 2 weeks | | All buildings operational | Revert to old core |
| **Phase N** | Final cutover | 1 week | | Old network decommissioned | Hold old switches for 30 days |

**Lessons Learned After Each Phase:**
- [ ] Document issues encountered
- [ ] Update migration runbook
- [ ] Adjust timeline if needed
- [ ] Update rollback procedures

### 8.4 Migration Coexistence Design

**If traditional and fabric networks coexist (Strategy 2 or 3):**

**Routing Between Networks:**

```
Traditional Network               SD-Access Fabric
  (OSPF/EIGRP)                    (LISP/VXLAN)
       │                                 │
       │                                 │
       └────── Border Nodes ─────────────┘
                (Route Redistribution)
```

**Border Configuration:**
- [ ] Traditional side: OSPF/EIGRP process
- [ ] Fabric side: LISP + VRF routing
- [ ] Route redistribution: Traditional ↔ Fabric
- [ ] Route filtering: Prevent loops
- [ ] Metrics tuned: Prefer fabric path

**User Migration Process:**

```
MIGRATION WORKFLOW (Per User/Port):

1. Identify user to migrate:
   - Username: _______
   - Current port: _______
   - Current VLAN: _______
   - Current switch: _______

2. Pre-migration validation:
   - [ ] User devices listed (PC, phone, etc.)
   - [ ] Application access documented
   - [ ] User notified (change window)

3. Physical migration:
   - [ ] Disconnect from old switch port
   - [ ] Connect to fabric edge switch port
   - [ ] DNAC provisions port automatically
   - [ ] ISE authenticates user (802.1X or MAB)
   - [ ] SGT assigned based on identity
   - [ ] User placed in correct VN

4. Post-migration validation:
   - [ ] User device has IP address (same subnet if reusing)
   - [ ] User can access applications
   - [ ] Voice phone operational (if applicable)
   - [ ] Printer access working
   - [ ] Internet access working

5. Success confirmation:
   - [ ] User confirms everything working
   - [ ] No tickets opened
   - [ ] Decommission old port
```

**Repeat for each user/port**

### 8.5 Migration Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **IP address conflicts** | Medium | High | Run IP conflict scan before migration |
| **VLAN mismatch** | Low | High | Validate VN-to-VLAN mapping in DNAC |
| **802.1X authentication failure** | Medium | High | Test with pilot users, have MAB fallback |
| **Application compatibility** | Low | Medium | Test critical apps in pilot phase |
| **User resistance** | Medium | Low | Communication plan, training |
| **Rollback complexity** | Medium | High | Document rollback procedure, test in lab |
| **Hybrid network routing issues** | High | Medium | Clear route filtering, monitor carefully |
| **Performance degradation** | Low | High | Baseline performance before migration |

---

## 9. IMPLEMENTATION ROADMAP

### 9.1 High-Level Timeline

**Customize this template for your deployment:**

| Phase | Activity | Duration | Dependencies | Milestones |
|-------|----------|----------|--------------|------------|
| **Phase 0** | Design & Planning | 4 weeks | None | Design approved, BoM finalized |
| **Phase 1** | Procurement | 8-12 weeks | Phase 0 complete | All hardware received |
| **Phase 2** | Infrastructure Build | 6 weeks | Phase 1 complete | DNAC + ISE operational |
| **Phase 3** | Pilot Deployment | 2 weeks | Phase 2 complete | Pilot site live |
| **Phase 4** | Site Rollout | 12-24 weeks | Phase 3 complete | All sites migrated |
| **Phase 5** | Stabilization | 4 weeks | Phase 4 complete | Performance baseline |
| **Phase 6** | Handoff | 2 weeks | Phase 5 complete | Operations trained |

**Total Duration**: _[Typically 38-50 weeks for large enterprise]_

### 9.2 Detailed Project Plan Template

| Week | Phase | Tasks | Owner | Status | Notes |
|------|-------|-------|-------|--------|-------|
| 1-4 | Design | Site surveys, capacity planning, design finalization | Architect | | |
| 5-12 | Procurement | BoM creation, vendor selection, ordering | Procurement | | |
| 13-15 | DNAC Setup | Cluster installation, network integration | Engineer | | |
| 16-18 | ISE Setup | PAN/PSN deployment, policy creation | Security Engineer | | |
| 19-20 | Pilot | Single floor/building migration | Team | | |
| 21-44 | Rollout | Phased site-by-site deployment | Team | | |
| 45-48 | Stabilization | Tuning, optimization, documentation | Team | | |

### 9.3 Resource Allocation

| Role | Weeks Required | Availability | Resource Name | Notes |
|------|----------------|--------------|---------------|-------|
| **Network Architect** | 8 weeks | Part-time (50%) | | Design + oversight |
| **Project Manager** | 40 weeks | Full-time | | End-to-end management |
| **Network Engineer** | 30 weeks | Full-time (2-3 people) | | Implementation |
| **Security Engineer** | 10 weeks | Part-time (50%) | | ISE + firewall |
| **Wireless Engineer** | 8 weeks | Part-time (50%) | | WLC + AP deployment |

---

## 10. VALIDATION CHECKLISTS

### 10.1 Pre-Deployment Checklist

**Complete BEFORE starting deployment:**

#### Design Validation
- [ ] Site profiling completed for all sites
- [ ] Architecture pattern selected for each site
- [ ] Hardware sizing formulas applied correctly
- [ ] Border load calculated (excluding edge-to-edge same-VN)
- [ ] Intermediate nodes requirement validated
- [ ] 3-year growth projection completed
- [ ] All capacity planning worksheets filled

#### Documentation
- [ ] Network topology diagrams created
- [ ] IP address plan documented
- [ ] VLAN-to-VN mapping defined
- [ ] SGT definitions documented (15-20 SGTs typical)
- [ ] SGACL policies designed (default-deny model)
- [ ] Firewall security zones defined
- [ ] Migration plan documented (if applicable)

#### Infrastructure Readiness
- [ ] All hardware ordered (8-12 week lead time)
- [ ] Rack space allocated (power, cooling validated)
- [ ] Management network in place
- [ ] Internet/WAN circuits ready
- [ ] DNAC cluster sized correctly (8,000 devices per cluster)
- [ ] ISE cluster designed (PAN + PSN + MnT)
- [ ] Licensing purchased (DNA Advantage, ISE Plus)

#### Team Readiness
- [ ] Team trained on SD-Access concepts
- [ ] DNAC training completed
- [ ] ISE training completed
- [ ] Cisco PSS engaged (if needed)
- [ ] Rollback procedures documented
- [ ] Change management approvals obtained

### 10.2 Post-Deployment Checklist

**Complete AFTER deployment:**

#### Capacity Validation
- [ ] Border throughput utilization <30%
- [ ] CP port utilization <80%
- [ ] Edge port utilization 60-80%
- [ ] PoE utilization 50-70%
- [ ] WLC AP count <40% of capacity

#### Functionality Validation
- [ ] All 5 traffic patterns tested (edge-to-edge, inter-VN, to-DC, to-Internet, control plane)
- [ ] SGT assignment working (ISE RADIUS returning SGT)
- [ ] SGT enforcement working (SGACL denies blocking as expected)
- [ ] Firewall integration operational (SXP if external firewall)
- [ ] DNAC discovery complete (all devices showing in DNAC)
- [ ] DNAC assurance collecting data (health scores visible)
- [ ] Wireless clients connecting (WLC showing associated clients)

#### Performance Validation
- [ ] Latency <1 ms for edge-to-edge (same VN)
- [ ] Latency 2-3 ms for inter-VN
- [ ] Latency <5 ms intra-site (within campus)
- [ ] No packet loss in fabric
- [ ] LISP convergence <5 seconds
- [ ] BFD detecting failures <1 second

#### High Availability Validation
- [ ] CP node failover tested (CP-1 shutdown, traffic continues)
- [ ] Border node failover tested (Border-1 shutdown, traffic continues)
- [ ] Edge stack failover tested (master switch shutdown, stack continues)
- [ ] WLC failover tested (WLC-1 shutdown, APs rejoin WLC-2)
- [ ] Firewall failover tested (FW-1 shutdown, FW-2 takes over)

#### Security Validation
- [ ] 802.1X authentication working
- [ ] MAB (MAC Authentication Bypass) working for non-802.1X devices
- [ ] Guest portal operational
- [ ] SGT-based blocking policies tested (e.g., Guest → Server = DENY)
- [ ] Firewall policies tested
- [ ] All denied traffic logged to SIEM

#### Operational Validation
- [ ] DNAC provisioning workflow tested (add new VLAN, takes <30 min)
- [ ] DNAC software upgrade tested (single device upgrade)
- [ ] Monitoring integration complete (syslog, NetFlow, SNMP)
- [ ] Backup procedures tested (DNAC + ISE backup confirmed)
- [ ] Runbooks created (troubleshooting guides)
- [ ] Operations team trained

---

## APPENDIX A: Formula Reference

### Border Load Calculation
```
Border_Load = Inter_VN_Traffic + 
              Edge_to_DC_Traffic + 
              Edge_to_WAN_Traffic

(EXCLUDE Edge-to-Edge Same-VN Traffic!)

3-Year Projected = Border_Load × 1.6
Platform Required = 3-Year Projected × 4
```

### Control Plane Port Requirement
```
Required_Ports = (Edge_Stacks × 2) + 
                 (Border_Nodes × 2) + 
                 (Peer_CP × 2) + 
                 (Reserved × 2)

IF Required_Ports > (CP_Total_Ports - 6):
    INTERMEDIATE NODES REQUIRED
```

### Intermediate Node Count
```
IF (Edge_Stacks × 2) > (CP_Available_Ports):
    Intermediate_Count = CEILING((Edge_Stacks × 2) / 20)
ELSE:
    Intermediate_Count = 0
```

### Edge Port Calculation
```
Required_Ports = (Wired_Devices + PoE_Devices) × 1.2 (growth)
Switches_per_Stack = CEILING(Required_Ports / 48)
```

### PoE Budget Calculation
```
PoE_Required = Σ(Device_Count × Wattage) × 1.2 (buffer)
PoE_per_Switch = 1,440W (for C9300-48U)
Switches_Needed = CEILING(PoE_Required / PoE_per_Switch)
```

### WLC AP Count
```
Required_APs = Total_Square_Feet / Coverage_per_AP

Coverage Guidelines:
- Open office: 2,500 sq ft per AP
- Standard office: 1,500 sq ft per AP
- High density: 500 sq ft per AP
```

---

## APPENDIX B: Decision Trees

### Architecture Pattern Selection
```
START
  │
  ├─> Users > 3,000 AND Buildings > 5?
  │   YES → FULL ARCHITECTURE
  │   NO → Continue
  │
  ├─> Users 500-3,000 OR Buildings 2-4?
  │   YES → STANDARD ARCHITECTURE (check for intermediate)
  │   NO → Continue
  │
  └─> Users < 500 AND Buildings = 1?
      YES → COLLAPSED ARCHITECTURE (FIAB)
```

### Intermediate Node Requirement
```
START
  │
  ├─> Calculate: Edge_Stacks × 2
  │
  ├─> Is result > (24 - 6)?
  │   YES → DEPLOY INTERMEDIATE NODES
  │   NO → Direct connection to CP
```

### WLC Selection
```
START
  │
  ├─> AP Count < 50?
  │   YES → Embedded WLC (on C9300-48UXM)
  │   NO → Continue
  │
  ├─> AP Count 50-500?
  │   YES → C9800-40
  │   NO → Continue
  │
  └─> AP Count > 500?
      YES → C9800-80
```

---

## APPENDIX C: Abhavtech Example (Reference)

This template is based on Abhavtech's real deployment. Use these values as reference:

| Site | Users | Buildings | Architecture | Edge Stacks | Intermediate | Border Load | Cost |
|------|-------|-----------|--------------|-------------|--------------|-------------|------|
| Mumbai | 4,800 | 6 | Full | 48 | 2 nodes | 28 Gbps | $X,XXX |
| Chennai | 2,400 | 3 | Standard | 18 | 2 nodes | 14 Gbps | $X,XXX |
| Noida | 300 | 1 | Collapsed | 2 (FIAB) | None | 2 Gbps | $X,XXX |

**Key Lessons from Abhavtech**:
1. Chennai needs intermediate despite being "standard" (port count!)
2. Border load is 70% of total traffic (30% is edge-to-edge same-VN)
3. Mumbai WLC capacity was under-estimated initially (400 APs needed, not 120)
4. Centralized DNAC works with 200ms latency for batch operations
5. Always deploy 2 × CP nodes (HA is critical)

---

**END OF TEMPLATE**

**HOW TO USE THIS TEMPLATE:**
1. Make a copy of this document
2. Replace all _[bracketed placeholders]_ with your actual values
3. Check boxes as you complete sections
4. Fill in all tables with site-specific data
5. Use formulas to validate hardware sizing
6. Review checklists before deployment

**Questions?** Refer to the detailed appendix documents for methodology.
