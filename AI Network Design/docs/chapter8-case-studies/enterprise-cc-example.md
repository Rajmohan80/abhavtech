# Case Study — Bharatiya Fintech Bank

Bharatiya Fintech Bank (BFB) is a Tier-1 Indian bank deploying an AI-augmented contact centre across four sites. All customer data is subject to the DPDP Act. The bank is migrating from a legacy Avaya platform to Cisco Webex Contact Centre with AI overlays including agent assist, fraud detection, and a RAG-powered knowledge base.

## Enterprise profile

| Attribute | Value |
|-----------|-------|
| Total agents | 1,200 |
| AI inference pods (total) | 48 |
| IoT / edge sensors | 4,500 |
| Daily AI API calls | 2.8 million |
| Regulatory scope | DPDP Act + PCI DSS |
| AI platform | Cisco Webex CC + custom LLM overlay |

## Site breakdown

| Site | Role | Agents | Pods | WAN link | Current BW |
|------|------|--------|------|----------|------------|
| Mumbai HQ | Primary CC + AI hub | 500 | 20 | MPLS + Internet | 10 Gbps |
| Delhi Regional | Secondary CC | 350 | 14 | MPLS | 5 Gbps |
| Hyderabad Tech | AI dev + inference | 250 | 10 | SD-WAN | 5 Gbps |
| Chennai Branch | Lightweight CC | 100 | 4 | SD-WAN | 1 Gbps |

---

## Step 1 — U_eff per site

IoT devices distributed across sites: Mumbai 2,000, Delhi 1,200, Hyderabad 900, Chennai 400.

### Mumbai HQ

```
U_eff = (500 × 1.0) + (0 × 3.5) + (2000 × 0.2) + (20 × 7.0)
      = 500 + 0 + 400 + 140
      = 1,040
```

(AI bots = 0 in this example — bots are counted under the inference pods)

### Delhi Regional

```
U_eff = (350 × 1.0) + (0 × 3.5) + (1200 × 0.2) + (14 × 7.0)
      = 350 + 0 + 240 + 98
      = 688
```

### Hyderabad Tech

```
U_eff = (250 × 1.0) + (0 × 3.5) + (900 × 0.2) + (10 × 7.0)
      = 250 + 0 + 180 + 70
      = 500
```

### Chennai Branch

```
U_eff = (100 × 1.0) + (0 × 3.5) + (400 × 0.2) + (4 × 7.0)
      = 100 + 0 + 80 + 28
      = 208
```

---

## Step 2 — AIW

BFB's AI workload per agent: STT (0.3) + LLM assist (1.5) + screen analytics (3.0) + RAG (1.8) = 6.6 Mbps × burst 1.8 = **11.88 Mbps ≈ 12 Mbps**

Consistent across all sites (same AI platform).

---

## Step 3 — CS scoring

BFB handles customer PII, is subject to DPDP, faces public API exposure via mobile banking, uses proprietary fine-tuned models, and is PCI DSS in scope:

```
PII handling:          1.0
Regulatory scope:      1.0 (DPDP + PCI)
Public exposure:       1.0 (internet-facing APIs)
Model sensitivity:     0.5 (fine-tuned open model)
Financial data:        1.0 (PCI in scope)
CS = 4.5
```

CS overhead: 4.5 → approximately 52% overhead.  
**Adjusted AIW = 12.0 × 1.52 = 18.24 Mbps** (used in IS formula via the CS multiplier, not separately).

---

## Step 4 — LL

BFB's most latency-critical workload is real-time fraud detection (LL = 5, 20ms budget). Voice AI and agent assist require LL = 4 (31 ms budget). This determines the site architecture.

---

## Step 5 — IS calculation (naive, all-cloud)

### Mumbai HQ — naive

```
IS = (1,040 × 12 × 4.5 × 4.5) / (10,000 × 0.90)
   = 252,720 / 9,000
   = 28.1    ← Critical blocker
```

### Delhi Regional — naive

```
IS = (688 × 12 × 4.5 × 4.0) / (5,000 × 0.85)
   = 148,608 / 4,250
   = 35.0    ← Critical blocker
```

### Hyderabad Tech — naive

```
IS = (500 × 12 × 3.5 × 3.5) / (5,000 × 0.80)
   = 73,500 / 4,000
   = 18.4    ← Critical blocker
```

### Chennai Branch — naive

```
IS = (208 × 12 × 3.0 × 2.5) / (1,000 × 0.75)
   = 18,720 / 750
   = 24.9    ← Critical blocker
```

All four sites fail. The entire AI project is blocked on current infrastructure.

---

## Step 6 — MCP tier assignment

Apply routing logic to each workload:

| Workload | LL | CS | Route | WAN traffic? |
|----------|----|----|-------|-------------|
| Fraud detection | 5 | 4.5 | Tier 4 — Mumbai DC GPU | No |
| Agent assist (STT + LLM) | 4 | 4.5 | Tier 3 — campus edge | No |
| Speech-to-text | 4 | 4.5 | Tier 3 — campus edge | No |
| RAG knowledge base | 3 | 2.0 | Tier 2 — Hyderabad hub | Metro only |
| Sentiment analysis | 2 | 2.0 | Tier 2 — Hyderabad hub | Metro only |
| Report generation | 1 | 1.0 | Tier 1 — cloud | Yes |
| Screen analytics | 2 | 1.5 | Tier 1 — cloud | Yes |

**WAN-bound AIW (Tier 1 only):** Report gen (0.3) + screen analytics (2.0) = 2.3 Mbps × 1.4 burst = **3.22 Mbps per agent**  
**Cloud CS:** 1.5 (non-PII workloads only)  
**Cloud LL:** 2.0 (batch tolerant)

---

## Step 7 — IS recalculated post-MCP tiering

### Mumbai HQ — post-MCP

```
IS = (1,040 × 3.22 × 1.5 × 2.0) / (10,000 × 0.90)
   = 10,046 / 9,000
   = 1.12    ← Monitor (optimal for the WAN path)
```

### Delhi Regional — post-MCP

```
IS = (688 × 3.22 × 1.5 × 2.0) / (5,000 × 0.85)
   = 6,638 / 4,250
   = 1.56    ← Monitor
```

### Hyderabad Tech — post-MCP

```
IS = (500 × 3.22 × 1.5 × 2.0) / (5,000 × 0.80)
   = 4,830 / 4,000
   = 1.21    ← Monitor
```

### Chennai Branch — post-MCP

```
IS = (208 × 3.22 × 1.5 × 2.0) / (1,000 × 0.75)
   = 2,005 / 750
   = 2.67    ← Monitor (borderline)
```

MCP tiering alone — before any bandwidth upgrade — brings all four sites from "critical blocker" to "monitor."

---

## Step 8 — PUO analysis

| Site | IS (post-MCP) | U_eff | PUO | Status |
|------|--------------|-------|-----|--------|
| Mumbai HQ | 1.12 | 1,040 | 0.0011 | Balanced |
| Delhi Regional | 1.56 | 688 | 0.0023 | Balanced |
| Hyderabad Tech | 1.21 | 500 | 0.0024 | Balanced |
| Chennai Branch | 2.67 | 208 | 0.0128 | Balanced (tight) |

All sites are in the balanced zone. Chennai has the least headroom.

---

## Step 9 — Required infrastructure changes

### To enable Tier 3 (campus edge AI) at all sites

| Item | Mumbai | Delhi | Hyderabad | Chennai |
|------|--------|-------|-----------|---------|
| Campus GPU pods | 4× NVIDIA L4 | 3× NVIDIA L4 | 2× NVIDIA L4 | 1× NVIDIA L4 |
| NVMe local storage | 4 TB | 3 TB | 2 TB | 1 TB |
| LAN uplink to pods | 25G | 25G | 25G | 10G |

### To enable Tier 4 (fraud detection) at Mumbai DC

| Item | Specification |
|------|-------------|
| GPU cluster | 2× NVIDIA A30 (active-active) |
| GPU networking | NVLink + 100G RoCEv2 |
| Storage | NVMe-oF array, 10 TB |

### Bandwidth changes required

| Site | Current BW | B_required (post-MCP) | Action |
|------|-----------|----------------------|--------|
| Mumbai | 10 Gbps | 3.9 Gbps | No upgrade needed — 10G is sufficient |
| Delhi | 5 Gbps | 2.6 Gbps | No upgrade needed |
| Hyderabad | 5 Gbps | 1.9 Gbps | No upgrade needed |
| Chennai | 1 Gbps | 0.9 Gbps | Marginal — recommend upgrade to 2G for growth buffer |

**Key insight:** After MCP tiering, zero WAN bandwidth upgrades are required at HQ, Delhi, or Hyderabad. The entire IS problem was solved by architecture (routing workloads to the correct tier), not by buying more bandwidth.

---

## Summary — BFB AI network design

| Metric | Before design | After design | Improvement |
|--------|--------------|-------------|-------------|
| Mumbai IS | 28.1 | 1.12 | 96% reduction |
| Delhi IS | 35.0 | 1.56 | 96% reduction |
| Hyderabad IS | 18.4 | 1.21 | 93% reduction |
| Chennai IS | 24.9 | 2.67 | 89% reduction |
| WAN upgrades needed | 4 sites | 0–1 sites | 100% cost avoidance |
| Cloud WAN traffic | 100% | 18% | 82% reduction |
| Fraud detection latency | 85 ms (cloud) | 11 ms (on-prem) | 87% improvement |
| DPDP compliance | Impossible | Achieved | PII never leaves site |

The total infrastructure investment required is campus-edge GPU servers and a Tier 4 on-prem cluster — all CAPEX. No WAN contract changes needed at three of four sites.
