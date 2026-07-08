# Chapter 11: Production Deployment Runbook

Step-by-step production deployment procedures including deployment sequence, pre-deployment checklists, change window execution scripts, and post-deployment validation.

## What You'll Learn

### Deployment Sequence
Phased rollout approach:

1. **Phase 1**: Terraform provisioning (DNAC, ISE infrastructure)
2. **Phase 2**: Ansible Day-N configuration (sequential by layer)
3. **Phase 3**: Validation and smoke testing
4. **Phase 4**: Monitoring and stabilization

### Pre-Deployment Checklist
Critical prerequisites:

- Change ticket approval obtained
- Rollback plan documented
- Lab validation completed successfully
- Stakeholder notification sent
- Maintenance window scheduled
- Backup configurations captured
- Monitoring alerts configured

### Change Window Execution
Production deployment script:

- `deploy-production.sh` wrapper script
- Terraform apply with approval gates
- Ansible playbook execution (IS-IS → LISP → BGP → 802.1X)
- Error handling with `set -euo pipefail`
- Progress logging and timestamps
- Automated validation checks

## Chapter Navigation

- **[11.1 Deployment Sequence](sequence.md)** - Phased rollout approach
- **[11.2 Pre-Deployment Checklist](checklist.md)** - Prerequisites verification
- **[11.3 Change Window Execution](change-window.md)** - Production script

## Deployment Principles

!!! danger "Sequential Dependency Ordering"
    Deploy fabric layers in strict sequence:
    1. IS-IS underlay (routing foundation)
    2. LISP/VXLAN overlay (control plane)
    3. BGP handoff (external connectivity)
    4. 802.1X/TrustSec (security policy)
    
    Never enable 802.1X before ISE NADs are configured - this locks users out.

!!! tip "Change Window Timing"
    Schedule deployments during maintenance windows with:
    - Low user activity (weekends, holidays)
    - Support staff availability
    - Minimum 4-hour window for rollback margin

---

**Previous**: [← Validation & Testing](../chapter10-validation-testing/README.md)  
**Next**: [Operational Automation](../chapter12-operational-automation/README.md) →
