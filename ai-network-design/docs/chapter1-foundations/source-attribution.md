# Source Attribution

## The book this workbook builds on

The Impact Score concept that powers this workbook was introduced by **Scott Andersen** in:

> **Infrastructure for AI Network Design and Architecture: Building self-learning networks for the age of intelligence**
> Scott Andersen — BPB Publications (December 2025)
> Available at: [amzn.in/d/04OAa7V5](https://amzn.in/d/04OAa7V5)

Scott Andersen is a nationally recognised technology strategist with over three decades of enterprise architecture experience. His book introduces the Impact Score model as a method for quantifying AI's demand on network infrastructure — a framework this workbook operationalises into enterprise engineering practice.

**If you are working through this workbook, read the book first.** It explains the reasoning behind the model in depth; this workbook exists to turn that reasoning into a repeatable calculation method for practitioners in the field.

---

## What comes from the book

The following are Scott Andersen's original contributions, used with full attribution:

- The **Impact Score (IS)** as the primary go/no-go metric for AI network readiness
- The **IS formula** and its constituent variables: U, AIW, CS, LL, B, A
- The **PUO (Per-User Output)** metric and its fairness interpretation
- The **Adjustment factor (A)** concept accounting for infrastructure reliability
- The worked example scenarios that demonstrate under-utilised, optimal, and overloaded networks

---

## What this workbook adds

The following are engineering extensions developed by **Rajmohan M** to operationalise the IS model for enterprise deployment practice:

| Extension | Description |
|-----------|-------------|
| **Weighted U_eff load units** | Multipliers per entity type: human ×1.0, AI agent ×3.5, IoT ×0.2, GPU pod ×7.0 |
| **LL-to-RTT mapping table** | Concrete RTT budgets per LL level: LL1=500ms, LL2=200ms, LL3=80ms, LL4=31ms, LL5=20ms |
| **CS-to-bandwidth overhead** | CS scores mapped to actual BW overhead %: CS1=+8%, CS2=+18%, CS3=+28%, CS4=+40%, CS5=+60% |
| **IS verdict thresholds** | Operational gates: ≤1.0 Optimal / 1.0–3.0 Monitor / 3.0–10 Upgrade / >10 Blocker |
| **B_gap back-calculation** | Deriving required bandwidth from a target IS of 3.0 |
| **MCP tier placement rules** | Routing AI workloads to Cloud / Regional Edge / Campus Edge based on LL and CS |
| **AI Readiness Score (ARS)** | Composite readiness metric gating pilot go-live at ARS ≥ 70 |
| **Nine-step sequential workflow** | The ordered chain from U_eff through to upgrade roadmap |
| **Layer-by-layer IS analysis** | IS calculated at every network layer: access port → core → WAN → DC fabric |
| **Bharatiya Fintech Bank case study** | 1,200-agent enterprise contact centre end-to-end worked example |

---

## How to cite this workbook

If you reference this workbook in your own work, please cite both the original book and this workbook separately:

**Original book:**
Andersen, S. (2025). *Infrastructure for AI Network Design and Architecture: Building self-learning networks for the age of intelligence.* BPB Publications.

**This workbook:**
Rajmohan M. (2026). *Enterprise & Edge AI — Network Design Prerequisites* [Technical workbook]. AbhavTech. [ai-network-design.abhavtech.com](https://ai-network-design.abhavtech.com)

---

## A note on standards

Neither the original book's IS model nor this workbook's extensions constitute an industry standard. There is no ratified IETF, IEEE, or ITU specification for sizing AI workloads on enterprise networks. Both represent engineering frameworks — disciplined, structured approaches assembled from established networking practice (capacity planning, QoS, latency budgeting, N+1 redundancy) adapted for AI traffic behaviour. The coefficients and thresholds are engineering defaults to be calibrated against your own measured traffic, not immutable constants.
