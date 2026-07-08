# 8.3 LISP/VXLAN Overlay Playbook

Configure LISP and VXLAN for fabric overlay.

## Playbook

```yaml
---
- name: Configure LISP/VXLAN Overlay
  hosts: fabric_control_plane
  tasks:
    - name: Configure LISP Map Server
      cisco.ios.ios_config:
        lines:
          - router lisp
          - eid-table default instance-id 4099
          - ipv4 map-server
          - ipv4 map-cache-persistent interval 60
          
    - name: Configure NVE interface
      cisco.ios.ios_config:
        lines:
          - interface nve1
          - source-interface Loopback0
          - host-reachability protocol bgp
          - member vni 10100 mcast-group 225.0.1.1
```

## Validation

```bash
# Verify LISP registrations
show lisp instance-id 4099 ipv4 server

# Verify NVE peers
show nve peers
```

---

**Related Sections**:
- [8.2 IS-IS Underlay Playbook](isis-underlay.md)
- [8.4 802.1X and TrustSec](dot1x-trustsec.md)
