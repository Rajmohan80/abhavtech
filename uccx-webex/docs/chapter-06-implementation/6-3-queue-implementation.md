# Chapter 6: Webex Contact Center Implementation -- 6.3 Queue Implementation

## 6.3 Queue Implementation

## 6.3.1 Queue Design (Per Chapter 3.4)

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH QUEUE SPECIFICATIONS - 10 QUEUES                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  QUEUE               | CHANNEL | SL     | MAX Q  | ROUTING    | OVERFLOW  |
|  ========================================================================  |
|                                                                             |
|  Q-01: Sales_India_Queue                                                   |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds (5 min)                                   |
|  Routing Type:       Skills-Based (Longest Available Agent)                |
|  Skills Required:    Sales=TRUE, Region_India=TRUE                         |
|  Skill Relaxation:   After 120s: Remove Region_India                       |
|  Team Assignment:    India_Sales_Team                                      |
|  Overflow Action:    Voicemail_EP                                          |
|  MOH:                abhavtech_hold_music.wav                              |
|  Comfort Messages:   Every 60 seconds                                      |
|                                                                             |
|  Q-02: Sales_EMEA_Queue                                                    |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Sales=TRUE, Region_EMEA=TRUE                          |
|  Skill Relaxation:   After 90s: Add Region_India (follow-the-sun)          |
|  Team Assignment:    EMEA_Sales_Team + India_Sales_Team (backup)           |
|  After Hours:        Route to Sales_India_Queue                            |
|                                                                             |
|  Q-03: Sales_Americas_Queue                                                |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Sales=TRUE, Region_Americas=TRUE                      |
|  Skill Relaxation:   After 90s: Add Region_India                           |
|  Team Assignment:    Americas_Sales_Team + India_Sales_Team (backup)       |
|                                                                             |
|  Q-04: Support_India_Queue                                                 |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  600 seconds (10 min)                                  |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Support=TRUE                                          |
|  Skills Preferred:   Hindi>=5 (priority if available)                      |
|  Team Assignment:    India_Support_Team                                    |
|  Callback Option:    Offer after 180 seconds                               |
|                                                                             |
|  Q-05: Support_EMEA_Queue                                                  |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  480 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Support=TRUE, Region_EMEA=TRUE                        |
|  Team Assignment:    EMEA_Support_Team + India_Support_Team (backup)       |
|                                                                             |
|  Q-06: Support_Americas_Queue                                              |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  480 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Support=TRUE, Region_Americas=TRUE                    |
|  Team Assignment:    Americas_Support_Team + India_Support_Team (backup)   |
|                                                                             |
|  Q-07: Billing_Queue                                                       |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      60 seconds                                            |
|  Max Time in Queue:  480 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Billing=TRUE                                          |
|  Team Assignment:    India_Billing_Team                                    |
|  Recording Pause:    Auto-pause for card capture (PCI)                     |
|                                                                             |
|  Q-08: TechSupport_Queue                                                   |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  600 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    TechnicalSupport=TRUE                                 |
|  Skills Preferred:   ProductA_Expert OR ProductB_Expert                    |
|  Team Assignment:    India_TechSupport_Team                                |
|                                                                             |
|  Q-09: Digital_Chat_Queue                                                  |
|  ----------------------------------------------------------------------    |
|  Channel:            Chat / WhatsApp                                       |
|  Service Level:      15 seconds                                            |
|  Max Wait:           300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Digital_Channels=TRUE                                 |
|  Concurrent Limit:   3 chats per agent                                     |
|  Team Assignment:    India_Digital_Team                                    |
|                                                                             |
|  Q-10: Digital_Email_Queue                                                 |
|  ----------------------------------------------------------------------    |
|  Channel:            Email                                                 |
|  Service Level:      4 hours                                               |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Digital_Channels=TRUE                                 |
|  Concurrent Limit:   5 emails per agent                                    |
|  Team Assignment:    India_Digital_Team                                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.3.2 Queue Provisioning - Step-by-Step

### Creating Sales_India_Queue

**Navigation:** Control Hub -> Contact Center -> Provisioning -> Queues

**Step 1: Create Queue**

1. Click **"Create Queue"**
2. Select Queue Type: **Inbound**

**Step 2: General Settings**

| Field | Value |
|-------|-------|
| Name | Sales_India_Queue |
| Description | India B2C/B2B sales inquiries |
| Channel Type | Telephony |
| Queue Routing Type | Skills Based |

**Step 3: Service Level Settings**

| Field | Value |
|-------|-------|
| Service Level Threshold | 30 (seconds) |
| Maximum Time in Queue | 300 (seconds) |

**Step 4: Skills-Based Routing Configuration**

| Setting | Value |
|---------|-------|
| Skill Requirement 1 | Sales = TRUE |
| Skill Requirement 2 | Region_India = TRUE |
| Agent Selection | Longest Available Agent |

**Step 5: Skill Relaxation (Advanced)**

```
+-----------------------------------------------------------------------------+
|  WAIT TIME    | RELAXATION ACTION                                          |
|  -------------+------------------------------------------------------------|
|  0-60 sec     | Match all required + preferred skills                      |
|  60-120 sec   | Match all required skills only                             |
|  120-180 sec  | Remove Region_India (global pool)                          |
|  180-300 sec  | Reduce language proficiency to minimum                     |
|  >300 sec     | Route to voicemail / callback offer                        |
+-----------------------------------------------------------------------------+
```

**Step 6: Queue Treatment**

| Setting | Value |
|---------|-------|
| Music on Hold | abhavtech_hold_music.wav |
| Comfort Message | Every 60 seconds |
| Position Announcement | Enabled |
| EWT Announcement | Enabled |

**Step 7: Team Assignment**

1. Click **"Assign Team"**
2. Select: **India_Sales_Team**
3. Click **"Add"**

**Step 8: Save**

1. Click **"Save"**
2. **Record Queue ID:** _____________

**REPEAT for all 10 queues.**

---
