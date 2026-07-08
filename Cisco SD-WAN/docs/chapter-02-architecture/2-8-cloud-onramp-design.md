# 2.8 Cloud OnRamp Design

## Document Information
| Field | Value |
|-------|-------|
| Document Title | Cloud OnRamp Design |
| Section Number | 2.8 |
| Version | 1.0 |
| Last Updated | December 30, 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 2.8.1 Cloud OnRamp Overview

### Cloud Connectivity Strategy

Abhavtech.com's cloud strategy integrates SD-WAN with major cloud providers and SaaS applications to deliver optimized user experience while maintaining security and compliance. Cloud OnRamp enables intelligent path selection based on real-time performance metrics.

### Cloud OnRamp Components

| Component | Purpose | Deployment |
|-----------|---------|------------|
| Cloud OnRamp for SaaS | SaaS application optimization | All WAN Edges |
| Cloud OnRamp for IaaS | Cloud provider connectivity | Mumbai DC, Chennai DR |
| Cloud OnRamp for Colocation | Data center extension | Future consideration |
| Cloud OnRamp for Multicloud | Multi-cloud networking | AWS, Azure integration |

### Cloud Application Inventory

| Application | Provider | Type | Priority | Monthly Users |
|-------------|----------|------|----------|---------------|
| Microsoft 365 | Microsoft | SaaS | Critical | 2,500 |
| Salesforce | Salesforce | SaaS | High | 800 |
| ServiceNow | ServiceNow | SaaS | High | 500 |
| Workday | Workday | SaaS | High | 2,500 |
| AWS Workloads | Amazon | IaaS | Critical | N/A |
| Azure Workloads | Microsoft | IaaS | High | N/A |
| SAP S/4HANA Cloud | SAP | SaaS/PaaS | Critical | 1,200 |
| Zoom | Zoom | SaaS | High | 2,000 |
| Box | Box | SaaS | Medium | 1,500 |
| Slack | Salesforce | SaaS | Medium | 2,000 |

---

## 2.8.2 Cloud OnRamp for SaaS

### Architecture Overview

```
                    CLOUD ONRAMP FOR SaaS ARCHITECTURE
+==============================================================================+
|                                                                              |
|   USER ACCESS                                                                |
|   +---------+     +---------+     +---------+                               |
|   | Branch  |     | Campus  |     | Remote  |                               |
|   | Users   |     | Users   |     | Users   |                               |
|   +----+----+     +----+----+     +----+----+                               |
|        |              |              |                                       |
|        v              v              v                                       |
|   +--------------------------------------------------+                      |
|   |              WAN EDGE ROUTERS                    |                      |
|   |     (Cloud OnRamp for SaaS Enabled)              |                      |
|   +----+-------------------+-------------------+-----+                      |
|        |                   |                   |                             |
|        |   INTELLIGENT     |                   |                             |
|        |   PATH SELECTION  |                   |                             |
|        v                   v                   v                             |
|   +---------+         +---------+         +---------+                       |
|   | DIA     |         | Regional|         | Gateway |                       |
|   | (Local) |         | Gateway |         | (DC)    |                       |
|   +---------+         +---------+         +---------+                       |
|        |                   |                   |                             |
|        +-------------------+-------------------+                             |
|                            |                                                 |
|                            v                                                 |
|   +--------------------------------------------------+                      |
|   |                SAAS APPLICATIONS                 |                      |
|   |                                                  |                      |
|   |   +--------+  +--------+  +--------+  +--------+ |                      |
|   |   |  M365  |  |  SFDC  |  |  Zoom  |  | Others | |                      |
|   |   +--------+  +--------+  +--------+  +--------+ |                      |
|   +--------------------------------------------------+                      |
|                                                                              |
+==============================================================================+
```

### SaaS Application Configuration

| Application | App ID | Server Clusters | Probe Frequency | Loss Threshold | Latency Threshold |
|-------------|--------|-----------------|-----------------|----------------|-------------------|
| Microsoft 365 | office365 | Multiple | 60 seconds | 5% | 300ms |
| Salesforce | salesforce | NA/EMEA | 60 seconds | 3% | 250ms |
| Workday | workday | NA | 60 seconds | 3% | 250ms |
| ServiceNow | servicenow | Multiple | 60 seconds | 3% | 250ms |
| Zoom | zoom | Global | 30 seconds | 1% | 150ms |
| SAP | sap-cloud | EU/US | 60 seconds | 2% | 200ms |
| Box | box | NA | 60 seconds | 5% | 300ms |
| Slack | slack | Global | 60 seconds | 3% | 200ms |

### vManage SaaS Policy Configuration

```
!======================================================================
! CLOUD ONRAMP FOR SaaS - vMANAGE CONFIGURATION
!======================================================================
!
! Enable Cloud OnRamp for SaaS
cloud-onramp saas
 enable
!
! Microsoft 365 Configuration
application office365
 enable
 vpn 1
 interface-pairs
  interface GigabitEthernet0/0/0 direct-internet-access
  interface GigabitEthernet0/0/1 gateway
 cloud-probe-frequency 60
 loss-tolerance 5
 latency-tolerance 300
 app-aware-routing-policy
  sla-class Business-Critical
!
! Salesforce Configuration
application salesforce
 enable
 vpn 1
 interface-pairs
  interface GigabitEthernet0/0/0 direct-internet-access
  interface GigabitEthernet0/0/1 gateway
 cloud-probe-frequency 60
 loss-tolerance 3
 latency-tolerance 250
!
! Zoom (Real-Time)
application zoom
 enable
 vpn 1
 interface-pairs
  interface GigabitEthernet0/0/0 direct-internet-access
  interface GigabitEthernet0/0/1 gateway
 cloud-probe-frequency 30
 loss-tolerance 1
 latency-tolerance 150
 app-aware-routing-policy
  sla-class Real-Time
```

### Site-Specific SaaS Optimization

| Site | DIA Available | Gateway Available | Preferred Exit | SaaS Applications |
|------|---------------|-------------------|----------------|-------------------|
| Mumbai DC | Yes | Yes (Local) | DIA Primary | All |
| Chennai DR | Yes | Yes (Local) | DIA Primary | All |
| London | Yes | Yes (Regional) | DIA Primary | M365, SFDC, Zoom |
| Frankfurt | Yes | Yes (Regional) | DIA Primary | M365, SAP, Zoom |
| New Jersey | Yes | Yes (Regional) | DIA Primary | M365, SFDC, Workday |
| Dallas | Yes | Yes (Regional) | DIA Primary | M365, SFDC, Zoom |
| Bangalore | Yes | Gateway (Mumbai) | DIA Primary | M365, Zoom |
| Delhi | Yes | Gateway (Mumbai) | DIA Primary | M365, Zoom |
| Noida | Yes | Gateway (Mumbai) | DIA Primary | M365, Zoom |

---

## 2.8.3 Cloud OnRamp for IaaS

### Multi-Cloud Architecture

```
                    CLOUD ONRAMP FOR IaaS ARCHITECTURE
+==============================================================================+
|                                                                              |
|                        ABHAVTECH SD-WAN FABRIC                              |
|   +------------------------------------------------------------------+      |
|   |                                                                  |      |
|   |   MUMBAI DC              CHENNAI DR            BRANCHES          |      |
|   |   +--------+             +--------+            +--------+        |      |
|   |   |WAN Edge|             |WAN Edge|            |WAN Edge|        |      |
|   |   |Primary |             |Backup  |            |Sites   |        |      |
|   |   +---+----+             +---+----+            +--------+        |      |
|   |       |                      |                                   |      |
|   +-------|----------------------|-----------------------------------+      |
|           |                      |                                          |
|           v                      v                                          |
|   +-------+----------------------+-------+                                  |
|   |       CLOUD GATEWAY ROUTERS          |                                  |
|   |       (C8000V in Cloud VPC/VNet)     |                                  |
|   +-------+----------------------+-------+                                  |
|           |                      |                                          |
|     +-----+-----+          +-----+-----+                                    |
|     |           |          |           |                                    |
|     v           v          v           v                                    |
|   +---+       +---+      +---+       +---+                                  |
|   |AWS|       |AWS|      |Azure      |Azure                                |
|   |ap-|       |eu-|      |Central    |West                                 |
|   |south|     |west|     |India      |Europe                               |
|   +---+       +---+      +---+       +---+                                  |
|                                                                              |
|   CLOUD CONNECTIVITY:                                                       |
|   - AWS: Transit Gateway with SD-WAN integration                           |
|   - Azure: Virtual WAN with SD-WAN NVA                                     |
|   - IPsec tunnels from on-prem to cloud gateways                          |
|   - Automated provisioning via vManage                                     |
|                                                                              |
+==============================================================================+
```

### AWS Integration Design

| Component | Configuration | Region | Purpose |
|-----------|---------------|--------|---------|
| Transit Gateway | tgw-abhavtech-prod | ap-south-1 | Central routing hub |
| Transit Gateway | tgw-abhavtech-dr | eu-west-1 | DR connectivity |
| C8000V Instance | c8kv-sdwan-mum | ap-south-1 | SD-WAN cloud gateway |
| C8000V Instance | c8kv-sdwan-fra | eu-west-1 | SD-WAN cloud gateway |
| VPC Attachments | 5 VPCs | ap-south-1 | Workload connectivity |
| VPN Attachments | 2 tunnels | ap-south-1 | On-prem connectivity |

### AWS Transit Gateway Configuration

```
!======================================================================
! AWS TRANSIT GATEWAY - CLOUD ONRAMP INTEGRATION
!======================================================================
!
! Transit Gateway Route Table (Production)
! Routes to on-premises networks via SD-WAN attachment
!
! Route Table: rtb-prod-sdwan
! 10.0.0.0/8 -> SD-WAN Attachment (att-sdwan-mum)
! 172.16.0.0/12 -> SD-WAN Attachment (att-sdwan-mum)
! 192.168.0.0/16 -> SD-WAN Attachment (att-sdwan-mum)
!
! VPC CIDR Blocks:
! vpc-prod-app: 10.200.0.0/16
! vpc-prod-data: 10.201.0.0/16
! vpc-dev-app: 10.210.0.0/16
! vpc-shared: 10.220.0.0/16
! vpc-dmz: 10.230.0.0/16
```

### C8000V Cloud Gateway Configuration

```
!======================================================================
! C8000V CLOUD GATEWAY - AWS ap-south-1
!======================================================================
!
! System Configuration
system
 system-ip             10.1.200.100
 site-id               900
 organization-name     ABHAVTECH-COM
 vbond vbond.abhavtech.com
!
! Cloud Gateway Transport
interface GigabitEthernet1
 description AWS-TGW-ATTACHMENT
 ip address dhcp
 no shutdown
 sdwan
  tunnel-interface
   encapsulation ipsec
   color private1
   max-control-connections 2
   allow-service all
!
! Service VPN for Cloud Workloads
sdwan
 service vrf 10
  address-family ipv4
   route 10.200.0.0/16 interface GigabitEthernet2
   route 10.201.0.0/16 interface GigabitEthernet2
!
interface GigabitEthernet2
 description AWS-VPC-INTERFACE
 ip address 10.200.255.10 255.255.255.0
 no shutdown
```

### Azure Integration Design

| Component | Configuration | Region | Purpose |
|-----------|---------------|--------|---------|
| Virtual WAN | vwan-abhavtech | Central India | SD-WAN hub |
| Virtual Hub | hub-centralindia | Central India | Regional hub |
| NVA (C8000V) | c8kv-azure-cin | Central India | SD-WAN gateway |
| VNet Connections | 4 VNets | Central India | Workload connectivity |
| ExpressRoute | er-abhavtech | Central India | Backup connectivity |

---

## 2.8.4 Direct Internet Access (DIA)

### DIA Strategy

```
                         DIA ARCHITECTURE
+==============================================================================+
|                                                                              |
|   SITE CLASSIFICATION FOR DIA                                               |
|                                                                              |
|   HUB SITES (Full DIA)                  BRANCH SITES (Selective DIA)        |
|   +------------------------+            +------------------------+           |
|   | Mumbai DC              |            | Bangalore              |           |
|   | Chennai DR             |            | Delhi                  |           |
|   | London                 |            | Noida                  |           |
|   | Frankfurt              |            |                        |           |
|   | New Jersey             |            | DIA for:               |           |
|   | Dallas                 |            | - SaaS (M365, Zoom)    |           |
|   |                        |            | - Guest Internet       |           |
|   | DIA for ALL traffic:   |            |                        |           |
|   | - SaaS applications    |            | Via Gateway for:       |           |
|   | - Guest Internet       |            | - Business apps        |           |
|   | - Cloud IaaS           |            | - Sensitive data       |           |
|   | - General browsing     |            |                        |           |
|   +------------------------+            +------------------------+           |
|                                                                              |
+==============================================================================+
```

### DIA Security Stack

| Security Layer | Technology | Deployment |
|----------------|------------|------------|
| URL Filtering | Cisco Umbrella DNS | All sites |
| Web Security | Umbrella SIG | Hub sites |
| Threat Prevention | UTD (Snort 3.0) | WAN Edge |
| SSL Inspection | UTD SSL Proxy | Selective |
| Malware Protection | AMP for Networks | WAN Edge |
| CASB | Umbrella CASB | SaaS apps |

### NAT Policy for DIA

```
!======================================================================
! DIA NAT CONFIGURATION
!======================================================================
!
! NAT for Direct Internet Access
ip nat inside source list DIA-ACL interface GigabitEthernet0/0/0 overload
!
! DIA Access List - Permitted for Local Breakout
ip access-list extended DIA-ACL
 10 permit ip 10.10.0.0 0.0.255.255 any
 20 permit ip 10.20.0.0 0.0.255.255 any
!
! Policy-Based Routing for SaaS
route-map SAAS-DIA permit 10
 match ip address SAAS-APPS
 set interface GigabitEthernet0/0/0
!
ip access-list extended SAAS-APPS
 10 permit ip any host 13.107.6.152    ! M365
 20 permit ip any host 52.96.0.0 0.0.255.255  ! M365
 30 permit ip any host 40.126.0.0 0.0.255.255 ! M365
```

---

## 2.8.5 Cloud Security Integration

### Cisco Umbrella Integration

```
                    UMBRELLA SIG INTEGRATION
+==============================================================================+
|                                                                              |
|   BRANCH USER                                                               |
|       |                                                                      |
|       v                                                                      |
|   +--------+     +----------+     +----------+     +----------+             |
|   | WAN    |---->| Umbrella |---->| Umbrella |---->| Internet |             |
|   | Edge   |     | DNS      |     | SIG      |     | / SaaS   |             |
|   +--------+     +----------+     +----------+     +----------+             |
|       |                                                                      |
|       |          DNS Query        HTTP/HTTPS       Allowed                  |
|       |          Redirect         Inspection       Traffic                   |
|       |                                                                      |
|   +--------+                                                                |
|   | Policy |     SECURITY FUNCTIONS:                                        |
|   | Actions|     - DNS-layer security                                       |
|   +--------+     - URL filtering                                            |
|                  - SSL decryption                                           |
|                  - Threat intelligence                                      |
|                  - CASB                                                     |
|                  - DLP                                                      |
|                                                                              |
+==============================================================================+
```

### Umbrella Configuration

```
!======================================================================
! UMBRELLA DNS INTEGRATION ON WAN EDGE
!======================================================================
!
! Umbrella DNS Server Configuration
ip name-server 208.67.222.222
ip name-server 208.67.220.220
!
! DNS Redirect for Branch Sites
parameter-map type umbrella global
 token ABHAVTECH-UMBRELLA-TOKEN-12345
 local-domain abhavtech.com
 dnscrypt
 udp-timeout 5
 resolver ipv4 208.67.222.222
 resolver ipv4 208.67.220.220
!
! Apply to Interface
interface GigabitEthernet0/0/1
 umbrella out
!
! Umbrella SIG Tunnel
crypto ikev2 profile UMBRELLA-SIG
 match identity remote fqdn domain umbrella.com
 authentication remote pre-share key umbrella-psk
 authentication local pre-share key local-psk
!
interface Tunnel100
 description UMBRELLA-SIG-TUNNEL
 ip unnumbered Loopback0
 tunnel source GigabitEthernet0/0/0
 tunnel mode ipsec ipv4
 tunnel destination sig.umbrella.com
 tunnel protection ipsec profile UMBRELLA-SIG
```

---

## 2.8.6 Cloud OnRamp Monitoring

### Performance Metrics

| Metric | SaaS Threshold | IaaS Threshold | Alert Condition |
|--------|----------------|----------------|-----------------|
| Latency | <300ms | <100ms | >threshold for 5 min |
| Loss | <3% | <1% | >threshold for 5 min |
| Jitter | <30ms | <10ms | >threshold for 5 min |
| Availability | >99.5% | >99.9% | <threshold |
| vQoE Score | >7/10 | N/A | <7 for 15 min |

### Verification Commands

```
!======================================================================
! CLOUD ONRAMP VERIFICATION
!======================================================================
!
! SaaS Application Status
show sdwan cloudexpress applications
!
! Expected Output:
! Application    Interface         Gateway     VPN   Loss   Latency  vQoE
! office365      GigabitEthernet0/0/0  DIA        1     0.1%   45ms    9.2
! salesforce     GigabitEthernet0/0/0  DIA        1     0.2%   62ms    8.8
! zoom           GigabitEthernet0/0/0  DIA        1     0.0%   28ms    9.5
!
! Cloud Gateway Status
show sdwan cloud-gateway
!
! IaaS Connectivity
show sdwan ipsec inbound-connections
show sdwan ipsec outbound-connections
!
! DIA Statistics
show sdwan policy service-path
```

---

## 2.8.7 Cloud OnRamp Best Practices

### Design Recommendations

1. **Enable DIA at All Sites:** Optimize SaaS performance with local breakout
2. **Use Probing:** Regular probes to determine best path
3. **Configure Thresholds:** Set appropriate SLA thresholds per application
4. **Implement Security:** Always use Umbrella or equivalent for DIA
5. **Monitor vQoE:** Track user experience scores continuously
6. **Plan Capacity:** Size DIA circuits for cloud growth

### Operational Checklist

| Task | Frequency | Owner |
|------|-----------|-------|
| Review SaaS metrics | Daily | NOC |
| Verify cloud gateway health | Daily | NOC |
| Audit DIA security logs | Weekly | Security |
| Update SaaS application list | Monthly | Network |
| Review cloud costs | Monthly | Finance |
| Test failover to gateway | Quarterly | Network |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 30, 2025 | Network Architecture Team | Initial release |

---

*This document is part of the Abhavtech.com SD-WAN Documentation Suite*
*Confidential - Internal Use Only*
