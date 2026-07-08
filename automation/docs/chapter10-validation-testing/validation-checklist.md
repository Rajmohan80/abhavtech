# 10.1 Lab Validation Checklist

Pre-production validation checklist.

## Fabric Validation

- [ ] IS-IS neighbors established
- [ ] LISP registrations active
- [ ] BGP peering up
- [ ] 802.1X authentication working
- [ ] TrustSec SGT propagation
- [ ] End-to-end ping success

## Command Verification

```bash
# IS-IS neighbors
show isis neighbors

# LISP registrations
show lisp instance-id 4099 ipv4 map-cache

# BGP peers
show bgp ipv4 unicast summary

# 802.1X sessions
show authentication sessions
```

---

**Related Sections**:
- [10.2 Automated Validation Playbook](validation-playbook.md)
