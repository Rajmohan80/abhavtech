# APPENDIX QUICK REFERENCE GUIDE

## Document Overview

This guide provides quick access to critical design decisions, formulas, and selection criteria from the comprehensive Hardware Selection, Capacity Planning & Traffic Flow Design appendix.

---

## CRITICAL FORMULAS

### Border Node Sizing
```
Border_Load = Inter_VN_Traffic + 
              Edge_to_DC_Traffic + 
              Edge_to_WAN_Traffic

(EXCLUDE edge-to-edge same-VN traffic!)

Required_Throughput = Border_Load × 1.6 (3-year growth)
Platform_Capacity = Required_Throughput × 4 (safety margin)
```

**Example (Mumbai)**:
- Inter-VN: 3 Gbps
- To DC: 15 Gbps  
- To WAN: 10 Gbps
- **Border Load: 28 Gbps** (NOT 40 Gbps total site traffic!)
- 3-year: 28 × 1.6 = 45 Gbps
- Required platform: 45 × 4 = 180 Gbps minimum
- **Selected: C9500-24Y4C (440 Gbps)** ✓

---

### Control Plane Node Requirement
```
Required_Ports = (Edge_Stacks × 2) + 
                 (Border_Nodes × 2) + 
                 (Peer_CP × 2) + 
                 (Reserved × 2)

IF Required_Ports > (CP_Total_Ports - 6):
    ADD Intermediate Nodes
ELSE:
    Direct connection to CP
```

**Example (Mumbai)**:
- Edge stacks: 48 × 2 = 96 ports needed
- CP platform: C9500-24Y4C has 24 ports
- Available: 24 - 6 (uplinks) = 18 ports
- 96 > 18 → **INTERMEDIATE NODES REQUIRED** ✓

**Example (Chennai)**:
- Edge stacks: 18 × 2 = 36 ports needed
- Available: 18 ports
- 36 > 18 → **INTERMEDIATE NODES REQUIRED** ✓ (common mistake!)

---

### Intermediate Node Count
```
IF (Edge_Stacks × 2) > (CP_Available_Ports):
    Intermediate_Count = CEILING((Edge_Stacks × 2) / 20)
ELSE:
    Intermediate_Count = 0

Note: Each intermediate can handle ~24 edge stacks
```

---

### Edge Node Port Calculation
```
Required_Ports = (Wired_Devices + PoE_Devices) × 1.2

Switches_per_Stack = CEILING(Required_Ports / 48)

PoE_Required = Σ(Device_Count × Wattage) × 1.2
```

**Example (Mumbai Floor)**:
- Wired PCs: 80
- IP Phones: 80  
- APs: 5
- Cameras: 12
- IoT: 20
- **Total: 197 × 1.2 = 236 ports**
- Switches needed: 236 / 48 = 4.9 → **5 switches**
- For cost optimization: Use **3 switches** (144 ports, 83% utilization)

---

### WLC AP Count
```
Required_APs = Total_Square_Feet / Coverage_per_AP

Coverage Guidelines:
- Open office: 2,500 sq ft per AP
- Standard office: 1,500 sq ft per AP  
- High density: 500 sq ft per AP

WLC_Platform_Capacity ≥ Required_APs × 2.5 (headroom)
```

---

## ARCHITECTURE SELECTION MATRIX

| Criteria | Full Architecture | Standard Architecture | Collapsed (FIAB) |
|----------|-------------------|----------------------|------------------|
| **User Count** | >3,000 | 500-3,000 | <500 |
| **Buildings** | 5+ | 2-4 | 1 |
| **Edge Stacks** | >40 | 10-40 | <10 |
| **Intermediate?** | YES | Check formula | NO |
| **Example** | Mumbai (4,800 users) | Chennai (2,400 users) | Noida (300 users) |
| **Cost** | $X,XXX | $X,XXX | $X,XXX |

---

## HARDWARE SELECTION QUICK GUIDE

### Border Nodes

| Traffic Load | Platform | Throughput | Cost | Use Case |
|--------------|----------|------------|------|----------|
| <10 Gbps | C9500-16X | 800 Gbps | $X,XXX | Small sites |
| **10-50 Gbps** | **C9500-24Y4C** | **440 Gbps** | **$X,XXX** | **Most hubs** ✓ |
| 50-100 Gbps | C9500-48Y4C | 880 Gbps | $X,XXX | Large hubs |
| >100 Gbps | C9600 Series | 1.2+ Tbps | $X,XXX | Data centers |

**Selection Rule**: Choose platform with 4× your current border load

---

### Control Plane Nodes

**PRIMARY FACTOR: Port Count (NOT throughput)**

| Scenario | Platform | Ports | Notes |
|----------|----------|-------|-------|
| Direct CP (<20 edges) | C9500-24Y4C | 24 | Most common |
| With Intermediate (>20 edges) | C9500-24Y4C | 24 | **Recommended** ✓ |
| Very large (>50 edges direct) | C9500-48Y4C | 48 | Rare |

**ALWAYS deploy 2 × CP nodes** (HA critical)

---

### Edge Nodes

| Model | Ports | PoE | PoE Type | Uplinks | Use Case | Cost |
|-------|-------|-----|----------|---------|----------|------|
| C9300-24P | 24×1G | 370W | PoE+ | 4×1G + 2×10G | Small IDF | $X,XXX |
| **C9300-48U** | **48×1G** | **1440W** | **UPOE** | **4×1G + 4×10G** | **Standard** ✓ | **$X,XXX** |
| C9300-48UXM | 48×mGig | 1440W | PoE++ | 8×10G + 2×40G | WiFi 6E dense | $X,XXX |

**Stack Size**: 3-5 switches per stack (balances cost vs redundancy)

---

### Wireless Controllers

| Model | Max APs | Max Clients | Throughput | Use Case | Cost |
|-------|---------|-------------|------------|----------|------|
| C9800-L | 200 | 2,000 | 10 Gbps | Small sites | $X,XXX |
| **C9800-40** | **2,000** | **64,000** | **40 Gbps** | **Medium hubs** ✓ | **$X,XXX** |
| C9800-80 | 6,000 | 64,000 | 80 Gbps | Large hubs | $X,XXX |
| Embedded WLC | 100 | 2,000 | N/A | **Branches** ✓ | **$X,XXX** |

---

## TRAFFIC FLOW PATTERNS

### Pattern 1: Edge-to-Edge (Same VN) - 25% of Traffic

**Path**: Direct VXLAN tunnel between edge nodes

```
Employee PC → Edge-3 → Intermediate → CP (transit) → Edge-20 → Server
```

- **Border**: NOT traversed ✓
- **Latency**: <1 ms
- **Bandwidth**: Loads edge uplinks only
- **Example**: PC to file server (both in VN_CORPORATE)

---

### Pattern 2: Inter-VN (Same Site) - 7% of Traffic

**Path**: Via Border for VRF routing

```
Guest Laptop → Edge-8 → Border (Inter-VN routing) → Edge-18 → Printer
```

- **Border**: REQUIRED ✓
- **SGT Enforcement**: At Border
- **Latency**: 2-3 ms
- **Example**: Guest to corporate printer

---

### Pattern 3: Edge-to-DC - 38% of Traffic

**Path**: Via Border to Data Center

```
User PC → Edge → Border → DC Core → DC Switches → DB Server
```

- **Border**: REQUIRED ✓
- **Latency**: 1-2 ms
- **Example**: User accessing database

---

### Pattern 4: Edge-to-Internet - 25% of Traffic

**Path**: Via Border and Firewall

```
User PC → Edge → Border → Firewall → ISP → Internet
```

- **Border**: REQUIRED ✓
- **Firewall**: REQUIRED ✓
- **NAT**: At Firewall
- **SGT**: Via SXP to Firewall
- **Latency**: 20-50 ms

---

### Pattern 5: Control Plane - 5% of Traffic

**Path**: To local CP nodes

```
All Nodes → CP-1, CP-2 (LISP, BFD, ISIS)
```

- **Border**: NOT traversed
- **Bandwidth**: <1 Gbps (negligible)
- **Example**: LISP map-requests

---

## COMMON DESIGN MISTAKES

### Mistake 1: Including Edge-to-Edge in Border Load

**Wrong**:
```
Total site traffic: 40 Gbps
Border platform needed: 40 × 4 = 160 Gbps
Selected: C9500-24Y4C (440 Gbps) - seems over-provisioned
```

**Correct**:
```
Border load: 28 Gbps (excludes 10 Gbps edge-to-edge same-VN)
Required: 28 × 1.6 × 4 = 180 Gbps
Selected: C9500-24Y4C (440 Gbps) - properly sized ✓
```

---

### Mistake 2: Forgetting Intermediate Nodes for Chennai

**Wrong**:
```
Chennai has 18 edge stacks
18 < 40 (smaller than Mumbai)
No intermediate needed
```

**Correct**:
```
18 edge stacks × 2 uplinks = 36 connections
CP available ports: 24 - 6 = 18 ports
36 > 18 → INTERMEDIATE NODES REQUIRED ✓
```

**Formula**: It's about **port count**, not edge node count!

---

### Mistake 3: Single Control Plane Node

**Wrong**:
```
Control plane traffic is minimal (<1 Gbps)
Deploy 1 CP node to save cost ($X,XXX)
```

**Correct**:
```
ALWAYS deploy 2 × CP nodes (HA critical)
LISP is single point of failure
If CP-1 fails without CP-2, entire fabric down
Cost: $X,XXX (mandatory, not optional)
```

---

### Mistake 4: WLC Under-Sized for Mumbai

**Wrong** (Original design):
```
Mumbai: 120 APs
C9800-40: 2,000 AP capacity
Utilization: 6% - good!
```

**Correct** (After proper calculation):
```
Mumbai: 600,000 sq ft / 1,500 = 400 APs needed
C9800-40: 2,000 AP capacity
Utilization: 20% - proper sizing ✓
Original design had 280 APs missing!
```

---

## DNAC PLACEMENT DECISION

### Centralized (Recommended for Abhavtech)

**When to Use**:
- ✅ <3,000 devices per region (Abhavtech: 638)
- ✅ Batch/scheduled operations (not real-time)
- ✅ Centralized NOC model
- ✅ Reliable WAN (99.9%+ uptime)
- ✅ Cost-sensitive ($X,XXX vs $X,XXX distributed)

**Configuration**:
```
Primary: New Jersey (3× DN2-HW-APL-XL)
DR: London (3× DN2-HW-APL-XL, standby)
Manages: All sites globally
Latency: 200ms to APAC (tolerable)
```

---

### Distributed

**When to Use**:
- 🔴 >3,000 devices per region
- 🔴 Heavy real-time operations (>50 devices/month churn)
- 🔴 Regional NOCs (separate teams)
- 🔴 Compliance requirements (data residency)
- 🔴 WAN unreliability (<99% uptime)

**Trigger Point for Abhavtech**:
```
Re-evaluate when APAC devices >1,000
Currently: 638 devices → STAY CENTRALIZED ✓
```

---

## SGT POLICY ENFORCEMENT POINTS

### Where SGT is Enforced

| Point | Traffic Type | Use Case | Frequency |
|-------|--------------|----------|-----------|
| **Edge Nodes** | Same-subnet | Rare (usually permitted) | <5% of policies |
| **Border Nodes** | Inter-VN | **Primary enforcement** ✓ | 80% of policies |
| **Firewall** | To Internet | External traffic | 15% of policies |

### Critical SGT Policies

| Source | Destination | Action | Reason |
|--------|-------------|--------|--------|
| 10 (Employee) | 70 (Servers) | **PERMIT** | Business apps |
| 40 (Guest) | 70 (Servers) | **DENY** | Guest isolation |
| 50 (IoT) | 70 (Servers) | **DENY** | Prevent lateral movement |
| 20 (Voice) | 100 (Internet) | **DENY** | Phones shouldn't reach Internet |

**Default Policy**: DENY ALL (explicit permits only)

---

## CAPACITY PLANNING TARGETS

### Target Utilization by Component

| Component | Ideal Range | Warning | Action |
|-----------|-------------|---------|--------|
| **Border Throughput** | 10-25% | >40% | Plan upgrade |
| **CP Port Count** | 50-75% | >80% | Add intermediate |
| **Edge Port Utilization** | 60-80% | >85% | Add switches |
| **WLC AP Count** | 20-40% | >60% | Add WLC |
| **PoE per Stack** | 50-70% | >80% | Add PoE switches |

---

## IMPLEMENTATION CHECKLIST

### Pre-Deployment
- [ ] Border load calculated (exclude edge-to-edge same-VN)
- [ ] 3-year growth projection (multiply by 1.6)
- [ ] Platform selection validated (4× current load)
- [ ] CP port count checked (intermediate nodes needed?)
- [ ] Edge ports and PoE validated per floor
- [ ] WLC capacity validated (sq ft / 1,500)
- [ ] DNAC placement decision documented
- [ ] SGT policies designed (default-deny)

### Post-Deployment
- [ ] Border utilization <30%
- [ ] CP port utilization <80%
- [ ] Edge port utilization 60-80%
- [ ] WLC AP count <40% of capacity
- [ ] Traffic flows tested (all 5 patterns)
- [ ] SGT denies working as expected
- [ ] Latency acceptable (<5ms intra-site)
- [ ] Failover tested (CP, Border, WLC)

---

## QUICK DECISION TREES

### "Do I Need Intermediate Nodes?"

```
START
  │
  ├─> Calculate: Edge_Stacks × 2
  │
  ├─> Is result > (24 - 6)?
  │     │
  │     ├─ YES → DEPLOY INTERMEDIATE NODES ✓
  │     │
  │     └─ NO → Direct connection to CP ✓
  │
END
```

### "Which Border Platform?"

```
START
  │
  ├─> Calculate Border_Load (exclude edge-to-edge!)
  │
  ├─> Multiply by 1.6 (3-year)
  │
  ├─> Multiply by 4 (safety)
  │
  ├─> Is result <200 Gbps?
  │     │
  │     ├─ YES → C9500-24Y4C ($X,XXX) ✓
  │     │
  │     └─ NO → C9500-48Y4C ($X,XXX)
  │
END
```

### "Centralized or Distributed DNAC?"

```
START
  │
  ├─> Are operations mostly batch/scheduled?
  │     │
  │     ├─ NO → Consider Distributed
  │     │
  │     └─ YES → Continue
  │
  ├─> Is WAN reliable (99.9%+)?
  │     │
  │     ├─ NO → Consider Distributed
  │     │
  │     └─ YES → Continue
  │
  ├─> Are devices <1,000 per region?
  │     │
  │     ├─ NO → Consider Distributed
  │     │
  │     └─ YES → CENTRALIZED ✓
  │
END
```

---

## KEY NUMBERS TO REMEMBER

### Mumbai (Full Architecture)
- Users: 4,800
- Edge Stacks: 48 (requires intermediate)
- Total Traffic: 40 Gbps
- Border Load: **28 Gbps** (70% of total)
- APs: 400 (not 120!)
- Cost: $X,XXX

### Chennai (Standard with Intermediate)
- Users: 2,400
- Edge Stacks: 18 (requires intermediate!)
- Total Traffic: 20 Gbps
- Border Load: **14 Gbps** (70% of total)
- APs: 200
- Cost: $X,XXX

### Noida (Collapsed FIAB)
- Users: 300
- Edge Stacks: 2 (FIAB)
- Total Traffic: 3 Gbps
- Border Load: **2 Gbps** (67% of total)
- APs: 20
- Cost: $X,XXX

---

## RELATED DOCUMENTS

1. **APPENDIX-HARDWARE-CAPACITY-TRAFFIC-DESIGN.md** (Main Document)
   - Complete methodology and detailed explanations
   - All formulas with examples
   - Traffic flow diagrams
   - 9 comprehensive sections

2. **01-Site_Infrastructure_Inventory.csv**
   - Complete hardware list with costs
   - All three sites
   - Open in Excel

3. **03-Traffic_Flow_Matrix.csv**
   - 15 traffic flow scenarios
   - Bandwidth, latency, path details
   - Open in Excel

4. **04-SGT_Policy_Matrix.csv**
   - Complete SGT-to-SGT rules
   - Source, destination, action
   - Open in Excel

5. **05-FIREWALL_DESIGN_COMPLETE.txt**
   - Firewall placement
   - SGT integration via SXP
   - Security zones

---

## FAQ

### Q: Why is Mumbai border load 28 Gbps not 40 Gbps?

**A**: Edge-to-edge traffic within the same VN (10 Gbps) bypasses the Border entirely. Only inter-VN (3 Gbps), to-DC (15 Gbps), and to-WAN (10 Gbps) traffic loads the Border.

---

### Q: Why does Chennai need intermediate nodes?

**A**: 18 edge stacks × 2 uplinks = 36 connections. CP has 24 ports - 6 (uplinks) = 18 available. 36 > 18 → Intermediate nodes required. Common mistake: assuming "standard" means no intermediate!

---

### Q: Can I collapse Border + CP to save cost?

**A**: Technically yes, but not recommended for sites >30 edges or >10 Gbps WAN traffic. Savings ($X,XXX) not worth operational risk. Only acceptable for small branches.

---

### Q: Why always 2 × CP nodes?

**A**: LISP is a single point of failure. If the single CP fails, the entire fabric cannot resolve endpoint locations = total outage. Always deploy 2 × CP for HA.

---

### Q: How is SGT passed to firewall if VXLAN terminates at Border?

**A**: Via SXP (TrustSec eXchange Protocol). Border sends IP-to-SGT bindings to firewall out-of-band (TCP 64999). Firewall receives native IP packets + knows SGT via SXP lookup.

---

### Q: What triggers migration from centralized to distributed DNAC?

**A**: 
1. APAC devices >1,000 (currently 638)
2. Device churn >50/month (currently <10)
3. Regional NOCs established
4. Latency complaints
5. WAN reliability <99%

Currently: 1/5 triggers → Stay centralized

---

## NEED HELP?

### Common Issues

**Issue**: Underlay not converging
- **Check**: IS-IS enabled on all fabric links
- **Check**: Loopback interfaces configured correctly
- **Verify**: `show isis neighbors` on all nodes

**Issue**: LISP not resolving EIDs
- **Check**: CP nodes have correct LISP configuration
- **Check**: Edge nodes registered to both CP-1 and CP-2
- **Verify**: `show lisp session` on edge nodes

**Issue**: SGT not propagating
- **Check**: Inline tagging enabled on edge nodes
- **Check**: SGACL enforcement enabled on Border
- **Verify**: `show cts role-based permissions` on Border

**Issue**: DNAC cannot discover devices
- **Check**: NETCONF enabled on devices (port 830)
- **Check**: WAN connectivity to DNAC
- **Verify**: Firewall allows TCP 830

---

**Last Updated**: 2026-01-31  
**Version**: 1.0  
**Maintained by**: Network Architecture Team
