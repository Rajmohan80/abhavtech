# Chapter 6: Webex Contact Center Implementation -- 6.6 Agent & Team Provisioning

## 6.6 Agent & Team Provisioning

## 6.6.1 User Profile Design (Per Chapter 3.7.3)

```
+-----------------------------------------------------------------------------+
|              AGENT DESKTOP USER PROFILES - 4 PROFILES                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  UP-01: Standard_Agent_Profile                                             |
|  =======================================================================   |
|  Role:                 Standard Agent                                      |
|  Agent Desktop:        [OK] Enabled                                           |
|  Multimedia Profile:   Voice only (1 call at a time)                       |
|  Wrap-up Time:         60 seconds (auto)                                   |
|  Permissions:                                                              |
|    [OK] Answer/Make calls                                                     |
|    [OK] Hold/Resume                                                           |
|    [OK] Transfer (Blind/Consult)                                              |
|    [OK] Conference                                                            |
|    [OK] Wrap-up selection                                                     |
|    [OK] View queue statistics                                                 |
|    [X] Monitor other agents                                                  |
|    [X] Access reports                                                        |
|    [X] Change queue settings                                                 |
|  Agent Count:          100                                                 |
|                                                                             |
|  UP-02: Premium_Agent_Profile                                              |
|  =======================================================================   |
|  Role:                 Premium Agent                                       |
|  Agent Desktop:        [OK] Enabled                                           |
|  Multimedia Profile:   Voice + 3 concurrent chats + 5 emails               |
|  Wrap-up Time:         90 seconds (manual)                                 |
|  Additional Permissions:                                                   |
|    [OK] All Standard permissions                                              |
|    [OK] Access digital channels (Chat, WhatsApp, Email)                       |
|    [OK] Agent Assist features                                                 |
|    [OK] Screen recording (training)                                           |
|  Agent Count:          75                                                  |
|                                                                             |
|  UP-03: Supervisor_Profile                                                 |
|  =======================================================================   |
|  Role:                 Supervisor                                          |
|  Agent Desktop:        [OK] Enabled (can take calls)                          |
|  Additional Permissions:                                                   |
|    [OK] All Premium permissions                                               |
|    [OK] Monitor agents (listen/whisper/barge)                                 |
|    [OK] View real-time dashboards                                             |
|    [OK] Access team reports                                                   |
|    [OK] Change agent states                                                   |
|    [OK] Re-skill agents (temporary)                                           |
|    [X] System configuration                                                  |
|  Supervisor Count:     10                                                  |
|                                                                             |
|  UP-04: Admin_Profile                                                      |
|  =======================================================================   |
|  Role:                 Administrator                                       |
|  Agent Desktop:        Optional                                            |
|  Additional Permissions:                                                   |
|    [OK] All Supervisor permissions                                            |
|    [OK] User provisioning                                                     |
|    [OK] Flow Designer access                                                  |
|    [OK] Queue/Entry Point configuration                                       |
|    [OK] Reporting and analytics                                               |
|    [OK] Audit log access                                                      |
|  Admin Count:          5                                                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.6.2 Team Configuration

```
+-----------------------------------------------------------------------------+
|              TEAM CONFIGURATION - 8 TEAMS                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TEAM NAME            | SITE       | AGENTS | SUPERVISOR     | QUEUES      |
|  ---------------------+------------+--------+----------------+-------------|
|  India_Sales_Team     | Mumbai     |     45 | Priya Sharma   | Sales_India |
|  India_Support_Team   | Mumbai     |     40 | Raj Kumar      | Support_IN  |
|  India_TechSupport    | Mumbai     |     15 | Amit Verma     | TechSupport |
|  India_Billing_Team   | Mumbai     |     15 | Sneha Gupta    | Billing     |
|  Chennai_Support      | Chennai    |     25 | Karthik Raja   | Support_IN  |
|  India_Digital_Team   | Chennai    |     25 | Lakshmi Iyer   | Digital     |
|  EMEA_Team            | London     |     15 | James Wilson   | Sales_EMEA  |
|  Americas_Team        | New Jersey |     10 | Mike Johnson   | Sales_Amer  |
|  ---------------------+------------+--------+----------------+-------------|
|  TOTAL                |            |    175 | 10             |             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.6.3 Bulk Agent Provisioning

### CSV Template for 175 Agents

| Column | Required | Example |
|--------|----------|---------|
| Email | Yes | agent1@abhavtech.com |
| First Name | Yes | Priya |
| Last Name | Yes | Sharma |
| Site | Yes | Mumbai |
| Team | Yes | India_Sales_Team |
| User Profile | Yes | Standard_Agent_Profile |
| Skill Profile | Yes | Sales_India_EN_HI |
| Multimedia Profile | Yes | Voice_Only |
| Extension | Optional | 81001 |

**Upload Procedure:**

1. Download CSV template from Control Hub
2. Populate with 175 agent records
3. Navigate to: Control Hub -> Users -> Bulk Manage
4. Upload CSV file
5. Review validation results
6. Confirm import

---
