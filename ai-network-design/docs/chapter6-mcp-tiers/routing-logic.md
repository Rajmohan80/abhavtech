# MCP Routing Logic

Routing logic assigns each AI workload to the correct inference tier using four decision factors: LL requirement, CS level, data residency constraint, and cost threshold.

## The routing formula

```
Route = f(LL_requirement, CS_level, Data_residency, Cost_threshold)
```

Applied as a decision sequence — evaluate in order and stop at the first matching rule.

---

## Routing decision table

| Rule | LL req | CS level | Data residency | Route to | Rationale |
|------|--------|---------|---------------|---------|-----------|
| 1 | LL = 5 | Any | Any | Tier 4 — on-prem GPU | Sub-20ms impossible over any WAN |
| 2 | Any | CS = 5 | Required | Tier 4 — on-prem GPU | Highest compliance mandates DC isolation |
| 3 | LL = 4 | CS ≥ 4 | Required | Tier 3 — campus edge | Real-time + PII = no cloud, no colo |
| 4 | LL = 4 | CS ≤ 3 | Not required | Tier 3 — campus edge | Latency forces campus regardless of CS |
| 5 | LL = 3 | CS ≤ 4 | Not required | Tier 2 — regional hub | Near-real-time; regional edge sufficient |
| 6 | LL = 3 | CS = 5 | Required | Tier 3 — campus edge | Compliance overrides latency preference |
| 7 | LL ≤ 2 | CS ≤ 3 | Not required | Tier 1 — cloud API | Cost-optimal; cloud latency is fine |
| 8 | LL ≤ 2 | CS ≥ 4 | Required | Tier 3 — campus edge | Compliance overrides latency tolerance |

---

## Workload routing worksheet

Map every AI workload at your site to a tier using the routing table above.

| AI workload | LL req | CS level | Residency req | Assigned tier | On-prem infra |
|-------------|--------|---------|--------------|--------------|--------------|
| ___ | ___ | ___ | Y / N | Tier ___ | ___ |
| ___ | ___ | ___ | Y / N | Tier ___ | ___ |
| ___ | ___ | ___ | Y / N | Tier ___ | ___ |
| ___ | ___ | ___ | Y / N | Tier ___ | ___ |
| ___ | ___ | ___ | Y / N | Tier ___ | ___ |

---

## Common enterprise routing examples

### Webex CC with full AI assist (DPDP regulated)

| Workload | LL | CS | Route | Reason |
|----------|----|----|-------|--------|
| Speech-to-text | 4 | 4 | Tier 3 — campus | Real-time + PII |
| Agent assist LLM | 4 | 4 | Tier 3 — campus | Real-time + PII |
| Fraud detection | 5 | 5 | Tier 4 — DC | Sub-20ms + PCI |
| RAG knowledge base | 3 | 2 | Tier 2 — hub | Near-real-time, internal data |
| Sentiment analysis | 2 | 2 | Tier 2 — hub | Non-real-time, non-PII |
| Report generation | 1 | 1 | Tier 1 — cloud | Batch, non-PII |
| Screen analytics | 2 | 1 | Tier 1 — cloud | Aggregated, non-PII |

**WAN impact:** Only Tier 1 and Tier 2 workloads consume WAN bandwidth to cloud. Tier 3 and Tier 4 are WAN-free.

---

## Network implications of tier routing

### WAN reduction calculation

Once workloads are assigned to tiers, calculate the revised WAN-bound AIW:

```
AIW_WAN = Σ(AIW of Tier 1 workloads only)
        + Σ(AIW of Tier 2 workloads, metro circuit)
```

Workloads on Tier 3 and Tier 4 contribute zero to WAN IS.

**Revised IS formula for WAN path:**

```
IS_WAN = (U_eff × AIW_WAN × CS_cloud × LL_cloud) / (B_WAN × A_WAN)
```

Where CS_cloud and LL_cloud reflect only the characteristics of cloud-bound workloads (typically lower than the site maximum).

### Example — Before and after MCP tiering

**Before (all cloud):**
```
AIW = 12.0 Mbps per agent (all streams cloud-bound)
IS  = (1,390 × 12.0 × 4.0 × 4.0) / (8,000 × 0.85) = 39.4
```

**After MCP tiering:**
```
AIW_WAN = 1.8 Mbps per agent (RAG + analytics only — Tier 1/2)
CS_cloud = 2.0 (cloud workloads are non-PII)
LL_cloud = 2.0 (tolerant of 200ms for analytics)
IS_WAN = (1,390 × 1.8 × 2.0 × 2.0) / (8,000 × 0.85) = 0.74
```

**IS goes from 39.4 to 0.74 — optimal — purely from workload routing, before any bandwidth upgrade.**

---

## Load balancer requirements for tier routing

For Tier 3 campus-edge AI, an L7-aware load balancer is required to route inference requests by model type and workload class:

```
/api/v1/assist     →  Campus GPU pod (Tier 3)
/api/v1/fraud      →  On-prem GPU (Tier 4)
/api/v1/rag        →  Regional hub (Tier 2)
/api/v1/analytics  →  Cloud API (Tier 1)
```

Legacy L4 load balancers (TCP only) cannot make this routing decision. Envoy Proxy, F5 BIG-IP Next, or Nginx Plus with gRPC support is required. This is a Phase 2 upgrade item in the roadmap.

---

## Failover between tiers

Design tier failover paths for resilience:

| Primary tier | Failover | Condition |
|-------------|---------|-----------|
| Tier 4 (DC GPU) | Tier 3 (campus) | DC GPU unavailable, latency SLA relaxed |
| Tier 3 (campus) | Tier 2 (regional hub) | Campus server offline, 80ms budget |
| Tier 2 (regional hub) | Tier 1 (cloud) | Hub offline, LL = 1/2 workloads only |
| Tier 1 (cloud) | Tier 2 (regional hub cached response) | Cloud API outage |

Document failover tier for each workload during design. The load balancer health-checks each tier and reroutes automatically on failure.
