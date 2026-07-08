# Chapter 8: Ansible — Day-N Configuration Management

Comprehensive Day-N configuration automation using Ansible playbooks and Jinja2 templates for IS-IS underlay, LISP/VXLAN overlay, 802.1X/TrustSec, BGP handoffs, SD-WAN feature templates, and Webex automation.

## What You'll Learn

### Ansible Inventory for Abhavtech
Dynamic inventory organization:

- Border Nodes (BN-01, BN-02, BN-03)
- Control Plane Nodes (CP-01, CP-02)
- Edge Nodes (ED-01 through ED-08)
- WAN Edge (cEdge devices at 19 sites)
- Group variables for fabric roles
- Vault-encrypted credentials

### IS-IS Underlay Playbook
Level 2 routing for fabric underlay:

- IS-IS process configuration
- Interface assignments (Loopback0, physical links)
- Wide metrics for LISP compatibility
- Authentication with Type 5 passwords
- Jinja2 templates for per-device customization

### LISP/VXLAN Overlay Playbook
Control plane and data plane overlay:

- LISP instance configuration (Control Plane nodes)
- NVE interface for VXLAN encapsulation
- EID prefix registration
- Multi-site LISP configuration
- Host mobility support

### 802.1X and TrustSec Playbook
Identity-based access control:

- ISE RADIUS server configuration
- 802.1X port-based authentication (access ports)
- TrustSec SGT propagation (SXP, inline tagging)
- MAB fallback for non-dot1x devices
- IBNS 2.0 policy templates

### BGP Handoff Playbook
External connectivity at fabric borders:

- eBGP peering with external networks
- VRF-aware BGP for VN segmentation
- Route redistribution (LISP ↔ BGP)
- Route-map filtering and tagging
- BFD for fast convergence

### SD-WAN Day-N Automation via REST API
Template-based SD-WAN deployment:

- vManage API authentication (session token)
- Feature template creation (VPN 0, VPN 512, data VPNs)
- Device template assembly
- Variable substitution per site
- Template attachment and activation
- OMP session verification
- App-aware routing policy updates

### Webex Day-N Automation
UC/CC platform configuration:

- Webex API authentication (Bearer token)
- Bulk user provisioning from HR exports
- DID and extension assignment
- Hunt group synchronization
- WxCC agent/queue management
- YAML-based source of truth for config

## Chapter Navigation

- **[8.1 Ansible Inventory](inventory.md)** - Host organization and variables
- **[8.2 IS-IS Underlay Playbook](isis-underlay.md)** - Layer 3 fabric routing
- **[8.3 LISP/VXLAN Overlay Playbook](lisp-vxlan.md)** - Overlay control/data plane
- **[8.4 802.1X and TrustSec Playbook](dot1x-trustsec.md)** - Identity and segmentation
- **[8.5 BGP Handoff Playbook](bgp-handoff.md)** - External connectivity
- **[8.6 SD-WAN Day-N Automation](sdwan-dayn.md)** - vManage template management
- **[8.7 Webex Day-N Automation](webex-dayn.md)** - UC/CC platform automation

## Ansible Best Practices

!!! success "Idempotency"
    All playbooks are idempotent - running them multiple times produces the same result without causing issues. Use `check_mode: yes` for dry runs.

!!! tip "Template Organization"
    Store Jinja2 templates in `ansible/templates/` directory with descriptive names:
    - `isis_underlay.j2` (IS-IS routing)
    - `lisp_cp.j2` (Control Plane LISP)
    - `nve_interface.j2` (VXLAN NVE)
    - `dot1x_port.j2` (802.1X access ports)

---

**Previous**: [← Zero Touch Provisioning](../chapter7-zero-touch-provisioning/README.md)  
**Next**: [Cloud Integrations](../chapter9-cloud-integrations/README.md) →
