# Chapter 3: SD-Access Overlay

## Campus Fabric IPv6 Deployment

This chapter covers the comprehensive deployment of Cisco SD-Access (SDA) fabric across hub campus sites using Catalyst Center (DNAC) for centralized management and ISE for policy enforcement. The deployment transforms traditional campus networks into automated, software-defined fabric architecture with IPv6-native LISP/VXLAN overlay, delivering micro-segmentation, consistent policy, and streamlined provisioning.

---

## Chapter Contents

### [Phase 2: SD-Access Overlay Deployment](phase2-sdaccess-overlay-deployment.md)

**Core Fabric Implementation**

Phase 2 deploys SD-Access fabric at the five hub sites (Mumbai, Chennai, London, New Jersey, Dallas), establishing the foundation for automated campus networking:

**Fabric Roles:**

- **Control Plane Nodes:** LISP Map Server/Resolver (redundant pair per site)
- **Border Nodes:** Campus-to-WAN integration, VRF-to-VPN mapping, external connectivity
- **Edge Nodes:** Access layer switches, endpoint registration, policy enforcement
- **Fabric Wireless:** Catalyst 9800 WLC integration, fabric mode APs

**Deployment Phases:**

**Phase 2.1 — Fabric Foundation (Weeks 13-14):**

- Catalyst Center (DNAC) 2.3.x deployment and integration with ISE 3.2
- Fabric site creation, IP address pool allocation (IPv6 /64 per VLAN)
- Control plane node provisioning (2x Catalyst 9300/9500 per site)

**Phase 2.2 — Border Integration (Weeks 15-16):**

- Border node configuration (SD-WAN handoff, external connectivity)
- VRF-to-VPN mapping (fabric VNs to SD-WAN VPNs)
- Anycast gateway deployment (IPv6 default gateway per VLAN)

**Phase 2.3 — Edge Rollout (Weeks 17-18):**

- Access switch fabric enablement (wired edge nodes)
- Endpoint registration and authentication (802.1X, MAB, WebAuth)
- Policy application (ISE-based scalable group tags, contracts)

**Phase 2.4 — Wireless Fabric (Weeks 19-20):**

- Catalyst 9800 WLC fabric mode configuration
- WiFi 6E/7 AP deployment, dual-band SSID configuration
- Wireless client roaming, fast transition (802.11r/k/v)

**Technologies:** Catalyst Center (DNAC) 2.3+, ISE 3.2+, LISP, VXLAN, Catalyst 9000 switches, Catalyst 9800 WLC

### [Phase 2B: SD-Access Advanced Topics](phase2b-sdaccess-advanced-topics.md)

**Advanced Fabric Features and Multi-Site Integration**

Phase 2B extends base fabric deployment with advanced capabilities:

**Multi-Site Fabric:**

- **SD-Access Transit:** Inter-site fabric connectivity over SD-WAN underlay
- **Control Plane Replication:** LISP EID synchronization across sites
- **Anycast RP:** Multicast support across geographically distributed fabric

**Guest and IoT Segmentation:**

- **Guest Portal:** ISE-based captive portal with sponsor approval workflows
- **IoT Onboarding:** Certificate-based authentication for headless devices
- **Micro-Segmentation:** Per-device policy enforcement using scalable group tags (SGTs)

**Fabric Migration Strategies:**

- **Phased Migration:** VLAN-by-VLAN fabric enablement while maintaining non-fabric connectivity
- **Fabric-in-a-Box:** Isolated fabric deployment for testing before production cutover
- **Brownfield Integration:** Integrating existing campus infrastructure into fabric architecture

**Traffic Engineering:**

- **QoS Mapping:** IP DSCP to fabric policy translation
- **Multicast Optimization:** LISP-based multicast distribution (PIM integration)
- **Load Balancing:** ECMP across fabric underlay, anycast gateway distribution

**Troubleshooting:**

- **LISP Endpoint Registration:** EID mapping, RLOC resolution, map-cache verification
- **VXLAN Dataplane:** Tunnel debugging, encapsulation inspection, MTU considerations
- **ISE Integration:** SGT propagation, policy download, authentication flow

**Technologies:** SD-Access Transit, ISE pxGrid, LISP multicast, VXLAN flood-and-learn

---

## Deployment Architecture

**Hub Site Fabric Topology (Example: Mumbai HQ):**

```
┌─────────────────────────────────────────────────────────────┐
│                    CATALYST CENTER (DNAC)                   │
│              Centralized Fabric Orchestration               │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐  ┌──────▼─────┐  ┌────────▼───────┐
│  Control Plane │  │   Border   │  │  Fabric Edges  │
│  (LISP MS/MR)  │  │   Nodes    │  │  (Access Layer)│
│  C9500 × 2 HA  │  │  C9500 × 2 │  │  C9300 × 20    │
└────────────────┘  └────┬───────┘  └────────┬───────┘
                         │                   │
                    ┌────▼─────┐        ┌────▼─────┐
                    │ SD-WAN   │        │ Endpoints│
                    │ Handoff  │        │ (5000+)  │
                    │ (Border) │        │          │
                    └──────────┘        └──────────┘
                         │
                    ┌────▼─────┐
                    │  ISE 3.2 │
                    │  (Policy)│
                    └──────────┘
```

**IPv6 Fabric Addressing:**

- **Fabric Underlay:** 2001:db8:abv:SITE:fab0::/64 (LISP infrastructure)
- **Fabric Overlay (VNs):**
    - VN 10 (Corporate): 2001:db8:abv:SITE:1000::/48
    - VN 20 (Guest): 2001:db8:abv:SITE:2000::/48
    - VN 30 (Voice): 2001:db8:abv:SITE:3000::/48
    - VN 40 (IoT): 2001:db8:abv:SITE:4000::/48

---

## Deliverables

By the end of Chapter 3, you will have:

✅ **Fabric Operational** — SD-Access fabric deployed at all 5 hub sites

✅ **Wired Edge** — 100+ access switches fabric-enabled, endpoints registered

✅ **Wireless Fabric** — Catalyst 9800 WLC in fabric mode, WiFi 6E/7 APs operational

✅ **ISE Integration** — Policy enforcement via SGTs, 802.1X authentication functional

✅ **Border Connectivity** — Fabric-to-SD-WAN handoff, external routing operational

✅ **Multi-Site Fabric** — SD-Access Transit interconnecting hub fabrics

✅ **Guest/IoT Segmentation** — Dedicated VNs with micro-segmentation policies

---

## Prerequisites

Before starting Chapter 3:

- **Chapter 2 complete** — SD-WAN underlay operational, service VPNs deployed
- **Catalyst Center deployed** — DNAC 2.3.x cluster operational
- **ISE deployment** — ISE 3.2+ with pxGrid enabled
- **Campus infrastructure** — Catalyst 9000 switches at hub sites
- **Wireless infrastructure** — Catalyst 9800 WLC and WiFi 6E/7 APs

---

## Key Concepts

**SD-Access Fabric:**

- **LISP (Locator/ID Separation Protocol)** — Control plane for endpoint mobility and policy mapping
- **VXLAN (Virtual Extensible LAN)** — Data plane encapsulation for overlay traffic
- **Scalable Group Tags (SGTs)** — Policy classification based on user/device identity

**Fabric Roles:**

- **Control Plane Node** — LISP Map Server/Resolver for EID-to-RLOC mapping
- **Border Node** — Campus-to-external handoff (SD-WAN, internet, traditional network)
- **Edge Node** — Access layer switch with endpoint registration and policy enforcement

**Virtual Networks (VNs):**

- **Layer 3 Segmentation** — Isolated routing domains within fabric
- **Consistent Policy** — Same VN across all sites maintains policy state
- **VN-to-VPN Mapping** — Border nodes map fabric VNs to SD-WAN VPNs for WAN transit

**Anycast Gateway:**

- **First-Hop Redundancy** — All edge nodes advertise same gateway IP/MAC
- **Optimal Routing** — Traffic always routed via closest edge node
- **Seamless Mobility** — Clients roam without gateway change

---

## Next Steps

After completing Chapter 3:

1. **Proceed to [Chapter 4: Multi-Cloud Integration](../chapter4-multicloud-integration/README.md)** — Connect Azure and GCP to the fabric
2. **Baseline fabric health** — Monitor LISP registrations, VXLAN tunnel state, endpoint counts
3. **Optimize policies** — Refine ISE contracts based on observed application flows

---

**Ready to deploy fabric?** Start with **[Phase 2: SD-Access Overlay Deployment →](phase2-sdaccess-overlay-deployment.md)**
