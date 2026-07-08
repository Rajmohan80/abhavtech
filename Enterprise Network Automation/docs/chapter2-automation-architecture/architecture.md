# 2.1 High-Level Architecture

The automation architecture follows a **hub-spoke model** with a central automation control node orchestrating all configuration changes across the entire Abhavtech infrastructure.

## Architecture Diagram

```
+============================================================================+
|              ABHAVTECH AUTOMATION ARCHITECTURE                              |
+============================================================================+
|                                                                              |
|  +-----------------------------+     +------------------------------+        |
|  |   AUTOMATION CONTROL NODE   |     |      GIT REPOSITORY          |        |
|  |   (Ubuntu WSL / Linux VM)   |     |   abhavtech-automation       |        |
|  |                             |     |   (main/staging/lab)         |        |
|  |  - Terraform 1.7+           |<--->|   - terraform/               |        |
|  |  - Ansible 2.16+            |     |   - ansible/                 |        |
|  |  - Python 3.11+             |     |   - scripts/                 |        |
|  |  - VS Code (Remote WSL)     |     |   - docs/                    |        |
|  +------+-------+---------+----+     +------------------------------+        |
|         |       |         |                                                  |
|         |       |         +----------> +---------------------------+          |
|         |       |                      |   HASHICORP VAULT         |          |
|         |       |                      |   (On-Premises)           |          |
|         |       |                      |   - DNAC API creds        |          |
|         |       |                      |   - ISE ERS/pxGrid creds  |          |
|         |       |                      |   - vManage API token     |          |
|         |       |                      |   - SSH keys              |          |
|         |       |                      |   - Webex API token       |          |
|         |       |                      +---------------------------+          |
|         |       |                                                            |
|    +----v----+  +-----v--------+                                             |
|    | CML LAB |  | PRODUCTION   |                                             |
|    | (VMware) |  | NETWORK      |                                             |
|    |          |  |              |                                             |
|    | Validate |  | DNAC Cluster (10.252.10.x)   - 3 nodes DN2-HW-APL-XL     |
|    | before   |  | ISE Cluster  (10.252.30.x)   - 14 nodes SNS-3655/3695    |
|    | prod     |  | SD-WAN       (vManage)       - vManage, vSmart, vBond     |
|    | deploy   |  | Fabric Nodes (10.252.x.x)    - C9500 BN, C9300 Edge      |
|    |          |  | WAN Edge     (ISR4451/C8500)  - cEdge at 19 sites         |
|    |          |  | WLCs         (10.252.40.x)    - C9800-80/40               |
|    +----------+  | FTD/FMC      (FPR-4115/2130)  - 12 FTDs, 2 FMCs          |
|                  +----------------------------------------------+            |
+==============================================================================+
```

## Component Breakdown

### Automation Control Node

**Platform**: Ubuntu 22.04 (WSL on Windows 10/11 or dedicated Linux VM)

**Installed Tools**:
- **Terraform 1.7+**: Infrastructure provisioning (DNAC, ISE, vManage, Webex)
- **Ansible 2.16+**: Device configuration management
- **Python 3.11+**: Custom API integration scripts
- **VS Code**: Development environment with Remote WSL extension
- **Git**: Version control client

**Network Requirements**:
- Reachability to DNAC cluster (10.252.10.x)
- Reachability to ISE PAN/MNT nodes (10.252.30.x)
- Reachability to vManage (10.252.50.x)
- Reachability to all fabric node management IPs
- Reachability to HashiCorp Vault (10.252.200.10)

### Git Repository Structure

```
abhavtech-automation/
├── terraform/
│   ├── cml-lab/          # CML topology as code
│   ├── dnac/             # Site hierarchy, network settings
│   ├── ise/              # SGTs, NADs, SGACL rules
│   ├── sdwan/            # vManage configuration
│   └── webex/            # Locations, users, queues
├── ansible/
│   ├── inventory/        # Host definitions
│   ├── playbooks/        # Configuration playbooks
│   └── templates/        # Jinja2 templates
├── scripts/
│   ├── sdwan/            # vManage API scripts
│   ├── webex/            # Webex automation
│   └── vault_helper.py   # Vault integration
└── docs/
    └── diagrams/         # Network architecture docs
```

### HashiCorp Vault

**Deployment**: On-premises Ubuntu 22.04 VM at 10.252.200.10

**Stored Credentials**:
- DNAC API credentials (username, password, token)
- ISE ERS API credentials
- ISE pxGrid credentials  
- vManage API token
- SSH private keys for device access
- Webex API bearer token
- FMC API credentials
- RADIUS shared secrets

**Access Control**: Policy-based RBAC limiting which automation tools can access which secrets

### Production Infrastructure

| Component | Details |
|-----------|---------|
| **DNAC Cluster** | 3 nodes DN2-HW-APL-XL at 10.252.10.x |
| **ISE Cluster** | 14 nodes SNS-3655/3695 at 10.252.30.x |
| **SD-WAN Controllers** | vManage, vSmart, vBond at 10.252.50.x |
| **Fabric Nodes** | C9500 Border, C9300 Control/Edge |
| **WAN Edge** | ISR4451, C8500 cEdge at 19 sites |
| **Wireless** | C9800-80/40 WLCs |
| **Security** | 12x FTD, 2x FMC |

##Data Flow

### Provisioning Flow (Terraform)

1. Engineer writes Terraform code in feature branch
2. Code committed to Git (lab branch)
3. Terraform plan executed locally
4. Pull request created for review
5. Architect approves, merges to lab
6. Terraform apply runs (provisions DNAC/ISE/vManage)
7. Validation in CML environment
8. Promotion to staging → main branches

### Configuration Flow (Ansible)

1. Ansible playbook written/updated in feature branch
2. Playbook targets fabric nodes via SSH
3. Credentials retrieved from HashiCorp Vault at runtime
4. Configuration applied via cisco.ios module
5. Validation playbook confirms changes
6. Git commit records what changed

### API Integration Flow (Python)

1. Python script retrieves API credentials from Vault
2. Authenticates to target platform (vManage, Webex, etc.)
3. Performs complex API operations
4. Logs results to file
5. Script execution tracked in Git commit

## Security Boundaries

### Credential Isolation

- No credentials stored in Git repository
- All secrets in HashiCorp Vault with policy-based access
- Terraform state files stored in encrypted backend
- SSH keys rotated quarterly

### Role-Based Access

| Role | Permissions |
|------|-------------|
| **Network Architect** | Code review, approve PRs, production deployment |
| **Automation Engineer** | Write code, submit PRs, lab execution |
| **Network Operations** | Execute approved playbooks, no code modification |

---

**Related Sections**:
- [2.2 Tool Responsibilities Matrix](tool-matrix.md)
- [2.3 Role Separation](role-separation.md)
- [Chapter 4: Secrets & Security](../chapter4-secrets-security/README.md)
