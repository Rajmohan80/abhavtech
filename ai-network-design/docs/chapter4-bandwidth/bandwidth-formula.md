# Bandwidth Formula

The bandwidth provisioning formula calculates the minimum and recommended bandwidth for every AI-carrying link, accounting for U_eff, AIW, burst behaviour, utilisation targets, and a safety margin.

## The formula set

```
B_minimum    = (U_eff × AIW × Peak_factor) / Link_utilisation_target

B_recommended = B_minimum × 1.5         [safety margin for AI burst]

B_per_link   = B_recommended / Number_of_parallel_uplinks

B_total      = B_recommended + Model_sync_BW
```

---

## Formula variables

| Variable | Recommended value | Rationale |
|----------|------------------|-----------|
| Peak_factor | 1.5–2.5 | AI responses burst at start; model calls spike; concurrent requests spike during peak hours |
| Link_utilisation_target | 65–70% | Never exceed 70% on AI links — burst headroom is critical |
| Safety margin | 1.5× | Absorbs unforeseen AI workloads, user growth, and model expansion |
| Parallel uplinks | 2 minimum | Resilience: AI service must survive a single-link failure |

---

## Design input table

| Input variable | Reference | Your value | Result |
|---------------|-----------|-----------|--------|
| U_eff | From Chapter 2 Step 1 | ___ | |
| AIW (Mbps/load unit) | From Chapter 2 Step 2 | ___ | |
| Peak_factor | 1.5–2.5 | ___ | |
| Link_utilisation_target | 65–70% | ___% | |
| **B_minimum (Mbps)** | = U_eff × AIW × Peak / Util | | **= ___** |
| **B_recommended (Mbps)** | = B_min × 1.5 | | **= ___** |
| Number of parallel uplinks | 2 minimum | ___ | |
| **B_per_link (Mbps)** | = B_rec / Links | | **= ___** |
| Model sync BW (Mbps) | From model sync calculation | ___ | |
| **Total to provision (Mbps)** | = B_rec + Model_sync | | **= ___** |

---

## Worked example

**Site:** Mumbai contact centre  
**Inputs:** U_eff = 1,390, AIW = 12 Mbps, Peak_factor = 1.8, Utilisation = 65%, Links = 2

```
B_minimum = (1,390 × 12 × 1.8) / 0.65
          = 30,024 / 0.65
          = 46,191 Mbps
          ≈ 46.2 Gbps

B_recommended = 46,191 × 1.5
              = 69,287 Mbps
              ≈ 69.3 Gbps

B_per_link = 69,287 / 2
           = 34,643 Mbps
           ≈ 34.6 Gbps per uplink
```

!!! danger "This is a naive all-cloud calculation"
    This example shows what happens if all 1,390 load units send their full 12 Mbps AIW to the cloud. A 69 Gbps WAN requirement is economically prohibitive. This is why MCP tier routing (Chapter 6) is critical: routing LL = 4 workloads to campus-edge AI reduces the WAN-bound AIW from 12 Mbps to approximately 2 Mbps per load unit, bringing B_recommended to ~11.5 Gbps — a practical 10G or dual-10G provisioning target.

### Revised example with MCP tiering

After routing LL = 4 workloads to campus-edge AI:

```
WAN-bound AIW (cloud traffic only): 2.0 Mbps
B_minimum = (1,390 × 2.0 × 1.8) / 0.65 = 7,700 Mbps
B_recommended = 7,700 × 1.5 = 11,550 Mbps ≈ 11.6 Gbps
B_per_link = 5,775 Mbps — a dual 10G SD-WAN path is sufficient
```

---

## WAN upgrade options comparison

| Option | Capacity | Latency | Cost (India) | Best fit |
|--------|---------|---------|-------------|---------|
| Dedicated MPLS 10G | 10 Gbps | 5–15 ms | High | Large enterprise, SLA required |
| SD-WAN dual 10G internet | 20 Gbps aggregate | 8–25 ms | Medium | Most enterprise deployments |
| SD-WAN 10G internet + 1G MPLS | 11 Gbps | 5–25 ms | Medium | Hybrid resilience |
| Dark fiber / leased line | 100 Gbps+ | < 1 ms | Very high | LL = 5 sites, campus backbone |

### Selecting the right WAN tier

Use the B_recommended value from your calculation to select a WAN tier:

```
B_recommended ≤ 1 Gbps    → 1G MPLS or 1G internet is sufficient
B_recommended 1–10 Gbps   → 10G SD-WAN or MPLS
B_recommended 10–50 Gbps  → Dual 10G or single 100G SD-WAN
B_recommended > 50 Gbps   → Dark fiber or leased line mandatory
```

---

## LAN and campus link sizing

The B formula applies to every AI-carrying link, not just WAN. Campus core and distribution links must also be sized:

### Campus core uplinks

AI-dense deployments push significant east-west traffic between access and core switches (inference pods, AI cameras, telemetry). Campus core uplinks should be sized at:

```
Core_BW = B_recommended × 1.2        [20% additional for east-west AI traffic]
```

### Access to core uplinks

Each access switch serving AI-dense areas (agent floors, inference server rooms) needs uplinks sized at:

```
Access_uplink = (Agents_on_switch × AIW × 1.8) / 0.70
```

For a 48-port access switch serving 40 AI agents at AIW = 12 Mbps:

```
Access_uplink = (40 × 12 × 1.8) / 0.70 = 864 / 0.70 = 1,234 Mbps ≈ 2 Gbps
```

A single 1G uplink is insufficient. Dual 10G uplinks in port-channel recommended for any access switch serving AI agent floors.

---

## Redundancy and growth in B calculations

### Redundancy

Active-active dual-path design requires each path to carry 100% of B_recommended in failover scenarios:

```
B_per_path = B_recommended        [not B_recommended / 2]
```

Dual 10G paths in active-active carry 20 Gbps combined normally and 10 Gbps on the surviving path during failover. Plan for the failover scenario.

### Growth planning

Apply a growth buffer to B_recommended based on your expected AI expansion timeline:

| Growth scenario | Buffer |
|----------------|--------|
| Stable deployment, no planned expansion | 1.0× (no buffer) |
| 20% user growth expected in 12 months | 1.2× |
| Active AI expansion, doubling in 18 months | 2.0× |
| Greenfield — full capacity unknown | 2.5× |

```
B_with_growth = B_recommended × Growth_buffer
```
