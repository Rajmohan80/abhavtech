# CHAPTER 11: DAY-0 PREPARATION & PREREQUISITES

## Overview

**Day-0 Activities**: Pre-deployment preparation tasks that must be completed BEFORE WiFi 7 AP installation. These activities establish the foundation for successful Phase 5A pilot deployment.

**Timeline**: Week 1-4 (4 weeks before AP installation)  
**Owner**: Network Architecture Team + NOC  
**Critical Success Factor**: 100% completion of Day-0 checklist before proceeding to Day-N deployment

---

## 11.1 WLC Software Upgrade to IOS-XE 17.16+

### 11.1.1 Prerequisites

**Pre-Upgrade Checklist:**

```bash
# Verify Current Software Version
ssh admin@wlc-mum-01
WLC# show version

Cisco IOS XE Software, Version 17.15.1
Expected: 17.15.x (must be 17.15+ before upgrading to 17.16)

# Verify WLC HA Status
WLC# show redundancy states

My State = ACTIVE
Peer State = STANDBY HOT
Expected: Both WLCs operational, HA sync complete

# Verify AP Count and Health
WLC# show ap summary

Total APs: 180
Registered: 180
Enabled: 180
Disabled: 0
Expected: All APs registered and enabled

# Verify Available Storage Space
WLC# show bootflash:

Available space: 10 GB (minimum 5 GB required for 17.16 image)
Expected: >5 GB free space

# Verify DNAC Connectivity
WLC# ping 10.252.40.50

Success rate: 100% (5/5)
Expected: DNAC reachable from WLC
```

**Download Software:**

```bash
# Cisco.com Download (Authorized Users Only)
# Navigate to: Software Download > Wireless > Catalyst 9800 Series
# File: cat9k-wlc.17.16.01.SPA.bin (size: ~1.2 GB)

# Verify MD5 Checksum (Cisco.com provides this)
md5sum cat9k-wlc.17.16.01.SPA.bin
Expected: <MD5_HASH_FROM_CISCO>

# Upload to TFTP Server
cp cat9k-wlc.17.16.01.SPA.bin /tftpboot/
chmod 644 /tftpboot/cat9k-wlc.17.16.01.SPA.bin

# Verify TFTP Server Reachable from WLC
WLC# ping 10.252.1.30 (TFTP server)
Success rate: 100%
```

---

### 11.1.2 Upgrade Procedure (HA Pair)

**CRITICAL**: Upgrade secondary WLC first, validate, then fail over and upgrade primary.

**Step 1: Backup WLC Configuration**

```bash
# Option A: Via DNAC (Recommended)
DNAC GUI > Provision > Inventory > Select WLC > Actions > Backup

# Option B: Manual CLI Backup
WLC# copy running-config tftp://10.252.1.30/wlc-mum-01-backup-20250515.cfg

# Verify backup file exists
ssh admin@tftp-server
ls -lh /tftpboot/wlc-mum-01-backup-20250515.cfg
Expected: File size >100 KB
```

**Step 2: Upgrade Secondary WLC (Standby)**

```bash
# Connect to SECONDARY WLC (Standby)
ssh admin@wlc-mum-02

# Verify this is standby WLC
WLC-MUM-02# show redundancy states
My State = STANDBY HOT ✓

# Copy IOS-XE 17.16 Image to WLC
WLC-MUM-02# copy tftp://10.252.1.30/cat9k-wlc.17.16.01.SPA.bin bootflash:

Destination filename [cat9k-wlc.17.16.01.SPA.bin]? <Enter>
Accessing tftp://10.252.1.30/cat9k-wlc.17.16.01.SPA.bin...
Loading...
[OK - 1,234,567,890 bytes]

# This takes 10-15 minutes, progress bar shown

# Verify MD5 Checksum
WLC-MUM-02# verify /md5 bootflash:cat9k-wlc.17.16.01.SPA.bin
Expected: MD5 hash matches Cisco.com value

# Set Boot Variable
WLC-MUM-02# conf t
WLC-MUM-02(config)# no boot system
WLC-MUM-02(config)# boot system bootflash:cat9k-wlc.17.16.01.SPA.bin
WLC-MUM-02(config)# end
WLC-MUM-02# write memory

# Verify Boot Variable
WLC-MUM-02# show boot
Current boot variable: bootflash:cat9k-wlc.17.16.01.SPA.bin ✓

# Schedule Reload (During Maintenance Window)
WLC-MUM-02# reload in 5
System will reload in 5 minutes

# Or reload immediately (if maintenance window active)
WLC-MUM-02# reload
Proceed with reload? [confirm] <Enter>

# WLC reboots, takes 20-30 minutes
# Monitor via console or wait for WLC to come back online

# Verify WLC Came Back Online
ping 10.252.40.11 (WLC-MUM-02 management IP)
Expected: Ping successful after 20-30 minutes

# Reconnect to WLC
ssh admin@wlc-mum-02

# Verify Software Version
WLC-MUM-02# show version
Cisco IOS XE Software, Version 17.16.01 ✓

# Verify HA Status
WLC-MUM-02# show redundancy states
My State = STANDBY HOT
Peer State = ACTIVE
Expected: HA sync restored, secondary is STANDBY HOT
```

**Step 3: Validate Secondary WLC**

```bash
# Test AP Join to Secondary WLC
# Temporarily move 1-2 test APs to secondary WLC

# Primary WLC (Active)
ssh admin@wlc-mum-01
WLC-MUM-01# config ap secondary-base WLC-MUM-02 MUM-AP-TEST-01
WLC-MUM-01# config ap primary-base WLC-MUM-02 MUM-AP-TEST-01

# AP will rejoin to secondary WLC (now running 17.16)

# Verify AP Joined Secondary
ssh admin@wlc-mum-02
WLC-MUM-02# show ap summary | include MUM-AP-TEST-01

MUM-AP-TEST-01    C9178I-BE  17.16.01  Registered ✓

# Verify WiFi 7 Features Available
WLC-MUM-02# show wlan all | include Corp-Secure-7
WLAN Profile Name: Corp-Secure-7
Expected: WiFi 7 SSIDs configurable (if already configured)

# Test Client Association (if test client available)
# Connect WiFi 7 client to test AP
# Verify MLO enabled, 320 MHz channel visible

# If validation successful, move test AP back to primary
ssh admin@wlc-mum-01
WLC-MUM-01# config ap primary-base WLC-MUM-01 MUM-AP-TEST-01
```

**Step 4: Failover to Secondary WLC**

```bash
# CRITICAL: This causes 10-20 second AP disruption
# Notify users and NOC before proceeding

# Primary WLC (Currently Active)
ssh admin@wlc-mum-01
WLC-MUM-01# redundancy force-switchover

Proceed with switchover to standby RP? [confirm] <Enter>

# All APs will fail over to secondary WLC (now running 17.16)
# Expect 10-20 second disruption for wireless clients

# Monitor Failover Progress
WLC-MUM-02# show ap summary
Expected: All 180 APs register to WLC-MUM-02 within 2-3 minutes

# Verify New Active/Standby State
ssh admin@wlc-mum-02
WLC-MUM-02# show redundancy states
My State = ACTIVE ✓
Peer State = STANDBY HOT

ssh admin@wlc-mum-01
WLC-MUM-01# show redundancy states
My State = STANDBY HOT ✓
Peer State = ACTIVE
```

**Step 5: Upgrade Primary WLC (Now Standby)**

```bash
# Now WLC-MUM-01 is STANDBY, safe to upgrade

ssh admin@wlc-mum-01

# Verify Standby State
WLC-MUM-01# show redundancy states
My State = STANDBY HOT ✓

# Copy IOS-XE 17.16 Image
WLC-MUM-01# copy tftp://10.252.1.30/cat9k-wlc.17.16.01.SPA.bin bootflash:
# (Same procedure as Step 2)

# Verify MD5
WLC-MUM-01# verify /md5 bootflash:cat9k-wlc.17.16.01.SPA.bin

# Set Boot Variable
WLC-MUM-01# conf t
WLC-MUM-01(config)# no boot system
WLC-MUM-01(config)# boot system bootflash:cat9k-wlc.17.16.01.SPA.bin
WLC-MUM-01(config)# end
WLC-MUM-01# write memory

# Reload
WLC-MUM-01# reload
Proceed with reload? [confirm] <Enter>

# Wait 20-30 minutes for WLC to come back

# Verify Software Version
ssh admin@wlc-mum-01
WLC-MUM-01# show version
Cisco IOS XE Software, Version 17.16.01 ✓

# Verify HA Status
WLC-MUM-01# show redundancy states
My State = STANDBY HOT
Peer State = ACTIVE
Expected: Both WLCs now running 17.16, HA sync complete
```

**Step 6: Restore Original Active/Standby Roles (Optional)**

```bash
# If you want WLC-MUM-01 to be ACTIVE again (optional)

ssh admin@wlc-mum-02 (currently ACTIVE)
WLC-MUM-02# redundancy force-switchover

# This will make WLC-MUM-01 ACTIVE again
# Another 10-20 second AP disruption

# Final State:
WLC-MUM-01: ACTIVE, IOS-XE 17.16.01
WLC-MUM-02: STANDBY HOT, IOS-XE 17.16.01
```

**Step 7: Post-Upgrade Validation**

```bash
# Verify Both WLCs Running 17.16
ssh admin@wlc-mum-01
WLC-MUM-01# show version | include Version
Cisco IOS XE Software, Version 17.16.01 ✓

ssh admin@wlc-mum-02
WLC-MUM-02# show version | include Version
Cisco IOS XE Software, Version 17.16.01 ✓

# Verify All APs Rejoined
WLC-MUM-01# show ap summary
Total APs: 180
Registered: 180 ✓
Enabled: 180
Disabled: 0

# Verify WiFi 7 Feature Availability
WLC-MUM-01# show wireless wps summary
WiFi 7 Support: Enabled ✓
MLO Support: Enabled ✓
320 MHz Channels: Enabled ✓

# Check for Any Critical Alarms
WLC-MUM-01# show logging | include %CRIT
Expected: No critical errors

# Verify DNAC Communication
WLC-MUM-01# show ap config general MUM-AP-01 | include CAPWAP
CAPWAP Server IP: 10.252.40.50 (DNAC)
CAPWAP Status: Connected ✓
```

---

### 11.1.3 Rollback Procedure (If Issues Arise)

```bash
# If WLC upgrade causes issues, rollback to 17.15

# Reboot WLC with Previous Image
ssh admin@wlc-mum-01
WLC-MUM-01# conf t
WLC-MUM-01(config)# no boot system
WLC-MUM-01(config)# boot system bootflash:cat9k-wlc.17.15.01.SPA.bin
WLC-MUM-01(config)# end
WLC-MUM-01# write memory
WLC-MUM-01# reload

# After reboot, verify version
WLC-MUM-01# show version
Cisco IOS XE Software, Version 17.15.01 ✓

# Repeat for WLC-MUM-02 if needed

# Engage Cisco TAC if rollback required
# TAC Case Priority: P1 (Production Down)
```

---

### 11.1.4 WLC Upgrade for Other Sites

**Repeat for All Pilot Sites:**

| Site | WLC HA Pair | Upgrade Window | AP Count | Estimated Downtime |
|------|-------------|----------------|----------|-------------------|
| **Mumbai** | WLC-MUM-01/02 | Week 1, Sat 02:00-06:00 IST | 180 APs | <30 sec (failover) |
| **Chennai** | WLC-CHN-01/02 | Week 1, Sat 02:00-06:00 IST | 130 APs | <30 sec |
| **London** | WLC-LON-01/02 | Week 1, Sat 02:00-06:00 GMT | 155 APs | <30 sec |

**Note**: Bangalore Branch uses Mumbai WLCs (no separate upgrade needed)

---

## 11.2 Catalyst Center WiFi 7 Feature Enablement

### 11.2.1 DNAC Software Upgrade (2.3.5 → 2.3.7)

**Prerequisites:**

```bash
# Verify Current DNAC Version
ssh -l maglev 10.252.40.50

maglev@dnac-01:~$ magctl version show

Current Version: 2.3.5.6
Expected: 2.3.5.x before upgrading to 2.3.7

# Verify Cluster Health
maglev@dnac-01:~$ magctl service status

All Services: Running ✓
Cluster Health: GREEN

# Verify Disk Space
maglev@dnac-01:~$ df -h /data

/data: 1.2 TB available (minimum 500 GB required)
Expected: >500 GB free

# Backup DNAC Configuration
DNAC GUI > System > Settings > Backup & Restore > Create Backup
Backup Name: DNAC-Backup-PreUpgrade-20250515
Expected: Backup completes in 2-3 hours
```

**Download DNAC 2.3.7 Software:**

```bash
# Cisco.com Download (Authorized Users Only)
# Navigate to: Software Download > Network Management > DNA Center
# File: dnac_2_3_7_5.tar.gz (size: ~15 GB)

# Upload to DNAC
DNAC GUI > System > Software Management > Upload

# Or via SCP
scp dnac_2_3_7_5.tar.gz maglev@10.252.40.50:/data/

# Verify Upload
maglev@dnac-01:~$ ls -lh /data/dnac_2_3_7_5.tar.gz
Expected: File size ~15 GB
```

**DNAC Upgrade Procedure:**

```bash
# Initiate Upgrade (GUI)
DNAC GUI > System > Software Management
Select: dnac_2_3_7_5.tar.gz
Click: Upgrade

# Or via CLI
maglev@dnac-01:~$ magctl package upgrade dnac_2_3_7_5.tar.gz

# Upgrade Progress (3-Node Cluster):
# Node 1: Upgrade, reboot (30 min) - Cluster remains operational
# Node 2: Upgrade, reboot (30 min) - Cluster remains operational  
# Node 3: Upgrade, reboot (30 min) - Cluster remains operational
# Total: 90 minutes (rolling upgrade, zero downtime)

# Monitor Upgrade Progress
DNAC GUI > System > Software Management > Upgrade Status

# Or via CLI
maglev@dnac-01:~$ magctl package status

# Wait for all nodes to complete

# Verify New Version
maglev@dnac-01:~$ magctl version show
Current Version: 2.3.7.5 ✓

# Verify Cluster Health
maglev@dnac-01:~$ magctl service status
All Services: Running ✓
Cluster Health: GREEN
```

---

### 11.2.2 Enable WiFi 7 Features in DNAC

**Step 1: Verify WiFi 7 Support**

```bash
# DNAC GUI > Provision > Inventory > Wireless Controllers
# Select WLC-MUM-01
# Device Details > Software Version: 17.16.01 ✓

# DNAC GUI > Design > Network Settings > Wireless
# Verify "WiFi 7" option visible in dropdown
```

**Step 2: Create WiFi 7 SSID Template**

```bash
# DNAC GUI > Design > Network Settings > Wireless

# Click: Add SSID

SSID Configuration:
  SSID Name: Corp-Secure-7
  Security: WPA3 Enterprise
  Authentication Servers:
    - ISE-PSN-MUM-1 (10.252.30.10)
    - ISE-PSN-MUM-2 (10.252.30.11)
  Fast Transition (802.11r): Enabled
  WiFi 7 Features:
    - Multi-Link Operation (MLO): Enabled
    - MLO Mode: NSTR (Non-Simultaneous Tx/Rx)
    - 320 MHz Channels: Enabled (6 GHz only)
    - 4096-QAM: Enabled
  Radio Policy: 6 GHz Preferred
  VLAN: CORPORATE-MUM (10.252.2.0/24)
  QoS: Platinum (Voice/Video Priority)

# Save Template
```

**Step 3: Create WiFi 7 RF Profile**

```bash
# DNAC GUI > Design > Network Settings > Wireless > RF Profiles

# Click: Add RF Profile

RF Profile: MUM-WiFi7-High-Density

5 GHz Radio:
  Admin Status: Enabled
  Channel Width: 160 MHz
  Channel Assignment: DCA (Dynamic)
  Power Assignment: Auto (min -10 dBm, max 23 dBm)
  Data Rates: 802.11ax (6-24 Mbps mandatory)

6 GHz Radio:
  Admin Status: Enabled
  Channel Width: 320 MHz ✓
  Channel Assignment: Manual (Ch 31, 63, 95) ✓
  Power Assignment: Auto (min -5 dBm, max 20 dBm)
  Data Rates: 802.11be (6-24 Mbps mandatory) ✓

2.4 GHz Radio:
  Admin Status: Disabled (recommend disabling for high-density)

# Save Profile
```

**Step 4: Create Site-Specific WiFi 7 Configuration**

```bash
# DNAC GUI > Design > Network Hierarchy

# Navigate to: Global > India > Mumbai > Mumbai-HQ

# Assign RF Profile
Wireless Settings > RF Profile: MUM-WiFi7-High-Density

# Assign SSID
Wireless Settings > SSIDs:
  - Corp-Secure-7 (WiFi 7, WPA3-Enterprise)
  - Corp-Secure (WiFi 6, WPA3-Enterprise) - Keep for legacy clients

# Save
```

**Step 5: Provision WLC with WiFi 7 Configuration**

```bash
# DNAC GUI > Provision > Inventory

# Select: WLC-MUM-01
# Click: Actions > Provision Device

# Select:
  Site: Mumbai-HQ
  RF Profile: MUM-WiFi7-High-Density
  SSIDs: Corp-Secure-7, Corp-Secure

# Click: Provision

# DNAC pushes configuration to WLC
# Takes 5-10 minutes

# Verify Provisioning Status
DNAC GUI > Provision > Inventory > WLC-MUM-01
Status: Managed ✓
Last Sync: <timestamp> (recent)
```

---

## 11.3 RF Site Survey & Capacity Planning

### 11.3.1 Pre-Deployment RF Survey

**Tool**: Ekahau Site Survey (recommended) or other WiFi survey tools

**Survey Objectives:**

1. **Baseline Current WiFi 6/6E Performance**
   - RSSI coverage (-50 to -75 dBm)
   - SNR (>25 dB acceptable, >30 dB good)
   - Channel utilization (target <50%)
   - Identify dead zones, interference sources

2. **Plan WiFi 7 AP Placement**
   - 320 MHz channel plan (Ch 31, 63, 95)
   - Minimize co-channel interference
   - Ensure -65 dBm or better coverage for 6 GHz

3. **Validate 6 GHz Propagation**
   - 6 GHz has higher attenuation than 5 GHz
   - Expect 10-15% shorter range vs 5 GHz
   - Plan denser AP deployment if needed

**Survey Procedure (Mumbai Floor 6 - Executive Floor):**

```bash
# Step 1: Load Floor Plan into Ekahau
File > Import > Floor Plan (Mumbai-Floor6.pdf)
Set Scale: 1m = X pixels

# Step 2: Mark Existing AP Locations
Tools > Place APs > Mark current WiFi 6E AP locations (10 APs)

# Step 3: Conduct Active Survey (Current State)
Tools > Survey > Active Survey
Walk entire floor, collect samples every 5 meters
Duration: 1-2 hours (20,000 sq ft floor)

# Step 4: Analyze Current Performance
View > Heatmaps > RSSI (5 GHz)
View > Heatmaps > SNR
View > Heatmaps > Channel Utilization

# Document Issues:
- Dead zones: Areas with RSSI < -80 dBm
- Interference: Channel utilization > 70%
- Congestion: >20 clients per AP

# Step 5: Plan WiFi 7 AP Placement
Tools > Design Mode
Place 15 WiFi 7 APs (Catalyst 9178I-BE)
  - AP Model: C9178I-BE
  - Transmit Power: 17 dBm (6 GHz)
  - Channel: 320 MHz (Ch 31, 63, 95)
  - Antenna: Internal (4x4:4)

# Ekahau Predictive Model:
View > Predicted Heatmaps > 6 GHz
Verify: -65 dBm or better coverage across 90% of floor

# Step 6: Optimize AP Placement
Adjust AP locations to:
  - Eliminate dead zones
  - Minimize co-channel interference (>-82 dBm same-channel)
  - Balance client load (target: 5-6 clients per AP)

# Step 7: Generate Report
File > Reports > Coverage Report
  - RSSI Heatmap (6 GHz)
  - Channel Plan (Ch 31, 63, 95 assignment)
  - AP Count: 15 APs for Floor 6

# Save Report: Mumbai-Floor6-WiFi7-Survey.pdf
```

**Expected Survey Results (Mumbai Floor 6):**

| Metric | Current (WiFi 6E) | Target (WiFi 7) | Improvement |
|--------|------------------|----------------|-------------|
| **Average RSSI** | -65 dBm (5 GHz) | -60 dBm (6 GHz) | 5 dB better |
| **Coverage (-75 dBm)** | 85% of floor | 95% of floor | 10% more coverage |
| **Dead Zones** | 3 areas (corners) | 0 areas | Eliminated |
| **AP Count** | 10 APs (WiFi 6E) | 15 APs (WiFi 7) | 50% more APs (denser) |
| **Clients per AP** | 8 clients/AP | 5-6 clients/AP | Lower density, higher throughput |

---

### 11.3.2 Capacity Planning

**Objective**: Ensure WiFi 7 infrastructure can support user growth and bandwidth demands.

**Formula**:

```
Required APs = (Total Users × Avg Bandwidth per User) / (AP Throughput × Utilization Factor)

Example (Mumbai Floor 6 - Executive Floor):
  Total Users: 80 executives
  Avg Bandwidth per User: 500 Mbps (4K video + VDI + file transfers)
  AP Throughput: 5 Gbps (WiFi 7, 320 MHz, real-world)
  Utilization Factor: 0.6 (60% utilization target)

Required APs = (80 × 500 Mbps) / (5000 Mbps × 0.6)
             = 40,000 Mbps / 3000 Mbps
             = 13.3 APs
             ≈ 15 APs (round up for redundancy)
```

**Capacity Planning Worksheet (Per Floor):**

| Floor | Users | Avg BW/User | Total BW | APs Required | APs Deployed | Margin |
|-------|-------|-------------|----------|--------------|--------------|--------|
| **Floor 6 (Exec)** | 80 | 500 Mbps | 40 Gbps | 13 APs | 15 APs | 15% |
| **Floor 3 (AI)** | 40 cameras + 150 users | 150 Mbps (camera), 200 Mbps (user) | 36 Gbps | 12 APs | 10 APs | -17% ⚠️ |
| **Floor 2 (Conf)** | 150 users | 300 Mbps | 45 Gbps | 15 APs | 15 APs | 0% |

**Issue Identified**: Floor 3 (Edge AI) is slightly under-provisioned. **Resolution**: Add 2 more APs to Floor 3 (10 → 12 APs) to meet capacity.

---

## 11.4 Power & Uplink Infrastructure Validation

### 11.4.1 PoE++ Power Requirements

**WiFi 7 AP Power Consumption:**

| AP Model | PoE Standard | Typical Power | Max Power | Notes |
|----------|--------------|---------------|-----------|-------|
| **C9178I-BE** | PoE++ (802.3bt) | 40-50W | 60W | 4x4:4 tri-band, full transmit power |

**Validation Procedure:**

```bash
# Step 1: Inventory Existing Switches and PoE Budget

# Connect to Fabric Edge Switch
ssh admin@mum-fab-edge-01

# Check PoE Budget
MUM-FAB-EDGE-01# show power inline

Total Power Available: 1100W (Catalyst 9300-48U)
Total Power Allocated: 650W
Total Power Remaining: 450W

# WiFi 7 AP Requirement: 60W × 15 APs (Floor 6) = 900W
# Issue: 450W remaining < 900W required ❌

# Step 2: Calculate PoE Deficit
Required: 900W
Available: 450W
Deficit: 450W

# Step 3: Solutions
Option A: Add PoE Injectors (Pilot - Temporary)
  • Cisco PWR-IE170W-PC-AC (170W midspan injector)
  • Cost: ~$500 per injector
  • Quantity: 15 injectors for Floor 6
  • Total: $7,500

Option B: Upgrade Switch (Production - Long-Term)
  • Catalyst 9300-48UN (2400W PoE budget)
  • Cost: ~$18,000 per switch
  • Recommended for Phase 5B rollout

# Decision for Phase 5A Pilot: Use PoE Injectors
```

**PoE Injector Deployment:**

```bash
# Physical Installation (Per AP)

1. Install PoE Injector near IDF closet
   - Mount on rack or wall near patch panel
   - AC power: 110-240V (US/India compatible)

2. Cable Connection:
   Data In: Patch panel (from fabric edge switch) → PoE Injector "Data In"
   Data+PoE Out: PoE Injector "PoE Out" → WiFi 7 AP
   Power In: AC outlet → PoE Injector "Power"

3. Label Cables:
   "Floor 6 - AP-01 - PoE Injector"

4. Verify PoE Output:
   Use PoE tester or connect AP, check AP boots successfully

# Repeat for all 15 APs on Floor 6
```

---

### 11.4.2 Uplink Bandwidth Validation

**Requirement**: 10 Gbps uplinks for WiFi 7 APs (2x 10G SFP+ per stack for redundancy)

**Validation Procedure:**

```bash
# Step 1: Verify Uplink Capacity

ssh admin@mum-fab-edge-01

# Check Uplink Interfaces
MUM-FAB-EDGE-01# show interfaces status | include TenGigabitEthernet

Te1/0/49: connected, 10G, SFP-10G-SR (uplink to core)
Te1/0/50: connected, 10G, SFP-10G-SR (uplink to core)

Expected: 2x 10G uplinks ✓

# Step 2: Verify Uplink Utilization (Current State)
MUM-FAB-EDGE-01# show interfaces TenGigabitEthernet1/0/49 | include rate

5 minute input rate: 1.2 Gbps (12% utilization)
5 minute output rate: 2.4 Gbps (24% utilization)

# Current: 2.4 Gbps peak (24% of 10 Gbps)
# WiFi 7: 50 APs × 4 Gbps avg = 200 Gbps potential (worst case)
# Realistic: 50 APs × 1 Gbps avg = 50 Gbps
# With 2x 10G uplinks = 20 Gbps aggregate

# Oversubscription: 50 Gbps / 20 Gbps = 2.5:1
# Acceptable for bursty traffic (users not at max simultaneously)

Expected: <5:1 oversubscription ✓
```

**Issue: Bangalore Branch Has Only 1G Uplinks**

```bash
# Bangalore Branch: Upgrade Required

ssh admin@ban-access-01

# Current Uplinks
BAN-ACCESS-01# show interfaces status | include GigabitEthernet

Gi1/0/49: connected, 1G, RJ45 (uplink to core)
Gi1/0/50: connected, 1G, RJ45 (uplink to core)

# 2x 1G = 2 Gbps aggregate
# WiFi 7: 10 APs × 1 Gbps avg = 10 Gbps potential
# Oversubscription: 10 Gbps / 2 Gbps = 5:1 (marginal) ⚠️

# Solution: Upgrade to 10G Uplinks
# Required Hardware:
  • 2x 10G SFP+ modules (C9300-NM-8X)
  • 2x 10G SFP+ cables (10m)
  • Cost: ~$4,000 total

# Installation Timeline: Week 2 (before AP deployment)
```

---

## 11.5 Procurement & Staging Checklist

### 11.5.1 Hardware Procurement

**Phase 5A Pilot Procurement List:**

| Item | Model | Quantity | Unit Cost | Total Cost | Lead Time |
|------|-------|----------|-----------|------------|-----------|
| **WiFi 7 APs** | Catalyst 9178I-BE | 115 | $5,000 | $575,000 | 4-6 weeks |
| **PoE Injectors** | PWR-IE170W-PC-AC | 115 | $500 | $57,500 | 2-3 weeks |
| **10G SFP+ Modules** | C9300-NM-8X | 4 | $500 | $2,000 | 1-2 weeks |
| **10G SFP+ Cables** | SFP-10G-SR (10m) | 8 | $250 | $2,000 | 1-2 weeks |
| **Mounting Hardware** | Ceiling mount brackets | 115 | $50 | $5,750 | 1 week |
| **TOTAL** | - | - | - | **$642,250** | - |

**Procurement Timeline:**

| Week | Activity | Owner | Status |
|------|----------|-------|--------|
| **Week -8** | Submit purchase order to Cisco | Procurement | ✓ Order placed |
| **Week -4** | Hardware arrives at distribution center | Logistics | In transit |
| **Week -2** | Hardware staged at pilot sites | Facilities | Pending |
| **Week 1** | WLC/DNAC software upgrades | Network Team | Week 1 activity |
| **Week 5** | AP installation begins | Installation Team | Week 5 activity |

---

### 11.5.2 Staging & Inventory Management

**Staging Location: Mumbai HQ - IDF Room (Floor 1)**

```yaml
Staging Checklist:

Week -2: Hardware Arrival and Inspection
  ✓ Receive 115 WiFi 7 APs (5 boxes of 23 APs each)
  ✓ Verify packaging intact (no damage during shipping)
  ✓ Unbox and inventory:
    - 115 APs: Check MAC address labels, serial numbers
    - 115 PoE injectors
    - 115 ceiling mount kits
    - Ethernet cables (if not using existing)
  ✓ Verify AP model: C9178I-BE (check label on each AP)
  ✓ Test sample AP:
    - Connect to PoE injector
    - Verify AP boots (LEDs: solid green after 3-5 min)
    - Connect console cable, verify IOS-XE version

Week -1: Pre-Configuration (Optional)
  ✓ Pre-configure AP names via console (speeds up deployment)
  ✓ Label each AP with site/floor/location:
    Example: "MUM-Floor6-AP01" (physical label on AP)
  ✓ Organize by floor:
    - Floor 6: 15 APs (labeled, stacked in box)
    - Floor 3: 10 APs
    - Floor 2: 15 APs

Week 1: Ready for Installation
  ✓ Coordinate with Facilities for ceiling access
  ✓ Confirm installation team schedule (Week 5 start)
  ✓ Notify building management (after-hours access required)
```

---

## 11.6 Day-0 Completion Checklist

**CRITICAL**: All items must be ✓ before proceeding to Day-N deployment (Week 5).

### Master Checklist:

| Task | Owner | Deadline | Status |
|------|-------|----------|--------|
| **WLC Upgrade** | Network Team | Week 1 | ⬜ |
| - Mumbai WLCs upgraded to 17.16 | Network Ops | Week 1, Sat | ⬜ |
| - Chennai WLCs upgraded to 17.16 | Network Ops | Week 1, Sat | ⬜ |
| - London WLCs upgraded to 17.16 | Network Ops | Week 1, Sat | ⬜ |
| - All WLCs validated, no P1 issues | Network Ops | Week 1, Sun | ⬜ |
| **DNAC Upgrade** | Network Team | Week 2 | ⬜ |
| - DNAC upgraded to 2.3.7 | Network Ops | Week 2, Mon | ⬜ |
| - WiFi 7 templates created | Network Architect | Week 2, Tue | ⬜ |
| - RF profiles configured | Network Architect | Week 2, Wed | ⬜ |
| **RF Site Survey** | Network Team | Week 3 | ⬜ |
| - Mumbai Floor 6 survey complete | RF Engineer | Week 3, Mon | ⬜ |
| - Mumbai Floor 3 survey complete | RF Engineer | Week 3, Tue | ⬜ |
| - Mumbai Floor 2 survey complete | RF Engineer | Week 3, Wed | ⬜ |
| - Chennai surveys complete | RF Engineer | Week 3, Thu-Fri | ⬜ |
| - Bangalore survey complete | RF Engineer | Week 3, Fri | ⬜ |
| - London surveys complete | RF Engineer (remote) | Week 3, Fri | ⬜ |
| **Power Infrastructure** | Facilities + Network | Week 3 | ⬜ |
| - PoE injectors received (115 units) | Procurement | Week 3, Mon | ⬜ |
| - PoE injectors installed (Mumbai) | Facilities | Week 3, Wed-Thu | ⬜ |
| - PoE validation complete | Network Ops | Week 3, Fri | ⬜ |
| - Bangalore 10G uplinks installed | Network Ops | Week 3, Tue | ⬜ |
| **Hardware Procurement** | Procurement + Logistics | Week 4 | ⬜ |
| - WiFi 7 APs received (115 units) | Logistics | Week 4, Mon | ⬜ |
| - APs inventoried and labeled | Facilities | Week 4, Tue | ⬜ |
| - Sample APs tested (5 units) | Network Ops | Week 4, Wed | ⬜ |
| - APs staged by floor | Facilities | Week 4, Thu | ⬜ |
| **Documentation & Training** | Network Team | Week 4 | ⬜ |
| - Deployment runbook finalized | Network Architect | Week 4, Mon | ⬜ |
| - NOC team trained (WiFi 7) | Network Ops Manager | Week 4, Wed | ⬜ |
| - Helpdesk trained (FAQ) | Helpdesk Manager | Week 4, Thu | ⬜ |
| - User communication sent | IT Communications | Week 4, Fri | ⬜ |

### Go/No-Go Decision (End of Week 4):

**Criteria for "GO" to Day-N Deployment:**
✅ All Day-0 checklist items complete (100%)  
✅ WLCs running 17.16, DNAC running 2.3.7  
✅ RF surveys complete, AP placements finalized  
✅ Power infrastructure validated (PoE, uplinks)  
✅ Hardware received, tested, staged  
✅ Team trained, documentation ready  

**Criteria for "NO-GO" (Delay to Week 6):**
❌ Any P1 issues with WLC/DNAC upgrades  
❌ Hardware not received or defective (>10% failure rate)  
❌ Critical team members unavailable  
❌ Major facility issues (power outage, construction)  

**Decision Maker**: CTO + Network Architecture Lead

**Decision Date**: Friday, Week 4 (5:00 PM)
