# 12.1 Automated Compliance Checking

Automate compliance validation.

## Compliance Playbook

```yaml
---
- name: Check compliance
  hosts: fabric_nodes
  tasks:
    - name: Verify NTP configured
      cisco.ios.ios_command:
        commands: show ntp associations
      register: ntp_output
      
    - name: Assert NTP server present
      assert:
        that: "'10.252.100.2' in ntp_output.stdout[0]"
```

---

**Related Sections**:
- [12.2 Automated Device Config Backup](config-backup.md)
