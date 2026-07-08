# LL — Low-Latency Factor

LL is the most architecturally consequential variable in this workbook. It does not just affect IS numerically — it determines whether you deploy AI in the cloud, at a regional edge, on a campus server, or in your own data centre. LL is a physics constraint, not a configuration setting.

## LL levels and what they mandate

| LL | RTT budget | Use case examples | Required architecture | WAN role |
|----|-----------|------------------|----------------------|----------|
| 1 | 500 ms | Batch analytics, overnight reports, training jobs | Cloud AI — any region | Best-effort acceptable |
| 2 | 200 ms | Chatbots, sentiment analysis, NLP summarisation | Cloud AI — nearest region | WAN 10–50 ms fine |
| 3 | 80 ms | Agent assist, RAG retrieval, knowledge base query | Regional edge hub (city) | WAN must be < 20 ms |
| 4 | 31 ms | Real-time voice AI, STT, live agent coaching | Campus edge AI (on-site) | WAN bypassed for AI |
| 5 | 20 ms | Fraud detection, HFT, robotics, autonomous systems | On-prem GPU / FPGA | Zero WAN for AI traffic |

---

## RTT budget formula

```
RTT_total = 2 × (Access_ms + Core_ms + Firewall_ms + WAN_ms + LB_ms)
          + Inference_ms
          + Jitter_ms

Headroom = LL_budget_ms − RTT_total     [must be > 0]
```

Every component in the RTT path consumes milliseconds from the budget. The return path doubles the network components (access, core, firewall, WAN, load balancer). Inference time and jitter are one-way only.

---

## RTT component reference

### Legacy infrastructure values (pre-upgrade)

| RTT component | Legacy value | Upgraded value | Saving |
|--------------|-------------|---------------|--------|
| Access switch (one-way) | 2–5 ms | 0.1–0.5 ms | 4 ms |
| Core / distribution (5 hops) | 5–15 ms | 0.5–1.5 ms | 13 ms |
| Firewall / NGFW (one-way) | 8–20 ms | 2–4 ms | 16 ms |
| WAN / internet propagation | 40–80 ms | 0 ms (edge AI) | 80 ms |
| Load balancer (one-way) | 3–8 ms | 0.5–2 ms | 6 ms |
| AI inference engine | 40–200 ms | 10–40 ms | 160 ms |
| Jitter / queue buffer | 5–20 ms | 3–8 ms | 12 ms |

The most impactful savings come from:

1. **Eliminating the WAN hop** by deploying campus-edge AI (saves 40–80 ms one-way, 80–160 ms RTT)
2. **Reducing inference time** through model quantisation (INT4/INT8 reduces inference from 40 ms to 10 ms)
3. **Replacing legacy core switches** with cut-through ASIC switching (saves 13 ms across 5 hops)

---

## RTT design input table

Complete this table for each site and each AI workload tier.

| RTT component | Legacy (ms) | Upgraded (ms) | Your current (ms) | Your upgraded (ms) |
|--------------|------------|--------------|------------------|-------------------|
| Access switch | 2–5 | 0.1–0.5 | ___ | ___ |
| Core / distribution | 5–15 | 0.5–1.5 | ___ | ___ |
| Firewall / NGFW | 8–20 | 2–4 | ___ | ___ |
| WAN / internet | 40–80 | 0 (edge AI) | ___ | ___ |
| Load balancer | 3–8 | 0.5–2 | ___ | ___ |
| AI inference | 40–200 | 10–40 | ___ | ___ |
| Jitter buffer | 5–20 | 3–8 | ___ | ___ |
| **RTT total (formula above)** | | | **= ___** | **= ___** |
| **LL budget** | | | **___ ms** | **___ ms** |
| **Headroom** | | | **= ___** | **= ___** |

---

## Worked examples

### Example 1 — Voice AI agent assist (LL = 4, 31 ms budget)

**Site:** Mumbai contact centre, on-site inference deployed.

```
RTT = 2 × (0.3 + 1.0 + 3.0 + 0 + 1.0)     [WAN = 0: edge AI on-site]
    + 20 (inference, quantised model)
    + 5  (jitter buffer)

RTT = 2 × 5.3 + 25
RTT = 10.6 + 25
RTT = 35.6 ms
```

**Budget:** 31 ms  
**Result:** 4.6 ms over budget

**Fix:** Reduce inference from 20 ms to 15 ms (further model quantisation or GPU upgrade).

```
Revised RTT = 10.6 + 15 + 5 = 30.6 ms     Headroom: 0.4 ms
```

!!! warning "Tight headroom"
    0.4 ms headroom is insufficient for production. Any network event (microbursts, retransmits) will push RTT over budget. Target 5–10 ms headroom minimum for LL = 4 workloads.

### Example 2 — Fraud detection (LL = 5, 20 ms budget)

**Site:** On-prem GPU server in Mumbai data centre.

```
RTT = 2 × (0.2 + 0.5 + 2.0 + 0 + 0.5)    [WAN = 0, on-prem]
    + 8 (inference, FPGA/GPU dedicated)
    + 3 (jitter buffer)

RTT = 2 × 3.2 + 11
RTT = 6.4 + 11
RTT = 17.4 ms     Headroom: 2.6 ms
```

**Budget:** 20 ms  
**Result:** Passes with 2.6 ms headroom. Acceptable for fraud detection.

### Example 3 — Cloud analytics (LL = 2, 200 ms budget)

**Site:** Any enterprise site, sentiment analysis on cloud.

```
RTT = 2 × (0.5 + 2.0 + 5.0 + 35 + 2.0)    [WAN = 35 ms to Mumbai cloud region]
    + 80 (inference, cloud LLM)
    + 10 (jitter buffer)

RTT = 2 × 44.5 + 90
RTT = 89 + 90
RTT = 179 ms     Headroom: 21 ms
```

**Budget:** 200 ms  
**Result:** Comfortable. Cloud AI is entirely valid for LL = 1–2 workloads.

---

## LL and the WAN impossibility constraint

For an Indian enterprise site (Mumbai, Delhi, Hyderabad), the RTT to cloud regions is:

| Cloud region | Provider | Approximate RTT |
|-------------|---------|----------------|
| Mumbai (ap-south-1) | AWS | 8–15 ms |
| Singapore | AWS / Azure | 45–60 ms |
| Tokyo | AWS / Azure | 100–130 ms |
| US East | AWS / Azure / GCP | 180–220 ms |
| Europe (Frankfurt) | AWS / Azure | 130–160 ms |

**Implication:** For LL = 4 (31 ms budget), even the Mumbai cloud region at 8 ms RTT leaves only 23 ms for all other components — switching, firewall, load balancer, and inference. A GPU inference call typically takes 20–40 ms on its own. There is no headroom.

**For LL = 4 or LL = 5 workloads, cloud AI is not viable regardless of bandwidth.** Campus-edge or on-prem inference is mandatory.

---

## QoS and latency

QoS does not reduce latency — it reduces latency variability (jitter). A DSCP EF-marked packet on a congested link still experiences queuing delay. QoS guarantees that the AI inference packet is served before background traffic, reducing worst-case latency but not average latency.

For LL = 4 and LL = 5 workloads, the jitter buffer entry in the RTT table should be reduced to 3 ms (reflecting well-implemented QoS), not the 10–20 ms of a best-effort network.

---

## Selecting your LL value

Use the highest LL required by any single workload at your site. The architecture must satisfy the most demanding workload. Example:

- Batch analytics at your site: LL = 1
- Agent assist LLM: LL = 3
- Real-time STT + voice AI: LL = 4
- Fraud detection: LL = 5

**Site LL = 5.** The site design must accommodate on-prem GPU for fraud detection. All other workloads can be served by lower tiers.
