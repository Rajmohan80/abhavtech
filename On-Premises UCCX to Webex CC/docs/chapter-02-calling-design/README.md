# Chapter 2: Webex Calling Design

This chapter is split into the following topics, each covering one stage of the Webex Calling design.

## In This Chapter

- **[2.1 Webex Calling Architecture Overview](2-1-webex-calling-architecture-overview.md)**
- **[2.2 Location Design](2-2-location-design.md)**
- **[2.3 PSTN Design](2-3-pstn-design.md)**
- **[2.4 Dial Plan Design](2-4-dial-plan-design.md)**
- **[2.5 Feature Design](2-5-feature-design.md)**
- **[2.6 Interworking Design (CUCM-Webex Coexistence)](2-6-interworking-design-cucm-webex-coexistence.md)**

## Chapter 2 Summary

### Key Design Decisions

| Decision Area | Selection | Rationale |
|---------------|-----------|-----------|
| Platform | Webex Calling Multi-Tenant | Scale fits, cost-effective, cloud-native |
| Home Region | APAC (Mumbai + Chennai DCs) | Majority users in India |
| India PSTN | Local Gateway per circle | DoT compliance, existing contracts |
| EMEA PSTN | CCPP (IntelePeer) | No toll bypass, simplified management |
| Americas PSTN | CCPP (IntelePeer) | Simplified management, E911 support |
| India WFH | ITN Numbers | Toll bypass exempt, location-flexible |
| Extension Length | 4 digits | Matches existing CUCM |
| ESN Format | 8-XX-XXXX | Location routing prefix |
| Coexistence | CUBE trunk | Bidirectional CUCM<->Webex routing |

### Cross-Reference Matrix

| This Chapter Section | Related Chapter | Related Section |
|---------------------|-----------------|-----------------|
| 2.1.3 Data Residency | Chapter 4 | 4.3 India Compliance, 4.4 EMEA Compliance |
| 2.2.2 India Locations | Chapter 1 | 1.1 Site Inventory |
| 2.3.2 Local Gateway | Chapter 5 | 5.5 Firewall Requirements |
| 2.3.2 Zone/Edge | Chapter 4 | 4.3.2 Toll Bypass Prevention |
| 2.4.4 Emergency Calling | Chapter 4 | 4.5 Americas Compliance |
| 2.6 Coexistence | Chapter 7 | 7.2 Migration Procedures |

---

## Chapter 2 Appendix

### Template 2.A: Location Configuration Checklist

| Item | Configured | Verified | Notes |
|------|------------|----------|-------|
| Location name | [ ] | [ ] | |
| Site code | [ ] | [ ] | |
| Street address | [ ] | [ ] | |
| Timezone | [ ] | [ ] | |
| Language | [ ] | [ ] | |
| Extension range | [ ] | [ ] | |
| OAC | [ ] | [ ] | |
| PSTN type (LGW/CCPP) | [ ] | [ ] | |
| Zone assignment (India) | [ ] | [ ] | |
| Main number | [ ] | [ ] | |
| Emergency callback | [ ] | [ ] | |
| Hunt groups | [ ] | [ ] | |
| Auto attendant | [ ] | [ ] | |
| Call park range | [ ] | [ ] | |

### Template 2.B: LGW Deployment Checklist

| Item | Mumbai | Chennai | Bangalore | Delhi | Noida | Hyderabad |
|------|--------|---------|-----------|-------|-------|-----------|
| Platform verified | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| IOS-XE 17.12+ | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Webex certificate installed | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| TLS profile configured | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Tenant registered | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| PSTN trunk active | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Test call Webex->PSTN | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |
| Test call PSTN->Webex | [ ] | [ ] | [ ] | [ ] | [ ] | [ ] |

---

*End of Chapter 2: Webex Calling Design*

---
