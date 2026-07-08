# References

## Documentation Sources and Further Reading

This page provides links to official vendor documentation, IETF RFCs, and additional resources referenced throughout the IPv6 Migration Guide.

---

## Cisco Documentation

### SD-WAN

- **[Cisco SD-WAN Configuration Guide](https://www.cisco.com/c/en/us/support/routers/sd-wan/products-installation-and-configuration-guides-list.html)** — Comprehensive configuration guides for vManage, vSmart, vBond, WAN edge routers
- **[Cisco SD-WAN Design Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/SDWAN/cisco-sdwan-design-guide.html)** — Validated design patterns for enterprise SD-WAN deployments
- **[Cisco Catalyst 8000 Edge Platforms](https://www.cisco.com/c/en/us/products/routers/catalyst-8000-edge-platforms-family/index.html)** — Catalyst 8000v virtual WAN edge router documentation

### SD-Access

- **[Cisco SD-Access Configuration Guide](https://www.cisco.com/c/en/us/support/cloud-systems-management/dna-center/products-installation-and-configuration-guides-list.html)** — Catalyst Center (DNAC) deployment and fabric configuration
- **[Cisco SD-Access Design Guide](https://www.cisco.com/c/en/us/td/docs/solutions/CVD/Campus/cisco-sda-design-guide.html)** — Campus fabric architecture patterns
- **[Cisco Identity Services Engine (ISE)](https://www.cisco.com/c/en/us/support/security/identity-services-engine/tsd-products-support-series-home.html)** — ISE 3.2+ documentation for TrustSec, policy enforcement, guest services

### Collaboration

- **[Webex Calling Configuration Guide](https://help.webex.com/en-us/landing/ld-5hxrk-WebexCallingConfigurationGuide)** — Cloud-based enterprise voice deployment
- **[Webex Contact Center Documentation](https://help.webex.com/en-us/landing/ld-y8qwj-WebexContactCenterDocumentation)** — Omnichannel contact center setup and management
- **[Cisco Unified Border Element (CUBE)](https://www.cisco.com/c/en/us/support/unified-communications/unified-border-element/tsd-products-support-series-home.html)** — PSTN integration and SIP trunking

### Security

- **[Cisco Umbrella Documentation](https://docs.umbrella.com/)** — Secure Internet Gateway (SIG) configuration and API reference
- **[Cisco Secure Firewall](https://www.cisco.com/c/en/us/support/security/firepower-ngfw/tsd-products-support-series-home.html)** — Next-generation firewall (NGFW) deployment guides
- **[Cisco Duo Multi-Factor Authentication](https://duo.com/docs)** — MFA integration for network devices, VPN, applications

### Monitoring

- **[Cisco ThousandEyes](https://docs.thousandeyes.com/)** — Network intelligence platform documentation
- **[Cisco AppDynamics](https://docs.appdynamics.com/)** — Application performance monitoring (APM) setup guides
- **[Catalyst Center Assurance](https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center/2-3-5/user_guide/b_cisco_dna_center_ug_2_3_5/m_assurance-overview.html)** — Network health and client experience monitoring

---

## Microsoft Azure Documentation

- **[Azure Virtual WAN](https://learn.microsoft.com/en-us/azure/virtual-wan/)** — Hub-spoke network architecture with SD-WAN integration
- **[Azure ExpressRoute](https://learn.microsoft.com/en-us/azure/expressroute/)** — Dedicated private connectivity to Azure data centers
- **[Azure IPv6 for Virtual Network](https://learn.microsoft.com/en-us/azure/virtual-network/ip-services/ipv6-overview)** — Dual-stack VNet configuration and deployment
- **[Azure Firewall](https://learn.microsoft.com/en-us/azure/firewall/)** — Cloud-native firewall service with IPv6 support
- **[Azure DDoS Protection](https://learn.microsoft.com/en-us/azure/ddos-protection/)** — Distributed denial-of-service mitigation

---

## Google Cloud Platform Documentation

- **[Cloud Interconnect](https://cloud.google.com/network-connectivity/docs/interconnect)** — Dedicated private connectivity to GCP (Dedicated and Partner Interconnect)
- **[Cloud VPN](https://cloud.google.com/network-connectivity/docs/vpn)** — IPsec VPN tunnels for hybrid connectivity
- **[VPC Network IPv6](https://cloud.google.com/vpc/docs/ipv6)** — Dual-stack VPC configuration and subnet design
- **[Vertex AI](https://cloud.google.com/vertex-ai/docs)** — Managed machine learning platform for training and inference
- **[Cloud Armor](https://cloud.google.com/armor/docs)** — DDoS protection and Web Application Firewall (WAF)

---

## IETF RFCs (IPv6 Standards)

### Core IPv6 Specifications

- **[RFC 8200](https://datatracker.ietf.org/doc/html/rfc8200)** — Internet Protocol, Version 6 (IPv6) Specification
- **[RFC 4291](https://datatracker.ietf.org/doc/html/rfc4291)** — IPv6 Addressing Architecture
- **[RFC 4861](https://datatracker.ietf.org/doc/html/rfc4861)** — Neighbor Discovery Protocol (NDP)
- **[RFC 4862](https://datatracker.ietf.org/doc/html/rfc4862)** — IPv6 Stateless Address Autoconfiguration (SLAAC)

### IPv6 Routing

- **[RFC 5340](https://datatracker.ietf.org/doc/html/rfc5340)** — OSPFv3 for IPv6
- **[RFC 2545](https://datatracker.ietf.org/doc/html/rfc2545)** — BGP-4 Multiprotocol Extensions for IPv6 Inter-Domain Routing
- **[RFC 6296](https://datatracker.ietf.org/doc/html/rfc6296)** — IPv6-to-IPv6 Network Prefix Translation (NPTv6)

### IPv6 Transition Mechanisms

- **[RFC 6146](https://datatracker.ietf.org/doc/html/rfc6146)** — Stateful NAT64: Network Address and Protocol Translation from IPv6 to IPv4
- **[RFC 6147](https://datatracker.ietf.org/doc/html/rfc6147)** — DNS64: DNS Extensions for NAT64
- **[RFC 7050](https://datatracker.ietf.org/doc/html/rfc7050)** — Discovery of the IPv6 Prefix Used for IPv6 Address Synthesis (NAT64 prefix discovery)

### IPv6 Security

- **[RFC 4942](https://datatracker.ietf.org/doc/html/rfc4942)** — IPv6 Transition/Co-existence Security Considerations
- **[RFC 6092](https://datatracker.ietf.org/doc/html/rfc6092)** — Recommended Simple Security Capabilities in CPE for IPv6
- **[RFC 7113](https://datatracker.ietf.org/doc/html/rfc7113)** — Implementation Advice for IPv6 Router Advertisement Guard (RA Guard)

### DHCPv6

- **[RFC 8415](https://datatracker.ietf.org/doc/html/rfc8415)** — Dynamic Host Configuration Protocol for IPv6 (DHCPv6)
- **[RFC 3633](https://datatracker.ietf.org/doc/html/rfc3633)** — IPv6 Prefix Options for DHCPv6 (prefix delegation)

### Other Relevant RFCs

- **[RFC 4941](https://datatracker.ietf.org/doc/html/rfc4941)** — Privacy Extensions for SLAAC
- **[RFC 6434](https://datatracker.ietf.org/doc/html/rfc6434)** — IPv6 Node Requirements
- **[RFC 7084](https://datatracker.ietf.org/doc/html/rfc7084)** — Basic Requirements for IPv6 CPE

---

## Industry Resources

### IPv6 Organizations

- **[ARIN (American Registry for Internet Numbers)](https://www.arin.net/)** — IPv6 allocation requests and policies for North America
- **[Internet Society IPv6 Resources](https://www.internetsociety.org/deploy360/ipv6/)** — IPv6 deployment guidance and case studies
- **[IPv6 Forum](https://www.ipv6forum.com/)** — Global IPv6 advocacy and education

### Design Guides

- **[Cisco Validated Designs (CVD)](https://www.cisco.com/c/en/us/solutions/design-zone.html)** — Reference architectures for campus, WAN, data center, security
- **[Cisco Enterprise Networks Design Guide](https://www.cisco.com/c/en/us/solutions/enterprise-networks/design-zone-networking.html)** — Comprehensive network design patterns

### Training and Certification

- **[Cisco Learning Network](https://learningnetwork.cisco.com/)** — Free training resources, study groups, labs
- **[Cisco U.](https://u.cisco.com/)** — Official Cisco training and certification programs
- **[Cisco DevNet](https://developer.cisco.com/)** — API documentation, sandboxes, learning labs for programmability

---

## Community Forums

- **[Cisco Community](https://community.cisco.com/)** — Peer support forums for SD-WAN, SD-Access, security, collaboration
- **[Reddit r/Cisco](https://www.reddit.com/r/Cisco/)** — Community discussions on Cisco technologies
- **[Reddit r/networking](https://www.reddit.com/r/networking/)** — General networking discussions and troubleshooting

---

## Tools and Utilities

### IPv6 Address Planning

- **[IPv6 Address Planning Tools](https://www.sipcalc.com/)** — Subnet calculators, prefix visualizers
- **[Infoblox IPAM](https://www.infoblox.com/products/ipam-dhcp/)** — Enterprise IP address management solution

### Testing and Validation

- **[Cisco Modeling Labs (CML)](https://developer.cisco.com/modeling-labs/)** — Network simulation and testing platform
- **[DevNet Sandboxes](https://developer.cisco.com/site/sandbox/)** — Free lab environments for testing Cisco technologies
- **[IPv6 Test Tools](https://test-ipv6.com/)** — Public IPv6 connectivity testing

### Monitoring and Troubleshooting

- **[Wireshark](https://www.wireshark.org/)** — Network protocol analyzer for packet capture and inspection
- **[tcpdump](https://www.tcpdump.org/)** — Command-line packet analyzer
- **[MTR (My Traceroute)](https://www.bitwizard.nl/mtr/)** — Network diagnostic tool combining traceroute and ping

---

## Books

- **"IPv6 Fundamentals: A Straightforward Approach to Understanding IPv6"** by Rick Graziani (Cisco Press)
- **"Cisco SD-WAN Solutions"** by Ramiro Garza Rios, et al. (Cisco Press)
- **"Deploying Cisco Software-Defined Access"** by Paul Radakovic (Cisco Press)
- **"Network Programmability and Automation"** by Jason Edelman, Scott S. Lowe, Matt Oswalt (O'Reilly)

---

## Additional AbhavTech Resources

Visit **[abhavtech.com](https://abhavtech.com)** for additional technical guides, migration playbooks, and AI-assisted documentation projects covering:

- Avaya to Webex Contact Center migrations
- Cisco Catalyst SD-WAN deployments
- SD-Access fabric implementations
- Multi-cloud connectivity patterns
- Cybersecurity frameworks
- AI-enabled observability and network operations

---

*This references page is regularly updated. For the latest documentation links, always verify URLs directly with vendor websites.*

*Last Updated: March 2026*
