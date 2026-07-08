# Chapter 3: SD-WAN Cloud OnRamp

**Cisco Catalyst SD-WAN Cloud OnRamp Implementation**

---

## Chapter Overview

This chapter provides comprehensive, step-by-step implementation procedures for deploying Cisco SD-WAN Cloud OnRamp across all three operational modes: **Cloud OnRamp for SaaS**, **Cloud OnRamp for IaaS**, and **Cloud OnRamp for Colocation/SASE**.

**Timeline:** 4-week phased deployment across 19 sites (6 hubs + 13 branches)

---

## What You'll Learn

- Cloud OnRamp for SaaS configuration (Office 365, Salesforce, ServiceNow, Webex)
- Cloud OnRamp for IaaS deployment (Azure Virtual WAN, GCP connectivity)
- Cloud OnRamp for Colocation/SASE (Cisco Umbrella integration)
- Advanced QoS policies for cloud traffic optimization
- vManage API automation for bulk deployments
- End-to-end validation and troubleshooting procedures

---

## Implementation Scope

**Infrastructure:**

- **Platform:** Cisco Catalyst SD-WAN vManage 20.15.x
- **Hub Devices:** C8500-12X running IOS-XE 17.15.x
- **Branch Devices:** ISR 4331, ISR 1100-4G/4GLTENA
- **Sites:** 19 locations across APAC, EMEA, Americas

**Cloud OnRamp Modes:**

| Mode | Use Case | Covered In |
|------|----------|-----------|
| **SaaS** | Automated best-path to Office 365, Salesforce, Webex, etc. | Week 1 |
| **IaaS** | Azure Virtual WAN + GCP connectivity | Week 2 |
| **Colocation/SASE** | Cisco Umbrella SASE for DIA breakout | Week 3 |
| **Integration** | End-to-end policy, QoS, automation | Week 4 |

---

## Chapter Contents

### [3.1 Cloud OnRamp Overview](3.1-cloud-onramp-overview.md)
Introduction to Cloud OnRamp architecture, capabilities, and deployment prerequisites.

### [3.2 Cloud OnRamp for SaaS](3.2-saas-implementation.md)
**Week 1 Implementation:** SaaS probe configuration, Office 365 policy, multi-app SaaS integration, and monitoring.

### [3.3 Cloud OnRamp for IaaS](3.3-iaas-implementation.md)
**Week 2 Implementation:** Azure Virtual WAN gateway automation, IaaS policy configuration, and multi-region failover.

### [3.4 Cloud OnRamp for SASE](3.4-sase-implementation.md)
**Week 3 Implementation:** Umbrella integration, DIA policy, DNS security, secure web gateway, and branch activation.

### [3.5 Integration & QoS](3.5-integration-qos.md)
**Week 4 Part 1:** Policy integration across all Cloud OnRamp modes and advanced QoS configuration.

### [3.6 Production Deployment](3.6-production.md)
**Week 4 Part 2:** vManage API automation, production cutover procedures, and ongoing monitoring.

### [3.7 Detailed Configuration Guide](3.7-detailed-config.md)
Comprehensive reference with complete CLI and vManage configuration templates.

---

## Week-by-Week Deployment Timeline

```
WEEK 1: Cloud OnRamp for SaaS
├── Day 1: Prerequisites & SaaS app inventory
├── Day 2: vManage SaaS probe configuration
├── Day 3: Office 365 Cloud OnRamp policy
├── Day 4: Multi-app SaaS policy (Salesforce, ServiceNow, Workday)
└── Day 5: SaaS monitoring and validation

WEEK 2: Cloud OnRamp for IaaS (Azure)
├── Day 1: Azure Virtual WAN automated gateway
├── Day 2: IaaS policy for Azure VNets
├── Day 3: Multi-region Azure failover
└── Day 4: Azure IaaS validation

WEEK 3: Cloud OnRamp for SASE (Umbrella)
├── Day 1: Umbrella integration with SD-WAN
├── Day 2: DIA policy and DNS security
├── Day 3: SASE Secure Web Gateway
└── Day 4: Branch SASE policy activation

WEEK 4: Integration, QoS, and Production
├── Day 1: End-to-end policy integration
├── Day 2: Advanced QoS configuration
├── Day 3: vManage API automation
├── Day 4: End-to-end validation suite
└── Day 5: Production cutover and monitoring
```

---

## Prerequisites for This Chapter

- **Completed:** Chapter 2 (Architecture Design)
- **Infrastructure:** SD-WAN fabric deployed and operational
- **Access:** vManage administrative credentials, cloud platform access
- **Knowledge:** SD-WAN policies, VPN concepts, BGP basics
- **Tools:** vManage GUI access, CLI access to edge devices
- **Time Investment:** 4 weeks for complete deployment (1-2 hours per day)

---

## Key Configuration Areas

### vManage Policy Templates
Centralized policy templates for SaaS/IaaS/SASE traffic steering and optimization.

### Application-Aware Routing
DPI-based traffic classification and dynamic path selection per application.

### SaaS Probes
Automated performance monitoring to Office 365, Salesforce, and other SaaS platforms from all sites.

### Cloud Gateway Selection
Automated selection of optimal Azure/GCP gateway based on real-time performance metrics.

### QoS Policies
Multi-tier QoS for voice (EF), video (AF41), business-critical (AF31), and best-effort traffic.

---

## Next Steps

After completing this chapter:

- Review **[Chapter 4: GCP Vertex AI](../chapter4-gcp-vertex-ai/README.md)** for GCP-specific integration
- Or proceed to **[Chapter 5: Azure Integration](../chapter5-azure/README.md)** for Azure ExpressRoute and Virtual WAN details
- Then validate with **[Chapter 6: Testing & Validation](../chapter6-testing/README.md)**

---

*This chapter transforms architectural design into production-ready SD-WAN Cloud OnRamp deployment.*
