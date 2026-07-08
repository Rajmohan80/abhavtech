# 7.5 Integration Testing & Validation

## 7.5.1 End-to-End Integration Test Scenarios

## Test Scenario Matrix

| Scenario ID | Test Case | Components Tested | Expected Outcome | Priority |
|-------------|-----------|-------------------|------------------|----------|
| **E2E-001** | Customer calls, VA handles, resolves | Entry Point → VA → Resolution | Call handled, no escalation | High |
| **E2E-002** | Customer calls, VA collects data, escalates | Entry Point → VA → Agent Queue | Context passed to agent | High |
| **E2E-003** | Customer calls, webhook fails, escalates | Entry Point → VA → Webhook → Fallback | Graceful degradation | High |
| **E2E-004** | Customer calls, no-match 3x, escalates | Entry Point → VA → Fallback → Agent | Escalation with reason | Medium |
| **E2E-005** | Predictive routing selects best agent | Entry Point → VA → ML API → Specific Agent | Routed to predicted agent | High |
| **E2E-006** | Multi-language support (Spanish) | Entry Point → VA (es-ES) → Resolution | Correct language handling | Medium |
| **E2E-007** | PII redaction in logs | Entry Point → VA → Logging | PII masked in Cloud Logging | High |
| **E2E-008** | High concurrent load (100 calls) | Entry Point → VA → Multiple | All calls handled | High |

## Detailed Test Case: E2E-001

**Test Case:** Customer Calls, VA Handles, Resolves

**Pre-conditions:**
- Dialogflow CX agent deployed and healthy
- Webex CC flow published
- Entry point configured
- Test phone number mapped

**Test Steps:**

| Step | Action | Expected Result | Actual Result | Pass/Fail |
|------|--------|-----------------|---------------|-----------|
| 1 | Dial contact center number | IVR greeting played | | □ |
| 2 | VA greeting: "How can I help you?" | VA engaged | | □ |
| 3 | User: "I want to pay my bill" | Intent: `billing.payment` matched (conf > 0.70) | | □ |
| 4 | VA: "How much would you like to pay?" | Parameter prompt | | □ |
| 5 | User: "One hundred fifty dollars" | Entity: $150.00 extracted | | □ |
| 6 | VA: "How would you like to pay?" | Parameter prompt | | □ |
| 7 | User: "Credit card" | Entity: `credit_card` extracted | | □ |
| 8 | Webhook called | Payment processed (< 3s) | | □ |
| 9 | VA: "Your payment of $150 has been processed. Confirmation: TXN-12345" | Confirmation with ID | | □ |
| 10 | VA: "Is there anything else?" | Continuation offered | | □ |
| 11 | User: "No, thank you" | Intent: `goodbye` matched | | □ |
| 12 | VA: "Thank you for calling. Goodbye!" | Call ends | | □ |

**Post-conditions:**
- Interaction logged in BigQuery
- PII redacted in logs
- Payment recorded in billing system
- Customer satisfaction survey sent (optional)

**Validation Points:**
```python
def validate_e2e_001(interaction_id):
    """Validate E2E-001 test case"""
    from google.cloud import bigquery
    
    client = bigquery.Client()
    
    # Check interaction logged
    query = f"""
        SELECT *
        FROM `project.dataset.interactions`
        WHERE interaction_id = '{interaction_id}'
    """
    result = client.query(query).result()
    interaction = list(result)[0]
    
    # Assertions
    assert interaction['handled_flag'] == 1, "Interaction not handled"
    assert interaction['escalated_flag'] == 0, "Incorrectly escalated"
    assert interaction['intent'] == 'billing.payment', "Wrong intent"
    assert interaction['payment_amount'] == 150.00, "Wrong amount"
    assert interaction['payment_status'] == 'completed', "Payment failed"
    
    # Check PII redaction
    log_query = f"""
        SELECT textPayload
        FROM `project.dataset.dialogflow_logs`
        WHERE labels.session_id = '{interaction_id}'
          AND textPayload LIKE '%credit card%'
    """
    logs = client.query(log_query).result()
    
    for log in logs:
        # Should not contain actual card numbers
        assert '4111' not in log.textPayload, "PII not redacted"
    
    print(f"E2E-001 validation passed for {interaction_id}")
```

---

## 7.5.2 Performance and Load Testing

## Load Testing Strategy

**Test Phases:**

| Phase | Duration | Concurrent Users | Ramp-Up | Goal |
|-------|----------|------------------|---------|------|
| **Smoke Test** | 5 min | 10 | Immediate | Verify basic functionality |
| **Load Test** | 30 min | 50 | 5 min | Normal operating conditions |
| **Stress Test** | 60 min | 100 | 10 min | Peak load conditions |
| **Spike Test** | 30 min | 200 (spike) | Instant | Handle sudden surges |
| **Soak Test** | 4 hours | 50 | 10 min | Sustained load stability |

## Load Testing Implementation

**Using Locust (Python):**

```python
from locust import HttpUser, task, between
import json
import random

class DialogflowLoadTest(HttpUser):
    wait_time = between(5, 15)  # Time between requests
    
    def on_start(self):
        """Called once per user at start"""
        self.session_id = f"load-test-{random.randint(1000, 9999)}"
        self.project_id = "your-project-id"
        self.location = "us-central1"
        self.agent_id = "your-agent-id"
    
    @task(5)  # Weight: 5
    def billing_inquiry(self):
        """Test billing inquiry conversation"""
        self.detect_intent("I want to pay my bill")
        self.detect_intent("One hundred fifty dollars")
        self.detect_intent("Credit card")
    
    @task(3)  # Weight: 3
    def technical_support(self):
        """Test technical support conversation"""
        self.detect_intent("I have no internet connection")
        self.detect_intent("Yes, I tried restarting")
        self.detect_intent("Still not working")
    
    @task(2)  # Weight: 2
    def general_inquiry(self):
        """Test general inquiry"""
        self.detect_intent("What are your business hours?")
    
    def detect_intent(self, text):
        """Call Dialogflow API"""
        url = (
            f"https://{self.location}-dialogflow.googleapis.com/v3/"
            f"projects/{self.project_id}/locations/{self.location}/"
            f"agents/{self.agent_id}/sessions/{self.session_id}:detectIntent"
        )
        
        headers = {
            "Authorization": f"Bearer {self.get_access_token()}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "queryInput": {
                "text": {"text": text},
                "languageCode": "en-US"
            }
        }
        
        with self.client.post(
            url,
            json=payload,
            headers=headers,
            catch_response=True,
            name="detectIntent"
        ) as response:
            if response.status_code == 200:
                result = response.json()
                # Validate response
                if 'queryResult' in result:
                    response.success()
                else:
                    response.failure("Invalid response structure")
            else:
                response.failure(f"HTTP {response.status_code}")
    
    def get_access_token(self):
        """Get OAuth token (cached)"""
        # Implementation to get and cache access token
        pass

## Run load test:
## locust -f dialogflow_load_test.py --host=https://dialogflow.googleapis.com
```

**Performance Targets:**

| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| **Response Time (p50)** | < 1s | < 2s | < 3s |
| **Response Time (p95)** | < 2s | < 3s | < 5s |
| **Response Time (p99)** | < 3s | < 5s | < 10s |
| **Success Rate** | > 99.5% | > 99% | > 95% |
| **Concurrent Sessions** | 100+ | 50+ | 25+ |
| **Throughput** | 50 req/s | 30 req/s | 15 req/s |

---

## 7.5.3 Security Validation

## Security Test Cases

| Test ID | Test Case | Method | Expected Result | Status |
|---------|-----------|--------|-----------------|--------|
| **SEC-001** | PII redaction in logs | Log inspection | All PII masked | □ |
| **SEC-002** | TLS encryption | Network capture | TLS 1.2+ used | □ |
| **SEC-003** | Authentication validation | Invalid token test | 401 Unauthorized | □ |
| **SEC-004** | Injection attack prevention | SQL/XSS payloads | Input sanitized | □ |
| **SEC-005** | Rate limiting | Excessive requests | 429 Too Many Requests | □ |
| **SEC-006** | Data retention policy | Time-based deletion | Data purged after TTL | □ |
| **SEC-007** | Webhook authentication | Unsigned requests | Rejected | □ |
| **SEC-008** | GDPR data access | User data request | Complete data export | □ |

## Security Validation Scripts

**Test PII Redaction:**

```python
from google.cloud import logging_v2
import re

def test_pii_redaction():
    """Verify PII is redacted in Cloud Logging"""
    client = logging_v2.Client()
    logger = client.logger('dialogflow')
    
    # Fetch recent logs
    filter_str = '''
        resource.type="dialogflow.googleapis.com/Agent"
        AND timestamp >= "2023-06-15T00:00:00Z"
    '''
    
    entries = client.list_entries(filter_=filter_str, max_results=100)
    
    pii_patterns = {
        'phone': r'\d{3}-\d{3}-\d{4}',
        'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
        'ssn': r'\d{3}-\d{2}-\d{4}',
        'credit_card': r'\d{4}-\d{4}-\d{4}-\d{4}'
    }
    
    violations = []
    
    for entry in entries:
        text = str(entry.payload)
        
        for pii_type, pattern in pii_patterns.items():
            matches = re.findall(pattern, text)
            if matches:
                violations.append({
                    'timestamp': entry.timestamp,
                    'pii_type': pii_type,
                    'matches': matches
                })
    
    if violations:
        print(f"❌ PII REDACTION FAILED: {len(violations)} violations found")
        for v in violations:
            print(f"  - {v['pii_type']}: {v['matches']} at {v['timestamp']}")
        return False
    else:
        print("✅ PII REDACTION PASSED: No PII found in logs")
        return True

test_pii_redaction()
```

**Test TLS Encryption:**

```python
import ssl
import socket

def test_tls_encryption(hostname, port=443):
    """Verify TLS 1.2+ is used"""
    context = ssl.create_default_context()
    
    with socket.create_connection((hostname, port)) as sock:
        with context.wrap_socket(sock, server_hostname=hostname) as ssock:
            protocol = ssock.version()
            cipher = ssock.cipher()
            
            print(f"Protocol: {protocol}")
            print(f"Cipher: {cipher}")
            
            if protocol in ['TLSv1.2', 'TLSv1.3']:
                print("✅ TLS ENCRYPTION PASSED")
                return True
            else:
                print(f"❌ TLS ENCRYPTION FAILED: Using {protocol}")
                return False

test_tls_encryption('dialogflow.googleapis.com')
```

---

## 7.5.4 Monitoring and Observability

## Key Metrics Dashboard

**Dialogflow CX Metrics:**

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| **Intent Match Rate** | % of user inputs matched to intents | < 80% |
| **Average Confidence Score** | Avg confidence of matched intents | < 0.75 |
| **Conversation Duration** | Avg time per conversation | > 5 minutes |
| **Escalation Rate** | % of conversations escalated to agent | > 40% |
| **Webhook Success Rate** | % of successful webhook calls | < 99% |
| **Webhook Latency (p95)** | 95th percentile webhook response time | > 3 seconds |

**Webex CC Metrics:**

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| **Virtual Agent Containment** | % handled without agent | < 50% |
| **Average Speed of Answer** | Time to agent answer | > 30 seconds |
| **Service Level (80/20)** | 80% answered in 20 seconds | < 80% |
| **First Call Resolution** | % resolved on first contact | < 70% |
| **Agent Utilization** | % time agents are occupied | < 70% or > 95% |

**Predictive Routing Metrics:**

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| **Prediction Latency** | Time to get ML prediction | > 500ms |
| **Prediction Confidence** | Avg ML confidence score | < 0.75 |
| **AI-Routed FCR** | FCR for AI-routed calls | < Traditional FCR |
| **Model Accuracy** | Predicted vs actual FCR | < 75% |

## Monitoring Setup

**Cloud Monitoring Dashboard:**

```yaml
displayName: "Contact Center AI Monitoring"
mosaicLayout:
  columns: 12
  tiles:
    - width: 6
      height: 4
      widget:
        title: "Dialogflow Intent Match Rate"
        xyChart:
          dataSets:
            - timeSeriesQuery:
                timeSeriesFilter:
                  filter: 'metric.type="dialogflow.googleapis.com/intent_match_rate"'
          yAxis:
            label: "Match Rate %"
            scale: LINEAR
    
    - width: 6
      height: 4
      widget:
        title: "Webhook Latency (p95)"
        xyChart:
          dataSets:
            - timeSeriesQuery:
                timeSeriesFilter:
                  filter: 'metric.type="dialogflow.googleapis.com/webhook_latency"'
                  aggregation:
                    perSeriesAligner: ALIGN_PERCENTILE_95
          yAxis:
            label: "Latency (ms)"
    
    - width: 6
      height: 4
      widget:
        title: "Predictive Routing Accuracy"
        xyChart:
          dataSets:
            - timeSeriesQuery:
                timeSeriesFilter:
                  filter: 'metric.type="custom.googleapis.com/predictive_routing/accuracy"'
          yAxis:
            label: "Accuracy %"
```

**Alerting Policies:**

```python
from google.cloud import monitoring_v3

def create_alert_policy():
    """Create alert for high webhook latency"""
    client = monitoring_v3.AlertPolicyServiceClient()
    project_name = f"projects/your-project-id"
    
    alert_policy = monitoring_v3.AlertPolicy(
        display_name="High Webhook Latency",
        conditions=[
            monitoring_v3.AlertPolicy.Condition(
                display_name="Webhook latency > 3 seconds",
                condition_threshold=monitoring_v3.AlertPolicy.Condition.MetricThreshold(
                    filter='metric.type="dialogflow.googleapis.com/webhook_latency"',
                    comparison=monitoring_v3.ComparisonType.COMPARISON_GT,
                    threshold_value=3000,
                    duration={"seconds": 300},  # For 5 minutes
                    aggregations=[
                        monitoring_v3.Aggregation(
                            alignment_period={"seconds": 60},
                            per_series_aligner=monitoring_v3.Aggregation.Aligner.ALIGN_PERCENTILE_95
                        )
                    ]
                )
            )
        ],
        notification_channels=[
            'projects/your-project-id/notificationChannels/email_channel',
            'projects/your-project-id/notificationChannels/pagerduty_channel'
        ],
        alert_strategy=monitoring_v3.AlertPolicy.AlertStrategy(
            auto_close={"seconds": 3600}  # Auto-close after 1 hour
        )
    )
    
    policy = client.create_alert_policy(
        name=project_name,
        alert_policy=alert_policy
    )
    
    print(f"Alert policy created: {policy.name}")
```

---

## 7.5.5 Compliance Testing

## GDPR Compliance Validation

| Requirement | Test | Validation Method | Status |
|-------------|------|-------------------|--------|
| **Right to Access** | User requests their data | API returns all stored data | □ |
| **Right to Erasure** | User requests data deletion | Data deleted within 30 days | □ |
| **Data Minimization** | Only necessary data collected | Review data collection practices | □ |
| **Consent Management** | Explicit consent required | Verify consent capture | □ |
| **Data Portability** | User exports their data | Export in machine-readable format | □ |
| **Breach Notification** | Simulated breach | Notification within 72 hours | □ |

## PCI-DSS Compliance (if handling payments)

| Requirement | Control | Validation | Status |
|-------------|---------|------------|--------|
| **Build and Maintain Secure Network** | Firewall rules, network segmentation | Penetration test | □ |
| **Protect Cardholder Data** | Encryption (TLS 1.2+), tokenization | Data flow audit | □ |
| **Maintain Vulnerability Management** | Patching, antivirus | Vulnerability scan | □ |
| **Implement Strong Access Control** | MFA, least privilege | Access review | □ |
| **Regularly Monitor and Test Networks** | Logging, SIEM integration | Log review | □ |
| **Maintain Information Security Policy** | Documented policies | Policy review | □ |

**Compliance Automation:**

```python
def run_gdpr_compliance_test():
    """Automated GDPR compliance testing"""
    
    test_results = {}
    
    # Test 1: Right to Access
    test_results['right_to_access'] = test_right_to_access('test_user_123')
    
    # Test 2: Right to Erasure
    test_results['right_to_erasure'] = test_right_to_erasure('test_user_456')
    
    # Test 3: Data Retention
    test_results['data_retention'] = test_data_retention()
    
    # Test 4: PII Redaction
    test_results['pii_redaction'] = test_pii_redaction()
    
    # Generate compliance report
    generate_compliance_report(test_results)
    
    return all(test_results.values())

def test_right_to_access(user_id):
    """Test user data access request"""
    from google.cloud import bigquery
    
    client = bigquery.Client()
    
    # Query all user data
    query = f"""
        SELECT *
        FROM `project.dataset.interactions`
        WHERE customer_id = '{user_id}'
    """
    
    result = client.query(query).result()
    data = [dict(row) for row in result]
    
    # Verify data returned
    if len(data) > 0:
        print(f"✅ Right to Access: Found {len(data)} records for {user_id}")
        return True
    else:
        print(f"❌ Right to Access: No data found for {user_id}")
        return False
```

---

