# 1.6 SD-WAN Readiness Assessment

## Document Information

| Item | Details |
|------|---------|
| **Document Version** | 1.0 |
| **Last Updated** | December 2025 |
| **Author** | Network Architecture Team |
| **Organization** | Abhavtech.com |
| **Classification** | Internal Use Only |

---

## 1.6.1 Overview

This section provides a comprehensive readiness assessment for Abhavtech.com's migration to Cisco Catalyst SD-WAN. The assessment evaluates technical, operational, and organizational readiness to ensure a successful deployment.

### Assessment Methodology

- Technical infrastructure evaluation
- Skills and knowledge assessment
- Process and procedure review
- Vendor and partner readiness
- Risk and dependency analysis

### Readiness Scoring Legend

| Score | Status | Description |
|-------|--------|-------------|
| ✅ Ready | 90-100% | No action required |
| ⚠️ Partial | 60-89% | Minor remediation needed |
| ❌ Not Ready | 0-59% | Significant work required |

---

## 1.6.2 Infrastructure Readiness Assessment

### Data Center Infrastructure

| Component | Requirement | Current State | Gap | Status |
|-----------|-------------|---------------|-----|--------|
| Compute (vManage) | 32 vCPU, 128 GB RAM per node | ESXi cluster available | None | ✅ Ready |
| Storage (vManage) | 2 TB SSD per node | vSAN available | None | ✅ Ready |
| Network (vManage) | 10 GbE connectivity | Available | None | ✅ Ready |
| Compute (vSmart) | 8 vCPU, 16 GB RAM per node | ESXi available | None | ✅ Ready |
| Compute (vBond) | 4 vCPU, 8 GB RAM per node | Cloud or on-prem | Decision pending | ⚠️ Partial |
| DR Site | Chennai DC | Infrastructure ready | Testing required | ⚠️ Partial |

### SD-WAN Controller Resource Requirements

```
                    SD-WAN CONTROLLER SIZING
    ═══════════════════════════════════════════════════════════════

    PRODUCTION (Mumbai DC):
    ┌─────────────────────────────────────────────────────────────┐
    │  vManage Cluster (3 nodes)                                  │
    │  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
    │  │ Node 1  │  │ Node 2  │  │ Node 3  │                     │
    │  │ 32vCPU  │  │ 32vCPU  │  │ 32vCPU  │                     │
    │  │ 128GB   │  │ 128GB   │  │ 128GB   │                     │
    │  │ 2TB SSD │  │ 2TB SSD │  │ 2TB SSD │                     │
    │  └─────────┘  └─────────┘  └─────────┘                     │
    │                                                             │
    │  vSmart Controllers (2 nodes)                               │
    │  ┌─────────┐  ┌─────────┐                                  │
    │  │vSmart-1 │  │vSmart-2 │                                  │
    │  │ 8vCPU   │  │ 8vCPU   │                                  │
    │  │ 16GB    │  │ 16GB    │                                  │
    │  │ 100GB   │  │ 100GB   │                                  │
    │  └─────────┘  └─────────┘                                  │
    └─────────────────────────────────────────────────────────────┘

    DR SITE (Chennai DC):
    ┌─────────────────────────────────────────────────────────────┐
    │  vManage DR (1 node - can scale to cluster)                 │
    │  ┌─────────┐                                                │
    │  │vMng-DR  │  vSmart Controllers (2 nodes)                 │
    │  │ 32vCPU  │  ┌─────────┐  ┌─────────┐                     │
    │  │ 128GB   │  │vSmart-3 │  │vSmart-4 │                     │
    │  │ 2TB SSD │  │ 8vCPU   │  │ 8vCPU   │                     │
    │  └─────────┘  └─────────┘  └─────────┘                     │
    └─────────────────────────────────────────────────────────────┘

    CLOUD (vBond):
    ┌─────────────────────────────────────────────────────────────┐
    │  vBond Validators (2 instances - Cloud)                     │
    │  ┌─────────┐  ┌─────────┐                                  │
    │  │vBond-1  │  │vBond-2  │                                  │
    │  │ 4vCPU   │  │ 4vCPU   │                                  │
    │  │ 8GB     │  │ 8GB     │                                  │
    │  │ AWS     │  │ Azure   │  (Multi-cloud redundancy)        │
    │  └─────────┘  └─────────┘                                  │
    └─────────────────────────────────────────────────────────────┘
```

### WAN Edge Router Readiness

| Site | Current Router | SD-WAN Ready | Action Required | Status |
|------|---------------|--------------|-----------------|--------|
| Mumbai-R1 | ISR4451-X | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |
| Mumbai-R2 | ISR4451-X | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |
| Chennai-R1 | ISR4351 | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |
| Chennai-R2 | ISR4351 | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |
| Bangalore-R1 | ISR4331 | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |
| Delhi-R1 | ISR4331 | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |
| Noida-R1 | ISR4331 | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |
| London-R1/R2 | ISR4351 | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |
| Frankfurt-R1/R2 | ISR4351 | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |
| New Jersey-R1/R2 | ISR4451-X | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |
| Dallas-R1/R2 | ISR4351 | Yes (controller mode) | Upgrade to 17.15.x | ⚠️ Partial |

### New Hardware Requirements

| Site | Recommended Model | Quantity | Purpose | Status |
|------|-------------------|----------|---------|--------|
| Mumbai | C8500-12X4QC | 2 | DC aggregation | ❌ To order |
| Chennai | C8500-12X4QC | 2 | DR aggregation | ❌ To order |
| All Hubs | C8300-2N2S-6T | 8 | Hub sites | ❌ To order |
| Branches | C8200L-1N-4T | 6 | Branch sites | ❌ To order |

---

## 1.6.3 Network Readiness Assessment

### Connectivity Prerequisites

| Requirement | Status | Notes |
|-------------|--------|-------|
| Internet connectivity at all sites | ✅ Ready | 10 sites covered |
| Public IP addresses for vBond | ⚠️ Partial | Need 2 public IPs per DC |
| DNS resolution for controller FQDNs | ✅ Ready | Infoblox configured |
| NTP synchronization | ✅ Ready | All sites synced |
| Firewall rules for SD-WAN | ❌ Not Ready | Ports need opening |

### Required Firewall Rules

| Source | Destination | Port | Protocol | Purpose |
|--------|-------------|------|----------|---------|
| WAN Edge | vBond | 12346 | UDP | DTLS control |
| WAN Edge | vSmart | 12346 | UDP | DTLS control |
| WAN Edge | vManage | 443 | TCP | HTTPS management |
| WAN Edge | WAN Edge | 12346 | UDP | IPsec data plane |
| WAN Edge | WAN Edge | 12346 | TCP | TCP fallback |
| Admin | vManage | 443 | TCP | Web UI |
| Admin | vManage | 8443 | TCP | API |

### SD-Access Integration Readiness

| Component | Status | Notes |
|-----------|--------|-------|
| Border nodes configured | ✅ Ready | L3 handoff interfaces ready |
| VRF-Lite subinterfaces | ⚠️ Partial | Need SD-WAN side config |
| BGP peering prepared | ✅ Ready | eBGP AS numbers allocated |
| SGT inline tagging | ⚠️ Partial | CTS manual needed on WAN Edge |
| Route filtering prepared | ✅ Ready | Prefix lists defined |

---

## 1.6.4 Technical Skills Assessment

### Team Capability Matrix

| Skill Area | Current Level | Required Level | Gap | Remediation |
|------------|---------------|----------------|-----|-------------|
| Cisco SD-WAN Architecture | Basic | Advanced | Significant | Training required |
| vManage Administration | None | Advanced | Critical | Training + lab |
| SD-WAN Policies (AAR, QoS) | Basic | Advanced | Significant | Training required |
| SD-WAN Troubleshooting | None | Intermediate | Significant | Training + practice |
| SD-Access Integration | Intermediate | Advanced | Moderate | Workshop |
| Python/API Automation | Intermediate | Advanced | Moderate | Self-study |
| Terraform/Ansible | Basic | Intermediate | Moderate | Training |

### Recommended Training Plan

| Course | Provider | Duration | Priority | Team Members |
|--------|----------|----------|----------|--------------|
| ENSDWI (Implementing Cisco SD-WAN) | Cisco | 5 days | High | 4 engineers |
| SD-WAN Design Workshop | Cisco | 3 days | High | 2 architects |
| SD-WAN Operations | Cisco | 3 days | Medium | 3 operators |
| SD-Access/SD-WAN Integration | Cisco | 2 days | High | 2 engineers |
| DevNet SD-WAN Automation | Cisco | 3 days | Medium | 2 engineers |

### Training Timeline

```
                    TRAINING SCHEDULE
    ═══════════════════════════════════════════════════════════════

    MONTH 1:
    Week 1-2:  ████████████████ ENSDWI Course (Team A)
    Week 3:    ████████ SD-WAN Design Workshop
    Week 4:    ████████ Lab Practice

    MONTH 2:
    Week 1-2:  ████████████████ ENSDWI Course (Team B)
    Week 3:    ████████ SD-Access Integration Workshop
    Week 4:    ████████ Lab Practice

    MONTH 3:
    Week 1:    ████ Operations Training
    Week 2-3:  ████████████ DevNet Automation
    Week 4:    ████████ Final Certification Prep
    ═══════════════════════════════════════════════════════════════
```

---

## 1.6.5 Operational Readiness Assessment

### Process Readiness

| Process | Current State | Required State | Gap | Status |
|---------|---------------|----------------|-----|--------|
| Change Management | Mature (ITIL) | SD-WAN specific templates | Minor | ⚠️ Partial |
| Incident Management | Mature | SD-WAN runbooks | Moderate | ⚠️ Partial |
| Problem Management | Mature | SD-WAN RCA procedures | Minor | ⚠️ Partial |
| Configuration Management | Basic | IaC with GitOps | Significant | ❌ Not Ready |
| Capacity Management | Basic | vAnalytics integration | Moderate | ⚠️ Partial |
| Monitoring/Alerting | SolarWinds | vManage + SolarWinds | Moderate | ⚠️ Partial |

### Documentation Requirements

| Document | Status | Priority |
|----------|--------|----------|
| SD-WAN Architecture Design | In progress | High |
| SD-WAN Operations Runbook | Not started | High |
| SD-WAN Troubleshooting Guide | Not started | High |
| SD-WAN Change Templates | Not started | Medium |
| SD-WAN DR Procedures | Not started | High |
| SD-WAN Security Policies | In progress | High |

---

## 1.6.6 Vendor and Licensing Readiness

### Cisco Licensing Requirements

| License Type | Quantity | Duration | Status |
|--------------|----------|----------|--------|
| DNA Advantage for WAN Edge | 15 devices | 3 years | ❌ To procure |
| vManage License | 1 cluster | 3 years | ❌ To procure |
| Umbrella DNS Security | 3,000 users | 1 year | ✅ Existing |
| ThousandEyes | 10 agents | 1 year | ❌ To procure |
| ISE Advantage | Existing | Existing | ✅ Ready |

### Licensing Cost Estimate

| Component | Annual Cost | 3-Year Total |
|-----------|-------------|--------------|
| DNA Advantage (15 devices) | $XX,XXX | $XXX,XXX |
| vManage + vSmart | $XX,XXX | $XX,XXX |
| ThousandEyes | $XX,XXX | $XX,XXX |
| Support (SmartNet) | $XX,XXX | $XX,XXX |
| **Total** | **$XXX,XXX** | **$XXX,XXX** |

### Partner/Vendor Support

| Partner | Role | Status |
|---------|------|--------|
| Cisco Account Team | Primary vendor | ✅ Engaged |
| Cisco Partner (Integrator) | Implementation support | ⚠️ Evaluation |
| Cisco TAC | Technical support | ✅ SmartNet active |
| Cisco CX | Success services | ⚠️ Proposal pending |

---

## 1.6.7 Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Controller deployment complexity | Medium | High | Cisco CX engagement | Architect |
| SD-Access integration issues | Medium | High | Detailed design, lab testing | Network Team |
| Performance degradation during migration | Medium | Medium | Parallel operation, staged rollout | Operations |
| Cellular failover reliability | Low | Medium | Multiple carriers, testing | Network Team |
| Certificate management complexity | Medium | Medium | Enterprise PKI integration | Security |

### Organizational Risks

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Skills gap delays deployment | High | High | Accelerated training program | Manager |
| Resource constraints | Medium | High | Partner augmentation | PMO |
| Change resistance | Low | Medium | Communication, training | Leadership |
| Parallel project conflicts | Medium | Medium | Resource planning, prioritization | PMO |

---

## 1.6.8 Readiness Gap Remediation Plan

### Critical Gaps (Must Fix Before Deployment)

| Gap | Remediation Action | Owner | Timeline | Status |
|-----|-------------------|-------|----------|--------|
| Controller VM deployment | Deploy vManage/vSmart/vBond | Infrastructure | Week 1-2 | Planned |
| WAN Edge IOS upgrade | Upgrade to 17.15.x | Network | Week 2-4 | Planned |
| Firewall rules | Open SD-WAN ports | Security | Week 1 | Planned |
| Team training | Complete ENSDWI course | HR/Training | Month 1-2 | Planned |
| Licensing procurement | Purchase DNA licenses | Procurement | Week 1 | In Progress |

### Medium Priority Gaps

| Gap | Remediation Action | Owner | Timeline |
|-----|-------------------|-------|----------|
| New hardware procurement | Order C8300/C8500 | Procurement | Month 1 |
| Operations runbooks | Develop SD-WAN runbooks | Operations | Month 2-3 |
| Monitoring integration | Configure vManage alerts | NOC | Month 2 |
| DR procedures | Document and test DR | Operations | Month 3 |

### Low Priority Gaps

| Gap | Remediation Action | Owner | Timeline |
|-----|-------------------|-------|----------|
| GitOps implementation | Implement config-as-code | DevOps | Month 4-6 |
| Advanced automation | Python SDK scripts | Automation | Month 4-6 |
| ThousandEyes deployment | Deploy agents | Network | Month 3-4 |

---

## 1.6.9 Readiness Assessment Summary

### Overall Readiness Score

```
                    READINESS ASSESSMENT SUMMARY
    ═══════════════════════════════════════════════════════════════

    CATEGORY                    SCORE    STATUS
    ─────────────────────────────────────────────────────────────
    Infrastructure              75%      ⚠️ Partial
    Network Connectivity        80%      ⚠️ Partial
    Technical Skills            55%      ❌ Not Ready
    Operational Processes       65%      ⚠️ Partial
    Vendor/Licensing            60%      ⚠️ Partial
    Documentation               40%      ❌ Not Ready
    ─────────────────────────────────────────────────────────────
    OVERALL READINESS           62%      ⚠️ Partial

    ═══════════════════════════════════════════════════════════════

    RECOMMENDATION: Proceed with 8-week readiness phase before
                   production deployment begins.
```

### Readiness Phase Timeline

| Week | Activities | Exit Criteria |
|------|------------|---------------|
| 1-2 | Licensing, firewall rules, DNS | Controllers deployable |
| 3-4 | Controller deployment, training start | vManage operational |
| 5-6 | Lab environment, training complete | Team certified |
| 7-8 | Pilot site preparation, runbooks | Ready for pilot |

### Go/No-Go Criteria

| Criterion | Required State | Current State | Go/No-Go |
|-----------|---------------|---------------|----------|
| Controllers deployed | Operational | Not deployed | No-Go |
| Team trained | 80% certified | 0% certified | No-Go |
| Firewall rules | Implemented | Not implemented | No-Go |
| Licenses procured | Available | In procurement | No-Go |
| Lab validated | Complete | Not started | No-Go |
| Runbooks documented | Draft complete | Not started | No-Go |

---

## References

| Document | Description |
|----------|-------------|
| Cisco SD-WAN Deployment Prerequisites | Official requirements |
| Abhavtech IT Skills Matrix | Current team capabilities |
| Project Resource Plan | Staffing and training |
| Procurement Pipeline | License and hardware status |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
*Abhavtech.com - SD-WAN Documentation*
