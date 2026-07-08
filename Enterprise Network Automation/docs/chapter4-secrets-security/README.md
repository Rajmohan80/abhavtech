# Chapter 4: Secrets and Security Management

Critical security chapter covering HashiCorp Vault deployment for secrets management, runtime credential retrieval patterns, Ansible Vault for playbook-level secrets, RBAC for automation accounts, and Git ignore configuration to prevent credential leakage.

## What You'll Learn

### HashiCorp Vault Deployment
On-premises secrets management architecture:

- Vault server installation on Ubuntu 22.04
- Initialization and unsealing procedures
- KV v2 secrets engine configuration
- Policy-based access control
- Audit logging for compliance

### Credential Storage Strategy
Organized storage for all automation credentials:

- DNAC API credentials and tokens
- ISE ERS/pxGrid usernames and passwords
- vManage API authentication
- SSH private keys for device access
- Webex API tokens
- FMC API credentials
- RADIUS shared secrets

### Runtime Retrieval Patterns
How automation tools fetch secrets:

- **Python**: Vault helper class using hvac library
- **Terraform**: Vault data sources for variable injection
- **Ansible**: Lookup plugins for credential retrieval

### Ansible Vault for Playbook Secrets
Secondary encryption for playbook-specific data:

- Encrypting variable files with ansible-vault
- Password file management
- Integration with automation workflows

### RBAC for Automation Accounts
Principle of least privilege:

- Dedicated service accounts per tool
- Vault policies limiting secret access
- DNAC/ISE role-based permissions
- Audit trail requirements

### Git Ignore Configuration
Preventing credential leakage:

- Terraform state files (contain secrets in plaintext)
- Terraform variable files
- Vault tokens and password files
- SSH private keys
- Python virtual environments

## Chapter Navigation

- **[4.1 HashiCorp Vault Deployment](vault-deployment.md)** - Installation and configuration
- **[4.2 Retrieving Credentials at Runtime](runtime-credentials.md)** - Integration patterns
- **[4.3 Ansible Vault for Playbook Secrets](ansible-vault.md)** - Secondary encryption
- **[4.4 RBAC for Automation Accounts](rbac.md)** - Access control model
- **[4.5 Git Ignore Configuration](gitignore.md)** - Preventing credential commits

## Security Principles

!!! danger "Zero Credentials in Code"
    No credentials, API keys, or secrets appear in any Terraform, Ansible, or Python file. All sensitive data is stored in HashiCorp Vault and retrieved at runtime. This is non-negotiable.

!!! warning "Terraform State Contains Secrets"
    Terraform state files contain credentials in plaintext after provisioning. Never commit `terraform.tfstate` to Git. Use remote state backends with encryption.

!!! tip "Vault High Availability"
    For production, deploy Vault in HA mode with 3+ nodes using Raft storage backend. This chapter shows single-node deployment for lab validation.

---

**Previous**: [← Development Environment](../chapter3-dev-environment/README.md)  
**Next**: [Git Repository Workflow](../chapter5-git-workflow/README.md) →
