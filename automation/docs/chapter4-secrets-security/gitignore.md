# 4.5 Git Ignore Configuration

Prevent credentials from entering version control.

## .gitignore

```
# Terraform
*.tfvars
*.tfstate
*.tfstate.backup
.terraform/
terraform.tfvars.json

# Ansible
*.vault
vault_pass.txt
*.retry

# Python
.venv/
__pycache__/
*.pyc

# Secrets
*.pem
*.key
*.crt
.env
credentials.json
```

---

**Related Sections**:
- [3.6 Pre-Commit Hooks](../chapter3-dev-environment/precommit-hooks.md)
- [Chapter 5: Git Workflow](../chapter5-git-workflow/README.md)
