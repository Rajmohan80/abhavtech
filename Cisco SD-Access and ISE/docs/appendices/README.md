# Appendices

## Quick Navigation

| Appendix | Description |
|----------|-------------|
| [A. Glossary](#appendix-a-glossary) | Terms and definitions |
| [B. CLI Quick Reference](#appendix-b-cli-quick-reference) | Common commands |
| [C. Port Reference](#appendix-c-port-reference) | Required ports and protocols |
| [D. IP Address Allocation](#appendix-d-ip-address-allocation) | Complete IP scheme |
| [E. Hardware BOM](#appendix-e-hardware-bill-of-materials) | Equipment list |
| [F. References](#appendix-f-references) | Cisco CVD and documentation |
| [G. Revision History](#appendix-g-revision-history) | Document changes |

---

## Appendix A: Glossary

### SD-Access Terms

| Term | Definition |
|------|------------|
| **SD-Access** | Software-Defined Access - Cisco's campus fabric solution |
| **DNA Center (DNAC)** | Digital Network Architecture Center - Central management platform |
| **ISE** | Identity Services Engine - Policy and access control platform |
| **Fabric** | Overlay network built on VXLAN tunnels with LISP control plane |
| **VN (Virtual Network)** | Logical network segment, maps to VRF |
| **SGT (Scalable Group Tag)** | 16-bit security tag for micro-segmentation |
| **SGACL** | Scalable Group Access Control List - SGT-based policy |
| **LISP** | Locator/ID Separation Protocol - Fabric control plane |
| **VXLAN** | Virtual Extensible LAN - Fabric data plane encapsulation |
| **Anycast Gateway** | Distributed default gateway across all edge nodes |

### Fabric Node Roles

| Term | Definition |
|------|------------|
| **Border Node** | Connects fabric to external networks (WAN, DC, Internet) |
| **Control Plane Node** | Runs LISP Map-Server/Map-Resolver functions |
| **Edge Node** | Connects endpoints to fabric, performs encapsulation |
| **Extended Node** | Layer 2 extension for endpoints behind access switches |
| **Fabric-in-a-Box** | Single device performing all fabric roles (branches) |
| **Intermediate Node** | Layer 2 device between edge and extended nodes |

### Network Protocols

| Term | Definition |
|------|------------|
| **IS-IS** | Intermediate System to Intermediate System - Underlay IGP |
| **BGP** | Border Gateway Protocol - External routing |
| **OSPF** | Open Shortest Path First - Legacy IGP (replaced by IS-IS) |
| **BFD** | Bidirectional Forwarding Detection - Fast failure detection |
| **SXP** | SGT Exchange Protocol - IP-to-SGT binding propagation |
| **pxGrid** | Platform Exchange Grid - Context sharing between ISE and DNAC |

### Security Terms

| Term | Definition |
|------|------------|
| **802.1X** | Port-based Network Access Control (PNAC) |
| **MAB** | MAC Authentication Bypass - Fallback for non-802.1X devices |
| **EAP-TLS** | Extensible Authentication Protocol - TLS (certificate-based) |
| **PEAP** | Protected EAP - Username/password with TLS tunnel |
| **RADIUS** | Remote Authentication Dial-In User Service |
| **CoA** | Change of Authorization - Dynamic policy update |
| **MACsec** | Media Access Control Security - Layer 2 encryption |
| **TrustSec** | Cisco's SGT-based security architecture |

### Wireless Terms

| Term | Definition |
|------|------------|
| **WLC** | Wireless LAN Controller |
| **CAPWAP** | Control and Provisioning of Wireless Access Points |
| **SSID** | Service Set Identifier - Wireless network name |
| **WPA3** | Wi-Fi Protected Access 3 - Latest wireless security |
| **Fabric-Enabled Wireless** | Wireless with SGT and VXLAN integration |

### Management Terms

| Term | Definition |
|------|------------|
| **Assurance** | DNAC's AI-driven monitoring and analytics |
| **PnP** | Plug and Play - Zero-touch device provisioning |
| **SWIM** | Software Image Management |
| **LAN Automation** | Automated underlay provisioning |

---

## Appendix B: CLI Quick Reference

### LISP Commands

```cisco
! Show LISP site registrations (on Control Plane)
show lisp site

! Show LISP database (on Edge Node)
show lisp instance-id 8001 ipv4 database

! Show LISP map-cache (on Edge Node)
show lisp instance-id 8001 ipv4 map-cache

! Show LISP sessions
show lisp session

! Debug LISP (use with caution)
debug lisp control-plane all
```

### VXLAN Commands

```cisco
! Show VXLAN tunnel status
show vxlan tunnel

! Show VXLAN VNI mapping
show vxlan vni

! Show NVE interface
show interface nve1

! Show VXLAN peers
show nve peers
```

### IS-IS Commands

```cisco
! Show IS-IS neighbors
show isis neighbors

! Show IS-IS database
show isis database detail

! Show IS-IS routes
show ip route isis

! Debug IS-IS adjacency
debug isis adj-packets
```

### CTS/SGT Commands

```cisco
! Show CTS environment data
show cts environment-data

! Show SGT role-based permissions
show cts role-based permissions

! Show IP-to-SGT bindings
show cts role-based sgt-map all

! Show CTS counters
show cts role-based counters

! Clear SGT cache
clear cts role-based sgt-map all
```

### Authentication Commands

```cisco
! Show authentication sessions
show authentication sessions

! Show authentication session details
show authentication sessions interface Gi1/0/10 details

! Show dot1x summary
show dot1x all summary

! Show MAB summary
show mab all summary

! Debug authentication
debug authentication all
debug dot1x all
debug radius authentication
```

### Device Health Commands

```cisco
! Show CPU utilization
show processes cpu sorted

! Show memory utilization
show memory statistics

! Show environmental status
show environment all

! Show interface errors
show interfaces counters errors

! Show power status
show power inline
```

### Troubleshooting Commands

```cisco
! Trace path through fabric
traceroute vrf VN_CORPORATE <destination>

! Test RADIUS authentication
test aaa group RADIUS-GROUP <username> <password> new-code

! Check RADIUS server status
show radius server-group all

! Show logging
show logging | include error|warning

! Capture packets
monitor capture <name> interface <if> both
```

---

## Appendix C: Port Reference

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

## Appendix D: IP Address Allocation

### Management Networks

| Network | Subnet | Purpose |
|---------|--------|---------|
| 10.252.0.0/16 | Management supernet | All management |
| 10.252.10.0/24 | DNAC Primary (NJ) | DNAC cluster |
| 10.252.11.0/24 | DNAC Cluster (NJ) | Inter-node |
| 10.252.12.0/24 | Device Management (NJ) | Switch OOB |
| 10.252.20.0/24 | DNAC DR (London) | DR cluster |
| 10.252.30.0/24 | ISE PAN | Administration |
| 10.252.31.0/24 | ISE PSN | Policy nodes |
| 10.252.40.0/24 | WLC Management | Controllers |
| 10.252.50.0/24 | Stealthwatch | Security analytics |
| 10.252.60.0/24 | ThousandEyes | Path analytics |

### Underlay Networks

| Network | Subnet | Purpose |
|---------|--------|---------|
| 10.250.0.0/16 | Loopback supernet | All RLOCs |
| 10.250.1.0/24 | Mumbai loopbacks | MUM fabric nodes |
| 10.250.2.0/24 | Chennai loopbacks | CHN fabric nodes |
| 10.250.16.0/24 | London loopbacks | LON fabric nodes |
| 10.250.17.0/24 | Frankfurt loopbacks | FRA fabric nodes |
| 10.250.32.0/24 | New Jersey loopbacks | NJ fabric nodes |
| 10.250.33.0/24 | Dallas loopbacks | DAL fabric nodes |
| 10.251.0.0/16 | P2P links supernet | All P2P links |

### Overlay Networks (VNs)

| VN Name | VNI | IP Range | SGTs |
|---------|-----|----------|------|
| VN_CORPORATE | 8001 | 10.100.0.0/16 | 10, 11, 15, 20, 30 |
| VN_GUEST | 8002 | 10.200.0.0/16 | 40 |
| VN_IOT | 8003 | 10.150.0.0/16 | 50, 60, 70 |
| VN_SERVERS | 8004 | 10.180.0.0/16 | 80, 90 |
| VN_VOICE | 8005 | 10.190.0.0/16 | 25 |

### Per-Site IP Pools

| Site | Corporate Pool | Guest Pool | IoT Pool | Voice Pool |
|------|----------------|------------|----------|------------|
| Mumbai | 10.100.1.0/24 | 10.200.1.0/24 | 10.150.1.0/24 | 10.190.1.0/24 |
| Chennai | 10.100.2.0/24 | 10.200.2.0/24 | 10.150.2.0/24 | 10.190.2.0/24 |
| London | 10.100.16.0/24 | 10.200.16.0/24 | 10.150.16.0/24 | 10.190.16.0/24 |
| Frankfurt | 10.100.17.0/24 | 10.200.17.0/24 | 10.150.17.0/24 | 10.190.17.0/24 |
| New Jersey | 10.100.32.0/24 | 10.200.32.0/24 | 10.150.32.0/24 | 10.190.32.0/24 |
| Dallas | 10.100.33.0/24 | 10.200.33.0/24 | 10.150.33.0/24 | 10.190.33.0/24 |

---

## Appendix E: Hardware Bill of Materials

### DNA Center Appliances

| Model | Quantity | Location | Purpose |
|-------|----------|----------|---------|
| DN2-HW-APL-XL | 3 | New Jersey | Primary cluster |
| DN2-HW-APL-XL | 3 | London | DR cluster |

### ISE Appliances

| Model | Quantity | Location | Role |
|-------|----------|----------|------|
| SNS-3695-K9 | 1 | New Jersey | Primary PAN |
| SNS-3695-K9 | 1 | London | Secondary PAN |
| SNS-3655-K9 | 2 | Mumbai | PSN pair |
| SNS-3655-K9 | 2 | Chennai | PSN pair |
| SNS-3655-K9 | 2 | London | PSN pair |
| SNS-3655-K9 | 2 | Frankfurt | PSN pair |
| SNS-3655-K9 | 2 | New Jersey | PSN pair |
| SNS-3655-K9 | 2 | Dallas | PSN pair |

### Switching - Hub Sites

| Model | Quantity | Role | Locations |
|-------|----------|------|-----------|
| C9500-48Y4C | 12 | Border Node | 2 per hub (6 hubs) |
| C9500-24Y4C | 12 | Control Plane | 2 per hub (6 hubs) |
| C9300-48U | 238 | Edge Node | Distributed |

### Switching - Branch Sites

| Model | Quantity | Role | Sites |
|-------|----------|------|-------|
| C9300-48UXM | 60 | Fabric-in-a-Box | 30 branches × 2 |
| C9200-24P | 120 | Extended Node | 30 branches × 4 |

### Wireless

| Model | Quantity | Role | Locations |
|-------|----------|------|-----------|
| C9800-80 | 6 | WLC (large) | Hub sites |
| C9800-40 | 6 | WLC (medium) | Hub sites |
| C9130AXI | 350 | AP (high-density) | Hub sites |
| C9120AXI | 240 | AP (standard) | Branches |

### Optics and Cables

| Type | Quantity | Purpose |
|------|----------|---------|
| SFP-10G-SR | 200 | 10G short-reach |
| SFP-25G-SR-S | 100 | 25G short-reach |
| QSFP-100G-SR4-S | 50 | 100G short-reach |
| CAT6A Patch Cables | 5,000 | Endpoint connections |
| OM4 Fiber (2m) | 500 | Intra-rack |
| OM4 Fiber (10m) | 200 | Inter-rack |

---

## Appendix F: References

### Cisco Validated Designs (CVD)

| Document | Version | URL |
|----------|---------|-----|
| SD-Access Design Guide | 2.3 | https://www.cisco.com/go/sda-cvd |
| SD-Access Deployment Guide | 2.3 | https://www.cisco.com/go/sda-deployment |
| SD-Access Wireless Design | 2.3 | https://www.cisco.com/go/sda-wireless |
| ISE Integration Guide | 3.2 | https://www.cisco.com/go/ise-sd-access |
| Catalyst 9000 Design Guide | 17.x | https://www.cisco.com/go/cat9000 |

### Configuration Guides

| Document | Platform | URL |
|----------|----------|-----|
| DNA Center Admin Guide | 2.3.x | https://www.cisco.com/go/dnac-admin |
| ISE Admin Guide | 3.2 | https://www.cisco.com/go/ise-admin |
| Catalyst 9500 Configuration | 17.12 | https://www.cisco.com/go/cat9500-config |
| Catalyst 9300 Configuration | 17.12 | https://www.cisco.com/go/cat9300-config |
| Catalyst 9800 Configuration | 17.12 | https://www.cisco.com/go/cat9800-config |

### Best Practices

| Document | Topic | URL |
|----------|-------|-----|
| SD-Access Best Practices | Deployment | https://www.cisco.com/go/sda-bp |
| ISE Scalability | Sizing | https://www.cisco.com/go/ise-scale |
| TrustSec Design | Security | https://www.cisco.com/go/trustsec |
| 802.1X Deployment | Authentication | https://www.cisco.com/go/dot1x |

### Training and Certification

| Course | Code | Description |
|--------|------|-------------|
| Designing Cisco Enterprise Networks | ENSLD | Enterprise design |
| Implementing Cisco SD-Access | ENSDA | SD-Access implementation |
| Implementing Cisco ISE | SISE | ISE deployment |
| CCNP Enterprise | 350-401 + 300-4xx | Professional certification |
| Cisco DevNet Associate | 200-901 | Automation skills |

---

## Appendix G: Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2025-12-01 | Network Team | Initial draft - Discovery |
| 0.2 | 2025-12-05 | Network Team | Added Design chapter |
| 0.3 | 2025-12-10 | Security Team | Added Network & Security |
| 0.4 | 2025-12-15 | Implementation Team | Added Implementation |
| 0.5 | 2025-12-18 | Operations Team | Added Operations |
| 0.6 | 2025-12-22 | Finance Team | Added Financials |
| 0.7 | 2025-12-24 | Network Team | Added Advanced Features |
| 1.0 | 2025-12-26 | Project Team | Final review, all chapters complete |

### Change Log

**Version 1.0 (2025-12-26)**
- Final review and approval
- All chapters complete
- GitBook compatibility validated
- Ready for publication

**Version 0.7 (2025-12-24)**
- Added Chapter 7: Advanced Features
- API integration examples
- Automation workflows
- SD-WAN integration overview

**Version 0.6 (2025-12-22)**
- Added Chapter 6: Migration & Financials
- 5-year TCO analysis
- ROI calculations
- License mapping

**Version 0.5 (2025-12-18)**
- Added Chapter 5: Operations
- DNAC Assurance configuration
- ISE monitoring setup
- Incident management procedures

**Version 0.4 (2025-12-15)**
- Added Chapter 4: Implementation
- DNAC/ISE installation procedures
- Fabric provisioning steps
- Go-live runbook

**Version 0.3 (2025-12-10)**
- Added Chapter 3: Network & Security
- Zero Trust architecture
- ISE policy design
- SGT/SGACL configuration

**Version 0.2 (2025-12-05)**
- Added Chapter 2: Design
- SD-Access architecture
- Fabric site design
- Hardware BOM

**Version 0.1 (2025-12-01)**
- Initial draft
- Discovery and assessment
- Current state inventory
- Gap analysis

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
