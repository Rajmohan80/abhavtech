# PUO — Per-User Output Analysis

PUO translates the site-level IS score into the individual agent experience. Where IS tells you the network is overloaded, PUO tells you how overloaded each user is. This is the metric for the user experience and adoption conversation.

## The formula

```
PUO = IS / U_eff
```

PUO is dimensionless. Its interpretation:

- **PUO > 1** — Each user is consuming more than their fair share of network capacity. The network cannot satisfy all users simultaneously. AI tools will be unreliable.
- **PUO = 1** — Perfect balance. Each user is using exactly their fair share.
- **PUO < 1** — Each user has spare headroom. AI tools will be responsive and reliable.

---

## PUO verdict thresholds

| PUO range | Status | Agent experience | Action |
|-----------|--------|-----------------|--------|
| PUO < 0.3 | Over-provisioned | Excellent — fast, reliable AI at all times | Review if B can reduce at next renewal |
| 0.3 – 1.0 | Balanced | Good — fair share met, occasional peak moments | Maintain. Monitor trend quarterly. |
| 1.0 – 2.0 | Stressed | Degraded — agents notice AI assist delays > 2 seconds | Add bandwidth or reduce AIW via model quantisation |
| PUO > 2.0 | Overloaded | Poor — AI tools unreliable, timeouts common | Immediate: edge AI or bandwidth upgrade |

---

## What PUO reveals that IS does not

IS is a site-level metric. A site with IS = 2.5 and U_eff = 500 has PUO = 0.005 — each user has enormous headroom. A site with IS = 2.5 and U_eff = 5,000 has PUO = 0.0005 — even more headroom per user.

But consider two sites with the same IS = 6.0:

- Site A: U_eff = 200, PUO = 0.030 — 200 users are each severely overloaded
- Site B: U_eff = 6,000, PUO = 0.001 — 6,000 users each have slight overload

Both sites need IS reduction, but Site A's user experience is far more severely impacted per individual. PUO contextualises the human cost.

!!! note
    In enterprise deployments, PUO > 2.0 at any site correlates strongly with AI tool abandonment. Agents stop using AI assist when it fails more than once per session. Once abandoned, AI adoption is difficult to rebuild even after the network is fixed.

---

## Worked examples

### Example 1 — Large CC site

```
IS = 3.27, U_eff = 1,390

PUO = 3.27 / 1,390 = 0.00235
```

**Verdict:** PUO = 0.0024 — well within the balanced zone. Despite IS being slightly above the upgrade threshold, each individual user has substantial headroom. QoS and 90-day upgrade plan is appropriate; this is not an emergency.

### Example 2 — Small branch

```
IS = 16.1, U_eff = 237

PUO = 16.1 / 237 = 0.0679
```

**Verdict:** PUO = 0.068 — stressed zone. Each of the 237 users is experiencing significant overload. AI tools will time out regularly. This site requires immediate bandwidth upgrade before AI can go live.

### Example 3 — Optimised site post-upgrade

```
IS = 2.18, U_eff = 1,390

PUO = 2.18 / 1,390 = 0.00157
```

**Verdict:** PUO = 0.0016 — optimal. Each agent has 635× more capacity than their fair share demands. AI tools will be fast and reliable. This is the target state.

---

## Using PUO for capacity planning conversations

PUO provides a clear language for explaining network capacity to non-technical stakeholders:

**Technical statement:** "IS = 16.1, B_gap = 4.4 Gbps, A = 0.75"

**PUO-translated statement:** "Each of our 100 agents is asking for 16 times more from the network than it can deliver. Every AI call will queue behind 15 other calls before it is served. Agents will experience 4–8 second delays on every AI assist response."

This translation makes the business case for infrastructure investment without requiring the audience to understand IS arithmetic.

---

## PUO and the AI adoption feedback loop

```
Network undersized (IS > 10)
        ↓
PUO > 2.0 per agent
        ↓
AI tools show timeouts and lag (> 2 second responses)
        ↓
Agents stop using AI assist tools
        ↓
AI project ROI collapses
        ↓
AI investment written off
        ↓
Network never upgraded (no business case)
```

Breaking this loop requires calculating PUO before deployment and upgrading infrastructure proactively. A 3-month network upgrade delays AI go-live by 3 months. An AI project failure sets the organisation back 2–3 years.
