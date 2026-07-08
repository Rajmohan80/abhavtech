# Chapter 6: Webex Contact Center Implementation -- 6.2 Entry Point Implementation

## 6.2 Entry Point Implementation

## 6.2.1 Entry Point Design (Per Chapter 3.3.2)

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH ENTRY POINT SPECIFICATIONS - 6 ENTRY POINTS          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  EP-01: India_Main_Voice_EP                                                |
|  =======================================================================   |
|  Name:                 India_Main_Voice_EP                                 |
|  Description:          Primary India voice entry - Sales & Support          |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         1800-266-1000 (Toll-Free)                           |
|                        +91-22-4960-1000 (Mumbai)                           |
|  Service Level:        30 seconds / 80%                                    |
|  Routing Flow:         India_MainMenu_Flow_v1                              |
|  Business Hours:       24x7 (Mumbai)                                       |
|  Recording:            Enabled with consent prompt                         |
|                                                                             |
|  EP-02: India_Sales_Direct_EP                                              |
|  =======================================================================   |
|  Name:                 India_Sales_Direct_EP                               |
|  Description:          Direct sales line (skip IVR)                         |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         1800-266-1001 (Sales Toll-Free)                     |
|  Service Level:        20 seconds / 85%                                    |
|  Routing Flow:         India_Sales_Direct_Flow_v1                          |
|  Business Hours:       9:00 AM - 9:00 PM IST                               |
|  After Hours:          Route to India_Main_Voice_EP                        |
|  Priority:             HIGH (revenue)                                      |
|                                                                             |
|  EP-03: EMEA_Main_Voice_EP                                                 |
|  =======================================================================   |
|  Name:                 EMEA_Main_Voice_EP                                  |
|  Description:          UK/EU voice entry point                             |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         +44-20-XXXX-XXXX (UK)                               |
|  Service Level:        30 seconds / 80%                                    |
|  Routing Flow:         EMEA_MainMenu_Flow_v1                               |
|  Business Hours:       9:00 AM - 6:00 PM GMT                               |
|  After Hours:          Route to India_Main_Voice_EP (follow-the-sun)       |
|  Data Residency:       UK DC                                               |
|                                                                             |
|  EP-04: Americas_Main_Voice_EP                                             |
|  =======================================================================   |
|  Name:                 Americas_Main_Voice_EP                              |
|  Description:          US voice entry point                                |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         +1-201-XXX-XXXX (New Jersey)                        |
|  Service Level:        30 seconds / 80%                                    |
|  Routing Flow:         Americas_MainMenu_Flow_v1                           |
|  Business Hours:       9:00 AM - 6:00 PM EST                               |
|  After Hours:          Route to India_Main_Voice_EP (follow-the-sun)       |
|  Data Residency:       US DC                                               |
|                                                                             |
|  EP-05: Global_Chat_EP                                                     |
|  =======================================================================   |
|  Name:                 Global_Chat_EP                                      |
|  Description:          Web Chat and WhatsApp                               |
|  Channel Type:         Chat                                                |
|  Asset:                Webex Connect widget / WhatsApp Business            |
|  Service Level:        15 seconds / 90%                                    |
|  Routing Flow:         Digital_Chat_Flow_v1                                |
|  Business Hours:       24x7 (Mumbai digital team)                          |
|                                                                             |
|  EP-06: Global_Email_EP                                                    |
|  =======================================================================   |
|  Name:                 Global_Email_EP                                     |
|  Description:          Email channel                                       |
|  Channel Type:         Email                                               |
|  Email Address:        support@abhavtech.com                               |
|  Service Level:        4 hours / 80%                                       |
|  Routing Flow:         Digital_Email_Flow_v1                               |
|  Business Hours:       Business hours SLA                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.2.2 Entry Point Provisioning - Step-by-Step

### Creating India_Main_Voice_EP

**Navigation:** Control Hub -> Contact Center -> Provisioning -> Entry Points

**Step 1: Access Entry Point Management**

1. Click **"Create Entry Point"**
2. Entry Point Type: **Inbound**

**Step 2: General Settings**

```
+-----------------------------------------------------------------------------+
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Name                       | India_Main_Voice_EP                          |
|  Description                | Primary India voice entry - Sales & Support  |
|  Entry Point Type           | Inbound                                      |
|  Channel Type               | Telephony                                    |
+-----------------------------------------------------------------------------+
```

**Step 3: Routing Settings**

```
+-----------------------------------------------------------------------------+
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Routing Flow               | India_MainMenu_Flow_v1 (select from dropdown)|
|  Music File                 | abhavtech_hold_music.wav                     |
|  Overflow Treatment         | Enable                                       |
|  Overflow Destination       | Voicemail_EP                                 |
+-----------------------------------------------------------------------------+
```

> **[!]️ NOTE:** Flow must be created first (Section 6.5) before associating with Entry Point

**Step 4: Service Level Settings**

```
+-----------------------------------------------------------------------------+
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Service Level Threshold    | 30 (seconds)                                 |
|  Service Level Percentage   | 80%                                          |
+-----------------------------------------------------------------------------+
```

**Step 5: Advanced Settings**

```
+-----------------------------------------------------------------------------+
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Enable Recording           | Yes                                          |
|  Recording Pause Resume     | Yes (for consent/PCI)                        |
|  Enable Reporting           | Yes                                          |
|  DNIS                       | (Set after dial number mapping)              |
+-----------------------------------------------------------------------------+
```

**Step 6: Save and Note Entry Point ID**

1. Click **"Save"**
2. **Record Entry Point ID:** _____________ (needed for dial number mapping)

## 6.2.3 Dial Number to Entry Point Mapping

**Navigation:** Control Hub -> Contact Center -> Provisioning -> Entry Point Mappings

**Step 1: Create Mapping for Toll-Free Number**

1. Click **"Create Mapping"**
2. Select Entry Point: **India_Main_Voice_EP**
3. Select Dial Number: **18001234567** (from Webex Calling)
4. Click **"Save"**

**Step 2: Create Mapping for Mumbai Number**

1. Click **"Create Mapping"**
2. Select Entry Point: **India_Main_Voice_EP**
3. Select Dial Number: **+91-22-4960-1000** (from Webex Calling)
4. Click **"Save"**

## 6.2.4 Entry Point Verification

```
+-----------------------------------------------------------------------------+
|              ENTRY POINT VERIFICATION CHECKLIST                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [ ] Entry Point status shows: "Active"                                    |
|  [ ] Dial number mapping shows: "Configured"                               |
|  [ ] Flow association verified                                             |
|  [ ] Test call placed to mapped number                                     |
|  [ ] Call arrives at Entry Point (check real-time dashboard)               |
|  [ ] Flow Designer flow executes                                           |
|                                                                             |
|  REPEAT for all 6 Entry Points                                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
