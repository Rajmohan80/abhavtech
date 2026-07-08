# TrustSec Forensics

 DEVICE TRUST VIOLATION

## Investigation Summary

**Incident:** Unmanaged personal laptop (BYOD) attempted to connect to corporate network with jailbroken security controls, failing ISE posture assessment.

**Detection:** ISE compliance module detected missing AMP, disabled firewall, and outdated OS; quarantined device automatically.

**Impact:** Device denied network access; user unable to work for 45 minutes until compliant device provisioned.

**Outcome:** BYOD policy violation identified, user educated, device compliance enforced.

---

## Step 1: ISE Posture Failure Detection

**Detection Timestamp:** 2026-01-31 10:15:23 UTC

**Alert Source:** ISE Compliance Module

```
ISE Alert: Posture Assessment Failed
Username: contractor-dev-02@abhavtech.com
MAC Address: 98:76:54:32:10:AB
Device Type: Personal Laptop (BYOD)
OS: macOS 13.1 (outdated - current: 14.3)
802.1X Result: Authentication Success
Posture Result: Non-Compliant

Failed Checks:
1. AMP Connector: Not Installed
2. OS Version: 13.1 (required: ≥14.0)
3. Firewall: Disabled
4. Disk Encryption: Disabled
5. Screen Lock: Not Configured
6. Antivirus Definitions: N/A (AMP not installed)

Action Taken: Quarantine VLAN (VLAN 999)
Authorization Profile: Remediation-Required
Session Duration: Until Remediation
```

**Immediate Response:**

```bash
CASE_ID="CASE-2026-013-DEVICE-TRUST"
INVESTIGATION_TYPE="byod_compliance_violation"

curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -d '{
    "short_description": "BYOD Device Non-Compliant - Quarantined",
    "urgency": "2",
    "impact": "3",
    "category": "Compliance"
  }'

## INC0012356
```

---

## Step 2: Export ISE Posture Assessment Details

**2.1 Query ISE for Endpoint Session:**

```bash
## Get endpoint session details
curl -k -X GET \
  "https://ise.abhavtech.com/admin/API/mnt/Session/MACAddress/98:76:54:32:10:AB" \
  -H "Accept: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  > /mnt/evidence_vault/EVD-20260131-001-ise-session.json

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260131-001-ise-session.json
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260131-001","CASE-2026-013-DEVICE-TRUST",...]}'
```

**2.2 Parse Posture Assessment Results:**

```bash
## Extract posture checks
jq '.sessionParameters.postureStatus' /mnt/evidence_vault/EVD-20260131-001-ise-session.json

## Output:
{
  "status": "NonCompliant",
  "timestamp": "2026-01-31T10:15:23Z",
  "checks": [
    {
      "name": "AMP_Installed",
      "status": "Failed",
      "required": true,
      "severity": "Critical"
    },
    {
      "name": "OS_Version_Check",
      "status": "Failed",
      "current_version": "13.1",
      "required_version": ">=14.0",
      "severity": "High"
    },
    {
      "name": "Firewall_Enabled",
      "status": "Failed",
      "current_state": "Disabled",
      "required_state": "Enabled",
      "severity": "High"
    },
    {
      "name": "Disk_Encryption",
      "status": "Failed",
      "current_state": "Not Encrypted",
      "required_state": "FileVault Enabled",
      "severity": "Critical"
    },
    {
      "name": "Screen_Lock",
      "status": "Failed",
      "timeout": "Never",
      "required_timeout": "<=5 minutes",
      "severity": "Medium"
    }
  ],
  "compliance_score": 0,  # 0 out of 100
  "trust_score": 12  # Very low trust score
}
```

**Device Trust Score Calculation:**

| Check | Weight | Status | Points |
|-------|--------|--------|--------|
| AMP Installed | 30% | ❌ Failed | 0/30 |
| OS Current | 25% | ❌ Failed | 0/25 |
| Firewall Enabled | 20% | ❌ Failed | 0/20 |
| Disk Encryption | 15% | ❌ Failed | 0/15 |
| Screen Lock | 10% | ❌ Failed | 0/10 |
| **Total** | **100%** | **Non-Compliant** | **0/100** |

Actual trust score: 12/100 (ISE adds 12 points for valid 802.1X authentication)

---

## Step 3: Analyze Device History

**3.1 Check Previous Connections:**

```spl
## Query Splunk for device history
index=network sourcetype=cisco:ise mac="98:76:54:32:10:AB" earliest=-30d
| table _time username postureStatus vlan ip_address
| sort _time

Results:
_time                  username                    postureStatus  vlan  ip_address
2026-01-15 14:23:15   contractor-dev-02           Compliant      100   10.252.25.89
2026-01-22 09:45:32   contractor-dev-02           Compliant      100   10.252.25.92
2026-01-29 11:12:48   contractor-dev-02           Compliant      100   10.252.25.87
2026-01-31 10:15:23   contractor-dev-02           NonCompliant   999   10.253.999.45

## Device was previously compliant
## Something changed on 2026-01-31 to make it non-compliant
```

**3.2 Contact User for Explanation:**

```bash
## Email user
cat << 'EOF' | mail -s "Device Compliance Issue - Action Required" contractor-dev-02@abhavtech.com
Dear Contractor,

Your device (MAC: 98:76:54:32:10:AB) has been quarantined due to compliance failures:

Failed Checks:
❌ AMP antivirus not installed
❌ macOS version outdated (13.1, required: 14.0+)
❌ Firewall disabled
❌ Disk encryption disabled
❌ Screen lock not configured

Your device has been moved to quarantine VLAN with restricted access.

To regain access:
1. Install Cisco AMP Connector: https://amp.abhavtech.com/install
2. Update macOS to 14.3
3. Enable FileVault disk encryption
4. Enable firewall: System Preferences → Security → Firewall
5. Configure screen lock: ≤5 minutes

Contact IT Support: support@abhavtech.com

Security Team
EOF

## User Response (received 10:45 UTC):
## "I reinstalled macOS yesterday to fix a performance issue and forgot to reinstall security tools.
## Will remediate immediately."
```

---

## Step 4: Monitor Remediation Progress

**4.1 Track Posture Re-Assessment:**

```bash
## ISE automatically re-assesses every 5 minutes
## Monitor compliance status

while true; do
  COMPLIANCE_STATUS=$(curl -k -s -X GET \
    "https://ise.abhavtech.com/admin/API/mnt/Session/MACAddress/98:76:54:32:10:AB" \
    -H "Accept: application/json" \
    -u "forensics-api:$ISE_PASSWORD" \
    | jq -r '.sessionParameters.postureStatus.status')
  
  echo "[$(date)] Compliance Status: $COMPLIANCE_STATUS"
  
  if [ "$COMPLIANCE_STATUS" == "Compliant" ]; then
    echo "✅ Device now compliant!"
    break
  fi
  
  sleep 300  # Check every 5 minutes
done

## Output:
[2026-01-31 10:20:00] Compliance Status: NonCompliant
[2026-01-31 10:25:00] Compliance Status: NonCompliant
[2026-01-31 10:30:00] Compliance Status: NonCompliant
[2026-01-31 10:35:00] Compliance Status: NonCompliant
[2026-01-31 10:40:00] Compliance Status: NonCompliant (OS update in progress)
[2026-01-31 10:45:00] Compliance Status: NonCompliant (rebooting)
[2026-01-31 10:50:00] Compliance Status: NonCompliant (installing AMP)
[2026-01-31 10:55:00] Compliance Status: Compliant
✅ Device now compliant!
```

**4.2 Verify Remediation:**

```bash
## Export final posture assessment
curl -k -X GET \
  "https://ise.abhavtech.com/admin/API/mnt/Session/MACAddress/98:76:54:32:10:AB" \
  -H "Accept: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  | jq '.sessionParameters.postureStatus.checks'

## Output:
[
  {
    "name": "AMP_Installed",
    "status": "Passed",  # ✅
    "version": "8.1.2",
    "severity": "Critical"
  },
  {
    "name": "OS_Version_Check",
    "status": "Passed",  # ✅
    "current_version": "14.3",
    "required_version": ">=14.0",
    "severity": "High"
  },
  {
    "name": "Firewall_Enabled",
    "status": "Passed",  # ✅
    "current_state": "Enabled",
    "severity": "High"
  },
  {
    "name": "Disk_Encryption",
    "status": "Passed",  # ✅
    "current_state": "FileVault Enabled",
    "severity": "Critical"
  },
  {
    "name": "Screen_Lock",
    "status": "Passed",  # ✅
    "timeout": "5 minutes",
    "severity": "Medium"
  }
]

## Trust Score: 100/100
```

---

## Step 5: Restore Network Access

**5.1 ISE Automatic VLAN Change:**

```bash
## ISE automatically detects compliance and changes authorization
## CoA (Change of Authorization) pushes new VLAN to switch

## Verify new session
curl -k -X GET \
  "https://ise.abhavtech.com/admin/API/mnt/Session/MACAddress/98:76:54:32:10:AB" \
  | jq '.sessionParameters | {vlan, ip_address, authorizationProfile}'

## Output:
{
  "vlan": "100",  # ← Moved from VLAN 999 (quarantine) to VLAN 100 (production)
  "ip_address": "10.252.25.93",  # New production IP
  "authorizationProfile": "Contractor-Full-Access"
}

## Device restored to production network
```

**5.2 Notify User:**

```bash
cat << 'EOF' | mail -s "Device Compliance Restored" contractor-dev-02@abhavtech.com
Your device is now compliant and has been restored to the corporate network.

Compliance Status: ✅ Passed All Checks
Trust Score: 100/100
Network Access: Full Access Restored

Thank you for promptly remediating the compliance issues.

Security Team
EOF
```

---

## Step 6: Forensics Report

```python
report = {
    "case_id": "CASE-2026-013-DEVICE-TRUST",
    "investigation_type": "BYOD Device Compliance Violation",
    "incident_date": "2026-01-31",
    "analyst": "SOC-Analyst-Vikram-Mehta",
    
    "executive_summary": """
    BYOD contractor laptop failed ISE posture assessment on 2026-01-31 due to
    missing security controls after OS reinstall. Device automatically quarantined
    to remediation VLAN with restricted access.
    
    Compliance Failures (Trust Score: 0/100):
    - AMP antivirus not installed
    - macOS outdated (13.1 vs. required 14.0+)
    - Firewall disabled
    - Disk encryption disabled (FileVault)
    - Screen lock not configured
    
    Impact: User unable to access corporate resources for 45 minutes
    
    Response:
    - ISE automatically quarantined device (VLAN 999)
    - User notified with remediation instructions
    - User remediated all issues within 45 minutes
    - ISE automatically restored access upon compliance
    
    Outcome: Zero Trust principle validated - "Never trust, always verify"
    Device trust dynamically enforced based on real-time posture assessment.
    """,
    
    "timeline": [
        "2026-01-30 Evening - User reinstalled macOS (performance issue)",
        "2026-01-31 10:15 - Device connects, ISE posture assessment fails",
        "2026-01-31 10:15 - Device quarantined to VLAN 999",
        "2026-01-31 10:17 - User notified via email",
        "2026-01-31 10:20 - User begins remediation",
        "2026-01-31 10:55 - All checks passed, device compliant",
        "2026-01-31 10:55 - ISE issues CoA, restores production access"
    ],
    
    "zero_trust_validation": """
    Zero Trust Principles Demonstrated:
    
    1. "Never Trust, Always Verify"
       - Device authenticated successfully via 802.1X
       - BUT posture assessment still failed device
       - Authentication ≠ Authorization
    
    2. Continuous Verification
       - ISE re-assesses every 5 minutes
       - Trust score dynamic, not static
       - Previous compliance doesn't guarantee future access
    
    3. Least Privilege Access
       - Non-compliant device: Quarantine VLAN only
       - Compliant device: Full production access
       - Access granted based on current trust level
    
    4. Micro-Segmentation
       - Quarantine VLAN (999) isolated from production
       - Internet-only access for remediation downloads
       - No lateral movement possible
    
    5. Automated Response
       - No human intervention required for quarantine
       - No human intervention required for restoration
       - Policy-driven, automated enforcement
    """,
    
    "recommendations": [
        "Deploy MDM for BYOD devices (Meraki Systems Manager)",
        "Implement automated AMP installation via Self-Service Portal",
        "Create self-service remediation portal for common issues",
        "Deploy browser-based VDI for non-compliant BYOD devices",
        "Enhance posture checks: check for jailbreak/root",
        "Implement grace period (1 hour) before full quarantine"
    ]
}

with open('/mnt/evidence_vault/REPORT-CASE-2026-013-DEVICE-TRUST.json', 'w') as f:
    json.dump(report, f, indent=2)
```

---
