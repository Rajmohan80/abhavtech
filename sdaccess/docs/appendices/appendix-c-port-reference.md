# Appendix C: Port Reference

### DNAC Communication Ports

| Port | Protocol | Direction | Purpose |
|------|----------|-----------|---------|
| 443 | HTTPS | Inbound | Web UI, API access |
| 22 | SSH | Inbound | CLI access (Maglev) |
| 162 | SNMP | Inbound | SNMP traps from devices |
| 5353 | mDNS | Both | Cluster communication |
| 5671 | AMQP | Inbound | Event notifications |
| 8080 | HTTP | Inbound | Internal services |
| 9996 | UDP | Inbound | NetFlow collection |
| 25 | SMTP | Outbound | Email notifications |
| 123 | NTP | Outbound | Time synchronization |
| 53 | DNS | Outbound | Name resolution |

### ISE Communication Ports

| Port | Protocol | Direction | Purpose |
|------|----------|-----------|---------|
| 443 | HTTPS | Inbound | Admin portal |
| 8443 | HTTPS | Inbound | Guest/Sponsor portal |
| 8444 | HTTPS | Inbound | My Devices portal |
| 1812 | RADIUS | Inbound | Authentication |
| 1813 | RADIUS | Inbound | Accounting |
| 1645 | RADIUS | Inbound | Authentication (legacy) |
| 1646 | RADIUS | Inbound | Accounting (legacy) |
| 1700 | CoA | Outbound | Change of Authorization |
| 8910 | pxGrid | Both | Context sharing |
| 389 | LDAP | Outbound | Active Directory |
| 636 | LDAPS | Outbound | Secure AD |
| 88 | Kerberos | Outbound | AD authentication |

### Fabric Communication Ports

| Port | Protocol | Purpose |
|------|----------|---------|
| 4342 | LISP | Map-Request/Reply |
| 4341 | LISP | Data encapsulation |
| 4789 | VXLAN | Data plane tunneling |
| 64999 | SXP | SGT exchange |
| 179 | BGP | External routing |
| 500 | IKE | IPsec key exchange |
| 4500 | IPsec NAT-T | IPsec over NAT |

### Wireless Communication Ports

| Port | Protocol | Purpose |
|------|----------|---------|
| 5246 | CAPWAP | Control channel |
| 5247 | CAPWAP | Data channel |
| 16666 | Mobility | WLC HA |
| 16667 | Mobility | WLC HA |

---
