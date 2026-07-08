# Chapter 1: Getting Started

## Foundation and Planning Phase

This chapter covers the critical foundation phase of the IPv6 migration, providing the Master Reference Card — your comprehensive quick-reference guide for all architectural decisions, addressing schemes, routing protocols, and migration patterns — plus the detailed Week 1 planning activities that establish the groundwork for successful deployment.

---

## Chapter Contents

### [Master Reference Card](master-reference-card.md)

**Your Complete IPv6 Migration Quick Reference**

The Master Reference Card is the single-source-of-truth document containing:

- **Addressing Architecture:** Complete IPv6 prefix hierarchy for all 19 sites (APAC/EMEA/Americas)
- **Routing Protocols:** OSPFv3, EIGRP IPv6, BGP IPv6 configuration patterns
- **Migration Phases:** SD-WAN underlay, SD-Access overlay, multi-cloud, UC, observability, security
- **NAT64/DNS64:** IPv6-to-IPv4 translation for legacy application connectivity
- **Technology Matrix:** Feature support across SD-WAN, SD-Access, ISE, DNAC, Webex
- **Troubleshooting:** Common issues, debugging commands, verification procedures
- **ACL Translation:** IPv4 to IPv6 access-list migration patterns

**Use this document throughout your migration** — it contains the addressing schemes, protocol configurations, and migration patterns referenced in all subsequent chapters.

### [Week 1: Planning, Addressing & Tooling](week1-planning-addressing-tooling.md)

**5-Day Foundation Sprint**

Week 1 establishes the infrastructure foundation before any production device configuration:

**Day 1:** IPv6 Prefix Planning and ARIN Allocation

- Calculate required IPv6 space for 19 sites, cloud, IoT, and future growth
- Submit ARIN request for /44 or /40 prefix allocation
- Document addressing hierarchy and site-specific allocations

**Day 2:** IPAM Configuration and Addressing Spreadsheet

- Configure Catalyst Center (DNAC) IPAM for IPv6 pool management
- Create master IPv6 allocation spreadsheet (sites, VRFs, VLANs, cloud)
- Assign /48 prefixes to all 19 sites with /64 subnet breakdowns

**Day 3:** Lab Environment Setup and Testing

- Deploy lab topology in CML or DevNet sandbox
- Test dual-stack configurations on virtual routers and switches
- Validate LISP/VXLAN IPv6 overlay, OSPFv3, BGP IPv6

**Day 4:** Production Tooling Preparation

- **DNAC:** Enable IPv6 support, create address pools, configure telemetry
- **ISE:** Add IPv6 device IPs to network device groups, update policies
- **vManage:** Prepare IPv6 feature templates for WAN edge routers
- **Monitoring:** Configure ThousandEyes IPv6 tests, Splunk IPv6 log collection

**Day 5:** Readiness Assessment and Go/No-Go Decision

- Complete infrastructure readiness checklist (100% completion required)
- Stakeholder sign-off on addressing plan and migration timeline
- Schedule Phase 1 kickoff meeting for Week 2 Mumbai hub deployment

---

## Deliverables

By the end of Chapter 1, you will have:

✅ **Master Reference Card** — Complete architectural documentation and quick reference

✅ **ARIN IPv6 Allocation** — Assigned /44 or /40 prefix for enterprise use

✅ **IPAM Configuration** — Catalyst Center IPv6 pools and address tracking

✅ **Validated Lab Topology** — Dual-stack configurations tested in non-production environment

✅ **Tooling Readiness** — DNAC, ISE, vManage, and monitoring platforms IPv6-enabled

✅ **Stakeholder Approval** — Go/no-go decision for Phase 1 deployment

---

## Prerequisites

Before starting Chapter 1, ensure you have:

- **Organizational approval** for IPv6 migration and budget allocation
- **ARIN account** with authority to request IPv6 address space
- **Lab environment access** (CML, DevNet sandbox, or equivalent virtualization)
- **Management platform credentials** (DNAC, ISE, vManage, ThousandEyes, Splunk)
- **Network inventory** complete (all sites, device counts, VLAN structures)

---

## Key Concepts

**IPv6 Prefix Sizing:**

- **/48 per site** — Standard enterprise site allocation (65,536 /64 subnets)
- **/64 per subnet** — Individual VLAN/segment allocation (recommended)
- **/44 or /40 for enterprise** — Supports 16-256 sites with room for growth

**Dual-Stack Migration:**

- **Simultaneous IPv4/IPv6** — Both protocols operational during transition
- **IPv6-preferred routing** — Applications attempt IPv6 first, fallback to IPv4
- **NAT64/DNS64** — Bridge IPv6-only clients to IPv4-only services

**IPAM Strategy:**

- **Centralized allocation** — Single source of truth for all address assignments
- **Hierarchy enforcement** — Regional/site/function-based prefix structure
- **Reservation tracking** — Document future allocations (IoT, cloud expansion)

---

## Next Steps

After completing Chapter 1:

1. **Proceed to [Chapter 2: SD-WAN Foundation](../chapter2-sdwan-foundation/README.md)** — Begin Week 2 with Mumbai hub deployment
2. **Keep the Master Reference Card accessible** — You'll reference it throughout the migration
3. **Maintain IPAM discipline** — All address assignments must be tracked and documented

---

**Ready to start?** Begin with the **[Master Reference Card →](master-reference-card.md)**
