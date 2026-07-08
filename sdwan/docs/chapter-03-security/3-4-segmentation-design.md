# 3.4 Segmentation Design

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.4 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section documents the comprehensive segmentation design for Abhavtech's SD-WAN deployment. Network segmentation is a critical security control that isolates traffic between different user groups, applications, and security zones. The design aligns with the existing SD-Access Virtual Network (VN) structure to provide end-to-end segmentation from campus to WAN.

### 1.1 Segmentation Objectives

```
+------------------------------------------------------------------+
|                   SEGMENTATION OBJECTIVES                         |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+    +------------------+    +------------------+
|  | ISOLATION        |    | COMPLIANCE       |    | PERFORMANCE     |
|  +------------------+    +------------------+    +------------------+
|  | Prevent lateral  |    | Regulatory       |    | Traffic         |
|  | movement between |    | requirements     |    | optimization    |
|  | segments         |    | (PCI, HIPAA)     |    | per segment     |
|  +------------------+    +------------------+    +------------------+
|                                                                   |
|  +------------------+    +------------------+    +------------------+
|  | ACCESS CONTROL   |    | VISIBILITY       |    | SCALABILITY     |
|  +------------------+    +------------------+    +------------------+
|  | Granular policy  |    | Per-segment      |    | Grow without    |
|  | enforcement      |    | monitoring       |    | redesign        |
|  +------------------+    +------------------+    +------------------+
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 Design Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| Default Deny | No inter-segment traffic unless explicitly allowed | VPN isolation |
| Least Privilege | Minimum required access between segments | Controlled route leaking |
| End-to-End | Segmentation from campus through WAN to cloud | VN-to-VPN mapping |
| Centralized Policy | Single point of policy definition | SD-WAN Manager templates |
| Scalable | Support growth without redesign | Hierarchical VPN structure |

---

## 2. VPN Architecture

### 2.1 VPN Structure Overview

```
+------------------------------------------------------------------+
|                      SD-WAN VPN STRUCTURE                         |
+------------------------------------------------------------------+
|                                                                   |
|  +-----------------------------------------------------------+   |
|  |                     MANAGEMENT VPNs                        |   |
|  |  +----------------+  +----------------+  +----------------+|   |
|  |  | VPN 0          |  | VPN 512        |  | VPN 513       ||   |
|  |  | Transport      |  | Management     |  | Reserved      ||   |
|  |  | (DTLS/TLS)     |  | (Out-of-band)  |  | (Future)      ||   |
|  |  +----------------+  +----------------+  +----------------+|   |
|  +-----------------------------------------------------------+   |
|                                                                   |
|  +-----------------------------------------------------------+   |
|  |                      SERVICE VPNs                          |   |
|  |  +----------------+  +----------------+  +----------------+|   |
|  |  | VPN 10         |  | VPN 20         |  | VPN 30        ||   |
|  |  | Employee       |  | Guest          |  | IoT           ||   |
|  |  | (Corporate)    |  | (Internet-only)|  | (Restricted)  ||   |
|  |  +----------------+  +----------------+  +----------------+|   |
|  |                                                            |   |
|  |  +----------------+  +----------------+  +----------------+|   |
|  |  | VPN 40         |  | VPN 50         |  | VPN 100       ||   |
|  |  | Voice          |  | Shared Svc     |  | PCI Zone      ||   |
|  |  | (QoS Priority) |  | (DNS/DHCP)     |  | (Compliance)  ||   |
|  |  +----------------+  +----------------+  +----------------+|   |
|  +-----------------------------------------------------------+   |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 VPN Definitions

| VPN ID | Name | Description | SD-Access VN | SGT Range |
|--------|------|-------------|--------------|-----------|
| 0 | Transport | WAN underlay connectivity | N/A | N/A |
| 10 | Employee | Corporate user traffic | Employee_VN | 3-6 |
| 20 | Guest | Guest/contractor access | Guest_VN | 4 |
| 30 | IoT | IoT devices and sensors | IoT_VN | 7-8 |
| 40 | Voice | Voice and video traffic | Voice_VN | 9 |
| 50 | Shared_Services | Infrastructure services | Shared_VN | 5, 10-12 |
| 100 | PCI_Zone | Payment processing | PCI_VN | 12 |
| 512 | Management | Device management | Management_VN | 2 |

### 2.3 VPN to VRF Mapping

```
+------------------------------------------------------------------+
|                    VPN-TO-VRF MAPPING                             |
+------------------------------------------------------------------+
|                                                                   |
|    SD-WAN Manager           WAN Edge               SD-Access      |
|   +---------------+      +---------------+      +---------------+ |
|   |               |      |               |      |               | |
|   | VPN 10        |----->| VRF Employee  |<---->| Employee_VN   | |
|   | VPN 20        |----->| VRF Guest     |<---->| Guest_VN      | |
|   | VPN 30        |----->| VRF IoT       |<---->| IoT_VN        | |
|   | VPN 40        |----->| VRF Voice     |<---->| Voice_VN      | |
|   | VPN 50        |----->| VRF Shared    |<---->| Shared_VN     | |
|   | VPN 100       |----->| VRF PCI       |<---->| PCI_VN        | |
|   |               |      |               |      |               | |
|   +---------------+      +---------------+      +---------------+ |
|                                                                   |
|   Note: Each VPN maintains complete routing table isolation       |
|         Route Distinguisher format: 65100:VPN-ID                  |
|         Route Target format: 65100:VPN-ID                         |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 3. Transport VPN (VPN 0)

### 3.1 Transport VPN Purpose

The Transport VPN (VPN 0) provides the underlay connectivity for SD-WAN overlay tunnels. It is the only VPN that interfaces directly with external WAN networks.

```
+------------------------------------------------------------------+
|                    TRANSPORT VPN DESIGN                           |
+------------------------------------------------------------------+
|                                                                   |
|                        WAN Edge Router                            |
|  +-------------------------------------------------------------+ |
|  |                                                              | |
|  |  +------------------+  +------------------+                  | |
|  |  | Interface: G0/0  |  | Interface: G0/1  |                  | |
|  |  | Color: mpls      |  | Color: biz-internet|                | |
|  |  | VPN: 0           |  | VPN: 0           |                  | |
|  |  | TLOC: System-IP  |  | TLOC: System-IP  |                  | |
|  |  +--------+---------+  +--------+---------+                  | |
|  |           |                     |                            | |
|  |           +----------+----------+                            | |
|  |                      |                                       | |
|  |           +----------+----------+                            | |
|  |           |                     |                            | |
|  |  +--------+---------+  +--------+---------+                  | |
|  |  | DTLS Tunnel      |  | DTLS Tunnel      |                  | |
|  |  | To: Controller   |  | To: WAN Edges    |                  | |
|  |  +------------------+  +------------------+                  | |
|  |                                                              | |
|  +-------------------------------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 Transport VPN Configuration

```
! VPN 0 - Transport Configuration
vpn 0
 name "Transport VPN"
 
 ! MPLS Transport Interface
 interface GigabitEthernet0/0/0
  description "MPLS Transport - VPN 0"
  ip address 10.100.16.2/30
  tunnel-interface
   encapsulation ipsec
   color mpls
   no allow-service all
   allow-service dhcp
   allow-service dns
   allow-service icmp
   allow-service netconf
   allow-service ntp
   allow-service sshd
   allow-service stun
  !
 !
 
 ! Internet Transport Interface
 interface GigabitEthernet0/0/1
  description "DIA Transport - VPN 0"
  ip dhcp-client
  tunnel-interface
   encapsulation ipsec
   color biz-internet
   carrier "ISP-Primary"
   no allow-service all
   allow-service dhcp
   allow-service dns
   allow-service icmp
   allow-service stun
  !
 !
 
 ! Default Route to MPLS Provider
 ip route 0.0.0.0/0 10.100.16.1
!
```

### 3.3 Transport VPN Security

| Control | Implementation | Purpose |
|---------|----------------|---------|
| Service ACL | allow-service filters | Control allowed services |
| NAT | Outbound NAT for DIA | Hide internal addressing |
| Tunnel Interface | IPsec encapsulation | Encrypt all overlay traffic |
| Control Connections | TLS/DTLS to controllers | Secure control plane |

---

## 4. Service VPN Design

### 4.1 VPN 10: Employee Network

```
+------------------------------------------------------------------+
|                    VPN 10: EMPLOYEE NETWORK                       |
+------------------------------------------------------------------+
|                                                                   |
|  Purpose: Corporate user access to internal and cloud resources   |
|                                                                   |
|  Subnets:                                                         |
|  +----------------------------------------------------------+    |
|  | Site          | Network          | Description           |    |
|  +----------------------------------------------------------+    |
|  | Mumbai DC     | 172.16.10.0/23   | Employee LAN          |    |
|  | Chennai DR    | 172.16.12.0/23   | Employee LAN          |    |
|  | London        | 172.16.20.0/24   | Employee LAN          |    |
|  | New Jersey    | 172.16.22.0/24   | Employee LAN          |    |
|  | Bangalore     | 172.16.30.0/24   | Employee LAN          |    |
|  | Delhi         | 172.16.32.0/24   | Employee LAN          |    |
|  | Frankfurt     | 172.16.34.0/24   | Employee LAN          |    |
|  | Dallas        | 172.16.36.0/24   | Employee LAN          |    |
|  | Noida         | 172.16.38.0/24   | Employee LAN          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Access Rights:                                                   |
|  - Full access to corporate applications                          |
|  - Access to cloud services (M365, Salesforce, etc.)             |
|  - Controlled access to shared services                           |
|  - DIA breakout for SaaS applications                            |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.2 VPN 10 Configuration

```
vpn 10
 name "Employee Network"
 omp
  advertise connected
  advertise static
 !
 
 ! Service-side Interface
 interface GigabitEthernet0/0/2.10
  description "Employee VLAN - SD-Access Handoff"
  encapsulation dot1q 10
  ip address 172.16.10.1/23
  no shutdown
 !
 
 ! Enable routing
 ip route 0.0.0.0/0 vpn 0
 
 ! NAT for DIA
 nat
  natpool EMPLOYEE-NAT-POOL
   range 198.51.100.1 198.51.100.10
  !
  interface GigabitEthernet0/0/1
   nat-outside
  !
  nat-pool-for-dia
   EMPLOYEE-NAT-POOL
  !
 !
!
```

### 4.3 VPN 20: Guest Network

```
+------------------------------------------------------------------+
|                    VPN 20: GUEST NETWORK                          |
+------------------------------------------------------------------+
|                                                                   |
|  Purpose: Guest and contractor internet-only access               |
|                                                                   |
|  Subnets:                                                         |
|  +----------------------------------------------------------+    |
|  | Site          | Network          | Description           |    |
|  +----------------------------------------------------------+    |
|  | All Sites     | 172.17.X.0/24    | Guest WiFi            |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Access Rights:                                                   |
|  - Internet access only (DIA breakout)                           |
|  - NO access to corporate resources                              |
|  - NO access to other VPNs                                       |
|  - Bandwidth limited (50 Mbps per user)                          |
|  - Session timeout: 8 hours                                      |
|                                                                   |
|  Security Controls:                                               |
|  - Captive portal authentication                                 |
|  - Web filtering (Umbrella)                                      |
|  - DNS security                                                  |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.4 VPN 20 Configuration

```
vpn 20
 name "Guest Network"
 omp
  advertise connected
 !
 
 ! Service-side Interface
 interface GigabitEthernet0/0/2.20
  description "Guest VLAN - SD-Access Handoff"
  encapsulation dot1q 20
  ip address 172.17.10.1/24
  no shutdown
 !
 
 ! Guest traffic goes directly to Internet
 ip route 0.0.0.0/0 vpn 0
 
 ! DIA for all guest traffic
 nat
  natpool GUEST-NAT-POOL
   range 198.51.100.50 198.51.100.60
  !
  nat-pool-for-dia
   GUEST-NAT-POOL
  !
 !
!
```

### 4.5 VPN 30: IoT Network

```
+------------------------------------------------------------------+
|                      VPN 30: IoT NETWORK                          |
+------------------------------------------------------------------+
|                                                                   |
|  Purpose: IoT devices, sensors, building automation               |
|                                                                   |
|  Device Categories:                                               |
|  +----------------------------------------------------------+    |
|  | Category       | SGT  | Access                           |    |
|  +----------------------------------------------------------+    |
|  | HVAC/BMS       | 7    | Cloud management, limited local  |    |
|  | IP Cameras     | 8    | NVR/VMS only, no internet        |    |
|  | Sensors        | 7    | Cloud analytics platform         |    |
|  | Badge Readers  | 7    | Access control server only       |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Security Controls:                                               |
|  - Default deny between IoT devices                              |
|  - Restricted cloud access via firewall                          |
|  - No lateral movement capability                                |
|  - Continuous profiling via ISE                                  |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.6 VPN 30 Configuration

```
vpn 30
 name "IoT Network"
 omp
  advertise connected
 !
 
 ! Service-side Interface
 interface GigabitEthernet0/0/2.30
  description "IoT VLAN - SD-Access Handoff"
  encapsulation dot1q 30
  ip address 172.18.10.1/24
  no shutdown
 !
 
 ! Limited routing - no default route
 ! Only specific cloud destinations allowed
 
 ! Static routes to allowed cloud services
 ip route 13.107.0.0/16 vpn 0  ! Azure IoT Hub
 ip route 52.0.0.0/8 vpn 0     ! AWS IoT
 
!
```

### 4.7 VPN 40: Voice Network

```
+------------------------------------------------------------------+
|                     VPN 40: VOICE NETWORK                         |
+------------------------------------------------------------------+
|                                                                   |
|  Purpose: Voice and video communications                          |
|                                                                   |
|  Components:                                                      |
|  +----------------------------------------------------------+    |
|  | Component      | Location       | Network                |    |
|  +----------------------------------------------------------+    |
|  | CUCM Cluster   | Mumbai DC      | 172.19.1.0/24          |    |
|  | Unity Conn     | Mumbai DC      | 172.19.2.0/24          |    |
|  | IP Phones      | All Sites      | DHCP per site          |    |
|  | Video Conf     | Major Sites    | 172.19.10.0/24         |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  QoS Requirements:                                               |
|  - Voice: DSCP EF (46), < 150ms latency, < 1% loss              |
|  - Video: DSCP AF41 (34), < 200ms latency, < 2% loss            |
|  - Signaling: DSCP CS3 (24)                                     |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.8 VPN 40 Configuration

```
vpn 40
 name "Voice Network"
 omp
  advertise connected
  advertise static
 !
 
 ! Service-side Interface
 interface GigabitEthernet0/0/2.40
  description "Voice VLAN - SD-Access Handoff"
  encapsulation dot1q 40
  ip address 172.19.10.1/24
  qos-map VOICE-QOS
  no shutdown
 !
 
 ! Voice infrastructure routes
 ip route 172.19.1.0/24 vpn 50  ! CUCM via Shared Services
 ip route 172.19.2.0/24 vpn 50  ! Unity via Shared Services
 
!
```

### 4.9 VPN 50: Shared Services

```
+------------------------------------------------------------------+
|                  VPN 50: SHARED SERVICES                          |
+------------------------------------------------------------------+
|                                                                   |
|  Purpose: Infrastructure services accessible by all VPNs          |
|                                                                   |
|  Services:                                                        |
|  +----------------------------------------------------------+    |
|  | Service        | Network          | Accessible From      |    |
|  +----------------------------------------------------------+    |
|  | DNS Servers    | 172.20.1.0/24    | All VPNs             |    |
|  | NTP Servers    | 172.20.2.0/24    | All VPNs             |    |
|  | AD/LDAP        | 172.20.10.0/24   | VPN 10, 40, 512      |    |
|  | ISE PSN        | 172.20.20.0/24   | All VPNs             |    |
|  | CUCM           | 172.19.1.0/24    | VPN 40               |    |
|  | Infoblox       | 172.20.5.0/24    | VPN 512              |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Access Control:                                                  |
|  - Only infrastructure protocols allowed                         |
|  - SGT-based access control                                      |
|  - Service-specific ports only                                   |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.10 VPN 50 Configuration

```
vpn 50
 name "Shared Services"
 omp
  advertise connected
 !
 
 ! Service-side Interface
 interface GigabitEthernet0/0/2.50
  description "Shared Services VLAN - SD-Access Handoff"
  encapsulation dot1q 50
  ip address 172.20.1.1/24
  no shutdown
 !
 
 ! DNS Server Interface
 interface Loopback50
  ip address 172.20.1.10/32
  dns-server
 !
 
!
```

---

## 5. Route Leaking Design

### 5.1 Route Leaking Principles

Route leaking enables controlled communication between otherwise isolated VPNs. This must be carefully designed to maintain security while enabling required inter-segment access.

```
+------------------------------------------------------------------+
|                    ROUTE LEAKING DESIGN                           |
+------------------------------------------------------------------+
|                                                                   |
|  Principle: "Import what you need, export what others need"       |
|                                                                   |
|  +----------+     Route Leak     +----------+                     |
|  | VPN 10   |<------------------>| VPN 50   |                     |
|  | Employee |   (Shared Svc)     | Shared   |                     |
|  +----------+                    +----------+                     |
|       ^                               ^                           |
|       |                               |                           |
|       | No Leak                       | Route Leak                |
|       |                               |                           |
|       v                               v                           |
|  +----------+                    +----------+                     |
|  | VPN 20   |       XXXX         | VPN 40   |                     |
|  | Guest    | (No cross-access)  | Voice    |                     |
|  +----------+                    +----------+                     |
|                                                                   |
|  Guest VPN has no route leaking - complete isolation              |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 Route Leaking Matrix

| Source VPN | Destination VPN | Leaked Routes | Purpose |
|------------|-----------------|---------------|---------|
| VPN 10 | VPN 50 | 172.20.0.0/16 | Access shared services |
| VPN 50 | VPN 10 | 172.16.0.0/14 | Service responses |
| VPN 40 | VPN 50 | 172.20.0.0/16, 172.19.0.0/16 | Voice infra access |
| VPN 50 | VPN 40 | 172.19.0.0/16 | Voice responses |
| VPN 30 | VPN 50 | 172.20.1.0/24 | DNS only |
| VPN 20 | None | None | Complete isolation |
| VPN 100 | VPN 50 | 172.20.10.0/24 | AD authentication |

### 5.3 Route Leaking Configuration

```
! Control Policy for Route Leaking
policy
 control-policy ROUTE-LEAKING
  ! VPN 10 imports from VPN 50
  sequence 10
   match route
    vpn-list VPN-50-SHARED
   action accept
    set
     vpn-list VPN-10-EMPLOYEE
     route-type service-vpn-route
    !
   !
  !
  
  ! VPN 40 imports from VPN 50
  sequence 20
   match route
    vpn-list VPN-50-SHARED
   action accept
    set
     vpn-list VPN-40-VOICE
     route-type service-vpn-route
    !
   !
  !
  
  ! Block all other cross-VPN routes
  sequence 1000
   match route
    prefix-list ANY
   action reject
  !
 !
!

! Apply Control Policy
apply-policy
 site-list ALL-SITES
  control-policy ROUTE-LEAKING out
 !
!
```

### 5.4 Selective Service Access

```
! Data Policy for Selective Access
policy
 data-policy SHARED-SERVICES-ACCESS
  vpn-list VPN-10-EMPLOYEE
   ! Allow DNS to Shared Services
   sequence 10
    match
     destination-ip 172.20.1.0/24
     destination-port 53
    action accept
     count DNS-TO-SHARED
    !
   !
   
   ! Allow AD/LDAP to Shared Services
   sequence 20
    match
     destination-ip 172.20.10.0/24
     destination-port 389 636 3268 3269
    action accept
     count LDAP-TO-SHARED
    !
   !
   
   ! Allow NTP to Shared Services
   sequence 30
    match
     destination-ip 172.20.2.0/24
     destination-port 123
    action accept
     count NTP-TO-SHARED
    !
   !
   
   ! Block all other traffic to Shared Services
   sequence 100
    match
     destination-ip 172.20.0.0/16
    action drop
     count BLOCKED-TO-SHARED
    !
   !
  !
 !
!
```

---

## 6. VPN Isolation Verification

### 6.1 Isolation Test Matrix

| Test | Source VPN | Destination VPN | Expected Result | Test Method |
|------|------------|-----------------|-----------------|-------------|
| T1 | VPN 10 | VPN 20 | No connectivity | Ping/Traceroute |
| T2 | VPN 20 | VPN 10 | No connectivity | Ping/Traceroute |
| T3 | VPN 20 | VPN 30 | No connectivity | Ping/Traceroute |
| T4 | VPN 30 | VPN 10 | No connectivity | Ping/Traceroute |
| T5 | VPN 10 | VPN 50 (DNS) | Connectivity | DNS query |
| T6 | VPN 40 | VPN 50 (CUCM) | Connectivity | SIP registration |

### 6.2 Verification Commands

```
! Verify VPN Routing Tables
show sdwan omp routes vpn 10
show sdwan omp routes vpn 20
show sdwan omp routes vpn 50

! Verify Route Leaking
show sdwan policy access-list-associations

! Verify VPN Isolation
show ip vrf detail Employee
show ip route vrf Employee

! Test Cross-VPN Access
ping vrf Employee 172.17.10.100  ! Should fail (Guest)
ping vrf Employee 172.20.1.10    ! Should succeed (Shared DNS)

! Verify Prefix Advertisement
show sdwan omp routes vpn 10 | include 172.16
show sdwan omp routes vpn 50 | include 172.20
```

### 6.3 Isolation Monitoring

```
+------------------------------------------------------------------+
|                 VPN ISOLATION MONITORING                          |
+------------------------------------------------------------------+
|                                                                   |
|  Dashboard Metrics:                                               |
|  +----------------------------------------------------------+    |
|  | Metric                | Alert Threshold                  |    |
|  +----------------------------------------------------------+    |
|  | Cross-VPN traffic     | > 0 packets (unexpected VPNs)    |    |
|  | Route leak violations | > 0 events                       |    |
|  | Guest-to-Corp attempts| > 10 per minute                  |    |
|  | IoT breakout attempts | > 0 (unauthorized destinations)  |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  vManage Monitoring:                                              |
|  Administration > Monitoring > VPN Summary                        |
|  - Per-VPN traffic statistics                                    |
|  - Cross-VPN policy violations                                   |
|  - Route table size per VPN                                      |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 7. Topology Modes and Segmentation

### 7.1 Full Mesh Topology (Hub-Hub)

```
+------------------------------------------------------------------+
|                 FULL MESH - HUB SITES ONLY                        |
+------------------------------------------------------------------+
|                                                                   |
|     Mumbai DC <====================> Chennai DR                   |
|         ||\\                      //||                            |
|         || \\                    // ||                            |
|         ||  \\                  //  ||                            |
|         ||   \\                //   ||                            |
|         ||    \\              //    ||                            |
|         ||     \\============//     ||                            |
|         ||     ||  London   ||      ||                            |
|         ||     ||           ||      ||                            |
|         ||     ||===========||      ||                            |
|         ||    //            \\      ||                            |
|         ||   //              \\     ||                            |
|         ||  // New Jersey     \\    ||                            |
|         ||=====================\\===||                            |
|                                                                   |
|  Full mesh for:                                                   |
|  - VPN 10 (Employee) - DC interconnect                           |
|  - VPN 40 (Voice) - Call routing optimization                    |
|  - VPN 50 (Shared) - Service redundancy                          |
|                                                                   |
+------------------------------------------------------------------+
```

### 7.2 Hub-and-Spoke Topology (Branch)

```
+------------------------------------------------------------------+
|                HUB-AND-SPOKE - BRANCH SITES                       |
+------------------------------------------------------------------+
|                                                                   |
|                        +----------+                               |
|                        | Mumbai   |                               |
|                        |   DC     |                               |
|                        +----+-----+                               |
|                             |                                     |
|            +----------------+----------------+                    |
|            |                |                |                    |
|       +----+----+      +----+----+      +----+----+              |
|       |Bangalore|      | Delhi   |      | Noida   |              |
|       +---------+      +---------+      +---------+              |
|                                                                   |
|  Hub-and-spoke for:                                               |
|  - VPN 20 (Guest) - Central internet exit only                   |
|  - VPN 30 (IoT) - Centralized cloud access                       |
|  - VPN 100 (PCI) - Centralized compliance gateway                |
|                                                                   |
|  Benefits:                                                        |
|  - Centralized policy enforcement                                |
|  - Reduced branch complexity                                     |
|  - Simplified compliance                                         |
|                                                                   |
+------------------------------------------------------------------+
```

### 7.3 Per-VPN Topology Configuration

```
! Topology Configuration per VPN
policy
 topology VPN-TOPOLOGIES
  ! Full mesh for Employee VPN
  vpn-membership VPN-10-EMPLOYEE
   site-list HUB-SITES
    type full-mesh
   !
   site-list BRANCH-SITES
    type hub-and-spoke
    hub HUB-SITES
   !
  !
  
  ! Hub-and-spoke only for Guest
  vpn-membership VPN-20-GUEST
   site-list ALL-SITES
    type hub-and-spoke
    hub DC-SITES
   !
  !
  
  ! Hub-and-spoke only for IoT
  vpn-membership VPN-30-IOT
   site-list ALL-SITES
    type hub-and-spoke
    hub DC-SITES
   !
  !
 !
!
```

---

## 8. Multi-Region Fabric (MRF) Segmentation

### 8.1 MRF with VPN Segmentation

```
+------------------------------------------------------------------+
|                    MRF SEGMENTATION                               |
+------------------------------------------------------------------+
|                                                                   |
|  +---------------------+          +---------------------+         |
|  |   INDIA REGION      |          |   EMEA REGION       |        |
|  |   Access Domain     |          |   Access Domain     |        |
|  +---------------------+          +---------------------+         |
|  | Mumbai (Border)     |          | London (Border)     |        |
|  | Chennai (Border)    |          | Frankfurt           |        |
|  | Bangalore, Delhi,   |          |                     |        |
|  | Noida               |          |                     |        |
|  +----------+----------+          +----------+----------+         |
|             |                                |                    |
|             |    +------------------+        |                    |
|             +--->|   CORE REGION    |<-------+                    |
|                  | (Mumbai/Chennai  |                             |
|                  |  Border Routers) |                             |
|                  +--------+---------+                             |
|                           |                                       |
|             +-------------+-------------+                         |
|             |                           |                         |
|  +----------+----------+     +----------+----------+              |
|  |  AMERICAS REGION    |     |  CLOUD REGION       |              |
|  |  Access Domain      |     |  Access Domain      |              |
|  +---------------------+     +---------------------+              |
|  | New Jersey (Border) |     | AWS Gateway         |              |
|  | Dallas              |     | Azure Gateway       |              |
|  +---------------------+     +---------------------+              |
|                                                                   |
|  Each VPN maintains segmentation across all regions               |
|                                                                   |
+------------------------------------------------------------------+
```

### 8.2 MRF VPN Advertisement

```
! Border Router Configuration
! Control policy for inter-region route advertisement

policy
 control-policy MRF-ROUTE-POLICY
  ! Advertise VPN 10 routes to core
  sequence 10
   match route
    vpn-list VPN-10-EMPLOYEE
    site-list INDIA-SITES
   action accept
    set
     tloc-action secondary
    !
   !
  !
  
  ! Do NOT advertise Guest VPN to core
  sequence 20
   match route
    vpn-list VPN-20-GUEST
   action reject
  !
  
  ! Advertise Shared Services to all regions
  sequence 30
   match route
    vpn-list VPN-50-SHARED
   action accept
    set
     preference 1000
    !
   !
  !
 !
!
```

---

## 9. Compliance Zone Segmentation

### 9.1 PCI-DSS Cardholder Data Environment (CDE)

```
+------------------------------------------------------------------+
|                 PCI-DSS CDE SEGMENTATION                          |
+------------------------------------------------------------------+
|                                                                   |
|  VPN 100: PCI Zone                                                |
|  +----------------------------------------------------------+    |
|  |                                                          |    |
|  |  +------------------+     +------------------+           |    |
|  |  | Payment Servers  |<--->| Payment Gateway  |           |    |
|  |  | 172.30.10.0/24   |     | (Service Insert) |           |    |
|  |  +------------------+     +------------------+           |    |
|  |                                |                         |    |
|  |                                v                         |    |
|  |                     +------------------+                 |    |
|  |                     | External Firewall|                 |    |
|  |                     | (Palo Alto)      |                 |    |
|  |                     +--------+---------+                 |    |
|  |                              |                           |    |
|  +----------------------------------------------------------+    |
|                                 |                                |
|                                 v Internet (Payment Processor)   |
|                                                                   |
|  Segmentation Requirements:                                       |
|  - Complete isolation from all other VPNs                        |
|  - No route leaking allowed                                      |
|  - Service insertion for next-gen firewall                       |
|  - Full traffic logging and inspection                           |
|                                                                   |
+------------------------------------------------------------------+
```

### 9.2 PCI Zone Configuration

```
vpn 100
 name "PCI Cardholder Data Environment"
 omp
  advertise connected
  no advertise static
 !
 
 ! Isolated interface - no SD-Access handoff
 interface GigabitEthernet0/0/3
  description "PCI Zone - Dedicated Interface"
  ip address 172.30.10.1/24
  no shutdown
 !
 
 ! Service insertion for external firewall
 service firewall palo-alto
  ip address 172.30.10.254
  service-list
   permit all
  !
 !
 
 ! No default route - explicit routes only
 ip route 0.0.0.0/0 172.30.10.254
 
!
```

---

## 10. Best Practices Summary

### 10.1 VPN Design Best Practices

- Keep VPN count manageable (< 15 for most deployments)
- Use consistent VPN numbering across all sites
- Document VPN purpose and allowed traffic clearly
- Align VPN design with SD-Access VN structure

### 10.2 Route Leaking Best Practices

- Default to no route leaking (isolation by default)
- Document all route leaking with business justification
- Use data policies to restrict leaked route usage
- Regularly audit route leaking configuration

### 10.3 Compliance Best Practices

- Create dedicated VPNs for compliance zones (PCI, etc.)
- Implement additional controls (NGFW, logging) for compliance VPNs
- Test and validate isolation regularly
- Maintain documentation for auditors

### 10.4 Operational Best Practices

- Monitor cross-VPN traffic for anomalies
- Alert on unexpected VPN communication
- Validate segmentation after any policy changes
- Include segmentation testing in change procedures

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco SD-WAN Segmentation Guide | Official segmentation documentation | cisco.com |
| PCI-DSS v4.0 Requirements | Payment card industry standards | pcisecuritystandards.org |
| Abhavtech VN Design | SD-Access virtual network design | SharePoint |
| Network Security Policy | Corporate segmentation requirements | Internal |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.4*
