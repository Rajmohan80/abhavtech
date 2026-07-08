# Appendix 10F: Remote Access Assessment & Client Migration

> **Document Reference:** ABV-COLLAB-MIG-2026 | Appendix 10F
> **Cross-References:** Chapter 1 (Discovery), Chapter 7 (Migration Execution), Appendix 10E (Identity)
> **Style:** Discovery + Implementation Procedures (Sonnet 4.5)
> **Purpose:** Address remote access infrastructure discovery gap and client migration procedures

---

## Document Purpose

This appendix addresses a critical discovery gap: **How do remote and soft-client users access the current CUCM infrastructure?**

Before migration execution, the following must be validated:
- Expressway deployment status (MRA for remote Jabber users)
- Jabber soft client deployment scope
- VPN-based voice access patterns
- Remote user count and access methods

---

## Table of Contents

**Part 1: Remote Access Infrastructure Discovery**
- 10F.1 Discovery Questionnaire
- 10F.2 Infrastructure Assessment Checklist
- 10F.3 User Access Pattern Analysis

**Part 2: Expressway Assessment (If Present)**
- 10F.4 Expressway Inventory
- 10F.5 Expressway Decommissioning Plan

**Part 3: Jabber to Webex App Migration**
- 10F.6 Jabber Inventory & Feature Assessment
- 10F.7 Webex App Deployment
- 10F.8 Client Migration Procedures
- 10F.9 User Training & Communication

**Part 4: Remote User Coexistence & Cutover**
- 10F.10 Coexistence Scenarios
- 10F.11 Remote User Cutover Procedures

---

## Part 1: Remote Access Infrastructure Discovery

## 10F.1 Discovery Questionnaire

**Complete this questionnaire BEFORE migration planning begins.**

### Section A: Remote User Population

```
+-----------------------------------------------------------------+
|  REMOTE USER ASSESSMENT                                         |
+-----------------------------------------------------------------+
|                                                                 |
|  A1. Total Remote/WFH Users                                     |
|      Documented estimate: 250 WFH users                         |
|      Actual count: _________                                    |
|                                                                 |
|  A2. Soft Client Only Users (no desk phone)                     |
|      Documented estimate: 350+ users                            |
|      Actual count: _________                                    |
|                                                                 |
|  A3. Mobile-Only Users                                          |
|      Count: _________                                           |
|                                                                 |
|  A4. Remote User Distribution by Location                       |
|      Mumbai WFH: _________                                      |
|      Chennai WFH: _________                                     |
|      India Other: _________                                     |
|      EMEA WFH: _________                                        |
|      Americas WFH: _________                                    |
|                                                                 |
|  A5. Remote User Work Pattern                                   |
|      [ ] Full-time WFH (100% remote)                              |
|      [ ] Hybrid (office + remote)                                 |
|      [ ] Field workers (always mobile)                            |
|      [ ] Travel-heavy (executives, sales)                         |
|                                                                 |
+-----------------------------------------------------------------+
```

### Section B: Current Remote Access Method

```
+-----------------------------------------------------------------+
|  REMOTE ACCESS METHOD ASSESSMENT                                |
+-----------------------------------------------------------------+
|                                                                 |
|  B1. How do remote users access CUCM phone services today?      |
|      (Check all that apply)                                     |
|                                                                 |
|      [ ] Cisco Expressway MRA + Jabber                            |
|        +- Users: _________                                      |
|                                                                 |
|      [ ] VPN + Jabber Soft Client                                 |
|        +- Users: _________                                      |
|        +- VPN Solution: _________                               |
|                                                                 |
|      [ ] VPN + IP Phone at Home                                   |
|        +- Users: _________                                      |
|        +- Phone Models: _________                               |
|                                                                 |
|      [ ] Call Forwarding to Mobile                                |
|        +- Users: _________                                      |
|                                                                 |
|      [ ] Single Number Reach (SNR)                                |
|        +- Users: _________                                      |
|                                                                 |
|      [ ] Cisco Mobile Connect                                     |
|        +- Users: _________                                      |
|                                                                 |
|      [ ] Third-Party Soft Client                                  |
|        +- Client Name: _________                                |
|        +- Users: _________                                      |
|                                                                 |
|      [ ] No remote phone access (use personal mobile)             |
|        +- Users: _________                                      |
|                                                                 |
|  B2. Primary remote access method: _________________________    |
|                                                                 |
+-----------------------------------------------------------------+
```

### Section C: Expressway Infrastructure

```
+-----------------------------------------------------------------+
|  EXPRESSWAY INFRASTRUCTURE ASSESSMENT                           |
+-----------------------------------------------------------------+
|                                                                 |
|  C1. Is Cisco Expressway deployed?                              |
|      [ ] Yes (complete this section)                              |
|      [ ] No (skip to Section D)                                   |
|      [ ] Unknown (investigate before proceeding)                  |
|                                                                 |
|  C2. Expressway-C (Core) - Inside Firewall                      |
|      Hostname: _________                                        |
|      IP Address: _________                                      |
|      Version: _________                                         |
|      Cluster Size: [ ] Single  [ ] 2-node  [ ] 4-node                |
|      VM or Appliance: [ ] VM  [ ] CE-series                        |
|                                                                 |
|  C3. Expressway-E (Edge) - DMZ                                  |
|      Hostname: _________                                        |
|      Public IP: _________                                       |
|      Private IP: _________                                      |
|      Version: _________                                         |
|      Cluster Size: [ ] Single  [ ] 2-node  [ ] 4-node                |
|      VM or Appliance: [ ] VM  [ ] CE-series                        |
|                                                                 |
|  C4. Expressway Features Enabled                                |
|      [ ] Mobile & Remote Access (MRA)                             |
|      [ ] B2B Calling (SIP/H.323)                                  |
|      [ ] Webex Hybrid Services Connector                          |
|      [ ] Microsoft Teams Integration                              |
|      [ ] Jabber Guest                                             |
|                                                                 |
|  C5. MRA User Count (if enabled)                                |
|      Registered MRA devices: _________                          |
|      Peak concurrent MRA sessions: _________                    |
|                                                                 |
|  C6. Expressway Integration Points                              |
|      [ ] CUCM (Unified Communications traversal)                  |
|      [ ] Unity Connection (voicemail)                             |
|      [ ] IM & Presence (XMPP federation)                          |
|      [ ] Webex Cloud (hybrid services)                            |
|                                                                 |
+-----------------------------------------------------------------+
```

### Section D: Jabber Soft Client

```
+-----------------------------------------------------------------+
|  JABBER SOFT CLIENT ASSESSMENT                                  |
+-----------------------------------------------------------------+
|                                                                 |
|  D1. Is Cisco Jabber deployed?                                  |
|      [ ] Yes (complete this section)                              |
|      [ ] No (skip to Section E)                                   |
|      [ ] Unknown (investigate before proceeding)                  |
|                                                                 |
|  D2. Jabber Client Inventory                                    |
|                                                                 |
|      Platform              Count       Version                  |
|      ---------------------------------------------              |
|      Windows:              _________   _________                |
|      Mac:                  _________   _________                |
|      iOS (iPhone/iPad):    _________   _________                |
|      Android:              _________   _________                |
|                                                                 |
|      TOTAL JABBER USERS:   _________                            |
|                                                                 |
|  D3. Jabber Features in Use                                     |
|      [ ] Soft Phone (make/receive calls)                          |
|      [ ] Desk Phone Control (CTI)                                 |
|      [ ] Instant Messaging (IM)                                   |
|      [ ] Presence (availability status)                           |
|      [ ] Video Calling                                            |
|      [ ] Voicemail Access                                         |
|      [ ] Directory Search                                         |
|      [ ] Meeting Integration (WebEx/CMR)                          |
|                                                                 |
|  D4. Primary Jabber Use Case                                    |
|      [ ] Phone only (no IM)                                       |
|      [ ] IM/Presence only (no phone)                              |
|      [ ] Full UC (Phone + IM + Presence)                          |
|                                                                 |
|  D5. Jabber Deployment Method                                   |
|      [ ] MSI/PKG via SCCM/Intune                                  |
|      [ ] Manual installation                                      |
|      [ ] MDM for mobile (Intune, JAMF, etc.)                      |
|      [ ] App Store download                                       |
|                                                                 |
|  D6. Jabber Configuration                                       |
|      Service Discovery: [ ] DNS SRV  [ ] Manual  [ ] Config file     |
|      Authentication: [ ] CUCM  [ ] SSO/SAML  [ ] LDAP                |
|      Voicemail: [ ] Visual VM  [ ] Call VM                         |
|                                                                 |
+-----------------------------------------------------------------+
```

### Section E: VPN Infrastructure

```
+-----------------------------------------------------------------+
|  VPN INFRASTRUCTURE ASSESSMENT                                  |
+-----------------------------------------------------------------+
|                                                                 |
|  E1. VPN Solution                                               |
|      [ ] Cisco AnyConnect                                         |
|      [ ] Palo Alto GlobalProtect                                  |
|      [ ] Fortinet FortiClient                                     |
|      [ ] Zscaler Private Access (ZPA)                             |
|      [ ] Other: _________                                         |
|                                                                 |
|  E2. VPN Tunnel Type                                            |
|      [ ] Full tunnel (all traffic via VPN)                        |
|      [ ] Split tunnel (only corporate traffic)                    |
|                                                                 |
|  E3. Voice Traffic over VPN                                     |
|      [ ] Voice/RTP traffic routed through VPN                     |
|      [ ] Voice excluded from VPN (split tunnel)                   |
|      [ ] Unknown                                                  |
|                                                                 |
|  E4. VPN Required for Jabber?                                   |
|      [ ] Yes - Jabber requires VPN (no MRA)                       |
|      [ ] No - Jabber uses MRA (VPN optional)                      |
|      [ ] Hybrid - Some users MRA, some VPN                        |
|                                                                 |
|  E5. VPN Capacity                                               |
|      Concurrent VPN users supported: _________                  |
|      Peak VPN usage: _________                                  |
|                                                                 |
+-----------------------------------------------------------------+
```

### Section F: IM & Presence (If Applicable)

```
+-----------------------------------------------------------------+
|  IM & PRESENCE ASSESSMENT                                       |
+-----------------------------------------------------------------+
|                                                                 |
|  F1. Is Cisco IM & Presence (CUPS) deployed?                    |
|      [ ] Yes (complete this section)                              |
|      [ ] No (skip to summary)                                     |
|                                                                 |
|  F2. IM & Presence Server Details                               |
|      Hostname: _________                                        |
|      Version: _________                                         |
|      Cluster Size: _________                                    |
|                                                                 |
|  F3. Features in Use                                            |
|      [ ] On-premises IM (XMPP)                                    |
|      [ ] Presence (availability)                                  |
|      [ ] Federation (external IM)                                 |
|      [ ] Persistent Chat Rooms                                    |
|      [ ] File Transfer                                            |
|                                                                 |
|  F4. IM User Count                                              |
|      Active IM users: _________                                 |
|      Messages per day (estimate): _________                     |
|                                                                 |
|  F5. IM Migration Requirement                                   |
|      [ ] Users rely heavily on IM (migration critical)            |
|      [ ] Light IM usage (Webex App covers needs)                  |
|      [ ] No IM usage (phone only)                                 |
|                                                                 |
|  F6. Chat History Migration                                     |
|      [ ] Required - users need historical messages                |
|      [ ] Not required - start fresh in Webex                      |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 10F.2 Infrastructure Assessment Checklist

### Pre-Migration Infrastructure Validation

| Item | Status | Owner | Notes |
|------|--------|-------|-------|
| **Remote Access Discovery** | | | |
| [ ] Remote user count validated | | Voice Eng | Actual: ___ |
| [ ] Primary access method identified | | Voice Eng | Method: ___ |
| [ ] Expressway status confirmed | | Voice Eng | Present: Y/N |
| [ ] Jabber deployment scope confirmed | | Voice Eng | Users: ___ |
| [ ] VPN configuration documented | | Network | Type: ___ |
| **Expressway (if present)** | | | |
| [ ] Expressway version documented | | Voice Eng | Ver: ___ |
| [ ] MRA user count captured | | Voice Eng | Count: ___ |
| [ ] Expressway integrations listed | | Voice Eng | |
| [ ] Decommission plan created | | Voice Eng | Date: ___ |
| **Jabber (if present)** | | | |
| [ ] Jabber client versions documented | | Voice Eng | Ver: ___ |
| [ ] Jabber features inventory complete | | Voice Eng | |
| [ ] IM usage assessment complete | | Voice Eng | Heavy/Light/None |
| [ ] Client migration plan created | | Voice Eng | |
| **Training & Communication** | | | |
| [ ] Remote user training scheduled | | Training | Date: ___ |
| [ ] Jabber->Webex comparison guide created | | Training | |
| [ ] User communication sent | | Comms | Date: ___ |

---

## 10F.3 User Access Pattern Analysis

### Access Pattern Matrix

| User Segment | Count | Current Method | Post-Migration | Training Need |
|--------------|-------|----------------|----------------|---------------|
| Office desk phone | ~2,450 | IP Phone on LAN | Webex Desk Phone | Basic |
| WFH with desk phone | ___ | VPN + IP Phone | Webex App (no VPN) | Medium |
| WFH with Jabber (MRA) | ___ | Expressway MRA | Webex App (native) | Medium |
| WFH with Jabber (VPN) | ___ | VPN + Jabber | Webex App (no VPN) | Medium |
| Mobile-only | ___ | Jabber Mobile | Webex App Mobile | Medium |
| Soft client (office) | ___ | Jabber Desktop | Webex App Desktop | Medium |
| Executives (hybrid) | ___ | Jabber + desk phone | Webex App + phone | High |
| Contact Center agents | 175 | Finesse Desktop | WxCC Agent Desktop | High (Phase 2) |

### Remote Access Simplification (Benefit Analysis)

```
+-----------------------------------------------------------------+
|  REMOTE ACCESS: BEFORE vs AFTER MIGRATION                       |
+-----------------------------------------------------------------+
|                                                                 |
|  BEFORE (CUCM + Expressway/VPN + Jabber):                      |
|  =======================================                        |
|                                                                 |
|  Remote User                                                    |
|       |                                                         |
|       v                                                         |
|  +-------------+     +-------------+     +-------------+       |
|  |   Jabber    |---->| Expressway  |---->|    CUCM     |       |
|  |   Client    |     |  (or VPN)   |     |   Cluster   |       |
|  +-------------+     +-------------+     +-------------+       |
|                            |                    |               |
|                      Firewall/NAT          On-Premises          |
|                       Traversal            Infrastructure       |
|                                                                 |
|  Complexity: HIGH                                               |
|  - Requires Expressway OR VPN                                   |
|  - Firewall rules for MRA traversal                             |
|  - Certificate management                                       |
|  - On-premises infrastructure dependency                        |
|                                                                 |
|  ============================================================   |
|                                                                 |
|  AFTER (Webex Calling):                                        |
|  ======================                                         |
|                                                                 |
|  Remote User                                                    |
|       |                                                         |
|       v                                                         |
|  +-------------+     +-------------------------------------+   |
|  |  Webex App  |---->|         Webex Cloud                 |   |
|  |  (Desktop/  |     |   (TLS over internet - port 443)    |   |
|  |   Mobile)   |     +-------------------------------------+   |
|  +-------------+                                                |
|                                                                 |
|  Complexity: LOW                                                |
|  - No VPN required for voice                                    |
|  - No Expressway required                                       |
|  - Standard HTTPS (port 443)                                    |
|  - Works from anywhere with internet                            |
|  - Cloud-native, no on-premises dependency                      |
|                                                                 |
|  RESULT: Simpler architecture, better user experience           |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## Part 2: Expressway Assessment (If Present)

## 10F.4 Expressway Inventory

**Complete only if Expressway is deployed.**

### Expressway-C (Core) Details

| Attribute | Value |
|-----------|-------|
| Hostname | |
| FQDN | |
| IP Address | |
| Software Version | |
| Hardware/VM | |
| Cluster Peer(s) | |
| CUCM Integration | |
| IM&P Integration | |
| Unity Integration | |

### Expressway-E (Edge) Details

| Attribute | Value |
|-----------|-------|
| Hostname | |
| FQDN (External) | |
| Public IP Address | |
| Private IP Address | |
| Software Version | |
| Hardware/VM | |
| Cluster Peer(s) | |
| DNS SRV Records | |
| Certificates | |

### MRA Statistics (from Expressway)

```
To gather MRA statistics:

1. Login to Expressway-C admin interface
2. Navigate to Status > Unified Communications

   MRA Status:
   -----------------------------------------
   MRA Status:           [Enabled/Disabled]
   CUCM Registration:    [Active/Inactive]
   IM&P Registration:    [Active/Inactive]
   
   Current Sessions:
   -----------------------------------------
   Active MRA sessions:  _______
   Jabber registrations: _______
   Peak sessions (today): _______
   Peak sessions (month): _______

3. Navigate to Status > Registrations > By Device

   Export registration list for Jabber devices
   Filter by: Client = "Cisco Jabber"
```

---

## 10F.5 Expressway Decommissioning Plan

### Decommissioning Timeline

| Phase | Activity | Timeline | Dependencies |
|-------|----------|----------|--------------|
| 1 | Complete Webex App deployment | Week 1-2 | All users have Webex App |
| 2 | Migrate MRA users to Webex | Week 3-4 | Webex Calling active |
| 3 | Disable MRA on Expressway | Week 5 | Zero MRA registrations |
| 4 | Monitor for stray connections | Week 5-6 | Logs clear |
| 5 | Decommission Expressway-E | Week 7 | No external dependencies |
| 6 | Decommission Expressway-C | Week 8 | CUCM decommissioned |

### Pre-Decommission Checklist

| Task | Status | Date |
|------|--------|------|
| [ ] Confirm zero MRA sessions for 7+ days | | |
| [ ] Verify all Jabber users on Webex App | | |
| [ ] Check for B2B calling dependencies | | |
| [ ] Check for Webex Hybrid Services connectors | | |
| [ ] Document firewall rules to remove | | |
| [ ] Document DNS records to remove | | |
| [ ] Notify network team of decommission date | | |
| [ ] Backup Expressway configuration | | |
| [ ] Schedule maintenance window | | |

### Firewall Rules to Remove (Post-Decom)

| Rule | Source | Destination | Ports | Action |
|------|--------|-------------|-------|--------|
| MRA Inbound | Internet | Expressway-E | 443, 5061 | Remove |
| MRA Traversal | Expressway-E | Expressway-C | 7400, 2222 | Remove |
| CUCM from Exp | Expressway-C | CUCM | 5060-5061, 8443 | Remove |
| IM&P from Exp | Expressway-C | IM&P | 5222, 7400 | Remove |

### DNS Records to Remove (Post-Decom)

| Record Type | Name | Value | Action |
|-------------|------|-------|--------|
| A | exp-e.abhavtech.com | [Public IP] | Remove |
| SRV | _collab-edge._tls.abhavtech.com | exp-e.abhavtech.com | Remove |
| SRV | _cisco-uds._tcp.abhavtech.com | [CUCM] | Remove |

---

## Part 3: Jabber to Webex App Migration

## 10F.6 Jabber Inventory & Feature Assessment

### Jabber Feature Mapping to Webex App

| Jabber Feature | Webex App Equivalent | Migration Notes |
|----------------|---------------------|-----------------|
| Soft Phone (calls) | [OK] Webex Calling | Native support |
| Desk Phone Control | [OK] Webex Desk Phone Control | Configure in Webex App |
| Instant Messaging | [OK] Webex Messaging | Direct messages, spaces |
| Presence | [OK] Webex Presence | Automatic with Webex App |
| Video Calling | [OK] Webex Meetings/Calling | HD video included |
| Visual Voicemail | [OK] Webex Voicemail | Transcription available |
| Directory Search | [OK] Webex Directory | Cloud directory + AD sync |
| Contact Photos | [OK] Azure AD Photos | Sync via Directory Connector |
| Meeting Join | [OK] Webex Meetings | Native integration |
| Screen Sharing | [OK] Webex Share | In calls and meetings |
| File Transfer | [OK] Webex Spaces | Enhanced file sharing |
| Persistent Chat | [OK] Webex Spaces | Replaces MUC rooms |
| Federation (IM) | [!]️ Limited | Webex Connect for external |

### Feature Parity Assessment

```
+-----------------------------------------------------------------+
|  JABBER vs WEBEX APP FEATURE COMPARISON                         |
+-----------------------------------------------------------------+
|                                                                 |
|  JABBER FEATURE              WEBEX APP         STATUS           |
|  ===========================================================    |
|                                                                 |
|  CALLING                                                        |
|  --------                                                       |
|  Make/receive calls          OK Webex Calling    [OK] BETTER       |
|  Hold/resume                 OK Same             [OK] SAME         |
|  Transfer (blind/consult)    OK Same             [OK] SAME         |
|  Conference                  OK Enhanced         [OK] BETTER       |
|  Call history                OK Cloud-synced     [OK] BETTER       |
|  Voicemail                   OK Transcription    [OK] BETTER       |
|  Call recording              OK Cloud recording  [OK] BETTER       |
|                                                                 |
|  MESSAGING                                                      |
|  ---------                                                      |
|  1:1 IM                      OK Direct messages  [OK] SAME         |
|  Group IM                    OK Spaces           [OK] BETTER       |
|  Persistent chat rooms       OK Spaces           [OK] BETTER       |
|  File sharing                OK In spaces        [OK] BETTER       |
|  Message search              OK Full-text search [OK] BETTER       |
|  Message reactions           OK Emoji reactions  [OK] BETTER       |
|  Threaded replies            OK Thread support   [OK] BETTER       |
|                                                                 |
|  PRESENCE                                                       |
|  --------                                                       |
|  Availability status         OK Same             [OK] SAME         |
|  Custom status               OK Enhanced         [OK] BETTER       |
|  Calendar integration        OK M365/Google      [OK] BETTER       |
|  Do Not Disturb              OK Focus mode       [OK] BETTER       |
|                                                                 |
|  MEETINGS                                                       |
|  --------                                                       |
|  Join meetings               OK Native Webex     [OK] BETTER       |
|  Schedule meetings           OK Built-in         [OK] BETTER       |
|  Screen sharing              OK Enhanced         [OK] BETTER       |
|  Recording                   OK Cloud recording  [OK] BETTER       |
|  Whiteboard                  OK Built-in         [OK] NEW          |
|                                                                 |
|  OVERALL ASSESSMENT: Webex App provides feature parity          |
|  or improvement in all areas. No functionality loss expected.   |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 10F.7 Webex App Deployment

### Deployment Methods

| Method | Best For | Prerequisites |
|--------|----------|---------------|
| **SCCM/Intune (MSI)** | Managed Windows PCs | Admin rights, deployment tool |
| **JAMF (PKG)** | Managed Macs | JAMF Pro configured |
| **MDM Push** | Managed mobile devices | Intune/JAMF/WS1 |
| **User Self-Install** | BYOD, unmanaged | App Store access |
| **Auto-Download** | All users | Email with download link |

### Windows Deployment via Intune

```
Step 1: Download Webex App MSI
-----------------------------------------------------
1. Navigate to: https://www.webex.com/downloads.html
2. Download: Webex App (MSI installer)
3. File: Webex.msi (~150 MB)

Step 2: Create Intune Win32 App
-----------------------------------------------------
1. Login to Intune Admin Center
   URL: https://intune.microsoft.com

2. Navigate: Apps > Windows > Add

3. App type: Windows app (Win32)

4. App information:
   Name: Cisco Webex App
   Description: Unified communications client
   Publisher: Cisco Systems
   
5. Program:
   Install command: msiexec /i "Webex.msi" /qn ALLUSERS=1
   Uninstall command: msiexec /x "Webex.msi" /qn
   Install behavior: System
   
6. Requirements:
   OS architecture: 64-bit
   Minimum OS: Windows 10 1903
   
7. Detection rules:
   Rule type: MSI
   MSI product code: [Auto-detected]
   
8. Assignments:
   Required: All Devices (or specific groups)
   
9. Review + Create

Step 3: Monitor Deployment
-----------------------------------------------------
1. Navigate: Apps > Monitor > App install status
2. Filter by: Cisco Webex App
3. Track: Installed / Failed / Pending
```

### Mac Deployment via JAMF

```
Step 1: Download Webex App PKG
-----------------------------------------------------
1. Navigate to: https://www.webex.com/downloads.html
2. Download: Webex App (Mac installer)
3. File: Webex.pkg

Step 2: Upload to JAMF
-----------------------------------------------------
1. Login to JAMF Pro
2. Navigate: Computers > Management Settings > Packages
3. Click: New
4. Upload: Webex.pkg
5. Category: Communication

Step 3: Create Policy
-----------------------------------------------------
1. Navigate: Computers > Policies
2. Click: New
3. General:
   Display Name: Deploy Webex App
   Trigger: Recurring Check-in
   Frequency: Once per computer
4. Packages:
   Add: Webex.pkg
   Action: Install
5. Scope:
   Targets: All Managed Clients (or group)
6. Save
```

### Mobile Deployment via MDM

```
iOS Deployment (Intune/JAMF):
-----------------------------------------------------
1. Add app from App Store
   App Name: Webex
   Bundle ID: com.cisco.webex.meetings

2. App configuration (optional):
   Key: orgIdentifier
   Value: [Webex Org ID]

3. Assign to user groups

Android Deployment (Intune):
-----------------------------------------------------
1. Add app from Managed Google Play
   App: Webex
   Package: com.cisco.webex.meetings

2. App configuration:
   Key: orgIdentifier
   Value: [Webex Org ID]

3. Assign to user groups
```

---

## 10F.8 Client Migration Procedures

### Migration Sequence

```
+-----------------------------------------------------------------+
|  JABBER TO WEBEX APP MIGRATION SEQUENCE                         |
+-----------------------------------------------------------------+
|                                                                 |
|  PHASE 1: PREPARATION (Week 1)                                  |
|  ==============================                                 |
|  [ ] Deploy Webex App to all devices (alongside Jabber)           |
|  [ ] Configure SSO for Webex (users can login)                    |
|  [ ] Import users to Webex via Directory Connector                |
|  [ ] Assign Webex Calling licenses                                |
|  [ ] Send pre-migration communication to users                    |
|                                                                 |
|  PHASE 2: PARALLEL OPERATION (Week 2)                           |
|  =====================================                          |
|  [ ] Users have BOTH Jabber and Webex App installed               |
|  [ ] Jabber: Still connected to CUCM (primary)                    |
|  [ ] Webex App: Connected to Webex (for familiarization)          |
|  [ ] Encourage users to explore Webex App features                |
|  [ ] Helpdesk prepared for questions                              |
|                                                                 |
|  PHASE 3: CUTOVER (Migration Weekend)                           |
|  =====================================                          |
|  [ ] Migrate users to Webex Calling (per batch)                   |
|  [ ] Phone numbers move to Webex                                  |
|  [ ] Webex App becomes PRIMARY                                    |
|  [ ] Jabber will no longer work for calls                         |
|  [ ] Users notified to use Webex App only                         |
|                                                                 |
|  PHASE 4: CLEANUP (Week After Cutover)                          |
|  ======================================                         |
|  [ ] Verify all users active on Webex App                         |
|  [ ] Uninstall Jabber from managed devices                        |
|  [ ] Remove Jabber configuration from MDM                         |
|  [ ] Update documentation and training materials                  |
|                                                                 |
+-----------------------------------------------------------------+
```

### Jabber Uninstall Procedure

```
Windows (via Intune/SCCM):
-----------------------------------------------------
Uninstall command:
msiexec /x {Product-Code-GUID} /qn

Or by name:
wmic product where "name like 'Cisco Jabber%%'" call uninstall /nointeractive

SCCM Task Sequence:
1. Add "Uninstall Application" step
2. Select: Cisco Jabber
3. Deploy to: Migrated Users group
4. Schedule: After migration confirmed

Mac (via JAMF):
-----------------------------------------------------
1. Create Policy: Uninstall Jabber
2. Scripts > Add script:

#!/bin/bash
# Remove Jabber application
rm -rf "/Applications/Cisco Jabber.app"

# Remove Jabber preferences
rm -rf ~/Library/Application\ Support/Cisco/Jabber
rm -rf ~/Library/Preferences/com.cisco.Jabber.plist

# Remove Jabber logs
rm -rf ~/Library/Logs/Jabber

3. Scope: Migrated users
4. Trigger: After migration confirmed
```

---

## 10F.9 User Training & Communication

### Communication Timeline

| Timing | Communication | Audience | Channel |
|--------|---------------|----------|---------|
| T-14 days | Migration announcement | All users | Email + Intranet |
| T-7 days | Webex App install instructions | All users | Email |
| T-3 days | Training session reminder | All users | Email + Calendar |
| T-1 day | Final reminder | Migrating batch | Email + SMS |
| T (cutover) | "Go Live" notification | Migrating batch | Email + Teams |
| T+1 day | Post-migration check-in | Migrating batch | Email |
| T+7 days | Feedback survey | Migrated users | Email |

### Sample Communication: Migration Announcement

```
Subject: Important: Your Phone System is Moving to Webex
-----------------------------------------------------------------

Dear [Name],

We are upgrading our phone system from Cisco Jabber/CUCM to 
Webex Calling on [DATE]. This change will improve your 
communication experience with:

OK Simpler remote access (no VPN required for calls)
OK Better mobile experience
OK Integrated messaging and meetings
OK AI-powered features (transcription, noise cancellation)

WHAT YOU NEED TO DO:
--------------------
1. Install Webex App (if not already installed)
   -> Download: https://www.webex.com/downloads.html
   -> Or check your managed apps in Company Portal

2. Sign in with your work email
   -> Use your normal SSO login (same as email)

3. Attend a training session
   -> [Link to training calendar]

4. On migration day, start using Webex App for calls

YOUR JABBER CLIENT WILL STOP WORKING on [DATE].
Please ensure you have Webex App installed before then.

QUESTIONS?
----------
* IT Help Desk: x1000 or helpdesk@abhavtech.com
* Quick Start Guide: [Link]
* Training Videos: [Link]

Thank you for your cooperation.

IT Communications Team
```

### Quick Reference Card for Users

```
+-----------------------------------------------------------------+
|        WEBEX APP QUICK REFERENCE - FORMER JABBER USERS          |
+-----------------------------------------------------------------+
|                                                                 |
|  MAKING CALLS                                                   |
|  ------------                                                   |
|  Jabber:    Click phone icon > Dial number                      |
|  Webex:     Click "Calls" > Dial pad OR search name             |
|                                                                 |
|  ANSWERING CALLS                                                |
|  ---------------                                                |
|  Jabber:    Click green "Answer" button                         |
|  Webex:     Click green "Answer" button (same!)                 |
|                                                                 |
|  TRANSFERRING CALLS                                             |
|  ------------------                                             |
|  Jabber:    More > Transfer > Enter number                      |
|  Webex:     *** (More) > Transfer > Enter number                |
|                                                                 |
|  CHECKING VOICEMAIL                                             |
|  ------------------                                             |
|  Jabber:    Voice Messages tab                                  |
|  Webex:     Calls > Voicemail (with transcription!)             |
|                                                                 |
|  INSTANT MESSAGING                                              |
|  -----------------                                              |
|  Jabber:    Contacts > Double-click name > Type message         |
|  Webex:     Messaging > Search name > Type message              |
|             (Messages sync across all your devices!)            |
|                                                                 |
|  PRESENCE / STATUS                                              |
|  -----------------                                              |
|  Jabber:    Click status dropdown > Select status               |
|  Webex:     Click profile picture > Select status               |
|                                                                 |
|  DIRECTORY SEARCH                                               |
|  ----------------                                               |
|  Jabber:    Contacts > Search                                   |
|  Webex:     Search bar (top) > Type name or number              |
|                                                                 |
|  NEW IN WEBEX (NOT IN JABBER)                                   |
|  ----------------------------                                   |
|  * AI noise removal (automatic)                                 |
|  * Voicemail transcription                                      |
|  * Message reactions and threads                                |
|  * Built-in whiteboard                                          |
|  * No VPN needed for calls!                                     |
|                                                                 |
|  NEED HELP?                                                     |
|  ----------                                                     |
|  IT Help Desk: x1000 | helpdesk@abhavtech.com                  |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## Part 4: Remote User Coexistence & Cutover

## 10F.10 Coexistence Scenarios

### Scenario Matrix: Remote Users During Migration

| User State | Current Client | Access Method | Coexistence Behavior |
|------------|---------------|---------------|---------------------|
| Pre-migration (CUCM) | Jabber | MRA or VPN | Normal Jabber operation |
| Pre-migration (CUCM) | Jabber | MRA or VPN | Can install Webex App (parallel) |
| Migrated (Webex) | Webex App | Internet (direct) | Full Webex Calling |
| Migrated (Webex) | Jabber | N/A | **Jabber will NOT work** |

### Cross-Platform Calling During Coexistence

```
+-----------------------------------------------------------------+
|  CROSS-PLATFORM CALLING: COEXISTENCE PERIOD                     |
+-----------------------------------------------------------------+
|                                                                 |
|  SCENARIO 1: Webex User calls CUCM User                         |
|  =======================================                        |
|                                                                 |
|  [Webex App] --> [Webex Cloud] --> [CUBE] --> [CUCM] --> [Jabber]
|                                                                 |
|  OK Works correctly                                              |
|  OK Audio/video supported                                        |
|  OK Transfer/conference supported                                |
|                                                                 |
|  -------------------------------------------------------------  |
|                                                                 |
|  SCENARIO 2: CUCM User (Jabber) calls Webex User                |
|  ===============================================                |
|                                                                 |
|  [Jabber] --> [CUCM] --> [CUBE] --> [Webex Cloud] --> [Webex App]
|                                                                 |
|  OK Works correctly                                              |
|  OK Audio/video supported                                        |
|  OK Transfer/conference supported                                |
|                                                                 |
|  -------------------------------------------------------------  |
|                                                                 |
|  SCENARIO 3: Remote Jabber User (MRA) calls Webex User          |
|  ======================================================         |
|                                                                 |
|  [Jabber/MRA] --> [Expressway] --> [CUCM] --> [CUBE] --> [Webex]
|                                                                 |
|  OK Works correctly                                              |
|  OK Expressway handles traversal for Jabber side                 |
|  OK Webex side is cloud-native (no traversal needed)             |
|                                                                 |
|  -------------------------------------------------------------  |
|                                                                 |
|  SCENARIO 4: Migrated user tries to use Jabber                  |
|  =============================================                  |
|                                                                 |
|  [Jabber] --> [CUCM] --> [X] USER NOT FOUND (deleted from CUCM)  |
|                                                                 |
|  X DOES NOT WORK                                                |
|  X User must use Webex App                                      |
|  X Communication required to prevent confusion                  |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 10F.11 Remote User Cutover Procedures

### Pre-Cutover Checklist (Remote Users)

| Task | Status | Notes |
|------|--------|-------|
| [ ] Webex App installed on all remote user devices | | |
| [ ] Users can login to Webex App (SSO tested) | | |
| [ ] Users have stable internet (bandwidth check) | | |
| [ ] Emergency contact numbers distributed | | |
| [ ] Fallback communication method confirmed | | |
| [ ] Mobile phone numbers on file (SMS backup) | | |

### Cutover Day Procedures for Remote Users

```
REMOTE USER CUTOVER CHECKLIST
=================================================================

TIME: T-1 hour (Before cutover window)
-----------------------------------------------------------------
[ ] Send reminder to remote users: "Cutover starting in 1 hour"
[ ] Confirm remote users are available (not in critical meetings)
[ ] Provide bridge line for questions during cutover
[ ] Ensure helpdesk is staffed

TIME: T (Cutover begins)
-----------------------------------------------------------------
[ ] Migration team executes user cutover (backend)
[ ] Send notification: "Migration in progress - do not use Jabber"
[ ] Users should:
   [ ] Close Jabber completely
   [ ] Open Webex App
   [ ] Sign in (if not already)
   [ ] Wait for phone service to activate (5-10 minutes)

TIME: T+15 minutes (Verification)
-----------------------------------------------------------------
[ ] Migration team confirms users migrated in Control Hub
[ ] Send test call to each remote user:
   [ ] Call user's Webex number
   [ ] Verify Webex App rings
   [ ] Confirm two-way audio
[ ] Have remote users make outbound test call:
   [ ] Dial test number (e.g., x9999 for echo test)
   [ ] Dial external number (mobile verification)

TIME: T+30 minutes (Confirmation)
-----------------------------------------------------------------
[ ] All remote users confirmed working on Webex
[ ] Send confirmation: "Migration complete - use Webex App"
[ ] Provide post-migration support contacts

TROUBLESHOOTING DURING CUTOVER
-----------------------------------------------------------------
Issue: Webex App not ringing
-> Check: Is user signed in?
-> Check: Is "Do Not Disturb" off?
-> Check: Are notifications enabled on device?
-> Action: Sign out and sign back in

Issue: No audio on calls
-> Check: Is microphone permitted in browser/app?
-> Check: Is correct audio device selected?
-> Action: Settings > Audio > Test speaker/microphone

Issue: Cannot make outbound calls
-> Check: Is Webex Calling license assigned?
-> Check: Is location configured correctly?
-> Action: Verify in Control Hub user settings

Issue: Jabber still ringing
-> This should NOT happen if user was migrated
-> Check: Was migration completed for this user?
-> Action: Close Jabber, verify migration status
```

### Post-Cutover Validation (Remote Users)

```
REMOTE USER VALIDATION CHECKLIST
=================================================================

For each remote user, validate:

CALLING
[ ] Inbound calls ring on Webex App
[ ] Outbound calls connect (internal)
[ ] Outbound calls connect (PSTN)
[ ] Audio quality acceptable (no echo, delay)
[ ] Caller ID displays correctly

MESSAGING (if previously using Jabber IM)
[ ] Can send/receive messages in Webex
[ ] Directory search works
[ ] Presence status updates

VOICEMAIL
[ ] Voicemail box accessible
[ ] New voicemail PIN set
[ ] Voicemail notifications received

MOBILE (if applicable)
[ ] Webex App on mobile receiving calls
[ ] Can make calls from mobile app
[ ] Push notifications working

Sign-off:
-----------------------------------------------------------------
User Name: _______________________
Migration Date: _______________________
Validated By: _______________________
All Tests Passed: [ ] Yes  [ ] No (document issues)
```

---

## Summary Checklist: Remote Access & Client Migration

### Discovery Phase

| Task | Owner | Status |
|------|-------|--------|
| [ ] Complete Remote Access Questionnaire (10F.1) | Voice Eng | |
| [ ] Determine Expressway presence (yes/no) | Voice Eng | |
| [ ] Determine Jabber deployment scope | Voice Eng | |
| [ ] Document remote user count by access method | Voice Eng | |
| [ ] Assess VPN dependency for voice | Network | |

### Planning Phase

| Task | Owner | Status |
|------|-------|--------|
| [ ] Create Expressway decom plan (if applicable) | Voice Eng | |
| [ ] Create Jabber migration plan (if applicable) | Voice Eng | |
| [ ] Plan Webex App deployment method | IT/Desktop | |
| [ ] Develop user training materials | Training | |
| [ ] Draft user communications | Comms | |

### Execution Phase

| Task | Owner | Status |
|------|-------|--------|
| [ ] Deploy Webex App to all devices | IT/Desktop | |
| [ ] Conduct user training sessions | Training | |
| [ ] Execute user migration (per batch) | Voice Eng | |
| [ ] Validate remote users post-cutover | Voice Eng | |
| [ ] Uninstall Jabber (post-migration) | IT/Desktop | |
| [ ] Decommission Expressway (if applicable) | Voice Eng | |

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 1 | Discovery (add remote access section) |
| Chapter 7 | Migration Execution |
| Appendix 10E | Identity & SSO Configuration |
| Cisco Documentation | https://help.webex.com/article/n5p6q6s (Webex App Deployment) |
| Cisco Documentation | https://www.cisco.com/c/en/us/td/docs/voice_ip_comm/jabber/Windows/14_0/JABW_BK_D657A30D_00_deployment-installation-guide-cisco-jabber.html |

---

*End of Appendix 10F: Remote Access Assessment & Client Migration*
