# Contact Center Cutover

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

