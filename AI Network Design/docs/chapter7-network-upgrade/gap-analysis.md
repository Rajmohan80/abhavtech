# Gap Analysis

Gap analysis quantifies the difference between your current infrastructure and what AI workloads require. It produces two outputs: the Bandwidth Gap (how much more WAN you need) and the AI Readiness Score (a composite infrastructure assessment out of 100).

## Bandwidth gap formula

```
B_required = (U_eff × AIW × CS × LL) / (IS_target × A)
           = (U_eff × AIW × CS × LL) / (3.0 × A)

B_gap = B_required − B_current     [positive = must upgrade]

Upgrade_factor = B_required / B_current
```

A positive B_gap means the current infrastructure cannot support AI at the target IS = 3. The upgrade factor tells you how many times your current bandwidth you need.

### Worked example

**Site:** Mumbai, U_eff = 1,390, AIW = 1.8 Mbps (post-MCP), CS = 2.0, LL = 2.0, A = 0.85, B_current = 8,000 Mbps

```
B_required = (1,390 × 1.8 × 2.0 × 2.0) / (3.0 × 0.85)
           = 10,008 / 2.55
           = 3,925 Mbps

B_gap = 3,925 − 8,000 = −4,075 Mbps (negative = no upgrade needed)
```

Post-MCP tiering, the 8G WAN has surplus capacity. No WAN upgrade needed for cloud-bound traffic. The upgrade investment should focus on campus-edge AI infrastructure instead.

---

## AI Readiness Score (ARS)

ARS is a composite score out of 100. AI deployment requires ARS ≥ 70 before any production workload goes live. Below 70, a pilot can proceed but with documented risks accepted by the project sponsor.

### Scoring the five domains

Score each domain from 0 to 20:

#### Domain 1 — Bandwidth capacity (max 20)

| Condition | Score |
|-----------|-------|
| B_gap > 10× current (extreme deficit) | 2 |
| B_gap 5–10× current | 5 |
| B_gap 3–5× current | 10 |
| B_gap 1–3× current | 15 |
| B_gap ≤ 0 (no deficit) | 20 |

**Your score:** ___

#### Domain 2 — Latency and switching (max 20)

| Condition | Score |
|-----------|-------|
| RTT exceeds LL budget by > 50% | 2 |
| RTT exceeds LL budget | 8 |
| RTT within budget but < 5 ms headroom | 13 |
| RTT within budget with 10+ ms headroom | 17 |
| RTT well within budget, upgraded core switches | 20 |

**Your score:** ___

#### Domain 3 — Security and compliance (max 20)

| Condition | Score |
|-----------|-------|
| No TLS 1.3 inspection capability | 3 |
| TLS inspection available but no AI-aware DLP | 8 |
| NGFW with TLS inspect + basic DLP | 13 |
| Full DLP + micro-segmentation + ZTNA | 17 |
| All above + data residency controls + audit | 20 |

**Your score:** ___

#### Domain 4 — Resilience and high availability (max 20)

| Condition | Score |
|-----------|-------|
| Single WAN path, no failover | 3 |
| Dual WAN but manual failover | 8 |
| Dual WAN with automatic failover, single core path | 13 |
| SD-WAN with active-active dual paths | 17 |
| Full HA: dual SD-WAN + dual core + campus edge redundancy | 20 |

**Your score:** ___

#### Domain 5 — Observability (max 20)

| Condition | Score |
|-----------|-------|
| SNMP polling only (5-minute intervals) | 3 |
| NetFlow / sFlow (1-minute intervals) | 8 |
| NetFlow + APM for AI applications | 13 |
| Streaming telemetry (10-second intervals) | 17 |
| Streaming telemetry + AIOps + IS dashboard | 20 |

**Your score:** ___

### ARS calculation

```
ARS = Domain1 + Domain2 + Domain3 + Domain4 + Domain5
```

| ARS range | AI deployment readiness |
|-----------|----------------------|
| ARS < 40 | Not ready — critical blockers present |
| ARS 40–69 | Pilot only — documented risk, sponsor sign-off required |
| ARS 70–89 | Ready for production with monitoring |
| ARS 90–100 | Optimised — full production AI capable |

### ARS worksheet

| Domain | Max | Your score |
|--------|-----|-----------|
| Bandwidth capacity | 20 | ___ |
| Latency and switching | 20 | ___ |
| Security and compliance | 20 | ___ |
| Resilience and HA | 20 | ___ |
| Observability | 20 | ___ |
| **Total ARS** | **100** | **= ___** |

---

## Layer-by-layer readiness assessment

Assess each network layer against AI requirements. This feeds the upgrade priority list in the roadmap chapter.

| Layer | Current state | AI requirement | Gap | Status |
|-------|--------------|---------------|-----|--------|
| WAN / MPLS | ___ | ___ | ___ | Blocker / Risk / Ready |
| Core switches | ___ | ___ | ___ | Blocker / Risk / Ready |
| QoS policy | ___ | ___ | ___ | Blocker / Risk / Ready |
| Firewall / NGFW | ___ | ___ | ___ | Blocker / Risk / Ready |
| DNS / IPAM | ___ | ___ | ___ | Blocker / Risk / Ready |
| Access switches | ___ | ___ | ___ | Blocker / Risk / Ready |
| Wi-Fi | ___ | ___ | ___ | Blocker / Risk / Ready |
| SD-WAN | ___ | ___ | ___ | Blocker / Risk / Ready |
| Monitoring / NPM | ___ | ___ | ___ | Blocker / Risk / Ready |
| Network segmentation | ___ | ___ | ___ | Blocker / Risk / Ready |
| Storage network | ___ | ___ | ___ | Blocker / Risk / Ready |
| Load balancer | ___ | ___ | ___ | Blocker / Risk / Ready |

---

## Upgrade ROI justification

Use this formula to quantify the financial case for infrastructure investment:

```
Project_failure_cost = AI_project_investment × Failure_probability

Failure_probability = MIN(1.0, IS_current / 10)
    IS = 10 → 100% failure probability
    IS = 5  → 50% failure probability
    IS = 3  → 30% failure probability

Upgrade_ROI (%) = ((Project_failure_cost − Upgrade_cost) / Upgrade_cost) × 100
```

### Example

A ₹5 crore AI project, current IS = 22 (failure probability = 100%), WAN upgrade cost = ₹40 lakhs:

```
Project_failure_cost = ₹5,00,00,000 × 1.0 = ₹5,00,00,000
Upgrade_ROI = ((500L − 40L) / 40L) × 100 = 1,150%
```

The upgrade pays for itself 11.5 times over in avoided project failure alone, before counting any AI productivity benefit.
