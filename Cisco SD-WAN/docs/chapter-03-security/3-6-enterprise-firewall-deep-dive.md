# 3.6 Enterprise Firewall Deep Dive

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.6 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section provides a comprehensive deep dive into enterprise firewall capabilities within Abhavtech's SD-WAN deployment. The firewall architecture encompasses Cisco's integrated Zone-Based Firewall (ZBFW), Application Firewall, IPS/IDS capabilities, and integration with third-party next-generation firewalls (Palo Alto Networks). This multi-layered approach provides defense in depth across the entire WAN infrastructure.

### 1.1 Firewall Architecture Overview

```
+------------------------------------------------------------------+
|                 ENTERPRISE FIREWALL ARCHITECTURE                  |
+------------------------------------------------------------------+
|                                                                   |
|  Layer 7: Application Firewall                                    |
|  +----------------------------------------------------------+    |
|  | Deep Packet Inspection | Application Identification | SSL  |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Layer 5-6: UTD / IPS-IDS                                        |
|  +----------------------------------------------------------+    |
|  | Snort 3.0 Engine | Malware Detection | Threat Intel Feed  |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Layer 4: Zone-Based Firewall                                    |
|  +----------------------------------------------------------+    |
|  | Stateful Inspection | Zone Pairs | Class Maps | Policies |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Layer 3: Network Segmentation                                   |
|  +----------------------------------------------------------+    |
|  | VPN Isolation | VRF Separation | Route Filtering          |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  External Integration: Palo Alto Networks                        |
|  +----------------------------------------------------------+    |
|  | NGFW Service Chain | Panorama | Threat Prevention        |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 Deployment Matrix

| Site | ZBFW | App Firewall | UTD/IPS | Palo Alto | License |
|------|------|--------------|---------|-----------|---------|
| Mumbai DC | ✅ | ✅ | Full | ✅ | Premier |
| Chennai DR | ✅ | ✅ | Full | ✅ | Premier |
| London | ✅ | ✅ | Full | ✅ | Premier |
| New Jersey | ✅ | ✅ | Full | ✅ | Premier |
| Bangalore | ✅ | ✅ | Basic | - | Advantage |
| Delhi | ✅ | ✅ | Basic | - | Advantage |
| Frankfurt | ✅ | ✅ | Basic | - | Advantage |
| Dallas | ✅ | ✅ | Basic | - | Advantage |
| Noida | ✅ | - | DNS only | - | Essentials |

---

## 2. Zone-Based Firewall (ZBFW)

### 2.1 Zone Architecture

```
+------------------------------------------------------------------+
|                    ZBFW ZONE ARCHITECTURE                         |
+------------------------------------------------------------------+
|                                                                   |
|                        WAN Edge Router                            |
|  +-------------------------------------------------------------+ |
|  |                                                              | |
|  |  +------------------+          +------------------+         | |
|  |  |   VPN-ZONE       |          |  INTERNET-ZONE   |         | |
|  |  | (Service VPNs)   |          | (DIA Interface)  |         | |
|  |  | VPN 10,20,30,40  |          | GigE 0/0/1       |         | |
|  |  +--------+---------+          +--------+---------+         | |
|  |           |                             |                    | |
|  |           |     +------------------+    |                    | |
|  |           +---->|   SELF-ZONE      |<---+                    | |
|  |                 | (Router itself)  |                         | |
|  |                 +--------+---------+                         | |
|  |                          |                                   | |
|  |           +--------------+--------------+                    | |
|  |           |                             |                    | |
|  |  +--------+---------+          +--------+---------+         | |
|  |  |   MPLS-ZONE      |          |   GUEST-ZONE     |         | |
|  |  | (MPLS Transport) |          | (Guest VPN 20)   |         | |
|  |  | GigE 0/0/0       |          | Isolated         |         | |
|  |  +------------------+          +------------------+         | |
|  |                                                              | |
|  +-------------------------------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 Zone Definitions

| Zone Name | Description | Interfaces | VPNs | Security Level |
|-----------|-------------|------------|------|----------------|
| VPN-ZONE | Corporate traffic | Service VPN interfaces | 10, 40, 50 | High |
| INTERNET-ZONE | Internet breakout | DIA interface | 0 (NAT) | Untrusted |
| GUEST-ZONE | Guest network | Guest VPN interface | 20 | Restricted |
| IOT-ZONE | IoT devices | IoT VPN interface | 30 | Controlled |
| MPLS-ZONE | MPLS transport | MPLS WAN interface | 0 | Trusted |
| SELF-ZONE | Router management | Loopback, VTY | 512 | Protected |

### 2.3 Zone-Pair Policy Matrix

```
+------------------------------------------------------------------+
|                    ZONE-PAIR POLICY MATRIX                        |
+------------------------------------------------------------------+
|                                                                   |
|  Source Zone      | Destination Zone  | Policy          | Action |
|  -----------------+-------------------+-----------------+---------|
|  VPN-ZONE         | INTERNET-ZONE     | DIA-OUTBOUND    | Inspect |
|  INTERNET-ZONE    | VPN-ZONE          | DIA-RETURN      | Inspect |
|  GUEST-ZONE       | INTERNET-ZONE     | GUEST-INTERNET  | Permit  |
|  GUEST-ZONE       | VPN-ZONE          | BLOCK           | Drop    |
|  IOT-ZONE         | INTERNET-ZONE     | IOT-CLOUD       | Filter  |
|  VPN-ZONE         | SELF-ZONE         | MGMT-ACCESS     | Permit  |
|  INTERNET-ZONE    | SELF-ZONE         | BLOCK           | Drop    |
|  Any              | MPLS-ZONE         | MPLS-TRANSIT    | Permit  |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.4 ZBFW Configuration

```
! Zone Definitions
zone security VPN-ZONE
 description "Corporate Service VPNs"
!
zone security INTERNET-ZONE
 description "Direct Internet Access"
!
zone security GUEST-ZONE
 description "Guest Network Isolation"
!
zone security IOT-ZONE
 description "IoT Device Zone"
!
zone security MPLS-ZONE
 description "MPLS Transport"
!

! Class Maps for Traffic Classification
class-map type inspect match-any CM-ALLOWED-APPS
 match protocol http
 match protocol https
 match protocol dns
 match protocol icmp
!

class-map type inspect match-any CM-BLOCKED-APPS
 match protocol telnet
 match protocol ftp
 match protocol tftp
!

class-map type inspect match-any CM-GUEST-APPS
 match protocol http
 match protocol https
 match protocol dns
!

! Policy Maps
policy-map type inspect PM-VPN-TO-INTERNET
 class type inspect CM-ALLOWED-APPS
  inspect
 class type inspect CM-BLOCKED-APPS
  drop log
 class class-default
  drop
!

policy-map type inspect PM-GUEST-TO-INTERNET
 class type inspect CM-GUEST-APPS
  pass
 class class-default
  drop log
!

! Zone Pairs
zone-pair security ZP-VPN-TO-INTERNET source VPN-ZONE destination INTERNET-ZONE
 service-policy type inspect PM-VPN-TO-INTERNET
!

zone-pair security ZP-GUEST-TO-INTERNET source GUEST-ZONE destination INTERNET-ZONE
 service-policy type inspect PM-GUEST-TO-INTERNET
!

zone-pair security ZP-GUEST-TO-VPN source GUEST-ZONE destination VPN-ZONE
 service-policy type inspect PM-DENY-ALL
!

! Interface Zone Assignment
interface GigabitEthernet0/0/1
 description "DIA Interface"
 zone-member security INTERNET-ZONE
!

interface GigabitEthernet0/0/2.10
 description "Employee VPN"
 zone-member security VPN-ZONE
!

interface GigabitEthernet0/0/2.20
 description "Guest VPN"
 zone-member security GUEST-ZONE
!
```

---

## 3. Application Firewall

### 3.1 Application Visibility and Control (AVC)

```
+------------------------------------------------------------------+
|                 APPLICATION VISIBILITY & CONTROL                  |
+------------------------------------------------------------------+
|                                                                   |
|  NBAR2 Engine (Network-Based Application Recognition)            |
|  +----------------------------------------------------------+    |
|  |                                                          |    |
|  |  Layer 7 Identification:                                 |    |
|  |  - 1,400+ applications recognized                        |    |
|  |  - Custom application signatures                         |    |
|  |  - Encrypted traffic identification                      |    |
|  |  - SSL/TLS SNI inspection                               |    |
|  |                                                          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Application Categories:                                          |
|  +------------------+  +------------------+  +------------------+ |
|  | Business         |  | Social Media     |  | Streaming       | |
|  | - Office 365     |  | - Facebook       |  | - Netflix       | |
|  | - Salesforce     |  | - Twitter        |  | - YouTube       | |
|  | - SAP            |  | - LinkedIn       |  | - Spotify       | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                   |
|  +------------------+  +------------------+  +------------------+ |
|  | Collaboration    |  | Cloud Storage    |  | Games           | |
|  | - WebEx          |  | - Dropbox        |  | - Steam         | |
|  | - Zoom           |  | - OneDrive       |  | - Xbox Live     | |
|  | - Teams          |  | - Google Drive   |  | - PlayStation   | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 Application-Based Policy

```
! Application Lists
policy
 app-list BUSINESS-CRITICAL
  app office365
  app salesforce
  app sap
  app oracle-apps
  app ms-teams
  app webex
 !
 
 app-list BLOCKED-APPS
  app bittorrent
  app tor
  app ultrasurf
  app psiphon
  app tunnel-bear
 !
 
 app-list SOCIAL-MEDIA
  app facebook
  app twitter
  app instagram
  app tiktok
  app snapchat
 !
 
 app-list STREAMING
  app netflix
  app youtube
  app spotify
  app amazon-prime-video
 !
!

! Data Policy with Application Control
policy
 data-policy APP-FIREWALL-POLICY
  vpn-list VPN-10-EMPLOYEE
   ! Block prohibited applications
   sequence 10
    match
     app-list BLOCKED-APPS
    action drop
     count BLOCKED-APP-DROPS
    !
   !
   
   ! Rate limit social media during business hours
   sequence 20
    match
     app-list SOCIAL-MEDIA
    action accept
     policer rate 10000000 burst 1000000
     count SOCIAL-RATE-LIMITED
    !
   !
   
   ! Rate limit streaming
   sequence 30
    match
     app-list STREAMING
    action accept
     policer rate 50000000 burst 5000000
     count STREAMING-RATE-LIMITED
    !
   !
   
   ! Prioritize business applications
   sequence 40
    match
     app-list BUSINESS-CRITICAL
    action accept
     set
      dscp 34
      local-tloc-list MPLS-PREFERRED
    !
   !
  !
 !
!
```

### 3.3 Custom Application Signatures

```
! Custom Application Definition
app visibility
 custom-app ABHAVTECH-PORTAL
  server-name "portal.abhavtech.com"
  server-name "*.abhavtech.com"
  L3-L4 tcp port 443
  L3-L4 tcp port 8443
 !
 
 custom-app ABHAVTECH-VOICE
  server-name "voice.abhavtech.com"
  L3-L4 tcp port 5060-5061
  L3-L4 udp port 16384-32767
 !
 
 custom-app SAP-ERP
  server-name "sap.abhavtech.com"
  L3-L4 tcp port 3200-3299
  L3-L4 tcp port 3300-3399
 !
!
```

---

## 4. IPS/IDS with UTD

### 4.1 UTD Architecture

```
+------------------------------------------------------------------+
|                    UTD (UNIFIED THREAT DEFENSE)                   |
+------------------------------------------------------------------+
|                                                                   |
|                        WAN Edge Router                            |
|  +-------------------------------------------------------------+ |
|  |                                                              | |
|  |  +------------------+          +------------------+         | |
|  |  | Data Plane       |  Divert  | UTD Container    |         | |
|  |  | (Normal Traffic) |--------->| (Snort 3.0)      |         | |
|  |  +------------------+          +--------+---------+         | |
|  |                                         |                    | |
|  |                                         v                    | |
|  |                              +------------------+            | |
|  |                              | Verdict:         |            | |
|  |                              | - PASS           |            | |
|  |                              | - DROP           |            | |
|  |                              | - ALERT          |            | |
|  |                              | - RESET          |            | |
|  |                              +--------+---------+            | |
|  |                                       |                      | |
|  |           +---------------------------+                      | |
|  |           |                                                  | |
|  |  +--------v---------+          +------------------+         | |
|  |  | Forward/Drop     |          | Logging/Alert    |         | |
|  |  | Traffic          |          | to vManage       |         | |
|  |  +------------------+          +------------------+         | |
|  |                                                              | |
|  +-------------------------------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.2 Snort 3.0 Configuration

```
! UTD Engine Configuration
utd engine standard
 logging host 10.254.1.50
 logging level informational
 threat-inspection
  threat protection
  policy balanced-security-and-connectivity
 !
 web-filter
  url-filtering sourcedb external
  cloud-lookup
 !
!

! UTD Multi-tenancy Profile
utd multi-tenancy
 policy balanced-security
  all-interfaces
  threat-inspection
   threat protection
   policy balanced-security-and-connectivity
  !
  web-filter
   block-category malware
   block-category botnets
   block-category phishing
   block-category spyware
  !
 !
!

! Interface UTD Assignment
interface GigabitEthernet0/0/1
 utd enable
!
```

### 4.3 IPS Signature Management

```
+------------------------------------------------------------------+
|                   IPS SIGNATURE MANAGEMENT                        |
+------------------------------------------------------------------+
|                                                                   |
|  Signature Sources:                                               |
|  +----------------------------------------------------------+    |
|  | Source            | Update Frequency | Coverage          |    |
|  +----------------------------------------------------------+    |
|  | Cisco Talos       | Daily            | All threats       |    |
|  | Custom Rules      | As needed        | Organization-spec |    |
|  | Emerging Threats  | Hourly           | New threats       |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Signature Categories:                                            |
|  +------------------+  +------------------+  +------------------+ |
|  | Malware          |  | Exploits         |  | DoS              | |
|  | - Trojans        |  | - Buffer overflow|  | - SYN flood      | |
|  | - Ransomware     |  | - RCE            |  | - UDP flood      | |
|  | - Worms          |  | - Injection      |  | - Amplification  | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                   |
|  Policy Modes:                                                    |
|  - Detection Only: Alert but do not block                        |
|  - Prevention: Block matching traffic                            |
|  - Balanced: Block high confidence, alert medium                 |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.4 Custom IPS Rules

```
! Custom Snort Rules for Abhavtech
! File: /etc/snort/rules/local.rules

# Block SSH brute force attempts
alert tcp any any -> $HOME_NET 22 (msg:"SSH Brute Force Attempt"; \
  flags:S; threshold:type both,track by_src,count 5,seconds 60; \
  classtype:attempted-admin; sid:1000001; rev:1;)

# Detect unauthorized admin access
alert tcp any any -> $HOME_NET [23,22,3389] (msg:"Admin Protocol from External"; \
  flow:to_server,established; \
  classtype:policy-violation; sid:1000002; rev:1;)

# Block known malware C2 domains
alert udp $HOME_NET any -> any 53 (msg:"Malware C2 DNS Query"; \
  content:"|03|bad|07|example|03|com|00|"; nocase; \
  classtype:trojan-activity; sid:1000003; rev:1;)

# Detect data exfiltration patterns
alert tcp $HOME_NET any -> any 443 (msg:"Large Data Exfiltration"; \
  flow:to_server,established; dsize:>10000; \
  threshold:type threshold,track by_src,count 100,seconds 60; \
  classtype:policy-violation; sid:1000004; rev:1;)
```

---

## 5. Attack Mitigation

### 5.1 Common Attack Vectors

```
+------------------------------------------------------------------+
|                    ATTACK MITIGATION MATRIX                       |
+------------------------------------------------------------------+
|                                                                   |
|  Attack Type       | Detection Method       | Mitigation         |
|  ------------------+------------------------+--------------------|
|  SYN Flood         | Connection rate        | TCP Intercept      |
|  UDP Flood         | Packet rate threshold  | Rate limiting      |
|  DNS Amplification | Query/Response ratio   | Response filtering |
|  ICMP Flood        | Packet rate threshold  | Rate limiting      |
|  Slowloris         | Connection state       | Timeout tuning     |
|  SQL Injection     | Pattern matching       | IPS blocking       |
|  XSS               | Pattern matching       | IPS blocking       |
|  Port Scanning     | Connection patterns    | Threat detection   |
|  Brute Force       | Auth failure rate      | Account lockout    |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 DDoS Protection Configuration

```
! TCP SYN Cookie Protection
ip tcp synwait-time 10
ip tcp intercept list SYN-FLOOD-PROTECT
ip tcp intercept mode watch
ip tcp intercept watch-timeout 15
ip tcp intercept connection-timeout 60

ip access-list extended SYN-FLOOD-PROTECT
 permit tcp any any

! Connection Rate Limiting
parameter-map type inspect CONN-RATE-LIMIT
 max-incomplete low 1000
 max-incomplete high 1500
 one-minute low 500
 one-minute high 750
 tcp max-incomplete host 100 block-time 60

! Apply to Zone Pair
zone-pair security ZP-INTERNET-TO-VPN source INTERNET-ZONE destination VPN-ZONE
 service-policy type inspect PM-INTERNET-INBOUND
 parameter-map type inspect CONN-RATE-LIMIT
!

! Control Plane Protection
control-plane host
 management-interface GigabitEthernet0/0/2 allow ssh https snmp

control-plane
 service-policy input CP-PROTECTION
!

! Control Plane Policing
policy-map CP-PROTECTION
 class MANAGEMENT-TRAFFIC
  police rate 1000 pps burst 200 packets
   conform-action transmit
   exceed-action drop
 class ROUTING-TRAFFIC
  police rate 5000 pps burst 500 packets
 class class-default
  police rate 100 pps burst 50 packets
   conform-action transmit
   exceed-action drop
!
```

### 5.3 Anti-Spoofing Configuration

```
! Unicast Reverse Path Forwarding (uRPF)
interface GigabitEthernet0/0/1
 description "DIA Interface - Untrusted"
 ip verify unicast source reachable-via rx allow-default
!

! Bogon Filtering
ip access-list extended BOGON-FILTER
 deny   ip 0.0.0.0 0.255.255.255 any log
 deny   ip 10.0.0.0 0.255.255.255 any log
 deny   ip 127.0.0.0 0.255.255.255 any log
 deny   ip 169.254.0.0 0.0.255.255 any log
 deny   ip 172.16.0.0 0.15.255.255 any log
 deny   ip 192.0.2.0 0.0.0.255 any log
 deny   ip 192.168.0.0 0.0.255.255 any log
 deny   ip 198.18.0.0 0.1.255.255 any log
 deny   ip 224.0.0.0 31.255.255.255 any log
 permit ip any any

interface GigabitEthernet0/0/1
 ip access-group BOGON-FILTER in
!
```

---

## 6. Palo Alto Networks Integration

### 6.1 Integration Architecture

```
+------------------------------------------------------------------+
|             PALO ALTO NETWORKS INTEGRATION                        |
+------------------------------------------------------------------+
|                                                                   |
|                                                                   |
|  +------------------+                   +------------------+      |
|  | SD-WAN Manager   |                   |    Panorama      |      |
|  | (Orchestration)  |<----------------->| (PA Management)  |      |
|  +--------+---------+     REST API      +--------+---------+      |
|           |                                      |                |
|           v                                      v                |
|  +------------------+                   +------------------+      |
|  | WAN Edge Router  |                   | PA-VM / PA-450   |      |
|  | (Service Chain)  |------------------>| (NGFW)           |      |
|  +------------------+    PBR/VRF        +------------------+      |
|           |                                      |                |
|           |  Traffic Flow:                       |                |
|           |  1. WAN Edge receives traffic       |                |
|           |  2. Policy redirects to PA          |                |
|           |  3. PA inspects and returns         |                |
|           |  4. WAN Edge forwards               |                |
|           |                                      |                |
|  +------------------+                   +------------------+      |
|  | Branches         |                   | Data Centers     |      |
|  | (No PA needed)   |                   | (PA deployed)    |      |
|  +------------------+                   +------------------+      |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 Service Chain Configuration

```
! Define Palo Alto as Service Node
service-insertion
 service-node-group PALO-ALTO-NGFW
  service-node 10.254.10.10
   interface GigabitEthernet0/0/3
   ip address 10.254.10.1/30
  !
  service-node 10.254.10.14
   interface GigabitEthernet0/0/4
   ip address 10.254.10.5/30
  !
  load-balance round-robin
  health-check
   probe icmp
   interval 5
   threshold 3
  !
 !
!

! Service Chain Policy
policy
 data-policy PALO-ALTO-CHAIN
  vpn-list VPN-10-EMPLOYEE
   ! All Internet traffic through Palo Alto
   sequence 10
    match
     destination-data-prefix-list INTERNET-DESTINATIONS
    action accept
     set
      service FW
      service-node-group PALO-ALTO-NGFW
    !
   !
   
   ! High-risk applications through PA
   sequence 20
    match
     app-list HIGH-RISK-APPS
    action accept
     set
      service FW
      service-node-group PALO-ALTO-NGFW
    !
   !
  !
 !
!
```

### 6.3 Palo Alto NGFW Configuration

```
# Palo Alto Configuration (XML/Set format)

# Zone Configuration
set zone TRUST interface ethernet1/1
set zone UNTRUST interface ethernet1/2
set zone SD-WAN interface ethernet1/3

# Security Policy - SD-WAN Integration
set rulebase security rules "SD-WAN-to-Internet" from SD-WAN to UNTRUST 
set rulebase security rules "SD-WAN-to-Internet" source any
set rulebase security rules "SD-WAN-to-Internet" destination any
set rulebase security rules "SD-WAN-to-Internet" application any
set rulebase security rules "SD-WAN-to-Internet" service application-default
set rulebase security rules "SD-WAN-to-Internet" action allow
set rulebase security rules "SD-WAN-to-Internet" profile-setting profiles 
    virus default 
    spyware strict 
    vulnerability strict 
    url-filtering strict 
    file-blocking strict 
    data-filtering default

# Threat Prevention Profile
set profiles spyware "strict" rules rule1 action block-ip
set profiles vulnerability "strict" rules rule1 action reset-both
set profiles url-filtering "strict" block-list gambling adult-content
```

### 6.4 High Availability for Palo Alto

```
+------------------------------------------------------------------+
|              PALO ALTO HA CONFIGURATION                           |
+------------------------------------------------------------------+
|                                                                   |
|                      Mumbai DC                                    |
|  +-------------------------------------------------------------+ |
|  |                                                              | |
|  |  +------------------+          +------------------+         | |
|  |  | PA-VM-1          |          | PA-VM-2          |         | |
|  |  | (Active)         |<-------->| (Passive)        |         | |
|  |  | 10.254.10.10     |    HA    | 10.254.10.14     |         | |
|  |  +--------+---------+          +--------+---------+         | |
|  |           |                             |                    | |
|  |           +-------------+---------------+                    | |
|  |                         |                                    | |
|  |               +---------+---------+                         | |
|  |               | WAN Edge Router   |                         | |
|  |               | (ECMP to both)    |                         | |
|  |               +-------------------+                         | |
|  |                                                              | |
|  +-------------------------------------------------------------+ |
|                                                                   |
|  HA Mode: Active/Passive                                          |
|  Failover Time: < 3 seconds                                       |
|  Session Sync: Enabled                                            |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 7. SSL/TLS Inspection

### 7.1 SSL Decryption Architecture

```
+------------------------------------------------------------------+
|                   SSL/TLS INSPECTION                              |
+------------------------------------------------------------------+
|                                                                   |
|  Client         WAN Edge              NGFW              Server    |
|    |               |                   |                   |      |
|    |--TLS Hello--->|                   |                   |      |
|    |               |--Intercept------->|                   |      |
|    |               |                   |--TLS Hello------->|      |
|    |               |                   |<--Server Cert-----|      |
|    |               |<--Resign Cert-----|                   |      |
|    |<--Resign Cert-|                   |                   |      |
|    |               |                   |                   |      |
|    |===TLS Tunnel==|===Decrypt/Inspect=|===TLS Tunnel======|      |
|    |               |                   |                   |      |
|                                                                   |
|  Note: Requires trusted CA certificate on client devices          |
|                                                                   |
+------------------------------------------------------------------+
```

### 7.2 SSL Inspection Policy

```
! Categories to Decrypt
ssl-proxy 
 certificate-authority ABHAVTECH-INTERNAL-CA
 proxy-mode inline
 
 decrypt-categories
  business-and-economy
  general-interest
  technology
 !
 
 bypass-categories
  financial-services
  health-and-medicine
  government
 !
 
 bypass-domains
  *.abhavtech.com
  *.microsoft.com
  *.apple.com
  *.google.com
  *.bankofamerica.com
 !
!
```

---

## 8. Firewall Logging and Monitoring

### 8.1 Logging Architecture

```
+------------------------------------------------------------------+
|                   FIREWALL LOGGING                                |
+------------------------------------------------------------------+
|                                                                   |
|  WAN Edge / NGFW                                                  |
|       |                                                           |
|       |  Syslog/CEF                                              |
|       v                                                           |
|  +------------------+                                             |
|  | Log Aggregator   |                                             |
|  | (Splunk/ELK)     |                                             |
|  +--------+---------+                                             |
|           |                                                       |
|    +------+------+                                               |
|    |             |                                               |
|    v             v                                               |
|  +-------+   +-------+                                           |
|  | SIEM  |   | vMgr  |                                           |
|  |       |   |       |                                           |
|  +-------+   +-------+                                           |
|                                                                   |
|  Log Types:                                                       |
|  - Traffic logs (permit/deny)                                    |
|  - Threat logs (IPS alerts)                                      |
|  - URL logs (web filtering)                                      |
|  - Session logs (start/end)                                      |
|  - System logs (HA failover)                                     |
|                                                                   |
+------------------------------------------------------------------+
```

### 8.2 Logging Configuration

```
! WAN Edge Syslog Configuration
logging host 10.254.1.50 transport udp port 514
logging host 10.254.1.51 transport tcp port 6514 secure
logging trap informational
logging source-interface Loopback0

! Firewall Specific Logging
zone-pair security ZP-VPN-TO-INTERNET source VPN-ZONE destination INTERNET-ZONE
 service-policy type inspect PM-VPN-TO-INTERNET
  log
   dropped-packets
   sessions initiations-and-terminations
  !
!

! UTD Logging
utd engine standard
 logging host 10.254.1.50
 logging level info
!
```

### 8.3 Key Metrics and Alerts

| Metric | Threshold | Alert Level | Action |
|--------|-----------|-------------|--------|
| Dropped connections | >1000/min | Warning | Investigate |
| IPS alerts (high severity) | >10/hour | Critical | Immediate review |
| Zone policy violations | >100/hour | Warning | Review policy |
| DDoS indicators | Threshold breach | Critical | Auto-mitigation |
| SSL inspection failures | >5% | Warning | Check certificates |

---

## 9. Best Practices Summary

### 9.1 Zone-Based Firewall Best Practices

- Define clear zone boundaries aligned with security policy
- Use explicit zone pairs; avoid allowing all by default
- Enable stateful inspection for all permitted traffic
- Log all dropped and blocked traffic

### 9.2 Application Firewall Best Practices

- Maintain updated application signatures
- Create custom signatures for internal applications
- Use rate limiting instead of blocking where appropriate
- Monitor application usage trends

### 9.3 IPS/IDS Best Practices

- Update signatures daily
- Start in detection mode, move to prevention gradually
- Tune rules to minimize false positives
- Create custom rules for organization-specific threats

### 9.4 Third-Party NGFW Best Practices

- Ensure HA for all NGFW deployments
- Use service chaining for seamless integration
- Monitor health of service nodes
- Maintain consistent policies across platforms

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco SD-WAN Security Configuration Guide | Official security docs | cisco.com |
| Palo Alto SD-WAN Integration Guide | PA integration procedures | paloaltonetworks.com |
| Snort 3.0 User Manual | IPS rule writing | snort.org |
| Abhavtech Security Policy | Corporate security standards | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.6*
