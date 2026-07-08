# CHAPTER 12: DAY-N DEPLOYMENT PROCEDURES

## Overview

**Day-N Activities**: Hands-on WiFi 7 AP installation, configuration, and validation during pilot deployment (Weeks 5-8).

**Timeline**: Week 5-8 (4 weeks for 115 APs across 4 sites)  
**Owner**: Installation Team + Network Operations  
**Critical Success Factor**: Zero P1 incidents, all APs operational by end of Week 8

---

## 12.1 WiFi 7 AP Installation & Configuration

### 12.1.1 Pre-Installation Checklist (Day Before)

**Coordination:**

```yaml
Day Before Installation Checklist:

Facilities Coordination:
  ✓ Confirm ceiling access available (ladder, scissor lift if needed)
  ✓ After-hours building access approved (if installing evenings/weekends)
  ✓ Power circuits confirmed available (PoE injectors near IDFs)
  ✓ Fire alarm system notified (if drilling required)

Network Readiness:
  ✓ Fabric edge switch ports pre-configured (VLANs, trunks)
  ✓ PoE injectors installed and powered on
  ✓ WLC ready to accept new APs (17.16.01, DNAC provisioned)
  ✓ DNAC templates assigned to site

Installation Team:
  ✓ Team briefing completed (review floor plan, AP locations)
  ✓ Tools ready (drill, mounting brackets, cable tester, laptop)
  ✓ Console cables available (for troubleshooting if AP doesn't auto-join)
  ✓ Contact list (NOC, facilities, building security)

Safety:
  ✓ Hard hats (if required by site)
  ✓ Safety goggles (for drilling)
  ✓ Gloves (handling APs in ceiling)
  ✓ First aid kit available
```

---

### 12.1.2 Physical AP Installation Procedure

**Installation Flow (Per AP):**

```bash
┌──────────────────────────────────────────────────────────────┐
│          WiFi 7 AP INSTALLATION PROCEDURE                    │
│          Estimated Time: 30-45 minutes per AP                │
├──────────────────────────────────────────────────────────────┤

Step 1: Mount AP Hardware (15 minutes)
  ├─ Position ladder under ceiling installation point
  ├─ Remove ceiling tile (if T-bar ceiling)
  ├─ Attach mounting bracket to ceiling
  │  • T-bar ceiling: Use bracket clips (no drilling)
  │  • Drywall ceiling: Drill pilot holes, use anchors
  ├─ Route Ethernet cable from IDF to AP location
  │  • Use existing cable tray if available
  │  • Minimum: Cat6A cable (support 10G future)
  │  • Label cable: "Floor6-AP01" (both ends)
  ├─ Secure cable to bracket using cable management clips
  └─ Attach AP to bracket (snap-in or screw mount)

Step 2: Connect Ethernet Cable (5 minutes)
  ├─ Connect Ethernet cable to AP RJ45 port
  │  • Port: "PoE/Uplink" (labeled on AP)
  │  • Ensure cable click-locks securely
  ├─ Route cable to PoE injector (IDF closet)
  ├─ Connect to PoE injector "PoE Out" port
  └─ Connect PoE injector "Data In" to fabric edge switch

Step 3: Power On AP (3 minutes)
  ├─ Plug PoE injector AC adapter into outlet
  ├─ Verify PoE injector LEDs:
  │  • Power LED: Solid green (powered on)
  │  • PoE LED: Solid green (PoE active)
  ├─ Observe AP LEDs:
  │  • AP powers on (all LEDs flash rapidly ~10 sec)
  │  • AP boots (takes 2-3 minutes)
  │  • Status LED: Solid green (booted successfully)
  └─ If Status LED red/amber: Troubleshoot (see 12.5)

Step 4: Verify AP Joins WLC (10 minutes)
  ├─ AP automatically discovers WLC via DHCP Option 43
  ├─ AP downloads configuration from DNAC (ZTP)
  ├─ AP joins WLC (CAPWAP tunnel establishes)
  ├─ Verify AP joined:
  │  ssh admin@wlc-mum-01
  │  WLC# show ap summary | include Floor6-AP01
  │  
  │  AP Name: MUM-Floor6-AP01
  │  Model: C9178I-BE
  │  IP: 10.252.40.151 (DHCP assigned)
  │  Status: Registered ✓
  │  
  │  Expected: AP registered within 5-10 minutes
  └─ If AP not joining: Troubleshoot (see 12.5.2)

Step 5: Validate AP Configuration (7 minutes)
  ├─ Check AP details on WLC:
  │  WLC# show ap config general MUM-Floor6-AP01
  │  
  │  AP Name: MUM-Floor6-AP01
  │  AP Model: C9178I-BE
  │  IOS Version: 17.16.01 ✓
  │  CAPWAP State: Run ✓
  │  Primary WLC: WLC-MUM-01 (10.252.40.10) ✓
  │  
  ├─ Verify RF configuration:
  │  WLC# show ap dot11 6ghz summary
  │  
  │  AP Name: MUM-Floor6-AP01
  │  Admin State: Enabled ✓
  │  Oper State: Up ✓
  │  Channel: 31 (320 MHz) ✓
  │  Tx Power: 17 dBm ✓
  │  
  ├─ Verify MLO enabled:
  │  WLC# show wireless mlo summary
  │  
  │  AP Name: MUM-Floor6-AP01
  │  MLO: Enabled ✓
  │  MLO Links: Link0 (5GHz), Link1 (6GHz) ✓
  │  
  └─ If configuration incorrect: Re-provision via DNAC

Step 6: Client Association Test (5 minutes)
  ├─ Connect test laptop (WiFi 7) to Corp-Secure-7 SSID
  ├─ Verify laptop connects to new AP:
  │  • SSID: Corp-Secure-7 ✓
  │  • AP: MUM-Floor6-AP01 ✓
  │  • Band: 6 GHz (primary) ✓
  │  • Channel: 31 (320 MHz) ✓
  │  • MLO: Enabled (5 GHz + 6 GHz) ✓
  │  
  ├─ Test performance:
  │  • Ping gateway: <10ms latency ✓
  │  • Speedtest: >4 Gbps throughput ✓
  │  • Web browsing: Instant page loads ✓
  │  
  └─ If performance poor: RF troubleshooting (see 12.5.3)

Step 7: Documentation (3 minutes)
  ├─ Update installation tracker (Excel/ServiceNow):
  │  • AP Name: MUM-Floor6-AP01 ✓ Installed
  │  • Location: Floor 6, Grid E4 (per floor plan)
  │  • MAC Address: AA:BB:CC:DD:EE:01
  │  • IP Address: 10.252.40.151
  │  • Installer: John Smith
  │  • Date/Time: 2025-05-15 14:30
  │  • Status: Operational ✓
  │  
  ├─ Take photo of AP installation (for records)
  └─ Move to next AP location

Total Time: 30-45 minutes per AP
Daily Capacity: 8-10 APs per 2-person team (8-hour day)

└──────────────────────────────────────────────────────────────┘
```

---

### 12.1.3 Batch Installation Schedule

**Week 5-8 Deployment Plan:**

```yaml
Week 5: Mumbai HQ - Floor 6 (Executive)
  Team: 2 installers
  APs: 15 APs
  Schedule:
    Monday: 5 APs (MUM-F6-AP01 to AP05)
    Tuesday: 5 APs (MUM-F6-AP06 to AP10)
    Wednesday: 5 APs (MUM-F6-AP11 to AP15)
    Thursday: Validation and rework (if needed)
    Friday: Buffer day (catch-up, testing)

Week 6: Mumbai HQ - Floors 2, 3 (Conference + Edge AI)
  Team: 2 installers
  APs: 25 APs (15 Floor 2, 10 Floor 3)
  Schedule:
    Monday-Tuesday: Floor 2 (15 APs conference center)
    Wednesday-Thursday: Floor 3 (10 APs Edge AI zone)
    Friday: Validation

Week 7: Chennai HQ + Bangalore Branch
  Team A (Chennai): 2 installers
  Team B (Bangalore): 2 installers
  APs: 30 Chennai + 10 Bangalore = 40 APs total
  Schedule:
    Monday-Friday: Chennai (30 APs across 3 floors)
    Monday-Wednesday: Bangalore (10 APs, full branch)
    Thursday-Friday: Validation

Week 8: London HQ
  Team: 2 installers (local UK team or travel from India)
  APs: 25 APs (Floors 2-3, Executive + Conference)
  Schedule:
    Monday-Thursday: Installation (25 APs)
    Friday: Validation

Total: 115 APs installed across 4 weeks
```

---

## 12.2 MLO Link Configuration & Validation

### 12.2.1 MLO Configuration on WLC

**MLO is automatically configured by DNAC template (from Ch 11.2), but validation required.**

**Verify MLO Configuration:**

```bash
# Connect to WLC
ssh admin@wlc-mum-01

# Verify MLO Global Settings
WLC# show wireless mlo config

MLO Feature: Enabled ✓
MLO Mode: NSTR (Non-Simultaneous Tx/Rx) ✓
MLO Aggregation: Enabled ✓
MLO Link Selection: Load-Balance ✓

# Verify MLO Per-SSID
WLC# show wlan id 1

WLAN Profile Name: Corp-Secure-7
WLAN ID: 1
Security: WPA3-Enterprise
Radio Policy: 6 GHz Preferred
MLO: Enabled ✓

# Verify MLO Per-AP
WLC# show ap name MUM-Floor6-AP01 config general | include MLO

MLO Status: Enabled ✓
MLO Links: 2 (Link0: 5GHz 160MHz, Link1: 6GHz 320MHz) ✓

# If MLO disabled, manually enable:
WLC# config ap mlo enable MUM-Floor6-AP01
```

---

### 12.2.2 Client-Side MLO Validation

**Test with WiFi 7 Client (Laptop with Intel BE200 or Qualcomm FastConnect 7800):**

```bash
# Windows 11 Client

# Step 1: Connect to Corp-Secure-7 SSID
# Windows Settings > Network & Internet > WiFi > Corp-Secure-7

# Step 2: Verify MLO Active
# Open Command Prompt (Admin)
netsh wlan show interfaces

SSID: Corp-Secure-7
Network type: Infrastructure
Radio type: 802.11be (WiFi 7) ✓
Authentication: WPA3-Enterprise
Cipher: GCMP-256
Connection mode: Auto Connect
Band: 6 GHz (primary) ✓
Channel: 31 (320 MHz) ✓
Receive rate (Mbps): 5764 (MLO aggregate) ✓
Transmit rate (Mbps): 5764 ✓

# Step 3: Verify MLO Links (Windows WiFi Diagnostics)
# Windows Settings > Network & Internet > Advanced network settings > WiFi
# > Hardware properties

MLO Status: Active ✓
Link 0: 5 GHz, Channel 36, 160 MHz, MCS 11, 2.4 Gbps
Link 1: 6 GHz, Channel 31, 320 MHz, MCS 13, 5.8 Gbps
Aggregate: 8.2 Gbps (theoretical)

# Step 4: Test MLO Failover
# Method: Intentionally degrade 5 GHz (cover 5 GHz antenna)
# Expected: Traffic seamlessly shifts to 6 GHz, zero packet loss

ping 10.252.80.10 -t

# Before degradation:
Reply from 10.252.80.10: time=8ms
Reply from 10.252.80.10: time=7ms

# Cover 5 GHz antenna (degrade Link 0)
Reply from 10.252.80.10: time=9ms  ← MLO failover happens here
Reply from 10.252.80.10: time=9ms
Reply from 10.252.80.10: time=8ms

# Packets: Sent = 100, Received = 100, Lost = 0 (0% loss) ✓

Success Criteria:
  ✓ MLO active on client
  ✓ Two links visible (5 GHz + 6 GHz)
  ✓ Aggregate throughput >5 Gbps
  ✓ Zero packet loss during failover
```

---

### 12.2.3 MLO Performance Testing

**Throughput Test (iPerf3):**

```bash
# iPerf3 Server (on wired network)
iperf3 -s -p 5201

# iPerf3 Client (WiFi 7 laptop)
iperf3 -c 10.252.80.10 -p 5201 -t 60 -i 5

Expected Results:

[  5] 0.00-5.00 sec  2.4 GBytes  4.1 Gbps
[  5] 5.00-10.00 sec  2.5 GBytes  4.3 Gbps
[  5] 10.00-15.00 sec  2.6 GBytes  4.5 Gbps
[  5] 15.00-20.00 sec  2.6 GBytes  4.5 Gbps
...
[  5] 55.00-60.00 sec  2.7 GBytes  4.6 Gbps

Average Throughput: 4.4 Gbps ✓ (Target: >4 Gbps)

# Test MLO Link Aggregation
# Open two simultaneous iPerf3 streams (simulates multi-app usage)

# Terminal 1:
iperf3 -c 10.252.80.10 -p 5201 -t 60

# Terminal 2:
iperf3 -c 10.252.80.10 -p 5202 -t 60

Expected:
  Stream 1: 2.2 Gbps (Link 1: 6 GHz)
  Stream 2: 1.8 Gbps (Link 0: 5 GHz)
  Total: 4.0 Gbps aggregate ✓

Success Criteria:
  ✓ Single stream: >4 Gbps
  ✓ Dual stream aggregate: >3.5 Gbps
  ✓ Latency: <10ms (99th percentile)
```

---

## 12.3 320 MHz Channel Assignment

### 12.3.1 Manual Channel Assignment (India Sites)

**6 GHz 320 MHz Channel Plan:**

| Site | Floor | AP Names | 320 MHz Channel | Center Freq | Rationale |
|------|-------|----------|-----------------|-------------|-----------|
| Mumbai | Floor 6 (Exec) | AP01-AP05 | Ch 31 | 6.115 GHz | Primary channel |
| Mumbai | Floor 6 (Exec) | AP06-AP10 | Ch 63 | 6.435 GHz | Alternate channel |
| Mumbai | Floor 6 (Exec) | AP11-AP15 | Ch 95 | 6.755 GHz | Third channel |
| Mumbai | Floor 3 (Edge AI) | AP01-AP04 | Ch 31 | 6.115 GHz | Co-channel OK (stationary cameras) |
| Mumbai | Floor 2 (Conf) | AP01-AP05 | Ch 63 | 6.435 GHz | Minimize interference |
| Mumbai | Floor 2 (Conf) | AP06-AP10 | Ch 95 | 6.755 GHz | Alternate |
| Mumbai | Floor 2 (Conf) | AP11-AP15 | Ch 31 | 6.115 GHz | Reuse Ch 31 |

**CLI Commands:**

```bash
# Option A: DNAC (Recommended)
# DNAC GUI > Design > Network Settings > Wireless > RF Profile
# Set channel assignment: Manual
# Assign channels per AP (via AP provisioning)

# Option B: Manual CLI (Per AP)
ssh admin@wlc-mum-01

# Set 6 GHz Channel for Single AP
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP01 31

# Verify
WLC# show ap dot11 6ghz summary | include MUM-Floor6-AP01

AP Name: MUM-Floor6-AP01
Channel: 31 (320 MHz) ✓
Tx Power: 17 dBm

# Batch Channel Assignment (all Floor 6 APs)
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP01 31
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP02 31
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP03 31
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP04 31
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP05 31
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP06 63
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP07 63
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP08 63
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP09 63
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP10 63
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP11 95
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP12 95
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP13 95
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP14 95
WLC# config 802.11-6ghz channel ap MUM-Floor6-AP15 95

# Save configuration
WLC# write memory
```

---

### 12.3.2 London Site 160 MHz Configuration (EMEA)

**London Pilot: 160 MHz channels (EMEA spectrum limitation)**

```bash
# London: Only 2 non-overlapping 160 MHz channels in 6 GHz

ssh admin@wlc-lon-01

# Set 160 MHz Channel Width (Global)
WLC# config 802.11-6ghz channel width 160

# Assign Channels (Ch 31, 63 alternating)
WLC# config 802.11-6ghz channel ap LON-Floor2-AP01 31
WLC# config 802.11-6ghz channel ap LON-Floor2-AP02 63
WLC# config 802.11-6ghz channel ap LON-Floor2-AP03 31
WLC# config 802.11-6ghz channel ap LON-Floor2-AP04 63
# ... repeat for all 25 London APs

# Verify
WLC# show ap dot11 6ghz summary

AP Name: LON-Floor2-AP01
Channel: 31 (160 MHz) ✓
Tx Power: 14 dBm (lower than India due to EMEA regulations)

AP Name: LON-Floor2-AP02
Channel: 63 (160 MHz) ✓
Tx Power: 14 dBm

# Note: London performance will be ~50% lower than Mumbai
# Executive throughput: 2-3 Gbps (vs 4-5 Gbps in Mumbai)
```

---

## 12.4 SSID Migration Procedures

### 12.4.1 Dual-SSID Strategy (Pilot Phase)

**Phase 5A Pilot: Run BOTH Corp-Secure-7 (WiFi 7) and Corp-Secure (WiFi 6) simultaneously**

```bash
# Rationale:
# - Corp-Secure-7: WiFi 7 clients, MLO enabled, 6 GHz primary
# - Corp-Secure: WiFi 6/5 legacy clients, 5 GHz + 2.4 GHz

# WLC Configuration
ssh admin@wlc-mum-01

# Verify Both SSIDs Enabled
WLC# show wlan summary

WLAN ID: 1
Profile Name: Corp-Secure-7
SSID: Corp-Secure-7
Status: Enabled ✓
Security: WPA3-Enterprise
Radio Policy: 6 GHz Preferred
MLO: Enabled

WLAN ID: 2
Profile Name: Corp-Secure
SSID: Corp-Secure
Status: Enabled ✓
Security: WPA3-Enterprise
Radio Policy: All (2.4/5/6 GHz)
MLO: Disabled (WiFi 6 clients don't support MLO)

# Apply Both SSIDs to WiFi 7 APs
WLC# show ap wlan MUM-Floor6-AP01

AP Name: MUM-Floor6-AP01
WLAN 1 (Corp-Secure-7): Enabled, 6 GHz ✓
WLAN 2 (Corp-Secure): Enabled, 5 GHz + 2.4 GHz ✓

# User Experience:
# - WiFi 7 clients: See both SSIDs, prefer Corp-Secure-7 (faster)
# - WiFi 6 clients: See only Corp-Secure (can't see 6 GHz)
# - WiFi 5 clients: See only Corp-Secure (legacy)
```

---

### 12.4.2 SSID Migration Timeline

```yaml
Phase 5A Pilot (Week 5-16, 12 weeks):
  SSID Strategy: Dual-SSID (Corp-Secure-7 + Corp-Secure)
  User Action: Voluntary opt-in to Corp-Secure-7
  Wired Ports: Keep available (no removal during pilot)

Phase 5B Production (Week 17+, 12 months):
  Month 1-3: Continue dual-SSID
  Month 4-6: Unified SSID "Corp-Secure" with MLO enabled
    - WiFi 7 clients: Automatic MLO
    - WiFi 6 clients: Single-band (5 GHz)
    - WiFi 5 clients: Single-band (5 GHz or 2.4 GHz)
  Month 7-12: Deprecate Corp-Secure-7 (merge into Corp-Secure)

Phase 5C Steady State (2027+):
  Single SSID: Corp-Secure (WiFi 7 MLO, backward compatible)
  Legacy: Corp-Guest (WiFi 6, public access only)
```

---

## 12.5 Client Device Testing & Validation

### 12.5.1 WiFi 7 Client Compatibility Matrix

**Supported Devices (As of Q2 2025):**

| Device Type | Model | WiFi 7 Chipset | MLO Support | 320 MHz Support | Test Status |
|-------------|-------|----------------|-------------|-----------------|-------------|
| **Laptops** | Dell Latitude 7450 (2024) | Intel BE200 | ✅ NSTR | ✅ Yes | ✓ Validated |
| **Laptops** | HP EliteBook 840 G11 | Intel BE200 | ✅ NSTR | ✅ Yes | ✓ Validated |
| **Laptops** | Lenovo ThinkPad X1 Carbon Gen 12 | Intel BE200 | ✅ NSTR | ✅ Yes | ✓ Validated |
| **Laptops** | MacBook Pro 16" (M4, 2024) | Apple WiFi 7 | ✅ NSTR | ✅ Yes | ✓ Validated |
| **Tablets** | iPad Pro 13" (M4, 2024) | Apple WiFi 7 | ✅ NSTR | ✅ Yes | ✓ Validated |
| **Phones** | iPhone 16 Pro/Max | Apple WiFi 7 | ✅ NSTR | ✅ Yes | ✓ Validated |
| **Phones** | Samsung Galaxy S25/Ultra | Qualcomm FastConnect 7800 | ✅ NSTR | ✅ Yes | ✓ Validated |
| **Laptops (Legacy)** | Dell Latitude 7400 (2022) | Intel AX211 (WiFi 6E) | ❌ No MLO | ❌ No 320 MHz | Use Corp-Secure |
| **Laptops (Legacy)** | MacBook Pro 14" (M1, 2021) | WiFi 6 | ❌ No 6 GHz | ❌ No MLO | Use Corp-Secure |

**Validation Procedure (Per Device Model):**

```bash
# Test Device: Dell Latitude 7450 (Intel BE200)

Step 1: Verify WiFi 7 Chipset
  Windows Settings > Device Manager > Network Adapters
  Expected: "Intel Wi-Fi 7 BE200 320MHz" ✓

Step 2: Update WiFi Driver (if needed)
  Download latest driver from Intel.com
  Version: 24.0.0.24 or later (WiFi 7 support)
  Install and reboot

Step 3: Connect to Corp-Secure-7
  Windows Settings > WiFi > Corp-Secure-7
  Authentication: username@abhavtech.com + password
  Expected: Connected ✓

Step 4: Verify MLO Active
  netsh wlan show interfaces
  
  SSID: Corp-Secure-7
  Radio type: 802.11be ✓
  Band: 6 GHz ✓
  Channel: 31 ✓
  Receive rate: 5764 Mbps ✓ (MLO aggregate)

Step 5: Performance Test
  ping 10.252.80.10
  Latency: <10ms ✓
  
  Speedtest (internal server):
  Download: 4.2 Gbps ✓
  Upload: 3.8 Gbps ✓

Step 6: Roaming Test
  Walk from Floor 6 AP-01 coverage to AP-02 coverage
  Continuous ping during walk:
  
  Reply from 10.252.80.10: time=8ms
  Reply from 10.252.80.10: time=9ms
  Reply from 10.252.80.10: time=12ms ← Roaming occurs
  Reply from 10.252.80.10: time=9ms
  Reply from 10.252.80.10: time=8ms
  
  Packets: Sent = 100, Received = 100, Lost = 0 ✓

Success Criteria:
  ✓ Device supports WiFi 7 (BE200 chipset)
  ✓ MLO active (2 links visible)
  ✓ Throughput >4 Gbps
  ✓ Latency <10ms
  ✓ Zero packet loss during roaming

# Document Results:
Update compatibility matrix (SharePoint/Wiki)
  Device: Dell Latitude 7450 ✓ SUPPORTED
  Notes: Requires driver 24.0.0.24+
```

---

### 12.5.2 Client Onboarding Workflow

**Week 9-12: User Onboarding (After AP Installation Complete)**

```yaml
Week 9: Early Adopters (10% of pilot users)

Email Invitation (Executive Floor Users):
  Subject: "You're Invited: WiFi 7 Early Adopter Program"
  
  Body:
  "Dear Executive,
  
  You've been selected to pilot our new WiFi 7 wireless network
  on Floor 6. WiFi 7 offers 4x faster speeds than current WiFi 6.
  
  How to Connect:
  1. Open WiFi settings on your laptop
  2. Connect to: Corp-Secure-7
  3. Use your regular Abhavtech credentials
  
  What to Expect:
  • 4-5 Gbps download speeds (vs 1-2 Gbps WiFi 6)
  • <10ms latency (instant responsiveness)
  • Seamless device switching (laptop, iPad, iPhone)
  
  Need Help?
  Direct support line: network-team@abhavtech.com
  Phone: ext. 5000 (priority support)
  
  We'll check in with you daily during Week 1.
  
  Thank you for being an early adopter!
  Network Team"

Onboarding Support (Week 9):
  Monday-Friday: On-site network engineer (Floor 6, 9 AM - 5 PM)
  Activities:
    • Walk-up assistance (connect devices)
    • Troubleshoot compatibility issues
    • Collect user feedback (informal interviews)
    • Measure satisfaction (quick surveys)

Week 10-11: Expanded Onboarding (50% of pilot users)

Email Blast (All Pilot Site Users):
  Subject: "WiFi 7 Now Available - Faster Wireless"
  
  Body:
  "WiFi 7 is now available at [your site]. Connect to 'Corp-Secure-7'
  for up to 4x faster speeds. Your current WiFi 6 network remains
  available if you're not ready to switch.
  
  How to Connect: [link to intranet guide]
  FAQs: [link to FAQ page]
  Support: helpdesk ext. 5000"

Self-Service Setup:
  Intranet Guide: "How to Connect to WiFi 7"
    1. Check if your device supports WiFi 7 (link to compatibility matrix)
    2. Update WiFi drivers (if needed)
    3. Connect to Corp-Secure-7
    4. Troubleshooting (common issues)

Helpdesk Readiness:
  Training: 2-hour session (WiFi 7 basics, common issues)
  Runbook: "WiFi 7 Support Guide" (SharePoint)
  Escalation: network-team@abhavtech.com (Tier 3)

Week 12: Majority Adoption (70%+ of pilot users)

Proactive Migration:
  • For users still on WiFi 6: Gentle nudge emails
  • Offer 1-on-1 setup assistance (book appointment)
  • Highlight benefits: "Switch to WiFi 7, get 4x faster speeds"
  
Success Metric: 70% wireless-only adoption by end of Week 12
```

---

## 12.6 Access Switch Decommissioning Procedures

### 12.6.1 Wired Port Consolidation

**Objective**: Remove access switches no longer needed after users migrate to wireless.

**Criteria for Switch Decommissioning:**

```bash
# Switch is eligible for decommissioning if:
1. <10% port utilization (e.g., 48-port switch with <5 ports active)
2. Remaining ports are non-critical (e.g., printers, IoT sensors)
3. Remaining devices can be consolidated to adjacent switch

# Example: Mumbai Floor 6 (Executive Floor)

Pre-WiFi 7:
  • 6 access switches (Catalyst 3750, 48 ports each)
  • 288 total ports
  • 180 ports active (executive desktops, printers, phones)
  • 63% utilization

Post-WiFi 7 (Week 12):
  • 80 executives migrated to wireless-only
  • 80 wired ports no longer needed
  • 100 ports remain active (printers, desk phones, IoT)
  • 35% utilization (100 / 288)

# Consolidation Plan:
Switch 1: 18 ports active (keep)
Switch 2: 17 ports active (keep)
Switch 3: 16 ports active (migrate to Switch 1-2, decommission)
Switch 4: 15 ports active (migrate to Switch 1-2, decommission)
Switch 5: 18 ports active (keep)
Switch 6: 16 ports active (migrate to Switch 5, decommission)

Result: 6 switches → 3 switches (50% reduction)
```

---

### 12.6.2 Switch Decommissioning Procedure

```bash
# Decommission Switch: MUM-F6-SW-03 (Catalyst 3750)

Step 1: Identify Active Ports (1 week before)

ssh admin@mum-f6-sw-03

# List active ports
MUM-F6-SW-03# show interfaces status | include connected

Gi1/0/5: connected, Printer-Floor6-MFP1
Gi1/0/12: connected, IP-Phone-Desk-45
Gi1/0/23: connected, IP-Phone-Desk-46
# ... (16 ports active)

# Document devices on each port
Create spreadsheet:
  Port | Device | User/Location | Migration Target
  Gi1/0/5 | Printer MFP1 | Floor 6 Copy Room | SW-01 Gi1/0/30
  Gi1/0/12 | IP Phone | Desk 45 | SW-01 Gi1/0/31
  ...

Step 2: User Communication (1 week before)

Email to affected users:
  "Network maintenance on Floor 6 on [date]. Your devices
  will be briefly offline (5-10 minutes) during port migration."

Step 3: Pre-Stage Cables (Day before)

• Run new Ethernet cables from devices to target switch
• Label cables: "MFP1 → SW-01 Port 30"
• Do NOT disconnect old cables yet

Step 4: Migration (Maintenance Window)

Saturday 2:00 AM - 6:00 AM:

# For each active port on SW-03:
1. Disconnect old cable (from SW-03)
2. Connect new cable (to SW-01)
3. Verify device online:
   ping <device-IP>
   Expected: Reply within 30 seconds

# Example: Migrate Printer MFP1
Old: SW-03 Gi1/0/5 → Printer
New: SW-01 Gi1/0/30 → Printer

# Configure target switch port (if needed)
ssh admin@mum-f6-sw-01
MUM-F6-SW-01# conf t
MUM-F6-SW-01(config)# interface GigabitEthernet1/0/30
MUM-F6-SW-01(config-if)# description Printer-Floor6-MFP1
MUM-F6-SW-01(config-if)# switchport mode access
MUM-F6-SW-01(config-if)# switchport access vlan 30 (Printers)
MUM-F6-SW-01(config-if)# spanning-tree portfast
MUM-F6-SW-01(config-if)# end

# Verify printer online
ping 10.252.30.45 (Printer IP)
Reply from 10.252.30.45: time=5ms ✓

# Repeat for all 16 ports (takes 2-3 hours)

Step 5: Decommission Switch

# After all ports migrated, verify zero active ports
ssh admin@mum-f6-sw-03
MUM-F6-SW-03# show interfaces status | include connected

(No output - all ports disconnected) ✓

# Shut down switch
MUM-F6-SW-03# conf t
MUM-F6-SW-03(config)# shutdown
MUM-F6-SW-03(config)# end
MUM-F6-SW-03# reload

# Physical decommissioning:
1. Power off switch (unplug power cable)
2. Disconnect all Ethernet cables
3. Remove switch from rack
4. Label switch: "Decommissioned 2025-05-20"
5. Store in spare equipment room (or RMA if under warranty)

Step 6: Update Documentation

# DNAC Inventory:
DNAC GUI > Provision > Inventory > MUM-F6-SW-03
  Status: Change to "Decommissioned"
  Delete from DNAC (or mark inactive)

# Network Diagrams:
Update Visio/Lucidchart: Remove SW-03 from Floor 6

# Asset Tracking:
Update asset database (ServiceNow/Excel):
  Asset: MUM-F6-SW-03 (Catalyst 3750)
  Status: Decommissioned
  Date: 2025-05-20
  Disposition: Spare pool (or RMA)

Step 7: Validate No Service Impact (Next Business Day)

Monday Morning:
  • Check helpdesk tickets (any reports of offline devices?)
  • Walk Floor 6, verify printers/phones operational
  • User feedback: "Did you experience any issues over the weekend?"

Expected: Zero service impact, zero tickets ✓
```

---

### 12.6.3 Decommissioning Schedule (Phase 5A Pilot)

| Site | Floor | Switches Before | Switches After | Decommissioned | Timeline |
|------|-------|----------------|----------------|----------------|----------|
| **Mumbai** | Floor 6 (Exec) | 6 | 3 | 3 switches (144 ports) | Week 13 |
| **Mumbai** | Floor 2 (Conf) | 10 | 5 | 5 switches (240 ports) | Week 14 |
| **Mumbai** | Floor 3 (Edge AI) | 6 | 6 | 0 (servers remain wired) | N/A |
| **Chennai** | All floors | 36 | 15 | 21 switches (1008 ports) | Week 15-16 |
| **Bangalore** | All floors | 4 | 2 | 2 switches (96 ports) | Week 16 |
| **London** | Floors 2-3 | 14 | 6 | 8 switches (384 ports) | Week 17 |
| **TOTAL** | - | **76 switches** | **37 switches** | **39 switches** | - |

**Total Ports Decommissioned**: 1,872 ports (39 switches × 48 ports)

---

## 12.7 Day-N Completion Checklist

**CRITICAL**: All items must be ✓ before declaring Phase 5A pilot complete (end of Week 16).

| Task | Target | Status |
|------|--------|--------|
| **AP Installation** | | |
| - Mumbai: 50 APs installed | Week 5-6 | ⬜ |
| - Chennai: 30 APs installed | Week 7 | ⬜ |
| - Bangalore: 10 APs installed | Week 7 | ⬜ |
| - London: 25 APs installed | Week 8 | ⬜ |
| - Total: 115 APs operational | Week 8 | ⬜ |
| **MLO Validation** | | |
| - All 115 APs: MLO enabled | Week 8 | ⬜ |
| - Client MLO testing (10 devices) | Week 9 | ⬜ |
| - MLO failover testing | Week 9 | ⬜ |
| **Performance Validation** | | |
| - Edge AI cameras: <10ms latency | Week 10 | ⬜ |
| - Conference rooms: <20ms screen sharing | Week 10 | ⬜ |
| - Executive floor: >4 Gbps throughput | Week 11 | ⬜ |
| **User Adoption** | | |
| - 10% early adopters onboarded | Week 9 | ⬜ |
| - 50% users onboarded | Week 11 | ⬜ |
| - 70% wireless-only adoption | Week 12 | ⬜ |
| **Switch Decommissioning** | | |
| - 39 switches decommissioned | Week 13-17 | ⬜ |
| - Zero service impact | Week 13-17 | ⬜ |
| **Documentation** | | |
| - Installation records complete | Week 8 | ⬜ |
| - Lessons learned documented | Week 16 | ⬜ |
| - Phase 5B plan updated | Week 16 | ⬜ |

**Success Criteria (Exit to Phase 5B):**

✅ All 115 APs operational, zero P1 incidents  
✅ MLO working on all APs, client compatibility validated  
✅ All 3 use cases validated (Edge AI, Conference, Executive)  
✅ 70%+ wireless-only adoption  
✅ User satisfaction >90%  
✅ 39 switches decommissioned, zero service impact  

**Decision Date**: End of Week 16 (Friday)  
**Decision Maker**: CTO + Network Architecture Lead
