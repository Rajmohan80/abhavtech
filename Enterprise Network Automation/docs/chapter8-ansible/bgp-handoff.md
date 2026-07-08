# 8.5 BGP Handoff Playbook

Configure BGP for external connectivity at border nodes.

## Playbook

```yaml
---
- name: Configure BGP Handoff at Border
  hosts: fabric_border_nodes
  tasks:
    - name: Configure BGP
      cisco.ios.ios_config:
        lines:
          - router bgp 65001
          - neighbor 192.168.1.1 remote-as 65000
          - address-family ipv4
          - neighbor 192.168.1.1 activate
          - redistribute connected
          - redistribute static
```

## Validation

```bash
# Verify BGP neighbors
show bgp ipv4 unicast summary

# Verify routes advertised
show bgp ipv4 unicast neighbors 192.168.1.1 advertised-routes
```

---

**Related Sections**:
- [8.3 LISP/VXLAN Overlay](lisp-vxlan.md)
- [8.6 SD-WAN Day-N Automation](sdwan-dayn.md)
