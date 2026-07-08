# 7.6 Go-Live Validation

## 7.6.1 Go-Live Checklist

```
   WXCC GO-LIVE VALIDATION CHECKLIST
   ENTRY POINTS
   [ ] EP-01: India_Main_Voice_EP active
   [ ] EP-02: India_Sales_Direct_EP active
   [ ] EP-03: EMEA_Main_Voice_EP active
   [ ] EP-04: Americas_Main_Voice_EP active
   [ ] EP-05: Global_Chat_EP active
   [ ] EP-06: Global_Email_EP active
   QUEUES
   [ ] All 10 queues visible in real-time dashboard
   [ ] Agents assigned to correct queues
   [ ] Service Level thresholds configured
   AGENTS
   [ ] 175 agents provisioned
   [ ] All agents able to login
   [ ] Agent state changes working
   [ ] Phone integration (Webex Calling) working
   FLOWS
   [ ] India_MainMenu_Flow_v1 - working
   [ ] Language selection (EN/HI) - working
   [ ] Menu routing - all options working
   [ ] Virtual Agent Abhi - responding
   [ ] After hours flow - activates correctly
   RECORDING
   [ ] Recording enabled (100% calls)
   [ ] Consent announcement playing
   [ ] PCI pause working (Billing queue)
   [ ] Recordings accessible in WFO
   INTEGRATIONS
   [ ] Salesforce screen pop working
   [ ] Dialogflow CX (Abhi) responding
   [ ] Agent Assist suggestions appearing
   SUPERVISOR
   [ ] Real-time dashboard accessible
   [ ] Agent monitoring (whisper/barge) working
   [ ] Reports generating
```

## 7.6.2 Test Scenario Matrix

| ID | Scenario | Entry Point | Expected Result | Pass |
|----|----------|-------------|-----------------|------|
| TC-01 | India TF -> English -> Sales | EP-01 | Routes to Sales_India_Queue | [ ] |
| TC-02 | India TF -> Hindi -> Support | EP-01 | Routes to Support_India_Queue | [ ] |
| TC-03 | Mumbai DID -> Billing | EP-01 | Routes to Billing_Queue | [ ] |
| TC-04 | Invalid menu option | EP-01 | Retry prompt (max 3x) | [ ] |
| TC-05 | No input timeout | EP-01 | Default to English | [ ] |
| TC-06 | After hours call | EP-01 | AfterHours flow | [ ] |
| TC-07 | UK number inbound | EP-03 | Routes to EMEA queues | [ ] |
| TC-08 | US number inbound | EP-04 | Routes to Americas queues | [ ] |
| TC-09 | Virtual Agent "Where is my order" | EP-01 | Abhi provides order status | [ ] |
| TC-10 | Virtual Agent Hindi query | EP-01 | Abhi responds in Hindi | [ ] |
| TC-11 | Virtual Agent escalation | EP-01 | Transfers to agent with context | [ ] |
| TC-12 | Virtual Agent 3x no input | EP-01 | Auto escalate to agent | [ ] |
| TC-13 | Agent hold/resume | - | MOH plays, call resumes | [ ] |
| TC-14 | Blind transfer to queue | - | Transfer completes | [ ] |
| TC-15 | Consult transfer | - | Context preserved | [ ] |
| TC-16 | 3-way conference | - | Conference works | [ ] |
| TC-17 | Web chat conversation | EP-05 | Chat routed to agent | [ ] |
| TC-18 | WhatsApp inbound | EP-05 | Routed to Digital queue | [ ] |
| TC-19 | Email routing | EP-06 | Email in queue | [ ] |
| TC-20 | Recording playback | - | Recording accessible | [ ] |

**Pass Criteria:** >= 95% (19/20 scenarios pass)

## 7.6.3 Performance Validation

| Metric | Target | Actual | Pass |
|--------|--------|--------|------|
| Agent login time | < 30 seconds | | [ ] |
| Call setup time | < 3 seconds | | [ ] |
| IVR prompt playback | No audio issues | | [ ] |
| Agent Desktop responsiveness | < 2 seconds | | [ ] |
| Screen pop latency | < 3 seconds | | [ ] |
| Recording start | Within 2 seconds | | [ ] |

## 7.6.4 Go-Live Sign-Off

```
   WXCC GO-LIVE SIGN-OFF
   WAVE:  -  Wave 1 (Chennai)   -  Wave 2 (London/NJ)   -  Wave 3 (Mumbai)
   DATE: _______________  TIME: _______________
   VALIDATION RESULTS:
   Entry Points Active:   _____ / 6
   Queues Operational:   _____ / 10
   Agents Logged In:   _____ / [Wave Total]
   Test Scenarios Passed:   _____ / 20
   Critical Defects:   _____
   GO-LIVE DECISION:  -  APPROVED   -  NOT APPROVED
   SIGN-OFF:
   Role   Name   Signature   Date
   
   Voice Engineering Lead
   CC Operations Manager
   QA Lead
   Project Manager
   Business Owner
   
   NOTES:
   _____________________________________________________________________
   _____________________________________________________________________
```

---

