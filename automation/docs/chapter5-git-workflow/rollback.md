# 5.2 Rollback Using Git

Git provides rollback capabilities when automation deployment fails.

## Rollback Methods

### Method 1: Git Revert

```bash
# Identify problematic commit
git log --oneline

# Revert specific commit
git revert a3f21c9

# Push revert
git push origin main

# Re-run Terraform/Ansible with reverted code
terraform apply
```

### Method 2: Reset to Previous Commit

```bash
# WARNING: Destructive operation
# Reset to previous commit
git reset --hard HEAD~1

# Force push (requires branch protection override)
git push --force-with-lease origin main
```

### Method 3: Terraform State Rollback

```bash
# List state versions
terraform state list

# Restore previous state
terraform state pull > backup.tfstate
terraform state push previous-state.tfstate
```

---

**Related Sections**:
- [5.1 Branching Strategy](branching.md)
- [Chapter 10: Validation & Testing](../chapter10-validation-testing/README.md)
