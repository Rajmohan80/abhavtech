# Appendix 10-E: Step-by-Step Configuration Procedures 

> **Document Reference:** ABV-COLLAB-MIG-2026 | Chapter 10 | Appendix 10-E  
> **Purpose:** Detailed click-by-click procedures for AI platform configuration  
> **Audience:** Implementation Engineers, Administrators  
> **Prerequisites:** Completion of Phase 2A baseline migration

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | Collaboration Architecture Team | Initial release |

---

## Table of Contents

### SECTION 1: PRE-IMPLEMENTATION CHECKLIST
- [1.1 Access & Permissions Verification](#11-access-permissions-verification)
- [1.2 Licensing Verification](#12-licensing-verification)
- [1.3 Network & Connectivity Requirements](#13-network-connectivity-requirements)

### SECTION 2: WEBEX CONTROL HUB - AI AGENT CONFIGURATION
- [2.1 Creating a Webex AI Agent](#21-creating-a-webex-ai-agent)
- [2.2 Configuring Intents](#22-configuring-intents)
- [2.3 Configuring Responses](#23-configuring-responses)
- [2.4 Testing the Webex AI Agent](#24-testing-the-webex-ai-agent)

### SECTION 3: GOOGLE CLOUD PLATFORM - PROJECT SETUP
- [3.1 Creating a GCP Project](#31-creating-a-gcp-project)
- [3.2 Enabling Required APIs](#32-enabling-required-apis)
- [3.3 Creating a Service Account](#33-creating-a-service-account)
- [3.4 Configuring IAM Permissions](#34-configuring-iam-permissions)
- [3.5 Generating Service Account Key](#35-generating-service-account-key)

### SECTION 4: DIALOGFLOW CX - AGENT CREATION
- [4.1 Creating a Dialogflow CX Agent](#41-creating-a-dialogflow-cx-agent)
- [4.2 Configuring Agent Settings](#42-configuring-agent-settings)
- [4.3 Creating Intents](#43-creating-intents)
- [4.4 Creating Entities](#44-creating-entities)
- [4.5 Building Flows](#45-building-flows)
- [4.6 Creating Pages](#46-creating-pages)
- [4.7 Configuring Webhooks](#47-configuring-webhooks)
- [4.8 Setting Up Environments](#48-setting-up-environments)

### SECTION 5: WEBEX CONTACT CENTER - CCAI CONNECTOR
- [5.1 Creating CCAI Configuration](#51-creating-ccai-configuration)
- [5.2 Linking Dialogflow CX Agent](#52-linking-dialogflow-cx-agent)
- [5.3 Configuring Voice Settings](#53-configuring-voice-settings)

### SECTION 6: FLOW DESIGNER - VIRTUAL AGENT INTEGRATION
- [6.1 Adding Virtual Agent V2 Node](#61-adding-virtual-agent-v2-node)
- [6.2 Configuring Node Parameters](#62-configuring-node-parameters)
- [6.3 Handling Exit Events](#63-handling-exit-events)
- [6.4 Passing Context Variables](#64-passing-context-variables)

### SECTION 7: AGENT ASSIST CONFIGURATION
- [7.1 Enabling Agent Assist](#71-enabling-agent-assist)
- [7.2 Configuring Knowledge Base](#72-configuring-knowledge-base)
- [7.3 Setting Up Suggestions](#73-setting-up-suggestions)
- [7.4 Configuring Conversation Summaries](#74-configuring-conversation-summaries)

### SECTION 8: VALIDATION & TESTING
- [8.1 Component Validation Checklist](#81-component-validation-checklist)
- [8.2 End-to-End Test Procedure](#82-end-to-end-test-procedure)
- [8.3 Troubleshooting Common Issues](#83-troubleshooting-common-issues)

---

## SECTION 1: PRE-IMPLEMENTATION CHECKLIST 

---

## 1.1 Access & Permissions Verification

Before beginning configuration, verify all required access and permissions are in place.

### Procedure: Verify Webex Control Hub Access

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 1.1.1: VERIFY CONTROL HUB ADMINISTRATOR ACCESS                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Step 1: Open browser and navigate to:                                     |
|          https://admin.webex.com                                           |
|                                                                             |
|  Step 2: Log in with your administrator credentials                        |
|          Username: [your-admin-email]@abhavtech.com                        |
|          Password: [your-password]                                         |
|                                                                             |
|  Step 3: After login, verify your role:                                    |
|          a. Click your profile icon (top-right corner)                     |
|          b. Click "My Profile"                                             |
|          c. Scroll to "Administrative Roles" section                       |
|                                                                             |
|  Step 4: Confirm you have one of these roles:                              |
|          [ ] Full Administrator                                              |
|          [ ] Contact Center Administrator                                    |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: "Contact Center Administrator" or higher role visible       |
|      If missing: Contact your Webex organization administrator             |
|                                                                             |
|  Step 5: Verify Contact Center access:                                     |
|          a. Click "Services" in left navigation panel                      |
|          b. Verify "Contact Center" appears in the services list           |
|          c. Click "Contact Center"                                         |
|          d. Verify dashboard loads without errors                          |
|                                                                             |
|  [OK] VERIFICATION COMPLETE when Contact Center dashboard displays           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Procedure: Verify GCP Access

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 1.1.2: VERIFY GOOGLE CLOUD PLATFORM ACCESS                      |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Step 1: Open browser and navigate to:                                     |
|          https://console.cloud.google.com                                  |
|                                                                             |
|  Step 2: Log in with your GCP credentials                                  |
|          Account: [your-email]@abhavtech.com                               |
|          (Use Google Workspace or Cloud Identity account)                  |
|                                                                             |
|  Step 3: Verify organization access:                                       |
|          a. Click the project dropdown (top navigation bar)                |
|          b. Click "ALL" tab                                                |
|          c. Verify "abhavtech.com" organization is visible                 |
|                                                                             |
|  Step 4: Verify required IAM roles:                                        |
|          a. Navigate to: IAM & Admin -> IAM                                 |
|          b. Find your email in the members list                            |
|          c. Confirm you have these roles (or equivalent):                  |
|             [ ] Project Creator                                              |
|             [ ] Billing Account User                                         |
|             [ ] Dialogflow API Admin                                         |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: All three roles visible for your account                    |
|      If missing: Contact your GCP organization administrator               |
|                                                                             |
|  [OK] VERIFICATION COMPLETE when all roles confirmed                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 1.2 Licensing Verification

### Procedure: Verify WxCC Licenses

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 1.2.1: VERIFY WEBEX CONTACT CENTER LICENSES                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Step 1: In Control Hub, navigate to:                                      |
|          Services -> Contact Center -> Settings                              |
|                                                                             |
|  Step 2: Click "Licenses" tab                                              |
|                                                                             |
|  Step 3: Document current license allocation:                              |
|                                                                             |
|          License Type          | Entitled | Consumed | Available           |
|          ----------------------+----------+----------+-------------        |
|          Standard Agent        | ________ | ________ | ________            |
|          Premium Agent         | ________ | ________ | ________            |
|          Supervisor            | ________ | ________ | ________            |
|                                                                             |
|  Step 4: Verify minimum requirements for AI features:                      |
|          [ ] At least 1 Premium Agent license available                      |
|            (Premium required for AI Agent features)                        |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Premium Agent licenses > 0 available                        |
|      If insufficient: Contact Cisco account team for licensing             |
|                                                                             |
|  Step 5: Verify Virtual Agent entitlement:                                 |
|          a. Navigate to: Features -> Virtual Agent                          |
|          b. Verify "Create Virtual Agent" button is enabled                |
|          c. If disabled, check subscription includes AI features           |
|                                                                             |
|  [OK] VERIFICATION COMPLETE when Premium licenses available and               |
|    Virtual Agent feature accessible                                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Procedure: Verify GCP Billing

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 1.2.2: VERIFY GCP BILLING ACCOUNT                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Step 1: In GCP Console, navigate to:                                      |
|          Navigation Menu (☰) -> Billing                                     |
|                                                                             |
|  Step 2: Verify billing account exists:                                    |
|          a. Look for billing account in the list                           |
|          b. Note the billing account name: _______________________         |
|          c. Note the billing account ID: _______________________           |
|                                                                             |
|  Step 3: Verify billing account is active:                                 |
|          a. Click on the billing account name                              |
|          b. Verify status shows "Active" (green indicator)                 |
|          c. Verify payment method is configured                            |
|                                                                             |
|  Step 4: Verify you have billing permissions:                              |
|          a. Click "Account management" in left panel                       |
|          b. Verify you can view billing details                            |
|          c. Verify role: "Billing Account User" or higher                  |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Active billing account with valid payment method            |
|      If missing: Contact finance team to set up GCP billing                |
|                                                                             |
|  NOTE: Dialogflow CX pricing is consumption-based:                         |
|        - ~$0.007 per text request                                          |
|        - ~$0.001 per second of audio (voice)                               |
|        - Estimated monthly cost for Abhavtech: $500-1,500                  |
|                                                                             |
|  [OK] VERIFICATION COMPLETE when billing account active and accessible        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 1.3 Network & Connectivity Requirements

### Procedure: Verify Network Connectivity

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 1.3.1: VERIFY NETWORK REQUIREMENTS                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  The following endpoints must be accessible from WxCC:                     |
|                                                                             |
|  DIALOGFLOW CX ENDPOINTS:                                                  |
|  -------------------------------------------------------------------------  |
|  | Endpoint                              | Port | Protocol | Purpose      |
|  |---------------------------------------|------|----------|--------------|
|  | dialogflow.googleapis.com             | 443  | HTTPS    | API calls    |
|  | asia-south1-dialogflow.googleapis.com | 443  | HTTPS    | Regional API |
|  | storage.googleapis.com                | 443  | HTTPS    | Audio files  |
|  | oauth2.googleapis.com                 | 443  | HTTPS    | Auth         |
|                                                                             |
|  WEBHOOK ENDPOINTS (if self-hosted):                                       |
|  -------------------------------------------------------------------------  |
|  | Endpoint                              | Port | Protocol | Purpose      |
|  |---------------------------------------|------|----------|--------------|
|  | api.abhavtech.com                     | 443  | HTTPS    | Fulfillment  |
|                                                                             |
|  Step 1: Verify firewall rules allow outbound HTTPS (443) to:              |
|          [ ] *.googleapis.com                                                |
|          [ ] *.google.com                                                    |
|                                                                             |
|  Step 2: If using corporate proxy, ensure:                                 |
|          [ ] Proxy supports HTTPS inspection bypass for Google domains       |
|          [ ] Certificate pinning is not blocking Google APIs                 |
|                                                                             |
|  Step 3: Test connectivity (from admin workstation):                       |
|          Open command prompt/terminal and run:                             |
|                                                                             |
|          curl -I https://dialogflow.googleapis.com                         |
|                                                                             |
|          Expected response: HTTP/2 404 (API requires auth, but             |
|          connectivity confirmed)                                           |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Successful HTTPS connection to Google APIs                  |
|      If blocked: Work with network team to allow Google API endpoints      |
|                                                                             |
|  [OK] VERIFICATION COMPLETE when connectivity test successful                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## SECTION 2: WEBEX CONTROL HUB - AI AGENT CONFIGURATION 

---

## 2.1 Creating a Webex AI Agent

### Procedure: Create New Virtual Agent

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 2.1.1: CREATE WEBEX AI AGENT                                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 15 minutes                                                |
|  Prerequisites: Procedures 1.1.1 and 1.2.1 completed successfully          |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Virtual Agent Management                              |
|  -------------------------------------------------------------------------  |
|          a. Log into Control Hub: https://admin.webex.com                  |
|          b. Click "Services" in left navigation                            |
|          c. Click "Contact Center"                                         |
|          d. In left panel, click "Features"                                |
|          e. Click "Virtual Agent"                                          |
|                                                                             |
|          [Screenshot placeholder: Control Hub - Virtual Agent list]        |
|                                                                             |
|  Step 2: Initiate Agent Creation                                           |
|  -------------------------------------------------------------------------  |
|          a. Click "+ Create Virtual Agent" button (top-right)              |
|          b. Creation wizard opens                                          |
|                                                                             |
|  Step 3: Select Agent Type                                                 |
|  -------------------------------------------------------------------------  |
|          a. In the "Agent Type" selection screen:                          |
|             O Scripted                                                     |
|             * Scripted with NLU        <- SELECT THIS                       |
|             O Dialogflow CX                                                |
|             O Dialogflow ES                                                |
|          b. Click "Next"                                                   |
|                                                                             |
|  Step 4: Configure Basic Information                                       |
|  -------------------------------------------------------------------------  |
|          a. Enter the following values:                                    |
|                                                                             |
|             Field                | Value                                   |
|             ---------------------+----------------------------------------  |
|             Name                 | Abhi_Simple_VA                          |
|             Description          | Simple voice IVR agent for basic        |
|                                  | intents - hours, callbacks, surveys     |
|                                                                             |
|          b. Click "Next"                                                   |
|                                                                             |
|  Step 5: Configure Language Settings                                       |
|  -------------------------------------------------------------------------  |
|          a. Primary Language: Select "English (United States) - en-US"     |
|          b. Additional Languages: Leave unchecked for now                  |
|             (Hindi will be handled by Dialogflow CX)                       |
|          c. Click "Next"                                                   |
|                                                                             |
|  Step 6: Configure Voice Settings                                          |
|  -------------------------------------------------------------------------  |
|          a. Voice Selection:                                               |
|             - Click dropdown under "English (US)"                          |
|             - Select "en-US-Neural2-J" (Male voice)                        |
|             - Click [>] preview button to hear sample                      |
|                                                                             |
|          b. Voice Parameters:                                              |
|             Field                | Value                                   |
|             ---------------------+----------------------------------------  |
|             Speaking Rate        | 1.0 (default)                           |
|             Pitch                | 0 (default)                             |
|                                                                             |
|          c. Click "Next"                                                   |
|                                                                             |
|  Step 7: Configure Conversation Settings                                   |
|  -------------------------------------------------------------------------  |
|          a. Enter the following values:                                    |
|                                                                             |
|             Field                     | Value  | Notes                     |
|             --------------------------+--------+--------------------------  |
|             No-Input Timeout          | 5      | seconds                   |
|             Speech Complete Timeout   | 2      | seconds                   |
|             Max No-Input Retries      | 3      | before escalation         |
|             Max No-Match Retries      | 3      | before escalation         |
|             Barge-In                  | * On   | allow interruption        |
|             DTMF Collection           | * On   | accept keypad input       |
|             Inter-digit Timeout       | 3      | seconds                   |
|                                                                             |
|          b. Click "Next"                                                   |
|                                                                             |
|  Step 8: Configure Advanced Settings                                       |
|  -------------------------------------------------------------------------  |
|          a. Enter the following values:                                    |
|                                                                             |
|             Field                     | Value                              |
|             --------------------------+----------------------------------  |
|             Confidence Threshold      | 0.6                                |
|             Logging Level             | Standard                           |
|             Session Timeout           | 300 (seconds)                      |
|             Enable Analytics          | [x] Checked                          |
|                                                                             |
|          b. Click "Create"                                                 |
|                                                                             |
|  Step 9: Verify Creation                                                   |
|  -------------------------------------------------------------------------  |
|          a. Wait for "Virtual Agent created successfully" message          |
|          b. Verify "Abhi_Simple_VA" appears in the Virtual Agent list      |
|          c. Status should show "Draft" (no intents configured yet)         |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Agent "Abhi_Simple_VA" visible in list with "Draft" status  |
|      If error: Note error message and check prerequisites                  |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 2.2.1                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 2.2 Configuring Intents

### Procedure: Create Intent - greeting.hello

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 2.2.1: CREATE INTENT - greeting.hello                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 10 minutes                                                |
|  Prerequisites: Procedure 2.1.1 completed                                  |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Open Agent for Editing                                            |
|  -------------------------------------------------------------------------  |
|          a. In Virtual Agent list, click "Abhi_Simple_VA"                  |
|          b. Agent configuration page opens                                 |
|          c. Click "Intents" tab                                            |
|                                                                             |
|  Step 2: Create New Intent                                                 |
|  -------------------------------------------------------------------------  |
|          a. Click "+ Add Intent" button                                    |
|          b. Intent creation form opens                                     |
|                                                                             |
|  Step 3: Configure Intent Details                                          |
|  -------------------------------------------------------------------------  |
|          a. Enter basic information:                                       |
|                                                                             |
|             Field                | Value                                   |
|             ---------------------+----------------------------------------  |
|             Intent Name          | greeting.hello                          |
|             Description          | Welcome and initial greeting            |
|             Priority             | Normal                                  |
|                                                                             |
|  Step 4: Add Training Phrases                                              |
|  -------------------------------------------------------------------------  |
|          a. In "Training Phrases" section, click "+ Add Phrase"            |
|          b. Add each phrase below (press Enter after each):                |
|                                                                             |
|             Training Phrase #    | Text                                    |
|             ---------------------+----------------------------------------  |
|             1                    | Hello                                   |
|             2                    | Hi                                      |
|             3                    | Hey                                     |
|             4                    | Good morning                            |
|             5                    | Good afternoon                          |
|             6                    | Good evening                            |
|             7                    | Hi there                                |
|             8                    | Hello there                             |
|             9                    | Hey there                               |
|             10                   | Greetings                               |
|             11                   | I need help                             |
|             12                   | Can you help me                         |
|             13                   | I'm calling about                       |
|             14                   | I have a question                       |
|             15                   | Is anyone there                         |
|                                                                             |
|          c. Verify all 15 phrases appear in the list                       |
|                                                                             |
|  Step 5: Configure Response                                                |
|  -------------------------------------------------------------------------  |
|          a. Scroll to "Response" section                                   |
|          b. Select Response Type: * Text-to-Speech                         |
|          c. In the text box, enter:                                        |
|                                                                             |
|          +-------------------------------------------------------------+   |
|          |  Hello! Welcome to Abhavtech. I'm Abhi, your virtual       |   |
|          |  assistant.                                                 |   |
|          |                                                             |   |
|          |  I can help you with business hours and locations, request |   |
|          |  a callback, or connect you to one of our team members.    |   |
|          |                                                             |   |
|          |  How can I help you today?                                  |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|  Step 6: Configure Follow-up Action                                        |
|  -------------------------------------------------------------------------  |
|          a. In "Follow-up Action" section:                                 |
|             * Listen for next input      <- SELECT THIS                     |
|             O End conversation                                             |
|             O Transfer to flow                                             |
|                                                                             |
|  Step 7: Save Intent                                                       |
|  -------------------------------------------------------------------------  |
|          a. Click "Save" button                                            |
|          b. Wait for "Intent saved successfully" message                   |
|          c. Intent appears in the intent list                              |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: "greeting.hello" intent visible with 15 training phrases    |
|      If error: Verify all required fields are completed                    |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 2.2.2                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Procedure: Create Intent - hours.location

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 2.2.2: CREATE INTENT - hours.location                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 10 minutes                                                |
|  Prerequisites: Procedure 2.2.1 completed                                  |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Create New Intent                                                 |
|  -------------------------------------------------------------------------  |
|          a. In Intents tab, click "+ Add Intent"                           |
|                                                                             |
|  Step 2: Configure Intent Details                                          |
|  -------------------------------------------------------------------------  |
|             Field                | Value                                   |
|             ---------------------+----------------------------------------  |
|             Intent Name          | hours.location                          |
|             Description          | Business hours and office location      |
|             Priority             | Normal                                  |
|                                                                             |
|  Step 3: Add Training Phrases (20 total)                                   |
|  -------------------------------------------------------------------------  |
|                                                                             |
|          Hours-related (10):                                               |
|          1.  What are your hours                                           |
|          2.  What time do you open                                         |
|          3.  What time do you close                                        |
|          4.  Are you open now                                              |
|          5.  Business hours                                                |
|          6.  When are you open                                             |
|          7.  Operating hours                                               |
|          8.  What are your working hours                                   |
|          9.  Are you open on weekends                                      |
|          10. Are you open on Sunday                                        |
|                                                                             |
|          Location-related (10):                                            |
|          11. Where are you located                                         |
|          12. What is your address                                          |
|          13. Office location                                               |
|          14. Where is your office                                          |
|          15. How do I get to your office                                   |
|          16. Directions to your office                                     |
|          17. Office address                                                |
|          18. Location please                                               |
|          19. Where are you                                                 |
|          20. What city are you in                                          |
|                                                                             |
|  Step 4: Configure Response                                                |
|  -------------------------------------------------------------------------  |
|          Response Type: * Text-to-Speech                                   |
|                                                                             |
|          +-------------------------------------------------------------+   |
|          |  Our main support center in Mumbai is available 24 hours   |   |
|          |  a day, 7 days a week.                                     |   |
|          |                                                             |   |
|          |  Our regional offices operate Monday through Friday:       |   |
|          |  India offices: 9 AM to 9 PM Indian Standard Time.         |   |
|          |  London office: 9 AM to 6 PM British Time.                 |   |
|          |  New Jersey office: 9 AM to 6 PM Eastern Time.             |   |
|          |                                                             |   |
|          |  Our headquarters is located in Mumbai, India.             |   |
|          |                                                             |   |
|          |  Is there anything else I can help you with?               |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|  Step 5: Configure Follow-up Action                                        |
|  -------------------------------------------------------------------------  |
|          * Listen for next input                                           |
|                                                                             |
|  Step 6: Mark as Contained                                                 |
|  -------------------------------------------------------------------------  |
|          a. Check: [x] Mark as contained (self-service complete)             |
|             (This flags the interaction for containment analytics)         |
|                                                                             |
|  Step 7: Save Intent                                                       |
|  -------------------------------------------------------------------------  |
|          a. Click "Save"                                                   |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: "hours.location" intent with 20 phrases and containment     |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 2.2.3                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Procedure: Create Intent - callback.request

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 2.2.3: CREATE INTENT - callback.request                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 10 minutes                                                |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Create New Intent                                                 |
|  -------------------------------------------------------------------------  |
|             Field                | Value                                   |
|             ---------------------+----------------------------------------  |
|             Intent Name          | callback.request                        |
|             Description          | Customer requests a callback            |
|             Priority             | High                                    |
|                                                                             |
|  Step 2: Add Training Phrases (18 total)                                   |
|  -------------------------------------------------------------------------  |
|          1.  Call me back                                                  |
|          2.  Request a callback                                            |
|          3.  I want a callback                                             |
|          4.  Can you call me back                                          |
|          5.  Please call me back                                           |
|          6.  I'd like a callback                                           |
|          7.  Schedule a callback                                           |
|          8.  Callback please                                               |
|          9.  I don't want to wait                                          |
|          10. Rather than wait can you call me                              |
|          11. Have someone call me                                          |
|          12. Get someone to call me                                        |
|          13. Don't want to hold                                            |
|          14. Too long to wait                                              |
|          15. I'll take a callback                                          |
|          16. Put me on the callback list                                   |
|          17. Call me instead                                               |
|          18. Ring me back                                                  |
|                                                                             |
|  Step 3: Configure Response                                                |
|  -------------------------------------------------------------------------  |
|          +-------------------------------------------------------------+   |
|          |  I'll arrange for one of our team members to call you back.|   |
|          |  We'll call you at the number you're calling from.         |   |
|          |  Is that okay?                                             |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|  Step 4: Configure Follow-up Action                                        |
|  -------------------------------------------------------------------------  |
|          a. Select: O Transfer to flow                                     |
|          b. Flow Selection: Callback_Flow_v1                               |
|          c. Variables to pass:                                             |
|             - callback_requested = true                                    |
|             - callback_number = {{ANI}}                                    |
|                                                                             |
|  Step 5: Mark as Contained                                                 |
|  -------------------------------------------------------------------------  |
|          [x] Mark as contained                                               |
|                                                                             |
|  Step 6: Save Intent                                                       |
|  -------------------------------------------------------------------------  |
|          Click "Save"                                                      |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 2.2.4                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Procedure: Create Intent - agent.handoff

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 2.2.4: CREATE INTENT - agent.handoff                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 10 minutes                                                |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Create New Intent                                                 |
|  -------------------------------------------------------------------------  |
|             Field                | Value                                   |
|             ---------------------+----------------------------------------  |
|             Intent Name          | agent.handoff                           |
|             Description          | Customer requests human agent           |
|             Priority             | High                                    |
|                                                                             |
|  Step 2: Add Training Phrases (25 total)                                   |
|  -------------------------------------------------------------------------  |
|                                                                             |
|          Direct requests:                                                  |
|          1.  Speak to an agent                                             |
|          2.  Talk to a human                                               |
|          3.  Human please                                                  |
|          4.  Agent please                                                  |
|          5.  Real person                                                   |
|          6.  Transfer me                                                   |
|          7.  Connect me to someone                                         |
|          8.  I want to talk to a person                                    |
|          9.  Get me a representative                                       |
|          10. Let me speak to someone                                       |
|          11. Operator                                                      |
|          12. Representative                                                |
|          13. Customer service                                              |
|                                                                             |
|          Frustration indicators:                                           |
|          14. I don't want to talk to a bot                                 |
|          15. You're not helping                                            |
|          16. This isn't working                                            |
|          17. You don't understand                                          |
|          18. I need a real person                                          |
|          19. Stop, I want an agent                                         |
|          20. Just transfer me                                              |
|          21. Enough with the robot                                         |
|          22. I'm done with this bot                                        |
|                                                                             |
|          Polite variants:                                                  |
|          23. Could I please speak to someone                               |
|          24. Would it be possible to talk to a person                      |
|          25. May I speak with a representative                             |
|                                                                             |
|  Step 3: Configure Response                                                |
|  -------------------------------------------------------------------------  |
|          +-------------------------------------------------------------+   |
|          |  Of course! I'll connect you with one of our team members  |   |
|          |  right away. Please hold while I transfer you.             |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|  Step 4: Configure Follow-up Action                                        |
|  -------------------------------------------------------------------------  |
|          a. Select: * Exit to flow with escalation                         |
|          b. Exit Reason: agent_requested                                   |
|          c. Context Output Variables:                                      |
|             - escalation_reason = "customer_requested"                     |
|                                                                             |
|  Step 5: Save Intent                                                       |
|  -------------------------------------------------------------------------  |
|          Click "Save"                                                      |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 2.2.5                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Procedure: Configure Fallback Intent

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 2.2.5: CONFIGURE FALLBACK INTENT                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 5 minutes                                                 |
|  Note: Fallback is a system intent - it already exists                     |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Access Fallback Intent                                            |
|  -------------------------------------------------------------------------  |
|          a. In Intents list, find "fallback.default" (system intent)       |
|          b. Click to edit                                                  |
|                                                                             |
|  Step 2: Configure Fallback Responses                                      |
|  -------------------------------------------------------------------------  |
|          a. Response for Attempt 1:                                        |
|          +-------------------------------------------------------------+   |
|          |  I didn't quite catch that. Could you please repeat what   |   |
|          |  you need help with? You can say things like "business     |   |
|          |  hours" or "request a callback".                           |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|          b. Response for Attempt 2:                                        |
|          +-------------------------------------------------------------+   |
|          |  I'm still having trouble understanding. You can also      |   |
|          |  press 1 for Sales, 2 for Support, 3 for Billing, or 0     |   |
|          |  to speak with an agent.                                   |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|          c. Response for Attempt 3+ (Max retries):                         |
|          +-------------------------------------------------------------+   |
|          |  Let me connect you with someone who can better assist you.|   |
|          |  Please hold.                                              |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|  Step 3: Configure DTMF Fallback Mapping                                   |
|  -------------------------------------------------------------------------  |
|          a. Enable DTMF collection on fallback                             |
|          b. Configure mappings:                                            |
|                                                                             |
|             Key | Action                    | Flow Variable               |
|             ----+---------------------------+----------------------------  |
|             1   | Route to Sales            | selected_queue = "Sales"    |
|             2   | Route to Support          | selected_queue = "Support"  |
|             3   | Route to Billing          | selected_queue = "Billing"  |
|             0   | Route to Agent            | selected_queue = "Support"  |
|             *   | Repeat menu               | (replay prompt)             |
|                                                                             |
|  Step 4: Configure Max Retries Action                                      |
|  -------------------------------------------------------------------------  |
|          After max retries: * Exit to flow with escalation                 |
|          Exit Reason: max_retries_exceeded                                 |
|                                                                             |
|  Step 5: Save Changes                                                      |
|  -------------------------------------------------------------------------  |
|          Click "Save"                                                      |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - All intents configured                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 2.4 Testing the Webex AI Agent

### Procedure: Test Agent in Simulator

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 2.4.1: TEST WEBEX AI AGENT IN SIMULATOR                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 15 minutes                                                |
|  Prerequisites: All intents configured (Procedures 2.2.1-2.2.5)            |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Access Simulator                                                  |
|  -------------------------------------------------------------------------  |
|          a. In Virtual Agent configuration page                            |
|          b. Click "Test" button (top-right)                                |
|          c. Simulator panel opens on right side                            |
|                                                                             |
|  Step 2: Test greeting.hello Intent                                        |
|  -------------------------------------------------------------------------  |
|          a. In text input, type: Hello                                     |
|          b. Press Enter                                                    |
|          c. Verify response matches expected greeting                      |
|                                                                             |
|          Expected Response:                                                |
|          "Hello! Welcome to Abhavtech. I'm Abhi..."                        |
|                                                                             |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 3: Test hours.location Intent                                        |
|  -------------------------------------------------------------------------  |
|          a. Type: What are your business hours                             |
|          b. Press Enter                                                    |
|          c. Verify hours/location response                                 |
|                                                                             |
|          Expected Response:                                                |
|          "Our main support center in Mumbai..."                            |
|                                                                             |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 4: Test callback.request Intent                                      |
|  -------------------------------------------------------------------------  |
|          a. Type: I want a callback                                        |
|          b. Press Enter                                                    |
|          c. Verify callback confirmation response                          |
|                                                                             |
|          Expected Response:                                                |
|          "I'll arrange for one of our team members..."                     |
|                                                                             |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 5: Test agent.handoff Intent                                         |
|  -------------------------------------------------------------------------  |
|          a. Click "Reset" to start new session                             |
|          b. Type: I want to speak to a human                               |
|          c. Press Enter                                                    |
|          d. Verify handoff response                                        |
|                                                                             |
|          Expected Response:                                                |
|          "Of course! I'll connect you..."                                  |
|          Exit Reason: agent_requested                                      |
|                                                                             |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 6: Test Fallback Behavior                                            |
|  -------------------------------------------------------------------------  |
|          a. Click "Reset"                                                  |
|          b. Type: asdfghjkl (gibberish)                                    |
|          c. Press Enter                                                    |
|          d. Verify fallback response                                       |
|                                                                             |
|          Expected Response:                                                |
|          "I didn't quite catch that..."                                    |
|                                                                             |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 7: Document Test Results                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|          Test Summary:                                                     |
|          | Intent              | Status | Notes                      |    |
|          |---------------------|--------|----------------------------|    |
|          | greeting.hello      |        |                            |    |
|          | hours.location      |        |                            |    |
|          | callback.request    |        |                            |    |
|          | agent.handoff       |        |                            |    |
|          | fallback.default    |        |                            |    |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: All 5 tests PASS                                            |
|      If failures: Review intent configuration and training phrases         |
|                                                                             |
|  Step 8: Publish Agent                                                     |
|  -------------------------------------------------------------------------  |
|          a. Close simulator                                                |
|          b. Click "Publish" button                                         |
|          c. Confirm publication                                            |
|          d. Status changes from "Draft" to "Published"                     |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Webex AI Agent ready for flow integration         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## SECTION 3: GOOGLE CLOUD PLATFORM - PROJECT SETUP 

---

## 3.1 Creating a GCP Project

### Procedure: Create New GCP Project

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 3.1.1: CREATE GCP PROJECT FOR DIALOGFLOW CX                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 10 minutes                                                |
|  Prerequisites: Procedure 1.1.2 completed (GCP access verified)            |
|                                                                             |
|  Project Details:                                                          |
|  -------------------------------------------------------------------------  |
|  Project Name:    Abhavtech WxCC AI                                        |
|  Project ID:      abhavtech-wxcc-ai                                        |
|  Region:          asia-south1 (Mumbai)                                     |
|  Purpose:         Dialogflow CX Virtual Agent                              |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Project Creation                                      |
|  -------------------------------------------------------------------------  |
|          a. Open browser: https://console.cloud.google.com                 |
|          b. Log in with your GCP credentials                               |
|          c. Click the project dropdown (top navigation bar)                |
|          d. Click "NEW PROJECT" button (top-right of popup)                |
|                                                                             |
|          [Screenshot placeholder: GCP Console - New Project button]        |
|                                                                             |
|  Step 2: Configure Project Details                                         |
|  -------------------------------------------------------------------------  |
|          a. Project name: Abhavtech WxCC AI                                |
|          b. Project ID: Click "EDIT" and enter: abhavtech-wxcc-ai          |
|                                                                             |
|             [!]️ IMPORTANT: Project ID must be globally unique.              |
|             If "abhavtech-wxcc-ai" is taken, append a number:              |
|             e.g., abhavtech-wxcc-ai-001                                    |
|                                                                             |
|          c. Organization: Select "abhavtech.com" from dropdown             |
|          d. Location: Select appropriate folder or leave as organization   |
|                                                                             |
|             Field            | Value                                       |
|             -----------------+------------------------------------------   |
|             Project name     | Abhavtech WxCC AI                           |
|             Project ID       | abhavtech-wxcc-ai                           |
|             Organization     | abhavtech.com                               |
|             Location         | abhavtech.com (or specific folder)          |
|                                                                             |
|  Step 3: Create Project                                                    |
|  -------------------------------------------------------------------------  |
|          a. Click "CREATE" button                                          |
|          b. Wait for project creation (30-60 seconds)                      |
|          c. Notification appears: "Create Project: Abhavtech WxCC AI"      |
|          d. Click "SELECT PROJECT" in the notification                     |
|                                                                             |
|  Step 4: Link Billing Account                                              |
|  -------------------------------------------------------------------------  |
|          a. After project loads, you may see "This project has no          |
|             billing account" warning                                       |
|          b. Click "Link a billing account"                                 |
|          c. Select your billing account from the dropdown                  |
|          d. Click "SET ACCOUNT"                                            |
|                                                                             |
|             OR navigate manually:                                          |
|          a. Click Navigation Menu (☰)                                      |
|          b. Click "Billing"                                                |
|          c. Click "LINK A BILLING ACCOUNT"                                 |
|          d. Select billing account                                         |
|          e. Click "SET ACCOUNT"                                            |
|                                                                             |
|  Step 5: Verify Project Creation                                           |
|  -------------------------------------------------------------------------  |
|          a. Click project dropdown (top navigation)                        |
|          b. Verify "Abhavtech WxCC AI" appears in project list             |
|          c. Verify project ID shows as "abhavtech-wxcc-ai"                 |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Project created with billing linked                         |
|      Verify: Project dropdown shows "Abhavtech WxCC AI"                    |
|                                                                             |
|  Step 6: Record Project Information                                        |
|  -------------------------------------------------------------------------  |
|          Document for future reference:                                    |
|                                                                             |
|          Project Name:     _______________________________                 |
|          Project ID:       _______________________________                 |
|          Project Number:   _______________________________                 |
|          (Find project number in Project settings)                         |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 3.2.1                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.2 Enabling Required APIs

### Procedure: Enable Dialogflow CX API

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 3.2.1: ENABLE REQUIRED GOOGLE CLOUD APIS                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 5 minutes                                                 |
|  Prerequisites: Procedure 3.1.1 completed                                  |
|                                                                             |
|  Required APIs:                                                            |
|  -------------------------------------------------------------------------  |
|  1. Dialogflow API                                                         |
|  2. Cloud Speech-to-Text API                                               |
|  3. Cloud Text-to-Speech API                                               |
|  4. Cloud Functions API (for webhooks)                                     |
|  5. Cloud Run API (alternative for webhooks)                               |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to API Library                                           |
|  -------------------------------------------------------------------------  |
|          a. Ensure "Abhavtech WxCC AI" project is selected                 |
|          b. Click Navigation Menu (☰)                                      |
|          c. Navigate to: APIs & Services -> Library                         |
|                                                                             |
|          [Screenshot placeholder: GCP Console - API Library]               |
|                                                                             |
|  Step 2: Enable Dialogflow API                                             |
|  -------------------------------------------------------------------------  |
|          a. In search box, type: Dialogflow API                            |
|          b. Click "Dialogflow API" in results                              |
|          c. Click "ENABLE" button                                          |
|          d. Wait for API to enable (10-30 seconds)                         |
|          e. "API enabled" confirmation appears                             |
|                                                                             |
|          [ ] Dialogflow API enabled                                          |
|                                                                             |
|  Step 3: Enable Speech-to-Text API                                         |
|  -------------------------------------------------------------------------  |
|          a. Click "APIs & Services" in breadcrumb to return to Library     |
|          b. Search for: Cloud Speech-to-Text API                           |
|          c. Click the result                                               |
|          d. Click "ENABLE"                                                 |
|          e. Wait for confirmation                                          |
|                                                                             |
|          [ ] Cloud Speech-to-Text API enabled                                |
|                                                                             |
|  Step 4: Enable Text-to-Speech API                                         |
|  -------------------------------------------------------------------------  |
|          a. Return to API Library                                          |
|          b. Search for: Cloud Text-to-Speech API                           |
|          c. Click the result                                               |
|          d. Click "ENABLE"                                                 |
|          e. Wait for confirmation                                          |
|                                                                             |
|          [ ] Cloud Text-to-Speech API enabled                                |
|                                                                             |
|  Step 5: Enable Cloud Functions API                                        |
|  -------------------------------------------------------------------------  |
|          a. Return to API Library                                          |
|          b. Search for: Cloud Functions API                                |
|          c. Click the result                                               |
|          d. Click "ENABLE"                                                 |
|          e. Wait for confirmation                                          |
|                                                                             |
|          [ ] Cloud Functions API enabled                                     |
|                                                                             |
|  Step 6: Enable Cloud Build API (required for Cloud Functions)             |
|  -------------------------------------------------------------------------  |
|          a. Return to API Library                                          |
|          b. Search for: Cloud Build API                                    |
|          c. Click the result                                               |
|          d. Click "ENABLE"                                                 |
|                                                                             |
|          [ ] Cloud Build API enabled                                         |
|                                                                             |
|  Step 7: Verify All APIs Enabled                                           |
|  -------------------------------------------------------------------------  |
|          a. Navigate to: APIs & Services -> Enabled APIs & services         |
|          b. Verify all 5 APIs appear in the enabled list:                  |
|                                                                             |
|             [ ] Dialogflow API                                               |
|             [ ] Cloud Speech-to-Text API                                     |
|             [ ] Cloud Text-to-Speech API                                     |
|             [ ] Cloud Functions API                                          |
|             [ ] Cloud Build API                                              |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: All 5 APIs show "Enabled" status                            |
|      If any missing: Repeat enable steps for that API                      |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 3.3.1                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.3 Creating a Service Account

### Procedure: Create Service Account for WxCC Integration

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 3.3.1: CREATE SERVICE ACCOUNT FOR CCAI CONNECTOR                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 10 minutes                                                |
|  Prerequisites: Procedure 3.2.1 completed                                  |
|                                                                             |
|  Service Account Details:                                                  |
|  -------------------------------------------------------------------------  |
|  Name:        WxCC CCAI Connector                                          |
|  ID:          wxcc-ccai-connector                                          |
|  Purpose:     Allow WxCC to authenticate with Dialogflow CX                |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Service Accounts                                      |
|  -------------------------------------------------------------------------  |
|          a. Ensure "Abhavtech WxCC AI" project is selected                 |
|          b. Click Navigation Menu (☰)                                      |
|          c. Navigate to: IAM & Admin -> Service Accounts                    |
|                                                                             |
|          [Screenshot placeholder: GCP Console - Service Accounts]          |
|                                                                             |
|  Step 2: Create Service Account                                            |
|  -------------------------------------------------------------------------  |
|          a. Click "+ CREATE SERVICE ACCOUNT" (top of page)                 |
|          b. Service account creation wizard opens                          |
|                                                                             |
|  Step 3: Configure Service Account Details (Step 1 of 3)                   |
|  -------------------------------------------------------------------------  |
|          a. Enter the following:                                           |
|                                                                             |
|             Field                    | Value                               |
|             -------------------------+----------------------------------   |
|             Service account name     | WxCC CCAI Connector                 |
|             Service account ID       | wxcc-ccai-connector                 |
|                                      | (auto-generated from name)          |
|             Description              | Service account for Webex Contact  |
|                                      | Center CCAI integration             |
|                                                                             |
|          b. Note the generated email address:                              |
|             wxcc-ccai-connector@abhavtech-wxcc-ai.iam.gserviceaccount.com  |
|                                                                             |
|          c. Click "CREATE AND CONTINUE"                                    |
|                                                                             |
|  Step 4: Grant Service Account Access (Step 2 of 3)                        |
|  -------------------------------------------------------------------------  |
|          a. Click "Select a role" dropdown                                 |
|          b. Search for and select: "Dialogflow API Admin"                  |
|          c. Click "+ ADD ANOTHER ROLE"                                     |
|          d. Search for and select: "Dialogflow API Client"                 |
|                                                                             |
|             Required Roles:                                                |
|             [ ] Dialogflow API Admin                                         |
|             [ ] Dialogflow API Client                                        |
|                                                                             |
|          e. Click "CONTINUE"                                               |
|                                                                             |
|  Step 5: Grant Users Access (Step 3 of 3)                                  |
|  -------------------------------------------------------------------------  |
|          a. This step is optional for our use case                         |
|          b. Click "DONE"                                                   |
|                                                                             |
|  Step 6: Verify Service Account Created                                    |
|  -------------------------------------------------------------------------  |
|          a. Service account appears in the list                            |
|          b. Verify email: wxcc-ccai-connector@abhavtech-wxcc-ai.iam...     |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Service account visible in list with correct roles          |
|                                                                             |
|  Step 7: Record Service Account Information                                |
|  -------------------------------------------------------------------------  |
|          Document for WxCC configuration:                                  |
|                                                                             |
|          Service Account Email: ___________________________________        |
|          (Full email including @...iam.gserviceaccount.com)               |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 3.5.1                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.5 Generating Service Account Key

### Procedure: Generate and Download JSON Key

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 3.5.1: GENERATE SERVICE ACCOUNT KEY                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 5 minutes                                                 |
|  Prerequisites: Procedure 3.3.1 completed                                  |
|                                                                             |
|  [!]️ SECURITY WARNING:                                                      |
|  -------------------------------------------------------------------------  |
|  The JSON key file contains sensitive credentials. Handle with care:       |
|  * Download only to secure, encrypted storage                              |
|  * Never commit to version control (git)                                   |
|  * Never share via email or chat                                           |
|  * Store in secure credential management system                            |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Service Account                                       |
|  -------------------------------------------------------------------------  |
|          a. Go to: IAM & Admin -> Service Accounts                          |
|          b. Click on "wxcc-ccai-connector" service account                 |
|                                                                             |
|  Step 2: Navigate to Keys Tab                                              |
|  -------------------------------------------------------------------------  |
|          a. Click "KEYS" tab (top of page)                                 |
|          b. Current keys (if any) are displayed                            |
|                                                                             |
|  Step 3: Create New Key                                                    |
|  -------------------------------------------------------------------------  |
|          a. Click "ADD KEY" dropdown                                       |
|          b. Select "Create new key"                                        |
|          c. Key type dialog opens                                          |
|                                                                             |
|  Step 4: Select Key Type                                                   |
|  -------------------------------------------------------------------------  |
|          a. Select: * JSON (recommended)                                   |
|             (Do NOT select P12)                                            |
|          b. Click "CREATE"                                                 |
|                                                                             |
|  Step 5: Download Key File                                                 |
|  -------------------------------------------------------------------------  |
|          a. JSON key file automatically downloads                          |
|          b. Filename format: abhavtech-wxcc-ai-[key-id].json               |
|          c. Browser shows "Private key saved to your computer"             |
|                                                                             |
|          [!]️ This is the ONLY time you can download this key.               |
|             If lost, you must create a new key.                            |
|                                                                             |
|  Step 6: Secure the Key File                                               |
|  -------------------------------------------------------------------------  |
|          a. Move file from Downloads to secure location                    |
|          b. Rename to: abhavtech-wxcc-ccai-key.json                        |
|          c. Recommended storage:                                           |
|             - Corporate password manager (e.g., 1Password, Vault)          |
|             - Encrypted USB drive for offline backup                       |
|             - AWS Secrets Manager / Azure Key Vault / GCP Secret Manager   |
|                                                                             |
|  Step 7: Verify Key Contents                                               |
|  -------------------------------------------------------------------------  |
|          Open JSON file in text editor and verify it contains:             |
|                                                                             |
|          {                                                                 |
|            "type": "service_account",                                      |
|            "project_id": "abhavtech-wxcc-ai",                              |
|            "private_key_id": "...",                                        |
|            "private_key": "-----BEGIN PRIVATE KEY-----\n...",              |
|            "client_email": "wxcc-ccai-connector@abhavtech-wxcc-ai...",     |
|            "client_id": "...",                                             |
|            "auth_uri": "https://accounts.google.com/o/oauth2/auth",        |
|            "token_uri": "https://oauth2.googleapis.com/token",             |
|            ...                                                             |
|          }                                                                 |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: JSON file downloaded and contains all required fields       |
|      If download failed: Repeat from Step 3                                |
|                                                                             |
|  Step 8: Record Key Information                                            |
|  -------------------------------------------------------------------------  |
|          Document (do NOT record the private key itself):                  |
|                                                                             |
|          Key ID:           _______________________________                 |
|          Created Date:     _______________________________                 |
|          Storage Location: _______________________________                 |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Key ready for WxCC CCAI Connector configuration   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## SECTION 4: DIALOGFLOW CX - AGENT CREATION 

---

## 4.1 Creating a Dialogflow CX Agent

### Procedure: Create Dialogflow CX Agent

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 4.1.1: CREATE DIALOGFLOW CX AGENT                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 15 minutes                                                |
|  Prerequisites: Section 3 procedures completed                             |
|                                                                             |
|  Agent Details:                                                            |
|  -------------------------------------------------------------------------  |
|  Display Name:    Abhi VA                                                  |
|  Location:        asia-south1 (Mumbai)                                     |
|  Default Language: English (en)                                            |
|  Time Zone:       Asia/Kolkata (IST)                                       |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Dialogflow CX Console                                 |
|  -------------------------------------------------------------------------  |
|          a. Open browser: https://dialogflow.cloud.google.com/cx           |
|          b. Sign in with your GCP account                                  |
|          c. Select project: "Abhavtech WxCC AI" from dropdown              |
|                                                                             |
|          Alternative navigation from GCP Console:                          |
|          a. Navigation Menu (☰) -> Artificial Intelligence -> Dialogflow CX  |
|                                                                             |
|          [Screenshot placeholder: Dialogflow CX Console - Agent List]      |
|                                                                             |
|  Step 2: Initiate Agent Creation                                           |
|  -------------------------------------------------------------------------  |
|          a. Click "Create agent" button                                    |
|          b. Agent creation dialog opens                                    |
|                                                                             |
|  Step 3: Configure Agent Basics                                            |
|  -------------------------------------------------------------------------  |
|          a. Enter the following values:                                    |
|                                                                             |
|             Field              | Value                                     |
|             -------------------+-----------------------------------------  |
|             Display name       | Abhi VA                                   |
|             Location           | asia-south1 (Mumbai, India)               |
|                                                                             |
|             [!]️ IMPORTANT: Location cannot be changed after creation.       |
|             Select asia-south1 for India data residency compliance.        |
|                                                                             |
|  Step 4: Configure Language Settings                                       |
|  -------------------------------------------------------------------------  |
|          a. Default language: English - en                                 |
|          b. Time zone: (GMT+5:30) Asia/Kolkata                             |
|                                                                             |
|          NOTE: Additional languages (Hindi) will be added after creation   |
|                                                                             |
|  Step 5: Create Agent                                                      |
|  -------------------------------------------------------------------------  |
|          a. Click "Create" button                                          |
|          b. Wait for agent creation (30-60 seconds)                        |
|          c. Agent opens in Dialogflow CX Console                           |
|                                                                             |
|  Step 6: Verify Agent Creation                                             |
|  -------------------------------------------------------------------------  |
|          Verify the following in the Dialogflow CX Console:                |
|                                                                             |
|          [ ] Agent name "Abhi VA" appears in header                          |
|          [ ] Location shows "asia-south1"                                    |
|          [ ] Default Start Flow is created                                   |
|          [ ] Build and Manage sections visible in left panel                 |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Agent created in asia-south1 region                         |
|      If wrong region: Delete agent and recreate with correct region        |
|                                                                             |
|  Step 7: Record Agent Information                                          |
|  -------------------------------------------------------------------------  |
|          Document for WxCC configuration:                                  |
|                                                                             |
|          Agent Display Name: _______________________________               |
|          Agent ID:           _______________________________               |
|          Location:           _______________________________               |
|                                                                             |
|          To find Agent ID:                                                 |
|          a. Click Agent Settings (gear icon)                               |
|          b. Agent ID is shown in the settings panel                        |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 4.2.1                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 4.2 Configuring Agent Settings

### Procedure: Configure Agent Settings

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 4.2.1: CONFIGURE DIALOGFLOW CX AGENT SETTINGS                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 10 minutes                                                |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Access Agent Settings                                             |
|  -------------------------------------------------------------------------  |
|          a. In Dialogflow CX Console, with agent open                      |
|          b. Click gear icon (⚙️) next to agent name                        |
|          c. Settings panel opens                                           |
|                                                                             |
|  Step 2: Configure General Settings                                        |
|  -------------------------------------------------------------------------  |
|          a. Navigate to: General -> General                                 |
|          b. Configure:                                                     |
|                                                                             |
|             Field                    | Value                               |
|             -------------------------+----------------------------------   |
|             Display name             | Abhi VA (no change)                 |
|             Default language         | en (English)                        |
|             Time zone                | Asia/Kolkata                        |
|             Description              | Abhavtech Virtual Agent for         |
|                                      | complex interactions                |
|                                                                             |
|  Step 3: Add Hindi Language Support                                        |
|  -------------------------------------------------------------------------  |
|          a. Navigate to: General -> Languages                               |
|          b. Click "+ Add language"                                         |
|          c. Select: Hindi (hi)                                             |
|          d. Click "Save"                                                   |
|                                                                             |
|          Enabled Languages:                                                |
|          [ ] English (en) - Default                                          |
|          [ ] Hindi (hi)                                                      |
|                                                                             |
|  Step 4: Configure Speech Settings                                         |
|  -------------------------------------------------------------------------  |
|          a. Navigate to: Speech and IVR -> Speech settings                  |
|          b. Configure:                                                     |
|                                                                             |
|             Field                         | Value                          |
|             ------------------------------+-------------------------------  |
|             Speech model                  | phone_call (enhanced)          |
|             Enable speech adaptation      | [x] Enabled                      |
|             Audio encoding                | AUDIO_ENCODING_LINEAR_16       |
|             Sample rate                   | 8000 Hz (telephony)            |
|             Enable automatic punctuation  | [x] Enabled                      |
|                                                                             |
|  Step 5: Configure Text-to-Speech Settings                                 |
|  -------------------------------------------------------------------------  |
|          a. Navigate to: Speech and IVR -> Synthesize speech settings       |
|          b. Configure for English:                                         |
|                                                                             |
|             Field              | Value                                     |
|             -------------------+-----------------------------------------  |
|             Voice name         | en-IN-Neural2-A (Male, Indian English)   |
|             Speaking rate      | 1.0                                       |
|             Pitch              | 0                                         |
|                                                                             |
|          c. Configure for Hindi:                                           |
|             Click "Add language" -> Hindi                                   |
|                                                                             |
|             Field              | Value                                     |
|             -------------------+-----------------------------------------  |
|             Voice name         | hi-IN-Neural2-A (Male)                    |
|             Speaking rate      | 1.0                                       |
|             Pitch              | 0                                         |
|                                                                             |
|  Step 6: Configure Advanced Speech Settings                                |
|  -------------------------------------------------------------------------  |
|          a. Navigate to: Speech and IVR -> Advanced speech settings         |
|          b. Configure:                                                     |
|                                                                             |
|             Field                         | Value                          |
|             ------------------------------+-------------------------------  |
|             No-speech timeout             | 5 seconds                      |
|             End of speech timeout         | 2 seconds                      |
|             Max speech length             | 60 seconds                     |
|             Barge-in                      | [x] Enabled                      |
|             Enable partial responses      | [x] Enabled                      |
|                                                                             |
|  Step 7: Configure Logging                                                 |
|  -------------------------------------------------------------------------  |
|          a. Navigate to: General -> Logging                                 |
|          b. Enable:                                                        |
|             [x] Enable Cloud Logging                                         |
|             [x] Enable conversation history                                  |
|             [x] Enable interaction logging                                   |
|                                                                             |
|  Step 8: Save All Settings                                                 |
|  -------------------------------------------------------------------------  |
|          a. Click "Save" button                                            |
|          b. Wait for confirmation                                          |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: All settings saved, Hindi language added                    |
|      Verify: Two languages shown in Languages section                      |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 4.3.1                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 4.3 Creating Intents

### Procedure: Create Intent - order.status

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 4.3.1: CREATE INTENT - order.status                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 15 minutes                                                |
|  Prerequisites: Procedure 4.2.1 completed                                  |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Intents                                               |
|  -------------------------------------------------------------------------  |
|          a. In Dialogflow CX Console, with "Abhi VA" agent open            |
|          b. In left panel under "Build", click "Intents"                   |
|          c. Intents list displays (shows Default Welcome Intent, etc.)     |
|                                                                             |
|  Step 2: Create New Intent                                                 |
|  -------------------------------------------------------------------------  |
|          a. Click "+ Create" button                                        |
|          b. Intent creation page opens                                     |
|                                                                             |
|  Step 3: Configure Intent Name                                             |
|  -------------------------------------------------------------------------  |
|          a. Display name: order.status                                     |
|          b. Description: Customer checking order status                    |
|                                                                             |
|  Step 4: Add Training Phrases                                              |
|  -------------------------------------------------------------------------  |
|          a. In "Training phrases" section                                  |
|          b. Click "+ Add training phrase"                                  |
|          c. Add each phrase (press Enter after each):                      |
|                                                                             |
|             English Training Phrases (20):                                 |
|             -----------------------------------------------------------    |
|             1.  What is my order status                                    |
|             2.  Check my order                                             |
|             3.  Where is my order                                          |
|             4.  Order status                                               |
|             5.  Track my order                                             |
|             6.  I want to check my order                                   |
|             7.  What happened to my order                                  |
|             8.  Has my order shipped                                       |
|             9.  When will my order arrive                                  |
|             10. I placed an order and want to know the status              |
|             11. Check order ORD-12345                                      |
|             12. Status of order number 12345                               |
|             13. Where is order ORD-67890                                   |
|             14. My order hasn't arrived                                    |
|             15. Order inquiry                                              |
|             16. I need to track a package                                  |
|             17. Did my order ship yet                                      |
|             18. Check on my recent order                                   |
|             19. Order tracking                                             |
|             20. Is my order on the way                                     |
|                                                                             |
|  Step 5: Annotate Entities in Training Phrases                             |
|  -------------------------------------------------------------------------  |
|          For phrases containing order numbers:                             |
|                                                                             |
|          a. In phrase "Check order ORD-12345":                             |
|             - Highlight "ORD-12345"                                        |
|             - Click highlighted text                                       |
|             - Select entity: @order_number (or create new)                 |
|                                                                             |
|          b. In phrase "Status of order number 12345":                      |
|             - Highlight "12345"                                            |
|             - Assign entity: @order_number                                 |
|                                                                             |
|          c. In phrase "Where is order ORD-67890":                          |
|             - Highlight "ORD-67890"                                        |
|             - Assign entity: @order_number                                 |
|                                                                             |
|  Step 6: Add Hindi Training Phrases                                        |
|  -------------------------------------------------------------------------  |
|          a. Click language dropdown (shows "en")                           |
|          b. Select "hi" (Hindi)                                            |
|          c. Add Hindi phrases:                                             |
|                                                                             |
|             Hindi Training Phrases (10):                                   |
|             -----------------------------------------------------------    |
|             1.  मेरे ऑर्डर का स्टेटस क्या है                                     |
|             2.  मेरा ऑर्डर कहाँ है                                              |
|             3.  ऑर्डर स्टेटस चेक करो                                            |
|             4.  मेरा ऑर्डर ट्रैक करो                                            |
|             5.  ऑर्डर कब आएगा                                                  |
|             6.  मेरा पार्सल कहाँ है                                             |
|             7.  ऑर्डर नंबर बारह तीन चार पांच का स्टेटस                          |
|             8.  शिपमेंट का स्टेटस                                               |
|             9.  डिलीवरी कब होगी                                                |
|             10. ऑर्डर अभी तक नहीं आया                                          |
|                                                                             |
|  Step 7: Save Intent                                                       |
|  -------------------------------------------------------------------------  |
|          a. Click "Save" button (top of page)                              |
|          b. Wait for "Intent saved" confirmation                           |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Intent "order.status" saved with 30 training phrases        |
|      Verify: Intent appears in Intents list                                |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Repeat for remaining intents                       |
|    (See Appendix 10-C for complete training phrase library)                |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 4.7 Configuring Webhooks

### Procedure: Configure Webhook for Fulfillment

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 4.7.1: CONFIGURE DIALOGFLOW CX WEBHOOK                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 15 minutes                                                |
|  Prerequisites: Webhook endpoint deployed (see Appendix 10-B)              |
|                                                                             |
|  Webhook Details:                                                          |
|  -------------------------------------------------------------------------  |
|  Name:          abhavtech-fulfillment                                      |
|  URL:           https://api.abhavtech.com/dialogflow/webhook               |
|  (OR Cloud Function URL if using GCP)                                      |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Webhooks                                              |
|  -------------------------------------------------------------------------  |
|          a. In Dialogflow CX Console, with agent open                      |
|          b. In left panel under "Manage", click "Webhooks"                 |
|          c. Webhooks list displays                                         |
|                                                                             |
|  Step 2: Create New Webhook                                                |
|  -------------------------------------------------------------------------  |
|          a. Click "+ Create" button                                        |
|          b. Webhook configuration page opens                               |
|                                                                             |
|  Step 3: Configure Webhook Details                                         |
|  -------------------------------------------------------------------------  |
|          a. Enter the following:                                           |
|                                                                             |
|             Field              | Value                                     |
|             -------------------+-----------------------------------------  |
|             Display name       | abhavtech-fulfillment                     |
|             Timeout            | 10 seconds                                |
|             Webhook URL        | https://api.abhavtech.com/dialogflow/     |
|                                | webhook                                   |
|                                                                             |
|  Step 4: Configure Authentication (if required)                            |
|  -------------------------------------------------------------------------  |
|          a. If webhook requires authentication:                            |
|             - Click "Authentication" section                               |
|             - Select authentication type:                                  |
|                                                                             |
|             Option A - API Key:                                            |
|             * API key header                                               |
|             Header name:  X-API-Key                                        |
|             API key:      [your-api-key]                                   |
|                                                                             |
|             Option B - OAuth:                                              |
|             * OAuth                                                        |
|             Client ID:     [client-id]                                     |
|             Client Secret: [client-secret]                                 |
|             Token URL:     [token-endpoint]                                |
|                                                                             |
|             Option C - Service Account (for Google Cloud):                 |
|             * Service agent auth header                                    |
|             (Uses Dialogflow's service account)                            |
|                                                                             |
|  Step 5: Configure Subresource (for specific use cases)                    |
|  -------------------------------------------------------------------------  |
|          a. For order lookups:                                             |
|             - Click "+ Add subresource"                                    |
|             - Tag: order_lookup                                            |
|             - URL suffix: /orders                                          |
|             - Full URL becomes: https://api.abhavtech.com/dialogflow/      |
|                                 webhook/orders                             |
|                                                                             |
|          b. For account lookups:                                           |
|             - Click "+ Add subresource"                                    |
|             - Tag: account_lookup                                          |
|             - URL suffix: /accounts                                        |
|                                                                             |
|  Step 6: Test Webhook Connection                                           |
|  -------------------------------------------------------------------------  |
|          a. Click "Test webhook" button (if available)                     |
|          b. Or save and test via simulator                                 |
|                                                                             |
|  Step 7: Save Webhook                                                      |
|  -------------------------------------------------------------------------  |
|          a. Click "Save" button                                            |
|          b. Webhook appears in webhooks list                               |
|                                                                             |
|  Step 8: Link Webhook to Intent Fulfillment                                |
|  -------------------------------------------------------------------------  |
|          a. Navigate to the relevant page (e.g., Order Status page)        |
|          b. In Entry fulfillment section:                                  |
|             - Click "Add fulfillment"                                      |
|             - Select "Webhook"                                             |
|             - Select: abhavtech-fulfillment                                |
|             - Tag: order_lookup                                            |
|          c. Save page                                                      |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Webhook configured and linked to relevant pages             |
|      Test: Use simulator with order number to verify webhook call          |
|                                                                             |
|  [OK] PROCEDURE COMPLETE                                                      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## SECTION 5: WEBEX CONTACT CENTER - CCAI CONNECTOR 

---

## 5.1 Creating CCAI Configuration

### Procedure: Create CCAI Connector in Control Hub

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 5.1.1: CREATE CCAI CONNECTOR FOR DIALOGFLOW CX                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 15 minutes                                                |
|  Prerequisites:                                                            |
|  - Section 3 completed (GCP project, service account, key)                 |
|  - Section 4 completed (Dialogflow CX agent created)                       |
|  - Service account JSON key file available                                 |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Virtual Agent in Control Hub                          |
|  -------------------------------------------------------------------------  |
|          a. Log into Control Hub: https://admin.webex.com                  |
|          b. Navigate: Services -> Contact Center -> Features                 |
|          c. Click "Virtual Agent"                                          |
|                                                                             |
|  Step 2: Create New Virtual Agent (CCAI Type)                              |
|  -------------------------------------------------------------------------  |
|          a. Click "+ Create Virtual Agent"                                 |
|          b. Select Agent Type: * Dialogflow CX                             |
|          c. Click "Next"                                                   |
|                                                                             |
|  Step 3: Configure CCAI Integration                                        |
|  -------------------------------------------------------------------------  |
|          a. Enter the following values:                                    |
|                                                                             |
|             Field                   | Value                                |
|             ------------------------+------------------------------------  |
|             Name                    | Abhi_Advanced_VA                     |
|             Description             | Dialogflow CX agent for complex     |
|                                     | conversations                        |
|                                                                             |
|  Step 4: Upload Service Account Key                                        |
|  -------------------------------------------------------------------------  |
|          a. In "Google Cloud Service Account" section                      |
|          b. Click "Upload JSON key file"                                   |
|          c. Select your service account key file:                          |
|             abhavtech-wxcc-ccai-key.json                                   |
|          d. Wait for validation (system verifies credentials)              |
|                                                                             |
|          [!]️ If validation fails:                                           |
|          - Verify key file is correct JSON format                          |
|          - Verify service account has Dialogflow API Admin role            |
|          - Verify project has Dialogflow API enabled                       |
|                                                                             |
|  Step 5: Select Dialogflow CX Agent                                        |
|  -------------------------------------------------------------------------  |
|          After key validation succeeds:                                    |
|                                                                             |
|          a. "Project" dropdown populates automatically                     |
|             - Verify: abhavtech-wxcc-ai                                    |
|                                                                             |
|          b. Click "Location" dropdown                                      |
|             - Select: asia-south1                                          |
|                                                                             |
|          c. Click "Agent" dropdown                                         |
|             - Select: Abhi VA                                              |
|                                                                             |
|          d. "Environment" dropdown appears                                 |
|             - Select: draft (for testing) OR production (for live)         |
|             - For initial setup, select: draft                             |
|                                                                             |
|             Field              | Value                                     |
|             -------------------+-----------------------------------------  |
|             Project            | abhavtech-wxcc-ai                         |
|             Location           | asia-south1                               |
|             Agent              | Abhi VA                                   |
|             Environment        | draft                                     |
|                                                                             |
|  Step 6: Configure Voice Settings                                          |
|  -------------------------------------------------------------------------  |
|          a. Click "Next" to proceed to Voice Settings                      |
|          b. Configure:                                                     |
|                                                                             |
|             Field                    | Value                               |
|             -------------------------+----------------------------------   |
|             Input language           | en-IN (English India)               |
|             Output voice             | en-IN-Neural2-A (Male)              |
|             Speech model             | phone_call                          |
|             Single utterance mode    | O Disabled (allow multi-turn)       |
|             End of speech timeout    | 2000 ms                             |
|             No speech timeout        | 5000 ms                             |
|             Barge-in                 | * Enabled                           |
|                                                                             |
|  Step 7: Add Additional Language (Hindi)                                   |
|  -------------------------------------------------------------------------  |
|          a. Click "+ Add language"                                         |
|          b. Configure:                                                     |
|                                                                             |
|             Field                    | Value                               |
|             -------------------------+----------------------------------   |
|             Input language           | hi-IN (Hindi India)                 |
|             Output voice             | hi-IN-Neural2-A (Male)              |
|                                                                             |
|  Step 8: Review and Create                                                 |
|  -------------------------------------------------------------------------  |
|          a. Click "Next" to review configuration                           |
|          b. Verify all settings are correct                                |
|          c. Click "Create"                                                 |
|          d. Wait for creation (30-60 seconds)                              |
|                                                                             |
|  Step 9: Verify Creation                                                   |
|  -------------------------------------------------------------------------  |
|          a. "Abhi_Advanced_VA" appears in Virtual Agent list               |
|          b. Status shows "Active" (green indicator)                        |
|          c. Type shows "Dialogflow CX"                                     |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: CCAI connector created with "Active" status                 |
|      If "Error" status: Check GCP credentials and API enablement           |
|                                                                             |
|  Step 10: Record Configuration                                             |
|  -------------------------------------------------------------------------  |
|          Document for flow configuration:                                  |
|                                                                             |
|          Virtual Agent Name:     _______________________________           |
|          GCP Project:            _______________________________           |
|          Dialogflow Agent:       _______________________________           |
|          Region:                 _______________________________           |
|          Environment:            _______________________________           |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Section 6 for flow integration        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## SECTION 6: FLOW DESIGNER - VIRTUAL AGENT INTEGRATION 

---

## 6.1 Adding Virtual Agent V2 Node

### Procedure: Add Virtual Agent Node to Flow

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 6.1.1: ADD VIRTUAL AGENT V2 NODE TO FLOW                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 20 minutes                                                |
|  Prerequisites:                                                            |
|  - Section 2 completed (Webex AI Agent created)                            |
|  - Section 5 completed (CCAI Connector created)                            |
|  - Baseline flow exists (India_MainMenu_Flow_v1)                           |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Access Flow Designer                                              |
|  -------------------------------------------------------------------------  |
|          a. In Control Hub: Services -> Contact Center -> Flows              |
|          b. Find flow: India_MainMenu_Flow_v1                              |
|          c. Click flow name to open                                        |
|          d. Click "Edit" button to enter edit mode                         |
|                                                                             |
|          [Screenshot placeholder: Flow Designer canvas]                    |
|                                                                             |
|  Step 2: Locate Insertion Point                                            |
|  -------------------------------------------------------------------------  |
|          a. Identify where VA node should be inserted                      |
|          b. For India flow: After initial greeting, before DTMF menu       |
|                                                                             |
|          Current Flow:                                                     |
|          [Start] -> [Play Welcome] -> [DTMF Menu] -> [Queue]                  |
|                                                                             |
|          Target Flow:                                                      |
|          [Start] -> [Play Welcome] -> [Virtual Agent] -> [DTMF Menu] -> [Queue]|
|                                     ^ INSERT HERE                          |
|                                                                             |
|  Step 3: Add Virtual Agent V2 Node                                         |
|  -------------------------------------------------------------------------  |
|          a. In left panel, expand "Activities"                             |
|          b. Locate "Virtual Agent V2" activity                             |
|             (Under "Virtual Agent" category)                               |
|          c. Drag "Virtual Agent V2" onto canvas                            |
|          d. Position between Play Welcome and DTMF Menu                    |
|                                                                             |
|  Step 4: Connect Node to Flow                                              |
|  -------------------------------------------------------------------------  |
|          a. Delete existing connection from Play Welcome to DTMF Menu      |
|             - Click the connection line                                    |
|             - Press Delete key                                             |
|                                                                             |
|          b. Connect Play Welcome -> Virtual Agent V2                        |
|             - Click output port of Play Welcome                            |
|             - Drag to input port of Virtual Agent V2                       |
|                                                                             |
|          c. The Virtual Agent V2 node has multiple output ports:           |
|             - Handled (self-service complete)                              |
|             - Escalated (transfer to agent)                                |
|             - Error (technical failure)                                    |
|                                                                             |
|  Step 5: Configure Virtual Agent V2 Node                                   |
|  -------------------------------------------------------------------------  |
|          a. Click on Virtual Agent V2 node to select                       |
|          b. Properties panel opens on right                                |
|                                                                             |
|  Step 6: Configure Contact Center AI Config                                |
|  -------------------------------------------------------------------------  |
|          a. In "Contact Center AI Config" dropdown:                        |
|             - Select: Abhi_Advanced_VA (Dialogflow CX)                     |
|                                                                             |
|          b. For EMEA/Americas flows, you would select:                     |
|             - Abhi_Simple_VA (Webex AI Agent)                              |
|                                                                             |
|             Flow                    | Virtual Agent Config                 |
|             ------------------------+------------------------------------  |
|             India_MainMenu_Flow_v1  | Abhi_Advanced_VA (Dialogflow CX)    |
|             EMEA_MainMenu_Flow_v1   | Abhi_Simple_VA (Webex AI Agent)     |
|             Americas_MainMenu_Flow  | Abhi_Simple_VA (Webex AI Agent)     |
|                                                                             |
|  Step 7: Configure Input Variables                                         |
|  -------------------------------------------------------------------------  |
|          a. Expand "Input Variables" section                               |
|          b. Add variables to pass to Virtual Agent:                        |
|                                                                             |
|             Click "+ Add Variable Mapping"                                 |
|                                                                             |
|             VA Variable      | Flow Variable                               |
|             -----------------+-----------------------------------------    |
|             customer_ani     | {{NewPhoneContact.ANI}}                     |
|             customer_name    | {{Global_CustomerName}} (if available)      |
|             session_id       | {{NewPhoneContact.InteractionId}}           |
|             language         | {{Customer_Language}} (if set)              |
|                                                                             |
|  Step 8: Configure Conversation Settings                                   |
|  -------------------------------------------------------------------------  |
|          a. Expand "Settings" section                                      |
|          b. Configure:                                                     |
|                                                                             |
|             Field                      | Value                             |
|             ---------------------------+---------------------------------  |
|             Max Conversation Turns     | 10                                |
|             No-Input Timeout (ms)      | 5000                              |
|             Speech Complete Timeout    | 2000                              |
|             Enable Barge-In            | [x] Enabled                         |
|             Enable DTMF Collection     | [x] Enabled                         |
|                                                                             |
|  Step 9: Configure Language Override (Optional)                            |
|  -------------------------------------------------------------------------  |
|          a. If language was detected earlier in flow:                      |
|             - Language Override: {{Customer_Language}}                     |
|          b. Otherwise leave empty for auto-detection                       |
|                                                                             |
|  Step 10: Save Node Configuration                                          |
|  -------------------------------------------------------------------------  |
|          a. Click outside the node to deselect                             |
|          b. Configuration is auto-saved                                    |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Virtual Agent V2 node configured with Dialogflow CX         |
|      Verify: Node shows "Abhi_Advanced_VA" in configuration                |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Procedure 6.3.1 for exit handling     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 6.3 Handling Exit Events

### Procedure: Configure Exit Event Handling

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 6.3.1: CONFIGURE VIRTUAL AGENT EXIT HANDLING                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 15 minutes                                                |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Identify Exit Ports                                               |
|  -------------------------------------------------------------------------  |
|          The Virtual Agent V2 node has three exit ports:                   |
|                                                                             |
|          | Port       | Triggers When                      | Action       |
|          |------------|------------------------------------|--------------|
|          | Handled    | VA successfully resolved query     | End call or  |
|          |            | (containment)                      | survey       |
|          |------------|------------------------------------|--------------|
|          | Escalated  | VA transfers to human agent        | Queue to     |
|          |            | (intent or request)                | agent        |
|          |------------|------------------------------------|--------------|
|          | Error      | Technical failure                  | Fallback     |
|          |            | (timeout, API error)               | to DTMF      |
|                                                                             |
|  Step 2: Configure "Handled" Exit Path                                     |
|  -------------------------------------------------------------------------  |
|          For successfully contained interactions:                          |
|                                                                             |
|          a. Connect "Handled" port -> Survey or Disconnect                  |
|             - Drag from "Handled" port                                     |
|             - Connect to: Survey_PostCall_v1 (subflow)                     |
|               OR Disconnect node                                           |
|                                                                             |
|          b. Optionally add Set Variable before disconnect:                 |
|             - VA_Outcome = "contained"                                     |
|             - VA_LastIntent = {{VirtualAgent.LastIntent}}                  |
|                                                                             |
|          Flow for Handled:                                                 |
|          [Virtual Agent] ->(Handled)-> [Set Variables] -> [Survey] -> [End]   |
|                                                                             |
|  Step 3: Configure "Escalated" Exit Path                                   |
|  -------------------------------------------------------------------------  |
|          For agent transfer requests:                                      |
|                                                                             |
|          a. Add "Set Variable" node after Escalated port                   |
|             - Drag Set Variable activity to canvas                         |
|             - Connect "Escalated" -> Set Variable                           |
|                                                                             |
|          b. Configure variables for agent context:                         |
|                                                                             |
|             Variable Name        | Value                                   |
|             ---------------------+-------------------------------------    |
|             VA_Escalation_Reason | {{VirtualAgent.ExitReason}}             |
|             VA_Last_Intent       | {{VirtualAgent.LastIntent}}             |
|             VA_Sentiment         | {{VirtualAgent.Sentiment}}              |
|             VA_Confidence        | {{VirtualAgent.IntentConfidence}}       |
|             VA_Transcript_URL    | {{VirtualAgent.TranscriptURL}}          |
|             VA_Collected_Data    | {{VirtualAgent.CustomPayload}}          |
|                                                                             |
|          c. Add routing logic based on intent/sentiment:                   |
|                                                                             |
|             Add "Condition" node:                                          |
|             - IF VA_Sentiment == "negative" AND score < -0.5               |
|               -> Route to: Sentiment_Priority_Queue                         |
|             - ELSE IF VA_Last_Intent == "billing.inquiry"                  |
|               -> Route to: Billing_Queue                                    |
|             - ELSE                                                         |
|               -> Route to: VA_Escalation_Queue                              |
|                                                                             |
|          Flow for Escalated:                                               |
|          [Virtual Agent] ->(Escalated)-> [Set Vars] -> [Condition] -> [Queue] |
|                                                                             |
|  Step 4: Configure "Error" Exit Path                                       |
|  -------------------------------------------------------------------------  |
|          For technical failures:                                           |
|                                                                             |
|          a. Add "Play Message" node for error announcement                 |
|             - Connect "Error" -> Play Message                               |
|             - Message: "We're experiencing technical difficulties.         |
|                        Please use our menu to direct your call."           |
|                                                                             |
|          b. Connect Play Message -> DTMF Menu (fallback)                    |
|                                                                             |
|          c. Add logging for troubleshooting:                               |
|             - Add Set Variable before DTMF Menu                            |
|             - Error_Code = {{VirtualAgent.ErrorMessage}}                   |
|                                                                             |
|          Flow for Error:                                                   |
|          [Virtual Agent] ->(Error)-> [Log Error] -> [Play Msg] -> [DTMF Menu] |
|                                                                             |
|  Step 5: Verify All Paths Connected                                        |
|  -------------------------------------------------------------------------  |
|          Check that all three exit ports have connections:                 |
|                                                                             |
|          [ ] Handled -> Survey/Disconnect                                     |
|          [ ] Escalated -> Queue (via routing logic)                           |
|          [ ] Error -> DTMF Fallback                                           |
|                                                                             |
|  Step 6: Save and Validate Flow                                            |
|  -------------------------------------------------------------------------  |
|          a. Click "Validate" button                                        |
|          b. Review any warnings or errors                                  |
|          c. Fix any disconnected paths                                     |
|          d. Click "Save" when validation passes                            |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Flow validates without errors                               |
|      All VA exit paths connected to appropriate destinations               |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Flow ready for testing                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## SECTION 7: AGENT ASSIST CONFIGURATION 

---

## 7.1 Enabling Agent Assist

### Procedure: Enable Cisco AI Assistant for Agents

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 7.1.1: ENABLE CISCO AI ASSISTANT (AGENT ASSIST)                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 15 minutes                                                |
|  Prerequisites: WxCC tenant with Premium Agent licenses                    |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Agent Assist Settings                                 |
|  -------------------------------------------------------------------------  |
|          a. Log into Control Hub: https://admin.webex.com                  |
|          b. Navigate: Services -> Contact Center -> Features                 |
|          c. Click "AI Assistant" (or "Agent Assist")                       |
|                                                                             |
|          [Screenshot placeholder: Control Hub - AI Assistant]              |
|                                                                             |
|  Step 2: Enable AI Assistant                                               |
|  -------------------------------------------------------------------------  |
|          a. Toggle "Enable AI Assistant" to ON                             |
|          b. Confirmation dialog appears                                    |
|          c. Click "Enable"                                                 |
|                                                                             |
|  Step 3: Configure General Settings                                        |
|  -------------------------------------------------------------------------  |
|          a. In Settings section, configure:                                |
|                                                                             |
|             Field                      | Value                             |
|             ---------------------------+---------------------------------  |
|             Enable for Voice           | [x] Enabled                         |
|             Enable for Digital         | [x] Enabled                         |
|             Default Language           | English (en-US)                   |
|             Additional Languages       | [x] Hindi (hi-IN)                   |
|                                                                             |
|  Step 4: Configure Feature Toggles                                         |
|  -------------------------------------------------------------------------  |
|          Enable the following features:                                    |
|                                                                             |
|             Feature                    | Status  | Description             |
|             ---------------------------+---------+-------------------------|
|             Real-time Transcription    | [x] On    | Live call transcript    |
|             Conversation Summary       | [x] On    | AI-generated summary    |
|             Suggested Responses        | [x] On    | Agent response hints    |
|             Sentiment Analysis         | [x] On    | Customer mood tracking  |
|             Knowledge Suggestions      | [x] On    | KB article suggestions  |
|             Auto Wrap-up Codes         | [x] On    | AI disposition suggest  |
|             Next Best Action           | O Off   | (Phase 3 - needs data)  |
|                                                                             |
|  Step 5: Configure User Profile Assignment                                 |
|  -------------------------------------------------------------------------  |
|          a. Navigate to: User Profiles section                             |
|          b. Select profiles to enable AI Assistant:                        |
|                                                                             |
|             Profile                    | AI Assistant                      |
|             ---------------------------+---------------------------------  |
|             Standard_Agent             | O Disabled (Voice only agents)   |
|             Premium_Agent              | * Enabled                         |
|             Supervisor                 | * Enabled                         |
|                                                                             |
|          c. Click "Save"                                                   |
|                                                                             |
|  Step 6: Verify Enablement                                                 |
|  -------------------------------------------------------------------------  |
|          a. Status should show "Active"                                    |
|          b. Enabled profiles count should show: 85                         |
|             (75 Premium + 10 Supervisor)                                   |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: AI Assistant active for Premium and Supervisor profiles     |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Knowledge Base setup                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 7.2 Configuring Knowledge Base

### Procedure: Create and Populate Knowledge Base

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 7.2.1: CREATE KNOWLEDGE BASE FOR AGENT ASSIST                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 30-60 minutes (depending on content volume)               |
|  Prerequisites: Procedure 7.1.1 completed                                  |
|                                                                             |
|  Knowledge Base Specification:                                             |
|  -------------------------------------------------------------------------  |
|  Target Articles: 125 total                                                |
|  Categories: Product FAQs, Troubleshooting, Policies, Billing, Company     |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Knowledge Base                                        |
|  -------------------------------------------------------------------------  |
|          a. In Control Hub: Services -> Contact Center -> Features           |
|          b. Click "Knowledge Base" (under AI Assistant)                    |
|          c. Knowledge Base management page opens                           |
|                                                                             |
|  Step 2: Create Knowledge Base                                             |
|  -------------------------------------------------------------------------  |
|          a. Click "+ Create Knowledge Base"                                |
|          b. Enter:                                                         |
|                                                                             |
|             Field              | Value                                     |
|             -------------------+-----------------------------------------  |
|             Name               | Abhavtech_Support_KB                      |
|             Description        | Knowledge base for agent assistance      |
|             Default Language   | English                                   |
|                                                                             |
|          c. Click "Create"                                                 |
|                                                                             |
|  Step 3: Create Categories                                                 |
|  -------------------------------------------------------------------------  |
|          a. Click "Categories" tab                                         |
|          b. Click "+ Add Category" for each:                               |
|                                                                             |
|             Category Name             | Target Articles                    |
|             --------------------------+----------------------------------  |
|             Product_FAQs              | 50                                 |
|             Troubleshooting_Guides    | 30                                 |
|             Policies_Procedures       | 20                                 |
|             Billing_FAQs              | 15                                 |
|             Company_Information       | 10                                 |
|                                                                             |
|  Step 4: Add Articles - Manual Entry                                       |
|  -------------------------------------------------------------------------  |
|          For each article:                                                 |
|                                                                             |
|          a. Click "Articles" tab                                           |
|          b. Click "+ Add Article"                                          |
|          c. Fill in article details:                                       |
|                                                                             |
|             Field              | Example Value                             |
|             -------------------+-----------------------------------------  |
|             Title              | How to Reset Product A Password          |
|             Category           | Product_FAQs                              |
|             Content            | [Article body text]                       |
|             Keywords           | password, reset, ProductA, login          |
|             Language           | English                                   |
|                                                                             |
|          d. Click "Save"                                                   |
|          e. Repeat for all articles                                        |
|                                                                             |
|  Step 5: Bulk Import (Alternative Method)                                  |
|  -------------------------------------------------------------------------  |
|          For large volume import:                                          |
|                                                                             |
|          a. Click "Import" button                                          |
|          b. Download CSV template                                          |
|          c. Populate CSV with articles:                                    |
|                                                                             |
|             CSV Format:                                                    |
|             title,category,content,keywords,language                       |
|             "How to Reset...","Product_FAQs","Step 1...","pwd,reset","en"  |
|                                                                             |
|          d. Upload completed CSV                                           |
|          e. Review import results                                          |
|          f. Fix any errors and re-import if needed                         |
|                                                                             |
|  Step 6: Add Hindi Language Articles                                       |
|  -------------------------------------------------------------------------  |
|          a. For high-priority articles, add Hindi versions:                |
|          b. Click article -> "Add Translation"                              |
|          c. Select language: Hindi (hi)                                    |
|          d. Enter translated title and content                             |
|          e. Save translation                                               |
|                                                                             |
|             Priority Hindi Translations:                                   |
|             [ ] Top 20 Product FAQs                                          |
|             [ ] Top 10 Troubleshooting Guides                                |
|             [ ] All Billing FAQs (15)                                        |
|                                                                             |
|  Step 7: Publish Knowledge Base                                            |
|  -------------------------------------------------------------------------  |
|          a. Review all articles for accuracy                               |
|          b. Click "Publish" button                                         |
|          c. Select "Publish All"                                           |
|          d. Confirm publication                                            |
|                                                                             |
|  Step 8: Link to AI Assistant                                              |
|  -------------------------------------------------------------------------  |
|          a. Navigate back to AI Assistant settings                         |
|          b. In "Knowledge Base" section                                    |
|          c. Select: Abhavtech_Support_KB                                   |
|          d. Click "Save"                                                   |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Knowledge Base with 125+ articles linked to AI Assistant    |
|      Verify: Test search returns relevant articles                         |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Suggestions setup                      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 7.3 Setting Up Suggestions

### Procedure: Configure Agent Response Suggestions

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 7.3.1: CONFIGURE SUGGESTED RESPONSES                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 20 minutes                                                |
|  Prerequisites: Procedures 7.1.1 and 7.2.1 completed                       |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Suggestions Settings                                  |
|  -------------------------------------------------------------------------  |
|          a. In AI Assistant settings                                       |
|          b. Click "Suggestions" section                                    |
|                                                                             |
|  Step 2: Configure Suggestion Sources                                      |
|  -------------------------------------------------------------------------  |
|          Enable suggestion sources:                                        |
|                                                                             |
|             Source                     | Status  | Priority               |
|             ---------------------------+---------+------------------------|
|             Knowledge Base Articles    | [x] On    | 1 (Highest)            |
|             Canned Responses           | [x] On    | 2                      |
|             Historical Responses       | O Off   | (Phase 3)              |
|             Smart Compose              | [x] On    | 3                      |
|                                                                             |
|  Step 3: Configure Display Settings                                        |
|  -------------------------------------------------------------------------  |
|          a. Set display parameters:                                        |
|                                                                             |
|             Field                      | Value                             |
|             ---------------------------+---------------------------------  |
|             Max suggestions displayed  | 3                                 |
|             Confidence threshold       | 0.7 (70%)                         |
|             Auto-refresh interval      | 5 seconds                         |
|             Show confidence scores     | [x] Yes (for supervisors)           |
|                                                                             |
|  Step 4: Create Canned Responses                                           |
|  -------------------------------------------------------------------------  |
|          a. Click "Canned Responses" sub-section                           |
|          b. Click "+ Add Response"                                         |
|          c. Create responses for common scenarios:                         |
|                                                                             |
|          Response 1: Greeting                                              |
|          +-------------------------------------------------------------+   |
|          |  Name:     greeting_standard                                |   |
|          |  Trigger:  call_start                                       |   |
|          |  Text:     "Thank you for contacting Abhavtech support.     |   |
|          |            My name is [Agent Name]. How may I assist you    |   |
|          |            today?"                                          |   |
|          |  Language: English                                          |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|          Response 2: Hold Request                                          |
|          +-------------------------------------------------------------+   |
|          |  Name:     hold_request                                     |   |
|          |  Trigger:  manual                                           |   |
|          |  Text:     "I need to look into this for you. Would you     |   |
|          |            mind holding for a moment while I check?"        |   |
|          |  Language: English                                          |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|          Response 3: Escalation                                            |
|          +-------------------------------------------------------------+   |
|          |  Name:     escalation_transfer                              |   |
|          |  Trigger:  manual                                           |   |
|          |  Text:     "I understand this is a complex issue. Let me    |   |
|          |            connect you with a specialist who can better     |   |
|          |            assist you."                                     |   |
|          |  Language: English                                          |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|          Response 4: Closing                                               |
|          +-------------------------------------------------------------+   |
|          |  Name:     closing_standard                                 |   |
|          |  Trigger:  call_end                                         |   |
|          |  Text:     "Is there anything else I can help you with      |   |
|          |            today? Thank you for choosing Abhavtech."        |   |
|          |  Language: English                                          |   |
|          +-------------------------------------------------------------+   |
|                                                                             |
|          d. Add Hindi versions for each response                           |
|                                                                             |
|  Step 5: Configure Trigger Rules                                           |
|  -------------------------------------------------------------------------  |
|          a. Click "Trigger Rules" sub-section                              |
|          b. Create rules for automatic suggestions:                        |
|                                                                             |
|             Rule                       | Trigger Condition                 |
|             ---------------------------+---------------------------------  |
|             Order_Status_Detected      | Intent = "order.status"           |
|                                        | -> Suggest: Order lookup steps     |
|             Billing_Issue_Detected     | Intent = "billing.inquiry"        |
|                                        | -> Suggest: Billing KB articles    |
|             Negative_Sentiment         | Sentiment < -0.5                  |
|                                        | -> Suggest: Empathy responses      |
|             Long_Hold_Time             | Hold duration > 60s               |
|                                        | -> Suggest: Apology response       |
|                                                                             |
|  Step 6: Save Configuration                                                |
|  -------------------------------------------------------------------------  |
|          a. Click "Save" button                                            |
|          b. Verify status shows "Configuration saved"                      |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Suggestions configured with KB, canned responses, triggers  |
|      Test: Verify suggestions appear in Agent Desktop                      |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Continue to Conversation Summaries                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 7.4 Configuring Conversation Summaries

### Procedure: Configure AI-Generated Summaries

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 7.4.1: CONFIGURE CONVERSATION SUMMARIES                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 15 minutes                                                |
|  Prerequisites: Procedure 7.1.1 completed                                  |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  Step 1: Navigate to Summary Settings                                      |
|  -------------------------------------------------------------------------  |
|          a. In AI Assistant settings                                       |
|          b. Click "Conversation Summaries" section                         |
|                                                                             |
|  Step 2: Enable Summary Types                                              |
|  -------------------------------------------------------------------------  |
|          Configure which summaries to generate:                            |
|                                                                             |
|             Summary Type               | Status  | Use Case               |
|             ---------------------------+---------+------------------------|
|             VA Handoff Summary         | [x] On    | VA -> Agent transfer    |
|             Mid-Call Summary           | [x] On    | Agent -> Agent transfer |
|             Wrap-up Summary            | [x] On    | Post-call notes        |
|             Supervisor Summary         | [x] On    | Call review            |
|                                                                             |
|  Step 3: Configure VA Handoff Summary                                      |
|  -------------------------------------------------------------------------  |
|          This summary appears when Virtual Agent transfers to human:       |
|                                                                             |
|          a. Click "VA Handoff Summary" settings                            |
|          b. Configure:                                                     |
|                                                                             |
|             Field                      | Value                             |
|             ---------------------------+---------------------------------  |
|             Include in summary:                                            |
|             +- Customer intent         | [x] Yes                             |
|             +- Collected information   | [x] Yes                             |
|             +- VA conversation turns   | [x] Yes                             |
|             +- Escalation reason       | [x] Yes                             |
|             +- Customer sentiment      | [x] Yes                             |
|             +- Recommended actions     | [x] Yes                             |
|                                                                             |
|             Display location           | Screen pop + Side panel           |
|             Auto-expand on transfer    | [x] Yes                             |
|                                                                             |
|  Step 4: Configure Wrap-up Summary                                         |
|  -------------------------------------------------------------------------  |
|          This summary auto-generates when call ends:                       |
|                                                                             |
|          a. Click "Wrap-up Summary" settings                               |
|          b. Configure:                                                     |
|                                                                             |
|             Field                      | Value                             |
|             ---------------------------+---------------------------------  |
|             Auto-generate              | [x] Yes                             |
|             Include:                                                       |
|             +- Call reason             | [x] Yes                             |
|             +- Actions taken           | [x] Yes                             |
|             +- Resolution status       | [x] Yes                             |
|             +- Follow-up required      | [x] Yes                             |
|             +- Customer sentiment      | [x] Yes                             |
|                                                                             |
|             Allow agent edit           | [x] Yes                             |
|             Max summary length         | 500 characters                    |
|                                                                             |
|  Step 5: Configure Auto Wrap-up Codes                                      |
|  -------------------------------------------------------------------------  |
|          AI suggests disposition codes based on conversation:              |
|                                                                             |
|          a. Click "Auto Wrap-up" settings                                  |
|          b. Enable: [x] Suggest wrap-up codes                                |
|          c. Map intents to wrap-up codes:                                  |
|                                                                             |
|             Detected Intent            | Suggested Wrap-up Code            |
|             ---------------------------+---------------------------------  |
|             order.status               | Order Inquiry                     |
|             order.track                | Shipping/Tracking                 |
|             billing.inquiry            | Billing Question                  |
|             support.troubleshoot       | Technical Support                 |
|             account.info               | Account Management                |
|             product.inquiry            | Product Information               |
|             (unresolved)               | Escalated/Unresolved              |
|                                                                             |
|          d. Set confidence threshold: 0.8 (80%)                            |
|          e. Allow agent override: [x] Yes                                    |
|                                                                             |
|  Step 6: Test Summary Generation                                           |
|  -------------------------------------------------------------------------  |
|          a. Make a test call through VA that escalates to agent            |
|          b. Accept call as test agent                                      |
|          c. Verify VA Handoff Summary appears                              |
|          d. Complete call and verify Wrap-up Summary generates             |
|                                                                             |
|  [!]️  CHECKPOINT:                                                           |
|      Expected: Summaries auto-generate for VA handoffs and wrap-ups        |
|      Test: Verify summary accuracy matches conversation                    |
|                                                                             |
|  [OK] PROCEDURE COMPLETE - Section 7 complete                                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## SECTION 8: VALIDATION & TESTING 

---

## 8.1 Component Validation Checklist

```
+-----------------------------------------------------------------------------+
|  CHECKLIST 8.1: COMPONENT VALIDATION                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Complete this checklist before proceeding to end-to-end testing.          |
|                                                                             |
|  WEBEX AI AGENT (Abhi_Simple_VA):                                          |
|  ------------------------------------------------------------------------- |
|  [ ] Agent created in Control Hub                                            |
|  [ ] Status shows "Published"                                                |
|  [ ] 5 intents configured:                                                   |
|    [ ] greeting.hello (15 training phrases)                                  |
|    [ ] hours.location (20 training phrases)                                  |
|    [ ] callback.request (18 training phrases)                                |
|    [ ] agent.handoff (25 training phrases)                                   |
|    [ ] fallback.default (system)                                             |
|  [ ] Simulator tests pass for all intents                                    |
|                                                                             |
|  GCP PROJECT (abhavtech-wxcc-ai):                                          |
|  ------------------------------------------------------------------------- |
|  [ ] Project created in asia-south1                                          |
|  [ ] Billing account linked                                                  |
|  [ ] APIs enabled:                                                           |
|    [ ] Dialogflow API                                                        |
|    [ ] Cloud Speech-to-Text API                                              |
|    [ ] Cloud Text-to-Speech API                                              |
|    [ ] Cloud Functions API                                                   |
|    [ ] Cloud Build API                                                       |
|  [ ] Service account created: wxcc-ccai-connector                            |
|  [ ] Service account has Dialogflow API Admin role                           |
|  [ ] JSON key file generated and secured                                     |
|                                                                             |
|  DIALOGFLOW CX AGENT (Abhi VA):                                            |
|  ------------------------------------------------------------------------- |
|  [ ] Agent created in asia-south1                                            |
|  [ ] Languages configured: English (en), Hindi (hi)                          |
|  [ ] Voice settings configured for both languages                            |
|  [ ] Intents created (minimum for testing):                                  |
|    [ ] order.status                                                          |
|    [ ] agent.handoff                                                         |
|    [ ] Default Welcome Intent                                                |
|    [ ] Default Fallback Intent                                               |
|  [ ] Webhook configured (if using fulfillment)                               |
|  [ ] Simulator tests pass                                                    |
|                                                                             |
|  WXCC CCAI CONNECTOR (Abhi_Advanced_VA):                                   |
|  ------------------------------------------------------------------------- |
|  [ ] Connector created in Control Hub                                        |
|  [ ] Status shows "Active"                                                   |
|  [ ] Linked to correct GCP project                                           |
|  [ ] Linked to correct Dialogflow CX agent                                   |
|  [ ] Voice settings configured                                               |
|  [ ] Languages configured (en-IN, hi-IN)                                     |
|                                                                             |
|  FLOW DESIGNER INTEGRATION:                                                |
|  ------------------------------------------------------------------------- |
|  [ ] Virtual Agent V2 node added to flow                                     |
|  [ ] Node configured with correct CCAI config                                |
|  [ ] Input variables mapped                                                  |
|  [ ] All exit paths connected:                                               |
|    [ ] Handled -> Survey/Disconnect                                           |
|    [ ] Escalated -> Queue                                                     |
|    [ ] Error -> DTMF Fallback                                                 |
|  [ ] Flow validates without errors                                           |
|  [ ] Flow published                                                          |
|                                                                             |
|  All items checked? [ ] YES -> Proceed to End-to-End Testing                  |
|                     [ ] NO  -> Complete missing items first                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 8.2 End-to-End Test Procedure

```
+-----------------------------------------------------------------------------+
|  PROCEDURE 8.2.1: END-TO-END AI INTEGRATION TEST                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Estimated Time: 30 minutes                                                |
|  Test Environment: UAT tenant with test DIDs                               |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  TEST 1: DIALOGFLOW CX - ORDER STATUS (INDIA FLOW)                         |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  Step 1: Dial India test number                                            |
|          Number: [test DID]                                                |
|                                                                             |
|  Step 2: Listen for welcome prompt                                         |
|          Expected: "Hello! Welcome to Abhavtech..."                        |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 3: Say "Check my order status"                                       |
|          Expected: VA asks for order number                                |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 4: Say "ORD-12345" (test order)                                      |
|          Expected: VA provides order status from webhook                   |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 5: Say "Thank you, goodbye"                                          |
|          Expected: VA ends conversation (Handled exit)                     |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  TEST 2: DIALOGFLOW CX - AGENT ESCALATION (INDIA FLOW)                     |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  Step 1: Dial India test number                                            |
|                                                                             |
|  Step 2: After welcome, say "I want to speak to an agent"                  |
|          Expected: VA acknowledges and transfers                           |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 3: Verify routing                                                    |
|          Expected: Call routes to VA_Escalation_Queue                      |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 4: Agent accepts call (use test agent)                               |
|          Expected: Agent sees VA context in screen pop                     |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  TEST 3: WEBEX AI AGENT - HOURS INQUIRY (EMEA FLOW)                        |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  Step 1: Dial EMEA test number                                             |
|                                                                             |
|  Step 2: After welcome, say "What are your business hours"                 |
|          Expected: VA provides hours information                           |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 3: Say "Thank you"                                                   |
|          Expected: VA offers additional help or ends                       |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  TEST 4: WEBEX AI AGENT - CALLBACK REQUEST (AMERICAS FLOW)                 |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  Step 1: Dial Americas test number                                         |
|                                                                             |
|  Step 2: After welcome, say "I want a callback"                            |
|          Expected: VA confirms callback number                             |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 3: Confirm "Yes"                                                     |
|          Expected: Callback scheduled, call ends                           |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 4: Verify callback in queue                                          |
|          Expected: Callback appears in queue                               |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  TEST 5: FALLBACK HANDLING                                                 |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  Step 1: Dial any test number                                              |
|                                                                             |
|  Step 2: Say gibberish or unrelated topic                                  |
|          Expected: VA asks for clarification                               |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 3: Repeat gibberish two more times                                   |
|          Expected: DTMF menu offered                                       |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  Step 4: Press "0" for agent                                               |
|          Expected: Routed to support queue                                 |
|          [ ] PASS  [ ] FAIL                                                    |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  TEST SUMMARY:                                                             |
|  =======================================================================   |
|                                                                             |
|  | Test                         | Result | Notes                     |    |
|  |------------------------------|--------|---------------------------|    |
|  | Test 1: Order Status         |        |                           |    |
|  | Test 2: Agent Escalation     |        |                           |    |
|  | Test 3: Hours Inquiry        |        |                           |    |
|  | Test 4: Callback Request     |        |                           |    |
|  | Test 5: Fallback Handling    |        |                           |    |
|                                                                             |
|  Overall Result: [ ] PASS (all tests pass)  [ ] FAIL (see notes)               |
|                                                                             |
|  Sign-off:                                                                 |
|  Tested by: _______________________  Date: _______________                 |
|  Reviewed by: _____________________  Date: _______________                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 8.3 Troubleshooting Common Issues

```
+-----------------------------------------------------------------------------+
|  TROUBLESHOOTING GUIDE: COMMON AI INTEGRATION ISSUES                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ISSUE 1: VIRTUAL AGENT NOT RESPONDING                                     |
|  -------------------------------------------------------------------------  |
|  Symptoms:                                                                 |
|  * Silence after welcome prompt                                            |
|  * Call drops or goes directly to queue                                    |
|                                                                             |
|  Troubleshooting Steps:                                                    |
|  1. Check Virtual Agent status in Control Hub                              |
|     -> Must show "Active" or "Published"                                    |
|  2. Verify flow is using correct VA configuration                          |
|     -> Check Virtual Agent V2 node settings                                 |
|  3. Check GCP project APIs are enabled                                     |
|     -> Especially Dialogflow API                                            |
|  4. Verify service account key is valid                                    |
|     -> Try regenerating key if expired                                      |
|  5. Check network connectivity to Google APIs                              |
|     -> Firewall may be blocking                                             |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ISSUE 2: INTENTS NOT RECOGNIZED                                           |
|  -------------------------------------------------------------------------  |
|  Symptoms:                                                                 |
|  * VA always triggers fallback                                             |
|  * Wrong intent detected                                                   |
|                                                                             |
|  Troubleshooting Steps:                                                    |
|  1. Test intent in Dialogflow CX simulator                                 |
|     -> Verify intent matches in simulator                                   |
|  2. Check training phrases                                                 |
|     -> Add more variations                                                  |
|  3. Review confidence threshold                                            |
|     -> May be set too high (try 0.5)                                        |
|  4. Check for conflicting intents                                          |
|     -> Similar training phrases in multiple intents                         |
|  5. Verify language settings                                               |
|     -> VA language must match caller language                               |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ISSUE 3: WEBHOOK TIMEOUT OR FAILURE                                       |
|  -------------------------------------------------------------------------  |
|  Symptoms:                                                                 |
|  * VA says "having trouble" or similar                                     |
|  * Order/account lookups fail                                              |
|                                                                             |
|  Troubleshooting Steps:                                                    |
|  1. Check webhook endpoint is accessible                                   |
|     -> Test URL directly with curl                                          |
|  2. Verify webhook timeout setting                                         |
|     -> Increase if backend is slow (max 30s)                                |
|  3. Check webhook authentication                                           |
|     -> API key or OAuth may be expired                                      |
|  4. Review Cloud Function logs (if GCP)                                    |
|     -> GCP Console -> Cloud Functions -> Logs                                 |
|  5. Test webhook with Dialogflow simulator                                 |
|     -> Shows actual request/response                                        |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ISSUE 4: CCAI CONNECTOR "ERROR" STATUS                                    |
|  -------------------------------------------------------------------------  |
|  Symptoms:                                                                 |
|  * Connector shows error in Control Hub                                    |
|  * Cannot select in Flow Designer                                          |
|                                                                             |
|  Troubleshooting Steps:                                                    |
|  1. Verify service account permissions                                     |
|     -> Must have Dialogflow API Admin                                       |
|  2. Check service account key validity                                     |
|     -> Keys can be disabled or deleted in GCP                               |
|  3. Verify Dialogflow CX agent exists                                      |
|     -> Agent may have been deleted                                          |
|  4. Check region match                                                     |
|     -> Connector and agent must be same region                              |
|  5. Regenerate service account key                                         |
|     -> Create new key and re-upload                                         |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ISSUE 5: CONTEXT NOT PASSED TO AGENT                                      |
|  -------------------------------------------------------------------------  |
|  Symptoms:                                                                 |
|  * Agent doesn't see VA conversation                                       |
|  * Screen pop missing VA data                                              |
|                                                                             |
|  Troubleshooting Steps:                                                    |
|  1. Verify Set Variable nodes in flow                                      |
|     -> Must set CAD variables before queue                                  |
|  2. Check variable mapping                                                 |
|     -> VirtualAgent.* variables must be mapped                              |
|  3. Verify Agent Desktop layout                                            |
|     -> CAD variables must be configured in layout                           |
|  4. Check transcript URL generation                                        |
|     -> Logging must be enabled in Dialogflow                                |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  SUPPORT ESCALATION:                                                       |
|  =======================================================================   |
|                                                                             |
|  If issues persist after troubleshooting:                                  |
|                                                                             |
|  Cisco TAC (for WxCC issues):                                              |
|  -> https://mycase.cloudapps.cisco.com/case                                 |
|  -> Collect: Flow export, VA config, error screenshots                      |
|                                                                             |
|  Google Cloud Support (for Dialogflow issues):                             |
|  -> https://console.cloud.google.com/support                                |
|  -> Collect: Agent export, conversation logs, request IDs                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## END OF APPENDIX 10-E 

---

## Document Summary

This appendix provides comprehensive step-by-step procedures for configuring AI integration in Webex Contact Center with Google Dialogflow CX.

**Sections Covered:**
1. Pre-Implementation Checklist
2. Webex Control Hub - AI Agent Configuration
3. Google Cloud Platform - Project Setup
4. Dialogflow CX - Agent Creation
5. Webex Contact Center - CCAI Connector
6. Flow Designer - Virtual Agent Integration
7. Agent Assist Configuration
8. Validation & Testing

**Estimated Total Implementation Time:** 4-6 hours (excluding testing)

**For complete technical specifications and design rationale, refer to Chapter 10 main document.**

---

*© 2026 Abhavtech.com - Appendix 10-E v1.0*
