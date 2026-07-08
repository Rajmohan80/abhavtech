# Additional Design Elements

<span class="ai-badge">AI-Assisted Documentation</span>

---
This document covers the remaining design elements that were not fully addressed:
1. Monitoring Infrastructure (NetFlow, SNMP, Syslog)
2. Backup & Disaster Recovery
3. QoS Policy Design
4. Load Balancing (ISE PSN)
5. Network Automation
6. Missing Capacity Planning Items

## SECTION 1: MONITORING INFRASTRUCTURE

### 1.1 SYSLOG INFRASTRUCTURE

Purpose: Centralized logging for all network devices, security events, fabric operations

Architecture:
```text
┌──────────────────────────────────────────────────────────────┐
│  Primary Syslog Server (Mumbai)                              │
│  ├─ Platform: Syslog-ng on Linux (Ubuntu 22.04 LTS)         │
│  ├─ IP Address: 10.252.10.30                                │
│  ├─ Storage: 10 TB SSD (RAID 10)                            │
│  ├─ Retention: 90 days local, 1 year archive (S3)           │
│  ├─ Capacity: 500 GB logs/day                               │
│  └─ Cost: $X,XXX(server + storage)                        │
└──────────────────────────────────────────────────────────────┘
                         │
                    Replication
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  Secondary Syslog Server (Chennai)                           │
│  ├─ Platform: Syslog-ng on Linux                            │
│  ├─ IP Address: 10.252.12.30                                │
│  ├─ Storage: 5 TB SSD                                       │
│  ├─ Retention: 30 days local                                │
│  └─ Cost: $X,XXX                                            │
└──────────────────────────────────────────────────────────────┘
```

Log Sources:
- All network devices (switches, routers, WLC, firewalls)
- DNAC (Assurance, Provisioning, Policy logs)
- ISE (AAA logs, profiling, posture, TrustSec)
- Fabric events (LISP, VXLAN, host mobility)

Log Categorization:
- Severity 0-2 (Emergency, Alert, Critical): Real-time alerts to NOC
- Severity 3-4 (Error, Warning): Stored for analysis
- Severity 5-7 (Notice, Info, Debug): Filtered, stored for troubleshooting

Integration:
- SIEM: Splunk Enterprise (ingests syslog)
- Ticketing: ServiceNow (auto-ticket for critical events)
- Dashboard: Grafana + Loki (log visualization)

### 1.2 NETFLOW COLLECTION

Purpose: Traffic analytics, capacity planning, security anomaly detection

Architecture:
```text
┌──────────────────────────────────────────────────────────────┐
│  NetFlow Collector (Mumbai)                                  │
│  ├─ Platform: Cisco Stealthwatch (Secure Network Analytics) │
│  ├─ Flow Collection Manager (FCM): 10.252.10.40             │
│  ├─ Stealthwatch Management Console (SMC): 10.252.10.41     │
│  ├─ Capacity: 100,000 flows/second                          │
│  ├─ Storage: 20 TB (30 days flow retention)                 │
│  └─ Cost: $X,XXX(appliance + licensing)                   │
└──────────────────────────────────────────────────────────────┘
```

Flow Exporters:
- Border Nodes: Export all north-south traffic (to/from fabric)
- Edge Nodes: Export east-west traffic (within fabric)
- Firewalls: Export denied flows (security events)
- WLC: Export wireless client flows

NetFlow Version:
- Flexible NetFlow (FNF) on Cisco devices
- Exports: v9 or IPFIX (Internet Protocol Flow Information Export)

Use Cases:
- Identify top talkers (bandwidth hogs)
- Detect DDoS attacks (abnormal flow patterns)
- Capacity planning (trend analysis)
- Security forensics (who talked to whom, when)
- Application visibility (NBAR2 classification)

### 1.3 SNMP MONITORING

Purpose: Device health monitoring, performance metrics, fault management

Architecture:
```text
┌──────────────────────────────────────────────────────────────┐
│  SNMP Manager (Mumbai)                                        │
│  ├─ Platform: PRTG Network Monitor (preferred)              │
│  │   OR LibreNMS (open source alternative)                  │
│  ├─ IP Address: 10.252.10.50                                │
│  ├─ Polling Interval: 5 minutes (standard metrics)          │
│  ├─ Trap Receiver: Real-time alerts                         │
│  ├─ Monitored Devices: 700+ (switches, routers, APs, etc.)  │
│  └─ Cost: $X,XXX(PRTG licenses) OR $X,XXX(LibreNMS)          │
└──────────────────────────────────────────────────────────────┘
```

Monitored Metrics:
- CPU utilization (threshold: >80% for 15 min)
- Memory utilization (threshold: >90%)
- Interface utilization (threshold: >70% sustained)
- Interface errors (CRC, drops, runts)
- Temperature sensors (threshold: >70°C)
- Power supply status (alert on PSU failure)
- Fan speed (alert on fan failure)

SNMP Configuration:
- Version: SNMPv3 (encrypted, authenticated)
- Community Strings: NEVER use (insecure)
- Users: 
  - Read-Only: abhavtech-noc-ro
  - Read-Write: abhavtech-noc-rw (limited use)
- Authentication: SHA-256
- Encryption: AES-256

Integration:
- DNAC Assurance (already collects SNMP data)
- Duplicate to PRTG for redundancy
- Alerts via email, SMS, PagerDuty

### 1.4 DNAC ASSURANCE (PRIMARY MONITORING)

DNAC Assurance provides:
- Path Trace: End-to-end path visualization
- Network Health Scoring: 0-100 score per site/device
- AI/ML Anomaly Detection: Proactive issue identification
- Client 360: Per-client troubleshooting
- Application Health: Application performance monitoring
- Wireless Health: AP coverage, client connectivity

Recommendation: Use DNAC Assurance as PRIMARY monitoring tool
- Syslog/NetFlow/SNMP as SECONDARY for correlation & forensics

## SECTION 2: BACKUP & DISASTER RECOVERY

### 2.1 DNAC BACKUP STRATEGY

Backup Components:
- Configuration database (all device configs)
- Assurance data (network health, issues)
- Application policies
- User-defined workflows
- Image repository (IOS-XE images)

Backup Schedule:
- Incremental: Daily at 2 AM (changes only)
- Full Backup: Weekly on Sunday at 1 AM
- Retention: 30 daily, 12 weekly, 12 monthly

Backup Destination:
```text
┌──────────────────────────────────────────────────────────────┐
│  Primary Backup Target (Mumbai)                              │
│  ├─ Platform: NetBackup Appliance (Veritas)                 │
│  ├─ IP Address: 10.252.10.60                                │
│  ├─ Storage: 50 TB (deduplicated, compressed)               │
│  ├─ Protocol: SFTP from DNAC                                │
│  ├─ Encryption: AES-256 at rest                             │
│  └─ Cost: $X,XXX                                           │
└──────────────────────────────────────────────────────────────┘
                         │
                    Replication
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  Offsite Backup (AWS S3)                                     │
│  ├─ Location: ap-south-1 (Mumbai region)                    │
│  ├─ Storage Class: S3 Glacier (long-term)                   │
│  ├─ Retention: 1 year                                       │
│  ├─ Cost: ~$X,XXX/month (~$X,XXX/year)                        │
│  └─ Disaster Recovery: RTO 4 hours, RPO 24 hours            │
└──────────────────────────────────────────────────────────────┘
```

Disaster Recovery Procedure:
1. Spin up DR DNAC cluster in London (standby, already deployed)
2. Restore latest backup from S3 to London DNAC
```text
3. Update DNS (dnac.corp.local → London VIP)
```
4. Devices reconnect to London DNAC
5. RTO: 4 hours (restore time)
6. RPO: 24 hours (last backup age)

### 2.2 ISE BACKUP STRATEGY

ISE Backup Components:
- Configuration (policies, rules, admin users)
- Operational database (endpoint database, sessions)
- Logs (AAA logs, profiling data)

Backup Schedule:
- Configuration: Daily at 3 AM (incremental)
- Operational DB: Weekly (Sunday 2 AM)
- Logs: No backup (30 days retention on ISE MnT node)

Backup Destination:
```text
┌──────────────────────────────────────────────────────────────┐
│  ISE Backup Repository (Mumbai)                              │
│  ├─ Platform: SFTP Server (Linux)                           │
│  ├─ IP Address: 10.252.10.70                                │
│  ├─ Storage: 10 TB                                          │
│  ├─ Encryption: ISE built-in AES-256                        │
│  ├─ Retention: 30 days                                      │
│  └─ Cost: $X,XXX                                            │
└──────────────────────────────────────────────────────────────┘
```

ISE Disaster Recovery:
- Automatic failover: Secondary PAN (Chennai) takes over if Primary fails
- Failover time: <5 minutes (automatic promotion)
- No manual intervention required
- PSN nodes continue operating (stateless, no DR needed)

### 2.3 NETWORK DEVICE CONFIGURATION BACKUP

DNAC Auto-Backup:
- DNAC automatically backs up all managed device configs
- Triggered: On every config change + daily schedule
- Stored: DNAC database (part of DNAC backup)
- Version Control: Up to 50 versions per device

Additional Backup (Redundancy):
```text
┌──────────────────────────────────────────────────────────────┐
│  RANCID (Really Awesome New Cisco confIg Differ)             │
│  ├─ Platform: RANCID on Linux (open source)                 │
│  ├─ IP Address: 10.252.10.80                                │
│  ├─ Storage: 500 GB (text configs, small)                   │
│  ├─ Frequency: Daily at 4 AM                                │
│  ├─ Version Control: Git repository                         │
│  ├─ Diff Alerts: Email on config changes                    │
│  └─ Cost: $X,XXX(open source)                                  │
└──────────────────────────────────────────────────────────────┘
```

Why RANCID in addition to DNAC?
- Redundancy (if DNAC fails, configs safe)
- Git integration (easy diff, rollback)
- Open source (no vendor lock-in)

## SECTION 3: QoS POLICY DESIGN

### 3.1 QoS CLASSIFICATION (MARKING)

Layer 3 QoS (DSCP Marking):

| Application Type | DSCP Value | DSCP Name | Queue | % Bandwidth | Use Case |
|---|---|---|---|---|---|
| Voice (RTP) | 46 | EF | Priority | 20% | VoIP calls |
| Voice Signaling (SIP) | 24 | CS3 | Control | 5% | Call setup |
| Video Conferencing | 34 | AF41 | Video | 30% | Zoom, Webex |
| Interactive (Citrix) | 26 | AF31 | Interactive | 15% | VDI, remote desktop |
| Business Critical (SAP) | 18 | AF21 | Business | 20% | ERP, CRM apps |
| Best Effort (Web) | 0 | BE | Default | 10% | HTTP, HTTPS |
| Background (Backup) | 8 | CS1 | Scavenger | 0% (leftover) | Nightly backups |

Layer 2 QoS (CoS Marking):
- Voice: CoS 5 (EF equivalent)
- Video: CoS 4
- Business: CoS 3
- Default: CoS 0

### 3.2 QoS CONFIGURATION (FABRIC-WIDE)

Edge Nodes (C9300):
- Classification: Trust DSCP from endpoints
- Re-marking: If endpoint sends wrong DSCP, re-mark based on NBAR2 application recognition
- Queuing: 8 queues (priority, video, business, default, scavenger)
- Shaping: Police traffic per application (e.g., backup limited to 1 Mbps during business hours)

Example Edge QoS Policy:
  class-map match-any VOICE
    match dscp ef
  class-map match-any VIDEO
    match dscp af41
  policy-map EDGE-QOS
    class VOICE
      priority percent 20
    class VIDEO
      bandwidth percent 30
    class class-default
      bandwidth percent 10

Control Plane / Border Nodes (C9500):
- Classification: Trust DSCP from fabric
- Priority Queue: Voice (strict priority, 20%)
- Remaining queues: Weighted Fair Queuing
- No policing (high-speed core, no congestion expected)

WAN Links (MPLS, DIA):
- Shaping: 10 Gbps MPLS shaped to subscribed rate (e.g., 8 Gbps)
- Queuing: LLQ (Low Latency Queue) for voice
- WRED (Weighted Random Early Detection) for TCP flows
- Policing: Deny traffic exceeding subscribed rate

### 3.3 QoS FOR WIRELESS (WLC)

WMM (Wi-Fi Multimedia):
- Voice: WMM VO (highest priority)
- Video: WMM VI
- Best Effort: WMM BE
- Background: WMM BK

WLC QoS Profile:
- Platinum: Voice (DSCP EF)
- Gold: Video (DSCP AF41)
- Silver: Business (DSCP AF21)
- Bronze: Best Effort (DSCP 0)

Call Admission Control (CAC):
- Max voice clients per AP: 12 simultaneous calls
- Max bandwidth per AP: 50% for voice (prevents congestion)

### 3.4 APPLICATION QoS POLICY (DNAC-PUSHED)

DNAC Application Policy:
- DNAC identifies applications via NBAR2 (deep packet inspection)
- Automatically applies QoS marking based on application
```text
- Example: Zoom traffic → Mark as DSCP AF41 (video)

Business-Relevant Applications (Pre-Defined):
- webex-meetings → DSCP AF41
- ms-teams → DSCP AF41
- salesforce → DSCP AF21
- office-365 → DSCP AF21
- youtube → DSCP 0 (best effort, not business)

Custom Applications:
- Custom App "SAP-ERP" → TCP port 3200 → Mark DSCP AF21
```

## SECTION 4: LOAD BALANCING (ISE PSN)

### 4.1 ISE PSN LOAD BALANCER REQUIREMENT

Why Load Balancer?
- Multiple PSN nodes per site (Mumbai: 2, Chennai: 2)
- Network devices (switches, WLC) need single RADIUS IP
- Load balancer distributes RADIUS requests across PSNs
- Health checks: Remove failed PSN from pool automatically

Platform Options:

Option 1: F5 BIG-IP Virtual Edition (VE)
- Platform: VM on ESXi
- Capacity: 200 Mbps throughput (sufficient for RADIUS)
- Features:
  - Layer 4 load balancing (UDP 1812 RADIUS)
  - Health checks (RADIUS test auth)
  - Persistence (source IP hash for session affinity)
  - SSL offload (not needed for RADIUS)
- Cost: $X,XXX(perpetual license)

Option 2: HAProxy (Open Source)
- Platform: Linux VM
- Capacity: 1 Gbps+ (no licensing limits)
- Features: Same as F5 (Layer 4 LB, health checks)
- Cost: $X,XXX(open source)
- Consideration: Less GUI, more CLI config

RECOMMENDATION: F5 BIG-IP VE (enterprise support, proven)

### 4.2 LOAD BALANCER CONFIGURATION

Virtual Server (VIP):
- Mumbai PSN VIP: 10.252.11.150 (RADIUS auth + accounting)
- Chennai PSN VIP: 10.252.12.150

Pool Members:
- Mumbai Pool:
  - MUM-ISE-PSN-01: 10.252.11.141:1812 (auth), :1813 (acct)
  - MUM-ISE-PSN-02: 10.252.11.142:1812 (auth), :1813 (acct)
- Chennai Pool:
  - CHN-ISE-PSN-01: 10.252.12.141:1812
  - CHN-ISE-PSN-02: 10.252.12.142:1812

Load Balancing Algorithm:
- Method: Round-robin (equal distribution)
- Persistence: Source IP hash (5 min timeout)
  - Why? Same device should hit same PSN for session continuity

Health Check:
- Type: RADIUS test authentication
- Interval: 10 seconds
- Timeout: 3 seconds
- Retries: 3
- Test User: ise-health-check@corp.local (dummy user)
- Action: If PSN fails health check, remove from pool

Network Device Configuration:
- RADIUS Server: 10.252.11.150 (VIP, not individual PSN IPs)
- Shared Secret: Same for all PSNs
- Timeout: 5 seconds
- Retries: 2 (will try PSN-02 if PSN-01 fails)

### 4.3 ISE NODE GROUP (ALTERNATIVE TO LOAD BALANCER)

ISE Built-in Feature: Node Groups
- ISE can internally load-balance across PSN nodes
- Network device configured with ALL PSN IPs (multi-server config)
- Device tries PSN-01, if timeout, tries PSN-02
- No external load balancer needed

Example Switch Config:
  aaa group server radius ISE-MUMBAI
    server 10.252.11.141 auth-port 1812 acct-port 1813
    server 10.252.11.142 auth-port 1812 acct-port 1813

Consideration:
- Simpler (no load balancer)
- Device-side load balancing (less optimal)
- Recommended for <10 PSN nodes
- F5 recommended for >10 PSN nodes or when centralized visibility needed

## SECTION 5: NETWORK AUTOMATION (FUTURE STATE)

### 5.1 ANSIBLE FOR DAY-2 OPERATIONS

Use Cases:
- Bulk VLAN provisioning (add VLAN to 100 switches)
- ACL updates (push new ACL to all borders)
- Config compliance (ensure all devices have banner, NTP, DNS)
- Reporting (generate inventory reports)

Platform:
- Ansible Tower (Red Hat) OR AWX (open source)
- Cost: $X,XXX/year (Ansible Tower) OR $X,XXX(AWX)

Integration:
- DNAC Templates: Use DNAC for fabric config
- Ansible: Use for non-fabric config (e.g., legacy switches)

### 5.2 PYTHON SCRIPTS FOR CUSTOM WORKFLOWS

Use Cases:
- Custom DNAC API integrations
- Automated troubleshooting scripts
- ISE endpoint cleanup (remove old endpoints)

Example: Auto-remediate down interfaces
  1. Script queries DNAC for down interfaces
  2. Checks if interface should be up (based on inventory)
  3. Auto-creates ServiceNow ticket
  4. Sends alert to NOC

## SECTION 6: CAPACITY PLANNING ITEMS WE MISSED

### 6.1 RACK SPACE & POWER PLANNING

Mumbai Data Center Rack:
- Total Devices: 14 (Border×2, CP×2, Intm×2, WLC×2, FW×3, Servers)
- Rack Units: 14 × 1U = 14U (plus 6U for cable mgmt, UPS) = 20U total
- Racks Required: 1 × 42U rack (sufficient)

Power Consumption (Mumbai):
- Border Nodes: 2 × 350W = 700W
- CP Nodes: 2 × 350W = 700W
- Intermediate: 2 × 350W = 700W
- WLC: 2 × 450W = 900W
- Firewalls: 3 × 750W = 2,250W
- Servers (DDI, monitoring): 5 × 300W = 1,500W
- Total: 6,750W
- UPS Sizing: 10 kVA (1.5× total load)
- Cooling: 23,000 BTU/hr (0.7 tons AC)

### 6.2 BANDWIDTH GROWTH PROJECTION

Current: 40 Gbps (Mumbai peak)
Year 1: 48 Gbps (+20% user growth)
Year 2: 58 Gbps (+20% growth + video adoption)
Year 3: 70 Gbps (+20% growth + IoT expansion)

Recommendation: Upgrade border to C9500-48Y4C (880 Gbps) at Year 2
OR Add 3rd border node in active-active

### 6.3 ENDPOINT GROWTH (ISE LICENSING)

Current: 12,000 endpoints (Mumbai) + 6,000 (Chennai) = 18,000
License: ISE Plus (25,000 endpoints) = $X,XXX/year
Year 3 Projection: 30,000 endpoints
Action: Upgrade to 50,000 endpoint license at Year 2 (~$X,XXX/year)

## SECTION 7: SUMMARY - MISSING ITEMS NOW COVERED

Previously Missing, NOW ADDRESSED:
✓ Syslog infrastructure (Mumbai + Chennai)
✓ NetFlow collection (Stealthwatch)
✓ SNMP monitoring (PRTG or LibreNMS)
✓ DNAC backup strategy (NetBackup + S3)
✓ ISE backup strategy (SFTP + DR)
✓ QoS policy (DSCP marking, queuing, shaping)
✓ ISE PSN load balancing (F5 BIG-IP VE)
✓ Network automation (Ansible, Python)
✓ Rack space & power planning
✓ Bandwidth growth projection
✓ Endpoint licensing growth

Additional Items for Future Consideration:
⚠ IPv6 dual-stack design (if required)
⚠ Multicast routing for video (if required)
⚠ SD-WAN integration details (Viptela/Meraki)
⚠ Guest portal customization (branding, workflows)
⚠ Compliance reporting (PCI-DSS, GDPR)
⚠ Network segmentation for PCI environment
⚠ Wireless location services (CMX, DNA Spaces)

COST SUMMARY - ADDITIONAL INFRASTRUCTURE

Monitoring Infrastructure:
- Syslog Servers: $X,XXX- NetFlow (Stealthwatch): $X,XXX- SNMP (PRTG): $X,XXX
Backup Infrastructure:
- NetBackup Appliance: $X,XXX- SFTP Server (ISE): $X,XXX- RANCID (Open Source): $X,XXX
Load Balancing:
- F5 BIG-IP VE: $X,XXX
Network Automation:
- Ansible Tower: $X,XXX/year

Total Additional CapEx: $X,XXXTotal Additional OpEx: $X,XXX/year

GRAND TOTAL PROJECT (INCLUDING FIREWALL + MONITORING):
- Infrastructure: $X,XXX(from spreadsheet)
- Firewalls: $X,XXX- Monitoring/Backup/LB: $X,XXX- GRAND TOTAL CapEx: $X,XXX
Annual OpEx:
- Licensing: $X,XXX- Firewall subscriptions: $X,XXX- Automation: $X,XXX- TOTAL OpEx/year: $X,XXX
3-Year TCO: $X,XXX ($X,XXX× 3) = $X,XXX
END OF ADDITIONAL DESIGN ELEMENTS
