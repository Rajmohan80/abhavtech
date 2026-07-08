# Migration Execution

This chapter provides detailed runbooks and procedures for executing the cutover from CUCM/UCCX to Webex Calling/Contact Center, including pre-migration tasks, phased cutover, and validation testing.

## Chapter Overview

### Sections

**[7.1 Pre-Migration Tasks ->](pre-migration.md)**  
Complete migration execution guide including pre-migration checklist, Webex Calling cutover runbook, Contact Center cutover procedures, and validation & testing protocols

**[7.2 Webex Calling Cutover ->](calling-cutover.md)**  
Hour-by-hour migration runbook, batch migration procedures, CUCM-Webex coexistence configuration, rollback procedures

**[7.3 Contact Center Cutover ->](contact-center-cutover.md)**  
UCCX to WxCC migration runbook, queue cutover procedures, agent onboarding, script validation

**[7.4 Validation & Testing ->](validation-testing.md)**  
Post-migration testing checklist, call flow validation, feature testing, compliance verification, performance baseline

---

## Migration Strategy

### Phased Approach

**Phase 1: CUCM -> Webex Calling** (Current Focus)
- Pilot: 50 users (Week 1)
- Wave 1: 500 users (Week 2-3)
- Wave 2: 1,000 users (Week 4-5)
- Wave 3: 1,650 users (Week 6-8)
- Total: 3,200 users over 8 weeks

**Phase 2: UCCX -> WxCC** (Future)
- Contact center migration after Webex Calling stabilization
- Deferred to Phase 2 (structure ready)

### Migration Batches

| Batch | Sites | Users | Timeline | Validation |
|-------|-------|-------|----------|------------|
| **Pilot** | Mumbai (selected users) | 50 | Week 1 | 1 week observation |
| **Wave 1** | Mumbai, Chennai | 500 | Week 2-3 | 2 weeks stability |
| **Wave 2** | Bangalore, Delhi, Noida | 1,000 | Week 4-5 | 2 weeks stability |
| **Wave 3** | Remaining sites | 1,650 | Week 6-8 | Final validation |

---

## Pre-Migration Checklist

### 1 Week Before Migration

**Infrastructure**:
- [ ] All PSTN connectivity tested and validated
- [ ] India LGW deployed and toll bypass compliance verified
- [ ] Network QoS policies configured
- [ ] Firewall rules implemented
- [ ] DNS records created

**Configuration**:
- [ ] Webex locations configured
- [ ] User accounts provisioned
- [ ] Dial plan validated
- [ ] Hunt groups and call queues created
- [ ] Voicemail policies configured

**Communication**:
- [ ] Migration notices sent to affected users
- [ ] Training sessions completed
- [ ] Support team briefed
- [ ] Rollback plan reviewed

### 1 Day Before Migration

**Final Validation**:
- [ ] CUCM-Webex SIP trunk active and tested
- [ ] Test calls completed (inbound/outbound/inter-site)
- [ ] Emergency services tested
- [ ] Rollback procedures validated
- [ ] Support resources on standby

---

## Cutover Day Runbook

### T-4 Hours: Final Preparation

**09:00 - 10:00**: Pre-cutover checks
- Verify SIP trunk health (CUCM <-> Webex)
- Confirm PSTN connectivity
- Test emergency services
- Review rollback trigger criteria

**10:00 - 11:00**: Freeze configuration changes
- Lock CUCM configuration
- Document current call routing
- Prepare rollback scripts

### T-0 Hours: Cutover Execution

**11:00 - 11:30**: Migrate users to Webex
- Bulk activate Webex Calling licenses
- Update user calling profiles in Control Hub
- Configure forwarding from CUCM to Webex (temporary)

**11:30 - 12:00**: Update call routing
- Modify CUCM call routing for migrated extensions
- Route calls via SIP trunk to Webex
- Monitor call flow via CUCM RTMT

**12:00 - 13:00**: Validation
- Test inbound calls to migrated users
- Test outbound calls from migrated users
- Verify inter-site calling (CUCM <-> Webex)
- Check emergency services

### T+1 Hours: Stabilization

**13:00 - 14:00**: Monitor and adjust
- Review call detail records (CDR)
- Check SIP trunk utilization
- Address user issues via support queue
- Document any anomalies

**14:00 - 17:00**: Extended monitoring
- Continue user support
- Monitor call quality metrics
- Track incident volumes
- Prepare end-of-day status report

### T+24 Hours: Post-Migration Review

**Next Day**:
- Review incident logs
- Analyze call quality metrics
- Gather user feedback
- Decision: proceed to next batch or hold

---

## Rollback Procedures

### Rollback Triggers

Initiate rollback if:
- >20% user-reported call failures
- Emergency services unavailable
- PSTN connectivity loss
- Critical feature unavailable
- Compliance violation (India toll bypass)

### Rollback Steps (30-Minute Window)

1. **Revert call routing in CUCM** (10 min)
   - Restore original translation patterns
   - Remove Webex SIP trunk routing

2. **Deactivate Webex licenses** (10 min)
   - Bulk deactivate in Control Hub
   - Prevent users from accessing Webex Calling

3. **Validate CUCM operation** (10 min)
   - Test inbound/outbound calls
   - Verify voicemail access
   - Check hunt group functionality

---

## Validation & Testing

### Post-Migration Test Cases

**Call Scenarios**:
- [ ] Internal extension-to-extension calling
- [ ] Outbound PSTN calls (local, long distance, international)
- [ ] Inbound PSTN calls
- [ ] Inter-site calling (across Webex locations)
- [ ] Emergency services (test numbers only)
- [ ] Voicemail deposit and retrieval
- [ ] Call forwarding and simultaneous ring
- [ ] Hunt group and call queue functionality
- [ ] Conference calling
- [ ] Webex app desktop/mobile integration

**Compliance Testing (India)**:
- [ ] Calls from Mumbai office route via Mumbai LGW (Mumbai circle)
- [ ] Calls from Chennai office route via Chennai LGW (Tamil Nadu circle)
- [ ] Verify correct telecom circle egress via CDR analysis
- [ ] Toll bypass compliance confirmed per DoT/TRAI

**Performance Baseline**:
- [ ] Call setup time <3 seconds
- [ ] One-way latency <150ms
- [ ] Packet loss <1%
- [ ] Jitter <30ms
- [ ] MOS score >4.0

---

## Support Structure

### Migration Day Support

| Role | Responsibility | Contact |
|------|----------------|---------|
| **Migration Lead** | Overall coordination | [Name] |
| **PSTN Engineer** | LGW/CCPP troubleshooting | [Name] |
| **Network Engineer** | QoS, firewall, DNS | [Name] |
| **Helpdesk** | User support (Tier 1) | [Ext] |
| **Vendor TAC** | Cisco/Webex escalations | [Case #] |

### Escalation Path

**Level 1**: Helpdesk (15 min response)  
**Level 2**: Migration Team (30 min response)  
**Level 3**: Vendor TAC (1 hour response)  
**Level 4**: Emergency Rollback Decision

---

## Next Steps

After successful cutover:

1. Review [Operations & Day 2](../chapter8-operations/README.md) for ongoing management
2. Begin next migration wave (if validated)
3. Update documentation with lessons learned
4. Review **Appendix I** for detailed runbook templates

---

## WxCC Migration Execution (Phase 2)

**[7.1 WxCC Prerequisites ->](wxcc-prerequisites.md)**  
Phase 1 dependency confirmation, prerequisites checklist, Go/No-Go gate criteria

**[7.2 WxCC Migration Timeline ->](wxcc-timeline.md)**  
Overall schedule, wave migration plan, detailed per-wave schedules (Chennai pilot, London/NJ, Mumbai HQ)

**[7.3 Agent Training Program ->](wxcc-agent-training.md)**  
Training curriculum, schedule by wave, completion criteria, training materials

**[7.4 WxCC Cutover Runbook ->](wxcc-cutover-runbook.md)**  
Cutover team and roles, wave-by-wave runbooks (Chennai, Mumbai), entry point routing switch procedure, agent login verification

**[7.5 Rollback Procedures ->](wxcc-rollback.md)**  
Rollback decision framework, full and partial rollback procedures, post-rollback actions

**[7.6 Go-Live Validation ->](wxcc-golive-validation.md)**  
Go-live checklist, test scenario matrix, performance validation, sign-off procedure

**[7.7 Hypercare Period ->](wxcc-hypercare.md)**  
Hypercare contacts, issue escalation matrix, daily status report template, exit criteria

**[7.8 UCCX Decommissioning ->](wxcc-decommissioning.md)**  
Decommission prerequisites, data archival, decommission procedure, post-decommission validation

**[7.9 Migration Quick Reference ->](wxcc-quick-reference.md)**  
Pre-cutover, cutover day, and post-cutover checklists; key contacts
