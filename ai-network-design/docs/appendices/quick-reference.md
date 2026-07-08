# Quick Reference Card

All formulas, thresholds, multipliers, and decision tables. Print this page for design reviews.

## All formulas

```
Step 1  U_eff  = (H × 1.0) + (AI × 3.5) + (IoT × 0.2) + (Pod × 7.0)

Step 2  AIW    = Σ(stream_Mbps) × Burst_factor

Step 3  CS     = PII + Regulatory + Exposure + Model_sensitivity + Financial
                 (each component 0, 0.5, or 1.0)

Step 4  LL (1–5) → RTT budget:
         LL1=500ms  LL2=200ms  LL3=80ms  LL4=31ms  LL5=20ms

        RTT = 2×(Access+Core+FW+WAN+LB) + Inference + Jitter
        Headroom = LL_budget − RTT  [must be > 0]

Step 5  B_min  = (U_eff × AIW × Peak_factor) / Utilisation_target
        B_rec  = B_min × 1.5
        Model_sync_BW = GB × Updates/day × 8000 / 86400
        B_total = B_rec + Model_sync_BW

Step 6  IS     = (U_eff × AIW × CS × LL) / (B × A)

Step 7  PUO    = IS / U_eff

Step 8  Route  = f(LL, CS, Data_residency)
         LL=5           → Tier 4 on-prem GPU
         LL=4 + CS≥4    → Tier 3 campus edge
         LL=4 + CS≤3    → Tier 3 campus edge
         LL=3 + CS≤4    → Tier 2 regional hub
         LL≤2 + CS≤3    → Tier 1 cloud
         Any LL + CS=5  → Tier 3 or Tier 4 (compliance override)

Step 9  B_req  = (U_eff × AIW × CS × LL) / (3.0 × A)
        B_gap  = B_req − B_current
```

---

## Entity multipliers

| Entity | Multiplier |
|--------|-----------|
| Human operator | × 1.0 |
| AI software agent / bot | × 3.5 |
| IoT / edge sensor | × 0.2 |
| GPU inference pod | × 7.0 |

---

## IS verdict

| IS | Action |
|----|--------|
| ≤ 1 | Optimal — monitor quarterly |
| 1–3 | Monitor — enforce QoS |
| 3–10 | Upgrade required — 90-day plan |
| > 10 | Blocker — no AI go-live |

## PUO verdict

| PUO | Action |
|-----|--------|
| < 0.3 | Over-provisioned |
| 0.3–1.0 | Balanced |
| 1.0–2.0 | Stressed |
| > 2.0 | Overloaded |

---

## CS overhead

| CS | Overhead |
|----|---------|
| 1 | +8% |
| 2 | +18% |
| 3 | +28% |
| 4 | +40% |
| 5 | +60% |

## A factor

| Infrastructure | A |
|--------------|---|
| Dark fiber / leased line | 0.95–1.00 |
| Dedicated MPLS SLA | 0.90–0.95 |
| SD-WAN dual-path | 0.82–0.90 |
| Shared MPLS | 0.70–0.82 |
| SD-WAN shared internet | 0.65–0.75 |
| Single ISP legacy | 0.50–0.65 |

---

## AIW reference

| Workload | Mbps | Burst |
|---------|------|-------|
| STT | 0.3–0.5 | 1.5 |
| LLM text | 0.5–2.0 | 1.3 |
| Agent assist | 2.0–4.0 | 1.6 |
| Full AI agent | 5.0–8.0 | 1.8 |
| Vision API | 5–25 | 2.0 |
| Video analytics | 8–50 | 2.2 |
| RAG | 1–5 | 1.4 |

---

## QoS 6-class model

| Class | DSCP | Workload |
|-------|------|---------|
| Real-time AI | EF (46) | STT, fraud, voice AI |
| Agent assist | CS5 (40) | LLM, coaching |
| RAG / knowledge | CS4 (32) | Vector DB |
| Analytics | CS3 (24) | Sentiment, batch |
| Model sync | CS1 (8) | Off-peak only |
| Background | BE (0) | Everything else |

---

## ARS threshold

ARS ≥ 70 required before AI production go-live.

| Domain | Max |
|--------|-----|
| Bandwidth capacity | 20 |
| Latency & switching | 20 |
| Security & compliance | 20 |
| Resilience & HA | 20 |
| Observability | 20 |
| **Total** | **100** |

---

## Key design rules

1. Never run AI links above 70% utilisation
2. Size each redundant path for 100% of B_recommended (not 50%)
3. LL = 4 mandates campus-edge AI — cloud is physically impossible
4. LL = 5 mandates on-prem GPU — zero WAN
5. IS > 10 = no AI go-live, full stop
6. ARS < 70 = pilot only, not production
7. Model sync must be off-peak — schedule 02:00–06:00
8. PUO > 2.0 = agents will abandon AI tools within weeks
9. Growth buffer: B_recommended × 1.5 minimum
10. N+1 GPU pods: always one more pod than the minimum required

---

## B point reference — where to calculate IS

| B point | Layer | Typical B | A factor | Usually the bottleneck? |
|---------|-------|----------|---------|------------------------|
| B1 | Agent access port | 1G | 1.00 | No — 0.7% utilisation |
| B2 | Access switch uplink (10G) | 10G | 0.97 | No |
| B2* | Access switch uplink (legacy 1G) | 1G | 0.95 | YES — IS = 3.54 |
| B3 | Core to SD-WAN handoff | 100M–1G | 0.70 | YES — most common branch failure |
| B4 | WAN internet circuit | varies | 0.70 | YES — without edge AI |
| B5 | MPLS 10G WAN | 10G | 0.92 | YES — without MCP tiering |
| B6 | Internet 5G ISP | 5G | 0.72 | YES — without MCP tiering |
| B7 | 5G cellular backup | 300–600M | 0.60 | Emergency only |
| B8 | Campus access uplink (25G) | 25G | 0.97 | No with dual 25G PC |
| B9 | Core to in-house DC | 100G | 0.99 | Never |

## Complete IS matrix — branch and campus

| Site | Layer | IS (naive) | IS (post-MCP) | Action |
|------|-------|-----------|--------------|--------|
| Branch | B1 — access port | 0.007 | 0.007 | No action |
| Branch | B2 — 10G uplink | 0.347 | 0.347 | No action |
| Branch | B2* — legacy 1G | 3.54 | 3.54 | Upgrade to 10G now |
| Branch | B3 — 100M circuit | 96.2 | 0.94 | Branch edge AI + 1G circuit |
| Branch | B4 — 1G internet | 9.60 | 0.94 | MCP tiering + 1G |
| Campus | B5 — MPLS 10G | 9.77 | 0.32 | MCP tiering — no BW upgrade |
| Campus | B6 — Internet | 24.9 | 0.82 | MCP tiering — no BW upgrade |
| Campus | B7 — 5G backup | — | 2.47 | Emergency use only |
| Campus | B8 — dual 25G PC | 0.75 | 0.75 | No action |
| Campus | B9 — DC 100G | 0.91 | 0.91 | No action |
