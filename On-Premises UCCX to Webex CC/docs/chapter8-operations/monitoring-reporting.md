# Chapter 8: WxCC Operations & Support 

## Day-2 Operations for Webex Contact Center

---

**Document Version:** 1.0  
**Date:** January 2026  
**Classification:** Internal - Technical Reference  
**Organization:** Abhavtech.com  
**Project Code:** ABV-COLLAB-MIG-2026-P2-CH8  
**Cross-Reference:** Chapter 3 (Design), Chapter 6 (Implementation), Chapter 7 (Migration)  
**Model Guidance:** Sonnet 4.5 (Concise/Actionable)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | Collaboration Architecture Team | Initial operations procedures |

---

## 8.1 Operations Overview 

## 8.1.1 Support Model

| Tier | Team | Scope | Hours |
|------|------|-------|-------|
| **L1** | Help Desk | Agent login issues, password resets, basic troubleshooting | 24x7 |
| **L2** | CC Operations | Queue management, flow changes, reporting, agent config | Business hours |
| **L3** | Voice Engineering | Entry Points, integrations, Dialogflow, complex issues | On-call |
| **L4** | Cisco TAC | Platform issues, defects, escalations | 24x7 (contracted) |

## 8.1.2 Key Contacts

| Role | Primary | Backup | Contact |
|------|---------|--------|---------|
| CC Operations Manager | [Name] | [Name] | +91-XXXXX |
| Voice Engineering Lead | [Name] | [Name] | +91-XXXXX |
| WxCC Administrator | [Name] | [Name] | +91-XXXXX |
| Help Desk | Team Queue | - | helpdesk@abhavtech.com |
| Cisco TAC | - | - | TAC Case Portal |

## 8.1.3 Administrative Access

| Portal | URL | Purpose | Access |
|--------|-----|---------|--------|
| Control Hub | admin.webex.com | Tenant admin, users, licenses | Full Admin |
| WxCC Management Portal | portal.wxcc-us1.cisco.com | CC configuration | CC Admin |
| Analyzer | analyzer.wxcc-us1.cisco.com | Reporting, dashboards | CC Admin, Supervisors |
| Agent Desktop | desktop.wxcc-us1.cisco.com | Agent operations | All agents |
| Dialogflow CX | dialogflow.cloud.google.com | Virtual Agent "Abhi" | Voice Eng |

---

## 8.2 Monitoring & Dashboards 

## 8.2.1 Real-Time Monitoring

**Supervisor Desktop - Key Metrics:**

| Metric | Location | Target | Alert Threshold |
|--------|----------|--------|-----------------|
| Agents Available | Team View | Per shift staffing | < 80% of scheduled |
| Calls in Queue | Queue Stats | < 10 | > 20 |
| Longest Wait Time | Queue Stats | < 60s | > 120s |
| Service Level (30s) | Dashboard | 85% | < 75% |
| Abandonment Rate | Dashboard | < 4% | > 8% |

**Monitoring Cadence:**

| Frequency | Action | Owner |
|-----------|--------|-------|
| Continuous | Real-time dashboard monitoring | Supervisors |
| Hourly | Service Level check | CC Operations |
| Daily | Performance summary review | CC Operations Manager |
| Weekly | Trend analysis, capacity review | Voice Engineering |

## 8.2.2 Analyzer Dashboards

| Dashboard | Purpose | Audience | Refresh |
|-----------|---------|----------|---------|
| Contact Center Overview | High-level KPIs | Management | 15 min |
| Queue Performance | SL, AHT, abandonment by queue | Supervisors | Real-time |
| Agent Performance | Agent stats, occupancy | Supervisors | Real-time |
| Virtual Agent Analytics | Containment, intents, escalations | CC Ops | Daily |
| Recording Compliance | Recording status, PCI compliance | Compliance | Daily |

## 8.2.3 Alerts Configuration

| Alert | Condition | Notification | Recipient |
|-------|-----------|--------------|-----------|
| High Queue Volume | > 25 calls waiting | Email + SMS | Supervisors |
| Low Agent Availability | < 50% available | Email | CC Ops Manager |
| Service Level Breach | < 70% for 15 min | Email + SMS | CC Ops Manager |
| Entry Point Down | No calls for 10 min | SMS + Call | Voice Eng (P1) |
| Recording Failure | Recording errors | Email | Compliance |

---

## 8.3 Common Issues & Troubleshooting 

## 8.3.1 Agent Desktop Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| **Login Failure** | "Unable to sign in" error | 1. Verify Webex license assigned 2. Check SSO/Azure AD 3. Clear browser cache 4. Try incognito mode |
| **No Calls Arriving** | Agent available but no calls | 1. Verify correct Team assignment 2. Check skill profile 3. Verify queue assignment 4. Check Entry Point routing |
| **Audio Issues** | One-way audio, no audio | 1. Check Webex Calling extension 2. Verify headset connection 3. Test with Webex App directly 4. Check network/firewall |
| **State Stuck** | Can't change state | 1. Refresh browser 2. Logout/login 3. Check for hung calls in system 4. Escalate to L2 |
| **Screen Pop Not Working** | Salesforce not popping | 1. Verify SF connector status 2. Check OAuth token 3. Verify ANI format 4. Check SF user permissions |

## 8.3.2 Call Flow Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| **IVR Not Playing** | Silence on call connect | 1. Check Entry Point -> Flow mapping 2. Verify flow is published 3. Check audio prompt files 4. Review flow error logs |
| **Wrong Queue Routing** | Calls to wrong queue | 1. Verify flow menu logic 2. Check skill requirements on queue 3. Verify agent skill profiles 4. Test flow in debug mode |
| **Virtual Agent Failure** | Abhi not responding | 1. Check Dialogflow CX status 2. Verify GCP service account 3. Check WxCC connector 4. Review Dialogflow logs |
| **After Hours Not Working** | Calls during closed hours | 1. Verify business hours schedule 2. Check timezone settings 3. Review holiday calendar 4. Test flow conditions |
| **Callback Failure** | Callbacks not triggering | 1. Check callback queue config 2. Verify outbound ANI 3. Check agent availability 4. Review callback logs |

## 8.3.3 Integration Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| **Salesforce Down** | No screen pop, CTI errors | 1. Check SF service status 2. Verify OAuth credentials 3. Re-authenticate connector 4. Contact SF admin |
| **Dialogflow Timeout** | VA delays, escalation failures | 1. Check GCP quotas 2. Verify network connectivity 3. Check intent response times 4. Review Dialogflow metrics |
| **Recording Failure** | Missing recordings | 1. Check WFO service status 2. Verify recording policy 3. Check storage capacity 4. Review compliance settings |

## 8.3.4 Quick Diagnostic Commands

**Control Hub Health Check:**
1. Navigate: Services -> Contact Center -> Overview
2. Verify: Service Status = "Operational"
3. Check: Recent alerts and notifications

**Flow Debug Mode:**
1. Navigate: Contact Center -> Flows -> [Flow Name]
2. Click: Debug
3. Enter test number and trace call path

**Agent State Audit:**
1. Navigate: Analyzer -> Agent Reports
2. Run: Agent State History
3. Filter by agent and time range

---

## 8.4 Escalation Procedures 

## 8.4.1 Severity Definitions

| Severity | Definition | Examples |
|----------|------------|----------|
| **P1 - Critical** | Complete service outage | All Entry Points down, no calls routing, platform unavailable |
| **P2 - High** | Major feature impacted | Recording failure, one Entry Point down, VA completely down |
| **P3 - Medium** | Single component issue | One queue not routing, single agent login issue, reporting delay |
| **P4 - Low** | Minor issue | Cosmetic UI issue, non-critical feature request |

## 8.4.2 Escalation Matrix

| Severity | Response | Resolution | Internal Escalation | Cisco TAC |
|----------|----------|------------|---------------------|-----------|
| **P1** | 15 min | 2 hours | Immediate to IT Director | Severity 1 case |
| **P2** | 30 min | 4 hours | 1 hour to Voice Eng Lead | Severity 2 case |
| **P3** | 2 hours | 8 hours | Normal process | Severity 3 case |
| **P4** | 4 hours | 48 hours | Normal process | As needed |

## 8.4.3 Cisco TAC Engagement

**When to Open TAC Case:**
- Platform issues not resolvable internally
- Suspected software defect
- Performance degradation with no clear cause
- Feature not working as documented

**TAC Case Information Required:**
- Organization ID (Control Hub -> Account)
- Entry Point / Queue / Flow names
- Timestamp of issue (UTC)
- Error messages / screenshots
- Steps to reproduce
- Business impact statement

**TAC Portal:** mycase.cloudapps.cisco.com

---

## 8.5 Change Management 

## 8.5.1 Change Categories

| Category | Examples | Approval | Window |
|----------|----------|----------|--------|
| **Standard** | Add agent, skill update, prompt change | CC Ops Manager | Business hours |
| **Normal** | New queue, flow modification, integration change | Change Board | Maintenance window |
| **Emergency** | Production fix, outage resolution | IT Director | Immediate |

## 8.5.2 Change Process

| Step | Action | Owner |
|------|--------|-------|
| 1 | Submit change request (ServiceNow) | Requester |
| 2 | Impact assessment | Voice Engineering |
| 3 | Approval (per category) | Approver |
| 4 | Schedule change window | CC Operations |
| 5 | Execute change | Voice Engineering |
| 6 | Validate and test | QA / CC Ops |
| 7 | Close change request | Requester |

## 8.5.3 Maintenance Windows

| Window | Day | Time (IST) | Duration | Scope |
|--------|-----|------------|----------|-------|
| **Weekly** | Sunday | 2:00 AM - 5:00 AM | 3 hours | Minor changes, updates |
| **Monthly** | 1st Sunday | 12:00 AM - 6:00 AM | 6 hours | Major changes, upgrades |
| **Emergency** | As needed | Minimal impact time | Varies | Critical fixes only |

**Mumbai 24x7 Consideration:** Coordinate with night shift supervisor; ensure minimum staffing during maintenance.

---

## 8.6 Routine Operations 

## 8.6.1 Daily Tasks

| Task | Owner | Time | Procedure |
|------|-------|------|-----------|
| Review overnight alerts | CC Ops | 8:00 AM | Check email, Analyzer alerts |
| Service Level check | CC Ops | 9:00 AM | Review previous day SL |
| Agent attendance reconciliation | Supervisors | 9:30 AM | Compare logins vs schedule |
| Queue health check | CC Ops | 10:00 AM | Verify all queues active |
| Recording spot check | Compliance | 11:00 AM | Sample 5 recordings |

## 8.6.2 Weekly Tasks

| Task | Owner | Day | Procedure |
|------|-------|-----|-----------|
| Performance report generation | CC Ops | Monday | Run weekly KPI report |
| Agent scorecard review | Supervisors | Tuesday | QM evaluations |
| Capacity planning review | CC Ops Manager | Wednesday | Forecast vs actual |
| Flow/prompt change deployment | Voice Eng | Sunday | During maintenance window |
| Backup verification | IT Ops | Friday | Verify config exports |

## 8.6.3 Monthly Tasks

| Task | Owner | Procedure |
|------|-------|-----------|
| License reconciliation | WxCC Admin | Compare assigned vs active |
| Security access review | IT Security | Audit admin access |
| Compliance audit | Compliance | Recording retention, PCI |
| Performance trending | CC Ops Manager | Month-over-month analysis |
| Dialogflow intent review | Voice Eng | VA performance optimization |

---

## 8.7 Reporting & Analytics 

## 8.7.1 Standard Reports

| Report | Frequency | Audience | Delivery |
|--------|-----------|----------|----------|
| Daily Operations Summary | Daily | CC Ops Manager | Email 8 AM |
| Weekly KPI Dashboard | Weekly | Management | Email Monday |
| Agent Performance | Weekly | Supervisors | Analyzer |
| Queue Performance | Weekly | CC Ops | Analyzer |
| Virtual Agent Analytics | Weekly | Voice Eng | Dialogflow Console |
| Monthly Executive Summary | Monthly | IT Director | PowerPoint |

## 8.7.2 Key Performance Indicators

| KPI | Target | Calculation | Source |
|-----|--------|-------------|--------|
| Service Level (30s) | 85% | Calls answered ≤30s / Total calls | Analyzer |
| Average Handle Time | 5.5 min | (Talk + Hold + Wrap) / Calls | Analyzer |
| First Call Resolution | 82% | Resolved first call / Total calls | Survey + CRM |
| Abandonment Rate | < 4% | Abandoned / (Answered + Abandoned) | Analyzer |
| CSAT | 4.3/5 | Survey responses | Post-call survey |
| VA Containment | 35% | VA resolved / VA interactions | Dialogflow |
| Agent Occupancy | 72% | Handle time / Available time | Analyzer |

## 8.7.3 Custom Report Requests

**Request Process:**
1. Submit request via ServiceNow (Report Request category)
2. CC Ops reviews feasibility
3. Voice Eng builds if custom development needed
4. Schedule report delivery

---

## 8.8 Business Continuity 

## 8.8.1 Failover Scenarios

| Scenario | Impact | Automatic Recovery | Manual Action |
|----------|--------|-------------------|---------------|
| **WxCC Regional Outage** | All calls impacted | Cisco DR (automatic) | Monitor, engage TAC |
| **Webex Calling Outage** | Agent phones down | Cisco DR | Failover to mobile |
| **Dialogflow Outage** | VA unavailable | Flow skips VA node | Monitor GCP status |
| **Salesforce Outage** | No screen pop | None | Agents use manual lookup |
| **Internet Outage (Site)** | Site agents offline | None | Activate WFH agents |

## 8.8.2 WFH Contingency

| Requirement | Configuration |
|-------------|---------------|
| VPN | GlobalProtect connected |
| Softphone | Webex App with Calling license |
| Agent Desktop | Browser-based (Chrome) |
| Network | Minimum 5 Mbps up/down |
| Headset | USB headset required |

**Activation:** CC Ops Manager authorizes WFH; agents login from home using standard credentials.

## 8.8.3 Emergency Contact Tree

```
IT Director
    +-- CC Operations Manager
            +-- Supervisor (Mumbai)
            |       +-- Mumbai Agents (120)
            +-- Supervisor (Chennai)
            |       +-- Chennai Agents (30)
            +-- Supervisor (London)
            |       +-- London Agents (15)
            +-- Supervisor (New Jersey)
                    +-- NJ Agents (10)
```

---

## 8.9 Quick Reference 

## 8.9.1 Agent State Codes

| State | Code | Description | Max Duration |
|-------|------|-------------|--------------|
| Available | AVL | Ready for calls | - |
| Not Ready | NR | Not taking calls | 15 min (alert) |
| Not Ready - Break | NR-BRK | Scheduled break | 15 min |
| Not Ready - Lunch | NR-LUN | Lunch break | 60 min |
| Not Ready - Training | NR-TRN | Training session | 120 min |
| Not Ready - Meeting | NR-MTG | Team meeting | 60 min |
| On Call | OC | Active call | - |
| Wrap-up | WRP | Post-call work | 120 sec (auto) |

## 8.9.2 Disposition Codes

| Code | Description | Queue |
|------|-------------|-------|
| SALE_COMPLETE | Sale completed | Sales |
| SALE_CALLBACK | Callback scheduled | Sales |
| SALE_NOINTEREST | No interest | Sales |
| SUP_RESOLVED | Issue resolved | Support |
| SUP_ESCALATED | Escalated to L2 | Support |
| SUP_CALLBACK | Callback scheduled | Support |
| BILL_PAYMENT | Payment taken | Billing |
| BILL_DISPUTE | Dispute logged | Billing |
| TECH_RESOLVED | Tech issue fixed | TechSupport |
| TECH_TICKET | Ticket created | TechSupport |

## 8.9.3 Common Procedures - Quick Steps

**Add New Agent:**
1. Control Hub -> Users -> Add User
2. Assign Webex Calling + Contact Center license
3. Contact Center -> Agents -> Create Agent Profile
4. Assign Team, Skill Profile, User Profile
5. Agent logs in to desktop.wxcc-us1.cisco.com

**Update Agent Skills:**
1. Control Hub -> Contact Center -> Provisioning -> Skill Profiles
2. Select profile or create new
3. Update skill values
4. Assign to agent(s)

**Modify Flow (Minor):**
1. Contact Center -> Flows -> Select flow
2. Make changes in Flow Designer
3. Validate flow
4. Publish flow
5. Test with sample call

**Add Holiday:**
1. Contact Center -> Provisioning -> Business Hours
2. Select schedule
3. Add holiday date
4. Save and verify flow handles correctly

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 3 v2.0 | WxCC Design (source of truth) |
| Chapter 6 v3.0 | Implementation Procedures |
| Chapter 7 Phase 2 | Migration Execution |
| WxCC Admin Guide | help.webex.com/en-us/article/n4jgze8 |
| Analyzer User Guide | help.webex.com/en-us/article/n1qj7x4 |
| Cisco TAC Portal | mycase.cloudapps.cisco.com |

---

*© 2026 Abhavtech.com - Internal Use Only*  
*Document Code: ABV-COLLAB-MIG-2026-P2-CH8 v1.0*
