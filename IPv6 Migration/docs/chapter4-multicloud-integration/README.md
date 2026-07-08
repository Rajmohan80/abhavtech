# Chapter 4: Multi-Cloud Integration

## Azure and GCP IPv6 Connectivity

This chapter covers comprehensive multi-cloud IPv6 integration patterns, connecting Abhavtech's SD-WAN and SD-Access infrastructure to Azure and Google Cloud Platform (GCP) workloads. The deployment establishes hybrid cloud connectivity for enterprise applications, Vertex AI machine learning workloads, and cloud-native services while maintaining consistent security policy and observability across on-premises and cloud environments.

---

## Chapter Contents

### [Phase 3: Multi-Cloud Deployment](phase3-multicloud-deployment.md)

**Enterprise Hybrid Cloud Architecture**

Phase 3 integrates Azure and GCP cloud platforms with the existing SD-WAN/SD-Access infrastructure, covering Weeks 21-28:

**Azure Integration:**

**Azure Virtual WAN:**

- **Hub-spoke topology:** Virtual WAN hub in Central India (Mumbai region affinity)
- **ExpressRoute circuits:** Dedicated private connectivity from Mumbai and London hubs
- **VPN Gateway:** Site-to-site IPsec tunnels from branch sites without ExpressRoute
- **IPv6 VNet addressing:** Dual-stack VNets for application workloads, Azure SQL, storage accounts

**Azure Services IPv6 Enablement:**

- **Azure Load Balancer:** Dual-stack frontend IPs for web applications
- **Azure Firewall:** IPv6 NAT rules, network/application rules for outbound internet
- **Azure Front Door:** Global load balancing with IPv6 anycast endpoints
- **Private Link:** IPv6 private endpoints for PaaS services (SQL, Storage, Key Vault)

**GCP Integration:**

**Cloud Interconnect:**

- **Dedicated Interconnect:** 10 Gbps circuits from Mumbai and Dallas hubs to GCP PoPs
- **Cloud VPN:** Redundant IPsec tunnels for branch sites and backup connectivity
- **Cloud Router:** BGP peering with on-premises SD-WAN for dynamic route exchange

**GCP VPC Networking:**

- **Dual-stack VPC:** IPv4/IPv6 addressing for compute instances, GKE clusters
- **VPC Peering:** Inter-VPC connectivity for multi-tenant application isolation
- **Shared VPC:** Centralized network management across GCP projects

**Vertex AI Connectivity:**

- **Private Service Connect:** IPv6-enabled private endpoints for Vertex AI APIs
- **ML Workload Routing:** Low-latency path selection for training/inference traffic
- **Data Pipeline Integration:** BigQuery, Cloud Storage IPv6 access from on-premises

**Multi-Cloud Routing:**

**BGP Configuration:**

- **AS Path Prepending:** Influence inbound traffic paths from Azure/GCP
- **Local Preference:** Control outbound path selection to cloud providers
- **Route Filtering:** Advertise only required on-premises prefixes to cloud

**Traffic Engineering:**

- **Application-Aware Routing:** Steer SaaS traffic to Azure Front Door vs. direct internet
- **Cloud Bursting:** Dynamic workload placement based on on-prem capacity
- **Cost Optimization:** Route non-critical traffic via cheaper internet paths

**Security Integration:**

- **Azure Firewall + Cisco Secure Firewall:** Consistent policy across on-prem and cloud
- **NSG (Network Security Groups):** Micro-segmentation within Azure VNets
- **Cloud Armor (GCP):** DDoS protection and WAF for internet-facing services
- **ISE Integration:** Extend scalable group tags (SGTs) to cloud workloads via pxGrid

**Observability:**

- **Azure Monitor:** VNet flow logs, ExpressRoute metrics, application insights
- **GCP Cloud Logging:** VPC flow logs, firewall logs, Cloud Interconnect telemetry
- **ThousandEyes Cloud Agent:** End-to-end path monitoring (on-prem to Azure/GCP)
- **Splunk Cloud Integration:** Centralized log aggregation from Azure/GCP

---

## Deployment Architecture

**Multi-Cloud Connectivity Topology:**

```
┌──────────────────────────────────────────────────────────────┐
│                    ON-PREMISES SD-WAN                        │
│  Mumbai Hub (Site 1) ←→ London Hub (Site 16)                │
│  Dallas Hub (Site 33) ←→ New Jersey Hub (Site 32)           │
└────────┬─────────────────────────────┬─────────────────────┬─┘
         │                             │                     │
         │ ExpressRoute                │ Dedicated           │ Cloud VPN
         │ (10 Gbps)                   │ Interconnect        │ (Backup)
         │                             │ (10 Gbps)           │
┌────────▼─────────┐          ┌────────▼─────────┐  ┌────────▼────────┐
│  AZURE VIRTUAL   │          │   GCP CLOUD      │  │  GCP CLOUD VPN  │
│  WAN HUB         │          │   ROUTER         │  │  GATEWAY        │
│  (Central India) │          │   (asia-south1)  │  │  (us-central1)  │
└────────┬─────────┘          └────────┬─────────┘  └────────┬────────┘
         │                             │                     │
    ┌────┴────┐                   ┌────┴────┐           ┌────┴────┐
    │ VNet 1  │                   │ VPC 1   │           │ VPC 2   │
    │ (Corp)  │                   │ (Prod)  │           │ (Dev)   │
    │ /48 v6  │                   │ /48 v6  │           │ /48 v6  │
    └─────────┘                   └─────────┘           └─────────┘
         │                             │                     │
    ┌────▼─────┐                  ┌────▼─────┐         ┌────▼─────┐
    │ Azure    │                  │ Vertex   │         │   GKE    │
    │ SQL DB   │                  │   AI     │         │ Clusters │
    │ (IPv6)   │                  │ (IPv6)   │         │ (IPv6)   │
    └──────────┘                  └──────────┘         └──────────┘
```

**IPv6 Addressing:**

- **Azure VNets:** 2001:db8:abv:az00::/48 and below
- **GCP VPCs:** 2001:db8:abv:gc00::/48 and below
- **Cloud Interconnect links:** 2001:db8:abv:SITE:fe10::/64 (BGP peering)

---

## Deliverables

By the end of Chapter 4, you will have:

✅ **Azure ExpressRoute** — Dedicated connectivity from Mumbai and London hubs

✅ **GCP Dedicated Interconnect** — 10 Gbps circuits from Mumbai and Dallas hubs

✅ **Dual-Stack Cloud VNets/VPCs** — IPv4/IPv6 addressing for all cloud workloads

✅ **BGP Routing** — Dynamic route exchange between on-premises and cloud

✅ **Vertex AI Connectivity** — Private endpoints for ML workload access

✅ **Unified Security Policy** — Consistent firewall rules across on-prem and cloud

✅ **Cloud Observability** — VNet/VPC flow logs integrated with Splunk and ThousandEyes

---

## Prerequisites

Before starting Chapter 4:

- **Chapters 2-3 complete** — SD-WAN and SD-Access operational
- **Azure subscription** — Enterprise Agreement with ExpressRoute entitlement
- **GCP project** — Billing account with Dedicated Interconnect quota
- **Cloud connectivity circuits** — ExpressRoute and Dedicated Interconnect provisioned
- **Cloud architecture** — VNet/VPC designs finalized, application workloads identified

---

## Key Concepts

**Hybrid Cloud Connectivity:**

- **Private Connectivity:** ExpressRoute/Dedicated Interconnect for predictable latency and security
- **Public Internet Backup:** VPN tunnels for redundancy and branch site connectivity
- **BGP Route Propagation:** Dynamic routing eliminates static route management

**Cloud-Native IPv6:**

- **Dual-Stack VNets/VPCs:** Both protocols enabled on cloud subnets
- **IPv6-Only Workloads:** GKE clusters and serverless functions with IPv6-only addressing
- **Cloud NAT64:** Translate IPv6-only cloud resources to IPv4 internet services

**Application Integration:**

- **Private Endpoints:** Azure Private Link and GCP Private Service Connect for PaaS access
- **Cloud Load Balancers:** Dual-stack frontends for global application delivery
- **Cloud Storage:** IPv6-enabled access to Azure Blob Storage and GCP Cloud Storage

---

## Next Steps

After completing Chapter 4:

1. **Proceed to [Chapter 5: Collaboration & UC](../chapter5-collaboration-uc/README.md)** — Enable Webex Calling and Contact Center over IPv6
2. **Cloud workload migration** — Begin migrating applications to Azure/GCP with IPv6 addressing
3. **Cost optimization review** — Analyze ExpressRoute/Interconnect utilization and adjust circuits

---

**Ready to connect the cloud?** Start with **[Phase 3: Multi-Cloud Deployment →](phase3-multicloud-deployment.md)**
