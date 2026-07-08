# Chapter 5: Git Repository Structure and Workflow

This chapter establishes the Git branching strategy with lab/staging/main environments, change approval workflow using pull requests, and Git-based rollback procedures for recovering from failed deployments.

## What You'll Learn

### Branching Strategy
Three-tier environment model:

- **lab**: CML validation environment
- **staging**: Pre-production testing
- **main**: Production deployment

Changes flow lab → staging → main with pull request approvals at each gate.

### Change Approval Workflow
Peer review process:

1. Engineer creates feature branch
2. Submits pull request to lab branch
3. Lab validation tests pass
4. Architect approves, merges to lab
5. Promotes to staging via PR
6. Final production approval
7. Tag release in main branch

### Rollback Using Git
Recovery from failed deployments:

- Identify bad commit using `git log`
- Revert specific commit preserving history
- Re-apply Ansible playbooks to restore state
- Validate recovery with automated checks

## Chapter Navigation

- **[5.1 Branching Strategy](branching.md)** - Lab/staging/main workflow
- **[5.2 Rollback Using Git](rollback.md)** - Recovery procedures

## Workflow Example

```
feature/add-noida-branch → lab → staging → main
         ↓                  ↓        ↓         ↓
      PR review       Validation  Pre-prod   Tag v1.2.0
```

!!! success "Change Control Embedded in Tooling"
    Git pull requests replace traditional change tickets. Every deployment requires peer review - the same discipline network engineers follow with manual change tickets, now enforced by the tooling itself.

!!! note "Rollback is Not Destructive"
    `git revert` creates a new commit that undoes changes while preserving history. Never use `git reset --hard` in shared branches - it rewrites history and breaks collaboration.

---

**Previous**: [← Secrets & Security](../chapter4-secrets-security/README.md)  
**Next**: [Terraform Infrastructure Provisioning](../chapter6-terraform/README.md) →
