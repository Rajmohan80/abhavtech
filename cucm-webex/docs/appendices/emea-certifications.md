# EMEA Certifications & Compliance

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

