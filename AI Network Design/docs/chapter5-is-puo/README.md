# Chapter 5 — IS & PUO

The Impact Score (IS) and Per-User Output (PUO) are the primary design validation metrics. After calculating U_eff, AIW, CS, LL, and B, these formulas combine them into a single number that tells you definitively whether your network can support the proposed AI workload.

## In this chapter

- [IS Calculation](is-calculation.md) — The master impact score formula and decision thresholds
- [PUO Analysis](puo-analysis.md) — Per-user fairness metric and what it reveals about individual agent experience
- [Master Worksheet](master-worksheet.md) — Single-page calculation sheet for multi-site deployments

## The go/no-go gate

IS is a gate, not a guideline. IS > 10 means the project fails. There is no workaround, no QoS policy, no monitoring dashboard that fixes IS > 10. The only fix is reducing the numerator (U_eff, AIW, CS, or LL) or increasing the denominator (B or A).

PUO translates IS into the individual agent experience. If IS = 8 and PUO = 0.006, each agent's experience is very different from IS = 8 and PUO = 0.02. PUO contextualises IS for the human impact conversation.
