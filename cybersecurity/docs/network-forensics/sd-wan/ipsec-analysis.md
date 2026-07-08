# IPsec Analysis

## Investigation Summary

**Incident:** IPsec tunnel between Mumbai-Border and New Jersey DC experienced unexplained re-keying and traffic drop during business hours.

**Detection:** vManage alarm "IPsec tunnel rekeying anomaly" triggered when tunnel rekeyed 47 times in 10 minutes (normal: once per hour).

**Impact:** 8 minutes of intermittent packet loss (12% average) affecting Mumbai-to-NJ application traffic.

**Outcome:** IPsec tunnel downgrade attack detected; attacker attempted to force weak encryption to enable decryption.

---

## Step 1: Incident Detection and Triage

**Detection Timestamp:** 2026-01-19 09:15:32 UTC

**Alert Source:** vManage Alarm

```
Alarm: "IPsec Tunnel Rekey Anomaly"
Device: vEdge-MUM-Border-01 (10.252.1.1)
Severity: Major
Message: "IPsec tunnel to NJ-DC (tloc: 198.51.100.45, color: mpls)
         rekeyed 47 times in 10 minutes. Normal frequency: 1/hour.
         Possible attack or misconfiguration."
Timestamp: 2026-01-19 09:15:32 UTC
```

**Initial Splunk Query:**

```spl
index=sdwan sourcetype=vmanage:alarm earliest=-1h
| search device_hostname="vEdge-MUM-Border-01"
| search alarm_type="ipsec"
| table _time severity alarm_type message

Result:
_time                  severity  alarm_type        message
2026-01-19 09:05:18   info      ipsec_rekey       Normal rekey - tunnel to NJ-DC
2026-01-19 09:06:45   warning   ipsec_rekey       Unexpected rekey - tunnel to NJ-DC
2026-01-19 09:07:12   warning   ipsec_rekey       Unexpected rekey - tunnel to NJ-DC
2026-01-19 09:08:34   major     ipsec_rekey       Rekey storm detected
2026-01-19 09:15:32   major     ipsec_anomaly     Tunnel instability - 47 rekeys in 10 min
```

**Create Investigation Case:**

```bash
CASE_ID="CASE-2026-002-IPSEC"
INVESTIGATION_TYPE="ipsec_tunnel_attack"

## ServiceNow incident
curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic <base64-creds>' \
  -d '{
    "short_description": "SD-WAN IPsec Tunnel Hijacking - Mumbai to NJ",
    "description": "IPsec tunnel rekey anomaly detected, potential downgrade attack",
    "urgency": "1",
    "impact": "2",
    "category": "Security",
    "assignment_group": "SOC-Forensics-Team"
  }'

## Returns: INC0012346
```

---

## Step 2: Collect IPsec Tunnel Status

**2.1 Export Current Tunnel State:**

```bash
## Authenticate to vManage
source /opt/forensics/vmanage-auth.sh

## Get IPsec tunnel statistics for affected device
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/device/tunnel/statistics?deviceId=10.252.1.1" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  > /mnt/evidence_vault/EVD-20260119-001-ipsec-tunnels.json

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260119-001-ipsec-tunnels.json
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260119-001","CASE-2026-002-IPSEC",...]}'
```

**2.2 Extract Tunnel Details:**

```bash
## Parse JSON for affected tunnel
jq '.data[] | select(.remote_tloc_address == "198.51.100.45")' \
  /mnt/evidence_vault/EVD-20260119-001-ipsec-tunnels.json

## Output:
{
  "local_system_ip": "10.252.1.1",
  "local_color": "mpls",
  "remote_system_ip": "10.1.1.1",    # NJ-DC vEdge
  "remote_tloc_address": "198.51.100.45",
  "remote_color": "mpls",
  "tunnel_mtu": 1438,
  "tx_pkts": 45847392,
  "rx_pkts": 43928374,
  "tx_octets": 29384729847,
  "rx_octets": 28374928374,
  "tx_errors": 0,
  "rx_errors": 2847,              # ← Packet loss during attack
  "encryption_algorithm": "aes256",
  "ipsec_rekeys": 52,             # ← Abnormal: should be ~9 (1 per hour * 9 hours uptime)
  "esp_anti_replay_failures": 143, # ← Anti-replay failures indicate packet manipulation
  "uptime": "9h 15m 32s",
  "last_rekey_time": "2026-01-19T09:14:58Z",
  "current_spi_in": "0xc7d8e9f0",
  "current_spi_out": "0xa1b2c3d4"
}
```

**Key Findings:**
- **52 rekeys** in 9 hours (expected: 9)
- **143 ESP anti-replay failures** (indicates packet injection or replay attack)
- **2,847 RX errors** during attack window

---

## Step 3: Analyze Rekey Timeline

**3.1 Export Historical Rekey Events:**

```bash
## Query vManage for rekey history
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/data/device/statistics/ipsec?deviceId=10.252.1.1&startDate=$(date -u -d '12 hours ago' +%Y-%m-%dT%H:%M:%S)&endDate=$(date -u +%Y-%m-%dT%H:%M:%S)" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  > /mnt/evidence_vault/EVD-20260119-002-rekey-history.json

## Extract rekey events
jq '.data[] | select(.remote_tloc_address == "198.51.100.45") | {timestamp: .timestamp, rekey_reason: .rekey_reason, encryption: .encryption_algorithm}' \
  /mnt/evidence_vault/EVD-20260119-002-rekey-history.json

## Output:
{"timestamp":"2026-01-19T00:05:18Z","rekey_reason":"lifetime_expired","encryption":"aes256"}
{"timestamp":"2026-01-19T01:05:18Z","rekey_reason":"lifetime_expired","encryption":"aes256"}
...
{"timestamp":"2026-01-19T09:06:45Z","rekey_reason":"invalid_proposal","encryption":"aes256"}  # ← ANOMALY
{"timestamp":"2026-01-19T09:07:12Z","rekey_reason":"invalid_proposal","encryption":"aes128"}  # ← DOWNGRADE!
{"timestamp":"2026-01-19T09:07:43Z","rekey_reason":"invalid_proposal","encryption":"3des"}    # ← SEVERE DOWNGRADE!
{"timestamp":"2026-01-19T09:08:15Z","rekey_reason":"invalid_proposal","encryption":"aes128"}
...
{"timestamp":"2026-01-19T09:14:58Z","rekey_reason":"manual_trigger","encryption":"aes256"}    # ← Restored
```

**Attack Pattern Identified:**
- Normal rekeys: `lifetime_expired` with `aes256`
- Attack rekeys: `invalid_proposal` with progressively weaker encryption
- **Attacker attempted to downgrade encryption to 3DES** (weak, easily crackable)

---

## Step 4: Capture IPsec Packets

**4.1 Enable SPAN on Mumbai Border:**

```bash
## SSH to Mumbai core switch
ssh admin@mumbai-core-sw01.abhavtech.com

config t
monitor session 2 source interface Te1/0/1  # vEdge-MUM-Border WAN uplink
monitor session 2 destination interface Gi1/0/48
monitor session 2 filter ip 198.51.100.45  # NJ-DC public IP
end
```

**4.2 Capture IPsec Negotiation:**

```bash
## Capture ISAKMP (UDP 500) and ESP packets
sudo tcpdump -i eth0 -w /tmp/ipsec-capture.pcap \
  '(udp port 500 or esp) and host 198.51.100.45' \
  -G 600 -W 1

## Wait for 10 minutes...
## Move to evidence vault
sudo mv /tmp/ipsec-capture.pcap \
  /mnt/evidence_vault/EVD-20260119-003-ipsec-packets.pcap

## Hash and blockchain registration
sha256sum /mnt/evidence_vault/EVD-20260119-003-ipsec-packets.pcap
## 5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7

peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260119-003","CASE-2026-002-IPSEC","pcap",...]}'
```

**4.3 Analyze PCAP with Wireshark:**

```bash
## Open in Wireshark
wireshark /mnt/evidence_vault/EVD-20260119-003-ipsec-packets.pcap &

## Filter for ISAKMP proposals
## Filter: isakmp

## Analysis findings (frame 234):
Internet Security Association and Key Management Protocol
    Initiator SPI: 0x3f4a5b6c7d8e9f0a
    Responder SPI: 0x0000000000000000
    Next payload: Security Association (1)
    Exchange type: Identity Protection (Main Mode) (2)
    
    Security Association payload
        Proposal 1
            Transform 1
                Transform ID: KEY_IKE (1)
                Encryption: 3DES-CBC (5)  # ← WEAK ENCRYPTION PROPOSED!
                Hash: MD5 (1)             # ← WEAK HASH PROPOSED!
                Group Description: 768-bit MODP (1)  # ← WEAK DH GROUP!
```

**Attacker Methodology:**
- Injected malicious ISAKMP proposals with weak algorithms
- Forced vEdge to negotiate down to 3DES encryption
- If successful, attacker could decrypt tunnel traffic

---

## Step 5: Identify Attack Source

**5.1 Analyze Packet Source:**

```bash
## Extract ISAKMP packets with weak proposals
tshark -r /mnt/evidence_vault/EVD-20260119-003-ipsec-packets.pcap \
  -Y "isakmp.exchangetype == 2 and isakmp.doi == 1" \
  -T fields \
  -e frame.time \
  -e ip.src \
  -e ip.dst \
  -e isakmp.spi_i \
  -E header=y

## Output:
frame.time,ip.src,ip.dst,isakmp.spi_i
2026-01-19 09:06:45,115.84.XX.XXX,198.51.100.45,0x1a2b3c4d5e6f7a8b  # Legitimate
2026-01-19 09:07:12,114.61.XX.XXX,198.51.100.45,0x3f4a5b6c7d8e9f0a  # ← ATTACKER IP!
2026-01-19 09:07:43,114.61.XX.XXX,198.51.100.45,0x5a6b7c8d9e0f1a2b  # ← ATTACKER IP!
```

**Attacker IP:** `114.61.XX.XXX`

**Geolocation:**

```bash
## Whois lookup
whois 114.61.XX.XXX

## Result:
NetRange:       114.61.XX.XXX - 114.61.XX.XXX
Organization:   Unknown Hosting Provider (UHP-01)
Country:        RU
City:           Moscow
NetType:        Allocated to VPS customers
```

**5.2 Check Firewall Logs:**

```bash
## Query Splunk for traffic from attacker IP
cat << 'EOF' | splunk search
index=firewall sourcetype=cisco:ftd earliest=-24h
| search src_ip="114.61.XX.XXX" OR dest_ip="114.61.XX.XXX"
| table _time src_ip dest_ip src_port dest_port action
| sort _time
EOF

## Results:
_time                  src_ip          dest_ip        src_port  dest_port  action
2026-01-19 09:05:00   114.61.XX.XXX    198.51.100.45  48392     500        ALLOW  # ← Initial probe
2026-01-19 09:06:45   114.61.XX.XXX    198.51.100.45  49123     500        ALLOW  # ← Attack start
...
2026-01-19 09:15:30   10.1.1.1        114.61.XX.XXX   500       49123      BLOCK  # ← Blocked after detection
```

---

## Step 6: Determine Impact

**6.1 Analyze Packet Loss During Attack:**

```bash
## Query ThousandEyes for Mumbai-to-NJ path
curl -k -X GET \
  "https://api.thousandeyes.com/v6/tests/network/12345/path-vis?window=2026-01-19T09:00:00,2026-01-19T09:30:00" \
  -H "Authorization: Bearer $TE_TOKEN" \
  | jq '.pathVis[] | {timestamp: .timestamp, loss: .loss}'

## Results:
{"timestamp":"2026-01-19T09:05:00Z","loss":0.0}
{"timestamp":"2026-01-19T09:07:00Z","loss":4.2}   # Attack begins
{"timestamp":"2026-01-19T09:08:00Z","loss":12.3}  # Peak packet loss
{"timestamp":"2026-01-19T09:10:00Z","loss":8.7}
{"timestamp":"2026-01-19T09:15:00Z","loss":0.5}   # Attack ends
{"timestamp":"2026-01-19T09:20:00Z","loss":0.0}   # Restored
```

**Impact Window:** 8 minutes (09:07 to 09:15)
**Peak Packet Loss:** 12.3%
**Average Packet Loss:** 7.4%

**6.2 Check Application Impact:**

```bash
## Query AppDynamics for ERP transaction errors
curl -k -X GET \
  "https://abhavtech.saas.appdynamics.com/controller/rest/applications/ERP/metric-data?metric-path=Business%20Transaction%20Performance|Business%20Transactions|*|*|Errors%20per%20Minute&time-range-type=BEFORE_NOW&duration-in-mins=60" \
  -H "Authorization: Bearer $APPD_TOKEN" \
  | jq '.[] | select(.metricName | contains("Mumbai-to-NJ"))'

## Results show:
## Normal error rate: 0.2 errors/min
## During attack: 14.7 errors/min (73x increase)
## Error type: "Connection timeout - database unreachable"
```

---

## Step 7: Root Cause - Attack Methodology

**Attack Analysis:**

1. **Reconnaissance:** Attacker scanned public IP range, found IPsec endpoint (198.51.100.45)
2. **Initial Probe:** Sent ISAKMP packet to identify IPsec version/implementation
3. **Downgrade Attack:** Injected malicious ISAKMP proposals with weak ciphers
4. **Goal:** Force tunnel to negotiate 3DES, enabling decryption
5. **Failure:** vEdge rejected weak proposals, but caused rekey storm
6. **Side Effect:** Packet loss during continuous rekeying

**Why Attack Failed:**
- vManage IPsec policy enforces minimum encryption: AES-256
- Weak proposals (3DES, MD5) automatically rejected
- However, rejection caused repeated rekey attempts

**vManage Policy Check:**

```bash
## Export IPsec profile
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/template/feature/security/ipsec" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  | jq '.[] | .security.ipsec'

## Policy shows:
{
  "ike_version": "ikev2",
  "ike_encryption": ["aes256", "aes128"],  # 3DES not allowed
  "ike_integrity": ["sha256", "sha384"],   # MD5 not allowed
  "ike_dh_group": ["14", "15", "16"],      # Group 1 (768-bit) not allowed
  "perfect_forward_secrecy": "group-14",
  "rekey_interval": 3600,
  "anti_replay": "enabled",
  "anti_replay_window_size": 512
}

## Policy correctly blocked weak algorithms
```

---

## Step 8: Containment and Remediation

**8.1 Block Attacker IP:**

```bash
## Add firewall rule to block attacker
curl -k -X POST \
  "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/default/policy/accesspolicies/<policy-id>/accessrules" \
  -H "X-auth-access-token: $FMC_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "BLOCK",
    "enabled": true,
    "type": "AccessRule",
    "name": "Block-IPsec-Attacker-114.61.XX.XXX",
    "sourceNetworks": {
      "objects": [
        {"type": "Host", "value": "114.61.XX.XXX"}
      ]
    },
    "destinationPorts": {
      "objects": [
        {"type": "ProtocolPortObject", "protocol": "UDP", "port": "500"}
      ]
    },
    "logBegin": true,
    "sendEventsToFMC": true
  }'

## Deploy policy
curl -k -X POST \
  "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/default/deployment/deployabledevices" \
  -H "X-auth-access-token: $FMC_TOKEN"

## Attacker IP blocked on all FTD firewalls
```

**8.2 Enable Rate Limiting for ISAKMP:**

```bash
## Configure vManage to rate-limit ISAKMP packets
curl -k -X PUT \
  "https://vmanage.abhavtech.com/dataservice/template/feature/security/ipsec/<template-id>" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "security": {
      "ipsec": {
        "rate_limit": {
          "enabled": true,
          "max_negotiations_per_second": 5,
          "max_invalid_proposals_per_minute": 10
        }
      }
    }
  }'

## Push config to all vEdges
curl -k -X POST \
  "https://vmanage.abhavtech.com/dataservice/template/device/config/attachfeature" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  -d '{"deviceTemplateList":[...]}'
```

**8.3 Monitor for Continued Attacks:**

```spl
## Create Splunk alert for IPsec downgrade attempts
[ipsec_downgrade_attack]
search = index=sdwan sourcetype=vmanage:ipsec
| search rekey_reason="invalid_proposal"
| stats count by device_hostname remote_tloc_address encryption_algorithm
| where encryption_algorithm IN ("3des", "des")
| eval severity="critical"

action.email = 1
action.email.to = soc-team@abhavtech.com
action.email.subject = IPsec Downgrade Attack Detected
cron_schedule = */5 * * * *
```

---

## Step 9: Evidence Preservation

**9.1 Create Evidence Summary:**

```bash
## List all evidence collected
ls -lh /mnt/evidence_vault/EVD-20260119-*

-rw-r--r-- 1 forensics forensics  487K Jan 19 09:30 EVD-20260119-001-ipsec-tunnels.json
-rw-r--r-- 1 forensics forensics  1.2M Jan 19 09:35 EVD-20260119-002-rekey-history.json
-rw-r--r-- 1 forensics forensics  2.8G Jan 19 09:45 EVD-20260119-003-ipsec-packets.pcap

## Verify blockchain registration for all evidence
for EVD in EVD-20260119-001 EVD-20260119-002 EVD-20260119-003; do
  echo "Verifying $EVD..."
  peer chaincode query -n evidence-contract -C evidence-channel \
    -c "{\"Args\":[\"QueryEvidence\",\"$EVD\"]}" \
    | jq -r '.evidence_id, .sha256_hash'
done

## All evidence verified on blockchain
```

---

## Step 10: Forensics Report

**Generate Report:**

```python
report = {
    "case_id": "CASE-2026-002-IPSEC",
    "investigation_type": "IPsec Tunnel Downgrade Attack",
    "incident_date": "2026-01-19",
    "analyst": "SOC-Analyst-Vikram-Singh",
    
    "executive_summary": """
    On 2026-01-19 at 09:06 UTC, an IPsec tunnel downgrade attack was detected
    targeting the Mumbai-to-NJ WAN connection. An external attacker (IP:
    114.61.XX.XXX, Moscow, Russia) injected malicious ISAKMP proposals
    attempting to force the tunnel to negotiate weak encryption (3DES, MD5).
    
    The attack failed due to properly configured vManage IPsec policies that
    reject weak algorithms. However, the repeated invalid proposals caused
    a "rekey storm" (47 rekeys in 10 minutes) that resulted in 8 minutes of
    packet loss (peak 12.3%, average 7.4%).
    
    Impact: LOW-MEDIUM
    - Packet loss: 12.3% for 8 minutes
    - Application errors: 14.7/min (ERP database timeouts)
    - No data exposure (encryption not compromised)
    
    Response: Attacker IP blocked on all FTD firewalls. ISAKMP rate limiting
    enabled on all vEdges. No further attacks observed.
    """,
    
    "attack_methodology": """
    1. Reconnaissance: Scanned public IP range for IPsec endpoints
    2. Initial probe: Identified vEdge IPsec implementation
    3. Downgrade attempt: Injected ISAKMP proposals with weak ciphers
       - 3DES-CBC encryption (easily crackable)
       - MD5 hash (collision attacks possible)
       - DH Group 1 (768-bit, vulnerable to Logjam)
    4. Goal: Force tunnel to weak encryption, decrypt traffic
    5. Failure: vManage policy rejected weak algorithms
    6. Side effect: Rekey storm caused packet loss
    """,
    
    "recommendations": [
        "Implement ISAKMP rate limiting (completed)",
        "Add GeoIP blocking for high-risk countries on UDP 500",
        "Enable IKEv2 only (disable IKEv1 for stronger security)",
        "Deploy ISAKMP anomaly detection in Splunk",
        "Conduct quarterly IPsec policy audits"
    ]
}

## Save and register on blockchain
with open('/mnt/evidence_vault/REPORT-CASE-2026-002-IPSEC.json', 'w') as f:
    json.dump(report, f, indent=2)

## Blockchain registration (similar to Scenario 1)
```

---
