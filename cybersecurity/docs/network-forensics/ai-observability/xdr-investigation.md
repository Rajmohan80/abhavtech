# XDR Investigation

 MLTK INSIDER THREAT DETECTION

## Investigation Summary

**Incident:** Splunk MLTK detected abnormal data access pattern indicating insider threat; database administrator accessing tables outside normal scope.

**Detection:** MLTK anomaly detection model flagged DBA accessing 47 customer tables over 3 days (baseline: 2-3 tables/week).

**Impact:** Potential data exfiltration of 284,000 customer records; no confirmed data loss.

**Outcome:** Insider threat identified, access revoked, data access audit completed, DBA terminated for policy violation.

---

## Step 1: MLTK Anomaly Detection

**Detection Timestamp:** 2026-02-02 11:32:45 UTC

**Alert Source:** Splunk MLTK - Insider Threat Detection Model

```
Splunk Alert: Abnormal Data Access Pattern Detected
Model: insider_threat_data_access_v2.0
Algorithm: Density-Based Clustering (DBSCAN)
User: dba-admin-raj@abhavtech.com
Anomaly Score: 0.87 (threshold: 0.75)
Confidence: 94%

Baseline Behavior (30-day average):
- Tables accessed per day: 2.3
- Tables accessed per week: 14.7
- Customer tables accessed per week: 2.1
- Off-hours access: 3% of queries

Current Behavior (past 72 hours):
- Tables accessed: 47 (20.4x baseline)
- Customer tables accessed: 47 (22.4x baseline)
- Off-hours access: 89% of queries
- Data volume queried: 284 GB

Anomaly Indicators:
1. Volume spike: 2040% above baseline
2. After-hours queries: 2967% above baseline
3. Customer table focus: 100% (vs 15% baseline)
4. New table access pattern: 43 tables never accessed before
5. Sequential table scanning: Pattern consistent with data harvesting
```

**Immediate Response:**

```bash
CASE_ID="CASE-2026-015-INSIDER-THREAT"
INVESTIGATION_TYPE="mltk_insider_threat"

curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic <base64-creds>' \
  -d '{
    "short_description": "Insider Threat - Abnormal DB Access (MLTK Detection)",
    "description": "Splunk MLTK detected DBA accessing 47 customer tables (2040% above baseline)",
    "urgency": "1",
    "impact": "1",
    "category": "Security - Insider Threat",
    "assignment_group": "SOC-Forensics-Team"
  }'

## INC0012358

## Immediately suspend database account
sqlplus / as sysdba << EOF
ALTER USER dba_admin_raj ACCOUNT LOCK;
EXIT;
EOF

## Account locked within 2 minutes of alert
```

---

## Step 2: Analyze MLTK Model Output

**2.1 Export MLTK Detection Data:**

```spl
## Query Splunk for MLTK model results
| savedsearch "MLTK Insider Threat - Data Access Anomalies"
| where user="dba-admin-raj@abhavtech.com" AND _time >= relative_time(now(), "-7d")
| table _time user table_name query_type rows_returned bytes_returned anomaly_score
| sort -anomaly_score
| outputlookup /mnt/evidence_vault/EVD-20260202-001-mltk-anomaly-data.csv

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260202-001-mltk-anomaly-data.csv
## b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1

peer chaincode invoke \
  -n evidence-contract \
  -C evidence-channel \
  -c '{
    "Args":[
      "CollectEvidence",
      "EVD-20260202-001",
      "CASE-2026-015-INSIDER-THREAT",
      "mltk_anomaly_detection",
      "EVD-20260202-001-mltk-anomaly-data.csv",
      "487293",
      "b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
      "forensics-ws01.abhavtech.com",
      "SOC-Analyst-Vikram-Mehta",
      "Splunk-MLTK-Model",
      "365",
      "[\"SOC-Team\",\"Legal-Team\",\"HR-Team\",\"DPO-Team\"]"
    ]
  }'
```

**2.2 Visualize Anomaly Pattern:**

```python
## Python script to visualize MLTK detection
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

## Load MLTK data
df = pd.read_csv('/mnt/evidence_vault/EVD-20260202-001-mltk-anomaly-data.csv')
df['timestamp'] = pd.to_datetime(df['_time'])

## Plot anomaly score over time
fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(14, 10))

## Anomaly score timeline
ax1.plot(df['timestamp'], df['anomaly_score'], color='red', linewidth=2)
ax1.axhline(y=0.75, color='orange', linestyle='--', label='Threshold (0.75)')
ax1.set_ylabel('Anomaly Score')
ax1.set_title('MLTK Insider Threat Detection - DBA Account')
ax1.legend()
ax1.grid(True, alpha=0.3)

## Tables accessed per day
daily_tables = df.groupby(df['timestamp'].dt.date)['table_name'].nunique()
ax2.bar(daily_tables.index, daily_tables.values, color='steelblue', alpha=0.7)
ax2.axhline(y=2.3, color='green', linestyle='--', label='Baseline (2.3)')
ax2.set_ylabel('Unique Tables Accessed')
ax2.set_title('Daily Table Access Pattern')
ax2.legend()
ax2.grid(True, alpha=0.3)

## Data volume queried
daily_volume = df.groupby(df['timestamp'].dt.date)['bytes_returned'].sum() / (1024**3)  # GB
ax3.bar(daily_volume.index, daily_volume.values, color='coral', alpha=0.7)
ax3.set_ylabel('Data Volume (GB)')
ax3.set_xlabel('Date')
ax3.set_title('Daily Data Volume Queried')
ax3.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('/mnt/evidence_vault/EVD-20260202-002-mltk-visualization.png', dpi=150)

print("✅ MLTK visualization saved")

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260202-002-mltk-visualization.png
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260202-002","CASE-2026-015-INSIDER-THREAT",...]}'
```

---

## Step 3: Audit Database Activity

**3.1 Export Oracle Audit Logs:**

```sql
-- Connect to Oracle database
sqlplus / as sysdba

-- Export DBA activity for past 7 days
SET PAGESIZE 0
SET FEEDBACK OFF
SET LINESIZE 32767
SET TRIMSPOOL ON
SPOOL /mnt/evidence_vault/EVD-20260202-003-oracle-audit.csv

SELECT 
    TO_CHAR(timestamp, 'YYYY-MM-DD HH24:MI:SS') as timestamp,
    username,
    obj_name as table_name,
    action_name,
    returncode,
    client_id,
    os_username,
    userhost
FROM dba_audit_trail
WHERE username = 'DBA_ADMIN_RAJ'
    AND timestamp >= SYSDATE - 7
    AND obj_name LIKE 'CUSTOMER%'
ORDER BY timestamp;

SPOOL OFF
EXIT;

## Parse and analyze
wc -l /mnt/evidence_vault/EVD-20260202-003-oracle-audit.csv
## 847 queries to customer tables

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260202-003-oracle-audit.csv
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260202-003","CASE-2026-015-INSIDER-THREAT",...]}'
```

**3.2 Analyze Query Patterns:**

```python
## Analyze query patterns
import pandas as pd

audit = pd.read_csv('/mnt/evidence_vault/EVD-20260202-003-oracle-audit.csv')

## Group by table
table_access = audit.groupby('table_name').size().sort_values(ascending=False)

print("Most Accessed Tables:")
print(table_access.head(10))

## Output:
## CUSTOMER_MASTER 287 queries
## CUSTOMER_TRANSACTIONS 184 queries
## CUSTOMER_PAYMENT_INFO 156 queries
## CUSTOMER_ADDRESSES 123 queries
## CUSTOMER_CONTACTS 97 queries

## Check for data exports
exports = audit[audit['action_name'].str.contains('SELECT', case=False)]
print(f"\nTotal SELECT queries: {len(exports)}")
print(f"Total rows returned: {exports['rows_returned'].sum():,}")

## Output:
## Total SELECT queries: 847
## Total rows returned: 284,193
```

---

## Step 4: Correlate with Network Traffic

**4.1 Check for Data Exfiltration:**

```spl
## Query Splunk for network connections from DBA workstation
index=firewall sourcetype=cisco:ftd src_user="dba-admin-raj@abhavtech.com" earliest=-7d
| search dst_ip!="10.252.*" dst_ip!="172.16.*"  # External destinations only
| stats sum(bytes_sent) as total_bytes by dst_ip dst_port
| where total_bytes > 1000000000  # >1 GB
| eval total_gb=round(total_bytes/(1024*1024*1024), 2)
| sort -total_gb

Results:
dst_ip          dst_port  total_gb
116.73.XX.XXX   443       47.3     # External cloud storage (suspicious)
8.8.8.8         443       2.1      # Google (normal)
```

**4.2 Identify External Upload:**

```bash
## Check Umbrella DNS logs for domain
curl -X GET \
  "https://api.umbrella.com/investigate/v2/pdns/ip/116.73.XX.XXX" \
  -H "Authorization: Bearer $UMBRELLA_TOKEN"

## Output:
{
  "domain": "mega-upload-storage.com",
  "category": "Cloud Storage",
  "risk_score": 67,  # Medium-high risk
  "created": "2025-12-15"  # Recently created
}

## Data uploaded to external cloud storage (47.3 GB)
```

---

## Step 5: Interview DBA

**HR Interview Summary (2026-02-02 14:30 UTC):**

```
Attendees: HR Director, Legal Counsel, IT Security Manager, DBA (Raj)

Q: Why did you access 47 customer tables over the past 3 days?
A: "I was conducting a data quality audit for the upcoming migration project."

Q: Why after hours (89% of queries)?
A: "I didn't want to impact production performance during business hours."

Q: Why upload 47 GB to external cloud storage (mega-upload-storage.com)?
A: "I... I was backing up the data for safety before the migration."

Q: Company policy prohibits external data storage. Were you aware?
A: "Yes, but I thought it was safer to have a backup."

Q: You're scheduled to resign in 2 weeks. Is this related?
A: [Long pause] "I wanted to have the data for my next job. I planned to use it as portfolio examples."

CONCLUSION: DBA admitted to data theft for use at future employer
Action: Immediate termination, legal action initiated
```

---

## Step 6: Data Recovery and Containment

**6.1 Contact Cloud Storage Provider:**

```bash
## Legal team contacts mega-upload-storage.com
## Request: Takedown notice + data deletion

## Provider Response (2026-02-03):
## Account suspended, data quarantined
## Awaiting court order for permanent deletion
## Data NOT accessed by third parties (confirmed)

## External data secured
```

**6.2 Assess Data Exposure:**

```sql
-- Query to determine exact records exposed
sqlplus / as sysdba << EOF
SELECT COUNT(*) as total_records
FROM (
    SELECT DISTINCT customer_id
    FROM customer_master
    WHERE customer_id IN (
        SELECT obj_id FROM dba_audit_trail
        WHERE username = 'DBA_ADMIN_RAJ'
        AND timestamp >= SYSDATE - 7
    )
);
EXIT;
EOF

## Output: 284,193 unique customer records
```

**Data Exposure Summary:**
- **Customer Records:** 284,193
- **PII Fields:** Name, email, phone, address, payment info
- **Regulatory Impact:** GDPR, CCPA, state breach laws
- **Notification Required:** Yes

---

## Step 7: MLTK Model Analysis

**7.1 Review Model Performance:**

```spl
## Check MLTK model accuracy
| inputlookup mltk_insider_threat_validation.csv
| eval prediction_accuracy = if(actual_threat=predicted_threat, 1, 0)
| stats avg(prediction_accuracy) as accuracy, count as total_predictions

Results:
accuracy: 0.94 (94% accurate)
total_predictions: 287

## Model confusion matrix
| inputlookup mltk_insider_threat_validation.csv
| contingency actual_threat predicted_threat

Results:
                Predicted: Threat  Predicted: Normal
Actual: Threat        247                 15          (94% detection rate)
Actual: Normal          2                 23          (92% specificity)

## Model performance excellent (94% accuracy)
```

**7.2 Feature Importance Analysis:**

```python
## Analyze which features contributed most to detection
features = {
    'tables_accessed_count': 0.34,        # 34% weight
    'after_hours_percentage': 0.28,       # 28% weight
    'data_volume_gb': 0.19,               # 19% weight
    'new_tables_accessed': 0.12,          # 12% weight
    'sequential_pattern_score': 0.07      # 7% weight
}

print("MLTK Feature Importance:")
for feature, weight in sorted(features.items(), key=lambda x: x[1], reverse=True):
    print(f"  {feature}: {weight*100:.1f}%")

## Output shows top 3 features:
## 1. Tables accessed count (34%)
## 2. After-hours percentage (28%)
## 3. Data volume queried (19%)
```

---

## Step 8: Forensics Report

```python
report = {
    "case_id": "CASE-2026-015-INSIDER-THREAT",
    "investigation_type": "Insider Threat - Data Exfiltration (MLTK Detection)",
    "incident_date": "2026-01-30 to 2026-02-02",
    "analyst": "SOC-Analyst-Vikram-Mehta",
    
    "executive_summary": """
    Splunk MLTK detected insider threat on 2026-02-02. Database administrator
    (DBA) accessed 47 customer tables over 3 days (2040% above baseline),
    exfiltrating 284,193 customer records (47.3 GB) to external cloud storage.
    
    MLTK Detection:
    - Model: insider_threat_data_access_v2.0
    - Algorithm: DBSCAN clustering
    - Anomaly Score: 0.87 (threshold: 0.75)
    - Confidence: 94%
    
    Insider Profile:
    - User: DBA Admin (Raj)
    - Motivation: Data theft for use at future employer
    - Access: Legitimate DBA credentials (privileged)
    - Method: After-hours queries + external upload
    - Status: Scheduled resignation in 2 weeks
    
    Data Exposure:
    - Customer records: 284,193
    - Data volume: 47.3 GB
    - External storage: mega-upload-storage.com
    - Third-party access: None (confirmed)
    
    Response:
    - Account locked within 2 minutes of MLTK alert
    - External data quarantined (cloud provider cooperation)
    - DBA interviewed and terminated
    - Legal action initiated
    - GDPR breach notification prepared
    
    AI/ML Value:
    - MLTK detected anomaly 3 days into attack
    - Manual detection: Unlikely (normal DBA activity)
    - Cost avoidance: $500K+ (early containment)
    - Model accuracy: 94% (247/262 true threats detected)
    """,
    
    "mltk_technical_analysis": """
    Model: insider_threat_data_access_v2.0
    Algorithm: Density-Based Spatial Clustering (DBSCAN)
    Training Data: 18 months of DBA activity (all DBAs)
    Features: 12 behavioral metrics
    
    Detection Logic:
    1. Baseline behavior established per user (30-day rolling window)
    2. Current behavior compared to baseline
    3. Anomaly score calculated using DBSCAN clustering
    4. Score >0.75 triggers alert
    
    Key Features (in order of importance):
    1. Tables accessed count (34% weight)
       - Baseline: 2.3/day
       - Actual: 47 over 3 days (20.4x)
    
    2. After-hours percentage (28% weight)
       - Baseline: 3% of queries
       - Actual: 89% of queries (29.7x)
    
    3. Data volume queried (19% weight)
       - Baseline: 2.3 GB/week
       - Actual: 47.3 GB over 3 days (20.6x)
    
    4. New tables accessed (12% weight)
       - Baseline: 1-2 new tables/month
       - Actual: 43 new tables in 3 days
    
    5. Sequential scanning pattern (7% weight)
       - Detected systematic table enumeration
       - Pattern consistent with data harvesting
    
    Model Performance:
    - True Positives: 247 (94.6%)
    - False Positives: 2 (0.8%)
    - False Negatives: 15 (5.4%)
    - True Negatives: 23 (87.9%)
    - Overall Accuracy: 94.1%
    
    Why MLTK Succeeded:
    - Behavioral analytics > signature-based detection
    - Legitimate credentials don't bypass ML detection
    - Clustering identifies outliers in normal activity
    - Temporal patterns (after-hours) highly weighted
    """,
    
    "evidence_summary": [
        "EVD-20260202-001: MLTK anomaly detection data (847 queries)",
        "EVD-20260202-002: MLTK visualization (anomaly timeline)",
        "EVD-20260202-003: Oracle audit logs (284K records accessed)",
        "EVD-20260202-004: Network traffic logs (47.3 GB upload)",
        "EVD-20260202-005: HR interview transcript",
        "EVD-20260202-006: Cloud storage provider response",
        "EVD-20260202-REPORT: Complete forensics report"
    ],
    
    "recommendations": [
        "Deploy Oracle Database Vault for separation of duties",
        "Implement dynamic data masking for production queries",
        "Enhance DLP policies to block external cloud uploads",
        "Deploy CyberArk for privileged access management",
        "Expand MLTK monitoring to cover all privileged users",
        "Implement just-in-time (JIT) access for DBAs",
        "Deploy watermarking for sensitive data tables",
        "Enhance exit interview process for departing employees"
    ]
}

with open('/mnt/evidence_vault/REPORT-CASE-2026-015-INSIDER-THREAT.json', 'w') as f:
    json.dump(report, f, indent=2)

sha256sum /mnt/evidence_vault/REPORT-CASE-2026-015-INSIDER-THREAT.json
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260202-REPORT","CASE-2026-015-INSIDER-THREAT",...]}'
```