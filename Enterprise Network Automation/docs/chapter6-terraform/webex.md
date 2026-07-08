# 6.5 Webex Provisioning

Provision Webex locations and users.

## Location

```hcl
resource "webex_location" "hq_newark" {
  name            = "HQ-Newark"
  time_zone       = "America/New_York"
  preferred_language = "en_US"
  
  address {
    address1 = "123 Main Street"
    city     = "Newark"
    state    = "NJ"
    zip_code = "07102"
    country  = "US"
  }
}
```

---

**Related Sections**:
- [Chapter 9: Cloud Integrations](../chapter9-cloud-integrations/README.md)
