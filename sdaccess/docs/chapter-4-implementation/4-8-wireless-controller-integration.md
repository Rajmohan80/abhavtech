# 4.8 Wireless Controller Integration for SD-Access

## 4.8.1 C9800 WLC Architecture for Fabric

### Fabric WLC Deployment Model

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    C9800 FABRIC WIRELESS ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         CATALYST CENTER (DNAC)                           │   │
│   │                    Fabric Wireless Orchestration                         │   │
│   └───────────────────────────────┬─────────────────────────────────────────┘   │
│                                   │                                             │
│                                   │ HTTPS/NETCONF                               │
│                                   ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                      C9800-40 WLC HA PAIR                                │   │
│   │  ┌─────────────────────┐     ┌─────────────────────┐                    │   │
│   │  │   WLC-MUM-01        │     │   WLC-MUM-02        │                    │   │
│   │  │   (Active)          │◄───►│   (Standby-Hot)     │                    │   │
│   │  │   10.252.40.10      │ SSO │   10.252.40.11      │                    │   │
│   │  └─────────────────────┘     └─────────────────────┘                    │   │
│   │            │                                                             │   │
│   │            │ • Fabric Control Plane Registration                        │   │
│   │            │ • LISP Map-Server/Resolver Communication                   │   │
│   │            │ • Client EID Registration                                  │   │
│   │            │ • AP RLOC Management                                       │   │
│   │            ▼                                                             │   │
│   │  ┌─────────────────────────────────────────────────────────────────┐    │   │
│   │  │                 FABRIC CONTROL PLANE NODES                       │    │   │
│   │  │         MUM-CP-01 (10.250.1.3) / MUM-CP-02 (10.250.1.4)        │    │   │
│   │  └─────────────────────────────────────────────────────────────────┘    │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                             │
│                                   │ CAPWAP (Control Only)                       │
│                                   ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         FABRIC ACCESS POINTS                             │   │
│   │                                                                          │   │
│   │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │   │
│   │   │C9130AXI │  │C9130AXI │  │C9130AXI │  │C9130AXI │  │C9130AXI │       │   │
│   │   │ AP-01   │  │ AP-02   │  │ AP-03   │  │ AP-04   │  │ AP-N    │       │   │
│   │   └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘       │   │
│   │        │            │            │            │            │            │   │
│   │        └────────────┴─────┬──────┴────────────┴────────────┘            │   │
│   │                           │                                              │   │
│   │                           │ VXLAN Data Plane                            │   │
│   │                           ▼                                              │   │
│   │              ┌─────────────────────────────────┐                        │   │
│   │              │      FABRIC EDGE NODES          │                        │   │
│   │              │   (Local Switching + SGT)       │                        │   │
│   │              └─────────────────────────────────┘                        │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.8.2 WLC Base Configuration

### Initial C9800 Setup

```cisco
! ============================================================
! C9800-40 BASE CONFIGURATION - WLC-MUM-01
! ============================================================

! System Settings
hostname WLC-MUM-01
!
ip domain name corp.local
!
clock timezone UTC 0
!
ntp server 10.252.1.10
ntp server 10.252.1.11

! Management Interface
interface GigabitEthernet0/0/0
 description MANAGEMENT
 ip address 10.252.40.10 255.255.255.0
 no shutdown
!
ip default-gateway 10.252.40.1

! DNS Configuration
ip name-server 10.252.1.20
ip name-server 10.252.1.21

! Enable HTTP/HTTPS
ip http server
ip http secure-server
ip http authentication local

! Enable NETCONF for DNAC
netconf-yang
netconf-yang feature candidate-datastore

! SNMPv3 Configuration
snmp-server group DNAC-GROUP v3 priv
snmp-server user dnac-snmp DNAC-GROUP v3 auth sha <auth-pass> priv aes 128 <priv-pass>
snmp-server host 10.252.10.10 version 3 priv dnac-snmp

! SSH Configuration
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3
line vty 0 15
 login local
 transport input ssh
 exec-timeout 30 0

! Local Admin User
username admin privilege 15 secret <password>
username netadmin privilege 15 secret <password>

! AAA Configuration (for device admin)
aaa new-model
aaa authentication login default local
aaa authorization exec default local

! Logging
logging host 10.252.1.30
logging trap informational
logging source-interface GigabitEthernet0/0/0
```

### Wireless Management Interface

```cisco
! ============================================================
! WIRELESS MANAGEMENT CONFIGURATION
! ============================================================

! Wireless Management Interface (WMI)
wireless management interface GigabitEthernet0/0/0

! AP Join Profile Interface
ap profile default-ap-profile
 description "Default AP Join Profile"
 mgmtuser username apmanager password 0 <password> secret 0 <secret>
```

---

## 4.8.3 Fabric Configuration

### Enable Fabric Mode

```cisco
! ============================================================
! FABRIC WIRELESS CONFIGURATION
! ============================================================

! Enable Fabric on WLC
wireless fabric

! Configure Fabric Control Plane
wireless fabric control-plane default-control-plane
 ip address 10.250.1.3
 ip address 10.250.1.4
 key 0 <lisp-auth-key>
!
! Fabric data plane configuration is automatic
! WLC registers with CP and learns AP RLOCs
```

### Verify Fabric Registration

```cisco
! Verify Fabric Status
show wireless fabric summary

! Expected Output:
! Fabric Status      : Enabled
! Control Plane Count: 2
!
! Control Plane Nodes:
! IP Address      Status      Type
! --------------------------------------------------------
! 10.250.1.3      UP          Map-Server/Map-Resolver
! 10.250.1.4      UP          Map-Server/Map-Resolver

! Verify Fabric APs
show ap summary
show wireless fabric ap summary
```

---

## 4.8.4 WLAN Configuration

### Corp-Secure WLAN (802.1X)

```cisco
! ============================================================
! WLAN CONFIGURATION - CORP-SECURE
! ============================================================

! Create WLAN
wlan Corp-Secure 1 Corp-Secure
 no shutdown
 broadcast-ssid
 
 ! Security Settings
 security wpa psk set-key ascii 0 <not-used-for-802.1X>
 no security wpa psk
 security wpa wpa3
 security wpa akm dot1x
 security pmf mandatory
 security ft
 security ft over-the-ds
 
 ! AAA Settings
 security dot1x authentication-list ISE-AUTH
 no security wpa wpa2 ciphers aes
 security wpa wpa3 ciphers aes
 
 ! Session Timeout
 session-timeout 28800
 
 ! Client Settings
 client association limit 0
 client vlan default
 
 ! Quality of Service
 wmm require
 
 exit

! AAA Server for 802.1X
aaa group server radius ISE-SERVERS
 server name ISE-PSN-MUM-1
 server name ISE-PSN-MUM-2

radius server ISE-PSN-MUM-1
 address ipv4 10.252.31.11 auth-port 1812 acct-port 1813
 timeout 5
 retransmit 2
 key 0 <radius-shared-secret>

radius server ISE-PSN-MUM-2
 address ipv4 10.252.31.12 auth-port 1812 acct-port 1813
 timeout 5
 retransmit 2
 key 0 <radius-shared-secret>

aaa authentication dot1x ISE-AUTH group ISE-SERVERS
aaa authorization network ISE-AUTH group ISE-SERVERS
aaa accounting identity ISE-ACCT start-stop group ISE-SERVERS
```

### Corp-Guest WLAN (Web Auth)

```cisco
! ============================================================
! WLAN CONFIGURATION - CORP-GUEST
! ============================================================

wlan Corp-Guest 2 Corp-Guest
 no shutdown
 broadcast-ssid
 
 ! Security - WPA3-Personal with Web Auth
 security wpa psk set-key ascii 0 <guest-psk>
 security wpa wpa3
 security wpa akm sae
 
 ! Web Authentication
 security web-auth
 security web-auth authentication-list ISE-GUEST
 security web-auth on-macfilter-failure
 security web-auth parameter-map global
 
 ! Session Settings
 session-timeout 28800
 client exclusion timeout 60
 
 exit

! Web Auth Parameter Map
parameter-map type webauth global
 type webauth
 redirect for-login https://ise.corp.local:8443/portal/PortalSetup.action?portal=guest
 redirect on-failure https://ise.corp.local:8443/portal/PortalSetup.action?portal=guest
 redirect on-success https://www.corp.com
 redirect portal ipv4 10.252.30.10
```

### Corp-IoT WLAN (PSK + MAC Filter)

```cisco
! ============================================================
! WLAN CONFIGURATION - CORP-IOT
! ============================================================

wlan Corp-IoT 3 Corp-IoT
 no shutdown
 no broadcast-ssid
 
 ! Security - WPA2-PSK
 security wpa psk set-key ascii 0 <iot-strong-psk>
 security wpa wpa2
 security wpa akm psk
 
 ! MAC Filtering via ISE
 mac-filtering ISE-MAC-FILTER
 
 ! Session Settings  
 session-timeout 86400
 
 exit

! MAC Filter AAA
aaa authorization network ISE-MAC-FILTER group ISE-SERVERS
```

### Corp-Voice WLAN

```cisco
! ============================================================
! WLAN CONFIGURATION - CORP-VOICE
! ============================================================

wlan Corp-Voice 4 Corp-Voice
 no shutdown
 broadcast-ssid
 
 ! Security - WPA3-Enterprise
 security wpa wpa3
 security wpa akm dot1x
 security pmf mandatory
 security ft
 
 ! AAA
 security dot1x authentication-list ISE-AUTH
 
 ! QoS for Voice
 wmm require
 call-snooping
 
 ! Session Settings
 session-timeout 86400
 
 exit
```

---

## 4.8.5 Policy Profile Configuration

### Policy Profile for Corp-Secure

```cisco
! ============================================================
! POLICY PROFILE - CORP-SECURE
! ============================================================

wireless profile policy POLICY-CORP-SECURE
 description "Policy for Corporate Secure WLAN"
 
 ! Enable Fabric
 fabric
 
 ! VLAN (dynamic from ISE/Fabric)
 vlan
 no vlan
 
 ! AAA Settings
 aaa-override
 nac
 
 ! Central Web Auth
 central web-auth
 
 ! Session Timeout
 session-timeout 28800
 idle-timeout 1800
 
 ! Client Settings
 exclusionlist timeout 180
 
 ! DHCP
 dhcp-tlv-caching
 
 ! IPv6
 ipv6 enable
 
 ! QoS
 service-policy input platinum-up
 service-policy output platinum
 
 no shutdown
 exit
```

### Policy Profile for Corp-Guest

```cisco
! ============================================================
! POLICY PROFILE - CORP-GUEST
! ============================================================

wireless profile policy POLICY-CORP-GUEST
 description "Policy for Guest WLAN"
 
 ! Enable Fabric
 fabric
 
 ! Static VLAN for Guest (before auth)
 vlan GUEST_VLAN
 
 ! AAA Settings
 aaa-override
 nac
 central web-auth
 
 ! Session Timeout
 session-timeout 28800
 idle-timeout 600
 
 ! HTTP/HTTPS Redirect
 webauth-http-enable
 
 ! QoS - Bronze (rate limited)
 service-policy input bronze-up
 service-policy output bronze
 
 no shutdown
 exit
```

### Policy Profile for IoT

```cisco
! ============================================================
! POLICY PROFILE - CORP-IOT
! ============================================================

wireless profile policy POLICY-CORP-IOT
 description "Policy for IoT WLAN"
 
 ! Enable Fabric
 fabric
 
 ! AAA Override for dynamic SGT
 aaa-override
 
 ! Session Timeout (long for IoT)
 session-timeout 86400
 idle-timeout 7200
 
 ! QoS - Bronze
 service-policy input bronze-up
 service-policy output bronze
 
 no shutdown
 exit
```

### Policy Profile for Voice

```cisco
! ============================================================
! POLICY PROFILE - CORP-VOICE
! ============================================================

wireless profile policy POLICY-CORP-VOICE
 description "Policy for Voice WLAN"
 
 ! Enable Fabric
 fabric
 
 ! AAA Settings
 aaa-override
 
 ! Voice Settings
 call-snooping
 
 ! Session Timeout
 session-timeout 86400
 
 ! QoS - Platinum (Voice Priority)
 service-policy input platinum-up
 service-policy output platinum
 
 no shutdown
 exit
```

---

## 4.8.6 AP Join Profile Configuration

### Default AP Profile

```cisco
! ============================================================
! AP JOIN PROFILE
! ============================================================

ap profile default-ap-profile
 description "Default AP Profile for SD-Access"
 
 ! Hyperlocation (optional)
 hyperlocation ble-beacon 0
 hyperlocation ble-beacon 1
 hyperlocation ble-beacon 2
 hyperlocation ble-beacon 3
 hyperlocation ble-beacon 4
 
 ! LED State
 led-brightness-level 8
 
 ! Link Latency
 link-latency
 
 ! Management User
 mgmtuser username apmanager password 0 <password> secret 0 <secret>
 
 ! SSH
 ssh
 
 ! Syslog
 syslog host 10.252.1.30
 
 ! CDP
 cdp
 
 exit
```

### RF Profile Configuration

```cisco
! ============================================================
! RF PROFILES
! ============================================================

! 5 GHz RF Profile
ap dot11 5ghz rf-profile RF-PROFILE-5GHZ
 description "5GHz RF Profile for Office"
 
 ! Channel Width
 channel-width 40
 
 ! Power Settings
 tx-power min 8
 tx-power max 17
 
 ! RRM
 coverage level global
 coverage data fail-percentage 50
 coverage data packet-count 10
 coverage data rssi-threshold -80
 coverage voice rssi-threshold -80
 
 ! DCA
 dca channel-list 36,40,44,48,52,56,60,64,100,104,108,112,116,132,136,140,149,153,157,161,165
 dca min-metric 35
 
 ! TPC
 tpc-power threshold -70
 
 ! Client Steering
 client-steering
 
 no shutdown
 exit

! 2.4 GHz RF Profile
ap dot11 24ghz rf-profile RF-PROFILE-24GHZ
 description "2.4GHz RF Profile for Office"
 
 ! Channel Width (always 20MHz)
 channel-width 20
 
 ! Power Settings (lower for 2.4GHz)
 tx-power min 5
 tx-power max 14
 
 ! RRM
 coverage level global
 coverage data fail-percentage 50
 coverage data rssi-threshold -80
 
 ! DCA - Only non-overlapping
 dca channel-list 1,6,11
 
 ! TPC
 tpc-power threshold -70
 
 no shutdown
 exit
```

---

## 4.8.7 Policy Tag Configuration

### Policy Tags (WLAN to Policy Mapping)

```cisco
! ============================================================
! POLICY TAGS
! ============================================================

! Default Policy Tag
wireless tag policy PT-CORP-DEFAULT
 description "Default Policy Tag for Corporate"
 
 ! WLAN-Policy Mapping
 wlan Corp-Secure policy POLICY-CORP-SECURE
 wlan Corp-Guest policy POLICY-CORP-GUEST
 wlan Corp-IoT policy POLICY-CORP-IOT
 wlan Corp-Voice policy POLICY-CORP-VOICE
 
 exit
```

### Site Tag Configuration

```cisco
! ============================================================
! SITE TAGS
! ============================================================

wireless tag site ST-MUMBAI-HQ
 description "Mumbai HQ Site Tag"
 
 ! AP Join Profile
 ap-profile default-ap-profile
 
 ! Local Site (not FlexConnect)
 no local-site
 
 ! Fabric Enabled
 fabric-enabled
 
 exit

wireless tag site ST-LONDON-HQ
 description "London HQ Site Tag"
 ap-profile default-ap-profile
 no local-site
 fabric-enabled
 exit
```

### RF Tag Configuration

```cisco
! ============================================================
! RF TAGS
! ============================================================

wireless tag rf RT-OFFICE-DEFAULT
 description "Default RF Tag for Office"
 
 ! RF Profile Assignment
 dot11 5ghz rf-profile RF-PROFILE-5GHZ
 dot11 24ghz rf-profile RF-PROFILE-24GHZ
 
 exit
```

---

## 4.8.8 AP Provisioning

### AP Tag Assignment

```cisco
! ============================================================
! AP TAG ASSIGNMENT
! ============================================================

! Assign tags to specific APs
ap <ap-mac-address>
 policy-tag PT-CORP-DEFAULT
 site-tag ST-MUMBAI-HQ
 rf-tag RT-OFFICE-DEFAULT

! Or via AP name filter
ap filter name AP-MUM-F1*
 policy-tag PT-CORP-DEFAULT
 site-tag ST-MUMBAI-HQ
 rf-tag RT-OFFICE-DEFAULT
```

### AP Location Configuration

```cisco
! ============================================================
! AP LOCATION ASSIGNMENT
! ============================================================

! Set AP location via CLI
ap name AP-MUM-F1-01 location "Mumbai HQ Floor 1"
ap name AP-MUM-F1-02 location "Mumbai HQ Floor 1"
ap name AP-MUM-F2-01 location "Mumbai HQ Floor 2"

! Or via DNAC Floor Maps (preferred)
```

---

## 4.8.9 High Availability (SSO) Configuration

### HA Pair Setup

```cisco
! ============================================================
! HIGH AVAILABILITY CONFIGURATION
! ============================================================

! On WLC-MUM-01 (Primary)
redundancy
 mode sso

chassis 1
 priority 2
 
chassis ha-interface GigabitEthernet0/0/1
 ip address 10.252.41.10 255.255.255.0

! On WLC-MUM-02 (Secondary)
redundancy
 mode sso

chassis 2
 priority 1
 
chassis ha-interface GigabitEthernet0/0/1
 ip address 10.252.41.11 255.255.255.0

! HA Keepalive and Peer
chassis redundancy ha-interface GigabitEthernet0/0/1 local-ip 10.252.41.10 remote-ip 10.252.41.11

! Verify HA
show redundancy
show chassis
```

### HA Verification

```cisco
! Check HA Status
WLC-MUM-01# show redundancy

Redundant System Information :
       Available system uptime = 15 days, 3 hours, 45 minutes
Switchovers system experienced = 0
              Standby failures = 0
        Last switchover reason = none

                 Hardware Mode = Duplex
    Configured Redundancy Mode = sso
     Operating Redundancy Mode = sso
              Maintenance Mode = Disabled
                Communications = Up

Current Processor Information :
               Active Location = slot 1
        Current Software state = ACTIVE
       Uptime in current state = 15 days, 3 hours, 45 minutes
                 Image Version = 17.9.3
        Configuration register = 0x2102

Peer Processor Information :
              Standby Location = slot 2
        Current Software state = STANDBY HOT
       Uptime in current state = 15 days, 3 hours, 44 minutes
                 Image Version = 17.9.3
        Configuration register = 0x2102
```

---

## 4.8.10 DNAC Integration

### Add WLC to DNAC Inventory

```yaml
# DNAC: Provision > Network Devices > Inventory > Add Device

WLC_Discovery:
  Device_IP: 10.252.40.10
  Device_Type: Wireless Controller
  
  CLI_Credentials:
    Username: netadmin
    Password: <password>
    Enable_Password: <password>
    
  SNMP_Credentials:
    Version: 3
    Username: dnac-snmp
    Auth_Protocol: SHA
    Auth_Password: <password>
    Priv_Protocol: AES128
    Priv_Password: <password>
    
  NETCONF:
    Port: 830
    
# Wait for device sync (~5 minutes)
```

### Provision WLC as Fabric-Enabled

```yaml
# DNAC: Provision > Fabric Sites > [Site] > Fabric Infrastructure

Fabric_WLC_Provisioning:
  
  Site: Global/APAC/Mumbai
  
  Add_Wireless_Controller:
    Device: WLC-MUM-01
    Fabric_Role: Fabric-Enabled Wireless Controller
    
  Control_Plane_Nodes:
    Primary: MUM-CP-01 (10.250.1.3)
    Secondary: MUM-CP-02 (10.250.1.4)
    
  Settings:
    Fabric_Enabled: Yes
    LISP_Authentication: <key>
```

### SSID to VN Mapping via DNAC

```yaml
# DNAC: Provision > Fabric Sites > [Site] > Host Onboarding > Wireless SSIDs

SSID_VN_Mapping:
  
  Corp-Secure:
    SSID: Corp-Secure
    Virtual_Network: VN_CORPORATE
    IP_Pool: Corporate_Pool_Floor1
    SGT_Assignment: Dynamic (from ISE)
    Authentication: Enterprise (802.1X)
    
  Corp-Guest:
    SSID: Corp-Guest
    Virtual_Network: VN_GUEST
    IP_Pool: Guest_Pool
    SGT_Assignment: Static (40 - Guests)
    Authentication: Guest Portal
    
  Corp-IoT:
    SSID: Corp-IoT
    Virtual_Network: VN_IOT
    IP_Pool: IoT_Pool
    SGT_Assignment: Static (50 - IoT)
    Authentication: MAC Filter + PSK
    
  Corp-Voice:
    SSID: Corp-Voice
    Virtual_Network: VN_VOICE
    IP_Pool: Voice_Pool
    SGT_Assignment: Static (20 - Voice)
    Authentication: Enterprise (802.1X)
```

---

## 4.8.11 Verification Commands

### Fabric Verification

```cisco
! Fabric Status
show wireless fabric summary
show wireless fabric vnid mapping
show wireless fabric ap summary

! Example output:
! Fabric Status: Enabled
! Control Plane Count: 2
! VN-ID Mappings:
!   VN Name         VN-ID    L2-VNI   L3-VNI
!   VN_CORPORATE    8001     8001     4097
!   VN_GUEST        8004     8004     4100
!   VN_IOT          8003     8003     4099
!   VN_VOICE        8002     8002     4098
```

### AP Verification

```cisco
! AP Summary
show ap summary

! AP Fabric Status
show ap name AP-MUM-F1-01 config general

! AP Tag Assignment
show ap tag summary

! Expected Output:
! AP Name              MAC Address       Tag Policy         Tag Site           Tag RF
! -----------------------------------------------------------------------------------
! AP-MUM-F1-01        00:11:22:33:44:55  PT-CORP-DEFAULT   ST-MUMBAI-HQ      RT-OFFICE
```

### Client Verification

```cisco
! Wireless Clients
show wireless client summary

! Client Detail (including SGT)
show wireless client mac-address <client-mac> detail

! Example Output:
! Client MAC Address: aa:bb:cc:dd:ee:ff
! Client Username: jdoe@corp.local
! AP Name: AP-MUM-F1-01
! WLAN Profile Name: Corp-Secure
! Wireless LAN Network Name (SSID): Corp-Secure
! Security Policy Completed: Yes
! Policy Type: WPA3
! Authentication Key Management: 802.1X
! SGT: 10 (Employees)
! VN-ID: 8001
! VXLAN Tunnel: Yes
```

### RADIUS/ISE Verification

```cisco
! RADIUS Server Status
show aaa servers

! RADIUS Statistics
show radius statistics

! Authentication Failures
show wireless client mac-address <mac> detail | include Auth|Failure
```

---

## 4.8.12 Troubleshooting

### Common Issues and Resolution

```cisco
! AP Not Joining
show ap cdp neighbor
show capwap client rcb
debug capwap events enable
debug capwap errors enable

! Client Not Authenticating
debug dot1x all
debug aaa authentication
debug aaa authorization
show aaa local statistics

! Fabric Issues
debug lisp control-plane all
show lisp session
show lisp site detail

! SGT Not Assigned
show cts role-based sgt-map all
show wireless fabric client wired-sgt
```

### Debug Commands

```cisco
! Enable Debugging (use with caution)
debug wireless client mac <client-mac>
debug wireless dot1x enable
debug wireless fabric events

! Disable All Debugging
undebug all
```

---

## 4.8.13 WLC Configuration Checklist

| Category | Task | Status |
|----------|------|--------|
| **Base Configuration** |
| | Hostname and domain | ☐ |
| | Management IP | ☐ |
| | NTP configured | ☐ |
| | DNS configured | ☐ |
| | SNMP for DNAC | ☐ |
| | NETCONF enabled | ☐ |
| **Fabric Configuration** |
| | Fabric enabled | ☐ |
| | Control plane nodes | ☐ |
| | LISP authentication | ☐ |
| **WLANs** |
| | Corp-Secure (802.1X) | ☐ |
| | Corp-Guest (WebAuth) | ☐ |
| | Corp-IoT (PSK/MAC) | ☐ |
| | Corp-Voice (802.1X) | ☐ |
| **Policy Profiles** |
| | Fabric-enabled profiles | ☐ |
| | AAA override enabled | ☐ |
| | QoS policies attached | ☐ |
| **RF Configuration** |
| | 5GHz RF profile | ☐ |
| | 2.4GHz RF profile | ☐ |
| | Channel/power settings | ☐ |
| **High Availability** |
| | SSO configured | ☐ |
| | HA verified | ☐ |
| **DNAC Integration** |
| | WLC discovered | ☐ |
| | Fabric provisioned | ☐ |
| | SSIDs mapped to VNs | ☐ |
| **Verification** |
| | APs joined | ☐ |
| | Clients authenticating | ☐ |
| | SGT assignment working | ☐ |

---
