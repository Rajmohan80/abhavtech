# Appendix A: Glossary

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
