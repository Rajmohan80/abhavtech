# 5.13 Splunk SIEM Integration

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Splunk Integration Architecture

### 1.1 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                Abhavtech Splunk Integration Architecture             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Data Sources                    Splunk Platform                   │
│   ┌───────────────┐              ┌─────────────────┐               │
│   │ Catalyst      │──Syslog─────►│                 │               │
│   │ Center        │──API────────►│   Splunk        │               │
│   │ Assurance     │              │   Enterprise    │               │
│   └───────────────┘              │                 │               │
│                                  │   Indexers:     │               │
│   ┌───────────────┐              │   • splunk-idx1 │               │
│   │ Cisco ISE     │──Syslog─────►│   • splunk-idx2 │               │
│   │               │──pxGrid─────►│   • splunk-idx3 │               │
│   │               │──MnT DB─────►│                 │               │
│   └───────────────┘              │   Search Heads: │               │
│                                  │   • splunk-sh1  │               │
│   ┌───────────────┐              │   • splunk-sh2  │               │
│   │ Network       │──Syslog─────►│                 │               │
│   │ Devices       │──SNMP───────►│   Heavy Fwd:    │               │
│   │ (Switches/WLC)│──NetFlow────►│   • Each site   │               │
│   └───────────────┘              └────────┬────────┘               │
│                                           │                         │
│   ┌───────────────┐                       ▼                         │
│   │ Infoblox DDI  │──Syslog─────►┌─────────────────┐               │
│   └───────────────┘              │   Dashboards    │               │
│                                  │   • SD-Access   │               │
│   ┌───────────────┐              │   • ISE Auth    │               │
│   │ ThousandEyes  │──API────────►│   • Security    │               │
│   └───────────────┘              │   • Compliance  │               │
│                                  └─────────────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Splunk Deployment Summary

| Component | Hostname | IP Address | Role |
|-----------|----------|------------|------|
| Search Head 1 | splunk-sh1.abhavtech.com | 10.250.10.50 | Search, Dashboards |
| Search Head 2 | splunk-sh2.abhavtech.com | 10.250.10.51 | Search, Dashboards |
| Indexer 1 | splunk-idx1.abhavtech.com | 10.250.10.52 | Data indexing |
| Indexer 2 | splunk-idx2.abhavtech.com | 10.250.10.53 | Data indexing |
| Indexer 3 | splunk-idx3.abhavtech.com | 10.250.10.54 | Data indexing |
| HF Mumbai | splunk-hf-mum.abhavtech.com | 10.100.10.55 | Regional collection |
| HF London | splunk-hf-lon.abhavtech.com | 10.103.10.55 | Regional collection |
| HF New Jersey | splunk-hf-nj.abhavtech.com | 10.105.10.55 | Regional collection |

---

## 2. Catalyst Center Integration

### 2.1 Syslog Configuration

```
Catalyst Center → System → Settings → External Services → Syslog

Syslog Servers:
  Primary: splunk-hf-nj.abhavtech.com:514 (UDP)
  Secondary: splunk-hf-lon.abhavtech.com:514 (UDP)
  
Log Levels:
  System: Warning and above
  Network Events: Informational and above
  Security Events: All
  
Format: RFC 5424
```

### 2.2 API Integration for Assurance Data

```python
# Splunk Add-on for Catalyst Center
# inputs.conf

[catalyst_center_assurance]
interval = 300
index = catalyst_center
sourcetype = cisco:catalyst:assurance
host = catalyst.abhavtech.com
api_endpoint = /dna/intent/api/v1/issues
authentication = token
token = ************************
```

### 2.3 Splunk Index Configuration

```
# indexes.conf

[catalyst_center]
homePath = $SPLUNK_DB/catalyst_center/db
coldPath = $SPLUNK_DB/catalyst_center/colddb
thawedPath = $SPLUNK_DB/catalyst_center/thaweddb
maxDataSize = auto_high_volume
frozenTimePeriodInSecs = 31536000  # 1 year

[catalyst_assurance]
homePath = $SPLUNK_DB/catalyst_assurance/db
coldPath = $SPLUNK_DB/catalyst_assurance/colddb
thawedPath = $SPLUNK_DB/catalyst_assurance/thaweddb
maxDataSize = auto
frozenTimePeriodInSecs = 7776000  # 90 days
```

---

## 3. ISE Integration

### 3.1 ISE Syslog Configuration

```
Administration → System → Logging → Remote Logging Targets

Remote Target: Splunk-Primary
  Host: splunk-hf-nj.abhavtech.com
  Port: 514
  Protocol: UDP
  Format: RFC 5424
  
Logging Categories:
  ☑ Passed Authentications
  ☑ Failed Authentications
  ☑ RADIUS Accounting
  ☑ Profiler Events
  ☑ Posture Events
  ☑ Guest Events
  ☑ Admin Audit
  ☑ System Diagnostics (Warning+)
```

### 3.2 pxGrid to Splunk Integration

```python
# Splunk Add-on for ISE pxGrid
# pxgrid_session_input.py

import pxgrid
from splunklib.modularinput import Script, Scheme, Event

class ISEpxGridInput(Script):
    def stream_events(self, inputs, ew):
        pxgrid_client = pxgrid.PxGridClient(
            host="nj-ise-01.abhavtech.com",
            nodename="splunk-pxgrid",
            cert_file="/opt/splunk/etc/apps/ise_addon/certs/client.crt",
            key_file="/opt/splunk/etc/apps/ise_addon/certs/client.key"
        )
        
        # Subscribe to session topic
        for session in pxgrid_client.subscribe("sessionTopic"):
            event = Event()
            event.data = json.dumps(session)
            event.sourcetype = "cisco:ise:pxgrid:session"
            ew.write_event(event)
```

### 3.3 ISE MnT Database Integration

```
# Splunk DB Connect for ISE MnT

Connection: ISE-MnT-Database
  Type: Oracle
  Host: nj-ise-mnt-01.abhavtech.com
  Port: 1521
  Database: caboracle
  Username: splunk_readonly
  
Inputs:
  - Table: RADIUS_AUTH_SESSION
    Query: SELECT * FROM RADIUS_AUTH_SESSION WHERE timestamp > ?
    Index: ise_sessions
    Interval: 60
    
  - Table: RADIUS_AUTH_FAILURE
    Query: SELECT * FROM RADIUS_AUTH_FAILURE WHERE timestamp > ?
    Index: ise_failures
    Interval: 60
```

---

## 4. Network Device Integration

### 4.1 Syslog from Fabric Devices

```
! Catalyst 9000 Switch Syslog Configuration
!
logging host 10.250.10.55 transport udp port 514
logging trap informational
logging source-interface Loopback0
logging origin-id hostname
!
! Enable specific logging for SD-Access
logging discriminator SDACCESS severity includes 5 6
logging host 10.250.10.55 discriminator SDACCESS
!
```

### 4.2 NetFlow for Traffic Analysis

```
! NetFlow Configuration on Border Nodes
!
flow record ABHAVTECH-NETFLOW
 match ipv4 source address
 match ipv4 destination address
 match ipv4 protocol
 match transport source-port
 match transport destination-port
 match flow cts source group-tag
 match flow cts destination group-tag
 collect counter bytes
 collect counter packets
 collect timestamp sys-uptime first
 collect timestamp sys-uptime last
!
flow exporter SPLUNK-EXPORT
 destination 10.250.10.55
 source Loopback0
 transport udp 9995
 template data timeout 60
!
flow monitor SDACCESS-MONITOR
 exporter SPLUNK-EXPORT
 record ABHAVTECH-NETFLOW
!
interface range TenGigabitEthernet1/0/1-48
 ip flow monitor SDACCESS-MONITOR input
 ip flow monitor SDACCESS-MONITOR output
!
```

---

## 5. Splunk Dashboards

### 5.1 SD-Access Operations Dashboard

```xml
<!-- SD-Access Operations Dashboard -->
<dashboard>
  <label>SD-Access Operations - Abhavtech</label>
  
  <row>
    <panel>
      <title>Fabric Health Summary</title>
      <single>
        <search>
          <query>
            index=catalyst_center sourcetype="cisco:catalyst:assurance"
            | stats count(eval(severity="Critical")) as Critical,
                    count(eval(severity="High")) as High,
                    count(eval(severity="Medium")) as Medium
            | eval Health = 100 - (Critical*10 + High*5 + Medium*1)
          </query>
        </search>
      </single>
    </panel>
    
    <panel>
      <title>Active Fabric Sites</title>
      <chart>
        <search>
          <query>
            index=catalyst_center sourcetype="cisco:catalyst:site"
            | stats dc(site_name) as Sites by region
          </query>
        </search>
      </chart>
    </panel>
  </row>
  
  <row>
    <panel>
      <title>Authentication Success Rate</title>
      <chart>
        <search>
          <query>
            index=ise_sessions
            | timechart span=1h 
              count(eval(auth_status="PASS")) as Passed
              count(eval(auth_status="FAIL")) as Failed
            | eval SuccessRate = round((Passed/(Passed+Failed))*100, 2)
          </query>
        </search>
      </chart>
    </panel>
    
    <panel>
      <title>SGT Distribution</title>
      <chart>
        <search>
          <query>
            index=ise_sessions
            | stats count by selected_sgt
            | sort -count
            | head 10
          </query>
        </search>
      </chart>
    </panel>
  </row>
</dashboard>
```

### 5.2 ISE Security Dashboard

```spl
# ISE Authentication Analytics

# Failed Authentication Trend
index=ise_failures
| timechart span=1h count by failure_reason
| where count > 10

# Top Authentication Failures by User
index=ise_failures
| stats count by username, failure_reason
| sort -count
| head 20

# Suspicious Activity Detection
index=ise_sessions
| stats count dc(nas_ip) as unique_locations by username
| where unique_locations > 5
| eval alert_type = "Possible credential sharing"

# Posture Non-Compliance
index=ise_sessions posture_status="NonCompliant"
| stats count by endpoint_mac, posture_reason
| lookup endpoint_owners endpoint_mac OUTPUT owner, department
```

### 5.3 Network Visibility Dashboard

```spl
# SGT Traffic Analysis (from NetFlow)
index=netflow
| stats sum(bytes) as TotalBytes by src_sgt, dst_sgt
| eval Traffic_GB = round(TotalBytes/1073741824, 2)
| sort -Traffic_GB

# Top Talkers by SGT
index=netflow
| stats sum(bytes) as bytes by src_ip, src_sgt
| sort -bytes
| head 20
| lookup sgt_names sgt_id as src_sgt OUTPUT sgt_name

# SGACL Deny Events
index=network_devices "SGACL" "deny"
| rex field=_raw "src=(?<src_ip>\d+\.\d+\.\d+\.\d+).*dst=(?<dst_ip>\d+\.\d+\.\d+\.\d+)"
| stats count by src_ip, dst_ip, src_sgt, dst_sgt
| sort -count
```

---

## 6. Alerts and Correlation

### 6.1 Security Alerts

```spl
# Alert: Brute Force Attack Detection
index=ise_failures
| bucket _time span=5m
| stats count by _time, username, nas_ip
| where count > 10
| sendalert email to="soc@abhavtech.com" subject="Brute Force Detected"

# Alert: Unauthorized SGT Access Attempt
index=network_devices "SGACL" "deny"
| stats count by src_sgt, dst_sgt
| where count > 100
| lookup critical_sgts sgt as dst_sgt OUTPUT is_critical
| where is_critical="true"
| sendalert pagerduty severity="high"

# Alert: Posture Compliance Drop
index=ise_sessions
| timechart span=1h 
  count(eval(posture_status="Compliant")) as Compliant
  count(eval(posture_status="NonCompliant")) as NonCompliant
| eval compliance_rate = (Compliant/(Compliant+NonCompliant))*100
| where compliance_rate < 90
| sendalert email to="security@abhavtech.com"
```

### 6.2 Correlation Searches

```spl
# Correlation: Compromised Endpoint Detection
# Combines ISE auth, Umbrella blocks, and endpoint alerts

index=ise_sessions
| join type=inner endpoint_mac [
    search index=umbrella_events category="malware" OR category="c2"
    | stats count as dns_blocks by endpoint_mac
    | where dns_blocks > 5
]
| join type=inner endpoint_mac [
    search index=secure_endpoint event_type="malware_detected"
    | stats count as malware_events by endpoint_mac
]
| table _time, username, endpoint_mac, nas_ip, dns_blocks, malware_events
| sendalert xdr_integration
```

---

## 7. Retention and Compliance

### 7.1 Data Retention Policy

| Index | Hot (Days) | Warm (Days) | Cold (Days) | Frozen |
|-------|-----------|-------------|-------------|--------|
| ise_sessions | 30 | 60 | 275 | Archive |
| ise_failures | 30 | 60 | 275 | Archive |
| catalyst_center | 14 | 30 | 320 | Archive |
| netflow | 7 | 14 | 44 | Delete |
| network_devices | 30 | 60 | 275 | Archive |

### 7.2 Compliance Reports

```spl
# PCI-DSS Authentication Report
index=ise_sessions
| stats count by username, auth_method, _time
| where auth_method!="802.1X-EAP-TLS"
| eval compliance_status="Non-Compliant: Weak auth method"

# SOX Access Audit Trail
index=ise_sessions 
| search selected_sgt="Finance*" OR selected_sgt="Executive*"
| table _time, username, endpoint_mac, nas_ip, selected_sgt, auth_status
| outputcsv sox_audit_trail.csv
```

---

## 8. Integration with Catalyst Center Assurance

### 8.1 Extended Retention for AI Analytics

```
# Catalyst Center Assurance retains data for 30 days
# Splunk extends this to 365 days for long-term analysis

index=catalyst_assurance
| timechart span=1d avg(wireless_client_count) as AvgClients
| predict wireless_client_count future_timespan=30

# Historical Baseline Comparison
index=catalyst_assurance
| stats avg(response_time) as current_avg by application
| join application [
    search index=catalyst_assurance earliest=-30d@d latest=-7d@d
    | stats avg(response_time) as baseline_avg by application
]
| eval deviation_pct = round(((current_avg - baseline_avg)/baseline_avg)*100, 2)
| where abs(deviation_pct) > 20
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
