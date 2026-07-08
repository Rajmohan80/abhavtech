# Chapter 6: Webex Contact Center Implementation -- 6.9 Recording, QM & WFM Setup

## 6.9 Recording, QM & WFM Setup

## 6.9.1 Recording Configuration (Per Chapter 3.10)

```
+-----------------------------------------------------------------------------+
|              RECORDING CONFIGURATION BY REGION                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGION     | CONSENT        | STORAGE    | RETENTION | PCI PAUSE          |
|  -----------+----------------+------------+-----------+--------------------|
|  India      | Single-party + | India DC   | 365 days  | Auto on DTMF       |
|             | Announcement   |            | (OSP req) | (Billing queue)    |
|  UK         | Two-party      | UK DC      | 180 days  | Auto on DTMF       |
|             | (GDPR)         |            |           |                    |
|  EU         | Two-party      | EU DC      | 180 days  | Auto on DTMF       |
|             | (GDPR + C5)    |            |           |                    |
|  Americas   | Announce       | US DC      | 90 days   | Auto on DTMF       |
|             | (state-depend) |            |           |                    |
|  -----------+----------------+------------+-----------+--------------------|
|                                                                             |
|  [!]️ India OSP requires minimum 1-year (365 days) retention                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.9.2 Recording Settings

**Navigation:** Control Hub -> Contact Center -> Settings -> Recording

| Setting | Value |
|---------|-------|
| Recording Mode | All Calls (100%) |
| Recording Format | Dual-channel stereo |
| Recording Announcement | Enabled |
| Recording Pause/Resume | Enabled |
| Auto-Pause on DTMF | Enabled (for PCI) |
| Storage Location | Regional (per compliance) |
| Retention Period | 365 days (India), 180 days (EMEA), 90 days (US) |

## 6.9.3 Quality Management Setup

**Navigation:** Control Hub -> Contact Center -> WFO -> Quality Management

### Evaluation Forms

| Form Name | Target | Sections | Score |
|-----------|--------|----------|-------|
| QM_Voice_Sales | Sales agents | Greeting, Product Knowledge, Closing | 100 |
| QM_Voice_Support | Support agents | Greeting, Issue Resolution, FCR | 100 |
| QM_Digital | Digital agents | Response Time, Accuracy, Tone | 100 |

## 6.9.4 Workforce Management Setup

| Setting | Value |
|---------|-------|
| Schedule Adherence Target | 95% |
| Grace Period | 3 minutes |
| Alert Threshold | Below 90% |
| Forecast Method | Historical + AI |

---
