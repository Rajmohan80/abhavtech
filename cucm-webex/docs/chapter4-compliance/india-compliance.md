# India DoT/TRAI Compliance

## 4.3 India Telecom Compliance

!!! info "India Data Center — In-Country Storage (Confirmed by Cisco)"
    Webex Calling India data centers: **Mumbai (primary) + Chennai (secondary)**  
    Webex Contact Center India: **Mumbai DC only**

    The following data is stored in-country within India:

    | Data Type | Platform | Retention |
    |---|---|---|
    | **Call recordings** | Webex Calling + WxCC | Min. 1 year (OSP requirement) |
    | **Voicemail** | Webex Calling | Per user mailbox policy |
    | **Call Detail Records (CDRs)** | Webex Calling + WxCC | Min. 1 year (OSP requirement) |
    | **Audit logs / syslogs** | Control Hub | Min. 3 years (AbhavTech policy) |

    Supported Cloud Connect PSTN partners in India: **Airtel**, **Tata Communications**, **Tata Tele Business Services**  
    *(Reliance Jio is not a certified Webex Cloud Connect partner for Calling/CC)*

### 4.3.1 DoT/TRAI Regulatory Framework

```
+-----------------------------------------------------------------------------+
|              INDIA TELECOM REGULATORY FRAMEWORK - ABHAVTECH                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGULATORY AUTHORITIES:                                                   |
|  =======================                                                   |
|                                                                             |
|  +--------------------------------------------------------------------+    |
|  |                                                                      |    |
|  |  DoT (Department of Telecommunications)                             |    |
|  |  ---------------------------------------                            |    |
|  |  * Licensing authority for telecom services                        |    |
|  |  * OSP (Other Service Provider) license requirements               |    |
|  |  * TSPA (Telecom Service Provider Agreement) compliance            |    |
|  |  * Interconnect agreements oversight                               |    |
|  |                                                                      |    |
|  |  TRAI (Telecom Regulatory Authority of India)                      |    |
|  |  --------------------------------------------                       |    |
|  |  * Tariff regulations                                              |    |
|  |  * Quality of service standards                                    |    |
|  |  * TOLL BYPASS PREVENTION (Critical for Abhavtech)                 |    |
|  |  * Consumer protection                                             |    |
|  |                                                                      |    |
|  +--------------------------------------------------------------------+    |
|                                                                             |
|  ABHAVTECH COMPLIANCE STATUS:                                              |
|  ============================                                              |
|                                                                             |
|  +-------------------------+-------------+------------------------------+ |
|  | Requirement              | Status      | Implementation               | |
|  +-------------------------+-------------+------------------------------+ |
|  | OSP Registration        | OK Compliant | Existing registration        | |
|  | Toll Bypass Prevention  | OK Designed  | LGW per telecom circle       | |
|  | PSTN Local Termination  | OK Designed  | Zone/Edge mapping            | |
|  | CLI Presentation        | OK Designed  | Local DID per call           | |
|  | Lawful Intercept        | OK Provider  | Tata/Airtel compliance       | |
|  | Number Portability      | OK Supported | MNP via PSTN providers       | |
|  +-------------------------+-------------+------------------------------+ |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.3.2 Toll Bypass Prevention Architecture

**CRITICAL COMPLIANCE REQUIREMENT:** All PSTN calls originating from users in India must egress to the PSTN from the same telecom circle where the user is physically located. This prevents "toll bypass" where calls could be routed over IP to a different circle to avoid long-distance charges.

```
+-----------------------------------------------------------------------------+
|              INDIA TOLL BYPASS PREVENTION - TECHNICAL DESIGN                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  COMPLIANCE REQUIREMENT:                                                   |
|  ======================                                                    |
|                                                                             |
|  "PSTN calls must originate and terminate within the SAME telecom         |
|   circle to prevent revenue bypass of domestic long-distance charges"      |
|                                                                             |
|  [!]️ VIOLATION CONSEQUENCE: License suspension, penalties up to ₹50 Lakhs  |
|                                                                             |
|  TECHNICAL IMPLEMENTATION:                                                 |
|  =========================                                                 |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                       |   |
|  |         WEBEX CALLING                    INDIA PSTN                  |   |
|  |                                                                       |   |
|  |  +------------------+                                               |   |
|  |  |  SINGAPORE DC    |                                               |   |
|  |  |  (Home Region)   |                                               |   |
|  |  |                  |                                               |   |
|  |  |  Zone-to-Edge    |                                               |   |
|  |  |  Mapping Engine  |                                               |   |
|  |  +--------+---------+                                               |   |
|  |           |                                                          |   |
|  |           | Route based on                                          |   |
|  |           | user's Zone                                             |   |
|  |           |                                                          |   |
|  |     +-----+-----+-----------+-----------+-----------+               |   |
|  |     |           |           |           |           |               |   |
|  |     v           v           v           v           v               |   |
|  |  +------+   +------+   +------+   +------+   +------+              |   |
|  |  |Edge  |   |Edge  |   |Edge  |   |Edge  |   |Edge  |              |   |
|  |  |Mumbai|   |Chennai|   |B'lore|   |Delhi |   |Hyd   |              |   |
|  |  +--+---+   +--+---+   +--+---+   +--+---+   +--+---+              |   |
|  |     |          |          |          |          |                   |   |
|  |     v          v          v          v          v                   |   |
|  |  +------+   +------+   +------+   +------+   +------+              |   |
|  |  | LGW  |   | LGW  |   | LGW  |   | LGW  |   | LGW  |              |   |
|  |  |Mumbai|   |Chennai|   |B'lore|   |Delhi |   |Hyd   |              |   |
|  |  +--+---+   +--+---+   +--+---+   +--+---+   +--+---+              |   |
|  |     |          |          |          |          |                   |   |
|  |     v          v          v          v          v                   |   |
|  |  +------+   +------+   +------+   +------+   +------+              |   |
|  |  |Tata/ |   |Airtel|   |Tata  |   |Airtel|   |Tata  |              |   |
|  |  |Airtel|   |      |   |      |   |      |   |      |              |   |
|  |  |Mumbai|   |Chennai|   |K'taka|   |Delhi |   |AP/TS |              |   |
|  |  |Circle|   |Circle |   |Circle|   |Circle|   |Circle|              |   |
|  |  +------+   +------+   +------+   +------+   +------+              |   |
|  |                                                                       |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  KEY DESIGN ELEMENTS:                                                      |
|  ====================                                                      |
|                                                                             |
|  1. ZONE = User Location (Webex Control Hub configuration)                |
|  2. EDGE = PSTN breakout point (Webex calling region construct)           |
|  3. LGW = Local Gateway hardware at each circle                           |
|  4. Zone -> Edge mapping ensures correct PSTN egress                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.3.3 Zone-to-Edge Mapping Configuration

**Abhavtech India Zone Configuration:**

| Zone Name | Telecom Circle | Edge Location | LGW Site | Users | DIDs |
|-----------|----------------|---------------|----------|-------|------|
| **ABV-Zone-Mumbai** | Mumbai | Edge-Mumbai | Mumbai HQ | 1,200 | +91-22-XXXX |
| **ABV-Zone-Chennai** | Tamil Nadu | Edge-Chennai | Chennai | 450 | +91-44-XXXX |
| **ABV-Zone-Bangalore** | Karnataka | Edge-Bangalore | Bangalore | 180 | +91-80-XXXX |
| **ABV-Zone-Delhi** | Delhi | Edge-Delhi | Delhi | 150 | +91-11-XXXX |
| **ABV-Zone-Noida** | UP West | Edge-Noida | Noida | 120 | +91-120-XXXX |
| **ABV-Zone-Pune** | Maharashtra | Edge-Mumbai | Mumbai (shared) | 100 | +91-20-XXXX |
| **ABV-Zone-Hyderabad** | AP/Telangana | Edge-Hyderabad | Hyderabad | 200 | +91-40-XXXX |

> **Note:** Pune users share the Mumbai LGW since both are in Maharashtra circle. The Edge-Mumbai serves the entire Maharashtra telecom circle.

### 4.3.4 Local Gateway PSTN Provider Configuration

```
+-----------------------------------------------------------------------------+
|              LGW PSTN PROVIDER CONFIGURATION - INDIA                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  | LGW Site       | Primary Provider | Backup Provider | SIP Trunks   |   |
|  +----------------+------------------+-----------------+--------------+   |
|  | Mumbai HQ      | Tata Teleservices| Airtel          | 60 channels  |   |
|  | Chennai        | Airtel           | Tata            | 30 channels  |   |
|  | Bangalore      | Tata Teleservices| Tata Comm       | 20 channels  |   |
|  | Delhi          | Airtel           | Tata            | 15 channels  |   |
|  | Noida          | Tata Teleservices| Airtel          | 12 channels  |   |
|  | Hyderabad      | Tata Teleservices| Airtel          | 20 channels  |   |
|  +----------------+------------------+-----------------+--------------+   |
|                                                                             |
|  PROVIDER COMPLIANCE REQUIREMENTS:                                         |
|  =================================                                         |
|                                                                             |
|  OK TSPA (Telecom Service Provider Agreement) in place                     |
|  OK Lawful intercept capability confirmed                                   |
|  OK CLI transparency (no modification)                                      |
|  OK Emergency services routing (112) supported                              |
|  OK Number portability (MNP) supported                                      |
|                                                                             |
|  SIP TRUNK SPECIFICATIONS:                                                 |
|  =========================                                                 |
|                                                                             |
|  Protocol:        SIP over TLS (Port 5061)                                |
|  Codec:           G.711 (Primary), G.729 (Secondary)                      |
|  DTMF:            RFC 2833                                                 |
|  Fax:             T.38 (where supported)                                   |
|  Session Timer:   1800 seconds                                             |
|  Registration:    Static IP (no registration required)                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.3.5 Internet Telephony Numbers (ITN) for Remote Workers

```
+-----------------------------------------------------------------------------+
|              ITN CONFIGURATION - INDIA REMOTE WORKERS                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ITN REGULATORY STATUS:                                                    |
|  ======================                                                    |
|                                                                             |
|  Internet Telephony Numbers (ITN) are EXEMPT from toll bypass rules       |
|  because they are specifically designed for internet-based calling and     |
|  do not interconnect with the traditional PSTN in the same manner.         |
|                                                                             |
|  Reference: https://help.webex.com/en-us/article/nmhjfvi                   |
|                                                                             |
|  ABHAVTECH ITN ASSIGNMENT:                                                 |
|  ==========================                                                |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  | User Category        | Number Format      | Quantity | Assignment   |   |
|  +----------------------+--------------------+----------+--------------+   |
|  | WFH - Mumbai Region  | +91-22-719X-XXXX   | 100      | Individual   |   |
|  | WFH - Other Regions  | +91-80-719X-XXXX   | 80       | Individual   |   |
|  | Field Sales          | +91-22-719X-XXXX   | 50       | Mobile-paired|   |
|  | Executive WFH        | +91-22-719X-XXXX   | 20       | Individual   |   |
|  +----------------------+--------------------+----------+--------------+   |
|                                                                             |
|  ITN CONNECTIVITY:                                                         |
|  =================                                                         |
|                                                                             |
|           +-----------------+                                              |
|           |  Remote User    |                                              |
|           |  (WFH India)    |                                              |
|           +--------+--------+                                              |
|                    | Webex App                                             |
|                    | (Internet)                                            |
|                    v                                                        |
|           +-----------------+                                              |
|           |  Webex Cloud    |                                              |
|           |  (Mumbai + Chennai DCs)    |                                              |
|           +--------+--------+                                              |
|                    | ITN Route                                             |
|                    v                                                        |
|           +-----------------+                                              |
|           |  CCPP Provider  |<-- Cloud Connected PSTN Provider            |
|           |  (ITN Gateway)  |    (Toll bypass exempt)                     |
|           +--------+--------+                                              |
|                    |                                                        |
|                    v                                                        |
|           +-----------------+                                              |
|           |  PSTN Callee    |                                              |
|           +-----------------+                                              |
|                                                                             |
|  [!]️ ITN LIMITATIONS:                                                       |
|  * Cannot receive calls from international numbers (India regulatory)     |
|  * Caller ID shows ITN number (not geographic DID)                        |
|  * Emergency services (112) routing may require special configuration     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.3.6 India Emergency Services (112)

| Site | Emergency Number | Routing | PSTN Provider | Notes |
|------|-----------------|---------|---------------|-------|
| Mumbai | 112 | Via LGW-Mumbai | Tata | CLI = Office main number |
| Chennai | 112 | Via LGW-Chennai | Airtel | CLI = Office main number |
| Bangalore | 112 | Via LGW-Bangalore | Tata | CLI = Office main number |
| Delhi | 112 | Via LGW-Delhi | Airtel | CLI = Office main number |
| Noida | 112 | Via LGW-Noida | Tata | CLI = Office main number |
| Pune | 112 | Via LGW-Mumbai | Tata | Maharashtra circle |
| Hyderabad | 112 | Via LGW-Hyderabad | Tata | CLI = Office main number |
| Remote/WFH | 112 | Via ITN Provider | CCPP | May require user location |

### 4.3.7 India Compliance Validation Procedures

```
+-----------------------------------------------------------------------------+
|              INDIA COMPLIANCE VALIDATION CHECKLIST                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PRE-DEPLOYMENT VALIDATION:                                                |
|  ==========================                                                |
|                                                                             |
|  [ ] 1. Zone Configuration Verification                                      |
|       * Verify each user is assigned to correct Zone                       |
|       * Cross-reference user location with Zone-to-Edge mapping           |
|       * Test: User in Zone-Mumbai -> Edge-Mumbai -> LGW-Mumbai              |
|                                                                             |
|  [ ] 2. Edge-to-LGW Connectivity Test                                        |
|       * Confirm TLS connectivity from Edge to each LGW                    |
|       * Verify certificate validity and trust chain                       |
|       * Test: OPTIONS ping from Webex to each LGW                         |
|                                                                             |
|  [ ] 3. LGW-to-PSTN Provider Verification                                    |
|       * Confirm SIP trunk registration/status                              |
|       * Verify TSPA agreement is current                                   |
|       * Test: Place outbound call from each LGW                           |
|                                                                             |
|  [ ] 4. DID Assignment Verification                                          |
|       * Confirm DIDs match telecom circle of user location                |
|       * Mumbai users must have +91-22 DIDs                                 |
|       * Chennai users must have +91-44 DIDs, etc.                         |
|                                                                             |
|  TOLL BYPASS VALIDATION TEST PROCEDURE:                                    |
|  =======================================                                   |
|                                                                             |
|  Test Case 1: Intra-Circle Call (SHOULD SUCCEED)                          |
|  ------------------------------------------------                          |
|  1. User A in Mumbai (Zone-Mumbai) calls PSTN number in Mumbai            |
|  2. Verify: Call routes through Edge-Mumbai -> LGW-Mumbai                  |
|  3. Verify: CDR shows Mumbai LGW as PSTN egress point                     |
|  4. Expected Result: Call completes, CLI shows Mumbai DID                 |
|                                                                             |
|  Test Case 2: Inter-Circle Call (SHOULD SUCCEED WITH LOCAL EGRESS)        |
|  -----------------------------------------------------------------         |
|  1. User A in Mumbai (Zone-Mumbai) calls PSTN number in Delhi             |
|  2. Verify: Call routes through Edge-Mumbai -> LGW-Mumbai -> PSTN           |
|  3. Verify: CDR shows Mumbai LGW as PSTN egress (NOT Delhi)               |
|  4. Expected Result: Call completes as STD call via Mumbai PSTN           |
|                                                                             |
|  Test Case 3: Traveling User (MUST UPDATE ZONE)                           |
|  -----------------------------------------------                           |
|  1. User normally in Mumbai travels to Chennai office                     |
|  2. Admin MUST update user's Zone to Zone-Chennai                         |
|  3. Verify: Calls now route through Edge-Chennai -> LGW-Chennai            |
|  4. [!]️ If Zone not updated, user's calls would violate toll bypass        |
|                                                                             |
|  Test Case 4: WFH User with ITN (EXEMPT FROM TOLL BYPASS)                 |
|  ---------------------------------------------------------                 |
|  1. WFH user with ITN (+91-22-719X-XXXX) makes PSTN call                  |
|  2. Verify: Call routes via CCPP (not LGW)                                |
|  3. Verify: CDR shows ITN as calling party                                |
|  4. Expected Result: Call completes (toll bypass exempt)                   |
|                                                                             |
|  POST-DEPLOYMENT MONITORING:                                               |
|  ===========================                                               |
|                                                                             |
|  [ ] Weekly CDR Review                                                       |
|       * Sample 1% of PSTN calls from each site                            |
|       * Verify egress point matches user Zone                              |
|       * Flag any anomalies for investigation                               |
|                                                                             |
|  [ ] Monthly Compliance Report                                               |
|       * Total PSTN calls per site                                          |
|       * Toll bypass validation success rate                                |
|       * Any failed validation cases and remediation                        |
|                                                                             |
|  [ ] Quarterly Audit                                                         |
|       * External audit of PSTN routing compliance                          |
|       * Review Zone assignments for traveling users                        |
|       * Update documentation for any changes                               |
|                                                                             |
|  COMPLIANCE VIOLATION RESPONSE:                                            |
|  ==============================                                            |
|                                                                             |
|  If a toll bypass violation is detected:                                   |
|  1. IMMEDIATELY suspend affected user's PSTN access                       |
|  2. Investigate root cause (Zone misconfiguration, etc.)                  |
|  3. Remediate and document corrective action                              |
|  4. Re-enable PSTN access after validation                                |
|  5. Report to compliance team if required                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

