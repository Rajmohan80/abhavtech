# Chapter 7: Zero Touch Provisioning — The Critical Section

Deep dive into Zero Touch Provisioning (ZTP) workflows, covering Day-0 vs Day-N concepts, PnP flow for SD-Access fabric nodes, pre-staging requirements, device-specific ZTP flows, and CML lab simulation.

## What You'll Learn

### How ZTP Works End to End
The complete PnP (Plug and Play) process:

- **Day-0**: Initial device onboarding with minimal bootstrap config
- **Day-N**: Full operational configuration after DNAC/ISE integration
- Device discovery and claim in DNAC
- Template application and provisioning
- Image upgrade and compliance

### Day-0 vs Day-N Concept
Two-phase deployment model:

- **Day-0**: Basic connectivity (mgmt IP, gateway, DNAC reachability)
- **Day-N**: Complete fabric config (IS-IS, LISP, BGP, 802.1X)

Day-0 happens during ZTP. Day-N is applied by Ansible after devices are fabric-ready.

### PnP Flow for SD-Access Fabric Nodes
Detailed sequence for fabric switch onboarding:

1. Factory default switch powers on
2. DHCP discovers PnP server (Option 43/Option 2)
3. Downloads Day-0 config from DNAC
4. Claims device in DNAC fabric inventory
5. DNAC pushes fabric role config (Border, Control Plane, Edge)
6. Ansible applies additional Day-N settings

### Pre-Staging Requirements
Prerequisites before ZTP execution:

- DHCP server with Option 43 pointing to DNAC
- DNS resolution for PnP server
- Device serial numbers added to DNAC inventory
- Device templates created and assigned
- Network reachability from DHCP scope to DNAC

### ZTP Flow Per Device Type
Platform-specific variations:

- **Catalyst 9500 Border Nodes**: BGP config, SDA border role
- **Catalyst 9300 Control Plane**: LISP mapping system
- **Catalyst 9300 Edge Nodes**: Host onboarding ports
- **ISR/ASR cEdge**: SD-WAN bootstrap, vBond discovery

### Simulating ZTP in CML
Lab validation workflow:

- CML topology with unmanaged switch as PnP relay
- DHCP server with Option 43 configuration
- DNAC PnP dashboard monitoring
- Validation of successful device claims

## Chapter Navigation

- **[7.1 How ZTP Works End to End](ztp-flow.md)** - Complete PnP process
- **[7.2 Pre-Staging Requirements](prestaging.md)** - Infrastructure prerequisites
- **[7.3 ZTP Flow Per Device Type](device-types.md)** - Platform-specific workflows
- **[7.4 Simulating ZTP in CML](cml-simulation.md)** - Lab validation

## Critical Concepts

!!! danger "Day-0 Config Must Be Minimal"
    Day-0 configuration should contain ONLY what's needed to reach DNAC:
    - Management IP address
    - Default gateway
    - DNS server
    - PnP server pointer
    
    Everything else (VLANs, routing, security) is Day-N configuration.

!!! warning "Option 43 vs Option 2"
    Cisco devices prefer DHCP Option 43 (vendor-specific) over Option 2 (tftp-server). Always configure both for maximum compatibility.

---

**Previous**: [← Terraform Provisioning](../chapter6-terraform/README.md)  
**Next**: [Ansible Day-N Configuration](../chapter8-ansible/README.md) →
