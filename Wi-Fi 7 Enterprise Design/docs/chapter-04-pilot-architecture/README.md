# CHAPTER 4: PILOT SITE SELECTION & ARCHITECTURE DESIGN

## 4.1 Site Selection Methodology

### 4.1.1 Selection Criteria

**Phase 5A Pilot Site Selection Framework:**

Abhavtech evaluated all 19 sites against **6 key criteria** to identify the optimal 4 pilot locations for WiFi 7 validation.

| Criterion | Weight | Rationale |
|-----------|--------|-----------|
| **Use Case Coverage** | 30% | Must validate all 3 use cases (Edge AI, Conference, Executive) |
| **6 GHz Spectrum Availability** | 25% | Full 1200 MHz spectrum = 320 MHz channels (vs EMEA 500 MHz limitation) |
| **Technical Team Proximity** | 20% | On-site network engineers for rapid troubleshooting |
| **User Profile Diversity** | 15% | Mix of executives, engineers, conference rooms, AI cameras |
| **Infrastructure Readiness** | 10% | Existing C9800 WLCs, SD-Access fabric, adequate power/cooling |

---

### 4.1.2 Site Evaluation Scorecard

**Evaluation Matrix (19 Sites Assessed):**

| Site | Use Case Coverage | 6 GHz Spectrum | Tech Team | User Diversity | Infrastructure | **Total Score** | Selected? |
|------|------------------|----------------|-----------|----------------|----------------|-----------------|-----------|
| **Mumbai HQ** | 30/30 (all 3) | 25/25 (1200 MHz) | 20/20 (HQ team) | 15/15 (all types) | 8/10 (minor power issue) | **98/100** | ✅ **YES** |
| **Chennai HQ** | 25/30 (conf + exec) | 25/25 (1200 MHz) | 18/20 (regional team) | 12/15 (mostly office) | 10/10 (ready) | **90/100** | ✅ **YES** |
| **Bangalore Branch** | 15/30 (general office) | 25/25 (1200 MHz) | 15/20 (remote support) | 10/15 (limited diversity) | 5/10 (uplink/power issues) | **70/100** | ✅ **YES** (branch template) |
| **London HQ** | 25/30 (conf + exec) | 12/25 (500 MHz EMEA) | 20/20 (HQ team) | 13/15 (mostly office) | 10/10 (ready) | **80/100** | ✅ **YES** (160 MHz validation) |
| New Jersey HQ | 25/30 | 25/25 | 18/20 | 12/15 | 9/10 | 89/100 | No (Phase 5B-Wave 1) |
| Dallas HQ | 20/30 | 25/25 | 15/20 | 10/15 | 8/10 | 78/100 | No |
| Frankfurt HQ | 20/30 | 12/25 | 18/20 | 10/15 | 9/10 | 69/100 | No |
| Singapore Hub | 18/30 | 25/25 | 10/20 | 10/15 | 7/10 | 70/100 | No |
| Delhi Branch | 12/30 | 25/25 | 8/20 | 8/15 | 6/10 | 59/100 | No |
| Tokyo Branch | 10/30 | 25/25 | 5/20 | 8/15 | 7/10 | 55/100 | No |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Selected Sites:**
1. **Mumbai HQ** (98/100) - Primary pilot site, all 3 use cases
2. **Chennai HQ** (90/100) - Conference + Executive validation
3. **London HQ** (80/100) - EMEA 160 MHz validation
4. **Bangalore Branch** (70/100) - Branch rollout template, infrastructure upgrade validation

---

### 4.1.3 Geographic & Regulatory Coverage

**Pilot Site Distribution:**

```
APAC Region (India):
  ├─ Mumbai HQ (Primary) - 50 WiFi 7 APs
  ├─ Chennai HQ - 30 WiFi 7 APs
  └─ Bangalore Branch - 10 WiFi 7 APs
  
  Spectrum: Full 1200 MHz (5.925-7.125 GHz)
  Channels: 3× 320 MHz (Ch 31, 63, 95)
  
EMEA Region (UK):
  └─ London HQ - 25 WiFi 7 APs
  
  Spectrum: Limited 500 MHz (5.945-6.425 GHz)
  Channels: 2× 160 MHz (Ch 31, 63) ⚠️
  
Coverage:
  ✅ India regulatory environment (WPC approval)
  ✅ EMEA regulatory environment (CE/Ofcom approval)
  ✅ 320 MHz performance validation (India)
  ✅ 160 MHz performance validation (EMEA)
```

---

## 4.2 Mumbai HQ Pilot Design (50 APs)

### 4.2.1 Site Overview

**Mumbai HQ Profile:**

| Attribute | Value |
|-----------|-------|
| **Building** | 5 floors, 100,000 sq ft total |
| **Users** | 2,200 employees |
| **Current WiFi APs** | 180 (25 WiFi 6E, 95 WiFi 6, 60 WiFi 5) |
| **Current Wired Ports** | 2,016 (42 access switches) |
| **Pilot Scope** | Floors 2, 3, 6 (3 of 5 floors) |
| **WiFi 7 AP Deployment** | **50 APs** |
| **Primary Use Cases** | All 3: Edge AI cameras (Floor 3), Conference rooms (Floor 2), Executive wireless-only (Floor 6) |

---

### 4.2.2 Floor 6: Executive Wireless-Only Workspace (15 APs)

**Floor Profile:**

```yaml
Floor 6 - Executive Floor:
  Size: 20,000 sq ft
  Layout: Open workspace + private offices
  Users: 80 executives (C-suite, VPs, directors)
  Current WiFi: 10 WiFi 6E APs (insufficient density for WiFi 7)
  Current Wired: 180 Ethernet ports (6 access switches)
  
WiFi 7 Goal:
  • 100% wireless-only workspace (no Ethernet at desks)
  • >4 Gbps throughput per executive
  • <10ms latency (VDI, cloud apps)
  • Multi-device support (laptop + iPad + iPhone)
```

**AP Placement Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MUMBAI HQ - FLOOR 6 (Executive)                  │
│                         20,000 sq ft                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  North Wing - Open Workspace (40 executives)                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │   [AP-01]      [AP-02]      [AP-03]      [AP-04]      [AP-05]│ │
│  │   Ch 31        Ch 63        Ch 95        Ch 31        Ch 63   │ │
│  │   320 MHz      320 MHz      320 MHz      320 MHz      320 MHz │ │
│  │     •            •            •            •            •     │ │
│  │                                                               │ │
│  │   Executive    Executive    Executive    Executive    Executive│
│  │   Desks 1-8    Desks 9-16   Desks 17-24  Desks 25-32  Desks 33-40│
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Center - Board Room + Meeting Rooms                                │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │          [AP-06]        Board Room        [AP-07]            │ │
│  │          Ch 95          (40 seats)        Ch 31              │ │
│  │          320 MHz                          320 MHz            │ │
│  │            •                                •                │ │
│  │                                                               │ │
│  │   [AP-08]           Executive             [AP-09]            │ │
│  │   Ch 63             Meeting Rooms         Ch 95              │ │
│  │   320 MHz           (4 rooms, 8-seat)     320 MHz            │ │
│  │     •                                       •                │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  South Wing - Private Offices (40 executives)                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │   [AP-10]      [AP-11]      [AP-12]      [AP-13]      [AP-14]│ │
│  │   Ch 31        Ch 63        Ch 95        Ch 31        Ch 63   │ │
│  │   320 MHz      320 MHz      320 MHz      320 MHz      320 MHz │ │
│  │     •            •            •            •            •     │ │
│  │                                                               │ │
│  │   C-Suite      VP Offices   VP Offices   Director     Director│
│  │   Offices      (8 offices)  (8 offices)  Offices      Offices │
│  │   (8 offices)                            (8 offices)  (8 offices)│
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  West Wing - Collaboration Spaces                                  │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │               [AP-15]           Collaboration               │ │
│  │               Ch 95             Lounge + Pantry             │ │
│  │               320 MHz           (Casual meetings)           │ │
│  │                 •                                             │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AP Summary: 15 APs                                                │
│  • Channel 31 (320 MHz): 5 APs                                     │
│  • Channel 63 (320 MHz): 5 APs                                     │
│  • Channel 95 (320 MHz): 5 APs                                     │
│  • AP Density: 1 AP per 1,333 sq ft (vs 1 per 2,000 sq ft WiFi 6)│
│  • Clients per AP: 5-6 executives (low density for high throughput)│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Configuration Details:**

```yaml
AP Configuration (Per AP):

AP Model: Catalyst 9178I-BE
Mounting: Ceiling (T-bar), 9 ft height
Uplink: 10G SFP+ to fabric edge switch
Power: PoE injector (PWR-IE170W-PC-AC, 60W)

Radio Configuration:
  2.4 GHz Radio:
    Status: Disabled (recommend for high-density, avoid interference)
    
  5 GHz Radio:
    Status: Enabled (MLO backup link)
    Channel: Auto-DCA (160 MHz)
    Power: 17 dBm
    Role: MLO Link 0 (backup)
    
  6 GHz Radio:
    Status: Enabled (MLO primary link)
    Channel: Manual (Ch 31/63/95, 320 MHz)
    Power: 17 dBm
    Role: MLO Link 1 (primary)

SSID Configuration:
  Corp-Secure-7 (WiFi 7):
    Security: WPA3-Enterprise
    Authentication: 802.1X (EAP-TLS preferred, PEAP-MSCHAPv2 fallback)
    Fast Transition (802.11r): Enabled
    MLO: Enabled (NSTR mode)
    Radio Policy: 6 GHz Preferred
    QoS: Platinum (highest priority)
    
  Corp-Secure (WiFi 6, legacy):
    Status: Enabled (for non-WiFi 7 clients)
    Radios: 5 GHz only
```

**Wired Infrastructure Changes:**

```yaml
Pre-WiFi 7:
  • 6 access switches (Catalyst 9300-48P)
  • 180 Ethernet ports active (executive desks, printers, phones)
  • 108 ports unused/spare
  
Post-WiFi 7 (Week 12):
  • 80 executives migrate to wireless-only
  • 80 wired ports freed
  • 20 ports remain wired (printers, IP phones, conference room equipment)
  • 80 ports unused (67% reduction from 108 to 188 unused)
  
Switch Consolidation:
  • Consolidate 6 switches → 3 switches (Week 13)
  • Decommission 3 switches (144 ports)
  • Result: 3 switches, 144 ports (60 active + 84 spare)
```

---

### 4.2.3 Floor 3: Edge AI Camera Wireless Infrastructure (10 APs)

**Floor Profile:**

```yaml
Floor 3 - West Wing (Edge AI Zone):
  Size: 15,000 sq ft (partial floor deployment)
  Layout: Open office + Edge AI camera coverage area
  Users: 150 employees (engineering team)
  Edge AI Cameras: 20 cameras (4K, WiFi 7)
  AI Inference: UCS XE9305 edge cluster (2× NVIDIA L4 GPUs)
  
WiFi 7 Goal:
  • <10ms latency (camera → inference)
  • 100-150 Mbps per camera (4K H.265 video + AI metadata)
  • 99.98% uptime (MLO failover)
  • Dedicated 6 GHz channel for cameras (Ch 31)
```

**AP Placement Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MUMBAI HQ - FLOOR 3 (Edge AI Zone)               │
│                         15,000 sq ft (West Wing)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Edge AI Camera Coverage Area (Perimeter + Interior)                │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │   Camera Deployment: 20× AI Cameras (4K, WiFi 7)             │ │
│  │   Use Cases: Facial recognition, PPE detection, perimeter    │ │
│  │                                                               │ │
│  │   [AP-01]                                          [AP-02]    │ │
│  │   Ch 31 (Cameras)                                  Ch 31      │ │
│  │   320 MHz                                          320 MHz    │ │
│  │     •                                                •        │ │
│  │     ↓ WiFi 7                                         ↓        │ │
│  │   📷 📷 📷 📷 📷                                    📷 📷 📷 📷 📷│ │
│  │   (5 cameras)                                      (5 cameras)│ │
│  │   Perimeter (North)                                Perimeter (East)│
│  │                                                               │ │
│  │                                                               │ │
│  │   [AP-03]          UCS XE9305                      [AP-04]    │ │
│  │   Ch 31            Edge AI Cluster                 Ch 31      │ │
│  │   320 MHz          (2× L4 GPUs)                    320 MHz    │ │
│  │     •              ┌─────────────┐                   •        │ │
│  │     ↓              │ Inference   │                   ↓        │ │
│  │   📷 📷 📷 📷 📷    │ <8ms latency│                 📷 📷 📷 📷 📷│ │
│  │   (5 cameras)      └─────────────┘                 (5 cameras)│ │
│  │   Interior Aisles                                  Perimeter (South)│
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  General Office Area (150 users)                                   │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │   [AP-05]          [AP-06]          [AP-07]                  │ │
│  │   Ch 63            Ch 95            Ch 63                    │ │
│  │   320 MHz          320 MHz          320 MHz                  │ │
│  │     •                •                •                      │ │
│  │                                                               │ │
│  │   Engineering       Engineering      Engineering             │ │
│  │   Desks (50 users)  Desks (50 users) Desks (50 users)       │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Conference Rooms                                                  │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │   [AP-08]                    [AP-09]          [AP-10]        │ │
│  │   Ch 95                      Ch 31            Ch 63          │ │
│  │   320 MHz                    320 MHz          320 MHz        │ │
│  │     •                          •                •            │ │
│  │                                                               │ │
│  │   Meeting Room 1             Meeting Room 2   Meeting Room 3 │ │
│  │   (12-seat)                  (8-seat)         (8-seat)       │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AP Summary: 10 APs                                                │
│  • Channel 31 (320 MHz): 5 APs (dedicated for 20 cameras)         │
│  • Channel 63 (320 MHz): 3 APs (general office)                   │
│  • Channel 95 (320 MHz): 2 APs (general office + conference)      │
│  • Camera-to-AP ratio: 4-5 cameras per AP (optimal for <10ms)     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Edge AI Camera Configuration:**

```yaml
Camera Model: Axis P3265-LVE (or equivalent WiFi 7-enabled)

Network Configuration:
  SSID: Corp-Secure-7
  Authentication: 802.1X (EAP-TLS, device certificate)
  SGT: 70 (Cameras)
  Virtual Network: VN_IOT
  VLAN: IOT-MUM-CAMERAS (10.150.1.128/25)
  
WiFi Configuration:
  Preferred Band: 6 GHz (Ch 31)
  Channel Width: 320 MHz
  MLO: Enabled (Link 0: 5 GHz backup, Link 1: 6 GHz primary)
  
Video Stream:
  Resolution: 4K (3840×2160) @ 30fps
  Codec: H.265 (HEVC)
  Bitrate: 8-12 Mbps (variable)
  AI Metadata: 2-5 Mbps (object detection, tracking)
  Total Bandwidth: 10-17 Mbps per camera
  
QoS Marking:
  Video Stream: DSCP CS5 (40) - Critical Video
  AI Metadata: DSCP CS6 (48) - Network Control
  
Camera-to-Inference Flow:
  1. Camera captures 4K frame (33ms @ 30fps)
  2. WiFi 7 transmission to AP (3-4ms, Ch 31 320 MHz)
  3. Fabric transit to UCS XE9305 (1-2ms)
  4. AI inference on NVIDIA L4 GPU (2-3ms)
  Total: 8-12ms ✓ (Target: <10ms)
```

**Channel Isolation Strategy:**

```yaml
Channel 31 (320 MHz): DEDICATED for AI Cameras
  • APs: AP-01, AP-02, AP-03, AP-04 (4 APs)
  • Clients: 20 AI cameras ONLY
  • Rationale: Cameras require consistent low latency (<10ms)
  • No general office clients on Ch 31 (avoid QoS contention)
  
Channels 63 & 95: General Office + Conference
  • APs: AP-05, AP-06, AP-07, AP-08, AP-09, AP-10 (6 APs)
  • Clients: 150 engineering laptops, tablets
  • Mixed use: Office work + occasional video conferencing
```

---

### 4.2.4 Floor 2: Conference Room Wireless Collaboration (15 APs)

**Floor Profile:**

```yaml
Floor 2 - Conference Center:
  Size: 25,000 sq ft
  Layout: 25 conference rooms (various sizes)
  Users: 150 concurrent (peak utilization)
  Current WiFi: 15 WiFi 6 APs (insufficient for wireless presentation)
  
WiFi 7 Goal:
  • <20ms screen sharing latency (AirPlay, Miracast, Webex)
  • 15-20 concurrent video streams per AP
  • Support 100% wireless conference rooms (no HDMI cables)
```

**AP Placement Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                  MUMBAI HQ - FLOOR 2 (Conference Center)            │
│                         25,000 sq ft                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Large Conference Rooms (6 rooms, 20-40 person capacity)           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │   Room A           Room B           Room C                    │ │
│  │   (40-seat)        (40-seat)        (30-seat)                 │ │
│  │   [AP-01]          [AP-02]          [AP-03]                   │ │
│  │   Ch 31            Ch 63            Ch 95                     │ │
│  │   320 MHz          320 MHz          320 MHz                   │ │
│  │     •                •                •                       │ │
│  │   AppleTV 4K       AppleTV 4K       AppleTV 4K               │ │
│  │   + Webex RoomKit  + Webex RoomKit  + Webex RoomKit          │ │
│  │                                                               │ │
│  │                                                               │ │
│  │   Room D           Room E           Room F                    │ │
│  │   (30-seat)        (20-seat)        (20-seat)                 │ │
│  │   [AP-04]          [AP-05]          [AP-06]                   │ │
│  │   Ch 31            Ch 63            Ch 95                     │ │
│  │   320 MHz          320 MHz          320 MHz                   │ │
│  │     •                •                •                       │ │
│  │   AppleTV 4K       AppleTV 4K       AppleTV 4K               │ │
│  │   + Webex RoomKit  + Webex RoomKit  + Webex RoomKit          │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Medium Conference Rooms (12 rooms, 10-15 person capacity)         │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │   [AP-07]  [AP-08]  [AP-09]  [AP-10]  [AP-11]  [AP-12]      │ │
│  │   Ch 31    Ch 63    Ch 95    Ch 31    Ch 63    Ch 95        │ │
│  │   320 MHz  320 MHz  320 MHz  320 MHz  320 MHz  320 MHz      │ │
│  │     •        •        •        •        •        •          │ │
│  │                                                               │ │
│  │   Each AP covers 2 medium conference rooms                   │ │
│  │   (12 rooms total, 1 AP per 2 rooms)                         │ │
│  │                                                               │ │
│  │   Equipment per room: 55" Display + AppleTV 4K               │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Small Meeting Rooms (7 rooms, 4-6 person capacity)                │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │   [AP-13]                 [AP-14]                 [AP-15]    │ │
│  │   Ch 31                   Ch 63                   Ch 95      │ │
│  │   320 MHz                 320 MHz                 320 MHz    │ │
│  │     •                       •                       •        │ │
│  │                                                               │ │
│  │   Each AP covers 2-3 small rooms + open collaboration area  │ │
│  │   (7 rooms + lounge/pantry)                                  │ │
│  │                                                               │ │
│  │   Equipment: Portable displays + wireless presentation      │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AP Summary: 15 APs                                                │
│  • Channel 31 (320 MHz): 5 APs                                     │
│  • Channel 63 (320 MHz): 5 APs                                     │
│  • Channel 95 (320 MHz): 5 APs                                     │
│  • Clients per AP: 10-15 concurrent (peak load)                    │
│  • Total rooms: 25 conference rooms (100% wireless)                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Wireless Presentation Equipment:**

```yaml
Large Conference Rooms (6 rooms):
  Display: 75" 4K LCD
  Wireless Presentation: AppleTV 4K (WiFi 7)
  Video Conferencing: Webex Room Kit Pro (WiFi 7 backup, wired primary)
  
  AppleTV Configuration:
    SSID: Corp-Secure-7
    Authentication: WPA3-Enterprise (device certificate)
    SGT: 21 (Video endpoints)
    MLO: Enabled
    Preferred Band: 6 GHz (320 MHz)
    
Medium Conference Rooms (12 rooms):
  Display: 55" 4K LCD
  Wireless Presentation: AppleTV 4K (WiFi 7)
  No dedicated video conferencing (laptops use Webex)
  
Small Meeting Rooms (7 rooms):
  Display: 43" 4K LCD (portable)
  Wireless Presentation: Miracast adapter (WiFi 7)
  BYOD: Laptops connect directly via AirPlay/Miracast
```

**Expected Performance:**

```yaml
Screen Sharing Latency Test (AirPlay):
  MacBook Pro (WiFi 7) → AppleTV 4K → 75" Display
  
  Test Setup:
    • Content: 4K video with millisecond timer
    • Measurement: High-speed camera (240fps frame-by-frame analysis)
    
  Results:
    • Mean latency: 18ms ✓ (Target: <20ms)
    • 95th percentile: 22ms (acceptable outlier)
    • Jitter (std dev): 3ms (low variability)
    • User perception: "Feels instant"
    
Multi-Stream Conference (20 Participants):
  Scenario: All 20 participants in Webex meeting, cameras on
  
  Test Setup:
    • 20 laptops (WiFi 7) in Room A
    • Single AP (AP-01, Ch 31, 320 MHz)
    • Webex meeting: All cameras enabled, 1 person screen sharing
    
  Results:
    • Aggregate throughput: 380 Mbps (downlink from AP)
    • Per-client video quality: 1080p @ 30fps (no degradation)
    • Screen sharing latency: 18ms ✓
    • AP channel utilization: 22% (plenty of headroom)
    • Multi-RU efficiency: 35% better than WiFi 6 single-RU
```

---

### 4.2.5 Mumbai HQ Pilot Summary

**Overall Deployment:**

| Floor | Use Case | APs | Users/Devices | Key Metrics | Success Criteria |
|-------|----------|-----|---------------|-------------|------------------|
| **Floor 6** | Executive wireless-only | 15 | 80 executives | >4 Gbps per client | Executive satisfaction >90% |
| **Floor 3** | Edge AI cameras | 10 | 150 users + 20 cameras | <10ms camera latency | 99.98% camera uptime |
| **Floor 2** | Conference rooms | 15 | 150 concurrent | <20ms screen sharing | Zero HDMI cables needed |
| **Floors 1, 4, 5** | (Not in pilot) | 0 | - | Baseline data collection | Phase 5B planning |
| **TOTAL** | All 3 use cases | **40 APs** | 470 users + 20 cameras | - | All 3 validated |

**Wired Infrastructure Impact:**

| Metric | Pre-WiFi 7 | Post-WiFi 7 (Week 12) | Reduction |
|--------|-----------|---------------------|-----------|
| **Access Switches** | 42 switches | 21 switches | 50% |
| **Wired Ports Active** | 610 ports | 360 ports | 41% |
| **Wired Ports Freed** | - | 250 ports | - |

---

## 4.3 Chennai HQ Pilot Design (30 APs)

### 4.3.1 Site Overview

**Chennai HQ Profile:**

| Attribute | Value |
|-----------|-------|
| **Building** | 4 floors, 80,000 sq ft total |
| **Users** | 1,800 employees |
| **Current WiFi APs** | 130 (20 WiFi 6E, 70 WiFi 6, 40 WiFi 5) |
| **Current Wired Ports** | 1,680 (35 access switches) |
| **Pilot Scope** | Floors 2, 4, 1 (partial) |
| **WiFi 7 AP Deployment** | **30 APs** |
| **Primary Use Cases** | Conference rooms (Floor 2), Executive wireless-only (Floor 4) |

---

### 4.3.2 Floor 2: Conference Center (12 APs)

**Floor Profile:**

```yaml
Floor 2 - Conference Center:
  Size: 20,000 sq ft
  Layout: 18 conference rooms
  Users: 120 concurrent (peak)
  
WiFi 7 Goal:
  • <20ms screen sharing latency
  • Support all 18 rooms with wireless presentation
```

**AP Placement Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 CHENNAI HQ - FLOOR 2 (Conference Center)            │
│                         20,000 sq ft                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Large Conference Rooms (6 rooms, 20-30 person capacity)           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-01]          [AP-02]          [AP-03]                    │ │
│  │   Ch 31            Ch 63            Ch 95                      │ │
│  │   320 MHz          320 MHz          320 MHz                    │ │
│  │     •                •                •                        │ │
│  │   Room A (30-seat) Room B (30-seat) Room C (20-seat)          │ │
│  │                                                               │ │
│  │   [AP-04]          [AP-05]          [AP-06]                    │ │
│  │   Ch 31            Ch 63            Ch 95                      │ │
│  │   320 MHz          320 MHz          320 MHz                    │ │
│  │     •                •                •                        │ │
│  │   Room D (20-seat) Room E (20-seat) Room F (20-seat)          │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Medium Conference Rooms (8 rooms, 10-15 person capacity)          │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-07]          [AP-08]          [AP-09]          [AP-10]  │ │
│  │   Ch 31            Ch 63            Ch 95            Ch 31     │ │
│  │   320 MHz          320 MHz          320 MHz          320 MHz   │ │
│  │     •                •                •                •       │ │
│  │   Rooms G+H        Rooms I+J        Rooms K+L        Rooms M+N│ │
│  │   (2 rooms/AP)     (2 rooms/AP)     (2 rooms/AP)     (2 rooms/AP)│
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Small Meeting Rooms (4 rooms, 4-6 person capacity)                │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-11]                          [AP-12]                     │ │
│  │   Ch 63                            Ch 95                       │ │
│  │   320 MHz                          320 MHz                     │ │
│  │     •                                •                         │ │
│  │   Rooms O+P + Collaboration        Rooms Q+R + Pantry         │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AP Summary: 12 APs                                                │
│  • Channel 31 (320 MHz): 4 APs                                     │
│  • Channel 63 (320 MHz): 4 APs                                     │
│  • Channel 95 (320 MHz): 4 APs                                     │
│  • Coverage: 18 conference rooms (100% wireless)                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 4.3.3 Floor 4: Executive Floor (10 APs)

**Floor Profile:**

```yaml
Floor 4 - Executive Offices:
  Size: 20,000 sq ft
  Layout: Private offices + open workspace
  Users: 60 executives (regional VPs, directors)
  
WiFi 7 Goal:
  • 100% wireless-only workspace
  • >4 Gbps throughput per executive
```

**AP Placement Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 CHENNAI HQ - FLOOR 4 (Executive Offices)            │
│                         20,000 sq ft                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  North Wing - Open Workspace (30 executives)                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-01]          [AP-02]          [AP-03]          [AP-04]  │ │
│  │   Ch 31            Ch 63            Ch 95            Ch 31     │ │
│  │   320 MHz          320 MHz          320 MHz          320 MHz   │ │
│  │     •                •                •                •       │ │
│  │   Exec Desks       Exec Desks       Exec Desks       Exec Desks│
│  │   (8 users)        (8 users)        (7 users)        (7 users) │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  South Wing - Private Offices (30 executives)                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-05]          [AP-06]          [AP-07]          [AP-08]  │ │
│  │   Ch 63            Ch 95            Ch 31            Ch 63     │ │
│  │   320 MHz          320 MHz          320 MHz          320 MHz   │ │
│  │     •                •                •                •       │ │
│  │   VP Offices       VP Offices       Director         Director  │ │
│  │   (8 offices)      (8 offices)      Offices          Offices   │ │
│  │                                     (7 offices)      (7 offices)│ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Center - Executive Meeting Rooms                                  │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-09]                          [AP-10]                     │ │
│  │   Ch 95                            Ch 31                       │ │
│  │   320 MHz                          320 MHz                     │ │
│  │     •                                •                         │ │
│  │   Executive Board Room             Executive Meeting Rooms     │ │
│  │   (30-seat)                        (3 rooms, 8-seat each)      │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AP Summary: 10 APs                                                │
│  • Channel 31 (320 MHz): 4 APs                                     │
│  • Channel 63 (320 MHz): 3 APs                                     │
│  • Channel 95 (320 MHz): 3 APs                                     │
│  • Clients per AP: 6 executives (low density for high throughput)  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 4.3.4 Floor 1: General Office - Baseline Data Collection (8 APs)

**Floor Profile:**

```yaml
Floor 1 - General Office:
  Size: 20,000 sq ft
  Layout: Open office workspace
  Users: 400 employees (engineering, operations)
  
WiFi 7 Goal:
  • Limited pilot deployment (8 APs)
  • Baseline data collection for Phase 5B planning
  • Mix of wired and wireless users
```

**AP Placement Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 CHENNAI HQ - FLOOR 1 (General Office)               │
│                         20,000 sq ft                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Open Office Area (400 users)                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-01]          [AP-02]          [AP-03]          [AP-04]  │ │
│  │   Ch 31            Ch 63            Ch 95            Ch 31     │ │
│  │   320 MHz          320 MHz          320 MHz          320 MHz   │ │
│  │     •                •                •                •       │ │
│  │   North Zone       North Zone       North Zone       North Zone│ │
│  │   (100 users)      (100 users)      (100 users)      (100 users)│
│  │                                                               │ │
│  │                                                               │ │
│  │   [AP-05]          [AP-06]          [AP-07]          [AP-08]  │ │
│  │   Ch 63            Ch 95            Ch 31            Ch 63     │ │
│  │   320 MHz          320 MHz          320 MHz          320 MHz   │ │
│  │     •                •                •                •       │ │
│  │   South Zone       South Zone       South Zone       South Zone│ │
│  │   (optional pilot, limited coverage for baseline data)        │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Note: This is a LIMITED pilot deployment on Floor 1               │
│  • Purpose: Baseline data collection                               │
│  • Not full floor coverage (Phase 5B will add 15 more APs)        │
│  • Mix of wireless and wired users (voluntary WiFi 7 adoption)     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 4.3.5 Chennai HQ Pilot Summary

**Overall Deployment:**

| Floor | Use Case | APs | Users/Devices | Key Metrics | Success Criteria |
|-------|----------|-----|---------------|-------------|------------------|
| **Floor 2** | Conference rooms | 12 | 120 concurrent (18 rooms) | <20ms screen sharing | All 18 rooms wireless |
| **Floor 4** | Executive wireless-only | 10 | 60 executives | >4 Gbps per client | Executive satisfaction >90% |
| **Floor 1** | General office (baseline) | 8 | 400 users (mixed) | Baseline data | Plan Phase 5B rollout |
| **TOTAL** | Mixed use cases | **30 APs** | 580 users | - | Conference + Executive validated |

---

## 4.4 Bangalore Branch Pilot Design (10 APs)

### 4.4.1 Site Overview

**Bangalore Branch Profile:**

| Attribute | Value |
|-----------|-------|
| **Building** | 2 floors, 15,000 sq ft total |
| **Users** | 200 employees (engineering, sales) |
| **Current WiFi APs** | 20 (8 WiFi 6, 12 WiFi 5 legacy) |
| **Current Wired Ports** | 192 (4 access switches) |
| **Pilot Scope** | Full branch (both floors) |
| **WiFi 7 AP Deployment** | **10 APs** |
| **Primary Use Case** | Small-scale wireless-first validation, branch rollout template |

---

### 4.4.2 Full Branch Design

**Floor 1 Design (5 APs):**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 BANGALORE BRANCH - FLOOR 1                          │
│                 7,500 sq ft (Engineering + Sales)                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Open Office Area (100 users)                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-01]          [AP-02]          [AP-03]                    │ │
│  │   Ch 31            Ch 63            Ch 95                      │ │
│  │   320 MHz          320 MHz          320 MHz                    │ │
│  │     •                •                •                        │ │
│  │   Engineering      Engineering      Engineering               │ │
│  │   (30 users)       (35 users)       (35 users)                │ │
│  │                                                               │ │
│  │   [AP-04]                          [AP-05]                     │ │
│  │   Ch 31                            Ch 63                       │ │
│  │   320 MHz                          320 MHz                     │ │
│  │     •                                •                         │ │
│  │   Sales + Meeting Rooms            Collaboration + Pantry     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AP Summary (Floor 1): 5 APs                                       │
│  • Channel 31: 2 APs, Channel 63: 2 APs, Channel 95: 1 AP         │
│  • Users: 100 per floor                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Floor 2 Design (5 APs):**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 BANGALORE BRANCH - FLOOR 2                          │
│                 7,500 sq ft (Operations + Conference Rooms)         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Open Office + Conference Rooms (100 users, 3 conference rooms)    │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-06]          [AP-07]          [AP-08]                    │ │
│  │   Ch 95            Ch 31            Ch 63                      │ │
│  │   320 MHz          320 MHz          320 MHz                    │ │
│  │     •                •                •                        │ │
│  │   Operations       Operations       Operations + Conf Room A  │ │
│  │   (30 users)       (35 users)       (20 users + 12-seat room) │ │
│  │                                                               │ │
│  │   [AP-09]                          [AP-10]                     │ │
│  │   Ch 95                            Ch 31                       │ │
│  │   320 MHz                          320 MHz                     │ │
│  │     •                                •                         │ │
│  │   Conf Rooms B+C                   Management Offices + Pantry│ │
│  │   (2 rooms, 8-seat each)           (15 users)                 │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AP Summary (Floor 2): 5 APs                                       │
│  • Channel 31: 2 APs, Channel 63: 1 AP, Channel 95: 2 APs         │
│  • Users: 100 per floor                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 4.4.3 Bangalore Branch Unique Value

**Why Bangalore Branch Selected:**

✅ **Branch Rollout Template**: Full branch deployment validates Phase 5B rollout strategy for 30 branch sites  
✅ **Infrastructure Upgrade Validation**: Tests 10G uplink upgrade, power circuit addition, cooling expansion  
✅ **Remote Management**: No on-site network engineers (2 hours from Mumbai HQ) tests remote troubleshooting  
✅ **Cost Model**: Provides actual data for branch site economics (WiFi 7 APs vs wired switch refresh)  

**Expected Outcomes:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Wireless Adoption** | 70% of users wireless-only | User surveys + port utilization |
| **Wired Port Reduction** | 192 → 80 ports (58% reduction) | Switch port counts |
| **Access Switch Decommission** | 4 → 2 switches (2 decommissioned) | Physical removal |
| **User Satisfaction** | >85% | Post-pilot survey |
| **Remote Troubleshooting** | 90% issues resolved remotely | NOC incident logs |

---

### 4.4.4 Bangalore Branch Summary

**Overall Deployment:**

| Floor | APs | Users | Key Validation | Success Criteria |
|-------|-----|-------|----------------|------------------|
| **Floor 1** | 5 | 100 | Wireless-first engineering | >70% wireless adoption |
| **Floor 2** | 5 | 100 | Conference rooms + operations | Remote mgmt successful |
| **TOTAL** | **10** | **200** | Branch template validated | All metrics achieved |

**Infrastructure Upgrades (Completed Week 1-3):**

| Upgrade | Before | After | Cost | Status |
|---------|--------|-------|------|--------|
| **Uplinks** | 2× 1G | 2× 10G SFP+ | $2,000 | ✅ Week 2 |
| **Power Circuits** | 2× 15A per IDF | 3× 20A per IDF | $4,000 | ✅ Week 2 |
| **Cooling** | 1 ton per IDF | 2 tons per IDF | $6,000 | ✅ Week 3 |

---

## 4.5 London HQ Pilot Design (25 APs)

### 4.5.1 Site Overview

**London HQ Profile:**

| Attribute | Value |
|-----------|-------|
| **Building** | 5 floors, 100,000 sq ft total |
| **Users** | 2,200 employees |
| **Current WiFi APs** | 155 (25 WiFi 6E, 80 WiFi 6, 50 WiFi 5) |
| **Current Wired Ports** | 2,016 (42 access switches) |
| **Pilot Scope** | Floors 2-3 (executive + conference) |
| **WiFi 7 AP Deployment** | **25 APs** |
| **Primary Use Case** | Executive wireless-only, 160 MHz validation (EMEA spectrum limit) |

**CRITICAL DIFFERENCE: London uses 160 MHz (not 320 MHz) due to EMEA 6 GHz spectrum limitation (500 MHz vs 1200 MHz in India)**

---

### 4.5.2 Floor 2: Executive Floor - 160 MHz Configuration (12 APs)

**Floor Profile:**

```yaml
Floor 2 - Executive Offices:
  Size: 20,000 sq ft
  Users: 70 executives (EMEA leadership)
  
CRITICAL: EMEA 6 GHz Spectrum Limitation
  • Available: 5.945-6.425 GHz (500 MHz total)
  • 320 MHz channels: NOT possible (insufficient spectrum)
  • 160 MHz channels: Only 2 non-overlapping (Ch 31, 63)
  • Strategy: Alternate Ch 31/63, manage co-channel interference via power control
```

**AP Placement Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 LONDON HQ - FLOOR 2 (Executive Offices)             │
│                         20,000 sq ft                                │
│                    ⚠️ 160 MHz CHANNELS (EMEA LIMITATION)           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Open Workspace + Private Offices (70 executives)                  │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-01]      [AP-02]      [AP-03]      [AP-04]      [AP-05] │ │
│  │   Ch 31        Ch 63        Ch 31        Ch 63        Ch 31    │ │
│  │   160 MHz      160 MHz      160 MHz      160 MHz      160 MHz  │ │
│  │     •            •            •            •            •      │ │
│  │   Exec Desks   Exec Desks   Exec Desks   Exec Desks   Exec Desks│
│  │   (6 users)    (6 users)    (6 users)    (6 users)    (6 users)│ │
│  │                                                               │ │
│  │   [AP-06]      [AP-07]      [AP-08]      [AP-09]      [AP-10] │ │
│  │   Ch 63        Ch 31        Ch 63        Ch 31        Ch 63    │ │
│  │   160 MHz      160 MHz      160 MHz      160 MHz      160 MHz  │ │
│  │     •            •            •            •            •      │ │
│  │   Private      Private      Private      Private      Private  │ │
│  │   Offices      Offices      Offices      Offices      Offices  │ │
│  │   (6-7 each)   (6-7 each)   (6-7 each)   (6-7 each)   (6-7 each)│
│  │                                                               │ │
│  │   [AP-11]                         [AP-12]                     │ │
│  │   Ch 31                           Ch 63                       │ │
│  │   160 MHz                         160 MHz                     │ │
│  │     •                               •                         │ │
│  │   Board Room (40-seat)            Executive Meeting Rooms    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AP Summary: 12 APs                                                │
│  • Channel 31 (160 MHz): 6 APs ⚠️ Co-channel interference managed │
│  • Channel 63 (160 MHz): 6 APs ⚠️ Co-channel interference managed │
│  • Transmit Power: 14 dBm (lower than India's 17 dBm for EMEA regulations)│
│  • Performance: 2-3 Gbps per client (vs 4-5 Gbps in India)        │
│                                                                     │
│  Co-Channel Interference Management:                               │
│  • Alternating channel assignment (Ch 31, 63, 31, 63...)          │
│  • Transmit power control (14 dBm, lower than max 20 dBm)         │
│  • RRM (Radio Resource Management) monitors interference           │
│  • Expected: 15-20% throughput reduction vs ideal (acceptable)     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**160 MHz vs 320 MHz Performance Comparison:**

```yaml
London (160 MHz) vs Mumbai (320 MHz):

Throughput:
  Mumbai (320 MHz): 4.5 Gbps per executive
  London (160 MHz): 2.8 Gbps per executive
  Difference: 38% lower ⚠️ (but still faster than wired 1G)

Latency:
  Mumbai (320 MHz): 8-10ms
  London (160 MHz): 10-12ms
  Difference: 20% higher (still acceptable)

Channel Capacity:
  Mumbai: 3 non-overlapping channels (Ch 31, 63, 95)
  London: 2 non-overlapping channels (Ch 31, 63)
  Impact: More co-channel interference (managed via power control)

Recommendation:
  ✅ 160 MHz sufficient for executive use case (2-3 Gbps > 1 Gbps wired)
  ✅ MLO still provides failover benefit (99.98% uptime)
  ⚠️ Executives may notice slower performance vs Mumbai (survey feedback)
```

---

### 4.5.3 Floor 3: Conference Rooms - 160 MHz Configuration (13 APs)

**Floor Profile:**

```yaml
Floor 3 - Conference Center:
  Size: 20,000 sq ft
  Layout: 15 conference rooms
  Users: 100 concurrent
  
WiFi 7 Goal (160 MHz):
  • <20ms screen sharing latency (target maintained)
  • Wireless presentation (AppleTV, Miracast)
  • Note: 160 MHz provides sufficient bandwidth for conference use case
```

**AP Placement Design:**

```
┌─────────────────────────────────────────────────────────────────────┐
│                 LONDON HQ - FLOOR 3 (Conference Center)             │
│                         20,000 sq ft                                │
│                    ⚠️ 160 MHz CHANNELS (EMEA LIMITATION)           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Large Conference Rooms (7 rooms, 20-30 person capacity)           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-01]  [AP-02]  [AP-03]  [AP-04]  [AP-05]  [AP-06]  [AP-07]│ │
│  │   Ch 31    Ch 63    Ch 31    Ch 63    Ch 31    Ch 63    Ch 31  │ │
│  │   160 MHz  160 MHz  160 MHz  160 MHz  160 MHz  160 MHz  160 MHz│ │
│  │     •        •        •        •        •        •        •    │ │
│  │   Room A   Room B   Room C   Room D   Room E   Room F   Room G │ │
│  │   (30-seat)(30-seat)(25-seat)(25-seat)(20-seat)(20-seat)(20-seat)│
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Medium/Small Conference Rooms (8 rooms, 8-12 person capacity)     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │   [AP-08]  [AP-09]  [AP-10]  [AP-11]  [AP-12]  [AP-13]        │ │
│  │   Ch 63    Ch 31    Ch 63    Ch 31    Ch 63    Ch 31          │ │
│  │   160 MHz  160 MHz  160 MHz  160 MHz  160 MHz  160 MHz        │ │
│  │     •        •        •        •        •        •            │ │
│  │   Rooms    Rooms    Rooms    Rooms    Open     Pantry        │ │
│  │   H+I      J+K      L+M      N+O      Collab   Area          │ │
│  │   (2/AP)   (2/AP)   (2/AP)   (2/AP)                           │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  AP Summary: 13 APs                                                │
│  • Channel 31 (160 MHz): 7 APs                                     │
│  • Channel 63 (160 MHz): 6 APs                                     │
│  • Coverage: 15 conference rooms (100% wireless presentation)      │
│  • Performance: 160 MHz sufficient for conference use case         │
│    (screen sharing bandwidth: 50-100 Mbps, well within 160 MHz)   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 4.5.4 London HQ Pilot Summary

**Overall Deployment:**

| Floor | Use Case | APs | Users | Channel Width | Key Metrics | Success Criteria |
|-------|----------|-----|-------|---------------|-------------|------------------|
| **Floor 2** | Executive wireless-only | 12 | 70 executives | **160 MHz** (EMEA limit) | 2-3 Gbps per client | Satisfaction >85% (lower than Mumbai) |
| **Floor 3** | Conference rooms | 13 | 100 concurrent (15 rooms) | **160 MHz** | <20ms screen sharing | All rooms wireless |
| **TOTAL** | Executive + Conference | **25 APs** | 170 users | - | - | 160 MHz validated |

**London Pilot Unique Value:**

✅ **EMEA Spectrum Validation**: Validates WiFi 7 performance with 160 MHz (vs 320 MHz in India/Americas)  
✅ **Co-Channel Management**: Tests interference mitigation with only 2 channels (vs 3 in India)  
✅ **Performance Baseline**: Establishes 160 MHz expectations for other EMEA sites (Frankfurt, Paris)  
⚠️ **Throughput Caveat**: Executives may report 30-40% lower performance vs Mumbai (2-3 Gbps vs 4-5 Gbps)  

---

## 4.6 Pilot Architecture Reference Diagrams

### 4.6.1 High-Level Pilot Network Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│              PHASE 5A PILOT - HIGH-LEVEL ARCHITECTURE               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PILOT SITES (4 Locations, 115 WiFi 7 APs)                         │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  Mumbai HQ      Chennai HQ     Bangalore      London HQ      │ │
│  │  (50 APs)       (30 APs)       (10 APs)      (25 APs)       │ │
│  │  320 MHz        320 MHz        320 MHz       160 MHz ⚠️     │ │
│  │     │              │               │              │         │ │
│  │     └──────────────┴───────────────┴──────────────┘         │ │
│  │                           │                                 │ │
│  └───────────────────────────┼─────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         CATALYST 9800 WLC HA PAIRS                       │  │
│  │  WLC-MUM-01/02, WLC-CHN-01/02, WLC-LON-01/02            │  │
│  │  IOS-XE 17.16.1 (WiFi 7 support)                        │  │
│  │  • MLO Configuration: NSTR mode                         │  │
│  │  • 320 MHz Channels: Ch 31, 63, 95 (India)              │  │
│  │  • 160 MHz Channels: Ch 31, 63 (EMEA)                   │  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                          │
│                     ▼                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         CATALYST CENTER (DNAC 2.3.7+)                    │  │
│  │  • WiFi 7 AP provisioning (ZTP)                          │  │
│  │  • 320 MHz RF design tools                               │  │
│  │  • MLO telemetry collection                              │  │
│  │  • Deep Network Model (DNM) WiFi 7 client health training│  │
│  └──────────────────┬───────────────────────────────────────┘  │
│                     │                                          │
│         ┌───────────┴───────────┬────────────────┐            │
│         │                       │                │            │
│         ▼                       ▼                ▼            │
│  ┌───────────┐          ┌───────────┐    ┌──────────┐       │
│  │    ISE    │          │  Splunk   │    │   XDR    │       │
│  │ (802.1X,  │          │  (WiFi 7  │    │(Security)│       │
│  │  SGT)     │          │telemetry) │    │          │       │
│  └───────────┘          └───────────┘    └──────────┘       │
│                                                               │
│  INTEGRATION POINTS:                                          │
│  • ISE: 802.1X authentication, SGT assignment, pxGrid context│
│  • Splunk: WiFi 7 telemetry (MLO events, 320 MHz utilization)│
│  • XDR: Security correlation (WiFi 7 device context)         │
│  • DNAC DNM: WiFi 7 performance prediction, anomaly detection│
│                                                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 4.6.2 WiFi 7 Client Traffic Flow (MLO Enabled)

```
┌─────────────────────────────────────────────────────────────────────┐
│              WiFi 7 CLIENT TRAFFIC FLOW (MLO)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Executive Laptop (WiFi 7 Client, Intel BE200)                     │
│  MAC: AA:BB:CC:DD:EE:FF                                            │
│         │                                                           │
│         │ 802.1X Authentication (WPA3-Enterprise)                  │
│         ▼                                                           │
│  ┌─────────────────────┐                                           │
│  │  ISE Policy Server  │                                           │
│  │  • Authenticate user: john.exec@abhavtech.com                  │
│  │  • AD Group: Executives                                         │
│  │  • Duo Posture: Compliant (OS patched, AV enabled, encrypted) │
│  │  • Assign SGT: 11 (Executives)                                 │
│  │  • RADIUS Access-Accept with SGT cisco-av-pair="cts:sgt=11"   │
│  └─────────┬───────────┘                                           │
│            │                                                        │
│            ▼                                                        │
│  ┌──────────────────────┐                                          │
│  │  WiFi 7 AP (C9178I-BE)│                                         │
│  │  • Receives SGT 11    │                                         │
│  │  • MLO Association:   │                                         │
│  │    - Link 0: 5 GHz (160 MHz, backup)                          │
│  │    - Link 1: 6 GHz (320 MHz, primary)                         │
│  │  • Apply SGT 11 to BOTH MLO links                              │
│  └─────────┬────────────┘                                          │
│            │                                                        │
│            │ Traffic from client (via MLO Link 1: 6 GHz)          │
│            ▼                                                        │
│  ┌──────────────────────┐                                          │
│  │  Fabric Edge Switch  │                                          │
│  │  (Catalyst 9300)     │                                          │
│  │  • VXLAN encap       │                                          │
│  │  • SGT 11 inline tag │                                          │
│  │    (802.1Q 4-byte)   │                                          │
│  └─────────┬────────────┘                                          │
│            │                                                        │
│            │ VXLAN + SGT 11                                         │
│            ▼                                                        │
│  ┌──────────────────────┐                                          │
│  │  Fabric Underlay     │                                          │
│  │  (IS-IS routing)     │                                          │
│  └─────────┬────────────┘                                          │
│            │                                                        │
│            ▼                                                        │
│  ┌──────────────────────┐                                          │
│  │  Destination (Server)│                                          │
│  │  • SGACL enforced    │                                          │
│  │  • SGT 11 → SGT 80   │                                          │
│  │    (Executives → Servers: Permit)                              │
│  └──────────────────────┘                                          │
│                                                                     │
│  KEY POINTS:                                                        │
│  • MLO is transparent to ISE (ISE sees single MAC, single SGT)    │
│  • SGT applied to ALL MLO links (both 5 GHz and 6 GHz)            │
│  • Fabric edge switch tags VXLAN with SGT for Zero Trust          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4.7 Pilot Site Comparison Summary

### 4.7.1 Site-by-Site Comparison Matrix

| Site | APs | Users | Use Cases | Channel Width | Unique Value | Infrastructure Challenges |
|------|-----|-------|-----------|---------------|--------------|--------------------------|
| **Mumbai HQ** | 50 | 470 + 40 cameras | All 3 (AI, Conf, Exec) | 320 MHz | Primary pilot, all validations | Minor power/cooling issues (resolved) |
| **Chennai HQ** | 30 | 580 | Conference + Executive | 320 MHz | Conference validation | None (infrastructure ready) |
| **Bangalore** | 10 | 200 | General office (branch template) | 320 MHz | Branch rollout model | Uplinks, power, cooling (all resolved Week 1-3) |
| **London HQ** | 25 | 170 | Executive + Conference | **160 MHz** ⚠️ | EMEA spectrum validation | None (160 MHz performance lower) |
| **TOTAL** | **115** | **1,420** | - | - | - | - |

---

### 4.7.2 Channel Plan Summary

**India Sites (Mumbai, Chennai, Bangalore):**

```
6 GHz Spectrum: 5.925-7.125 GHz (1200 MHz)
Channel Plan: 3× 320 MHz non-overlapping

Ch 31: 6.115 GHz center (5.955-6.275 GHz)
Ch 63: 6.435 GHz center (6.275-6.595 GHz)
Ch 95: 6.755 GHz center (6.595-6.915 GHz)

Performance: 4-5 Gbps per client ✅
```

**London Site (EMEA):**

```
6 GHz Spectrum: 5.945-6.425 GHz (500 MHz) ⚠️
Channel Plan: 2× 160 MHz non-overlapping

Ch 31: 6.025 GHz center (5.945-6.105 GHz)
Ch 63: 6.185 GHz center (6.105-6.265 GHz)

Performance: 2-3 Gbps per client ⚠️ (40% lower than India)
Co-channel interference managed via power control (14 dBm)
```
