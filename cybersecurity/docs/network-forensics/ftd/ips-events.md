# IPS Events

**Sub-Section:** FTD Forensics  
**Source:** Cisco Firepower IPS (Snort 3) Intrusion Events

---

## Overview

FTD's Intrusion Prevention System (IPS) powered by Snort 3 provides real-time threat detection and blocking. This chapter covers forensic analysis of IPS events, exploit attempts, and attack patterns.

## IPS Architecture

**Detection Engine:**
- Snort 3 (next-generation IPS)
- Signature-based detection
- Anomaly-based detection
- Protocol analysis
- File inspection integration

**Signature Updates:**
- Cisco Talos Intelligence
- Automatic daily updates
- Custom Snort rules
- Community rules integration

## Evidence Collection

**Export Intrusion Events:**

```bash
# Query IPS events from FMC
curl -k -X GET \
  "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/${FMC_DOMAIN}/search/event" \
  -H "X-auth-access-token: ${FMC_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "INTRUSION",
    "startTime": "2026-01-28T00:00:00Z",
    "endTime": "2026-01-28T23:59:59Z",
    "priority": "HIGH",
    "limit": 5000
  }' > ips_events.json
```

## IPS Event Analysis in Splunk

**High-Severity Alerts:**

```spl
index=firewall sourcetype=cisco:ftd:intrusion 
earliest=-24h latest=now
priority=high OR priority=critical
| stats count by signature, src_ip, dest_ip
| sort -count
```

**Exploit Attempt Detection:**

```spl
index=firewall sourcetype=cisco:ftd:intrusion 
earliest=-7d latest=now
signature="*EXPLOIT*" OR signature="*CVE-*"
| stats count by signature, src_ip, classification
| sort -count
```

**Blocked vs. Alerted Events:**

```spl
index=firewall sourcetype=cisco:ftd:intrusion 
earliest=-24h latest=now
| stats count by action, priority
| chart count by action, priority
```

## Common Attack Patterns

### SQL Injection Attempts

**Signature:** `SQL Injection Attack Detected`

**Investigation Steps:**

1. **Extract Event Details:**
```spl
index=firewall sourcetype=cisco:ftd:intrusion 
signature="*SQL*Injection*"
| table _time, src_ip, dest_ip, dest_port, uri, payload
```

2. **Correlate with Web Server Logs:**
```spl
index=webserver earliest=-1h latest=now
[search index=firewall sourcetype=cisco:ftd:intrusion signature="*SQL*Injection*" 
| return src_ip]
| table _time, clientip, method, uri, status, user_agent
```

3. **Validate Vulnerability:**
- Check if target application is vulnerable
- Review WAF logs for bypass attempts
- Test query injection vectors in staging

### Remote Code Execution (RCE)

**Signature:** `Remote Code Execution Attempt`

**Analysis:**

```spl
index=firewall sourcetype=cisco:ftd:intrusion 
classification="*Remote Code Execution*"
| stats values(dest_ip) as targets, count by signature, src_ip
| sort -count
```

**Containment:**

```bash
# Block attacking IP via Security Intelligence
curl -k -X POST \
  "https://fmc.abhavtech.com/api/fmc_config/v1/domain/${FMC_DOMAIN}/object/networkaddresses" \
  -H "X-auth-access-token: ${FMC_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "BLOCKED_RCE_ATTACKER_10.20.30.40",
    "value": "10.20.30.40",
    "overridable": false,
    "type": "Host"
  }'
```

### Malware Communication

**Signature:** `Trojan Activity Detected` / `Botnet Traffic Identified`

**Investigation:**

```spl
index=firewall sourcetype=cisco:ftd:intrusion 
(signature="*Trojan*" OR signature="*Botnet*" OR signature="*C2*")
| stats count, values(dest_ip) as c2_servers by src_ip
| join src_ip [search index=endpoint | fields src_ip, hostname, user]
```

## Custom Snort Rules

**Create Custom Rule:**

```bash
# Example: Detect specific malware C2 pattern
alert tcp $HOME_NET any -> $EXTERNAL_NET 443 (
  msg:"Suspected TrickBot C2 Communication";
  flow:established,to_server;
  content:"POST";
  http_method;
  content:"/images/";
  http_uri;
  pcre:"/\/images\/[a-z0-9]{32}\.png/";
  classtype:trojan-activity;
  sid:9000001;
  rev:1;
)
```

**Deploy Custom Rule via FMC:**

```bash
# Add custom Snort rule to FMC
curl -k -X POST \
  "https://fmc.abhavtech.com/api/fmc_config/v1/domain/${FMC_DOMAIN}/policy/intrusionpolicies/<policy-id>/rules" \
  -H "X-auth-access-token: ${FMC_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "ruleData": "<snort-rule>",
    "type": "IntrusionRule"
  }'
```

## Attack Timeline Reconstruction

**Build Attack Timeline:**

```spl
index=firewall sourcetype=cisco:ftd:intrusion 
src_ip=192.168.50.105
| sort _time
| table _time, signature, dest_ip, dest_port, action, priority
| outputlookup attack_timeline_192.168.50.105.csv
```

## IPS Performance Metrics

**Rule Performance:**

```bash
# Query IPS health metrics
curl -k -X GET \
  "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/${FMC_DOMAIN}/health/metrics" \
  -H "X-auth-access-token: ${FMC_TOKEN}" \
  -d '{
    "metric": "ips_throughput",
    "deviceId": "<device-uuid>"
  }'
```

**Dropped Packets:**

```spl
index=firewall sourcetype=cisco:ftd:health 
metric="dropped_packets"
| timechart avg(value) by device
```

## False Positive Tuning

**Suppress Noisy Signature:**

```bash
# Suppress specific rule globally
curl -k -X POST \
  "https://fmc.abhavtech.com/api/fmc_config/v1/domain/${FMC_DOMAIN}/policy/intrusionpolicies/<policy-id>/rules/<rule-id>/suppress" \
  -H "X-auth-access-token: ${FMC_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceIP": "10.1.1.0/24",
    "destinationIP": "10.2.2.0/24"
  }'
```

## Integration with SIEM

**Forward IPS Events to Splunk:**

```bash
# Configure syslog forwarding from FMC
# FMC GUI: System > Integration > Syslog Alerts
# Add Splunk server: splunk.abhavtech.com:514
# Event types: Intrusion, Connection, File
```

---

[← Back to FTD Overview](README.md){ .md-button }
