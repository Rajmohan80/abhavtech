# AIW — Average AI Workload Profiling

AIW (Average AI Workload) is the average Mbps consumed per effective load unit. It is a composite value — the sum of all concurrent AI data streams per user or agent, multiplied by a burst factor to account for peak demand.

## The formula

```
AIW = Σ(active_stream_Mbps) × Burst_factor
```

Where:

- **active_stream_Mbps** = Bandwidth of each concurrent AI data stream (STT, LLM, screen, RAG, etc.)
- **Burst_factor** = Peak multiplier accounting for simultaneous request spikes (typically 1.3–2.5)

---

## AI stream reference table

### Identify which streams are active at your site

| AI stream / function | Typical Mbps | Burst factor | Notes |
|---------------------|-------------|-------------|-------|
| Speech-to-text (STT) | 0.3–0.5 | 1.5 | Constant during call, codec dependent |
| LLM inference (text only) | 0.5–2.0 | 1.3 | Token bursts at response start |
| Agent assist (STT + LLM) | 2.0–4.0 | 1.6 | Combined, near-constant during agent work |
| Screen share / desktop analytics | 2.0–6.0 | 1.8 | Resolution and compression dependent |
| Full AI agent (STT + LLM + screen) | 5.0–8.0 | 1.8 | Enterprise CC standard baseline |
| Vision API / image analysis | 5–25 | 2.0 | Varies with image resolution |
| Video analytics (edge camera) | 8–50 | 2.2 | H.264/265 compressed + inference overlay |
| RAG / vector DB retrieval | 1–5 | 1.4 | Embedding query + document retrieval |
| Fraud detection (real-time) | 0.5–2.0 | 1.5 | Transaction stream, low-latency critical |
| Multi-modal AI (all combined) | 10–40 | 2.5 | Enterprise maximum planning figure |

---

## Design input table

### Step 1 — Inventory your active AI streams

For each AI function deployed at your site, enter the expected Mbps from the reference table above (or from vendor specifications).

| AI stream active at your site | Mbps (reference) | Present? | Your Mbps |
|------------------------------|-----------------|---------|----------|
| Speech-to-text (STT) | 0.3–0.5 | Y / N | ___ |
| LLM / agent assist | 1.5–3.0 | Y / N | ___ |
| Screen analytics | 2.0–5.0 | Y / N | ___ |
| Vision / camera AI | 5–25 | Y / N | ___ |
| RAG / knowledge base | 1–5 | Y / N | ___ |
| Fraud / real-time inference | 0.5–2.0 | Y / N | ___ |
| Other (specify): ___ | ___ | Y / N | ___ |
| **Subtotal streams** | | | **= ___** |
| × Burst factor | 1.3–2.5 | | **× ___** |
| **Final AIW** | | | **= ___ Mbps** |

### Step 2 — Choose your burst factor

Select the burst factor that matches your workload profile:

| Burst factor | When to use |
|-------------|------------|
| 1.3 | Low-burst workload — text-only LLM, batch analytics |
| 1.5 | Moderate burst — STT + LLM combined |
| 1.8 | Standard enterprise CC — STT + LLM + screen share |
| 2.0 | Vision-heavy or high-frequency inference |
| 2.2 | Video analytics with edge inference |
| 2.5 | Full multi-modal AI — use only for maximum planning figure |

!!! tip "When in doubt, use 1.8"
    For a standard enterprise contact centre with AI agent assist, 1.8 is the validated burst factor based on observed Webex CC traffic profiles.

---

## Worked examples

### Example 1 — Webex CC with full AI agent assist

**Deployment:** 500-agent contact centre with speech-to-text, LLM agent assist, screen analytics, and RAG knowledge base.

Active streams per agent:

```
STT:          0.30 Mbps
LLM assist:   1.50 Mbps
Screen share: 3.00 Mbps
RAG queries:  1.80 Mbps
─────────────────────────
Subtotal:     6.60 Mbps

× Burst factor: 1.8

AIW = 6.60 × 1.8 = 11.88 Mbps ≈ 12 Mbps per load unit
```

### Example 2 — Manufacturing floor with AI vision inspection

**Deployment:** 300 floor operators + 150 AI cameras for defect detection.

Active streams per operator / device:

```
AI camera analytics:  15.00 Mbps (per camera, 1080p H.264)
LLM assist (operator): 2.00 Mbps
Telemetry:             0.10 Mbps
─────────────────────────────────
Subtotal:             17.10 Mbps

× Burst factor: 2.0

AIW = 17.10 × 2.0 = 34.2 Mbps per load unit
```

!!! warning "High AIW = higher IS sensitivity"
    AIW appears linearly in the IS formula. Doubling AIW doubles IS. On a vision-heavy site (AIW = 34 Mbps), even a moderate U_eff will produce a very high IS. Edge inference (moving AI processing on-premise) is the primary lever for reducing AIW — it cuts the bandwidth consumed on the WAN path.

### Example 3 — Text-only AI chatbot deployment (low AIW scenario)

**Deployment:** 200 customer service agents using text-only LLM chatbot assist.

```
LLM text query/response: 1.20 Mbps
Telemetry:               0.05 Mbps
─────────────────────────────────────
Subtotal:                1.25 Mbps

× Burst factor: 1.3

AIW = 1.25 × 1.3 = 1.625 Mbps ≈ 1.6 Mbps per load unit
```

Text-only LLM deployment has a dramatically lower AIW. This is the easiest AI workload to introduce to an existing network — even a 1 Gbps WAN can support 400+ agents at this AIW (assuming no other constraints).

---

## The effect of edge inference on AIW

One of the most powerful levers for reducing AIW is deploying AI inference on-campus (Tier 3 or Tier 4 in the MCP model). When inference runs locally:

- The LLM query does not traverse the WAN
- Only the user prompt (small text) and AI response (small text) cross the WAN — the heavy computation happens locally
- Effective AIW on the WAN drops from 6–12 Mbps to 0.5–1.5 Mbps per agent

**Before edge AI (all cloud inference):**
```
AIW (WAN) = 6.60 × 1.8 = 11.88 Mbps
```

**After edge AI (campus inference for LLM, cloud for RAG):**
```
WAN streams: STT result (0.05 Mbps) + RAG (1.80 Mbps) = 1.85 Mbps
AIW (WAN) = 1.85 × 1.5 = 2.78 Mbps
```

**WAN AIW reduction: 77%.** This is why MCP tier design (Chapter 6) has a direct impact on bandwidth provisioning requirements.

---

## Validating AIW with actual measurements

Where possible, validate AIW against measured data from:

- **NetFlow / sFlow** — Capture AI API endpoint traffic and compute average Mbps per agent during peak hours
- **Cisco DNA Center / PRTG / Datadog** — Per-application throughput reports
- **Cloud provider dashboards** — AWS CloudWatch, Azure Monitor, GCP Cloud Monitoring all report API egress in bytes

Measured AIW during a pilot is the most reliable input for production sizing. Apply a 20% growth buffer on top of measured AIW for final calculations.
