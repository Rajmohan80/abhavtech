# 10.3 Rollback Procedures

Execute rollback when deployment fails.

## Rollback Steps

1. Identify failed commit: `git log --oneline`
2. Revert commit: `git revert <commit-hash>`
3. Re-apply automation: `ansible-playbook rollback.yml`
4. Validate: Run validation playbook

---

**Related Sections**:
- [5.2 Rollback Using Git](../chapter5-git-workflow/rollback.md)
