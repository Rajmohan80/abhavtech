# CHAPTER 3: CURRENT INFRASTRUCTURE ASSESSMENT

## 3.1 Existing Wireless Infrastructure

### 3.1.1 Current AP Deployment (Pre-WiFi 7)

**Total Wireless Access Points: 1,185 APs across 19 sites**

| WiFi Generation | AP Models | Quantity | Deployment Year | Status |
|----------------|-----------|----------|-----------------|--------|
| **WiFi 6E** (802.11ax, 6 GHz) | Catalyst 9136I, 9130AXI | 145 APs | 2023-2024 | ✅ Keep (non-pilot sites) |
| **WiFi 6** (802.11ax) | Catalyst 9120AXI, 9115AXI | 590 APs | 2021-2023 | ✅ Keep (non-pilot sites) |
| **WiFi 5** (802.11ac Wave 2) | Aironet 3802I, 2802I | 450 APs | 2018-2020 | ⚠️ Replace in Phase 5B |

**Regional Distribution:**

| Region | Sites | Total APs | WiFi 6E | WiFi 6 | WiFi 5 (Legacy) | Coverage Quality |
|--------|-------|-----------|---------|--------|-----------------|------------------|
| **APAC** | 8 sites | 485 APs | 60 | 245 | 180 | Good (12% WiFi 6E) |
| **EMEA** | 6 sites | 410 APs | 45 | 195 | 170 | Moderate (11% WiFi 6E) |
| **Americas** | 5 sites | 290 APs | 40 | 150 | 100 | Good (14% WiFi 6E) |
| **TOTAL** | **19 sites** | **1,185 APs** | **145** | **590** | **450** | - |

---

### 3.1.2 Site-by-Site AP Inventory

**APAC Region:**

| Site | Building Size | Users | Current APs | WiFi 6E | WiFi 6 | WiFi 5 | Pilot Site? |
|------|--------------|-------|-------------|---------|--------|--------|-------------|
| **Mumbai HQ** | 100,000 sq ft, 5 floors | 2,200 | 180 APs | 25 | 95 | 60 | ✅ **YES** (50 WiFi 7 APs) |
| **Chennai HQ** | 80,000 sq ft, 4 floors | 1,800 | 130 APs | 20 | 70 | 40 | ✅ **YES** (30 WiFi 7 APs) |
| **Bangalore Branch** | 15,000 sq ft, 2 floors | 200 | 20 APs | 0 | 8 | 12 | ✅ **YES** (10 WiFi 7 APs) |
| Delhi Branch | 12,000 sq ft | 180 | 18 APs | 0 | 10 | 8 | No (Phase 5B-Wave 3) |
| Singapore Hub | 25,000 sq ft | 400 | 35 APs | 5 | 20 | 10 | No |
| Tokyo Branch | 10,000 sq ft | 150 | 15 APs | 0 | 8 | 7 | No |
| Sydney Branch | 18,000 sq ft | 280 | 25 APs | 5 | 12 | 8 | No |
| Hong Kong Branch | 22,000 sq ft | 350 | 32 APs | 5 | 22 | 5 | No |

**EMEA Region:**

| Site | Building Size | Users | Current APs | WiFi 6E | WiFi 6 | WiFi 5 | Pilot Site? |
|------|--------------|-------|-------------|---------|--------|--------|-------------|
| **London HQ** | 100,000 sq ft, 5 floors | 2,200 | 155 APs | 25 | 80 | 50 | ✅ **YES** (25 WiFi 7 APs) |
| Frankfurt HQ | 60,000 sq ft, 3 floors | 1,200 | 90 APs | 10 | 50 | 30 | No (Phase 5B-Wave 1) |
| Paris Branch | 20,000 sq ft | 300 | 28 APs | 5 | 15 | 8 | No |
| Amsterdam Branch | 18,000 sq ft | 280 | 25 APs | 0 | 12 | 13 | No |
| Madrid Branch | 15,000 sq ft | 220 | 22 APs | 5 | 10 | 7 | No |
| Milan Branch | 25,000 sq ft | 400 | 35 APs | 0 | 18 | 17 | No |

**Americas Region:**

| Site | Building Size | Users | Current APs | WiFi 6E | WiFi 6 | WiFi 5 | Pilot Site? |
|------|--------------|-------|-------------|---------|--------|--------|-------------|
| New Jersey HQ | 90,000 sq ft, 4 floors | 1,800 | 130 APs | 20 | 70 | 40 | No (Phase 5B-Wave 1) |
| Dallas HQ | 70,000 sq ft, 3 floors | 1,400 | 95 APs | 15 | 50 | 30 | No (Phase 5B-Wave 1) |
| Chicago Branch | 22,000 sq ft | 350 | 30 APs | 5 | 15 | 10 | No |
| Toronto Branch | 18,000 sq ft | 280 | 20 APs | 0 | 10 | 10 | No |
| Mexico City Branch | 15,000 sq ft | 220 | 15 APs | 0 | 5 | 10 | No |

**Summary:**
- **Total Sites**: 19 locations
- **Total APs**: 1,185 APs (pre-WiFi 7)
- **Phase 5A Pilot**: 4 sites, 115 new WiFi 7 APs (keep existing APs operational during pilot)
- **Phase 5B Production**: Replace 450 legacy WiFi 5 APs + add 555 new APs = 1,220 total WiFi 7 APs

---

### 3.1.3 Current AP Coverage Analysis

**Coverage Quality Assessment (Pre-WiFi 7):**

| Metric | Target | Current (WiFi 6/6E) | Gap | Action Required |
|--------|--------|---------------------|-----|-----------------|
| **Average RSSI** | -65 dBm or better | -68 dBm | 3 dB weak | Add 180 APs in Phase 5B (denser deployment) |
| **Dead Zones** | 0% of floor area | 5-8% (corners, stairwells) | 5-8% | WiFi 7 higher density eliminates dead zones |
| **5 GHz Coverage** | 95% of floor area at -70 dBm | 88% | 7% gap | WiFi 7: 1 AP per 1,500 sq ft (vs 1 per 2,500 sq ft) |
| **6 GHz Coverage** | 95% of floor area at -70 dBm | 10% (only 145 WiFi 6E APs) | 85% gap | WiFi 7: Full 6 GHz coverage (1,220 APs) |
| **Channel Utilization** | <50% (comfortable) | 55-70% (congested) | High congestion | WiFi 7: 320 MHz + Multi-RU = <40% utilization |
| **Clients per AP** | <15 (optimal) | 18-25 (overloaded) | 3-10 over target | WiFi 7: Denser deployment = 10-12 clients/AP |

**Issues Identified:**

⚠️ **Issue 1: Dead Zones**
- **Location**: Building corners, stairwells, large conference rooms
- **Impact**: 5-8% of floor area with RSSI < -80 dBm (unusable WiFi)
- **Root Cause**: Insufficient AP density (1 AP per 2,500 sq ft for WiFi 6)
- **Resolution**: WiFi 7 deployment (1 AP per 1,500 sq ft) eliminates dead zones

⚠️ **Issue 2: Channel Congestion (5 GHz)**
- **Current**: 55-70% channel utilization (25 overlapping channels, DFS required)
- **Impact**: Throughput degradation, 20-30ms latency
- **Root Cause**: High client density (18-25 clients per AP)
- **Resolution**: WiFi 7 shifts primary traffic to 6 GHz (320 MHz, less congested)

⚠️ **Issue 3: Overloaded APs**
- **Current**: 18-25 clients per AP (executive floors, conference rooms)
- **Impact**: Per-client throughput < 100 Mbps (insufficient for 4K video)
- **Root Cause**: 450 legacy WiFi 5 APs (slow throughput)
- **Resolution**: Replace WiFi 5 with WiFi 7, add 180 APs for density

---

### 3.1.4 Wireless LAN Controllers (WLC)

**Catalyst 9800 Series Deployment:**

| Site | WLC Model | Quantity | Deployment | Max APs | Current APs | Capacity | Software Version | WiFi 7 Ready? |
|------|-----------|----------|------------|---------|-------------|----------|------------------|---------------|
| **Mumbai** | C9800-40-K9 | 2 (HA pair) | 2021 | 2,000 each | 180 | 91% free | IOS-XE 17.15.1 | ✅ Yes (upgrade to 17.16) |
| **Chennai** | C9800-40-K9 | 2 (HA pair) | 2021 | 2,000 each | 130 | 94% free | IOS-XE 17.15.1 | ✅ Yes |
| **Bangalore** | (Uses Mumbai WLCs) | - | - | - | 20 (via Mumbai) | - | - | ✅ Yes |
| **London** | C9800-40-K9 | 2 (HA pair) | 2022 | 2,000 each | 155 | 92% free | IOS-XE 17.15.1 | ✅ Yes |
| **Frankfurt** | C9800-40-K9 | 2 (HA pair) | 2022 | 2,000 each | 90 | 96% free | IOS-XE 17.15.1 | ✅ Yes |
| **New Jersey** | C9800-40-K9 | 2 (HA pair) | 2020 | 2,000 each | 130 | 94% free | IOS-XE 17.14.1 | ⚠️ Upgrade to 17.15 first, then 17.16 |
| **Dallas** | C9800-40-K9 | 2 (HA pair) | 2020 | 2,000 each | 95 | 95% free | IOS-XE 17.14.1 | ⚠️ Upgrade to 17.15 first, then 17.16 |

**Legacy WLCs (Non-WiFi 7 Compatible):**

| Site | WLC Model | Quantity | Deployment | Current APs | Status | Migration Plan |
|------|-----------|----------|------------|-------------|--------|----------------|
| Singapore, Tokyo, Sydney, Hong Kong | WLC 5520 | 4 (1 per site) | 2017-2018 | 107 APs total | ❌ Not WiFi 7 compatible | Migrate APs to regional C9800 WLCs (Week 1-4) |
| Paris, Amsterdam, Madrid, Milan | WLC 8540 | 4 (1 per site) | 2018-2019 | 110 APs total | ❌ Not WiFi 7 compatible | Migrate APs to London/Frankfurt C9800 WLCs |
| Chicago, Toronto, Mexico City | WLC 5520 | 3 (1 per site) | 2017 | 65 APs total | ❌ Not WiFi 7 compatible | Migrate APs to New Jersey/Dallas C9800 WLCs |

**WLC Upgrade Summary:**

| WLC Model | Sites | Total WLCs | Action Required | Timeline |
|-----------|-------|------------|-----------------|----------|
| **C9800-40-K9** | 6 regions (12 WLCs) | 12 WLCs | Software upgrade: IOS-XE 17.15/17.14 → 17.16.1 | Week 1 (Day-0 prep) |
| **Legacy WLC 5520/8540** | 11 branches | 11 WLCs | Migrate 282 APs to C9800 WLCs (no hardware upgrade needed) | Week 1-4 (pre-pilot) |

**CRITICAL**: No WLC hardware purchase required ✅  
→ All Catalyst 9800 WLCs support WiFi 7 via software upgrade

---

## 3.2 Existing Wired Access Infrastructure

### 3.2.1 Access Switch Inventory

**Total Access Switches: 330 switches (15,840 ports)**

| Switch Model | Ports per Switch | Quantity | Total Ports | PoE Budget | Deployment Year | Status |
|--------------|------------------|----------|-------------|------------|-----------------|--------|
| **Catalyst 9300-48U** | 48 | 120 | 5,760 | 1,100W (PoE+) | 2021-2024 | ✅ Keep (PoE+ sufficient for most) |
| **Catalyst 9300-48P** | 48 | 80 | 3,840 | 740W (PoE+) | 2020-2022 | ⚠️ Low PoE (need injectors for WiFi 7) |
| **Catalyst 3850-48P** | 48 | 60 | 2,880 | 740W (PoE+) | 2018-2020 | ⚠️ Legacy (EoL 2025), replace or inject PoE |
| **Catalyst 3750-48PS** | 48 | 70 | 3,360 | 370W (PoE) | 2015-2017 | ❌ EoL, insufficient PoE (replace or decommission) |

**PoE Power Assessment:**

| Switch Model | PoE Standard | Typical Port Power | Max Ports at 30W (PoE+) | Max Ports at 60W (PoE++) | WiFi 7 Support (60W)? |
|--------------|--------------|-------------------|------------------------|-------------------------|----------------------|
| **C9300-48U** | PoE+ (30W), 1,100W budget | 30W | 36 ports | 18 ports | ⚠️ Limited (use injectors for >18 APs) |
| **C9300-48P** | PoE+ (30W), 740W budget | 30W | 24 ports | 12 ports | ⚠️ Limited (use injectors) |
| **C3850-48P** | PoE+ (30W), 740W budget | 30W | 24 ports | 12 ports | ⚠️ Limited (use injectors) |
| **C3750-48PS** | PoE (15W), 370W budget | 15W | 24 ports | 6 ports | ❌ Insufficient (replace or use injectors) |

**Gap Analysis - PoE Power:**

```yaml
Phase 5A Pilot: 115 WiFi 7 APs (60W each)
Total Power Required: 115 × 60W = 6,900W

Scenario 1: Use Existing Switches (Without Injectors)
  • C9300-48U: Support 18 APs per switch (1,100W ÷ 60W = 18)
  • Switches needed: 115 APs ÷ 18 = 6.4 switches
  • Result: ⚠️ Possible, but limited headroom

Scenario 2: Use PoE Injectors (Recommended for Pilot)
  • 115 injectors (PWR-IE170W-PC-AC, $500 each)
  • Total cost: 115 × $500 = $57,500
  • Benefit: No switch upgrades during pilot, flexible deployment
  • Decision: ✅ Use injectors for Phase 5A

Phase 5B Production: 1,220 WiFi 7 APs
Total Power Required: 1,220 × 60W = 73,200W

Scenario 1: Upgrade to High-PoE Switches
  • Replace 330 switches with C9300-48UN (2,400W PoE budget)
  • C9300-48UN: 40 APs per switch (2,400W ÷ 60W = 40)
  • Switches needed: 1,220 APs ÷ 40 = 30.5 ≈ 31 switches
  • Cost: 31 × $18,000 = $558,000
  • Benefit: Long-term infrastructure refresh
  • Decision: ✅ Recommended for Phase 5B (2025-2026)

Scenario 2: Continue Using Injectors (Not Recommended)
  • 1,220 injectors × $500 = $610,000
  • Issue: Higher cost than switch upgrades, less elegant solution
  • Decision: ❌ Not recommended for production
```

---

### 3.2.2 Wired Port Utilization

**Current Wired Port Usage:**

| Port Usage Category | Ports | % of Total | Migration Status (Phase 5) |
|---------------------|-------|------------|---------------------------|
| **User Desktops (Ethernet)** | 6,200 | 39% | ✅ Migrate to wireless (75% = 4,650 ports freed) |
| **Laptops (Docked)** | 3,800 | 24% | ✅ Migrate to wireless (100% = 3,800 ports freed) |
| **IP Phones (Desk)** | 800 | 5% | ⚠️ Keep wired (PoE, reliability) |
| **Printers (MFP)** | 250 | 2% | ⚠️ Keep wired (100%, reliability) |
| **Servers** | 450 | 3% | ❌ Keep wired (10G, low latency) |
| **Network Infrastructure** | 200 | 1% | ❌ Keep wired (switches, routers, firewalls) |
| **Building Automation (BMS, HVAC)** | 300 | 2% | ❌ Keep wired (24x7 reliability) |
| **Security Cameras (PoE)** | 350 | 2% | ⚠️ 40 migrate to WiFi 7 (Phase 4 AI cameras), 310 stay wired |
| **IoT Sensors** | 2,200 | 14% | ⚠️ Keep wired or dedicated IoT wireless (not WiFi 7) |
| **Unused/Spare** | 1,290 | 8% | N/A |
| **TOTAL** | **15,840** | **100%** | - |

**Post-Phase 5 Port Utilization:**

| Category | Current Ports | Freed (WiFi 7) | Remaining Wired | % Reduction |
|----------|--------------|----------------|-----------------|-------------|
| **User Endpoints** | 10,000 (desktops + laptops) | 8,450 | 1,550 (wired by exception) | 85% wireless |
| **Critical Infrastructure** | 4,550 (servers, printers, phones, BMS, cameras, IoT) | 40 (AI cameras) | 4,510 | 1% wireless |
| **Unused/Spare** | 1,290 | - | 1,290 | - |
| **TOTAL** | 15,840 | 8,490 | 7,350 | **54% reduction** |

**Access Switch Consolidation:**

```yaml
Pre-Phase 5:
  • 330 access switches
  • 15,840 ports
  • 48% utilization (7,550 active ports)

Post-Phase 5:
  • 7,350 active ports (8,490 freed via wireless migration)
  • 152 access switches needed (7,350 ÷ 48 = 153)
  • 178 switches decommissioned (330 - 152 = 178 switches)
  • 8,544 ports decommissioned (178 × 48 = 8,544 ports)

Result:
  ✅ 54% switch port reduction
  ✅ 178 switches decommissioned (power savings, rack space)
  ✅ Simplified wired infrastructure
```

---

### 3.2.3 Uplink Bandwidth Assessment

**Uplink Requirements (Per Fabric Edge Switch):**

| Site Type | Current Uplink | WiFi 7 Load (50 APs) | Required Uplink | Gap | Action |
|-----------|----------------|----------------------|-----------------|-----|--------|
| **Large HQ (Mumbai, Chennai, London)** | 2× 10G SFP+ | 50 APs × 1 Gbps avg = 50 Gbps peak | 20 Gbps (2× 10G) | 2.5:1 oversubscription | ✅ Acceptable (bursty traffic) |
| **Medium Branch (Bangalore)** | 2× 1G RJ45 | 10 APs × 1 Gbps = 10 Gbps peak | 2 Gbps (2× 1G) | 5:1 oversubscription | ⚠️ Upgrade to 2× 10G SFP+ |
| **Small Branches** | 2× 1G RJ45 | 5-8 APs × 1 Gbps = 5-8 Gbps | 2 Gbps | 2.5-4:1 oversubscription | ⚠️ Monitor, upgrade if needed |

**Bangalore Branch Upgrade (Example):**

```yaml
Current State:
  • Switch: Catalyst 9300-48U
  • Uplinks: 2× GigabitEthernet (1G RJ45)
  • Aggregate: 2 Gbps

Phase 5A Deployment:
  • 10 WiFi 7 APs
  • Expected load: 10 APs × 1 Gbps avg = 10 Gbps peak
  • Oversubscription: 10 Gbps / 2 Gbps = 5:1 (high)

Issue:
  ⚠️ Uplink bottleneck (5:1 oversubscription)
  → Peak hour congestion, throughput throttling

Resolution:
  ✅ Upgrade uplinks to 2× 10G SFP+ (Week 2, before AP deployment)
  • Hardware: C9300-NM-8X (8× 10G SFP+ module)
  • Cables: 2× SFP-10G-SR (10m)
  • Cost: ~$2,000 per switch
  • Timeline: Week 2 (Day-0 preparation)

Post-Upgrade:
  • Uplinks: 2× 10G SFP+ = 20 Gbps aggregate
  • Oversubscription: 10 Gbps / 20 Gbps = 0.5:1 (comfortable)
```

---

## 3.3 Network Fabric & Underlay Assessment

### 3.3.1 SD-Access Fabric Status

**Abhavtech's SD-Access Fabric Deployment:**

| Component | Model | Quantity | Software | Status | WiFi 7 Impact |
|-----------|-------|----------|----------|--------|---------------|
| **Fabric Border Nodes** | Catalyst 9500-40X | 12 (6 sites × 2 HA) | IOS-XE 17.15.1 | ✅ Ready | No upgrade needed |
| **Fabric Edge Nodes** | Catalyst 9300-48U/P | 330 switches | IOS-XE 17.15.1 | ✅ Ready | Support VXLAN + SGT tagging |
| **Fabric WLCs** | Catalyst 9800-40 | 12 (HA pairs) | IOS-XE 17.15.1 | ⚠️ Upgrade to 17.16 | WiFi 7 support |
| **Fabric Control Plane** | DNAC 2.3.5 | 3 nodes (cluster) | DNAC 2.3.5.6 | ⚠️ Upgrade to 2.3.7 | WiFi 7 templates |

**Fabric Readiness for WiFi 7:**

✅ **VXLAN Encapsulation**: Supported (existing SD-Access fabric)  
✅ **SGT Inline Tagging**: Supported (TrustSec enabled on all fabric edge nodes)  
✅ **Wireless Integration**: WLCs integrated as fabric edge nodes  
⚠️ **WLC Software**: Requires upgrade to IOS-XE 17.16.1 (WiFi 7 support)  
⚠️ **DNAC Software**: Requires upgrade to 2.3.7+ (WiFi 7 provisioning templates)  

**No Fabric Underlay Changes Required** ✅

---

### 3.3.2 ISE Integration Status

**Identity Services Engine (ISE) Deployment:**

| Component | Version | Nodes | Status | WiFi 7 Impact |
|-----------|---------|-------|--------|---------------|
| **ISE Primary Admin Node (PAN)** | 3.3 Patch 1 | 1 | ✅ Ready | No upgrade needed (802.1X compatible) |
| **ISE Policy Service Nodes (PSN)** | 3.3 Patch 1 | 12 (2 per region) | ✅ Ready | WiFi 7 clients authenticate via 802.1X |
| **ISE Monitoring Node (MnT)** | 3.3 Patch 1 | 2 (HA) | ✅ Ready | Monitor WiFi 7 client sessions |
| **pxGrid Nodes** | 3.3 Patch 1 | 2 | ✅ Ready | Publish WiFi 7 client context to XDR, DNAC |

**ISE Policy Configuration:**

```yaml
Existing ISE Policies (No Changes for WiFi 7):

SSID: Corp-Secure (WiFi 6/6E)
  • Authentication: 802.1X (EAP-TLS or PEAP-MSCHAPv2)
  • Authorization: AD Group-based SGT assignment
  • Posture: Duo Device Trust (OS version, AV, encryption)
  • Result: SGT 11 (Executives), SGT 15 (Employees), SGT 16 (Contractors)

New SSID: Corp-Secure-7 (WiFi 7)
  • Authentication: Same as Corp-Secure (802.1X)
  • Authorization: Same AD Group → SGT mapping
  • Posture: Same Duo checks
  • Result: Same SGTs (11, 15, 16)
  
Key Insight:
  ✅ WiFi 7 is TRANSPARENT to ISE
  ✅ No ISE policy changes required
  ✅ SGT assignment identical for WiFi 6/7 clients
```

---

## 3.4 Power & Environmental Infrastructure

### 3.4.1 Power Circuit Capacity

**IDF Closet Power Assessment:**

| Site | IDFs | Power Circuits per IDF | Current Load | PoE Injector Load (Phase 5A) | Headroom | Status |
|------|------|----------------------|--------------|------------------------------|----------|--------|
| **Mumbai HQ** | 10 IDFs | 2× 20A (240V) = 9.6 kW per IDF | 4.2 kW (switches, WLC) | 3.6 kW (6 injectors × 600W) | 1.8 kW | ✅ Sufficient |
| **Chennai HQ** | 8 IDFs | 2× 20A (240V) = 9.6 kW per IDF | 3.8 kW | 2.4 kW (4 injectors × 600W) | 3.4 kW | ✅ Sufficient |
| **Bangalore** | 2 IDFs | 2× 15A (240V) = 7.2 kW per IDF | 3.0 kW | 3.0 kW (5 injectors × 600W) | 1.2 kW | ⚠️ Limited (monitor closely) |
| **London HQ** | 10 IDFs | 2× 16A (230V) = 7.4 kW per IDF | 3.5 kW | 2.0 kW (3-4 injectors × 600W) | 1.9 kW | ✅ Sufficient |

**Issue: Bangalore Branch Power Constraint**

```yaml
Bangalore IDF Power Analysis:

Current State:
  • 2 IDFs, each with 2× 15A circuits (240V)
  • Total per IDF: 7.2 kW
  • Current load: 3.0 kW (switches, router, patch panels)
  • Headroom: 4.2 kW

Phase 5A Requirements:
  • 10 WiFi 7 APs total (5 per IDF)
  • 5 PoE injectors per IDF (PWR-IE170W-PC-AC, 600W each at full load)
  • Total: 5 × 600W = 3.0 kW per IDF

Post-Phase 5A:
  • Total load: 3.0 kW (existing) + 3.0 kW (injectors) = 6.0 kW
  • Headroom: 7.2 kW - 6.0 kW = 1.2 kW (17% margin)

Concern:
  ⚠️ Limited power headroom (1.2 kW = 17%)
  ⚠️ No room for growth (Phase 5B expansion)

Resolution:
  ✅ Week 2: Facilities add 1 additional 20A circuit per IDF
     → New total: 3× 20A (240V) = 14.4 kW per IDF
     → Headroom increases to 8.4 kW (safe margin)
  
  Cost: $2,000 per circuit (electrician labor, permits)
  Total: 2 IDFs × $2,000 = $4,000
  Timeline: Week 2 (Day-0 prep)
```

---

### 3.4.2 Cooling & HVAC Capacity

**IDF Closet Thermal Load:**

| Site | IDF Cooling | Current Heat Load | WiFi 7 Additional Load (Injectors) | Total Load | Cooling Headroom | Status |
|------|-------------|------------------|-----------------------------------|------------|------------------|--------|
| **Mumbai HQ** | Split AC (2 tons per IDF) | 14,000 BTU/hr | 3,600W × 3.41 = 12,276 BTU/hr | 26,276 BTU/hr | -2,276 BTU/hr | ⚠️ Need additional cooling |
| **Chennai HQ** | Split AC (1.5 tons per IDF) | 10,000 BTU/hr | 2,400W × 3.41 = 8,184 BTU/hr | 18,184 BTU/hr | -184 BTU/hr | ⚠️ Marginal (monitor temps) |
| **Bangalore** | Split AC (1 ton per IDF) | 8,000 BTU/hr | 3,000W × 3.41 = 10,230 BTU/hr | 18,230 BTU/hr | -6,230 BTU/hr | ❌ Insufficient cooling |
| **London HQ** | Split AC (2 tons per IDF) | 12,000 BTU/hr | 2,000W × 3.41 = 6,820 BTU/hr | 18,820 BTU/hr | 5,180 BTU/hr | ✅ Sufficient |

**Conversion Factor**: 1 Watt = 3.41 BTU/hr  
**AC Capacity**: 1 ton = 12,000 BTU/hr

**Bangalore IDF Cooling Upgrade:**

```yaml
Bangalore IDF Cooling Analysis:

Current Cooling:
  • 2 IDFs, each with 1-ton split AC (12,000 BTU/hr)
  • Current heat load: 8,000 BTU/hr per IDF
  • Headroom: 4,000 BTU/hr (33% margin)

Phase 5A Heat Load:
  • 5 PoE injectors per IDF: 3,000W
  • Heat dissipation: 3,000W × 3.41 = 10,230 BTU/hr
  • Total load: 8,000 + 10,230 = 18,230 BTU/hr

Issue:
  ❌ Total load (18,230 BTU/hr) > AC capacity (12,000 BTU/hr)
  ❌ IDF will overheat (>30°C / 86°F)
  ❌ Equipment shutdowns, reliability issues

Resolution:
  ✅ Week 3: Install additional 1-ton split AC per IDF
     → New capacity: 24,000 BTU/hr per IDF
     → Headroom: 24,000 - 18,230 = 5,770 BTU/hr (24% margin)
  
  Cost: $3,000 per AC unit (including installation)
  Total: 2 IDFs × $3,000 = $6,000
  Timeline: Week 3 (Day-0 prep, before AP installation)
```

---

## 3.5 Catalyst Center (DNAC) Readiness

### 3.5.1 Current DNAC Deployment

**DNAC Cluster Configuration:**

| Component | Specification | Current | Required (WiFi 7) | Status |
|-----------|--------------|---------|-------------------|--------|
| **DNAC Version** | Software | 2.3.5.6 | 2.3.7+ | ⚠️ Upgrade needed |
| **Cluster Nodes** | Servers | 3 nodes (HA cluster) | 3 nodes | ✅ Sufficient |
| **CPU** | vCPUs | 56 vCPUs per node | 56 vCPUs | ✅ Sufficient |
| **Memory** | RAM | 256 GB per node | 256 GB | ✅ Sufficient |
| **Storage** | Disk | 3 TB per node | 3 TB | ✅ Sufficient |
| **Managed Devices** | Switches, routers, APs, WLCs | 850 devices | 1,200 devices (post-WiFi 7) | ✅ 40% headroom |

**DNAC WiFi 7 Feature Requirements:**

```yaml
Current DNAC 2.3.5:
  ❌ No WiFi 7 SSID templates
  ❌ No 320 MHz RF profile support
  ❌ No MLO configuration options
  ❌ No WiFi 7 client telemetry collection

DNAC 2.3.7+ (Required):
  ✅ WiFi 7 SSID templates (WPA3-Enterprise, MLO enabled)
  ✅ RF profiles for 320 MHz channels (6 GHz)
  ✅ MLO configuration (NSTR mode, link selection)
  ✅ WiFi 7 telemetry (MLO events, 320 MHz utilization)
  ✅ Deep Network Model (DNM) support for WiFi 7 client health prediction

Upgrade Path:
  DNAC 2.3.5.6 → DNAC 2.3.7.5 (direct upgrade, zero downtime)
  Timeline: Week 2 (Day-0 prep)
  Duration: 90 minutes (rolling upgrade across 3 nodes)
```

---

### 3.5.2 DNAC Capacity Planning

**Post-Phase 5 Device Count:**

| Device Type | Current | Phase 5A | Phase 5B | Total Post-Phase 5 | DNAC Limit | Headroom |
|-------------|---------|----------|----------|--------------------|------------|----------|
| **WiFi 7 APs** | 0 | 115 | 1,105 | 1,220 | 2,000 | 39% |
| **Legacy APs (WiFi 6/6E)** | 1,185 | 1,185 (keep) | 0 (replaced) | 0 | - | - |
| **WLCs** | 12 | 12 | 12 | 12 | 100 | 88% |
| **Access Switches** | 330 | 330 | 152 (decommission 178) | 152 | 500 | 70% |
| **Core/Distribution** | 48 | 48 | 48 | 48 | 100 | 52% |
| **TOTAL** | **1,575** | **1,690** | **1,317** | **1,432** | **2,700** | **47%** |

**Result**: ✅ DNAC has sufficient capacity for Phase 5 (47% headroom)

---

## 3.6 Gap Analysis Summary

### 3.6.1 Hardware Upgrade Requirements

**Phase 5A Pilot (Immediate Needs):**

| Component | Current | Required | Gap | Action | Cost Estimate |
|-----------|---------|----------|-----|--------|---------------|
| **WiFi 7 APs** | 0 | 115 APs | 115 new | Purchase C9178I-BE | $575,000 |
| **PoE Injectors** | 0 | 115 injectors | 115 new | Purchase PWR-IE170W-PC-AC | $57,500 |
| **10G Uplinks (Bangalore)** | 2× 1G | 2× 10G SFP+ | Upgrade | Purchase SFP+ modules + cables | $2,000 |
| **Power Circuits (Bangalore)** | 2× 15A per IDF | 3× 20A per IDF | Add 2 circuits | Electrician install | $4,000 |
| **Cooling (Bangalore)** | 1 ton per IDF | 2 tons per IDF | Add 2 AC units | HVAC install | $6,000 |
| **TOTAL (Phase 5A Pilot)** | - | - | - | - | **$644,500** |

**Phase 5B Production (2025-2026):**

| Component | Current | Required | Gap | Action | Cost Estimate |
|-----------|---------|----------|-----|--------|---------------|
| **WiFi 7 APs** | 115 (pilot) | 1,220 total | 1,105 additional | Purchase C9178I-BE | $5,525,000 |
| **Access Switches (High-PoE)** | 330 (mixed PoE) | 152 (all PoE++) | Replace 31 critical | Purchase C9300-48UN | $558,000 |
| **Legacy AP Decommission** | 1,185 APs | 0 (all replaced) | Decommission 1,185 | RMA or spare pool | $0 (cost avoidance) |
| **Access Switch Decommission** | 330 switches | 152 (consolidate) | Decommission 178 | RMA or spare pool | $0 (cost avoidance) |
| **TOTAL (Phase 5B)** | - | - | - | - | **$6,083,000** |

**Grand Total (Phase 5A + 5B)**: **$6,727,500** (hardware only)

---

### 3.6.2 Software Upgrade Requirements

**Zero-Cost Software Upgrades (Covered by SmartNet):**

| Component | Current Version | Target Version | Effort | Timeline | Risk |
|-----------|----------------|----------------|--------|----------|------|
| **WLCs (C9800-40)** | IOS-XE 17.15.1 / 17.14.1 | IOS-XE 17.16.1 | 4 hours per HA pair | Week 1 (Day-0) | Low (rolling upgrade) |
| **DNAC** | 2.3.5.6 | 2.3.7.5 | 90 minutes | Week 2 (Day-0) | Low (rolling upgrade) |
| **ISE** | 3.3 Patch 1 | 3.3 Patch 1 (no upgrade) | N/A | N/A | N/A |
| **Fabric Switches** | IOS-XE 17.15.1 | 17.15.1 (no upgrade) | N/A | N/A | N/A |

**Total Software Upgrade Cost**: **$0** (SmartNet maintenance covers upgrades) ✅

---

### 3.6.3 Critical Path Dependencies

**Week 1-4 (Day-0 Preparation) - Critical Path:**

```
Week 1: WLC Software Upgrades
  ├─ Mumbai WLCs: IOS-XE 17.15 → 17.16 (Saturday maintenance window)
  ├─ Chennai WLCs: IOS-XE 17.15 → 17.16
  ├─ London WLCs: IOS-XE 17.15 → 17.16
  └─ Validation: All WLCs operational, WiFi 7 features enabled

Week 2: DNAC Upgrade + Network Prep
  ├─ DNAC: 2.3.5 → 2.3.7 (Monday evening, 90 min)
  ├─ Bangalore: 10G uplink upgrade (switch module install)
  ├─ Bangalore: Power circuit install (2 new 20A circuits)
  └─ Validation: DNAC WiFi 7 templates working

Week 3: Infrastructure Validation + Cooling
  ├─ RF site surveys (Ekahau) - all pilot floors
  ├─ PoE injector install (115 units, staged in IDFs)
  ├─ Bangalore: Additional cooling install (2× 1-ton AC units)
  └─ Validation: Power, cooling, uplinks ready

Week 4: Hardware Staging + Go/No-Go
  ├─ WiFi 7 APs arrive (115 units)
  ├─ AP inventory, labeling, pre-staging
  ├─ Team training (installers, NOC, helpdesk)
  └─ Go/No-Go Decision: CTO approval (Friday EOD)

Week 5: Deployment Begins
  └─ AP installation starts (Mumbai Floor 6)
```

---

## 3.7 Infrastructure Readiness Score

**Phase 5A Pilot Readiness Assessment:**

| Category | Readiness | Issues | Resolution | Timeline |
|----------|-----------|--------|------------|----------|
| **Wireless Infrastructure** | 90% | WLC software outdated (17.15 vs 17.16) | Upgrade WLCs | Week 1 ✅ |
| **Wired Infrastructure** | 75% | Bangalore: 1G uplinks insufficient | Upgrade to 10G | Week 2 ✅ |
| **Power Infrastructure** | 70% | Bangalore: Limited power headroom | Add power circuits | Week 2 ✅ |
| **Cooling Infrastructure** | 65% | Bangalore: Insufficient cooling | Install additional ACs | Week 3 ✅ |
| **Management Systems** | 85% | DNAC version outdated (2.3.5 vs 2.3.7) | Upgrade DNAC | Week 2 ✅ |
| **Security Integration** | 100% | ISE ready (no changes needed) | N/A | N/A ✅ |
| **OVERALL READINESS** | **81%** | 4 issues identified | All resolvable in Week 1-3 | Week 1-3 ✅ |

**Assessment**: ✅ Infrastructure is **WiFi 7-ready** with minor Day-0 preparation (4 weeks)
