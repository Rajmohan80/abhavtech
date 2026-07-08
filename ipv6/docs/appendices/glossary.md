# Glossary

## Technical Terms and Acronyms

This glossary provides definitions for key terms, acronyms, and concepts used throughout the IPv6 Migration Guide.

---

## A

**ACL (Access Control List)** — Packet filtering rules applied to router/switch interfaces to permit or deny traffic based on source/destination IP, port, protocol.

**ALG (Application Layer Gateway)** — NAT helper that modifies embedded IP addresses in application protocols (FTP, SIP, H.323).

**Anycast** — Routing technique where multiple servers share the same IP address; requests route to the nearest instance.

**AppDynamics** — Cisco application performance monitoring (APM) platform for distributed application visibility.

**ARIN (American Registry for Internet Numbers)** — Regional internet registry (RIR) for North America responsible for IPv4/IPv6 address allocations.

---

## B

**BFD (Bidirectional Forwarding Detection)** — Lightweight protocol for sub-second failure detection between network devices.

**BGP (Border Gateway Protocol)** — Path-vector routing protocol for inter-domain routing; de facto standard for internet and WAN routing.

**Brownfield Deployment** — Network implementation in an existing environment (vs. greenfield = new deployment).

---

## C

**CASB (Cloud Access Security Broker)** — Security enforcement point between cloud service consumers and providers (SaaS visibility/control).

**Catalyst Center (DNAC)** — Cisco DNA Center; centralized management platform for campus networks, SD-Access fabric orchestration.

**CDR (Call Detail Record)** — Log of call metadata (caller/callee, duration, timestamp) for billing and analysis.

**CUBE (Cisco Unified Border Element)** — Session border controller (SBC) for voice/video traffic between enterprise and service provider.

---

## D

**DDoS (Distributed Denial of Service)** — Cyberattack overwhelming targets with traffic from multiple sources.

**DHCPv6 (Dynamic Host Configuration Protocol for IPv6)** — DHCP variant for IPv6 address assignment, DNS configuration.

**DNAC** — See Catalyst Center.

**DNS64** — DNS mechanism translating AAAA (IPv6) queries to A (IPv4) records for NAT64 scenarios.

**DSCP (Differentiated Services Code Point)** — 6-bit field in IP header for QoS classification and traffic prioritization.

**Dual-Stack** — Network configuration running both IPv4 and IPv6 protocols simultaneously.

---

## E

**EID (Endpoint Identifier)** — In LISP, the IP address identifying an endpoint independent of its location.

**Encrypted Traffic Analytics (ETA)** — Cisco technology detecting malware in encrypted traffic without decryption (passive monitoring).

**ExpressRoute** — Microsoft Azure dedicated private connectivity service (equivalent to AWS Direct Connect).

---

## F

**Fabric** — SD-Access network architecture using LISP control plane and VXLAN data plane for automated, policy-driven networking.

**FNF (Flexible NetFlow)** — Cisco NetFlow variant with customizable flow record definitions and export formats.

---

## G

**gNMI (gRPC Network Management Interface)** — YANG-based network management protocol using gRPC for streaming telemetry.

**Greenfield Deployment** — Network implementation in a new environment with no legacy constraints.

---

## H

**HA (High Availability)** — System design minimizing downtime through redundancy (active/standby or active/active).

**HSRP (Hot Standby Router Protocol)** — Cisco first-hop redundancy protocol for gateway failover.

---

## I

**IPAM (IP Address Management)** — System for planning, tracking, and managing IP address allocations.

**IPsec (Internet Protocol Security)** — Protocol suite for encrypting and authenticating IP packets (used in VPNs).

**ISE (Identity Services Engine)** — Cisco platform for network access control (NAC), TrustSec policy enforcement, and guest management.

**IVR (Interactive Voice Response)** — Automated phone system for caller self-service and routing.

---

## L

**LISP (Locator/ID Separation Protocol)** — Control plane protocol in SD-Access fabric mapping endpoint IDs to network locations (RLOCs).

---

## M

**MAB (MAC Authentication Bypass)** — 802.1X fallback authenticating devices via MAC address lookup (for non-802.1X-capable devices).

**MCP (Model Context Protocol)** — Protocol for connecting AI assistants to external data sources and tools.

**MDT (Model-Driven Telemetry)** — Network telemetry push model using YANG data models for structured, real-time metrics.

**Micro-Segmentation** — Fine-grained network segmentation applying per-endpoint policies (vs. VLAN-level segmentation).

**MLO (Multi-Link Operation)** — WiFi 7 feature using multiple frequency bands simultaneously for aggregated bandwidth and low latency.

**MOS (Mean Opinion Score)** — Voice quality metric (1-5 scale) based on listener perception; target for enterprise voice: 4.0+.

---

## N

**NAT64** — Protocol translation converting IPv6 packets to IPv4 for IPv6-only clients accessing IPv4-only services.

**NDP (Neighbor Discovery Protocol)** — IPv6 protocol replacing ARP for address resolution, router discovery, duplicate address detection.

**NGFW (Next-Generation Firewall)** — Stateful firewall with deep packet inspection, IPS, application awareness, threat intelligence.

---

## O

**OMP (Overlay Management Protocol)** — SD-WAN control plane protocol for route exchange between vManage controllers and WAN edge routers.

**OSPFv3** — OSPF version 3; link-state routing protocol extended for IPv6 support.

---

## P

**PagerDuty** — Incident management platform for alerting, escalation, and on-call scheduling.

**PIM (Protocol Independent Multicast)** — Multicast routing protocol family (PIM-SM, PIM-DM, PIM-SSM).

**pxGrid (Platform Exchange Grid)** — Cisco ISE integration framework sharing context (SGTs, endpoint data) with third-party systems.

---

## Q

**QoS (Quality of Service)** — Traffic prioritization mechanisms ensuring bandwidth, latency, jitter SLAs for critical applications (voice, video).

---

## R

**RA (Router Advertisement)** — ICMPv6 message from routers advertising prefix, default gateway, and network parameters for SLAAC.

**RLOC (Routing Locator)** — In LISP, the network location of an endpoint (where it's physically connected).

**RTP (Real-time Transport Protocol)** — Protocol for delivering audio/video streams (used in VoIP, video conferencing).

---

## S

**SASE (Secure Access Service Edge)** — Cloud-delivered security framework combining SD-WAN, SWG, CASB, FWaaS, ZTNA.

**SBC (Session Border Controller)** — See CUBE.

**SD-Access** — Cisco Software-Defined Access; campus fabric architecture using LISP + VXLAN + TrustSec for automated policy enforcement.

**SD-WAN** — Software-Defined Wide Area Network; centrally managed WAN architecture with application-aware routing and multi-transport support.

**SGT (Scalable Group Tag)** — 16-bit tag in Cisco TrustSec identifying user/device group for policy enforcement independent of IP address or VLAN.

**SIG (Secure Internet Gateway)** — Cloud-based security service inspecting internet-bound traffic (part of SASE/SSE).

**SIP (Session Initiation Protocol)** — Signaling protocol for VoIP call setup, modification, and teardown.

**SLAAC (Stateless Address Autoconfiguration)** — IPv6 mechanism allowing hosts to self-configure addresses from router advertisements (no DHCP server required).

**SOAR (Security Orchestration, Automation, and Response)** — Platform automating incident response workflows (block IP, quarantine host, create ticket).

**SRTP (Secure Real-time Transport Protocol)** — RTP with encryption for voice/video privacy.

**SRST (Survivability Remote Site Telephony)** — Cisco feature providing local call processing during WAN failure.

**SSE (Security Service Edge)** — Security components of SASE (SWG, CASB, FWaaS, ZTNA) without SD-WAN networking.

---

## T

**Talos** — Cisco threat intelligence organization providing real-time threat feeds, malware analysis, vulnerability research.

**ThousandEyes** — Network intelligence platform for internet/cloud/WAN path visibility, synthetic monitoring, BGP routing analysis.

**TrustSec** — Cisco security architecture using SGTs for software-defined segmentation and policy enforcement.

---

## V

**Vertex AI** — Google Cloud Platform managed machine learning service for training and deploying ML models.

**VN (Virtual Network)** — Layer 3 segmentation construct in SD-Access fabric (similar to VRF in traditional networks).

**VNI (VXLAN Network Identifier)** — 24-bit identifier in VXLAN header segregating traffic across overlay networks.

**VPN (Virtual Private Network)** — In SD-WAN context, a routing domain (VRF) separating traffic types (VPN 0 = transport, VPN 10+ = service-side).

**VRRP (Virtual Router Redundancy Protocol)** — Open-standard first-hop redundancy protocol for gateway failover.

**VXLAN (Virtual Extensible LAN)** — Overlay encapsulation protocol extending Layer 2 networks over Layer 3 infrastructure (used in SD-Access data plane).

---

## W

**WAN (Wide Area Network)** — Network connecting geographically dispersed sites (MPLS, internet, leased lines).

**WebAuth (Web Authentication)** — Captive portal authentication method for guest/BYOD access (802.1X alternative).

**WLC (Wireless LAN Controller)** — Centralized management platform for enterprise WiFi access points.

---

## Z

**Zero-Touch Provisioning (ZTP)** — Automated device onboarding without manual configuration (device boots, calls home, downloads config).

**Zero-Trust** — Security model assuming no implicit trust; continuously verify every access attempt regardless of location.

**ZTNA (Zero Trust Network Access)** — Identity-centric remote access replacing traditional VPNs with application-level access controls.

---

## IPv6-Specific Terms

**EUI-64** — Modified EUI-64 format converting MAC address to IPv6 interface identifier (deprecated for privacy; SLAAC privacy extensions preferred).

**GUA (Global Unicast Address)** — Publicly routable IPv6 address (equivalent to public IPv4).

**Link-Local Address** — IPv6 address valid only on local network segment (fe80::/10 prefix); used for NDP, routing protocols.

**Prefix Delegation** — DHCPv6 mechanism assigning IPv6 prefixes to routers (common in ISP environments).

**Privacy Extensions (RFC 4941)** — SLAAC variant generating temporary random interface IDs for outbound connections (privacy vs. stable EUI-64 addresses).

**ULA (Unique Local Address)** — IPv6 private address (fc00::/7 prefix); equivalent to RFC 1918 private IPv4.

---

*For official definitions, consult IETF RFCs, Cisco documentation, and vendor glossaries.*
