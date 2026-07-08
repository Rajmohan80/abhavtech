# Chapter 6: Implementation & Deployment 

> **Document Reference:** ABV-COLLAB-MIG-2026 | Chapter 6
> **Cross-References:** Chapter 2 (Design), Chapter 5 (Network), Chapter 7 (Migration)
> **Style:** Implementation-focused (Sonnet 4.5)

---

## 6.1 Deployment Strategy Overview

### 6.1.1 Deployment Phases

| Phase | Scope | Duration | Sites |
|-------|-------|----------|-------|
| **Phase 0** | Infrastructure Setup | Week 1-2 | All |
| **Phase 1** | Pilot Deployment | Week 3-4 | Mumbai (50 users) |
| **Phase 2** | India Rollout | Week 5-10 | All India sites |
| **Phase 3** | EMEA Rollout | Week 11-13 | London, Frankfurt |
| **Phase 4** | Americas Rollout | Week 14-16 | New Jersey, Dallas |
| **Phase 5** | Cleanup & Decommission | Week 17-20 | All |

### 6.1.2 Deployment Sequence

```
+-----------------------------------------------------------------+
|  DEPLOYMENT SEQUENCE - ABHAVTECH                                 |
+-----------------------------------------------------------------+
|                                                                 |
|  PHASE 0: INFRASTRUCTURE                                       |
|  +-----+ +-----+ +-----+ +-----+ +-----+                      |
|  |Webex|->|Ctrl |->|PSTN |->|LGW  |->|Mail |                      |
|  |Org  | |Hub  | |Order| |Build| |Notif|                      |
|  +-----+ +-----+ +-----+ +-----+ +-----+                      |
|                                                                 |
|  PHASE 1-4: SITE ROLLOUT (per site)                            |
|  +-----+ +-----+ +-----+ +-----+ +-----+ +-----+             |
|  |Loc  |->|Users|->|Phone|->|Test |->|Train|->|Go   |             |
|  |Setup| |Prov | |Prov | |Valid| |     | |Live |             |
|  +-----+ +-----+ +-----+ +-----+ +-----+ +-----+             |
|                                                                 |
+-----------------------------------------------------------------+
```

### 6.1.3 Roles & Responsibilities

| Role | Responsibility | Team |
|------|---------------|------|
| Project Manager | Overall coordination, schedule | PMO |
| Webex Admin | Control Hub configuration | Voice Engineering |
| Network Engineer | LGW, firewall, QoS | Network Team |
| Telecom Lead | PSTN orders, number porting | Telecom |
| Site IT | Local phone deployment | Regional IT |
| Training Lead | User training coordination | Training Team |
| Help Desk | L1 support, escalation | Service Desk |

---

## 6.2 Pre-Deployment Checklist

### 6.2.1 Control Hub Initial Setup Procedures

**Procedure 1: Verify Organization & Licenses**

| Step | Action | Verification |
|------|--------|--------------|
| 1 | Login to https://admin.webex.com with admin credentials | Dashboard loads |
| 2 | Navigate to Account -> Subscriptions | View license summary |
| 3 | Verify "Webex Calling - Professional" shows 3,200 licenses | Count matches order |
| 4 | Verify calling regions available: APAC, UK, EU, US | Regions listed |
| 5 | Navigate to Account -> Organization Settings | Review org name |
| 6 | Confirm Organization ID (needed for SSO setup) | Copy and save |

> **Reference:** https://help.webex.com/article/n4zf22y (Control Hub Overview)

**Procedure 2: Configure Administrator Accounts**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Users -> Manage Users -> Add User | Manual add |
| 2 | Enter admin email address | Use @abhavtech.com |
| 3 | Assign "Full Administrator" role | For IT Leadership (3) |
| 4 | Assign "User and Device Administrator" for regional admins | For Regional IT (6) |
| 5 | Assign "Compliance Officer" for legal team | Read + audit access |
| 6 | Click Add and send invite | User receives email |

> **Reference:** https://help.webex.com/article/fs78p5 (Admin Roles)

**Procedure 3: Configure SSO (SAML)**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Management -> Organization Settings -> Authentication | SSO section |
| 2 | Click "Integrate a 3rd-party identity provider" | Start wizard |
| 3 | Download Webex SP metadata file | Save for Azure AD |
| 4 | In Azure AD: Create Enterprise App "Cisco Webex" | Use gallery app |
| 5 | In Azure AD: Upload Webex SP metadata | Auto-configures URLs |
| 6 | In Azure AD: Download Federation Metadata XML | IdP metadata |
| 7 | In Control Hub: Upload Azure AD metadata file | Complete federation |
| 8 | Test SSO with a pilot user | Verify redirect works |
| 9 | Enable SSO for organization | Activate for all users |

> **Reference:** https://help.webex.com/article/lfu88u (SSO Integration)

**Procedure 4: Enable SCIM Provisioning**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Management -> Organization Settings -> Directory Synchronization | SCIM section |
| 2 | Enable "Automatic User Provisioning" | Toggle on |
| 3 | Copy SCIM Endpoint URL | Save for Azure AD |
| 4 | Generate Bearer Token | Copy immediately (shown once) |
| 5 | In Azure AD: Enterprise App -> Cisco Webex -> Provisioning | Configure |
| 6 | Set Provisioning Mode to "Automatic" | Enable auto-sync |
| 7 | Enter SCIM URL and Bearer Token | Test connection |
| 8 | Configure attribute mappings (see 6.5.1) | Map required fields |
| 9 | Set scope: "Sync only assigned users and groups" | Control scope |
| 10 | Start provisioning | Monitor sync status |

> **Reference:** https://help.webex.com/article/1mz3s1 (SCIM Directory Sync)

---

### 6.2.2 Control Hub Setup Checklist

| Task | Owner | Status | Notes |
|------|-------|--------|-------|
| **Organization Setup** ||||
| Webex organization created | Cisco/Partner | [ ] | abhavtech.com |
| Calling licenses assigned | Webex Admin | [ ] | 3,200 Professional |
| Admin accounts created | Webex Admin | [ ] | Per RBAC matrix |
| SSO/SAML configured | Identity Team | [ ] | Azure AD integration |
| SCIM provisioning enabled | Identity Team | [ ] | Auto user sync |
| **Calling Configuration** ||||
| Home region set (APAC) | Webex Admin | [ ] | First location = home |
| Calling regions assigned | Webex Admin | [ ] | APAC, UK, EU, US |
| Dial plan template created | Webex Admin | [ ] | 4-digit extensions |
| Emergency callback number set | Webex Admin | [ ] | Per location |
| **PSTN Setup** ||||
| CCPP provider connected (EMEA/US) | Telecom | [ ] | IntelePeer |
| Local Gateway trunks created (India) | Webex Admin | [ ] | 6 trunks |
| DIDs ordered | Telecom | [ ] | Per Chapter 2 |
| Number porting initiated | Telecom | [ ] | 30-day lead time |

### 6.2.3 Network Readiness Checklist

| Task | Owner | Status | Notes |
|------|-------|--------|-------|
| DNS forwarders configured | Network | [ ] | Per Chapter 5 |
| Firewall rules deployed | Security | [ ] | Per Chapter 5 |
| SSL inspection bypass | Security | [ ] | *.webex.com |
| QoS policies verified | Network | [ ] | EF for voice |
| Bandwidth test passed | Network | [ ] | Webex media test |
| LGW connectivity tested | Network | [ ] | India sites only |

### 6.2.4 India LGW Readiness Checklist

| Site | Hardware | IOS-XE | Webex Cert | PSTN Trunk | Status |
|------|----------|--------|------------|------------|--------|
| Mumbai (Pri) | ISR 4351 | 17.12.1 | [ ] | [ ] | [ ] |
| Mumbai (Sec) | ISR 4351 | 17.12.1 | [ ] | [ ] | [ ] |
| Chennai | ISR 4331 | 17.12.1 | [ ] | [ ] | [ ] |
| Bangalore | ISR 4331 | 17.12.1 | [ ] | [ ] | [ ] |
| Delhi | ISR 4321 | 17.12.1 | [ ] | [ ] | [ ] |
| Noida | ISR 4321 | 17.12.1 | [ ] | [ ] | [ ] |
| Hyderabad | ISR 4331 | 17.12.1 | [ ] | [ ] | [ ] |

---

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

## 6.4 Configuration Templates

### 6.4.1 Control Hub Location Configuration

**Navigation:** Control Hub -> Calling -> Locations -> Add Location

**Mumbai HQ Configuration:**

| Field | Value |
|-------|-------|
| Location Name | ABV-Mumbai-HQ |
| Address | Abhavtech Tower, BKC, Mumbai 400051 |
| Time Zone | (GMT+5:30) India Standard Time |
| Language | English (India) |
| Announcement Language | English, Hindi |
| Calling Region | APAC |
| PSTN Connection | Local Gateway |
| Main Number | +91-22-4960-1000 |
| Emergency Callback | +91-22-4960-1000 |
| Extension Range | 1000-1999 |
| Outbound Caller ID | +91-22-4960-1000 |

**Repeat for each location with site-specific values.**

### 6.4.2 India Zone/Edge Configuration

**Navigation:** Control Hub -> Calling -> Service Settings -> Zones

| Zone Name | Edge | Locations Assigned |
|-----------|------|-------------------|
| ABV-Zone-Mumbai | Edge-Mumbai | Mumbai HQ, Pune |
| ABV-Zone-Chennai | Edge-Chennai | Chennai |
| ABV-Zone-Bangalore | Edge-Bangalore | Bangalore |
| ABV-Zone-Delhi | Edge-Delhi | Delhi |
| ABV-Zone-Noida | Edge-Noida | Noida |
| ABV-Zone-Hyderabad | Edge-Hyderabad | Hyderabad |

### 6.4.3 Local Gateway CUBE Configuration

**Template: LGW-Mumbai-01 (Primary)**

```
!===============================================
! ABHAVTECH LOCAL GATEWAY - MUMBAI PRIMARY
! Device: ISR 4351 | IOS-XE 17.12.1
! Purpose: Webex Calling Local Gateway
!===============================================

hostname LGW-MUM-01
!
ip domain name abhavtech.com
ip name-server 10.1.10.5
!
!--- Crypto PKI for Webex Certificate
crypto pki trustpoint Webex-Root
 enrollment terminal
 revocation-check none
!
crypto pki trustpoint LGW-Identity
 enrollment selfsigned
 subject-name cn=lgw-mum-01.abhavtech.com
 revocation-check none
 rsakeypair LGW-RSA 2048
!
!--- SIP UA Configuration
sip-ua
 transport tcp tls v1.2
 crypto signaling default trustpoint LGW-Identity
 handle-replaces
!
!--- Voice Class Tenants
voice class tenant 100
 description Webex-Calling-Tenant
 registrar dns:lgw.webex.com scheme sips expires 240 refresh-ratio 50
 credentials number +912249600000 username abhavtech-mum realm lgw.webex.com
 authentication username abhavtech-mum password <encrypted>
 sip-server dns:lgw.webex.com
 connection-reuse
 srtp-crypto 1 AES_CM_128_HMAC_SHA1_80
 session transport tcp tls
 url sips
 error-passthru
 bind control source-interface GigabitEthernet0/0/0
 bind media source-interface GigabitEthernet0/0/0
 no remote-party-id
 retry invite 2
 timers connect 120
!
voice class tenant 200
 description PSTN-Tata-Trunk
 session transport tcp
 bind control source-interface GigabitEthernet0/0/1
 bind media source-interface GigabitEthernet0/0/1
!
!--- Dial Peers - Webex Inbound
dial-peer voice 100 voip
 description Inbound-from-Webex
 session protocol sipv2
 incoming uri via Webex-URI
 voice-class codec 1
 voice-class sip tenant 100
 dtmf-relay rtp-nte
 srtp
 no vad
!
!--- Dial Peers - Webex Outbound (to PSTN)
dial-peer voice 200 voip
 description Outbound-to-PSTN
 destination-pattern 91[2-9].........
 session protocol sipv2
 session target ipv4:10.1.60.10
 voice-class codec 1
 voice-class sip tenant 200
 dtmf-relay rtp-nte
 no vad
!
!--- Dial Peers - PSTN Inbound
dial-peer voice 300 voip
 description Inbound-from-PSTN
 session protocol sipv2
 incoming uri from PSTN-Tata
 voice-class codec 1
 voice-class sip tenant 200
 dtmf-relay rtp-nte
 no vad
!
!--- Dial Peers - PSTN to Webex
dial-peer voice 400 voip
 description Outbound-to-Webex
 destination-pattern 1[0-9][0-9][0-9]
 session protocol sipv2
 session target sip-server
 voice-class codec 1
 voice-class sip tenant 100
 dtmf-relay rtp-nte
 srtp
 no vad
!
!--- Voice Class Codec
voice class codec 1
 codec preference 1 g711ulaw
 codec preference 2 g711alaw
 codec preference 3 g729r8
!
!--- URI Patterns
voice class uri Webex-URI sip
 host lgw.webex.com
!
voice class uri PSTN-Tata sip
 host 10.1.60.10
!
!--- Interfaces
interface GigabitEthernet0/0/0
 description Webex-Facing
 ip address 10.1.50.10 255.255.255.0
 no shutdown
!
interface GigabitEthernet0/0/1
 description PSTN-Facing
 ip address 10.1.60.1 255.255.255.0
 no shutdown
!
end
```

### 6.4.4 User Provisioning Template (CSV)

**File:** `webex-user-import-mumbai.csv`

```csv
First Name,Last Name,Email,Phone Number,Extension,Location,License
Rajesh,Kumar,rajesh.kumar@abhavtech.com,+912249600001,1001,ABV-Mumbai-HQ,webex-calling-professional
Priya,Sharma,priya.sharma@abhavtech.com,+912249600002,1002,ABV-Mumbai-HQ,webex-calling-professional
Amit,Patel,amit.patel@abhavtech.com,+912249600003,1003,ABV-Mumbai-HQ,webex-calling-professional
```

**Bulk Import Steps:**

1. Control Hub -> Users -> Manage Users -> CSV Import
2. Upload CSV file
3. Map columns to Webex fields
4. Review and confirm
5. Monitor import status

### 6.4.5 Hunt Group Configuration Template

**Navigation:** Control Hub -> Calling -> Features -> Hunt Group

**IT Support Hunt Group (Mumbai):**

| Field | Value |
|-------|-------|
| Name | IT-Support-Mumbai |
| Location | ABV-Mumbai-HQ |
| Phone Number | +91-22-4960-1100 |
| Extension | 1100 |
| Caller ID | IT Support Mumbai |
| Call Distribution | Circular |
| Ring Pattern | Ring all at once |
| No Answer Timeout | 20 seconds |
| Forward After Timeout | Voicemail |

**Members:**

| Name | Extension | Order |
|------|-----------|-------|
| Help Desk 1 | 1101 | 1 |
| Help Desk 2 | 1102 | 2 |
| Help Desk 3 | 1103 | 3 |
| IT Manager | 1110 | 4 |

### 6.4.6 Auto Attendant Configuration Template

**Navigation:** Control Hub -> Calling -> Features -> Auto Attendant

**Main IVR (Mumbai):**

| Field | Value |
|-------|-------|
| Name | ABV-Mumbai-MainIVR |
| Location | ABV-Mumbai-HQ |
| Phone Number | +91-22-4960-1000 |
| Extension | 1000 |
| Language | English |
| Business Hours | Mon-Fri 9:00-18:00 IST |
| Time Zone | India Standard Time |

**Menu Options:**

| Key | Action | Destination |
|-----|--------|-------------|
| 1 | Transfer | Sales (Ext 1200) |
| 2 | Transfer | Support (Ext 1100) |
| 3 | Transfer | HR (Ext 1300) |
| 0 | Transfer | Operator (Ext 1001) |
| # | Repeat Menu | - |
| Timeout | Transfer | Operator (Ext 1001) |

**Greeting Prompt:**
> "Welcome to Abhavtech. For Sales, press 1. For Support, press 2. For Human Resources, press 3. To speak with an operator, press 0."

### 6.4.7 Call Queue Configuration Template

**Navigation:** Control Hub -> Calling -> Features -> Call Queue

**Sales Queue (Mumbai):**

| Field | Value |
|-------|-------|
| Name | Sales-Queue-Mumbai |
| Location | ABV-Mumbai-HQ |
| Phone Number | +91-22-4960-1200 |
| Extension | 1200 |
| Queue Size | 25 calls |
| Wait Time | 300 seconds max |
| Routing Type | Skill-based |

**Queue Settings:**

| Setting | Value |
|---------|-------|
| Welcome Message | Enabled |
| Music on Hold | Default |
| Comfort Message | Every 30 seconds |
| Estimated Wait | Enabled |
| Overflow Action | Voicemail after 300s |

### 6.4.8 Voicemail Configuration Template

**Navigation:** Control Hub -> Calling -> Service Settings -> Voicemail

**Global Settings:**

| Setting | Value |
|---------|-------|
| Message Storage | Cloud (Regional) |
| Max Message Length | 3 minutes |
| Message Retention | 30 days |
| PIN Length | 6 digits |
| Failed Login Lockout | 5 attempts |
| Transcription | Enabled (English) |
| Email Notification | Enabled |

**User Voicemail Defaults:**

| Setting | Value |
|---------|-------|
| Greeting Type | System default |
| Message Waiting | Visual + Audible |
| Forward to Email | User's primary email |
| Unified Messaging | Enabled |

---

## 6.5 User Provisioning Procedures

### 6.5.1 Single User Provisioning (Manual)

**Procedure: Add Individual User**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Users -> Manage Users | User management |
| 2 | Click "Add Users" -> "Manually Add Users" | Manual entry |
| 3 | Enter First Name, Last Name | Required fields |
| 4 | Enter Email Address | Must match Azure AD UPN |
| 5 | Select Location | ABV-Mumbai-HQ |
| 6 | Under Licenses, enable "Webex Calling - Professional" | Assigns calling |
| 7 | Click "Next" to Calling Settings | Configure calling |
| 8 | Enter Phone Number (DID) | +91-22-4960-1001 |
| 9 | Enter Extension | 1001 |
| 10 | Set Caller ID | Name and number |
| 11 | Click "Save" | User created |
| 12 | User receives welcome email | Auto-notification |

> **Reference:** https://help.webex.com/article/v71ztb (Add Users Manually)

### 6.5.2 Bulk User Provisioning (CSV Import)

**Procedure: Import Users via CSV**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Users -> Manage Users | User management |
| 2 | Click "Add Users" -> "CSV Import" | Bulk import |
| 3 | Download CSV template | Get correct format |
| 4 | Populate CSV with user data | See template 6.4.4 |
| 5 | Required columns: First Name, Last Name, Email | Minimum fields |
| 6 | Optional: Phone Number, Extension, Location | For calling |
| 7 | Upload completed CSV file | System validates |
| 8 | Review validation results | Fix any errors |
| 9 | Click "Submit" | Import starts |
| 10 | Monitor import status | Dashboard shows progress |
| 11 | Review import report | Note any failures |

> **Reference:** https://help.webex.com/article/e2okky (CSV User Import)

### 6.5.3 Assign Calling License to Existing User

**Procedure: Enable Calling for Existing User**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Users -> search for user | Find user |
| 2 | Click user name to open profile | User details |
| 3 | Navigate to Calling section | Calling settings |
| 4 | Click "Edit" | Modify settings |
| 5 | Toggle "Webex Calling" to ON | Enable calling |
| 6 | Select License Type: Professional | Full features |
| 7 | Select Location | User's office |
| 8 | Enter Phone Number and Extension | Assign DID |
| 9 | Configure Voicemail | Enable/disable |
| 10 | Click "Save" | Apply changes |

> **Reference:** https://help.webex.com/article/ndki3zb (Calling User Settings)

---

## 6.6 Phone Deployment Procedures

### 6.6.1 Supported Phone Models

| Model | Deployment Method | Firmware | Notes |
|-------|------------------|----------|-------|
| Cisco 8845 | MAC activation | Webex-managed | Video phone |
| Cisco 8865 | MAC activation | Webex-managed | Video + USB |
| Cisco 7841 | MAC activation | Webex-managed | Basic desk |
| Cisco 6861 | MAC activation | Webex-managed | MPP Wi-Fi |
| Webex Desk Pro | Cloud activation | Webex-managed | Executive |
| Webex App | Download | Auto-update | Soft client |

### 6.6.2 Phone Activation - MAC Address Method

**Procedure: Activate Desk Phone via MAC Address**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Obtain MAC address from phone label | Format: AABBCCDDEEFF |
| 2 | Navigate to Devices -> Add Device | Device management |
| 3 | Select Device Type: "Cisco IP Phone" | MPP phones |
| 4 | Select Phone Model | 8845, 8865, 7841, etc. |
| 5 | Enter MAC Address (12 characters, no colons) | Validates format |
| 6 | Select "Assign to User" or "Workspace" | User = personal phone |
| 7 | Search and select user | Links device to user |
| 8 | Select Location | Must match user location |
| 9 | Click "Save" | Device registered |
| 10 | Connect phone to network | DHCP, VLAN 100 |
| 11 | Phone downloads firmware and config | Auto-provisioning |
| 12 | Phone shows user's line | Ready to use |

> **Reference:** https://help.webex.com/article/gkrapq (Add Phones)

### 6.6.3 Phone Activation - Activation Code Method

**Procedure: Activate Phone via Activation Code**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Devices -> Add Device | Device management |
| 2 | Select "Generate Activation Code" | Code method |
| 3 | Select Device Type | Phone or Room device |
| 4 | Assign to User or Workspace | Select owner |
| 5 | Click "Generate Code" | Creates 16-digit code |
| 6 | Code displayed on screen | Valid for 7 days |
| 7 | Copy code or email to user | Share securely |
| 8 | On phone: Navigate to Settings -> Activation | Phone menu |
| 9 | Enter activation code | Phone validates |
| 10 | Phone provisions automatically | Downloads config |

> **Reference:** https://help.webex.com/article/1n22ybj (Activation Codes)

### 6.6.4 Bulk Phone Deployment (CSV)

**File:** `phone-deployment-mumbai.csv`

```csv
MAC Address,Device Type,Assigned To,Location
AABBCC001001,Cisco 8845,rajesh.kumar@abhavtech.com,ABV-Mumbai-HQ
AABBCC001002,Cisco 8845,priya.sharma@abhavtech.com,ABV-Mumbai-HQ
AABBCC001003,Cisco 7841,amit.patel@abhavtech.com,ABV-Mumbai-HQ
```

---

## 6.7 Integration Configuration

### 6.7.1 Azure AD SSO Configuration

**Azure AD Setup:**

1. Azure Portal -> Enterprise Applications -> New Application
2. Search "Cisco Webex" -> Add
3. Configure SAML:

| Field | Value |
|-------|-------|
| Identifier (Entity ID) | `https://idbroker.webex.com/<org-id>` |
| Reply URL (ACS) | `https://idbroker.webex.com/idb/saml2/sso/<org-id>` |
| Sign-on URL | `https://web.webex.com` |
| NameID Format | Email Address |

**Attribute Mapping:**

| SAML Attribute | Azure AD Attribute |
|----------------|-------------------|
| uid | user.userprincipalname |
| firstName | user.givenname |
| lastName | user.surname |
| email | user.mail |

### 6.7.2 SCIM Provisioning Configuration

**Control Hub Setup:**

1. Control Hub -> Settings -> Provisioning
2. Enable "Automatic User Provisioning"
3. Copy SCIM Endpoint URL and Bearer Token

**Azure AD Setup:**

1. Enterprise Application -> Cisco Webex -> Provisioning
2. Mode: Automatic
3. Enter SCIM URL and Token
4. Test Connection
5. Map attributes
6. Enable provisioning

### 6.7.3 Directory Connector (Alternate)

**For non-Azure environments:**

| Setting | Value |
|---------|-------|
| Connector Host | dc-mum-01.abhavtech.com |
| Sync Scope | OU=Webex-Users,DC=abhavtech,DC=com |
| Sync Interval | 30 minutes |
| Attribute Mapping | UPN -> Email |

---

## 6.8 Deployment Validation

### 6.8.1 Location Validation Checklist

| Test | Method | Expected Result | Pass |
|------|--------|-----------------|------|
| Location visible | Control Hub -> Locations | Location listed | [ ] |
| PSTN connected | Calling -> PSTN | Active/Green | [ ] |
| Zone assigned (India) | Service Settings -> Zones | Correct zone | [ ] |
| Main number works | Dial from PSTN | Reaches AA/user | [ ] |
| Emergency routing | Dial 112/999/911 | Routes correctly | [ ] |

### 6.8.2 User Validation Checklist

| Test | Method | Expected Result | Pass |
|------|--------|-----------------|------|
| User provisioned | Control Hub -> Users | User listed | [ ] |
| License assigned | User -> Calling | Professional license | [ ] |
| Extension correct | User -> Calling | Matches plan | [ ] |
| DID assigned | User -> Numbers | DID visible | [ ] |
| Webex App login | User signs in | App connected | [ ] |
| Internal call | Dial extension | Completes | [ ] |
| External call | Dial PSTN | Completes | [ ] |
| Inbound call | Call DID | Rings user | [ ] |
| Voicemail | No answer | VM records | [ ] |

### 6.8.3 Feature Validation Checklist

| Feature | Test Method | Pass |
|---------|-------------|------|
| Hunt Group | Call HG number, verify distribution | [ ] |
| Auto Attendant | Call AA, test all options | [ ] |
| Call Queue | Call queue, verify hold/agent delivery | [ ] |
| Call Forward | Set forward, verify routing | [ ] |
| Call Park | Park call, retrieve from another phone | [ ] |
| BLF/Speed Dial | Configure, verify status indicators | [ ] |
| Shared Line | Call shared line, verify all devices ring | [ ] |
| Call Recording | Enable, make call, verify recording | [ ] |

---

## 6.9 Deployment Schedule Template

### 6.9.1 Site Deployment Timeline

**Template: 5-Day Site Deployment**

| Day | Activity | Owner | Duration |
|-----|----------|-------|----------|
| **Day 1** | Location configuration | Webex Admin | 2 hours |
| | PSTN/Zone verification | Webex Admin | 1 hour |
| | Network validation | Network Team | 2 hours |
| **Day 2** | User provisioning (batch) | Webex Admin | 4 hours |
| | Phone staging | Site IT | 4 hours |
| **Day 3** | Phone deployment | Site IT | 8 hours |
| | User activation | Site IT | 4 hours |
| **Day 4** | User training | Training Team | 8 hours |
| | Feature configuration | Webex Admin | 4 hours |
| **Day 5** | Validation testing | Voice Eng | 4 hours |
| | Issue remediation | Voice Eng | 4 hours |
| | Go-live sign-off | Project Manager | 1 hour |

### 6.9.2 Master Deployment Schedule

| Week | Site | Users | Milestone |
|------|------|-------|-----------|
| 3-4 | Mumbai Pilot | 50 | Pilot validation |
| 5 | Mumbai HQ | 1,200 | India Phase 1 |
| 6 | Chennai | 450 | India Phase 2 |
| 7 | Bangalore, Delhi | 330 | India Phase 3 |
| 8 | Noida, Pune | 220 | India Phase 4 |
| 9 | Hyderabad | 200 | India Complete |
| 10 | Buffer/Remediation | - | India sign-off |
| 11 | London | 520 | EMEA Phase 1 |
| 12 | Frankfurt | 280 | EMEA Complete |
| 13 | Buffer/Remediation | - | EMEA sign-off |
| 14 | New Jersey | 480 | Americas Phase 1 |
| 15 | Dallas | 270 | Americas Complete |
| 16 | Buffer/Remediation | - | Project sign-off |

---

## Chapter 6 Quick Reference

### Control Hub URLs

| Function | URL |
|----------|-----|
| Admin Portal | https://admin.webex.com |
| User Portal | https://settings.webex.com |
| Status Page | https://status.webex.com |
| Downloads | https://www.webex.com/downloads.html |

### Key Configuration Paths

| Task | Navigation |
|------|------------|
| Add Location | Calling -> Locations -> Add |
| Add User | Users -> Manage Users -> Add |
| Configure Hunt Group | Calling -> Features -> Hunt Group |
| Configure Auto Attendant | Calling -> Features -> Auto Attendant |
| Add LGW Trunk | Calling -> Call Routing -> Trunk |
| Assign Zone | Calling -> Service Settings -> Zones |

### Deployment Contacts

| Role | Contact | Escalation |
|------|---------|------------|
| Webex Admin | webex-admin@abhavtech.com | Voice Engineering Lead |
| Network Team | network-ops@abhavtech.com | Network Manager |
| Telecom | telecom@abhavtech.com | Telecom Lead |
| Help Desk | helpdesk@abhavtech.com | Service Desk Manager |
| Project Manager | collab-pm@abhavtech.com | IT Director |

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 2 | Design specifications (locations, users, features) |
| Chapter 4 | Compliance requirements (zones, recording) |
| Chapter 5 | Network configuration (DNS, firewall, QoS) |
| Chapter 7 | Migration execution procedures |
| Cisco Help | https://help.webex.com/article/32gfts (LGW Config) |
| Control Hub Guide | https://help.webex.com/article/n4zf22y |

---

*End of Chapter 6: Implementation & Deployment*

---
