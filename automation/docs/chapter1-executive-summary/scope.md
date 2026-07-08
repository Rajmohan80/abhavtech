# 1.2 Scope and Relationship to Existing Documentation

This automation framework directly maps to the existing Abhavtech documentation suite. Every Terraform resource, Ansible playbook, and Python script in this document automates a process that is manually described in the corresponding source document.

## Documentation Mapping

| Manual Documentation | Automation Implementation |
|---------------------|---------------------------|
| **SD-Access Fabric Deployment Guide** | `terraform/dnac/` - Site hierarchy, IP pools, network settings<br>`ansible/playbooks/underlay-isis.yaml` - IS-IS routing<br>`ansible/playbooks/overlay-lisp-vxlan.yaml` - LISP/VXLAN control/data plane |
| **ISE 3.x TrustSec Policy Design** | `terraform/ise/sgts/` - Security Group Tag provisioning<br>`terraform/ise/sgacl_rules/` - Security Group ACL matrix<br>`ansible/playbooks/dot1x-trustsec.yaml` - 802.1X + SGT tagging |
| **SD-WAN Deployment Guide** | `terraform/vmanage/` - Controller infrastructure<br>`scripts/sdwan/create_feature_templates.py` - VPN/interface templates<br>`scripts/sdwan/attach_device_template.py` - Device onboarding |
| **Webex Calling Deployment** | `terraform/webex/locations.tf` - Site configuration<br>`scripts/webex/provision_users.py` - Bulk user creation<br>`scripts/webex/sync_hunt_groups.py` - Call routing |
| **Webex Contact Center Config** | `scripts/webex/sync_wxcc_agents.py` - Agent provisioning<br>`ansible/group_vars/webex/wxcc_agents.yaml` - Skill assignments |
| **Zero Trust Architecture** | `terraform/ise/network-devices/` - NAD bulk onboarding<br>`ansible/playbooks/bgp-handoff.yaml` - External routing with security zones |

## How to Use This Documentation

### For Network Architects

Use this automation framework to:

1. **Validate Design Decisions**: See how manual designs translate to Infrastructure-as-Code
2. **Plan Deployments**: Understand dependencies between components (e.g., IS-IS must precede LISP)
3. **Review Changes**: Approve pull requests with full visibility into what configs change

### For Automation Engineers

Use this documentation to:

1. **Build Automation**: Copy Terraform modules and Ansible playbooks as starting templates
2. **Customize for Your Environment**: Adapt examples to your IP addressing, hostnames, VLANs
3. **Integrate with CI/CD**: Use Git workflow patterns for automated validation/deployment

### For Network Operations

Use this documentation to:

1. **Execute Deployments**: Run playbooks during approved change windows
2. **Troubleshoot**: Understand what automation changed when issues arise
3. **Validate State**: Use validation playbooks to verify fabric health

## What This Documentation Does NOT Cover

This framework focuses on **network infrastructure automation**. It does NOT cover:

- **Application-layer services**: Web servers, databases, middleware (use Kubernetes/Docker for that)
- **End-user device management**: Laptop imaging, MDM, BYOD enrollment
- **Physical infrastructure**: Data center power, cooling, cabling
- **Vendor selection**: Assumes Cisco platforms (DNAC, ISE, vManage, Webex)

## Source Documentation References

The automation code in this framework automates configurations described in:

- **Abhavtech SD-Access Fabric Documentation** (internal)
- **Abhavtech SD-WAN Deployment Guide** (internal)
- **Abhavtech ISE 3.x TrustSec Policy Matrix** (internal)
- **Abhavtech Webex Calling/Contact Center Design** (internal)
- **Abhavtech Zero Trust Architecture Blueprint** (internal)

If you don't have access to these source documents, you can still use this automation framework by:

1. Understanding the **general patterns** (Terraform for provisioning, Ansible for config)
2. Adapting the **IP addressing and hostnames** to your environment
3. Reviewing **Cisco DevNet documentation** for API specifications
4. Testing in **DevNet Sandbox environments** before production

## Dependency on Manual Documentation

!!! warning "This is NOT a Standalone Deployment Guide"
    This automation framework assumes you understand:
    
    - **Why** SD-Access uses LISP/VXLAN (not just how to configure it)
    - **When** to use BGP vs. IS-IS for fabric underlay
    - **How** TrustSec SGT tagging enforces segmentation policies
    
    The manual documentation provides this foundational knowledge. This framework shows how to automate the deployment.

## Evolution from Manual to Automated

### Phase 1: Manual Deployment (2023-2024)

- Engineers followed step-by-step Word documents
- Configurations applied via CLI, browser GUIs
- Change tickets tracked in ServiceNow
- Validation done with `show` commands
- Documentation updated manually after changes

### Phase 2: Semi-Automated (2024-2025)

- Python scripts for repetitive tasks (bulk user creation)
- Ansible playbooks for device configuration
- Still manual DNAC/ISE GUI provisioning
- Git used for script version control
- Terraform evaluated but not deployed

### Phase 3: Full Infrastructure-as-Code (2025-2026)

- **This framework**: End-to-end automation from infrastructure provisioning to Day-N config
- Terraform provisions DNAC, ISE, vManage, Webex platforms
- Ansible configures all fabric devices
- Python handles custom API integration
- Git workflow enforces peer review
- HashiCorp Vault eliminates credentials in code

---

**Related Sections**:

- [1.1 Business Case for Automation](business-case.md) - Why automate network deployment
- [1.3 Toolchain Summary](toolchain.md) - Tools used in this framework
- [Chapter 2: Automation Architecture](../chapter2-automation-architecture/README.md) - How components fit together
