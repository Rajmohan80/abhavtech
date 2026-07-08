# U_eff — Effective User Load Calculation

U_eff converts your enterprise's mix of humans, bots, IoT devices, and GPU pods into a single equivalent load unit count. It is the foundation of every bandwidth and IS calculation in this workbook.

## The formula

```
U_eff = (H × 1.0) + (AI × 3.5) + (IoT × 0.2) + (Pod × 7.0)
```

Where:

- **H** = Number of simultaneous human operators / agents
- **AI** = Number of AI software agents / automation bots
- **IoT** = Number of IoT devices, edge sensors, or AI cameras
- **Pod** = Number of GPU inference pods (containers or physical GPUs serving inference)

---

## Multiplier rationale

### Human operators (× 1.0)

The baseline unit. Humans are intermittent network users — they think, pause, type, and listen. During a typical contact centre call, a human agent drives AI assist for roughly 60–70% of the call duration and is idle (from a network perspective) during transfers, hold, and wrap-up. Duty cycle: 50–70%.

### AI software agents / bots (× 3.5)

AI bots never pause. They run 24 hours a day, 7 days a week, processing requests continuously. Each bot typically maintains 3–4 simultaneous API connections: one for incoming request intake, one for the inference call, one for response streaming, and one for logging and telemetry. With no think time and no idle cycles, a single bot generates sustained load equivalent to 3.5 human agents.

### IoT / edge sensors (× 0.2)

Individual IoT devices generate modest traffic — a temperature sensor may consume less than 0.01 Mbps, an AI-enabled CCTV camera 0.5–2 Mbps. The multiplier of 0.2 reflects a blended average across sensor types. The danger is volume: 10,000 IoT devices at 0.2 load units each equals 2,000 load units — more than a 500-agent contact centre.

### GPU inference pods (× 7.0)

A GPU inference pod is the single highest network-intensity entity in an AI enterprise. It simultaneously:

- Receives inference requests from all users it serves
- Streams responses back to all requesting users
- Loads and caches model weights (large binary transfers)
- Communicates with peer pods for distributed inference
- Streams telemetry and health data to monitoring systems

A single inference pod serving 50 concurrent agents generates traffic equivalent to 7 human operators in sustained terms. This multiplier is conservative — high-throughput pods can reach 10–12x.

---

## Design input table

Fill in your values for each site. Run this calculation before any other step.

| Entity type | Count (your site) | Multiplier | Contribution |
|------------|-------------------|-----------|-------------|
| Human operators (H) | ___ | × 1.0 | = ___ |
| AI software agents (AI) | ___ | × 3.5 | = ___ |
| IoT / edge sensors (IoT) | ___ | × 0.2 | = ___ |
| GPU inference pods (Pod) | ___ | × 7.0 | = ___ |
| **U_eff total** | | **SUM** | **= ___** |

For multi-site deployments, repeat this table once per site.

---

## Worked example

**Site:** Mumbai contact centre  
**Profile:** 500 human agents, 100 AI automation bots, 2,000 IoT sensors on the floor, 20 GPU inference pods serving the AI assist system.

```
U_eff = (500 × 1.0) + (100 × 3.5) + (2000 × 0.2) + (20 × 7.0)
U_eff = 500 + 350 + 400 + 140
U_eff = 1,390
```

**Naive headcount:** 500 agents — what most architects would use.  
**U_eff:** 1,390 — what the network actually carries.  
**Gap:** 178% undercount if raw headcount is used.

!!! warning "Common error"
    Using 500 instead of 1,390 in the IS formula produces IS = 3.2 instead of IS = 8.9. This is the difference between "manageable, needs QoS" and "project will fail." Always calculate U_eff.

### Contribution breakdown

| Entity | Raw count | Load units | Share |
|--------|-----------|-----------|-------|
| Human agents | 500 | 500 | 36% |
| AI bots | 100 | 350 | 25% |
| IoT sensors | 2,000 | 400 | 29% |
| GPU pods | 20 | 140 | 10% |
| **Total** | **2,620** | **1,390** | **100%** |

In this example, non-human entities (bots + IoT + pods) account for 64% of network load but only 40% of physical unit count.

---

## Reference benchmarks

Use these to sanity-check your U_eff calculation.

| Enterprise type | H | AI | IoT | Pod | U_eff | Scale |
|----------------|---|----|----|-----|-------|-------|
| Small CC — 100 seats | 100 | 20 | 200 | 4 | 237 | Small |
| Mid CC — 500 seats | 500 | 100 | 2,000 | 20 | 1,390 | Medium |
| Large bank — 1,200 agents | 1,200 | 300 | 8,000 | 48 | 4,296 | Large |
| Hospital network | 2,000 | 50 | 25,000 | 30 | 7,385 | XL |
| Manufacturing plant (AI vision) | 300 | 80 | 15,000 | 40 | 3,658 | Large |

---

## Planning for growth

When sizing infrastructure, calculate U_eff at your **planned maximum deployment**, not today's numbers. AI rollouts typically expand from pilot (50 agents) to full (500 agents) within 12–18 months. Network upgrades require 90–180 days to procure and deploy.

**Growth projection formula:**

```
U_eff_target = (H_max × 1.0) + (AI_max × 3.5) + (IoT_max × 0.2) + (Pod_max × 7.0)
```

Provision bandwidth for `U_eff_target`, not `U_eff_current`. The incremental cost of provisioning for future growth at time of upgrade is minimal compared to re-upgrading 18 months later.

---

## Redundancy consideration

In an active-active dual-site design, each site must be able to carry **100% of U_eff** in failover scenarios, not 50%. Size bandwidth at each site for full U_eff, with the understanding that during normal operations each site carries approximately half. This is the standard enterprise resilience model for AI workloads.

```
B_per_site (for redundancy) = B_calculated using full U_eff (not U_eff / 2)
```
