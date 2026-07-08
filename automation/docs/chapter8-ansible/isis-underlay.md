# 8.2 IS-IS Underlay Playbook

Configure IS-IS routing for fabric underlay.

## Playbook

```yaml
---
- name: Configure IS-IS Underlay
  hosts: fabric_nodes
  tasks:
    - name: Enable IS-IS
      cisco.ios.ios_config:
        lines:
          - router isis UNDERLAY
          - net 49.0001.{{ inventory_hostname }}.00
          - metric-style wide
          - passive-interface default
          - no passive-interface {{ underlay_interface }}
```

---

**Related Sections**:
- [8.3 LISP/VXLAN Overlay Playbook](lisp-vxlan.md)
