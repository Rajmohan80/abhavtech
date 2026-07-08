# Migration Phases

The Abhavtech UCCX to Webex Contact Center migration runs in two phases within the broader
three-phase UC transformation programme.

## Overall Programme Context

| Phase | Scope | Duration |
|---|---|---|
| **Phase 1** | CUCM -> Webex Calling (3,200 users, 12 sites) | 14 weeks |
| **Phase 2A** | UCCX -> WxCC baseline (175 agents, feature parity) | 10 weeks |
| **Phase 2B** | AI enhancement (Virtual Agent, Agent Assist, intent routing) | 8 weeks |

Phase 1 is a prerequisite for Phase 2 — UCCX requires CUCM CTI connectivity, so CUCM
must remain operational until all 175 CC agents have moved to WxCC and UCCX is decommissioned.

## Phase 2A — Baseline WxCC Migration

**Objective:** Achieve full feature parity with UCCX for all 175 agents across 4 sites.

| Wave | Sites | Agents | Schedule |
|---|---|---|---|
| Pilot | Chennai (30 agents) | 30 | Weeks 1-2 |
| Wave 2 | London (15) + New Jersey (10) | 25 | Weeks 3-4 |
| Wave 3 | Mumbai HQ (120) | 120 | Weeks 5-8 |
| Hypercare | All sites | 175 | Weeks 9-10 |

**Phase 2A entry criteria:**
- Phase 1 complete: all 3,200 users on Webex Calling
- Webex Calling confirmed stable (4+ weeks post-cutover, <1% call failure rate)
- WxCC tenant provisioned and validated in staging
- All 9 UCCX scripts migrated to Flow Designer (3 requiring REST API backend completed)
- Agent training programme complete for pilot wave

## Phase 2B — AI Enhancement

**Objective:** Add AI-powered self-service and agent productivity features.

| Feature | Platform | Timeline |
|---|---|---|
| Virtual Agent "Abhi" (simple intents) | Webex AI Agent | Weeks 1-4 of Phase 2B |
| Virtual Agent (complex multi-turn) | Dialogflow CX | Weeks 3-8 |
| Agent Assist (real-time suggestions) | Cisco AI Assistant | Weeks 5-8 |
| Intent-based routing | WxCC + Dialogflow | Weeks 7-8 |
| AI Operations (AIOps monitoring) | Splunk + AI metrics | Ongoing |

**Phase 2B entry criteria:**
- Phase 2A stable for 4+ weeks (service level >= 85%, ASA <= 45s)
- Virtual Agent NLU training complete (>= 85% intent accuracy in UAT)
- REST API backends live (Salesforce VIP lookup, billing DB, product DB)

## Key Milestones

```
Phase 2A Go/No-Go ─── Chennai Pilot ─── London/NJ Wave ─── Mumbai Cutover ─── Hypercare end
     |                    |                    |                   |                  |
   Week 0              Weeks 1-2            Weeks 3-4           Weeks 5-8         Week 10
                                                                                      |
                                                                              Phase 2B starts
```

See [7.2 Migration Wave Planning](../chapter-07-migration-execution/7-2-migration-wave-planning.md)
for the detailed wave schedule and cutover runbooks.
