# 3.4 802.1X Deployment for SD-Access

## 3.4.1 Authentication Deployment Modes

### Phased Deployment Approach

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    802.1X PHASED DEPLOYMENT APPROACH                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   PHASE 1: MONITOR MODE (Weeks 1-4)                                             │
│   ─────────────────────────────────                                             │
│   • Authentication enabled, authorization bypassed                              │
│   • All traffic permitted regardless of auth result                             │
│   • Collect data on endpoints, authentication methods                           │
│   • Identify non-802.1X devices for MAB whitelist                              │
│   • No user impact                                                              │
│                                                                                  │
│   PHASE 2: LOW-IMPACT MODE (Weeks 5-8)                                          │
│   ────────────────────────────────────                                          │
│   • Pre-auth ACL allows critical traffic (DHCP, DNS, AD)                       │
│   • Failed auth gets limited access (not full deny)                            │
│   • Successful auth gets full access                                            │
│   • Minimal user impact                                                         │
│                                                                                  │
│   PHASE 3: CLOSED MODE (Weeks 9-10)                                             │
│   ─────────────────────────────────                                             │
│   • Full enforcement - no access without authentication                         │
│   • Critical VLAN for ISE-unreachable scenarios                                │
│   • Failed auth denied or quarantined                                          │
│   • Full security enforcement                                                   │
│                                                                                  │
│   PHASE 4: PRODUCTION (Ongoing)                                                 │
│   ────────────────────────────────                                              │
│   • Continuous monitoring and tuning                                            │
│   • Exception handling process                                                  │
│   • Periodic compliance audits                                                  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.4.2 Global AAA Configuration

### AAA Commands for Fabric Edge

```cisco
! ============================================================
! AAA GLOBAL CONFIGURATION - ALL FABRIC EDGE NODES
! ============================================================

! Enable AAA
aaa new-model

! Authentication Methods
aaa authentication dot1x default group radius
aaa authentication login default local
aaa authentication login CONSOLE none

! Authorization Methods  
aaa authorization network default group radius
aaa authorization auth-proxy default group radius
aaa authorization configuration default group radius

! Accounting Methods
aaa accounting dot1x default start-stop group radius
aaa accounting update newinfo periodic 2880
aaa accounting identity default start-stop group radius

! Enable 802.1X globally
dot1x system-auth-control
dot1x critical eapol

! RADIUS Server Configuration
radius server ISE-PSN-1
 address ipv4 10.252.31.11 auth-port 1812 acct-port 1813
 timeout 5
 retransmit 2
 key 7 <encrypted-key>

radius server ISE-PSN-2
 address ipv4 10.252.31.12 auth-port 1812 acct-port 1813
 timeout 5
 retransmit 2
 key 7 <encrypted-key>

! RADIUS Server Group
aaa group server radius ISE-SERVERS
 server name ISE-PSN-1
 server name ISE-PSN-2
 ip radius source-interface Loopback0
 load-balance method least-outstanding

! RADIUS Attributes
radius-server attribute 6 on-for-login-auth
radius-server attribute 8 include-in-access-req
radius-server attribute 25 access-request include
radius-server attribute 31 mac format ietf upper-case
radius-server attribute 31 send nas-port-detail mac-only
radius-server dead-criteria time 10 tries 3
radius-server deadtime 3
radius-server vsa send authentication
radius-server vsa send accounting

! CoA (Change of Authorization)
aaa server radius dynamic-author
 client 10.252.31.11 server-key <coa-key>
 client 10.252.31.12 server-key <coa-key>
 port 1700
 auth-type any
```

---

## 3.4.3 Device Tracking Configuration

### IP Device Tracking (IPDT)

```cisco
! ============================================================
! DEVICE TRACKING CONFIGURATION
! ============================================================

! Upgrade to new-style device tracking
device-tracking upgrade-cli force

! Device Tracking Policy
device-tracking policy IPDT-POLICY
 tracking enable
 limit address-count 10
 security-level glean
 no protocol udp
 no protocol ndp

! Device Tracking for DHCP Snooping
ip dhcp snooping
ip dhcp snooping vlan 100-199
no ip dhcp snooping information option

! Apply to interfaces
interface range GigabitEthernet1/0/1-48
 device-tracking attach-policy IPDT-POLICY
 ip dhcp snooping limit rate 100
```

---

## 3.4.4 Phase 1: Monitor Mode Configuration

### Monitor Mode Interface Template

```cisco
! ============================================================
! PHASE 1: MONITOR MODE - LEARNING PHASE
! ============================================================
! Purpose: Log all authentication attempts, permit all traffic
! Duration: 4 weeks minimum
! Impact: None - all traffic permitted

interface GigabitEthernet1/0/1
 description USER-PORT-MONITOR-MODE
 switchport mode access
 switchport access vlan 100
 
 ! Device Tracking
 device-tracking attach-policy IPDT-POLICY
 
 ! Authentication Configuration
 authentication event fail action authorize vlan 100
 authentication event server dead action authorize vlan 100
 authentication event server dead action authorize voice
 authentication event server alive action reinitialize
 authentication event no-response action authorize vlan 100
 authentication host-mode multi-auth
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 authentication timer inactivity 3600
 authentication violation restrict
 
 ! MAB Configuration
 mab
 
 ! 802.1X Configuration
 dot1x pae authenticator
 dot1x timeout tx-period 10
 dot1x timeout supp-timeout 10
 dot1x max-reauth-req 2
 
 ! Device Sensor for Profiling
 snmp trap mac-notification change added
 snmp trap mac-notification change removed
 
 ! Spanning Tree
 spanning-tree portfast edge
 spanning-tree bpduguard enable
```

### Monitor Mode Validation

```cisco
! Verify authentication attempts
show authentication sessions

! Check authentication method used
show authentication sessions interface Gi1/0/1 details

! Review failed authentications
show authentication sessions | include Failed

! Check RADIUS statistics
show aaa servers

! Analyze for profiling
show device-tracking database
```

---

## 3.4.5 Phase 2: Low-Impact Mode Configuration

### Pre-Authentication ACL

```cisco
! ============================================================
! PRE-AUTHENTICATION ACL FOR LOW-IMPACT MODE
! ============================================================

! ACL applied before authentication completes
ip access-list extended ACL-PRE-AUTH
 remark Allow DHCP
 permit udp any eq bootpc any eq bootps
 remark Allow DNS
 permit udp any any eq domain
 remark Allow TFTP for IP phones
 permit udp any any eq tftp
 remark Allow ping
 permit icmp any any
 remark Allow AD Authentication
 permit tcp any host 10.252.1.50 eq 88
 permit tcp any host 10.252.1.51 eq 88
 permit udp any host 10.252.1.50 eq 88
 permit udp any host 10.252.1.51 eq 88
 permit tcp any host 10.252.1.50 eq 389
 permit tcp any host 10.252.1.51 eq 389
 remark Deny all other
 deny ip any any

! Default ACL for authenticated users (if no dACL from ISE)
ip access-list extended ACL-DEFAULT-PERMIT
 permit ip any any
```

### Low-Impact Mode Interface Template

```cisco
! ============================================================
! PHASE 2: LOW-IMPACT MODE
! ============================================================
! Purpose: Pre-auth ACL permits critical traffic
! Duration: 4 weeks
! Impact: Minimal - failed auth gets limited access

interface GigabitEthernet1/0/1
 description USER-PORT-LOW-IMPACT-MODE
 switchport mode access
 switchport access vlan 100
 
 ! Device Tracking
 device-tracking attach-policy IPDT-POLICY
 
 ! Pre-Authentication ACL (Low-Impact)
 ip access-group ACL-PRE-AUTH in
 
 ! Authentication Configuration
 authentication event fail action authorize vlan 100
 authentication event server dead action authorize vlan 999
 authentication event server dead action authorize voice
 authentication event server alive action reinitialize
 authentication event no-response action authorize vlan 100
 authentication host-mode multi-auth
 authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 authentication violation restrict
 
 ! MAB Fallback
 mab
 
 ! 802.1X
 dot1x pae authenticator
 dot1x timeout tx-period 10
 
 ! Spanning Tree
 spanning-tree portfast edge
 spanning-tree bpduguard enable
```

---

## 3.4.6 Phase 3: Closed Mode Configuration

### Closed Mode Interface Template

```cisco
! ============================================================
! PHASE 3: CLOSED MODE - FULL ENFORCEMENT
! ============================================================
! Purpose: No access without successful authentication
! Duration: Ongoing production
! Impact: Full - failed auth denied

interface GigabitEthernet1/0/1
 description USER-PORT-CLOSED-MODE
 switchport mode access
 switchport access vlan 100
 
 ! Device Tracking
 device-tracking attach-policy IPDT-POLICY
 
 ! NO Pre-Auth ACL (Closed Mode)
 no ip access-group ACL-PRE-AUTH in
 
 ! Authentication Configuration - CLOSED
 authentication event fail action authorize vlan 999
 authentication event server dead action authorize vlan 999
 authentication event server dead action authorize voice
 authentication event server alive action reinitialize
 authentication event no-response action authorize vlan 999
 authentication host-mode multi-auth
 no authentication open
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 authentication violation restrict
 
 ! MAB Fallback
 mab
 
 ! 802.1X
 dot1x pae authenticator
 dot1x timeout tx-period 10
 
 ! Spanning Tree
 spanning-tree portfast edge
 spanning-tree bpduguard enable
```

### Critical VLAN Configuration

```cisco
! ============================================================
! CRITICAL VLAN (ISE Unreachable Scenario)
! ============================================================

! VLAN Definition
vlan 999
 name CRITICAL-AUTH

! SVI for Critical VLAN
interface Vlan999
 description CRITICAL-AUTH-VLAN
 ip address 10.199.0.1 255.255.255.0
 ip helper-address 10.252.1.40
 no shutdown

! Critical Authentication ACL
ip access-list extended ACL-CRITICAL
 remark Allow DHCP
 permit udp any eq bootpc any eq bootps
 remark Allow DNS
 permit udp any any eq domain
 remark Allow ISE for re-auth when available
 permit ip any host 10.252.31.11
 permit ip any host 10.252.31.12
 remark Deny all other
 deny ip any any log
```

---

## 3.4.7 Multi-Domain Authentication (Voice + Data)

### Voice VLAN Configuration

```cisco
! ============================================================
! MULTI-DOMAIN AUTHENTICATION (MDA) FOR VOICE + DATA
! ============================================================

interface GigabitEthernet1/0/1
 description USER-PORT-WITH-PHONE
 switchport mode access
 switchport access vlan 100
 switchport voice vlan 200
 
 ! Device Tracking
 device-tracking attach-policy IPDT-POLICY
 
 ! Multi-Domain Host Mode
 authentication host-mode multi-domain
 
 ! Authentication Order and Priority
 authentication order dot1x mab
 authentication priority dot1x mab
 
 ! Authentication Control
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 
 ! Event Actions
 authentication event fail action authorize vlan 999
 authentication event server dead action authorize vlan 999
 authentication event server dead action authorize voice
 authentication event server alive action reinitialize
 authentication event no-response action authorize vlan 999
 
 ! Domain Control
 authentication violation restrict
 
 ! MAB for phones that don't support 802.1X
 mab
 
 ! 802.1X
 dot1x pae authenticator
 dot1x timeout tx-period 10
 
 ! Spanning Tree
 spanning-tree portfast edge
 spanning-tree bpduguard enable

! Voice VLAN
vlan 200
 name VOICE

interface Vlan200
 description VOICE-VLAN
 ip address 10.200.0.1 255.255.255.0
 ip helper-address 10.252.1.40
```

---

## 3.4.8 Multi-Auth Mode (Multiple Devices per Port)

### Multi-Auth Configuration

```cisco
! ============================================================
! MULTI-AUTH MODE (IP Phones, Hubs, Multiple Devices)
! ============================================================

interface GigabitEthernet1/0/1
 description USER-PORT-MULTI-AUTH
 switchport mode access
 switchport access vlan 100
 switchport voice vlan 200
 
 ! Multi-Auth Host Mode (multiple data + one voice)
 authentication host-mode multi-auth
 
 ! Authentication Settings
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 
 ! Events
 authentication event fail action authorize vlan 999
 authentication event server dead action authorize vlan 999
 authentication event server dead action authorize voice
 authentication event server alive action reinitialize
 
 ! Violation handling
 authentication violation restrict
 
 ! MAB
 mab
 
 ! 802.1X
 dot1x pae authenticator
 dot1x timeout tx-period 10
```

---

## 3.4.9 IBNS 2.0 / C3PL Configuration (Modern Approach)

### Service Template Configuration

```cisco
! ============================================================
! IBNS 2.0 / C3PL (Cisco Common Classification Policy Language)
! Modern approach using service templates and policy maps
! ============================================================

! Class Maps for Matching
class-map type control subscriber match-all AAA-DOWN
 match result-type aaa-timeout

class-map type control subscriber match-all DOT1X-FAILED
 match method dot1x
 match result-type method dot1x authoritative

class-map type control subscriber match-all MAB-FAILED  
 match method mab
 match result-type method mab authoritative

class-map type control subscriber match-all DOT1X-SUCCESS
 match method dot1x
 match result-type method dot1x success

class-map type control subscriber match-all MAB-SUCCESS
 match method mab
 match result-type method mab success

class-map type control subscriber match-all IN-CRITICAL-VLAN
 match current-method-priority gt 0

! Policy Map for Authentication
policy-map type control subscriber DOT1X-MAB-POLICY
 event session-started match-all
  10 class always do-until-failure
   10 authenticate using dot1x priority 10
 event authentication-failure match-first
  10 class DOT1X-FAILED do-until-failure
   10 authenticate using mab priority 20
  20 class MAB-FAILED do-until-failure
   10 terminate dot1x
   20 authenticate using mab priority 20
  30 class AAA-DOWN do-until-failure
   10 activate service-template CRITICAL-AUTH
   20 authorize
   30 pause reauthentication
 event authentication-success match-all
  10 class always do-until-failure
   10 activate service-template DEFAULT-ACCESS
 event aaa-available match-all
  10 class IN-CRITICAL-VLAN do-until-failure
   10 clear-session
 event agent-found match-all
  10 class always do-until-failure
   10 authenticate using dot1x priority 10

! Service Templates
service-template CRITICAL-AUTH
 vlan 999
 access-group ACL-CRITICAL

service-template DEFAULT-ACCESS
 access-group ACL-DEFAULT-PERMIT

! Apply to Interface
interface GigabitEthernet1/0/1
 description USER-PORT-IBNS2
 switchport mode access
 switchport access vlan 100
 switchport voice vlan 200
 device-tracking attach-policy IPDT-POLICY
 access-session port-control auto
 access-session closed
 access-session host-mode multi-auth
 authentication periodic
 authentication timer reauthenticate server
 mab
 dot1x pae authenticator
 dot1x timeout tx-period 10
 service-policy type control subscriber DOT1X-MAB-POLICY
 spanning-tree portfast edge
```

---

## 3.4.10 DNAC Interface Templates

### Template for SD-Access Fabric Edge

```yaml
# DNAC Template: SDA-DOT1X-CLOSED-MODE
# Apply via: Provision > Fabric > Host Onboarding > Port Assignment

Template_Name: SDA-DOT1X-CLOSED-MODE
Description: Closed mode 802.1X for SD-Access fabric edge ports
Device_Type: Fabric Edge

Configuration:
  Authentication_Mode: Closed Mode
  Host_Mode: Multi-Auth
  Pre_Auth_ACL: None
  
  Order: DOT1X, MAB
  Priority: DOT1X, MAB
  
  Events:
    Auth_Fail: VLAN 999
    Server_Dead: VLAN 999
    No_Response: VLAN 999
    
  Timers:
    Tx_Period: 10
    Reauth: Server
    Inactivity: 3600
    
  Device_Tracking: Enabled
  
  Port_Fast: Enabled
  BPDU_Guard: Enabled
```

### Template Variables

```yaml
# Template Variables for DNAC
Variables:
  DATA_VLAN: "{{ pool_vlan }}"
  VOICE_VLAN: "{{ voice_vlan }}"
  CRITICAL_VLAN: 999
  ISE_PSN_1: 10.252.31.11
  ISE_PSN_2: 10.252.31.12
  RADIUS_KEY: "{{ radius_secret }}"
```

---

## 3.4.11 Special Port Configurations

### AP Port Configuration

```cisco
! ============================================================
! ACCESS POINT PORT (Trunk with MAB)
! ============================================================

interface GigabitEthernet1/0/48
 description AP-PORT
 switchport mode trunk
 switchport trunk native vlan 150
 switchport trunk allowed vlan 150,100-110,200
 
 ! Device Tracking
 device-tracking attach-policy IPDT-POLICY
 
 ! Authentication for AP
 authentication host-mode multi-domain
 authentication order mab
 authentication priority mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 
 ! MAB only (APs typically don't do 802.1X)
 mab
 
 ! Spanning Tree
 spanning-tree portfast trunk
```

### Printer/IoT Port Configuration

```cisco
! ============================================================
! PRINTER/IOT PORT (MAB Only)
! ============================================================

interface GigabitEthernet1/0/47
 description PRINTER-PORT-MAB-ONLY
 switchport mode access
 switchport access vlan 100
 
 ! Device Tracking
 device-tracking attach-policy IPDT-POLICY
 
 ! MAB Only - No 802.1X
 authentication host-mode single-host
 authentication order mab
 authentication priority mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 authentication event fail action authorize vlan 999
 authentication event server dead action authorize vlan 999
 
 ! MAB
 mab
 
 ! NO 802.1X for printers
 no dot1x pae authenticator
 
 ! Spanning Tree
 spanning-tree portfast edge
 spanning-tree bpduguard enable
```

---

## 3.4.12 CoA (Change of Authorization) Configuration

### CoA Handling

```cisco
! ============================================================
! CHANGE OF AUTHORIZATION (CoA) CONFIGURATION
! ============================================================

! CoA Server Configuration (already in AAA section)
aaa server radius dynamic-author
 client 10.252.31.11 server-key <coa-key>
 client 10.252.31.12 server-key <coa-key>
 port 1700
 auth-type any

! CoA Types Supported:
! - Session Terminate (disconnect user)
! - Session Reauthenticate (re-run authentication)
! - Port Bounce (shut/no shut interface)
! - Push ACL (apply new dACL)

! Verify CoA Statistics
show aaa servers | section Dynamic
```

---

## 3.4.13 Troubleshooting Commands

### Authentication Troubleshooting

```cisco
! Show all authentication sessions
show authentication sessions

! Show specific interface details
show authentication sessions interface Gi1/0/1 details

! Show authentication method details
show authentication sessions method dot1x

! Show MAB sessions
show authentication sessions method mab

! Check failed authentications
show authentication sessions | include Failed|Unauth

! RADIUS server status
show aaa servers

! RADIUS statistics
show radius statistics

! Debug authentication (use with caution)
debug dot1x all
debug radius authentication
debug radius accounting

! Clear authentication session
clear authentication sessions interface Gi1/0/1
```

---

## 3.4.14 Deployment Checklist

| Phase | Task | Status | Date |
|-------|------|--------|------|
| **Pre-Deployment** |
| | AAA global config applied | ☐ | |
| | RADIUS servers configured | ☐ | |
| | Device tracking enabled | ☐ | |
| | Critical VLAN created | ☐ | |
| **Phase 1: Monitor** |
| | Monitor mode template applied | ☐ | |
| | Authentication logging verified | ☐ | |
| | Endpoint inventory collected | ☐ | |
| | Non-802.1X devices identified | ☐ | |
| **Phase 2: Low-Impact** |
| | Pre-auth ACL configured | ☐ | |
| | Low-impact mode applied | ☐ | |
| | Critical services tested | ☐ | |
| | MAB whitelist populated | ☐ | |
| **Phase 3: Closed** |
| | Closed mode applied | ☐ | |
| | Authentication enforcement verified | ☐ | |
| | Exception process documented | ☐ | |
| | User communication complete | ☐ | |
| **Production** |
| | Monitoring dashboards configured | ☐ | |
| | Alerting enabled | ☐ | |
| | Runbook documented | ☐ | |

---
