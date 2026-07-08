# 4.8 Service Insertion

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.8 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

Service Insertion enables steering traffic through network services like firewalls, load balancers, and WAN optimizers within the SD-WAN fabric. This section defines Abhavtech's service insertion architecture for firewall chaining, load balancer integration, and service redundancy.

### 1.1 Service Insertion Architecture

```
+------------------------------------------------------------------+
|                  SERVICE INSERTION ARCHITECTURE                   |
+------------------------------------------------------------------+
|                                                                   |
|  Traffic Flow with Service Insertion:                             |
|                                                                   |
|  Branch Site           Hub Site (Mumbai)                          |
|  +---------+          +--------------------------------+          |
|  |         |          |                                |          |
|  | WAN Edge|--------->| WAN Edge --> Service --> LAN  |          |
|  | (Branch)|   IPsec  |            (Firewall)         |          |
|  |         |<---------|            <--                |          |
|  +---------+          +--------------------------------+          |
|                                                                   |
|  Service Types:                                                   |
|  - Firewall (NGFW) - Security inspection                          |
|  - Load Balancer - Application distribution                       |
|  - WAN Optimizer - Bandwidth optimization                         |
|  - IPS/IDS - Threat detection                                     |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. Service Types

### 2.1 Supported Service Types

| Service Type | Purpose | Integration Mode | HA Support |
|-------------|---------|------------------|------------|
| Firewall | Security inspection | L3 service chain | Active/Standby |
| NGFW | Deep packet inspection | L3 service chain | Active/Active |
| Load Balancer | Application distribution | L3 service chain | Active/Active |
| WAN Optimizer | Bandwidth optimization | L3 service chain | Active/Standby |
| IPS/IDS | Threat detection | Inline/TAP | Active/Standby |

### 2.2 Abhavtech Service Deployment

| Service | Vendor | Location | Capacity |
|---------|--------|----------|----------|
| NGFW | Palo Alto PA-5220 | Mumbai, Chennai Hubs | 10 Gbps |
| Load Balancer | F5 BIG-IP | Mumbai DC | 40 Gbps |
| WAN Optimizer | Riverbed | Mumbai, Chennai | 2 Gbps |

---

## 3. Firewall Service Chain

### 3.1 Firewall Service Definition

```
! WAN Edge configuration for firewall service
sdwan
 service firewall vrf 10
  ipv4 address 10.10.100.10
  tracking
  !
 !
!
! Interface to firewall
interface GigabitEthernet0/0/2
 description To-Palo-Alto-FW-Inside
 ip address 10.10.100.1 255.255.255.252
 service-insertion-type firewall
 no shutdown
!
interface GigabitEthernet0/0/3
 description From-Palo-Alto-FW-Outside
 ip address 10.10.100.5 255.255.255.252
 no shutdown
```

### 3.2 Firewall Topology

```
+------------------------------------------------------------------+
|                FIREWALL SERVICE CHAIN TOPOLOGY                    |
+------------------------------------------------------------------+
|                                                                   |
|  WAN Edge (Mumbai)                                                |
|  +------------------+         +------------------+                |
|  | GE0/0/0 (WAN)    |         | GE0/0/1 (LAN)    |                |
|  | MPLS/Internet    |         | To Campus        |                |
|  +--------+---------+         +--------+---------+                |
|           |                            |                          |
|           |   +------------------+     |                          |
|           |   |  Palo Alto FW    |     |                          |
|           +-->| GE1 --> GE2      |<----+                          |
|               | Inside   Outside |                                |
|               | 10.10.100.2      |                                |
|               +------------------+                                |
|                                                                   |
|  Traffic: WAN --> WAN Edge --> FW --> LAN                         |
|  Return:  LAN --> FW --> WAN Edge --> WAN                         |
+------------------------------------------------------------------+
```

### 3.3 Firewall Data Policy

```
policy
 data-policy _ABHAVTECH-FW-SERVICE-CHAIN_
  vpn-list VPN-10-EMPLOYEE
   ! Internet-bound traffic through firewall
   sequence 10
    match
     destination-data-prefix-list INTERNET
    action accept
     set
      service firewall vpn 10
      local-tloc-list
       color biz-internet
       encap ipsec
      !
     !
    !
   !
   ! PCI traffic through firewall
   sequence 20
    match
     destination-data-prefix-list PCI-PREFIXES
    action accept
     set
      service firewall vpn 10
      tloc-list
       tloc 10.100.1.1 color mpls encap ipsec
      !
     !
    !
   !
   default-action accept
  !
```

---

## 4. Firewall HA Configuration

### 4.1 Active/Standby Firewall HA

```
! Primary firewall service
sdwan
 service firewall vrf 10
  ipv4 address 10.10.100.10
  tracking
   endpoint-tracker FW-PRIMARY
  !
 !
!
! Secondary firewall service
sdwan
 service firewall vrf 10
  ipv4 address 10.10.100.20
  tracking
   endpoint-tracker FW-SECONDARY
  !
 !
!
! Endpoint tracking
endpoint-tracker FW-PRIMARY
 tracker-type interface
 endpoint-ip 10.10.100.10
 threshold 100
 multiplier 3
!
endpoint-tracker FW-SECONDARY
 tracker-type interface
 endpoint-ip 10.10.100.20
 threshold 100
 multiplier 3
```

### 4.2 Firewall HA Data Policy

```
policy
 data-policy _FW-HA-POLICY_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list INTERNET
    action accept
     set
      service firewall vpn 10
       primary
        address 10.10.100.10
       !
       secondary
        address 10.10.100.20
       !
      !
     !
    !
   !
  !
```

---

## 5. Load Balancer Integration

### 5.1 Load Balancer Service Definition

```
! Load balancer service configuration
sdwan
 service lb vrf 10
  ipv4 address 10.10.200.10
  tracking
  !
 !
!
! Interface to load balancer
interface GigabitEthernet0/0/4
 description To-F5-LB
 ip address 10.10.200.1 255.255.255.252
 service-insertion-type lb
 no shutdown
```

### 5.2 Load Balancer Data Policy

```
policy
 data-policy _LB-SERVICE-CHAIN_
  vpn-list VPN-10-EMPLOYEE
   ! Web application traffic through LB
   sequence 10
    match
     destination-data-prefix-list WEB-SERVER-VIPS
     destination-port 80 443
    action accept
     set
      service lb vpn 10
      tloc-list
       tloc 10.100.1.1 color mpls encap ipsec
      !
     !
    !
   !
   default-action accept
  !
```

---

## 6. Service Chain Combinations

### 6.1 Firewall + Load Balancer Chain

```
+------------------------------------------------------------------+
|              MULTI-SERVICE CHAIN TOPOLOGY                         |
+------------------------------------------------------------------+
|                                                                   |
|  Traffic Flow:                                                    |
|  Branch --> WAN Edge --> FW --> LB --> Web Servers                |
|                                                                   |
|  +----------+    +----------+    +----------+    +----------+    |
|  | WAN Edge |--->| Firewall |--->| Load Bal |--->| Servers  |    |
|  +----------+    +----------+    +----------+    +----------+    |
|                                                                   |
+------------------------------------------------------------------+
```

```
policy
 data-policy _MULTI-SERVICE-CHAIN_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list WEB-APP-VIPS
     destination-port 443
    action accept
     set
      service firewall vpn 10
       next-service lb vpn 10
      !
      tloc-list
       tloc 10.100.1.1 color mpls encap ipsec
      !
     !
    !
   !
  !
```

### 6.2 Service Chain with Fallback

```
! Service chain with bypass when service unavailable
policy
 data-policy _SERVICE-CHAIN-FALLBACK_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list INTERNET
    action accept
     set
      service firewall vpn 10 fall-back
      ! Traffic bypasses firewall if FW is down
     !
    !
   !
  !
```

---

## 7. Service Tracking

### 7.1 Endpoint Tracker Configuration

```
! Track firewall health via ping
endpoint-tracker FW-HEALTH
 tracker-type interface
 endpoint-ip 10.10.100.10
 interval 20
 threshold 100
 multiplier 3
!
! Track via HTTP
endpoint-tracker FW-HTTP-CHECK
 tracker-type http
 endpoint-url https://10.10.100.10/health
 interval 60
!
! Apply tracker to service
sdwan
 service firewall vrf 10
  tracking
   endpoint-tracker FW-HEALTH
   endpoint-tracker FW-HTTP-CHECK
  !
 !
```

### 7.2 Service Status Verification

```
! Check service status
show sdwan service
show sdwan service firewall

! Sample output:
! SERVICE     VRF   ADDRESS        STATUS    TRACKER
! firewall    10    10.10.100.10   UP        FW-HEALTH
! firewall    10    10.10.100.20   STANDBY   FW-SECONDARY
! lb          10    10.10.200.10   UP        LB-HEALTH
```

---

## 8. Per-VPN Service Chains

### 8.1 VPN 10 - Employee Services

```
policy
 data-policy _VPN10-SERVICES_
  vpn-list VPN-10-EMPLOYEE
   ! Internet through FW
   sequence 10
    match
     destination-data-prefix-list INTERNET
    action accept
     set service firewall vpn 10
    !
   !
   ! Web apps through LB
   sequence 20
    match
     destination-data-prefix-list WEB-VIPS
    action accept
     set service lb vpn 10
    !
   !
   default-action accept
  !
```

### 8.2 VPN 100 - PCI Services (Mandatory FW)

```
policy
 data-policy _VPN100-MANDATORY-FW_
  vpn-list VPN-100-PCI
   ! ALL PCI traffic through dedicated FW
   sequence 10
    match
     source-ip 0.0.0.0/0
    action accept
     set
      service pci-firewall vpn 100
      ! NO fallback - drop if FW unavailable
     !
     log
    !
   !
  !
```

---

## 9. Cloud Service Insertion

### 9.1 Cloud-Hosted Services

```
! Service insertion for cloud-hosted firewall (Azure)
sdwan
 service cloud-fw vrf 10
  ipv4 address 10.200.100.10  ! Azure NVA
  tracking
   endpoint-tracker CLOUD-FW-HEALTH
  !
 !
```

### 9.2 Umbrella as Cloud Service

```
! Umbrella SIG as service insertion target
secure-internet-gateway
 umbrella
  token <TOKEN>
  org-id <ORG-ID>
  tunnel dc-primary
   data-center primary
  !
 !
!
policy
 data-policy _SIG-SERVICE_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     destination-data-prefix-list INTERNET
    action accept
     set
      sig umbrella
     !
    !
   !
  !
```

---

## 10. Monitoring and Verification

### 10.1 Verification Commands

```
! View configured services
show sdwan service
show sdwan service firewall
show sdwan service lb

! Check service health
show endpoint-tracker
show sdwan service-tracker

! View data policy with services
show sdwan policy data-policy

! Check traffic through services
show sdwan app-route statistics
show policy-firewall sessions

! Debug service insertion
debug sdwan service-insertion
```

### 10.2 Service Health Metrics

| Metric | Threshold | Action |
|--------|-----------|--------|
| Service Status | DOWN | Failover to secondary |
| Tracker Response | >100ms | Investigate latency |
| Session Count | >80% | Scale service capacity |
| Drop Count | Any | Review service logs |

---

## 11. Best Practices

### 11.1 Design Guidelines

| Guideline | Recommendation |
|-----------|----------------|
| HA | Always deploy services in HA pairs |
| Tracking | Configure multiple health checks |
| Fallback | Define fallback behavior explicitly |
| Capacity | Size services for peak traffic |
| Monitoring | Alert on service status changes |

### 11.2 Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Asymmetric routing | Return traffic bypasses service | Verify routing tables |
| Service overload | Under-sized service | Scale service capacity |
| Flapping | Aggressive health checks | Tune tracker parameters |

---

## 12. Summary

| Element | Abhavtech Configuration |
|---------|------------------------|
| Firewall | Palo Alto PA-5220 (Active/Standby) |
| Load Balancer | F5 BIG-IP |
| HA Mode | Active/Standby with tracking |
| PCI Traffic | Mandatory FW (no fallback) |
| Cloud Service | Umbrella SIG |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Next Review: March 2026*
