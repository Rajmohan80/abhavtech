# 6.4 SD-WAN vManage Provisioning

Provision SD-WAN templates using Terraform.

## Feature Template

```hcl
resource "sdwan_feature_template" "vpn_0" {
  template_name    = "VPN-0-Transport"
  template_description = "WAN transport VPN"
  device_type      = "vedge-C8000V"
  
  vpn_id = 0
  name   = "Transport VPN"
}
```

---

**Related Sections**:
- [6.5 Webex Provisioning](webex.md)
- [Chapter 8.6: SD-WAN Day-N Automation](../chapter8-ansible/sdwan-dayn.md)
