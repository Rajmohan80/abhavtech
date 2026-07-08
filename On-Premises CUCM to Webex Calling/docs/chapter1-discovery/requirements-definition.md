# Requirements Definition

## 1.6 Business Requirements & Success Criteria

### 1.6.1 Functional Requirements

**Must-Have Requirements (MoSCoW - Must):**

| ID | Requirement | Current State | Webex Solution | Validation Method |
|----|-------------|---------------|----------------|-------------------|
| FR-001 | Make/receive PSTN calls globally | CUCM + CUBE | Webex Calling + LGW/CCPP | Test call matrix |
| FR-002 | Voicemail with message waiting | Unity Connection | Webex Voicemail | MWI light, portal access |
| FR-003 | Call forwarding (all/busy/no answer) | CUCM line settings | Webex user settings | Functional test |
| FR-004 | Hunt groups for reception | CUCM hunt pilots | Webex Hunt Groups | Call distribution test |
| FR-005 | Shared line for executives | CUCM shared lines | Virtual Lines | Line appearance test |
| FR-006 | Remote access without VPN | Expressway MRA | Native cloud access | Off-network test |
| FR-007 | Single Number Reach | CUCM SNR | Webex SNR | Mobile ring test |
| FR-008 | BLF/Speed dial | CUCM BLF | Webex BLF | LED status test |
| FR-009 | India PSTN compliance | CUBE + Tata/Airtel | LGW per circle + Zone | Toll bypass validation |
| FR-010 | UK/EU data residency | N/A (on-prem) | UK/EU Webex DCs | Compliance audit |

**Should-Have Requirements (MoSCoW - Should):**

| ID | Requirement | Current State | Webex Solution | Validation Method |
|----|-------------|---------------|----------------|-------------------|
| FR-011 | Hot desking | Extension Mobility | Webex Hot Desking | Login/logout test |
| FR-012 | Call park/pickup | CUCM call park | Webex Call Park | Park/retrieve test |
| FR-013 | Directory integration | AD LDAP | Directory Connector | User sync verification |
| FR-014 | CRM integration | Jabber CTI | Webex for Salesforce | Click-to-dial test |
| FR-015 | Calendar integration | Exchange EWS | Hybrid Calendar | Presence/booking test |
| FR-016 | HD voice quality | G.711/G.722 | Opus codec | MOS score measurement |

**Could-Have Requirements (MoSCoW - Could):**

| ID | Requirement | Current State | Webex Solution | Priority |
|----|-------------|---------------|----------------|----------|
| FR-017 | Video calling from desk phones | Limited (8865) | 8845/8865 video | Low |
| FR-018 | Custom hold music | Per-partition | Per-location | Low |
| FR-019 | Paging groups | Cisco Paging | Webex Paging | Medium |
| FR-020 | Door entry integration | SIP intercom | LGW SIP | Low |

### 1.6.2 Non-Functional Requirements

**Performance Requirements:**

| ID | Requirement | Target | Measurement | Threshold |
|----|-------------|--------|-------------|-----------|
| NFR-001 | Call setup time | <3 seconds | Time to ringback | Critical if >5s |
| NFR-002 | Audio quality (MOS) | >4.0 | Webex Analytics | Critical if <3.5 |
| NFR-003 | Packet loss | <1% | Network monitoring | Critical if >3% |
| NFR-004 | Jitter | <30ms | Network monitoring | Critical if >50ms |
| NFR-005 | One-way latency | <150ms | Network monitoring | Critical if >250ms |
| NFR-006 | System availability | 99.99% | Webex Status | Critical if <99.9% |

**Security Requirements:**

| ID | Requirement | Implementation | Validation |
|----|-------------|----------------|------------|
| NFR-007 | Signaling encryption | TLS 1.2+ mandatory | Certificate check |
| NFR-008 | Media encryption | SRTP (AES-256) | Wireshark capture |
| NFR-009 | User authentication | SSO via Okta | Login flow test |
| NFR-010 | Admin access control | RBAC in Control Hub | Permission audit |
| NFR-011 | Audit logging | Control Hub audit logs | Log review |
| NFR-012 | Data residency compliance | Regional DC assignment | Compliance report |

**Availability Requirements:**

| ID | Requirement | Target | Design Approach |
|----|-------------|--------|-----------------|
| NFR-013 | Platform uptime | 99.99% | Webex cloud SLA |
| NFR-014 | PSTN failover | RTO <5 min | Dual LGW (India), CCPP redundancy |
| NFR-015 | Survivability | Local calling during WAN outage | Survivable Gateway (future) |
| NFR-016 | Disaster recovery | RPO 0, RTO 1hr | Cloud-native DR |

### 1.6.3 Success Metrics

**Migration Success KPIs:**

| KPI | Metric | Target | Measurement Method |
|-----|--------|--------|-------------------|
| User Adoption | Active users / Total migrated | >95% within 30 days | Control Hub Analytics |
| Call Quality | Average MOS score | >4.0 | Webex Analytics |
| PSTN Reliability | Successful PSTN calls | >99.5% | Call Detail Records |
| Help Desk Tickets | Voice-related tickets | <20 per week (steady state) | ServiceNow reports |
| User Satisfaction | Survey score | >4.0/5.0 | Post-migration survey |
| Feature Parity | Features delivered | 100% must-have | Validation checklist |
| Compliance | Audit findings | 0 critical | Compliance audit |

**Rollback Triggers:**

| Trigger | Threshold | Action |
|---------|-----------|--------|
| Call failure rate | >5% for 30+ minutes | Initiate rollback |
| Audio quality | MOS <3.0 for 50%+ users | Escalate, potential rollback |
| PSTN outage | Total PSTN failure >15 min | Rollback affected batch |
| User-reported issues | >20% batch reporting problems | Pause, assess, potential rollback |
| Compliance violation | Any India toll bypass failure | Immediate rollback, investigate |

**Success Acceptance Criteria:**

```
+-----------------------------------------------------------------------------+
|              MIGRATION SUCCESS ACCEPTANCE CRITERIA                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  BATCH SIGN-OFF CRITERIA (Required for each migration batch):              |
|  ===========================================================               |
|  [ ] All users can make/receive internal calls                               |
|  [ ] All users can make/receive PSTN calls                                   |
|  [ ] Voicemail accessible and functional                                     |
|  [ ] Call forwarding settings preserved                                      |
|  [ ] BLF/Speed dials functional                                              |
|  [ ] Hunt groups distributing calls correctly                                |
|  [ ] Call quality MOS >4.0 average                                           |
|  [ ] No open P1/P2 incidents                                                 |
|  [ ] User training completed                                                 |
|                                                                             |
|  PHASE SIGN-OFF CRITERIA (Required for phase completion):                  |
|  ========================================================                  |
|  [ ] All batch criteria met for all batches in phase                        |
|  [ ] 72-hour stability period with no major incidents                       |
|  [ ] Help desk ticket volume normalized (<20/week)                          |
|  [ ] User satisfaction survey >4.0/5.0                                      |
|  [ ] Compliance validation passed (India toll bypass, GDPR)                 |
|                                                                             |
|  PROJECT COMPLETION CRITERIA:                                              |
|  ===========================                                               |
|  [ ] 100% users migrated                                                     |
|  [ ] CUCM decommissioning plan approved                                      |
|  [ ] Documentation handoff completed                                         |
|  [ ] Operations team trained and certified                                   |
|  [ ] All integrations functional                                             |
|  [ ] Executive sign-off received                                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

