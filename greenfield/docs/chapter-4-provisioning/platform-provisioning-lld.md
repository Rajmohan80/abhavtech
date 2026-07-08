# Platform Provisioning: Low-Level Design

## Executive Summary

This chapter provides **step-by-step configuration instructions** for deploying KidsWear India's greenfield Webex Contact Center solution. Every configuration step incorporates the security and compliance requirements defined in Chapter 3. This is a **cookbook-style guide** designed for an MSME with limited IT expertise, ensuring nothing is missed during implementation.

**Provisioning Phases:**
1. Webex Control Hub and Tenant Setup (with security baseline)
2. Webex Calling Configuration (India Cloud Connect)
3. Webex Contact Center Provisioning (Entry Points, Queues, Flows)
4. Security Configuration (Authentication, RBAC, API security)
5. Google Cloud Platform Setup (Dialogflow CX, Vertex AI)
6. Zendesk CRM Integration (CTI connector)
7. Agent Desktop Deployment (WebRTC with security)
8. Digital Channel Configuration (WhatsApp, Web Chat)
9. Monitoring and Dashboard Setup
10. Pre-Go-Live Validation

---

## 1. Prerequisites and Pre-Provisioning Checklist

### 1.1 Vendor Contracts and Access

Before starting provisioning, ensure the following are complete:

| Prerequisite | Owner | Status | Notes |
|--------------|-------|--------|-------|
| **Cisco Partner Contract Signed** | KidsWear India | [ ] PENDING | Includes Webex Calling + CC licenses |
| **Cloud Connect Partner Agreement** | Cisco Partner | [ ] PENDING | Airtel/Tata Communications/Tata Tele Business Services for PSTN |
| **Toll-Free DIDs Allocated** | Telco Partner | [ ] PENDING | 2 x 1800-XXX-XXXX numbers |
| **GCP Account Created** | KidsWear India | [ ] PENDING | Billing enabled, project created |
| **Zendesk Tenant Provisioned** | KidsWear India | [ ] PENDING | Suite Professional licenses |
| **Domain Verified** | KidsWear India | [ ] PENDING | kidswearindia.com or similar |
| **Admin Email Accounts** | KidsWear India | [ ] PENDING | admin@kidswearindia.com |
| **Agent Email Accounts** | KidsWear India | [ ] PENDING | 50 x agent emails (agent01@...) |

### 1.2 Technical Prerequisites

| Item | Requirement | Verification |
|------|-------------|--------------|
| **Webex Control Hub Access** | Full admin account from Cisco partner | Login successful |
| **GCP Console Access** | Owner or Editor role on project | Console accessible |
| **Zendesk Admin Access** | Admin user credentials | Login successful |
| **DNS Management** | Ability to add TXT/CNAME records | Access verified |
| **SSL Certificate** | For custom domains (if used) | Certificate obtained |
| **Agent Laptop Specs** | Min: i5, 8GB RAM, Chrome browser | Sample tested |
| **Internet Speed** | 25 Mbps minimum at each location | Speed test completed |

### 1.3 Information Gathering Template

**Complete this before starting provisioning:**

```
KIDSWEAR INDIA - PROVISIONING INFORMATION SHEET

Organization Details:
- Legal Name: KidsWear India Pvt Ltd
- Primary Domain: kidswearindia.com
- Admin Email: __________________
- Technical Contact: __________________
- Phone: __________________

Webex Tenant Information:
- Org ID (from partner): __________________
- Control Hub URL: admin.webex.com
- Region: India (Mumbai/Chennai)

PSTN Details:
- Cloud Connect Partner: __________________
- Toll-Free 1 (Sales): 1800-___-____
- Toll-Free 2 (Support): 1800-___-____
- SIP Trunk Credentials: (from partner)

GCP Project:
- Project ID: __________________
- Project Name: kidswear-ccai-prod
- Region: asia-south1 (Mumbai)
- Service Account Email: __________________

Zendesk:
- Subdomain: kidswearindia.zendesk.com
- Admin Email: __________________
- API Token: __________________

Agent Information:
- Total Agents: 50
- Sales Team: 30 agents
- Support Team: 20 agents
- Supervisors: 2
- IT Admin: 2
- Compliance Officer: 1
```

---

## 2. Webex Control Hub and Tenant Setup

### 2.1 Initial Tenant Access

**Step 1: Access Control Hub**

```
1. Open browser: https://admin.webex.com
2. Login with admin credentials provided by Cisco partner
3. First login will prompt for password change
   - Old password: [temporary from partner]
   - New password: [minimum 12 characters, uppercase, lowercase, number, special]
   - Example: KidsWear@2024Secure!
4. Enable MFA immediately (next step)
```

**Step 2: Enable Multi-Factor Authentication (SECURITY CRITICAL)**

```
1. Navigate: Control Hub > Organization Settings > Security
2. Find: "Multi-factor Authentication"
3. Click: "Enable MFA"
4. Configuration:
   - Require MFA for: "All administrators"
   - Authentication methods: "Authenticator app" (recommended)
   - Allow: "Google Authenticator" or "Microsoft Authenticator"
5. Save changes
6. Each admin must:
   a. Install authenticator app on phone
   b. Scan QR code from Control Hub
   c. Enter 6-digit code to verify
   d. Save backup codes securely
```

**Step 3: Verify Organization Settings**

```
1. Navigate: Control Hub > Organization Settings
2. Verify/Update:
   - Organization Name: KidsWear India Pvt Ltd
   - Country: India
   - Timezone: Asia/Kolkata (IST)
   - Language: English (India)
   - Date Format: DD/MM/YYYY
3. Click "Save"
```

### 2.2 Domain Verification

**Step 4: Add and Verify Domain**

```
1. Navigate: Control Hub > Organization Settings > Domains
2. Click: "Add Domain"
3. Enter: kidswearindia.com
4. Choose verification method: "DNS TXT Record"
5. Copy the TXT record value (example):
   cisco-site-verification=xxxxxxxxxxxxxx
6. Add to DNS:
   - Login to domain registrar (GoDaddy, Namecheap, etc.)
   - Add TXT record:
     Host: @ (or blank)
     Type: TXT
     Value: cisco-site-verification=xxxxxxxxxxxxxx
     TTL: 3600
7. Wait 15-30 minutes for DNS propagation
8. Click "Verify" in Control Hub
9. Status should change to "Verified"
```

### 2.3 Security Baseline Configuration

**Step 5: Configure Session Security**

```
1. Navigate: Control Hub > Organization Settings > Security
2. Configure:
   
   Session Timeout:
   - Idle Timeout: 30 minutes
   - Maximum Session Duration: 12 hours
   - Click "Save"
   
   Password Policy:
   - Minimum Length: 12 characters
   - Require uppercase: Yes
   - Require lowercase: Yes
   - Require numbers: Yes
   - Require special characters: Yes
   - Password expiry: 90 days
   - Password history: 12 (cannot reuse last 12)
   - Click "Save"
   
   Login Restrictions:
   - Failed login attempts before lockout: 5
   - Lockout duration: 30 minutes
   - Click "Save"
```

**Step 6: Configure Audit Logging**

```
1. Navigate: Control Hub > Troubleshooting > Audit Logs
2. Verify: Audit logging is enabled by default
3. Configure alerts:
   - Navigate: Control Hub > Alerts Center
   - Create alert rule:
     Name: "Admin Access Alert"
     Event: "Administrator login"
     Notify: admin@kidswearindia.com
   - Create alert rule:
     Name: "Security Setting Change"
     Event: "Security settings modified"
     Notify: admin@kidswearindia.com
4. Test: Make a small change and verify email received
```

### 2.4 User Provisioning

**Step 7: Create User Accounts**

```
METHOD 1: Manual Entry (for small number of users)

1. Navigate: Control Hub > Users
2. Click: "Add Users"
3. Choose: "Manually Add Users"
4. Enter user details:
   - Email: agent01@kidswearindia.com
   - First Name: [Agent Name]
   - Last Name: [Agent Surname]
   - Display Name: Agent 01
5. Assign licenses:
   - [ ] Webex Calling Professional
   - [ ] Webex Contact Center Premium Agent
6. Click "Add"
7. Repeat for all 50 agents + 2 supervisors

METHOD 2: CSV Import (Recommended for 50+ users)

1. Navigate: Control Hub > Users
2. Click: "Add Users"
3. Choose: "Import CSV"
4. Download template CSV
5. Fill in Excel:

email,firstName,lastName,displayName,licenses
agent01@kidswearindia.com,Priya,Sharma,Agent 01,webex_calling_professional;webex_cc_premium_agent
agent02@kidswearindia.com,Rahul,Kumar,Agent 02,webex_calling_professional;webex_cc_premium_agent
...
supervisor01@kidswearindia.com,Anil,Gupta,Supervisor 01,webex_calling_professional;webex_cc_supervisor
supervisor02@kidswearindia.com,Sunita,Patel,Supervisor 02,webex_calling_professional;webex_cc_supervisor

6. Save as CSV (UTF-8)
7. Upload to Control Hub
8. Review mapping
9. Click "Import"
10. Verify all users created successfully
```

**Step 8: Configure User Groups**

```
1. Navigate: Control Hub > Users > User Groups
2. Create Group 1:
   - Name: "Sales_Agents"
   - Description: "B2C and B2B Sales Team"
   - Add members: [Select 30 sales agents]
   - Click "Create"

3. Create Group 2:
   - Name: "Support_Agents"
   - Description: "Order Status and Complaints Team"
   - Add members: [Select 20 support agents]
   - Click "Create"

4. Create Group 3:
   - Name: "Supervisors"
   - Description: "Team Supervisors"
   - Add members: [Select 2 supervisors]
   - Click "Create"

5. Create Group 4:
   - Name: "Admins"
   - Description: "System Administrators"
   - Add members: [Select admin users]
   - Click "Create"
```

---

## 3. Webex Calling Configuration (India Region)

### 3.1 Webex Calling Service Activation

**Step 9: Enable Webex Calling**

```
1. Navigate: Control Hub > Services > Calling
2. If not already enabled:
   - Click "Get Started"
   - Select Location: India
   - PSTN Option: "Cloud Connected PSTN"
   - Confirm Cisco partner has provisioned
3. Verify service status: "Active"
```

**Step 10: Configure Location**

```
1. Navigate: Control Hub > Services > Calling > Locations
2. Click: "Add Location"
3. Enter details:
   - Location Name: "KidsWear India - Main"
   - Address: [Company registered address]
   - City: [City]
   - State: [State]
   - Country: India
   - Postal Code: [PIN Code]
   - Time Zone: Asia/Kolkata (UTC+5:30)
4. Emergency Services:
   - Emergency Number: 112 (India)
   - Note: Configure as per local requirements
5. Click "Create"
```

### 3.2 Cloud Connect PSTN Setup

**Step 11: Configure Cloud Connected PSTN**

```
1. Navigate: Control Hub > Services > Calling > PSTN
2. Select: "Cloud Connected PSTN"
3. Choose Provider:
   - Select from list: [Airtel/Tata Communications/Tata Tele Business Services - as per contract]
   - If not listed, Cisco partner must add
4. Enter SIP Trunk details (from Cloud Connect partner):
   - Trunk Group Name: "KidsWear_India_Trunk"
   - Primary SBC: [Partner provided IP/FQDN]
   - Secondary SBC: [Partner provided IP/FQDN]
   - Protocol: SIP over TLS (SIPS)
   - Port: 5061
   - Concurrent Sessions: 50
5. Authentication:
   - Username: [From partner]
   - Password: [From partner]
   - Realm: [From partner]
6. Codecs (in priority order):
   - G.711 A-law (India standard)
   - G.711 U-law
   - G.729
   - Opus (for WebRTC)
7. Click "Save"
8. Verify trunk status: "Online"
```

**Step 12: Add Toll-Free Numbers (DIDs)**

```
1. Navigate: Control Hub > Services > Calling > Numbers
2. Click: "Add Numbers"
3. Source: "Cloud Connected PSTN"
4. Enter numbers:
   - Number 1: 18001234567 (Sales)
   - Number 2: 18001234568 (Support)
5. Assign to location: "KidsWear India - Main"
6. Click "Add"
7. Verify numbers appear in list with status "Active"
```

### 3.3 Call Routing Configuration

**Step 13: Create Auto Attendant (Fallback)**

```
NOTE: Primary IVR will be in Webex Contact Center. 
This is a fallback in case CC is unavailable.

1. Navigate: Control Hub > Services > Calling > Features > Auto Attendant
2. Click: "Create Auto Attendant"
3. Settings:
   - Name: "KidsWear Main AA"
   - Location: KidsWear India - Main
   - Phone Number: [Leave blank - CC will handle]
   - Language: English (India)
   - Time Zone: Asia/Kolkata
4. Business Hours Greeting:
   - Upload audio or use Text-to-Speech:
   "Welcome to KidsWear India. Please hold for the next available agent."
5. After Hours Greeting:
   - Upload audio or use Text-to-Speech:
   "Thank you for calling KidsWear India. Our office is currently closed. 
    Please call back during business hours, 9 AM to 9 PM IST."
6. Click "Create"
```

---

## 4. Webex Contact Center Provisioning

### 4.1 Webex CC Tenant Setup

**Step 14: Activate Webex Contact Center**

```
1. Navigate: Control Hub > Services > Contact Center
2. If first time:
   - Click "Get Started"
   - Region Selection: CRITICAL - Choose "India (Mumbai)"
   - Confirm data residency
   - Accept terms and conditions
3. Wait for provisioning (can take 30-60 minutes)
4. Status should show: "Active"
5. Note the Webex CC tenant ID: ________________
```

**Step 15: Configure Tenant Settings**

```
1. Navigate: Contact Center > Tenant Settings
2. Configure:
   
   General Settings:
   - Tenant Name: KidsWear India Contact Center
   - Time Zone: Asia/Kolkata
   - Date Format: DD/MM/YYYY
   - Default Language: English (India)
   
   Recording Settings (SECURITY - Chapter 3):
   - Recording: Enabled
   - Recording Scope: All Calls (100%)
   - Recording Storage: Webex Cloud (India DC)
   - Retention Period: 90 days
   - Auto-Delete: Enabled
   - Encryption: AES-256 at rest
   - PCI Pause/Resume: Enabled
   
   Desktop Settings:
   - Idle Timeout: 30 minutes
   - Wrap-up Timeout: 120 seconds (2 minutes max)
   - Auto Wrap-up: Disabled (agent must manually end)
   
3. Click "Save"
```

### 4.2 User and Team Configuration

**Step 16: Create Teams**

```
1. Navigate: Contact Center > Provisioning > Teams
2. Create Team 1:
   - Click "New Team"
   - Name: "Sales_Team"
   - Site: Default
   - Type: Agent-based
   - Capacity: 30
   - Click "Save"

3. Create Team 2:
   - Click "New Team"
   - Name: "Support_Team"
   - Site: Default
   - Type: Agent-based
   - Capacity: 20
   - Click "Save"

4. Create Team 3:
   - Click "New Team"
   - Name: "Supervisor_Team"
   - Site: Default
   - Type: Supervisor
   - Capacity: 5
   - Click "Save"
```

**Step 17: Configure User Profiles (Agent Desktop)**

```
1. Navigate: Contact Center > Provisioning > User Profiles
2. Create Profile 1 (Agents):
   - Click "New User Profile"
   - Name: "Agent_Profile"
   - Description: "Standard agent desktop profile"
   
   Module Settings:
   [x] Agent Desktop
   [x] Buddy Teams (view team members)
   [x] Address Book
   [ ] Campaign Management (NO - not needed initially)
   [ ] Outdial ANI (NO - not needed initially)
   
   Desktop Layout:
   - Use Default Layout (or customize later)
   
   Timeout Settings:
   - Session Timeout: 1800 seconds (30 minutes)
   - Wrap-up Auto-close: 120 seconds
   
   Click "Save"

3. Create Profile 2 (Supervisors):
   - Click "New User Profile"
   - Name: "Supervisor_Profile"
   - Description: "Supervisor monitoring profile"
   
   Module Settings:
   [x] Agent Desktop
   [x] Buddy Teams
   [x] Address Book
   [x] Team Performance Monitoring
   [x] Agent State Monitoring
   [x] Call Monitoring (Listen/Whisper/Barge)
   [x] Recording Access
   
   Click "Save"
```

**Step 18: Assign Users to CC Profiles**

```
1. Navigate: Contact Center > Provisioning > Users
2. For each agent:
   - Click on user name
   - Contact Center Settings:
     - Site: Default
     - Team: Sales_Team or Support_Team
     - User Profile: Agent_Profile
     - Multimedia Profile: (default)
   - Click "Save"
   
3. For supervisors:
   - Click on user name
   - Contact Center Settings:
     - Site: Default
     - Team: Supervisor_Team
     - User Profile: Supervisor_Profile
   - Click "Save"
   
BULK UPDATE (if available):
1. Export user list to CSV
2. Add columns: Site, Team, UserProfile
3. Fill in assignments
4. Import updated CSV
```

### 4.3 Skills and Skill Profiles

**Step 19: Create Skills**

```
1. Navigate: Contact Center > Provisioning > Skills
2. Create Skill 1:
   - Click "New Skill"
   - Name: "B2C_Sales"
   - Description: "Retail direct customer sales"
   - Type: Text (enumeration not needed)
   - Click "Save"

3. Create Skill 2:
   - Name: "B2B_Bulk"
   - Description: "School bulk order handling"
   - Click "Save"

4. Create Skill 3:
   - Name: "Order_Status"
   - Description: "Order tracking and status"
   - Click "Save"

5. Create Skill 4:
   - Name: "Complaints"
   - Description: "Customer complaint handling"
   - Click "Save"

6. Create Skill 5:
   - Name: "Hindi"
   - Description: "Hindi language support"
   - Click "Save"

7. Create Skill 6:
   - Name: "English"
   - Description: "English language support"
   - Click "Save"

8. Create Skill 7:
   - Name: "Digital_Channels"
   - Description: "WhatsApp, Chat, Email handling"
   - Click "Save"
```

**Step 20: Create Skill Profiles**

```
1. Navigate: Contact Center > Provisioning > Skill Profiles
2. Create Profile 1:
   - Click "New Skill Profile"
   - Name: "Sales_B2C_Hindi"
   - Skills:
     - B2C_Sales: Yes
     - Hindi: Yes
     - English: Yes
   - Click "Save"

3. Create Profile 2:
   - Name: "Sales_B2B_Hindi"
   - Skills:
     - B2B_Bulk: Yes
     - B2C_Sales: Yes (backup)
     - Hindi: Yes
     - English: Yes
   - Click "Save"

4. Create Profile 3:
   - Name: "Support_Orders"
   - Skills:
     - Order_Status: Yes
     - Complaints: Yes (backup)
     - Hindi: Yes
     - English: Yes
   - Click "Save"

5. Create Profile 4:
   - Name: "Support_Complaints"
   - Skills:
     - Complaints: Yes
     - Order_Status: Yes (backup)
     - Hindi: Yes
     - English: Yes
   - Click "Save"

6. Create Profile 5:
   - Name: "Digital_Support"
   - Skills:
     - Digital_Channels: Yes
     - Order_Status: Yes
     - Complaints: Yes
     - Hindi: Yes
     - English: Yes
   - Click "Save"
```

**Step 21: Assign Skills to Agents**

```
1. Navigate: Contact Center > Provisioning > Users
2. For each sales agent:
   - Click user
   - Skill Profile: Sales_B2C_Hindi (or Sales_B2B_Hindi)
   - Click "Save"

3. For each support agent:
   - Click user
   - Skill Profile: Support_Orders (or Support_Complaints)
   - Click "Save"

Create a mapping spreadsheet:
Agent Name | Email | Team | Skill Profile | Notes
Agent 01 | agent01@... | Sales | Sales_B2C_Hindi | Primary B2C
Agent 02 | agent02@... | Sales | Sales_B2B_Hindi | School orders specialist
...
Agent 31 | agent31@... | Support | Support_Orders | Order tracking
Agent 32 | agent32@... | Support | Support_Complaints | Complaints specialist
...
```

### 4.4 Entry Points and Queues

**Step 22: Create Entry Points**

```
1. Navigate: Contact Center > Provisioning > Entry Points
2. Create Entry Point 1 (Sales):
   - Click "New Entry Point"
   - Name: "Sales_Voice_EP"
   - Description: "Inbound sales voice calls"
   - Channel Type: Telephony
   - Asset Name: "Sales_Voice_Asset"
   - Service Level Threshold: 30 seconds
   - Click "Save"
   - Note Entry Point ID: _______________

3. Create Entry Point 2 (Support):
   - Click "New Entry Point"
   - Name: "Support_Voice_EP"
   - Description: "Inbound support voice calls"
   - Channel Type: Telephony
   - Asset Name: "Support_Voice_Asset"
   - Service Level Threshold: 30 seconds
   - Click "Save"
   - Note Entry Point ID: _______________

4. Create Entry Point 3 (Digital):
   - Click "New Entry Point"
   - Name: "Digital_EP"
   - Description: "WhatsApp, Chat, Email"
   - Channel Type: Chat (generic digital)
   - Asset Name: "Digital_Asset"
   - Service Level Threshold: 15 seconds
   - Click "Save"
   - Note Entry Point ID: _______________
```

**Step 23: Create Queues**

```
1. Navigate: Contact Center > Provisioning > Queues
2. Create Queue 1:
   - Click "New Queue"
   - Name: "Sales_B2C_Queue"
   - Description: "Retail customer sales inquiries"
   - Channel Type: Telephony
   - Queue Type: Inbound
   - Service Level Threshold: 30 seconds
   - Maximum Time in Queue: 300 seconds (5 min)
   - Skills-Based Routing: Yes
   - Skill Requirements:
     - B2C_Sales: Required
   - Team: Sales_Team
   - Click "Save"

3. Create Queue 2:
   - Name: "Sales_B2B_Queue"
   - Description: "School bulk orders"
   - Service Level: 20 seconds (higher priority)
   - Maximum Time: 180 seconds
   - Skill Requirements:
     - B2B_Bulk: Required
   - Team: Sales_Team
   - Click "Save"

4. Create Queue 3:
   - Name: "Support_Orders_Queue"
   - Description: "Order status inquiries"
   - Service Level: 30 seconds
   - Maximum Time: 300 seconds
   - Skill Requirements:
     - Order_Status: Required
   - Team: Support_Team
   - Click "Save"

5. Create Queue 4:
   - Name: "Support_Complaints_Queue"
   - Description: "Customer complaints"
   - Service Level: 20 seconds (priority)
   - Maximum Time: 240 seconds
   - Skill Requirements:
     - Complaints: Required
   - Team: Support_Team
   - Click "Save"

6. Create Queue 5:
   - Name: "Digital_Chat_Queue"
   - Description: "WhatsApp and web chat"
   - Channel Type: Chat
   - Service Level: 15 seconds
   - Maximum Time: 120 seconds
   - Skill Requirements:
     - Digital_Channels: Required
   - Team: Support_Team (or create Digital_Team)
   - Click "Save"
```

**Step 24: Map Entry Points to Numbers**

```
1. Navigate: Contact Center > Provisioning > Entry Point Mapping
2. Map Sales:
   - Click "New Mapping"
   - Entry Point: Sales_Voice_EP
   - Dial Number: 18001234567
   - Click "Save"

3. Map Support:
   - Click "New Mapping"
   - Entry Point: Support_Voice_EP
   - Dial Number: 18001234568
   - Click "Save"

4. Verify:
   - Both toll-free numbers mapped to entry points
   - Status: Active
```

### 4.5 IVR Flow Design

**Step 25: Access Flow Designer**

```
1. Navigate: Contact Center > Flows
2. Click: "Create Flow"
3. Select: "Start from blank"
4. Flow Name: "Sales_IVR_Flow_v1"
5. Description: "Sales hybrid IVR with Dialogflow integration"
6. Click "Create"
7. Flow Designer canvas opens
```

**Step 26: Design Sales IVR Flow**

```
FLOW: Sales_IVR_Flow_v1

START
  |
  v
+----------------------------------+
| Activity: NewPhoneContact        |
| (Automatically added)            |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Set Variable           |
| Name: "Set_Consent_Status"       |
| Variable: consent_given          |
| Value: "pending"                 |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Play Message           |
| Name: "Welcome_Consent"          |
| Text-to-Speech:                  |
| "Welcome to KidsWear India.      |
|  This call may be recorded for   |
|  quality and training purposes.  |
|  By continuing, you consent to   |
|  data processing as per our      |
|  privacy policy.                 |
|  Press 1 to continue.            |
|  Press 2 to opt out of recording."|
| Language: en-IN                  |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Collect Digits         |
| Name: "Collect_Consent"          |
| Variable: consent_choice         |
| Min Digits: 1                    |
| Max Digits: 1                    |
| Timeout: 10 seconds              |
+----------------------------------+
  |
  +-------+--------+
  |                |
  v                v
[1 pressed]    [2 pressed]
  |                |
  v                v
+-------------+ +------------------+
| Set Variable| | Set Variable     |
| consent=    | | consent=         |
| "enabled"   | | "disabled"       |
+-------------+ +------------------+
  |                |
  v                v
+-------------+ +------------------+
| Start       | | Pause Recording  |
| Recording   | | (or skip start)  |
+-------------+ +------------------+
  |                |
  +--------+-------+
           |
           v
+----------------------------------+
| Activity: Play Message           |
| Name: "Main_Menu"                |
| Text-to-Speech:                  |
| "You can say what you need,      |
|  or press 1 for new order,       |
|  press 2 for bulk school order,  |
|  press 3 to speak with an agent."|
| Language: en-IN                  |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Collect Digits         |
| Name: "Menu_Choice"              |
| Variable: menu_selection         |
| Min Digits: 1                    |
| Max Digits: 1                    |
| Timeout: 5 seconds               |
| Speech Input: ENABLED            |
+----------------------------------+
  |
  +-------+-------+-------+
  |       |       |       |
  v       v       v       v
[1]     [2]     [3]   [Speech]
  |       |       |       |
  v       v       v       v
Set     Set     Set    HTTP
intent= intent= intent= Request
"New_   "Bulk_  "Agent" to
Order"  Order"         Dialogflow
  |       |       |       |
  +-------+-------+-------+
                |
                v
+----------------------------------+
| Activity: HTTP Request           |
| Name: "Call_Dialogflow"          |
| (Only if speech detected)        |
| Method: POST                     |
| URL: https://dialogflow.         |
|      googleapis.com/v3/          |
|      projects/{{PROJECT_ID}}/    |
|      locations/asia-south1/      |
|      agents/{{AGENT_ID}}/        |
|      sessions/{{SESSION_ID}}:    |
|      detectIntent                |
| Headers:                         |
|   Authorization: Bearer {{TOKEN}}|
|   Content-Type: application/json |
| Body: (see next step)            |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Set Variable           |
| Parse Dialogflow Response        |
| intent = response.intent         |
| sentiment = response.sentiment   |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: HTTP Request           |
| Name: "Call_VertexAI_Router"     |
| Method: POST                     |
| URL: https://asia-south1-        |
|      aiplatform.googleapis.com/  |
|      v1/projects/{{PROJECT_ID}}/ |
|      locations/asia-south1/      |
|      endpoints/{{ENDPOINT_ID}}:  |
|      predict                     |
| Body: {                          |
|   "instances": [{                |
|     "intent": "{{intent}}",      |
|     "sentiment": {{sentiment}},  |
|     "customer_id": "{{ANI}}"     |
|   }]                             |
| }                                |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Set Variable           |
| Parse Vertex AI Response         |
| skill = response.skill           |
| priority = response.priority     |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Condition              |
| Name: "Route_By_Intent"          |
| IF intent = "New_Order"          |
|   -> Queue: Sales_B2C_Queue      |
| ELSE IF intent = "Bulk_Order"    |
|   -> Queue: Sales_B2B_Queue      |
| ELSE                             |
|   -> Queue: Sales_B2C_Queue      |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Queue Contact          |
| Name: "Queue_to_Sales"           |
| Queue: {{selected_queue}}        |
| Priority: {{priority}}           |
| Skills: {{skill}}                |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Play Music             |
| Name: "Hold_Music"               |
| File: Default hold music         |
| Loop: Yes                        |
+----------------------------------+
  |
  v
END FLOW (Agent answers)
```

**Step 27: Save and Publish Flow**

```
1. Click "Save" button (top right)
2. Review for errors (red indicators)
3. Fix any missing configurations
4. Click "Validate"
5. If validation passes:
   - Click "Publish"
   - Version: 1.0
   - Notes: "Initial sales IVR with consent and Dialogflow"
6. Assign to Entry Point:
   - Navigate: Contact Center > Provisioning > Entry Points
   - Select: Sales_Voice_EP
   - Routing Flow: Sales_IVR_Flow_v1
   - Click "Save"
```

**Step 28: Create Support IVR Flow (Similar Process)**

```
FLOW: Support_IVR_Flow_v1

Same structure as Sales flow, but:
- Menu options:
  Press 1: Order Status
  Press 2: Complaints
  Press 3: General Support
- Queues:
  Order Status -> Support_Orders_Queue
  Complaints -> Support_Complaints_Queue
  General -> Support_Orders_Queue (default)
- Dialogflow intents:
  Order_Tracking, Return_Request, Payment_Issue, Complaint

Follow same steps as Sales flow to create and publish.
```

### 4.6 Global Variables and Secure Settings

**Step 29: Configure Global Variables (SECURITY)**

```
1. Navigate: Contact Center > Flows > Global Variables
2. Create secure variables for API credentials:

   Variable 1:
   - Name: GCP_PROJECT_ID
   - Type: String
   - Value: kidswear-ccai-prod
   - Reportable: No
   - Secure: Yes

   Variable 2:
   - Name: GCP_AGENT_ID
   - Type: String
   - Value: [Your Dialogflow CX Agent ID]
   - Secure: Yes

   Variable 3:
   - Name: GCP_AUTH_TOKEN
   - Type: String
   - Value: [Service Account Token - Base64 encoded]
   - Secure: Yes
   - Note: This should be refreshed programmatically

   Variable 4:
   - Name: VERTEX_ENDPOINT_ID
   - Type: String
   - Value: [Your Vertex AI Endpoint ID]
   - Secure: Yes

   Variable 5:
   - Name: ZENDESK_API_TOKEN
   - Type: String
   - Value: [Base64 encoded email/token:api_token]
   - Secure: Yes

3. Click "Save" for each variable
```

---

## 5. Google Cloud Platform Configuration

### 5.1 GCP Project Setup

**Step 30: Create GCP Project**

```
1. Access: https://console.cloud.google.com
2. Click: "Select a project" dropdown
3. Click: "New Project"
4. Enter:
   - Project Name: kidswear-ccai-prod
   - Project ID: kidswear-ccai-prod (auto-generated or custom)
   - Organization: [Your organization or leave blank]
   - Location: No organization (for MSME)
5. Click "Create"
6. Wait for project creation
7. Select the new project from dropdown
```

**Step 31: Enable Required APIs**

```
1. Navigate: APIs & Services > Library
2. Search and Enable each API:

   a. Dialogflow API
      - Search: "Dialogflow"
      - Click: "Dialogflow API"
      - Click: "Enable"

   b. Cloud Speech-to-Text API
      - Search: "Speech"
      - Click: "Cloud Speech-to-Text API"
      - Click: "Enable"

   c. Cloud Text-to-Speech API
      - Search: "Text-to-Speech"
      - Click: "Cloud Text-to-Speech API"
      - Click: "Enable"

   d. Vertex AI API
      - Search: "Vertex AI"
      - Click: "Vertex AI API"
      - Click: "Enable"

   e. BigQuery API
      - Search: "BigQuery"
      - Click: "BigQuery API"
      - Click: "Enable" (usually pre-enabled)

   f. Cloud Storage API
      - Search: "Cloud Storage"
      - Click: "Cloud Storage JSON API"
      - Click: "Enable"

3. Verify all APIs enabled:
   - Navigate: APIs & Services > Enabled APIs
   - Confirm all 6 APIs listed
```

**Step 32: Create Service Account (SECURITY)**

```
1. Navigate: IAM & Admin > Service Accounts
2. Click: "Create Service Account"
3. Enter:
   - Name: kidswear-ccai-prod-sa
   - ID: kidswear-ccai-prod-sa
   - Description: Service account for Webex CC integration
4. Click: "Create and Continue"
5. Grant IAM Roles (PRINCIPLE OF LEAST PRIVILEGE):
   - Click "Select a role"
   - Add: "Dialogflow API Client" (NOT Admin)
   - Click "Add another role"
   - Add: "Vertex AI User" (NOT Admin)
   - Click "Add another role"
   - Add: "BigQuery Data Viewer" (for reports only)
6. Click: "Continue"
7. Skip "Grant users access" (not needed)
8. Click: "Done"

9. Create Key:
   - Click on the service account you just created
   - Navigate to "Keys" tab
   - Click: "Add Key" > "Create new key"
   - Key type: JSON
   - Click: "Create"
   - JSON file downloads automatically
   - SAVE THIS FILE SECURELY (NEVER share via email)

10. Store key securely:
    - Option A: Store in GCP Secret Manager
    - Option B: Base64 encode and store in Webex secure variable
    - Delete local copy after storing
```

### 5.2 Dialogflow CX Agent Configuration

**Step 33: Create Dialogflow CX Agent**

```
1. Navigate: Dialogflow CX Console
   - URL: https://dialogflow.cloud.google.com/cx
2. Select project: kidswear-ccai-prod
3. Click: "Create Agent"
4. Configure:
   - Display Name: KidsWear India Voice Agent
   - Location: asia-south1 (Mumbai, India) - CRITICAL for data residency
   - Default Language: English (India) - en-IN
   - Time Zone: Asia/Kolkata
5. Click: "Create"
6. Note Agent ID from URL: projects/PROJECT/locations/asia-south1/agents/AGENT_ID
```

**Step 34: Add Language Support (Hindi)**

```
1. In Dialogflow CX console
2. Navigate: Agent Settings (gear icon)
3. Click: "Languages" tab
4. Click: "Add Language"
5. Select: "Hindi (India)" - hi-IN
6. Click: "Save"
7. Agent now supports English and Hindi
```

**Step 35: Create Intents**

```
1. Navigate: Manage > Intents
2. Create Intent 1:
   - Click: "Create"
   - Display Name: "New_Order"
   - Training Phrases (English):
     - "I want to place an order"
     - "I need to buy clothes"
     - "Can I order kids clothes"
     - "I want to purchase"
     - "New order please"
     - Add 20-30 more variations
   - Training Phrases (Hindi):
     - "मुझे ऑर्डर करना है"
     - "मुझे कपड़े खरीदने हैं"
     - "मैं बच्चों के कपड़े खरीदना चाहता हूं"
     - Add 20-30 more variations
   - Click: "Save"

3. Create Intent 2:
   - Display Name: "Bulk_Uniform_Order"
   - Training Phrases:
     - "I want to order school uniforms"
     - "Bulk order for school"
     - "School uniform inquiry"
     - "We need uniforms for 500 students"
     - "Wholesale uniform order"
   - Click: "Save"

4. Create Intent 3:
   - Display Name: "Order_Status"
   - Training Phrases:
     - "Where is my order"
     - "Order status check"
     - "When will my order arrive"
     - "Track my order"
     - "मेरा ऑर्डर कहां है"
   - Click: "Save"

5. Create Intent 4:
   - Display Name: "Complaint"
   - Training Phrases:
     - "I have a complaint"
     - "I want to complain"
     - "I am not happy with my order"
     - "Wrong product received"
     - "मुझे शिकायत है"
   - Click: "Save"

6. Create Intent 5:
   - Display Name: "Return_Request"
   - Training Phrases:
     - "I want to return"
     - "Return my order"
     - "I need a refund"
     - "Exchange this product"
   - Click: "Save"
```

**Step 36: Create Entities**

```
1. Navigate: Manage > Entity Types
2. Create Entity 1:
   - Click: "Create"
   - Display Name: "school_name"
   - Entries:
     - Delhi Public School, DPS
     - Kendriya Vidyalaya, KV
     - DAV School, DAV
     - (Add common school names in your region)
   - Fuzzy Matching: Yes
   - Click: "Save"

3. Create Entity 2:
   - Display Name: "quantity"
   - Entries:
     - 100, hundred
     - 200, two hundred
     - 500, five hundred
     - (Add common quantities)
   - Click: "Save"

4. Create Entity 3:
   - Display Name: "product_type"
   - Entries:
     - School uniform, uniform
     - Casual wear, casual clothes
     - Shirt, shirts
     - Pants, trousers
   - Click: "Save"
```

**Step 37: Create Flows**

```
1. Navigate: Build > Flows
2. Default Start Flow:
   - This is your main entry point
   - Page: Start Page

3. Create Pages:
   
   a. Start Page (Default):
      - Entry Fulfillment: None (handled by Webex CC)
      - Routes:
        - Intent: New_Order -> Transition to: Order_Confirmation
        - Intent: Bulk_Uniform_Order -> Transition to: Bulk_Order_Details
        - Intent: Order_Status -> Transition to: Order_Tracking
        - Intent: Complaint -> Transition to: Complaint_Handling

   b. Create Page: Order_Confirmation
      - Entry Fulfillment:
        - Agent Says: "I'll help you place an order."
      - Parameters:
        - product_type (entity)
        - quantity (entity)
      - Routes:
        - Condition: All parameters filled -> End session

   c. Create Page: Bulk_Order_Details
      - Entry Fulfillment:
        - Agent Says: "I can help with bulk school orders."
      - Parameters:
        - school_name (entity)
        - quantity (entity)
      - Routes:
        - Condition: All parameters filled -> End session

4. Click: "Save" for each page
```

**Step 38: Enable Sentiment Analysis**

```
1. Navigate: Agent Settings (gear icon)
2. Click: "Advanced" tab
3. Enable:
   [x] Sentiment Analysis
4. Click: "Save"

Now every detectIntent response will include:
- sentimentAnalysisResult.queryTextSentiment.score (-1 to 1)
- sentimentAnalysisResult.queryTextSentiment.magnitude (0 to infinity)
```

**Step 39: Test Dialogflow Agent**

```
1. Click: "Test Agent" (chat bubble icon)
2. Test conversation:
   You: "I want to order school uniforms"
   Agent: [Should detect Bulk_Uniform_Order intent]
   
   You: "मुझे ऑर्डर करना है"
   Agent: [Should detect New_Order intent in Hindi]

3. Check intent detection accuracy
4. Check sentiment scores
5. Refine training phrases if needed
```

### 5.3 Vertex AI Predictive Routing Model

**Step 40: Create BigQuery Dataset**

```
1. Navigate: BigQuery Console
   - URL: https://console.cloud.google.com/bigquery
2. Select project: kidswear-ccai-prod
3. Click: "Create Dataset"
4. Configure:
   - Dataset ID: contact_center_analytics
   - Location: asia-south1 (Mumbai)
   - Default Table Expiration: Never
   - Encryption: Google-managed key
5. Click: "Create Dataset"
```

**Step 41: Create Training Data Table**

```
1. In BigQuery Console
2. Select dataset: contact_center_analytics
3. Click: "Create Table"
4. Source: Empty table
5. Table Name: routing_training_data
6. Schema (Add fields):

   - interaction_id (STRING)
   - timestamp (TIMESTAMP)
   - customer_intent (STRING)
   - customer_sentiment (FLOAT)
   - customer_tier (STRING)
   - customer_ltv (FLOAT)
   - call_hour (INTEGER)
   - call_day (INTEGER)
   - agent_id (STRING)
   - queue_name (STRING)
   - outcome (STRING) - "conversion", "fcr", "escalation", etc.
   - handle_time (INTEGER)
   - csat_score (FLOAT)

7. Click: "Create Table"

8. For initial training:
   - Insert synthetic data or
   - Wait for real data from first month of operations
   - Minimum 1000 rows for basic model
```

**Step 42: Create Vertex AI Model (Simplified)**

```
NOTE: Full ML model creation requires data scientist expertise.
For MSME, start with rule-based routing in Webex CC Flow.
Use Vertex AI as Phase 2 after collecting 3-6 months of data.

SIMPLIFIED APPROACH FOR GO-LIVE:

1. Create a simple Vertex AI endpoint that returns rule-based decisions
2. Navigate: Vertex AI > Endpoints
3. For Phase 1, use Webex CC Flow conditions instead of ML:

In Webex CC Flow:
+----------------------------------+
| Activity: Condition              |
| Name: "Simple_Routing_Rules"    |
| IF sentiment < -0.5             |
|   -> priority = 10 (highest)    |
|   -> skill = "Complaints"       |
| ELSE IF intent = "Bulk_Order"   |
|   -> priority = 8               |
|   -> skill = "B2B_Bulk"         |
| ELSE                            |
|   -> priority = 5               |
|   -> skill = "B2C_Sales"        |
+----------------------------------+

PHASE 2 (After 3-6 months):
- Collect interaction outcome data in BigQuery
- Train XGBoost or AutoML model
- Deploy to Vertex AI endpoint
- Replace Flow conditions with HTTP Request to Vertex AI
```

### 5.4 GCP Security Configuration

**Step 43: Configure IAM and Access Controls**

```
1. Navigate: IAM & Admin > IAM
2. Review default roles
3. Add principle of least privilege:
   
   Service Account: kidswear-ccai-prod-sa@...
   - Dialogflow API Client (NOT Admin)
   - Vertex AI User (NOT Admin)
   - BigQuery Data Viewer (NOT Editor)
   
   Human Admins: admin@kidswearindia.com
   - Owner (only 1-2 people)
   
   Compliance Officer: compliance@...
   - BigQuery Data Viewer (reports only)
   - Logging Viewer
   
4. Remove any overly permissive roles
5. Enable organization policies if applicable
```

**Step 44: Configure Cloud Audit Logs**

```
1. Navigate: IAM & Admin > Audit Logs
2. Enable audit logs for:
   [x] Admin Read
   [x] Admin Write
   [x] Data Read
   [x] Data Write
   
3. Services to audit:
   - Dialogflow API
   - Vertex AI API
   - BigQuery
   - Cloud Storage
   - IAM
   
4. Click: "Save"

5. View logs:
   - Navigate: Logging > Logs Explorer
   - Filter: protoPayload.serviceName="dialogflow.googleapis.com"
   - Monitor API calls and access patterns
```

**Step 45: Set Up Cost Alerts**

```
1. Navigate: Billing > Budgets & Alerts
2. Click: "Create Budget"
3. Configure:
   - Name: KidsWear CCAI Monthly Budget
   - Projects: kidswear-ccai-prod
   - Budget Amount: [Set based on estimate, e.g., $1500/month]
   - Alert Thresholds:
     - 50% of budget -> Email admin
     - 80% of budget -> Email admin + SMS
     - 100% of budget -> Email admin + SMS + auto-disable (optional)
4. Click: "Finish"

This prevents unexpected cost overruns.
```

---

## 6. Zendesk CRM Integration

### 6.1 Zendesk Tenant Configuration

**Step 46: Access Zendesk Admin**

```
1. URL: https://kidswearindia.zendesk.com/admin
2. Login with admin credentials
3. Verify: Suite Professional license activated
4. Navigate: Admin Center
```

**Step 47: Create Custom Fields for Contact Center**

```
1. Navigate: Admin Center > Objects and rules > Tickets > Fields
2. Create Field 1:
   - Click: "Add field"
   - Type: Drop-down
   - Name: "Contact Channel"
   - Options:
     - Voice - Sales
     - Voice - Support
     - WhatsApp
     - Web Chat
     - Email
   - Required: Yes
   - Click: "Save"

3. Create Field 2:
   - Type: Drop-down
   - Name: "Customer Consent"
   - Options:
     - Consent Given - Recording Enabled
     - Consent Given - Recording Disabled
     - Consent Not Collected
   - Required: Yes
   - Click: "Save"

4. Create Field 3:
   - Type: Text
   - Name: "Webex Interaction ID"
   - Description: Link to Webex CC recording
   - Required: No
   - Click: "Save"

5. Create Field 4:
   - Type: Drop-down
   - Name: "Detected Intent"
   - Options:
     - New_Order
     - Bulk_Order
     - Order_Status
     - Complaint
     - Return_Request
     - General
   - Required: No
   - Click: "Save"

6. Create Field 5:
   - Type: Decimal
   - Name: "Sentiment Score"
   - Description: AI-detected sentiment (-1 to 1)
   - Required: No
   - Click: "Save"
```

**Step 48: Configure API Access (SECURITY)**

```
1. Navigate: Admin Center > Apps and integrations > APIs > Zendesk API
2. Settings:
   - Token Access: Enabled
   - Password Access: Disabled (more secure)
   
3. Generate API Token:
   - Click: "Add API token"
   - Description: "Webex_CC_Integration_Prod"
   - Click: "Create"
   - COPY THE TOKEN IMMEDIATELY (shown only once)
   - Store securely (not in email!)

4. API Authentication Format:
   {email}/token:{api_token}
   Example: api_user@kidswearindia.com/token:xxxxxxxx
   
   Base64 encode this for HTTP Basic Auth:
   echo -n "api_user@kidswearindia.com/token:xxxxxxxx" | base64
   Result: YXBpX3VzZXJAa2lkc3dlYXJpbmRpYS5jb20vdG9rZW46eHh4eHh4eHg=

5. Store in Webex CC Global Variable:
   - Variable: ZENDESK_API_TOKEN
   - Value: YXBpX3VzZXJAa2lkc3dlYXJpbmRpYS5jb20vdG9rZW46eHh4eHh4eHg=
   - Secure: Yes
```

**Step 49: Create Dedicated API User**

```
1. Navigate: Admin Center > People > Team members
2. Add Team Member:
   - Name: API Integration User
   - Email: api_integration@kidswearindia.com
   - Role: Custom role (next step)
3. Create Custom Role:
   - Navigate: Admin Center > People > Roles
   - Create role: "API_Integration"
   - Permissions:
     [x] Tickets: Create
     [x] Tickets: Update
     [x] Tickets: View
     [x] Users: View
     [x] Organizations: View
     [ ] Settings: Access (NO)
     [ ] People: Manage (NO)
4. Assign role to API user
5. Generate API token under this user (more secure than admin)
```

### 6.2 CTI Connector Setup

**Step 50: Install Webex CC CTI Connector for Zendesk**

```
1. Navigate: Zendesk Marketplace
   - URL: https://www.zendesk.com/marketplace
2. Search: "Webex Contact Center" or "Cisco CTI"
3. If official connector available:
   - Click "Install"
   - Follow installation wizard
   - Enter Webex CC credentials
   - Configure screen pop

4. If no official connector (build custom):
   - Use Zendesk App Framework
   - Build custom sidebar app
   - Use Webex CC Desktop SDK
   - This requires developer expertise

5. Alternative: Use HTTP Requests in Webex CC Flow
   - No Zendesk app installation needed
   - Screen pop via embedded browser in Agent Desktop
```

**Step 51: Configure Screen Pop via Webex CC Flow**

```
In Webex CC Flow Designer, add before Queue Contact:

+----------------------------------+
| Activity: HTTP Request           |
| Name: "Zendesk_Customer_Lookup"  |
| Method: GET                      |
| URL: https://kidswearindia.      |
|      zendesk.com/api/v2/search.  |
|      json?query=phone:{{ANI}}    |
| Headers:                         |
|   Authorization: Basic           |
|   {{ZENDESK_API_TOKEN}}          |
|   Content-Type: application/json |
| Response Variable: zendesk_resp  |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Set Variable           |
| Name: "Parse_Zendesk_Response"   |
| customer_id = zendesk_resp.      |
|              results[0].id       |
| customer_name = zendesk_resp.    |
|                results[0].name   |
| organization = zendesk_resp.     |
|               results[0].org     |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: HTTP Request           |
| Name: "Zendesk_Create_Ticket"    |
| Method: POST                     |
| URL: https://kidswearindia.      |
|      zendesk.com/api/v2/tickets  |
| Headers:                         |
|   Authorization: Basic           |
|   {{ZENDESK_API_TOKEN}}          |
|   Content-Type: application/json |
| Body: {                          |
|   "ticket": {                    |
|     "subject": "Inbound Call -   |
|                {{intent}}",      |
|     "requester_id": {{customer_id}},|
|     "custom_fields": [           |
|       {"id": FIELD_ID_CHANNEL,   |
|        "value": "voice_sales"},  |
|       {"id": FIELD_ID_CONSENT,   |
|        "value": "{{consent}}"},  |
|       {"id": FIELD_ID_INTENT,    |
|        "value": "{{intent}}"},   |
|       {"id": FIELD_ID_SENTIMENT, |
|        "value": {{sentiment}}}   |
|     ]                            |
|   }                              |
| }                                |
| Response Variable: ticket_resp   |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Set Variable           |
| ticket_id = ticket_resp.ticket.id|
| ticket_url = "https://kidswear   |
|              india.zendesk.com/  |
|              agent/tickets/" +   |
|              ticket_id           |
+----------------------------------+
  |
  v
+----------------------------------+
| Activity: Queue Contact          |
| CAD Variables (passed to agent): |
| - ticket_url: {{ticket_url}}     |
| - customer_name: {{customer_name}}|
| - intent: {{intent}}             |
| - sentiment: {{sentiment}}       |
+----------------------------------+

Agent Desktop will display these CAD variables.
Agent clicks ticket_url to open Zendesk ticket.
```

### 6.3 Agent Desktop Widget Configuration

**Step 52: Configure Agent Desktop Layout with Zendesk Widget**

```
1. Navigate: Contact Center > Agent Desktop > Desktop Layouts
2. Create New Layout:
   - Click: "Create Layout"
   - Name: "KidsWear_Agent_Layout"
   
3. Add Zendesk Widget:
   - In Layout Designer canvas
   - Add: "IFrame Widget"
   - Configuration:
     - Widget Name: Zendesk CRM
     - URL: https://kidswearindia.zendesk.com/agent/tickets/${ticket_id}
     - Height: 600px
     - Width: 100%
     - Position: Right panel
     - Auto-open on call: Yes

4. Add Additional Widgets:
   - Customer Info Panel (CAD variables display)
   - Wrap-up Codes Panel
   - Team Chat (if needed)

5. Save Layout

6. Assign Layout to User Profile:
   - Navigate: Contact Center > Provisioning > User Profiles
   - Edit: Agent_Profile
   - Desktop Layout: KidsWear_Agent_Layout
   - Click: "Save"
```

---

## 7. Agent Desktop Deployment

### 7.1 WebRTC Configuration

**Step 53: Verify WebRTC Settings**

```
1. Navigate: Contact Center > Tenant Settings > Desktop Settings
2. Verify:
   - Voice Channel: WebRTC (not SIP)
   - WebRTC Gateway: Auto-configured
   - Codec: Opus (preferred for WebRTC)
   - Echo Cancellation: Enabled
   - Noise Suppression: Enabled
   - Auto-Gain Control: Enabled

3. These settings are global for all agents
```

**Step 54: Agent Browser Configuration Guide**

```
AGENT BROWSER SETUP GUIDE (Provide to each agent)

STEP 1: Install Google Chrome
- Download: https://www.google.com/chrome
- Install latest version
- Enable auto-updates

STEP 2: Allow Microphone Access
1. Open Chrome
2. Click three dots (menu) > Settings
3. Privacy and security > Site settings
4. Microphone
5. Add: https://desktop.wxcc-*.cisco.com
6. Set: "Allow"

STEP 3: Disable Pop-up Blocker for Webex
1. Settings > Privacy and security > Site settings
2. Pop-ups and redirects
3. Add: https://*.webex.com
4. Set: "Allow"

STEP 4: Test WebRTC
1. Visit: https://test.webrtc.org
2. Click "Start"
3. Verify:
   - Microphone: Working
   - Camera: Working (if needed)
   - Network: UDP and TCP connectivity
   - All green checkmarks

STEP 5: Install USB Headset
1. Plug in USB headset
2. Chrome should detect automatically
3. Test in Chrome settings:
   - Settings > Privacy and security > Site settings > Microphone
   - Select your USB headset as default
4. Test audio:
   - Visit: https://webcammictest.com
   - Test microphone input and speaker output

STEP 6: First Login to Agent Desktop
1. URL: https://desktop.wxcc-us1.cisco.com (or region-specific)
2. Login: agent01@kidswearindia.com
3. Password: [Initial password]
4. Change password on first login
5. Complete MFA setup (if enabled)
6. Select: Station Type = "WebRTC"
7. Click: "Sign In"
8. Set status: "Available"
9. Make test call to verify audio
```

**Step 55: Agent Desktop Security Settings**

```
1. Navigate: Control Hub > Security > Settings
2. Configure for Agent Desktop:
   
   Session Security:
   - Auto-logout on browser close: Yes
   - Single session per user: Yes (prevent credential sharing)
   - Session recording of desktop: No (privacy)
   
   Browser Requirements:
   - Minimum Chrome version: 90+
   - Block outdated browsers: Yes
   - HTTPS only: Yes (enforced automatically)

3. Agent Activity Monitoring:
   - Idle detection: 30 minutes
   - Auto-set to "Not Ready" after idle
   - Supervisor alert on extended idle

4. Click "Save"
```

### 7.2 Agent Onboarding Checklist

**Step 56: Create Agent Onboarding Checklist**

```
AGENT ONBOARDING SECURITY CHECKLIST

Agent Name: ____________________
Agent ID: ____________________
Onboarding Date: ____________________

PRE-ONBOARDING (IT Admin completes):
[ ] User account created in Control Hub
[ ] Licenses assigned (Calling + CC)
[ ] Assigned to team and skill profile
[ ] Email sent with temporary password
[ ] Home/Store network assessment completed
[ ] Laptop meets minimum specs

FIRST DAY (Agent completes with IT support):
[ ] Changed initial password (12+ chars, complex)
[ ] MFA configured (authenticator app)
[ ] Chrome browser installed and updated
[ ] Microphone permissions granted
[ ] USB headset configured and tested
[ ] Pop-up blocker disabled for Webex
[ ] First login to Agent Desktop successful
[ ] WebRTC audio test passed
[ ] Zendesk login successful
[ ] Screen pop tested with sample call

SECURITY TRAINING (Complete within first week):
[ ] Data Protection Basics module (1 hr)
[ ] PCI-DSS Awareness module (30 min)
[ ] DPDP Customer Rights module (1 hr)
[ ] Password Security module (30 min)
[ ] Phishing Awareness module (1 hr)
[ ] Home Network Security module (1 hr - remote agents)
[ ] Quiz passed (minimum 80%)
[ ] Training certificate issued

ACKNOWLEDGEMENTS (Agent signs):
[ ] Security policy read and understood
[ ] Data handling agreement signed
[ ] Remote work policy signed (if applicable)
[ ] Confidentiality agreement signed

SUPERVISOR VERIFICATION:
[ ] Agent made 5 test calls successfully
[ ] Agent handled 1 sample customer interaction
[ ] Wrap-up codes used correctly
[ ] Screen pop working properly
[ ] Agent status changes verified

Onboarding Completed: ____________________
IT Admin Signature: ____________________
Supervisor Signature: ____________________
Agent Signature: ____________________
```

---

## 8. Digital Channel Configuration

### 8.1 Webex Connect Setup

**Step 57: Access Webex Connect**

```
1. URL: https://connect.webex.com (or partner-provided URL)
2. Login with Webex credentials
3. If not provisioned:
   - Contact Cisco partner to provision Webex Connect
   - Requires separate subscription
4. Dashboard should show:
   - Channels available
   - Message logs
   - Bot configuration
```

**Step 58: WhatsApp Business Setup**

```
PRE-REQUISITES:
- Facebook Business Manager account
- Business verification completed
- WhatsApp Business API approved

STEPS:

1. In Webex Connect:
   - Navigate: Channels > WhatsApp
   - Click: "Configure"

2. Facebook Business Manager Setup:
   - Login: https://business.facebook.com
   - Navigate: Business Settings > Accounts > WhatsApp Accounts
   - Click: "Add"
   - Follow WhatsApp Business API setup wizard
   - Phone number: [Indian business number, not toll-free]
   - Display name: "KidsWear India Support"
   - Business category: Retail
   - Complete verification (may take 1-7 days)

3. Connect to Webex Connect:
   - In Facebook Business Manager
   - WhatsApp account settings
   - Partner connection: Webex Connect
   - Generate API credentials
   - Copy: Phone Number ID, Business Account ID, Access Token

4. In Webex Connect:
   - Enter credentials from Facebook
   - Test connection: Send test message
   - Configure webhook URL (Webex Connect provides this)
   - Set up message templates (for outbound)

5. Routing to Webex CC:
   - In Webex Connect Flow Builder
   - On message received -> Route to Webex CC queue
   - Entry Point: Digital_EP
   - Queue: Digital_Chat_Queue
```

**Step 59: Web Chat Widget Setup**

```
1. Navigate: Webex Connect > Channels > Live Chat
2. Create Chat Widget:
   - Name: "KidsWear Website Chat"
   - Appearance:
     - Primary Color: [Brand color]
     - Chat Icon: [Upload icon]
     - Position: Bottom right
     - Welcome Message: "Hi! How can we help you today?"

3. Pre-chat Form:
   - Enable: Yes
   - Fields:
     - Name (required)
     - Email (required)
     - Phone (optional)
     - Subject (dropdown: Order, Support, General)

4. Behavior:
   - Business Hours: 9 AM - 9 PM IST
   - Outside Hours Message: "We're offline. Leave a message."
   - File Attachments: Allow images, PDFs
   - Typing Indicators: Show

5. Routing:
   - Connect to: Webex Contact Center
   - Entry Point: Digital_EP
   - Queue: Digital_Chat_Queue

6. Generate Embed Code:
   - Click: "Get Code"
   - Copy JavaScript snippet
   - Provide to web developer

7. Install on Website:
   - Add script before </body> tag
   ```html
   <script src="https://connect.webex.com/widget/v1/kidswearindia/chat.js"></script>
   <script>
     WebexChat.init({
       widgetId: 'YOUR_WIDGET_ID',
       brandName: 'KidsWear India',
       agentWait: true
     });
   </script>
   ```

8. Test:
   - Visit website
   - Chat widget should appear
   - Start chat should create task in Webex CC
   - Agent receives in unified desktop
```

### 8.2 Bot Integration (Dialogflow CX to Chat)

**Step 60: Connect Dialogflow CX to Chat Widget**

```
1. In Webex Connect Flow Builder:
2. Create new flow: "Chat_Bot_Flow"
3. Flow:

   On Message Received
         |
         v
   +----------------------------------+
   | Send to Dialogflow CX           |
   | (Same agent as voice)           |
   | Method: POST detectIntent       |
   | Body: { text input instead of   |
   |         audio }                 |
   +----------------------------------+
         |
         v
   +----------------------------------+
   | Parse Intent                    |
   | If intent = "Complaint" AND     |
   |    sentiment < -0.3             |
   | Then: Escalate to human agent   |
   | Else: Reply with bot message    |
   +----------------------------------+
         |
    +----+----+
    |         |
    v         v
   Bot      Escalate
   Reply    to Queue
    |         |
    v         v
   Continue  Transfer to
   Chat      Digital_Chat_Queue

4. Save and activate flow
5. Test: Chat with bot on website
6. Bot handles simple queries
7. Complex issues escalate to human agent
```

---

## 9. Monitoring and Dashboard Setup

### 9.1 Webex CC Analyzer Configuration

**Step 61: Access Analyzer**

```
1. Navigate: Contact Center > Analyzer
2. URL: https://analyzer.wxcc-*.cisco.com
3. Login with admin credentials
4. First time setup:
   - Select Tenant: KidsWear India
   - Configure timezone: Asia/Kolkata
```

**Step 62: Create Supervisor Dashboard**

```
1. In Analyzer:
2. Click: "Create Dashboard"
3. Name: "KidsWear Real-Time Dashboard"
4. Add Widgets:

   Widget 1: Queue Performance
   - Metric: Average Speed of Answer (ASA)
   - Queue: All queues
   - Visualization: Gauge
   - Threshold: Green < 30s, Yellow < 60s, Red > 60s

   Widget 2: Agent States
   - Metric: Agent availability by state
   - Team: All teams
   - Visualization: Pie chart
   - States: Available, On Call, Wrap-up, Not Ready

   Widget 3: Calls in Queue
   - Metric: Current calls waiting
   - Queue: All queues
   - Visualization: Number
   - Alert: If > 10, flash red

   Widget 4: Service Level
   - Metric: % calls answered in threshold
   - Target: 80% in 30 seconds
   - Visualization: Line chart
   - Time: Last 4 hours

   Widget 5: Abandonment Rate
   - Metric: % calls abandoned
   - Target: < 5%
   - Visualization: Gauge
   - Alert: If > 5%, send email

   Widget 6: Agent Performance Table
   - Columns: Agent Name, Calls Handled, AHT, Status
   - Rows: All agents
   - Sort: By calls handled (descending)

5. Save Dashboard
6. Share with supervisors
7. Set as default view
```

**Step 63: Configure Real-Time Alerts**

```
1. Navigate: Analyzer > Alerts
2. Create Alert 1:
   - Name: "High Queue Depth"
   - Condition: Queue depth > 15 calls
   - Duration: 5 minutes sustained
   - Action: Email supervisor@kidswearindia.com
   - Message: "Queue depth critical. Consider adding agents."

3. Create Alert 2:
   - Name: "Abandonment Spike"
   - Condition: Abandonment rate > 10%
   - Duration: 15 minutes
   - Action: Email + SMS to supervisor
   - Message: "High abandonment. Check queue staffing."

4. Create Alert 3:
   - Name: "Agent Long Idle"
   - Condition: Agent in "Not Ready" > 30 minutes
   - Action: Email supervisor
   - Message: "Agent {{agent_name}} idle for extended period."

5. Save all alerts
6. Verify email/SMS delivery working
```

### 9.2 Security Monitoring Dashboard

**Step 64: Create Security Monitoring View**

```
1. In Webex Control Hub:
2. Navigate: Troubleshooting > Audit Logs
3. Create saved filters:

   Filter 1: Failed Logins
   - Event: Authentication failed
   - Time: Last 24 hours
   - Frequency: Daily review

   Filter 2: Admin Actions
   - Event: All admin activities
   - Time: Last 7 days
   - Frequency: Weekly review

   Filter 3: Recording Access
   - Event: Recording playback/download
   - Time: Last 30 days
   - Frequency: Monthly audit

4. Export to CSV for compliance records
5. Set up regular review schedule:
   - Daily: Failed logins
   - Weekly: Admin actions, security changes
   - Monthly: Full audit log review

6. In GCP Cloud Monitoring:
   - Create dashboard for CCAI
   - Metrics: API calls, errors, latency
   - Alerts: Unusual API patterns, quota exceeded
```

---

## 10. Pre-Go-Live Validation

### 10.1 End-to-End Testing Checklist

**Step 65: Complete System Test**

```
TEST CASE 1: Inbound Sales Call (Voice)
[ ] Dial toll-free number 1800-XXX-XXX (Sales)
[ ] Hear consent prompt
[ ] Press 1 to consent
[ ] Hear main menu
[ ] Press 2 for bulk order
[ ] Hold music plays
[ ] Agent receives call (WebRTC working)
[ ] Screen pop shows customer info (Zendesk)
[ ] Intent detected correctly (Dialogflow)
[ ] Call recorded (verify in Analyzer)
[ ] Wrap-up completed
[ ] Ticket created in Zendesk

TEST CASE 2: Support Call with Hindi Speaker
[ ] Dial toll-free number 1800-XXX-XXX (Support)
[ ] Consent prompt plays
[ ] Speak in Hindi: "मुझे ऑर्डर की स्थिति जाननी है"
[ ] System detects Hindi and Order_Status intent
[ ] Routes to Support_Orders_Queue
[ ] Agent with Hindi skill receives call
[ ] Interaction logged

TEST CASE 3: Payment Collection (PCI-DSS)
[ ] Agent transfers to payment IVR
[ ] Recording pauses (verify in Analyzer)
[ ] Customer enters card via DTMF (masked)
[ ] Agent hears only flat tones
[ ] Payment processed via gateway API
[ ] Recording resumes
[ ] Agent sees only "Authorized" status
[ ] No card data in recording

TEST CASE 4: WhatsApp Message
[ ] Send WhatsApp message to business number
[ ] Bot responds (Dialogflow CX)
[ ] Request human agent
[ ] Escalated to Digital_Chat_Queue
[ ] Agent receives in desktop
[ ] Two-way conversation works
[ ] Ticket created in Zendesk

TEST CASE 5: Web Chat
[ ] Visit website
[ ] Click chat widget
[ ] Fill pre-chat form
[ ] Start conversation
[ ] Bot handles initial query
[ ] Escalate to human
[ ] Agent receives chat
[ ] Conversation flows properly

TEST CASE 6: Supervisor Monitoring
[ ] Supervisor logs in
[ ] Real-time dashboard displays correctly
[ ] Queue metrics accurate
[ ] Agent states update in real-time
[ ] Supervisor listens to live call (monitoring)
[ ] Supervisor whispers to agent (coaching)
[ ] Supervisor barges into call (if needed)

TEST CASE 7: Security Validation
[ ] Failed login after 5 attempts -> Lockout works
[ ] Session timeout after 30 min idle -> Works
[ ] MFA required for admin login -> Works
[ ] API calls using service account -> Successful
[ ] GCP audit logs show API activity -> Yes
[ ] Zendesk API token works -> Yes
[ ] Recording access restricted to authorized roles -> Yes

TEST CASE 8: Data Subject Request (DPDP)
[ ] Simulate deletion request
[ ] Identify all data locations
[ ] Execute deletion (test account)
[ ] Verify deletion complete
[ ] Document audit trail
```

### 10.2 Performance Baseline

**Step 66: Establish Performance Baselines**

```
RUN THESE TESTS AND RECORD RESULTS:

Network Performance:
- Latency to Webex DC: _____ ms (target < 100ms)
- Packet loss: _____ % (target < 0.5%)
- Jitter: _____ ms (target < 10ms)

Call Quality:
- MOS score (test calls): _____ (target > 4.0)
- Audio clarity: Excellent / Good / Fair / Poor
- Echo detected: Yes / No
- Delay noticeable: Yes / No

System Response:
- Screen pop time: _____ seconds (target < 3s)
- Dialogflow API response: _____ ms (target < 500ms)
- Zendesk ticket creation: _____ seconds (target < 2s)
- Agent desktop login: _____ seconds (target < 10s)

Routing Accuracy:
- Intent detection accuracy: _____ % (target > 85%)
- Correct queue routing: _____ % (target > 95%)
- Skill matching: _____ % (target > 98%)

SAVE THESE BASELINES FOR COMPARISON AFTER GO-LIVE
```

### 10.3 Final Security Checklist

**Step 67: Security Sign-Off**

```
FINAL SECURITY VALIDATION BEFORE GO-LIVE

AUTHENTICATION & ACCESS:
[ ] All admin accounts have MFA enabled
[ ] Password policy enforced (12 chars, complexity)
[ ] Session timeout configured (30 min)
[ ] Single session per user enforced
[ ] RBAC configured correctly (all roles verified)
[ ] API service accounts use minimal permissions

ENCRYPTION:
[ ] TLS 1.2+ for all connections (verified)
[ ] SRTP for voice media (verified)
[ ] WebRTC DTLS-SRTP working (verified)
[ ] Data at rest encrypted (Webex confirmation)
[ ] GCP encryption enabled (verified)

COMPLIANCE:
[ ] DTMF masking functional (PCI-DSS)
[ ] Recording pause/resume working
[ ] Consent prompt in IVR (DPDP)
[ ] Data retention set to 90 days
[ ] Data erasure workflow documented
[ ] Privacy policy published on website

API SECURITY:
[ ] GCP service account key secured
[ ] Zendesk API token encrypted
[ ] Token rotation schedule documented
[ ] API rate limits configured
[ ] No credentials in code/logs

MONITORING:
[ ] Audit logging enabled (all platforms)
[ ] Security alerts configured
[ ] Failed login monitoring active
[ ] Recording access audit in place
[ ] Incident response plan documented

TRAINING:
[ ] All agents completed security training
[ ] Training records documented
[ ] Security policy acknowledged

SIGNED OFF BY:
IT Admin: _____________________ Date: _________
Security/Compliance: ____________ Date: _________
Management: ____________________ Date: _________
```

---

## 11. Post-Provisioning Steps

### 11.1 Documentation Package

**Step 68: Create System Documentation**

```
DOCUMENTATION DELIVERABLES:

1. System Configuration Document
   - All settings documented
   - Architecture diagrams
   - Integration details
   - Version: 1.0

2. User Guides
   - Agent Quick Start Guide
   - Supervisor Guide
   - Admin Guide

3. Security Documentation
   - Security policy
   - Access control matrix
   - Incident response plan
   - Audit procedures

4. Runbooks
   - Daily operations checklist
   - Password reset procedure
   - User provisioning procedure
   - Emergency escalation contacts

5. Vendor Contact Information
   - Cisco Partner: _______________
   - GCP Support: _______________
   - Zendesk Support: _______________
   - Cloud Connect Partner: _______________
```

### 11.2 Handover to Operations

**Step 69: Operations Handover**

```
HANDOVER MEETING AGENDA:

1. System Overview (1 hour)
   - Architecture review
   - Component interactions
   - Data flows

2. Daily Operations (2 hours)
   - Monitoring dashboards
   - Alert management
   - User provisioning
   - Password resets
   - Reporting

3. Security Procedures (2 hours)
   - Audit log review
   - Incident response
   - Token rotation
   - Compliance reporting

4. Troubleshooting (2 hours)
   - Common issues
   - Escalation paths
   - Vendor support contacts
   - Log analysis

5. Change Management (1 hour)
   - Configuration changes
   - Flow updates
   - User modifications
   - Approval process

6. Q&A and Practice (2 hours)

Total: 10 hours (2-day session recommended)
```

---

## Document Information

**Document Title:** Chapter 4: Platform Provisioning (Low-Level Design)  
**Project:** KidsWear India - Cisco Webex Contact Center Greenfield Deployment  
**Version:** 1.0  
**Author:** Rajmohan M, Principal Consultant  
**AI-Assisted:** Claude (Anthropic)


---

**DISCLAIMER:** This document contains AI-assisted content. All configuration steps, security settings, and integration procedures should be validated in a test environment before production deployment. Specific UI elements, menu paths, and options may vary based on product version and updates. Always refer to official Cisco, Google Cloud, and Zendesk documentation for the most current procedures. Test all security configurations thoroughly before go-live. This is a guide and not a substitute for professional implementation services.

---

*End of Chapter 4*