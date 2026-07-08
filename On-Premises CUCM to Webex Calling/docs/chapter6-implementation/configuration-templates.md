# Configuration Templates

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

