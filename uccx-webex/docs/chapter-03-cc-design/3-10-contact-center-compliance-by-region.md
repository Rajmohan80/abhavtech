# Chapter 3: Webex Contact Center Design (Phase 2) -- 3.10 Contact Center Compliance by Region

## 3.10 Contact Center Compliance by Region

## 3.10.1 India Contact Center Compliance

```
+-----------------------------------------------------------------------------+
|              INDIA CONTACT CENTER - COMPLIANCE REQUIREMENTS                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGULATION              | REQUIREMENT                | IMPLEMENTATION      |
|  ========================================================================= |
|                                                                             |
|  DOT/TRAI COMPLIANCE:                                                      |
|  -------------------------------------------------------------------------  |
|  Toll Bypass             | CC calls must originate    | WxCC India DC (Mumbai) +     |
|  Prevention              | from Indian infrastructure | India PSTN egress   |
|                                                                             |
|  Data Residency          | Call recordings and CDRs   | WxCC India Data     |
|  (OSP Guidelines)        | stored in India for min    | Center enabled      |
|                          | 1 year                     |                     |
|                                                                             |
|  Agent Location          | OSP allows WFH with        | WFH policy with     |
|                          | approved security controls | VPN + endpoint      |
|                          |                            | security            |
|                                                                             |
|  RECORDING COMPLIANCE:                                                     |
|  -------------------------------------------------------------------------  |
|  Consent                 | Must inform callers about  | IVR consent prompt  |
|                          | recording                  | at flow start       |
|                                                                             |
|  PCI-DSS                 | Pause recording during     | Agent can pause     |
|  (Billing Queue)         | card number capture        | manually + auto     |
|                          |                            | pause on DTMF       |
|                                                                             |
|  Retention               | Minimum 1 year for OSP     | WxCC WFO retention  |
|                          | audit requirements         | set to 365 days     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.10.2 EMEA Contact Center Compliance

```
+-----------------------------------------------------------------------------+
|              EMEA CONTACT CENTER - COMPLIANCE REQUIREMENTS                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGULATION              | REQUIREMENT                | IMPLEMENTATION      |
|  ========================================================================= |
|                                                                             |
|  GDPR (UK/EU):                                                             |
|  -------------------------------------------------------------------------  |
|  Data Processing         | Lawful basis for           | Legitimate interest |
|                          | processing customer data   | (service delivery)  |
|                                                                             |
|  Data Residency          | UK data in UK DC           | UK Calling Region   |
|                          | EU data in EU DC           | EU Calling Region   |
|                                                                             |
|  Right to Erasure        | Customer can request       | Control Hub data    |
|                          | deletion of their data     | deletion workflow   |
|                                                                             |
|  Recording Consent       | Must inform and obtain     | IVR consent prompt  |
|  (Germany especially)    | consent before recording   | with opt-out option |
|                                                                             |
|  BSI C5 (Germany):                                                         |
|  -------------------------------------------------------------------------  |
|  Cloud Security          | Webex has BSI C5           | No additional       |
|                          | attestation                | config needed       |
|                                                                             |
|  OFCOM (UK):                                                               |
|  -------------------------------------------------------------------------  |
|  CLI Verification        | Outbound calls must show   | CCPP handles via    |
|                          | valid CLI                  | Webex Calling       |
|                                                                             |
|  Emergency Services      | 999/112 access required    | Handled by CCPP     |
|                          |                            | provider            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
