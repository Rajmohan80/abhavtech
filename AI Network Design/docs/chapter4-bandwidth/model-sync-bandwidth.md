# Model Sync Bandwidth

AI model weight updates are a hidden bandwidth consumer that most network designs ignore. A 7B parameter model weighs approximately 14 GB. Syncing this model to four campus-edge inference sites weekly generates 56 GB of scheduled transfer — equivalent to 519 Mbps of sustained bandwidth for 15 minutes, or 1.3 Mbps sustained across the business day if spread evenly.

## The formula

```
Model_sync_BW (Mbps) = Model_size_GB × Updates_per_day × 8000 / 86400
```

Where:

- **Model_size_GB** = Size of the model weights in gigabytes
- **Updates_per_day** = How many times per day the model is updated (use fractional values for weekly updates: 1/7 = 0.143)
- **8000** = Conversion factor (GB to Mbps: 1 GB = 8 Gb = 8,000 Mb; / 86,400 seconds in a day)

---

## Model size reference

| Model type | Parameters | Approximate size | Format |
|-----------|-----------|-----------------|--------|
| Small language model (SLM) | 1–3B | 2–6 GB | FP16 |
| Mid-size LLM | 7B | 14 GB | FP16 |
| Mid-size LLM (quantised) | 7B INT4 | 3.5 GB | INT4 |
| Large LLM | 13B | 26 GB | FP16 |
| Large LLM (quantised) | 13B INT4 | 6.5 GB | INT4 |
| Vision model | Varies | 5–20 GB | FP16 |
| RAG embedding model | 0.3B | 0.6 GB | FP16 |
| Fraud detection (fine-tuned) | 1B | 2 GB | INT8 |

!!! tip "Model quantisation reduces sync bandwidth by 75%"
    A 7B model in FP16 (14 GB) becomes 3.5 GB in INT4. For sites with constrained WAN links, quantisation is as much a network decision as an AI performance decision. Quantised models also load faster from storage (model cold-start time drops from 45 seconds to under 10 seconds).

---

## Update frequency reference

| Update scenario | Updates per day | Notes |
|----------------|----------------|-------|
| Static deployment — no updates | 0 | Model frozen after deployment |
| Weekly refresh | 0.143 (1/7) | Most common production scenario |
| Daily fine-tune sync | 1.0 | Active learning / RLHF pipeline |
| Multiple daily updates | 2–4 | CI/CD AI pipeline, rapid iteration |
| Delta patching only | 0.01–0.05 | Only weight deltas transferred, not full model |

---

## Design input table

| Variable | Reference | Your value | Result |
|----------|-----------|-----------|--------|
| Model size (GB) | See reference table | ___ GB | |
| Number of inference sites receiving sync | Count | ___ | |
| Updates per day (use 0.143 for weekly) | Frequency | ___ | |
| **Model_sync_BW per site (Mbps)** | = GB × Upd × 8000 / 86400 | | **= ___ Mbps** |
| **Total sync BW (all sites)** | = per_site × sites | | **= ___ Mbps** |

---

## Worked examples

### Example 1 — Weekly 7B model update to 4 sites

```
Model_size   = 14 GB (7B FP16)
Updates/day  = 0.143 (weekly)
Sites        = 4

Per site:  14 × 0.143 × 8000 / 86400 = 0.185 Mbps sustained
All sites: 0.185 × 4 = 0.74 Mbps sustained
```

**Verdict:** Negligible. At 0.74 Mbps sustained, model sync for weekly updates is invisible on a 10G WAN. No special scheduling required.

### Example 2 — Daily 13B model update to 4 sites

```
Model_size   = 26 GB (13B FP16)
Updates/day  = 1.0 (daily)
Sites        = 4

Per site:  26 × 1.0 × 8000 / 86400 = 2.41 Mbps sustained
All sites: 2.41 × 4 = 9.64 Mbps sustained
```

**Verdict:** Manageable, but must be scheduled off-peak. At 9.64 Mbps, daily model sync represents 0.1% of a 10G WAN — not a concern by itself, but it adds to the total B_total calculation.

### Example 3 — Multiple daily updates, 13B quantised, 10 sites

```
Model_size   = 6.5 GB (13B INT4 quantised)
Updates/day  = 3.0 (CI/CD pipeline)
Sites        = 10

Per site:  6.5 × 3.0 × 8000 / 86400 = 1.80 Mbps sustained
All sites: 1.80 × 10 = 18.0 Mbps sustained
```

**Verdict:** At 18 Mbps sustained, this is now a meaningful bandwidth consumer, but quantisation reduced it from 72 Mbps (non-quantised, same scenario). Still manageable on a 10G WAN but should be in the B_total calculation.

### Example 4 — Burst calculation for scheduled transfer

Rather than sustained bandwidth, you may want to calculate the transfer time if model sync is delivered in a burst during a 4-hour maintenance window:

```
Burst_window        = 4 hours = 14,400 seconds
Transfer_size       = 14 GB = 112 Gb = 112,000 Mb
Required_bandwidth  = 112,000 / 14,400 = 7.78 Mbps

For 4 sites: 4 × 7.78 = 31.1 Mbps during the window
```

**Verdict:** 31.1 Mbps for the maintenance window. CS1 queue should be configured to allow 50 Mbps during the maintenance window, reverting to 5 Mbps cap during business hours.

---

## Model distribution architecture

For multi-site deployments, a hub-and-spoke model distribution architecture reduces WAN consumption:

```
Cloud model registry
        |
   Central hub (HQ)   ← Receives full model from cloud
        |
   ─────────────────
   |        |       |
Branch 1  Branch 2  Branch 3   ← Receive from HQ, not cloud
```

Benefits:
- Cloud egress cost reduced (only HQ pays cloud-to-WAN egress)
- Regional distribution uses faster, cheaper private WAN paths
- Hub caches model — branches can restart sync if interrupted

CDN caching (using on-prem reverse proxy caching the model registry) further reduces per-site transfer time when multiple sites pull the same model version.
