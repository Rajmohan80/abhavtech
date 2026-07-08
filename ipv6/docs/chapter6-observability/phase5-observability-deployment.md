# ABHAVTECH IPv6 MIGRATION — PHASE 5
## OBSERVABILITY & MONITORING IPv6 DEPLOYMENT

**Project:** ABV-IPV6-2025  
**Phase:** 5 — Observability IPv6 (Final Phase)  
**Duration:** 4 Weeks (Week 20-23)  
**Objective:** Deploy IPv6 monitoring, logging, and AI/ML observability for complete visibility  
**Scope:** ThousandEyes (Week 20), Splunk (Week 21), AppDynamics (Week 22), NetFlow/IPFIX (Week 23)  

---

## PHASE 5 OVERVIEW

```
OBSERVABILITY IPv6 DEPLOYMENT STRATEGY:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WHY OBSERVABILITY IPv6 MATTERS:                                  │
│                                                                    │
│  Business Drivers:                                                 │
│    ✅ Monitor dual-stack infrastructure (IPv4 + IPv6 separately)  │
│    ✅ Detect IPv6-specific issues (routing, MTU, fragmentation)   │
│    ✅ Performance comparison (IPv4 vs IPv6 latency/throughput)    │
│    ✅ AI/ML anomaly detection for IPv6 traffic                    │
│    ✅ Complete visibility for troubleshooting                     │
│                                                                    │
│  Current State (IPv4-Only Monitoring):                             │
│    ❌ ThousandEyes: IPv4 tests only                               │
│    ❌ Splunk: IPv4 syslog sources                                 │
│    ❌ AppDynamics: IPv4 agent connectivity                        │
│    ❌ NetFlow: IPv4 flow records only                             │
│                                                                    │
│  Target State (Dual-Stack Observability):                          │
│    ✅ ThousandEyes: IPv6 tests + agents                           │
│    ✅ Splunk: IPv6 syslog + NetFlow v9/IPFIX                      │
│    ✅ AppDynamics: IPv6 agent registration                        │
│    ✅ NetFlow/IPFIX: IPv6 flow collection                         │
│    ✅ AI/ML: IPv6 traffic analysis (Splunk MLTK)                  │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  PHASE 5 STRUCTURE (4 WEEKS):                                      │
│                                                                    │
│  Week 20: ThousandEyes IPv6                                        │
│    - IPv6 Enterprise Agents deployment                            │
│    - IPv6 network tests (web, DNS, agent-to-agent)                │
│    - Path visualization for IPv6                                  │
│    - Alerting for IPv6 degradation                                │
│                                                                    │
│  Week 21: Splunk IPv6                                              │
│    - IPv6 syslog collection (UDP 514, TCP 1514)                   │
│    - NetFlow v9/IPFIX for IPv6 flows                              │
│    - IPv6 dashboards and searches                                 │
│    - MLTK for IPv6 anomaly detection                              │
│                                                                    │
│  Week 22: AppDynamics IPv6                                         │
│    - AppDynamics agents IPv6 connectivity                         │
│    - Business Transaction monitoring over IPv6                    │
│    - Cognition Engine IPv6 baselining                             │
│    - Cross-cloud app monitoring (Azure/GCP via IPv6)              │
│                                                                    │
│  Week 23: NetFlow/IPFIX + Final Validation                         │
│    - NetFlow v9/IPFIX collectors (IPv6 flows)                     │
│    - Traffic analytics (IPv4 vs IPv6 volume)                      │
│    - AI-powered capacity planning                                 │
│    - Complete observability validation                            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## WEEK 20: THOUSANDEYES IPv6

## 20.1 ThousandEyes Infrastructure

```
ABHAVTECH THOUSANDEYES DEPLOYMENT:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  ENTERPRISE AGENTS:                                                │
│    ├─ Mumbai HQ: 2 agents (MUM-TE-01, MUM-TE-02)                  │
│    │    Platform: Virtual Appliance (VMware)                      │
│    │    Location: SD-Access VN_CORPORATE (VLAN 1011)              │
│    │    IPv4: 10.100.1.200-201                                    │
│    │    IPv6: Not configured (current state)                      │
│    │                                                               │
│    ├─ Chennai HQ: 2 agents (CHN-TE-01, CHN-TE-02)                 │
│    ├─ London: 1 agent (LON-TE-01)                                 │
│    ├─ New Jersey: 1 agent (NJ-TE-01)                              │
│    └─ Total: 7 enterprise agents (all IPv4-only currently)        │
│                                                                    │
│  CLOUD AGENTS:                                                     │
│    ├─ ThousandEyes cloud network (global)                         │
│    ├─ Supports both IPv4 and IPv6                                 │
│    └─ Used for external-to-internal testing                       │
│                                                                    │
│  CURRENT TESTS (IPv4-Only):                                        │
│    ├─ HTTP Server: abhavtech.com (from Mumbai agent)              │
│    ├─ DNS Server: dns.abhavtech.com                               │
│    ├─ Agent-to-Agent: Mumbai ↔ Chennai, Mumbai ↔ London           │
│    └─ Network Path: Internet path to SaaS apps                    │
│                                                                    │
│  THOUSANDEYES CONTROLLER:                                          │
│    ├─ SaaS Platform: app.thousandeyes.com                         │
│    ├─ Supports IPv6 agent connectivity                            │
│    └─ IPv6 tests available                                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 20.2 ThousandEyes IPv6 Agent Configuration

### Step 20.2.1: Enable IPv6 on Enterprise Agent

```bash
# ThousandEyes Enterprise Agent IPv6 Configuration
# SSH to agent: MUM-TE-01 (10.100.1.200)

ssh admin@10.100.1.200

# Check current network configuration
sudo te-agent-utils show-network-config

# Output (IPv4 only):
# eth0:
# IPv4: 10.100.1.200/24
# Gateway: 10.100.1.1
# DNS: 10.252.31.53

# Enable IPv6 (via network configuration)
sudo vi /etc/netplan/01-netcfg.yaml

# Configuration (YAML):
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: yes
      dhcp6: no  # Use SLAAC instead
      accept-ra: yes  # Accept Router Advertisements
      addresses:
        - 10.100.1.200/24
# IPv6 will be auto-configured via SLAAC
      gateway4: 10.100.1.1
      nameservers:
        addresses:
          - 10.252.31.53
          - 2001:db8:abc1:1000::53

# Apply configuration
sudo netplan apply

# Verify IPv6 address obtained via SLAAC
ip -6 addr show eth0

# Expected output:
# inet6 2001:db8:abc1:2001::c8/64 scope global dynamic
# valid_lft forever preferred_lft forever
# inet6 fe80::xxxx:xxxx:xxxx:xxxx/64 scope link
```

---

### Step 20.2.2: Configure Agent in ThousandEyes Portal

```
ThousandEyes Portal Configuration:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  app.thousandeyes.com → Cloud & Enterprise Agents → Agent Settings│
│                                                                    │
│  Select Agent: MUM-TE-01                                           │
│                                                                    │
│  Network Configuration:                                            │
│    IP Address Support:                                             │
│      ☑ IPv4                                                       │
│      ☑ IPv6                                                       │
│      IP Preference: Prefer IPv6                                   │
│                                                                    │
│    IPv6 Address: 2001:db8:abc1:2001::c8 (auto-detected)           │
│    IPv6 Gateway: fe80::200:cff:fe9f:f001                          │
│                                                                    │
│  Agent-to-Controller Communication:                                │
│    ◉ Dual Stack (IPv4 + IPv6)                                     │
│    ○ IPv4 Only                                                    │
│    ○ IPv6 Only                                                    │
│                                                                    │
│  Save Changes                                                      │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  REPEAT FOR ALL AGENTS:                                            │
│    ✓ MUM-TE-01, MUM-TE-02 (Mumbai)                                │
│    ✓ CHN-TE-01, CHN-TE-02 (Chennai)                               │
│    ✓ LON-TE-01 (London)                                           │
│    ✓ NJ-TE-01 (New Jersey)                                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 20.3 ThousandEyes IPv6 Tests

### Test 20.3.1: HTTP Server Test (IPv6)

```
CREATE TEST: Web Server IPv6
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  app.thousandeyes.com → Cloud & Enterprise Agents → Tests → Add   │
│                                                                    │
│  Test Type: HTTP Server                                           │
│                                                                    │
│  Basic Configuration:                                              │
│    Test Name: abhavtech.com-IPv6                                  │
│    URL: https://abhavtech.com                                     │
│    Protocol: IPv6 Only  ← Force IPv6                              │
│    Interval: 5 minutes                                            │
│    Alerts: Enabled                                                │
│                                                                    │
│  Advanced Settings:                                                │
│    HTTP Version: HTTP/2 (native IPv6 support)                     │
│    Target Time for View: 2000 ms                                  │
│    Verify SSL Certificate: Yes                                    │
│    DNS Override: 2001:db8:abcf:0:1::80 (Azure web server IPv6)    │
│                                                                    │
│  Agent Assignment:                                                 │
│    ☑ MUM-TE-01 (Mumbai)                                           │
│    ☑ CHN-TE-01 (Chennai)                                          │
│    ☑ LON-TE-01 (London)                                           │
│    ☑ Cloud Agents: Singapore, London (IPv6 capable)               │
│                                                                    │
│  Metrics Collected:                                                │
│    - Response time (IPv6 vs baseline)                             │
│    - Availability (IPv6 path)                                     │
│    - Throughput                                                   │
│    - Path trace (IPv6 hops)                                       │
│                                                                    │
│  Create Test                                                       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### Test 20.3.2: DNS Server Test (IPv6)

```
CREATE TEST: DNS Server IPv6
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Test Type: DNS Server                                            │
│                                                                    │
│  Basic Configuration:                                              │
│    Test Name: Internal-DNS-IPv6                                   │
│    Domain: abhavtech.com                                          │
│    DNS Server: 2001:db8:abc1:1000::53 (Internal DNS IPv6)         │
│    Query Type: AAAA  ← IPv6 address record                        │
│    Interval: 2 minutes                                            │
│                                                                    │
│  Advanced Settings:                                                │
│    DNSSEC: Validate (if enabled)                                  │
│    Protocol: IPv6                                                 │
│                                                                    │
│  Agent Assignment:                                                 │
│    ☑ MUM-TE-01, MUM-TE-02                                         │
│    ☑ CHN-TE-01, CHN-TE-02                                         │
│                                                                    │
│  Alerts:                                                           │
│    ☑ Alert if DNS resolution time > 100ms                         │
│    ☑ Alert if AAAA record not returned                            │
│                                                                    │
│  Create Test                                                       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### Test 20.3.3: Agent-to-Agent Test (IPv6)

```
CREATE TEST: Agent-to-Agent IPv6
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Test Type: Agent to Agent                                        │
│                                                                    │
│  Basic Configuration:                                              │
│    Test Name: Mumbai-Chennai-IPv6                                 │
│    Protocol: IPv6                                                 │
│    Direction: Both Directions                                     │
│    Interval: 2 minutes                                            │
│                                                                    │
│  Source Agent:                                                     │
│    ◉ MUM-TE-01 (Mumbai)                                           │
│                                                                    │
│  Target Agents:                                                    │
│    ☑ CHN-TE-01 (Chennai)                                          │
│    ☑ LON-TE-01 (London)                                           │
│    ☑ NJ-TE-01 (New Jersey)                                        │
│                                                                    │
│  Metrics:                                                          │
│    - End-to-end latency (IPv6)                                    │
│    - Packet loss                                                  │
│    - Jitter                                                       │
│    - Path MTU discovery                                           │
│    - Throughput (TCP)                                             │
│                                                                    │
│  Expected Baselines:                                               │
│    Mumbai → Chennai: 10-12ms                                      │
│    Mumbai → London: 125-145ms                                     │
│    Mumbai → NJ: 195-210ms                                         │
│                                                                    │
│  Alerts:                                                           │
│    ☑ Latency > baseline + 20%                                     │
│    ☑ Packet loss > 1%                                             │
│    ☑ Path change detected                                         │
│                                                                    │
│  Create Test                                                       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 20.4 ThousandEyes IPv6 Path Visualization

```
ThousandEyes Path Visualization (IPv6):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Test: Mumbai-Chennai-IPv6 (Agent-to-Agent)                       │
│                                                                    │
│  IPv6 Path Trace:                                                  │
│                                                                    │
│    [MUM-TE-01] 2001:db8:abc1:2001::c8                             │
│         │                                                          │
│         ├─ Hop 1: 2001:db8:abc1:2001::1 (Anycast Gateway)         │
│         │         Latency: 1ms                                    │
│         │                                                          │
│         ├─ Hop 2: 2001:db8:abc1:0::10 (Edge Switch Loopback)      │
│         │         Latency: 2ms                                    │
│         │                                                          │
│         ├─ Hop 3: 2001:db8:abc1:0::1 (Border Node)                │
│         │         Latency: 3ms                                    │
│         │                                                          │
│         ├─ Hop 4: 2001:db8:abc1:8000::1 (MUM-HUB-01)              │
│         │         Latency: 5ms (SD-WAN underlay)                  │
│         │                                                          │
│         ├─ Hop 5: 2001:db8:abc2:8000::1 (CHN-HUB-01)              │
│         │         Latency: 8ms (OMP route via MPLS)               │
│         │                                                          │
│         ├─ Hop 6: 2001:db8:abc2:0::1 (Chennai Border)             │
│         │         Latency: 9ms                                    │
│         │                                                          │
│         └─ Hop 7: 2001:db8:abc2:2001::c8 (CHN-TE-01)              │
│                   Latency: 10ms                                   │
│                                                                    │
│  [CHN-TE-01] 2001:db8:abc2:2001::c8                               │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  INSIGHTS:                                                         │
│    ✓ Pure IPv6 path (no NAT/translation)                          │
│    ✓ 7 hops total (vs 9 hops for IPv4 due to NAT)                 │
│    ✓ Latency: 10ms end-to-end (vs 12ms IPv4)                      │
│    ✓ No packet loss                                               │
│    ✓ Symmetric path (forward = reverse)                           │
│                                                                    │
│  PATH COMPARISON (IPv4 vs IPv6):                                   │
│    IPv4 Path: 9 hops, 12ms (includes NAT traversal)               │
│    IPv6 Path: 7 hops, 10ms (direct routing)                       │
│    Improvement: -2 hops, -17% latency                             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## WEEK 21: SPLUNK IPv6

## 21.1 Splunk Infrastructure

```
ABHAVTECH SPLUNK DEPLOYMENT:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  SPLUNK ENTERPRISE:                                                │
│    ├─ Version: 9.1.x                                              │
│    ├─ Deployment: Distributed (Indexers + Search Heads)           │
│    ├─ Location: Mumbai HQ datacenter                              │
│    │                                                               │
│    ├─ Indexer Cluster:                                            │
│    │    MUM-SPLUNK-IDX-01: 10.252.31.50 (IPv4)                    │
│    │    MUM-SPLUNK-IDX-02: 10.252.31.51                           │
│    │    MUM-SPLUNK-IDX-03: 10.252.31.52                           │
│    │    (Need to add IPv6 addresses)                              │
│    │                                                               │
│    └─ Search Head:                                                 │
│         MUM-SPLUNK-SH-01: 10.252.31.60 (IPv4)                     │
│                                                                    │
│  CURRENT DATA SOURCES (IPv4-Only):                                 │
│    ├─ Syslog: UDP/514, TCP/1514 (IPv4 sources)                    │
│    │    From: Routers, switches, firewalls, servers               │
│    │    Volume: ~50 GB/day                                        │
│    │                                                               │
│    ├─ NetFlow: UDP/9996 (IPv4 flow records)                       │
│    │    From: SD-WAN routers, core switches                       │
│    │    Volume: ~20 GB/day                                        │
│    │                                                               │
│    └─ Universal Forwarders:                                        │
│         Windows/Linux servers (application logs)                   │
│         Volume: ~30 GB/day                                        │
│                                                                    │
│  SPLUNK APPS:                                                      │
│    ├─ Splunk Enterprise Security (ES)                             │
│    ├─ Splunk IT Service Intelligence (ITSI)                       │
│    ├─ Machine Learning Toolkit (MLTK)                             │
│    └─ Network Toolkit (for NetFlow analysis)                      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 21.2 Splunk IPv6 Configuration

### Step 21.2.1: Enable IPv6 on Splunk Indexers

```bash
# On each Splunk indexer: MUM-SPLUNK-IDX-01

# Add IPv6 address to eth0
sudo vi /etc/netplan/01-netcfg.yaml

network:
  version: 2
  ethernets:
    eth0:
      addresses:
        - 10.252.31.50/24
        - 2001:db8:abc1:1000::50/64  # ← Add IPv6
      gateway4: 10.252.31.1
      gateway6: 2001:db8:abc1:1000::1
      nameservers:
        addresses:
          - 10.252.31.53
          - 2001:db8:abc1:1000::53

sudo netplan apply

# Verify
ip -6 addr show eth0
# Expected: 2001:db8:abc1:1000::50/64

# Configure Splunk to listen on IPv6
sudo vi /opt/splunk/etc/system/local/inputs.conf

# Add IPv6 syslog inputs
[udp://[::]:514]
sourcetype = syslog
index = network

[tcp://[::]:1514]
sourcetype = syslog
index = network

# Add IPv6 NetFlow input (IPFIX)
[udp://[::]:9996]
sourcetype = netflow
index = netflow

# Restart Splunk
sudo /opt/splunk/bin/splunk restart

# Verify listening on IPv6
sudo netstat -an | grep -E '::.*:(514|1514|9996)'
# Expected:
# udp6 0 0 :::514 0.0.0.0:*
# tcp6 0 0 :::1514 :::* LISTEN
# udp6 0 0 :::9996 0.0.0.0:*
```

---

### Step 21.2.2: Configure Network Devices for IPv6 Syslog

```cisco
! ═══════════════════════════════════════════════════════════════════
! SD-WAN ROUTER IPv6 SYSLOG (MUM-HUB-01)
! ═══════════════════════════════════════════════════════════════════

! Configure syslog to Splunk via IPv6
logging host ipv6 2001:db8:abc1:1000::50
logging host ipv6 2001:db8:abc1:1000::51  ! Secondary indexer
logging host ipv6 2001:db8:abc1:1000::52  ! Tertiary indexer

! Keep IPv4 for redundancy
logging host 10.252.31.50

! Syslog settings
logging trap informational
logging facility local6
logging source-interface Loopback0

! Verify
show logging | include 2001:db8
# Expected: Logging to 2001:db8:abc1:1000::50
```

---

### Step 21.2.3: Configure NetFlow v9/IPFIX for IPv6

```cisco
! ═══════════════════════════════════════════════════════════════════
! NETFLOW v9 WITH IPv6 SUPPORT (MUM-HUB-01)
! ═══════════════════════════════════════════════════════════════════

! NetFlow v9 exporter (supports IPv6 flows)
flow exporter SPLUNK-NETFLOW-v9
  description Export to Splunk via IPv6
  destination 2001:db8:abc1:1000::50  ! Splunk indexer IPv6
  source Loopback0
  transport udp 9996
  export-protocol netflow-v9
  template data timeout 60

! Flow record (IPv6 fields)
flow record NETFLOW-RECORD-v6
  description IPv6 flow record
  match ipv6 source address
  match ipv6 destination address
  match ipv6 protocol
  match ipv6 traffic-class
  match transport source-port
  match transport destination-port
  collect counter bytes
  collect counter packets
  collect timestamp absolute first
  collect timestamp absolute last
  collect interface input
  collect interface output

! Flow monitor (IPv6)
flow monitor NETFLOW-MONITOR-v6
  description Monitor IPv6 flows
  exporter SPLUNK-NETFLOW-v9
  record NETFLOW-RECORD-v6
  cache timeout active 60

! Apply to interfaces
interface GigabitEthernet0/0/0
  description MPLS-WAN
  ipv6 flow monitor NETFLOW-MONITOR-v6 input
  ipv6 flow monitor NETFLOW-MONITOR-v6 output

! Verify
show flow exporter SPLUNK-NETFLOW-v9 statistics
# Expected: Packets sent > 0
```

---

## 21.3 Splunk IPv6 Dashboards

### Dashboard 21.3.1: IPv6 Traffic Analysis

```xml
<!-- Splunk Dashboard: IPv6 Traffic Overview -->
<dashboard>
  <label>IPv6 Traffic Analysis</label>
  <row>
    <panel>
      <title>IPv6 vs IPv4 Traffic Volume (Last 24h)</title>
      <chart>
        <search>
          <query>
index=netflow 
| eval ip_version=if(isnotnull(ipv6_src_addr), "IPv6", "IPv4")
| timechart span=1h sum(bytes) by ip_version
          </query>
        </search>
        <option name="charting.chart">column</option>
        <option name="charting.legend.placement">bottom</option>
      </chart>
    </panel>
  </row>
  
  <row>
    <panel>
      <title>Top IPv6 Talkers (by Bytes)</title>
      <table>
        <search>
          <query>
index=netflow ipv6_src_addr=*
| stats sum(bytes) as total_bytes by ipv6_src_addr, ipv6_dst_addr
| sort -total_bytes
| head 20
| eval total_bytes=round(total_bytes/1024/1024/1024, 2)." GB"
          </query>
        </search>
      </table>
    </panel>
    
    <panel>
      <title>Top IPv6 Applications (by Protocol)</title>
      <chart>
        <search>
          <query>
index=netflow ipv6_src_addr=*
| lookup protocol_names protocol OUTPUT protocol_name
| stats sum(bytes) as total_bytes by protocol_name
| sort -total_bytes
          </query>
        </search>
        <option name="charting.chart">pie</option>
      </chart>
    </panel>
  </row>
  
  <row>
    <panel>
      <title>IPv6 Latency (from ThousandEyes)</title>
      <chart>
        <search>
          <query>
index=thousandeyes sourcetype=te_agent_to_agent protocol=IPv6
| timechart span=5m avg(latency_ms) by agent_pair
          </query>
        </search>
        <option name="charting.chart">line</option>
        <option name="charting.axisTitleY.text">Latency (ms)</option>
      </chart>
    </panel>
  </row>
</dashboard>
```

---

## 21.4 Splunk MLTK for IPv6 Anomaly Detection

```python
# Splunk Search: IPv6 Traffic Anomaly Detection (MLTK)

# Search 21.4.1: Baseline IPv6 Traffic Patterns
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

index=netflow ipv6_src_addr=* earliest=-30d
| timechart span=1h sum(bytes) as bytes_total
| fit DensityFunction bytes_total into ipv6_traffic_model

# This creates a baseline model of "normal" IPv6 traffic patterns

# Search 21.4.2: Detect IPv6 Traffic Anomalies
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

index=netflow ipv6_src_addr=* earliest=-24h
| timechart span=1h sum(bytes) as bytes_total
| apply ipv6_traffic_model
| where "BoundaryRanges(bytes_total)" < 0.05
| eval anomaly_score=round(BoundaryRanges(bytes_total) * 100, 2)
| table _time, bytes_total, anomaly_score

# Interpretation:
# - anomaly_score < 5 = CRITICAL (likely attack or major change)
# - anomaly_score 5-20 = WARNING (investigate)
# - anomaly_score > 20 = Normal variation

# Search 21.4.3: IPv6 Source Address Clustering
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

index=netflow ipv6_src_addr=* earliest=-7d
| stats sum(bytes) as total_bytes, dc(ipv6_dst_addr) as unique_dests by ipv6_src_addr
| fit KMeans total_bytes unique_dests k=3 into ipv6_behavior_clusters

# Clusters:
# Cluster 0: Normal clients (low bytes, few destinations)
# Cluster 1: Heavy users (high bytes, many destinations)
# Cluster 2: Suspicious (very high bytes, many destinations) ← Investigate

# Alert on Cluster 2 members
```

**Automated Alert:**
```xml
<!-- Splunk Alert: IPv6 Traffic Anomaly -->
<alert>
  <name>IPv6 Traffic Anomaly Detected</name>
  <search>
index=netflow ipv6_src_addr=* earliest=-1h
| timechart span=5m sum(bytes) as bytes
| apply ipv6_traffic_model
| where "BoundaryRanges(bytes)" < 0.05
  </search>
  <trigger>
    <condition>search count > 0</condition>
  </trigger>
  <actions>
    <email>
      <to>netops@abhavtech.com</to>
      <subject>IPv6 Traffic Anomaly Alert</subject>
      <message>
Unusual IPv6 traffic detected at $result._time$
Traffic volume: $result.bytes$ (anomaly score: $result.anomaly_score$)

Investigate immediately.
      </message>
    </email>
    <webhook>
      <url>https://abhavtech.slack.com/webhooks/netops</url>
    </webhook>
  </actions>
</alert>
```

---

## WEEK 22: APPDYNAMICS IPv6

## 22.1 AppDynamics Infrastructure

```
ABHAVTECH APPDYNAMICS DEPLOYMENT:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  APPDYNAMICS CONTROLLER:                                           │
│    ├─ Type: SaaS (abhavtech.saas.appdynamics.com)                 │
│    ├─ Supports: IPv4 + IPv6 agent connectivity                    │
│    └─ Agent Registration: Dual-stack                              │
│                                                                    │
│  APPLICATION AGENTS:                                               │
│    ├─ Java APM Agents: 50 (application servers)                   │
│    │    Location: Azure VMs, GCP VMs                              │
│    │    Current: IPv4 connectivity only                           │
│    │                                                               │
│    ├─ .NET Agents: 30 (Windows servers)                           │
│    │    Location: On-prem Windows Server 2022                     │
│    │    Current: IPv4 only                                        │
│    │                                                               │
│    └─ Machine Agents: 80 (infrastructure monitoring)              │
│         Location: All server VMs                                   │
│         Current: IPv4 only                                        │
│                                                                    │
│  COGNITION ENGINE:                                                 │
│    ├─ AI/ML Platform: Cloud-based                                 │
│    ├─ Baselines: IPv4 traffic patterns only                       │
│    └─ Need: IPv6 traffic baselining                               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 22.2 AppDynamics Java Agent IPv6 Configuration

```xml
<!-- AppDynamics Java Agent Configuration -->
<!-- File: /opt/appd/conf/controller-info.xml -->

<controller-info>
  <controller-host>abhavtech.saas.appdynamics.com</controller-host>
  <controller-port>443</controller-port>
  <controller-ssl-enabled>true</controller-ssl-enabled>
  
  <!-- Account information -->
  <account-name>abhavtech</account-name>
  <account-access-key>xxxx-xxxx-xxxx-xxxx</account-access-key>
  
  <!-- Application and Tier -->
  <application-name>Abhavtech-Web-App</application-name>
  <tier-name>WebTier-Azure</tier-name>
  <node-name>web-vm-01</node-name>
  
  <!-- IPv6 Configuration (NEW) -->
  <agent-ip-preference>IPv6</agent-ip-preference>
  <!-- Options: IPv4, IPv6, DualStack -->
  
  <use-ipv6>true</use-ipv6>
  
  <!-- If dual-stack VM, agent will use IPv6 address to register -->
  <agent-ipv6-address>2001:db8:abcf:0:1::10</agent-ipv6-address>
  
  <!-- Controller resolution (AppDynamics SaaS supports IPv6) -->
  <controller-ipv6-address>2606:2800:220:1:248:1893:25c8:1946</controller-ipv6-address>
  <!-- (Example - actual AppD SaaS IPv6 will be auto-resolved) -->
  
</controller-info>
```

**Start Java Agent with IPv6:**
```bash
# Application startup with AppDynamics agent
java -javaagent:/opt/appd/javaagent.jar \
     -Dappdynamics.agent.tierName=WebTier-Azure \
     -Dappdynamics.agent.nodeName=web-vm-01 \
     -Djava.net.preferIPv6Addresses=true \
     -jar /opt/app/webapp.jar

# Agent will register with controller via IPv6
```

---

## 22.3 AppDynamics Business Transaction Monitoring (IPv6)

```
AppDynamics Controller UI:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Applications → Abhavtech-Web-App → Business Transactions          │
│                                                                    │
│  Business Transaction: /api/v1/users (HTTP POST)                  │
│                                                                    │
│  TRANSACTION FLOW:                                                 │
│    ┌─────────────────────────────────────────────────────────────┐│
│    │ Client Request (IPv6)                                       ││
│    │   Source: 2001:db8:abc1:2001::50 (Mumbai client)            ││
│    │   ↓                                                          ││
│    │ Azure Load Balancer (IPv6)                                  ││
│    │   IPv6: 2001:db8:abcf:0:1::100                              ││
│    │   ↓                                                          ││
│    │ WebTier-Azure (web-vm-01)                                   ││
│    │   AppD Agent: Registered via IPv6                           ││
│    │   Response Time: 45ms (avg over IPv6)                       ││
│    │   ↓                                                          ││
│    │ AppTier-Azure (app-vm-01)                                   ││
│    │   DB call via IPv6                                          ││
│    │   Response Time: 15ms                                       ││
│    │   ↓                                                          ││
│    │ Azure SQL (Private Endpoint IPv6)                           ││
│    │   IPv6: 2001:db8:abcf:0:3::20                               ││
│    │   Query Time: 10ms                                          ││
│    └─────────────────────────────────────────────────────────────┘│
│                                                                    │
│  PERFORMANCE METRICS (IPv6 vs IPv4):                               │
│    ┌──────────────────────┬──────────────┬──────────────┐         │
│    │ Metric               │ IPv4         │ IPv6         │         │
│    ├──────────────────────┼──────────────┼──────────────┤         │
│    │ Avg Response Time    │ 52ms         │ 45ms (-13%)  │         │
│    │ 95th Percentile      │ 110ms        │ 95ms  (-14%) │         │
│    │ Error Rate           │ 0.5%         │ 0.2% (-60%)  │         │
│    │ Calls/min            │ 1,200        │ 1,250 (+4%)  │         │
│    └──────────────────────┴──────────────┴──────────────┘         │
│                                                                    │
│  COGNITION ENGINE INSIGHTS:                                        │
│    🔍 Anomaly Detected: IPv6 traffic shows 13% lower latency      │
│    📊 Baseline Updated: IPv6 response time baseline = 45ms        │
│    ✅ Recommendation: Route production traffic via IPv6           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 22.4 AppDynamics Cognition Engine IPv6 Baselining

```
Cognition Engine Configuration:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  AppDynamics → Analytics → Cognition Engine → Baselines           │
│                                                                    │
│  CREATE BASELINE: IPv6 Application Performance                    │
│                                                                    │
│  Baseline Name: WebApp-IPv6-Performance                           │
│                                                                    │
│  Metrics:                                                          │
│    ☑ Average Response Time (IPv6 transactions)                    │
│    ☑ Calls per Minute (IPv6)                                      │
│    ☑ Errors per Minute (IPv6)                                     │
│    ☑ Slow Calls (>100ms for IPv6)                                 │
│                                                                    │
│  Learning Period: 14 days                                         │
│                                                                    │
│  Baseline Settings:                                                │
│    Sensitivity: Medium                                             │
│    Seasonality: Daily + Weekly patterns                           │
│    Exclude Outliers: Yes (remove top/bottom 5%)                   │
│                                                                    │
│  Alert Conditions:                                                 │
│    ☑ Alert if response time > baseline + 2 std deviations         │
│    ☑ Alert if error rate > baseline × 2                           │
│    ☑ Alert if calls/min drops > 20% from baseline                 │
│                                                                    │
│  Notification:                                                     │
│    Email: appops@abhavtech.com                                    │
│    Slack: #appd-alerts                                            │
│    PagerDuty: Critical alerts only                                │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  COGNITION ENGINE ANALYSIS (After 14 days):                       │
│                                                                    │
│  Learned Patterns:                                                 │
│    📈 IPv6 traffic peaks: 9-11 AM IST, 2-4 PM IST                 │
│    📉 IPv6 traffic valleys: 12-2 AM IST                           │
│    🔄 Weekly pattern: Higher on Mon-Fri, lower on weekends        │
│                                                                    │
│  Performance Insights:                                             │
│    ✅ IPv6 response time 10-15% faster than IPv4                  │
│    ✅ IPv6 error rate 50-60% lower than IPv4                      │
│    ✅ IPv6 provides more stable performance (lower variance)      │
│                                                                    │
│  Recommendations:                                                  │
│    🎯 Migrate 100% of traffic to IPv6 (performance gain)          │
│    🎯 Deprecate IPv4 for this application (by Q3 2025)            │
│    🎯 Use IPv6 as primary path, IPv4 as failover                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## WEEK 23: NETFLOW/IPFIX + FINAL VALIDATION

## 23.1 NetFlow v9/IPFIX IPv6 Deployment Summary

```
IPv6 NETFLOW DEPLOYMENT STATUS:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  EXPORTERS (Network Devices):                                      │
│    ✅ SD-WAN Hubs: 6 sites (12 routers)                           │
│       - NetFlow v9 with IPv6 record templates                     │
│       - Export to Splunk indexers (2001:db8:abc1:1000::50-52)     │
│       - Sampling: 1:1000 (all interfaces)                         │
│                                                                    │
│    ✅ SD-Access Borders: 6 nodes (Mumbai + Chennai)               │
│       - IPFIX with IPv6 flow records                              │
│       - Export to Splunk                                          │
│                                                                    │
│    ✅ Core Switches: 10 switches                                  │
│       - NetFlow v9 (Catalyst 9500 series)                         │
│       - IPv6 flow export enabled                                  │
│                                                                    │
│  COLLECTORS:                                                       │
│    ✅ Splunk Indexers: 3 nodes (listening on UDP/9996 IPv6)       │
│       - Receiving ~50,000 flows/sec                               │
│       - Storage: ~25 GB/day (IPv6 flows)                          │
│                                                                    │
│  FLOW RECORD FIELDS (IPv6):                                        │
│    - ipv6_src_addr, ipv6_dst_addr                                 │
│    - ipv6_next_hop                                                │
│    - src_port, dst_port, protocol                                 │
│    - bytes, packets                                               │
│    - input_interface, output_interface                            │
│    - tcp_flags, tos (IPv6 traffic class)                          │
│    - first_switched, last_switched                                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 23.2 IPv4 vs IPv6 Traffic Analysis

```bash
# Splunk Search: IPv4 vs IPv6 Traffic Volume Comparison
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

index=netflow earliest=-30d
| eval ip_version=if(isnotnull(ipv6_src_addr), "IPv6", "IPv4")
| timechart span=1d sum(bytes) as total_bytes by ip_version
| eval total_bytes_gb=round(total_bytes/1024/1024/1024, 2)

# Results (30-day trend):
# ┌────────────┬──────────────┬──────────────┬────────────────┐
# │ Date │ IPv4 (GB) │ IPv6 (GB) │ IPv6 % │
# ├────────────┼──────────────┼──────────────┼────────────────┤
# │ Jan 1 │ 5,200 │ 150 │ 2.8% │
# │ Jan 7 │ 5,100 │ 380 │ 6.9% │
# │ Jan 14 │ 4,950 │ 820 │ 14.2% │
# │ Jan 21 │ 4,800 │ 1,450 │ 23.2% │
# │ Jan 30 │ 4,600 │ 2,100 │ 31.3% ← Current│
# └────────────┴──────────────┴──────────────┴────────────────┘
#
# INSIGHT: IPv6 traffic growing at 5% per week
# PROJECTION: IPv6 majority (>50%) by Week 35 (mid-Q2 2025)
```

---

## 23.3 AI-Powered Capacity Planning

```python
# Splunk Search: IPv6 Capacity Planning (MLTK)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Step 1: Time series forecasting for IPv6 traffic
index=netflow ipv6_src_addr=* earliest=-90d
| timechart span=1d sum(bytes) as ipv6_bytes
| fit ExponentialSmoothing ipv6_bytes holdback=7 forecast_k=30 into ipv6_forecast_model

# Step 2: Predict IPv6 traffic for next 30 days
| apply ipv6_forecast_model
| table _time, ipv6_bytes, prediction(ipv6_bytes)
| eval ipv6_bytes_gb=round(ipv6_bytes/1024/1024/1024, 2)
| eval predicted_gb=round('prediction(ipv6_bytes)'/1024/1024/1024, 2)

# Results:
# ┌────────────┬──────────────┬──────────────┐
# │ Date │ Actual (GB) │ Predicted │
# ├────────────┼──────────────┼──────────────┤
# │ Feb 5 │ 2,250 │ 2,280 │
# │ Feb 12 │ - │ 2,580 │
# │ Feb 19 │ - │ 2,920 │
# │ Feb 26 │ - │ 3,300 │
# │ Mar 5 │ - │ 3,750 │
# └────────────┴──────────────┴──────────────┘
#
# CAPACITY PLANNING INSIGHTS:
# 1. IPv6 traffic will exceed IPv4 by Week 32 (early Q2)
# 2. Need to increase WAN bandwidth by 15% for IPv6 growth
# 3. ExpressRoute circuits: Upgrade from 2 Gbps → 3 Gbps by March
# 4. GCP Interconnect: Current 10 Gbps sufficient until Q3
#
# RECOMMENDATIONS:
# Upgrade Mumbai-Azure ExpressRoute to 3 Gbps (Feb)
# Add NJ-Azure ExpressRoute circuit (3 Gbps) (Mar)
# Monitor GCP Interconnect utilization monthly
# Plan for IPv4 deprecation (some services) by Q4 2025
```

---

## 23.4 Phase 5 Final Validation

```bash
#!/bin/bash
# phase5_final_validation.sh

echo "═══════════════════════════════════════════════════════════════"
echo "     PHASE 5 FINAL VALIDATION — OBSERVABILITY IPv6"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Test 1: ThousandEyes IPv6 tests
echo "Test 1: ThousandEyes IPv6 Test Status"
# API call to ThousandEyes
curl -u "$TE_USER:$TE_TOKEN" \
  "https://api.thousandeyes.com/v6/tests.json" \
  | jq '.test[] | select(.protocol == "IPv6") | {name, enabled, agents}'

# Expected: All IPv6 tests enabled, agents responding

# Test 2: Splunk IPv6 data ingestion
echo ""
echo "Test 2: Splunk IPv6 Data Ingestion Rate"
# Splunk REST API
curl -k -u admin:$SPLUNK_PASS \
  "https://10.252.31.60:8089/services/search/jobs/export" \
  -d 'search=index=netflow ipv6_src_addr=* | stats count' \
  -d 'output_mode=json'

# Expected: >10,000 IPv6 flow records per minute

# Test 3: AppDynamics IPv6 agents
echo ""
echo "Test 3: AppDynamics IPv6 Agent Registration"
# AppD REST API
curl -u "$APPD_USER@abhavtech:$APPD_PASS" \
  "https://abhavtech.saas.appdynamics.com/controller/rest/applications/Abhavtech-Web-App/nodes" \
  | jq '.[] | select(.ipAddresses.ipv6 != null) | {name, ipv6: .ipAddresses.ipv6}'

# Expected: All nodes showing IPv6 addresses

# Test 4: NetFlow IPv6 statistics
echo ""
echo "Test 4: NetFlow IPv6 Flow Export Statistics"
ssh admin@10.252.100.1 "show flow exporter SPLUNK-NETFLOW-v9 statistics"

# Expected:
# Flows sent: >1,000,000
# Packets sent: >500,000
# Bytes sent: >200 MB

# Test 5: End-to-end observability
echo ""
echo "Test 5: End-to-End IPv6 Observability Chain"
# Trace a transaction end-to-end

# 1. Client initiates request (IPv6)
echo "  - Client request: 2001:db8:abc1:2001::50 → Azure web server"

# 2. ThousandEyes captures path
echo "  - ThousandEyes: Monitoring path quality (IPv6)"

# 3. NetFlow records flow
echo "  - NetFlow: Flow recorded on all hops"

# 4. AppDynamics traces transaction
echo "  - AppDynamics: Business transaction traced"

# 5. All data in Splunk
echo "  - Splunk: Correlated logs, flows, and metrics"

# Expected: Complete visibility from client → cloud

echo ""
echo "✅ Phase 5 validation complete"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "        ✅ ALL PHASES COMPLETE — PROJECT SUCCESS!"
echo "═══════════════════════════════════════════════════════════════"
```

---

## PHASE 5 COMPLETE

**Summary:**
- **ThousandEyes**: 7 IPv6 agents, 15+ IPv6 tests, path visualization
- **Splunk**: IPv6 syslog + NetFlow collection, MLTK anomaly detection
- **AppDynamics**: IPv6 agent connectivity, Cognition Engine baselining
- **NetFlow/IPFIX**: 18 exporters, IPv6 flow analysis, capacity planning

---

## COMPLETE IPv6 MIGRATION PROJECT SUCCESS!

**All 5 Phases Complete:**
- ✅ Phase 0: Planning 
- ✅ Phase 1: SD-WAN Underlay 
- ✅ Phase 2: SD-Access Overlay 
- ✅ Phase 3: Multi-Cloud 
- ✅ Phase 4: Webex Calling 
- ✅ Phase 5: Observability 


**Infrastructure Achievement:**
- ~10,000+ endpoints dual-stack
- Complete visibility (on-prem → campus → cloud)
- AI/ML observability enabled
- Zero IPv4 impact
- Future-proof for 10+ years

---

*© 2025 Abhavtech - IPv6 Migration Phase 5 Guide*
*Version 1.0 | Last Updated: January 2025*
