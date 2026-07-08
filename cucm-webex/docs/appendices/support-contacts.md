# Support Contacts & Escalation

## 8.7 Incident Management

### 8.7.1 Incident Classification

| Priority | Definition | Response | Resolution |
|----------|------------|----------|------------|
| **P1 - Critical** | Service outage affecting >50 users | 15 min | 4 hours |
| **P2 - High** | Feature outage or >10 users affected | 30 min | 8 hours |
| **P3 - Medium** | Single user or non-critical feature | 2 hours | 24 hours |
| **P4 - Low** | Minor issue, workaround exists | 4 hours | 72 hours |

### 8.7.2 P1 Incident Procedure

**Procedure: Critical Incident Response**

| Step | Action | Owner | Timeline |
|------|--------|-------|----------|
| 1 | Acknowledge alert/report | Help Desk | 0 min |
| 2 | Verify scope of impact | Help Desk | 5 min |
| 3 | Classify as P1 if criteria met | Help Desk | 10 min |
| 4 | Page Voice Engineering Lead | Help Desk | 10 min |
| 5 | Open bridge call | Voice Eng | 15 min |
| 6 | Check Webex status page | Voice Eng | 15 min |
| 7 | If Webex issue: Open Cisco TAC case (Sev 1) | Voice Eng | 20 min |
| 8 | If local issue: Begin troubleshooting | Voice Eng | 20 min |
| 9 | Notify stakeholders | Voice Eng Lead | 30 min |
| 10 | Provide hourly updates | Voice Eng | Ongoing |
| 11 | Document resolution | Voice Eng | Post-incident |
| 12 | Conduct post-incident review | Voice Eng Lead | Within 5 days |

### 8.7.3 Cisco TAC Escalation

**Procedure: Open TAC Case**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to support.cisco.com | Cisco support portal |
| 2 | Login with CCO ID | Linked to contract |
| 3 | Click "Open a Case" | New case |
| 4 | Select Technology: Collaboration | Webex Calling |
| 5 | Select Sub-technology: Webex Calling | Specific product |
| 6 | Set Severity: | |
| | - Severity 1: Network down | P1 |
| | - Severity 2: Severe impact | P2 |
| | - Severity 3: Moderate impact | P3/P4 |
| 7 | Enter problem description | Be specific |
| 8 | Include: | |
| | - Org ID | |
| | - Affected users/devices | |
| | - Timeline of issue | |
| | - Troubleshooting done | |
| 9 | Attach logs if requested | Control Hub exports |
| 10 | Note case number | Reference for follow-up |

**TAC Contact Numbers:**

| Region | Phone |
|--------|-------|
| Americas | +1-800-553-2447 |
| EMEA | +32-2-704-5555 |
| APAC | +61-2-8446-7411 |
| India | 1800-103-5312 |

### 8.7.4 Incident Documentation Template

```
+-----------------------------------------------------------------+
|  INCIDENT REPORT                                                 |
+-----------------------------------------------------------------+
|                                                                 |
|  Incident ID: INC-XXXXXXX                                      |
|  Priority: P1 / P2 / P3 / P4                                   |
|  Status: Open / In Progress / Resolved / Closed                |
|                                                                 |
|  TIMELINE:                                                     |
|  Reported:    YYYY-MM-DD HH:MM                                 |
|  Acknowledged: YYYY-MM-DD HH:MM                                |
|  Resolved:    YYYY-MM-DD HH:MM                                 |
|                                                                 |
|  IMPACT:                                                       |
|  Users Affected: ___                                           |
|  Locations:     ___                                            |
|  Services:      ___                                            |
|                                                                 |
|  DESCRIPTION:                                                  |
|  _______________________________________________               |
|                                                                 |
|  ROOT CAUSE:                                                   |
|  _______________________________________________               |
|                                                                 |
|  RESOLUTION:                                                   |
|  _______________________________________________               |
|                                                                 |
|  PREVENTION:                                                   |
|  _______________________________________________               |
|                                                                 |
+-----------------------------------------------------------------+
```

---

