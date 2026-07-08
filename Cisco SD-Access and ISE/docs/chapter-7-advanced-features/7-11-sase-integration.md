# 7.11 SASE Integration with SD-Access

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. SASE Architecture Overview

### 1.1 Cisco SASE Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Abhavtech SASE Architecture                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                        ┌─────────────────────┐                      │
│                        │  Cisco Secure Access │                     │
│                        │   (SSE Platform)     │                     │
│                        ├─────────────────────┤                      │
│                        │ • ZTNA              │                      │
│                        │ • SWG               │                      │
│                        │ • CASB              │                      │
│                        │ • FWaaS             │                      │
│                        │ • DNS Security      │                      │
│                        └──────────┬──────────┘                      │
│                                   │                                  │
│         ┌─────────────────────────┼─────────────────────────┐       │
│         │                         │                         │       │
│         ▼                         ▼                         ▼       │
│   ┌───────────┐           ┌───────────┐           ┌───────────┐    │
│   │  Remote   │           │  Branch   │           │  Campus   │    │
│   │  Users    │           │  Offices  │           │  Users    │    │
│   │           │           │           │           │           │    │
│   │ Secure    │           │ Catalyst  │           │ SD-Access │    │
│   │ Client    │           │ SD-WAN    │           │ Fabric    │    │
│   └───────────┘           └───────────┘           └───────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Integration Points

| Integration | Source | Destination | Data Exchanged |
|-------------|--------|-------------|----------------|
| SGT Sync | ISE | Secure Access | Security Group Tags |
| User Identity | ISE | Secure Access | Username, Groups |
| Device Posture | ISE | Secure Access | Compliance Status |
| Threat Intel | XDR | ISE | IOCs, Threat Scores |
| VPN Context | SD-WAN | Secure Access | VRF, Site Info |

---

## 2. Cisco Secure Access Integration

### 2.1 ISE to Secure Access Configuration

**Step 1: Enable pxGrid Cloud on ISE**
```
Administration → pxGrid Services → Settings → pxGrid Cloud
  ☑ Enable pxGrid Cloud
  Primary Node: NJ-ISE-PXG-01.abhavtech.com
```

**Step 2: Configure Secure Access Integration**
```
Cisco Secure Access Dashboard → Settings → Integrations

Add Integration:
  Type: Cisco ISE
  Name: Abhavtech-ISE-Production
  
  Connection:
    ISE Primary: nj-ise-01.abhavtech.com
    ISE Secondary: lon-ise-01.abhavtech.com
    Authentication: pxGrid Cloud
    
  Data Sync:
    ☑ Security Group Tags (SGT)
    ☑ User/Device Sessions
    ☑ Endpoint Attributes
    ☑ Authorization Results
```

### 2.2 SGT Policy Synchronization

```yaml
SGT_Sync_Configuration:
  
  ISE_to_Secure_Access:
    Sync_Interval: Real-time (pxGrid)
    
    SGT_Mapping:
      Employee-Full (10) → Employee-Internet-Access
      Executive (11) → Executive-Full-Access
      Contractor (15) → Contractor-Limited
      Guest (40) → Guest-Internet-Only
      IoT-Sensor (50) → IoT-Restricted
      
  Policy_Enforcement:
    Location: Secure Access Cloud
    Action: Apply web/app policies based on SGT
```

### 2.3 ZTNA Configuration for Private Apps

```
Secure Access Dashboard → Resources → Private Resources

Add Private Resource:
  Name: Abhavtech-SAP-ERP
  Type: Web Application
  
  Connection:
    URL: https://sap.abhavtech.com
    SD-WAN Tunnel: Abhavtech-NJ-Tunnel
    
  Access Policy:
    Allowed SGTs:
      ☑ Employee-Full (10)
      ☑ Executive (11)
      ☑ Finance (13)
    
    Device Requirements:
      ☑ Managed Device Required
      ☑ Posture Compliant
      
    MFA: Required (Duo Integration)
```

---

## 3. SD-WAN Integration

### 3.1 Catalyst SD-WAN to Secure Access

```
┌─────────────────────────────────────────────────────────────────────┐
│           SD-WAN to Secure Access Integration                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Branch Site                    Secure Access                      │
│   ┌───────────────┐             ┌───────────────┐                  │
│   │ Catalyst Edge │             │  SIG PoP      │                  │
│   │ (C8300/C8200) │══IPsec/GRE═▶│  (Regional)   │                  │
│   │               │             │               │                  │
│   │ VRF: CORP     │             │  SWG          │                  │
│   │ VRF: GUEST    │             │  FWaaS        │                  │
│   │ VRF: IOT      │             │  CASB         │                  │
│   └───────────────┘             └───────┬───────┘                  │
│                                         │                           │
│                                         ▼                           │
│                                 ┌───────────────┐                  │
│                                 │   Internet    │                  │
│                                 │   SaaS Apps   │                  │
│                                 │   Cloud       │                  │
│                                 └───────────────┘                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 SD-WAN Manager Configuration

```
! Catalyst SD-WAN Manager → Administration → Settings → Secure Access

Secure Access Integration:
  Organization ID: abhavtech-org
  API Key: ****************************
  
  Tunnel Configuration:
    Primary PoP: US-East (Ashburn)
    Secondary PoP: EU-West (London)
    Tunnel Type: IPsec
    
  Traffic Steering:
    Policy: ABHAVTECH-SIG-POLICY
    Match: All Internet-bound traffic
    Action: Redirect to Secure Access
```

### 3.3 VRF-Aware Tunnel Template

```
! Feature Template: Secure-Access-SIG-Tunnel

vpn 1
 name VN_CORPORATE
 interface sig0
  tunnel-interface
   color sig
   no allow-service all
   no allow-service bgp
   allow-service dhcp
   allow-service dns
   allow-service icmp
   allow-service sshd
   encapsulation ipsec
   
  sig tunnel-set secure-access-set
   sig tunnel sig-tunnel-1
    tracker sig-health-check
!
```

---

## 4. Remote User Access

### 4.1 Secure Client ZTNA Module

```yaml
Secure_Client_Deployment:
  
  Modules:
    - AnyConnect VPN (legacy sites)
    - ZTNA (Secure Access)
    - Umbrella Roaming Security
    - Secure Endpoint (AMP)
    - Posture (ISE)
    
  ZTNA_Configuration:
    Organization: abhavtech.com
    Enrollment: Device Trust Certificate
    
    Access_Method:
      Primary: ZTNA (clientless where possible)
      Fallback: Full tunnel VPN
      
    Split_Tunnel:
      Mode: Dynamic Split Exclude
      Exclude: O365, Teams (direct)
```

### 4.2 Experience Insights (ThousandEyes)

```
Secure Access → Experience Insights

Dashboard Metrics:
┌────────────────────────────────────────────────────────────┐
│ User Experience Summary - Abhavtech                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ Remote Users: 3,456                                        │
│ Average Latency: 45ms                                      │
│ Page Load Time: 1.2s                                       │
│ Application Score: 92/100                                  │
│                                                            │
│ Top Issues:                                                │
│ 1. DNS resolution delay (Mumbai ISP)                       │
│ 2. TLS handshake latency (EU users)                       │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Security Policy Unification

### 5.1 Unified Policy Framework

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Unified Policy Architecture                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────┐                              │
│                    │   Policy Admin  │                              │
│                    │   (Secure Access│                              │
│                    │    Dashboard)   │                              │
│                    └────────┬────────┘                              │
│                             │                                        │
│            ┌────────────────┼────────────────┐                      │
│            ▼                ▼                ▼                      │
│    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│    │  Web Policy  │ │  App Policy  │ │ Data Policy  │              │
│    ├──────────────┤ ├──────────────┤ ├──────────────┤              │
│    │ URL Filter   │ │ ZTNA Rules   │ │ DLP Rules    │              │
│    │ Content Cat  │ │ SaaS Access  │ │ CASB         │              │
│    │ SSL Inspect  │ │ Private Apps │ │ Shadow IT    │              │
│    └──────────────┘ └──────────────┘ └──────────────┘              │
│            │                │                │                      │
│            └────────────────┼────────────────┘                      │
│                             │                                        │
│                             ▼                                        │
│                    ┌─────────────────┐                              │
│                    │ Enforcement     │                              │
│                    │ • Cloud (SSE)   │                              │
│                    │ • Network (SDA) │                              │
│                    │ • Endpoint      │                              │
│                    └─────────────────┘                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 Web Security Policy (SWG)

```yaml
Web_Security_Policy:
  
  Name: Abhavtech-Web-Policy
  
  Rules:
    - Name: Block-Malware
      Category: Malware, Phishing, C2
      Action: Block
      Log: Yes
      
    - Name: Block-Adult-Content
      Category: Adult, Gambling, Violence
      Action: Block
      Log: Yes
      
    - Name: Coaching-Social-Media
      Category: Social Networking
      Action: Warn
      Message: "Social media access is monitored"
      
    - Name: Allow-Business
      Category: Business, Technology
      Action: Allow
      SSL_Inspection: Enabled
```

---

## 6. Context Sharing

### 6.1 ISE to Secure Access Context

```
Data Flow:
ISE → pxGrid → pxGrid Cloud → Secure Access

Shared Context:
├── User Identity
│   ├── Username
│   ├── AD Groups
│   └── Department
├── Device Context
│   ├── MAC Address
│   ├── Device Type
│   ├── Posture Status
│   └── MDM Compliance
├── Network Context
│   ├── SGT Assignment
│   ├── VN/VRF
│   ├── Authentication Method
│   └── Location
└── Session Context
    ├── Session ID
    ├── Start Time
    └── NAS IP
```

### 6.2 Threat Context Sharing

```
XDR → ISE Integration:

Threat Detection:
  Source: Cisco XDR
  Trigger: Threat score > 80
  
Response Flow:
  1. XDR detects threat on endpoint
  2. Context shared via pxGrid to ISE
  3. ISE issues CoA to quarantine
  4. Secure Access blocks user sessions
  5. SOC alert generated

Configuration:
  Administration → Threat Centric NAC → Adapters → Cisco XDR
  
  Adapter Settings:
    Name: Abhavtech-XDR
    Host: api.xdr.cisco.com
    API Key: ************************
    
  Response Actions:
    Quarantine SGT: 999 (Quarantine)
    VLAN: 999 (Quarantine VLAN)
```

---

## 7. Deployment Architecture

### 7.1 Regional Deployment

| Region | Secure Access PoP | SD-WAN Hub | ISE PSN |
|--------|-------------------|------------|---------|
| APAC | Singapore, Mumbai | Mumbai | MUM-ISE-PSN-01/02 |
| EMEA | London, Frankfurt | London | LON-ISE-PSN-01/02 |
| AMER | Ashburn, Dallas | New Jersey | NJ-ISE-PSN-01/02 |

### 7.2 Traffic Flow

```
User Request Flow:

1. Campus User (SD-Access)
   User → Edge Node → Border → Internet (via Secure Access)
   
2. Branch User (SD-WAN)
   User → SD-WAN Edge → SIG Tunnel → Secure Access → Internet
   
3. Remote User (ZTNA)
   User → Secure Client → ZTNA → Secure Access → Private App/Internet
```

---

## 8. Monitoring and Visibility

### 8.1 Unified Dashboard

```
Secure Access Dashboard → Overview

Abhavtech SASE Summary:
┌──────────────────────────────────────────────────────────────┐
│ Security Events (24h)           │ User Activity              │
├─────────────────────────────────┼────────────────────────────┤
│ Threats Blocked: 1,234          │ Active Users: 8,456        │
│ Policy Violations: 456          │ Apps Accessed: 234         │
│ Data Policy: 89                 │ Data Transferred: 2.3 TB   │
│ DNS Blocks: 12,345              │ Peak Concurrent: 5,678     │
└─────────────────────────────────┴────────────────────────────┘

│ Top Blocked Destinations        │ Top Applications           │
├─────────────────────────────────┼────────────────────────────┤
│ 1. malware-domain.com (blocked) │ 1. Microsoft 365 (45%)     │
│ 2. phishing-site.net (blocked)  │ 2. Salesforce (15%)        │
│ 3. gambling.com (policy)        │ 3. SAP (12%)               │
└─────────────────────────────────┴────────────────────────────┘
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
