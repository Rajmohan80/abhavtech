# 3.5 TrustSec/SGT Integration

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.5 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section documents the Cisco TrustSec and Security Group Tag (SGT) integration between SD-Access and SD-WAN for Abhavtech's network infrastructure. TrustSec enables identity-based microsegmentation that extends from the campus LAN through the WAN, providing consistent policy enforcement regardless of user or device location.

### 1.1 TrustSec Integration Objectives

```
+------------------------------------------------------------------+
|              TRUSTSEC/SGT INTEGRATION OBJECTIVES                  |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+    +------------------+    +------------------+
|  | END-TO-END       |    | IDENTITY-BASED   |    | MICROSEGMENT-   |
|  | CONSISTENCY      |    | POLICIES         |    | ATION           |
|  +------------------+    +------------------+    +------------------+
|  | Same SGT from    |    | Who you are      |    | Granular access |
|  | campus to cloud  |    | determines access|    | within VPNs     |
|  +------------------+    +------------------+    +------------------+
|                                                                   |
|  +------------------+    +------------------+    +------------------+
|  | CENTRALIZED      |    | SCALABLE         |    | COMPLIANCE      |
|  | POLICY           |    | MODEL            |    | ENABLED         |
|  +------------------+    +------------------+    +------------------+
|  | ISE as single    |    | Add users, not   |    | Auditable SGT   |
|  | policy source    |    | ACL entries      |    | assignments     |
|  +------------------+    +------------------+    +------------------+
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 Integration Architecture

```
+------------------------------------------------------------------+
|                 TRUSTSEC INTEGRATION ARCHITECTURE                 |
+------------------------------------------------------------------+
|                                                                   |
|    Campus (SD-Access)              WAN (SD-WAN)         Cloud     |
|  +------------------+         +------------------+   +----------+ |
|  |                  |         |                  |   |          | |
|  | User/Device      |  SGT    | WAN Edge         |   | Cloud    | |
|  | SGT: 3 (Employee)|-------->| CTS Inline       |-->| Gateway  | |
|  |                  | Inline  | SGT Preserved    |   |          | |
|  +--------+---------+         +--------+---------+   +----+-----+ |
|           |                            |                  |       |
|           |                            |                  |       |
|           v                            v                  v       |
|  +------------------+         +------------------+   +----------+ |
|  | SD-Access        |         | SD-WAN Manager   |   | Remote   | |
|  | Fabric Border    |  eBGP   | Policy Engine    |   | Site     | |
|  | CTS Inline Tag   |<------->| SGT Awareness    |   | WAN Edge | |
|  +--------+---------+         +--------+---------+   +----+-----+ |
|           |                            |                  |       |
|           +----------------------------+------------------+       |
|                                |                                  |
|                       +--------+--------+                         |
|                       |      ISE        |                         |
|                       | (Policy Source) |                         |
|                       | pxGrid, SXP     |                         |
|                       +-----------------+                         |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. Abhavtech SGT Taxonomy

### 2.1 SGT Definitions

| SGT | Name | Description | VPN Mapping | Population |
|-----|------|-------------|-------------|------------|
| 2 | TrustSec_Devices | Network infrastructure | VPN 512 | ~200 devices |
| 3 | Employees | Full-time employees | VPN 10 | ~8,000 users |
| 4 | Guests | Guest and contractor | VPN 20 | ~500 concurrent |
| 5 | IT_Admins | IT privileged users | VPN 10, 512 | ~50 users |
| 6 | Executives | C-level executives | VPN 10 | ~25 users |
| 7 | IoT_Devices | General IoT | VPN 30 | ~2,000 devices |
| 8 | IP_Cameras | Security cameras | VPN 30 | ~500 cameras |
| 9 | Voice_Devices | IP phones, video | VPN 40 | ~3,000 devices |
| 10 | Servers | Data center servers | VPN 50, 100 | ~500 servers |
| 11 | Critical_Servers | Tier-1 applications | VPN 50 | ~50 servers |
| 12 | PCI_Systems | Payment processing | VPN 100 | ~30 systems |

### 2.2 SGT Hierarchy

```
+------------------------------------------------------------------+
|                       SGT HIERARCHY                               |
+------------------------------------------------------------------+
|                                                                   |
|                         +-------------+                           |
|                         | Unknown (0) |                           |
|                         +------+------+                           |
|                                |                                  |
|         +----------------------+----------------------+            |
|         |                      |                      |            |
|  +------+------+        +------+------+        +------+------+    |
|  |Infrastructure|        |   Users    |        |  Devices   |    |
|  +------+------+        +------+------+        +------+------+    |
|         |                      |                      |            |
|    +----+----+          +------+------+         +----+----+       |
|    |         |          |      |      |         |    |    |       |
|  SGT 2    SGT 10    SGT 3  SGT 4  SGT 5     SGT 7 SGT 8 SGT 9    |
|  Net Dev  Servers   Empl  Guest  IT_Adm    IoT  Cam  Voice       |
|                        |                                          |
|                   +----+----+                                     |
|                   |         |                                     |
|                 SGT 6    SGT 11                                   |
|                 Exec     Critical                                 |
|                                                                   |
|  Special Purpose:                                                 |
|  - SGT 12: PCI Systems (Compliance isolation)                    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 3. SGT Propagation Methods

### 3.1 Propagation Options

| Method | Description | Use Case | Abhavtech Usage |
|--------|-------------|----------|-----------------|
| CTS Inline | SGT in Ethernet frame CMD field | Campus, WAN tunnels | Primary |
| SXP | IP-to-SGT binding exchange | Legacy devices | ISE-to-WAN Edge |
| IP-SGT Static | Manual SGT assignment | Servers, infrastructure | Backup |
| SGACLs | Policy enforcement | All locations | All fabric nodes |

### 3.2 Inline Tagging Architecture

```
+------------------------------------------------------------------+
|                    CTS INLINE TAGGING                             |
+------------------------------------------------------------------+
|                                                                   |
|  Ethernet Frame with CTS Inline Tag:                              |
|  +----------------------------------------------------------+    |
|  |  Dest MAC  | Src MAC | 802.1AE | CMD | EtherType | Payload|   |
|  |  (6 bytes) |(6 bytes)|  Header | TAG |           |        |   |
|  +----------------------------------------------------------+    |
|                           |       |                               |
|                           |       +-> 16-bit SGT Value            |
|                           +-> Cisco Meta Data (CMD)               |
|                                                                   |
|  CMD Field Structure:                                             |
|  +----------------------------------------------------------+    |
|  | Version (4) | Length (12) | Opt Type (16) | SGT (16)     |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Flow:                                                            |
|  1. User authenticates to network (802.1X, MAB)                  |
|  2. ISE assigns SGT based on identity/posture                    |
|  3. Access switch adds CMD with SGT to frames                    |
|  4. All network devices honor and propagate SGT                  |
|  5. SGACLs enforce policy based on source-dest SGT pair          |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.3 SXP for SGT Propagation

```
+------------------------------------------------------------------+
|                    SXP PROPAGATION                                |
+------------------------------------------------------------------+
|                                                                   |
|     +-------------+     SXP     +-------------+                   |
|     |    ISE      |<----------->| WAN Edge    |                   |
|     | (Speaker)   |   TCP/64999 | (Listener)  |                   |
|     +------+------+             +------+------+                   |
|            |                           |                          |
|            | IP-SGT Bindings:          | Receives bindings:       |
|            | 10.10.10.50 -> SGT 3      | Uses for policy          |
|            | 10.10.20.100 -> SGT 7     | enforcement              |
|            | 10.10.30.25 -> SGT 9      |                          |
|            |                           |                          |
|                                                                   |
|  SXP Use Cases:                                                   |
|  - Non-CTS capable devices (legacy switches)                     |
|  - Third-party devices                                            |
|  - Cloud gateways                                                 |
|  - Software sensors                                               |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 4. SD-WAN TrustSec Configuration

### 4.1 WAN Edge CTS Configuration

```
! Enable CTS on WAN Edge
cts role-based enforcement
cts role-based enforcement vlan-list all

! CTS Credentials
cts credentials id WANEDGE-MUMBAI password 7 <encrypted>

! Configure SXP
cts sxp enable
cts sxp default source-ip 10.100.1.2
cts sxp default password 7 <encrypted>
cts sxp connection peer 10.254.1.10 source 10.100.1.2 password default mode peer speaker

! SGT Propagation on Tunnel Interface
interface Tunnel100
 description "SD-WAN Tunnel - CTS Enabled"
 cts role-based enforcement
 cts manual
  propagate sgt
 !
!

! Service VPN Interface with CTS
interface GigabitEthernet0/0/2.10
 description "Employee VPN - SD-Access Handoff"
 cts role-based enforcement
 cts manual
  propagate sgt
 !
!
```

### 4.2 SD-WAN Manager TrustSec Template

```
! Feature Template: TrustSec
trustsec
 credentials
  id ABHAV-WANEDGE-{{site_id}}
  password <encrypted>
 !
 sxp
  enable
  source-ip {{system_ip}}
  default-password <encrypted>
  connection-peer {{ise_psn_ip}}
   password default
   mode local listener
  !
 !
 role-based
  enforcement enable
  enforcement vlan-list all
  sgt-map {{server_ip}} sgt {{server_sgt}}
 !
!
```

### 4.3 ISE Integration for SXP

```
! ISE SXP Speaker Configuration
cts sxp enable
cts sxp default source-ip 10.254.1.10
cts sxp default password 7 ABHAV_SXP_KEY

! SXP Connections to WAN Edges
cts sxp connection peer 10.100.1.2 source 10.254.1.10 password default mode local speaker
cts sxp connection peer 10.100.1.3 source 10.254.1.10 password default mode local speaker
cts sxp connection peer 10.100.2.2 source 10.254.1.10 password default mode local speaker
cts sxp connection peer 10.100.2.3 source 10.254.1.10 password default mode local speaker
```

---

## 5. SGACL Policy Enforcement

### 5.1 SGACL Matrix

```
+------------------------------------------------------------------+
|                    SGACL POLICY MATRIX                            |
+------------------------------------------------------------------+
|                                                                   |
|  Source SGT    | Dest SGT 3  | Dest SGT 4  | Dest SGT 7  | ...   |
|  (Rows)        | (Employees) | (Guests)    | (IoT)       |       |
|  --------------+-------------+-------------+-------------+--------|
|  SGT 3 (Empl)  | PERMIT_ALL  | DENY        | DENY        | ...   |
|  SGT 4 (Guest) | DENY        | PERMIT_INET | DENY        | ...   |
|  SGT 5 (Admin) | PERMIT_ALL  | PERMIT_ALL  | PERMIT_ALL  | ...   |
|  SGT 7 (IoT)   | DENY        | DENY        | PERMIT_IOT  | ...   |
|  SGT 9 (Voice) | PERMIT_VOICE| DENY        | DENY        | ...   |
|  SGT 10 (Srv)  | PERMIT_ALL  | DENY        | PERMIT_IOT  | ...   |
|  SGT 12 (PCI)  | DENY        | DENY        | DENY        | ...   |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 SGACL Definitions

```
! SGACL: Employee to Servers - Full Access
ip access-list role-based PERMIT_ALL
 permit ip

! SGACL: Guest - Internet Only
ip access-list role-based PERMIT_INET
 deny ip 10.0.0.0 0.255.255.255 any
 deny ip 172.16.0.0 0.15.255.255 any
 deny ip 192.168.0.0 0.0.255.255 any
 permit ip

! SGACL: IoT - Restricted
ip access-list role-based PERMIT_IOT
 permit tcp any any eq 443
 permit tcp any any eq 8883
 permit udp any any eq 123
 deny ip

! SGACL: Voice - Voice Protocols Only
ip access-list role-based PERMIT_VOICE
 permit udp any any range 16384 32767
 permit tcp any any eq 5060
 permit tcp any any eq 5061
 permit tcp any any eq 2000
 deny ip

! SGACL: Default Deny
ip access-list role-based DENY_ALL
 deny ip
```

### 5.3 SGACL Binding to SGT Pairs

```
! ISE TrustSec Policy Configuration
! (Configured in ISE GUI, shown as CLI representation)

cts role-based permissions from 3 to 10  ! Employee to Servers
 PERMIT_ALL

cts role-based permissions from 4 to any  ! Guest to Any
 PERMIT_INET

cts role-based permissions from 7 to 10  ! IoT to Servers
 PERMIT_IOT

cts role-based permissions from 9 to 10  ! Voice to Servers
 PERMIT_VOICE

cts role-based permissions from 12 to any  ! PCI to Any
 DENY_ALL

cts role-based permissions default
 DENY_ALL
```

---

## 6. SGT Across WAN Scenarios

### 6.1 Campus to Remote Site

```
+------------------------------------------------------------------+
|              SGT PROPAGATION: CAMPUS TO REMOTE                    |
+------------------------------------------------------------------+
|                                                                   |
|  MUMBAI CAMPUS                        BANGALORE BRANCH            |
|  +----------------+                   +----------------+          |
|  | User: SGT 3    |                   | Server: SGT 10 |         |
|  | (Employee)     |                   | (DC App)       |         |
|  +-------+--------+                   +-------+--------+          |
|          |                                    ^                   |
|          v                                    |                   |
|  +-------+--------+                   +-------+--------+          |
|  | Access Switch  |                   | Remote Router  |          |
|  | CTS Inline     |                   | SGACL Enforce  |          |
|  +-------+--------+                   +-------+--------+          |
|          |                                    ^                   |
|          v                                    |                   |
|  +-------+--------+                   +-------+--------+          |
|  | Fabric Border  |                   | WAN Edge       |          |
|  | SGT: 3         |                   | SGT: 3 (recv)  |          |
|  +-------+--------+                   +-------+--------+          |
|          |                                    ^                   |
|          |  IPsec Tunnel (SGT in CMD)        |                   |
|          +------------------------------------+                   |
|                                                                   |
|  Policy Applied: Employee (SGT 3) -> Server (SGT 10) = PERMIT    |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 Remote Site to Remote Site

```
+------------------------------------------------------------------+
|             SGT PROPAGATION: REMOTE TO REMOTE                     |
+------------------------------------------------------------------+
|                                                                   |
|  BANGALORE BRANCH                     DELHI BRANCH                |
|  +----------------+                   +----------------+          |
|  | IP Phone       |                   | IP Phone       |         |
|  | SGT 9 (Voice)  |                   | SGT 9 (Voice)  |         |
|  +-------+--------+                   +-------+--------+          |
|          |                                    ^                   |
|          v                                    |                   |
|  +-------+--------+                   +-------+--------+          |
|  | WAN Edge BLR   |                   | WAN Edge DEL   |          |
|  | Source: SGT 9  |                   | Dest: SGT 9    |          |
|  +-------+--------+                   +-------+--------+          |
|          |                                    ^                   |
|          |  Direct Spoke-to-Spoke Tunnel     |                   |
|          +------------------------------------+                   |
|                                                                   |
|  Policy Applied: Voice (SGT 9) -> Voice (SGT 9) = PERMIT_VOICE   |
|                                                                   |
|  Note: On-demand tunnel for voice maintains SGT throughout       |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.3 Cloud Access with SGT

```
+------------------------------------------------------------------+
|              SGT PROPAGATION: ON-PREM TO CLOUD                    |
+------------------------------------------------------------------+
|                                                                   |
|  MUMBAI CAMPUS               AWS CLOUD GATEWAY                    |
|  +----------------+         +------------------------+            |
|  | User: SGT 3    |         | Cloud App              |           |
|  | (Employee)     |         | (Destination)          |           |
|  +-------+--------+         +-----------+------------+            |
|          |                              ^                         |
|          v                              |                         |
|  +-------+--------+         +-----------+------------+            |
|  | Fabric Border  |         | AWS Transit Gateway    |           |
|  | SGT: 3         |         | SGT Mapping Required   |           |
|  +-------+--------+         +-----------+------------+            |
|          |                              ^                         |
|          v                              |                         |
|  +-------+--------+         +-----------+------------+            |
|  | Mumbai WAN Edge|-------->| Cloud OnRamp Gateway   |           |
|  | SGT Preserved  | IPsec   | SXP for SGT Mapping    |           |
|  +----------------+         +------------------------+            |
|                                                                   |
|  Cloud Gateway Mapping:                                           |
|  - Receives SGT via CTS inline or SXP                            |
|  - Applies cloud security group based on SGT                     |
|  - Enables consistent policy in hybrid environment               |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 7. Static SGT Assignment

### 7.1 Server and Infrastructure SGT

For devices that cannot authenticate (servers, printers, infrastructure), static SGT mappings are required.

```
! Static IP-SGT Mappings on WAN Edge
cts role-based sgt-map 172.20.10.10 sgt 10      ! AD Server
cts role-based sgt-map 172.20.10.11 sgt 10      ! AD Server 2
cts role-based sgt-map 172.20.1.10 sgt 10       ! DNS Server
cts role-based sgt-map 172.20.1.11 sgt 10       ! DNS Server 2
cts role-based sgt-map 172.19.1.10 sgt 11       ! CUCM Publisher
cts role-based sgt-map 172.19.1.11 sgt 11       ! CUCM Subscriber
cts role-based sgt-map 172.30.10.0/24 sgt 12    ! PCI Subnet

! Verify Static Mappings
show cts role-based sgt-map all
```

### 7.2 Subnet-based SGT Assignment

```
! Subnet-based SGT Mapping (when IP authentication not possible)
cts role-based sgt-map 172.16.10.0/23 sgt 3     ! Mumbai Employee
cts role-based sgt-map 172.17.10.0/24 sgt 4     ! Mumbai Guest
cts role-based sgt-map 172.18.10.0/24 sgt 7     ! Mumbai IoT
cts role-based sgt-map 172.19.10.0/24 sgt 9     ! Mumbai Voice

! VRF-aware SGT Mapping
cts role-based sgt-map vrf Employee 172.16.0.0/14 sgt 3
cts role-based sgt-map vrf Guest 172.17.0.0/16 sgt 4
cts role-based sgt-map vrf IoT 172.18.0.0/16 sgt 7
cts role-based sgt-map vrf Voice 172.19.0.0/16 sgt 9
```

---

## 8. SGT Policy Integration with SD-WAN

### 8.1 Data Policy with SGT Matching

```
! SD-WAN Data Policy with SGT Awareness
policy
 data-policy SGT-AWARE-POLICY
  vpn-list VPN-10-EMPLOYEE
   ! High-priority routing for Executives
   sequence 10
    match
     source-sgt 6
     app-list BUSINESS-CRITICAL
    action accept
     set
      local-tloc-list MPLS-PREFERRED
      dscp 46
    !
   !
   
   ! Standard routing for Employees
   sequence 20
    match
     source-sgt 3
    action accept
     set
      local-tloc-list LOAD-BALANCE
    !
   !
   
   ! Restrict IoT cloud access
   sequence 30
    match
     source-sgt 7
    action accept
     set
      local-tloc-list INTERNET-ONLY
      service firewall
    !
   !
  !
 !
!
```

### 8.2 Application-Aware Routing with SGT

```
! AAR Policy Enhanced with SGT
policy
 app-route-policy SGT-AAR-POLICY
  vpn-list VPN-10-EMPLOYEE
   ! Voice traffic from Voice SGT gets priority
   sequence 10
    match
     source-sgt 9
     app-list VOICE-VIDEO
    action
     sla-class VOICE-SLA strict
     backup-sla-preferred-color mpls
    !
   !
   
   ! Executive traffic gets premium path
   sequence 20
    match
     source-sgt 6
    action
     sla-class PREMIUM-SLA
     backup-sla-preferred-color mpls
    !
   !
  !
 !
!
```

---

## 9. Verification and Monitoring

### 9.1 SGT Verification Commands

```
! Verify CTS Status
show cts
show cts pacs
show cts environment-data

! Verify SXP Connections
show cts sxp connections
show cts sxp sgt-map

! Verify SGT Propagation
show cts role-based sgt-map all
show cts role-based counters

! Verify SGACL Policies
show cts role-based permissions
show cts rbacl

! Example Output: CTS Status
CTS Global Inline Tagging:              Enabled
CTS Cache (SGACL Instance):             Enabled
CTS Cache (Role-based permissions):     Enabled
CTS SXP Connections:                    4
CTS SXP Learned SGT/Mapping:            2847
```

### 9.2 Troubleshooting SGT Issues

| Issue | Symptoms | Diagnosis | Resolution |
|-------|----------|-----------|------------|
| SGT Not Propagating | Traffic denied | `show cts interface` | Enable CTS on interface |
| SXP Connection Down | No bindings | `show cts sxp connections` | Check credentials, reachability |
| SGACL Not Enforcing | Unexpected access | `show cts role-based permissions` | Verify policy download |
| SGT Mismatch | Wrong policy | `show cts role-based sgt-map` | Check static mappings |

### 9.3 Monitoring Dashboard

```
+------------------------------------------------------------------+
|                 SGT MONITORING DASHBOARD                          |
+------------------------------------------------------------------+
|                                                                   |
|  Real-Time Metrics:                                               |
|  +----------------------------------------------------------+    |
|  | Metric                    | Value        | Status        |    |
|  +----------------------------------------------------------+    |
|  | Active SGT Bindings       | 12,847       | Normal        |    |
|  | SXP Connections           | 8/8          | Healthy       |    |
|  | SGACL Denies (1 hour)     | 342          | Monitor       |    |
|  | Unknown SGT Traffic       | 0.1%         | Normal        |    |
|  | CTS Enabled Interfaces    | 156/160      | 97.5%         |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Alert Thresholds:                                                |
|  - SXP Connection Loss: Immediate alert                          |
|  - Unknown SGT > 1%: Warning                                     |
|  - SGACL Denies spike: Investigate                               |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 10. Best Practices Summary

### 10.1 SGT Design Best Practices

- Keep SGT taxonomy simple (< 16 for most deployments)
- Align SGTs with business roles, not technical groups
- Document all SGT assignments and their purpose
- Use descriptive names for SGACLs

### 10.2 Propagation Best Practices

- Prefer CTS inline tagging over SXP where possible
- Use SXP only for legacy or third-party devices
- Ensure all transit devices support CTS
- Monitor SXP connection health

### 10.3 Policy Best Practices

- Default to deny between different SGT groups
- Explicitly permit only required communication
- Test SGACL policies in lab before production
- Regular audit of SGT assignments and policies

### 10.4 Operational Best Practices

- Monitor SGACL deny counters for anomalies
- Alert on SXP connection failures
- Include SGT in troubleshooting workflows
- Document SGT in network diagrams

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco TrustSec Design Guide | Official TrustSec documentation | cisco.com |
| ISE TrustSec Configuration | ISE SGT/SGACL setup | cisco.com |
| SD-WAN TrustSec Integration | SD-WAN specific guidance | cisco.com |
| Abhavtech SGT Policy | Corporate SGT definitions | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.5*
