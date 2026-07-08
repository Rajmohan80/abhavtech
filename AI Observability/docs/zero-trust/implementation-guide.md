# Zero Trust Implementation Guide

**Phase:** Phase 1 (16 Weeks) | **Companion to:** Document 1  
**Purpose:** Detailed implementation procedures, sizing, hardware specifications, deployment, and real-world examples

---


## PRICING DISCLAIMER

**IMPORTANT:** All pricing information in this document is for **ILLUSTRATIVE PURPOSES ONLY** and should not be used for budget planning or procurement decisions.

**Key Points:**
- Prices shown are example values to demonstrate cost structure and procurement methodology
- Actual pricing varies based on:
  - Vendor negotiations and enterprise agreements
  - Regional pricing differences
  - Volume discounts and multi-year commitments
  - Current market conditions
  - Licensing model changes (subscription vs perpetual)
- **Action Required:** Contact vendors directly for current pricing quotes before procurement
- **Vendors:**
  - Cisco XDR/SecureX: Contact Cisco account executive or cisco.com
  - Cisco FTD/FMC: Contact Cisco partner for firewall licensing
  - Duo Security: Contact Cisco Duo sales or duo.com
  - Cisco Umbrella: Contact Cisco or umbrella.cisco.com

**Recommendation:** Use this document's sizing methodology and technical specifications to create RFP/RFQ documents, then obtain current pricing from vendors.

---

## 1. XDR/SECUREX PLATFORM - DETAILED IMPLEMENTATION

### 1.1 SecureX Account Setup & Configuration

#### 1.1.1 Account Provisioning

**Phase 1A Week 1 Day 1-2: SecureX Account Creation**

**Prerequisites:**
- Cisco CCO (Cisco.com) account with admin privileges
- Valid Cisco Smart Account
- Email domain verified (e.g., @abhavtech.com)

**Step 1: Access SecureX Portal**

```bash
# Navigate to SecureX portal
URL: https://sign-on.security.cisco.com

# Login with CCO credentials
Username: admin@abhavtech.com
Password: [Duo-protected CCO password]
```

**Step 2: Create SecureX Organization**

```
# SecureX Portal  to  Organizations  to  Create Organization

Organization Name: Abhavtech
Organization ID: abhavtech-prod
Region: United States (us.security.cisco.com)
Time Zone: Asia/Kolkata (IST)

# Primary Contact:
Name: Raj Kumar
Email: raj.kumar@abhavtech.com
Phone: +91-XX-XXXX-XXXX

# Security Settings:
☑ Require MFA for all users
☑ Enable API access
☑ Enable webhook notifications
Session Timeout: 30 minutes
Password Policy: Strong (12+ chars, complexity required)
```

**Step 3: Configure Organization Settings**

```
# Settings  to  General

# Email Notifications:
Incident Alerts: noc@abhavtech.com, security-ops@abhavtech.com
System Alerts: infrastructure@abhavtech.com
Daily Digest: Enabled (send at 09:00 IST)

# Webhook Integration:
Webhook URL: https://abhavtech-securex-webhook.azurewebsites.net/api/alerts
Authentication: Bearer Token
Token: [Generate from Azure Functions]
Events: Incidents (Critical/High), Casebook Updates, Workflow Executions

# API Settings:
API Access: Enabled
Rate Limit: 300 requests/minute
API Documentation: https://developer.cisco.com/securex
```

**Step 4: Create API Credentials**

```
# Settings  to  API Clients  to  Create API Client

Client Name: Abhavtech-Automation
Description: API access for automation scripts (Ansible, Python)
Scope: 
  ☑ Read incidents
  ☑ Create/update incidents
  ☑ Execute workflows
  ☑ Query threat intelligence
  ☑ Manage configurations

# Output (save securely in CyberArk):
Client ID: ctr-client-abc123def456
Client Secret: [64-character secret]
API Base URL: https://visibility.us.amp.cisco.com
```

**Step 5: Verify Account Setup**

```bash
# Test API access with curl
curl -X GET \
  https://visibility.us.amp.cisco.com/iroh/iroh-inspect/inspect \
  -H "Authorization: Bearer $(echo -n 'ctr-client-abc123def456:CLIENT_SECRET' | base64)" \
  -H "Content-Type: application/json"

# Expected response:
{
  "status": "ok",
  "version": "1.0",
  "services": {
    "amp": "available",
    "umbrella": "available",
    "threat_grid": "available"
  }
}
```

---

### 1.2 Ribbon Integration Configuration

#### 1.2.1 ISE pxGrid Ribbon Configuration

**Phase 1A Week 1 Day 3: ISE Integration**

**Step 1: Enable pxGrid in ISE**

```bash
# ISE Primary PAN: 10.252.1.20
# SSH to ISE node
ssh admin@10.252.1.20

# Enable pxGrid (if not already enabled)
conf t
pxgrid enable

# Verify pxGrid status
show application status ise
# Expected: pxGrid Service: running
```

**Step 2: Generate pxGrid Certificate for SecureX**

```
# ISE GUI  to  Administration  to  pxGrid Services  to  Certificates

# Generate New Certificate:
Common Name (CN): securex-client.abhavtech.local
Subject Alternative Names: 
  - DNS: securex.abhavtech.local
  - IP: 10.252.1.25 (if using static IP for SecureX connector)
Certificate Template: pxGrid Client Certificate
Key Size: 2048 bits
Valid For: 365 days

# Download:
☑ Certificate (PEM format): securex-client.pem
☑ Private Key: securex-client-key.pem
☑ Root CA Certificate: ise-root-ca.pem

# Save to secure location (will upload to SecureX)
```

**Step 3: Configure ISE Ribbon in SecureX**

```
# SecureX Dashboard  to  Modules  to  Available Modules  to  ISE  to  Add Module

Module Name: ISE-Abhavtech-Primary
Description: Abhavtech ISE 14-node cluster (primary PAN)

# Connection Settings:
ISE Server: 10.252.1.20
Port: 8910 (pxGrid WebSocket)
Protocol: wss:// (WebSocket Secure)

# Authentication:
Method: Certificate-based (pxGrid)
Upload Files:
  - Client Certificate: securex-client.pem
  - Client Key: securex-client-key.pem
  - CA Certificate: ise-root-ca.pem

# pxGrid Settings:
Subscribe to Topics:
  ☑ Session Directory (real-time user sessions)
  ☑ Endpoint Asset (device inventory)
  ☑ TrustSec Metadata (SGT assignments)
  ☑ Radius Failure (authentication failures)
Poll Interval: Real-time (WebSocket push)

# Test Connection:
[Click "Test Connection"]
# Expected: ✅ Connected to ISE pxGrid successfully
#           Retrieved 1,247 active sessions
#           Retrieved 3,456 endpoints
```

**Step 4: Validate ISE Data Flow**

```
# SecureX  to  Investigate  to  Search
# Query: "source:ise"

# Expected Results (sample):
Event Type: Session Start
User: john.doe@abhavtech.com
MAC: 00:50:56:AB:CD:EF
IP: 10.252.2.45
SGT: 15 (Employee)
Auth Method: 802.1X (EAP-TLS)
Location: Mumbai-Floor3-SW01
Timestamp: 2025-01-17T14:32:15+05:30
```

---

#### 1.2.2 FMC (Firepower Management Center) Ribbon

**Phase 1A Week 1 Day 4: FMC Integration**

**Step 1: Generate FMC API Token**

```bash
# FMC: 10.252.10.100
# Generate API token

curl -X POST \
  https://10.252.10.100/api/fmc_platform/v1/auth/generatetoken \
  -H "Content-Type: application/json" \
  -u admin:FMC_Admin_Password123! \
  -k

# Response Headers (save these):
X-auth-access-token: abc123-def456-ghi789
X-auth-refresh-token: xyz789-uvw456-rst123
DOMAINS: [{"uuid":"e276abec-e0f2-11e3-8169-6d9ed49b625f","name":"Global","type":"DOMAIN"}]

# Token is valid for 30 minutes, refresh token valid for 24 hours
```

**Step 2: Configure FMC Ribbon in SecureX**

```
# SecureX  to  Modules  to  Available Modules  to  Firepower Management Center  to  Add

Module Name: FMC-Abhavtech
Description: Firepower Management Center managing 18 FTD appliances

# Connection:
FMC URL: https://10.252.10.100
API Version: v1 (FMC 7.x)

# Authentication:
Method: Username/Password (will generate token automatically)
Username: securex-api
Password: [Create dedicated API user in FMC]
Domain: Global

# API Settings:
Rate Limit: 120 requests/minute (FMC limit)
Timeout: 30 seconds
Retry: 3 attempts with exponential backoff

# Data Collection:
☑ Security Events (IPS alerts, malware detection)
☑ Connection Events (allowed/denied traffic)
☑ Intrusion Events (IPS signatures triggered)
☑ File Events (malware files detected by AMP)
☑ Host Events (endpoint activity from Host Input)
Poll Interval: 5 minutes (events generated every 5 min)

# Test Connection:
[Click "Test Connection"]
# Expected: ✅ Connected to FMC successfully
#           Retrieved 18 managed devices
#           Retrieved 1,234 security events (last 24 hours)
```

**Step 3: Configure Event Filters**

```
# FMC Ribbon Settings  to  Event Filters

# Only ingest critical/high severity events to reduce noise:
Severity Filter:
  ☑ Critical
  ☑ High
  ☐ Medium (optional, initially disabled)
  ☐ Low
  ☐ Informational

# Event Types:
  ☑ Intrusion (IPS alerts)
  ☑ Malware (AMP detections)
  ☑ Connection Denied (blocked traffic)
  ☐ Connection Allowed (too much volume)

# Device Filter (optional - ingest from all devices):
  Devices: All (18 FTD appliances)
```

---

#### 1.2.3 Umbrella Ribbon Configuration

**Phase 1A Week 2 Day 1: Umbrella Integration**

**Step 1: Generate Umbrella API Keys**

```
# Umbrella Dashboard: https://dashboard.umbrella.com
# Login: admin@abhavtech.com

# Admin  to  API Keys  to  Create

Key Name: SecureX-Integration
Scope:
  ☑ Reports (read DNS logs, security events)
  ☑ Policies (read policy assignments)
  ☑ Deployments (read VA/roaming client info)
Key Type: Legacy API Key (OAuth 2.0)

# Output (save to CyberArk):
API Key: 1234567890abcdef1234567890abcdef
API Secret: abcdef1234567890abcdef1234567890
Organization ID: 1234567
```

**Step 2: Configure Umbrella Ribbon**

```
# SecureX  to  Modules  to  Umbrella  to  Add

Module Name: Umbrella-Abhavtech
Description: Umbrella SASE protecting 3,200 users + 40 branches

# Authentication:
API Key: 1234567890abcdef1234567890abcdef
API Secret: abcdef1234567890abcdef1234567890
Organization ID: 1234567
Management API URL: https://management.api.umbrella.com
Reporting API URL: https://reports.api.umbrella.com

# Data Collection:
☑ DNS Queries (blocked, allowed, suspicious)
☑ Security Activity (malware, phishing, C2)
☑ File Analysis (file reputation checks)
☑ Policy Violations (category blocks)
Poll Interval: 10 minutes

# Rate Limiting:
Queries: 600 requests/hour (Umbrella API limit)
Burst: 1000 requests/hour (temporary spike allowed)

# Test Connection:
# Expected: ✅ Connected to Umbrella
#           Retrieved 12,345 DNS queries (last hour)
#           Retrieved 23 security blocks (last hour)
```

---

**[Continue with remaining ribbons: AMP, Threat Grid, Duo, etc.]**

### 1.3 Threat Response Workflow Creation

#### 1.3.1 Workflow 1: Investigate Malicious Domain

**Phase 1A Week 2 Day 2-3: Automated Investigation Workflow**

**Workflow Purpose:** When Umbrella blocks a malicious domain, automatically investigate which users/devices attempted to reach it, query ISE for user context, and create incident ticket.

**Step 1: Create Workflow in SecureX Orchestration**

```
# SecureX  to  Orchestration  to  Workflows  to  Create Workflow

Workflow Name: WF-001-Investigate-Malicious-Domain
Description: Automated investigation when Umbrella blocks malicious domain
Trigger: Webhook (from Umbrella alert)
Priority: High
```

**Step 2: Workflow Logic (JSON Definition)**

```json
{
  "workflow": {
    "name": "WF-001-Investigate-Malicious-Domain",
    "version": "1.0",
    "trigger": {
      "type": "webhook",
      "url": "https://visibility.us.amp.cisco.com/workflows/webhook/abc123"
    },
    "variables": {
      "blocked_domain": "$trigger.domain",
      "timestamp": "$trigger.timestamp",
      "category": "$trigger.category",
      "user_ip": "$trigger.source_ip"
    },
    "actions": [
      {
        "step": 1,
        "name": "Query Umbrella for Domain Details",
        "type": "http_request",
        "config": {
          "method": "GET",
          "url": "https://investigate.api.umbrella.com/domains/categorization/$blocked_domain",
          "headers": {
            "Authorization": "Bearer $umbrella_api_key"
          }
        },
        "output": "$domain_reputation"
      },
      {
        "step": 2,
        "name": "Query ISE for User Context",
        "type": "pxgrid_query",
        "config": {
          "query": "getSessionByIP",
          "parameters": {
            "ip_address": "$user_ip"
          }
        },
        "output": "$ise_session"
      },
      {
        "step": 3,
        "name": "Extract User Details",
        "type": "variable_set",
        "config": {
          "username": "$ise_session.userName",
          "mac_address": "$ise_session.macAddress",
          "sgt": "$ise_session.sgt",
          "location": "$ise_session.location"
        }
      },
      {
        "step": 4,
        "name": "Check if C2 Domain (Command & Control)",
        "type": "condition",
        "config": {
          "if": "$domain_reputation.security_categories contains 'Command and Control'",
          "then": "step_5_critical",
          "else": "step_6_standard"
        }
      },
      {
        "step": "5_critical",
        "name": "CRITICAL: Quarantine Device (C2 Detected)",
        "type": "ftd_api",
        "config": {
          "action": "add_to_quarantine_list",
          "ip_address": "$user_ip",
          "duration": "1 hour"
        }
      },
      {
        "step": "6_standard",
        "name": "STANDARD: Create Incident",
        "type": "create_incident",
        "config": {
          "severity": "high",
          "title": "Malicious Domain Access Attempt: $blocked_domain",
          "description": "User $username ($user_ip) attempted to access $blocked_domain (Category: $category)",
          "assigned_to": "security-ops@abhavtech.com"
        }
      },
      {
        "step": 7,
        "name": "Send Webex Notification",
        "type": "webex_message",
        "config": {
          "room": "Security Operations",
          "message": "🚨 **Malicious Domain Blocked**\nDomain: $blocked_domain\nUser: $username\nIP: $user_ip\nSGT: $sgt\nAction Taken: Incident created / Device quarantined"
        }
      }
    ]
  }
}
```

**Step 3: Test Workflow**

```
# SecureX Orchestration  to  WF-001  to  Test Run

# Test Input (simulate Umbrella webhook):
{
  "domain": "evil-c2-server.bad",
  "timestamp": "2025-01-17T14:45:00Z",
  "category": "Command and Control",
  "source_ip": "10.252.2.78"
}

# Expected Output:
Step 1: ✅ Domain reputation: Malicious (C2, Talos threat score: 95/100)
Step 2: ✅ ISE session found: john.doe@abhavtech.com
Step 3: ✅ User: john.doe, MAC: 00:50:56:12:34:AB, SGT: 15, Location: Mumbai-Floor2
Step 4: ✅ C2 detected  to  Execute Step 5 (quarantine)
Step 5: ✅ Device 10.252.2.78 added to FTD quarantine list (1 hour)
Step 6: (skipped - C2 path taken)
Step 7: ✅ Webex message sent to Security Operations room

# Execution Time: 8.3 seconds
# Result: SUCCESS
```

---

**I'll continue building this document with the same level of detail. Should I proceed with the remaining sections?**


---

## 2. FTD DEPLOYMENT & ASA MIGRATION - DETAILED IMPLEMENTATION

### 2.1 FTD Hardware Sizing Methodology

#### 2.1.1 Throughput Requirements Calculation

**Step 1: Calculate Per-Site User Count & Traffic**

| Site | Location | Users | Internet BW | Expected Throughput |
|------|----------|-------|-------------|---------------------|
| HQ-Mumbai | Mumbai, India | 800 | 1 Gbps DIA | 500 Mbps avg, 800 Mbps peak |
| HQ-London | London, UK | 600 | 500 Mbps DIA | 300 Mbps avg, 450 Mbps peak |
| HQ-NewJersey | New Jersey, USA | 700 | 1 Gbps DIA | 400 Mbps avg, 600 Mbps peak |
| Branch-Chennai | Chennai, India | 250 | 200 Mbps | 120 Mbps avg, 180 Mbps peak |
| Branch-Frankfurt | Frankfurt, Germany | 200 | 200 Mbps | 100 Mbps avg, 150 Mbps peak |
| Branch-Dallas | Dallas, USA | 180 | 200 Mbps | 90 Mbps avg, 135 Mbps peak |

**Step 2: Apply Feature Overhead Multipliers**

```
Base Throughput Calculation Formula:
────────────────────────────────────
Required FTD Throughput = Peak Throughput × Feature Overhead

Feature Overhead Multipliers:
- Firewall only: 1.0× (no overhead)
- Firewall + AVC (Application Visibility): 1.1×
- Firewall + AVC + IPS (Intrusion Prevention): 1.3×
- Firewall + AVC + IPS + SSL Decryption: 1.8×
- Firewall + AVC + IPS + SSL + Malware (AMP): 2.0×

Abhavtech Configuration:
- All sites: Firewall + AVC + IPS + SSL + AMP (full stack)
- Multiplier: 2.0×
```

**Example Calculation (Mumbai HQ):**

```
Peak Throughput: 800 Mbps
Feature Set: Firewall + AVC + IPS + SSL + AMP
Multiplier: 2.0×

Required FTD Throughput = 800 Mbps × 2.0 = 1,600 Mbps

Therefore: Need FTD model rated for ≥1.6 Gbps throughput
```

---

#### 2.1.2 FTD Model Selection Guide

**Cisco Firepower Threat Defense (FTD) Models:**

| Model | Form Factor | Firewall Throughput | IPS Throughput | Full Stack* | Max VPN | Price Tier |
|-------|-------------|-------------------|---------------|------------|---------|------------|
| **FPR-1150** | 1U | 3 Gbps | 1.5 Gbps | 750 Mbps | 500 Mbps | Entry |
| **FPR-2140** | 1U | 12 Gbps | 7.5 Gbps | 2.5 Gbps | 2 Gbps | Mid |
| **FPR-4150** | 1U | 32 Gbps | 18 Gbps | 7.5 Gbps | 10 Gbps | High |
| **FPR-9300** | Chassis | 55+ Gbps | 40+ Gbps | 20+ Gbps | 20+ Gbps | Enterprise |

*Full Stack = Firewall + AVC + IPS + SSL Decryption + AMP (Malware)

---

#### 2.1.3 Site-by-Site Model Selection

**Abhavtech FTD Deployment Plan:**

| Site | Required Throughput | Recommended Model | Justification | Quantity | HA Config |
|------|-------------------|------------------|---------------|----------|-----------|
| **Mumbai HQ** | 1,600 Mbps | FPR-2140 | 2.5 Gbps full stack > 1.6 Gbps | 2 | Active/Standby |
| **London HQ** | 900 Mbps | FPR-2140 | 2.5 Gbps full stack > 900 Mbps | 2 | Active/Standby |
| **New Jersey HQ** | 1,200 Mbps | FPR-2140 | 2.5 Gbps full stack > 1.2 Gbps | 2 | Active/Standby |
| **Chennai Branch** | 360 Mbps | FPR-1150 | 750 Mbps full stack > 360 Mbps | 2 | Active/Standby |
| **Frankfurt Branch** | 300 Mbps | FPR-1150 | 750 Mbps full stack > 300 Mbps | 2 | Active/Standby |
| **Dallas Branch** | 270 Mbps | FPR-1150 | 750 Mbps full stack > 270 Mbps | 2 | Active/Standby |
| **12 Small Branches** | 50-150 Mbps | FPR-1150 | Cost-effective for low throughput | 12 | Standalone |

**Total:** 18 FTD appliances (12× FPR-1150, 6× FPR-2140)

---

### 2.2 FTD Appliance Specifications

#### 2.2.1 Cisco FPR-1150 Specifications

**Hardware Platform: Cisco Firepower 1150**

| Component | Specification | Part Number | Notes |
|-----------|--------------|-------------|-------|
| **Model** | Firepower 1150 (1U) | FPR-1150-ASA-K9 | 1U rack mount, fanless |
| **CPU** | Intel Atom C3758R | Built-in | 8 cores @ 2.2 GHz |
| **Memory** | 32 GB DDR4 | Built-in | Non-upgradeable |
| **Storage** | 400 GB SSD | Built-in | M.2 SATA SSD |
| **Network Ports** | | | |
| - Management | 1× 1GbE RJ45 | mgmt0 | Out-of-band management |
| - Data Ports | 8× 1GbE RJ45 | eth1/1-8 | Copper interfaces |
| - Data Ports | 8× 1GbE SFP | eth1/9-16 | Fiber interfaces (optional) |
| **Power** | Dual 250W AC | Built-in | Redundant, auto-switchover |
| **Dimensions** | 1U: 1.7" H × 17.2" W × 14.9" D | - | Standard 19" rack |
| **Weight** | 22 lbs (10 kg) | - | Fully loaded |

**Performance Specifications:**

| Metric | Performance | Notes |
|--------|------------|-------|
| Firewall Throughput | 3 Gbps | Stateful, no features enabled |
| IPS Throughput | 1.5 Gbps | With IPS enabled |
| **Full Stack Throughput** | **750 Mbps** | Firewall+IPS+SSL+AMP |
| VPN Throughput | 500 Mbps | IPsec + AES-256 |
| Concurrent Sessions | 200,000 | Stateful firewall sessions |
| New Sessions/sec | 20,000 | Connection rate |
| Max VLANs | 1,024 | Subinterfaces |

---

#### 2.2.2 Cisco FPR-2140 Specifications

**Hardware Platform: Cisco Firepower 2140**

| Component | Specification | Part Number | Notes |
|-----------|--------------|-------------|-------|
| **Model** | Firepower 2140 (1U) | FPR-2140-ASA-K9 | 1U rack mount |
| **CPU** | Intel Xeon D-1528 | Built-in | 6 cores @ 1.9 GHz |
| **Memory** | 32 GB DDR4 | Upgradeable to 64 GB | 2× 16GB modules |
| **Storage** | 400 GB SSD | Built-in | M.2 SATA SSD |
| **Network Ports** | | | |
| - Management | 1× 1GbE RJ45 | mgmt0 | Out-of-band |
| - Data Ports | 8× 1GbE RJ45 | eth1/1-8 | Copper |
| - Data Ports | 2× 10GbE SFP+ | eth1/9-10 | Fiber uplinks |
| - Expansion Slots | 1× NM slot | - | Network Module (optional 4× 10GbE) |
| **Power** | Dual 450W AC | Built-in | Redundant |
| **Dimensions** | 1U: 1.7" H × 17.3" W × 20.9" D | - | 19" rack |
| **Weight** | 32 lbs (14.5 kg) | - | |

**Performance Specifications:**

| Metric | Performance | Notes |
|--------|------------|-------|
| Firewall Throughput | 12 Gbps | Stateful |
| IPS Throughput | 7.5 Gbps | With IPS |
| **Full Stack Throughput** | **2.5 Gbps** | Firewall+IPS+SSL+AMP |
| VPN Throughput | 2 Gbps | IPsec + AES-256 |
| Concurrent Sessions | 500,000 | Stateful sessions |
| New Sessions/sec | 40,000 | Connection rate |
| Max VLANs | 1,024 | Subinterfaces |

---

### 2.3 FTD Initial Setup (Day 0)

#### 2.3.1 Physical Installation

**Phase 1B Week 5 Day 1: Mumbai HQ FTD Installation**

**Step 1: Rack FTD Appliances**

```
Rack: Mumbai-DC-RACK-10 (42U)

Position  Device                  Model        Power    IP (mgmt0)
─────────────────────────────────────────────────────────────────
U25      ftd-mumbai-01 (Active)  FPR-2140     450W     10.252.99.41
U24      (rear + cable mgmt)     
U23      ftd-mumbai-02 (Standby) FPR-2140     450W     10.252.99.42
U22      (rear + cable mgmt)

Total Power: 900W (within 20A PDU capacity)
```

**Step 2: Cable Connections**

```
FTD-MUMBAI-01 (Active):
─────────────────────────────────────
mgmt0:       to  Management Switch (VLAN 99)     to  IP: 10.252.99.41/24
eth1/1:      to  Outside/Internet (VLAN 10)      to  ISP handoff
eth1/2:      to  Inside/Corporate (VLAN 100)     to  Core Switch
eth1/3:      to  DMZ (VLAN 200)                  to  DMZ servers
eth1/4:      to  Failover Link                   to  ftd-mumbai-02 eth1/4
eth1/5:      to  Stateful Failover Link          to  ftd-mumbai-02 eth1/5
eth1/9 (10G):  to  Uplink to Core (VLAN trunk)   to  Core Switch 10GbE

FTD-MUMBAI-02 (Standby): Mirror of FTD-01
```

---

#### 2.3.2 Console Setup (Day 0 Config)

**Step 3: Initial Console Access**

```bash
# Connect USB console cable to ftd-mumbai-01
# Serial settings: 9600 baud, 8N1

# Power on appliance
# Boot sequence (2-3 minutes)

Cisco Firepower 2140 ROMMON Version 1.0.15
...
Booting Cisco Firepower Threat Defense Software 7.4.0...

# First boot wizard appears:

Do you want to configure IPv4 address for management interface? (y/n): y
Enter management interface IPv4 address: 10.252.99.41
Enter management interface subnet mask: 255.255.255.0
Enter default gateway: 10.252.99.1
Enter primary DNS server: 10.252.1.50
Enter secondary DNS server (optional): 10.252.1.51

Do you want to configure IPv6 address? (y/n): n

# Configure hostname:
Enter firewall hostname: ftd-mumbai-01

# Configure password for admin user:
Enter admin password: [Create strong password, min 12 chars]
Confirm password: [Repeat password]

# Configure NTP:
Enter NTP server: 10.252.1.50

# FMC Registration:
Manage FTD from Firepower Management Center? (y/n): y
Enter FMC IP address or hostname: 10.252.10.100
Enter unique NAT ID (alphanumeric): mumbai-hq-ftd-01
Enter registration key: Abhavtech2025!

# Apply configuration:
Configuration saved. Rebooting to apply changes...
```

**Step 4: Verify FTD is Reachable**

```bash
# From management workstation:
ping 10.252.99.41
# Expected: Reply from 10.252.99.41

# SSH to FTD (after reboot ~5 minutes):
ssh admin@10.252.99.41

# Login with password set during Day 0

# Verify FTD status:
> show version
Cisco Firepower Threat Defense 7.4.0 (build 94)
Model: Cisco Firepower 2140
Memory: 32768 MB
Disk: 400 GB

> show network
Management0/0: 10.252.99.41/24, gateway: 10.252.99.1

> show managers
Hostname: 10.252.10.100
Status: Pending Registration
```

---

#### 2.3.3 FMC Registration

**Step 5: Add FTD to FMC**

```
# FMC GUI: https://10.252.10.100
# Login: admin / [FMC password]

# Devices  to  Add Device

Device Type: Firepower Threat Defense
Access: Manager (FMC manages FTD)

Registration:
  Display Name: ftd-mumbai-01
  Description: Mumbai HQ Active Firewall (FPR-2140)
  Host: 10.252.99.41
  Registration Key: Abhavtech2025!
  NAT ID: mumbai-hq-ftd-01
  Access Control Policy: Default-Policy (will customize later)
  License: Smart License (Essential + Threat + Malware)
  
# Click "Register"

# Wait 5-10 minutes for registration to complete

# Verify Registration:
Devices  to  Device Management  to  ftd-mumbai-01
Status: ✅ Registered (Green checkmark)
Health: Good
Version: 7.4.0
Last Contact: Just now
```

**Step 6: Configure High Availability (Active/Standby)**

```
# Repeat Steps 1-5 for ftd-mumbai-02 (Standby)

# Configure HA in FMC:
Devices  to  Device Management  to  ftd-mumbai-01  to  Edit  to  High Availability

HA Type: Active/Standby
Role: Active (ftd-mumbai-01)
Peer Device: ftd-mumbai-02

# Failover Configuration:
Failover Link:
  Interface: ethernet1/4
  IP Address (ftd-01): 192.168.1.1/30
  IP Address (ftd-02): 192.168.1.2/30

Stateful Failover Link:
  Interface: ethernet1/5
  IP Address (ftd-01): 192.168.2.1/30
  IP Address (ftd-02): 192.168.2.2/30

# Failover Criteria:
Monitor Interfaces:
  ☑ ethernet1/1 (Outside) - 2 consecutive failures trigger failover
  ☑ ethernet1/2 (Inside) - 2 consecutive failures trigger failover
Failover Timeout: 5 seconds
Auto-Sync: Enabled (sync configs every 5 minutes)

# Save and Deploy:
[Click "Save" then "Deploy"]

# Verify HA Status:
Devices  to  High Availability  to  ftd-mumbai-01
Status: ✅ Active (Green)
Peer Status: ✅ Standby Ready (Green)
Failover Link: Up
Stateful Link: Up
```

---

### 2.4 ASA Configuration Export & Analysis

#### 2.4.1 Export ASA Configuration

**Phase 1B Week 6 Day 1: Configuration Backup**

**Step 1: Connect to Existing ASA**

```bash
# Current ASA at Mumbai HQ: asa-mumbai-01 (10.252.10.1)
# ASA 5525-X, Software 9.16(4)

ssh admin@10.252.10.1
Password: [ASA admin password]

asa-mumbai-01# show version
Cisco Adaptive Security Appliance Software Version 9.16(4)
Model: ASA 5525-X
```

**Step 2: Export Running Configuration**

```bash
# From ASA:
asa-mumbai-01# terminal pager 0
asa-mumbai-01# show running-config
# Output will be 2000+ lines - copy to file

# Save to file on TFTP server:
asa-mumbai-01# copy running-config tftp://10.252.100.50/asa-mumbai-01-config-2025-01-17.txt

# Verify file saved:
# From management workstation:
ls -lh /tftpboot/asa-mumbai-01-config-2025-01-17.txt
# Expected: -rw-r--r-- 1 root root 98K Jan 17 15:30 asa-mumbai-01-config-2025-01-17.txt
```

**Step 3: Document Current Traffic Baseline**

```bash
# Capture current ASA performance metrics for comparison:

asa-mumbai-01# show traffic
        received (in 8.536 secs):
                15234 packets        8234560 bytes
                1784 pkts/sec        964521 bytes/sec
        transmitted (in 8.536 secs):
                12456 packets        6789012 bytes
                1459 pkts/sec        795234 bytes/sec

asa-mumbai-01# show conn count
1,234 in use, 234,567 most used

asa-mumbai-01# show cpu usage
CPU utilization for 5 seconds = 23%; 1 minute: 25%; 5 minutes: 28%

asa-mumbai-01# show memory
Free memory:        2048 MB
Used memory:        6144 MB
Total memory:       8192 MB

# Document these baselines for post-migration comparison
```

---

**[Continue with remaining sections...]**


---

## 3. DUO BEYOND - DETAILED IMPLEMENTATION

### 3.1 Duo Auth Proxy Sizing & Specifications

#### 3.1.1 Duo Auth Proxy Requirements

**Purpose:** Duo Authentication Proxy acts as a RADIUS server that bridges ISE/VPN with Duo's cloud MFA service.

**Sizing Calculation:**

```
Formula: Auth Proxy Servers = (Peak Auth/min ÷ 240) + 1

Where:
- Peak Auth/min = Maximum authentications per minute
- 240 = Duo Auth Proxy capacity per server (tested limit)
- +1 = For redundancy

Abhavtech Calculation:
- Total Users: 3,200
- Peak Login Period: 08:00-09:00 IST (morning arrival)
- Concurrent Logins: 30% of users (960 users)
- Login Duration: 60 minutes
- Peak Auth Rate: 960 ÷ 60 = 16 auth/min

Required Servers = (16 ÷ 240) + 1 = 1.07  to  2 servers (for HA)
```

**Result:** Deploy 2× Duo Auth Proxy servers (Active/Active with load balancing)

---

#### 3.1.2 Duo Auth Proxy Server Specifications

**Recommended Platform: Cisco UCS C220 M6 (consistent with Splunk infrastructure)**

| Component | Specification | Part Number | Justification |
|-----------|--------------|-------------|---------------|
| **Model** | Cisco UCS C220 M6 (1U) | UCSC-C220-M6S | Light workload, 1U form factor |
| **CPU** | 1× Intel Xeon Silver 4310 | UCS-CPU-I4310 | 8 cores @ 2.1GHz (low CPU usage) |
| **Memory** | 16 GB DDR4-3200 | UCS-MR-X16G2RS-H | Duo Auth Proxy is RAM-light |
| **Storage** | 1× 240GB SSD | UCS-SD240GBKS4-E | OS + Duo software (<50GB) |
| **Network** | Cisco VIC 1455 (Dual 10GbE) | UCSC-PCIE-C10Q-04 | Redundant NICs |
| **OS** | RHEL 8.x or Ubuntu 20.04 LTS | - | Duo officially supported |
| **Power** | Dual 770W | UCSC-PSU1-770W | Redundant PSUs |

**Deployment:** 2× servers (duo-auth-proxy-01, duo-auth-proxy-02) at Mumbai HQ for global coverage

---

### 3.2 Duo Auth Proxy Installation

#### 3.2.1 Operating System Preparation

**Phase 1B Week 7 Day 1-2: Duo Auth Proxy Server Setup**

**Step 1: Install RHEL 8.x**

```bash
# Boot from RHEL 8.6 ISO
# Installation options:
# - Server with GUI (for initial setup)
# - Network: eth0 static IP
# - Disk: Use entire 240GB disk, standard partitioning
# - Timezone: Asia/Kolkata (IST)
# - Root password: [Strong password in CyberArk]
# - Create user: duoadmin (wheel group)

# Post-installation (as root):
hostnamectl set-hostname duo-auth-proxy-01.abhavtech.local

# Update OS
yum update -y

# Disable SELinux (Duo recommendation)
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
setenforce 0

# Configure firewall (allow RADIUS, SSH)
firewall-cmd --permanent --add-port=1812/udp  # RADIUS auth
firewall-cmd --permanent --add-port=1813/udp  # RADIUS accounting
firewall-cmd --permanent --add-port=22/tcp    # SSH
firewall-cmd --reload

# Configure NTP
yum install -y chrony
cat > /etc/chrony.conf << 'EOF'
server 10.252.1.50 iburst  # Abhavtech NTP
driftfile /var/lib/chrony/drift
makestep 1.0 3
rtcsync
EOF

systemctl enable chronyd
systemctl start chronyd
```

---

#### 3.2.2 Duo Auth Proxy Software Installation

**Step 2: Download Duo Authentication Proxy**

```bash
# Download latest version from Duo
cd /opt
wget https://dl.duosecurity.com/duoauthproxy-latest-src.tgz

# Verify checksum (get from Duo downloads page)
sha256sum duoauthproxy-latest-src.tgz
# Compare with published checksum: a1b2c3d4e5f6...

# Extract
tar xzf duoauthproxy-latest-src.tgz
cd duoauthproxy-6.3.0-src

# Install dependencies
yum install -y gcc python3-devel openssl-devel

# Compile and install
make
./install

# Duo Auth Proxy installed to: /opt/duoauthproxy
```

**Step 3: Create systemd Service**

```bash
# Create systemd unit file
cat > /etc/systemd/system/duoauthproxy.service << 'EOF'
[Unit]
Description=Duo Authentication Proxy
After=network.target

[Service]
Type=forking
ExecStart=/opt/duoauthproxy/bin/authproxy start
ExecStop=/opt/duoauthproxy/bin/authproxy stop
PIDFile=/opt/duoauthproxy/run/authproxy.pid
User=root
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable duoauthproxy
```

---

### 3.3 AD/LDAP Integration Configuration

#### 3.3.1 Duo Admin Panel Setup

**Step 4: Configure Duo Admin Panel**

```
# Duo Admin Panel: https://admin.duosecurity.com
# Login: admin@abhavtech.com (with Duo MFA)

# Applications  to  Protect an Application  to  Cisco ISE

Application Name: Abhavtech-ISE-RADIUS
Type: RADIUS
Integration Key: DI1234567890ABCDEF12
Secret Key: abc123def456ghi789jkl012mno345pqr678stu901

# Authentication Policy:
Require enrolled device: Yes
Allow remembered devices: Yes (for 30 days)
Prompt for Duo Push: Yes (default)
Fallback to phone call: Yes
Fallback to SMS passcode: No (security policy)

# User Policy:
New User Policy: Deny access until enrolled
Inactive User Policy: Require re-enrollment after 90 days
```

---

#### 3.3.2 authproxy.cfg Configuration

**Step 5: Configure Duo Auth Proxy**

```bash
# Edit configuration file
vi /opt/duoauthproxy/conf/authproxy.cfg
```

```ini
# /opt/duoauthproxy/conf/authproxy.cfg

[main]
debug=false
log_sslkeyfile=false
log_auth_events=true
log_max_files=6
log_max_size=10485760
http_proxy_host=
http_proxy_port=

# RADIUS Server Configuration (for ISE)
[radius_server_auto]
# This section handles RADIUS requests from ISE
ikey=DI1234567890ABCDEF12
skey=abc123def456ghi789jkl012mno345pqr678stu901
api_host=api-12345678.duosecurity.com
radius_ip_1=10.252.1.20  # ISE PAN
radius_ip_2=10.252.1.21  # ISE PSN-01
radius_ip_3=10.252.1.22  # ISE PSN-02
radius_ip_4=10.252.1.23  # ISE PSN-03
radius_secret=SharedSecret123!  # Must match ISE RADIUS secret
port=1812
failmode=safe  # Allow access if Duo is unreachable (fail-open)
client=ad_client  # Reference AD configuration below

# Active Directory LDAP Configuration
[ad_client]
host=10.252.1.10  # AD Domain Controller IP
service_account_username=svc-duo@abhavtech.local
service_account_password=[Secure password - store in encrypted format]
search_dn=DC=abhavtech,DC=local
security_group_dn=CN=VPN-Users,OU=Security Groups,DC=abhavtech,DC=local

# LDAP Connection Settings
transport=starttls  # Use STARTTLS for encryption
ssl_verify_hostname=true
ssl_ca_certs=/etc/ssl/certs/ca-bundle.crt
timeout=60
ldap_filter=(memberOf=CN=VPN-Users,OU=Security Groups,DC=abhavtech,DC=local)

# Attribute Mapping
username_attribute=sAMAccountName
at_attribute=
```

**Step 6: Encrypt Service Account Password**

```bash
# Encrypt password in config
/opt/duoauthproxy/bin/authproxy_passwd

# Prompts for password, then outputs encrypted string:
[ad_client]
service_account_password_protected=[encrypted_string_abc123]

# Replace plain password in authproxy.cfg with encrypted version
```

**Step 7: Start Duo Auth Proxy**

```bash
# Start service
systemctl start duoauthproxy

# Check status
systemctl status duoauthproxy
# Expected: active (running)

# Check logs
tail -f /opt/duoauthproxy/log/authproxy.log

# Expected output:
2025-01-17 15:30:15 Duo Authentication Proxy v6.3.0 starting...
2025-01-17 15:30:16 [radius_server_auto] Listening on 0.0.0.0:1812
2025-01-17 15:30:16 [ad_client] Successfully connected to AD: 10.252.1.10
2025-01-17 15:30:16 Ready to process authentication requests
```

---

### 3.4 Device Trust Enrollment

#### 3.4.1 End-User Device Enrollment Walkthrough

**Phase 1B Week 8: User Enrollment Campaign**

**Enrollment Methods:**

1. **Duo Mobile App (Recommended for Smartphones)**
2. **Duo Desktop App (for Laptops/Desktops)**
3. **Hardware Token (for users without smartphone)**

---

**Method 1: Duo Mobile App Enrollment (iOS/Android)**

**Step 1: User Receives Enrollment Email**

```
From: noc@abhavtech.com
To: john.doe@abhavtech.com
Subject: Action Required: Enroll in Multi-Factor Authentication (MFA)

Dear John,

As part of Abhavtech's Zero Trust security initiative, you are required to 
enroll in Multi-Factor Authentication (MFA) using Duo Security.

Enrollment Deadline: January 31, 2025
Estimated Time: 5 minutes

Instructions:
1. Click the link below to start enrollment
2. Install Duo Mobile app on your smartphone
3. Scan the QR code to link your device
4. Test your setup

Enrollment Link: https://api-12345678.duosecurity.com/portal?code=abc123

Need Help? Contact IT Support: +91-XX-XXXX-XXXX or helpdesk@[your-domain]
```

**Step 2: User Clicks Enrollment Link**

```
# User opens link in web browser
# Duo Enrollment Portal opens

Welcome to Duo Security, John Doe!

Your username: john.doe@abhavtech.com

Step 1: Install Duo Mobile
[Download for iOS] [Download for Android]

# User downloads Duo Mobile from App Store or Google Play
```

**Step 3: User Scans QR Code**

```
# Browser shows QR code

Step 2: Activate Duo Mobile
1. Open Duo Mobile app
2. Tap "+" to add an account
3. Scan the QR code below

[QR CODE IMAGE]

Can't scan? Enter this activation code manually: ABC123-DEF456-GHI789
```

**Step 4: Device Trust Enabled (Optional but Recommended)**

```
# After successful enrollment, browser shows:

Step 3: Enable Device Trust (Recommended)
Device Trust allows your device to be remembered for 30 days, reducing 
how often you need to approve Duo Push notifications.

[Enable Device Trust]

# If user clicks "Enable Device Trust":
Install Duo Desktop app for Windows/Mac to enable Device Trust.

[Download Duo Desktop for Windows]
[Download Duo Desktop for Mac]

# User installs Duo Desktop, which runs in system tray
# Device gets "Trusted" status in Duo admin panel
```

**Step 5: Test Enrollment**

```
# Browser shows:

Enrollment Complete! ✅

Test your setup:
[Send Test Duo Push]

# User clicks button, receives Duo Push on smartphone
# User approves push  to  Test succeeds
```

---

### 3.5 SSO SAML Configuration

#### 3.5.1 Office 365 SAML SSO Setup

**Phase 1B Week 8 Day 3-4: Office 365 Integration**

**Step 1: Configure Duo as Identity Provider in Azure AD**

```
# Azure AD Portal: https://portal.azure.com
# Azure Active Directory  to  Enterprise Applications  to  New Application

Application Name: Duo Security SSO
Type: Non-gallery application

# Single Sign-On  to  SAML

Basic SAML Configuration:
  Identifier (Entity ID): https://duo.com/saml/abhavtech
  Reply URL (ACS): https://duo.com/saml/abhavtech/acs
  Sign-on URL: https://sso.duosecurity.com/saml/abhavtech
  Relay State: [leave blank]
  Logout URL: https://sso.duosecurity.com/saml/abhavtech/logout

User Attributes & Claims:
  Required Claim:
    Name: user.userprincipalname
    Namespace: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
    Source: Attribute
    Source Attribute: user.userprincipalname
  
  Additional Claims:
    givenname  to  user.givenname
    surname  to  user.surname
    emailaddress  to  user.mail

# SAML Signing Certificate:
Download: Certificate (Base64)
File: abhavtech-azure-saml-cert.cer
```

**Step 2: Configure Duo for Office 365 SSO**

```
# Duo Admin Panel  to  Applications  to  Protect an Application  to  Microsoft 365

Application Name: Office 365 - Abhavtech
Integration Key: DI9876543210ZYXWVU98
Secret Key: zyx987wvu654tsr321qpo098nml765kjh432igh210

# SAML Configuration:
Service Provider:
  Entity ID: urn:federation:MicrosoftOnline
  Assertion Consumer Service: https://login.microsoftonline.com/login.srf
  Name ID Format: urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
  
Identity Provider:
  Upload Azure AD Certificate: abhavtech-azure-saml-cert.cer
  Metadata URL: https://login.microsoftonline.com/[tenant-id]/federationmetadata/2007-06/federationmetadata.xml

# Attribute Mapping:
Duo Attribute  to  SAML Attribute
  username  to  http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
  email  to  http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress
  firstname  to  http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname
  lastname  to  http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname

# Authentication Policy:
Require MFA: Yes
Remembered Device Duration: 30 days
Allow Duo Push: Yes
Allow Phone Call: Yes
Allow SMS Passcode: No
```

**Step 3: Test SSO**

```
# Test User: john.doe@abhavtech.com

1. Navigate to: https://office.com
2. Enter email: john.doe@abhavtech.com
3. Redirected to Duo SSO page
4. Enter password
5. Duo Push sent to smartphone
6. User approves Duo Push
7. Redirected back to Office 365  to  Success ✅

# Expected Authentication Flow Log (from Duo):
Timestamp: 2025-01-17 16:45:23 IST
User: john.doe@abhavtech.com
Application: Office 365 - Abhavtech
Factor: Duo Push
Device: iPhone 13 (Trusted)
Location: Mumbai, India (10.252.2.45)
Result: SUCCESS
Response Time: 3.2 seconds
```

---

### 3.6 Risk-Based Policy Implementation

**Step 4: Configure Risk-Based Authentication in Duo**

```
# Duo Admin Panel  to  Policies  to  Global Policy

Policy Name: Abhavtech-Risk-Based-Auth
Description: Risk-based authentication with step-up for medium/high risk

# Risk Scoring Configuration:

Risk Factors (from Document 1 Appendix D):
  Device Trust: Weight 30%
    - Trusted Device: 0 points
    - Managed (enrolled): 5 points
    - Unknown Device: 10 points
  
  Location: Weight 20%
    - Known Office (Mumbai/London/NJ): 0 points
    - Known Remote Location: 3 points
    - New/Unknown Location: 7 points
  
  Impossible Travel: Weight 25%
    - No impossible travel: 0 points
    - Impossible travel detected: 10 points
  
  Time: Weight 10%
    - Business Hours (Mon-Fri 08:00-18:00 IST): 0 points
    - Off-Hours: 5 points
    - Weekend + Off-Hours: 7 points
  
  Failed MFA Attempts: Weight 10%
    - 0-1 attempts: 0 points
    - 2-3 attempts: 5 points
    - 4+ attempts: 10 points
  
  New Device: Weight 5%
    - Known device (30+ days): 0 points
    - New device (first time): 7 points

# Authentication Actions Based on Risk Score:

Low Risk (0.0 - 2.9):
  Action: Allow with standard Duo Push
  Session Duration: 8 hours
  Device Remember: 30 days

Medium Risk (3.0 - 5.9):
  Action: Allow with step-up MFA (biometric required)
  Session Duration: 4 hours
  Device Remember: Disabled
  Notification: Alert NOC via email

High Risk (6.0 - 7.9):
  Action: Quarantine session + Alert security team
  User Notification: "Unusual activity detected. Security team notified."
  Session Duration: 1 hour
  Re-authentication: Every 30 minutes
  
Critical Risk (8.0 - 10.0):
  Action: Deny + Disable account temporarily
  User Notification: "Account temporarily locked. Contact IT Security immediately."
  Admin Action Required: Manual review and unlock
```

---

**[Continue with real-world scenarios...]**


---

## 6. REAL-WORLD SCENARIO WALKTHROUGHS

### 6.1 Scenario 1: Malware Outbreak Detection & Containment

**Timeline:** January 17, 2025, 10:00-10:45 IST (45-minute incident)

**Initial Alert:**

```
From: SecureX Automated Alert
To: security-ops@abhavtech.com
Subject: CRITICAL - C2 Domain Access Detected

Alert Time: 2025-01-17 10:02:15 IST
Severity: CRITICAL
Source: Umbrella DNS Security

Details:
- Domain Blocked: evil-malware-c2.darkweb
- Category: Command & Control (C2)
- Source IP: 10.252.2.78
- Timestamp: 10:01:45 IST
- Block Count: 15 attempts in last 2 minutes

SecureX Workflow WF-001 automatically triggered.
Incident: INC-2025-0117-001 created.
```

---

**Investigation Timeline:**

**10:02 - Alert Received, Investigation Begins**

```
# SOC Analyst: Sarah Kumar opens SecureX

SecureX  to  Incidents  to  INC-2025-0117-001

Incident Summary:
Title: Malware C2 Communication Detected
Severity: Critical
Status: Investigating
Created: 10:02:15 IST
Assigned: Sarah Kumar

# Automated Workflow Results:
WF-001 (Investigate-Malicious-Domain) completed:
  ✅ Step 1: Umbrella domain reputation queried
     Result: evil-malware-c2.darkweb - Talos threat score: 98/100
     Category: Command & Control, Malware Distribution
     First Seen: 2025-01-15 (2 days ago)
     
  ✅ Step 2: ISE session query
     Result: User found
     Username: jane.smith@abhavtech.com
     MAC: 00:50:56:12:34:AB
     IP: 10.252.2.78
     SGT: 15 (Employee)
     Location: Mumbai-Floor2-East-SW01
     
  ✅ Step 3: FTD quarantine triggered
     Result: IP 10.252.2.78 added to quarantine policy
     Duration: 1 hour (auto-expires at 11:03:15)
     
  ✅ Step 4: Webex notification sent
     Room: Security Operations
     Message: "🚨 CRITICAL: C2 domain blocked, user jane.smith quarantined"
```

**10:05 - Analyst Investigates Endpoint**

```
# Check if malware is active on endpoint

SecureX  to  Threat Response  to  Query Endpoints

Query: IP = 10.252.2.78

# Results from Cisco AMP (endpoint security):
Endpoint: ABHAV-LAPTOP-JS-0012
User: jane.smith
OS: Windows 11 Pro (build 22621)
AMP Status: ❌ MALWARE DETECTED

# AMP Detection Details:
File: C:\Users\jane.smith\Downloads\invoice-Q4-2024.exe
SHA-256: a1b2c3d4e5f6789012345678901234567890abcdef123456789012345678
Detection: Win.Trojan.Generic::95.sbx.tg (high confidence)
Quarantine Status: ✅ File quarantined by AMP
First Seen on Endpoint: 10:00:30 IST (90 seconds before C2 communication)
Source: Email attachment (received 09:58:15)
```

**10:08 - Root Cause Identified: Phishing Email**

```
# Query email logs (Office 365 via Azure Sentinel integration)

SecureX  to  Integrations  to  Azure Sentinel  to  Email Logs

Query: Recipient = jane.smith@abhavtech.com, Timestamp > 09:50

# Email Found:
From: finance@abhavtech-suppliers[.]com (SUSPICIOUS - fake domain)
To: jane.smith@abhavtech.com
Subject: URGENT: Q4 Invoice Payment Required
Received: 09:58:15 IST
Attachment: invoice-Q4-2024.exe (malware)

Email Body:
"Dear Jane,
Please review and approve the attached Q4 invoice immediately.
Payment is overdue.
[Urgent action required]"

# Email Gateway (Cisco Email Security) Log:
Result: ⚠️ ALLOWED (email gateway missed this)
Reason: Sender domain not in blocklist, attachment passed basic scan
Issue: Zero-day malware, not yet in signature database
```

**10:12 - Impact Assessment**

```
# Check if malware spread to other users

SecureX  to  Query: SHA-256 = a1b2c3d4e5f6...

# AMP Results:
Affected Endpoints: 1 (only jane.smith's laptop)
Status: Contained (quarantined immediately, no lateral movement)

# Check if other users received same email:

Azure Sentinel Query:
| where TimeGenerated > ago(2h)
| where Subject contains "Q4 Invoice"
| where Sender contains "abhavtech-suppliers[.]com"
| summarize count() by RecipientEmailAddress

# Results:
RecipientEmailAddress           count
jane.smith@abhavtech.com        1
john.doe@abhavtech.com          1
robert.kumar@abhavtech.com      1
sarah.patel@abhavtech.com       1

TOTAL: 4 users received phishing email
```

**10:15 - Expand Investigation to Other Recipients**

```
# Check if other users opened attachment

For each recipient:
  john.doe: ✅ Did NOT open attachment (confirmed via call)
  robert.kumar: ✅ Did NOT open attachment (email deleted)
  sarah.patel: ❌ OPENED attachment but AMP blocked immediately

# sarah.patel's endpoint:
Endpoint: ABHAV-DESKTOP-SP-0045
AMP Status: ✅ CLEAN (malware blocked before execution)
Action Taken: AMP quarantined file, prevented execution
User Impact: None (blocked silently)
```

**10:20 - Containment Actions**

```
# Actions Taken:

1. ✅ Quarantine Affected Devices (completed by WF-001):
   - jane.smith laptop: Quarantined (network access blocked)
   - sarah.patel desktop: Monitored (AMP blocked execution)

2. ✅ Block Sender Domain:
   # Cisco Email Security  to  Blocked Senders
   Domain: abhavtech-suppliers[.]com  to  BLOCKED
   
3. ✅ Block C2 Domain Globally:
   # Umbrella  to  Policies  to  Destination Lists  to  Global Blocklist
   Domain: evil-malware-c2.darkweb  to  BLOCKED GLOBALLY
   
4. ✅ Update AMP Cloud:
   SHA-256: a1b2c3d4e5f6...  to  Uploaded to AMP Threat Grid
   Analysis: Confirmed trojan, C2 communication, credential theft
   Verdict: MALICIOUS (now detected globally across all AMP deployments)

5. ✅ Notify Affected Users:
   Email sent to john.doe, robert.kumar: "Delete email immediately"
   jane.smith: "Your device has been quarantined. IT will contact you shortly."
```

**10:30 - Remediation**

```
# Remediate jane.smith's laptop

Action: Remote wipe & reimag via Cisco AMP

1. AMP Console  to  Endpoint: ABHAV-LAPTOP-JS-0012  to  Outbreak Control
   
   Command: Isolate Endpoint
   Result: ✅ Laptop isolated from network (except AMP management)
   
2. AMP Orbital (live query):
   Query: List all files modified in last hour
   Result: 23 files modified (including registry keys, startup items)
   
3. Decision: Full reimage required (malware executed, potential persistence)
   
   Action Plan:
   - User jane.smith: Sent to conference room with temporary laptop
   - Infected laptop: Collected by IT, full disk wipe + OS reimage
   - Duration: 2-3 hours
   - Credential Reset: Password changed (in case of credential theft)

4. Credential Rotation (precautionary):
   - jane.smith AD password: Reset via Azure AD
   - Duo device: Removed, require re-enrollment
   - Office 365 sessions: Revoked globally
```

**10:45 - Incident Resolved**

```
# Update Incident Status

SecureX  to  INC-2025-0117-001  to  Update

Status: Resolved
Resolution Time: 43 minutes (10:02 - 10:45)
Root Cause: Phishing email with zero-day malware
Impact: 1 laptop infected, 1 user affected (jane.smith)
Containment: Successful (no lateral movement)

# Actions Summary:
✅ Malware contained (AMP quarantine)
✅ Endpoint isolated (FTD quarantine + AMP isolation)
✅ C2 domain blocked globally (Umbrella)
✅ Sender domain blocked (Email Security)
✅ Malware signature updated (AMP Cloud)
✅ Affected device remediated (reimage)
✅ User credentials rotated

# Post-Incident:
- Security awareness email sent to all users (phishing warning)
- Email gateway rules updated (block .exe attachments from external senders)
- Weekly phishing simulation training scheduled
```

---

**Key Takeaways:**

✅ **Automated Response:** WF-001 quarantined device within 30 seconds of detection  
✅ **Zero Lateral Movement:** Malware contained to single endpoint  
✅ **Fast MTTR:** 43 minutes from detection to resolution  
✅ **Multi-Layer Defense:** AMP (endpoint) + Umbrella (DNS) + FTD (network) all effective  

---

### 6.2 Scenario 2: Insider Threat Investigation

**Timeline:** January 18, 2025, 14:30-16:00 IST (90-minute investigation)

**Trigger: UEBA Anomaly Detection**

```
From: SecureX UEBA Alert
To: security-ops@abhavtech.com
Subject: HIGH RISK - Unusual User Behavior Detected

Alert Time: 2025-01-18 14:32:00 IST
Severity: High
Source: XDR UEBA (User Entity Behavior Analytics)

User: robert.contractor@abhavtech.com
Risk Score: 7.8 / 10.0 (HIGH)
Confidence: 87%

Anomalies Detected:
1. Large data download (15 GB) - 400% above baseline
2. Access to restricted file share (first time in 90 days)
3. Off-hours access (14:30 IST = 02:00 EST, user normally 09:00-17:00 EST)
4. New device detected (laptop not previously seen)
5. VPN connection from new location (Mumbai, user normally in New Jersey)
```

---

**Investigation:**

**14:35 - SOC Analyst Reviews UEBA Alert**

```
# SecureX  to  UEBA  to  User Profile: robert.contractor

User Context:
  Full Name: Robert Contractor
  Department: Engineering
  Location: New Jersey Office
  Manager: John Engineering-Manager
  Role: External Contractor (3-month contract, ending Feb 15, 2025)
  Access Level: Restricted (no access to confidential data)
  
Behavioral Baseline (last 90 days):
  Avg Daily Data Transfer: 3.5 GB
  Typical Hours: 09:00-17:00 EST (Mon-Fri)
  Typical Location: New Jersey (10.252.3.x subnet)
  Known Devices: 1 laptop (ABHAV-CONTRACTOR-RK-0078)
```

**14:40 - Investigate Current Activity**

```
# pxGrid Query (via ISE):

Query: getSessionByUsername("robert.contractor@abhavtech.com")

# Result:
Current Session:
  Username: robert.contractor@abhavtech.com
  IP Address: 10.252.2.145
  MAC Address: 00:50:56:99:88:77 (NEW DEVICE - not in baseline)
  Connection Type: VPN (AnyConnect)
  VPN Endpoint: Mumbai VPN Headend (10.252.1.1)
  Auth Time: 14:15:00 IST
  SGT: 20 (Contractor)
  Location: Mumbai (unusual for NJ-based user)
  
# Duo Authentication Log:
Timestamp: 14:15:00 IST
User: robert.contractor@abhavtech.com
Factor: Duo Push
Device: Android Phone (Samsung Galaxy S21) - KNOWN device
Result: SUCCESS
Risk Score: 6.2 (Medium-High)
  - New VPN location: Mumbai (+3 risk points)
  - Off-hours for user's timezone: 02:00 EST (+2 risk points)
  - Unusual behavior pattern (+1.2 risk points)
```

**14:45 - Investigate File Access**

```
# Query File Server Logs (Windows File Server via Splunk)

index=windows_logs sourcetype=WinEventLog:Security 
    EventCode=5140 (file share access)
    Account_Name="robert.contractor"
    earliest="01/18/2025:14:00:00"

# Results:
File Share Access:
  Time: 14:20:15 IST
  Share: \\fileserver-mumbai\Engineering\CONFIDENTIAL\Product-Roadmap-2025
  Action: Read
  Files Accessed: 47 files
  Total Size: 15.3 GB
  
  Files Include:
    - Product-Strategy-2025-2030.pptx (CONFIDENTIAL)
    - Customer-List-Enterprise.xlsx (CONFIDENTIAL)
    - Revenue-Projections-Q1-Q4.xlsx (CONFIDENTIAL)
    - Source-Code-Archive.zip (RESTRICTED)
    
# ALERT: User accessed CONFIDENTIAL files not normally in scope
# Contractor role should NOT have access to these files
```

**14:50 - Check Authorization**

```
# ISE Authorization Policy Check:

User: robert.contractor@abhavtech.com
Identity Group: External-Contractors
Authorization Profile: Contractor-Limited-Access

Permitted Access:
  ✅ Engineering shared drive (non-confidential)
  ✅ Collaboration tools (Webex, email)
  ❌ CONFIDENTIAL file shares (should be DENIED)
  
# FINDING: User should NOT have access to \\fileserver-mumbai\Engineering\CONFIDENTIAL\

# Check file server permissions (Active Directory):
Group: Engineering-Confidential-Access
Members: ... robert.contractor@abhavtech.com (ADDED 2025-01-18 10:00 IST)
Added By: john.engineering-manager@abhavtech.com

# Timeline:
10:00 IST - Manager added robert.contractor to confidential group
14:15 IST - User VPN'd from Mumbai
14:20 IST - User accessed confidential files
14:32 IST - UEBA detected anomaly
```

**15:00 - Escalate to Management**

```
# Call Manager: john.engineering-manager@abhavtech.com

Conversation:
Analyst: "Hi John, we detected unusual activity for Robert Contractor. 
          Did you authorize him to access confidential product roadmaps?"
          
Manager: "Yes, I added him to the group this morning. He's working on 
          a critical project and needs those files. Why?"
          
Analyst: "He's accessing from Mumbai via VPN at 2 AM EST, his local time. 
          Is he traveling?"
          
Manager: "No, he's in New Jersey. He should be asleep now. Let me call him..."

[Manager calls Robert - no answer]

Manager: "This is strange. He's not answering. Can you block his access?"

Analyst: "Yes, doing that now."
```

**15:05 - Immediate Containment**

```
# Actions Taken:

1. ✅ Disable VPN Session:
   # FTD  to  VPN  to  Active Sessions  to  robert.contractor  to  Terminate
   Result: Session terminated
   
2. ✅ Disable AD Account:
   # Azure AD  to  Users  to  robert.contractor  to  Disable Account
   Result: Account disabled (cannot authenticate)
   
3. ✅ Block at Network Layer:
   # FTD  to  Objects  to  Network Objects  to  Add: 10.252.2.145
   # FTD  to  Policies  to  Access Control  to  Add Rule: DENY 10.252.2.145
   Result: IP blocked globally
   
4. ✅ Alert HR & Legal:
   Email: hr@abhavtech.com, legal@abhavtech.com
   Subject: URGENT: Potential Insider Threat - Robert Contractor
```

**15:20 - Further Investigation**

```
# Robert Contractor Calls Back:

Robert: "Hi, my laptop won't connect to VPN. What's going on?"

Analyst: "Were you accessing files from Mumbai at 2:00 AM?"

Robert: "No, I'm in New Jersey. I've been asleep. My laptop is right here on my desk."

Analyst: "Can you check if your laptop is on?"

Robert: [checks] "Yes, it's on... wait, I don't remember leaving it on. 
        And there's a VPN connection active that I didn't start."

# FINDING: Laptop may have been compromised or stolen temporarily

# Ask Robert to check laptop:
Robert: "I left my laptop at the office yesterday. I'm working from home today. 
         Someone must have accessed my laptop at the office overnight."
```

**15:30 - Root Cause Identified**

```
# Investigation Conclusion:

Scenario: Unauthorized physical access to laptop

Timeline:
  1. Robert left laptop at office (New Jersey) yesterday evening
  2. Unknown person accessed laptop overnight (physical access)
  3. Laptop was already unlocked or person knew password
  4. Person initiated VPN connection
  5. VPN connected through Mumbai VPN gateway (person in Mumbai office?)
  6. Person accessed confidential files
  7. UEBA detected anomaly
  
# Badge Access Logs (New Jersey Office):
Building: NJ Office, Floor 3, Engineering Area
Date: 2025-01-18
Time: 02:15-03:30 EST (14:15-15:30 IST)

Badge Swipe: [Unknown - investigating]
Security Camera: Reviewing footage (floor 3)

# Mumbai VPN Usage:
VPN Gateway: 10.252.1.1 (Mumbai)
Connected Devices: 145 active connections
Suspicious: Device from NJ office routing through Mumbai gateway
   to  User may have manually configured VPN to Mumbai endpoint to appear as if in India
```

**16:00 - Incident Resolution & Next Steps**

```
# Immediate Actions:
✅ Robert's account: Disabled, under investigation
✅ Robert's laptop: Remote wipe initiated (via Cisco AMP)
✅ HR notified: Contract review, possible termination
✅ Legal notified: Potential intellectual property theft
✅ Physical security: Review badge access logs, camera footage
✅ Confidential files: Forensic analysis (were files copied externally?)

# Investigation Status:
Status: Ongoing (escalated to HR, Legal, Physical Security)
Primary Suspect: Unknown (internal investigation)
Data Exfiltration: Unknown (file transfer logs under analysis)

# Preventive Measures:
1. Enforce laptop screen lock after 5 minutes idle
2. Require BitLocker encryption on all contractor laptops
3. Implement USB device control (block unauthorized USB drives)
4. Enhance UEBA rules (physical location mismatch = high risk)
```

---

**Key Takeaways:**

✅ **UEBA Detection:** Identified insider threat within 17 minutes of suspicious activity  
✅ **Fast Response:** Account disabled within 33 minutes of alert  
✅ **Multi-Factor Investigation:** Combined UEBA, pxGrid, file logs, physical security  
❌ **Gap Identified:** Physical laptop security needs improvement (screen lock policy)  

---

### 6.3 Scenario 3: Failed Duo Authentication Troubleshooting

**Timeline:** January 19, 2025, 09:15-09:35 IST (20-minute resolution)

**User Report:**

```
From: sarah.employee@abhavtech.com
To: helpdesk@[your-domain]
Subject: Cannot login to VPN - Duo Push not working

Hi IT,

I'm trying to connect to VPN from home but Duo is not working. I enter my 
username and password, but I never receive a Duo Push on my phone.

Error message: "Authentication failed. Contact IT support."

I need to access urgent emails. Please help!

Regards,
Sarah Employee
```

---

**Troubleshooting Steps:**

**09:18 - Helpdesk Ticket Created**

```
Ticket: HD-2025-0119-0234
Priority: High (user cannot work)
Assigned: Helpdesk Tier 1 (Amit Kumar)
User: sarah.employee@abhavtech.com
Issue: Cannot authenticate via Duo for VPN access
```

**09:20 - Check Duo Logs**

```
# Duo Admin Panel  to  Reports  to  Authentication Log

Filter: Username = sarah.employee@abhavtech.com, Time = Last 1 hour

# Results:
Timestamp: 09:15:23 IST
Username: sarah.employee@abhavtech.com
Application: VPN - Abhavtech AnyConnect
Factor: Duo Push
Result: DENIED
Reason: "Device not trusted"
Device: None (no devices enrolled)

# FINDING: User has no enrolled Duo devices
```

**09:22 - Check User Enrollment Status**

```
# Duo Admin Panel  to  Users  to  Search: sarah.employee

User: sarah.employee@abhavtech.com
Status: Enrolled (✅ shows as enrolled)
Enrollment Date: 2025-01-10
Devices: 0 devices (❌ no devices!)

# ISSUE IDENTIFIED: User completed enrollment but never added a device
# Likely: User closed enrollment page before adding Duo Mobile
```

**09:24 - Send Re-Enrollment Link**

```
# Duo Admin Panel  to  Users  to  sarah.employee  to  Send Enrollment Email

Email sent to: sarah.employee@abhavtech.com
Enrollment Link: https://api-12345678.duosecurity.com/portal?code=xyz789

# Call user:
Helpdesk: "Hi Sarah, I've sent you an enrollment email. Can you check your inbox?"

Sarah: "Got it. What should I do?"

Helpdesk: "Click the link and follow the steps to add your smartphone. 
           You'll need to install the Duo Mobile app."
```

**09:27 - User Completes Enrollment**

```
# User follows steps:
1. ✅ Clicked enrollment link
2. ✅ Downloaded Duo Mobile app (iOS App Store)
3. ✅ Scanned QR code
4. ✅ Activated device in Duo Mobile
5. ✅ Sent test Duo Push  to  Success

# Duo Admin Panel  to  Users  to  sarah.employee
Devices: 1 device (iPhone 12) ✅
Status: Enrolled and Active ✅
```

**09:30 - Test VPN Connection**

```
# User tests VPN:
1. Open Cisco AnyConnect
2. Enter credentials: sarah.employee / [password]
3. Duo Push sent to iPhone
4. Approve push on smartphone
5. VPN Connected ✅

User: "It's working now! Thank you!"

Helpdesk: "Great! In the future, make sure to complete the entire enrollment 
           process including adding your device."
```

**09:35 - Ticket Resolved**

```
Ticket: HD-2025-0119-0234
Status: Resolved
Resolution Time: 17 minutes
Root Cause: Incomplete Duo enrollment (no device added)
Resolution: Re-sent enrollment link, user completed setup
```

---

**Key Takeaway:**

✅ Common issue: Users think enrollment is complete after clicking link  
✅ Solution: Send automated reminder if no device added within 24 hours  
✅ Fast resolution: 17 minutes from ticket to resolved  

---

**[Continue with Scenario 4: FTD SGT Policy Troubleshooting...]**


### 6.4 Scenario 4: FTD SGT Policy Troubleshooting

**Timeline:** January 20, 2025, 11:00-11:25 IST (25-minute resolution)

**User Report:**

```
From: john.developer@abhavtech.com
To: helpdesk@[your-domain]
Subject: Cannot access development server

Hi,

I'm unable to access the development database server (10.252.4.50) from my 
laptop. I get "Connection timed out" error. I could access it yesterday.

This is blocking my work. Please help urgently.

Thanks,
John Developer
```

---

**Troubleshooting:**

**11:05 - Check FTD Connection Logs**

```
# FMC  to  Analysis  to  Connections  to  Event Search

Filter:
  Source IP: 10.252.2.89 (john.developer's laptop)
  Destination IP: 10.252.4.50 (dev database server)
  Time: Last 1 hour
  
# Results:
Connection Event:
  Time: 11:02:45 IST
  Source: 10.252.2.89 (john.developer)
  Source SGT: 15 (Employee)
  Destination: 10.252.4.50
  Destination SGT: 25 (Servers)
  Action: DENY
  Reason: SGT-based policy violation
  Rule: "Deny Employee  to  Servers (port 1433)"
  Policy: Mumbai-FTD-AccessControl-Policy
```

**11:08 - Check ISE Authorization**

```
# ISE GUI  to  Context Visibility  to  Endpoints  to  Search: 10.252.2.89

Endpoint Details:
  IP: 10.252.2.89
  MAC: 00:50:56:AB:12:34
  User: john.developer@abhavtech.com
  Authorization Profile: Employee-Wired-Access
  SGT Assigned: 15 (Employee) ✅ Correct
  Identity Group: Employees

# Check if user should have developer access:
ISE  to  Administration  to  Identity Management  to  Groups

john.developer@abhavtech.com
  Member of AD Group: Domain Users, Employees
  NOT member of: Developers (❌ should be member)
```

**11:12 - Root Cause Identified**

```
# Root Cause: User not in "Developers" AD group
# Result: ISE assigns SGT 15 (Employee) instead of SGT 18 (Developer)
# FTD policy: Employee (SGT 15)  to  Servers (SGT 25) = DENY
#             Developer (SGT 18)  to  Servers (SGT 25) = ALLOW (port 1433)
```

**11:15 - Verify with Manager**

```
# Call: dev-manager@abhavtech.com

Analyst: "Hi, John Developer is trying to access the dev database but 
          he's not in the Developers AD group. Should he have access?"
          
Manager: "Yes, he joined the dev team last week. I thought HR added him 
          to the group. Can you add him?"
          
Analyst: "I'll need HR approval since it's an AD group change."

Manager: "I'll email HR now."
```

**11:18 - Temporary Workaround**

```
# While waiting for HR approval, provide temporary access

Option 1: Manually override SGT in ISE (temporary)
Option 2: Add exception rule in FTD (temporary)

# Choose Option 2 (cleaner):

FMC  to  Policies  to  Access Control  to  Mumbai-FTD-AccessControl-Policy

Add Exception Rule (above default deny):
  Name: TEMP-john.developer-dev-db-access
  Source: IP 10.252.2.89
  Destination: IP 10.252.4.50
  Port: 1433 (SQL Server)
  Action: ALLOW
  Logging: Log at End of Connection
  Comments: "Temporary until AD group updated"
  Expiry: 4 hours

[Save and Deploy]
```

**11:20 - Verify Access Works**

```
# User tests connection:
john.developer: ping 10.252.4.50
  Reply from 10.252.4.50: bytes=32 time=2ms TTL=64 ✅

john.developer: Test SQL connection
  Connected to database ✅

# FTD Log:
Connection Event:
  Time: 11:20:15 IST
  Source: 10.252.2.89
  Destination: 10.252.4.50:1433
  Action: ALLOW
  Rule: TEMP-john.developer-dev-db-access
  Bytes Transferred: 4,523 bytes
```

**11:22 - Permanent Fix**

```
# HR adds john.developer to "Developers" AD group

Active Directory  to  Users and Computers  to  Groups  to  Developers
   to  Add Member: john.developer@abhavtech.com

# ISE automatically detects AD group change (sync every 15 minutes)
# Wait 15 minutes for next AD sync or force sync:

ISE  to  Administration  to  Identity Management  to  External Identity Sources
   to  Active Directory  to  Sync Now

# After sync (11:37):
ISE  to  Context Visibility  to  john.developer@abhavtech.com
  Identity Group: Employees, Developers ✅
  SGT: 18 (Developer) ✅ UPDATED

# Remove temporary FTD rule:
FMC  to  Policies  to  Access Control  to  Delete rule: TEMP-john.developer-dev-db-access
```

**11:25 - Ticket Resolved**

```
Ticket: HD-2025-0120-0456
Status: Resolved
Resolution Time: 25 minutes
Root Cause: User not in correct AD group (Developers)
Temporary Fix: FTD exception rule (4 hours)
Permanent Fix: Added to Developers AD group
```

---

**Key Takeaways:**

✅ SGT-based policy working as designed (deny by default)  
✅ Root cause: Incorrect AD group membership  
✅ Temporary workaround enabled user to work while waiting for permanent fix  
✅ ISE-FTD SGT integration working correctly  

---

## APPENDICES

### Appendix A: Hardware Bill of Materials & Procurement

**Zero Trust Architecture Hardware/Licensing BOM:**

| Category | Item | Quantity | Unit Price | Total | Vendor | Notes |
|----------|------|----------|-----------|-------|--------|-------|
| **FTD Firewalls** | | | | | | |
| FPR-2140 | Firepower 2140 Appliance | 6 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco | 3 HQ sites (2 each for HA) |
| FPR-1150 | Firepower 1150 Appliance | 12 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco | 6 branches (2 each) + 12 small sites |
| FTD Licenses | Threat + Malware (Essential) | 18 | [VENDOR_QUOTE]/yr | [VENDOR_QUOTE]/yr | Cisco | Per appliance annual subscription |
| FMC | Firepower Management Center VM | 1 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco | Virtual appliance (200 device mgmt) |
| **Duo Security** | | | | | | |
| Duo Beyond | MFA + Device Trust (per user) | 3,200 | [VENDOR_QUOTE]/user/yr | [VENDOR_QUOTE]/yr | Cisco Duo | All employees |
| Duo Auth Proxy | UCS C220 M6 servers | 2 | [VENDOR_QUOTE] | [VENDOR_QUOTE] | Cisco | HA pair at Mumbai HQ |
| **Umbrella/SASE** | | | | | | |
| Umbrella Essentials | DNS Security (per user) | 3,200 | [VENDOR_QUOTE]/user/yr | [VENDOR_QUOTE]/yr | Cisco | All users |
| Umbrella VA | Virtual Appliance licenses | 40 | [VENDOR_QUOTE]/VA/yr | [VENDOR_QUOTE]/yr | Cisco | 1 per branch site |
| **SecureX/XDR** | | | | | | |
| SecureX Platform | XDR platform license | 1 | Included | $0 | Cisco | Included with FTD+Umbrella+Duo |
| XDR Add-Ons | Extended retention, UEBA | 1 | [VENDOR_QUOTE]/yr | [VENDOR_QUOTE]/yr | Cisco | Optional advanced features |
| **Professional Services** | | | | | | |
| FTD Migration | ASA to FTD migration assistance | 80 hrs | [VENDOR_QUOTE]/hr | [VENDOR_QUOTE] | Cisco/Partner | Optional |
| **Total Estimate** | | | | **[Contact Cisco for Quote]** | | |

**Procurement Timeline:** 12 weeks pre-implementation (RFP, vendor selection, delivery)

---

### Appendix B: Migration Checklists

#### **Pre-Migration Checklist (Per Site)**

**2 Weeks Before Cutover:**

- [ ] FTD appliances delivered and racked
- [ ] FTD appliances powered on and tested (Day 0 config)
- [ ] FTD registered with FMC
- [ ] High Availability configured and tested
- [ ] Network cabling verified (inside, outside, DMZ)
- [ ] ASA configuration backed up (3× copies: TFTP, USB, email)
- [ ] ASA traffic baseline documented (throughput, connections, CPU/memory)
- [ ] FTD policy translated from ASA config
- [ ] FTD policy deployed and validated in staging
- [ ] Change request approved (CAB + CIO)
- [ ] Rollback plan documented and tested
- [ ] Communication sent to users (maintenance window)
- [ ] Stakeholders notified (IT, NOC, business units)

---

#### **Migration Day Checklist**

**Cutover Window: Saturday 22:00 - Sunday 06:00 IST (8 hours)**

**Phase 1: Pre-Cutover (22:00-23:00)**

- [ ] 22:00: Confirm all teams on bridge call (Network, Security, NOC, TAC)
- [ ] 22:05: Final ASA config backup
- [ ] 22:10: Capture ASA performance baseline (show traffic, show conn count)
- [ ] 22:15: Document current routing table (show route)
- [ ] 22:20: Take screenshots of critical dashboards (FMC, ISE, DNAC)
- [ ] 22:25: Verify FTD standby unit ready (show failover state)
- [ ] 22:30: **GO/NO-GO decision point** (all checks passed?)

**Phase 2: ASA Decommission (23:00-23:30)**

- [ ] 23:00: Disable monitoring alerts (avoid false alarms)
- [ ] 23:05: Shutdown ASA outside interface (prepare for FTD takeover)
    ```
    asa# conf t
    asa(config)# interface outside
    asa(config-if)# shutdown
    ```
- [ ] 23:10: Verify traffic stopped on ASA (show traffic  to  0 pps)
- [ ] 23:15: Document ASA final uptime (show version)
- [ ] 23:20: Move outside cable from ASA to FTD-Active

**Phase 3: FTD Cutover (23:30-01:00)**

- [ ] 23:30: FTD-Active outside interface: no shutdown
    ```
    # FMC  to  Devices  to  FTD-Mumbai-01  to  Interfaces  to  outside  to  Edit
    # Status: Enabled  to  Save  to  Deploy
    ```
- [ ] 23:35: Verify FTD routing table (show route)
- [ ] 23:40: Test internet connectivity from FTD (ping 8.8.8.8)
- [ ] 23:45: Enable inside interface on FTD
- [ ] 23:50: First user traffic test (NOC laptop  to  internet)
- [ ] 23:55: Verify FTD logs (connections appearing in FMC)
- [ ] 00:00: **Checkpoint 1**: Basic connectivity working?
- [ ] 00:10: Test VPN connection (remote user via AnyConnect)
- [ ] 00:20: Test site-to-site VPN (Mumbai ↔ London)
- [ ] 00:30: Verify SGT tagging (FMC  to  Context Explorer  to  SGTs visible)
- [ ] 00:45: Test critical applications (ERP, CRM, email)
- [ ] 01:00: **Checkpoint 2**: All tests passed?

**Phase 4: Validation (01:00-04:00)**

- [ ] 01:15: Performance baseline (show traffic  to  compare with ASA)
- [ ] 01:30: Check HA failover (test switch to standby unit)
- [ ] 01:45: HA failback (switch back to primary)
- [ ] 02:00: Review FMC dashboards (connection count, threat blocks)
- [ ] 02:30: **Checkpoint 3**: Performance acceptable?
- [ ] 03:00: Monitoring soak test (let traffic run, watch for errors)
- [ ] 03:30: Final validation checks (no denied connections, no errors)
- [ ] 04:00: **GO/NO-GO**: Commit or rollback?

**Phase 5: Finalization (04:00-06:00)**

- [ ] 04:05: Re-enable monitoring alerts
- [ ] 04:10: Update documentation (FTD IPs, configs)
- [ ] 04:15: Update network diagrams
- [ ] 04:20: Send "Migration Complete" email to stakeholders
- [ ] 04:30: NOC begins 24-hour monitoring period
- [ ] 05:00: Debrief call (lessons learned)
- [ ] 06:00: **Migration complete** ✅

**Phase 6: Rollback (if needed)**

- [ ] Disconnect FTD outside interface
- [ ] Reconnect ASA outside interface
- [ ] Enable ASA interfaces (no shutdown)
- [ ] Verify ASA traffic (should resume immediately)
- [ ] Document rollback reason
- [ ] Schedule post-mortem meeting

---

### Appendix C: Complete Configuration Examples

#### **C.1: FTD Interface Configuration (Mumbai HQ)**

```
# FMC  to  Devices  to  ftd-mumbai-01  to  Interfaces

Interface: outside
  Name: outside
  Security Zone: outside-zone
  IPv4 Address: 203.0.113.10/30 (static, from ISP)
  IPv6 Address: (none)
  Enabled: Yes
  MTU: 1500
  
Interface: inside
  Name: inside
  Security Zone: inside-zone
  IPv4 Address: 10.252.1.254/24
  IPv6 Address: (none)
  Enabled: Yes
  MTU: 1500
  
Interface: dmz
  Name: dmz
  Security Zone: dmz-zone
  IPv4 Address: 10.252.200.254/24
  Enabled: Yes
  MTU: 1500
```

#### **C.2: Duo authproxy.cfg (Complete)**

```ini
[main]
debug=false
log_auth_events=true
log_sslkeyfile=false
log_max_files=6
log_max_size=10485760

[radius_server_auto]
ikey=DI1234567890ABCDEF12
skey=abc123def456ghi789jkl012mno345pqr678stu901
api_host=api-12345678.duosecurity.com
radius_ip_1=10.252.1.20
radius_ip_2=10.252.1.21
radius_secret=SharedSecret123!
port=1812
failmode=safe
client=ad_client

[ad_client]
host=10.252.1.10
service_account_username=svc-duo@abhavtech.local
service_account_password_protected=[encrypted]
search_dn=DC=abhavtech,DC=local
security_group_dn=CN=VPN-Users,OU=Security Groups,DC=abhavtech,DC=local
transport=starttls
ssl_verify_hostname=true
timeout=60
```

---

### Appendix D: Performance Baselines

#### **ASA vs FTD Performance Comparison (Mumbai HQ)**

| Metric | ASA 5525-X (Before) | FTD FPR-2140 (After) | Improvement |
|--------|-------------------|-------------------|-------------|
| Throughput (Avg) | 450 Mbps | 520 Mbps | +15.6% |
| Throughput (Peak) | 720 Mbps | 950 Mbps | +31.9% |
| Concurrent Connections | 1,234 | 1,456 | +18.0% |
| New Connections/sec | 156 | 198 | +26.9% |
| CPU Utilization (Avg) | 28% | 18% | -35.7% (lower is better) |
| Memory Used | 6.1 GB / 8 GB | 12.3 GB / 32 GB | More headroom |
| VPN Throughput | 380 Mbps | 580 Mbps | +52.6% |
| Latency (Avg) | 3.2 ms | 2.1 ms | -34.4% (lower is better) |

**Conclusion:** FTD FPR-2140 outperforms ASA 5525-X across all metrics

---

### Appendix E: Compliance Mapping

**Zero Trust Implementation  to  Compliance Standards:**

| Standard | Requirement | Abhavtech Control | Evidence |
|----------|------------|------------------|----------|
| **PCI-DSS v4.0** | 8.3: Multi-factor authentication | Duo MFA enforced (100% coverage) | Duo admin console reports |
| **PCI-DSS v4.0** | 1.2.1: Firewall at each internet connection | FTD at all 18 sites | FMC device inventory |
| **PCI-DSS v4.0** | 11.4: Intrusion detection/prevention | FTD IPS enabled globally | FMC IPS policy |
| **SOC2** | CC6.1: Logical access controls | ISE 802.1X + Duo MFA + SGTs | ISE policies + Duo logs |
| **SOC2** | CC7.2: Threat detection and response | XDR automated workflows | SecureX workflow logs |
| **GDPR** | Art. 32: Security of processing | Zero Trust architecture | Architecture docs |
| **NIST 800-207** | Zero Trust principles | Identity-centric, continuous verification | Full implementation |

---

**END OF DOCUMENT 1.B**

---

*© 2025 Abhavtech.com - Document 1.B: Zero Trust Architecture - Detailed Implementation Guide v1.0*  
*Companion to Document 1: Zero Trust Architecture*  


