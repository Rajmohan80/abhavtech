# APPENDIX: HARDWARE SELECTION, CAPACITY PLANNING & TRAFFIC FLOW DESIGN

## Table of Contents

1. [Complete Network Architecture - All Site Types](#1-complete-network-architecture---all-site-types)
2. [Hardware Selection Methodology](#2-hardware-selection-methodology)
3. [Capacity Planning Framework](#3-capacity-planning-framework)
4. [Traffic Flow Architecture](#4-traffic-flow-architecture)
5. [Bandwidth Calculations](#5-bandwidth-calculations)
6. [DNAC Placement Strategy](#6-dnac-placement-strategy)
7. [Latency Mitigation Strategies](#7-latency-mitigation-strategies)
8. [SGT Policy Enforcement](#8-sgt-policy-enforcement)
9. [Design Recommendations](#9-design-recommendations)

---

## 1. COMPLETE NETWORK ARCHITECTURE - ALL SITE TYPES

### 1.1 Architecture Pattern Overview

SD-Access fabric supports three primary deployment models based on site size and requirements:

| Pattern | Site Size | Components | Use Case |
|---------|-----------|------------|----------|
| **Full Architecture** | >3,000 users | Border + CP + Intermediate + Edge | Large campuses, HQ sites |
| **Standard Architecture** | 500-3,000 users | Border + CP + Edge | Medium hubs without intermediate |
| **Collapsed Architecture (FIAB)** | <500 users | All-in-One device | Branches, small offices |

---

### 1.2 Mumbai Hub - Full Architecture with Intermediate Nodes

**Profile**: 4,800 users, 6 buildings, 48 edge node stacks

```
                    ┌─── EXTERNAL CONNECTIVITY ───┐
                    │                             │
              MPLS (10G)  DIA (10G)  DC (2×40G)  SD-WAN
                    │         │          │         │
                    └─────────┼──────────┼─────────┘
                              │          │
                    ┌─────────┴──────────┴─────────┐
                    │    BORDER LAYER (Fusion)     │
                    │  ┌────────┐    ┌────────┐    │
                    │  │Border-1│════│Border-2│    │
                    │  │C9500-  │SVL │C9500-  │    │
                    │  │24Y4C   │    │24Y4C   │    │
                    │  └────┬───┘    └───┬────┘    │
                    └───────┼────────────┼─────────┘
                            │            │
                    ┌───────┴────────────┴─────────┐
                    │   CONTROL PLANE LAYER        │
                    │  ┌────────┐    ┌────────┐    │
                    │  │  CP-1  │    │  CP-2  │    │
                    │  │C9500-  │    │C9500-  │    │
                    │  │24Y4C   │    │24Y4C   │    │
                    │  └────┬───┘    └───┬────┘    │
                    └───────┼────────────┼─────────┘
                            │            │
                    ┌───────┴────────────┴─────────┐
                    │   INTERMEDIATE LAYER         │
                    │  ┌────────┐    ┌────────┐    │
                    │  │ Intm-1 │    │ Intm-2 │    │
                    │  │C9500-  │    │C9500-  │    │
                    │  │24Y4C   │    │24Y4C   │    │
                    │  │(Bldg   │    │(Bldg   │    │
                    │  │ A-C)   │    │ D-F)   │    │
                    │  └────┬───┘    └───┬────┘    │
                    └───────┼────────────┼─────────┘
                            │            │
            ┌───────────────┼────────────┼───────────────┐
            │               │            │               │
      ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐   ...
      │ Stack 1-8 │   │Stack 9-16 │   │Stack17-24 │
      │ (Bldg A)  │   │ (Bldg B)  │   │ (Bldg C)  │
      │ 3×C9300   │   │ 3×C9300   │   │ 3×C9300   │
      │ -48U      │   │ -48U      │   │ -48U      │
      └───────────┘   └───────────┘   └───────────┘
            │               │                │
      [4,800 Employees] [APs: 400] [IoT: 2,000]
```

**Key Characteristics**:
- **Intermediate Nodes Required**: 48 edge stacks exceed CP port capacity (24 ports)
- **Port Distribution**: CP has 24 ports - 6 (uplinks) = 18 available, but need 96 connections (48 × 2)
- **Traffic Handling**: 40 Gbps peak (10 Gbps edge-to-edge, 30 Gbps via Border)
- **Total Cost**: $X,XXX

---

### 1.3 Chennai Hub - Standard Architecture without Intermediate

**Profile**: 2,400 users, 3 buildings, 18 edge node stacks

```
                    ┌─── EXTERNAL CONNECTIVITY ───┐
                    │                             │
              MPLS (10G)  DIA (5G)   SD-WAN
                    │         │          │
                    └─────────┼──────────┘
                              │
                    ┌─────────┴──────────┐
                    │    BORDER LAYER    │
                    │  ┌────────┐ ┌────────┐
                    │  │Border-1│═│Border-2│
                    │  │C9500-  │ │C9500-  │
                    │  │24Y4C   │ │24Y4C   │
                    │  └────┬───┘ └───┬────┘
                    └───────┼─────────┼─────┘
                            │         │
                    ┌───────┴─────────┴─────┐
                    │   CONTROL PLANE       │
                    │  ┌────────┐ ┌────────┐│
                    │  │  CP-1  │ │  CP-2  ││
                    │  │C9500-  │ │C9500-  ││
                    │  │24Y4C   │ │24Y4C   ││
                    │  └────┬───┘ └───┬────┘│
                    └───────┼─────────┼─────┘
                            │         │
            ┌───────────────┼─────────┼───────────────┐
            │               │         │               │
      ┌─────┴─────┐   ┌─────┴─────┐  ┌──────┴──────┐
      │ Stack 1-6 │   │Stack 7-12 │  │ Stack 13-18 │
      │ (Bldg A)  │   │ (Bldg B)  │  │  (Bldg C)   │
      │ 3×C9300   │   │ 3×C9300   │  │  3×C9300    │
      │ -48U      │   │ -48U      │  │  -48U       │
      └───────────┘   └───────────┘  └─────────────┘
            │               │               │
      [2,400 Employees] [APs: 200] [IoT: 1,000]
```

**Key Characteristics**:
- **No Intermediate Needed**: 18 edge stacks = 36 connections
- **Port Validation**: CP has 24 ports - 6 (uplinks) = 18 ports available
- **Issue Identified**: 36 connections > 18 ports → **REQUIRES 2 Intermediate nodes**
- **Corrected Design**: Add 2 × Intermediate nodes (9 stacks each)
- **Traffic Handling**: 20 Gbps peak (5 Gbps edge-to-edge, 15 Gbps via Border)
- **Total Cost**: $X,XXX (with intermediate nodes)

**Design Lesson**: Even "standard" architecture may need intermediate nodes based on port count, not just building count.

---

### 1.4 Noida Branch - Collapsed Architecture (FIAB)

**Profile**: 300 users, 1 building, 3 floors

```
                    ┌─── WAN CONNECTIVITY ───┐
                    │                        │
              MPLS (10G)  DIA (1G)  SD-WAN
                    │         │         │
                    └─────────┼─────────┘
                              │
                    ┌─────────┴──────────────┐
                    │  FABRIC-IN-A-BOX       │
                    │  (All Roles Combined)  │
                    │                        │
                    │  ┌──────────────────┐  │
                    │  │  FIAB Stack      │  │
                    │  │  (Border+CP+Edge)│  │
                    │  │                  │  │
                    │  │  Switch 1:       │  │
                    │  │  C9300-48UXM     │  │
                    │  │  (Master)        │  │
                    │  │                  │  │
                    │  │  Switch 2:       │  │
                    │  │  C9300-48UXM     │  │
                    │  │  (Standby)       │  │
                    │  │                  │  │
                    │  │  Ports: 96 total │  │
                    │  │  - WAN: 6 ports  │  │
                    │  │  - Users: 90     │  │
                    │  └──────────────────┘  │
                    └────────┬───────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              ┌─────┴─────┐    ┌─────┴─────┐
              │Fabric Edge│    │Access SW  │
              │2×C9300-48U│    │4×C9200-48P│
              └─────┬─────┘    └─────┬─────┘
                    │                │
              [300 Employees] [APs: 20] [IoT: 100]
```

**Key Characteristics**:
- **All-in-One Design**: FIAB handles Border, CP, and Edge roles
- **Port Allocation**: 96 ports - 10 (WAN/fabric overhead) = 86 user ports
- **Additional Access**: 2 × fabric edge + 4 × traditional access for capacity
- **Traffic Handling**: 3 Gbps peak (0.5 Gbps edge-to-edge, 2.5 Gbps via WAN)
- **Total Cost**: $X,XXX (lowest cost per site)

---

### 1.5 Architecture Pattern Selection Criteria

| Criteria | Full Architecture | Standard Architecture | Collapsed (FIAB) |
|----------|-------------------|----------------------|------------------|
| **User Count** | >3,000 | 500-3,000 | <500 |
| **Buildings** | 5+ | 2-4 | 1 |
| **Edge Nodes** | >40 | 10-40 | <10 |
| **Intermediate Needed?** | YES (>40 edges) | CHECK PORTS | NO |
| **Cost per User** | $X,XXX| $X,XXX| $X,XXX|
| **Complexity** | High | Medium | Low |
| **Scalability** | 5+ years | 3-5 years | 2-3 years |
| **HA Level** | Full redundancy | Full redundancy | Stack + WAN dual |

**Decision Rule**:
```
IF edge_stacks × 2 > (CP_ports - 6):
    DEPLOY intermediate_nodes
ELSE:
    DIRECT connection to CP
```

---

## 2. HARDWARE SELECTION METHODOLOGY

### 2.1 Border Node Selection

**Purpose**: External connectivity, inter-VN routing, NAT, firewall handoff

#### Selection Criteria:

1. **Traffic Load Calculation**:
   ```
   Total_Border_Load = Inter_VN_Traffic + 
                       Edge_to_DC_Traffic + 
                       Edge_to_WAN_Traffic + 
                       Edge_to_Internet_Traffic
   
   (Do NOT include edge-to-edge same-VN traffic!)
   ```

2. **Platform Sizing**:
   ```
   Required_Throughput = Total_Border_Load × Growth_Factor (1.6 for 3-year)
   Selected_Platform_Throughput ≥ Required_Throughput × 4 (safety margin)
   ```

3. **Port Count Validation**:
   - Internal fabric connections: 4-8 ports (to CP, Intermediate)
   - External connections: 4-10 ports (WAN, DC, Internet)
   - Peer border (SVL): 2-4 ports (100G)
   - **Total minimum**: 12-20 ports

#### Mumbai Example:

| Traffic Type | Current (Gbps) | 3-Year Projected (Gbps) |
|--------------|----------------|-------------------------|
| Inter-VN | 3 | 5 |
| To Data Center | 15 | 24 |
| To WAN/Internet | 10 | 16 |
| **Total Border Load** | **28** | **45** |
| Edge-to-Edge (NOT counted) | 10 | 16 |

**Platform Selection**:
- Required: 45 Gbps × 4 = 180 Gbps minimum
- Selected: **C9500-24Y4C** (440 Gbps throughput)
- Utilization: 45 / 440 = 10.2% (excellent headroom)
- Cost: $X,XXX × 2 (HA) = $X,XXX

**Alternative Platforms**:

| Model | Ports | Throughput | Use Case | Cost |
|-------|-------|------------|----------|------|
| C9500-16X | 16×10G | 800 Gbps | Small sites (<10 Gbps) | $X,XXX |
| C9500-24Y4C | 24×25G + 4×100G | 440 Gbps | **Medium hubs** (10-50 Gbps) | $X,XXX |
| C9500-48Y4C | 48×25G + 4×100G | 880 Gbps | Large hubs (>50 Gbps) | $X,XXX |
| C9600-48Y8C | 48×25G + 8×100G | 1.2 Tbps | Data centers (>100 Gbps) | $X,XXX |

---

### 2.2 Control Plane Node Selection

**Purpose**: LISP Map-Server/Map-Resolver, EID database, control plane signaling

#### Selection Criteria:

1. **Port Count (Primary Factor)**:
   ```
   Required_Ports = (Edge_Stacks × 2) + 
                    (Border_Nodes × 2) + 
                    (Intermediate_Nodes × 2) + 
                    (Peer_CP × 2) + 
                    (Reserved × 2)
   
   If Required_Ports > 20:
       ADD intermediate nodes OR
       USE larger platform (C9500-48Y4C)
   ```

2. **LISP Database Size** (Secondary Factor):
   - Small: <10,000 EIDs → Any platform sufficient
   - Medium: 10,000-50,000 EIDs → C9500-24Y4C
   - Large: >50,000 EIDs → C9500-48Y4C or distributed CP

3. **Control Plane Traffic** (Negligible):
   - LISP Map-Request/Register: ~500 Mbps typical
   - BFD keepalives: ~100 Mbps
   - Total: <1 Gbps (even for large deployments)
   - **Throughput NOT a factor** in CP selection

#### Mumbai Example:

**Port Count Calculation**:
```
Edge connections: 48 stacks × 2 = 96 ports
Border uplinks: 2 × 2 = 4 ports
Peer CP link: 2 ports
Total: 102 ports

C9500-24Y4C has 24 ports → INSUFFICIENT!

Solution: Add 2 Intermediate nodes
- Each Intermediate connects 24 edges
- CP connections become:
  - To Border: 4 ports
  - To Intermediate-1: 2 ports
  - To Intermediate-2: 2 ports
  - Peer CP: 2 ports
  - Reserved: 4 ports
  Total: 14 ports ✓ (fits in 24-port platform)
```

**Platform Selection**:
- Selected: **C9500-24Y4C** (24 ports, 440 Gbps throughput)
- Quantity: 2 (always deploy HA pair)
- Cost: $X,XXX × 2 = $X,XXX

**Key Insight**: CP selection driven by **port count**, not throughput!

---

### 2.3 Intermediate Node Selection

**Purpose**: Aggregation layer, extends fabric reach, reduces CP port consumption

#### When Intermediate Nodes Are Required:

```
DECISION MATRIX:

IF (Edge_Stacks × 2) > (CP_Available_Ports):
    INTERMEDIATE = REQUIRED
    
WHERE:
    CP_Available_Ports = Total_CP_Ports - 
                         Border_Connections - 
                         Peer_CP_Connection - 
                         Reserved_Ports
    
EXAMPLE:
    Mumbai: (48 × 2) = 96 > (24 - 6) = 18 → REQUIRED
    Chennai: (18 × 2) = 36 > (24 - 6) = 18 → REQUIRED (!)
    Noida: (2 × 2) = 4 < (24 - 6) = 18 → NOT REQUIRED
```

#### Selection Criteria:

1. **Traffic Aggregation**:
   ```
   Per_Intermediate_Load = (Connected_Edges × Average_Edge_Traffic) / 
                           Oversubscription_Ratio
   
   Acceptable Oversubscription: 3:1 to 5:1
   
   Example (Mumbai Intm-1):
   - Connected edges: 24 stacks
   - Average per stack: 2 Gbps
   - Total: 48 Gbps aggregate
   - Uplink capacity: 4×10G = 40 Gbps
   - Oversubscription: 48:40 = 1.2:1 (excellent!)
   ```

2. **Port Count**:
   ```
   Required_Ports = (Connected_Edges × 2) + 
                    (Uplinks_to_CP × 2) + 
                    (Uplinks_to_Border × 2) + 
                    (Reserved × 4)
   
   Mumbai Example:
   - Edges: 24 × 2 = 48 ports (would need 48-port platform)
   - But use breakout: 24 × 25G ports with 10G optics
   - Uplinks: 8 ports
   - Total: 32 ports needed → C9500-24Y4C insufficient
   
   Solution: Use 4×100G QSFP ports broken out to 16×10G
   Total usable: 24 (25G) + 16 (10G from breakout) = 40 ports ✓
   ```

3. **Platform Consistency**:
   - **Best Practice**: Use same platform as Border/CP (operational simplicity)
   - Selected: **C9500-24Y4C** (matches Border/CP)
   - Cost: $X,XXX × 2 = $X,XXX

**Alternative**: If >40 edges per intermediate, use C9500-48Y4C

---

### 2.4 Edge Node Selection

**Purpose**: User access, device connectivity, SGT assignment, 802.1X authentication

#### Selection Criteria:

1. **Port Density per Floor**:
   ```
   Required_Ports_per_Floor = (Wired_Devices + 
                               PoE_Devices + 
                               APs + 
                               Cameras + 
                               IoT) × Growth_Buffer (1.2)
   
   Example (Mumbai typical floor):
   - Wired PCs: 80
   - IP Phones: 80
   - APs: 5
   - Cameras: 12
   - IoT: 20
   - Total: 197 × 1.2 = 236 ports
   ```

2. **PoE Budget Calculation**:
   ```
   Required_PoE = Σ(Device_Count × Wattage) × Buffer (1.2)
   
   Example:
   - IP Phones: 80 × 15W = 1,200W
   - APs: 5 × 30W = 150W
   - Cameras: 12 × 15W = 180W
   - IoT: 20 × 5W = 100W
   - Subtotal: 1,630W
   - With buffer: 1,956W required
   ```

3. **Stack Sizing**:
   ```
   Stack_Members = CEILING(Required_Ports / 48) + Redundancy
   
   Example:
   - Required: 236 ports
   - Base: 236 / 48 = 4.9 → 5 switches
   - With N+1 redundancy: 5 + 1 = 6 switches
   - But for cost: Use 3-4 switches with higher utilization
   
   Selected: 3 × C9300-48U
   - Ports: 144 total
   - Utilization: 236 / 144 = 164% → TOO HIGH!
   
   Revised: 4 × C9300-48U
   - Ports: 192 total
   - Utilization: 236 / 192 = 123% → Still over!
   
   Final: 5 × C9300-48U (for Mumbai high-density floors)
   OR re-evaluate actual port needs (many users wireless-only)
   
   Abhavtech actual: 3 × C9300-48U with 120 active ports (83% utilization)
   ```

4. **Platform Comparison**:

| Model | Ports | PoE Budget | PoE Type | Uplinks | Stack BW | Use Case | Cost |
|-------|-------|------------|----------|---------|----------|----------|------|
| **C9300-24P** | 24×1G | 370W | PoE+ | 4×1G + 2×10G | 160 Gbps | Small IDF | $X,XXX |
| **C9300-48U** | 48×1G | 1440W | UPOE | 4×1G + 4×10G | 160 Gbps | **Standard** | $X,XXX |
| **C9300-48UXM** | 48×mGig | 1440W | PoE++ | 8×10G + 2×40G | 480 Gbps | WiFi 6E dense | $X,XXX |

**Selection for Abhavtech**:
- Mumbai: **3 × C9300-48U** per floor (144 ports, 4,320W PoE)
- Reason: Balances cost ($X,XXX/stack) with adequate capacity
- Utilization: 120 ports / 144 = 83% (good)
- PoE: 1,500W / 4,320W = 35% (sufficient headroom)

---

### 2.5 WLC (Wireless LAN Controller) Selection

**Purpose**: Centralized wireless management, CAPWAP tunnels, mobility management

#### Selection Criteria:

1. **AP Count Calculation**:
   ```
   Required_APs = Total_Square_Feet / Coverage_per_AP
   
   Coverage_per_AP (typical):
   - Open office: 2,500 sq ft
   - Dense office: 1,500 sq ft
   - High density (auditorium): 500 sq ft
   
   Mumbai Example:
   - Total area: 600,000 sq ft
   - Density: 1,500 sq ft per AP
   - Required: 600,000 / 1,500 = 400 APs
   ```

2. **Client Load**:
   ```
   Wireless_Clients = Total_Users × Wireless_Ratio
   
   Mumbai:
   - Total users: 4,800
   - Wireless ratio: 70%
   - Clients: 3,360 concurrent
   
   Per AP: 3,360 / 400 = 8.4 clients per AP (acceptable)
   ```

3. **Throughput Calculation**:
   ```
   Total_Throughput = Wireless_Clients × Avg_Bandwidth_per_Client
   
   - Per client: 10 Mbps average
   - Total: 3,360 × 10 Mbps = 33.6 Gbps aggregate
   - With 20:1 oversubscription: 1.7 Gbps actual
   ```

4. **Platform Selection**:

| Model | Max APs | Max Clients | Throughput | HA Mode | Use Case | Cost |
|-------|---------|-------------|------------|---------|----------|------|
| **C9800-L** | 200 | 2,000 | 10 Gbps | Active-Standby | Small sites | $X,XXX |
| **C9800-40** | 2,000 | 64,000 | 40 Gbps | SSO | **Medium hubs** | $X,XXX |
| **C9800-80** | 6,000 | 64,000 | 80 Gbps | SSO | Large hubs | $X,XXX |
| **Embedded WLC** | 100 | 2,000 | N/A | Stateless | **Branches** | $X,XXX|

**Selection for Abhavtech**:
- Mumbai: **C9800-40** (400 APs / 2,000 capacity = 20% utilization)
- Chennai: **C9800-40** (200 APs / 2,000 capacity = 10% utilization)
- Noida: **Embedded WLC** on C9300-48UXM (20 APs / 100 capacity = 20%)

**Design Note**: Prefer centralized WLC for hubs (advanced features), embedded WLC for branches (cost optimization)

---

## 3. CAPACITY PLANNING FRAMEWORK

### 3.1 Capacity Planning Checklist

For each site, validate the following:

#### Border Nodes:
- [ ] Traffic load calculated (exclude edge-to-edge same-VN)
- [ ] 3-year growth factored (typically 60-80% increase)
- [ ] Platform throughput ≥ 4× current load
- [ ] Port count validated (internal + external)
- [ ] HA configuration defined (active-standby or active-active)

#### Control Plane Nodes:
- [ ] Edge node count confirmed
- [ ] Port requirement calculated: (edges × 2) + (borders × 2) + (peer CP × 2)
- [ ] Intermediate nodes needed? (Yes if port requirement > 20)
- [ ] LISP database size estimated (typically <10K EIDs per site)
- [ ] Always deploy 2 × CP nodes (HA critical)

#### Intermediate Nodes (if required):
- [ ] Number of intermediate nodes: CEILING(Total_Edges / 24)
- [ ] Traffic aggregation calculated per intermediate
- [ ] Oversubscription ratio acceptable (3:1 to 5:1)
- [ ] Platform selected (prefer consistency with Border/CP)

#### Edge Nodes:
- [ ] Port count per floor/building calculated
- [ ] PoE budget validated per stack
- [ ] Stack size determined (3-5 switches typical)
- [ ] Uplink capacity planned (typically 2×10G per stack)
- [ ] Growth headroom validated (aim for 60-80% utilization)

#### Wireless:
- [ ] AP count calculated (sq ft / coverage_per_AP)
- [ ] Client load estimated (users × wireless_ratio)
- [ ] WLC capacity validated (AP count < 40% of max)
- [ ] Throughput validated (client_count × avg_bandwidth)

---

### 3.2 Capacity Planning Formulas

#### Port Calculation:
```
Edge_Stack_Ports_Required = (Wired_Devices + PoE_Devices) × 1.2 (growth)
Number_of_Switches_per_Stack = CEILING(Ports_Required / 48) + N+1_Redundancy
Total_Edge_Switches = Number_per_Stack × Number_of_Stacks
```

#### PoE Budget:
```
PoE_per_Stack = Σ(Device_Type_Count × Wattage_per_Device) × 1.2 (buffer)
Switches_for_PoE = CEILING(PoE_Required / PoE_per_Switch)
Selected_Switches = MAX(Switches_for_Ports, Switches_for_PoE)
```

#### Throughput Sizing:
```
Border_Load = Inter_VN + To_DC + To_WAN (exclude edge-to-edge same-VN)
3yr_Projected = Current_Load × 1.6 (60% growth)
Platform_Throughput_Required = 3yr_Projected × 4 (safety margin)
```

#### Intermediate Node Count:
```
IF (Edge_Stacks × 2) > (CP_Ports - 6):
    Intermediate_Count = CEILING((Edge_Stacks × 2) / 20)
ELSE:
    Intermediate_Count = 0
```

---

### 3.3 Growth Projection Model

**3-Year Growth Assumptions**:

| Metric | Year 1 | Year 2 | Year 3 | Compound Growth |
|--------|--------|--------|--------|-----------------|
| User Count | +20% | +20% | +20% | 73% total |
| IoT Devices | +40% | +40% | +30% | 156% total |
| Bandwidth per User | +15% | +15% | +10% | 45% total |
| Total Traffic | +35% | +25% | +20% | 103% total (≈2× current) |

**Example (Mumbai)**:

| Component | Current | Year 1 | Year 2 | Year 3 | Capacity | Year 3 Util% |
|-----------|---------|--------|--------|--------|----------|--------------|
| Users | 4,800 | 5,760 | 6,912 | 8,294 | 10,000 | 83% |
| Edge Ports | 5,400 | 6,480 | 7,776 | 9,331 | 6,912 | **135% ⚠️** |
| Border Load | 28 Gbps | 38 Gbps | 47 Gbps | 57 Gbps | 440 Gbps | 13% |
| WLC APs | 400 | 480 | 576 | 691 | 2,000 | 35% |

**Action Required**: Add edge stacks in Year 1-2 to accommodate port growth

---

## 4. TRAFFIC FLOW ARCHITECTURE

### 4.1 Traffic Pattern Classification

SD-Access fabric supports multiple traffic patterns with different handling:

| Pattern | Path | Border Traversal | Latency | Bandwidth Impact | % of Total |
|---------|------|------------------|---------|------------------|------------|
| **Edge-to-Edge (Same VN)** | Direct VXLAN | NO | <1 ms | Edge uplinks only | 25% |
| **Inter-VN (Same Site)** | Via Border | YES | 2-3 ms | Border + edges | 7% |
| **Edge-to-DC** | Via Border | YES | 1-2 ms | Border + DC link | 38% |
| **Edge-to-Internet** | Via Border + FW | YES | 20-50 ms | Border + WAN | 25% |
| **Control Plane** | To CP nodes | NO | <1 ms | Minimal (<1 Gbps) | 5% |

---

### 4.2 Traffic Flow: Edge-to-Edge (Same VN)

**Scenario**: Employee PC accessing file server (both in VN_CORPORATE)

```
[PC: 10.100.1.50]                    [Server: 10.100.1.200]
     │ VLAN 10                              │ VLAN 10
     │ SGT 10 (Employee)                    │ SGT 70 (Servers)
     ▼                                      ▲
[Edge-Stack-3]                         [Edge-Stack-20]
   10.250.1.15                            10.250.1.50
     │                                      ▲
     │ ① LISP lookup: Where is             │
     │    10.100.1.200?                     │
     │    CP responds: 10.250.1.50          │
     │                                      │
     │ ② VXLAN encapsulation               │
     │    Outer: 10.250.1.15 → 10.250.1.50 │
     │    Inner: 10.100.1.50 → 10.100.1.200│
     │    VNI: 8001 (VN_CORPORATE)         │
     │    SGT: 10 (preserved in CMD)       │
     │                                      │
     │ ③ IS-IS routing (underlay)          │
     └────→ [Intermediate-1] ──→ [CP-1] ──→┘
              (transit only)    (transit)
     
     ④ Edge-Stack-20 VXLAN decapsulation
     ⑤ SGT policy check: 10 → 70 = PERMIT
     ⑥ Forward to server on VLAN 10
```

**Key Points**:
- **Optimized Path**: Direct VXLAN tunnel between edge nodes
- **Border Bypassed**: Border NOT involved (same VN)
- **SGT Preserved**: Inline tagging through VXLAN
- **Latency**: <1 ms (3 hops: Edge → Intm → CP → Edge)
- **Bandwidth**: Loads edge uplinks + underlay, NOT border

---

### 4.3 Traffic Flow: Inter-VN (Different VN)

**Scenario**: Guest user accessing corporate printer (VN_GUEST → VN_CORPORATE)

```
[Guest Laptop: 10.101.1.75]           [Printer: 10.100.50.10]
     │ VLAN 30 (Guest)                     │ VLAN 50 (Corporate)
     │ SGT 40 (Guest)                      │ SGT 60 (Printers)
     ▼                                     ▲
[Edge-Stack-8]                            │
   10.250.1.25                            │
     │                                     │
     │ ① LISP lookup: 10.100.50.10        │
     │    Not in VN_GUEST                 │
     │    Must route via Border           │
     │                                    │
     │ ② VXLAN to Border                 │
     │    Outer: 10.250.1.25 → 10.250.1.1│
     │    VNI: 8003 (VN_GUEST)           │
     │    SGT: 40                        │
     ▼                                    │
[Border-1: 10.250.1.1]                   │
     │                                    │
     │ ③ VXLAN decap                     │
     │ ④ Inter-VN routing                │
     │    VRF GUEST → VRF CORPORATE      │
     │                                    │
     │ ⑤ SGT Policy Check (CRITICAL!)    │
     │    Source: SGT 40 (Guest)         │
     │    Dest: SGT 60 (Printers)        │
     │    Policy: Guest → Printer?       │
     │    SGACL: PERMIT (port 9100)      │
     │                                    │
     │ ⑥ Re-encapsulate in VXLAN         │
     │    Outer: 10.250.1.1 → 10.250.1.35│
     │    VNI: 8001 (VN_CORPORATE)       │
     │    SGT: 40 (preserved)            │
     └────────────────────────────────────┘
                   │
                   ▼
              [Edge-Stack-18]
                   │
                   └──→ [Printer]
```

**Key Points**:
- **Border Required**: Inter-VN routing only at Border
- **SGT Enforcement**: Border enforces SGACL (Guest → Printer)
- **Hairpin Traffic**: Edge → Border → Edge
- **Latency**: 2-3 ms (longer path)
- **Bandwidth**: Counted toward Border load

---

### 4.4 Traffic Flow: Edge-to-Internet (via Firewall)

**Scenario**: Employee browsing Internet

```
[Employee PC: 10.100.1.50]
     │ VN_CORPORATE
     │ SGT 10 (Employee)
     ▼
[Edge-Stack-3]
     │ VXLAN to Border
     ▼
[Border-1]
     │ VXLAN decap
     │ Routing: 0.0.0.0/0 → Firewall
     │ Remove VXLAN (native IP)
     │
     │ SXP: Tells firewall "10.100.1.50 = SGT 10"
     ▼
[Firewall: FTD 4150]
     │ Lookup: 10.100.1.50 → SGT 10 (from SXP)
     │ Policy: SGT 10 → Internet = PERMIT
     │ IPS inspection: PASS
     │ URL filter: google.com = ALLOW
     │ NAT: 10.100.1.50 → 203.0.113.50 (PAT)
     ▼
[ISP Router] → Internet
```

**Key Points**:
- **Border Terminates VXLAN**: Firewall sees native IP (no VXLAN)
- **SGT via SXP**: Border sends IP-to-SGT bindings to firewall
- **Firewall Enforces**: SGT-based policies + NAT
- **Latency**: 20-50 ms (includes firewall + Internet)
- **Bandwidth**: Counted toward Border load + WAN circuits

---

### 4.5 SGT Policy Enforcement Points

**Where SGT Policies Are Enforced**:

| Enforcement Point | Traffic Type | Method | Use Case |
|-------------------|--------------|--------|----------|
| **Edge Nodes** | Intra-VN (same subnet) | SGACL (local) | Rare (most same-subnet is permitted) |
| **Border Nodes** | Inter-VN, to DC, to WAN | SGACL (inline) | **Primary enforcement point** |
| **Firewall** | To Internet, DMZ | SGT-based rules (via SXP) | External traffic only |
| **Data Center** | Server access | SGACL on DC switches | East-west DC traffic |

**Example Policy Flow**:

```
Employee (SGT 10) → IoT Sensor (SGT 50):
├─ Same VN? NO (Corporate vs IoT)
├─ Enforcement point: Border
├─ SGACL check: SGT 10 → SGT 50?
├─ Policy: PERMIT (Employee can manage IoT)
└─ Action: Forward

Guest (SGT 40) → Server (SGT 70):
├─ Same VN? NO (Guest vs Corporate)
├─ Enforcement point: Border
├─ SGACL check: SGT 40 → SGT 70?
├─ Policy: DENY (Guest isolation)
└─ Action: DROP + LOG

IoT Sensor (SGT 50) → Server (SGT 70):
├─ Same VN? NO (IoT vs Corporate)
├─ Enforcement point: Border
├─ SGACL check: SGT 50 → SGT 70?
├─ Policy: DENY (Prevent lateral movement)
└─ Action: DROP + LOG + ALERT
```

---

## 5. BANDWIDTH CALCULATIONS

### 5.1 Complete Bandwidth Calculation Methodology

#### Step 1: Categorize Traffic by Pattern

For each site, calculate traffic for each pattern:

```
TRAFFIC PATTERNS:

1. Edge-to-Edge (Same VN)
   = User-to-User + User-to-Local-Server + Phone-to-CallManager
   
2. Inter-VN (Same Site)
   = Guest-to-Printer + Contractor-to-App + IoT-to-Mgmt
   
3. Edge-to-Data Center
   = User-to-DB + User-to-FileServer + Backup-to-Storage
   
4. Edge-to-Internet/WAN
   = Web-Browsing + SaaS-Apps + Cloud-Sync + VPN
   
5. Control Plane
   = LISP + BFD + ISIS (typically <1 Gbps, ignore for sizing)
```

#### Step 2: Calculate Per-User Bandwidth

**Typical Bandwidth per User** (peak hour):

| Application | Avg Bandwidth | Peak Bandwidth | % of Users |
|-------------|---------------|----------------|------------|
| Email/Web | 0.5 Mbps | 2 Mbps | 90% |
| Video Conference | 2 Mbps | 5 Mbps | 20% |
| VoIP | 0.1 Mbps | 0.1 Mbps | 50% |
| File Transfer | 5 Mbps | 20 Mbps | 10% |
| Database Access | 1 Mbps | 5 Mbps | 30% |

**Aggregate Calculation**:
```
Mumbai (4,800 users):
- Email/Web: 4,800 × 90% × 0.5 Mbps = 2,160 Mbps = 2.2 Gbps
- Video: 4,800 × 20% × 2 Mbps = 1,920 Mbps = 1.9 Gbps
- VoIP: 4,800 × 50% × 0.1 Mbps = 240 Mbps = 0.2 Gbps
- File: 4,800 × 10% × 5 Mbps = 2,400 Mbps = 2.4 Gbps
- Database: 4,800 × 30% × 1 Mbps = 1,440 Mbps = 1.4 Gbps

Total Peak: 8.1 Gbps (user-generated)

Add:
- IoT telemetry: 2 Gbps
- Servers (internal): 5 Gbps
- Guest users: 1 Gbps

Total Site Traffic: 16.1 Gbps
```

#### Step 3: Distribute Across Patterns

**Traffic Distribution** (typical enterprise):

```
Mumbai 40 Gbps Total:
├─ Edge-to-Edge (same VN): 10 Gbps (25%)
│   └─ Does NOT load Border
│
├─ Inter-VN: 3 Gbps (7.5%)
│   └─ Loads Border
│
├─ To Data Center: 15 Gbps (37.5%)
│   └─ Loads Border
│
├─ To Internet/WAN: 10 Gbps (25%)
│   └─ Loads Border + Firewall
│
└─ Control Plane: 2 Gbps (5%)
    └─ Does NOT load Border

Border Load = 3 + 15 + 10 = 28 Gbps (NOT 40 Gbps!)
```

---

### 5.2 Mumbai Complete Bandwidth Breakdown

**Total Site Traffic: 40 Gbps (peak hour)**

#### Pattern 1: Edge-to-Edge (Same VN) - 10 Gbps
```
Flow Examples:
├─ PC to File Server (both VN_CORPORATE, VLAN 10): 4 Gbps
├─ Phone to Call Manager (VN_VOICE): 1 Gbps
├─ IoT Sensor to IoT Gateway (VN_IOT): 3 Gbps
└─ Wireless client to printer (same VN): 2 Gbps

Path: Edge → Intermediate → CP (transit) → Edge
Border: NOT traversed ✓
Latency: 0.5 ms
```

#### Pattern 2: Inter-VN (Same Site) - 3 Gbps
```
Flow Examples:
├─ Guest to Corporate printer: 0.5 Gbps
├─ Contractor to Corporate app: 1 Gbps
├─ IoT to Management console: 0.5 Gbps
└─ Voice to Corporate integration: 1 Gbps

Path: Edge → Border (VRF routing) → Edge
Border: REQUIRED ✓
Latency: 2 ms
```

#### Pattern 3: Edge-to-Data Center - 15 Gbps
```
Flow Examples:
├─ Users to database servers: 8 Gbps
├─ Users to file storage: 4 Gbps
├─ Application tier to DB tier: 2 Gbps
└─ Backup to storage: 1 Gbps

Path: Edge → Border → DC Core → DC Switches
Border: REQUIRED ✓
Latency: 1-2 ms
```

#### Pattern 4: Edge-to-Internet/WAN - 10 Gbps
```
Flow Examples:
├─ Web browsing (HTTP/HTTPS): 4 Gbps
├─ SaaS apps (Office365, Salesforce): 3 Gbps
├─ Cloud sync (Dropbox, OneDrive): 2 Gbps
└─ VPN to remote sites: 1 Gbps

Path: Edge → Border → Firewall → ISP/MPLS
Border: REQUIRED ✓
Firewall: REQUIRED ✓
Latency: 20-50 ms (Internet) or 10-30 ms (MPLS)
```

#### Pattern 5: Control Plane - 2 Gbps
```
Flow Examples:
├─ LISP Map-Request/Register: 0.5 Gbps
├─ BFD keepalives: 0.3 Gbps
├─ ISIS routing updates: 0.2 Gbps
└─ SXP (SGT) exchanges: 1 Gbps

Path: All nodes → CP nodes
Border: NOT traversed (unless CP on different segment)
Latency: <1 ms
```

**Summary**:
```
Total Traffic: 40 Gbps
├─ Border Load: 28 Gbps (Inter-VN + DC + WAN)
├─ Edge Uplinks: 40 Gbps (all traffic)
├─ Intermediate: 40 Gbps (all transit)
└─ CP: 2 Gbps (control only)

Key Insight: Border sees 70% of traffic (28/40), NOT 100%!
```

---

### 5.3 Oversubscription Ratios

**Acceptable Oversubscription by Layer**:

| Layer | Typical Ratio | Abhavtech Actual | Notes |
|-------|---------------|------------------|-------|
| **Edge Access** | 10:1 to 20:1 | 16:1 | 144 user ports → 2×10G uplinks = 16:1 |
| **Edge-to-Intermediate** | 3:1 to 5:1 | 3:1 | 24 edges × 10G → 4×10G uplinks = 6:1 → acceptable |
| **Intermediate-to-CP** | 2:1 to 3:1 | 1.2:1 | 48 Gbps agg → 40 Gbps uplink = 1.2:1 (excellent) |
| **Border-to-WAN** | 1:1 to 2:1 | 2.8:1 | 28 Gbps load → 10G WAN = 2.8:1 (acceptable for burst) |

**Calculation Example (Edge Stack)**:
```
Edge Stack: 3 × C9300-48U
├─ User ports: 144
├─ Active users: 120
├─ Uplinks: 2 × 10G = 20 Gbps
├─ User traffic: 120 × 100 Mbps (peak) = 12 Gbps
└─ Oversubscription: 12 Gbps / 20 Gbps = 0.6:1 (under-utilized!)

More realistic:
├─ Peak hour: 20% of users at full speed
├─ Peak traffic: 120 × 20% × 500 Mbps = 12 Gbps
└─ Oversubscription: 12 / 20 = 0.6:1 (still good)

Maximum possible:
├─ All users at 1 Gbps = 120 Gbps theoretical
├─ Uplinks: 20 Gbps
└─ Oversubscription: 120 / 20 = 6:1 (acceptable for access layer)
```

---

## 6. DNAC PLACEMENT STRATEGY

### 6.1 Centralized vs Distributed Architecture

**Abhavtech Current Design: CENTRALIZED**

```
                    ┌─────────────────────┐
                    │  DNAC Primary       │
                    │  (New Jersey)       │
                    │  3-node cluster     │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        │ RTT: 30-50ms         │ RTT: 180-220ms       │ RTT: 80-100ms
        │                      │                      │
    ┌───▼────┐           ┌────▼─────┐          ┌─────▼────┐
    │ Dallas │           │  Mumbai  │          │  London  │
    │ 200    │           │  638 dev │          │  150 dev │
    │ devices│           │          │          │          │
    └────────┘           └──────────┘          └──────────┘
```

#### When Centralized Works (Abhavtech Scenario):

✅ **Operations Characteristics**:
- Mostly batch/scheduled operations (fabric provisioning, policy updates)
- Network is stable (low device churn, <10 new devices/month)
- Management team is centralized (NOC in New Jersey)
- Day-N operations via templates (infrequent config changes)

✅ **Cost Considerations**:
- Centralized: $X,XXX (2 clusters: Primary + DR)
- Distributed: $X,XXX (4 clusters: Americas, EMEA, APAC, each with DR)
- **Savings: $X,XXX**

✅ **Network Reliability**:
- Dual MPLS circuits + SD-WAN backup
- WAN uptime: 99.9% (8.7 hours downtime/year)
- DNAC downtime impact: Cannot make NEW config changes (fabric continues working)

#### When Distributed is Better:

🔴 **Heavy Real-Time Operations**:
- >50 devices/month onboarding
- Frequent policy changes (daily)
- Heavy use of path trace, client 360 (real-time tools)

🔴 **Regional Autonomy**:
- Separate NOCs per region (24/7 local teams)
- Regional compliance requirements (GDPR, data residency)
- Different operational models per region

🔴 **Massive Scale per Region**:
- >3,000 devices per region
- >100 sites per region
- Multiple large campuses per region

🔴 **WAN Unreliability**:
- Frequent WAN outages (>1% downtime)
- High jitter (>50ms variance)
- Packet loss (>1%)

---

### 6.2 Latency Impact on Operations

**High Latency Sensitivity** (200ms+ is noticeable):

| Operation | Latency Impact | Abhavtech Reality |
|-----------|----------------|-------------------|
| **Path Trace** | Real-time visualization slow | Used rarely (troubleshooting only) |
| **Assurance Dashboards** | Slow page loads | Acceptable (not time-critical) |
| **Client 360** | Delayed client info | Used infrequently |
| **Live Config Changes** | Delayed feedback | Rare (most changes scheduled) |

**Low Latency Sensitivity** (<500ms tolerable):

| Operation | Latency Impact | Abhavtech Reality |
|-----------|----------------|-------------------|
| **Fabric Provisioning** | One-time, batch | Perfect for centralized |
| **Policy Push** | Background, asynchronous | No impact |
| **Software Upgrades** | Scheduled, overnight | No impact |
| **Device Discovery** | Periodic (daily) | No impact |
| **Inventory Sync** | Background | No impact |

**Critical Path (Real-Time)**:

```
Device Configuration Push (via DNAC):
├─ Step 1: DNAC generates config (local, <1s)
├─ Step 2: DNAC → Device via NETCONF (tolerates latency)
├─ Step 3: Device applies config (local, seconds)
└─ Step 4: Device confirms (NETCONF, tolerates latency)

Total time: 30-60 seconds (200ms WAN latency is <1% of total)
```

**pxGrid Sync (DNAC ↔ ISE)**:
```
ISE assigns SGT → pxGrid → DNAC → Fabric nodes
├─ Latency: 200ms (NJ to Mumbai)
├─ Impact: SGT updates delayed by 200ms
├─ Risk: LOW (SGTs rarely change mid-session)
└─ Mitigation: Local ISE PSN in Mumbai (auth is local)
```

---

### 6.3 Migration Path: Centralized Distributed

**Trigger Points for Migration**:

```
Reassess DNAC placement when:
├─ APAC devices >1,000 (currently 638)
├─ APAC device churn >50/month (currently <10)
├─ Regional NOC established (currently centralized)
├─ Latency complaints from ops team
├─ Compliance requires data residency
└─ WAN reliability degrades (<99%)

Current Status: 1/6 triggers → STAY CENTRALIZED
```

**Migration Strategy (if needed in Year 3)**:

#### Phase 1: Deploy Regional DNAC (Mumbai)
```
Week 1-2: Hardware procurement
├─ 3× DN2-HW-APL-L (smaller than XL)
├─ Cost: $X,XXX (vs $X,XXX for XL)

Week 3-4: Install & configure cluster
├─ Network integration
├─ ISE pxGrid connection
├─ Backup configuration

Week 5-6: Migrate APAC sites
├─ Change device NETCONF target
├─ No fabric disruption (data plane independent)
├─ Validate assurance data sync

Week 7-8: Validation & tuning
├─ Test all operations
├─ Performance baselining
└─ Go/no-go decision
```

#### Phase 2: Inter-Cluster Communication
```
DNAC clusters do NOT share data automatically

Required Integration:
├─ Manual inventory sync (not automatic)
├─ Policy replication (via API or manual)
├─ Reporting aggregation (via external tools)
└─ No built-in multi-cluster management (as of 2025)

Operational Model:
├─ Each DNAC manages its sites independently
├─ Global policies managed via automation (Ansible/Python)
├─ Reporting consolidated in SIEM/Splunk
└─ Inventory of record: External CMDB (ServiceNow)
```

---

### 6.4 Recommended Architecture for Abhavtech

**Current (Year 0-2): CENTRALIZED ✓**

```
Recommendation: STAY CENTRALIZED
Rationale:
├─ Cost-effective ($X,XXX vs $X,XXX)
├─ Adequate for current scale (638 devices)
├─ Operations are batch/scheduled (not real-time)
├─ Centralized NOC model
├─ WAN is reliable (99.9% uptime)
└─ 200ms latency is tolerable for fabric operations

Configuration:
├─ Primary: New Jersey (3× DN2-HW-APL-XL)
├─ DR: London (3× DN2-HW-APL-XL, standby)
├─ Manages: All sites globally (Americas, EMEA, APAC)
└─ Failover: Manual (RTO 4 hours, RPO 24 hours)
```

**Future (Year 3+): RE-EVALUATE**

```
Triggers for Distributed:
├─ APAC >1,000 devices
├─ Regional NOCs established
├─ Compliance requirements
└─ Latency complaints

If triggered, deploy:
├─ APAC DNAC: Mumbai (3× DN2-HW-APL-L)
├─ EMEA DNAC: London (promote DR to active)
├─ Americas DNAC: New Jersey (existing)
└─ Cost: +$X,XXX CapEx

5-Year TCO Comparison:
├─ Centralized: $X,XXX (current design)
├─ Distributed: $X,XXX (+$X,XXX over 5 years)
└─ Decision: Distribute only if operational benefits justify cost
```

---

## 7. LATENCY MITIGATION STRATEGIES

### 7.1 WAN Optimization for DNAC Traffic

**Strategy 1: QoS Prioritization**

```
Mark DNAC traffic with high priority:
├─ DNAC management: DSCP CS6 (network control)
├─ NETCONF: TCP port 830
├─ HTTPS: TCP port 443
└─ Syslog: UDP port 514

WAN QoS Policy:
├─ Voice: 20% (EF)
├─ Video: 30% (AF41)
├─ Network Management (DNAC): 10% (CS6) ← Ensure bandwidth
├─ Business: 30% (AF21)
└─ Best Effort: 10%

Benefit: DNAC traffic gets priority even during congestion
```

**Strategy 2: TCP Optimization**

```
Enable TCP window scaling:
├─ Default window: 64 KB
├─ With window scaling: 1 MB+
└─ Impact: Higher throughput over high-latency links

Enable selective ACK (SACK):
├─ Recovers from packet loss faster
└─ Critical for 200ms+ RTT links

Formula:
Throughput = Window_Size / RTT
├─ 64 KB / 200ms = 320 KB/s = 2.5 Mbps (poor)
├─ 1 MB / 200ms = 5 MB/s = 40 Mbps (good)
```

---

### 7.2 Delegate Operations to Fabric Nodes

**Strategy 3: Distributed Control Plane**

```
Control plane is LOCAL to site (not dependent on DNAC):
├─ LISP Map-Server: Local CP nodes
├─ SGT assignment: Local ISE PSN
├─ Fabric forwarding: Local edge nodes
└─ Device authentication: Local ISE

DNAC is MANAGEMENT plane (not control plane):
├─ Used for: Configuration, policy, assurance
├─ NOT used for: Real-time forwarding, authentication
└─ Impact: Fabric works even if DNAC unreachable

Example:
├─ DNAC in New Jersey goes down
├─ Mumbai fabric: Continues forwarding ✓
├─ Mumbai ISE: Continues authentication ✓
├─ Mumbai impact: Cannot make NEW config changes only
```

**Strategy 4: Local ISE PSN for Authentication**

```
Authentication is LOCAL (no DNAC dependency):

[Device] → [Edge Switch] → [Local ISE PSN] → RADIUS response
   ↓ <1ms       ↓ <1ms           ↓ <10ms            ↓ <1ms
[Authenticated in <20ms, regardless of DNAC location]

vs.

If authentication required DNAC (wrong architecture):
[Device] → [Edge] → [DNAC NJ] → [ISE] → Response
   ↓ <1ms    ↓ 200ms   ↓ 200ms   ↓ 10ms  ↓ 200ms
[Would take 611ms - UNACCEPTABLE for authentication]

Abhavtech Design: ISE PSN in every region ✓
```

---

### 7.3 Asynchronous Operations & Scheduling

**Strategy 5: Schedule Heavy Operations Off-Peak**

```
DNAC operations that can be scheduled:
├─ Software upgrades: Nightly (2 AM - 6 AM)
├─ Device inventory sync: Hourly (not real-time)
├─ Assurance data collection: Every 15 minutes
├─ Policy updates: Scheduled maintenance windows
└─ Network health scoring: Background (not time-critical)

Benefits:
├─ Reduces peak-hour latency impact
├─ Can batch multiple operations
└─ Lower priority than production traffic

Configuration:
├─ DNAC Task Scheduler: Define maintenance windows
├─ WAN QoS: Lower priority for bulk operations
└─ Upgrade policies: Staggered rollout (not all sites at once)
```

**Strategy 6: Local Caching & Templates**

```
Templates cached on devices:
├─ Day-0 templates: Downloaded once, reused locally
├─ VN definitions: Cached in CP database
├─ SGT policies: Cached at border nodes
└─ Wireless profiles: Cached on WLC

Benefits:
├─ Reduces DNAC queries
├─ Faster provisioning (no round-trip)
└─ Works even if DNAC temporarily unreachable

Example:
├─ Add VLAN 50 to 100 switches
├─ Traditional: 100 × (config + verify) = 200 API calls to DNAC
├─ Optimized: 1 template update, devices apply locally = 1 call
```

---

### 7.4 Hybrid Management Model

**Strategy 7: Emergency SSH Access**

```
For urgent changes (DNAC slow or unreachable):

Emergency Access Workflow:
├─ Step 1: Ops team connects via SSH directly to device
├─ Step 2: Makes urgent config change (e.g., shut interface)
├─ Step 3: Logs change in ServiceNow ticket
├─ Step 4: Update DNAC template after resolution (sync)
└─ Step 5: DNAC validates compliance next sync cycle

Enables:
├─ <1 minute to resolve urgent issues
├─ No dependency on DNAC availability
└─ Maintains audit trail in ticketing system

Trade-off:
├─ Risk of config drift (DNAC template ≠ device config)
└─ Mitigation: Nightly compliance checks + auto-remediation
```

**Strategy 8: Pre-Scripted Common Changes**

```
Ansible playbooks for common tasks:
├─ Add VLAN: ansible-playbook add-vlan.yml --extra-vars "vlan_id=50"
├─ Shutdown interface: ansible-playbook shut-interface.yml
├─ Add ACL: ansible-playbook update-acl.yml
└─ Add user: ansible-playbook add-user.yml

Benefits:
├─ Bypasses DNAC for speed-critical changes
├─ Consistent, auditable (version controlled)
├─ Can run from regional NOC (no NJ dependency)
└─ Ansible execution: <30 seconds (vs DNAC 2-3 minutes with latency)

Post-change:
├─ Update DNAC template to match
├─ DNAC compliance check: Validates change
└─ No config drift
```

---

## 8. SGT POLICY ENFORCEMENT

### 8.1 SGT Assignment & Propagation

**SGT Assignment at Ingress (Edge Node)**:

```
[User Connects] → [Edge Switch] → [ISE RADIUS] → [SGT Assigned]

Step-by-Step:
1. User connects to edge switch port
2. Edge sends 802.1X request to ISE (via RADIUS)
3. ISE authenticates user (AD/LDAP lookup)
4. ISE returns:
   ├─ Access-Accept (authentication passed)
   ├─ VLAN assignment (e.g., VLAN 10)
   ├─ SGT tag (e.g., SGT 10 = Employee-Full)
   └─ Authorization policy (e.g., permit access to VN_CORPORATE)
5. Edge switch tags all traffic from this port with SGT 10
6. SGT inserted in CMD (Command) header inside VXLAN tunnel
```

**SGT Propagation through Fabric**:

```
[Edge Switch]
     │ Inline Tagging: SGT inserted in CMD header
     │ VXLAN: Outer IP + Inner IP + VNI + SGT
     ▼
[VXLAN Tunnel through Underlay]
     │ SGT preserved inside VXLAN
     ▼
[Border Node]
     │ VXLAN decapsulation
     │ Extracts SGT from CMD header
     │ Enforces SGACL policy
     ▼
[If permitted, forward to destination]
     │ Re-encapsulate in VXLAN (if staying in fabric)
     │ OR forward as native IP (if going to firewall)
```

---

### 8.2 SGT Policy Enforcement Points

#### Enforcement Point 1: Edge Nodes (Rare)

**Scenario**: Same-subnet access control

```
Employee PC (SGT 10) → Printer (SGT 60), both on VLAN 10

Normal: Layer 2 adjacency, no routing
├─ Edge switch could enforce SGACL locally
├─ Policy: SGT 10 → SGT 60 = PERMIT (port 9100)
└─ But typically, same-subnet traffic is permitted by default

When to use:
├─ Strict security: Deny printer-to-printer traffic
├─ Deny user-to-user traffic (force via firewall)
└─ Micro-segmentation at access layer
```

#### Enforcement Point 2: Border Nodes (Primary)

**Scenario**: Inter-VN traffic (MOST COMMON)

```
Employee (SGT 10, VN_CORPORATE) → Guest Printer (SGT 60, VN_GUEST)

Flow:
├─ Step 1: Edge tags traffic with SGT 10
├─ Step 2: VXLAN to Border (different VN = must route)
├─ Step 3: Border decapsulates VXLAN
├─ Step 4: Border checks SGACL:
│          Source: SGT 10 (Employee)
│          Destination: SGT 60 (Printers)
│          Policy: Employee → Printers = PERMIT (port 9100)
├─ Step 5: Border routes between VN_CORPORATE and VN_GUEST
├─ Step 6: Border re-encapsulates in VXLAN (destination VN)
└─ Step 7: Forward to destination edge node

Enforcement: Border is CHOKE POINT for inter-VN traffic
```

**Critical Policies at Border**:

| Source SGT | Destination SGT | Policy | Reason |
|------------|----------------|--------|--------|
| 10 (Employee) | 70 (Servers) | PERMIT | Business apps access |
| 40 (Guest) | 70 (Servers) | **DENY** | Guest isolation |
| 50 (IoT) | 70 (Servers) | **DENY** | Prevent IoT compromise |
| 20 (Voice) | 100 (Internet) | **DENY** | Phones shouldn't reach Internet |

#### Enforcement Point 3: Firewall (External Traffic)

**Scenario**: Traffic leaving fabric (to Internet)

```
Employee (SGT 10) → Internet (google.com)

Flow:
├─ Step 1: Edge tags traffic with SGT 10
├─ Step 2: VXLAN to Border
├─ Step 3: Border decapsulates VXLAN (terminates fabric)
├─ Step 4: Border forwards as NATIVE IP to firewall
├─ Step 5: Border uses SXP to tell firewall:
│          "IP 10.100.1.50 = SGT 10"
├─ Step 6: Firewall receives packet:
│          Source IP: 10.100.1.50
│          Firewall looks up: 10.100.1.50 → SGT 10 (from SXP)
├─ Step 7: Firewall checks policy:
│          SGT 10 → Internet = PERMIT (HTTP/HTTPS)
│          Apply: IPS, URL filtering
├─ Step 8: NAT translation: 10.100.1.50 → 203.0.113.50
└─ Step 9: Forward to ISP

Key: SGT passed via SXP (out-of-band), NOT inline in packets
```

---

### 8.3 SGT Policy Examples (High-Level)

#### Policy 1: Employee Access

```
Source: SGT 10 (Employee-Full)
Destinations Permitted:
├─ SGT 70 (Servers): TCP 80, 443, 445 (HTTP, SMB, RDP)
├─ SGT 60 (Printers): TCP 9100, 631 (printing)
├─ SGT 10 (Employees): ANY (peer-to-peer file sharing)
├─ SGT 100 (Internet): TCP 80, 443 (web access via firewall)

Destinations Denied:
├─ SGT 40 (Guest): Isolation from guest network
├─ SGT 20 (Voice): Prevent tampering with voice infrastructure
├─ SGT 99 (Network Devices): Prevent unauthorized access to switches

Enforcement:
├─ Same VN: Typically permitted (rare to block within same VN)
├─ Inter-VN: Enforced at Border
├─ External: Enforced at Firewall
```

#### Policy 2: Guest Isolation

```
Source: SGT 40 (Guest)
Destinations Permitted:
├─ SGT 60 (Printers): TCP 9100 (limited printing)
├─ SGT 100 (Internet): TCP 80, 443 (web access)
├─ SGT 40 (Guest): ANY (guest-to-guest)

Destinations Denied:
├─ SGT 10 (Employee): Isolation from corporate users
├─ SGT 70 (Servers): No access to internal servers
├─ SGT 20 (Voice): No access to voice network
├─ SGT 50 (IoT): No access to IoT devices

Enforcement:
├─ Guest on separate VN (VN_GUEST)
├─ All inter-VN traffic blocked by default at Border
├─ Only explicit permits (printer, Internet) allowed
├─ Internet traffic via firewall with strict URL filtering
```

#### Policy 3: IoT Security

```
Source: SGT 50 (IoT-Sensor)
Destinations Permitted:
├─ SGT 50 (IoT): Device-to-gateway communication
├─ SGT 100 (Internet): HTTPS 443 ONLY (cloud telemetry, restricted to approved IPs)

Destinations Denied:
├─ SGT 10 (Employee): IoT cannot initiate to users
├─ SGT 70 (Servers): Prevent lateral movement
├─ SGT 60 (Printers): No reason for IoT to print
├─ SGT 40 (Guest): Isolation

Enforcement:
├─ IoT on separate VN (VN_IOT)
├─ Border blocks all IoT → Corporate traffic
├─ Firewall allows HTTPS to specific cloud IPs only
├─ Logging: All IoT traffic logged for security monitoring

Benefit: If IoT device is compromised, cannot reach corporate servers
```

---

### 8.4 SGT Policy Design Best Practices

**1. Default-Deny Model**:
```
Start with implicit deny all, then add explicit permits

Policy Structure:
├─ Rule 1-10: Critical permits (admin access)
├─ Rule 11-50: Business application access
├─ Rule 51-100: User-to-resource access
├─ Rule 101-999: Deny rules (logged for visibility)
└─ Rule 1000: Implicit deny all (catch-all)
```

**2. Least Privilege**:
```
Grant minimum required access:
├─ Employees: Only apps needed for job function
├─ Contractors: Time-limited access to specific apps
├─ IoT: Only cloud telemetry, no internal access
└─ Guest: Internet only
```

**3. Logging & Monitoring**:
```
Log all denied traffic:
├─ Destination: Syslog server → SIEM
├─ Alert on: Repeated denials from same source
├─ Use case: Detect compromised devices
└─ Retention: 90 days local, 1 year archive
```

**4. Regular Policy Review**:
```
Quarterly review:
├─ Audit: Are all SGT policies still needed?
├─ Optimize: Remove unused policies
├─ Validate: Test critical policies (simulated attacks)
└─ Update: Adjust based on new applications/threats
```

---

## 9. DESIGN RECOMMENDATIONS

### 9.1 Site Architecture Selection

**Decision Matrix**:

```
Site Size Assessment:

IF users > 3,000 AND buildings > 5:
    → FULL ARCHITECTURE (Border + CP + Intermediate + Edge)
    → Example: Mumbai (4,800 users, 6 buildings)
    → Cost: High ($X,XXX)
    → Scalability: 5+ years

ELSE IF users 500-3,000 OR buildings 2-4:
    → STANDARD ARCHITECTURE (Border + CP + Edge)
    → Check: (Edge_Stacks × 2) > (CP_Ports - 6)?
        IF YES: Add Intermediate nodes
        IF NO: Direct to CP
    → Example: Chennai (2,400 users, 3 buildings, needs Intermediate!)
    → Cost: Medium ($X,XXX)
    → Scalability: 3-5 years

ELSE IF users < 500 AND buildings = 1:
    → COLLAPSED ARCHITECTURE (FIAB)
    → Example: Noida (300 users, 1 building)
    → Cost: Low ($X,XXX)
    → Scalability: 2-3 years
```

---

### 9.2 Hardware Sizing Recommendations

**Border Nodes**:
```
Selection Criteria:
├─ Calculate border load (exclude edge-to-edge same-VN!)
├─ Multiply by 1.6 for 3-year growth
├─ Select platform with 4× capacity
└─ Prefer C9500-24Y4C for most hubs (440 Gbps, $X,XXX)

Validation:
├─ Current utilization: 5-15% (good)
├─ 3-year utilization: 15-25% (acceptable)
└─ If >30%: Consider upgrade or add 3rd border
```

**Control Plane Nodes**:
```
Selection Criteria:
├─ PRIMARY: Port count, NOT throughput
├─ Calculate: (Edges × 2) + (Borders × 2) + (Peer CP × 2)
├─ If > 20 ports: Add intermediate nodes
└─ ALWAYS deploy 2 × CP nodes (HA critical)

Platform:
├─ Most sites: C9500-24Y4C (24 ports, $X,XXX)
├─ Very large: C9500-48Y4C (48 ports, $X,XXX)
└─ Never: Single CP node (LISP is single point of failure)
```

**Edge Nodes**:
```
Selection Criteria:
├─ Port count: Wired + PoE devices × 1.2 (growth)
├─ PoE budget: Sum device wattage × 1.2 (buffer)
├─ Stack size: 3-5 switches (balance cost vs redundancy)
└─ Model: C9300-48U for standard, C9300-48UXM for WiFi 6E

Validation:
├─ Port utilization: 60-80% (good)
├─ PoE utilization: 50-70% (sufficient headroom)
└─ If >85%: Add switches to stack or deploy new stack
```

**WLC (Wireless)**:
```
Selection Criteria:
├─ AP count: Area (sq ft) / 1,500 (office) or 2,500 (open)
├─ Client load: Users × 70% (wireless ratio)
├─ Select WLC with capacity >2× AP count
└─ Prefer centralized WLC for hubs, embedded for branches

Platform:
├─ Hubs (>50 APs): C9800-40 (2,000 APs, $X,XXX)
├─ Branches (<50 APs): Embedded WLC (100 APs, $X,XXX)
└─ Very large (>500 APs): C9800-80 (6,000 APs, $X,XXX)
```

---

### 9.3 DNAC Placement Recommendation

**For Abhavtech (Current Scale)**:

✅ **STAY CENTRALIZED**
```
Justification:
├─ Cost: Save $X,XXX vs distributed
├─ Scale: 638 devices << 3,000 per region (threshold)
├─ Operations: Batch/scheduled (not real-time)
├─ WAN: Reliable (99.9% uptime)
└─ Latency: 200ms tolerable for fabric operations

Configuration:
├─ Primary: New Jersey (3× DN2-HW-APL-XL)
├─ DR: London (3× DN2-HW-APL-XL, standby)
└─ Manages: All 638 devices globally
```

**Triggers to Re-evaluate (Year 3+)**:
```
Migrate to distributed when:
├─ APAC devices >1,000 (currently 638)
├─ Device churn >50/month (currently <10)
├─ Regional NOCs established (currently centralized)
├─ Latency complaints (currently none)
├─ WAN reliability <99% (currently 99.9%)
└─ Compliance requires data residency (currently not required)

Current Status: 1/6 triggers → REMAIN CENTRALIZED
```

---

### 9.4 Traffic Engineering Guidelines

**Bandwidth Calculation**:
```
For Border Sizing:
├─ Include: Inter-VN + To DC + To WAN/Internet
├─ Exclude: Edge-to-edge same VN (bypasses border!)
├─ Multiply by 1.6 for 3-year growth
└─ Select platform with 4× capacity

For Edge Uplink Sizing:
├─ Include: ALL traffic (even edge-to-edge)
├─ Oversubscription: 10:1 to 20:1 acceptable
├─ Typical: 2×10G uplinks per stack (good for <200 users)
└─ High density: 4×10G uplinks per stack
```

**Latency Optimization**:
```
Priorities:
1. Local ISE PSN for authentication (<20ms)
2. QoS prioritization for DNAC traffic (CS6)
3. Schedule bulk operations off-peak
4. Cache templates locally on devices
5. Enable emergency SSH for urgent changes
```

**SGT Policy Design**:
```
Best Practices:
1. Default-deny model (implicit deny all)
2. Enforce at borders (inter-VN choke point)
3. Use firewall for external traffic (via SXP)
4. Log all denied traffic (SIEM integration)
5. Quarterly policy review & optimization
```

---

### 9.5 Implementation Phasing

**Recommended Rollout**:

```
Phase 1: Design & Procurement (Weeks 1-12)
├─ Week 1-4: Detailed design (architecture validated)
├─ Week 5-8: Hardware procurement (4-8 week lead time)
└─ Week 9-12: Lab testing (pilot with 5 devices)

Phase 2: Infrastructure Deployment (Weeks 13-18)
├─ Week 13-15: DNAC cluster deployment
├─ Week 16-18: ISE deployment & integration
└─ Milestone: DNAC + ISE operational

Phase 3: Site Rollout (Weeks 19-36)
├─ Week 19-24: Mumbai (largest site first, learn lessons)
├─ Week 25-30: Chennai (apply lessons from Mumbai)
├─ Week 31-32: Noida (branch, simple)
└─ Week 33-36: Remaining branches (parallel deployment)

Phase 4: Stabilization (Weeks 37-40)
├─ Week 37-38: User acceptance testing
├─ Week 39-40: Tuning & optimization
└─ Milestone: Production ready

Total Duration: 40 weeks (~10 months)
```

---

## APPENDIX A: Quick Reference Tables

### Hardware Selection Guide

| Component | Small Site (<500) | Medium Site (500-3K) | Large Site (>3K) |
|-----------|-------------------|----------------------|------------------|
| **Border** | C9500-16X or Collapsed | C9500-24Y4C | C9500-24Y4C or 48Y4C |
| **Control Plane** | Collapsed | C9500-24Y4C (2×) | C9500-24Y4C (2×) + Intermediate |
| **Intermediate** | Not needed | Check port count | Required (2+) |
| **Edge** | C9300-48U (2-3 per stack) | C9300-48U (3-4 per stack) | C9300-48U (4-5 per stack) |
| **WLC** | Embedded | C9800-40 | C9800-40 or 80 |
| **Total Cost** | $X,XXX | $X,XXX | $X,XXX |

---

### Traffic Flow Decision Matrix

| Source VN | Dest VN | Path | Border? | Latency | Bandwidth Impact |
|-----------|---------|------|---------|---------|------------------|
| Corporate | Corporate | Direct VXLAN | NO | <1 ms | Edge only |
| Corporate | Guest | Via Border | YES | 2-3 ms | Border + edges |
| Corporate | Internet | Via Border + FW | YES | 20-50 ms | Border + FW + WAN |
| Guest | Corporate | Via Border (blocked) | YES | N/A | Denied at Border |
| IoT | Server | Via Border (blocked) | YES | N/A | Denied at Border |

---

### Capacity Planning Thresholds

| Component | Target Utilization | Warning Threshold | Action Required |
|-----------|-------------------|-------------------|-----------------|
| Border Throughput | 10-25% | >40% | Plan upgrade/add node |
| CP Port Count | 50-75% | >80% | Add intermediate nodes |
| Edge Port Utilization | 60-80% | >85% | Add switches/stacks |
| WLC AP Count | 20-40% | >60% | Add WLC or upgrade |
| PoE per Stack | 50-70% | >80% | Add switches/stacks |

---

## APPENDIX B: Validation Checklist

### Pre-Deployment Validation

- [ ] Border load calculated (excluding edge-to-edge same-VN)
- [ ] 3-year growth projection completed
- [ ] Platform selection validated (4× current load)
- [ ] Port count validated for CP nodes
- [ ] Intermediate nodes required? (checked via formula)
- [ ] Edge port count and PoE budget validated per floor
- [ ] WLC capacity validated (AP count + client load)
- [ ] DNAC placement decision documented (centralized vs distributed)
- [ ] Latency mitigation strategies defined
- [ ] SGT policies designed (default-deny model)

### Post-Deployment Validation

- [ ] Border throughput <30% (good headroom)
- [ ] CP port utilization <80% (room for growth)
- [ ] Edge port utilization 60-80% (balanced)
- [ ] WLC AP count <40% of capacity
- [ ] DNAC operations tested (provisioning, assurance, policy)
- [ ] Traffic flows validated (edge-to-edge, inter-VN, to Internet)
- [ ] SGT policies tested (deny rules blocking as expected)
- [ ] Latency acceptable (<5ms intra-site, <200ms to DNAC)
- [ ] Failover tested (CP node, Border node, WLC)
- [ ] Documentation updated (as-built diagrams, runbooks)

---

## REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-31 | Network Architecture Team | Initial release |

---

**END OF APPENDIX**
