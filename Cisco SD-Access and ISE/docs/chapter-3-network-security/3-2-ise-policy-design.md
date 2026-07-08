# 3.2 ISE Policy Design for SD-Access

## 3.2.1 Policy Architecture Overview

### ISE Policy Framework for SD-Access

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      ISE POLICY ARCHITECTURE FOR SD-ACCESS                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         POLICY SET HIERARCHY                             │    │
│  ├─────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                          │    │
│  │   ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │    │
│  │   │  SD-ACCESS-WIRED │    │ SD-ACCESS-WLESS  │    │   DEVICE-ADMIN   │  │    │
│  │   │   Policy Set     │    │   Policy Set     │    │   Policy Set     │  │    │
│  │   └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘  │    │
│  │            │                       │                       │            │    │
│  │            ▼                       ▼                       ▼            │    │
│  │   ┌──────────────────────────────────────────────────────────────────┐  │    │
│  │   │                   AUTHENTICATION POLICIES                        │  │    │
│  │   │  • EAP-TLS (Certificate)     • Identity Store Selection          │  │    │
│  │   │  • PEAP-MSCHAPv2 (Password)  • Protocol Matching                 │  │    │
│  │   │  • MAB (MAC Address)         • Allowed Protocols                 │  │    │
│  │   └──────────────────────────────────────────────────────────────────┘  │    │
│  │            │                                                            │    │
│  │            ▼                                                            │    │
│  │   ┌──────────────────────────────────────────────────────────────────┐  │    │
│  │   │                   AUTHORIZATION POLICIES                         │  │    │
│  │   │  • Condition Matching        • Authorization Profile Assignment  │  │    │
│  │   │  • AD Group Membership       • SGT Assignment                    │  │    │
│  │   │  • Endpoint Profile          • VN Assignment                     │  │    │
│  │   │  • Posture Status            • DACL Application                  │  │    │
│  │   └──────────────────────────────────────────────────────────────────┘  │    │
│  │            │                                                            │    │
│  │            ▼                                                            │    │
│  │   ┌──────────────────────────────────────────────────────────────────┐  │    │
│  │   │                   AUTHORIZATION RESULTS                          │  │    │
│  │   │  • SGT Value (cts:security-group-tag=xxxx-xx)                   │  │    │
│  │   │  • VN Assignment (cts:vn=VN_NAME)                                │  │    │
│  │   │  • VLAN (tunnel-private-group-id)                               │  │    │
│  │   │  • dACL (filter-id or cisco-av-pair:dacl)                       │  │    │
│  │   └──────────────────────────────────────────────────────────────────┘  │    │
│  │                                                                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Policy Evaluation Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         POLICY EVALUATION FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   RADIUS Request                                                                 │
│   from NAD (Fabric Edge)                                                         │
│         │                                                                        │
│         ▼                                                                        │
│   ┌─────────────────┐                                                           │
│   │ Policy Set      │  Match on: Device Type, Location, RADIUS attributes       │
│   │ Selection       │  Example: Device-Type = SD-Access_Fabric                  │
│   └────────┬────────┘                                                           │
│            │                                                                     │
│            ▼                                                                     │
│   ┌─────────────────┐                                                           │
│   │ Authentication  │  Verify: Credentials, Certificates, MAC Address           │
│   │ Policy          │  Result: PASS → Continue | FAIL → Reject                  │
│   └────────┬────────┘                                                           │
│            │                                                                     │
│            ▼                                                                     │
│   ┌─────────────────┐                                                           │
│   │ Authorization   │  Match: AD Groups, Endpoint Profile, Posture, Location    │
│   │ Policy          │  Result: Authorization Profile Assignment                  │
│   └────────┬────────┘                                                           │
│            │                                                                     │
│            ▼                                                                     │
│   ┌─────────────────┐                                                           │
│   │ RADIUS Response │  Contains: SGT, VN, VLAN, dACL, Session Timeout           │
│   │ to NAD          │  cisco-av-pair: cts:security-group-tag=000A-00            │
│   └─────────────────┘                                                           │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.2.2 Identity Source Configuration

### Active Directory Integration

```yaml
# Administration > Identity Management > External Identity Sources > Active Directory

AD_Domain_Configuration:
  Join_Point_Name: CORP-AD
  Domain: corp.local
  Domain_Controllers:
    Primary:
      Hostname: dc01.corp.local
      IP: 10.252.1.50
    Secondary:
      Hostname: dc02.corp.local
      IP: 10.252.1.51
  
  Service_Account:
    Username: svc-ise-ad@corp.local
    Password: <encrypted>
    Permissions: Domain Users (minimum)
  
  Advanced_Settings:
    Schema: Active Directory
    Enable_Rewrites: No
    Enable_Dial-in_Check: No
    Enable_Callback_Check: No
    Enable_Machine_Authentication: Yes
    Enable_Machine_Access_Restriction: Yes
    Aging_Time: 5 days
    
  Attribute_Mapping:
    - AD Attribute: memberOf
      ISE Attribute: ExternalGroups
    - AD Attribute: department
      ISE Attribute: department
    - AD Attribute: title
      ISE Attribute: title
    - AD Attribute: employeeType
      ISE Attribute: employeeType
```

### AD Groups to Import

```yaml
# Administration > Identity Management > External Identity Sources > AD > Groups

Imported_AD_Groups:
  
  # User Groups
  - CN=Domain Users,CN=Users,DC=corp,DC=local
  - CN=Domain Admins,CN=Users,DC=corp,DC=local
  - CN=Executives,OU=Security Groups,DC=corp,DC=local
  - CN=HR-Staff,OU=Security Groups,DC=corp,DC=local
  - CN=Finance-Staff,OU=Security Groups,DC=corp,DC=local
  - CN=IT-Admins,OU=Security Groups,DC=corp,DC=local
  - CN=IT-HelpDesk,OU=Security Groups,DC=corp,DC=local
  - CN=Contractors,OU=Security Groups,DC=corp,DC=local
  - CN=Vendors,OU=Security Groups,DC=corp,DC=local
  
  # Computer Groups
  - CN=Domain Computers,CN=Computers,DC=corp,DC=local
  - CN=Workstations,OU=Computer Groups,DC=corp,DC=local
  - CN=Servers,OU=Computer Groups,DC=corp,DC=local
  - CN=VoIP-Phones,OU=Computer Groups,DC=corp,DC=local
```

### Identity Source Sequences

```yaml
# Administration > Identity Management > Identity Source Sequences

Identity_Sequences:

  # Primary sequence for corporate users
  Corporate_Authentication_Sequence:
    Name: Corp-Auth-Sequence
    Description: Primary authentication for corporate users
    Certificate_Authentication_Profile: Corp-Certificate-Profile
    Identity_Sources:
      1: CORP-AD (Active Directory)
      2: Internal Users
    Authentication_Search_List:
      - Search: CORP-AD
        If_User_Not_Found: Continue
      - Search: Internal Users
        If_User_Not_Found: Drop
    Advanced:
      Treat_As_If_User_Not_Found: Continue to next store
      
  # Sequence for guest users
  Guest_Authentication_Sequence:
    Name: Guest-Auth-Sequence
    Description: Authentication for guest users
    Identity_Sources:
      1: Guest Users
      2: Sponsor Portal Users
    Authentication_Search_List:
      - Search: Guest Users
        If_User_Not_Found: Continue
      - Search: Sponsor Portal Users
        If_User_Not_Found: Drop
        
  # Sequence for endpoints (MAB)
  Endpoint_Authentication_Sequence:
    Name: Endpoint-Auth-Sequence
    Description: MAC Authentication for devices
    Identity_Sources:
      1: Internal Endpoints
      2: Profiled Endpoints
    Settings:
      Process_Host_Lookup: Yes
      MAC_Format: Lowercase with hyphens (aa-bb-cc-dd-ee-ff)
```

---

## 3.2.3 Allowed Protocols Configuration

### EAP Protocol Settings

```yaml
# Policy > Policy Elements > Results > Authentication > Allowed Protocols

Allowed_Protocols_Services:

  # Primary protocol service for SD-Access
  SDA-Allowed-Protocols:
    Name: SDA-Allowed-Protocols
    Description: Allowed protocols for SD-Access fabric authentication
    
    Process_Host_Lookup: Yes
    
    # PAP/ASCII
    Allow_PAP_ASCII: Yes
    
    # EAP-MD5
    Allow_EAP_MD5: No
    
    # EAP-TLS
    Allow_EAP_TLS: Yes
    EAP_TLS_Settings:
      Allow_EAP_TLS_Session_Resume: Yes
      EAP_TLS_Session_Timeout: 7200 seconds
    
    # PEAP
    Allow_PEAP: Yes
    PEAP_Settings:
      Allow_PEAP_EAP_MS_CHAPv2: Yes
      Allow_PEAP_EAP_GTC: Yes
      Allow_PEAP_EAP_TLS: Yes
      Require_Cryptobinding: Yes
      PEAP_Session_Timeout: 7200 seconds
      
    # EAP-FAST
    Allow_EAP_FAST: Yes
    EAP_FAST_Settings:
      Use_PACs: Yes
      Allow_Machine_Authentication: Yes
      Allow_Anonymous_In_Band_PAC: No
      Allow_Authenticated_In_Band_PAC: Yes
      Accept_Client_Certificate: Yes
      EAP_Chaining: Yes
      
    # EAP-TEAP
    Allow_TEAP: Yes
    TEAP_Settings:
      Allow_Downgrade_To_EAP_FAST: Yes
      Accept_Client_Certificate_During_Tunnel: Yes
      Request_Basic_Password_Auth: Yes
      Enable_EAP_Chaining: Yes
      
    # Preferred EAP Protocol
    Preferred_EAP_Protocol: EAP-TLS

  # Protocol service for MAB-only ports (IoT/Printers)
  MAB-Only-Protocols:
    Name: MAB-Only-Protocols
    Description: MAC Authentication Bypass only
    Process_Host_Lookup: Yes
    Allow_PAP_ASCII: Yes
    Allow_CHAP: No
    Allow_EAP_MD5: No
    Detect_EAP_Request: No
```

---

## 3.2.4 Network Device Groups

### Device Type Hierarchy

```yaml
# Administration > Network Resources > Network Device Groups

Device_Types:
  
  All_Device_Types:
    
    # SD-Access Fabric Devices
    SD-Access_Fabric:
      Description: All SD-Access fabric infrastructure
      
      Border_Nodes:
        Description: Fabric border nodes
        Devices:
          - MUM-BN-01
          - MUM-BN-02
          - LON-BN-01
          - LON-BN-02
          - NJ-BN-01
          - NJ-BN-02
          
      Control_Plane_Nodes:
        Description: Fabric control plane nodes
        Devices:
          - MUM-CP-01
          - MUM-CP-02
          - LON-CP-01
          - LON-CP-02
          - NJ-CP-01
          - NJ-CP-02
          
      Edge_Nodes:
        Description: Fabric edge nodes (access layer)
        Devices:
          - MUM-ED-01 through MUM-ED-48
          - LON-ED-01 through LON-ED-42
          - NJ-ED-01 through NJ-ED-52
          
      Extended_Nodes:
        Description: Fabric extended nodes
        Devices:
          - MUM-EX-01 through MUM-EX-10
          
    # Wireless Controllers
    Wireless_Controllers:
      Description: Cisco 9800 Series WLCs
      Devices:
        - WLC-MUM-01
        - WLC-MUM-02
        - WLC-LON-01
        - WLC-LON-02
        - WLC-NJ-01
        - WLC-NJ-02
        
    # Legacy/Non-Fabric
    Legacy_Devices:
      Description: Non-fabric network devices
      Devices:
        - Legacy switches pending migration
```

### Location Hierarchy

```yaml
# Administration > Network Resources > Network Device Groups > Location

Locations:
  
  All_Locations:
    
    APAC:
      Description: Asia Pacific Region
      
      India:
        Mumbai:
          PSN_Assignment: ISE-PSN-MUM-1, ISE-PSN-MUM-2
          Timezone: Asia/Kolkata
          
        Chennai:
          PSN_Assignment: ISE-PSN-CHN-1, ISE-PSN-CHN-2
          Timezone: Asia/Kolkata
          
        Bangalore:
          PSN_Assignment: ISE-PSN-MUM-1, ISE-PSN-MUM-2
          Timezone: Asia/Kolkata
          
        Delhi:
          PSN_Assignment: ISE-PSN-MUM-1, ISE-PSN-MUM-2
          Timezone: Asia/Kolkata
          
    EMEA:
      Description: Europe Middle East Africa
      
      United_Kingdom:
        London:
          PSN_Assignment: ISE-PSN-LON-1, ISE-PSN-LON-2
          Timezone: Europe/London
          
      Germany:
        Frankfurt:
          PSN_Assignment: ISE-PSN-FRA-1, ISE-PSN-FRA-2
          Timezone: Europe/Berlin
          
      France:
        Paris:
          PSN_Assignment: ISE-PSN-LON-1, ISE-PSN-LON-2
          Timezone: Europe/Paris
          
    Americas:
      Description: North and South America
      
      United_States:
        New_Jersey:
          PSN_Assignment: ISE-PSN-NJ-1, ISE-PSN-NJ-2
          Timezone: America/New_York
          
        Dallas:
          PSN_Assignment: ISE-PSN-DAL-1, ISE-PSN-DAL-2
          Timezone: America/Chicago
          
        Chicago:
          PSN_Assignment: ISE-PSN-NJ-1, ISE-PSN-NJ-2
          Timezone: America/Chicago
```

---

## 3.2.5 Policy Conditions

### Compound Conditions

```yaml
# Policy > Policy Elements > Conditions > Authorization > Compound Conditions

Compound_Conditions:

  # Employee Conditions
  Condition_Employee_Domain_User:
    Name: Employee-Domain-User
    Description: Domain user with valid machine auth
    Condition_Type: Compound
    Logic: AND
    Children:
      - CORP-AD:ExternalGroups CONTAINS Domain Users
      - Network Access:EapChainingResult EQUALS User and machine both succeeded
      
  Condition_Employee_EAP_TLS:
    Name: Employee-EAP-TLS
    Description: User authenticated via EAP-TLS certificate
    Condition_Type: Compound
    Logic: AND
    Children:
      - CORP-AD:ExternalGroups CONTAINS Domain Users
      - Network Access:EapAuthentication EQUALS EAP-TLS
      
  # Executive Conditions
  Condition_Executive:
    Name: Executive-User
    Description: Executive group member
    Condition_Type: Compound
    Logic: AND
    Children:
      - CORP-AD:ExternalGroups CONTAINS Executives
      - Network Access:EapChainingResult EQUALS User and machine both succeeded
      
  # HR Conditions
  Condition_HR_Staff:
    Name: HR-Staff
    Description: HR department users
    Condition_Type: Compound
    Logic: AND
    Children:
      - CORP-AD:ExternalGroups CONTAINS HR-Staff
      - Network Access:EapChainingResult EQUALS User and machine both succeeded
      
  # Finance Conditions
  Condition_Finance_Staff:
    Name: Finance-Staff
    Description: Finance department users
    Condition_Type: Compound
    Logic: AND
    Children:
      - CORP-AD:ExternalGroups CONTAINS Finance-Staff
      - Network Access:EapChainingResult EQUALS User and machine both succeeded
      
  # IT Admin Conditions
  Condition_IT_Admin:
    Name: IT-Admin
    Description: IT Administrators
    Condition_Type: Compound
    Logic: AND
    Children:
      - CORP-AD:ExternalGroups CONTAINS IT-Admins
      - Network Access:EapChainingResult EQUALS User and machine both succeeded
      
  # Contractor Conditions
  Condition_Contractor:
    Name: Contractor-User
    Description: External contractors
    Condition_Type: Compound
    Logic: AND
    Children:
      - CORP-AD:ExternalGroups CONTAINS Contractors
      - Network Access:EapAuthentication EQUALS PEAP
      
  # Device Conditions
  Condition_Cisco_IP_Phone:
    Name: Cisco-IP-Phone
    Description: Profiled as Cisco IP Phone
    Condition_Type: Compound
    Logic: OR
    Children:
      - Endpoints:BYODRegistration EQUALS Yes AND Endpoints:EndpointPolicy EQUALS Cisco-IP-Phone
      - Endpoints:EndpointPolicy EQUALS Cisco-IP-Phone-7800
      - Endpoints:EndpointPolicy EQUALS Cisco-IP-Phone-8800
      - Endpoints:EndpointPolicy EQUALS Cisco-IP-Phone-9800
      
  Condition_Printer:
    Name: Network-Printer
    Description: Profiled as network printer
    Condition_Type: Compound
    Logic: OR
    Children:
      - Endpoints:EndpointPolicy EQUALS HP-Printer
      - Endpoints:EndpointPolicy EQUALS Xerox-Printer
      - Endpoints:EndpointPolicy EQUALS Canon-Printer
      - Endpoints:EndpointPolicy CONTAINS Printer
      
  Condition_IoT_Sensor:
    Name: IoT-Sensor
    Description: IoT sensor devices
    Condition_Type: Compound
    Logic: OR
    Children:
      - Endpoints:EndpointPolicy CONTAINS IoT-Sensor
      - Endpoints:EndpointPolicy EQUALS Building-Sensor
      - Endpoints:EndpointPolicy EQUALS Environmental-Sensor
      
  Condition_IP_Camera:
    Name: IP-Camera
    Description: IP surveillance cameras
    Condition_Type: Compound
    Logic: OR
    Children:
      - Endpoints:EndpointPolicy EQUALS IP-Camera
      - Endpoints:EndpointPolicy EQUALS Axis-Camera
      - Endpoints:EndpointPolicy EQUALS Cisco-Video-Surveillance
      
  # Guest Conditions
  Condition_Guest_Sponsored:
    Name: Guest-Sponsored
    Description: Sponsored guest with accepted AUP
    Condition_Type: Compound
    Logic: AND
    Children:
      - IdentityGroup:Name EQUALS Guest_Sponsored
      - GuestUser:AUPAccepted EQUALS Yes
      
  Condition_Guest_Self_Reg:
    Name: Guest-Self-Registered
    Description: Self-registered guest
    Condition_Type: Compound
    Logic: AND
    Children:
      - IdentityGroup:Name EQUALS Guest_Self_Registered
      - GuestUser:AUPAccepted EQUALS Yes
      
  # Machine Conditions
  Condition_Domain_Computer:
    Name: Domain-Computer
    Description: Domain-joined workstation (machine auth only)
    Condition_Type: Compound
    Logic: AND
    Children:
      - CORP-AD:ExternalGroups CONTAINS Domain Computers
      - Network Access:EapAuthentication EQUALS EAP-TLS
      - Network Access:EapChainingResult EQUALS No chaining
```

---

## 3.2.6 Downloadable ACLs (DACLs)

### DACL Definitions

```yaml
# Policy > Policy Elements > Results > Authorization > Downloadable ACLs

Downloadable_ACLs:

  # Permit All (for trusted endpoints)
  DACL-PERMIT-ALL:
    Name: DACL-PERMIT-ALL
    Description: Permit all traffic - used with SGT enforcement
    DACL_Content: |
      permit ip any any

  # Deny All (for blocked endpoints)
  DACL-DENY-ALL:
    Name: DACL-DENY-ALL
    Description: Deny all traffic
    DACL_Content: |
      deny ip any any

  # Employee Limited (pre-posture or non-compliant)
  DACL-EMPLOYEE-LIMITED:
    Name: DACL-EMPLOYEE-LIMITED
    Description: Limited access for employees pending posture
    DACL_Content: |
      remark Allow DHCP
      permit udp any eq bootpc any eq bootps
      remark Allow DNS
      permit udp any any eq domain
      remark Allow ICMP
      permit icmp any any
      remark Allow posture remediation
      permit tcp any host 10.252.30.10 eq 8443
      permit tcp any host 10.252.30.20 eq 8443
      remark Allow AD authentication
      permit tcp any host 10.252.1.50 eq 389
      permit tcp any host 10.252.1.50 eq 636
      permit tcp any host 10.252.1.51 eq 389
      permit tcp any host 10.252.1.51 eq 636
      remark Deny all other
      deny ip any any

  # Quarantine (non-compliant or unknown)
  DACL-QUARANTINE:
    Name: DACL-QUARANTINE
    Description: Quarantine for non-compliant endpoints
    DACL_Content: |
      remark Allow DHCP
      permit udp any eq bootpc any eq bootps
      remark Allow DNS for redirection
      permit udp any any eq domain
      remark Allow remediation portal only
      permit tcp any host 10.252.30.10 eq 8443
      permit tcp any host 10.252.30.20 eq 8443
      permit tcp any host 10.252.100.50 eq 80
      permit tcp any host 10.252.100.50 eq 443
      remark Deny all other
      deny ip any any log

  # Guest Internet Only
  DACL-GUEST-INTERNET:
    Name: DACL-GUEST-INTERNET
    Description: Guest access - Internet only via proxy
    DACL_Content: |
      remark Allow DHCP
      permit udp any eq bootpc any eq bootps
      remark Allow DNS
      permit udp any any eq domain
      remark Allow web proxy
      permit tcp any host 10.252.100.100 eq 8080
      permit tcp any host 10.252.100.100 eq 443
      remark Block RFC1918
      deny ip any 10.0.0.0 0.255.255.255
      deny ip any 172.16.0.0 0.15.255.255
      deny ip any 192.168.0.0 0.0.255.255
      remark Allow Internet
      permit ip any any

  # Voice VLAN Access
  DACL-VOICE:
    Name: DACL-VOICE
    Description: Voice endpoints - SIP/RTP traffic
    DACL_Content: |
      remark Allow DHCP
      permit udp any eq bootpc any eq bootps
      remark Allow DNS
      permit udp any any eq domain
      remark Allow TFTP for phone config
      permit udp any host 10.252.60.10 eq tftp
      remark Allow SIP signaling
      permit udp any any eq 5060
      permit tcp any any eq 5060
      permit tcp any any eq 5061
      remark Allow RTP media
      permit udp any any range 16384 32767
      remark Allow CUCM
      permit tcp any host 10.252.60.10 eq 2000
      permit tcp any host 10.252.60.11 eq 2000
      remark Deny all other
      deny ip any any

  # Printer Access
  DACL-PRINTER:
    Name: DACL-PRINTER
    Description: Network printer access
    DACL_Content: |
      remark Allow DHCP
      permit udp any eq bootpc any eq bootps
      remark Allow DNS
      permit udp any any eq domain
      remark Allow print protocols
      permit tcp any any eq 9100
      permit tcp any any eq 515
      permit tcp any any eq 631
      remark Allow SNMP for monitoring
      permit udp any any eq snmp
      permit udp any any eq snmptrap
      remark Allow HTTP/HTTPS for management
      permit tcp any any eq 80
      permit tcp any any eq 443
      remark Deny all other
      deny ip any any

  # IoT Sensor Access
  DACL-IOT-SENSOR:
    Name: DACL-IOT-SENSOR
    Description: IoT sensor restricted access
    DACL_Content: |
      remark Allow DHCP
      permit udp any eq bootpc any eq bootps
      remark Allow DNS
      permit udp any any eq domain
      remark Allow NTP
      permit udp any any eq ntp
      remark Allow MQTT to IoT platform
      permit tcp any host 10.252.80.10 eq 1883
      permit tcp any host 10.252.80.10 eq 8883
      remark Allow CoAP
      permit udp any host 10.252.80.10 eq 5683
      remark Allow HTTPS to cloud
      permit tcp any any eq 443
      remark Deny all other
      deny ip any any

  # Camera Access
  DACL-CAMERA:
    Name: DACL-CAMERA
    Description: IP camera access
    DACL_Content: |
      remark Allow DHCP
      permit udp any eq bootpc any eq bootps
      remark Allow DNS
      permit udp any any eq domain
      remark Allow NTP
      permit udp any any eq ntp
      remark Allow RTSP streaming
      permit tcp any host 10.252.70.10 eq 554
      permit udp any host 10.252.70.10 range 6970 6999
      remark Allow VMS access
      permit tcp any host 10.252.70.10 eq 80
      permit tcp any host 10.252.70.10 eq 443
      remark Deny all other
      deny ip any any

  # Pre-Auth ACL (used during 802.1X)
  DACL-PRE-AUTH:
    Name: DACL-PRE-AUTH
    Description: Pre-authentication minimal access
    DACL_Content: |
      remark Allow DHCP
      permit udp any eq bootpc any eq bootps
      remark Allow DNS
      permit udp any any eq domain
      remark Allow TFTP for phones
      permit udp any any eq tftp
      remark Deny all other
      deny ip any any
```

---

## 3.2.7 Authorization Profiles

### Complete Authorization Profile Definitions

```yaml
# Policy > Policy Elements > Results > Authorization > Authorization Profiles

Authorization_Profiles:

  #############################################################################
  # CORPORATE USER PROFILES
  #############################################################################
  
  # Employees - Full Access
  AuthZ-Employee-Full:
    Name: AuthZ-Employee-Full
    Description: Full access for compliant employees
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PERMIT-ALL
      VLAN: 
        Tag_ID: 0
        Tunnel_Private_Group_ID: (Dynamic from Fabric)
        
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=000A-00
        - cisco-av-pair = cts:sgt-name=Employees
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 28800
        - Termination-Action = RADIUS-Request
        
  # Employees - Limited (Pre-Posture)
  AuthZ-Employee-Limited:
    Name: AuthZ-Employee-Limited
    Description: Limited access pending posture assessment
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-EMPLOYEE-LIMITED
      Web_Redirection:
        Type: Client Provisioning (Posture)
        ACL: ACL-POSTURE-REDIRECT
        Value: Client Provisioning Portal
        
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=03E7-00
        - cisco-av-pair = cts:sgt-name=Quarantine
        - cisco-av-pair = cts:vn=VN_CORPORATE
        - cisco-av-pair = url-redirect-acl=ACL-POSTURE-REDIRECT
        - cisco-av-pair = url-redirect=https://ise.corp.local:8443/portal/gateway?sessionId=SessionIdValue&portal=client-provisioning
      IETF:
        - Session-Timeout = 3600
        - Termination-Action = RADIUS-Request
        
  # Executives - Full Access
  AuthZ-Executive-Full:
    Name: AuthZ-Executive-Full
    Description: Full access for executives
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PERMIT-ALL
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=000B-00
        - cisco-av-pair = cts:sgt-name=Executives
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 28800
        - Termination-Action = RADIUS-Request
        
  # HR Staff
  AuthZ-HR-Staff:
    Name: AuthZ-HR-Staff
    Description: Access for HR department
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PERMIT-ALL
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=000C-00
        - cisco-av-pair = cts:sgt-name=HR
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 28800
        - Termination-Action = RADIUS-Request
        
  # Finance Staff
  AuthZ-Finance-Staff:
    Name: AuthZ-Finance-Staff
    Description: Access for Finance department
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PERMIT-ALL
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=000D-00
        - cisco-av-pair = cts:sgt-name=Finance
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 28800
        - Termination-Action = RADIUS-Request
        
  # IT Administrators
  AuthZ-IT-Admin:
    Name: AuthZ-IT-Admin
    Description: Full access for IT administrators
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PERMIT-ALL
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=000E-00
        - cisco-av-pair = cts:sgt-name=IT-Admins
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 28800
        - Termination-Action = RADIUS-Request
        
  # Contractors
  AuthZ-Contractor:
    Name: AuthZ-Contractor
    Description: Limited access for contractors
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PERMIT-ALL
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=000F-00
        - cisco-av-pair = cts:sgt-name=Contractors
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 28800
        - Termination-Action = RADIUS-Request

  #############################################################################
  # DEVICE PROFILES
  #############################################################################
  
  # Voice / IP Phones
  AuthZ-Voice:
    Name: AuthZ-Voice
    Description: Cisco IP Phone access
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-VOICE
      Voice_Domain_Permission: Enabled
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=0014-00
        - cisco-av-pair = cts:sgt-name=Voice
        - cisco-av-pair = cts:vn=VN_VOICE
        - cisco-av-pair = device-traffic-class=voice
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request

  # Video Endpoints
  AuthZ-Video:
    Name: AuthZ-Video
    Description: Video conferencing endpoints
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PERMIT-ALL
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=0015-00
        - cisco-av-pair = cts:sgt-name=Video
        - cisco-av-pair = cts:vn=VN_VOICE
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request
        
  # Printers
  AuthZ-Printer:
    Name: AuthZ-Printer
    Description: Network printer access
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PRINTER
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=001E-00
        - cisco-av-pair = cts:sgt-name=Printers
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request
        
  # Scanners/MFPs
  AuthZ-Scanner:
    Name: AuthZ-Scanner
    Description: Network scanner/MFP access
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PRINTER
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=001F-00
        - cisco-av-pair = cts:sgt-name=Scanners
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request

  #############################################################################
  # GUEST PROFILES
  #############################################################################
  
  # Sponsored Guest
  AuthZ-Guest-Sponsored:
    Name: AuthZ-Guest-Sponsored
    Description: Sponsored guest access
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-GUEST-INTERNET
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=0028-00
        - cisco-av-pair = cts:sgt-name=Guests
        - cisco-av-pair = cts:vn=VN_GUEST
      IETF:
        - Session-Timeout = 28800
        - Termination-Action = RADIUS-Request
        
  # Premium Guest
  AuthZ-Guest-Premium:
    Name: AuthZ-Guest-Premium
    Description: Premium guest with extended access
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PERMIT-ALL
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=0029-00
        - cisco-av-pair = cts:sgt-name=Guest-Premium
        - cisco-av-pair = cts:vn=VN_GUEST
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request

  #############################################################################
  # IOT PROFILES
  #############################################################################
  
  # IoT Sensors
  AuthZ-IoT-Sensor:
    Name: AuthZ-IoT-Sensor
    Description: Building/environmental sensors
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-IOT-SENSOR
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=0032-00
        - cisco-av-pair = cts:sgt-name=IoT-Sensors
        - cisco-av-pair = cts:vn=VN_IOT
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request
        
  # HVAC Controllers
  AuthZ-IoT-HVAC:
    Name: AuthZ-IoT-HVAC
    Description: HVAC controller access
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-IOT-SENSOR
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=0033-00
        - cisco-av-pair = cts:sgt-name=IoT-HVAC
        - cisco-av-pair = cts:vn=VN_IOT
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request
        
  # Lighting Systems
  AuthZ-IoT-Lighting:
    Name: AuthZ-IoT-Lighting
    Description: Smart lighting systems
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-IOT-SENSOR
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=0034-00
        - cisco-av-pair = cts:sgt-name=IoT-Lighting
        - cisco-av-pair = cts:vn=VN_IOT
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request
        
  # OT Devices
  AuthZ-OT-Device:
    Name: AuthZ-OT-Device
    Description: Operational technology devices
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-IOT-SENSOR
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=003C-00
        - cisco-av-pair = cts:sgt-name=OT-Devices
        - cisco-av-pair = cts:vn=VN_IOT
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request
        
  # IP Cameras
  AuthZ-Camera:
    Name: AuthZ-Camera
    Description: IP surveillance cameras
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-CAMERA
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=0046-00
        - cisco-av-pair = cts:sgt-name=Cameras
        - cisco-av-pair = cts:vn=VN_IOT
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request
        
  # Badge Readers
  AuthZ-Badge-Reader:
    Name: AuthZ-Badge-Reader
    Description: Physical access control readers
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-IOT-SENSOR
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=0047-00
        - cisco-av-pair = cts:sgt-name=Badge-Readers
        - cisco-av-pair = cts:vn=VN_IOT
      IETF:
        - Session-Timeout = 86400
        - Termination-Action = RADIUS-Request

  #############################################################################
  # SPECIAL PROFILES
  #############################################################################
  
  # Quarantine
  AuthZ-Quarantine:
    Name: AuthZ-Quarantine
    Description: Quarantine for non-compliant or unknown devices
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-QUARANTINE
      Web_Redirection:
        Type: Client Provisioning (Posture)
        ACL: ACL-POSTURE-REDIRECT
        Value: Remediation Portal
        
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=03E7-00
        - cisco-av-pair = cts:sgt-name=Quarantine
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 600
        - Termination-Action = RADIUS-Request
        
  # Unknown Device
  AuthZ-Unknown:
    Name: AuthZ-Unknown
    Description: Unknown device profile
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-QUARANTINE
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=03E6-00
        - cisco-av-pair = cts:sgt-name=Unknown
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 600
        - Termination-Action = RADIUS-Request
        
  # Domain Computer (Machine Auth Only)
  AuthZ-Domain-Computer:
    Name: AuthZ-Domain-Computer
    Description: Domain computer without user logged in
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-EMPLOYEE-LIMITED
      
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=000A-00
        - cisco-av-pair = cts:sgt-name=Employees
        - cisco-av-pair = cts:vn=VN_CORPORATE
      IETF:
        - Session-Timeout = 28800
        - Termination-Action = RADIUS-Request

  # Wireless Guest Web Auth Redirect
  AuthZ-Guest-WebAuth:
    Name: AuthZ-Guest-WebAuth
    Description: Guest redirect for web authentication
    Access_Type: ACCESS_ACCEPT
    
    Common_Tasks:
      DACL_Name: DACL-PRE-AUTH
      Web_Redirection:
        Type: Centralized Web Auth
        ACL: ACL-WEBAUTH-REDIRECT
        Value: Guest Portal
        
    Advanced_Attributes_Settings:
      Cisco:
        - cisco-av-pair = cts:security-group-tag=0028-00
        - cisco-av-pair = cts:sgt-name=Guests
        - cisco-av-pair = cts:vn=VN_GUEST
        - cisco-av-pair = url-redirect-acl=ACL-WEBAUTH-REDIRECT
        - cisco-av-pair = url-redirect=https://ise.corp.local:8443/portal/gateway?sessionId=SessionIdValue&portal=guest-portal
      IETF:
        - Session-Timeout = 600
        - Termination-Action = RADIUS-Request
```

---

## 3.2.8 Policy Sets - Wired SD-Access

### Complete Wired Policy Set

```yaml
# Policy > Policy Sets

Policy_Set_Wired_SD_Access:
  
  Name: SD-ACCESS-WIRED
  Description: Policy set for SD-Access wired fabric authentication
  Status: Enabled
  Rank: 1
  
  # Policy Set Condition
  Condition:
    - DEVICE:Device Type EQUALS SD-Access_Fabric#Edge_Nodes
    OR
    - DEVICE:Device Type EQUALS SD-Access_Fabric#Extended_Nodes
    OR
    - Radius:Service-Type EQUALS Call-Check
    OR
    - Radius:Service-Type EQUALS Framed
    
  # Allowed Protocols
  Allowed_Protocols: SDA-Allowed-Protocols
  
  #############################################################################
  # AUTHENTICATION POLICY
  #############################################################################
  
  Authentication_Policy:
    
    # Rule 1: EAP-TLS Certificate Authentication
    Rule_DOT1X_EAP_TLS:
      Name: DOT1X-EAP-TLS
      Condition: Network Access:EapAuthentication EQUALS EAP-TLS
      Identity_Store: Corp-Auth-Sequence
      If_User_Not_Found: REJECT
      If_Process_Fail: DROP
      
    # Rule 2: PEAP-MSCHAPv2 Password Authentication  
    Rule_DOT1X_PEAP:
      Name: DOT1X-PEAP
      Condition: Network Access:EapAuthentication EQUALS PEAP(EAP-MSCHAPv2)
      Identity_Store: Corp-Auth-Sequence
      If_User_Not_Found: REJECT
      If_Process_Fail: DROP
      
    # Rule 3: MAB for Profiled Devices
    Rule_MAB_Profiled:
      Name: MAB-Profiled
      Condition: 
        - Radius:Service-Type EQUALS Call-Check
        AND
        - Endpoints:BYODRegistration EQUALS Yes OR Endpoints:EndpointPolicy EXISTS
      Identity_Store: Endpoint-Auth-Sequence
      If_User_Not_Found: CONTINUE
      If_Process_Fail: DROP
      
    # Rule 4: MAB for Unknown Devices
    Rule_MAB_Unknown:
      Name: MAB-Unknown
      Condition: Radius:Service-Type EQUALS Call-Check
      Identity_Store: Internal Endpoints
      If_User_Not_Found: CONTINUE
      If_Process_Fail: DROP
      
    # Rule 5: Default
    Rule_Default:
      Name: Default
      Condition: (Default - matches all)
      Identity_Store: DenyAccess
      If_User_Not_Found: REJECT
      If_Process_Fail: DROP

  #############################################################################
  # AUTHORIZATION POLICY
  #############################################################################
  
  Authorization_Policy:
  
    # =========================================================================
    # EXCEPTION RULES (Highest Priority)
    # =========================================================================
    
    # Blacklist - Deny
    Rule_Blacklist:
      Name: Blacklisted-Endpoint
      Condition: Endpoints:BlackList EQUALS True
      Result: DenyAccess
      SGT: N/A
      
    # Lost or Stolen Device
    Rule_Lost_Stolen:
      Name: Lost-Stolen-Device
      Condition: Endpoints:LostOrStolen EQUALS True
      Result: DenyAccess
      SGT: N/A
    
    # =========================================================================
    # POSTURE NON-COMPLIANT RULES
    # =========================================================================
    
    Rule_Posture_NonCompliant:
      Name: Posture-Non-Compliant
      Condition:
        - Session:PostureStatus EQUALS NonCompliant
      Result: AuthZ-Quarantine
      SGT: Quarantine (999)
      
    Rule_Posture_Unknown:
      Name: Posture-Unknown
      Condition:
        - Session:PostureStatus EQUALS Unknown
        AND
        - Network Access:EapAuthentication EQUALS EAP-TLS OR Network Access:EapAuthentication EQUALS PEAP
      Result: AuthZ-Employee-Limited
      SGT: Quarantine (999)
      
    # =========================================================================
    # USER AUTHORIZATION RULES
    # =========================================================================
    
    # IT Administrators - Highest User Priority
    Rule_IT_Admin:
      Name: IT-Admin-Full-Access
      Condition:
        - CORP-AD:ExternalGroups CONTAINS IT-Admins
        AND
        - Network Access:EapChainingResult EQUALS User and machine both succeeded
        AND
        - Session:PostureStatus EQUALS Compliant
      Result: AuthZ-IT-Admin
      SGT: IT-Admins (14)
      
    # Executives
    Rule_Executive:
      Name: Executive-Full-Access
      Condition:
        - CORP-AD:ExternalGroups CONTAINS Executives
        AND
        - Network Access:EapChainingResult EQUALS User and machine both succeeded
        AND
        - Session:PostureStatus EQUALS Compliant
      Result: AuthZ-Executive-Full
      SGT: Executives (11)
      
    # HR Staff
    Rule_HR:
      Name: HR-Staff-Access
      Condition:
        - CORP-AD:ExternalGroups CONTAINS HR-Staff
        AND
        - Network Access:EapChainingResult EQUALS User and machine both succeeded
        AND
        - Session:PostureStatus EQUALS Compliant
      Result: AuthZ-HR-Staff
      SGT: HR (12)
      
    # Finance Staff
    Rule_Finance:
      Name: Finance-Staff-Access
      Condition:
        - CORP-AD:ExternalGroups CONTAINS Finance-Staff
        AND
        - Network Access:EapChainingResult EQUALS User and machine both succeeded
        AND
        - Session:PostureStatus EQUALS Compliant
      Result: AuthZ-Finance-Staff
      SGT: Finance (13)
      
    # Contractors
    Rule_Contractor:
      Name: Contractor-Access
      Condition:
        - CORP-AD:ExternalGroups CONTAINS Contractors
        AND
        - Network Access:EapAuthentication EQUALS PEAP
      Result: AuthZ-Contractor
      SGT: Contractors (15)
      
    # Standard Employees - EAP Chaining Success
    Rule_Employee_Full:
      Name: Employee-Full-Access
      Condition:
        - CORP-AD:ExternalGroups CONTAINS Domain Users
        AND
        - Network Access:EapChainingResult EQUALS User and machine both succeeded
        AND
        - Session:PostureStatus EQUALS Compliant
      Result: AuthZ-Employee-Full
      SGT: Employees (10)
      
    # Employees - User Auth Only (No Machine)
    Rule_Employee_User_Only:
      Name: Employee-User-Only
      Condition:
        - CORP-AD:ExternalGroups CONTAINS Domain Users
        AND
        - Network Access:EapChainingResult EQUALS User succeeded
      Result: AuthZ-Employee-Full
      SGT: Employees (10)
      
    # Domain Computer - Machine Only (No User Logged In)
    Rule_Domain_Computer:
      Name: Domain-Computer-Only
      Condition:
        - CORP-AD:ExternalGroups CONTAINS Domain Computers
        AND
        - Network Access:EapChainingResult EQUALS Machine succeeded
      Result: AuthZ-Domain-Computer
      SGT: Employees (10)
      
    # =========================================================================
    # DEVICE AUTHORIZATION RULES (MAB)
    # =========================================================================
    
    # Cisco IP Phones
    Rule_IP_Phone:
      Name: Cisco-IP-Phone
      Condition:
        - Endpoints:EndpointPolicy EQUALS Cisco-IP-Phone
        OR
        - Endpoints:EndpointPolicy EQUALS Cisco-IP-Phone-7800
        OR
        - Endpoints:EndpointPolicy EQUALS Cisco-IP-Phone-8800
      Result: AuthZ-Voice
      SGT: Voice (20)
      
    # Video Endpoints
    Rule_Video_Endpoint:
      Name: Video-Endpoint
      Condition:
        - Endpoints:EndpointPolicy EQUALS Cisco-Telepresence
        OR
        - Endpoints:EndpointPolicy EQUALS Cisco-Webex-Device
      Result: AuthZ-Video
      SGT: Video (21)
      
    # Network Printers
    Rule_Printer:
      Name: Network-Printer
      Condition:
        - Endpoints:EndpointPolicy CONTAINS Printer
        OR
        - Endpoints:EndpointPolicy EQUALS HP-Printer
        OR
        - Endpoints:EndpointPolicy EQUALS Xerox-Printer
      Result: AuthZ-Printer
      SGT: Printers (30)
      
    # Scanners/MFPs
    Rule_Scanner:
      Name: Scanner-MFP
      Condition:
        - Endpoints:EndpointPolicy CONTAINS Scanner
        OR
        - Endpoints:EndpointPolicy CONTAINS MFP
      Result: AuthZ-Scanner
      SGT: Scanners (31)
      
    # IoT Sensors
    Rule_IoT_Sensor:
      Name: IoT-Sensor
      Condition:
        - Endpoints:EndpointPolicy CONTAINS IoT-Sensor
        OR
        - Endpoints:EndpointPolicy CONTAINS Building-Sensor
      Result: AuthZ-IoT-Sensor
      SGT: IoT-Sensors (50)
      
    # HVAC Controllers
    Rule_HVAC:
      Name: HVAC-Controller
      Condition:
        - Endpoints:EndpointPolicy CONTAINS HVAC
        OR
        - Endpoints:EndpointPolicy CONTAINS BACnet
      Result: AuthZ-IoT-HVAC
      SGT: IoT-HVAC (51)
      
    # Lighting Systems
    Rule_Lighting:
      Name: Lighting-System
      Condition:
        - Endpoints:EndpointPolicy CONTAINS Lighting
        OR
        - Endpoints:EndpointPolicy CONTAINS Lutron
      Result: AuthZ-IoT-Lighting
      SGT: IoT-Lighting (52)
      
    # OT Devices
    Rule_OT:
      Name: OT-Device
      Condition:
        - Endpoints:EndpointPolicy CONTAINS OT-Device
        OR
        - Endpoints:EndpointPolicy CONTAINS SCADA
        OR
        - Endpoints:EndpointPolicy CONTAINS PLC
      Result: AuthZ-OT-Device
      SGT: OT-Devices (60)
      
    # IP Cameras
    Rule_Camera:
      Name: IP-Camera
      Condition:
        - Endpoints:EndpointPolicy CONTAINS Camera
        OR
        - Endpoints:EndpointPolicy EQUALS Axis-Camera
        OR
        - Endpoints:EndpointPolicy EQUALS Cisco-Video-Surveillance
      Result: AuthZ-Camera
      SGT: Cameras (70)
      
    # Badge Readers
    Rule_Badge_Reader:
      Name: Badge-Reader
      Condition:
        - Endpoints:EndpointPolicy CONTAINS Badge-Reader
        OR
        - Endpoints:EndpointPolicy CONTAINS Access-Control
      Result: AuthZ-Badge-Reader
      SGT: Badge-Readers (71)
      
    # =========================================================================
    # PROFILING IN PROGRESS
    # =========================================================================
    
    Rule_Profiling_InProgress:
      Name: Profiling-In-Progress
      Condition:
        - Radius:Service-Type EQUALS Call-Check
        AND
        - Endpoints:EndpointPolicy EQUALS Unknown
        AND
        - Endpoints:ProfilerAutoCreate EQUALS True
      Result: AuthZ-Unknown
      SGT: Unknown (998)
      
    # =========================================================================
    # DEFAULT RULES
    # =========================================================================
    
    # Unknown MAB Device
    Rule_Unknown_MAB:
      Name: Unknown-MAB-Device
      Condition:
        - Radius:Service-Type EQUALS Call-Check
      Result: AuthZ-Unknown
      SGT: Unknown (998)
      
    # Default Deny
    Rule_Default:
      Name: Default-Deny
      Condition: (Default)
      Result: DenyAccess
      SGT: N/A
```

---

## 3.2.9 Policy Sets - Wireless SD-Access

### Complete Wireless Policy Set

```yaml
# Policy > Policy Sets

Policy_Set_Wireless_SD_Access:
  
  Name: SD-ACCESS-WIRELESS
  Description: Policy set for SD-Access wireless fabric authentication
  Status: Enabled
  Rank: 2
  
  # Policy Set Condition
  Condition:
    - DEVICE:Device Type EQUALS Wireless_Controllers
    OR
    - Radius:Called-Station-ID CONTAINS Corp-Secure
    OR
    - Radius:Called-Station-ID CONTAINS Corp-Guest
    OR
    - Radius:Called-Station-ID CONTAINS Corp-IoT
    OR
    - Radius:Called-Station-ID CONTAINS Corp-Voice
    
  # Allowed Protocols
  Allowed_Protocols: SDA-Allowed-Protocols
  
  #############################################################################
  # AUTHENTICATION POLICY
  #############################################################################
  
  Authentication_Policy:
    
    # Rule 1: Corporate SSID - EAP-TLS
    Rule_Corp_EAP_TLS:
      Name: Corp-Secure-EAP-TLS
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Secure
        AND
        - Network Access:EapAuthentication EQUALS EAP-TLS
      Identity_Store: Corp-Auth-Sequence
      If_User_Not_Found: REJECT
      
    # Rule 2: Corporate SSID - PEAP
    Rule_Corp_PEAP:
      Name: Corp-Secure-PEAP
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Secure
        AND
        - Network Access:EapAuthentication EQUALS PEAP
      Identity_Store: Corp-Auth-Sequence
      If_User_Not_Found: REJECT
      
    # Rule 3: Guest SSID - MAB (pre-webauth)
    Rule_Guest_MAB:
      Name: Corp-Guest-MAB
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Guest
      Identity_Store: Guest-Auth-Sequence
      If_User_Not_Found: CONTINUE
      
    # Rule 4: IoT SSID - PSK with MAB
    Rule_IoT_MAB:
      Name: Corp-IoT-MAB
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-IoT
      Identity_Store: Endpoint-Auth-Sequence
      If_User_Not_Found: CONTINUE
      
    # Rule 5: Voice SSID
    Rule_Voice:
      Name: Corp-Voice-802.1X
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Voice
      Identity_Store: Corp-Auth-Sequence
      If_User_Not_Found: REJECT
      
    # Rule 6: Default
    Rule_Default:
      Name: Default
      Condition: (Default)
      Identity_Store: DenyAccess

  #############################################################################
  # AUTHORIZATION POLICY
  #############################################################################
  
  Authorization_Policy:
  
    # =========================================================================
    # CORPORATE WIRELESS (Corp-Secure SSID)
    # =========================================================================
    
    # IT Admins - Wireless
    Rule_IT_Admin_Wireless:
      Name: IT-Admin-Wireless
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Secure
        AND
        - CORP-AD:ExternalGroups CONTAINS IT-Admins
      Result: AuthZ-IT-Admin
      SGT: IT-Admins (14)
      
    # Executives - Wireless
    Rule_Executive_Wireless:
      Name: Executive-Wireless
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Secure
        AND
        - CORP-AD:ExternalGroups CONTAINS Executives
      Result: AuthZ-Executive-Full
      SGT: Executives (11)
      
    # HR Staff - Wireless
    Rule_HR_Wireless:
      Name: HR-Staff-Wireless
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Secure
        AND
        - CORP-AD:ExternalGroups CONTAINS HR-Staff
      Result: AuthZ-HR-Staff
      SGT: HR (12)
      
    # Finance Staff - Wireless
    Rule_Finance_Wireless:
      Name: Finance-Staff-Wireless
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Secure
        AND
        - CORP-AD:ExternalGroups CONTAINS Finance-Staff
      Result: AuthZ-Finance-Staff
      SGT: Finance (13)
      
    # Contractors - Wireless
    Rule_Contractor_Wireless:
      Name: Contractor-Wireless
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Secure
        AND
        - CORP-AD:ExternalGroups CONTAINS Contractors
      Result: AuthZ-Contractor
      SGT: Contractors (15)
      
    # Standard Employee - Wireless
    Rule_Employee_Wireless:
      Name: Employee-Wireless
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Secure
        AND
        - CORP-AD:ExternalGroups CONTAINS Domain Users
      Result: AuthZ-Employee-Full
      SGT: Employees (10)
      
    # =========================================================================
    # GUEST WIRELESS (Corp-Guest SSID)
    # =========================================================================
    
    # Guest - Post Web Auth (Authenticated)
    Rule_Guest_Authenticated:
      Name: Guest-Authenticated
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Guest
        AND
        - IdentityGroup:Name EQUALS Guest_Sponsored
        AND
        - GuestUser:AUPAccepted EQUALS Yes
      Result: AuthZ-Guest-Sponsored
      SGT: Guests (40)
      
    # Guest - Self Registered
    Rule_Guest_Self_Reg:
      Name: Guest-Self-Registered
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Guest
        AND
        - IdentityGroup:Name EQUALS Guest_Self_Registered
      Result: AuthZ-Guest-Sponsored
      SGT: Guests (40)
      
    # Guest - Pre Web Auth (Redirect)
    Rule_Guest_PreAuth:
      Name: Guest-Pre-WebAuth
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Guest
      Result: AuthZ-Guest-WebAuth
      SGT: Guests (40)
      
    # =========================================================================
    # IOT WIRELESS (Corp-IoT SSID)
    # =========================================================================
    
    # IoT Sensors - Wireless
    Rule_IoT_Sensor_Wireless:
      Name: IoT-Sensor-Wireless
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-IoT
        AND
        - Endpoints:EndpointPolicy CONTAINS IoT-Sensor
      Result: AuthZ-IoT-Sensor
      SGT: IoT-Sensors (50)
      
    # Unknown IoT
    Rule_IoT_Unknown:
      Name: IoT-Unknown-Wireless
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-IoT
      Result: AuthZ-Unknown
      SGT: Unknown (998)
      
    # =========================================================================
    # VOICE WIRELESS (Corp-Voice SSID)
    # =========================================================================
    
    # Voice Devices
    Rule_Voice_Wireless:
      Name: Voice-Device-Wireless
      Condition:
        - Radius:Called-Station-ID CONTAINS Corp-Voice
      Result: AuthZ-Voice
      SGT: Voice (20)
      
    # =========================================================================
    # DEFAULT
    # =========================================================================
    
    Rule_Default:
      Name: Default-Wireless
      Condition: (Default)
      Result: DenyAccess
```

---

## 3.2.10 SGT Matrix Summary

### SGT to Authorization Profile Mapping

| SGT Value | SGT Name | Authorization Profile | VN Assignment | Use Case |
|-----------|----------|----------------------|---------------|----------|
| 10 (0x000A) | Employees | AuthZ-Employee-Full | VN_CORPORATE | Standard employees |
| 11 (0x000B) | Executives | AuthZ-Executive-Full | VN_CORPORATE | Executive users |
| 12 (0x000C) | HR | AuthZ-HR-Staff | VN_CORPORATE | HR department |
| 13 (0x000D) | Finance | AuthZ-Finance-Staff | VN_CORPORATE | Finance department |
| 14 (0x000E) | IT-Admins | AuthZ-IT-Admin | VN_CORPORATE | IT administrators |
| 15 (0x000F) | Contractors | AuthZ-Contractor | VN_CORPORATE | External contractors |
| 20 (0x0014) | Voice | AuthZ-Voice | VN_VOICE | IP phones |
| 21 (0x0015) | Video | AuthZ-Video | VN_VOICE | Video endpoints |
| 30 (0x001E) | Printers | AuthZ-Printer | VN_CORPORATE | Network printers |
| 31 (0x001F) | Scanners | AuthZ-Scanner | VN_CORPORATE | MFPs/Scanners |
| 40 (0x0028) | Guests | AuthZ-Guest-Sponsored | VN_GUEST | Guest users |
| 41 (0x0029) | Guest-Premium | AuthZ-Guest-Premium | VN_GUEST | Premium guests |
| 50 (0x0032) | IoT-Sensors | AuthZ-IoT-Sensor | VN_IOT | Building sensors |
| 51 (0x0033) | IoT-HVAC | AuthZ-IoT-HVAC | VN_IOT | HVAC systems |
| 52 (0x0034) | IoT-Lighting | AuthZ-IoT-Lighting | VN_IOT | Lighting systems |
| 60 (0x003C) | OT-Devices | AuthZ-OT-Device | VN_IOT | OT/SCADA devices |
| 70 (0x0046) | Cameras | AuthZ-Camera | VN_IOT | IP cameras |
| 71 (0x0047) | Badge-Readers | AuthZ-Badge-Reader | VN_IOT | Access control |
| 80 (0x0050) | Servers-Prod | (Static mapping) | VN_SERVERS | Production servers |
| 81 (0x0051) | Servers-DB | (Static mapping) | VN_SERVERS | Database servers |
| 82 (0x0052) | Servers-Web | (Static mapping) | VN_SERVERS | Web servers |
| 83 (0x0053) | Servers-App | (Static mapping) | VN_SERVERS | App servers |
| 90 (0x005A) | Servers-Dev | (Static mapping) | VN_SERVERS | Dev servers |
| 91 (0x005B) | Servers-Test | (Static mapping) | VN_SERVERS | Test servers |
| 998 (0x03E6) | Unknown | AuthZ-Unknown | VN_CORPORATE | Unknown devices |
| 999 (0x03E7) | Quarantine | AuthZ-Quarantine | VN_CORPORATE | Non-compliant |

---

## 3.2.11 CoA (Change of Authorization) Configuration

### CoA Profile Settings

```yaml
# Administration > Network Resources > Network Devices > Default Settings

CoA_Settings:
  
  CoA_Port: 1700
  CoA_Timeout: 5 seconds
  CoA_Retries: 2
  
  # CoA Types for SD-Access
  Supported_CoA_Types:
    - Reauthenticate (Session restart)
    - Terminate Session (Port bounce)
    - Port Bounce (Interface shut/no shut)
    - Push ACL (Dynamic ACL update)
    
  # ISE CoA Triggers
  CoA_Triggers:
    Posture_Assessment_Complete:
      Action: Reauthenticate
      Description: Re-authorize after posture compliance check
      
    Endpoint_Profile_Change:
      Action: Reauthenticate
      Description: Re-authorize after profiling update
      
    Identity_Group_Change:
      Action: Reauthenticate
      Description: Re-authorize after group membership change
      
    Manual_CoA:
      Action: Session Terminate
      Description: Administrator-initiated session termination
      
    Blacklist_Add:
      Action: Session Terminate
      Description: Immediate disconnect for blacklisted endpoint
```

---

## 3.2.12 Guest Portal Configuration

### Self-Registered Guest Portal

```yaml
# Work Centers > Guest Access > Portals & Components > Guest Portals

Guest_Portal_Self_Registration:
  
  Name: Corp-Guest-Self-Registration
  Description: Self-registration portal for visitors
  
  Portal_Settings:
    HTTPS_Port: 8443
    Allowed_Interfaces: All PSN interfaces
    Certificate_Group: Guest-Portal-Cert
    Authentication_Method: As a guest
    
  Login_Page_Settings:
    Include_AUP: Yes
    AUP_Text: "By using this network, you agree to..."
    Require_Scrolling: Yes
    Require_AUP_Acceptance: Yes
    
  Self_Registration_Settings:
    Registration_Code: Not required
    Guest_Type: Daily_Guest
    
    Required_Fields:
      - First Name
      - Last Name
      - Email Address
      - Phone Number
      - Company
      - Reason for Visit
      
    Optional_Fields:
      - SMS Provider
      
    Account_Duration:
      Default: 1 day
      Maximum: 5 days
      
    Sponsor_Notification:
      Notify_Sponsor: Yes
      Sponsor_Email: reception@corp.local
      
  Post_Login_Banner:
    Include_Banner: Yes
    Banner_Text: "Welcome to Corp Network. Limited internet access provided."
    
  Guest_Device_Registration:
    Allow_Registration: Yes
    Maximum_Devices: 3
```

### Sponsored Guest Portal

```yaml
# Work Centers > Guest Access > Portals & Components > Guest Portals

Guest_Portal_Sponsored:
  
  Name: Corp-Guest-Sponsored
  Description: Sponsor-approved guest access portal
  
  Portal_Settings:
    HTTPS_Port: 8443
    Authentication_Method: As a guest
    
  Sponsor_Portal:
    Name: Corp-Sponsor-Portal
    Access_Groups:
      - All_Employees (can sponsor)
      - Reception (can sponsor)
      
    Sponsor_Permissions:
      Create_Guest_Accounts: Yes
      Suspend_Guest_Accounts: Yes
      Reinstate_Guest_Accounts: Yes
      Extend_Guest_Accounts: Yes
      View_Guest_Passwords: Yes
      Send_Notification: Email, SMS
      
    Guest_Types_Allowed:
      - Daily Guest (1 day)
      - Weekly Guest (7 days)
      - Contractor Guest (30 days)
```

---

## 3.2.13 Profiler Configuration

### Profiling Policies for SD-Access

```yaml
# Work Centers > Profiler > Profiling Policies

Custom_Profiling_Policies:

  # Cisco IP Phone 8800 Series
  Cisco-IP-Phone-8800:
    Description: Cisco 8800 Series IP Phone
    Minimum_Certainty_Factor: 70
    
    Rules:
      Rule_1:
        Condition: DHCP:dhcp-class-identifier CONTAINS "Cisco Systems, Inc. IP Phone CP-88"
        Certainty_Factor: 40
      Rule_2:
        Condition: LLDP:lldp-system-description CONTAINS "Cisco IP Phone 88"
        Certainty_Factor: 30
      Rule_3:
        Condition: CDP:cdp-platform-type CONTAINS "Cisco IP Phone 88"
        Certainty_Factor: 30
        
    Parent_Policy: Cisco-IP-Phone
    Associated_CoA: REAUTH
    
  # Building Sensors
  Building-Sensor:
    Description: Building automation sensors
    Minimum_Certainty_Factor: 50
    
    Rules:
      Rule_1:
        Condition: DHCP:dhcp-class-identifier CONTAINS "BACnet"
        Certainty_Factor: 30
      Rule_2:
        Condition: MAC:MACAddress STARTSWITH 00:80:F4
        Certainty_Factor: 20
      Rule_3:
        Condition: NMAP:os-type CONTAINS "embedded"
        Certainty_Factor: 20
        
    Parent_Policy: IoT-Device
    Associated_CoA: REAUTH
    
  # IP Cameras - Axis
  Axis-Camera:
    Description: Axis IP surveillance cameras
    Minimum_Certainty_Factor: 60
    
    Rules:
      Rule_1:
        Condition: MAC:MACAddress STARTSWITH 00:40:8C
        Certainty_Factor: 30
      Rule_2:
        Condition: DHCP:dhcp-class-identifier CONTAINS "AXIS"
        Certainty_Factor: 30
      Rule_3:
        Condition: HTTP:user-agent CONTAINS "AXIS"
        Certainty_Factor: 20
        
    Parent_Policy: IP-Camera
    Associated_CoA: REAUTH
```

---

## 3.2.14 Policy Validation Checklist

| Component | Configuration | Verified | Date |
|-----------|--------------|----------|------|
| **Identity Sources** |
| | Active Directory join point | ☐ | |
| | AD groups imported | ☐ | |
| | Identity source sequences | ☐ | |
| **Allowed Protocols** |
| | EAP-TLS enabled | ☐ | |
| | PEAP enabled | ☐ | |
| | EAP chaining enabled | ☐ | |
| **Network Device Groups** |
| | Device types defined | ☐ | |
| | Locations defined | ☐ | |
| | Devices assigned | ☐ | |
| **Conditions** |
| | Compound conditions created | ☐ | |
| | Tested with policy trace | ☐ | |
| **Authorization Profiles** |
| | All 25+ profiles created | ☐ | |
| | SGT values correct | ☐ | |
| | VN assignments correct | ☐ | |
| | DACLs attached | ☐ | |
| **Policy Sets** |
| | Wired policy set complete | ☐ | |
| | Wireless policy set complete | ☐ | |
| | Rule order verified | ☐ | |
| **Guest Access** |
| | Self-registration portal | ☐ | |
| | Sponsor portal | ☐ | |
| | Guest types defined | ☐ | |
| **Profiling** |
| | Custom policies created | ☐ | |
| | Probes enabled (DHCP, CDP, LLDP) | ☐ | |
| | Feed service enabled | ☐ | |

---
