# PSTN Configuration

## 6.3 Location & PSTN Setup Procedures

### 6.3.1 Create Location (Step-by-Step)

**Procedure: Add New Location**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Calling -> Locations | Location management |
| 2 | Click "Add Location" button | Opens wizard |
| 3 | Enter Location Name | Example: ABV-Mumbai-HQ |
| 4 | Enter complete street address | Must be valid for E911 |
| 5 | Select Time Zone | (GMT+5:30) India Standard Time |
| 6 | Select Announcement Language | English, Hindi (India) |
| 7 | **Critical:** First location sets Home Region | APAC for Abhavtech |
| 8 | Click "Next" to PSTN setup | Continue wizard |

> **Reference:** https://help.webex.com/article/lp11epy (Add Locations)

**Procedure: Configure Location Calling Settings**

| Step | Action | Notes |
|------|--------|-------|
| 1 | After location created, click location name | Open settings |
| 2 | Navigate to Calling -> Calling Settings | Location calling config |
| 3 | Set Outside Access Code (OAC) | "9" for external calls |
| 4 | Set Extension Range | Example: 1000-1999 |
| 5 | Configure Outbound Caller ID | Main number as default |
| 6 | Set Emergency Callback Number | Required for E911/112 |
| 7 | Configure Voice Portal | Set pilot number |
| 8 | Click Save | Apply settings |

> **Reference:** https://help.webex.com/article/2gfj4v (Location Calling Settings)

### 6.3.2 PSTN Setup - Cloud Connected PSTN (EMEA/Americas)

**Procedure: Connect CCPP Provider**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Calling -> PSTN | PSTN management |
| 2 | Click "Set Up" under Cloud Connected PSTN | Start setup |
| 3 | Select provider: IntelePeer | From provider list |
| 4 | Select locations to connect | London, Frankfurt, NJ, Dallas |
| 5 | Review provider terms | Accept T&C |
| 6 | Click "Activate" | Provisions in ~15 minutes |
| 7 | Verify status shows "Active" (green) | Confirm connectivity |

> **Reference:** https://help.webex.com/article/yg4e68 (Cloud Connected PSTN)

**Procedure: Order DIDs from CCPP**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Calling -> Numbers | Number management |
| 2 | Click "Add Numbers" -> "Order New Numbers" | Opens order form |
| 3 | Select Location | Example: ABV-London |
| 4 | Select Country/Region | United Kingdom |
| 5 | Select City/Area Code | London (+44-20) |
| 6 | Enter quantity needed | Per Chapter 2 DID plan |
| 7 | Review and Submit order | Provider fulfills |
| 8 | Wait for number activation | Usually 24-48 hours |

> **Reference:** https://help.webex.com/article/qxb01q (Order Numbers)

### 6.3.3 PSTN Setup - Local Gateway (India)

**Procedure: Create Local Gateway Trunk**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Calling -> Call Routing -> Trunk | Trunk management |
| 2 | Click "Add Trunk" | Opens wizard |
| 3 | Enter Trunk Name | Example: LGW-Mumbai-Primary |
| 4 | Select Trunk Type: "Local Gateway" | Not CCPP |
| 5 | Select Location | ABV-Mumbai-HQ |
| 6 | Enter LGW FQDN or IP | lgw-mum-01.abhavtech.com |
| 7 | Set Concurrent Calls limit | 60 for Mumbai |
| 8 | Enable "Dual Identity Support" if needed | For toll bypass |
| 9 | Click "Create" | Trunk created |
| 10 | Note the Outbound Proxy address | Configure on CUBE |

> **Reference:** https://help.webex.com/article/32gfts (Local Gateway)

**Procedure: Configure Zone and Edge (India Toll Bypass)**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Calling -> Service Settings -> Zones | Zone management |
| 2 | Click "Create Zone" | Opens form |
| 3 | Enter Zone Name | ABV-Zone-Mumbai |
| 4 | Select associated Edge | Edge-Mumbai |
| 5 | Click "Create" | Zone created |
| 6 | Navigate to Locations -> ABV-Mumbai-HQ | Location settings |
| 7 | Under "Zone", select ABV-Zone-Mumbai | Assign zone |
| 8 | Click Save | Zone assigned |
| 9 | Repeat for all India locations | Per zone mapping table |

> **Reference:** https://help.webex.com/article/7q0b45 (Enable Webex Calling for India)

**Procedure: Register LGW with Webex (on CUBE)**

| Step | Action | Notes |
|------|--------|-------|
| 1 | SSH to LGW device | lgw-mum-01.abhavtech.com |
| 2 | Enter config mode | `configure terminal` |
| 3 | Apply tenant 100 config | See template 6.4.3 |
| 4 | Set credentials from Control Hub | Username/password from trunk |
| 5 | Exit config mode | `end` |
| 6 | Verify registration | `show voice register status` |
| 7 | Expected: "Registered" | Trunk active |
| 8 | In Control Hub: verify trunk status green | Confirm both ends |

> **Reference:** https://help.webex.com/article/jr1i3r (Configure Local Gateway on IOS-XE)

### 6.3.4 Add DIDs to Location (India - Manual)

**Procedure: Add Existing DIDs**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Calling -> Numbers | Number management |
| 2 | Click "Add Numbers" -> "Add Numbers Manually" | Manual entry |
| 3 | Select Location | ABV-Mumbai-HQ |
| 4 | Select Number Type: "DID" | Direct inward dial |
| 5 | Enter numbers (one per line or range) | +91-22-4960-1001 to 1099 |
| 6 | Click "Add" | Numbers added to inventory |
| 7 | Assign to users/features | From number list |

> **Reference:** https://help.webex.com/article/qxb01q (Manage Numbers)

---

