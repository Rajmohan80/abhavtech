# Connection Analysis

**Sub-Section:** FTD Forensics  
**Source:** FTD Connection Event Deep Dive

---

## Overview

Connection analysis provides detailed forensic examination of network sessions, application traffic, and communication patterns through Firepower Threat Defense. This chapter focuses on advanced connection event analysis for security investigations.

## Connection Event Schema

**Key Fields:**

| Field | Description | Forensic Value |
|-------|-------------|----------------|
| `timestamp` | Connection start/end time | Timeline reconstruction |
| `sourceIP` | Originating IP address | Attacker identification |
| `sourcePort` | Source port number | Client identification |
| `destinationIP` | Target IP address | C2 server, exfil destination |
| `destinationPort` | Destination port/service | Service targeted |
| `protocol` | TCP/UDP/ICMP | Protocol analysis |
| `bytes_sent` / `bytes_received` | Data volume | Data exfiltration detection |
| `application` | Detected application (AVC) | Application visibility |
| `action` | Allow/Block/Drop | Policy enforcement |
| `user` | Identity (ISE integration) | User attribution |
| `ssl_policy` | SSL inspection action | Encrypted traffic visibility |
| `url` | HTTP/HTTPS URL | Web activity tracking |
| `duration` | Connection duration | Long-lived connection detection |

## Data Exfiltration Detection

**Large Volume Transfers:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
earliest=-24h latest=now
action=allowed direction=outbound
| stats sum(bytes_sent) as total_bytes, count as conn_count by src_ip, dest_ip, application
| where total_bytes > 536870912  /* 512 MB threshold */
| eval total_mb=round(total_bytes/1048576, 2)
| sort -total_mb
| table src_ip, dest_ip, application, conn_count, total_mb
```

**HTTPS Tunnel Analysis:**

```spl
# Detect sustained HTTPS connections (potential C2 or exfiltration tunnel)
index=firewall sourcetype=cisco:ftd:connection 
dest_port=443 OR dest_port=8443
| where duration > 3600  /* connections > 1 hour */
| stats sum(bytes_sent) as sent, sum(bytes_received) as recv, avg(duration) as avg_duration by src_ip, dest_ip
| where sent > 104857600  /* 100 MB sent threshold */
| eval sent_mb=round(sent/1048576, 2), recv_mb=round(recv/1048576, 2)
| sort -sent_mb
```

## Command & Control (C2) Detection

**Beaconing Detection:**

```spl
# Identify periodic outbound connections (potential C2 beacons)
index=firewall sourcetype=cisco:ftd:connection 
earliest=-24h latest=now
direction=outbound
| bin _time span=5m
| stats count by _time, src_ip, dest_ip
| eventstats avg(count) as avg_conn, stdev(count) as stdev_conn by src_ip, dest_ip
| where count > (avg_conn + (2*stdev_conn))  /* Anomaly detection */
| table _time, src_ip, dest_ip, count
```

**Suspicious Domain Patterns:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
earliest=-7d latest=now
| rex field=url "(?<domain>[^/]+)"
| where match(domain, "^[a-z0-9]{20,}\.com$")  /* DGA-generated domains */
| stats count by domain, src_ip
| sort -count
```

## Lateral Movement Analysis

**Internal SMB Activity:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
dest_port=445 OR dest_port=139
src_ip=10.* dest_ip=10.*  /* Internal-to-internal */
| stats count, values(dest_ip) as targets by src_ip, user
| where count > 10  /* More than 10 SMB targets */
| sort -count
```

**RDP Connections:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
dest_port=3389
| stats count, values(dest_ip) as rdp_targets, dc(dest_ip) as unique_targets by src_ip, user
| where unique_targets > 5
| sort -count
```

**WinRM / PowerShell Remoting:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
dest_port=5985 OR dest_port=5986
| stats count, values(dest_ip) as targets by src_ip
| sort -count
```

## Application Visibility & Control (AVC)

**Unauthorized Applications:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
earliest=-24h latest=now
application!=unknown
| stats sum(bytes_sent) as total_bytes, count by application, user
| where application IN ("BitTorrent", "TeamViewer", "TOR", "Cryptocurrency", "Remote-Access")
| eval total_mb=round(total_bytes/1048576, 2)
| sort -total_mb
```

**Application Risk Analysis:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
| stats sum(bytes_sent) as sent, sum(bytes_received) as recv by application, application_risk
| where application_risk IN ("High", "Very High")
| eval sent_gb=round(sent/1073741824, 2), recv_gb=round(recv/1073741824, 2)
| sort -sent_gb
```

## Geo-IP Analysis

**Connections to High-Risk Countries:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
earliest=-7d latest=now
direction=outbound
| iplocation dest_ip
| where Country IN ("CN", "RU", "KP", "IR")  /* High-risk countries */
| stats sum(bytes_sent) as sent, count by src_ip, Country, dest_ip
| eval sent_mb=round(sent/1048576, 2)
| sort -sent_mb
```

## Long-Lived Connections

**Detect Persistent Connections:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
| where duration > 86400  /* > 24 hours */
| stats values(dest_ip) as destinations, avg(duration) as avg_duration by src_ip, application
| eval avg_hours=round(avg_duration/3600, 1)
| sort -avg_hours
```

## User Attribution

**Top Users by Bandwidth:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
user!=unknown
| stats sum(bytes_sent) as sent, sum(bytes_received) as recv by user, application
| eval total_gb=round((sent+recv)/1073741824, 2)
| sort -total_gb
| head 20
```

**After-Hours Activity:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
earliest=-7d latest=now
user!=unknown
| eval hour=strftime(_time, "%H")
| where hour < 06 OR hour > 20  /* Outside 6 AM - 8 PM */
| stats sum(bytes_sent) as sent by user, hour, application
| eval sent_gb=round(sent/1073741824, 2)
| sort -sent_gb
```

## Connection Correlation with Endpoint Events

**Cross-Reference with AMP:**

```spl
# Find network connections from infected endpoints
index=firewall sourcetype=cisco:ftd:connection 
[search index=endpoint sourcetype=cisco:amp:event disposition=malicious 
| return src_ip]
| stats count, values(dest_ip) as contacted_servers by src_ip, application
| sort -count
```

## Forensic Reporting

**Executive Summary:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
earliest=-30d latest=now
| stats 
    count as total_connections,
    dc(src_ip) as unique_sources,
    dc(dest_ip) as unique_destinations,
    sum(bytes_sent) as total_sent,
    sum(bytes_received) as total_received
    by action
| eval total_sent_tb=round(total_sent/1099511627776, 2), 
       total_received_tb=round(total_received/1099511627776, 2)
```

---

[← Back to FTD Overview](README.md){ .md-button }
