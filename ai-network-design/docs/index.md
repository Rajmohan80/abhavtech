---
description: AI-driven network design guide — using machine learning for topology optimisation, capacity planning, anomaly detection, and autonomous network operations.
---
# Enterprise & Edge AI — Network Design Prerequisites

!!! info "AbhavTech Documentation Portfolio"
    This guide is part of the <a href="https://abhavtech.com" target="_blank">AbhavTech</a> technical documentation portfolio by **Rajmohan M** — covering Enterprise Networking, Unified Communications, Cybersecurity & AI.

**A step-by-step calculation workbook for designing enterprise and edge AI network infrastructure.**

---

Authored by **Rajmohan M**
Version 1.0 — April 2026 · abhavtech.com

---

## Built on the work of Scott Andersen

The Impact Score model at the heart of this workbook was introduced by **Scott Andersen** in:

> **Infrastructure for AI Network Design and Architecture: Building self-learning networks for the age of intelligence**
> Scott Andersen — BPB Publications (December 2025)
> [amzn.in/d/04OAa7V5](https://amzn.in/d/04OAa7V5)

This workbook operationalises that model into a repeatable engineering method — adding the U_eff load unit weights, LL-to-RTT mapping, CS-to-bandwidth overhead translation, verdict thresholds, B_gap back-calculation, and a layer-by-layer analysis framework. If you are starting from scratch, **read the book first** — it explains why the model works. This workbook shows you how to run it.

See the [full source attribution](chapter1-foundations/source-attribution.md) for a precise breakdown of what originates from Andersen's book and what this workbook adds.

---

!!! info "AI-Assisted Documentation"
    This workbook was drafted with AI assistance (Claude, Anthropic) under Rajmohan M's technical direction. Every formula, threshold, and design decision reflects the author's engineering judgement. Content is illustrative and intended for learning — validate all values against your own measured traffic before applying them to production environments.

---

## What this workbook covers

Introducing AI workloads into an enterprise network is not a software problem — it is a network infrastructure problem first. This workbook gives you every formula, threshold, worked example, and design decision framework needed to plan, size, and upgrade your network before a single AI agent goes live.

The calculations in this guide apply to:

- Enterprise contact centres adopting AI agent assist, speech-to-text, and real-time inference
- Campus and branch networks introducing edge AI devices and IoT-fed inference
- WAN and SD-WAN architects sizing links for AI API traffic
- Security and compliance teams quantifying the bandwidth cost of DPDP, HIPAA, or PCI controls on AI flows
- Infrastructure architects designing multi-tier MCP (Multi-Cloud Platform) AI inference stacks

---

## Why this calculation exists

AI workloads behave nothing like the traffic enterprise networks were sized for. A human agent generates predictable, bursty, low-bandwidth traffic. An AI-assisted agent adds continuous inference streams, speech-to-text, model context retrieval, and periodic model synchronisation — each with its own bandwidth, latency, and security profile. Drop these flows onto a network provisioned for human-only load and the failure is not gradual: latency-sensitive inference degrades first, then QoS starves the rest of the traffic, then the contact centre misses SLA.

The problem is that "the network feels fine today" is not evidence the network will survive an AI rollout. Most AI pilots succeed precisely because they are small — 10 agents, off-peak, no compliance overhead. The same design fails at 200 agents, at peak, under DPDP or PCI controls, because the load does not scale linearly. This workbook exists to surface that failure **on paper, before procurement**, instead of in production after the AI vendor has been paid.

## Why getting this right is critical

A miscalculated AI network deployment fails in three expensive ways:

- **Silent SLA erosion** — inference latency creeps past budget, agent-assist suggestions arrive late, and customer-facing metrics degrade without an obvious network alarm.
- **Stranded capital** — links are over-provisioned "to be safe," or edge AI hardware is bought where cloud inference would have met the latency budget at a fraction of the cost.
- **Compliance exposure** — AI flows carrying PII are routed across paths or tiers that violate data-residency, DPDP, HIPAA, or PCI requirements, because the security cost was never quantified against capacity.

Each of these is avoidable with a calculation that takes an afternoon. The Impact Score (IS) gate in Chapter 5 is the single number that tells you whether a deployment is safe, needs an upgrade, or must not proceed.

## What the method is

The workbook is a **nine-step sequential model**. Each step produces one input for the next, ending in a single go / no-go number:

```
Load (U_eff, AIW)  →  Risk (CS, LL)  →  Capacity (B)  →  Impact Score (IS gate)
                                                              |
              Upgrade plan (B_gap)  ←  Fairness (PUO)  ←  Tier routing (MCP)
```

You quantify true load, weight it by security and latency risk, size the link, then divide demand by available capacity to produce the **Impact Score**:

```
IS = (U_eff × AIW × CS × LL) / (B × A)
```

If IS is above the threshold, the network cannot safely carry the AI workload as designed — and Chapter 7 tells you exactly how much bandwidth to add to bring it back under the gate. Every formula, variable, and threshold is defined in [Chapter 1 — Formula Overview](chapter1-foundations/formula-overview.md).

## Is this a best practice or a defined standard?

This is an **engineering framework, not an industry standard**. There is no ratified IETF, IEEE, or ITU specification that prescribes a single formula for sizing AI workloads on enterprise networks — the field is too new. What this workbook does is assemble *established* networking practice (capacity planning, QoS provisioning, latency budgeting, the 50–70% link-utilisation rule, N+1 redundancy) into a repeatable model specifically adapted for AI traffic.

The component principles are well-grounded best practice. The coefficients and thresholds (the AI weight of 3.5, the IS gate values, the CS overhead percentages) are **engineering defaults derived from observed deployment behaviour** — they are starting points to be calibrated against your own measured traffic, not immutable constants. Treat the method as a disciplined, defensible structure for the decision, and treat the numbers as tunable inputs you validate against real telemetry. Chapter 1 documents which values are fixed principle and which are intended to be adjusted.

---

## The nine design steps

Work through the chapters in order. Each step produces an input for the next.

| Step | Chapter | Formula | Decision unlocked |
|------|---------|---------|-------------------|
| 1 | Load Analysis | U_eff = (H×1.0)+(AI×3.5)+(IoT×0.2)+(Pod×7.0) | True network load |
| 2 | AIW Profiling | AIW = sum of streams × burst | Per-user bandwidth demand |
| 3 | CS Scoring | CS = 1–5 mapped to BW overhead | Security overhead on capacity |
| 4 | LL Analysis | LL = 1–5 → RTT budget → tier | Edge vs cloud placement |
| 5 | Bandwidth (B) | B = (U_eff × AIW × Peak) / Util | Link sizing |
| 6 | IS Calculation | IS = (U×AIW×CS×LL) / (B×A) | Go / no-go gate |
| 7 | PUO Analysis | PUO = IS / U_eff | Per-user fairness |
| 8 | MCP Tier Routing | Route = f(LL, CS, Cost) | Inference tier placement |
| 9 | Gap & Upgrade | B_gap = B_required − B_current | Upgrade priority |

---

## Key design thresholds at a glance

!!! danger "IS > 10 — Deployment blocker"
    An Impact Score above 10 means the AI project will fail at scale. No pilot or proof-of-concept should run on production infrastructure until IS is below 3.

!!! warning "IS 3–10 — Upgrade required"
    Network will show degradation under AI load. Bandwidth upgrade and/or edge AI deployment required within 90 days of AI go-live.

!!! success "IS 1–3 — Monitor"
    Manageable with QoS enforcement and scheduled model sync. Set automated alerts for IS > 3.

!!! tip "IS < 1 — Optimal"
    Headroom available. Review quarterly and plan for growth.

---

## How to navigate this site

- Use the **top tab bar** to jump between major sections
- Use the **left sidebar** to navigate within a section
- Use the **right sidebar** to jump to a heading within the current page
- Use the **search bar** to find any formula, term, or table

---

## Chapters

### [1. Foundations](chapter1-foundations/README.md)
How to use this workbook, formula sequence, and the design gate methodology.

### [2. Load Analysis](chapter2-load-analysis/README.md)
U_eff and AIW — calculating true network load and per-user AI bandwidth demand.

### [3. Risk & Latency](chapter3-risk-latency/README.md)
CS security factor and LL latency factor — compliance overhead and architecture placement.

### [4. Bandwidth & QoS](chapter4-bandwidth/README.md)
Bandwidth provisioning formula, QoS traffic classes, and model sync sizing.

### [5. IS & PUO](chapter5-is-puo/README.md)
The master Impact Score calculation and per-user output analysis.

### [6. MCP Tier Design](chapter6-mcp-tiers/README.md)
Multi-cloud platform tier architecture and AI workload routing logic.

### [7. Network Upgrade](chapter7-network-upgrade/README.md)
Gap analysis, redundancy, growth planning, and the three-phase upgrade roadmap.

### [8. Case Study](chapter8-case-studies/README.md)
Worked end-to-end example: Bharatiya Fintech Bank — 1,200-agent AI contact centre.

### [Appendices](appendices/README.md)
Quick reference card with all formulas, and full glossary.

### [9. IS Layer-by-Layer](chapter9-is-layer-by-layer/README.md)
Where exactly is B? Full IS calculations at every connectivity point — access port, switch uplink, WAN circuit, MPLS, internet, 5G, and internal DC fabric. Branch (100 agents, SD-WAN) and campus main (200 agents, MPLS + Internet + 5G + in-house DC) worked end-to-end.
