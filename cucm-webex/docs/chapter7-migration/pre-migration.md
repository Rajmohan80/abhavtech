# Chapter 7: Migration Execution 

> **Document Reference:** ABV-COLLAB-MIG-2026 | Chapter 7
> **Cross-References:** Chapter 1 (Discovery), Chapter 2 (Design), Chapter 6 (Implementation)
> **Style:** Implementation-focused (Sonnet 4.5)
> **Scope:** CUCM -> Webex Calling Migration Procedures

---

## 7.1 Migration Strategy Overview

### 7.1.1 Migration Approach

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Method** | Phased migration | Minimize risk, allow learning |
| **Coexistence** | CUCM <-> Webex via CUBE | Maintain inter-platform calling |
| **Batch Size** | 50-150 users per batch | Manageable support load |
| **Timing** | Weekday evenings (after 6 PM) | Minimize business impact |
| **Rollback Window** | 48 hours per batch | Quick recovery if issues |

### 7.1.2 Migration Phases

```
+-----------------------------------------------------------------+
|  CUCM TO WEBEX CALLING MIGRATION PHASES                          |
+-----------------------------------------------------------------+
|                                                                 |
|  PHASE 1: PREPARATION (Week 1-2)                               |
|  +-- CUCM data export                                          |
|  +-- User/device mapping                                       |
|  +-- Coexistence trunk setup                                   |
|  +-- Pilot user identification                                 |
|                                                                 |
|  PHASE 2: PILOT (Week 3-4)                                     |
|  +-- Migrate 50 pilot users (Mumbai)                          |
|  +-- Validate all call scenarios                               |
|  +-- Document issues and fixes                                 |
|  +-- Pilot sign-off                                            |
|                                                                 |
|  PHASE 3: PRODUCTION ROLLOUT (Week 5-16)                       |
|  +-- Site-by-site migration                                    |
|  +-- Batch migrations per schedule                             |
|  +-- Daily validation and support                              |
|  +-- Progressive CUCM decommission                             |
|                                                                 |
|  PHASE 4: CLEANUP (Week 17-20)                                 |
|  +-- Final user migrations                                     |
|  +-- CUCM decommissioning                                      |
|  +-- Documentation handover                                    |
|  +-- Project closure                                           |
|                                                                 |
+-----------------------------------------------------------------+
```

### 7.1.3 Migration Batch Plan

| Batch | Site | Users | Date | Window | Owner |
|-------|------|-------|------|--------|-------|
| Pilot | Mumbai (IT Dept) | 50 | Week 3 | Mon-Fri | Voice Eng |
| 1 | Mumbai HQ - Floor 1-3 | 150 | Week 5 | Tue-Thu | Voice Eng |
| 2 | Mumbai HQ - Floor 4-6 | 150 | Week 5 | Tue-Thu | Voice Eng |
| 3 | Mumbai HQ - Floor 7-10 | 150 | Week 6 | Tue-Thu | Voice Eng |
| 4 | Mumbai HQ - Remaining | 150 | Week 6 | Tue-Thu | Voice Eng |
| 5 | Mumbai CC Agents | 120 | Week 6 | Weekend | Voice Eng |
| 6 | Chennai | 450 | Week 7 | Tue-Sat | Regional IT |
| 7 | Bangalore | 180 | Week 8 | Tue-Thu | Regional IT |
| 8 | Delhi | 150 | Week 8 | Tue-Thu | Regional IT |
| 9 | Noida | 120 | Week 9 | Tue-Thu | Regional IT |
| 10 | Pune | 100 | Week 9 | Tue-Thu | Regional IT |
| 11 | Hyderabad | 200 | Week 10 | Tue-Thu | Regional IT |
| 12 | London | 520 | Week 11-12 | Tue-Sat | EMEA IT |
| 13 | Frankfurt | 280 | Week 13 | Tue-Thu | EMEA IT |
| 14 | New Jersey | 480 | Week 14-15 | Tue-Sat | Americas IT |
| 15 | Dallas | 270 | Week 16 | Tue-Thu | Americas IT |

---

## 7.2 Pre-Migration Procedures

### 7.2.1 CUCM Data Export

**Procedure: Export User and Device Data from CUCM**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Login to CUCM Publisher | OS Administration |
| 2 | Navigate to Bulk Administration -> Export | BAT Export |
| 3 | Select "Export Phones" | Device export |
| 4 | Select all device types | 88XX, 78XX, Jabber |
| 5 | Click "Find" then "Export All" | Generates CSV |
| 6 | Download export file | phones_export.csv |
| 7 | Navigate to Export -> Users | User export |
| 8 | Select "End Users" | All users |
| 9 | Click "Find" then "Export All" | Generates CSV |
| 10 | Download export file | users_export.csv |

**CUCM CLI Export Commands (Alternative):**

```sql
! Export all phones with line details
admin:run sql SELECT d.name as DeviceName, d.description, 
  dp.name as DevicePool, n.dnorpattern as Extension, 
  n.description as LineDesc, eu.userid as Owner
FROM device d
INNER JOIN devicenumplanmap dnpm ON d.pkid = dnpm.fkdevice
INNER JOIN numplan n ON dnpm.fknumplan = n.pkid
INNER JOIN devicepool dp ON d.fkdevicepool = dp.pkid
LEFT JOIN enduser eu ON d.fkenduser = eu.pkid
WHERE d.tkclass = 1
ORDER BY dp.name, n.dnorpattern

! Export hunt group membership
admin:run sql SELECT hl.name as HuntList, hg.lineselectionorder,
  n.dnorpattern as MemberDN, n.description
FROM huntlist hl
INNER JOIN huntgroup hg ON hl.pkid = hg.fkhuntlist
INNER JOIN numplan n ON hg.fknumplan = n.pkid
ORDER BY hl.name, hg.lineselectionorder

! Export call forward settings
admin:run sql SELECT n.dnorpattern, cfwd.cfadestination, 
  cfwd.cfavoicemailenabled
FROM numplan n
INNER JOIN callforwarddynamic cfwd ON n.pkid = cfwd.fknumplan
WHERE cfwd.cfadestination IS NOT NULL
```

> **Reference:** https://www.cisco.com/c/en/us/td/docs/voice_ip_comm/cucm/bat/14_0_1/cucm_b_bulk-administration-guide-14/cucm_b_bulk-administration-guide-1401_chapter_01001.html

### 7.2.2 User Mapping Procedure

**Procedure: Create CUCM to Webex User Mapping**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Open CUCM users_export.csv | Excel/Sheets |
| 2 | Open Webex user export (Control Hub) | Compare lists |
| 3 | Create mapping spreadsheet with columns: | See template below |
| | - CUCM UserID | |
| | - CUCM Extension | |
| | - CUCM DID | |
| | - Webex Email | |
| | - Webex Extension (new) | |
| | - Webex DID | |
| | - Migration Batch | |
| 4 | Match by email address | Primary key |
| 5 | Flag users without Webex account | Create before migration |
| 6 | Flag users with extension conflicts | Resolve before migration |
| 7 | Assign to migration batches | Per batch plan |
| 8 | Review with site IT leads | Validate assignments |
| 9 | Lock mapping spreadsheet | Change control |

**User Mapping Template:**

| CUCM UserID | CUCM Ext | CUCM DID | Webex Email | Webex Ext | Webex DID | Batch | Status |
|-------------|----------|----------|-------------|-----------|-----------|-------|--------|
| rkumar | 1001 | +912249600001 | rajesh.kumar@abhavtech.com | 1001 | +912249600001 | Pilot | Pending |
| psharma | 1002 | +912249600002 | priya.sharma@abhavtech.com | 1002 | +912249600002 | Pilot | Pending |

### 7.2.3 Feature Inventory Export

**Procedure: Export CUCM Features for Migration**

| Step | Action | Output |
|------|--------|--------|
| 1 | Export Hunt Groups | hunt_groups.csv |
| 2 | Export Hunt Group Members | hunt_members.csv |
| 3 | Export Call Pickup Groups | pickup_groups.csv |
| 4 | Export Speed Dials (per phone) | speed_dials.csv |
| 5 | Export BLF/Presence subscriptions | blf_config.csv |
| 6 | Export Call Forward settings | call_forward.csv |
| 7 | Export Voicemail PINs (Unity) | vm_pins.csv |
| 8 | Export Shared Lines | shared_lines.csv |
| 9 | Document Auto Attendant scripts | aa_scripts.docx |
| 10 | Document IVR call flows | ivr_flows.docx |

**Hunt Group Export SQL:**

```sql
admin:run sql SELECT 
  hp.dnorpattern as HuntPilot,
  hp.description as HuntName,
  hl.name as HuntList,
  rg.name as RouteGroup,
  COUNT(hg.pkid) as MemberCount
FROM huntlist hl
INNER JOIN numplan hp ON hl.fknumplan_huntpilot = hp.pkid
INNER JOIN routegroup rg ON hl.fkroutegroup = rg.pkid
INNER JOIN huntgroup hg ON hl.pkid = hg.fkhuntlist
GROUP BY hp.dnorpattern, hp.description, hl.name, rg.name
```

### 7.2.4 Coexistence Trunk Validation

**Procedure: Verify CUCM-Webex Coexistence Before Migration**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Verify CUBE trunk to Webex is UP | `show sip-ua status` = Active |
| 2 | Verify CUCM trunk to CUBE is UP | CUCM Admin -> Trunk = "Full Service" |
| 3 | Test: CUCM user calls Webex user | Call completes |
| 4 | Test: Webex user calls CUCM user | Call completes |
| 5 | Test: CUCM user calls PSTN via Webex | Call completes (if designed) |
| 6 | Check audio quality (both directions) | No one-way audio |
| 7 | Document trunk capacity | Concurrent call limit |

> **Reference:** Chapter 2, Section 2.6 (Coexistence Design)

---

## 7.3 User Migration Procedures

### 7.3.1 Pre-Migration User Checklist

**Procedure: Prepare User for Migration (Day Before)**

| Step | Action | Owner | Status |
|------|--------|-------|--------|
| 1 | Verify user exists in Webex (SCIM synced) | Webex Admin | [ ] |
| 2 | Verify Webex Calling license assigned | Webex Admin | [ ] |
| 3 | Verify correct location assigned | Webex Admin | [ ] |
| 4 | Verify extension configured in Webex | Webex Admin | [ ] |
| 5 | Verify DID assigned in Webex | Webex Admin | [ ] |
| 6 | Export user's CUCM settings | Voice Eng | [ ] |
| 7 | Document current call forwards | Voice Eng | [ ] |
| 8 | Document speed dials/BLF | Voice Eng | [ ] |
| 9 | Send user notification email | Comms Team | [ ] |
| 10 | Confirm user training completed | Training | [ ] |

### 7.3.2 CUCM Phone Deactivation

**Procedure: Remove Phone from CUCM**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Login to CUCM Administration | Publisher or Subscriber |
| 2 | Navigate to Device -> Phone | Phone search |
| 3 | Search for device by name or MAC | SEP + MAC address |
| 4 | Click on device name | Open configuration |
| 5 | Note current settings | Screenshot for reference |
| 6 | Document: Device Pool, CSS, Location | Capture config |
| 7 | Document: Line 1 DN, Label, Display | Capture line settings |
| 8 | Click "Delete" | Remove from CUCM |
| 9 | Confirm deletion | Phone deregisters |
| 10 | Verify phone shows "Unregistered" | No CUCM config |

> **Reference:** https://www.cisco.com/c/en/us/td/docs/voice_ip_comm/cucm/admin/14_0_1/adminGd/cucm_b_administration-guide-14/cucm_b_administration-guide-1401_chapter_010001.html

### 7.3.3 Phone Factory Reset (If Required)

**Procedure: Factory Reset Cisco IP Phone**

| Step | Action | Notes |
|------|--------|-------|
| 1 | On phone: Press **Settings** | Gear icon |
| 2 | Navigate to **Admin Settings** | May require password |
| 3 | Enter admin password (default: cisco) | Or configured password |
| 4 | Select **Reset Settings** | Reset menu |
| 5 | Select **All Settings** | Full factory reset |
| 6 | Confirm reset | Phone reboots |
| 7 | Phone restarts with no configuration | Ready for Webex |
| 8 | Phone requests activation or DHCP config | Depends on network |

**Alternative: Key Sequence Reset (8800 Series)**

| Step | Action |
|------|--------|
| 1 | Unplug phone power |
| 2 | Press and hold **#** key |
| 3 | Plug in power while holding **#** |
| 4 | Continue holding until LEDs flash |
| 5 | Release **#** when "Upgrading" appears |
| 6 | Phone resets to factory defaults |

### 7.3.4 Phone Activation on Webex Calling

**Procedure: Activate Phone for Webex Calling (MAC Method)**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Obtain phone MAC address | Label on back |
| 2 | Login to Control Hub | admin.webex.com |
| 3 | Navigate to Devices -> Add Device | Add phone |
| 4 | Select "Cisco IP Phone" | MPP device |
| 5 | Select exact phone model | 8845, 8865, 7841 |
| 6 | Enter MAC address (no colons) | AABBCCDDEEFF |
| 7 | Select "Assign to User" | Personal phone |
| 8 | Search for user email | Find migrating user |
| 9 | Select Location | User's office location |
| 10 | Click "Save" | Device registered |
| 11 | Connect phone to network | Voice VLAN |
| 12 | Phone downloads Webex firmware | May take 5-10 min |
| 13 | Phone reboots and shows user line | Migration complete |

> **Reference:** https://help.webex.com/article/gkrapq (Add Phones to Webex)

### 7.3.5 Migrate Call Forward Settings

**Procedure: Configure Call Forwarding in Webex**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Login to Control Hub | admin.webex.com |
| 2 | Navigate to Users -> search user | Find migrated user |
| 3 | Click user -> Calling -> Call Forwarding | Forward settings |
| 4 | Reference CUCM export for user's forwards | call_forward.csv |
| 5 | Configure "When Busy": | |
| | - Toggle ON if was enabled in CUCM | |
| | - Enter destination number | Same as CUCM |
| 6 | Configure "When No Answer": | |
| | - Toggle ON | |
| | - Set ring count (default 4) | Match CUCM |
| | - Enter destination | Same as CUCM |
| 7 | Configure "When Unreachable": | |
| | - Toggle ON | |
| | - Enter destination | Usually voicemail |
| 8 | Click "Save" | Apply settings |

**User Self-Service (Alternative):**

| Step | Action |
|------|--------|
| 1 | User logs into settings.webex.com |
| 2 | Navigate to Calling -> Call Forwarding |
| 3 | User configures own forwarding preferences |
| 4 | Changes apply immediately |

> **Reference:** https://help.webex.com/article/n9r1aac (Call Forwarding)

### 7.3.6 Migrate Speed Dials and BLF

**Procedure: Configure Speed Dials/BLF on Webex Phone**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Reference CUCM speed dial export | speed_dials.csv |
| 2 | Login to Control Hub | admin.webex.com |
| 3 | Navigate to Devices -> find phone | By user or MAC |
| 4 | Click phone -> Configure -> Line Keys | Key configuration |
| 5 | For each speed dial from CUCM: | |
| | - Select available line key | Keys 2-10 |
| | - Set Function: "Speed Dial" | |
| | - Enter Label | Name from CUCM |
| | - Enter Number | Destination |
| 6 | For BLF entries: | |
| | - Set Function: "BLF" | Busy Lamp Field |
| | - Enter monitored extension | Internal users |
| 7 | Click "Save" | Push to phone |
| 8 | Phone updates within 1 minute | Verify keys work |

**Bulk Line Key Configuration (CSV):**

```csv
MAC Address,Key Position,Function,Label,Value
AABBCC001001,2,Speed Dial,IT Support,1100
AABBCC001001,3,Speed Dial,Reception,1001
AABBCC001001,4,BLF,Manager,1050
```

> **Reference:** https://help.webex.com/article/jgx4ym (Configure Line Keys)

### 7.3.7 Voicemail Migration

**Procedure: Configure Voicemail for Migrated User**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Webex voicemail auto-enabled | With Calling license |
| 2 | Navigate to Users -> user -> Calling -> Voicemail | VM settings |
| 3 | Verify Voicemail is Enabled | Toggle ON |
| 4 | Configure notification settings: | |
| | - Email notification: ON | User's email |
| | - Attach voicemail: ON | MP3 attachment |
| 5 | Set default greeting | System or custom |
| 6 | Click "Save" | Apply settings |
| 7 | User must set new PIN | Cannot migrate CUCM PIN |
| 8 | User calls voicemail portal | First-time setup |
| 9 | User records new greeting | Or use system default |

**User Voicemail Setup:**

| Step | Action |
|------|--------|
| 1 | Dial voicemail access number (or press VM button) |
| 2 | System prompts for new PIN |
| 3 | Enter 6-digit PIN (twice to confirm) |
| 4 | Record name |
| 5 | Record personal greeting (optional) |
| 6 | Voicemail ready to use |

> **Reference:** https://help.webex.com/article/n5qc5u4 (Voicemail Settings)

**[!]️ Important:** CUCM/Unity voicemails do NOT migrate. Users must:
- Listen to old voicemails before migration
- Save important messages externally
- New voicemail box starts empty

---

## 7.4 Feature Migration Procedures

### 7.4.1 Hunt Group Migration

**Procedure: Migrate Hunt Group from CUCM to Webex**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Reference CUCM hunt group export | hunt_groups.csv |
| 2 | **Pre-requisite:** All HG members migrated to Webex | Must complete first |
| 3 | Login to Control Hub | admin.webex.com |
| 4 | Navigate to Calling -> Features -> Hunt Group | HG management |
| 5 | Click "Create Hunt Group" | New HG |
| 6 | Enter Name | Match CUCM name |
| 7 | Select Location | Same as members |
| 8 | Enter Phone Number (DID) | CUCM hunt pilot DID |
| 9 | Enter Extension | CUCM hunt pilot ext |
| 10 | Set Caller ID Name | Display name |
| 11 | Set Call Distribution: | |
| | - Circular (rotating) | |
| | - Top Down (sequential) | |
| | - Longest Idle | |
| | - Simultaneous (ring all) | Match CUCM algorithm |
| 12 | Set Hunt Pattern options: | |
| | - Forward after timeout | Voicemail or number |
| | - Timeout (seconds) | Match CUCM |
| 13 | Add Members: | |
| | - Search by name/extension | |
| | - Add in correct order | Match CUCM order |
| 14 | Click "Create" | HG active |
| 15 | Test: call hunt pilot number | Verify distribution |

> **Reference:** https://help.webex.com/article/nwtulzs (Hunt Groups)

### 7.4.2 Call Pickup Group Migration

**Procedure: Migrate Call Pickup Group from CUCM to Webex**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Reference CUCM pickup group export | pickup_groups.csv |
| 2 | Login to Control Hub | admin.webex.com |
| 3 | Navigate to Calling -> Features -> Call Pickup | Pickup management |
| 4 | Click "Create Call Pickup Group" | New group |
| 5 | Enter Group Name | Match CUCM name |
| 6 | Select Location | Same as members |
| 7 | Add Members: | |
| | - Search users | |
| | - Add all pickup group members | From CUCM list |
| 8 | Click "Create" | Group active |
| 9 | Test: Call member, have other member pickup | *98 or Pickup key |

> **Reference:** https://help.webex.com/article/nt4ect (Call Pickup)

### 7.4.3 Call Park Migration

**Procedure: Configure Call Park in Webex**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Calling -> Features -> Call Park | Park configuration |
| 2 | Select Location | Site to configure |
| 3 | Configure Park Recall settings: | |
| | - Recall timer (seconds) | Default 60 |
| | - Recall destination | Original parker |
| 4 | Configure Park Extension Range: | |
| | - Start: 7001 | Or match CUCM |
| | - End: 7010 | Size per site |
| 5 | Click "Save" | Park enabled |
| 6 | Test: Park call, retrieve from another phone | Dial park slot |

> **Reference:** https://help.webex.com/article/7f4c38 (Call Park)

### 7.4.4 Shared Line Migration

**Procedure: Configure Shared Line Appearance (SLA)**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Reference CUCM shared line export | shared_lines.csv |
| 2 | Identify primary user for shared line | Owner |
| 3 | Login to Control Hub | admin.webex.com |
| 4 | Navigate to Calling -> Features -> Virtual Lines | Shared lines |
| 5 | Click "Create Virtual Line" | New shared line |
| 6 | Enter Display Name | "Sales Shared Line" |
| 7 | Select Location | Line's location |
| 8 | Enter Phone Number (DID) | Shared DID |
| 9 | Enter Extension | Shared extension |
| 10 | Configure Calling Settings: | |
| | - Caller ID | |
| | - Voicemail (if needed) | |
| 11 | Click "Create" | Virtual line created |
| 12 | Assign to users' phones: | |
| | - Navigate to each user's device | |
| | - Add Virtual Line to line key | |
| 13 | Test: Call shared line, verify all phones ring | |

> **Reference:** https://help.webex.com/article/z5kt47 (Virtual Lines)

### 7.4.5 Auto Attendant Migration

**Procedure: Migrate Auto Attendant from CUCM**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Reference CUCM AA configuration | aa_scripts.docx |
| 2 | Export greeting prompts from CUCM | WAV/MP3 files |
| 3 | Login to Control Hub | admin.webex.com |
| 4 | Navigate to Calling -> Features -> Auto Attendant | AA management |
| 5 | Click "Create Auto Attendant" | New AA |
| 6 | Enter Name | Match CUCM name |
| 7 | Select Location | AA's location |
| 8 | Enter Phone Number (DID) | Main number |
| 9 | Enter Extension | Pilot extension |
| 10 | Set Language | English (India) |
| 11 | Set Time Zone | IST |
| 12 | Configure Business Hours: | |
| | - Set schedule | Mon-Fri 9AM-6PM |
| 13 | Configure Business Hours Menu: | |
| | - Upload greeting prompt | WAV file |
| | - Configure key options | Per CUCM menu |
| | - Set timeout action | |
| 14 | Configure After Hours Menu: | |
| | - Upload after-hours greeting | |
| | - Configure key options | |
| 15 | Click "Create" | AA active |
| 16 | Test all menu options | Verify routing |

**Menu Option Configuration:**

| Key | Action Type | Destination |
|-----|-------------|-------------|
| 1 | Transfer to Hunt Group | Sales HG |
| 2 | Transfer to Hunt Group | Support HG |
| 3 | Transfer to User | HR Manager |
| 0 | Transfer to User | Operator |
| # | Repeat Menu | - |

> **Reference:** https://help.webex.com/article/nuwylhx (Auto Attendants)

---

## 7.5 CUCM Route Pattern Updates

### 7.5.1 Extension Block Migration

**Procedure: Update CUCM Route Patterns for Migrated Extensions**

As users migrate to Webex, CUCM must route calls to migrated extensions via the CUBE trunk to Webex.

| Step | Action | Notes |
|------|--------|-------|
| 1 | Login to CUCM Administration | Publisher |
| 2 | Navigate to Call Routing -> Route/Hunt -> Route Pattern | Pattern config |
| 3 | Click "Add New" | Create new pattern |
| 4 | Enter Pattern for migrated range: | Example: 1XXX |
| | - Pattern: 1[0-4]XX | Extensions 1000-1499 |
| | - Or specific: 1001 | Individual extension |
| 5 | Select Route List or SIP Trunk: | |
| | - Gateway/Route List: RL-to-CUBE | CUBE route list |
| 6 | Set Calling Search Space | Appropriate CSS |
| 7 | Set numbering plan: | |
| | - Called Party Transform: None | |
| | - Calling Party Transform: None | |
| 8 | Click "Save" | Pattern active |
| 9 | Test: CUCM user dials migrated extension | Routes to Webex |

**Route Pattern Strategy:**

| Migration Stage | Pattern | Route To |
|-----------------|---------|----------|
| Pre-migration | 1XXX | Internal (CUCM) |
| Batch 1 complete | 10XX | CUBE -> Webex |
| | 1[1-9]XX | Internal (CUCM) |
| All migrated | 1XXX | CUBE -> Webex |

### 7.5.2 DID Range Migration

**Procedure: Update CUCM for Migrated DIDs**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Identify migrated DID range | +91-22-4960-1000 to 1099 |
| 2 | Remove Translation Pattern (if exists) | CUCM may have TP |
| 3 | Create Route Pattern for migrated DIDs: | |
| | - Pattern: \+912249600001XXX | Escaped + |
| | - Route List: RL-to-CUBE | Via CUBE to Webex |
| 4 | Alternatively, update SIP Trunk routing | All unknown -> CUBE |
| 5 | Test: External call to migrated DID | Rings Webex user |

---

## 7.6 Batch Migration Runbook

### 7.6.1 Migration Day Schedule Template

**T-1 Day (Day Before Migration):**

| Time | Task | Owner | Status |
|------|------|-------|--------|
| 09:00 | Final batch user list review | PM | [ ] |
| 10:00 | Verify all users have Webex accounts | Webex Admin | [ ] |
| 11:00 | Verify all phones staged in Webex | Webex Admin | [ ] |
| 14:00 | Send user reminder email | Comms | [ ] |
| 16:00 | Verify coexistence trunk operational | Voice Eng | [ ] |
| 17:00 | Brief help desk on expected calls | Help Desk Lead | [ ] |

**Migration Day (T-Day):**

| Time | Task | Owner | Status |
|------|------|-------|--------|
| 17:00 | Migration team go/no-go call | PM | [ ] |
| 17:30 | Begin CUCM phone deletions | Voice Eng | [ ] |
| 18:00 | Factory reset phones (if required) | Site IT | [ ] |
| 18:30 | Activate phones in Webex | Webex Admin | [ ] |
| 19:00 | Phones download Webex firmware | Auto | [ ] |
| 19:30 | Begin user validation testing | Voice Eng | [ ] |
| 20:00 | Update CUCM route patterns | Voice Eng | [ ] |
| 20:30 | Configure user features (forwards, etc.) | Webex Admin | [ ] |
| 21:00 | Complete validation testing | Voice Eng | [ ] |
| 21:30 | Migration status call | PM | [ ] |
| 22:00 | Notify users migration complete | Comms | [ ] |

**T+1 Day (Day After Migration):**

| Time | Task | Owner | Status |
|------|------|-------|--------|
| 08:00 | Help desk prepared for calls | Help Desk | [ ] |
| 09:00 | Floor walk - verify phones working | Site IT | [ ] |
| 10:00 | Address any user issues | Voice Eng | [ ] |
| 12:00 | Midday status check | PM | [ ] |
| 17:00 | End of day status | PM | [ ] |

### 7.6.2 Hour-by-Hour Runbook Template

```
+-----------------------------------------------------------------+
|  MIGRATION RUNBOOK - BATCH [X] - [DATE]                          |
+-----------------------------------------------------------------+
|                                                                 |
|  BATCH DETAILS:                                                |
|  Site: [Location]                                              |
|  Users: [Count]                                                |
|  Extensions: [Range]                                           |
|  Migration Lead: [Name]                                        |
|  Rollback Decision Time: [Time]                                |
|                                                                 |
|  HOUR-BY-HOUR EXECUTION:                                       |
|                                                                 |
|  17:00 - GO/NO-GO DECISION                                     |
|  +-- [ ] All pre-checks passed                                   |
|  +-- [ ] Team assembled                                          |
|  +-- [ ] Rollback plan confirmed                                 |
|  +-- [ ] GO decision made by: ________                           |
|                                                                 |
|  17:30 - CUCM DEACTIVATION                                     |
|  +-- [ ] CUCM phones deleted (BAT or manual)                    |
|  +-- [ ] Phones show unregistered                                |
|  +-- [ ] Screenshot captured for records                         |
|                                                                 |
|  18:00 - PHONE RESET                                           |
|  +-- [ ] Factory reset completed (if needed)                    |
|  +-- [ ] Phones connected to voice VLAN                         |
|  +-- [ ] Phones requesting config                                |
|                                                                 |
|  18:30 - WEBEX ACTIVATION                                      |
|  +-- [ ] MACs registered in Control Hub                         |
|  +-- [ ] Phones downloading firmware                             |
|  +-- [ ] Firmware download complete                              |
|                                                                 |
|  19:00 - PHONE REGISTRATION                                    |
|  +-- [ ] Phones showing user lines                               |
|  +-- [ ] Extension displayed correctly                           |
|  +-- [ ] Registration status GREEN in Control Hub               |
|                                                                 |
|  19:30 - VALIDATION TESTING                                    |
|  +-- [ ] Internal call test (extension to extension)            |
|  +-- [ ] PSTN outbound test                                      |
|  +-- [ ] PSTN inbound test (call DID)                           |
|  +-- [ ] Voicemail test                                          |
|  +-- [ ] CUCM-to-Webex call test (coexistence)                  |
|  +-- [ ] Webex-to-CUCM call test (coexistence)                  |
|                                                                 |
|  20:00 - CUCM ROUTE PATTERN UPDATE                             |
|  +-- [ ] Route patterns updated for migrated extensions         |
|  +-- [ ] Test CUCM user calling migrated extension              |
|  +-- [ ] Test migrated user calling CUCM extension              |
|                                                                 |
|  20:30 - FEATURE CONFIGURATION                                 |
|  +-- [ ] Call forwards configured                                |
|  +-- [ ] Speed dials/BLF configured                              |
|  +-- [ ] Hunt groups updated (if all members migrated)          |
|  +-- [ ] Voicemail greetings reminder sent                       |
|                                                                 |
|  21:00 - FINAL VALIDATION                                      |
|  +-- [ ] 10% sample call testing                                 |
|  +-- [ ] No open P1/P2 issues                                    |
|  +-- [ ] Help desk briefed                                       |
|  +-- [ ] User notification sent                                  |
|                                                                 |
|  21:30 - SIGN-OFF                                              |
|  +-- [ ] Migration Lead sign-off: ________                       |
|  +-- [ ] Issues documented: [Count]                              |
|  +-- [ ] Rollback: NOT REQUIRED / PARTIAL / FULL                |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 7.7 Rollback Procedures

### 7.7.1 Rollback Decision Criteria

| Trigger | Threshold | Action |
|---------|-----------|--------|
| Phone registration failure | >20% of batch | Rollback batch |
| Call failure rate | >10% for 30+ minutes | Rollback batch |
| PSTN outbound failure | >5% of test calls | Investigate, potential rollback |
| One-way audio | >5% of calls | Investigate, potential rollback |
| Total outage | Any duration | Immediate rollback |
| User escalations | >10 P1 tickets | Assess rollback |

### 7.7.2 Rollback Procedure

**Procedure: Rollback User to CUCM**

| Step | Action | Notes |
|------|--------|-------|
| 1 | **DECISION:** Confirm rollback required | PM + Voice Eng Lead |
| 2 | Notify help desk and users | Email/SMS |
| 3 | In Control Hub: Delete phone device | Webex Admin |
| 4 | Factory reset phone | Site IT |
| 5 | In CUCM: Re-add phone | Use BAT or manual |
| 6 | Re-apply CUCM configuration: | From backup |
| | - Device Pool | |
| | - CSS | |
| | - Line settings | |
| 7 | Connect phone to network | Registers to CUCM |
| 8 | Verify CUCM registration | Phone functional |
| 9 | Revert CUCM route patterns | Remove Webex routes |
| 10 | Test: Internal and PSTN calls | Verify working |
| 11 | Document rollback reason | Post-mortem |
| 12 | Schedule re-migration attempt | Fix issues first |

**CUCM BAT Re-Add Template:**

```csv
Device Name,Description,Device Pool,CSS,Location,Owner User ID
SEPAABBCC001001,Rajesh Kumar Desk,DP_Mumbai_HQ,CSS_Mumbai,Mumbai,rkumar
```

### 7.7.3 Partial Rollback

**Procedure: Rollback Specific Users Only**

| Step | Action |
|------|--------|
| 1 | Identify affected users |
| 2 | Rollback only affected users (per 7.7.2) |
| 3 | Keep successfully migrated users on Webex |
| 4 | Update CUCM route patterns for mixed state |
| 5 | Schedule affected users for next batch |

---

## 7.8 Post-Migration Validation

### 7.8.1 Call Testing Matrix

| Test Case | From | To | Expected | Pass |
|-----------|------|----|---------| -----|
| Internal (Webex-Webex) | Ext 1001 | Ext 1002 | Rings, connects | [ ] |
| Internal (Webex-CUCM) | Ext 1001 | Ext 2001 | Rings, connects | [ ] |
| Internal (CUCM-Webex) | Ext 2001 | Ext 1001 | Rings, connects | [ ] |
| PSTN Outbound | Ext 1001 | +91-9876543210 | Connects | [ ] |
| PSTN Inbound | +91-9876543210 | +91-22-4960-1001 | Rings user | [ ] |
| Voicemail (no answer) | Any | Ext 1001 | VM after 4 rings | [ ] |
| Voicemail (direct) | User | VM pilot | Access VM | [ ] |
| Hunt Group | External | HG pilot | Distributes | [ ] |
| Auto Attendant | External | AA pilot | Menu plays | [ ] |
| Emergency | Ext 1001 | 112 | Routes to PSAP | [ ] |
| Forward Busy | Any | Ext 1001 (busy) | Forwards | [ ] |
| Forward No Answer | Any | Ext 1001 (no ans) | Forwards | [ ] |

### 7.8.2 Quality Validation

| Metric | Target | Measurement | Pass |
|--------|--------|-------------|------|
| MOS Score | >4.0 | Control Hub Analytics | [ ] |
| Jitter | <30ms | Network monitoring | [ ] |
| Latency | <150ms | Network monitoring | [ ] |
| Packet Loss | <1% | Network monitoring | [ ] |
| Call Setup Time | <3 seconds | Stopwatch test | [ ] |

### 7.8.3 User Sign-Off Template

```
+-----------------------------------------------------------------+
|  USER MIGRATION SIGN-OFF                                         |
+-----------------------------------------------------------------+
|                                                                 |
|  User Name: _____________________                              |
|  Extension: _________  DID: _________________                  |
|  Migration Date: ___________  Batch: _________                 |
|                                                                 |
|  VALIDATION CHECKLIST (User confirms):                         |
|                                                                 |
|  [ ] I can make internal calls                                   |
|  [ ] I can receive internal calls                                |
|  [ ] I can make external (PSTN) calls                           |
|  [ ] I can receive external calls on my DID                     |
|  [ ] My voicemail is working                                     |
|  [ ] My call forwarding is set correctly                        |
|  [ ] My speed dials work                                         |
|  [ ] Webex App is installed and working                         |
|  [ ] I have completed the training                               |
|                                                                 |
|  Issues Reported: ________________________________________     |
|                                                                 |
|  User Signature: _________________  Date: __________           |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 7.9 CUCM Decommissioning

### 7.9.1 Decommission Prerequisites

| Requirement | Status | Notes |
|-------------|--------|-------|
| All users migrated | [ ] | 0 active CUCM users |
| All phones migrated | [ ] | 0 registered devices |
| All features migrated | [ ] | HG, AA, queues |
| Coexistence trunk idle | [ ] | No active calls |
| 30-day stability period | [ ] | No rollbacks needed |
| Backup archived | [ ] | DRS backup saved |
| License reconciliation | [ ] | CUCM licenses released |
| Executive sign-off | [ ] | Approval to decommission |

### 7.9.2 Decommission Procedure

**Procedure: CUCM Cluster Decommission**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Final verification: 0 registered devices | CUCM report |
| 2 | Final verification: 0 active calls | RTMT |
| 3 | Take final DRS backup | Archive permanently |
| 4 | Export all CDRs | Archive for compliance |
| 5 | Disable CUCM services | Stop SRTP, CTI, etc. |
| 6 | Remove DNS records | CUCM FQDNs |
| 7 | Remove from NTP clients | If CUCM was NTP source |
| 8 | Shutdown subscriber nodes | In order: remote first |
| 9 | Shutdown publisher node | Last node |
| 10 | Remove from VMware/UCS | Delete VMs |
| 11 | Release IP addresses | IPAM update |
| 12 | Update network diagrams | Remove CUCM |
| 13 | Notify Cisco licensing | Smart License update |
| 14 | Document decommission | Project closure |

### 7.9.3 Data Retention

| Data Type | Retention Period | Storage |
|-----------|------------------|---------|
| CDR Records | 7 years | Archive storage |
| DRS Backup | 2 years | Offline archive |
| Configuration Export | 2 years | Documentation |
| User Mapping | Permanent | Project documentation |

---

## 7.10 Migration Quick Reference

### Pre-Migration Checklist

- [ ] CUCM data exported (users, phones, features)
- [ ] User mapping complete and approved
- [ ] Coexistence trunk tested
- [ ] Webex locations configured
- [ ] PSTN connectivity verified
- [ ] User notifications sent
- [ ] Help desk briefed

### Migration Day Checklist

- [ ] Go/No-Go call completed
- [ ] CUCM phones deleted
- [ ] Phones reset (if required)
- [ ] Webex phones activated
- [ ] Phones registered successfully
- [ ] Call testing passed
- [ ] CUCM route patterns updated
- [ ] User features configured
- [ ] Sign-off obtained

### Post-Migration Checklist

- [ ] Help desk monitoring calls
- [ ] User issues addressed
- [ ] Call quality verified
- [ ] 48-hour stability confirmed
- [ ] Batch marked complete

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 1, Section 1.1 | CUCM current state inventory |
| Chapter 2, Section 2.6 | Coexistence design |
| Chapter 6 | Implementation procedures |
| Cisco Help | https://help.webex.com/article/gkrapq (Add Phones) |
| Cisco Help | https://help.webex.com/article/nwtulzs (Hunt Groups) |
| Cisco Help | https://help.webex.com/article/nuwylhx (Auto Attendants) |
| Cisco CUCM Admin | BAT Administration Guide |

---

*End of Chapter 7: Migration Execution*

---
