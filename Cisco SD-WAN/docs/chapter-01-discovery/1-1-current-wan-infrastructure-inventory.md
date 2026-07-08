# 1.1 Current WAN Infrastructure Inventory

## Document Information

| Item | Details |
|------|---------|
| **Document Version** | 1.0 |
| **Last Updated** | December 2025 |
| **Author** | Network Architecture Team |
| **Organization** | Abhavtech.com |
| **Classification** | Internal Use Only |

---

## 1.1.1 Overview

This section documents the complete inventory of Abhavtech.com's existing WAN infrastructure prior to the SD-WAN migration. A thorough understanding of current assets, circuit inventory, and device configurations is essential for planning a successful migration from traditional MPLS to Cisco Catalyst SD-WAN.

### Inventory Objectives

- Document all WAN edge devices and their configurations
- Catalog existing MPLS circuits with provider details
- Identify Internet and backup connectivity at each site
- Map current routing protocols and topologies
- Assess hardware lifecycle and refresh requirements
- Establish baseline for migration planning

---

## 1.1.2 Site Overview and Classification

### Global Site Distribution

```
                          ABHAVTECH.COM GLOBAL WAN TOPOLOGY
                          =================================

                    ┌─────────────────────────────────────────────────────┐
                    │                  AMERICAS REGION                     │
                    │  ┌─────────────┐          ┌─────────────┐           │
                    │  │  New Jersey │◄────────►│   Dallas    │           │
                    │  │    (Hub)    │  MPLS    │    (Hub)    │           │
                    │  └──────┬──────┘          └──────┬──────┘           │
                    └─────────┼────────────────────────┼──────────────────┘
                              │                        │
                              │    Global MPLS Core    │
                              │                        │
                    ┌─────────┼────────────────────────┼──────────────────┐
                    │         │     EMEA REGION        │                  │
                    │  ┌──────▼──────┐          ┌──────▼──────┐           │
                    │  │   London    │◄────────►│  Frankfurt  │           │
                    │  │    (Hub)    │  MPLS    │    (Hub)    │           │
                    │  └──────┬──────┘          └──────┬──────┘           │
                    └─────────┼────────────────────────┼──────────────────┘
                              │                        │
                              │    Global MPLS Core    │
                              │                        │
┌─────────────────────────────┼────────────────────────┼────────────────────────────────┐
│                             │       INDIA REGION     │                                │
│  ┌─────────────┐     ┌──────▼──────┐          ┌──────▼──────┐     ┌─────────────┐    │
│  │  Bangalore  │◄───►│   Mumbai    │◄────────►│   Chennai   │◄───►│    Delhi    │    │
│  │  (Branch)   │     │ (Primary DC)│  MPLS    │    (DR DC)  │     │  (Branch)   │    │
│  └─────────────┘     └──────┬──────┘          └──────┬──────┘     └─────────────┘    │
│                             │                        │                               │
│                      ┌──────▼──────┐                 │                               │
│                      │    Noida    │◄────────────────┘                               │
│                      │  (Branch)   │                                                 │
│                      └─────────────┘                                                 │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Site Classification Matrix

| Site | Region | Classification | Role | Users | Critical Apps |
|------|--------|----------------|------|-------|---------------|
| Mumbai | India | Tier-1 Hub | Primary DC | 850 | ERP, Core Banking, SAP |
| Chennai | India | Tier-1 Hub | DR DC | 420 | DR Systems, Backup |
| Bangalore | India | Tier-2 Branch | Engineering | 380 | DevOps, Cloud Access |
| Delhi | India | Tier-2 Branch | Sales/Admin | 290 | CRM, Office 365 |
| Noida | India | Tier-2 Branch | Development | 340 | CI/CD, Code Repos |
| London | EMEA | Tier-1 Hub | Regional HQ | 180 | Finance, Compliance |
| Frankfurt | EMEA | Tier-1 Hub | EU Operations | 150 | Trading, Analytics |
| New Jersey | Americas | Tier-1 Hub | US HQ | 220 | Executive, Legal |
| Dallas | Americas | Tier-1 Hub | US Operations | 165 | Support, Customer Ops |

### Site Tier Definitions

| Tier | Classification | Characteristics | HA Requirement |
|------|----------------|-----------------|----------------|
| Tier-1 Hub | Data Center/Regional HQ | >100 users, Critical services | Dual router, Dual circuits |
| Tier-2 Branch | Regional Office | 50-400 users, Standard services | Single/Dual router |
| Tier-3 Branch | Small Office | <50 users, Limited services | Single router |

---

## 1.1.3 WAN Edge Router Inventory

### Current Router Deployment

| Site | Router Model | IOS Version | Role | Serial Number | Install Date | EoL Status |
|------|--------------|-------------|------|---------------|--------------|------------|
| Mumbai-R1 | ISR4451-X | 16.12.4 | Primary WAN | FGL2134ABCD | Mar 2020 | Active |
| Mumbai-R2 | ISR4451-X | 16.12.4 | Secondary WAN | FGL2134EFGH | Mar 2020 | Active |
| Chennai-R1 | ISR4351 | 16.12.4 | Primary WAN | FGL2145IJKL | Jun 2020 | Active |
| Chennai-R2 | ISR4351 | 16.12.4 | Secondary WAN | FGL2145MNOP | Jun 2020 | Active |
| Bangalore-R1 | ISR4331 | 16.12.4 | Primary WAN | FGL2156QRST | Sep 2020 | Active |
| Delhi-R1 | ISR4331 | 16.12.4 | Primary WAN | FGL2167UVWX | Sep 2020 | Active |
| Noida-R1 | ISR4331 | 16.12.4 | Primary WAN | FGL2178YZAB | Dec 2020 | Active |
| London-R1 | ISR4351 | 16.12.4 | Primary WAN | FGL2189CDEF | Jan 2021 | Active |
| London-R2 | ISR4351 | 16.12.4 | Secondary WAN | FGL2189GHIJ | Jan 2021 | Active |
| Frankfurt-R1 | ISR4351 | 16.12.4 | Primary WAN | FGL2190KLMN | Feb 2021 | Active |
| Frankfurt-R2 | ISR4351 | 16.12.4 | Secondary WAN | FGL2190OPQR | Feb 2021 | Active |
| New Jersey-R1 | ISR4451-X | 16.12.4 | Primary WAN | FGL2201STUV | Mar 2021 | Active |
| New Jersey-R2 | ISR4451-X | 16.12.4 | Secondary WAN | FGL2201WXYZ | Mar 2021 | Active |
| Dallas-R1 | ISR4351 | 16.12.4 | Primary WAN | FGL2212ABCD | Apr 2021 | Active |
| Dallas-R2 | ISR4351 | 16.12.4 | Secondary WAN | FGL2212EFGH | Apr 2021 | Active |

### Router Hardware Specifications

| Model | Max Throughput | Memory | Flash | NIM Slots | Performance |
|-------|---------------|--------|-------|-----------|-------------|
| ISR4451-X | 2 Gbps | 16 GB | 8 GB | 3 | Enterprise aggregation |
| ISR4351 | 400 Mbps | 8 GB | 4 GB | 3 | Branch aggregation |
| ISR4331 | 300 Mbps | 8 GB | 4 GB | 2 | Branch office |

### Network Interface Module (NIM) Inventory

| Site | Router | Slot 0 | Slot 1 | Slot 2 |
|------|--------|--------|--------|--------|
| Mumbai-R1 | ISR4451-X | NIM-2GE-CU | NIM-4FXS | NIM-ES2-8 |
| Mumbai-R2 | ISR4451-X | NIM-2GE-CU | NIM-4FXS | NIM-ES2-8 |
| Chennai-R1 | ISR4351 | NIM-2GE-CU | NIM-4FXS | Empty |
| Chennai-R2 | ISR4351 | NIM-2GE-CU | NIM-4FXS | Empty |
| Bangalore-R1 | ISR4331 | NIM-2GE-CU | NIM-4G-LTE | - |
| Delhi-R1 | ISR4331 | NIM-2GE-CU | NIM-4G-LTE | - |
| Noida-R1 | ISR4331 | NIM-2GE-CU | NIM-4G-LTE | - |
| London-R1 | ISR4351 | NIM-2GE-CU | Empty | Empty |
| London-R2 | ISR4351 | NIM-2GE-CU | Empty | Empty |
| Frankfurt-R1 | ISR4351 | NIM-2GE-CU | Empty | Empty |
| Frankfurt-R2 | ISR4351 | NIM-2GE-CU | Empty | Empty |
| New Jersey-R1 | ISR4451-X | NIM-2GE-CU | NIM-4FXS | NIM-ES2-8 |
| New Jersey-R2 | ISR4451-X | NIM-2GE-CU | NIM-4FXS | NIM-ES2-8 |
| Dallas-R1 | ISR4351 | NIM-2GE-CU | Empty | Empty |
| Dallas-R2 | ISR4351 | NIM-2GE-CU | Empty | Empty |

---

## 1.1.4 MPLS Circuit Inventory

### Primary MPLS Circuits

| Circuit ID | Site | Provider | CIR (Mbps) | Port Speed | Contract End | Monthly Cost |
|------------|------|----------|------------|------------|--------------|--------------|
| MPLS-MUM-001 | Mumbai | Tata Communications | 500 | 1000 | Dec 2026 | $X,XXX |
| MPLS-MUM-002 | Mumbai | Bharti Airtel | 300 | 500 | Mar 2026 | $X,XXX |
| MPLS-CHE-001 | Chennai | Tata Communications | 300 | 500 | Dec 2026 | $X,XXX |
| MPLS-CHE-002 | Chennai | Reliance Jio | 200 | 500 | Jun 2026 | $X,XXX |
| MPLS-BLR-001 | Bangalore | Tata Communications | 200 | 300 | Dec 2026 | $X,XXX |
| MPLS-DEL-001 | Delhi | Bharti Airtel | 150 | 300 | Mar 2026 | $X,XXX |
| MPLS-NOI-001 | Noida | Tata Communications | 150 | 300 | Dec 2026 | $X,XXX |
| MPLS-LON-001 | London | BT Global | 200 | 500 | Sep 2026 | $X,XXX |
| MPLS-LON-002 | London | Vodafone | 100 | 200 | Sep 2026 | $X,XXX |
| MPLS-FRA-001 | Frankfurt | Deutsche Telekom | 200 | 500 | Sep 2026 | $X,XXX |
| MPLS-FRA-002 | Frankfurt | Colt | 100 | 200 | Sep 2026 | $X,XXX |
| MPLS-NJ-001 | New Jersey | AT&T | 300 | 500 | Jun 2026 | $X,XXX |
| MPLS-NJ-002 | New Jersey | Verizon | 200 | 300 | Jun 2026 | $X,XXX |
| MPLS-DAL-001 | Dallas | AT&T | 200 | 300 | Jun 2026 | $X,XXX |
| MPLS-DAL-002 | Dallas | Lumen | 100 | 200 | Jun 2026 | $X,XXX |

### MPLS Circuit Summary

| Metric | Value |
|--------|-------|
| **Total Circuits** | 15 |
| **Total CIR Bandwidth** | 3,000 Mbps |
| **Total Monthly Cost** | $XX,XXX |
| **Average Cost per Mbps** | $XX.XX |
| **Primary Provider** | Tata Communications (5 circuits) |
| **Secondary Provider** | AT&T (3 circuits) |

### MPLS Service Level Agreements

| SLA Metric | Contracted Value | Current Performance |
|------------|------------------|---------------------|
| Availability | 99.95% | 99.92% |
| Latency (Regional) | <15 ms | 12-18 ms |
| Latency (Inter-Regional) | <150 ms | 120-180 ms |
| Jitter | <5 ms | 3-8 ms |
| Packet Loss | <0.1% | 0.05-0.15% |

---

## 1.1.5 Internet Circuit Inventory

### Direct Internet Access (DIA) Circuits

| Circuit ID | Site | Provider | Bandwidth | Type | IP Addresses | Monthly Cost |
|------------|------|----------|-----------|------|--------------|--------------|
| DIA-MUM-001 | Mumbai | Tata | 500 Mbps | Fiber | /29 (6 usable) | $X,XXX |
| DIA-MUM-002 | Mumbai | Airtel | 300 Mbps | Fiber | /29 (6 usable) | $X,XXX |
| DIA-CHE-001 | Chennai | ACT | 200 Mbps | Fiber | /30 (2 usable) | $XXX |
| DIA-BLR-001 | Bangalore | ACT | 150 Mbps | Fiber | /30 (2 usable) | $XXX |
| DIA-DEL-001 | Delhi | Excitel | 100 Mbps | Fiber | /30 (2 usable) | $XXX |
| DIA-NOI-001 | Noida | Spectra | 100 Mbps | Fiber | /30 (2 usable) | $XXX |
| DIA-LON-001 | London | BT | 200 Mbps | Fiber | /29 (6 usable) | $X,XXX |
| DIA-FRA-001 | Frankfurt | DE-CIX | 200 Mbps | Fiber | /29 (6 usable) | $X,XXX |
| DIA-NJ-001 | New Jersey | Comcast | 300 Mbps | Fiber | /29 (6 usable) | $X,XXX |
| DIA-DAL-001 | Dallas | Spectrum | 200 Mbps | Fiber | /30 (2 usable) | $XXX |

### Internet Circuit Summary

| Metric | Value |
|--------|-------|
| **Total Circuits** | 10 |
| **Total Bandwidth** | 2,250 Mbps |
| **Total Monthly Cost** | $XX,XXX |
| **Average Cost per Mbps** | $X.XX |

---

## 1.1.6 Backup and Cellular Connectivity

### 4G/LTE Backup Circuits

| Site | Provider | SIM Plan | Bandwidth | Purpose | Monthly Cost |
|------|----------|----------|-----------|---------|--------------|
| Bangalore | Jio | 100 GB | Up to 50 Mbps | WAN Backup | $XX |
| Delhi | Airtel | 100 GB | Up to 50 Mbps | WAN Backup | $XX |
| Noida | Jio | 100 GB | Up to 50 Mbps | WAN Backup | $XX |
| Mumbai | Vodafone | Unlimited | Up to 100 Mbps | Emergency | $XX |
| Chennai | Airtel | Unlimited | Up to 100 Mbps | Emergency | $XX |

### Cellular Backup Summary

| Metric | Value |
|--------|-------|
| **Total SIMs** | 5 |
| **Total Monthly Cost** | $XXX |
| **Coverage** | 5 of 9 sites (56%) |
| **Max Bandwidth** | 100 Mbps |

---

## 1.1.7 Current Routing Configuration

### Routing Protocol Summary

| Protocol | Scope | Purpose |
|----------|-------|---------|
| EIGRP | Internal (LAN) | Campus routing integration |
| BGP | WAN Edge | MPLS PE peering |
| OSPF | WAN Edge | Internet edge routing |
| Static | Backup | Failover routes |

### BGP Autonomous System Numbers

| Site | Local ASN | Provider ASN | Description |
|------|-----------|--------------|-------------|
| Mumbai | 65001 | 4755 (Tata) | Primary MPLS PE |
| Mumbai | 65001 | 9498 (Airtel) | Secondary MPLS PE |
| Chennai | 65002 | 4755 (Tata) | Primary MPLS PE |
| Chennai | 65002 | 55836 (Jio) | Secondary MPLS PE |
| London | 65003 | 5400 (BT) | Primary MPLS PE |
| Frankfurt | 65004 | 3320 (DTAG) | Primary MPLS PE |
| New Jersey | 65005 | 7018 (AT&T) | Primary MPLS PE |
| Dallas | 65006 | 7018 (AT&T) | Primary MPLS PE |

### Sample BGP Configuration (Mumbai-R1)

```cisco
! BGP Configuration for WAN Edge Router
router bgp 65001
 bgp log-neighbor-changes
 bgp graceful-restart
 !
 neighbor 10.255.1.1 remote-as 4755
 neighbor 10.255.1.1 description Tata-MPLS-PE
 neighbor 10.255.1.1 update-source GigabitEthernet0/0/0
 neighbor 10.255.1.1 timers 10 30
 neighbor 10.255.1.1 password 7 <encrypted>
 !
 address-family ipv4
  network 10.10.0.0 mask 255.255.0.0
  network 10.20.0.0 mask 255.255.0.0
  neighbor 10.255.1.1 activate
  neighbor 10.255.1.1 send-community both
  neighbor 10.255.1.1 soft-reconfiguration inbound
  neighbor 10.255.1.1 prefix-list ADVERTISE-ROUTES out
  neighbor 10.255.1.1 prefix-list ACCEPT-ROUTES in
 exit-address-family
!
ip prefix-list ADVERTISE-ROUTES seq 10 permit 10.10.0.0/16
ip prefix-list ADVERTISE-ROUTES seq 20 permit 10.20.0.0/16
ip prefix-list ACCEPT-ROUTES seq 10 permit 0.0.0.0/0
ip prefix-list ACCEPT-ROUTES seq 20 permit 10.0.0.0/8 le 24
```

### VRF Configuration Summary

| VRF Name | Route Distinguisher | Route Target Import | Route Target Export | Sites |
|----------|--------------------|--------------------|--------------------| ------|
| CORPORATE | 65001:100 | 65001:100 | 65001:100 | All |
| GUEST | 65001:200 | 65001:200 | 65001:200 | All |
| IOT | 65001:300 | 65001:300 | 65001:300 | DC Only |
| VOICE | 65001:400 | 65001:400 | 65001:400 | All |
| PCI | 65001:500 | 65001:500 | 65001:500 | Mumbai, NJ |

---

## 1.1.8 SD-Access Integration Points

### Existing SD-Access Border Nodes

| Site | Border Node | Platform | L3 Handoff Interface | Status |
|------|-------------|----------|---------------------|--------|
| Mumbai | MUM-BDR-01 | C9500-48Y4C | TenGigabitEthernet1/0/1 | Operational |
| Mumbai | MUM-BDR-02 | C9500-48Y4C | TenGigabitEthernet1/0/1 | Operational |
| Chennai | CHE-BDR-01 | C9500-48Y4C | TenGigabitEthernet1/0/1 | Operational |
| Chennai | CHE-BDR-02 | C9500-48Y4C | TenGigabitEthernet1/0/1 | Operational |
| Bangalore | BLR-BDR-01 | C9300-48U | GigabitEthernet1/0/48 | Operational |
| Delhi | DEL-BDR-01 | C9300-48U | GigabitEthernet1/0/48 | Operational |
| Noida | NOI-BDR-01 | C9300-48U | GigabitEthernet1/0/48 | Operational |

### Virtual Network (VN) to VRF Mapping

| Virtual Network | VRF Name | VLAN ID | VNI | SGT Range |
|-----------------|----------|---------|-----|-----------|
| Employee_VN | CORPORATE | 1001 | 50001 | 10-99 |
| Guest_VN | GUEST | 1002 | 50002 | 100-199 |
| IoT_VN | IOT | 1003 | 50003 | 200-299 |
| Voice_VN | VOICE | 1004 | 50004 | 300-399 |
| Shared_Services_VN | PCI | 1005 | 50005 | 400-499 |

### Current SD-Access to WAN Handoff

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CURRENT SD-ACCESS TO WAN HANDOFF                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐      VRF-Lite     ┌──────────────┐      MPLS VPN        │
│  │  SD-Access   │  ═══════════════► │   ISR 4451   │  ═══════════════►   │
│  │ Border Node  │                   │  (WAN Edge)  │     Provider PE      │
│  │  C9500-48Y4C │  ◄═══════════════ │              │  ◄═══════════════   │
│  └──────────────┘                   └──────────────┘                      │
│        │                                   │                               │
│        │ eBGP (AS 65100)                   │ eBGP (AS 65001)              │
│        │ 5 VRFs                            │ 5 VRFs                       │
│        │ TrustSec Inline                   │ No SGT (to be added)         │
│        │                                   │                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1.1.9 Infrastructure Management Systems

### Current Management Tools

| System | Purpose | Version | Integration Status |
|--------|---------|---------|-------------------|
| Cisco Prime Infrastructure | Device Management | 3.10 | Active |
| SolarWinds NPM | Monitoring | 2023.4 | Active |
| Splunk | Log Management | 9.1 | Active |
| ServiceNow | ITSM | Utah | Active |
| Infoblox | IPAM/DNS/DHCP | 8.6 | Active |
| Catalyst Center | SD-Access Management | 2.3.7.x | Active |
| ISE | Identity Services | 3.3 | Active |

### SNMP Configuration Summary

| Parameter | Value |
|-----------|-------|
| SNMP Version | v3 (SNMPv2c legacy) |
| Auth Protocol | SHA |
| Privacy Protocol | AES-256 |
| Polling Interval | 5 minutes |
| Trap Destination | 10.10.1.50 (SolarWinds) |

### Sample SNMP Configuration

```cisco
! SNMPv3 Configuration
snmp-server group MONITORING v3 priv
snmp-server user npmusername MONITORING v3 auth sha <auth-pass> priv aes 256 <priv-pass>
snmp-server host 10.10.1.50 version 3 priv npmusername
snmp-server enable traps
snmp-server location Mumbai-DC-Rack-A12
snmp-server contact noc@abhavtech.com
```

---

## 1.1.10 Hardware Lifecycle Assessment

### End-of-Life Analysis

| Platform | EoS Announced | EoL Date | Security Support End | Recommendation |
|----------|--------------|----------|---------------------|----------------|
| ISR4451-X | Not Announced | N/A | N/A | Continue, SD-WAN capable |
| ISR4351 | Not Announced | N/A | N/A | Continue, SD-WAN capable |
| ISR4331 | Not Announced | N/A | N/A | Continue, SD-WAN capable |

### SD-WAN Hardware Upgrade Path

| Current Platform | SD-WAN Capable | Recommended Upgrade | Notes |
|------------------|----------------|---------------------|-------|
| ISR4451-X | Yes (controller mode) | C8300-2N2S-6T | Better throughput, native SD-WAN |
| ISR4351 | Yes (controller mode) | C8300-1N1S-6T | Better throughput, native SD-WAN |
| ISR4331 | Yes (controller mode) | C8200L-1N-4T | Cost-effective for branches |

### Recommended New Hardware

| Site Type | Recommended Model | Throughput | Use Case |
|-----------|-------------------|------------|----------|
| Data Center Hub | C8500-12X4QC | 20 Gbps | High-capacity aggregation |
| Regional Hub | C8300-2N2S-6T | 5 Gbps | Regional aggregation |
| Large Branch | C8300-1N1S-6T | 2.5 Gbps | Branch with growth |
| Small Branch | C8200L-1N-4T | 1 Gbps | Cost-effective branch |

---

## 1.1.11 Inventory Summary and Migration Impact

### Current State Summary

| Category | Count | Monthly Cost |
|----------|-------|--------------|
| WAN Edge Routers | 15 | N/A (CapEx) |
| MPLS Circuits | 15 | $XX,XXX |
| DIA Circuits | 10 | $XX,XXX |
| 4G/LTE Backup | 5 | $XXX |
| **Total Monthly WAN Cost** | - | **$XX,XXX** |

### Assets Requiring Migration

| Asset Type | Total Count | Migration Action |
|------------|-------------|------------------|
| WAN Edge Routers | 15 | Convert to controller mode or replace |
| MPLS Circuits | 15 | Phase out over 12-18 months |
| DIA Circuits | 10 | Retain and expand |
| BGP Configurations | 8 ASNs | Migrate to OMP |
| VRF Configurations | 5 VRFs | Map to Service VPNs |
| SD-Access Handoffs | 7 borders | Reconfigure for SD-WAN |

### Key Discovery Findings

1. **Hardware**: All existing ISR 4000 series routers are SD-WAN capable in controller mode
2. **Circuits**: MPLS represents 85% of WAN cost; significant savings potential with SD-WAN
3. **Routing**: BGP configurations well-documented; VRF structure aligns with SD-WAN Service VPNs
4. **Integration**: SD-Access border nodes prepared for VRF-Lite handoff to SD-WAN
5. **Management**: Existing tools can integrate with SD-WAN Manager via APIs

---

## References

| Document | Description |
|----------|-------------|
| Cisco SD-WAN Hardware Compatibility | Platform support matrix |
| Cisco ISR 4000 Series Data Sheet | Current router specifications |
| Cisco Catalyst 8000 Series Data Sheet | Recommended upgrade platforms |
| Abhavtech Network Diagrams | Internal topology documentation |
| SD-Access Documentation v3.0 | LAN infrastructure reference |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
*Abhavtech.com - SD-WAN Documentation*
