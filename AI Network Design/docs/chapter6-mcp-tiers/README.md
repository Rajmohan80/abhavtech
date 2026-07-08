# Chapter 6 — MCP Tier Design

Multi-Cloud Platform (MCP) tier design is the architectural answer to high IS scores. By routing AI workloads to the inference tier that best matches their LL and CS requirements, you eliminate unnecessary WAN traffic, satisfy latency constraints, and reduce IS by 60–85%.

## In this chapter

- [Tier Architecture](tier-architecture.md) — The four-tier inference model and what runs where
- [Routing Logic](routing-logic.md) — Decision rules for assigning workloads to tiers

## Why MCP tiering matters to the network

Without tier design, every AI call goes to the cloud. A 500-agent site with full AI assist generates 500 × 12 Mbps = 6,000 Mbps of cloud-bound traffic. With correct MCP tiering (LL = 4 workloads on campus, LL = 2 workloads on regional edge), cloud-bound traffic drops to 500 × 2 Mbps = 1,000 Mbps. IS drops by 83%.

MCP tiering is a network design decision, not just an AI architecture decision.
