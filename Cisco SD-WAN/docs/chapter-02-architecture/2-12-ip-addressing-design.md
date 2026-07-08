# 2.12 IP Addressing Design

## Document Information
| Field | Value |
|-------|-------|
| Document Title | SD-WAN IP Addressing Design |
| Version | 1.0 |
| Author | Network Architecture Team |
| Organization | Abhavtech.com |
| Last Updated | December 2025 |
| Status | Production |

---

## Table of Contents
1. [IP Address Strategy](#ip-address-strategy)
2. [System IP Allocation](#system-ip-allocation)
3. [Transport Addressing](#transport-addressing)
4. [Service VPN Addressing](#service-vpn-addressing)
5. [Management Addressing](#management-addressing)
6. [SD-Access Handoff Addressing](#sd-access-handoff-addressing)
7. [IPAM Integration](#ipam-integration)

---

## 1. IP Address Strategy

### 1.1 Addressing Principles

**Design Principles:**
- Hierarchical allocation for summarization
- Regional blocks for MRF optimization
- Separation of management, control, and data planes
- Reserved ranges for growth
- Integration with existing SD-Access IPAM (Infoblox)

### 1.2 IP Address Block Allocation

```
+--------------------------------------------------------------------+
|                    ABHAVTECH IP ADDRESSING SCHEME                   |
+--------------------------------------------------------------------+
|                                                                     |
|  10.0.0.0/8 - Enterprise Allocation                                |
|  ├── 10.10.0.0/16 - India Region (Campus/SD-Access)                |
|  ├── 10.20.0.0/16 - EMEA Region (Campus)                           |
|  ├── 10.30.0.0/16 - Americas Region (Campus)                       |
|  ├── 10.100.0.0/16 - SD-WAN Infrastructure                         |
|  │   ├── 10.100.0.0/20 - System IPs                                |
|  │   ├── 10.100.16.0/20 - Transport Interfaces                     |
|  │   └── 10.100.32.0/20 - Loopbacks/Management                     |
|  ├── 10.200.0.0/16 - Cloud Connectivity                            |
|  ├── 10.252.0.0/16 - Fabric Handoff Point-to-Point                 |
|  └── 10.254.0.0/16 - Management/OOB                                |
|                                                                     |
|  172.16.0.0/12 - Service VPNs (User Traffic)                       |
|  ├── 172.16.0.0/16 - VPN 10 (Employee)                             |
|  ├── 172.17.0.0/16 - VPN 20 (Guest)                                |
|  ├── 172.18.0.0/16 - VPN 30 (IoT)                                  |
|  ├── 172.19.0.0/16 - VPN 40 (Voice)                                |
|  └── 172.20.0.0/16 - VPN 50 (Shared Services)                      |
|                                                                     |
+--------------------------------------------------------------------+
```

---

## 2. System IP Allocation

### 2.1 System IP Design

System IPs serve as unique identifiers for SD-WAN devices and are used for OMP routing and TLOC identification.

**System IP Allocation:**

| Region | Range | Sites |
|--------|-------|-------|
| India (Region 1) | 10.100.1.0/24 | Mumbai, Chennai, Bangalore, Delhi, Noida |
| EMEA (Region 2) | 10.100.2.0/24 | London, Frankfurt |
| Americas (Region 3) | 10.100.3.0/24 | New Jersey, Dallas |
| Core (Region 0) | 10.100.0.0/24 | Border routers |

### 2.2 Device System IP Assignment

**Controllers:**

| Device | System IP | Site | Role |
|--------|-----------|------|------|
| vManage-1 | 10.100.0.1 | Mumbai | Manager (Primary) |
| vManage-2 | 10.100.0.2 | Mumbai | Manager |
| vManage-3 | 10.100.0.3 | Mumbai | Manager |
| vManage-DR1 | 10.100.0.4 | Chennai | Manager (DR) |
| vManage-DR2 | 10.100.0.5 | Chennai | Manager (DR) |
| vManage-DR3 | 10.100.0.6 | Chennai | Manager (DR) |
| vSmart-1 | 10.100.0.11 | Mumbai | Controller |
| vSmart-2 | 10.100.0.12 | Mumbai | Controller |
| vSmart-3 | 10.100.0.13 | Chennai | Controller |
| vSmart-4 | 10.100.0.14 | Chennai | Controller |
| vBond-1 | 10.100.0.21 | Cloud-Mumbai | Validator |
| vBond-2 | 10.100.0.22 | Cloud-Ireland | Validator |

**WAN Edges - India Region:**

| Device | System IP | Site | Role |
|--------|-----------|------|------|
| MUM-DC-WAN-01 | 10.100.1.1 | Mumbai DC | Primary DC Edge |
| MUM-DC-WAN-02 | 10.100.1.2 | Mumbai DC | Secondary DC Edge |
| CHN-DR-WAN-01 | 10.100.1.11 | Chennai DR | Primary DR Edge |
| CHN-DR-WAN-02 | 10.100.1.12 | Chennai DR | Secondary DR Edge |
| BLR-BR-WAN-01 | 10.100.1.21 | Bangalore | Primary Branch Edge |
| BLR-BR-WAN-02 | 10.100.1.22 | Bangalore | Secondary Branch Edge |
| DEL-BR-WAN-01 | 10.100.1.31 | Delhi | Primary Branch Edge |
| DEL-BR-WAN-02 | 10.100.1.32 | Delhi | Secondary Branch Edge |
| NOI-BR-WAN-01 | 10.100.1.41 | Noida | Branch Edge (Single) |

**WAN Edges - EMEA Region:**

| Device | System IP | Site | Role |
|--------|-----------|------|------|
| LON-HUB-WAN-01 | 10.100.2.1 | London | Primary Hub Edge |
| LON-HUB-WAN-02 | 10.100.2.2 | London | Secondary Hub Edge |
| FRA-HUB-WAN-01 | 10.100.2.11 | Frankfurt | Primary Hub Edge |
| FRA-HUB-WAN-02 | 10.100.2.12 | Frankfurt | Secondary Hub Edge |

**WAN Edges - Americas Region:**

| Device | System IP | Site | Role |
|--------|-----------|------|------|
| NJ-HUB-WAN-01 | 10.100.3.1 | New Jersey | Primary Hub Edge |
| NJ-HUB-WAN-02 | 10.100.3.2 | New Jersey | Secondary Hub Edge |
| DAL-HUB-WAN-01 | 10.100.3.11 | Dallas | Primary Hub Edge |
| DAL-HUB-WAN-02 | 10.100.3.12 | Dallas | Secondary Hub Edge |

---

## 3. Transport Addressing

### 3.1 Transport IP Scheme

```
+------------------------------------------------------------------+
|                    TRANSPORT IP ALLOCATION                        |
+------------------------------------------------------------------+
|                                                                   |
|  MPLS Transport: 10.100.16.0/22 (Provider-assigned or internal)  |
|  ├── Mumbai: 10.100.16.0/28                                      |
|  ├── Chennai: 10.100.16.16/28                                    |
|  ├── Bangalore: 10.100.16.32/28                                  |
|  ├── Delhi: 10.100.16.48/28                                      |
|  ├── London: 10.100.16.64/28                                     |
|  ├── Frankfurt: 10.100.16.80/28                                  |
|  └── New Jersey: 10.100.16.96/28                                 |
|                                                                   |
|  Internet (DIA): Public IPs (ISP-assigned)                       |
|  ├── Mumbai: 203.0.113.0/28 (example)                            |
|  ├── Chennai: 198.51.100.0/28 (example)                          |
|  └── ... ISP-assigned per site                                   |
|                                                                   |
|  Cellular (LTE/5G): Carrier CGNAT (no static IP)                 |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 Transport Interface Assignment

**Mumbai DC Transport Interfaces:**

| Interface | Color | IP Address | Gateway | VLAN |
|-----------|-------|------------|---------|------|
| GigabitEthernet0/0/0 | mpls | 10.100.16.1/30 | 10.100.16.2 | 100 |
| GigabitEthernet0/0/1 | biz-internet | 203.0.113.1/29 | 203.0.113.6 | 200 |
| Cellular0/0/0 | 5g | DHCP | Carrier | N/A |

---

## 4. Service VPN Addressing

### 4.1 VPN-to-Subnet Mapping

| VPN ID | Name | Subnet Block | Description |
|--------|------|--------------|-------------|
| 0 | Transport | 10.100.16.0/20 | WAN interfaces |
| 10 | Employee | 172.16.0.0/16 | Corporate users |
| 20 | Guest | 172.17.0.0/16 | Guest/visitor |
| 30 | IoT | 172.18.0.0/16 | IoT devices |
| 40 | Voice | 172.19.0.0/16 | VoIP traffic |
| 50 | Shared | 172.20.0.0/16 | Shared services |
| 512 | Management | 10.254.0.0/16 | OOB management |

### 4.2 Site-Specific Service VPN Allocation

**Mumbai DC - VPN 10 (Employee):**

| Subnet | VLAN | Purpose |
|--------|------|---------|
| 172.16.1.0/24 | 1010 | Engineering |
| 172.16.2.0/24 | 1020 | Finance |
| 172.16.3.0/24 | 1030 | HR |
| 172.16.4.0/24 | 1040 | Marketing |
| 172.16.5.0/24 | 1050 | Operations |
| 172.16.10.0/24 | 1100 | Data Center Servers |

---

## 5. Management Addressing

### 5.1 Management VPN (VPN 512)

| Component | IP Address | Notes |
|-----------|------------|-------|
| vManage Cluster VIP | 10.254.1.100 | Mumbai |
| vManage-1 | 10.254.1.1 | Mumbai |
| vManage-2 | 10.254.1.2 | Mumbai |
| vManage-3 | 10.254.1.3 | Mumbai |
| vManage DR VIP | 10.254.2.100 | Chennai |
| vSmart-1/2 | 10.254.1.20-21 | Mumbai |
| vSmart-3/4 | 10.254.2.20-21 | Chennai |
| ISE-PAN-01 | 10.254.1.10 | Mumbai (shared with SD-Access) |
| ISE-PSN-01 | 10.254.1.11 | Mumbai |

### 5.2 OOB Management Network

```
Out-of-Band Management Network: 10.254.0.0/16

Site Allocation:
├── Mumbai DC: 10.254.1.0/24
├── Chennai DR: 10.254.2.0/24
├── Bangalore: 10.254.11.0/24
├── Delhi: 10.254.12.0/24
├── Noida: 10.254.13.0/24
├── London: 10.254.21.0/24
├── Frankfurt: 10.254.22.0/24
├── New Jersey: 10.254.31.0/24
└── Dallas: 10.254.32.0/24
```

---

## 6. SD-Access Handoff Addressing

### 6.1 Fabric Handoff Point-to-Point Links

**Handoff IP Allocation: 10.252.0.0/16**

```
+------------------------------------------------------------------+
|                SD-ACCESS <-> SD-WAN HANDOFF IPs                   |
+------------------------------------------------------------------+
|                                                                   |
|  Mumbai DC Handoff (10.252.1.0/24):                              |
|                                                                   |
|  VRF Employee (VPN 10):                                          |
|    SD-Access Border: 10.252.1.1/30                               |
|    SD-WAN Edge:      10.252.1.2/30                               |
|                                                                   |
|  VRF Guest (VPN 20):                                             |
|    SD-Access Border: 10.252.1.5/30                               |
|    SD-WAN Edge:      10.252.1.6/30                               |
|                                                                   |
|  VRF IoT (VPN 30):                                               |
|    SD-Access Border: 10.252.1.9/30                               |
|    SD-WAN Edge:      10.252.1.10/30                              |
|                                                                   |
|  VRF Voice (VPN 40):                                             |
|    SD-Access Border: 10.252.1.13/30                              |
|    SD-WAN Edge:      10.252.1.14/30                              |
|                                                                   |
|  VRF Shared (VPN 50):                                            |
|    SD-Access Border: 10.252.1.17/30                              |
|    SD-WAN Edge:      10.252.1.18/30                              |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 Complete Handoff IP Table

| Site | VPN | VLAN | SD-Access Border IP | SD-WAN Edge IP | BGP AS |
|------|-----|------|---------------------|----------------|--------|
| Mumbai | 10 | 3010 | 10.252.1.1/30 | 10.252.1.2/30 | 65100/65200 |
| Mumbai | 20 | 3020 | 10.252.1.5/30 | 10.252.1.6/30 | 65100/65200 |
| Mumbai | 30 | 3030 | 10.252.1.9/30 | 10.252.1.10/30 | 65100/65200 |
| Mumbai | 40 | 3040 | 10.252.1.13/30 | 10.252.1.14/30 | 65100/65200 |
| Mumbai | 50 | 3050 | 10.252.1.17/30 | 10.252.1.18/30 | 65100/65200 |
| Chennai | 10 | 3010 | 10.252.2.1/30 | 10.252.2.2/30 | 65100/65200 |
| Chennai | 20 | 3020 | 10.252.2.5/30 | 10.252.2.6/30 | 65100/65200 |
| Chennai | 30 | 3030 | 10.252.2.9/30 | 10.252.2.10/30 | 65100/65200 |
| Chennai | 40 | 3040 | 10.252.2.13/30 | 10.252.2.14/30 | 65100/65200 |
| Chennai | 50 | 3050 | 10.252.2.17/30 | 10.252.2.18/30 | 65100/65200 |

---

## 7. IPAM Integration

### 7.1 Infoblox Integration

**IPAM Configuration:**

| Container | Range | Purpose |
|-----------|-------|---------|
| SD-WAN-System | 10.100.0.0/16 | System IPs, Transport |
| SD-WAN-Services | 172.16.0.0/12 | Service VPN subnets |
| SD-WAN-Handoff | 10.252.0.0/16 | Fabric handoff P2P |
| SD-WAN-Mgmt | 10.254.0.0/16 | Management VPN |

### 7.2 IP Reservation Standards

**Reservation Convention:**

| Address | Purpose |
|---------|---------|
| .1 | Default gateway (HSRP/VRRP VIP) |
| .2 | Primary router |
| .3 | Secondary router |
| .4-.10 | Network infrastructure |
| .11-.50 | Servers/static hosts |
| .51-.200 | DHCP pool |
| .201-.250 | Reserved for growth |
| .251-.254 | Network management |

### 7.3 IP Address Summary Table

| Block | Size | Purpose | Utilization |
|-------|------|---------|-------------|
| 10.100.0.0/16 | 65,536 | SD-WAN Infrastructure | 5% |
| 10.252.0.0/16 | 65,536 | Fabric Handoff | 1% |
| 10.254.0.0/16 | 65,536 | Management | 10% |
| 172.16.0.0/12 | 1,048,576 | Service VPNs | 15% |
| **Total** | **1,245,184** | **Enterprise** | **~8%** |

---

## Summary

The IP addressing design provides a hierarchical, scalable structure supporting SD-WAN deployment while integrating with existing SD-Access infrastructure.

**Key Design Points:**
- System IPs: Regional allocation (10.100.x.0/24)
- Service VPNs: 172.16.0.0/12 block for user traffic
- Fabric Handoff: /30 P2P links in 10.252.0.0/16
- Management: 10.254.0.0/16 for OOB
- IPAM: Infoblox integration with reserved ranges

**Next Section:** [2.13 Modern SD-WAN Features](2-13-modern-sdwan-features.md)

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
