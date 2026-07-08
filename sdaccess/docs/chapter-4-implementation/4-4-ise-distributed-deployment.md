# 4.4 ISE Distributed Deployment

## 4.4.1 ISE Deployment Architecture

### Distributed Deployment Topology

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    ISE DISTRIBUTED DEPLOYMENT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                        ┌─────────────────────────────────┐                       │
│                        │      ADMINISTRATION TIER        │                       │
│                        ├─────────────────────────────────┤                       │
│     NEW JERSEY DC      │         LONDON DC (DR)          │                       │
│  ┌─────────────────┐   │    ┌─────────────────┐          │                       │
│  │ ISE-PAN-NJ      │◄──┼───►│ ISE-PAN-LON     │          │                       │
│  │ 10.252.30.10    │ Sync   │ 10.252.30.20    │          │                       │
│  │ • Primary PAN   │   │    │ • Secondary PAN │          │                       │
│  │ • Primary MnT   │   │    │ • Secondary MnT │          │                       │
│  │ • pxGrid (Pri)  │   │    │ • pxGrid (Sec)  │          │                       │
│  └─────────────────┘   │    └─────────────────┘          │                       │
│                        └─────────────────────────────────┘                       │
│                                                                                  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                      POLICY SERVICE TIER (12 PSNs)                        │  │
│  │   APAC                    EMEA                   AMERICAS                 │  │
│  │  ┌───────────┐          ┌───────────┐          ┌───────────┐              │  │
│  │  │ Mumbai    │          │ London    │          │ New Jersey│              │  │
│  │  │ PSN-MUM-1 │          │ PSN-LON-1 │          │ PSN-NJ-1  │              │  │
│  │  │ PSN-MUM-2 │          │ PSN-LON-2 │          │ PSN-NJ-2  │              │  │
│  │  ├───────────┤          ├───────────┤          ├───────────┤              │  │
│  │  │ Chennai   │          │ Frankfurt │          │ Dallas    │              │  │
│  │  │ PSN-CHN-1 │          │ PSN-FRA-1 │          │ PSN-DAL-1 │              │  │
│  │  │ PSN-CHN-2 │          │ PSN-FRA-2 │          │ PSN-DAL-2 │              │  │
│  │  └───────────┘          └───────────┘          └───────────┘              │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Node Specifications

| Node | Role | Hardware | IP Address | Location | Max Endpoints |
|------|------|----------|------------|----------|---------------|
| ISE-PAN-NJ | Pri PAN/MnT/pxGrid | SNS-3655-K9 | 10.252.30.10 | New Jersey | N/A (Admin) |
| ISE-PAN-LON | Sec PAN/MnT/pxGrid | SNS-3655-K9 | 10.252.30.20 | London | N/A (Admin) |
| ISE-PSN-MUM-1 | PSN | SNS-3615-K9 | 10.252.31.11 | Mumbai | 15,000 |
| ISE-PSN-MUM-2 | PSN | SNS-3615-K9 | 10.252.31.12 | Mumbai | 15,000 |
| ISE-PSN-CHN-1 | PSN | SNS-3615-K9 | 10.252.31.21 | Chennai | 10,000 |
| ISE-PSN-CHN-2 | PSN | SNS-3615-K9 | 10.252.31.22 | Chennai | 10,000 |
| ISE-PSN-LON-1 | PSN | SNS-3615-K9 | 10.252.31.31 | London | 12,000 |
| ISE-PSN-LON-2 | PSN | SNS-3615-K9 | 10.252.31.32 | London | 12,000 |
| ISE-PSN-FRA-1 | PSN | SNS-3615-K9 | 10.252.31.41 | Frankfurt | 8,000 |
| ISE-PSN-FRA-2 | PSN | SNS-3615-K9 | 10.252.31.42 | Frankfurt | 8,000 |
| ISE-PSN-NJ-1 | PSN | SNS-3615-K9 | 10.252.31.51 | New Jersey | 15,000 |
| ISE-PSN-NJ-2 | PSN | SNS-3615-K9 | 10.252.31.52 | New Jersey | 15,000 |
| ISE-PSN-DAL-1 | PSN | SNS-3615-K9 | 10.252.31.61 | Dallas | 10,000 |
| ISE-PSN-DAL-2 | PSN | SNS-3615-K9 | 10.252.31.62 | Dallas | 10,000 |

---

## 4.4.2 Pre-Installation Requirements

### DNS Records

```bash
# Forward DNS Records (A)
ise-pan-nj.corp.local          A    10.252.30.10
ise-pan-lon.corp.local         A    10.252.30.20
ise-psn-mum-1.corp.local       A    10.252.31.11
ise-psn-mum-2.corp.local       A    10.252.31.12
ise-psn-chn-1.corp.local       A    10.252.31.21
ise-psn-chn-2.corp.local       A    10.252.31.22
ise-psn-lon-1.corp.local       A    10.252.31.31
ise-psn-lon-2.corp.local       A    10.252.31.32
ise-psn-fra-1.corp.local       A    10.252.31.41
ise-psn-fra-2.corp.local       A    10.252.31.42
ise-psn-nj-1.corp.local        A    10.252.31.51
ise-psn-nj-2.corp.local        A    10.252.31.52
ise-psn-dal-1.corp.local       A    10.252.31.61
ise-psn-dal-2.corp.local       A    10.252.31.62

# Reverse DNS (PTR) - Required
10.30.252.10.in-addr.arpa      PTR  ise-pan-nj.corp.local
# ... repeat for all nodes
```

### Required Firewall Ports

| Source | Destination | Port | Protocol | Purpose |
|--------|-------------|------|----------|---------|
| PAN | PAN | 443, 1099, 8910 | TCP | Sync |
| PAN | PSN | 443, 8910 | TCP | Replication |
| NAD | PSN | 1812, 1813 | UDP | RADIUS |
| NAD | PSN | 1700 | UDP | CoA |
| PSN | AD | 389, 636, 88 | TCP/UDP | LDAP/Kerberos |
| PSN | AD | 3268, 3269 | TCP | Global Catalog |
| Client | PSN | 8443 | TCP | Portals |
| DNAC | PAN | 443, 8910, 9060 | TCP | pxGrid/ERS |

---

## 4.4.3 Primary PAN Installation

### ISE Setup Wizard

```bash
# Boot from ISE 3.2 ISO via CIMC

localhost login: setup

# Network Configuration
Enter hostname: ise-pan-nj
Enter IP address: 10.252.30.10
Enter netmask: 255.255.255.0
Enter default gateway: 10.252.30.1
Enter DNS domain: corp.local
Enter primary DNS: 10.252.1.20
Enter secondary DNS: 10.252.1.21
Enter primary NTP: 10.252.1.10
Enter secondary NTP: 10.252.1.11
Enter timezone: UTC

# Admin Credentials
Enter admin username: admin
Enter admin password: <secure_password>

# Confirm and install (~45 minutes)
```

### Post-Installation Verification

```bash
# SSH to ISE
ssh admin@10.252.30.10

# Check application status
show application status ise

# Expected output - all services running:
# Database Listener                      running
# Database Server                        running
# Application Server                     running
# Profiler Database                      running
# AD Connector                           running
# M&T Session Database                   running
# M&T Log Collector                      running
# pxGrid Infrastructure Service          running
# pxGrid Publisher Subscriber Service    running
# pxGrid Controller                      running

# Check version
show version
```

---

## 4.4.4 Certificate Configuration

### System Certificate Generation

```yaml
# Administration > System > Certificates > System Certificates > Generate CSR

Admin_Certificate:
  Common_Name: ise-pan-nj.corp.local
  Organization: Corp
  Organizational_Unit: IT Security
  City: Newark
  State: New Jersey
  Country: US
  Key_Length: 2048
  SAN_DNS: 
    - ise-pan-nj.corp.local
    - ise.corp.local
  SAN_IP: 10.252.30.10
  Usage:
    - Admin
    - Portal
    - pxGrid

EAP_Certificate:
  Common_Name: ise-pan-nj.corp.local
  Key_Length: 2048
  SAN_DNS: ise-pan-nj.corp.local
  Usage:
    - EAP Authentication
```

### Import Enterprise Root CA

```yaml
# Administration > System > Certificates > Trusted Certificates > Import

Root_CA_Import:
  Certificate_File: corp-root-ca.cer
  Friendly_Name: Corp-Enterprise-Root-CA
  Trust_For:
    - Authentication within ISE
    - Client authentication and Syslog
    - Authentication of Cisco Services
```

### Certificate Signing Process

```bash
# Step 1: Export CSR from ISE GUI
# Administration > System > Certificates > Certificate Signing Requests > Export

# Step 2: Submit to Enterprise CA (Windows)
certreq -submit -attrib "CertificateTemplate:WebServer" ise-admin.csr ise-admin.cer

# Step 3: Import signed certificate back to ISE
# Administration > System > Certificates > Certificate Signing Requests > Bind Certificate
```

---

## 4.4.5 Active Directory Integration

### Join Point Configuration

```yaml
# Administration > Identity Management > External Identity Sources > Active Directory

AD_Configuration:
  Join_Point_Name: CORP-AD
  Domain: corp.local
  
  Domain_Controllers:
    Primary: dc01.corp.local (10.252.1.50)
    Secondary: dc02.corp.local (10.252.1.51)
    
  Service_Account:
    Username: svc-ise-ad@corp.local
    Password: <password>
    
  Advanced_Settings:
    Enable_Machine_Authentication: Yes
    Enable_Machine_Access_Restriction: Yes
    Aging_Time: 5 days
```

### AD Groups to Import

```yaml
# Administration > Identity Management > External Identity Sources > AD > Groups

User_Groups:
  - CN=Domain Users,CN=Users,DC=corp,DC=local
  - CN=Domain Admins,CN=Users,DC=corp,DC=local
  - CN=Executives,OU=Security Groups,DC=corp,DC=local
  - CN=HR-Staff,OU=Security Groups,DC=corp,DC=local
  - CN=Finance-Staff,OU=Security Groups,DC=corp,DC=local
  - CN=IT-Admins,OU=Security Groups,DC=corp,DC=local
  - CN=Contractors,OU=Security Groups,DC=corp,DC=local

Computer_Groups:
  - CN=Domain Computers,CN=Computers,DC=corp,DC=local
  - CN=Workstations,OU=Computer Groups,DC=corp,DC=local
```

### Test AD Connectivity

```bash
# CLI test
test aaa group CORP-AD testuser@corp.local <password> legacy

# Expected: Authentication Successful
```

---

## 4.4.6 Secondary Node Registration

### Register Secondary PAN

```yaml
# Administration > System > Deployment > Register

Secondary_PAN:
  Node_FQDN: ise-pan-lon.corp.local
  Username: admin
  Password: <password>
  
  Roles:
    - Administration: Secondary
    - Monitoring: Secondary
    - pxGrid: Yes
```

### Register PSN Nodes

```yaml
# Administration > System > Deployment > Register

PSN_Registration:
  Node_FQDN: ise-psn-mum-1.corp.local
  Username: admin
  Password: <password>
  
  Roles:
    - Policy Service: Yes
    
  Services:
    - Session Services: Yes
    - Profiler Services: Yes
    - SXP Service: Yes
    
# Repeat for all 12 PSN nodes
```

### Node Group Configuration

```yaml
# Administration > System > Deployment > Node Groups

Node_Groups:
  APAC-Mumbai:
    Members: [ise-psn-mum-1, ise-psn-mum-2]
    CoA_Failover: Enabled
    
  APAC-Chennai:
    Members: [ise-psn-chn-1, ise-psn-chn-2]
    CoA_Failover: Enabled
    
  EMEA-London:
    Members: [ise-psn-lon-1, ise-psn-lon-2]
    CoA_Failover: Enabled
    
  EMEA-Frankfurt:
    Members: [ise-psn-fra-1, ise-psn-fra-2]
    CoA_Failover: Enabled
    
  AMER-NewJersey:
    Members: [ise-psn-nj-1, ise-psn-nj-2]
    CoA_Failover: Enabled
    
  AMER-Dallas:
    Members: [ise-psn-dal-1, ise-psn-dal-2]
    CoA_Failover: Enabled
```

---

## 4.4.7 Network Device Configuration

### Add Fabric Edge Nodes

```yaml
# Administration > Network Resources > Network Devices > Add

Fabric_Edge_Device:
  Name: MUM-ED-01
  IP_Address: 10.10.0.11
  Description: Mumbai Edge Node Floor 1
  
  Device_Groups:
    Device_Type: SD-Access_Fabric#Edge_Nodes
    Location: APAC#India#Mumbai
    
  RADIUS:
    Shared_Secret: <strong_secret>
    CoA_Port: 1700
    
  TrustSec:
    Enable: Yes
    Device_ID: MUM-ED-01
    PAC_Key: <pac_key>
```

### Bulk Import CSV Format

```csv
Name,IP Address,Description,Device Type,Location,RADIUS Shared Secret,Enable TrustSec
MUM-ED-01,10.10.0.11,Mumbai Edge Floor 1,SD-Access_Fabric#Edge_Nodes,APAC#India#Mumbai,RadSecret123,Yes
MUM-ED-02,10.10.0.12,Mumbai Edge Floor 2,SD-Access_Fabric#Edge_Nodes,APAC#India#Mumbai,RadSecret123,Yes
```

---

## 4.4.8 DNAC-ISE pxGrid Integration

### Enable pxGrid on ISE

```yaml
# Administration > pxGrid Services > Settings

pxGrid_Settings:
  Enable_pxGrid: Yes
  Allow_Password_Based_Accounts: Yes
  Auto_Approve_Certificates: No
```

### Configure DNAC Integration

```yaml
# On DNAC: System > Settings > Authentication and Policy Servers

ISE_Server:
  Type: ISE
  Primary_IP: 10.252.30.10
  Secondary_IP: 10.252.30.20
  Shared_Secret: <radius_secret>
  
  pxGrid:
    Username: dnac-pxgrid
    Password: <pxgrid_password>
    
  ERS_API:
    Enable: Yes
    Username: ers-admin
    Password: <ers_password>
```

### Verify Integration

```bash
# On ISE: Administration > pxGrid Services > Web Clients
# DNAC should show as "Connected"

# On DNAC: System > Settings > pxGrid Settings
# Status: Connected
```

---

## 4.4.9 Profiling Configuration

### Enable Profiling Probes

```yaml
# Administration > System > Deployment > [PSN Node] > Profiling

Enabled_Probes:
  - DHCP: Yes
  - RADIUS: Yes (automatic)
  - DNS: Yes
  - SNMP_Query: Yes
  - SNMP_Trap: Yes
  - CDP: Yes
  - LLDP: Yes
  - HTTP: Yes
  - pxGrid: Yes
  - Network_Scan_NMAP: Yes
  - Active_Directory: Yes

CoA_Settings:
  CoA_Type: Reauth
  # Reauthenticate when profile changes
```

### Feed Service

```yaml
# Administration > Feed Service > Profiler

Feed_Service:
  Enable_OTA_Updates: Yes
  Update_Frequency: Daily
  Notification_Email: ise-admin@corp.local
```

---

## 4.4.10 Backup Configuration

### Repository Setup

```bash
# CLI Configuration
ise-pan-nj/admin# configure terminal
ise-pan-nj/admin(config)# repository ISE-Backup-Repo
ise-pan-nj/admin(config-Repository)# url sftp://10.252.100.200/backups/ise
ise-pan-nj/admin(config-Repository)# user backup-user password plain <password>
ise-pan-nj/admin(config-Repository)# exit
```

### Scheduled Backup

```yaml
# Administration > System > Backup & Restore

Scheduled_Backup:
  Enable: Yes
  Frequency: Daily
  Time: 02:00 UTC
  Repository: ISE-Backup-Repo
  Encryption_Key: <strong_key>
  Include:
    - Configuration Data
    - Operational Data
```

### Manual Backup Commands

```bash
# Create backup
backup ISE-Config-2025-01-15 repository ISE-Backup-Repo ise-config encryption-key plain <key>

# Verify backup
show backup history

# Restore (if needed)
restore ISE-Config-2025-01-15 repository ISE-Backup-Repo encryption-key plain <key>
```

---

## 4.4.11 Patch Management

### Check and Apply Patches

```bash
# Check current version
show version

# Check installed patches
show patch-status

# Install patch
patch install ise-patchbundle-3.2.0.542-Patch2.SPA.x86_64.tar.gz repository ISE-Backup-Repo

# Rollback (if needed)
patch rollback
```

---

## 4.4.12 Health Validation Commands

```bash
# Application status
show application status ise

# Deployment summary
show ise-deployment-summary

# AD test
test aaa group CORP-AD testuser <password> legacy

# CPU and memory
show cpu
show memory

# Disk space
show disk

# NTP status
show ntp

# Certificate summary
show certificate summary

# Live sessions (GUI)
# Operations > RADIUS > Live Sessions
```

---

## 4.4.13 Deployment Checklist

| Phase | Task | Status | Date |
|-------|------|--------|------|
| **Pre-Installation** |
| | DNS records created | ☐ | |
| | Firewall rules configured | ☐ | |
| | Hardware racked | ☐ | |
| **Primary PAN** |
| | ISE installed | ☐ | |
| | Certificates configured | ☐ | |
| | AD integrated | ☐ | |
| | pxGrid enabled | ☐ | |
| **Secondary PAN** |
| | ISE installed | ☐ | |
| | Registered to primary | ☐ | |
| | Sync verified | ☐ | |
| **PSN Nodes** |
| | All 12 PSNs installed | ☐ | |
| | Node groups configured | ☐ | |
| | Profiling enabled | ☐ | |
| **Integration** |
| | DNAC pxGrid connected | ☐ | |
| | Network devices added | ☐ | |
| **Operations** |
| | Backup configured | ☐ | |
| | Patches applied | ☐ | |
| | Monitoring enabled | ☐ | |

---
