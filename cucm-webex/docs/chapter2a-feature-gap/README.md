# Feature Gap Bridge

This chapter addresses every CUCM and UCCX feature that has no direct equivalent in Webex Calling or Webex Contact Center, providing the Abhavtech-specific solution design, configuration approach, and validation steps for each gap.

## Why This Chapter Exists

A platform migration is never a feature-for-feature swap. CUCM and UCCX were built on fundamentally different architectural assumptions than Webex Calling and Webex Contact Center. Some features require redesign, some require procedural workarounds, and some are accepted gaps with agreed replacements.

This chapter is a practitioner's bridge -- not a sales comparison. Every item here was identified during discovery, assessed for business impact, and given a decision with a concrete implementation path.

## Chapter Structure

This chapter is split into two parts aligned with the two migration phases:

**Part A -- CUCM to Webex Calling Feature Gaps** (Phase 1)

**[2A.1 Survivability Gateway ->](survivability.md)**  
CUCM SRST has no cloud equivalent. Webex Calling Survivability Gateway (IOS-XE 17.6.1+) provides MPP-phone fallback only. Critical gap for all 12 sites.

**[2A.2 Extension Mobility / Hotdesking ->](hotdesking.md)**  
CUCM Extension Mobility maps to Webex Calling Hotdesking -- MPP phones only, no cross-platform support during coexistence. Affects 40 hot-desk stations at Mumbai HQ.

**[2A.3 CSS / Calling Search Space -> Outgoing Calling Plans ->](calling-plans.md)**  
No direct CSS equivalent in Webex Calling. All CSS/Partition access control must be rationalized into Outgoing Calling Plan tiers. Forced Authorization Codes replaced with ServiceNow approval workflow.

**[2A.4 Unity Connection Voicemail Migration ->](voicemail-migration.md)**  
No voicemail message migration tool exists. IMAP and distribution list features are accepted gaps. User advance notice and self-service export required before each site batch.

**[2A.5 Malicious Call Trace ->](malicious-call-trace.md)**  
No native MCT in Webex Calling. Replaced by 100% call recording + CDR retrieval procedure. Required under India DoT regulations -- procedural replacement accepted.

---

**Part B -- UCCX to Webex Contact Center Feature Gaps** (Phase 2)

**[3A.1 Finesse to Webex Agent Desktop ->](agent-desktop.md)**  
Finesse OpenSocialGadgets cannot be migrated to Webex Agent Desktop JSON layout. Each customisation must be individually assessed and rebuilt. Salesforce CTI, wallboard, and attendance gadget all require separate treatment.

**[3A.2 Custom Java Steps -> REST API Migration ->](java-steps-api.md)**  
Three UCCX scripts contain custom Java steps (JDBC + SOAP). Webex CC Flow Designer supports HTTP REST only. REST API wrappers must be built -- a 6-8 week DevOps prerequisite before the WxCC cutover can be scheduled.

**[3A.3 Historical Reporting Preservation ->](historical-reporting.md)**  
WxCC Analyzer cannot import UCCX historical data. Comprehensive export and 7-year archive required before UCCX decommissioning. Combined Excel reporting model bridges the migration boundary.

**[3A.4 Outbound / TRAI DNC Compliance ->](outbound-trai-dnc.md)**  
WxCC Outbound Campaign is a separately licensed SKU. India TRAI DNC scrubbing must be configured before any production campaign. Penalties apply for non-compliant outbound calls.

---

**[Problem/Solution Register ->](problem-solution-register.md)**  
Formal register of all 12 migration problems with root cause, business impact, Abhavtech decision, solution steps, config reference, validation steps, owner, and timeline. Cards: PSR-P1-01 through PSR-P2-05.

---

## Risk Summary

| ID | Feature / Gap | Phase | Risk |
|---|---|---|---|
| PSR-P1-01 | SRST Survivability | Phase 1 | Critical |
| PSR-P1-02 | CSS / Partition | Phase 1 | Critical |
| PSR-P1-03 | Extension Mobility | Phase 1 | High |
| PSR-P1-04 | Unity Connection VM | Phase 1 | High |
| PSR-P1-05 | Forced Auth Codes | Phase 1 | High |
| PSR-P1-06 | Malicious Call Trace | Phase 1 | Medium |
| PSR-P1-07 | Intercom | Phase 1 | Medium -- Accepted Gap |
| PSR-P2-01 | Custom Java Steps | Phase 2 | High -- API Dev Required |
| PSR-P2-02 | Finesse Desktop | Phase 2 | High |
| PSR-P2-03 | Historical Reporting | Phase 2 | Medium |
| PSR-P2-04 | Outbound TRAI DNC | Phase 2 | Medium |
| PSR-P2-05 | WFM Integration | Phase 2 | Medium |

---

## Cross-Reference to Main Chapters

| Gap | Main Chapter Section |
|---|---|
| Survivability | Ch. 5 -- DNS & Network; ABV-SDWAN-2024 |
| Hotdesking | Ch. 2.5 -- Feature Design |
| Calling Plans | Ch. 2.4 -- Dial Plan Design |
| Voicemail | Ch. 4 -- Compliance (recording/retention) |
| Malicious Call Trace | Ch. 4.3 -- India DoT/TRAI Compliance |
| Agent Desktop | Ch. 3 -- WxCC Design |
| Java Steps | Ch. 7 -- Migration Execution (WxCC cutover prerequisites) |
| Historical Reporting | Ch. 8 -- Operations & Day 2 |
| Outbound DNC | Ch. 4.3 -- India Compliance; Ch. 3 -- WxCC Design |
