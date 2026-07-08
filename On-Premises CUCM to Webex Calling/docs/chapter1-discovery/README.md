# Discovery & Current State Assessment

This chapter covers the comprehensive discovery and assessment phase of the CUCM & UCCX to Webex migration project.

## Chapter Overview

### Sections

**[1.1 Current State Inventory ->](current-state-inventory.md)**  
Global site topology, CUCM cluster architecture, UCCX deployment, Unity Connection, telephony infrastructure, network architecture

**[1.2 Gap Analysis ->](gap-analysis.md)**  
Feature utilization analysis, capabilities comparison, CUCM vs Webex Calling feature parity, UCCX vs WxCC feature mapping

**[1.3 Requirements Definition ->](requirements-definition.md)**  
Migration dependency analysis, integration requirements, business continuity requirements, training needs

**[1.4 Licensing & Sizing ->](licensing-sizing.md)**  
Network readiness assessment, bandwidth calculations, WAN optimization, SD-WAN integration, QoS requirements

**[1.5 Migration Strategy ->](migration-strategy.md)**  
Compliance readiness assessment (India, EMEA, Americas), business requirements, success criteria, risk assessment

---

## Discovery Objectives

The discovery phase aims to:

1. **Document Current State**: Complete inventory of existing CUCM, UCCX, Unity Connection infrastructure
2. **Identify Requirements**: Business and technical requirements for the cloud migration
3. **Assess Readiness**: Network, compliance, and organizational readiness
4. **Define Strategy**: Migration approach, phasing, and success criteria

---

## Key Deliverables

- Current state architecture diagrams
- Feature utilization reports
- Gap analysis documentation
- Network readiness assessment
- Compliance requirements matrix
- Migration strategy and phasing plan
- Risk register and mitigation plans

---

## Project Scope Summary

| Metric | Value |
|--------|-------|
| **Global Sites** | 12 locations (India: 7, UK: 1, EU: 1, Americas: 2, Remote: WFH) |
| **Total Users** | 3,200 enterprise calling users |
| **Total Phones** | 2,780 physical/software endpoints |
| **Contact Center Agents** | 175 agents (150 India, 15 UK, 10 Americas) |
| **CUCM Cluster** | 1 Publisher + 4 Subscribers (Mumbai HUB) |
| **UCCX Cluster** | 2-node HA deployment |
| **Unity Connection** | 2-node HA deployment |
| **PSTN Strategy** | Local Gateway (India), CCPP (UK/EU/Americas) |

---

## Regional Considerations

### India (7 Sites, 2,400 Users)

- **Compliance**: DoT/TRAI toll bypass regulations
- **PSTN**: Local Gateway per telecom circle
- **Zone/Edge**: Required for geographic DIDs
- **Data Residency**: India region (Mumbai + Chennai DCs)

### EMEA (2 Sites, 800 Users)

- **Compliance**: GDPR data residency and privacy
- **PSTN**: Cloud Connected PSTN (IntelePeer UK/EU)
- **Zone/Edge**: NOT required (no PSTN routing regulations)
- **Data Residency**: UK (London) and EU (Frankfurt) calling regions

### Americas (2 Sites, 750 Users)

- **Compliance**: Standard enterprise policies
- **PSTN**: Cloud Connected PSTN (IntelePeer US)
- **Data Residency**: US calling region

---

## Discovery Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Infrastructure Inventory** | Week 1-2 | Site topology, CUCM/UCCX architecture diagrams |
| **Feature Analysis** | Week 2-3 | Feature utilization reports, gap analysis |
| **Network Assessment** | Week 3-4 | Bandwidth calculations, QoS requirements |
| **Compliance Review** | Week 4-5 | Regulatory requirements matrix |
| **Strategy Development** | Week 5-6 | Migration strategy, phasing plan |

---

## Next Steps

After completing the discovery phase:

1. Review [Webex Calling Design](../chapter2-calling-design/README.md) for architecture design
2. Review [Contact Center Design](../chapter3-contact-center/README.md) for WxCC design
3. Review [Compliance & Security](../chapter4-compliance/README.md) for regional requirements
