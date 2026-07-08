# AI-Ready Network Implementation Guide


---


## 1. IMPLEMENTATION OVERVIEW

### 1.1 Prerequisites Verification

**Phase 1 & 2 Completion Checklist:**

| Prerequisite | Verification Method | Status | Required Value |
|-------------|-------------------|--------|----------------|
| **Phase 1 Complete** | ISE pxGrid enabled | [X] | Verified |
| **Phase 1 Complete** | XDR platform operational | [X] | Verified |
| **Phase 1 Complete** | Duo Beyond deployed | [X] | Verified |
| **Phase 1 Complete** | FTD firewalls migrated | [X] | 18 units |
| **Phase 2 Complete** | Splunk Observability operational | [X] | 100 GB/day ingestion |
| **Phase 2 Complete** | ThousandEyes agents deployed | [X] | 6 agents active |
| **Phase 2 Complete** | AppDynamics APM configured | [X] | 5 apps instrumented |
| **Phase 2 Complete** | 14-Day Baseline Collected | [X] | **CRITICAL** |
| **DNAC Version** | Current version check | [X] | 2.3.7.6 |
| **DNAC Cluster Health** | All 3 nodes operational | [X] | 3/3 nodes green |
| **Storage Availability** | DNAC storage capacity | [X] | >50% free |
| **Backup Status** | Recent full backup | [X] | <7 days old |

**Critical Validation: 14-Day Baseline**

```bash
# Verify baseline data availability in Splunk
index=dnac_assurance earliest=-14d | stats count by _time | table _time count

# Expected result: Continuous data for 14+ days, no gaps >4 hours
# Minimum events: ~40GB/day x 14 days = 560 GB total

# Verify ThousandEyes data
index=thousandeyes earliest=-14d | stats count by test_name | table test_name count

# Expected result: All 25 tests with data for 14+ days

# Verify AppDynamics data
index=appdynamics earliest=-14d | stats count by app_name | table app_name count

# Expected result: All 5 apps with APM traces for 14+ days
```

### 1.2 Implementation Team

**Roles & Responsibilities:**

| Role | Name | Responsibilities | Availability |
|------|------|-----------------|--------------|
| **Project Manager** | TBD | Overall project coordination, stakeholder management | Full-time (16 weeks) |
| **Network Architect** | TBD | Catalyst Center upgrade, DNM configuration | Full-time (Weeks 1-8) |
| **Security Architect** | TBD | AgenticOps guardrails, XDR integration | Part-time (as needed) |
| **Automation Engineer** | TBD | Workflow YAML development, API integrations | Full-time (Weeks 9-16) |
| **NOC Team Lead** | TBD | Operational procedures, training | Part-time (Weeks 13-16) |
| **Cisco TAC Support** | Assigned | Catalyst Center upgrade support | On-demand |
| **AppDynamics Support** | Assigned | Cognition Engine integration | On-demand |

### 1.3 High-Level Timeline

```
+============================================================================+
|                 PHASE 3: AI-READY NETWORK (16 WEEKS)                      |
+============================================================================+
|                                                                            |
|  PHASE 3A: CATALYST CENTER UPGRADE (Weeks 1-4)                            |
|  --------------------------------------------------------                  |
|  Week 1: Staging environment build & testing                              |
|  Week 2: Production cluster upgrade (NJ)                                  |
|  Week 3: AI Assistant & AIEA enablement                                   |
|  Week 4: DR cluster upgrade (London), ISE sync validation                 |
|                                                                            |
|  Deliverables:                                                             |
|  [X] Catalyst Center 2.3.5+ operational                                   |
|  [X] AI Assistant enabled for NOC                                         |
|  [X] AI Endpoint Analytics feeding ISE                                    |
|                                                                            |
|  --------------------------------------------------------------------------|
|                                                                            |
|  PHASE 3B: DEEP NETWORK MODEL (Weeks 5-8)                                 |
|  ------------------------------------------------                          |
|  Week 5: DNM configuration, baseline validation                           |
|  Week 6-7: ML model training (5 models)                                   |
|  Week 8: Model validation, threshold tuning                               |
|                                                                            |
|  Deliverables:                                                             |
|  [X] 5 DNM models trained and operational                                 |
|  [X] Anomaly detection active                                             |
|  [X] Failure predictions (14-day horizon)                                 |
|                                                                            |
|  --------------------------------------------------------------------------|
|                                                                            |
|  PHASE 3C: AGENTICOPS OBSERVE (Weeks 9-12)                                |
|  --------------------------------------------------                        |
|  Week 9-10: AgenticOps framework setup, WF-001 to WF-004                  |
|  Week 10-11: WF-005 to WF-008, API credentials                            |
|  Week 11-12: Guardrails configuration, 2-week observation                 |
|                                                                            |
|  Deliverables:                                                             |
|  [X] 8 workflows operational (Observe mode)                               |
|  [X] Guardrails validated (SGT 11, 60, 80-83 protected)                  |
|  [X] Recommendation logs (2 weeks of data)                                |
|                                                                            |
|  --------------------------------------------------------------------------|
|                                                                            |
|  PHASE 3D: AGENTICOPS AUTO (Weeks 13-16)                                  |
|  -----------------------------------------------                           |
|  Week 13-14: WF-001, WF-002, WF-007 -> Auto mode                          |
|  Week 14: WF-005, WF-006 -> Approve mode                                  |
|  Week 15: ServiceNow change control integration                           |
|  Week 16: Documentation, NOC training, handover                           |
|                                                                            |
|  Deliverables:                                                             |
|  [X] 3 workflows in Auto mode                                             |
|  [X] 2 workflows in Approve mode                                          |
|  [X] ServiceNow integration operational                                   |
|  [X] NOC team trained and certified                                       |
|                                                                            |
+============================================================================+
```

---

## 2. BILL OF MATERIALS & LICENSING

### 2.1 Software Licensing

**NOTE:** All pricing is illustrative and subject to vendor quote. Contact vendors directly for current pricing.

**Catalyst Center AI Licensing:**

| License Type | Quantity | Unit | Notes |
|-------------|----------|------|-------|
| DNA Advantage (to Catalyst AI Advantage) | 854 devices | Network device | Upgrade from existing DNA Advantage |
| Catalyst Center AI Assistant | 3-node cluster | Cluster | Included with AI Advantage |
| AI Endpoint Analytics | 12,000 endpoints | Endpoint | Included with AI Advantage |
| Deep Network Model | 854 devices | Network device | Included with AI Advantage |

**Procurement Process:**

```
1. Contact Cisco Sales Rep (Abhavtech Account Team)
2. Provide current DNA Advantage contract number
3. Request upgrade quote: DNA Advantage -> Catalyst AI Advantage
4. Expected discount: 20-30% (existing customer)
5. Lead time: 2-4 weeks (license key generation)
6. Procurement method: Cisco CCW (Commerce Workspace)
```

**AgenticOps Platform:**

| Component | Licensing Model | Notes |
|-----------|----------------|-------|
| Catalyst Center API | Included | No additional cost |
| vManage API | Included | SD-WAN license |
| ISE pxGrid | Included | ISE Apex license |
| Splunk API | Included | Part of Observability Cloud |
| ThousandEyes API | Included | Enterprise agent license |
| AppDynamics API | Included | APM Pro license |
| ServiceNow Integration | ServiceNow license | ITOM/ITSM license required |

**Total Software Investment (Incremental):**

```
Catalyst AI Advantage Upgrade: [Contact Cisco for Quote]
- Estimated: $X per network device
- Total estimated: 854 devices

ServiceNow ITOM Add-on (if not already licensed): [Contact ServiceNow for Quote]
- Estimated: $X per month

TOTAL ESTIMATED SOFTWARE COST: [Contact Vendors]
```

### 2.2 Hardware Requirements

**Catalyst Center Cluster (Existing):**

| Component | Model | Quantity | Location | Status |
|-----------|-------|----------|----------|--------|
| Primary Cluster | DN2-HW-APL-XL | 3 nodes | New Jersey | [X] Existing |
| DR Cluster | DN2-HW-APL-XL | 3 nodes | London | [X] Existing |

**Hardware Specifications (DN2-HW-APL-XL):**

```
+============================================================================+
|              CATALYST CENTER APPLIANCE SPECIFICATIONS                      |
+============================================================================+
|                                                                            |
|  Model: DN2-HW-APL-XL (Extra Large Appliance)                             |
|                                                                            |
|  Capacity:                                                                 |
|  * Network Devices: Up to 8,000                                            |
|  * Endpoints: Up to 200,000                                                |
|  * Access Points: Up to 16,000                                             |
|  * Sites: Up to 500                                                        |
|                                                                            |
|  Hardware:                                                                 |
|  * CPU: 56 cores (Intel Xeon)                                              |
|  * Memory: 512 GB RAM                                                      |
|  * Storage: 12 TB SSD (RAID 10)                                            |
|  * Network: 4 x 10 GbE, 2 x 1 GbE                                          |
|                                                                            |
|  High Availability:                                                        |
|  * 3-node cluster (Primary, Secondary, Tertiary)                           |
|  * Automatic failover                                                      |
|  * Data replication across nodes                                           |
|                                                                            |
|  AI Capabilities:                                                          |
|  * AI Assistant: Supported                                                 |
|  * AI Endpoint Analytics: Supported                                        |
|  * Deep Network Model: Supported                                           |
|  * ML Training: GPU-accelerated                                            |
|                                                                            |
|  Abhavtech Current Utilization:                                            |
|  * Network Devices: 854 / 8,000 (10.7%)                                    |
|  * Endpoints: 12,000 / 200,000 (6%)                                        |
|  * Access Points: 450 / 16,000 (2.8%)                                      |
|  * Storage: 5.6 TB / 36 TB (15.5%)                                         |
|  -> Well within capacity, no hardware upgrade required                     |
|                                                                            |
+============================================================================+
```

**No Additional Hardware Required:**

All Phase 3 capabilities are enabled through software licensing upgrades to the existing Catalyst Center infrastructure. The DN2-HW-APL-XL appliances have sufficient capacity for AI workloads.

### 2.3 Network Requirements

**Bandwidth Requirements (AgenticOps API Traffic):**

| Integration | API Traffic Volume | Frequency | Notes |
|-------------|-------------------|-----------|-------|
| Catalyst Center -> Splunk | 40 GB/day telemetry | Continuous | Already provisioned (Phase 2) |
| AgenticOps -> vManage API | 1 MB/day | On-demand | Negligible |
| AgenticOps -> ISE API | 5 MB/day | On-demand | Negligible |
| AgenticOps -> FTD API | 2 MB/day | On-demand | Negligible |
| AgenticOps -> ServiceNow | 10 MB/day | Per-action | Negligible |

**Total Incremental Bandwidth:** <20 MB/day (negligible compared to Phase 2 telemetry)

---

## 3. CATALYST CENTER UPGRADE PROCEDURES

### 3.1 Pre-Upgrade Checklist

**Week 1, Day 1: Pre-Upgrade Validation**

```bash
# Step 1: Verify current DNAC version
ssh admin@10.252.10.1
show version

# Expected output:
# Cisco DNA Center, Version 2.3.7.6
# Build: 2.3.7.6-123456

# Step 2: Verify cluster health
show cluster

# Expected output:
# Cluster Status: Healthy
# Primary: 10.252.10.1 (ACTIVE)
# Secondary: 10.252.10.2 (STANDBY)
# Tertiary: 10.252.10.3 (STANDBY)

# Step 3: Verify storage capacity
show disk-usage

# Expected output:
# Total: 12 TB
# Used: 5.6 TB (47%)
# Available: 6.4 TB (53%)
# [X] >50% available (PASS)

# Step 4: Verify all services running
show service-status

# Expected output:
# All services: RUNNING (green)

# Step 5: Full cluster backup
backup create full

# Expected output:
# Backup job started: backup-20260118-001
# Estimated time: 2-3 hours
# Location: /nfs/backup/

# Wait for backup completion
show backup status

# Expected output:
# backup-20260118-001: COMPLETED
# Size: 4.2 TB
# Status: SUCCESS
```

**Pre-Upgrade Testing:**

| Test | Procedure | Expected Result |
|------|-----------|-----------------|
| **Fabric Connectivity** | Ping all fabric nodes from DNAC | 100% reachability |
| **ISE Integration** | Test pxGrid connection | Active session |
| **Assurance Data** | Query last 24 hours telemetry | Data present, no gaps |
| **API Availability** | REST API health check | 200 OK response |

### 3.2 Staging Environment Build

**Week 1, Days 2-5: Staging Environment**

**Purpose:** Validate upgrade procedure in isolated environment before production deployment.

**Staging Environment Specifications:**

| Component | Production | Staging |
|-----------|-----------|---------|
| **Cluster Size** | 3 nodes | 1 node (acceptable for staging) |
| **Network Devices** | 854 | 10 (representative sample) |
| **Endpoints** | 12,000 | 100 |
| **Data** | Full production | Last 14 days only |
| **Location** | New Jersey DC | Lab environment |

**Staging Build Procedure:**

```bash
# Step 1: Deploy staging DNAC appliance
# - Use DN2-HW-APL-L (Large, not XL) if available
# - Or use VM-based Catalyst Center for staging

# Step 2: Restore partial production data
# Extract last 14 days data from production backup
backup extract --days 14 --output staging-backup.tar

# Transfer to staging appliance
scp staging-backup.tar admin@staging-dnac:/nfs/restore/

# Restore on staging
ssh admin@staging-dnac
restore import staging-backup.tar

# Step 3: Connect staging to lab fabric
# - 10 switches (C9300)
# - 2 WLCs (C9800)
# - 20 APs
# - ISE connection (read-only)

# Step 4: Verify staging environment
show devices
# Expected: 10 switches, 2 WLCs, 20 APs

show assurance summary
# Expected: Telemetry from lab devices

# Step 5: Perform upgrade on staging
# (Upgrade procedure documented in Section 3.3)

# Step 6: Validate AI features post-upgrade
# - AI Assistant queries
# - AIEA endpoint classification
# - DNM model training (sample data)

# Step 7: Document any issues encountered
# - Create upgrade runbook with lessons learned
```

### 3.3 Production Cluster Upgrade

**Week 2: Production Upgrade (New Jersey)**

**Upgrade Window:** Sunday, 2026-01-26, 02:00-06:00 IST (Saturday night, minimal user impact)

**Upgrade Sequence:** Tertiary -> Secondary -> Primary (minimizes service disruption)

**Step-by-Step Upgrade Procedure:**

```bash
#################################################################
# UPGRADE NODE 3 (TERTIARY) - 10.252.10.3
#################################################################

# Step 1: Pre-upgrade checks on Node 3
ssh admin@10.252.10.3
show version
show service-status
show cluster

# Step 2: Download Catalyst Center upgrade file
# Location: Cisco Software Download Center
# File: catalyst-center-2.3.5.6-upgrade.bin
# Size: ~8 GB
# Download to DNAC: /nfs/upgrade/

# Step 3: Verify download integrity
verify-checksum /nfs/upgrade/catalyst-center-2.3.5.6-upgrade.bin
# Expected: MD5 checksum matches Cisco documentation

# Step 4: Initiate upgrade on Node 3
upgrade install /nfs/upgrade/catalyst-center-2.3.5.6-upgrade.bin --node 10.252.10.3

# Expected output:
# Upgrade initiated on node 10.252.10.3
# Estimated time: 90-120 minutes
# Node will reboot automatically
# Services will be unavailable on this node during upgrade

# Step 5: Monitor upgrade progress
show upgrade status
# Expected output (every 5 minutes):
# Node 10.252.10.3: UPGRADING (35% complete)

# Step 6: Wait for Node 3 upgrade completion (~2 hours)
# Expected output:
# Node 10.252.10.3: UPGRADE COMPLETE
# Version: 2.3.5.6
# Status: STANDBY (rejoined cluster)

# Step 7: Validate Node 3 post-upgrade
ssh admin@10.252.10.3
show version
# Expected: Cisco Catalyst Center, Version 2.3.5.6

show cluster
# Expected: Node 3 status STANDBY, cluster healthy

show service-status
# Expected: All services RUNNING

#################################################################
# UPGRADE NODE 2 (SECONDARY) - 10.252.10.2
#################################################################

# Repeat Steps 1-7 for Node 2
# Wait 30 minutes after Node 3 completion before starting Node 2
# Allows cluster stabilization

ssh admin@10.252.10.2
upgrade install /nfs/upgrade/catalyst-center-2.3.5.6-upgrade.bin --node 10.252.10.2

# Monitor and validate as with Node 3

#################################################################
# UPGRADE NODE 1 (PRIMARY) - 10.252.10.1
#################################################################

# Wait 30 minutes after Node 2 completion
# This is the most critical upgrade (active node)

ssh admin@10.252.10.1
upgrade install /nfs/upgrade/catalyst-center-2.3.5.6-upgrade.bin --node 10.252.10.1

# During Node 1 upgrade:
# - Node 2 automatically becomes PRIMARY (failover)
# - Fabric continues operating (data plane unaffected)
# - Assurance data collection continues
# - No user impact

# Monitor and validate

#################################################################
# POST-UPGRADE VALIDATION (All 3 Nodes)
#################################################################

# Step 1: Verify cluster health
ssh admin@10.252.10.1
show cluster

# Expected output:
# Cluster Status: Healthy
# Primary: 10.252.10.1 (ACTIVE) - Version 2.3.5.6
# Secondary: 10.252.10.2 (STANDBY) - Version 2.3.5.6
# Tertiary: 10.252.10.3 (STANDBY) - Version 2.3.5.6

# Step 2: Verify all devices managed
show devices
# Expected: 854 devices (same as pre-upgrade)

# Step 3: Verify Assurance data continuity
show assurance summary --last 24h
# Expected: No data gaps during upgrade

# Step 4: Verify ISE integration
show integrations ise
# Expected: pxGrid connection ACTIVE

# Step 5: Verify AI features available
show ai-capabilities
# Expected output:
# AI Assistant: Enabled
# AI Endpoint Analytics: Enabled
# Deep Network Model: Ready (training required)

# Step 6: Test AI Assistant
# GUI: Catalyst Center -> AI Assistant
# Query: "Show me all switches with high CPU"
# Expected: Natural language response with results

# Step 7: Verify AIEA started profiling
# GUI: Catalyst Center -> Inventory -> Endpoints
# Check: Endpoint profiles show "AIEA" source
# Expected: New endpoints automatically classified

# Step 8: Document upgrade completion
# - Total upgrade time: ~5 hours (3 nodes x 90 min + wait times)
# - Service disruption: 0 minutes (fabric remained operational)
# - Issues encountered: None (or document any)
```

### 3.4 AI Feature Enablement

**Week 3: AI Assistant & AI Endpoint Analytics**

**AI Assistant Configuration:**

```bash
# Step 1: Enable AI Assistant
ssh admin@10.252.10.1
configure terminal
ai-assistant enable

# Step 2: Configure AI Assistant settings
ai-assistant language en-US
ai-assistant max-tokens 2000
ai-assistant temperature 0.7

# Step 3: Configure RBAC for AI Assistant
# GUI: Catalyst Center -> System -> Settings -> User Management
# Add role: AI-Assistant-User
# Permissions:
#   - Assurance: Read
#   - Inventory: Read
#   - AI Assistant: Use

# Assign role to NOC engineers

# Step 4: Test AI Assistant queries
# GUI: Catalyst Center -> AI Assistant (icon in top-right)

# Test Query 1: "Show me all APs with high CPU"
# Expected: List of APs with CPU >75%

# Test Query 2: "Why is Wi-Fi slow at Mumbai office?"
# Expected: Root cause analysis with recommendations

# Test Query 3: "Predict switch failures for next 2 weeks"
# Expected: DNM predictions (if models trained)
```

**AI Endpoint Analytics Configuration:**

```bash
# Step 1: Enable AIEA
ssh admin@10.252.10.1
configure terminal
aiea enable

# Step 2: Configure AIEA settings
aiea confidence-threshold 80
# Only classifications >80% confidence pushed to ISE

aiea update-frequency realtime
# Push updates to ISE immediately on classification change

aiea behavioral-baseline-days 14
# Use 14-day baseline for anomaly detection

# Step 3: Configure ISE integration for AIEA
# GUI: Catalyst Center -> System -> Settings -> External Services -> ISE
# Enable: "AI Endpoint Analytics Profile Sync"
# pxGrid Topic: /Session/EndpointProfile
# Update Frequency: Real-time

# Step 4: Verify AIEA profiling endpoints
# GUI: Catalyst Center -> Inventory -> Endpoints
# Columns: Device Type, OS, Manufacturer, Confidence, Source

# Expected:
# MAC: aa:bb:cc:dd:ee:ff
# Device Type: IP Camera
# OS: Embedded Linux
# Manufacturer: Axis Communications
# Model: AXIS P1375
# Confidence: 98%
# Source: AIEA (not static ISE profiler)

# Step 5: Verify ISE receiving AIEA profiles
# ISE GUI: Context Visibility -> Endpoints
# Check: Profile Source column shows "AIEA"

# Expected:
# Endpoint: aa:bb:cc:dd:ee:ff
# Profile: IP-Camera-Axis
# Source: AIEA (pxGrid)
# Certainty: 98
# SGT: 62 (IP Cameras)

# Step 6: Monitor AIEA accuracy
# Dashboard: AIEA Classification Accuracy
# Target: >95% accuracy within 30 days
```

### 3.5 DR Cluster Upgrade

**Week 4: DR Cluster Upgrade (London)**

**Pre-Requisites:**
- Production cluster (NJ) upgraded successfully
- 48-hour soak test completed (no issues)
- Backup of London cluster completed

**Upgrade Procedure:** Same as Section 3.3 (Production Cluster Upgrade)

**Upgrade Window:** Sunday, 2026-02-02, 02:00-06:00 GMT

**Post-Upgrade Validation:**
- Verify DR cluster version matches production (2.3.5.6)
- Test failover scenario (optional): Shut down NJ cluster, verify London takes over
- Document DR cluster upgrade completion

---

## 4. AGENTICOPS WORKFLOW DEFINITIONS

### 4.1 Workflow Development Framework

**Workflow YAML Structure:**

```yaml
# AgenticOps Workflow Template
# Version: 1.0

workflow:
  id: "WF-XXX"
  name: "Workflow-Name"
  version: "1.0"
  description: "Brief description of workflow purpose"
  
  metadata:
    owner: "Abhavtech Network Operations"
    created: "2026-01-18"
    last_modified: "2026-01-18"
    mode: "observe | recommend | approve | auto"
    
  triggers:
    - type: "alert | schedule | manual"
      source: "AI engine name"
      condition: "Trigger logic"
      
  inputs:
    - name: "input_variable_name"
      source: "AI engine or platform"
      type: "string | number | boolean | object"
      required: true | false
      
  decision_logic:
    guardrails:
      protected_sgt:
        - 11  # Executives
        - 60  # OT/Medical
        - 80  # Servers-Critical
        - 81  # Servers-Production
        - 82  # Servers-Development
        - 83  # Servers-DMZ
      rate_limit:
        max_actions_per_hour: X
        max_actions_per_day: Y
        
    conditions:
      - if: "condition_expression"
        then: "action_sequence"
        else: "alternative_action"
        
  actions:
    - name: "action_name"
      platform: "vManage | ISE | FTD | DNAC"
      api: "API endpoint"
      method: "GET | POST | PUT | DELETE"
      parameters: {}
      rollback:
        enabled: true | false
        timeout: "duration in minutes"
        condition: "rollback trigger condition"
        
  logging:
    splunk_index: "agenticops"
    log_level: "info | warning | error"
    include_full_decision_chain: true
    
  notification:
    servicenow:
      create_ticket: true
      priority: "low | medium | high | critical"
      assignment_group: "NOC | SecOps | NetOps"
    webex:
      send_alert: true | false
      room: "room_name"
```

### 4.2 WF-001: Webex-Branch-Optimize (Complete Definition)

```yaml
#################################################################
# WF-001: WEBEX-BRANCH-OPTIMIZE
# Purpose: Automatically optimize Webex voice quality by adjusting
#          SD-WAN QoS policies when MOS degrades below threshold
#################################################################

workflow:
  id: "WF-001"
  name: "Webex-Branch-Optimize"
  version: "1.0"
  description: "Auto-optimize Webex voice quality via SD-WAN QoS adjustment"
  
  metadata:
    owner: "Abhavtech Network Operations"
    created: "2026-01-18"
    last_modified: "2026-01-18"
    mode: "auto"  # Final mode (Phase 3D)
    initial_mode: "observe"  # Starting mode (Phase 3C)
    
  triggers:
    - type: "alert"
      source: "ThousandEyes"
      condition: |
        (mos < 4.0 OR jitter > 25 OR packet_loss > 1.5)
        AND duration > 120  # 2 minutes
      webhook: "https://agenticops.abhavtech.com/webhook/thousandeyes"
      
  inputs:
    - name: "thousandeyes_alert"
      source: "ThousandEyes"
      type: "object"
      required: true
      schema:
        site: "string"  # Branch site name
        agent_name: "string"
        test_name: "string"
        mos: "number"
        jitter: "number"
        packet_loss: "number"
        duration: "number"  # seconds
        
    - name: "circuit_utilization"
      source: "Splunk (vManage logs)"
      type: "number"
      required: true
      query: |
        index=vmanage source=circuit_stats 
        site="{{site}}" 
        | stats avg(utilization) as util by circuit_name
        
    - name: "client_count"
      source: "DNAC Assurance"
      type: "number"
      required: false
      api: "/dna/intent/api/v1/client-health?siteId={{site_id}}"
      
  decision_logic:
    guardrails:
      protected_sgt: [11, 60, 80, 81, 82, 83]
      rate_limit:
        max_actions_per_hour: 3
        max_actions_per_site_per_hour: 1
        cooldown_period: 30  # minutes
        
    conditions:
      # Condition 1: Guardrail check
      - if: "target_sgt IN protected_sgt"
        then:
          - action: "log_blocked"
            message: "WF-001 blocked: Protected SGT {{target_sgt}}"
          - action: "alert_noc"
            priority: "high"
          - action: "exit_workflow"
          
      # Condition 2: Rate limit check
      - if: "actions_last_hour >= rate_limit.max_actions_per_hour"
        then:
          - action: "log_rate_limited"
          - action: "alert_noc"
            message: "WF-001 rate limited: {{actions_last_hour}} actions in last hour"
          - action: "exit_workflow"
          
      # Condition 3: Main decision logic
      - if: |
          (mos < 4.0 OR jitter > 25 OR packet_loss > 1.5)
          AND circuit_utilization > 80
          AND NOT (target_sgt IN protected_sgt)
          AND actions_last_hour < rate_limit.max_actions_per_hour
        then:
          # Check if backup circuit available
          - action: "query_vmanage"
            api: "/dataservice/device/bfd/sessions"
            parameters:
              deviceId: "{{edge_device_id}}"
            store_result: "backup_circuits"
            
          # Decision branch: Backup available?
          - if: "backup_circuits.count > 0 AND backup_circuits[0].state == 'up'"
            then:
              # Action: Reroute to backup
              - action: "execute"
                name: "reroute_to_backup"
                platform: "vManage"
                api: "/dataservice/template/policy/vedge/{{policy_id}}"
                method: "PUT"
                parameters:
                  policyName: "Webex-Failover-{{site}}"
                  sequences:
                    - match:
                        dscp: [46]  # EF (Webex voice)
                      actions:
                        - type: "route"
                          parameter: "backup"
                rollback:
                  enabled: true
                  timeout: 30  # minutes
                  condition: "mos_improvement < 0.3 OR mos still < 4.0"
                  
            else:
              # Action: Increase QoS bandwidth allocation
              - action: "execute"
                name: "increase_webex_qos"
                platform: "vManage"
                api: "/dataservice/template/feature/{{template_id}}"
                method: "PUT"
                parameters:
                  shaping_rate:
                    # Increase Webex bandwidth by 15%
                    webex_bandwidth_percent: "{{current_percent + 15}}"
                  queue:
                    name: "voice"
                    bandwidth_percent: "{{current_percent + 15}}"
                rollback:
                  enabled: true
                  timeout: 30
                  condition: "mos_improvement < 0.3 OR mos still < 4.0"
        else:
          - action: "log"
            message: "WF-001 conditions not met, no action taken"
            
  actions:
    # Defined inline above in decision_logic
    
  logging:
    splunk_index: "agenticops"
    log_level: "info"
    include_full_decision_chain: true
    log_fields:
      - workflow_id
      - site
      - mos_before
      - mos_after
      - action_taken
      - rollback_triggered
      - execution_time
      
  notification:
    servicenow:
      create_ticket: true
      priority: "medium"
      assignment_group: "NOC"
      short_description: "WF-001: Webex QoS adjustment at {{site}}"
      description_template: |
        AgenticOps WF-001 executed automatic remediation:
        
        Site: {{site}}
        Issue: Webex voice quality degraded
        MOS: {{mos}} (target: >4.2)
        Jitter: {{jitter}}ms
        Packet Loss: {{packet_loss}}%
        
        Action Taken: {{action_name}}
        Expected Improvement: MOS {{mos}} -> {{predicted_mos}}
        
        Rollback: Automatic after 30 minutes if no improvement
        
        Monitor: ThousandEyes test "{{test_name}}"
        
    webex:
      send_alert: false  # Only alert on failures
      room: "network-operations"
      
  monitoring:
    post_action_validation:
      enabled: true
      wait_time: 900  # 15 minutes
      success_criteria:
        - mos > 4.0
        - jitter < 25
        - packet_loss < 1.0
      failure_action:
        - rollback_action
        - alert_noc_failure
```

### 4.3 WF-002: Malware-Containment (Complete Definition)

```yaml
#################################################################
# WF-002: MALWARE-CONTAINMENT
# Purpose: Automatically quarantine endpoints and block C2
#          communication when malware is detected
#################################################################

workflow:
  id: "WF-002"
  name: "Malware-Containment"
  version: "1.0"
  description: "Auto-quarantine malware-infected endpoints and block C2"
  
  metadata:
    owner: "Abhavtech Security Operations"
    created: "2026-01-18"
    last_modified: "2026-01-18"
    mode: "auto"  # Final mode (Phase 3D)
    
  triggers:
    - type: "alert"
      source: "XDR (AMP for Endpoints)"
      condition: "malware_detected AND severity >= high"
      webhook: "https://agenticops.abhavtech.com/webhook/xdr"
      
  inputs:
    - name: "xdr_alert"
      source: "Cisco XDR"
      type: "object"
      required: true
      schema:
        endpoint_hostname: "string"
        endpoint_ip: "string"
        endpoint_mac: "string"
        malware_name: "string"
        malware_hash_sha256: "string"
        severity: "string"  # low, medium, high, critical
        c2_ips: "array"
        c2_domains: "array"
        detection_time: "timestamp"
        
    - name: "endpoint_context"
      source: "ISE pxGrid"
      type: "object"
      required: true
      api: "/pxgrid/control/SessionQuery"
      parameters:
        macAddress: "{{endpoint_mac}}"
      schema:
        username: "string"
        sgt: "number"
        location: "string"
        auth_status: "string"
        
    - name: "endpoint_behavioral_profile"
      source: "AI Endpoint Analytics"
      type: "object"
      required: false
      api: "/dna/intent/api/v1/endpoint/{{mac}}/behavioral-profile"
      
  decision_logic:
    guardrails:
      protected_sgt: [11, 60, 80, 81, 82, 83]
      protected_users:
        - "ceo@abhavtech.com"
        - "cto@abhavtech.com"
        - "ciso@abhavtech.com"
      rate_limit:
        max_actions_per_hour: 10
        # Higher limit for security workflows
        
    conditions:
      # Condition 1: Severity check
      - if: "severity NOT IN ['high', 'critical']"
        then:
          - action: "log"
            message: "WF-002: Severity {{severity}} below threshold, alerting only"
          - action: "alert_secops"
            priority: "medium"
          - action: "exit_workflow"
          
      # Condition 2: Guardrail check
      - if: "endpoint_context.sgt IN protected_sgt"
        then:
          - action: "log_blocked"
            message: "WF-002 blocked: Protected SGT {{endpoint_context.sgt}}"
          - action: "alert_secops"
            priority: "critical"
            message: |
              CRITICAL: Malware detected on PROTECTED endpoint
              
              Endpoint: {{endpoint_hostname}}
              User: {{endpoint_context.username}}
              SGT: {{endpoint_context.sgt}} (PROTECTED - NO AUTO-QUARANTINE)
              Malware: {{malware_name}}
              
              MANUAL INVESTIGATION REQUIRED
              
          - action: "create_incident"
            platform: "XDR"
            priority: "critical"
          - action: "exit_workflow"
          
      # Condition 3: Main containment logic
      - if: |
          severity IN ['high', 'critical']
          AND NOT (endpoint_context.sgt IN protected_sgt)
          AND NOT (endpoint_context.username IN protected_users)
        then:
          # Parallel execution of containment actions
          - action_group: "containment"
            execute: "parallel"
            actions:
              # Action 1: AMP Endpoint Isolation
              - action: "isolate_endpoint"
                platform: "AMP"
                api: "/v1/computers/{{endpoint_guid}}"
                method: "PATCH"
                parameters:
                  isolation: true
                timeout: 30  # seconds
                
              # Action 2: ISE VLAN Quarantine
              - action: "quarantine_ise"
                platform: "ISE"
                api: "/ers/config/ancendpoint/apply"
                method: "POST"
                parameters:
                  macAddress: "{{endpoint_mac}}"
                  policyName: "ANC-Quarantine"
                timeout: 30
                
              # Action 3: Block C2 IPs in FTD
              - action: "block_c2_ips"
                platform: "FTD (via FMC)"
                api: "/policy/accesspolicies/{{policy_id}}/accessrules"
                method: "POST"
                parameters:
                  name: "Block-C2-{{malware_hash_sha256[:8]}}"
                  action: "BLOCK"
                  sourceNetworks:
                    - type: "Host"
                      value: "{{endpoint_ip}}"
                  destinationNetworks:
                    - type: "Host"
                      value: "{{c2_ip}}"
                    for_each: "c2_ip in xdr_alert.c2_ips"
                  deployNow: true
                timeout: 60
                
              # Action 4: Block C2 Domains in Umbrella
              - action: "block_c2_domains"
                platform: "Umbrella"
                api: "/policies/{{policy_id}}/destinations"
                method: "POST"
                parameters:
                  destinations: "{{xdr_alert.c2_domains}}"
                  action: "BLOCK"
                timeout: 30
                
          # Sequential: Search for lateral movement
          - action: "search_lateral_movement"
            platform: "XDR"
            api: "/v1/events/search"
            method: "POST"
            parameters:
              query: |
                sha256:{{malware_hash_sha256}}
                AND NOT hostname:{{endpoint_hostname}}
              timeRange: "last_24_hours"
            store_result: "other_infected_endpoints"
            
          # If lateral movement found, recurse
          - if: "other_infected_endpoints.count > 0"
            then:
              - action: "log"
                message: "Lateral movement detected: {{other_infected_endpoints.count}} additional endpoints"
              - action: "for_each"
                items: "other_infected_endpoints"
                execute: "workflow"
                workflow_id: "WF-002"  # Recursive call
                parameters:
                  endpoint_mac: "{{item.mac}}"
                  malware_hash_sha256: "{{malware_hash_sha256}}"
                  
  actions:
    # Defined inline above
    
  logging:
    splunk_index: "agenticops_security"
    log_level: "info"
    include_full_decision_chain: true
    log_fields:
      - workflow_id
      - endpoint_hostname
      - endpoint_mac
      - endpoint_ip
      - username
      - sgt
      - malware_name
      - malware_hash
      - c2_ips
      - c2_domains
      - containment_time_seconds
      - lateral_movement_found
      - endpoints_quarantined_total
      
  notification:
    servicenow:
      create_ticket: true
      priority: "high"
      assignment_group: "SecOps"
      short_description: "WF-002: Malware containment {{endpoint_hostname}}"
      description_template: |
        AgenticOps WF-002 executed automatic malware containment:
        
        Endpoint Details:
        - Hostname: {{endpoint_hostname}}
        - IP: {{endpoint_ip}}
        - MAC: {{endpoint_mac}}
        - User: {{endpoint_context.username}}
        - SGT: {{endpoint_context.sgt}}
        - Location: {{endpoint_context.location}}
        
        Malware Details:
        - Name: {{malware_name}}
        - SHA256: {{malware_hash_sha256}}
        - Severity: {{severity}}
        - Detection Time: {{detection_time}}
        
        C2 Communication:
        - IPs: {{c2_ips | join(', ')}}
        - Domains: {{c2_domains | join(', ')}}
        
        Actions Taken:
        1. Endpoint isolated (AMP)
        2. VLAN quarantined (ISE)
        3. C2 IPs blocked (FTD)
        4. C2 domains blocked (Umbrella)
        
        Lateral Movement:
        - Additional infected endpoints: {{other_infected_endpoints.count}}
        
        Total containment time: {{containment_time_seconds}} seconds
        
        Next Steps:
        1. Investigate malware source (phishing email, drive-by download?)
        2. Remove malware from endpoint
        3. Validate endpoint clean
        4. Release from quarantine
        
    webex:
      send_alert: true
      room: "security-alerts"
      message_template: |
        ALERT MALWARE CONTAINMENT (WF-002)
        
        Endpoint: {{endpoint_hostname}} ({{endpoint_context.username}})
        Malware: {{malware_name}}
        Status: QUARANTINED ({{containment_time_seconds}}s)
        
        ServiceNow: {{ticket_id}}
        
  monitoring:
    post_action_validation:
      enabled: true
      wait_time: 300  # 5 minutes
      success_criteria:
        - endpoint_isolated == true
        - ise_quarantine_active == true
        - c2_blocked_ftd == true
        - c2_blocked_umbrella == true
      failure_action:
        - alert_secops_critical
        - create_incident_xdr
        - manual_intervention_required
```

### 4.4 WF-003 through WF-008 (Simplified Definitions)

**WF-003: Client-Troubleshoot (Manual)**

```yaml
workflow:
  id: "WF-003"
  name: "Client-Troubleshoot"
  mode: "manual"  # NOC-initiated, no automated actions
  
  triggers:
    - type: "manual"
      source: "AI Assistant"
      condition: "NOC engineer enters client identifier"
      
  inputs:
    - name: "client_identifier"
      source: "NOC input (username, MAC, or IP)"
      type: "string"
      required: true
      
  decision_logic:
    steps:
      1. Query DNAC Assurance for client health (wireless/wired metrics)
      2. Query ISE pxGrid for authentication context
      3. Query DNM for predictions (known issues at location?)
      4. Correlate with Splunk logs (recent network changes?)
      5. Generate troubleshooting recommendations (ranked by likelihood)
      
  output:
    - Root cause analysis with confidence score
    - Ranked recommendations (most likely -> least likely)
    - Related issues (similar problems at same site)
    
  actions:
    - None (Manual - NOC executes recommended actions)
```

**WF-004: Capacity-Alert (Manual)**

```yaml
workflow:
  id: "WF-004"
  name: "Capacity-Alert"
  mode: "manual"  # Requires procurement/budget approval
  
  triggers:
    - type: "schedule"
      frequency: "daily 08:00 IST"
    - type: "alert"
      source: "Deep Network Model"
      condition: "port_exhaustion_days <= 14 OR bandwidth_exhaustion_days <= 30"
      
  inputs:
    - name: "capacity_forecast"
      source: "DNM Capacity Forecasting Model"
      type: "object"
      required: true
      
  output:
    - Capacity exhaustion date (predicted)
    - Growth rate (current trend)
    - Recommended action (add ports, upgrade bandwidth, add equipment)
    - Procurement recommendation (specific equipment models)
    
  actions:
    - Create ServiceNow ticket (assignment: Capacity Planning team)
    - Email report to network architect + CTO
    - No automated procurement (requires budget approval)
```

**WF-005: Compliance-Remediate (Approve)**

```yaml
workflow:
  id: "WF-005"
  name: "Compliance-Remediate"
  mode: "approve"  # Requires NOC approval before config change
  
  triggers:
    - type: "alert"
      source: "Splunk MLTK"
      condition: "compliance_violation_detected == true"
      
  inputs:
    - name: "compliance_violation"
      source: "Splunk MLTK Compliance-Check Model"
      type: "object"
      required: true
      examples:
        - "SNMPv2 detected (should be SNMPv3)"
        - "Weak SSH cipher detected"
        - "NTP server not configured"
        
  decision_logic:
    steps:
      1. Identify non-compliant configuration
      2. Generate remediation plan (DNAC template)
      3. Check device health (is device stable for config change?)
      4. Request approval from NOC
      5. IF approved: Apply DNAC template
      
  actions:
    - Create ServiceNow change request
    - Wait for approval (timeout: 24 hours)
    - IF approved: Apply compliance template via DNAC
    - Rollback: Auto-revert if device becomes unreachable
    
  guardrails:
    - No action on SGT 80-83 (server infrastructure)
```

**WF-006: Wi-Fi-Optimize (Approve)**

```yaml
workflow:
  id: "WF-006"
  name: "Wi-Fi-Optimize"
  mode: "approve"  # Requires wireless engineer approval
  
  triggers:
    - type: "alert"
      source: "Deep Network Model"
      condition: "rf_optimization_opportunity == true"
      examples:
        - "Channel overlap detected (APs on same channel)"
        - "Coverage gap detected (weak signal area)"
        - "Co-channel interference >30%"
        
  inputs:
    - name: "rf_optimization_plan"
      source: "DNM RF Optimization Model"
      type: "object"
      required: true
      
  output:
    - RF plan (channel reassignment, power adjustment)
    - Expected improvement (client health increase %)
    - Risk assessment (coverage impact)
    
  decision_logic:
    steps:
      1. DNM detects RF optimization opportunity
      2. Generate RF plan with expected improvement
      3. Request approval from wireless engineer
      4. IF approved: Apply RF configuration via DNAC
      5. Monitor client health for 24 hours
      6. IF client health degrades: Rollback automatically
      
  actions:
    - Create ServiceNow change request
    - Wait for approval (timeout: 24 hours)
    - IF approved: Apply RF configuration via DNAC
    - Rollback: Auto-revert after 24 hours if client health degrades
    
  guardrails:
    - Max 2 actions per site per day (prevent RF churn)
```

**WF-007: SaaS-Failover (Auto)**

```yaml
workflow:
  id: "WF-007"
  name: "SaaS-Failover"
  mode: "auto"  # Low risk, time-critical
  
  triggers:
    - type: "alert"
      source: "ThousandEyes"
      condition: "saas_path_degraded == true AND duration > 300"
      examples:
        - "Office365 latency >200ms for 5 minutes"
        - "Salesforce packet loss >2% for 5 minutes"
        
  inputs:
    - name: "thousandeyes_alert"
      source: "ThousandEyes"
      type: "object"
      required: true
      
  decision_logic:
    steps:
      1. ThousandEyes detects SaaS path degraded
      2. Check if backup path (DIA) is healthy
      3. IF backup healthy: Reroute SaaS traffic to DIA
      4. Monitor for 30 minutes
      5. IF latency not improved: Rollback to original path
      
  actions:
    - Reroute SaaS traffic (Office365, Salesforce, Webex) to DIA backup
    - Expected: Latency improvement 200ms -> 50ms
    - Rollback: Auto-revert after 30 minutes if latency not improved
    
  guardrails:
    - No action on SGT 80-83 (server traffic)
    - Rate limit: 5 actions/hour
```

**WF-008: Insider-Threat (Manual)**

```yaml
workflow:
  id: "WF-008"
  name: "Insider-Threat"
  mode: "manual"  # Requires SecOps/legal investigation
  
  triggers:
    - type: "alert"
      source: "Splunk MLTK + XDR"
      condition: "insider_threat_score > 80"
      indicators:
        - "Large data exfiltration (>5 GB in 24 hours)"
        - "Unusual access patterns (off-hours, unusual destinations)"
        - "Privilege escalation attempts"
        
  inputs:
    - name: "insider_threat_analysis"
      source: "Splunk MLTK Insider-Threat Model"
      type: "object"
      required: true
      
  output:
    - Investigation case with evidence timeline
    - Behavioral analysis (deviation from baseline)
    - Risk score (0-100, >80 = high risk)
    
  actions:
    - Create XDR investigation case
    - Alert SecOps team (critical priority)
    - Notify legal team (potential insider threat)
    - No automated quarantine (requires investigation)
    
  guardrails:
    - No automated actions (investigation-only workflow)
```

---

## 5. API INTEGRATION SPECIFICATIONS

### 5.1 API Credentials Management

**Secure Credential Storage:**

| Platform | Authentication Method | Credential Storage | Rotation Policy |
|----------|----------------------|-------------------|-----------------|
| Catalyst Center | API Token | HashiCorp Vault | 90 days |
| vManage | OAuth 2.0 | HashiCorp Vault | 90 days |
| ISE | ERS Username/Password | HashiCorp Vault | 90 days |
| FTD (FMC) | API Token | HashiCorp Vault | 90 days |
| Umbrella | API Key + Secret | HashiCorp Vault | 180 days |
| AMP | API Key + Client ID | HashiCorp Vault | 180 days |
| Splunk | API Token | HashiCorp Vault | 90 days |
| ThousandEyes | OAuth Token | HashiCorp Vault | 90 days |
| AppDynamics | API Client | HashiCorp Vault | 90 days |
| ServiceNow | OAuth 2.0 | HashiCorp Vault | 90 days |

**HashiCorp Vault Setup:**

```bash
# Install HashiCorp Vault (if not already deployed)
# Location: Dedicated vault server in secure network segment

# Create Vault policy for AgenticOps
vault policy write agenticops-policy - <<EOF
path "secret/data/agenticops/*" {
  capabilities = ["read", "list"]
}
EOF

# Create AppRole for AgenticOps
vault write auth/approle/role/agenticops \
    token_policies="agenticops-policy" \
    token_ttl=1h \
    token_max_ttl=4h

# Store API credentials
vault kv put secret/agenticops/catalyst-center \
    username="agenticops-api" \
    password="<generated-password>" \
    base_url="https://10.252.10.1"

vault kv put secret/agenticops/vmanage \
    client_id="agenticops" \
    client_secret="<generated-secret>" \
    base_url="https://vmanage.abhavtech.com"

# AgenticOps retrieves credentials at runtime
vault kv get -field=password secret/agenticops/catalyst-center
```

### 5.2 Catalyst Center API Integration

**API Authentication:**

```python
import requests
import json
import hvac

# Retrieve credentials from Vault
vault_client = hvac.Client(url='https://vault.abhavtech.com:8200')
vault_client.auth.approle.login(
    role_id='<role-id>',
    secret_id='<secret-id>'
)

creds = vault_client.secrets.kv.v2.read_secret_version(
    path='agenticops/catalyst-center'
)['data']['data']

# Authenticate to Catalyst Center
auth_url = f"{creds['base_url']}/dna/system/api/v1/auth/token"
response = requests.post(
    auth_url,
    auth=(creds['username'], creds['password']),
    headers={'Content-Type': 'application/json'},
    verify=False  # Use proper cert in production
)

token = response.json()['Token']

# Use token for subsequent API calls
headers = {
    'X-Auth-Token': token,
    'Content-Type': 'application/json'
}

# Example API calls
# Get device list
devices_url = f"{creds['base_url']}/dna/intent/api/v1/network-device"
response = requests.get(devices_url, headers=headers, verify=False)
devices = response.json()['response']

# Get client health
client_health_url = f"{creds['base_url']}/dna/intent/api/v1/client-health"
response = requests.get(client_health_url, headers=headers, verify=False)
client_health = response.json()['response']
```

### 5.3 Error Handling & Rate Limiting

**Rate Limiting Strategy:**

| Platform | Rate Limit | Handling Strategy |
|----------|-----------|------------------|
| Catalyst Center | 100 req/min | Queue requests, retry with exponential backoff |
| vManage | 50 req/min | Queue requests |
| ISE | 20 req/min | Queue requests, use pxGrid for bulk queries |
| FMC | 120 req/min | Batch operations when possible |

**Error Handling Template:**

```python
import time
import logging

def api_call_with_retry(func, *args, max_retries=3, **kwargs):
    """Wrapper for API calls with exponential backoff retry logic"""
    for attempt in range(max_retries):
        try:
            response = func(*args, **kwargs)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:  # Rate limit
                retry_after = int(response.headers.get('Retry-After', 60))
                logging.warning(f"Rate limited, retrying after {retry_after}s")
                time.sleep(retry_after)
            elif response.status_code >= 500:  # Server error
                wait_time = 2 ** attempt
                logging.error(f"Server error, retrying after {wait_time}s")
                time.sleep(wait_time)
            else:
                logging.error(f"API call failed: {response.status_code}")
                return None
                
        except requests.exceptions.RequestException as e:
            logging.error(f"Request exception: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                logging.critical(f"API call failed after {max_retries} attempts")
                return None
    
    return None
```

---

## 6. GUARDRAIL CONFIGURATION

### 6.1 Protected Security Group Tags

**Protected SGT Configuration:**

```yaml
# /etc/agenticops/guardrails.yaml

protected_sgt:
  # SGT 11: Executives - NEVER auto-quarantine or modify
  - sgt: 11
    name: "Executives"
    protection_level: "critical"
    allowed_workflows: []  # NO workflows allowed
    alert_on_trigger: true
    alert_recipients:
      - "ciso@abhavtech.com"
      - "noc-lead@abhavtech.com"
    rationale: "Executive devices require manual investigation"
    
  # SGT 60: OT/Medical Devices - NEVER auto-modify
  - sgt: 60
    name: "OT-Medical"
    protection_level: "critical"
    allowed_workflows: []
    alert_on_trigger: true
    alert_recipients:
      - "ot-team@abhavtech.com"
      - "ciso@abhavtech.com"
    rationale: "Patient safety - manual intervention only"
    
  # SGT 80-83: Server Infrastructure
  - sgt: 80
    name: "Servers-Critical"
    protection_level: "high"
    allowed_workflows: []
    
  - sgt: 81
    name: "Servers-Production"
    protection_level: "high"
    allowed_workflows: []
    
  - sgt: 82
    name: "Servers-Development"
    protection_level: "medium"
    allowed_workflows: ["WF-005"]  # Compliance only (with approval)
    
  - sgt: 83
    name: "Servers-DMZ"
    protection_level: "high"
    allowed_workflows: []

enforcement:
  mode: "strict"
  log_all_checks: true
  log_index: "agenticops_guardrails"
```

**Guardrail Enforcement Logic:**

```python
# guardrails.py

import yaml
import logging
from datetime import datetime

class GuardrailValidator:
    def __init__(self, config_file='/etc/agenticops/guardrails.yaml'):
        with open(config_file, 'r') as f:
            self.config = yaml.safe_load(f)
        
    def validate_workflow_action(self, workflow_id, target_sgt, action_type):
        """
        Validate if workflow is allowed to act on target SGT
        Returns: (allowed: bool, reason: str)
        """
        for protected in self.config['protected_sgt']:
            if protected['sgt'] == target_sgt:
                if workflow_id not in protected.get('allowed_workflows', []):
                    self.log_blocked_action(workflow_id, target_sgt, action_type, protected)
                    self.send_alert(protected, workflow_id, target_sgt)
                    return False, f"SGT {target_sgt} ({protected['name']}) is protected"
        
        return True, "Guardrails passed"
    
    def log_blocked_action(self, workflow_id, target_sgt, action_type, protected):
        """Log guardrail block to Splunk"""
        log_data = {
            'timestamp': datetime.now().isoformat(),
            'workflow_id': workflow_id,
            'target_sgt': target_sgt,
            'sgt_name': protected['name'],
            'action_type': action_type,
            'status': 'BLOCKED'
        }
        logging.warning(f"Guardrail BLOCKED: WF {workflow_id} on SGT {target_sgt}")
```

### 6.2 Rate Limiting

**Rate Limit Configuration:**

```yaml
# /etc/agenticops/rate_limits.yaml

rate_limits:
  global:
    max_actions_per_hour: 20
    max_actions_per_day: 100
    
  per_workflow:
    WF-001:
      max_actions_per_hour: 3
      max_actions_per_site_per_hour: 1
      cooldown_period_minutes: 30
      
    WF-002:
      max_actions_per_hour: 10
      max_actions_per_endpoint_per_hour: 1
      
    WF-007:
      max_actions_per_hour: 5
      max_actions_per_circuit_per_hour: 2
```

---

## 7. SERVICENOW INTEGRATION

### 7.1 ServiceNow Configuration

**Integration Architecture:**

```
AgenticOps -> ServiceNow REST API -> ITSM Workflows

Ticket Types:
- Informational (Auto mode actions)
- Approval Request (Approve mode actions)
- Incident (Failures, guardrail violations)
```

**ServiceNow API Setup:**

```bash
# ServiceNow Instance: abhavtech.service-now.com

# Create Integration User
Username: agenticops_api
Role: itil, rest_api_explorer

# Generate OAuth Credentials
Application Name: AgenticOps Integration
Client ID: <generated>
Client Secret: <generated>

# Store in Vault
vault kv put secret/agenticops/servicenow \
    client_id="<client-id>" \
    client_secret="<client-secret>" \
    instance_url="https://abhavtech.service-now.com"
```

### 7.2 ServiceNow API Client

**Python Client:**

```python
import requests
from datetime import datetime, timedelta

class ServiceNowClient:
    def __init__(self, instance_url, client_id, client_secret):
        self.instance_url = instance_url
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token = None
        
    def authenticate(self):
        """Get OAuth access token"""
        token_url = f"{self.instance_url}/oauth_token.do"
        response = requests.post(
            token_url,
            data={
                'grant_type': 'client_credentials',
                'client_id': self.client_id,
                'client_secret': self.client_secret
            }
        )
        self.access_token = response.json()['access_token']
        
    def create_informational_ticket(self, workflow_id, description, details):
        """Create informational ticket for Auto mode workflows"""
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'short_description': f"AgenticOps: {workflow_id} - {description}",
            'priority': 3,
            'state': 6,  # Resolved
            'u_workflow_id': workflow_id
        }
        
        response = requests.post(
            f"{self.instance_url}/api/now/table/incident",
            headers=headers,
            json=payload
        )
        return response.json()['result']['number']
```

---

## 8. TESTING & VALIDATION

### 8.1 Phase 3C Testing (Observe Mode)

**Testing Objective:** Validate all 8 workflows generate correct recommendations without executing actions.

**Test Matrix:**

| Workflow | Test Scenario | Expected Result | Pass/Fail |
|----------|--------------|-----------------|-----------|
| **WF-001** | Degrade Webex MOS at Mumbai (reduce bandwidth) | Recommends QoS increase, logs to Splunk, NO action | [ ] |
| **WF-002** | Upload test malware (EICAR) to lab endpoint | Identifies endpoint, recommends quarantine, NO action | [ ] |
| **WF-003** | NOC queries: "Why can't user X connect to Wi-Fi?" | AI Assistant provides root cause + recommendations | [ ] |
| **WF-004** | DNM predicts port exhaustion in 10 days | Creates ServiceNow ticket, NO procurement action | [ ] |
| **WF-005** | Non-compliant config (SNMP v2 vs v3) | Generates remediation plan, NO config change | [ ] |
| **WF-006** | RF channel overlap at London | Recommends channel reassignment, NO RF change | [ ] |
| **WF-007** | O365 path degradation >200ms for 5 min | Recommends path failover, NO route change | [ ] |
| **WF-008** | Data exfiltration (5 GB from HR user) | Creates investigation case, NO quarantine | [ ] |

**Phase 3C Exit Criteria:**

| Criteria | Target | Status |
|----------|--------|--------|
| All 8 workflows triggered successfully | 8/8 | [ ] |
| Recommendations logged to Splunk | 100% | [ ] |
| NO automated actions executed | 0 actions | [ ] |
| Guardrails validated | 100% | [ ] |
| 2-week observation completed | 14 days | [ ] |
| False positive rate | <10% | [ ] |

### 8.2 Phase 3D Testing (Auto/Approve Mode)

**Testing Objective:** Validate workflows execute actions correctly with proper rollback.

**Critical Tests:**

1. WF-001 Auto Execution + Rollback
2. WF-002 Auto Quarantine + Lateral Movement
3. WF-006 Approval Required + Manual Override
4. Guardrail Protection (Attempt action on SGT-11)

**Test Procedure Example (WF-002):**

```bash
# Test: WF-002 Auto Quarantine

# Step 1: Baseline check
# ISE: Endpoint NOT quarantined

# Step 2: Upload EICAR test file
scp eicar.com testuser@lab-endpoint-01:/tmp/
ssh testuser@lab-endpoint-01
chmod +x /tmp/eicar.com
./eicar.com

# Step 3: Wait 60 seconds for WF-002

# Step 4: Verify quarantine
# ISE: Endpoint QUARANTINED
# AMP: Endpoint ISOLATED
# FTD: C2 blocked (if applicable)

# Step 5: Verify ServiceNow ticket created

# Step 6: Verify Splunk logging
index=agenticops_security workflow_id="WF-002"
| stats count by endpoint_mac

# Expected: 1 endpoint quarantined, containment time <5 seconds
```

---

## 9. OPERATIONAL RUNBOOKS

### 9.1 Daily Operations

**Daily Checklist (NOC Team Lead):**

```
TIME: 08:00 IST - Morning Review

[  ] 1. Check AgenticOps Dashboard
     - Workflow executions (last 24 hours)
     - Success rate (target: >95%)
     - Average MTTR (target: <10 min)
     
[  ] 2. Review Splunk Alerts
     - Guardrail blocks: Any false positives?
     - Rate limit violations: Why?
     - Workflow failures: Root cause?
     
[  ] 3. Review ServiceNow Tickets
     - Pending approvals (WF-005, WF-006): Approve or reject
     - Open incidents: Follow up on failures
     
[  ] 4. Check AI Model Performance
     - DNM accuracy: >90%?
     - AIEA false positives: <2%?
     - Splunk MLTK performance: Normal?
     
[  ] 5. Respond to Failures
     - Investigate root cause
     - Manual intervention if needed
     - Update workflow logic if pattern detected
```

**Splunk Queries for Daily Review:**

```spl
# Workflow executions (last 24 hours)
index=agenticops earliest=-24h
| stats count by workflow_id, outcome
| table workflow_id, count, outcome

# Guardrail blocks
index=agenticops_guardrails earliest=-24h status="BLOCKED"
| stats count by workflow_id, target_sgt
| table workflow_id, target_sgt, count

# Workflow performance (MTTR)
index=agenticops earliest=-24h action_taken=*
| eval mttr_minutes = execution_time_seconds / 60
| stats avg(mttr_minutes) by workflow_id
| where avg(mttr_minutes) < 10
```

### 9.2 Weekly Operations

**Weekly Review Meeting (Mondays, 10:00 IST):**

**Attendees:**
- Network Architect
- NOC Team Lead
- Security Analyst
- Automation Engineer (if needed)

**Agenda:**

```
1. WORKFLOW PERFORMANCE REVIEW (15 min)
   - Success rate by workflow (target: >95%)
   - MTTR trends (target: <10 min)
   - False positive trends (target: <2%)
   
2. GUARDRAIL BLOCKS ANALYSIS (10 min)
   - Protected SGT violations: Why?
   - False positives: Adjust thresholds?
   - New protected entities: Add to guardrails?
   
3. AI MODEL PERFORMANCE (15 min)
   - DNM accuracy: 90-95%?
   - AIEA classification accuracy: >95%?
   - Splunk MLTK false positives: <2%?
   - Model retraining: Any issues?
   
4. WORKFLOW TUNING (10 min)
   - Threshold adjustments needed?
   - New trigger conditions?
   - Rate limit changes?
   
5. INCIDENT REVIEW (10 min)
   - Failures last week: Root causes?
   - Escalations: Why?
   - Lessons learned?
   
6. ACTION ITEMS (5 min)
   - Assign tasks
   - Set deadlines
```

**Weekly Report Template:**

```markdown
# AGENTICOPS WEEKLY REPORT
Week of: [Date]

## EXECUTIVE SUMMARY
- Workflows executed: [count]
- Success rate: [percentage]
- Average MTTR: [minutes]
- Incidents: [count]

## WORKFLOW PERFORMANCE
| Workflow | Executions | Success Rate | Avg MTTR | Incidents |
|----------|-----------|--------------|----------|-----------|
| WF-001   | 45        | 96%          | 8 min    | 0         |
| WF-002   | 12        | 100%         | 3 min    | 0         |
| ...      | ...       | ...          | ...      | ...       |

## AI MODEL PERFORMANCE
- DNM Accuracy: 92.5% (target: >90%) [X]
- AIEA Accuracy: 96.2% (target: >95%) [X]
- Splunk MLTK FP Rate: 1.8% (target: <2%) [X]

## GUARDRAIL BLOCKS
- Total blocks: 3
  - WF-002 on SGT-11 (Executive): 2 blocks
  - WF-001 rate limited: 1 block

## INCIDENTS & ESCALATIONS
- None this week

## RECOMMENDATIONS
1. Increase WF-001 rate limit from 3 to 5 actions/hour (high success rate)
2. Tune AIEA threshold from 80% to 85% (reduce false positives)

## ACTION ITEMS
- [ ] Network Architect: Approve rate limit change
- [ ] Automation Engineer: Update AIEA threshold
```

### 9.3 Monthly Operations

**Monthly Tasks:**

```
[  ] 1. GENERATE PERFORMANCE REPORT (1st of month)
     - Workflow MTTR trends
     - AI accuracy trends
     - NOC productivity savings
     - Submit to CTO
     
[  ] 2. REVIEW PROTECTED SGTs (Mid-month)
     - Any new executives hired? Add to SGT-11
     - Any new OT devices? Add to SGT-60
     - Any server decommissions? Remove from SGT 80-83
     
[  ] 3. UPDATE WORKFLOW LOGIC (End of month)
     - Incorporate lessons learned
     - Adjust thresholds based on false positive analysis
     - Update documentation
     
[  ] 4. VENDOR ENGAGEMENT (As needed)
     - Cisco TAC: DNAC issues?
     - AppDynamics: Cognition Engine questions?
     - ThousandEyes: Path monitoring issues?
```

### 9.4 Quarterly Operations

**Quarterly Review (Network Architect + CTO):**

```
1. STRATEGIC REVIEW
   - Are we meeting KPIs?
     - MTTR <10 minutes: [X] or [ ]
     - Success rate >95%: [X] or [ ]
     - NOC productivity +70%: [X] or [ ]
   
2. WORKFLOW EXPANSION
   - Should we add new workflows?
   - Should we move more workflows to Auto mode?
   - Should we deprecate any workflows?
   
3. AI MODEL MATURITY
   - DNM: 6 months of data = optimal performance?
   - AIEA: Accuracy trends improving?
   - Splunk MLTK: New models needed?
   
4. INFRASTRUCTURE SCALING
   - Catalyst Center capacity: Still <20% utilized?
   - Splunk license: Approaching limit?
   - ServiceNow: Ticket volume trends?
   
5. BUDGET PLANNING
   - License renewals due?
   - New equipment needed (from WF-004 alerts)?
   - Training needs for new NOC hires?
```

---

## 10. TROUBLESHOOTING GUIDE

### 10.1 Common Issues & Resolutions

**Issue 1: Workflow Not Triggering**

```
SYMPTOM: WF-001 not executing despite Webex quality degradation

POSSIBLE CAUSES:
1. ThousandEyes webhook not reaching AgenticOps
2. AgenticOps service down
3. Trigger condition not met (duration <2 minutes?)

TROUBLESHOOTING STEPS:
1. Check ThousandEyes alert history
   - GUI: Alerts -> Active Alerts
   - Verify alert was generated

2. Check AgenticOps webhook logs
   ssh agenticops-server
   tail -f /var/log/agenticops/webhooks.log
   # Expected: Incoming POST from ThousandEyes

3. Check AgenticOps service status
   systemctl status agenticops
   # Expected: active (running)

4. Check Splunk for workflow trigger attempts
   index=agenticops workflow_id="WF-001" 
   | table _time, trigger_result, trigger_condition_met
   
RESOLUTION:
- If webhook not received: Check firewall rules, verify webhook URL in ThousandEyes
- If service down: systemctl restart agenticops
- If trigger condition not met: Review trigger logic, adjust thresholds if needed
```

**Issue 2: Guardrail False Block**

```
SYMPTOM: WF-002 blocked quarantine on legitimate corporate user (SGT-10)

POSSIBLE CAUSES:
1. ISE pxGrid returned incorrect SGT
2. User's SGT recently changed (promotion to executive?)
3. Guardrail configuration outdated

TROUBLESHOOTING STEPS:
1. Verify user's actual SGT in ISE
   ISE GUI: Context Visibility -> Endpoints -> Search by MAC
   # Check SGT assignment

2. Check guardrail configuration
   cat /etc/agenticops/guardrails.yaml
   # Is SGT-10 in protected list? (Should NOT be)

3. Check Splunk for guardrail decision
   index=agenticops_guardrails endpoint_mac="aa:bb:cc:dd:ee:ff"
   | table _time, workflow_id, target_sgt, sgt_name, status

RESOLUTION:
- If ISE returned wrong SGT: Fix ISE authorization policy
- If user promoted to executive: Add to SGT-11, update guardrails
- If guardrail config outdated: Update /etc/agenticops/guardrails.yaml
```

**Issue 3: Action Rollback Triggered**

```
SYMPTOM: WF-001 increased Webex QoS, but rolled back after 30 minutes

POSSIBLE CAUSES:
1. MOS did not improve as expected (root cause elsewhere)
2. Rollback condition too strict
3. WAN circuit issue not resolved by QoS change

TROUBLESHOOTING STEPS:
1. Check ThousandEyes MOS after action
   index=thousandeyes test_name="Voice-Quality-Mumbai" 
   | timechart avg(mos)
   # Did MOS improve at all?

2. Check vManage for QoS policy application
   vManage GUI: Configuration -> Policies
   # Verify policy was applied and then rolled back

3. Check Splunk for rollback decision
   index=agenticops workflow_id="WF-001" action="rollback"
   | table _time, rollback_reason, mos_after_action

RESOLUTION:
- If MOS improved slightly but <0.3: Adjust rollback threshold
- If root cause was ISP (not WAN congestion): Consider WF-007 (SaaS Failover)
- If rollback condition too strict: Update workflow YAML
```

**Issue 4: ServiceNow Ticket Not Created**

```
SYMPTOM: WF-001 executed successfully but no ServiceNow ticket

POSSIBLE CAUSES:
1. ServiceNow OAuth token expired
2. ServiceNow API down
3. AgenticOps ServiceNow integration configuration issue

TROUBLESHOOTING STEPS:
1. Check AgenticOps logs for ServiceNow API errors
   tail -f /var/log/agenticops/servicenow.log
   # Look for 401 Unauthorized or 500 errors

2. Test ServiceNow OAuth token
   curl -X POST "https://abhavtech.service-now.com/oauth_token.do" \
     -d "grant_type=client_credentials" \
     -d "client_id=<id>" \
     -d "client_secret=<secret>"
   # Expected: access_token in response

3. Check ServiceNow instance status
   https://status.servicenow.com
   # Is abhavtech instance healthy?

RESOLUTION:
- If token expired: Refresh token in HashiCorp Vault
  vault kv put secret/agenticops/servicenow client_secret="<new-secret>"
- If ServiceNow down: Wait for service restoration
- If config issue: Verify /etc/agenticops/servicenow_config.yaml
```

**Issue 5: High False Positive Rate**

```
SYMPTOM: DNM predicting 10+ switch failures per week, but none actually fail

POSSIBLE CAUSES:
1. DNM model threshold too sensitive
2. Seasonal patterns not learned (insufficient training data)
3. Recent network changes affecting baseline

TROUBLESHOOTING STEPS:
1. Check DNM prediction accuracy
   Catalyst Center GUI: AI Network Analytics -> DNM Dashboard
   # Precision, Recall, F1 scores

2. Review false positive examples
   index=dnac_assurance source=dnm_predictions 
   | where actual_failure=false AND predicted_failure=true
   | table device_id, prediction_confidence, features

3. Check DNM training data completeness
   show ai-network-analytics training-data
   # Expected: 90+ days of data

RESOLUTION:
- If threshold too sensitive: Tune detection threshold from 75 to 85
  Catalyst Center GUI: AI Network Analytics -> Settings
- If insufficient data: Wait for more training data (DNM improves over time)
- If network changes: Retrain model with updated baseline
  ssh admin@catalyst-center
  ai-network-analytics retrain-model switch-failure
```

### 10.2 Escalation Procedures

**Escalation Matrix:**

| Issue Type | Severity | First Responder | Escalation (if not resolved in) | Final Escalation |
|------------|----------|----------------|--------------------------------|------------------|
| Workflow failure (single) | Low | NOC Engineer | 2 hours -> NOC Lead | 4 hours -> Network Architect |
| Workflow failure (multiple) | High | NOC Lead | 1 hour -> Network Architect | 2 hours -> CTO |
| Guardrail violation | Critical | NOC Lead + CISO | Immediate | N/A (executive notification) |
| AI model degradation | Medium | Network Architect | 24 hours -> Cisco TAC | 48 hours -> Vendor escalation |
| ServiceNow outage | High | NOC Lead | 30 min -> ServiceNow CSM | 1 hour -> Emergency ticket |
| Catalyst Center outage | Critical | Network Architect | Immediate -> Cisco TAC | 30 min -> Critical TAC case |

**Escalation Contact List:**

```
NOC Engineer: noc-engineer@abhavtech.com
NOC Lead: noc-lead@abhavtech.com
Network Architect: network-arch@abhavtech.com
Security Analyst: secops@abhavtech.com
CISO: ciso@abhavtech.com
CTO: cto@abhavtech.com

Cisco TAC: +1-800-553-2447 (24/7)
ServiceNow Support: support.servicenow.com (Portal)
AppDynamics Support: support@appdynamics.com
ThousandEyes Support: support@thousandeyes.com
```

### 10.3 Emergency Procedures

**Emergency Shutdown (If AgenticOps Causing Issues):**

```bash
# CRITICAL: Use only if AgenticOps is causing network-wide issues

# Step 1: Disable all Auto mode workflows
ssh agenticops-server
cd /etc/agenticops/workflows
for workflow in WF-001 WF-002 WF-007; do
  sed -i 's/mode: auto/mode: observe/' ${workflow}.yaml
done

# Step 2: Restart AgenticOps service
systemctl restart agenticops

# Step 3: Verify workflows in Observe mode
curl -X GET http://localhost:8080/api/workflows | jq '.[] | {id, mode}'
# Expected: All workflows in "observe" mode

# Step 4: Notify team
# Send email to NOC Lead + Network Architect
# Subject: "EMERGENCY: AgenticOps disabled (auto -> observe)"

# Step 5: Investigate root cause
tail -f /var/log/agenticops/agenticops.log
# Look for error patterns
```

**Rollback All Recent Actions:**

```bash
# CRITICAL: Use if multiple workflows caused issues simultaneously

# Step 1: Identify recent actions (last 1 hour)
index=agenticops earliest=-1h action_taken=*
| table _time, workflow_id, action_name, platform, parameters

# Step 2: Rollback manually
# For each action:
#   - WF-001: Revert vManage QoS to original values
#   - WF-002: Release endpoints from quarantine (ISE + AMP)
#   - WF-007: Revert SaaS routing to original path

# Step 3: Create incident ticket
# ServiceNow: Priority Critical
# Title: "Mass rollback of AgenticOps actions - investigate"

# Step 4: Disable AgenticOps (as above)
```

---

## APPENDICES

### APPENDIX A: Acronyms & Definitions

| Acronym | Full Form | Definition |
|---------|-----------|------------|
| **AIEA** | AI Endpoint Analytics | Catalyst Center ML-driven endpoint classification |
| **ANC** | Adaptive Network Control | ISE feature for dynamic VLAN quarantine |
| **DNM** | Deep Network Model | Catalyst Center ML engine for network predictions |
| **MAPE** | Mean Absolute Percentage Error | Accuracy metric for forecasting models |
| **MOS** | Mean Opinion Score | Voice quality metric (1-5 scale, target: >4.2) |
| **MTTR** | Mean Time to Resolution | Average time from alert to resolution |
| **pxGrid** | Platform Exchange Grid | Cisco ISE API for real-time context sharing |
| **SGT** | Security Group Tag | Cisco TrustSec tag for policy enforcement |
| **XDR** | Extended Detection and Response | Cisco security platform (AMP, FTD, Umbrella) |

### APPENDIX B: Reference Commands

**Catalyst Center Commands:**

```bash
# Show version
show version

# Show cluster health
show cluster

# Show AI capabilities
show ai-capabilities

# Enable AI Assistant
configure terminal
ai-assistant enable

# Enable AIEA
configure terminal
aiea enable

# Show DNM models
show ai-network-analytics models

# Retrain DNM model
ai-network-analytics retrain-model <model-name>
```

**AgenticOps Commands:**

```bash
# Check service status
systemctl status agenticops

# View logs
tail -f /var/log/agenticops/agenticops.log

# List workflows
curl http://localhost:8080/api/workflows | jq

# Get workflow status
curl http://localhost:8080/api/workflows/WF-001 | jq

# Disable workflow
curl -X PATCH http://localhost:8080/api/workflows/WF-001 \
  -d '{"mode": "observe"}' \
  -H "Content-Type: application/json"
```

**Splunk Queries:**

```spl
# All workflow executions
index=agenticops | stats count by workflow_id

# Guardrail blocks
index=agenticops_guardrails status="BLOCKED"

# Workflow failures
index=agenticops outcome="failure"

# Performance by workflow
index=agenticops action_taken=*
| eval mttr = execution_time_seconds / 60
| stats avg(mttr) by workflow_id
```

### APPENDIX C: Configuration File Locations

```
/etc/agenticops/
├── agenticops.conf             # Main configuration
├── guardrails.yaml             # Protected SGTs
├── rate_limits.yaml            # Rate limit definitions
├── servicenow_config.yaml      # ServiceNow integration
├── workflows/
│   ├── WF-001.yaml            # Webex Optimize workflow
│   ├── WF-002.yaml            # Malware Containment workflow
│   ├── WF-003.yaml            # Client Troubleshoot workflow
│   ├── WF-004.yaml            # Capacity Alert workflow
│   ├── WF-005.yaml            # Compliance Remediate workflow
│   ├── WF-006.yaml            # Wi-Fi Optimize workflow
│   ├── WF-007.yaml            # SaaS Failover workflow
│   └── WF-008.yaml            # Insider Threat workflow
└── logs/
    ├── agenticops.log          # Main log
    ├── webhooks.log            # Webhook events
    ├── servicenow.log          # ServiceNow API calls
    └── api_errors.log          # API error log
```

### APPENDIX D: Vendor Contact Information

| Vendor | Product | Support Contact | Escalation |
|--------|---------|----------------|------------|
| **Cisco** | Catalyst Center, ISE, SD-WAN | TAC: +1-800-553-2447 | Account Manager: [Contact] |
| **Cisco** | XDR (AMP, FTD, Umbrella) | TAC: +1-800-553-2447 | Security Specialist: [Contact] |
| **Splunk** | Observability Cloud | support@splunk.com | Account Manager: [Contact] |
| **AppDynamics** | APM, Cognition Engine | support@appdynamics.com | TAM: [Contact] |
| **ThousandEyes** | Internet/WAN Monitoring | support@thousandeyes.com | SE: [Contact] |
| **ServiceNow** | ITSM/ITOM | Support Portal | CSM: [Contact] |

### APPENDIX E: Training Resources

**NOC Engineer Training (8 hours):**

```
HOUR 1: AI-Ready Network Overview
- Multi-AI ecosystem architecture
- AgenticOps principles

HOUR 2-3: Catalyst Center AI Features
- AI Assistant: Natural language queries
- AI Endpoint Analytics
- Deep Network Model

HOUR 4-6: AgenticOps Workflows
- WF-001 to WF-008: Triggers, actions, guardrails
- Hands-on labs

HOUR 7: Approval Workflows
- ServiceNow approval process
- Hands-on: Approve WF-006

HOUR 8: Troubleshooting & Operations
- Common issues
- Dashboard navigation
- Escalation procedures
```

**Certification:**
- NOC Engineer AgenticOps Certification (NEAC)
- Exam: 50 questions, 80% passing score
- Valid: 1 year

### APPENDIX F: Compliance & Standards

**Regulatory Compliance:**
- GDPR: Endpoint data processing complies with Article 6
- HIPAA: OT/Medical devices (SGT-60) protected
- SOX: Financial servers (SGT-80) excluded
- PCI-DSS: Payment servers (SGT-83) protected

**Industry Standards:**
- NIST Cybersecurity Framework: Aligns with all 5 functions
- ITIL v4: ServiceNow integration follows ITIL practices
- ISO 27001: Audit trails support compliance

### APPENDIX G: Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v1.0 | 2026-01-18 | Network Architect | Initial release |

### APPENDIX H: Glossary

**Autonomous Mode:** Workflow executes actions automatically without human approval (WF-001, WF-002, WF-007)

**Approve Mode:** Workflow generates recommendation, requires approval before execution (WF-005, WF-006)

**Guardrail:** Protection mechanism preventing AI actions on critical infrastructure (SGT 11, 60, 80-83)

**Manual Mode:** Workflow provides AI assistance, human executes actions (WF-003, WF-004, WF-008)

**Observe Mode:** Workflow logs recommendations only, no automated actions (Phase 3C testing)

**Rollback:** Automatic reversion of action if expected outcome not achieved (30-minute timeout)

---

## DOCUMENT COMPLETION

**Document Status:** Complete (All Sections + Appendices)

**Total Pages:** ~150 pages (detailed implementation level)

**Document History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| v1.0 | 2026-01-18 | Automation Engineer | Complete implementation guide with all workflows, runbooks, troubleshooting |

---

© 2025 Abhavtech.com - Confidential - Document 3B: AI-Ready Network - Detailed Implementation Guide v1.0

---

**END OF DOCUMENT 3B**

This document provides complete implementation specifications for Phase 3 (AI-Ready Network). For architectural overview and high-level specifications, refer to **Document 3: AI-Ready Network Architecture**.
