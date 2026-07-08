# OMP Forensics

## Investigation Summary

**Incident:** Suspicious OMP route advertisements detected from Chennai branch site (vEdge-CHN-01), potentially redirecting Mumbai office traffic through attacker-controlled path.

**Detection:** vSmart controller logged unexpected OMP route for corporate VLAN 10.252.80.0/24 with next-hop pointing to Chennai instead of Mumbai border.

**Impact:** 15 minutes of Mumbai traffic potentially routed through compromised Chennai branch before detection.

**Outcome:** OMP route injection attack confirmed; compromised WAN edge identified and isolated.

---

## Step 1: Incident Detection and Initial Triage

**Detection Timestamp:** 2026-01-18 14:32:15 UTC

**Alert Source:** vManage Alarm

```
Alarm: "OMP Route Anomaly Detected"
Device: vSmart-APAC-01 (10.1.1.11)
Severity: Critical
Message: "Unexpected OMP route advertisement from vEdge-CHN-01 
         (10.252.20.1) for prefix 10.252.80.0/24 (VPN 10).
         Expected originator: vEdge-MUM-Border-01.
         Action: Route rejected by policy."
```

**Splunk Correlation:**

```spl
index=sdwan sourcetype=vmanage:alarm earliest=-1h
| search severity=critical device_hostname="vSmart-APAC-01"
| search "OMP Route Anomaly"
| table _time device_hostname severity message
| head 10

Result:
_time                  device_hostname      severity  message
2026-01-18 14:32:15   vSmart-APAC-01       critical  OMP Route Anomaly Detected...
2026-01-18 14:32:18   vSmart-APAC-01       critical  Multiple OMP anomalies from vEdge-CHN-01
2026-01-18 14:32:25   vSmart-APAC-01       warning   OMP session flapping: vEdge-CHN-01
```

**Initial Assessment:**
- Affected device: vEdge-CHN-01 (Chennai Branch)
- Suspicious prefix: 10.252.80.0/24 (Mumbai Finance VLAN)
- Time window: 2026-01-18 14:30:00 to 14:45:00 UTC
- Attack vector: OMP route injection (Layer 3 overlay manipulation)

**Create Investigation Case:**

```bash
## Create case in ServiceNow
curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic <base64-creds>' \
  -d '{
    "short_description": "SD-WAN OMP Route Injection - vEdge-CHN-01",
    "description": "Malicious OMP route detected from Chennai branch, potential traffic hijacking",
    "urgency": "1",
    "impact": "1",
    "category": "Security",
    "assignment_group": "SOC-Forensics-Team",
    "caller_id": "XDR-Automation"
  }'

## ServiceNow returns: INC0012345
```

**Evidence Preservation Initiate:**

```bash
## Initialize blockchain evidence collection
CASE_ID="CASE-2026-001-OMP"
INVESTIGATION_TYPE="omp_route_injection"

## Python script to begin automated collection
python3 /opt/forensics/blockchain_collector.py \
  --case-id $CASE_ID \
  --investigation-type $INVESTIGATION_TYPE \
  --affected-device "vEdge-CHN-01" \
  --time-window "2026-01-18T14:30:00Z,2026-01-18T14:45:00Z"
```

---

## Step 2: Preserve vManage State and Configuration

**Objective:** Capture current vManage state before any changes or further attacks.

**2.1 Export vSmart OMP Route Table:**

```bash
## Authenticate to vManage API
source /opt/forensics/vmanage-auth.sh
## Sets: $COOKIE, $TOKEN

## Export all OMP routes received by vSmart-APAC-01
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/device/omp/routes/received?deviceId=10.1.1.11" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  > /mnt/evidence_vault/EVD-20260118-001-omp-routes.json

## Calculate hash
sha256sum /mnt/evidence_vault/EVD-20260118-001-omp-routes.json
## Output: 3f2a8b9c7d6e5f4a3b2c1d0e9f8a7b6c...

## Register on blockchain
peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{
    "Args":[
      "CollectEvidence",
      "EVD-20260118-001",
      "CASE-2026-001-OMP",
      "vmanage_omp_routes",
      "EVD-20260118-001-omp-routes.json",
      "487392",
      "3f2a8b9c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b",
      "forensics-ws01.abhavtech.com",
      "SOC-Analyst-Priya-Sharma",
      "vSmart-APAC-01",
      "365",
      "[\"SOC-Team\",\"Legal-Team\",\"Network-Team\"]"
    ]
  }'
```

**2.2 Export Device Configurations:**

```bash
## Export running config for vEdge-CHN-01
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/device/config/attached?deviceId=10.252.20.1" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  > /mnt/evidence_vault/EVD-20260118-002-vedge-chn-01-config.json

## Register on blockchain
## (blockchain registration similar to above)

## Export vSmart control policies (to verify legitimate routes)
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/template/policy/vsmart" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  > /mnt/evidence_vault/EVD-20260118-003-vsmart-policies.json

## Register on blockchain
```

**2.3 Capture Device Status:**

```bash
## Export system status for vEdge-CHN-01
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/device/system/status?deviceId=10.252.20.1" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  > /mnt/evidence_vault/EVD-20260118-004-vedge-status.json

## Export control connections (to check for rogue vSmart)
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/device/control/connections?deviceId=10.252.20.1" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  > /mnt/evidence_vault/EVD-20260118-005-control-connections.json
```

**2.4 Export Audit Logs:**

```bash
## Export vManage audit log for past 24 hours
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/auditlog?startDate=$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%S)&endDate=$(date -u +%Y-%m-%dT%H:%M:%S)" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  > /mnt/evidence_vault/EVD-20260118-006-audit-log.json

## Search for suspicious activity
jq '.data[] | select(.logdetails | contains("vEdge-CHN-01"))' \
  /mnt/evidence_vault/EVD-20260118-006-audit-log.json

## Result shows:
## 2026-01-18 14:25:43 - User "field-tech-chennai" logged in from 102.23.XX.XXX
## 2026-01-18 14:26:15 - Configuration template pushed to vEdge-CHN-01
## 2026-01-18 14:27:02 - OMP route-policy modified on vEdge-CHN-01
```

---

## Step 3: Analyze OMP Route Advertisements

**Objective:** Identify the malicious OMP route and determine scope.

**3.1 Extract Suspicious Route Details:**

```bash
## Parse OMP routes JSON for prefix 10.252.80.0/24
jq '.data[] | select(.prefix == "10.252.80.0/24")' \
  /mnt/evidence_vault/EVD-20260118-001-omp-routes.json

## Output:
{
  "prefix": "10.252.80.0/24",
  "protocol": "omp",
  "next-hop": "10.252.20.1",  # ← SUSPICIOUS: Chennai vEdge
  "from-peer": "vEdge-CHN-01",
  "vpn-id": "10",
  "preference": "200",        # ← Higher than legitimate (100)
  "tag": "malicious",         # ← Attacker-controlled tag
  "originator": "10.252.20.1",
  "tloc": {
    "ip": "113.27.XX.XXX",     # Chennai WAN IP
    "color": "mpls",
    "encapsulation": "ipsec"
  },
  "attribute": {
    "site-id": "20",          # Chennai site-id
    "received-from": "vSmart-APAC-01"
  },
  "status": "C,I"             # C=Current, I=Invalid
}

## Expected legitimate route (for comparison):
{
  "prefix": "10.252.80.0/24",
  "protocol": "omp",
  "next-hop": "10.252.1.1",   # Mumbai Border (correct)
  "from-peer": "vEdge-MUM-Border-01",
  "vpn-id": "10",
  "preference": "100",        # Normal preference
  "tag": "corporate",
  "originator": "10.252.1.1",
  "tloc": {
    "ip": "115.84.XX.XXX",     # Mumbai WAN IP
    "color": "mpls",
    "encapsulation": "ipsec"
  },
  "attribute": {
    "site-id": "1"            # Mumbai HQ site-id
  },
  "status": "C"               # Valid route
}
```

**3.2 Identify Route Manipulation Timeline:**

```bash
## Query Splunk for OMP route changes
cat << 'EOF' | splunk search -auth admin:password
index=sdwan sourcetype=vmanage:omp earliest=-1h
| search vpn_id=10 prefix="10.252.80.0/24"
| eval route_change=if(originator!="10.252.1.1", "ANOMALY", "NORMAL")
| table _time device_hostname originator next_hop preference route_change
| sort _time
EOF

## Results:
_time                  device       originator    next_hop      pref  route_change
2026-01-18 14:25:00   vSmart-01    10.252.1.1    10.252.1.1    100   NORMAL
2026-01-18 14:30:18   vSmart-01    10.252.20.1   10.252.20.1   200   ANOMALY  ← Attack starts
2026-01-18 14:30:25   vSmart-01    10.252.20.1   10.252.20.1   200   ANOMALY
2026-01-18 14:32:15   vSmart-01    BLOCKED       -             -     ANOMALY  ← vSmart blocks
2026-01-18 14:45:00   vSmart-01    10.252.1.1    10.252.1.1    100   NORMAL   ← Restored
```

**Attack Timeline Established:**
- 14:25:43 - Attacker logs into vManage as "field-tech-chennai"
- 14:27:02 - OMP route-policy modified on vEdge-CHN-01
- 14:30:18 - First malicious OMP route advertised
- 14:32:15 - vSmart detects anomaly and rejects route (automated policy)
- 14:45:00 - Legitimate route fully restored

**Exposure Window:** ~15 minutes (14:30 to 14:45)

---

## Step 4: Determine Traffic Impact

**Objective:** Quantify how much traffic was redirected through Chennai.

**4.1 Check NetFlow Data:**

```bash
## Query Splunk for flows destined to 10.252.80.0/24 during attack window
cat << 'EOF' | splunk search
index=netflow earliest="2026-01-18T14:25:00" latest="2026-01-18T14:50:00"
| search dest_subnet="10.252.80.0/24"
| stats sum(bytes) as total_bytes by src_site next_hop
| eval total_mb=round(total_bytes/1024/1024, 2)
| table src_site next_hop total_mb
| sort - total_mb
EOF

## Results:
src_site              next_hop      total_mb
Mumbai-Office         10.252.20.1   847.32    ← Traffic hijacked to Chennai!
Delhi-Office          10.252.20.1   234.56
Bangalore-Office      10.252.1.1    12.45     ← Legitimate path
```

**Impact Summary:**
- **847 MB** of Mumbai traffic redirected through Chennai
- **234 MB** from Delhi also affected
- Total hijacked: **1.08 GB**
- Legitimate traffic (Bangalore): Unaffected

**4.2 Analyze DPI Data for Sensitive Applications:**

```bash
## Check if sensitive apps (Banking, SAP) were affected
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/statistics/dpi/aggregation?startDate=2026-01-18T14:25:00&endDate=2026-01-18T14:50:00" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  | jq '.data[] | select(.application | contains("SAP", "Banking"))'

## Result:
{
  "application": "SAP-ERP",
  "total_bytes": 423847392,  # ~404 MB
  "src_ip": "10.252.10.45",
  "dest_ip": "10.252.80.12",
  "next_hop": "10.252.20.1",  # ← Routed through Chennai
  "start_time": "2026-01-18T14:31:15",
  "end_time": "2026-01-18T14:44:58"
}

## CRITICAL FINDING: SAP ERP traffic was hijacked!
```

---

## Step 5: Collect Packet Captures

**Objective:** Capture packets from Chennai vEdge to analyze what attacker did with hijacked traffic.

**5.1 Enable SPAN on Chennai Border Switch:**

```bash
## SSH to Chennai core switch
ssh admin@chennai-core-sw01.abhavtech.com

## Configure SPAN to forensics workstation
config t
monitor session 1 source interface Gi1/0/24  # vEdge-CHN-01 uplink
monitor session 1 destination interface Gi1/0/48  # Forensics port
monitor session 1 filter vlan 10
end

## Verify SPAN
show monitor session 1

## Session 1
## ---------
## Type : Local Session
## Source Ports : Gi1/0/24
## Destination Ports : Gi1/0/48
## Filter VLANs : 10
```

**5.2 Capture Traffic on Forensics Workstation:**

```bash
## Capture 10 minutes of traffic
sudo tcpdump -i eth0 -w /tmp/chennai-vedge-capture.pcap \
  -G 600 -W 1 'vlan 10'

## Wait for capture to complete...
## File size: 2.4 GB

## Move to evidence vault
sudo mv /tmp/chennai-vedge-capture.pcap \
  /mnt/evidence_vault/EVD-20260118-007-chennai-capture.pcap

## Hash and register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260118-007-chennai-capture.pcap
## 7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d

## Register on blockchain
peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{
    "Args":[
      "CollectEvidence",
      "EVD-20260118-007",
      "CASE-2026-001-OMP",
      "pcap",
      "EVD-20260118-007-chennai-capture.pcap",
      "2483924847",
      "7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
      "forensics-ws01.abhavtech.com",
      "SOC-Analyst-Priya-Sharma",
      "Chennai-Core-SW01-SPAN",
      "365",
      "[\"SOC-Team\",\"Legal-Team\"]"
    ]
  }'
```

**5.3 Analyze PCAP with Wireshark:**

```bash
## Open in Wireshark
wireshark /mnt/evidence_vault/EVD-20260118-007-chennai-capture.pcap &

## Apply display filter
## (dst net 10.252.80.0/24) and (ip.ttl < 30)

## Analysis findings:
## 1. TTL values show packets traversed Chennai vEdge (TTL decremented)
## 2. Packets mirrored to external IP: 114.61.XX.XXX (unknown)
## 3. Evidence of packet duplication (attacker copied traffic)
```

**Export suspicious flows for analysis:**

```bash
## Extract flows to external IP using tshark
tshark -r /mnt/evidence_vault/EVD-20260118-007-chennai-capture.pcap \
  -Y "ip.dst == 114.61.XX.XXX" \
  -T fields \
  -e frame.time \
  -e ip.src \
  -e ip.dst \
  -e tcp.srcport \
  -e tcp.dstport \
  -e frame.len \
  -E header=y \
  -E separator=, \
  > /mnt/evidence_vault/EVD-20260118-008-exfil-flows.csv

## Sample output:
frame.time,ip.src,ip.dst,tcp.srcport,tcp.dstport,frame.len
2026-01-18 14:31:22,10.252.10.45,114.61.XX.XXX,49123,443,1514
2026-01-18 14:31:23,10.252.10.45,114.61.XX.XXX,49123,443,1514
2026-01-18 14:31:24,10.252.10.45,114.61.XX.XXX,49123,443,1514

## CRITICAL: SAP traffic was mirrored to attacker IP!
```

---

## Step 6: Root Cause Analysis - Configuration Changes

**Objective:** Determine how attacker injected malicious OMP route.

**6.1 Review vEdge Configuration Changes:**

```bash
## Compare current config vs. last-known-good (24 hours ago)
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/device/config/attached?deviceId=10.252.20.1" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  > /tmp/current-config.json

## Retrieve config from 24 hours ago (backup)
cp /mnt/backups/vmanage/vedge-chn-01-20260117.json /tmp/baseline-config.json

## Compare configs
diff <(jq -S . /tmp/baseline-config.json) \
     <(jq -S . /tmp/current-config.json)

## Differences found:
< "omp": {
<   "advertise": {
<     "connected": true,
<     "static": false
<   }
< }

> "omp": {
>   "advertise": {
>     "connected": true,
>     "static": true,           # ← CHANGED: Static route advertisement enabled
>     "prefix-list": "INJECT-ROUTES"  # ← NEW: Malicious prefix-list
>   }
> }

> "ip": {
>   "route": {
>     "10.252.80.0/24": {
>       "next-hop": "null0",    # ← ADDED: Null route to trigger OMP advertisement
>       "administrative-distance": "1"
>     }
>   }
> }
```

**Attack Method Identified:**
1. Attacker added static route: `10.252.80.0/24 → null0`
2. Configured OMP to advertise static routes
3. vEdge-CHN-01 advertised this route to vSmart
4. vSmart initially accepted route (higher preference = 200)
5. Legitimate traffic redirected to Chennai
6. Attacker mirrored traffic to external IP before forwarding

**6.2 Identify Attacker Credentials:**

```bash
## Review audit log for login
jq '.data[] | select(.logmessage | contains("field-tech-chennai"))' \
  /mnt/evidence_vault/EVD-20260118-006-audit-log.json

## Result:
{
  "entry": "2026-01-18 14:25:43",
  "logmessage": "User login success",
  "loguser": "field-tech-chennai",
  "logipaddress": "102.23.XX.XXX",  # Chennai office IP
  "logsource": "vmanage-nj-dc01"
}

## Check if this is a legitimate user
ldapsearch -x -H ldap://dc01.abhavtech.com \
  -D "cn=ldap-query,ou=service,dc=abhavtech,dc=com" \
  -w <password> \
  -b "ou=users,dc=abhavtech,dc=com" \
  "(sAMAccountName=field-tech-chennai)"

## Result: User exists, but last password change: 2025-12-01
## Possible credential theft or insider threat
```

---

## Step 7: Correlate with XDR and Endpoint Security

**Objective:** Check if attacker accessed other systems.

**7.1 Query XDR for Related Activity:**

```bash
## Query XDR API for user "field-tech-chennai" activity
curl -k -X GET \
  "https://securex.abhavtech.com/api/investigate/observables/user/field-tech-chennai/sightings" \
  -H "Authorization: Bearer $XDR_TOKEN" \
  | jq '.data[]'

## Results:
{
  "timestamp": "2026-01-18T14:20:15Z",
  "source": "Duo",
  "event": "MFA success",
  "device": "LAPTOP-CHN-045",
  "location": "Chennai, India",
  "risk_score": 35
}

{
  "timestamp": "2026-01-18T14:25:30Z",
  "source": "AMP",
  "event": "Process execution: PuTTY.exe",
  "device": "LAPTOP-CHN-045",
  "command_line": "putty.exe -ssh vmanage.abhavtech.com",
  "risk_score": 45
}

{
  "timestamp": "2026-01-18T14:26:00Z",
  "source": "Umbrella",
  "event": "DNS query: vmanage.abhavtech.com",
  "device": "LAPTOP-CHN-045",
  "risk_score": 10
}
```

**7.2 Check Endpoint for Compromise:**

```bash
## Use AMP Orbital to query endpoint LAPTOP-CHN-045
curl -k -X POST \
  "https://orbital.amp.cisco.com/v0/jobs" \
  -H "Authorization: Bearer $ORBITAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Forensics - Check Browser History",
    "query": "SELECT url, visit_count, last_visit_time FROM chrome_history WHERE url LIKE \"%vmanage%\" ORDER BY last_visit_time DESC LIMIT 100;",
    "connector_guid": "<LAPTOP-CHN-045-GUID>"
  }'

## Results show:
## URL: https://102.23.XX.XXX:8443 (unknown server accessed before vManage)
## Possible C2 server or attacker infrastructure
```

---

## Step 8: Validate Detection and Containment

**Objective:** Verify vSmart automated response prevented widespread impact.

**8.1 Review vSmart Control Policy:**

```bash
## Export vSmart control policy that blocked malicious route
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/template/policy/vsmart/definition" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  | jq '.[] | select(.policyName == "OMP-Route-Validation")'

## Policy excerpt:
{
  "policyName": "OMP-Route-Validation",
  "policyType": "control",
  "sequences": [
    {
      "sequenceId": 10,
      "sequenceName": "Block-Invalid-Originators",
      "match": {
        "prefix-list": "Corporate-Prefixes",
        "site-list": "Branch-Sites"  # Chennai is in Branch-Sites
      },
      "actions": {
        "reject": true,
        "log": true
      }
    }
  ]
}

## Policy Logic:
## IF (prefix in Corporate-Prefixes) AND (originator in Branch-Sites)
## THEN reject route (branches cannot advertise corporate prefixes)
```

**Why Attack Was Limited:**
- vSmart policy detected Chennai (branch site) advertising Mumbai prefix (corporate)
- Route marked as "Invalid" and rejected from OMP table
- vEdges that already received route before rejection: ~8 devices
- Exposure limited to 15 minutes until vSmart rejected all routes

**8.2 Verify Automated Containment:**

```bash
## Check XDR playbook that triggered containment
curl -k -X GET \
  "https://securex.abhavtech.com/api/casebook/incidents" \
  -H "Authorization: Bearer $XDR_TOKEN" \
  | jq '.[] | select(.title | contains("OMP"))'

## Playbook execution:
{
  "incident_id": "INC-2026-001-OMP",
  "playbook": "SD-WAN-Route-Anomaly-Response",
  "actions": [
    {
      "action": "Send alert to SOC",
      "status": "completed",
      "timestamp": "2026-01-18T14:32:20Z"
    },
    {
      "action": "Create ServiceNow ticket",
      "status": "completed",
      "ticket_id": "INC0012345"
    },
    {
      "action": "Isolate vEdge-CHN-01 (ISE quarantine)",
      "status": "completed",
      "timestamp": "2026-01-18T14:33:45Z"
    }
  ]
}
```

---

## Step 9: Remediation and Recovery

**Objective:** Remove malicious configuration and restore normal operations.

**9.1 Isolate Compromised Device:**

```bash
## ISE quarantine already applied by XDR playbook
## Verify quarantine status
curl -k -X GET \
  "https://ise.abhavtech.com/ers/config/endpoint/name/vEdge-CHN-01" \
  -H "Accept: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  | jq '.ERSEndPoint | .groupId, .staticGroupAssignment'

## Result:
{
  "groupId": "quarantine-group-id",
  "staticGroupAssignment": true
}

## Device isolated: No network access except management VLAN
```

**9.2 Restore Clean Configuration:**

```bash
## Revert vEdge-CHN-01 to last-known-good config
curl -k -X POST \
  "https://vmanage.abhavtech.com/dataservice/template/device/config/attachfeature" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "deviceTemplateList": [
      {
        "templateId": "baseline-vedge-template-id",
        "device": [
          {
            "csv-deviceId": "10.252.20.1",
            "csv-host-name": "vEdge-CHN-01"
          }
        ],
        "isEdited": false,
        "isMasterEdited": false
      }
    ]
  }'

## Verify config push
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/device/action/status/<action-id>" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN"

## Status: "Success - Configuration restored"
```

**9.3 Reset User Credentials:**

```bash
## Disable compromised account
net user field-tech-chennai /active:no /domain

## Force password reset for all Chennai field technicians
for user in field-tech-chennai-{01..05}; do
  net user $user /logonpasswordchg:yes /domain
done

## Notify users
cat << EOF | mail -s "Password Reset Required" chennai-field-techs@abhavtech.com
Your account password must be reset due to a security incident.
Contact IT helpdesk immediately.
EOF
```

**9.4 Verify Route Restoration:**

```bash
## Check OMP routing table
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/device/omp/routes/received?deviceId=10.1.1.11" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  | jq '.data[] | select(.prefix == "10.252.80.0/24")'

## Expected result (legitimate route):
{
  "prefix": "10.252.80.0/24",
  "protocol": "omp",
  "next-hop": "10.252.1.1",   # ← Restored to Mumbai
  "from-peer": "vEdge-MUM-Border-01",
  "vpn-id": "10",
  "preference": "100",
  "status": "C"               # Current, valid
}

## Route restored successfully
```

---

## Step 10: Documentation and Lessons Learned

**Objective:** Create forensics report and improve detection.

**10.1 Generate Forensics Report:**

```bash
## Use Python script to generate report from blockchain evidence
python3 << 'EOF'
import json
from datetime import datetime

## Load evidence from blockchain
evidence_items = [
    "EVD-20260118-001",  # OMP routes
    "EVD-20260118-002",  # Device config
    "EVD-20260118-003",  # vSmart policies
    "EVD-20260118-004",  # Device status
    "EVD-20260118-005",  # Control connections
    "EVD-20260118-006",  # Audit log
    "EVD-20260118-007",  # PCAP
    "EVD-20260118-008"   # Exfil flows
]

report = {
    "case_id": "CASE-2026-001-OMP",
    "investigation_type": "OMP Route Injection",
    "incident_date": "2026-01-18",
    "analyst": "SOC-Analyst-Priya-Sharma",
    "report_date": datetime.utcnow().isoformat(),
    
    "executive_summary": """
    On 2026-01-18 at 14:30 UTC, a malicious OMP route injection attack was
    detected originating from vEdge-CHN-01 (Chennai Branch). The attacker,
    using compromised credentials (field-tech-chennai), modified the device
    configuration to advertise a static route for Mumbai's Finance VLAN
    (10.252.80.0/24) with higher preference than the legitimate route.
    
    This caused approximately 1.08 GB of traffic (including 404 MB of SAP ERP
    data) to be redirected through Chennai for 15 minutes before automated
    vSmart control policies detected and blocked the malicious route.
    
    Evidence shows the attacker mirrored hijacked traffic to an external IP
    (114.61.XX.XXX) before forwarding to legitimate destinations, constituting
    a man-in-the-middle attack and potential data exfiltration.
    
    Impact: MEDIUM
    - Data exposure: 1.08 GB (including sensitive SAP transactions)
    - Service disruption: None (transparent to users)
    - Credential compromise: 1 account (field-tech-chennai)
    
    Response: Automated vSmart policy + XDR playbook contained attack within
    15 minutes. Manual forensics completed within 4 hours.
    """,
    
    "evidence_inventory": evidence_items,
    
    "timeline": [
        {"time": "2026-01-18T14:20:15Z", "event": "Attacker MFA to LAPTOP-CHN-045"},
        {"time": "2026-01-18T14:25:43Z", "event": "Login to vManage as field-tech-chennai"},
        {"time": "2026-01-18T14:27:02Z", "event": "Modified OMP config on vEdge-CHN-01"},
        {"time": "2026-01-18T14:30:18Z", "event": "First malicious OMP route advertised"},
        {"time": "2026-01-18T14:31:22Z", "event": "Traffic mirroring to 114.61.XX.XXX begins"},
        {"time": "2026-01-18T14:32:15Z", "event": "vSmart detects anomaly, blocks route"},
        {"time": "2026-01-18T14:33:45Z", "event": "XDR playbook isolates vEdge-CHN-01"},
        {"time": "2026-01-18T14:45:00Z", "event": "Legitimate route fully restored"}
    ],
    
    "attack_methodology": """
    1. Credential compromise: Attacker obtained valid credentials
       (field-tech-chennai) via unknown method (phishing suspected)
    2. Configuration modification: Added static route + OMP advertisement
    3. Route injection: vEdge advertised malicious route to vSmart
    4. Traffic hijacking: Legitimate traffic redirected to Chennai
    5. Data exfiltration: Mirrored traffic to external IP
    6. Detection: vSmart control policy triggered within 2 minutes
    7. Containment: XDR automated playbook isolated device
    """,
    
    "recommendations": [
        "Implement MFA for all vManage access (not just VPN)",
        "Enable vManage role-based access control (limit config changes)",
        "Add alerting for OMP route changes in Splunk",
        "Deploy vManage API rate limiting",
        "Conduct phishing awareness training for field technicians",
        "Review and tighten vSmart control policies",
        "Implement automated DPI anomaly detection (ThousandEyes integration)"
    ]
}

## Save report
with open('/mnt/evidence_vault/REPORT-CASE-2026-001-OMP.json', 'w') as f:
    json.dump(report, f, indent=2)

print("✅ Forensics report generated")
print(f"   Location: /mnt/evidence_vault/REPORT-CASE-2026-001-OMP.json")
EOF

## Register report on blockchain
sha256sum /mnt/evidence_vault/REPORT-CASE-2026-001-OMP.json
## a1b2c3d4e5f6...

peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{
    "Args":[
      "CollectEvidence",
      "EVD-20260118-REPORT",
      "CASE-2026-001-OMP",
      "forensics_report",
      "REPORT-CASE-2026-001-OMP.json",
      "12847",
      "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
      "forensics-ws01.abhavtech.com",
      "SOC-Analyst-Priya-Sharma",
      "Forensics-Report-Generator",
      "3650",
      "[\"SOC-Team\",\"Legal-Team\",\"Executive-Team\"]"
    ]
  }'
```

**10.2 Improve Detection:**

```spl
## Create new Splunk alert for OMP route anomalies
[sdwan_omp_route_anomaly]
search = index=sdwan sourcetype=vmanage:omp
| eval is_corporate_prefix=if(match(prefix, "10\.252\.(1|80|90)\.0/24"), 1, 0)
| eval is_branch_site=if(site_id >= 10, 1, 0)
| where is_corporate_prefix=1 AND is_branch_site=1
| table _time device_hostname prefix originator site_id
| eval severity="critical"

action.email = 1
action.email.to = soc-team@abhavtech.com
action.email.subject = OMP Route Injection Detected
cron_schedule = */5 * * * *
```

**10.3 Close Investigation:**

```bash
## Update ServiceNow incident
curl -X PATCH \
  https://abhavtech.service-now.com/api/now/table/incident/INC0012345 \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic <base64-creds>' \
  -d '{
    "state": "6",
    "close_code": "Resolved",
    "close_notes": "OMP route injection attack contained. Evidence preserved on blockchain (EVD-20260118-001 through EVD-20260118-REPORT). Attacker credentials disabled. Device configuration restored. See forensics report for full details."
  }'

## Final blockchain ledger entry
peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{
    "Args":[
      "LogAccess",
      "EVD-20260118-REPORT",
      "SOC-Manager-Amit-Patel",
      "case_closure",
      "Investigation completed. All evidence verified and case closed."
    ]
  }'
```

---
