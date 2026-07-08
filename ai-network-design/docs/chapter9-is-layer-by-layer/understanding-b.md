# Understanding B — The Multi-Layer Principle

The IS formula has one variable for bandwidth: **B**. Most architects treat this as the WAN speed and calculate IS once. That is the mistake. B must be evaluated at every link in the path from agent to AI inference, and IS must be calculated independently at each point.

## Why one IS calculation is not enough

Consider a 500-agent site with a 10G WAN and a 100M access-to-WAN handoff:

```
IS at WAN (B = 10G): IS = 0.9  ← looks fine
IS at handoff (B = 100M): IS = 90  ← project fails here
```

A single IS calculation at the WAN link gives a false pass. The actual bottleneck is the aggregation point just before the WAN, which no one measured.

## The nine bandwidth measurement points

For the branch-to-campus design in this chapter, there are nine distinct B values, each requiring its own IS calculation.

| Point | Network location | B = what exactly | Primary concern |
|-------|-----------------|------------------|----------------|
| B1 | Agent PC to access switch | Physical port speed (1G, 2.5G, 5G) | Never a bottleneck |
| B2 | Access switch to core/distribution | Trunk uplink (1G legacy or 10G) | Hidden bottleneck on legacy 1G |
| B3 | Core switch to SD-WAN edge | Local circuit handoff (100M–1G) | Most common branch AI failure |
| B4 | SD-WAN WAN circuit | ISP contracted bandwidth (100M–10G) | Primary branch bottleneck |
| B5 | Campus MPLS circuit | Provider CIR (Committed Information Rate) | Fails without MCP tiering |
| B6 | Campus internet circuit | ISP speed (5G ISP link) | Secondary path, fails naive |
| B7 | 5G cellular backup | Wireless throughput (300–600M sustained) | Emergency only |
| B8 | Campus access to core | High-speed trunk (25G, 100G) | Fine with modern campus design |
| B9 | Core to in-house DC | Internal fabric (100G) | Never the bottleneck |

## How to apply IS at each layer

For every B point:

1. **Identify U_eff** — how many load units traverse this specific link? (Not the whole site — just the portion that crosses this link.)
2. **Use full AIW** — each load unit brings its full workload regardless of which link you measure.
3. **Use full CS and LL** — these are properties of the workload, not the link.
4. **Set B** — the physical bandwidth of this specific link.
5. **Set A** — the quality/reliability coefficient for this link type.
6. **Calculate IS** — if IS > 3, this link is a bottleneck.

```
IS_at_link = (U_eff_through_link × AIW × CS × LL) / (B_link × A_link)
```

!!! tip "U_eff scoping"
    U_eff at an access switch uplink = only the agents connected to that switch.
    U_eff at the WAN = all agents at the site (they all share the WAN).
    U_eff at the core-to-DC link = all campus agents (they all use the DC).

## A factor by link type

The A factor reflects infrastructure quality — how reliably the link delivers its rated bandwidth.

| Link type | A value | Why it is lower than 1.0 |
|-----------|---------|--------------------------|
| Internal campus LAN fibre | 0.99 | Dedicated, no contention, SLA |
| Dedicated 100G DC fabric | 0.99 | Same — pure dedicated path |
| Dual 10G/25G port-channel | 0.97 | Excellent — LACP bonded, local |
| Dedicated MPLS with SLA | 0.92–0.95 | Provider SLA, managed QoS |
| SD-WAN over managed MPLS | 0.88–0.92 | Overlay adds small overhead |
| SD-WAN dual-path (active-active) | 0.82–0.88 | Policy routing, two paths |
| Business broadband internet | 0.70–0.78 | Best-effort, shared medium |
| 5G cellular wireless | 0.55–0.65 | Variable signal, tower sharing |

## Why AIW is the same regardless of B point

A common mistake is adjusting AIW for different layers. Do not. An agent generates 6.8 Mbps of AI workload whether you are measuring at their access port or at the WAN circuit. The AIW does not change — only the number of agents (U_eff) that share that link changes.

The exception is when MCP tiering changes which traffic crosses which link:

- **Without MCP tiering:** All 6.8 Mbps per agent crosses the WAN (B4/B5/B6)
- **With MCP tiering:** Only 2.0 Mbps per agent crosses the WAN (Tier 1/2 cloud traffic only)

This is why the AIW used in WAN IS calculations changes after MCP tiering — not because AIW itself changed, but because only a subset of AI traffic now traverses the WAN link.

## The calculation sequence

Always calculate IS in this order:

```
Step A: Calculate IS at access uplinks (B2)
        → Identifies legacy 1G uplink failures immediately

Step B: Calculate IS at WAN circuit (B3/B4 branch, B5/B6 campus)
        → Always the primary bottleneck without edge AI

Step C: Calculate IS at internal DC fabric (B9)
        → Usually fine, confirms edge AI is viable

Step D: Recalculate B4/B5/B6 with MCP-tiered AIW
        → Reveals the true WAN requirement post-architecture

Step E: Run failover scenario — remove primary WAN, calculate IS on secondary
        → Confirms 99.9% availability design is sound
```
