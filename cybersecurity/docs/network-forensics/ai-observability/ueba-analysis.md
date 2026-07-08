# UEBA Analysis

 COGNITION ENGINE ANOMALY INVESTIGATION

## Investigation Summary

**Incident:** AppDynamics Cognition Engine detected sudden 400% increase in database query time for e-commerce checkout transactions.

**Detection:** Deep learning model predicted 87% customer abandonment rate (baseline: 12%) due to performance degradation.

**Impact:** $847,000 in lost revenue over 2 hours before remediation; 2,847 abandoned carts.

**Outcome:** Root cause identified (inefficient SQL query), optimized query reduced response time by 92%, revenue recovered.

---

## Step 1: Cognition Engine Alert

**Detection Timestamp:** 2026-02-03 16:45:32 UTC

**Alert Source:** AppDynamics Cognition Engine

```
Cognition Engine Alert: Business Transaction Anomaly
Transaction: /checkout/payment-submit
Business Impact: CRITICAL - Revenue at Risk

Anomaly Detection:
- Algorithm: Deep Neural Network (LSTM)
- Confidence: 96%
- Severity: Critical
- Predicted Impact: $1.2M revenue loss (next 4 hours)

Metrics:
                        Baseline    Current    Delta
Response Time (ms):     245        1,823      +644%
Error Rate (%):         0.3        8.7        +2,800%
Throughput (req/min):   847        234        -72%
DB Query Time (ms):     87         1,547      +1,678%

Cognition Analysis:
- Root Cause Probability: Database tier (94% confidence)
- Affected Component: checkout_db.payment_processing table
- Anomaly Start: 2026-02-03 14:32:15 UTC (2h 13m ago)
- Business Transactions Affected: 2,847
- Estimated Revenue Impact: $847,000 (already lost)

ML Prediction:
- Customer abandonment rate: 87% (vs 12% baseline)
- Cart recovery likelihood: 23% (vs 78% baseline)
- Revenue recovery time: 4.2 hours (if not remediated)
```

**Immediate Response:**

```bash
CASE_ID="CASE-2026-016-COGNITION-ANOMALY"
INVESTIGATION_TYPE="application_performance_revenue_impact"

curl -X POST https://abhavtech.service-now.com/api/now/table/incident \
  -d '{
    "short_description": "CRITICAL: E-commerce Performance Degradation - $847K Loss",
    "urgency": "1",
    "impact": "1",
    "category": "Performance - Revenue Impact",
    "u_business_impact": "847000 USD"
  }'

## INC0012359

## Page on-call team
curl -X POST https://pagerduty.abhavtech.com/api/v1/incidents \
  -H "Authorization: Token token=$PD_API_KEY" \
  -d '{
    "incident": {
      "type": "incident",
      "title": "CRITICAL: E-commerce checkout degraded - Cognition detected",
      "service": {"id": "ecommerce-platform"},
      "urgency": "high",
      "body": {"details": "Checkout response time 1.8s (7x baseline). $847K lost. DB query issue."}
    }
  }'

## Team paged within 1 minute
```

---

## Step 2: Cognition Engine Deep Dive

**2.1 Export Cognition Analysis:**

```bash
## Query AppDynamics REST API
curl -X GET \
  "https://appdynamics.abhavtech.com/controller/rest/applications/ECommerce/metric-data?metric-path=Business%20Transaction%20Performance%7C*%7Ccheckout%7Cpayment-submit%7C*&time-range-type=BEFORE_NOW&duration-in-mins=240" \
  -H "Authorization: Bearer $APPD_TOKEN" \
  > /mnt/evidence_vault/EVD-20260203-001-cognition-metrics.json

## Register on blockchain
sha256sum /mnt/evidence_vault/EVD-20260203-001-cognition-metrics.json
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260203-001","CASE-2026-016-COGNITION-ANOMALY",...]}'
```

**2.2 Analyze Transaction Flow:**

```python
## Parse Cognition Engine flow map
import json

with open('/mnt/evidence_vault/EVD-20260203-001-cognition-metrics.json') as f:
    metrics = json.load(f)

## Extract transaction breakdown
for tier in metrics['flowmap']['tiers']:
    print(f"\nTier: {tier['name']}")
    print(f"  Calls: {tier['numberOfCalls']}")
    print(f"  Avg Response Time: {tier['averageResponseTime']}ms")
    print(f"  Error Rate: {tier['errorRate']}%")

## Output:
Tier: Web Tier
  Calls: 2847
  Avg Response Time: 87ms
  Error Rate: 0.1%

Tier: Application Tier
  Calls: 2847
  Avg Response Time: 123ms
  Error Rate: 0.2%

Tier: Database Tier  # ← PROBLEM HERE
  Calls: 2847
  Avg Response Time: 1547ms  # ← 17.8x baseline (87ms)
  Error Rate: 8.7%

## Root cause: Database tier response time
```

---

## Step 3: Database Query Analysis

**3.1 Identify Slow Query:**

```sql
-- Connect to PostgreSQL database
psql -h checkout-db.abhavtech.com -U postgres -d ecommerce

-- Query pg_stat_statements for slow queries
SELECT 
    query,
    calls,
    mean_exec_time,
    total_exec_time,
    stddev_exec_time,
    rows
FROM pg_stat_statements
WHERE query LIKE '%payment_processing%'
    AND mean_exec_time > 1000  -- >1 second
ORDER BY mean_exec_time DESC
LIMIT 5;

-- Output:
query                                               calls  mean_exec_time  total_exec_time
--------------------------------------------------  -----  --------------  ---------------
SELECT * FROM payment_processing                    2847   1547.3          4,403,143.1
WHERE user_id = $1 
AND status IN ('pending', 'processing', 'failed')
AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

## Problematic query: No index on (user_id, status, created_at)
```

**3.2 Explain Query Plan:**

```sql
-- Analyze query execution plan
EXPLAIN ANALYZE
SELECT * FROM payment_processing
WHERE user_id = 12345
    AND status IN ('pending', 'processing', 'failed')
    AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Output:
Sort  (cost=284729.83..284729.84 rows=1 width=256) (actual time=1547.234..1547.235 rows=3 loops=1)
  Sort Key: created_at DESC
  Sort Method: quicksort  Memory: 25kB
  ->  Seq Scan on payment_processing  (cost=0.00..284729.82 rows=1 width=256) (actual time=487.123..1547.189 rows=3 loops=1)
        Filter: ((user_id = 12345) AND (status = ANY ('{pending,processing,failed}'::text[])) AND (created_at >= (now() - '30 days'::interval)))
        Rows Removed by Filter: 2847293

Planning Time: 1.234 ms
Execution Time: 1547.456 ms

## Sequential Scan on 2.8M rows (no index usage)
## Should use index: <1ms with proper indexing
```

---

## Step 4: Root Cause Timeline

**4.1 Determine When Problem Started:**

```python
## Plot Cognition Engine metrics over time
import pandas as pd
import matplotlib.pyplot as plt

## Load metrics
df = pd.read_json('/mnt/evidence_vault/EVD-20260203-001-cognition-metrics.json')
df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')

fig, (ax1, ax2, ax3) = plt.subplots(3, 1, figsize=(14, 10))

## Response time
ax1.plot(df['timestamp'], df['response_time'], color='red', linewidth=2)
ax1.axhline(y=245, color='green', linestyle='--', label='Baseline (245ms)')
ax1.axvline(x=pd.Timestamp('2026-02-03 14:32:15'), color='orange', linestyle='--', label='Anomaly Start')
ax1.set_ylabel('Response Time (ms)')
ax1.set_title('Cognition Engine Detection - Checkout Performance')
ax1.legend()
ax1.grid(True, alpha=0.3)

## Error rate
ax2.plot(df['timestamp'], df['error_rate'], color='orange', linewidth=2)
ax2.axhline(y=0.3, color='green', linestyle='--', label='Baseline (0.3%)')
ax2.set_ylabel('Error Rate (%)')
ax2.legend()
ax2.grid(True, alpha=0.3)

## Revenue impact (cumulative)
df['revenue_lost'] = df['abandoned_carts'] * 298  # Avg cart value: $298
df['cumulative_loss'] = df['revenue_lost'].cumsum()
ax3.plot(df['timestamp'], df['cumulative_loss']/1000, color='darkred', linewidth=2)
ax3.set_ylabel('Revenue Lost ($K)')
ax3.set_xlabel('Time')
ax3.set_title(f'Cumulative Revenue Impact: ${df["cumulative_loss"].iloc[-1]:,.0f}')
ax3.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('/mnt/evidence_vault/EVD-20260203-002-cognition-timeline.png', dpi=150)

## Timeline visualization saved
```

**4.2 Correlate with Deployment:**

```bash
## Check recent deployments
curl -X GET \
  "https://jenkins.abhavtech.com/api/json?tree=jobs[name,lastBuild[number,timestamp,result,actions[causes[userId]]]]" \
  | jq '.jobs[] | select(.name == "ecommerce-checkout-service")'

## Output:
{
  "name": "ecommerce-checkout-service",
  "lastBuild": {
    "number": 847,
    "timestamp": 1738508400000,  # 2026-02-03 14:20:00 UTC
    "result": "SUCCESS",
    "userId": "dev-team-sarah"
  }
}

## Deployment at 14:20 UTC
## Anomaly started at 14:32 UTC (12 minutes after deployment)
## Root cause: Code change in deployment #847
```

---

## Step 5: Code Change Analysis

**5.1 Review Git Diff:**

```bash
## Get deployment details
git log --oneline -n 1 deploy-847
## a9b0c1d feat: Add payment status filtering for better UX

## View code changes
git show a9b0c1d

## Output (relevant section):
diff --git a/services/checkout/payment.py b/services/checkout/payment.py
index 1234567..89abcdef 100644
--- a/services/checkout/payment.py
+++ b/services/checkout/payment.py
@@ -45,8 +45,10 @@ def get_user_payments(user_id):
-    # Previous query (fast)
-    query = "SELECT * FROM payment_processing WHERE user_id = %s ORDER BY created_at DESC LIMIT 10"
+    # New query (SLOW - no index on status!)
+    query = """SELECT * FROM payment_processing 
+               WHERE user_id = %s 
+               AND status IN ('pending', 'processing', 'failed')
+               AND created_at >= NOW() - INTERVAL '30 days'
+               ORDER BY created_at DESC"""

## Developer added status filter without considering index
## Previous query: Used index on user_id (fast)
## New query: No composite index on (user_id, status, created_at) → SLOW
```

---

## Step 6: Immediate Remediation

**6.1 Create Database Index:**

```sql
-- Create composite index
CREATE INDEX CONCURRENTLY idx_payment_processing_user_status_date 
ON payment_processing (user_id, status, created_at DESC);

-- Index creation time: ~2 minutes (CONCURRENTLY = no table lock)

-- Verify index usage
EXPLAIN ANALYZE
SELECT * FROM payment_processing
WHERE user_id = 12345
    AND status IN ('pending', 'processing', 'failed')
    AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Output (AFTER index creation):
Index Scan using idx_payment_processing_user_status_date on payment_processing
  (cost=0.43..8.47 rows=1 width=256) (actual time=0.234..0.456 rows=3 loops=1)
  Index Cond: ((user_id = 12345) AND (created_at >= (now() - '30 days'::interval)))
  Filter: (status = ANY ('{pending,processing,failed}'::text[]))

Planning Time: 0.123 ms
Execution Time: 0.512 ms  # ← 3,022x FASTER (1547ms → 0.5ms)

## Query optimized - 99.97% improvement
```

**6.2 Monitor Recovery:**

```bash
## Watch Cognition Engine metrics
watch -n 5 'curl -s "https://appdynamics.abhavtech.com/controller/rest/applications/ECommerce/metric-data?metric-path=Business%20Transaction%20Performance%7C*%7Ccheckout%7Cpayment-submit%7CAverage%20Response%20Time%20%28ms%29" -H "Authorization: Bearer $APPD_TOKEN" | jq ".[] | .values[0].value"'

## Output (every 5 seconds):
1547  # Before fix
1423
1287
1045
 847
 623
 434
 298
 187
  89  # ← Back to baseline (245ms target)

## Performance recovered within 3 minutes of index creation
```

---

## Step 7: Business Impact Analysis

**7.1 Calculate Revenue Loss:**

```python
## Query Cognition Engine for business impact
impact = {
    "anomaly_duration_hours": 2.25,
    "abandoned_carts": 2847,
    "average_cart_value_usd": 298,
    "baseline_abandonment_rate": 0.12,
    "actual_abandonment_rate": 0.87,
    "recovery_rate": 0.23
}

## Calculate losses
total_attempted = impact["abandoned_carts"] / impact["actual_abandonment_rate"]
baseline_abandoned = total_attempted * impact["baseline_abandonment_rate"]
excess_abandoned = impact["abandoned_carts"] - baseline_abandoned

revenue_lost = excess_abandoned * impact["average_cart_value_usd"]
potential_recovered = revenue_lost * impact["recovery_rate"]
net_loss = revenue_lost - potential_recovered

print(f"Revenue Impact Analysis:")
print(f"  Total attempted checkouts: {total_attempted:,.0f}")
print(f"  Excess abandonments: {excess_abandoned:,.0f}")
print(f"  Revenue lost: ${revenue_lost:,.0f}")
print(f"  Potentially recovered: ${potential_recovered:,.0f}")
print(f"  Net loss: ${net_loss:,.0f}")

## Output:
## Revenue Impact Analysis:
## Total attempted checkouts: 3,272
## Excess abandonments: 2,454
## Revenue lost: $731,292
## Potentially recovered: $168,197
## Net loss: $563,095

## Cognition Engine prediction: $847K (overestimated by 16%)
## Actual loss: $563K
```

---

## Step 8: Forensics Report

```python
report = {
    "case_id": "CASE-2026-016-COGNITION-ANOMALY",
    "investigation_type": "Application Performance - Revenue Impact (Cognition Detection)",
    "incident_date": "2026-02-03",
    "analyst": "AppOps-Engineer-Sarah-Chen",
    
    "executive_summary": """
    AppDynamics Cognition Engine detected critical e-commerce performance
    degradation on 2026-02-03 at 16:45 UTC. Checkout transaction response time
    increased 644% (245ms → 1,823ms), causing 87% cart abandonment rate.
    
    Business Impact:
    - Revenue lost: $563,095 (2.25 hours)
    - Abandoned carts: 2,847
    - Customer abandonment: 87% (vs 12% baseline)
    - Affected transactions: 3,272
    
    Root Cause:
    - Code deployment at 14:20 UTC (build #847)
    - Developer added SQL filter without database index
    - Query changed from indexed (user_id) to unindexed (user_id + status + date)
    - Sequential scan on 2.8M rows → 1,547ms per query
    
    Cognition Engine Detection:
    - Algorithm: Deep Neural Network (LSTM)
    - Confidence: 96%
    - Detection time: 2h 13m after anomaly start
    - Predicted impact: $1.2M (actual: $563K)
    
    Remediation:
    - Database index created (CONCURRENTLY, no downtime)
    - Query performance improved 99.97% (1,547ms → 0.5ms)
    - Metrics recovered to baseline within 3 minutes
    - Total remediation time: 15 minutes (detection to recovery)
    
    AI/ML Value:
    - Cognition detected subtle performance shift (16% slower)
    - Predicted business impact before manual escalation
    - Root cause analysis: 94% confidence on database tier
    - Automated correlation: code deployment → performance → revenue
    """,
    
    "cognition_technical_analysis": """
    Model: Business Transaction Deep Learning (LSTM)
    Training Data: 12 months of checkout transactions
    Features: 47 performance + business metrics
    
    Detection Logic:
    1. Real-time transaction analysis (every 1 minute)
    2. Anomaly detection using LSTM neural network
    3. Business impact prediction (revenue, customers)
    4. Root cause analysis (tier identification)
    5. Automated alert + remediation suggestion
    
    Why Cognition Succeeded:
    - Baseline: 245ms average response time (99th percentile: 487ms)
    - Detected: 16% degradation (245ms → 284ms) at 14:45
    - Escalated: 200% degradation (245ms → 735ms) at 15:32
    - Alerted: 644% degradation (245ms → 1,823ms) at 16:45
    
    Progressive Detection:
    - Traditional monitoring: Alert at 500ms (>2x baseline)
    - Cognition: Alert at 284ms (16% degradation)
    - Early detection: 2 hours before traditional alert
    - Revenue saved: ~$300K (early intervention)
    
    Business Impact Prediction:
    - Predicted: $1.2M loss (next 4 hours)
    - Actual: $563K loss (2.25 hours before fix)
    - Accuracy: 53% (overestimated, but conservative)
    - Value: Correct urgency classification (CRITICAL)
    """,
    
    "evidence_summary": [
        "EVD-20260203-001: Cognition Engine metrics (4-hour window)",
        "EVD-20260203-002: Performance timeline visualization",
        "EVD-20260203-003: Database query execution plans",
        "EVD-20260203-004: Git commit diff (deployment #847)",
        "EVD-20260203-005: Business impact analysis",
        "EVD-20260203-REPORT: Complete forensics report"
    ],
    
    "recommendations": [
        "Implement mandatory database performance testing in CI/CD",
        "Deploy query explain plan analysis in PR reviews",
        "Enable Cognition anomaly alerts for all business transactions",
        "Create automated rollback triggers for revenue-impacting changes",
        "Implement database index advisor in development environments",
        "Deploy canary releases with business metric monitoring",
        "Enhance developer training on SQL optimization",
        "Integrate Cognition with incident response (auto-page on CRITICAL)"
    ]
}

with open('/mnt/evidence_vault/REPORT-CASE-2026-016-COGNITION-ANOMALY.json', 'w') as f:
    json.dump(report, f, indent=2)

sha256sum /mnt/evidence_vault/REPORT-CASE-2026-016-COGNITION-ANOMALY.json
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260203-REPORT","CASE-2026-016-COGNITION-ANOMALY",...]}'
```

---
