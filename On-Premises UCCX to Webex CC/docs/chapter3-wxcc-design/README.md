# WxCC Design

Complete Webex Contact Center architecture design covering channels, routing, data residency, and technical specifications for the UCCX to WxCC migration.

## Chapter Overview

### Sections

**[3.1 Architecture Overview ->](architecture-overview.md)**  
Complete WxCC design including architecture, channel strategy, routing design, queue configuration, team structure, flow design, data residency, and integration points

**[3.2 Channel Strategy ->](channel-strategy.md)**  
Voice and digital channel configuration, entry point design, media routing

**[3.3 Routing Design ->](routing-design.md)**  
Skill-based routing, queue priority, overflow handling, after-hours routing

**[3.4 Data Residency ->](data-residency.md)**  
Regional data centers, compliance requirements, GDPR considerations

---

## Architecture Summary

### Agent Distribution

| Site | Agents | Channels | Hours | Teams |
|------|--------|----------|-------|-------|
| **Mumbai HQ** | 120 | Voice + Digital | 24x7 | Sales-IN, Support, Billing, Tech |
| **Chennai** | 30 | Voice + Digital | 9AM-9PM | Sales-IN, Support, Digital |
| **London** | 15 | Voice only | 9AM-6PM | Sales-EMEA, Support |
| **New Jersey** | 10 | Voice only | 9AM-6PM | Sales-US, Support |

### Channel Strategy

**Voice (Telephony)**:
- 4 regional entry points
- DTMF IVR menus (Phase 2A baseline)
- Skill-based routing
- Queue callback capability

**Digital (Chat & Email)**:
- 2 digital entry points
- Web widget + WhatsApp integration
- Team-based routing
- Asynchronous email handling

### Queue Configuration

**18 Total Queues**:
- 14 queues (Phase 2A baseline)
- 4 AI-specific queues (Phase 2B future)

**Queue Types**:
- Regional queues (India, EMEA, Americas)
- Function queues (Sales, Support, Billing, Tech)
- Digital queues (Chat, Email)
- Special queues (Supervisor, After-hours, Callback)

---

## Design Principles

1. **Feature Parity First**: Achieve UCCX feature parity before AI enhancement
2. **Phased Approach**: Baseline migration (2A) -> AI enhancement (2B)
3. **Minimize Complexity**: Simple DTMF menus initially
4. **Data Residency**: Comply with regional requirements (India, UK, US)
5. **Operational Stability**: 3 months baseline before AI features

---

## Key Components

### Entry Points (6)

| ID | Name | Channel | Region | Flow |
|----|------|---------|--------|------|
| EP-01 | India_Main_Voice_EP | Telephony | India | India_MainMenu_Flow_v1 |
| EP-02 | India_Sales_Direct_EP | Telephony | India | India_Sales_Direct_Flow_v1 |
| EP-03 | EMEA_Main_Voice_EP | Telephony | EMEA | EMEA_MainMenu_Flow_v1 |
| EP-04 | Americas_Main_Voice_EP | Telephony | Americas | Americas_MainMenu_Flow_v1 |
| EP-05 | Global_Chat_EP | Chat | Global | Digital_Chat_Flow_v1 |
| EP-06 | Global_Email_EP | Email | Global | Digital_Email_Flow_v1 |

### Teams (8)

| Team | Site | Agents | Skills | Channels |
|------|------|--------|--------|----------|
| Sales-IN | Mumbai, Chennai | 45 | Sales, English, Hindi | Voice |
| Sales-EMEA | London | 15 | Sales, English | Voice |
| Sales-US | New Jersey | 10 | Sales, English | Voice |
| Support | Mumbai, Chennai, London, NJ | 60 | Support, Tier1, Tier2 | Voice |
| Billing | Mumbai | 15 | Billing, Finance | Voice |
| TechSupport | Mumbai | 15 | Technical, Advanced | Voice |
| Digital | Mumbai, Chennai | 25 | Chat, Email, Digital | Digital |
| Supervisors | All sites | 10 | Supervisor, AllQueues | All |

---

## Data Residency

### Regional Deployment

| Region | WxCC Data Center | Sites | Agents | Compliance |
|--------|------------------|-------|--------|------------|
| **APAC** | Mumbai + Chennai DCs | Mumbai, Chennai | 150 | India data residency |
| **UK** | London | London | 15 | UK GDPR |
| **US** | US East | New Jersey | 10 | SOC 2 Type II |

### Compliance Requirements

- **India**: Data stored in India region (Mumbai + Chennai DCs)
- **UK**: GDPR compliance, UK calling region
- **Americas**: SOC 2 Type II, US data center

---

## Next Steps

1. Review [Queues & Teams](../chapter4-queues-teams/README.md) for detailed configuration
2. Review [Flow Migration](../chapter5-flow-migration/README.md) for UCCX to Flow Builder mapping
3. Proceed to [Implementation](../chapter6-implementation/README.md) for deployment
