# Redundancy & Growth Planning

AI workloads create new resilience requirements that traditional enterprise networks are not designed for. A legacy network survives a link failure with a 30-second failover and some degraded performance. An AI contact centre with 500 agents loses ₹2–5 lakhs per minute of AI downtime during peak hours. Redundancy requirements are fundamentally different.

## Redundancy design principles for AI networks

### Principle 1 — Size each path for 100%, not 50%

In an active-active dual-path design, each path must carry the full AI load independently:

```
B_per_path = B_recommended    [NOT B_recommended / 2]
```

If B_recommended = 10 Gbps and you have two 10G paths, you normally carry 5 Gbps on each. If one path fails, the surviving path must handle 10 Gbps. Both paths must be sized for this scenario.

!!! warning "50% sizing causes AI outage on failover"
    A design that sizes each path at 50% of B_recommended will saturate the surviving path the moment failover occurs. All AI calls will fail. This is the most common enterprise AI network resilience mistake.

### Principle 2 — Failover must complete in under 10 seconds

Traditional routing failover (OSPF reconvergence) takes 30–60 seconds. During that window, all AI inference calls timeout. For AI contact centres, 30-second failover is unacceptable.

**Required failover technologies:**

| Technology | Failover time | Suitable for |
|-----------|--------------|-------------|
| BFD + OSPF | 1–3 seconds | Campus core failover |
| SD-WAN active-active | < 1 second | WAN path failover |
| BGP with BFD | 2–5 seconds | Multi-homed internet |
| FHRP (HSRP/VRRP) | 3–10 seconds | Default gateway failover |
| Campus edge AI failover | 5–15 seconds | Tier 3 pod redundancy |

### Principle 3 — AI inference pods need N+1 redundancy

A single GPU inference pod serving 500 agents is a single point of failure. If the pod fails, all 500 agents lose AI assist simultaneously. Design for N+1:

```
Minimum pods = CEIL(U_eff / Pod_capacity) + 1
```

Where Pod_capacity is the number of effective load units each pod can serve.

### Principle 4 — Model weights must be cached locally

If the model registry is cloud-hosted and the internet fails, campus-edge pods cannot load new models or restart from a cold state. Cache model weights on local NVMe storage at each site. Model cache = model size × number of production models × 2 (primary + previous version).

---

## Redundancy design worksheet

Complete for each site:

| Redundancy element | Current design | Target design | Gap |
|-------------------|---------------|--------------|-----|
| WAN paths | ___ | Active-active dual paths | ___ |
| Per-path bandwidth | ___ | B_recommended (full load) | ___ |
| WAN failover time | ___ | < 1 second (SD-WAN) | ___ |
| Campus core redundancy | ___ | Dual core switches, ECMP | ___ |
| Core failover time | ___ | < 3 seconds (BFD+OSPF) | ___ |
| Inference pod count | ___ | N+1 minimum | ___ |
| Model weight cache | ___ | Local NVMe, all models | ___ |
| NGFW redundancy | ___ | Active-active HA pair | ___ |
| DNS redundancy | ___ | Dual resolvers, anycast | ___ |

---

## Growth planning

### The 18-month rule

Enterprise AI deployments typically expand from pilot (10% of agents) to full deployment (100%) within 12–18 months. Infrastructure procured for the pilot is almost never adequate for full deployment. Plan for full deployment from day one.

**Growth-adjusted bandwidth:**

```
B_growth = B_recommended × Growth_buffer

| Timeline to full deployment | Buffer |
|-----------------------------|--------|
| No planned expansion        | 1.0×   |
| 20% growth in 12 months     | 1.2×   |
| 2× in 18 months             | 2.0×   |
| Full greenfield, unknown    | 2.5×   |
```

### AI model size growth

Models are growing in size rapidly. A deployment sized for a 7B model today may need to serve a 13B or 30B model in 18 months. Plan storage and network accordingly:

```
Model_storage_per_site = Model_size_max × Num_models × 2 (versions)
                       + 50% growth buffer
```

For a site expecting to run a 13B model (26 GB FP16) with 3 models, keeping 2 versions each, with 50% growth buffer:

```
Storage = 26 × 3 × 2 × 1.5 = 234 GB local NVMe per site
```

### U_eff growth projection

Calculate U_eff at each deployment milestone and verify IS remains below 3 at each stage:

| Milestone | H | AI | IoT | Pod | U_eff | IS at current B | Action |
|-----------|---|----|----|-----|-------|-----------------|--------|
| Today | ___ | ___ | ___ | ___ | ___ | ___ | ___ |
| 6 months | ___ | ___ | ___ | ___ | ___ | ___ | ___ |
| 12 months | ___ | ___ | ___ | ___ | ___ | ___ | ___ |
| 18 months | ___ | ___ | ___ | ___ | ___ | ___ | ___ |
| Full deployment | ___ | ___ | ___ | ___ | ___ | ___ | ___ |

---

## Scalability checklist

Before approving an AI network design, verify these scalability properties:

- [ ] B_recommended calculated at full planned deployment headcount
- [ ] Each WAN path sized to carry 100% of B_recommended independently
- [ ] Inference pod count = CEIL(U_eff / Pod_capacity) + 1 (N+1)
- [ ] Model weight storage sized for largest anticipated model × 2 versions × 1.5 growth buffer
- [ ] IS < 3 verified at full deployment U_eff, not pilot U_eff
- [ ] Core switch port density sufficient for full agent floor capacity
- [ ] QoS policy templates deployed and tested at partial load before full rollout
- [ ] SD-WAN failover tested with full AI load on surviving path
- [ ] Campus-edge AI pods tested in single-pod failure scenario
- [ ] Growth buffer applied: B_recommended × 1.5 minimum
