# 6.3 ISE Provisioning

Provision ISE policy elements using Terraform.

## Security Group Tags

```hcl
resource "ise_security_group" "employees" {
  name        = "Employees"
  description = "Corporate employees"
  value       = 10
}

resource "ise_security_group" "contractors" {
  name        = "Contractors"
  description = "External contractors"
  value       = 20
}
```

## Network Access Devices

```hcl
resource "ise_network_device" "fabric_edge_01" {
  name             = "fabric-edge-01.abhavtech.local"
  ip_address       = "10.252.1.101"
  radius_secret    = data.vault_generic_secret.radius_key.data["secret"]
  device_type      = "Cisco Catalyst 9300"
  location         = "HQ-Building-A"
  network_device_groups = ["Location#All Locations", "Device Type#All Device Types"]
}
```

---

**Related Sections**:
- [6.4 SD-WAN vManage Provisioning](sdwan.md)
