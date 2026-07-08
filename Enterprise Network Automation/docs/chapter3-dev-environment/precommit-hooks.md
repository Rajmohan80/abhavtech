# 3.6 Pre-Commit Hooks

Pre-commit hooks automatically validate code before Git commits, catching errors early in the development process.

## Installation

```bash
# Install pre-commit framework
pip install pre-commit

# Verify
pre-commit --version
```

## Configuration

Create `.pre-commit-config.yaml` in repository root:

```yaml
---
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-added-large-files
        args: ['--maxkb=500']
      
  - repo: https://github.com/antonbabenko/pre-commit-terraform
    rev: v1.88.0
    hooks:
      - id: terraform_fmt
      - id: terraform_validate
      
  - repo: https://github.com/ansible/ansible-lint
    rev: v24.2.0
    hooks:
      - id: ansible-lint
        files: \.(yaml|yml)$
```

## Enable Hooks

```bash
# Install hooks in .git/hooks/
pre-commit install

# Run manually on all files
pre-commit run --all-files
```

## What It Does

Before every `git commit`, pre-commit automatically:

1. Removes trailing whitespace
2. Ensures files end with newline
3. Validates YAML/JSON syntax
4. Formats Terraform code
5. Validates Terraform configuration
6. Lints Ansible playbooks

If any check fails, commit is blocked until fixed.

---

**Related Sections**:
- [3.5 Git Repository Structure](git-structure.md)
- [Chapter 5: Git Workflow](../chapter5-git-workflow/README.md)
