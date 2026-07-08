# 2.12 DNS/DDI Infrastructure with Geo-Location

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. DDI Architecture Overview

### 1.1 Infoblox Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│              Abhavtech.com Global DDI Architecture                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────────┐                          │
│                    │   Infoblox Grid     │                          │
│                    │   Master (HA Pair)  │                          │
│                    │   New Jersey DC     │                          │
│                    └──────────┬──────────┘                          │
│                               │                                      │
│         ┌─────────────────────┼─────────────────────┐               │
│         │                     │                     │               │
│         ▼                     ▼                     ▼               │
│   ┌───────────┐        ┌───────────┐        ┌───────────┐          │
│   │   APAC    │        │   EMEA    │        │   AMER    │          │
│   │   Grid    │        │   Grid    │        │   Grid    │          │
│   │  Members  │        │  Members  │        │  Members  │          │
│   └───────────┘        └───────────┘        └───────────┘          │
│                                                                     │
│   Sites:                Sites:               Sites:                 │
│   • Mumbai (Primary)    • London (Primary)   • New Jersey (Master) │
│   • Chennai             • Frankfurt          • Dallas               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Summary

| Component | Quantity | Model | Role |
|-----------|----------|-------|------|
| Grid Master | 2 (HA) | IB-4030 | Central management |
| APAC Members | 4 | IB-2225 | Regional DNS/DHCP |
| EMEA Members | 4 | IB-2225 | Regional DNS/DHCP |
| AMER Members | 4 | IB-2225 | Regional DNS/DHCP |
| Cloud (BloxOne) | 2 | Virtual | DNS Security |

---

## 2. Geo-Location DNS Design

### 2.1 DNS View Architecture

```yaml
DNS_Views:
  
  Internal_Views:
    - Name: APAC-Internal
      Match_Clients: 10.100.0.0/16, 10.101.0.0/16, 10.102.0.0/16
      Recursion: Yes
      Forwarders: Regional ISP + Umbrella
      
    - Name: EMEA-Internal
      Match_Clients: 10.103.0.0/16, 10.104.0.0/16
      Recursion: Yes
      Forwarders: Regional ISP + Umbrella
      
    - Name: AMER-Internal
      Match_Clients: 10.105.0.0/16, 10.106.0.0/16
      Recursion: Yes
      Forwarders: Regional ISP + Umbrella
      
  External_View:
    - Name: External
      Match_Clients: any
      Recursion: No
      Authority: abhavtech.com
```

### 2.2 Geo-Location Zone Configuration

```
; Zone: abhavtech.com (Internal - Geo-Aware)
; Infoblox Grid Manager → Data Management → DNS → Zones

Zone: abhavtech.com
Type: Forward Mapping
Views: APAC-Internal, EMEA-Internal, AMER-Internal

; APAC View Records
$VIEW APAC-Internal
@                    IN  SOA   ns1-apac.abhavtech.com. admin.abhavtech.com. (
                              2025122601 ; Serial
                              3600       ; Refresh
                              600        ; Retry
                              86400      ; Expire
                              60         ; Minimum TTL
                         )
@                    IN  NS    ns1-apac.abhavtech.com.
@                    IN  NS    ns2-apac.abhavtech.com.

; Geo-Located Services (APAC users get APAC servers)
portal               IN  A     10.100.10.50   ; Mumbai portal
intranet             IN  A     10.100.10.51   ; Mumbai intranet
dc                   IN  A     10.100.10.10   ; Mumbai DC
file                 IN  A     10.100.10.52   ; Mumbai file server

; EMEA View Records  
$VIEW EMEA-Internal
portal               IN  A     10.103.10.50   ; London portal
intranet             IN  A     10.103.10.51   ; London intranet
dc                   IN  A     10.103.10.10   ; London DC
file                 IN  A     10.103.10.52   ; London file server

; AMER View Records
$VIEW AMER-Internal
portal               IN  A     10.105.10.50   ; New Jersey portal
intranet             IN  A     10.105.10.51   ; New Jersey intranet
dc                   IN  A     10.105.10.10   ; New Jersey DC
file                 IN  A     10.105.10.52   ; New Jersey file server
```

### 2.3 Global Traffic Director (GTD) for External

```yaml
GTD_Configuration:
  
  FQDN: www.abhavtech.com
  
  Pools:
    - Name: APAC-Pool
      Members:
        - 203.0.113.10 (Mumbai)
        - 203.0.113.11 (Singapore)
      Health_Monitor: HTTPS
      
    - Name: EMEA-Pool
      Members:
        - 198.51.100.10 (London)
        - 198.51.100.11 (Frankfurt)
      Health_Monitor: HTTPS
      
    - Name: AMER-Pool
      Members:
        - 192.0.2.10 (New Jersey)
        - 192.0.2.11 (Dallas)
      Health_Monitor: HTTPS
      
  Load_Balancing:
    Method: Topology (Geo-based)
    Topology_Rules:
      - Source: Asia/* → APAC-Pool
      - Source: Europe/* → EMEA-Pool
      - Source: North America/* → AMER-Pool
      - Default: AMER-Pool
    
    Fallback: Round-Robin across all pools
```

---

## 3. DHCP Design with Geo-Location

### 3.1 DHCP Scope Distribution

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DHCP Scope Architecture                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Region    │ Site          │ VN           │ DHCP Scope             │
│ ───────────┼───────────────┼──────────────┼──────────────────────── │
│  APAC      │ Mumbai        │ VN_CORPORATE │ 10.100.10.0/24         │
│  APAC      │ Mumbai        │ VN_VOICE     │ 10.100.20.0/24         │
│  APAC      │ Mumbai        │ VN_IOT       │ 10.100.30.0/24         │
│  APAC      │ Mumbai        │ VN_GUEST     │ 10.100.40.0/24         │
│  APAC      │ Chennai       │ VN_CORPORATE │ 10.102.10.0/24         │
│  APAC      │ Chennai       │ VN_VOICE     │ 10.102.20.0/24         │
│ ───────────┼───────────────┼──────────────┼──────────────────────── │
│  EMEA      │ London        │ VN_CORPORATE │ 10.103.10.0/24         │
│  EMEA      │ London        │ VN_VOICE     │ 10.103.20.0/24         │
│  EMEA      │ Frankfurt     │ VN_CORPORATE │ 10.104.10.0/24         │
│ ───────────┼───────────────┼──────────────┼──────────────────────── │
│  AMER      │ New Jersey    │ VN_CORPORATE │ 10.105.10.0/24         │
│  AMER      │ New Jersey    │ VN_VOICE     │ 10.105.20.0/24         │
│  AMER      │ Dallas        │ VN_CORPORATE │ 10.106.10.0/24         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 DHCP Server Assignment per Region

| Region | Primary DHCP | Secondary DHCP | Failover |
|--------|--------------|----------------|----------|
| APAC | 10.250.1.10 (Mumbai IB) | 10.250.2.10 (Chennai IB) | Hot Standby |
| EMEA | 10.250.3.10 (London IB) | 10.250.4.10 (Frankfurt IB) | Hot Standby |
| AMER | 10.250.5.10 (NJ IB) | 10.250.6.10 (Dallas IB) | Hot Standby |

### 3.3 Catalyst Center DHCP Configuration

```
Design → Network Settings → IP Address Pools

IP Pool Configuration:
  Pool Name: CORP-MUMBAI-POOL
  Type: LAN
  
  IP Subnet: 10.100.10.0/24
  Gateway: 10.100.10.1
  
  DHCP Server (Geo-Located):
    Primary: 10.250.1.10 (Infoblox Mumbai)
    Secondary: 10.250.2.10 (Infoblox Chennai)
    
  DNS Servers (Geo-Located):
    Primary: 10.250.1.11 (Infoblox Mumbai DNS)
    Secondary: 10.250.2.11 (Infoblox Chennai DNS)
    
  Domain: abhavtech.com
```

---

## 4. DNS Security Integration

### 4.1 Cisco Umbrella Integration

```yaml
Umbrella_Integration:
  
  Infoblox_Forwarders:
    APAC:
      Primary: 208.67.222.222 (Umbrella)
      Secondary: 208.67.220.220 (Umbrella)
      Fallback: ISP DNS
      
    EMEA:
      Primary: 208.67.222.222 (Umbrella)
      Secondary: 208.67.220.220 (Umbrella)
      Fallback: ISP DNS
      
    AMER:
      Primary: 208.67.222.222 (Umbrella)
      Secondary: 208.67.220.220 (Umbrella)
      Fallback: ISP DNS
      
  Security_Policies:
    - Block malware domains
    - Block phishing
    - Block C2 callbacks
    - Block cryptomining
    - Log all queries
```

### 4.2 DNS Security Logging

```
Infoblox Grid → Reporting → DNS Query Logging

Log Configuration:
  Log Level: All Queries
  Syslog Servers:
    - 10.250.10.50 (Splunk APAC)
    - 10.250.10.51 (Splunk EMEA)
    - 10.250.10.52 (Splunk AMER)
  
  Log Format: Syslog RFC5424
  
  Retention:
    Local: 7 days
    Splunk: 365 days
```

---

## 5. IPAM Integration with Catalyst Center

### 5.1 Infoblox IPAM Integration

```
Catalyst Center → System → Settings → External Services → IPAM/DNS

IPAM Server Configuration:
  Type: Infoblox
  Server: grid-master.abhavtech.com
  Port: 443
  
  Credentials:
    Username: catalyst-center-svc
    Password: ************************
    
  Features:
    ☑ Sync IP Pools
    ☑ Auto-create DHCP Scopes
    ☑ Auto-create DNS Records
    ☑ MAC Address Tracking
    
  Sync Interval: 15 minutes
```

### 5.2 Automated Pool Creation

```yaml
Auto_Pool_Workflow:
  
  Trigger: New fabric site provisioned
  
  Actions:
    1. Catalyst Center requests IP space from Infoblox
    2. Infoblox allocates from regional supernet
    3. DHCP scope auto-created with options
    4. DNS PTR zone auto-created
    5. Pool synced back to Catalyst Center
    
  Example:
    Site: Mumbai-Floor-5
    Request: /24 for VN_CORPORATE
    Allocation: 10.100.50.0/24
    DHCP: Created on Mumbai Infoblox member
    DNS: PTR zone 50.100.10.in-addr.arpa
```

---

## 6. Infoblox Grid Member Details

### 6.1 APAC Region

| Member | IP Address | Role | Services |
|--------|------------|------|----------|
| mum-ib-01.abhavtech.com | 10.250.1.10 | Primary | DNS, DHCP, IPAM |
| mum-ib-02.abhavtech.com | 10.250.1.11 | Secondary | DNS, DHCP |
| che-ib-01.abhavtech.com | 10.250.2.10 | Primary | DNS, DHCP, IPAM |
| che-ib-02.abhavtech.com | 10.250.2.11 | Secondary | DNS, DHCP |

### 6.2 EMEA Region

| Member | IP Address | Role | Services |
|--------|------------|------|----------|
| lon-ib-01.abhavtech.com | 10.250.3.10 | Primary | DNS, DHCP, IPAM |
| lon-ib-02.abhavtech.com | 10.250.3.11 | Secondary | DNS, DHCP |
| fra-ib-01.abhavtech.com | 10.250.4.10 | Primary | DNS, DHCP, IPAM |
| fra-ib-02.abhavtech.com | 10.250.4.11 | Secondary | DNS, DHCP |

### 6.3 AMER Region

| Member | IP Address | Role | Services |
|--------|------------|------|----------|
| nj-ib-01.abhavtech.com | 10.250.5.10 | Grid Master | DNS, DHCP, IPAM |
| nj-ib-02.abhavtech.com | 10.250.5.11 | Grid Master HA | DNS, DHCP |
| dal-ib-01.abhavtech.com | 10.250.6.10 | Primary | DNS, DHCP, IPAM |
| dal-ib-02.abhavtech.com | 10.250.6.11 | Secondary | DNS, DHCP |

---

## 7. SD-Access Integration

### 7.1 Anycast DNS for Fabric

```
! Configure Anycast DNS on Edge Nodes
!
! All edge nodes in a site share same anycast IP for DNS
! Ensures consistent DNS regardless of which edge serves client

interface Loopback100
 description Anycast DNS Relay
 ip address 10.100.0.53 255.255.255.255
 ip helper-address 10.250.1.10
 ip helper-address 10.250.1.11
!

! Advertise anycast into fabric
router lisp
 eid-table default instance-id 0
  database-mapping 10.100.0.53/32 locator-set EDGE-RLOCS
!
```

### 7.2 DHCP Relay Configuration

```
! Fabric Edge DHCP Relay (auto-configured by Catalyst Center)
!
interface Vlan100
 description VN_CORPORATE SVI
 ip address 10.100.10.1 255.255.255.0
 ip helper-address 10.250.1.10
 ip helper-address 10.250.2.10
!
```

---

## 8. DNS/DHCP Options for SD-Access

### 8.1 Standard DHCP Options

| Option | Value | Purpose |
|--------|-------|---------|
| 3 | Default Gateway | SVI IP (anycast) |
| 6 | DNS Servers | Regional Infoblox (geo) |
| 15 | Domain Name | abhavtech.com |
| 43 | Catalyst Center PnP | DNAC IP for device onboarding |
| 66 | TFTP Server | PXE/imaging |
| 150 | Cisco TFTP | IP phones |

### 8.2 Option 43 for PnP

```
; Infoblox DHCP Option 43 for Catalyst Center PnP
; Format: 5A1D;B2;K4;I<DNAC-IP>;J443

Option 43 Configuration:
  Vendor Class: Cisco PnP
  Value: 5A1D;B2;K4;I10.252.10.10;J443
  
Applied to:
  - All INFRA_VN pools
  - New device onboarding VLANs
```

---

## 9. Monitoring and Reporting

### 9.1 Infoblox Reporting Dashboard

```
Grid Manager → Reporting → Dashboard

Key Metrics:
┌──────────────────────────────────────────────────────────────┐
│ DNS Queries (Last 24h)          │ DHCP Leases               │
├─────────────────────────────────┼────────────────────────────┤
│ Total: 12,456,789               │ Active: 15,234             │
│ Blocked (Security): 1,234       │ Available: 45,000          │
│ NXDOMAIN: 234,567               │ Utilization: 25%           │
│ Avg Latency: 2.3ms              │ Expired (24h): 456         │
└─────────────────────────────────┴────────────────────────────┘

│ Top Queried Domains             │ Geo Distribution           │
├─────────────────────────────────┼────────────────────────────┤
│ 1. microsoft.com (2.3M)         │ APAC: 45%                  │
│ 2. abhavtech.com (1.1M)         │ EMEA: 30%                  │
│ 3. google.com (890K)            │ AMER: 25%                  │
└─────────────────────────────────┴────────────────────────────┘
```

### 9.2 Splunk Integration for DNS Analytics

```
Splunk Search: DNS Query Analysis

index=infoblox sourcetype=dns:query
| stats count by query_type, client_subnet
| eval region=case(
    cidrmatch("10.100.0.0/16", client_subnet), "APAC-Mumbai",
    cidrmatch("10.102.0.0/16", client_subnet), "APAC-Chennai",
    cidrmatch("10.103.0.0/16", client_subnet), "EMEA-London",
    cidrmatch("10.105.0.0/16", client_subnet), "AMER-NJ",
    true(), "Unknown"
  )
| chart count over _time by region
```

---

## 10. Disaster Recovery

### 10.1 DNS Failover

```yaml
DNS_Failover:
  
  Scenario_1: Single Member Failure
    Impact: None (HA pair continues)
    Recovery: Auto-failover to secondary
    RTO: 0 seconds
    
  Scenario_2: Site Failure
    Impact: Regional DNS affected
    Recovery: Cross-region failover
    RTO: 30 seconds
    
  Scenario_3: Grid Master Failure
    Impact: Management only
    Recovery: HA Master takes over
    RTO: 60 seconds
    Data Loss: None (real-time replication)
```

### 10.2 Backup Configuration

```
Grid Manager → Grid → Backup

Backup Schedule:
  Type: Full Grid Backup
  Frequency: Daily at 02:00 UTC
  Retention: 30 days
  
  Destinations:
    - SCP: backup.abhavtech.com:/backups/infoblox/
    - Cloud: AWS S3 (encrypted)
    
  Tested Recovery: Monthly
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
