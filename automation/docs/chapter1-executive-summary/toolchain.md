# 1.3 Toolchain Summary

The automation toolchain is deliberately constrained to enterprise on-premises tools that integrate directly with the existing Abhavtech Cisco infrastructure. No cloud-native CI/CD platforms, containers, or orchestrators are used — this is a network automation framework designed by and for network engineers.

## Core Automation Tools

### Terraform 1.7+

**Purpose**: Infrastructure provisioning and platform configuration

**What Terraform Handles**:

- DNAC site hierarchy (Global → Region → Country → City → Building)
- DNAC network settings (IP pools, DNS, NTP, DHCP, SNMP)
- ISE Security Group Tags (25+ SGTs)
- ISE SGACL policy matrix (150+ rules)
- ISE Network Access Devices (854 devices across 19 sites)
- vManage feature templates (VPN 0, VPN 512, data VPNs)
- vManage device templates (cEdge platforms)
- Webex locations and number management
- CML lab topology (12-node validation environment)

**Why Terraform**:

- **Declarative**: Describe desired state, Terraform figures out how to achieve it
- **Idempotent**: Running `terraform apply` multiple times produces same result
- **State Management**: Tracks what was provisioned, enables clean updates/teardown
- **Provider Ecosystem**: Official providers for DNAC, ISE, SD-WAN, Webex

**Example**:

```hcl
# terraform/dnac/site-hierarchy/mumbai.tf
resource "dnacenter_area" "mumbai_hub" {
  parameters {
    site {
      area {
        name        = "Mumbai Hub"
        parent_name = "Global/APAC/India"
      }
    }
  }
}
```

### Ansible 2.16+

**Purpose**: Day-N device configuration management

**What Ansible Handles**:

- IS-IS underlay routing (loopback interfaces, IS-IS process, authentication)
- LISP/VXLAN overlay (LISP instance, NVE interface, EID prefix registration)
- BGP handoff at fabric borders (eBGP peering, route redistribution)
- 802.1X port configuration (AAA, RADIUS servers, per-port authentication)
- TrustSec inline tagging (CTS manual, SGT propagation)
- Interface configuration (descriptions, VLANs, trunk ports)
- Day-2 operations (compliance checks, config backups)

**Why Ansible**:

- **Agentless**: Uses SSH, no software installation on managed devices
- **YAML-Based**: Network engineers already familiar with YAML from DNAC/Webex APIs
- **Cisco Collections**: Official `cisco.ios`, `cisco.dnac`, `cisco.ise` modules
- **Jinja2 Templates**: Generate configs from templates + variables

**Example**:

```yaml
# ansible/playbooks/underlay-isis.yaml
---
- name: Configure IS-IS Underlay
  hosts: fabric_nodes
  gather_facts: no
  tasks:
    - name: Apply IS-IS configuration
      cisco.ios.ios_config:
        src: ../templates/isis_underlay.j2
```

### Python 3.11+

**Purpose**: Custom API automation for platforms without Terraform providers or when Ansible modules are insufficient

**What Python Handles**:

- SD-WAN feature template creation (complex API payloads not supported by Terraform)
- SD-WAN device template attachment (variable substitution per site)
- SD-WAN policy management (app-aware routing, centralized policies)
- Webex bulk user provisioning (reading HR CSV exports)
- Webex hunt group synchronization (updating based on YAML source of truth)
- Webex Contact Center agent/queue management (skill assignments)
- HashiCorp Vault credential retrieval (helper functions for Terraform/Ansible)
- Custom validation scripts (OMP session checks, fabric health monitoring)

**Why Python**:

- **Flexibility**: Handle complex logic that Terraform/Ansible can't express
- **Libraries**: Rich ecosystem (requests, hvac, dnacentersdk, ciscoisesdk, webexpythonsdk)
- **API Integration**: Native HTTP client for REST APIs
- **Data Processing**: Pandas for CSV parsing, Jinja2 for template rendering

**Example**:

```python
# scripts/webex/provision_users.py
import requests
import pandas as pd

def provision_webex_user(email, first_name, last_name, extension, location_id):
    headers = {
        "Authorization": f"Bearer {get_webex_token()}",
        "Content-Type": "application/json"
    }
    
    # Create person
    person_payload = {
        "emails": [email],
        "displayName": f"{first_name} {last_name}",
        "firstName": first_name,
        "lastName": last_name
    }
    
    response = requests.post(
        "https://webexapis.com/v1/people",
        headers=headers,
        json=person_payload
    )
    
    person_id = response.json()["id"]
    
    # Assign calling config
    calling_payload = {
        "extension": extension,
        "locationId": location_id
    }
    
    requests.put(
        f"https://webexapis.com/v1/people/{person_id}/features/calling",
        headers=headers,
        json=calling_payload
    )
```

### HashiCorp Vault 1.15+

**Purpose**: Secrets management - secure storage and access control for credentials

**What Vault Stores**:

- DNAC API credentials (username, password, token)
- ISE ERS API credentials (username, password)
- ISE RADIUS shared secrets (per NAD group)
- vManage API token
- SSH private keys for device access
- Webex API bearer token
- FMC API credentials
- Database passwords (if using IPAM integration)

**Why Vault**:

- **Zero Credentials in Code**: No hardcoded passwords in Terraform/Ansible/Python
- **RBAC**: Granular policies control which automation tools can access which secrets
- **Audit Logging**: Every secret access logged for compliance
- **Dynamic Secrets**: Generate time-limited credentials (future enhancement)
- **Encryption at Rest**: All secrets encrypted with AES-256-GCM

**Example**:

```python
# scripts/vault_helper.py
import hvac

def get_dnac_credentials():
    client = hvac.Client(url='http://10.252.200.10:8200')
    client.token = os.getenv('VAULT_TOKEN')
    
    secret = client.secrets.kv.v2.read_secret_version(
        path='abhavtech/dnac'
    )
    
    return {
        'username': secret['data']['data']['username'],
        'password': secret['data']['data']['password']
    }
```

### Git / GitHub

**Purpose**: Version control and change approval workflow

**What Git Manages**:

- All Terraform code (`terraform/`)
- All Ansible playbooks and templates (`ansible/`)
- All Python scripts (`scripts/`)
- Documentation (`docs/`)
- Configuration variables (non-secret data)
- Validation results and testing reports

**Workflow**:

```
feature branch → lab → staging → main
      ↓          ↓        ↓         ↓
  PR review  Validation Pre-prod  Tag release
```

**Why Git**:

- **Audit Trail**: Every change tracked with who/what/when
- **Peer Review**: Pull requests enforce architect approval
- **Rollback**: `git revert` undoes bad changes while preserving history
- **Collaboration**: Multiple engineers work on separate features simultaneously
- **CI/CD Integration**: GitHub Actions can run automated validation (future enhancement)

## Supporting Tools

### VS Code + WSL Ubuntu

**Development Environment**:

- Windows 10/11 with WSL 2 (Ubuntu 22.04)
- VS Code with Remote WSL extension
- Integrated terminal for Terraform/Ansible/Python
- Extensions: Terraform, Ansible, Python, YAML, GitLens

### CML (Cisco Modeling Labs)

**Lab Validation**:

- 12-node topology mirroring production fabric
- Pre-production testing of all automation code
- ZTP simulation and validation
- Topology as code (Terraform CML2 provider)

### Pre-Commit Hooks

**Code Quality**:

- YAML linting (yamllint)
- Terraform validation (`terraform validate`)
- Ansible syntax checking (`ansible-playbook --syntax-check`)
- Secrets detection (prevent credential commits)

## What This Toolchain Does NOT Include

Deliberately excluded from this framework:

- **Docker/Kubernetes**: No containerization (network engineers don't need it)
- **Jenkins/GitLab CI**: No cloud-based CI/CD (on-prem Git workflow sufficient)
- **Monitoring Platforms**: Uses existing Splunk/ThousandEyes (not automating observability)
- **IPAM Solutions**: DNAC handles IP pool management
- **Ticketing Integration**: ServiceNow integration is manual (automation runs during approved change windows)

!!! note "Security Note"
    No credentials, API keys, or secrets appear in any Terraform, Ansible, or Python file. All sensitive data is stored in HashiCorp Vault (on-premises) and retrieved at runtime. This is a non-negotiable architectural decision that applies to every section of this document.

---

**Tool Version Summary**:

| Tool | Version | Purpose |
|------|---------|---------|
| Terraform | 1.7+ | Infrastructure provisioning |
| Ansible | 2.16+ | Device configuration |
| Python | 3.11+ | Custom API automation |
| HashiCorp Vault | 1.15+ | Secrets management |
| Git | 2.40+ | Version control |
| VS Code | Latest | Development environment |
| WSL Ubuntu | 22.04 | Linux runtime for tools |
| CML | 2.6+ | Lab validation |

---

**Related Sections**:

- [Chapter 3: Development Environment Setup](../chapter3-dev-environment/README.md) - How to install and configure these tools
- [Chapter 4: Secrets & Security](../chapter4-secrets-security/README.md) - HashiCorp Vault deployment
- [Chapter 5: Git Workflow](../chapter5-git-workflow/README.md) - Branching strategy and pull requests
