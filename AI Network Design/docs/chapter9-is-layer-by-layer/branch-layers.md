# Branch Site — IS Calculations at Every Layer (B1 to B4)

## Branch site profile

| Parameter | Value | Notes |
|-----------|-------|-------|
| Human agents | 100 (50 per access switch) | Two switches: Sw-A and Sw-B |
| AI bots / pods | 0 | No local GPU — all inference cloud or campus-routed |
| IoT sensors | 50 | Floor sensors, presence detection |
| **U_eff** | **(100×1.0) + (50×0.2) = 110** | 100 agents + 50 IoT |
| AIW | 6.8 Mbps per load unit | STT 0.3 + LLM 1.5 + screen 3.0 + RAG 1.8, × burst 1.8 |
| CS | 3.0 | PII, DPDP partial scope, moderate compliance |
| LL | 3.0 | Agent assist required — 80ms RTT budget |
| WAN | Single internet SD-WAN | No MPLS — internet-only branch |
| **IS numerator** | **110 × 6.8 × 3.0 × 3.0 = 6,732** | Fixed — used in all branch layer calculations |

---

## B1 — Agent Access Port (1G switch port)

### What is B here?

The physical 1G (1,000 Mbps) Ethernet port on the access switch where a single agent's PC connects. This represents the bandwidth available to exactly one agent on their own dedicated port.

### Calculation

```
Scope: 1 agent on this port (U = 1)
B   = 1,000 Mbps  (1G access port)
A   = 1.00        (dedicated port, zero contention)

IS  = (1 × 6.8 × 3.0 × 3.0) / (1,000 × 1.00)
IS  = 61.2 / 1,000
IS  = 0.007

PUO = 0.007 / 1 = 0.007  (142× headroom per agent)
```

### Verdict

**IS = 0.007 — Optimal.** A single agent uses 0.7% of a 1G access port. Access ports are almost never the AI bottleneck under any normal deployment scenario.

!!! note "When B1 can become a concern"
    B1 only matters if multiple high-bandwidth devices share a single port via an unmanaged switch (for example, an agent PC, an AI camera, and an IoT hub all connected through a dumb 8-port switch plugged into one access port). In that case, sum all device AIWs and recalculate. Otherwise, ignore B1 — move directly to B2.

---

## B2 — Access Switch Uplink (10G uplink, 50 agents per switch)

### What is B here?

The 10G trunk from each access switch to the branch core. Each of the two access switches (Sw-A and Sw-B) carries 50 agents plus 25 IoT devices. IS is calculated per-switch, not for the whole branch.

### Calculation — 10G uplink (modern)

```
Scope: 50 agents + 25 IoT per switch
U_eff = (50 × 1.0) + (25 × 0.2) = 55  (per-switch)
B   = 10,000 Mbps  (10G uplink)
A   = 0.97         (dedicated uplink, campus fabric)

IS  = (55 × 6.8 × 3.0 × 3.0) / (10,000 × 0.97)
IS  = 3,366 / 9,700
IS  = 0.347   ← OPTIMAL

Bandwidth consumed: 55 × 6.8 = 374 Mbps  (3.7% of 10G)
PUO = 0.347 / 55 = 0.006  (excellent per-user headroom)
```

**IS = 0.347 — Optimal.** Even at peak burst (×2.5 = 935 Mbps), the 10G uplink has 90% spare capacity.

### Calculation — Legacy 1G uplink (warning)

```
B   = 1,000 Mbps  (legacy 1G uplink)
A   = 0.95

IS  = 3,366 / (1,000 × 0.95)
IS  = 3,366 / 950
IS  = 3.54   ← UPGRADE REQUIRED
```

!!! danger "Legacy 1G access uplinks — the hidden bottleneck"
    IS = 3.54 on a legacy 1G uplink means agents will experience consistent AI assist degradation. This is the most common hidden bottleneck in branch AI deployments. The fix is replacing 1G SFP transceivers with 10G SFP+ modules — often a zero-hardware-cost upgrade if the access switch supports SFP+. Check your Catalyst 2960X, 3850, or 9300 specifications.

### Redundancy for B2

For 99.9% availability, access uplinks must be dual:

```
Dual 10G port-channel (active-active):
Effective B = 20,000 Mbps  (both links carrying traffic)
IS = 3,366 / (20,000 × 0.97) = 0.173  ← Optimal

Failover (one link fails, other carries full 55-unit load):
IS = 3,366 / (10,000 × 0.97) = 0.347  ← Still optimal
```

Dual 10G uplinks in LACP port-channel: IS stays optimal in both normal and failover state.

---

## B3 — Branch Core Switch to SD-WAN Edge

### What is B here?

The physical circuit from the branch core switch to the SD-WAN appliance, which connects to the internet. This is where all 100 agents' traffic converges onto a single pipe for the first time. This is the classic branch AI bottleneck.

### IS sensitivity to circuit size

```
Fixed parameters: U_eff = 110, Numerator = 6,732, A = 0.70 (shared internet)

B = 100 Mbps   → IS = 6,732 / (100 × 0.70)   = 6,732 / 70    = 96.2  CATASTROPHIC
B = 200 Mbps   → IS = 6,732 / (200 × 0.70)   = 6,732 / 140   = 48.1  BLOCKER
B = 500 Mbps   → IS = 6,732 / (500 × 0.70)   = 6,732 / 350   = 19.2  BLOCKER
B = 1,000 Mbps → IS = 6,732 / (1,000 × 0.70) = 6,732 / 700   =  9.6  UPGRADE REQ
B = 2,000 Mbps → IS = 6,732 / (2,000 × 0.70) = 6,732 / 1,400 =  4.8  UPGRADE REQ
B = 3,206 Mbps → IS = 6,732 / (3,206 × 0.70) = 6,732 / 2,244 =  3.0  TARGET
B = 5,000 Mbps → IS = 6,732 / (5,000 × 0.70) = 6,732 / 3,500 =  1.9  MONITOR
```

**B_required for IS = 3.0:**

```
B_required = 6,732 / (3.0 × 0.70) = 6,732 / 2.1 = 3,206 Mbps ≈ 3.2 Gbps
```

**IS = 96.2 at 100 Mbps — Catastrophic.** A 100M branch internet circuit supports approximately 1 AI agent, not 100.

### The better answer: branch edge AI

Instead of upgrading the WAN to 3.2 Gbps, deploy a small GPU appliance at the branch (Tier 3 campus-edge AI). This routes LL = 3–4 workloads locally, reducing WAN AIW from 6.8 to 2.0 Mbps:

```
With branch edge AI (AIW on WAN = 2.0 Mbps, CS = 1.5 (non-PII cloud), LL = 2.0):
U_eff=110, AIW=2.0, CS=1.5, LL=2.0

B = 1,000 Mbps (1G circuit), A = 0.70:
IS = (110 × 2.0 × 1.5 × 2.0) / (1,000 × 0.70)
IS = 660 / 700
IS = 0.94   ← OPTIMAL
```

**A 1G internet circuit with branch edge AI achieves IS = 0.94. No 3.2G WAN needed.**

### Cost comparison

| Approach | Monthly WAN cost | One-time CAPEX | IS achieved |
|----------|-----------------|----------------|-------------|
| Upgrade WAN to 3.2G | High recurring | None | 3.0 |
| Deploy branch GPU box + 1G WAN | Low recurring | Medium one-time | 0.94 |
| Dual 2G SD-WAN (no edge AI) | Medium recurring | None | 2.24 |

Branch edge AI is usually the better investment — it reduces WAN recurring cost and improves agent experience simultaneously.

---

## B4 — SD-WAN Internet Circuit (Branch WAN path to campus)

### What is B here?

The contracted bandwidth of the internet circuit(s) used by SD-WAN to reach campus AI services and cloud inference APIs. For a dual-path SD-WAN deployment, B is the aggregate of both circuits.

### IS by circuit configuration

| Circuit configuration | B (Mbps) | A factor | IS (full AIW 6.8) | IS (MCP tiered 2.0) |
|-----------------------|---------|---------|-------------------|---------------------|
| Single 100 Mbps | 100 | 0.70 | **96.2 — Blocker** | 9.43 — Blocker |
| Single 200 Mbps | 200 | 0.70 | **48.1 — Blocker** | 4.71 — Upgrade |
| Single 1 Gbps | 1,000 | 0.70 | **9.60 — Blocker** | 0.94 — Optimal |
| Dual 1G SD-WAN (agg) | 2,000 | 0.75 | **4.48 — Upgrade** | 0.44 — Optimal |
| Dual 2G SD-WAN (agg) | 4,000 | 0.75 | **2.24 — Monitor** | 0.22 — Optimal |
| Dual 5G SD-WAN (agg) | 10,000 | 0.75 | 0.90 — Optimal | 0.09 — Optimal |

### Failover scenario for B4

For 99.9% availability, the surviving circuit must carry full load on its own:

```
Dual 1G SD-WAN — failover (one circuit fails):
IS on single 1G, MCP tiered: IS = 0.94  ← OPTIMAL — service maintained
IS on single 1G, full AIW:   IS = 9.60  ← BLOCKER — without edge AI

This confirms: branch edge AI is not optional for 99.9% availability.
Without it, any WAN circuit failure causes complete AI outage.
```

### Recommended design for branch

```
Primary:  Dual 1G internet (active-active SD-WAN)
Backup:   4G/5G cellular modem (SD-WAN tertiary)
Edge AI:  Small GPU appliance (NVIDIA L4 or equivalent)

IS normal (dual 1G aggregate, MCP tiered):
IS = 660 / (2,000 × 0.75) = 0.44  ← OPTIMAL

IS failover (single 1G, MCP tiered):
IS = 660 / (1,000 × 0.70) = 0.94  ← OPTIMAL

IS cellular emergency (300M, MCP tiered, 50% agents):
IS = 330 / (300 × 0.60) = 1.83   ← MONITOR — degraded but operational
```

All three scenarios maintain IS below 3. Critical AI (agent assist) runs from the local GPU box and never touches the WAN, ensuring voice AI and STT work even during complete internet outage.
