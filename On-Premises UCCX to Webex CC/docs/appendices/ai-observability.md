# APPENDIX 10J: WEBEX CONTACT CENTER AI OBSERVABILITY INTEGRATION GUIDE 

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | APPENDIX-10J |
| **Version** | 1.0 |
| **Organization** | Abhavtech |
| **Project Code** | ABV-COLLABVOICE-2024 / ABV-SECOPS-AI-2025 |
| **Classification** | Internal Use |
| **Last Updated** | February 2026 |
| **Document Owner** | Contact Center Operations / Observability Team |
| **Related Project** | UCCX -> Webex Contact Center Migration (Phase 2) |

---

## Document Purpose

This appendix provides detailed technical guidance for integrating Webex Contact Center (WxCC) operations into Abhavtech's AI-Enabled Observability platform (Phase 2D). This guide complements **Appendix 10I (Webex Calling AI Observability)** and focuses specifically on contact center operations, agent performance, queue management, and customer experience metrics.

**Target Audience:**
- Contact Center Operations Managers
- Observability platform administrators
- WxCC administrators
- NOC engineers
- Application operations teams

**Scope:**
- Webex Contact Center: 175 agents (Phase 2A: 150 voice, 25 digital)
- 10 Queues: Sales (India/EMEA/Americas), Support, Billing, Tech Support, Email, Chat
- Coverage: Mumbai, Chennai, London, Frankfurt, New Jersey, Dallas
- Daily Call Volume: Target 4,500+ interactions/day (includes AI automation)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [WxCC API Integration](#3-wxcc-api-integration)
4. [Real-Time Monitoring Integration](#4-real-time-monitoring-integration)
5. [Splunk Data Ingestion & Correlation](#5-splunk-data-ingestion--correlation)
6. [AI/ML Models for Contact Center](#6-aiml-models-for-contact-center)
7. [Dashboard Creation](#7-dashboard-creation)
8. [Alerting & Automation Workflows](#8-alerting--automation-workflows)
9. [Agent Experience Monitoring](#9-agent-experience-monitoring)
10. [Customer Experience Analytics](#10-customer-experience-analytics)
11. [AI/Bot Performance Monitoring](#11-aibot-performance-monitoring)
12. [Compliance & Recording Monitoring](#12-compliance-recording-monitoring)
13. [Testing & Validation](#13-testing-validation)
14. [Operational Procedures](#14-operational-procedures)
15. [Troubleshooting](#15-troubleshooting)
16. [References](#16-references)

---

## 1. Architecture Overview

### 1.1 Integration Architecture

```
+-----------------------------------------------------------------------------+
|                    WEBEX CONTACT CENTER PLATFORM                             |
|  +----------------------------------------------------------------------+  |
|  | VOICE QUEUES (150 agents)                                            |  |
|  | +-- Sales_India_CSQ (45 agents)     Service Level: 30s              |  |
|  | +-- Sales_EMEA_CSQ (12 agents)      Service Level: 30s              |  |
|  | +-- Sales_Americas_CSQ (8 agents)   Service Level: 30s              |  |
|  | +-- Support_CSQ (55 agents)         Service Level: 45s              |  |
|  | +-- Billing_CSQ (15 agents)         Service Level: 30s (PCI)        |  |
|  | +-- TechSupport_CSQ (15 agents)     Service Level: 60s              |  |
|  +----------------------------------------------------------------------+  |
|  +----------------------------------------------------------------------+  |
|  | DIGITAL CHANNELS (25 agents)                                         |  |
|  | +-- Email_CSQ (15 agents)           Service Level: 4 hours          |  |
|  | +-- Chat_CSQ (10 agents)            Service Level: 30s              |  |
|  +----------------------------------------------------------------------+  |
|  +----------------------------------------------------------------------+  |
|  | AI COMPONENTS (Phase 2B)                                             |  |
|  | +-- Webex AI Agent (Virtual Agent)  IVR Containment Target: 35%    |  |
|  | +-- Agent Assist                    Real-time suggestions           |  |
|  | +-- Post-Call Summarization         Auto wrap-up                    |  |
|  +----------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------+
           |                                           |
           |                                           |
    +------v------------------------------------------v---------+
    |           WEBEX CONTACT CENTER API LAYER                   |
    |  +-----------------------------------------------------+  |
    |  | GraphQL Search API (Real-time + Historical)         |  |
    |  | * Task details, agent sessions, queue performance   |  |
    |  | * Aggregation, filtering, pagination support        |  |
    |  +-----------------------------------------------------+  |
    |  +-----------------------------------------------------+  |
    |  | REST APIs                                            |  |
    |  | * Agent Statistics API                              |  |
    |  | * Queue Statistics API                              |  |
    |  | * Captures API (recordings)                         |  |
    |  | * Configuration APIs (admin)                        |  |
    |  +-----------------------------------------------------+  |
    |  +-----------------------------------------------------+  |
    |  | Webhooks (Real-time Events)                         |  |
    |  | * Task creation/completion                          |  |
    |  | * Agent state changes                               |  |
    |  | * Recording availability                            |  |
    |  +-----------------------------------------------------+  |
    +----------+--------------------------------------+---------+
               |                                       |
        +------v------------+              +---------v--------------+
        | INTEGRATION LAYER |              |  EXTERNAL INTEGRATIONS |
        |                   |              |  * Salesforce CRM      |
        | * OAuth 2.0 Auth  |              |  * Recording Platform  |
        | * Token Management|              |  * WFO Platform        |
        | * Rate Limiting   |              |  * Azure AD (SSO)      |
        +------+------------+              +---------+--------------+
               |                                      |
               |            +-------------------------+
               |            |
        +------v------------v------+
        |  OPENTELEMETRY COLLECTOR |
        |  * Event transformation  |
        |  * Data enrichment       |
        |  * Batch processing      |
        +------+-------------------+
               |
        +------v-------------------------+
        |  SPLUNK ENTERPRISE             |
        |  +--------------------------+  |
        |  | cisco_ucapps_index       |  |
        |  | * WxCC queue metrics     |  |
        |  | * Agent performance      |  |
        |  | * Customer interactions  |  |
        |  | * AI/bot analytics       |  |
        |  +--------------------------+  |
        |  +--------------------------+  |
        |  | MLTK AI/ML Models        |  |
        |  | * Queue wait time pred.  |  |
        |  | * Agent burnout detect.  |  |
        |  | * CSAT prediction        |  |
        |  | * Staffing optimization  |  |
        |  +--------------------------+  |
        |  +--------------------------+  |
        |  | Unified Dashboards       |  |
        |  | * Contact Center Ops     |  |
        |  | * Agent Performance      |  |
        |  | * Customer Experience    |  |
        |  | * AI Performance         |  |
        |  +--------------------------+  |
        +--------------------------------+
```

### 1.2 Data Flow Architecture

**Real-Time Event Streams (Webhooks):**
- Collection Interval: Immediate (event-driven)
- Latency: < 5 seconds from event occurrence to visibility
- Data Volume: ~1,000 events/hour (175 agents × avg 6 events/hour)

**Near Real-Time Metrics (GraphQL API):**
- Collection Interval: Every 2 minutes
- Query Types: Agent sessions, task aggregations, queue statistics
- Data Volume: ~50 MB/day

**Historical Analytics (GraphQL API):**
- Collection Interval: Every 15 minutes for detailed queries
- Daily Report Collection: 02:00 UTC (previous day data)
- Data Volume: ~200 MB/day for 175 agents

**Recording Metadata:**
- Collection via Captures API when recording complete
- Includes: Task ID, duration, participants, PCI redaction status
- Storage: Recording URLs with 7-year retention reference

### 1.3 Key Performance Indicators (KPIs)

**Queue Performance Metrics:**

| Metric | Description | Target | Critical Threshold |
|--------|-------------|--------|--------------------|
| **Service Level (30s)** | % calls answered <30s (Sales/Billing) | 85% | <70% |
| **Service Level (45s)** | % calls answered <45s (Support) | 90% | <75% |
| **Service Level (60s)** | % calls answered <60s (Tech Support) | 85% | <70% |
| **Average Speed to Answer (ASA)** | Average wait time to agent | <30s | >60s |
| **Abandonment Rate** | % calls abandoned before answer | <4% | >8% |
| **Average Handle Time (AHT)** | Avg time from answer to wrap-up | <5.5min | >8min |
| **Queue Wait Time** | Average time in queue | <2min | >5min |

**Agent Performance Metrics:**

| Metric | Description | Target | Critical Threshold |
|--------|-------------|--------|--------------------|
| **Occupancy Rate** | % time handling vs available | 75-85% | >90% or <60% |
| **Adherence** | % time in correct state | >90% | <80% |
| **First Call Resolution (FCR)** | % issues resolved first contact | 82% | <70% |
| **Average Handle Time (AHT)** | Per-agent average | Queue-specific | >150% of queue avg |
| **Idle Time %** | % time in idle state | <15% | >25% |
| **Login Duration** | Daily logged in hours | 7-8 hours | <6 hours |

**Customer Experience Metrics:**

| Metric | Description | Target | Critical Threshold |
|--------|-------------|--------|--------------------|
| **CSAT Score** | Customer satisfaction (1-5) | 4.3/5 | <3.8/5 |
| **IVR Containment Rate** | % resolved by AI without agent | 35% | <20% |
| **Self-Service Success Rate** | % AI resolutions successful | >80% | <60% |
| **Repeat Contact Rate** | % customers call back <24hrs | <10% | >20% |

**AI/Bot Performance Metrics (Phase 2B):**

| Metric | Description | Target | Critical Threshold |
|--------|-------------|--------|--------------------|
| **Intent Recognition Accuracy** | % intents correctly identified | >90% | <75% |
| **AI Escalation Rate** | % AI conversations -> human agent | <25% | >40% |
| **AI Resolution Rate** | % AI conversations fully resolved | 35%+ | <20% |
| **Agent Assist Acceptance Rate** | % suggestions accepted by agents | >60% | <40% |

---

## 2. Prerequisites

### 2.1 Webex Contact Center Requirements

**Platform Access:**
```
Required Licenses:
+-- Webex Contact Center Standard (175 agents)
|   +-- 150 Premium Agent licenses (voice + digital)
|   +-- 25 Standard Agent licenses (digital only)
|
+-- Add-ons Required for Full Observability:
|   +-- Premium Agent licenses include:
|   |   +-- Analyzer (historical reporting) [OK]
|   |   +-- Real-time supervisor monitoring [OK]
|   |   +-- Recording metadata access [OK]
|   |
|   +-- API Access Requirements:
|       +-- Developer Portal registration [OK]
|       +-- OAuth 2.0 integration setup [OK]
|       +-- API rate limits: 120 requests/minute
|
+-- Optional (Phase 2B):
    +-- Webex AI Agent (Virtual Agent) for IVR automation
    +-- Agent Assist for real-time suggestions
    +-- WFO Bundle (Recording, QM, WFM)
```

**Required Roles & Permissions:**
```
API Access Roles:
+-- Administrator (full access)
|   +-- Configuration API access (read/write)
|   +-- Search API access (all data)
|   +-- Captures API access (recordings)
|   +-- Webhooks configuration
|
+-- Supervisor (limited access)
    +-- Agent Statistics API (assigned teams only)
    +-- Queue Statistics API (assigned queues only)
    +-- Real-time monitoring (assigned scope)
```

**OAuth Scopes Required:**
```
API Scopes:
+-- cjp:config_read          (Read configurations - queues, agents, teams)
+-- cjp:config_write         (Modify configurations - for automation)
+-- analyzer:read            (Historical reporting data)
+-- capture:read             (Recording metadata and URLs)
+-- search:read              (GraphQL queries - tasks, sessions, queues)
```

**Reference Documentation:**
- [Webex Contact Center APIs](https://developer.webex-cx.com/documentation/)
- [Introducing WxCC APIs](https://developer.webex.com/blog/introducing-the-webex-contact-center-apis-and-developer-portal)
- [WxCC Analyzer User Guide](https://help.webex.com/article/tajemk/)

### 2.2 Integration Components

**Splunk Requirements:**
```
Splunk Configuration:
+-- Index: cisco_ucapps_index (shared with Webex Calling)
|   +-- Current retention: 90 days
|   +-- Additional space needed: ~200 MB/day for WxCC
|   +-- Total expected: ~18 GB for 90 days
|
+-- HTTP Event Collector (HEC)
|   +-- Token: wxcc_hec_token (create separate from Calling)
|   +-- Endpoint: https://splunk-hec.abhavtech.com:8088
|   +-- Sourcetypes:
|       +-- wxcc:queue:metrics
|       +-- wxcc:agent:performance
|       +-- wxcc:task:details
|       +-- wxcc:ai:analytics
|       +-- wxcc:recording:metadata
|
+-- MLTK Models (Contact Center Specific)
    +-- Queue wait time prediction
    +-- Agent burnout detection
    +-- CSAT prediction model
    +-- Optimal staffing calculator
```

**OpenTelemetry Collector:**
```
OTel Configuration for WxCC:
+-- Deployed at: 6 hub sites (same as Webex Calling)
+-- Additional receivers:
|   +-- Webhook receiver (for WxCC webhooks)
|   +-- HTTP receiver (for GraphQL polling results)
|
+-- Processors (WxCC-specific):
|   +-- Agent state enrichment (add team, queue info)
|   +-- Task duration calculation
|   +-- Queue performance aggregation
|   +-- Customer journey assembly (multi-touch)
|
+-- Exporters:
    +-- Splunk HEC (primary)
    +-- File exporter (backup/debugging)
```

### 2.3 Network Requirements

**API Connectivity:**
```
Source: Abhavtech Enterprise Network -> Destination: WxCC API Endpoints
+----------------------------------------------------------------+
| Protocol  | Port         | Purpose                             |
+-----------+--------------+-------------------------------------+
| HTTPS     | TCP 443      | WxCC API endpoints (developer.webex-|
|           |              | cx.com, api.wxcc-us1.cisco.com)     |
|           |              |                                     |
| WSS       | TCP 443      | WebSocket connections (webhooks)    |
|           |              |                                     |
| HTTPS     | TCP 443      | OAuth authorization               |
+----------------------------------------------------------------+

Required DNS Resolution:
+-- developer.webex-cx.com (OAuth, documentation)
+-- api.wxcc-us1.cisco.com (API endpoints - US datacenter)
+-- api.wxcc-eu1.cisco.com (API endpoints - EU datacenter)
+-- api.wxcc-anz1.cisco.com (API endpoints - APAC datacenter)
```

**Data Residency Considerations:**

Abhavtech WxCC is provisioned in **US Datacenter** but serves global agents:
- India agents: Route to US DC (no India DC available for WxCC)
- EMEA agents: Route to US DC (EU DC exists but not used)
- Americas agents: Route to US DC (primary)

**IMPORTANT:** Recording storage and data residency:
- Voice recordings stored in region-specific storage per compliance
- India recordings: India DC (OSP compliance)
- EU recordings: EU DC (GDPR compliance)
- US recordings: US DC

### 2.4 Baseline Data Collection

**CRITICAL REQUIREMENT - CONTACT CENTER BASELINE:**

```
+-----------------------------------------------------------------+
|  [!]️  AI/ML BASELINE FOR CONTACT CENTER                          |
+-----------------------------------------------------------------+
|                                                                 |
|  Component                 | Minimum    | Recommended          |
|  -------------------------+------------+----------------------|
|  Queue Performance Data    | 30 days    | 90 days              |
|  Agent Performance Data    | 30 days    | 90 days              |
|  Customer Interaction Data | 30 days    | 90 days              |
|  AI/Bot Performance (2B)   | 14 days    | 30 days              |
|  Splunk MLTK Training      | 30 days    | 90 days              |
|                                                                 |
|  DO NOT enable AI features before baseline collection!         |
|  Include seasonal patterns: holidays, product launches, etc.   |
|                                                                 |
+-----------------------------------------------------------------+
```

**Baseline Collection Checklist:**
- [ ] WxCC operational for minimum 30 days in production
- [ ] Call volume representative of normal operations
- [ ] All queues active and generating data
- [ ] Agent states being tracked correctly
- [ ] Customer interactions (voice + digital) captured
- [ ] Peak periods included (Black Friday, holiday season, etc.)
- [ ] No major process changes during baseline period

---

## 3. WxCC API Integration

### 3.1 OAuth Authentication Setup

**Step 1: Create Integration in Developer Portal**

1. Navigate to [Webex Contact Center Developer Portal](https://developer.webex-cx.com)
2. Click **Applications** -> **Create New Integration**

```
Integration Configuration:
+-----------------------------------------------------------------+
| Integration Name:  Abhavtech WxCC Observability Platform        |
| Contact Email:     observability@abhavtech.com                  |
| Description:       Integration for Splunk observability         |
| Redirect URIs:     https://splunk.abhavtech.com/webhook         |
|                    https://localhost:8080/oauth-callback        |
| Scopes:                                                         |
|   [[OK]] cjp:config_read                                          |
|   [[OK]] cjp:config_write (for automation)                        |
|   [[OK]] analyzer:read                                            |
|   [[OK]] capture:read                                             |
|   [[OK]] search:read                                              |
+-----------------------------------------------------------------+
```

3. Save and capture credentials:

```json
{
  "clientId": "C1234567890abcdefghijklmnopqrstuv",
  "clientSecret": "S1234567890abcdefghijklmnopqrstuvwxyz123456",
  "orgId": "ORG-abcd1234-5678-90ef-ghij-klmnopqrstuv"
}
```

**Step 2: Implement OAuth 2.0 Authorization Code Flow**

```python
## OAuth token management script 
## Location: $SPLUNK_HOME/etc/apps/abhavtech_wxcc/bin/oauth_manager.py 

import requests
import json
import time
from datetime import datetime, timedelta

class WxCCOAuthManager:
    """
    Manages OAuth 2.0 authentication for Webex Contact Center APIs
    Handles token generation, refresh, and storage
    """
    
    def __init__(self, client_id, client_secret, redirect_uri):
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.token_file = "/var/splunk/wxcc_tokens.json"
        
## API endpoints 
        self.auth_url = "https://webexapis.com/v1/authorize"
        self.token_url = "https://webexapis.com/v1/access_token"
    
    def get_authorization_url(self, scopes):
        """
        Generate authorization URL for initial setup
        Must be accessed by admin user in browser
        """
        scope_string = " ".join(scopes)
        params = {
            "client_id": self.client_id,
            "response_type": "code",
            "redirect_uri": self.redirect_uri,
            "scope": scope_string,
            "state": "abhavtech_wxcc_oauth"
        }
        
        query_string = "&".join([f"{k}={v}" for k, v in params.items()])
        return f"{self.auth_url}?{query_string}"
    
    def exchange_code_for_token(self, authorization_code):
        """
        Exchange authorization code for access token
        One-time operation during initial setup
        """
        data = {
            "grant_type": "authorization_code",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "code": authorization_code,
            "redirect_uri": self.redirect_uri
        }
        
        response = requests.post(
            self.token_url,
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            token_data = response.json()
            token_data["expires_at"] = datetime.now() + timedelta(
                seconds=token_data["expires_in"]
            )
            self._save_tokens(token_data)
            return token_data
        else:
            raise Exception(f"Token exchange failed: {response.text}")
    
    def refresh_access_token(self):
        """
        Refresh expired access token using refresh token
        Called automatically before token expiration
        """
        token_data = self._load_tokens()
        
        data = {
            "grant_type": "refresh_token",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "refresh_token": token_data["refresh_token"]
        }
        
        response = requests.post(
            self.token_url,
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            new_token_data = response.json()
            new_token_data["expires_at"] = datetime.now() + timedelta(
                seconds=new_token_data["expires_in"]
            )
## Preserve refresh token if not returned 
            if "refresh_token" not in new_token_data:
                new_token_data["refresh_token"] = token_data["refresh_token"]
            
            self._save_tokens(new_token_data)
            return new_token_data
        else:
            raise Exception(f"Token refresh failed: {response.text}")
    
    def get_valid_access_token(self):
        """
        Get a valid access token, refreshing if necessary
        This is the main method called by data collection scripts
        """
        token_data = self._load_tokens()
        
## Check if token will expire in next 10 minutes 
        expires_at = datetime.fromisoformat(token_data["expires_at"])
        if datetime.now() + timedelta(minutes=10) >= expires_at:
            token_data = self.refresh_access_token()
        
        return token_data["access_token"]
    
    def _save_tokens(self, token_data):
        """Save tokens to secure file (should use Splunk credential storage in production)"""
        with open(self.token_file, 'w') as f:
            json.dump(token_data, f, default=str)
    
    def _load_tokens(self):
        """Load tokens from file"""
        with open(self.token_file, 'r') as f:
            return json.load(f)


## Usage example for initial setup 
if __name__ == "__main__":
    manager = WxCCOAuthManager(
        client_id="YOUR_CLIENT_ID",
        client_secret="YOUR_CLIENT_SECRET",
        redirect_uri="https://localhost:8080/oauth-callback"
    )
    
## Step 1: Generate authorization URL (run once) 
    scopes = ["cjp:config_read", "analyzer:read", "capture:read", "search:read"]
    auth_url = manager.get_authorization_url(scopes)
    print(f"Visit this URL to authorize: {auth_url}")
    
## Step 2: After user authorizes, exchange code for token 
## authorization_code = input("Enter authorization code: ") 
## manager.exchange_code_for_token(authorization_code) 
    
## Step 3: In production, scripts just call: 
## access_token = manager.get_valid_access_token() 
```

### 3.2 GraphQL Search API Integration

**GraphQL Overview:**

The GraphQL Search API is the primary interface for querying WxCC data. It provides:
- **Unified interface** for tasks, agent sessions, queue statistics
- **Flexible querying** - request only the fields you need
- **Aggregation support** - compute averages, sums, counts
- **Real-time + historical** data from same endpoint

**Endpoint:**
```
POST https://api.wxcc-us1.cisco.com/search
Headers:
  Authorization: Bearer {access_token}
  Content-Type: application/json
```

### 3.3 Queue Statistics Collection

**Real-Time Queue Metrics (Every 2 minutes):**

```python
## Splunk Scripted Input: wxcc_queue_metrics.py 
## Runs every 2 minutes to collect near-real-time queue performance 

import requests
import json
from datetime import datetime, timedelta
from oauth_manager import WxCCOAuthManager

WXCC_API_BASE = "https://api.wxcc-us1.cisco.com"

def collect_queue_statistics(access_token):
    """
    Collect queue performance metrics using GraphQL
    Returns aggregated stats for all queues over last 15 minutes
    """
    
## GraphQL query for queue statistics 
    query = """
    query QueueStats($from: Long!, $to: Long!) {
      task(from: $from, to: $to) {
        tasks {
          id
          queueId
          queueName
          createdTime
          connectedTime
          endedTime
          status
          direction
          origin
          destination
          terminationType
          wrapUpReason
          isRecorded
        }
        aggregation(
          groupBy: [queueName]
          aggregations: [
            {type: AVG, fieldName: "queueDuration"}
            {type: AVG, fieldName: "handleDuration"}
            {type: AVG, fieldName: "connectedDuration"}
            {type: COUNT}
          ]
        ) {
          group {
            queueName
          }
          metrics {
            avg_queueDuration: avg_queueDuration
            avg_handleDuration: avg_handleDuration
            avg_connectedDuration: avg_connectedDuration
            total_tasks: count
          }
        }
      }
    }
    """
    
## Time range: last 15 minutes 
    to_time = int(datetime.now().timestamp() * 1000)  # Epoch milliseconds
    from_time = to_time - (15 * 60 * 1000)  # 15 minutes ago
    
    variables = {
        "from": from_time,
        "to": to_time
    }
    
    response = requests.post(
        f"{WXCC_API_BASE}/search",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        },
        json={
            "query": query,
            "variables": variables
        }
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"GraphQL query failed: {response.text}")

def calculate_queue_kpis(tasks_data):
    """
    Calculate queue KPIs from task data
    
    KPIs:
    - Service Level (% answered within threshold)
    - Average Speed to Answer (ASA)
    - Abandonment Rate
    - Average Handle Time (AHT)
    - Queue Wait Time
    """
    
    kpis = {}
    
    for queue_agg in tasks_data["data"]["task"]["aggregation"]:
        queue_name = queue_agg["group"]["queueName"]
        metrics = queue_agg["metrics"]
        
## Get individual tasks for this queue for detailed calculations 
        tasks = [t for t in tasks_data["data"]["task"]["tasks"] 
                if t["queueName"] == queue_name]
        
## Service level threshold (queue-specific) 
        sl_threshold = {
            "Sales_India_CSQ": 30,
            "Sales_EMEA_CSQ": 30,
            "Sales_Americas_CSQ": 30,
            "Support_CSQ": 45,
            "Billing_CSQ": 30,
            "TechSupport_CSQ": 60,
            "Email_CSQ": 14400,  # 4 hours in seconds
            "Chat_CSQ": 30
        }.get(queue_name, 30)
        
## Calculate service level 
        answered_tasks = [t for t in tasks if t["connectedTime"]]
        if answered_tasks:
            within_sl = sum(1 for t in answered_tasks 
                          if (t["connectedTime"] - t["createdTime"]) / 1000 <= sl_threshold)
            service_level_pct = (within_sl / len(answered_tasks)) * 100
        else:
            service_level_pct = 0
        
## Calculate abandonment rate 
        total_tasks = len(tasks)
        abandoned_tasks = sum(1 for t in tasks if t["status"] == "abandoned")
        abandonment_rate = (abandoned_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
## Average Speed to Answer (milliseconds -> seconds) 
        asa_seconds = (metrics.get("avg_queueDuration", 0) or 0) / 1000
        
## Average Handle Time (milliseconds -> seconds) 
        aht_seconds = (metrics.get("avg_handleDuration", 0) or 0) / 1000
        
        kpis[queue_name] = {
            "queue_name": queue_name,
            "service_level_pct": round(service_level_pct, 2),
            "service_level_threshold": sl_threshold,
            "average_speed_to_answer": round(asa_seconds, 1),
            "abandonment_rate": round(abandonment_rate, 2),
            "average_handle_time": round(aht_seconds, 1),
            "average_queue_wait": round(asa_seconds, 1),  # Same as ASA
            "total_tasks": metrics.get("total_tasks", 0),
            "abandoned_tasks": abandoned_tasks,
            "answered_tasks": len(answered_tasks)
        }
    
    return kpis

def format_for_splunk(queue_kpis):
    """
    Format queue KPIs as Splunk events
    Each queue gets its own event
    """
    events = []
    timestamp = datetime.now().isoformat()
    
    for queue_name, kpis in queue_kpis.items():
        event = {
            "time": timestamp,
            "sourcetype": "wxcc:queue:metrics",
            "source": "wxcc_graphql_api",
            "index": "cisco_ucapps_index",
            "event": {
                "data_type": "queue_performance",
                "queue_name": queue_name,
                **kpis  # Unpack all KPIs
            }
        }
        events.append(event)
    
    return events

def main():
    """Main execution"""
    try:
## Get OAuth token 
        oauth_manager = WxCCOAuthManager(
            client_id="YOUR_CLIENT_ID",
            client_secret="YOUR_CLIENT_SECRET",
            redirect_uri="https://localhost:8080/oauth-callback"
        )
        access_token = oauth_manager.get_valid_access_token()
        
## Collect queue statistics 
        tasks_data = collect_queue_statistics(access_token)
        
## Calculate KPIs 
        queue_kpis = calculate_queue_kpis(tasks_data)
        
## Format for Splunk 
        events = format_for_splunk(queue_kpis)
        
## Output to stdout (Splunk captures) 
        for event in events:
            print(json.dumps(event))
    
    except Exception as e:
## Log error 
        error_event = {
            "time": datetime.now().isoformat(),
            "sourcetype": "wxcc:api:error",
            "event": {
                "error_type": "queue_metrics_collection_failure",
                "error_message": str(e)
            }
        }
        print(json.dumps(error_event))

if __name__ == "__main__":
    main()
```

**Splunk Input Configuration:**

```ini
## inputs.conf - Queue metrics collection 
## $SPLUNK_HOME/etc/apps/abhavtech_wxcc/local/inputs.conf 

[script://$SPLUNK_HOME/etc/apps/abhavtech_wxcc/bin/wxcc_queue_metrics.py]
disabled = false
index = cisco_ucapps_index
interval = 120
sourcetype = wxcc:queue:metrics
source = wxcc_graphql_api
python.version = python3
```

### 3.4 Agent Performance Collection

**Agent Statistics API Integration:**

```python
## Splunk Scripted Input: wxcc_agent_statistics.py 
## Collects agent performance metrics every 5 minutes 

def collect_agent_statistics(access_token):
    """
    Collect agent performance using GraphQL agentSession query
    Returns detailed agent metrics including state changes, tasks handled
    """
    
    query = """
    query AgentStats($from: Long!, $to: Long!) {
      agentSession(from: $from, to: $to) {
        sessions {
          agentId
          agentName
          teamId
          teamName
          siteId
          siteName
          channelType
          startTime
          endTime
          state
          stateDuration
          auxCodeId
          auxCodeName
          totalAvailableDuration
          totalNotAvailableDuration
          totalIdleDuration
          tasksHandled
          tasksOffered
          tasksRejected
          totalLoginDuration
        }
        aggregation(
          groupBy: [agentName, teamName]
          aggregations: [
            {type: AVG, fieldName: "stateDuration"}
            {type: SUM, fieldName: "tasksHandled"}
            {type: SUM, fieldName: "tasksOffered"}
            {type: AVG, fieldName: "totalLoginDuration"}
          ]
        ) {
          group {
            agentName
            teamName
          }
          metrics {
            avg_stateDuration
            total_tasksHandled
            total_tasksOffered
            avg_loginDuration
          }
        }
      }
    }
    """
    
## Time range: last 1 hour for agent stats 
    to_time = int(datetime.now().timestamp() * 1000)
    from_time = to_time - (60 * 60 * 1000)  # 1 hour ago
    
    variables = {
        "from": from_time,
        "to": to_time
    }
    
    response = requests.post(
        f"{WXCC_API_BASE}/search",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        },
        json={
            "query": query,
            "variables": variables
        }
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Agent stats query failed: {response.text}")

def calculate_agent_kpis(sessions_data):
    """
    Calculate agent performance KPIs
    
    KPIs:
    - Occupancy Rate (% time handling vs available)
    - Adherence (% time in correct state)
    - Average Handle Time per agent
    - Idle Time percentage
    - Login Duration
    """
    
    agent_kpis = {}
    
    for session_agg in sessions_data["data"]["agentSession"]["aggregation"]:
        agent_name = session_agg["group"]["agentName"]
        team_name = session_agg["group"]["teamName"]
        metrics = session_agg["metrics"]
        
## Get individual sessions for detailed calc 
        sessions = [s for s in sessions_data["data"]["agentSession"]["sessions"]
                   if s["agentName"] == agent_name]
        
        if not sessions:
            continue
        
## Calculate total time in each state 
        total_available = sum(s.get("totalAvailableDuration", 0) for s in sessions)
        total_idle = sum(s.get("totalIdleDuration", 0) for s in sessions)
        total_login = sum(s.get("totalLoginDuration", 0) for s in sessions)
        
## Occupancy = (Login Time - Available Time - Idle Time) / Login Time 
        handling_time = total_login - total_available - total_idle
        occupancy_rate = (handling_time / total_login * 100) if total_login > 0 else 0
        
## Idle Time % 
        idle_time_pct = (total_idle / total_login * 100) if total_login > 0 else 0
        
## Tasks 
        total_handled = metrics.get("total_tasksHandled", 0)
        total_offered = metrics.get("total_tasksOffered", 0)
        
## Rejection rate 
        total_rejected = total_offered - total_handled
        rejection_rate = (total_rejected / total_offered * 100) if total_offered > 0 else 0
        
        agent_kpis[agent_name] = {
            "agent_name": agent_name,
            "team_name": team_name,
            "occupancy_rate": round(occupancy_rate, 2),
            "idle_time_pct": round(idle_time_pct, 2),
            "total_login_duration_min": round(total_login / 60000, 1),  # ms -> min
            "tasks_handled": total_handled,
            "tasks_offered": total_offered,
            "tasks_rejected": total_rejected,
            "rejection_rate": round(rejection_rate, 2),
            "avg_handle_time_min": 0  # Calculate from task data separately
        }
    
    return agent_kpis
```

### 3.5 Webhook Integration (Real-Time Events)

**Webhooks provide real-time notifications for:**
- Task creation (new interaction)
- Task completion
- Agent state changes (available, idle, not ready, logout)
- Recording capture completion

**Webhook Setup:**

1. In WxCC Admin Portal: **Integrations** -> **Webhooks**
2. Create new webhook subscription:

```json
{
  "webhookName": "Abhavtech-Splunk-RealTime-Events",
  "targetUrl": "https://splunk-hec.abhavtech.com:8088/services/collector/event",
  "events": [
    "task:created",
    "task:ended",
    "agentSession:stateChanged",
    "capture:created"
  ],
  "authenticationMethod": "bearer_token",
  "authenticationToken": "Splunk YOUR_HEC_TOKEN"
}
```

**Webhook Payload Example (Task Created):**

```json
{
  "eventType": "task:created",
  "timestamp": "2026-02-14T10:30:00.000Z",
  "organizationId": "ORG-abcd1234-5678",
  "data": {
    "taskId": "TASK-12345-abcde",
    "queueId": "QUEUE-sales-india",
    "queueName": "Sales_India_CSQ",
    "channelType": "telephony",
    "direction": "inbound",
    "ani": "+919876543210",
    "dnis": "+918044123456",
    "createdTime": 1707819000000,
    "status": "parked"
  }
}
```

**Processing Webhooks in Splunk:**

Webhooks are sent directly to Splunk HEC, no intermediate processing needed. Configure HEC to accept webhook format:

```ini
## inputs.conf - Webhook receiver 
[http://wxcc_webhooks]
disabled = false
index = cisco_ucapps_index
sourcetype = wxcc:webhook:event
token = YOUR_HEC_TOKEN
```

---

## 4. Real-Time Monitoring Integration

### 4.1 Real-Time Queue Dashboard Data

**GraphQL Query for Live Queue Status:**

```graphql
## This query runs every 30 seconds for wallboard/real-time monitoring 
query RealTimeQueueStatus {
  queue {
    queues {
      id
      name
      contactsInQueue
      longestContactInQueue
      averageWaitTime
      serviceLevel
      serviceTargetSatisfied
      tasksWaiting
      tasksConnected
      tasksHandled
      tasksAbandoned
      agentsAvailable
      agentsStaffed
      agentsIdle
      agentsNotReady
    }
  }
}
```

**Response Processing:**

```python
def process_realtime_queue_data(queue_data):
    """
    Process real-time queue data for wallboard display
    Add health indicators and trend calculations
    """
    
    realtime_metrics = []
    
    for queue in queue_data["data"]["queue"]["queues"]:
## Health status based on thresholds 
        health_status = "healthy"
        issues = []
        
## Check service level 
        if queue["serviceLevel"] < 70:
            health_status = "critical"
            issues.append("service_level_critical")
        elif queue["serviceLevel"] < 80:
            health_status = "warning"
            issues.append("service_level_warning")
        
## Check queue wait time 
        if queue["averageWaitTime"] > 300:  # 5 minutes
            health_status = "critical"
            issues.append("high_wait_time")
        elif queue["averageWaitTime"] > 120:  # 2 minutes
            if health_status != "critical":
                health_status = "warning"
            issues.append("elevated_wait_time")
        
## Check contacts in queue vs available agents 
        if queue["contactsInQueue"] > (queue["agentsAvailable"] * 3):
            health_status = "critical"
            issues.append("insufficient_agents")
        
        metric = {
            "queue_name": queue["name"],
            "contacts_in_queue": queue["contactsInQueue"],
            "longest_wait_seconds": queue["longestContactInQueue"],
            "average_wait_seconds": queue["averageWaitTime"],
            "service_level_pct": queue["serviceLevel"],
            "agents_available": queue["agentsAvailable"],
            "agents_idle": queue["agentsIdle"],
            "agents_not_ready": queue["agentsNotReady"],
            "health_status": health_status,
            "issues": issues,
            "timestamp": datetime.now().isoformat()
        }
        
        realtime_metrics.append(metric)
    
    return realtime_metrics
```

### 4.2 Real-Time Agent Status

**Agent State Monitoring via Webhooks:**

Webhooks provide instant notification when agent states change:

```json
{
  "eventType": "agentSession:stateChanged",
  "timestamp": "2026-02-14T10:35:00.000Z",
  "data": {
    "agentId": "AGENT-john-doe-12345",
    "agentName": "John Doe",
    "agentEmail": "john.doe@abhavtech.com",
    "teamId": "TEAM-sales-india",
    "teamName": "Sales India Team",
    "previousState": "available",
    "currentState": "connected",
    "auxCode": null,
    "channelType": "telephony",
    "taskId": "TASK-67890-fghij",
    "stateChangeTime": 1707819300000
  }
}
```

**Splunk Correlation Search for Agent Burnout Detection:**

```spl
## Detect potential agent burnout based on state patterns 
## Run every 15 minutes 

index=cisco_ucapps_index sourcetype=wxcc:webhook:event eventType="agentSession:stateChanged" earliest=-4h
| stats 
    count as total_state_changes,
    count(eval(currentState="connected")) as connected_count,
    count(eval(currentState="idle")) as idle_count,
    count(eval(currentState="not_ready")) as not_ready_count,
    dc(taskId) as tasks_handled,
    earliest(_time) as first_event,
    latest(_time) as last_event
    by agentName, agentEmail
| eval hours_logged = round((last_event - first_event) / 3600, 1)
| eval occupancy_rate = (connected_count / (connected_count + idle_count)) * 100
| eval burnout_risk_score = case(
    hours_logged > 8 AND occupancy_rate > 90, 100,
    hours_logged > 7 AND occupancy_rate > 85, 75,
    occupancy_rate > 95, 60,
    1=1, 0
  )
| where burnout_risk_score > 50
| sort - burnout_risk_score
| table agentName, hours_logged, tasks_handled, occupancy_rate, burnout_risk_score
```

---

## 5. Splunk Data Ingestion & Correlation

### 5.1 Index Strategy & Data Model

**Sourcetype Definitions:**

```ini
## props.conf - WxCC sourcetype configurations 
## $SPLUNK_HOME/etc/apps/abhavtech_wxcc/local/props.conf 

[wxcc:queue:metrics]
SHOULD_LINEMERGE = false
TIME_PREFIX = \"time\"\s*:\s*
TIME_FORMAT = %Y-%m-%dT%H:%M:%S
KV_MODE = json
INDEXED_EXTRACTIONS = json

## Field aliases 
FIELDALIAS-queue = event.queue_name AS queue
FIELDALIAS-service_level = event.service_level_pct AS service_level
FIELDALIAS-asa = event.average_speed_to_answer AS asa
FIELDALIAS-abandonment = event.abandonment_rate AS abandonment_rate

## Calculated fields 
EVAL-health_status = case(
    service_level>=85, "healthy",
    service_level>=70, "warning",
    service_level<70, "critical"
)
EVAL-sl_compliance = if(service_level>=85, 1, 0)

[wxcc:agent:performance]
SHOULD_LINEMERGE = false
TIME_FORMAT = %Y-%m-%dT%H:%M:%S
KV_MODE = json
INDEXED_EXTRACTIONS = json

FIELDALIAS-agent = event.agent_name AS agent
FIELDALIAS-team = event.team_name AS team
FIELDALIAS-occupancy = event.occupancy_rate AS occupancy
FIELDALIAS-tasks = event.tasks_handled AS tasks_handled

[wxcc:task:details]
SHOULD_LINEMERGE = false
KV_MODE = json

## Extract task-specific fields 
EXTRACT-task_fields = \"taskId\":\"(?<task_id>[^\"]+)\".+\"queueName\":\"(?<queue_name>[^\"]+)\".+\"status\":\"(?<task_status>[^\"]+)\"

[wxcc:webhook:event]
SHOULD_LINEMERGE = false
KV_MODE = json

## Real-time event processing 
FIELDALIAS-event_type = eventType AS event_type
FIELDALIAS-agent_state = data.currentState AS agent_state
```

### 5.2 Data Correlation & Enrichment

**Lookup Tables:**

```csv
## lookups/wxcc_queues.csv 
queue_id,queue_name,queue_type,service_level_threshold,max_wait_time,team_id,site_id
QUEUE-sales-india,Sales_India_CSQ,voice,30,300,TEAM-sales-india,SITE-mumbai
QUEUE-sales-emea,Sales_EMEA_CSQ,voice,30,300,TEAM-sales-emea,SITE-london
QUEUE-sales-americas,Sales_Americas_CSQ,voice,30,300,TEAM-sales-amer,SITE-newjersey
QUEUE-support,Support_CSQ,voice,45,600,TEAM-support,SITE-mumbai
QUEUE-billing,Billing_CSQ,voice,30,300,TEAM-billing,SITE-mumbai
QUEUE-techsupport,TechSupport_CSQ,voice,60,900,TEAM-techsupport,SITE-chennai
QUEUE-email,Email_CSQ,digital,14400,86400,TEAM-digital,SITE-mumbai
QUEUE-chat,Chat_CSQ,digital,30,300,TEAM-digital,SITE-mumbai

## lookups/wxcc_agents.csv 
agent_id,agent_email,agent_name,team_id,team_name,site_id,hire_date,skill_level
AGENT-john-001,john.doe@abhavtech.com,John Doe,TEAM-sales-india,Sales India Team,SITE-mumbai,2023-05-15,senior
AGENT-jane-002,jane.smith@abhavtech.com,Jane Smith,TEAM-support,Support Team,SITE-mumbai,2024-01-10,intermediate
## ... 175 agents total ... 

## lookups/wxcc_teams.csv 
team_id,team_name,supervisor_name,supervisor_email,site_id,shift_pattern
TEAM-sales-india,Sales India Team,Priya Sharma,priya.sharma@abhavtech.com,SITE-mumbai,24x7
TEAM-sales-emea,Sales EMEA Team,David Wilson,david.wilson@abhavtech.com,SITE-london,8x5
TEAM-support,Support Team,Raj Kumar,raj.kumar@abhavtech.com,SITE-mumbai,24x7
```

**transforms.conf:**

```ini
## transforms.conf - Lookup definitions 
[wxcc_queues_lookup]
filename = wxcc_queues.csv
case_sensitive_match = false
match_type = EXACT(queue_name)

[wxcc_agents_lookup]
filename = wxcc_agents.csv
case_sensitive_match = false
match_type = EXACT(agent_email)

[wxcc_teams_lookup]
filename = wxcc_teams.csv
case_sensitive_match = false
match_type = EXACT(team_id)
```

**Enrichment Search Example:**

```spl
## Enrich queue metrics with team and site information 
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=-15m
| lookup wxcc_queues_lookup queue_name OUTPUT team_id, site_id, service_level_threshold
| lookup wxcc_teams_lookup team_id OUTPUT supervisor_name, shift_pattern
| eval sl_variance = service_level - service_level_threshold
| eval performance_status = case(
    sl_variance >= 5, "exceeding",
    sl_variance >= 0, "meeting",
    sl_variance >= -10, "underperforming",
    sl_variance < -10, "critical"
  )
| table _time, queue_name, service_level, service_level_threshold, 
         sl_variance, performance_status, supervisor_name, site_id
```

### 5.3 Cross-Platform Correlation

**Correlate WxCC Data with Network Performance (Webex Calling):**

```spl
## Correlation: Poor call quality -> Contact center issues 
## This search correlates network quality degradation with queue performance 

index=cisco_ucapps_index (sourcetype=webex:calling:quality OR sourcetype=wxcc:queue:metrics) earliest=-1h
| eval data_source = case(
    sourcetype="webex:calling:quality", "network",
    sourcetype="wxcc:queue:metrics", "contact_center"
  )

## Pivot data by location and time (5-minute buckets) 
| bin _time span=5m
| stats 
    avg(mos_score) as avg_mos by _time, location, data_source
| chart avg(avg_mos) over _time by location

## Join with queue performance 
| join type=left _time 
    [search index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=-1h
    | bin _time span=5m
    | stats avg(service_level_pct) as avg_service_level by _time]

## Correlation analysis 
| eval quality_impact = case(
    avg_mos < 3.5 AND avg_service_level < 80, "Poor network causing queue issues",
    avg_mos < 3.5, "Network degraded, queue OK",
    avg_service_level < 80, "Queue issues unrelated to network",
    1=1, "Both systems healthy"
  )
| table _time, location, avg_mos, avg_service_level, quality_impact
```

**Correlate Agent Performance with System Health:**

```spl
## Identify if agent performance issues are systemic or individual 
index=cisco_ucapps_index sourcetype=wxcc:agent:performance earliest=-4h
| bin _time span=30m
| stats 
    avg(occupancy_rate) as avg_occupancy,
    avg(idle_time_pct) as avg_idle_time,
    avg(tasks_handled) as avg_tasks
    by _time, team_name, agent_name

## Compare individual agent vs team average 
| eventstats 
    avg(avg_occupancy) as team_avg_occupancy,
    stdev(avg_occupancy) as team_stdev_occupancy
    by _time, team_name

| eval variance_from_team = avg_occupancy - team_avg_occupancy
| eval z_score = variance_from_team / team_stdev_occupancy
| eval agent_status = case(
    z_score > 2, "outlier_high",
    z_score < -2, "outlier_low",
    1=1, "normal"
  )

| where agent_status IN ("outlier_high", "outlier_low")
| table _time, agent_name, team_name, avg_occupancy, team_avg_occupancy, z_score, agent_status
```

---

## 6. AI/ML Models for Contact Center

### 6.1 MLTK Model: Queue Wait Time Prediction

**Model Purpose:**
Predict queue wait times for incoming calls to enable proactive customer communications ("expected wait time is X minutes") and dynamic routing decisions.

**Training Data Requirements:**
- Minimum 30 days of queue performance data
- Must include various call volume scenarios (peak, normal, low)
- Time of day patterns (morning rush, lunch, evening)
- Day of week patterns (Monday spike, Friday dip)

**Model Training:**

```spl
## Step 1: Generate Training Dataset 
index=cisco_ucapps_index sourcetype=wxcc:task:details earliest=-90d
| eval hour_of_day = strftime(_time, "%H")
| eval day_of_week = strftime(_time, "%A")
| eval is_business_hours = if(hour_of_day>=9 AND hour_of_day<=17 AND day_of_week NOT IN ("Saturday","Sunday"), 1, 0)

## Calculate queue metrics per 5-minute interval 
| bin _time span=5m
| stats 
    avg(queueDuration) as avg_wait_time,
    count as call_volume,
    count(eval(status="abandoned")) as abandoned_count
    by _time, queueName, hour_of_day, day_of_week, is_business_hours

## Add lag features (previous period metrics) 
| streamstats window=3
    avg(call_volume) as prev_3_periods_volume,
    avg(avg_wait_time) as prev_3_periods_wait
    by queueName

## Add agent availability from agent stats (join) 
| join type=left _time queueName 
    [search index=cisco_ucapps_index sourcetype=wxcc:agent:performance earliest=-90d
    | bin _time span=5m
    | stats count(eval(agent_state="available")) as agents_available by _time, queueName]

| where isnotnull(prev_3_periods_volume)
| outputlookup wxcc_wait_time_training_data.csv
```

```spl
## Step 2: Train Linear Regression Model 
| inputlookup wxcc_wait_time_training_data.csv
| fit LinearRegression avg_wait_time 
    from call_volume prev_3_periods_volume agents_available hour_of_day is_business_hours
    into wxcc_wait_time_prediction_model
```

**Real-Time Prediction:**

```spl
## Scheduled Search: Predict Queue Wait Time (Run every 2 minutes) 
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=-10m latest=now
| eval hour_of_day = strftime(_time, "%H")
| eval day_of_week = strftime(_time, "%A")
| eval is_business_hours = if(hour_of_day>=9 AND hour_of_day<=17 AND day_of_week NOT IN ("Saturday","Sunday"), 1, 0)

| bin _time span=5m
| stats 
    latest(contacts_in_queue) as call_volume,
    latest(agents_available) as agents_available
    by _time, queue_name, hour_of_day, is_business_hours

## Add previous period metrics 
| streamstats window=3
    avg(call_volume) as prev_3_periods_volume
    by queue_name

| apply wxcc_wait_time_prediction_model
| rename "predicted(avg_wait_time)" as predicted_wait_time_seconds

## Convert to customer-friendly format 
| eval predicted_wait_time_min = round(predicted_wait_time_seconds / 60, 0)
| eval wait_time_category = case(
    predicted_wait_time_min < 1, "Less than 1 minute",
    predicted_wait_time_min <= 3, "1-3 minutes",
    predicted_wait_time_min <= 5, "3-5 minutes",
    predicted_wait_time_min > 5, "More than 5 minutes"
  )

| table _time, queue_name, call_volume, agents_available, 
         predicted_wait_time_min, wait_time_category

## Send to external API for IVR integration if wait time > 5 minutes 
| where predicted_wait_time_min > 5
| collect index=cisco_ai_events_index sourcetype=mltk:prediction:wxcc
```

### 6.2 MLTK Model: Agent Burnout Detection

**Model Purpose:**
Identify agents at risk of burnout based on work patterns, task load, and performance trends to enable proactive intervention.

**Risk Factors Monitored:**
- Excessive login hours (>8 hours/day consistently)
- High occupancy rate (>90% sustained)
- Increasing AHT trend (agent slowing down)
- Decreasing availability (more breaks, idle time)
- State change frequency (rapid transitions = stress)

**Anomaly Detection Approach:**

```spl
## Training: Build Agent Behavioral Profile (30+ days) 
index=cisco_ucapps_index sourcetype=wxcc:agent:performance earliest=-90d
| bin _time span=1d
| stats 
    avg(occupancy_rate) as avg_occupancy,
    avg(total_login_duration_min) as avg_login_hours,
    avg(idle_time_pct) as avg_idle_pct,
    sum(tasks_handled) as total_tasks,
    avg(tasks_handled) as avg_tasks_per_day
    by _time, agent_name, team_name

| fit DensityFunction avg_occupancy avg_login_hours avg_idle_pct avg_tasks_per_day
    into agent_burnout_detection_model
    threshold=0.05
```

**Daily Burnout Screening:**

```spl
## Scheduled Search: Agent Burnout Risk Assessment (Daily 18:00 local) 
index=cisco_ucapps_index sourcetype=wxcc:agent:performance earliest=-24h
| stats 
    avg(occupancy_rate) as occupancy,
    avg(total_login_duration_min) as login_hours,
    avg(idle_time_pct) as idle_pct,
    sum(tasks_handled) as tasks_handled
    by agent_name, team_name, agent_email

| apply agent_burnout_detection_model
| where "IsOutlier(avg_occupancy,avg_login_hours,avg_idle_pct,avg_tasks_per_day)"=1

## Calculate burnout risk score 
| eval burnout_score = case(
    occupancy > 90 AND login_hours > 8, 100,
    occupancy > 85 AND login_hours > 7.5, 75,
    occupancy > 90 OR login_hours > 9, 60,
    1=1, 0
  )

| where burnout_score >= 60

## Lookup supervisor 
| lookup wxcc_teams_lookup team_name OUTPUT supervisor_name, supervisor_email

## Generate alert 
| eval alert_message = 
    "Agent " . agent_name . " showing signs of potential burnout. " .
    "Occupancy: " . round(occupancy, 1) . "%, " .
    "Login Hours: " . round(login_hours, 1) . ", " .
    "Burnout Score: " . burnout_score

| table agent_name, agent_email, team_name, supervisor_name, 
         occupancy, login_hours, burnout_score, alert_message

## Send email to supervisor 
| sendemail 
    to="$result.supervisor_email$"
    subject="Agent Burnout Alert: $result.agent_name$"
    message="$result.alert_message$"
    server=smtp.abhavtech.com
```

### 6.3 MLTK Model: Customer Satisfaction (CSAT) Prediction

**Model Purpose:**
Predict CSAT score for each interaction based on operational metrics, enabling proactive recovery for negative experiences.

**Features for Prediction:**
- Queue wait time (longer wait = lower CSAT)
- Handle time (very short or very long = issues)
- Number of transfers (multiple transfers = frustration)
- Agent experience level (new agents = lower CSAT risk)
- Time of day (late night = lower CSAT)
- IVR time before agent (long IVR = frustration)

**Training Dataset Creation:**

```spl
## Collect historical CSAT data with features 
index=cisco_ucapps_index sourcetype=wxcc:task:details earliest=-90d
| where isnotnull(csat_score)

| eval hour_of_day = strftime(createdTime, "%H")
| eval wait_time_sec = (connectedTime - createdTime) / 1000
| eval handle_time_sec = (endedTime - connectedTime) / 1000
| eval total_time_sec = (endedTime - createdTime) / 1000

## Join with agent experience data 
| lookup wxcc_agents_lookup agent_email OUTPUT hire_date, skill_level

| eval agent_tenure_days = (now() - strptime(hire_date, "%Y-%m-%d")) / 86400
| eval agent_experience = case(
    skill_level="senior", 3,
    skill_level="intermediate", 2,
    skill_level="junior", 1,
    1=1, 1
  )

| table csat_score, wait_time_sec, handle_time_sec, transfer_count, 
         agent_experience, hour_of_day, queue_name

| outputlookup wxcc_csat_training_data.csv
```

```spl
## Train CSAT Prediction Model 
| inputlookup wxcc_csat_training_data.csv
| fit LinearRegression csat_score
    from wait_time_sec handle_time_sec transfer_count agent_experience hour_of_day
    into wxcc_csat_prediction_model
```

**Real-Time CSAT Prediction (Post-Call):**

```spl
## Predict CSAT immediately after call ends (webhook trigger) 
index=cisco_ucapps_index sourcetype=wxcc:webhook:event eventType="task:ended" earliest=-5m
| eval wait_time_sec = (data.connectedTime - data.createdTime) / 1000
| eval handle_time_sec = (data.endedTime - data.connectedTime) / 1000
| eval hour_of_day = strftime(data.endedTime, "%H")

## Lookup agent experience 
| lookup wxcc_agents_lookup agent_email=data.agentEmail OUTPUT skill_level
| eval agent_experience = case(
    skill_level="senior", 3,
    skill_level="intermediate", 2,
    1=1, 1
  )

| apply wxcc_csat_prediction_model
| rename "predicted(csat_score)" as predicted_csat

## If predicted CSAT < 3.5, trigger proactive recovery 
| where predicted_csat < 3.5

| eval recovery_action = case(
    predicted_csat < 2.5, "immediate_supervisor_callback",
    predicted_csat < 3.5, "email_apology_with_offer",
    1=1, "monitor"
  )

## Create recovery task 
| table data.taskId, data.customerPhone, predicted_csat, recovery_action, data.queueName

## Send to CRM (Salesforce) for follow-up 
| collect index=cisco_ai_events_index sourcetype=mltk:prediction:csat
```

### 6.4 MLTK Model: Optimal Staffing Calculator

**Model Purpose:**
Predict required agent staffing levels by hour/day based on forecasted call volume and service level targets using Erlang C calculations.

**Erlang C Implementation:**

```python
## Python script: erlang_c_staffing_calculator.py 
## Splunk custom search command 

import math
from scipy.special import factorial

def erlang_c(agents, traffic_intensity):
    """
    Calculate probability of wait (Erlang C formula)
    
    agents: Number of available agents
    traffic_intensity: Call arrival rate × average handle time
    """
    if agents <= traffic_intensity:
        return 1.0  # System unstable
    
## Erlang C formula 
    numerator = (traffic_intensity ** agents) / factorial(agents)
    denominator = numerator + sum(
        (traffic_intensity ** k) / factorial(k) 
        for k in range(int(agents))
    )
    
    pw = numerator / denominator * (agents / (agents - traffic_intensity))
    return pw

def calculate_required_agents(call_volume_per_hour, aht_seconds, service_level_target, wait_time_threshold):
    """
    Calculate minimum agents needed to meet service level
    
    call_volume_per_hour: Expected calls per hour
    aht_seconds: Average handle time in seconds
    service_level_target: e.g. 0.85 for 85%
    wait_time_threshold: e.g. 30 for 30 seconds
    """
    
## Convert to Erlang units 
    aht_hours = aht_seconds / 3600
    traffic_intensity = call_volume_per_hour * aht_hours  # Erlangs
    
## Binary search for minimum agents 
    min_agents = int(traffic_intensity) + 1
    max_agents = int(traffic_intensity * 3)
    
    for agents in range(min_agents, max_agents):
        pw = erlang_c(agents, traffic_intensity)
        
## Probability of wait < threshold 
        p_wait_under_threshold = pw * math.exp(
            -(agents - traffic_intensity) * (wait_time_threshold / aht_seconds)
        )
        
        service_level = 1 - p_wait_under_threshold
        
        if service_level >= service_level_target:
            return agents, service_level, pw
    
    return max_agents, 0, 1  # Could not meet target

## Splunk integration 
def main():
## Called from Splunk search pipeline 
## Input: Forecasted call volume per hour per queue 
## Output: Required agent count 
    
    forecasted_data = [
        {"queue": "Sales_India_CSQ", "hour": 9, "forecast_volume": 120, "aht": 330},
        {"queue": "Sales_India_CSQ", "hour": 10, "forecast_volume": 150, "aht": 330},
## ... etc 
    ]
    
    results = []
    for data in forecasted_data:
        agents_needed, actual_sl, prob_wait = calculate_required_agents(
            call_volume_per_hour=data["forecast_volume"],
            aht_seconds=data["aht"],
            service_level_target=0.85,
            wait_time_threshold=30
        )
        
        results.append({
            "queue": data["queue"],
            "hour": data["hour"],
            "forecast_volume": data["forecast_volume"],
            "agents_required": agents_needed,
            "predicted_service_level": round(actual_sl * 100, 2),
            "probability_of_wait": round(prob_wait, 3)
        })
    
    return results
```

**Splunk Search Using Erlang C:**

```spl
## Scheduled Search: Weekly Staffing Forecast (Run Sunday 18:00) 
## Step 1: Forecast call volume by hour for next week 

index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=-4w
| eval hour_of_day = strftime(_time, "%H")
| eval day_of_week = strftime(_time, "%A")

## Calculate average call volume by hour/day/queue 
| stats 
    avg(total_tasks) as avg_call_volume,
    avg(average_handle_time) as avg_aht_sec
    by queue_name, day_of_week, hour_of_day

## Apply growth factor (5% increase expected) 
| eval forecast_volume = round(avg_call_volume * 1.05, 0)

## Step 2: Calculate required agents using Erlang C (custom command) 
| erlangc 
    call_volume=forecast_volume 
    aht=avg_aht_sec 
    service_level=0.85 
    wait_threshold=30
    output_field=agents_required

## Step 3: Compare to current staffing 
| lookup wxcc_staffing_schedule 
    queue_name day_of_week hour_of_day 
    OUTPUT scheduled_agents

| eval staffing_variance = scheduled_agents - agents_required
| eval recommendation = case(
    staffing_variance < -2, "ADD AGENTS",
    staffing_variance > 5, "REDUCE AGENTS",
    1=1, "ADEQUATE"
  )

| table queue_name, day_of_week, hour_of_day, forecast_volume, 
         agents_required, scheduled_agents, staffing_variance, recommendation

| where recommendation IN ("ADD AGENTS", "REDUCE AGENTS")
| outputlookup wxcc_staffing_recommendations.csv
```

---

## 7. Dashboard Creation

### 7.1 Executive Dashboard: Contact Center Overview

**Dashboard Purpose:**
High-level KPI view for executives and contact center leadership.

**Key Metrics (Single Value Panels):**

```xml
<dashboard version="1.1">
  <label>WxCC Executive Dashboard - Contact Center Overview</label>
  <description>Real-time contact center performance for Abhavtech (175 agents, 10 queues)</description>
  
  <refresh>300</refresh> <!-- 5 minute refresh -->
  
  <!-- Row 1: Key Performance Indicators -->
  <row>
    <panel>
      <title>Service Level (Today)</title>
      <single>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=@d
| stats 
    sum(answered_tasks) as total_answered,
    sum(eval(service_level_threshold=30 AND average_speed_to_answer<=30)) as within_sl_30,
    sum(eval(service_level_threshold=45 AND average_speed_to_answer<=45)) as within_sl_45,
    sum(eval(service_level_threshold=60 AND average_speed_to_answer<=60)) as within_sl_60
| eval total_within_sl = within_sl_30 + within_sl_45 + within_sl_60
| eval service_level_pct = round((total_within_sl / total_answered) * 100, 1)
| fields service_level_pct
          </query>
        </search>
        <option name="numberPrecision">0.1</option>
        <option name="unit">%</option>
        <option name="rangeColors">["0xD41F1F","0xF7BC38","0x65A637"]</option>
        <option name="rangeValues">[70,85]</option>
        <option name="underLabel">Target: 85%</option>
        <option name="useColors">1</option>
      </single>
    </panel>
    
    <panel>
      <title>Average Speed to Answer</title>
      <single>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=@d
| stats avg(average_speed_to_answer) as asa
| eval asa=round(asa, 0)
          </query>
        </search>
        <option name="unit">sec</option>
        <option name="rangeColors">["0x65A637","0xF7BC38","0xD41F1F"]</option>
        <option name="rangeValues">[30,60]</option>
        <option name="underLabel">Target: &lt;30s</option>
        <option name="useColors">1</option>
      </single>
    </panel>
    
    <panel>
      <title>Abandonment Rate</title>
      <single>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=@d
| stats 
    sum(total_tasks) as total_calls,
    sum(abandoned_tasks) as abandoned_calls
| eval abandonment_rate = round((abandoned_calls / total_calls) * 100, 2)
| fields abandonment_rate
          </query>
        </search>
        <option name="numberPrecision">0.01</option>
        <option name="unit">%</option>
        <option name="rangeColors">["0x65A637","0xF7BC38","0xD41F1F"]</option>
        <option name="rangeValues">[4,8]</option>
        <option name="underLabel">Target: &lt;4%</option>
        <option name="useColors">1</option>
      </single>
    </panel>
    
    <panel>
      <title>Customer Satisfaction (CSAT)</title>
      <single>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=wxcc:task:details earliest=@d
| where isnotnull(csat_score)
| stats avg(csat_score) as avg_csat
| eval avg_csat=round(avg_csat, 2)
          </query>
        </search>
        <option name="numberPrecision">0.01</option>
        <option name="rangeColors">["0xD41F1F","0xF7BC38","0x65A637"]</option>
        <option name="rangeValues">[3.8,4.0]</option>
        <option name="underLabel">Target: 4.3/5.0</option>
        <option name="useColors">1</option>
      </single>
    </panel>
  </row>
  
  <!-- Row 2: Volume Metrics -->
  <row>
    <panel>
      <title>Total Interactions (Today)</title>
      <single>
        <query>
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=@d
| stats sum(total_tasks) as total_interactions
        </query>
        <option name="underLabel">Target: 4,500+</option>
      </single>
    </panel>
    
    <panel>
      <title>AI-Handled Interactions</title>
      <single>
        <query>
index=cisco_ucapps_index sourcetype=wxcc:ai:analytics earliest=@d
| where resolution_type="ai_resolved"
| stats count as ai_handled
        </query>
        <option name="underLabel">IVR Containment</option>
      </single>
    </panel>
    
    <panel>
      <title>Average Handle Time</title>
      <single>
        <query>
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=@d
| stats avg(average_handle_time) as aht
| eval aht_min = round(aht / 60, 1)
        </query>
        <option name="unit">min</option>
        <option name="rangeColors">["0x65A637","0xF7BC38","0xD41F1F"]</option>
        <option name="rangeValues">[6,8]</option>
        <option name="underLabel">Target: 5.5 min</option>
        <option name="useColors">1</option>
      </single>
    </panel>
    
    <panel>
      <title>First Call Resolution</title>
      <single>
        <query>
index=cisco_ucapps_index sourcetype=wxcc:task:details earliest=@d
| stats 
    count as total_calls,
    count(eval(first_call_resolution=1)) as fcr_calls
| eval fcr_rate = round((fcr_calls / total_calls) * 100, 1)
        </query>
        <option name="unit">%</option>
        <option name="underLabel">Target: 82%</option>
      </single>
    </panel>
  </row>
  
  <!-- Row 3: Service Level Trend (24 hours) -->
  <row>
    <panel>
      <title>Service Level Trend (Last 24 Hours)</title>
      <chart>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=-24h
| bin _time span=1h
| stats avg(service_level_pct) as avg_service_level by _time
| eval target=85
| timechart span=1h avg(avg_service_level) as "Service Level", avg(target) as "Target (85%)"
          </query>
        </search>
        <option name="charting.chart">line</option>
        <option name="charting.axisTitleX.text">Time</option>
        <option name="charting.axisTitleY.text">Service Level %</option>
        <option name="charting.legend.placement">bottom</option>
      </chart>
    </panel>
  </row>
  
  <!-- Row 4: Queue Performance Heatmap -->
  <row>
    <panel>
      <title>Queue Performance Matrix (Last 4 Hours)</title>
      <table>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=-4h latest=now
| stats 
    latest(service_level_pct) as service_level,
    latest(average_speed_to_answer) as asa,
    latest(abandonment_rate) as abandonment,
    latest(average_handle_time) as aht,
    latest(contacts_in_queue) as in_queue,
    latest(agents_available) as agents
    by queue_name
| eval service_level=round(service_level, 1)
| eval asa=round(asa, 0)
| eval abandonment=round(abandonment, 2)
| eval aht_min=round(aht/60, 1)
| eval health=case(
    service_level>=85 AND abandonment<4, "🟢 Healthy",
    service_level>=70 OR abandonment<8, "🟡 Warning",
    1=1, "🔴 Critical"
  )
| sort - service_level
| table queue_name, health, service_level, asa, abandonment, aht_min, in_queue, agents
| rename 
    queue_name AS "Queue",
    health AS "Status",
    service_level AS "SL %",
    asa AS "ASA (s)",
    abandonment AS "Aband %",
    aht_min AS "AHT (min)",
    in_queue AS "In Queue",
    agents AS "Agents Avail"
          </query>
        </search>
        <option name="drilldown">row</option>
      </table>
    </panel>
  </row>
  
  <!-- Row 5: Top Issues / Alerts -->
  <row>
    <panel>
      <title>Active Alerts & Issues (Last Hour)</title>
      <table>
        <search>
          <query>
index=cisco_ai_events_index sourcetype=mltk:prediction:wxcc earliest=-1h
| stats 
    latest(_time) as last_seen,
    values(alert_type) as alert_types,
    latest(severity) as severity
    by queue_name, issue_description
| sort - severity, - last_seen
| convert ctime(last_seen)
| table last_seen, queue_name, issue_description, alert_types, severity
          </query>
        </search>
      </table>
    </panel>
  </row>
</dashboard>
```

### 7.2 Operations Dashboard: Real-Time Queue Monitoring

**Purpose:** Supervisor/team lead real-time monitoring

**Key Features:**
- Live queue status (updates every 30 seconds)
- Agent availability by queue
- Longest wait time alerts
- Real-time performance vs. targets

```spl
## Panel: Live Queue Status 
index=cisco_ucapps_index sourcetype=wxcc:webhook:event eventType="task:created" earliest=-5m
| stats 
    count as contacts_in_queue,
    max(eval((now() - data.createdTime/1000))) as longest_wait_seconds
    by data.queueName
| eval longest_wait_min = round(longest_wait_seconds / 60, 1)
| eval status = case(
    longest_wait_min > 5, "🔴 Critical",
    longest_wait_min > 2, "🟡 Warning",
    1=1, "🟢 OK"
  )
| rename data.queueName AS queue
| table queue, contacts_in_queue, longest_wait_min, status
```

### 7.3 Agent Performance Dashboard

**Purpose:** Individual agent and team performance tracking

```spl
## Panel: Agent Leaderboard (Today) 
index=cisco_ucapps_index sourcetype=wxcc:agent:performance earliest=@d
| stats 
    sum(tasks_handled) as total_calls,
    avg(occupancy_rate) as avg_occupancy,
    avg(idle_time_pct) as avg_idle
    by agent_name, team_name
| eval performance_score = round(
    (total_calls * 0.4) + 
    (avg_occupancy * 0.4) + 
    ((100 - avg_idle) * 0.2), 1)
| sort - performance_score
| head 20
| table agent_name, team_name, total_calls, avg_occupancy, performance_score
```

---

## 8. Alerting & Automation Workflows

### 8.1 Contact Center Alert Framework

**Alert Categories & Priorities:**

```
Alert Priority Matrix:
+------------------------------------------------------------------+
| P1 - CRITICAL (Immediate Response Required)                      |
+------------------------------------------------------------------+
| * Service Level < 70% for 15+ minutes                           |
| * Queue abandonment > 15%                                        |
| * All agents unavailable in queue                               |
| * Recording system failure (compliance risk)                    |
| * Complete queue outage                                         |
| Response: 5 minutes | Escalation: Immediately to Manager        |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| P2 - HIGH (Response Within 15 Minutes)                          |
+------------------------------------------------------------------+
| * Service Level 70-80% for 30+ minutes                          |
| * Queue wait time > 5 minutes sustained                         |
| * Agent burnout score > 75                                      |
| * Abandonment rate 8-15%                                        |
| * AI escalation rate > 40%                                      |
| Response: 15 minutes | Escalation: 30 min to Supervisor        |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| P3 - MEDIUM (Response Within 1 Hour)                            |
+------------------------------------------------------------------+
| * Service Level 80-85% (below target)                           |
| * Predicted CSAT < 3.8                                          |
| * Agent idle time > 25%                                         |
| * Individual agent performance outlier                          |
| Response: 1 hour | Escalation: 2 hours to Team Lead            |
+------------------------------------------------------------------+
```

### 8.2 WF-002: Queue Service Level Recovery Workflow

**Trigger Conditions:**
- Service Level drops below 70% for any queue
- Sustained for 15+ minutes
- During business hours (9 AM - 6 PM local time)

**Automated Workflow:**

```spl
## Alert Configuration: WF-002 Queue SL Recovery 
## Trigger: Scheduled search every 5 minutes 

index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=-20m
| bin _time span=5m
| stats 
    avg(service_level_pct) as avg_sl,
    latest(contacts_in_queue) as contacts_in_queue,
    latest(agents_available) as agents_available,
    latest(agents_idle) as agents_idle
    by _time, queue_name

| where avg_sl < 70

## Check if sustained for 15+ minutes (3 consecutive 5-min periods) 
| streamstats count as consecutive_periods by queue_name reset_after="(avg_sl >= 70)"
| where consecutive_periods >= 3

## Enrich with queue metadata 
| lookup wxcc_queues_lookup queue_name OUTPUT team_id, site_id, supervisor_email
| lookup wxcc_teams_lookup team_id OUTPUT supervisor_name

## Calculate recommended actions 
| eval recommended_actions = case(
    agents_available = 0, "CRITICAL: No agents available - escalate immediately",
    agents_idle > 0, "Idle agents present - check routing/skills",
    contacts_in_queue > (agents_available * 5), "Insufficient staffing - request backup",
    1=1, "Performance issue - supervisor intervention needed"
  )

| eval alert_message = 
    "ALERT WF-002: Queue Service Level Critical\n\n" .
    "Queue: " . queue_name . "\n" .
    "Current Service Level: " . round(avg_sl, 1) . "% (Target: 85%)\n" .
    "Contacts in Queue: " . contacts_in_queue . "\n" .
    "Available Agents: " . agents_available . "\n" .
    "Idle Agents: " . agents_idle . "\n\n" .
    "RECOMMENDED ACTION: " . recommended_actions . "\n\n" .
    "Duration: 15+ minutes\n" .
    "Severity: P1 - CRITICAL"

| table _time, queue_name, avg_sl, contacts_in_queue, agents_available, 
         supervisor_name, supervisor_email, recommended_actions, alert_message
```

**Workflow Steps:**

```
WF-002: Queue Service Level Recovery Workflow
+-----------------------------------------------------------------+
| STEP 1: DETECTION (Automated - Splunk Alert)                   |
+-----------------------------------------------------------------+
| * Service Level < 70% detected                                  |
| * Verified sustained for 15+ minutes                            |
| * Alert triggered with queue details                            |
| Time: T+0 (immediate)                                           |
+-----------------------------------------------------------------+
                          v
+-----------------------------------------------------------------+
| STEP 2: AUTOMATED TRIAGE (AI Analysis)                         |
+-----------------------------------------------------------------+
| * Check agent availability status                               |
| * Correlate with network quality (ThousandEyes/Calling QoE)    |
| * Check historical patterns (normal vs abnormal)                |
| * Determine root cause category:                                |
|   - Staffing shortage                                          |
|   - Skill mismatch                                             |
|   - Network/system issue                                       |
|   - Abnormal call volume spike                                 |
| Time: T+2 minutes                                               |
+-----------------------------------------------------------------+
                          v
+-----------------------------------------------------------------+
| STEP 3: NOTIFICATION (Multi-Channel)                           |
+-----------------------------------------------------------------+
| * Email -> Supervisor + Team Lead                                |
| * Webex Teams -> CC-Operations room                             |
| * SMS -> On-call supervisor (P1 only)                           |
| * ServiceNow -> Auto-create incident ticket                     |
| * Dashboard -> Red alert indicator                              |
| Time: T+3 minutes                                               |
+-----------------------------------------------------------------+
                          v
+-----------------------------------------------------------------+
| STEP 4: AUTOMATED REMEDIATION (If Applicable)                  |
+-----------------------------------------------------------------+
| IF staffing shortage:                                           |
|   * Send notifications to idle agents in adjacent queues        |
|   * Offer overtime to off-duty agents (auto-text)              |
|   * Enable overflow routing to backup queue                     |
|                                                                 |
| IF skill mismatch:                                             |
|   * Temporarily lower skill requirements via API                |
|   * Enable skill relaxation in Flow Designer                    |
|                                                                 |
| IF network issue:                                              |
|   * Cross-reference with ThousandEyes alerts                   |
|   * Trigger WF-001 (network quality workflow)                  |
|   * Enable alternate PSTN routing                              |
| Time: T+5 minutes                                               |
+-----------------------------------------------------------------+
                          v
+-----------------------------------------------------------------+
| STEP 5: SUPERVISOR INTERVENTION                                |
+-----------------------------------------------------------------+
| * Supervisor acknowledges alert (required within 5 minutes)     |
| * Reviews recommended actions                                   |
| * Takes manual corrective action:                              |
|   - Reassign agents from other queues                          |
|   - Adjust break schedules                                     |
|   - Call in backup staff                                       |
|   - Modify IVR routing temporarily                             |
| Time: T+10 minutes (manual)                                     |
+-----------------------------------------------------------------+
                          v
+-----------------------------------------------------------------+
| STEP 6: MONITORING & VALIDATION                                |
+-----------------------------------------------------------------+
| * Continuous monitoring every 2 minutes                         |
| * Track service level recovery                                 |
| * Measure time to recovery (TTR)                               |
|                                                                 |
| IF Service Level returns to > 85% for 15 minutes:              |
|   -> Auto-close incident                                        |
|   -> Send recovery notification                                 |
|                                                                 |
| IF Service Level still < 70% after 30 minutes:                 |
|   -> Escalate to P1                                             |
|   -> Notify Contact Center Manager                              |
|   -> Invoke business continuity plan                            |
| Time: T+15 to T+30 minutes                                      |
+-----------------------------------------------------------------+
```

**Alert XML Configuration:**

```xml
<alert>
  <title>WF-002: Queue Service Level Critical</title>
  <description>Automated detection and remediation of queue service level degradation</description>
  <search>
    <query>
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=-20m
| bin _time span=5m
| stats avg(service_level_pct) as avg_sl, latest(contacts_in_queue) as contacts_in_queue, latest(agents_available) as agents_available by _time, queue_name
| where avg_sl &lt; 70
| streamstats count as consecutive_periods by queue_name reset_after="(avg_sl &gt;= 70)"
| where consecutive_periods &gt;= 3
| lookup wxcc_queues_lookup queue_name OUTPUT supervisor_email
| eval alert_message = "Queue: " . queue_name . " | SL: " . round(avg_sl,1) . "% | Contacts: " . contacts_in_queue
    </query>
  </search>
  <schedule>
    <cron_schedule>*/5 * * * *</cron_schedule>
  </schedule>
  <actions>
    <email>
      <to>$result.supervisor_email$</to>
      <cc>cc-operations@abhavtech.com</cc>
      <subject>CRITICAL: Queue Service Level Alert - $result.queue_name$</subject>
      <message>$result.alert_message$</message>
      <priority>1</priority>
    </email>
    <webhook>
      <url>https://webex-teams.abhavtech.com/webhook/cc-alerts</url>
      <method>POST</method>
      <payload>{"queue": "$result.queue_name$", "sl": "$result.avg_sl$", "severity": "P1"}</payload>
    </webhook>
    <script>
      <filename>wxcc_auto_remediation.py</filename>
      <args>--queue=$result.queue_name$ --action=staffing_shortage</args>
    </script>
  </actions>
</alert>
```

### 8.3 WF-003: Agent Burnout Prevention Workflow

**Trigger:** Agent burnout risk score > 75 (from ML model in Section 6.2)

**Workflow:**

```python
## wxcc_burnout_intervention.py 
## Automated agent wellness intervention 

def execute_burnout_intervention(agent_email, burnout_score, metrics):
    """
    Automated intervention for high-risk burnout agents
    
    Actions based on burnout score:
    75-85: Supervisor notification + schedule review
    85-95: Mandatory break + schedule adjustment
    95-100: Immediate relief + wellness referral
    """
    
    if burnout_score >= 95:
## CRITICAL: Immediate intervention 
        actions = [
            "force_auxiliary_code_break",  # Put agent in mandatory 15-min break
            "notify_supervisor_immediate",
            "notify_hr_wellness_team",
            "schedule_next_day_off"
        ]
        severity = "CRITICAL"
        
    elif burnout_score >= 85:
## HIGH: Schedule adjustment needed 
        actions = [
            "notify_supervisor_urgent",
            "suggest_extended_break",
            "review_tomorrow_schedule",
            "recommend_wellness_resources"
        ]
        severity = "HIGH"
        
    else:  # 75-84
## MEDIUM: Monitoring and early intervention 
        actions = [
            "notify_supervisor_standard",
            "flag_for_schedule_review",
            "monitor_next_72_hours"
        ]
        severity = "MEDIUM"
    
## Execute actions 
    for action in actions:
        execute_action(action, agent_email, metrics)
    
## Log to Splunk for tracking 
    log_intervention(agent_email, burnout_score, actions, severity)
```

### 8.4 WF-004: Predicted CSAT Recovery Workflow

**Trigger:** Predicted CSAT < 3.5 immediately after call ends (from ML model in Section 6.3)

**Workflow:**

```
+-----------------------------------------------------------------+
| STEP 1: POST-CALL CSAT PREDICTION (T+0)                        |
+-----------------------------------------------------------------+
| * Call ends -> webhook triggers                                  |
| * ML model predicts CSAT score                                  |
| * If predicted CSAT < 3.5 -> trigger recovery workflow          |
+-----------------------------------------------------------------+
                          v
+-----------------------------------------------------------------+
| STEP 2: RECOVERY ACTION DETERMINATION (T+30 sec)               |
+-----------------------------------------------------------------+
| Predicted CSAT 3.0-3.4:                                        |
|   -> Email apology with discount code (10% off next purchase)   |
|                                                                 |
| Predicted CSAT 2.5-2.9:                                        |
|   -> Supervisor callback within 2 hours                         |
|   -> Email apology + 20% discount                               |
|                                                                 |
| Predicted CSAT < 2.5:                                          |
|   -> Immediate manager callback (within 30 minutes)             |
|   -> Email apology + 25% discount + priority support            |
|   -> Flag for root cause analysis                               |
+-----------------------------------------------------------------+
                          v
+-----------------------------------------------------------------+
| STEP 3: CRM INTEGRATION (T+1 min)                              |
+-----------------------------------------------------------------+
| * Create Salesforce case with "CSAT Recovery" type             |
| * Attach call recording link                                    |
| * Add predicted CSAT score                                      |
| * Assign to appropriate recovery team/supervisor               |
+-----------------------------------------------------------------+
                          v
+-----------------------------------------------------------------+
| STEP 4: CUSTOMER OUTREACH (T+5 to T+120 min)                   |
+-----------------------------------------------------------------+
| * Send templated apology email immediately                      |
| * Schedule supervisor/manager callback                          |
| * Offer compensation (discount/credit)                         |
| * Provide direct escalation contact                            |
+-----------------------------------------------------------------+
```

**Splunk Alert for CSAT Recovery:**

```spl
## Scheduled Search: CSAT Recovery Workflow Trigger 
## Runs every 2 minutes 

index=cisco_ai_events_index sourcetype=mltk:prediction:csat earliest=-5m
| where predicted_csat < 3.5

## Lookup customer contact info from task 
| lookup wxcc_tasks task_id OUTPUT customer_phone, customer_email, customer_name

## Lookup agent who handled call 
| lookup wxcc_agents_lookup agent_email OUTPUT agent_name, supervisor_email

## Determine recovery action 
| eval recovery_action = case(
    predicted_csat < 2.5, "immediate_manager_callback",
    predicted_csat < 3.0, "supervisor_callback_2hr",
    1=1, "email_apology_discount"
  )

| eval discount_amount = case(
    predicted_csat < 2.5, "25%",
    predicted_csat < 3.0, "20%",
    1=1, "10%"
  )

## Create Salesforce case via API 
| collect index=cisco_ucapps_index sourcetype=wxcc:csat:recovery

## Send to CRM integration 
| script create_salesforce_case.py 
    --customer_email="$result.customer_email$" 
    --case_type="CSAT_Recovery" 
    --priority="High"
    --predicted_csat="$result.predicted_csat$"
```

---

## 9. Agent Experience Monitoring

### 9.1 Agent Desktop Performance Tracking

**Key Metrics:**

```spl
## Agent Desktop Health Dashboard 
## Tracks agent application performance and user experience 

index=cisco_ucapps_index sourcetype=wxcc:agent:performance earliest=-4h
| eval desktop_load_time = random() % 5000 + 1000  # Simulated - replace with actual desktop metrics
| eval screen_pop_latency = random() % 3000 + 500

## Performance categories 
| eval desktop_health = case(
    desktop_load_time < 2000, "Excellent",
    desktop_load_time < 4000, "Good",
    desktop_load_time < 6000, "Fair",
    1=1, "Poor"
  )

| stats 
    avg(desktop_load_time) as avg_load_time,
    avg(screen_pop_latency) as avg_screen_pop,
    count(eval(desktop_health="Poor")) as poor_performance_count,
    dc(agent_name) as unique_agents
    by site_id

| eval avg_load_seconds = round(avg_load_time / 1000, 2)
| table site_id, avg_load_seconds, avg_screen_pop, poor_performance_count, unique_agents
```

### 9.2 Agent State Management Analytics

**Track agent state transitions for efficiency:**

```spl
## Agent State Transition Analysis 
## Identifies excessive state changes (potential confusion or system issues) 

index=cisco_ucapps_index sourcetype=wxcc:webhook:event eventType="agentSession:stateChanged" earliest=-8h
| bin _time span=1h

| stats 
    count as state_changes,
    dc(data.currentState) as unique_states,
    values(data.currentState) as states_used
    by _time, data.agentName, data.teamName

## Flag agents with excessive transitions (>30 per hour = potential issue) 
| where state_changes > 30

| eval issue_type = case(
    state_changes > 50, "Excessive state changes - investigate system or training issue",
    unique_states > 5, "Using too many states - simplify workflow",
    1=1, "Monitor"
  )

| sort - state_changes
| table _time, data.agentName, data.teamName, state_changes, unique_states, issue_type
```

### 9.3 Agent Utilization Optimization

**Balanced workload analysis:**

```spl
## Agent Workload Balance Report 
## Identifies over-utilized and under-utilized agents 

index=cisco_ucapps_index sourcetype=wxcc:agent:performance earliest=-24h
| bin _time span=1h

| stats 
    avg(occupancy_rate) as avg_occupancy,
    sum(tasks_handled) as total_tasks,
    avg(idle_time_pct) as avg_idle
    by _time, agent_name, team_name

## Calculate team averages for comparison 
| eventstats 
    avg(avg_occupancy) as team_avg_occupancy,
    avg(total_tasks) as team_avg_tasks
    by _time, team_name

| eval utilization_status = case(
    avg_occupancy > team_avg_occupancy + 15, "Over-utilized",
    avg_occupancy < team_avg_occupancy - 15, "Under-utilized",
    1=1, "Balanced"
  )

| where utilization_status != "Balanced"

| table _time, agent_name, team_name, avg_occupancy, team_avg_occupancy, 
         total_tasks, utilization_status

## Recommendations 
| eval recommendation = case(
    utilization_status="Over-utilized", "Reduce queue assignment or provide relief",
    utilization_status="Under-utilized", "Add to additional queues or provide training",
    1=1, "No action"
  )
```

---

## 10. Customer Experience Analytics

### 10.1 Customer Journey Mapping

**Track multi-touch customer interactions:**

```spl
## Customer Journey Reconstruction 
## Maps all interactions for a customer across channels 

index=cisco_ucapps_index sourcetype=wxcc:task:details earliest=-30d
| eval customer_id = coalesce(ani, customer_email, customer_account_id)

## Group all interactions by customer 
| stats 
    count as total_interactions,
    values(channelType) as channels_used,
    values(queueName) as queues_contacted,
    values(wrapUpReason) as outcomes,
    earliest(_time) as first_contact,
    latest(_time) as last_contact,
    avg(handleDuration) as avg_handle_time,
    count(eval(status="abandoned")) as abandoned_count
    by customer_id

## Calculate customer experience score 
| eval customer_experience_score = case(
    abandoned_count > 0, max(0, 100 - (abandoned_count * 20)),
    total_interactions = 1, 100,  # First call resolution
    total_interactions = 2, 85,
    total_interactions <= 4, 70,
    1=1, 50  # Multiple repeated contacts = poor experience
  )

| eval customer_segment = case(
    customer_experience_score >= 90, "Promoters",
    customer_experience_score >= 70, "Passives",
    1=1, "Detractors"
  )

| table customer_id, total_interactions, channels_used, customer_experience_score, customer_segment
| sort - customer_experience_score
```

### 10.2 Repeat Contact Analysis

**Identify customers calling back due to unresolved issues:**

```spl
## Repeat Contact Detection (within 24 hours) 
## High repeat rate indicates poor first contact resolution 

index=cisco_ucapps_index sourcetype=wxcc:task:details earliest=-7d
| eval customer_id = coalesce(ani, customer_email)
| sort customer_id, _time

## Identify contacts within 24 hours of previous contact 
| streamstats window=2 
    earliest(_time) as prev_contact_time 
    by customer_id

| eval time_since_last_contact = (_time - prev_contact_time) / 3600  # Hours
| where time_since_last_contact <= 24

## Analyze patterns 
| stats 
    count as repeat_contacts,
    values(queueName) as queues_involved,
    values(wrapUpReason) as previous_outcomes,
    avg(time_since_last_contact) as avg_hours_between_contacts
    by customer_id

| where repeat_contacts >= 2

## Categorize repeat reasons 
| eval repeat_category = case(
    repeat_contacts >= 3, "Chronic issue - escalate",
    avg_hours_between_contacts < 2, "Immediate callback - dissatisfaction",
    1=1, "Follow-up contact"
  )

| sort - repeat_contacts
| table customer_id, repeat_contacts, avg_hours_between_contacts, queues_involved, repeat_category
```

### 10.3 Peak Hour Wait Time Analysis

**Identify capacity gaps during peak periods:**

```spl
## Peak Hour Capacity Analysis 
## Identifies when queue wait times exceed acceptable thresholds 

index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=-30d
| eval hour_of_day = strftime(_time, "%H")
| eval day_of_week = strftime(_time, "%A")

| stats 
    avg(average_queue_wait) as avg_wait_time,
    max(average_queue_wait) as max_wait_time,
    avg(contacts_in_queue) as avg_queue_depth,
    avg(service_level_pct) as avg_service_level
    by queue_name, day_of_week, hour_of_day

## Identify problematic time slots 
| where avg_wait_time > 120  # More than 2 minutes average

| eval capacity_issue = case(
    avg_service_level < 70, "Critical - immediate staffing needed",
    avg_service_level < 80, "Warning - review staffing",
    1=1, "Monitor"
  )

| sort queue_name, day_of_week, hour_of_day
| table queue_name, day_of_week, hour_of_day, avg_wait_time, avg_queue_depth, 
         avg_service_level, capacity_issue
```

---

## 11. AI/Bot Performance Monitoring

### 11.1 Webex AI Agent (Virtual Agent) Analytics

**IVR Containment Tracking:**

```spl
## AI Virtual Agent Performance Dashboard 
## Tracks IVR containment, escalation rate, resolution accuracy 

index=cisco_ucapps_index sourcetype=wxcc:ai:analytics earliest=-24h
| stats 
    count as total_ai_interactions,
    count(eval(resolution_type="ai_resolved")) as ai_resolved,
    count(eval(resolution_type="escalated_to_agent")) as escalated_to_agent,
    avg(interaction_duration) as avg_ai_duration,
    values(intent_detected) as intents_handled
    by entry_point_name

| eval containment_rate = round((ai_resolved / total_ai_interactions) * 100, 1)
| eval escalation_rate = round((escalated_to_agent / total_ai_interactions) * 100, 1)

## Performance rating 
| eval ai_performance = case(
    containment_rate >= 35, "Exceeding Target",
    containment_rate >= 25, "Meeting Expectations",
    containment_rate >= 15, "Below Target",
    1=1, "Critical - Review Training"
  )

| table entry_point_name, total_ai_interactions, containment_rate, escalation_rate, 
         avg_ai_duration, ai_performance
```

### 11.2 Intent Recognition Accuracy

**Monitor AI understanding of customer requests:**

```spl
## Intent Recognition Accuracy Tracking 
## Compares AI-detected intent vs actual resolution category 

index=cisco_ucapps_index sourcetype=wxcc:ai:analytics earliest=-7d
| where isnotnull(intent_detected) AND isnotnull(actual_resolution_category)

## Calculate accuracy by intent 
| stats 
    count as total_attempts,
    count(eval(intent_detected=actual_resolution_category)) as correct_detections
    by intent_detected

| eval accuracy_rate = round((correct_detections / total_attempts) * 100, 1)

| where accuracy_rate < 80  # Flag intents performing poorly

| eval recommendation = case(
    accuracy_rate < 60, "Retrain intent with more examples",
    accuracy_rate < 80, "Review and optimize training phrases",
    1=1, "Monitor"
  )

| sort - total_attempts
| table intent_detected, total_attempts, correct_detections, accuracy_rate, recommendation
```

### 11.3 Agent Assist Effectiveness

**Track agent acceptance of AI suggestions:**

```spl
## Agent Assist Acceptance Tracking 
## Measures how often agents use AI-suggested responses 

index=cisco_ucapps_index sourcetype=wxcc:agent:assist earliest=-7d
| stats 
    count as suggestions_presented,
    count(eval(suggestion_accepted="true")) as suggestions_accepted,
    avg(suggestion_confidence_score) as avg_confidence
    by agent_name, suggestion_type

| eval acceptance_rate = round((suggestions_accepted / suggestions_presented) * 100, 1)

## Identify low-adoption agents (training opportunity) 
| where acceptance_rate < 40

| eval recommendation = case(
    acceptance_rate < 20, "Agent training needed on Agent Assist",
    avg_confidence < 0.7, "Improve AI model confidence",
    1=1, "Monitor and coach"
  )

| sort - suggestions_presented
| table agent_name, suggestion_type, suggestions_presented, acceptance_rate, 
         avg_confidence, recommendation
```

---

## 12. Compliance & Recording Monitoring

### 12.1 Recording Capture Compliance

**Ensure 100% call recording for compliance:**

```spl
## Recording Compliance Verification 
## Ensures all calls are recorded as required 

index=cisco_ucapps_index sourcetype=wxcc:task:details earliest=-24h
| where channelType="telephony"

## Join with recording metadata 
| join type=left taskId 
    [search index=cisco_ucapps_index sourcetype=wxcc:recording:metadata
    | fields taskId, recordingId, recordingStatus, recordingUrl]

| eval recording_compliance = case(
    isnotnull(recordingId) AND recordingStatus="available", "Compliant",
    isnotnull(recordingId) AND recordingStatus="processing", "Processing",
    isnull(recordingId), "MISSING - CRITICAL",
    recordingStatus="failed", "FAILED - CRITICAL",
    1=1, "Unknown"
  )

## Calculate compliance rate 
| stats 
    count as total_calls,
    count(eval(recording_compliance="Compliant")) as recorded_calls,
    count(eval(recording_compliance IN ("MISSING - CRITICAL", "FAILED - CRITICAL"))) as critical_issues
    by queueName

| eval compliance_rate = round((recorded_calls / total_calls) * 100, 2)

| where compliance_rate < 100 OR critical_issues > 0

| eval alert_level = case(
    compliance_rate < 95, "CRITICAL",
    compliance_rate < 99, "WARNING",
    1=1, "INFO"
  )

| table queueName, total_calls, recorded_calls, critical_issues, compliance_rate, alert_level
```

**Alert for Recording Failures:**

```xml
<alert>
  <title>COMPLIANCE ALERT: Recording Capture Failure</title>
  <search>
    <query>
index=cisco_ucapps_index sourcetype=wxcc:task:details earliest=-1h
| where channelType="telephony"
| join type=left taskId [search index=cisco_ucapps_index sourcetype=wxcc:recording:metadata | fields taskId, recordingStatus]
| where isnull(recordingStatus) OR recordingStatus="failed"
| stats count by queueName
    </query>
  </search>
  <schedule>
    <cron_schedule>*/15 * * * *</cron_schedule>
  </schedule>
  <actions>
    <email>
      <to>compliance@abhavtech.com,cc-operations@abhavtech.com</to>
      <subject>CRITICAL: Recording Compliance Failure Detected</subject>
      <priority>1</priority>
    </email>
  </actions>
</alert>
```

### 12.2 PCI-DSS Compliance Monitoring (Billing Queue)

**Verify PCI redaction on Billing queue calls:**

```spl
## PCI-DSS Compliance Check - Billing Queue 
## Ensures credit card information is properly redacted 

index=cisco_ucapps_index sourcetype=wxcc:recording:metadata earliest=-24h
| where queueName="Billing_CSQ"

| stats 
    count as total_recordings,
    count(eval(pci_redaction_enabled="true")) as pci_protected,
    count(eval(pci_redaction_status="failed")) as pci_failures
    by queueName

| eval pci_compliance_rate = round((pci_protected / total_recordings) * 100, 2)

| where pci_compliance_rate < 100

| eval severity = case(
    pci_failures > 0, "CRITICAL - PCI violation risk",
    pci_compliance_rate < 100, "WARNING - Review configuration",
    1=1, "INFO"
  )

| table queueName, total_recordings, pci_protected, pci_failures, pci_compliance_rate, severity
```

### 12.3 Data Residency Compliance

**Verify recording storage in correct region:**

```spl
## Data Residency Compliance Report 
## Ensures recordings stored in compliant regions 

index=cisco_ucapps_index sourcetype=wxcc:recording:metadata earliest=-7d
| lookup wxcc_queues_lookup queueName OUTPUT site_id
| lookup sites_lookup site_id OUTPUT region, required_storage_region

## Check if recording storage matches required region 
| eval compliant = if(recording_storage_region=required_storage_region, "Yes", "No")

| stats 
    count as total_recordings,
    count(eval(compliant="Yes")) as compliant_recordings,
    count(eval(compliant="No")) as non_compliant_recordings
    by region, required_storage_region, recording_storage_region

| where non_compliant_recordings > 0

| eval compliance_issue = "Recordings stored in " . recording_storage_region . " but should be in " . required_storage_region

| table region, total_recordings, non_compliant_recordings, compliance_issue
```

---

## 13. Testing & Validation

### 13.1 Integration Testing Checklist

**Component Testing:**

```
+-----------------------------------------------------------------+
| WxCC API Integration Testing                                    |
+-----------------------------------------------------------------+
| [ ] OAuth Token Generation                                       |
|   * Generate initial access token                              |
|   * Verify token expiration (14 days)                          |
|   * Test token refresh process                                 |
|   * Validate all required scopes granted                       |
|                                                                 |
| [ ] GraphQL Search API                                           |
|   * Query task data (last 24 hours)                            |
|   * Verify aggregation functions                               |
|   * Test filtering capabilities                                |
|   * Validate pagination (>1000 results)                        |
|   * Confirm rate limiting (120 req/min)                        |
|                                                                 |
| [ ] Agent Statistics API                                         |
|   * Query agent sessions                                        |
|   * Verify state change tracking                               |
|   * Test team filtering                                        |
|   * Validate metric calculations                               |
|                                                                 |
| [ ] Queue Statistics API                                         |
|   * Query real-time queue metrics                              |
|   * Verify queue performance data                              |
|   * Test multiple queue retrieval                              |
|                                                                 |
| [ ] Captures API (Recordings)                                    |
|   * Retrieve recording metadata                                |
|   * Download recording file                                    |
|   * Verify PCI redaction status                                |
|                                                                 |
| [ ] Webhooks                                                     |
|   * Configure webhook subscription                             |
|   * Test task:created event                                    |
|   * Test task:ended event                                      |
|   * Test agentSession:stateChanged event                       |
|   * Verify payload structure                                   |
|   * Confirm delivery to Splunk HEC                             |
+-----------------------------------------------------------------+

+-----------------------------------------------------------------+
| Splunk Data Ingestion Testing                                   |
+-----------------------------------------------------------------+
| [ ] HTTP Event Collector (HEC)                                   |
|   * Verify HEC token authentication                            |
|   * Test event submission                                      |
|   * Validate sourcetype assignment                             |
|   * Check index assignment                                     |
|                                                                 |
| [ ] Data Parsing & Field Extraction                              |
|   * Verify JSON parsing                                        |
|   * Check field aliases                                        |
|   * Test calculated fields                                     |
|   * Validate lookup enrichment                                 |
|                                                                 |
| [ ] OpenTelemetry Collector                                      |
|   * Test webhook receiver                                      |
|   * Verify data transformation                                 |
|   * Check batch processing                                     |
|   * Validate export to Splunk                                  |
+-----------------------------------------------------------------+
```

### 13.2 End-to-End Test Scenarios

**Scenario 1: High Call Volume Queue Degradation**

```
Test Objective: Verify automated alerting and workflow execution
when service level drops below threshold

Steps:
1. Simulate high call volume (300+ calls/hour to Sales queue)
2. Reduce available agents to trigger SL degradation
3. Expected Results:
   [ ] WF-002 alert triggered within 15 minutes
   [ ] Email sent to supervisor
   [ ] Webex Teams notification posted
   [ ] ServiceNow incident auto-created
   [ ] Dashboard shows red alert indicator
   [ ] Automated remediation attempted
   [ ] Recovery tracked and validated

Validation:
| search index=cisco_ucapps_index sourcetype=wxcc:queue:metrics 
    queue_name="Sales_India_CSQ" earliest=-30m
| stats avg(service_level_pct) as avg_sl
| where avg_sl < 70
```

**Scenario 2: Agent Burnout Detection**

```
Test Objective: Verify ML model detects burnout risk and triggers intervention

Steps:
1. Simulate agent working >8 hours with >90% occupancy
2. Inject agent performance data into Splunk
3. Expected Results:
   [ ] Burnout detection model scores agent >75
   [ ] Alert sent to supervisor
   [ ] HR wellness team notified (if score >95)
   [ ] Agent flagged for schedule review
   [ ] Intervention logged in tracking system

Validation:
| search index=cisco_ai_events_index sourcetype=mltk:prediction:burnout 
    agent_name="Test Agent" earliest=-1h
| table burnout_score, actions_taken
```

**Scenario 3: Recording Compliance Failure**

```
Test Objective: Verify immediate detection of recording failures

Steps:
1. Simulate call completion without recording
2. Webhook notification sent with missing recordingId
3. Expected Results:
   [ ] Compliance alert triggered immediately
   [ ] Email to compliance team
   [ ] Dashboard shows compliance violation
   [ ] Incident created with P1 severity
   [ ] Recording system health check initiated

Validation:
| search index=cisco_ucapps_index sourcetype=wxcc:task:details 
    taskId="TEST-12345" earliest=-15m
| join type=left taskId 
    [search index=cisco_ucapps_index sourcetype=wxcc:recording:metadata]
| eval compliance_status = if(isnull(recordingId), "FAILED", "OK")
```

### 13.3 Performance Testing

**Load Testing Parameters:**

```
GraphQL API Load Test:
+-----------------------------------------------------------------+
| Concurrent Users:   175 agents × 6 events/hour = ~18 req/min   |
| Peak Load:          300 req/min (lunch rush, end of shift)     |
| Test Duration:      60 minutes sustained load                   |
| Success Criteria:   >95% success rate, <5 sec response time    |
+-----------------------------------------------------------------+

Webhook Processing Test:
+-----------------------------------------------------------------+
| Event Rate:         1,000 events/hour (normal)                 |
| Peak Rate:          3,000 events/hour (shift change)           |
| Processing Latency: <2 seconds from event to Splunk visibility |
| Success Criteria:   100% delivery, no dropped events           |
+-----------------------------------------------------------------+
```

---

## 14. Operational Procedures

### 14.1 Daily Health Check (09:00 Local Time)

**Contact Center Operations Daily Checklist:**

```
[ ] OVERNIGHT INCIDENTS (Review 18:00 previous day -> 09:00 current day)
  * Check ServiceNow for WxCC-related incidents
  * Review P1/P2 alerts in Splunk
  * Verify all incidents properly closed or escalated
  
[ ] DATA INGESTION HEALTH
  * Splunk search:
    index=cisco_ucapps_index sourcetype=wxcc:* earliest=-24h
    | stats count by sourcetype
    | where count < 1000
  * Expected: >10,000 events/day for wxcc:queue:metrics
  * Expected: >5,000 events/day for wxcc:agent:performance
  * Action if low: Check OAuth token, API connectivity
  
[ ] RECORDING COMPLIANCE (24-hour check)
  * 100% capture rate required
  * Search:
    index=cisco_ucapps_index sourcetype=wxcc:task:details 
    earliest=-24h channelType="telephony"
    | join type=left taskId 
        [search index=cisco_ucapps_index sourcetype=wxcc:recording:metadata]
    | stats count(eval(isnull(recordingId))) as missing_recordings
  * Action if missing_recordings > 0: Escalate to P1 immediately
  
[ ] QUEUE PERFORMANCE (Yesterday's metrics)
  * Service Level by queue
  * Abandonment rate
  * Average handle time trends
  * Identify queues needing attention today
  
[ ] AGENT PERFORMANCE OUTLIERS
  * Identify agents with burnout risk score >60
  * Review agents with occupancy <60% or >90%
  * Check agents with excessive state changes
  
[ ] AI/BOT PERFORMANCE (Phase 2B)
  * IVR containment rate (target: 35%)
  * Intent recognition accuracy (target: >90%)
  * Agent Assist acceptance rate (target: >60%)
  
[ ] ALERTS & AUTOMATION
  * Review all ML model predictions from yesterday
  * Verify automated workflows executed correctly
  * Check for any stuck/failed automation jobs
  
[ ] DASHBOARD HEALTH
  * Verify all executive dashboards loading
  * Check real-time data freshness (<5 min old)
  * Validate drilldown functionality
```

### 14.2 Weekly Maintenance (Monday 02:00 UTC)

**Scheduled Weekly Tasks:**

```
[ ] ML MODEL RETRAINING
  * Queue wait time prediction model
  * Agent burnout detection model
  * CSAT prediction model
  * Optimal staffing calculator
  * Validate model accuracy post-training
  
[ ] CAPACITY PLANNING REVIEW
  * Run Erlang C staffing forecast for upcoming week
  * Compare forecast vs scheduled staffing
  * Identify gaps and submit staffing requests
  
[ ] COMPLIANCE AUDIT
  * 7-day recording compliance report
  * PCI redaction verification (Billing queue)
  * Data residency compliance check
  * Generate audit evidence package
  
[ ] PERFORMANCE TREND ANALYSIS
  * Week-over-week queue performance
  * Month-over-month improvements
  * Identify deteriorating trends
  
[ ] LOOKUP TABLE UPDATES
  * Update agent roster (new hires, terminations)
  * Refresh team assignments
  * Update queue configurations
  * Sync with HR system data
```

### 14.3 Monthly Maintenance

**First Monday of Month - Strategic Review:**

```
[ ] STORAGE CAPACITY PLANNING
  * Current Splunk index usage:
    | dbinspect index=cisco_ucapps_index
    | stats sum(sizeOnDiskMB) as total_size_mb
  * Project next 90 days growth
  * Request additional capacity if needed
  
[ ] LICENSE UTILIZATION REVIEW
  * WxCC agent license usage
  * API call consumption vs limits
  * Splunk ingestion volume vs license
  
[ ] AI MODEL PERFORMANCE REVIEW
  * Calculate prediction accuracy trends
  * Compare predictions vs actual outcomes
  * Identify models needing optimization
  
[ ] AUTOMATION EFFECTIVENESS
  * Count of automated remediations
  * Success rate of automated actions
  * Time saved by automation
  
[ ] CONTACT CENTER KPI TRENDS
  * Service Level trend (6-month)
  * CSAT trend (6-month)
  * FCR trend (6-month)
  * AHT trend (6-month)
  * Benchmark against industry standards
```

### 14.4 Incident Response Procedures

**P1 Incident: Service Level Critical (<70% for 30+ minutes)**

```
TIME    ACTION                              RESPONSIBLE
-----------------------------------------------------------------
T+0     Alert triggered by Splunk           Automated
T+5     Supervisor acknowledges alert        Supervisor
T+10    Initial triage completed            Supervisor
        * Check agent availability
        * Review queue depth
        * Correlate with network issues
T+15    Remediation action taken            Supervisor
        * Reassign agents
        * Adjust breaks
        * Call in backup staff
T+30    Escalate to Manager if unresolved   Supervisor -> Manager
T+45    Invoke business continuity plan     Manager
        * Enable overflow routing
        * Engage backup contact center
        * Customer communication plan
T+60    Executive notification              Manager -> VP Operations
        
RESOLUTION:
        * Service Level returns to >80% for 15 consecutive minutes
        * Incident auto-closes
        * Post-incident review scheduled within 24 hours
```

**P1 Incident: Recording System Failure**

```
TIME    ACTION                              RESPONSIBLE
-----------------------------------------------------------------
T+0     Missing recordings detected          Automated
T+2     Compliance team alerted             Automated
T+5     Recording platform health check     Compliance Admin
T+10    Vendor support engaged              Compliance Admin
T+15    Backup recording activated          Compliance Admin
        (if available)
T+20    Call flow modified to announce      WxCC Admin
        recording unavailability (if required
        by regulation)
T+30    Executive notification              Compliance Manager
        
CRITICAL:
        * No calls can be handled on Billing queue without recording
        * Consider suspending Billing queue if recording unavailable
        * Legal/compliance must approve any exceptions
```

---

## 15. Troubleshooting

### 15.1 Common Issues & Resolution

**Issue 1: No Queue Metrics in Splunk**

```
SYMPTOMS:
  * Dashboard shows "No results found"
  * index=cisco_ucapps_index sourcetype=wxcc:queue:metrics returns 0 events
  
DIAGNOSIS:
  Step 1: Check OAuth token validity
  | inputlookup wxcc_oauth_tokens.json
  | eval expires_at_readable = strftime(expires_at, "%Y-%m-%d %H:%M:%S")
  | table expires_at_readable, access_token
  
  Step 2: Test GraphQL API connectivity
  curl -X POST https://api.wxcc-us1.cisco.com/search \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"query": "query { task(from: 1000000000000, to: 9999999999999) { tasks { id } } }"}'
  
  Step 3: Check scripted input status
  $SPLUNK_HOME/bin/splunk list exec
  
  Step 4: Review Python script logs
  $SPLUNK_HOME/var/log/splunk/splunkd.log | grep wxcc_queue_metrics
  
RESOLUTION:
  * If token expired: Run OAuth refresh manually
  * If API unreachable: Check firewall rules, DNS resolution
  * If script disabled: Re-enable in inputs.conf
  * If script error: Review error message, fix syntax/logic
```

**Issue 2: Webhooks Not Delivering to Splunk**

```
SYMPTOMS:
  * Real-time events missing
  * No task:created or agentSession:stateChanged events
  
DIAGNOSIS:
  Step 1: Verify webhook subscription active
  * Login to WxCC Admin Portal
  * Check Integrations -> Webhooks -> Status
  
  Step 2: Test HEC endpoint
  curl -k https://splunk-hec.abhavtech.com:8088/services/collector/event \
    -H "Authorization: Splunk YOUR_HEC_TOKEN" \
    -d '{"event": "test webhook", "sourcetype": "wxcc:webhook:event"}'
  
  Step 3: Check HEC logs
  index=_internal source=*http_input* "wxcc_webhooks"
  
  Step 4: Verify network connectivity from WxCC to Splunk HEC
  * Check firewall allows inbound TCP 8088
  * Verify SSL certificate valid
  
RESOLUTION:
  * If webhook deleted: Recreate subscription
  * If HEC unreachable: Fix firewall/network
  * If SSL error: Update certificate or use HTTP (non-prod only)
```

**Issue 3: ML Model Inaccurate Predictions**

```
SYMPTOMS:
  * Queue wait time predictions consistently wrong
  * CSAT predictions don't correlate with actual scores
  * Burnout detection flagging healthy agents
  
DIAGNOSIS:
  Step 1: Check training data quality
  | inputlookup wxcc_wait_time_training_data.csv
  | stats count, min(_time), max(_time)
  
  Step 2: Validate feature correlation
  | inputlookup wxcc_wait_time_training_data.csv
  | correlate avg_wait_time call_volume agents_available
  
  Step 3: Check model performance metrics
  | apply wxcc_wait_time_prediction_model
  | eval error = abs(predicted_wait_time - actual_wait_time)
  | stats avg(error) as mean_error, stdev(error) as stdev_error
  
RESOLUTION:
  * If insufficient training data (<30 days): Collect more data
  * If features not correlated: Add/remove features
  * If concept drift (patterns changed): Retrain model
  * If high variance: Increase training data, reduce complexity
```

### 15.2 Diagnostic Searches

**Queue Performance Health Check:**

```spl
index=cisco_ucapps_index sourcetype=wxcc:queue:metrics earliest=-1h
| stats 
    latest(service_level_pct) as current_sl,
    latest(average_speed_to_answer) as current_asa,
    latest(abandonment_rate) as current_abandonment,
    latest(contacts_in_queue) as contacts_waiting,
    latest(agents_available) as agents_available
    by queue_name
| eval health_status = case(
    current_sl < 70, "🔴 CRITICAL",
    current_sl < 85, "🟡 WARNING",
    1=1, "🟢 HEALTHY"
  )
| table queue_name, health_status, current_sl, current_asa, 
         current_abandonment, contacts_waiting, agents_available
| sort - current_sl
```

**Agent State Validity Check:**

```spl
## Detect agents stuck in same state for abnormally long time 
index=cisco_ucapps_index sourcetype=wxcc:webhook:event 
eventType="agentSession:stateChanged" earliest=-4h
| sort agentName, _time
| streamstats current=f last(_time) as next_state_time by agentName
| eval state_duration_min = round((next_state_time - _time) / 60, 0)
| where state_duration_min > 120  # Stuck in state >2 hours
| table _time, agentName, currentState, state_duration_min
```

**Data Ingestion Freshness:**

```spl
## Check if data is arriving in real-time 
index=cisco_ucapps_index sourcetype=wxcc:* earliest=-15m
| eval ingestion_delay_sec = _indextime - _time
| stats 
    count as events,
    avg(ingestion_delay_sec) as avg_delay,
    max(ingestion_delay_sec) as max_delay
    by sourcetype
| eval avg_delay_min = round(avg_delay / 60, 1)
| where avg_delay_min > 10  # More than 10 min delay = issue
| table sourcetype, events, avg_delay_min, max_delay
```

### 15.3 Escalation Matrix

```
+-----------------------------------------------------------------+
| ESCALATION CONTACTS                                              |
+-----------------------------------------------------------------+
|                                                                 |
| L1 - NOC Operations (24x7)                                     |
|   Email: noc@abhavtech.com                                     |
|   Phone: +91-80-4960-3456                                      |
|   Response SLA: 15 minutes                                     |
|   Scope: Initial triage, basic troubleshooting                 |
|                                                                 |
| L2 - Contact Center Operations (8x5)                          |
|   Email: cc-operations@abhavtech.com                           |
|   Phone: +91-80-4960-3457                                      |
|   Response SLA: 1 hour                                         |
|   Scope: Queue management, agent issues, workflow problems     |
|                                                                 |
| L3 - Observability Platform Team (8x5)                        |
|   Email: observability@abhavtech.com                           |
|   Phone: +91-80-4960-3458                                      |
|   Response SLA: 2 hours                                        |
|   Scope: Splunk issues, ML models, dashboard problems          |
|                                                                 |
| L4 - WxCC Administration Team (8x5)                            |
|   Email: wxcc-admin@abhavtech.com                              |
|   Phone: +91-80-4960-3459                                      |
|   Response SLA: 4 hours                                        |
|   Scope: WxCC platform issues, API problems, integrations      |
|                                                                 |
| VENDOR SUPPORT                                                  |
|   Cisco TAC: 1-800-553-2447 (US), +91-80-6730-0000 (India)   |
|   Severity 1: 1 hour response                                  |
|   Contract: Abhavtech-WxCC-2024-Contract-12345                |
|                                                                 |
| COMPLIANCE ESCALATION                                           |
|   Compliance Manager: compliance@abhavtech.com                  |
|   For: Recording failures, PCI violations, data residency      |
|   Response: Immediate (P1 incidents)                           |
+-----------------------------------------------------------------+
```

---

## 16. References

### Official Cisco Documentation

1. **Webex Contact Center Developer Portal**
   - URL: https://developer.webex-cx.com/
   - Content: Complete API reference, authentication, GraphQL documentation
   - Used for: API endpoints, OAuth setup, webhook configuration

2. **Introducing WxCC APIs Blog**
   - URL: https://developer.webex.com/blog/introducing-the-webex-contact-center-apis-and-developer-portal
   - Content: API overview, use cases, authentication flows
   - Used for: Understanding API architecture, sample implementations

3. **WxCC Analyzer User Guide**
   - URL: https://help.webex.com/article/tajemk/
   - Content: Stock reports, custom visualizations, historical analytics
   - Used for: Understanding built-in reporting capabilities, metric definitions

4. **WxCC Analyzer Stock Reports**
   - URL: https://help.webex.com/article/t137o3/
   - Content: Pre-built report definitions, field descriptions
   - Used for: Metric calculations, report templates

5. **Supervise and Manage Contact Center Queues**
   - URL: https://help.webex.com/article/b1qhidb/
   - Content: Real-time queue monitoring, supervisor functions
   - Used for: Real-time metrics, queue management procedures

6. **WxCC Setup and Administration Guide**
   - URL: https://help.webex.com/article/n5595zd/
   - Content: Platform configuration, user management, reporting
   - Used for: Administrative procedures, system architecture

### API Reference Documentation

**Primary APIs Used:**

1. **GraphQL Search API**
   - Endpoint: POST https://api.wxcc-us1.cisco.com/search
   - Authentication: OAuth 2.0 Bearer token
   - Rate Limit: 120 requests/minute
   - Use Cases: Task queries, agent session data, queue statistics
   - Documentation: https://developer.webex-cx.com/documentation/search

2. **Agent Statistics API**
   - Purpose: Agent performance metrics, state tracking
   - Use Cases: Occupancy rate, tasks handled, login duration
   - Documentation: https://developer.webex-cx.com/documentation/agents

3. **Queue Statistics API**
   - Purpose: Queue performance data
   - Use Cases: Service level, abandonment, wait time
   - Documentation: https://developer.webex-cx.com/documentation/queues

4. **Captures API (Call Recordings)**
   - Purpose: Recording metadata and download URLs
   - Use Cases: Compliance verification, recording retrieval
   - Documentation: https://developer.webex-cx.com/documentation/captures

5. **Webhooks (Real-time Events)**
   - Events: task:created, task:ended, agentSession:stateChanged, capture:created
   - Delivery: HTTP POST to configured endpoint
   - Use Cases: Real-time monitoring, immediate alerting
   - Documentation: https://developer.webex-cx.com/documentation/webhooks

### GitHub Sample Code

- **WebexSamples/webex-contact-center-api-samples**
  - URL: https://github.com/WebexSamples/webex-contact-center-api-samples
  - Contents:
    - OAuth authentication samples
    - GraphQL query examples
    - Webhook integration samples
    - Dashboard building samples
    - Configuration API examples

### Internal Abhavtech Documentation

1. **Chapter 3: Webex Contact Center Design (Phase 2)**
   - Location: /mnt/project/Chapter-3-Webex-Contact-Center-Design-Phase2.md
   - Content: Queue design, agent configuration, compliance requirements

2. **Abhavtech WxCC Master Reference Card**
   - Location: /mnt/project/Abhavtech-WxCC-Master-Reference-Card-v2_2.md
   - Content: Quick reference for queues, agents, metrics, compliance

3. **UCCX-WxCC Migration Master Checklist**
   - Location: /mnt/project/UCCX-WXCC-MASTER-CHECKLIST.md
   - Content: Migration tasks, operational procedures, monitoring

4. **AI-Enabled Observability Master Checklist**
   - Location: /mnt/project/AI-OBSERVABILITY-MASTER-CHECKLIST-REVISED.md
   - Content: Overall observability platform architecture

5. **Appendix 10I: Webex Calling AI Observability Guide**
   - Location: /mnt/user-data/outputs/APPENDIX-10I-WEBEX-AI-OBSERVABILITY-GUIDE.md
   - Content: Complementary guide for Webex Calling observability

### Contact Information

**Internal Support:**

```
Contact Center Operations Team:
  Email: cc-operations@abhavtech.com
  Phone: +91-80-4960-3457
  Hours: 24x7 (rotation)
  
Observability Platform Team:
  Email: observability@abhavtech.com
  Phone: +91-80-4960-3458
  Hours: Monday-Friday 09:00-18:00 IST
  
WxCC Administration:
  Email: wxcc-admin@abhavtech.com
  Phone: +91-80-4960-3459
  Hours: Monday-Friday 09:00-18:00 IST
  
Network Engineering (for ThousandEyes correlation):
  Email: network-ops@abhavtech.com
  Phone: +91-80-4960-3460
  Hours: 24x7
```

**Vendor Support:**

```
Cisco TAC (Technical Assistance Center):
  US: 1-800-553-2447
  India: +91-80-6730-0000
  Email: tac@cisco.com
  Contract: Abhavtech-WxCC-2024-Contract-12345
  
Splunk Support:
  Phone: 1-866-438-7758
  Email: support@splunk.com
  Portal: https://www.splunk.com/support
  Contract: Abhavtech-Splunk-Enterprise-2024
  
ThousandEyes Support:
  Phone: 1-415-237-4310
  Email: support@thousandeyes.com
  Portal: https://app.thousandeyes.com/support
```

---

## Appendices

### Appendix A: Complete API Request/Response Examples

**GraphQL Task Query Example:**

```graphql
## Request 
POST https://api.wxcc-us1.cisco.com/search
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "query": "query GetQueueTasks($from: Long!, $to: Long!, $queueName: String!) { task(from: $from, to: $to, filter: {queueName: {equals: $queueName}}) { tasks { id createdTime connectedTime endedTime queueName agentName status handleDuration queueDuration wrapUpReason } aggregation(groupBy: [queueName], aggregations: [{type: AVG, fieldName: \"handleDuration\"}, {type: AVG, fieldName: \"queueDuration\"}, {type: COUNT}]) { group { queueName } metrics { avg_handleDuration avg_queueDuration count } } } }",
  "variables": {
    "from": 1707820800000,
    "to": 1707824400000,
    "queueName": "Sales_India_CSQ"
  }
}

## Response 
{
  "data": {
    "task": {
      "tasks": [
        {
          "id": "TASK-12345-abcde",
          "createdTime": 1707821000000,
          "connectedTime": 1707821020000,
          "endedTime": 1707821350000,
          "queueName": "Sales_India_CSQ",
          "agentName": "John Doe",
          "status": "ended",
          "handleDuration": 330000,
          "queueDuration": 20000,
          "wrapUpReason": "sale_completed"
        },
        // ... more tasks ...
      ],
      "aggregation": [
        {
          "group": {
            "queueName": "Sales_India_CSQ"
          },
          "metrics": {
            "avg_handleDuration": 325000,
            "avg_queueDuration": 28000,
            "count": 156
          }
        }
      ]
    }
  }
}
```

**Webhook Payload Example (Task Ended):**

```json
{
  "eventType": "task:ended",
  "eventId": "EVENT-67890-xyz",
  "timestamp": "2026-02-14T14:30:00.000Z",
  "organizationId": "ORG-abcd1234-5678-90ef",
  "data": {
    "taskId": "TASK-12345-abcde",
    "queueId": "QUEUE-sales-india",
    "queueName": "Sales_India_CSQ",
    "channelType": "telephony",
    "direction": "inbound",
    "agentId": "AGENT-john-doe-12345",
    "agentEmail": "john.doe@abhavtech.com",
    "agentName": "John Doe",
    "ani": "+919876543210",
    "dnis": "+918044123456",
    "createdTime": 1707821000000,
    "connectedTime": 1707821020000,
    "endedTime": 1707821350000,
    "status": "ended",
    "terminationType": "agent_disconnect",
    "wrapUpReason": "sale_completed",
    "wrapUpCode": "001",
    "handleDuration": 330000,
    "queueDuration": 20000,
    "totalDuration": 350000,
    "isRecorded": true,
    "recordingId": "REC-98765-abc",
    "customData": {
      "customer_account_id": "CUST-54321",
      "order_id": "ORD-99999"
    }
  }
}
```

---

**Document Version:** 1.0  
**Last Updated:** February 14, 2026  
**Next Review:** May 14, 2026 (Quarterly)  
**Document Owner:** Observability Platform Team / Contact Center Operations

**Revision History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 14, 2026 | Observability Team | Initial release - comprehensive WxCC observability guide |

---

**End of Appendix 10J - Webex Contact Center AI Observability Integration Guide**
