# 3.11 Zero Trust WAN

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.11 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section documents the Zero Trust Network Access (ZTNA) principles applied to Abhavtech's SD-WAN deployment. The Zero Trust WAN architecture eliminates implicit trust based on network location and instead enforces continuous verification of identity, device health, and context before granting access to resources.

### 1.1 Zero Trust Principles

```
+------------------------------------------------------------------+
|                   ZERO TRUST CORE PRINCIPLES                      |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+    +------------------+    +------------------+
|  | NEVER TRUST      |    | ALWAYS VERIFY    |    | LEAST PRIVILEGE |
|  +------------------+    +------------------+    +------------------+
|  | No implicit trust|    | Every access     |    | Minimum access  |
|  | from location    |    | request verified |    | required        |
|  +------------------+    +------------------+    +------------------+
|                                                                   |
|  +------------------+    +------------------+    +------------------+
|  | ASSUME BREACH    |    | VERIFY EXPLICITLY|    | SECURE DEFAULTS |
|  +------------------+    +------------------+    +------------------+
|  | Design for       |    | MFA, cert-based  |    | Default deny    |
|  | compromise       |    | authentication   |    | policy          |
|  +------------------+    +------------------+    +------------------+
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 Zero Trust WAN Architecture

```
+------------------------------------------------------------------+
|                  ZERO TRUST WAN ARCHITECTURE                      |
+------------------------------------------------------------------+
|                                                                   |
|  Traditional Network              Zero Trust WAN                  |
|  +------------------+             +------------------+            |
|  | Perimeter-Based  |             | Identity-Based   |            |
|  | - Castle & Moat  |             | - Verify Always  |            |
|  | - Trust internal |             | - Trust Nothing  |            |
|  | - Implicit access|             | - Explicit policy|            |
|  +------------------+             +------------------+            |
|                                                                   |
|  Zero Trust WAN Components:                                       |
|  +----------------------------------------------------------+    |
|  |                                                          |    |
|  |  +----------+  +----------+  +----------+  +----------+  |    |
|  |  | Identity |  | Device   |  | Context  |  | Policy   |  |    |
|  |  | Verify   |  | Health   |  | Aware    |  | Engine   |  |    |
|  |  +----+-----+  +----+-----+  +----+-----+  +----+-----+  |    |
|  |       |             |             |             |         |    |
|  |       +-------------+-------------+-------------+         |    |
|  |                           |                               |    |
|  |                    +------v------+                        |    |
|  |                    | Access      |                        |    |
|  |                    | Decision    |                        |    |
|  |                    +------+------+                        |    |
|  |                           |                               |    |
|  |                    +------v------+                        |    |
|  |                    | Grant/Deny  |                        |    |
|  |                    | + Log       |                        |    |
|  |                    +-------------+                        |    |
|  |                                                          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. Identity Verification

### 2.1 Device Identity

```
+------------------------------------------------------------------+
|                    DEVICE IDENTITY VERIFICATION                   |
+------------------------------------------------------------------+
|                                                                   |
|  Device Authentication Methods:                                   |
|  +----------------------------------------------------------+    |
|  | Method              | Use Case         | Trust Level     |    |
|  +----------------------------------------------------------+    |
|  | Certificate (X.509) | WAN Edge routers | Highest         |    |
|  | OTP Token           | ZTP onboarding   | High            |    |
|  | Serial + Chassis ID | PnP bootstrap    | Medium          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Device Identity Flow:                                            |
|  +------------------+                                             |
|  | WAN Edge Router  |                                             |
|  | Serial: XXX      |                                             |
|  | Cert: Signed     |                                             |
|  +--------+---------+                                             |
|           |                                                       |
|           v                                                       |
|  +------------------+     +------------------+                    |
|  | Certificate      |---->| SD-WAN Manager   |                    |
|  | Validation       |     | Identity DB      |                    |
|  +------------------+     +------------------+                    |
|           |                       |                               |
|           v                       v                               |
|  +------------------+     +------------------+                    |
|  | Device Trusted   |     | Policy Applied   |                    |
|  +------------------+     +------------------+                    |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 User Identity Integration

```
! ISE Integration for User Identity
aaa authentication login default group radius local
aaa authorization exec default group radius local
aaa accounting exec default start-stop group radius

radius server ISE-PRIMARY
 address ipv4 10.254.1.10 auth-port 1812 acct-port 1813
 key ABHAV-RADIUS-KEY
 
radius server ISE-SECONDARY
 address ipv4 10.254.1.11 auth-port 1812 acct-port 1813
 key ABHAV-RADIUS-KEY

aaa group server radius ISE-SERVERS
 server name ISE-PRIMARY
 server name ISE-SECONDARY
!

! SAML Integration for vManage
security
 saml
  idp <IDP_METADATA>
  sp entity-id https://vmanage.abhavtech.com
  mfa required
 !
!
```

---

## 3. Device Health Verification

### 3.1 Posture Assessment

```
+------------------------------------------------------------------+
|                   DEVICE POSTURE ASSESSMENT                       |
+------------------------------------------------------------------+
|                                                                   |
|  Assessment Components:                                           |
|  +----------------------------------------------------------+    |
|  | Component          | Check                | Action        |    |
|  +----------------------------------------------------------+    |
|  | Software Version   | Approved version     | Block/Upgrade |    |
|  | Security Config    | Hardening baseline   | Remediate     |    |
|  | Certificate Status | Valid, not expired   | Block         |    |
|  | Compliance State   | Policy adherent      | Quarantine    |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Posture Flow:                                                    |
|  +------------------+     +------------------+                    |
|  | Device Connects  |---->| Posture Check    |                    |
|  +------------------+     +--------+---------+                    |
|                                    |                              |
|                    +---------------+---------------+               |
|                    |               |               |               |
|             +------v------+ +------v------+ +------v------+       |
|             | Compliant   | | Non-Comply  | | Unknown     |       |
|             | Full Access | | Remediate   | | Quarantine  |       |
|             +-------------+ +-------------+ +-------------+       |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 Continuous Posture Monitoring

```
! Continuous Device Health Monitoring
event manager applet DEVICE-HEALTH-CHECK
 event timer watchdog time 300
 action 1.0 cli command "show version | include Version"
 action 2.0 cli command "show crypto pki certificates"
 action 3.0 cli command "show sdwan control connections"
 action 4.0 syslog msg "Device health check completed"
!

! Alert on Compliance Deviation
event manager applet CONFIG-CHANGE-ALERT
 event syslog pattern "CONFIG_I"
 action 1.0 syslog msg "Configuration change detected - verify compliance"
 action 2.0 snmp-trap strdata "Config change - posture revalidation needed"
!
```

---

## 4. Context-Aware Access

### 4.1 Contextual Factors

| Factor | Description | Use in Policy |
|--------|-------------|---------------|
| Location | Geographic/network location | Geo-restrictions |
| Time | Time of access request | Business hours policy |
| Device Type | Corporate vs BYOD | Access level |
| Risk Score | Calculated risk | Dynamic policy |
| Application | Target application | App-specific rules |
| Behavior | User activity patterns | Anomaly detection |

### 4.2 Context-Based Policy

```
+------------------------------------------------------------------+
|                  CONTEXT-AWARE ACCESS POLICY                      |
+------------------------------------------------------------------+
|                                                                   |
|  Access Request Evaluation:                                       |
|                                                                   |
|  +----------+  +----------+  +----------+  +----------+          |
|  | WHO      |  | WHAT     |  | WHERE    |  | WHEN     |          |
|  | Identity |  | Resource |  | Location |  | Time     |          |
|  +----+-----+  +----+-----+  +----+-----+  +----+-----+          |
|       |             |             |             |                 |
|       +-------------+-------------+-------------+                 |
|                           |                                       |
|                    +------v------+                                |
|                    | Risk Score  |                                |
|                    | Calculation |                                |
|                    +------+------+                                |
|                           |                                       |
|            +--------------+--------------+                        |
|            |              |              |                        |
|     +------v------+ +-----v------+ +-----v------+                |
|     | Low Risk    | | Med Risk   | | High Risk  |                |
|     | Full Access | | Limited    | | MFA + Log  |                |
|     +-------------+ +------------+ +------------+                |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.3 Dynamic Policy Configuration

```
! Context-Aware Data Policy
policy
 data-policy CONTEXT-AWARE-ACCESS
  vpn-list VPN-10-EMPLOYEE
   ! After-hours access requires additional verification
   sequence 10
    match
     source-ip 0.0.0.0/0
     time-range AFTER-HOURS
    action accept
     set
      service firewall
      log
     count AFTER-HOURS-ACCESS
    !
   !
   
   ! Geographic restriction - block non-approved countries
   sequence 20
    match
     source-ip PREFIX-BLOCKED-COUNTRIES
    action drop
     log
     count GEO-BLOCKED
    !
   !
   
   ! High-risk applications require additional inspection
   sequence 30
    match
     app-list HIGH-RISK-APPS
    action accept
     set
      service firewall
      service utd
     count HIGH-RISK-INSPECTED
    !
   !
  !
 !
!
```

---

## 5. Microsegmentation

### 5.1 Zero Trust Segmentation Model

```
+------------------------------------------------------------------+
|                  ZERO TRUST MICROSEGMENTATION                     |
+------------------------------------------------------------------+
|                                                                   |
|  Traditional Flat Network:                                        |
|  +----------------------------------------------------------+    |
|  | All devices can communicate freely                        |   |
|  | Lateral movement possible after breach                    |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Zero Trust Microsegmentation:                                    |
|  +----------------------------------------------------------+    |
|  |  +------+    +------+    +------+    +------+            |    |
|  |  | User |    | User |    | Server|   | Server|           |    |
|  |  | SGT 3|    | SGT 6|    | SGT 10|   | SGT 11|           |    |
|  |  +--+---+    +--+---+    +--+---+    +--+---+            |    |
|  |     |           |           |           |                 |    |
|  |     +-----+-----+-----+-----+-----+-----+                 |    |
|  |           |           |           |                       |    |
|  |     +-----v-----+-----v-----+-----v-----+                 |    |
|  |     | Policy Enforcement Point (PEP)    |                 |    |
|  |     | Evaluate every flow against       |                 |    |
|  |     | SGT matrix policy                 |                 |    |
|  |     +-----------------------------------+                 |    |
|  |                                                          |    |
|  |  Access: SGT 3 -> SGT 10: ALLOW (specific ports)         |    |
|  |          SGT 3 -> SGT 11: DENY (no business need)        |    |
|  |          SGT 6 -> SGT 11: ALLOW (executive access)       |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 SGT-Based Zero Trust Policy

```
! Zero Trust SGT Matrix
! Default: DENY ALL

! Employee to Standard Servers - Specific Services Only
cts role-based permissions from 3 to 10
 ip access-list role-based EMPLOYEE-TO-SERVER
  permit tcp any any eq 80
  permit tcp any any eq 443
  permit tcp any any eq 3389
  deny ip any any log
!

! Employee to Critical Servers - DENY
cts role-based permissions from 3 to 11
 ip access-list role-based DENY-ALL
  deny ip any any log
!

! Executive to Critical Servers - ALLOW with logging
cts role-based permissions from 6 to 11
 ip access-list role-based EXEC-TO-CRITICAL
  permit ip any any log
!

! IoT to Servers - Minimal Access
cts role-based permissions from 7 to 10
 ip access-list role-based IOT-TO-SERVER
  permit tcp any any eq 443
  deny ip any any log
!

! Default Policy - Deny All Unknown
cts role-based permissions default
 ip access-list role-based DEFAULT-DENY
  deny ip any any log
!
```

---

## 6. Continuous Verification

### 6.1 Session Monitoring

```
+------------------------------------------------------------------+
|                  CONTINUOUS SESSION MONITORING                    |
+------------------------------------------------------------------+
|                                                                   |
|  Session Lifecycle:                                               |
|                                                                   |
|  +----------+     +----------+     +----------+     +----------+ |
|  | Session  |---->| Initial  |---->| Periodic |---->| Terminate| |
|  | Request  |     | Verify   |     | Revalidate    | | Session  | |
|  +----------+     +----------+     +----------+     +----------+ |
|                                                                   |
|  Continuous Checks:                                               |
|  +----------------------------------------------------------+    |
|  | Check               | Frequency    | Action on Failure   |    |
|  +----------------------------------------------------------+    |
|  | Session Active      | Real-time    | Terminate           |    |
|  | User Authenticated  | 5 minutes    | Re-authenticate     |    |
|  | Device Posture      | 15 minutes   | Quarantine          |    |
|  | Behavior Anomaly    | Continuous   | Alert + Review      |    |
|  | Certificate Valid   | Hourly       | Block               |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 Anomaly Detection

```
! Behavioral Anomaly Detection
! Monitor for unusual patterns

event manager applet ANOMALY-DETECTION
 event syslog pattern ".*TCAM.*full.*"
 action 1.0 syslog priority critical msg "Potential DoS - TCAM exhaustion"
 action 2.0 snmp-trap strdata "Security anomaly detected"
!

! Traffic Baseline Deviation
ip sla monitor 100
 type udp-jitter dest-addr 10.100.1.1 dest-port 5000
 threshold 100
 timeout 5000
 frequency 60
!

! Alert on Significant Deviation
track 100 ip sla 100
event manager applet BASELINE-DEVIATION
 event track 100 state down
 action 1.0 syslog msg "Network behavior deviation detected"
!
```

---

## 7. Zero Trust Remote Access

### 7.1 ZTNA for Remote Workers

```
+------------------------------------------------------------------+
|                   ZTNA REMOTE ACCESS                              |
+------------------------------------------------------------------+
|                                                                   |
|  Traditional VPN:                                                 |
|  +------------------+     +------------------+                    |
|  | Remote User      |---->| VPN Gateway      |                    |
|  | Full Network     |     | Full Access      |                    |
|  | Access           |     | Once Connected   |                    |
|  +------------------+     +------------------+                    |
|                                                                   |
|  Zero Trust Network Access:                                       |
|  +------------------+     +------------------+                    |
|  | Remote User      |---->| ZTNA Broker      |                    |
|  +------------------+     +--------+---------+                    |
|                                    |                              |
|           +------------------------+------------------------+     |
|           |                        |                        |     |
|    +------v------+          +------v------+          +------v---+ |
|    | App 1       |          | App 2       |          | App 3    | |
|    | Authorized  |          | Authorized  |          | Denied   | |
|    +-------------+          +-------------+          +----------+ |
|                                                                   |
|  Per-application access based on identity and context             |
|                                                                   |
+------------------------------------------------------------------+
```

### 7.2 ZTNA Configuration (Umbrella SIG)

```
! ZTNA via Umbrella SIG
! Per-application access control

! Step 1: Establish SIG Tunnel
interface Tunnel100
 description "Umbrella SIG - ZTNA"
 ip address negotiated
 tunnel source GigabitEthernet0/0/1
 tunnel mode ipsec ipv4
 tunnel protection ipsec profile UMBRELLA-IPSEC
!

! Step 2: Route specific applications through ZTNA
! Corporate apps via ZTNA inspection
ip route 10.0.0.0 255.0.0.0 Tunnel100

! Step 3: Policy enforcement at SIG
! (Configured in Umbrella dashboard)
! - User identity verification
! - Device posture check
! - Application-specific access rules
! - Continuous monitoring
```

---

## 8. Zero Trust Implementation Roadmap

### 8.1 Maturity Model

| Level | Description | Abhavtech Status |
|-------|-------------|------------------|
| Level 1 | Basic segmentation | ✅ Complete |
| Level 2 | Identity-based access | ✅ Complete |
| Level 3 | Device health verification | ✅ Complete |
| Level 4 | Context-aware policies | 🔄 In Progress |
| Level 5 | Full zero trust | 📋 Planned Q2 2026 |

### 8.2 Implementation Phases

```
+------------------------------------------------------------------+
|                  ZERO TRUST IMPLEMENTATION                        |
+------------------------------------------------------------------+
|                                                                   |
|  Phase 1: Foundation (Complete)                                   |
|  +----------------------------------------------------------+    |
|  | - Network segmentation (VPNs)                             |   |
|  | - Device authentication (certificates)                    |   |
|  | - User authentication (ISE integration)                   |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Phase 2: Enhanced Controls (Current)                             |
|  +----------------------------------------------------------+    |
|  | - SGT-based microsegmentation                             |   |
|  | - Device posture assessment                               |   |
|  | - Continuous monitoring                                   |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Phase 3: Advanced Zero Trust (Q2 2026)                           |
|  +----------------------------------------------------------+    |
|  | - Full ZTNA deployment                                    |   |
|  | - Behavioral analytics                                    |   |
|  | - Automated policy adjustment                             |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 9. Best Practices Summary

### 9.1 Identity Best Practices

- Require MFA for all administrative access
- Use certificate-based device authentication
- Integrate with centralized identity provider (ISE)
- Implement just-in-time access for privileged operations

### 9.2 Segmentation Best Practices

- Default deny between all segments
- Use SGT for granular microsegmentation
- Document all allowed flows with business justification
- Regularly audit and prune access rules

### 9.3 Verification Best Practices

- Continuously monitor device health
- Implement behavioral analytics
- Log all access decisions for audit
- Automate response to anomalies

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| NIST SP 800-207 | Zero Trust Architecture | nist.gov |
| Cisco Zero Trust Guide | Implementation guide | cisco.com |
| Forrester ZTX | Zero Trust framework | forrester.com |
| Abhavtech Security Policy | Internal zero trust policy | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.11*
