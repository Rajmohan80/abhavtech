# Firewall Logs

**Sub-Section:** FTD Forensics  
**Source:** Cisco Firepower Threat Defense (FTD) Connection Events

---

## Overview

FTD firewall logs provide comprehensive visibility into network traffic, connections, and security policy enforcement. This chapter covers forensic analysis of FTD connection events, firewall rule hits, and traffic patterns for security investigations.

## FTD Platform Architecture

**Firewall Infrastructure:**
- FTD Devices: 12 total across deployment
  - Data Center: 4x FPR-2140 (NJ-DC: 2, LON-DC: 2) - HA pairs  
  - Regional Hubs: 6x FPR-1150 (Mumbai, Chennai, Frankfurt, Dallas, Tokyo, Sydney)  
  - Branch Aggregation: 2x FTDv (Cloud-based for remote sites)
- Management: Firepower Management Center (FMC) - HA cluster
- Version: FTD 7.4.1

**Security Features:**
- Application Visibility and Control (AVC)
- Intrusion Prevention System (IPS) - Snort 3
- Advanced Malware Protection (AMP) integration
- URL Filtering (Cisco Talos)
- SSL/TLS Decryption
- File Policy and Malware Analysis
- Security Intelligence (IP/Domain reputation)

## Evidence Sources

| Evidence Type | Source | Collection Method | Retention |
|---------------|--------|-------------------|-----------|
| **Connection Events** | FTD | Syslog to Splunk | 90 days |
| **URL Filtering Logs** | FTD | Syslog to Splunk | 90 days |
| **SSL/TLS Decryption Logs** | FTD | FMC database | 90 days |
| **Security Intelligence Blocks** | FTD | Syslog to Splunk | 90 days |
| **Packet Captures** | FTD | On-demand PCAP | Real-time |

## FMC REST API Authentication

**Obtain FMC Token:**

```bash
# Authenticate to Firepower Management Center
curl -X POST https://fmc.abhavtech.com/api/fmc_platform/v1/auth/generatetoken \
  -H 'Content-Type: application/json' \
  -u 'forensics-api:<password>' \
  -k \
  -D - \
  | grep -i 'X-auth-access-token'

# Extract tokens
X-auth-access-token: <access-token>
X-auth-refresh-token: <refresh-token>
DOMAIN_UUID: <domain-uuid>

# Store for use
FMC_TOKEN="<access-token>"
FMC_DOMAIN="<domain-uuid>"
```

## Connection Event Analysis

**Query Connection Events:**

```bash
# Export connection events for specific timeframe
curl -k -X GET \
  "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/${FMC_DOMAIN}/search/event" \
  -H "X-auth-access-token: ${FMC_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "CONNECTION",
    "startTime": "2026-01-28T00:00:00Z",
    "endTime": "2026-01-28T23:59:59Z",
    "limit": 10000
  }' > connection_events.json
```

**Parse Connection Events:**

```python
import json

with open('connection_events.json', 'r') as f:
    events = json.load(f)

# Analyze top talkers
src_ips = {}
for event in events['items']:
    src = event['sourceIP']
    src_ips[src] = src_ips.get(src, 0) + 1

# Sort by connection count
top_talkers = sorted(src_ips.items(), key=lambda x: x[1], reverse=True)
for ip, count in top_talkers[:10]:
    print(f"{ip}: {count} connections")
```

## Splunk Connection Analysis

**Search Connection Events:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
earliest=-24h latest=now
| stats count by src_ip, dest_ip, dest_port, action
| sort -count
| head 20
```

**Identify Data Exfiltration:**

```spl
# Large outbound transfers
index=firewall sourcetype=cisco:ftd:connection 
earliest=-7d latest=now
action=allowed direction=outbound
| stats sum(bytes_sent) as total_bytes by src_ip, dest_ip
| where total_bytes > 1073741824  /* 1 GB threshold */
| eval total_gb=round(total_bytes/1073741824, 2)
| sort -total_gb
```

**Unusual Port Activity:**

```spl
index=firewall sourcetype=cisco:ftd:connection 
earliest=-24h latest=now
| stats count by dest_port
| where dest_port NOT IN (80, 443, 22, 25, 53, 3389, 445)
| sort -count
```

## URL Filtering Log Analysis

**Query Blocked URLs:**

```spl
index=firewall sourcetype=cisco:ftd:url 
earliest=-24h latest=now
action=blocked
| stats count by url, category, user
| sort -count
```

**Extract Top Blocked Categories:**

```spl
index=firewall sourcetype=cisco:ftd:url 
earliest=-7d latest=now
action=blocked
| stats count by category
| sort -count
```

## SSL Decryption Logs

**Decrypted Sessions:**

```bash
# Query SSL decryption events
curl -k -X GET \
  "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/${FMC_DOMAIN}/search/event" \
  -H "X-auth-access-token: ${FMC_TOKEN}" \
  -d '{
    "eventType": "SSL",
    "sslAction": "DECRYPT",
    "startTime": "2026-01-28T00:00:00Z",
    "endTime": "2026-01-28T23:59:59Z"
  }' > ssl_decrypt_events.json
```

## Packet Capture from FTD

**Initiate On-Demand Capture:**

```bash
# Start packet capture via FMC API
curl -k -X POST \
  "https://fmc.abhavtech.com/api/fmc_troubleshoot/v1/domain/${FMC_DOMAIN}/packettracer" \
  -H "X-auth-access-token: ${FMC_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceIP": "10.1.50.25",
    "destinationIP": "8.8.8.8",
    "sourcePort": "54321",
    "destinationPort": "443",
    "protocol": "TCP",
    "device": {
      "id": "<device-uuid>",
      "type": "Device"
    }
  }'
```

## Firewall Policy Analysis

**Export Access Policies:**

```bash
# List all access policies
curl -k -X GET \
  "https://fmc.abhavtech.com/api/fmc_config/v1/domain/${FMC_DOMAIN}/policy/accesspolicies" \
  -H "X-auth-access-token: ${FMC_TOKEN}"

# Get specific policy rules
curl -k -X GET \
  "https://fmc.abhavtech.com/api/fmc_config/v1/domain/${FMC_DOMAIN}/policy/accesspolicies/<policy-id>/accessrules" \
  -H "X-auth-access-token: ${FMC_TOKEN}"
```

## Security Intelligence Blocks

**Query Blocked IPs:**

```spl
index=firewall sourcetype=cisco:ftd:security_intelligence 
earliest=-24h latest=now
| stats count by src_ip, dest_ip, reason
| sort -count
```

**Extract Threat Feed Hits:**

```bash
# Query security intelligence feed blocks
curl -k -X GET \
  "https://fmc.abhavtech.com/api/fmc_config/v1/domain/${FMC_DOMAIN}/object/sisources" \
  -H "X-auth-access-token: ${FMC_TOKEN}"
```

## Forensic Workflows

### Data Exfiltration Investigation

1. **Identify abnormal outbound traffic** (volume, destination, time)
2. **Correlate with endpoint events** (malware, user activity)
3. **Extract connection details** (source, destination, bytes transferred)
4. **Analyze application layer** (HTTP headers, TLS SNI)
5. **Block malicious destination** (add to security intelligence feed)

### Lateral Movement Detection

1. **Search for internal-to-internal connections** on sensitive ports
2. **Identify protocol anomalies** (RDP, SMB, WinRM from unexpected sources)
3. **Correlate with authentication logs** (ISE, Active Directory)
4. **Extract timeline** of lateral movement attempts
5. **Contain compromised systems** (ISE quarantine + firewall block)

---

[← Back to FTD Overview](README.md){ .md-button }
