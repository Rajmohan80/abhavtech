# 11.1 Deployment Sequence

Execute production deployment in sequence.

## Sequence

1. Terraform provisions infrastructure (DNAC sites, ISE policy)
2. ZTP onboards new devices
3. Ansible configures underlay (IS-IS)
4. Ansible configures overlay (LISP/VXLAN)
5. Ansible applies security (802.1X, TrustSec)
6. Validation playbook confirms success

---

**Related Sections**:
- [11.2 Pre-Deployment Checklist](checklist.md)
