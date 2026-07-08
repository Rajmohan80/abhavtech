# 5.1 Branching Strategy

The repository uses a three-branch strategy: **lab**, **staging**, and **main**.

## Branch Purposes

| Branch | Purpose | Who Pushes | Deployment Target |
|--------|---------|-----------|-------------------|
| **lab** | CML validation | Automation Engineers | CML lab environment |
| **staging** | Pre-production testing | Network Architect (via PR approval) | Staging infrastructure |
| **main** | Production deployment | Network Operations (via PR approval) | Production network |

## Workflow

```
feature/add-branch-site
       ↓ (pull request)
      lab
       ↓ (validation passes, PR approved)
   staging
       ↓ (final testing, PR approved)
     main → Production Deployment
```

## Example Commands

```bash
# Create feature branch
git checkout -b feature/configure-dot1x-ports

# Make changes, commit
git add .
git commit -m "Add 802.1X port configuration playbook"

# Push to lab
git push origin feature/configure-dot1x-ports

# Create pull request to lab branch via GitHub/GitLab UI
```

---

**Related Sections**:
- [5.2 Rollback Using Git](rollback.md)
- [2.3 Role Separation](../chapter2-automation-architecture/role-separation.md)
