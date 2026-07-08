# 2.9 Wireless Design for SD-Access

## 2.9.1 Fabric-Enabled Wireless Architecture

### SD-Access Wireless Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    SD-ACCESS FABRIC WIRELESS ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                         CATALYST CENTER (DNAC)                           │   │
│   │              Wireless Controller Management & Provisioning               │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                          │
│                    ┌─────────────────┼─────────────────┐                       │
│                    │                 │                 │                       │
│                    ▼                 ▼                 ▼                        │
│   ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐    │
│   │    WLC-MUM-01/02    │  │    WLC-LON-01/02    │  │    WLC-NJ-01/02     │    │
│   │    C9800-40 (HA)    │  │    C9800-40 (HA)    │  │    C9800-80 (HA)    │    │
│   │   (Fabric Mode)     │  │   (Fabric Mode)     │  │   (Fabric Mode)     │    │
│   └──────────┬──────────┘  └──────────┬──────────┘  └──────────┬──────────┘    │
│              │                        │                        │               │
│              │  CAPWAP Control Only   │  CAPWAP Control Only   │               │
│              │  (No Data Tunnel)      │  (No Data Tunnel)      │               │
│              │                        │                        │               │
│   ┌──────────┴────────────────────────┴────────────────────────┴──────────┐    │
│   │                        FABRIC INFRASTRUCTURE                          │    │
│   │                                                                       │    │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │    │
│   │  │ Border  │  │ Control │  │  Edge   │  │  Edge   │  │  Edge   │     │    │
│   │  │  Node   │  │  Plane  │  │ Node 1  │  │ Node 2  │  │ Node N  │     │    │
│   │  └─────────┘  └─────────┘  └────┬────┘  └────┬────┘  └────┬────┘     │    │
│   │                                 │            │            │          │    │
│   └─────────────────────────────────┼────────────┼────────────┼──────────┘    │
│                                     │            │            │               │
│                              ┌──────┴──────┐ ┌───┴───┐ ┌──────┴──────┐        │
│                              │  C9130AXI   │ │C9120  │ │  C9130AXI   │        │
│                              │ (Fabric AP) │ │  AP   │ │ (Fabric AP) │        │
│                              └──────┬──────┘ └───┬───┘ └──────┬──────┘        │
│                                     │            │            │               │
│                                     ▼            ▼            ▼               │
│                              ┌────────────────────────────────────────┐       │
│                              │     WIRELESS CLIENTS (802.11ax)        │       │
│                              │                                        │       │
│                              │  Data Path: Client → AP → VXLAN →     │       │
│                              │             Fabric Edge → Overlay      │       │
│                              │                                        │       │
│                              │  SGT assigned at authentication        │       │
│                              │  Same policy as wired endpoints        │       │
│                              └────────────────────────────────────────┘       │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Key Fabric Wireless Concepts

| Concept | Description |
|---------|-------------|
| **Fabric Mode** | APs join WLC but data is locally switched via VXLAN |
| **CAPWAP Control** | Control plane tunnel to WLC (management, roaming, RRM) |
| **VXLAN Data Plane** | Data traffic VXLAN-encapsulated at AP to fabric edge |
| **INFRA_VN** | APs reside in infrastructure VN (maps to GRT) |
| **Dynamic SGT** | Wireless clients receive SGT from ISE same as wired |
| **Seamless Roaming** | L2 roaming across fabric with consistent IP/SGT |

---

## 2.9.2 WLC Placement and Sizing

### WLC Model Selection

| Site Type | WLC Model | APs Supported | Clients | HA Mode | Deployment |
|-----------|-----------|---------------|---------|---------|------------|
| Large Hub (Mumbai, NJ) | C9800-80 | 6,000 | 64,000 | SSO HA Pair | Dedicated |
| Medium Hub (London, Dallas) | C9800-40 | 2,000 | 32,000 | SSO HA Pair | Dedicated |
| Small Hub (Chennai, Frankfurt) | C9800-40 | 2,000 | 32,000 | SSO HA Pair | Shared |
| Large Branch | C9800-L | 250 | 5,000 | N+1 | On-premise |
| Small Branch | EWC on C9300 | 100 | 2,000 | N/A | Embedded |

### WLC IP Addressing

| Location | WLC Hostname | Management IP | HA Role | AP Count |
|----------|--------------|---------------|---------|----------|
| Mumbai | WLC-MUM-01 | 10.252.40.10 | Primary | 120 |
| Mumbai | WLC-MUM-02 | 10.252.40.11 | Secondary | (Standby) |
| Chennai | WLC-CHN-01 | 10.252.40.20 | Primary | 90 |
| Chennai | WLC-CHN-02 | 10.252.40.21 | Secondary | (Standby) |
| London | WLC-LON-01 | 10.252.40.30 | Primary | 100 |
| London | WLC-LON-02 | 10.252.40.31 | Secondary | (Standby) |
| Frankfurt | WLC-FRA-01 | 10.252.40.40 | Primary | 70 |
| Frankfurt | WLC-FRA-02 | 10.252.40.41 | Secondary | (Standby) |
| New Jersey | WLC-NJ-01 | 10.252.40.50 | Primary | 130 |
| New Jersey | WLC-NJ-02 | 10.252.40.51 | Secondary | (Standby) |
| Dallas | WLC-DAL-01 | 10.252.40.60 | Primary | 80 |
| Dallas | WLC-DAL-02 | 10.252.40.61 | Secondary | (Standby) |

### WLC Network Connectivity

```
┌─────────────────────────────────────────────────────────────────┐
│                    WLC NETWORK PLACEMENT                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   WLC Management Interface → Connected to INFRA_VN (GRT)        │
│   • Reachable from APs in INFRA_VN                              │
│   • Requires routes to fabric edge subnets                      │
│   • <20ms RTT to fabric APs                                     │
│                                                                  │
│   WLC-MUM-01/02                                                  │
│   ├── Management: 10.252.40.10-11/24 (VLAN 240)                │
│   ├── Redundancy: 10.252.41.10-11/24 (VLAN 241)                │
│   └── Service Port: 10.252.42.10-11/24 (OOB)                   │
│                                                                  │
│   Gateway: Border Node (Shared Services VRF Handoff)            │
│   DNS: 10.252.1.20, 10.252.1.21                                 │
│   NTP: 10.252.1.10                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2.9.3 SSID Design

### SSID to Virtual Network Mapping

| SSID Name | Security | Authentication | VN Assignment | SGT | QoS |
|-----------|----------|----------------|---------------|-----|-----|
| Corp-Secure | WPA3-Enterprise | 802.1X EAP-TLS/PEAP | VN_CORPORATE | Dynamic | Platinum |
| Corp-Guest | WPA3-Personal + CWA | Web Auth | VN_GUEST | 40 (Guests) | Bronze |
| Corp-IoT | WPA2-PSK | PSK + MAC Filter | VN_IOT | 50 (IoT) | Bronze |
| Corp-Voice | WPA3-Enterprise | 802.1X | VN_VOICE | 20 (Voice) | Platinum |

### SSID Detailed Configuration

```yaml
SSID_Configurations:

  Corp-Secure:
    SSID: Corp-Secure
    Status: Enabled
    Broadcast: Yes
    
    Security:
      Layer2: WPA3
      WPA3_Policy: WPA3-Enterprise
      Authentication: 802.1X
      PMF: Required
      FT: Enabled (802.11r)
      
    AAA:
      Authentication_Server: ISE
      Authorization_Server: ISE
      Accounting_Server: ISE
      Session_Timeout: 28800
      
    Fabric:
      Fabric_Enabled: Yes
      Virtual_Network: VN_CORPORATE
      IP_Pool: Dynamic (per floor)
      SGT: Dynamic (from ISE)
      
    Advanced:
      Client_Exclusion: Enabled
      P2P_Blocking: Enabled
      DHCP_Required: Yes
      
  Corp-Guest:
    SSID: Corp-Guest
    Status: Enabled
    Broadcast: Yes
    
    Security:
      Layer2: WPA3
      WPA3_Policy: WPA3-Personal (SAE)
      Layer3: Web Authentication
      Web_Auth_Type: Centralized (ISE Guest Portal)
      
    AAA:
      Authentication_Server: ISE
      Guest_Portal: Corp-Guest-Self-Registration
      
    Fabric:
      Fabric_Enabled: Yes
      Virtual_Network: VN_GUEST
      IP_Pool: Guest Pool
      SGT: 40 (Guests)
      
    Traffic_Policy:
      Internet_Only: Yes
      Block_Internal: Yes
      
  Corp-IoT:
    SSID: Corp-IoT
    Status: Enabled
    Broadcast: No (Hidden)
    
    Security:
      Layer2: WPA2-PSK
      PSK: <strong_psk>
      MAC_Filtering: Enabled
      
    AAA:
      MAC_Filter_Server: ISE
      
    Fabric:
      Fabric_Enabled: Yes
      Virtual_Network: VN_IOT
      IP_Pool: IoT Pool
      SGT: 50 (IoT-Sensors)
      
  Corp-Voice:
    SSID: Corp-Voice
    Status: Enabled
    Broadcast: Yes
    
    Security:
      Layer2: WPA3
      WPA3_Policy: WPA3-Enterprise
      Authentication: 802.1X
      
    AAA:
      Authentication_Server: ISE
      Call_Snooping: Enabled
      
    Fabric:
      Fabric_Enabled: Yes
      Virtual_Network: VN_VOICE
      IP_Pool: Voice Pool
      SGT: 20 (Voice)
      
    QoS:
      QoS_Policy: Platinum
      WMM: Required
      UAPSD: Enabled
      CAC: Enabled
```

---

## 2.9.4 Access Point Design

### AP Model Selection

| Location Type | AP Model | Indoor/Outdoor | Wi-Fi Standard | Typical Density |
|---------------|----------|----------------|----------------|-----------------|
| Office Floor | C9130AXI | Indoor | Wi-Fi 6 (802.11ax) | 1 per 2,500 sq ft |
| Conference Room | C9130AXI | Indoor | Wi-Fi 6 | 1 per room |
| Warehouse | C9130AXE | Indoor High | Wi-Fi 6 | 1 per 5,000 sq ft |
| Outdoor | C9124AXE | Outdoor | Wi-Fi 6 | Coverage-based |
| High Density | C9136I | Indoor | Wi-Fi 6E | 1 per 1,500 sq ft |

### AP Capacity Planning

| Site | Building | Floors | APs/Floor | Total APs | Client Estimate |
|------|----------|--------|-----------|-----------|-----------------|
| Mumbai | HQ | 6 | 20 | 120 | 2,400 |
| Chennai | HQ | 4 | 22 | 88 | 1,760 |
| London | HQ | 4 | 25 | 100 | 2,000 |
| Frankfurt | HQ | 3 | 23 | 69 | 1,380 |
| New Jersey | HQ | 5 | 26 | 130 | 2,600 |
| Dallas | HQ | 3 | 26 | 78 | 1,560 |
| Branches (15) | Various | 1-2 | 5-15 | ~150 | 3,000 |
| **TOTAL** | | | | **~735** | **~14,700** |

### AP Port Requirements

```yaml
AP_Port_Configuration:
  
  Fabric_Edge_Connection:
    Port_Type: Access (Trunk for AP with local switching)
    Native_VLAN: AP_MGMT_VLAN (INFRA_VN)
    PoE: 802.3bt (60W for Wi-Fi 6)
    
  Interface_Template: DNAC_AP_TEMPLATE
    switchport mode trunk
    switchport trunk native vlan <AP_VLAN>
    switchport trunk allowed vlan <AP_VLAN>,<Client_VLANs>
    spanning-tree portfast trunk
    authentication host-mode multi-domain
    authentication order dot1x mab
    mab
    dot1x pae authenticator
```

---

## 2.9.5 RF Design

### Channel Plan - 5 GHz

```yaml
RF_Design_5GHz:
  
  Channel_Width: 40 MHz (default), 80 MHz (high density areas)
  
  DCA_Channels:
    UNII-1: 36, 40, 44, 48
    UNII-2A: 52, 56, 60, 64
    UNII-2C: 100, 104, 108, 112, 116, 132, 136, 140
    UNII-3: 149, 153, 157, 161, 165
    
  Excluded_Channels:
    DFS_Sensitive: 120, 124, 128 (optional exclusion)
    
  Power_Levels:
    Maximum: 17 dBm
    Minimum: 8 dBm
    TPC_Threshold: -70 dBm
```

### Channel Plan - 2.4 GHz

```yaml
RF_Design_2_4GHz:
  
  Channel_Width: 20 MHz (always)
  
  DCA_Channels: 1, 6, 11 (non-overlapping only)
  
  Power_Levels:
    Maximum: 14 dBm
    Minimum: 5 dBm
    TPC_Threshold: -70 dBm
    
  Client_Density:
    High_Density: Disable 2.4 GHz or reduce power
```

### RRM Configuration

```yaml
RRM_Settings:
  
  Dynamic_Channel_Assignment:
    Mode: Automatic
    Sensitivity: Medium
    Interval: 10 minutes
    
  Transmit_Power_Control:
    Mode: Automatic
    Min_Power: -10 dBm from max
    Max_Power: Country limit
    Threshold: -70 dBm
    
  Coverage_Hole_Detection:
    Enable: Yes
    Min_Failed_Clients: 3
    Coverage_Level: -80 dBm
    
  Flexible_Radio_Assignment:
    Enable: Yes
    Mode: Client-driven
    5GHz_Bias: Yes
```

---

## 2.9.6 Roaming Design

### Roaming Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FABRIC WIRELESS ROAMING                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   INTRA-SITE ROAMING (Same Fabric Site)                         │
│   ─────────────────────────────────────                         │
│   • Layer 2 Roaming (Same VLAN/IP Pool)                         │
│   • Client keeps same IP address                                │
│   • LISP updates endpoint location                              │
│   • SGT preserved                                               │
│   • Roam Time: <50ms (Fast Transition)                          │
│                                                                  │
│   Client → AP-1 → Edge-1 ═══ROAM═══> AP-2 → Edge-2             │
│            │                              │                      │
│            └──── Same Anycast GW ────────┘                      │
│                                                                  │
│   INTER-SITE ROAMING (Different Fabric Sites)                   │
│   ────────────────────────────────────────                      │
│   • Layer 3 Roaming (Different IP Pool)                         │
│   • Client gets new IP address                                  │
│   • Session re-authentication at new site                       │
│   • SGT reassigned by ISE                                       │
│   • Roam Time: ~1-2 seconds                                     │
│                                                                  │
│   [Site A]                    [Site B]                          │
│   AP → Edge → Border ═══WAN═══> Border → Edge → AP             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Fast Transition (802.11r)

```yaml
Fast_Transition:
  Enable: Yes
  FT_Mode: Adaptive (802.11r + non-11r clients)
  
  Over_the_Air: Yes
  Over_the_DS: Yes
  
  Reassociation_Timeout: 20 TUs
  
  PMK_Cache:
    Enable: Yes
    Lifetime: 8 hours
```

### Mobility Configuration

```yaml
Mobility_Groups:
  
  APAC_Mobility:
    Group_Name: APAC-MOBILITY
    Members:
      - WLC-MUM-01 (10.252.40.10)
      - WLC-MUM-02 (10.252.40.11)
      - WLC-CHN-01 (10.252.40.20)
      - WLC-CHN-02 (10.252.40.21)
    RF_Group: APAC-RF
    
  EMEA_Mobility:
    Group_Name: EMEA-MOBILITY
    Members:
      - WLC-LON-01 (10.252.40.30)
      - WLC-LON-02 (10.252.40.31)
      - WLC-FRA-01 (10.252.40.40)
      - WLC-FRA-02 (10.252.40.41)
    RF_Group: EMEA-RF
    
  AMER_Mobility:
    Group_Name: AMER-MOBILITY
    Members:
      - WLC-NJ-01 (10.252.40.50)
      - WLC-NJ-02 (10.252.40.51)
      - WLC-DAL-01 (10.252.40.60)
      - WLC-DAL-02 (10.252.40.61)
    RF_Group: AMER-RF
```

---

## 2.9.7 QoS Design

### Wireless QoS Mapping

| Application | WMM AC | DSCP | 802.1p | Queue | Bandwidth |
|-------------|--------|------|--------|-------|-----------|
| Voice | Voice (VO) | EF (46) | 6 | Platinum | 10% guaranteed |
| Video | Video (VI) | AF41 (34) | 5 | Gold | 30% guaranteed |
| Signaling | Video (VI) | CS3 (24) | 4 | Gold | 5% guaranteed |
| Business Apps | Best Effort (BE) | AF21 (18) | 3 | Silver | 25% guaranteed |
| Default | Best Effort (BE) | 0 | 0 | Bronze | Best effort |
| Scavenger | Background (BK) | CS1 (8) | 1 | Bronze | Rate limited |

### AVC Configuration

```yaml
Application_Visibility:
  
  Enable_AVC: Yes
  Netflow_Export: Yes
  Collector: 10.252.10.30:9996
  
  Application_Policies:
    Voice_Video:
      Applications: [webex, teams, zoom, jabber]
      Action: Mark and Queue (EF/AF41)
      
    Business_Critical:
      Applications: [salesforce, sap, oracle]
      Action: Mark (AF21)
      
    Social_Media:
      Applications: [facebook, twitter, instagram]
      Action: Rate Limit (1 Mbps)
      
    Streaming:
      Applications: [netflix, youtube]
      Action: Rate Limit (5 Mbps)
```

---

## 2.9.8 Guest Wireless Architecture

### Guest Anchor Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GUEST WIRELESS FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. Guest connects to "Corp-Guest" SSID                        │
│   2. AP associates client in VN_GUEST                           │
│   3. Client gets IP from Guest pool                             │
│   4. HTTP redirect to ISE Guest Portal                          │
│   5. Guest authenticates (self-reg or sponsor)                  │
│   6. ISE sends CoA with SGT 40 (Guests)                        │
│   7. Traffic exits via Border → Internet only                   │
│                                                                  │
│   [Guest Client]                                                 │
│        │                                                         │
│        ▼                                                         │
│   [Fabric AP] ──VXLAN──> [Fabric Edge]                          │
│        │                      │                                  │
│        │                      │ VN_GUEST                        │
│        │                      ▼                                  │
│        │                 [Border Node]                           │
│        │                      │                                  │
│   [CAPWAP Ctrl]              │                                  │
│        │                      ▼                                  │
│        ▼                 [Firewall]──────> Internet             │
│   [WLC]                       │                                  │
│        │                      ✗ Internal Networks               │
│        ▼                                                         │
│   [ISE Guest Portal]                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Guest Portal Integration

```yaml
Guest_Wireless_Flow:
  
  Pre_Authentication:
    SSID: Corp-Guest
    Initial_State: WebAuth Required
    Redirect_ACL: ACL-GUEST-REDIRECT
    Portal: ISE Guest Portal (https://ise.corp.local:8443/portal)
    
  Authentication_Options:
    Self_Registration: Yes
    Sponsored: Yes
    Social_Login: No
    
  Post_Authentication:
    CoA_Action: Reauthenticate
    SGT: 40 (Guests)
    VN: VN_GUEST
    Internet_Access: Yes (via proxy)
    Internal_Access: No
    Session_Timeout: 8 hours
    Max_Devices: 3
```

---

## 2.9.9 Wireless Security Design

### Security Standards

| Security Layer | Standard | Configuration |
|----------------|----------|---------------|
| Authentication | WPA3-Enterprise | 802.1X with EAP-TLS/PEAP |
| Encryption | AES-256-GCMP | WPA3 default |
| Key Management | SAE/802.1X | Per-client keys |
| Management Frame | PMF Required | 802.11w mandatory |
| Fast Roaming | FT-SAE | 802.11r with SAE |

### Rogue AP Detection

```yaml
Rogue_Detection:
  
  Enable: Yes
  
  Classification_Rules:
    Malicious:
      - SSID spoofing (matches Corp-*)
      - On wired network
      - Managed SSID on non-managed AP
      
    Friendly:
      - Known neighbor APs
      - Specific MAC OUI whitelist
      
    Unclassified:
      - Default for unknown APs
      
  Auto_Containment:
    Malicious: Yes (with approval workflow)
    Friendly: No
    
  Notification:
    Email: wireless-security@corp.local
    SNMP_Trap: Yes
```

---

## 2.9.10 Design Summary

### Wireless Design Parameters

| Parameter | Value |
|-----------|-------|
| Total APs | ~735 |
| Total WLCs | 12 (6 HA pairs) |
| SSIDs | 4 (Corp-Secure, Guest, IoT, Voice) |
| Wi-Fi Standard | 802.11ax (Wi-Fi 6) |
| Security | WPA3-Enterprise (Corp), WPA3-Personal (Guest) |
| Fabric Mode | Enabled (all APs) |
| Roaming | 802.11r Fast Transition |
| QoS | WMM with AVC |

### Latency Requirements

| Metric | Requirement | Target |
|--------|-------------|--------|
| AP to WLC RTT | < 20ms | 5-10ms |
| Authentication | < 2 seconds | < 500ms |
| Roam Time (intra-site) | < 50ms | < 30ms |
| Voice MOS | > 4.0 | 4.2 |

---
