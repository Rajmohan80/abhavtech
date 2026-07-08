# 7.5 SD-WAN Integration Overview

### 7.5.1 SD-WAN Integration Architecture

```
+------------------------------------------------------------------+
|                    SD-ACCESS TO SD-WAN INTEGRATION                |
+------------------------------------------------------------------+

     SD-ACCESS FABRIC                      SD-WAN OVERLAY
     (Campus/Branch)                       (WAN Transport)
          |                                      |
          v                                      v
+-------------------+                  +-------------------+
|   Fabric Border   |                  |   SD-WAN Edge     |
|   (C9500)         |<---------------->|   (vEdge/cEdge)   |
+-------------------+   L3 Handoff     +-------------------+
          |            VLAN 3001-3010          |
          |                                     |
+-------------------+                  +-------------------+
|   LISP/VXLAN      |                  |   IPsec/DTLS      |
|   (Overlay)       |                  |   (Transport)     |
+-------------------+                  +-------------------+
          |                                     |
+-------------------+                  +-------------------+
|   IS-IS           |                  |   OMP/BGP         |
|   (Underlay)      |                  |   (Control)       |
+-------------------+                  +-------------------+

INTEGRATION POINTS:
1. Border Node <-> SD-WAN Edge (L3 VRF handoff)
2. Policy: SGT propagation via VRF-aware routing
3. Control: vManage-DNAC API integration
4. Visibility: Unified assurance view
```

### 7.5.2 Transport Design (High-Level)

| Transport | Purpose | Sites | SLA |
|-----------|---------|-------|-----|
| MPLS | Primary WAN (business-critical) | All hub sites | 99.99% |
| Internet | Secondary/backup (general traffic) | All sites | 99.9% |
| 5G/LTE | Tertiary/emergency (failover) | Key branches | 99.5% |

### 7.5.3 Border-to-SD-WAN Handoff

```cisco
! Border Node - SD-WAN Handoff Configuration
! This is the L3 VRF handoff from Fabric Border to SD-WAN Edge

! VRF Definition for SD-WAN handoff
vrf definition SDWAN-TRANSIT
 rd 65001:3001
 address-family ipv4
  route-target export 65001:3001
  route-target import 65001:3001
 exit-address-family

! Handoff Interface to SD-WAN Edge
interface TenGigabitEthernet1/0/48
 description TO-SDWAN-EDGE-01
 no switchport

interface TenGigabitEthernet1/0/48.3001
 description SDWAN-HANDOFF-VN_CORPORATE
 encapsulation dot1Q 3001
 vrf forwarding VN_CORPORATE
 ip address 10.240.1.2 255.255.255.252
 
interface TenGigabitEthernet1/0/48.3002
 description SDWAN-HANDOFF-VN_GUEST
 encapsulation dot1Q 3002
 vrf forwarding VN_GUEST
 ip address 10.240.1.6 255.255.255.252

interface TenGigabitEthernet1/0/48.3003
 description SDWAN-HANDOFF-VN_IOT
 encapsulation dot1Q 3003
 vrf forwarding VN_IOT
 ip address 10.240.1.10 255.255.255.252

! BGP Peering with SD-WAN Edge
router bgp 65001
 address-family ipv4 vrf VN_CORPORATE
  neighbor 10.240.1.1 remote-as 65100
  neighbor 10.240.1.1 description SDWAN-EDGE-01
  neighbor 10.240.1.1 activate
  redistribute lisp metric 100
 exit-address-family
```

### 7.5.4 Policy Propagation

```yaml
# SGT-to-VPN Mapping at SD-WAN Edge

SGT_VPN_Mapping:
  SGT-EMPLOYEES (10):
    VPN: 10
    SLA_Class: Business-Critical
    Policy: Direct-Internet-Access (DIA) disabled
    
  SGT-GUESTS (40):
    VPN: 40
    SLA_Class: Best-Effort
    Policy: DIA enabled (local breakout)
    
  SGT-IOT-SENSORS (50):
    VPN: 50
    SLA_Class: Low-Latency
    Policy: DIA disabled, cloud breakout only
    
  SGT-VOICE (20):
    VPN: 20
    SLA_Class: Real-Time
    Policy: MPLS preferred, low-latency path
```

### 7.5.5 Hub Site Transport Details

**Hub sites retain MPLS as primary with Internet for secondary/overflow traffic.**

| Hub Site | MPLS Circuit | Internet Circuit | 5G Backup | SD-WAN Edge |
|----------|--------------|------------------|-----------|-------------|
| Mumbai | 1 Gbps (Tata) | 500 Mbps (Airtel) | - | ISR 4451 ×2 |
| Chennai | 500 Mbps (Tata) | 500 Mbps (Jio) | - | ISR 4351 ×2 |
| London | 1 Gbps (BT) | 500 Mbps (Virgin) | - | ISR 4451 ×2 |
| Frankfurt | 500 Mbps (DT) | 500 Mbps (Vodafone) | - | ISR 4351 ×2 |
| New Jersey | 1 Gbps (AT&T) | 1 Gbps (Verizon) | - | ISR 4451 ×2 |
| Dallas | 500 Mbps (AT&T) | 500 Mbps (Spectrum) | - | ISR 4351 ×2 |

### 7.5.6 Branch Site Transport Details

**Branch sites migrate from MPLS to Internet-primary with 5G/LTE backup.**

| Branch Type | Sites | Primary Transport | Secondary Transport | SD-WAN Edge |
|-------------|-------|-------------------|---------------------|-------------|
| Large Branch | Bangalore, Delhi | Internet 200 Mbps | 5G 100 Mbps | ISR 4331 |
| Medium Branch | Noida + 10 EMEA | Internet 100 Mbps | LTE 50 Mbps | ISR 1100-4G |
| Small Branch | 15 US + 5 EMEA | Internet 50 Mbps | LTE 30 Mbps | ISR 1100-4GLTENA |
| Remote/Temp | As needed | 5G 50 Mbps | - | IR 1101 |

**Branch MPLS Circuit Decommissioning Schedule**

| Phase | Sites | MPLS Status | Internet Status | 5G Status |
|-------|-------|-------------|-----------------|-----------|
| Phase 2 (Pilot) | Bangalore | Active | Add 200 Mbps | Add 5G |
| Phase 3 (Hubs) | - | Active (all hubs) | Add circuits | - |
| Phase 4 (Branches) | All branches | Decommission | Primary | Active |
| Phase 5 (Optimize) | All | Hub-only MPLS | All sites | All branches |

**Expected WAN Cost Savings (Post-Migration)**

| Current Cost | Target Cost | Monthly Savings | Annual Savings |
|--------------|-------------|-----------------|----------------|
| $X,XXX/mo | $X,XXX/mo | $X,XXX/mo | $X,XXX/yr |

*Savings from replacing expensive MPLS circuits at branches with Internet + 5G*

### 7.5.7 SD-WAN Integration Scope

| Aspect | Covered in This Document | Separate SD-WAN Project |
|--------|--------------------------|-------------------------|
| Border-to-Edge handoff | Yes (L3 VRF) | Full design |
| SGT propagation | Yes (high-level) | Detailed policy |
| Transport selection | Yes (overview) | Full SLA design |
| vManage-DNAC API | Yes (reference) | Integration scripts |
| Application policy | No | Complete design |
| Security policy | No | Complete design |
| Cloud onramp | No | Complete design |

---
