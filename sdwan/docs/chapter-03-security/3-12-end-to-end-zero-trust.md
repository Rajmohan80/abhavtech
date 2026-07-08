# 3.12 End-to-End Zero Trust (SD-Access + SD-WAN)

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.12 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section documents the comprehensive end-to-end Zero Trust architecture that spans both SD-Access (campus LAN) and SD-WAN (wide area network) domains. By integrating zero trust principles across the entire network fabric, Abhavtech achieves consistent security enforcement from user endpoint through campus, across the WAN, and into cloud and data center resources.

### 1.1 End-to-End Zero Trust Vision

```
+------------------------------------------------------------------+
|              END-TO-END ZERO TRUST ARCHITECTURE                   |
+------------------------------------------------------------------+
|                                                                   |
|  User Endpoint     Campus (SD-Access)    WAN (SD-WAN)    Cloud   |
|                                                                   |
|  +----------+     +-------------+     +------------+    +------+ |
|  | Laptop   |     | Access      |     | WAN Edge   |    | AWS  | |
|  | 802.1X   |---->| Switch      |---->| Router     |--->| VPC  | |
|  | AnyConnect|    | SGT: 3      |     | SGT: 3     |    |      | |
|  | Posture  |     | VN: Employee|     | VPN: 10    |    |      | |
|  +----------+     +------+------+     +------+-----+    +------+ |
|       |                  |                  |               |     |
|       |                  |                  |               |     |
|       v                  v                  v               v     |
|  +-----------------------------------------------------------------+
|  |                     ISE (Identity Authority)                    |
|  |  - User Authentication    - Device Posture                      |
|  |  - SGT Assignment         - Policy Decisions                    |
|  |  - TrustSec Policy        - Session Management                  |
|  +-----------------------------------------------------------------+
|                                                                   |
|  Consistent Zero Trust enforcement at every network transition    |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 Integration Benefits

| Benefit | Description | Impact |
|---------|-------------|--------|
| Consistent Identity | Same SGT from campus to cloud | Simplified policy |
| End-to-End Visibility | Complete traffic traceability | Better security |
| Unified Policy | Single policy source (ISE) | Reduced complexity |
| Microsegmentation | Granular control everywhere | Minimized blast radius |
| Automated Response | Coordinated threat response | Faster remediation |

---

## 2. Integrated Architecture Design

### 2.1 Component Integration

```
+------------------------------------------------------------------+
|                INTEGRATED ARCHITECTURE COMPONENTS                 |
+------------------------------------------------------------------+
|                                                                   |
|  Management Plane:                                                |
|  +----------------------------------------------------------+    |
|  |                                                          |    |
|  |  +----------------+  +----------------+  +---------------+|   |
|  |  | Catalyst Center|  | SD-WAN Manager |  |     ISE       ||   |
|  |  | (SD-Access)    |  | (SD-WAN)       |  | (Identity)    ||   |
|  |  +-------+--------+  +-------+--------+  +-------+-------+|   |
|  |          |                   |                   |        |    |
|  |          +-------------------+-------------------+        |    |
|  |                              |                            |    |
|  |                       +------v------+                     |    |
|  |                       |   pxGrid    |                     |    |
|  |                       | Integration |                     |    |
|  |                       +-------------+                     |    |
|  |                                                          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Data Plane:                                                      |
|  +----------------------------------------------------------+    |
|  |                                                          |    |
|  |  Campus            Fabric Border      WAN Edge    Cloud  |    |
|  |  +------+         +----------+       +--------+  +-----+ |    |
|  |  |Switch|<------->|  Border  |<----->|  WAN   |->|Cloud| |    |
|  |  |SGT   |  VXLAN  |  Node    | eBGP  |  Edge  |  |GW   | |    |
|  |  +------+         +----------+       +--------+  +-----+ |    |
|  |     |                  |                 |          |     |    |
|  |     +------------------+-----------------+----------+     |    |
|  |                        |                                  |    |
|  |                 SGT Propagation (CTS Inline)              |    |
|  |                                                          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 Information Flow

```
+------------------------------------------------------------------+
|                    ZERO TRUST INFORMATION FLOW                    |
+------------------------------------------------------------------+
|                                                                   |
|  Step 1: User Authentication                                      |
|  +----------------------------------------------------------+    |
|  | User connects to campus switch                            |   |
|  | 802.1X/MAB authentication to ISE                          |   |
|  | ISE validates identity and posture                        |   |
|  | ISE assigns SGT (e.g., SGT 3 for Employee)                |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Step 2: Campus Fabric                                            |
|  +----------------------------------------------------------+    |
|  | Switch adds CTS inline tag with SGT                       |   |
|  | Traffic forwarded through fabric with SGT                 |   |
|  | SGACL enforced at edge nodes                              |   |
|  | SGT preserved through VXLAN to border                     |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Step 3: Fabric Handoff to WAN                                    |
|  +----------------------------------------------------------+    |
|  | Border node hands off to WAN Edge via L3 VRF-Lite         |   |
|  | SGT propagated via CTS inline on handoff link             |   |
|  | WAN Edge maintains SGT for policy enforcement             |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Step 4: WAN Transport                                            |
|  +----------------------------------------------------------+    |
|  | Traffic encrypted in IPsec tunnel                         |   |
|  | SGT preserved in CMD header                               |   |
|  | SD-WAN policy can match on SGT                            |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Step 5: Remote Site / Cloud                                      |
|  +----------------------------------------------------------+    |
|  | WAN Edge at destination receives traffic with SGT         |   |
|  | SGACL/policy enforced at destination                      |   |
|  | SGT-based access to applications                          |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 3. SGT End-to-End Propagation

### 3.1 SGT Flow Diagram

```
+------------------------------------------------------------------+
|                SGT END-TO-END PROPAGATION                         |
+------------------------------------------------------------------+
|                                                                   |
|  Mumbai Campus                                                    |
|  +------------------+                                             |
|  | User Laptop      |                                             |
|  | 802.1X Auth      |                                             |
|  +--------+---------+                                             |
|           | SGT Assigned: 3                                       |
|           v                                                       |
|  +--------+---------+                                             |
|  | Access Switch    |                                             |
|  | CTS Inline: SGT 3|                                             |
|  +--------+---------+                                             |
|           | VXLAN (SGT in Group Policy ID)                        |
|           v                                                       |
|  +--------+---------+                                             |
|  | Fabric Border    |                                             |
|  | SGT 3 Preserved  |                                             |
|  +--------+---------+                                             |
|           | VRF-Lite Handoff (CTS Inline)                         |
|           v                                                       |
|  +--------+---------+                                             |
|  | WAN Edge Mumbai  |                                             |
|  | SGT 3 Received   |                                             |
|  +--------+---------+                                             |
|           | IPsec Tunnel (CMD Header)                             |
|           v                                                       |
|  +--------+---------+                                             |
|  | WAN Edge Chennai |                                             |
|  | SGT 3 Intact     |                                             |
|  +--------+---------+                                             |
|           | CTS Inline to DC                                      |
|           v                                                       |
|  +--------+---------+                                             |
|  | Server (SGT 10)  |                                             |
|  | SGACL: 3->10 OK  |                                             |
|  +------------------+                                             |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 Configuration for End-to-End SGT

```
! SD-Access Border Node (Egress to WAN Edge)
interface GigabitEthernet1/0/1
 description "To WAN Edge - VRF-Lite Handoff"
 no switchport
 vrf forwarding Employee
 ip address 10.252.1.1 255.255.255.252
 cts role-based enforcement
 cts manual
  policy static sgt 3 dgt 65535 access-list PERMIT-ALL
  no propagate sgt
 !
!

! Enable CTS Propagation
cts role-based enforcement
cts role-based enforcement vlan-list all

! WAN Edge Configuration
interface GigabitEthernet0/0/2.10
 description "From SD-Access Border - Employee VN"
 encapsulation dot1q 10
 vrf forwarding Employee
 ip address 10.252.1.2 255.255.255.252
 cts role-based enforcement
 cts manual
  propagate sgt
 !
!

! Enable CTS on Tunnel Interface
interface Tunnel100
 description "SD-WAN Overlay"
 cts role-based enforcement
 cts manual
  propagate sgt
 !
!
```

---

## 4. Unified Policy Framework

### 4.1 Policy Hierarchy

```
+------------------------------------------------------------------+
|                   UNIFIED POLICY HIERARCHY                        |
+------------------------------------------------------------------+
|                                                                   |
|  Layer 1: Identity Policy (ISE)                                   |
|  +----------------------------------------------------------+    |
|  | - User/Device Authentication                              |   |
|  | - SGT Assignment                                          |   |
|  | - Posture Assessment                                      |   |
|  | - Authorization Profiles                                  |   |
|  +----------------------------------------------------------+    |
|                          |                                        |
|                          v                                        |
|  Layer 2: Segmentation Policy (TrustSec)                          |
|  +----------------------------------------------------------+    |
|  | - SGACL Matrix (Source SGT -> Dest SGT)                   |   |
|  | - Enforced at SD-Access and SD-WAN                        |   |
|  | - Microsegmentation within VN/VPN                         |   |
|  +----------------------------------------------------------+    |
|                          |                                        |
|                          v                                        |
|  Layer 3: Network Policy (SD-Access + SD-WAN)                     |
|  +----------------------------------------------------------+    |
|  | - VN/VPN Segmentation                                     |   |
|  | - QoS Policy                                              |   |
|  | - Routing Policy                                          |   |
|  +----------------------------------------------------------+    |
|                          |                                        |
|                          v                                        |
|  Layer 4: Application Policy (AAR + Firewall)                     |
|  +----------------------------------------------------------+    |
|  | - Application-Aware Routing                               |   |
|  | - URL Filtering                                           |   |
|  | - Threat Detection (UTD)                                  |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.2 Policy Consistency Matrix

| Policy Type | SD-Access | SD-WAN | Enforcement Point |
|-------------|-----------|--------|-------------------|
| Identity | ISE auth | ISE (SXP) | Access layer |
| SGT Assignment | ISE | ISE (SXP) | First hop |
| SGACL | Fabric edge | WAN Edge | Egress |
| VN/VPN Isolation | Catalyst Center | vManage | Fabric/Overlay |
| QoS | Catalyst Center | vManage | All devices |
| Firewall | Fabric edge | WAN Edge + NGFW | Perimeter |

### 4.3 Coordinated Policy Configuration

```
! ISE Policy Set (applies to both SD-Access and SD-WAN)
! Policy Set: Abhavtech-ZeroTrust

! Authentication Policy
authentication policy ABHAV-AUTH
 rule DOT1X-WIRED
  if Connection-Type = Wired-802.1X
  then allow-protocol EAP-TLS
 rule MAB
  if Connection-Type = Wired-MAB
  then allow-protocol PAP
!

! Authorization Policy
authorization policy ABHAV-AUTHZ
 rule EMPLOYEE-FULL
  if IdentityGroup = Employees AND Posture = Compliant
  then
   SGT = 3
   VLAN = Employee
   DACL = PERMIT-ALL
 rule EMPLOYEE-LIMITED
  if IdentityGroup = Employees AND Posture = Non-Compliant
  then
   SGT = 99
   VLAN = Remediation
   DACL = REMEDIATION-ONLY
 rule GUEST
  if IdentityGroup = Guests
  then
   SGT = 4
   VLAN = Guest
   DACL = INTERNET-ONLY
!
```

---

## 5. Cross-Domain Threat Response

### 5.1 Coordinated Response Architecture

```
+------------------------------------------------------------------+
|              CROSS-DOMAIN THREAT RESPONSE                         |
+------------------------------------------------------------------+
|                                                                   |
|  Threat Detection:                                                |
|  +----------------------------------------------------------+    |
|  |  SD-Access         SD-WAN           Cloud                |    |
|  |  - Stealthwatch    - UTD            - CloudWatch         |    |
|  |  - ISE Profiling   - NetFlow        - GuardDuty          |    |
|  |  - DNA Analytics   - vAnalytics     - Security Hub       |    |
|  +----------------------------------------------------------+    |
|                          |                                        |
|                          v                                        |
|  Threat Correlation:                                              |
|  +----------------------------------------------------------+    |
|  |              SIEM (Splunk/SecureX)                        |   |
|  |  - Correlate events across domains                        |   |
|  |  - Identify attack patterns                               |   |
|  |  - Calculate risk scores                                  |   |
|  +----------------------------------------------------------+    |
|                          |                                        |
|                          v                                        |
|  Automated Response:                                              |
|  +----------------------------------------------------------+    |
|  |                                                          |    |
|  |  ISE (pxGrid)     SD-WAN Manager    Cloud Security       |    |
|  |  +------------+   +-------------+   +----------------+   |    |
|  |  | Quarantine |   | Block Policy|   | Security Group |   |    |
|  |  | Change SGT |   | Route Black |   | Isolation      |   |    |
|  |  | Port Down  |   | hole        |   |                |   |    |
|  |  +------------+   +-------------+   +----------------+   |    |
|  |                                                          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 Automated Quarantine Workflow

```
+------------------------------------------------------------------+
|                AUTOMATED QUARANTINE WORKFLOW                      |
+------------------------------------------------------------------+
|                                                                   |
|  Step 1: Threat Detected                                          |
|  +----------------------------------------------------------+    |
|  | UTD on WAN Edge detects malware download                  |   |
|  | Source: 172.16.10.50 (User laptop)                        |   |
|  | Alert sent to SIEM                                        |   |
|  +----------------------------------------------------------+    |
|                          |                                        |
|                          v                                        |
|  Step 2: SIEM Correlation                                         |
|  +----------------------------------------------------------+    |
|  | SIEM correlates with ISE session                          |   |
|  | User: john.doe@abhavtech.com                              |   |
|  | Device: LAPTOP-JD01                                       |   |
|  | SGT: 3 (Employee)                                         |   |
|  +----------------------------------------------------------+    |
|                          |                                        |
|                          v                                        |
|  Step 3: Automated Response                                       |
|  +----------------------------------------------------------+    |
|  | pxGrid Adaptive Network Control (ANC) triggered           |   |
|  | ISE changes SGT from 3 to 99 (Quarantine)                 |   |
|  | CoA sent to access switch                                 |   |
|  +----------------------------------------------------------+    |
|                          |                                        |
|                          v                                        |
|  Step 4: Network-Wide Enforcement                                 |
|  +----------------------------------------------------------+    |
|  | SD-Access: User moved to Quarantine VN                    |   |
|  | SD-WAN: SGT 99 blocked at all WAN Edges                   |   |
|  | Cloud: User session terminated                            |   |
|  +----------------------------------------------------------+    |
|                          |                                        |
|                          v                                        |
|  Step 5: Notification                                             |
|  +----------------------------------------------------------+    |
|  | Security team notified                                    |   |
|  | User redirected to remediation portal                     |   |
|  | Incident ticket created                                   |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.3 pxGrid ANC Integration

```
! ISE pxGrid Configuration for Adaptive Network Control
! (Configured in ISE Admin Console)

! ANC Policy: Quarantine
anc-policy QUARANTINE
 action QUARANTINE
 description "Isolate compromised endpoints"
!

! ANC Policy: Investigate
anc-policy INVESTIGATE
 action PORT_BOUNCE
 description "Reset connection for investigation"
!

! pxGrid Client Configuration (SD-WAN Manager)
pxgrid-client
 hostname vmanage.abhavtech.com
 node-name SDWAN-MANAGER
 certificate client-cert.pem
 service-name com.cisco.ise.session
 service-name com.cisco.ise.config.anc
 subscribe topic /topic/com.cisco.ise.session
 subscribe topic /topic/com.cisco.ise.anc
!
```

---

## 6. End-to-End Visibility

### 6.1 Unified Dashboard

```
+------------------------------------------------------------------+
|               END-TO-END VISIBILITY DASHBOARD                     |
+------------------------------------------------------------------+
|                                                                   |
|  User Journey Tracking:                                           |
|  +----------------------------------------------------------+    |
|  | User: john.doe@abhavtech.com                              |   |
|  | Device: LAPTOP-JD01                                       |   |
|  | SGT: 3 (Employee)                                         |   |
|  +----------------------------------------------------------+    |
|  |                                                          |    |
|  | 09:00 - Connected to Mumbai Campus (Switch1, Port 24)    |    |
|  | 09:01 - 802.1X Auth Success, SGT 3 Assigned              |    |
|  | 09:15 - Accessed O365 (DIA via Mumbai WAN Edge)          |    |
|  | 10:30 - Accessed SAP Server (Chennai DC via SD-WAN)      |    |
|  | 11:45 - Accessed AWS (Cloud OnRamp)                      |    |
|  |                                                          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Security Events:                                                 |
|  +----------------------------------------------------------+    |
|  | No threats detected                                       |   |
|  | Posture: Compliant                                        |   |
|  | Risk Score: Low (12/100)                                  |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Traffic Summary:                                                 |
|  +----------------------------------------------------------+    |
|  | Total: 2.5 GB | Apps: O365 (1.8 GB), SAP (500 MB)        |   |
|  | Latency: Avg 45ms | Loss: 0.01%                          |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 Path Trace Integration

```
! Catalyst Center + SD-WAN Manager Path Trace
! Combined view from user to application

! Campus Path (Catalyst Center API)
GET /api/v1/flow-analysis
{
  "sourceIP": "172.16.10.50",
  "destIP": "10.20.30.40",
  "sourcePort": "49152",
  "destPort": "443"
}

! WAN Path (SD-WAN Manager API)
GET /dataservice/device/omp/routes/received?deviceId=<wan-edge-id>

! Combined Result:
Path: User -> Access-SW -> Dist-SW -> Border -> WAN-Edge-MUM -> 
      IPsec -> WAN-Edge-CHN -> Server

Latency: 2ms (Campus) + 35ms (WAN) + 3ms (DC) = 40ms total
SGT: 3 (maintained throughout)
```

---

## 7. Compliance and Audit

### 7.1 End-to-End Audit Trail

```
+------------------------------------------------------------------+
|                  END-TO-END AUDIT TRAIL                           |
+------------------------------------------------------------------+
|                                                                   |
|  Audit Data Collection:                                           |
|  +----------------------------------------------------------+    |
|  | Source              | Data Type         | Retention      |    |
|  +----------------------------------------------------------+    |
|  | ISE                 | Auth/Authz logs   | 2 years        |    |
|  | Catalyst Center     | Config/Flow       | 1 year         |    |
|  | SD-WAN Manager      | Policy/Traffic    | 1 year         |    |
|  | SIEM                | Correlated events | 7 years        |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Compliance Evidence:                                             |
|  +----------------------------------------------------------+    |
|  | Control             | Evidence Source   | Frequency      |    |
|  +----------------------------------------------------------+    |
|  | Access Control      | ISE auth logs     | Real-time      |    |
|  | Segmentation        | SGACL hit counts  | Daily          |    |
|  | Encryption          | IPsec SA status   | Hourly         |    |
|  | Change Management   | Config audit      | Per change     |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 8. Implementation Checklist

### 8.1 Prerequisites

- [ ] SD-Access fabric operational with TrustSec
- [ ] ISE deployed with SGT policy
- [ ] SD-WAN overlay established
- [ ] VRF-Lite handoff configured
- [ ] pxGrid enabled on ISE

### 8.2 Integration Steps

- [ ] Enable CTS on SD-Access borders
- [ ] Configure CTS on WAN Edge handoff interfaces
- [ ] Verify SGT propagation across handoff
- [ ] Configure SXP between ISE and WAN Edges
- [ ] Enable SGACL on WAN Edges
- [ ] Integrate pxGrid with SD-WAN Manager
- [ ] Configure coordinated threat response
- [ ] Validate end-to-end SGT flow
- [ ] Test automated quarantine

---

## 9. Best Practices Summary

### 9.1 Architecture Best Practices

- Use ISE as single source of identity truth
- Maintain consistent SGT taxonomy across domains
- Enable CTS inline for lowest latency SGT propagation
- Use SXP as backup for non-CTS devices

### 9.2 Policy Best Practices

- Start with coarse segmentation, refine over time
- Test SGACL policies in lab before production
- Document all SGT assignments and SGACL rules
- Regular audit of cross-domain policy consistency

### 9.3 Operations Best Practices

- Monitor SGT propagation health continuously
- Alert on SGT mismatches across domain boundaries
- Include both domains in incident response
- Maintain runbooks for cross-domain troubleshooting

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco SD-Access SD-WAN Integration | CVD for integration | cisco.com |
| TrustSec Design Guide | End-to-end TrustSec | cisco.com |
| ISE pxGrid Guide | pxGrid integration | cisco.com |
| Abhavtech Zero Trust Policy | Internal ZT policy | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.12*
