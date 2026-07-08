# Chapter 6: Webex Contact Center Implementation -- 6.1 Pre-Implementation Setup

## 6.1 Pre-Implementation Setup

## 6.1.1 Prerequisites Checklist

```
+-----------------------------------------------------------------------------+
|              WXCC TENANT SETUP - PREREQUISITES                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [ ] Phase 1 Webex Calling operational (Chapter 5 complete)                |
|  [ ] Control Hub Full Administrator access                                  |
|  [ ] WxCC licenses procured and assigned to organization                   |
|  [ ] Azure AD SSO configured (from Phase 1)                                |
|  [ ] Network connectivity validated per Chapter 5                          |
|  [ ] Salesforce Connected App OAuth configured                             |
|  [ ] Google Cloud Project created (for Dialogflow CX)                      |
|  [ ] India DC enabled for data residency compliance                        |
|                                                                             |
|  [!]️ CRITICAL: Do NOT proceed until Phase 1 Webex Calling is operational   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.1.2 Control Hub - Contact Center Activation

### Step-by-Step Procedure

**Step 1: Access Control Hub**

1. Navigate to: `admin.webex.com`
2. Login with Full Administrator credentials
3. Verify organization: **Abhavtech.com**

**Step 2: Activate Contact Center Service**

1. Navigate to: **Services** -> **Contact Center**
2. If not activated, click **"Set Up Contact Center"**
3. Select Platform: **Webex Contact Center (Next Generation)**
4. Select Region: **India** (for data residency compliance)
5. Confirm activation

**Step 3: Verify Activation Status**

```
+-----------------------------------------------------------------------------+
|  Expected Status After Activation:                                         |
|  ---------------------------------                                         |
|  Service Status:       Active                                              |
|  Data Center:          India DC (ap-south-1)                              |
|  Provisioning Status:  Complete                                            |
|  Org ID:               [Auto-generated]                                    |
+-----------------------------------------------------------------------------+
```

## 6.1.3 License Allocation (Per Chapter 3.2.3)

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH WXCC LICENSE ALLOCATION                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  LICENSE TYPE           | QUANTITY | ASSIGNMENT                            |
|  -----------------------+----------+---------------------------------------|
|  Standard Agent         |      100 | Voice-only agents                     |
|  Premium Agent          |       75 | Voice + Digital agents                |
|  Supervisor             |       10 | Team supervisors                      |
|  Webex AI Agent         |        1 | Virtual Agent "Abhi"                  |
|  Agent Assist           |      175 | Included with Premium (all agents)    |
|  WFO Recording          |      175 | All agents (compliance)               |
|  WFO Quality Management |       50 | Evaluation sample                     |
|  WFO Workforce Mgmt     |      175 | All agents (scheduling)               |
|  -----------------------+----------+---------------------------------------|
|                                                                             |
|  LICENSE DISTRIBUTION BY SITE:                                             |
|  -----------------------------                                             |
|  Mumbai HQ:   80 Standard + 40 Premium = 120 agents                       |
|  Chennai:     15 Standard + 15 Premium = 30 agents                        |
|  London:       5 Standard + 10 Premium = 15 agents                        |
|  New Jersey:   0 Standard + 10 Premium = 10 agents                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### License Assignment Procedure

**Navigation:** Control Hub -> Users -> [User] -> Services -> Contact Center

1. Select user to license
2. Enable **Contact Center** service
3. Select License Type: **Standard** or **Premium**
4. Click **Save**

> **💡 TIP:** Use bulk CSV upload for 175 agents - see Section 6.6.3

## 6.1.4 Security Baseline Configuration

### 6.1.4.1 Administrator Roles

**Navigation:** Control Hub -> Users -> Roles

```
+-----------------------------------------------------------------------------+
|              WXCC ADMINISTRATOR ROLES                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ROLE                         | PERMISSIONS                    | ASSIGNEES |
|  -----------------------------+--------------------------------+-----------|
|  Full Administrator           | All Control Hub + Contact Ctr  |     3     |
|  Contact Center Administrator | CC provisioning only           |     2     |
|  Contact Center Supervisor    | Monitoring, team management    |    10     |
|  Read-Only Administrator      | View settings, no changes      |     2     |
|  -----------------------------+--------------------------------+-----------|
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 6.1.4.2 Security Settings

**Navigation:** Control Hub -> Settings -> Security

| Setting | Configuration | Notes |
|---------|--------------|-------|
| SSO | Azure AD SAML (from Phase 1) | Mandatory for compliance |
| Session Timeout (Agent Desktop) | 8 hours | Agent shift duration |
| Session Timeout (Admin Portal) | 4 hours | Security best practice |
| IP Restrictions | Enable for Admin access | Corporate IP ranges only |
| Audit Logging | Enable all actions | Required for compliance |
| API Access | OAuth 2.0 only | Disable basic auth |

### 6.1.4.3 Data Residency Configuration

**Navigation:** Control Hub -> Organization Settings -> Data Residency

```
+-----------------------------------------------------------------------------+
|              DATA RESIDENCY CONFIGURATION                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGION        | DATA CENTER      | RECORDING STORAGE | COMPLIANCE         |
|  --------------+------------------+-------------------+--------------------|
|  India/APAC    | India DC         | India DC          | DoT/TRAI, OSP      |
|  UK            | UK DC (London)   | UK DC             | UK GDPR            |
|  EU            | EU DC (Frankfurt)| EU DC             | EU GDPR, BSI C5    |
|  Americas      | US DC            | US DC             | US regulations     |
|  --------------+------------------+-------------------+--------------------|
|                                                                             |
|  [!]️ CRITICAL: India data MUST reside in India DC for DoT/TRAI compliance |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
