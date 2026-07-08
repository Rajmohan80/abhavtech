# Chapter 3: Webex Contact Center Design (Phase 2) -- 3.4 Queue Design

## 3.4 Queue Design

## 3.4.1 Queue Design Strategy

```
+-----------------------------------------------------------------------------+
|              QUEUE DESIGN STRATEGY - UCCX TO WXCC MIGRATION                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  UCCX CSQ           | WXCC QUEUE              | MIGRATION NOTES             |
|  -------------------+-------------------------+-----------------------------|
|  Sales_India_CSQ    | Sales_India_Queue       | Direct migration            |
|  Sales_EMEA_CSQ     | Sales_EMEA_Queue        | Direct migration            |
|  Sales_Americas_CSQ | Sales_Americas_Queue    | Direct migration            |
|  Support_CSQ        | Support_General_Queue   | Split by region             |
|                     | Support_India_Queue     | (new regional queues)       |
|                     | Support_EMEA_Queue      |                             |
|  Billing_CSQ        | Billing_Queue           | Direct migration            |
|  TechSupport_CSQ    | TechSupport_Queue       | Direct migration            |
|  Email_CSQ          | Digital_Email_Queue     | Rename + enhance            |
|  Chat_CSQ           | Digital_Chat_Queue      | Add WhatsApp                |
|  -------------------+-------------------------+-----------------------------|
|  TOTAL: 6 CSQs      | TOTAL: 10 Queues        | +4 new queues (regional)    |
|                                                                             |
|  QUEUE DESIGN PRINCIPLES:                                                  |
|  ========================                                                  |
|  1. One queue per major function + region combination                      |
|  2. Skills-based routing within each queue                                 |
|  3. Overflow paths between queues (regional -> global)                      |
|  4. Consistent SLA thresholds per queue type                               |
|  5. Queue-level reporting for KPI tracking                                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.4.2 Queue Configuration Specifications

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH WXCC QUEUE SPECIFICATIONS                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  QUEUE               | CHANNEL | SL    | MAX Q | ROUTING    | TEAM         |
|  ========================================================================  |
|                                                                             |
|  Q-01: Sales_India_Queue                                                   |
|  -------------------------------------------------------------------------  |
|  Name:               Sales_India_Queue                                     |
|  Description:        India B2C/B2B sales inquiries                         |
|  Channel Type:       Telephony                                             |
|  Queue Type:         Inbound                                               |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds (5 minutes)                               |
|  Routing Type:       Skills-Based (Longest Available Agent)                |
|  Skills Required:    Sales = TRUE, Region_India = TRUE                     |
|  Skill Relaxation:   After 120s: Remove Region_India                       |
|  Assigned Team:      India_Sales_Team                                      |
|  Overflow Action:    After max queue -> Voicemail_EP                        |
|  Music on Hold:      abhavtech_hold_music.wav                              |
|  Comfort Messages:   Every 60 seconds                                      |
|                                                                             |
|  Q-02: Sales_EMEA_Queue                                                    |
|  -------------------------------------------------------------------------  |
|  Name:               Sales_EMEA_Queue                                      |
|  Description:        UK/EU sales inquiries                                 |
|  Channel Type:       Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Sales = TRUE, Region_EMEA = TRUE                      |
|  Skill Relaxation:   After 90s: Add Region_India (follow-the-sun)          |
|  Assigned Team:      EMEA_Sales_Team, India_Sales_Team (backup)            |
|  After Hours:        Route to Sales_India_Queue                            |
|                                                                             |
|  Q-03: Sales_Americas_Queue                                                |
|  -------------------------------------------------------------------------  |
|  Name:               Sales_Americas_Queue                                  |
|  Description:        US/Americas sales inquiries                           |
|  Channel Type:       Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Sales = TRUE, Region_Americas = TRUE                  |
|  Skill Relaxation:   After 90s: Add Region_India                           |
|  Assigned Team:      Americas_Sales_Team, India_Sales_Team (backup)        |
|  After Hours:        Route to Sales_India_Queue                            |
|                                                                             |
|  Q-04: Support_India_Queue                                                 |
|  -------------------------------------------------------------------------  |
|  Name:               Support_India_Queue                                   |
|  Description:        India customer support                                |
|  Channel Type:       Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  600 seconds (10 minutes)                              |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Support = TRUE                                        |
|  Skills Preferred:   Hindi = TRUE (priority if available)                  |
|  Assigned Team:      India_Support_Team                                    |
|  Callback Option:    Offer callback after 180 seconds                      |
|                                                                             |
|  Q-05: Support_EMEA_Queue                                                  |
|  -------------------------------------------------------------------------  |
|  Name:               Support_EMEA_Queue                                    |
|  Description:        UK/EU customer support                                |
|  Channel Type:       Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  600 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Support = TRUE, Region_EMEA = TRUE                    |
|  Assigned Team:      EMEA_Support_Team, India_Support_Team (backup)        |
|  After Hours:        Route to Support_India_Queue                          |
|                                                                             |
|  Q-06: Billing_Queue                                                       |
|  -------------------------------------------------------------------------  |
|  Name:               Billing_Queue                                         |
|  Description:        Global billing and payment inquiries                  |
|  Channel Type:       Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Billing = TRUE                                        |
|  Assigned Team:      Billing_Team (Mumbai only)                            |
|  Security:           PCI-DSS compliant (pause recording for card data)     |
|                                                                             |
|  Q-07: TechSupport_Queue                                                   |
|  -------------------------------------------------------------------------  |
|  Name:               TechSupport_Queue                                     |
|  Description:        Technical product support                             |
|  Channel Type:       Telephony                                             |
|  Service Level:      60 seconds                                            |
|  Max Time in Queue:  900 seconds (15 minutes - complex issues)             |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    TechnicalSupport = TRUE                               |
|  Skills Preferred:   ProductA/ProductB/ProductC (based on selection)       |
|  Assigned Team:      TechSupport_Team                                      |
|  Screen Pop:         CRM ticket lookup on answer                           |
|                                                                             |
|  Q-08: Digital_Chat_Queue                                                  |
|  -------------------------------------------------------------------------  |
|  Name:               Digital_Chat_Queue                                    |
|  Description:        Web chat and WhatsApp                                 |
|  Channel Type:       Chat                                                  |
|  Service Level:      15 seconds                                            |
|  Max Time in Queue:  120 seconds                                           |
|  Concurrent Chats:   3 per agent                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Digital_Channels = TRUE                               |
|  Assigned Team:      Digital_Team                                          |
|  Auto-Response:      "Thank you for contacting Abhavtech..."               |
|                                                                             |
|  Q-09: Digital_Email_Queue                                                 |
|  -------------------------------------------------------------------------  |
|  Name:               Digital_Email_Queue                                   |
|  Description:        Email support channel                                 |
|  Channel Type:       Email                                                 |
|  Service Level:      4 hours                                               |
|  Max Time in Queue:  24 hours                                              |
|  Concurrent Emails:  5 per agent                                           |
|  Routing Type:       Round Robin                                           |
|  Assigned Team:      Digital_Team                                          |
|  Auto-Response:      "We received your email. Ticket #..."                 |
|                                                                             |
|  Q-10: Callback_Queue                                                      |
|  -------------------------------------------------------------------------  |
|  Name:               Callback_Queue                                        |
|  Description:        Scheduled callback requests                           |
|  Channel Type:       Telephony (Outbound)                                  |
|  Queue Type:         Outbound                                              |
|  Service Level:      Within scheduled window                               |
|  Routing Type:       Skills-Based (match original request)                 |
|  Assigned Team:      All teams (based on callback type)                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.4.3 Queue Provisioning Steps

```
+-----------------------------------------------------------------------------+
|              QUEUE PROVISIONING - STEP BY STEP                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  STEP 1: Create Queue (Example: Sales_India_Queue)                         |
|  ==================================================                        |
|  1. Navigate: Contact Center > Provisioning > Queues                       |
|  2. Click: "Create Queue"                                                  |
|                                                                             |
|  3. General Settings:                                                      |
|     - Name: Sales_India_Queue                                              |
|     - Description: India B2C/B2B sales inquiries                           |
|     - Queue Type: Inbound Queue                                            |
|     - Channel Type: Telephony                                              |
|                                                                             |
|  4. Service Level Settings:                                                |
|     - Service Level Threshold: 30                                          |
|     - Maximum Time in Queue: 300                                           |
|                                                                             |
|  5. Routing Settings:                                                      |
|     - Call Distribution: Longest Available Agent                           |
|     - Skills Based Selection: Enabled                                      |
|     - Skills Requirements:                                                 |
|       Click "Add Skill Requirement"                                        |
|       - Skill: Sales                                                       |
|       - Operator: Equal To                                                 |
|       - Value: TRUE                                                        |
|       - Required: Yes                                                      |
|       Click "Add Skill Requirement"                                        |
|       - Skill: Region_India                                                |
|       - Operator: Equal To                                                 |
|       - Value: TRUE                                                        |
|       - Required: Yes                                                      |
|                                                                             |
|  6. Team Assignment:                                                       |
|     - Primary Team: India_Sales_Team                                       |
|     - (Team must be created first - see Team Provisioning)                 |
|                                                                             |
|  7. Skill Relaxation (Advanced):                                           |
|     - Enable Skill Relaxation: Yes                                         |
|     - After 120 seconds:                                                   |
|       Remove skill requirement: Region_India                               |
|       (Allows overflow to other regions)                                   |
|                                                                             |
|  8. Music and Messages:                                                    |
|     - Music On Hold: abhavtech_hold_music.wav                              |
|     - Comfort Message: "Your call is important to us..."                   |
|     - Comfort Message Interval: 60 seconds                                 |
|                                                                             |
|  9. Click "Save"                                                           |
|  10. Note Queue ID: _______________                                        |
|                                                                             |
|  REPEAT for each queue in the specifications above.                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
