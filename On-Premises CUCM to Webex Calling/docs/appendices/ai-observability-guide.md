# APPENDIX 10I: WEBEX CALLING AI OBSERVABILITY INTEGRATION GUIDE 

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | APPENDIX-10I |
| **Version** | 1.0 |
| **Organization** | Abhavtech |
| **Project Code** | ABV-COLLABVOICE-2024 / ABV-SECOPS-AI-2025 |
| **Classification** | Internal Use |
| **Last Updated** | February 2026 |
| **Document Owner** | Network Operations / Observability Team |
| **Related Project** | CUCM/UCCX -> Webex Calling/Contact Center Migration |

---

## Document Purpose

This appendix provides detailed technical guidance for integrating Webex Calling and Webex Contact Center into Abhavtech's AI-Enabled Observability platform (Phase 2D). The integration connects three observability platforms:

- **Splunk Enterprise** (AI/ML analytics with MLTK)
- **ThousandEyes** (Network path visibility and voice quality testing)
- **AppDynamics** (Application performance for Webex-integrated applications)

**Target Audience:**
- Network Operations Center (NOC) engineers
- Observability platform administrators
- Webex Calling/Contact Center administrators
- Application operations teams

**Scope:**
- Webex Calling: 3,200 enterprise users across 12 global locations
- Webex Contact Center: 175 agents (Phase 2 deployment)
- Coverage: Mumbai, Chennai, London, Frankfurt, New Jersey, Dallas (hubs) + 13 branch sites

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Prerequisites](#2-prerequisites)
3. [Webex Control Hub API Integration](#3-webex-control-hub-api-integration)
4. [ThousandEyes Integration](#4-thousandeyes-integration)
5. [Splunk Data Ingestion](#5-splunk-data-ingestion)
6. [AI/ML Model Configuration](#6-aiml-model-configuration)
7. [Dashboard Creation](#7-dashboard-creation)
8. [Alerting & Automation](#8-alerting-automation)
9. [Testing & Validation](#9-testing-validation)
10. [Operational Procedures](#10-operational-procedures)
11. [Troubleshooting](#11-troubleshooting)
12. [References](#12-references)

---

## 1. Architecture Overview

### 1.1 Integration Architecture

```
+-----------------------------------------------------------------------------+
|                      WEBEX CALLING/CONTACT CENTER                            |
|  +---------------------+       +-----------------------------------------+ |
|  | Webex Calling       |       | Webex Contact Center (Phase 2)          | |
|  | * 3,200 users       |       | * 175 agents                            | |
|  | * 12 locations      |       | * 10 queues                             | |
|  | * PSTN integration  |       | * Salesforce integration                | |
|  +---------------------+       +-----------------------------------------+ |
+-----------------------------------------------------------------------------+
           |                                           |
           |                                           |
    +------v------------------------------------------v---------+
    |              WEBEX CONTROL HUB                             |
    |  * Analytics API - Call quality metrics                    |
    |  * Reports API - Historical data                           |
    |  * Organization Settings API - Configuration               |
    |  * Detailed Call History API - CDR data                    |
    |  * Meeting Qualities API - WxCC quality                    |
    +------+------------------------------------------+----------+
           |                                           |
           |                                           |
    +------v------------------+             +---------v--------------------+
    |   THOUSANDEYES          |             |  DIRECT API INTEGRATION      |
    |  * Webex Cloud Agents   |             |  * HTTP Event Collector      |
    |  * Endpoint Agents      |             |  * RESTful API polling       |
    |  * RTP Quality Tests    |             |  * Webhook subscriptions     |
    |  * Path Visualization   |             |                              |
    +------+------------------+             +---------+--------------------+
           |                                           |
           |                                           |
           +------------+------------------------------+
                        |
                 +------v-------------------------+
                 |  OPENTELEMETRY COLLECTOR       |
                 |  * Batch processing            |
                 |  * Data transformation         |
                 |  * Enrichment                  |
                 +------+-------------------------+
                        |
                 +------v-------------------------+
                 |  SPLUNK ENTERPRISE             |
                 |  * Machine Learning Toolkit    |
                 |  * AI/ML anomaly detection     |
                 |  * Unified dashboards          |
                 |  * Automated workflows         |
                 +--------------------------------+
```

### 1.2 Data Flow Architecture

**Real-Time Metrics (ThousandEyes):**
- Collection Interval: Every 2 minutes for voice/RTP tests
- Latency: ~1-2 minutes from call event to visibility
- Data Volume: ~50 MB/day for 6 Enterprise Agents

**Historical Analytics (Control Hub API):**
- Collection Interval: Every 15 minutes (API polling)
- Data Availability: T+15 minutes for real-time metrics
- Report Data: T+24 hours for comprehensive reports
- Data Volume: ~200 MB/day for 3,200 users

**Quality of Experience (QoE) Thresholds:**

| Metric | Excellent | Good | Fair | Poor |
|--------|-----------|------|------|------|
| **MOS Score** | >=4.0 | 3.5-3.9 | 3.0-3.4 | <3.0 |
| **Latency** | <100ms | 100-150ms | 150-200ms | >200ms |
| **Jitter** | <20ms | 20-30ms | 30-50ms | >50ms |
| **Packet Loss** | <0.5% | 0.5-1.0% | 1.0-2.0% | >2.0% |

### 1.3 Component Dependencies

**Prerequisites from Other Projects:**
- **ABV-COLLABVOICE-2024**: Webex Calling Phase 1 operational (3,200 users)
- **ABV-SECOPS-AI-2025**: Phase 2A-2C complete (Splunk, ThousandEyes, AppDynamics)
- **ABV-SDWAN-2024**: SD-WAN infrastructure providing underlay connectivity
- **ABV-SDA-ISE-2025**: DNA Center/ISE for QoS policy enforcement

---

## 2. Prerequisites

### 2.1 Webex Requirements

**Control Hub Access:**
```
Required Roles:
+-- Full Administrator (API access setup)
+-- User Administrator (user data access)
+-- Reports Administrator (analytics data)

Required Licenses:
+-- Webex Calling Professional (Pro Pack recommended for enhanced analytics)
+-- Pro Pack for Control Hub (required for Reports API)
+-- Webex Contact Center Standard (Phase 2 - for WxCC integration)

API Authentication:
+-- OAuth 2.0 Client Credentials
+-- Service App (Integration)
+-- Refresh Token mechanism
```

**Webex Control Hub Configuration:**
- Webex organization verified and operational
- Call quality analytics enabled in Control Hub
- Detailed call history retention set to 90 days
- API access enabled (Organization Settings -> Developer)

**Reference Documentation:**
- [Webex Calling Reports and Analytics APIs](https://developer.webex.com/blog/exploring-the-webex-calling-reports-and-analytics-apis)
- [Calling APIs Overview](https://developer.webex.com/blog/calling-apis-overview)
- [Control Hub Analytics](https://help.webex.com/article/n0rlwxe/)

### 2.2 ThousandEyes Requirements

**ThousandEyes Licenses:**
```
Required Components:
+-- 6x Enterprise Agent licenses (one per hub site)
|   +-- Mumbai Data Center
|   +-- Chennai Data Center
|   +-- London Data Center
|   +-- Frankfurt Data Center
|   +-- New Jersey Data Center
|   +-- Dallas Data Center
|
+-- 50x Endpoint Agent licenses (for endpoint monitoring)
|   +-- Desktop endpoints (Webex App)
|   +-- Room devices (Board/Desk/Room Series)
|   +-- Desk phones (9800 Series)
|
+-- Webex Cloud Agent access (included with ThousandEyes)
    +-- Singapore (for India/APAC)
    +-- London (for EMEA)
    +-- Frankfurt (for EU)
    +-- US POPs (for Americas)
```

**ThousandEyes Platform:**
- ThousandEyes account with Webex integration enabled
- API access credentials (OAuth token)
- Account Group configured for Webex monitoring
- Connection string for endpoint agents

**Reference Documentation:**
- [ThousandEyes Webex Control Hub Integration](https://docs.thousandeyes.com/product-documentation/integration-guides/custom-built-integrations/webex-controlhub)
- [Integrate ThousandEyes with Troubleshooting in Control Hub](https://help.webex.com/article/nymfj2d)
- [ThousandEyes Integration with Webex Services](https://help.webex.com/article/pkbkx7)

### 2.3 Splunk Requirements

**Splunk Configuration:**
```
Splunk Platform:
+-- Splunk Enterprise 9.0+ (indexer cluster operational)
+-- HTTP Event Collector (HEC) configured
+-- Machine Learning Toolkit (MLTK) installed
+-- Python for Scientific Computing (PSC) add-on
+-- Splunk App for Cisco ISE (for network context)

Index Configuration:
+-- cisco_ucapps_index (primary Webex data)
|   +-- Retention: 90 days
|   +-- Size: ~300 GB (estimated for 3,200 users)
|   +-- Replication Factor: 3
|
+-- cisco_ai_events_index (AI-generated events)
    +-- Retention: 2 years
    +-- Size: ~50 GB
    +-- Replication Factor: 3
```

**OpenTelemetry Collector:**
- OTel collectors deployed at 6 hub sites
- Configured with Splunk HEC exporter
- Batch processing enabled (max 10,000 events)
- Resource detection configured

### 2.4 Network Requirements

**Firewall Rules Required:**

```
Source: Abhavtech Enterprise Network -> Destination: Webex Cloud
+----------------------------------------------------------------+
| Protocol  | Port         | Purpose                             |
+-----------+--------------+-------------------------------------+
| HTTPS     | TCP 443      | Control Hub API access              |
| Signaling | TCP 5004     | Webex Calling signaling             |
| Media     | UDP 5004     | Webex Calling media (SIP/RTP)       |
| Media RTP | UDP 52000+   | RTP media streams                   |
+----------------------------------------------------------------+

Source: ThousandEyes Enterprise Agents -> Destination: Webex Cloud
+----------------------------------------------------------------+
| HTTPS     | TCP 443      | Agent management, test results      |
| Test Port | TCP 49152+   | Network path testing                |
| RTP       | UDP 10000+   | Voice quality RTP testing           |
+----------------------------------------------------------------+

Source: Webex App/Devices -> Destination: ThousandEyes
+----------------------------------------------------------------+
| HTTPS     | TCP 443      | Endpoint Agent reporting            |
| Collector | TCP 49153+   | Endpoint data collection            |
+----------------------------------------------------------------+
```

**DNS Requirements:**
- Webex API endpoints resolvable: `webexapis.com`, `api.ciscospark.com`
- ThousandEyes endpoints resolvable: `*.thousandeyes.com`
- Webex media POPs resolvable (region-specific)

### 2.5 Baseline Data Collection

**CRITICAL REQUIREMENT:**

```
+-----------------------------------------------------------------+
|  [!]️  AI/ML BASELINE COLLECTION MANDATORY                        |
+-----------------------------------------------------------------+
|                                                                 |
|  Component                 | Minimum    | Recommended          |
|  -------------------------+------------+----------------------|
|  ThousandEyes Voice Tests | 14 days    | 30 days              |
|  Control Hub Analytics    | 30 days    | 90 days              |
|  Splunk MLTK Training     | 30 days    | 90 days              |
|                                                                 |
|  DO NOT enable AI features before baseline collection!         |
|                                                                 |
+-----------------------------------------------------------------+
```

**Baseline Collection Checklist:**
- [ ] Webex Calling operational for minimum 30 days
- [ ] Call volume representative (includes peak periods)
- [ ] All locations generating traffic
- [ ] Quality metrics being collected consistently
- [ ] No major network changes during baseline period

---

## 3. Webex Control Hub API Integration

### 3.1 API Authentication Setup

**Step 1: Create Service App Integration**

1. Log into [developer.webex.com](https://developer.webex.com)
2. Navigate to **My Webex Apps** -> **Create a New App**
3. Select **Create an Integration**

```
Integration Configuration:
+-----------------------------------------------------------------+
| Integration Name:  Abhavtech Observability Platform             |
| Contact Email:     observability@abhavtech.com                  |
| Icon:              [Upload company logo]                        |
| Description:       Integration for Splunk observability         |
| Redirect URI:      https://splunk.abhavtech.com/webhook         |
|                    https://localhost:8080/oauth-callback        |
+-----------------------------------------------------------------+
```

4. **Select Required Scopes:**

```
Authentication Scopes Required:
+-- analytics:read_all               (Analytics data access)
+-- spark:calls_read                 (Call history access)
+-- spark-admin:calling_data_read    (Calling metrics access)
+-- spark-admin:people_read          (User information)
+-- spark-admin:organizations_read   (Organization settings)
+-- spark-admin:reports_read         (Reports API access)
+-- meeting:admin_schedule_read      (Meeting/WxCC quality data)
```

5. Save and capture credentials:

```bash
Client ID:     abcd1234-5678-90ef-ghij-klmnopqrstuv
Client Secret: 1234567890abcdefghijklmnopqrstuvwxyz (store securely!)
```

**Step 2: Generate OAuth Token**

```bash
## Initial Authorization (Interactive) 
curl -X POST 'https://webexapis.com/v1/access_token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials' \
  -d 'client_id=YOUR_CLIENT_ID' \
  -d 'client_secret=YOUR_CLIENT_SECRET'

## Response: 
{
  "access_token": "ZmE4YjJlZTEt...",
  "expires_in": 14400,
  "refresh_token": "MDEyMzQ1Njc4...",
  "refresh_token_expires_in": 7776000,
  "token_type": "Bearer"
}
```

**Step 3: Store Credentials Securely**

```bash
## Store in Splunk Credential Storage (NOT in clear text!) 
## From Splunk CLI: 
./splunk add secret-storage -name webex_client_id -value "YOUR_CLIENT_ID"
./splunk add secret-storage -name webex_client_secret -value "YOUR_CLIENT_SECRET"
./splunk add secret-storage -name webex_access_token -value "YOUR_ACCESS_TOKEN"
./splunk add secret-storage -name webex_refresh_token -value "YOUR_REFRESH_TOKEN"
```

### 3.2 API Data Collection Strategy

**Real-Time Metrics Collection (15-minute intervals):**

```python
## Splunk Scripted Input: webex_calling_metrics.py 
## Location: $SPLUNK_HOME/etc/apps/abhavtech_webex/bin/ 

import requests
import json
import time
from datetime import datetime, timedelta

## Configuration 
WEBEX_API_BASE = "https://webexapis.com/v1"
METRICS_INTERVAL = 900  # 15 minutes in seconds

def get_oauth_token():
    """Retrieve OAuth token from Splunk credential storage"""
## Implementation uses Splunk SDK 
    pass

def collect_call_quality_metrics(access_token):
    """
    Collect call quality metrics from Webex Control Hub Analytics
    
    API Reference:
    https://developer.webex.com/docs/api/v1/analytics/
    """
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
## Time range: last 15 minutes 
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(minutes=15)
    
## API endpoint for call quality (near real-time) 
    url = f"{WEBEX_API_BASE}/analytics/call_quality"
    params = {
        'from': start_time.isoformat() + 'Z',
        'to': end_time.isoformat() + 'Z',
        'orgId': 'YOUR_ORG_ID'
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
## Log error and return empty 
        return {"error": response.status_code, "message": response.text}

def format_for_splunk(data):
    """
    Transform Webex API response to Splunk-compatible JSON events
    
    Input: Webex API response
    Output: Array of Splunk events with sourcetype=webex:calling:quality
    """
    events = []
    
    if 'items' in data:
        for item in data['items']:
            event = {
                "time": item.get('timestamp'),
                "sourcetype": "webex:calling:quality",
                "source": "webex_control_hub_api",
                "index": "cisco_ucapps_index",
                "event": {
                    "call_id": item.get('callId'),
                    "user_id": item.get('userId'),
                    "user_email": item.get('userEmail'),
                    "location": item.get('location'),
                    "call_direction": item.get('direction'),  # inbound/outbound
                    "call_duration": item.get('durationSeconds'),
                    
## Quality Metrics 
                    "mos_score": item.get('mos'),
                    "latency_ms": item.get('latency'),
                    "jitter_ms": item.get('jitter'),
                    "packet_loss_percent": item.get('packetLoss'),
                    
## Device Info 
                    "device_type": item.get('deviceType'),  # webex_app, desk_phone, room_device
                    "device_model": item.get('deviceModel'),
                    "connection_type": item.get('connectionType'),  # wifi, ethernet
                    
## Network Info 
                    "local_ip": item.get('localIP'),
                    "remote_ip": item.get('remoteIP'),
                    "codec": item.get('codec'),
                    
## Region Info (for compliance) 
                    "media_region": item.get('mediaRegion'),  # Singapore, London, Frankfurt, etc.
                }
            }
            events.append(event)
    
    return events

def main():
    """Main execution function"""
    try:
## Get OAuth token 
        access_token = get_oauth_token()
        
## Collect metrics 
        data = collect_call_quality_metrics(access_token)
        
## Format and output to stdout (Splunk captures stdout) 
        events = format_for_splunk(data)
        
        for event in events:
            print(json.dumps(event))
        
    except Exception as e:
## Log error to Splunk internal logs 
        error_event = {
            "time": datetime.utcnow().isoformat(),
            "sourcetype": "webex:api:error",
            "event": {
                "error_type": "api_collection_failure",
                "error_message": str(e)
            }
        }
        print(json.dumps(error_event))

if __name__ == "__main__":
    main()
```

**Splunk Input Configuration:**

```ini
## inputs.conf - Configure scripted input 
## Location: $SPLUNK_HOME/etc/apps/abhavtech_webex/local/inputs.conf 

[script://$SPLUNK_HOME/etc/apps/abhavtech_webex/bin/webex_calling_metrics.py]
disabled = false
index = cisco_ucapps_index
interval = 900
sourcetype = webex:calling:quality
source = webex_control_hub_api

## Python3 is required 
python.version = python3
```

### 3.3 Historical Report Collection (Daily)

**Webex Reports API Integration:**

```python
## Splunk Scripted Input: webex_calling_reports.py 
## Runs daily at 02:00 UTC to collect previous day's comprehensive reports 

def generate_call_history_report(access_token, org_id):
    """
    Generate Detailed Call History Report using Reports API
    
    API Reference:
    https://developer.webex.com/docs/api/v1/reports/
    
    This generates a comprehensive CSV report with all call details
    Report is generated async and downloaded when ready
    """
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
## Step 1: Create report template 
    template_data = {
        "templateName": "Abhavtech Daily Call History",
        "reportType": "Detailed Call History Report",
        "startDate": (datetime.utcnow() - timedelta(days=1)).strftime('%Y-%m-%d'),
        "endDate": datetime.utcnow().strftime('%Y-%m-%d'),
        "orgId": org_id
    }
    
    response = requests.post(
        f"{WEBEX_API_BASE}/reports",
        headers=headers,
        json=template_data
    )
    
    if response.status_code == 200:
        report_id = response.json().get('id')
        
## Step 2: Poll for report completion (reports take 5-15 minutes) 
        while True:
            status_response = requests.get(
                f"{WEBEX_API_BASE}/reports/{report_id}",
                headers=headers
            )
            
            if status_response.json().get('status') == 'done':
                download_url = status_response.json().get('downloadUrl')
                break
            
            time.sleep(60)  # Check every minute
        
## Step 3: Download report CSV 
        csv_data = requests.get(download_url).text
        
## Step 4: Parse and convert to Splunk events 
        return parse_call_history_csv(csv_data)
    
    return None

def parse_call_history_csv(csv_data):
    """
    Parse CSV report and convert to structured Splunk events
    
    CSV contains columns:
    - Call Start Time, Call Duration, Calling Number, Called Number
    - Direction, Location, Device Type, Call Result
    - MOS Score, Latency, Jitter, Packet Loss
    """
    import csv
    from io import StringIO
    
    events = []
    csv_reader = csv.DictReader(StringIO(csv_data))
    
    for row in csv_reader:
        event = {
            "time": row['Call Start Time'],
            "sourcetype": "webex:calling:history",
            "source": "webex_reports_api",
            "index": "cisco_ucapps_index",
            "event": {
                "call_start_time": row['Call Start Time'],
                "call_duration": int(row['Call Duration (seconds)']),
                "calling_number": row['Calling Number'],
                "called_number": row['Called Number'],
                "direction": row['Direction'],
                "location": row['Location'],
                "device_type": row['Device Type'],
                "call_result": row['Call Result'],  # connected, busy, no_answer, failed
                
## Quality Metrics (if available) 
                "mos_score": float(row.get('MOS Score', 0)),
                "latency_ms": int(row.get('Latency (ms)', 0)),
                "jitter_ms": int(row.get('Jitter (ms)', 0)),
                "packet_loss_percent": float(row.get('Packet Loss (%)', 0)),
                
## User Info 
                "user_email": row.get('User Email'),
                "user_display_name": row.get('User Name'),
                
## Billing Info (for cost tracking) 
                "call_type": row.get('Call Type'),  # local, long_distance, international
                "toll_type": row.get('Toll Type'),  # toll_free, premium, etc.
            }
        }
        events.append(event)
    
    return events
```

### 3.4 API Rate Limiting & Error Handling

**Webex API Rate Limits:**

```
Control Hub APIs Rate Limits:
+-- Public APIs: 300 requests/minute per organization
+-- Admin APIs: 100 requests/minute per organization
+-- Reports API: 10 concurrent report generations
+-- Retry-After: Header indicates retry delay
```

**Error Handling Strategy:**

```python
def api_call_with_retry(url, headers, params, max_retries=3):
    """
    Make API call with exponential backoff retry logic
    
    Handles:
    - 429 Too Many Requests (rate limit)
    - 500+ Server errors
    - Network timeouts
    """
    import time
    
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
            
            if response.status_code == 200:
                return response.json()
            
            elif response.status_code == 429:
## Rate limited - use Retry-After header or exponential backoff 
                retry_after = int(response.headers.get('Retry-After', 60))
                print(f"Rate limited. Waiting {retry_after} seconds...")
                time.sleep(retry_after)
                continue
            
            elif response.status_code >= 500:
## Server error - exponential backoff 
                wait_time = (2 ** attempt) * 10  # 10s, 20s, 40s
                print(f"Server error {response.status_code}. Retrying in {wait_time}s...")
                time.sleep(wait_time)
                continue
            
            else:
## Client error (4xx) - don't retry 
                print(f"Client error {response.status_code}: {response.text}")
                return None
        
        except requests.exceptions.Timeout:
            print(f"Request timeout. Attempt {attempt + 1}/{max_retries}")
            time.sleep(10)
            continue
        
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return None
    
    print(f"Failed after {max_retries} attempts")
    return None
```

### 3.5 Data Validation & Quality Checks

**Splunk Data Validation Search:**

```spl
## Scheduled Search: Webex Data Quality Check 
## Run every 30 minutes 

index=cisco_ucapps_index sourcetype=webex:calling:quality
| stats 
    count as total_events,
    dc(user_email) as unique_users,
    avg(mos_score) as avg_mos,
    avg(latency_ms) as avg_latency,
    avg(packet_loss_percent) as avg_packet_loss,
    count(eval(mos_score=0)) as zero_mos_count
| eval 
    data_quality_score = case(
        total_events < 100, "LOW - Insufficient data",
        zero_mos_count > total_events * 0.1, "LOW - Too many null MOS scores",
        avg_mos < 2.0 OR avg_mos > 5.0, "SUSPECT - MOS out of range",
        1=1, "OK"
    )
| table _time, total_events, unique_users, data_quality_score, avg_mos, avg_latency

## Alert if data quality is LOW or SUSPECT 
| where data_quality_score!="OK"
```

---

## 4. ThousandEyes Integration

### 4.1 Control Hub Integration Setup

**Step 1: Enable ThousandEyes in Control Hub**

1. Sign in to [Control Hub](https://admin.webex.com)
2. Navigate to **Organization Settings** -> **ThousandEyes**
3. Click **Enable ThousandEyes Integration**
4. Authenticate with ThousandEyes credentials

```
+-----------------------------------------------------------------+
|  ThousandEyes Control Hub Integration                           |
+-----------------------------------------------------------------+
|                                                                 |
|  Status:              [*] Enabled                               |
|  Organization ID:     ORG-1234-5678-ABCD                        |
|  Account Group:       Abhavtech-Webex-Monitoring                |
|                                                                 |
|  [x] Enable for Webex Meetings                                   |
|  [x] Enable for Webex Calling                                    |
|  [x] Enable for Devices (Room OS)                                |
|                                                                 |
|  Connection String:   [Copy] (for endpoint agents)             |
|                                                                 |
+-----------------------------------------------------------------+
```

5. Copy the **Connection String** - needed for endpoint agent deployment

**Step 2: Configure ThousandEyes Account Group**

In ThousandEyes Platform:

1. Navigate to **Cloud & Enterprise Agents** -> **Agent Settings**
2. Create new Account Group: `Abhavtech-Webex-Monitoring`
3. Configure access permissions for Webex integration

### 4.2 Webex Cloud Agents Configuration

**Available Webex Cloud Agents (Pre-deployed by ThousandEyes):**

```
APAC Region:
+-- Singapore (for India calls)
+-- Hong Kong
+-- Tokyo
+-- Sydney

EMEA Region:
+-- London (for UK calls)
+-- Frankfurt (for Germany/EU calls)
+-- Amsterdam
+-- Dublin

Americas Region:
+-- Ashburn, VA (for New Jersey)
+-- San Jose, CA
+-- Dallas, TX
+-- São Paulo, Brazil
```

**Webex Calling Test Configuration:**

Create RTP quality tests from enterprise agents to Webex Cloud Agents:

```
Test Configuration: Mumbai -> Singapore Cloud Agent (RTP)
+-----------------------------------------------------------------+
|  Test Name:         Mumbai-to-Singapore-Webex-RTP               |
|  Test Type:         Voice Call Test                             |
|  Source Agent:      Mumbai Enterprise Agent                     |
|  Target:            Singapore Webex Cloud Agent                 |
|                                                                 |
|  Protocol:          RTP (UDP)                                   |
|  Port:              Dynamic (52000-52499)                       |
|  Codec:             G.711 u-law (preferred by Abhavtech)        |
|  DSCP:              EF (Expedited Forwarding)                   |
|                                                                 |
|  Test Interval:     2 minutes (calls are shorter duration)      |
|  Direction:         Bidirectional                               |
|                                                                 |
|  Metrics Collected:                                             |
|  +-- MOS Score (R-factor calculation)                           |
|  +-- Latency (one-way and round-trip)                           |
|  +-- Jitter (variation in latency)                              |
|  +-- Packet Loss (% lost packets)                               |
|  +-- Network Path (hop-by-hop visualization)                    |
+-----------------------------------------------------------------+
```

**Complete Test Matrix for Abhavtech:**

| Source Location | Target Webex Cloud Agent | Test Frequency | Purpose |
|----------------|-------------------------|----------------|---------|
| Mumbai | Singapore | Every 2 min | India PSTN egress monitoring |
| Chennai | Singapore | Every 2 min | India backup DC monitoring |
| London | London | Every 2 min | UK PSTN egress monitoring |
| Frankfurt | Frankfurt | Every 2 min | Germany/EU PSTN egress |
| New Jersey | Ashburn, VA | Every 2 min | Americas East monitoring |
| Dallas | Dallas, TX | Every 2 min | Americas Central monitoring |

**Total: 6 Voice Call Tests (RTP quality)**

### 4.3 Enterprise Agent Deployment

**VM Requirements per Site:**

```
ThousandEyes Enterprise Agent Specifications:
+-- Operating System: Ubuntu 20.04 LTS (or Docker container)
+-- vCPU: 2 cores
+-- RAM: 2 GB
+-- Disk: 20 GB
+-- Network: 1 Gbps interface
+-- Placement: Management network segment (not user VLAN)
```

**Deployment Procedure (Mumbai Example):**

```bash
## Step 1: Deploy Docker container (recommended method) 
docker run -d \
  --name thousandeyes-agent-mumbai \
  --hostname te-agent-mumbai-dc \
  --restart=unless-stopped \
  --cap-add=NET_ADMIN \
  -e TEAGENT_ACCOUNT_TOKEN="YOUR_ACCOUNT_TOKEN" \
  -e TEAGENT_PROXY_TYPE=DIRECT \
  thousandeyes/enterprise-agent:latest

## Step 2: Verify agent registration 
docker logs thousandeyes-agent-mumbai | grep "Successfully registered"

## Step 3: Tag agent in ThousandEyes platform 
## - Location: Mumbai Data Center 
## - Tags: abhavtech, mumbai, hub-site, webex-monitoring 
## - Agent Name: Mumbai-DC-Agent 
```

**Repeat for all 6 hub sites.**

**Agent Health Monitoring:**

```bash
## Splunk Alert: ThousandEyes Agent Health 
index=thousandeyes_webhook sourcetype=thousandeyes:agent:status
| stats latest(status) as agent_status by agent_name, agent_location
| where agent_status!="online"
| eval severity="critical"
| table _time, agent_name, agent_location, agent_status, severity
```

### 4.4 Endpoint Agent Deployment

**Deployment Targets:**

```
Webex App (Desktop) - 50 licenses:
+-- Mumbai HQ: 10 endpoints
+-- Chennai: 8 endpoints
+-- London: 8 endpoints
+-- Frankfurt: 8 endpoints
+-- New Jersey: 8 endpoints
+-- Dallas: 8 endpoints

Room Devices - Automatic (no additional license):
+-- Board/Desk/Room Series devices
+-- Auto-enabled via Control Hub integration
+-- Reports to ThousandEyes automatically

Desk Phones (9800 Series) - Included in endpoint licenses:
+-- Auto-enabled via Control Hub
+-- Limited to synthetic STUN tests
```

**Webex App Endpoint Agent Installation:**

```bash
## Windows Installation (MSI) 
## Download from: https://downloads.thousandeyes.com/ 

msiexec /i ThousandEyes-Endpoint-Agent-v1.X.msi /quiet \
  ACCOUNT_TOKEN=YOUR_ACCOUNT_TOKEN \
  PROXY_ENABLED=FALSE \
  WEBEX_INTEGRATION=ENABLED

## macOS Installation (PKG) 
sudo installer -pkg ThousandEyes-Endpoint-Agent-v1.X.pkg -target /

## Configuration (post-install) 
## Endpoint agents auto-discover Webex App and start monitoring 
## No manual configuration needed if Control Hub integration is enabled 
```

**Automated Test Creation:**

When endpoint agents are installed and Control Hub integration is active, tests are automatically created for:

1. **Webex Meetings** - Session quality monitoring
2. **Webex Calling** - Call quality monitoring (when calls are active)
3. **Network Path** - Hop-by-hop visibility to Webex cloud

### 4.5 Data Export to Splunk

**ThousandEyes Webhook Configuration:**

1. In ThousandEyes Platform: **Integrations** -> **Webhooks**
2. Create new webhook:

```json
{
  "webhookName": "Abhavtech-Splunk-HEC",
  "targetUrl": "https://splunk-hec.abhavtech.com:8088/services/collector/event",
  "authMethod": "bearer_token",
  "authToken": "YOUR_SPLUNK_HEC_TOKEN",
  "testType": ["voice", "agent-to-server", "network"],
  "alertType": ["voice_quality_degradation", "network_path_change"],
  
  "customHeaders": {
    "Authorization": "Splunk YOUR_SPLUNK_HEC_TOKEN",
    "Content-Type": "application/json"
  },
  
  "payloadTemplate": {
    "time": "${alert.timestamp}",
    "sourcetype": "thousandeyes:voice:quality",
    "source": "thousandeyes_webhook",
    "index": "cisco_ucapps_index",
    "event": {
      "test_name": "${test.testName}",
      "test_id": "${test.testId}",
      "agent_name": "${agent.agentName}",
      "target": "${test.target}",
      "alert_type": "${alert.type}",
      "mos_score": "${voice.mos}",
      "latency_ms": "${voice.latency}",
      "packet_loss_percent": "${voice.packetLoss}",
      "jitter_ms": "${voice.jitter}",
      "network_path": "${network.pathTrace}"
    }
  }
}
```

3. **Test webhook** using "Send Test Event" feature
4. Verify data in Splunk:

```spl
index=cisco_ucapps_index sourcetype=thousandeyes:voice:quality
| head 10
| table _time, test_name, agent_name, mos_score, latency_ms, packet_loss_percent
```

### 4.6 Alert Rules Configuration

**Voice Quality Degradation Alert:**

```
Alert Rule Name: Webex Calling - Poor Voice Quality Detected
+-----------------------------------------------------------------+
|  Condition:                                                     |
|  +-- MOS Score < 3.5                                            |
|  +-- Duration: 3 consecutive test rounds (6 minutes)            |
|  +-- Affects: Any location                                      |
|                                                                 |
|  Notification:                                                  |
|  +-- Send webhook to Splunk (for ML correlation)               |
|  +-- Email: noc@abhavtech.com                                   |
|  +-- ServiceNow incident (via webhook)                          |
|                                                                 |
|  Suppression:                                                   |
|  +-- 30 minutes per test (avoid alert fatigue)                  |
+-----------------------------------------------------------------+
```

**Network Path Change Alert:**

```
Alert Rule Name: Webex Calling - Network Path Changed
+-----------------------------------------------------------------+
|  Condition:                                                     |
|  +-- Path trace shows different route                           |
|  +-- Duration: 2 consecutive tests (4 minutes)                  |
|  +-- Excludes: Expected path changes (maintenance windows)      |
|                                                                 |
|  Notification:                                                  |
|  +-- Send webhook to Splunk                                     |
|  +-- Email: network-team@abhavtech.com                          |
+-----------------------------------------------------------------+
```

---

## 5. Splunk Data Ingestion

### 5.1 Index Design

**Webex-Specific Indexes:**

```
cisco_ucapps_index (Primary Webex Data):
+-----------------------------------------------------------------+
|  Purpose:      All Webex Calling/Contact Center operational    |
|                data, quality metrics, CDRs                      |
|  Retention:    90 days (regulatory requirement)                 |
|  Size:         ~300 GB (for 3,200 users over 90 days)          |
|  Replication:  3 (production standard)                          |
|  Search Factor: 2 (for query performance)                       |
|                                                                 |
|  Source Types:                                                  |
|  +-- webex:calling:quality (real-time metrics)                 |
|  +-- webex:calling:history (daily reports)                     |
|  +-- webex:contact_center:queue (WxCC queue stats)             |
|  +-- webex:contact_center:agent (agent performance)            |
|  +-- thousandeyes:voice:quality (ThousandEyes data)            |
+-----------------------------------------------------------------+

cisco_ai_events_index (AI-Generated Events):
+-----------------------------------------------------------------+
|  Purpose:      AI/ML predictions, anomalies, automated actions  |
|  Retention:    2 years (long-term trending)                     |
|  Size:         ~50 GB                                           |
|  Replication:  3                                                |
|                                                                 |
|  Source Types:                                                  |
|  +-- mltk:prediction:webex (MLTK model outputs)                |
|  +-- workflow:automation:webex (WF-001 executions)             |
|  +-- alert:ai_driven (proactive alerts)                         |
+-----------------------------------------------------------------+
```

**Index Configuration (indexes.conf):**

```ini
## $SPLUNK_HOME/etc/system/local/indexes.conf 

[cisco_ucapps_index]
homePath   = $SPLUNK_DB/cisco_ucapps_index/db
coldPath   = $SPLUNK_DB/cisco_ucapps_index/colddb
thawedPath = $SPLUNK_DB/cisco_ucapps_index/thaweddb
maxTotalDataSizeMB = 307200
frozenTimePeriodInSecs = 7776000
## 90 days retention 

[cisco_ai_events_index]
homePath   = $SPLUNK_DB/cisco_ai_events_index/db
coldPath   = $SPLUNK_DB/cisco_ai_events_index/colddb
thawedPath = $SPLUNK_DB/cisco_ai_events_index/thaweddb
maxTotalDataSizeMB = 51200
frozenTimePeriodInSecs = 63072000
## 2 years retention 
```

### 5.2 HTTP Event Collector (HEC) Setup

**HEC Token Configuration:**

```bash
## Create HEC token for Webex integrations 
curl -k -u admin:YOUR_ADMIN_PASSWORD \
  https://splunk-hec.abhavtech.com:8089/servicesNS/nobody/splunk_httpinput/data/inputs/http \
  -d name=webex_calling_hec \
  -d index=cisco_ucapps_index \
  -d sourcetype=webex:calling:api \
  -d disabled=0

## Response includes token: 
{
  "token": "ABCD1234-5678-90EF-GHIJ-KLMNOPQRSTUV"
}
```

**HEC Endpoint Testing:**

```bash
## Test HEC endpoint with sample event 
curl -k https://splunk-hec.abhavtech.com:8088/services/collector/event \
  -H "Authorization: Splunk ABCD1234-5678-90EF-GHIJ-KLMNOPQRSTUV" \
  -d '{
    "time": 1706904000,
    "sourcetype": "webex:calling:quality",
    "event": {
      "user_email": "test.user@abhavtech.com",
      "mos_score": 4.2,
      "latency_ms": 45,
      "packet_loss_percent": 0.1
    }
  }'

## Expected response: 
{"text":"Success","code":0}
```

### 5.3 Data Transformation & Enrichment

**OpenTelemetry Collector Configuration:**

```yaml
## otel-config.yaml - Deployed at hub sites 
## /etc/otelcol/config.yaml 

receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318
  
## Webhook receiver for ThousandEyes 
  webhookevent:
    endpoint: 0.0.0.0:8088
    path: /services/collector/event
    
processors:
## Batch events for efficiency 
  batch:
    send_batch_size: 1000
    timeout: 10s
    send_batch_max_size: 10000
  
## Add resource attributes (location, region) 
  resource:
    attributes:
      - key: deployment.environment
        value: production
        action: insert
      - key: service.name
        value: webex-calling
        action: insert
  
## Add location context based on source IP 
  attributes:
    actions:
      - key: location
        from_attribute: source_ip
        action: insert
  
## Transform Webex quality metrics to standard format 
  transform:
    metric_statements:
      - context: datapoint
        statements:
## Convert MOS to 0-100 scale for normalization 
          - set(attributes["mos_normalized"], attributes["mos_score"] * 20)
          
## Calculate quality category 
          - set(attributes["quality_category"], "excellent") where attributes["mos_score"] >= 4.0
          - set(attributes["quality_category"], "good") where attributes["mos_score"] >= 3.5 and attributes["mos_score"] < 4.0
          - set(attributes["quality_category"], "fair") where attributes["mos_score"] >= 3.0 and attributes["mos_score"] < 3.5
          - set(attributes["quality_category"], "poor") where attributes["mos_score"] < 3.0

exporters:
## Export to Splunk HEC 
  splunk_hec:
    endpoint: https://splunk-hec.abhavtech.com:8088/services/collector
    token: "YOUR_HEC_TOKEN"
    index: cisco_ucapps_index
    source: otel_collector
    max_connections: 20
    disable_compression: false
    timeout: 10s
    tls:
      insecure_skip_verify: false
      ca_file: /etc/ssl/certs/ca-bundle.crt

service:
  pipelines:
    metrics:
      receivers: [otlp, webhookevent]
      processors: [batch, resource, attributes, transform]
      exporters: [splunk_hec]
```

**Deploy OTel Collector:**

```bash
## Deploy as Docker container at each hub site 
docker run -d \
  --name otel-collector-webex \
  --hostname otel-mumbai \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 8088:8088 \
  -v /etc/otelcol/config.yaml:/etc/otel/config.yaml \
  --restart unless-stopped \
  otel/opentelemetry-collector-contrib:latest \
  --config /etc/otel/config.yaml
```

### 5.4 Props and Transforms Configuration

**props.conf - Field Extraction:**

```ini
## $SPLUNK_HOME/etc/apps/abhavtech_webex/local/props.conf 

[webex:calling:quality]
SHOULD_LINEMERGE = false
TIME_PREFIX = \"time\"\s*:\s*
TIME_FORMAT = %s
MAX_TIMESTAMP_LOOKAHEAD = 20
KV_MODE = json
INDEXED_EXTRACTIONS = json

## Field aliases for consistency 
FIELDALIAS-user = event.user_email AS user
FIELDALIAS-mos = event.mos_score AS mos
FIELDALIAS-latency = event.latency_ms AS latency
FIELDALIAS-jitter = event.jitter_ms AS jitter
FIELDALIAS-packet_loss = event.packet_loss_percent AS packet_loss

## Calculated fields 
EVAL-quality_grade = case(mos>=4.0, "Excellent", mos>=3.5, "Good", mos>=3.0, "Fair", mos<3.0, "Poor")
EVAL-call_duration_minutes = round(event.call_duration / 60, 2)

## Lookups 
LOOKUP-user_info = webex_users_lookup user_email OUTPUT location, department, manager_email

[thousandeyes:voice:quality]
SHOULD_LINEMERGE = false
TIME_PREFIX = \"time\"\s*:\s*
TIME_FORMAT = %s
KV_MODE = json
INDEXED_EXTRACTIONS = json

## Normalize ThousandEyes fields to match Webex format 
FIELDALIAS-te_mos = event.mos_score AS mos
FIELDALIAS-te_latency = event.latency_ms AS latency
FIELDALIAS-te_jitter = event.jitter_ms AS jitter
FIELDALIAS-te_packet_loss = event.packet_loss_percent AS packet_loss
```

**transforms.conf - Lookups:**

```ini
## $SPLUNK_HOME/etc/apps/abhavtech_webex/local/transforms.conf 

[webex_users_lookup]
filename = webex_users.csv
case_sensitive_match = false
match_type = EXACT(user_email)

[webex_locations_lookup]
filename = webex_locations.csv
case_sensitive_match = false
match_type = EXACT(location)
```

**Lookup Files:**

```csv
## lookups/webex_users.csv 
user_email,location,department,manager_email,region
john.doe@abhavtech.com,Mumbai,Engineering,manager1@abhavtech.com,APAC
jane.smith@abhavtech.com,London,Sales,manager2@abhavtech.com,EMEA
## ... 3,200 user entries ... 

## lookups/webex_locations.csv 
location,city,country,region,timezone,site_type
Mumbai,Mumbai,India,APAC,Asia/Kolkata,hub
Chennai,Chennai,India,APAC,Asia/Kolkata,hub
London,London,United Kingdom,EMEA,Europe/London,hub
Frankfurt,Frankfurt,Germany,EMEA,Europe/Berlin,hub
New Jersey,Newark,United States,Americas,America/New_York,hub
Dallas,Dallas,United States,Americas,America/Chicago,hub
## ... all 19 sites (6 hubs + 13 branches) ... 
```

### 5.5 Data Verification Queries

**Query 1: Verify Data Ingestion Rate**

```spl
index=cisco_ucapps_index sourcetype=webex:calling:quality
| timechart span=15m count as events_per_15min
| eval expected_events=200
| eval ingestion_health=case(
    events_per_15min < expected_events * 0.5, "CRITICAL - Low ingestion",
    events_per_15min < expected_events * 0.8, "WARNING - Below threshold",
    1=1, "OK"
  )
| table _time, events_per_15min, expected_events, ingestion_health
```

**Query 2: Verify Field Extraction**

```spl
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-1h
| stats 
    count as total_events,
    count(mos) as events_with_mos,
    count(latency) as events_with_latency,
    count(user) as events_with_user,
    count(location) as events_with_location
| eval 
    mos_extraction_rate = round((events_with_mos / total_events) * 100, 2),
    latency_extraction_rate = round((events_with_latency / total_events) * 100, 2),
    user_extraction_rate = round((events_with_user / total_events) * 100, 2),
    location_extraction_rate = round((events_with_location / total_events) * 100, 2)
| table total_events, mos_extraction_rate, latency_extraction_rate, user_extraction_rate, location_extraction_rate

## All rates should be >95% 
```

**Query 3: Verify Enrichment (Lookups)**

```spl
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-1h
| lookup webex_users_lookup user_email OUTPUT location, department, manager_email
| stats 
    count as total_events,
    count(eval(isnotnull(location))) as events_with_location_lookup,
    count(eval(isnotnull(department))) as events_with_department_lookup
| eval 
    location_lookup_success_rate = round((events_with_location_lookup / total_events) * 100, 2),
    department_lookup_success_rate = round((events_with_department_lookup / total_events) * 100, 2)
| table total_events, location_lookup_success_rate, department_lookup_success_rate

## Rates should be >90% (some users may be new/temporary) 
```

---

## 6. AI/ML Model Configuration

### 6.1 MLTK Model: Webex Call Quality Anomaly Detection

**Model Purpose:**
Detect abnormal patterns in call quality metrics that may indicate network issues, device problems, or Webex cloud service degradation.

**Training Data Requirements:**
- Minimum 30 days of call quality data
- Must include:
  - Normal business hours
  - Off-hours periods
  - Weekend patterns
  - Peak usage periods (morning stand-ups, lunch breaks)

**Model Training Procedure:**

```spl
## Step 1: Generate Training Dataset (Run after 30+ days of data collection) 
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-90d
| eval hour_of_day=strftime(_time, "%H")
| eval day_of_week=strftime(_time, "%A")
| eval is_business_hours=if(hour_of_day>=9 AND hour_of_day<=17 AND day_of_week NOT IN ("Saturday", "Sunday"), 1, 0)
| bin _time span=15m
| stats 
    avg(mos) as avg_mos,
    avg(latency) as avg_latency,
    avg(jitter) as avg_jitter,
    avg(packet_loss) as avg_packet_loss,
    count as call_count by _time, location, is_business_hours
| outputlookup webex_call_quality_training_data.csv
```

```spl
## Step 2: Train Density-Based Anomaly Detection Model 
| inputlookup webex_call_quality_training_data.csv
| fit DensityFunction avg_mos avg_latency avg_jitter avg_packet_loss 
    into webex_quality_anomaly_model
    threshold=0.01
```

**Model Explanation:**
- **Algorithm**: DensityFunction (unsupervised learning)
- **Features**: avg_mos, avg_latency, avg_jitter, avg_packet_loss
- **Threshold**: 0.01 (1% of data points considered anomalous)
- **Output**: Anomaly score (0-1), where >0.9 indicates high likelihood of anomaly

**Scheduled Model Application:**

```spl
## Saved Search: Webex Quality Anomaly Detection 
## Schedule: Every 15 minutes 
## Alert Trigger: If >5 anomalies detected in last 15 minutes 

index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-15m
| bin _time span=15m
| stats 
    avg(mos) as avg_mos,
    avg(latency) as avg_latency,
    avg(jitter) as avg_jitter,
    avg(packet_loss) as avg_packet_loss by _time, location
| apply webex_quality_anomaly_model
| where "IsOutlier(avg_mos,avg_latency,avg_jitter,avg_packet_loss)"=1
| eval anomaly_severity=case(
    avg_mos<3.0, "critical",
    avg_mos<3.5, "high",
    1=1, "medium"
  )
| eval anomaly_description=
    "Location: " . location . 
    " | MOS: " . round(avg_mos, 2) . 
    " | Latency: " . round(avg_latency, 0) . "ms" .
    " | Jitter: " . round(avg_jitter, 0) . "ms" .
    " | Packet Loss: " . round(avg_packet_loss, 2) . "%"
| table _time, location, anomaly_severity, anomaly_description, avg_mos, avg_latency, avg_jitter, avg_packet_loss
| outputlookup append=true webex_quality_anomalies.csv

## Alert Action: If count>5, create ServiceNow incident 
```

### 6.2 MLTK Model: MOS Score Prediction

**Model Purpose:**
Predict future MOS scores based on network conditions to enable proactive intervention before users experience poor call quality.

**Training Approach:**

```spl
## Step 1: Create Feature Set with Lag Variables 
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-90d
| bin _time span=5m
| stats 
    avg(mos) as mos_current,
    avg(latency) as latency_current,
    avg(jitter) as jitter_current,
    avg(packet_loss) as packet_loss_current,
    count as call_volume by _time, location
    
## Add lag features (previous periods) 
| streamstats window=3
    avg(latency_current) as latency_lag3,
    avg(jitter_current) as jitter_lag3
    by location
    
| where isnotnull(latency_lag3)

## Create target variable (MOS in next 15 minutes) 
| streamstats window=3 current=f 
    avg(mos_current) as mos_future 
    by location
    
| where isnotnull(mos_future)
| outputlookup webex_mos_prediction_training_data.csv
```

```spl
## Step 2: Train Linear Regression Model 
| inputlookup webex_mos_prediction_training_data.csv
| fit LinearRegression mos_future 
    from latency_current jitter_current packet_loss_current latency_lag3 jitter_lag3 call_volume
    into webex_mos_prediction_model
```

**Real-Time Prediction:**

```spl
## Saved Search: Webex MOS Prediction (Proactive Alert) 
## Schedule: Every 5 minutes 
## Alert Trigger: If predicted MOS <3.5 for any location 

index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-15m
| bin _time span=5m
| stats 
    avg(mos) as mos_current,
    avg(latency) as latency_current,
    avg(jitter) as jitter_current,
    avg(packet_loss) as packet_loss_current,
    count as call_volume by _time, location
    
| streamstats window=3
    avg(latency_current) as latency_lag3,
    avg(jitter_current) as jitter_lag3
    by location
    
| apply webex_mos_prediction_model
| rename "predicted(mos_future)" as mos_predicted_next_15min

| where mos_predicted_next_15min<3.5

## Alert Action: Trigger WF-001 workflow (proactive network optimization) 
| table _time, location, mos_current, mos_predicted_next_15min, latency_current, jitter_current, packet_loss_current
```

### 6.3 MLTK Model: User Experience Clustering

**Model Purpose:**
Group users into experience clusters (excellent, good, fair, poor) based on their historical call quality patterns to identify at-risk user segments.

```spl
## Training: K-Means Clustering 
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-90d
| stats 
    avg(mos) as avg_mos,
    avg(latency) as avg_latency,
    avg(packet_loss) as avg_packet_loss,
    stdev(mos) as mos_variability,
    count as total_calls,
    count(eval(mos<3.5)) as poor_quality_calls by user
    
| eval poor_quality_rate=poor_quality_calls/total_calls

| fit KMeans avg_mos avg_latency mos_variability poor_quality_rate 
    k=4 
    into webex_user_experience_clusters
    
## Apply labels to clusters 
| eval cluster_label=case(
    avg_mos>=4.0, "Excellent Users",
    avg_mos>=3.5, "Good Users",
    avg_mos>=3.0, "Fair Users",
    avg_mos<3.0, "Poor Users"
  )
```

**Application - Identify At-Risk Users:**

```spl
## Dashboard Panel: At-Risk User Segments 
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-7d
| stats 
    avg(mos) as avg_mos,
    avg(latency) as avg_latency,
    avg(packet_loss) as avg_packet_loss,
    stdev(mos) as mos_variability,
    count as total_calls,
    count(eval(mos<3.5)) as poor_quality_calls by user, location, device_type
    
| eval poor_quality_rate=poor_quality_calls/total_calls

| apply webex_user_experience_clusters
| rename cluster as experience_cluster

| where experience_cluster="Poor Users"

| lookup webex_users_lookup user_email as user OUTPUT department, manager_email

| sort - poor_quality_rate
| head 20
| table user, location, device_type, avg_mos, poor_quality_rate, department, manager_email
```

### 6.4 Model Retraining Schedule

**Automated Retraining:**

```
Model Retraining Schedule:
+-- Webex Quality Anomaly Model: Weekly (every Monday 02:00 UTC)
+-- MOS Prediction Model: Weekly (every Monday 03:00 UTC)
+-- User Experience Clustering: Monthly (first Sunday of month, 02:00 UTC)

Retraining Validation:
+-- Hold-out test set: 20% of data
+-- Accuracy threshold: >85% for supervised models
+-- Model drift detection: Alert if accuracy drops >10%
+-- Manual review required if validation fails
```

**Scheduled Search for Automatic Retraining:**

```spl
## Saved Search: Retrain Webex Quality Anomaly Model 
## Schedule: Every Monday 02:00 UTC 
## Action: Email notification with retraining results 

| inputlookup webex_call_quality_training_data.csv
| fit DensityFunction avg_mos avg_latency avg_jitter avg_packet_loss 
    into webex_quality_anomaly_model
    threshold=0.01
    
| stats count as training_records
| eval retraining_timestamp=now()
| eval retraining_status="success"
| table retraining_timestamp, training_records, retraining_status
| outputlookup webex_model_retraining_log.csv append=true
```

### 6.5 Model Performance Monitoring

**Dashboard: ML Model Health**

```spl
## Panel 1: Model Accuracy Trends 
| inputlookup webex_model_retraining_log.csv
| timechart span=1w 
    avg(accuracy) as avg_accuracy by model_name
| eval threshold=85
| eval status=if(avg_accuracy<threshold, "DEGRADED", "OK")
```

```spl
## Panel 2: Anomaly Detection Rate 
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-7d
| apply webex_quality_anomaly_model
| timechart span=1d 
    count(eval("IsOutlier(...)"=1)) as anomalies,
    count as total_events
| eval anomaly_rate=(anomalies/total_events)*100
| eval expected_range="0.5-2.0%"
```

---

## 7. Dashboard Creation

### 7.1 Executive Dashboard: Webex Operations Overview

**Dashboard Purpose:**
High-level view of Webex Calling/Contact Center health for IT leadership and executives.

**XML Source (Save as dashboard):**

```xml
<dashboard version="1.1">
  <label>Webex Operations - Executive Dashboard</label>
  <description>Real-time overview of Webex Calling and Contact Center operations for Abhavtech</description>
  
  <!-- Refresh: Every 5 minutes -->
  <refresh>300</refresh>
  
  <!-- Row 1: Key Performance Indicators -->
  <row>
    <panel>
      <title>Active Users (Last Hour)</title>
      <single>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-1h
| stats dc(user_email) as active_users
          </query>
          <earliest>-1h</earliest>
          <latest>now</latest>
        </search>
        <option name="drilldown">none</option>
        <option name="numberPrecision">0</option>
        <option name="rangeColors">["0x65A637","0x65A637","0x65A637"]</option>
        <option name="underLabel">of 3,200 total users</option>
      </single>
    </panel>
    
    <panel>
      <title>Average MOS Score (Last Hour)</title>
      <single>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-1h
| stats avg(mos_score) as avg_mos
| eval avg_mos=round(avg_mos, 2)
          </query>
        </search>
        <option name="numberPrecision">0.01</option>
        <option name="rangeColors">["0xD41F1F","0xF7BC38","0x65A637"]</option>
        <option name="rangeValues">[3.5,4.0]</option>
        <option name="underLabel">Target: >=4.0</option>
        <option name="useColors">1</option>
      </single>
    </panel>
    
    <panel>
      <title>Poor Quality Calls (%)</title>
      <single>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-1h
| stats 
    count as total_calls,
    count(eval(mos_score<3.5)) as poor_calls
| eval poor_call_percentage=round((poor_calls/total_calls)*100, 2)
| fields poor_call_percentage
          </query>
        </search>
        <option name="numberPrecision">0.01</option>
        <option name="unit">%</option>
        <option name="rangeColors">["0x65A637","0xF7BC38","0xD41F1F"]</option>
        <option name="rangeValues">[2,5]</option>
        <option name="underLabel">Target: <2%</option>
        <option name="useColors">1</option>
      </single>
    </panel>
    
    <panel>
      <title>Active Anomalies</title>
      <single>
        <search>
          <query>
| inputlookup webex_quality_anomalies.csv
| where _time >= relative_time(now(), "-1h")
| stats count as active_anomalies
          </query>
        </search>
        <option name="numberPrecision">0</option>
        <option name="rangeColors">["0x65A637","0xF7BC38","0xD41F1F"]</option>
        <option name="rangeValues">[1,5]</option>
        <option name="underLabel">Last Hour</option>
        <option name="useColors">1</option>
      </single>
    </panel>
  </row>
  
  <!-- Row 2: Regional Performance -->
  <row>
    <panel>
      <title>Call Quality by Region (Last 24 Hours)</title>
      <chart>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-24h
| lookup webex_locations_lookup location OUTPUT region
| bin _time span=1h
| stats avg(mos_score) as avg_mos by _time, region
| timechart span=1h avg(avg_mos) by region
          </query>
        </search>
        <option name="charting.chart">line</option>
        <option name="charting.axisTitleX.text">Time</option>
        <option name="charting.axisTitleY.text">Average MOS Score</option>
        <option name="charting.chart.showDataLabels">none</option>
        <option name="charting.legend.placement">bottom</option>
      </chart>
    </panel>
  </row>
  
  <!-- Row 3: Top Issues -->
  <row>
    <panel>
      <title>Top 10 Locations by Poor Call Quality</title>
      <table>
        <search>
          <query>
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-24h
| stats 
    count as total_calls,
    count(eval(mos_score<3.5)) as poor_calls,
    avg(mos_score) as avg_mos,
    avg(latency_ms) as avg_latency,
    avg(packet_loss_percent) as avg_packet_loss
    by location
| eval poor_call_rate=round((poor_calls/total_calls)*100, 2)
| eval avg_mos=round(avg_mos, 2)
| eval avg_latency=round(avg_latency, 0)
| eval avg_packet_loss=round(avg_packet_loss, 2)
| sort - poor_call_rate
| head 10
| table location, total_calls, poor_calls, poor_call_rate, avg_mos, avg_latency, avg_packet_loss
| rename 
    location AS "Location",
    total_calls AS "Total Calls",
    poor_calls AS "Poor Quality Calls",
    poor_call_rate AS "Poor Call %",
    avg_mos AS "Avg MOS",
    avg_latency AS "Avg Latency (ms)",
    avg_packet_loss AS "Avg Packet Loss (%)"
          </query>
        </search>
        <option name="drilldown">row</option>
      </table>
    </panel>
  </row>
</dashboard>
```

### 7.2 NOC Dashboard: Webex Real-Time Monitoring

**Dashboard Purpose:**
Detailed operational view for Network Operations Center engineers to monitor and troubleshoot real-time issues.

**Key Panels:**

1. **Real-Time Call Quality Metrics (Last 15 Minutes)**
```spl
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-15m
| timechart span=1m 
    avg(mos_score) as avg_mos,
    avg(latency_ms) as avg_latency,
    avg(jitter_ms) as avg_jitter,
    avg(packet_loss_percent) as avg_packet_loss
```

2. **Active Calls by Location (Geographic Map)**
```spl
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-5m
| lookup webex_locations_lookup location OUTPUT latitude, longitude, city
| stats count as active_calls by location, latitude, longitude, city
| geostats latfield=latitude longfield=longitude count by location
```

3. **ThousandEyes Path Visualization Integration**
```spl
index=cisco_ucapps_index sourcetype=thousandeyes:voice:quality earliest=-15m
| stats latest(network_path) as path_trace by source_agent, target_agent
| table source_agent, target_agent, path_trace
```

4. **AI Anomaly Alerts (Active)**
```spl
| inputlookup webex_quality_anomalies.csv
| where _time >= relative_time(now(), "-1h")
| sort - anomaly_severity
| table _time, location, anomaly_severity, anomaly_description
```

5. **Device Type Performance Breakdown**
```spl
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-1h
| stats 
    count as call_count,
    avg(mos_score) as avg_mos,
    count(eval(mos_score<3.5)) as poor_quality_calls
    by device_type
| eval poor_quality_rate=round((poor_quality_calls/call_count)*100, 2)
| sort - poor_quality_rate
```

### 7.3 Webex Contact Center Dashboard (Phase 2)

**Dashboard Purpose:**
Monitor Webex Contact Center queue performance, agent metrics, and customer experience.

**Key Panels:**

1. **Queue Performance**
```spl
index=cisco_ucapps_index sourcetype=webex:contact_center:queue earliest=-1h
| stats 
    avg(average_speed_to_answer) as avg_asa,
    avg(service_level_30s) as service_level,
    avg(abandonment_rate) as abandonment_rate
    by queue_name
| eval avg_asa=round(avg_asa, 0)
| eval service_level=round(service_level, 2)
| eval abandonment_rate=round(abandonment_rate, 2)
```

2. **Agent Availability (Real-Time)**
```spl
index=cisco_ucapps_index sourcetype=webex:contact_center:agent
| stats 
    count(eval(agent_state="available")) as available_agents,
    count(eval(agent_state="on_call")) as agents_on_call,
    count(eval(agent_state="wrap_up")) as agents_in_wrap_up,
    count(eval(agent_state="offline")) as offline_agents
```

3. **Customer Satisfaction (CSAT) Trend**
```spl
index=cisco_ucapps_index sourcetype=webex:contact_center:interaction earliest=-7d
| timechart span=1d avg(csat_score) as avg_csat
```

---

## 8. Alerting & Automation

### 8.1 WF-001: Webex Branch Call Quality Optimization

**Workflow Purpose:**
Automatically detect and remediate poor Webex Calling quality at branch sites by correlating voice metrics with network conditions.

**Trigger Conditions:**
- Branch location MOS <3.5 for 5+ consecutive calls (10+ minutes)
- Packet loss >1% sustained for 15+ minutes
- ThousandEyes detects path degradation

**Workflow Steps:**

```
WF-001 Execution Flow:
+-----------------------------------------------------------------+
| Step 1: Detect Quality Degradation (Splunk Alert)              |
+-----------------------------------------------------------------+
| Search:                                                         |
|   index=cisco_ucapps_index earliest=-15m                        |
|   | stats avg(mos_score) as avg_mos by location                |
|   | where avg_mos<3.5                                           |
|   | lookup webex_locations_lookup location                      |
|     OUTPUT site_type                                            |
|   | where site_type="branch"                                    |
|                                                                 |
| Trigger: If branch detected with poor quality                  |
+-----------------------------------------------------------------+
         |
         v
+-----------------------------------------------------------------+
| Step 2: Correlate with Network Data (DNAC/ThousandEyes)        |
+-----------------------------------------------------------------+
| Actions:                                                        |
| 1. Query DNAC Assurance for branch network health              |
| 2. Query ThousandEyes for WAN path quality                     |
| 3. Check vManage for SD-WAN tunnel status                      |
|                                                                 |
| Correlation Logic:                                              |
|   IF network_health="critical" OR wan_path_degraded=true       |
|   THEN root_cause="network"                                     |
|   ELSE root_cause="webex_cloud"                                 |
+-----------------------------------------------------------------+
         |
         v
+-----------------------------------------------------------------+
| Step 3: Automated Remediation (Network)                        |
+-----------------------------------------------------------------+
| IF root_cause="network":                                        |
|   1. Increase QoS priority for Webex Calling traffic (EF)      |
|   2. Adjust SD-WAN tunnel preference (prefer MPLS over Internet|
|   3. Disable bandwidth-intensive applications (guest WiFi)      |
|   4. Restart WAN edge router if high CPU/memory utilization     |
|                                                                 |
| API Calls:                                                      |
|   - vManage API: Update policy to prefer MPLS                  |
|   - DNAC API: Adjust QoS policy for branch                     |
+-----------------------------------------------------------------+
         |
         v
+-----------------------------------------------------------------+
| Step 4: Create ServiceNow Incident                             |
+-----------------------------------------------------------------+
| Incident Details:                                               |
|   Short Description: Poor Webex Calling quality at [location]  |
|   Priority: P2 (High)                                           |
|   Assignment Group: Network Operations                          |
|   Description: Automated detection via WF-001 workflow          |
|                MOS: [value] | Latency: [value]ms               |
|                Root Cause: [network/webex_cloud]               |
|                Remediation: [actions_taken]                    |
|                                                                 |
|   Attachments:                                                  |
|   - Call quality chart (last 1 hour)                           |
|   - ThousandEyes path visualization                            |
|   - DNAC network health report                                 |
+-----------------------------------------------------------------+
         |
         v
+-----------------------------------------------------------------+
| Step 5: Monitor for Resolution                                 |
+-----------------------------------------------------------------+
| Re-check quality every 5 minutes for next 30 minutes           |
| IF quality returns to normal (MOS>=4.0):                       |
|   - Auto-close ServiceNow incident                             |
|   - Send success notification                                  |
|                                                                 |
| ELSE after 30 minutes:                                          |
|   - Escalate to P1 (Critical)                                  |
|   - Notify on-call engineer via PagerDuty                      |
+-----------------------------------------------------------------+
```

**Splunk Alert Configuration:**

```xml
<!-- Splunk Alert: WF-001 Trigger -->
<alert>
  <title>WF-001: Webex Branch Quality Degradation</title>
  <search>
index=cisco_ucapps_index sourcetype=webex:calling:quality earliest=-15m
| stats 
    avg(mos_score) as avg_mos,
    avg(latency_ms) as avg_latency,
    avg(packet_loss_percent) as avg_packet_loss,
    count as call_count
    by location
| lookup webex_locations_lookup location OUTPUT site_type, region
| where site_type="branch" AND avg_mos<3.5 AND call_count>=5
| eval severity=case(
    avg_mos<3.0, "critical",
    avg_mos<3.5, "high",
    1=1, "medium"
  )
  </search>
  
  <schedule>
    <cron_schedule>*/5 * * * *</cron_schedule> <!-- Every 5 minutes -->
  </schedule>
  
  <actions>
    <!-- Action 1: Run Python script for automated remediation -->
    <script>
      <filename>wf001_remediation.py</filename>
      <parameters>location=$result.location$ mos=$result.avg_mos$</parameters>
    </script>
    
    <!-- Action 2: Create ServiceNow incident -->
    <webhook>
      <url>https://abhavtech.service-now.com/api/now/table/incident</url>
      <method>POST</method>
      <headers>
        <header name="Content-Type">application/json</header>
        <header name="Authorization">Basic [BASE64_CREDENTIALS]</header>
      </headers>
      <body>
{
  "short_description": "Poor Webex Calling Quality - $result.location$",
  "description": "Automated detection via WF-001\n\nMetrics:\n- MOS Score: $result.avg_mos$\n- Latency: $result.avg_latency$ms\n- Packet Loss: $result.avg_packet_loss$%\n- Affected Calls: $result.call_count$",
  "priority": "2",
  "assignment_group": "Network Operations",
  "category": "Network",
  "subcategory": "Voice Quality"
}
      </body>
    </webhook>
    
    <!-- Action 3: Email notification -->
    <email>
      <to>noc@abhavtech.com, network-team@abhavtech.com</to>
      <subject>WF-001 Alert: Poor Webex Quality at $result.location$</subject>
      <message>
Automated quality degradation detected at $result.location$

Quality Metrics:
- MOS Score: $result.avg_mos$ (Target: >=4.0)
- Latency: $result.avg_latency$ms (Target: <150ms)
- Packet Loss: $result.avg_packet_loss$% (Target: <1%)
- Affected Calls: $result.call_count$

Automated remediation initiated. ServiceNow incident created.

Dashboard: https://splunk.abhavtech.com/app/abhavtech_webex/webex_noc_dashboard
      </message>
    </email>
  </actions>
</alert>
```

### 8.2 Additional Alert Rules

**Alert 2: Webex Control Hub API Failure**

```spl
## Detect API polling failures 
index=cisco_ucapps_index sourcetype=webex:api:error earliest=-30m
| stats count as error_count by error_type
| where error_count>5

## Alert Action: Page on-call observability engineer 
```

**Alert 3: ThousandEyes Agent Offline**

```spl
index=thousandeyes_webhook sourcetype=thousandeyes:agent:status
| stats latest(status) as agent_status by agent_name
| where agent_status="offline"

## Alert Action: Critical ServiceNow incident (P1) 
```

**Alert 4: Webex Data Ingestion Lag**

```spl
## Detect if data ingestion is delayed >30 minutes 
index=cisco_ucapps_index sourcetype=webex:calling:quality
| eval ingestion_lag=now()-_time
| where ingestion_lag>1800
| stats count as delayed_events

## Alert Action: Email observability team 
```

---

## 9. Testing & Validation

### 9.1 Integration Testing Checklist

**Phase 1: Component Testing**

```
[ ] Webex Control Hub API:
  [ ] OAuth token generation successful
  [ ] API calls return data within 5 seconds
  [ ] Call quality metrics endpoint responding
  [ ] Historical report generation working
  [ ] Rate limiting handled correctly

[ ] ThousandEyes Integration:
  [ ] All 6 Enterprise Agents registered
  [ ] Voice Call Tests (RTP) running every 2 minutes
  [ ] Webex Cloud Agents reachable
  [ ] Network path traces visible
  [ ] Webhook to Splunk delivering data

[ ] Splunk HEC:
  [ ] HEC token accepting events
  [ ] Events arriving in correct index (cisco_ucapps_index)
  [ ] Field extraction working correctly
  [ ] Lookups enriching data properly

[ ] OpenTelemetry Collector:
  [ ] Collectors deployed at all 6 hub sites
  [ ] Batch processing functional
  [ ] Data transformation rules applying correctly
  [ ] Export to Splunk HEC successful
```

**Phase 2: End-to-End Testing**

```
Test Scenario 1: Generate Test Call with Known Quality
+-----------------------------------------------------------------+
| Objective: Verify that a test call appears in Splunk with      |
|            correct quality metrics                              |
|                                                                 |
| Steps:                                                          |
| 1. Place test call from Mumbai to London (10 minute duration)  |
| 2. Monitor call quality in real-time via Webex App             |
| 3. Wait 15 minutes for API data collection                     |
| 4. Search Splunk for test call:                                |
|    index=cisco_ucapps_index user_email="test@abhavtech.com"    |
| 5. Verify metrics match:                                       |
|    - Call duration ~10 minutes                                 |
|    - MOS score ~4.0 (if network conditions are good)           |
|    - Latency <100ms (Mumbai-London typical)                    |
|                                                                 |
| Expected Result: Call data visible in Splunk within 15 minutes |
| Pass Criteria: All metrics within +/-10% of observed values      |
+-----------------------------------------------------------------+
```

```
Test Scenario 2: Simulate Poor Network Conditions
+-----------------------------------------------------------------+
| Objective: Verify that poor call quality triggers WF-001       |
|                                                                 |
| Steps:                                                          |
| 1. Use Linux TC (traffic control) to add latency/packet loss:  |
|    tc qdisc add dev eth0 root netem delay 200ms loss 2%        |
| 2. Place 5+ test calls from affected branch                    |
| 3. Wait 15 minutes for detection                               |
| 4. Verify WF-001 workflow triggered:                           |
|    - Splunk alert fired                                        |
|    - ServiceNow incident created                               |
|    - Email notification sent                                   |
| 5. Remove network degradation:                                 |
|    tc qdisc del dev eth0 root                                  |
| 6. Verify quality returns to normal                            |
| 7. Verify ServiceNow incident auto-closed                      |
|                                                                 |
| Expected Result: Full WF-001 lifecycle executed                |
| Pass Criteria: Incident created AND auto-closed when resolved  |
+-----------------------------------------------------------------+
```

### 9.2 Performance Testing

**Load Test: API Polling at Scale**

```python
## Load test script: Simulate 3,200 users making concurrent calls 
## Goal: Verify API can handle peak load 

import requests
import concurrent.futures
import time

def simulate_call_quality_collection():
    """Simulate API call to retrieve call quality for one user"""
## Implementation would call actual Webex API 
    pass

## Simulate peak hour: 20% of users (640) on calls simultaneously 
with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
    start_time = time.time()
    futures = [executor.submit(simulate_call_quality_collection) for _ in range(640)]
    concurrent.futures.wait(futures)
    end_time = time.time()
    
    print(f"Collection time for 640 concurrent users: {end_time - start_time} seconds")
## Target: <60 seconds 
```

**Throughput Test: Splunk HEC Ingestion**

```bash
## Generate 10,000 test events and send to HEC 
for i in {1..10000}; do
  curl -k https://splunk-hec.abhavtech.com:8088/services/collector/event \
    -H "Authorization: Splunk YOUR_HEC_TOKEN" \
    -d "{
      \"time\": $(date +%s),
      \"sourcetype\": \"webex:calling:quality\",
      \"event\": {\"test_event\": $i, \"mos_score\": 4.2}
    }" &
done
wait

## Verify all events ingested: 
## index=cisco_ucapps_index sourcetype=webex:calling:quality test_event=* 
## | stats count 
## Expected: count=10000 
```

### 9.3 Failover Testing

**Test 1: Primary OTel Collector Failure**

```
Scenario: Mumbai OTel Collector stops responding
+-----------------------------------------------------------------+
| Steps:                                                          |
| 1. Stop Mumbai OTel Collector:                                 |
|    docker stop otel-collector-webex-mumbai                      |
|                                                                 |
| 2. Verify data flow stops for Mumbai-sourced events            |
|                                                                 |
| 3. Implement backup strategy:                                  |
|    Option A: Direct API polling from Splunk (bypass OTel)      |
|    Option B: Redirect to Chennai backup OTel collector         |
|                                                                 |
| 4. Restart primary OTel Collector                              |
|                                                                 |
| 5. Verify data flow resumes                                    |
|                                                                 |
| Pass Criteria: <5 minutes data loss, automatic recovery        |
+-----------------------------------------------------------------+
```

**Test 2: Webex Control Hub API Outage**

```
Scenario: Webex API returns 503 Service Unavailable
+-----------------------------------------------------------------+
| Steps:                                                          |
| 1. Monitor Splunk data ingestion                               |
|                                                                 |
| 2. Simulate API outage (block access in firewall)              |
|                                                                 |
| 3. Verify retry logic executes:                                |
|    - Exponential backoff observed in logs                      |
|    - Script does not crash                                     |
|                                                                 |
| 4. Restore API access                                          |
|                                                                 |
| 5. Verify data collection resumes                              |
| 6. Check for data gaps (historical report backfill required)   |
|                                                                 |
| Pass Criteria: No script crashes, automatic recovery           |
+-----------------------------------------------------------------+
```

---

## 10. Operational Procedures

### 10.1 Daily Operations Checklist

**Morning Health Check (09:00 Local Time per Region):**

```
Daily Webex Observability Health Check
+-----------------------------------------------------------------+
| [ ] Review overnight incidents (ServiceNow)                       |
|   - Any P1/P2 incidents related to Webex?                       |
|   - Any WF-001 workflow executions?                             |
|                                                                 |
| [ ] Verify data ingestion health                                 |
|   Search: index=cisco_ucapps_index earliest=-24h               |
|           | stats count by sourcetype                           |
|   Expected: >20,000 events/day for webex:calling:quality       |
|                                                                 |
| [ ] Check ThousandEyes agent status                              |
|   - All 6 Enterprise Agents online?                            |
|   - Voice Call Tests running every 2 minutes?                  |
|                                                                 |
| [ ] Review AI anomaly detection results                          |
|   - Any new anomalies detected overnight?                      |
|   - False positive rate within acceptable range (<5%)?         |
|                                                                 |
| [ ] Validate Webex Control Hub API health                        |
|   - OAuth token still valid? (refresh if <24h remaining)       |
|   - API error rate <1%?                                        |
|                                                                 |
| [ ] Check dashboard availability                                 |
|   - Executive Dashboard loading?                               |
|   - NOC Dashboard real-time data refreshing?                   |
+-----------------------------------------------------------------+
```

### 10.2 Weekly Maintenance Tasks

**Monday 02:00 UTC: ML Model Retraining**

```bash
## Automated via scheduled search 
## Manual verification required: 

## 1. Check retraining log 
| inputlookup webex_model_retraining_log.csv
| where retraining_timestamp >= relative_time(now(), "-7d")
| table retraining_timestamp, model_name, training_records, retraining_status, accuracy

## 2. Verify model accuracy did not degrade 
## If accuracy dropped >10%, investigate: 
## - Data quality issues? 
## - Significant network changes? 
## - Seasonal pattern shift? 
```

**Friday 18:00 Local Time: Weekly Review Meeting**

```
Weekly Webex Observability Review
+-----------------------------------------------------------------+
| Agenda:                                                         |
| 1. Review weekly metrics (15 min)                               |
|    - Total calls: target vs actual                             |
|    - Average MOS score trend                                   |
|    - Poor quality call percentage                              |
|    - Top 5 locations by issues                                 |
|                                                                 |
| 2. Incident review (15 min)                                     |
|    - ServiceNow incidents created by WF-001                    |
|    - Resolution time analysis                                  |
|    - Root cause distribution                                   |
|                                                                 |
| 3. AI/ML insights (10 min)                                      |
|    - Anomalies detected this week                              |
|    - Predictive alerts accuracy                                |
|    - User experience clustering changes                        |
|                                                                 |
| 4. Action items from previous week (10 min)                     |
|                                                                 |
| 5. Plan for next week (10 min)                                 |
|    - Any planned maintenance?                                  |
|    - Any expected high call volume periods?                    |
+-----------------------------------------------------------------+
```

### 10.3 Monthly Maintenance Tasks

**First Sunday of Month: Comprehensive Health Assessment**

1. **Storage Capacity Planning**
```spl
## Check index growth rate 
| rest /services/data/indexes
| where title="cisco_ucapps_index" OR title="cisco_ai_events_index"
| eval currentSizeMB=currentDBSizeMB
| eval maxSizeMB=maxTotalDataSizeMB
| eval usage_percent=(currentSizeMB/maxSizeMB)*100
| table title, currentSizeMB, maxSizeMB, usage_percent

## Alert if usage >80% 
```

2. **License Utilization Review**
- Webex Pro Pack: Review enhanced analytics usage
- ThousandEyes: Verify agent license count vs deployment
- Splunk: Review daily ingestion vs license allocation

3. **Performance Tuning Review**
- Query performance analysis (slow searches)
- Dashboard load time optimization
- ML model inference time

### 10.4 Incident Response Procedures

**Procedure 1: Poor Call Quality Incident**

```
Incident Type: Users reporting poor Webex Calling quality
+-----------------------------------------------------------------+
| Step 1: Initial Triage (5 minutes)                              |
| --------------------------------------------------------------- |
| Questions to ask reporter:                                      |
| - Which location(s) affected?                                  |
| - When did issue start?                                        |
| - Intermittent or consistent?                                  |
| - Which device types affected? (Webex App, phones, devices)    |
|                                                                 |
| Splunk Queries to run:                                         |
| 1. Recent quality for affected location:                       |
|    index=cisco_ucapps_index location="[affected_location]"     |
|    earliest=-1h | timechart avg(mos_score)                     |
|                                                                 |
| 2. Check if WF-001 already detected issue:                     |
|    | inputlookup webex_quality_anomalies.csv                   |
|    | where location="[affected_location]"                      |
+-----------------------------------------------------------------+
         |
         v
+-----------------------------------------------------------------+
| Step 2: Root Cause Analysis (15 minutes)                        |
| --------------------------------------------------------------- |
| Correlation checks:                                             |
|                                                                 |
| A. Network Issues?                                              |
|    - DNAC: Check network device health                         |
|    - ThousandEyes: Check WAN path quality                      |
|    - vManage: Check SD-WAN tunnel status                       |
|                                                                 |
| B. Webex Cloud Issues?                                          |
|    - Check Webex Status Page: status.webex.com                 |
|    - Multiple locations affected = likely cloud issue          |
|    - Single location = likely local network issue              |
|                                                                 |
| C. Device/Client Issues?                                        |
|    - Specific device type affected?                            |
|    - Recent client updates?                                    |
+-----------------------------------------------------------------+
         |
         v
+-----------------------------------------------------------------+
| Step 3: Remediation (variable time)                             |
| --------------------------------------------------------------- |
| Network-related:                                                |
| - Adjust QoS policies (prioritize voice)                       |
| - Switch SD-WAN transport (MPLS vs Internet)                   |
| - Restart WAN edge router if high utilization                  |
|                                                                 |
| Webex Cloud-related:                                            |
| - Open TAC case with Cisco                                     |
| - Provide diagnostic data (session IDs, call logs)             |
|                                                                 |
| Device/Client-related:                                          |
| - Update Webex App to latest version                           |
| - Check firewall/proxy settings                                |
| - Restart device/client                                        |
+-----------------------------------------------------------------+
         |
         v
+-----------------------------------------------------------------+
| Step 4: Validation & Closure (15 minutes)                       |
| --------------------------------------------------------------- |
| 1. Monitor quality for 30 minutes post-remediation             |
| 2. Verify MOS score returned to >4.0                           |
| 3. Confirm with user(s) that quality improved                  |
| 4. Update ServiceNow incident with:                            |
|    - Root cause                                                |
|    - Remediation actions                                       |
|    - Validation results                                        |
| 5. Close incident                                              |
|                                                                 |
| Post-Incident:                                                  |
| - Document lessons learned                                     |
| - Update runbooks if needed                                    |
| - Consider proactive measures (e.g., adjust QoS permanently)   |
+-----------------------------------------------------------------+
```

---

## 11. Troubleshooting

### 11.1 Common Issues

**Issue 1: No Data Arriving in Splunk from Webex API**

```
Symptom: index=cisco_ucapps_index sourcetype=webex:calling:quality returns no results

Troubleshooting Steps:
+-----------------------------------------------------------------+
| 1. Verify OAuth token is valid                                 |
|    curl -H "Authorization: Bearer YOUR_TOKEN" \                 |
|         https://webexapis.com/v1/people/me                      |
|    Expected: Returns user info (200 OK)                        |
|    If 401 Unauthorized: Token expired, regenerate              |
|                                                                 |
| 2. Check scripted input is running                             |
|    From Splunk Web: Settings -> Data Inputs -> Scripts           |
|    Verify: webex_calling_metrics.py is Enabled                 |
|    Check logs: index=_internal source=*webex_calling_metrics*  |
|                                                                 |
| 3. Test API manually                                           |
|    Run script manually from Splunk server:                     |
|    cd $SPLUNK_HOME/etc/apps/abhavtech_webex/bin                |
|    python3 webex_calling_metrics.py                            |
|    Check output - should print JSON events                     |
|                                                                 |
| 4. Verify HEC token and endpoint                               |
|    Test HEC:                                                   |
|    curl -k https://splunk-hec:8088/services/collector/event \  |
|         -H "Authorization: Splunk YOUR_HEC_TOKEN" \            |
|         -d '{"event": "test"}'                                 |
|    Expected: {"text":"Success","code":0}                       |
|                                                                 |
| 5. Check firewall rules                                        |
|    Verify Splunk server can reach webexapis.com:443           |
|    telnet webexapis.com 443                                    |
+-----------------------------------------------------------------+
```

**Issue 2: ThousandEyes Voice Tests Not Running**

```
Symptom: ThousandEyes dashboard shows no voice test results

Troubleshooting Steps:
+-----------------------------------------------------------------+
| 1. Verify Enterprise Agents are online                         |
|    In ThousandEyes Portal: Cloud & Enterprise Agents           |
|    Check status of all 6 agents (Mumbai, Chennai, etc.)        |
|    If offline: Check agent VM/container health                 |
|                                                                 |
| 2. Verify Voice Call Tests are configured                      |
|    In ThousandEyes: Tests -> Voice Call Tests                   |
|    Expected: 6 tests (one per hub site)                        |
|    If missing: Recreate tests per section 4.2                  |
|                                                                 |
| 3. Check test interval                                         |
|    Tests should run every 2 minutes                            |
|    If paused: Resume tests                                     |
|                                                                 |
| 4. Verify Webex Cloud Agents are reachable                     |
|    From Enterprise Agent, test connectivity:                   |
|    docker exec thousandeyes-agent ping [cloud_agent_ip]        |
|                                                                 |
| 5. Check for network/firewall blocks                           |
|    Voice tests use UDP ports 10000-65535                       |
|    Verify firewall rules allow RTP traffic                     |
+-----------------------------------------------------------------+
```

**Issue 3: ML Model Predictions are Inaccurate**

```
Symptom: MLTK models producing high false positive rate (>10%)

Troubleshooting Steps:
+-----------------------------------------------------------------+
| 1. Verify sufficient training data                             |
|    | inputlookup webex_call_quality_training_data.csv          |
|    | stats count                                               |
|    Expected: >30 days of data (~40,000+ records)               |
|    If insufficient: Wait for more baseline data                |
|                                                                 |
| 2. Check for data quality issues                               |
|    | inputlookup webex_call_quality_training_data.csv          |
|    | stats count(eval(mos_score=0)) as zero_mos               |
|    If >5%: Data extraction issue, review props.conf            |
|                                                                 |
| 3. Review recent network changes                               |
|    Major infrastructure changes can invalidate model           |
|    Example: New SD-WAN deployment, ISP change                  |
|    Solution: Retrain model with post-change data              |
|                                                                 |
| 4. Adjust model threshold                                      |
|    Current threshold: 0.01 (1% outlier rate)                  |
|    If too sensitive: Increase to 0.02 or 0.03                 |
|    Edit saved search and retrain model                         |
|                                                                 |
| 5. Validate with known good/bad periods                        |
|    Test model against historical incidents                     |
|    Did model detect past known quality issues?                |
+-----------------------------------------------------------------+
```

### 11.2 Diagnostic Queries

**Query 1: API Health Check**

```spl
## Check Webex API call success rate (last 24 hours) 
index=_internal source=*webex_calling_metrics* earliest=-24h
| rex field=_raw "API call status: (?<api_status>\d+)"
| stats 
    count as total_calls,
    count(eval(api_status="200")) as successful_calls,
    count(eval(api_status="429")) as rate_limited_calls,
    count(eval(api_status>=500)) as server_errors
| eval success_rate=round((successful_calls/total_calls)*100, 2)
| eval rate_limit_rate=round((rate_limited_calls/total_calls)*100, 2)
| table total_calls, successful_calls, success_rate, rate_limited_calls, rate_limit_rate, server_errors

## Expected: success_rate >95%, rate_limit_rate <5% 
```

**Query 2: Data Freshness Check**

```spl
## Verify data is recent (not delayed) 
index=cisco_ucapps_index sourcetype=webex:calling:quality
| eval data_age_minutes=round((now()-_time)/60, 0)
| stats 
    min(data_age_minutes) as oldest_data_minutes,
    avg(data_age_minutes) as avg_data_age_minutes,
    max(data_age_minutes) as newest_data_minutes
| eval data_freshness_status=case(
    avg_data_age_minutes<20, "FRESH",
    avg_data_age_minutes<60, "ACCEPTABLE",
    avg_data_age_minutes>=60, "STALE"
  )
| table data_freshness_status, oldest_data_minutes, avg_data_age_minutes, newest_data_minutes

## Expected: data_freshness_status = "FRESH" or "ACCEPTABLE" 
```

**Query 3: ThousandEyes Integration Health**

```spl
## Verify ThousandEyes data arriving and correlating with Webex data 
index=cisco_ucapps_index (sourcetype=webex:calling:quality OR sourcetype=thousandeyes:voice:quality) earliest=-1h
| stats 
    count(eval(sourcetype="webex:calling:quality")) as webex_events,
    count(eval(sourcetype="thousandeyes:voice:quality")) as te_events
| eval te_webex_ratio=round(te_events/webex_events, 2)
| eval integration_health=case(
    te_events=0, "CRITICAL - No ThousandEyes data",
    te_webex_ratio<0.01, "WARNING - Low ThousandEyes coverage",
    1=1, "OK"
  )
| table integration_health, webex_events, te_events, te_webex_ratio

## Expected: integration_health = "OK", te_events >20 
```

### 11.3 Escalation Path

```
Escalation Matrix for Webex Observability Issues
+-----------------------------------------------------------------+
| Level 1: NOC Engineer (24x7)                                    |
| +-- Responsibility: Initial triage, run diagnostic queries      |
| +-- SLA: Respond within 15 minutes                             |
| +-- Escalate to L2 if: Cannot resolve within 1 hour            |
|                                                                 |
| Level 2: Observability Platform Team (Business Hours)           |
| +-- Responsibility: Platform issues, integrations, ML models    |
| +-- SLA: Respond within 1 hour (business hours)                |
| +-- Contact: observability@abhavtech.com                        |
| +-- Escalate to L3 if: Requires vendor support                 |
|                                                                 |
| Level 3: Vendor Support                                         |
| +-- Cisco TAC: For Webex Control Hub/Calling issues            |
| |   +-- Phone: +1-800-553-2447 (US)                            |
| |   +-- Web: https://mycase.cloudapps.cisco.com               |
| |                                                              |
| +-- ThousandEyes Support: For agent/test issues                |
| |   +-- Email: support@thousandeyes.com                        |
| |   +-- Phone: +1-415-237-EYES (3937)                          |
| |                                                              |
| +-- Splunk Support: For platform/indexing issues                |
|     +-- Portal: https://splunk.com/support                      |
|     +-- Phone: Based on support contract                       |
+-----------------------------------------------------------------+
```

---

## 12. References

### 12.1 Official Cisco/Webex Documentation

1. **Webex Calling Reports and Analytics APIs**
   - URL: https://developer.webex.com/blog/exploring-the-webex-calling-reports-and-analytics-apis
   - Content: Detailed guide on using Webex Reports API for call history, quality metrics

2. **Calling APIs Overview**
   - URL: https://developer.webex.com/blog/calling-apis-overview
   - Content: Comprehensive overview of Webex Calling APIs (provisioning, control, analytics)

3. **Analytics for Your Cloud Collaboration Portfolio**
   - URL: https://help.webex.com/article/n0rlwxe/
   - Content: Control Hub Analytics dashboard, call quality metrics

4. **Troubleshoot Webex Calling Media Quality in Control Hub**
   - URL: https://help.webex.com/article/frj1efb/
   - Content: Hop-by-hop troubleshooting, media quality metrics

5. **Advanced diagnostics and troubleshooting in Control Hub**
   - URL: https://help.webex.com/article/ni3wlvw/
   - Content: Search users/devices, media quality data

### 12.2 ThousandEyes Integration Documentation

1. **Webex Control Hub Integration (ThousandEyes)**
   - URL: https://docs.thousandeyes.com/product-documentation/integration-guides/custom-built-integrations/webex-controlhub
   - Content: Setup guide for ThousandEyes-Control Hub integration

2. **Integrate ThousandEyes with Troubleshooting in Control Hub**
   - URL: https://help.webex.com/article/nymfj2d/
   - Content: Enable ThousandEyes integration, cross-launch capabilities

3. **ThousandEyes Integration with Webex Services**
   - URL: https://help.webex.com/article/pkbkx7/
   - Content: Cloud Agents for Webex, best practices for test setup

4. **ThousandEyes Webex Monitoring Solution**
   - URL: https://www.thousandeyes.com/solutions/webex-monitoring
   - Content: Bi-directional visibility, use cases, integration tutorials

### 12.3 Splunk Documentation

1. **Splunk Machine Learning Toolkit**
   - URL: https://docs.splunk.com/Documentation/MLApp/latest/User/About
   - Content: MLTK algorithms, model training procedures

2. **HTTP Event Collector (HEC)**
   - URL: https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector
   - Content: HEC setup, token management, troubleshooting

3. **OpenTelemetry Collector with Splunk**
   - URL: https://docs.splunk.com/Observability/gdi/opentelemetry/opentelemetry.html
   - Content: OTel configuration, receivers, processors, exporters

### 12.4 Internal Abhavtech Documentation

1. **CUCM-WEBEX-MIGRATION-DOCUMENTATION-v2.md**
   - Phase 1 Webex Calling migration design and implementation

2. **AI-OBSERVABILITY-MASTER-CHECKLIST-REVISED.md**
   - Phase 2 overall observability implementation checklist

3. **AI-READY-NETWORK-MASTER-CHECKLIST-REVISED.md**
   - Phase 3 AgenticOps workflows (WF-001 definition)

4. **Chapter-3-Webex-Contact-Center-Design-Phase2.md**
   - Phase 2 WxCC design (175 agents, 10 queues)

5. **SDWAN-MASTER-CHECKLIST.md**
   - ABV-SDWAN-2024 project (underlay network for Webex)

6. **DNAC-ISE-MASTER-CHECKLIST.md**
   - ABV-SDA-ISE-2025 project (QoS policy integration)

### 12.5 Contact Information

```
Abhavtech Contacts:
+-----------------------------------------------------------------+
| Network Operations Center (NOC)                                 |
| +-- Email: noc@abhavtech.com                                    |
| +-- Phone: +91-22-1234-5678 (Mumbai)                            |
| +-- Slack: #noc-alerts                                          |
|                                                                 |
| Observability Platform Team                                     |
| +-- Email: observability@abhavtech.com                          |
| +-- Slack: #observability                                       |
| +-- Lead: Raj Kumar (raj.kumar@abhavtech.com)                   |
|                                                                 |
| Webex Calling Administration                                    |
| +-- Email: webex-admin@abhavtech.com                            |
| +-- Slack: #webex-calling                                       |
| +-- Lead: [Name TBD]                                            |
|                                                                 |
| Network Engineering                                             |
| +-- Email: network-team@abhavtech.com                           |
| +-- Slack: #network-engineering                                 |
| +-- Lead: [Name TBD]                                            |
+-----------------------------------------------------------------+
```

---

## Appendix A: API Request/Response Examples

**Example 1: Webex Call Quality Metrics API**

Request:
```http
GET https://webexapis.com/v1/analytics/call_quality?from=2026-02-13T00:00:00Z&to=2026-02-13T23:59:59Z HTTP/1.1
Authorization: Bearer ZmE4YjJlZTEt...
Content-Type: application/json
```

Response:
```json
{
  "items": [
    {
      "callId": "abc123-def456-ghi789",
      "timestamp": "2026-02-13T10:30:00Z",
      "userId": "user123@abhavtech.com",
      "userEmail": "john.doe@abhavtech.com",
      "location": "Mumbai",
      "direction": "outbound",
      "durationSeconds": 420,
      "mos": 4.2,
      "latency": 45,
      "jitter": 12,
      "packetLoss": 0.1,
      "deviceType": "webex_app",
      "deviceModel": "Windows Desktop",
      "connectionType": "ethernet",
      "localIP": "10.10.1.100",
      "remoteIP": "64.68.96.10",
      "codec": "opus",
      "mediaRegion": "Singapore"
    }
  ],
  "page": {
    "size": 1,
    "total": 3847
  }
}
```

**Example 2: ThousandEyes Voice Test Results**

Webhook Payload (sent to Splunk HEC):
```json
{
  "time": 1707819000,
  "sourcetype": "thousandeyes:voice:quality",
  "source": "thousandeyes_webhook",
  "index": "cisco_ucapps_index",
  "event": {
    "test_name": "Mumbai-to-Singapore-Webex-RTP",
    "test_id": "12345678",
    "agent_name": "Mumbai-DC-Agent",
    "target": "Singapore Webex Cloud Agent",
    "alert_type": "voice_quality_degradation",
    "mos_score": 3.2,
    "latency_ms": 180,
    "packet_loss_percent": 2.5,
    "jitter_ms": 45,
    "network_path": [
      {"hop": 1, "ip": "10.10.1.1", "rtt": 2, "name": "mumbai-gw"},
      {"hop": 2, "ip": "203.0.113.1", "rtt": 15, "name": "isp-router"},
      {"hop": 3, "ip": "64.68.96.1", "rtt": 45, "name": "webex-edge"},
      {"hop": 4, "ip": "64.68.96.10", "rtt": 50, "name": "singapore-pop"}
    ]
  }
}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 2026 | Raj Kumar | Initial creation based on official Cisco/Webex documentation and Abhavtech architecture |

---

**End of Appendix 10I**
