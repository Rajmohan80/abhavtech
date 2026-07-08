# Operations & Day 2

This chapter covers ongoing operations, monitoring, user onboarding, change management, weekly operational procedures, and troubleshooting guides for managing Webex Calling and Contact Center in production.

## Chapter Overview

### Sections

**[8.1 Monitoring & Alerting ->](monitoring-alerting.md)**  
Complete operations guide including monitoring dashboards, user onboarding procedures, change management processes, weekly operations checklists, and troubleshooting decision trees

**[8.2 User Onboarding ->](user-onboarding.md)**  
New user provisioning, device setup, mobile app configuration, training materials, user acceptance procedures

**[8.3 Change Management ->](change-management.md)**  
Change request process, approval workflows, maintenance windows, configuration backups, rollback procedures

**[8.4 Weekly Operations ->](weekly-operations.md)**  
Weekly health checks, capacity monitoring, license management, security patching, compliance audits

**[8.5 Troubleshooting Guides ->](troubleshooting-guides.md)**  
Decision trees for common issues, call quality troubleshooting, PSTN connectivity issues, India toll bypass validation, escalation procedures

---

## Operational Model

### Support Tiers

**Tier 1: Helpdesk**
- User password resets
- Basic troubleshooting (can't make/receive calls)
- Device provisioning
- Feature enablement requests
- **Response Time**: 15 minutes
- **Resolution Target**: 80% of issues

**Tier 2: UC Engineers**
- Advanced troubleshooting
- Call quality issues
- PSTN trunk issues
- Configuration changes
- **Response Time**: 30 minutes
- **Resolution Target**: 95% of escalated issues

**Tier 3: Vendor TAC**
- Platform issues
- Software bugs
- Infrastructure failures
- **Response Time**: 1 hour (Severity 1), 4 hours (Severity 2)

### Roles & Responsibilities

| Role | Responsibilities | Tools |
|------|------------------|-------|
| **UC Administrator** | Daily monitoring, user provisioning, change execution | Control Hub, Analytics |
| **Network Engineer** | QoS monitoring, firewall management, bandwidth analysis | SDWAN dashboard, NetFlow |
| **PSTN Engineer** | Trunk monitoring, LGW maintenance, carrier coordination | CUBE CLI, RTMT |
| **Security Admin** | Access control, audit logging, compliance reporting | Control Hub, SIEM |

---

## Monitoring & Alerting

### Key Performance Indicators

**Call Quality Metrics**:
- **MOS Score**: Target >4.0, Alert <3.5
- **Packet Loss**: Target <1%, Alert >2%
- **Jitter**: Target <30ms, Alert >50ms
- **Latency**: Target <150ms, Alert >200ms

**Availability Metrics**:
- **Service Uptime**: Target 99.99%
- **PSTN Trunk Availability**: Target 100%
- **Call Success Rate**: Target >99%

**Capacity Metrics**:
- **License Utilization**: Monitor at 80%, Alert at 90%
- **Trunk Utilization**: Monitor at 70%, Alert at 85%
- **Bandwidth Utilization**: Monitor per site

### Monitoring Dashboards

**Control Hub Analytics**:
- Real-time call activity
- Call quality trends
- User adoption metrics
- Feature utilization

**Webex Calling Reports**:
- Call detail records (CDR)
- Trunk utilization
- Quality of service (QoS)
- User activity logs

**Custom Dashboards** (via API):
- India toll bypass compliance dashboard
- Multi-region capacity utilization
- PSTN cost analysis
- Incident tracking

---

## Weekly Operations Checklist

### Week 1: Health Checks

**Monday**:
- [ ] Review call quality metrics (MOS, packet loss, jitter)
- [ ] Check PSTN trunk health (all regions)
- [ ] Verify LGW connectivity (India sites)
- [ ] Review weekend incident logs

**Tuesday**:
- [ ] Analyze call volume trends
- [ ] Check license consumption
- [ ] Review user-reported issues
- [ ] Verify backup completion

**Wednesday**:
- [ ] Network bandwidth analysis
- [ ] QoS policy validation
- [ ] Firewall rule review
- [ ] DNS health check

**Thursday**:
- [ ] India toll bypass compliance audit
- [ ] Emergency services testing (non-production numbers)
- [ ] Review change requests for upcoming week
- [ ] Capacity planning review

**Friday**:
- [ ] Week-end summary report
- [ ] Update capacity forecast
- [ ] Plan next week's maintenance
- [ ] Knowledge base updates

### Week 2-4: Recurring Tasks

**Biweekly**:
- Security patch review and planning
- Vendor release notes review
- Disaster recovery test (tabletop)

**Monthly**:
- Full backup validation
- Compliance audit (India/EMEA)
- Vendor performance review
- User satisfaction survey

---

## Troubleshooting Quick Reference

### Common Issues & Resolution

**Issue**: User can't make outbound calls
- Check user license status
- Verify calling policy (outbound permissions)
- Check PSTN trunk availability
- Review recent configuration changes

**Issue**: Poor call quality (choppy audio)
- Check network latency/jitter/packet loss
- Verify QoS markings on WAN
- Check bandwidth utilization
- Review firewall NAT/SIP ALG settings

**Issue**: India calls not routing via correct LGW
- Verify Zone/Edge configuration
- Check trunk group assignments
- Review route list configuration
- Validate telecom circle mapping

**Issue**: Emergency services failing
- Test emergency service trunk
- Verify E911 address configuration
- Check location assignment
- Contact PSTN provider

### Escalation Criteria

**Immediate Escalation** (Severity 1):
- Emergency services unavailable
- Complete site outage (>50% users affected)
- PSTN connectivity loss (all trunks down)
- Security incident

**4-Hour Escalation** (Severity 2):
- Partial site outage (<50% users)
- Call quality degradation (site-wide)
- Single PSTN trunk failure
- Feature unavailable (hunt groups, voicemail)

---

## Change Management

### Change Windows

**Standard Changes** (pre-approved):
- User provisioning: 24x7
- License assignments: 24x7
- Password resets: 24x7
- Basic feature enablement: Business hours

**Non-Standard Changes** (requires approval):
- Dial plan modifications: Maintenance window
- PSTN trunk changes: Maintenance window
- Network configuration: Maintenance window
- LGW/Zone software upgrades: Maintenance window

### Maintenance Windows

| Region | Maintenance Window (Local Time) |
|--------|--------------------------------|
| **India** | Saturday 23:00 - Sunday 05:00 IST |
| **UK** | Sunday 01:00 - 05:00 GMT |
| **EU** | Sunday 02:00 - 06:00 CET |
| **Americas** | Sunday 00:00 - 04:00 EST |

---

## Continuous Improvement

### Monthly Review Topics

- Incident trend analysis
- User adoption metrics
- Cost optimization opportunities
- Feature utilization review
- Capacity planning updates
- Vendor roadmap alignment

### Quarterly Business Reviews

- Service level achievement
- Cost vs budget analysis
- User satisfaction survey results
- Technology roadmap updates
- Compliance audit results

---

## Next Steps

1. Review [AI Features & Roadmap](../chapter9-ai-features/README.md) for future enhancements
2. Review **Appendix J** for detailed troubleshooting procedures
3. Establish monitoring baselines within first 30 days
4. Schedule regular operations reviews with stakeholders
