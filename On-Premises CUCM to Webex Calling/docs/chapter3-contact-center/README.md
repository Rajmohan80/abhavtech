# Webex Contact Center Design

This chapter covers the complete design for migrating from UCCX to Webex Contact Center (WxCC), including current state assessment, platform architecture, entry points, queue design, skills and routing, IVR flow migration, agent desktop, digital channels, AI features, and regional compliance.

!!! note "Feature Gaps"
    UCCX features that have no direct WxCC equivalent (Finesse desktop, custom Java steps, historical data, outbound DNC) are documented in the **[Feature Gap Bridge ->](../chapter2a-feature-gap/README.md)** chapter (sections 3A.1-3A.4).

## Chapter Overview

**[3.1 UCCX Current State Assessment ->](uccx-current-state.md)**  
UCCX cluster architecture, agent distribution by site, CSQ inventory, script inventory, skills inventory, and baseline reporting metrics

**[3.2 Webex Contact Center Architecture ->](wxcc-architecture.md)**  
WxCC platform selection, multi-region architecture, licensing design, and Webex Calling integration

**[3.3 Entry Point Design ->](entry-point-design.md)**  
Entry point strategy, configuration specifications, PSTN number mapping, and routing logic

**[3.4 Queue Design ->](queue-team-design.md)**  
Queue configuration, team structure, capacity planning, and multi-site queue routing

**[3.5 Skills and Routing Design ->](skills-routing-design.md)**  
Skills-based routing design, agent skill profiles, routing strategy by queue type

**[3.6 Flow Designer -- IVR Migration ->](script-migration.md)**  
UCCX script to Flow Designer migration, IVR menu redesign, HTTP integrations, business hours logic

**[3.7 Agent Desktop Design ->](agent-desktop-design.md)**  
Webex Agent Desktop layout, Salesforce integration, desktop widget configuration

**[3.8 Digital Channel Design ->](digital-channel-design.md)**  
Chat, email, and WhatsApp channel configuration, digital flow design, omnichannel routing

**[3.9 AI Features Design ->](ai-features-design.md)**  
Virtual Agent "Abhi", Agent Assist, AI-powered routing, sentiment analysis, wellbeing features

**[3.10 Contact Center Compliance by Region ->](cc-compliance.md)**  
India DoT/TRAI outbound compliance, GDPR recording consent, EMEA data residency for contact center

---

## Project Scope

| Metric | Value |
|---|---|
| **Total Agents** | 175 (150 India, 15 UK, 10 Americas) |
| **Sites** | 4 (Mumbai, Chennai, London, New Jersey) |
| **Channels** | Voice, Chat, Email, WhatsApp |
| **Entry Points** | 6 (4 voice + 2 digital) |
| **UCCX Scripts to Migrate** | 9 scripts (3 require REST API backend work) |
| **Licenses** | Standard (100), Premium (75), Supervisor (10) |

---

## Migration Phases

| Phase | Scope | Status |
|---|---|---|
| **Phase 2A -- Baseline** | 175 agents, voice + digital, feature parity with UCCX | Design |
| **Phase 2B -- AI Enhancement** | Virtual Agent, Agent Assist, intent-based routing | Planned |
