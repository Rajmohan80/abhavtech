# Chapter 3: Webex Contact Center Design (Phase 2) -- 3.7 Agent Desktop Design

## 3.7 Agent Desktop Design

## 3.7.1 Agent Desktop Configuration

```
+-----------------------------------------------------------------------------+
|              WEBEX CONTACT CENTER AGENT DESKTOP DESIGN                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DESKTOP TYPE: Webex Contact Center Agent Desktop (WebRTC)                 |
|  ACCESS URL:   desktop.wxcc.cisco.com                                      |
|  BROWSER:      Chrome (recommended), Edge, Firefox                         |
|  TELEPHONY:    WebRTC (primary) / Webex App / Desk Phone                   |
|                                                                             |
|  LAYOUT DESIGN:                                                            |
|  ==============                                                            |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  | HEADER BAR                                                          |   |
|  | +--------------------------------------------------------------+   |   |
|  | | [Abhavtech Logo]  Agent: Priya S.  | Status: Available v    |   |   |
|  | |                                     | Queue: Sales_India    |   |   |
|  | +--------------------------------------------------------------+   |   |
|  +---------------------------------------------------------------------+   |
|  | MAIN WORKSPACE                                                      |   |
|  | +-----------------------------+-------------------------------+   |   |
|  | | INTERACTION PANEL           | SCREEN POP / CRM              |   |   |
|  | |                             |                               |   |   |
|  | | +-------------------------+ | +---------------------------+ |   |   |
|  | | | Caller: +91-98XXX-XXXXX | | | Customer: Rajesh Kumar    | |   |   |
|  | | | Queue: Sales_India      | | | Account: ABV-00012345     | |   |   |
|  | | | Wait Time: 00:45        | | | Tier: Premium             | |   |   |
|  | | |                         | | | Last Contact: 15 Jan 2026 | |   |   |
|  | | | [Answer] [Decline]      | | |                           | |   |   |
|  | | +-------------------------+ | | Open Tickets: 2           | |   |   |
|  | |                             | | +-----------------------+ | |   |   |
|  | | CALL CONTROLS               | | | TKT-001: Billing Query| | |   |   |
|  | | +-------------------------+ | | | TKT-002: Product Info | | |   |   |
|  | | | [Hold] [Transfer]       | | | +-----------------------+ | |   |   |
|  | | | [Mute] [Conference]     | | |                           | |   |   |
|  | | | [Wrap-up] [End Call]    | | | [New Ticket] [View CRM]   | |   |   |
|  | | +-------------------------+ | +---------------------------+ |   |   |
|  | |                             |                               |   |   |
|  | | AI ASSISTANT PANEL          |                               |   |   |
|  | | +-------------------------+ |                               |   |   |
|  | | | Sentiment: 😊 Positive  | |                               |   |   |
|  | | |                         | |                               |   |   |
|  | | | Suggested Response:     | |                               |   |   |
|  | | | "I understand you have  | |                               |   |   |
|  | | | questions about your    | |                               |   |   |
|  | | | recent order..."        | |                               |   |   |
|  | | |                         | |                               |   |   |
|  | | | [Use] [Dismiss]         | |                               |   |   |
|  | | +-------------------------+ |                               |   |   |
|  | +-----------------------------+-------------------------------+   |   |
|  +---------------------------------------------------------------------+   |
|  | TASK LIST / QUEUE PANEL                                             |   |
|  | +--------------------------------------------------------------+   |   |
|  | | Active Tasks: 1 | Waiting: 12 | Chat: 2 | Email: 5           |   |   |
|  | +--------------------------------------------------------------+   |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.7.2 User Profile Configuration

```
+-----------------------------------------------------------------------------+
|              AGENT USER PROFILE SPECIFICATIONS                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PROFILE NAME         | ROLE        | PERMISSIONS                          |
|  ========================================================================= |
|                                                                             |
|  UP-01: Standard_Agent_Profile                                             |
|  -------------------------------------------------------------------------  |
|  Role:                Standard Agent                                       |
|  Agent Desktop:       [OK] Enabled                                            |
|  Multimedia Profile:  Voice + 2 concurrent chats                           |
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
|                                                                             |
|  UP-02: Premium_Agent_Profile                                              |
|  -------------------------------------------------------------------------  |
|  Role:                Premium Agent                                        |
|  Agent Desktop:       [OK] Enabled                                            |
|  Multimedia Profile:  Voice + 3 concurrent chats + 5 emails                |
|  Additional:                                                               |
|    [OK] All Standard permissions                                              |
|    [OK] Access digital channels (WhatsApp, email)                             |
|    [OK] Agent Assist features                                                 |
|    [OK] Screen recording (training)                                           |
|                                                                             |
|  UP-03: Supervisor_Profile                                                 |
|  -------------------------------------------------------------------------  |
|  Role:                Supervisor                                           |
|  Agent Desktop:       [OK] Enabled (can take calls)                           |
|  Additional:                                                               |
|    [OK] All Premium permissions                                               |
|    [OK] Monitor agents (listen/whisper/barge)                                 |
|    [OK] View real-time dashboards                                             |
|    [OK] Access team reports                                                   |
|    [OK] Change agent states                                                   |
|    [OK] Re-skill agents (temporary)                                           |
|    [X] System configuration                                                  |
|                                                                             |
|  UP-04: Admin_Profile                                                      |
|  -------------------------------------------------------------------------  |
|  Role:                Administrator                                        |
|  Agent Desktop:       Optional                                             |
|  Additional:                                                               |
|    [OK] All Supervisor permissions                                            |
|    [OK] User provisioning                                                     |
|    [OK] Flow Designer access                                                  |
|    [OK] Queue/Entry Point configuration                                       |
|    [OK] Reporting and analytics                                               |
|    [OK] Audit log access                                                      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
