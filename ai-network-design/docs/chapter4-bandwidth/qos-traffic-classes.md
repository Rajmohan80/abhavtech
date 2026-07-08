# QoS Traffic Classes — AI-Aware 6-Class Model

Without AI-aware QoS, a 14 GB model weight update and a live voice AI call compete for the same bandwidth on the same queue. The model update wins (larger flow, more packets) and the voice AI call experiences inference timeouts. Agents see their AI assist tool fail during peak hours — exactly when they need it most.

QoS is zero-cost infrastructure work. It does not require hardware upgrades. It must be deployed before AI goes live.

## The 6-class AI QoS model

| Class | Name | DSCP marking | Priority | Typical share | AI workload |
|-------|------|-------------|---------|--------------|------------|
| 1 | Real-time AI | EF (46) | Strict priority | 30–40% | Live STT, fraud detection, voice AI |
| 2 | AI agent assist | CS5 (40) | High | 20–25% | LLM responses, agent coaching |
| 3 | RAG / knowledge | CS4 (32) | Medium-high | 15–20% | Vector DB retrieval, document search |
| 4 | Analytics / batch | CS3 (24) | Medium | 10–15% | Sentiment, reporting, scheduled inference |
| 5 | Model sync | CS1 (8) | Low — off-peak only | 5–10% | Weight updates, fine-tune sync |
| 6 | Background | BE (0) | Best effort | 3–5% | Untagged enterprise traffic |

---

## Why strict priority for real-time AI

DSCP EF (Expedited Forwarding) places AI inference traffic in a strict priority queue. This means:

- Real-time AI packets are always served before any other traffic class
- No queuing delay is introduced by lower-priority traffic
- Jitter is minimised, keeping RTT within the LL = 4 budget

!!! warning "EF queue bandwidth cap"
    Strict priority queues must be bandwidth-capped to prevent lower-priority traffic starvation. Cap the EF queue at 40% of link bandwidth. If real-time AI traffic exceeds 40%, it indicates the link is undersized, not a QoS configuration issue.

---

## DSCP marking — where to apply

DSCP markings should be applied at the first trust boundary — the access switch where the AI device or server connects. Re-marking at every hop degrades performance. Trust the DSCP marking from trusted devices (AI inference pods, agent endpoints) and apply policy-maps at the WAN edge.

### Device trust model

| Device type | Trust DSCP from device? | Action |
|-------------|------------------------|--------|
| AI inference pod (server) | Yes | Trust device DSCP |
| Agent PC / thin client | No — users can self-mark | Overwrite DSCP based on destination IP / app |
| IP phone | Yes | Trust CS3 or higher |
| IoT sensor | No | Mark CS1 at access switch |
| Unknown endpoint | No | Mark BE at access switch |

### SD-WAN QoS integration

For SD-WAN deployments, QoS policy must be replicated at the SD-WAN appliance to apply to the underlay transport path:

```
SD-WAN policy:
  Real-time AI (DSCP EF)  → Preferred path: lowest latency link
  Agent assist (CS5)      → Preferred path: lowest latency link
  RAG / knowledge (CS4)   → Any path with SLA < 80 ms
  Model sync (CS1)        → Cheapest path, off-peak scheduling
```

---

## QoS configuration design worksheet

### Step 1 — Classify your AI traffic

| Traffic type | Source IP range | Destination | DSCP to apply |
|-------------|----------------|------------|--------------|
| Real-time inference | Inference pod subnet | All | EF (46) |
| Agent LLM calls | Agent VLAN | AI API endpoint | CS5 (40) |
| RAG queries | Agent VLAN | Vector DB IP | CS4 (32) |
| Analytics | Analytics server | Cloud analytics | CS3 (24) |
| Model sync | Inference pod | Model registry | CS1 (8) |

### Step 2 — Define queuing policy per interface

For each WAN-facing or core-facing interface:

```
Policy-map AI-ENTERPRISE-QOS
  class REALTIME-AI          (EF)   → Priority queue, 40% max BW
  class AGENT-ASSIST         (CS5)  → CBWFQ 25% guaranteed
  class RAG-KNOWLEDGE        (CS4)  → CBWFQ 18% guaranteed
  class ANALYTICS-BATCH      (CS3)  → CBWFQ 12% guaranteed
  class MODEL-SYNC           (CS1)  → CBWFQ 5%, off-peak scheduler
  class class-default        (BE)   → CBWFQ 5% best effort
```

### Step 3 — Model sync scheduling

Model weight updates should never run during business hours. Configure a time-based policy:

```
Model sync window: 02:00–06:00 local time
Maximum model sync rate: 50% of CS1 queue (2.5% of total link)
Trigger: After-hours scheduler or network automation script
```

---

## QoS and WAN provider SLA

If your WAN is MPLS with a provider SLA, verify the provider's DSCP mapping:

| Your DSCP | Provider class | Provider guarantee |
|----------|---------------|-------------------|
| EF (46) | Real-time | Sub-20ms jitter |
| CS5 (40) | Business critical | < 50 ms |
| CS4 (32) | Business | < 80 ms |
| CS3 (24) | Standard | Best-effort with priority |
| CS1 (8) | Scavenger | No guarantee |

Some providers re-mark DSCP at the provider edge. Confirm DSCP passthrough or mapping before relying on provider QoS for AI traffic.

---

## Verifying QoS effectiveness

After QoS deployment, validate with these checks:

1. Generate test AI traffic during simulated peak load
2. Simultaneously generate a large model sync transfer (to fill CS1 queue)
3. Measure RTT for real-time AI (EF class) traffic during the test
4. RTT should remain within LL budget; model sync should not impact real-time AI

Tools: Cisco IP SLA, IPERF3 with DSCP marking, NetFlow with class-based counters, Cisco ThousandEyes for end-to-end AI path measurement.
