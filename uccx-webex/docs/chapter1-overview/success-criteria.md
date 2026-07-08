# Success Criteria

> Success criteria are formally signed off at each phase gate. Failure to meet any Critical metric blocks progression to the next phase.

## Success Metrics

### Phase 2A: Baseline Migration

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Agent Adoption** | 100% within 2 weeks | License activation |
| **Call Success Rate** | >99% | CDR analysis |
| **Average Speed to Answer** | <30 seconds | Real-time analytics |
| **Service Level (80/20)** | >90% | Queue reports |
| **Feature Parity** | 95% | Feature checklist |

### Phase 2B: AI Enhancement

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Virtual Agent Containment** | 40% | Intent resolution rate |
| **Intent Accuracy** | >90% | NLU confidence scores |
| **Agent Assist Adoption** | 80% | Feature usage analytics |
| **Customer Satisfaction** | >4.2/5.0 | Post-interaction CSAT |

---


## Measurement Approach

| Metric | Measurement Tool | Frequency | Owner |
|---|---|---|---|
| Service Level | WxCC Analyzer | Real-time + daily | CC Manager |
| ASA | WxCC Analyzer | Daily | CC Manager |
| Call Success Rate | Control Hub | Daily | Collaboration Ops |
| Agent Adoption | Control Hub login stats | Weekly | Training Lead |
| CSAT | Post-call survey | Weekly | CC Manager |
| Virtual Agent Containment | AI Analytics | Daily | AI Engineer |
| Intent Accuracy | Dialogflow CX console | Weekly | AI Engineer |

## Phase Gate Criteria

### Phase 2A -> 2B Gate
All of the following must be met before Phase 2B begins:

- [ ] Service level >= 85% sustained for 4 weeks
- [ ] ASA <= 45 seconds at all sites
- [ ] Agent Webex App adoption >= 95%
- [ ] Zero P1 incidents in the last 2 weeks of hypercare
- [ ] UCCX formally decommissioned and license returned

### Phase 2B Completion
- [ ] Virtual Agent containment >= 35% (simple intents)
- [ ] Intent accuracy >= 87% (Dialogflow CX)
- [ ] Agent Assist suggestion acceptance rate >= 25%
- [ ] Auto-CSAT correlation within 5% of manual survey score

See [7.6 Go-Live Validation](../chapter-07-migration-execution/7-6-go-live-validation.md)
for the detailed validation checklist used at each wave go-live.
