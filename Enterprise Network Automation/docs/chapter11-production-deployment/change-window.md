# 11.3 Change Window Execution

Execute during approved change window.

## Execution Steps

```bash
# 1. Pull latest main branch
git pull origin main

# 2. Run Terraform
cd terraform/dnac
terraform apply

# 3. Run Ansible
cd ../../ansible
ansible-playbook -i inventory/production.yml playbooks/configure-fabric.yml

# 4. Validate
ansible-playbook -i inventory/production.yml playbooks/validate-fabric.yml
```

---

**Related Sections**:
- [Chapter 10: Validation & Testing](../chapter10-validation-testing/README.md)
