# Webex Calling Cutover

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

