# Chapter 4: Implementation & Deployment

## Quick Navigation

| Section | Description |
|---------|-------------|
| [4.1 Deployment Strategy](#41-deployment-strategy-overview) | Phased approach, timeline, governance |
| [4.2 Pre-Deployment Checklist](#42-pre-deployment-checklist) | Prerequisites validation |
| [4.3 DNA Center Installation](#43-dna-center-cluster-installation) | 3-node cluster deployment |
| [4.4 ISE Deployment](#44-ise-distributed-deployment) | PAN/PSN installation |
| [4.5 Underlay Provisioning](#45-underlay-network-provisioning) | IS-IS, loopbacks, P2P |
| [4.6 Fabric Site Configuration](#46-fabric-site-configuration) | Site creation, VNs, SGTs |
| [4.7 Node Provisioning](#47-fabric-node-provisioning) | Border, CP, Edge nodes |
| [4.8 Wireless Integration](#48-wireless-controller-integration) | WLC fabric enablement |
| [4.8.5 SD-WAN Handoff](#485-sd-wan-handoff-implementation) | Border-to-SD-WAN integration |
| [4.9 Testing & Validation](#49-testing-and-validation) | Test cases, acceptance |
| [4.10 Go-Live Cutover](#410-go-live-cutover-runbook) | Site migration procedures |
| [4.11 Rollback Procedures](#411-rollback-procedures) | Contingency plans |
| [4.12 Post-Implementation](#412-post-implementation-validation) | Stabilization, handover |

---

## 4.1 Deployment Strategy Overview

### 4.1.1 Phased Migration Approach

The migration follows a structured 5-phase approach minimizing business disruption while ensuring systematic validation at each stage.

```
PHASE 1          PHASE 2          PHASE 3          PHASE 4          PHASE 5
Foundation       Pilot Site       Hub Sites        Branch Sites     Optimization
(Weeks 1-6)      (Weeks 7-10)     (Weeks 11-22)    (Weeks 23-34)    (Weeks 35-40)
    |                |                |                |                |
    v                v                v                v                v
+----------+    +----------+    +----------+    +----------+    +----------+
| DNAC/ISE |    | Mumbai   |    | Chennai  |    | APAC     |    | Tuning   |
| Install  |    | Pilot    |    | London   |    | EMEA     |    | Training |
| Underlay |    | Fabric   |    | Frankfurt|    | Americas |    | Handover |
| Prep     |    | Test     |    | NJ/Dallas|    | Branches |    | Document |
+----------+    +----------+    +----------+    +----------+    +----------+
```

### 4.1.2 Deployment Timeline

| Phase | Duration | Sites | Activities | Exit Criteria |
|-------|----------|-------|------------|---------------|
| Phase 1: Foundation | 6 weeks | N/A | DNAC cluster, ISE deployment, underlay prep | DNAC/ISE operational, underlay validated |
| Phase 2: Pilot | 4 weeks | Mumbai (partial) | Single building fabric, limited users | 500 users migrated, 95% success rate |
| Phase 3: Hub Sites | 12 weeks | 6 hub sites | Full fabric deployment, all VNs | All hub sites operational, 99.9% uptime |
| Phase 4: Branch Sites | 12 weeks | 30+ branches | Fabric-in-a-Box, SD-WAN integration | All branches migrated, failover tested |
| Phase 5: Optimization | 6 weeks | All | Performance tuning, training, handover | SLA compliance, team certified |

**Total Duration: 40 weeks (10 months)**

### 4.1.3 Governance Structure

```
                    +---------------------------+
                    |    Steering Committee     |
                    |    (Monthly Review)       |
                    +---------------------------+
                               |
            +------------------+------------------+
            |                                     |
    +---------------+                     +---------------+
    | Project       |                     | Technical     |
    | Management    |                     | Review Board  |
    | (Weekly)      |                     | (Weekly)      |
    +---------------+                     +---------------+
            |                                     |
    +-------+-------+                     +-------+-------+
    |               |                     |               |
+-------+    +----------+           +----------+    +----------+
| Change|    | Resource |           | Network  |    | Security |
| Mgmt  |    | Tracking |           | Team     |    | Team     |
+-------+    +----------+           +----------+    +----------+
```

### 4.1.4 Change Control Process

| Change Type | Approval Required | Lead Time | Rollback Window |
|-------------|-------------------|-----------|-----------------|
| Standard (documented procedure) | Team Lead | 24 hours | 2 hours |
| Normal (planned change) | CAB | 5 business days | 4 hours |
| Emergency (critical fix) | Emergency CAB | 2 hours | 1 hour |
| Major (site cutover) | Steering Committee | 10 business days | 8 hours |

---

## 4.2 Pre-Deployment Checklist

### 4.2.1 Infrastructure Prerequisites

| Category | Requirement | Validation Method | Status |
|----------|-------------|-------------------|--------|
| **Data Center - New Jersey** ||||
| Rack Space | 6U for DNAC cluster (3 nodes) | Physical inspection | [ ] |
| Power | 3 × 20A circuits (redundant) | Electrical survey | [ ] |
| Cooling | 15,000 BTU capacity | HVAC assessment | [ ] |
| Network | 2 × 10GbE to core switches | Port availability | [ ] |
| **Data Center - London** ||||
| Rack Space | 6U for DNAC DR cluster | Physical inspection | [ ] |
| Power | 3 × 20A circuits (redundant) | Electrical survey | [ ] |
| Network | 2 × 10GbE to core switches | Port availability | [ ] |
| **ISE Nodes (All Sites)** ||||
| PAN Nodes | 2 × SNS-3695-K9 (NJ, London) | Hardware delivered | [ ] |
| PSN Nodes | 12 × SNS-3655-K9 (2 per region) | Hardware delivered | [ ] |
| Network | 2 × 10GbE per node | Port availability | [ ] |

### 4.2.2 Network Prerequisites

| Requirement | Specification | Validation Command |
|-------------|---------------|-------------------|
| Management VLAN | VLAN 100 (10.252.0.0/24) | `show vlan id 100` |
| OOB Management | Dedicated OOB switches | `ping` from OOB network |
| NTP Servers | 2 × internal NTP (10.252.1.10/11) | `show ntp status` |
| DNS Servers | 2 × internal DNS (10.252.1.20/21) | `nslookup dnac.corp.local` |
| DHCP Servers | ISE-aware DHCP or Windows DHCP | Option 43 configured |
| Syslog Servers | 2 × syslog (10.252.1.30/31) | `logger` test message |
| SNMP Servers | DNA Center as trap destination | Community string configured |

### 4.2.3 Software Prerequisites

```
+------------------------------------------------------------------+
| Component          | Minimum Version      | Target Version        |
+------------------------------------------------------------------+
| DNA Center         | 2.3.5.x              | 2.3.7.3 (latest)      |
| ISE                | 3.1 Patch 7          | 3.2 Patch 2           |
| Catalyst 9500      | IOS-XE 17.9.4        | IOS-XE 17.12.2        |
| Catalyst 9300      | IOS-XE 17.9.4        | IOS-XE 17.12.2        |
| Catalyst 9800 WLC  | IOS-XE 17.9.4        | IOS-XE 17.12.2        |
| AireOS (legacy)    | 8.10.185.0           | N/A (migrating)       |
+------------------------------------------------------------------+
```

### 4.2.4 License Prerequisites

| License Type | Quantity | Duration | Activation |
|--------------|----------|----------|------------|
| DNA Advantage - Switching | 854 devices | 5-year | Smart License |
| DNA Advantage - Wireless | 590 APs | 5-year | Smart License |
| ISE Base | 19,000 endpoints | 5-year | PAK/Smart |
| ISE Plus | 19,000 endpoints | 5-year | PAK/Smart |
| ISE Advantage (optional) | 19,000 endpoints | 5-year | PAK/Smart |

### 4.2.5 Credential Requirements

| System | Username Convention | Password Policy | MFA Required |
|--------|---------------------|-----------------|--------------|
| DNAC Admin | dnac-admin | 16+ chars, complexity | Yes (DUO) |
| DNAC Network | dnac-network | 16+ chars, complexity | No |
| ISE Admin | ise-admin | 16+ chars, complexity | Yes (DUO) |
| ISE ERS API | ise-api | 24+ chars, complexity | Certificate |
| Device CLI | netadmin | 16+ chars, complexity | No |
| Device Enable | (secret) | 16+ chars, complexity | No |

### 4.2.6 Certificate Requirements

| Certificate | Purpose | CA | Validity |
|-------------|---------|-----|----------|
| DNAC Server | Web UI, API | Internal CA | 2 years |
| ISE Admin | Web UI | Internal CA | 2 years |
| ISE EAP | 802.1X authentication | Internal CA | 2 years |
| ISE pxGrid | Context sharing | Internal CA | 2 years |
| Device | MACsec, dot1x supplicant | Internal CA | 2 years |

---

## 4.3 DNA Center Cluster Installation

### 4.3.1 Cluster Architecture

```
                         NEW JERSEY DATA CENTER
    +----------------------------------------------------------------+
    |                                                                  |
    |    +------------+    +------------+    +------------+           |
    |    |  DNAC-01   |    |  DNAC-02   |    |  DNAC-03   |           |
    |    | (Primary)  |    | (Secondary)|    | (Tertiary) |           |
    |    +------------+    +------------+    +------------+           |
    |    | Enterprise |    | Enterprise |    | Enterprise |           |
    |    | 10.252.10.11    | 10.252.10.12    | 10.252.10.13           |
    |    | Cluster    |    | Cluster    |    | Cluster    |           |
    |    | 10.252.11.11    | 10.252.11.12    | 10.252.11.13           |
    |    | Management |    | Management |    | Management |           |
    |    | 10.252.12.11    | 10.252.12.12    | 10.252.12.13           |
    |    +------------+    +------------+    +------------+           |
    |           |                |                |                    |
    |           +----------------+----------------+                    |
    |                           |                                      |
    |                    +------+------+                               |
    |                    | VIP Address |                               |
    |                    | 10.252.10.10|                               |
    |                    +-------------+                               |
    +----------------------------------------------------------------+

                         LONDON DATA CENTER (DR)
    +----------------------------------------------------------------+
    |    +------------+    +------------+    +------------+           |
    |    |  DNAC-DR01 |    |  DNAC-DR02 |    |  DNAC-DR03 |           |
    |    | 10.252.20.11    | 10.252.20.12    | 10.252.20.13           |
    |    +------------+    +------------+    +------------+           |
    |                    | VIP: 10.252.20.10 |                        |
    +----------------------------------------------------------------+
```

### 4.3.2 DNAC Installation Procedure

**Step 1: Hardware Setup (Per Node)**

```bash
# Physical connections per DNAC appliance
# Port 1 (enp9s0)  - Enterprise Network (10.252.10.0/24)
# Port 2 (enp10s0) - Cluster Network (10.252.11.0/24)
# Port 3 (enp11s0) - Management Network (10.252.12.0/24)
# Port 4 (enp12s0) - Not used (future)
# CIMC             - OOB Management (10.252.100.0/24)
```

**Step 2: CIMC Configuration**

```
# Access CIMC via KVM or console
# Configure static IP for CIMC management

CIMC IP Addresses:
- DNAC-01 CIMC: 10.252.100.11/24
- DNAC-02 CIMC: 10.252.100.12/24
- DNAC-03 CIMC: 10.252.100.13/24
- Gateway: 10.252.100.1

# Validate CIMC access
https://10.252.100.11 (admin / <password>)
```

**Step 3: Maglev Installer Boot**

```bash
# Boot from DNAC ISO via CIMC virtual media
# Maglev installer prompts:

1. Configure static IP (Enterprise): 10.252.10.11/24
2. Configure gateway: 10.252.10.1
3. Configure DNS: 10.252.1.20, 10.252.1.21
4. Configure NTP: 10.252.1.10, 10.252.1.11
5. Configure hostname: dnac-nj-01.corp.local
6. Configure cluster interface: 10.252.11.11/24
7. Configure management interface: 10.252.12.11/24
8. Set admin password: <secure_password>
9. Configure proxy (if required): None
```

**Step 4: First Node Installation**

```bash
# On DNAC-01 (first node)
# Installation takes approximately 90 minutes

# Post-installation validation
curl -k https://10.252.10.11/api/system/v1/maglev/health
# Expected: {"status":"healthy"}

# Access web UI
https://10.252.10.11
# Login: admin / <configured_password>
```

**Step 5: Cluster Formation**

```bash
# From DNAC-01 web UI: System > System 360 > Cluster

# Add second node (DNAC-02)
# Navigate: Add Node
# Enter: 10.252.10.12 (Enterprise IP of DNAC-02)
# Enter: 10.252.11.12 (Cluster IP of DNAC-02)
# Enter credentials configured during DNAC-02 installation

# Wait for node to join (approximately 45 minutes)

# Add third node (DNAC-03)
# Same process with 10.252.10.13 / 10.252.11.13

# Validate 3-node cluster
curl -k https://10.252.10.10/api/system/v1/maglev/nodes
```

**Step 6: Virtual IP Configuration**

```bash
# From web UI: System > Settings > System Configuration
# Configure VIP: 10.252.10.10

# Validate VIP
ping 10.252.10.10
curl -k https://10.252.10.10/api/system/v1/maglev/health

# DNS entry
dnac.corp.local -> 10.252.10.10
```

### 4.3.3 DNAC Post-Installation Configuration

**Step 7: License Activation**

```bash
# System > Settings > Licensing
# Connect to Cisco Smart Software Manager
# Register with Smart Account token

# Required licenses:
# - DNA Advantage (Switching)
# - DNA Advantage (Wireless)
# - Assurance
```

**Step 8: Certificate Installation**

```bash
# System > Settings > Trust & Privacy > System Certificates

# Generate CSR for DNAC
# Subject: CN=dnac.corp.local
# SAN: dnac.corp.local, 10.252.10.10
# Key: RSA 2048-bit

# Submit CSR to internal CA
# Import signed certificate chain

# Restart web service to apply certificate
```

**Step 9: External Services Integration**

```yaml
# System > Settings > External Services

# Authentication/Policy Servers (ISE)
ISE_Primary:
  IP: 10.252.30.10
  Shared_Secret: <ise_shared_secret>
  Type: ISE
  Use_for_AAA: Yes
  Use_for_pxGrid: Yes

ISE_Secondary:
  IP: 10.252.30.20
  Shared_Secret: <ise_shared_secret>
  Type: ISE
  Use_for_AAA: Yes (failover)

# AAA Configuration
AAA_Protocol: RADIUS
Network_User_Auth: ISE
Client_and_Endpoint_Auth: ISE

# Syslog Servers
Syslog_1: 10.252.1.30 (UDP 514)
Syslog_2: 10.252.1.31 (UDP 514)

# SNMP Configuration
SNMP_Version: v3
SNMP_User: dnac-snmp
Auth_Protocol: SHA
Priv_Protocol: AES128
```

**Step 10: Network Settings**

```yaml
# Design > Network Settings > Global

# DHCP Servers
DHCP_Primary: 10.252.1.40
DHCP_Secondary: 10.252.1.41

# DNS Servers
DNS_Primary: 10.252.1.20
DNS_Secondary: 10.252.1.21
Domain_Name: corp.local

# NTP Servers
NTP_Primary: 10.252.1.10
NTP_Secondary: 10.252.1.11

# Syslog Servers
Syslog_Primary: 10.252.1.30
Syslog_Secondary: 10.252.1.31

# SNMP Settings
SNMP_Version: v3
SNMP_Servers: 10.252.10.10 (DNAC)

# AAA Settings
Network_AAA: ISE (10.252.30.10)
Client_AAA: ISE (10.252.30.10)
```

### 4.3.4 DNAC Health Validation

```bash
# CLI validation (SSH to DNAC)
ssh maglev@10.252.10.10

# Check cluster status
maglev cluster status

# Expected output:
# Node      Role       Status    Services
# dnac-01   PRIMARY    HEALTHY   47/47
# dnac-02   SECONDARY  HEALTHY   47/47
# dnac-03   TERTIARY   HEALTHY   47/47

# Check services
maglev service status

# Check disk space
df -h

# Check NTP sync
ntpstat

# API health check
curl -k -u admin:<password> https://10.252.10.10/dna/intent/api/v1/network-health
```

---

## 4.4 ISE Distributed Deployment

### 4.4.1 ISE Architecture

```
                    PRIMARY ADMINISTRATION NODE
                    +-------------------------+
                    |      ISE-PAN-NJ         |
                    |    10.252.30.10         |
                    |   (Primary Admin)       |
                    +-------------------------+
                              |
              +---------------+---------------+
              |                               |
    +-------------------+           +-------------------+
    |   ISE-PAN-LON     |           |   pxGrid Nodes    |
    |   10.252.30.20    |           | (on PAN nodes)    |
    | (Secondary Admin) |           |                   |
    +-------------------+           +-------------------+

                    POLICY SERVICE NODES (PSN)
    +----------------------------------------------------------------+
    |                                                                  |
    |  APAC                    EMEA                   AMERICAS         |
    |  +----------+           +----------+           +----------+      |
    |  | Mumbai   |           | London   |           | New Jersey|     |
    |  | PSN-MUM-1|           | PSN-LON-1|           | PSN-NJ-1 |      |
    |  | PSN-MUM-2|           | PSN-LON-2|           | PSN-NJ-2 |      |
    |  +----------+           +----------+           +----------+      |
    |  +----------+           +----------+           +----------+      |
    |  | Chennai  |           | Frankfurt|           | Dallas   |      |
    |  | PSN-CHN-1|           | PSN-FRA-1|           | PSN-DAL-1|      |
    |  | PSN-CHN-2|           | PSN-FRA-2|           | PSN-DAL-2|      |
    |  +----------+           +----------+           +----------+      |
    +----------------------------------------------------------------+
```

### 4.4.2 ISE IP Address Allocation

| Node | Role | IP Address | Location |
|------|------|------------|----------|
| ISE-PAN-NJ | Primary PAN/MnT/pxGrid | 10.252.30.10 | New Jersey |
| ISE-PAN-LON | Secondary PAN/MnT/pxGrid | 10.252.30.20 | London |
| ISE-PSN-MUM-1 | PSN | 10.252.31.11 | Mumbai |
| ISE-PSN-MUM-2 | PSN | 10.252.31.12 | Mumbai |
| ISE-PSN-CHN-1 | PSN | 10.252.31.21 | Chennai |
| ISE-PSN-CHN-2 | PSN | 10.252.31.22 | Chennai |
| ISE-PSN-LON-1 | PSN | 10.252.31.31 | London |
| ISE-PSN-LON-2 | PSN | 10.252.31.32 | London |
| ISE-PSN-FRA-1 | PSN | 10.252.31.41 | Frankfurt |
| ISE-PSN-FRA-2 | PSN | 10.252.31.42 | Frankfurt |
| ISE-PSN-NJ-1 | PSN | 10.252.31.51 | New Jersey |
| ISE-PSN-NJ-2 | PSN | 10.252.31.52 | New Jersey |
| ISE-PSN-DAL-1 | PSN | 10.252.31.61 | Dallas |
| ISE-PSN-DAL-2 | PSN | 10.252.31.62 | Dallas |

### 4.4.3 ISE Installation Procedure

**Step 1: Primary PAN Installation (ISE-PAN-NJ)**

```bash
# Boot from ISE 3.2 ISO via CIMC

# Setup wizard prompts:
hostname: ise-pan-nj
ip address Ethernet0: 10.252.30.10
ip netmask Ethernet0: 255.255.255.0
ip default-gateway: 10.252.30.1
DNS domain: corp.local
primary nameserver: 10.252.1.20
secondary nameserver: 10.252.1.21
NTP server: 10.252.1.10
timezone: UTC
admin username: admin
admin password: <secure_password>

# Installation takes approximately 45 minutes
```

**Step 2: Initial PAN Configuration**

```bash
# Access ISE GUI
https://10.252.30.10

# Administration > System > Deployment
# Configure as Primary PAN

# Administration > System > Settings
# - Enable pxGrid
# - Enable ERS API
# - Configure admin session timeout
# - Enable FIPS mode (if required)

# Administration > System > Certificates
# - Import internal CA certificate
# - Generate CSR for Admin certificate
# - Generate CSR for EAP certificate
# - Generate CSR for pxGrid certificate
```

**Step 3: Secondary PAN Installation (ISE-PAN-LON)**

```bash
# Install ISE on secondary node same as primary

hostname: ise-pan-lon
ip address: 10.252.30.20

# After installation, register to primary:
# Administration > System > Deployment > Register

Primary_PAN_FQDN: ise-pan-nj.corp.local
Username: admin
Password: <password>

# Enable roles:
# - Secondary Administration Node
# - Secondary Monitoring Node
# - pxGrid (Secondary)
```

**Step 4: PSN Node Installation**

```bash
# Install ISE on each PSN node
# Example: ISE-PSN-MUM-1

hostname: ise-psn-mum-1
ip address: 10.252.31.11

# Register to primary PAN:
Primary_PAN_FQDN: ise-pan-nj.corp.local

# Enable roles:
# - Policy Service
# - Session Services
# - Profiling Service
# - SXP Service

# Repeat for all 12 PSN nodes
```

### 4.4.4 ISE Node Group Configuration

```yaml
# Administration > System > Deployment > Node Groups

Node_Groups:
  APAC-Mumbai:
    Members:
      - ise-psn-mum-1.corp.local
      - ise-psn-mum-2.corp.local
    Load_Balancing: Round-robin
    
  APAC-Chennai:
    Members:
      - ise-psn-chn-1.corp.local
      - ise-psn-chn-2.corp.local
    Load_Balancing: Round-robin
    
  EMEA-London:
    Members:
      - ise-psn-lon-1.corp.local
      - ise-psn-lon-2.corp.local
    Load_Balancing: Round-robin
    
  EMEA-Frankfurt:
    Members:
      - ise-psn-fra-1.corp.local
      - ise-psn-fra-2.corp.local
    Load_Balancing: Round-robin
    
  AMER-NewJersey:
    Members:
      - ise-psn-nj-1.corp.local
      - ise-psn-nj-2.corp.local
    Load_Balancing: Round-robin
    
  AMER-Dallas:
    Members:
      - ise-psn-dal-1.corp.local
      - ise-psn-dal-2.corp.local
    Load_Balancing: Round-robin
```

### 4.4.5 ISE-DNAC Integration

**Step 1: Enable pxGrid on ISE**

```bash
# Administration > pxGrid Services > Settings
Enable_pxGrid: Yes
Allow_Password_Based_Accounts: Yes (initial setup)
Automatically_Approve_Certificates: No

# Generate pxGrid certificate for DNAC
# Subject: CN=dnac.corp.local
```

**Step 2: Configure DNAC as pxGrid Client**

```bash
# On DNAC: System > Settings > Authentication and Policy Servers

Server_Type: ISE
Primary_IP: 10.252.30.10
Secondary_IP: 10.252.30.20
Shared_Secret: <shared_secret>
Protocol: RADIUS, TACACS+
pxGrid_User: dnac-pxgrid
pxGrid_Password: <password>

# Test connectivity
```

**Step 3: Verify Integration**

```bash
# On ISE: Administration > pxGrid Services > Web Clients
# Verify DNAC appears as connected client

# On DNAC: System > Settings > pxGrid Settings
# Status should show "Connected"

# On ISE: Operations > RADIUS > Live Logs
# Verify test authentications from DNAC
```

### 4.4.6 ISE Policy Configuration

**Network Device Groups**

```yaml
# Administration > Network Resources > Network Device Groups

Device_Type:
  - SD-Access_Fabric
    - Border_Nodes
    - Control_Plane_Nodes
    - Edge_Nodes
    - Extended_Nodes
  - Wireless_LAN_Controller
  - Legacy_Devices

Location:
  - APAC
    - Mumbai
    - Chennai
    - Bangalore
    - Delhi
    - Noida
  - EMEA
    - London
    - Frankfurt
    - Branches_EMEA
  - AMERICAS
    - New_Jersey
    - Dallas
    - Branches_AMER
```

**Identity Source Sequences**

```yaml
# Administration > Identity Management > Identity Source Sequences

AD_Internal_Sequence:
  Name: Corporate_Authentication
  Sources:
    1. Active_Directory (AD-CORP)
    2. Internal_Users
  Treat_as_if_not_exist: Continue

Guest_Sequence:
  Name: Guest_Authentication
  Sources:
    1. Guest_Users
    2. Internal_Users
  Treat_as_if_not_exist: Reject
```

### 4.4.7 ISE Health Validation

```bash
# CLI validation (SSH to ISE PAN)
ssh admin@10.252.30.10

# Check application status
show application status ise

# Expected output:
# ISE PROCESS NAME                       STATE            PROCESS ID
# Database Listener                      running          xxxxx
# Database Server                        running          xxxxx
# Application Server                     running          xxxxx
# Profiler Database                      running          xxxxx
# pxGrid Infrastructure Service          running          xxxxx
# pxGrid Publisher Subscriber Service    running          xxxxx
# pxGrid Controller                      running          xxxxx
# ...

# Check deployment status
show version

# Check node registration
# On GUI: Administration > System > Deployment
# All nodes should show green status
```

---

## 4.5 Underlay Network Provisioning

### 4.5.1 Underlay Design Summary

```
                              UNDERLAY TOPOLOGY (Hub Site)
    
    +------------------------------------------------------------------+
    |                          DATA CENTER                              |
    |                                                                    |
    |   +-------------+                          +-------------+        |
    |   | Border-1    |--------------------------|  Border-2   |        |
    |   | Lo0: .1     |     P2P: /31             | Lo0: .2     |        |
    |   +-------------+                          +-------------+        |
    |          |                                        |               |
    |          |  P2P Links                             |               |
    |          |                                        |               |
    |   +-------------+                          +-------------+        |
    |   | CP-1        |--------------------------|  CP-2       |        |
    |   | Lo0: .3     |                          | Lo0: .4     |        |
    |   +-------------+                          +-------------+        |
    |          |                                        |               |
    |          +------------------+--------------------+                |
    |                             |                                      |
    |     +----------+    +----------+    +----------+                  |
    |     |  Edge-1  |    |  Edge-2  |    |  Edge-N  |                  |
    |     |  Lo0: .5 |    |  Lo0: .6 |    |  Lo0: .N |                  |
    |     +----------+    +----------+    +----------+                  |
    |                                                                    |
    +------------------------------------------------------------------+
```

### 4.5.2 Loopback Address Scheme

| Region | Site | Node Type | Loopback Range |
|--------|------|-----------|----------------|
| APAC | Mumbai | Border | 10.250.1.1-2/32 |
| APAC | Mumbai | CP | 10.250.1.3-4/32 |
| APAC | Mumbai | Edge | 10.250.1.5-52/32 |
| APAC | Chennai | Border | 10.250.2.1-2/32 |
| APAC | Chennai | CP | 10.250.2.3-4/32 |
| APAC | Chennai | Edge | 10.250.2.5-40/32 |
| EMEA | London | Border | 10.250.16.1-2/32 |
| EMEA | London | CP | 10.250.16.3-4/32 |
| EMEA | London | Edge | 10.250.16.5-46/32 |
| EMEA | Frankfurt | Border | 10.250.17.1-2/32 |
| EMEA | Frankfurt | CP | 10.250.17.3-4/32 |
| EMEA | Frankfurt | Edge | 10.250.17.5-32/32 |
| AMER | New Jersey | Border | 10.250.32.1-2/32 |
| AMER | New Jersey | CP | 10.250.32.3-4/32 |
| AMER | New Jersey | Edge | 10.250.32.5-56/32 |
| AMER | Dallas | Border | 10.250.33.1-2/32 |
| AMER | Dallas | CP | 10.250.33.3-4/32 |
| AMER | Dallas | Edge | 10.250.33.5-36/32 |

### 4.5.3 P2P Link Address Scheme

```
P2P Link Format: 10.251.{site-id}.{link-id}/31

Site IDs:
- Mumbai: 1
- Chennai: 2
- London: 16
- Frankfurt: 17
- New Jersey: 32
- Dallas: 33

Example (Mumbai):
- Border-1 to Border-2: 10.251.1.0/31
- Border-1 to CP-1: 10.251.1.2/31
- Border-1 to CP-2: 10.251.1.4/31
- Border-2 to CP-1: 10.251.1.6/31
- Border-2 to CP-2: 10.251.1.8/31
- CP-1 to CP-2: 10.251.1.10/31
- CP-1 to Edge-1: 10.251.1.12/31
- CP-2 to Edge-1: 10.251.1.14/31
...
```

### 4.5.4 IS-IS Underlay Configuration

**Border Node Configuration**

```cisco
! Border Node Underlay Configuration
! Example: APAC-Mumbai-Border-1 (C9500-48Y4C)

hostname MUM-BN-01

! Loopback for RLOC
interface Loopback0
 description FABRIC-RLOC
 ip address 10.250.1.1 255.255.255.255
 ip router isis UNDERLAY
 isis circuit-type level-2-only

! IS-IS Process
router isis UNDERLAY
 net 49.0001.0102.5000.1001.00
 is-type level-2-only
 metric-style wide
 log-adjacency-changes
 nsf ietf
 authentication mode md5 level-2
 authentication key-chain ISIS-KEY level-2
 address-family ipv4 unicast
  redistribute connected route-map LOOPBACK-ONLY
 exit-address-family

! Key Chain for IS-IS Authentication
key chain ISIS-KEY
 key 1
  key-string <encrypted_key>
  cryptographic-algorithm hmac-sha-256

! P2P Link to Border-2
interface TenGigabitEthernet1/0/1
 description P2P-TO-MUM-BN-02
 no switchport
 ip address 10.251.1.0 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3

! P2P Link to CP-1
interface TenGigabitEthernet1/0/2
 description P2P-TO-MUM-CP-01
 no switchport
 ip address 10.251.1.2 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3

! P2P Link to CP-2
interface TenGigabitEthernet1/0/3
 description P2P-TO-MUM-CP-02
 no switchport
 ip address 10.251.1.4 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3

! Route-map for Loopback Redistribution
route-map LOOPBACK-ONLY permit 10
 match interface Loopback0
```

**Control Plane Node Configuration**

```cisco
! Control Plane Node Underlay Configuration
! Example: APAC-Mumbai-CP-1 (C9500-24Y4C)

hostname MUM-CP-01

interface Loopback0
 description FABRIC-RLOC
 ip address 10.250.1.3 255.255.255.255
 ip router isis UNDERLAY
 isis circuit-type level-2-only

router isis UNDERLAY
 net 49.0001.0102.5000.1003.00
 is-type level-2-only
 metric-style wide
 log-adjacency-changes
 nsf ietf
 authentication mode md5 level-2
 authentication key-chain ISIS-KEY level-2
 address-family ipv4 unicast
  redistribute connected route-map LOOPBACK-ONLY
 exit-address-family

! P2P Links to all connected nodes
interface TenGigabitEthernet1/0/1
 description P2P-TO-MUM-BN-01
 no switchport
 ip address 10.251.1.3 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 bfd interval 100 min_rx 100 multiplier 3

interface TenGigabitEthernet1/0/2
 description P2P-TO-MUM-BN-02
 no switchport
 ip address 10.251.1.7 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 bfd interval 100 min_rx 100 multiplier 3

interface TenGigabitEthernet1/0/3
 description P2P-TO-MUM-CP-02
 no switchport
 ip address 10.251.1.10 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 bfd interval 100 min_rx 100 multiplier 3
```

**Edge Node Configuration**

```cisco
! Edge Node Underlay Configuration
! Example: APAC-Mumbai-Edge-1 (C9300-48U)

hostname MUM-ED-01

interface Loopback0
 description FABRIC-RLOC
 ip address 10.250.1.5 255.255.255.255
 ip router isis UNDERLAY
 isis circuit-type level-2-only

router isis UNDERLAY
 net 49.0001.0102.5000.1005.00
 is-type level-2-only
 metric-style wide
 log-adjacency-changes
 nsf ietf
 authentication mode md5 level-2
 authentication key-chain ISIS-KEY level-2

! Uplinks to Distribution/CP
interface TenGigabitEthernet1/1/1
 description UPLINK-TO-CP-01
 no switchport
 ip address 10.251.1.13 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 bfd interval 100 min_rx 100 multiplier 3

interface TenGigabitEthernet1/1/2
 description UPLINK-TO-CP-02
 no switchport
 ip address 10.251.1.15 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 bfd interval 100 min_rx 100 multiplier 3
```

### 4.5.5 Underlay Validation

```cisco
! Verify IS-IS adjacencies
show isis neighbors

! Expected output:
! System Id      Type Interface         IP Address      State Holdtime Circuit Id
! MUM-BN-02      L2   Te1/0/1           10.251.1.1      UP    27       01
! MUM-CP-01      L2   Te1/0/2           10.251.1.3      UP    28       01
! MUM-CP-02      L2   Te1/0/3           10.251.1.5      UP    26       01

! Verify IS-IS database
show isis database detail

! Verify IP routing table
show ip route isis
! All loopbacks should be present

! Verify BFD sessions
show bfd neighbors

! Ping all loopbacks
ping 10.250.1.1 source Loopback0
ping 10.250.1.2 source Loopback0
! ... repeat for all fabric nodes

! Verify MTU (required for VXLAN overhead)
! All fabric links should support 9100+ byte MTU
show interface Te1/0/1 | include MTU
```

---

## 4.6 Fabric Site Configuration

### 4.6.1 Site Hierarchy Creation in DNAC

**Step 1: Create Site Hierarchy**

```yaml
# Design > Network Hierarchy

Global:
  APAC:
    Mumbai:
      - Building_MUM_HQ:
          - Floor_1
          - Floor_2
          - Floor_3
          - Floor_4
          - Floor_5
          - Floor_6
          - Data_Center
    Chennai:
      - Building_CHN_HQ:
          - Floor_1
          - Floor_2
          - Floor_3
          - Floor_4
          - Data_Center
    Bangalore:
      - Building_BLR_BR1
    Delhi:
      - Building_DEL_BR1
    Noida:
      - Building_NOI_BR1
      
  EMEA:
    London:
      - Building_LON_HQ:
          - Floor_1
          - Floor_2
          - Floor_3
          - Floor_4
          - Data_Center
    Frankfurt:
      - Building_FRA_HQ:
          - Floor_1
          - Floor_2
          - Floor_3
          - Data_Center
    Branches_EMEA:
      - Amsterdam
      - Paris
      - Madrid
      - Milan
      - ... (remaining branches)
      
  Americas:
    New_Jersey:
      - Building_NJ_HQ:
          - Floor_1
          - Floor_2
          - Floor_3
          - Floor_4
          - Floor_5
          - Data_Center
    Dallas:
      - Building_DAL_HQ:
          - Floor_1
          - Floor_2
          - Floor_3
          - Data_Center
    Branches_AMER:
      - Chicago
      - Atlanta
      - Seattle
      - Los_Angeles
      - ... (remaining branches)
```

### 4.6.2 Network Settings per Site

```yaml
# Design > Network Settings

Global_Settings:
  AAA:
    Network_Server: ISE (10.252.30.10)
    Client_Server: ISE (10.252.30.10)
  DHCP_Server: Inherited per site
  DNS_Server: 10.252.1.20, 10.252.1.21
  Domain: corp.local
  NTP: 10.252.1.10, 10.252.1.11
  Syslog: 10.252.1.30
  SNMP: 
    Trap_Server: 10.252.10.10
    Community: <encrypted>
    
Site_Override_Mumbai:
  DHCP_Server: 10.10.0.10, 10.10.0.11
  
Site_Override_Chennai:
  DHCP_Server: 10.10.16.10, 10.10.16.11
  
Site_Override_London:
  DHCP_Server: 10.20.0.10, 10.20.0.11
  
Site_Override_Frankfurt:
  DHCP_Server: 10.20.16.10, 10.20.16.11
  
Site_Override_NewJersey:
  DHCP_Server: 10.30.0.10, 10.30.0.11
  
Site_Override_Dallas:
  DHCP_Server: 10.30.16.10, 10.30.16.11
```

### 4.6.3 Fabric Site Provisioning

**Step 1: Create Fabric Site**

```yaml
# Provision > Fabric Sites

Mumbai_Fabric:
  Site: Global/APAC/Mumbai
  Authentication_Template: Closed Authentication
  
  IP_Pools:
    Corporate_Pool:
      Type: LAN
      Network: 10.100.0.0/16
      Gateway: 10.100.0.1
      DHCP_Server: 10.10.0.10
      
    Guest_Pool:
      Type: LAN
      Network: 10.200.0.0/16
      Gateway: 10.200.0.1
      DHCP_Server: 10.10.0.10
      
    IoT_Pool:
      Type: LAN
      Network: 10.150.0.0/16
      Gateway: 10.150.0.1
      DHCP_Server: 10.10.0.10
      
    Voice_Pool:
      Type: LAN
      Network: 10.190.0.0/16
      Gateway: 10.190.0.1
      DHCP_Server: 10.10.0.10
```

### 4.6.4 Virtual Network Configuration

```yaml
# Provision > Fabric Sites > [Site] > Virtual Networks

Virtual_Networks:
  VN_CORPORATE:
    VNI: 8001
    Traffic_Type: Data
    Layer3_Gateway: Distributed (Anycast)
    IP_Pools:
      - Corporate_Pool_Mumbai (10.100.1.0/24)
      - Corporate_Pool_Chennai (10.100.2.0/24)
      - Corporate_Pool_London (10.100.16.0/24)
      # ... per site pools
      
  VN_GUEST:
    VNI: 8002
    Traffic_Type: Data
    Layer3_Gateway: Centralized (Border)
    IP_Pools:
      - Guest_Pool_Mumbai (10.200.1.0/24)
      - Guest_Pool_Chennai (10.200.2.0/24)
      # ... per site pools
      
  VN_IOT:
    VNI: 8003
    Traffic_Type: Data
    Layer3_Gateway: Distributed (Anycast)
    IP_Pools:
      - IoT_Pool_Mumbai (10.150.1.0/24)
      - IoT_Pool_Chennai (10.150.2.0/24)
      # ... per site pools
      
  VN_VOICE:
    VNI: 8005
    Traffic_Type: Voice
    Layer3_Gateway: Distributed (Anycast)
    IP_Pools:
      - Voice_Pool_Mumbai (10.190.1.0/24)
      - Voice_Pool_Chennai (10.190.2.0/24)
      # ... per site pools
      
  VN_SERVERS:
    VNI: 8004
    Traffic_Type: Data
    Layer3_Gateway: Centralized (Border)
    IP_Pools:
      - Server_Pool_Mumbai_DC (10.180.1.0/24)
      - Server_Pool_Chennai_DC (10.180.2.0/24)
      # ... per site pools
```

### 4.6.5 Scalable Group Configuration

```yaml
# Policy > Group-Based Access Control > Scalable Groups

Scalable_Groups:
  SGT-EMPLOYEES:
    Tag_Value: 10
    Description: Corporate employees with full access
    VN: VN_CORPORATE
    
  SGT-EXECUTIVES:
    Tag_Value: 11
    Description: Executive users with priority
    VN: VN_CORPORATE
    
  SGT-CONTRACTORS:
    Tag_Value: 15
    Description: Contractors with limited access
    VN: VN_CORPORATE
    
  SGT-VOICE:
    Tag_Value: 20
    Description: IP phones and voice traffic
    VN: VN_VOICE
    
  SGT-PRINTERS:
    Tag_Value: 30
    Description: Network printers
    VN: VN_CORPORATE
    
  SGT-GUESTS:
    Tag_Value: 40
    Description: Guest network users
    VN: VN_GUEST
    
  SGT-IOT-SENSORS:
    Tag_Value: 50
    Description: Building IoT sensors
    VN: VN_IOT
    
  SGT-OT-DEVICES:
    Tag_Value: 60
    Description: Operational technology
    VN: VN_IOT
    
  SGT-CAMERAS:
    Tag_Value: 70
    Description: IP surveillance cameras
    VN: VN_IOT
    
  SGT-SERVERS-PROD:
    Tag_Value: 80
    Description: Production servers
    VN: VN_SERVERS
    
  SGT-SERVERS-DEV:
    Tag_Value: 90
    Description: Development servers
    VN: VN_SERVERS
    
  SGT-QUARANTINE:
    Tag_Value: 999
    Description: Non-compliant endpoints
    VN: VN_CORPORATE
```

---

## 4.7 Fabric Node Provisioning

### 4.7.1 Device Discovery and Inventory

**Step 1: Add Devices to DNAC**

```yaml
# Provision > Inventory > Add Device

Discovery_Method: CDP/LLDP Discovery
Seed_IP: 10.252.12.1 (Management switch)
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
    
# Or direct device add:
Device_IP: 10.252.12.11
Device_Type: Catalyst 9500
```

**Step 2: Assign Devices to Sites**

```yaml
# Provision > Inventory > [Device] > Assign to Site

MUM-BN-01: Global/APAC/Mumbai/Building_MUM_HQ/Data_Center
MUM-BN-02: Global/APAC/Mumbai/Building_MUM_HQ/Data_Center
MUM-CP-01: Global/APAC/Mumbai/Building_MUM_HQ/Data_Center
MUM-CP-02: Global/APAC/Mumbai/Building_MUM_HQ/Data_Center
MUM-ED-01: Global/APAC/Mumbai/Building_MUM_HQ/Floor_1
MUM-ED-02: Global/APAC/Mumbai/Building_MUM_HQ/Floor_1
# ... continue for all devices
```

### 4.7.2 Border Node Provisioning

**Step 1: Add as Fabric Border**

```yaml
# Provision > Fabric Sites > [Mumbai] > Fabric Infrastructure

Device: MUM-BN-01
Role: Border Node
Border_Type: Internal + External
Border_Settings:
  Local_Gateway: Enabled
  Default_Exit: Enabled
  
External_Connectivity:
  Protocol: BGP
  ASN: 65001
  Neighbor:
    - IP: 10.240.1.1 (MPLS PE)
      Remote_ASN: 65000
    - IP: 10.240.1.5 (SD-WAN Edge)
      Remote_ASN: 65100
      
Handoff_Configuration:
  MPLS_Handoff:
    VLAN: 3001
    VRF: VN_CORPORATE
    IP: 10.240.1.2/30
    
  SDWAN_Handoff:
    VLAN: 3002
    VRF: INFRA_VN
    IP: 10.240.1.6/30
```

**Step 2: Border Node External Configuration**

```cisco
! Additional Border Configuration (manual or template)
! BGP configuration for external connectivity

router bgp 65001
 bgp router-id 10.250.1.1
 bgp log-neighbor-changes
 
 ! MPLS PE Peering
 neighbor 10.240.1.1 remote-as 65000
 neighbor 10.240.1.1 description MPLS-PE-PROVIDER
 neighbor 10.240.1.1 update-source Loopback0
 
 address-family ipv4 vrf VN_CORPORATE
  redistribute lisp metric 100
  neighbor 10.240.1.1 activate
  neighbor 10.240.1.1 send-community both
  neighbor 10.240.1.1 route-map FABRIC-TO-WAN out
  neighbor 10.240.1.1 route-map WAN-TO-FABRIC in
 exit-address-family
 
! Route-maps for prefix control
route-map FABRIC-TO-WAN permit 10
 match ip address prefix-list FABRIC-PREFIXES
 set community 65000:100
 
route-map WAN-TO-FABRIC permit 10
 match community WAN-ROUTES
 
ip prefix-list FABRIC-PREFIXES seq 10 permit 10.100.0.0/16 le 24
ip prefix-list FABRIC-PREFIXES seq 20 permit 10.150.0.0/16 le 24
ip prefix-list FABRIC-PREFIXES seq 30 permit 10.190.0.0/16 le 24
```

### 4.7.3 Control Plane Node Provisioning

```yaml
# Provision > Fabric Sites > [Mumbai] > Fabric Infrastructure

Device: MUM-CP-01
Role: Control Plane Node
CP_Settings:
  LISP_Site_ID: 1001
  Map_Server: Enabled
  Map_Resolver: Enabled
  
# DNAC automatically configures:
# - LISP MS/MR functionality
# - EID-to-RLOC mappings
# - Map-cache aging
# - Multicast underlay (if enabled)

# Repeat for MUM-CP-02 (HA pair)
```

### 4.7.4 Edge Node Provisioning

**Step 1: Add as Fabric Edge**

```yaml
# Provision > Fabric Sites > [Mumbai] > Fabric Infrastructure

Device: MUM-ED-01
Role: Edge Node
Location: Floor_1
Authentication: Closed Mode

Host_Onboarding:
  Pools:
    - VN_CORPORATE / Corporate_Pool_Floor1
    - VN_VOICE / Voice_Pool_Floor1
    - VN_IOT / IoT_Pool_Floor1
    
  Port_Assignment:
    Data_Ports: Gi1/0/1-40
    Voice_Ports: Gi1/0/1-40 (same, voice VLAN)
    AP_Ports: Gi1/0/41-48
    Uplinks: Te1/1/1-2
```

**Step 2: Port Configuration Template**

```cisco
! Edge Node Host Port Configuration
! Applied via DNAC template

! Data + Voice Port Template
interface GigabitEthernet1/0/1
 description HOST-PORT
 switchport mode access
 switchport access vlan <data_vlan>
 switchport voice vlan <voice_vlan>
 authentication host-mode multi-auth
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 mab
 dot1x pae authenticator
 dot1x timeout tx-period 10
 spanning-tree portfast
 spanning-tree bpduguard enable

! AP Port Template
interface GigabitEthernet1/0/41
 description AP-PORT
 switchport mode trunk
 switchport trunk native vlan <ap_vlan>
 switchport trunk allowed vlan <ap_vlan>,<wireless_vlans>
 authentication host-mode multi-domain
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 mab
 dot1x pae authenticator
 spanning-tree portfast trunk
```

### 4.7.5 Fabric Provisioning Workflow

```
+------------------------------------------------------------------+
|                    FABRIC PROVISIONING SEQUENCE                   |
+------------------------------------------------------------------+

Step 1: Prepare Underlay (Manual/Pre-provisioned)
        |
        v
Step 2: Add Fabric Site in DNAC
        |
        v
Step 3: Define IP Pools & VNs
        |
        v
Step 4: Add Border Nodes (First)
        +---> DNAC pushes:
              - LISP instance configuration
              - VRF definitions
              - VXLAN interfaces
              - Border handoff config
        |
        v
Step 5: Add Control Plane Nodes
        +---> DNAC pushes:
              - LISP MS/MR configuration
              - Map-cache parameters
              - Site-ID assignment
        |
        v
Step 6: Add Edge Nodes
        +---> DNAC pushes:
              - LISP ETR/ITR configuration
              - VXLAN tunnel interfaces
              - Host onboarding config
              - 802.1X/MAB configuration
        |
        v
Step 7: Validate Fabric Operation
        - LISP adjacencies
        - VXLAN tunnels
        - Host authentication
        - SGT assignment
```

---

## 4.8 Wireless Controller Integration

### 4.8.1 WLC Fabric Integration

**Step 1: Add WLC to DNAC**

```yaml
# Provision > Inventory > Add Device

Device: WLC-MUM-01
IP: 10.252.40.10
Type: Cisco Catalyst 9800-40
Credentials:
  CLI: netadmin / <password>
  SNMP: dnac-snmp (SNMPv3)
```

**Step 2: Configure WLC as Fabric-Enabled**

```yaml
# Provision > Fabric Sites > [Mumbai] > Wireless

Wireless_Controller: WLC-MUM-01
Fabric_Mode: Fabric-Enabled
Management_IP: 10.252.40.10
Mobility_Group: APAC-Mobility

Fabric_Settings:
  Control_Plane_Node: MUM-CP-01, MUM-CP-02
  Primary_Border: MUM-BN-01
  Secondary_Border: MUM-BN-02
```

### 4.8.2 SSID to VN Mapping

```yaml
# Provision > Fabric Sites > [Mumbai] > Wireless > SSIDs

SSID_Mappings:
  Corp-Secure:
    SSID_Name: Corp-Secure
    Security: WPA3-Enterprise
    Authentication: 802.1X (EAP-TLS)
    Virtual_Network: VN_CORPORATE
    SGT_Assignment: Dynamic (from ISE)
    Fabric_Profile: Corp_Fabric_Profile
    
  Corp-Guest:
    SSID_Name: Corp-Guest
    Security: WPA3-Personal (Captive Portal)
    Authentication: Web Auth
    Virtual_Network: VN_GUEST
    SGT_Assignment: Static (SGT-GUESTS: 40)
    Fabric_Profile: Guest_Fabric_Profile
    
  Corp-IoT:
    SSID_Name: Corp-IoT
    Security: WPA2-PSK
    Authentication: PSK + MAC Filtering
    Virtual_Network: VN_IOT
    SGT_Assignment: Static (SGT-IOT-SENSORS: 50)
    Fabric_Profile: IoT_Fabric_Profile
    
  Corp-Voice:
    SSID_Name: Corp-Voice
    Security: WPA3-Enterprise
    Authentication: 802.1X
    Virtual_Network: VN_VOICE
    SGT_Assignment: Static (SGT-VOICE: 20)
    Fabric_Profile: Voice_Fabric_Profile
    QoS: Platinum (Voice Priority)
```

### 4.8.3 AP Provisioning

```yaml
# Provision > Inventory > Access Points

AP_Assignment:
  Floor_1_APs:
    Location: Global/APAC/Mumbai/Building_MUM_HQ/Floor_1
    AP_Group: MUM-HQ-F1
    RF_Profile: Corporate-RF
    AP_List:
      - AP-MUM-F1-01 (C9130AXI)
      - AP-MUM-F1-02 (C9130AXI)
      - AP-MUM-F1-03 (C9130AXI)
      # ... up to 24 APs per floor
      
  Floor_2_APs:
    Location: Global/APAC/Mumbai/Building_MUM_HQ/Floor_2
    AP_Group: MUM-HQ-F2
    RF_Profile: Corporate-RF
    # ...
```

### 4.8.4 WLC Configuration Verification

```cisco
! On WLC - Verify Fabric Configuration
show wireless fabric summary

! Expected output:
! Fabric Status: Enabled
! Control Plane: MUM-CP-01 (10.250.1.3), MUM-CP-02 (10.250.1.4)

! Verify SSID to VN mapping
show wireless profile fabric detailed Corp_Fabric_Profile

! Verify AP fabric status
show ap summary
show ap name AP-MUM-F1-01 config general

! Verify client SGT assignment
show wireless client mac-address xxxx.xxxx.xxxx detail | include SGT
```

---

## 4.8.5 SD-WAN Handoff Implementation

**Note**: This section covers the SD-Access to SD-WAN integration points. Full SD-WAN deployment (vManage, vSmart, vBond, transport policies) is covered in a separate project document.

### 4.8.5.1 SD-WAN Deployment Coordination

The SD-WAN deployment runs in parallel with SD-Access. The following milestones must be coordinated:

| SD-Access Milestone | SD-WAN Milestone | Coordination |
|---------------------|------------------|--------------|
| Phase 1: DNAC/ISE deployed | vManage/vSmart/vBond deployed | Joint infrastructure validation |
| Phase 2: Mumbai pilot fabric | Mumbai SD-WAN edge (cEdge) | Handoff testing |
| Phase 3: Hub fabric sites | Hub SD-WAN edges | Per-site cutover coordination |
| Phase 4: Branch fabric sites | Branch SD-WAN edges | Combined branch migration |
| Phase 5: Optimization | Transport optimization | End-to-end path validation |

### 4.8.5.2 Border-to-SD-WAN Physical Connectivity

**Hub Site Handoff Cabling**

| Hub Site | Fabric Border | Interface | SD-WAN Edge | Interface | Cable |
|----------|---------------|-----------|-------------|-----------|-------|
| Mumbai | MUM-BN-01 | Te1/0/48 | MUM-SDWAN-01 | Gi0/0/0 | 10G DAC |
| Mumbai | MUM-BN-02 | Te1/0/48 | MUM-SDWAN-02 | Gi0/0/0 | 10G DAC |
| Chennai | CHN-BN-01 | Te1/0/48 | CHN-SDWAN-01 | Gi0/0/0 | 10G DAC |
| Chennai | CHN-BN-02 | Te1/0/48 | CHN-SDWAN-02 | Gi0/0/0 | 10G DAC |
| London | LON-BN-01 | Te1/0/48 | LON-SDWAN-01 | Gi0/0/0 | 10G DAC |
| London | LON-BN-02 | Te1/0/48 | LON-SDWAN-02 | Gi0/0/0 | 10G DAC |
| Frankfurt | FRA-BN-01 | Te1/0/48 | FRA-SDWAN-01 | Gi0/0/0 | 10G DAC |
| Frankfurt | FRA-BN-02 | Te1/0/48 | FRA-SDWAN-02 | Gi0/0/0 | 10G DAC |
| New Jersey | NJ-BN-01 | Te1/0/48 | NJ-SDWAN-01 | Gi0/0/0 | 10G DAC |
| New Jersey | NJ-BN-02 | Te1/0/48 | NJ-SDWAN-02 | Gi0/0/0 | 10G DAC |
| Dallas | DAL-BN-01 | Te1/0/48 | DAL-SDWAN-01 | Gi0/0/0 | 10G DAC |
| Dallas | DAL-BN-02 | Te1/0/48 | DAL-SDWAN-02 | Gi0/0/0 | 10G DAC |

### 4.8.5.3 Border Node Handoff Configuration

**Step 1: Create Handoff VLANs on Border Node**

```cisco
! Border Node SD-WAN Handoff Configuration
! Example: MUM-BN-01

! Create handoff VLANs (one per VN/VRF)
vlan 3001
 name SDWAN-HANDOFF-CORPORATE
vlan 3002
 name SDWAN-HANDOFF-GUEST
vlan 3003
 name SDWAN-HANDOFF-IOT
vlan 3004
 name SDWAN-HANDOFF-SERVERS
vlan 3005
 name SDWAN-HANDOFF-VOICE

! Trunk to SD-WAN Edge
interface TenGigabitEthernet1/0/48
 description TO-MUM-SDWAN-01
 switchport mode trunk
 switchport trunk allowed vlan 3001-3005
 no shutdown
```

**Step 2: Create Handoff SVIs**

```cisco
! Handoff SVI - Corporate VN
interface Vlan3001
 description SDWAN-HANDOFF-VN_CORPORATE
 vrf forwarding VN_CORPORATE
 ip address 10.240.1.2 255.255.255.252
 no shutdown

! Handoff SVI - Guest VN  
interface Vlan3002
 description SDWAN-HANDOFF-VN_GUEST
 vrf forwarding VN_GUEST
 ip address 10.240.2.2 255.255.255.252
 no shutdown

! Handoff SVI - IoT VN
interface Vlan3003
 description SDWAN-HANDOFF-VN_IOT
 vrf forwarding VN_IOT
 ip address 10.240.3.2 255.255.255.252
 no shutdown

! Handoff SVI - Servers VN
interface Vlan3004
 description SDWAN-HANDOFF-VN_SERVERS
 vrf forwarding VN_SERVERS
 ip address 10.240.4.2 255.255.255.252
 no shutdown

! Handoff SVI - Voice VN
interface Vlan3005
 description SDWAN-HANDOFF-VN_VOICE
 vrf forwarding VN_VOICE
 ip address 10.240.5.2 255.255.255.252
 no shutdown
```

**Step 3: Configure BGP Peering with SD-WAN Edge**

```cisco
! BGP Configuration for SD-WAN Handoff
router bgp 65001
 !
 ! Corporate VN peering
 address-family ipv4 vrf VN_CORPORATE
  redistribute lisp metric 100
  neighbor 10.240.1.1 remote-as 65100
  neighbor 10.240.1.1 description MUM-SDWAN-01-CORP
  neighbor 10.240.1.1 activate
  neighbor 10.240.1.1 send-community both
  neighbor 10.240.1.1 route-map FABRIC-TO-SDWAN out
  neighbor 10.240.1.1 route-map SDWAN-TO-FABRIC in
 exit-address-family
 !
 ! Guest VN peering
 address-family ipv4 vrf VN_GUEST
  redistribute lisp metric 100
  neighbor 10.240.2.1 remote-as 65100
  neighbor 10.240.2.1 description MUM-SDWAN-01-GUEST
  neighbor 10.240.2.1 activate
 exit-address-family
 !
 ! IoT VN peering
 address-family ipv4 vrf VN_IOT
  redistribute lisp metric 100
  neighbor 10.240.3.1 remote-as 65100
  neighbor 10.240.3.1 description MUM-SDWAN-01-IOT
  neighbor 10.240.3.1 activate
 exit-address-family
 !
 ! Servers VN peering
 address-family ipv4 vrf VN_SERVERS
  redistribute lisp metric 100
  neighbor 10.240.4.1 remote-as 65100
  neighbor 10.240.4.1 description MUM-SDWAN-01-SRV
  neighbor 10.240.4.1 activate
 exit-address-family
 !
 ! Voice VN peering
 address-family ipv4 vrf VN_VOICE
  redistribute lisp metric 100
  neighbor 10.240.5.1 remote-as 65100
  neighbor 10.240.5.1 description MUM-SDWAN-01-VOICE
  neighbor 10.240.5.1 activate
 exit-address-family

! Route maps for prefix filtering
route-map FABRIC-TO-SDWAN permit 10
 match ip address prefix-list FABRIC-PREFIXES
 set community 65001:100
 
route-map SDWAN-TO-FABRIC permit 10
 match community SDWAN-ROUTES
 set local-preference 200

ip prefix-list FABRIC-PREFIXES seq 10 permit 10.100.0.0/16 le 24
ip prefix-list FABRIC-PREFIXES seq 20 permit 10.150.0.0/16 le 24
ip prefix-list FABRIC-PREFIXES seq 30 permit 10.190.0.0/16 le 24
ip prefix-list FABRIC-PREFIXES seq 40 permit 10.200.0.0/16 le 24
```

### 4.8.5.4 SD-WAN Edge Configuration (Reference)

**Note**: Full SD-WAN edge configuration is managed via vManage templates. This shows the handoff-side interface configuration for reference.

```cisco
! SD-WAN Edge (cEdge) - Handoff Interface Configuration
! Example: MUM-SDWAN-01 (ISR 4451 in cEdge mode)

! Service-side interface to Fabric Border
interface GigabitEthernet0/0/0
 description TO-MUM-BN-01
 no shutdown

interface GigabitEthernet0/0/0.3001
 description HANDOFF-VN_CORPORATE
 encapsulation dot1Q 3001
 vrf forwarding 10
 ip address 10.240.1.1 255.255.255.252

interface GigabitEthernet0/0/0.3002
 description HANDOFF-VN_GUEST
 encapsulation dot1Q 3002
 vrf forwarding 40
 ip address 10.240.2.1 255.255.255.252

interface GigabitEthernet0/0/0.3003
 description HANDOFF-VN_IOT
 encapsulation dot1Q 3003
 vrf forwarding 50
 ip address 10.240.3.1 255.255.255.252

! Transport interfaces (MPLS + Internet)
interface GigabitEthernet0/0/1
 description MPLS-TRANSPORT
 ip address dhcp
 tunnel-interface
  encapsulation ipsec
  color mpls
  allow-service all
  no allow-service bgp

interface GigabitEthernet0/0/2
 description INTERNET-TRANSPORT
 ip address dhcp
 tunnel-interface
  encapsulation ipsec
  color biz-internet
  allow-service all
```

### 4.8.5.5 Branch Fabric-in-a-Box SD-WAN Integration

For branch sites with Fabric-in-a-Box deployment:

```cisco
! Branch Fabric-in-a-Box to SD-WAN Edge Handoff
! Example: BLR-FIAB-01 (C9300-48UXM) to BLR-SDWAN-01 (ISR 4331)

! FiaB Border handoff interface
interface TenGigabitEthernet1/1/1
 description TO-BLR-SDWAN-01
 switchport mode trunk
 switchport trunk allowed vlan 3001-3003

! Handoff SVIs (simplified - Corporate, Guest, IoT only)
interface Vlan3001
 vrf forwarding VN_CORPORATE
 ip address 10.240.101.2 255.255.255.252
 
interface Vlan3002
 vrf forwarding VN_GUEST
 ip address 10.240.102.2 255.255.255.252

interface Vlan3003
 vrf forwarding VN_IOT
 ip address 10.240.103.2 255.255.255.252

! BGP to SD-WAN edge
router bgp 65001
 address-family ipv4 vrf VN_CORPORATE
  neighbor 10.240.101.1 remote-as 65100
  neighbor 10.240.101.1 activate
  redistribute lisp
 exit-address-family
```

### 4.8.5.6 SD-WAN Handoff Validation

**Pre-Cutover Validation Checklist**

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Physical link | `show interface Te1/0/48` | Line up, protocol up |
| Trunk VLANs | `show interface trunk` | VLANs 3001-3005 allowed |
| SVI status | `show ip interface brief | inc Vlan300` | All SVIs up/up |
| BGP neighbor | `show bgp vpnv4 unicast all summary` | Neighbors established |
| Route exchange | `show ip route vrf VN_CORPORATE` | SD-WAN routes present |
| Ping test | `ping vrf VN_CORPORATE 10.240.1.1` | Success |

**Post-Cutover Validation**

```cisco
! Verify BGP adjacency
show bgp vpnv4 unicast all summary
! All SD-WAN neighbors should show state "Established"

! Verify route exchange - Fabric to SD-WAN
show ip route vrf VN_CORPORATE bgp
! Should see routes to remote sites via SD-WAN edge

! Verify route exchange - SD-WAN to Fabric
show ip route vrf VN_CORPORATE lisp
! Should see local fabric subnets

! End-to-end connectivity test
! From Mumbai client to Chennai server (via SD-WAN):
ping 10.100.2.100 source 10.100.1.10
traceroute 10.100.2.100 source 10.100.1.10
! Verify path goes through SD-WAN edge
```

### 4.8.5.7 SD-WAN Cutover Sequence

**Per-Site SD-WAN Cutover (Coordinated with SD-WAN Team)**

| Step | Time | Activity | Owner |
|------|------|----------|-------|
| 1 | T-60 min | Final backup of fabric border config | Network |
| 2 | T-45 min | Verify SD-WAN edge ready (vManage) | SD-WAN |
| 3 | T-30 min | Connect handoff cables | Network |
| 4 | T-15 min | Configure handoff VLANs/SVIs | Network |
| 5 | T-0 | Enable BGP peering | Network + SD-WAN |
| 6 | T+5 min | Verify BGP established | Both |
| 7 | T+10 min | Verify route exchange | Both |
| 8 | T+15 min | Test inter-site connectivity | Both |
| 9 | T+30 min | Monitor for 30 minutes | Both |
| 10 | T+60 min | Declare cutover complete | PM |

**Rollback Trigger Criteria**

- BGP not establishing after 15 minutes
- Route exchange incomplete after 20 minutes
- Inter-site connectivity failures >10%
- Voice quality degradation (MOS <3.5)
- Business-critical application failures

**Rollback Procedure**

```cisco
! Emergency rollback - revert to legacy MPLS
! Step 1: Disable BGP to SD-WAN edge
router bgp 65001
 address-family ipv4 vrf VN_CORPORATE
  neighbor 10.240.1.1 shutdown
 exit-address-family

! Step 2: Re-enable legacy MPLS BGP
 address-family ipv4 vrf VN_CORPORATE
  neighbor 10.240.1.5 remote-as 65000
  neighbor 10.240.1.5 activate
 exit-address-family

! Step 3: Verify legacy routing restored
show ip route vrf VN_CORPORATE
```

---

## 4.9 Testing and Validation

### 4.9.1 Test Categories

| Category | Tests | Pass Criteria |
|----------|-------|---------------|
| Infrastructure | DNAC/ISE health, cluster status | All services running |
| Underlay | IS-IS adjacency, BFD, MTU | Full mesh connectivity |
| Overlay | LISP registration, VXLAN tunnels | All nodes registered |
| Authentication | 802.1X, MAB, profiling | 95%+ success rate |
| Segmentation | SGT assignment, SGACL | Correct policy enforcement |
| Wireless | Client association, roaming | <50ms roam time |
| Failover | Node failure, WAN failover | <30 second recovery |

### 4.9.2 Infrastructure Validation

```bash
# DNAC Health Check
curl -k -u admin:<password> \
  https://dnac.corp.local/dna/intent/api/v1/network-health

# Expected response:
{
  "response": {
    "healthScore": 95,
    "totalCount": 854,
    "healthyCount": 850,
    "unhealthyCount": 4
  }
}

# ISE Health Check
# GUI: Operations > System Operations > System Summary
# CLI:
ssh admin@ise-pan-nj.corp.local
show application status ise
# All services should show "running"
```

### 4.9.3 Underlay Validation Tests

```cisco
! Test 1: IS-IS Adjacency Verification
show isis neighbors
! All expected neighbors should show "UP" state

! Test 2: Full Loopback Reachability
! From Border Node:
ping 10.250.1.1 source Loopback0  ! Self
ping 10.250.1.2 source Loopback0  ! Border-2
ping 10.250.1.3 source Loopback0  ! CP-1
ping 10.250.1.4 source Loopback0  ! CP-2
ping 10.250.1.5 source Loopback0  ! Edge-1
! ... continue for all nodes

! Test 3: BFD Session Verification
show bfd neighbors
! All BFD sessions should show "Up"

! Test 4: MTU Verification (jumbo frames)
ping 10.250.1.3 source Loopback0 size 9000 df-bit
! Should succeed (MTU 9100+ required for VXLAN)

! Test 5: Convergence Test
! Shut one uplink and verify reconvergence
interface TenGigabitEthernet1/0/1
 shutdown
! Verify traffic failover within 1 second
! Restore link
 no shutdown
```

### 4.9.4 Overlay Validation Tests

```cisco
! Test 1: LISP Registration
show lisp site
! All edge nodes should be registered

! Test 2: LISP Map-Cache
show lisp instance-id 8001 ipv4 map-cache
! Should show EID-to-RLOC mappings

! Test 3: VXLAN Tunnel Verification
show vxlan tunnel
! All VXLAN tunnels should be "UP"

! Test 4: Anycast Gateway
show ip interface brief | include BDI
! BDI interfaces should be up with anycast IPs

! Test 5: VRF Verification
show vrf
! All VNs should appear as VRFs

! Test 6: Cross-fabric Communication
! From host on Edge-1, ping host on Edge-2
ping 10.100.1.100 source 10.100.1.50
! Should succeed via VXLAN overlay
```

### 4.9.5 Authentication Validation Tests

```bash
# Test 1: 802.1X Authentication
# Connect test laptop with certificate
# On switch:
show authentication sessions interface Gi1/0/10 details
# Should show:
# - Method: dot1x
# - User-Name: user@corp.local
# - SGT: 10 (Employees)

# Test 2: MAB Authentication
# Connect unmanaged device (printer)
show authentication sessions interface Gi1/0/20 details
# Should show:
# - Method: mab
# - MAC: xxxx.xxxx.xxxx
# - SGT: 30 (Printers)

# Test 3: ISE Live Logs
# On ISE: Operations > RADIUS > Live Logs
# Verify successful authentications

# Test 4: Profiling Verification
# On ISE: Context Visibility > Endpoints
# Verify device profiled correctly
```

### 4.9.6 Segmentation Validation Tests

```bash
# Test 1: SGT Assignment Verification
show cts role-based sgt-map all
# Verify IP-to-SGT bindings

# Test 2: SGACL Policy Verification
show cts role-based permissions
# Verify SGACL policies downloaded

# Test 3: Traffic Enforcement
# From Employee (SGT 10) endpoint:
ping <server_ip>        # Should succeed (SGT 80)
ping <guest_endpoint>   # Should fail (SGT 40 blocked)

# Test 4: SXP Verification (if using)
show cts sxp connections
# SXP connections should be "On"
```

### 4.9.7 Wireless Validation Tests

```bash
# Test 1: Client Association
# Connect wireless client to Corp-Secure
show wireless client summary
# Verify client connected and authenticated

# Test 2: SGT Assignment (Wireless)
show wireless client mac-address xxxx.xxxx.xxxx detail | include SGT
# Should show correct SGT

# Test 3: Roaming Test
# Move client between APs
show wireless client mac-address xxxx.xxxx.xxxx mobility history
# Verify roam time <50ms

# Test 4: Fabric Data Path
# Verify traffic uses local switching (not centralized)
show wireless client mac-address xxxx.xxxx.xxxx detail | include Data Path
# Should show "Fabric"
```

### 4.9.8 Failover Validation Tests

```bash
# Test 1: Control Plane Failover
# On CP-1:
reload
# Verify fabric continues to operate via CP-2
# Monitor host connectivity during failover
# Recovery time should be <30 seconds

# Test 2: Border Node Failover
# On Border-1:
reload
# Verify external connectivity via Border-2
# Monitor WAN traffic during failover

# Test 3: PSN Failover
# Shut down PSN-1 in region
# Verify authentications continue via PSN-2
# Check ISE: Operations > RADIUS > Live Logs

# Test 4: WLC HA Failover (if HA pair)
# On Primary WLC:
redundancy force-switchover
# Verify AP and client continuity
# Recovery time should be <60 seconds
```

### 4.9.9 User Acceptance Testing (UAT)

| Test Case | Scenario | Expected Result | Status |
|-----------|----------|-----------------|--------|
| UAT-001 | Employee wired login | Authenticated, SGT 10, full access | [ ] |
| UAT-002 | Employee wireless login | Authenticated, SGT 10, roaming works | [ ] |
| UAT-003 | Guest wireless access | Captive portal, SGT 40, internet only | [ ] |
| UAT-004 | IP phone registration | Profiled, SGT 20, voice quality good | [ ] |
| UAT-005 | Printer discovery | Profiled, SGT 30, printing works | [ ] |
| UAT-006 | IoT device onboarding | MAC auth, SGT 50, limited access | [ ] |
| UAT-007 | Non-compliant device | Quarantine VLAN, SGT 999 | [ ] |
| UAT-008 | Cross-site communication | VXLAN overlay, <100ms latency | [ ] |
| UAT-009 | Application access | All business apps functional | [ ] |
| UAT-010 | Video conferencing | Voice/video quality acceptable | [ ] |

---

## 4.10 Go-Live Cutover Runbook

### 4.10.1 Pre-Cutover Checklist

| Item | Owner | Status | Sign-off |
|------|-------|--------|----------|
| All test cases passed | QA Lead | [ ] | _______ |
| Rollback plan documented | Network Lead | [ ] | _______ |
| Support teams on standby | Operations | [ ] | _______ |
| Change ticket approved | Change Manager | [ ] | _______ |
| Communication sent to users | Comms Lead | [ ] | _______ |
| Backup configs verified | Network Lead | [ ] | _______ |
| Monitoring dashboards ready | NOC | [ ] | _______ |

### 4.10.2 Cutover Schedule (Per Site)

```
SITE CUTOVER: MUMBAI HQ
Date: [Cutover Date]
Time: 22:00 - 06:00 IST (Off-peak hours)

+--------+--------+------------------------------------------------+----------+
| Time   | Phase  | Activity                                       | Owner    |
+--------+--------+------------------------------------------------+----------+
| 22:00  | Prep   | Team assembly, bridge open                     | PM       |
| 22:15  | Prep   | Final backup of legacy configs                 | Network  |
| 22:30  | Prep   | Verify DNAC/ISE health                         | Network  |
| 22:45  | Prep   | Pre-cutover validation tests                   | QA       |
| 23:00  | Start  | Begin Floor 1 migration                        | Network  |
| 23:15  | Exec   | Enable 802.1X on Floor 1 Edge switches         | Network  |
| 23:30  | Test   | Validate Floor 1 user authentication           | QA       |
| 23:45  | Exec   | Enable fabric on Floor 1 (VNs, SGTs)           | Network  |
| 00:00  | Test   | Full Floor 1 validation                        | QA       |
| 00:15  | Exec   | Begin Floor 2 migration                        | Network  |
| 00:45  | Test   | Full Floor 2 validation                        | QA       |
| 01:00  | Exec   | Begin Floor 3 migration                        | Network  |
| 01:30  | Test   | Full Floor 3 validation                        | QA       |
| 02:00  | Exec   | Begin Floor 4 migration                        | Network  |
| 02:30  | Test   | Full Floor 4 validation                        | QA       |
| 03:00  | Exec   | Begin Floor 5-6 migration                      | Network  |
| 03:30  | Test   | Full Floor 5-6 validation                      | QA       |
| 04:00  | Exec   | Migrate wireless to fabric                     | Wireless |
| 04:30  | Test   | Full wireless validation                       | QA       |
| 05:00  | Test   | End-to-end validation                          | QA       |
| 05:30  | Comm   | Success notification / Rollback decision       | PM       |
| 06:00  | Close  | Cutover complete, hypercare begins             | All      |
+--------+--------+------------------------------------------------+----------+
```

### 4.10.3 Floor Migration Procedure

**Step 1: Pre-Migration (per floor)**

```bash
# Verify current state
show running-config interface range Gi1/0/1-48
show authentication sessions
show mac address-table dynamic

# Document baseline
# Save outputs to cutover log
```

**Step 2: Enable Fabric Configuration**

```bash
# From DNAC: Provision > Fabric Sites > [Mumbai] > [Floor]
# Enable Host Onboarding for floor edge switches

# DNAC pushes:
# - LISP configuration
# - VXLAN interfaces
# - VN/VLAN mappings
# - 802.1X configuration

# Monitor provisioning status
# Wait for "Success" status
```

**Step 3: Validate Floor Migration**

```bash
# On edge switch:
show authentication sessions
# Verify users authenticated with correct SGT

show lisp site
# Verify edge registered to control plane

show vxlan tunnel
# Verify VXLAN tunnels established

# Test user connectivity
ping <test_server> from user workstation
# Verify application access
```

**Step 4: Rollback Procedure (if needed)**

```bash
# From DNAC: Provision > Fabric Sites > [Mumbai] > [Floor]
# Disable Host Onboarding

# Or manual CLI:
# Remove fabric configuration
no lisp instance-id 8001
no vlan configuration <fabric_vlans>

# Restore legacy configuration from backup
configure replace flash:backup-config.txt

# Verify legacy operation restored
show vlan brief
show spanning-tree summary
```

### 4.10.4 Post-Cutover Validation

```bash
# Comprehensive validation checklist

# 1. Authentication
show authentication sessions | count
# Compare to pre-cutover baseline

# 2. Network Health (DNAC)
# Assurance > Network Health
# Score should be >90%

# 3. Client Health (DNAC)
# Assurance > Client Health
# Wireless and Wired clients healthy

# 4. Application Health
# Verify critical applications accessible
# Test: Email, ERP, CRM, File shares

# 5. Voice Quality
# Test phone calls
# Check DSCP marking preserved

# 6. Security Policy
show cts role-based permissions
# Verify SGACLs active
```

---

## 4.11 Rollback Procedures

### 4.11.1 Rollback Decision Matrix

| Issue | Severity | Impact | Rollback Trigger |
|-------|----------|--------|------------------|
| >25% users cannot authenticate | Critical | Business impact | Immediate rollback |
| Voice quality degraded | High | Communication impact | Rollback if >15 min |
| Single floor issues | Medium | Limited impact | Floor-level rollback |
| Minor issues, workaround available | Low | Minimal impact | Continue, fix forward |

### 4.11.2 Full Site Rollback Procedure

```
FULL ROLLBACK PROCEDURE - MUMBAI

Step 1: Declare Rollback (PM Decision)
        Time: T+0
        
Step 2: Notify Stakeholders
        Time: T+5 minutes
        - Send rollback notification
        - Update bridge call
        
Step 3: Disable Fabric on All Edge Nodes
        Time: T+10 minutes
        # From DNAC: Provision > Fabric Sites > Mumbai
        # Disable Host Onboarding (all floors)
        
Step 4: Restore Legacy Switch Configuration
        Time: T+20 minutes
        # For each edge switch:
        configure replace flash:pre-cutover-backup.txt
        
Step 5: Verify Legacy Operation
        Time: T+40 minutes
        show vlan brief
        show spanning-tree summary
        show mac address-table dynamic
        
Step 6: User Validation
        Time: T+50 minutes
        - Test user authentication
        - Test application access
        - Test voice quality
        
Step 7: Rollback Complete
        Time: T+60 minutes
        - Confirm all users operational
        - Schedule post-mortem
        - Plan remediation
```

### 4.11.3 Partial Rollback (Single Floor)

```bash
# Floor-level rollback if issues isolated to one floor

# Step 1: Identify affected floor edge switches
# Example: MUM-ED-01, MUM-ED-02 (Floor 1)

# Step 2: Disable fabric on affected switches only
# DNAC: Provision > Inventory > [MUM-ED-01] > Actions > Delete from Fabric Site

# Step 3: Restore legacy configuration
configure terminal
 interface range GigabitEthernet1/0/1-48
  switchport mode access
  switchport access vlan 100
  no authentication port-control auto
  no dot1x pae authenticator
  no mab

# Step 4: Verify floor operation
show vlan brief
show interface status

# Other floors continue on fabric
```

### 4.11.4 Rollback Configuration Backup

```bash
# Pre-cutover backup script (run on all devices)

#!/bin/bash
# backup_configs.sh

DEVICES="MUM-ED-01 MUM-ED-02 MUM-ED-03 ..."
DATE=$(date +%Y%m%d)

for device in $DEVICES; do
  ssh netadmin@$device "show running-config" > backup/${device}_${DATE}.txt
  ssh netadmin@$device "copy running-config flash:pre-cutover-backup.txt"
done

# Verify backups
ls -la backup/
```

---

## 4.12 Post-Implementation Validation

### 4.12.1 Hypercare Period

| Phase | Duration | Focus | Staffing |
|-------|----------|-------|----------|
| Hypercare Week 1 | 7 days | Critical issue resolution | 24×7 on-call |
| Hypercare Week 2 | 7 days | Performance optimization | 16×7 coverage |
| Stabilization | 14 days | Knowledge transfer | Business hours |
| Transition to BAU | 7 days | Handover to operations | Business hours |

### 4.12.2 Hypercare Monitoring Dashboard

```yaml
# DNAC Assurance Dashboard - Key Metrics

Network_Health:
  Target: >95%
  Current: [Real-time]
  Trend: [Hourly graph]

Client_Health:
  Wired_Target: >98%
  Wireless_Target: >95%
  Current: [Real-time]

Application_Health:
  Critical_Apps: [List with status]
  Response_Time: <200ms target

Authentication_Metrics:
  Success_Rate: >99%
  Avg_Auth_Time: <500ms
  Failed_Authentications: [Count, trend]

Fabric_Health:
  LISP_Registrations: [Count]
  VXLAN_Tunnels: [Status]
  SGT_Assignments: [Distribution]
```

### 4.12.3 Issue Tracking Template

| Ticket ID | Severity | Issue Description | Root Cause | Resolution | Status |
|-----------|----------|-------------------|------------|------------|--------|
| INC-001 | P2 | User auth failure Floor 2 | RADIUS timeout | Increased timeout | Closed |
| INC-002 | P3 | Slow app response | QoS misconfiguration | Applied correct DSCP | Closed |
| INC-003 | P2 | Wireless roaming delay | WLC config | Optimized roaming parameters | Open |

### 4.12.4 Documentation Handover

| Document | Description | Owner | Status |
|----------|-------------|-------|--------|
| Network Diagram (as-built) | Updated topology with all IPs | Network Lead | [ ] |
| Configuration Standards | Standard configs for all node types | Network Lead | [ ] |
| Operational Runbook | Day-to-day procedures | Operations | [ ] |
| Troubleshooting Guide | Common issues and resolution | Network Lead | [ ] |
| Escalation Matrix | Support contacts and SLAs | PM | [ ] |
| Training Materials | Admin training documentation | Training Lead | [ ] |

### 4.12.5 Training Plan

| Course | Audience | Duration | Delivery |
|--------|----------|----------|----------|
| DNAC Administration | Network Admins | 3 days | Instructor-led |
| ISE Administration | Security Team | 3 days | Instructor-led |
| SD-Access Operations | NOC Team | 2 days | Hands-on lab |
| Troubleshooting Workshop | Network Engineers | 2 days | Hands-on lab |
| Executive Dashboard Review | Management | 1 hour | Presentation |

### 4.12.6 Go-Live Sign-Off

```
+------------------------------------------------------------------+
|                    GO-LIVE ACCEPTANCE SIGN-OFF                    |
+------------------------------------------------------------------+
| Project: DNAC/ISE SD-Access Migration                             |
| Site: Mumbai HQ                                                   |
| Cutover Date: [Date]                                              |
+------------------------------------------------------------------+

| Criteria                          | Result    | Sign-off          |
|-----------------------------------|-----------|-------------------|
| All test cases passed             | [Pass/Fail] | ________________|
| Network health >95%               | [Pass/Fail] | ________________|
| User authentication >99%          | [Pass/Fail] | ________________|
| Critical applications operational | [Pass/Fail] | ________________|
| Voice quality acceptable          | [Pass/Fail] | ________________|
| No P1/P2 open issues              | [Pass/Fail] | ________________|
| Documentation complete            | [Pass/Fail] | ________________|
| Operations team trained           | [Pass/Fail] | ________________|

Approved for Production:

Network Lead: __________________ Date: __________
Security Lead: _________________ Date: __________
Operations Lead: _______________ Date: __________
Project Manager: _______________ Date: __________
Business Owner: ________________ Date: __________
+------------------------------------------------------------------+
```

---

## Summary

Chapter 4 provides comprehensive implementation procedures for the SD-Access migration, covering:

1. **Deployment Strategy**: 5-phase approach over 40 weeks with defined exit criteria
2. **Pre-Deployment**: Complete checklist of infrastructure, software, and credential prerequisites
3. **DNAC Installation**: 3-node cluster deployment with HA and DR configuration
4. **ISE Deployment**: Distributed deployment with PAN HA and regional PSN pairs
5. **Underlay Provisioning**: IS-IS configuration with BFD and authentication
6. **Fabric Configuration**: Site hierarchy, VNs, SGTs, and IP pools
7. **Node Provisioning**: Border, CP, and Edge node configuration via DNAC
8. **Wireless Integration**: WLC fabric enablement and SSID-to-VN mapping
9. **Testing**: Comprehensive validation covering all fabric components
10. **Go-Live**: Detailed cutover runbook with hour-by-hour schedule
11. **Rollback**: Decision matrix and procedures for full/partial rollback
12. **Post-Implementation**: Hypercare, monitoring, and handover procedures

**Next Chapter**: Chapter 5 covers Day-2 Operations and Monitoring procedures.

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
