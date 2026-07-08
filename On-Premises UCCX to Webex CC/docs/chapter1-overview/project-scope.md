# Project Scope

> This page summarises the Abhavtech UCCX to Webex Contact Center migration scope. See the [Home page](../index.md) for the full project index.

## Project Overview

This documentation provides comprehensive guidance for migrating from on-premises Cisco Unified Contact Center Express (UCCX) to cloud-based Webex Contact Center (WxCC).

### Migration Scope

| Metric | Value |
|--------|-------|
| **Total Agents** | 175 (150 voice + 25 digital) |
| **Sites** | 4 (Mumbai, Chennai, London, New Jersey) |
| **Channels** | Voice, Chat, Email, WhatsApp |
| **Entry Points** | 6 (4 voice + 2 digital) |
| **Teams** | 8 (Sales-IN, Sales-EMEA, Sales-US, Support, Billing, Tech, Digital, Supervisors) |
| **Licenses** | Standard (100), Premium (75), Supervisor (10) |

### Migration Phases

**Phase 1**: CUCM -> Webex Calling (**COMPLETE**)
- 3,200 enterprise users migrated
- Webex Calling operational across 12 sites
- Foundation for Phase 2

**Phase 2A**: UCCX -> WxCC Baseline (**CURRENT**)
- 175 agents migrated to WxCC
- Feature parity with UCCX (DTMF IVR menus)
- NO AI features - baseline migration only
- Duration: ~3 months operational stability

**Phase 2B**: AI Enhancement (**PLANNED**)
- Virtual Agent "Abhi" deployment
- Webex AI Agent + Dialogflow CX hybrid
- Agent Assist enablement
- Intent-based routing

---


## Agent Distribution

| Site | Voice | Digital | Total | Hours | Primary Teams |
|------|-------|---------|-------|-------|---------------|
| **Mumbai HQ** | 100 | 20 | 120 | 24x7 | Sales-IN, Support, Billing, Tech |
| **Chennai** | 25 | 5 | 30 | 9AM-9PM | Sales-IN, Support, Digital |
| **London** | 15 | 0 | 15 | 9AM-6PM | Sales-EMEA, Support |
| **New Jersey** | 10 | 0 | 10 | 9AM-6PM | Sales-US, Support |
| **TOTAL** | **150** | **25** | **175** | | |

---


## Channel Strategy

### Voice (Telephony)

**Entry Points**: 4 regional voice entry points
- India Main: 1800-266-1000, +91-22-4960-1000
- India Sales Direct: 1800-266-1001
- EMEA Main: +44-20-XXXX-XXXX
- Americas Main: +1-201-XXX-XXXX

**Routing**: Skill-based routing with queue priority

### Digital (Chat & Email)

**Entry Points**: 2 digital entry points
- Global Chat: Web widget, WhatsApp
- Global Email: support@abhavtech.com

**Routing**: Team-based routing with digital-specific skills

---


## Key Design Decisions

### Baseline vs AI Migration

**Decision**: Two-phase approach (Baseline -> AI Enhancement)

**Rationale**:
- Minimize complexity during initial migration
- Achieve feature parity with UCCX first
- Allow 3 months operational stability before AI
- Validate baseline flows before AI modifications

### Hybrid AI Architecture

**Decision**: Webex AI Agent + Dialogflow CX hybrid

**Rationale**:
- Webex AI Agent: Simple intents, native integration
- Dialogflow CX: Complex multi-turn conversations, advanced NLU
- Best of both platforms
- Flexibility for future expansion

### Data Residency

| Region | WxCC Data Center | Agent Sites | Compliance |
|--------|------------------|-------------|------------|
| **APAC** | Mumbai + Chennai DCs | Mumbai, Chennai | India data residency |
| **UK** | London | London | UK GDPR |
| **US** | US East | New Jersey | SOC 2 Type II |

---

