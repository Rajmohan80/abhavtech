# Chapter 2: SD-WAN Foundation

## SD-WAN Underlay IPv6 Deployment

This chapter covers the complete SD-WAN underlay deployment across all 19 Abhavtech sites, spanning Weeks 2-5 and extending through Phase 1B advanced topics. The deployment begins with a flagship greenfield Mumbai hub implementation, followed by remaining hub migrations and branch site rollouts, concluding with advanced SD-WAN features including NAT64 troubleshooting, service-side VPN configuration, and transport-side optimizations.

---

## Chapter Contents

### Deployment Timeline

#### [Week 2: Mumbai Hub Deployment](week2-mumbai-hub-deployment.md)

**Flagship Greenfield Hub Implementation**

Week 2 establishes the Mumbai headquarters as the reference architecture for all subsequent hub deployments:

- **Day 1-2:** WAN edge router deployment (dual Catalyst 8000v in HA), transport circuit provisioning (MPLS + DIA)
- **Day 3:** vManage onboarding, template configuration, BFD/OMP setup
- **Day 4:** Service-side VPN deployment (VPN 10: corporate, VPN 20: guest, VPN 30: voice)
- **Day 5:** Validation testing, traffic cutover, baseline monitoring

**Technologies:** Cisco vManage 20.12, Catalyst 8000v, IOS-XE 17.9, dual-stack transport

#### [Week 3: Remaining Hubs Deployment](week3-remaining-hubs-deployment.md)

**Four Additional Hub Migrations**

Week 3 deploys Chennai, London, New Jersey, and Dallas hubs following the Mumbai pattern:

- **Day 1:** Chennai HQ (APAC secondary hub) — 2,500 users, MPLS + DIA transport
- **Day 2:** London HQ (EMEA primary hub) — 2,000 users, SD-WAN controller colocation
- **Day 3:** New Jersey (Americas primary hub) — 1,500 users, Azure ExpressRoute integration
- **Day 4:** Dallas (Americas secondary hub) — 600 users, GCP Cloud Interconnect integration
- **Day 5:** Inter-hub validation, full-mesh transport tunnels, OMP route propagation

**Technologies:** Same as Week 2, plus cloud onramp (Azure/GCP)

#### [Week 4-5: Branch Sites Deployment](week4-5-branch-sites-deployment.md)

**14 Branch Site Rollouts**

Weeks 4-5 deploy all 14 APAC branch sites (Bangalore, Delhi, Noida, Hyderabad, Pune, Ahmedabad, Kolkata, Jaipur, Surat, Nagpur, Chandigarh, Coimbatore, Lucknow, plus Frankfurt):

- **Week 4 (Days 1-5):** 7 branch sites — single WAN edge per site, DIA transport, hub-spoke topology
- **Week 5 (Days 1-5):** Remaining 7 branch sites — same pattern, staggered rollout

**Technologies:** Catalyst 8000v (virtual) or ISR 4000 (physical), simplified VPN config

### Advanced Topics

#### [Phase 1B: SD-WAN Advanced Topics](phase1b-sdwan-advanced-topics.md)

**Deep-Dive Configuration and Optimization**

Phase 1B covers advanced SD-WAN features deployed after base underlay is operational:

- **Application-Aware Routing:** DPI-based path selection (SaaS, voice, video optimization)
- **Service Chaining:** Traffic steering through firewalls, IPS, Umbrella SIG
- **Centralized Policy:** vManage-based data policies, app-route policies, VPN membership
- **Multi-Hop Scenarios:** Branch-to-branch direct tunnels, service-side NAT, route leaking
- **Cloud OnRamp:** Detailed Azure Virtual WAN and GCP interconnect patterns
- **High Availability:** VRRP/HSRP integration, BFD tuning, transport failure scenarios
- **Performance Optimization:** QoS policies, FEC, packet duplication, latency monitoring

**Technologies:** vManage policy configuration, IOS-XE data plane, BFD/OMP protocols

#### [Phase 1 Addendum: NAT64 Troubleshooting](phase1-addendum-nat64-troubleshooting.md)

**IPv6-to-IPv4 Translation Troubleshooting Guide**

Comprehensive NAT64/DNS64 configuration and troubleshooting covering:

- **NAT64 Deployment:** Stateful NAT64 on WAN edges, DNS64 configuration, well-known prefix (64:ff9b::/96)
- **Common Issues:** Packet drops, asymmetric routing, ALG failures, address pool exhaustion
- **Debugging Commands:** NAT64 translations, prefix mapping, session inspection
- **Application Compatibility:** Office 365, Salesforce, legacy apps requiring IPv4 backend
- **Performance Tuning:** NAT64 pool sizing, timeout values, session limits

**Technologies:** IOS-XE NAT64, DNS64, application layer gateways (ALGs)

---

## Deployment Architecture

**Hub-Spoke Topology:**

```
                  ┌─────────────────────────────┐
                  │   vManage Controllers       │
                  │   (London HQ Colocation)    │
                  └─────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
│  Mumbai Hub    │   │  London Hub    │   │ New Jersey Hub │
│  (APAC Main)   │   │  (EMEA Main)   │   │ (Americas Main)│
│  Site ID: 1    │   │  Site ID: 16   │   │  Site ID: 32   │
└───────┬────────┘   └───────┬────────┘   └───────┬────────┘
        │                    │                     │
    ┌───┴───┐            ┌───┴───┐            ┌───┴───┐
    │ APAC  │            │ EMEA  │            │  Amer │
    │Branches│           │Branch │            │Branches│
    │ (13)  │            │  (1)  │            │  (1)  │
    └───────┘            └───────┘            └───────┘
```

**Transport Types:**

- **MPLS:** Primary enterprise transport (low latency, guaranteed SLA)
- **DIA (Direct Internet Access):** Secondary transport (broadband, local breakout)
- **Cloud OnRamp:** Azure ExpressRoute, GCP Cloud Interconnect (hubs only)

**IPv6 Addressing:**

- **Underlay loopbacks:** 2001:db8:abv:X::/64 (where X = site ID)
- **Transport P2P links:** 2001:db8:abv:X:fe00::/64
- **Service VPNs:** 2001:db8:abv:X:VPN_ID00::/48

---

## Deliverables

By the end of Chapter 2, you will have:

✅ **5 Hub Sites** — Full dual-stack SD-WAN deployment (Mumbai, Chennai, London, NJ, Dallas)

✅ **14 Branch Sites** — Single WAN edge deployment, hub-spoke connectivity

✅ **Full-Mesh Transport** — OMP adjacencies, BFD sessions, IPsec tunnels between all hubs

✅ **Service VPNs Operational** — Corporate, guest, voice VPNs with IPv6 routing

✅ **Cloud Connectivity** — Azure/GCP integration at New Jersey and Dallas hubs

✅ **NAT64/DNS64** — IPv6-to-IPv4 translation functional for legacy app access

✅ **Advanced Features** — App-aware routing, centralized policies, service chaining configured

---

## Prerequisites

Before starting Chapter 2:

- **Chapter 1 complete** — Addressing plan finalized, IPAM configured, tooling ready
- **Transport circuits** — MPLS and DIA circuits provisioned at all 19 sites
- **vManage cluster** — Controllers deployed and reachable (recommended: London HQ colocation)
- **Catalyst 8000v licenses** — Advantage licenses for all WAN edges
- **Certificate authority** — PKI for IPsec and OMP authentication

---

## Key Concepts

**SD-WAN Overlay:**

- **OMP (Overlay Management Protocol)** — Control plane for route exchange between vManage and WAN edges
- **BFD (Bidirectional Forwarding Detection)** — Sub-second failure detection on transport tunnels
- **DTLS/TLS** — Control plane encryption between WAN edge and vManage/vSmart

**Service VPNs:**

- **VPN 0** — Transport-side (WAN interfaces, underlay connectivity)
- **VPN 512** — Management (out-of-band management interfaces)
- **VPN 10+** — Service-side VPNs (user traffic, application segments)

**NAT64 Use Cases:**

- IPv6-only client accessing IPv4-only internet services
- Dual-stack client preferring IPv6 but requiring IPv4 backend access
- Cloud workloads (Azure/GCP) with IPv6-only subnets reaching on-prem IPv4 resources

---

## Next Steps

After completing Chapter 2:

1. **Proceed to [Chapter 3: SD-Access Overlay](../chapter3-sdaccess-overlay/README.md)** — Deploy campus fabric at hub sites
2. **Baseline monitoring** — Establish normal traffic patterns for anomaly detection
3. **Document as-built** — Update network diagrams with actual IP assignments and tunnel IDs

---

**Ready to deploy?** Start with **[Week 2: Mumbai Hub Deployment →](week2-mumbai-hub-deployment.md)**
