# Chapter 10: Advanced AI Integration & Implementation -- 10.18 Deployment & Cutover

## 10.18 Deployment & Cutover

## 10.18.1 Deployment Approach

**Phased Rollout Strategy:**

| Phase | Scope | Duration | Rollback Plan |
|-------|-------|----------|---------------|
| Phase 1 | 10% traffic (EMEA only) | 1 week | Disable VA node |
| Phase 2 | 25% traffic (+ Americas) | 1 week | Route around VA |
| Phase 3 | 50% traffic (+ India partial) | 2 weeks | Queue-level toggle |
| Phase 4 | 100% traffic (full India) | Ongoing | Flow version switch |

## 10.18.2 Cutover Checklist

```
+-----------------------------------------------------------------------------+
|                    PHASE 2B AI CUTOVER CHECKLIST                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PRE-CUTOVER (T-1 Week):                                                   |
|  [ ] All UAT test cases passed                                               |
|  [ ] Dialogflow CX agent in "production" environment                         |
|  [ ] CCAI Connector verified active                                          |
|  [ ] Flows published to production                                           |
|  [ ] Agent training completed                                                |
|  [ ] KB articles published                                                   |
|  [ ] Monitoring dashboards configured                                        |
|  [ ] Rollback procedure documented and tested                                |
|                                                                             |
|  CUTOVER DAY:                                                              |
|  [ ] Confirm low-traffic window                                              |
|  [ ] Enable VA in first region/percentage                                    |
|  [ ] Monitor real-time metrics                                               |
|  [ ] Verify agent screen pops working                                        |
|  [ ] Test escalation path manually                                           |
|  [ ] Confirm recording/logging operational                                   |
|                                                                             |
|  POST-CUTOVER (T+1 Day):                                                   |
|  [ ] Review overnight metrics                                                |
|  [ ] Check for error spikes                                                  |
|  [ ] Gather initial agent feedback                                           |
|  [ ] Address any critical issues                                             |
|  [ ] Proceed to next phase or rollback                                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
