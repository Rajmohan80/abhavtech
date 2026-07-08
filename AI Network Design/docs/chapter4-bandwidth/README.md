# Chapter 4 — Bandwidth & QoS

Bandwidth provisioning is the output of Steps 1–4. With U_eff, AIW, CS, and LL calculated, you can now size every link in your network. This chapter also covers QoS traffic classification and model sync bandwidth — two factors that most bandwidth calculations miss.

## In this chapter

- [Bandwidth Formula](bandwidth-formula.md) — Full provisioning calculation with peak factor, utilisation target, and safety margin
- [QoS Traffic Classes](qos-traffic-classes.md) — The 6-class AI-aware QoS model with DSCP markings
- [Model Sync Bandwidth](model-sync-bandwidth.md) — Sizing the bandwidth consumed by AI model weight updates

## The core insight

Never run AI-carrying links above 70% utilisation. AI traffic is characteristically bursty — a model that normally generates 6 Mbps per user can spike to 18 Mbps for 30–60 seconds during a response burst. If the link is already at 85% average utilisation, those bursts cause tail-drop, retransmission, and inference timeouts visible to agents as AI lag.

The 70% utilisation ceiling is not conservative — it is the empirically validated threshold for predictable AI traffic behaviour on shared infrastructure.
