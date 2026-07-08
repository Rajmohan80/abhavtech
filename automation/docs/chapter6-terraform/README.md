# Chapter 6: Terraform — Infrastructure Provisioning

Infrastructure-as-Code provisioning for CML labs, Catalyst Center (DNAC), ISE 3.x, SD-WAN vManage, and Webex platforms using Terraform with Cisco-certified providers.

## What You'll Learn

### CML Lab Provisioning
Automated lab topology deployment:

- 12-node Abhavtech minimal lab (2 BN, 2 CP, 2 Edge, 2 cEdge, ISE, DNAC, vManage)
- Network topology wiring (IS-IS underlay, SD-WAN handoffs)
- Day-0 configuration injection
- CML2 provider integration

### Catalyst Center (DNAC) Provisioning
Site hierarchy and network settings:

- Global → Region → Country → City → Building hierarchy
- IP address pools per VN (Corporate, Guest, IoT)
- DNS, NTP, DHCP, and SNMP settings
- Device credentials and network profiles

### ISE Provisioning
Security policy infrastructure:

- 25+ SGT definitions (Corporate, Contractors, IoT, etc.)
- Network Access Device (NAD) bulk onboarding
- RADIUS shared secret distribution
- Authorization policy placeholders

### SD-WAN vManage Provisioning
Template-based device onboarding:

- Feature templates (VPN 0, VPN 512, VPN 8001)
- Device templates for cEdge platforms
- OMP session establishment
- App-aware routing policies

### Webex Provisioning
Unified Communications platform setup:

- Location definitions (Mumbai, Chennai, London, NJ)
- Number management and DID assignment
- Hunt group provisioning
- Contact Center queue configuration

## Chapter Navigation

- **[6.1 CML Lab Provisioning](cml-lab.md)** - Automated lab topology
- **[6.2 Catalyst Center Provisioning](catalyst-center.md)** - DNAC site hierarchy
- **[6.3 ISE Provisioning](ise.md)** - SGTs and NAD onboarding
- **[6.4 SD-WAN vManage Provisioning](sdwan.md)** - Template deployment
- **[6.5 Webex Provisioning](webex.md)** - UC/CC platform setup

## Terraform Principles

!!! tip "State File Security"
    Terraform state files contain sensitive data. Use remote backends (Terraform Cloud, S3, Azure Blob) with encryption at rest. Never commit `terraform.tfstate` to Git.

!!! note "Provider Versions"
    Pin provider versions in `required_providers` block to avoid breaking changes:
    ```hcl
    terraform {
      required_providers {
        cml2 = {
          source  = "ciscodevnet/cml2"
          version = "~> 0.5"
        }
      }
    }
    ```

---

**Previous**: [← Git Workflow](../chapter5-git-workflow/README.md)  
**Next**: [Zero Touch Provisioning](../chapter7-zero-touch-provisioning/README.md) →
