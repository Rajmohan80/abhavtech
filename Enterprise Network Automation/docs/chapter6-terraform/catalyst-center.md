# 6.2 Catalyst Center Provisioning

Provision DNAC sites, IP pools, and fabric sites using Terraform.

## Example: Create Site Hierarchy

```hcl
resource "dnacenter_site" "global" {
  site_hierarchy = "Global"
  site_type      = "area"
}

resource "dnacenter_site" "north_america" {
  site_hierarchy = "Global/North-America"
  site_type      = "area"
}

resource "dnacenter_site" "hq" {
  site_hierarchy = "Global/North-America/HQ"
  site_type      = "building"
  address        = "123 Main St, Newark, NJ 07102"
  latitude       = 40.735657
  longitude      = -74.172367
}
```

---

**Related Sections**:
- [6.3 ISE Provisioning](ise.md)
- [Chapter 2.2: Tool Responsibilities](../chapter2-automation-architecture/tool-matrix.md)
