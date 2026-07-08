# Appendix 10E: Step-by-Step Configuration Procedures 

> **Document Reference:** ABV-COLLAB-MIG-2026 | Appendix 10E
> **Cross-References:** Chapter 4 (Security), Chapter 6 (Implementation), Chapter 7 (Migration)
> **Style:** Click-by-Click Procedures (Sonnet 4.5)
> **Applicability:** Abhavtech Infrastructure (Azure AD, On-Prem AD, CUCM, Unity Connection)

---

## Applicability Matrix

This appendix covers identity and directory integration procedures applicable to Abhavtech's specific infrastructure. Topics not applicable to Abhavtech (Expressway, Jabber, On-Prem Exchange) are excluded.

| Topic | Applicable | Rationale |
|-------|------------|-----------|
| Cisco Directory Connector | [OK] Yes | On-prem AD requires sync to Webex Cloud |
| Azure AD SCIM Provisioning | [OK] Yes | Azure AD is Abhavtech's IdP |
| SSO Configuration (Webex + Azure) | [OK] Yes | Core authentication method |
| Cloud-Connected UC Directory | [OK] Yes | Enables CUCM coexistence features |
| Personal Contacts Migration | [OK] Yes | Speed dials from CUCM phones |
| Unity Connection Integration | [OK] Yes | Voicemail during/after migration |
| Expressway / Jabber | [X] No | Not in Abhavtech infrastructure |
| Hybrid Calendar (On-Prem Exchange) | [X] No | M365 cloud assumed |

---

## Table of Contents

**Part 1: Directory Integration**
- 10E.1 Cisco Directory Connector Installation
- 10E.2 Directory Connector - User Synchronization
- 10E.3 Directory Connector - Group Sync & License Assignment
- 10E.4 Cloud-Connected UC Directory Service

**Part 2: Identity & SSO Configuration**
- 10E.5 Azure AD SCIM Provisioning for Webex
- 10E.6 SSO Configuration - Webex Control Hub + Azure Entra ID
- 10E.7 Control Hub + Azure Entra ID Wizard

**Part 3: User Data Migration**
- 10E.8 Personal Contacts Migration to Webex App
- 10E.9 Speed Dial Migration from CUCM
- 10E.10 Unity Connection Voicemail Integration

---

## Part 1: Directory Integration 

## 10E.1 Cisco Directory Connector Installation

### Purpose
Cisco Directory Connector synchronizes on-premises Active Directory users and groups to Webex Cloud, enabling automated user provisioning and license assignment.

### Prerequisites

| Prerequisite | Abhavtech Status | Verification |
|--------------|------------------|--------------|
| Windows Server 2016+ (VM or physical) | Required | Dedicated server provisioned |
| .NET Framework 4.6.2+ | Required | `Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full'` |
| Network access to AD domain controllers | Required | Port 389/636 to DCs |
| Network access to Webex Cloud | Required | HTTPS 443 to cloudconnector.webex.com |
| AD service account with read permissions | Required | Created: svc-webex-dircon@abhavtech.com |
| Webex Control Hub full admin account | Required | Admin access confirmed |

### Step 1: Download Directory Connector

```
1. Login to Control Hub
   URL: https://admin.webex.com
   User: admin@abhavtech.com

2. Navigate to Directory Connector download
   Path: Users > Manage Users > Directory Integration
   
3. Click "Set Up" under Directory Connector section

4. Click "Download and Install"
   File: CiscoDirectoryConnector_x64.msi
   Size: ~150 MB

5. Transfer installer to Windows Server
   Server: ABV-DIRCON-01.corp.abhavtech.com
```

### Step 2: Install Directory Connector

```
1. Right-click installer > Run as Administrator

2. Installation Wizard:
   a. Welcome screen > Click "Next"
   
   b. License Agreement:
      - Read terms
      - Select "I accept..."
      - Click "Next"
   
   c. Destination Folder:
      - Default: C:\Program Files\Cisco Systems\Cisco Directory Connector
      - Click "Next"
   
   d. Proxy Settings (if applicable):
      - If direct internet: Select "No proxy"
      - If proxy required:
        - Server: proxy.abhavtech.com
        - Port: 8080
        - Authentication: Use service account if required
      - Click "Next"
   
   e. Click "Install"
   
   f. Wait for installation (~2-3 minutes)
   
   g. Check "Launch Cisco Directory Connector"
   
   h. Click "Finish"
```

### Step 3: Activate Directory Connector

```
1. Directory Connector launches automatically

2. Sign In prompt:
   a. Click "Sign In"
   b. Browser opens to Webex authentication
   c. Enter admin@abhavtech.com
   d. Complete MFA if prompted
   e. Authorize Directory Connector access
   f. Browser shows "Authorization successful"
   g. Return to Directory Connector application

3. Connector now shows "Connected to Webex"

4. Verify in Control Hub:
   Path: Users > Manage Users > Directory Integration
   Status: Should show connector registered
   Server: ABV-DIRCON-01.corp.abhavtech.com
```

### Step 4: Configure Active Directory Connection

```
1. In Directory Connector, click "Configuration"

2. Active Directory Settings:
   
   Domain Configuration:
   +-------------------------------------------------------------+
   |  Domain: corp.abhavtech.com                                 |
   |                                                             |
   |  Authentication:                                            |
   |  O Current Windows User                                     |
   |  * Service Account                                          |
   |                                                             |
   |  Username: svc-webex-dircon@corp.abhavtech.com             |
   |  Password: ********************************                 |
   |                                                             |
   |  [Test Connection]                                          |
   +-------------------------------------------------------------+

3. Click "Test Connection"
   Expected: "Connection successful"

4. Click "Save"
```

### Step 5: Configure User Selection (OU Filtering)

```
1. Click "Object Selection" tab

2. User Selection:
   
   +-------------------------------------------------------------+
   |  SELECT OUs TO SYNCHRONIZE                                  |
   |                                                             |
   |  [x] corp.abhavtech.com                                       |
   |    +- [x] Users                                               |
   |    |    +- [x] Mumbai                                         |
   |    |    +- [x] Chennai                                        |
   |    |    +- [x] Bangalore                                      |
   |    |    +- [x] Delhi                                          |
   |    |    +- [x] London                                         |
   |    |    +- [x] Frankfurt                                      |
   |    |    +- [x] NewJersey                                      |
   |    |    +- [x] Dallas                                         |
   |    +- [ ] Service Accounts (exclude)                          |
   |    +- [ ] Disabled Users (exclude)                            |
   |    +- [ ] Test Accounts (exclude)                             |
   |                                                             |
   +-------------------------------------------------------------+

3. User Count Preview:
   - Click "Preview" to see user count
   - Expected: ~3,200 users (matches Webex Calling license count)

4. Click "Save"
```

### Step 6: Configure Attribute Mapping

```
1. Click "Attribute Mapping" tab

2. Verify default mappings:

   +-------------------------------------------------------------+
   |  ATTRIBUTE MAPPING                                          |
   |                                                             |
   |  AD Attribute          ->  Webex Attribute                   |
   |  ---------------------------------------------              |
   |  mail                  ->  email (PRIMARY KEY)               |
   |  displayName           ->  displayName                       |
   |  givenName             ->  firstName                         |
   |  sn                    ->  lastName                          |
   |  telephoneNumber       ->  workPhone                         |
   |  mobile                ->  mobilePhone                       |
   |  title                 ->  title                             |
   |  department            ->  department                        |
   |  physicalDeliveryOffice->  location                          |
   |  manager               ->  manager                           |
   |  thumbnailPhoto        ->  avatar                            |
   |                                                             |
   |  [!]️ Ensure 'mail' attribute is populated for all users     |
   |                                                             |
   +-------------------------------------------------------------+

3. Custom Attribute (Extension Number):
   - Click "Add Custom Attribute"
   - AD Attribute: extensionAttribute1
   - Webex Attribute: externalId
   - Purpose: Store CUCM extension for migration reference

4. Click "Save"
```

---

## 10E.2 Directory Connector - User Synchronization

### Step 1: Perform Dry Run

```
1. In Directory Connector, click "Synchronization"

2. Click "Dry Run"
   - This simulates sync without making changes

3. Review Dry Run Results:
   
   +-------------------------------------------------------------+
   |  DRY RUN RESULTS                                            |
   |                                                             |
   |  Users to Add:      3,185                                   |
   |  Users to Update:   0                                       |
   |  Users to Delete:   0                                       |
   |  Errors:            15 (review below)                       |
   |                                                             |
   |  ERRORS:                                                    |
   |  ---------------------------------------------              |
   |  - user1@abhavtech.com: Missing mail attribute              |
   |  - user2@abhavtech.com: Invalid character in email          |
   |  - [13 more...]                                             |
   |                                                             |
   +-------------------------------------------------------------+

4. Fix AD issues before proceeding:
   - Open AD Users and Computers
   - Locate users with errors
   - Populate missing mail attributes
   - Re-run Dry Run until errors = 0
```

### Step 2: Perform Initial Synchronization

```
1. Once Dry Run shows 0 errors, click "Sync Now"

2. Confirm sync dialog:
   "This will synchronize 3,200 users to Webex Cloud. Continue?"
   Click "Yes"

3. Monitor sync progress:
   +-------------------------------------------------------------+
   |  SYNCHRONIZATION IN PROGRESS                                |
   |                                                             |
   |  ####################----------  65%                        |
   |                                                             |
   |  Users Processed: 2,080 / 3,200                             |
   |  Elapsed Time: 12 minutes                                   |
   |  Estimated Remaining: 7 minutes                             |
   |                                                             |
   +-------------------------------------------------------------+

4. Initial sync typically takes 15-30 minutes for 3,200 users
```

### Step 3: Verify Synchronization in Control Hub

```
1. Login to Control Hub
   URL: https://admin.webex.com

2. Navigate: Users > All Users

3. Verify user count matches expected:
   - Total Users: ~3,200
   - Status: "Synced from Directory"

4. Spot check users:
   - Search for "John Smith"
   - Verify attributes: Name, Email, Department, Phone
   - Verify manager hierarchy

5. Check Directory Sync Status:
   Path: Users > Manage Users > Directory Integration
   
   +-------------------------------------------------------------+
   |  DIRECTORY SYNC STATUS                                      |
   |                                                             |
   |  Last Sync: 2026-01-15 14:32 IST                           |
   |  Status: Successful                                         |
   |  Users Synced: 3,200                                        |
   |  Groups Synced: 45                                          |
   |  Next Scheduled: 2026-01-15 18:32 IST (4 hours)            |
   |                                                             |
   +-------------------------------------------------------------+
```

### Step 4: Configure Automatic Sync Schedule

```
1. In Directory Connector, click "Schedule"

2. Configure sync frequency:
   
   +-------------------------------------------------------------+
   |  SYNC SCHEDULE                                              |
   |                                                             |
   |  [x] Enable Automatic Synchronization                         |
   |                                                             |
   |  Frequency: Every [4] hours                                 |
   |                                                             |
   |  Start Time: 06:00 AM                                       |
   |                                                             |
   |  Sync Times: 06:00, 10:00, 14:00, 18:00, 22:00, 02:00      |
   |                                                             |
   |  [x] Send email notification on sync errors                   |
   |  Email: voiceeng@abhavtech.com                              |
   |                                                             |
   +-------------------------------------------------------------+

3. Click "Save"

4. Verify Windows Service is running:
   - Open Services (services.msc)
   - Find "Cisco Directory Connector"
   - Status: Running
   - Startup Type: Automatic
```

---

## 10E.3 Directory Connector - Group Sync & License Assignment

### Purpose
Synchronize AD security groups to Webex and use them for automated license assignment. This eliminates manual license assignment for 3,200 users.

### Step 1: Configure Group Synchronization

```
1. In Directory Connector, click "Groups" tab

2. Enable Group Sync:
   [x] Synchronize Groups

3. Select groups to sync:
   
   +-------------------------------------------------------------+
   |  SELECT AD GROUPS TO SYNCHRONIZE                            |
   |                                                             |
   |  [x] Webex-Calling-Users          (3,200 members)            |
   |  [x] Webex-CC-Agents              (175 members)              |
   |  [x] Webex-Admins                 (15 members)               |
   |  [x] Webex-Mumbai-Site            (1,200 members)            |
   |  [x] Webex-Chennai-Site           (450 members)              |
   |  [x] Webex-London-Site            (380 members)              |
   |  [x] Webex-Frankfurt-Site         (280 members)              |
   |  [x] Webex-NJ-Site                (320 members)              |
   |  [x] Webex-Dallas-Site            (195 members)              |
   |  [x] Webex-Executives             (50 members)               |
   |                                                             |
   +-------------------------------------------------------------+

4. Click "Save" and run sync
```

### Step 2: Verify Groups in Control Hub

```
1. Login to Control Hub
   URL: https://admin.webex.com

2. Navigate: Groups

3. Verify synced groups appear:
   - Webex-Calling-Users (3,200 members)
   - Webex-CC-Agents (175 members)
   - etc.

4. Click on a group to verify membership
```

### Step 3: Configure Automatic License Assignment

```
1. In Control Hub, navigate:
   Path: Users > Licenses > License Templates

2. Click "Create Template"

3. Template 1: Webex Calling Professional
   
   +-------------------------------------------------------------+
   |  LICENSE TEMPLATE: Webex-Calling-Standard                   |
   |                                                             |
   |  Template Name: Abhavtech-Calling-Pro                       |
   |                                                             |
   |  LICENSES TO ASSIGN:                                        |
   |  [x] Webex Calling - Professional                             |
   |  [x] Webex App - Messaging                                    |
   |  [x] Webex Meetings - Basic                                   |
   |  [ ] Webex Contact Center (separate template)                 |
   |                                                             |
   |  APPLY TO GROUP:                                            |
   |  [Webex-Calling-Users]                              [Add]   |
   |                                                             |
   +-------------------------------------------------------------+

4. Click "Save"

5. Template 2: Contact Center Agents
   
   +-------------------------------------------------------------+
   |  LICENSE TEMPLATE: Webex-CC-Premium                         |
   |                                                             |
   |  Template Name: Abhavtech-CC-Premium-Agent                  |
   |                                                             |
   |  LICENSES TO ASSIGN:                                        |
   |  [x] Webex Calling - Professional                             |
   |  [x] Webex Contact Center - Premium Agent                     |
   |  [x] Webex App - Messaging                                    |
   |  [x] Webex WFO - Recording                                    |
   |                                                             |
   |  APPLY TO GROUP:                                            |
   |  [Webex-CC-Agents]                                  [Add]   |
   |                                                             |
   +-------------------------------------------------------------+

6. Click "Save"
```

### Step 4: Verify Automatic License Assignment

```
1. Add test user to AD group:
   - In AD, add "testuser@abhavtech.com" to "Webex-Calling-Users"

2. Wait for next sync (or trigger manual sync)

3. In Control Hub, search for test user

4. Verify licenses assigned automatically:
   +-------------------------------------------------------------+
   |  USER: testuser@abhavtech.com                               |
   |                                                             |
   |  ASSIGNED LICENSES:                                         |
   |  OK Webex Calling - Professional                             |
   |  OK Webex App - Messaging                                    |
   |  OK Webex Meetings - Basic                                   |
   |                                                             |
   |  ASSIGNMENT METHOD: Group (Webex-Calling-Users)             |
   |                                                             |
   +-------------------------------------------------------------+

5. Remove user from group in AD

6. Wait for sync

7. Verify license automatically removed
```

---

## 10E.4 Cloud-Connected UC Directory Service

### Purpose
Cloud-Connected UC (CCUC) enables CUCM to use Webex Cloud for directory services during coexistence, allowing unified directory search across both platforms.

### Prerequisites

| Prerequisite | Status | Verification |
|--------------|--------|--------------|
| CUCM 12.5+ | [OK] CUCM 14.0 | Version verified |
| Webex Cloud Connected UC subscription | Required | Verify in Control Hub |
| CUCM registered to Control Hub | Required | Device Management enabled |

### Step 1: Enable Cloud-Connected UC in Control Hub

```
1. Login to Control Hub
   URL: https://admin.webex.com

2. Navigate: Services > Calling > Cloud-Connected UC

3. Click "Get Started" or "Set Up"

4. Accept Terms of Service

5. Cloud-Connected UC Dashboard appears:
   +-------------------------------------------------------------+
   |  CLOUD-CONNECTED UC                                         |
   |                                                             |
   |  Status: Ready for configuration                            |
   |                                                             |
   |  Available Features:                                        |
   |  [x] Directory Synchronization                                |
   |  [x] Provisioning Service                                     |
   |  [x] Analytics                                                |
   |  [ ] Migration Insights (optional)                            |
   |                                                             |
   +-------------------------------------------------------------+
```

### Step 2: Register CUCM Cluster to Control Hub

```
1. In Control Hub, navigate:
   Path: Services > Connected UC > Call Management

2. Click "Add Cluster"

3. Enter CUCM details:
   
   +-------------------------------------------------------------+
   |  ADD CUCM CLUSTER                                           |
   |                                                             |
   |  Cluster Name: ABV-CUCM-Cluster                             |
   |  Publisher FQDN: cucm-pub.corp.abhavtech.com               |
   |  Publisher IP: 10.1.1.10                                    |
   |                                                             |
   |  AXL Credentials:                                           |
   |  Username: axl-admin                                        |
   |  Password: ********************************                 |
   |                                                             |
   |  [Test Connection]                                          |
   +-------------------------------------------------------------+

4. Click "Test Connection"
   Expected: "Connection successful"

5. Click "Add"

6. CUCM cluster appears in Connected UC:
   +-------------------------------------------------------------+
   |  REGISTERED CLUSTERS                                        |
   |                                                             |
   |  Cluster              Version    Status       Subscribers   |
   |  ---------------------------------------------------------  |
   |  ABV-CUCM-Cluster     14.0.1     Connected    2             |
   |                                                             |
   +-------------------------------------------------------------+
```

### Step 3: Enable Directory Synchronization

```
1. Click on "ABV-CUCM-Cluster"

2. Click "Directory Service" tab

3. Enable Directory Sync:
   
   +-------------------------------------------------------------+
   |  DIRECTORY SERVICE CONFIGURATION                            |
   |                                                             |
   |  [x] Enable Directory Synchronization                         |
   |                                                             |
   |  Sync Direction:                                            |
   |  * CUCM -> Webex Cloud (recommended during migration)        |
   |  O Webex Cloud -> CUCM                                       |
   |  O Bidirectional                                            |
   |                                                             |
   |  Sync Frequency: Every [4] hours                            |
   |                                                             |
   |  Objects to Sync:                                           |
   |  [x] End Users                                                |
   |  [x] Phone Devices                                            |
   |  [ ] Application Users (exclude)                              |
   |                                                             |
   +-------------------------------------------------------------+

4. Click "Save"

5. Click "Sync Now" for initial synchronization
```

### Step 4: Verify Directory Integration

```
1. In Control Hub, navigate:
   Path: Services > Connected UC > Directory

2. Verify synced objects:
   +-------------------------------------------------------------+
   |  DIRECTORY SYNC STATUS                                      |
   |                                                             |
   |  Last Sync: 2026-01-15 15:00 IST                           |
   |  Status: Successful                                         |
   |                                                             |
   |  Objects Synced:                                            |
   |  - End Users: 3,200                                         |
   |  - Phones: 2,450                                            |
   |                                                             |
   +-------------------------------------------------------------+

3. Test directory search from phone:
   - On Webex desk phone, search for CUCM user
   - On CUCM phone, search for Webex user
   - Both should appear in corporate directory
```

---

## Part 2: Identity & SSO Configuration 

## 10E.5 Azure AD SCIM Provisioning for Webex

### Purpose
SCIM (System for Cross-domain Identity Management) enables real-time user provisioning from Azure AD to Webex, complementing Directory Connector for organizations using Azure AD as primary IdP.

### Step 1: Create Enterprise Application in Azure

```
1. Login to Azure Portal
   URL: https://portal.azure.com
   User: admin@abhavtech.onmicrosoft.com

2. Navigate: Azure Active Directory > Enterprise Applications

3. Click "+ New Application"

4. Search: "Cisco Webex"

5. Select "Cisco Webex" from gallery

6. Application Name: Abhavtech-Webex-SCIM

7. Click "Create"
```

### Step 2: Configure SCIM Provisioning

```
1. In Enterprise Application, click "Provisioning"

2. Click "Get Started"

3. Provisioning Mode: Automatic

4. Admin Credentials:
   
   +-------------------------------------------------------------+
   |  ADMIN CREDENTIALS                                          |
   |                                                             |
   |  Tenant URL:                                                |
   |  https://api.ciscospark.com/v1/scim/                       |
   |                                                             |
   |  Secret Token:                                              |
   |  [Obtain from Control Hub - see Step 3]                     |
   |  ________________________________                           |
   |                                                             |
   |  [Test Connection]                                          |
   +-------------------------------------------------------------+
```

### Step 3: Obtain SCIM Token from Control Hub

```
1. Login to Control Hub
   URL: https://admin.webex.com

2. Navigate: Users > Manage Users > Azure AD

3. Click "Set Up" or "Configure"

4. Copy SCIM Bearer Token:
   
   +-------------------------------------------------------------+
   |  SCIM CONFIGURATION                                         |
   |                                                             |
   |  SCIM Base URL:                                             |
   |  https://api.ciscospark.com/v1/scim/                       |
   |                                               [Copy]        |
   |                                                             |
   |  Bearer Token:                                              |
   |  NzY4MjM0YTYtZGM2Mi00MTYyLWE1NGEtODM...                     |
   |                                               [Copy]        |
   |                                                             |
   |  [!]️ Token expires in 365 days. Set reminder to renew.      |
   |                                                             |
   +-------------------------------------------------------------+

5. Return to Azure Portal
   - Paste token in "Secret Token" field
   - Click "Test Connection"
   - Expected: "Credentials authorized successfully"
```

### Step 4: Configure Attribute Mapping

```
1. In Azure Provisioning, expand "Mappings"

2. Click "Provision Azure Active Directory Users"

3. Verify/modify attribute mappings:
   
   +-------------------------------------------------------------+
   |  ATTRIBUTE MAPPINGS                                         |
   |                                                             |
   |  Azure AD Attribute      ->  Webex Attribute                 |
   |  ---------------------------------------------              |
   |  userPrincipalName       ->  userName                        |
   |  mail                    ->  emails[type eq "work"].value    |
   |  displayName             ->  displayName                     |
   |  givenName               ->  name.givenName                  |
   |  surname                 ->  name.familyName                 |
   |  department              ->  urn:scim:...:department         |
   |  jobTitle                ->  title                           |
   |  telephoneNumber         ->  phoneNumbers[type eq "work"]    |
   |  mobile                  ->  phoneNumbers[type eq "mobile"]  |
   |  manager                 ->  urn:scim:...:manager            |
   |                                                             |
   +-------------------------------------------------------------+

4. Click "Save"
```

### Step 5: Configure Scoping Filter

```
1. In Provisioning Settings, click "Scope"

2. Select: "Sync only assigned users and groups"

3. Assign groups to application:
   - Click "Users and groups" (left menu)
   - Click "+ Add user/group"
   - Select: "Webex-Calling-Users" (3,200 members)
   - Select: "Webex-CC-Agents" (175 members)
   - Click "Assign"

4. Users in these groups will be provisioned to Webex
```

### Step 6: Enable Provisioning

```
1. Return to Provisioning page

2. Set Provisioning Status: On

3. Click "Save"

4. Initial sync starts automatically
   - First sync may take 20-40 minutes for 3,200 users
   - Subsequent syncs are incremental (every 40 minutes)

5. Monitor sync status:
   +-------------------------------------------------------------+
   |  PROVISIONING STATUS                                        |
   |                                                             |
   |  Current Cycle: Incremental                                 |
   |  Status: Completed                                          |
   |  Last Sync: 2026-01-15 16:00 UTC                           |
   |                                                             |
   |  Statistics (This Cycle):                                   |
   |  - Created: 15                                              |
   |  - Updated: 42                                              |
   |  - Disabled: 3                                              |
   |  - Skipped: 0                                               |
   |  - Errors: 0                                                |
   |                                                             |
   +-------------------------------------------------------------+
```

---

## 10E.6 SSO Configuration - Webex Control Hub + Azure Entra ID

### Step 1: Download Webex Metadata

```
1. Login to Control Hub
   URL: https://admin.webex.com

2. Navigate: Organization Settings > Single Sign-On

3. Click "Manage SSO and IdPs"

4. Click "Download Webex Metadata"
   - File: webex_metadata.xml
   - Save for Azure configuration
```

### Step 2: Create SAML Application in Azure

```
1. Login to Azure Portal
   URL: https://portal.azure.com

2. Navigate: Azure Active Directory > Enterprise Applications

3. Click "+ New Application"

4. Click "Create your own application"

5. Application details:
   - Name: Abhavtech-Webex-SSO
   - What are you looking to do: "Integrate any other application..."
   - Click "Create"

6. Click "Set up single sign on"

7. Select "SAML"
```

### Step 3: Configure SAML Settings in Azure

```
1. Basic SAML Configuration:
   - Click "Edit" (pencil icon)
   
   +-------------------------------------------------------------+
   |  BASIC SAML CONFIGURATION                                   |
   |                                                             |
   |  Identifier (Entity ID):                                    |
   |  https://idbroker.webex.com/<org-id>                       |
   |                                                             |
   |  Reply URL (ACS URL):                                       |
   |  https://idbroker.webex.com/idb/saml2/sso/<org-id>         |
   |                                                             |
   |  Sign on URL:                                               |
   |  https://web.webex.com                                      |
   |                                                             |
   |  Logout URL:                                                |
   |  https://idbroker.webex.com/idb/saml2/slo/<org-id>         |
   |                                                             |
   |  NOTE: Replace <org-id> with actual Webex Org ID           |
   +-------------------------------------------------------------+

2. Click "Save"
```

### Step 4: Configure User Attributes & Claims

```
1. Click "Attributes & Claims" > "Edit"

2. Required Claims:
   
   +-------------------------------------------------------------+
   |  USER ATTRIBUTES & CLAIMS                                   |
   |                                                             |
   |  Claim Name                   Source Attribute              |
   |  ---------------------------------------------              |
   |  Unique User Identifier       user.userprincipalname        |
   |  uid                          user.mail                     |
   |  firstName                    user.givenname                |
   |  lastName                     user.surname                  |
   |  email                        user.mail                     |
   |  displayName                  user.displayname              |
   |                                                             |
   +-------------------------------------------------------------+

3. Click "Save"
```

### Step 5: Download Azure SAML Certificate & Metadata

```
1. In SAML Signing Certificate section:
   - Download: Certificate (Base64)
   - Download: Federation Metadata XML

2. Copy URLs:
   - Login URL: https://login.microsoftonline.com/<tenant>/saml2
   - Azure AD Identifier: https://sts.windows.net/<tenant>/
   - Logout URL: https://login.microsoftonline.com/<tenant>/saml2
```

### Step 6: Configure Webex for SSO

```
1. Return to Control Hub
   Path: Organization Settings > Single Sign-On

2. Click "Add IdP"

3. Upload Azure Metadata:
   - Click "Upload metadata file"
   - Select: Federation Metadata XML (downloaded from Azure)
   - Click "Next"

4. Or enter manually:
   
   +-------------------------------------------------------------+
   |  IDENTITY PROVIDER CONFIGURATION                            |
   |                                                             |
   |  IdP Name: Azure AD - Abhavtech                             |
   |                                                             |
   |  IdP Entity ID:                                             |
   |  https://sts.windows.net/<tenant-id>/                       |
   |                                                             |
   |  SSO Login URL:                                             |
   |  https://login.microsoftonline.com/<tenant>/saml2           |
   |                                                             |
   |  SSO Logout URL:                                            |
   |  https://login.microsoftonline.com/<tenant>/saml2           |
   |                                                             |
   |  Certificate: [Upload Azure certificate]                    |
   |                                                             |
   +-------------------------------------------------------------+

5. Click "Next"
```

### Step 7: Test SSO

```
1. Control Hub prompts to test SSO

2. Click "Test SSO"

3. Browser opens new tab:
   - Redirects to Azure AD login
   - Enter test user credentials
   - Complete MFA
   - Redirects back to Webex

4. Expected result: "SSO test successful"

5. If error, check:
   - Certificate expiration
   - Claim mappings (uid must = email)
   - User exists in both Azure AD and Webex
```

### Step 8: Enable SSO for Organization

```
1. After successful test, click "Enable SSO"

2. Configure SSO mode:
   
   +-------------------------------------------------------------+
   |  SSO MODE                                                   |
   |                                                             |
   |  * SSO enabled for all users                                |
   |    (Recommended - enforces SSO for everyone)                |
   |                                                             |
   |  O SSO enabled, allow override                              |
   |    (Users can choose SSO or password)                       |
   |                                                             |
   |  [!]️ Ensure admin accounts can still access Control Hub     |
   |     via fallback. At least 2 admins should have direct     |
   |     Webex passwords as emergency access.                    |
   |                                                             |
   +-------------------------------------------------------------+

3. Click "Save"

4. SSO is now active
```

---

## 10E.7 Control Hub + Azure Entra ID Wizard

Control Hub provides a simplified wizard for Azure AD integration. This is an alternative to manual configuration.

### Step 1: Launch Azure AD Wizard

```
1. Login to Control Hub
   URL: https://admin.webex.com

2. Navigate: Organization Settings > Single Sign-On

3. Click "Manage SSO and IdPs"

4. Click "Add Identity Provider"

5. Select "Microsoft Azure AD"

6. Click "Start Setup Wizard"
```

### Step 2: Wizard Steps

```
+-----------------------------------------------------------------+
|  AZURE AD INTEGRATION WIZARD                                    |
+-----------------------------------------------------------------+
|                                                                 |
|  Step 1 of 5: Sign in to Azure                                 |
|  ================================                               |
|  Click "Sign in to Azure" button                                |
|  - Browser opens Azure login                                    |
|  - Login with Azure Global Admin account                        |
|  - Grant permissions for Webex app                              |
|                                                                 |
|  [Sign in to Azure]                                             |
|                                                                 |
+-----------------------------------------------------------------+
|                                                                 |
|  Step 2 of 5: Verify Azure Tenant                              |
|  ================================                               |
|  Tenant Name: abhavtech.onmicrosoft.com                        |
|  Tenant ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx               |
|  Directory: Abhavtech                                           |
|                                                                 |
|  Is this correct? [Yes, Continue]                               |
|                                                                 |
+-----------------------------------------------------------------+
|                                                                 |
|  Step 3 of 5: Configure SSO                                    |
|  ============================                                   |
|  Wizard automatically:                                          |
|  OK Creates Enterprise Application in Azure                     |
|  OK Configures SAML settings                                    |
|  OK Sets up attribute claims                                    |
|  OK Exchanges certificates                                      |
|                                                                 |
|  [Configure Automatically]                                      |
|                                                                 |
+-----------------------------------------------------------------+
|                                                                 |
|  Step 4 of 5: Configure User Provisioning                      |
|  =======================================                        |
|  [x] Enable SCIM Provisioning                                    |
|                                                                 |
|  Select groups to provision:                                    |
|  [x] Webex-Calling-Users                                         |
|  [x] Webex-CC-Agents                                             |
|                                                                 |
|  [Configure Provisioning]                                       |
|                                                                 |
+-----------------------------------------------------------------+
|                                                                 |
|  Step 5 of 5: Test and Enable                                  |
|  ============================                                   |
|  [Test SSO]  ->  Success OK                                      |
|                                                                 |
|  [Enable SSO for Organization]                                  |
|                                                                 |
+-----------------------------------------------------------------+
```

### Step 3: Verify Wizard Completion

```
1. After wizard completes, verify in Control Hub:
   
   Path: Organization Settings > Single Sign-On
   
   +-------------------------------------------------------------+
   |  SSO STATUS                                                 |
   |                                                             |
   |  Status: Enabled                                            |
   |  Identity Provider: Azure AD - Abhavtech                    |
   |  Provisioning: SCIM Enabled                                 |
   |  Last Sync: 2026-01-15 17:00 UTC                           |
   |  Users Provisioned: 3,200                                   |
   |                                                             |
   +-------------------------------------------------------------+

2. Verify in Azure Portal:
   
   Path: Enterprise Applications > Cisco Webex
   
   - Users and groups: Webex-Calling-Users assigned
   - Single sign-on: SAML configured
   - Provisioning: Enabled, running
```

---

## Part 3: User Data Migration 

## 10E.8 Personal Contacts Migration to Webex App

### Purpose
Migrate users' personal contacts (speed dials, personal directory) from CUCM/Jabber to Webex App.

### Method 1: Bulk Export/Import via CSV

### Step 1: Export Personal Contacts from CUCM

```
1. Connect to CUCM Publisher via SSH or CLI

2. Run SQL query to export personal contacts:
   
   run sql select eu.userid, pd.name, pd.telephonenumber 
   from personalphonebook pd 
   inner join enduser eu on pd.fkenduser = eu.pkid
   order by eu.userid

3. Export results to CSV:
   - Copy output to spreadsheet
   - Format as: UserID, ContactName, PhoneNumber
   - Save as: personal_contacts_export.csv
```

### Step 2: Transform to Webex Import Format

```
CSV Format for Webex Import:

email,contactName,workPhone,mobilePhone,homePhone
user1@abhavtech.com,John Smith,+91-22-1234567,,
user1@abhavtech.com,Jane Doe,,+91-98765-43210,
user2@abhavtech.com,Bob Wilson,+44-20-1234-5678,,
```

### Step 3: Import to Webex via Admin Portal

```
1. Login to Control Hub
   URL: https://admin.webex.com

2. Navigate: Users

3. For each user (or use bulk update):
   - Search for user
   - Click on user profile
   - Click "Calling" tab
   - Click "Personal Contacts" or "Speed Dials"
   - Click "Import"
   - Upload CSV file
   - Click "Import"

4. Verify contacts appear in Webex App
```

### Method 2: User Self-Migration

```
Provide users with instructions to manually migrate:

1. From CUCM phone:
   - Press "Directories" soft key
   - Navigate to "Personal Directory"
   - Note contact names and numbers

2. In Webex App:
   - Click "Contacts" (left panel)
   - Click "+" to add contact
   - Enter contact details
   - Click "Save"

3. For speed dials:
   - In Webex App, click Settings > Calling > Speed Dials
   - Add frequently called numbers
```

---

## 10E.9 Speed Dial Migration from CUCM

### Step 1: Export Speed Dials from CUCM

```
1. Access CUCM Admin
   URL: https://cucm-pub.corp.abhavtech.com/ccmadmin

2. Navigate: Device > Phone

3. For each phone model, export speed dial configuration:
   - Click on phone
   - View "Speed Dial" or "BLF Speed Dial" section
   - Note assignments

4. Alternatively, use SQL export:
   
   run sql select d.name as phone, sd.speeddialindex, sd.speeddialnumber, sd.label
   from device d
   inner join speeddial sd on sd.fkdevice = d.pkid
   where d.tkclass = 1
   order by d.name, sd.speeddialindex

5. Export to CSV
```

### Step 2: Configure Speed Dials in Webex

```
1. For Webex desk phones (MPP):
   - Speed dials configured via Control Hub or user self-service
   - Navigate: Control Hub > Users > [User] > Devices > [Phone]
   - Click "Configure Lines/Speed Dials"
   - Add speed dial entries

2. For Webex App:
   - Users configure their own speed dials
   - Settings > Calling > Speed Dials
   - Add entries from exported list

3. Line key configuration for MPP phones:
   
   +-------------------------------------------------------------+
   |  LINE KEY CONFIGURATION (Example: Cisco 8845)               |
   |                                                             |
   |  Key 1: Primary Line (Extension 1234)                       |
   |  Key 2: Speed Dial - IT Support (x1000)                     |
   |  Key 3: Speed Dial - Helpdesk (x2000)                       |
   |  Key 4: Speed Dial - Manager (x3456)                        |
   |  Key 5: BLF - Team Member (x1235)                           |
   |  Key 6-10: Available for user assignment                    |
   |                                                             |
   +-------------------------------------------------------------+
```

---

## 10E.10 Unity Connection Voicemail Integration

### Voicemail Strategy During Migration

| Phase | CUCM Users | Webex Users | Voicemail System |
|-------|------------|-------------|------------------|
| Pre-Migration | All users | None | Unity Connection |
| Coexistence | Remaining batches | Migrated batches | Hybrid: Unity + Webex VM |
| Post-Migration | None | All users | Webex Voicemail |

### Option 1: Webex Voicemail (Recommended)

```
1. During Webex provisioning, enable Webex Voicemail:
   
   Control Hub > Users > [User] > Calling > Voicemail
   
   +-------------------------------------------------------------+
   |  VOICEMAIL SETTINGS                                         |
   |                                                             |
   |  [x] Enable Voicemail                                         |
   |                                                             |
   |  Voicemail Settings:                                        |
   |  - Rings before voicemail: [4] rings                        |
   |  - Greeting: [Default] / [Custom]                           |
   |  - PIN: User sets on first access                           |
   |                                                             |
   |  Notifications:                                             |
   |  [x] Send voicemail to email                                  |
   |  [x] Attach voicemail audio file                              |
   |  Email: user@abhavtech.com                                  |
   |                                                             |
   |  Transcription:                                             |
   |  [x] Enable voicemail transcription                           |
   |  Language: English (India)                                  |
   |                                                             |
   +-------------------------------------------------------------+

2. User's existing Unity Connection mailbox is NOT migrated
   - Users must re-record greetings in Webex
   - Old messages remain in Unity (accessible during coexistence)
```

### Option 2: Unity Connection Integration (If Required)

If Abhavtech needs to maintain Unity Connection for extended coexistence:

```
1. Configure SIP trunk between Webex and Unity Connection

2. In Webex Control Hub:
   - Navigate: Calling > Service Settings > Voicemail
   - Select: "External Voicemail"
   - Enter Unity Connection SIP address

3. Call forward settings:
   - Forward to voicemail: Unity pilot number
   - VM pilot: sip:voicemail@unitycn.corp.abhavtech.com

[!]️ NOTE: This adds complexity. Webex native voicemail 
   is recommended for most migrations.
```

### Voicemail PIN Reset Communication

```
Sample user communication:

Subject: Your New Webex Voicemail - Action Required

Dear [User],

Your phone has been migrated to Webex Calling. Your voicemail 
is now provided by Webex.

IMPORTANT: Your old voicemail PIN will NOT work.

To set up your new voicemail:
1. Dial *86 from your desk phone (or tap Voicemail in Webex App)
2. When prompted, enter a NEW 6-digit PIN
3. Confirm your PIN
4. Record your name and greeting

Your old voicemail messages in Unity Connection will remain 
accessible for 30 days by dialing [Unity pilot number].

For assistance, contact IT Help Desk at x1000.
```

---

## Summary Checklist 

## Pre-Migration Identity Tasks

| Task | Owner | Status | Notes |
|------|-------|--------|-------|
| Install Directory Connector | Voice Eng | [ ] | Server: ABV-DIRCON-01 |
| Configure AD User Sync | Voice Eng | [ ] | 3,200 users |
| Configure Group Sync | Voice Eng | [ ] | License groups |
| Configure License Templates | Voice Eng | [ ] | Auto-assign licenses |
| Configure Azure SCIM | Identity | [ ] | Real-time provisioning |
| Configure SSO | Identity | [ ] | Azure Entra ID |
| Test SSO | Identity | [ ] | Test with pilot users |
| Enable Cloud-Connected UC | Voice Eng | [ ] | CUCM integration |
| Export personal contacts | Voice Eng | [ ] | From CUCM |
| Export speed dials | Voice Eng | [ ] | From CUCM |

## Post-Migration Verification

| Task | Owner | Status | Notes |
|------|-------|--------|-------|
| Verify users synced | Voice Eng | [ ] | 3,200 in Control Hub |
| Verify licenses assigned | Voice Eng | [ ] | All users licensed |
| Test SSO login | Identity | [ ] | Sample users |
| Test Webex App login | Voice Eng | [ ] | SSO flow |
| Verify voicemail setup | Voice Eng | [ ] | PINs reset |
| Import personal contacts | Voice Eng | [ ] | Per user request |

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 4 | Security & Compliance (SSO requirements) |
| Chapter 6 | Implementation Procedures |
| Chapter 7 | Migration Execution |
| Cisco Documentation | https://help.webex.com/article/nj5qqpab (Directory Connector) |
| Cisco Documentation | https://help.webex.com/article/lfu88u (SSO Configuration) |
| Cisco Documentation | https://help.webex.com/article/z0utqj (Cloud-Connected UC) |
| Microsoft Documentation | https://docs.microsoft.com/azure/active-directory/saas-apps/cisco-webex-provisioning-tutorial |

---

*End of Appendix 10E: Step-by-Step Configuration Procedures*
