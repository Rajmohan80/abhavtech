---
description: Cisco UCCX to Webex Contact Center migration — contact center design, agent experience, IVR porting, reporting, and operational transition planning.
---
# UCCX to Webex Contact Center Migration

> **Enterprise Contact Center Migration Documentation**  
> 175 Agents | Multi-Channel | AI-Powered | Global Deployment

Author: Rajmohan M, ABHAVTECH.COM
---

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

!!! note "Companion Documentation — CUCM to Webex Calling"
    This project builds directly on the **[CUCM to Webex Calling Migration](https://webex-calling.abhavtech.com)** documentation. Key design decisions established in Phase 1 that this project inherits and does not repeat:

    | Topic | Established In | Reference |
    |---|---|---|
    | **Numbering Plan** | CUCM project Ch. 2.4 | 4-digit extensions, site codes (81-87 India, 91-94 EMEA/US), E.164 normalisation |
    | **DID Ranges** | CUCM project Ch. 2.3 | `+91-XX-4960-XXXX` per telecom circle (Mumbai `+91-22-`, Chennai `+91-44-`, Hyderabad `+91-40-`, Bangalore `+91-80-`) |
    | **India Toll Bypass** | CUCM project Ch. 2.3.2 | Zone/Edge mandatory per telecom circle; ITN (9XXXXXXXXX) exempt; 3 compliance scenarios documented |
    | **PSTN Architecture** | CUCM project Ch. 2.3 | Local Gateway (India 7 sites, Tata/Airtel), Cloud Connected PSTN (UK/EU/Americas, IntelePeer) |
    | **DoT/TRAI Compliance** | CUCM project Ch. 4.3 | Geographic DID egress rules, per-circle LGW design, EMEA GDPR data residency |
    | **Coexistence Design** | CUCM project Ch. 2.6 | CUBE SIP trunk, CUCM↔Webex call routing during migration overlap |

    Contact centre entry point DIDs (`+91-22-4960-1000` Mumbai, `1800-266-1000` India toll-free) are provisioned on the same Webex Calling infrastructure established in Phase 1. The WxCC entry points map directly onto the Webex Calling location structure.

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

## Documentation Structure

### Part I: Planning & Assessment

**[Migration Overview ->](chapter1-overview/README.md)**  
Project scope, migration phases, success criteria, timeline

**[UCCX Assessment ->](chapter2-uccx-assessment/README.md)**  
Current state analysis, script inventory, feature utilization, integration points

### Part II: Design & Architecture

**[WxCC Design ->](chapter3-wxcc-design/README.md)**  
Architecture overview, channel strategy, routing design, data residency

**[Queues & Teams ->](chapter4-queues-teams/README.md)**  
Queue configuration, team structure, skills matrix, site configuration

**[Flow Migration ->](chapter5-flow-migration/README.md)**  
UCCX to Flow Builder mapping, IVR menu design, database integration, best practices

### Part III: Implementation & Migration

**[Implementation ->](chapter6-implementation/README.md)**  
Control Hub setup, entry point configuration, flow development, agent desktop setup

**[Migration Execution ->](chapter7-migration-execution/README.md)**  
Pre-migration tasks, cutover runbook, validation testing, rollback procedures

**[Operations & Support ->](chapter8-operations/README.md)**  
Monitoring & reporting, agent training, supervisor tools, troubleshooting

### Part IV: Optimization & AI

**[Performance Optimization ->](chapter9-optimization/README.md)**  
Analytics & insights, queue optimization, agent performance

**[AI Features ->](chapter10-ai-features/README.md)**  
Virtual Agent, Agent Assist, hybrid AI architecture, AI roadmap

### Appendices

**[Appendices ->](appendices/README.md)**  
Glossary, reference links, configuration procedures, deferred items, master checklist, AI observability guide, master reference card

---

## Quick Start

1. **Assessment Phase**: Review [UCCX Assessment](chapter2-uccx-assessment/README.md) to understand current state
2. **Design Phase**: Study [WxCC Design](chapter3-wxcc-design/README.md) and [Queues & Teams](chapter4-queues-teams/README.md)
3. **Migration Planning**: Follow [Flow Migration](chapter5-flow-migration/README.md) methodology
4. **Implementation**: Execute [Implementation](chapter6-implementation/README.md) steps
5. **Cutover**: Use [Migration Execution](chapter7-migration-execution/README.md) runbooks
6. **Operations**: Prepare with [Operations & Support](chapter8-operations/README.md)

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

## Queue Configuration (18 Queues)

### Phase 2A - Baseline (14 Queues)

**India Queues**:
- India_Sales_Q (Priority 1, 24x7)
- India_Support_Q (Priority 2, 24x7)
- India_Billing_Q (Priority 3, 9AM-9PM)
- India_TechSupport_Q (Priority 2, 24x7)

**EMEA Queues**:
- EMEA_Sales_Q (Priority 1, 9AM-6PM)
- EMEA_Support_Q (Priority 2, 9AM-6PM)

**Americas Queues**:
- Americas_Sales_Q (Priority 1, 9AM-6PM)
- Americas_Support_Q (Priority 2, 9AM-6PM)

**Digital Queues**:
- Digital_Chat_Q (Priority 2, 24x5)
- Digital_Email_Q (Priority 3, 24x5)

**Overflow/Escalation**:
- Supervisor_Escalation_Q
- AfterHours_Voicemail_Q
- Callback_Q
- General_Q

### Phase 2B - AI Enhancement (+4 Queues)

- AI_HandoffIntent_Q
- AI_SentimentEscalation_Q
- AI_ComplexQuery_Q
- AI_LanguageNotSupported_Q

---

## AI Features Roadmap

### Phase 2A: Baseline (Current)

- Traditional DTMF IVR menus
- Skill-based routing
- No AI features

### Phase 2B: AI Enhancement (Planned)

**Virtual Agent "Abhi"**:
- Languages: English, Hindi, Tamil
- Intents: 50+ (account status, payment info, order tracking, FAQs)
- Containment Target: 40%
- Hybrid Architecture: Webex AI Agent (simple) + Dialogflow CX (complex)

**Agent Assist**:
- Real-time suggested responses
- Context summaries for transfers
- Sentiment analysis with escalation alerts
- Auto CSAT scoring
- Agent wellbeing monitoring

**Advanced Features** (Future):
- Predictive routing (requires 6+ months historical data)
- Voice of customer analytics
- Proactive outreach

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

## Document Information

| Item | Value |
|------|-------|
| **Version** | 2.0 |
| **Date** | March 2026 |
| **Organization** | AbhavTech |
| **Project Code** | ABV-COLLAB-MIG-2026 (Phase 2) |
| **Author** | Contact Center Architecture Team |

---

## Disclaimer

!!! warning "AI-Assisted Documentation"
    This documentation was generated with AI assistance (Claude by Anthropic) to demonstrate comprehensive technical documentation capabilities for contact center migrations. All configurations, procedures, and recommendations should be validated in a lab environment before production deployment. Queue strategies, flow designs, and AI architectures reflect best practices as of March 2026 and should be customized to your specific business requirements.

---

*© 2025-2026 AbhavTech - The Practitioner's Guide to Enterprise Migrations & Cross-Domain Integration*
