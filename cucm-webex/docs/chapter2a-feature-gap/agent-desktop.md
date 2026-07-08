# Finesse Agent Desktop -- Webex Agent Desktop Migration

> **[!]️ GAP SEVERITY: HIGH | Affects: All 175 Contact Center Agents**

## 3A.1.1 Problem Statement

UCCX uses Cisco Finesse as the agent desktop, which Abhavtech has customized with:
- Salesforce CTI gadgets
- Screen pop on call answer
- Wallboard widgets
- Custom attendance gadget

Webex Contact Center uses the **Webex Agent Desktop** -- a different web application with a different widget architecture (Webex Desktop Layout JSON vs. Finesse OpenSocialGadgets/iFrames). **No migration tool exists to convert Finesse gadgets to Webex Desktop widgets.**

## 3A.1.2 Desktop Feature Mapping

| Finesse Feature | Webex Agent Desktop Equivalent | Migration Effort |
|---|---|---|
| Salesforce CTI screen pop | Native Salesforce connector (Einstein CTI) | Reconfigure -- 2 days |
| Agent state management | Webex Agent Desktop (built-in) | [OK] No effort -- native |
| Call controls (hold/transfer/conf) | Webex Agent Desktop (built-in) | [OK] No effort -- native |
| Queue statistics panel | Webex Desktop (built-in or custom widget) | Low -- configure layout JSON |
| Supervisor silent monitor/barge | WxCC Supervisor Desktop (native) | [OK] No effort -- native |
| Wallboard gadget | External wallboard via WxCC API / Analyzer | High -- rebuild integration |
| Custom attendance gadget | No equivalent | **Accepted gap** |
| Chat widget | WxCC Digital Channels (native) | Configure -- 1 day |
| Email widget | WxCC Digital Channels (native) | Configure -- 1 day |

## 3A.1.3 Webex Agent Desktop Layout Configuration

```json
{
  "agentErrorHandlers": {},
  "panels": [
    {
      "comp": "agentx-wc-ipcf-component",
      "attributes": { "style": "width: 100%" }
    }
  ],
  "navigation": [
    {
      "navigatorLabel": "Task",
      "icon": "tasks-bold",
      "iconType": "momentum",
      "navigatorRoutePath": "/task"
    }
  ]
}
```

## 3A.1.4 Accepted Gaps

The **custom Finesse attendance gadget** (agent clock-in/out reporting) has no WxCC equivalent. Abhavtech HR Operations has agreed to use **Microsoft Teams Shifts** integration as the replacement for attendance tracking. This is documented as an accepted gap with no WxCC workaround required.

---
