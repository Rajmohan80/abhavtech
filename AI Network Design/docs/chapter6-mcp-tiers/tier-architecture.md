# MCP Tier Architecture

The four-tier MCP model places AI inference at the location that satisfies latency and compliance requirements at the lowest cost and network overhead.

## The four tiers

### Tier 1 — Cloud frontier (hyperscaler)

| Attribute | Value |
|-----------|-------|
| Placement | AWS, Azure, GCP — any region |
| Model size | Any (API access — no local deployment) |
| LL served | LL 1–2 (200–500 ms budget) |
| CS served | CS 1–3 (non-PII, non-regulated or lightly regulated) |
| Latency to India | 8–60 ms depending on region |
| Typical workloads | Complex reasoning, batch reports, non-PII queries, summarisation |
| Network implication | All AI traffic transits WAN to cloud — highest WAN cost |

**When to use:** Any AI workload that tolerates > 100 ms response time and does not involve PII or regulated data. Report generation, non-real-time analytics, general knowledge queries, content creation.

**When NOT to use:** LL = 3 or higher, CS = 4 or 5, any DPDP/HIPAA/PCI regulated data.

---

### Tier 2 — Regional edge hub (city-level colocation)

| Attribute | Value |
|-----------|-------|
| Placement | City-level colocation (Mumbai, Delhi, Hyderabad DCs) |
| Model size | 7B–13B parameter models |
| LL served | LL 2–3 (80–200 ms budget) |
| CS served | CS 1–4 |
| Latency to enterprise | 5–20 ms (local metro circuit) |
| Typical workloads | RAG retrieval, sentiment analysis, summarisation, moderate PII |
| Network implication | WAN traffic stays within metro — low latency, manageable cost |

**When to use:** Workloads requiring sub-100 ms response but not sub-50 ms. RAG knowledge base queries, sentiment scoring, batch inference for analytics. Can handle moderate PII if the colo facility has appropriate compliance controls.

**When NOT to use:** LL = 4 or 5, CS = 5, any data that must not leave the enterprise network boundary.

**Infrastructure needed at hub:**
- GPU server (A10G or similar) — 2–4 GPU per hub
- NVMe local storage for model weights
- 10G uplink to enterprise MPLS or SD-WAN

---

### Tier 3 — Campus edge AI (on-site server)

| Attribute | Value |
|-----------|-------|
| Placement | On-site server room at each enterprise campus |
| Model size | 3B–7B quantised (INT4/INT8) |
| LL served | LL 3–4 (31–80 ms budget) |
| CS served | CS 1–5 (data never leaves site) |
| Latency to agent | 2–8 ms (LAN only) |
| Typical workloads | Agent assist, STT processing, PII workloads, DPDP-regulated data |
| Network implication | No WAN traffic for these workloads — WAN IS drops dramatically |

**When to use:** Any LL = 4 workload. Any workload where data residency (DPDP) requires processing on enterprise premises. Real-time voice AI, agent coaching, PII-containing AI assist.

**When NOT to use:** LL = 5 (sub-20 ms) — Tier 3 typically delivers 5–15 ms LAN latency; for some LL = 5 workloads, the inference time alone exceeds the budget.

**Infrastructure needed at campus:**
- GPU appliance or 1U GPU server (NVIDIA L4 or A30)
- 4–8 GPU for 500-agent site
- NVMe-oF storage or local NVMe for fast model load
- 25G LAN uplink to campus core switch
- Out-of-band management for remote GPU health monitoring

---

### Tier 4 — On-prem GPU / FPGA (data centre)

| Attribute | Value |
|-----------|-------|
| Placement | Enterprise data centre — Mumbai, on-premises |
| Model size | Custom SLM, FPGA-optimised models |
| LL served | LL 4–5 (20–31 ms budget) |
| CS served | Any CS including CS = 5 |
| Latency to application | 1–5 ms (DC LAN) |
| Typical workloads | Fraud detection, financial transaction AI, HFT, autonomous systems |
| Network implication | Zero WAN — completely isolated from internet/cloud paths |

**When to use:** Any LL = 5 workload. Any PCI DSS or HIPAA workload that cannot leave the enterprise data centre. Fraud detection, real-time financial decision AI, healthcare diagnostic AI.

**When NOT to use:** When cost cannot be justified — Tier 4 requires CAPEX investment in GPU hardware, specialised GPU networking (NVLink, InfiniBand), and dedicated operations staff.

**Infrastructure needed at DC:**
- High-performance GPU cluster (A30, A100, or H100 class)
- GPU-to-GPU NVLink for multi-GPU inference
- InfiniBand or 100G RoCEv2 for inter-GPU communication
- NVMe-oF storage fabric for model weights
- Dedicated GPU operations team or managed GPU service

---

## Tier selection quick reference

```
LL = 5                     → Tier 4 (on-prem, mandatory)
LL = 4 AND CS ≥ 4          → Tier 3 (campus, mandatory)
LL = 4 AND CS ≤ 3          → Tier 3 (campus, latency forces it)
LL = 3 AND CS ≤ 4          → Tier 2 (regional hub)
LL ≤ 2 AND CS ≤ 3          → Tier 1 (cloud, optimal cost)
LL ≤ 2 AND CS = 4 or 5     → Tier 3 (compliance forces it, even if latency allows cloud)
```

---

## Traffic split after correct MCP tiering

For a typical 1,200-agent enterprise bank (the case study example):

| Tier | Workloads routed | Traffic share | WAN impact |
|------|-----------------|--------------|-----------|
| Tier 1 — Cloud | Report gen, non-PII queries | 18% | Full WAN cost |
| Tier 2 — Regional hub | RAG, sentiment, analytics | 27% | Metro circuit only |
| Tier 3 — Campus edge | Agent assist, STT, PII | 41% | Zero WAN |
| Tier 4 — On-prem DC | Fraud detection, PCI | 14% | Zero WAN |

**Result:** 55% of traffic (Tier 3 + Tier 4) generates zero WAN load. Cloud WAN traffic drops from 100% to 18%. IS on the WAN path drops by approximately 82%.
