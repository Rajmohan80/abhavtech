# 4.2 Retrieving Credentials at Runtime

Automation tools retrieve credentials from Vault at runtime, never storing them in code or configuration files.

## Python Vault Helper

Create `scripts/vault_helper.py`:

```python
import os
import hvac

def get_vault_client():
    vault_addr = os.getenv('VAULT_ADDR', 'https://10.252.200.10:8200')
    vault_token = os.getenv('VAULT_TOKEN')
    
    client = hvac.Client(url=vault_addr, token=vault_token)
    
    if not client.is_authenticated():
        raise Exception("Vault authentication failed")
    
    return client

def get_secret(path):
    client = get_vault_client()
    response = client.secrets.kv.v2.read_secret_version(path=path)
    return response['data']['data']

# Example usage
if __name__ == "__main__":
    dnac_creds = get_secret('secret/abhavtech/dnac/admin')
    print(f"DNAC URL: {dnac_creds['url']}")
    print(f"Username: {dnac_creds['username']}")
```

## Terraform Integration

```hcl
# Use Vault provider
provider "vault" {
  address = "https://10.252.200.10:8200"
  token   = var.vault_token
}

# Retrieve DNAC credentials
data "vault_generic_secret" "dnac" {
  path = "secret/abhavtech/dnac/admin"
}

# Use in DNAC provider
provider "dnacenter" {
  base_url = data.vault_generic_secret.dnac.data["url"]
  username = data.vault_generic_secret.dnac.data["username"]
  password = data.vault_generic_secret.dnac.data["password"]
}
```

## Ansible Integration

```yaml
---
- name: Retrieve Vault secrets
  hosts: localhost
  tasks:
    - name: Get ISE credentials from Vault
      community.hashi_vault.vault_read:
        url: https://10.252.200.10:8200
        path: secret/data/abhavtech/ise/ers
        token: "{{ lookup('env', 'VAULT_TOKEN') }}"
      register: ise_creds
    
    - name: Configure ISE NAD
      cisco.ise.network_device:
        ise_hostname: "{{ ise_creds.data.data.url }}"
        ise_username: "{{ ise_creds.data.data.username }}"
        ise_password: "{{ ise_creds.data.data.password }}"
        name: "fabric-edge-01"
        ip_address: "10.252.1.101"
```

---

**Related Sections**:
- [4.1 HashiCorp Vault Deployment](vault-deployment.md)
- [4.3 Ansible Vault for Playbook Secrets](ansible-vault.md)
