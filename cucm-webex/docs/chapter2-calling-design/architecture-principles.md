# Chapter 2: Webex Calling Design

> **Document Reference:** ABV-COLLAB-MIG-2026 | Chapter 2
> **FICTIONAL NUMBER DISCLAIMER** -- All telephone numbers, DID ranges, toll-free numbers, and ITN numbers in this document are fictional and used for illustrative purposes only. Ranges used: India `+91-XX-4960-XXXX`, India Toll-Free `1800-266-10XX`, UK Freephone `+44-800-096-XXXX`, Germany Freephone `+49-800-096-XXXX`. Do not dial these numbers.
>
> **Cross-References:** Chapter 1 (Discovery), Chapter 4 (Compliance), Chapter 5 (DNS/Network)
> **Related Projects:** ABV-SDWAN-2024 (SD-WAN), ABV-DNAC-2024 (DNA Center)

---

## 2.1 Webex Calling Architecture Overview

### 2.1.1 Multi-Tenant Platform Selection

Abhavtech.com will deploy **Webex Calling Multi-Tenant (MT)** platform, the standard cloud calling solution for enterprise deployments.

```
   WEBEX CALLING PLATFORM COMPARISON
   WEBEX CALLING MT   DEDICATED INSTANCE
   (Multi-Tenant)   (Single-Tenant)
   Cloud-native   Isolated instance
   Shared infrastructure   Dedicated resources
   Automatic updates   Custom configuration
   Regional data centers   SLA guarantees
   Standard features   Large enterprise
   Best for: 100-50K users   Best for: 50K+ users
   ABHAVTECH SELECTION
   SELECTION RATIONALE:
   4,200 users (within MT scale limits)
   Multi-region deployment (APAC/UK/EU/US)
   Standard feature requirements
   Cloud-native management via Control Hub
   Cost-effective licensing model
```

**Webex Calling MT Scale Limits (per Organization):**

| Component | Maximum | Abhavtech Requirement | Utilization |
|-----------|---------|----------------------|-------------|
| Users & Workspaces | 150,000 | 4,200 | 2.8% |
| Locations | 15,000 | 14 | 0.1% |
| Virtual Lines | 250,000 | 45 | <0.1% |
| Call Queues (per location) | 1,000 | 15 | 1.5% |
| Hunt Groups (per location) | 1,000 | 13 | 1.3% |
| Auto Attendants (per location) | 1,000 | 8 | 0.8% |
| Trunks (per location) | 100 | 6 | 6% |

### 2.1.2 Calling Region Strategy

Webex Calling requires strategic region selection based on regulatory requirements, data residency needs, and geographic proximity to users.

```
   ABHAVTECH CALLING REGION ASSIGNMENT
   WEBEX CONTROL HUB
   (admin.webex.com)

         
   APAC REGION   UK REGION   EU REGION
   Home Region   Separate   Separate
   Post-Brexit   GDPR
   Mumbai HQ   London   Frankfurt
   Chennai
   Bangalore   Users: 520   Users: 280
   Delhi
   Noida
   Pune
   Hyderabad
   US REGION
   Users: 2,400
   (India)   Americas
   New Jersey
   Dallas
   Users: 750
   CRITICAL: Home region (APAC) is set during first location creation
   and CANNOT be changed. All signaling routes to home region.
```

**Calling Region Assignment Matrix:**

| Location | Country | Calling Region | Data Center | Rationale |
|----------|---------|----------------|-------------|-----------|
| Mumbai HQ | India | India | Mumbai + Chennai | Home region, DoT compliance |
| Chennai | India | India | Mumbai + Chennai | DoT toll bypass compliance |
| Bangalore | India | India | Mumbai + Chennai | DoT toll bypass compliance |
| Delhi | India | India | Mumbai + Chennai | DoT toll bypass compliance |
| Noida | India | India | Mumbai + Chennai | DoT toll bypass compliance |
| Pune | India | India | Mumbai + Chennai | DoT toll bypass compliance |
| Hyderabad | India | India | Mumbai + Chennai | DoT toll bypass compliance |
| London | UK | UK | London + Manchester | Post-Brexit separate region |
| Frankfurt | Germany | EU | Frankfurt + Amsterdam | GDPR, BSI C5 compliance |
| New Jersey | USA | US | US Data Centers | Americas operations |
| Dallas | USA | US | US Data Centers | Americas operations |
| Remote/WFH India | India | India | Mumbai + Chennai | ITN numbers for WFH |
| Remote/WFH EMEA | UK/EU | UK/EU | Regional | Follow office location |
| Remote/WFH Americas | USA | US | US | Follow office location |

### 2.1.3 Data Residency by Region

```
   WEBEX CALLING DATA RESIDENCY ARCHITECTURE
   DATA TYPE   STORAGE LOCATION
   *  *  *  *  *  *  *  *  *   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Signaling Data   -   Home Region Data Center (Mumbai + Chennai DCs)
   Call setup/teardown   All control plane signaling
   Presence   User provisioning data
   Configuration   Organization settings
   Media Data   -   Regional Media POPs
   Voice RTP streams   Mumbai + Chennai DCs (India calls)
   Audio packets   London (UK calls)
   Frankfurt (EU calls)
   US POPs (Americas calls)
   CDR/Analytics   -   Regional Processing
   Call detail records   GDPR: EU-processed for EU users
   Quality metrics   UK: UK-processed for UK users
   Usage reports   India: Mumbai DC-processed
   Voicemail   -   Webex Cloud (Regional)
   Message storage   100MB per user standard
   Transcriptions   Regional storage compliance
   COMPLIANCE MAPPING:
   India   Mumbai + Chennai DCs (APAC)   DoT/TRAI compliant
   UK   London/Manchester DC   UK GDPR, Cyber Essentials
   Germany   Frankfurt/Amsterdam DC   EU GDPR, BSI C5, Cloud CoC L3
   Americas   US Data Centers   SOC2, ISO27001
```

### 2.1.4 Media POPs & Edge Locations

Webex Calling optimizes media quality using regional Points of Presence (POPs) for media relay while maintaining signaling through the home region.

```
   WEBEX MEDIA POP ARCHITECTURE - ABHAVTECH
   WEBEX CLOUD CORE
   Mumbai + Chennai DCs (Home)
   User provisioning
   Call signaling
   Configuration

         
   APAC POPs   EMEA POPs   US POPs
   Mumbai + Chennai   London   Ashburn
   Mumbai   Frankfurt   Dallas
   Chennai   Amsterdam   San Jose
   Hong Kong   Manchester   Chicago
         
   India Sites   EMEA Sites   Americas Sites
   Mumbai HQ   London   New Jersey
   Chennai   Frankfurt   Dallas
   Bangalore
   Delhi/Noida
   Pune/Hyderabad
   MEDIA OPTIMIZATION:
   Signaling: Always via Mumbai + Chennai DCs (home region)
   Media: Via nearest regional POP
   ICE negotiation selects optimal media path
   SRTP encryption end-to-end
```

**Expected Latency by Location:**

| Location | Nearest Media POP | Expected Latency | Quality Impact |
|----------|-------------------|------------------|----------------|
| Mumbai | Mumbai DC | 20-40ms | Excellent |
| Chennai | Chennai DC | 25-45ms | Excellent |
| Bangalore | Mumbai + Chennai | 30-50ms | Excellent |
| Delhi/Noida | Mumbai + Chennai | 40-60ms | Good |
| London | London | 10-30ms | Excellent |
| Frankfurt | Frankfurt | 15-35ms | Excellent |
| New Jersey | Ashburn | 10-25ms | Excellent |
| Dallas | Dallas | 10-25ms | Excellent |

---

## 2.2 Location Design

### 2.2.1 Location Hierarchy Overview

```
   ABHAVTECH WEBEX CALLING LOCATION HIERARCHY
   ORGANIZATION
   Abhavtech.com
   Home: APAC

         
   INDIA (APAC)   EMEA   AMERICAS
   7 Locations   2 Locations   2 Locations
   2,400 Users   800 Users   750 Users
                  
   Mumbai   Branch   London   Frank-   New   Dallas
   HQ   Sites   furt   Jersey
   1,200   1,200   520   280   480   270
   Note: Branch Sites include Chennai (450), Bangalore (180), Delhi (150),
   Noida (120), Pune (100), Hyderabad (200). WFH users: 250 separate.
```

### 2.2.2 India Locations Configuration

#### Mumbai HQ (ABV-IN-MUM)

```
   LOCATION: MUMBAI HQ (ABV-IN-MUM)
   GENERAL SETTINGS
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Location Name:   ABV-Mumbai-HQ
   Site Code:   81
   Address:   Bandra Kurla Complex, Mumbai 400051, India
   Timezone:   Asia/Kolkata (GMT+5:30)
   Language:   English (India)
   Announcement Language: en_IN
   USER ALLOCATION
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Total Users:   1,200
   Enterprise Users:   1,080
   Contact Center Agents: 120 (Phase 2 - remain on UCCX until migration)
   Phone Devices:   850
   Soft Client Only:   350
   EXTENSION RANGE
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Extension Length:   4 digits
   Extension Range:   1000-1999
   Steering Digit:   8 (for ESN dialing)
   Outside Access Code: 9
   PSTN CONFIGURATION
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   PSTN Type:   Premises-based (Local Gateway)
   LGW Address:   lgw-mumbai-01.abhavtech.com
   LGW HA Pair:   lgw-mumbai-02.abhavtech.com
   Trunk Type:   Certificate-based registration
   Route Group:   RG-Mumbai-LGW
   INDIA COMPLIANCE
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Zone:   Zone-Mumbai-Circle
   Trusted Network Edge: Mumbai-Edge (103.15.XX.XXX/24)
   Telecom Circle:   Mumbai
   PSTN Provider:   Tata Communications
   DID INVENTORY
   *  *  *  *  *  *  *  *  *  *  *  *  *
   Main Number:   +91-22-4960-0000
   DID Range:   +91-22-4960-0001 to +91-22-4960-1999
   Backup DIDs:   +91-22-4961-0000 to +91-22-4961-0499 (Airtel)
   Toll-Free:   1800-266-1000, 1800-266-1001 (shared)
   Total DIDs:   2,500
   FEATURES
   *  *  *  *  *  *  *  *
   Main Auto Attendant: AA-Mumbai-Main
   Hunt Groups:   4 (Reception, IT, HR, Finance)
   Call Queues:   3 (Support, Sales, General)
   Call Park Extensions: 10 (#7810-#7819)
   Pickup Groups:   8 (department-based)
   EMERGENCY SERVICES
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Emergency Number:   100 (Police), 101 (Fire), 102 (Ambulance)
   Callback Number:   +91-22-4960-0000
   Address Validation:  Manual (E-CNAM not available in India)
```

#### India Branch Sites Summary

| Site Code | Location | Users | Phones | Extension Range | Telecom Circle | Zone | LGW |
|-----------|----------|-------|--------|-----------------|----------------|------|-----|
| 81 | Mumbai HQ | 1,200 | 850 | 1000-2199 | Mumbai | Zone-Mumbai | lgw-mumbai-01/02 |
| 82 | Chennai | 450 | 320 | 2200-2649 | Tamil Nadu | Zone-TamilNadu | lgw-chennai-01/02 |
| 83 | Bangalore | 180 | 120 | 2650-2829 | Karnataka | Zone-Karnataka | lgw-bangalore-01 |
| 84 | Delhi | 150 | 100 | 2830-2979 | Delhi | Zone-Delhi | lgw-delhi-01 |
| 85 | Noida | 120 | 80 | 2980-3099 | UP West | Zone-UPWest | lgw-noida-01 |
| 86 | Pune | 100 | 60 | 3100-3199 | Mumbai* | Zone-Mumbai | lgw-mumbai-01/02 |
| 87 | Hyderabad | 200 | 140 | 3200-3399 | AP/Telangana | Zone-APTelangana | lgw-hyderabad-01 |

*Note: Pune is in Maharashtra circle, shares Zone and LGW with Mumbai*

#### India Location - Network Details

| Location | Site Code | Trusted Edge IP | Internal Subnet | MPLS Circuit | Internet Bandwidth |
|----------|-----------|-----------------|-----------------|--------------|-------------------|
| Mumbai HQ | 81 | 103.15.XX.XXX/24 | 10.1.0.0/16 | 500 Mbps | 1 Gbps DIA (redundant) |
| Chennai | 82 | 103.25.XX.XXX/24 | 10.2.0.0/16 | 200 Mbps | 500 Mbps DIA (redundant) |
| Bangalore | 83 | 103.20.XX.XXX/24 | 10.3.0.0/20 | - | 200 Mbps DIA (+ LTE) |
| Delhi | 84 | 103.30.XX.XXX/24 | 10.4.0.0/20 | - | 200 Mbps DIA (+ LTE) |
| Noida | 85 | 103.35.XX.XXX/24 | 10.5.0.0/20 | - | 100 Mbps DIA (+ LTE) |
| Pune | 86 | 103.15.XX.XXX/24* | 10.6.0.0/20 | 50 Mbps | 100 Mbps DIA |
| Hyderabad | 87 | 103.40.XX.XXX/24 | 10.7.0.0/20 | - | 200 Mbps DIA (+ LTE) |

*Pune shares Mumbai's Trusted Edge through MPLS backhaul*

### 2.2.3 EMEA Locations Configuration

#### London (ABV-UK-LON)

```
   LOCATION: LONDON (ABV-UK-LON)
   GENERAL SETTINGS
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Location Name:   ABV-London
   Site Code:   91
   Address:   Canary Wharf, London E14, United Kingdom
   Timezone:   Europe/London (GMT/BST)
   Language:   English (UK)
   Announcement Language: en_GB
   USER ALLOCATION
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Total Users:   520
   Phone Devices:   380
   Soft Client Only:   140
   EXTENSION RANGE
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Extension Length:   4 digits
   Extension Range:   4000-4519
   Steering Digit:   8 (for ESN dialing)
   Outside Access Code: 9
   PSTN CONFIGURATION
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   PSTN Type:   Cloud Connected PSTN (CCPP)
   CCPP Provider:   IntelePeer UK
   Route Group:   RG-UK-CCPP
   UK COMPLIANCE
   *  *  *  *  *  *  *  *  *  *  *  *  *
   Calling Region:   UK (separate from EU post-Brexit)
   Data Center:   London + Manchester (HA pair)
   Ofcom Registration:  Handled by CCPP provider
   UK GDPR:   Data processed in UK DCs only
   DID INVENTORY
   *  *  *  *  *  *  *  *  *  *  *  *  *
   Main Number:   +44-20-4960-0000
   DID Range:   +44-20-4960-0001 to +44-20-4960-0799
   Toll-Free:   +44-800-096-1000
   Total DIDs:   800
   FEATURES
   *  *  *  *  *  *  *  *
   Main Auto Attendant: AA-London-Main
   Hunt Groups:   2 (Reception, Sales)
   Call Queues:   1 (UK Support)
   Call Park Extensions: 5 (#7910-#7914)
   EMERGENCY SERVICES
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Emergency Number:   999 / 112
   Callback Number:   +44-20-4960-0000
   Address Validation:  Automatic (UK E-CNAM)
   CRITICAL: UK is a SEPARATE Webex Calling region from EU
   London users MUST be assigned to UK region, not EU
```

#### Frankfurt (ABV-EU-FRA)

```
   LOCATION: FRANKFURT (ABV-EU-FRA)
   GENERAL SETTINGS
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Location Name:   ABV-Frankfurt
   Site Code:   92
   Address:   Westend, Frankfurt 60325, Germany
   Timezone:   Europe/Berlin (CET/CEST)
   Language:   German
   Announcement Language: de_DE
   USER ALLOCATION
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Total Users:   280
   Phone Devices:   200
   Soft Client Only:   80
   EXTENSION RANGE
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Extension Length:   4 digits
   Extension Range:   4520-4799
   Steering Digit:   8 (for ESN dialing)
   Outside Access Code: 0 (German standard)
   PSTN CONFIGURATION
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   PSTN Type:   Cloud Connected PSTN (CCPP)
   CCPP Provider:   IntelePeer EU
   Route Group:   RG-EU-CCPP
   GERMANY/EU COMPLIANCE
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Calling Region:   EU
   Data Center:   Frankfurt + Amsterdam (HA pair)
   BSI C5:   Webex certified (17 domains, 114 requirements)
   EU Cloud CoC:   Level 3 compliance
   GDPR:   Full compliance, EU data processing only
   BaFin:   Not applicable (Abhavtech not financial sector)
   DID INVENTORY
   *  *  *  *  *  *  *  *  *  *  *  *  *
   Main Number:   +49-69-4960-0000
   DID Range:   +49-69-4960-0001 to +49-69-4960-0499
   Toll-Free:   +49-800-096-1000 (German)
   Total DIDs:   500
   FEATURES
   *  *  *  *  *  *  *  *
   Main Auto Attendant: AA-Frankfurt-Main (German prompts)
   Hunt Groups:   2 (Reception, Support)
   Call Queues:   1 (EU Support)
   Call Park Extensions: 5 (#7920-#7924)
   EMERGENCY SERVICES
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Emergency Number:   112 (EU standard)
   Callback Number:   +49-69-4960-0000
   Address Validation:  Automatic (German E-CNAM)
```

### 2.2.4 Americas Locations Configuration

| Setting | New Jersey (ABV-US-NJ) | Dallas (ABV-US-DAL) |
|---------|------------------------|---------------------|
| Site Code | 93 | 94 |
| Address | Newark, NJ 07102 | Dallas, TX 75201 |
| Timezone | America/New_York | America/Chicago |
| Users | 480 | 270 |
| Phones | 350 | 180 |
| Extension Range | 5000-5479 | 5480-5749 |
| OAC | 9 | 9 |
| PSTN Type | CCPP | CCPP |
| CCPP Provider | IntelePeer US | IntelePeer US |
| Main Number | +1-201-496-0000 | +1-214-496-0000 |
| DIDs | 800 | 500 |
| Toll-Free | +1-800-096-1000 (shared) | Shared with NJ |
| Emergency | 911 (E911 enabled) | 911 (E911 enabled) |
| Hunt Groups | 2 | 1 |
| Call Queues | 1 | 1 |

### 2.2.5 Remote/WFH Users Configuration

```
   REMOTE/WFH USERS - WEBEX CALLING DESIGN
   TOTAL WFH USERS: 250 (globally distributed)
   Region   Users   PSTN Solution   Rationale
   
   India WFH   150   ITN (9XXXXXXXXX)   Toll bypass exempt
   EMEA WFH   60   Standard (CCPP)   No toll bypass rules
   Americas WFH   40   Standard (CCPP)   No toll bypass rules
   INDIA WFH USERS (ITN Solution)
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Why ITN for India WFH?
   DoT regulations require PSTN calls to egress from user's telecom circle
   WFH users may work from ANY location in India
   Traditional Zone/Edge enforcement would BLOCK their PSTN calls
   ITN (Internet Telephony Numbers) are EXEMPT from toll bypass rules
   ITN Configuration:
   Number Format:   9XXXXXXXXX (10-digit, starts with 9)
   Provider:   Tata Communications
   Assignment:   Per-user ITN (no shared numbers)
   Range:   +91-9XXXXXXXXX (150 numbers)
   Restrictions:   Cannot call when outside India
   ITN Assignment Matrix:
   User Location   ITN Range   Notes

   Mumbai WFH   9XX-1000-XX   Primary allocation
   Other India WFH   9XX-1100-XX   Secondary allocation
   EMEA/AMERICAS WFH
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   No special PSTN restrictions
   Assigned to parent office location
   Uses standard CCPP numbers
   Full Webex Calling features
   DEVICE STRATEGY FOR WFH
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Primary:   Webex App (desktop/mobile)
   Secondary: Cisco MPP phone (optional, shipped to home)
   Headset:   Cisco 730 or Jabra Evolve2 (provided)
```

---

## 2.3 PSTN Design

### 2.3.1 Global PSTN Strategy Overview

```
   ABHAVTECH GLOBAL PSTN STRATEGY
   PSTN CONNECTIVITY OPTIONS
   LOCAL GATEWAY   CCPP   ITN (India)
   (Premises PSTN)   (Cloud PSTN)   (Non-Geographic)
   Customer SBC   Provider SBC   Cloud-native
   Existing PSTN   Port numbers   9XXXXXXXXX
   Zone/Edge   No hardware   No Zone/Edge
   (India only)   Zone/Edge   India WFH
   (India only)
         
   INDIA OFFICES   EMEA & AMERICAS   INDIA WFH
   Mumbai   London (CCPP)   150 users
   Chennai   Frankfurt   Toll bypass
   Bangalore   New Jersey   exempt
   Delhi/Noida   Dallas
   Pune/Hyd
   STRATEGIC RATIONALE:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   India (LGW):   Leverage existing Tata/Airtel contracts
   Maintain CUBE investment
   DoT toll bypass compliance via Zone/Edge
   EMEA/Americas (CCPP):   No local compliance restrictions
   Simplified management
   Provider handles regulatory
   India WFH (ITN):   Exempt from toll bypass
   Works from any India location
   Tata Communications provider
```

### 2.3.2 India: Local Gateway Architecture

#### 2.3.2.1 Per-Circle LGW Requirements

```
   INDIA LOCAL GATEWAY ARCHITECTURE
   WEBEX CALLING
   (Mumbai + Chennai DCs)

         
   Zone:   Zone:   Zone:
   Mumbai   Karnataka   Tamil Nadu
   Circle   Circle   Circle
   Trusted Edge:   Trusted Edge:   Trusted Edge:
   103.15.50.x/24   103.20.70.x/24   103.25.60.x/24
   10.1.x.x/16   10.3.x.x/20   10.2.x.x/16
         
   LGW: CUBE   LGW: CUBE   LGW: CUBE
   Mumbai (HA)   Bangalore   Chennai (HA)
   ISR 4451-X   ISR 4331   ISR 4351
   IOS-XE 17.12   IOS-XE 17.12   IOS-XE 17.12
         
   PSTN: Tata   PSTN: Tata   PSTN: Tata
   Mumbai SIP   Bangalore   Chennai SIP
   +91-22-XXXX   +91-80-XXXX   +91-44-XXXX
   Zone:   Zone:   Zone:
   Delhi   UP West   AP/Telangana
   Circle   Circle   Circle
   Trusted Edge:   Trusted Edge:   Trusted Edge:
   103.30.80.x/24   103.35.90.x/24   103.40.100.x
         
   LGW: CUBE   LGW: CUBE   LGW: CUBE
   Delhi   Noida   Hyderabad
   ISR 4331   ISR 4331   ISR 4331
         
   PSTN: Tata   PSTN: Tata   PSTN: Tata
   Delhi SIP   Noida SIP   Hyderabad
   +91-11-XXXX   +91-120-XXX   +91-40-XXXX
   TOLL BYPASS ENFORCEMENT:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Webex checks user IP against Trusted Network Edge definitions
   Routes PSTN calls ONLY through user's assigned Zone LGW
   Roaming users (different zone)   PSTN call BLOCKED
```

**LGW Specifications by Circle:**

| LGW | Platform | IOS-XE | Capacity | HA | PSTN Circuits | Locations Served |
|-----|----------|--------|----------|----|--------------:|------------------|
| lgw-mumbai-01/02 | ISR 4451-X | 17.12.2 | 1000 calls | Yes | 30 SIP channels | Mumbai, Pune |
| lgw-chennai-01/02 | ISR 4351 | 17.12.2 | 500 calls | Yes | 15 SIP channels | Chennai |
| lgw-bangalore-01 | ISR 4331 | 17.12.2 | 350 calls | No | 10 SIP channels | Bangalore |
| lgw-delhi-01 | ISR 4331 | 17.12.2 | 250 calls | No | 8 SIP channels | Delhi |
| lgw-noida-01 | ISR 4331 | 17.12.2 | 200 calls | No | 6 SIP channels | Noida |
| lgw-hyderabad-01 | ISR 4331 | 17.12.2 | 80 calls | No | 3 SIP channels | Hyderabad |

#### 2.3.2.2 Zone & Trusted Network Edge Configuration

**Step-by-Step: Creating Zones in Control Hub**

1. Navigate to **Control Hub** > **Calling** > **Service Settings** > **Zones**
2. Click **Create Zone**
3. Configure zone settings per circle

**Abhavtech Zone Configuration:**

| Zone Name | Telecom Circle | Locations | LGW | Trusted Edge IPs (Public) | Internal Subnets |
|-----------|----------------|-----------|-----|---------------------------|------------------|
| Zone-Mumbai-Circle | Mumbai | Mumbai HQ, Pune | lgw-mumbai-01/02 | 103.15.XX.XXX/24 | 10.1.0.0/16, 10.6.0.0/20 |
| Zone-TamilNadu-Circle | Tamil Nadu | Chennai | lgw-chennai-01/02 | 103.25.XX.XXX/24 | 10.2.0.0/16 |
| Zone-Karnataka-Circle | Karnataka | Bangalore | lgw-bangalore-01 | 103.20.XX.XXX/24 | 10.3.0.0/20 |
| Zone-Delhi-Circle | Delhi | Delhi | lgw-delhi-01 | 103.30.XX.XXX/24 | 10.4.0.0/20 |
| Zone-UPWest-Circle | UP West | Noida | lgw-noida-01 | 103.35.XX.XXX/24 | 10.5.0.0/20 |
| Zone-APTelangana-Circle | AP/Telangana | Hyderabad | lgw-hyderabad-01 | 103.40.XX.XXX/24 | 10.7.0.0/20 |

**Step-by-Step: Adding Trusted Network Edge**

1. Navigate to **Control Hub** > **Calling** > **Service Settings** > **Trusted Network Edge**
2. Click **Add Trusted Edge**
3. Configure IP ranges

```yaml
# Control Hub - Trusted Network Edge Configuration
trusted_network_edges:
  - name: "Mumbai-Edge"
    description: "Mumbai office public IP range"
    ip_addresses:
      - "103.15.XX.XXX/24"
    internal_subnets:
      - "10.1.0.0/16"
      - "10.6.0.0/20"  # Pune backhauls through Mumbai
      
  - name: "Chennai-Edge"
    description: "Chennai office public IP range"
    ip_addresses:
      - "103.25.XX.XXX/24"
    internal_subnets:
      - "10.2.0.0/16"
      
  - name: "Bangalore-Edge"
    description: "Bangalore office public IP range"
    ip_addresses:
      - "103.20.XX.XXX/24"
    internal_subnets:
      - "10.3.0.0/20"
      
  - name: "Delhi-Edge"
    description: "Delhi office public IP range"
    ip_addresses:
      - "103.30.XX.XXX/24"
    internal_subnets:
      - "10.4.0.0/20"
      
  - name: "Noida-Edge"
    description: "Noida office public IP range"
    ip_addresses:
      - "103.35.XX.XXX/24"
    internal_subnets:
      - "10.5.0.0/20"
      
  - name: "Hyderabad-Edge"
    description: "Hyderabad office public IP range"
    ip_addresses:
      - "103.40.XX.XXX/24"
    internal_subnets:
      - "10.7.0.0/20"
```

#### 2.3.2.3 Toll Bypass Enforcement Scenarios

```
   TOLL BYPASS ENFORCEMENT - CALL FLOW SCENARIOS
   SCENARIO 1: COMPLIANT - Mumbai User calling from Mumbai Office
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   1. User at Mumbai HQ dials +91-80-12345678 (Bangalore external number)
   2. Webex detects user source IP: 10.1.50.25
   3. IP matches Trusted Edge: Mumbai-Edge (10.1.0.0/16)
   4. Zone lookup: Zone-Mumbai-Circle
   5. Route Group: RG-Mumbai-LGW
   6. Call routes to lgw-mumbai-01
   7. LGW sends call to Tata SIP trunk (Mumbai)
   8.   CALL COMPLETES - Toll charged at Mumbai egress point
   User   -   Webex   -   Zone   -   Mumbai   -   Tata
   Mumbai   Cloud   Lookup   LGW   Mumbai
   10.1.x.x   Match   PSTN
   SCENARIO 2: BLOCKED - Mumbai User Roaming to Bangalore Office
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   1. Mumbai user visits Bangalore office, uses office WiFi
   2. User dials +91-11-12345678 (Delhi external number)
   3. Webex detects user source IP: 10.3.50.100
   4. IP matches Trusted Edge: Bangalore-Edge (10.3.0.0/20)
   5. User's assigned Zone: Zone-Mumbai-Circle
   6. MISMATCH: User in Bangalore but assigned to Mumbai zone
   7.   PSTN CALL BLOCKED - Toll bypass prevention
   8. User receives "PSTN calling not available" message
   Mumbai   -   Webex   -   Zone   -   CALL
   User   Cloud   Lookup   BLOCKED
   @B'lore   Mismatch
   10.3.x.x
   WORKAROUND OPTIONS:
   Use Webex-to-Webex calling (always works)
   VPN back to Mumbai network
   Mobile cellular (outside Webex)
   SCENARIO 3: WFH USER WITH ITN - Working from Home in Tier-2 City
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   1. WFH user assigned ITN number: +91-9XX-1000-XX
   2. User dials +91-22-12345678 (Mumbai external number)
   3. ITN numbers are EXEMPT from toll bypass rules
   4. No Zone/Edge check required
   5. Call routes directly to Tata cloud
   6.   CALL COMPLETES
   WFH   -   Webex   -   ITN   -   Tata
   User   Cloud   Exempt   Cloud
   Home   Pass   PSTN
```

#### 2.3.2.4 LGW CUBE Configuration Template

```
! ============================================================
! CUBE Local Gateway Configuration Template - Mumbai
! Abhavtech.com - ABV-COLLAB-MIG-2026
! IOS-XE Version: 17.12.2 or later (REQUIRED)
! Platform: ISR 4451-X
! ============================================================

! --- Global SIP Settings ---
voice service voip
 ip address trusted list
  ipv4 52.114.148.0 255.255.252.0    ! Webex Calling signaling
  ipv4 52.114.152.0 255.255.252.0
  ipv4 52.114.156.0 255.255.252.0
 mode border-element
 media disable-detailed-stats
 allow-connections sip to sip
 no supplementary-service sip refer
 stun
  stun flowdata agent-id 1 boot-count 4
  stun flowdata shared-secret 0 <secret>
 sip
  session refresh
  early-offer forced
  asymmetric payload full
  
! --- Codec Class ---
voice class codec 1
 codec preference 1 opus
 codec preference 2 g711ulaw
 codec preference 3 g711alaw
 codec preference 4 g729r8

! --- SIP Profile for Webex ---
voice class sip-profiles 100
 rule 10 request ANY sip-header SIP-Req-URI modify "sips:" "sip:"
 rule 20 request ANY sip-header To modify "<sips:" "<sip:"
 rule 30 request ANY sip-header From modify "<sips:" "<sip:"
 rule 40 request ANY sip-header Contact modify "<sips:" "<sip:"
 rule 50 response ANY sip-header To modify "<sips:" "<sip:"
 rule 60 response ANY sip-header From modify "<sips:" "<sip:"
 rule 70 response ANY sip-header Contact modify "<sips:" "<sip:"

! --- Tenant for Webex Calling ---
voice class tenant 100
 registrar dns:webexapis.com scheme sips expires 3600
 credentials number +91226XXX0000 username <LGW-USERNAME> password 0 <PASSWORD> realm webex.com
 authentication username <LGW-USERNAME> password 0 <PASSWORD> realm webex.com
 sip-server dns:webexapis.com
 srtp-crypto 1 AES_CM_128_HMAC_SHA1_80
 session transport tcp tls
 url sips
 error-passthru
 bind control source-interface GigabitEthernet0/0/0
 bind media source-interface GigabitEthernet0/0/0

! --- Dial Peer to Webex Calling ---
dial-peer voice 100 voip
 description Webex-Calling-Outbound
 preference 1
 destination-pattern .T
 session protocol sipv2
 session target dns:webexapis.com
 session transport tcp tls
 voice-class sip tenant 100
 voice-class sip profiles 100
 voice-class codec 1
 dtmf-relay rtp-nte
 srtp
 no vad

! --- Dial Peer to PSTN (Tata Mumbai) ---
dial-peer voice 200 voip
 description PSTN-Tata-Mumbai-Outbound
 preference 1
 destination-pattern 9[0-9].T
 session protocol sipv2
 session target ipv4:203.130.X.X    ! Tata SIP SBC IP
 voice-class codec 1
 dtmf-relay rtp-nte

! --- Inbound from PSTN ---
dial-peer voice 201 voip
 description PSTN-Tata-Mumbai-Inbound
 incoming called-number .
 session protocol sipv2
 voice-class codec 1
 dtmf-relay rtp-nte

! --- Inbound from Webex ---
dial-peer voice 101 voip
 description Webex-Calling-Inbound
 incoming uri via Webex
 session protocol sipv2
 voice-class sip tenant 100
 voice-class codec 1
 dtmf-relay rtp-nte
 srtp

! --- URI Class ---
voice class uri Webex sip
 host webexapis.com

! --- Certificate Configuration ---
crypto pki trustpoint WEBEX-TRUSTPOINT
 enrollment terminal
 revocation-check none
 
! --- TLS Profile ---
voice class tls-profile 1
 trustpoint WEBEX-TRUSTPOINT
 cipher suites tls13-aes128-gcm-sha256
 cn-san-validate server
 sni send webexapis.com
```

### 2.3.3 EMEA: Cloud Connected PSTN

#### 2.3.3.1 UK CCPP Configuration

| Configuration Item | Value |
|--------------------|-------|
| CCPP Provider | IntelePeer UK |
| Service Type | Cloud Connected PSTN |
| Route Group | RG-UK-CCPP |
| Numbers to Port | +44-20-4960-0001 to +44-20-4960-0799 |
| Main Number | +44-20-4960-0000 |
| Toll-Free | +44-800-096-1000 |
| Emergency | 999 / 112 (auto-configured by CCPP) |
| Zone/Edge Required | NO (UK has no toll bypass regulations) |
| Data Residency | UK Data Centers (London/Manchester) |

**Number Porting Process (UK):**
1. Submit Letter of Authorization (LOA) to IntelePeer
2. IntelePeer coordinates with existing provider (BT)
3. Typical porting window: 10 business days
4. Port validation test conducted 24 hours before cutover
5. Numbers active on Webex Calling after port complete

#### 2.3.3.2 EU CCPP Configuration (Frankfurt)

| Configuration Item | Value |
|--------------------|-------|
| CCPP Provider | IntelePeer EU |
| Service Type | Cloud Connected PSTN |
| Route Group | RG-EU-CCPP |
| Numbers to Port | +49-69-4960-0001 to +49-69-4960-0499 |
| Main Number | +49-69-4960-0000 |
| Toll-Free | +49-800-096-1000 (German) |
| Emergency | 112 (EU standard, auto-configured) |
| Zone/Edge Required | NO |
| Data Residency | EU Data Centers (Frankfurt/Amsterdam) |
| BSI C5 Compliance | Webex certified |
| EU Cloud CoC | Level 3 |

### 2.3.4 Americas: Cloud Connected PSTN

| Configuration Item | New Jersey | Dallas |
|--------------------|------------|--------|
| CCPP Provider | IntelePeer US | IntelePeer US |
| Route Group | RG-US-CCPP | RG-US-CCPP |
| Numbers to Port | +1-201-496-0001 to 0799 (800) | +1-214-496-0001 to 0499 (500) |
| Main Number | +1-201-496-0000 | +1-214-496-0000 |
| Toll-Free | +1-800-096-1000 (shared) | Shared with NJ |
| Emergency | 911 (E911 enabled) | 911 (E911 enabled) |
| E911 Address | Validated per user | Validated per user |

### 2.3.5 DID Number Mapping

!!! info "Working Document -- Not Yet Finalised"
    The DID number mapping table (per-site DID ranges, provider assignments, port/retain decisions, and migration timeline) is maintained as a **separate working document** and will be reintroduced here once the number ranges are confirmed and approved.

    Contact the Abhavtech project lead to obtain the current DID mapping workbook.

## 2.4 Dial Plan Design

### 2.4.1 Extension Numbering

```
   ABHAVTECH EXTENSION NUMBERING PLAN
   EXTENSION FORMAT: 4 Digits
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Site Code   Location   Extension Range   Users Capacity
   
   81   Mumbai HQ   1000-2199   1,200 extensions
   82   Chennai   2200-2649   450 extensions
   83   Bangalore   2650-2829   180 extensions
   84   Delhi   2830-2979   150 extensions
   85   Noida   2980-3099   120 extensions
   86   Pune   3100-3199   100 extensions
   87   Hyderabad   3200-3399   200 extensions
   91   London   4000-4519   520 extensions
   92   Frankfurt   4520-4799   280 extensions
   93   New Jersey   5000-5479   480 extensions
   94   Dallas   5480-5749   270 extensions
   RESERVED RANGES:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   0XXX   - Reserved for future
   6XXX   - Reserved for system features
   7XXX   - Auto Attendants and Call Park
   8XXX   - Hunt Groups and Queues
   9XXX   - Reserved (avoid OAC conflict)
   CONFLICT AVOIDANCE:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   First digit of extensions (1-5)   Steering digit (8)   OAC (9)
   No extension starts with 8 or 9
```

### 2.4.2 ESN (Enterprise Significant Number) Format

```
   ESN DIAL PLAN - INTER-SITE DIALING
   ESN FORMAT:   8 - XX - XXXX
   Extension (4 digits)
   Site Code (2 digits)
   Steering Digit
   EXAMPLES:
   *  *  *  *  *  *  *  *  *
   Mumbai user calling Chennai extension 2100:
   Dial: 8-82-2100   Routes to Chennai ext 2100
   London user calling Mumbai extension 1500:
   Dial: 8-81-1500   Routes to Mumbai ext 1500
   Dallas user calling Frankfurt extension 4600:
   Dial: 8-92-4600   Routes to Frankfurt ext 4600
   ESN ROUTING TABLE:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   ESN Prefix   Location   Route

   881XXXX   Mumbai HQ   ABV-Mumbai-HQ
   882XXXX   Chennai   ABV-Chennai
   883XXXX   Bangalore   ABV-Bangalore
   884XXXX   Delhi   ABV-Delhi
   885XXXX   Noida   ABV-Noida
   886XXXX   Pune   ABV-Pune
   887XXXX   Hyderabad   ABV-Hyderabad
   891XXXX   London   ABV-London
   892XXXX   Frankfurt   ABV-Frankfurt
   893XXXX   New Jersey   ABV-NewJersey
   894XXXX   Dallas   ABV-Dallas
   CONFIGURATION:
   Control Hub   Calling   Dial Plan   Location Routing Prefix
```

### 2.4.3 PSTN Routing by Region

**India PSTN Dial Plan:**

| Pattern | Description | Route |
|---------|-------------|-------|
| 9[2-9]XXXXXXXXX | India local/STD | Zone LGW |
| 9011[1-9]X. | International | Zone LGW |
| 100 | Police | Emergency |
| 101 | Fire | Emergency |
| 102 | Ambulance | Emergency |
| 1800XXXXXXX | Toll-Free | Zone LGW |

**UK PSTN Dial Plan:**

| Pattern | Description | Route |
|---------|-------------|-------|
| 901[0-9]XXXXXXXX | UK geographic | CCPP |
| 90800XXXXXXX | UK toll-free | CCPP |
| 9+[1-9]X. | International | CCPP |
| 999 | Emergency | Emergency |
| 112 | EU Emergency | Emergency |

**Germany PSTN Dial Plan:**

| Pattern | Description | Route |
|---------|-------------|-------|
| 0[1-9]X. | German national | CCPP |
| 00[1-9]X. | International | CCPP |
| 112 | EU Emergency | Emergency |

**US PSTN Dial Plan:**

| Pattern | Description | Route |
|---------|-------------|-------|
| 91[2-9]XXXXXXXXX | US domestic | CCPP |
| 9011[1-9]X. | International | CCPP |
| 911 | Emergency | E911 |
| 91800XXXXXXX | Toll-Free | CCPP |

### 2.4.4 Emergency Calling Configuration

```
   EMERGENCY CALLING CONFIGURATION BY REGION
   INDIA:
   *  *  *  *  *  *
   Emergency Numbers: 100 (Police), 101 (Fire), 102 (Ambulance), 112
   Callback Number:   Per-location main number
   Address Format:   Manual entry (no automated E-CNAM in India)
   Routing:   Via Local Gateway to local PSTN
   UK:
   *  *  *
   Emergency Numbers: 999, 112
   Callback Number:   User's DID
   Address Format:   BT Openreach validated
   Routing:   Via CCPP
   GERMANY (EU):
   *  *  *  *  *  *  *  *  *  *  *  *  *
   Emergency Number:  112 (EU standard)
   Callback Number:   User's DID
   Address Format:   German address format (Stra  e, PLZ, Stadt)
   Routing:   Via CCPP
   USA:
   *  *  *  *
   Emergency Number:  911
   Service Type:   E911 (Enhanced 911)
   Callback Number:   User's DID
   ELIN:   Assigned per location
   Address:   Validated dispatchable address per user
   Routing:   Via CCPP with E911 lookup
   REMOTE/WFH USERS:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Users prompted to update emergency address in Webex App
   Nomadic E911: Address follows user, not device
   India WFH: 112 routes to Webex-provided emergency service
   US WFH: E911 with user-declared address
```

---

## 2.5 Feature Design

### 2.5.1 Hunt Groups

**Hunt Group Migration from CUCM:**

| Hunt Group | Pilot Number | Pattern | Members | Migration Strategy |
|------------|--------------|---------|---------|-------------------|
| HG-Mumbai-Reception | +91-22-4960-0000 | Circular | 8 | Migrate batch 2 |
| HG-Mumbai-IT | +91-22-4960-0001 | Top Down | 12 | Migrate batch 1 (Pilot) |
| HG-Mumbai-HR | +91-22-4960-0002 | Circular | 6 | Migrate batch 2 |
| HG-Mumbai-Finance | +91-22-4960-0003 | Longest Idle | 8 | Migrate batch 3 |
| HG-Chennai-Reception | +91-44-4960-0000 | Circular | 4 | Migrate batch 4 |
| HG-Bangalore-Reception | +91-80-4960-0000 | Circular | 3 | Migrate batch 4 |
| HG-Delhi-Reception | +91-11-4960-0000 | Circular | 3 | Migrate batch 4 |
| HG-London-Reception | +44-20-4960-0000 | Circular | 4 | Migrate batch 5 |
| HG-London-Sales | +44-20-4960-0001 | Longest Idle | 10 | Migrate batch 5 |
| HG-NJ-Reception | +1-201-496-0000 | Circular | 4 | Migrate batch 6 |
| HG-NJ-Sales | +1-201-496-0001 | Longest Idle | 8 | Migrate batch 6 |
| HG-Dallas-Reception | +1-214-496-0000 | Circular | 3 | Migrate batch 6 |

**Webex Calling Hunt Group Configuration:**

```yaml
# Hunt Group Template - Mumbai Reception
hunt_group:
  name: "HG-Mumbai-Reception"
  location: "ABV-Mumbai-HQ"
  phone_number: "+91-22-4960-0000"
  extension: "8001"
  language: "en_IN"
  time_zone: "Asia/Kolkata"
  call_policies:
    policy: "CIRCULAR"          # Options: CIRCULAR, REGULAR (Top-Down), SIMULTANEOUS, UNIFORM (Longest Idle)
    ring_pattern: "NORMAL"
    forward_enabled: true
    forward_destination: "+91-22-4960-0001"  # Forward to IT Support if no answer
    forward_after_rings: 6
    wait_for_answer: true
    no_answer_number_of_rings: 4
    distinctive_ring: true
  agents:
    - extension: "1001"
      weight: null              # Not applicable for CIRCULAR
    - extension: "1002"
    - extension: "1003"
    - extension: "1004"
```

**Critical: Hunt Group Migration Batching Rule**

```
   MIGRATION RULE: Hunt Group members MUST migrate together
   All agents in a hunt group must move to Webex Calling in the same batch.
   Split migration (some agents on CUCM, some on Webex) will break routing.
   Pre-migration checklist:
   -  Identify all hunt group members
   -  Assign all members to same migration batch
   -  Validate all member phones are MPP-capable
   -  Configure hunt group in Webex before member cutover
```

### 2.5.2 Auto Attendants

**Auto Attendant Design:**

| Auto Attendant | Location | Main Number | Hours | Language |
|----------------|----------|-------------|-------|----------|
| AA-Mumbai-Main | Mumbai HQ | +91-22-4960-0000 | 24/7 | English/Hindi |
| AA-Chennai | Chennai | +91-44-4960-0000 | Business | English/Tamil |
| AA-London-Main | London | +44-20-4960-0000 | Business | English |
| AA-Frankfurt-Main | Frankfurt | +49-69-4960-0000 | Business | German/English |
| AA-NewJersey | New Jersey | +1-201-496-0000 | Business | English |
| AA-TollFree-India | Mumbai | 1800-266-1000 | 24/7 | English/Hindi |
| AA-TollFree-UK | London | +44-800-096-1000 | Business | English |
| AA-TollFree-US | New Jersey | +1-800-096-1000 | Business | English |

**Sample Auto Attendant Menu (Mumbai Main):**

```
   AA-MUMBAI-MAIN - IVR MENU STRUCTURE
   GREETING: "Welcome to Abhavtech. Your call may be recorded for quality."
   BUSINESS HOURS (9 AM - 6 PM IST):
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   "Press 1 for Sales"   Transfer to HG-Mumbai-Sales
   "Press 2 for Customer Support"   Transfer to Call Queue (Phase 2)
   "Press 3 for Human Resources"   Transfer to HG-Mumbai-HR
   "Press 4 for Finance"   Transfer to HG-Mumbai-Finance
   "Press 5 for IT Support"   Transfer to HG-Mumbai-IT
   "Press 0 for Reception"   Transfer to HG-Mumbai-Reception
   "To dial by extension, press 9"   Extension dialing enabled
   No input timeout (10 sec)   Transfer to Reception
   AFTER HOURS (6 PM - 9 AM IST):
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   "Thank you for calling Abhavtech. Our office is currently closed.
   Office hours are Monday to Friday, 9 AM to 6 PM India Standard Time.
   Please leave a message after the tone, or call back during business
   hours. For emergencies, press 1 to reach our on-call support."
   Press 1   After-hours mobile (rotational)
   No input   Voicemail (general mailbox)
   HOLIDAY SCHEDULE:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Indian national holidays   After-hours greeting
   Configured in Control Hub schedules
```

### 2.5.3 Virtual Lines (Shared Line Migration)

**Shared Line to Virtual Line Migration:**

Webex Calling uses **Virtual Lines** to replace CUCM shared lines. Virtual Lines are independently licensed line appearances that can be shared across multiple devices.

| CUCM Shared Line | Users | Virtual Line Name | Extension | DID |
|------------------|-------|-------------------|-----------|-----|
| Reception Mumbai | 4 | VL-Mumbai-Reception | 8900 | +91-22-4960-8900 |
| Reception Chennai | 2 | VL-Chennai-Reception | 8901 | +91-44-4960-8901 |
| Finance Hotline | 3 | VL-Finance-Hotline | 8902 | +91-22-4960-8902 |
| Executive Admin | 2 | VL-Exec-Admin | 8903 | +91-22-4960-8903 |
| CEO Assistant | 2 | VL-CEO-Assistant | 8904 | Internal only |

**Virtual Line Configuration:**

```yaml
# Virtual Line Template
virtual_line:
  name: "VL-Mumbai-Reception"
  location: "ABV-Mumbai-HQ"
  extension: "8900"
  phone_number: "+91-22-4960-8900"
  calling_line_id:
    first_name: "Reception"
    last_name: "Mumbai"
  announcement_language: "en_IN"
  devices:
    - type: "MPP"
      model: "Cisco 8865"
      mac: "AA:BB:CC:DD:EE:01"
      line_key_position: 2
    - type: "MPP"
      model: "Cisco 8865"
      mac: "AA:BB:CC:DD:EE:02"
      line_key_position: 2
    - type: "MPP"
      model: "Cisco 8845"
      mac: "AA:BB:CC:DD:EE:03"
      line_key_position: 2
    - type: "MPP"
      model: "Cisco 8845"
      mac: "AA:BB:CC:DD:EE:04"
      line_key_position: 2
```

### 2.5.4 Call Park & Pickup

**Call Park Configuration:**

| Location | Park Extensions | Range | Timeout | Recall Destination |
|----------|-----------------|-------|---------|-------------------|
| Mumbai HQ | 10 | #7810 - #7819 | 60 sec | Original parker |
| Chennai | 5 | #7820 - #7824 | 60 sec | Original parker |
| Bangalore | 5 | #7825 - #7829 | 60 sec | Original parker |
| London | 5 | #7910 - #7914 | 60 sec | Original parker |
| Frankfurt | 5 | #7920 - #7924 | 60 sec | Original parker |
| New Jersey | 5 | #7930 - #7934 | 60 sec | Original parker |
| Dallas | 3 | #7935 - #7937 | 60 sec | Original parker |

**Call Pickup Groups:**

| Location | Pickup Group | Extensions | Pickup Code |
|----------|--------------|------------|-------------|
| Mumbai - IT | CPG-Mumbai-IT | 1100-1120 | *98 |
| Mumbai - HR | CPG-Mumbai-HR | 1200-1220 | *98 |
| Mumbai - Finance | CPG-Mumbai-Fin | 1300-1330 | *98 |
| Mumbai - Sales | CPG-Mumbai-Sales | 1400-1450 | *98 |
| Chennai - All | CPG-Chennai | 2000-2300 | *98 |
| London - All | CPG-London | 4000-4400 | *98 |

---

## 2.6 Interworking Design (CUCM-Webex Coexistence)

### 2.6.1 Coexistence Architecture Overview

During the migration period, CUCM and Webex Calling must coexist and interoperate seamlessly. This section details the architecture for the coexistence phase.

```
   CUCM - WEBEX CALLING COEXISTENCE ARCHITECTURE
   WEBEX CLOUD
   (Mumbai + Chennai DCs)
   SIP Trunk
   (TLS/SRTP)
   
   CUBE/LGW
   Mumbai (HA)
   Routes between:
   Webex Cloud
   CUCM Cluster
   PSTN
      
   CUCM CLUSTER   WEBEX CALLING
   (Remaining Users)   (Migrated Users)
   CC Agents (175)   Enterprise users
   Pending migration   Hunt Groups
   UCCX integration   Auto Attendants
 <-> -
   Extensions:   Inter-cluster   Extensions:
   Remaining batches   calling via   Migrated ranges
   CUBE trunk
   COEXISTENCE PERIOD: Migration batches 1-7 (approximately 8-12 weeks)
   CALL FLOW SUMMARY:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Webex   CUCM:  Webex Cloud   CUBE   CUCM SIP Trunk   CUCM User
   CUCM   Webex:  CUCM   SIP Trunk   CUBE   Webex Cloud   Webex User
   Webex   PSTN:  Webex Cloud   Zone/LGW   PSTN (India)
   CUCM   PSTN:   CUCM   CUBE   PSTN (existing routing)
```

### 2.6.2 Coexistence Dial Plan Integration

**Routing Logic During Coexistence:**

| From | To | Route Path | Dial String |
|------|-----|------------|-------------|
| Webex User | CUCM User | Webex -> CUBE -> CUCM | Extension (4-digit) or ESN (8-XX-XXXX) |
| CUCM User | Webex User | CUCM -> CUBE -> Webex | Extension (4-digit) or ESN (8-XX-XXXX) |
| Webex User | PSTN (India) | Webex -> Zone -> LGW -> PSTN | 9 + number |
| CUCM User | PSTN | CUCM -> CUBE -> PSTN | 9 + number |
| External | Webex User | PSTN -> LGW -> Webex | DID |
| External | CUCM User | PSTN -> CUBE -> CUCM | DID |

**CUBE Dial Peer Configuration for Coexistence:**

```
! ============================================================
! CUBE Configuration - Coexistence Phase
! Routes calls between CUCM, Webex, and PSTN
! ============================================================

! --- Dial Peer for CUCM to Webex ---
dial-peer voice 300 voip
 description CUCM-to-Webex-Coexistence
 destination-pattern [1-5]...     ! Extensions migrated to Webex
 session protocol sipv2
 session target dns:webexapis.com
 session transport tcp tls
 voice-class sip tenant 100
 voice-class codec 1
 dtmf-relay rtp-nte
 srtp

! --- Dial Peer for Webex to CUCM ---
dial-peer voice 400 voip
 description Webex-to-CUCM-Coexistence
 destination-pattern [1-5]...     ! Extensions still on CUCM
 session protocol sipv2
 session target ipv4:10.1.1.10    ! CUCM Subscriber
 voice-class codec 1
 dtmf-relay rtp-nte

! --- Inbound from Webex for CUCM destinations ---
dial-peer voice 401 voip
 description Webex-Inbound-to-CUCM
 incoming uri via Webex
 session protocol sipv2
 voice-class sip tenant 100
 voice-class codec 1
 dtmf-relay rtp-nte
 srtp

! --- Translation Rules for Extension Routing ---
voice translation-rule 10
 rule 1 /^1/ /1/                  ! Mumbai extensions - check if Webex or CUCM
 rule 2 /^2/ /2/                  ! Chennai extensions
 rule 3 /^3/ /3/                  ! Branch extensions
 rule 4 /^4/ /4/                  ! EMEA extensions
 rule 5 /^5/ /5/                  ! Americas extensions
```

### 2.6.3 Coexistence Call Flow Diagrams

#### Scenario 1: Webex User Calls CUCM User (Internal)

```
   CALL FLOW: Webex User (Ext 1500)   CUCM User (Ext 1001)
   Webex   Webex   CUBE   CUCM   CUCM
   User   -   Cloud   -   LGW   -   Cluster   -   User
   (1500)   (1001)
   1. Webex user dials extension 1001
   2. Webex Cloud recognizes 1001 is NOT on Webex (not yet migrated)
   3. Webex routes call to CUBE via SIP trunk
   4. CUBE receives call, matches dial-peer for CUCM destinations
   5. CUBE sends INVITE to CUCM cluster
   6. CUCM routes call to extension 1001
   7. CUCM user phone rings
   8. Media path: Webex User   CUBE   CUCM User
   CODEC NEGOTIATION: G.711 (transcoding at CUBE if needed)
```

#### Scenario 2: CUCM User Calls Webex User (Internal)

```
   CALL FLOW: CUCM User (Ext 1001)   Webex User (Ext 2500)
   CUCM   CUCM   CUBE   Webex   Webex
   User   -   Cluster   -   LGW   -   Cloud   -   User
   (1001)   (2500)
   1. CUCM user dials extension 2500
   2. CUCM routes pattern 2XXX to SIP trunk (CUBE)
   3. CUBE receives call, matches dial-peer for Webex destinations
   4. CUBE sends INVITE to Webex Cloud (TLS/SRTP)
   5. Webex Cloud routes call to extension 2500
   6. Webex user's Webex App/phone rings
   7. Media path: CUCM User   CUBE   Webex User
```

#### Scenario 3: External PSTN Call to Webex User (via DID)

```
   CALL FLOW: PSTN   Webex User (DID +91-22-4960-1500)
   PSTN   Tata   CUBE   Webex   Webex
   Caller   -   SIP   -   LGW   -   Cloud   -   User
   (1500)
   1. External caller dials +91-22-4960-1500
   2. Tata SIP trunk delivers call to CUBE
   3. CUBE receives INVITE with To: +912249601500
   4. CUBE translates DID to extension 1500
   5. CUBE checks: Is 1500 on Webex? YES (migrated user)
   6. CUBE sends INVITE to Webex Cloud
   7. Webex routes to user 1500
   8. User's Webex App/phone rings with CLI display
   KEY: DID-to-Extension translation must be maintained in CUBE
   during coexistence to route calls to correct platform
```

### 2.6.4 Coexistence Testing Procedures

**Pre-Migration Test Matrix:**

| Test Case | From | To | Expected Result | Pass/Fail |
|-----------|------|-----|-----------------|-----------|
| TC-01 | Webex User | CUCM User (same site) | Call completes, 2-way audio | [ ] |
| TC-02 | CUCM User | Webex User (same site) | Call completes, 2-way audio | [ ] |
| TC-03 | Webex User | CUCM User (different site) | Call completes via ESN | [ ] |
| TC-04 | CUCM User | Webex User (different site) | Call completes via ESN | [ ] |
| TC-05 | Webex User | PSTN (India) | Call completes via Zone/LGW | [ ] |
| TC-06 | CUCM User | PSTN (India) | Call completes via CUBE | [ ] |
| TC-07 | PSTN | Webex User (via DID) | Call completes, CLI displayed | [ ] |
| TC-08 | PSTN | CUCM User (via DID) | Call completes, CLI displayed | [ ] |
| TC-09 | Webex User | Hunt Group (CUCM) | Call reaches HG, cycles agents | [ ] |
| TC-10 | CUCM User | Hunt Group (Webex) | Call reaches HG, cycles agents | [ ] |
| TC-11 | Webex User | Auto Attendant (Webex) | Menu prompts, transfers work | [ ] |
| TC-12 | Webex User | CUCM User (transfer) | Transfer completes | [ ] |
| TC-13 | CUCM User | Webex User (transfer) | Transfer completes | [ ] |
| TC-14 | Webex User | Conference (3-party) | All parties hear each other | [ ] |
| TC-15 | Webex User | Voicemail (Unity) | VM deposit and retrieval works | [ ] |

### 2.6.5 Coexistence Troubleshooting Guide

```
   COEXISTENCE TROUBLESHOOTING DECISION TREE
   SYMPTOM: Webex user cannot call CUCM user
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Step 1: Check if CUCM user extension is in CUBE dial plan
   Run: show dial-peer voice summary
   Verify destination-pattern matches CUCM extensions
   Step 2: Check SIP trunk status to CUCM
   Run: show sip-ua status
   Verify TCP connection to CUCM is active
   Step 3: Check for 4xx/5xx errors in CUBE
   Run: debug ccsip messages
   Common issues:
   - 404 Not Found: Extension not registered on CUCM
   - 503 Service Unavailable: CUCM overloaded
   - 488 Not Acceptable: Codec mismatch
   Step 4: Check Webex-to-CUBE connectivity
   Control Hub   Calling   Trunk   Status
   Verify trunk shows "Active"
   SYMPTOM: CUCM user cannot call Webex user
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Step 1: Verify SIP trunk to CUBE in CUCM
   CUCM Admin   Device   Trunk   Status
   Should show "Full Service"
   Step 2: Check route pattern in CUCM
   Route patterns for migrated extensions should point to CUBE
   If extension range not routed, add route pattern
   Step 3: Check CUBE tenant configuration for Webex
   Verify credentials are correct
   Check TLS certificate validity
   SYMPTOM: One-way audio between platforms
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Step 1: Check media binding in CUBE
   Verify "bind media source-interface" is correct
   Media interface must be reachable from both CUCM and Webex
   Step 2: Check NAT/firewall traversal
   Webex media uses UDP 19560-65535
   CUCM media uses UDP 16384-32767
   Both must be allowed through firewall
   Step 3: Verify SRTP settings match
   Webex requires SRTP (encrypted)
   If CUCM side is RTP, CUBE must encrypt/decrypt
```

### 2.6.6 Coexistence Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| No direct SIP signaling Webex->CUCM | All calls traverse CUBE | Ensure CUBE capacity |
| Codec transcoding required | CPU overhead on CUBE | Size CUBE appropriately |
| Hunt Group split not supported | HG members must be on same platform | Migrate entire HG together |
| Shared Line across platforms not supported | Virtual Line users must be on Webex | Migrate all VL users together |
| CUCM Barge/Monitor to Webex users not supported | Supervisor functions limited | Wait for Phase 2 (CC migration) |
| Extension mobility across platforms not supported | Users must use assigned platform | Plan user assignments carefully |

---

## Chapter 2 Summary

### Key Design Decisions

| Decision Area | Selection | Rationale |
|---------------|-----------|-----------|
| Platform | Webex Calling Multi-Tenant | Scale fits, cost-effective, cloud-native |
| Home Region | APAC (Mumbai + Chennai DCs) | Majority users in India |
| India PSTN | Local Gateway per circle | DoT compliance, existing contracts |
| EMEA PSTN | CCPP (IntelePeer) | No toll bypass, simplified management |
| Americas PSTN | CCPP (IntelePeer) | Simplified management, E911 support |
| India WFH | ITN Numbers | Toll bypass exempt, location-flexible |
| Extension Length | 4 digits | Matches existing CUCM |
| ESN Format | 8-XX-XXXX | Location routing prefix |
| Coexistence | CUBE trunk | Bidirectional CUCM->Webex routing |

### Cross-Reference Matrix

| This Chapter Section | Related Chapter | Related Section |
|---------------------|-----------------|-----------------|
| 2.1.3 Data Residency | Chapter 4 | 4.3 India Compliance, 4.4 EMEA Compliance |
| 2.2.2 India Locations | Chapter 1 | 1.1 Site Inventory |
| 2.3.2 Local Gateway | Chapter 5 | 5.5 Firewall Requirements |
| 2.3.2 Zone/Edge | Chapter 4 | 4.3.2 Toll Bypass Prevention |
| 2.4.4 Emergency Calling | Chapter 4 | 4.5 Americas Compliance |
| 2.6 Coexistence | Chapter 7 | 7.2 Migration Procedures |

---

## Chapter 2 Appendix

### Template 2.A: Location Configuration Checklist

| Item | Configured | Verified | Notes |
|------|------------|----------|-------|
| Location name | [ ] | [ ] | |
| Site code | [ ] | [ ] | |
| Street address | [ ] | [ ] | |
| Timezone | [ ] | [ ] | |
| Language | [ ] | [ ] | |
| Extension range | [ ] | [ ] | |
| OAC | [ ] | [ ] | |
| PSTN type (LGW/CCPP) | [ ] | [ ] | |
| Zone assignment (India) | [ ] | [ ] | |
| Main number | [ ] | [ ] | |
| Emergency callback | [ ] | [ ] | |
| Hunt groups | [ ] | [ ] | |
| Auto attendant | [ ] | [ ] | |
| Call park range | [ ] | [ ] | |

### Template 2.B: LGW Deployment Checklist

| Item | Mumbai | Chennai | Bangalore | Delhi | Noida | Hyderabad |
|------|--------|---------|-----------|-------|-------|-----------|
| Platform verified | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| IOS-XE 17.12+ | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Webex certificate installed | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| TLS profile configured | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Tenant registered | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| PSTN trunk active | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Test call Webex->PSTN | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Test call PSTN->Webex | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

---

*End of Chapter 2: Webex Calling Design*

---
