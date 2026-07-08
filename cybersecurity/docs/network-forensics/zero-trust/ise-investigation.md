# ISE Investigation

 MFA BYPASS ATTEMPT INVESTIGATION

## Investigation Summary

**Incident:** Attacker attempted to bypass MFA using SIM swap attack and stolen credentials to access VPN and corporate applications.

**Detection:** Duo flagged impossible travel + new device authentication from user's account within minutes of legitimate login.

**Impact:** Unauthorized VPN access for 8 minutes before automatic session termination; no lateral movement or data access.

**Outcome:** SIM swap attack detected, user notified, MFA method changed to hardware token, attacker account disabled.

---

## Step 1: Initial Detection - Duo Impossible Travel Alert

**Detection Timestamp:** 2026-01-30 14:32:45 UTC

**Alert Source:** Duo Security - Impossible Travel Detection

```
Duo Alert: Impossible Travel Detected
User: finance-director@abhavtech.com
Device 1: iPhone 13 Pro (Trusted)
Location 1: Mumbai, India (19.0760° N, 72.8777° E)
Time 1: 2026-01-30 14:25:18 UTC

Device 2: Unknown Android (New)
Location 2: Lagos, Nigeria (6.5244° N, 3.3792° E)
Time 2: 2026-01-30 14:32:45 UTC

Time Delta: 7 minutes 27 seconds
Distance: 5,847 km
Max Possible Speed: 47,000 km/h (impossible)

Risk Assessment: CRITICAL
Action: Second authentication DENIED by adaptive policy
```

**Immediate Response:**

```bash
CASE_ID="CASE-2026-012-MFA-BYPASS"
INVESTIGATION_TYPE="mfa_bypass_sim_swap"

curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic <base64-creds>' \
  -d '{
    "short_description": "MFA Bypass Attempt - Impossible Travel",
    "description": "Duo detected impossible travel for finance director account, potential SIM swap attack",
    "urgency": "1",
    "impact": "1",
    "category": "Security - Identity Compromise",
    "assignment_group": "SOC-Forensics-Team"
  }'

## INC0012355

## Immediately revoke all user sessions
curl -X POST \
  "https://api.duosecurity.com/admin/v1/users/finance-director@abhavtech.com/sessions/revoke" \
  -u "$DUO_IKEY:$DUO_SKEY" \
  --data-urlencode "all_sessions=true"

## Response:
{
  "stat": "OK",
  "response": {
    "sessions_revoked": 2,
    "timestamp": "2026-01-30T14:33:15Z"
  }
}

## All sessions revoked within 30 seconds of alert
```

---

## Step 2: Export Duo Authentication Logs

**2.1 Query Duo Admin API:**

```bash
## Authenticate to Duo Admin API
DUO_IKEY="<integration-key>"
DUO_SKEY="<secret-key>"
DUO_HOST="api-abcd1234.duosecurity.com"

## Export authentication logs for past 24 hours
curl -X GET \
  "https://$DUO_HOST/admin/v2/logs/authentication?mintime=$(date -u -d '24 hours ago' +%s)000" \
  -u "$DUO_IKEY:$DUO_SKEY" \
  > /mnt/evidence_vault/EVD-20260130-001-duo-auth-logs.json

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260130-001-duo-auth-logs.json
## e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8

peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{
    "Args":[
      "CollectEvidence",
      "EVD-20260130-001",
      "CASE-2026-012-MFA-BYPASS",
      "duo_auth_logs",
      "EVD-20260130-001-duo-auth-logs.json",
      "487293",
      "e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8",
      "forensics-ws01.abhavtech.com",
      "SOC-Analyst-Aisha-Khan",
      "Duo-Admin-API",
      "365",
      "[\"SOC-Team\",\"Legal-Team\",\"HR-Team\"]"
    ]
  }'
```

**2.2 Parse Authentication Events:**

```bash
## Filter for finance-director account
jq '.response.authlogs[] | select(.user.name == "finance-director@abhavtech.com")' \
  /mnt/evidence_vault/EVD-20260130-001-duo-auth-logs.json \
  | jq -s 'sort_by(.timestamp)' \
  > /mnt/evidence_vault/EVD-20260130-002-user-auth-timeline.json

## Extract key authentication events
jq '.[] | {
  timestamp: .timestamp,
  result: .result,
  factor: .factor,
  device: .device,
  location: .location,
  ip: .ip,
  application: .application.name
}' /mnt/evidence_vault/EVD-20260130-002-user-auth-timeline.json

## Sample output (chronological):
{
  "timestamp": 1738246518,  # 2026-01-30 14:25:18 UTC
  "result": "success",
  "factor": "duo_push",
  "device": "iPhone 13 Pro (iOS 17.2)",
  "location": "Mumbai, Maharashtra, IN",
  "ip": "102.23.XX.XXX",
  "application": "Cisco AnyConnect VPN"
}
{
  "timestamp": 1738246965,  # 2026-01-30 14:32:45 UTC
  "result": "denied",  # ← BLOCKED by impossible travel
  "factor": "sms",  # ← Different factor (SMS vs. Duo Push)
  "device": "Unknown Android Device",
  "location": "Lagos, Lagos, NG",  # ← Nigeria
  "ip": "111.49.XX.XXX",
  "application": "Cisco AnyConnect VPN"
}

## Timeline:
## 14:25:18 - Legitimate login (Mumbai, iPhone, Duo Push)
## 14:32:45 - Attack login attempt (Lagos, Android, SMS) DENIED
## Time delta: 7 minutes 27 seconds
## Distance: 5,847 km
```

---

## Step 3: Analyze Legitimate vs. Malicious Activity

**3.1 Compare Authentication Methods:**

```bash
## Legitimate user pattern (historical)
jq '.[] | select(.result == "success" and .timestamp < 1738246965) | {
  factor: .factor,
  device: .device,
  ip: .ip
} | .factor' /mnt/evidence_vault/EVD-20260130-002-user-auth-timeline.json \
  | sort | uniq -c

## Output:
  187 "duo_push"  # User always uses Duo Push
    0 "sms"       # NEVER uses SMS
    0 "phone_call"

## User has never used SMS for MFA - strong indicator of attack
```

**3.2 Analyze Attack Device:**

```bash
## Extract device details from denied authentication
jq '.[] | select(.result == "denied")' \
  /mnt/evidence_vault/EVD-20260130-002-user-auth-timeline.json

## Output:
{
  "timestamp": 1738246965,
  "result": "denied",
  "factor": "sms",
  "device": "Unknown Android Device",
  "device_id": null,  # Not enrolled in Duo
  "device_fingerprint": "Mozilla/5.0 (Linux; Android 12)",
  "location": "Lagos, Lagos, NG",
  "ip": "111.49.XX.XXX",
  "isp": "MTN Nigeria",
  "trusted_device": false,  # ← NOT a trusted device
  "new_enrollment": false
}

## Characteristics:
## - New device (not in Duo inventory)
## - Android (user uses iPhone)
## - Nigeria (user is in India)
## - MTN Nigeria ISP (cellular network)
## - SMS factor (user never uses SMS)
```

**3.3 Check VPN Access:**

```bash
## Query ISE for VPN access attempts
curl -k -X GET \
  "https://ise.abhavtech.com/admin/API/mnt/Session/ActiveList" \
  -H "Accept: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  | jq '.sessionParameters[] | select(.user_name == "finance-director@abhavtech.com")'

## Output shows brief VPN session:
{
  "session_id": "0a123456789abcdef",
  "user_name": "finance-director@abhavtech.com",
  "nas_ip_address": "10.252.1.100",  # VPN concentrator
  "framed_ip_address": "10.253.100.45",  # Assigned VPN IP
  "calling_station_id": "102.23.XX.XXX",  # Legitimate Mumbai IP
  "session_start": "2026-01-30T14:25:25Z",
  "session_duration": 480,  # 8 minutes
  "bytes_in": 1847293,
  "bytes_out": 284729,
  "session_state": "Terminated"  # Session ended
}

## Legitimate VPN session lasted 8 minutes
## Attack attempt occurred during active legitimate session
```

---

## Step 4: Investigate SIM Swap Attack

**4.1 Contact Cellular Carrier:**

```bash
## User's mobile number: +91-98765-43210 (Indian number)
## Contact carrier (Airtel India) for SIM activity

## Carrier Response (received via email 2026-01-30 15:30 UTC):
From: security@airtel.in
Subject: RE: Emergency SIM Activity Query - +91-98765-43210

Dear Abhavtech Security Team,

We have reviewed the SIM activity for mobile number +91-98765-43210:

Timeline:
- 2026-01-30 13:45 UTC: SIM replacement request received at Lagos, Nigeria retail store
- Request method: In-person with stolen ID documents
- Verification: ID document verification passed (fraudulent documents)
- 2026-01-30 13:50 UTC: New SIM activated
- 2026-01-30 13:52 UTC: SMS received on new SIM (Duo passcode: 847293)
- 2026-01-30 14:30 UTC: Old SIM deactivated automatically

Fraud Indicators:
- SIM swap request in Nigeria (account holder in India)
- ID documents flagged as fraudulent (post-analysis)
- International roaming not enabled on account

Action Taken:
- New SIM immediately deactivated (2026-01-30 14:35 UTC)
- Original SIM reactivated
- Account flagged for fraud protection
- Police report filed in Lagos

Airtel Security Operations
EOF

## SIM swap attack confirmed
## Attacker obtained temporary access to SMS codes (5-minute window)
```

**4.2 Reconstruct Attack Timeline:**

```python
## Create detailed timeline
timeline = [
    {
        "time": "2026-01-30 13:45:00",
        "event": "Attacker visits Lagos retail store with fake ID",
        "source": "Carrier report"
    },
    {
        "time": "2026-01-30 13:50:00",
        "event": "New SIM activated in Nigeria (attacker controls SMS)",
        "source": "Carrier report"
    },
    {
        "time": "2026-01-30 14:25:18",
        "event": "Legitimate user authenticates from Mumbai (Duo Push to iPhone)",
        "source": "Duo logs"
    },
    {
        "time": "2026-01-30 14:30:00",
        "event": "Attacker attempts VPN login, triggers Duo SMS to compromised number",
        "source": "Duo logs"
    },
    {
        "time": "2026-01-30 14:32:45",
        "event": "Duo sends SMS code (847293) to Nigeria SIM",
        "source": "Carrier report"
    },
    {
        "time": "2026-01-30 14:32:47",
        "event": "Duo DENIES authentication (impossible travel detected)",
        "source": "Duo logs"
    },
    {
        "time": "2026-01-30 14:33:15",
        "event": "SOC revokes all user sessions",
        "source": "Incident response"
    },
    {
        "time": "2026-01-30 14:35:00",
        "event": "Carrier deactivates Nigeria SIM, restores original",
        "source": "Carrier report"
    }
]

## Save timeline
import json
with open('/mnt/evidence_vault/EVD-20260130-003-attack-timeline.json', 'w') as f:
    json.dump(timeline, f, indent=2)

## Register on blockchain
```

**Key Insight:** Duo's impossible travel detection prevented successful attack despite attacker having SMS access.

---

## Step 5: Analyze Credential Compromise

**5.1 Determine How Attacker Obtained Password:**

```bash
## Check for password spraying attempts
curl -k -X GET \
  "https://ise.abhavtech.com/admin/API/mnt/AuthenticationStatus/IdentityStore/All" \
  -u "forensics-api:$ISE_PASSWORD" \
  | jq '.operationsResponse.operation[] | select(.userName == "finance-director@abhavtech.com" and .authenticationStatus == "FAILED")'

## Output: 0 failed attempts
## No brute force attack

## Check for phishing campaigns
cat << 'EOF' | splunk search
index=email sourcetype=cisco:esa recipient="finance-director@abhavtech.com" earliest=-7d
| search subject="password" OR subject="verify" OR subject="urgent"
| table _time sender subject attachment_names
EOF

## Results:
_time                  sender                      subject                           attachment_names
2026-01-28 10:23:15   noreply@payrol-portal.com   Urgent: Verify Your Credentials   payroll-login.html

## Phishing email detected 2 days before attack
## Domain typosquatting: "payrol-portal.com" vs. legitimate "payroll-portal.com"
```

**5.2 Analyze Phishing Email:**

```bash
## Export email from Cisco Secure Email
curl -k -X GET \
  "https://esa.abhavtech.com/api/v2.0/message/<message-id>" \
  -H "Authorization: Bearer $ESA_TOKEN" \
  > /mnt/evidence_vault/EVD-20260130-004-phishing-email.eml

## Extract embedded link
grep -oP 'href="\K[^"]+' /mnt/evidence_vault/EVD-20260130-004-phishing-email.eml

## Output:
https://payrol-portal.com/verify?user=finance-director@abhavtech.com

## Check if user clicked link
curl -X GET \
  "https://umbrella.cisco.com/investigate/api/v1/domain/payrol-portal.com/timeline" \
  -H "Authorization: Bearer $UMBRELLA_TOKEN"

## Output shows:
{
  "timeline": [
    {
      "timestamp": "2026-01-28T10:25:34Z",
      "ip": "102.23.XX.XXX",  # User's IP (Mumbai)
      "action": "visited"
    }
  ]
}

## User clicked phishing link and likely entered credentials
```

---

## Step 6: Check for Compromised Accounts

**6.1 Query Active Directory for Suspicious Activity:**

```powershell
## Check for password changes
Get-ADUser -Identity "finance-director" -Properties PasswordLastSet, LastBadPasswordAttempt | 
  Select-Object Name, PasswordLastSet, LastBadPasswordAttempt

## Output:
Name               PasswordLastSet      LastBadPasswordAttempt
----               ---------------      ----------------------
finance-director   1/28/2026 10:30:00 AM   (never)

## Password changed 2 days ago (after phishing)
## User may have changed password on phishing site (gave attacker new password)
```

**6.2 Check for Other Compromised Accounts:**

```bash
## Query Duo for other authentication attempts from Nigeria IP
jq '.response.authlogs[] | select(.ip == "111.49.XX.XXX")' \
  /mnt/evidence_vault/EVD-20260130-001-duo-auth-logs.json

## Output shows:
{
  "user": {"name": "finance-director@abhavtech.com"},
  "result": "denied"
}

## Only one account targeted (finance director)
```

---

## Step 7: Assess Impact

**7.1 Determine Data Access:**

```bash
## Check VPN session for data access
cat << 'EOF' | splunk search
index=windows sourcetype=WinEventLog:Security host="fileserver-01" earliest="2026-01-30T14:25:00" latest="2026-01-30T14:33:30"
| search EventCode=4663 SubjectUserName="finance-director"
| table _time ObjectName AccessMask
EOF

## Results: 0 events
## No file access during VPN session

## Check application access
curl -X GET \
  "https://okta.abhavtech.com/api/v1/logs?since=2026-01-30T14:25:00Z&until=2026-01-30T14:33:30Z&filter=actor.alternateId eq \"finance-director@abhavtech.com\"" \
  -H "Authorization: SSWS $OKTA_API_TOKEN"

## Results: 0 application logins
## No application access during VPN session
```

**Impact Summary:**
- **VPN Access:** 8 minutes (legitimate user session, attacker denied)
- **File Access:** None
- **Application Access:** None
- **Data Exfiltration:** None
- **Lateral Movement:** None
- **Overall Impact:** MINIMAL - Attack prevented by adaptive MFA

---

## Step 8: Remediation

**8.1 Force Password Reset:**

```powershell
## Force immediate password reset
Set-ADUser -Identity "finance-director" -ChangePasswordAtLogon $true -PasswordNeverExpires $false

## Generate temporary password
$TempPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 16 | % {[char]$_})
Set-ADAccountPassword -Identity "finance-director" -NewPassword (ConvertTo-SecureString -AsPlainText $TempPassword -Force) -Reset

## Email user
Send-MailMessage -To "finance-director@abhavtech.com" -From "security@abhavtech.com" \
  -Subject "URGENT: Password Reset Required" \
  -Body "Your account was targeted in a SIM swap attack. Temporary password: $TempPassword. Change immediately upon login."
```

**8.2 Upgrade MFA to Hardware Token:**

```bash
## Disable SMS as MFA factor
curl -X POST \
  "https://api.duosecurity.com/admin/v1/users/<user-id>/phones/<phone-id>/deactivate" \
  -u "$DUO_IKEY:$DUO_SKEY"

## Provision YubiKey hardware token
curl -X POST \
  "https://api.duosecurity.com/admin/v1/users/<user-id>/tokens" \
  -u "$DUO_IKEY:$DUO_SKEY" \
  -d "type=yubikey" \
  -d "token_id=<yubikey-serial>"

## Response:
{
  "stat": "OK",
  "response": {
    "token_id": "DLTOK-12345",
    "type": "yubikey",
    "serial": "cccccccdefgh"
  }
}

## User upgraded to hardware token (SIM swap resistant)
```

**8.3 Enable Additional Protections:**

```bash
## Enable Duo device trust policy
curl -X PUT \
  "https://api.duosecurity.com/admin/v1/policies/<policy-id>" \
  -u "$DUO_IKEY:$DUO_SKEY" \
  -d "require_trusted_device=true" \
  -d "remember_device_enabled=true" \
  -d "device_verification=fingerprint"

## Enable geo-restriction (block authentication from Nigeria)
curl -X POST \
  "https://api.duosecurity.com/admin/v1/policies/<policy-id>/countries/deny" \
  -d "country_code=NG"  # Nigeria

## Additional protections enabled
```

---

## Step 9: Enhance Detection and Prevention

**9.1 Deploy UEBA for Phishing Detection:**

```spl
## Create Splunk alert for phishing email interactions
[phishing_email_interaction]
search = index=email sourcetype=cisco:esa
| rex field=sender "(?<domain>[^@]+)$"
| where (like(subject, "%verify%") OR like(subject, "%urgent%") OR like(subject, "%password%"))
  AND (NOT domain IN ("abhavtech.com", "microsoft.com", "google.com"))
| join recipient [search index=proxy sourcetype=bluecoat | rex field=url "(?<clicked_domain>[^/]+)"]
| where domain=clicked_domain
| eval severity="high"

action.email = 1
action.email.to = soc-team@abhavtech.com
action.email.subject = Phishing Email Interaction Detected
cron_schedule = */15 * * * *
EOF
```

**9.2 Implement Carrier-Level Protections:**

```bash
## Contact all major carriers to implement SIM swap protections
## Recommended protections:
## 1. In-person verification required for SIM swaps
## 2. Multi-factor authentication for account changes
## 3. Email/SMS notification for SIM replacement
## 4. 24-hour cooling period for international SIM swaps
## 5. Account PIN required for all changes

## Notify all users to enable carrier protections
cat << 'EOF' | mail -s "Action Required: Enable SIM Swap Protection" all-users@abhavtech.com
Dear Abhavtech Employees,

We recently detected a SIM swap attack targeting one of our executives. To protect your account:

1. Contact your mobile carrier and enable SIM swap protection
2. Set up a carrier account PIN (different from device PIN)
3. Require in-person verification for SIM replacement
4. Enable notifications for account changes

Instructions for major carriers:
- Airtel: Call 121, request "SIM protection service"
- Verizon: Account settings → Security → SIM lock
- AT&T: Extra Security → Passcode required

Security Team
EOF
```

---

## Step 10: Forensics Report

```python
report = {
    "case_id": "CASE-2026-012-MFA-BYPASS",
    "investigation_type": "MFA Bypass Attempt - SIM Swap Attack",
    "incident_date": "2026-01-30",
    "analyst": "SOC-Analyst-Aisha-Khan",
    
    "executive_summary": """
    Sophisticated SIM swap attack targeting finance director account on 2026-01-30.
    Attacker used stolen credentials (obtained via phishing 2 days prior) and
    initiated SIM replacement in Lagos, Nigeria to intercept SMS-based MFA codes.
    
    Attack Timeline:
    1. Jan 28: User clicked phishing link, entered credentials
    2. Jan 30 13:45: Attacker initiated SIM swap in Nigeria
    3. Jan 30 14:25: Legitimate user logged in from Mumbai (Duo Push)
    4. Jan 30 14:32: Attacker attempted login from Nigeria (SMS)
    5. Jan 30 14:32: Duo DENIED due to impossible travel detection
    
    Impact: MINIMAL - Zero data access
    - VPN access denied
    - No application access
    - No file access
    - No data exfiltration
    
    Defense: Duo's adaptive authentication prevented successful bypass
    - Impossible travel detection (5,847 km in 7 minutes)
    - Device trust validation (new Android vs. trusted iPhone)
    - Factor analysis (SMS never used by user)
    
    Response:
    - All sessions revoked within 30 seconds
    - Password reset forced
    - MFA upgraded to YubiKey hardware token
    - SIM swap protections enabled with carrier
    - Phishing awareness training deployed
    
    Cost Avoided: ~$500K (prevented financial fraud + data breach)
    """,
    
    "attack_chain": [
        "1. Phishing email sent (typosquatting: payrol-portal.com)",
        "2. User clicked link and entered credentials",
        "3. Attacker obtained username + password",
        "4. Attacker initiated SIM swap in Nigeria (fake ID)",
        "5. Carrier activated new SIM (inadequate verification)",
        "6. Attacker attempted VPN login with stolen credentials",
        "7. Duo sent SMS code to Nigeria SIM (compromised)",
        "8. Duo DENIED authentication (impossible travel)",
        "9. Attack failed, sessions revoked"
    ],
    
    "evidence_summary": [
        "EVD-20260130-001: Duo authentication logs (24 hours)",
        "EVD-20260130-002: User authentication timeline (chronological)",
        "EVD-20260130-003: Attack timeline reconstruction",
        "EVD-20260130-004: Phishing email (EML format)",
        "EVD-20260130-005: Carrier SIM swap report",
        "EVD-20260130-REPORT: Complete forensics report"
    ],
    
    "root_causes": [
        "User clicked phishing link (security awareness gap)",
        "SMS-based MFA vulnerable to SIM swap",
        "Carrier SIM swap verification inadequate (fake ID accepted)",
        "No email attachment sandboxing (phishing HTML not blocked)",
        "Phishing domain not in threat intelligence feed"
    ],
    
    "corrective_actions": [
        "Upgraded user to hardware token (YubiKey)",
        "Disabled SMS as MFA factor for all executives",
        "Implemented carrier SIM swap protections",
        "Deployed phishing detection in Splunk (UEBA)",
        "Enhanced email security (Cisco Secure Email)",
        "Conducted phishing awareness training",
        "Enabled Duo device trust policy",
        "Geo-blocked authentication from high-risk countries"
    ],
    
    "preventive_measures": [
        "Mandate hardware tokens for all privileged accounts",
        "Implement FIDO2 passwordless authentication",
        "Deploy anti-phishing browser extensions",
        "Enable carrier SIM lock for all corporate numbers",
        "Implement email attachment sandboxing",
        "Deploy DMARC/DKIM/SPF for domain protection",
        "Regular phishing simulations and training"
    ],
    
    "lessons_learned": """
    Key Lessons:
    1. SMS-based MFA is vulnerable to SIM swap attacks
    2. Adaptive MFA (impossible travel) is highly effective
    3. Hardware tokens (FIDO2/YubiKey) are SIM swap resistant
    4. Phishing remains primary attack vector for credential theft
    5. Multi-layered defenses (MFA + device trust + geo-blocking) essential
    6. Carrier security verification processes inadequate
    
    Duo Security Value:
    - Impossible travel detection prevented successful attack
    - Device fingerprinting identified new device
    - Adaptive policy automatically denied high-risk authentication
    - Attack stopped within 7 minutes of attempt
    
    Zero Trust Validation:
    - "Never trust, always verify" principle validated
    - Continuous authentication critical (not just initial login)
    - Device trust and context-aware policies essential
    """
}

## Save and register
with open('/mnt/evidence_vault/REPORT-CASE-2026-012-MFA-BYPASS.json', 'w') as f:
    json.dump(report, f, indent=2)

sha256sum /mnt/evidence_vault/REPORT-CASE-2026-012-MFA-BYPASS.json
## f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9

peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{
    "Args":[
      "CollectEvidence",
      "EVD-20260130-REPORT",
      "CASE-2026-012-MFA-BYPASS",
      "forensics_report",
      "REPORT-CASE-2026-012-MFA-BYPASS.json",
      "32847",
      "f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
      "forensics-ws01.abhavtech.com",
      "SOC-Analyst-Aisha-Khan",
      "Forensics-Report-Generator",
      "3650",
      "[\"SOC-Team\",\"Legal-Team\",\"Executive-Team\",\"Board-of-Directors\"]"
    ]
  }'
```

---
