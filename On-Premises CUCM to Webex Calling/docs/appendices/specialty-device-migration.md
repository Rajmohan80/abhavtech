# Appendix 10H: Specialty Device Migration Guide

> **Document Reference:** ABV-COLLAB-MIG-2026 | Appendix 10H
> **Cross-References:** Chapter 1 (Discovery), Chapter 2 (Design), Chapter 7 (Migration)
> **Style:** Reference Guide (Sonnet 4.5)
> **Applicability:** Organizations with analog devices, paging systems, video endpoints, or specialty equipment

---

## Document Purpose

This appendix provides migration guidance for **specialty devices** that may exist in enterprise CUCM environments but are often overlooked during initial discovery. While these devices are **not present in the Abhavtech environment**, this guide is included for:

1. **Completeness** - Ensuring no device types are missed during migration planning
2. **Reference** - Providing guidance for organizations with these devices
3. **Future-Proofing** - Supporting potential future deployments

**Abhavtech Infrastructure Note:**
Based on the discovery assessment (Chapter 1), Abhavtech's environment consists of:
- IP desk phones (Cisco 7800/8800 series) -> Migrating to MPP
- Webex App (soft clients) -> Native Webex Calling
- Contact Center agents (Finesse) -> Migrating to WxCC Agent Desktop

No analog devices, paging systems, or specialty endpoints were identified. However, this guide documents migration procedures should such devices be discovered during implementation.

---

## Table of Contents

**Part 1: Analog Device Migration**
- 10H.1 Analog Device Discovery Checklist
- 10H.2 Cisco ATA Migration to Webex Calling
- 10H.3 Fax Machine Migration Options
- 10H.4 Elevator & Emergency Phone Migration
- 10H.5 Door Phone & Intercom Migration

**Part 2: Paging System Migration**
- 10H.6 Paging System Discovery
- 10H.7 Overhead Paging Migration
- 10H.8 Multicast Paging Configuration
- 10H.9 InformaCast/Singlewire Integration

**Part 3: Video Endpoint Migration**
- 10H.10 Video Endpoint Inventory
- 10H.11 Conference Room System Migration
- 10H.12 Webex Room Device Integration

**Part 4: Third-Party & Specialty Devices**
- 10H.13 Third-Party SIP Phone Migration
- 10H.14 SIP Trunk Devices
- 10H.15 Custom CTI/TAPI Applications

**Part 5: Call Recording Migration**
- 10H.16 Enterprise Call Recording Options

---

## Part 1: Analog Device Migration

## 10H.1 Analog Device Discovery Checklist

### Common Analog Devices in Enterprise Environments

```
+-----------------------------------------------------------------------------+
|                    ANALOG DEVICE DISCOVERY CHECKLIST                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DOCUMENT ALL ANALOG DEVICES CONNECTED TO CUCM VIA ATA/VG                   |
|                                                                             |
|  FAX & DOCUMENT DEVICES                                                     |
|  =====================                                                      |
|  [ ] Fax machines                                                             |
|    Location: _________________ Model: _________________ Port: _____         |
|    Location: _________________ Model: _________________ Port: _____         |
|    Location: _________________ Model: _________________ Port: _____         |
|    Current ATA/Gateway: _________________ DN: _________________             |
|                                                                             |
|  [ ] Multifunction printers (fax-enabled)                                     |
|    Location: _________________ Model: _________________ Port: _____         |
|                                                                             |
|  FINANCIAL/POS DEVICES                                                      |
|  =====================                                                      |
|  [ ] Credit card terminals (dial-up)                                          |
|    Location: _________________ Model: _________________ Port: _____         |
|                                                                             |
|  [ ] Postage meters                                                           |
|    Location: _________________ Model: _________________ Port: _____         |
|                                                                             |
|  [ ] ATM machines (dial backup)                                               |
|    Location: _________________ Model: _________________ Port: _____         |
|                                                                             |
|  SECURITY & SAFETY DEVICES                                                  |
|  =========================                                                  |
|  [ ] Elevator emergency phones                                                |
|    Location: _________________ Building: ______________ Port: _____         |
|    Location: _________________ Building: ______________ Port: _____         |
|    Current ATA/Gateway: _________________ DN: _________________             |
|    Emergency callback number: _________________                             |
|                                                                             |
|  [ ] Fire alarm panels (dial-out)                                             |
|    Location: _________________ Model: _________________ Port: _____         |
|    Monitoring company: _________________                                    |
|                                                                             |
|  [ ] Burglar alarm panels                                                     |
|    Location: _________________ Model: _________________ Port: _____         |
|    Monitoring company: _________________                                    |
|                                                                             |
|  [ ] Pool/spa emergency phones (hospitality)                                  |
|    Location: _________________ Model: _________________ Port: _____         |
|                                                                             |
|  BUILDING ACCESS                                                            |
|  ===============                                                            |
|  [ ] Door entry phones                                                        |
|    Location: _________________ Model: _________________ Port: _____         |
|    Rings to: _________________ (DN or hunt group)                           |
|                                                                             |
|  [ ] Gate/parking intercoms                                                   |
|    Location: _________________ Model: _________________ Port: _____         |
|                                                                             |
|  [ ] Lobby phones                                                             |
|    Location: _________________ Model: _________________ Port: _____         |
|                                                                             |
|  LEGACY DEVICES                                                             |
|  ==============                                                             |
|  [ ] Modems (remote access/management)                                        |
|    Location: _________________ Purpose: _________________ Port: _____       |
|                                                                             |
|  [ ] TTY/TDD devices (accessibility)                                          |
|    Location: _________________ Model: _________________ Port: _____         |
|                                                                             |
|  [ ] Conference room speakerphones (analog)                                   |
|    Location: _________________ Model: _________________ Port: _____         |
|                                                                             |
|  CURRENT ANALOG GATEWAYS                                                    |
|  =======================                                                    |
|  Gateway/ATA            IP Address       Ports    Location                  |
|  -------------------------------------------------------------------------  |
|  _____________________  ______________   _____    _____________________     |
|  _____________________  ______________   _____    _____________________     |
|  _____________________  ______________   _____    _____________________     |
|                                                                             |
|  TOTAL ANALOG PORTS REQUIRED: _____                                         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Analog Device Migration Decision Matrix

| Device Type | Priority | Migration Option | Webex Support |
|-------------|----------|------------------|---------------|
| **Elevator phones** | 🔴 Critical (safety) | ATA 191/192 | [OK] Supported |
| **Fire/burglar alarms** | 🔴 Critical (safety) | Keep on POTS or cellular | [!]️ Recommend dedicated line |
| **Door entry phones** | 🟡 Medium | ATA or SIP door station | [OK] Supported |
| **Fax machines** | 🟡 Medium | ATA, eFax, or cloud fax | [OK] ATA supported |
| **Credit card terminals** | 🟡 Medium | IP/cellular upgrade recommended | [!]️ ATA possible |
| **Modems** | 🟢 Low | Eliminate or VPN | [X] Not recommended |
| **Analog conference phones** | 🟢 Low | Replace with IP | [OK] Replace |

---

## 10H.2 Cisco ATA Migration to Webex Calling

### Supported ATAs for Webex Calling

| Model | Ports | Use Case | Webex Calling Support |
|-------|-------|----------|----------------------|
| **Cisco ATA 191** | 2 FXS | Small office, 1-2 analog devices | [OK] Fully supported |
| **Cisco ATA 192** | 2 FXS + 1 FXO | Small office with PSTN failover | [OK] Fully supported |
| **Cisco VG400** | 4 FXS | Multiple analog devices | [OK] Supported (Local Gateway) |
| **Cisco VG450** | Up to 216 FXS | Large analog deployments | [OK] Supported (Local Gateway) |

### ATA 191/192 Migration Procedure

```
CISCO ATA 191/192 MIGRATION TO WEBEX CALLING
===========================================================================

CURRENT STATE (CUCM):
---------------------
+-------------+      +-------------+      +-------------+
| Analog      |------|  ATA 191    |------|    CUCM     |
| Device      | FXS  | (Registered | SIP  |   Cluster   |
| (Fax, etc.) |      |  to CUCM)   |      |             |
+-------------+      +-------------+      +-------------+

TARGET STATE (Webex Calling):
-----------------------------
+-------------+      +-------------+      +-------------+
| Analog      |------|  ATA 191    |------|   Webex     |
| Device      | FXS  | (Registered | SIP  |   Calling   |
| (Fax, etc.) |      |  to Webex)  |      |   Cloud     |
+-------------+      +-------------+      +-------------+

MIGRATION STEPS:
================

Step 1: Add ATA to Webex Control Hub
------------------------------------
1. Login to Control Hub: admin.webex.com
2. Navigate: Devices > Add Device
3. Select: Cisco ATA 191 or ATA 192
4. Assign to Location (e.g., Mumbai HQ)
5. Generate Activation Code (valid 7 days)

Step 2: Record Current ATA Configuration
----------------------------------------
Before migration, document from CUCM:
[ ] Current DN(s) assigned to ATA ports
[ ] Calling Search Space
[ ] Partition
[ ] Device name
[ ] IP address / DHCP reservation

Step 3: Factory Reset ATA
-------------------------
Option A: Web interface
  1. Browse to ATA IP address
  2. Login (admin / default password)
  3. Admin > Factory Reset
  4. Confirm reset

Option B: Physical reset
  1. Press and hold RESET button for 10 seconds
  2. Wait for LED to blink rapidly
  3. Release button
  4. ATA reboots to factory defaults

Step 4: Configure ATA for Webex Calling
---------------------------------------
1. Connect ATA to network (DHCP)
2. Browse to ATA IP address (check DHCP lease)
3. Navigate to: Voice > Provisioning
4. Enter Activation Code from Control Hub
5. Click "Activate"
6. ATA downloads Webex configuration
7. ATA registers to Webex Calling

Step 5: Assign Phone Number to ATA Port
---------------------------------------
In Control Hub:
1. Navigate: Devices > [ATA Name]
2. Select Port 1 (or Port 2)
3. Assign:
   [ ] Extension: [e.g., 7001]
   [ ] Phone Number: [e.g., +91-22-4960-7001] (optional)
   [ ] Caller ID: "Fax Machine" or device name
4. Save

Step 6: Configure Port Settings
-------------------------------
For FAX devices:
  [ ] Enable T.38 Fax Relay
  [ ] Set Fax Protocol: T.38
  [ ] Set Jitter Buffer: Large

For voice devices (elevator, door phone):
  [ ] Standard voice settings
  [ ] Enable DTMF relay (RFC 2833)

Step 7: Validate
----------------
[ ] ATA shows "Registered" in Control Hub
[ ] Test inbound call to ATA extension
[ ] Test outbound call from analog device
[ ] For fax: Send/receive test fax
[ ] For elevator phone: Test emergency call
```

### ATA Port Configuration in Control Hub

```
CONTROL HUB ATA CONFIGURATION
===========================================================================

Device Name: ATA-MUM-FAX-01
Location: ABV-Mumbai-HQ
MAC Address: AA:BB:CC:DD:EE:FF

+-------------------------------------------------------------------------+
| PORT 1 CONFIGURATION                                                    |
+-------------------------------------------------------------------------+
|                                                                         |
| Port Name:        Fax-Finance-MUM                                       |
| Extension:        7001                                                  |
| Phone Number:     +91-22-4960-7001                                      |
| Caller ID Name:   Finance Fax                                           |
| Caller ID Number: +91-22-4960-7001                                      |
|                                                                         |
| Calling Features:                                                       |
| [x] Outbound Calling Enabled                                              |
| [x] Inbound Calling Enabled                                               |
| [ ] Voicemail Enabled (typically disabled for fax)                        |
|                                                                         |
| Fax Settings:                                                           |
| [x] T.38 Fax Relay Enabled                                                |
| Fax Protocol: T.38                                                      |
|                                                                         |
+-------------------------------------------------------------------------+

+-------------------------------------------------------------------------+
| PORT 2 CONFIGURATION                                                    |
+-------------------------------------------------------------------------+
|                                                                         |
| Port Name:        Fax-HR-MUM                                            |
| Extension:        7002                                                  |
| Phone Number:     +91-22-4960-7002                                      |
| Caller ID Name:   HR Fax                                                |
| Caller ID Number: +91-22-4960-7002                                      |
|                                                                         |
| (Similar configuration as Port 1)                                       |
|                                                                         |
+-------------------------------------------------------------------------+
```

---

## 10H.3 Fax Machine Migration Options

### Fax Migration Decision Tree

```
FAX MIGRATION DECISION TREE
===========================================================================

                    +---------------------+
                    | How many fax        |
                    | machines?           |
                    +----------+----------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
        +----------+    +----------+    +----------+
        |  1-5     |    |  6-20    |    |  20+     |
        | machines |    | machines |    | machines |
        +----+-----+    +----+-----+    +----+-----+
             |               |               |
             v               v               v
    +----------------+ +----------------+ +----------------+
    | ATA 191/192    | | Cloud Fax      | | Enterprise Fax |
    | (Per device)   | | Service        | | Server         |
    |                | | (eFax, etc.)   | | (RightFax)     |
    | * Simple       | |                | |                |
    | * Low cost     | | * No hardware  | | * Centralized  |
    | * Per-device   | | * Email-to-fax | | * High volume  |
    |   management   | | * Fax-to-email | | * Compliance   |
    |                | | * Monthly fee  | |                |
    +----------------+ +----------------+ +----------------+
```

### Option 1: ATA Migration (Physical Fax Retained)

| Pros | Cons |
|------|------|
| [OK] Keeps existing fax machines | [X] Hardware to manage |
| [OK] No workflow changes | [X] T.38 may have issues over internet |
| [OK] One-time cost | [X] Physical paper/toner |
| [OK] Works with Webex Calling | [X] Location-dependent |

**Best For:** Low-volume fax, regulatory requirement for physical fax, legacy workflows

### Option 2: Cloud Fax Service (eFax, RingCentral Fax, etc.)

| Pros | Cons |
|------|------|
| [OK] No hardware | [X] Monthly subscription |
| [OK] Fax from anywhere | [X] Workflow change |
| [OK] Email integration | [X] May not keep fax number |
| [OK] Compliance features | [X] Third-party service |

**Best For:** Mobile workforce, email-centric workflows, distributed teams

### Option 3: Enterprise Fax Server (OpenText RightFax, etc.)

| Pros | Cons |
|------|------|
| [OK] Centralized management | [X] Server infrastructure |
| [OK] High volume capable | [X] Higher cost |
| [OK] Compliance/archival | [X] Complexity |
| [OK] API integration | [X] Requires SIP trunk |

**Best For:** High-volume fax (healthcare, legal, finance), compliance requirements

### Fax over IP (FoIP) Considerations

```
FAX OVER IP TECHNICAL REQUIREMENTS
===========================================================================

For reliable fax transmission over Webex Calling:

PROTOCOL REQUIREMENTS:
----------------------
[x] T.38 Fax Relay (preferred)
  * Real-time fax protocol over IP
  * More reliable than G.711 passthrough
  * Supported by Cisco ATA 191/192

[ ] G.711 Passthrough (fallback)
  * Fax tones passed as audio
  * Less reliable, more bandwidth
  * May fail on lossy connections

NETWORK REQUIREMENTS:
---------------------
* Jitter: < 20ms (strict for fax)
* Packet Loss: < 0.5% (fax sensitive)
* Latency: < 150ms one-way
* QoS: Prioritize fax traffic (DSCP EF)

COMMON FAX ISSUES & SOLUTIONS:
------------------------------
Issue: Fax fails after 1-2 pages
-> Cause: Packet loss or jitter
-> Solution: Enable T.38, check network quality

Issue: Fax never connects
-> Cause: T.38 not enabled or NAT issues
-> Solution: Verify ATA settings, check firewall

Issue: Poor fax quality (garbled)
-> Cause: Codec issues or low bandwidth
-> Solution: Force G.711 or T.38, increase bandwidth

RECOMMENDATION:
---------------
For high-reliability fax requirements, consider:
* Dedicated internet circuit for fax ATAs
* Cloud fax service as backup
* Local PSTN line (POTS) for critical fax
```

---

## 10H.4 Elevator & Emergency Phone Migration

### Elevator Phone Requirements

```
ELEVATOR EMERGENCY PHONE MIGRATION
===========================================================================

[!]️ CRITICAL: Elevator phones are LIFE SAFETY devices. Migration must
   ensure 100% reliability and compliance with local codes.

REGULATORY REQUIREMENTS (Vary by Region):
-----------------------------------------
* USA: ASME A17.1 requires two-way communication
* EU: EN 81-28 specifies elevator emergency communication
* India: IS 14665 specifies lift safety requirements

KEY REQUIREMENTS:
-----------------
[x] Auto-dial to monitoring station
[x] Two-way voice communication
[x] Automatic call back capability
[x] Battery backup (phone must work during power outage)
[x] Caller ID showing elevator location
[x] Testing schedule (monthly recommended)

MIGRATION OPTIONS:
==================

OPTION A: ATA + Existing Analog Phone
-------------------------------------
+-------------+      +-------------+      +-------------+
| Elevator    |------|  ATA 191    |------|   Webex     |
| Phone       | FXS  | (with UPS)  | IP   |   Calling   |
+-------------+      +-------------+      +-------------+

Pros: Keeps existing phone, simple migration
Cons: Requires ATA in elevator machine room, UPS required

Configuration:
* ATA located in elevator machine room (with battery backup)
* Single button auto-dial to security/monitoring
* Caller ID: "Elevator-Building A-Floor 1-5"
* Ring to: Security desk or monitoring company

OPTION B: SIP Elevator Phone (Replace Analog)
---------------------------------------------
+-------------+                              +-------------+
| SIP Elevator|------------------------------|   Webex     |
| Phone       | IP (PoE)                     |   Calling   |
| (New)       |                              |             |
+-------------+                              +-------------+

Pros: Modern, integrated, no ATA needed
Cons: Cost of new phones, installation labor

Recommended SIP Elevator Phones:
* Viking E-1600-IP-EWP (Webex compatible)
* Algo 8201 SIP Intercom
* 2N Lift8 (SIP-based)

OPTION C: Cellular Elevator Phone (Independent)
-----------------------------------------------
+-------------+      +-------------+
| Cellular    |------|  Cellular   |
| Elevator    | Cell |  Network    |
| Phone       |      |  (LTE)      |
+-------------+      +-------------+

Pros: Completely independent, works during building outage
Cons: Monthly cellular cost, cellular coverage in shaft

Recommended: Kings III, RATH cellular elevator phones

RECOMMENDATION:
---------------
For new installations: SIP elevator phone or cellular
For existing installations: ATA with UPS is acceptable
For critical buildings: Cellular backup recommended
```

### Elevator Phone Configuration Example

```
WEBEX CALLING ELEVATOR PHONE CONFIGURATION
===========================================================================

Control Hub Configuration:
--------------------------

Device Type: Cisco ATA 191
Device Name: ATA-MUM-ELEV-BLDGA
Location: ABV-Mumbai-HQ
MAC Address: AA:BB:CC:DD:EE:01

Port 1:
  Name: Elevator-BldgA-Floor1-5
  Extension: 7100
  Caller ID Name: ELEV EMERGENCY BLDG-A
  Caller ID Number: +91-22-4960-7100
  
Port 2:
  Name: Elevator-BldgA-Floor6-10
  Extension: 7101
  Caller ID Name: ELEV EMERGENCY BLDG-A
  Caller ID Number: +91-22-4960-7101

Call Routing:
-------------
Elevator phone auto-dials when handset lifted:
  Primary: Security Desk Hunt Group (x8000)
  Secondary: Facilities Manager Mobile (+91-98765-XXXXX)
  Tertiary: External Monitoring Company (+91-22-XXXX-XXXX)

Testing Schedule:
-----------------
* Monthly test calls from each elevator
* Document test results
* Verify battery backup quarterly
```

---

## 10H.5 Door Phone & Intercom Migration

### Door Phone Migration Options

```
DOOR PHONE / INTERCOM MIGRATION
===========================================================================

CURRENT STATE (CUCM + Analog):
------------------------------
+-------------+      +-------------+      +-------------+
| Analog Door |------|  VG or ATA  |------|    CUCM     |
| Phone       | FXS  |             | SIP  |   Cluster   |
+-------------+      +-------------+      +-------------+

MIGRATION OPTIONS:
==================

OPTION A: ATA + Existing Analog Door Phone
------------------------------------------
* Keep existing analog door phone
* Connect to Cisco ATA 191/192
* ATA registers to Webex Calling
* Door phone calls reception/security

Best for: Working analog door phones, low budget

OPTION B: Replace with SIP Door Phone
-------------------------------------
+-------------+                              +-------------+
| SIP Door    |------------------------------|   Webex     |
| Station     | SIP over IP (PoE)            |   Calling   |
+-------------+                              +-------------+

Recommended SIP Door Phones:
* 2N IP Verso (video + access control)
* Algo 8028 SIP Doorphone
* Viking K-1900-IP series
* Grandstream GDS37xx series

Best for: New installations, video required, access control integration

OPTION C: Integration with Access Control
-----------------------------------------
Modern door stations can integrate with:
* Webex App (video calling to mobile)
* Access control systems (badge + intercom)
* Video management systems

Example: 2N IP Verso with Webex Calling
* Visitor presses button
* Video call to receptionist's Webex App
* Receptionist can see visitor, unlock door remotely
```

### SIP Door Phone Configuration

```
SIP DOOR PHONE WEBEX CALLING CONFIGURATION
===========================================================================

For generic SIP door phones compatible with Webex Calling:

Control Hub:
------------
1. Add device as "Generic SIP Phone" or Workspace device
2. Generate SIP credentials:
   - SIP Username: doorphone-lobby@abv.webex.com
   - SIP Password: [generated]
   - Outbound Proxy: webex-calling-proxy.webex.com

Door Phone Configuration:
-------------------------
SIP Server: Webex Calling proxy (varies by region)
Username: [from Control Hub]
Password: [from Control Hub]
Codec: G.711 (for best intercom quality)
DTMF: RFC 2833

Speed Dial Button:
------------------
Button 1: Reception Hunt Group (x8000)
Button 2: Security Desk (x8001)
Button 3: Facilities (x8002)

Call Flow:
----------
1. Visitor presses button
2. Door phone calls Reception (x8000)
3. Receptionist answers on Webex App or desk phone
4. Receptionist can:
   - Talk to visitor
   - Transfer to employee being visited
   - Trigger door release (if integrated)
```

---

## Part 2: Paging System Migration

## 10H.6 Paging System Discovery

### Paging Infrastructure Assessment

```
+-----------------------------------------------------------------------------+
|                    PAGING SYSTEM DISCOVERY CHECKLIST                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PAGING SYSTEM TYPE                                                         |
|  =================                                                          |
|  [ ] Overhead paging (speakers)                                               |
|  [ ] Desktop paging (Cisco IP phones)                                         |
|  [ ] Combination (overhead + desktop)                                         |
|  [ ] Zone-based paging                                                        |
|  [ ] Emergency/mass notification                                              |
|                                                                             |
|  CURRENT PAGING INFRASTRUCTURE                                              |
|  =============================                                              |
|  Paging Controller:                                                         |
|  [ ] Cisco Paging Server                                                      |
|  [ ] InformaCast (Singlewire)                                                 |
|  [ ] Algo Paging Adapter                                                      |
|  [ ] Valcom Paging                                                            |
|  [ ] Bogen Paging                                                             |
|  [ ] Atlas Sound                                                              |
|  [ ] Other: _________________                                                 |
|                                                                             |
|  Model: _________________  IP Address: _________________                    |
|                                                                             |
|  PAGING ZONES                                                               |
|  ============                                                               |
|  Zone Name              Speakers    Pilot Number    Type                    |
|  -------------------------------------------------------------------------  |
|  All-Call               _____       _________       Overhead                |
|  Building A             _____       _________       Overhead                |
|  Warehouse              _____       _________       Overhead                |
|  Manufacturing          _____       _________       Overhead                |
|  Emergency              _____       _________       All speakers            |
|                                                                             |
|  CURRENT INTEGRATION METHOD                                                 |
|  =========================                                                  |
|  [ ] SIP URI from CUCM                                                        |
|  [ ] Multicast from CUCM phones                                               |
|  [ ] Analog trunk from VG gateway                                             |
|  [ ] InformaCast integration with CUCM                                        |
|  [ ] Other: _________________                                                 |
|                                                                             |
|  PAGING TRIGGER METHODS                                                     |
|  ======================                                                     |
|  [ ] Dial extension from phone                                                |
|  [ ] Softkey on IP phone                                                      |
|  [ ] Web interface                                                            |
|  [ ] InformaCast plugin                                                       |
|  [ ] Emergency button/switch                                                  |
|                                                                             |
|  EMERGENCY NOTIFICATION                                                     |
|  ======================                                                     |
|  [ ] Fire alarm integration                                                   |
|  [ ] Weather alerts                                                           |
|  [ ] Lockdown announcements                                                   |
|  [ ] Mass notification required                                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 10H.7 Overhead Paging Migration

### Migration Architecture

```
OVERHEAD PAGING MIGRATION TO WEBEX CALLING
===========================================================================

CURRENT STATE (CUCM):
---------------------
                                    +-----------------+
                                    |   Overhead      |
+-------------+    +-------------+  |   Speakers      |
|    CUCM     |--->| Paging      |--|   (Zone 1)     |
|   Cluster   |    | Controller  |  +-----------------+
+-------------+    | (SIP URI)   |  +-----------------+
                   +-------------+--|   Speakers      |
                                    |   (Zone 2)     |
User dials x9000                    +-----------------+
(paging pilot)                      

TARGET STATE (Webex Calling):
-----------------------------
                                    +-----------------+
                                    |   Overhead      |
+-------------+    +-------------+  |   Speakers      |
|   Webex     |--->| Paging      |--|   (Zone 1)     |
|   Calling   |    | Adapter     |  +-----------------+
|   Cloud     |    | (SIP)       |  +-----------------+
+-------------+    +-------------+--|   Speakers      |
                                    |   (Zone 2)     |
User dials x9000                    +-----------------+
from Webex App/Phone

MIGRATION OPTIONS:
==================

OPTION A: SIP Paging Adapter (Simple)
-------------------------------------
Use a SIP paging adapter that registers to Webex Calling:

Recommended Devices:
* Algo 8301 Paging Adapter
* Algo 8180 SIP Audio Alerter
* CyberData SIP Paging Server
* Viking PA-IP

Configuration:
1. Register paging adapter as Workspace device in Webex
2. Assign extension (e.g., x9000)
3. Connect adapter to existing speaker amplifier
4. Users dial x9000 to page

OPTION B: InformaCast with Webex (Advanced)
-------------------------------------------
For mass notification and advanced paging:

InformaCast Advanced Notification integrates with Webex Calling:
* Desktop popup notifications
* Phone speaker broadcast
* Overhead paging
* Email/SMS alerts
* Emergency notifications

See section 10H.9 for InformaCast integration.

OPTION C: Multicast Paging (IP Phones Only)
-------------------------------------------
[!]️ Note: Multicast paging to Webex desk phones has limitations.
   Webex App does not support multicast paging.

For IP phone-only paging:
* Configure multicast group in phone settings
* Limited to on-network phones
* Does not work for remote/WFH users
```

### Algo Paging Adapter Configuration

```
ALGO 8301 PAGING ADAPTER - WEBEX CALLING CONFIGURATION
===========================================================================

Step 1: Add Workspace in Control Hub
------------------------------------
1. Control Hub > Workspaces > Create Workspace
2. Name: "Paging-AllCall-Mumbai"
3. Location: ABV-Mumbai-HQ
4. Calling: Webex Calling
5. Assign extension: 9000

Step 2: Generate SIP Credentials
--------------------------------
1. In Workspace settings, note:
   - SIP Address: paging-allcall-mumbai@abv.webex.com
   - Outbound Proxy: [region-specific]
   - Line/Port credentials

Step 3: Configure Algo 8301
---------------------------
Access Algo web interface (default: http://192.168.1.100)

SIP Settings:
  SIP Server: [Webex Calling proxy]
  SIP User ID: [from Control Hub]
  SIP Password: [from Control Hub]
  SIP Transport: TLS
  Registrar: [Webex Calling registrar]

Audio Settings:
  Auto-Answer: Enabled
  Answer Delay: 0 seconds
  Audio Output: Line Out (to amplifier)
  Volume: Adjust for speaker system

Step 4: Connect to Speaker System
---------------------------------
Algo 8301 Line Out --> Amplifier Input --> Overhead Speakers

Step 5: Test Paging
-------------------
1. From Webex App, dial 9000
2. Speak announcement
3. Verify audio on overhead speakers
4. Adjust volume as needed
```

---

## 10H.8 Multicast Paging Configuration

### Multicast Paging Limitations with Webex Calling

```
MULTICAST PAGING CONSIDERATIONS
===========================================================================

[!]️ IMPORTANT LIMITATIONS:

1. WEBEX APP DOES NOT SUPPORT MULTICAST PAGING
   - Webex App (desktop/mobile) cannot receive multicast pages
   - Only MPP desk phones on local network can receive multicast

2. REMOTE/WFH USERS CANNOT RECEIVE MULTICAST
   - Multicast is local network only
   - Pages don't traverse VPN or internet

3. NETWORK REQUIREMENTS
   - Multicast routing must be enabled
   - IGMP snooping configured on switches
   - QoS for multicast traffic

WHEN TO USE MULTICAST PAGING:
-----------------------------
[OK] All users have desk phones on local network
[OK] Simple all-call or zone paging needed
[OK] No remote/WFH users need to receive pages

WHEN TO USE SIP PAGING ADAPTER:
-------------------------------
[OK] Overhead speaker system exists
[OK] Need to reach remote users (via callback)
[OK] Integration with existing PA system

WHEN TO USE INFORMACAST:
------------------------
[OK] Emergency mass notification required
[OK] Multi-channel notification (phone, desktop, SMS)
[OK] Complex zone-based paging
[OK] Regulatory compliance (e.g., schools)
```

### Multicast Paging Setup (Desk Phones Only)

```
MULTICAST PAGING FOR MPP PHONES
===========================================================================

Step 1: Define Multicast Groups
-------------------------------
Group Name          Multicast Address    Port    Purpose
--------------------------------------------------------------------
All-Call            224.0.1.100          5000    All phones
Building-A          224.0.1.101          5001    Building A phones
Building-B          224.0.1.102          5002    Building B phones
Emergency           224.0.1.199          5099    Emergency (all phones)

Step 2: Configure in Control Hub
--------------------------------
Note: Multicast paging configured at device level or via 
      device configuration template.

For each phone or phone group:
1. Navigate: Devices > [Phone] > Settings
2. Multicast Paging:
   - Enable Multicast Listen: Yes
   - Multicast Address: 224.0.1.100
   - Multicast Port: 5000

Step 3: Configure Paging Source
-------------------------------
Option A: Algo Paging Adapter
  - Configure to send multicast to 224.0.1.100:5000
  - User dials extension to trigger

Option B: Direct from Phone
  - Configure paging softkey on select phones
  - Softkey sends multicast to configured address

Step 4: Network Configuration
-----------------------------
On network switches:
  ip igmp snooping
  ip igmp snooping vlan [voice-vlan]
  
On routers (if paging crosses VLANs):
  ip multicast-routing
  ip pim sparse-mode (on interfaces)

Step 5: Test
------------
1. Trigger page from configured source
2. Verify all phones in group play audio
3. Check for audio quality issues
4. Verify no phones outside group receive page
```

---

## 10H.9 InformaCast/Singlewire Integration

### InformaCast with Webex Calling

```
INFORMACAST ADVANCED NOTIFICATION + WEBEX CALLING
===========================================================================

InformaCast provides enterprise mass notification integrated with Webex:

CAPABILITIES:
-------------
* Broadcast to Webex desk phones
* Desktop popup notifications (Windows/Mac)
* Overhead paging integration
* Digital signage integration
* SMS/email alerts
* Emergency panic buttons
* CAP/IPAWS weather alerts
* Fire alarm integration

ARCHITECTURE:
-------------
+-------------------------------------------------------------------------+
|                                                                         |
|  +-------------+    +------------------+    +-------------------------+|
|  | InformaCast |    |                  |    | Webex Calling Phones    ||
|  | Server      |--->|  Webex Cloud     |--->| (Audio broadcast)       ||
|  | (On-prem or |    |                  |    +-------------------------+|
|  |  Cloud)     |    +------------------+                               |
|  |             |                            +-------------------------+|
|  |             |--------------------------->| Desktop Clients         ||
|  |             |    (InformaCast plugin)    | (Popup notifications)   ||
|  |             |                            +-------------------------+|
|  |             |                            +-------------------------+|
|  |             |--------------------------->| Overhead Speakers       ||
|  |             |    (SIP or multicast)      | (via paging adapters)   ||
|  |             |                            +-------------------------+|
|  |             |                            +-------------------------+|
|  |             |--------------------------->| SMS/Email               ||
|  |             |    (API integration)       | (Off-network users)     ||
|  +-------------+                            +-------------------------+|
|                                                                         |
+-------------------------------------------------------------------------+

WEBEX INTEGRATION METHODS:
--------------------------
1. Phone-Based Broadcast
   - InformaCast sends SIP calls to phones
   - Phones auto-answer and play audio
   - Works with MPP desk phones

2. Desktop Plugin
   - InformaCast Fusion client installed on PCs
   - Popup notifications with audio
   - Works for remote/WFH users

3. Webex Messaging Integration
   - Post alerts to Webex Spaces
   - Bot-based notifications
   - Reaches mobile users

IMPLEMENTATION STEPS:
---------------------
1. Deploy InformaCast server (VM or SaaS)
2. Configure Webex Calling integration
3. Define notification groups (matching Webex locations)
4. Install desktop clients (optional)
5. Configure overhead paging adapters
6. Test all notification paths
7. Integrate with fire/alarm panels (if required)

For detailed InformaCast configuration, refer to:
https://www.singlewire.com/informacast-webex-calling
```

---

## Part 3: Video Endpoint Migration

## 10H.10 Video Endpoint Inventory

### Video Device Discovery

```
+-----------------------------------------------------------------------------+
|                    VIDEO ENDPOINT DISCOVERY CHECKLIST                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ROOM VIDEO SYSTEMS (Registered to CUCM)                                    |
|  =======================================                                    |
|                                                                             |
|  Device Model          Location           DN          Status                |
|  -------------------------------------------------------------------------  |
|  Room Kit              _______________    _______     [ ] Migrate to Webex   |
|  Room Kit Mini         _______________    _______     [ ] Migrate to Webex   |
|  Room Kit Plus         _______________    _______     [ ] Migrate to Webex   |
|  Room Kit Pro          _______________    _______     [ ] Migrate to Webex   |
|  SX10                  _______________    _______     [ ] EoL - Replace      |
|  SX20                  _______________    _______     [ ] EoL - Replace      |
|  SX80                  _______________    _______     [ ] EoL - Replace      |
|  MX200/300/700/800     _______________    _______     [ ] EoL - Replace      |
|  Board 55/70/85        _______________    _______     [ ] Migrate to Webex   |
|  Desk Pro              _______________    _______     [ ] Migrate to Webex   |
|  Desk                  _______________    _______     [ ] Migrate to Webex   |
|  Desk Mini             _______________    _______     [ ] Migrate to Webex   |
|                                                                             |
|  CONFERENCE PHONES (IP)                                                     |
|  ======================                                                     |
|                                                                             |
|  Device Model          Location           DN          Status                |
|  -------------------------------------------------------------------------  |
|  Cisco 7832            _______________    _______     [ ] Migrate MPP        |
|  Cisco 8832            _______________    _______     [ ] Migrate MPP        |
|  Polycom Trio          _______________    _______     [ ] Check Webex compat |
|  Poly Studio X30/50    _______________    _______     [ ] Native Webex       |
|                                                                             |
|  PERSONAL VIDEO DEVICES                                                     |
|  ======================                                                     |
|                                                                             |
|  Device Model          User               DN          Status                |
|  -------------------------------------------------------------------------  |
|  DX70/DX80             _______________    _______     [ ] EoL - Replace      |
|  Desk Hub              _______________    _______     [ ] Migrate to Webex   |
|                                                                             |
|  THIRD-PARTY VIDEO                                                          |
|  =================                                                          |
|                                                                             |
|  Device                Location           Protocol    Status                |
|  -------------------------------------------------------------------------  |
|  ________________      _______________    H.323/SIP   [ ] Evaluate           |
|  ________________      _______________    H.323/SIP   [ ] Evaluate           |
|                                                                             |
|  TOTAL VIDEO ENDPOINTS: _____                                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 10H.11 Conference Room System Migration

### Video Endpoint Migration Paths

| Current Device | Status | Migration Path |
|----------------|--------|----------------|
| **Room Kit** | [OK] Supported | Register to Webex cloud |
| **Room Kit Mini** | [OK] Supported | Register to Webex cloud |
| **Room Kit Plus** | [OK] Supported | Register to Webex cloud |
| **Room Kit Pro** | [OK] Supported | Register to Webex cloud |
| **Board 55/70/85** | [OK] Supported | Register to Webex cloud |
| **Desk Pro** | [OK] Supported | Register to Webex cloud |
| **Desk** | [OK] Supported | Register to Webex cloud |
| **Desk Mini** | [OK] Supported | Register to Webex cloud |
| **SX10/20** | [!]️ EoL | Replace with Room Kit Mini |
| **SX80** | [!]️ EoL | Replace with Room Kit Plus/Pro |
| **MX200/300** | [!]️ EoL | Replace with Room Kit |
| **MX700/800** | [!]️ EoL | Replace with Room Kit Plus |
| **DX70/80** | [!]️ EoL | Replace with Desk or Desk Mini |

### Room Device Migration Procedure

```
CISCO ROOM DEVICE MIGRATION TO WEBEX
===========================================================================

Step 1: Prepare Device in CUCM (Document Settings)
--------------------------------------------------
[ ] Note current DN/extension
[ ] Note SIP URI (if configured)
[ ] Note speed dials
[ ] Note display name
[ ] Export device configuration backup

Step 2: Create Workspace in Control Hub
---------------------------------------
1. Control Hub > Workspaces > Create Workspace
2. Enter:
   - Name: "Conf-Room-Mumbai-10F-Jupiter"
   - Location: ABV-Mumbai-HQ
   - Capacity: 10 people
   - Type: Conference Room
3. Services:
   [x] Webex Meetings
   [x] Webex Calling (assign extension if needed)
4. Save

Step 3: Generate Activation Code
--------------------------------
1. In Workspace > Devices > Add Device
2. Select: Cisco Collaboration Device
3. Generate Activation Code (valid 7 days)
4. Copy code or use QR code

Step 4: Factory Reset Device
----------------------------
On Room Device:
1. Settings > Factory Reset
2. Confirm reset
3. Device restarts with setup wizard

Step 5: Activate on Webex
-------------------------
1. Device boots to setup wizard
2. Connect to network (Ethernet or WiFi)
3. Select: "Register to Webex"
4. Enter Activation Code (or scan QR)
5. Device registers to Webex cloud
6. Configuration downloads automatically

Step 6: Configure Calling (Optional)
------------------------------------
If Webex Calling enabled for workspace:
- Extension assigned automatically
- Can make/receive calls from room device
- Integrates with Webex calendar

Step 7: Test & Validate
-----------------------
[ ] Join Webex Meeting from device
[ ] Share content (wireless and wired)
[ ] Test audio/video quality
[ ] Test Webex Calling (if enabled)
[ ] Test calendar integration (OBTP)
[ ] Verify device in Control Hub
```

---

## 10H.12 Webex Room Device Integration

### Webex Calling Integration for Room Devices

```
ROOM DEVICE WEBEX CALLING CONFIGURATION
===========================================================================

When Webex Calling is enabled for a Workspace, room devices can:
* Make and receive phone calls
* Show as available in directory
* Be included in hunt groups
* Have dedicated phone number

CONFIGURATION:
--------------

Control Hub > Workspaces > [Workspace Name] > Calling

Calling Options:
[x] Webex Calling
  Extension: 8100
  Phone Number: +91-22-4960-8100 (optional)
  Caller ID: "Jupiter Conference Room"

Features Available:
[x] Inbound calls
[x] Outbound calls
[x] Call transfer
[x] Call hold
[x] Conference
[x] Voicemail (if enabled)

USE CASE EXAMPLES:
------------------

1. Conference Room Phone Replacement
   - Room Kit replaces IP conference phone
   - Users dial room extension to reach participants
   - Better audio with Room Kit far-end camera

2. Reception/Lobby Kiosk
   - Desk Pro as visitor check-in
   - Calls reception for assistance
   - Video communication option

3. Executive Office
   - Desk Pro combines phone + video
   - Single device for calls and meetings
   - High-quality audio/video
```

---

## Part 4: Third-Party & Specialty Devices

## 10H.13 Third-Party SIP Phone Migration

### Compatibility Assessment

```
THIRD-PARTY SIP PHONE COMPATIBILITY
===========================================================================

Webex Calling supports generic SIP devices with limitations:

OFFICIALLY SUPPORTED:
---------------------
* Cisco MPP phones (8800, 7800, 6800 series)
* Cisco ATA 191/192
* Cisco Webex Room devices
* Poly (formerly Polycom) - select models

GENERIC SIP (Limited Support):
------------------------------
Generic SIP devices can register to Webex Calling but:
[!]️ Limited feature support
[!]️ No firmware management from Control Hub
[!]️ Basic calling only (make/receive)
[!]️ May not support all Webex Calling features

MIGRATION OPTIONS:
------------------

OPTION A: Replace with Cisco MPP (Recommended)
----------------------------------------------
* Full feature support
* Centralized management
* Firmware updates
* Best user experience

OPTION B: Register as Generic SIP
---------------------------------
For devices that must be retained:

1. Create Workspace in Control Hub
2. Select "Third-party SIP device"
3. Generate SIP credentials
4. Configure device with:
   - Webex SIP proxy address
   - SIP username/password
   - G.711 codec (recommended)

OPTION C: Connect via Local Gateway
-----------------------------------
For large numbers of legacy SIP phones:
* Local Gateway provides SIP trunk
* Phones register to local PBX/gateway
* Gateway connects to Webex Calling
* More complex but supports more devices

COMPATIBILITY CHECKLIST:
------------------------
For any third-party SIP device, verify:
[ ] SIP over TLS supported
[ ] SRTP for media encryption
[ ] RFC 2833 DTMF
[ ] G.711 codec support
[ ] SIP registration (REGISTER method)
[ ] Outbound proxy support
```

---

## 10H.14 SIP Trunk Devices

### Devices Requiring SIP Trunk

```
SIP TRUNK DEVICES (Via Local Gateway)
===========================================================================

Some devices require SIP trunk connectivity rather than direct registration:

DEVICES TYPICALLY REQUIRING SIP TRUNK:
--------------------------------------
* Legacy PBX systems (during migration)
* Third-party contact center platforms
* IVR systems
* Recording platforms
* Paging servers
* Mass notification systems

ARCHITECTURE:
-------------
                                    +-----------------+
                                    | Legacy Device   |
+-------------+    +-------------+  | (IVR, PBX,     |
|   Webex     |--->| Local       |--|  Paging, etc.) |
|   Calling   |    | Gateway     |  +-----------------+
|   Cloud     |    | (CUBE)      |  
+-------------+    +-------------+  SIP trunk to 
                                    legacy device

CONFIGURATION:
--------------
Local Gateway handles:
* SIP interworking
* Codec translation (if needed)
* DTMF conversion
* Call routing

Example: Paging Server via Local Gateway
----------------------------------------
1. Paging server registers to Local Gateway (CUBE)
2. Webex Calling routes page calls to Local Gateway
3. Local Gateway forwards to paging server
4. Paging server broadcasts to speakers
```

---

## 10H.15 Custom CTI/TAPI Applications

### CTI Migration Considerations

```
CTI/TAPI APPLICATION MIGRATION
===========================================================================

Applications that use CUCM CTI/TAPI must be evaluated for Webex migration:

COMMON CTI APPLICATIONS:
------------------------
* CRM screen pop (Salesforce, Dynamics)
* Wallboard/dashboard applications
* Workforce management
* Call recording (server-based)
* Custom dialers
* Click-to-call integrations

WEBEX CALLING ALTERNATIVES:
---------------------------

1. Webex Calling APIs (REST)
   -------------------------
   * Modern REST APIs
   * Webhook events for call activity
   * Click-to-call API
   * Call control API
   
   Documentation: developer.webex.com

2. Webex Embedded Apps
   --------------------
   * Embed apps in Webex App
   * CRM integration in calling interface
   * Custom widgets

3. Partner Integrations
   ---------------------
   Pre-built integrations available:
   * Salesforce for Webex Calling
   * Microsoft Dynamics connector
   * ServiceNow integration

4. Webex Contact Center (for CC applications)
   ------------------------------------------
   * Agent Desktop APIs
   * CRM connectors
   * Custom widgets
   * Real-time events

MIGRATION APPROACH:
-------------------
1. Inventory all CTI/TAPI applications
2. Identify Webex API equivalent
3. Engage vendor for Webex support
4. Develop/modify integration
5. Test in parallel
6. Cutover with user migration

EXAMPLE: CRM Screen Pop Migration
---------------------------------
CUCM: CTI/TAPI monitors line -> inbound call -> TAPI event -> screen pop

Webex: Webex Webhook -> inbound call event -> app receives webhook -> screen pop

The application needs modification to use Webex webhooks instead of TAPI.
```

---

## Part 5: Call Recording Migration

## 10H.16 Enterprise Call Recording Options

### Call Recording for Non-Contact Center Users

```
CALL RECORDING OPTIONS IN WEBEX CALLING
===========================================================================

Webex Calling provides multiple recording options:

OPTION 1: Webex Native Recording (Control Hub)
----------------------------------------------
* Built-in to Webex Calling
* Stored in Webex cloud
* Per-user or org-wide policy
* Basic compliance features

Configuration:
1. Control Hub > Calling > Service Settings
2. Enable Call Recording
3. Set recording policy:
   [ ] Always On (all calls recorded)
   [ ] Always On with Pause/Resume
   [ ] On Demand (user-initiated)
   [ ] Never

Storage:
* Recordings stored in Webex cloud
* Regional data residency options
* Configurable retention period

OPTION 2: Dubber (Cloud Recording Partner)
------------------------------------------
* Enterprise-grade compliance recording
* Native Webex Calling integration
* Advanced analytics and AI
* Long-term archival
* PCI/HIPAA compliance

Features:
* Automatic recording capture
* Transcription and sentiment analysis
* Policy-based recording
* Legal hold and eDiscovery
* Integration with compliance archives

Configuration:
1. Enable Dubber in Control Hub
2. Configure recording policies
3. Assign users/groups for recording
4. Configure storage/retention

OPTION 3: Local Gateway Recording (Hybrid)
------------------------------------------
* Record at Local Gateway (CUBE)
* Integrate with on-premises recording
* For compliance that requires on-prem storage

Architecture:
Webex Calling -> Local Gateway -> Recording Server
                    |
                    +-> SIPREC/forking
                    |
                    +-> Recording platform
                        (NICE, Verint, etc.)

COMPARISON:
-----------
Feature              Native    Dubber    Local GW
-------------------------------------------------
Cloud storage        OK         OK         X
On-prem storage      X         X         OK
AI/Transcription     Basic     OK         Varies
Compliance           Basic     OK         OK
Long-term archive    Limited   OK         OK
Cost                 Included  Add-on    Complex

RECOMMENDATION:
---------------
* Basic recording needs: Native Webex recording
* Compliance requirements: Dubber
* On-prem requirement: Local Gateway + existing platform
```

---

## Summary Checklists

## Pre-Migration Specialty Device Assessment

| Task | Status | Notes |
|------|--------|-------|
| **Analog Devices** | | |
| [ ] Complete analog device inventory | | Count: ___ |
| [ ] Identify all fax machines | | Count: ___ |
| [ ] Identify elevator phones | | Count: ___ |
| [ ] Identify door phones/intercoms | | Count: ___ |
| [ ] Document current ATA/VG gateways | | |
| **Paging Systems** | | |
| [ ] Document paging system type | | |
| [ ] Identify paging zones | | Count: ___ |
| [ ] Document paging controller | | |
| [ ] Assess mass notification needs | | |
| **Video Endpoints** | | |
| [ ] Inventory room video systems | | Count: ___ |
| [ ] Identify EoL devices for replacement | | Count: ___ |
| [ ] Inventory conference phones | | Count: ___ |
| **Third-Party Devices** | | |
| [ ] List all third-party SIP phones | | Count: ___ |
| [ ] Identify CTI/TAPI applications | | Count: ___ |
| [ ] Assess call recording requirements | | |

## Migration Execution Checklist

| Phase | Task | Status |
|-------|------|--------|
| **Phase 1** | Migrate critical safety devices (elevator) | [ ] |
| **Phase 2** | Migrate fax/analog devices | [ ] |
| **Phase 3** | Migrate paging systems | [ ] |
| **Phase 4** | Migrate video endpoints | [ ] |
| **Phase 5** | Migrate/replace third-party devices | [ ] |
| **Phase 6** | Test all specialty devices | [ ] |
| **Phase 7** | Decommission legacy equipment | [ ] |

---

## Document References

| Reference | Description |
|-----------|-------------|
| Cisco ATA 191/192 Admin Guide | https://www.cisco.com/c/en/us/support/unified-communications/ata-191-analog-telephone-adapter/model.html |
| Webex Calling Device Support | https://help.webex.com/article/nxzp7tb |
| InformaCast Webex Integration | https://www.singlewire.com/informacast-webex-calling |
| Dubber Recording | https://www.dubber.net/webex |
| Webex Room Device Deployment | https://help.webex.com/article/n5qkmkb |

---

## Abhavtech Applicability Note

**Based on the discovery assessment, Abhavtech does NOT have:**
- Analog devices (fax machines, elevator phones, door phones)
- Overhead paging systems
- Video room systems registered to CUCM
- Third-party SIP phones

**This appendix is provided for:**
1. Completeness of documentation
2. Reference for future deployments
3. Guidance if devices are discovered during implementation

---

*End of Appendix 10H: Specialty Device Migration Guide*
