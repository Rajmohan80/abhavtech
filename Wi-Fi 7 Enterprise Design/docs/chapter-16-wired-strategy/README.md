# CHAPTER 16: REMAINING WIRED INFRASTRUCTURE STRATEGY

## 16.1 Wired Infrastructure Overview

### 16.1.1 Current vs Target State

**Infrastructure Evolution (Phase 5 Impact):**

```yaml
Current State (Pre-Phase 5):
  Total Wired Access Ports: 15,840
  Access Switches: 330 (Catalyst 9300 series)
  Wireless Adoption: 30% (legacy WiFi 5/6)
  Wired-Dependent Users: 70% (11,088 users)

Target State (Post-Phase 5B, Q2 2026):
  Total Wired Access Ports: 7,350 (-54% reduction)
  Access Switches: 186 (-144 switches decommissioned)
  Wireless Adoption: 85% (WiFi 7)
  Wired-Dependent Users: 15% (2,238 users)

Transition Strategy:
  • Category A (Wireless-First): 90% migrate to wireless
  • Category B (Wireless-Optional): 70% migrate to wireless
  • Category C (Wired-Preferred): 10% migrate to wireless (hoteling desks only)
  • Category D (Wired-Only): 0% migrate (remain wired permanently)
```

**Cost Reduction Benefits:**

```yaml
Switch Infrastructure Reduction:
  • 144 switches decommissioned (330 → 186 switches)
  • 54% reduction in access switch count
  • Avoided hardware refresh costs (switches reaching EOL)
  • Reduced infrastructure footprint (rack space, IDF requirements)

Operational Efficiency Gains:
  • Power Consumption: 144 fewer switches (350W each) = 50,400W reduction
  • Cooling Requirements: Reduced HVAC load in IDFs (30% of power consumption)
  • Maintenance Overhead: Fewer devices to monitor, patch, upgrade
  • Cabling Infrastructure: Reduced moves/adds/changes operations
  • Data Center Space: Reclaimed rack space for other infrastructure

Strategic Benefits:
  • Infrastructure Simplification: Fewer failure points, easier management
  • Wireless-First Workspace: Modern, cable-free work environment
  • Organizational Agility: Office reconfigurations no longer require re-cabling
  • Green Initiative: Reduced power consumption aligns with sustainability goals
```

---

### 16.1.2 15% Wired Strategy Rationale

**Why Keep Wired for 15%?**

```yaml
Business Justification:
  1. Mission-Critical Devices (Category D)
     • Servers: 450 devices (10G/25G NICs, latency-sensitive)
     • Network Infrastructure: 200 devices (switches, routers, firewalls)
     • Building Automation: 300 devices (HVAC, lighting, security)
     • Security Cameras (Wired): 240 devices (PoE-powered, 24/7 uptime)
     • Subtotal: 1,190 devices (7.5% of total)
  
  2. Wired-Preferred Devices (Category C)
     • Desktop PCs: 3,200 devices (90% remain wired, 10% hoteling wireless)
     • IP Phones: 800 devices (PoE-powered, keep wired for reliability)
     • Printers/MFPs: 250 devices (100% wired, heavy data transfer)
     • Legacy Devices: 200 devices (no WiFi capability)
     • Subtotal: 4,450 devices (28% of total, but 90% remain wired = 4,005)
  
  3. On-Demand Wired Access (Categories A+B)
     • Executive wired fallback: 420 ports (if wireless issues)
     • Employee wired fallback: 1,800 ports (hoteling, conference rooms)
     • Subtotal: 2,220 ports (14% of total)

Total Wired Ports Required: 1,190 + 4,005 + 2,220 = 7,415 ports
  • Add 20% spare capacity: 7,415 × 1.2 = 8,900 ports
  • Switches needed: 8,900 / 48 ports per switch = 186 switches ✓
```

---

## 16.2 Category C: Wired-Preferred Devices

### 16.2.1 Desktop PCs (3,200 Devices)

**Desktop Strategy:**

```yaml
Current: 3,200 desktop PCs (100% wired, 1 Gbps)
Target: 2,880 wired (90%), 320 wireless (10% hoteling desks)

Rationale for Keeping Wired:
  • Desktops typically stationary (no mobility benefit from wireless)
  • Cost: Desktop PCs lack WiFi adapters (would require USB adapters)
  • Performance: 1 Gbps wired sufficient for desktop use cases
  • PoE consideration: Some desktops use PoE for IP phones (twinax cable)

Wireless Migration (10%, Hoteling Desks):
  • Use Case: Hoteling desks (shared, multiple users per week)
  • Deployment: USB WiFi 7 adapters for hoteling desktop PCs
  • Performance: 2.4 Gbps (2×2 MIMO, 160 MHz) - exceeds 1 Gbps wired
  • Benefit: No need to activate wired port when user changes desks

Example Deployment (Mumbai Floor 3, Hoteling Area):
  • 40 hoteling desks (shared by 120 employees)
  • Install: USB WiFi 7 adapters on desktop PCs
  • Decommission: 40 wired ports (no longer needed)
  • Infrastructure Reduction: 1 switch decommissioned (48 ports freed)

Implementation Timeline:
  • Phase 5B-Wave 2 (Q4 2025): Pilot 40 hoteling desks (Mumbai)
  • Phase 5B-Wave 3 (Q2 2026): Expand to 320 hoteling desks (all sites)
```

---

### 16.2.2 IP Phones (800 Devices)

**IP Phone Strategy:**

```yaml
Current: 800 Cisco IP Phones (100% wired, PoE)
Target: 800 wired (100% remain wired)

Rationale for Keeping Wired:
  • PoE: Phones require PoE (15W, 802.3af) for power
  • Reliability: Wired more reliable than wireless (99.99% uptime for voice)
  • QoS: Wired guarantees voice QoS (no wireless contention)
  • Battery: Wireless IP phones require charging (wired phones don't)

Alternative Considered (Rejected):
  • DECT Wireless IP Phones (Cisco 8821)
    - Pros: Mobility (walk around during calls)
    - Cons: Battery management (6-hour talk time), higher device cost vs wired
    - Decision: Not justified for Abhavtech (desk phones sufficient)

Wireless Migration: 0% (all phones remain wired)

Wired Infrastructure Requirements:
  • 800 PoE ports (802.3af, 15W per port)
  • Dedicated voice VLAN (VLAN 50, QoS priority)
  • Redundant uplinks (phones are mission-critical)
```

---

### 16.2.3 Printers/MFPs (250 Devices)

**Printer Strategy:**

```yaml
Current: 250 printers/MFPs (100% wired, 1 Gbps)
Target: 250 wired (100% remain wired)

Rationale for Keeping Wired:
  • Heavy Data Transfer: Large print jobs (100+ MB PDFs) require reliable connection
  • Scanning: MFPs scan to network shares (high bandwidth, low latency)
  • Always-On: Printers must be always available (no power-saving wireless sleep modes)
  • Security: Wired reduces attack surface (no WiFi vulnerabilities)

Example Printer Model:
  • HP LaserJet Enterprise MFP E82650z
  • Wired: 1 Gbps Ethernet (sufficient for print/scan)
  • WiFi: Optional WiFi 6 module (not used at Abhavtech)

Wireless Migration: 0% (all printers remain wired)

Wired Infrastructure Requirements:
  • 250 Gigabit ports (1 Gbps sufficient, no need for mGig)
  • Print VLAN (VLAN 60, separate from user VLANs)
  • Access via SGT 21 (IoT Devices) for Zero Trust enforcement
```

---

## 16.3 Category D: Wired-Only Devices

### 16.3.1 Servers (450 Devices)

**Server Strategy:**

```yaml
Current: 450 servers (100% wired, 10G/25G)
Target: 450 wired (100% remain wired permanently)

Rationale for Wired-Only:
  • High Bandwidth: Servers require 10 Gbps or 25 Gbps (WiFi 7 max: 5.8 Gbps)
  • Low Latency: Mission-critical apps require <1ms latency (wired: 0.1ms, WiFi: 3-5ms)
  • Reliability: Servers require 99.99% uptime (wired more stable than wireless)
  • Security: DMZ servers must not have wireless connectivity (air-gap requirement)

Server Types:
  • Application Servers: 200 (10 Gbps NICs)
  • Database Servers: 150 (25 Gbps NICs, high I/O)
  • Storage Servers: 50 (25 Gbps NICs, NAS/SAN)
  • Edge AI Servers: 50 (UCS XE9305, 25 Gbps for inference)

Wired Infrastructure Requirements:
  • 450 ports: 10 Gbps (350 servers) + 25 Gbps (100 servers)
  • Fabric Border Nodes: Catalyst 9500 (40G/100G uplinks to core)
  • Redundancy: Dual NICs per server (active-active, 802.3ad LACP)
  • VLAN: Server VLAN (VLAN 80, SGT 80 for Zero Trust)
```

---

### 16.3.2 Network Infrastructure (200 Devices)

**Infrastructure Strategy:**

```yaml
Current: 200 infrastructure devices (100% wired)
Target: 200 wired (100% remain wired permanently)

Infrastructure Devices:
  • Switches: 186 access switches (post-Phase 5B, down from 330)
  • Routers: 10 (WAN edge, MPLS, internet)
  • Firewalls: 4 (Cisco FTD, perimeter security)
  • WLCs: 4 (Catalyst 9800-40, HA pairs)

Rationale for Wired-Only:
  • Management: Infrastructure must be reachable even if wireless fails
  • Out-of-Band: Console access requires physical wired connection
  • Security: Management plane must be isolated from wireless (air-gap)
  • Reliability: 99.999% uptime requirement (wireless cannot meet this)

Wired Infrastructure Requirements:
  • Management VLAN (VLAN 100, isolated from production)
  • Out-of-Band Management: Separate physical network (console servers)
  • 10 Gbps uplinks: Switches interconnected via 10G fiber
  • SGT 90 (Infrastructure): Zero Trust enforcement (deny user access)
```

---

### 16.3.3 Building Automation (BMS) (300 Devices)

**BMS Strategy:**

```yaml
Current: 300 BMS devices (100% wired)
Target: 300 wired (100% remain wired permanently)

BMS Device Types:
  • HVAC Controllers: 120 (climate control, 24/7 operation)
  • Lighting Controllers: 80 (automated lighting, energy management)
  • Access Control: 60 (badge readers, door locks)
  • Fire Alarm System: 40 (life safety, must be wired per code)

Rationale for Wired-Only:
  • Life Safety: Fire alarm system must be wired (local fire code requirement)
  • 24/7 Operation: BMS devices cannot tolerate wireless outages
  • Security: BACnet protocol (BMS) must be isolated from corporate network
  • Maintenance: BMS devices have 10-20 year lifespan (WiFi 7 will be obsolete)

Wired Infrastructure Requirements:
  • BMS VLAN (VLAN 150, isolated from corporate network)
  • BACnet Protocol: UDP/IP (BACnet/IP, port 47808)
  • Firewall Rules: Deny BMS → Corporate (Zero Trust, SGT-based)
  • Physical Isolation: Dedicated switch ports (no shared VLANs)
```

---

### 16.3.4 Security Cameras (Wired, 240 Devices)

**Wired Camera Strategy:**

```yaml
Current: 240 wired PoE cameras (Axis P-series)
Target: 240 wired (100% remain wired)

Note: Separate from WiFi 7 Edge AI cameras (40 cameras, wireless)

Rationale for Wired-Only:
  • PoE: Cameras require PoE+ (25W, 802.3at) for power + IR illuminators
  • 24/7 Recording: Cannot tolerate wireless outages (security requirement)
  • Bandwidth: 4K cameras use 12-15 Mbps sustained (wired more reliable)
  • Compliance: Some jurisdictions require wired cameras for evidence admissibility

Camera Types:
  • Indoor Dome: 120 cameras (corridors, offices)
  • Outdoor Bullet: 80 cameras (parking lots, perimeter)
  • PTZ (Pan-Tilt-Zoom): 40 cameras (auditoriums, high-security areas)

Wired Infrastructure Requirements:
  • 240 PoE+ ports (25W per camera)
  • Camera VLAN (VLAN 130, isolated from corporate)
  • NVR (Network Video Recorder): 10 servers (40TB storage each)
  • SGT 21 (IoT Devices): Zero Trust enforcement
```

---

## 16.4 Switch Decommissioning Plan

### 16.4.1 Decommissioning Workflow

**144-Switch Decommissioning Process:**

```yaml
Phase 1: Identify Candidate Switches (Week 1-4)
  Criteria for Decommissioning:
    • Port Utilization: <25% (less than 12 ports in use out of 48)
    • User Migration: >80% of users on floor migrated to wireless
    • Redundancy: Redundant switch available (HSRP/VSS pair)
  
  Identification Method:
    • DNAC: Port Utilization Report (threshold: <25%)
    • Example: Mumbai Floor 6, Switch MUM-F6-Edge-03
      - 48 ports total
      - 8 ports in use (17% utilization) ← Candidate for decommissioning
      - Users migrated: 78 of 80 (97.5%)

Phase 2: Plan Port Consolidation (Week 5-8)
  Objective: Migrate remaining 8 ports from MUM-F6-Edge-03 to MUM-F6-Edge-01
  
  Migration Steps:
    1. Document current connections (port mapping)
       • Port 1: Desktop PC (john.desk@10.252.10.50)
       • Port 2: IP Phone (john.phone@10.252.50.10)
       • ... (8 ports total)
    
    2. Identify target switch (MUM-F6-Edge-01)
       • Available ports: 18 of 48 (37% utilization, room for 8 more)
    
    3. Schedule migration window (Saturday, 8 AM - 12 PM)
       • Impact: 8 users (1 hour outage per user)
       • Communication: 2-week advance notice

Phase 3: Execute Migration (Week 9, Saturday Maintenance Window)
  Step 1: Pre-Migration (8:00 AM)
    • Verify target switch (MUM-F6-Edge-01) available ports
    • Prepare patch cables (8× Cat6A, 10 ft)
    • Print port mapping (source → destination)
  
  Step 2: Port-by-Port Migration (8:15 AM - 10:00 AM)
    For each port (1-8):
      • Disconnect cable from MUM-F6-Edge-03, Port X
      • Connect cable to MUM-F6-Edge-01, Port Y
      • Verify connectivity (ping test, user device online)
      • Update port mapping (document new location)
  
  Step 3: Validation (10:00 AM - 10:30 AM)
    • Verify all 8 devices online (DNAC Inventory)
    • Test user connectivity (VoIP call, web browsing)
    • Confirm no errors (show interface <port> | include error)
  
  Step 4: Decommission Switch (10:30 AM - 11:00 AM)
    • Shut down switch: shutdown (IOS XE CLI)
    • Disconnect power cable (PoE budget released)
    • Disconnect uplinks (fiber, 10G)
    • Remove from rack (4U space reclaimed)
  
  Step 5: DNAC Update (11:00 AM - 11:30 AM)
    • DNAC: Mark switch as "Decommissioned"
    • Update network topology (remove from fabric)
    • Update documentation (network diagram)

Phase 4: Asset Disposition (Week 10+)
  Options:
    1. Redeployment: Use for other sites (spare pool)
    2. RMA Credit: Return to Cisco for credit (if under warranty)
    3. Resale: Sell to secondary market (recover value)
    4. Recycling: E-waste recycling (certified vendor)
  
  Abhavtech Decision: Redeployment
    • Keep 20 switches as spares (hot spares, RMA pool)
    • Redeploy 124 switches to other sites (new offices, expansions)
    • SMART contract: Transfer licenses to redeployed switches
```

---

### 16.4.2 Decommissioning Timeline

**144-Switch Decommissioning Schedule:**

```yaml
Phase 5B-Wave 1 (Q3 2025, Week 17-30):
  • Sites: 6 HQ sites (New Jersey, Dallas, Frankfurt, Singapore, Tokyo, Sydney)
  • Users Migrated: 3,900 users (75% wireless adoption)
  • Switches Decommissioned: 30 switches
  • Method: Port consolidation (migrate ports to remaining switches)

Phase 5B-Wave 2 (Q4 2025 - Q1 2026, Week 31-52):
  • Sites: 8 regional sites
  • Users Migrated: 4,680 users (78% wireless adoption)
  • Switches Decommissioned: 60 switches
  • Milestone: 50% of decommissioning complete (90 of 144 switches)

Phase 5B-Wave 3 (Q2 2026, Week 53-65):
  • Sites: 5 branch sites
  • Users Migrated: 1,955 users (85% wireless adoption)
  • Switches Decommissioned: 54 switches
  • Completion: 144 switches decommissioned ✓

Post-Wave 3 (Q3 2026, Week 66+):
  • Asset Disposition: Redeployment (20 spares), RMA (50 switches), Resale (74 switches)
  • Documentation: Update network diagrams, DNAC inventory, CMDB
  • Asset Management: Track decommissioned switches (redeployment, RMA, resale)
```

---

## 16.5 Wired Port Design (Post-Phase 5B)

### 16.5.1 Port Allocation Strategy

**Wired Port Requirements by Site (Post-Phase 5B):**

```yaml
Mumbai HQ (Flagship Site):
  Current: 2,400 wired ports (50 switches)
  Target: 1,200 wired ports (25 switches, -50% reduction)
  
  Breakdown:
    • Servers: 80 ports (10G/25G)
    • Network Infrastructure: 25 ports
    • BMS: 50 ports
    • Wired Cameras: 40 ports
    • Desktop PCs: 400 ports (engineering, ops)
    • IP Phones: 120 ports
    • Printers: 40 ports
    • On-Demand Wired: 200 ports (hoteling, conference rooms)
    • Spare: 245 ports (20% spare capacity)
    Total: 1,200 ports ÷ 48 ports/switch = 25 switches ✓

Chennai Regional HQ:
  Current: 1,680 ports (35 switches)
  Target: 840 ports (18 switches, -50% reduction)
  
  Breakdown:
    • Servers: 60 ports
    • Network Infrastructure: 18 ports
    • BMS: 35 ports
    • Wired Cameras: 30 ports
    • Desktop PCs: 280 ports
    • IP Phones: 80 ports
    • Printers: 25 ports
    • On-Demand Wired: 140 ports
    • Spare: 172 ports (20%)
    Total: 840 ports ÷ 48 = 18 switches ✓

[Similar breakdown for remaining 17 sites...]

Total (All 19 Sites):
  Current: 15,840 ports (330 switches)
  Target: 7,350 ports (186 switches, -54% reduction) ✓
```

---

### 16.5.2 Port Types & Configuration

**Standardized Port Profiles:**

```yaml
Port Profile 1: Desktop PC
  Speed: 1 Gbps (auto-negotiation)
  PoE: Disabled (desktops don't require PoE)
  VLAN: VLAN 10 (CORP-GENERAL)
  802.1X: Enabled (device authentication)
  SGT: Device-based (SGT 16 = Desktop PCs)
  
  IOS XE Configuration:
    interface GigabitEthernet1/0/1
      description Desktop-PC-john.desk
      switchport mode access
      switchport access vlan 10
      authentication port-control auto
      dot1x pae authenticator
      power inline never
      spanning-tree portfast
      spanning-tree bpduguard enable

Port Profile 2: IP Phone (+ PC)
  Speed: 1 Gbps
  PoE: 802.3af (15W, Class 3)
  Voice VLAN: VLAN 50
  Data VLAN: VLAN 10 (for PC behind phone)
  802.1X: Enabled (MAB for phone, 802.1X for PC)
  SGT: SGT 71 (IP Phones)
  
  IOS XE Configuration:
    interface GigabitEthernet1/0/2
      description IP-Phone-john.phone + PC
      switchport mode access
      switchport access vlan 10
      switchport voice vlan 50
      power inline auto max 15000  # 15W
      authentication port-control auto
      mab
      dot1x pae authenticator
      spanning-tree portfast

Port Profile 3: Server (10 Gbps)
  Speed: 10 Gbps (fixed, no auto-negotiation)
  PoE: Disabled
  VLAN: VLAN 80 (SERVERS)
  802.1X: Disabled (server uses static config)
  SGT: SGT 80 (Servers)
  
  IOS XE Configuration:
    interface TenGigabitEthernet1/0/1
      description Server-app-server-01
      switchport mode access
      switchport access vlan 80
      speed 10000
      duplex full
      no authentication port-control
      spanning-tree portfast disable  # Servers may be virtualized, no portfast

Port Profile 4: Printer/MFP
  Speed: 1 Gbps
  PoE: Disabled
  VLAN: VLAN 60 (PRINT)
  802.1X: Enabled (MAB, MAC-based authentication)
  SGT: SGT 21 (IoT Devices)
  
  IOS XE Configuration:
    interface GigabitEthernet1/0/3
      description Printer-HP-MFP-Floor6
      switchport mode access
      switchport access vlan 60
      authentication port-control auto
      mab
      spanning-tree portfast

Port Profile 5: BMS Device
  Speed: 100 Mbps (many BMS devices are 10/100)
  PoE: Disabled
  VLAN: VLAN 150 (BMS, isolated)
  802.1X: Disabled (legacy BMS devices don't support)
  SGT: None (BMS isolated from corporate network)
  
  IOS XE Configuration:
    interface GigabitEthernet1/0/4
      description BMS-HVAC-Controller-Floor6
      switchport mode access
      switchport access vlan 150
      speed 100
      duplex full
      no authentication port-control
      spanning-tree portfast

Port Profile 6: On-Demand Wired (Hoteling)
  Speed: 1 Gbps / mGig (auto-negotiation, 1G/2.5G/5G/10G)
  PoE: Disabled (users bring own laptops)
  VLAN: Dynamic (assigned by ISE based on user)
  802.1X: Enabled (user authentication)
  SGT: User-based (SGT 11/15/16 based on AD group)
  
  IOS XE Configuration:
    interface GigabitEthernet1/0/5
      description Hoteling-Desk-Floor6-01
      switchport mode access
      authentication port-control auto
      dot1x pae authenticator
      spanning-tree portfast
      spanning-tree bpduguard enable
```

---

## 16.6 Wired-Wireless Integration

### 16.6.1 Fabric Integration (SD-Access)

**Unified Fabric (Wired + Wireless):**

```yaml
SD-Access Architecture:
  Fabric Underlay:
    • IS-IS routing (IGP)
    • 10G/40G fiber interconnects
    • Anycast gateway (VXLAN VTEP on every switch)
  
  Fabric Overlay:
    • VXLAN encapsulation (Layer 2 over Layer 3)
    • LISP (Locator/ID Separation Protocol)
    • SGT inline tagging (TrustSec)

Wired Clients:
  • Connect to Fabric Edge Switch (Catalyst 9300)
  • 802.1X authentication → ISE assigns SGT
  • Switch tags traffic with SGT (802.1Q 4-byte extension)
  • Traffic encapsulated in VXLAN, routed through fabric

Wireless Clients:
  • Connect to WiFi 7 AP (Catalyst 9178I-BE)
  • 802.1X authentication → ISE assigns SGT
  • WLC tags traffic with SGT
  • AP forwards to Fabric Edge Switch → VXLAN encapsulation

Key Integration Point:
  • Wired and wireless clients in same VXLAN (same L2 domain)
  • Example: Wired desktop (10.252.10.50) and wireless laptop (10.252.10.55)
    can communicate directly (same VLAN 10, same subnet)
  • SGACL applies equally to both (Zero Trust enforcement)
```

---

### 16.6.2 SGACL Enforcement (Wired + Wireless)

**Zero Trust Policy Consistency:**

```yaml
Scenario: Wired Desktop (SGT 16) → Wireless Executive Laptop (SGT 11)

Traffic Flow:
  Step 1: Wired desktop sends packet to wireless laptop
    • Source: 10.252.10.50 (Desktop PC, SGT 16)
    • Destination: 10.252.10.55 (Executive Laptop, SGT 11)
  
  Step 2: Fabric Edge Switch (Ingress)
    • Receives packet from desktop
    • Tags packet with SGT 16 (inline tagging)
    • SGACL Check: SGT 16 → SGT 11 = ?
  
  Step 3: SGACL Policy Lookup (ISE)
    • Source SGT: 16 (Desktop PCs)
    • Destination SGT: 11 (Executives)
    • Policy: Deny (desktops cannot communicate with executives, security policy)
    • Action: Drop packet ✗
  
  Step 4: Logging (Splunk)
    • Event: "SGACL Deny: SGT 16 → SGT 11"
    • Source: 10.252.10.50 (Desktop)
    • Destination: 10.252.10.55 (Laptop)
    • Reason: Security policy (prevent lateral movement)

Result: Zero Trust enforced consistently for wired and wireless ✓
```

---

## 16.7 Future-Proofing Strategy

### 16.7.1 5-Year Wired Infrastructure Plan

**Wired Infrastructure Roadmap (2026-2031):**

```yaml
Year 1 (2026): Consolidation
  • Complete Phase 5B decommissioning (144 switches)
  • Stabilize at 186 access switches
  • Monitor: Port utilization, user complaints

Year 2 (2027): Optimization
  • Review: Port utilization per site (target: 50-70%)
  • Decommission: Additional 20 switches (if utilization <40%)
  • Upgrade: Fabric underlay to 100G (core/border nodes)

Year 3 (2028): WiFi 8 Evaluation
  • Technology: WiFi 8 (802.11bn, expected 2028)
  • Features: 10+ Gbps per client, ultra-low latency (<1ms)
  • Decision: Pilot WiFi 8 in executive floors (evaluate if wired replacement)

Year 4 (2029): Server Wireless Evaluation
  • Technology: 60 GHz wireless (WiGig 2.0, 25 Gbps)
  • Use Case: Short-range server-to-server communication
  • Pilot: 10 servers in data center (evaluate vs 25G wired)
  • Decision: Likely remain wired (60 GHz range <10m, not practical)

Year 5 (2030): Wired Steady-State
  • Projection: 15% of devices remain wired (steady-state)
  • Wired Infrastructure: 186 switches (no further reduction)
  • Investment: Refresh switches (Catalyst 9300 EOL ~2033, 10-year lifespan)
```

---

### 16.7.2 Emerging Technologies

**Technologies to Watch:**

```yaml
1. WiFi 8 (802.11bn, ~2028)
   • Throughput: 10+ Gbps per client (vs WiFi 7: 5.8 Gbps)
   • Latency: <1ms (vs WiFi 7: 3-5ms)
   • Impact: May enable server wireless (if latency <1ms achieved)
   • Abhavtech Strategy: Pilot in 2028, evaluate for wired replacement

2. 60 GHz Wireless (WiGig 2.0, IEEE 802.11ay)
   • Throughput: 25 Gbps (short-range, <10m)
   • Use Case: Data center, server-to-server
   • Challenge: Line-of-sight required, limited range
   • Abhavtech Strategy: Monitor, unlikely to replace 25G wired

3. 400G Ethernet (Wired Uplinks)
   • Throughput: 400 Gbps per port (vs current 40G/100G)
   • Use Case: Fabric border → core uplinks
   • Timeline: Available today, deploy when fabric saturated
   • Abhavtech Strategy: Upgrade border/core to 400G in 2027-2028

4. PoE++ (IEEE 802.3bt, 90W)
   • Power: 90W per port (vs current PoE+: 30W)
   • Use Case: High-power devices (PTZ cameras, displays, laptops)
   • Abhavtech Strategy: Deploy PoE++ switches for new deployments

5. Time-Sensitive Networking (TSN, IEEE 802.1)
   • Latency: Deterministic <1ms (vs best-effort)
   • Use Case: Industrial automation, critical infrastructure
   • Abhavtech Strategy: Not needed (not a manufacturing facility)
```

---

## 16.8 Wired Infrastructure Summary

### 16.8.1 Key Outcomes

**Phase 5 Wired Infrastructure Transformation:**

```yaml
Technical Achievements:
  ✅ Wired Port Reduction: 54% (15,840 → 7,350 ports)
  ✅ Switch Decommissioning: 144 switches (330 → 186)
  ✅ Infrastructure Simplification: Fewer devices to manage, monitor, maintain
  ✅ Power Consumption: 50,400W reduction (144 switches × 350W)
  ✅ Wireless Adoption: 85% (vs 30% pre-Phase 5)
  ✅ Zero Trust: Consistent SGACL enforcement (wired + wireless)

Remaining Wired Infrastructure (15%):
  • Category D (Wired-Only): 1,190 devices (servers, infrastructure, BMS)
  • Category C (Wired-Preferred): 4,005 devices (desktops, phones, printers)
  • On-Demand Wired: 2,220 ports (hoteling, fallback)
  • Total: 7,415 ports + 20% spare = 8,900 ports (186 switches)

Strategic Benefits:
  ✅ Agility: Office reconfigurations no longer require re-cabling (save 3-5 weeks)
  ✅ User Experience: Wireless-first workspace (92% executive satisfaction)
  ✅ Operational Efficiency: Reduced switch count simplifies operations
  ✅ Sustainability: Reduced power consumption, smaller infrastructure footprint
  ✅ Future-Ready: Infrastructure prepared for WiFi 8, emerging technologies
```

---

### 16.8.2 Lessons Learned

**Key Insights:**

```yaml
1. "Wireless-First, Not Wireless-Only"
   • Lesson: 15% of devices legitimately require wired (servers, BMS, phones)
   • Recommendation: Don't force 100% wireless (diminishing returns)

2. Desktop PCs Can Remain Wired
   • Lesson: No mobility benefit for stationary desktops
   • Recommendation: Only migrate hoteling desks to wireless (10%)

3. PoE Is a Wired Differentiator
   • Lesson: PoE devices (phones, cameras) best served by wired
   • Recommendation: Don't migrate PoE devices to wireless (battery management)

4. Switch Decommissioning Is Labor-Intensive
   • Lesson: Port-by-port migration requires planning, weekend windows
   • Recommendation: Budget 2 hours per switch decommissioning

5. Fabric Integration Simplifies Wired-Wireless Coexistence
   • Lesson: SD-Access VXLAN enables seamless wired-wireless communication
   • Recommendation: Deploy SD-Access fabric before WiFi 7 migration

6. Zero Trust Enforces Consistent Security
   • Lesson: SGACL works identically for wired and wireless
   • Recommendation: Use SGT-based policies (not VLAN-based, harder to manage)

7. 20% Spare Port Capacity Is Essential
   • Lesson: Users still need wired fallback (conference rooms, IT support)
   • Recommendation: Always provision 20% spare ports on remaining switches
```
