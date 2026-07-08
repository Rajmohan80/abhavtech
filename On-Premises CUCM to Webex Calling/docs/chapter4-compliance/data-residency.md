# Chapter 4: Security, Compliance & Data Residency 

> **Document Reference:** ABV-COLLAB-MIG-2026 | Chapter 4
> **Cross-References:** Chapter 1 (Discovery), Chapter 2 (Calling Design), Chapter 3 (Contact Center Design), Chapter 5 (DNS/Network)
> **Related Projects:** ABV-SDWAN-2024 (SD-WAN), ABV-SDA-ISE-2025 (SD-Access & ISE)
> **Phase:** Phase 1 (Webex Calling) & Phase 2 (Webex Contact Center)

---

## Document Information

| Field | Value |
|-------|-------|
| Project | ABV-COLLAB-MIG-2026 |
| Classification | Internal - Technical Reference |
| Scope | Security, Compliance & Data Residency for Webex Calling & Contact Center |
| Regions | India (DoT/TRAI), EMEA (GDPR/UK/BSI C5), Americas |
| Reference | Cisco Webex Security & Compliance Documentation |

---

## 4.1 Security Architecture

### 4.1.1 Webex Security Framework Overview

```
+-----------------------------------------------------------------------------+
|              WEBEX SECURITY ARCHITECTURE - ABHAVTECH                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|                    +---------------------------------+                      |
|                    |     WEBEX CLOUD PLATFORM        |                      |
|                    |     =====================       |                      |
|                    |                                 |                      |
|                    |  +-------------------------+   |                      |
|                    |  |   SECURITY CONTROLS     |   |                      |
|                    |  |   ---------------------  |   |                      |
|                    |  |  * TLS 1.2/1.3 Transport|   |                      |
|                    |  |  * AES-256 Encryption   |   |                      |
|                    |  |  * SRTP Media Security  |   |                      |
|                    |  |  * OAuth 2.0 Auth       |   |                      |
|                    |  |  * SAML SSO Support     |   |                      |
|                    |  |  * MFA Integration      |   |                      |
|                    |  +-------------------------+   |                      |
|                    |                                 |                      |
|                    +----------------+----------------+                      |
|                                     |                                       |
|      +------------------------------+------------------------------+       |
|      |                              |                              |       |
|      v                              v                              v       |
| +--------------+           +--------------+           +--------------+    |
| |   IDENTITY   |           |  DATA LAYER  |           |   NETWORK    |    |
| |   SECURITY   |           |  SECURITY    |           |   SECURITY   |    |
| +--------------+           +--------------+           +--------------+    |
| | * Azure AD   |           | * Encryption |           | * Firewall   |    |
| |   SSO (SAML) |           |   at Rest    |           |   Allow List |    |
| | * SCIM       |           | * Encryption |           | * IP Restrict|    |
| |   Provisioning|          |   in Transit |           | * Certificate|    |
| | * MFA (MS    |           | * Key Mgmt   |           |   Pinning    |    |
| |   Authenticator)|        | * Regional   |           | * DDoS       |    |
| | * Role-based |           |   Storage    |           |   Protection |    |
| |   Access     |           |              |           |              |    |
| +--------------+           +--------------+           +--------------+    |
|                                                                             |
|  COMPLIANCE CERTIFICATIONS:                                                |
|  ==========================                                                |
|  SOC 2 Type II | ISO 27001 | ISO 27017 | ISO 27018 | GDPR | BSI C5       |
|  HIPAA BAA Available | FedRAMP (US) | CSA STAR                           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.1.2 Authentication & Identity Security

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH IDENTITY SECURITY ARCHITECTURE                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|                         +---------------------+                             |
|                         |   AZURE AD TENANT   |                             |
|                         |   (Primary IdP)     |                             |
|                         |   -----------------  |                             |
|                         |  abhavtech.com      |                             |
|                         +----------+----------+                             |
|                                    |                                        |
|              +---------------------+---------------------+                 |
|              |                     |                     |                 |
|              v                     v                     v                 |
|    +------------------+  +------------------+  +------------------+       |
|    |    SAML SSO      |  |  SCIM SYNC       |  |  MFA POLICY      |       |
|    |    ==========    |  |  =========       |  |  ==========      |       |
|    |                  |  |                  |  |                  |       |
|    | * IdP: Azure AD  |  | * Auto User      |  | * MS Auth App   |       |
|    | * SP: Webex      |  |   Provisioning   |  | * SMS (Backup)  |       |
|    | * SAML 2.0       |  | * Group Sync     |  | * Hardware Key  |       |
|    | * JIT Provision  |  | * License Mgmt   |  |   (Exec only)   |       |
|    | * Auto Logout    |  | * Deprovisioning |  | * Conditional   |       |
|    |   (8 hr idle)    |  |                  |  |   Access        |       |
|    +------------------+  +------------------+  +------------------+       |
|                                                                             |
|  USER AUTHENTICATION FLOW:                                                 |
|  =========================                                                 |
|                                                                             |
|    User Request -> Webex -> SAML Redirect -> Azure AD                        |
|                                               v                            |
|                                          MFA Challenge                     |
|                                               v                            |
|                                          Approval                          |
|                                               v                            |
|    User Session <- Webex <- SAML Assertion <----+                            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Azure AD SSO Configuration for Webex:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Identity Provider** | Azure AD | abhavtech.onmicrosoft.com |
| **Protocol** | SAML 2.0 | |
| **Entity ID** | https://idbroker.webex.com | Webex service provider |
| **ACS URL** | https://idbroker.webex.com/idb/saml2/sso | |
| **NameID Format** | emailAddress | Maps to Webex user |
| **Signing Certificate** | SHA-256 | Azure AD certificate |
| **Single Logout** | Enabled | Terminate both sessions |
| **Auto-Provisioning** | JIT + SCIM | Automatic user creation |

**SCIM Provisioning Configuration:**

| Setting | Value |
|---------|-------|
| **SCIM Endpoint** | https://webexapis.com/identity/scim/v2/ |
| **Authentication** | Bearer Token (OAuth) |
| **Sync Scope** | Users + Groups |
| **Sync Frequency** | Every 40 minutes |
| **License Mapping** | Group-based assignment |
| **Deprovisioning** | Soft delete (disable) |

### 4.1.3 Encryption Standards

```
+-----------------------------------------------------------------------------+
|              WEBEX ENCRYPTION - ABHAVTECH DEPLOYMENT                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DATA STATE                    ENCRYPTION METHOD                            |
|  ==========                    =================                            |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                       |   |
|  |  IN TRANSIT                                                          |   |
|  |  ----------                                                          |   |
|  |                                                                       |   |
|  |  +-------------+     TLS 1.2/1.3     +-------------+                |   |
|  |  | Webex App   | ====================> | Webex Cloud |                |   |
|  |  | (User)      |     AES-256-GCM     |             |                |   |
|  |  +-------------+                      +-------------+                |   |
|  |                                                                       |   |
|  |  +-------------+     SRTP            +-------------+                |   |
|  |  | Voice/Video | ====================> | Media Nodes |                |   |
|  |  | Media       |     AES-256-CM      |             |                |   |
|  |  +-------------+                      +-------------+                |   |
|  |                                                                       |   |
|  |  +-------------+     TLS 1.2         +-------------+                |   |
|  |  | Local GW    | ====================> | Webex Edge  |                |   |
|  |  | (India)     |     mTLS (Certs)    |             |                |   |
|  |  +-------------+                      +-------------+                |   |
|  |                                                                       |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                       |   |
|  |  AT REST                                                             |   |
|  |  -------                                                             |   |
|  |                                                                       |   |
|  |  Voicemail:        AES-256 (Cisco-managed keys)                     |   |
|  |  Call Recordings:  AES-256 (Regional storage, customer-managed opt) |   |
|  |  CDR/Analytics:    AES-256 (Regional data center)                   |   |
|  |  Configuration:    AES-256 (Control Hub database)                   |   |
|  |                                                                       |   |
|  |  [!]️ BRING YOUR OWN KEY (BYOK): Not deployed for Abhavtech           |   |
|  |     (Available for Pro Pack customers if required)                  |   |
|  |                                                                       |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  CERTIFICATE MANAGEMENT:                                                   |
|  ======================                                                    |
|                                                                             |
|  * LGW Certificates: Webex CA signed (auto-renewed)                       |
|  * CUBE-PSTN TLS: Provider certificates (Tata, Airtel, etc.)              |
|  * Certificate Pinning: Enabled on Webex clients                          |
|  * Renewal Alert: 30 days before expiry                                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.1.4 Role-Based Access Control (RBAC)

**Control Hub Administrator Roles - Abhavtech Assignment:**

| Role | Description | Abhavtech Assignment | Count |
|------|-------------|---------------------|-------|
| **Full Administrator** | Complete access to all settings | IT Leadership | 3 |
| **User Administrator** | Manage users, licenses, locations | Regional IT Admins | 6 |
| **Device Administrator** | Manage devices, firmware | Voice Engineering | 4 |
| **Compliance Officer** | Access logs, reports, legal holds | Legal/Compliance | 2 |
| **Support Administrator** | Read-only access for troubleshooting | Help Desk Tier 2 | 8 |
| **Location Administrator** | Manage specific location settings | Site IT Leads | 12 |

**Contact Center RBAC (WxCC):**

| Role | Scope | Assignment |
|------|-------|------------|
| CC Administrator | Full CC management | CC Operations Manager |
| Supervisor | Team management, monitoring | Team Leads (12) |
| Agent | Queue membership, desktop | CC Agents (175) |
| Reporting | Analytics, dashboards | CC Analytics Team |
| WFM Administrator | Workforce management | WFM Team |

### 4.1.5 Audit & Logging

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH AUDIT LOGGING ARCHITECTURE                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  LOG SOURCE                  RETENTION      DESTINATION                     |
|  ==========                  =========      ===========                     |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                       |   |
|  |  CONTROL HUB ADMIN LOGS                                              |   |
|  |  * Login/logout events         | 12 months  | Control Hub UI        |   |
|  |  * Configuration changes       | 12 months  | API Export -> Splunk   |   |
|  |  * User provisioning           | 12 months  |                        |   |
|  |  * License assignments         | 12 months  |                        |   |
|  |                                                                       |   |
|  |  CALLING LOGS                                                        |   |
|  |  * Call Detail Records (CDR)   | 13 months  | Control Hub Analytics |   |
|  |  * Quality metrics (QoE)       | 13 months  | Webex Calling Reports |   |
|  |  * PSTN billing records        | 7 years    | Provider portal       |   |
|  |                                                                       |   |
|  |  CONTACT CENTER LOGS                                                 |   |
|  |  * Agent state changes         | 13 months  | WxCC Analyzer         |   |
|  |  * Queue statistics            | 13 months  | WxCC Analyzer         |   |
|  |  * Recording metadata          | 90 days    | Recording portal      |   |
|  |  * IVR flow execution          | 13 months  | Flow Designer logs    |   |
|  |                                                                       |   |
|  |  SECURITY LOGS                                                       |   |
|  |  * Authentication attempts     | 12 months  | Azure AD + SIEM       |   |
|  |  * Failed login attempts       | 12 months  | Alert -> SOC           |   |
|  |  * Privileged actions          | 24 months  | Compliance archive    |   |
|  |                                                                       |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  SIEM INTEGRATION:                                                         |
|  =================                                                         |
|                                                                             |
|  +--------------+     API Pull     +--------------+     Forward          |
|  | Control Hub  | ---------------> | Integration   | -------------->     |
|  | Events API   |  (every 15 min)  | Server        |                      |
|  +--------------+                  +--------------+        |              |
|                                                             |              |
|                                                             v              |
|                                                    +--------------+       |
|                                                    |   Splunk     |       |
|                                                    |   (SOC)      |       |
|                                                    +--------------+       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 4.2 Global Compliance Matrix

### 4.2.1 Abhavtech Regulatory Landscape

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH GLOBAL COMPLIANCE REQUIREMENTS                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|                            +---------------------+                          |
|                            |   ABHAVTECH HQ      |                          |
|                            |   (Mumbai, India)   |                          |
|                            +---------+-----------+                          |
|                                      |                                      |
|       +------------------------------+------------------------------+      |
|       |                              |                              |      |
|       v                              v                              v      |
| +---------------+          +---------------+          +---------------+   |
| |    INDIA      |          |     EMEA      |          |   AMERICAS    |   |
| |  (Primary)    |          |               |          |               |   |
| +---------------+          +---------------+          +---------------+   |
| | DoT License   |          | UK:           |          | US:           |   |
| | TRAI Toll     |          | * UK GDPR     |          | * TCPA        |   |
| |   Bypass      |          | * DPA 2018    |          | * STIR/SHAKEN |   |
| | IT Act 2000   |          |               |          | * FCC Rules   |   |
| | RBI (Finance) |          | EU:           |          | * State Laws  |   |
| | SEBI          |          | * GDPR        |          |   (CCPA, etc) |   |
| |               |          | * ePrivacy    |          |               |   |
| |               |          | * BSI C5 (DE) |          |               |   |
| +---------------+          +---------------+          +---------------+   |
|                                                                             |
|  CROSS-BORDER DATA FLOW REQUIREMENTS:                                      |
|  =====================================                                     |
|                                                                             |
|  India -> APAC DC:     DoT/TRAI requires PSTN to terminate in India        |
|  UK -> UK DC:          Post-Brexit data residency in UK                     |
|  EU -> EU DC:          GDPR requires EU data processing                     |
|  US -> US DC:          Data can flow to US (adequacy with India/EMEA)      |
|                                                                             |
|  [!]️ CRITICAL: India toll bypass prevention is PRIMARY compliance driver   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.2.2 Compliance Requirements Matrix

| Requirement | India | UK | EU (Germany) | US | Abhavtech Response |
|-------------|-------|----|--------------|----|-------------------|
| **Telecom License** | DoT OSP License | Ofcom | BNetzA | FCC | LGW (India), CCPP (EMEA/US) |
| **Toll Bypass Prevention** | TRAI Mandate | N/A | N/A | N/A | Zone/Edge per telecom circle |
| **Data Residency** | Recommended | Required (UK DC) | Required (EU DC) | Flexible | Regional calling regions |
| **Data Protection** | IT Act 2000, DPDP | UK GDPR, DPA 2018 | GDPR | CCPA, State Laws | Encryption, access controls |
| **Lawful Intercept** | DoT/TRAI | IPBill | National Laws | CALEA | Cisco compliance framework |
| **Recording Consent** | One-party | Two-party (business) | Two-party | Varies by state | Regional consent flows |
| **Emergency Services** | 112 (National) | 999 | 112 | 911 (E911) | Regional configuration |
| **Number Portability** | MNP (DoT) | Ofcom MNP | National MNP | LNP | Provider coordination |
| **Cloud Certification** | MeitY Empanelment | UK Cyber Essentials | BSI C5 | FedRAMP (optional) | Webex certifications |

### 4.2.3 Webex Platform Certifications

**Global Certifications (All Regions):**

| Certification | Scope | Validity | Relevance to Abhavtech |
|---------------|-------|----------|----------------------|
| **SOC 2 Type II** | Security, Availability, Confidentiality | Annual | Trust services criteria |
| **ISO 27001** | Information Security Management | 3-year cycle | ISMS framework |
| **ISO 27017** | Cloud Security Controls | 3-year cycle | Cloud-specific controls |
| **ISO 27018** | PII in Cloud | 3-year cycle | Personal data protection |
| **ISO 27701** | Privacy Information Management | 3-year cycle | GDPR alignment |
| **CSA STAR Level 2** | Cloud Security Alliance | Annual | Cloud security assurance |

**Region-Specific Certifications:**

| Region | Certification | Status | Notes |
|--------|--------------|--------|-------|
| Germany | **BSI C5** | Certified | Cloud Computing Compliance Criteria Catalogue |
| UK | **Cyber Essentials Plus** | Certified | UK Government requirement |
| UK | **G-Cloud** | Listed | UK Public Sector procurement |
| US | **FedRAMP Moderate** | Authorized | US Federal (not required for Abhavtech) |
| US | **HIPAA BAA** | Available | Healthcare (not required for Abhavtech) |
| India | **MeitY Empanelment** | Pending | Government cloud services |

---

## 4.3 India Telecom Compliance

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

## 4.4 EMEA Compliance

### 4.4.1 UK Compliance Requirements

```
+-----------------------------------------------------------------------------+
|              UK COMPLIANCE REQUIREMENTS - ABHAVTECH LONDON                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGULATORY FRAMEWORK:                                                     |
|  =====================                                                     |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                       |   |
|  |  UK GDPR (Post-Brexit UK Data Protection)                           |   |
|  |  ------------------------------------------                          |   |
|  |  * Data residency: UK data processed in UK data centers            |   |
|  |  * Lawful basis: Legitimate interest (business communications)     |   |
|  |  * Data subject rights: Access, rectification, erasure             |   |
|  |  * International transfers: UK adequacy decisions apply             |   |
|  |                                                                       |   |
|  |  Data Protection Act 2018                                           |   |
|  |  ------------------------                                            |   |
|  |  * UK implementation of GDPR principles                             |   |
|  |  * ICO (Information Commissioner's Office) oversight                |   |
|  |  * Breach notification: 72 hours to ICO                            |   |
|  |                                                                       |   |
|  |  Investigatory Powers Act 2016 (IPA)                                |   |
|  |  -----------------------------------                                 |   |
|  |  * Lawful intercept requirements                                    |   |
|  |  * Data retention obligations                                       |   |
|  |  * Webex/CCPP provider compliance required                         |   |
|  |                                                                       |   |
|  |  Ofcom Regulations                                                  |   |
|  |  -----------------                                                   |   |
|  |  * General Conditions of Entitlement                               |   |
|  |  * Emergency services (999) requirements                            |   |
|  |  * Number portability (MNP)                                         |   |
|  |                                                                       |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  ABHAVTECH UK IMPLEMENTATION:                                              |
|  ============================                                              |
|                                                                             |
|  +-------------------------+--------------------------------------------+ |
|  | Requirement             | Implementation                              | |
|  +-------------------------+--------------------------------------------+ |
|  | Data Residency          | UK Calling Region -> UK Data Center         | |
|  | PSTN Connectivity       | CCPP (IntelePeer UK) - No LGW required     | |
|  | Emergency Services      | 999 via CCPP with location callback        | |
|  | Lawful Intercept        | CCPP provider compliance (IntelePeer)      | |
|  | Recording Consent       | Two-party notification (IVR prompt)        | |
|  | Data Subject Rights     | Control Hub export + deletion capability   | |
|  | Breach Notification     | Webex -> Abhavtech -> ICO (72 hours)         | |
|  +-------------------------+--------------------------------------------+ |
|                                                                             |
|  [!]️ POST-BREXIT NOTE: UK is a SEPARATE calling region from EU.            |
|     London users MUST be assigned to UK region, not EU.                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.4.2 EU (Germany) Compliance Requirements

```
+-----------------------------------------------------------------------------+
|              EU/GERMANY COMPLIANCE REQUIREMENTS - ABHAVTECH FRANKFURT        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGULATORY FRAMEWORK:                                                     |
|  =====================                                                     |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                       |   |
|  |  GDPR (EU General Data Protection Regulation)                       |   |
|  |  --------------------------------------------                        |   |
|  |  * Data residency: EU data processed in EU data centers            |   |
|  |  * Data minimization: Collect only necessary data                  |   |
|  |  * Purpose limitation: Use data only for stated purposes           |   |
|  |  * International transfers: SCCs or adequacy decisions             |   |
|  |                                                                       |   |
|  |  BDSG (German Federal Data Protection Act)                          |   |
|  |  -----------------------------------------                           |   |
|  |  * Additional requirements beyond GDPR                             |   |
|  |  * Works council (Betriebsrat) consultation for monitoring         |   |
|  |  * Employee data protection provisions                              |   |
|  |                                                                       |   |
|  |  BSI C5 (Cloud Computing Compliance Criteria Catalogue)            |   |
|  |  ------------------------------------------------------             |   |
|  |  * German cloud security standard                                   |   |
|  |  * Required for German federal agencies                            |   |
|  |  * Webex is BSI C5 CERTIFIED OK                                     |   |
|  |                                                                       |   |
|  |  TKG (Telecommunications Act)                                       |   |
|  |  ----------------------------                                        |   |
|  |  * BNetzA (Federal Network Agency) oversight                       |   |
|  |  * Emergency services (112) requirements                            |   |
|  |  * Lawful intercept via provider                                    |   |
|  |                                                                       |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  ABHAVTECH GERMANY IMPLEMENTATION:                                         |
|  =================================                                         |
|                                                                             |
|  +-------------------------+--------------------------------------------+ |
|  | Requirement             | Implementation                              | |
|  +-------------------------+--------------------------------------------+ |
|  | Data Residency          | EU Calling Region -> Frankfurt DC           | |
|  | BSI C5 Compliance       | Webex certified - documentation available  | |
|  | PSTN Connectivity       | CCPP (IntelePeer EU) - No LGW required     | |
|  | Emergency Services      | 112 via CCPP with location callback        | |
|  | Lawful Intercept        | CCPP provider compliance (IntelePeer)      | |
|  | Recording Consent       | Two-party consent (explicit)               | |
|  | Works Council           | Consultation completed for CC monitoring   | |
|  | Data Subject Rights     | Control Hub export + deletion capability   | |
|  +-------------------------+--------------------------------------------+ |
|                                                                             |
|  BSI C5 CERTIFICATION DETAILS:                                             |
|  =============================                                             |
|                                                                             |
|  Webex BSI C5 attestation covers:                                         |
|  * Webex Meetings, Calling, Messaging, Contact Center                     |
|  * EU data center operations (Frankfurt, Amsterdam)                       |
|  * Annual audit by independent assessor                                   |
|  * Report available upon request via Cisco Trust Portal                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.4.3 EMEA Data Residency Architecture

```
+-----------------------------------------------------------------------------+
|              EMEA DATA RESIDENCY - ABHAVTECH                                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|                      +-----------------------------+                        |
|                      |     ABHAVTECH EMEA USERS    |                        |
|                      +-------------+---------------+                        |
|                                    |                                        |
|              +---------------------+---------------------+                 |
|              |                     |                     |                 |
|              v                     v                     |                 |
|    +------------------+  +------------------+           |                 |
|    |  LONDON OFFICE   |  | FRANKFURT OFFICE |           |                 |
|    |  520 Users       |  |  280 Users       |           |                 |
|    +--------+---------+  +--------+---------+           |                 |
|             |                     |                      |                 |
|             v                     v                      |                 |
|    +------------------+  +------------------+           |                 |
|    |  UK CALLING      |  |  EU CALLING      |           |                 |
|    |  REGION          |  |  REGION          |           |                 |
|    |  =============== |  |  =============== |           |                 |
|    |                  |  |                  |           |                 |
|    |  Signaling DC:   |  |  Signaling DC:   |           |                 |
|    |  * London        |  |  * Frankfurt     |           |                 |
|    |  * Manchester    |  |  * Amsterdam     |           |                 |
|    |                  |  |                  |           |                 |
|    |  Media DC:       |  |  Media DC:       |           |                 |
|    |  * UK POPs       |  |  * EU POPs       |           |                 |
|    |                  |  |                  |           |                 |
|    |  PSTN:           |  |  PSTN:           |           |                 |
|    |  * CCPP (UK)     |  |  * CCPP (EU)     |           |                 |
|    |  * IntelePeer    |  |  * IntelePeer    |           |                 |
|    +------------------+  +------------------+           |                 |
|                                                          |                 |
|  DATA CLASSIFICATION BY RESIDENCY:                      |                 |
|  =================================                      |                 |
|                                                          |                 |
|  +---------------------+-------------+-------------+   |                 |
|  | Data Type           | UK Users    | EU Users    |   |                 |
|  +---------------------+-------------+-------------+   |                 |
|  | Call Signaling      | UK DC       | EU DC       |   |                 |
|  | Voicemail           | UK DC       | EU DC       |   |                 |
|  | Call Recordings     | UK DC       | EU DC       |   |                 |
|  | CDR/Analytics       | UK DC       | EU DC       |   |                 |
|  | User Profiles       | UK DC       | EU DC       |   |                 |
|  | Configuration       | UK DC       | EU DC       |   |                 |
|  | Messaging Content   | UK DC       | EU DC       |   |                 |
|  +---------------------+-------------+-------------+   |                 |
|                                                          |                 |
|  [!]️ IMPORTANT: UK and EU are SEPARATE data residency zones              |
|     post-Brexit. Users must be assigned to correct region.               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.4.4 EMEA PSTN - No Local Gateway Required

**Key Design Decision:** Unlike India, EMEA regions do **NOT** require Local Gateway deployment because:

1. **No toll bypass regulations** - UK and EU do not have telecom circle/toll bypass requirements
2. **CCPP provides full compliance** - Cloud Connected PSTN Provider (IntelePeer) handles all regulatory requirements
3. **Simplified architecture** - No on-premises hardware to maintain
4. **Provider handles lawful intercept** - IntelePeer compliance with IPA (UK) and national laws (EU)

| Region | PSTN Method | Provider | DIDs | Emergency |
|--------|-------------|----------|------|-----------|
| UK (London) | CCPP | IntelePeer UK | +44-20-XXXX-XXXX | 999 via provider |
| EU (Frankfurt) | CCPP | IntelePeer EU | +49-69-XXXX-XXXX | 112 via provider |

---

## 4.5 Americas Compliance

### 4.5.1 US Compliance Requirements

```
+-----------------------------------------------------------------------------+
|              US COMPLIANCE REQUIREMENTS - ABHAVTECH NEW JERSEY & DALLAS      |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FEDERAL REGULATIONS:                                                      |
|  ====================                                                      |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                       |   |
|  |  FCC Regulations                                                     |   |
|  |  ---------------                                                      |   |
|  |  * Common carrier regulations (Title II)                            |   |
|  |  * STIR/SHAKEN caller ID authentication (required)                  |   |
|  |  * Robocall mitigation database registration                        |   |
|  |  * E911 requirements (Kari's Law, RAY BAUM's Act)                  |   |
|  |                                                                       |   |
|  |  CALEA (Communications Assistance for Law Enforcement Act)          |   |
|  |  ---------------------------------------------------------          |   |
|  |  * Lawful intercept capability required                             |   |
|  |  * CCPP provider (IntelePeer) handles compliance                   |   |
|  |                                                                       |   |
|  |  TCPA (Telephone Consumer Protection Act)                           |   |
|  |  ----------------------------------------                            |   |
|  |  * Consent requirements for automated calls                         |   |
|  |  * Do Not Call list compliance                                      |   |
|  |  * Relevant for outbound campaigns (Contact Center)                |   |
|  |                                                                       |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  STATE REGULATIONS:                                                        |
|  ==================                                                        |
|                                                                             |
|  +-------------------------+--------------------------------------------+ |
|  | State                   | Key Requirements                            | |
|  +-------------------------+--------------------------------------------+ |
|  | New Jersey              | Two-party consent for recording            | |
|  |                         | (business exception may apply)             | |
|  | Texas (Dallas)          | One-party consent for recording            | |
|  | California (CCPA)       | Privacy rights (if CA residents served)   | |
|  +-------------------------+--------------------------------------------+ |
|                                                                             |
|  E911 COMPLIANCE (CRITICAL):                                               |
|  ===========================                                               |
|                                                                             |
|  Kari's Law Requirements:                                                  |
|  * Direct 911 dialing (no prefix required)                                |
|  * Automatic notification to on-site security desk                        |
|                                                                             |
|  RAY BAUM's Act Requirements:                                              |
|  * Dispatchable location (street address + floor/room)                    |
|  * Location must be updated for nomadic users                             |
|                                                                             |
|  Webex Calling E911 Implementation:                                        |
|  * RedSky (now Intrado) E911 integration via CCPP                        |
|  * HELD+ protocol for dynamic location                                    |
|  * Notification via email to designated recipients                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.5.2 Americas PSTN & E911 Configuration

```
+-----------------------------------------------------------------------------+
|              AMERICAS PSTN & E911 - ABHAVTECH                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PSTN CONNECTIVITY:                                                        |
|  ==================                                                        |
|                                                                             |
|  Method: Cloud Connected PSTN (CCPP)                                      |
|  Provider: IntelePeer                                                      |
|  Local Gateway: NOT REQUIRED                                               |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  | Location      | DIDs              | Main Number     | DID Range    |   |
|  +---------------+-------------------+-----------------+--------------+   |
|  | New Jersey    | +1-201-XXX-XXXX   | +1-201-496-1000 | 350 DIDs     |   |
|  | Dallas        | +1-214-XXX-XXXX   | +1-214-496-2000 | 180 DIDs     |   |
|  +---------------+-------------------+-----------------+--------------+   |
|                                                                             |
|  E911 CONFIGURATION:                                                       |
|  ===================                                                       |
|                                                                             |
|           +-----------------+                                              |
|           |  Webex User     |                                              |
|           |  Dials 911      |                                              |
|           +--------+--------+                                              |
|                    |                                                        |
|                    v                                                        |
|           +-----------------+                                              |
|           |  Webex Calling  |                                              |
|           |  (US Region)    |                                              |
|           +--------+--------+                                              |
|                    |                                                        |
|        +-----------+-----------+                                           |
|        |                       |                                           |
|        v                       v                                           |
| +-----------------+   +-----------------+                                 |
| | E911 Provider   |   | Notification    |                                 |
| | (Intrado/RedSky)|   | Service         |                                 |
| |                 |   |                 |                                 |
| | * Location DB   |   | * Email alert   |                                 |
| | * PSAP routing  |   | * Security desk |                                 |
| | * ALI delivery  |   | * Designated    |                                 |
| |                 |   |   responders    |                                 |
| +--------+--------+   +-----------------+                                 |
|          |                                                                  |
|          v                                                                  |
| +-----------------+                                                        |
| | Local PSAP      |                                                        |
| | (911 Center)    |                                                        |
| +-----------------+                                                        |
|                                                                             |
|  E911 LOCATION REQUIREMENTS:                                               |
|  ===========================                                               |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  | User Type          | Location Method        | Update Requirement   |   |
|  +--------------------+------------------------+----------------------+   |
|  | Office (Static)    | Pre-configured address | At provisioning      |   |
|  | Floor/Room         | Emergency Location ID  | Per location change  |   |
|  | Remote Worker      | User self-service      | At each new location |   |
|  | Mobile User        | Dynamic (HELD+)        | Automatic            |   |
|  +--------------------+------------------------+----------------------+   |
|                                                                             |
|  E911 NOTIFICATION RECIPIENTS:                                             |
|  =============================                                             |
|                                                                             |
|  New Jersey Office:                                                        |
|  * Security Desk: security-nj@abhavtech.com                               |
|  * Facilities Manager: facilities-nj@abhavtech.com                        |
|                                                                             |
|  Dallas Office:                                                            |
|  * Security Desk: security-dal@abhavtech.com                              |
|  * Office Manager: office-dal@abhavtech.com                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.5.3 STIR/SHAKEN Compliance

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| Caller ID Authentication | IntelePeer A-attestation | OK Compliant |
| Certificate Authority | Approved by STI-GA | OK Provider |
| Outbound Calls | Full attestation signed | OK Automatic |
| Inbound Calls | Verification displayed | OK Webex app |
| Robocall Mitigation | IntelePeer registered | OK Provider |

---

## 4.6 Recording & Consent by Region

### 4.6.1 Recording Consent Matrix

```
+-----------------------------------------------------------------------------+
|              CALL RECORDING CONSENT REQUIREMENTS - ABHAVTECH                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGION         CONSENT TYPE      IMPLEMENTATION                           |
|  ======         ============      ==============                           |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                       |   |
|  |  INDIA                                                               |   |
|  |  -----                                                                |   |
|  |  Consent: ONE-PARTY (implied for business)                          |   |
|  |  Legal Basis: IT Act 2000, Contract Act                             |   |
|  |  Implementation:                                                     |   |
|  |  * Enterprise Calling: Recording without announcement (internal)    |   |
|  |  * Contact Center: Announcement required (customer calls)           |   |
|  |  * Announcement: "This call may be recorded for quality purposes"   |   |
|  |                                                                       |   |
|  |  UK                                                                  |   |
|  |  --                                                                   |   |
|  |  Consent: TWO-PARTY (with business exception)                       |   |
|  |  Legal Basis: UK GDPR, Regulation of Investigatory Powers           |   |
|  |  Implementation:                                                     |   |
|  |  * Enterprise Calling: Notification to all parties                  |   |
|  |  * Contact Center: IVR announcement before agent connect            |   |
|  |  * Announcement: "Calls are recorded for training and compliance"   |   |
|  |                                                                       |   |
|  |  GERMANY (EU)                                                        |   |
|  |  ------------                                                         |   |
|  |  Consent: TWO-PARTY (EXPLICIT)                                      |   |
|  |  Legal Basis: GDPR Art. 6, BDSG, TKG                                |   |
|  |  Implementation:                                                     |   |
|  |  * Enterprise Calling: Explicit consent required (rare use case)   |   |
|  |  * Contact Center: IVR with consent collection                      |   |
|  |  * Announcement + Consent: "Press 1 to consent to recording"        |   |
|  |  * Works Council: Consultation completed                            |   |
|  |                                                                       |   |
|  |  US (New Jersey)                                                     |   |
|  |  ---------------                                                      |   |
|  |  Consent: TWO-PARTY (all-party consent state)                       |   |
|  |  Legal Basis: NJ Wiretapping Act                                    |   |
|  |  Implementation:                                                     |   |
|  |  * Announcement to all parties before recording                     |   |
|  |  * Announcement: "This call is being recorded"                      |   |
|  |                                                                       |   |
|  |  US (Texas - Dallas)                                                 |   |
|  |  -------------------                                                  |   |
|  |  Consent: ONE-PARTY                                                 |   |
|  |  Legal Basis: Texas Penal Code                                      |   |
|  |  Implementation:                                                     |   |
|  |  * Recording permitted with one party's consent                    |   |
|  |  * Best practice: Announce anyway for consistency                   |   |
|  |                                                                       |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  [!]️ ABHAVTECH POLICY: Announce recording on ALL customer-facing calls    |
|     regardless of jurisdiction to ensure compliance and consistency.       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.6.2 Recording Architecture

```
+-----------------------------------------------------------------------------+
|              RECORDING ARCHITECTURE - ABHAVTECH                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  WEBEX CALLING RECORDING:                                                  |
|  =========================                                                 |
|                                                                             |
|  Recording Type: Cloud-based (Webex native)                               |
|  Storage: Regional (APAC for India, UK for UK, EU for Germany, US for US) |
|  Retention: 90 days (configurable)                                        |
|  Format: MP3 (audio)                                                       |
|  Access: Control Hub -> Recording Management                               |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  | Feature               | Calling Recording    | CC Recording         |   |
|  +-----------------------+----------------------+----------------------+   |
|  | Platform              | Webex Calling        | Webex Contact Center |   |
|  | Trigger               | Policy-based/On-demand| Always-on (queue)   |   |
|  | Storage Location      | Regional DC          | Regional DC          |   |
|  | Retention             | 90 days              | 90 days (WFO add-on) |   |
|  | Screen Recording      | Not available        | Optional (50 agents) |   |
|  | Quality Management    | Basic                | Full QM suite        |   |
|  | Transcription         | Not included         | Add-on available     |   |
|  | Search                | Metadata only        | Full-text (transcript)|   |
|  | Export                | Manual               | Bulk export API      |   |
|  | Legal Hold            | Via Compliance Officer| Native capability   |   |
|  +-----------------------+----------------------+----------------------+   |
|                                                                             |
|  RECORDING POLICY BY REGION:                                               |
|  ============================                                              |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  | Region      | Enterprise Calls  | Contact Center    | Announcement |   |
|  +-------------+-------------------+-------------------+--------------+   |
|  | India       | Selective         | 100% recorded     | CC only      |   |
|  | UK          | Selective         | 100% recorded     | All calls    |   |
|  | Germany     | Disabled          | Consent-based     | All + opt-in |   |
|  | US (NJ)     | Selective         | 100% recorded     | All calls    |   |
|  | US (TX)     | Selective         | 100% recorded     | All calls    |   |
|  +-------------+-------------------+-------------------+--------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 4.6.3 Recording Announcement Prompts

**Standard Prompts by Region:**

| Region | Language | Prompt Text | Duration |
|--------|----------|-------------|----------|
| India | English | "This call may be recorded for quality and training purposes." | 4 sec |
| India | Hindi | "यह कॉल गुणवत्ता और प्रशिक्षण उद्देश्यों के लिए रिकॉर्ड की जा सकती है।" | 5 sec |
| UK | English | "Calls are recorded for training, quality and compliance purposes." | 4 sec |
| Germany | German | "Dieser Anruf wird zu Schulungs- und Qualitätszwecken aufgezeichnet. Drücken Sie 1, um zuzustimmen." | 7 sec |
| US | English | "This call is being recorded." | 2 sec |

---

## Chapter 4 Summary

### Key Compliance Decisions

| Decision Area | Selection | Rationale |
|---------------|-----------|-----------|
| **India PSTN** | Local Gateway per telecom circle | DoT/TRAI toll bypass compliance |
| **India WFH** | ITN Numbers | Toll bypass exempt, flexible |
| **UK/EU PSTN** | CCPP (No LGW) | No toll bypass requirement |
| **US PSTN** | CCPP with E911 | Kari's Law/RAY BAUM's compliance |
| **Authentication** | Azure AD SAML SSO + MFA | Enterprise security standard |
| **Data Residency** | Regional calling regions | GDPR, UK GDPR, India preference |
| **Recording** | Regional announcement policy | Consent law compliance |

### Cross-Reference Matrix

| This Chapter Section | Related Chapter | Related Section |
|---------------------|-----------------|-----------------|
| 4.1.2 Authentication | Chapter 2 | 2.1.1 Platform Selection |
| 4.3.2 Toll Bypass | Chapter 2 | 2.3.2 Local Gateway Design |
| 4.3.3 Zone/Edge Mapping | Chapter 2 | 2.2.2 India Location Design |
| 4.4.3 EMEA Data Residency | Chapter 2 | 2.1.3 Data Residency |
| 4.5.2 E911 Configuration | Chapter 2 | 2.4.4 Emergency Calling |
| 4.6 Recording Consent | Chapter 3 | 3.6 Recording Design |

---

## Chapter 4 Appendix

### Template 4.A: Compliance Validation Checklist

| Compliance Area | Requirement | Validated | Date | Notes |
|-----------------|-------------|-----------|------|-------|
| **India** |||||
| | Zone-to-Edge mapping correct | [ ] | | |
| | All users have local DIDs | [ ] | | |
| | LGW per telecom circle deployed | [ ] | | |
| | Toll bypass test passed | [ ] | | |
| | Emergency (112) routing verified | [ ] | | |
| **UK** |||||
| | UK calling region assigned | [ ] | | |
| | CCPP provider active | [ ] | | |
| | Emergency (999) routing verified | [ ] | | |
| | Recording announcement enabled | [ ] | | |
| **EU (Germany)** |||||
| | EU calling region assigned | [ ] | | |
| | BSI C5 documentation obtained | [ ] | | |
| | Recording consent flow tested | [ ] | | |
| | Works council approval obtained | [ ] | | |
| **US** |||||
| | E911 locations configured | [ ] | | |
| | Notification recipients set | [ ] | | |
| | STIR/SHAKEN attestation verified | [ ] | | |
| | Recording announcement enabled | [ ] | | |

### Template 4.B: Data Residency Verification

| User Location | Expected Calling Region | Expected Data Center | Verified | Notes |
|---------------|------------------------|---------------------|----------|-------|
| Mumbai | India | Mumbai + Chennai | [ ] | |
| Chennai | India | Mumbai + Chennai | [ ] | |
| Bangalore | India | Mumbai + Chennai | [ ] | |
| Delhi | India | Mumbai + Chennai | [ ] | |
| Noida | India | Mumbai + Chennai | [ ] | |
| Pune | India | Mumbai + Chennai | [ ] | |
| Hyderabad | India | Mumbai + Chennai | [ ] | |
| London | UK | UK (London/Manchester) | [ ] | |
| Frankfurt | EU | EU (Frankfurt/Amsterdam) | [ ] | |
| New Jersey | US | US | [ ] | |
| Dallas | US | US | [ ] | |

### Template 4.C: India Toll Bypass Audit Log

| Date | User | Source Zone | Destination Number | Expected Edge | Actual Edge | Compliant |
|------|------|-------------|-------------------|---------------|-------------|-----------|
| | | | | | | [ ] |
| | | | | | | [ ] |
| | | | | | | [ ] |

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 1, Section 1.1 | Site Inventory (User counts, locations) |
| Chapter 2, Section 2.1.3 | Data Residency Architecture |
| Chapter 2, Section 2.2.2 | India Location Design |
| Chapter 2, Section 2.3.2 | Local Gateway Design |
| Chapter 2, Section 2.4.4 | Emergency Calling Design |
| Chapter 3, Section 3.6 | Contact Center Recording Design |
| Cisco Help | https://help.webex.com/en-us/article/7q0b45 (India Calling) |
| Cisco Help | https://help.webex.com/en-us/article/nmhjfvi (ITN Numbers) |
| Cisco Help | https://help.webex.com/en-us/article/np2csyb (EMEA Data Centers) |
| Cisco Help | https://help.webex.com/en-US/article/oybc4fb (Data Residency) |
| Cisco Trust Portal | https://trustportal.cisco.com (Compliance Certifications) |

---

*End of Chapter 4: Security, Compliance & Data Residency*

---
