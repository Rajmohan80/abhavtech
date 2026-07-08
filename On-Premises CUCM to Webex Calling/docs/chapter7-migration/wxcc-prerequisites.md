# 7.1 WxCC Migration Prerequisites

## 7.1.1 Phase 1 Dependency

```
   WXCC MIGRATION - PHASE 1 DEPENDENCY
   CRITICAL: UCCX REQUIRES CUCM FOR CTI CONNECTIVITY
   DEPENDENCY CHAIN:
   CTI (JTAPI)
   UCCX <-> CUCM
   (Contact   (Call
   Center)   Control)
   MIGRATION IMPACT:
      
   Once CC agents move to   Once CUCM is decommissioned,
   Webex Calling (Phase 1   UCCX loses CTI connectivity.
   Batch 5), they cannot   No parallel operation possible.
   receive UCCX routed calls.
   IMPLICATION:
   WxCC cutover is effectively a BIG BANG for contact center.
   Phase 1 completion is a HARD GATE for Phase 2.
   Rollback = Full stack rollback (Webex Calling   CUCM   UCCX)
```

## 7.1.2 Prerequisites Checklist

```
   WXCC MIGRATION - PREREQUISITES CHECKLIST
   PHASE 1 COMPLETION (MANDATORY)
   [ ] All 175 CC agents migrated to Webex Calling (Chapter 7 P1 Batch 5)
   [ ] CC agent desk phones registered to Webex Calling
   [ ] Webex App deployed to all CC agents
   [ ] PSTN connectivity validated (LGW India, CCPP EMEA/US)
   [ ] Phase 1 48-hour stability confirmed for CC agents
   [ ] CUCM decommission NOT started (rollback path preserved)
   CHAPTER 6 IMPLEMENTATION (MANDATORY)
   [ ] WxCC tenant activated (India DC)
   [ ] All 175 agent licenses assigned
   [ ] 6 Entry Points configured
   [ ] 10 Queues configured
   [ ] 18 Skills created
   [ ] 12 Skill Profiles created
   [ ] 8 Teams configured
   [ ] 9 Flows built and validated
   [ ] 87 Audio prompts uploaded (62 EN + 25 HI)
   [ ] Virtual Agent "Abhi" integrated (Dialogflow CX)
   [ ] Salesforce connector configured
   [ ] Recording enabled (100% all calls)
   [ ] PCI auto-pause configured (Billing queue)
   [ ] All 20 test scenarios passed (Chapter 6.10.2)
   INFRASTRUCTURE
   [ ] DNS entries prepared for cutover
   [ ] Toll-free number porting request submitted (if applicable)
   [ ] SD-WAN QoS validated (ABV-SDWAN-2024)
   [ ] India DC data residency confirmed
   TRAINING
   [ ] Agent training curriculum finalized
   [ ] Supervisor training curriculum finalized
   [ ] Training environment provisioned (sandbox tenant)
   [ ] Training schedule published
   OPERATIONS
   [ ] Cutover runbook reviewed and signed off
   [ ] Rollback procedures documented
   [ ] Hypercare support schedule confirmed
   [ ] Help desk briefed on WxCC support
   [ ] Vendor TAC cases opened (preventive)
```

## 7.1.3 Go/No-Go Gate

| Gate | Criteria | Owner | Status |
|------|----------|-------|--------|
| **G1** | Phase 1 CC agents stable 48+ hours | Voice Eng Lead | [ ] |
| **G2** | Chapter 6 implementation 100% complete | WxCC Eng Lead | [ ] |
| **G3** | All 20 test scenarios passed | QA Lead | [ ] |
| **G4** | Agent training 100% complete (per wave) | Training Lead | [ ] |
| **G5** | Cutover runbook signed off | Project Manager | [ ] |
| **G6** | Rollback plan validated | Voice Eng Lead | [ ] |
| **G7** | Business owner approval | CC Operations Mgr | [ ] |
| **G8** | No P1/P2 open defects | QA Lead | [ ] |

**Decision:** All gates MUST be passed before cutover proceeds.

---

