# Part 1: Real-time Monitoring & Alert Framework

**Document Version:** 1.0  
**Date:** March 2026  
**Project:** KidsWear India - Cisco Webex Contact Center Deployment  
**Document Type:** Low-Level Design - Operations Guide  

---

## 1. Real-time Monitoring Dashboard

### 1.1 Overview

The real-time monitoring dashboard provides Operations Managers and Supervisors with live visibility into contact center performance. This dashboard consolidates data from multiple sources:

- **Webex Contact Center:** Queue statistics, agent states, active calls
- **GCP Dialogflow CX:** IVR performance, intent recognition rates
- **Zendesk:** Ticket creation, resolution times
- **Network Infrastructure:** CUBE call quality metrics

**Key Objectives:**
- ✅ Monitor service levels in real-time (< 30 second refresh)
- ✅ Identify bottlenecks before they impact customers
- ✅ Track agent availability and utilization
- ✅ Ensure PCI-DSS compliance during payment processing
- ✅ Detect network/quality issues immediately

---

### 1.2 Dashboard Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Operations Dashboard                       │
│                  (Web Browser - React App)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
│  Webex CC    │ │     GCP     │ │  Zendesk   │
│  API         │ │  Dialogflow │ │    API     │
│  (Statistics)│ │     Logs    │ │ (Tickets)  │
└───────┬──────┘ └──────┬──────┘ └─────┬──────┘
        │               │               │
        └───────────────┼───────────────┘
                        │
                ┌───────▼──────┐
                │   Database   │
                │  (PostgreSQL)│
                │ Time-series  │
                └──────────────┘
```

**Technology Stack:**
- **Frontend:** React.js with Chart.js for visualizations
- **Backend:** Node.js Express API server
- **Database:** PostgreSQL with TimescaleDB extension (time-series data)
- **Cache:** Redis for fast metric retrieval
- **Hosting:** GCP Compute Engine (e2-medium instance)

---

### 1.3 Dashboard Components

#### 1.3.1 Queue Status Panel

**Displays (per queue):**

| Metric | Description | Threshold | Alert |
|--------|-------------|-----------|-------|
| Calls in Queue | Current waiting calls | > 5 | Yellow |
| Calls in Queue | Current waiting calls | > 10 | Red |
| Longest Wait Time | Max wait in queue | > 60s | Yellow |
| Longest Wait Time | Max wait in queue | > 120s | Red |
| Agents Available | Ready agents | < 2 | Yellow |
| Agents Available | Ready agents | < 1 | Red |
| Service Level | % answered < 30s | < 80% | Yellow |
| Service Level | % answered < 30s | < 70% | Red |

**Sample SQL Query (PostgreSQL):**
```sql
SELECT 
    queue_name,
    calls_in_queue,
    EXTRACT(EPOCH FROM (NOW() - oldest_call_time)) AS longest_wait_seconds,
    agents_available,
    agents_on_call,
    (answered_within_30s::FLOAT / total_calls) * 100 AS service_level_pct
FROM queue_stats_realtime
WHERE timestamp > NOW() - INTERVAL '1 minute'
ORDER BY queue_name;
```

---

#### 1.3.2 Agent Status Grid

**Real-time Agent States:**

| Agent ID | Name | State | Duration | Calls Today | Avg Handle Time |
|----------|------|-------|----------|-------------|-----------------|
| 1001 | Priya M. | Available | 00:02:15 | 23 | 4m 32s |
| 1002 | Rajesh K. | On Call | 00:08:45 | 19 | 5m 12s |
| 1003 | Anita S. | Wrap-Up | 00:01:03 | 31 | 3m 47s |
| 1004 | Vikram P. | Idle (Away) | 00:15:22 | 12 | 6m 05s |

**Color Coding:**
- 🟢 **Green:** Available, On Call (active)
- 🟡 **Yellow:** Wrap-Up, Idle < 5 minutes
- 🔴 **Red:** Idle > 10 minutes, Not Ready > 15 minutes

**API Endpoint (Webex CC):**
```javascript
// Node.js code to fetch agent states
const axios = require('axios');

async function getAgentStates() {
    const response = await axios.get(
        'https://api.wxcc-us1.cisco.com/v1/agents',
        {
            headers: {
                'Authorization': `Bearer ${process.env.WEBEX_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }
    );
    
    return response.data.agents.map(agent => ({
        id: agent.agentId,
        name: agent.firstName + ' ' + agent.lastName,
        state: agent.state,
        stateDuration: agent.stateDuration,
        callsHandled: agent.statistics.callsHandled,
        avgHandleTime: agent.statistics.avgHandleTime
    }));
}
```

---

#### 1.3.3 Performance Gauges

**Key Metrics (Visual Gauges):**

1. **Service Level Gauge**
   - Target: 80% answered within 30 seconds
   - Current: 87% (Green zone: 80-100%, Yellow: 70-79%, Red: <70%)
   - Trend: ↑ 3% from last hour

2. **Average Speed of Answer (ASA)**
   - Target: < 30 seconds
   - Current: 18 seconds (Green zone)
   - Trend: ↓ 5 seconds from last hour

3. **Abandonment Rate**
   - Target: < 5%
   - Current: 2.3% (Green zone)
   - Trend: Stable

4. **Agent Occupancy**
   - Target: 75-85% (optimal)
   - Current: 78% (Green zone)
   - Trend: Stable

**Chart.js Configuration Example:**
```javascript
const gaugeConfig = {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [87, 13],  // 87% service level
            backgroundColor: ['#28a745', '#e0e0e0'],
            borderWidth: 0
        }]
    },
    options: {
        circumference: Math.PI,
        rotation: Math.PI,
        cutout: '70%',
        plugins: {
            tooltip: { enabled: false },
            legend: { display: false }
        }
    }
};
```

---

#### 1.3.4 Call Volume Trend (Last 4 Hours)

**Line Chart - Calls per 15-minute interval:**

```
Calls
80 ┤     
70 ┤    ●──●
60 ┤   ╱    ╲
50 ┤  ●      ●─●
40 ┤ ╱          ╲
30 ┤●            ●
   └─────────────────────> Time
   10AM  11AM  12PM  1PM
```

**Data Points:**
- **10:00 AM:** 32 calls (morning low)
- **11:00 AM:** 58 calls (pre-lunch spike)
- **12:00 PM:** 72 calls (lunch hour peak)
- **1:00 PM:** 67 calls (post-lunch sustained)

**PostgreSQL Query (15-minute aggregation):**
```sql
SELECT 
    DATE_TRUNC('minute', call_start_time) - 
    (EXTRACT(MINUTE FROM call_start_time)::int % 15) * INTERVAL '1 minute' AS interval_start,
    COUNT(*) AS call_count,
    AVG(handle_time_seconds) AS avg_handle_time,
    SUM(CASE WHEN abandoned = true THEN 1 ELSE 0 END) AS abandoned_calls
FROM calls
WHERE call_start_time > NOW() - INTERVAL '4 hours'
GROUP BY interval_start
ORDER BY interval_start;
```

---

#### 1.3.5 IVR Performance Metrics

**Dialogflow CX Analytics:**

| Metric | Value | Status |
|--------|-------|--------|
| Total IVR Sessions (Today) | 1,247 | ✅ |
| Successful Self-Service | 67% | ✅ (Target: >60%) |
| Transfer to Agent | 33% | ✅ (Target: <40%) |
| Avg IVR Duration | 1m 42s | ✅ (Target: <2m) |
| Intent Recognition Rate | 94% | ✅ (Target: >90%) |
| Fallback Triggers | 6% | ✅ (Target: <10%) |

**Top 5 Intents (Today):**
1. Order Status - 412 sessions (33%)
2. Store Locator - 287 sessions (23%)
3. Return/Exchange - 198 sessions (16%)
4. Payment Issues - 156 sessions (13%)
5. Product Availability - 124 sessions (10%)

**GCP BigQuery Query:**
```sql
SELECT 
    intent_name,
    COUNT(*) AS session_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) AS percentage
FROM `kidswear-cc.dialogflow_logs.conversations`
WHERE DATE(timestamp) = CURRENT_DATE()
    AND intent_name IS NOT NULL
GROUP BY intent_name
ORDER BY session_count DESC
LIMIT 5;
```

---

### 1.4 Dashboard Deployment Guide

#### 1.4.1 Infrastructure Setup

**GCP Compute Engine Instance:**
```bash
# Create VM instance
gcloud compute instances create cc-dashboard \
    --zone=asia-south1-a \
    --machine-type=e2-medium \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=30GB \
    --boot-disk-type=pd-balanced \
    --tags=http-server,https-server

# Reserve static IP
gcloud compute addresses create cc-dashboard-ip \
    --region=asia-south1

# Attach static IP
gcloud compute instances add-access-config cc-dashboard \
    --zone=asia-south1-a \
    --address=$(gcloud compute addresses describe cc-dashboard-ip \
        --region=asia-south1 --format='get(address)')
```

---

#### 1.4.2 Install Dependencies

**SSH into VM and run:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL 15
sudo apt install -y postgresql-15 postgresql-contrib-15

# Install TimescaleDB extension
sudo add-apt-repository ppa:timescale/timescaledb-ppa
sudo apt update
sudo apt install -y timescaledb-2-postgresql-15

# Install Redis
sudo apt install -y redis-server

# Install Nginx (reverse proxy)
sudo apt install -y nginx certbot python3-certbot-nginx

# Verify installations
node --version   # Should show v20.x.x
psql --version   # Should show PostgreSQL 15
redis-cli --version
```

---

#### 1.4.3 Database Setup

**Create database and enable TimescaleDB:**
```bash
# Switch to postgres user
sudo -u postgres psql

-- Create database and user
CREATE DATABASE cc_operations;
CREATE USER cc_admin WITH ENCRYPTED PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE cc_operations TO cc_admin;

-- Connect to database and enable TimescaleDB
\c cc_operations
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Create tables
CREATE TABLE queue_stats_realtime (
    timestamp TIMESTAMPTZ NOT NULL,
    queue_name VARCHAR(100) NOT NULL,
    calls_in_queue INTEGER,
    oldest_call_time TIMESTAMPTZ,
    agents_available INTEGER,
    agents_on_call INTEGER,
    agents_idle INTEGER,
    answered_within_30s INTEGER,
    total_calls INTEGER,
    PRIMARY KEY (timestamp, queue_name)
);

-- Convert to hypertable (time-series optimization)
SELECT create_hypertable('queue_stats_realtime', 'timestamp');

-- Create index for fast queries
CREATE INDEX idx_queue_stats_queue ON queue_stats_realtime(queue_name, timestamp DESC);

-- Agent states table
CREATE TABLE agent_states (
    timestamp TIMESTAMPTZ NOT NULL,
    agent_id VARCHAR(50) NOT NULL,
    agent_name VARCHAR(200),
    state VARCHAR(50),
    state_duration INTEGER,
    calls_handled INTEGER,
    avg_handle_time INTEGER,
    PRIMARY KEY (timestamp, agent_id)
);

SELECT create_hypertable('agent_states', 'timestamp');

-- Call records table
CREATE TABLE calls (
    call_id VARCHAR(100) PRIMARY KEY,
    call_start_time TIMESTAMPTZ NOT NULL,
    call_end_time TIMESTAMPTZ,
    queue_name VARCHAR(100),
    agent_id VARCHAR(50),
    handle_time_seconds INTEGER,
    wait_time_seconds INTEGER,
    abandoned BOOLEAN,
    transfer_count INTEGER,
    wrap_up_code VARCHAR(100)
);

CREATE INDEX idx_calls_start_time ON calls(call_start_time DESC);

-- Set retention policy (keep 90 days of real-time data)
SELECT add_retention_policy('queue_stats_realtime', INTERVAL '90 days');
SELECT add_retention_policy('agent_states', INTERVAL '90 days');
```

---

#### 1.4.4 Application Deployment

**Clone dashboard repository:**
```bash
# Create app directory
sudo mkdir -p /opt/cc-dashboard
sudo chown $USER:$USER /opt/cc-dashboard
cd /opt/cc-dashboard

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express pg redis axios chart.js react react-dom cors dotenv

# Create directory structure
mkdir -p {backend,frontend/src,config,logs}
```

**Backend API Server (backend/server.js):**
```javascript
const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pgPool = new Pool({
    host: 'localhost',
    database: 'cc_operations',
    user: 'cc_admin',
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000
});

// Redis client
const redisClient = redis.createClient();
redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.connect();

// Webex CC API configuration
const WEBEX_API_BASE = 'https://api.wxcc-us1.cisco.com/v1';
let webexAccessToken = process.env.WEBEX_ACCESS_TOKEN;

// ============================================
// API ENDPOINTS
// ============================================

// GET /api/queue-stats - Real-time queue statistics
app.get('/api/queue-stats', async (req, res) => {
    try {
        // Check Redis cache first
        const cached = await redisClient.get('queue-stats');
        if (cached) {
            return res.json(JSON.parse(cached));
        }

        // Fetch from Webex CC API
        const response = await axios.get(`${WEBEX_API_BASE}/queues/statistics`, {
            headers: { 'Authorization': `Bearer ${webexAccessToken}` }
        });

        const queueStats = response.data.statistics.map(q => ({
            queueName: q.queueName,
            callsInQueue: q.callsInQueue,
            longestWait: q.longestWaitTime,
            agentsAvailable: q.agentsAvailable,
            agentsOnCall: q.agentsOnCall,
            serviceLevel: q.serviceLevel
        }));

        // Cache for 10 seconds
        await redisClient.setEx('queue-stats', 10, JSON.stringify(queueStats));

        // Store in database for historical analysis
        for (const stat of queueStats) {
            await pgPool.query(`
                INSERT INTO queue_stats_realtime 
                (timestamp, queue_name, calls_in_queue, agents_available, 
                 agents_on_call, answered_within_30s, total_calls)
                VALUES (NOW(), $1, $2, $3, $4, $5, $6)
            `, [
                stat.queueName,
                stat.callsInQueue,
                stat.agentsAvailable,
                stat.agentsOnCall,
                Math.round(stat.serviceLevel * stat.totalCalls / 100),
                stat.totalCalls || 0
            ]);
        }

        res.json(queueStats);
    } catch (error) {
        console.error('Error fetching queue stats:', error);
        res.status(500).json({ error: 'Failed to fetch queue statistics' });
    }
});

// GET /api/agent-states - Real-time agent status
app.get('/api/agent-states', async (req, res) => {
    try {
        const response = await axios.get(`${WEBEX_API_BASE}/agents`, {
            headers: { 'Authorization': `Bearer ${webexAccessToken}` }
        });

        const agents = response.data.agents.map(a => ({
            agentId: a.agentId,
            name: `${a.firstName} ${a.lastName}`,
            state: a.state,
            stateDuration: a.stateDuration,
            callsHandled: a.statistics?.callsHandled || 0,
            avgHandleTime: a.statistics?.avgHandleTime || 0
        }));

        // Store in database
        for (const agent of agents) {
            await pgPool.query(`
                INSERT INTO agent_states 
                (timestamp, agent_id, agent_name, state, state_duration, 
                 calls_handled, avg_handle_time)
                VALUES (NOW(), $1, $2, $3, $4, $5, $6)
            `, [
                agent.agentId,
                agent.name,
                agent.state,
                agent.stateDuration,
                agent.callsHandled,
                agent.avgHandleTime
            ]);
        }

        res.json(agents);
    } catch (error) {
        console.error('Error fetching agent states:', error);
        res.status(500).json({ error: 'Failed to fetch agent states' });
    }
});

// GET /api/call-volume - Call volume trend (last 4 hours)
app.get('/api/call-volume', async (req, res) => {
    try {
        const result = await pgPool.query(`
            SELECT 
                DATE_TRUNC('minute', call_start_time) - 
                (EXTRACT(MINUTE FROM call_start_time)::int % 15) * INTERVAL '1 minute' AS interval_start,
                COUNT(*) AS call_count,
                AVG(handle_time_seconds) AS avg_handle_time,
                SUM(CASE WHEN abandoned = true THEN 1 ELSE 0 END) AS abandoned_calls
            FROM calls
            WHERE call_start_time > NOW() - INTERVAL '4 hours'
            GROUP BY interval_start
            ORDER BY interval_start
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching call volume:', error);
        res.status(500).json({ error: 'Failed to fetch call volume data' });
    }
});

// GET /api/ivr-metrics - Dialogflow CX performance
app.get('/api/ivr-metrics', async (req, res) => {
    try {
        // Query GCP BigQuery via REST API (requires service account)
        const bqQuery = `
            SELECT 
                COUNT(*) AS total_sessions,
                COUNTIF(transferred_to_agent = false) AS self_service,
                COUNTIF(transferred_to_agent = true) AS transfers,
                AVG(duration_seconds) AS avg_duration,
                COUNTIF(intent_confidence > 0.9) * 100.0 / COUNT(*) AS intent_recognition_rate
            FROM \`kidswear-cc.dialogflow_logs.conversations\`
            WHERE DATE(timestamp) = CURRENT_DATE()
        `;

        // This requires BigQuery API setup - simplified version here
        const ivrMetrics = {
            totalSessions: 1247,
            selfServiceRate: 67,
            transferRate: 33,
            avgDuration: 102,  // seconds
            intentRecognitionRate: 94
        };

        res.json(ivrMetrics);
    } catch (error) {
        console.error('Error fetching IVR metrics:', error);
        res.status(500).json({ error: 'Failed to fetch IVR metrics' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Dashboard API server running on port ${PORT}`);
});
```

---

#### 1.4.5 Frontend Dashboard (React)

**frontend/src/Dashboard.jsx:**
```javascript
import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';

function Dashboard() {
    const [queueStats, setQueueStats] = useState([]);
    const [agents, setAgents] = useState([]);
    const [callVolume, setCallVolume] = useState([]);
    const [ivrMetrics, setIvrMetrics] = useState({});

    useEffect(() => {
        // Fetch data every 30 seconds
        fetchAllData();
        const interval = setInterval(fetchAllData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchAllData = async () => {
        try {
            const [queues, agentData, volume, ivr] = await Promise.all([
                fetch('http://localhost:3000/api/queue-stats').then(r => r.json()),
                fetch('http://localhost:3000/api/agent-states').then(r => r.json()),
                fetch('http://localhost:3000/api/call-volume').then(r => r.json()),
                fetch('http://localhost:3000/api/ivr-metrics').then(r => r.json())
            ]);

            setQueueStats(queues);
            setAgents(agentData);
            setCallVolume(volume);
            setIvrMetrics(ivr);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Render components
    return (
        <div className="dashboard">
            <h1>KidsWear Contact Center - Operations Dashboard</h1>
            
            {/* Queue Status */}
            <div className="panel queue-panel">
                <h2>Queue Status</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Queue</th>
                            <th>Calls Waiting</th>
                            <th>Longest Wait</th>
                            <th>Agents Available</th>
                            <th>Service Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queueStats.map(q => (
                            <tr key={q.queueName}>
                                <td>{q.queueName}</td>
                                <td className={q.callsInQueue > 10 ? 'red' : q.callsInQueue > 5 ? 'yellow' : ''}>
                                    {q.callsInQueue}
                                </td>
                                <td>{q.longestWait}s</td>
                                <td>{q.agentsAvailable}</td>
                                <td>{q.serviceLevel}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Agent Grid */}
            <div className="panel agent-panel">
                <h2>Agent Status</h2>
                <div className="agent-grid">
                    {agents.map(agent => (
                        <div key={agent.agentId} className={`agent-card ${agent.state.toLowerCase()}`}>
                            <div className="agent-name">{agent.name}</div>
                            <div className="agent-state">{agent.state}</div>
                            <div className="agent-stats">
                                Calls: {agent.callsHandled} | AHT: {Math.floor(agent.avgHandleTime / 60)}m
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call Volume Chart */}
            <div className="panel chart-panel">
                <h2>Call Volume (Last 4 Hours)</h2>
                <Line data={{
                    labels: callVolume.map(v => new Date(v.interval_start).toLocaleTimeString()),
                    datasets: [{
                        label: 'Calls',
                        data: callVolume.map(v => v.call_count),
                        borderColor: '#007bff',
                        fill: false
                    }]
                }} />
            </div>
        </div>
    );
}

export default Dashboard;
```

---

### 1.5 Nginx Configuration

**/etc/nginx/sites-available/cc-dashboard:**
```nginx
server {
    listen 80;
    server_name dashboard.kidswear.com;

# Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dashboard.kidswear.com;

# SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/dashboard.kidswear.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dashboard.kidswear.com/privkey.pem;

# Frontend static files
    root /opt/cc-dashboard/frontend/build;
    index index.html;

# API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

# React routing
    location / {
        try_files $uri /index.html;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/cc-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 2. Alert & Notification Framework

### 2.1 Overview

The alert framework proactively notifies operations team of critical issues before they impact customers. Alerts are sent via:

- **Slack:** Real-time notifications for on-duty team
- **Email:** Escalation for unacknowledged alerts
- **SMS:** Critical alerts (after-hours)

**Alert Categories:**

| Severity | Description | Response Time | Notification |
|----------|-------------|---------------|--------------|
| 🔴 Critical | Service down, SLA breach imminent | < 5 min | Slack + SMS |
| 🟡 Warning | Degraded performance, approaching threshold | < 15 min | Slack |
| 🔵 Info | FYI, no action required | N/A | Email digest |

---

### 2.2 Alert Rules

#### 2.2.1 Queue Performance Alerts

**Rule 1: High Queue Wait Time**
```yaml
trigger:
  metric: queue_longest_wait_time
  threshold: 120  # seconds
  duration: 5     # minutes
  severity: WARNING

action:
  - type: slack
    channel: '#cc-operations'
    message: '⚠️ Queue {{ queue_name }} has calls waiting > 2 minutes. Current: {{ wait_time }}s'
  
  - type: email
    recipients: ['ops-manager@kidswear.com']
    subject: 'Queue Wait Time Alert'
```

**Rule 2: Service Level Breach**
```yaml
trigger:
  metric: queue_service_level
  threshold: 70   # percentage
  condition: below
  duration: 10    # minutes
  severity: CRITICAL

action:
  - type: slack
    channel: '#cc-critical'
    message: '🔴 CRITICAL: Queue {{ queue_name }} SLA at {{ service_level }}% (Target: 80%)'
  
  - type: sms
    recipients: ['+91-98765-43210']  # Ops Manager mobile
    message: 'CC ALERT: SLA breach in {{ queue_name }}'
```

**Rule 3: Agent Shortage**
```yaml
trigger:
  metric: queue_agents_available
  threshold: 1
  condition: below
  severity: CRITICAL

action:
  - type: slack
    channel: '#cc-critical'
    message: '🔴 Queue {{ queue_name }} has ZERO available agents. {{ calls_waiting }} calls waiting.'
```

---

#### 2.2.2 IVR Performance Alerts

**Rule 4: High Fallback Rate**
```yaml
trigger:
  metric: ivr_fallback_rate
  threshold: 15   # percentage
  duration: 30    # minutes
  severity: WARNING

action:
  - type: slack
    channel: '#cc-operations'
    message: '⚠️ IVR fallback rate at {{ fallback_rate }}%. Intent recognition may be degraded.'
```

**Rule 5: Dialogflow Unavailable**
```yaml
trigger:
  metric: ivr_api_error_rate
  threshold: 10   # percentage
  severity: CRITICAL

action:
  - type: slack
    channel: '#cc-critical'
    message: '🔴 CRITICAL: Dialogflow CX API errors at {{ error_rate }}%. IVR may be offline.'
  
  - type: pagerduty
    incident_key: 'dialogflow-outage'
    description: 'Dialogflow CX API errors - IVR degraded'
```

---

#### 2.2.3 System Health Alerts

**Rule 6: Database Lag**
```yaml
trigger:
  metric: database_replication_lag
  threshold: 60   # seconds
  severity: WARNING

action:
  - type: slack
    channel: '#cc-operations'
    message: '⚠️ Database replication lag: {{ lag_seconds }}s. Reports may be delayed.'
```

**Rule 7: High API Latency**
```yaml
trigger:
  metric: webex_api_response_time
  threshold: 2000  # milliseconds
  duration: 5      # minutes
  severity: WARNING

action:
  - type: slack
    channel: '#cc-operations'
    message: '⚠️ Webex CC API slow: {{ response_time }}ms. Dashboard updates may be delayed.'
```

---

### 2.3 Alert Engine Implementation

**Python Alert Engine (alert_engine.py):**
```python
#!/usr/bin/env python3
import psycopg2
import requests
import json
import time
from datetime import datetime, timedelta

# Configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'cc_operations',
    'user': 'cc_admin',
    'password': 'YourSecurePassword123!'
}

SLACK_WEBHOOK = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
EMAIL_API = 'https://api.sendgrid.com/v3/mail/send'
SENDGRID_KEY = 'YOUR_SENDGRID_API_KEY'

# Alert state tracking (prevent duplicate alerts)
alert_state = {}

def check_queue_wait_time():
    """Alert if any queue has calls waiting > 2 minutes"""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT queue_name, 
               EXTRACT(EPOCH FROM (NOW() - oldest_call_time)) AS wait_seconds
        FROM queue_stats_realtime
        WHERE timestamp > NOW() - INTERVAL '1 minute'
          AND oldest_call_time IS NOT NULL
          AND EXTRACT(EPOCH FROM (NOW() - oldest_call_time)) > 120
        ORDER BY wait_seconds DESC
    """)
    
    for queue_name, wait_seconds in cur.fetchall():
        alert_key = f'queue_wait_{queue_name}'
        
# Check if already alerted in last 10 minutes
        if alert_key in alert_state:
            if datetime.now() - alert_state[alert_key] < timedelta(minutes=10):
                continue
        
# Send alert
        send_slack_alert(
            severity='WARNING',
            title=f'High Queue Wait Time - {queue_name}',
            message=f'Calls waiting for {int(wait_seconds)} seconds in {queue_name} queue.'
        )
        
        alert_state[alert_key] = datetime.now()
    
    cur.close()
    conn.close()

def check_service_level():
    """Alert if service level drops below 70%"""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT 
            queue_name,
            (answered_within_30s::FLOAT / NULLIF(total_calls, 0)) * 100 AS service_level
        FROM queue_stats_realtime
        WHERE timestamp > NOW() - INTERVAL '10 minutes'
        GROUP BY queue_name, answered_within_30s, total_calls
        HAVING (answered_within_30s::FLOAT / NULLIF(total_calls, 0)) * 100 < 70
    """)
    
    for queue_name, service_level in cur.fetchall():
        alert_key = f'sla_breach_{queue_name}'
        
        if alert_key in alert_state:
            if datetime.now() - alert_state[alert_key] < timedelta(minutes=15):
                continue
        
        send_slack_alert(
            severity='CRITICAL',
            title=f'SLA Breach - {queue_name}',
            message=f'Service level at {service_level:.1f}% (Target: 80%). Immediate action required!'
        )
        
# Also send email for critical alerts
        send_email_alert(
            to='ops-manager@kidswear.com',
            subject=f'CRITICAL: SLA Breach in {queue_name}',
            body=f'Service level has dropped to {service_level:.1f}% in {queue_name} queue.'
        )
        
        alert_state[alert_key] = datetime.now()
    
    cur.close()
    conn.close()

def check_agent_availability():
    """Alert if queue has < 2 available agents"""
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT queue_name, agents_available, calls_in_queue
        FROM queue_stats_realtime
        WHERE timestamp > NOW() - INTERVAL '1 minute'
          AND agents_available < 2
          AND calls_in_queue > 0
    """)
    
    for queue_name, agents_avail, calls_waiting in cur.fetchall():
        alert_key = f'agent_shortage_{queue_name}'
        
        if alert_key in alert_state:
            if datetime.now() - alert_state[alert_key] < timedelta(minutes=5):
                continue
        
        severity = 'CRITICAL' if agents_avail == 0 else 'WARNING'
        
        send_slack_alert(
            severity=severity,
            title=f'Agent Shortage - {queue_name}',
            message=f'Only {agents_avail} agents available with {calls_waiting} calls waiting in {queue_name}.'
        )
        
        alert_state[alert_key] = datetime.now()
    
    cur.close()
    conn.close()

def send_slack_alert(severity, title, message):
    """Send alert to Slack"""
    icon = {
        'CRITICAL': '🔴',
        'WARNING': '⚠️',
        'INFO': '🔵'
    }.get(severity, 'ℹ️')
    
    color = {
        'CRITICAL': '#dc3545',
        'WARNING': '#ffc107',
        'INFO': '#17a2b8'
    }.get(severity, '#6c757d')
    
    payload = {
        'attachments': [{
            'color': color,
            'title': f'{icon} {title}',
            'text': message,
            'footer': 'KidsWear Contact Center Monitoring',
            'ts': int(time.time())
        }]
    }
    
    try:
        response = requests.post(SLACK_WEBHOOK, json=payload, timeout=10)
        response.raise_for_status()
        print(f'[{datetime.now()}] Slack alert sent: {title}')
    except Exception as e:
        print(f'[{datetime.now()}] ERROR sending Slack alert: {e}')

def send_email_alert(to, subject, body):
    """Send alert via email (SendGrid)"""
    payload = {
        'personalizations': [{
            'to': [{'email': to}],
            'subject': subject
        }],
        'from': {'email': 'alerts@kidswear.com', 'name': 'CC Monitoring'},
        'content': [{
            'type': 'text/plain',
            'value': body
        }]
    }
    
    headers = {
        'Authorization': f'Bearer {SENDGRID_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(EMAIL_API, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        print(f'[{datetime.now()}] Email alert sent to {to}')
    except Exception as e:
        print(f'[{datetime.now()}] ERROR sending email: {e}')

def main():
    """Main monitoring loop - run every 60 seconds"""
    print(f'[{datetime.now()}] Alert Engine started')
    
    while True:
        try:
            check_queue_wait_time()
            check_service_level()
            check_agent_availability()
            
# Clean up old alert states (older than 1 hour)
            cutoff = datetime.now() - timedelta(hours=1)
            alert_state.clear()
            for key in list(alert_state.keys()):
                if alert_state[key] < cutoff:
                    del alert_state[key]
            
            time.sleep(60)  # Check every minute
            
        except KeyboardInterrupt:
            print(f'\n[{datetime.now()}] Alert Engine stopped')
            break
        except Exception as e:
            print(f'[{datetime.now()}] ERROR in monitoring loop: {e}')
            time.sleep(60)

if __name__ == '__main__':
    main()
```

---

### 2.4 Systemd Service Configuration

**Create service file: /etc/systemd/system/cc-alerts.service**
```ini
[Unit]
Description=Contact Center Alert Engine
After=network.target postgresql.service

[Service]
Type=simple
User=cc-admin
WorkingDirectory=/opt/cc-dashboard/alerts
ExecStart=/usr/bin/python3 /opt/cc-dashboard/alerts/alert_engine.py
Restart=always
RestartSec=10

# Logging
StandardOutput=append:/var/log/cc-alerts.log
StandardError=append:/var/log/cc-alerts-error.log

[Install]
WantedBy=multi-user.target
```

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable cc-alerts
sudo systemctl start cc-alerts
sudo systemctl status cc-alerts
```

---

## 3. Agent Performance Analytics

### 3.1 Overview

Agent performance analytics track individual and team performance to:

- ✅ Identify top performers for recognition
- ✅ Identify struggling agents for coaching
- ✅ Track KPIs: Calls handled, AHT, CSAT, attendance
- ✅ Support quarterly performance reviews

**Key Metrics:**

| Metric | Target | Measurement Period |
|--------|--------|-------------------|
| Calls Handled | > 30/day | Daily |
| Average Handle Time | 4-6 minutes | Weekly |
| CSAT Score | > 4.0/5.0 | Monthly |
| Attendance | > 95% | Monthly |
| Idle Time | < 15% | Weekly |

---

### 3.2 Performance Dashboard

**SQL View for Agent Performance:**
```sql
CREATE OR REPLACE VIEW agent_performance_daily AS
SELECT 
    DATE(timestamp) AS performance_date,
    agent_id,
    MAX(agent_name) AS agent_name,
    
    -- Calls handled
    MAX(calls_handled) AS total_calls,
    
    -- Average handle time
    ROUND(AVG(avg_handle_time)) AS avg_handle_time_seconds,
    
    -- Time in different states (aggregated from hourly snapshots)
    SUM(CASE WHEN state = 'Available' THEN 1 ELSE 0 END) * 5 / 60.0 AS available_hours,
    SUM(CASE WHEN state = 'On Call' THEN 1 ELSE 0 END) * 5 / 60.0 AS on_call_hours,
    SUM(CASE WHEN state = 'Idle' THEN 1 ELSE 0 END) * 5 / 60.0 AS idle_hours,
    
    -- Occupancy rate
    ROUND(
        (SUM(CASE WHEN state IN ('On Call', 'Wrap-Up') THEN 1 ELSE 0 END)::FLOAT / 
         NULLIF(COUNT(*), 0)) * 100, 
        2
    ) AS occupancy_rate
    
FROM agent_states
WHERE timestamp >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE(timestamp), agent_id
ORDER BY performance_date DESC, agent_id;
```

**Query for Top Performers (This Week):**
```sql
SELECT 
    agent_name,
    SUM(total_calls) AS calls_this_week,
    ROUND(AVG(avg_handle_time_seconds)) AS avg_aht,
    ROUND(AVG(occupancy_rate), 1) AS avg_occupancy
FROM agent_performance_daily
WHERE performance_date >= DATE_TRUNC('week', CURRENT_DATE)
GROUP BY agent_name
ORDER BY calls_this_week DESC
LIMIT 10;
```

---

### 3.3 Performance Report Generation

**Weekly Agent Report (Python Script):**
```python
#!/usr/bin/env python3
import psycopg2
import pandas as pd
from datetime import datetime, timedelta

DB_CONFIG = {
    'host': 'localhost',
    'database': 'cc_operations',
    'user': 'cc_admin',
    'password': 'YourSecurePassword123!'
}

def generate_weekly_report():
    """Generate agent performance report for the past week"""
    conn = psycopg2.connect(**DB_CONFIG)
    
# Get date range
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=7)
    
# Query performance data
    query = """
        SELECT 
            agent_name,
            SUM(total_calls) AS calls,
            ROUND(AVG(avg_handle_time_seconds)) AS avg_aht,
            ROUND(AVG(occupancy_rate), 1) AS occupancy,
            ROUND(AVG(idle_hours), 1) AS avg_idle_hours
        FROM agent_performance_daily
        WHERE performance_date BETWEEN %s AND %s
        GROUP BY agent_name
        ORDER BY calls DESC
    """
    
    df = pd.read_sql(query, conn, params=(start_date, end_date))
    
# Add performance rating
    df['rating'] = df.apply(calculate_rating, axis=1)
    
# Generate HTML report
    html_report = f"""
    <html>
    <head>
        <style>
            table {{ border-collapse: collapse; width: 100%; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #007bff; color: white; }}
            .excellent {{ background-color: #d4edda; }}
            .good {{ background-color: #fff3cd; }}
            .needs-improvement {{ background-color: #f8d7da; }}
        </style>
    </head>
    <body>
        <h1>Weekly Agent Performance Report</h1>
        <p><strong>Period:</strong> {start_date} to {end_date}</p>
        
        <h2>Top Performers</h2>
        {df.head(10).to_html(index=False, classes='performance-table')}
        
        <h2>Needs Coaching</h2>
        {df.tail(5).to_html(index=False, classes='performance-table')}
    </body>
    </html>
    """
    
# Save report
    report_file = f'/opt/cc-dashboard/reports/agent_performance_{start_date}.html'
    with open(report_file, 'w') as f:
        f.write(html_report)
    
    print(f'Report generated: {report_file}')
    conn.close()

def calculate_rating(row):
    """Calculate performance rating based on metrics"""
    score = 0
    
# Calls handled (30+ is excellent)
    if row['calls'] >= 150:  # 30 calls/day * 5 days
        score += 3
    elif row['calls'] >= 100:
        score += 2
    else:
        score += 1
    
# Average Handle Time (4-6 minutes is optimal)
    if 240 <= row['avg_aht'] <= 360:
        score += 3
    elif row['avg_aht'] < 240 or row['avg_aht'] > 420:
        score += 1
    else:
        score += 2
    
# Occupancy (75-85% is optimal)
    if 75 <= row['occupancy'] <= 85:
        score += 3
    elif 65 <= row['occupancy'] < 75 or 85 < row['occupancy'] <= 95:
        score += 2
    else:
        score += 1
    
# Overall rating
    if score >= 8:
        return 'Excellent'
    elif score >= 6:
        return 'Good'
    else:
        return 'Needs Improvement'

if __name__ == '__main__':
    generate_weekly_report()
```

**Cron Job (Run every Monday 9 AM):**
```bash
0 9 * * 1 /usr/bin/python3 /opt/cc-dashboard/scripts/weekly_report.py
```

---

## 4. Customer Satisfaction (CSAT) Tracking

### 4.1 Overview

CSAT tracking measures customer satisfaction after every call through:

- **Post-Call IVR Survey:** "On a scale of 1-5, how satisfied were you with the service?"
- **Email Survey:** Sent 1 hour after call (if email provided)
- **SMS Survey:** Sent 30 minutes after call (if SMS consent)

**CSAT Targets:**

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Overall CSAT | > 4.0/5.0 | < 3.5 |
| Survey Response Rate | > 15% | < 10% |
| Detractors (1-2 rating) | < 10% | > 15% |

---

### 4.2 Post-Call IVR Survey

**Webex Flow Designer Configuration:**

**Step 1: Transfer Complete Event**
```
Node Type: Event
Event: Transfer Complete (Agent Hangup)
Next Node: CSAT Survey Prompt
```

**Step 2: CSAT Survey Prompt**
```
Node Type: Play Message
Message: "Thank you for contacting KidsWear. Please rate your experience from 1 to 5, 
          where 1 is very dissatisfied and 5 is very satisfied. Press 1, 2, 3, 4, or 5."
Timeout: 10 seconds
Next Node: Collect Digit
```

**Step 3: Collect CSAT Rating**
```
Node Type: Collect Digit
Variable Name: csat_rating
Min Length: 1
Max Length: 1
Valid Digits: 1,2,3,4,5
Timeout: 10 seconds
Retry Prompts: 2
On Success: Save to Database
On Failure/Timeout: End Call
```

**Step 4: Save CSAT to Database**
```
Node Type: HTTP Request
Method: POST
URL: https://dashboard.kidswear.com/api/csat/record
Headers:
  Content-Type: application/json
  Authorization: Bearer <API_TOKEN>
Body:
{
  "call_id": "{{ Call.CallID }}",
  "agent_id": "{{ Call.AgentID }}",
  "queue_name": "{{ Call.QueueName }}",
  "csat_rating": "{{ csat_rating }}",
  "timestamp": "{{ Call.EndTime }}"
}
Next Node: Thank You Message
```

**Step 5: Thank You Message**
```
Node Type: Play Message
Message: "Thank you for your feedback. Goodbye!"
Next Node: End Call
```

---

### 4.3 CSAT Database Schema

**Create CSAT table:**
```sql
CREATE TABLE csat_responses (
    id SERIAL PRIMARY KEY,
    call_id VARCHAR(100) NOT NULL,
    agent_id VARCHAR(50),
    queue_name VARCHAR(100),
    csat_rating INTEGER CHECK (csat_rating BETWEEN 1 AND 5),
    survey_method VARCHAR(20),  -- 'IVR', 'Email', 'SMS'
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(200)
);

CREATE INDEX idx_csat_timestamp ON csat_responses(timestamp DESC);
CREATE INDEX idx_csat_agent ON csat_responses(agent_id, timestamp DESC);
CREATE INDEX idx_csat_queue ON csat_responses(queue_name, timestamp DESC);
```

---

### 4.4 CSAT API Endpoint

**Flask API for recording CSAT:**
```python
from flask import Flask, request, jsonify
import psycopg2
from datetime import datetime

app = Flask(__name__)

DB_CONFIG = {
    'host': 'localhost',
    'database': 'cc_operations',
    'user': 'cc_admin',
    'password': 'YourSecurePassword123!'
}

@app.route('/api/csat/record', methods=['POST'])
def record_csat():
    """Record CSAT response from IVR survey"""
    data = request.json
    
# Validate required fields
    required = ['call_id', 'csat_rating']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400
    
    rating = int(data['csat_rating'])
    if rating < 1 or rating > 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    
# Insert into database
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO csat_responses 
            (call_id, agent_id, queue_name, csat_rating, survey_method, customer_phone)
            VALUES (%s, %s, %s, %s, 'IVR', %s)
        """, (
            data['call_id'],
            data.get('agent_id'),
            data.get('queue_name'),
            rating,
            data.get('customer_phone')
        ))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'success': True, 'message': 'CSAT recorded'}), 200
        
    except Exception as e:
        print(f'ERROR recording CSAT: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/csat/stats', methods=['GET'])
def get_csat_stats():
    """Get CSAT statistics"""
    period = request.args.get('period', 'today')  # today, week, month
    
    if period == 'today':
        where_clause = "timestamp >= CURRENT_DATE"
    elif period == 'week':
        where_clause = "timestamp >= CURRENT_DATE - INTERVAL '7 days'"
    elif period == 'month':
        where_clause = "timestamp >= CURRENT_DATE - INTERVAL '30 days'"
    else:
        where_clause = "1=1"
    
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    
    cur.execute(f"""
        SELECT 
            COUNT(*) AS total_responses,
            ROUND(AVG(csat_rating), 2) AS avg_csat,
            SUM(CASE WHEN csat_rating >= 4 THEN 1 ELSE 0 END)::FLOAT / COUNT(*) * 100 AS promoter_pct,
            SUM(CASE WHEN csat_rating <= 2 THEN 1 ELSE 0 END)::FLOAT / COUNT(*) * 100 AS detractor_pct
        FROM csat_responses
        WHERE {where_clause}
    """)
    
    row = cur.fetchone()
    stats = {
        'total_responses': row[0],
        'avg_csat': float(row[1]) if row[1] else 0,
        'promoter_percentage': float(row[2]) if row[2] else 0,
        'detractor_percentage': float(row[3]) if row[3] else 0
    }
    
    cur.close()
    conn.close()
    
    return jsonify(stats), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

**Run as systemd service:**
```ini
# /etc/systemd/system/csat-api.service
[Unit]
Description=CSAT Recording API
After=network.target

[Service]
Type=simple
User=cc-admin
WorkingDirectory=/opt/cc-dashboard/api
ExecStart=/usr/bin/python3 /opt/cc-dashboard/api/csat_api.py
Restart=always

[Install]
WantedBy=multi-user.target
```

---

### 4.5 CSAT Reporting

**Monthly CSAT Report Query:**
```sql
SELECT 
    DATE_TRUNC('day', timestamp) AS response_date,
    COUNT(*) AS responses,
    ROUND(AVG(csat_rating), 2) AS avg_csat,
    SUM(CASE WHEN csat_rating = 5 THEN 1 ELSE 0 END) AS rating_5,
    SUM(CASE WHEN csat_rating = 4 THEN 1 ELSE 0 END) AS rating_4,
    SUM(CASE WHEN csat_rating = 3 THEN 1 ELSE 0 END) AS rating_3,
    SUM(CASE WHEN csat_rating = 2 THEN 1 ELSE 0 END) AS rating_2,
    SUM(CASE WHEN csat_rating = 1 THEN 1 ELSE 0 END) AS rating_1
FROM csat_responses
WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', timestamp)
ORDER BY response_date DESC;
```

**Agent-Level CSAT:**
```sql
SELECT 
    agent_id,
    COUNT(*) AS total_surveys,
    ROUND(AVG(csat_rating), 2) AS avg_csat,
    SUM(CASE WHEN csat_rating <= 2 THEN 1 ELSE 0 END) AS detractors,
    SUM(CASE WHEN csat_rating >= 4 THEN 1 ELSE 0 END) AS promoters
FROM csat_responses
WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
  AND agent_id IS NOT NULL
GROUP BY agent_id
ORDER BY avg_csat DESC;
```
