# IS — Impact Score Calculation

!!! quote "Source attribution"
    The Impact Score model was introduced by **Scott Andersen** in *Infrastructure for AI Network Design and Architecture* (BPB Publications, 2025 — [amzn.in/d/04OAa7V5](https://amzn.in/d/04OAa7V5)). The IS formula, PUO metric, and adjustment factor A originate from his work. The verdict thresholds, U_eff load unit weights, LL-to-RTT mapping, CS-to-bandwidth overhead percentages, and B_gap back-calculation are engineering extensions added by this workbook.

The Impact Score (IS) is the primary go/no-go metric for AI deployment. It synthesises U_eff, AIW, CS, LL, B, and A into one dimensionless number that quantifies network stress at a specific link.

## The formula

```
IS = (U_eff × AIW × CS × LL) / (B × A)
```

## Critical principle: IS must be calculated at every link

B is not a single value — it is the bandwidth of the specific link being evaluated. Run IS at every point where AI traffic could congest.

| B point | Layer | Typical value | Usually the bottleneck? |
|---------|-------|--------------|------------------------|
| B1 | Agent access port | 1G | No — 6.8 Mbps on 1G = 0.7% |
| B2 | Access switch uplink | 10G (or 1G legacy) | Only on legacy 1G |
| B3 | Core to SD-WAN handoff | 100M–1G branch | Yes — most common branch failure |
| B4 | WAN circuit | 100M–10G | Primary bottleneck without edge AI |
| B5 | MPLS WAN | 10G | Yes — without MCP tiering |
| B6 | Internet circuit | 5G | Yes — without MCP tiering |
| B7 | 5G cellular backup | 300–600M | Emergency only |
| B8 | Campus access uplink | 25G | Only if legacy 1G or 10G |
| B9 | Core to in-house DC | 100G | Never — 4.4 Gbps on 100G = 4.4% |

See [Chapter 9 — IS Layer-by-Layer](../chapter9-is-layer-by-layer/README.md) for the complete worked calculation at every layer.

---

## IS verdict thresholds

| IS range | Status | Meaning | Required action |
|----------|--------|---------|----------------|
| IS ≤ 1.0 | Optimal | Spare headroom. AI can grow into capacity. | Monitor quarterly. Schedule model sync off-peak. |
| 1.0 < IS ≤ 3.0 | Monitor | Balanced to moderate stress. Manageable with QoS. | Implement 6-class QoS. Set IS > 3 automated alert. |
| 3.0 < IS ≤ 10.0 | Upgrade required | AI workloads will degrade. User experience impacted. | Bandwidth upgrade and/or edge AI within 90 days. |
| IS > 10.0 | Deployment blocker | Project will fail at scale. Live AI cannot run. | Immediate redesign. No AI go-live until IS ≤ 3. |

---

## Back-calculating required bandwidth

Given a target IS of 3.0:

```
B_required = (U_eff × AIW × CS × LL) / (3.0 × A)
B_gap      = B_required − B_current
```

---

## Levers for reducing IS

| Lever | Method | IS reduction |
|-------|--------|-------------|
| Reduce AIW | Model quantisation, edge inference, caching | 50–80% |
| Reduce LL (accept higher latency) | Move batch workloads to LL=1 or LL=2 | Up to 80% |
| Reduce CS | Trusted zones, anonymised data for cloud | CS4→CS3 = 25% |
| Increase B | WAN upgrade, additional uplinks | Linear |
| Increase A | MPLS (0.92) vs internet (0.70) | 31% |
| MCP tiering | Campus GPU reduces WAN AIW from 12 to 2 Mbps | 60–85% |

---

## Worked examples

### Branch, all-cloud, 100M circuit

```
U_eff=110, AIW=6.8, CS=3.0, LL=3.0, B=100, A=0.70
IS = (110 × 6.8 × 3.0 × 3.0) / (100 × 0.70) = 6,732 / 70 = 96.2  BLOCKER
```

### Branch, MCP tiering, 1G circuit

```
AIW on WAN=2.0, CS=1.5, LL=2.0, B=1,000, A=0.70
IS = (110 × 2.0 × 1.5 × 2.0) / (1,000 × 0.70) = 660 / 700 = 0.94  OPTIMAL
```

### Campus MPLS, all-cloud

```
U_eff=370, AIW=12.0, CS=4.5, LL=4.5, B=10,000, A=0.92
IS = 89,910 / 9,200 = 9.77  BLOCKER
```

### Campus MPLS, post-MCP tiering

```
AIW=2.0, CS=2.0, LL=2.0, B=10,000, A=0.92
IS = (370 × 2.0 × 2.0 × 2.0) / (10,000 × 0.92) = 2,960 / 9,200 = 0.32  OPTIMAL
```

### Campus internal DC link

```
U_eff=370, AIW=12.0, CS=4.5, LL=4.5, B=100,000, A=0.99
IS = 89,910 / 99,000 = 0.91  OPTIMAL — 100G is never the bottleneck
```

---

## IS sensitivity — campus MPLS (most instructive comparison)

| Single variable change | New IS | Reduction |
|----------------------|--------|-----------|
| B: 10G → 40G (4× WAN) | 2.44 | 75% |
| AIW: 12.0 → 2.0 (MCP tiering) | 0.32 | 97% |
| LL: 4.5 → 2.0 (batch mode) | 1.93 | 80% |
| A: 0.92 → 1.0 (marginal) | 8.99 | 8% |

MCP tiering delivers 97% IS improvement — more than a 4× WAN upgrade. Architecture beats procurement.
