# Infrastructure Overview

This page presents the **Abhavtech Global Enterprise Base Reference Architecture** — the foundational infrastructure on top of which all specialised project layers are built.

Read this first to understand the physical and logical infrastructure before exploring any of the technology-specific documentation sections.

---

## About This Diagram

The High-Level Design (HLD) below shows the complete base infrastructure across four layers:

- **Cloud & Management Plane** — SaaS applications, Webex UC, Cisco Security Cloud (Umbrella, XDR, Duo, FMC), and the management platforms (DNAC, ISE, vManage)
- **WAN Transport** — SD-WAN fabric with 24 cEdge routers, MPLS circuits (Tata/AT&T/BT), Internet DIA, and 5G/LTE backup
- **Regional Infrastructure** — 6 hub sites across APAC, EMEA, and Americas, plus 13 branch sites (19 sites total, 12,400+ users)
- **Virtual Networks (SD-Access)** — Six VNs with TrustSec SGT segmentation enforced across the entire fabric

!!! note "Base Infrastructure — Not the Full Picture"
    This diagram shows the **base infrastructure foundation only**. The extensibility layers shown at the top-right (AI/ML Observability, AgenticOps Automation, Edge Compute) are **separate project phases** added on top of this foundation. Each phase is documented in its own dedicated section as it is built out.

---

## High-Level Design Diagram

<div style="width:100%;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin:1.5em 0;">
<iframe src="../assets/hld-diagram.html" 
        style="width:100%;height:780px;border:none;display:block;"
        title="Abhavtech Global Enterprise Base Reference Architecture">
</iframe>
</div>

<p style="text-align:center;font-size:0.85rem;color:#718096;margin-top:0.5em;">
  <a href="../assets/hld-diagram.html" target="_blank">Open diagram in full screen ↗</a>
</p>

---

## What Each Layer Covers

### Cloud & Management Plane

The top layer of the architecture covers all cloud-delivered services and the centralised management platforms that govern the entire estate.

- **SaaS Applications** — Microsoft 365, Salesforce, Box (all users)
- **Webex Cloud UC** — Webex Calling (3,200 users), Meetings, and Webex Contact Center (175 agents)
- **Cisco Security Cloud** — Umbrella SIG for DNS/web security, XDR/SecureX for extended detection and response, Duo MFA for all admin and VPN access, FMC managing all FTD firewalls (primary NJ, secondary London)
- **Management Plane** — DNAC 6-node cluster (3 NJ primary, 3 London DR), 14-node ISE cluster (2 PAN + 12 PSN across all hubs), vManage for SD-WAN policy

### WAN Transport Layer

All 19 sites are connected via a Cisco Catalyst SD-WAN fabric. Transport is hybrid: MPLS as the primary circuit (Tata for APAC, AT&T for Americas, BT for EMEA), Internet DIA for SaaS breakout and tunnel, and 5G/LTE as branch failover only.

24 cEdge routers (ISR 4451 at hubs, ISR 4351/1100 at branches) form the data plane, with vSmart and vBond as virtual controllers hosted in the cloud.

### Regional Infrastructure

Six hub sites anchor the three regions. Each hub runs a consistent stack: FTD firewall HA pair, Catalyst 9500 border and control-plane nodes, ISE PSN pair, and a C9800 WLC HA pair. The 13 branch sites use a standardised Fabric-in-a-Box design (C9300 + C9200 extended nodes + C9120 APs).

New Jersey is the Global HQ and hosts the primary DNAC cluster, primary ISE PAN, and primary FMC. London hosts the DNAC DR cluster and secondary ISE PAN.

### Virtual Networks & Segmentation

The entire campus and branch fabric is segmented into six Virtual Networks enforced via SD-Access and TrustSec SGTs:

| Virtual Network | IP Range | Purpose |
|-----------------|----------|---------|
| VN_CORPORATE | 10.100.0.0/16 | Employee workstations (SGT 10–19) |
| VN_VOICE | 10.190.0.0/16 | VoIP and Webex endpoints (SGT 20) |
| VN_GUEST | 10.200.0.0/16 | Visitor and guest access (SGT 40) |
| VN_IOT | 10.150.0.0/16 | Cameras, sensors, BMS (SGT 50–70) |
| VN_SERVERS | 10.180.0.0/16 | Data centre workloads (SGT 80–90) |
| INFRA_VN | 10.252.0.0/16 | Network management only |

---

## Understanding the Full Picture — Where to Go Next

The HLD above is intentionally a single-page view. Each component in the diagram has its own in-depth documentation. The table below maps each architecture layer to the relevant documentation section. These sections will be added to this site progressively as each project is built out.

| Architecture Layer | What You Will Learn | Documentation |
|--------------------|---------------------|---------------|
| **SD-WAN Fabric** | vManage policies, cEdge onboarding, transport design, QoS, application-aware routing, failover | *Cisco Catalyst SD-WAN Implementation Guide — coming soon* |
| **SD-Access & ISE** | Fabric design, LISP/VXLAN control plane, TrustSec SGT policy, 802.1X/MAB, ISE cluster | *SD-Access & ISE Documentation — coming soon* |
| **Cybersecurity Framework** | NIST CSF 2.0, CIS Controls, MITRE ATT&CK mapping, SOC operations, incident response | [Cybersecurity Framework](../cybersecurity-framework/README.md) |
| **Network Forensics** | Platform-specific investigation procedures — SD-WAN, DNAC, Webex, FTD, Zero Trust, AI | [Network Forensics](../network-forensics/README.md) |
| **Penetration Testing** | Attack simulation, SD-Access/SD-WAN/Webex test cases, Zero Trust validation | [Penetration Testing](../penetration-testing/README.md) |
| **AI/ML Observability** | Splunk MLTK, ThousandEyes, AppDynamics, XDR correlation, UEBA | *AI Observability Documentation — coming soon* |
| **AgenticOps Automation** | WF-001–WF-008 automated workflows, guardrails, API orchestration | *Network Automation Framework — coming soon* |
| **Edge Compute (AI Edge)** | UCS XE9305 + NVIDIA GPU, camera inference, physical security use cases | *Edge AI Networking — coming soon* |
| **Webex UC Migration** | CUCM → Webex Calling, UCCX → WxCC, Virtual Agent deployment | *UC & Contact Centre Documentation — coming soon* |

!!! tip "Building Out This Documentation"
    Each row marked *coming soon* represents a planned documentation section. As each project is built and published, the link in this table will be activated. The cybersecurity, forensics, and penetration testing sections are live now — use the navigation tabs above to access them.

---

## Enterprise Scale Summary

| Metric | Value |
|--------|-------|
| Total Sites | 19 (6 Hubs + 13 Branches) |
| Regions | 3 (APAC, EMEA, Americas) |
| Users | 12,400+ |
| Access Switches | 238 (Catalyst 9300) |
| Wireless APs | 590 (C9130/C9120) |
| SD-WAN Edges | 24 (ISR 4451/4351/1100) |
| Firewalls | 18 (FTD — migrated from ASA) |
| ISE Nodes | 14 (2 PAN + 12 PSN) |
| DNAC Nodes | 6 (3 NJ Primary + 3 London DR) |
