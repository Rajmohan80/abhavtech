# Base Reference Architecture

**Purpose:** Foundational Infrastructure for All Project Layers

---

## Overview

This document defines the **BASE infrastructure foundation** for Abhavtech's global enterprise network. Specialized layers (AI/ML Observability, Edge Compute, AgenticOps Automation) are added per project scope on top of this foundation.

### Enterprise Scale Summary

| Metric | Value |
|--------|-------|
| **Total Sites** | 19 (6 Hubs + 13 Branches) |
| **Regions** | 3 (APAC, EMEA, Americas) |
| **Users** | 12,400+ |
| **Access Switches** | 238 (Catalyst 9300) |
| **Wireless APs** | 590 (C9130/C9120) |
| **SD-WAN Edges** | 24 (ISR 4451/4351) |
| **Firewalls** | 18 (FTD - migrated from ASA) |
| **ISE Nodes** | 14 (2 PAN + 12 PSN) |
| **DNAC Nodes** | 6 (3 NJ Primary + 3 London DR) |

---


---

## Cloud Services Layer

### SaaS Applications

| Application | Purpose | Users |
|-------------|---------|-------|
| Microsoft 365 | Productivity, Email | All users |
| Salesforce | CRM | Sales teams |
| Box | Cloud storage | All users |

### Webex Cloud (Unified Communications)

| Service | Capacity | Notes |
|---------|----------|-------|
| Webex Calling | 3,200 users | Migrated from CUCM |
| Webex Meetings | Enterprise-wide | Hybrid work support |
| Webex Contact Center | 175 agents | 150 voice + 25 digital |

### Cisco Security Cloud

| Component | Function | Deployment |
|-----------|----------|------------|
| Umbrella SIG | DNS security, SWG, CASB | Cloud-delivered |
| XDR (SecureX) | Extended detection & response | Cloud + on-prem connectors |
| Duo MFA | Multi-factor authentication | All admin + VPN access |
| FMC | Firewall management | NJ (Primary) + London (Secondary) |

### Management Plane

| Platform | Nodes | Location | Purpose |
|----------|-------|----------|---------|
| **DNAC** | 6 (DN2-HW-APL-XL) | 3 NJ (Primary), 3 London (DR) | SD-Access fabric controller |
| **ISE** | 14 total | 2 PAN + 12 PSN across 6 hubs | Identity services, TrustSec |
| **vManage** | HA Cluster | Cloud-hosted | SD-WAN controller |

---

## WAN Transport Layer

### SD-WAN Fabric

| Component | Quantity | Model | Purpose |
|-----------|----------|-------|---------|
| cEdge Routers | 24 | ISR 4451/4351 | Site WAN edge |
| vSmart | 2 | Virtual | Route policy controller |
| vBond | 2 | Virtual | Orchestration |
| vManage | HA | Cloud | Management |

### Transport Options

| Transport | Provider | Sites | Bandwidth |
|-----------|----------|-------|-----------|
| **MPLS** (Primary) | Tata (APAC), AT&T (US), BT (EMEA) | All hubs | 500M - 1G |
| **Internet DIA** | Regional ISPs | All sites | 100M - 500M |
| **5G/LTE** (Backup) | Carriers | Branches | Failover only |

---

## Regional Infrastructure

### APAC Region

#### Mumbai - Primary Hub

| Attribute | Value |
|-----------|-------|
| **Role** | Regional HQ, Primary Hub APAC |
| **Users** | 2,500 |
| **Switches** | 48 Access + 4 Core + 8 Distribution |
| **APs** | 120 (C9130AXI) |
| **WAN** | 1 Gbps MPLS |
| **Data Center** | Yes |

**Stack:**
- FTD Firewall (FPR-4115 HA pair)
- C8500 Border/Control Plane
- ISE PSN x2 (SNS-3655-K9)
- WLC C9800-80 (HA pair)

#### Chennai - Secondary Hub

| Attribute | Value |
|-----------|-------|
| **Role** | Secondary Hub APAC |
| **Users** | 1,800 |
| **Switches** | 36 Access + 2 Core + 6 Distribution |
| **APs** | 90 (C9130AXI) |
| **WAN** | 500 Mbps MPLS |

**Stack:**
- FTD Firewall (FPR-2130 HA pair)
- ISR 4451 SD-WAN Edge
- ISE PSN x2
- WLC C9800-40 (HA pair)

#### APAC Branches

| Site | Users | Switches | WAN |
|------|-------|----------|-----|
| Bangalore | 800 | 16 | 200 Mbps MPLS |
| Delhi | 600 | 12 | 150 Mbps MPLS |
| Noida | 300 | 6 | 100 Mbps MPLS |

---

### EMEA Region

#### London - Primary Hub

| Attribute | Value |
|-----------|-------|
| **Role** | Regional HQ, Primary Hub EMEA, **DNAC DR Site** |
| **Users** | 2,200 |
| **Switches** | 42 Access + 4 Core + 8 Distribution |
| **APs** | 100 (C9130AXI) |
| **WAN** | 1 Gbps MPLS |

**Stack:**
- FTD Firewall (FPR-4115 HA pair)
- C8500 Border/Control Plane
- ISE PAN (Secondary) + PSN x2
- WLC C9800-80 (HA pair)
- **DNAC DR Cluster (3-node)**

#### Frankfurt - Secondary Hub

| Attribute | Value |
|-----------|-------|
| **Role** | Secondary Hub EMEA |
| **Users** | 1,500 |
| **Switches** | 28 Access + 2 Core + 4 Distribution |
| **APs** | 70 (C9130AXI) |
| **WAN** | 500 Mbps MPLS |

**Stack:**
- FTD Firewall (FPR-2130 HA pair)
- ISR 4451 SD-WAN Edge
- ISE PSN x2
- WLC C9800-40 (HA pair)

#### EMEA Branches

| Site | Users | Switches | WAN |
|------|-------|----------|-----|
| Paris | ~100 | 8 | 200 Mbps |
| Amsterdam | ~80 | 6 | 150 Mbps |
| Dublin | ~80 | 6 | 150 Mbps |
| Madrid | ~60 | 4 | 100 Mbps |
| Milan | ~60 | 4 | 100 Mbps |

---

### Americas Region

#### New Jersey - Global HQ ★

| Attribute | Value |
|-----------|-------|
| **Role** | **Global Headquarters**, Primary Hub Americas |
| **Users** | 2,800 |
| **Switches** | 52 Access + 4 Core + 10 Distribution |
| **APs** | 210 (C9130AXI) |
| **WAN** | 1 Gbps MPLS |
| **Data Center** | Primary |

**Stack:**
- FTD Firewall (FPR-4115 HA pair)
- C8500 Border/Control Plane
- **ISE PAN (Primary)** + PSN x2
- WLC C9800-80 (HA pair)
- **DNAC Primary Cluster (3-node XL)**
- FMC Primary

#### Dallas - Secondary Hub

| Attribute | Value |
|-----------|-------|
| **Role** | Secondary Hub Americas |
| **Users** | 1,600 |
| **Switches** | 32 Access + 2 Core + 6 Distribution |
| **APs** | 90 (C9130AXI) |
| **WAN** | 500 Mbps MPLS |

**Stack:**
- FTD Firewall (FPR-2130 HA pair)
- ISR 4451 SD-WAN Edge
- ISE PSN x2
- WLC C9800-40 (HA pair)

#### Americas Branches

| Site | Users | Switches | WAN |
|------|-------|----------|-----|
| Chicago | ~100 | 10 | 250 Mbps |
| Seattle | ~80 | 8 | 200 Mbps |
| Los Angeles | ~80 | 8 | 200 Mbps |
| Atlanta | ~60 | 6 | 150 Mbps |
| Denver | ~60 | 6 | 150 Mbps |

---

## Standard Branch Stack

All branch sites use a standardized stack for consistency:

| Component | Model | Purpose |
|-----------|-------|---------|
| SD-WAN Edge | ISR 1100 or ISR 4351 | WAN routing, IPsec |
| Fabric-in-a-Box | C9300-48UXM (x2) | SD-Access fabric |
| Extended Nodes | C9200-24P (x4) | Access layer |
| Wireless APs | C9120AXI | Fabric-enabled Wi-Fi |
| Backup WAN | 5G/LTE module | Failover transport |

---

## Virtual Networks (SD-Access Segmentation)

### VN Summary

| Virtual Network | IP Range | VNI | SGT Range | Purpose |
|-----------------|----------|-----|-----------|---------|
| **VN_CORPORATE** | 10.100.0.0/16 | 8001 | 10-19 | Employee workstations |
| **VN_VOICE** | 10.190.0.0/16 | 8005 | 20 | VoIP endpoints, Webex |
| **VN_GUEST** | 10.200.0.0/16 | 8002 | 40 | Visitor access |
| **VN_IOT** | 10.150.0.0/16 | 8003 | 50-70 | Cameras, sensors, BMS |
| **VN_SERVERS** | 10.180.0.0/16 | 8004 | 80-90 | Data center workloads |
| **INFRA_VN** | 10.252.0.0/16 | N/A | Mgmt | Network management |

### Security Group Tags (SGT)

| SGT | Name | Description |
|-----|------|-------------|
| 10 | Employees | Standard employee access |
| 11 | Executives | Executive team (protected) |
| 15 | IT_Admins | IT administrative access |
| 20 | Voice | VoIP devices |
| 40 | Guest | Visitor/guest access |
| 50 | IoT_Sensors | BMS sensors |
| 60 | IoT_OT | Operational technology (protected) |
| 70 | IoT_Cameras | IP cameras |
| 80-83 | Servers | Production servers (protected) |
| 90 | Dev_Servers | Development servers |

### Policy Enforcement

- **TrustSec SGACL** via ISE (25+ authorization profiles)
- **802.1X/MAB** authentication at fabric edge
- **Inter-VN routing** only at Border nodes
- **Guest VN** restricted to Internet-only ACL

---

## Hardware Inventory Summary

### Switching

| Model | Quantity | Role |
|-------|----------|------|
| C9500-48Y4C | 12 | Border Nodes (2 per hub) |
| C9500-24Y4C | 12 | Control Plane Nodes (2 per hub) |
| C9300-48U | 238 | Fabric Edge Nodes |
| C9300-48UXM | 60 | Branch Fabric-in-a-Box |
| C9200-24P | 120 | Branch Extended Nodes |

### Wireless

| Model | Quantity | Role |
|-------|----------|------|
| C9800-80 | 6 | WLC (large hubs) |
| C9800-40 | 6 | WLC (secondary hubs) |
| C9130AXI | 350 | High-density APs (hubs) |
| C9120AXI | 240 | Standard APs (branches) |

### Security

| Model | Quantity | Role |
|-------|----------|------|
| FPR-4115 | 6 | Hub DC firewalls (HA pairs) |
| FPR-2130 | 12 | Regional site firewalls (HA pairs) |
| FMC | 2 | Firewall management (NJ + LON) |

### Identity

| Model | Quantity | Role |
|-------|----------|------|
| SNS-3695-K9 | 2 | ISE PAN (NJ + London) |
| SNS-3655-K9 | 12 | ISE PSN (2 per hub) |

---

## Extensibility Layers

This base architecture supports the following project extensions:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROJECT EXTENSIBILITY                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🧠 AI/ML OBSERVABILITY LAYER                            │   │
│  │    • Splunk MLTK (5 ML models)                          │   │
│  │    • ThousandEyes (Path Intelligence)                   │   │
│  │    • AppDynamics Cognition Engine                       │   │
│  │    • Deep Network Model (Catalyst Center)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ⚡ AGENTICOPS AUTOMATION LAYER                          │   │
│  │    • WF-001 to WF-008 Workflows                         │   │
│  │    • Guardrails (SGT-11, SGT-60, SGT-80-83 protected)   │   │
│  │    • Auto-actions: vManage QoS, ISE CoA, ServiceNow    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🖥️ EDGE COMPUTE LAYER (AI Edge)                         │   │
│  │    • UCS XE9305 + XE130c M8 (Mumbai, Chennai)           │   │
│  │    • NVIDIA L4/T4 GPUs                                  │   │
│  │    • 240 Cameras (Physical Security UC)                 │   │
│  │    • 4ms inference latency target                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Each layer integrates with the base infrastructure at defined extension points (hub sites, management plane, virtual networks).

---

## Integration Points

When adding project layers, reference these integration points:

| Extension Layer | Integrates With | At Location |
|-----------------|-----------------|-------------|
| AI/ML Observability | DNAC, ISE, vManage | NJ (Primary), London (DR) |
| AgenticOps | All platforms via APIs | Cloud-hosted orchestrator |
| Edge Compute | VN_IOT, WAN transport | Mumbai, Chennai hub DCs |
| Observability Agents | SD-WAN edges | All 6 hub sites |

---

## Document References

| Document | Content |
|----------|---------|
| Document 1 | Zero Trust Architecture (ASA→FTD migration) |
| Document 2 | AI-Enabled Observability |
| Document 3 | AI-Ready Network / IBN |
| Document 4A | Cybersecurity Framework |
| Document 4B | Network Forensics |
| Document 4C | Penetration Testing |
| SD-Access Doc | Complete SD-Access/ISE implementation |
| CUCM-Webex Doc | UC migration to Webex Cloud |
