# Upgrade Roadmap

The three-phase upgrade roadmap sequences infrastructure work so that Phase 1 blockers clear in 90 days (enabling an AI pilot), Phase 2 optimisations complete in 180 days (enabling full production), and Phase 3 delivers an AI-native network within 12 months.

## Phase 1 — Critical blockers (0–90 days)

!!! danger "No AI workload — not even a pilot — should run until Phase 1 is complete"

### Item 1 — WAN upgrade

**Why it is a blocker:** A 1–2G legacy WAN saturates at 147–294 simultaneous AI agents (1,000 Mbps / 6.8 Mbps per agent). Even a 50-agent pilot needs 340 Mbps dedicated. A model sync transfer saturates a 1G WAN entirely for 15 minutes.

**What to upgrade to:**
- Minimum: 10G SD-WAN with dual internet paths
- Recommended: SD-WAN dual 10G internet + 1G MPLS fallback
- For large enterprise: dedicated 10G MPLS with SLA

**Effort:** 60–90 days (ISP provisioning timeline driven). Start this first.

---

### Item 2 — Core switch refresh

**Why it is a blocker:** Legacy Catalyst 6500 / Nexus 5K switching ASICs introduce 5–15 µs per hop. Across 5 hops in a typical campus fabric: 25–75 µs additional RTT. More critically, these switches cannot forward 25G or 100G frames required for AI server connectivity.

**What to upgrade to:**
- Catalyst 9600 series or Nexus 9K (cut-through ASIC, < 1 µs per hop)
- 25G or 100G uplinks to AI inference pods
- ECMP across dual core for redundancy

**Effort:** 30–60 days. Requires maintenance window for cutover.

---

### Item 3 — NGFW upgrade

**Why it is a blocker:** Legacy ASA 5500 cannot inspect TLS 1.3. AI APIs universally use TLS 1.3. DLP cannot scan AI responses for PII leakage on a legacy firewall. DPDP compliance is impossible without AI traffic visibility.

**What to upgrade to:**
- Palo Alto PA-3400 or Cisco Firepower 4200 (20–40 Gbps TLS 1.3 inspect)
- Active-active HA pair (2 devices per site)
- AI App-ID for DSCP classification of AI traffic

**Effort:** 45–60 days. Includes policy migration from legacy firewall.

---

### Item 4 — 6-class QoS policy deployment

**Why it is a blocker:** Without QoS, a 14 GB model sync transfer during business hours will saturate the WAN and drop live AI inference calls. This is a configuration-only change — no hardware required.

**What to deploy:**
- DSCP marking: EF for real-time AI, CS5 for agent assist, CS4 for RAG, CS3 for analytics, CS1 for model sync
- Policy-maps on all WAN-facing and core interfaces
- SD-WAN SLA profile with DSCP-based path steering
- Model sync scheduled to off-peak window (02:00–06:00)

**Effort:** 5–10 days. Highest ROI per effort of any Phase 1 item.

---

### Item 5 — Anycast DNS with local resolvers

**Why it is a blocker:** AI APIs resolve new endpoints constantly. A 200 ms DNS lookup adds 200 ms to every single AI call — consuming the entire LL = 3 budget before a single byte of inference traffic is sent.

**What to deploy:**
- Cisco Umbrella or equivalent with local DNS resolver cache
- Anycast addressing for internal DNS (multiple resolvers, same IP, closest serves)
- Pre-populated AI API endpoint cache (OpenAI, Anthropic, Azure AI, Google AI)
- Target: < 5 ms DNS resolution for all AI API FQDNs

**Effort:** 10–15 days.

---

## Phase 2 — AI performance optimisation (90–180 days)

Phase 2 items bring IS from the "upgrade required" zone (3–10) to the "monitor" zone (1–3) and unlock full production AI capability.

### Item 6 — SD-WAN with AI-aware path steering

Deploy intelligent WAN path selection based on AI traffic class:

- Real-time AI (DSCP EF) → lowest-latency path, strict SLA
- Agent assist (CS5) → low-latency path
- Model sync (CS1) → cheapest path, off-peak scheduling
- Automatically reroute when path SLA degrades (latency > 50 ms, loss > 0.1%)

**Business impact:** A factor improves from 0.70 (shared internet) to 0.90 (managed SD-WAN). This alone reduces IS by 22%.

---

### Item 7 — Access switch refresh (AI-dense areas only)

Replace 1G-uplink access switches at agent floors and AI server rooms. Not all access switches need replacement — prioritise:

- Agent floors with > 24 AI-assist users per switch
- Server rooms hosting inference pods
- Areas with AI cameras or IoT sensor density > 50 devices per switch

**Target:** Catalyst 9300 with mGig ports (2.5G/5G PoE++) and dual 10G uplinks in port-channel.

**Do not replace:** Non-AI areas, administrative offices, meeting rooms. This controls cost while delivering the performance improvement where it matters.

---

### Item 8 — Streaming telemetry

Replace 5-minute SNMP polling with 10-second streaming telemetry:

- gNMI / gRPC streaming from Catalyst 9K / Nexus 9K
- Ingest into Cisco DNA Center, PRTG, or Grafana
- IS score calculation dashboard — alert when IS > 3 at any site
- AI traffic class monitoring — verify QoS effectiveness in real time

**Why it matters:** AI burst events last 30–90 seconds. SNMP at 5-minute intervals misses them entirely. You cannot debug AI performance problems you cannot see.

---

### Item 9 — VXLAN micro-segmentation for AI workloads

Move from VLAN-based flat segmentation to VXLAN overlays for AI workloads:

- Separate overlay segments for: inference pods, model storage, agent AI traffic, management
- SGT (Security Group Tags) on Catalyst fabric for dynamic policy
- Prevents lateral movement from a compromised AI endpoint to production agent VLANs

**Compliance impact:** VXLAN micro-segmentation is required for PCI DSS network segmentation attestation in AI-adjacent environments.

---

### Item 10 — L7 load balancer for inference routing

Deploy Envoy Proxy, F5 BIG-IP Next, or Nginx Plus:

- gRPC and HTTP/2 aware (required for modern AI APIs)
- Route by URL path to inference tier: /api/assist → campus pod, /api/rag → regional hub
- Health-check each tier independently — automatic failover between tiers
- Session affinity for long-running inference streams

---

## Phase 3 — AI-native network (180–365 days)

Phase 3 delivers a self-optimising, self-healing network that treats AI workloads as first-class citizens.

### Item 11 — Wi-Fi 6E / Wi-Fi 7 for mobile AI agents

Deploy 6 GHz band Wi-Fi for mobile agent devices and AI IoT:

- Wi-Fi 6E: 1.2 GHz of clean spectrum, BSS coloring, OFDMA
- Wi-Fi 7: Multi-link operation, sub-5 ms wireless latency
- Target: Cisco 9176 or equivalent APs at AI-dense areas
- Enable mobile AI agent apps to meet LL = 3–4 requirements wirelessly

---

### Item 12 — PTP IEEE 1588 time synchronisation

Replace NTP (±50 ms accuracy) with hardware PTP boundary clocks:

- Catalyst 9K supports hardware PTP timestamping
- Accuracy: ±1 µs — required for AI telemetry correlation and distributed tracing
- Enables nanosecond-accuracy log alignment across all AI inference pods
- Required for ML training pipeline log correlation in multi-site deployments

---

### Item 13 — NVMe-oF storage fabric

Replace FC SAN with NVMe over Fabrics (RoCEv2) for model weight serving:

- Model cold-start time: 45 seconds (SAN) → 3 seconds (NVMe-oF)
- 7B model load: 45 s → < 2 s on NVMe-oF
- Required 25G or 100G RoCEv2 fabric between storage and GPU pods
- Enables rapid model switching between inference workloads

---

### Item 14 — AIOps and IS monitoring dashboard

Deploy continuous IS monitoring with predictive alerting:

- Calculate IS per site every 60 seconds from streaming telemetry
- Alert when IS > 3 (upgrade needed) or IS > 5 (immediate action)
- Predict saturation 15–30 minutes ahead using traffic trend analysis
- Integrate with ITSM for automatic incident creation on IS threshold breach

---

## Upgrade cost summary

| Item | Phase | One-time cost (INR estimate) | Monthly recurring | IS impact |
|------|-------|---------------------------|------------------|-----------|
| WAN upgrade (10G SD-WAN) | 1 | ₹5–15L setup | ₹8–20L/month | IS −60–70% |
| Core switch refresh | 1 | ₹35–80L | Nil | IS −10–15% |
| NGFW upgrade | 1 | ₹25–60L | ₹3–8L/year support | Compliance |
| QoS policy | 1 | Nil | Nil | IS effective −20% |
| Anycast DNS | 1 | ₹2–5L | ₹1–2L/month | Latency −200ms |
| SD-WAN AI steering | 2 | ₹10–25L licences | ₹5–10L/year | A: +0.15–0.20 |
| Access switch refresh | 2 | ₹20–50L/floor | Nil | Edge AI capable |
| Streaming telemetry | 2 | ₹5–12L licences | ₹2–5L/year | Visibility |
| VXLAN micro-seg | 2 | ₹8–20L | ₹2–4L/year | Compliance |
| L7 load balancer | 2 | ₹10–30L | ₹3–8L/year | Tier routing |
| NVMe-oF storage | 3 | ₹40–120L | Nil | Cold-start fix |
| Wi-Fi 6E/7 | 3 | ₹15–40L/site | Nil | Wireless AI |
| PTP time sync | 3 | ₹3–8L | Nil | ML accuracy |
| AIOps dashboard | 3 | ₹5–20L | ₹5–15L/year | Observability |
