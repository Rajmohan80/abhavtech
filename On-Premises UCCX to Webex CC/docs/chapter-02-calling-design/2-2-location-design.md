# Chapter 2: Webex Calling Design -- 2.2 Location Design

## 2.2 Location Design

### 2.2.1 Location Hierarchy Overview

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH WEBEX CALLING LOCATION HIERARCHY                      |
+-----------------------------------------------------------------------------+
|                                                                             |
|                         +---------------------+                             |
|                         |   ORGANIZATION      |                             |
|                         |   Abhavtech.com     |                             |
|                         |   Home: APAC        |                             |
|                         +----------+----------+                             |
|                                    |                                        |
|        +---------------------------+---------------------------=           |
|        |                           |                           |           |
|        v                           v                           v           |
|  +---------------+          +---------------+          +---------------+   |
|  | INDIA (APAC)  |          | EMEA          |          | AMERICAS      |   |
|  | 7 Locations   |          | 2 Locations   |          | 2 Locations   |   |
|  | 2,400 Users   |          | 800 Users     |          | 750 Users     |   |
|  +-------+-------+          +-------+-------+          +-------+-------+   |
|          |                          |                          |           |
|    +-----+-----=              +-----+-----=              +-----+-----=     |
|    |           |              |           |              |           |     |
|    v           v              v           v              v           v     |
| +------+  +------+        +------+  +------+        +------+  +------+   |
| |Mumbai|  |Branch|        |London|  |Frank-|        |New   |  |Dallas|   |
| |HQ    |  |Sites |        |      |  |furt  |        |Jersey|  |      |   |
| |1,200 |  |1,200 |        |520   |  |280   |        |480   |  |270   |   |
| +------+  +------+        +------+  +------+        +------+  +------+   |
|                                                                             |
|  Note: Branch Sites include Chennai (450), Bangalore (180), Delhi (150),   |
|        Noida (120), Pune (100), Hyderabad (200). WFH users: 250 separate.  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 2.2.2 India Locations Configuration

#### Mumbai HQ (ABV-IN-MUM)

```
+-----------------------------------------------------------------------------+
|              LOCATION: MUMBAI HQ (ABV-IN-MUM)                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  GENERAL SETTINGS                                                          |
|  ================                                                          |
|  Location Name:       ABV-Mumbai-HQ                                        |
|  Site Code:           81                                                   |
|  Address:             Bandra Kurla Complex, Mumbai 400051, India           |
|  Timezone:            Asia/Kolkata (GMT+5:30)                              |
|  Language:            English (India)                                      |
|  Announcement Language: en_IN                                              |
|                                                                             |
|  USER ALLOCATION                                                           |
|  ===============                                                           |
|  Total Users:         1,200                                                |
|  Enterprise Users:    1,080                                                |
|  Contact Center Agents: 120 (Phase 2 - remain on UCCX until migration)    |
|  Phone Devices:       850                                                  |
|  Soft Client Only:    350                                                  |
|                                                                             |
|  EXTENSION RANGE                                                           |
|  ===============                                                           |
|  Extension Length:    4 digits                                             |
|  Extension Range:     1000-1999                                            |
|  Steering Digit:      8 (for ESN dialing)                                  |
|  Outside Access Code: 9                                                    |
|                                                                             |
|  PSTN CONFIGURATION                                                        |
|  ==================                                                        |
|  PSTN Type:           Premises-based (Local Gateway)                       |
|  LGW Address:         lgw-mumbai-01.abhavtech.com                          |
|  LGW HA Pair:         lgw-mumbai-02.abhavtech.com                          |
|  Trunk Type:          Certificate-based registration                       |
|  Route Group:         RG-Mumbai-LGW                                        |
|                                                                             |
|  INDIA COMPLIANCE                                                          |
|  ================                                                          |
|  Zone:                Zone-Mumbai-Circle                                   |
|  Trusted Network Edge: Mumbai-Edge (103.15.XX.XXX/24)                        |
|  Telecom Circle:      Mumbai                                               |
|  PSTN Provider:       Tata Communications                                  |
|                                                                             |
|  DID INVENTORY                                                             |
|  =============                                                             |
|  Main Number:         +91-22-4960-0000                                     |
|  DID Range:           +91-22-4960-0001 to +91-22-4960-1999                 |
|  Backup DIDs:         +91-22-4960-0000 to +91-22-6789-0499 (Airtel)        |
|  Toll-Free:           1800-266-1000, 1800-266-1001 (shared)                |
|  Total DIDs:          2,500                                                |
|                                                                             |
|  FEATURES                                                                  |
|  ========                                                                  |
|  Main Auto Attendant: AA-Mumbai-Main                                       |
|  Hunt Groups:         4 (Reception, IT, HR, Finance)                       |
|  Call Queues:         3 (Support, Sales, General)                          |
|  Call Park Extensions: 10 (#7810-#7819)                                    |
|  Pickup Groups:       8 (department-based)                                 |
|                                                                             |
|  EMERGENCY SERVICES                                                        |
|  ==================                                                        |
|  Emergency Number:    100 (Police), 101 (Fire), 102 (Ambulance)           |
|  Callback Number:     +91-22-4960-0000                                     |
|  Address Validation:  Manual (E-CNAM not available in India)               |
|                                                                             |
+-----------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------+
|              LOCATION: LONDON (ABV-UK-LON)                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  GENERAL SETTINGS                                                          |
|  ================                                                          |
|  Location Name:       ABV-London                                           |
|  Site Code:           91                                                   |
|  Address:             Canary Wharf, London E14, United Kingdom             |
|  Timezone:            Europe/London (GMT/BST)                              |
|  Language:            English (UK)                                         |
|  Announcement Language: en_GB                                              |
|                                                                             |
|  USER ALLOCATION                                                           |
|  ===============                                                           |
|  Total Users:         520                                                  |
|  Phone Devices:       380                                                  |
|  Soft Client Only:    140                                                  |
|                                                                             |
|  EXTENSION RANGE                                                           |
|  ===============                                                           |
|  Extension Length:    4 digits                                             |
|  Extension Range:     4000-4519                                            |
|  Steering Digit:      8 (for ESN dialing)                                  |
|  Outside Access Code: 9                                                    |
|                                                                             |
|  PSTN CONFIGURATION                                                        |
|  ==================                                                        |
|  PSTN Type:           Cloud Connected PSTN (CCPP)                          |
|  CCPP Provider:       IntelePeer UK                                        |
|  Route Group:         RG-UK-CCPP                                           |
|                                                                             |
|  UK COMPLIANCE                                                             |
|  =============                                                             |
|  Calling Region:      UK (separate from EU post-Brexit)                    |
|  Data Center:         London + Manchester (HA pair)                        |
|  Ofcom Registration:  Handled by CCPP provider                             |
|  UK GDPR:            Data processed in UK DCs only                        |
|                                                                             |
|  DID INVENTORY                                                             |
|  =============                                                             |
|  Main Number:         +44-20-7946-0000                                     |
|  DID Range:           +44-20-7946-0001 to +44-20-7946-0799                 |
|  Toll-Free:           +44-800-123-4567                                     |
|  Total DIDs:          800                                                  |
|                                                                             |
|  FEATURES                                                                  |
|  ========                                                                  |
|  Main Auto Attendant: AA-London-Main                                       |
|  Hunt Groups:         2 (Reception, Sales)                                 |
|  Call Queues:         1 (UK Support)                                       |
|  Call Park Extensions: 5 (#7910-#7914)                                     |
|                                                                             |
|  EMERGENCY SERVICES                                                        |
|  ==================                                                        |
|  Emergency Number:    999 / 112                                            |
|  Callback Number:     +44-20-7946-0000                                     |
|  Address Validation:  Automatic (UK E-CNAM)                                |
|                                                                             |
|  [!]️ CRITICAL: UK is a SEPARATE Webex Calling region from EU               |
|     London users MUST be assigned to UK region, not EU                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

#### Frankfurt (ABV-EU-FRA)

```
+-----------------------------------------------------------------------------+
|              LOCATION: FRANKFURT (ABV-EU-FRA)                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  GENERAL SETTINGS                                                          |
|  ================                                                          |
|  Location Name:       ABV-Frankfurt                                        |
|  Site Code:           92                                                   |
|  Address:             Westend, Frankfurt 60325, Germany                    |
|  Timezone:            Europe/Berlin (CET/CEST)                             |
|  Language:            German                                               |
|  Announcement Language: de_DE                                              |
|                                                                             |
|  USER ALLOCATION                                                           |
|  ===============                                                           |
|  Total Users:         280                                                  |
|  Phone Devices:       200                                                  |
|  Soft Client Only:    80                                                   |
|                                                                             |
|  EXTENSION RANGE                                                           |
|  ===============                                                           |
|  Extension Length:    4 digits                                             |
|  Extension Range:     4520-4799                                            |
|  Steering Digit:      8 (for ESN dialing)                                  |
|  Outside Access Code: 0 (German standard)                                  |
|                                                                             |
|  PSTN CONFIGURATION                                                        |
|  ==================                                                        |
|  PSTN Type:           Cloud Connected PSTN (CCPP)                          |
|  CCPP Provider:       IntelePeer EU                                        |
|  Route Group:         RG-EU-CCPP                                           |
|                                                                             |
|  GERMANY/EU COMPLIANCE                                                     |
|  =====================                                                     |
|  Calling Region:      EU                                                   |
|  Data Center:         Frankfurt + Amsterdam (HA pair)                      |
|  BSI C5:              Webex certified (17 domains, 114 requirements)       |
|  EU Cloud CoC:        Level 3 compliance                                   |
|  GDPR:                Full compliance, EU data processing only             |
|  BaFin:               Not applicable (Abhavtech not financial sector)      |
|                                                                             |
|  DID INVENTORY                                                             |
|  =============                                                             |
|  Main Number:         +49-69-8888-0000                                     |
|  DID Range:           +49-69-8888-0001 to +49-69-8888-0499                 |
|  Toll-Free:           +49-800-123-4567 (German)                            |
|  Total DIDs:          500                                                  |
|                                                                             |
|  FEATURES                                                                  |
|  ========                                                                  |
|  Main Auto Attendant: AA-Frankfurt-Main (German prompts)                   |
|  Hunt Groups:         2 (Reception, Support)                               |
|  Call Queues:         1 (EU Support)                                       |
|  Call Park Extensions: 5 (#7920-#7924)                                     |
|                                                                             |
|  EMERGENCY SERVICES                                                        |
|  ==================                                                        |
|  Emergency Number:    112 (EU standard)                                    |
|  Callback Number:     +49-69-8888-0000                                     |
|  Address Validation:  Automatic (German E-CNAM)                            |
|                                                                             |
+-----------------------------------------------------------------------------+
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
| Main Number | +1-201-555-0000 | +1-214-555-0000 |
| DIDs | 800 | 500 |
| Toll-Free | +1-800-555-0123 (shared) | Shared with NJ |
| Emergency | 911 (E911 enabled) | 911 (E911 enabled) |
| Hunt Groups | 2 | 1 |
| Call Queues | 1 | 1 |

### 2.2.5 Remote/WFH Users Configuration

```
+-----------------------------------------------------------------------------+
|              REMOTE/WFH USERS - WEBEX CALLING DESIGN                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TOTAL WFH USERS: 250 (globally distributed)                               |
|                                                                             |
|  +-------------------------------------------------------------------+     |
|  | Region      | Users | PSTN Solution       | Rationale             |     |
|  +-------------+-------+---------------------+-----------------------+     |
|  | India WFH   |   150 | ITN (9XXXXXXXXX)    | Toll bypass exempt    |     |
|  | EMEA WFH    |    60 | Standard (CCPP)     | No toll bypass rules  |     |
|  | Americas WFH|    40 | Standard (CCPP)     | No toll bypass rules  |     |
|  +-------------+-------+---------------------+-----------------------+     |
|                                                                             |
|  INDIA WFH USERS (ITN Solution)                                            |
|  ==============================                                            |
|                                                                             |
|  Why ITN for India WFH?                                                    |
|  -----------------------                                                   |
|  * DoT regulations require PSTN calls to egress from user's telecom circle|
|  * WFH users may work from ANY location in India                          |
|  * Traditional Zone/Edge enforcement would BLOCK their PSTN calls         |
|  * ITN (Internet Telephony Numbers) are EXEMPT from toll bypass rules     |
|                                                                             |
|  ITN Configuration:                                                        |
|  ------------------                                                        |
|  Number Format:       9XXXXXXXXX (10-digit, starts with 9)                |
|  Provider:            Tata Communications                                  |
|  Assignment:          Per-user ITN (no shared numbers)                    |
|  Range:               +91-9XXXXXXXXX (150 numbers)                        |
|  Restrictions:        Cannot call when outside India                      |
|                                                                             |
|  ITN Assignment Matrix:                                                    |
|  +------------------+-------------+-------------------------------------= |
|  | User Location    | ITN Range   | Notes                               | |
|  +------------------+-------------+-------------------------------------+ |
|  | Mumbai WFH       | 9XX-1000-XX | Primary allocation                  | |
|  | Other India WFH  | 9XX-1100-XX | Secondary allocation                | |
|  +------------------+-------------+-------------------------------------+ |
|                                                                             |
|  EMEA/AMERICAS WFH                                                         |
|  ================                                                          |
|  * No special PSTN restrictions                                           |
|  * Assigned to parent office location                                     |
|  * Uses standard CCPP numbers                                             |
|  * Full Webex Calling features                                            |
|                                                                             |
|  DEVICE STRATEGY FOR WFH                                                   |
|  ========================                                                  |
|  Primary:   Webex App (desktop/mobile)                                    |
|  Secondary: Cisco MPP phone (optional, shipped to home)                   |
|  Headset:   Cisco 730 or Jabra Evolve2 (provided)                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
