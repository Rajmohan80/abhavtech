# Chapter 2: Webex Calling Design -- 2.1 Webex Calling Architecture Overview

## 2.1 Webex Calling Architecture Overview

### 2.1.1 Multi-Tenant Platform Selection

Abhavtech.com will deploy **Webex Calling Multi-Tenant (MT)** platform, the standard cloud calling solution for enterprise deployments.

```
+-----------------------------------------------------------------------------+
|              WEBEX CALLING PLATFORM COMPARISON                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +-------------------------+         +-------------------------+           |
|  |  WEBEX CALLING MT       |         |  DEDICATED INSTANCE     |           |
|  |  (Multi-Tenant)         |         |  (Single-Tenant)        |           |
|  +-------------------------+         +-------------------------+           |
|  |  [OK] Cloud-native         |         |  [OK] Isolated instance    |           |
|  |  [OK] Shared infrastructure|         |  [OK] Dedicated resources  |           |
|  |  [OK] Automatic updates    |         |  [OK] Custom configuration |           |
|  |  [OK] Regional data centers|         |  [OK] SLA guarantees       |           |
|  |  [OK] Standard features    |         |  [OK] Large enterprise     |           |
|  |                         |         |                         |           |
|  |  Best for: 100-50K users|         |  Best for: 50K+ users   |           |
|  |  ----------------------|         |  ----------------------|           |
|  |  * ABHAVTECH SELECTION  |         |                         |           |
|  +-------------------------+         +-------------------------+           |
|                                                                             |
|  SELECTION RATIONALE:                                                      |
|  * 4,200 users (within MT scale limits)                                    |
|  * Multi-region deployment (APAC/UK/EU/US)                                 |
|  * Standard feature requirements                                           |
|  * Cloud-native management via Control Hub                                 |
|  * Cost-effective licensing model                                          |
|                                                                             |
+-----------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------+
|              ABHAVTECH CALLING REGION ASSIGNMENT                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|                        +----------------------+                             |
|                        |   WEBEX CONTROL HUB  |                             |
|                        |   (admin.webex.com)  |                             |
|                        +----------+-----------+                             |
|                                   |                                         |
|        +--------------------------+--------------------------=             |
|        |                          |                          |             |
|        v                          v                          v             |
|  +---------------+         +---------------+         +---------------+     |
|  |  APAC REGION  |         |   UK REGION   |         |  EU REGION    |     |
|  |  -----------  |         |  -----------  |         |  -----------  |     |
|  |  Home Region  |         |  Separate     |         |  Separate     |     |
|  |               |         |  Post-Brexit  |         |  GDPR         |     |
|  +---------------+         +---------------+         +---------------+     |
|  | * Mumbai HQ   |         | * London      |         | * Frankfurt   |     |
|  | * Chennai     |         |               |         |               |     |
|  | * Bangalore   |         | Users: 520    |         | Users: 280    |     |
|  | * Delhi       |         |               |         |               |     |
|  | * Noida       |         +---------------+         +---------------+     |
|  | * Pune        |                                                         |
|  | * Hyderabad   |         +---------------+                               |
|  |               |         |  US REGION    |                               |
|  | Users: 2,400  |         |  -----------  |                               |
|  | (India)       |         |  Americas     |                               |
|  +---------------+         +---------------+                               |
|                            | * New Jersey  |                               |
|                            | * Dallas      |                               |
|                            |               |                               |
|                            | Users: 750    |                               |
|                            +---------------+                               |
|                                                                             |
|  [!]️  CRITICAL: Home region (APAC) is set during first location creation    |
|      and CANNOT be changed. All signaling routes to home region.           |
|                                                                             |
+-----------------------------------------------------------------------------+
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
+-----------------------------------------------------------------------------+
|              WEBEX CALLING DATA RESIDENCY ARCHITECTURE                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DATA TYPE                    STORAGE LOCATION                              |
|  =========                    ================                              |
|                                                                             |
|  +---------------------+      +-----------------------------------------+  |
|  | Signaling Data      | ---> | Home Region Data Center (Mumbai + Chennai DCs)    |  |
|  | * Call setup/teardown|      | * All control plane signaling          |  |
|  | * Presence          |      | * User provisioning data               |  |
|  | * Configuration     |      | * Organization settings                |  |
|  +---------------------+      +-----------------------------------------+  |
|                                                                             |
|  +---------------------+      +-----------------------------------------+  |
|  | Media Data          | ---> | Regional Media POPs                    |  |
|  | * Voice RTP streams |      | * Mumbai + Chennai DCs (India calls)              |  |
|  | * Audio packets     |      | * London (UK calls)                    |  |
|  |                     |      | * Frankfurt (EU calls)                 |  |
|  |                     |      | * US POPs (Americas calls)             |  |
|  +---------------------+      +-----------------------------------------+  |
|                                                                             |
|  +---------------------+      +-----------------------------------------+  |
|  | CDR/Analytics       | ---> | Regional Processing                    |  |
|  | * Call detail records|      | * GDPR: EU-processed for EU users     |  |
|  | * Quality metrics   |      | * UK: UK-processed for UK users       |  |
|  | * Usage reports     |      | * India: Mumbai DC-processed          |  |
|  +---------------------+      +-----------------------------------------+  |
|                                                                             |
|  +---------------------+      +-----------------------------------------+  |
|  | Voicemail           | ---> | Webex Cloud (Regional)                 |  |
|  | * Message storage   |      | * 100MB per user standard              |  |
|  | * Transcriptions    |      | * Regional storage compliance          |  |
|  +---------------------+      +-----------------------------------------+  |
|                                                                             |
|  COMPLIANCE MAPPING:                                                       |
|  -------------------                                                       |
|  India   -> Mumbai + Chennai DCs (APAC) -> DoT/TRAI compliant                       |
|  UK      -> London/Manchester DC -> UK GDPR, Cyber Essentials               |
|  Germany -> Frankfurt/Amsterdam DC -> EU GDPR, BSI C5, Cloud CoC L3         |
|  Americas-> US Data Centers -> SOC2, ISO27001                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 2.1.4 Media POPs & Edge Locations

Webex Calling optimizes media quality using regional Points of Presence (POPs) for media relay while maintaining signaling through the home region.

```
+-----------------------------------------------------------------------------+
|              WEBEX MEDIA POP ARCHITECTURE - ABHAVTECH                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|                      +----------------------------+                         |
|                      |    WEBEX CLOUD CORE        |                         |
|                      |    Mumbai + Chennai DCs (Home)        |                         |
|                      |    * User provisioning     |                         |
|                      |    * Call signaling        |                         |
|                      |    * Configuration         |                         |
|                      +------------+---------------+                         |
|                                   |                                         |
|      +----------------------------+----------------------------=           |
|      |                            |                            |           |
|      v                            v                            v           |
|  +------------+             +------------+             +------------+      |
|  | APAC POPs  |             | EMEA POPs  |             |  US POPs   |      |
|  +------------+             +------------+             +------------+      |
|  | Mumbai+Chennai |             | London     |             | Ashburn    |      |
|  | Mumbai     |             | Frankfurt  |             | Dallas     |      |
|  | Chennai    |             | Amsterdam  |             | San Jose   |      |
|  | Hong Kong  |             | Manchester |             | Chicago    |      |
|  +-----+------+             +-----+------+             +-----+------+      |
|        |                          |                          |             |
|        v                          v                          v             |
|  +----------------+        +----------------+        +----------------+   |
|  | India Sites    |        | EMEA Sites     |        | Americas Sites |   |
|  | -------------- |        | -------------- |        | -------------- |   |
|  | Mumbai HQ      |        | London         |        | New Jersey     |   |
|  | Chennai        |        | Frankfurt      |        | Dallas         |   |
|  | Bangalore      |        |                |        |                |   |
|  | Delhi/Noida    |        |                |        |                |   |
|  | Pune/Hyderabad |        |                |        |                |   |
|  +----------------+        +----------------+        +----------------+   |
|                                                                             |
|  MEDIA OPTIMIZATION:                                                       |
|  * Signaling: Always via Mumbai + Chennai DCs (home region)                           |
|  * Media: Via nearest regional POP                                         |
|  * ICE negotiation selects optimal media path                              |
|  * SRTP encryption end-to-end                                              |
|                                                                             |
+-----------------------------------------------------------------------------+
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
