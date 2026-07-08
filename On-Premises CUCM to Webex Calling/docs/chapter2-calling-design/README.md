# Webex Calling Design

This chapter details the technical design for migrating from CUCM to Webex Calling, covering architecture, location configuration, dial plans, PSTN integration, and coexistence strategies.

> **FICTIONAL NUMBER DISCLAIMER** -- All telephone numbers, DID ranges, toll-free numbers, and ITN numbers in this document are fictional and used for illustrative purposes only. Ranges used: India `+91-XX-4960-XXXX`, India Toll-Free `1800-266-10XX`, UK Freephone `+44-800-096-XXXX`, Germany Freephone `+49-800-096-XXXX`. Do not dial these numbers.

!!! note "Feature Gaps"
    Several CUCM features have no direct equivalent in Webex Calling and require redesign or accepted workarounds. These are documented in the **[Feature Gap Bridge ->](../chapter2a-feature-gap/README.md)** chapter, which must be read alongside this design chapter.

## Chapter Overview

### Sections

**[2.1 Architecture Principles ->](architecture-principles.md)**  
Complete design for CUCM to Webex Calling migration including location strategy, dial plan design, PSTN integration, feature migration, and coexistence architecture

**[2.2 Location Configuration ->](location-configuration.md)**  
Webex location configuration by region, number management, emergency services, announcement languages

**[2.3 Dial Plan Design ->](dial-plan-design.md)**  
Enterprise dial plan, site code assignments, extension ranges, inter-site dialing, external routing

**[2.4 PSTN Integration ->](pstn-integration.md)**  
PSTN connectivity strategies by region, Local Gateway deployment (India), Cloud Connected PSTN (EMEA/Americas), trunk configuration

**[2.5 Feature Migration ->](feature-migration.md)**  
CUCM feature mapping to Webex Calling, hunt groups, call pickup, voicemail, mobility features, paging/intercom

**[2.6 Coexistence Design ->](coexistence-design.md)**  
CUCM-Webex coexistence architecture, call routing during migration, SIP trunk configuration, number portability, rollback procedures

---

## Design Principles

### Architecture Goals

1. **Minimize Disruption**: Zero-downtime migration with phased cutover approach
2. **Feature Parity**: Maintain or improve existing CUCM features in Webex
3. **Regional Compliance**: India DoT/TRAI, EMEA GDPR, Americas standard policies
4. **Operational Simplicity**: Cloud-native management, reduced on-premises infrastructure

### Multi-Region Strategy

| Region | Calling Region | PSTN Strategy | Data Residency |
|--------|----------------|---------------|----------------|
| **India** | APAC (Mumbai + Chennai DCs) | Local Gateway | APAC region |
| **UK** | UK (London) | Cloud Connected PSTN | UK region |
| **EU** | EU (Frankfurt) | Cloud Connected PSTN | EU region |
| **Americas** | US | Cloud Connected PSTN | US region |

---

## Key Design Decisions

### Location Strategy

- **12 Webex Locations** mapping to physical sites
- **Remote/WFH** users assigned to nearest office location
- **Emergency Services** configured per country regulations
- **Number Management** maintains existing DID ranges

### Dial Plan Design

- **4-digit extensions** for all sites (existing scheme retained)
- **Site codes** for abbreviated inter-site dialing (existing scheme retained)
- **E.164 normalization** for all outbound calls
- **Least Cost Routing** via PSTN route groups

### PSTN Integration

**India (7 Sites)**
- Local Gateway per telecom circle (Mumbai, Chennai, Bangalore, Delhi, Noida, Hyderabad)
- Zone/Edge configuration for toll bypass compliance
- SIP trunks to Tata/Airtel per circle
- ITN numbers for remote/WFH users (exempt from toll bypass)

**EMEA (2 Sites)**
- Cloud Connected PSTN via IntelePeer UK/EU
- NO Local Gateway required (no PSTN routing regulations)
- Data residency compliance via calling region selection

**Americas (2 Sites)**
- Cloud Connected PSTN via IntelePeer US
- Standard enterprise PSTN configuration

---

## Coexistence Architecture

During migration, CUCM and Webex Calling will coexist using SIP trunks:

```
+-------------------------------------------------------------+
|                  COEXISTENCE ARCHITECTURE                    |
+-------------------------------------------------------------+
|                                                             |
|  +--------------+        SIP Trunk        +--------------+ |
|  |     CUCM     |<---------------------->|Webex Calling | |
|  |   (Legacy)   |                         |   (Cloud)    | |
|  +------+-------+                         +------+-------+ |
|         |                                        |         |
|         v                                        v         |
|  +--------------+                         +--------------+ |
|  | Migrating    |                         |  Migrated    | |
|  |    Users     |                         |    Users     | |
|  +--------------+                         +--------------+ |
|                                                             |
+-------------------------------------------------------------+
```

---

## Design Validation

Before proceeding to implementation:

- [ ] Webex location design reviewed and approved
- [ ] Dial plan validated with business units
- [ ] PSTN strategy confirmed for all regions
- [ ] Compliance requirements met (India/EMEA)
- [ ] Feature parity documented and accepted
- [ ] Coexistence call flows tested

---

## Next Steps

After completing the design:

1. Review [Contact Center Design](../chapter3-contact-center/README.md) for WxCC architecture
2. Review [Compliance & Security](../chapter4-compliance/README.md) for regional compliance details
3. Proceed to [Implementation](../chapter6-implementation/README.md) for deployment
