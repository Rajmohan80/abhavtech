# 4.7 Direct Internet Access (DIA)

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.7 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

Direct Internet Access (DIA) enables local internet breakout at branch sites, reducing latency for cloud and SaaS applications while optimizing WAN bandwidth. This section defines Abhavtech's DIA strategy including local breakout configurations, cloud SIG integration, and split-tunneling policies.

### 1.1 DIA Architecture Overview

```
+------------------------------------------------------------------+
|                    DIA ARCHITECTURE                               |
+------------------------------------------------------------------+
|                                                                   |
|  Traditional (Backhauled)         DIA (Local Breakout)            |
|  +-------------------+           +-------------------+            |
|  | Branch            |           | Branch            |            |
|  |   |               |           |   |               |            |
|  |   v               |           |   +---> Internet  |            |
|  |  WAN -----------> Hub -----> Internet             |            |
|  |                   |           |   |               |            |
|  |  Latency: High    |           |   +---> DC (via WAN)           |
|  |  BW: Inefficient  |           |   Latency: Low    |            |
|  +-------------------+           +-------------------+            |
|                                                                   |
|  Benefits:                                                        |
|  - 40-60% latency reduction for SaaS                              |
|  - 30% WAN bandwidth savings                                      |
|  - Improved user experience                                       |
+------------------------------------------------------------------+
```

---

## 2. DIA Deployment Models

### 2.1 DIA Options Matrix

| Model | Description | Security | Use Case |
|-------|-------------|----------|----------|
| Direct DIA | Local breakout, no security | NAT + ACL | Trusted SaaS only |
| DIA + UTD | Local breakout with IPS/IDS | On-box security | Branch with security |
| DIA + SIG | Local breakout via Umbrella | Cloud security | Full security stack |
| DIA + CASB | Local breakout with CASB | App-level security | Shadow IT control |

### 2.2 Abhavtech DIA Strategy

| Site Type | DIA Model | Security Stack | Applications |
|-----------|-----------|----------------|--------------|
| Hub Sites | DIA + SIG | Umbrella SIG + UTD | All internet |
| Large Branches | DIA + UTD | On-box IPS/IDS | Trusted SaaS |
| Small Branches | DIA + SIG | Umbrella SIG | All internet |
| Remote Workers | DIA + SIG | Umbrella SIG | All internet |

---

## 3. DIA Configuration

### 3.1 Basic DIA Setup

```
! VPN 0 (Transport) - Internet interface
interface GigabitEthernet0/0/0
 description WAN-Internet-DIA
 ip address dhcp
 ip nat outside
 tunnel-interface
  encapsulation ipsec
  color biz-internet
  nat-refresh-interval 5
  allow-service all
  allow-service dhcp
  allow-service dns
  allow-service icmp
 !
!
! Enable NAT for DIA
ip nat inside source list NAT-ACL interface GigabitEthernet0/0/0 overload
!
ip access-list extended NAT-ACL
 permit ip 172.16.0.0 0.3.255.255 any
 permit ip 172.17.0.0 0.0.255.255 any
```

### 3.2 Service VPN DIA Configuration

```
! VPN 10 (Employee) - Enable DIA
vpn 10
 name Employee
 ecmp-hash-key layer4
 ip route 0.0.0.0/0 vpn 0  ! Default route to transport VPN
 !
 interface GigabitEthernet0/0/2
  description LAN-Employee
  ip address 172.16.1.1/24
  ip nat inside
  no shutdown
 !
```

### 3.3 DIA Route Configuration

```
! Static route for DIA traffic
ip route 0.0.0.0 0.0.0.0 vpn 0

! Or use data policy for selective DIA
policy
 data-policy _DIA-SELECTIVE_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list INTERNET-DESTINATIONS
    action accept
     set
      local-tloc-list
       color biz-internet
       encap ipsec
      !
     nat use-vpn 0
    !
   !
  !
```

---

## 4. Split Tunneling

### 4.1 Split Tunnel Architecture

```
+------------------------------------------------------------------+
|                    SPLIT TUNNEL DESIGN                            |
+------------------------------------------------------------------+
|                                                                   |
|  Branch Site Traffic Split:                                       |
|  +---------------------------------------------------------+     |
|  |  Traffic Type          | Path              | Security   |     |
|  |------------------------+-------------------+------------|     |
|  |  SaaS (O365, WebEx)    | Local DIA         | SIG        |     |
|  |  Internal Apps         | SD-WAN to DC      | Encrypted  |     |
|  |  Guest Internet        | Local DIA         | Isolated   |     |
|  |  PCI Traffic           | SD-WAN (MPLS)     | FW Chain   |     |
|  +---------------------------------------------------------+     |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.2 Split Tunnel Data Policy

```
policy
 data-policy _ABHAVTECH-SPLIT-TUNNEL_
  vpn-list VPN-10-EMPLOYEE
   ! SaaS via DIA
   sequence 10
    match
     app-list SAAS-DIA-APPS
    action accept
     set
      local-tloc-list
       color biz-internet
       encap ipsec
      !
     nat use-vpn 0
    !
   !
   ! Internal apps via SD-WAN
   sequence 20
    match
     destination-data-prefix-list INTERNAL-PREFIXES
    action accept
     set
      tloc-list
       tloc 10.100.1.1 color mpls encap ipsec
      !
     !
    !
   !
   ! All other via SD-WAN (hub)
   default-action accept
  !
```

### 4.3 Application Lists for Split Tunnel

```
policy
 lists
  app-list SAAS-DIA-APPS
   app ms-office-365
   app ms-teams
   app webex
   app salesforce
   app google-workspace
   app box
   app dropbox
   app servicenow
  !
  data-prefix-list INTERNAL-PREFIXES
   ip-prefix 10.0.0.0/8
   ip-prefix 172.16.0.0/12
  !
 !
```

---

## 5. Cloud OnRamp for SaaS

### 5.1 Cloud OnRamp Architecture

```
+------------------------------------------------------------------+
|                CLOUD ONRAMP FOR SAAS                              |
+------------------------------------------------------------------+
|                                                                   |
|  SD-WAN Manager                                                   |
|  +----------------------------------------------------------+    |
|  | Cloud OnRamp Configuration:                               |    |
|  | - SaaS App: Office 365                                    |    |
|  | - Probe: Enabled                                          |    |
|  | - Best Path: Auto-select                                  |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|  WAN Edge                  v                                      |
|  +----------------------------------------------------------+    |
|  | Probing Engine:                                           |    |
|  | - DIA Path: Latency 25ms, Loss 0.1%                       |    |
|  | - Gateway Path: Latency 85ms, Loss 0.2%                   |    |
|  | Decision: Use DIA (better performance)                    |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 Cloud OnRamp Configuration

```
! Enable Cloud OnRamp for SaaS in SD-WAN Manager
! Administration > Settings > Cloud OnRamp for SaaS

! Site configuration for Cloud OnRamp
cloudOnRamp
 saas
  site-id 3  ! Bangalore branch
  application office365
   vpn 10
   gateway-list
    gateway 10.100.1.1  ! Mumbai hub
   !
   local-gateway true  ! Enable DIA option
  !
 !
```

### 5.3 Supported SaaS Applications

| Application | Protocol | Ports | Optimization |
|-------------|----------|-------|--------------|
| Office 365 | HTTPS | 443, 80 | Path selection |
| WebEx | HTTPS/SRTP | 443, 5004 | QoS + Path |
| Salesforce | HTTPS | 443 | Path selection |
| Box | HTTPS | 443 | Path selection |
| Dropbox | HTTPS | 443 | Path selection |
| Amazon AWS | HTTPS | 443 | Path selection |
| Microsoft Azure | HTTPS | 443 | Path selection |

---

## 6. Umbrella SIG Integration

### 6.1 SIG Architecture

```
+------------------------------------------------------------------+
|              UMBRELLA SIG INTEGRATION                             |
+------------------------------------------------------------------+
|                                                                   |
|  Branch Site                      Umbrella Cloud                  |
|  +---------------+               +-------------------+            |
|  | WAN Edge      |   IPsec      | SIG (Full Stack)  |            |
|  |               |------------->| - DNS Security    |            |
|  | DIA Traffic   |   Tunnel     | - Web Filtering   |            |
|  |               |              | - Firewall        |            |
|  +---------------+              | - CASB            |            |
|        |                        | - DLP             |            |
|        |                        +-------------------+            |
|        v                               |                          |
|  Local Internet                        v                          |
|  (Fallback only)               Internet (Secured)                 |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 SIG Tunnel Configuration

```
! Umbrella SIG configuration
secure-internet-gateway
 umbrella
  token <UMBRELLA-API-TOKEN>
  org-id <UMBRELLA-ORG-ID>
  !
  tunnel dc-primary
   data-center primary
   max-mtu 1400
  !
  tunnel dc-secondary
   data-center secondary
   max-mtu 1400
  !
 !
!
! VPN configuration for SIG
vpn 10
 secure-internet-gateway
  umbrella
   tunnel dc-primary
   tunnel dc-secondary
  !
 !
```

### 6.3 SIG Data Policy

```
policy
 data-policy _SIG-POLICY_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list INTERNET
    action accept
     set
      sig
       umbrella
        tunnel dc-primary
        tunnel dc-secondary
       !
      !
     !
    !
   !
  !
```

---

## 7. Security for DIA

### 7.1 On-Box Security (UTD)

```
! UTD configuration for DIA security
utd engine standard
 threat-inspection profile ABHAVTECH-IPS
  threat protection
  policy security
 !
 web-filter url profile ABHAVTECH-URL
  categories block
   adult-and-pornography
   gambling
   malware-sites
   phishing-and-other-frauds
  !
 !
!
! Apply to DIA interface
interface GigabitEthernet0/0/0
 utd enable
```

### 7.2 DNS Security

```
! Umbrella DNS for DIA
ip name-server 208.67.222.222
ip name-server 208.67.220.220
!
! DNS redirect policy
policy
 data-policy _DNS-REDIRECT_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-port 53
    action accept
     redirect-dns umbrella
    !
   !
  !
```

---

## 8. Per-VPN DIA Policies

### 8.1 VPN 10 - Employee (Selective DIA)

```
policy
 data-policy _VPN10-DIA_
  vpn-list VPN-10-EMPLOYEE
   ! SaaS apps - DIA with SIG
   sequence 10
    match
     app-list SAAS-APPS
    action accept
     set
      sig umbrella
     nat use-vpn 0
    !
   !
   ! Social media - DIA with UTD
   sequence 20
    match
     app-list SOCIAL-APPS
    action accept
     set
      local-tloc-list color biz-internet
     nat use-vpn 0
    !
   !
   ! Internal - via SD-WAN
   sequence 30
    match
     destination-data-prefix-list INTERNAL
    action accept
    !
   !
   default-action accept
  !
```

### 8.2 VPN 20 - Guest (Full DIA)

```
policy
 data-policy _VPN20-DIA_
  vpn-list VPN-20-GUEST
   ! All guest traffic - DIA with SIG
   sequence 10
    match
     destination-data-prefix-list INTERNET
    action accept
     set
      sig umbrella
     nat use-vpn 0
    !
   !
   ! Block internal access
   sequence 20
    match
     destination-data-prefix-list RFC1918
    action drop
    !
   !
  !
```

### 8.3 VPN 100 - PCI (No DIA)

```
policy
 data-policy _VPN100-NO-DIA_
  vpn-list VPN-100-PCI
   ! All PCI traffic via hub firewall
   sequence 10
    match
     source-ip 0.0.0.0/0
    action accept
     set
      service FW-PCI vpn 100
      tloc-list
       tloc 10.100.1.1 color mpls encap ipsec
      !
     !
    !
   ! No DIA allowed
  !
```

---

## 9. DIA Failover

### 9.1 DIA with Backup Path

```
! Primary: DIA, Backup: Hub gateway
policy
 data-policy _DIA-FAILOVER_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list SAAS-APPS
    action accept
     set
      local-tloc-list
       color biz-internet  ! DIA
       color lte           ! Backup DIA
      !
     backup-sla-class INTERACTIVE
      tloc-list
       tloc 10.100.1.1 color mpls encap ipsec  ! Hub fallback
      !
     nat use-vpn 0
    !
   !
  !
```

### 9.2 SIG Tunnel Redundancy

```
! Multiple SIG data centers
secure-internet-gateway
 umbrella
  tunnel dc-primary
   data-center us-west-1
   max-mtu 1400
  !
  tunnel dc-secondary
   data-center us-east-1
   max-mtu 1400
  !
  tunnel dc-tertiary
   data-center eu-west-1
   max-mtu 1400
  !
 !
```

---

## 10. Monitoring and Verification

### 10.1 Verification Commands

```
! Check DIA status
show ip nat translations
show ip nat statistics

! Check SIG tunnel status
show sdwan secure-internet-gateway tunnels

! Check Cloud OnRamp
show sdwan cloudOnRamp saas

! Check traffic distribution
show sdwan app-route statistics
show sdwan policy data-policy counters
```

### 10.2 DIA Metrics

| Metric | Threshold | Action |
|--------|-----------|--------|
| NAT Session Count | >80% capacity | Scale NAT pool |
| SIG Tunnel Status | Down | Failover to backup |
| DIA Latency | >100ms | Investigate circuit |
| SaaS QoE Score | <7/10 | Review path selection |

---

## 11. Summary

| Element | Abhavtech Configuration |
|---------|------------------------|
| DIA Model | SIG for hubs, UTD for large branches |
| Split Tunnel | SaaS via DIA, internal via SD-WAN |
| Cloud OnRamp | Office 365, WebEx, Salesforce |
| SIG Provider | Cisco Umbrella |
| Guest DIA | Full DIA with SIG security |
| PCI DIA | Disabled (hub firewall only) |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Next Review: March 2026*
