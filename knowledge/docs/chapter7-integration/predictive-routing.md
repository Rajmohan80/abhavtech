# 7.4 Predictive Routing Implementation

## 7.4.1 GCP AI Integration Architecture

## Overview of Predictive Routing

Predictive routing uses AI and machine learning to match customers with the most appropriate agent based on real-time data and historical patterns, improving first-call resolution and customer satisfaction.

**Traditional vs. Predictive Routing:**

| Aspect | Traditional Routing | Predictive Routing |
|--------|---------------------|-------------------|
| **Logic** | Static rules (skill-based, round-robin) | ML models analyzing multiple factors |
| **Data Used** | Agent skills, availability | Skills + performance + customer history + sentiment |
| **Optimization** | Manual rule adjustments | Continuous model retraining |
| **Personalization** | Limited (language, VIP status) | High (individual customer + agent pairing) |
| **Adaptability** | Slow (requires rule changes) | Fast (models adapt to patterns) |
| **FCR Impact** | Baseline | 15-30% improvement |

## Architecture Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    Webex Contact Center                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Flow Designer                                              │ │
│  │  ┌──────────────┐    ┌──────────────┐    ┌─────────────┐  │ │
│  │  │ Virtual Agent│───▶│  Predictive  │───▶│   Queue to  │  │ │
│  │  │    Output    │    │   Routing    │    │    Agent    │  │ │
│  │  │              │    │   Activity   │    │             │  │ │
│  │  └──────────────┘    └──────┬───────┘    └─────────────┘  │ │
│  └────────────────────────────────┼────────────────────────────┘ │
│                                   │                               │
└───────────────────────────────────┼───────────────────────────────┘
                                    │
                         HTTPS/REST API
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                         │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  AI/ML Services                                             │ │
│  │  ┌──────────────────┐  ┌────────────────────────────────┐  │ │
│  │  │ Vertex AI        │  │ BigQuery ML                     │  │ │
│  │  │ • Model Training │  │ • Agent Performance Analysis    │  │ │
│  │  │ • Predictions    │  │ • Customer Journey Analytics    │  │ │
│  │  │ • Auto-tuning    │  │ • Outcome Tracking              │  │ │
│  │  └──────────────────┘  └────────────────────────────────┘  │ │
│  │                                                              │ │
│  │  ┌──────────────────┐  ┌────────────────────────────────┐  │ │
│  │  │ Dataflow         │  │ Cloud Functions                 │  │ │
│  │  │ • Real-time ETL  │  │ • Scoring API                   │  │ │
│  │  │ • Feature Eng    │  │ • Webhook Integration           │  │ │
│  │  └──────────────────┘  └────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Data Storage                                               │ │
│  │  ┌──────────────────┐  ┌────────────────────────────────┐  │ │
│  │  │ BigQuery         │  │ Cloud Storage                   │  │ │
│  │  │ • Historical     │  │ • Model Artifacts               │  │ │
│  │  │   Interactions   │  │ • Training Data                 │  │ │
│  │  │ • Agent Metrics  │  │ • Feature Store                 │  │ │
│  │  └──────────────────┘  └────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │  External Data Sources   │
              │  • CRM (Customer Data)   │
              │  • WFM (Agent Schedule)  │
              │  • Product Catalog       │
              │  • Knowledge Base        │
              └──────────────────────────┘
```

## Data Pipeline Architecture

**Data Collection:**

```
Contact Center Interactions
         │
         ├─→ Call Metadata (duration, outcome, transfers)
         ├─→ Customer Data (history, sentiment, value)
         ├─→ Agent Data (skills, performance, availability)
         ├─→ Contextual Data (time, channel, queue, intent)
         │
         ▼
   ┌──────────────────┐
   │  Data Ingestion  │
   │  (Cloud Pub/Sub) │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │    Dataflow      │
   │  • Clean data    │
   │  • Transform     │
   │  • Enrich        │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │    BigQuery      │
   │  • Data warehouse│
   │  • Analytics     │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │   Feature Eng    │
   │  • Create        │
   │    features      │
   │  • Aggregations  │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │   Model Training │
   │  (Vertex AI)     │
   │  • Train models  │
   │  • Evaluate      │
   │  • Deploy        │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │   Prediction API │
   │  (Cloud Function)│
   │  • Real-time     │
   │    scoring       │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │ Webex CC Routing │
   │  • Apply scores  │
   │  • Queue agents  │
   └──────────────────┘
```

---

## 7.4.2 Predictive Routing Models and Algorithms

## Feature Engineering

**Customer Features:**

| Feature Category | Features | Source |
|------------------|----------|--------|
| **Demographics** | Age, location, account type, tenure | CRM |
| **Interaction History** | Total calls (30/90/365 days), FCR rate, average handle time | Webex CC Analyzer |
| **Behavioral** | Time since last contact, escalation frequency, self-service usage | Webex CC + Digital channels |
| **Value** | Lifetime value (LTV), monthly spend, churn risk score | Billing + ML model |
| **Sentiment** | Current sentiment (VA), historical sentiment trend | Dialogflow CX + Analytics |
| **Intent** | Detected intent from VA, issue complexity | Dialogflow CX |

**Agent Features:**

| Feature Category | Features | Source |
|------------------|----------|--------|
| **Skills** | Primary skills, secondary skills, certifications | Webex CC |
| **Performance** | FCR rate, CSAT score, AHT, transfer rate | Webex CC Analyzer |
| **Availability** | Current state, break schedule, shift end time | Webex CC |
| **Workload** | Current # interactions, queue depth | Webex CC Real-time |
| **Specialization** | Issue type expertise, product knowledge | Historical resolution data |
| **Compatibility** | Customer segment affinity, language proficiency | Matched outcome analysis |

**Contextual Features:**

| Feature Category | Features | Source |
|------------------|----------|--------|
| **Temporal** | Hour of day, day of week, holiday indicator | System |
| **Operational** | Queue wait time, SLA buffer, agent availability | Webex CC |
| **Channel** | Voice, chat, email, social | Webex CC |

## ML Model Selection

**Model Options:**

```
1. Gradient Boosting (XGBoost / LightGBM)
   ✓ Pros: High accuracy, handles non-linear relationships, feature importance
   ✓ Use Case: Predicting best agent match score
   
2. Random Forest
   ✓ Pros: Robust, handles missing data, less overfitting
   ✓ Use Case: Binary classification (escalation prediction)
   
3. Neural Networks (Deep Learning)
   ✓ Pros: Captures complex patterns, scales with data
   ✓ Use Case: Multi-modal data (text + voice + metadata)
   
4. Collaborative Filtering
   ✓ Pros: Learns customer-agent affinity patterns
   ✓ Use Case: Agent recommendation system
```

**Recommended Approach:** Ensemble of XGBoost + Neural Network

## Model Training Pipeline

**Step 1: Data Preparation**

```sql
-- BigQuery SQL for training data
CREATE OR REPLACE TABLE `project.dataset.training_data` AS
WITH customer_features AS (
  SELECT
    customer_id,
    COUNT(*) as interaction_count_30d,
    AVG(handle_time) as avg_handle_time,
    AVG(csat_score) as avg_csat,
    MAX(TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), interaction_time, DAY)) as days_since_last_contact
  FROM `project.dataset.interactions`
  WHERE interaction_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
  GROUP BY customer_id
),
agent_features AS (
  SELECT
    agent_id,
    AVG(fcr_flag) as fcr_rate,
    AVG(csat_score) as avg_agent_csat,
    AVG(handle_time) as avg_agent_aht,
    COUNT(DISTINCT issue_type) as issue_type_diversity
  FROM `project.dataset.interactions`
  WHERE interaction_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
  GROUP BY agent_id
)
SELECT
  i.interaction_id,
  i.customer_id,
  i.agent_id,
  i.fcr_flag as target,  -- What we're predicting
  
  -- Customer features
  cf.interaction_count_30d,
  cf.avg_handle_time as customer_avg_aht,
  cf.avg_csat as customer_avg_csat,
  cf.days_since_last_contact,
  
  -- Agent features
  af.fcr_rate as agent_fcr_rate,
  af.avg_agent_csat,
  af.avg_agent_aht,
  af.issue_type_diversity,
  
  -- Contextual features
  EXTRACT(HOUR FROM i.interaction_time) as hour_of_day,
  EXTRACT(DAYOFWEEK FROM i.interaction_time) as day_of_week,
  i.queue_wait_time,
  i.issue_type,
  i.channel
  
FROM `project.dataset.interactions` i
LEFT JOIN customer_features cf ON i.customer_id = cf.customer_id
LEFT JOIN agent_features af ON i.agent_id = af.agent_id
WHERE i.interaction_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 365 DAY)
  AND i.agent_id IS NOT NULL  -- Only completed interactions
```

**Step 2: Model Training (Python with Vertex AI)**

```python
from google.cloud import aiplatform
from sklearn.model_selection import train_test_split
import xgboost as xgb
import pandas as pd

def train_routing_model():
    # Initialize Vertex AI
    aiplatform.init(project='your-project-id', location='us-central1')
    
    # Load training data from BigQuery
    query = """
        SELECT * FROM `project.dataset.training_data`
        WHERE target IS NOT NULL
    """
    df = pd.read_gbq(query, project_id='your-project-id')
    
    # Prepare features and target
    feature_columns = [
        'interaction_count_30d', 'customer_avg_aht', 'customer_avg_csat',
        'days_since_last_contact', 'agent_fcr_rate', 'avg_agent_csat',
        'avg_agent_aht', 'issue_type_diversity', 'hour_of_day',
        'day_of_week', 'queue_wait_time'
    ]
    
    X = df[feature_columns]
    y = df['target']  # FCR flag (1 = resolved, 0 = not resolved)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Train XGBoost model
    model = xgb.XGBClassifier(
        max_depth=6,
        learning_rate=0.1,
        n_estimators=100,
        objective='binary:logistic',
        eval_metric='auc'
    )
    
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=True
    )
    
    # Evaluate model
    from sklearn.metrics import accuracy_score, roc_auc_score
    
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    accuracy = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, y_pred_proba)
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"AUC: {auc:.4f}")
    
    # Feature importance
    importance_df = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\nTop Features:")
    print(importance_df.head(10))
    
    # Save model to Vertex AI
    model_artifact_uri = 'gs://your-bucket/models/routing-model'
    
    model_upload = aiplatform.Model.upload(
        display_name='routing-model-v1',
        artifact_uri=model_artifact_uri,
        serving_container_image_uri='us-docker.pkg.dev/vertex-ai/prediction/xgboost-cpu.1-4:latest'
    )
    
    print(f"Model uploaded: {model_upload.resource_name}")
    
    return model

## Train model
trained_model = train_routing_model()
```

**Step 3: Model Deployment**

```python
def deploy_model(model):
    """Deploy model to Vertex AI endpoint"""
    
    endpoint = aiplatform.Endpoint.create(
        display_name='routing-prediction-endpoint',
        project='your-project-id',
        location='us-central1'
    )
    
    model.deploy(
        endpoint=endpoint,
        deployed_model_display_name='routing-model-v1',
        machine_type='n1-standard-4',
        min_replica_count=1,
        max_replica_count=10,
        traffic_percentage=100
    )
    
    print(f"Model deployed to endpoint: {endpoint.resource_name}")
    return endpoint

deployed_endpoint = deploy_model(trained_model)
```

## Real-Time Prediction API

**Cloud Function for Real-Time Scoring:**

```python
from google.cloud import aiplatform
import functions_framework
import json

## Initialize once (cold start)
aiplatform.init(project='your-project-id', location='us-central1')
endpoint = aiplatform.Endpoint('projects/.../endpoints/...')

@functions_framework.http
def predict_best_agent(request):
    """
    HTTP Cloud Function for predicting best agent match
    
    Request body:
    {
        "customer_id": "C12345",
        "issue_type": "billing",
        "sentiment": "frustrated",
        "channel": "voice",
        "available_agents": ["A001", "A002", "A003"]
    }
    """
    request_json = request.get_json()
    
    customer_id = request_json['customer_id']
    issue_type = request_json['issue_type']
    available_agents = request_json['available_agents']
    
    # Fetch customer features from BigQuery
    customer_features = get_customer_features(customer_id)
    
    # Score each available agent
    agent_scores = []
    for agent_id in available_agents:
        # Fetch agent features
        agent_features = get_agent_features(agent_id)
        
        # Prepare instance for prediction
        instance = {
            'interaction_count_30d': customer_features['interaction_count_30d'],
            'customer_avg_aht': customer_features['avg_handle_time'],
            'customer_avg_csat': customer_features['avg_csat'],
            'days_since_last_contact': customer_features['days_since_last_contact'],
            'agent_fcr_rate': agent_features['fcr_rate'],
            'avg_agent_csat': agent_features['avg_csat'],
            'avg_agent_aht': agent_features['avg_aht'],
            'issue_type_diversity': agent_features['issue_type_diversity'],
            'hour_of_day': get_current_hour(),
            'day_of_week': get_current_day_of_week(),
            'queue_wait_time': request_json.get('queue_wait_time', 0)
        }
        
        # Get prediction from Vertex AI
        prediction = endpoint.predict(instances=[instance])
        fcr_probability = prediction.predictions[0][1]  # Probability of FCR=1
        
        agent_scores.append({
            'agent_id': agent_id,
            'score': fcr_probability,
            'agent_name': agent_features['name'],
            'skills': agent_features['skills']
        })
    
    # Sort by score (highest first)
    agent_scores.sort(key=lambda x: x['score'], reverse=True)
    
    return {
        'recommended_agents': agent_scores,
        'best_match': agent_scores[0],
        'model_version': 'v1',
        'prediction_time': get_timestamp()
    }

def get_customer_features(customer_id):
    """Fetch customer features from BigQuery"""
    from google.cloud import bigquery
    
    client = bigquery.Client()
    query = f"""
        SELECT
            COUNT(*) as interaction_count_30d,
            AVG(handle_time) as avg_handle_time,
            AVG(csat_score) as avg_csat,
            MAX(TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), interaction_time, DAY)) as days_since_last_contact
        FROM `project.dataset.interactions`
        WHERE customer_id = '{customer_id}'
          AND interaction_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
    """
    
    result = client.query(query).result()
    for row in result:
        return dict(row)
    
    # Return defaults if no history
    return {
        'interaction_count_30d': 0,
        'avg_handle_time': 300,
        'avg_csat': 3.5,
        'days_since_last_contact': 999
    }

def get_agent_features(agent_id):
    """Fetch agent features from BigQuery"""
    from google.cloud import bigquery
    
    client = bigquery.Client()
    query = f"""
        SELECT
            agent_id,
            agent_name as name,
            AVG(fcr_flag) as fcr_rate,
            AVG(csat_score) as avg_csat,
            AVG(handle_time) as avg_aht,
            COUNT(DISTINCT issue_type) as issue_type_diversity,
            STRING_AGG(DISTINCT skill, ', ') as skills
        FROM `project.dataset.interactions` i
        JOIN `project.dataset.agent_skills` s ON i.agent_id = s.agent_id
        WHERE i.agent_id = '{agent_id}'
          AND interaction_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
        GROUP BY agent_id, agent_name
    """
    
    result = client.query(query).result()
    for row in result:
        return dict(row)
    
    return None
```

---

## 7.4.3 Media Path Design (RTP via Webex vs GCP)

## Media Path Options

**Option 1: Direct RTP via Webex (Recommended)**

```
Customer
    │
    ├─── RTP/SRTP ──────────────────┐
    │                                │
    ▼                                ▼
Webex Media Resources          Dialogflow CX
(Regional SBC)                 (Speech APIs)
    │                                │
    │◄──── Optimized Media ──────────┘
    │      (ICE, STUN)
    │
    ▼
Agent Endpoint
```

**Pros:**
- Lower latency (direct path)
- Regional media optimization
- Native ICE/STUN support
- Cisco-managed infrastructure

**Cons:**
- Less flexibility for custom audio processing
- Limited access to raw audio streams

**Option 2: RTP via GCP Media Processing**

```
Customer
    │
    ├─── RTP/SRTP ────────────────────┐
    │                                  │
    ▼                                  ▼
Webex Media Resources            GCP Media Gateway
    │                            (Cloud Media API)
    │                                  │
    │                                  ▼
    │                        Custom Audio Processing
    │                        • Noise reduction
    │                        • Audio enhancement
    │                        • Real-time transcription
    │                                  │
    │◄─────── Processed Media ─────────┘
    │
    ▼
Agent Endpoint
```

**Pros:**
- Custom audio processing
- Advanced analytics
- ML-based enhancements

**Cons:**
- Higher latency (additional hop)
- More complex setup
- Additional costs

## ICE Media Path Optimization

**Interactive Connectivity Establishment (ICE):**

```
Endpoint A (Agent)          STUN Server           Endpoint B (Customer)
     │                      (Webex Cloud)                  │
     │                           │                         │
     │──── STUN Request ────────▶│                         │
     │◄─── Public IP ────────────┤                         │
     │                           │                         │
     │                           │◄──── STUN Request ──────│
     │                           │───── Public IP ────────▶│
     │                           │                         │
     │◄────── Candidate Exchange (SDP) ───────────────────▶│
     │                           │                         │
     │────── Connectivity Checks (STUN Binding) ─────────▶│
     │◄───── Connectivity Checks ──────────────────────────│
     │                           │                         │
     │◄════════ Direct RTP Media Path ═══════════════════▶│
     │          (Bypasses Webex Cloud)                     │
```

**Benefits:**
- Reduced latency (50-100ms improvement)
- Lower bandwidth on cloud infrastructure
- Better call quality

**Configuration in Webex CC:**

```
Entry Point → Virtual Agent V2 Activity
├── Enable Media Optimization: TRUE
├── ICE Candidate Policy: ALL
└── STUN Server: auto (Webex-managed)
```

**Verification:**

```bash
## Check if ICE is enabled for Local Gateway
show voice service voip
  media-path-optimization ice lite

## Verify STUN binding
show stun binding statistics
```

## Latency Budget

**Target Latency Components:**

| Hop | Component | Target | Acceptable |
|-----|-----------|--------|------------|
| 1 | Customer → PSTN | 10-20ms | < 50ms |
| 2 | PSTN → Webex SBC | 10-30ms | < 50ms |
| 3 | SBC → Dialogflow CX | 20-40ms | < 80ms |
| 4 | Speech-to-Text Processing | 100-200ms | < 300ms |
| 5 | NLU Processing | 50-100ms | < 200ms |
| 6 | Webhook (if used) | < 1000ms | < 3000ms |
| 7 | Text-to-Speech | 100-200ms | < 300ms |
| 8 | Response → Customer | 30-50ms | < 80ms |
| **Total** | **320-640ms** | **< 1000ms** |

---

## 7.4.4 Latency Optimization Strategies

## 1. Geographic Distribution

**Deploy Resources Closer to Users:**

```
North America Users
    ├─→ Webex US Region (Oregon)
    └─→ GCP us-central1 (Iowa) ✓ Low latency

European Users
    ├─→ Webex EU Region (London)
    └─→ GCP europe-west2 (London) ✓ Low latency

Asia-Pacific Users
    ├─→ Webex APAC Region (Sydney)
    └─→ GCP australia-southeast1 (Sydney) ✓ Low latency
```

**Dialogflow CX Regional Endpoints:**

| Region | Endpoint | Use For |
|--------|----------|---------|
| **Global** | `dialogflow.googleapis.com` | Default, US-based |
| **US** | `us-dialogflow.googleapis.com` | North America |
| **EU** | `eu-dialogflow.googleapis.com` | Europe |
| **APAC** | `asia-northeast1-dialogflow.googleapis.com` | Asia-Pacific |

**Configuration:**

```python
from google.cloud import dialogflow_cx_v3

## Use regional endpoint
client = dialogflow_cx_v3.SessionsClient(
    client_options={
        'api_endpoint': 'europe-west2-dialogflow.googleapis.com'
    }
)
```

## 2. Caching Strategies

**Cache Frequently Accessed Data:**

```python
from google.cloud import memorystore
import redis

## Initialize Redis (Memorystore)
redis_client = redis.Redis(
    host='10.0.0.3',  # Memorystore instance
    port=6379,
    db=0
)

def get_customer_data(customer_id):
    """Get customer data with caching"""
    cache_key = f"customer:{customer_id}"
    
    # Try cache first
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)
    
    # Cache miss - fetch from database
    customer_data = fetch_from_bigquery(customer_id)
    
    # Store in cache (TTL: 5 minutes)
    redis_client.setex(
        cache_key,
        300,
        json.dumps(customer_data)
    )
    
    return customer_data
```

**What to Cache:**

| Data Type | Cache Duration | Reason |
|-----------|----------------|--------|
| **Customer Profile** | 5-10 minutes | Changes infrequently |
| **Agent Skills** | 30 minutes | Mostly static |
| **ML Model Predictions** | 1 minute | Context-dependent |
| **Product Catalog** | 1 hour | Updated periodically |
| **FAQ Responses** | 24 hours | Static content |

## 3. Asynchronous Processing

**Webhook Pattern:**

```javascript
// Synchronous (Slow)
app.post('/dialogflow', async (req, res) => {
  const result = await longRunningOperation();  // 5 seconds
  res.json(result);  // Total: 5+ seconds
});

// Asynchronous (Fast)
app.post('/dialogflow', async (req, res) => {
  // Immediate response
  res.json({
    fulfillment_response: {
      messages: [{
        text: {
          text: ["I'm processing your request. One moment please..."]
        }
      }]
    }
  });
  
  // Process in background
  processAsync(req.body).then(result => {
    // Send result via custom event or follow-up
    sendCustomEvent(req.body.sessionInfo.session, result);
  });
});
```

## 4. Connection Pooling

**Database Connection Pooling:**

```python
from google.cloud import bigquery
from google.cloud.bigquery import dbapi

## Create connection pool (reuse connections)
connection_pool = dbapi.connect(
    project='your-project-id',
    location='us-central1',
    pool_size=10,  # Number of connections
    pool_pre_ping=True  # Verify connections before use
)

def query_with_pool(query):
    """Execute query using connection pool"""
    cursor = connection_pool.cursor()
    cursor.execute(query)
    return cursor.fetchall()
```

## 5. Optimize Dialogflow CX Agent

**Reduce Intent Matching Time:**

```
Best Practices:
├── Keep training phrases concise (< 15 words)
├── Limit intents to < 100 per flow
├── Use pre-built entities instead of custom when possible
├── Avoid regex entities for simple matches
└── Use mega agents for > 100 intents
```

**Optimize Webhook Calls:**

```
Reduce Webhook Usage:
├── Use static fulfillments when possible
├── Batch API calls (1 webhook with multiple operations)
├── Pre-fetch data at flow start (store in session params)
└── Use conditional webhook triggers (only when needed)
```

---

## 7.4.5 AI Fallback Behavior and Graceful Degradation

## Fallback Hierarchy

```
Level 1: No-Match/No-Input Handling
    ├─ Attempt 1: Clarify user intent
    ├─ Attempt 2: Provide specific options
    └─ Attempt 3: Escalate to live agent

Level 2: Webhook Failure
    ├─ Retry (1-2 attempts with exponential backoff)
    ├─ Use cached data if available
    ├─ Provide generic response
    └─ Escalate to live agent

Level 3: NLU Confidence Low (< 0.70)
    ├─ Ask clarifying questions
    ├─ Use generative fallback (if enabled)
    └─ Escalate to live agent

Level 4: System Errors (Dialogflow/GCP)
    ├─ Return to main menu
    ├─ Offer callback option
    └─ Immediate escalation to live agent
```

## Implementation Patterns

**No-Match Handling:**

```
Page: BillingPaymentPage
├── Event Handler: sys.no-match-1
│   └── Fulfillment: "I didn't quite catch that. How much would you like to pay today?"
│
├── Event Handler: sys.no-match-2
│   └── Fulfillment: "I'm having trouble understanding the amount. You can say something like '$100' or 'one hundred dollars'."
│
└── Event Handler: sys.no-match-3
    ├── Fulfillment: "I want to make sure you get the right help. Let me connect you to a billing specialist."
    └── Transition: EscalationPage (with context)
```

**Webhook Failure Graceful Degradation:**

```javascript
async function callWebhookWithFallback(webhookUrl, data) {
  const maxRetries = 2;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await axios.post(webhookUrl, data, {
        timeout: 5000  // 5 second timeout
      });
      
      return response.data;
      
    } catch (error) {
      attempt++;
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s...
        await delay(Math.pow(2, attempt) * 1000);
        continue;
      }
      
      // All retries failed - graceful degradation
      console.error('Webhook failed after retries:', error);
      
      return {
        fulfillment_response: {
          messages: [{
            text: {
              text: [
                "I'm having trouble accessing that information right now. " +
                "Let me connect you to an agent who can help you directly."
              ]
            }
          }]
        },
        page_info: {
          current_page: "projects/.../pages/EscalationPage"
        },
        session_info: {
          parameters: {
            escalation_reason: "webhook_failure",
            original_intent: data.intentInfo.displayName
          }
        }
      };
    }
  }
}
```

**Generative Fallback (Dialogflow CX Feature):**

```
Enable Generative Fallback:
1. Navigate to Flow → Event Handlers
2. Add No-Match Event Handler
3. Enable "Generative Fallback"
4. Configure Prompt:
   "You are a helpful contact center assistant.
    The user said: $last-user-utterance
    The conversation so far: $conversation
    
    Generate a helpful response that:
    - Acknowledges their input
    - Tries to understand their intent
    - Offers relevant options from our services:
      * Billing questions
      * Technical support
      * Account changes
    
    If you cannot help, politely offer to connect to a live agent."
```

**Circuit Breaker Pattern:**

```javascript
const CircuitBreaker = require('opossum');

const options = {
  timeout: 3000, // 3 seconds
  errorThresholdPercentage: 50, // Open circuit if 50% fail
  resetTimeout: 30000 // Try again after 30 seconds
};

const breaker = new CircuitBreaker(callBackendAPI, options);

// Fallback when circuit is open
breaker.fallback(() => ({
  success: false,
  message: "Service temporarily unavailable",
  fallback: true
}));

// Webhook handler
app.post('/dialogflow', async (req, res) => {
  try {
    const result = await breaker.fire(req.body);
    
    if (result.fallback) {
      // Circuit open - use cached data or escalate
      return res.json({
        fulfillment_response: {
          messages: [{
            text: {
              text: ["Our system is experiencing high load. Let me connect you to an agent."]
            }
          }]
        },
        page_info: {
          current_page: "projects/.../pages/EscalationPage"
        }
      });
    }
    
    res.json(result);
    
  } catch (error) {
    // Handle error
    res.json(getGracefulDegradationResponse(error));
  }
});
```

---

## 7.4.6 Skill-Based Routing with AI Augmentation

## Traditional Skill-Based Routing

**Webex CC Native Skills:**

```
Agent Skills:
├── Billing_Support (Proficiency: 1-10)
├── Technical_Support (Proficiency: 1-10)
├── Spanish_Language (Proficiency: 1-10)
└── VIP_Handling (Proficiency: 1-10)

Queue Configuration:
├── Billing_Queue
│   └── Required Skills: Billing_Support >= 7
├── Tech_Queue
│   └── Required Skills: Technical_Support >= 8
└── VIP_Queue
    └── Required Skills: VIP_Handling >= 9, ANY >= 8
```

## AI-Augmented Routing

**Combine Skills with ML Predictions:**

```
Routing Decision:
├── Step 1: Filter agents by required skills (baseline)
├── Step 2: Score remaining agents with ML model
├── Step 3: Rank by ML score
└── Step 4: Route to highest-scoring available agent
```

**Implementation in Webex CC Flow:**

```
Flow: AI_Augmented_Routing
│
├── Get Available Agents (with required skills)
│   └── Call: Webex CC API (/agents?skills=billing&available=true)
│
├── HTTP Request to GCP Prediction API
│   ├── URL: https://us-central1-project.cloudfunctions.net/predict-agent
│   ├── Method: POST
│   └── Body: {
│       "customer_id": "{{CustomerID}}",
│       "issue_type": "{{VirtualAgent.Intent}}",
│       "sentiment": "{{VirtualAgent.Sentiment}}",
│       "available_agents": ["A001", "A002", "A003"]
│     }
│
├── Parse Response
│   └── Extract: recommended_agent_id, confidence_score
│
├── Condition: confidence_score > 0.75
│   ├── TRUE: Queue to Specific Agent (recommended_agent_id)
│   └── FALSE: Standard Skill-Based Routing
│
└── Set CAD Variables:
    ├── AI_Recommended: TRUE
    ├── AI_Confidence: {{confidence_score}}
    └── Routing_Method: "AI-Augmented"
```

## Dynamic Skill Adjustment

**Update Agent Skills Based on Performance:**

```python
def update_agent_skills_ml():
    """
    Periodically update agent skill proficiencies based on
    ML analysis of performance data
    """
    from google.cloud import bigquery
    
    client = bigquery.Client()
    
    # Query agent performance by skill category
    query = """
        SELECT
            agent_id,
            issue_type,
            AVG(fcr_flag) as fcr_rate,
            AVG(csat_score) as csat_score,
            AVG(handle_time) as avg_aht,
            COUNT(*) as interaction_count
        FROM `project.dataset.interactions`
        WHERE interaction_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
          AND agent_id IS NOT NULL
        GROUP BY agent_id, issue_type
        HAVING interaction_count >= 10  -- Minimum sample size
    """
    
    results = client.query(query).result()
    
    for row in results:
        # Calculate skill proficiency (1-10 scale)
        # Based on: 40% FCR, 40% CSAT, 20% AHT (relative)
        proficiency = calculate_proficiency(
            fcr_rate=row.fcr_rate,
            csat_score=row.csat_score,
            avg_aht=row.avg_aht
        )
        
        # Update in Webex CC via API
        update_agent_skill(
            agent_id=row.agent_id,
            skill=map_issue_to_skill(row.issue_type),
            proficiency=proficiency
        )

def calculate_proficiency(fcr_rate, csat_score, avg_aht):
    """
    Calculate proficiency score (1-10)
    
    Formula:
    Proficiency = (FCR * 0.4) + (CSAT/5 * 0.4) + (AHT_Score * 0.2)
    
    Where AHT_Score is normalized (lower is better)
    """
    # Normalize CSAT (0-5 → 0-1)
    csat_normalized = csat_score / 5.0
    
    # Normalize AHT (assume 300s is average, lower is better)
    aht_score = max(0, 1 - (avg_aht - 300) / 300)
    
    # Weighted average
    proficiency_raw = (
        fcr_rate * 0.4 +
        csat_normalized * 0.4 +
        aht_score * 0.2
    )
    
    # Scale to 1-10
    proficiency = round(proficiency_raw * 10, 1)
    
    return max(1, min(10, proficiency))

def map_issue_to_skill(issue_type):
    """Map issue types to Webex CC skills"""
    mapping = {
        'billing': 'Billing_Support',
        'technical': 'Technical_Support',
        'account': 'Account_Management',
        'sales': 'Sales_Support'
    }
    return mapping.get(issue_type, 'General_Support')
```

---

## 7.4.7 Predictive Routing Configuration

## Step-by-Step Configuration

**Step 1: Set Up BigQuery Data Warehouse**

```bash
## Create dataset
bq mk --location=US --dataset your-project-id:contact_center_data

## Create interactions table
bq mk --table \
    --schema interaction_id:STRING,customer_id:STRING,agent_id:STRING,interaction_time:TIMESTAMP,handle_time:INTEGER,fcr_flag:INTEGER,csat_score:FLOAT,issue_type:STRING,channel:STRING,queue_name:STRING \
    your-project-id:contact_center_data.interactions

## Create agent_skills table
bq mk --table \
    --schema agent_id:STRING,agent_name:STRING,skill:STRING,proficiency:INTEGER \
    your-project-id:contact_center_data.agent_skills
```

**Step 2: Set Up Data Pipeline**

```python
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions

def run_dataflow_pipeline():
    """
    Dataflow pipeline to ingest Webex CC data into BigQuery
    """
    options = PipelineOptions(
        project='your-project-id',
        region='us-central1',
        runner='DataflowRunner',
        temp_location='gs://your-bucket/temp',
        staging_location='gs://your-bucket/staging'
    )
    
    with beam.Pipeline(options=options) as pipeline:
        (
            pipeline
            | 'Read from Pub/Sub' >> beam.io.ReadFromPubSub(
                subscription='projects/your-project-id/subscriptions/webex-cc-events'
            )
            | 'Parse JSON' >> beam.Map(json.loads)
            | 'Transform Data' >> beam.Map(transform_interaction_data)
            | 'Write to BigQuery' >> beam.io.WriteToBigQuery(
                'your-project-id:contact_center_data.interactions',
                write_disposition=beam.io.BigQueryDisposition.WRITE_APPEND
            )
        )

def transform_interaction_data(event):
    """Transform raw event into BigQuery schema"""
    return {
        'interaction_id': event['sessionId'],
        'customer_id': event.get('customerId'),
        'agent_id': event.get('agentId'),
        'interaction_time': event['timestamp'],
        'handle_time': event.get('handleTime', 0),
        'fcr_flag': 1 if event.get('resolved') else 0,
        'csat_score': event.get('csatScore'),
        'issue_type': event.get('issueType'),
        'channel': event.get('channel'),
        'queue_name': event.get('queueName')
    }
```

**Step 3: Train and Deploy ML Model**

(See Section 7.4.2 for detailed training steps)

**Step 4: Create Prediction Cloud Function**

(See Section 7.4.2 for Cloud Function code)

**Step 5: Configure Webex CC Flow**

```yaml
Flow Name: Predictive_Routing_Flow

Activities:
  1. HTTP_Request_Predict_Agent:
       Method: POST
       URL: https://us-central1-your-project.cloudfunctions.net/predict-best-agent
       Headers:
         Content-Type: application/json
       Body:
         customer_id: "{{NewPhoneContact.ANI}}"
         issue_type: "{{VirtualAgent.DetectedIntent}}"
         sentiment: "{{VirtualAgent.Sentiment}}"
         available_agents: "{{AvailableAgents}}"
       Parse Response: JSON
       Output Variable: PredictionResult
  
  2. Condition_Check_Confidence:
       Condition: "{{PredictionResult.best_match.score}} > 0.75"
       
       If TRUE:
         - Set Variable: TargetAgent = "{{PredictionResult.best_match.agent_id}}"
         - Queue_To_Specific_Agent:
             Agent: "{{TargetAgent}}"
             Queue: "{{QueueName}}"
             Priority: High
             CAD Variables:
               - AI_Routed: TRUE
               - AI_Confidence: "{{PredictionResult.best_match.score}}"
               - Predicted_FCR: "{{PredictionResult.best_match.score}}"
       
       If FALSE:
         - Standard_Skill_Based_Routing:
             Queue: "{{QueueName}}"
             Required Skills: Based on issue_type
```

**Step 6: Enable Monitoring**

```python
from google.cloud import monitoring_v3
import time

def create_monitoring_metrics():
    """Create custom metrics for predictive routing"""
    
    client = monitoring_v3.MetricServiceClient()
    project_name = f"projects/your-project-id"
    
    # Metric: Prediction Latency
    descriptor = monitoring_v3.MetricDescriptor(
        type="custom.googleapis.com/predictive_routing/prediction_latency",
        metric_kind=monitoring_v3.MetricDescriptor.MetricKind.GAUGE,
        value_type=monitoring_v3.MetricDescriptor.ValueType.DOUBLE,
        description="Time taken to get agent prediction (ms)"
    )
    descriptor = client.create_metric_descriptor(
        name=project_name,
        metric_descriptor=descriptor
    )
    
    # Metric: Prediction Confidence
    descriptor = monitoring_v3.MetricDescriptor(
        type="custom.googleapis.com/predictive_routing/prediction_confidence",
        metric_kind=monitoring_v3.MetricDescriptor.MetricKind.GAUGE,
        value_type=monitoring_v3.MetricDescriptor.ValueType.DOUBLE,
        description="Confidence score of agent prediction"
    )
    descriptor = client.create_metric_descriptor(
        name=project_name,
        metric_descriptor=descriptor
    )

def log_prediction_metric(latency_ms, confidence_score):
    """Log prediction metrics"""
    client = monitoring_v3.MetricServiceClient()
    project_name = f"projects/your-project-id"
    
    series = monitoring_v3.TimeSeries()
    series.metric.type = "custom.googleapis.com/predictive_routing/prediction_latency"
    series.resource.type = "global"
    
    now = time.time()
    seconds = int(now)
    nanos = int((now - seconds) * 10 ** 9)
    interval = monitoring_v3.TimeInterval(
        {"end_time": {"seconds": seconds, "nanos": nanos}}
    )
    point = monitoring_v3.Point(
        {"interval": interval, "value": {"double_value": latency_ms}}
    )
    series.points = [point]
    
    client.create_time_series(name=project_name, time_series=[series])
```

---

## 7.4.8 Predictive Routing Validation

## Validation Checklist

| Validation Item | Method | Expected Result | Status |
|----------------|--------|-----------------|--------|
| **Data Pipeline** | Check BigQuery tables | Data flowing in real-time | □ |
| **Model Accuracy** | Offline evaluation | AUC > 0.80, Accuracy > 75% | □ |
| **Prediction API** | Load test (100 req/s) | < 100ms latency, 99.9% success | □ |
| **Integration** | End-to-end test call | Agent selected, context passed | □ |
| **FCR Improvement** | A/B test (2 weeks) | 10-20% improvement in AI-routed | □ |
| **Monitoring** | Dashboard review | All metrics visible | □ |

## A/B Testing Framework

**Test Design:**

```
Control Group (50%):
├── Traditional skill-based routing
└── Track: FCR, CSAT, AHT, Transfer Rate

Treatment Group (50%):
├── AI-augmented predictive routing
└── Track: FCR, CSAT, AHT, Transfer Rate, ML Confidence

Duration: 2-4 weeks
Sample Size: Minimum 1,000 interactions per group
```

**Implementation:**

```javascript
// Flow Designer logic
if (Math.random() < 0.5) {
  // Control: Traditional routing
  routeTraditional(call);
  setCadVariable('RoutingMethod', 'Traditional');
} else {
  // Treatment: AI routing
  routePredictive(call);
  setCadVariable('RoutingMethod', 'AI-Predictive');
}
```

**Analysis:**

```sql
-- Compare FCR rates
SELECT
  routing_method,
  COUNT(*) as total_calls,
  AVG(fcr_flag) as fcr_rate,
  AVG(csat_score) as avg_csat,
  AVG(handle_time) as avg_aht,
  AVG(CASE WHEN transfer_count > 0 THEN 1 ELSE 0 END) as transfer_rate
FROM `project.dataset.interactions`
WHERE interaction_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY)
  AND routing_method IN ('Traditional', 'AI-Predictive')
GROUP BY routing_method;

-- Results:
-- Traditional: FCR 65%, CSAT 3.8, AHT 420s, Transfer 18%
-- AI-Predictive: FCR 78%, CSAT 4.1, AHT 380s, Transfer 12%
-- Improvement: +13% FCR, +0.3 CSAT, -40s AHT, -6% transfers
```

---

## 7.4.9 Predictive Routing Troubleshooting

## Common Issues

**Issue 1: Low Prediction Accuracy**

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Model accuracy < 75% | Insufficient training data | Collect more historical data (min 3-6 months) |
| | Feature quality low | Add more relevant features (sentiment, history) |
| | Data quality issues | Clean data, handle missing values |

**Solution:**
```python
## Feature importance analysis
import xgboost as xgb
import matplotlib.pyplot as plt

model = xgb.Booster()
model.load_model('routing_model.json')

## Plot feature importance
xgb.plot_importance(model, max_num_features=20)
plt.show()

## Identify low-impact features and remove them
## Add new features based on domain knowledge
```

**Issue 2: High Prediction Latency**

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Prediction API > 500ms | Model too complex | Simplify model, use faster algorithms |
| | Feature fetching slow | Add caching layer (Redis) |
| | Cold start delays | Keep Cloud Functions warm |

**Solution:**
```python
## Warm Cloud Functions
import requests
import schedule
import time

def keep_warm():
    """Ping Cloud Function every 5 minutes to keep it warm"""
    requests.get('https://your-function-url/health')

schedule.every(5).minutes.do(keep_warm)

while True:
    schedule.run_pending()
    time.sleep(60)
```

**Issue 3: Model Drift**

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Accuracy decreasing over time | Data distribution changed | Retrain model monthly |
| | New patterns not captured | Monitor metrics, automate retraining |

**Solution:**
```python
def monitor_model_drift():
    """
    Monitor prediction accuracy vs ground truth
    Trigger retraining if accuracy drops
    """
    from google.cloud import bigquery
    
    client = bigquery.Client()
    
    # Calculate recent accuracy
    query = """
        SELECT
            DATE(interaction_time) as date,
            AVG(CASE WHEN predicted_fcr = fcr_flag THEN 1 ELSE 0 END) as accuracy
        FROM `project.dataset.interactions`
        WHERE interaction_time >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
          AND predicted_fcr IS NOT NULL
        GROUP BY date
        ORDER BY date DESC
    """
    
    results = client.query(query).result()
    
    for row in results:
        if row.accuracy < 0.70:  # Threshold
            print(f"Model accuracy dropped to {row.accuracy} on {row.date}")
            print("Triggering model retraining...")
            trigger_model_retraining()
            break

def trigger_model_retraining():
    """Trigger Vertex AI training pipeline"""
    from google.cloud import aiplatform
    
    aiplatform.init(project='your-project-id', location='us-central1')
    
    pipeline_job = aiplatform.PipelineJob(
        display_name='routing-model-retrain',
        template_path='gs://your-bucket/pipelines/train_pipeline.json',
        enable_caching=False
    )
    
    pipeline_job.run()
```

---

