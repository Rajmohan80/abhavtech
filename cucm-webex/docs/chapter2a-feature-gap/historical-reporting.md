# Historical Reporting Preservation -- UCCX to WxCC Analyzer

> **[!]️ GAP SEVERITY: MEDIUM | Affects: Operations & Quality Management Teams**

## 3A.3.1 Problem Statement

UCCX stores historical call records, agent performance data, and queue statistics in its internal database. When UCCX is decommissioned, this data is **lost unless explicitly exported**. Webex Contact Center Analyzer begins collecting data from the migration cutover date -- it **cannot import historical UCCX data**.

## 3A.3.2 Abhavtech Data Preservation Approach

1. Export UCCX historical data **30 days before** the WxCC cutover using the UCCX Historical Reporting Client. Export all available reports in CSV format covering a minimum of **24 months of history**.
2. Archive exported data in **SharePoint** (Collaboration Team > CC Migration > Historical Data) with **7-year retention** per India compliance requirements.
3. Recreate equivalent dashboards in WxCC Analyzer for post-migration reporting. Baseline KPIs (ASA, AHT, FCR, abandonment rate) from the last 90 days of UCCX data should be documented as the post-migration performance benchmark.
4. For management reporting requiring data continuity across the migration date, combine UCCX CSV exports with WxCC Analyzer exports in a single Excel model.

## 3A.3.3 Reporting Continuity Timeline

| Milestone | Action |
|---|---|
| T-30 days | Begin weekly UCCX data exports (supplement to final archive) |
| T-7 days | Full historical export -- all UCCX reports, 24 months |
| T-0 (cutover) | WxCC Analyzer begins collecting. UCCX data collection stops. |
| T+30 days | Validate WxCC Analyzer report accuracy vs. expected call volumes |
| T+90 days | First combined UCCX + WxCC management report for leadership review |

---
