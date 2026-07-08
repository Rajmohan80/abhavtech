# 6.1 CML Lab Provisioning

Provision CML topology using Terraform for pre-production validation.

## CML Topology

```hcl
resource "cml2_topology" "abhavtech_fabric" {
  name        = "abhavtech-fabric-lab"
  description = "SD-Access fabric validation"
  
  nodes = [
    {
      name  = "border-node-01"
      type  = "iosv"
      image = "iosv-159-3"
    },
    {
      name  = "control-plane-01"
      type  = "iosv"
      image = "iosv-159-3"
    },
    {
      name  = "edge-node-01"
      type  = "iosv"
      image = "iosv-159-3"
    }
  ]
  
  links = [
    {
      src  = "border-node-01:GigabitEthernet0/1"
      dst  = "control-plane-01:GigabitEthernet0/1"
    }
  ]
}
```

---

**Related Sections**:
- [6.2 Catalyst Center Provisioning](catalyst-center.md)
- [Chapter 7: Zero Touch Provisioning](../chapter7-zero-touch-provisioning/README.md)
