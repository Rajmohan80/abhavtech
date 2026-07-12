# Formula Overview

!!! quote "Source"
    The Impact Score (IS) model and its core variables (U, AIW, CS, LL, B, A, PUO) were introduced by **Scott Andersen** in *Infrastructure for AI Network Design and Architecture* (BPB Publications, 2025). The formulas below operationalise that model with enterprise-specific extensions: weighted U_eff load units, LL-to-RTT mapping, CS-to-bandwidth overhead percentages, IS verdict thresholds, and the B_gap back-calculation.
    Full attribution: [Source Attribution](source-attribution.md)

All formulas used in this workbook, presented in calculation order with variable definitions and enterprise adaptation notes.

## Complete formula set

```
Step 1  U_eff  = (H × 1.0) + (AI × 3.5) + (IoT × 0.2) + (Pod × 7.0)

Step 2  AIW    = Σ(stream_Mbps) × Burst_factor

Step 3  CS     = 1–5   →  BW overhead %:
                 CS1=+8%  CS2=+18%  CS3=+28%  CS4=+40%  CS5=+60%

Step 4  LL     = 1–5   →  RTT budget (ms):
                 LL1=500  LL2=200  LL3=80  LL4=31  LL5=20

Step 5  B_min  = (U_eff × AIW × Peak_factor) / Link_utilisation_target
        B_rec  = B_min × 1.5
        Model_sync_BW (Mbps) = GB × Updates/day × 8000 / 86400
        B_total = B_rec + Model_sync_BW

Step 6  IS     = (U_eff × AIW × CS × LL) / (B × A)

Step 7  PUO    = IS / U_eff

Step 8  Route  = f(LL, CS, Data_residency, Cost)

Step 9  B_req  = (U_eff × AIW × CS × LL) / (3.0 × A)   [target IS = 3]
        B_gap  = B_req − B_current
```

---

## Variable definitions

### Primary formula variables

| Variable | Full name | Units | Range | Source |
|----------|-----------|-------|-------|--------|
| H | Human operators | Count | Any | Headcount |
| AI | AI software agents / bots | Count | Any | Platform inventory |
| IoT | IoT devices and edge sensors | Count | Any | Network scan |
| Pod | GPU inference pods | Count | Any | Infrastructure inventory |
| U_eff | Effective load units | Dimensionless | Any | Calculated (Step 1) |
| AIW | Avg AI workload per load unit | Mbps | 0.5–40 | Calculated (Step 2) |
| CS | Cybersecurity risk factor | Dimensionless | 1–5 | Scored (Step 3) |
| LL | Low-latency factor | Dimensionless | 1–5 | Assessed (Step 4) |
| B | Provisioned bandwidth | Mbps | Any | Procured / planned |
| A | Adjustment factor | Dimensionless | 0.5–1.0 | Infrastructure type |
| IS | Impact Score | Dimensionless | Any | Calculated (Step 6) |
| PUO | Per-User Output | Dimensionless | Any | Calculated (Step 7) |

### Derived and supporting variables

| Variable | Formula | Typical value |
|----------|---------|--------------|
| Peak_factor | AI burst multiplier | 1.5–2.5 |
| Link_utilisation_target | Max safe link load | 65–70% |
| Model_sync_BW | GB × updates × 8000 / 86400 | Varies |
| B_gap | B_required − B_current | Must be ≤ 0 for readiness |

---

## Entity multipliers

| Entity type | Multiplier | Rationale |
|------------|-----------|-----------|
| Human operator | × 1.0 | Baseline. Think/pause cycles limit sustained load. |
| AI software agent / bot | × 3.5 | 24/7, no idle time, 3–4 parallel API calls continuously. |
| IoT / edge sensor | × 0.2 | Low per-device but high volume aggregates dangerously. |
| GPU inference pod | × 7.0 | Serves all users simultaneously, model weights, inter-pod comms. |

---

## IS verdict thresholds

| IS range | Status | Action |
|----------|--------|--------|
| IS ≤ 1.0 | Optimal | Monitor quarterly. AI can grow into headroom. |
| 1.0 < IS ≤ 3.0 | Monitor | Enforce 6-class QoS. Alert at IS > 3. |
| 3.0 < IS ≤ 10.0 | Upgrade required | Bandwidth upgrade or edge AI within 90 days. |
| IS > 10.0 | Deployment blocker | No AI go-live. Redesign first. |

## PUO verdict thresholds

| PUO range | Status | Action |
|-----------|--------|--------|
| PUO < 0.3 | Over-provisioned | Review if B can reduce at next renewal. |
| 0.3–1.0 | Balanced | Maintain. Monitor trend quarterly. |
| 1.0–2.0 | Stressed | Add bandwidth or reduce AIW via model quantisation. |
| PUO > 2.0 | Overloaded | Immediate action: edge AI or bandwidth upgrade. |

## A factor reference

| Infrastructure type | A value |
|--------------------|---------|
| Dark fiber / dedicated leased line | 0.95–1.00 |
| Dedicated MPLS with SLA | 0.90–0.95 |
| SD-WAN dual-path managed | 0.82–0.90 |
| Shared MPLS / business broadband | 0.70–0.82 |
| SD-WAN over shared internet | 0.65–0.75 |
| Legacy single-ISP internet only | 0.50–0.65 |

---

## Enterprise adaptations

These variables are adapted from the base IS model to fit enterprise realities.

### Why U_eff replaces raw headcount

Raw headcount treats every entity as a human with equal network demand. In an AI enterprise, this is dangerously wrong. A GPU inference pod consumes 7 times the sustained bandwidth of a human operator. An AI bot runs continuously with no idle time. The multiplier system converts all entity types to equivalent load units before any calculation.

### Why AIW is a composite stream value

Enterprise AI is always multi-modal. A Webex CC agent using AI assist simultaneously generates: a speech-to-text stream (0.3 Mbps), an LLM inference stream (1.5 Mbps), a screen analytics stream (3 Mbps), and a RAG query stream (1.8 Mbps). These run concurrently, not alternately. AIW is the sum of all active streams multiplied by the burst factor, not the largest stream alone.

### Why CS translates to bandwidth overhead

CS is not just a risk rating. Every CS point above 1 represents real network overhead from encryption inspection, DLP scanning, micro-segmentation headers, and audit logging. CS = 4 (DPDP-regulated PII workloads) adds 40% overhead to every byte traversing the network. If your provisioned bandwidth is 10 Gbps and CS = 4, your effective AI capacity is 7.14 Gbps, not 10 Gbps.

### Why LL determines topology, not just SLA

LL is not a performance target — it is an architecture forcing function. LL = 4 (31ms budget) is physically impossible over a cloud WAN path from India to any non-Indian cloud region. A Mumbai-to-Singapore round trip alone is 45ms. LL = 4 mandates on-campus AI inference. LL = 5 (20ms) mandates on-premises GPU with zero WAN traversal. No QoS policy or bandwidth upgrade can overcome physics.
