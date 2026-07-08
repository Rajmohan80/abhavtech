# CHAPTER 7: INTEGRATION WITH PHASE 1 ZERO TRUST ARCHITECTURE

## 7.1 Zero Trust Integration Overview

### 7.1.1 Phase 1 Zero Trust Recap

Abhavtech's **Phase 1 Zero Trust Architecture** (deployed 2023-2024) established the security foundation:

**Core Components:**
- **Cisco ISE 3.3**: 802.1X authentication, SGT assignment, posture assessment, pxGrid
- **SD-Access Fabric**: VXLAN overlay, SGT propagation, SGACL enforcement
- **Duo MFA**: Multi-factor authentication for all users
- **TrustSec**: SGT-based micro-segmentation (50+ security zones)

**Phase 1 Security Policies:**

| Security Group Tag (SGT) | Description | Members | Trust Level |
|-------------------------|-------------|---------|-------------|
| **SGT 11** | Executives | C-suite, VPs, directors (210 users) | Highest |
| **SGT 15** | Employees (Corporate) | Regular employees (3,800 users) | High |
| **SGT 16** | Employees (Contractors) | Contractors, temps (1,200 users) | Medium |
| **SGT 21** | IoT Devices | Printers, cameras, sensors (2,500 devices) | Low |
| **SGT 70** | AI Cameras | Edge AI cameras (40 cameras) | Medium |
| **SGT 80** | Servers | App servers, databases (450 servers) | High |
| **SGT 90** | Infrastructure | Switches, routers, firewalls (200 devices) | Critical |

**SGACL Matrix (Simplified):**

```
Source SGT → Destination SGT: Policy

SGT 11 (Executives) → SGT 80 (Servers): Permit All
SGT 15 (Employees) → SGT 80 (Servers): Permit HTTP/HTTPS only
SGT 16 (Contractors) → SGT 80 (Servers): Deny All
SGT 21 (IoT) → SGT 80 (Servers): Permit specific ports (443, 8080)
SGT 70 (AI Cameras) → SGT 80 (Servers): Permit AI inference API (port 8000)
```

---

### 7.1.2 Phase 5 Integration Goals

**Objective**: Extend Phase 1 Zero Trust security to WiFi 7 wireless clients without compromising performance.

**Key Requirements:**

1. **Seamless Authentication**: WiFi 7 clients authenticate via 802.1X (same as wired)
2. **SGT Consistency**: Wireless clients receive same SGT as wired (no security policy changes)
3. **pxGrid Context Sharing**: WiFi 7 client metadata (RSSI, AP, MLO status) shared with XDR/Splunk
4. **SGACL Enforcement**: Zero Trust policies enforced for wireless traffic (same as wired)
5. **MLO Compatibility**: SGT maintained during MLO link failover (Link 0 ↔ Link 1)
6. **Performance**: Zero Trust overhead <5ms (target: <2ms for SGT tagging)

---

### 7.1.3 Integration Architecture

**WiFi 7 + Zero Trust Data Flow:**

```
┌──────────────────────────────────────────────────────────────────┐
│            WIFI 7 ZERO TRUST INTEGRATION ARCHITECTURE            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Executive Laptop (WiFi 7 Client)                                │
│  MAC: AA:BB:CC:DD:EE:FF                                          │
│  User: john.exec@abhavtech.com                                   │
│         │                                                         │
│         │ 1. RADIUS Access-Request (802.1X EAP-TLS)              │
│         ▼                                                         │
│  ┌────────────────────┐                                          │
│  │ WiFi 7 AP (C9178I) │                                          │
│  │ SSID: Corp-Secure-7│                                          │
│  └──────────┬─────────┘                                          │
│             │ 2. RADIUS forwarding to WLC                        │
│             ▼                                                     │
│  ┌────────────────────┐                                          │
│  │ WLC (C9800-40)     │                                          │
│  │ IOS-XE 17.16.1     │                                          │
│  └──────────┬─────────┘                                          │
│             │ 3. RADIUS Access-Request to ISE                    │
│             ▼                                                     │
│  ┌──────────────────────────────────────────┐                   │
│  │ ISE 3.3 (Policy Server)                  │                   │
│  │ ┌──────────────────────────────────────┐ │                   │
│  │ │ Authentication:                      │ │                   │
│  │ │ • User: john.exec@abhavtech.com      │ │                   │
│  │ │ • AD Group: Executives               │ │                   │
│  │ │ • Duo MFA: Verified                  │ │                   │
│  │ │ • Certificate: Valid (EAP-TLS)       │ │                   │
│  │ └──────────────────────────────────────┘ │                   │
│  │ ┌──────────────────────────────────────┐ │                   │
│  │ │ Authorization:                       │ │                   │
│  │ │ • SGT: 11 (Executives)               │ │                   │
│  │ │ • VLAN: CORP-EXEC (10.150.11.0/24)   │ │                   │
│  │ │ • ACL: None (SGT-based only)         │ │                   │
│  │ │ • Session-Timeout: 86400 (24 hours)  │ │                   │
│  │ └──────────────────────────────────────┘ │                   │
│  │ ┌──────────────────────────────────────┐ │                   │
│  │ │ Posture Assessment:                  │ │                   │
│  │ │ • OS: Windows 11 (compliant)         │ │                   │
│  │ │ • AV: Defender (up-to-date)          │ │                   │
│  │ │ • Encryption: BitLocker (enabled)    │ │                   │
│  │ │ • Result: Compliant ✓                │ │                   │
│  │ └──────────────────────────────────────┘ │                   │
│  └──────────┬───────────────────────────────┘                   │
│             │ 4. RADIUS Access-Accept + SGT 11                   │
│             ▼                                                     │
│  ┌────────────────────┐                                          │
│  │ WLC (C9800-40)     │                                          │
│  │ Receives SGT 11    │                                          │
│  └──────────┬─────────┘                                          │
│             │ 5. Client association + SGT inline tagging         │
│             ▼                                                     │
│  ┌────────────────────┐                                          │
│  │ WiFi 7 AP          │                                          │
│  │ Tags client with   │                                          │
│  │ SGT 11 (both MLO   │                                          │
│  │ links: 5G + 6G)    │                                          │
│  └──────────┬─────────┘                                          │
│             │ 6. Client traffic (tagged with SGT 11)            │
│             ▼                                                     │
│  ┌────────────────────┐                                          │
│  │ Fabric Edge Switch │                                          │
│  │ (Catalyst 9300)    │                                          │
│  │ • VXLAN encap      │                                          │
│  │ • SGT inline tag   │                                          │
│  │   (802.1Q 4-byte)  │                                          │
│  └──────────┬─────────┘                                          │
│             │ 7. VXLAN + SGT to fabric                           │
│             ▼                                                     │
│  ┌────────────────────┐                                          │
│  │ Fabric Underlay    │                                          │
│  │ (IS-IS routing)    │                                          │
│  └──────────┬─────────┘                                          │
│             │ 8. Destination with SGACL enforcement              │
│             ▼                                                     │
│  ┌────────────────────┐                                          │
│  │ App Server (SGT 80)│                                          │
│  │ SGACL Check:       │                                          │
│  │ SGT 11 → SGT 80    │                                          │
│  │ = Permit All ✓     │                                          │
│  └────────────────────┘                                          │
│                                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ Parallel Process: pxGrid Context Sharing │                   │
│  │                                          │                   │
│  │ ISE → pxGrid → Splunk/XDR               │                   │
│  │ Client metadata:                         │                   │
│  │ • MAC: AA:BB:CC:DD:EE:FF                 │                   │
│  │ • User: john.exec@abhavtech.com          │                   │
│  │ • SGT: 11 (Executives)                   │                   │
│  │ • AP: MUM-F6-AP01                        │                   │
│  │ • RSSI: -58 dBm (6 GHz)                  │                   │
│  │ • MLO: Enabled (Link 0 + Link 1)         │                   │
│  │ • Session Start: 2025-05-15 09:23:45     │                   │
│  └──────────────────────────────────────────┘                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7.2 ISE 802.1X Authentication for WiFi 7

### 7.2.1 SSID Configuration (WLC)

**WiFi 7 SSID: Corp-Secure-7**

```cisco
# WLC Configuration (Catalyst 9800-40, IOS-XE 17.16.1)

wlan Corp-Secure-7 1 Corp-Secure-7
 security wpa psk set-key ascii 0 <hidden>
 security wpa akm ft psk
 security wpa akm dot1x
 security wpa wpa3
 security ft adaptive
 security pmf mandatory
 no shutdown

# MLO Configuration (WiFi 7 specific)
wlan Corp-Secure-7
 multi-link enable

# RADIUS Configuration
radius server ISE-PSN-1
 address ipv4 10.252.1.10 auth-port 1812 acct-port 1813
 timeout 5
 retransmit 3
 key 7 <encrypted_key>
 
radius server ISE-PSN-2
 address ipv4 10.252.1.11 auth-port 1812 acct-port 1813
 timeout 5
 retransmit 3
 key 7 <encrypted_key>

# AAA Configuration
aaa new-model
aaa group server radius ISE-RADIUS
 server name ISE-PSN-1
 server name ISE-PSN-2
 
aaa authentication dot1x default group ISE-RADIUS
aaa authorization network default group ISE-RADIUS
aaa accounting dot1x default start-stop group ISE-RADIUS

# Apply to WLAN
wlan Corp-Secure-7
 aaa-override
 security dot1x authentication-list ISE-RADIUS
```

---

### 7.2.2 ISE Policy Configuration

**Authentication Policy (ISE 3.3):**

```
Policy Set: Wireless_802.1X
  Condition: Wireless_MAB = False AND NAS-Port-Type = Wireless-802.11
  Allowed Protocols: Default Network Access (EAP-TLS, PEAP-MSCHAPv2)
  Authentication Profile: AD_Authentication
  
  Result:
    • Continue to Authorization Policy
```

**Authorization Policy (ISE 3.3):**

```yaml
Policy Name: Executives_Wireless
  Conditions:
    • AD Group = CN=Executives,OU=Groups,DC=abhavtech,DC=com
    • Posture Status = Compliant
    • Wireless_SSID = Corp-Secure-7
  
  Authorization Result:
    • VLAN: CORP-EXEC (10.150.11.0/24)
    • SGT: 11 (Executives)
    • DACL: None (SGT-based policy only)
    • Session-Timeout: 86400 (24 hours)
    • Re-Authentication: Disabled (avoid MLO disruption)
    • RADIUS Attribute: cisco-av-pair = "cts:security-group-tag=0011-00"

Policy Name: Employees_Wireless
  Conditions:
    • AD Group = CN=Employees,OU=Groups,DC=abhavtech,DC=com
    • Posture Status = Compliant
    • Wireless_SSID = Corp-Secure-7
  
  Authorization Result:
    • VLAN: CORP-EMP (10.150.15.0/24)
    • SGT: 15 (Employees)
    • Session-Timeout: 86400
    • RADIUS Attribute: cisco-av-pair = "cts:security-group-tag=0015-00"

Policy Name: Contractors_Wireless
  Conditions:
    • AD Group = CN=Contractors,OU=Groups,DC=abhavtech,DC=com
    • Posture Status = Compliant
    • Wireless_SSID = Corp-Secure-7
  
  Authorization Result:
    • VLAN: CORP-CONTRACTOR (10.150.16.0/24)
    • SGT: 16 (Contractors)
    • Session-Timeout: 43200 (12 hours, shorter session)
    • RADIUS Attribute: cisco-av-pair = "cts:security-group-tag=0016-00"

Policy Name: AI_Cameras_Wireless
  Conditions:
    • Device-Type = IP-Camera
    • OUI = 00:40:8C (Axis Communications)
    • Wireless_SSID = Corp-Secure-7
  
  Authorization Result:
    • VLAN: IOT-CAMERAS (10.150.1.128/25)
    • SGT: 70 (AI Cameras)
    • Session-Timeout: 86400
    • DACL: DACL-CAMERA (permit to UCS XE9305 only)
    • RADIUS Attribute: cisco-av-pair = "cts:security-group-tag=0070-00"
```

---

### 7.2.3 EAP Methods & Security

**Supported EAP Methods:**

| EAP Method | Security | Use Case | Client Support | Recommendation |
|------------|----------|----------|----------------|----------------|
| **EAP-TLS** | Highest (certificate-based, mutual auth) | Executives, corporate laptops | Windows, macOS, Linux | **Preferred** |
| **PEAP-MSCHAPv2** | High (password-based, server cert) | General employees, BYOD | All platforms | **Acceptable** |
| **EAP-FAST** | Medium (PAC-based) | Legacy devices | Limited support | **Discouraged** |

**Certificate Requirements (EAP-TLS):**

```yaml
User Certificate (Issued to: john.exec@abhavtech.com):
  Issuer: Abhavtech Internal CA
  Subject: CN=john.exec@abhavtech.com,OU=Executives,O=Abhavtech,C=IN
  Key Usage: Digital Signature, Key Encipherment
  Enhanced Key Usage: Client Authentication (1.3.6.1.5.5.7.3.2)
  Validity: 2 years
  
Server Certificate (Issued to: ISE Policy Server):
  Issuer: Abhavtech Internal CA
  Subject: CN=ise-psn-1.abhavtech.com,OU=IT,O=Abhavtech,C=IN
  SAN: DNS:ise-psn-1.abhavtech.com, IP:10.252.1.10
  Key Usage: Digital Signature, Key Encipherment
  Enhanced Key Usage: Server Authentication (1.3.6.1.5.5.7.3.1)
  Validity: 5 years
```

---

### 7.2.4 802.1X Authentication Flow (Detailed)

**Step-by-Step (Executive Laptop Connecting to WiFi 7):**

```
Time  Event  Description
────  ─────  ───────────────────────────────────────────────────────
T+0   Client: Laptop scans for SSIDs, detects "Corp-Secure-7"
      Action: User selects "Corp-Secure-7" in WiFi settings
      
T+1   Client: Sends Probe Request to WiFi 7 AP
      AP: Responds with Probe Response (SSID capabilities)
      
T+2   Client: Sends 802.11 Authentication Request
      AP: Responds with Authentication Response (Success)
      
T+3   Client: Sends 802.11 Association Request
      AP: Holds association, initiates 802.1X
      
T+4   AP → WLC: Forward 802.1X to WLC
      WLC: Forward 802.1X to ISE (RADIUS Access-Request)
      
T+5   ISE: EAP-TLS negotiation starts
      ISE → Client: EAP-Request/Identity
      Client → ISE: EAP-Response/Identity (john.exec@abhavtech.com)
      
T+6   ISE: Presents server certificate (ise-psn-1.abhavtech.com)
      Client: Validates server certificate (trusted CA)
      Client: Presents user certificate (john.exec@abhavtech.com)
      ISE: Validates user certificate
      
T+7   ISE: Certificate validated ✓
      ISE: Check AD group (Executives) ✓
      ISE: Check posture (AnyConnect, compliant) ✓
      ISE: Duo MFA push notification sent to user's phone
      
T+8   User: Approves Duo MFA on phone (push notification)
      ISE: MFA verified ✓
      
T+9   ISE: Authorization decision:
        • SGT: 11 (Executives)
        • VLAN: CORP-EXEC (10.150.11.0/24)
        • Session-Timeout: 86400
      ISE → WLC: RADIUS Access-Accept
        • cisco-av-pair = "cts:security-group-tag=0011-00"
        • Tunnel-Private-Group-ID = 1011 (VLAN)
        
T+10  WLC → AP: Client authorized, SGT 11 assigned
      AP: Complete 802.11 Association
      AP → Client: Association Response (Success)
      
T+11  Client: DHCP Discover on VLAN 1011 (CORP-EXEC)
      DHCP Server: Offer IP 10.150.11.50
      Client: DHCP Request
      DHCP Server: ACK (IP assigned)
      
T+12  Client: Connected to WiFi 7, SGT 11 tagged
      AP: Tags all client traffic with SGT 11 (inline tagging)
      
Total Time: 12 seconds (typical EAP-TLS + Duo MFA)
Success: ✓ Client authenticated and authorized
```

---

## 7.3 SGT Assignment & Propagation

### 7.3.1 SGT Assignment Methods

**Three Methods for WiFi 7 Clients:**

| Method | Description | Use Case | Priority |
|--------|-------------|----------|----------|
| **RADIUS-based (ISE)** | ISE assigns SGT via RADIUS attribute | User authentication (executives, employees) | **Primary** |
| **IP-to-SGT Mapping (Manual)** | Static IP → SGT mapping in ISE | Legacy devices (no 802.1X) | Secondary |
| **SXP (SGT Exchange Protocol)** | SGT learning between network devices | Cross-domain SGT propagation | Tertiary |

**RADIUS-based SGT Assignment (Preferred):**

```cisco
# ISE RADIUS Response (Access-Accept)

Attributes:
  User-Name = "john.exec@abhavtech.com"
  Tunnel-Type = VLAN
  Tunnel-Medium-Type = 802
  Tunnel-Private-Group-ID = "1011"  # VLAN 1011 (CORP-EXEC)
  cisco-av-pair = "cts:security-group-tag=0011-00"  # SGT 11 (Executives)
  cisco-av-pair = "cts:role-based-enforcement=enabled"
  Session-Timeout = 86400

# WLC receives RADIUS response, applies SGT 11 to client
```

---

### 7.3.2 SGT Inline Tagging (802.1Q 4-byte)

**Ethernet Frame with SGT:**

```
┌──────────────────────────────────────────────────────────────┐
│  Standard 802.3 Ethernet Frame (Pre-SGT)                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────┬────────┬────────┬─────────────┬──────┬────────┐ │
│  │  Dest  │  Src   │ EthType│   Payload   │ FCS  │        │ │
│  │  MAC   │  MAC   │ (0x0800│             │      │        │ │
│  │ (6 B)  │ (6 B)  │  IPv4) │             │(4 B) │        │ │
│  └────────┴────────┴────────┴─────────────┴──────┴────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  802.1Q Frame with SGT Inline Tag (Post-SGT)                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────┬────────┬──────┬────────┬─────────┬──────┬─────┐ │
│  │  Dest  │  Src   │802.1Q│  SGT   │ Payload │ FCS  │     │ │
│  │  MAC   │  MAC   │ Tag  │ (4 B)  │         │      │     │ │
│  │ (6 B)  │ (6 B)  │(4 B) │        │         │(4 B) │     │ │
│  └────────┴────────┴──────┴────────┴─────────┴──────┴─────┘ │
│                            │                                 │
│                            │                                 │
│                            ▼                                 │
│              SGT Field Breakdown (4 bytes):                  │
│              ┌─────────────────────────────┐                 │
│              │ EtherType: 0x8909 (2 bytes) │                 │
│              │ Length: 0x0006 (6 bytes)    │                 │
│              │ SGT: 0x000B (SGT 11 = 0x0B)│                 │
│              │ Reserved: 0x0000            │                 │
│              └─────────────────────────────┘                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Example (Executive Laptop, SGT 11):
  Source MAC: AA:BB:CC:DD:EE:FF (Executive laptop)
  802.1Q Tag: VLAN 1011 (CORP-EXEC)
  SGT Inline Tag: 0x000B (SGT 11)
  
  Interpretation:
    This traffic is from an "Executive" user (SGT 11)
    Destination receives SGT tag, enforces SGACL policy
```

---

### 7.3.3 SGT Propagation Across Fabric

**SD-Access Fabric SGT Propagation:**

```
┌──────────────────────────────────────────────────────────────┐
│       SGT PROPAGATION: WIFI 7 CLIENT → SERVER                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Executive Laptop (WiFi 7)                                   │
│  MAC: AA:BB:CC:DD:EE:FF                                      │
│  IP: 10.150.11.50                                            │
│  SGT: 11 (Executives)                                        │
│         │                                                     │
│         │ Packet: 10.150.11.50 → 10.150.80.10 (App Server)   │
│         │ SGT: 11 (inline tagged by AP)                      │
│         ▼                                                     │
│  ┌────────────────────┐                                      │
│  │ Fabric Edge Switch │                                      │
│  │ (Catalyst 9300)    │                                      │
│  │                    │                                      │
│  │ Actions:           │                                      │
│  │ 1. Receive SGT 11  │                                      │
│  │ 2. VXLAN encap     │                                      │
│  │ 3. Preserve SGT 11 │                                      │
│  │    in VXLAN header │                                      │
│  └──────────┬─────────┘                                      │
│             │ VXLAN Packet: 10.150.11.50 → 10.150.80.10      │
│             │ Outer Header: Fabric Edge IP → Fabric Border IP │
│             │ Inner Header: Client IP → Server IP             │
│             │ SGT: 11 (preserved in VXLAN)                    │
│             ▼                                                 │
│  ┌────────────────────┐                                      │
│  │ Fabric Underlay    │                                      │
│  │ (IS-IS Routing)    │                                      │
│  └──────────┬─────────┘                                      │
│             │ Route to Fabric Border Node                     │
│             ▼                                                 │
│  ┌────────────────────┐                                      │
│  │ Fabric Border Node │                                      │
│  │ (Catalyst 9500)    │                                      │
│  │                    │                                      │
│  │ Actions:           │                                      │
│  │ 1. VXLAN decap     │                                      │
│  │ 2. Extract SGT 11  │                                      │
│  │ 3. Forward to      │                                      │
│  │    destination     │                                      │
│  └──────────┬─────────┘                                      │
│             │ Packet: 10.150.11.50 → 10.150.80.10            │
│             │ SGT: 11 (inline tagged)                         │
│             ▼                                                 │
│  ┌────────────────────┐                                      │
│  │ App Server Switch  │                                      │
│  │                    │                                      │
│  │ SGACL Enforcement: │                                      │
│  │ Source SGT: 11     │                                      │
│  │ Dest SGT: 80       │                                      │
│  │ Policy: Permit All │                                      │
│  │ Result: ✓ ALLOW    │                                      │
│  └──────────┬─────────┘                                      │
│             │ Packet delivered to server                      │
│             ▼                                                 │
│  ┌────────────────────┐                                      │
│  │ App Server         │                                      │
│  │ IP: 10.150.80.10   │                                      │
│  │ SGT: 80 (Servers)  │                                      │
│  └────────────────────┘                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key Points:**
- SGT assigned at ISE (RADIUS)
- SGT inline-tagged by WiFi 7 AP (802.1Q 4-byte)
- SGT preserved in VXLAN encapsulation (fabric transit)
- SGT enforced at destination (SGACL check: SGT 11 → SGT 80)

---

### 7.3.4 MLO & SGT Interaction

**Critical Question**: Does SGT persist during MLO link failover (6 GHz → 5 GHz)?

**Answer**: ✅ **YES**, SGT is session-based (not link-based).

**MLO Failover Workflow:**

```yaml
Scenario: Executive laptop (SGT 11) experiences 6 GHz degradation, MLO fails over to 5 GHz

Before Failover:
  Client: AA:BB:CC:DD:EE:FF (Executive laptop)
  MLO Link 0 (5 GHz): Idle (backup)
  MLO Link 1 (6 GHz): Active (primary, transmitting traffic)
  SGT: 11 (assigned at 802.1X authentication)
  
Failover Trigger:
  6 GHz RSSI drops below -75 dBm (poor signal)
  MLO initiates failover to 5 GHz Link 0
  
During Failover (3-5ms):
  WiFi 7 AP: Switches traffic to Link 0 (5 GHz)
  WLC: Maintains client session (SGT 11 unchanged)
  ISE: No re-authentication required (session persists)
  
After Failover:
  MLO Link 0 (5 GHz): Active (now primary)
  MLO Link 1 (6 GHz): Idle (attempting to recover)
  SGT: 11 (UNCHANGED) ✓
  
Result:
  ✓ Zero packet loss during failover
  ✓ SGT maintained (no SGACL policy disruption)
  ✓ User unaware of link change (transparent)
```

**Verification Commands:**

```cisco
# WLC: Verify client SGT after MLO failover

show wireless client mac-address AABB.CCDD.EEFF detail

Client MAC Address : AABB.CCDD.EEFF
...
AP Name            : MUM-F6-AP01
WLAN Profile Name  : Corp-Secure-7
Security Group Tag : 11-00  # SGT 11 (Executives) ✓
MLO Status         : Enabled
  Link 0 (5 GHz)   : Active (CURRENT) ✓
  Link 1 (6 GHz)   : Idle (attempting recovery)
...

# Fabric Edge Switch: Verify SGT inline tagging

show cts role-based counters

Role-based counters:
  SGT 11 → SGT 80: 12,450 packets (Permit) ✓
  # Traffic still flowing with SGT 11 after failover
```

---

## 7.4 pxGrid Integration

### 7.4.1 pxGrid Architecture

**Purpose**: Share WiFi 7 client context from ISE to security tools (XDR, Splunk, SIEM).

**pxGrid Publishers & Subscribers:**

```
┌──────────────────────────────────────────────────────────────┐
│                 PXGRID INTEGRATION ARCHITECTURE              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │ ISE 3.3 (pxGrid Publisher)                     │         │
│  │                                                 │         │
│  │ Publishing Topics:                              │         │
│  │ • SessionTopic                                  │         │
│  │   (user sessions, 802.1X events)                │         │
│  │ • TrustSecMetaDataTopic                         │         │
│  │   (SGT assignments, changes)                    │         │
│  │ • EndpointProfileMetaDataTopic                  │         │
│  │   (device profiling, OS, hardware)              │         │
│  └────────────┬───────────────────────────────────┘         │
│               │ pxGrid WebSocket (TLS 1.2+)                  │
│               │                                               │
│      ┌────────┼────────┬─────────────┬────────────┐         │
│      │                 │             │            │         │
│      ▼                 ▼             ▼            ▼         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Splunk   │  │   XDR    │  │ServiceNow│  │  Custom  │  │
│  │Enterprise│  │ (SecureX)│  │ (ITSM)   │  │  Python  │  │
│  │          │  │          │  │          │  │  Script  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│  Subscriber    Subscriber    Subscriber    Subscriber      │
│                                                              │
│  Use Cases:                                                  │
│  • Splunk: WiFi 7 client analytics, performance dashboards  │
│  • XDR: Threat detection, anomaly detection                 │
│  • ServiceNow: Automated ticketing, user onboarding         │
│  • Custom Script: WiFi 7 reporting, compliance audits       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 7.4.2 pxGrid Session Data (WiFi 7 Client)

**Example pxGrid SessionTopic Message (Executive Laptop):**

```json
{
  "timestamp": "2025-05-15T09:23:45.123Z",
  "eventType": "SessionStart",
  "sessionId": "0A0B0C0D0E0F",
  "userName": "john.exec@abhavtech.com",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "ipAddress": "10.150.11.50",
  "nasIpAddress": "10.252.2.10",  # WLC IP
  "nasPortId": "MUM-F6-AP01",      # WiFi 7 AP name
  "nasIdentifier": "WLC-MUM-01",
  "calledStationId": "AA:11:22:33:44:55:Corp-Secure-7",  # AP MAC + SSID
  "callingStationId": "AA:BB:CC:DD:EE:FF",  # Client MAC
  "securityGroupTag": "11",  # SGT 11 (Executives)
  "postureStatus": "Compliant",
  "adGroups": ["CN=Executives,OU=Groups,DC=abhavtech,DC=com"],
  "deviceType": "Laptop",
  "operatingSystem": "Windows 11 Pro",
  "location": "Mumbai HQ, Floor 6",
  "vlan": "1011",  # CORP-EXEC VLAN
  "authenticationMethod": "EAP-TLS",
  "authenticationStatus": "Success",
  "wirelessDetails": {
    "ssid": "Corp-Secure-7",
    "apName": "MUM-F6-AP01",
    "apMacAddress": "AA:11:22:33:44:55",
    "apIpAddress": "10.150.11.1",
    "radioType": "WiFi 7 (802.11be)",
    "frequency": "6 GHz",
    "channel": "31",
    "channelWidth": "320 MHz",
    "rssi": -58,  # dBm
    "snr": 42,    # dB
    "txRate": 5764,  # Mbps (MLO aggregate)
    "rxRate": 5764,
    "mloEnabled": true,
    "mloLinks": [
      {"linkId": 0, "band": "5 GHz", "channel": 36, "width": "160 MHz", "status": "backup"},
      {"linkId": 1, "band": "6 GHz", "channel": 31, "width": "320 MHz", "status": "active"}
    ]
  },
  "duoMfa": {
    "status": "Success",
    "method": "Duo Push",
    "timestamp": "2025-05-15T09:23:40.000Z"
  }
}
```

**Key Fields for Security Analytics:**
- **userName**: Identify user (executive vs employee vs contractor)
- **securityGroupTag**: SGT for policy enforcement
- **postureStatus**: Compliant (patched, AV updated) vs Non-Compliant
- **wirelessDetails**: WiFi 7-specific metadata (MLO, 6 GHz, 320 MHz)
- **rssi/snr**: Signal quality (detect connectivity issues)

---

### 7.4.3 Splunk Dashboard (WiFi 7 Clients)

**Splunk Query: WiFi 7 Client Summary**

```splunk
index=pxgrid sourcetype=ise_session
| search wirelessDetails.radioType="WiFi 7 (802.11be)"
| stats 
    count as total_sessions,
    dc(userName) as unique_users,
    avg(wirelessDetails.rssi) as avg_rssi,
    avg(wirelessDetails.snr) as avg_snr,
    sum(eval(if(postureStatus="Compliant",1,0))) as compliant_count,
    sum(eval(if(postureStatus!="Compliant",1,0))) as non_compliant_count
  by wirelessDetails.ssid, securityGroupTag
| eval compliance_rate = round((compliant_count / total_sessions) * 100, 2)
| eval avg_rssi = round(avg_rssi, 1)
| eval avg_snr = round(avg_snr, 1)
| table wirelessDetails.ssid, securityGroupTag, total_sessions, unique_users, avg_rssi, avg_snr, compliance_rate
| rename 
    wirelessDetails.ssid as SSID,
    securityGroupTag as SGT,
    total_sessions as "Total Sessions",
    unique_users as "Unique Users",
    avg_rssi as "Avg RSSI (dBm)",
    avg_snr as "Avg SNR (dB)",
    compliance_rate as "Compliance %"
```

**Example Output:**

| SSID | SGT | Total Sessions | Unique Users | Avg RSSI (dBm) | Avg SNR (dB) | Compliance % |
|------|-----|----------------|--------------|----------------|--------------|--------------|
| Corp-Secure-7 | 11 (Executives) | 1,250 | 80 | -58.3 | 41.8 | 100.0% ✓ |
| Corp-Secure-7 | 15 (Employees) | 8,420 | 3,800 | -62.1 | 38.2 | 98.5% ✓ |
| Corp-Secure-7 | 16 (Contractors) | 920 | 1,200 | -65.8 | 34.5 | 95.2% ✓ |
| Corp-Secure-7 | 70 (AI Cameras) | 40 | 40 | -55.2 | 44.1 | 100.0% ✓ |

**Insights:**
- Executives (SGT 11) have best signal quality (-58.3 dBm, high-density AP deployment)
- 100% posture compliance for executives and AI cameras ✓
- Employees/contractors slightly lower compliance (acceptable, 95%+)

---

## 7.5 SGACL Enforcement Over Wireless

### 7.5.1 SGACL Policy Matrix

**Abhavtech's SGACL Policies (WiFi 7 Clients):**

```
Source SGT → Destination SGT: Policy

SGT 11 (Executives) → SGT 80 (Servers):
  • Permit IP (Any)
  • Rationale: Executives need full access to corporate apps
  
SGT 15 (Employees) → SGT 80 (Servers):
  • Permit TCP 443 (HTTPS)
  • Permit TCP 80 (HTTP)
  • Deny IP (Any)
  • Rationale: Employees limited to web apps only
  
SGT 16 (Contractors) → SGT 80 (Servers):
  • Deny IP (Any)
  • Rationale: Contractors cannot access internal servers
  
SGT 70 (AI Cameras) → SGT 80 (Servers):
  • Permit TCP 8000 (AI inference API)
  • Deny IP (Any)
  • Rationale: Cameras only access UCS XE9305 inference endpoint
  
SGT 11 (Executives) → SGT 90 (Infrastructure):
  • Permit TCP 22 (SSH)
  • Permit TCP 443 (HTTPS, API)
  • Deny IP (Any)
  • Rationale: Executives can manage network infrastructure
  
SGT 15 (Employees) → SGT 90 (Infrastructure):
  • Deny IP (Any)
  • Rationale: Employees cannot access network infrastructure
```

---

### 7.5.2 SGACL Configuration (ISE)

**ISE: TrustSec → Egress Policy Matrix**

```
Policy Name: Executives_to_Servers
  Source SGT: 11-00 (Executives)
  Destination SGT: 80-00 (Servers)
  SGACLs: SGACL-PERMIT-ALL
  
  SGACL Definition (SGACL-PERMIT-ALL):
    permit ip
    # Allows all IP traffic from Executives to Servers
```

```
Policy Name: Employees_to_Servers
  Source SGT: 15-00 (Employees)
  Destination SGT: 80-00 (Servers)
  SGACLs: SGACL-WEB-ONLY
  
  SGACL Definition (SGACL-WEB-ONLY):
    permit tcp dst eq 443  # HTTPS
    permit tcp dst eq 80   # HTTP
    deny ip
    # Employees limited to web traffic only
```

```
Policy Name: Contractors_to_Servers
  Source SGT: 16-00 (Contractors)
  Destination SGT: 80-00 (Servers)
  SGACLs: SGACL-DENY-ALL
  
  SGACL Definition (SGACL-DENY-ALL):
    deny ip
    # Contractors blocked from all server access
```

```
Policy Name: AI_Cameras_to_Servers
  Source SGT: 70-00 (AI Cameras)
  Destination SGT: 80-00 (Servers)
  SGACLs: SGACL-AI-INFERENCE
  
  SGACL Definition (SGACL-AI-INFERENCE):
    permit tcp dst eq 8000  # UCS XE9305 AI inference API
    deny ip
    # Cameras only access inference endpoint
```

---

### 7.5.3 SGACL Enforcement Example

**Scenario 1: Executive (SGT 11) Accesses App Server (SGT 80)**

```yaml
Workflow:
  1. Executive laptop (AA:BB:CC:DD:EE:FF, SGT 11) sends packet to App Server (10.150.80.10, SGT 80)
  2. WiFi 7 AP inline-tags packet with SGT 11
  3. Packet traverses fabric (SGT 11 preserved in VXLAN)
  4. App Server switch receives packet, enforces SGACL
  
SGACL Check:
  Source SGT: 11 (Executives)
  Destination SGT: 80 (Servers)
  Policy: SGACL-PERMIT-ALL (permit ip)
  
Result: ✓ ALLOW
  Packet delivered to server (10.150.80.10)
```

---

**Scenario 2: Contractor (SGT 16) Attempts to Access App Server (SGT 80)**

```yaml
Workflow:
  1. Contractor laptop (BB:CC:DD:EE:FF:11, SGT 16) sends packet to App Server (10.150.80.10, SGT 80)
  2. WiFi 7 AP inline-tags packet with SGT 16
  3. Packet traverses fabric (SGT 16 preserved in VXLAN)
  4. App Server switch receives packet, enforces SGACL
  
SGACL Check:
  Source SGT: 16 (Contractors)
  Destination SGT: 80 (Servers)
  Policy: SGACL-DENY-ALL (deny ip)
  
Result: ✗ DENY
  Packet dropped (logged in Splunk/XDR for security audit)
```

**Security Log (pxGrid → Splunk):**

```json
{
  "timestamp": "2025-05-15T14:32:10.456Z",
  "eventType": "SGACLDeny",
  "srcMAC": "BB:CC:DD:EE:FF:11",
  "srcIP": "10.150.16.75",
  "srcSGT": "16",  # Contractors
  "dstIP": "10.150.80.10",
  "dstSGT": "80",  # Servers
  "policy": "SGACL-DENY-ALL",
  "action": "Deny",
  "reason": "Contractors not authorized to access internal servers"
}
```

---

**Scenario 3: AI Camera (SGT 70) Accesses UCS Inference API (SGT 80)**

```yaml
Workflow:
  1. AI Camera (10.150.1.150, SGT 70) sends TCP packet to UCS XE9305 (10.150.80.10:8000, SGT 80)
  2. WiFi 7 AP inline-tags packet with SGT 70
  3. Packet traverses fabric (SGT 70 preserved)
  4. UCS switch receives packet, enforces SGACL
  
SGACL Check:
  Source SGT: 70 (AI Cameras)
  Destination SGT: 80 (Servers)
  Destination Port: TCP 8000
  Policy: SGACL-AI-INFERENCE (permit tcp dst eq 8000)
  
Result: ✓ ALLOW (Port 8000)
  Packet delivered to UCS XE9305 inference API

Alternate Test (Camera attempts to access port 22, SSH):
  Source SGT: 70
  Destination SGT: 80
  Destination Port: TCP 22
  Policy: SGACL-AI-INFERENCE (deny ip, after permit tcp 8000)
  
Result: ✗ DENY (Port 22 not allowed)
  Packet dropped (cameras only allowed to access port 8000)
```

---

## 7.6 Performance Impact Analysis

### 7.6.1 Zero Trust Overhead Measurement

**Test: Latency Impact of SGT Tagging**

```yaml
Test Setup:
  • Executive laptop (WiFi 7, SGT 11)
  • Ping test: Laptop → App Server (10.150.80.10, SGT 80)
  • Measure latency with and without SGT enforcement

Test 1: Baseline (No SGT, hypothetical)
  Ping: 10.150.11.50 → 10.150.80.10
  Latency: 6.5ms (WiFi 7 transmission + fabric transit)

Test 2: With SGT Enforcement (Production)
  Ping: 10.150.11.50 → 10.150.80.10
  Latency: 7.2ms (WiFi 7 + fabric + SGACL check)
  
SGT Overhead: 7.2ms - 6.5ms = 0.7ms ✓ (Target: <2ms)

Analysis:
  • SGT inline tagging: <0.1ms (hardware acceleration)
  • VXLAN SGT preservation: <0.1ms (negligible)
  • SGACL enforcement: ~0.5ms (TCAM lookup at destination switch)
  • Total overhead: 0.7ms (well within <2ms target) ✓
```

---

### 7.6.2 Throughput Impact

**Test: iPerf3 Throughput with SGT Enforcement**

```bash
# Test: Executive laptop (SGT 11) → iPerf3 server (SGT 80)

iperf3 -c 10.150.80.10 -t 60 -P 4

Results:
  Without SGT (hypothetical): 4.6 Gbps
  With SGT (production): 4.5 Gbps
  
Throughput Impact: 4.6 - 4.5 = 0.1 Gbps (2.2% overhead)

Analysis:
  • SGT tagging overhead: Negligible (<1%)
  • SGACL TCAM lookup: Hardware-accelerated (line-rate)
  • Result: Zero Trust security with minimal performance impact ✓
```

---

## 7.7 Zero Trust Integration Summary

### 7.7.1 Key Achievements

**Phase 5 WiFi 7 + Phase 1 Zero Trust Integration:**

| Capability | Status | Performance |
|------------|--------|-------------|
| **802.1X Authentication** | ✅ Seamless (EAP-TLS, PEAP) | 12 sec total (including Duo MFA) |
| **SGT Assignment** | ✅ RADIUS-based (ISE) | SGT assigned at authentication |
| **SGT Propagation** | ✅ Inline tagging + VXLAN | SGT preserved across fabric |
| **MLO + SGT** | ✅ SGT maintained during failover | Zero disruption |
| **pxGrid Sharing** | ✅ Real-time context to Splunk/XDR | <1 sec latency |
| **SGACL Enforcement** | ✅ Wireless clients enforced | Same policy as wired |
| **Performance Overhead** | ✅ <1ms latency, <3% throughput | Minimal impact |

**Security Posture:**
- ✅ **Identity-based access**: Every WiFi 7 client authenticated (802.1X)
- ✅ **Least-privilege access**: SGT-based micro-segmentation (50+ zones)
- ✅ **Posture assessment**: Non-compliant devices blocked (AV, patches, encryption)
- ✅ **Visibility**: Real-time client context (pxGrid → Splunk/XDR)
- ✅ **Audit trail**: All SGACL deny events logged (compliance)

---

### 7.7.2 Operational Benefits

**For IT/Security Teams:**

1. **Unified Policy**: Same Zero Trust policies for wired and wireless (no duplication)
2. **Simplified Management**: ISE single pane of glass (wired + wireless clients)
3. **Real-Time Visibility**: pxGrid → Splunk dashboards (WiFi 7 client analytics)
4. **Rapid Incident Response**: XDR integration (automated threat response)
5. **Compliance**: Audit-ready logs (SGACL enforce/deny, posture status)

**For End Users:**

1. **Seamless Experience**: Single sign-on (SSO), no additional authentication for wireless
2. **Consistent Security**: Same access policies regardless of wired/wireless connection
3. **High Performance**: Zero Trust overhead negligible (<1ms latency)
