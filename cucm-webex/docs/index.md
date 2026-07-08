# CUCM & UCCX to Webex Calling & Contact Center Migration

<span class="ai-badge">AI-ASSISTED DOCUMENTATION</span>

**Author: Rajmohan M &nbsp;|&nbsp; Website: [abhavtech.com](https://abhavtech.com)**

> Enterprise migration from on-premises Cisco UC to Webex cloud -- 3,200 users . 175 CC agents . 12 global sites . India DoT/TRAI . EMEA GDPR . AI-powered contact center

!!! warning "Knowledge-Sharing Documentation"
    This documentation is produced for illustrative and knowledge-sharing purposes only. It is not formally reviewed, not production-ready, and should not be applied directly to any live environment. All telephone numbers are fictional. Validate all designs independently with qualified engineers and legal/compliance teams.

---

## Architecture at a Glance

### Before -- Existing On-Premises Infrastructure

```mermaid
flowchart LR
    classDef existing fill:#eef2f7,stroke:#7a8ba0,color:#2d3748
    classDef infra fill:#eef2f7,stroke:#7a8ba0,color:#2d3748

    subgraph USERS["End Users -- 3,200 + 175 CC Agents"]
        direction TB
        JP["Jabber\nWindows/Mac/Mobile\n(4,270 clients)"]:::existing
        IP["IP Phones\nCP-8841/8861/7942\n(2,100 devices)"]:::existing
        FA["Finesse\nAgent Desktop\n(175 agents)"]:::existing
    end

    subgraph ONPREM["On-Premises UC Platform -- Mumbai DC"]
        direction TB
        CUCM["CUCM 14.0\nPub + 4 Subscribers\n3,240 registered devices"]:::existing
        UCCX["UCCX 12.5 HA\nContact Center\n175 agents . 9 scripts"]:::existing
        CUC["Unity Connection\nVoicemail HA\n3,200 mailboxes"]:::existing
        EXP["Expressway C&E\nMobile Remote Access\n450 remote users"]:::existing
        CUBE["CUBE SBC HA\nISR 4451-X pair\nSIP/ISDN gateway"]:::existing
    end

    subgraph PSTN["PSTN -- India Only"]
        direction TB
        TATA["Tata / Airtel\nIndia PSTN\n4,800 DIDs"]:::existing
    end

    JP & IP --> CUCM
    FA --> UCCX
    CUCM --> UCCX
    CUCM --> CUC
    JP -.->|MRA| EXP
    CUCM --> CUBE
    CUBE --> TATA
```

*Grey = existing on-premises infrastructure. Click diagram to zoom.*

---

### After -- Webex Cloud Platform

```mermaid
flowchart LR
    classDef existing fill:#eef2f7,stroke:#7a8ba0,color:#2d3748
    classDef newc fill:#d7ebf8,stroke:#1B6CA0,color:#0d3b5e,font-weight:bold

    subgraph USERS["End Users -- 3,200 + 175 CC Agents"]
        direction TB
        WA["Webex App\nWindows/Mac/Mobile/Web\n(replaces Jabber)"]:::newc
        MPP["MPP IP Phones\n8800 Series\n(replaces 7900/8800)"]:::existing
        AD["Webex Agent Desktop\n(replaces Finesse)\n175 agents"]:::newc
    end

    subgraph CLOUD["Webex Cloud Platform"]
        direction TB
        WXC["Webex Calling\nControl Hub\n3,200 users . 4 regions"]:::newc
        WXCC["Webex Contact Center\nWxCC Premium\n175 agents . 6 entry points"]:::newc
        WXVM["Webex Voicemail\n(replaces Unity Conn)"]:::newc
        WXAI["AI Features\nVirtual Agent Abhi\nAgent Assist . Auto CSAT"]:::newc
    end

    subgraph HYBRID["Hybrid / Retained On-Premises"]
        direction TB
        LGW["Local Gateway\nISR 4431 / C8200\n7 India sites"]:::existing
        AD_CTRL["Active Directory\nDirectory Sync\n(retained)"]:::existing
        SSO["SSO / SAML IdP\n(retained)"]:::existing
    end

    subgraph PSTN["PSTN -- Multi-Region"]
        direction TB
        IND["India PSTN\nTata / Airtel\nVia LGW"]:::existing
        CCPP["Cloud Connected PSTN\nIntelePeer\nUK . EU . Americas"]:::newc
    end

    WA & MPP --> WXC
    AD --> WXCC
    WXC --> WXVM
    WXC --> WXAI
    WXCC --> WXAI
    WXC <-->|Zone/Edge\nToll bypass| LGW
    LGW --> IND
    WXC --> CCPP
    WXC <--> AD_CTRL & SSO
```

*Grey = existing/reused components. **Blue = newly added Webex cloud components.** Click diagram to zoom.*

---

## Migration Scope

| Metric | Value |
|---|---|
| **Total Sites** | 12 global locations |
| **Calling Users** | 3,200 (Phase 1 -- CUCM -> Webex Calling) |
| **CC Agents** | 175 (Phase 2 -- UCCX -> Webex Contact Center) |
| **India Sites** | 7 (Mumbai HQ + Chennai + Bangalore + Delhi + Noida + Pune + Hyderabad) |
| **EMEA Sites** | 2 (London + Frankfurt) |
| **Americas Sites** | 2 (New Jersey + Dallas) |
| **PSTN -- India** | Local Gateway (Tata/Airtel) -- retained for DoT/TRAI compliance |
| **PSTN -- EMEA/Americas** | Cloud Connected PSTN (IntelePeer) |
| **Migration Duration** | 14 weeks (Phase 1) + 10 weeks (Phase 2) |

---

## Documentation Structure

### [Webex Calling ->](chapter2-calling-design/README.md)
Discovery & assessment . Architecture . Location design . Dial plan . PSTN . Feature migration . Coexistence . **Feature Gap Bridge** (survivability, CSS, Extension Mobility, voicemail, MCT)

### [Contact Center ->](chapter3-contact-center/README.md)
UCCX current state . WxCC architecture . Entry points . Queue & team design . Flow Designer / IVR migration . Agent desktop . Digital channels . AI features . CC compliance by region

### [Compliance & Network ->](chapter4-compliance/README.md)
India DoT/TRAI toll bypass . EMEA GDPR data residency . Security architecture . DNS & firewall . Zone/Edge configuration . QoS

### [Implementation ->](chapter6-implementation/README.md)
Control Hub setup . PSTN configuration . Configuration templates

### [Migration Execution ->](chapter7-migration/README.md)
Pre-migration . Site-by-site cutover runbooks . Webex Calling cutover . WxCC cutover (Phase 2) . Rollback . Go-live validation . Hypercare

### [Operations & AI ->](chapter8-operations/README.md)
Monitoring . User onboarding . Change management . Troubleshooting . Virtual Agent "Abhi" . Agent Assist . AI roadmap

### [Appendices ->](appendices/README.md)
Glossary . Checklists (CUCM-Webex + UCCX-WxCC) . India telecom reference . EMEA certifications . DNS & firewall templates . Jabber migration (10F/10G) . Specialty devices (10H) . AI observability (10I)

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **India PSTN -- LGW retained** | DoT/TRAI toll bypass requires geographic DID calls to egress from local telecom circle |
| **EMEA PSTN -- CCPP** | No LGW regulatory requirement; Cloud Connected PSTN simpler and cheaper |
| **ITN numbers for India WFH** | Exempt from toll bypass -- no LGW required for remote workers |
| **Zone/Edge -- mandatory India** | Required for geographic DID compliance; not needed for EMEA |
| **Phased migration (Ch1 -> Ch2)** | CUCM first to stabilise calling before migrating contact centre |
| **WxCC Premium licence** | Required for digital channels (chat/email/WhatsApp) and AI features |

---

## Regional Compliance Summary

| Region | Compliance Type | Requirement | Solution |
|---|---|---|---|
| **India** | DoT/TRAI Toll Bypass | Geo DIDs must egress from local circle | Local Gateway per telecom circle |
| **India WFH** | DoT/TRAI | Exempt from toll bypass | ITN numbers (9XXXXXXXXX) |
| **UK** | UK GDPR | Data residency in UK | Webex Calling Region: UK (London DC) |
| **Germany** | EU GDPR + BSI C5 | Data residency in EU | Webex Calling Region: EU (Frankfurt DC) |
| **Americas** | SOC 2 / standard | Standard cloud compliance | Webex Calling Region: US |

---

*© 2025-2026 AbhavTech | Part of the AbhavTech technical documentation portfolio | [abhavtech.com](https://abhavtech.com)*
