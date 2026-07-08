# Operations Automation Scripts Package
## KidsWear Contact Center

**Version:** 1.0  
**Date:** March 2026  
**Purpose:** Ready-to-deploy automation scripts for monitoring, alerting, and reporting

---

## Package Contents

```
scripts/
├── monitoring/
│   ├── alert_engine.py          # Main alert engine
│   ├── anomaly_detection.py     # Anomaly detection engine
│   ├── trend_analysis.py        # Trend analysis
│   └── forecast.py              # Call volume forecasting
│
├── reporting/
│   ├── daily_report.py          # Daily snapshot report
│   ├── weekly_report.py         # Weekly performance report
│   ├── monthly_report.py        # Monthly executive report
│   └── agent_scorecard.py       # Individual agent scorecards
│
├── compliance/
│   ├── delete_customer_data.py  # DPDP Act data deletion
│   ├── pci_audit.py             # PCI-DSS audit automation
│   └── dpdp_audit.py            # DPDP Act compliance check
│
├── maintenance/
│   ├── daily_health_check.sh    # System health check
│   ├── database_backup.sh       # PostgreSQL backup
│   └── log_rotation.sh          # Log file management
│
└── setup/
    ├── install_dependencies.sh  # One-click dependency installation
    ├── create_database.sql      # Database schema creation
    └── configure_cron.sh        # Automated cron job setup
```

---

## Quick Installation

### **One-Line Setup**
```bash
curl -sSL https://raw.githubusercontent.com/kidswear/cc-ops/main/setup/install.sh | bash
```

### **Manual Setup**
```bash
# Clone repository
git clone https://github.com/kidswear/cc-ops.git
cd cc-ops

# Run installer
chmod +x setup/install_dependencies.sh
sudo ./setup/install_dependencies.sh

# Configure database
sudo -u postgres psql < setup/create_database.sql

# Setup cron jobs
./setup/configure_cron.sh

# Start services
sudo systemctl enable --now cc-alerts
sudo systemctl enable --now csat-api
```

---

## Script Reference

### **1. Alert Engine** (`monitoring/alert_engine.py`)

**Purpose:** Monitor queue performance and send real-time alerts

**Features:**
- Queue wait time monitoring
- Service level breach detection
- Agent availability tracking
- Slack + Email notifications
- Alert deduplication

**Usage:**
```bash
# Run as systemd service
sudo systemctl start cc-alerts

# Manual test
python3 monitoring/alert_engine.py --test

# View logs
journalctl -u cc-alerts -f
```

**Configuration:**
```python
# Edit alert_engine.py
SLACK_WEBHOOK = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
EMAIL_API = 'https://api.sendgrid.com/v3/mail/send'
SENDGRID_KEY = 'YOUR_SENDGRID_API_KEY'

DB_CONFIG = {
    'host': 'localhost',
    'database': 'cc_operations',
    'user': 'cc_admin',
    'password': 'YourSecurePassword123!'
}
```

**Alert Rules:**
| Condition | Threshold | Action |
|-----------|-----------|--------|
| Queue wait time | > 120s for 5 min | Slack + Email |
| Service level | < 70% for 10 min | Slack + SMS |
| Agent availability | < 2 agents | Slack (critical) |

---

### **2. Daily Report Generator** (`reporting/daily_report.py`)

**Purpose:** Generate and email daily operational snapshot

**Features:**
- Call volume summary
- Service level metrics
- Agent performance stats
- CSAT scores
- HTML email formatting

**Usage:**
```bash
# Run manually
python3 reporting/daily_report.py

# Automated (cron)
0 9 * * * /usr/bin/python3 /opt/cc-dashboard/reporting/daily_report.py
```

**Sample Output:**
```
📊 Daily Snapshot - November 22, 2025

Total Calls: 1,247
Service Level: 85.3% ✅
Abandonment Rate: 3.2% ✅
Avg Handle Time: 5m 12s
Avg Wait Time: 18s
CSAT: 4.2/5.0 ✅

Sent to: ops-manager@kidswear.com
```

---

### **3. Weekly Performance Report** (`reporting/weekly_report.py`)

**Purpose:** Comprehensive weekly analysis with charts

**Features:**
- Call volume trends (line chart)
- Service level performance (area chart)
- Agent rankings (top 10 + bottom 5)
- CSAT trend analysis
- Week-over-week comparison

**Usage:**
```bash
# Run manually
python3 reporting/weekly_report.py

# Automated (every Monday)
0 8 * * 1 /usr/bin/python3 /opt/cc-dashboard/reporting/weekly_report.py
```

**Dependencies:**
```bash
pip install pandas matplotlib psycopg2-binary
```

---

### **4. Data Deletion Script** (`compliance/delete_customer_data.py`)

**Purpose:** DPDP Act compliance - process customer data deletion requests

**Features:**
- Automated 30-day SLA processing
- Multi-system deletion (database + Zendesk)
- Audit trail maintenance
- Confirmation email to customer

**Usage:**
```bash
# Run manually
python3 compliance/delete_customer_data.py

# Automated (monthly on 1st)
0 2 1 * * /usr/bin/python3 /opt/cc-dashboard/compliance/delete_customer_data.py
```

**Process:**
```
1. Query pending deletion requests (> 30 days old)
2. Delete/anonymize data in PostgreSQL
3. Delete/anonymize data in Zendesk
4. Mark request as completed
5. Send confirmation email
6. Log audit trail
```

**Safety Features:**
- ✅ Dry-run mode available
- ✅ Backup before deletion
- ✅ Rollback capability (30 days)
- ✅ Audit logging

**Dry Run:**
```bash
python3 compliance/delete_customer_data.py --dry-run
```

---

### **5. Anomaly Detection** (`monitoring/anomaly_detection.py`)

**Purpose:** Detect unusual patterns in call metrics

**Algorithm:** Standard Deviation Method (2σ threshold)

**Monitored Metrics:**
- Call volume (hourly)
- Average wait time
- Abandonment rate

**Usage:**
```bash
# Run manually
python3 monitoring/anomaly_detection.py

# Automated (hourly)
0 * * * * /usr/bin/python3 /opt/cc-dashboard/monitoring/anomaly_detection.py
```

**Example Alert:**
```
🔍 Anomaly Detected

Call Volume:
- Current: 15 calls
- Expected: 45 ± 10 calls
- Deviation: -3.0σ

Action: Investigate potential system outage
```

---

### **6. Daily Health Check** (`maintenance/daily_health_check.sh`)

**Purpose:** Automated system health verification

**Checks:**
- PostgreSQL connectivity
- Redis cache status
- Dashboard API responsiveness
- Alert engine running
- CSAT API status
- Disk space usage
- Webex CC API connectivity
- Call volume (last hour)

**Usage:**
```bash
# Run manually
./maintenance/daily_health_check.sh

# Automated with email (daily 9 AM)
0 9 * * * /opt/cc-dashboard/maintenance/daily_health_check.sh | mail -s "Daily Health Check" ops-manager@kidswear.com
```

**Sample Output:**
```
================================================
Daily Contact Center Health Check
Date: Fri Nov 22 09:00:01 IST 2025
================================================

[1/8] Checking PostgreSQL database...
✅ Database: OK

[2/8] Checking Redis cache...
✅ Redis: OK

[3/8] Checking Dashboard API...
✅ Dashboard API: OK

[4/8] Checking Alert Engine...
✅ Alert Engine: Running

[5/8] Checking CSAT API...
✅ CSAT API: Running

[6/8] Checking disk space...
✅ Disk Space: 42% used

[7/8] Checking Webex CC API...
✅ Webex CC API: OK

[8/8] Checking call volume...
✅ Call Volume: 47 calls in last hour

================================================
Health Check Complete - All Systems Operational
================================================
```

---

### **7. Call Volume Forecasting** (`monitoring/forecast.py`)

**Purpose:** Predict next hour's call volume for staffing

**Algorithm:** Linear Regression (4-week historical data)

**Features:**
- Predicts calls for next hour
- Compares to current agent capacity
- Alerts if insufficient staffing
- Recommends agent count adjustment

**Usage:**
```bash
# Run manually
python3 monitoring/forecast.py

# Automated (every 30 minutes)
*/30 * * * * /usr/bin/python3 /opt/cc-dashboard/monitoring/forecast.py
```

**Example Alert:**
```
📈 Capacity Warning - Next Hour

Predicted calls: 72
Current capacity: 60 (10 agents × 6 calls/hour)
Shortfall: 12 calls

Recommendation: Bring 2 additional agents online
```

---

## Development & Customization

### **Environment Variables**

Create `.env` file in project root:
```bash
# Database
DB_HOST=localhost
DB_NAME=cc_operations
DB_USER=cc_admin
DB_PASSWORD=YourSecurePassword123!

# Webex CC
WEBEX_ACCESS_TOKEN=your_webex_token_here

# Slack
SLACK_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Zendesk
ZENDESK_DOMAIN=kidswear.zendesk.com
ZENDESK_API_TOKEN=your_zendesk_token

# GCP
GCP_PROJECT_ID=kidswear-cc
GCP_SERVICE_ACCOUNT=webex-cc-integration@kidswear.iam.gserviceaccount.com
```

**Load environment:**
```python
from dotenv import load_dotenv
import os

load_dotenv()

DB_PASSWORD = os.getenv('DB_PASSWORD')
SLACK_WEBHOOK = os.getenv('SLACK_WEBHOOK')
```

---

### **Database Connection Pool**

**Recommended:** Use connection pooling for production

```python
from psycopg2.pool import ThreadedConnectionPool

db_pool = ThreadedConnectionPool(
    minconn=5,
    maxconn=20,
    host=os.getenv('DB_HOST'),
    database=os.getenv('DB_NAME'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD')
)

# Get connection
conn = db_pool.getconn()

# ... use connection ...

# Return to pool
db_pool.putconn(conn)
```

---

### **Error Handling & Logging**

**Best Practice:** Use Python logging module

```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/cc-scripts.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

try:
# Your code
    logger.info('Alert engine started')
except Exception as e:
    logger.error(f'Error in alert engine: {e}', exc_info=True)
```

---

### **Testing Scripts**

**Unit Tests** (`tests/test_alert_engine.py`)
```python
import unittest
from monitoring.alert_engine import check_queue_wait_time

class TestAlertEngine(unittest.TestCase):
    
    def test_queue_wait_alert(self):
        """Test that alert fires when wait time exceeds threshold"""
# Mock database response
        mock_data = [('Sales', 135)]  # 135 seconds wait
        
        result = check_queue_wait_time(mock_data)
        
        self.assertTrue(result['alert_fired'])
        self.assertEqual(result['queue_name'], 'Sales')
    
    def test_no_alert_below_threshold(self):
        """Test that no alert fires when wait time is normal"""
        mock_data = [('Sales', 45)]  # 45 seconds wait
        
        result = check_queue_wait_time(mock_data)
        
        self.assertFalse(result['alert_fired'])

if __name__ == '__main__':
    unittest.main()
```

**Run tests:**
```bash
python3 -m pytest tests/
```

---

## Performance Optimization

### **Database Query Optimization**

**Use EXPLAIN ANALYZE:**
```sql
EXPLAIN ANALYZE
SELECT queue_name, calls_in_queue, agents_available
FROM queue_stats_realtime
WHERE timestamp > NOW() - INTERVAL '1 minute'
ORDER BY queue_name;
```

**Add Indexes:**
```sql
-- Index on timestamp for faster time-range queries
CREATE INDEX idx_queue_stats_timestamp ON queue_stats_realtime(timestamp DESC);

-- Composite index for common queries
CREATE INDEX idx_calls_start_queue ON calls(call_start_time DESC, queue_name);
```

**Use TimescaleDB Compression:**
```sql
-- Enable compression for data older than 7 days
ALTER TABLE queue_stats_realtime SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'queue_name'
);

SELECT add_compression_policy('queue_stats_realtime', INTERVAL '7 days');
```

---

### **Caching Strategy**

**Redis Caching:**
```python
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Cache queue stats for 10 seconds
def get_queue_stats():
    cached = redis_client.get('queue_stats')
    if cached:
        return json.loads(cached)
    
# Fetch from database
    stats = fetch_from_db()
    
# Cache result
    redis_client.setex('queue_stats', 10, json.dumps(stats))
    
    return stats
```

---

## Security Best Practices

### **1. API Token Rotation**

**Monthly Rotation Script:**
```bash
#!/bin/bash
# rotate_tokens.sh

# Rotate Webex CC token
NEW_WEBEX_TOKEN=$(curl -X POST https://webexapis.com/v1/access_token \
  -d "grant_type=refresh_token&refresh_token=$WEBEX_REFRESH_TOKEN")

# Update .env file
sed -i "s/WEBEX_ACCESS_TOKEN=.*/WEBEX_ACCESS_TOKEN=$NEW_WEBEX_TOKEN/" .env

# Restart services
systemctl restart cc-alerts
systemctl restart csat-api

echo "Tokens rotated successfully"
```

**Cron (1st of month):**
```bash
0 3 1 * * /opt/cc-dashboard/security/rotate_tokens.sh
```

---

### **2. Database Credentials**

**Use Secret Manager (GCP):**
```python
from google.cloud import secretmanager

def get_db_password():
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{PROJECT_ID}/secrets/db-password/versions/latest"
    response = client.access_secret_version(request={"name": name})
    return response.payload.data.decode("UTF-8")

DB_PASSWORD = get_db_password()
```

---

### **3. Audit Logging**

**Log All Script Executions:**
```python
import logging
from datetime import datetime

def log_execution(script_name, action, status):
    """Log script execution to audit table"""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    cur.execute("""
        INSERT INTO audit_log (timestamp, script_name, action, status, user)
        VALUES (NOW(), %s, %s, %s, %s)
    """, (script_name, action, status, os.getenv('USER')))
    
    conn.commit()
    cur.close()
    conn.close()

# Usage
log_execution('daily_report.py', 'Generate Report', 'SUCCESS')
```

---

## Additional Resources

### **Documentation**
- **Setup Guide:** `docs/SETUP.md`
- **API Reference:** `docs/API.md`
- **Troubleshooting:** `docs/TROUBLESHOOTING.md`

### **Dependencies**
```bash
# Python packages
pip install -r requirements.txt

# requirements.txt contents:
psycopg2-binary==2.9.9
pandas==2.1.3
numpy==1.26.2
matplotlib==3.8.2
requests==2.31.0
redis==5.0.1
flask==3.0.0
python-dotenv==1.0.0
scikit-learn==1.3.2
google-cloud-secret-manager==2.18.0
```

### **System Requirements**
- Python 3.9+
- PostgreSQL 15+
- Redis 7.2+
- Node.js 20+ (for dashboard API)
- Ubuntu 22.04 or later

---

## Troubleshooting

### **Common Issues**

**1. Script fails with "Module not found"**
```bash
# Install missing packages
pip install -r requirements.txt

# Verify installation
pip list | grep psycopg2
```

**2. Database connection errors**
```bash
# Test connection
psql -h localhost -U cc_admin -d cc_operations -c "SELECT 1"

# Check PostgreSQL service
systemctl status postgresql
```

**3. Cron jobs not running**
```bash
# Check cron logs
grep CRON /var/log/syslog

# Verify crontab
crontab -l

# Test script manually
/usr/bin/python3 /opt/cc-dashboard/reporting/daily_report.py
```

---

## Support

**Technical Issues:**
- Email: it-support@kidswear.com
- Slack: #cc-operations

**Bug Reports:**
- GitHub Issues: https://github.com/kidswear/cc-ops/issues

**Feature Requests:**
- Submit via CI meeting or Slack `/idea` command

---

**END OF SCRIPTS PACKAGE REFERENCE**
