# 2.3 Role Separation

The automation framework defines clear boundaries between the **Network Architect** (design authority), the **Automation Engineer** (tooling expert), and the **Network Operations** team (execution).

## Three-Role Model

| Role | Responsibility | Permissions | Accountability |
|------|---------------|-------------|----------------|
| **Network Architect** | Network design authority | • Approve pull requests<br>• Production deployment authority<br>• Read-only code access | Correctness of network design |
| **Automation Engineer** | Write automation code | • Write Terraform/Ansible/Python<br>• Submit pull requests<br>• Lab execution only | Code quality, idempotency, safety |
| **Network Operations** | Execute approved automation | • Run approved playbooks<br>• Production execution<br>• No code modification | Proper execution procedures |

## Why Separation Matters

!!! warning "Security Principle: Separation of Duties"
    **No single person can both write automation code AND approve its deployment to production.** The Git pull request workflow enforces peer review — the same change control discipline that network engineers already follow with change tickets, now embedded in the tooling.

### Traditional Change Management

**Before Automation**:
```
Engineer: Writes change request ticket
Manager: Reviews and approves ticket
Engineer: Executes change during change window
```

**With Automation**:
```
Automation Engineer: Writes Terraform/Ansible code
Network Architect: Reviews code, approves pull request
Network Operations: Executes approved automation
```

The separation is **identical** — only the medium has changed from "change ticket" to "Git pull request."

## Network Architect Role

### Responsibilities

**Design Authority**:
- Define network architecture (SD-Access fabric, SD-WAN topology, ISE policy model)
- Approve all configuration standards
- Review automation code for correctness
- Final sign-off on production deployment

**Code Review**:
- Review pull requests for:
  - Adherence to design standards
  - Correct VLAN assignments, IP addressing, routing protocols
  - Proper SGT/SGACL mappings
  - Compliance with security policies
- Reject code that violates design principles

**Production Gatekeeping**:
- Approve merge to `main` branch (production)
- Schedule change windows
- Rollback authority if issues arise

### Permissions

**Git Repository**:
- Read access to all branches
- Write access to `main` branch only (via pull request approval)
- Cannot directly push to `main` without review

**Infrastructure Access**:
- Read-only access to DNAC, ISE, vManage, FMC
- View dashboards, policies, device inventory
- No direct configuration access (forces automation workflow)

**HashiCorp Vault**:
- Read access to view policies
- Cannot retrieve production credentials directly
- Credentials only accessible via Terraform/Ansible at runtime

### Example Workflow

```bash
# Network Architect reviewing a pull request

# 1. Check out the feature branch
git checkout feature/add-branch-site-dallas

# 2. Review the code
cat terraform/dnac/dallas_site.tf

# Validates:
# - Correct site hierarchy: Global/North-America/Dallas
# - IP pool doesn't overlap with existing allocations
# - DNS/NTP servers match corporate standards
# - Fabric site settings align with design template

# 3. Test in CML lab
cd terraform/dnac
terraform plan  # Review planned changes
# Architect confirms plan matches design intent

# 4. Approve pull request via GitHub/GitLab UI
# Add comment: "Approved - Dallas site follows HQ design pattern"

# 5. Merge to staging branch
git checkout staging
git merge feature/add-branch-site-dallas

# 6. After staging validation, approve merge to main
# This triggers production deployment
```

## Automation Engineer Role

### Responsibilities

**Code Development**:
- Write Terraform HCL for infrastructure provisioning
- Write Ansible playbooks for device configuration
- Write Python scripts for complex API workflows
- Maintain code quality (linting, testing, documentation)

**Testing**:
- Validate all code in CML lab environment
- Run `terraform plan` and review output
- Execute `ansible-playbook --check` (dry-run mode)
- Fix bugs identified during testing

**Documentation**:
- Document playbook parameters
- Maintain README files for each module
- Update runbooks for operational procedures

### Permissions

**Git Repository**:
- Write access to `lab` and `staging` branches
- Create feature branches
- Submit pull requests to `main`
- **Cannot** merge own pull requests (requires Architect approval)

**CML Lab Environment**:
- Full access to lab DNAC, ISE, vManage instances
- Deploy/destroy lab topology freely
- Test destructive operations safely

**No Production Access**:
- Cannot access production DNAC/ISE/vManage directly
- Cannot execute automation against production (enforced by network ACLs)
- Production deployment requires Network Operations execution

### Example Workflow

```bash
# Automation Engineer developing new automation

# 1. Create feature branch
git checkout -b feature/configure-802.1x-access-ports

# 2. Write Ansible playbook
cat > ansible/playbooks/configure-dot1x-access.yaml << 'EOF'
---
- name: Configure 802.1X on Access Ports
  hosts: fabric_edge_nodes
  tasks:
    - name: Enable 802.1X globally
      cisco.ios.ios_config:
        lines:
          - dot1x system-auth-control
          
    - name: Configure access ports
      cisco.ios.ios_config:
        parents: "interface {{ item }}"
        lines:
          - switchport mode access
          - switchport access vlan 100
          - authentication port-control auto
          - dot1x pae authenticator
      loop: "{{ access_ports }}"
EOF

# 3. Test in CML lab
cd ansible
ansible-playbook -i inventory/lab.yml playbooks/configure-dot1x-access.yaml --check

# 4. Execute in lab (remove --check)
ansible-playbook -i inventory/lab.yml playbooks/configure-dot1x-access.yaml

# 5. Validate configuration
ansible-playbook -i inventory/lab.yml playbooks/validate-dot1x.yaml

# 6. Commit and push
git add .
git commit -m "Add 802.1X access port configuration playbook"
git push origin feature/configure-802.1x-access-ports

# 7. Create pull request via GitHub/GitLab UI
# Request review from Network Architect
# Explain: "Configures 802.1X on access ports per design doc v2.3"

# 8. Address review comments
# Architect requests: "Add VLAN validation check"
# Engineer updates playbook, pushes changes
git commit --amend
git push --force-with-lease

# 9. Wait for approval
# Architect approves → merges to staging
# After staging validation → Architect merges to main
# Network Ops executes against production
```

## Network Operations Role

### Responsibilities

**Production Execution**:
- Execute approved Terraform plans
- Run approved Ansible playbooks
- Monitor execution logs
- Report failures to Automation Engineer

**Change Window Management**:
- Schedule maintenance windows
- Communicate outages to stakeholders
- Execute rollback if deployment fails

**Operational Monitoring**:
- Verify automation execution success
- Check device reachability post-change
- Validate service availability

### Permissions

**Git Repository**:
- Read-only access to `main` branch
- Clone repository to execution environment
- **Cannot** modify code or create branches

**Production Infrastructure**:
- Execute Terraform/Ansible via approved scripts
- No direct GUI access to DNAC/ISE/vManage
- SSH access to devices for emergency troubleshooting only

**HashiCorp Vault**:
- Retrieve production credentials via Terraform/Ansible
- Credentials auto-expire after playbook execution
- No ability to view or export credentials manually

### Example Workflow

```bash
# Network Operations executing approved automation

# 1. Clone repository (main branch)
git clone https://github.com/abhavtech/automation.git
cd automation
git checkout main  # Confirmed approved by Architect

# 2. Review Terraform plan
cd terraform/dnac
terraform plan -out=tfplan

# Save plan output to change ticket:
# "Terraform will create 1 site, 3 IP pools, 2 fabric sites"

# 3. Execute during scheduled change window
# Change Ticket #CHG0012345 approved: 2024-03-15 02:00-04:00 UTC

terraform apply tfplan

# 4. Verify execution
terraform show | grep 'resource "dnacenter_site"'
# Confirmed: dallas_branch site created

# 5. Document in change ticket
# "Deployment successful. Dallas site visible in DNAC GUI."
# "No errors in terraform.log"
# "All fabric nodes reachable via ping"

# 6. If failure occurs
# Initiate rollback procedure:
git revert HEAD
terraform apply  # Reverts to previous state
# Notify Architect and Engineer via Slack/email
```

## Enforcement Mechanisms

### Git Branch Protection

**`main` branch settings**:
- Require pull request before merging
- Require review from Network Architect role
- Dismiss stale reviews when new commits pushed
- Require status checks to pass (linting, terraform validate)
- No force push allowed
- No deletion allowed

**`staging` branch settings**:
- Allow Automation Engineer direct push
- Require successful CI/CD pipeline
- Auto-delete branch after merge to `main`

**Feature branches**:
- Any engineer can create
- Auto-delete 30 days after last commit

### Network ACLs

**Automation Control Node**:
- `lab` branch execution → Routes to CML lab subnet (10.252.100.0/24)
- `staging` branch execution → Routes to staging subnet (10.252.150.0/24)
- `main` branch execution → Routes to production subnet (10.252.0.0/16)

**Role-Based IP Filtering**:
- Automation Engineer workstation → Can reach CML lab, cannot reach production
- Network Operations workstation → Can reach production, cannot push to Git
- Network Architect workstation → Can reach all environments read-only

### Vault Policies

```hcl
# Automation Engineer policy: Lab credentials only
path "secret/data/lab/*" {
  capabilities = ["read"]
}

path "secret/data/production/*" {
  capabilities = ["deny"]
}

# Network Operations policy: Production credentials via automation only
path "secret/data/production/*" {
  capabilities = ["read"]
  # Requires valid Terraform/Ansible service account token
  # Human users cannot retrieve directly
}
```

## Audit Trail

Every action is logged and attributed:

| Action | Log Location | Retention | Who Can View |
|--------|-------------|-----------|--------------|
| Git commit | GitHub/GitLab audit log | Indefinite | All team members |
| Pull request approval | GitHub/GitLab | Indefinite | All team members |
| Terraform apply | Terraform state history + syslog | 1 year | Network Architect, Ops |
| Ansible playbook execution | Ansible Tower logs | 90 days | Automation Engineer, Ops |
| Vault secret access | Vault audit log | 1 year | Security team only |
| DNAC configuration change | DNAC audit log | 1 year | Network Architect |

### Sample Audit Query

```bash
# Who deployed the Dallas site?
git log --all --grep="dallas" --pretty=format:"%h %an %ad %s"

# Output:
# a3f21c9 John Doe 2024-03-15 Add Dallas branch site (Architect approved)
# b8e44f2 Jane Smith 2024-03-14 Initial Dallas site Terraform code (Engineer)

# What credentials were accessed during deployment?
vault audit list
vault read sys/audit/file

# Shows: 
# Terraform service account accessed secret/production/dnac_api_creds
# Timestamp: 2024-03-15 02:15:33 UTC
```

---

**Related Sections**:
- [2.1 High-Level Architecture](architecture.md) - Automation workflow
- [2.2 Tool Responsibilities Matrix](tool-matrix.md) - Terraform vs Ansible vs Python
- [Chapter 5: Git Workflow](../chapter5-git-workflow/README.md) - Branching strategy details
- [Chapter 4: Secrets & Security](../chapter4-secrets-security/README.md) - Vault policies and RBAC
