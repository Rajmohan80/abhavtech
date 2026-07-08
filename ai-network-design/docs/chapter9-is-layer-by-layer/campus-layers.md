# Campus Main — IS Calculations at Every Layer (B5 to B9)

## Campus site profile

| Parameter | Value | Notes |
|-----------|-------|-------|
| Human agents | 200 | Split across 2 access switches (100 per switch) |
| IoT / edge sensors | 500 | Cameras, sensors, smart building |
| GPU inference pods | 10 | In-house DC — Tier 3 + Tier 4 |
| **U_eff** | **(200×1.0) + (500×0.2) + (10×7.0) = 370** | 200 + 100 + 70 = 370 |
| AIW | 12.0 Mbps per load unit | Full multimodal: STT + LLM + screen + RAG + fraud + burst |
| CS | 4.5 | DPDP + PCI DSS + high-risk traffic + proprietary AI models |
| LL | 4.5 | Latency-sensitive voice AI + fraud detection (~25ms budget) |
| Availability | 99.9% required | Triple-path WAN + in-house DC |
| **IS numerator** | **370 × 12.0 × 4.5 × 4.5 = 89,910** | Fixed — used in all campus calculations |

!!! warning "CS = 4.5 and LL = 4.5 — architecture implications"
    CS = 4.5 means data cannot leave the enterprise network without full DLP inspection. LL = 4.5 means the RTT budget is approximately 25ms — impossible over any cloud WAN path from India. Both values mandate in-house DC inference for real-time AI workloads. These are not preferences — they are hard constraints.

---

## B8 — Campus Access Switch Uplinks (25G, 100 agents per switch)

### What is B here?

The 25G uplink (or port-channel) from each campus access switch to the campus core distribution layer. Each switch serves 100 agents plus 250 IoT devices. The 99.9% availability requirement mandates dual uplinks.

### Per-switch U_eff calculation

```
Scope: 100 agents + 250 IoT per switch (half of campus total)
U_eff_per_switch = (100 × 1.0) + (250 × 0.2) = 100 + 50 = 150
Per-switch numerator = 150 × 12.0 × 4.5 × 4.5 = 36,450
```

### Calculation — Single 25G uplink

```
B   = 25,000 Mbps  (25G uplink)
A   = 0.97         (dedicated campus fabric uplink)

IS  = 36,450 / (25,000 × 0.97)
IS  = 36,450 / 24,250
IS  = 1.50   ← MONITOR

Failover (this is also the failover IS — single link must carry full load):
IS  = 1.50 — acceptable but tight
```

### Calculation — Dual 25G port-channel (recommended)

```
Effective B = 50,000 Mbps  (dual 25G LACP port-channel)
A           = 0.97

IS  = 36,450 / (50,000 × 0.97)
IS  = 36,450 / 48,500
IS  = 0.75   ← OPTIMAL

Failover (one 25G link fails, other carries full 150-unit load):
IS  = 36,450 / (25,000 × 0.97) = 1.50  ← Monitor — service maintained
```

**Recommendation: Dual 25G port-channel.** IS = 0.75 normal, IS = 1.50 failover. Mandatory for 99.9% availability — dual uplinks ensure a single link failure does not push IS above 3.

### Why not 10G uplinks for campus?

```
10G uplink comparison:
IS = 36,450 / (10,000 × 0.97) = 3.75  ← UPGRADE REQUIRED

10G access uplinks are insufficient for a 100-agent campus floor with
full multimodal AI at AIW = 12 Mbps. Minimum 25G required.
```

### Bandwidth consumed at B8

```
Actual AI traffic per switch = 150 × 12.0 = 1,800 Mbps = 1.8 Gbps
Plus east-west traffic (GPU pod → agents): approximately 600 Mbps additional
Total: ~2.4 Gbps per switch uplink

Utilisation on 25G: 2.4 / 25 = 9.6% (single link)
Utilisation on 50G PC: 2.4 / 50 = 4.8% (normal operation)
```

---

## B9 — Campus Core to In-House DC (100G internal fabric)

### What is B here?

The 100G link from the campus core switch to the in-house data centre housing the GPU inference pods. All AI inference traffic — agent assist, STT, fraud detection — flows through this link from agents to GPUs and back. This is the internal AI fabric path.

### Calculation

```
Scope: Full campus (all 370 load units use the DC)
U_eff = 370, Numerator = 89,910
B   = 100,000 Mbps  (100G dedicated internal link)
A   = 0.99           (dedicated dark fibre, local DC, no contention)

IS  = 89,910 / (100,000 × 0.99)
IS  = 89,910 / 99,000
IS  = 0.91   ← OPTIMAL

Actual bandwidth:    370 × 12.0 = 4,440 Mbps = 4.4 Gbps
Utilisation:         4.4 / 100 = 4.4%  (95.6% spare capacity)
At full burst (×2.5): 11 Gbps / 100G = 11% — still well within optimal
```

**IS = 0.91 — Optimal.** The core-to-DC link is never the AI bottleneck. 95.6% spare capacity.

### Why dual 100G?

Not for IS — single 100G is more than sufficient. Dual 100G is for availability:

```
Dual 100G port-channel:
IS = 89,910 / (200,000 × 0.99) = 0.45  ← over-provisioned
```

Add a second 100G only if the 99.9% availability requirement demands that the DC link survives a fibre cut. For most campus designs, dual 25G port-channels (50G aggregate) to the DC are sufficient.

!!! tip "Don't over-invest in B9"
    The internal DC fabric is never the bottleneck. Upgrade investment should go to WAN circuits and edge AI infrastructure, not to the internal 100G fabric. A single 100G link to the in-house DC is architecturally sound even at 2× the campus load.

---

## B5 — MPLS 10G WAN (Primary Campus WAN)

### What is B here?

The 10G MPLS Committed Information Rate (CIR) from campus to cloud regions and other enterprise sites. MPLS provides a guaranteed SLA and managed QoS — A = 0.92.

### IS sensitivity to AIW on this link

The key variable is not the MPLS circuit size but how much AI traffic crosses it. This depends entirely on MCP tiering.

| AIW sent to cloud (Mbps) | CS on cloud | LL on cloud | IS on MPLS 10G | Status |
|--------------------------|------------|------------|----------------|--------|
| 12.0 — all cloud, no edge AI | 4.5 | 4.5 | **9.77** | Blocker |
| 6.0 — 50% workloads edge | 3.5 | 3.5 | **4.26** | Upgrade needed |
| 3.0 — 75% workloads edge | 2.5 | 2.5 | **1.52** | Monitor |
| 2.0 — MCP Tier 1/2 only | 2.0 | 2.0 | **0.32** | Optimal |
| 1.0 — heavy edge AI | 1.5 | 1.5 | **0.09** | Optimal |

### Post-MCP calculation (production design)

```
Cloud-only workloads (Tier 1/2): report gen + screen analytics
AIW_cloud = 2.0 Mbps per agent
CS_cloud  = 2.0 (non-PII, non-regulated cloud queries)
LL_cloud  = 2.0 (batch tolerant, 200ms acceptable)

IS_MPLS = (370 × 2.0 × 2.0 × 2.0) / (10,000 × 0.92)
IS_MPLS = 2,960 / 9,200
IS_MPLS = 0.32   ← OPTIMAL

WAN traffic reduction:  12.0 → 2.0 Mbps/agent = 83% less WAN traffic
Cloud egress reduction: 100% → 18% of total AI flows
```

### MPLS QoS configuration

Because MPLS supports end-to-end QoS with provider enforcement, configure these DSCP markings for cloud-bound traffic:

```
Class           DSCP    Queue    Max share    AI function
─────────────────────────────────────────────────────────
RAG queries     CS4     High     20%          Knowledge base
Analytics       CS3     Medium   35%          Sentiment, batch
Report gen      CS2     Medium   25%          Document AI
Model sync      CS1     Low      10%          Off-peak only
Background      BE      Default   5%          Unclassified
```

!!! warning "MPLS QoS passthrough"
    Verify with your MPLS provider that DSCP markings are honoured end-to-end. Some providers re-mark traffic at the provider edge. Request the provider's DSCP-to-class mapping and confirm AI traffic (CS4 and above) receives the promised latency treatment.

---

## B6 — Internet 5G ISP (Secondary Campus WAN)

### What is B here?

A 5G ISP link (fibre-connected 5G infrastructure, not cellular) providing up to 5 Gbps. Used as the active-active secondary path alongside MPLS in the SD-WAN design. A = 0.72 — shared internet medium, no end-to-end SLA.

### Normal operation (active-active with MPLS)

```
Cloud traffic only (post-MCP):
U_eff=370, AIW=2.0, CS=2.0, LL=2.0

Internet 5G ISP alone (B=5,000, A=0.72):
IS = (370 × 2.0 × 2.0 × 2.0) / (5,000 × 0.72)
IS = 2,960 / 3,600
IS = 0.82   ← OPTIMAL

SD-WAN aggregate (MPLS 10G + Internet 5G, A=0.85):
IS = 2,960 / (15,000 × 0.85)
IS = 2,960 / 12,750
IS = 0.23   ← OPTIMAL
```

### Failover scenario: MPLS fails

```
Internet 5G ISP carries entire cloud AI load alone:
IS = 0.82   ← OPTIMAL

Service is fully maintained. IS does not exceed threshold even in failover.
This confirms the 99.9% availability design is valid for cloud-bound AI.
```

### What the internet path cannot do

The internet (B6) cannot carry LL = 4 or LL = 5 workloads even at IS = 0.82, because the RTT constraint is violated regardless of bandwidth:

```
RTT to nearest cloud (Mumbai AWS): 8–15ms
+ Firewall/LB: 5ms
+ Inference in cloud: 25–40ms
+ Return path: 8–15ms
Total RTT: 46–75ms

LL = 4 budget: 31ms
LL = 5 budget: 20ms

Cloud AI via internet fails LL = 4 and LL = 5 on physics, not bandwidth.
These workloads must run in the in-house DC regardless of WAN bandwidth.
```

---

## B7 — 5G Cellular Backup (Tertiary Emergency Path)

### What is B here?

A 5G cellular modem providing realistic sustained throughput of 300–600 Mbps (theoretical maximum 1+ Gbps, derated for enterprise planning). A = 0.60 — wireless medium, shared tower infrastructure, no enterprise SLA.

### Emergency failover calculation

```
Assumptions for emergency mode:
- Both MPLS and internet fail simultaneously (extremely rare)
- 50% of agents remain active: U_eff = 185
- Only cloud analytics traffic (Tier 1/2): AIW = 2.0, CS = 2.0, LL = 2.0

5G at 500 Mbps sustained:
IS = (185 × 2.0 × 2.0 × 2.0) / (500 × 0.60)
IS = 1,480 / 300
IS = 4.93   ← UPGRADE ZONE — acceptable for emergency window

5G at 1 Gbps (good signal):
IS = 1,480 / 600
IS = 2.47   ← MONITOR — acceptable emergency mode

Critical AI (fraud detect, agent assist):
→ Running from in-house DC — ZERO WAN dependency
→ These continue at full performance regardless of 5G status
```

### Availability mathematics

```
MPLS availability:     99.5%  → outage probability: 0.005
Internet availability: 99.2%  → outage probability: 0.008
5G cellular:           99.8%  → outage probability: 0.002

Triple-path combined outage = 0.005 × 0.008 × 0.002 = 0.00000008
Availability = 1 - 0.00000008 = 99.9999%

Requirement: 99.9%
Achieved:    99.9999%  ← exceeds by 1,000×
```

The triple-path design (MPLS + Internet + 5G) with in-house DC edge AI far exceeds the 99.9% requirement. The 5G cellular modem is the insurance policy, not the operational path.

### 5G cellular configuration for SD-WAN

```
SD-WAN policy for 5G:
  Priority:           3 (tertiary — only when both other paths fail)
  Trigger:            Both MPLS and internet fail simultaneously
  Traffic allowed:    CS1–CS3 only (analytics, reports, non-time-critical)
  Traffic blocked:    EF, CS5, CS4 (these run from in-house DC anyway)
  Scheduler:          No model sync on 5G (too slow, too expensive)
  Max link usage:     80% of 5G capacity
```

---

## Summary: campus IS across all layers

| Layer | B value | A | IS (all-cloud naive) | IS (optimised) | Bottleneck? |
|-------|---------|---|---------------------|----------------|-------------|
| B8 — Access uplink (single 25G) | 25G | 0.97 | 1.50 | 1.50 | No |
| B8 — Access uplink (dual 25G PC) | 50G | 0.97 | 0.75 | 0.75 | No |
| B9 — Core to DC 100G | 100G | 0.99 | 0.91 | 0.91 | No |
| B5 — MPLS 10G | 10G | 0.92 | **9.77** | 0.32 | Yes (solved by MCP) |
| B6 — Internet 5G ISP | 5G | 0.72 | **24.9** | 0.82 | Yes (solved by MCP) |
| B7 — 5G cellular | 500M | 0.60 | — | 2.47 | Emergency only |

The LAN and internal DC fabric are always fine. The WAN fails without MCP tiering. MCP tiering — not bandwidth upgrades — is the solution.
