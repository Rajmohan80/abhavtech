# 3.7 Agent Desktop Design

## 3.7.1 Agent Desktop Configuration

```
   WEBEX CONTACT CENTER AGENT DESKTOP DESIGN
   DESKTOP TYPE: Webex Contact Center Agent Desktop (WebRTC)
   ACCESS URL:   desktop.wxcc.cisco.com
   BROWSER:   Chrome (recommended), Edge, Firefox
   TELEPHONY:   WebRTC (primary) / Webex App / Desk Phone
   LAYOUT DESIGN:
   *  *  *  *  *  *  *  *  *  *  *  *  *  *
   HEADER BAR
   [Abhavtech Logo]  Agent: Priya S.   Status: Available  
   Queue: Sales_India
   MAIN WORKSPACE
   INTERACTION PANEL   SCREEN POP / CRM
   Caller: +91-98XXX-XXXXX   Customer: Rajesh Kumar
   Queue: Sales_India   Account: ABV-00012345
   Wait Time: 00:45   Tier: Premium
   Last Contact: 15 Jan 2026
   [Answer] [Decline]
   Open Tickets: 2
   CALL CONTROLS   TKT-001: Billing Query
   TKT-002: Product Info
   [Hold] [Transfer]
   [Mute] [Conference]
   [Wrap-up] [End Call]   [New Ticket] [View CRM]
   AI ASSISTANT PANEL
   Sentiment:   Positive
   Suggested Response:
   "I understand you have
   questions about your
   recent order..."
   [Use] [Dismiss]
   TASK LIST / QUEUE PANEL
   Active Tasks: 1   Waiting: 12   Chat: 2   Email: 5
```

## 3.7.2 User Profile Configuration

```
   AGENT USER PROFILE SPECIFICATIONS
   PROFILE NAME   ROLE   PERMISSIONS
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   UP-01: Standard_Agent_Profile
   Role:   Standard Agent
   Agent Desktop:   Enabled
   Multimedia Profile:  Voice + 2 concurrent chats
   Permissions:
   Answer/Make calls
   Hold/Resume
   Transfer (Blind/Consult)
   Conference
   Wrap-up selection
   View queue statistics
   -- Monitor other agents
   -- Access reports
   -- Change queue settings
   UP-02: Premium_Agent_Profile
   Role:   Premium Agent
   Agent Desktop:   Enabled
   Multimedia Profile:  Voice + 3 concurrent chats + 5 emails
   Additional:
   All Standard permissions
   Access digital channels (WhatsApp, email)
   Agent Assist features
   Screen recording (training)
   UP-03: Supervisor_Profile
   Role:   Supervisor
   Agent Desktop:   Enabled (can take calls)
   Additional:
   All Premium permissions
   Monitor agents (listen/whisper/barge)
   View real-time dashboards
   Access team reports
   Change agent states
   Re-skill agents (temporary)
   -- System configuration
   UP-04: Admin_Profile
   Role:   Administrator
   Agent Desktop:   Optional
   Additional:
   All Supervisor permissions
   User provisioning
   Flow Designer access
   Queue/Entry Point configuration
   Reporting and analytics
   Audit log access
```

---

