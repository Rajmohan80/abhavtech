# 10.2 Automated Validation Playbook

Automate post-deployment validation.

## Playbook

```yaml
---
- name: Validate Fabric Deployment
  hosts: fabric_nodes
  tasks:
    - name: Check ISIS neighbors
      cisco.ios.ios_command:
        commands: show isis neighbors
      register: isis_output
      
    - name: Verify neighbor count
      assert:
        that: isis_output.stdout[0] | regex_findall('UP') | length >= 2
        fail_msg: "ISIS neighbors not established"
```

---

**Related Sections**:
- [10.3 Rollback Procedures](rollback.md)
