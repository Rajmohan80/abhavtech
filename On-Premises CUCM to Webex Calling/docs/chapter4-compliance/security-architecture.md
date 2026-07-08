# Security Architecture

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

