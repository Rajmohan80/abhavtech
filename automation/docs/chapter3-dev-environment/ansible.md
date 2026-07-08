# 3.4 Ansible Cisco Collections

Install required Ansible Galaxy collections for Cisco network automation.

## Required Collections

| Collection | Version | Purpose |
|------------|---------|---------|
| cisco.ios | 7.0.0 | IOS/IOS-XE device modules |
| cisco.dnac | 6.13.0 | DNA Center API modules |
| cisco.ise | 2.8.0 | ISE API modules |
| cisco.nxos | 6.0.0 | NX-OS device modules |
| ansible.netcommon | 6.1.0 | Common network modules |
| ansible.utils | 3.1.0 | Utility modules (validation, filters) |

## Installation Commands

```bash
# Activate virtual environment first
source ~/abhavtech-automation-venv/bin/activate

# Install Cisco IOS collection
ansible-galaxy collection install cisco.ios:7.0.0

# Install DNA Center collection
ansible-galaxy collection install cisco.dnac:6.13.0

# Install ISE collection
ansible-galaxy collection install cisco.ise:2.8.0

# Install NX-OS collection
ansible-galaxy collection install cisco.nxos:6.0.0

# Install common network collections
ansible-galaxy collection install ansible.netcommon:6.1.0
ansible-galaxy collection install ansible.utils:3.1.0
```

## Verify Collections

```bash
# List installed collections
ansible-galaxy collection list | grep cisco

# Expected output:
# cisco.dnac      6.13.0
# cisco.ios       7.0.0  
# cisco.ise       2.8.0
# cisco.nxos      6.0.0
```

## Create requirements.yml

For reproducible installations:

```yaml
# ansible/requirements.yml
---
collections:
  - name: cisco.ios
    version: "7.0.0"
  - name: cisco.dnac
    version: "6.13.0"
  - name: cisco.ise
    version: "2.8.0"
  - name: cisco.nxos
    version: "6.0.0"
  - name: ansible.netcommon
    version: "6.1.0"
  - name: ansible.utils
    version: "3.1.0"
```

Install from file:

```bash
ansible-galaxy collection install -r ansible/requirements.yml
```

---

**Related Sections**:
- [3.2 Python Virtual Environment](python-venv.md)
- [Chapter 8: Ansible Configuration](../chapter8-ansible/README.md)
