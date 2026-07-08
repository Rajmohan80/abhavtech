# Chapter 2 — Load Analysis

Before calculating bandwidth or impact scores, you must establish the true network load. This chapter covers the two load variables: U_eff (who and what is consuming the network) and AIW (how much each load unit consumes).

## In this chapter

- [U_eff Calculation](ueff-calculation.md) — Convert headcount, AI agents, IoT devices, and GPU pods into equivalent load units
- [AIW Profiling](aiw-profiling.md) — Profile your AI workload mix and calculate per-user bandwidth demand

## Why load analysis comes first

Every downstream formula (B, IS, PUO) multiplies U_eff by AIW. An error of 20% in either value produces a 20% error in IS, which could mean the difference between IS = 2.5 (manageable) and IS = 3.0 (upgrade required). Get load analysis right first.

## Common mistakes

| Mistake | Consequence |
|---------|------------|
| Using headcount instead of U_eff | Undersizes by 20–80% on AI-heavy sites |
| Using a single stream for AIW instead of composite | Undersizes by 3–5x for full AI agent workloads |
| Not applying burst factor to AIW | Underestimates peak demand by 30–150% |
| Forgetting inference pods in U_eff | Missing 7x multiplier per pod — catastrophic for IS |
