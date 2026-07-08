# 6.1 Operations Overview

## Document Information

| Field | Value |
|-------|-------|
| Document Title | Operations Overview |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Abhavtech |
| Classification | Internal Use |
| Target Audience | Network Operations, IT Management |

---

## Overview

This section establishes the operations framework for managing the Abhavtech SD-WAN infrastructure. It defines operational responsibilities, processes, and tools required for maintaining a production-grade SD-WAN deployment.

### Operations Philosophy

```
ABHAVTECH SD-WAN OPERATIONS FRAMEWORK
=====================================

Vision: Proactive, automated network operations that ensure
        99.99% availability and optimal application performance

Principles:
├── Automation First
│   ├── Reduce manual intervention
│   ├── Consistent operations
│   └── Rapid response
├── Proactive Monitoring
│   ├── Predict failures before impact
│   ├── Trend analysis
│   └── Capacity planning
├── Continuous Improvement
│   ├── Learn from incidents
│   ├── Optimize processes
│   └── Measure outcomes
└── Security Integration
    ├── Zero-trust operations
    ├── Audit everything
    └── Least privilege access
```

---

## Operations Model

### Organizational Structure

```
NETWORK OPERATIONS ORGANIZATION
===============================

                    ┌─────────────────────┐
                    │    IT Director      │
                    │   (Governance)      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────┴────────┐ ┌─────┴─────┐ ┌────────┴────────┐
     │ Network Manager │ │ Security  │ │  Application    │
     │  (Operations)   │ │  Manager  │ │    Manager      │
     └────────┬────────┘ └─────┬─────┘ └────────┬────────┘
              │                │                │
     ┌────────┴────────┐       │                │
     │                 │       │                │
┌────┴────┐ ┌─────────┴───────┴────────────────┘
│ NOC     │ │ Network Engineers (L2/L3)        │
│ (L1)    │ │                                  │
└─────────┘ └──────────────────────────────────┘
```

### Team Responsibilities

| Team | Role | Responsibilities |
|------|------|------------------|
| NOC (L1) | First Response | Monitor alerts, initial triage, escalation, documentation |
| Network Engineers (L2) | Technical Support | Troubleshooting, configuration changes, incident resolution |
| Senior Engineers (L3) | Advanced Support | Complex issues, architecture changes, Cisco TAC coordination |
| Network Manager | Operations Lead | SLA management, process improvement, vendor management |
| Security Manager | Security Ops | Security monitoring, incident response, compliance |

### Support Tiers

```
ESCALATION MATRIX
=================

Tier 1 - NOC (0-15 minutes)
├── Alert acknowledgment
├── Initial diagnostics
├── Known issue resolution
├── Escalation to L2
└── Customer communication

Tier 2 - Network Engineers (15-60 minutes)
├── Advanced troubleshooting
├── Configuration analysis
├── Performance optimization
├── Root cause analysis
└── Escalation to L3

Tier 3 - Senior Engineers (60+ minutes)
├── Complex issue resolution
├── Architecture decisions
├── Cisco TAC engagement
├── Change management
└── Post-incident review

Tier 4 - Cisco TAC (As needed)
├── Software defects
├── Hardware failures
├── Design validation
└── Critical escalations
```

---

## Operations Scope

### In-Scope Components

| Category | Components | Operations Responsibility |
|----------|------------|---------------------------|
| Controllers | vManage, vSmart, vBond | Full operational ownership |
| WAN Edges | All C8300/C8500 routers | Full operational ownership |
| Transports | MPLS, Internet, LTE circuits | Monitoring, vendor coordination |
| SD-Access Integration | Fabric handoff, BGP peering | Shared with LAN team |
| Security Services | ZBFW, UTD, TrustSec | Shared with Security team |

### SD-WAN Infrastructure Map

```
ABHAVTECH SD-WAN OPERATIONS SCOPE
=================================

Controllers (Mumbai DC):
┌─────────────────────────────────────────────────────┐
│ vManage Cluster (3 nodes)                           │
│ ├── MUM-VMANAGE-01 (192.168.10.10) - Primary        │
│ ├── MUM-VMANAGE-02 (192.168.10.11) - Secondary      │
│ └── MUM-VMANAGE-03 (192.168.10.12) - Tertiary       │
│                                                     │
│ vSmart Controllers (2 nodes)                        │
│ ├── MUM-VSMART-01 (192.168.10.20)                   │
│ └── MUM-VSMART-02 (192.168.10.21)                   │
│                                                     │
│ vBond Validators (2 nodes - Cloud)                  │
│ ├── CLOUD-VBOND-01 (AWS Mumbai)                     │
│ └── CLOUD-VBOND-02 (AWS Singapore)                  │
└─────────────────────────────────────────────────────┘

DR Controllers (Chennai DC):
┌─────────────────────────────────────────────────────┐
│ vManage DR (Standby)                                │
│ └── CHE-VMANAGE-DR (192.168.20.10)                  │
│                                                     │
│ vSmart DR                                           │
│ ├── CHE-VSMART-01 (192.168.20.20)                   │
│ └── CHE-VSMART-02 (192.168.20.21)                   │
└─────────────────────────────────────────────────────┘

WAN Edge Devices (9 Sites):
┌─────────────────────────────────────────────────────┐
│ India Region:                                       │
│ ├── Mumbai Hub (2x C8500-12X4QC)                    │
│ ├── Chennai Hub (2x C8500-12X4QC)                   │
│ ├── Bangalore Branch (1x C8300-1N1S-6T)             │
│ ├── Delhi Branch (1x C8300-1N1S-6T)                 │
│ └── Noida Branch (1x C8300-1N1S-6T)                 │
│                                                     │
│ EMEA Region:                                        │
│ ├── London Hub (2x C8300-2N2S-6T)                   │
│ └── Frankfurt Hub (2x C8300-2N2S-6T)                │
│                                                     │
│ Americas Region:                                    │
│ ├── New Jersey Hub (2x C8300-2N2S-6T)               │
│ └── Dallas Hub (2x C8300-2N2S-6T)                   │
└─────────────────────────────────────────────────────┘

Total Managed Devices: 22 WAN Edges + 10 Controllers
```

---

## Service Level Agreements

### Availability SLAs

| Service | Target SLA | Measurement | Current |
|---------|------------|-------------|---------|
| Controller Cluster | 99.99% | Monthly uptime | ____% |
| WAN Edge Availability | 99.95% | Per-device monthly | ____% |
| Hub-to-Hub Connectivity | 99.99% | Path availability | ____% |
| Hub-to-Branch Connectivity | 99.9% | Path availability | ____% |
| SD-Access Handoff | 99.99% | BGP session uptime | ____% |

### Performance SLAs

| Metric | Hub-to-Hub | Hub-to-Branch | Target |
|--------|------------|---------------|--------|
| Latency | ≤ 50ms | ≤ 100ms | 95th percentile |
| Jitter | ≤ 20ms | ≤ 30ms | Average |
| Packet Loss | ≤ 0.01% | ≤ 0.1% | Monthly average |
| Throughput | ≥ 1 Gbps | ≥ 500 Mbps | Guaranteed minimum |

### Response Time SLAs

| Priority | Description | Response Time | Resolution Time |
|----------|-------------|---------------|-----------------|
| P1 - Critical | Complete service outage | 15 minutes | 4 hours |
| P2 - High | Major degradation | 30 minutes | 8 hours |
| P3 - Medium | Partial impact | 2 hours | 24 hours |
| P4 - Low | Minimal impact | 4 hours | 72 hours |

### Priority Definitions

```
INCIDENT PRIORITY MATRIX
========================

P1 - Critical:
├── All hub sites unreachable
├── Controller cluster failure
├── Complete VPN segment outage
├── Security breach detected
└── >50% of tunnels down

P2 - High:
├── Single hub site down
├── Multiple branches affected
├── Single VPN segment impaired
├── Performance below SLA (>20%)
└── Security policy failure

P3 - Medium:
├── Single branch down
├── Backup transport only
├── Intermittent connectivity
├── Non-critical service impact
└── Certificate warning

P4 - Low:
├── Informational alerts
├── Cosmetic issues
├── Feature requests
├── Documentation updates
└── Scheduled maintenance
```

---

## Key Performance Indicators

### Operational KPIs

| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| Mean Time to Detect (MTTD) | < 5 min | Alert to acknowledgment | Per incident |
| Mean Time to Respond (MTTR) | < 15 min | Alert to first action | Per incident |
| Mean Time to Resolve | Per priority SLA | Alert to resolution | Per incident |
| First Call Resolution | > 60% | L1 resolved / Total | Monthly |
| Change Success Rate | > 99% | Successful / Total | Monthly |
| Incident Recurrence | < 5% | Repeat incidents | Monthly |

### Infrastructure KPIs

| KPI | Target | Current | Trend |
|-----|--------|---------|-------|
| Tunnel Availability | 99.9% | ____% | ↑↓→ |
| BFD Session Stability | 99.99% | ____% | ↑↓→ |
| Controller CPU | < 70% avg | ____% | ↑↓→ |
| Controller Memory | < 80% avg | ____% | ↑↓→ |
| OMP Route Convergence | < 5 sec | ____ sec | ↑↓→ |
| Certificate Validity | > 60 days | ____ days | ↑↓→ |

### Business KPIs

| KPI | Target | Current | Impact |
|-----|--------|---------|--------|
| Application Availability | 99.99% | ____% | Revenue |
| User Satisfaction | > 4.5/5 | ____/5 | Productivity |
| Cost per Site | < $XXXX/mo | $____ | Budget |
| WAN Cost Savings | > 30% | ____% | ROI |

---

## Operational Processes

### Daily Operations

| Time | Activity | Responsibility | Duration |
|------|----------|----------------|----------|
| 08:00 | Morning health check | NOC | 30 min |
| 08:30 | Review overnight alerts | L2 Engineer | 30 min |
| 09:00 | Standup meeting | All | 15 min |
| 10:00 | Performance review | L2 Engineer | 30 min |
| 14:00 | Afternoon health check | NOC | 15 min |
| 16:00 | Change review meeting | Change Manager | 30 min |
| 17:00 | End of day summary | NOC | 15 min |

### Weekly Operations

| Day | Activity | Responsibility |
|-----|----------|----------------|
| Monday | Weekly planning meeting | Team |
| Tuesday | Capacity review | L3 Engineer |
| Wednesday | Security posture review | Security |
| Thursday | Change implementation window | L2/L3 |
| Friday | Weekly report generation | NOC |

### Monthly Operations

| Week | Activity | Responsibility |
|------|----------|----------------|
| Week 1 | SLA report generation | Manager |
| Week 2 | Capacity planning review | L3 Engineer |
| Week 3 | Security audit | Security |
| Week 4 | Process improvement review | Team |

---

## Tools and Access

### Operations Tools

| Tool | Purpose | Access Level |
|------|---------|--------------|
| vManage | Primary management | L1-L3 |
| Catalyst Center | SD-Access integration | L2-L3 |
| ISE | Authentication/TrustSec | Security |
| ServiceNow | Ticketing | All |
| Slack | Communication | All |
| PagerDuty | Alerting | On-call |
| Grafana | Dashboards | All |
| Splunk | Log analysis | L2-L3 |

### Access Management

```
ROLE-BASED ACCESS CONTROL
=========================

NOC (L1):
├── vManage: Read-only Dashboard
├── Catalyst Center: Read-only
├── ServiceNow: Create/Update tickets
└── Grafana: View dashboards

Network Engineer (L2):
├── vManage: Operator (limited write)
├── Catalyst Center: Observer
├── ServiceNow: Full ticket access
├── Grafana: View + Create dashboards
└── Splunk: Read access

Senior Engineer (L3):
├── vManage: Network Admin
├── Catalyst Center: Network Admin
├── ServiceNow: Full access
├── All tools: Full access
└── SSH: Device access

Network Manager:
├── vManage: Admin
├── Catalyst Center: Admin
├── All tools: Admin access
└── Approval authority
```

---

## Communication Framework

### Escalation Contacts

| Level | Contact | Phone | Email |
|-------|---------|-------|-------|
| L1 NOC | NOC Team | +91-XXXX-XXXX | noc@abhavtech.com |
| L2 On-Call | On-Call Engineer | +91-XXXX-XXXX | oncall@abhavtech.com |
| L3 Escalation | Sr. Network Engineer | +91-XXXX-XXXX | network-l3@abhavtech.com |
| Management | Network Manager | +91-XXXX-XXXX | netmgr@abhavtech.com |
| Cisco TAC | TAC Support | 1-800-553-2447 | - |

### Communication Channels

| Channel | Purpose | Response Time |
|---------|---------|---------------|
| Slack #sdwan-ops | Real-time operations | Immediate |
| Slack #sdwan-alerts | Automated alerts | Acknowledge < 5 min |
| Email sdwan-team@ | Non-urgent communication | < 4 hours |
| PagerDuty | Critical alerts | < 5 min |
| Teams Bridge | Incident calls | As needed |

### Notification Matrix

| Event | P1 | P2 | P3 | P4 |
|-------|----|----|----|----|
| NOC Team | ✓ | ✓ | ✓ | ✓ |
| L2 Engineer | ✓ | ✓ | - | - |
| L3 Engineer | ✓ | - | - | - |
| Manager | ✓ | ✓ | - | - |
| Director | ✓ | - | - | - |
| Business | ✓ | ✓ | - | - |

---

## Documentation Requirements

### Operational Documentation

| Document | Owner | Review Frequency |
|----------|-------|------------------|
| Operations Runbook | NOC Manager | Quarterly |
| Troubleshooting Guide | L3 Engineer | Bi-annually |
| Escalation Procedures | Manager | Annually |
| Change Procedures | Change Manager | Annually |
| DR Playbook | L3 Engineer | Bi-annually |

### Incident Documentation

```
INCIDENT RECORD REQUIREMENTS
============================

Required Fields:
├── Incident ID (auto-generated)
├── Timestamp (detection, response, resolution)
├── Priority (P1-P4)
├── Affected Components
├── Impact Description
├── Root Cause
├── Resolution Steps
├── Preventive Measures
└── Lessons Learned

Post-Incident Review (P1/P2):
├── Timeline reconstruction
├── Root cause analysis
├── Impact assessment
├── Communication review
├── Process improvements
└── Action items with owners
```

---

## Continuous Improvement

### Improvement Framework

```
CONTINUOUS IMPROVEMENT CYCLE
============================

        ┌─────────────┐
        │   PLAN      │
        │  Identify   │
        │  Improvement│
        └──────┬──────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          │          │
┌───────┐      │      ┌───────┐
│ ACT   │      │      │  DO   │
│Standar│◄─────┴─────►│Implemt│
│-dize  │             │       │
└───┬───┘             └───┬───┘
    │                     │
    │    ┌─────────┐      │
    └───►│  CHECK  │◄─────┘
         │ Measure │
         │ Results │
         └─────────┘
```

### Improvement Metrics

| Area | Current Baseline | Target | Timeline |
|------|------------------|--------|----------|
| MTTR | _____ min | < 30 min (P1) | Q1 |
| Automation | ___% | > 80% | Q2 |
| False Positives | ___% | < 5% | Q1 |
| Change Success | ___% | > 99% | Ongoing |

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| vManage Dashboards | Dashboard guide | Section 6.2 |
| Monitoring Framework | Monitoring design | Section 6.3 |
| Alerting Configuration | Alert setup | Section 6.4 |
| Troubleshooting Guide | Issue resolution | Section 6.8 |
| Operational Runbooks | Day-2 procedures | Section 6.13 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Operations & Monitoring documentation series for Abhavtech.com*
