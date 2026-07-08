# Chapter 7: WxCC Migration Execution (Phase 2) -- 7.5 Rollback Procedures

## 7.5 Rollback Procedures

## 7.5.1 Rollback Decision Framework

```
+-----------------------------------------------------------------------------+
|              ROLLBACK DECISION FRAMEWORK                                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [!]️ CRITICAL: ROLLBACK = FULL STACK REVERT                                |
|                                                                             |
|  Because UCCX requires CUCM CTI connectivity, rollback means:              |
|  1. Revert agents from WxCC to Webex Calling only (no CC)                 |
|  2. Re-enable CUCM (if still available during hypercare)                  |
|  3. Re-enable UCCX                                                         |
|  4. Re-register phones to CUCM                                             |
|                                                                             |
|  ROLLBACK TRIGGERS (Auto):                                                 |
|  -------------------------                                                 |
|  * > 50% of agents unable to login after 2 hours                          |
|  * > 30% of test scenarios failing after remediation attempts             |
|  * Complete Entry Point failure (no calls reaching WxCC)                  |
|  * Recording not functioning (compliance risk)                            |
|                                                                             |
|  ROLLBACK TRIGGERS (Manual - Business Decision):                          |
|  -----------------------------------------------                          |
|  * Customer impact exceeds acceptable threshold                           |
|  * Prolonged degradation with no resolution in sight                      |
|  * Business owner requests rollback                                       |
|                                                                             |
|  ROLLBACK WINDOW:                                                          |
|  ----------------                                                          |
|  * Wave 1-2: Rollback possible within 48 hours (CUCM still active)       |
|  * Wave 3: Rollback possible within 2 weeks (hypercare period)           |
|  * Post-hypercare: CUCM decommissioned - no rollback path                 |
|                                                                             |
|  ROLLBACK AUTHORITY:                                                       |
|  ------------------                                                        |
|  Primary:   CC Operations Manager + Voice Engineering Lead                |
|  Escalation: IT Director                                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.5.2 Rollback Procedure

**Procedure: Full Stack Rollback to UCCX**

| Step | Action | Owner | Time |
|------|--------|-------|------|
| 1 | **DECISION:** Confirm rollback required | CC Ops + Voice Eng | - |
| 2 | Notify all stakeholders (rollback initiated) | Cutover Mgr | 5 min |
| 3 | Agents logout from WxCC Agent Desktop | CC Ops | 10 min |
| 4 | Disable WxCC Entry Points | WxCC Admin | 5 min |
| 5 | Verify CUCM cluster is operational | Voice Eng | 5 min |
| 6 | Verify UCCX is operational | Voice Eng | 5 min |
| 7 | Re-enable UCCX agents | Voice Eng | 10 min |
| 8 | Revert PSTN routing to CUCM/UCCX | Voice Eng | 15 min |
| 9 | Agents login to Finesse (UCCX) | CC Ops | 15 min |
| 10 | Verify agent availability in UCCX | CC Ops | 5 min |
| 11 | Test inbound call to UCCX | QA Lead | 10 min |
| 12 | Confirm UCCX operational | Cutover Mgr | 5 min |
| 13 | Notify stakeholders (rollback complete) | Cutover Mgr | 5 min |
| 14 | Schedule post-mortem | PM | - |

**Estimated Rollback Duration:** 90 minutes

## 7.5.3 Partial Rollback (Wave-Specific)

For Wave 1 or Wave 2, if only the newly migrated site experiences issues:

| Step | Action |
|------|--------|
| 1 | Disable Entry Points for affected site only |
| 2 | Affected site agents logout from WxCC |
| 3 | Re-enable affected site agents in UCCX |
| 4 | Route affected site DIDs back to UCCX |
| 5 | Keep other waves operational on WxCC |
| 6 | Investigate and remediate before retry |

**Note:** Partial rollback only works if CUCM/UCCX still operational.

## 7.5.4 Post-Rollback Actions

| Action | Owner | Timeframe |
|--------|-------|-----------|
| Conduct post-mortem meeting | PM | Within 24 hours |
| Document root cause | Voice Eng | Within 48 hours |
| Create remediation plan | Voice Eng | Within 1 week |
| Re-schedule cutover attempt | PM | Per remediation |
| Communicate to stakeholders | PM | Ongoing |

---
