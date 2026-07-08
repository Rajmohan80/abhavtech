# Chapter 12: Operational Automation — Day 2 and Beyond

Day-2 operational automation covering automated compliance checking, device configuration backups, drift detection, scheduled automation tasks, and ongoing operational procedures.

## What You'll Learn

### Automated Compliance Checking
Configuration drift detection:

- Compare live configs against source of truth
- Detect unauthorized manual changes
- Flag configuration deviations
- Generate compliance reports
- Alert NOC via Webex on drift detection

### Automated Device Config Backup
Daily backup procedures:

- Scheduled backup of all device running configs
- Git commit with timestamp and metadata
- Retention policy management
- Restore capability from backup history
- Integration with change management system

### Scheduled Automation Tasks
Recurring operational procedures:

- Daily config backup (2 AM local time)
- Weekly compliance scanning
- Monthly certificate expiration checks
- Quarterly license inventory
- On-demand validation runs

## Chapter Navigation

- **[12.1 Automated Compliance Checking](compliance.md)** - Drift detection
- **[12.2 Automated Device Config Backup](config-backup.md)** - Backup procedures
- **[12.3 Scheduled Automation Tasks](scheduled-tasks.md)** - Recurring operations

## Operational Philosophy

!!! success "Continuous Compliance"
    Compliance is not a point-in-time audit. Daily drift detection ensures configurations match approved source of truth throughout the lifecycle.

!!! tip "Backup Before Change"
    Always capture pre-change configuration backup. Enables fast rollback without requiring Git history navigation.

---

**Previous**: [← Production Deployment](../chapter11-production-deployment/README.md)  
**Next**: [DevNet Resources](../chapter13-devnet-resources/README.md) →
