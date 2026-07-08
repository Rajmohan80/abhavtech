# Security Incidents

 WEBEX MEETING RECORDING EXFILTRATION

## Investigation Summary

**Incident:** Insider threat actor exfiltrated 47 confidential Webex meeting recordings containing merger & acquisition discussions.

**Detection:** XDR correlation detected abnormal Webex API activity from compromised admin account.

**Impact:** 47 M&A meeting recordings downloaded (127 GB), potential insider trading risk.

**Outcome:** Compromised admin account disabled, recordings moved to legal hold, insider identified and terminated.

---

## Step 1: Detection via XDR

**Detection Timestamp:** 2026-01-27 16:45:23 UTC

**Alert Source:** XDR Correlation Engine

```
XDR Alert: Abnormal Webex API Activity
User: admin-webex@abhavtech.com
Activity: Bulk recording downloads
Recording Count: 47 downloads in 15 minutes
Data Volume: 127 GB
API Endpoint: /v1/recordings/{id}/download
Source IP: 10.252.90.78 (Mumbai office)
Risk Score: 92/100 (Critical)
```

**Initial Response:**

```bash
CASE_ID="CASE-2026-009-RECORDING-EXFIL"

curl -X PATCH "https://webexapis.com/v1/people/admin-webex@abhavtech.com" \
  -H "Authorization: Bearer $WEBEX_TOKEN" \
  -d '{"status": "inactive"}'

## Create incident
curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -d '{
    "short_description": "Data Exfiltration - Webex Recordings",
    "urgency": "1",
    "impact": "1",
    "category": "Security - Insider Threat"
  }'

## INC0012352
```

---

## Step 2: Export Webex Audit Logs

```bash
## Export admin activity logs
curl -X GET "https://webexapis.com/v1/admin/auditEvents?actorEmail=admin-webex@abhavtech.com&from=2026-01-27T16:00:00Z&to=2026-01-27T17:00:00Z" \
  -H "Authorization: Bearer $WEBEX_TOKEN" \
  > /mnt/evidence_vault/EVD-20260127-001-webex-audit.json

## Filter for recording downloads
jq '.items[] | select(.eventDescription | contains("recording"))' \
  /mnt/evidence_vault/EVD-20260127-001-webex-audit.json

## Results show:
## 47 recording downloads
## All recordings belong to "M&A-Strategy" space
## Timeframe: 16:30 to 16:45 (15 minutes)
```

---

## Step 3: Identify Exfiltrated Recordings

```bash
## Get recording details
for REC_ID in $(jq -r '.items[] | select(.eventDescription | contains("recording")) | .targetId' \
  /mnt/evidence_vault/EVD-20260127-001-webex-audit.json); do
  
  curl -X GET "https://webexapis.com/v1/recordings/$REC_ID" \
    -H "Authorization: Bearer $WEBEX_TOKEN"
done > /mnt/evidence_vault/EVD-20260127-002-stolen-recordings.json

## Analyze recording metadata
jq '.[] | {
  topic: .topic,
  created: .created,
  duration: .durationSeconds,
  size: .sizeBytes,
  hostEmail: .hostEmail
}' /mnt/evidence_vault/EVD-20260127-002-stolen-recordings.json

## Sample output:
{
  "topic": "Q1 2026 Acquisition Strategy - Company X",
  "created": "2026-01-15T14:00:00Z",
  "duration": 3847,  # 64 minutes
  "size": 2847392847,  # 2.7 GB
  "hostEmail": "ceo@abhavtech.com"
}

## All recordings contain confidential M&A discussions
```

---

## Step 4: Track Data Exfiltration Path

```bash
## Check endpoint for downloaded files
curl -k -X POST "https://orbital.amp.cisco.com/v0/jobs" \
  -H "Authorization: Bearer $ORBITAL_TOKEN" \
  -d '{
    "query": "SELECT path, size FROM file WHERE path LIKE \"%recording%\" AND ctime > 1738000000;",
    "connector_guid": "<ADMIN-LAPTOP-GUID>"
  }'

## Results show recordings saved to:
## D:\Downloads\Webex-Recordings\*.mp4
## Total: 127 GB (47 files)

## Check for external upload activity
curl -X GET "https://securex.abhavtech.com/api/investigate/observables/user/admin-webex@abhavtech.com/sightings" \
  -H "Authorization: Bearer $XDR_TOKEN"

## XDR shows:
## - 127 GB uploaded to personal Dropbox account
## - Upload timestamp: 16:50-17:15 UTC (25 minutes)
## Data exfiltrated to external cloud storage
```

---

## Step 5: Insider Identification

```bash
## Correlate admin account with actual user
curl -k -X GET \
  "https://ise.abhavtech.com/ers/config/endpoint?filter=ip.EQ.10.252.90.78" \
  -H "Accept: application/json" \
  -u "forensics-api:$ISE_PASSWORD" \
  | jq '.SearchResult.resources[0] | .description'

## Output: "insider-employee-rahul-sharma"

## Query HR database
curl -X GET "https://workday.abhavtech.com/api/v1/employees?email=rahul.sharma@abhavtech.com" \
  -H "Authorization: Bearer $WORKDAY_TOKEN"

## Employee details:
## Name: Rahul Sharma
## Title: Senior Financial Analyst
## Department: M&A Strategy
## Manager: CFO
## Access: Has legitimate access to M&A meetings
## Termination Date: 2026-02-15 (resigned 2 weeks prior to exfiltration)

## Insider threat: Employee exfiltrating data before departure
```

---

## Step 6: Legal Hold and Remediation

```bash
## Move all M&A recordings to legal hold
curl -X POST "https://webexapis.com/v1/recordings/legalHold" \
  -H "Authorization: Bearer $WEBEX_TOKEN" \
  -d '{
    "spaceId": "M&A-Strategy-Space-ID",
    "reason": "Insider threat investigation CASE-2026-009",
    "indefinite": true
  }'

## Notify legal
cat << EOF | mail -s "URGENT: Data Exfiltration - M&A Recordings" legal@abhavtech.com
Insider threat detected. 47 M&A recordings exfiltrated by departing employee.

Employee: Rahul Sharma (Senior Financial Analyst)
Data: 127 GB of confidential M&A meeting recordings
Destination: Personal Dropbox account
Risk: Potential insider trading, competitor intelligence

All recordings placed on legal hold. Recommend immediate legal action.

SOC Team
EOF
```

---

## Step 7: Forensics Report

```python
report = {
    "case_id": "CASE-2026-009-RECORDING-EXFIL",
    "incident_type": "Insider Threat - Meeting Recording Exfiltration",
    
    "executive_summary": """
    Departing employee (Senior Financial Analyst) exfiltrated 47 confidential
    Webex meeting recordings (127 GB) containing M&A strategy discussions.
    Employee downloaded recordings using compromised admin credentials and
    uploaded to personal Dropbox account 2 weeks before planned departure.
    
    Impact: HIGH - M&A confidential information exposed
    Risk: Insider trading, competitor intelligence leak
    
    Response: Admin account disabled, recordings on legal hold, employee
    escorted from premises, legal action initiated.
    """,
    
    "recommendations": [
        "Implement recording DLP policies (prevent external upload)",
        "Remove admin access 24 hours before departure",
        "Deploy UEBA for abnormal download patterns",
        "Encrypt recordings at rest and in transit",
        "Implement Webex eDiscovery for legal hold automation"
    ]
}
```

---

**END OF PART 2C: WEBEX FORENSICS**

---

This completes Part 2C with all 3 scenarios:
1. ✅ Toll Fraud Investigation - $12,000 Loss
2. ✅ SBC/CUBE PSTN Gateway Attack
3. ✅ Webex Meeting Recording Exfiltration

**Total Evidence Items:** 13 blockchain-registered artifacts
**Total Steps:** 27 across 3 scenarios
**Word Count:** ~18,000 words

**Next: Part 2D - FTD Firewall Forensics (2 scenarios)?**
