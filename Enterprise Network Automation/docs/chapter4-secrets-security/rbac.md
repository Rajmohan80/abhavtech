# 4.4 RBAC for Automation Accounts

Role-based access control ensures automation tools only access necessary credentials.

## Vault Policy Example

```hcl
# Policy for Terraform service account
path "secret/data/abhavtech/dnac/*" {
  capabilities = ["read"]
}

path "secret/data/abhavtech/ise/*" {
  capabilities = ["read"]
}

path "secret/data/abhavtech/ssh/*" {
  capabilities = ["deny"]
}
```

Apply policy:

```bash
vault policy write terraform-policy terraform-policy.hcl

vault token create -policy=terraform-policy
```

---

**Related Sections**:
- [4.1 HashiCorp Vault Deployment](vault-deployment.md)
- [2.3 Role Separation](../chapter2-automation-architecture/role-separation.md)
