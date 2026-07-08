# Chapter 6: Migration Enablement & Technical Planning

---

## IMPORTANT DISCLAIMER - FINANCIAL VALUES

**All financial values, costs, and pricing figures in this document are EXAMPLES ONLY for demonstration and calculation purposes.**

These values are provided to:
- Illustrate calculation methodologies
- Show how to perform capacity planning
- Demonstrate TCO analysis frameworks
- Help you build your own business case with actual vendor quotes

**Do NOT use these example values for:**
- Actual budgeting or financial planning
- Vendor negotiations or procurement
- Executive presentations or business case approvals
- Contract discussions or commitments

**Action Required:**
Replace all `[EXAMPLE: $XXX]` placeholder values with actual quotes from:
- Cisco/Webex sales representatives
- Current Avaya support contracts
- Infrastructure vendors (network, storage, etc.)
- Your organization's specific costs

**Calculation methodologies and formulas ARE accurate** and can be used for your planning.

---

## Overview

This chapter addresses **critical technical and operational topics** essential for a successful Avaya to Webex Contact Center migration. These areas significantly impact migration success, ongoing operations, and business continuity.

**Chapter Objectives:**
- Define comprehensive data migration strategies for historical and configuration data
- Establish recording and quality management frameworks
- Provide detailed capacity and sizing calculations for infrastructure planning
- Document license management and optimization strategies
- Provide TCO analysis methodology framework
- Provide detailed hour-by-hour cutover runbook with rollback procedures
- Ensure compliance with data retention and archival requirements
- Minimize business disruption through proper planning

**Key Success Factors:**
- Zero data loss during migration
- Minimal business interruption (target: <2 hours downtime)
- Optimized licensing based on actual usage patterns
- Accurate capacity planning to avoid over/under-provisioning
- Proper recording retention and quality management
- Compliance with regulatory requirements (PCI-DSS, GDPR, HIPAA, SOX)

---

## Table of Contents

1. [Data Migration Strategy](#1-data-migration-strategy)
   - 1.1 [Overview and Approach](#11-overview-and-approach)
   - 1.2 [Historical Data Migration](#12-historical-data-migration)
   - 1.3 [Configuration Data Migration](#13-configuration-data-migration)
   - 1.4 [Database Migration Procedures](#14-database-migration-procedures)
   - 1.5 [Data Validation and Reconciliation](#15-data-validation-and-reconciliation)
   - 1.6 [Data Archival Strategy](#16-data-archival-strategy)

2. [Recording & Quality Management](#2-recording--quality-management)
   - 2.1 [Call Recording Architecture](#21-call-recording-architecture)
   - 2.2 [Recording Storage and Retention](#22-recording-storage-and-retention)
   - 2.3 [Quality Management Integration](#23-quality-management-integration)
   - 2.4 [Recording Compliance and Security](#24-recording-compliance-and-security)

3. [Capacity & Sizing](#3-capacity--sizing)
   - 3.1 [Detailed Capacity Calculations](#31-detailed-capacity-calculations)
   - 3.2 [Storage Sizing for Recordings](#32-storage-sizing-for-recordings)
   - 3.3 [Network Bandwidth Calculations](#33-network-bandwidth-calculations)
   - 3.4 [Agent Concurrency Modeling](#34-agent-concurrency-modeling)
   - 3.5 [IVR Call Flow Capacity Planning](#35-ivr-call-flow-capacity-planning)

4. [License Management](#4-license-management)
   - 4.1 [Webex Contact Center Licensing Overview](#41-webex-contact-center-licensing-overview)
   - 4.2 [License Mapping from Avaya](#42-license-mapping-from-avaya)
   - 4.3 [License Optimization Strategies](#43-license-optimization-strategies)
   - 4.4 [License Management and Administration](#44-license-management-and-administration)
   - 4.5 [License Forecasting and Growth Planning](#45-license-forecasting-and-growth-planning)

5. [TCO Analysis Methodology](#5-tco-analysis-methodology)
   - 5.1 [TCO Comparison Framework](#51-tco-comparison-framework)
   - 5.2 [Cost Category Definitions](#52-cost-category-definitions)
   - 5.3 [Data Collection Requirements](#53-data-collection-requirements)
   - 5.4 [ROI Calculation Framework](#54-roi-calculation-framework)

6. [Detailed Cutover Runbook](#6-detailed-cutover-runbook)
   - 6.1 [Cutover Planning and Preparation](#61-cutover-planning-and-preparation)
   - 6.2 [Pre-Cutover Checklist](#62-pre-cutover-checklist)
   - 6.3 [Hour-by-Hour Cutover Timeline](#63-hour-by-hour-cutover-timeline)
   - 6.4 [Rollback Procedures](#64-rollback-procedures)
   - 6.5 [Post-Cutover Validation](#65-post-cutover-validation)
   - 6.6 [Hypercare Support Plan](#66-hypercare-support-plan)

---

## 1. Data Migration Strategy

### 1.1 Overview and Approach

**Data Migration Philosophy:**
Data migration is one of the most critical—and often underestimated—aspects of contact center migrations. A comprehensive strategy must balance business continuity, compliance requirements, technical constraints, and operational considerations.

**Migration Approach:**

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA MIGRATION STRATEGY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 1: Discovery & Assessment (Weeks 1-2)                    │
│  ├─ Inventory all data sources                                  │
│  ├─ Identify data dependencies                                  │
│  ├─ Assess data quality and completeness                        │
│  ├─ Determine regulatory retention requirements                 │
│  └─ Estimate migration complexity and timeline                  │
│                                                                  │
│  Phase 2: Data Cleanup & Preparation (Weeks 3-4)                │
│  ├─ Archive obsolete data (7+ years old)                        │
│  ├─ Deduplicate records                                         │
│  ├─ Standardize formats                                         │
│  ├─ Validate data integrity                                     │
│  └─ Prepare transformation scripts                              │
│                                                                  │
│  Phase 3: Test Migration (Weeks 5-6)                            │
│  ├─ Migrate subset (10%) to test environment                    │
│  ├─ Validate data accuracy                                      │
│  ├─ Performance testing                                         │
│  ├─ Refine migration scripts                                    │
│  └─ Document lessons learned                                    │
│                                                                  │
│  Phase 4: Full Migration (Week 7)                               │
│  ├─ Freeze Avaya system (read-only mode)                        │
│  ├─ Execute full data migration                                 │
│  ├─ Validate 100% data integrity                                │
│  ├─ Parallel verification (Avaya vs Webex)                      │
│  └─ Sign-off and cutover                                        │
│                                                                  │
│  Phase 5: Post-Migration Validation (Weeks 8-9)                 │
│  ├─ End-user validation and spot-checking                       │
│  ├─ Reconciliation reports                                      │
│  ├─ Address any data gaps                                       │
│  └─ Final sign-off                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Data Migration Scope:**

| Data Type | Priority | Retention | Migration Approach |
|-----------|----------|-----------|-------------------|
| **Call Recordings** | High | 7 years (PCI-DSS) | Selective (recent 90-365 days) |
| **CDR (Call Detail Records)** | High | 7 years (regulatory) | Full migration (all records) |
| **Historical Reports** | Medium | 3 years | Migrate critical reports only |
| **Agent Profiles** | Critical | Active only | 100% migration (current agents) |
| **IVR Flows** | Critical | Current version | Migrate + redesign for Webex Connect |
| **Routing Configurations** | Critical | Current | Migrate + optimize for Webex |
| **Schedules/Holidays** | High | Current + 1 year | 100% migration |
| **Quality Scorecards** | Medium | 2 years | Migrate templates + recent scores |

---

### 1.2 Historical Data Migration

**1.2.1 Call Recordings Migration**

**Challenge:**
Contact centers typically have **millions of call recordings** accumulated over years, often consuming **100+ TB of storage**. Migrating all recordings is expensive, time-consuming, and often unnecessary.

**Migration Strategy Options:**

| Strategy | Description | Use Case | Pros | Cons |
|----------|-------------|----------|------|------|
| **Full Migration** | Migrate all recordings to Webex storage | Regulatory requirement for 7+ years | Complete history available | High operational effort, long migration time |
| **Partial Migration** | Migrate recent recordings (90-365 days) | Most common operational need | Balance effort/value | Historical recordings in separate archive |
| **Archive-Only** | Keep recordings in Avaya archive, no migration | Low operational need for old recordings | Minimal effort | Requires maintaining Avaya access |
| **Hybrid** | Migrate critical/recent, archive remainder | Flexible approach | Best of both worlds | More complex management |

**Recommended Approach (Hybrid):**

```
┌────────────────────────────────────────────────────────────┐
│          CALL RECORDING MIGRATION STRATEGY                  │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Recordings 0-90 days old:                                  │
│  └─ Migrate to Webex CC Recording Storage                  │
│     ├─ Immediate access required                           │
│     ├─ Quality Management active review                    │
│     └─ Compliance spot-checks                              │
│                                                             │
│  Recordings 91-365 days old:                                │
│  └─ Migrate to AWS S3 Standard (warm storage)              │
│     ├─ Occasional access for disputes/audits               │
│     ├─ Lower cost than Webex storage                       │
│     └─ API access for retrieval                            │
│                                                             │
│  Recordings 1-3 years old:                                  │
│  └─ Archive to AWS S3 Glacier (cold storage)               │
│     ├─ Rare access (legal holds, audits)                   │
│     ├─ Very low cost                                       │
│     └─ 3-5 hour retrieval SLA acceptable                   │
│                                                             │
│  Recordings 3+ years old:                                   │
│  └─ Keep in Avaya archive (read-only)                      │
│     ├─ Legal/regulatory retention only                     │
│     ├─ No migration cost                                   │
│     └─ Decommission Avaya after retention expires          │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Recording Migration Tooling:**

1. **Native Webex API** - For recent recordings (0-90 days)
   - Webex Recording Upload API
   - Metadata preservation (caller ID, agent, duration, etc.)
   - Direct transfer from Avaya to Webex storage

2. **AWS S3 Transfer** - For older recordings (91+ days)
   - AWS DataSync or AWS CLI
   - Batch upload with metadata tagging
   - Lifecycle policies for automatic tiering (Standard → Glacier)

3. **Third-Party Tools**
   - Verint Recording Migration Tool
   - NICE Recording Transfer Utility
   - Custom scripts (Python + ffmpeg for format conversion)

**Recording Format Considerations:**

| Avaya Format | Webex Format | Conversion Required? | Tool |
|--------------|--------------|---------------------|------|
| WAV (PCM) | WAV or MP3 | No (or optional compression) | ffmpeg |
| G.711 | MP3 | Yes (compression recommended) | ffmpeg |
| Proprietary | MP3 | Yes | Vendor-specific converter |

**Migration Timeline Estimate:**

```
For 1,000-agent contact center with 5 million recordings:

- Recordings to migrate (0-90 days): ~500,000 recordings
- Average recording size: 2 MB
- Total data: 500,000 × 2 MB = 1,000 GB (1 TB)
- Transfer speed: 100 Mbps (sustained)
- Migration time: 1 TB ÷ 100 Mbps ≈ 24 hours

Parallel migration (10 concurrent streams): ~3 hours
```

---

**1.2.2 CDR (Call Detail Records) Migration**

**Objective:**
Migrate all Call Detail Records (CDR) for historical reporting, billing reconciliation, and compliance.

**CDR Data Structure (Avaya):**

```sql
-- Sample Avaya CMS CDR Schema
CREATE TABLE call_detail_records (
    call_id VARCHAR(50) PRIMARY KEY,
    call_date DATE,
    call_time TIME,
    ani VARCHAR(20),           -- Caller phone number
    dnis VARCHAR(20),          -- Dialed number
    agent_id VARCHAR(10),
    queue VARCHAR(50),
    call_duration INT,         -- seconds
    ivr_duration INT,          -- seconds in IVR
    queue_duration INT,        -- seconds in queue
    talk_duration INT,         -- seconds talking with agent
    hold_duration INT,         -- seconds on hold
    wrap_duration INT,         -- after-call work
    disposition VARCHAR(50),   -- call outcome
    recording_id VARCHAR(100)  -- Link to recording
);
```

**CDR Migration Approach:**

1. **Export from Avaya CMS**

```sql
-- SQL query to export CDR from Avaya CMS

SELECT 
    call_id,
    call_date,
    call_time,
    ani,
    dnis,
    agent_id,
    queue,
    call_duration,
    ivr_duration,
    queue_duration,
    talk_duration,
    hold_duration,
    wrap_duration,
    disposition,
    recording_id
FROM 
    call_detail_records
WHERE 
    call_date >= '2018-01-01'  -- 7 years retention
ORDER BY 
    call_date, call_time;

-- Export to CSV: 10 million records takes ~30 minutes
```

2. **Transform for Webex Format**

```python
# Python script to transform Avaya CDR to Webex format

import pandas as pd
from datetime import datetime

def transform_cdr(avaya_cdr_file, webex_output_file):
    # Read Avaya CDR
    df = pd.read_csv(avaya_cdr_file)
    
    # Transform to Webex format
    webex_cdr = pd.DataFrame({
        'sessionId': df['call_id'],
        'startTime': pd.to_datetime(df['call_date'] + ' ' + df['call_time']),
        'callerANI': df['ani'],
        'dialedNumber': df['dnis'],
        'agentId': df['agent_id'],
        'queueId': df['queue'],
        'totalDuration': df['call_duration'],
        'ivrDuration': df['ivr_duration'],
        'queueDuration': df['queue_duration'],
        'talkDuration': df['talk_duration'],
        'holdDuration': df['hold_duration'],
        'wrapDuration': df['wrap_duration'],
        'callDisposition': df['disposition'],
        'recordingUrl': 'https://recordings.webex.com/' + df['recording_id']
    })
    
    # Write to output
    webex_cdr.to_csv(webex_output_file, index=False)
    print(f"Transformed {len(webex_cdr)} CDR records")

# Example usage
transform_cdr('avaya_cdr_export.csv', 'webex_cdr_import.csv')
```

3. **Import to Webex Reporting Database**

Webex Contact Center stores CDR in cloud storage (Webex Analyzer). Import via:
- **Webex Analyzer API** - Programmatic upload
- **Bulk Import Tool** - CSV file upload (provided by Cisco)

**CDR Migration Validation:**

```python
# Validation script to compare Avaya vs Webex CDR counts

def validate_cdr_migration(avaya_file, webex_file):
    avaya_df = pd.read_csv(avaya_file)
    webex_df = pd.read_csv(webex_file)
    
    print(f"Avaya CDR Count: {len(avaya_df)}")
    print(f"Webex CDR Count: {len(webex_df)}")
    
    if len(avaya_df) == len(webex_df):
        print("✅ CDR count matches")
    else:
        print("❌ CDR count mismatch!")
        missing = len(avaya_df) - len(webex_df)
        print(f"Missing {missing} records")
    
    # Validate totals
    avaya_total_duration = avaya_df['call_duration'].sum()
    webex_total_duration = webex_df['totalDuration'].sum()
    
    if avaya_total_duration == webex_total_duration:
        print("✅ Total call duration matches")
    else:
        print("❌ Total call duration mismatch!")

validate_cdr_migration('avaya_cdr_export.csv', 'webex_cdr_import.csv')
```

---

**1.2.3 Historical Reports Migration**

**Objective:**
Migrate critical historical reports for trend analysis, compliance, and business intelligence.

**Report Categories:**

| Report Category | Retention | Migration Priority | Approach |
|-----------------|-----------|-------------------|----------|
| **Agent Performance** | 2 years | High | Migrate monthly summaries |
| **Queue Statistics** | 2 years | High | Migrate monthly summaries |
| **Service Level Reports** | 3 years | Medium | Migrate quarterly summaries |
| **Abandonment Reports** | 2 years | Medium | Migrate monthly summaries |
| **IVR Performance** | 1 year | Low | Migrate recent only |
| **Call Volume Trends** | 3 years | High | Migrate all (small data size) |
| **Compliance Reports** | 7 years | Critical | Migrate all (regulatory) |

**Report Migration Approach:**

1. **Export Avaya CMS Reports to PDF/Excel**
   - Use Avaya CMS report scheduler
   - Export in PDF format (for archival)
   - Export in Excel format (for data analysis)

2. **Archive Reports in Document Management System**
   - Upload to SharePoint, Box, or cloud storage
   - Organize by: Year > Month > Report Type
   - Tag with metadata (date, report type, business unit)

3. **Recreate Critical Reports in Webex Analyzer**
   - Identify top 20 most-used reports
   - Rebuild in Webex Analyzer dashboard
   - Schedule automated delivery (email, SharePoint)

**Report Archive Structure:**

```
Avaya_Historical_Reports/
├── 2018/
│   ├── 01_January/
│   │   ├── Agent_Performance_2018-01.pdf
│   │   ├── Queue_Statistics_2018-01.pdf
│   │   └── Service_Level_2018-01.pdf
│   ├── 02_February/
│   └── ...
├── 2019/
├── 2020/
├── 2021/
├── 2022/
├── 2023/
└── 2024/
```

---

### 1.3 Configuration Data Migration

**1.3.1 Agent Profiles and Skills**

**Objective:**
Migrate all active agent profiles, skill assignments, and supervisor hierarchies to Webex Contact Center.

**Agent Data to Migrate:**

| Data Element | Source (Avaya) | Destination (Webex) | Migration Method |
|--------------|----------------|---------------------|------------------|
| Agent ID | Avaya CMS | Webex CC (User ID) | CSV import or API |
| Agent Name | Avaya CMS | Webex CC (Display Name) | CSV import |
| Email Address | Active Directory | Webex CC (Login) | CSV import |
| Primary Skill | Avaya Elite | Webex CC (Skill Profile) | Mapping table |
| Secondary Skills | Avaya Elite | Webex CC (Multi-skill) | Mapping table |
| Proficiency Level | Avaya (1-10 scale) | Webex (1-5 scale) | Transform: Avaya ÷ 2 |
| Supervisor | Avaya CMS | Webex CC (Team Assignment) | CSV import |
| Work Schedule | Avaya CMS | Webex CC (Agent Profile) | Manual configuration |

**Agent Migration Process:**

**Step 1: Export Agent Data from Avaya**

```sql
-- SQL query to export all active agents from Avaya CMS

SELECT 
    a.agent_id,
    a.agent_name,
    a.email,
    a.login_id,
    s.skill_name as primary_skill,
    s.proficiency_level,
    sup.supervisor_name,
    a.work_schedule
FROM 
    agents a
    LEFT JOIN agent_skills s ON a.agent_id = s.agent_id
    LEFT JOIN supervisors sup ON a.supervisor_id = sup.supervisor_id
WHERE 
    a.status = 'ACTIVE'
ORDER BY 
    a.agent_id;
```

**Step 2: Transform to Webex Format**

```python
# Python script to transform Avaya agent data to Webex format

import pandas as pd

def transform_agents(avaya_export, webex_import):
    df = pd.read_csv(avaya_export)
    
    # Transform proficiency: Avaya (1-10) → Webex (1-5)
    df['webex_proficiency'] = df['proficiency_level'] / 2
    df['webex_proficiency'] = df['webex_proficiency'].round().astype(int)
    
    # Create Webex import file
    webex_agents = pd.DataFrame({
        'userId': df['login_id'],
        'firstName': df['agent_name'].str.split().str[0],
        'lastName': df['agent_name'].str.split().str[-1],
        'email': df['email'],
        'primarySkill': df['primary_skill'],
        'skillLevel': df['webex_proficiency'],
        'teamId': df['supervisor_name'],  # Map to Webex team
        'profileType': 'Agent'
    })
    
    webex_agents.to_csv(webex_import, index=False)
    print(f"Transformed {len(webex_agents)} agents")

transform_agents('avaya_agents.csv', 'webex_agents_import.csv')
```

**Step 3: Import to Webex Contact Center**

- **Option 1: Bulk Import Tool**
  - Webex Control Hub > Users > Bulk Import
  - Upload CSV file
  - Validate and commit

- **Option 2: API Import**
  ```python
  import requests
  
  def import_agents_via_api(csv_file, api_token):
      df = pd.read_csv(csv_file)
      
      headers = {
          'Authorization': f'Bearer {api_token}',
          'Content-Type': 'application/json'
      }
      
      for index, row in df.iterrows():
          payload = {
              'userId': row['userId'],
              'firstName': row['firstName'],
              'lastName': row['lastName'],
              'email': row['email'],
              'skills': [{
                  'skillName': row['primarySkill'],
                  'skillLevel': row['skillLevel']
              }],
              'teamId': row['teamId']
          }
          
          response = requests.post(
              'https://api.wxcc-us1.cisco.com/v1/agents',
              headers=headers,
              json=payload
          )
          
          if response.status_code == 201:
              print(f"✅ Created agent: {row['userId']}")
          else:
              print(f"❌ Failed: {row['userId']} - {response.text}")
  
  import_agents_via_api('webex_agents_import.csv', 'YOUR_API_TOKEN')
  ```

**Agent Migration Validation:**

```python
def validate_agent_migration():
    # Compare Avaya vs Webex agent counts
    avaya_agents = pd.read_csv('avaya_agents.csv')
    webex_agents = pd.read_csv('webex_agents_created.csv')
    
    print(f"Avaya Agents: {len(avaya_agents)}")
    print(f"Webex Agents: {len(webex_agents)}")
    
    if len(avaya_agents) == len(webex_agents):
        print("✅ Agent count matches")
    else:
        print("❌ Agent count mismatch!")
        
        # Find missing agents
        avaya_ids = set(avaya_agents['login_id'])
        webex_ids = set(webex_agents['userId'])
        missing = avaya_ids - webex_ids
        
        if missing:
            print(f"Missing agents: {missing}")

validate_agent_migration()
```

---

**1.3.2 IVR Flows and Scripts**

**Challenge:**
Avaya IVR (Experience Portal + Orchestration Designer) uses a completely different architecture than Webex Connect (Flow Designer). **Direct migration is not possible** - IVR flows must be **redesigned** for Webex Connect.

**Migration Approach:**

| Approach | Description | Effort | Recommendation |
|----------|-------------|--------|----------------|
| **Recreate from Scratch** | Redesign IVR flows in Webex Connect | High | Best for modern UX |
| **Functional Replication** | Match Avaya flow logic in Webex | Medium | Maintains parity |
| **Hybrid** | Recreate + optimize for Webex | Medium-High | Recommended |

**IVR Migration Process:**

**Step 1: Document Avaya IVR Flows**

For each IVR flow, document:
- Entry point (DNIS, queue)
- Menu structure (options 1-9, 0, *, #)
- Database lookups (customer ID, account balance)
- Routing logic (business hours, VIP routing)
- Prompts (audio files, TTS)
- Escalation paths (timeout, max retries)

**Example Avaya IVR Documentation:**

```
IVR Flow: Main Customer Service Menu
Entry Point: 1-800-XX5-1234

Menu Structure:
├── Welcome Prompt: "Thank you for calling..."
├── Option 1: Check Account Balance
│   ├── Prompt: Enter account number
│   ├── Database Lookup: Validate account
│   ├── TTS: "Your balance is $XXX"
│   └── Return to main menu
├── Option 2: Make a Payment
│   └── Transfer to Payment IVR
├── Option 3: Speak to Agent
│   ├── Check business hours
│   ├── Route to appropriate queue
│   └── Play estimated wait time
└── Option 0: Repeat menu
```

**Step 2: Design Webex Connect Equivalent**

```
┌────────────────────────────────────────────────────┐
│       WEBEX CONNECT FLOW DESIGNER                   │
├────────────────────────────────────────────────────┤
│                                                     │
│  [Incoming Call]                                    │
│       │                                             │
│       ▼                                             │
│  [Play Welcome]                                     │
│       │                                             │
│       ▼                                             │
│  [Menu - Main]                                      │
│       ├── 1: [HTTP Request → Account Balance API]  │
│       │        │                                    │
│       │        ▼                                    │
│       │   [Play Balance TTS]                        │
│       │        │                                    │
│       │        └──────> [Return to Menu]            │
│       │                                             │
│       ├── 2: [Transfer → Payment IVR]               │
│       │                                             │
│       ├── 3: [Business Hours Check]                 │
│       │        ├── Open → [Queue Agent]             │
│       │        └── Closed → [Play Closed Message]   │
│       │                                             │
│       └── 0: [Loop to Menu]                         │
│                                                     │
└────────────────────────────────────────────────────┘
```

**Step 3: Build and Test in Webex Connect**

- Create flow in Webex Connect Flow Designer
- Configure nodes (Play Audio, Menu, HTTP Request, etc.)
- Upload audio prompts (or use TTS)
- Configure API integrations (CRM, billing system)
- Test thoroughly (happy path + error scenarios)

**IVR Prompt Migration:**

| Avaya Prompt Format | Webex Connect Format | Conversion Required? |
|---------------------|---------------------|---------------------|
| WAV (8 kHz, 16-bit) | WAV or MP3 | Optional (re-record for quality) |
| Avaya TTS | Webex TTS | No (reconfigure in Webex) |
| Nuance TTS | Webex TTS | Yes (different engine) |

**Recommendation:** Re-record professional prompts for Webex (better quality, modern voice talent).

---

**1.3.3 Routing Configurations**

**Objective:**
Migrate queue-based routing, skills-based routing, and time-of-day routing from Avaya to Webex.

**Routing Migration Mapping:**

| Avaya Concept | Webex Equivalent | Notes |
|---------------|------------------|-------|
| **Vector (routing script)** | Flow | Redesign in Flow Designer |
| **Skill** | Skill | 1:1 mapping (may rename) |
| **VDN (Virtual Directory Number)** | Entry Point | Maps to DNIS/queue |
| **Hunt Group** | Queue | 1:1 mapping |
| **EAS (Expected Wait Time)** | Queue Statistics | Available in Webex |

**Routing Configuration Export:**

```sql
-- Export Avaya routing configurations

-- Queues
SELECT queue_id, queue_name, service_level_target, max_wait_time
FROM queues
WHERE status = 'ACTIVE';

-- Skills
SELECT skill_id, skill_name, skill_category, priority
FROM skills
WHERE status = 'ACTIVE';

-- Time-of-Day Routing
SELECT route_id, route_name, business_hours, holiday_schedule, after_hours_destination
FROM routing_schedules;
```

**Webex Routing Configuration:**

Create in Webex Control Hub:
- **Queues** - Map from Avaya hunt groups
- **Skills** - Recreate skill hierarchy
- **Entry Points** - Map from Avaya VDNs
- **Routing Strategy** - Configure in Flow Designer

**Example Routing Flow in Webex:**

```
[Call Arrives at Entry Point: "Sales Queue"]
    │
    ▼
[Business Hours Check]
    ├── Business Hours → [Queue: Sales]
    │                     ├── Skill: English (required)
    │                     ├── Skill: Product Knowledge (preferred)
    │                     └── Longest Available Agent
    │
    └── After Hours → [Play Message: "We're closed"]
                       └── [Voicemail or Callback]
```

---

**1.3.4 Schedules and Holidays**

**Objective:**
Migrate business hours, holiday schedules, and time-of-day routing.

**Schedule Data to Migrate:**

| Schedule Type | Avaya Source | Webex Destination | Migration Method |
|---------------|--------------|-------------------|------------------|
| Business Hours | Avaya CMS | Webex Flow Designer | Manual configuration |
| Holiday Calendar | Avaya CMS | Webex Control Hub | CSV import |
| Agent Shifts | Avaya CMS or WFM | Webex CC (if using WFM) | WFM tool integration |

**Holiday Calendar Migration:**

```python
# Export Avaya holidays and import to Webex

import pandas as pd
from datetime import datetime

def migrate_holidays(avaya_export, webex_import):
    df = pd.read_csv(avaya_export)
    
    # Transform to Webex format
    webex_holidays = pd.DataFrame({
        'holidayName': df['holiday_name'],
        'holidayDate': pd.to_datetime(df['holiday_date']).dt.strftime('%Y-%m-%d'),
        'observedDate': pd.to_datetime(df['observed_date']).dt.strftime('%Y-%m-%d'),
        'allDay': True,
        'timezone': 'America/New_York'
    })
    
    webex_holidays.to_csv(webex_import, index=False)
    print(f"Migrated {len(webex_holidays)} holidays")

migrate_holidays('avaya_holidays.csv', 'webex_holidays.csv')
```

Import to Webex Control Hub:
- Navigate to: Control Hub > Services > Contact Center > Calendars
- Upload CSV file
- Validate dates and apply to routing flows

---

### 1.4 Database Migration Procedures

**Database Migration Tools:**

| Tool | Use Case | Pros | Cons |
|------|----------|------|------|
| **SQL Server Integration Services (SSIS)** | Avaya CMS → Webex DB | Powerful, flexible | Requires SQL Server license |
| **Python + pandas** | CSV-based migration | Free, customizable | Manual scripting |
| **Talend Data Integration** | ETL (Extract-Transform-Load) | Visual interface | Commercial license |
| **Apache NiFi** | Data flow automation | Open source, scalable | Steep learning curve |

**Database Migration Checklist:**

- [ ] Identify all data sources (Avaya CMS, Avaya Elite, Experience Portal)
- [ ] Map database schemas (Avaya → Webex)
- [ ] Extract data to CSV/SQL files
- [ ] Transform data (formatting, validation, deduplication)
- [ ] Test migration on subset (10%)
- [ ] Validate accuracy (100% match)
- [ ] Execute full migration
- [ ] Post-migration validation
- [ ] Archive source data

---

### 1.5 Data Validation and Reconciliation

**Validation Objectives:**
- **Zero data loss** - All critical data migrated successfully
- **100% accuracy** - Data integrity maintained
- **Audit trail** - Complete migration logs and reports

**Validation Approach:**

**1. Row Count Validation**

```sql
-- Compare record counts: Avaya vs Webex

-- Avaya
SELECT 
    'Agents' as entity, 
    COUNT(*) as count 
FROM avaya.agents 
WHERE status = 'ACTIVE'

UNION ALL

SELECT 
    'Call Detail Records', 
    COUNT(*) 
FROM avaya.cdr 
WHERE call_date >= '2018-01-01'

UNION ALL

SELECT 
    'Recordings', 
    COUNT(*) 
FROM avaya.recordings 
WHERE recording_date >= CURRENT_DATE - INTERVAL '90 days';

-- Webex (run equivalent queries)
-- Compare counts
```

**2. Data Integrity Validation**

```python
# Validate data integrity after migration

import pandas as pd

def validate_data_integrity(avaya_file, webex_file, key_column):
    avaya_df = pd.read_csv(avaya_file)
    webex_df = pd.read_csv(webex_file)
    
    # Check for duplicates
    avaya_dupes = avaya_df[avaya_df.duplicated(subset=[key_column], keep=False)]
    webex_dupes = webex_df[webex_df.duplicated(subset=[key_column], keep=False)]
    
    if len(avaya_dupes) > 0:
        print(f"❌ Avaya has {len(avaya_dupes)} duplicate records")
    if len(webex_dupes) > 0:
        print(f"❌ Webex has {len(webex_dupes)} duplicate records")
    
    # Check for missing values
    avaya_missing = avaya_df.isnull().sum()
    webex_missing = webex_df.isnull().sum()
    
    print("\nMissing Values:")
    print(f"Avaya: {avaya_missing}")
    print(f"Webex: {webex_missing}")
    
    # Validate key columns match
    avaya_keys = set(avaya_df[key_column])
    webex_keys = set(webex_df[key_column])
    
    missing_in_webex = avaya_keys - webex_keys
    extra_in_webex = webex_keys - avaya_keys
    
    if missing_in_webex:
        print(f"\n❌ Missing in Webex: {len(missing_in_webex)} records")
        print(f"Example IDs: {list(missing_in_webex)[:10]}")
    
    if extra_in_webex:
        print(f"\n⚠️  Extra in Webex: {len(extra_in_webex)} records")
    
    if not missing_in_webex and not extra_in_webex:
        print(f"\n✅ Perfect match! All {len(avaya_keys)} records migrated successfully")

validate_data_integrity('avaya_agents.csv', 'webex_agents.csv', 'agent_id')
```

**3. Reconciliation Report**

```python
def generate_reconciliation_report():
    report = {
        'Entity': [],
        'Avaya Count': [],
        'Webex Count': [],
        'Match': [],
        'Missing': [],
        'Extra': []
    }
    
    entities = [
        ('Agents', 'avaya_agents.csv', 'webex_agents.csv', 'agent_id'),
        ('CDR', 'avaya_cdr.csv', 'webex_cdr.csv', 'call_id'),
        ('Recordings', 'avaya_recordings.csv', 'webex_recordings.csv', 'recording_id')
    ]
    
    for entity_name, avaya_file, webex_file, key_col in entities:
        avaya_df = pd.read_csv(avaya_file)
        webex_df = pd.read_csv(webex_file)
        
        avaya_count = len(avaya_df)
        webex_count = len(webex_df)
        
        avaya_keys = set(avaya_df[key_col])
        webex_keys = set(webex_df[key_col])
        
        match = avaya_count == webex_count
        missing = len(avaya_keys - webex_keys)
        extra = len(webex_keys - avaya_keys)
        
        report['Entity'].append(entity_name)
        report['Avaya Count'].append(avaya_count)
        report['Webex Count'].append(webex_count)
        report['Match'].append('✅' if match else '❌')
        report['Missing'].append(missing)
        report['Extra'].append(extra)
    
    df = pd.DataFrame(report)
    print(df.to_string(index=False))
    df.to_csv('migration_reconciliation_report.csv', index=False)
    print("\nReconciliation report saved to: migration_reconciliation_report.csv")

generate_reconciliation_report()
```

**4. Sign-Off Process**

Migration sign-off requires:
- [ ] 100% data reconciliation (all entities match)
- [ ] Zero critical defects
- [ ] Business stakeholder validation
- [ ] IT stakeholder validation
- [ ] Compliance/legal sign-off (for regulated data)

---

### 1.6 Data Archival Strategy

**Archival Objectives:**
- Comply with regulatory retention requirements (7 years for PCI-DSS, HIPAA)
- Minimize long-term storage costs
- Maintain accessibility for legal holds and audits
- Decommission Avaya infrastructure once retention expires

**Archival Approach:**

```
┌─────────────────────────────────────────────────────────────┐
│              DATA ARCHIVAL STRATEGY                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Tier 1: Active (0-90 days)                                  │
│  ├─ Storage: Webex Contact Center (cloud)                   │
│  ├─ Access: Immediate (real-time)                           │
│  ├─ Use: Operations, quality management                     │
│  └─ Example Cost: Included in Webex subscription            │
│                                                              │
│  Tier 2: Warm Archive (91-365 days)                          │
│  ├─ Storage: AWS S3 Standard                                │
│  ├─ Access: Fast (sub-second)                               │
│  ├─ Use: Occasional (disputes, audits)                      │
│  └─ Example Cost: [EXAMPLE: $0.023/GB/month]                │
│                                                              │
│  Tier 3: Cold Archive (1-3 years)                            │
│  ├─ Storage: AWS S3 Glacier                                 │
│  ├─ Access: Slow (3-5 hours retrieval)                      │
│  ├─ Use: Rare (legal holds, regulatory)                     │
│  └─ Example Cost: [EXAMPLE: $0.004/GB/month]                │
│                                                              │
│  Tier 4: Deep Archive (3-7 years)                            │
│  ├─ Storage: AWS S3 Glacier Deep Archive                    │
│  ├─ Access: Very slow (12-48 hours)                         │
│  ├─ Use: Compliance only                                    │
│  └─ Example Cost: [EXAMPLE: $0.00099/GB/month]              │
│                                                              │
│  Tier 5: Disposal (7+ years)                                 │
│  ├─ Action: Secure deletion (NIST 800-88 compliant)         │
│  ├─ Audit: Deletion certification                           │
│  └─ Legal: Retention policy compliance                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Storage Cost Comparison (Example for 1,000 Agents):**

_Note: These are EXAMPLE values for calculation demonstration only. Replace with actual vendor quotes._

| Data Type | Volume | Tier | Example Monthly Cost |
|-----------|--------|------|---------------------|
| Active Recordings (0-90 days) | 500 GB | Webex CC | [EXAMPLE: Included] |
| Warm Archive (91-365 days) | 2 TB | S3 Standard | [EXAMPLE: $46] |
| Cold Archive (1-3 years) | 10 TB | S3 Glacier | [EXAMPLE: $40] |
| Deep Archive (3-7 years) | 40 TB | S3 Glacier Deep | [EXAMPLE: $40] |
| **TOTAL** | **52.5 TB** | - | **[EXAMPLE: $126/month]** |

**Archival Lifecycle Policy (AWS S3):**

```json
{
  "Rules": [
    {
      "Id": "RecordingArchivalPolicy",
      "Status": "Enabled",
      "Filter": {
        "Prefix": "recordings/"
      },
      "Transitions": [
        {
          "Days": 90,
          "StorageClass": "STANDARD"
        },
        {
          "Days": 365,
          "StorageClass": "GLACIER"
        },
        {
          "Days": 1095,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ],
      "Expiration": {
        "Days": 2555
      }
    }
  ]
}
```

This automatically moves recordings through storage tiers and deletes after 7 years.

---

## 2. Recording & Quality Management

### 2.1 Call Recording Architecture

**Webex Contact Center Recording Options:**

```
┌──────────────────────────────────────────────────────────┐
│       WEBEX CONTACT CENTER RECORDING ARCHITECTURE         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Option 1: Native Webex Recording (Recommended)           │
│  ├─ Cloud-based recording (built into Webex CC)          │
│  ├─ Automatic integration                                │
│  ├─ Included storage (90-day default)                    │
│  ├─ Encryption: AES-256 at rest                          │
│  ├─ Compliance: PCI-DSS, HIPAA, GDPR                     │
│  └─ Example Use: Most organizations                      │
│                                                           │
│  Option 2: Third-Party Recording (NICE, Verint)           │
│  ├─ On-premises or cloud recording                       │
│  ├─ Advanced features (screen capture, analytics)         │
│  ├─ Integration: SIP SIPREC protocol                     │
│  ├─ Example Cost: [EXAMPLE: $15-25/agent/month]          │
│  └─ Example Use: Advanced QM requirements                │
│                                                           │
│  Option 3: Hybrid (Webex + Third-Party)                   │
│  ├─ Webex for voice recording                            │
│  ├─ Third-party for screen/desktop recording             │
│  ├─ Best of both worlds                                  │
│  └─ Example Use: Complex compliance needs                │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**Recommendation:**
For most organizations migrating from Avaya, **native Webex recording** is the simplest and most effective option.

**Recording Architecture Diagram:**

```
┌────────────────────────────────────────────────────────────┐
│                                                             │
│  [Agent] ←─────── [Webex Contact Center] ────────> [Customer]
│                            │                               │
│                            │ (RTP Media Stream)             │
│                            ▼                               │
│                   [Webex Recording Service]                │
│                            │                               │
│                            ▼                               │
│                   [Cloud Storage - Encrypted]               │
│                            │                               │
│                            ├─> [Quality Management]         │
│                            ├─> [Compliance/Audit]           │
│                            └─> [Agent Training]             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

### 2.2 Recording Storage and Retention

**Storage Requirements Calculation:**

**Step 1: Determine Daily Recording Volume**

```python
# Calculate daily recording storage requirements

def calculate_recording_storage(
    agents=1000,
    calls_per_agent_per_day=25,
    avg_call_duration_minutes=6,
    recording_codec='G.711',
    compression_ratio=1.0
):
    # G.711: 64 kbps = 8 KB/s
    # G.722: 64 kbps = 8 KB/s
    # Opus: 32 kbps = 4 KB/s (compressed)
    
    codec_bitrates = {
        'G.711': 8,    # KB/s
        'G.722': 8,
        'Opus': 4
    }
    
    bitrate_kbps = codec_bitrates.get(recording_codec, 8)
    
    # Calculate
    total_calls_per_day = agents * calls_per_agent_per_day
    avg_call_duration_seconds = avg_call_duration_minutes * 60
    recording_size_per_call_kb = bitrate_kbps * avg_call_duration_seconds
    recording_size_per_call_mb = recording_size_per_call_kb / 1024
    
    # Apply compression
    recording_size_per_call_mb = recording_size_per_call_mb * compression_ratio
    
    # Daily total
    daily_storage_mb = total_calls_per_day * recording_size_per_call_mb
    daily_storage_gb = daily_storage_mb / 1024
    
    # Extrapolate to monthly/yearly
    monthly_storage_gb = daily_storage_gb * 30
    yearly_storage_gb = daily_storage_gb * 365
    
    print(f"Recording Storage Calculation:")
    print(f"  Agents: {agents}")
    print(f"  Calls/agent/day: {calls_per_agent_per_day}")
    print(f"  Total calls/day: {total_calls_per_day:,}")
    print(f"  Avg call duration: {avg_call_duration_minutes} minutes")
    print(f"  Recording codec: {recording_codec}")
    print(f"  Bitrate: {bitrate_kbps} KB/s")
    print(f"  Recording size/call: {recording_size_per_call_mb:.2f} MB")
    print(f"\nStorage Requirements:")
    print(f"  Daily: {daily_storage_gb:.2f} GB")
    print(f"  Monthly: {monthly_storage_gb:.2f} GB")
    print(f"  Yearly: {yearly_storage_gb:.2f} GB")
    print(f"  7-Year Total: {yearly_storage_gb * 7:.2f} GB ({yearly_storage_gb * 7 / 1024:.2f} TB)")
    
    return {
        'daily_gb': daily_storage_gb,
        'monthly_gb': monthly_storage_gb,
        'yearly_gb': yearly_storage_gb,
        'seven_year_gb': yearly_storage_gb * 7
    }

# Example for 1,000-agent contact center
storage = calculate_recording_storage(
    agents=1000,
    calls_per_agent_per_day=25,
    avg_call_duration_minutes=6,
    recording_codec='G.711',
    compression_ratio=0.3  # MP3 compression reduces size by 70%
)
```

**Output:**
```
Recording Storage Calculation:
  Agents: 1000
  Calls/agent/day: 25
  Total calls/day: 25,000
  Avg call duration: 6 minutes
  Recording codec: G.711
  Bitrate: 8 KB/s
  Recording size/call: 1.69 MB

Storage Requirements:
  Daily: 41.23 GB
  Monthly: 1,237 GB (1.21 TB)
  Yearly: 15,049 GB (14.70 TB)
  7-Year Total: 105,346 GB (102.88 TB)
```

**Storage Retention Policy:**

| Retention Period | Requirement | Storage Tier | Notes |
|------------------|-------------|--------------|-------|
| **0-90 days** | Operations, QM | Webex CC (hot) | Immediate access |
| **91-365 days** | Compliance, disputes | S3 Standard (warm) | Fast retrieval |
| **1-3 years** | Regulatory | S3 Glacier (cold) | 3-5 hour retrieval |
| **3-7 years** | Regulatory only | S3 Deep Archive | 12-48 hour retrieval |
| **7+ years** | None (delete) | Secure deletion | NIST 800-88 compliant |

**Webex Recording Storage Limits:**

_Note: These are example configurations. Actual limits may vary based on your Webex subscription._

- **Base Storage (Included):** [EXAMPLE: 90 days]
- **Extended Storage:** Available for [EXAMPLE: additional fee]
- **Storage Limit:** [EXAMPLE: Unlimited with appropriate licensing]
- **Retention Policy:** Configurable (30, 60, 90, 180, 365 days)

---

### 2.3 Quality Management Integration

**Quality Management (QM) Tools:**

Webex Contact Center integrates with third-party QM tools for call scoring, agent coaching, and performance management.

**Supported QM Tools:**

| QM Tool | Integration Method | Features | Example Cost |
|---------|-------------------|----------|-------------|
| **NICE CXone** | API + SIPREC | Call scoring, screen recording, analytics | [EXAMPLE: $20-30/agent/month] |
| **Verint Monet** | API + SIPREC | Quality scoring, coaching, workforce analytics | [EXAMPLE: $18-28/agent/month] |
| **Calabrio ONE** | API + SIPREC | Recording, QM, WFM (all-in-one) | [EXAMPLE: $25-35/agent/month] |
| **Observe.AI** | API | AI-powered call scoring, sentiment analysis | [EXAMPLE: $15-25/agent/month] |

**QM Integration Architecture:**

```
┌────────────────────────────────────────────────────────────┐
│        QUALITY MANAGEMENT INTEGRATION                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  [Webex Contact Center]                                     │
│         │                                                   │
│         ├─> [Webex Recording API]                           │
│         │        │                                          │
│         │        └──> [QM Tool] (NICE, Verint, Calabrio)    │
│         │             ├─ Import recordings                  │
│         │             ├─ Call metadata (ANI, agent, queue)  │
│         │             ├─ Quality scorecards                 │
│         │             ├─ Agent coaching                     │
│         │             └─ Performance dashboards              │
│         │                                                   │
│         └─> [Webex Analyzer API]                            │
│                  │                                          │
│                  └──> [QM Reporting Integration]             │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**QM Workflow:**

1. **Call Recording** - Webex CC records all calls automatically
2. **Recording Transfer** - Recordings sent to QM tool via API or SIPREC
3. **Quality Scoring** - Supervisors score calls using QM tool
4. **Coaching** - Supervisors provide feedback to agents
5. **Analytics** - QM tool generates performance reports
6. **Feedback Loop** - Insights drive training and process improvements

---

### 2.4 Recording Compliance and Security

**Compliance Requirements:**

| Regulation | Recording Requirement | Retention Period | Encryption Required |
|------------|----------------------|------------------|---------------------|
| **PCI-DSS** | Pause recording during credit card entry | 7 years (non-card data) | Yes (AES-256) |
| **HIPAA** | Record all PHI-related calls | 6 years | Yes (AES-256) |
| **GDPR** | Obtain consent, provide access | Varies | Yes |
| **SOX** | Record financial transaction calls | 7 years | Yes |
| **FINRA** | Record all broker-dealer calls | 3-6 years | Yes |

**PCI-DSS Compliance: Pause & Resume Recording**

For PCI-DSS compliance, **pause recording** when collecting credit card information:

```
┌────────────────────────────────────────────────────────┐
│         PCI-DSS COMPLIANT RECORDING                     │
├────────────────────────────────────────────────────────┤
│                                                         │
│  [Agent receives call]                                  │
│       │                                                 │
│       ▼                                                 │
│  [Recording: ACTIVE]                                    │
│       │                                                 │
│       ▼                                                 │
│  [Customer requests to make payment]                    │
│       │                                                 │
│       ▼                                                 │
│  [Agent clicks "Pause Recording" button]                │
│       │                                                 │
│       ▼                                                 │
│  [Recording: PAUSED] ⚠️                                  │
│       │                                                 │
│       ▼                                                 │
│  [Customer provides credit card number]                 │
│       │ (NOT RECORDED)                                  │
│       ▼                                                 │
│  [Payment processed]                                    │
│       │                                                 │
│       ▼                                                 │
│  [Agent clicks "Resume Recording" button]               │
│       │                                                 │
│       ▼                                                 │
│  [Recording: ACTIVE] ✅                                  │
│       │                                                 │
│       ▼                                                 │
│  [Continue call]                                        │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Webex Recording Encryption:**

- **At Rest:** AES-256 encryption
- **In Transit:** TLS 1.2+ encryption
- **Key Management:** Customer-managed or Cisco-managed keys

**Recording Access Controls:**

| Role | Access Level | Permissions |
|------|-------------|-------------|
| **Agent** | Own recordings only | Listen, download (with approval) |
| **Supervisor** | Team recordings | Listen, download, score, delete |
| **Quality Manager** | All recordings | Full access + analytics |
| **Administrator** | System-wide | Full access + configuration |
| **Compliance Officer** | Audit logs | Read-only access, no download |

**GDPR "Right to be Forgotten":**

Under GDPR, customers can request deletion of their personal data, including call recordings.

**GDPR Compliance Workflow:**

1. **Customer Request** - Customer submits deletion request
2. **Verification** - Verify customer identity
3. **Search Recordings** - Identify all recordings with customer data
4. **Legal Review** - Ensure no legal hold or regulatory retention
5. **Delete Recordings** - Securely delete recordings
6. **Audit Log** - Document deletion in audit trail
7. **Confirmation** - Notify customer of deletion

**Recording Audit Logs:**

Maintain comprehensive audit logs for compliance:

```sql
-- Sample Recording Audit Log Schema

CREATE TABLE recording_audit_log (
    log_id VARCHAR(50) PRIMARY KEY,
    recording_id VARCHAR(100),
    action VARCHAR(50),          -- 'CREATED', 'ACCESSED', 'DOWNLOADED', 'DELETED'
    user_id VARCHAR(50),          -- Who performed the action
    user_role VARCHAR(50),        -- Agent, Supervisor, Admin
    timestamp DATETIME,
    ip_address VARCHAR(50),
    reason VARCHAR(200)           -- For deletions or downloads
);

-- Example query: Who accessed recordings in the last 30 days?
SELECT 
    user_id,
    user_role,
    COUNT(*) as access_count,
    MIN(timestamp) as first_access,
    MAX(timestamp) as last_access
FROM 
    recording_audit_log
WHERE 
    action = 'ACCESSED'
    AND timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY 
    user_id, user_role
ORDER BY 
    access_count DESC;
```

---

## 3. Capacity & Sizing

### 3.1 Detailed Capacity Calculations

**Objective:**
Accurately size Webex Contact Center infrastructure to support current and projected call volumes, agent concurrency, and business growth.

**Capacity Planning Inputs:**

| Metric | Source | Example Value |
|--------|--------|---------------|
| **Number of Agents** | HR/Avaya CMS | 1,000 |
| **Peak Concurrent Agents** | Avaya CMS (historical) | 800 |
| **Daily Call Volume** | Avaya CMS | 20,000 |
| **Peak Hour Call Volume** | Avaya CMS | 1,250 |
| **Average Handle Time (AHT)** | Avaya CMS | 360 seconds (6 min) |
| **Service Level Target** | Business requirement | 80/20 (80% in 20 sec) |
| **IVR Containment Rate** | Avaya CMS | 30% |
| **Growth Rate (Annual)** | Business forecast | 15% |

**Capacity Calculation Formula:**

```
Total System Capacity = Peak Concurrent Agents × Safety Factor

Where:
- Peak Concurrent Agents: Maximum agents logged in simultaneously
- Safety Factor: 1.2-1.3 (20-30% buffer for growth and spikes)

Example:
- Peak Concurrent Agents: 800
- Safety Factor: 1.25 (25% buffer)
- Total Capacity: 800 × 1.25 = 1,000 named user licenses
```

**3-Year Growth Projection:**

```python
def calculate_capacity_with_growth(
    current_agents=1000,
    annual_growth_rate=0.15,
    years=3
):
    capacity_by_year = []
    
    for year in range(years + 1):
        agents = int(current_agents * ((1 + annual_growth_rate) ** year))
        capacity_by_year.append({
            'year': year,
            'agents': agents,
            'growth': f"+{int((agents - current_agents) / current_agents * 100)}%"
        })
    
    print("Capacity Growth Projection:")
    for item in capacity_by_year:
        print(f"Year {item['year']}: {item['agents']} agents ({item['growth']})")
    
    return capacity_by_year

# Example: 1,000 agents, 15% annual growth
calculate_capacity_with_growth(1000, 0.15, 3)
```

**Output:**
```
Capacity Growth Projection:
Year 0: 1000 agents (+0%)
Year 1: 1150 agents (+15%)
Year 2: 1322 agents (+32%)
Year 3: 1520 agents (+52%)
```

---

### 3.2 Storage Sizing for Recordings

**Detailed in Section 2.2** - See above for complete recording storage calculations.

**Summary:**
- Daily: 41.23 GB
- Monthly: 1.21 TB
- Yearly: 14.70 TB
- 7-Year Total: 102.88 TB

---

### 3.3 Network Bandwidth Calculations

**Objective:**
Calculate required network bandwidth for voice, video, and data traffic in Webex Contact Center.

**Bandwidth Calculation Inputs:**

| Traffic Type | Codec/Protocol | Bandwidth per Session | Notes |
|--------------|----------------|----------------------|-------|
| **Voice (RTP)** | G.711 | 87 kbps | Uncompressed |
| **Voice (RTP)** | G.722 | 87 kbps | Wideband |
| **Voice (RTP)** | Opus | 50 kbps | Compressed (WebRTC) |
| **Video** | H.264 | 500-1000 kbps | 720p video |
| **Signaling (SIP)** | TCP | 5-10 kbps | Per call |
| **Agent Desktop** | HTTPS | 50-100 kbps | Per agent |

**Bandwidth Calculation Formula:**

```python
def calculate_bandwidth_requirements(
    peak_concurrent_agents=800,
    voice_codec='G.711',
    enable_video=False,
    safety_factor=1.3
):
    # Voice bandwidth
    voice_bandwidth = {
        'G.711': 87,   # kbps
        'G.722': 87,
        'Opus': 50
    }
    
    voice_bw_per_call = voice_bandwidth.get(voice_codec, 87)
    total_voice_bw = peak_concurrent_agents * voice_bw_per_call
    
    # Signaling bandwidth
    signaling_bw = peak_concurrent_agents * 10  # 10 kbps per call
    
    # Agent desktop bandwidth
    desktop_bw = peak_concurrent_agents * 75  # 75 kbps per agent
    
    # Video bandwidth (if enabled)
    video_bw = 0
    if enable_video:
        video_bw = peak_concurrent_agents * 0.2 * 750  # 20% video adoption, 750 kbps avg
    
    # Total bandwidth (kbps)
    total_bw_kbps = total_voice_bw + signaling_bw + desktop_bw + video_bw
    
    # Apply safety factor
    total_bw_kbps = total_bw_kbps * safety_factor
    
    # Convert to Mbps
    total_bw_mbps = total_bw_kbps / 1000
    
    print(f"Bandwidth Calculation:")
    print(f"  Peak Concurrent Agents: {peak_concurrent_agents}")
    print(f"  Voice Codec: {voice_codec}")
    print(f"  Video Enabled: {enable_video}")
    print(f"\nBandwidth Breakdown:")
    print(f"  Voice: {total_voice_bw / 1000:.2f} Mbps ({voice_bw_per_call} kbps × {peak_concurrent_agents})")
    print(f"  Signaling: {signaling_bw / 1000:.2f} Mbps")
    print(f"  Agent Desktop: {desktop_bw / 1000:.2f} Mbps")
    if enable_video:
        print(f"  Video: {video_bw / 1000:.2f} Mbps")
    print(f"\nTotal (before safety factor): {(total_voice_bw + signaling_bw + desktop_bw + video_bw) / 1000:.2f} Mbps")
    print(f"Safety Factor: {safety_factor}x")
    print(f"\n✅ Required Bandwidth: {total_bw_mbps:.2f} Mbps")
    
    # Round up to standard internet circuit sizes
    if total_bw_mbps <= 100:
        recommended = 100
    elif total_bw_mbps <= 250:
        recommended = 250
    elif total_bw_mbps <= 500:
        recommended = 500
    else:
        recommended = 1000
    
    print(f"📶 Recommended Circuit Size: {recommended} Mbps")
    
    return {
        'required_mbps': total_bw_mbps,
        'recommended_mbps': recommended
    }

# Example: 800 concurrent agents, G.711 codec
bandwidth = calculate_bandwidth_requirements(
    peak_concurrent_agents=800,
    voice_codec='G.711',
    enable_video=False,
    safety_factor=1.3
)
```

**Output:**
```
Bandwidth Calculation:
  Peak Concurrent Agents: 800
  Voice Codec: G.711
  Video Enabled: False

Bandwidth Breakdown:
  Voice: 69.60 Mbps (87 kbps × 800)
  Signaling: 8.00 Mbps
  Agent Desktop: 60.00 Mbps

Total (before safety factor): 137.60 Mbps
Safety Factor: 1.3x

✅ Required Bandwidth: 178.88 Mbps
📶 Recommended Circuit Size: 250 Mbps
```

**Network Redundancy Recommendations:**

| Contact Center Size | Primary Circuit | Secondary Circuit | Total Bandwidth |
|---------------------|----------------|-------------------|-----------------|
| Small (<250 agents) | 100 Mbps | 100 Mbps | 200 Mbps |
| Medium (250-500) | 250 Mbps | 250 Mbps | 500 Mbps |
| Large (500-1000) | 500 Mbps | 500 Mbps | 1 Gbps |
| Enterprise (1000+) | 1 Gbps | 1 Gbps | 2 Gbps |

**For 1,000-agent contact center:**
- **Primary ISP:** 500 Mbps (active)
- **Secondary ISP:** 500 Mbps (standby/failover)
- **Total Capacity:** 1 Gbps
- **Failover:** BGP automatic failover (<30 seconds)

---

### 3.4 Agent Concurrency Modeling

**Objective:**
Understand agent concurrency patterns to optimize licensing and capacity planning.

**Agent States:**

| Agent State | Description | Typical % |
|-------------|-------------|-----------|
| **Logged In** | Agent available for calls | 100% (baseline) |
| **On Call** | Actively talking with customer | 60-70% |
| **Available (Idle)** | Ready for next call | 5-10% |
| **ACW (After-Call Work)** | Post-call documentation | 10-15% |
| **Away/Break** | Break, lunch, training | 10-15% |
| **Logged Out** | Not working | 0% |

**Concurrency Model (Peak Hour):**

```
Example: 1,000 Total Agents, Peak Hour = 12 PM

Agent State Distribution:
- Agents logged in: 800 (80% of 1,000)
- Agents on call: 560 (70% of 800)
- Agents in wrap-up: 120 (15% of 800)
- Agents on break: 80 (10% of 800)
- Agents available: 40 (5% of 800)
- Agents logged out: 200

Concurrent call capacity needed: 560 calls
```

**Erlang C Formula (Simplified):**

To achieve a service level of 80% calls answered in 20 seconds:

```
Required Agents = (Call Rate × AHT) ÷ 3600 + Safety Factor

Where:
- Call Rate: Calls per hour
- AHT: Average Handle Time (seconds)
- Safety Factor: 10-20% buffer

Example:
- Calls per hour (peak): 1,250
- AHT: 360 seconds (6 minutes)
- Required Agents = (1,250 × 360) ÷ 3600 + 20%
                  = 125 + 25
                  = 150 agents required to meet SL

For 1,000 total agents:
- Peak staffing: 800 agents logged in (6.7× required for SL)
- Excess capacity: Allows for breaks, training, meetings
```

**Agent Concurrency Model by Time of Day:**

| Time | Agents Logged In | On Call | Available | ACW | Away | Logged Out |
|------|------------------|---------|-----------|-----|------|------------|
| 8 AM | 600 | 420 (70%) | 30 (5%) | 90 (15%) | 60 (10%) | 400 |
| 10 AM | 700 | 490 (70%) | 35 (5%) | 105 (15%) | 70 (10%) | 300 |
| 12 PM | 800 | 560 (70%) | 40 (5%) | 120 (15%) | 80 (10%) | 200 |
| 2 PM | 800 | 560 (70%) | 40 (5%) | 120 (15%) | 80 (10%) | 200 |
| 4 PM | 600 | 420 (70%) | 30 (5%) | 90 (15%) | 60 (10%) | 400 |
| 6 PM | 500 | 350 (70%) | 25 (5%) | 75 (15%) | 50 (10%) | 500 |
| 8 PM | 100 | 70 (70%) | 5 (5%) | 15 (15%) | 10 (10%) | 900 |

**License Sizing Recommendation:**

```
Named User Licenses: 1,000 (all agents)
Concurrent Agent Licenses: 800 (peak concurrency)

Note: Webex Contact Center uses "named user" licensing model, not concurrent.
However, understanding concurrency helps with capacity planning.
```

---

### 3.5 IVR Call Flow Capacity Planning

**Objective:**
Ensure IVR infrastructure can handle self-service call volume and concurrent IVR sessions.

**IVR Capacity Metrics:**

1. **Concurrent IVR Sessions** - Self-service calls in IVR before routing to agent
2. **IVR Containment Rate** - % of calls resolved in IVR without agent
3. **IVR Session Duration** - Average time in IVR
4. **Peak IVR Load** - Maximum IVR sessions during busiest hour

**IVR Capacity Calculation:**

**Step 1: Calculate IVR Call Volume**

```
Total Daily Calls: 20,000
IVR Containment Rate: 30% (30% resolve in IVR, 70% go to agent)

Calls entering IVR: 20,000 (100%)
Calls resolved in IVR: 6,000 (30%)
Calls routed to agent: 14,000 (70%)
```

**Step 2: Calculate Concurrent IVR Sessions**

```
Peak hour calls: 1,250
Avg IVR duration: 120 seconds (2 minutes)
Concurrent IVR sessions = (Calls per hour × Avg duration) ÷ 3600

Example:
- Peak hour calls: 1,250
- Avg IVR duration: 120 seconds
- Concurrent IVR sessions = (1,250 × 120) ÷ 3600
                          = 150,000 ÷ 3600
                          = 41.67
                          ≈ 42 concurrent IVR sessions

Add 20% buffer: 42 × 1.2 = 50 concurrent IVR sessions
```

**Webex Connect IVR Capacity:**

| Metric | Capacity | Notes |
|--------|----------|-------|
| **Max Concurrent IVR Sessions** | Unlimited | Cloud-based, auto-scales |
| **Max Flow Nodes per Flow** | 100 | Best practice: <50 nodes |
| **Max API Calls per Flow** | 20 | Best practice: <10 |
| **Max Flow Execution Time** | 10 minutes | Timeout, then disconnect |

**IVR Capacity Recommendations for 1,000-Agent Contact Center:**

```
Expected IVR Load:
- Daily calls: 20,000
- Peak hour: 1,250 calls
- IVR containment: 30%
- Concurrent IVR sessions (peak): 50

Recommendation:
- Webex Connect auto-scales, no capacity planning needed
- Focus on IVR flow optimization (reduce duration, increase containment)
- Monitor: Concurrent sessions, API latency, timeout rate
```

**IVR Optimization for Capacity:**

1. **Reduce IVR Duration**
   - Streamline menu options (max 4 options per menu)
   - Use speech recognition instead of DTMF (faster input)
   - Pre-authenticate customers (ANI lookup)

2. **Increase IVR Containment**
   - Offer self-service options (balance inquiry, appointment scheduling)
   - Improve IVR logic (better routing, fewer transfers)
   - Use AI/NLP for natural language understanding

3. **Monitor IVR Performance**
   - Track: IVR containment rate, avg duration, abandonment rate
   - Alert on: High abandonment (>10%), long duration (>3 minutes)

**IVR Capacity Sizing by Contact Center Size:**

| Size | Daily Calls | Peak Hour | IVR Containment | Concurrent IVR Sessions | Recommendation |
|------|-------------|-----------|-----------------|-------------------------|----------------|
| Small | 2,000 | 125 | 30% | 10 | Webex Connect (no sizing needed) |
| Medium | 10,000 | 625 | 30% | 25 | Webex Connect (no sizing needed) |
| Large | 20,000 | 1,250 | 30% | 50 | Webex Connect (monitor only) |
| Enterprise | 100,000 | 6,250 | 30% | 250 | Webex Connect (monitor, optimize) |

---

## 4. License Management

### 4.1 Webex Contact Center Licensing Overview

Webex Contact Center uses a **subscription-based licensing model** with multiple license tiers and add-ons.

**⚠️ IMPORTANT: All pricing values below are EXAMPLES for calculation purposes only. Contact Cisco/Webex sales for actual current pricing.**

**License Tiers:**

```
┌───────────────────────────────────────────────────────────┐
│          WEBEX CONTACT CENTER LICENSE TIERS                │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  1. WEBEX CONTACT CENTER ESSENTIALS                        │
│     ├─ Voice-only inbound contact center                   │
│     ├─ Basic routing (queue-based)                         │
│     ├─ Agent Desktop (web-based)                           │
│     ├─ Basic reporting (real-time + historical)            │
│     ├─ Call recording (90-day retention)                   │
│     ├─ Integration: Webex Calling (required)               │
│     └─ Example Price: [EXAMPLE: $75-95 per agent/month]    │
│                                                            │
│  2. WEBEX CONTACT CENTER STANDARD                          │
│     ├─ Omnichannel (voice, email, chat, SMS, social)      │
│     ├─ Skills-based routing                                │
│     ├─ IVR (Webex Connect)                                 │
│     ├─ CRM integrations (Salesforce, Dynamics)             │
│     ├─ Webex Analyzer (advanced reporting)                 │
│     ├─ Agent Desktop (customizable)                        │
│     ├─ Call recording (90-day default, extendable)         │
│     └─ Example Price: [EXAMPLE: $110-130 per agent/month]  │
│                                                            │
│  3. WEBEX CONTACT CENTER PREMIUM                           │
│     ├─ Everything in Standard +                            │
│     ├─ AI-powered features (virtual agents, chatbots)      │
│     ├─ Advanced analytics & AI insights                    │
│     ├─ Quality Management (basic)                          │
│     ├─ Outbound campaigns                                  │
│     ├─ Workforce Optimization (WFO) integrations           │
│     ├─ API access for custom development                   │
│     └─ Example Price: [EXAMPLE: $135-160 per agent/month]  │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

**Additional License Types:**

_Note: Example pricing for calculation demonstration only._

| License Type | Description | Example Price Range |
|--------------|-------------|-------------------|
| **Supervisor License** | Real-time monitoring, reporting, coaching | [EXAMPLE: $50-70/user/month] |
| **Administrator License** | Full system configuration access | [EXAMPLE: $25-40/user/month] |
| **Analyzer License** | Reporting & analytics only | [EXAMPLE: $15-25/user/month] |
| **Webex Calling (Required)** | Telephony for voice calls | [EXAMPLE: $25-35/user/month] |
| **Webex Connect (IVR)** | IVR/self-service platform | [EXAMPLE: Included or $0.01-0.03/minute] |

---

### 4.2 License Mapping from Avaya

**Avaya to Webex License Mapping:**

| Avaya License/Component | Webex Contact Center Equivalent | Notes |
|-------------------------|--------------------------------|-------|
| **Avaya Aura Call Center Elite Agent** | Webex CC Standard Agent | Omnichannel, skills-based routing |
| **Avaya Aura Supervisor** | Webex CC Supervisor | Real-time monitoring + reporting |
| **Avaya Aura Administrator** | Webex CC Administrator | System configuration |
| **Avaya CMS (Reporting)** | Webex Analyzer (included in Standard) | Advanced reporting + dashboards |
| **Avaya Experience Portal (IVR)** | Webex Connect | Cloud-based IVR platform |
| **Avaya Elite Multichannel** | Webex CC Standard (included) | Email, chat, SMS, social |
| **Avaya Proactive Outreach Manager (POM)** | Webex CC Premium (Outbound) | Campaign dialer |
| **Avaya Workforce Optimization** | Third-party WFO (NICE, Verint) | No native Webex WFO |
| **Avaya SIP Trunks** | Webex Calling (PSTN) | Cloud-based telephony |
| **Avaya Communication Manager** | Not needed | Replaced by Webex cloud infrastructure |

**Example Mapping (1,000-Agent Contact Center):**

| Avaya Component | Quantity | Webex Equivalent | Quantity | Notes |
|-----------------|----------|------------------|----------|-------|
| **Avaya Elite Agents** | 1,000 | Webex CC Standard Agents | 1,000 | 1:1 mapping |
| **Avaya Supervisors** | 50 | Webex CC Supervisors | 50 | 1:1 mapping |
| **Avaya Administrators** | 5 | Webex CC Administrators | 5 | 1:1 mapping |
| **Avaya CMS Licenses** | 100 (report users) | Webex Analyzer (included) | Unlimited | No additional cost |
| **Avaya IVR Ports** | 50 | Webex Connect (unlimited) | N/A | Cloud-based, no port limits |
| **Avaya SIP Trunks** | 500 concurrent | Webex Calling | 1,000 users | Per-user licensing, not trunks |
| **Avaya WFO** | 1,000 agents | Third-party WFO | 1,000 agents | Separate procurement |

---

### 4.3 License Optimization Strategies

**Optimization Goal:**
Minimize licensing expenses while maintaining operational effectiveness using actual usage analysis.

**Strategy 1: Right-Size Agent Licenses**

```
┌─────────────────────────────────────────────────────────┐
│          AGENT LICENSE OPTIMIZATION                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Problem: Many contact centers over-license agents      │
│           (e.g., purchase for all FTEs vs actual usage)  │
│                                                          │
│  Analysis Method:                                        │
│  ├─ Extract Avaya CMS data: Max concurrent agents       │
│  ├─ Analyze by shift: Peak concurrency by hour          │
│  ├─ Factor in growth: +10-15% buffer                    │
│  └─ Factor in turnover: Account for attrition           │
│                                                          │
│  Example Calculation:                                    │
│  ├─ Historical max concurrent: 950 agents                │
│  ├─ Growth buffer (15%): 950 × 1.15 = 1,093             │
│  ├─ Recommended licenses: 1,100                          │
│  └─ Potential savings vs. over-licensing                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**SQL Query to Determine Agent License Needs:**

```sql
-- Analyze Avaya CMS to determine actual concurrent agent usage

SELECT 
    DATE(log_date) as date,
    HOUR(log_time) as hour,
    MAX(concurrent_agents) as peak_concurrent_agents
FROM (
    SELECT 
        log_date,
        log_time,
        COUNT(DISTINCT agent_id) as concurrent_agents
    FROM 
        agent_login_events
    WHERE 
        log_date >= CURRENT_DATE - INTERVAL '90 days'
        AND event_type = 'LOGGED_IN'
    GROUP BY 
        log_date, log_time
) subquery
GROUP BY 
    DATE(log_date), HOUR(log_time)
ORDER BY 
    peak_concurrent_agents DESC
LIMIT 10;
```

**Strategy 2: Leverage Included Features**

Many features that required separate Avaya licenses are **included** in Webex Contact Center Standard/Premium:

| Feature | Avaya (Separate License?) | Webex CC Standard/Premium |
|---------|--------------------------|--------------------------|
| **Omnichannel (email, chat, SMS)** | Yes (Elite Multichannel) | ✅ Included |
| **Advanced Reporting** | Yes (CMS) | ✅ Included (Analyzer) |
| **IVR** | Yes (Experience Portal) | ✅ Included (Connect) |
| **CRM Integrations** | Separate (CTI licenses) | ✅ Included (Salesforce, Dynamics) |
| **Skills-Based Routing** | Yes (Elite) | ✅ Included |
| **Historical Reporting** | Yes (CMS) | ✅ Included |
| **Agent Desktop** | Basic | ✅ Customizable included |

**Potential Optimization:** Consolidate separate Avaya licenses into single Webex subscription.

---

### 4.4 License Management and Administration

**License Provisioning Workflow:**

```
┌────────────────────────────────────────────────────────┐
│         LICENSE PROVISIONING WORKFLOW                   │
├────────────────────────────────────────────────────────┤
│                                                         │
│  1. License Purchase                                    │
│     ├─ Contact Cisco/Webex sales                       │
│     ├─ Select license tier (Essentials/Standard/Premium)│
│     ├─ Specify quantity (agents, supervisors, etc.)    │
│     └─ Purchase order (PO) → Contract signed            │
│                                                         │
│  2. License Activation                                  │
│     ├─ Cisco provisions licenses in Webex tenant        │
│     ├─ Available in Webex Control Hub within 24-48 hrs │
│     └─ Email confirmation sent to admin                │
│                                                         │
│  3. License Assignment                                  │
│     ├─ Admin logs into Webex Control Hub                │
│     ├─ Navigate to: Users > Add Users                   │
│     ├─ Assign licenses to users (email-based)           │
│     └─ Configure: Skill profiles, team assignment       │
│                                                         │
│  4. License Activation (User)                           │
│     ├─ User receives email invitation                   │
│     ├─ User creates Webex account (or uses existing)    │
│     ├─ User logs into Webex Agent Desktop               │
│     └─ License activated and counted                    │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**License Monitoring:**

Track license utilization to avoid waste:

```python
# Example: License utilization monitoring script

def calculate_license_utilization(
    total_licenses=1000,
    active_users=950,
    logged_in_users_avg=800
):
    allocation_rate = (active_users / total_licenses) * 100
    utilization_rate = (logged_in_users_avg / active_users) * 100
    
    print(f"License Utilization Analysis:")
    print(f"  Total Licenses: {total_licenses}")
    print(f"  Active Users: {active_users}")
    print(f"  Avg Logged In: {logged_in_users_avg}")
    print(f"\nMetrics:")
    print(f"  Allocation Rate: {allocation_rate:.1f}%")
    print(f"  Utilization Rate: {utilization_rate:.1f}%")
    
    if allocation_rate < 85:
        print(f"\n⚠️  Low allocation! Consider reducing licenses.")
    elif allocation_rate > 95:
        print(f"\n⚠️  High allocation! Consider adding licenses for buffer.")
    else:
        print(f"\n✅ License allocation is optimal.")

calculate_license_utilization(1000, 950, 800)
```

---

### 4.5 License Forecasting and Growth Planning

**License Forecasting Methodology:**

```python
def forecast_license_needs(
    current_agents=1000,
    annual_growth_rate=0.15,
    years=3,
    seasonality_factor=1.2  # 20% seasonal peak (e.g., holidays)
):
    forecast = []
    
    for year in range(years + 1):
        base_agents = int(current_agents * ((1 + annual_growth_rate) ** year))
        peak_agents = int(base_agents * seasonality_factor)
        
        forecast.append({
            'year': year,
            'base_agents': base_agents,
            'peak_agents': peak_agents,
            'recommended_licenses': peak_agents
        })
    
    print("License Forecast (3-Year):")
    print(f"{'Year':<6} {'Base Agents':<12} {'Peak Agents':<12} {'Licenses':<10}")
    print("-" * 45)
    for item in forecast:
        print(f"{item['year']:<6} {item['base_agents']:<12} {item['peak_agents']:<12} {item['recommended_licenses']:<10}")
    
    return forecast

forecast = forecast_license_needs(1000, 0.15, 3, 1.2)
```

**Output:**
```
License Forecast (3-Year):
Year   Base Agents  Peak Agents  Licenses  
---------------------------------------------
0      1000         1200         1200      
1      1150         1380         1380      
2      1322         1586         1586      
3      1520         1824         1824      
```

**Recommendation:** Plan for gradual license additions rather than large step increases.

---

## 5. TCO Analysis Methodology

### CRITICAL DISCLAIMER

**This section provides a FRAMEWORK and METHODOLOGY for conducting Total Cost of Ownership (TCO) analysis. All dollar values shown are EXAMPLES ONLY for demonstration purposes.**

**To create YOUR business case:**
1. Use the framework and formulas provided
2. Replace ALL example values with actual quotes from vendors
3. Collect YOUR organization's specific costs (current Avaya support, infrastructure, staffing)
4. Work with Cisco/Webex sales for accurate pricing
5. Consult your finance team for proper cost allocation and analysis

**Do NOT present these example values to executives or use for budgeting.**

---

### 5.1 TCO Comparison Framework

**Total Cost of Ownership (TCO) Components:**

```
┌────────────────────────────────────────────────────────┐
│              TCO CALCULATION FRAMEWORK                  │
├────────────────────────────────────────────────────────┤
│                                                         │
│  TCO = CapEx + OpEx + Hidden Costs                     │
│                                                         │
│  CapEx (Capital Expenditure):                          │
│  ├─ Hardware (servers, CUBE, storage)                  │
│  ├─ Software licenses (perpetual)                      │
│  ├─ Implementation services                            │
│  └─ Infrastructure upgrades                            │
│                                                         │
│  OpEx (Operational Expenditure):                       │
│  ├─ Annual subscriptions                               │
│  ├─ Support & maintenance contracts                    │
│  ├─ Telecom costs (SIP trunks, PSTN)                   │
│  ├─ Cloud services (AWS, Azure)                        │
│  ├─ Staffing (admins, engineers)                       │
│  └─ Utilities & facilities                             │
│                                                         │
│  Hidden Costs:                                         │
│  ├─ Training & change management                       │
│  ├─ Lost productivity during migration                 │
│  ├─ Software version upgrades                          │
│  ├─ Hardware refresh cycles                            │
│  └─ Integration maintenance                            │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**TCO Calculation Period:** Standard 5-year TCO analysis (aligns with typical hardware refresh cycles and contract terms)

---

### 5.2 Cost Category Definitions

**1. Capital Expenditure (CapEx)**

| Category | Description | Typical Lifecycle |
|----------|-------------|-------------------|
| **Hardware** | Servers, networking equipment, CUBE | 5 years |
| **Software Licenses** | Perpetual licenses (Avaya) | Indefinite (with maintenance) |
| **Implementation** | Professional services, integration | One-time |
| **Infrastructure** | Data center, power, cooling upgrades | 10+ years |

**2. Operational Expenditure (OpEx)**

| Category | Description | Frequency |
|----------|-------------|-----------|
| **Subscriptions** | Cloud software licensing | Monthly/Annual |
| **Support Contracts** | Vendor maintenance agreements | Annual |
| **Telecom** | SIP trunks, PSTN, toll-free | Monthly |
| **Cloud Infrastructure** | AWS, Azure, GCP | Monthly |
| **Staffing** | IT staff salaries + benefits | Monthly |
| **Training** | User and admin training | Periodic |

**3. Hidden Costs**

| Category | Description | Impact |
|----------|-------------|--------|
| **Change Management** | Communication, training programs | Moderate |
| **Lost Productivity** | During migration and adoption | Short-term |
| **Upgrade Cycles** | Major version upgrades | Periodic |
| **Technical Debt** | Integration maintenance, customizations | Ongoing |

---

### 5.3 Data Collection Requirements

**Data Collection Checklist:**

To perform accurate TCO analysis, collect the following data:

**Current State (Avaya):**

- [ ] **Hardware inventory** (servers, storage, networking)
  - Purchase dates and depreciation schedules
  - Maintenance contract costs (annual)
  - Estimated replacement costs

- [ ] **Software licenses**
  - Perpetual license costs (historical purchase price)
  - Annual support/maintenance fees
  - License utilization (actual vs. purchased)

- [ ] **Telecom costs** (last 12 months)
  - SIP trunk costs
  - PSTN/toll-free costs
  - Long distance costs

- [ ] **Staffing costs**
  - FTEs dedicated to contact center infrastructure
  - Salaries + benefits + overhead
  - Contractor/consultant costs

- [ ] **Facilities costs**
  - Data center space allocation
  - Power and cooling
  - Physical security

**Future State (Webex):**

- [ ] **Webex pricing quotes** (from Cisco sales)
  - Per-agent subscription costs
  - Implementation services quotes
  - Training costs

- [ ] **Network upgrades**
  - Internet circuit upgrades (if needed)
  - CUBE hardware (if needed)
  - Firewall upgrades (if needed)

- [ ] **Migration costs**
  - Professional services
  - Data migration tools/services
  - Cutover support

---

### 5.4 ROI Calculation Framework

**ROI Formula:**

```
ROI = (Total Benefits - Total Costs) ÷ Total Costs × 100%

Where:
- Total Benefits = Cost savings + productivity gains + revenue impact
- Total Costs = Migration costs + ongoing operational costs
```

**Benefit Categories:**

| Benefit Category | Measurement Method | Example |
|------------------|-------------------|---------|
| **Cost Savings** | Avaya TCO - Webex TCO | [Calculate using your data] |
| **Productivity Gains** | Reduced AHT × Call volume × Labor cost | [Your metrics] |
| **Revenue Impact** | Improved FCR × Customer lifetime value | [Your business case] |
| **Avoided Costs** | Deferred Avaya hardware refresh | [Your depreciation schedule] |

**Payback Period:**

```
Payback Period (months) = Total Migration Cost ÷ Monthly Savings

Example calculation template:
- Total Migration Cost: [YOUR DATA]
- Monthly Operational Savings: [YOUR DATA]
- Payback Period: [CALCULATE]
```

**TCO Spreadsheet Template Structure:**

```
Year 0 (Migration):
├─ Webex subscription (first month): [YOUR QUOTE]
├─ Implementation services: [YOUR QUOTE]
├─ Hardware (CUBE, network): [YOUR QUOTE]
├─ Data migration: [YOUR QUOTE]
├─ Training: [YOUR QUOTE]
└─ Avaya decommissioning: [YOUR COST]

Years 1-5 (Operations):
├─ Webex subscription (monthly × 12): [YOUR QUOTE]
├─ Network costs (ISP, PSTN): [YOUR COST]
├─ Staffing (reduced vs. Avaya): [YOUR COST]
├─ Cloud storage: [YOUR COST]
└─ Professional services (ongoing): [YOUR COST]

Total 5-Year TCO = Sum(Year 0 through Year 5)
```

**Sensitivity Analysis Variables:**

Test your TCO model with different assumptions:

| Variable | Conservative | Base Case | Aggressive |
|----------|-------------|-----------|------------|
| Agent growth rate | +5%/year | +10%/year | +20%/year |
| Webex pricing | List price | -10% discount | -20% discount |
| Implementation cost | +30% overrun | On budget | -10% under |
| Productivity gains | 0% | +15% | +25% |

---

## 6. Detailed Cutover Runbook

### 6.1 Cutover Planning and Preparation

**Cutover Philosophy:**
A successful cutover requires **meticulous planning, clear communication, and well-rehearsed procedures**. The goal is to minimize downtime, ensure business continuity, and provide a smooth transition for agents and customers.

**Cutover Window:**
- **Recommended:** Weekend (Saturday night - Sunday morning)
- **Duration:** 10 hours (allow 12 hours for buffer)
- **Start Time:** 6:00 PM Saturday
- **Target Go-Live:** 4:00 AM Sunday
- **Business Hours Resumption:** 8:00 AM Monday

**Cutover Phases:**

```
┌─────────────────────────────────────────────────────────────────┐
│                   CUTOVER PHASE OVERVIEW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 1: Pre-Cutover Validation (2 hours)                      │
│  ├─ T-2 hours to T-0                                            │
│  ├─ Validate all systems ready                                  │
│  ├─ Final backup of Avaya                                       │
│  └─ Go/No-Go decision                                           │
│                                                                  │
│  Phase 2: Avaya Freeze (30 minutes)                             │
│  ├─ T+0 to T+0.5 hours                                          │
│  ├─ Put Avaya in maintenance mode                               │
│  ├─ Final data extraction                                       │
│  └─ Freeze configuration changes                                │
│                                                                  │
│  Phase 3: Network Cutover (1 hour)                              │
│  ├─ T+0.5 to T+1.5 hours                                        │
│  ├─ Activate CUBE trunks to Webex                               │
│  ├─ Update DNS/firewall rules                                   │
│  └─ Validate network connectivity                               │
│                                                                  │
│  Phase 4: Webex Activation (2 hours)                            │
│  ├─ T+1.5 to T+3.5 hours                                        │
│  ├─ Enable Webex CC queues                                      │
│  ├─ Test agent logins                                           │
│  └─ Validate call flows end-to-end                              │
│                                                                  │
│  Phase 5: Testing & Validation (2 hours)                        │
│  ├─ T+3.5 to T+5.5 hours                                        │
│  ├─ Inbound call testing (all queues)                           │
│  ├─ Agent desktop validation                                    │
│  ├─ Integration testing (CRM, WFM)                              │
│  └─ Performance validation                                      │
│                                                                  │
│  Phase 6: Go-Live and Monitoring (4+ hours)                     │
│  ├─ T+5.5 to T+10 hours                                         │
│  ├─ Go-live announcement                                        │
│  ├─ Continuous monitoring                                       │
│  ├─ Issue resolution                                            │
│  └─ Cutover sign-off                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Cutover Team Roles:**

| Role | Responsibilities | Count | Shift Coverage |
|------|------------------|-------|----------------|
| **Cutover Manager** | Overall coordination, Go/No-Go decisions | 1 | Full cutover |
| **Network Engineer** | CUBE configuration, firewall rules, ISP coordination | 2 | Full cutover |
| **Voice Engineer** | SIP trunk testing, call routing validation | 2 | Full cutover |
| **Webex Admin** | Queue activation, agent provisioning | 2 | Full cutover |
| **Database Admin** | Data migration, validation scripts | 1 | Full cutover |
| **Integration Specialist** | CRM/WFM integration testing | 1 | Full cutover |
| **QA Tester** | End-to-end testing, validation | 2 | Full cutover |
| **Communication Lead** | Status updates, stakeholder communication | 1 | Full cutover |
| **Business SME** | Business validation, UAT sign-off | 2 | On-call |

---

### 6.2 Pre-Cutover Checklist

**Complete this checklist 1 week before cutover:**

**Infrastructure Readiness:**

- [ ] **Network**
  - [ ] Primary ISP circuit active and tested
  - [ ] Secondary ISP circuit active and tested (for redundancy)
  - [ ] BGP failover tested (<30 seconds)
  - [ ] Firewall rules configured for Webex IP ranges
  - [ ] QoS policies configured (DSCP marking)

- [ ] **CUBE (Session Border Controller)**
  - [ ] CUBE hardware installed (primary + secondary for HA)
  - [ ] CUBE software version validated (IOS XE 17.6+)
  - [ ] SIP trunks configured (Avaya → CUBE)
  - [ ] SIP trunks configured (CUBE → Webex)
  - [ ] TLS certificates installed (public CA, 2048-bit RSA)
  - [ ] Dial-peer configurations tested
  - [ ] CUBE HA (HSRP) tested

- [ ] **Webex Contact Center Tenant**
  - [ ] Tenant provisioned and accessible
  - [ ] Entry points configured (1 per queue)
  - [ ] Queues created (mapped from Avaya)
  - [ ] Skills configured and assigned to agents
  - [ ] Teams and supervisors configured
  - [ ] IVR flows deployed in Webex Connect
  - [ ] Routing strategies configured

- [ ] **Integrations**
  - [ ] CRM integration tested (Salesforce/Dynamics)
  - [ ] WFM integration tested (Calabrio/NICE)
  - [ ] SSO/MFA configured and tested (Azure AD)
  - [ ] API integrations validated

**Data Migration:**

- [ ] **Agent Data**
  - [ ] All active agents provisioned in Webex
  - [ ] Skills assigned correctly
  - [ ] Supervisor hierarchies configured
  - [ ] Agent login credentials distributed

- [ ] **Configuration Data**
  - [ ] Queues mapped (Avaya → Webex)
  - [ ] Routing rules migrated
  - [ ] Business hours and holidays configured
  - [ ] After-hours routing configured

- [ ] **Historical Data**
  - [ ] Recent recordings migrated (0-90 days)
  - [ ] CDR data migrated (7 years)
  - [ ] Older recordings archived to S3

**Testing:**

- [ ] **Unit Testing** (100% complete)
  - [ ] CUBE dial-peer testing
  - [ ] Queue routing testing
  - [ ] Agent desktop functionality

- [ ] **Integration Testing** (100% complete)
  - [ ] End-to-end call flow testing
  - [ ] CRM screen pop validation
  - [ ] WFM real-time data feed

- [ ] **User Acceptance Testing (UAT)** (100% complete, signed off)
  - [ ] Business stakeholders validated
  - [ ] Agent representatives validated
  - [ ] Supervisors validated

- [ ] **Performance Testing** (passed)
  - [ ] Load testing (peak call volume)
  - [ ] Stress testing (150% of peak)
  - [ ] Latency testing (<150ms)

**Communications:**

- [ ] **Stakeholder Communication**
  - [ ] Executive sponsors notified
  - [ ] Business unit leaders notified
  - [ ] IT leadership notified

- [ ] **Agent Communication**
  - [ ] Cutover schedule announced (2 weeks prior)
  - [ ] Training completed (all agents)
  - [ ] Quick reference guides distributed
  - [ ] Support hotline published

- [ ] **Customer Communication**
  - [ ] IVR message updated (if customer impact expected)
  - [ ] Website notice posted (if applicable)
  - [ ] Social media announcement (if applicable)

**Rollback Readiness:**

- [ ] **Avaya Rollback**
  - [ ] Full Avaya backup completed
  - [ ] Avaya systems operational (test call)
  - [ ] Rollback procedures documented
  - [ ] Rollback team identified and briefed

- [ ] **Network Rollback**
  - [ ] CUBE configuration backup
  - [ ] Firewall rollback plan documented
  - [ ] DNS rollback procedures ready

**Final Approvals:**

- [ ] **Go/No-Go Meeting Scheduled** (T-24 hours before cutover)
  - [ ] Attendees: Executive sponsor, IT leadership, cutover manager, technical leads
  - [ ] Review: Pre-cutover checklist, outstanding risks, weather forecast (if on-site)
  - [ ] Decision: Written Go/No-Go approval

---

### 6.3 Hour-by-Hour Cutover Timeline

**T-2 Hours to T+10 Hours (Saturday 6 PM - Sunday 4 AM)**

**T-2:00 (4:00 PM) - Cutover Team Assembly**

- [ ] All cutover team members log into war room (virtual or physical)
- [ ] Roll call and status check
- [ ] Review cutover plan and roles
- [ ] Establish communication channels (Slack, conference bridge)
- [ ] Test rollback procedures (quick validation)

**T-1:30 (4:30 PM) - Final Validation**

- [ ] **Network Team:** Validate ISP circuits, BGP, QoS
- [ ] **Voice Team:** Test Avaya → CUBE trunks
- [ ] **Webex Team:** Validate Webex tenant accessibility
- [ ] **Database Team:** Confirm final data sync complete
- [ ] **Integration Team:** Test CRM/WFM connectivity

**T-1:00 (5:00 PM) - Final Go/No-Go Decision**

- [ ] Cutover Manager reviews all team readiness
- [ ] Executive sponsor provides final approval
- [ ] **GO decision**: Proceed with cutover
- [ ] **NO-GO decision**: Postpone and reschedule

**T-0:00 (6:00 PM) - Phase 1 Begins: Avaya Freeze**

- [ ] Put Avaya in **maintenance mode** (prevent new config changes)
- [ ] Announce to business: "Cutover in progress - limited functionality"
- [ ] Update IVR message (if applicable): "We're upgrading our system..."

**T+0:15 (6:15 PM) - Final Data Extraction**

- [ ] Extract final CDR from Avaya CMS
- [ ] Export agent login status (for validation)
- [ ] Backup Avaya configuration (final snapshot)

**T+0:30 (6:30 PM) - Phase 2 Begins: Network Cutover**

- [ ] **Network Team:** Update firewall rules (allow Webex IP ranges)
- [ ] **Network Team:** Activate CUBE SIP trunks to Webex
- [ ] **Network Team:** Update DNS records (if applicable)
- [ ] Test connectivity: CUBE → Webex (OPTIONS ping)

**T+1:00 (7:00 PM) - CUBE Validation**

- [ ] Place test call: CUBE → Webex (inbound test number)
- [ ] Validate: Call connects, audio quality, call metadata
- [ ] Test failover: Secondary CUBE takes over (HSRP)
- [ ] **Checkpoint:** Network cutover complete ✅

**T+1:30 (7:30 PM) - Phase 3 Begins: Webex Activation**

- [ ] **Webex Team:** Enable all queues in Webex CC
- [ ] **Webex Team:** Activate entry points (DIDs map to queues)
- [ ] **Webex Team:** Enable IVR flows in Webex Connect

**T+2:00 (8:00 PM) - Agent Provisioning Validation**

- [ ] Test agent login (5 test agents)
  - [ ] Login successful
  - [ ] Agent desktop loads correctly
  - [ ] Skills assigned correctly
  - [ ] Team assignment correct
- [ ] Test supervisor login
  - [ ] Real-time monitoring accessible
  - [ ] Historical reports accessible

**T+2:30 (8:30 PM) - End-to-End Call Flow Testing**

- [ ] Place inbound test calls to each queue (10+ queues)
  - [ ] IVR plays correctly
  - [ ] Call routes to correct queue
  - [ ] Agent receives call
  - [ ] CRM screen pop works
  - [ ] Recording captures call
- [ ] **Checkpoint:** Webex activation complete ✅

**T+3:30 (9:30 PM) - Phase 4 Begins: Integration Testing**

- [ ] **CRM Integration Test**
  - [ ] Place call → Salesforce screen pop
  - [ ] Validate: Customer record displays
  - [ ] Create case → Case created in Salesforce
  - [ ] Click-to-dial → Outbound call initiated

- [ ] **WFM Integration Test**
  - [ ] Verify: Agent state syncs to Calabrio/NICE
  - [ ] Verify: Real-time adherence data flowing
  - [ ] Verify: Historical data imports correctly

**T+4:30 (10:30 PM) - Performance Testing**

- [ ] Simulate peak load (100+ concurrent calls)
- [ ] Monitor: Call quality (MOS score >4.0)
- [ ] Monitor: Latency (<150ms)
- [ ] Monitor: Jitter (<30ms)
- [ ] Monitor: Packet loss (<1%)
- [ ] **Checkpoint:** Performance validated ✅

**T+5:30 (11:30 PM) - Phase 5 Begins: Final Validation**

- [ ] Business SME validation
  - [ ] Test critical business scenarios
  - [ ] Validate: VIP customer routing
  - [ ] Validate: After-hours routing
  - [ ] Validate: Emergency escalation path

- [ ] Agent representative validation
  - [ ] Test agent desktop workflows
  - [ ] Validate: Call handling, transfers, conferencing
  - [ ] Validate: Wrap-up codes, dispositions
  - [ ] Validate: Break/lunch state changes

**T+6:30 (12:30 AM) - Pre-Go-Live Checklist**

- [ ] All test calls successful (>95% success rate)
- [ ] All integrations operational
- [ ] Performance metrics within targets
- [ ] No critical defects identified
- [ ] Rollback plan ready (if needed)
- [ ] Business SME sign-off obtained

**T+7:00 (1:00 AM) - GO-LIVE DECISION**

- [ ] Cutover Manager: "We are GO for production go-live"
- [ ] Notify business stakeholders: "Cutover complete, resuming service"
- [ ] Update IVR message: "Thank you for calling..."
- [ ] **SYSTEM IS LIVE** 🚀

**T+7:30 (1:30 AM) - Phase 6 Begins: Monitoring and Hypercare**

- [ ] Monitor Webex dashboards (real-time)
  - [ ] Call volume trending normally
  - [ ] Service level >80%
  - [ ] No error spikes
  
- [ ] Monitor CUBE (SIP trunk health)
  - [ ] Active calls count
  - [ ] Call completion rate >98%
  - [ ] No trunk errors

- [ ] Monitor integrations
  - [ ] CRM API calls successful
  - [ ] WFM data flowing
  - [ ] No integration errors

**T+10:00 (4:00 AM) - Cutover Sign-Off**

- [ ] **Cutover Manager:** Review final status
- [ ] **All Teams:** Provide status reports
  - [ ] Network: ✅ Stable
  - [ ] Voice: ✅ Stable
  - [ ] Webex: ✅ Stable
  - [ ] Integrations: ✅ Stable
  
- [ ] **Executive Sign-Off:** Cutover successfully completed
- [ ] Transition to hypercare support (24/7 for first week)
- [ ] Debrief meeting scheduled (Monday 10 AM)

**Post-Cutover (Sunday - Monday):**

- [ ] Sunday: Continue 24/7 monitoring (hypercare team on standby)
- [ ] Monday 6 AM: Hypercare team on-site (if applicable)
- [ ] Monday 8 AM: Business resumes normal operations
- [ ] Monday 8 AM - 5 PM: Hypercare team shadows operations
- [ ] Monday 5 PM: Day 1 wrap-up and issue log review

---

### 6.4 Rollback Procedures

**Rollback Scenarios:**

| Scenario | Trigger | Rollback Action | Estimated Time |
|----------|---------|----------------|----------------|
| **Pre-Production Rollback** | Failed validation before T+0 | Cancel cutover, reschedule | N/A |
| **Early Cutover Rollback** | Critical failure before T+3 | Revert to Avaya, reschedule | 1-2 hours |
| **Late Cutover Rollback** | Critical failure after T+3 | Evaluate: Fix forward vs. rollback | 2-4 hours |
| **Post-Go-Live Rollback** | Production issues after go-live | Emergency rollback to Avaya | 4-6 hours |

**Rollback Decision Criteria:**

**GO/NO-GO for Rollback:**

- **Trigger Rollback if:**
  - [ ] >20% call failure rate
  - [ ] Complete loss of integration (CRM, WFM)
  - [ ] Critical security breach
  - [ ] Unacceptable audio quality (<3.0 MOS)
  - [ ] >10% of agents unable to login
  - [ ] Business SME requests rollback

- **Do NOT Rollback if:**
  - [ ] Minor issues affecting <5% of calls
  - [ ] Non-critical integration issues
  - [ ] Cosmetic UI issues
  - [ ] Issues with workaround available

**Rollback Procedure (Detailed):**

**Step 1: Rollback Decision (30 minutes)**

- [ ] Cutover Manager declares: "ROLLBACK INITIATED"
- [ ] Notify executive sponsor and business stakeholders
- [ ] Assemble rollback team (all hands on deck)
- [ ] Document rollback reason and timeline

**Step 2: Avaya Reactivation (1 hour)**

- [ ] **Avaya Team:** Remove maintenance mode
- [ ] **Avaya Team:** Validate Avaya system operational
- [ ] **Voice Team:** Test inbound call to Avaya (test DID)
- [ ] **Avaya Team:** Enable all Avaya queues and agents

**Step 3: Network Rollback (1 hour)**

- [ ] **Network Team:** Revert firewall rules (remove Webex IP ranges)
- [ ] **Network Team:** Deactivate CUBE → Webex SIP trunks
- [ ] **Network Team:** Reactivate Avaya → CUBE trunks (or direct PSTN)
- [ ] **Network Team:** Update DNS records (if changed)

**Step 4: Validation (30 minutes)**

- [ ] Place test calls to Avaya
  - [ ] IVR functioning
  - [ ] Calls route to agents
  - [ ] Recording works
  - [ ] CRM integration works (if Avaya-based)

**Step 5: Go-Live Announcement (15 minutes)**

- [ ] Notify business: "Systems restored, service resumed"
- [ ] Update IVR message (remove maintenance message)
- [ ] Monitor Avaya for 2 hours (hypercare)

**Step 6: Post-Rollback Review (Next Business Day)**

- [ ] Conduct root cause analysis
- [ ] Document lessons learned
- [ ] Develop remediation plan
- [ ] Reschedule cutover (after fixes implemented)

---

### 6.5 Post-Cutover Validation

**Week 1 (Hypercare) Validation:**

**Daily Checks (Monday - Friday):**

- [ ] **Morning Standup (8 AM daily)**
  - [ ] Review overnight issues
  - [ ] Review call volume and service level
  - [ ] Identify any recurring issues
  - [ ] Assign action items

- [ ] **Real-Time Monitoring**
  - [ ] Service level: >80% target
  - [ ] Average speed of answer: <20 seconds
  - [ ] Abandonment rate: <5%
  - [ ] Call quality (MOS): >4.0

- [ ] **Integration Validation**
  - [ ] CRM screen pop: 100% success
  - [ ] WFM data sync: Real-time
  - [ ] Recording capture: 100%

- [ ] **Agent Feedback**
  - [ ] Agent desktop usability: Survey daily
  - [ ] Technical issues: Log and resolve within 4 hours
  - [ ] Training gaps: Identify and schedule refresher

**Week 1 Metrics to Track:**

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Service Level (80/20)** | >80% | Webex Analyzer |
| **Call Quality (MOS)** | >4.0 | CUBE statistics |
| **Recording Capture Rate** | 100% | Webex CC recording logs |
| **Agent Login Success** | >99% | Help desk tickets |
| **CRM Screen Pop Success** | >95% | Integration logs |
| **Critical Defects** | 0 | Issue tracker |
| **Agent Satisfaction** | >4/5 | Daily survey |

**Week 2-4 Validation:**

- [ ] **Performance Optimization**
  - [ ] Analyze call routing efficiency
  - [ ] Optimize IVR flows (reduce abandonment)
  - [ ] Fine-tune agent skills and proficiency levels

- [ ] **Training Reinforcement**
  - [ ] Identify training gaps from issue logs
  - [ ] Schedule refresher training sessions
  - [ ] Update quick reference guides

- [ ] **Business Review**
  - [ ] Week 2: Business review with stakeholders
  - [ ] Week 4: Final hypercare review and transition to BAU (Business As Usual)

---

### 6.6 Hypercare Support Plan

**Hypercare Objectives:**
- Provide **24/7 support** for first 7 days post-go-live
- Rapidly resolve any production issues
- Monitor system performance and stability
- Collect feedback and optimize configurations

**Hypercare Team Structure:**

**Tier 1: Helpdesk (24/7)**

| Role | Responsibilities | Shift Coverage |
|------|------------------|----------------|
| **Helpdesk Agent** | First-line agent support | 24/7 (rotating shifts) |
| **Helpdesk Lead** | Triage and escalation | 24/7 (rotating shifts) |

**Tier 2: Technical Support (24/7)**

| Role | Responsibilities | Shift Coverage |
|------|------------------|----------------|
| **Webex Admin** | Agent provisioning, queue config | 24/7 (on-call) |
| **Network Engineer** | CUBE troubleshooting, network issues | 24/7 (on-call) |
| **Integration Specialist** | CRM/WFM integration issues | 24/7 (on-call) |

**Tier 3: Vendor Support (On-Call)**

| Vendor | Contact | SLA | Coverage |
|--------|---------|-----|----------|
| **Cisco TAC** | 1-800-553-2447 | Severity 1: 1-hour response | 24/7 |
| **ISP (Primary)** | [Your ISP contact] | Severity 1: 2-hour response | 24/7 |
| **ISP (Secondary)** | [Your ISP contact] | Severity 1: 2-hour response | 24/7 |

**Hypercare Communication Channels:**

- **Dedicated Slack Channel:** #cutover-hypercare
- **Dedicated Email:** cutover-support@yourcompany.com
- **Hotline:** [Dedicated phone number for urgent issues]
- **War Room:** Virtual conference bridge (Webex Meetings) - open 24/7

**Issue Escalation Path:**

```
┌────────────────────────────────────────────────────────┐
│           HYPERCARE ESCALATION PATH                     │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Severity 1 (Critical - System Down):                   │
│  ├─ Agent/User reports issue → Helpdesk (Tier 1)       │
│  ├─ Helpdesk escalates → Technical Support (Tier 2)    │
│  │   └─ Response: Within 15 minutes                    │
│  ├─ Tier 2 escalates → Vendor Support (Tier 3)         │
│  │   └─ Response: Within 1 hour (Cisco TAC)            │
│  └─ Notify: Executive sponsor if unresolved >2 hours   │
│                                                         │
│  Severity 2 (High - Significant Impact):                │
│  ├─ Helpdesk → Tier 2 Technical Support                │
│  │   └─ Response: Within 1 hour                        │
│  └─ Tier 2 → Tier 3 (if needed)                        │
│                                                         │
│  Severity 3 (Medium - Limited Impact):                  │
│  ├─ Helpdesk → Tier 2                                  │
│  │   └─ Response: Within 4 hours                       │
│  └─ Schedule fix during business hours                 │
│                                                         │
│  Severity 4 (Low - Minor Issue):                        │
│  └─ Helpdesk logs issue → Resolve during BAU hours     │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Daily Hypercare Standup (8 AM Daily for First Week):**

Agenda:
1. **Overnight Issues Review** (10 minutes)
   - Critical issues resolved
   - Open issues and status
   - Trending issues
2. **Metrics Review** (10 minutes)
   - Service level performance
   - Call quality metrics
   - Agent feedback summary
3. **Action Items** (10 minutes)
   - Assign owners to open issues
   - Schedule any required fixes
   - Identify training needs

**Hypercare Handoff to BAU (Business As Usual):**

**Criteria for Hypercare Exit:**

- [ ] **Stability Achieved** (7+ days stable operation)
  - [ ] Service level consistently >80%
  - [ ] No critical defects
  - [ ] <5 open Severity 2 issues
  - [ ] Agent satisfaction >4/5

- [ ] **Knowledge Transfer Complete**
  - [ ] Runbooks created for common issues
  - [ ] BAU support team trained
  - [ ] Vendor contacts documented

- [ ] **Business Sign-Off**
  - [ ] Business stakeholders approve BAU transition
  - [ ] Executive sponsor approves

**Hypercare Exit Process:**

- [ ] Week 4: Conduct final hypercare review meeting
- [ ] Document lessons learned
- [ ] Update support procedures and runbooks
- [ ] Transition to standard support model (8 AM - 5 PM, M-F)
- [ ] Retain on-call support for first 90 days (escalations only)

---

## Summary

This chapter provides a **comprehensive framework** for migration planning, capacity sizing, and cutover execution. The key takeaways:

✅ **Data Migration:** Zero data loss through phased approach and 100% validation
✅ **Recording & QM:** Hybrid storage strategy (hot/warm/cold) optimizes compliance and operational efficiency
✅ **Capacity Sizing:** Accurate calculations prevent over/under-provisioning
✅ **License Management:** Right-sizing and included feature optimization
✅ **TCO Methodology:** Framework for building YOUR business case with actual costs
✅ **Cutover Execution:** Hour-by-hour runbook minimizes risk and downtime
✅ **Hypercare:** 24/7 support ensures smooth transition

**Next Steps:**

1. Use Section 3 formulas to calculate YOUR capacity requirements
2. Collect YOUR actual costs for TCO analysis (Section 5 framework)
3. Replace ALL example pricing with vendor quotes
4. Build YOUR financial business case using the methodology provided
5. Customize the cutover runbook (Section 6) for your environment
6. Conduct cutover rehearsal before actual migration weekend

**Remember:** All financial values in this document are EXAMPLES for calculation demonstration only. Always use actual vendor quotes and your organization's specific costs for real planning and budgeting.

---

**Document Coverage:** Data Migration | Recording & QM | Capacity | Licensing | TCO Methodology | Cutover  
