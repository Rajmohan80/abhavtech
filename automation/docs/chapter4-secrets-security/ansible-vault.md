# 4.3 Ansible Vault for Playbook Secrets

Ansible Vault encrypts sensitive playbook variables (VLAN IDs, subnet assignments) that aren't in HashiCorp Vault.

## Creating Encrypted Variables

```bash
# Create encrypted vars file
ansible-vault create ansible/vars/fabric_secrets.yml

# Enter vault password when prompted
# Add sensitive variables:
```

```yaml
---
fabric_vlan_data: 100
fabric_vlan_voice: 200
management_subnet: "10.252.0.0/16"
radius_shared_secret: "SecretKey123"
```

## Using Encrypted Variables

```yaml
---
- name: Configure fabric edge ports
  hosts: fabric_edge_nodes
  vars_files:
    - vars/fabric_secrets.yml
  tasks:
    - name: Configure access port
      cisco.ios.ios_config:
        lines:
          - switchport access vlan {{ fabric_vlan_data }}
```

## Running Playbooks

```bash
# Prompt for vault password
ansible-playbook playbook.yml --ask-vault-pass

# Or use password file
ansible-playbook playbook.yml --vault-password-file ~/.vault_pass
```

---

**Related Sections**:
- [4.2 Retrieving Credentials at Runtime](runtime-credentials.md)
- [Chapter 8: Ansible Configuration](../chapter8-ansible/README.md)
