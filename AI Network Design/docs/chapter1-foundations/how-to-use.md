# How to Use This Workbook

This workbook is a **sequential calculation guide**. Each step produces a numeric output that feeds directly into the next step. Skipping any step produces an incorrect result downstream.

## Step sequence

Work through the nine steps in order for each site or network segment you are designing.

### Step 1 — U_eff: Effective user load

**What it produces:** The true network load unit count, accounting for AI bots, IoT devices, and GPU pods — not just headcount.

**Why it matters:** An enterprise with 500 agents and 20 GPU inference pods has a U_eff of 640, not 500. That 28% gap propagates through every subsequent calculation.

**Feeds into:** AIW (Step 2), IS formula (Step 6), bandwidth formula (Step 5).

---

### Step 2 — AIW: Average AI workload per user

**What it produces:** The average Mbps consumed per effective load unit, accounting for multi-modal AI streams and burst behaviour.

**Why it matters:** Enterprise AI is never a single stream. Agent assist alone combines speech-to-text (0.3 Mbps), LLM inference (1.5 Mbps), and screen analytics (3 Mbps). The sum, multiplied by a burst factor, is the true AIW.

**Feeds into:** Bandwidth formula (Step 5), IS formula (Step 6).

---

### Step 3 — CS: Cybersecurity risk factor

**What it produces:** A score from 1 to 5 representing security and compliance overhead on AI traffic, which maps to additional bandwidth consumption (5% to 70%).

**Why it matters:** A DPDP-regulated AI contact centre running PII data has CS = 4.5. At 50% overhead, a 10 Gbps provisioned link delivers only 6.7 Gbps of effective AI capacity. Ignoring CS causes systematic underprovisioning.

**Feeds into:** IS formula (Step 6).

---

### Step 4 — LL: Low-latency factor

**What it produces:** A score from 1 to 5 representing the latency requirement of the AI workloads, and the RTT budget in milliseconds.

**Why it matters:** LL is the most architecturally consequential variable. LL = 4 means a 31ms RTT budget — impossible to achieve over a cloud WAN path. This forces campus-edge AI deployment. LL = 5 forces on-premises GPU with zero WAN traversal.

**Feeds into:** IS formula (Step 6), MCP tier routing (Step 8).

---

### Step 5 — B: Bandwidth provisioning

**What it produces:** The minimum and recommended bandwidth in Mbps for every AI-carrying link — WAN, core, and internet uplink.

**Why it matters:** This is the number that goes to procurement. It includes burst headroom, a utilisation safety margin (never run AI links above 70%), and model sync overhead as a separate calculation.

**Feeds into:** IS formula (Step 6), gap analysis (Step 9).

---

### Step 6 — IS: Impact Score (the gate)

**What it produces:** A single dimensionless index of network stress under AI load. IS = 1 is perfectly balanced. IS > 3 requires an upgrade plan. IS > 10 is a deployment blocker.

**Why it matters:** IS synthesises all five variables into one go/no-go metric. Present this number to leadership. If IS > 10, the project will fail at scale — not might fail.

**Feeds into:** PUO (Step 7), upgrade gap (Step 9).

---

### Step 7 — PUO: Per-user output

**What it produces:** IS divided by U_eff. A per-user fairness metric that shows whether each agent or system is receiving their fair share of network capacity.

**Why it matters:** PUO > 2 means individual agents experience AI tool lag and timeouts. AI adoption collapses at PUO > 2 because agents stop using tools that feel broken.

**Feeds into:** Upgrade priority (Step 9).

---

### Step 8 — MCP tier routing

**What it produces:** An assignment of each AI workload to the correct inference tier (Cloud, Regional Edge, Campus Edge, or On-Prem GPU) based on LL and CS requirements.

**Why it matters:** Correct tiering reduces cloud-bound WAN traffic by 65–85%. This is the primary justification for campus-edge AI investment — eliminating WAN latency from the inference path reduces both IS and cost simultaneously.

**Feeds into:** Revised B calculation (reduced cloud WAN requirement), upgrade plan.

---

### Step 9 — Gap analysis and upgrade roadmap

**What it produces:** The bandwidth deficit at each site, an AI Readiness Score (ARS out of 100), and a phased upgrade priority list.

**Why it matters:** ARS must reach 70 or above before any AI workload goes live. The three-phase upgrade roadmap sequences work so that Phase 1 (blockers) is complete before a pilot begins.

---

## Running the calculations

### For a single site

Run all nine steps once for that site. Repeat for each additional site.

### For a multi-site enterprise

Run Steps 1–4 independently per site (each site has different U_eff, AIW, CS, LL). Use the same formulas but different inputs. Steps 5–9 produce per-site outputs that feed the upgrade priority ranking.

### For a phased AI rollout

Run the calculations at the planned deployment headcount, not current headcount. If you are deploying AI to 100 agents today but 500 within 18 months, size for 500. Network upgrades take 90–180 days. Plan ahead.

---

## Notation conventions

| Symbol | Meaning |
|--------|---------|
| U_eff | Effective load units (calculated, not raw headcount) |
| AIW | Average AI Workload in Mbps per load unit |
| CS | Cybersecurity risk factor, dimensionless (1–5) |
| LL | Low-latency factor, dimensionless (1–5) |
| B | Provisioned bandwidth in Mbps |
| A | Adjustment factor, dimensionless (0.5–1.0) |
| IS | Impact Score, dimensionless |
| PUO | Per-User Output, dimensionless |
| BW | Bandwidth |
| RTT | Round-trip time in milliseconds |
| MCP | Multi-Cloud Platform (inference tier architecture) |

!!! note
    All bandwidth values in this workbook are in **Mbps** unless explicitly marked as Gbps. Convert as needed: 1 Gbps = 1,000 Mbps.
