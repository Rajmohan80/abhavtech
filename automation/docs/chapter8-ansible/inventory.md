# 8.1 Ansible Inventory

Define device inventory for playbook targeting.

## Inventory Structure

```yaml
# ansible/inventory/production.yml
all:
  children:
    fabric_border_nodes:
      hosts:
        border-01:
          ansible_host: 10.252.1.1
        border-02:
          ansible_host: 10.252.1.2
    
    fabric_edge_nodes:
      hosts:
        edge-01:
          ansible_host: 10.252.1.101
          access_ports: [Gi1/0/1, Gi1/0/2, Gi1/0/3]
        edge-02:
          ansible_host: 10.252.1.102
          access_ports: [Gi1/0/1, Gi1/0/2]
    
    cedge_routers:
      hosts:
        cedge-dallas:
          ansible_host: 192.168.10.1
          system_ip: 10.1.1.1
```

---

**Related Sections**:
- [8.2 IS-IS Underlay Playbook](isis-underlay.md)
- [8.3 LISP/VXLAN Overlay Playbook](lisp-vxlan.md)
