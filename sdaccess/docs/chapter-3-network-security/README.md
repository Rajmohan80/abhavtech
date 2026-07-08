# Chapter 3: Network & Security

> **Chapter Version**: 1.0  
> **Last Updated**: December 2025

---

## Chapter Overview

This chapter provides comprehensive network security design for the SD-Access deployment, including ISE policy configuration, micro-segmentation, firewall integration, and compliance requirements.

---

## 3.1 Security Architecture Overview

### 3.1.1 Zero Trust Security Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ZERO TRUST SECURITY ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                    IDENTITY-BASED ACCESS                              ║  │
│  ║                                                                       ║  │
│  ║  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   ║  │
│  ║  │   WHO?      │  │   WHAT?     │  │   WHERE?    │  │   WHEN?     │   ║  │
│  ║  │             │  │             │  │             │  │             │   ║  │
│  ║  │ User ID     │  │ Device Type │  │ Location    │  │ Time of Day │   ║  │
│  ║  │ AD Group    │  │ Posture     │  │ Network     │  │ Duration    │   ║  │
│  ║  │ Role        │  │ Compliance  │  │ Zone        │  │ Session     │   ║  │
│  ║  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   ║  │
│  ║         │                │                │                │          ║  │
│  ║         └────────────────┴────────────────┴────────────────┘          ║  │
│  ║                                  │                                    ║  │
│  ║                                  ▼                                    ║  │
│  ║  ┌───────────────────────────────────────────────────────────────┐    ║  │
│  ║  │                     CISCO ISE                                 │    ║  │
│  ║  │                                                               │    ║  │
│  ║  │   Policy Decision Point (PDP)                                 │    ║  │
│  ║  │   • Authentication                                            │    ║  │
│  ║  │   • Authorization                                             │    ║  │
│  ║  │   • Posture Assessment                                        │    ║  │
│  ║  │   • Profiling                                                 │    ║  │
│  ║  │   • SGT Assignment                                            │    ║  │
│  ║  │                                                               │    ║  │
│  ║  └───────────────────────────────────────────────────────────────┘    ║  │
│  ║                                  │                                    ║  │
│  ║                                  ▼                                    ║  │
│  ║  ┌───────────────────────────────────────────────────────────────┐    ║  │
│  ║  │                  ACCESS DECISION                              │    ║  │
│  ║  │                                                               │    ║  │
│  ║  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │    ║  │
│  ║  │   │   PERMIT    │  │   DENY      │  │  QUARANTINE │           │    ║  │
│  ║  │   │   + SGT     │  │             │  │   + Remediate│           │    ║  │
│  ║  │   └─────────────┘  └─────────────┘  └─────────────┘           │    ║  │
│  ║  │                                                               │    ║  │
│  ║  └───────────────────────────────────────────────────────────────┘    ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                             │
│  ENFORCEMENT POINTS:                                                        │
│  ────────────────────                                                       │
│  • Fabric Edge Nodes (SGT inline tagging)                                   │
│  • Border Nodes (SGT-to-SGACL enforcement)                                  │
│  • Firewalls (SGT-aware policies)                                           │
│  • Wireless Controllers (SGT assignment)                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1.2 Defense-in-Depth Layers

| Layer | Component | Security Function |
|-------|-----------|-------------------|
| **Layer 1** | Endpoint | AMP, DUO MFA, Posture Agent |
| **Layer 2** | Access Network | 802.1X, MAB, Profiling |
| **Layer 3** | Fabric | SGT, VXLAN encryption, micro-segmentation |
| **Layer 4** | Transit | IPsec, MACsec, encrypted WAN |
| **Layer 5** | Perimeter | Firewall, IPS, Web Proxy |
| **Layer 6** | Data Center | Segmentation, workload protection |
| **Layer 7** | Application | WAF, API security |
| **Layer 8** | Visibility | SIEM, Stealthwatch, threat detection |

---

## 3.2 ISE Policy Design

### 3.2.1 Authentication Policy

**Authentication Policy Sets:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ISE AUTHENTICATION POLICY SETS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Policy Set: WIRED-ACCESS                                                   │
│  ─────────────────────────                                                  │
│  Condition: DEVICE:Device Type EQUALS All Device Types AND                  │
│             Radius:Service-Type EQUALS Call-Check                           │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Rule Name              │ Condition                │ Identity Store │    │
│  ├────────────────────────┼──────────────────────────┼────────────────┤    │
│  │ DOT1X-EAP-TLS          │ EAP-TLS                  │ AD-Corp        │    │
│  │ DOT1X-PEAP             │ PEAP                     │ AD-Corp        │    │
│  │ MAB-Profiled           │ MAB AND Profiled         │ Internal EPs   │    │
│  │ MAB-Unknown            │ MAB AND NOT Profiled     │ Internal EPs   │    │
│  │ Default                │ (Catch-all)              │ Deny Access    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Policy Set: WIRELESS-ACCESS                                                │
│  ───────────────────────────                                                │
│  Condition: DEVICE:Device Type EQUALS Wireless AND                          │
│             Radius:Called-Station-ID CONTAINS SSID                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Rule Name              │ Condition                │ Identity Store │    │
│  ├────────────────────────┼──────────────────────────┼────────────────┤    │
│  │ CORP-SECURE-EAP        │ SSID=Corp-Secure         │ AD-Corp        │    │
│  │ CORP-GUEST-WEB         │ SSID=Corp-Guest          │ Guest Portal   │    │
│  │ CORP-IOT-PSK           │ SSID=Corp-IoT            │ Internal EPs   │    │
│  │ Default                │ (Catch-all)              │ Deny Access    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  Policy Set: VPN-ACCESS                                                     │
│  ───────────────────────                                                    │
│  Condition: Tunnel-Type EQUALS VPN                                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Rule Name              │ Condition                │ Identity Store │    │
│  ├────────────────────────┼──────────────────────────┼────────────────┤    │
│  │ ANYCONNECT-MFA         │ EAP-TLS + MFA            │ AD + DUO       │    │
│  │ Default                │ (Catch-all)              │ Deny Access    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2.2 Authorization Policy

**Authorization Policy Matrix:**

| Policy Name | Condition | Result | SGT |
|-------------|-----------|--------|-----|
| **Employee-Full** | AD:memberOf=Domain Users AND Posture=Compliant | PERMIT | SGT-EMPLOYEES (10) |
| **Employee-Limited** | AD:memberOf=Domain Users AND Posture=Non-Compliant | PERMIT (Limited) | SGT-QUARANTINE (999) |
| **Executive-Full** | AD:memberOf=Executives AND Posture=Compliant | PERMIT | SGT-EXECUTIVES (11) |
| **Contractor** | AD:memberOf=Contractors | PERMIT (Limited) | SGT-CONTRACTORS (15) |
| **VoIP-Phones** | Profiled:Cisco-IP-Phone | PERMIT | SGT-VOICE (20) |
| **Printers** | Profiled:Printer | PERMIT | SGT-PRINTERS (30) |
| **Guest-Sponsored** | Guest:Sponsored AND Terms=Accepted | PERMIT | SGT-GUESTS (40) |
| **IoT-Sensor** | Profiled:IoT-Sensor | PERMIT | SGT-IOT-SENSORS (50) |
| **OT-Device** | Profiled:OT-Industrial | PERMIT | SGT-OT-DEVICES (60) |
| **Camera** | Profiled:IP-Camera | PERMIT | SGT-CAMERAS (70) |
| **Default-Deny** | (Catch-all) | DENY | N/A |

### 3.2.3 ISE Authorization Profile Configuration

**Example: Employee-Full Authorization Profile**

```
! ============================================================
! ISE AUTHORIZATION PROFILE: EMPLOYEE-FULL
! ============================================================

Authorization Profile: Employee-Full-Access
├── Access Type: ACCESS_ACCEPT
├── Common Tasks:
│   ├── VLAN: (Dynamic - from fabric)
│   ├── DACL: (None - SGT-based)
│   └── SGT: Employees (Tag Value: 10)
│
├── Advanced Attributes:
│   ├── cisco-av-pair: cts:security-group-tag=0010-00
│   ├── cisco-av-pair: cts:sgt-name=Employees
│   └── cisco-av-pair: cts:vn=VN_CORPORATE
│
└── Reauthentication:
    ├── Timer: 28800 seconds (8 hours)
    └── Connectivity: RADIUS-Request
```

**Example: Quarantine Authorization Profile**

```
! ============================================================
! ISE AUTHORIZATION PROFILE: QUARANTINE
! ============================================================

Authorization Profile: Quarantine-Access
├── Access Type: ACCESS_ACCEPT
├── Common Tasks:
│   ├── VLAN: QUARANTINE_VLAN
│   ├── DACL: QUARANTINE-DACL
│   └── SGT: Quarantine (Tag Value: 999)
│
├── DACL: QUARANTINE-DACL
│   ├── permit udp any eq bootpc any eq bootps
│   ├── permit udp any any eq domain
│   ├── permit tcp any host 10.252.100.50 eq 8443 (Remediation portal)
│   └── deny ip any any
│
└── Web Redirection:
    ├── Type: Client Provisioning (Posture)
    ├── Portal: Posture-Remediation-Portal
    └── ACL: POSTURE-REDIRECT
```

---

## 3.3 Micro-Segmentation Design

### 3.3.1 SGT-Based Segmentation Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SGACL ENFORCEMENT MATRIX                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │        │ EMP  │ EXEC │ CONT │ VOICE│ PRNT │GUEST │ IOT  │ CAM  │SRV-P│   │
│  │        │ (10) │ (11) │ (15) │ (20) │ (30) │ (40) │ (50) │ (70) │ (80)│   │
│  ├────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────┤   │
│  │EMP (10)│  ──  │  ──  │  ──  │ VOICE│PRINT │  X   │  X   │  X   │ SRV │   │
│  ├────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────┤   │
│  │EXEC(11)│  ──  │  ──  │  ──  │ VOICE│PRINT │  X   │  X   │ VIEW │ SRV │   │
│  ├────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────┤   │
│  │CONT(15)│  X   │  X   │  ──  │ VOICE│PRINT │  X   │  X   │  X   │ DEV │   │
│  ├────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────┤   │
│  │VOICE(20│VOICE │VOICE │VOICE │  ──  │  X   │  X   │  X   │  X   │ UC  │   │
│  ├────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────┤   │
│  │PRNT(30)│  X   │  X   │  X   │  X   │  ──  │  X   │  X   │  X   │PRNT │   │
│  ├────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────┤   │
│  │GUEST(40│  X   │  X   │  X   │  X   │  X   │ INET │  X   │  X   │  X  │   │
│  ├────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────┤   │
│  │IOT (50)│  X   │  X   │  X   │  X   │  X   │  X   │  ──  │  X   │ IOT │   │
│  ├────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────┤   │
│  │CAM (70)│  X   │VIEW  │  X   │  X   │  X   │  X   │  X   │  ──  │ NVR │   │
│  ├────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────┤   │
│  │QUAR(999│REMED │REMED │REMED │  X   │  X   │  X   │  X   │  X   │  X  │   │
│  └────────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴─────┘   │
│                                                                             │
│  LEGEND:                                                                    │
│  ──  = Same SGT (no policy needed)                                          │
│  X   = DENY ALL (implicit)                                                  │
│  VOICE = Voice protocols only (SIP, RTP)                                    │
│  PRINT = Print protocols only (9100, IPP, LPD)                              │
│  SRV   = Server access (HTTP, HTTPS, SSH, RDP)                              │
│  DEV   = Dev servers only (limited)                                         │
│  UC    = Unified Comm servers (CUCM, Unity)                                 │
│  INET  = Internet only (via proxy)                                          │
│  IOT   = IoT platform only                                                  │
│  VIEW  = RTSP view only                                                     │
│  NVR   = NVR server only                                                    │
│  REMED = Remediation portal only                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3.2 SGACL Definitions

**SGACL: Employee to Server**

```
! ============================================================
! SGACL: EMPLOYEES-TO-SERVERS
! Source: SGT-EMPLOYEES (10)
! Destination: SGT-SERVERS-PROD (80)
! ============================================================

ip access-list role-based EMPLOYEES-TO-SERVERS
 remark Allow standard server access
 permit tcp any any eq 22       ! SSH
 permit tcp any any eq 443      ! HTTPS
 permit tcp any any eq 3389     ! RDP
 permit tcp any any eq 445      ! SMB
 permit tcp any any eq 1433     ! MSSQL
 permit tcp any any eq 3306     ! MySQL
 permit tcp any any eq 8443     ! App servers
 permit icmp any any            ! ICMP for diagnostics
 deny ip any any log            ! Deny and log all else
```

**SGACL: Voice Endpoints**

```
! ============================================================
! SGACL: VOICE-TO-UC-SERVERS
! Source: SGT-VOICE (20)
! Destination: SGT-SERVERS-PROD (80)
! ============================================================

ip access-list role-based VOICE-TO-UC-SERVERS
 remark Allow voice protocols only
 permit tcp any any eq 2000     ! SCCP
 permit tcp any any eq 2443     ! SCCP Secure
 permit tcp any any range 5060 5061  ! SIP
 permit udp any any range 5060 5061  ! SIP UDP
 permit udp any any range 16384 32767 ! RTP media
 permit tcp any any eq 8443     ! CUCM admin
 permit tcp any any eq 6970     ! TFTP
 permit udp any any eq 69       ! TFTP
 deny ip any any log
```

**SGACL: Guest Internet Only**

```
! ============================================================
! SGACL: GUESTS-TO-INTERNET
! Source: SGT-GUESTS (40)
! Destination: UNKNOWN (egress to internet)
! ============================================================

ip access-list role-based GUESTS-TO-INTERNET
 remark Allow internet access via proxy
 permit tcp any host 10.100.100.10 eq 8080  ! Web proxy
 permit tcp any host 10.100.100.10 eq 443   ! HTTPS proxy
 permit udp any any eq 53                    ! DNS
 deny ip any 10.0.0.0 0.255.255.255 log     ! Block RFC1918
 deny ip any 172.16.0.0 0.15.255.255 log
 deny ip any 192.168.0.0 0.0.255.255 log
 deny ip any any log
```

**SGACL: Quarantine Remediation**

```
! ============================================================
! SGACL: QUARANTINE-REMEDIATION
! Source: SGT-QUARANTINE (999)
! Destination: Any
! ============================================================

ip access-list role-based QUARANTINE-REMEDIATION
 remark Allow remediation only
 permit udp any any eq 53                    ! DNS
 permit udp any any eq 67                    ! DHCP
 permit tcp any host 10.252.100.50 eq 8443   ! ISE remediation
 permit tcp any host 10.252.100.50 eq 8905   ! Posture agent
 permit tcp any host 10.100.50.10 eq 443     ! Patch server
 deny ip any any log
```

---

## 3.4 802.1X Deployment

### 3.4.1 Wired 802.1X Configuration

**Fabric Edge Switch Configuration:**

```
! ============================================================
! 802.1X GLOBAL CONFIGURATION - FABRIC EDGE
! ============================================================

! AAA Configuration
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa authorization auth-proxy default group radius
aaa accounting dot1x default start-stop group radius
aaa accounting update newinfo periodic 2880

! 802.1X Global Settings
dot1x system-auth-control
dot1x critical eapol

! RADIUS Server Configuration
radius server ISE-PSN-1
 address ipv4 10.252.11.10 auth-port 1812 acct-port 1813
 timeout 5
 retransmit 2
 key 7 <encrypted-key>

radius server ISE-PSN-2
 address ipv4 10.252.11.11 auth-port 1812 acct-port 1813
 timeout 5
 retransmit 2
 key 7 <encrypted-key>

aaa group server radius ISE-SERVERS
 server name ISE-PSN-1
 server name ISE-PSN-2
 load-balance method least-outstanding

! RADIUS Attributes
radius-server attribute 6 on-for-login-auth
radius-server attribute 8 include-in-access-req
radius-server attribute 25 access-request include
radius-server attribute 31 mac format ietf upper-case
radius-server attribute 31 send nas-port-detail mac-only
radius-server dead-criteria time 10 tries 3
radius-server deadtime 3

! Device Tracking for IP-SGT Binding
device-tracking upgrade-cli force
device-tracking policy IPDT-POLICY
 tracking enable

! ============================================================
! 802.1X INTERFACE CONFIGURATION
! ============================================================

interface GigabitEthernet1/0/1
 description USER-ACCESS-PORT
 switchport mode access
 switchport access vlan 100
 
 ! Device Tracking
 device-tracking attach-policy IPDT-POLICY
 
 ! 802.1X Configuration
 authentication event fail action next-method
 authentication event server dead action authorize vlan 999
 authentication event server alive action reinitialize
 authentication host-mode multi-auth
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 authentication violation restrict
 
 ! MAB Configuration
 mab
 
 ! 802.1X Port
 dot1x pae authenticator
 dot1x timeout tx-period 10
 
 ! Spanning Tree
 spanning-tree portfast edge

! ============================================================
! CRITICAL VLAN CONFIGURATION
! ============================================================

interface Vlan999
 description CRITICAL-AUTH-VLAN
 ip address 10.199.0.1 255.255.255.0
 ip helper-address 10.100.1.10
```

### 3.4.2 Phased 802.1X Deployment Approach

| Phase | Mode | Description | Duration |
|-------|------|-------------|----------|
| **Phase 1** | Monitor Mode | Log only, no enforcement | 4 weeks |
| **Phase 2** | Low Impact Mode | Permit with logging | 4 weeks |
| **Phase 3** | Closed Mode | Full enforcement with fallback | 2 weeks |
| **Phase 4** | Production | Full enforcement | Ongoing |

**Phase 1: Monitor Mode Configuration**

```
! Monitor mode - log authentication attempts, no enforcement
interface range GigabitEthernet1/0/1-48
 authentication open
 authentication event fail action authorize vlan 100
 authentication event server dead action authorize vlan 100
 authentication event no-response action authorize vlan 100
```

**Phase 3: Closed Mode with Fallback**

```
! Closed mode with critical VLAN fallback
interface range GigabitEthernet1/0/1-48
 no authentication open
 authentication event fail action authorize vlan 999
 authentication event server dead action authorize vlan 999
 authentication event no-response action authorize vlan 999
```

---

## 3.5 Profiling Design

### 3.5.1 Profiling Policy Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ISE PROFILING HIERARCHY                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     CISCO SYSTEMS                                   │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │                 CISCO IP PHONES                             │    │    │
│  │  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │    │    │
│  │  │  │ Cisco 8800  │ │ Cisco 7800  │ │ Webex Desk  │            │    │    │
│  │  │  │ Series      │ │ Series      │ │ Pro         │            │    │    │
│  │  │  └─────────────┘ └─────────────┘ └─────────────┘            │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │                 CISCO ACCESS POINTS                         │    │    │
│  │  │  ┌─────────────┐ ┌─────────────┐                            │    │    │
│  │  │  │ Cisco 9130  │ │ Cisco 9120  │                            │    │    │
│  │  │  │ APs         │ │ APs         │                            │    │    │
│  │  │  └─────────────┘ └─────────────┘                            │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     PRINTERS                                        │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                    │    │
│  │  │ HP Printers │ │ Canon       │ │ Xerox       │                    │    │
│  │  │             │ │ Printers    │ │ Printers    │                    │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     IOT DEVICES                                     │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                    │    │
│  │  │ IP Cameras  │ │ Building    │ │ HVAC        │                    │    │
│  │  │ (Axis, Hikvision)│ │ Sensors│ │ Controllers │                   │    │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  PROFILING PROBES:                                                          │
│  ─────────────────                                                          │
│  • RADIUS (CoA, accounting)                                                 │
│  • DHCP (options 55, 60)                                                    │
│  • HTTP (User-Agent)                                                        │
│  • DNS (reverse lookup)                                                     │
│  • SNMP (OID query)                                                         │
│  • NetFlow (traffic patterns)                                               │
│  • NMAP (active scan - limited)                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.5.2 Custom Profiling Rules

**IP Phone Profiling (Enhanced):**

```
Profiling Policy: Cisco-IP-Phone-Enhanced
├── Condition Group (AND):
│   ├── DHCP:dhcp-class-identifier CONTAINS "Cisco Systems"
│   ├── OR
│   │   ├── MAC:OUI = 00:00:0C (Cisco)
│   │   ├── MAC:OUI = B4:14:89 (Cisco)
│   │   └── MAC:OUI = 58:BC:27 (Cisco)
│   └── AND
│       └── DHCP:host-name CONTAINS "SEP"
│
├── Certainty Factor: 70
├── Minimum Certainty: 20
└── Parent Profile: Cisco-Device
```

**IoT Sensor Profiling:**

```
Profiling Policy: IoT-Building-Sensor
├── Condition Group (AND):
│   ├── DHCP:dhcp-class-identifier CONTAINS "sensor"
│   │   OR DHCP:vendor-class-identifier CONTAINS "BACnet"
│   ├── AND
│   │   ├── HTTP:User-Agent CONTAINS "Sensor"
│   │   │   OR DNS:hostname MATCHES "sensor*"
│   └── AND
│       └── NetFlow:protocol = UDP:47808 (BACnet)
│
├── Certainty Factor: 30
├── Minimum Certainty: 50
└── Parent Profile: IoT-Device
```

---

## 3.6 Firewall Integration

### 3.6.1 Firewall Architecture with SGT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FIREWALL SGT INTEGRATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      SD-ACCESS FABRIC                                 │  │
│  │                                                                       │  │
│  │   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐     │  │
│  │   │ Fabric Edge │ ──────► │ Border Node │ ──────► │   FTD/FMC   │     │  │
│  │   │             │  VXLAN  │  (SGT inline)│  SXP   │  (SGT-aware)│     │  │
│  │   │ SGT: 10     │         │             │         │             │     │  │
│  │   └─────────────┘         └─────────────┘         └─────────────┘     │  │
│  │                                                          │            │  │
│  └──────────────────────────────────────────────────────────┼────────────┘  │
│                                                             │               │
│                                                             │ SXP           │
│                                                             │               │
│  ┌──────────────────────────────────────────────────────────┼────────────┐  │
│  │                           ISE (pxGrid)                   │            │  │
│  │                                                          │            │  │
│  │   SGT-IP Mappings ◄─────────────────────────────────────►│            │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  SXP FLOW:                                                                  │
│  ─────────                                                                  │
│  1. Endpoint authenticates → ISE assigns SGT                                │
│  2. ISE publishes SGT-IP mapping to pxGrid                                  │
│  3. Border node learns mapping via SXP                                      │
│  4. FTD learns mapping via SXP (from ISE or Border)                         │
│  5. FTD applies SGT-based policies                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.6.2 FTD SGT-Based Access Policy

**Firewall Policy Rules (FMC):**

| Rule | Source SGT | Destination | Action | Logging |
|------|------------|-------------|--------|---------|
| **Allow-Employee-Internet** | SGT-EMPLOYEES (10) | any-ipv4 | Allow | End |
| **Allow-Guest-Internet** | SGT-GUESTS (40) | any-ipv4 (via proxy) | Allow | End |
| **Deny-Guest-Internal** | SGT-GUESTS (40) | RFC1918 | Block | Start/End |
| **Allow-IoT-Platform** | SGT-IOT-SENSORS (50) | IoT-Platform-IP | Allow | End |
| **Deny-IoT-Internet** | SGT-IOT-SENSORS (50) | any-ipv4 | Block | Start/End |
| **Allow-Camera-NVR** | SGT-CAMERAS (70) | NVR-Servers | Allow | None |
| **Block-Quarantine** | SGT-QUARANTINE (999) | any | Block | Start/End |

### 3.6.3 SXP Configuration

**Border Node SXP Configuration:**

```
! ============================================================
! SXP CONFIGURATION - BORDER NODE
! ============================================================

! Enable CTS
cts credentials id BORDER-01 password 0 <cts-password>
cts role-based enforcement

! SXP Connection to ISE
cts sxp enable
cts sxp default password <sxp-password>
cts sxp default source-ip 10.250.1.1
cts sxp connection peer 10.252.10.10 password default mode local speaker
cts sxp connection peer 10.252.10.11 password default mode local speaker

! SXP Connection to FTD (listener)
cts sxp connection peer 10.100.50.1 password default mode local speaker
cts sxp connection peer 10.100.50.2 password default mode local speaker

! Verify
! show cts sxp connections brief
! show cts role-based sgt-map all
```

**FTD SXP Configuration (via FMC):**

```
Devices > Device Management > [FTD] > Routing > Identity Services

SXP Settings:
├── Enable SXP: Yes
├── Default Password: ********
├── Reconciliation Period: 120 seconds
├── Retry Period: 120 seconds
│
├── SXP Peers:
│   ├── Peer: 10.252.10.10 (ISE PAN)
│   │   Mode: Listener
│   │   Status: On
│   │
│   ├── Peer: 10.252.10.11 (ISE PSN)
│   │   Mode: Listener
│   │   Status: On
│   │
│   └── Peer: 10.250.1.1 (Border Node)
│       Mode: Listener
│       Status: On
```

---

## 3.7 Compliance Requirements

### 3.7.1 Compliance Framework Mapping

| Requirement | Standard | SD-Access Control | Evidence |
|-------------|----------|-------------------|----------|
| **Network Segmentation** | PCI-DSS 1.3 | Virtual Networks, SGT | DNAC Network Hierarchy |
| **Access Control** | PCI-DSS 7.1 | ISE Authorization | ISE Policy Reports |
| **Authentication** | PCI-DSS 8.1 | 802.1X, MFA | ISE Authentication Logs |
| **Encryption** | PCI-DSS 4.1 | VXLAN, MACsec, TLS | Encryption Config |
| **Logging** | PCI-DSS 10.1 | ISE, DNAC Logs | SIEM Integration |
| **Vulnerability Mgmt** | PCI-DSS 6.1 | Posture Assessment | ISE Posture Reports |
| **Data Protection** | GDPR Art. 32 | Encryption, Access Control | Data Flow Diagrams |
| **Audit Trail** | SOC2 CC6.1 | Centralized Logging | Log Retention Policy |

### 3.7.2 PCI-DSS Cardholder Data Environment (CDE)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PCI-DSS NETWORK SEGMENTATION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    CARDHOLDER DATA ENVIRONMENT                      │    │
│  │                         VN_PCI (Separate VN)                        │    │
│  │                                                                     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │    │
│  │  │ Payment     │  │ POS         │  │ Card Data   │                 │    │
│  │  │ Terminals   │  │ Systems     │  │ Storage     │                 │    │
│  │  │ SGT: 100    │  │ SGT: 101    │  │ SGT: 102    │                 │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │    │
│  │                                                                     │    │
│  │  SGACL: Only PCI-authorized traffic permitted                       │    │
│  │  Firewall: Additional L7 inspection                                 │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    │ L3 Firewall Inspection                 │
│                                    │ (All traffic logged)                   │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    CORPORATE NETWORK                                │    │
│  │                         VN_CORPORATE                                │    │
│  │                                                                     │    │
│  │  No direct access to CDE                                            │    │
│  │  Jump server required for admin access                              │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  CONTROLS:                                                                  │
│  ─────────                                                                  │
│  • Separate Virtual Network for CDE                                         │
│  • Dedicated SGTs for payment systems                                       │
│  • SGACL blocks all unauthorized traffic                                    │
│  • Firewall with IPS/IDS for L7 inspection                                  │
│  • All traffic logged and sent to SIEM                                      │
│  • MFA required for all CDE access                                          │
│  • Quarterly ASV scans                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.8 Encryption Design

### 3.8.1 Encryption at Each Layer

| Layer | Protocol | Key Size | Use Case |
|-------|----------|----------|----------|
| **Underlay P2P** | MACsec (802.1AE) | 256-bit AES-GCM | Inter-switch links |
| **Overlay Data** | VXLAN (native) | None (L2 transport) | Standard traffic |
| **Overlay Secure** | VXLAN + IPsec | 256-bit AES | Sensitive VN |
| **WAN Transit** | IPsec/DTLS | 256-bit AES | SD-WAN tunnels |
| **Management** | TLS 1.2+ | 256-bit AES | DNAC, ISE GUI |
| **RADIUS** | RadSec (TLS) | 256-bit AES | AAA traffic |

### 3.8.2 MACsec Configuration

**MACsec Configuration (Fabric Links):**

```
! ============================================================
! MACsec CONFIGURATION - INTER-SWITCH LINKS
! ============================================================

! Enable MKA (MACsec Key Agreement)
mka policy MKA-256
 key-server priority 0
 macsec-cipher-suite gcm-aes-256
 confidentiality-offset 0

! Interface Configuration
interface TenGigabitEthernet1/0/1
 description TO-CP-NODE-1-MACSEC
 no switchport
 ip address 10.251.1.0 255.255.255.254
 
 ! MACsec Configuration
 mka policy MKA-256
 mka pre-shared-key key-chain MACSEC-KEYS
 macsec
 macsec replay-protection window-size 64

! Key Chain for MACsec
key chain MACSEC-KEYS macsec
 key 01
  cryptographic-algorithm aes-256-cmac
  key-string 7 <encrypted-256bit-key>
  lifetime local 00:00:00 Jan 01 2025 duration 31536000
```

---

## 3.9 Network Admission Control

### 3.9.1 Posture Assessment Policy

**Posture Conditions:**

| Condition | Check | Remediation |
|-----------|-------|-------------|
| **AV-Installed** | AntiVirus agent installed | Install corporate AV |
| **AV-Updated** | AV signatures < 7 days | Auto-update trigger |
| **OS-Patched** | Critical patches installed | WSUS remediation |
| **FW-Enabled** | Host firewall enabled | Enable via GPO |
| **Encryption** | Disk encryption enabled | Redirect to IT portal |
| **USB-Disabled** | USB storage disabled | GPO enforcement |

**Posture Policy Flow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POSTURE ASSESSMENT FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                    │
│  │  Endpoint   │     │   Fabric    │     │     ISE     │                    │
│  │             │     │   Edge      │     │             │                    │
│  └──────┬──────┘     └──────┬──────┘     └──────┬──────┘                    │
│         │                   │                   │                           │
│         │ 1. 802.1X Auth    │                   │                           │
│         │──────────────────►│                   │                           │
│         │                   │ 2. RADIUS Request │                           │
│         │                   │──────────────────►│                           │
│         │                   │                   │                           │
│         │                   │ 3. Auth Success + │                           │
│         │                   │    Posture Redirect                           │
│         │                   │◄──────────────────│                           │
│         │                   │                   │                           │
│         │◄──────────────────│                   │                           │
│         │ 4. Redirect to    │                   │                           │
│         │    Client Prov    │                   │                           │
│         │                   │                   │                           │
│         │ 5. AnyConnect Posture Module          │                           │
│         │───────────────────────────────────────►                           │
│         │                   │                   │                           │
│         │ 6. Posture Check  │                   │                           │
│         │   (AV, Patches)   │                   │                           │
│         │                   │                   │                           │
│         │ 7. Posture Report │                   │                           │
│         │───────────────────────────────────────►                           │
│         │                   │                   │                           │
│         │                   │                   │ 8. CoA (if compliant)     │
│         │                   │◄──────────────────│    SGT: Employees (10)    │
│         │                   │                   │                           │
│         │◄──────────────────│ 9. Full Access    │                           │
│         │                   │    Granted        │                           │
│                                                                             │
│  NON-COMPLIANT PATH:                                                        │
│  • Step 8: CoA with SGT: Quarantine (999)                                   │
│  • Step 9: Limited access to remediation portal                             │
│  • User remediates issues                                                   │
│  • Re-posture assessment                                                    │
│  • If compliant → CoA to full access                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.10 Firewall Rules Summary

### 3.10.1 Perimeter Firewall Rules

| Rule # | Source | Destination | Port | Protocol | Action | Description |
|--------|--------|-------------|------|----------|--------|-------------|
| 1 | Any | DNAC Cluster VIP | 443 | TCP | Permit | DNAC GUI access |
| 2 | Any | ISE PSN | 443, 8443 | TCP | Permit | ISE portal access |
| 3 | DNAC | ISE | 9060, 443 | TCP | Permit | DNAC-ISE integration |
| 4 | ISE | AD Servers | 389, 636 | TCP | Permit | LDAP/LDAPS |
| 5 | Fabric Nodes | ISE PSN | 1812, 1813 | UDP | Permit | RADIUS |
| 6 | ISE | Fabric Nodes | Any | TCP/UDP | Permit | CoA, SXP |
| 7 | Employees | Internet | 443, 80 | TCP | Permit | Web access |
| 8 | Guests | Proxy | 8080 | TCP | Permit | Guest internet |
| 9 | Any | CDE VN | Any | Any | Deny | Block direct CDE access |
| 10 | Jump Server | CDE VN | 22, 3389 | TCP | Permit | Admin access only |

### 3.10.2 SD-WAN Transport Security Rules

**Internet Transport Security (Direct Internet Access)**

| Rule # | Source | Destination | Port | Protocol | Action | Description |
|--------|--------|-------------|------|----------|--------|-------------|
| 1 | SD-WAN Edge | vBond | 12346-12446 | UDP | Permit | DTLS control |
| 2 | SD-WAN Edge | vSmart | 12346-12446 | UDP | Permit | OMP control |
| 3 | SD-WAN Edge | vManage | 443, 8443 | TCP | Permit | Management |
| 4 | SD-WAN Edge | SD-WAN Edges | 12346-12446 | UDP | Permit | IPsec data |
| 5 | SD-WAN Edge | NTP Servers | 123 | UDP | Permit | Time sync |
| 6 | SD-WAN Edge | DNS Servers | 53 | UDP/TCP | Permit | Name resolution |
| 7 | Corp Users (DIA) | Internet | 443, 80 | TCP | Permit | Direct web (limited) |
| 8 | Guest Users | Internet | 443, 80 | TCP | Permit | Guest breakout |
| 9 | Any | SD-WAN Edge (WAN) | Any | Any | Deny | Block inbound |

**5G/LTE Transport Security**

| Rule # | Source | Destination | Port | Protocol | Action | Description |
|--------|--------|-------------|------|----------|--------|-------------|
| 1 | SD-WAN Edge | vBond | 12346-12446 | UDP | Permit | DTLS control |
| 2 | SD-WAN Edge | SD-WAN Edges | 12346-12446 | UDP | Permit | IPsec tunnels |
| 3 | Any | SD-WAN Edge (LTE) | Any | Any | Deny | Block all inbound |

**SD-WAN Control Plane Security**

| Component | Security Requirement | Implementation |
|-----------|---------------------|----------------|
| vBond | Certificate authentication | PKI with enterprise CA |
| vSmart | OMP encryption | AES-256 |
| vManage | Admin authentication | RADIUS/TACACS+ to ISE |
| Data Plane | IPsec tunnels | AES-256-GCM, IKEv2 |
| Service VPN | VRF isolation | Per-VPN routing tables |

### 3.10.3 SD-WAN Edge Firewall Zones

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SD-WAN EDGE ZONE-BASED SECURITY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                              ┌─────────────┐              │
│  │ VPN 0       │                              │ VPN 10      │              │
│  │ (Transport) │                              │ (Corporate) │              │
│  │ ┌─────────┐ │                              │ ┌─────────┐ │              │
│  │ │ MPLS    │ │◄──── IPsec Tunnels ────────►│ │ Users   │ │              │
│  │ │ Internet│ │      (Encrypted)             │ │ Servers │ │              │
│  │ │ 5G/LTE  │ │                              │ │         │ │              │
│  │ └─────────┘ │                              │ └─────────┘ │              │
│  └──────┬──────┘                              └──────┬──────┘              │
│         │                                            │                     │
│         │         Zone-Based Firewall                │                     │
│         │         (Inter-VPN Filtering)              │                     │
│         │                                            │                     │
│  ┌──────┴──────┐                              ┌──────┴──────┐              │
│  │ VPN 40      │                              │ VPN 50      │              │
│  │ (Guest)     │                              │ (IoT)       │              │
│  │             │                              │             │              │
│  │ DIA Allowed │                              │ No DIA      │              │
│  │ (Filtered)  │                              │ Cloud Only  │              │
│  └─────────────┘                              └─────────────┘              │
│                                                                             │
│  ZONE PAIR POLICIES:                                                        │
│  • VPN10 ↔ VPN10: Permit (same VPN)                                        │
│  • VPN10 → VPN0: Permit (to WAN tunnels)                                   │
│  • VPN40 → Internet: Permit with URL filtering                             │
│  • VPN50 → VPN0: Permit (cloud destinations only)                          │
│  • VPN40 → VPN10: Deny (guest isolation)                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.10.4 Branch Internet Breakout Security

For branches with Direct Internet Access (DIA):

| Security Control | Implementation | Location |
|------------------|----------------|----------|
| URL Filtering | Cisco Umbrella | Cloud |
| DNS Security | Umbrella DNS | Cloud |
| Malware Protection | Umbrella SIG | Cloud |
| IPS | UTD on SD-WAN Edge | Edge |
| SSL Inspection | Umbrella SIG | Cloud |
| DLP | Microsoft Defender | Endpoint |

**Umbrella Integration Configuration**

```yaml
# SD-WAN Edge Umbrella Integration (via vManage template)
Umbrella_Config:
  Registration_Token: <umbrella_token>
  Local_Domain_Bypass:
    - corp.local
    - internal.company.com
  DNS_Redirect: Enabled
  
# Traffic Steering for DIA
DIA_Policy:
  Match:
    - Guest VPN (40)
    - SaaS Applications (O365, Salesforce)
  Action: Local Internet Exit
  Security: Umbrella SIG
```

---

## Chapter Summary

This chapter defined the comprehensive security architecture including:

1. **Zero Trust Model**: Identity-based access with continuous verification
2. **ISE Policies**: Authentication, authorization, and profiling policies
3. **Micro-Segmentation**: 12+ SGTs with detailed SGACL policies
4. **802.1X Deployment**: Phased rollout with monitor, low-impact, and closed modes
5. **Firewall Integration**: SXP-based SGT propagation to FTD
6. **Compliance**: PCI-DSS, GDPR, SOC2 mapping
7. **Encryption**: MACsec, TLS, IPsec at various layers
8. **Posture**: Endpoint compliance assessment
9. **SD-WAN Transport Security**: Internet, 5G/LTE transport protection, zone-based firewall

**Next Step**: Proceed to [Chapter 4: Implementation & Deployment](../chapter-4-implementation/README.md) for deployment procedures.

---

> **Document Control**  
> Version: 1.0 | Last Updated: December 2025  
> Classification: Technical Design Document
