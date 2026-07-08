# Chapter 9 — IS Layer-by-Layer: Where Exactly Is B?

This chapter answers the most common question when applying the IS formula to a real enterprise network:

> **"Which bandwidth do I put into B — the switch port, the WAN circuit, or the internet speed?"**

The answer is: **all of them, independently**. B is not a single fixed value. It is the bandwidth of the specific link you are evaluating at that moment. The IS formula must be run once at every link where AI traffic could congest.

## In this chapter

- [Understanding B — The Multi-Layer Principle](understanding-b.md) — Why IS must be calculated at every connectivity point
- [Branch Layers B1–B4](branch-layers.md) — Full IS calculations from access port to internet circuit (100 agents, SD-WAN)
- [Campus Layers B5–B9](campus-layers.md) — Full IS calculations from access uplink to in-house DC (200 agents, MPLS + Internet + 5G)
- [WAN Path Comparison](wan-comparison.md) — MPLS vs Internet vs 5G: IS sensitivity, failover behaviour, QoS steering

## The nine bandwidth measurement points

```
Agent PC
   │
   │── B1: Access port (1G per agent)              → IS ≈ 0.007  ← never the problem
   │
Access Switch
   │
   │── B2: Access-to-Core uplink (10G)             → IS ≈ 0.35   ← fine with 10G
   │   [Legacy 1G uplink]                          → IS ≈ 3.54   ← UPGRADE NEEDED
   │
Core Switch
   │
   │── B3: Core to SD-WAN edge (100M branch)       → IS ≈ 96.2   ← CRITICAL BLOCKER
   │
SD-WAN / Router
   │
   │── B4: WAN/Internet circuit (branch)           → IS varies by circuit size
   │
   ┌─────────────────────────────────┐
   │        INTERNET / MPLS          │
   └─────────────────────────────────┘
   │
Campus SD-WAN
   │
   │── B5: MPLS 10G (campus primary)              → IS 9.77 naive → 0.32 post-MCP
   │── B6: Internet 5G ISP (campus secondary)     → IS 24.9 naive → 0.82 post-MCP
   │── B7: 5G Cellular (emergency backup)         → IS 4.93 (emergency use only)
   │
Campus Core
   │
   │── B8: Campus Access→Core 25G uplink          → IS 0.75 (dual 25G port-channel)
   │
   │── B9: Core→In-House DC 100G                  → IS 0.91 (never the bottleneck)
   │
In-House DC (Edge AI — Tier 3 + Tier 4)
```

## The headline finding

Running IS at every layer reveals a pattern that surprises most architects:

| Layer | IS (naive — all cloud) | IS (post-MCP tiering) |
|-------|----------------------|----------------------|
| Access port (B1) | 0.007 | 0.007 |
| Access uplink 10G (B2) | 0.35 | 0.35 |
| Branch WAN 100M (B3) | **96.2** | 0.94 |
| MPLS 10G (B5) | **9.77** | 0.32 |
| Internet (B6) | **24.9** | 0.82 |
| Campus DC fabric (B9) | 0.91 | 0.91 |

The LAN is always fine. The WAN always fails — but not because it is too small. It fails because all AI inference traffic is routed to the cloud when it should run locally. MCP tiering and edge AI fix IS at the WAN without touching the WAN contract.

!!! danger "The critical insight"
    Every B3–B7 failure in this design is solved by moving AI inference closer to the user, not by buying more WAN bandwidth. Architecture is the fix, not procurement.
