# Chapter 2: Automation Architecture Overview

This chapter describes the hub-spoke automation architecture that orchestrates all configuration changes across Abhavtech's enterprise infrastructure, including the tool responsibilities matrix and role separation model.

## What You'll Learn

### High-Level Architecture
The automation architecture follows a hub-spoke model with:

- **Central Automation Control Node**: Ubuntu WSL/Linux VM running Terraform, Ansible, Python
- **Git Repository**: Source of truth for all infrastructure code
- **HashiCorp Vault**: On-premises secrets management
- **Target Platforms**: DNAC cluster, ISE cluster, SD-WAN controllers, Fabric nodes, WAN edge devices

### Tool Responsibilities Matrix
Clear separation of concerns:

- **Terraform**: Provisions infrastructure (DNAC site hierarchy, ISE SGTs, vManage templates)
- **Ansible**: Configures devices (IS-IS, LISP, BGP, 802.1X)
- **Python**: Custom API integration (SD-WAN feature templates, Webex automation)

### Role Separation
Three distinct roles with clear boundaries:

- **Network Architect**: Design authority, approves pull requests
- **Automation Engineer**: Writes Terraform/Ansible code, submits pull requests
- **Network Operations**: Executes approved automation during change windows

## Chapter Navigation

- **[2.1 Enterprise Network HLD](enterprise-network-hld.md)** — All 19 sites, components per tier, VN segmentation
- **[2.2 Automation Architecture](architecture.md)** — Hub-spoke automation model and component diagram
- **[2.3 Tool Responsibilities Matrix](tool-matrix.md)** — Terraform vs Ansible vs Python
- **[2.4 Role Separation](role-separation.md)** — Architect, engineer, operations boundaries

## Key Concepts

!!! note "Control Node Requirements"
    The automation control node must have network reachability to:
    - DNAC cluster management IP (10.252.10.x)
    - ISE PAN/MNT nodes (10.252.30.x)
    - vManage cluster (10.252.50.x)
    - All fabric node management interfaces
    - HashiCorp Vault (10.252.200.10)

!!! tip "Why Not Containers/Kubernetes?"
    This framework deliberately avoids cloud-native orchestrators. It uses enterprise on-premises tools that network engineers already understand - no Docker, no Kubernetes, no cloud CI/CD platforms.

---

**Previous**: [← Executive Summary](../chapter1-executive-summary/README.md)  
**Next**: [Development Environment Setup](../chapter3-dev-environment/README.md) →
