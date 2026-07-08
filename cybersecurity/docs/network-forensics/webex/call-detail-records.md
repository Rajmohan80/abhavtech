# Call Detail Records

 TOLL FRAUD INVESTIGATION - $12,000 LOSS

## Investigation Summary

**Incident:** Overnight toll fraud attack on Chennai PSTN gateway resulted in $12,000 in unauthorized international calls to premium-rate destinations (Nigeria, Somalia, Ivory Coast).

**Detection:** Finance department flagged abnormal carrier invoice; 847 calls to international premium numbers over 6-hour window.

**Impact:** $12,047 fraudulent charges; 847 unauthorized calls totaling 284 hours of talk time.

**Outcome:** Compromised auto-attendant PIN discovered; fraudsters exploited dial-out feature for callback fraud scheme.

---

## Step 1: Detection and Financial Impact Assessment

**Detection Timestamp:** 2026-01-25 08:30:00 UTC (discovered via invoice)

**Fraud Window:** 2026-01-24 22:00:00 to 2026-01-25 04:00:00 UTC (6 hours overnight)

**Initial Alert:**

```
From: Finance-AP@abhavtech.com
To: IT-Telecom@abhavtech.com
Subject: URGENT: Abnormal Carrier Invoice - Chennai Gateway

Team,

Our Verizon invoice for January shows $12,047 in charges for international 
calls to premium-rate numbers in Nigeria (+234), Somalia (+252), and Ivory 
Coast (+225). This is 15x our normal international spend.

All calls originated from Chennai PSTN gateway (10.252.20.100) between 
Jan 24 22:00 and Jan 25 04:00 UTC.

Invoice attached. Please investigate immediately.

Finance
```

**Create Investigation Case:**

```bash
CASE_ID="CASE-2026-007-TOLL-FRAUD"
INVESTIGATION_TYPE="webex_toll_fraud"

curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic <base64-creds>' \
  -d '{
    "short_description": "Toll Fraud - Chennai PSTN Gateway - $12K Loss",
    "description": "Overnight toll fraud attack, 847 calls to premium international numbers",
    "urgency": "1",
    "impact": "1",
    "category": "Security",
    "assignment_group": "SOC-Forensics-Team",
    "u_financial_impact": "12047 USD"
  }'

## INC0012350
```

**Financial Impact Summary:**

```
Total Fraudulent Charges: $12,047.23
Call Count: 847 calls
Duration: 284 hours 37 minutes
Average Call Duration: 20.2 minutes
Destinations: Nigeria (687 calls), Somalia (112 calls), Ivory Coast (48 calls)
Average Cost per Minute: $0.71
Peak Concurrent Calls: 38 (all 50 channels occupied for 45 minutes)
```

---

## Step 2: Export Call Detail Records (CDR)

**2.1 Export CDR from Webex Control Hub:**

```bash
## Authenticate to Webex API
curl -X POST https://webexapis.com/v1/access_token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "grant_type=client_credentials&client_id=$WEBEX_CLIENT_ID&client_secret=$WEBEX_CLIENT_SECRET" \
  | jq -r '.access_token' > /tmp/webex-token.txt

WEBEX_TOKEN=$(cat /tmp/webex-token.txt)

## Export CDR for fraud time window
curl -X GET "https://webexapis.com/v1/cdr?startTime=2026-01-24T22:00:00Z&endTime=2026-01-25T04:00:00Z&locationId=chennai-location-id" \
  -H "Authorization: Bearer $WEBEX_TOKEN" \
  -H "Accept: application/json" \
  > /mnt/evidence_vault/EVD-20260125-001-webex-cdr.json

## Also export as CSV for Excel analysis
curl -X GET "https://webexapis.com/v1/cdr?startTime=2026-01-24T22:00:00Z&endTime=2026-01-25T04:00:00Z&locationId=chennai-location-id&format=csv" \
  -H "Authorization: Bearer $WEBEX_TOKEN" \
  > /mnt/evidence_vault/EVD-20260125-002-webex-cdr.csv

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260125-001-webex-cdr.json
## f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2

peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{
    "Args":[
      "CollectEvidence",
      "EVD-20260125-001",
      "CASE-2026-007-TOLL-FRAUD",
      "webex_cdr",
      "EVD-20260125-001-webex-cdr.json",
      "847293",
      "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
      "forensics-ws01.abhavtech.com",
      "Telecom-Engineer-Ramesh-Iyer",
      "Webex-Control-Hub",
      "365",
      "[\"SOC-Team\",\"Finance-Team\",\"Legal-Team\"]"
    ]
  }'
```

**2.2 Parse CDR for Fraudulent Calls:**

```bash
## Extract international calls only
jq '.items[] | select(.calledNumber | startswith("+234") or startswith("+252") or startswith("+225"))' \
  /mnt/evidence_vault/EVD-20260125-001-webex-cdr.json \
  | jq -s 'sort_by(.startTime)' \
  > /mnt/evidence_vault/EVD-20260125-003-fraud-calls.json

## Count calls by destination
jq -s 'group_by(.calledNumber[0:4]) | map({destination: .[0].calledNumber[0:4], count: length, total_duration: map(.durationSeconds) | add})' \
  /mnt/evidence_vault/EVD-20260125-003-fraud-calls.json

## Output:
[
  {
    "destination": "+234",  # Nigeria
    "count": 687,
    "total_duration": 825420  # 229 hours
  },
  {
    "destination": "+252",  # Somalia
    "count": 112,
    "total_duration": 134640  # 37 hours
  },
  {
    "destination": "+225",  # Ivory Coast
    "count": 48,
    "total_duration": 64800   # 18 hours
  }
]
```

**2.3 Analyze Call Pattern:**

```python
## Python script to analyze call patterns
python3 << 'EOF'
import json
from datetime import datetime, timedelta
import matplotlib.pyplot as plt

## Load fraud calls
with open('/mnt/evidence_vault/EVD-20260125-003-fraud-calls.json') as f:
    calls = json.load(f)

## Group by hour
hourly_calls = {}
for call in calls:
    start = datetime.fromisoformat(call['startTime'].replace('Z', '+00:00'))
    hour = start.replace(minute=0, second=0, microsecond=0)
    
    if hour not in hourly_calls:
        hourly_calls[hour] = {'count': 0, 'duration': 0}
    
    hourly_calls[hour]['count'] += 1
    hourly_calls[hour]['duration'] += call['durationSeconds']

## Sort by hour
sorted_hours = sorted(hourly_calls.items())

## Plot
hours = [h[0] for h in sorted_hours]
counts = [h[1]['count'] for h in sorted_hours]

plt.figure(figsize=(12, 6))
plt.bar(hours, counts, width=0.03, color='red', alpha=0.7)
plt.xlabel('Time (UTC)')
plt.ylabel('Number of Fraudulent Calls')
plt.title('Toll Fraud Attack Pattern - Chennai Gateway')
plt.xticks(rotation=45)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('/mnt/evidence_vault/EVD-20260125-004-fraud-timeline.png', dpi=150)

print("✅ Timeline chart saved")

## Identify calling pattern
print("\nCall Pattern Analysis:")
print(f"Total calls: {len(calls)}")
print(f"Peak hour: {max(hourly_calls.items(), key=lambda x: x[1]['count'])[0]}")
print(f"Average calls per hour: {len(calls) / 6:.1f}")
print(f"Max concurrent: 38 channels")
EOF

## Register chart on blockchain
sha256sum /mnt/evidence_vault/EVD-20260125-004-fraud-timeline.png
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260125-004","CASE-2026-007-TOLL-FRAUD",...]}'
```

**Key Pattern Findings:**
- **Attack started:** 22:03 UTC (after business hours)
- **Peak hour:** 23:00-00:00 UTC (147 calls)
- **Call distribution:** Steady ~140 calls/hour for 6 hours
- **All calls originated from:** Same calling number (auto-attendant)
- **Calls placed to:** Sequential number patterns (+234-80-XXXX-0001, 0002, 0003...)

---

## Step 3: Identify Attack Vector

**3.1 Check CDR for Calling Party:**

```bash
## Extract calling party information
jq '.[] | {caller: .callingNumber, called: .calledNumber, startTime: .startTime}' \
  /mnt/evidence_vault/EVD-20260125-003-fraud-calls.json \
  | jq -s 'group_by(.caller) | map({caller: .[0].caller, call_count: length})' \
  | jq 'sort_by(-.call_count)'

## Output:
[
  {
    "caller": "+91-44-4000-8500",  # Chennai main number (auto-attendant)
    "call_count": 847  # ALL fraudulent calls from this number
  }
]

## All fraud calls originated from auto-attendant number
```

**3.2 Review Auto-Attendant Configuration:**

```bash
## Query Webex Control Hub for auto-attendant config
curl -X GET "https://webexapis.com/v1/telephony/config/autoAttendants" \
  -H "Authorization: Bearer $WEBEX_TOKEN" \
  | jq '.autoAttendants[] | select(.phoneNumber == "+914444008500")'

## Output:
{
  "id": "Y2lzY29zcGFyazovL3VzL0FVVE9fQVRURU5EQU5ULzEyMzQ1",
  "name": "Chennai-Main-AA",
  "phoneNumber": "+914444008500",
  "extension": "8500",
  "businessHoursMenu": {
    "greeting": "custom",
    "greetingFile": "chennai-greeting.wav",
    "menuOptions": [
      {"key": "1", "action": "transferToNumber", "number": "1001"},
      {"key": "2", "action": "transferToNumber", "number": "1002"},
      {"key": "9", "action": "dialByExtension"}  # ← DIAL-OUT FEATURE
    ]
  },
  "afterHoursMenu": {
    "greeting": "custom",
    "greetingFile": "after-hours.wav",
    "menuOptions": [
      {"key": "0", "action": "transferToOperator"},
      {"key": "9", "action": "dialByExtension"}  # ← ENABLED AFTER HOURS TOO!
    ]
  },
  "dialByExtensionEnabled": true,
  "requirePIN": true,
  "pin": "****"  # Redacted in API response
}
```

**Attack Vector Identified:**
- Auto-attendant has "dial by extension" feature enabled
- Feature allows external callers to dial out via PSTN gateway
- Requires 4-digit PIN for authentication
- **CRITICAL:** PIN protection bypassed somehow

---

## Step 4: Investigate PIN Compromise

**4.1 Check CUBE Logs for SIP Authentication:**

```bash
## Query Splunk for CUBE SIP logs during fraud window
cat << 'EOF' | splunk search
index=voip sourcetype=cisco:cube host="chennai-cube-01" earliest="2026-01-24T22:00:00" latest="2026-01-25T04:00:00"
| search "INVITE" OR "401" OR "407"
| rex field=_raw "From: <sip:(?<from_uri>[^>]+)>"
| rex field=_raw "To: <sip:(?<to_uri>[^>]+)>"
| table _time from_uri to_uri _raw
| sort _time
EOF

## Results show:
_time                  from_uri                    to_uri              
2026-01-24 22:03:15   unknown@10.245.67.89        8500@chennai-cube   # External caller
2026-01-24 22:03:18   unknown@10.245.67.89        *9#1234#...         # Dial pattern: *9#PIN#NUMBER
2026-01-24 22:03:20   unknown@10.245.67.89        +23480XXXX0001      # First fraud call
...

## Pattern shows: Caller dials *9#[PIN]#[DESTINATION]
```

**4.2 Analyze DTMF (Dial Tone) Sequences:**

```bash
## Check CUBE debug logs for DTMF digits
ssh admin@chennai-cube-01.abhavtech.com "show logging | include DTMF"

## Output:
Jan 24 22:03:15.234: DTMF: digit=*, duration=100ms
Jan 24 22:03:15.456: DTMF: digit=9, duration=100ms
Jan 24 22:03:15.678: DTMF: digit=#, duration=100ms
Jan 24 22:03:15.890: DTMF: digit=1, duration=100ms
Jan 24 22:03:16.012: DTMF: digit=2, duration=100ms
Jan 24 22:03:16.234: DTMF: digit=3, duration=100ms
Jan 24 22:03:16.456: DTMF: digit=4, duration=100ms
Jan 24 22:03:16.678: DTMF: digit=#, duration=100ms

## PIN sequence captured: *9#1234#
## Auto-attendant PIN is 1234 (weak/default PIN)
```

**4.3 Check PIN Change History:**

```bash
## Query Webex audit logs for PIN changes
curl -X GET "https://webexapis.com/v1/audit/events?resource=autoAttendant&resourceId=Y2lzY29zcGFyazovL3VzL0FVVE9fQVRURU5EQU5ULzEyMzQ1&startTime=2025-01-01T00:00:00Z" \
  -H "Authorization: Bearer $WEBEX_TOKEN" \
  | jq '.items[] | select(.actionText | contains("PIN"))'

## Output:
{
  "created": "2025-03-15T10:23:45.000Z",
  "actorOrgId": "...",
  "actorEmail": "admin@abhavtech.com",
  "actionText": "Updated auto-attendant PIN",
  "resourceName": "Chennai-Main-AA",
  "targetId": "Y2lzY29zcGFyazovL3VzL0FVVE9fQVRURU5EQU5ULzEyMzQ1"
}

## Last PIN change: March 2025 (10 months ago)
## PIN never rotated since initial setup
```

**Root Cause:**
- Auto-attendant PIN set to weak value: **1234**
- PIN never changed since March 2025 (10 months old)
- Fraudsters likely brute-forced or guessed common PIN
- Once authenticated, unlimited dial-out via PSTN gateway

---

## Step 5: Trace Attacker Source

**5.1 Analyze SIP Source IP:**

```bash
## Extract source IP from CUBE logs
ssh admin@chennai-cube-01.abhavtech.com \
  "show call active voice brief | include 10.245.67.89"

## No active calls (attack finished)

## Check historical call logs
cat << 'EOF' | splunk search
index=voip sourcetype=cisco:cube earliest="2026-01-24T22:00:00" latest="2026-01-25T04:00:00"
| rex field=_raw "Remote-Party-ID:.*<sip:[^@]+@(?<source_ip>[0-9.]+)"
| stats count by source_ip
| sort -count
EOF

## Results:
source_ip       count
10.245.67.89    847  # ALL fraud calls from this IP

## Lookup IP geolocation
whois 10.245.67.89

## Output:
NetRange:       10.245.0.0 - 10.245.255.255
Organization:   Verizon Business - Customer Network
Country:        US
City:           New York
NetType:        Reallocated
```

**5.2 Check Carrier Records:**

```bash
## Contact Verizon to identify customer behind IP
## (Requires legal process / subpoena)

## Verizon response (received 2026-01-27):
## IP 10.245.67.89 assigned to: SIP trunk customer "TollFraud-Gang-LLC"
## Trunk purchased: 2026-01-20 (4 days before attack)
## Payment method: Prepaid credit card (stolen)
## Customer contact: Fake email/address

## Fraudsters purchased SIP trunk specifically for this attack
```

**5.3 Check Firewall Logs:**

```spl
## Query Splunk for firewall connections from attacker IP
index=firewall sourcetype=cisco:ftd earliest="2026-01-24T22:00:00" latest="2026-01-25T04:00:00"
| search src_ip="10.245.67.89" OR dest_ip="10.245.67.89"
| search dest_port=5060 OR dest_port=5061  # SIP ports
| stats count by src_ip dest_ip src_port dest_port action

Results:
src_ip          dest_ip         src_port  dest_port  action  count
10.245.67.89    10.252.20.100   5060      5060       ALLOW   847  # SIP signaling

## Firewall allowed SIP from Verizon IP range (trusted carrier)
```

---

## Step 6: Reconstruct Attack Timeline

**6.1 Create Detailed Timeline:**

```python
timeline = [
    {
        "time": "2026-01-20 14:30:00",
        "event": "Fraudsters purchase SIP trunk from Verizon using stolen credit card",
        "source": "Verizon carrier records"
    },
    {
        "time": "2026-01-24 21:45:00",
        "event": "Initial test call to Chennai auto-attendant",
        "source": "CUBE logs"
    },
    {
        "time": "2026-01-24 21:50:00",
        "event": "PIN brute-force attempts (sequence: 0000, 1111, 1234 - success)",
        "source": "CUBE DTMF logs"
    },
    {
        "time": "2026-01-24 22:03:00",
        "event": "First fraud call placed (*9#1234#+234...)",
        "source": "Webex CDR"
    },
    {
        "time": "2026-01-24 22:05:00 - 2026-01-25 04:00:00",
        "event": "847 fraud calls placed (6 hours)",
        "source": "Webex CDR"
    },
    {
        "time": "2026-01-25 04:03:00",
        "event": "Attack stops (all 50 PSTN channels exhausted, queue full)",
        "source": "CUBE capacity logs"
    },
    {
        "time": "2026-01-25 08:30:00",
        "event": "Finance department discovers fraud via invoice",
        "source": "Email notification"
    }
]

## Save timeline
import json
with open('/mnt/evidence_vault/EVD-20260125-005-attack-timeline.json', 'w') as f:
    json.dump(timeline, f, indent=2)

## Register on blockchain
```

---

## Step 7: Calculate Financial Damage

**7.1 Detailed Billing Analysis:**

```python
## Calculate exact charges
charges = {
    "nigeria": {
        "calls": 687,
        "duration_minutes": 13757,  # 229 hours
        "rate_per_minute": 0.85,
        "total": 11693.45
    },
    "somalia": {
        "calls": 112,
        "duration_minutes": 2244,  # 37 hours
        "rate_per_minute": 0.12,
        "total": 269.28
    },
    "ivory_coast": {
        "calls": 48,
        "duration_minutes": 1080,  # 18 hours
        "rate_per_minute": 0.078,
        "total": 84.50
    }
}

total_charges = sum(dest['total'] for dest in charges.values())
print(f"Total Fraudulent Charges: ${total_charges:,.2f}")

## Output: Total Fraudulent Charges: $12,047.23

## Save detailed breakdown
with open('/mnt/evidence_vault/EVD-20260125-006-financial-impact.json', 'w') as f:
    json.dump({
        "total_charges_usd": total_charges,
        "breakdown": charges,
        "timestamp": "2026-01-25T08:30:00Z",
        "analyst": "Finance-AP-Team"
    }, f, indent=2)
```

**7.2 Check for Carrier Fraud Protection:**

```bash
## Review Verizon contract for fraud protection clause
## (Assuming contract review done offline)

## Verizon Response:
## - Fraud protection available but not activated
## - Requires $50/month fee per trunk
## - Provides real-time alerting for unusual call patterns
## - Would have prevented this attack (alert at 10 calls to premium numbers)

## Fraud protection NOT enabled = Abhavtech liable for full $12,047
```

---

## Step 8: Immediate Containment

**8.1 Disable Auto-Attendant Dial-Out:**

```bash
## Update auto-attendant config via Webex API
curl -X PATCH "https://webexapis.com/v1/telephony/config/autoAttendants/Y2lzY29zcGFyazovL3VzL0FVVE9fQVRURU5EQU5ULzEyMzQ1" \
  -H "Authorization: Bearer $WEBEX_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dialByExtensionEnabled": false,
    "businessHoursMenu": {
      "menuOptions": [
        {"key": "1", "action": "transferToNumber", "number": "1001"},
        {"key": "2", "action": "transferToNumber", "number": "1002"}
      ]
    },
    "afterHoursMenu": {
      "menuOptions": [
        {"key": "0", "action": "transferToOperator"}
      ]
    }
  }'

## Dial-out feature disabled on all auto-attendants
```

**8.2 Implement CUBE Call Restrictions:**

```bash
## SSH to CUBE and configure international call blocking
ssh admin@chennai-cube-01.abhavtech.com

Chennai-CUBE-01# config t
Chennai-CUBE-01(config)# voice class uri premium-block sip
Chennai-CUBE-01(config-class)# pattern +234  # Nigeria
Chennai-CUBE-01(config-class)# pattern +252  # Somalia
Chennai-CUBE-01(config-class)# pattern +225  # Ivory Coast
Chennai-CUBE-01(config-class)# pattern +900  # Premium rate
Chennai-CUBE-01(config-class)# pattern +976  # Premium rate
Chennai-CUBE-01(config-class)# exit

## Apply to outbound dial-peer
Chennai-CUBE-01(config)# dial-peer voice 100 voip
Chennai-CUBE-01(config-dial-peer)# reject uri premium-block
Chennai-CUBE-01(config-dial-peer)# end
Chennai-CUBE-01# write mem

## Premium-rate numbers now blocked at CUBE level
```

**8.3 Enable Rate Limiting:**

```bash
## Configure call rate limiting on CUBE
Chennai-CUBE-01# config t
Chennai-CUBE-01(config)# voice service voip
Chennai-CUBE-01(config-voi-serv)# sip
Chennai-CUBE-01(config-voi-sip)# call threshold global 100  # Max 100 concurrent calls
Chennai-CUBE-01(config-voi-sip)# max-forwards 10
Chennai-CUBE-01(config-voi-sip)# exit
Chennai-CUBE-01(config-voi-serv)# exit

## Per-number rate limiting
Chennai-CUBE-01(config)# voice class codec 1
Chennai-CUBE-01(config-class)# codec preference 1 g711ulaw
Chennai-CUBE-01(config-class)# maximum calls 10  # Max 10 calls per caller
Chennai-CUBE-01(config-class)# exit

## Rate limiting enabled
```

---

## Step 9: Strengthen Security Controls

**9.1 Implement Strong PIN Policy:**

```bash
## Update all auto-attendant PINs to 8-digit random values
for AA_ID in $(curl -s -X GET "https://webexapis.com/v1/telephony/config/autoAttendants" \
  -H "Authorization: Bearer $WEBEX_TOKEN" | jq -r '.autoAttendants[].id'); do
  
  # Generate strong 8-digit PIN
  NEW_PIN=$(openssl rand -hex 4 | tr -d 'a-f' | cut -c1-8)
  
  echo "Updating AA $AA_ID with PIN: $NEW_PIN"
  
  curl -X PATCH "https://webexapis.com/v1/telephony/config/autoAttendants/$AA_ID" \
    -H "Authorization: Bearer $WEBEX_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"pin\": \"$NEW_PIN\"}"
  
  # Store PIN in CyberArk vault
  curl -X POST "https://cyberark.abhavtech.com/api/Accounts" \
    -H "Authorization: Bearer $CYBERARK_TOKEN" \
    -d "{\"name\": \"Webex-AA-$AA_ID\", \"password\": \"$NEW_PIN\"}"
done

## All auto-attendant PINs rotated to strong 8-digit values
```

**9.2 Deploy Fraud Detection Alerting:**

```spl
## Create Splunk alert for toll fraud indicators
[webex_toll_fraud_detection]
search = index=voip sourcetype=webex:cdr
| search calledNumber IN ("+234*", "+252*", "+225*", "+900*", "+976*")
| stats count by callingNumber
| where count > 10

action.email = 1
action.email.to = telecom-team@abhavtech.com,soc-team@abhavtech.com
action.email.subject = Webex Toll Fraud Alert - Premium Numbers
cron_schedule = */15 * * * *
alert.severity = 2
EOF

## Create XDR playbook for auto-response
cat << 'EOF' > /opt/xdr-playbooks/toll-fraud-response.yaml
name: Toll Fraud Auto-Response
trigger: Splunk alert "webex_toll_fraud_detection"
actions:
  - name: Disable auto-attendant
    api: Webex Control Hub
    endpoint: /v1/telephony/config/autoAttendants/{id}
    payload: {"dialByExtensionEnabled": false}
  
  - name: Block premium numbers on CUBE
    ssh: chennai-cube-01.abhavtech.com
    commands:
      - "config t"
      - "voice class uri premium-block sip"
      - "pattern {detected_number_prefix}"
  
  - name: Create incident
    api: ServiceNow
    category: Security - Toll Fraud
    priority: P1
    
  - name: Notify teams
    slack: "#telecom-alerts"
    email: ["telecom-team@abhavtech.com", "finance@abhavtech.com"]
EOF
```

**9.3 Enable Verizon Fraud Protection:**

```bash
## Contact Verizon to enable fraud protection
## (Done via account manager)

## Verizon Fraud Protection Features Enabled:
## - Real-time call pattern monitoring
## - Alert threshold: 10 calls to premium numbers within 1 hour
## - Auto-block after 20 premium calls
## - Daily spend cap: $500 per trunk
## - SMS/email alerts to telecom-team@abhavtech.com

## Cost: $200/month (4 trunks × $50)
## Value: Prevented $12,000 loss = 60x ROI on first month
```

---

## Step 10: Forensics Report and Recovery

**10.1 Generate Comprehensive Report:**

```python
report = {
    "case_id": "CASE-2026-007-TOLL-FRAUD",
    "investigation_type": "Webex Toll Fraud - Auto-Attendant Compromise",
    "incident_date": "2026-01-24 to 2026-01-25",
    "analyst": "Telecom-Engineer-Ramesh-Iyer",
    
    "executive_summary": """
    Toll fraud attack on Chennai PSTN gateway resulted in $12,047 in fraudulent
    international charges over a 6-hour overnight window (Jan 24 22:00 - Jan 25 04:00).
    
    Attackers compromised auto-attendant PIN (weak 4-digit: 1234) and exploited
    dial-out feature to place 847 calls to premium-rate numbers in Nigeria,
    Somalia, and Ivory Coast. Fraudsters purchased SIP trunk from Verizon using
    stolen credit card specifically for this attack.
    
    Financial Impact: $12,047.23
    - Nigeria: 687 calls, $11,693.45
    - Somalia: 112 calls, $269.28
    - Ivory Coast: 48 calls, $84.50
    
    Total Duration: 284 hours 37 minutes of fraudulent calls
    
    Response: Dial-out feature disabled on all auto-attendants, PINs rotated to
    8-digit strong values, premium number blocking enabled on CUBE, Verizon fraud
    protection activated. Future losses prevented through enhanced controls.
    
    Recovery: Verizon agreed to 50% credit ($6,023) as goodwill gesture.
    Net loss: $6,024 (vs. original $12,047).
    """,
    
    "attack_timeline": [
        "2026-01-20 14:30 - Fraudsters purchase SIP trunk (Verizon)",
        "2026-01-24 21:50 - PIN brute-force successful (1234)",
        "2026-01-24 22:03 - First fraud call placed",
        "2026-01-24 22:05 - Mass calling begins (140 calls/hour)",
        "2026-01-25 04:03 - Attack stops (PSTN capacity exhausted)",
        "2026-01-25 08:30 - Finance discovers fraud via invoice"
    ],
    
    "attack_methodology": """
    1. Preparation: Purchase SIP trunk from carrier using stolen credit
    2. Reconnaissance: Call auto-attendant, identify dial-out feature
    3. PIN Compromise: Brute-force weak 4-digit PIN (1234)
    4. Exploitation: Use *9#PIN#NUMBER dial pattern for international calls
    5. Monetization: 847 calls to premium-rate callback services
    6. Evasion: Attack during off-hours, stop before business day
    
    Callback Fraud Scheme:
    - Fraudsters own premium-rate numbers in Nigeria/Somalia/Ivory Coast
    - Each call generates revenue for fraudster ($0.50-$0.85/min)
    - Abhavtech pays carrier, carrier pays fraudster's premium service
    - Estimated fraudster profit: ~$8,000 (rest goes to carriers/middlemen)
    """,
    
    "evidence_summary": [
        "EVD-20260125-001: Webex CDR export (JSON, 847 calls)",
        "EVD-20260125-002: Webex CDR export (CSV for Excel)",
        "EVD-20260125-003: Filtered fraud calls (Nigeria/Somalia/Ivory Coast)",
        "EVD-20260125-004: Attack timeline visualization (PNG chart)",
        "EVD-20260125-005: Attack timeline (JSON)",
        "EVD-20260125-006: Financial impact breakdown",
        "EVD-20260125-REPORT: Complete forensics report"
    ],
    
    "root_causes": [
        "Weak auto-attendant PIN (4 digits: 1234)",
        "No PIN rotation policy (10 months unchanged)",
        "Dial-out feature enabled on auto-attendant (unnecessary)",
        "No premium-rate number blocking on CUBE",
        "No call rate limiting configured",
        "Verizon fraud protection not activated ($50/month - not purchased)",
        "No real-time toll fraud monitoring/alerting"
    ],
    
    "corrective_actions": [
        "Disabled dial-out feature on all auto-attendants",
        "Rotated all PINs to 8-digit strong random values",
        "Implemented premium-rate number blocking on CUBE",
        "Enabled call rate limiting (10 calls/caller, 100 concurrent max)",
        "Activated Verizon fraud protection ($200/month for 4 trunks)",
        "Deployed Splunk real-time toll fraud alerting",
        "Created XDR playbook for automated fraud response",
        "Established quarterly PIN rotation policy",
        "Documented dial-out feature usage guidelines"
    ],
    
    "preventive_measures": [
        "Implement auto-attendant security best practices",
        "Regular CUBE configuration audits",
        "Monthly review of international call patterns",
        "Establish PSTN spend baseline and alerting thresholds",
        "Carrier fraud protection on all PSTN trunks",
        "Consider restricting international calling to business hours only",
        "Implement destination-based authorization (allow-list)",
        "Train staff on toll fraud indicators"
    ],
    
    "lessons_learned": """
    Key Lessons:
    1. Carrier fraud protection ($200/mo) is cheap insurance vs. $12K loss
    2. Weak/default PINs are low-hanging fruit for fraudsters
    3. Dial-out features should be disabled unless explicitly required
    4. Premium-rate number blocking should be standard on all PSTN gateways
    5. Real-time monitoring is essential - 6-hour window caused $12K damage
    6. Off-hours attacks common - automated response critical
    
    Industry Best Practice:
    - Assume auto-attendant PINs will be compromised
    - Defense-in-depth: PIN + premium blocking + rate limiting + carrier protection
    - Monitor, alert, auto-respond - human intervention too slow
    """,
    
    "financial_recovery": """
    Original Loss: $12,047.23
    Verizon Credit: -$6,023.61 (50% goodwill)
    Net Loss: $6,023.62
    
    Future Prevention Cost: $200/month fraud protection
    ROI: 30x (one incident prevented = 30 months of protection cost)
    
    Legal Action: Referred to FBI Cyber Crimes division (unlikely recovery)
    Insurance Claim: Denied (fraud not covered under policy)
    """
}

## Save report
with open('/mnt/evidence_vault/REPORT-CASE-2026-007-TOLL-FRAUD.json', 'w') as f:
    json.dump(report, f, indent=2)

## Register on blockchain
sha256sum /mnt/evidence_vault/REPORT-CASE-2026-007-TOLL-FRAUD.json
## a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3

peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{
    "Args":[
      "CollectEvidence",
      "EVD-20260125-REPORT",
      "CASE-2026-007-TOLL-FRAUD",
      "forensics_report",
      "REPORT-CASE-2026-007-TOLL-FRAUD.json",
      "24793",
      "a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3",
      "forensics-ws01.abhavtech.com",
      "Telecom-Engineer-Ramesh-Iyer",
      "Forensics-Report-Generator",
      "3650",
      "[\"SOC-Team\",\"Finance-Team\",\"Legal-Team\",\"Executive-Team\"]"
    ]
  }'
```

**10.2 Submit to Management:**

```bash
## Generate executive summary presentation
cat << 'EOF' | mail -s "Toll Fraud Incident Report - $12K Loss" \
  cfo@abhavtech.com,ciso@abhavtech.com,legal@abhavtech.com

EXECUTIVE SUMMARY: Toll Fraud Incident

Date: January 24-25, 2026
Financial Impact: $12,047 (recovered 50% = $6,024 net loss)
Root Cause: Weak auto-attendant PIN + no fraud protection

What Happened:
- Fraudsters compromised auto-attendant PIN through brute-force
- Placed 847 calls to premium-rate numbers over 6 hours
- Attack occurred overnight (22:00-04:00 UTC)

Immediate Actions Taken:
- Disabled dial-out feature on all auto-attendants
- Rotated all PINs to 8-digit strong values
- Enabled premium number blocking
- Activated carrier fraud protection ($200/month)

Long-Term Improvements:
- Real-time toll fraud monitoring
- Automated response playbooks
- Quarterly security audits

Detailed forensics report attached.

Telecom Team
EOF
```
