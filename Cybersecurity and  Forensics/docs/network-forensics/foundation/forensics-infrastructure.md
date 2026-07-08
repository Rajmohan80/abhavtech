# Forensics Infrastructure

## 1.1 Forensics Infrastructure Overview

Abhavtech's network forensics capability is built on a **multi-layered architecture** that integrates evidence collection, AI-enhanced analysis, blockchain-based chain of custody, and legal compliance. The infrastructure spans three primary data centers and supports investigations across 6 regional hub sites plus 40+ branch locations.

### 1.1.1 Forensics Platform Components

**Primary Forensics Data Center: New Jersey (NJ-DC)**

| Component | Specification | Purpose | Location |
|-----------|--------------|---------|----------|
| **Forensics Workstation Cluster** | 3x Dell PowerEdge R750 (32 vCPU, 256GB RAM, 10TB NVMe) | Primary investigation platform | NJ-DC Secure Room 5A |
| **Splunk Heavy Forwarder (Forensics)** | Virtual (16 vCPU, 64GB RAM, 5TB SSD) | Dedicated forensics log collection | NJ-DC VMware Cluster |
| **Evidence Vault (Primary)** | NetApp AFF A400 (100TB usable, encrypted) | Write-once evidence storage | NJ-DC Storage SAN |
| **SPAN Aggregation Switch** | Cisco Nexus 9300 (48x 10GbE + 6x 100GbE) | Traffic mirroring for PCAP | NJ-DC Core Network |
| **Blockchain Evidence Node (Primary)** | Ubuntu 22.04 LTS (8 vCPU, 32GB RAM, 2TB SSD) | Blockchain ledger primary node | NJ-DC Security Zone |

**Secondary Forensics Data Center: London (LON-DC)**

| Component | Specification | Purpose | Location |
|-----------|--------------|---------|----------|
| **Forensics Workstation (DR)** | Dell PowerEdge R750 (32 vCPU, 256GB RAM, 10TB NVMe) | Secondary investigation platform | LON-DC Secure Room 2B |
| **Evidence Vault (DR)** | NetApp AFF A400 (100TB usable, encrypted) | Geo-redundant evidence storage | LON-DC Storage SAN |
| **Blockchain Evidence Node (Secondary)** | Ubuntu 22.04 LTS (8 vCPU, 32GB RAM, 2TB SSD) | Blockchain ledger secondary node | LON-DC Security Zone |

**Regional Forensics Capabilities**

Each hub site (Mumbai, Chennai, Frankfurt, Dallas) maintains:
- SPAN port capability on core switches for local packet capture
- Splunk Universal Forwarder with forensics app
- Local evidence collection kit (encrypted USB drives, write blockers)
- 24-hour evidence retention buffer before transmission to primary vault

### 1.1.2 Network Topology for Evidence Collection

```
┌─────────────────────────────────────────────────────────────────────────┐
│              ABHAVTECH FORENSICS COLLECTION TOPOLOGY                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PRODUCTION NETWORK                                                     │
│  ──────────────────                                                     │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────┐          │
│  │  Campus Fabric (SD-Access)                               │          │
│  │  ────────────────────────                                │          │
│  │  • C9500 Core (Border Nodes)                             │          │
│  │  • C9300 Access (Fabric Edge)                            │          │
│  │  • C9800 WLC (Wireless)                                  │          │
│  │                                                           │          │
│  │  SPAN Configuration:                                     │          │
│  │  ├─ Border Node SPAN → Forensics Aggregation Switch     │          │
│  │  ├─ Edge Node ERSPAN → Forensics Workstation            │          │
│  │  └─ WLC RSPAN → Forensics Workstation                   │          │
│  └────────────────────────┬─────────────────────────────────┘          │
│                           │                                             │
│                           │ SPAN                                        │
│                           │                                             │
│  ┌────────────────────────▼─────────────────────────────────┐          │
│  │  Forensics Aggregation (Out-of-Band)                     │          │
│  │  ────────────────────────────────────                    │          │
│  │  Nexus 9300 (Forensics VLAN 999)                         │          │
│  │  • All SPAN traffic aggregated                           │          │
│  │  • No routing to production                              │          │
│  │  • Isolated management                                   │          │
│  └────────────────────────┬─────────────────────────────────┘          │
│                           │                                             │
│                           │ 10GbE                                       │
│                           │                                             │
│  ┌────────────────────────▼─────────────────────────────────┐          │
│  │  Forensics Workstation Cluster (3 nodes)                 │          │
│  │  ────────────────────────────────────────                │          │
│  │  NIC1: 10GbE (SPAN ingress)                              │          │
│  │  NIC2: 1GbE (Management)                                 │          │
│  │  NIC3: 10GbE (Evidence Vault)                            │          │
│  │                                                           │          │
│  │  Software Stack:                                         │          │
│  │  • Ubuntu 22.04 LTS                                      │          │
│  │  • Wireshark 4.x                                         │          │
│  │  • tshark (CLI analysis)                                 │          │
│  │  • Suricata IDS                                          │          │
│  │  • Zeek (Bro) network security monitor                   │          │
│  │  • Python 3.11 (analysis scripts)                        │          │
│  │  • Splunk Universal Forwarder                            │          │
│  └────────────────────────┬─────────────────────────────────┘          │
│                           │                                             │
│                           │ 10GbE (iSCSI)                               │
│                           │                                             │
│  ┌────────────────────────▼─────────────────────────────────┐          │
│  │  Evidence Vault (NetApp AFF A400)                        │          │
│  │  ─────────────────────────────────────                   │          │
│  │  • 100TB usable (RAID-DP)                                │          │
│  │  • Write-once, read-many (WORM)                          │          │
│  │  • AES-256 encryption at rest                            │          │
│  │  • SnapLock Compliance (legal hold)                      │          │
│  │  • Replication to London DC (async)                      │          │
│  └──────────────────────────────────────────────────────────┘          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.1.3 Evidence Collection Points

**Network Layer Evidence:**

| Source | Collection Method | Evidence Type | Retention | Use Cases |
|--------|------------------|---------------|-----------|-----------|
| Catalyst Center Assurance | REST API export | Device telemetry, client health, issue timeline | 90 days | Network performance issues, client connectivity |
| SD-WAN vManage | REST API export | DPI data, application flows, OMP routes, IPsec logs | 90 days | WAN attacks, tunnel hijacking, routing anomalies |
| ISE | Syslog + ERS API | AAA logs, RADIUS, profiler, pxGrid sessions | 180 days | Authentication bypass, rogue devices, policy violations |
| FTD Firewalls | Syslog + eStreamer | Connection events, IPS alerts, file analysis | 1 year | Malware, C2, exfiltration, lateral movement |
| Wireless LAN Controller | RSPAN + Syslog | Client associations, roaming, RF metrics | 90 days | Wireless attacks, rogue APs, client issues |
| Border Nodes (C9500) | SPAN + NetFlow | Inter-VN traffic, external connections | 30 days | Data exfiltration, unusual traffic patterns |

**Security Layer Evidence:**

| Source | Collection Method | Evidence Type | Retention | Use Cases |
|--------|------------------|---------------|-----------|-----------|
| XDR (SecureX) | API export | Ribbons, alerts, playbook actions, IOCs | 2 years | Cross-platform correlation, incident timeline |
| AMP for Endpoints | AMP Orbital + API | File trajectories, process executions, network connections | 1 year | Endpoint malware, lateral movement, process analysis |
| Umbrella | S3 export | DNS queries, blocked domains, proxy logs | 1 year | C2 domains, DGA detection, data exfiltration |
| Duo Admin Panel | API export | Auth logs, device trust, MFA challenges | 180 days | MFA bypass, impossible travel, session hijacking |
| Splunk Enterprise | Native storage | Correlated events, MLTK analytics, timelines | 1 year (hot) + 3 years (cold) | All investigations - primary SIEM |

**Application Layer Evidence:**

| Source | Collection Method | Evidence Type | Retention | Use Cases |
|--------|------------------|---------------|-----------|-----------|
| ThousandEyes | API export | Network path traces, BGP routes, HTTP archives | 90 days | Path hijacking, ISP issues, SaaS degradation |
| AppDynamics | API export | Transaction traces, SQL queries, error analytics | 30 days | Application performance, database access anomalies |
| Webex Control Hub | CSV export | CDR, CMR, admin audit logs | 90 days | Toll fraud, call quality issues, unauthorized changes |
| Microsoft 365 | Graph API | Azure AD logs, Exchange logs, OneDrive activity | 180 days | Cloud app abuse, data exfiltration, insider threat |

### 1.1.4 AI Engines for Forensic Analysis

Abhavtech leverages **4 AI engines** that provide investigative intelligence during forensic investigations:

**AI Engine 1: Deep Network Model (DNM) - Catalyst Center**

```
Purpose: Network anomaly detection and failure prediction
Forensic Use Cases:
├─ Identify abnormal traffic patterns pre-incident
├─ Predict device failures that contributed to incidents
├─ Baseline normal behavior for comparison during investigation
└─ Detect policy violations and misconfigurations

Example Output:
{
  "anomaly_type": "unusual_traffic_pattern",
  "entity": "Mumbai-FL3-C9300-IDF1",
  "baseline_tx_rate": "450 Mbps",
  "observed_tx_rate": "2.3 Gbps",
  "deviation": "5.1 standard deviations",
  "timeline": "2026-01-18T14:22:00Z to 14:28:00Z",
  "confidence": 0.94,
  "recommendation": "Investigate spike - potential data exfiltration"
}
```

**AI Engine 2: Splunk MLTK (Machine Learning Toolkit)**

```
Purpose: Behavioral analytics and insider threat detection
Forensic Use Cases:
├─ User behavioral baselining (UEBA)
├─ Anomaly detection across all log sources
├─ Predictive alerting for security events
└─ Automated correlation of disparate events

Example MLTK Models for Forensics:
├─ Auth-Anomaly: Unusual authentication patterns
├─ Traffic-Baseline: Network utilization anomalies
├─ User-Behavior: Insider threat scoring
├─ Lateral-Movement: East-west traffic analysis
└─ Exfiltration-Detect: Large outbound data transfers

Example SPL Query:
| tstats count WHERE index=network BY src_ip dest_ip bytes
| stats avg(bytes) AS avg_bytes stdev(bytes) AS stdev_bytes BY src_ip
| eval threshold = avg_bytes + (3 * stdev_bytes)
| where bytes > threshold
| table src_ip dest_ip bytes avg_bytes threshold
```

**AI Engine 3: Cognition Engine - AppDynamics**

```
Purpose: Application performance anomaly detection
Forensic Use Cases:
├─ Detect application-layer attacks (SQL injection, code injection)
├─ Identify unusual database query patterns
├─ Correlate application errors with network/security events
└─ Transaction-level forensics for business logic abuse

Example Output:
{
  "anomaly": "sql_query_pattern_change",
  "application": "ERP-Billing",
  "business_transaction": "Generate-Invoice",
  "baseline_query_time": "45ms",
  "observed_query_time": "8200ms",
  "deviation": "182x baseline",
  "potential_cause": "SQL injection or database enumeration",
  "confidence": 0.87
}
```

**AI Engine 4: ThousandEyes AI**

```
Purpose: Network path and ISP issue detection
Forensic Use Cases:
├─ BGP hijacking detection
├─ Path performance degradation analysis
├─ ISP outage correlation
└─ SaaS reachability timeline reconstruction

Example Output:
{
  "alert_type": "path_change",
  "test_name": "Webex-API-Reachability",
  "source_agent": "Mumbai-EA-01",
  "destination": "webex.com",
  "baseline_path": "Tata-MPLS → Singtel → Webex",
  "observed_path": "Tata-MPLS → China-Telecom → Webex",
  "latency_increase": "340ms",
  "event_time": "2026-01-18T14:30:00Z",
  "potential_cause": "BGP route hijacking or ISP routing change"
}
```

### 1.1.5 Forensics Workflow Integration

**Standard Investigation Workflow:**

```
┌────────────────────────────────────────────────────────────────────┐
│                 FORENSICS INVESTIGATION WORKFLOW                   │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ STEP 1: INCIDENT DETECTION                                        │
│ ──────────────────────────                                        │
│ Trigger Sources:                                                  │
│ ├─ XDR Alert (malware, DLP, anomaly)                             │
│ ├─ Splunk MLTK Alert (behavioral anomaly)                        │
│ ├─ DNAC Assurance Alert (network issue)                          │
│ ├─ User Report (help desk ticket)                                │
│ └─ Compliance Requirement (audit, legal hold)                    │
│                                                                    │
│ Action: SOC Analyst creates ServiceNow incident                   │
│         Incident severity determines investigation priority       │
│                                                                    │
│                           ↓                                        │
│                                                                    │
│ STEP 2: EVIDENCE PRESERVATION                                     │
│ ─────────────────────────────                                     │
│ Automated Actions (via XDR Playbook):                             │
│ ├─ Enable SPAN on relevant switch ports                          │
│ ├─ Export logs from all affected platforms to Splunk             │
│ ├─ Snapshot device configurations (DNAC, vManage, ISE)           │
│ ├─ Freeze rotation for relevant log files                        │
│ └─ Initialize blockchain evidence record                         │
│                                                                    │
│ Manual Actions (by forensics analyst):                            │
│ ├─ Document initial observations                                 │
│ ├─ Identify scope (affected systems, users, time window)         │
│ └─ Obtain legal approval if warranted                            │
│                                                                    │
│                           ↓                                        │
│                                                                    │
│ STEP 3: EVIDENCE COLLECTION                                       │
│ ──────────────────────────                                        │
│ Network Evidence:                                                 │
│ ├─ PCAP files from SPAN ports                                    │
│ ├─ NetFlow exports from border nodes                             │
│ ├─ DNAC Assurance timeline export (JSON)                         │
│ ├─ vManage DPI data export                                       │
│ └─ ISE session logs (RADIUS, profiler)                           │
│                                                                    │
│ Security Evidence:                                                │
│ ├─ XDR ribbon export (full incident timeline)                    │
│ ├─ FTD connection logs, IPS alerts                               │
│ ├─ AMP file trajectory and process tree                          │
│ ├─ Umbrella DNS query logs                                       │
│ └─ Duo authentication timeline                                   │
│                                                                    │
│ Application Evidence:                                             │
│ ├─ AppDynamics transaction snapshots                             │
│ ├─ ThousandEyes path trace                                       │
│ ├─ Webex CDR (if voice/collab related)                           │
│ └─ Database audit logs (if data access involved)                 │
│                                                                    │
│ For each evidence file:                                          │
│ ├─ Generate SHA-256 hash                                         │
│ ├─ Record collection timestamp (NTP-synced)                      │
│ ├─ Document custodian (analyst name)                             │
│ └─ Add to blockchain ledger                                      │
│                                                                    │
│                           ↓                                        │
│                                                                    │
│ STEP 4: ANALYSIS & CORRELATION                                    │
│ ─────────────────────────────                                     │
│ AI-Enhanced Analysis:                                             │
│ ├─ DNM: Check for network anomalies in time window               │
│ ├─ MLTK: Run behavioral analytics on user/device                 │
│ ├─ Cognition: Check application performance correlation          │
│ └─ ThousandEyes: Validate network path health                    │
│                                                                    │
│ Manual Analysis:                                                  │
│ ├─ Wireshark PCAP analysis (protocol dissection)                 │
│ ├─ Splunk correlation queries across platforms                   │
│ ├─ Timeline reconstruction (reverse chronological)               │
│ ├─ IOC identification (IPs, domains, file hashes)                │
│ └─ Attack vector determination                                   │
│                                                                    │
│                           ↓                                        │
│                                                                    │
│ STEP 5: DOCUMENTATION & REPORTING                                 │
│ ─────────────────────────────────────                             │
│ Create Forensics Report:                                          │
│ ├─ Executive Summary (non-technical)                             │
│ ├─ Technical Findings (detailed timeline)                        │
│ ├─ Evidence Inventory (with hashes)                              │
│ ├─ Attack Methodology                                             │
│ ├─ Impact Assessment (systems, data, users)                      │
│ ├─ Recommendations (remediation, prevention)                     │
│ └─ Appendices (PCAP samples, logs, screenshots)                  │
│                                                                    │
│ Blockchain Ledger Entry:                                          │
│ ├─ Final evidence hash                                           │
│ ├─ Report hash                                                    │
│ ├─ Investigation closure timestamp                               │
│ └─ Analyst digital signature                                     │
│                                                                    │
│                           ↓                                        │
│                                                                    │
│ STEP 6: LEGAL REVIEW & ARCHIVAL                                   │
│ ────────────────────────────────                                  │
│ If Legal Hold Required:                                          │
│ ├─ Copy all evidence to Legal Hold Repository                    │
│ ├─ Enable SnapLock Compliance (WORM)                             │
│ ├─ Notify Legal Department                                       │
│ └─ Maintain evidence indefinitely                                │
│                                                                    │
│ Standard Archival:                                                │
│ ├─ Move evidence to cold storage (after 90 days)                 │
│ ├─ Maintain blockchain record (permanent)                        │
│ ├─ Update CMDB with lessons learned                              │
│ └─ Close ServiceNow incident                                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## CHAPTER 2: BLOCKCHAIN EVIDENCE FRAMEWORK
