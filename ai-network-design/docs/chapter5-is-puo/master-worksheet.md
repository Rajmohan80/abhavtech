# Master Calculation Worksheet

Complete this worksheet for each site in your enterprise. All inputs flow from previous chapters. Fill in your values, run the formulas, and read the verdict.

## Site identification

| Field | Your value |
|-------|-----------|
| Site name | ___ |
| Location | ___ |
| AI workloads deployed | ___ |
| WAN link type | ___ |
| Design date | ___ |
| Designed by | ___ |

---

## Block 1 — U_eff (Chapter 2)

```
U_eff = (H × 1.0) + (AI × 3.5) + (IoT × 0.2) + (Pod × 7.0)
```

| Variable | Count | Multiplier | Contribution |
|----------|-------|-----------|-------------|
| Human operators (H) | ___ | × 1.0 | = ___ |
| AI software agents (AI) | ___ | × 3.5 | = ___ |
| IoT / edge sensors (IoT) | ___ | × 0.2 | = ___ |
| GPU inference pods (Pod) | ___ | × 7.0 | = ___ |
| **U_eff** | | **SUM** | **= ___** |

---

## Block 2 — AIW (Chapter 2)

```
AIW = Σ(stream_Mbps) × Burst_factor
```

| AI stream | Active? | Mbps |
|-----------|---------|------|
| Speech-to-text | Y / N | ___ |
| LLM / agent assist | Y / N | ___ |
| Screen analytics | Y / N | ___ |
| Vision / camera AI | Y / N | ___ |
| RAG / knowledge base | Y / N | ___ |
| Fraud / real-time inference | Y / N | ___ |
| Other: ___ | Y / N | ___ |
| **Subtotal** | | **= ___** |
| **× Burst factor** | | **× ___** |
| **AIW** | | **= ___ Mbps** |

---

## Block 3 — CS (Chapter 3)

```
CS = PII + Regulatory + Exposure + Model_sensitivity + Financial
```

| Component | Score (0, 0.5, or 1.0) |
|-----------|----------------------|
| PII handling | ___ |
| Regulatory scope | ___ |
| Public / partner exposure | ___ |
| AI model sensitivity | ___ |
| Financial / payment data | ___ |
| **CS total** | **= ___** |

CS overhead fraction (from table):

| CS | Overhead |
|----|---------|
| 1.0 | 8% |
| 2.0 | 18% |
| 3.0 | 28% |
| 4.0 | 40% |
| 5.0 | 60% |

**CS overhead fraction for your CS:** ___ %

---

## Block 4 — LL (Chapter 3)

```
RTT_total = 2 × (Access + Core + Firewall + WAN + LB) + Inference + Jitter
Headroom  = LL_budget − RTT_total
```

| LL selected | RTT budget |
|------------|-----------|
| LL = 1 | 500 ms |
| LL = 2 | 200 ms |
| LL = 3 | 80 ms |
| LL = 4 | 31 ms |
| LL = 5 | 20 ms |

**Your LL:** ___ | **Your RTT budget:** ___ ms

| RTT component | Current (ms) | Target (ms) |
|--------------|-------------|------------|
| Access switch | ___ | ___ |
| Core / distribution | ___ | ___ |
| Firewall / NGFW | ___ | ___ |
| WAN / internet | ___ | ___ |
| Load balancer | ___ | ___ |
| AI inference | ___ | ___ |
| Jitter buffer | ___ | ___ |
| **RTT total** | **= ___** | **= ___** |
| **Headroom** | **= ___** | **= ___** |

**Required architecture** (from LL table): ___

---

## Block 5 — Bandwidth B (Chapter 4)

```
B_minimum     = (U_eff × AIW × Peak_factor) / Link_utilisation_target
B_recommended = B_minimum × 1.5
Model_sync_BW = GB × Updates/day × 8000 / 86400
B_total       = B_recommended + Model_sync_BW
```

| Variable | Your value |
|----------|-----------|
| U_eff | ___ (from Block 1) |
| AIW | ___ Mbps (from Block 2) |
| Peak_factor | ___ (1.5–2.5) |
| Link_utilisation_target | ___% |
| **B_minimum** | **= ___ Mbps** |
| **B_recommended** | **= ___ Mbps** |
| Model size (GB) | ___ |
| Updates per day | ___ |
| **Model_sync_BW** | **= ___ Mbps** |
| **B_total to provision** | **= ___ Mbps (___ Gbps)** |
| **Current B** | **___ Mbps** |
| **B_gap** | **= ___ Mbps** |

---

## Block 6 — IS Calculation (Chapter 5)

```
IS = (U_eff × AIW × CS × LL) / (B × A)
```

| Variable | Value |
|----------|-------|
| U_eff | ___ |
| AIW | ___ |
| CS | ___ |
| LL | ___ |
| **Numerator (U × AIW × CS × LL)** | **= ___** |
| B provisioned | ___ Mbps |
| A factor | ___ |
| **Denominator (B × A)** | **= ___** |
| **IS = Numerator / Denominator** | **= ___** |

**IS verdict:**

- [ ] IS ≤ 1.0 — Optimal
- [ ] IS 1–3 — Monitor
- [ ] IS 3–10 — Upgrade required
- [ ] IS > 10 — Deployment blocker

---

## Block 7 — PUO (Chapter 5)

```
PUO = IS / U_eff
```

| Variable | Value |
|----------|-------|
| IS | ___ |
| U_eff | ___ |
| **PUO** | **= ___** |

**PUO verdict:**

- [ ] PUO < 0.3 — Over-provisioned
- [ ] PUO 0.3–1.0 — Balanced
- [ ] PUO 1.0–2.0 — Stressed
- [ ] PUO > 2.0 — Overloaded

---

## Block 8 — Required bandwidth for IS = 3

```
B_required = (U_eff × AIW × CS × LL) / (3.0 × A)
B_gap      = B_required − B_current
```

| Variable | Value |
|----------|-------|
| Numerator (from Block 6) | ___ |
| Target IS | 3.0 |
| A factor | ___ |
| **B_required (Mbps)** | **= ___** |
| B_current | ___ Mbps |
| **B_gap** | **= ___ Mbps** |
| **Upgrade factor** | **= ___× current** |

---

## Block 9 — MCP tier assignment (Chapter 6)

Assign each AI workload to the correct inference tier:

| Workload | LL req | CS level | Assigned tier | On-prem infra needed |
|----------|--------|---------|--------------|---------------------|
| ___ | ___ | ___ | Tier ___ | ___ |
| ___ | ___ | ___ | Tier ___ | ___ |
| ___ | ___ | ___ | Tier ___ | ___ |
| ___ | ___ | ___ | Tier ___ | ___ |

---

## Summary verdict

| Metric | Your value | Status |
|--------|-----------|--------|
| U_eff | ___ | — |
| AIW | ___ Mbps | — |
| CS | ___ | — |
| LL | ___ | — |
| B current | ___ Mbps | — |
| B required (IS=3) | ___ Mbps | — |
| B gap | ___ Mbps | Upgrade / No upgrade |
| IS | ___ | Optimal / Monitor / Upgrade / Blocker |
| PUO | ___ | Over / Balanced / Stressed / Overloaded |
| RTT headroom | ___ ms | Pass / Fail |
| AI Readiness Score | ___ / 100 | Pass (≥70) / Fail |
| **Overall readiness** | | **Ready / Not ready** |

---

## Actions required before AI go-live

List each action item with owner and deadline:

| # | Action | Owner | Target date | Priority |
|---|--------|-------|------------|---------|
| 1 | ___ | ___ | ___ | Critical / Medium / Low |
| 2 | ___ | ___ | ___ | ___ |
| 3 | ___ | ___ | ___ | ___ |
| 4 | ___ | ___ | ___ | ___ |
| 5 | ___ | ___ | ___ | ___ |
