# 4.7 Fabric Node Provisioning

## 4.7.1 Device Discovery and Onboarding

### Discovery Methods

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      DEVICE DISCOVERY METHODS                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   METHOD 1: CDP/LLDP DISCOVERY                                                  │
│   ───────────────────────────                                                   │
│   • Seed device discovers neighbors automatically                               │
│   • Best for existing networks                                                  │
│   • Requires connectivity between devices                                       │
│                                                                                  │
│   [Seed Device] ──CDP──> [Neighbor 1] ──CDP──> [Neighbor 2]...                 │
│                                                                                  │
│   METHOD 2: IP RANGE DISCOVERY                                                  │
│   ───────────────────────────                                                   │
│   • Scans IP range for devices                                                  │
│   • Best for known management subnets                                           │
│   • Can discover isolated devices                                               │
│                                                                                  │
│   [DNAC] ──Scan──> 10.252.12.0/24                                              │
│                                                                                  │
│   METHOD 3: SINGLE DEVICE ADD                                                   │
│   ────────────────────────────                                                  │
│   • Manual device-by-device addition                                            │
│   • Best for specific devices                                                   │
│   • Most control over process                                                   │
│                                                                                  │
│   METHOD 4: PNP (PLUG AND PLAY)                                                 │
│   ──────────────────────────────                                                │
│   • Zero-touch provisioning for new devices                                     │
│   • Device auto-discovers DNAC                                                  │
│   • Best for greenfield deployments                                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### CDP/LLDP Discovery Configuration

```yaml
# Provision > Inventory > Add Device > Discovery

CDP_LLDP_Discovery:
  
  Discovery_Name: Mumbai-Fabric-Discovery
  Discovery_Type: CDP
  
  Seed_Device:
    IP_Address: 10.252.12.1
    Description: Core switch as seed
    
  Credentials:
    CLI:
      Username: netadmin
      Password: <encrypted>
      Enable_Password: <encrypted>
    SNMPv3:
      Username: dnac-snmp
      Auth_Protocol: SHA
      Auth_Password: <encrypted>
      Priv_Protocol: AES128
      Priv_Password: <encrypted>
      
  Discovery_Settings:
    CDP_Level: 5
    LLDP_Level: 5
    Protocol_Order: CDP, LLDP
    Retry_Count: 3
    Timeout: 5
    
  Filters:
    IP_Filter: 10.0.0.0/8
    Exclude: 10.252.100.0/24
```

### IP Range Discovery

```yaml
# Provision > Inventory > Add Device > Discovery

IP_Range_Discovery:
  
  Discovery_Name: Mumbai-Management-Subnet
  Discovery_Type: Range
  
  IP_Range:
    Start: 10.252.12.1
    End: 10.252.12.254
    
  Credentials:
    # Same as above
    
  Protocol_Settings:
    SSH: Enabled
    Telnet: Disabled
    SNMP: v3
    HTTPS: Enabled
```

---

## 4.7.2 Plug and Play (PnP) Onboarding

### PnP Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PnP ONBOARDING FLOW                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   1. Device Powers On (Factory Default)                                         │
│      │                                                                           │
│      ▼                                                                           │
│   2. Device Gets IP via DHCP                                                    │
│      │  DHCP Option 43: DNAC IP (5A1D;B2;K4;I10.252.10.10;J80)                │
│      │  Or: DNS lookup for devicehelper.cisco.com                               │
│      ▼                                                                           │
│   3. Device Contacts DNAC PnP Service                                           │
│      │  HTTPS to DNAC on port 443                                               │
│      ▼                                                                           │
│   4. DNAC Authenticates Device                                                  │
│      │  By Serial Number (pre-staged)                                           │
│      │  Or: Claimed by admin                                                    │
│      ▼                                                                           │
│   5. DNAC Pushes Day-0 Configuration                                           │
│      │  • Hostname                                                               │
│      │  • Management IP                                                          │
│      │  • Credentials                                                            │
│      │  • Image upgrade (if needed)                                              │
│      ▼                                                                           │
│   6. Device Reboots with New Config                                             │
│      │                                                                           │
│      ▼                                                                           │
│   7. Device Appears in DNAC Inventory                                           │
│      │                                                                           │
│      ▼                                                                           │
│   8. Admin Assigns to Site & Provisions                                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### DHCP Option 43 Configuration

```cisco
! ============================================================
! DHCP SERVER CONFIGURATION FOR PnP
! ============================================================

! On DHCP Server (IOS)
ip dhcp pool PNP-POOL
 network 10.252.12.0 255.255.255.0
 default-router 10.252.12.1
 dns-server 10.252.1.20
 domain-name corp.local
 ! Option 43 for DNAC discovery
 option 43 ascii "5A1D;B2;K4;I10.252.10.10;J443"

! Option 43 Format:
! 5A = PnP DHCP SubOption
! 1D = Length (29 bytes)
! B2 = IP address type (IPv4)
! K4 = Transport protocol (HTTPS)
! I<ip> = DNAC IP address
! J<port> = DNAC port (443)
```

### PnP Device Claim

```yaml
# Provision > Plug and Play > Devices

PnP_Device_Claim:
  
  # Pre-stage device by serial number
  Device_Entry:
    Serial_Number: FCW2345A1BC
    Product_ID: C9300-48UXM
    Hostname: MUM-ED-01
    Site: Global/APAC/Mumbai/Building_MUM_HQ/Floor_1
    
  Day0_Template:
    Template_Name: SDA-Edge-Day0
    Variables:
      HOSTNAME: MUM-ED-01
      MGMT_IP: 10.252.12.11
      MGMT_MASK: 255.255.255.0
      MGMT_GW: 10.252.12.1
      
  Image:
    Golden_Image: cat9k_iosxe.17.09.04a.SPA.bin
    Upgrade: Yes
    
  Workflow:
    After_Claim: Provision to Site
```

### Day-0 Template

```velocity
! ============================================================
! DAY-0 CONFIGURATION TEMPLATE FOR PnP
! ============================================================

hostname $HOSTNAME

! Management Interface
interface Vlan1
 ip address $MGMT_IP $MGMT_MASK
 no shutdown

ip default-gateway $MGMT_GW

! DNS
ip name-server 10.252.1.20
ip domain name corp.local

! NTP
ntp server 10.252.1.10

! Enable SSH
crypto key generate rsa modulus 2048
ip ssh version 2

! Credentials
username netadmin privilege 15 secret $ADMIN_PASSWORD
enable secret $ENABLE_PASSWORD

! AAA
aaa new-model
aaa authentication login default local
aaa authorization exec default local

! VTY Access
line vty 0 15
 transport input ssh
 login authentication default

! Save config
end
write memory
```

---

## 4.7.3 Site Assignment

### Assign Devices to Sites

```yaml
# Provision > Inventory > [Device] > Actions > Assign to Site

Site_Assignment:
  
  # Border Nodes
  MUM-BN-01:
    Site: Global/APAC/Mumbai/Building_MUM_HQ/Data_Center
    Role: Border Node
    
  MUM-BN-02:
    Site: Global/APAC/Mumbai/Building_MUM_HQ/Data_Center
    Role: Border Node
    
  # Control Plane Nodes
  MUM-CP-01:
    Site: Global/APAC/Mumbai/Building_MUM_HQ/Data_Center
    Role: Control Plane Node
    
  MUM-CP-02:
    Site: Global/APAC/Mumbai/Building_MUM_HQ/Data_Center
    Role: Control Plane Node
    
  # Edge Nodes
  MUM-ED-01:
    Site: Global/APAC/Mumbai/Building_MUM_HQ/Floor_1
    Role: Edge Node
    
  MUM-ED-02:
    Site: Global/APAC/Mumbai/Building_MUM_HQ/Floor_1
    Role: Edge Node
    
  # Continue for all devices...
```

---

## 4.7.4 Border Node Provisioning

### Add Border Node to Fabric

```yaml
# Provision > Fabric Sites > [Site] > Fabric Infrastructure

Border_Node_Provisioning:
  
  Device: MUM-BN-01
  Fabric_Role: Border Node
  
  Border_Settings:
    Border_Type: Internal + External
    Border_Priority: Primary (1)
    
    Layer_3_Handoff:
      Enabled: Yes
      
    Local_Gateway:
      Enabled: Yes
      
    Default_Exit:
      Enabled: Yes
      
  External_Connectivity:
    Transit_Type: IP-Based
    
    External_Peer_1:
      Name: MPLS-PE
      Remote_IP: 10.240.1.1
      Remote_ASN: 65000
      Local_Interface: TenGigabitEthernet1/1/1
      Local_IP: 10.240.1.2/30
      VLAN: 3001
      
    External_Peer_2:
      Name: SD-WAN-Edge
      Remote_IP: 10.240.1.5
      Remote_ASN: 65100
      Local_Interface: TenGigabitEthernet1/1/2
      Local_IP: 10.240.1.6/30
      VLAN: 3002
```

### Border Node L3 Handoff Configuration

```yaml
# Provision > Fabric Sites > [Site] > Virtual Networks > [VN] > Layer 3 Handoff

L3_Handoff_Configuration:
  
  Virtual_Network: VN_CORPORATE
  Border_Node: MUM-BN-01
  
  Handoff_Settings:
    External_Interface: TenGigabitEthernet1/1/1.3001
    VLAN_ID: 3001
    IP_Address: 10.240.10.1/30
    
    BGP_Settings:
      Local_ASN: 65001
      Remote_ASN: 65000
      Neighbor_IP: 10.240.10.2
      Route_Redistribution: LISP to BGP
      
  # Repeat for each VN requiring external connectivity
```

---

## 4.7.5 Control Plane Node Provisioning

### Add Control Plane Node

```yaml
# Provision > Fabric Sites > [Site] > Fabric Infrastructure

Control_Plane_Provisioning:
  
  Device: MUM-CP-01
  Fabric_Role: Control Plane Node
  
  CP_Settings:
    LISP_Site_ID: 1001
    
    Map_Server:
      Enabled: Yes
      
    Map_Resolver:
      Enabled: Yes
      
    Primary_CP: Yes
    
  # DNAC automatically configures:
  # - LISP MS/MR functionality
  # - EID-to-RLOC mapping tables
  # - Map-cache settings
  # - Pub/Sub for LISP

# Second CP for redundancy
Control_Plane_Secondary:
  Device: MUM-CP-02
  Fabric_Role: Control Plane Node
  Primary_CP: No
```

---

## 4.7.6 Edge Node Provisioning

### Add Edge Node to Fabric

```yaml
# Provision > Fabric Sites > [Site] > Fabric Infrastructure

Edge_Node_Provisioning:
  
  Device: MUM-ED-01
  Fabric_Role: Edge Node
  Location: Floor_1
  
  Edge_Settings:
    Authentication_Mode: Closed Mode
    
    Supported_VNs:
      - VN_CORPORATE
      - VN_VOICE
      - VN_IOT
      - VN_GUEST

# Provision > Fabric Sites > [Site] > Host Onboarding

Host_Onboarding:
  
  Device: MUM-ED-01
  
  IP_Pool_Assignment:
    VN_CORPORATE:
      Pool: Corporate_Pool_Floor1
      VLAN: Auto (DNAC assigns)
      
    VN_VOICE:
      Pool: Voice_Pool_Floor1
      VLAN: Auto
      
    VN_IOT:
      Pool: IoT_Pool_Floor1
      VLAN: Auto
      
  Port_Assignment:
    Data_Ports: GigabitEthernet1/0/1-40
    Voice_Ports: GigabitEthernet1/0/1-40 (same, multi-domain)
    AP_Ports: GigabitEthernet1/0/41-48
    Uplinks: TenGigabitEthernet1/1/1-2
```

### Port Assignment Templates

```yaml
# Provision > Fabric Sites > [Site] > Port Assignment

Port_Templates:
  
  Data_Voice_Port:
    Interface_Range: Gi1/0/1-40
    Description: User Port - Data + Voice
    Connected_Device_Type: User Device
    
    Data_VLAN:
      Pool: Dynamic per VN
      Authentication: Closed Mode
      
    Voice_VLAN:
      Pool: Voice Pool
      Authentication: MAB
      
  AP_Port:
    Interface_Range: Gi1/0/41-48
    Description: Access Point
    Connected_Device_Type: Access Point
    
    Trunk:
      Native_VLAN: AP_MGMT
      Allowed_VLANs: Auto
      
  Uplink_Port:
    Interface_Range: Te1/1/1-2
    Description: Fabric Uplink
    Connected_Device_Type: Fabric Uplink
    
    Configuration: Auto (DNAC manages)
```

---

## 4.7.7 Extended Node Provisioning

### Extended Node Types

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      EXTENDED NODE TYPES                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   CLASSIC EXTENDED NODE                                                          │
│   ─────────────────────                                                          │
│   • Basic extension of fabric edge                                              │
│   • No SGT enforcement on extended node                                         │
│   • SGT enforcement at parent edge                                              │
│   • Supported: IE switches, compact switches                                    │
│                                                                                  │
│   [Parent Edge] ═══Trunk═══> [Classic Extended Node]                           │
│        └── SGT enforcement here                                                 │
│                                                                                  │
│   POLICY EXTENDED NODE                                                           │
│   ─────────────────────                                                          │
│   • Full SGT enforcement capability                                             │
│   • Supports SGACL on extended node                                             │
│   • Requires Cat 9000 series                                                    │
│                                                                                  │
│   [Parent Edge] ═══Trunk═══> [Policy Extended Node]                            │
│                                    └── SGT enforcement here                     │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Extended Node Configuration

```yaml
# Provision > Fabric Sites > [Site] > Fabric Infrastructure

Extended_Node_Provisioning:
  
  Device: MUM-EX-01
  Device_Type: Catalyst IE3400
  Parent_Edge: MUM-ED-01
  
  Extended_Node_Settings:
    Type: Classic Extended Node
    Trunk_Interface: Te1/1/1
    
    Inherited_Settings:
      VNs: From parent
      Authentication: From parent
      IP_Pools: From parent
      
    Local_Ports:
      Data_Ports: Gi1/0/1-8
      Uplink: Te1/1/1 (to parent)
```

---

## 4.7.8 Image Management

### Golden Image Configuration

```yaml
# Design > Image Repository

Golden_Image_Configuration:
  
  Image_Family: Catalyst 9300 Series
  Image_Version: 17.09.04a
  Image_File: cat9k_iosxe.17.09.04a.SPA.bin
  
  Golden_Tag: Yes
  
  Applicable_Devices:
    - C9300-24UX
    - C9300-48UXM
    - C9300-48P
    
# Design > Network Settings > Software Images

Software_Image_Settings:
  
  Auto_Update: Scheduled
  Schedule: Sunday 02:00 UTC
  Rollback: Enabled (keep 1 version)
  
  Pre_Check:
    Flash_Space: Yes
    Config_Register: Yes
```

### Compliance Check

```yaml
# Provision > Inventory > [Device] > Software Image

Image_Compliance:
  
  Status: Non-Compliant
  Current: 17.06.05
  Golden: 17.09.04a
  
  Actions:
    - Update Now
    - Schedule Update
    - Mark as Compliant (exception)
```

---

## 4.7.9 Configuration Compliance

### Compliance Templates

```yaml
# Provision > Inventory > [Device] > Compliance

Compliance_Settings:
  
  Compliance_Type: Full
  
  Check_Categories:
    Intent_Configuration: Yes
    Running_vs_Startup: Yes
    Image_Compliance: Yes
    PSIRT_Vulnerabilities: Yes
    
  Schedule:
    Frequency: Daily
    Time: 03:00 UTC
    
  Remediation:
    Auto_Remediate: No
    Notify: Yes
    Email: network-ops@corp.local
```

### Export Configuration

```yaml
# Provision > Inventory > [Device] > Actions > Export Config

Configuration_Export:
  
  Format: Text
  Include:
    - Running Configuration
    - Startup Configuration
    
  Destination:
    - Download
    - Archive Repository
```

---

## 4.7.10 Bulk Provisioning

### CSV Import for Bulk Operations

```csv
# devices.csv format for bulk import
Device Name,Management IP,Site,Device Type,Serial Number
MUM-ED-01,10.252.12.11,Global/APAC/Mumbai/Building_MUM_HQ/Floor_1,Catalyst 9300,FCW2345A1BC
MUM-ED-02,10.252.12.12,Global/APAC/Mumbai/Building_MUM_HQ/Floor_1,Catalyst 9300,FCW2345A1BD
MUM-ED-03,10.252.12.13,Global/APAC/Mumbai/Building_MUM_HQ/Floor_2,Catalyst 9300,FCW2345A1BE
```

### Template-Based Provisioning

```yaml
# Provision > Templates

Day_N_Template:
  
  Template_Name: SDA-Edge-Config
  Device_Type: Catalyst 9300
  Software_Type: IOS-XE
  
  Template_Content: |
    ! Banner
    banner motd ^
    ================================================
    AUTHORIZED ACCESS ONLY
    Device: $hostname
    Location: $location
    ================================================
    ^
    
    ! Logging
    logging host 10.252.1.30
    logging host 10.252.1.31
    
    ! SNMP
    snmp-server host 10.252.10.10 version 3 priv dnac-snmp
    
  Variables:
    hostname: From Inventory
    location: From Site
```

---

## 4.7.11 Provisioning Workflow Summary

### Complete Provisioning Sequence

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    FABRIC NODE PROVISIONING WORKFLOW                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   STEP 1: PREPARE UNDERLAY                                                      │
│   └── Configure underlay routing (OSPF/IS-IS/BGP) - Pre-requisite               │
│                                                                                  │
│   STEP 2: DISCOVER/ADD DEVICES                                                  │
│   └── Discovery or PnP → Devices appear in Inventory                           │
│                                                                                  │
│   STEP 3: ASSIGN TO SITES                                                       │
│   └── Associate devices with fabric site hierarchy                              │
│                                                                                  │
│   STEP 4: DEFINE FABRIC SITE                                                    │
│   └── Create fabric site in DNAC                                               │
│                                                                                  │
│   STEP 5: DEFINE VNs AND IP POOLS                                               │
│   └── Create Virtual Networks and assign IP pools                              │
│                                                                                  │
│   STEP 6: ADD BORDER NODES (First)                                              │
│   └── DNAC pushes: LISP, VRF, VXLAN, Handoff configs                          │
│                                                                                  │
│   STEP 7: ADD CONTROL PLANE NODES                                               │
│   └── DNAC pushes: LISP MS/MR, Map-cache configs                               │
│                                                                                  │
│   STEP 8: ADD EDGE NODES                                                        │
│   └── DNAC pushes: LISP ETR/ITR, VXLAN, 802.1X, Anycast GW                    │
│                                                                                  │
│   STEP 9: HOST ONBOARDING                                                       │
│   └── Assign IP pools and configure port templates                             │
│                                                                                  │
│   STEP 10: VALIDATE                                                             │
│   └── Verify LISP adjacencies, VXLAN tunnels, authentication                   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.7.12 Troubleshooting Provisioning

### Common Provisioning Issues

```bash
# Device not appearing in inventory
# Check: Credentials, SNMP, SSH access, firewall rules

# Device shows as unmanaged
# Check: Software version compatibility, license

# Fabric provisioning fails
# Check: Underlay connectivity, LISP/VXLAN prerequisites

# From switch CLI:
show lisp instance-id * ipv4 server summary
show vxlan interface nve1
show fabric-ports host summary
show cts role-based sgt-map all
```

### Provisioning Status Check

```yaml
# Provision > Fabric Sites > [Site] > Fabric Infrastructure

Provisioning_Status:
  MUM-BN-01: Provisioned (Success)
  MUM-CP-01: Provisioned (Success)
  MUM-ED-01: Provisioning (In Progress)
  MUM-ED-02: Failed (Check logs)
  
# Click on failed device for error details
```

---

## 4.7.13 Provisioning Checklist

| Phase | Task | Status | Date |
|-------|------|--------|------|
| **Discovery** |
| | Devices discovered/added | ☐ | |
| | Credentials verified | ☐ | |
| | Software compliance checked | ☐ | |
| **Site Assignment** |
| | All devices assigned to sites | ☐ | |
| | Site hierarchy verified | ☐ | |
| **Border Nodes** |
| | Border nodes provisioned | ☐ | |
| | L3 handoff configured | ☐ | |
| | BGP peers established | ☐ | |
| **Control Plane** |
| | CP nodes provisioned | ☐ | |
| | LISP MS/MR active | ☐ | |
| | Redundancy verified | ☐ | |
| **Edge Nodes** |
| | Edge nodes provisioned | ☐ | |
| | Host onboarding complete | ☐ | |
| | Port assignments done | ☐ | |
| **Validation** |
| | LISP adjacencies up | ☐ | |
| | VXLAN tunnels active | ☐ | |
| | Test authentication | ☐ | |
| | End-to-end connectivity | ☐ | |

---
