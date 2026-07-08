# WAN Path Comparison — MPLS vs Internet vs 5G

The campus main site uses three WAN paths simultaneously in an SD-WAN active-active-backup topology. This page compares IS behaviour across all three paths, individually and in combination, and defines which AI traffic takes which path.

## Path characteristics

| WAN path | Type | Capacity | A factor | SLA | Primary use |
|----------|------|---------|---------|-----|-------------|
| MPLS 10G | Dedicated circuit | 10 Gbps CIR | 0.92 | Yes — provider guarantee | Primary cloud AI path |
| Internet 5G ISP | Broadband | 5 Gbps | 0.72 | No — best effort | Active-active secondary |
| 5G Cellular | Wireless modem | 300–600 Mbps | 0.60 | No — wireless | Emergency tertiary |

---

## IS comparison: all three paths, before and after MCP tiering

Cloud-bound parameters (post-MCP, Tier 1/2 only): U_eff = 370, AIW = 2.0, CS = 2.0, LL = 2.0. Numerator = 2,960.

| Path | B (Mbps) | A | IS (all-cloud 89,910 numerator) | IS (post-MCP 2,960 numerator) | Status |
|------|---------|---|--------------------------------|------------------------------|--------|
| MPLS 10G | 10,000 | 0.92 | **9.77** | **0.32** | Blocker → Optimal |
| Internet 5G ISP | 5,000 | 0.72 | **24.9** | **0.82** | Blocker → Optimal |
| 5G Cellular | 500 | 0.60 | — | **4.93*** | Emergency only |
| MPLS + Internet (SD-WAN) | 15,000 | 0.85 | **7.06** | **0.23** | Blocker → Optimal |
| All three (aggregate) | 15,500 | 0.87 | **6.67** | **0.22** | Blocker → Optimal |

\* 5G IS calculated with 50% agents active and MCP tiered AIW.

!!! danger "All three paths fail without MCP tiering"
    Every WAN path — including the 10G MPLS — fails (IS > 3) if all AI inference is routed to cloud. This is a workload placement problem, not a bandwidth problem. Buying more WAN capacity does not solve it.

---

## Failover IS matrix

This table confirms the 99.9% availability design is sound. Each failover scenario must maintain IS < 3 for AI services to continue.

| Scenario | Active paths | Effective B | A | IS (post-MCP) | AI service |
|----------|-------------|------------|---|----------------|-----------|
| Normal (all paths up) | MPLS + Internet | 15,000 Mbps | 0.85 | 0.23 | Full |
| MPLS fails | Internet only | 5,000 Mbps | 0.72 | 0.82 | Full |
| Internet fails | MPLS only | 10,000 Mbps | 0.92 | 0.32 | Full |
| Both MPLS + Internet fail | 5G cellular only | 500 Mbps | 0.60 | 4.93 | Degraded |
| 5G cellular + Internet | Backup + secondary | 5,500 Mbps | 0.73 | 0.74 | Full |

**Conclusion:** Cloud AI service is fully maintained (IS < 1) if either MPLS or internet survives. Only the extreme edge case (both MPLS and internet fail simultaneously) pushes IS above 3 on the 5G backup. In that scenario, critical AI (fraud detection, agent assist) continues from the in-house DC — unaffected by WAN status.

---

## QoS traffic steering across WAN paths

In an SD-WAN design, traffic is steered across paths by DSCP marking and SLA policy. Define steering rules before AI goes live.

| AI workload | DSCP | Tier | Primary WAN | Failover WAN | Why |
|-------------|------|------|-------------|--------------|-----|
| Fraud detection | EF (46) | Tier 4 DC | **No WAN — in-house** | **No WAN** | LL=5, zero WAN |
| Agent assist + STT | CS5 (40) | Tier 3 campus | **No WAN — campus GPU** | **No WAN** | LL=4, campus edge |
| RAG knowledge base | CS4 (32) | Tier 2 regional | MPLS (lowest lat) | Internet | LL=3, 80ms |
| Sentiment analytics | CS3 (24) | Tier 2 / Tier 1 | MPLS or Internet | Internet or 5G | LL=2 |
| Report generation | CS2 (16) | Tier 1 cloud | Internet (cheaper) | MPLS | LL=1, batch |
| Model sync | CS1 (8) | Any | MPLS off-peak only | Internet off-peak | Scheduled |
| Background | BE (0) | N/A | Any | Any | Unclassified |

!!! note "55% of AI traffic never touches the WAN"
    Tier 3 (campus edge AI) handles STT + LLM + agent assist = 41% of traffic. Tier 4 (in-house DC) handles fraud detection = 14% of traffic. Combined, 55% of all AI traffic is local. Only the remaining 45% (Tier 1/2) crosses any WAN path.

---

## SD-WAN path SLA configuration

Define SLA thresholds for each path so SD-WAN automatically reroutes when quality degrades:

```
MPLS primary SLA thresholds:
  Latency:   < 30ms  (trigger reroute if > 30ms)
  Jitter:    < 5ms   (trigger reroute if > 5ms)
  Packet loss: < 0.1%

Internet secondary SLA thresholds:
  Latency:   < 80ms  (trigger reroute if > 80ms)
  Jitter:    < 20ms
  Packet loss: < 0.5%

5G cellular (tertiary):
  Trigger:   Both MPLS and Internet fail SLA simultaneously
  No latency SLA — emergency path only
```

---

## MPLS vs Internet: IS sensitivity to path degradation

In practice, path quality degrades before it fails. This section shows IS sensitivity to A factor reduction — simulating congestion or SLA degradation.

```
MPLS path degradation (post-MCP, numerator = 2,960):
A = 0.92 (normal):        IS = 2,960 / (10,000 × 0.92) = 0.32  ← Optimal
A = 0.80 (light congest): IS = 2,960 / (10,000 × 0.80) = 0.37  ← Optimal
A = 0.65 (heavy congest): IS = 2,960 / (10,000 × 0.65) = 0.46  ← Optimal
A = 0.50 (severe):        IS = 2,960 / (10,000 × 0.50) = 0.59  ← Optimal

MPLS can degrade significantly and still maintain IS < 1 post-MCP tiering.
```

```
Internet path degradation (post-MCP):
A = 0.72 (normal):        IS = 2,960 / (5,000 × 0.72) = 0.82   ← Optimal
A = 0.60 (congested):     IS = 2,960 / (5,000 × 0.60) = 0.99   ← Optimal (barely)
A = 0.50 (heavy congest): IS = 2,960 / (5,000 × 0.50) = 1.18   ← Monitor
A = 0.40 (severe):        IS = 2,960 / (5,000 × 0.40) = 1.48   ← Monitor

Internet degrades more quickly but stays below IS = 3 until severely congested.
If IS > 1.5 on internet, SD-WAN should automatically shift CS4 traffic to MPLS.
```

---

## When to upgrade WAN bandwidth

The post-MCP IS values are well within optimal for both MPLS and internet paths. WAN bandwidth upgrade is not required in the current design. Trigger a bandwidth review when:

- IS on any single WAN path exceeds 2.0 during normal operation (not failover)
- U_eff grows by more than 50% due to AI expansion
- New LL = 3 workloads are added to cloud paths (increasing WAN AIW)
- Model sync frequency increases to daily (adds sustained WAN load)

```
Bandwidth review trigger formula:
B_current ≥ (U_eff_new × AIW_new × CS_cloud × LL_cloud) / (2.0 × A)

If B_current is less than this value, initiate WAN upgrade process.
```
