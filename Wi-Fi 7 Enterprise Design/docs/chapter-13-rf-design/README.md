# CHAPTER 13: RF DESIGN & SITE SURVEY METHODOLOGY

## 13.1 WiFi 7 RF Design Principles

### 13.1.1 Design Philosophy: "Coverage First, Capacity Second"

**Abhavtech WiFi 7 RF Design Goals:**

```yaml
Primary Objectives:
  1. Coverage: 100% floor area with RSSI ≥-67 dBm (6 GHz)
  2. Capacity: Support 4+ Gbps per client (executive floors)
  3. Redundancy: Dual-AP coverage (any location served by 2+ APs)
  4. MLO: Enable 5 GHz + 6 GHz simultaneous links

Secondary Objectives:
  5. Minimize co-channel interference (320 MHz channels)
  6. Future-proof: 20% capacity headroom for growth
  7. Aesthetics: Conceal APs where possible (ceiling tiles, above-ceiling)
```

**WiFi 7 vs WiFi 6 Design Differences:**

| Design Aspect | WiFi 6 (Legacy) | WiFi 7 (Phase 5) | Impact |
|--------------|-----------------|------------------|--------|
| **Primary Band** | 5 GHz (80/160 MHz) | 6 GHz (320 MHz) | 2× spectrum, cleaner RF environment |
| **AP Density** | 1 AP per 2,000 sq ft | 1 AP per 1,333 sq ft | +50% APs (denser deployment) |
| **Target RSSI** | -70 dBm (5 GHz) | -67 dBm (6 GHz) | Higher signal required (6 GHz attenuation) |
| **Channel Plan** | DFS channels (5 GHz) | PSC channels (6 GHz) | Simpler, no DFS/radar detection |
| **MLO Design** | N/A (single link) | Dual-band (5+6 GHz) | Requires both bands operational |

---

### 13.1.2 6 GHz Specific Considerations

**6 GHz Band Characteristics:**

```yaml
Advantages:
  • Clean spectrum: No legacy WiFi 4/5/6 interference
  • Wide channels: 320 MHz available (Ch 31, 63, 95, 127, 159, 191)
  • Low power indoor (LPI): Simplifies deployment (no AFC required)
  • PSC channels: No DFS/radar detection delays

Challenges:
  • Higher attenuation: ~10% more path loss vs 5 GHz
  • Client support: Requires WiFi 7 clients (Intel BE200, Qualcomm FastConnect 7800)
  • Shorter range: Expect 15-20% reduced coverage radius vs 5 GHz

Design Implications:
  • Denser AP deployment: 1 AP per 1,333 sq ft (vs 1 per 2,000 for WiFi 6)
  • Higher transmit power: 17-23 dBm (max allowed for LPI indoor)
  • 5 GHz backup: Essential for MLO (fallback when 6 GHz weak)
```

**6 GHz Path Loss Calculation:**

```
Free Space Path Loss (FSPL) Formula:
FSPL (dB) = 20 × log10(distance_m) + 20 × log10(frequency_MHz) + 32.44

Example (10 meters, 6 GHz = 6,000 MHz):
FSPL = 20 × log10(10) + 20 × log10(6000) + 32.44
     = 20 × 1 + 20 × 3.778 + 32.44
     = 20 + 75.56 + 32.44
     = 128 dB

Comparison:
  • 5 GHz (5,500 MHz) at 10m: 127 dB
  • 6 GHz (6,000 MHz) at 10m: 128 dB
  • Difference: +1 dB (6 GHz has ~10% more attenuation)

Practical Impact:
  • 5 GHz coverage radius: 15 meters (target RSSI -70 dBm)
  • 6 GHz coverage radius: 12 meters (target RSSI -67 dBm)
  • AP spacing reduction: 20% denser deployment required
```

---

## 13.2 Site Survey Methodology

### 13.2.1 Pre-Deployment Survey (Predictive)

**Predictive RF Modeling (Ekahau AI Pro):**

```yaml
Step 1: Import Floor Plans
  • Source: CAD files from Facilities (AutoCAD .dwg format)
  • Scale: Verify dimensions (measure known distance, e.g., corridor width)
  • Buildings: Mumbai HQ (6 floors), Chennai (4 floors), London (2 floors)

Step 2: Define Attenuation Materials
  Material Library:
    • Drywall: 3 dB attenuation
    • Glass (standard): 2 dB
    • Glass (low-E coated): 6 dB (common in modern buildings)
    • Concrete wall (6 inch): 8 dB
    • Metal door: 12 dB
    • Elevator shaft: 20+ dB (RF blackout)
  
  Floor-Specific Notes:
    • Mumbai Floor 6 (Executive): Glass-walled offices (6 dB low-E glass)
    • Chennai Floor 2 (Open plan): Minimal walls (mostly drywall cubes)

Step 3: Place APs (Predictive Model)
  AP Type: Cisco Catalyst 9178I-BE (WiFi 7, 4×4:4 MIMO)
  Transmit Power: 17 dBm (6 GHz), 20 dBm (5 GHz)
  Antenna Pattern: Omnidirectional (ceiling-mounted)
  
  Placement Strategy:
    • Start with grid: 1 AP per 1,333 sq ft (36.5 × 36.5 feet spacing)
    • Adjust for obstacles: Move APs to avoid elevator shafts, stairwells
    • Executive offices: 1 AP per 2 offices (glass walls = high attenuation)
    • Open plan: Grid pattern, avoid conference room overlap

Step 4: Run Simulation
  Target Metrics:
    • RSSI: ≥-67 dBm (6 GHz) for 95% of floor area
    • SNR: ≥25 dB for 4096-QAM modulation
    • Channel Overlap: <10% co-channel (320 MHz channels)
  
  Simulation Output (Mumbai Floor 6):
    • Total APs: 15 APs (20,000 sq ft / 1,333 = 15)
    • Coverage: 97% of floor area ≥-67 dBm ✓
    • Capacity: 15 APs × 25 clients/AP = 375 client capacity
    • Dead zones: 3% (elevator cores, metal server closets)

Step 5: Generate AP Placement Map
  • Export: PDF with AP locations (numbered: MUM-F6-AP01 through MUM-F6-AP15)
  • Include: Mounting height (9 feet, drop ceiling tiles)
  • Power: Mark PoE+ ports (30W per AP, identify switch uplinks)
  • Ethernet: 10 Gbps fiber or multi-gig copper (2.5/5/10G)
```

**Predictive Survey Deliverables:**

```
1. AP Placement Map (PDF)
   • Floor plan with 15 AP locations marked
   • AP naming: MUM-F6-AP01, MUM-F6-AP02, etc.
   • Power requirements: PoE+ (30W × 15 = 450W total)

2. Coverage Heatmap (RSSI)
   • Color-coded: Green (≥-60 dBm), Yellow (-60 to -70), Red (<-70)
   • Mumbai Floor 6: 97% green/yellow ✓

3. Capacity Analysis
   • Peak client density: 80 executives + 20 guests = 100 clients
   • AP load: 100 clients / 15 APs = 6.7 clients/AP (comfortable)
   • Throughput: 6.7 × 4 Gbps = 26.8 Gbps per AP (within capacity)

4. Channel Plan
   • Ch 31 (320 MHz): APs 1, 4, 7, 10, 13
   • Ch 63 (320 MHz): APs 2, 5, 8, 11, 14
   • Ch 95 (320 MHz): APs 3, 6, 9, 12, 15
   • 5-channel reuse pattern (minimize co-channel interference)

5. Bill of Materials (BOM)
   • 15× Cisco Catalyst 9178I-BE (WiFi 7 APs)
   • 2× Catalyst 9300-48UXM (PoE+ switch, mGig ports)
   • 15× Ceiling mount brackets
   • 15× Cat6A cables (pre-terminated, 50 ft)
```

---

### 13.2.2 Post-Deployment Survey (Validation)

**Validation Survey (Ekahau Sidekick 2 + Ekahau Survey App):**

```yaml
Objective: Verify predictive model accuracy, identify coverage gaps

Survey Equipment:
  • Ekahau Sidekick 2: WiFi spectrum analyzer + packet capture
  • Laptop: WiFi 7-capable (Intel BE200 adapter)
  • SSID: Corp-Secure-7 (WPA3-Enterprise, live production)

Survey Procedure:
  Step 1: Passive Survey (RF Environment)
    • Walk entire floor at 2 mph pace
    • Ekahau records: RSSI, channel utilization, AP visibility
    • Duration: 45-60 minutes per floor (20,000 sq ft)
  
  Step 2: Active Survey (Client Perspective)
    • Connect to Corp-Secure-7 SSID
    • Ekahau records: Throughput, latency, packet loss
    • Perform: iPerf3 tests at 10 sample points (validate 4+ Gbps)
  
  Step 3: Spectrum Analysis (Interference Detection)
    • Scan 6 GHz band (5,925-7,125 MHz)
    • Identify: Non-WiFi interference (rare in 6 GHz, but check)
    • Check: Co-channel interference (same-channel APs overlapping)

Survey Metrics (Target vs Actual):
  • RSSI ≥-67 dBm coverage: Target 95%, Actual 97% ✓
  • Throughput ≥4 Gbps: Target 90%, Actual 94% ✓
  • Latency <10ms: Target 95%, Actual 98% ✓
  • Channel utilization: Target <50%, Actual 35% ✓

Survey Deliverables:
  1. Heatmap (RSSI, actual): Overlay on floor plan
  2. Throughput heatmap: Show Gbps per location
  3. Issue List: Document 3 dead zones (elevator cores)
  4. Recommendation: Add 2 APs in corners (MUM-F6-AP16, AP17)
```

**Post-Survey Optimization:**

```yaml
Issue 1: Dead Zone in SE Corner (Elevator Core)
  • Predictive Model: RSSI -72 dBm (marginal)
  • Actual Survey: RSSI -78 dBm (unacceptable)
  • Root Cause: Elevator shaft (metal) blocks RF more than predicted
  • Solution: Add MUM-F6-AP16 (SE corner, 10 ft from elevator)
  • Validation: Re-survey SE corner → RSSI improved to -62 dBm ✓

Issue 2: High Channel Utilization on Ch 31 (3 APs overlapping)
  • Predictive Model: Ch 31 utilization 40%
  • Actual Survey: Ch 31 utilization 65% (degraded performance)
  • Root Cause: APs 1, 4, 7 all on Ch 31, overlapping coverage
  • Solution: Change AP-04 from Ch 31 → Ch 127 (new channel)
  • Validation: Ch 31 utilization reduced to 42% ✓

Issue 3: Slow Throughput in Conference Room (MUM-F6-CONF-01)
  • Expected: 4.5 Gbps
  • Actual: 2.8 Gbps (38% slower)
  • Root Cause: AppleTV (WiFi 6) in room causing co-channel contention
  • Solution: Move AppleTV to 5 GHz only (disable 6 GHz radio)
  • Validation: Throughput improved to 4.3 Gbps ✓
```

---

## 13.3 AP Placement Guidelines

### 13.3.1 Density Calculations

**AP Density Formula (Coverage-Based):**

```
AP Count = Floor Area (sq ft) / Coverage Area per AP (sq ft)

Coverage Area per AP (6 GHz, RSSI -67 dBm):
  • Radius: 12 meters = 39.4 feet
  • Area: π × (39.4)² = 4,877 sq ft

Adjusted for Overlap (20% redundancy):
  • Effective Area: 4,877 × 0.8 = 3,900 sq ft

Conservative Design (Abhavtech):
  • Target: 1 AP per 1,333 sq ft (more aggressive, higher density)
  • Reason: Executive floors require premium performance (>4 Gbps)

Example: Mumbai Floor 6 (20,000 sq ft)
  AP Count = 20,000 / 1,333 = 15 APs ✓
```

**AP Density Formula (Capacity-Based):**

```
AP Count = Peak Client Count / Clients per AP

Clients per AP (WiFi 7, 4×4:4 MIMO):
  • Recommended: 25 clients/AP (CWAP standard)
  • Abhavtech Conservative: 15 clients/AP (premium performance)

Example: Mumbai Floor 6
  • Peak Clients: 80 executives + 20 guests = 100 clients
  • AP Count: 100 / 15 = 6.7 APs ≈ 7 APs minimum

Comparison:
  • Coverage-based: 15 APs (more APs)
  • Capacity-based: 7 APs (fewer APs)
  • Chosen: 15 APs (coverage-driven design, capacity is bonus)
```

---

### 13.3.2 Mounting Guidelines

**AP Installation Best Practices:**

```yaml
Mounting Height:
  • Standard: 9 feet above floor (drop ceiling tiles)
  • High ceiling: 12-15 feet (warehouse, atrium) - use directional antennas
  • Low ceiling: 8 feet minimum (residential-style offices)

Orientation:
  • Ceiling-mount: Omnidirectional pattern (360° coverage)
  • Wall-mount: Directional (rare, use for corridors only)
  • Avoid: Mounting behind metal objects (ceiling plenums, HVAC ducts)

Clearance:
  • Horizontal: 6 inches from walls, light fixtures
  • Vertical: 12 inches from HVAC vents (airflow disrupts cooling)
  • Avoid: Directly above heat sources (servers, copy machines)

Aesthetics:
  • Preferred: Conceal in ceiling tiles (white AP blends with tiles)
  • Alternative: Above-ceiling mount (plenum-rated, visible only from below)
  • Executive Floors: Coordinate with facilities (match office aesthetics)

Cabling:
  • Cat6A required: Supports 10 Gbps (WiFi 7 AP uplinks)
  • Length: <90 meters (295 feet) from switch
  • Labeling: Clear labels (AP name + port number on switch)
```

**Mumbai Floor 6 AP Mounting Example:**

```
AP: MUM-F6-AP01
Location: North Wing, Grid E7 (see floor plan)
Mounting:
  • Height: 9 feet (drop ceiling tile #E7-12)
  • Tile Type: 2×2 ft Armstrong suspended ceiling
  • Bracket: Cisco AIR-AP-T-RAIL-R (T-bar rail mount)
  • Cable: Cat6A, 40 ft run to IDF-6N (closet)

Power:
  • PoE+: 30W (802.3at)
  • Switch: Catalyst 9300-48UXM, Port Gi1/0/1
  • Backup Power: UPS in IDF-6N (2-hour runtime)

Ethernet:
  • Uplink: 10 Gbps (mGig auto-negotiation)
  • VLAN: Management VLAN 100 (AP management)
  • Trunking: 802.1Q trunk (all corporate VLANs)

Validation:
  • Post-install RSSI: -58 dBm at 10m (excellent) ✓
  • Channel: 31 (320 MHz, 6 GHz)
  • Clients: 8 executives (healthy load)
```

---

## 13.4 Channel Planning (6 GHz)

### 13.4.1 6 GHz Channel Allocation

**6 GHz Spectrum Overview:**

```yaml
Total Spectrum: 5,925-7,125 MHz (1,200 MHz)

320 MHz Channels (WiFi 7):
  • Channel 31: 5,955-6,275 MHz (center: 6,115 MHz)
  • Channel 63: 6,275-6,595 MHz (center: 6,435 MHz)
  • Channel 95: 6,595-6,915 MHz (center: 6,755 MHz)
  • Channel 127: 6,915-7,235 MHz (center: 7,075 MHz) [partial, upper band]
  • Channel 159: 7,115-7,435 MHz [not available in most regions]
  • Channel 191: 7,235-7,555 MHz [not available in most regions]

Available Channels (India, US):
  • Non-overlapping: 3 channels (Ch 31, 63, 95)
  • Overlapping: Ch 127 (use with caution, overlaps Ch 95)

PSC (Preferred Scanning Channel):
  • Definition: Channels clients scan first (faster discovery)
  • PSC List: 5, 21, 37, 53, 69, 85, 101, 117, 133, 149, 165, 181, 197
  • WiFi 7 (320 MHz): Use Ch 31, 63, 95 (all contain PSC channels)
```

**Channel Plan (Mumbai HQ Floor 6):**

```yaml
Channel Assignment Strategy:
  • Pattern: 3-channel reuse (Ch 31, 63, 95)
  • Avoid: Adjacent APs on same channel (co-channel interference)
  • Goal: Maximize spatial separation for same-channel APs

Floor 6 AP Channel Assignments (15 APs):

  Ch 31 (320 MHz): 5 APs
    • MUM-F6-AP01 (North Wing, NW corner)
    • MUM-F6-AP04 (North Wing, center)
    • MUM-F6-AP07 (Center Wing, W side)
    • MUM-F6-AP10 (South Wing, center)
    • MUM-F6-AP13 (South Wing, SE corner)
  
  Ch 63 (320 MHz): 5 APs
    • MUM-F6-AP02 (North Wing, NE corner)
    • MUM-F6-AP05 (North Wing, E side)
    • MUM-F6-AP08 (Center Wing, center)
    • MUM-F6-AP11 (South Wing, W side)
    • MUM-F6-AP14 (South Wing, SW corner)
  
  Ch 95 (320 MHz): 5 APs
    • MUM-F6-AP03 (North Wing, center-E)
    • MUM-F6-AP06 (Center Wing, E side)
    • MUM-F6-AP09 (Center Wing, center-W)
    • MUM-F6-AP12 (South Wing, E side)
    • MUM-F6-AP15 (South Wing, S wall)

Spatial Reuse:
  • Same-channel APs separated by ≥30 meters (minimize overlap)
  • Example: AP01 (Ch 31, NW) and AP04 (Ch 31, center) are 40m apart ✓

Co-Channel Overlap:
  • Target: <10% (client rarely sees 2 APs on same channel with RSSI >-70 dBm)
  • Actual: 8% (Ekahau simulation) ✓
```

---

### 13.4.2 Dynamic Channel Assignment (RRM)

**DNAC RRM (Radio Resource Management):**

```yaml
RRM Overview:
  • Purpose: Automatically adjust AP channels/power to optimize RF
  • Trigger: Every 10 minutes (default), or on-demand via DNAC
  • Algorithm: AI-based (DNAC AI Network Analytics)

RRM Inputs (Telemetry):
  • Channel utilization (% airtime used)
  • Client count per AP
  • Interference (non-WiFi sources)
  • Neighbor AP RSSI (detect overlapping coverage)
  • Throughput per client

RRM Actions:
  1. Channel Change: Move AP from congested channel to cleaner channel
     Example: AP04 on Ch 31 (65% utilization) → Ch 127 (25% utilization)
  
  2. Transmit Power Adjustment: Reduce power if too many clients from one AP
     Example: AP08 power 20 dBm → 17 dBm (reduce cell size)
  
  3. Load Balancing: Steer clients from busy AP to idle AP
     Example: AP01 has 25 clients, AP02 has 5 clients → Move 10 clients to AP02

RRM Configuration (DNAC):
  DNAC → Provision → Wireless → Advanced
  • Dynamic Channel Assignment (DCA): Enabled ✓
  • DCA Interval: 10 minutes (default)
  • DCA Sensitivity: Medium (balance stability vs optimization)
  • Transmit Power Control (TPC): Enabled ✓
  • TPC Threshold: -70 dBm (target RSSI for cell edge)
  • Load Balancing: Enabled (move clients if AP >20 clients)

RRM Best Practices:
  • Monitor RRM changes in DNAC logs (detect frequent channel flapping)
  • Disable RRM during large events (conference, all-hands meeting)
  • Use "RRM Hold" for critical APs (e.g., auditorium AP stays on Ch 31)
```

---

## 13.5 Capacity Planning

### 13.5.1 Throughput Budgeting

**Per-Client Throughput Calculation:**

```yaml
Client: Executive Laptop (WiFi 7, Intel BE200, 2×2:2 MIMO)

PHY Rate (Physical Layer):
  • 6 GHz, 320 MHz, 4096-QAM, 2×2 MIMO, MLO
  • PHY Rate: 5,764 Mbps (from 802.11be spec)

MAC Efficiency (Medium Access Control Overhead):
  • Ideal: 100% (no overhead)
  • Realistic: 70% (OFDMA, frame overhead, retransmissions)
  • Effective Throughput: 5,764 × 0.70 = 4,035 Mbps ≈ 4 Gbps ✓

Application Layer Throughput (TCP/IP):
  • TCP Overhead: ~5% (headers, acknowledgments)
  • Application Throughput: 4,035 × 0.95 = 3,833 Mbps ≈ 3.8 Gbps
  • Measured (iPerf3): 3.6-4.2 Gbps (matches calculation) ✓

Shared Medium (Multiple Clients):
  • 1 Client: 4 Gbps (full AP capacity available)
  • 5 Clients: 4 Gbps / 5 = 800 Mbps per client (contention)
  • 15 Clients: 4 Gbps / 15 = 267 Mbps per client (saturated)
  
Recommendation:
  • Max 15 clients per AP (maintain >250 Mbps per client minimum)
  • Preferred: 10 clients per AP (maintain >400 Mbps per client)
```

**Aggregate Floor Throughput:**

```yaml
Floor: Mumbai Floor 6 (15 APs)

Peak Throughput (All APs):
  • 15 APs × 4 Gbps = 60 Gbps aggregate ✓
  • Client Count: 100 clients (80 executives + 20 guests)
  • Per-Client Average: 60 Gbps / 100 = 600 Mbps per client (comfortable)

Fabric Uplink Validation:
  • AP Uplink: 10 Gbps (mGig, Cat6A)
  • 15 APs → 2 Fabric Edge Switches (C9300)
  • Per Switch: 7-8 APs × 10 Gbps = 70-80 Gbps potential
  • Switch Uplink to Core: 40 Gbps (4× 10G ports, port-channel)
  • Utilization: 60 Gbps / 40 Gbps = 150% oversubscription (acceptable burst)

Result: Floor 6 has sufficient WiFi + fabric capacity ✓
```

---

### 13.5.2 Client Density Planning

**Executive Floor (Mumbai Floor 6):**

```yaml
User Types:
  • 80 Executives (C-suite, VPs, Directors)
  • 20 Guests (visitors, contractors)
  • Total: 100 concurrent clients (peak, 10 AM - 2 PM)

Client Distribution:
  • Private Offices: 60 executives (1-2 per office)
  • Open Collaboration Area: 20 executives + 20 guests
  • Conference Rooms: 5 executives (video calls)

AP Loading (15 APs):
  • Average: 100 clients / 15 APs = 6.7 clients per AP ✓ (comfortable)
  • Peak AP (Collaboration Area): MUM-F6-AP08 = 18 clients (acceptable)
  • Minimum AP (Private Office Wing): MUM-F6-AP03 = 3 clients

Hotspot Analysis:
  • Collaboration Area (3 APs: AP07, AP08, AP09): 40 clients
  • Load per AP: 40 / 3 = 13.3 clients per AP (healthy)
  • Throughput: 4 Gbps / 13.3 = 300 Mbps per client (acceptable)

Growth Planning (20% headroom):
  • Current: 100 clients
  • Future (3 years): 120 clients (+20%)
  • Future Load: 120 / 15 = 8 clients per AP (still comfortable)
  • Result: No additional APs needed for 3-year growth ✓
```

---

## 13.6 Interference Management

### 13.6.1 Co-Channel Interference Mitigation

**6 GHz Advantage: Clean Spectrum**

```yaml
Traditional 5 GHz Problems (Pre-Phase 5):
  • Legacy WiFi 4/5/6 interference (neighboring buildings)
  • Radar detection (DFS channels, causes channel changes)
  • Microwave ovens, Bluetooth, Zigbee (2.4 GHz bleed-over)

6 GHz Benefits:
  • No legacy WiFi interference (WiFi 7-only band)
  • No DFS/radar (PSC channels always available)
  • No 2.4 GHz devices (separate spectrum)

Abhavtech 6 GHz Spectrum Scan (Ekahau):
  • Non-WiFi Interference: 0% (clean spectrum) ✓
  • Neighboring Networks: 0 APs detected (clean building)
  • Co-Channel (Abhavtech APs): 8% overlap (acceptable)

Result: 6 GHz provides interference-free environment ✓
```

**Co-Channel Mitigation Strategies:**

```yaml
Strategy 1: Channel Reuse Pattern
  • Use 3 non-overlapping channels (Ch 31, 63, 95)
  • Spatially separate same-channel APs by ≥30m
  • Result: <10% co-channel overlap ✓

Strategy 2: OFDMA (Orthogonal Frequency Division Multiple Access)
  • WiFi 7 feature: Allocate different sub-carriers to different clients
  • Benefit: Multiple clients on same channel, minimal interference
  • Abhavtech: Enabled by default on all WiFi 7 APs ✓

Strategy 3: Multi-RU (Resource Unit Allocation)
  • WiFi 7 enhancement: Allocate non-contiguous RUs to single client
  • Benefit: Avoid interference on specific sub-carriers
  • Example: Client gets RU 1-4, 9-12 (skip RU 5-8 if interference)

Strategy 4: RRM Dynamic Channel Assignment
  • DNAC RRM detects high channel utilization
  • Auto-moves AP to cleaner channel (e.g., Ch 31 → Ch 127)
  • Abhavtech: RRM enabled, 10-minute interval ✓

Strategy 5: Transmit Power Reduction
  • Lower AP power = smaller cell size = less overlap
  • DNAC TPC (Transmit Power Control): Auto-adjusts power
  • Example: AP08 power reduced 20 dBm → 17 dBm (reduce overlap with AP07)
```

---

### 13.6.2 Adjacent Channel Interference

**320 MHz Challenge: Limited Non-Overlapping Channels**

```yaml
Problem:
  • Only 3 non-overlapping 320 MHz channels (Ch 31, 63, 95)
  • 15 APs on Floor 6 → 5 APs per channel (channel reuse required)

Adjacent Channel Interference (ACI):
  • Definition: Interference from adjacent frequency channels
  • 320 MHz: Minimal ACI (channels well-separated: 320 MHz apart)
  • Example: Ch 31 (5,955-6,275 MHz) vs Ch 63 (6,275-6,595 MHz)
    → 0 MHz overlap (perfect separation) ✓

Practical Impact:
  • Adjacent channel interference: <1% (negligible)
  • Co-channel interference: 8% (managed via spatial reuse)
  • Total interference: ~9% (acceptable, target <10%) ✓

Fallback Strategy (If Interference Detected):
  • Reduce channel width: 320 MHz → 160 MHz
  • Benefit: 6 non-overlapping channels (Ch 5, 21, 37, 53, 69, 85)
  • Trade-off: 50% throughput reduction (4 Gbps → 2 Gbps)
  • Abhavtech Decision: Maintain 320 MHz (interference not an issue) ✓
```

---

## 13.7 Validation Testing

### 13.7.1 Coverage Validation

**Post-Deployment Coverage Test:**

```yaml
Test Procedure:
  • Tool: Ekahau Sidekick 2 + Ekahau Survey App
  • Walk: Entire floor at 2 mph (simulate user movement)
  • Record: RSSI, SNR, AP association (every 1 second)
  • Duration: 60 minutes (Mumbai Floor 6, 20,000 sq ft)

Target Metrics:
  • RSSI ≥-67 dBm: 95% of floor area
  • SNR ≥25 dB: 90% of floor area (required for 4096-QAM)
  • Dual AP Coverage: 80% (redundancy, any location sees 2+ APs)

Actual Results (Mumbai Floor 6):
  • RSSI ≥-67 dBm: 97% ✓ (exceeded target)
  • RSSI ≥-60 dBm: 78% (excellent coverage)
  • SNR ≥25 dB: 93% ✓
  • Dual AP Coverage: 85% ✓

Coverage Gaps Identified:
  1. Elevator Core (SW corner): RSSI -78 dBm (unacceptable)
     → Remediation: Add MUM-F6-AP16 (new AP, 10 ft from elevator)
  
  2. Metal Server Closet (IDF-6S): RSSI -85 dBm (RF blackout)
     → Remediation: Accept (no WiFi needed in server closet)
  
  3. Conference Room MUM-F6-CONF-03 (back wall): RSSI -71 dBm (marginal)
     → Remediation: Relocate AP12 5 feet closer to conference room

Post-Remediation Re-Survey:
  • RSSI ≥-67 dBm: 99% ✓ (after adding AP16 + moving AP12)
  • Coverage Gaps: <1% (elevator core, server closet only)
```

---

### 13.7.2 Throughput Validation

**iPerf3 Throughput Test (Sample Points):**

```yaml
Test Setup:
  • Client: Dell Latitude 7450 (WiFi 7, Intel BE200)
  • Server: iPerf3 server on fabric network (10.252.80.10)
  • Protocol: TCP (downstream, 60-second test)
  • Sample Points: 10 locations across Floor 6

Sample Point Results:

Location 1: North Wing Office (near AP01)
  • RSSI: -58 dBm (excellent)
  • PHY Rate: 5,764 Mbps (MLO, 320 MHz)
  • iPerf3: 4.5 Gbps ✓ (target: >4 Gbps)

Location 2: Collaboration Area (between AP07 and AP08)
  • RSSI: -65 dBm (good)
  • PHY Rate: 5,764 Mbps
  • iPerf3: 4.2 Gbps ✓

Location 3: Conference Room CONF-01 (near AP05)
  • RSSI: -62 dBm (excellent)
  • PHY Rate: 5,764 Mbps
  • iPerf3: 4.4 Gbps ✓

Location 4: Private Office (far from AP, -68 dBm)
  • RSSI: -68 dBm (marginal)
  • PHY Rate: 4,324 Mbps (lower modulation, 1024-QAM)
  • iPerf3: 3.8 Gbps ⚠️ (below target, acceptable)

Location 5: SW Corner (AP16 coverage, post-remediation)
  • RSSI: -64 dBm (good)
  • PHY Rate: 5,764 Mbps
  • iPerf3: 4.3 Gbps ✓

Summary (10 Sample Points):
  • Mean Throughput: 4.15 Gbps ✓
  • Min Throughput: 3.6 Gbps (Location 8, far corner)
  • Max Throughput: 4.6 Gbps (Location 1, near AP)
  • Success Rate: 90% meet >4 Gbps target ✓

Action Items:
  • Location 8 (3.6 Gbps): Add AP17 to improve coverage
  • All other locations: No action needed (meet targets) ✓
```

---

## 13.8 RF Design Summary

### 13.8.1 Design Validation Checklist

**Mumbai Floor 6 RF Design Sign-Off:**

```yaml
☑ Coverage Requirements:
  ✓ RSSI ≥-67 dBm: 99% of floor area (target: 95%)
  ✓ SNR ≥25 dB: 93% of floor area (target: 90%)
  ✓ Dual AP coverage: 85% (target: 80%)

☑ Capacity Requirements:
  ✓ Throughput >4 Gbps: 90% of sample points (target: 85%)
  ✓ Client density: 6.7 clients/AP average (target: <15)
  ✓ Aggregate throughput: 60 Gbps (15 APs × 4 Gbps)

☑ Interference Management:
  ✓ Co-channel overlap: 8% (target: <10%)
  ✓ Non-WiFi interference: 0% (6 GHz clean spectrum)
  ✓ Channel plan: 3-channel reuse (Ch 31, 63, 95)

☑ Redundancy:
  ✓ AP count: 15 APs (1 per 1,333 sq ft)
  ✓ Dual AP coverage: 85% of floor area
  ✓ MLO enabled: 100% of APs (5 GHz + 6 GHz)

☑ Aesthetics:
  ✓ Ceiling-mount: 100% (concealed in drop ceiling)
  ✓ Cabling: Hidden above ceiling (no visible cables)
  ✓ AP color: White (matches ceiling tiles)

☑ Future-Proofing:
  ✓ Capacity headroom: 20% (100 → 120 clients supported)
  ✓ Uplink capacity: 10 Gbps per AP (sufficient for 3-5 years)
  ✓ Modular design: Easy to add APs if needed

Overall Assessment: ✅ PASS - RF Design Meets All Requirements
Sign-Off: Network Architect, Facilities Manager, IT Director
Date: Week 8 (End of Pilot Phase)
```

---

### 13.8.2 Lessons Learned & Best Practices

**Key Insights from Phase 5A Pilot:**

```yaml
1. Predictive Surveys Are Accurate (±5% RSSI)
   • Ekahau predictive model: 97% coverage
   • Actual validation survey: 97% coverage
   • Lesson: Trust predictive tools, validate post-deployment

2. 6 GHz Requires 20% Denser Deployment
   • WiFi 6 (5 GHz): 1 AP per 2,000 sq ft
   • WiFi 7 (6 GHz): 1 AP per 1,333 sq ft
   • Lesson: Budget for 50% more APs when migrating to 6 GHz

3. Glass Walls Attenuate 6 GHz Significantly
   • Standard glass: 2 dB
   • Low-E coated glass: 6 dB (common in modern buildings)
   • Lesson: Survey glass-walled areas carefully, may need extra APs

4. MLO Is Essential for Reliability
   • 6 GHz-only: 15% of locations have marginal RSSI (<-70 dBm)
   • MLO (5+6 GHz): 99% of locations covered (5 GHz fallback)
   • Lesson: Always enable MLO, don't rely on 6 GHz alone

5. 320 MHz Channels Deliver Promised Performance
   • Theoretical: 4+ Gbps (per WiFi 7 spec)
   • Actual: 4.15 Gbps average (iPerf3 testing)
   • Lesson: WiFi 7 marketing claims are realistic ✓

6. RRM Should Be Enabled (But Monitored)
   • RRM optimized channels automatically (Ch 31 → Ch 127)
   • Improved throughput 15% (reduced co-channel interference)
   • Lesson: Trust DNAC AI, but review RRM logs weekly

7. User Satisfaction Correlates with RSSI >-65 dBm
   • RSSI >-65 dBm: 95% user satisfaction
   • RSSI -65 to -70 dBm: 85% user satisfaction
   • RSSI <-70 dBm: 60% user satisfaction (complaints)
   • Lesson: Target RSSI >-65 dBm for premium experience
```
