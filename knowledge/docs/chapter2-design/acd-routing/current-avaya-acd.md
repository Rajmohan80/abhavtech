# Current Avaya ACD Configuration

## Overview

This document provides a comprehensive inventory and analysis of the current Avaya Contact Center ACD routing configuration, including vectors, skills, hunt groups, and routing logic.

---

## Current Environment

### Platform Details

| Component | Version | Role |
|-----------|---------|------|
| Avaya Communication Manager | 8.1.2 | Call processing and routing |
| Call Center Elite | 7.2 | ACD functionality |
| Avaya Application Enablement Services | 8.1 | CTI integration |
| Call Management System (CMS) | R19 | Reporting and analytics |

### Infrastructure

```
┌─────────────────────────────────────────────────┐
│         AVAYA CONTACT CENTER TOPOLOGY           │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────┐      ┌──────────────────┐  │
│  │ Communication │◄────►│  Call Center     │  │
│  │   Manager     │      │     Elite        │  │
│  │  (CM Server)  │      │   (ACD Engine)   │  │
│  └───────┬───────┘      └──────────────────┘  │
│          │                                     │
│          ▼                                     │
│  ┌───────────────┐      ┌──────────────────┐  │
│  │   Media       │      │       CMS        │  │
│  │   Gateway     │      │   (Reporting)    │  │
│  └───────────────┘      └──────────────────┘  │
│          │                                     │
│          ▼                                     │
│  ┌───────────────┐      ┌──────────────────┐  │
│  │   Agent       │◄────►│      AES         │  │
│  │   Stations    │      │   (CTI Server)   │  │
│  └───────────────┘      └──────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## Vector Directory Numbers (VDNs)

### VDN Inventory

| VDN | Extension | Description | Associated Vector | DNIS |
|-----|-----------|-------------|-------------------|------|
| 1000 | 5000 | Sales Main | 10 | 1-800-XX5-0100 |
| 1001 | 5001 | Sales Spanish | 11 | 1-800-XX5-0150 |
| 1002 | 5002 | Tech Support | 20 | 1-800-XX5-0200 |
| 1003 | 5003 | Billing | 30 | 1-800-XX5-0300 |
| 1004 | 5004 | VIP Support | 40 | 1-800-XX5-0500 |
| 1005 | 5005 | General Inquiries | 50 | 1-800-XX5-0900 |
| 1006 | 5006 | After Hours | 60 | (All numbers) |

### VDN Configuration Example

```
VDN: 1000 (Sales Main)
├─ Extension: 5000
├─ Name: "Sales_Main_VDN"
├─ Vector: 10
├─ Override: None
├─ Measured: Local and Trunk
├─ DNIS: 18005550100
└─ Meet-me Conferencing: n
```

---

## Call Routing Vectors

### Vector 10: Sales Main

```
VECTOR 10 (Sales_Main)
Name: Sales Main Routing

01  wait-time 2 secs hearing ringback
02  collect digits after announcement 2000 for none
03  goto step 7 if digits = 1
04  goto step 8 if digits = 2  
05  goto step 9 if digits = 0
06  announcement 2001
07  queue-to skill 10 pri m
08  queue-to skill 11 pri m
09  route-to number 5100 with cov y if unconditionally
10  stop

Announcements:
├─ 2000: "For New Sales, press 1. For Account Management, press 2. 
│         For an operator, press 0."
├─ 2001: "Please hold while we connect you to the next available agent."
└─ 2002: "All of our agents are currently assisting other customers..."
```

### Vector 20: Technical Support

```
VECTOR 20 (Tech_Support)
Name: Technical Support Routing

01  wait-time 2 secs hearing ringback
02  check skill 20 if calls-queued > 10
03  goto step 10 if check succeeded
04  announcement 2100
05  collect 4 digits after announcement 2101 for 5 seconds
06  goto step 20 if digits = expected-value
07  queue-to skill 20 pri m
08  wait-time 180 secs hearing music
09  goto step 7 if unconditionally
10  announcement 2102
11  queue-to skill 21 pri m
12  stop

Announcements:
├─ 2100: "Welcome to Technical Support"
├─ 2101: "Please enter your 4-digit PIN for faster service"
└─ 2102: "We're experiencing higher than normal call volume. 
          Transferring to our general support team."

Logic:
├─ Check queue depth (step 02-03)
├─ If > 10 calls waiting → Overflow to skill 21
├─ Collect PIN for VIP identification (step 05-06)
└─ Normal routing to skill 20 (step 07)
```

### Vector 30: Billing

```
VECTOR 30 (Billing)
Name: Billing Department

01  wait-time 2 secs hearing ringback
02  check skill 30 if available-agents > 0
03  goto step 8 if check succeeded
04  announcement 2200
05  collect 1 digits after announcement 2201 for 5 seconds
06  goto step 10 if digits = 1
07  goto step 15 if digits = 2
08  queue-to skill 30 pri h
09  wait-time 300 secs hearing music
10  announcement 2202
11  queue-to skill 31 pri m
12  stop
15  disconnect after announcement 2203

Announcements:
├─ 2200: "Thank you for calling Billing"
├─ 2201: "Press 1 to continue holding, or press 2 to receive a callback"
├─ 2202: "Transferring to our payment specialists"
└─ 2203: "We'll call you back at the number you're calling from within the hour"

Features:
├─ Agent availability check (step 02)
├─ Callback option during high wait times (step 05-07)
├─ Overflow routing to skill 31 (step 11)
└─ Maximum wait time: 5 minutes (step 09)
```

### Vector 40: VIP Support

```
VECTOR 40 (VIP_Support)
Name: VIP Customer Support

01  wait-time 1 secs hearing ringback
02  queue-to skill 40 pri t
03  wait-time 60 secs hearing music
04  announcement 2300
05  queue-to skill 41 pri t
06  wait-time 120 secs hearing music
07  route-to number 5200 with cov y if unconditionally
08  stop

Announcements:
├─ 2300: "As a valued customer, we're connecting you to our premium support team"

VIP Features:
├─ Priority: Top (step 02)
├─ Shorter wait threshold: 60 seconds before escalation
├─ Dedicated VIP team (skill 40)
├─ Escalation to senior team (skill 41)
└─ Final escalation to supervisor (5200)
```

---

## Skills Configuration

### Skill Groups Inventory

| Skill # | Name | Description | Agents | Type |
|---------|------|-------------|--------|------|
| 10 | Sales_New | New business sales | 25 | EAS |
| 11 | Sales_Account | Account management | 20 | EAS |
| 12 | Sales_Spanish | Spanish-speaking sales | 8 | EAS |
| 20 | Support_Tech_T1 | Technical support tier 1 | 40 | EAS |
| 21 | Support_Tech_T2 | Technical support tier 2 | 15 | EAS |
| 22 | Support_Spanish | Spanish technical support | 12 | EAS |
| 30 | Billing_General | General billing inquiries | 18 | EAS |
| 31 | Billing_Collections | Collections team | 8 | EAS |
| 40 | VIP_Support | VIP customer support | 10 | EAS |
| 41 | VIP_Senior | Senior VIP support | 5 | EAS |

### Skill Configuration Example

```
SKILL 10 (Sales_New)
├─ Name: Sales_New_Business
├─ Service Objective: 80% in 20 seconds
├─ Service Level Threshold: 20
├─ Announcements:
│   ├─ Queue: 2001 (Please hold...)
│   ├─ Delay: 2002 (All agents busy...)
│   └─ Wait: every 60 seconds
├─ Expected Wait Time (EWT): Announced
├─ Multiple Call Handling: 1 call only
└─ Direct Agent Selection: Disabled
```

---

## Agent Configuration

### Agent Profile Structure

```
Agent: 12345
├─ Login ID: jdoe
├─ Name: John Doe
├─ Skills:
│   ├─ Skill 10 (Sales_New): Level 8
│   ├─ Skill 11 (Sales_Account): Level 6
│   └─ Skill 12 (Sales_Spanish): Level 10
├─ Auto-Answer: Enabled
├─ Multiple Call Handling: 1
├─ After Call Work (ACW): Manual
├─ Security Code: ****
└─ Supervisor: Yes/No
```

### Skills Distribution Matrix

| Agent Group | Sales Skills | Support Skills | Billing Skills | Language Skills |
|-------------|--------------|----------------|----------------|-----------------|
| Sales Team A (25) | 10(Avg:7), 11(Avg:6) | - | - | 5 Spanish |
| Sales Team B (20) | 11(Avg:8) | - | - | 3 Spanish |
| Support Team A (40) | - | 20(Avg:7) | - | 8 Spanish |
| Support Team B (15) | - | 21(Avg:9) | - | 4 Spanish |
| Billing Team (18) | - | - | 30(Avg:7), 31(Avg:5) | 6 Spanish |
| VIP Team (10) | All skills | All skills | All skills | 4 Spanish |

---

## Hunt Groups

### Hunt Group Configuration

| Hunt Group | Extension | Members | Calling Group | Queue | Coverage Path |
|------------|-----------|---------|---------------|-------|---------------|
| 100 | 5100 | 12 agents | Operator | Yes | 2 |
| 110 | 5110 | 8 supervisors | Supervisor | Yes | 3 |
| 120 | 5120 | 5 managers | Management | No | 1 |

### Hunt Group 100 (Operators)

```
HUNT-GROUP 100
├─ Extension: 5100
├─ Type: UCD-MIA (Uniform Call Distribution - Most Idle Agent)
├─ Queue: Yes
├─ Calling Group: 1 (Operators)
├─ Coverage Path: 2 (Voicemail)
├─ Members:
│   ├─ Agent 10001
│   ├─ Agent 10002
│   ├─ ... (12 total)
│   └─ Agent 10012
├─ Expected Wait Time: Announced
└─ Music on Hold: Yes
```

---

## Routing Logic Analysis

### Current Routing Priorities

**Priority Levels:**
```
Top (t)    - VIP customers, escalations
High (h)   - Billing, payment issues
Medium (m) - Standard sales and support
Low (l)    - Internal calls, training
```

**Priority Assignment by Vector:**
```
Vector 10 (Sales Main):        Priority: Medium
Vector 20 (Tech Support):      Priority: Medium
Vector 30 (Billing):           Priority: High
Vector 40 (VIP Support):       Priority: Top
Vector 50 (General):           Priority: Medium
```

### EWT (Expected Wait Time) Calculation

```
Current Algorithm:
EWT = (Calls in Queue × Average Handle Time) / Available Agents

Example:
├─ Calls in Queue: 10
├─ Average Handle Time: 360 seconds (6 minutes)
├─ Available Agents: 5
└─ EWT = (10 × 360) / 5 = 720 seconds = 12 minutes

Announced to Caller:
"Your estimated wait time is approximately 12 minutes"
```

---

## Performance Metrics

### Current State Performance (Last 30 Days)

| Queue/Skill | Calls Offered | Answered | Abandoned | Service Level | ASA | AHT |
|-------------|---------------|----------|-----------|---------------|-----|-----|
| Sales_New (10) | 12,456 | 11,234 | 1,222 (9.8%) | 76% | 48s | 6m 15s |
| Sales_Account (11) | 8,923 | 8,456 | 467 (5.2%) | 82% | 35s | 8m 30s |
| Support_T1 (20) | 18,734 | 16,891 | 1,843 (9.8%) | 72% | 55s | 12m 45s |
| Support_T2 (21) | 5,234 | 4,987 | 247 (4.7%) | 85% | 28s | 18m 20s |
| Billing (30) | 9,876 | 9,123 | 753 (7.6%) | 79% | 42s | 9m 10s |
| VIP (40) | 2,345 | 2,312 | 33 (1.4%) | 94% | 15s | 15m 30s |

**Key Findings:**
- ⚠️ Sales and Support T1 not meeting 80/20 SLA
- ⚠️ High abandonment rates (>5%) in multiple queues
- ✅ VIP queue performing well
- ⚠️ Average Speed of Answer (ASA) too high for most queues

---

## Pain Points and Limitations

### 1. Vector Programming Complexity

**Issue:**
```
Vectors are difficult to create and modify:
├─ Requires specialized programming knowledge
├─ No visual representation of call flow
├─ Testing requires production-like environment
├─ Changes require careful syntax checking
└─ Limited to 32 steps per vector
```

**Impact:**
- Long lead time for routing changes (1-2 weeks)
- Risk of errors during modifications
- Dependence on specialized staff

### 2. Limited Real-Time Visibility

**Issue:**
```
CMS Reporting Limitations:
├─ Historical reports only (no real-time)
├─ Delayed data (15-30 minute lag)
├─ Complex report creation
├─ Limited dashboard capabilities
└─ Cannot drill down easily
```

**Impact:**
- Supervisors lack real-time queue visibility
- Difficult to respond to service level issues quickly
- Limited proactive management

### 3. Skills Management Overhead

**Issue:**
```
Agent Skills Administration:
├─ Manual skill updates (command line)
├─ No bulk import/export capability
├─ Skill levels 1-16 (confusing scale)
├─ No dynamic skill updating
└─ Limited to 10 skills per agent
```

**Impact:**
- Time-consuming to update agent skills
- Inflexible during peak periods
- Cannot easily adjust routing based on conditions

### 4. Overflow and Failover Limitations

**Issue:**
```
Limited Overflow Options:
├─ Fixed overflow thresholds in vectors
├─ No dynamic threshold adjustment
├─ Difficult to implement time-based routing
├─ Manual intervention required for emergencies
└─ No automated geographic failover
```

**Impact:**
- Cannot respond dynamically to changing conditions
- Risk of poor customer experience during spikes
- Manual intervention required

### 5. Integration Challenges

**Issue:**
```
CRM Integration via TSAPI:
├─ Complex protocol (proprietary)
├─ Requires middleware development
├─ Limited data passed to CRM
├─ Screen pop delays (2-5 seconds)
└─ Difficult troubleshooting
```

**Impact:**
- Poor agent experience
- Higher costs for custom development
- Integration fragility

### 6. Reporting and Analytics

**Issue:**
```
Limited Analytics Capabilities:
├─ Standard reports only
├─ Custom reports require database queries
├─ No trending or predictive analytics
├─ Cannot easily correlate data across systems
└─ Export process cumbersome
```

**Impact:**
- Limited business insights
- Time-consuming manual reporting
- Difficult to optimize operations

---

## Configuration Documentation

### Backup and Recovery

**Current Backup Process:**
```
Daily Backups:
├─ Communication Manager: Full backup nightly
├─ CMS Database: Transaction logs every hour
├─ Vector translations: Weekly export
└─ Skills/Agent configs: Manual documentation

Recovery Time: 2-4 hours (full system restore)
Recovery Point: Last backup (up to 24 hours of data loss)
```

### Change Management

**Current Process:**
```
1. Request submitted via ticket system
2. Change reviewed by CM admin team
3. Testing in lab environment (if available)
4. Change scheduled for maintenance window
5. Implementation by CM administrator
6. Validation testing
7. Documentation updated

Average cycle time: 1-2 weeks for routine changes
```

---

## Migration Readiness Assessment

### Data to Extract for Migration

```
Configuration Data:
☐ VDN list with DNIS mappings
☐ Vector logic documentation (converted to flowcharts)
☐ Skills list with descriptions
☐ Agent profiles with skill assignments
☐ Hunt group configurations
☐ Announcements (audio files)
☐ Business hours and holiday schedules
☐ Service level objectives
☐ Coverage paths and escalation procedures

Historical Data (for baseline):
☐ Call volume patterns (hourly/daily/monthly)
☐ Service level achievement (last 6 months)
☐ Average handle times by skill
☐ Agent utilization statistics
☐ Abandonment rates and reasons
```

### Questions to Answer Before Migration

```
1. Which vectors have the highest call volume?
2. Which skills have the most complex routing logic?
3. What are the current service level targets?
4. How many agents need to be migrated?
5. What integrations are currently in use?
6. Are there any seasonal or time-based routing rules?
7. What announcements need to be re-recorded?
8. Which reports are used most frequently?
```

---

## Recommendations for Webex Design

Based on current configuration analysis:

### 1. Simplify Routing Logic
```
Current: Complex vectors with nested conditions
Target:  Visual flow designer with simpler logic
Benefit: Faster changes, easier troubleshooting
```

### 2. Enhance Real-Time Visibility
```
Current: CMS reports (delayed)
Target:  Real-time dashboards in Webex Analyzer
Benefit: Proactive management, faster response
```

### 3. Dynamic Skills Management
```
Current: Manual, static skill assignments
Target:  API-driven, dynamic skill updates
Benefit: Flexibility during peak periods
```

### 4. Improved Integration
```
Current: TSAPI (complex, proprietary)
Target:  REST APIs (standard, simple)
Benefit: Faster integration, lower cost
```

### 5. Advanced Analytics
```
Current: Standard reports only
Target:  AI-powered analytics and insights
Benefit: Data-driven optimization
```


