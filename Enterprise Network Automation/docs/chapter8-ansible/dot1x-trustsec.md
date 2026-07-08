# 8.4 802.1X and TrustSec Playbook

Configure 802.1X authentication and TrustSec.

## Playbook

```yaml
---
- name: Configure 802.1X and TrustSec
  hosts: fabric_edge_nodes
  tasks:
    - name: Enable 802.1X globally
      cisco.ios.ios_config:
        lines:
          - aaa new-model
          - radius server ISE-PSN-01
          - address ipv4 10.252.30.10 auth-port 1812 acct-port 1813
          - key {{ vault_radius_secret }}
          - dot1x system-auth-control
    
    - name: Configure TrustSec
      cisco.ios.ios_config:
        lines:
          - cts authorization list default
          - cts role-based enforcement
```

---

**Related Sections**:
- [Chapter 4: Secrets & Security](../chapter4-secrets-security/README.md)
