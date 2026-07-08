# 3.3 Entry Point Design

## 3.3.1 Entry Point Strategy

Entry Points in Webex Contact Center serve as the ingress for all customer interactions. Each Entry Point maps to one or more phone numbers (DIDs) and routes calls to a specific Flow Designer flow.

```
   ENTRY POINT DESIGN STRATEGY
   UCCX APPROACH   WXCC APPROACH   MIGRATION IMPACT

   Single trigger per DN   Entry Point per DN   1:1 mapping
   CTI Route Point   Entry Point + Flow   Redesign routing
   Application association   Entry Point Mapping   Reconfigure in CH

   ABHAVTECH ENTRY POINT STRATEGY:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   1. REGIONAL ENTRY POINTS
   - Separate Entry Points per region (India, EMEA, Americas)
   - Enables regional compliance and routing
   - Regional prompts and languages
   2. FUNCTIONAL ENTRY POINTS
   - Sales vs Support separation
   - Different IVR treatments per function
   - Dedicated SLA tracking
   3. CHANNEL ENTRY POINTS
   - Voice Entry Points (primary)
   - Digital Entry Points (chat, WhatsApp, email)
   - Consistent customer experience across channels
```

## 3.3.2 Entry Point Configuration Specifications

```
   ABHAVTECH WXCC ENTRY POINT SPECIFICATIONS
   ENTRY POINT   CHANNEL   DIAL NUMBER(S)   FLOW
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   EP-01: INDIA_MAIN_EP
   Name:   India_Main_Voice_EP
   Description:   Primary India voice entry - Sales & Support
   Channel Type:   Telephony
   Dial Numbers:   1800-266-1000 (India Toll-Free)
   +91-22-4961-1000 (Mumbai Direct)
   Service Level:   30 seconds / 80%
   Routing Flow:   India_MainMenu_Flow_v1
   Business Hours:   24x7 (Mumbai)
   Overflow:   Voicemail after 300 seconds
   Recording:   All calls (consent-based)
   Data Residency:   India DC
   EP-02: INDIA_SALES_EP
   Name:   India_Sales_Voice_EP
   Description:   Dedicated India sales line
   Channel Type:   Telephony
   Dial Numbers:   1800-266-1001 (Sales Toll-Free)
   Service Level:   20 seconds / 85%
   Routing Flow:   India_Sales_Direct_Flow_v1
   Business Hours:   9:00 AM - 9:00 PM IST
   After Hours:   Route to India_Main_Voice_EP
   Priority:   High (sales revenue)
   EP-03: EMEA_MAIN_EP
   Name:   EMEA_Main_Voice_EP
   Description:   EMEA (UK/EU) voice entry point
   Channel Type:   Telephony
   Dial Numbers:   +44-20-XXXX-XXXX (UK)
   +49-69-XXXX-XXXX (Germany - future)
   Service Level:   30 seconds / 80%
   Routing Flow:   EMEA_MainMenu_Flow_v1
   Business Hours:   9:00 AM - 6:00 PM GMT/CET
   After Hours:   Route to India_Main_Voice_EP (follow-the-sun)
   Data Residency:   UK DC / EU DC
   EP-04: AMERICAS_MAIN_EP
   Name:   Americas_Main_Voice_EP
   Description:   Americas (US) voice entry point
   Channel Type:   Telephony
   Dial Numbers:   +1-201-XXX-XXXX (New Jersey)
   1-800-XXX-XXXX (US Toll-Free - future)
   Service Level:   30 seconds / 80%
   Routing Flow:   Americas_MainMenu_Flow_v1
   Business Hours:   9:00 AM - 6:00 PM EST
   After Hours:   Route to India_Main_Voice_EP (follow-the-sun)
   Data Residency:   US DC
   EP-05: DIGITAL_CHAT_EP
   Name:   Global_Chat_EP
   Description:   Web chat and WhatsApp entry
   Channel Type:   Chat
   Asset:   Webex Connect widget / WhatsApp Business
   Service Level:   15 seconds / 90%
   Routing Flow:   Digital_Chat_Flow_v1
   Business Hours:   24x7 (Mumbai digital team)
   EP-06: DIGITAL_EMAIL_EP
   Name:   Global_Email_EP
   Description:   Email channel entry point
   Channel Type:   Email
   Email Address:   support@abhavtech.com
   Service Level:   4 hours / 80%
   Routing Flow:   Digital_Email_Flow_v1
   Business Hours:   Business hours (email SLA)
```

## 3.3.3 Entry Point Provisioning Steps

```
   ENTRY POINT PROVISIONING - STEP BY STEP
   STEP 1: Access Control Hub
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   1. Navigate to: admin.webex.com
   2. Login with admin credentials
   3. Select: Contact Center from Services menu
   4. Navigate to: Provisioning > Entry Points
   STEP 2: Create Entry Point (Example: India_Main_Voice_EP)
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   1. Click: "Create Entry Point"
   2. General Settings:
   - Name: India_Main_Voice_EP
   - Description: Primary India voice entry - Sales & Support
   - Entry Point Type: Inbound
   - Channel Type: Telephony
   3. Routing Settings:
   - Routing Flow: India_MainMenu_Flow_v1 (select from dropdown)
   (Note: Flow must be created first - see Section 3.6)
   4. Service Level Settings:
   - Service Level Threshold: 30 (seconds)
   - Service Level Percentage: 80%
   5. Advanced Settings:
   - Enable Recording: Yes
   - Recording Pause Resume: Yes (for consent)
   - Enable Reporting: Yes
   6. Click "Save"
   7. Note Entry Point ID: _______________
   STEP 3: Map Dial Number to Entry Point
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   1. Navigate to: Provisioning > Entry Point Mappings
   2. Click: "Create Mapping"
   3. Select:
   - Entry Point: India_Main_Voice_EP
   - Dial Number: 18001234567 (from Webex Calling)
   4. Click "Save"
   5. Repeat for additional numbers (+91-22-4961-1000)
   STEP 4: Verify Entry Point Status
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   1. Entry Point status should show: "Active"
   2. Mapping status should show: "Configured"
   3. Test: Place a call to the mapped number
   - Expected: Call arrives at Entry Point
   - Expected: Flow Designer flow executes
```

---

