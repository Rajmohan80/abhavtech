# Chapter 3 — Risk & Latency

Two variables that most network architects underestimate — CS (security overhead) and LL (latency requirement). Both are multipliers in the IS formula. Both determine architecture decisions that cannot be solved with bandwidth alone.

## In this chapter

- [CS Security Factor](cs-scoring.md) — Score your compliance posture and calculate its bandwidth overhead
- [LL Latency Factor](ll-latency-factor.md) — Determine your RTT budget and the infrastructure tier it mandates

## Why these variables are architecture forcing functions

CS and LL are not configuration parameters. They are physical and regulatory constraints that force specific infrastructure decisions:

- **CS = 4 or 5** → A standard NGFW cannot inspect TLS 1.3 AI traffic fast enough without becoming a bottleneck. Hardware offload firewall mandatory.
- **LL = 4** → A 31ms RTT budget cannot be satisfied over a WAN path from most Indian sites to cloud regions. Campus-edge AI inference is not optional.
- **LL = 5** → A 20ms budget cannot be satisfied over any WAN. On-premises GPU inference with local data residency is the only option.

Getting CS wrong costs bandwidth. Getting LL wrong costs the entire project.
