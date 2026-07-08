# 4.3 DNA Center Cluster Installation

## 4.3.1 Cluster Architecture

### 3-Node HA Cluster Topology

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         DNAC 3-NODE HA CLUSTER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                         NEW JERSEY DATA CENTER                                   │
│   ┌────────────────────────────────────────────────────────────────────────┐    │
│   │                                                                        │    │
│   │    ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │    │
│   │    │   DNAC-NJ-01   │  │   DNAC-NJ-02   │  │   DNAC-NJ-03   │         │    │
│   │    │   (Primary)    │  │  (Secondary)   │  │  (Tertiary)    │         │    │
│   │    ├────────────────┤  ├────────────────┤  ├────────────────┤         │    │
│   │    │ Enterprise:    │  │ Enterprise:    │  │ Enterprise:    │         │    │
│   │    │ 10.252.10.11   │  │ 10.252.10.12   │  │ 10.252.10.13   │         │    │
│   │    │                │  │                │  │                │         │    │
│   │    │ Cluster:       │  │ Cluster:       │  │ Cluster:       │         │    │
│   │    │ 10.252.11.11   │  │ 10.252.11.12   │  │ 10.252.11.13   │         │    │
│   │    │                │  │                │  │                │         │    │
│   │    │ Management:    │  │ Management:    │  │ Management:    │         │    │
│   │    │ 10.252.12.11   │  │ 10.252.12.12   │  │ 10.252.12.13   │         │    │
│   │    └───────┬────────┘  └───────┬────────┘  └───────┬────────┘         │    │
│   │            │                   │                   │                  │    │
│   │            └───────────────────┼───────────────────┘                  │    │
│   │                                │                                      │    │
│   │                       ┌────────┴────────┐                             │    │
│   │                       │   VIP Address   │                             │    │
│   │                       │  10.252.10.10   │                             │    │
│   │                       │ dnac.corp.local │                             │    │
│   │                       └─────────────────┘                             │    │
│   │                                                                        │    │
│   └────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│   Hardware: Cisco DNA Center Appliance (DN2-HW-APL-XL)                          │
│   • 56 cores, 512GB RAM, 30TB storage per node                                  │
│   • 4x 10GbE ports per node                                                     │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Network Interface Mapping

| Port | Network | Purpose | IP Range |
|------|---------|---------|----------|
| enp9s0 | Enterprise | Management & API access | 10.252.10.0/24 |
| enp10s0 | Cluster | Inter-node communication | 10.252.11.0/24 |
| enp11s0 | Management | OOB/Inband management | 10.252.12.0/24 |
| enp12s0 | Reserved | Future use | N/A |
| CIMC | OOB | Console access | 10.252.100.0/24 |

---

## 4.3.2 Pre-Installation Requirements

### DNS Records

```bash
# Forward DNS Records
dnac.corp.local            A    10.252.10.10  # VIP
dnac-nj-01.corp.local      A    10.252.10.11
dnac-nj-02.corp.local      A    10.252.10.12
dnac-nj-03.corp.local      A    10.252.10.13

# Reverse DNS Records (Required)
10.10.252.10.in-addr.arpa  PTR  dnac.corp.local
11.10.252.10.in-addr.arpa  PTR  dnac-nj-01.corp.local
12.10.252.10.in-addr.arpa  PTR  dnac-nj-02.corp.local
13.10.252.10.in-addr.arpa  PTR  dnac-nj-03.corp.local
```

### Network Requirements

```yaml
Network_Prerequisites:
  
  Enterprise_Network:
    VLAN: 10
    Subnet: 10.252.10.0/24
    Gateway: 10.252.10.1
    Purpose: API, GUI, Device management
    MTU: 1500
    
  Cluster_Network:
    VLAN: 11
    Subnet: 10.252.11.0/24
    Gateway: None (Layer 2)
    Purpose: Inter-node sync
    MTU: 9000 (Jumbo frames required)
    
  Management_Network:
    VLAN: 12
    Subnet: 10.252.12.0/24
    Gateway: 10.252.12.1
    Purpose: SSH access, backup
    MTU: 1500
    
  CIMC_Network:
    VLAN: 100
    Subnet: 10.252.100.0/24
    Gateway: 10.252.100.1
    Purpose: Out-of-band console
```

### Firewall Ports

| Source | Destination | Port | Purpose |
|--------|-------------|------|---------|
| Admin Workstation | DNAC VIP | 443 | Web UI |
| DNAC | DNS | 53 | Name resolution |
| DNAC | NTP | 123 | Time sync |
| DNAC | ISE | 443, 8910, 9060 | pxGrid/ERS |
| DNAC | Network Devices | 22, 443, 161 | SSH/HTTPS/SNMP |
| Network Devices | DNAC | 514 | Syslog |
| DNAC Node | DNAC Node | 2379-2380 | etcd cluster |
| DNAC Node | DNAC Node | 6443 | Kubernetes API |
| DNAC Node | DNAC Node | 10250-10255 | Kubelet |

---

## 4.3.3 CIMC Configuration

### CIMC Setup (Per Node)

```yaml
CIMC_Configuration:
  
  DNAC-NJ-01:
    CIMC_IP: 10.252.100.11
    Netmask: 255.255.255.0
    Gateway: 10.252.100.1
    Username: admin
    Password: <secure_password>
    
  DNAC-NJ-02:
    CIMC_IP: 10.252.100.12
    # Same settings
    
  DNAC-NJ-03:
    CIMC_IP: 10.252.100.13
    # Same settings

# Access CIMC
# https://10.252.100.11 (admin / <password>)
```

---

## 4.3.4 First Node Installation (DNAC-NJ-01)

### Maglev Installer Boot

```bash
# Step 1: Mount ISO via CIMC Virtual Media
# Navigate: Compute > Remote Management > Virtual Media
# Map: Cisco_DNA_Center_2.3.x.x.iso

# Step 2: Boot from Virtual CD
# Navigate: Compute > Power > Power Cycle
# Press F6 during POST to select boot device
# Select: Cisco vKVM-Mapped vDVD

# Step 3: Maglev Installer Welcome Screen
# Select: [1] Install Cisco DNA Center
```

### Maglev Configuration Wizard

```bash
#=====================================================
# MAGLEV CONFIGURATION WIZARD - DNAC-NJ-01
#=====================================================

# Network Configuration
Configure static IP? [Y/n]: Y

# Enterprise Interface (enp9s0)
Enterprise Interface IP: 10.252.10.11
Enterprise Interface Netmask: 255.255.255.0
Enterprise Interface Gateway: 10.252.10.1

# Cluster Interface (enp10s0)  
Cluster Interface IP: 10.252.11.11
Cluster Interface Netmask: 255.255.255.0

# Management Interface (enp11s0)
Management Interface IP: 10.252.12.11
Management Interface Netmask: 255.255.255.0
Management Interface Gateway: 10.252.12.1

# DNS Configuration
Primary DNS Server: 10.252.1.20
Secondary DNS Server: 10.252.1.21
DNS Search Domain: corp.local

# NTP Configuration
Primary NTP Server: 10.252.1.10
Secondary NTP Server: 10.252.1.11

# Hostname
Hostname: dnac-nj-01

# Admin Credentials
Admin Username: admin
Admin Password: <secure_password>
Confirm Password: <secure_password>

# Proxy Configuration
HTTP Proxy: (leave blank if none)
HTTPS Proxy: (leave blank if none)
No Proxy: 10.0.0.0/8,172.16.0.0/12,192.168.0.0/16

# Virtual IP (for cluster)
Virtual IP Address: 10.252.10.10
Virtual IP Hostname: dnac.corp.local

# Confirm Configuration
Review settings and confirm: Y

# Installation begins (~90 minutes)
```

### Post-Installation Validation

```bash
# SSH to DNAC
ssh maglev@10.252.10.11

# Check cluster status
maglev cluster status

# Expected output:
# NODE          ROLE      STATUS    SERVICES
# dnac-nj-01    PRIMARY   HEALTHY   47/47

# Check services
maglev service status | grep -v running

# API health check
curl -k -u admin:<password> https://10.252.10.10/dna/system/api/v1/health

# Access Web UI
# https://10.252.10.10 or https://dnac.corp.local
```

---

## 4.3.5 Adding Cluster Nodes

### Add Second Node (DNAC-NJ-02)

```bash
# Step 1: Install DNAC on second node (same ISO boot process)
# Use hostname: dnac-nj-02
# Enterprise IP: 10.252.10.12
# Cluster IP: 10.252.11.12
# Management IP: 10.252.12.12

# Step 2: Join to cluster from first node GUI
# Navigate: System > System 360 > Cluster

Add_Node_Settings:
  Node_IP: 10.252.10.12
  Cluster_IP: 10.252.11.12
  Username: admin
  Password: <password>

# Step 3: Wait for node to join (~45 minutes)
# Monitor progress in System 360

# Step 4: Verify cluster status
maglev cluster status
# Expected: 2 nodes showing HEALTHY
```

### Add Third Node (DNAC-NJ-03)

```bash
# Same process as second node
# Enterprise IP: 10.252.10.13
# Cluster IP: 10.252.11.13
# Management IP: 10.252.12.13

# Final verification
maglev cluster status

# Expected output:
# NODE          ROLE       STATUS    SERVICES
# dnac-nj-01    PRIMARY    HEALTHY   47/47
# dnac-nj-02    SECONDARY  HEALTHY   47/47
# dnac-nj-03    TERTIARY   HEALTHY   47/47
```

---

## 4.3.6 Certificate Configuration

### Generate CSR for Enterprise Certificate

```yaml
# System > Settings > Trust & Privacy > System Certificates

Certificate_Request:
  Common_Name: dnac.corp.local
  Organization: Corp
  Organizational_Unit: IT
  Locality: Newark
  State: New Jersey
  Country: US
  Key_Size: 2048
  
  Subject_Alternative_Names:
    DNS:
      - dnac.corp.local
      - dnac-nj-01.corp.local
      - dnac-nj-02.corp.local
      - dnac-nj-03.corp.local
    IP:
      - 10.252.10.10
      - 10.252.10.11
      - 10.252.10.12
      - 10.252.10.13
```

### Import Signed Certificate

```yaml
# After CA signs the CSR:

Import_Certificate:
  Certificate_File: dnac-signed.cer
  Certificate_Chain: root-ca.cer, intermediate-ca.cer
  Private_Key: (already on system from CSR)

# System will restart web services automatically
```

### Import Trusted CA Certificates

```yaml
# System > Settings > Trust & Privacy > Trustpool

Import_Trusted_CAs:
  - Corp-Root-CA.cer
  - Corp-Intermediate-CA.cer
  
Purpose:
  - Trust ISE certificates
  - Trust device certificates
  - Trust SD-WAN controller certificates
```

---

## 4.3.7 ISE Integration

### Configure ISE as AAA Server

```yaml
# System > Settings > Authentication and Policy Servers

ISE_Server_Configuration:
  
  Primary_Server:
    Server_Type: ISE
    Server_IP: 10.252.30.10
    Shared_Secret: <radius_secret>
    Authentication_Port: 1812
    Accounting_Port: 1813
    Retries: 3
    Timeout: 5
    
  Secondary_Server:
    Server_IP: 10.252.30.20
    Shared_Secret: <radius_secret>
    # Same settings
    
  pxGrid_Integration:
    pxGrid_Node: 10.252.30.10
    Username: dnac-pxgrid
    Password: <pxgrid_password>
    
  ERS_Integration:
    Enable_ERS: Yes
    ERS_Username: ers-admin
    ERS_Password: <ers_password>
```

### Verify ISE Integration

```yaml
# System > Settings > Authentication and Policy Servers

Verification_Steps:
  1. Click "Test" next to ISE server
  2. Verify RADIUS test: SUCCESS
  3. Verify pxGrid connection: CONNECTED
  4. Verify ERS API: OPERATIONAL
  
# On ISE: Administration > pxGrid Services > Web Clients
# Verify DNAC appears as connected client
```

---

## 4.3.8 Network Settings Configuration

### Global Network Settings

```yaml
# Design > Network Settings > Global

Network_Services:
  
  DHCP_Servers:
    Primary: 10.252.1.40
    Secondary: 10.252.1.41
    
  DNS_Servers:
    Primary: 10.252.1.20
    Secondary: 10.252.1.21
    Domain_Name: corp.local
    
  NTP_Servers:
    Primary: 10.252.1.10
    Secondary: 10.252.1.11
    
  Syslog_Servers:
    Primary: 10.252.1.30
    Secondary: 10.252.1.31
    
  SNMP_Servers:
    Primary: 10.252.10.10
    Version: v3
    Username: dnac-snmp
    Auth: SHA
    Privacy: AES128
    
  AAA_Servers:
    Network_Authentication: ISE (10.252.30.10)
    Client_Authentication: ISE (10.252.30.10)
```

---

## 4.3.9 Credential Management

### Device Credentials

```yaml
# Design > Network Settings > Device Credentials

Global_Credentials:
  
  CLI_Credentials:
    - Name: NetAdmin-CLI
      Username: netadmin
      Password: <encrypted>
      Enable_Password: <encrypted>
      
  SNMPv3_Credentials:
    - Name: DNAC-SNMPv3
      Username: dnac-snmp
      Auth_Type: SHA
      Auth_Password: <encrypted>
      Privacy_Type: AES128
      Privacy_Password: <encrypted>
      
  HTTPS_Credentials:
    - Name: NetAdmin-HTTPS
      Username: netadmin
      Password: <encrypted>
      Port: 443
```

---

## 4.3.10 Backup and Restore

### Configure Backup Settings

```yaml
# System > Settings > Backup & Restore > Schedule

Backup_Configuration:
  
  Scheduled_Backup:
    Enable: Yes
    Frequency: Daily
    Time: 02:00 UTC
    Retention: 7 days
    
  Backup_Server:
    Protocol: SFTP
    Server: 10.252.100.200
    Path: /backups/dnac
    Username: backup-user
    Password: <password>
    
  Backup_Scope:
    - Configuration
    - Assurance Data (optional)
```

### CLI Backup Commands

```bash
# SSH to DNAC
ssh maglev@10.252.10.10

# Create manual backup
maglev backup create --name "DNAC-Backup-2025-01-15"

# List backups
maglev backup list

# Export backup to remote server
maglev backup export --name "DNAC-Backup-2025-01-15" \
  --protocol sftp \
  --server 10.252.100.200 \
  --path /backups/dnac \
  --username backup-user

# Restore (if needed)
maglev backup restore --name "DNAC-Backup-2025-01-15"
```

---

## 4.3.11 Package Management

### Check and Update Packages

```bash
# SSH to DNAC
ssh maglev@10.252.10.10

# Check current packages
maglev package status

# List available updates
maglev package update --list

# Apply updates (during maintenance window)
maglev package update --apply

# Check system version
maglev version
```

---

## 4.3.12 Assurance Configuration

### Enable Assurance Features

```yaml
# Assurance > Settings

Assurance_Configuration:
  
  Data_Collection:
    Enable_Telemetry: Yes
    Collection_Interval: 5 minutes
    Retention: 30 days
    
  AI_Analytics:
    Enable_AI_Network_Analytics: Yes
    Enable_AI_Endpoint_Analytics: Yes
    Enable_Rogue_and_aWIPS: Yes
    
  Client_Health:
    Enable_Client_Health: Yes
    SNMP_Collection: Yes
    
  Network_Health:
    Enable_Network_Health: Yes
    Enable_Application_Health: Yes
```

---

## 4.3.13 Maglev CLI Reference

### Common Maglev Commands

```bash
# Cluster Management
maglev cluster status              # Show cluster health
maglev cluster node-status         # Show per-node status
maglev cluster failover           # Initiate failover

# Service Management
maglev service status              # List all services
maglev service restart <service>   # Restart specific service
maglev service logs <service>      # View service logs

# Backup Management
maglev backup create               # Create backup
maglev backup list                 # List backups
maglev backup restore              # Restore backup
maglev backup export               # Export to remote

# Package Management
maglev package status              # Current packages
maglev package update              # Update packages

# System Information
maglev version                     # Show version
maglev inventory                   # Show hardware info

# Troubleshooting
maglev support bundle              # Generate support bundle
maglev logs                        # View system logs
```

---

## 4.3.14 Health Validation

### System Health Checks

```bash
# Cluster status
maglev cluster status

# Service health
maglev service status | grep -v running

# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top -bn1 | head -5

# Network connectivity
ping -c 4 10.252.1.20   # DNS
ping -c 4 10.252.30.10  # ISE

# API health
curl -k https://10.252.10.10/dna/system/api/v1/health
```

### GUI Health Dashboard

```yaml
# System > System 360

Monitor:
  - Cluster Health: Green
  - All Nodes: Healthy
  - Services: 47/47 Running
  - Disk Usage: < 80%
  - Memory Usage: < 80%
  - CPU Usage: < 70%
```

---

## 4.3.15 Installation Checklist

| Phase | Task | Status | Date |
|-------|------|--------|------|
| **Pre-Installation** |
| | DNS records created | ☐ | |
| | Network VLANs configured | ☐ | |
| | Firewall rules in place | ☐ | |
| | Hardware racked and cabled | ☐ | |
| | CIMC configured | ☐ | |
| **First Node** |
| | ISO mounted and booted | ☐ | |
| | Maglev wizard completed | ☐ | |
| | Installation successful | ☐ | |
| | Web UI accessible | ☐ | |
| **Cluster Formation** |
| | Second node added | ☐ | |
| | Third node added | ☐ | |
| | Cluster healthy (3/3) | ☐ | |
| | VIP accessible | ☐ | |
| **Certificates** |
| | CSR generated | ☐ | |
| | Certificate signed by CA | ☐ | |
| | Certificate imported | ☐ | |
| | Trusted CAs imported | ☐ | |
| **Integration** |
| | ISE RADIUS configured | ☐ | |
| | ISE pxGrid connected | ☐ | |
| | Credentials configured | ☐ | |
| | Network settings applied | ☐ | |
| **Operations** |
| | Backup configured | ☐ | |
| | Assurance enabled | ☐ | |
| | Monitoring verified | ☐ | |

---
