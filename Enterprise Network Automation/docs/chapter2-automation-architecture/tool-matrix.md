# 2.2 Tool Responsibilities Matrix

Each tool in the automation stack has a clearly defined responsibility. Overlapping concerns are resolved by the principle: **Terraform provisions infrastructure, Ansible configures it, Python scripts handle custom API integration**.

## Tool Responsibility Breakdown

| Tool | Primary Responsibility | What It Does | What It Doesn't Do |
|------|----------------------|--------------|-------------------|
| **Terraform** | Infrastructure provisioning | • Create DNAC sites/buildings/floors<br>• Provision ISE nodes, NADs, SGTs<br>• Deploy SD-WAN templates<br>• Provision Webex locations/users<br>• Manage CML lab topology | • Configure device CLI<br>• Push interface configs<br>• Deploy day-N changes<br>• Perform ongoing operations |
| **Ansible** | Device configuration | • Configure fabric nodes (IS-IS, LISP)<br>• Deploy 802.1X/TrustSec policies<br>• Configure BGP handoff<br>• Apply interface templates<br>• Backup device configs | • Create DNAC sites<br>• Provision ISE policy<br>• Manage SD-WAN templates<br>• Complex API workflows |
| **Python** | Custom API integration | • vManage bulk provisioning<br>• Webex complex workflows<br>• Multi-step API orchestration<br>• Custom data transformation<br>• Vault secret retrieval | • Declarative infrastructure<br>• Device CLI configuration<br>• Idempotent operations |

## Decision Tree: Which Tool to Use?

```
Are you creating infrastructure objects (sites, policy elements, users)?
    ├─ YES → Use Terraform
    └─ NO ↓
    
Are you configuring network device CLI (interfaces, routing, VLANs)?
    ├─ YES → Use Ansible
    └─ NO ↓
    
Do you need complex multi-step API workflows or custom logic?
    ├─ YES → Use Python
    └─ NO → Re-evaluate your requirement
```

## Detailed Responsibility Matrix

### Terraform: Infrastructure Provisioning

**Cisco DNA Center (DNAC)**:
- Site hierarchy (areas, buildings, floors)
- Network settings (DNS, NTP, SNMP, Syslog)
- IP pools (management, voice, data)
- Fabric sites creation
- Wireless SSIDs
- Network profiles

**Cisco ISE**:
- Policy elements (SGTs, SGACLs, network device groups)
- Network access devices (NADs)
- Endpoint identity groups
- Authorization profiles
- RADIUS shared secrets
- Downloadable ACLs (DACLs)

**SD-WAN vManage**:
- Feature templates (VPN, interfaces, routing)
- Device templates (WAN edge, service VPN)
- Policy definitions (control, data, application-aware routing)
- Security policies (firewall, IPS)

**Webex**:
- Locations
- Users and licenses
- Call queues
- Auto attendants
- Hunt groups

**CML (Cisco Modeling Labs)**:
- Lab topology creation
- Node provisioning (routers, switches, controllers)
- Link connectivity
- Configuration injection

### Ansible: Device Configuration

**Fabric Devices (Catalyst 9k)**:
- IS-IS underlay configuration
- LISP/VXLAN overlay configuration
- 802.1X authentication (dot1x system-auth-control)
- TrustSec CTS configuration
- BGP handoff to WAN routers
- Interface templates (access, trunk, routed)
- QoS policies
- Device hardening (banners, logging, SNMP)

**SD-WAN Devices (cEdge)**:
- Day-N configuration changes
- Interface modifications
- VPN adjustments
- Template attachments (via vManage API)

**Wireless LAN Controllers (C9800)**:
- WLAN configuration
- RF profile tuning
- Client policies

**Configuration Management**:
- Automated backup of running-config
- Configuration drift detection
- Compliance checking
- Rollback execution

### Python: Custom API Integration

**vManage SD-WAN**:
- Bulk device provisioning (100+ edge routers)
- Template variable CSV import
- Multi-site policy deployment
- Custom reporting (bandwidth usage, SLA metrics)
- API authentication token refresh

**Webex**:
- Bulk user creation from CSV
- Call queue configuration from Excel
- Agent assignment automation
- CDR (Call Detail Record) export

**HashiCorp Vault**:
- Secret retrieval for Terraform/Ansible
- Dynamic credential generation
- Token renewal
- Policy enforcement

**Cross-Platform Orchestration**:
- DNAC → ISE integration (push SGT mappings)
- ISE → FMC integration (push TrustSec policy to FTD)
- SD-WAN → DNAC integration (sync site metadata)

## Overlap Resolution

### Scenario 1: ISE Network Device (NAD) Onboarding

**Question**: Should we use Terraform to create the NAD in ISE or Ansible to configure the device's RADIUS settings?

**Answer**: Both

1. **Terraform**: Create the NAD object in ISE with RADIUS shared secret
2. **Ansible**: Configure the device CLI with `radius server` and `aaa` commands

```hcl
# Terraform: ISE NAD provisioning
resource "ise_network_device" "fabric_edge_01" {
  name             = "fabric-edge-01.abhavtech.local"
  ip_address       = "10.252.1.101"
  radius_secret    = data.vault_generic_secret.radius_key.data["secret"]
  device_type      = "Cisco Catalyst 9300"
  location         = "HQ-Building-A"
}
```

```yaml
# Ansible: Device CLI configuration
- name: Configure RADIUS server
  cisco.ios.ios_config:
    lines:
      - radius server ISE-PSN-01
      - address ipv4 10.252.30.10 auth-port 1812 acct-port 1813
      - key {{ vault_radius_secret }}
```

### Scenario 2: SD-WAN Feature Template Application

**Question**: Should we use Terraform to create the template or Python to attach it to devices?

**Answer**: Terraform for template creation, Python for bulk device attachment

1. **Terraform**: Create feature templates (VPN, interface, routing)
2. **Python**: Attach templates to 100+ edge devices via CSV import

**Rationale**: Terraform excels at declarative template definition. Python excels at bulk operations with complex CSV parsing and error handling.

### Scenario 3: Ansible vs Python for API Calls

**Question**: When should we use Ansible's `uri` module vs a Python script for API calls?

**Answer**: 

- **Use Ansible** when:
  - Single API call per device (e.g., trigger compliance check)
  - Standard CRUD operations (create, read, update, delete)
  - Idempotency is required
  - Need to iterate over inventory hosts

- **Use Python** when:
  - Multi-step API workflow (auth → query → transform → post → verify)
  - Complex data transformation (CSV → JSON → API payload)
  - Error handling with retry logic
  - Custom business logic (if-then-else based on API response)

## Example: End-to-End Fabric Site Deployment

Demonstrates how all three tools work together:

### Step 1: Terraform Provisions Infrastructure

```hcl
# Create site in DNAC
resource "dnacenter_site" "hq_building_a" {
  site_hierarchy = "Global/North-America/HQ/Building-A"
  site_type      = "building"
}

# Create IP pool
resource "dnacenter_global_pool" "data_pool" {
  ip_pool_name = "HQ-Data-Pool"
  ip_pool_cidr = "10.100.0.0/16"
}

# Create fabric site
resource "dnacenter_fabric_site" "hq_building_a" {
  site_name_hierarchy = dnacenter_site.hq_building_a.site_hierarchy
}

# Create ISE SGT
resource "ise_security_group" "employees" {
  name        = "Employees"
  description = "Corporate employee devices"
  value       = 10
}
```

### Step 2: Ansible Configures Devices

```yaml
---
- name: Configure IS-IS Underlay on Fabric Nodes
  hosts: fabric_nodes
  tasks:
    - name: Enable IS-IS
      cisco.ios.ios_config:
        lines:
          - router isis UNDERLAY
          - net 49.0001.{{ inventory_hostname }}.00
          - metric-style wide
```

### Step 3: Python Orchestrates Complex Workflows

```python
# Sync SGT mappings from ISE to DNAC
import requests
from vault_helper import get_secret

ise_sgts = requests.get(
    f"https://{ise_ip}/ers/config/sgt",
    auth=(get_secret('ise_username'), get_secret('ise_password'))
).json()

for sgt in ise_sgts['SearchResult']['resources']:
    dnac_payload = {
        "name": sgt['name'],
        "scalableGroupType": "USER_DEVICE"
    }
    requests.post(
        f"https://{dnac_ip}/dna/intent/api/v1/trust-sec/sgt",
        headers={"X-Auth-Token": get_secret('dnac_token')},
        json=dnac_payload
    )
```

## Tool Selection Checklist

Before writing automation code, ask:

- [ ] Am I creating an **object** (site, policy, user)? → Terraform
- [ ] Am I configuring **device CLI** (interface, routing, VLAN)? → Ansible  
- [ ] Do I need **multi-step API logic** with transforms? → Python
- [ ] Is this **idempotent and declarative**? → Terraform or Ansible
- [ ] Do I need **custom retry/error handling**? → Python
- [ ] Am I working with **CSV/Excel bulk data**? → Python
- [ ] Is this a **one-time provisioning** task? → Terraform
- [ ] Is this an **ongoing operational** task? → Ansible or Python

---

**Related Sections**:
- [2.1 High-Level Architecture](architecture.md) - Overall automation architecture
- [2.3 Role Separation](role-separation.md) - Who writes what code
- [Chapter 6: Terraform Provisioning](../chapter6-terraform/README.md) - Terraform implementation details
- [Chapter 8: Ansible Configuration](../chapter8-ansible/README.md) - Ansible playbook examples
