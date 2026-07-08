# 6.13 Operational Runbooks

## Document Information
- **Version**: 1.0
- **Last Updated**: December 2025
- **Author**: Abhavtech Network Team
- **Classification**: Internal Use

## Overview

This section provides comprehensive operational runbooks for managing Abhavtech's SD-WAN infrastructure. Runbooks define standardized procedures for routine operations, ensuring consistency and reducing operational risk.

## Runbook Structure

### Standard Runbook Format

```yaml
runbook_template:
  metadata:
    title: "Runbook Title"
    version: "1.0"
    author: "Network Team"
    last_updated: "2025-12-30"
    frequency: "Daily/Weekly/Monthly/Quarterly/As Needed"
    estimated_duration: "XX minutes"
    skill_level: "L1/L2/L3"
  
  prerequisites:
    - "Prerequisite 1"
    - "Prerequisite 2"
  
  procedure:
    steps:
      - step: 1
        action: "Action description"
        commands: ["command1", "command2"]
        expected_result: "What should happen"
        troubleshooting: "What to do if it fails"
  
  validation:
    - "Validation step 1"
    - "Validation step 2"
  
  rollback:
    - "Rollback step if needed"
  
  references:
    - "Reference document 1"
```

## Daily Runbooks

### RB-D001: Daily Health Check

```yaml
runbook:
  id: "RB-D001"
  title: "Daily SD-WAN Health Check"
  frequency: "Daily (08:00 IST)"
  duration: "30 minutes"
  skill_level: "L1"

prerequisites:
  - "vManage access"
  - "Monitoring dashboard access"
  - "Health check script available"

procedure:
  steps:
    - step: 1
      action: "Login to vManage dashboard"
      url: "https://vmanage.abhavtech.com"
      expected: "Dashboard displays successfully"
    
    - step: 2
      action: "Check overall system health"
      navigation: "Dashboard > Main Dashboard"
      checks:
        - "All controllers green"
        - "No critical alarms"
        - "Device count matches expected (16 WAN Edges)"
    
    - step: 3
      action: "Verify controller status"
      navigation: "Administration > Cluster Management"
      checks:
        - "vManage cluster: 3 nodes operational"
        - "vSmart: 2 nodes operational"
        - "vBond: 2 nodes operational"
    
    - step: 4
      action: "Check WAN Edge device status"
      navigation: "Monitor > Network > WAN Edge"
      checks:
        - "All devices showing 'reachable'"
        - "Control connections: green"
        - "BFD sessions: established"
    
    - step: 5
      action: "Review active alarms"
      navigation: "Monitor > Alarms"
      filters:
        - "Active alarms only"
        - "Last 24 hours"
      actions:
        - "Document new critical/major alarms"
        - "Create tickets for unacknowledged issues"
    
    - step: 6
      action: "Check tunnel status"
      navigation: "Monitor > Network > Tunnel"
      checks:
        - "All expected tunnels UP"
        - "No persistent BFD flaps"
        - "Loss/latency within thresholds"
    
    - step: 7
      action: "Verify SD-Access integration"
      navigation: "Monitor > Network > SD-Access"
      checks:
        - "BGP sessions established with borders"
        - "Routes being exchanged"
        - "No handoff interface errors"
    
    - step: 8
      action: "Check resource utilization"
      navigation: "Monitor > Network > Device"
      thresholds:
        cpu_warning: 70
        memory_warning: 75
        disk_warning: 80
    
    - step: 9
      action: "Review application performance"
      navigation: "Monitor > Applications"
      checks:
        - "Top applications identified"
        - "AAR working correctly"
        - "No SLA violations"
    
    - step: 10
      action: "Document findings"
      actions:
        - "Complete daily health check form"
        - "Update NOC handover notes"
        - "Escalate critical issues"

validation:
  - "Health check form completed"
  - "All critical issues escalated"
  - "NOC handover updated"

automation_script: |
  #!/bin/bash
  # Daily Health Check Script
  
  VMANAGE="vmanage.abhavtech.com"
  OUTPUT="/var/log/sdwan/daily-health-$(date +%Y%m%d).log"
  
  echo "=== SD-WAN Daily Health Check ===" > $OUTPUT
  echo "Date: $(date)" >> $OUTPUT
  echo "" >> $OUTPUT
  
  # Check controller status
  echo "=== Controller Status ===" >> $OUTPUT
  curl -s -k -u admin:password \
    "https://$VMANAGE/dataservice/clusterManagement/health/status" \
    | jq '.data' >> $OUTPUT
  
  # Check device status
  echo "=== Device Status ===" >> $OUTPUT
  curl -s -k -u admin:password \
    "https://$VMANAGE/dataservice/device" \
    | jq '.data[] | {hostname, status, reachability}' >> $OUTPUT
  
  # Check active alarms
  echo "=== Active Alarms ===" >> $OUTPUT
  curl -s -k -u admin:password \
    "https://$VMANAGE/dataservice/alarms?query={\"query\":{\"condition\":\"AND\",\"rules\":[{\"field\":\"active\",\"value\":[\"true\"]}]}}" \
    | jq '.data | length' >> $OUTPUT
  
  echo "" >> $OUTPUT
  echo "Health check completed at $(date)" >> $OUTPUT
```

### RB-D002: Daily Backup Verification

```yaml
runbook:
  id: "RB-D002"
  title: "Daily Backup Verification"
  frequency: "Daily (09:00 IST)"
  duration: "15 minutes"
  skill_level: "L1"

prerequisites:
  - "Backup server access"
  - "vManage API access"

procedure:
  steps:
    - step: 1
      action: "Verify vManage database backup completed"
      location: "/backups/sdwan/vmanage/"
      check: "backup-$(date -d yesterday +%Y%m%d)*.tar.gz exists"
      command: "ls -la /backups/sdwan/vmanage/backup-$(date -d yesterday +%Y%m%d)*.tar.gz"
    
    - step: 2
      action: "Verify backup file size"
      expected: "Size > 100MB (typical)"
      command: "du -h /backups/sdwan/vmanage/backup-$(date -d yesterday +%Y%m%d)*.tar.gz"
    
    - step: 3
      action: "Verify backup integrity"
      command: "tar -tzf /backups/sdwan/vmanage/backup-*.tar.gz > /dev/null && echo 'OK'"
    
    - step: 4
      action: "Check incremental backups"
      expected: "4 incremental backups (every 6 hours)"
      command: "ls -la /backups/sdwan/vmanage/incremental-$(date -d yesterday +%Y%m%d)*.tar.gz"
    
    - step: 5
      action: "Verify offsite replication"
      check: "S3 sync completed"
      command: "aws s3 ls s3://abhavtech-backups/sdwan/ --recursive | grep $(date -d yesterday +%Y%m%d)"
    
    - step: 6
      action: "Update backup log"
      location: "/var/log/sdwan/backup-verification.log"
    
    - step: 7
      action: "Alert if backup failed"
      condition: "Any step failed"
      action: "Create incident ticket INC-BACKUP-FAILED"

validation:
  - "All backup files present"
  - "Backup sizes within expected range"
  - "Offsite replication confirmed"
  - "Backup log updated"
```

### RB-D003: Daily Certificate Check

```yaml
runbook:
  id: "RB-D003"
  title: "Daily Certificate Expiry Check"
  frequency: "Daily (10:00 IST)"
  duration: "10 minutes"
  skill_level: "L1"

procedure:
  steps:
    - step: 1
      action: "Check controller certificates"
      command: |
        curl -s -k "https://vmanage.abhavtech.com/dataservice/certificate/record" \
          | jq '.data[] | select(.daysToExpiry < 60)'
    
    - step: 2
      action: "Check WAN Edge certificates"
      command: |
        curl -s -k "https://vmanage.abhavtech.com/dataservice/certificate/vedge/list" \
          | jq '.data[] | select(.validity.daysToExpiry < 60)'
    
    - step: 3
      action: "Alert on expiring certificates"
      thresholds:
        - "30 days: Warning - Plan renewal"
        - "14 days: Critical - Immediate action"
        - "7 days: Emergency - Escalate to management"
    
    - step: 4
      action: "Document expiring certificates"
      create_ticket: true
      priority: "Based on days to expiry"

automation_script: |
  #!/usr/bin/env python3
  """Daily Certificate Check"""
  import requests
  import json
  from datetime import datetime
  
  VMANAGE = "vmanage.abhavtech.com"
  
  session = requests.Session()
  session.verify = False
  session.post(f"https://{VMANAGE}/j_security_check", 
               data={'j_username': 'admin', 'j_password': 'password'})
  
  # Get certificates
  response = session.get(f"https://{VMANAGE}/dataservice/certificate/vedge/list")
  certs = response.json().get('data', [])
  
  expiring = []
  for cert in certs:
      days = cert.get('validity', {}).get('daysToExpiry', 999)
      if days < 60:
          expiring.append({
              'device': cert.get('host-name'),
              'serial': cert.get('serialNumber'),
              'days_to_expiry': days
          })
  
  if expiring:
      print("ALERT: Certificates expiring soon:")
      for c in expiring:
          print(f"  {c['device']}: {c['days_to_expiry']} days")
  else:
      print("OK: No certificates expiring within 60 days")
```

## Weekly Runbooks

### RB-W001: Weekly Performance Review

```yaml
runbook:
  id: "RB-W001"
  title: "Weekly Performance Review"
  frequency: "Weekly (Monday 10:00 IST)"
  duration: "45 minutes"
  skill_level: "L2"

procedure:
  steps:
    - step: 1
      action: "Generate weekly performance report"
      command: |
        curl -s -k "https://vmanage.abhavtech.com/dataservice/statistics/approute/aggregation" \
          -d '{"query":{"field":"entry_time","type":"date","value":"last_7_days"}}' \
          > /tmp/weekly-perf.json
    
    - step: 2
      action: "Review tunnel performance"
      metrics:
        - "Average latency per site pair"
        - "Packet loss trends"
        - "Jitter measurements"
      thresholds:
        latency_warning: "10% above baseline"
        loss_warning: ">0.5%"
        jitter_warning: ">30ms"
    
    - step: 3
      action: "Analyze application performance"
      review:
        - "Top 20 applications by bandwidth"
        - "AAR path selections"
        - "SLA violations by application"
    
    - step: 4
      action: "Check bandwidth utilization"
      per_site:
        - "Peak utilization"
        - "Average utilization"
        - "Utilization trends"
      threshold: "Alert if avg >70% or peak >90%"
    
    - step: 5
      action: "Review SD-Access integration"
      checks:
        - "BGP route count stability"
        - "Handoff interface errors"
        - "VRF traffic distribution"
    
    - step: 6
      action: "Identify optimization opportunities"
      areas:
        - "Underutilized circuits"
        - "High-latency paths"
        - "Application classification issues"
    
    - step: 7
      action: "Create performance report"
      template: "/templates/weekly-performance-report.md"
      distribution:
        - "network-ops@abhavtech.com"
        - "it-management@abhavtech.com"

report_template: |
  # Weekly SD-WAN Performance Report
  ## Week of [DATE]
  
  ### Executive Summary
  - Overall Health: [GREEN/YELLOW/RED]
  - Sites Monitored: 9
  - Total Bandwidth: [X TB]
  - SLA Achievement: [X%]
  
  ### Key Metrics
  | Metric | This Week | Last Week | Trend |
  |--------|-----------|-----------|-------|
  | Avg Latency | Xms | Xms | ↑/↓ |
  | Packet Loss | X% | X% | ↑/↓ |
  | Availability | X% | X% | ↑/↓ |
  
  ### Top Applications
  [Table of top 10 apps]
  
  ### Issues & Actions
  [List of issues identified and actions taken]
  
  ### Recommendations
  [Optimization recommendations]
```

### RB-W002: Weekly Security Review

```yaml
runbook:
  id: "RB-W002"
  title: "Weekly Security Review"
  frequency: "Weekly (Tuesday 10:00 IST)"
  duration: "30 minutes"
  skill_level: "L2"

procedure:
  steps:
    - step: 1
      action: "Review security events"
      navigation: "Monitor > Security"
      period: "Last 7 days"
      categories:
        - "IPS events"
        - "URL filtering blocks"
        - "Malware detections"
    
    - step: 2
      action: "Check zone-based firewall logs"
      focus:
        - "Denied connections"
        - "Policy violations"
        - "Unusual traffic patterns"
    
    - step: 3
      action: "Review failed authentication attempts"
      sources:
        - "vManage admin logins"
        - "Device CLI access"
        - "API authentication"
    
    - step: 4
      action: "Verify encryption status"
      checks:
        - "All tunnels using AES-256-GCM"
        - "No weak cipher negotiations"
        - "Control plane DTLS active"
    
    - step: 5
      action: "Check for configuration drift"
      compare:
        - "Current vs intended security config"
        - "Firewall rules vs baseline"
        - "SGT mappings vs policy"
    
    - step: 6
      action: "Review vulnerability advisories"
      sources:
        - "Cisco PSIRT"
        - "CVE database"
      action: "Document any applicable advisories"
    
    - step: 7
      action: "Update security report"
      distribution: "security-team@abhavtech.com"
```

### RB-W003: Weekly Capacity Review

```yaml
runbook:
  id: "RB-W003"
  title: "Weekly Capacity Review"
  frequency: "Weekly (Wednesday 10:00 IST)"
  duration: "30 minutes"
  skill_level: "L2"

procedure:
  steps:
    - step: 1
      action: "Collect bandwidth utilization data"
      script: |
        # Get interface statistics for all WAN edges
        for site in mumbai chennai bangalore delhi noida london frankfurt newjersey dallas; do
          echo "=== $site ===" >> /tmp/capacity-$(date +%Y%m%d).log
          # Interface utilization query
        done
    
    - step: 2
      action: "Calculate utilization metrics"
      per_circuit:
        - "Average utilization (7-day)"
        - "Peak utilization"
        - "95th percentile"
        - "Growth rate vs last month"
    
    - step: 3
      action: "Review tunnel capacity"
      metrics:
        - "Tunnel count per device"
        - "Tunnel throughput"
        - "Crypto accelerator utilization"
    
    - step: 4
      action: "Check device resources"
      thresholds:
        cpu_avg: "<60%"
        memory_avg: "<70%"
        sessions: "<80% of max"
    
    - step: 5
      action: "Identify capacity concerns"
      criteria:
        - "Circuits approaching 80% utilization"
        - "Devices with high resource usage"
        - "Sites with rapid growth"
    
    - step: 6
      action: "Update capacity planning document"
      forecast:
        - "30-day projection"
        - "90-day projection"
        - "Upgrade recommendations"
    
    - step: 7
      action: "Create capacity report"
      include:
        - "Current utilization summary"
        - "Trend analysis"
        - "Upgrade recommendations"
        - "Budget implications"

capacity_report_template: |
  # Weekly Capacity Report
  ## Week of [DATE]
  
  ### Current Utilization Summary
  | Site | Circuit | Avg Util | Peak Util | 95th %ile | Status |
  |------|---------|----------|-----------|-----------|--------|
  | Mumbai | MPLS | X% | X% | X% | OK/WARN |
  
  ### Capacity Alerts
  [List circuits approaching thresholds]
  
  ### Growth Trends
  [Month-over-month growth analysis]
  
  ### Recommendations
  [Upgrade or optimization recommendations]
```

## Monthly Runbooks

### RB-M001: Monthly System Review

```yaml
runbook:
  id: "RB-M001"
  title: "Monthly SD-WAN System Review"
  frequency: "Monthly (First Monday)"
  duration: "2 hours"
  skill_level: "L2/L3"

procedure:
  steps:
    - step: 1
      action: "Generate monthly metrics"
      data_points:
        - "Availability: % uptime per site"
        - "Performance: Latency, loss, jitter averages"
        - "Incidents: Count by severity"
        - "Changes: Count by type"
    
    - step: 2
      action: "Review SLA achievement"
      slas:
        - "Network availability: 99.95%"
        - "Incident response: Per severity"
        - "Change success rate: >95%"
    
    - step: 3
      action: "Analyze incident trends"
      review:
        - "Root causes by category"
        - "Repeat incidents"
        - "MTTR trends"
    
    - step: 4
      action: "Review change management"
      metrics:
        - "Changes executed"
        - "Success/failure rate"
        - "Emergency change ratio"
    
    - step: 5
      action: "Conduct configuration audit"
      checks:
        - "Template compliance"
        - "Policy consistency"
        - "Naming standards"
    
    - step: 6
      action: "Review backup and DR"
      verify:
        - "Backup success rate"
        - "Restore test results"
        - "DR readiness"
    
    - step: 7
      action: "Software compliance check"
      verify:
        - "All devices on approved version"
        - "No EOL software"
        - "Pending upgrades planned"
    
    - step: 8
      action: "License compliance"
      verify:
        - "Feature licenses active"
        - "Smart licensing status"
        - "Renewal dates"
    
    - step: 9
      action: "Prepare monthly report"
      sections:
        - "Executive summary"
        - "Availability metrics"
        - "Performance metrics"
        - "Incident summary"
        - "Change summary"
        - "Recommendations"
    
    - step: 10
      action: "Schedule monthly review meeting"
      attendees:
        - "Network Operations"
        - "IT Management"
        - "Security Team"
```

### RB-M002: Monthly Restore Test

```yaml
runbook:
  id: "RB-M002"
  title: "Monthly Backup Restore Test"
  frequency: "Monthly (First Saturday 02:00 IST)"
  duration: "4 hours"
  skill_level: "L3"
  environment: "Lab only"

procedure:
  steps:
    - step: 1
      action: "Prepare lab environment"
      requirements:
        - "Lab vManage VM ready"
        - "Network connectivity to backup storage"
        - "Sufficient resources allocated"
    
    - step: 2
      action: "Select backup for testing"
      criteria:
        - "Most recent full backup"
        - "From production environment"
        - "Within last 7 days"
    
    - step: 3
      action: "Restore vManage database"
      commands:
        - "Copy backup to lab vManage"
        - "Stop NMS services"
        - "Execute restore"
        - "Start NMS services"
      expected_duration: "60 minutes"
    
    - step: 4
      action: "Verify restore completeness"
      checks:
        - "Device inventory matches production"
        - "Templates restored correctly"
        - "Policies intact"
        - "User accounts present"
    
    - step: 5
      action: "Test template functionality"
      tests:
        - "View device templates"
        - "Preview template attachment"
        - "Verify variable values"
    
    - step: 6
      action: "Test policy functionality"
      tests:
        - "View centralized policies"
        - "Verify policy structure"
        - "Check security policies"
    
    - step: 7
      action: "Document restore test results"
      report:
        - "Start/end times"
        - "Any errors encountered"
        - "Data integrity verification"
        - "Overall pass/fail"
    
    - step: 8
      action: "Clean up lab environment"
      actions:
        - "Reset lab vManage"
        - "Clear test data"
        - "Return resources"
    
    - step: 9
      action: "Update DR documentation"
      if_issues:
        - "Document any problems"
        - "Create remediation tasks"
        - "Update restore procedures"

success_criteria:
  - "Restore completes without errors"
  - "All configuration data accessible"
  - "Templates and policies functional"
  - "Data matches production within RPO"
```

### RB-M003: Monthly Security Audit

```yaml
runbook:
  id: "RB-M003"
  title: "Monthly Security Audit"
  frequency: "Monthly (Second Monday)"
  duration: "3 hours"
  skill_level: "L2/L3"

procedure:
  steps:
    - step: 1
      action: "Review admin account activity"
      checks:
        - "Active admin accounts vs authorized list"
        - "Last login for each account"
        - "Failed login attempts"
        - "Password age compliance"
    
    - step: 2
      action: "Audit API access"
      review:
        - "API tokens in use"
        - "API call patterns"
        - "Unauthorized API attempts"
    
    - step: 3
      action: "Verify encryption compliance"
      checks:
        - "All tunnels: AES-256-GCM"
        - "Control plane: DTLS 1.2"
        - "No deprecated ciphers"
    
    - step: 4
      action: "Review firewall rules"
      audit:
        - "Zone-based policies current"
        - "No overly permissive rules"
        - "Logging enabled on deny rules"
    
    - step: 5
      action: "Check certificate status"
      verify:
        - "Root CA validity"
        - "Device certificates"
        - "Certificate chain integrity"
    
    - step: 6
      action: "Review security policy effectiveness"
      metrics:
        - "Blocked threats"
        - "URL filtering actions"
        - "IPS detections"
    
    - step: 7
      action: "Vulnerability assessment"
      check:
        - "Current software vs known vulnerabilities"
        - "Open CVEs applicable to deployment"
        - "Patch status"
    
    - step: 8
      action: "SGT/TrustSec audit"
      verify:
        - "SGT propagation working"
        - "Policy enforcement correct"
        - "No SGT mismatches"
    
    - step: 9
      action: "Generate security audit report"
      include:
        - "Compliance score"
        - "Findings by severity"
        - "Remediation recommendations"
        - "Trend vs previous month"
```

## Quarterly Runbooks

### RB-Q001: Quarterly DR Test

```yaml
runbook:
  id: "RB-Q001"
  title: "Quarterly Disaster Recovery Test"
  frequency: "Quarterly (First Sunday of Q1/Q2/Q3/Q4)"
  duration: "8 hours"
  skill_level: "L3"
  approval_required: "IT Director"

procedure:
  steps:
    - step: 1
      action: "Pre-DR test preparation (T-7 days)"
      tasks:
        - "Schedule change request"
        - "Notify stakeholders"
        - "Verify DR site readiness"
        - "Update DR runbook if needed"
    
    - step: 2
      action: "Pre-DR test checks (T-1 day)"
      verify:
        - "DR vManage cluster healthy"
        - "Latest backup available"
        - "Network connectivity to DR"
        - "On-call team confirmed"
    
    - step: 3
      action: "Initiate DR failover (T+0)"
      sequence:
        - "Document current state"
        - "Update DNS for controllers"
        - "Activate DR vManage"
        - "Verify controller connectivity"
    
    - step: 4
      action: "Verify WAN Edge reconnection"
      checks:
        - "All WAN Edges connect to DR controllers"
        - "Control plane established"
        - "OMP routes exchanged"
    
    - step: 5
      action: "Validate data plane"
      tests:
        - "Inter-site connectivity"
        - "Application performance"
        - "SD-Access integration"
    
    - step: 6
      action: "Execute DR test scenarios"
      scenarios:
        - "Basic connectivity test"
        - "Application performance test"
        - "Failover/failback test"
    
    - step: 7
      action: "Document test results"
      metrics:
        - "RTO achieved vs target"
        - "RPO achieved vs target"
        - "Issues encountered"
    
    - step: 8
      action: "Failback to primary"
      sequence:
        - "Revert DNS changes"
        - "Verify primary cluster health"
        - "WAN Edges reconnect to primary"
        - "Validate all services"
    
    - step: 9
      action: "Post-DR test review"
      tasks:
        - "Complete DR test report"
        - "Update DR procedures"
        - "Create remediation tasks"
        - "Schedule review meeting"

success_criteria:
  rto_target: "4 hours"
  rpo_target: "1 hour"
  connectivity_target: "100% sites reconnected"
  performance_target: "Within 10% of normal"
```

### RB-Q002: Quarterly License Audit

```yaml
runbook:
  id: "RB-Q002"
  title: "Quarterly License Audit"
  frequency: "Quarterly"
  duration: "2 hours"
  skill_level: "L2"

procedure:
  steps:
    - step: 1
      action: "Export current license status"
      command: |
        curl -s -k "https://vmanage.abhavtech.com/dataservice/license/status" \
          | jq '.' > /tmp/license-audit-$(date +%Y%m%d).json
    
    - step: 2
      action: "Verify DNA licenses"
      check:
        - "DNA Advantage tier licenses"
        - "License count vs device count"
        - "Expiration dates"
    
    - step: 3
      action: "Verify feature licenses"
      features:
        - "AppQoE (TCP/DRE)"
        - "Cloud OnRamp"
        - "Security features"
    
    - step: 4
      action: "Check Smart Licensing status"
      verify:
        - "Registration status"
        - "Smart account sync"
        - "Authorization status"
    
    - step: 5
      action: "Compare usage vs entitlement"
      report:
        - "Used licenses"
        - "Available licenses"
        - "Compliance status"
    
    - step: 6
      action: "Identify upcoming renewals"
      threshold: "90 days"
      action: "Create procurement request"
    
    - step: 7
      action: "Generate license audit report"
      distribution:
        - "IT Management"
        - "Procurement"
        - "Finance"
```

## Annual Runbooks

### RB-A001: Annual Architecture Review

```yaml
runbook:
  id: "RB-A001"
  title: "Annual Architecture Review"
  frequency: "Annual (January)"
  duration: "Full day"
  skill_level: "L3"
  participants:
    - "Network Architecture"
    - "Security Architecture"
    - "IT Management"
    - "Business Stakeholders"

agenda:
  morning:
    - topic: "Current State Review"
      duration: "2 hours"
      items:
        - "Infrastructure overview"
        - "Performance metrics (annual)"
        - "Incident trends"
        - "Cost analysis"
    
    - topic: "Technology Assessment"
      duration: "1 hour"
      items:
        - "Current capabilities"
        - "Feature utilization"
        - "Technical debt"
  
  afternoon:
    - topic: "Future Requirements"
      duration: "1.5 hours"
      items:
        - "Business growth plans"
        - "New site requirements"
        - "Application roadmap"
        - "Security requirements"
    
    - topic: "Technology Roadmap"
      duration: "1.5 hours"
      items:
        - "Vendor roadmap review"
        - "Feature adoption plan"
        - "Upgrade planning"
        - "Innovation opportunities"
    
    - topic: "Action Planning"
      duration: "1 hour"
      items:
        - "Prioritized initiatives"
        - "Resource requirements"
        - "Timeline"
        - "Budget requirements"

deliverables:
  - "Architecture review document"
  - "Annual roadmap"
  - "Budget proposal"
  - "Action items with owners"
```

## Runbook Automation

### Automated Runbook Executor

```python
#!/usr/bin/env python3
"""
Automated Runbook Executor
Executes scheduled runbooks and tracks completion
"""

import schedule
import time
import logging
from datetime import datetime
from typing import Dict, Callable
import subprocess
import json

class RunbookExecutor:
    def __init__(self):
        self.runbooks = {}
        self.execution_log = []
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
    
    def register_runbook(
        self,
        runbook_id: str,
        name: str,
        script_path: str,
        schedule_spec: str
    ):
        """Register a runbook for automated execution"""
        self.runbooks[runbook_id] = {
            'name': name,
            'script': script_path,
            'schedule': schedule_spec,
            'last_run': None,
            'last_status': None
        }
    
    def execute_runbook(self, runbook_id: str) -> Dict:
        """Execute a specific runbook"""
        if runbook_id not in self.runbooks:
            return {'status': 'error', 'message': f'Runbook {runbook_id} not found'}
        
        runbook = self.runbooks[runbook_id]
        logging.info(f"Executing runbook: {runbook['name']}")
        
        start_time = datetime.now()
        
        try:
            result = subprocess.run(
                ['bash', runbook['script']],
                capture_output=True,
                text=True,
                timeout=3600  # 1 hour timeout
            )
            
            status = 'success' if result.returncode == 0 else 'failed'
            
        except subprocess.TimeoutExpired:
            status = 'timeout'
            result = None
        except Exception as e:
            status = 'error'
            result = None
            logging.error(f"Runbook execution error: {e}")
        
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        execution_record = {
            'runbook_id': runbook_id,
            'name': runbook['name'],
            'start_time': start_time.isoformat(),
            'end_time': end_time.isoformat(),
            'duration_seconds': duration,
            'status': status,
            'output': result.stdout if result else None,
            'errors': result.stderr if result else None
        }
        
        self.execution_log.append(execution_record)
        self.runbooks[runbook_id]['last_run'] = start_time.isoformat()
        self.runbooks[runbook_id]['last_status'] = status
        
        logging.info(f"Runbook {runbook_id} completed with status: {status}")
        
        return execution_record
    
    def setup_schedules(self):
        """Setup scheduled execution for all runbooks"""
        
        # Daily health check at 08:00
        schedule.every().day.at("08:00").do(
            self.execute_runbook, "RB-D001"
        )
        
        # Daily backup verification at 09:00
        schedule.every().day.at("09:00").do(
            self.execute_runbook, "RB-D002"
        )
        
        # Daily certificate check at 10:00
        schedule.every().day.at("10:00").do(
            self.execute_runbook, "RB-D003"
        )
        
        # Weekly performance review (Monday 10:00)
        schedule.every().monday.at("10:00").do(
            self.execute_runbook, "RB-W001"
        )
        
        # Weekly security review (Tuesday 10:00)
        schedule.every().tuesday.at("10:00").do(
            self.execute_runbook, "RB-W002"
        )
        
        # Weekly capacity review (Wednesday 10:00)
        schedule.every().wednesday.at("10:00").do(
            self.execute_runbook, "RB-W003"
        )
    
    def run_scheduler(self):
        """Run the schedule executor"""
        logging.info("Starting runbook scheduler")
        
        while True:
            schedule.run_pending()
            time.sleep(60)
    
    def get_execution_report(self, days: int = 7) -> str:
        """Generate execution report for recent runbooks"""
        report = f"""
RUNBOOK EXECUTION REPORT
========================
Period: Last {days} days
Generated: {datetime.now().isoformat()}

REGISTERED RUNBOOKS
-------------------
"""
        for rb_id, rb in self.runbooks.items():
            report += f"\n{rb_id}: {rb['name']}\n"
            report += f"  Last Run: {rb['last_run'] or 'Never'}\n"
            report += f"  Last Status: {rb['last_status'] or 'N/A'}\n"
        
        report += """
RECENT EXECUTIONS
-----------------
"""
        # Filter to recent executions
        cutoff = datetime.now().timestamp() - (days * 86400)
        recent = [
            e for e in self.execution_log
            if datetime.fromisoformat(e['start_time']).timestamp() > cutoff
        ]
        
        for execution in recent:
            report += f"\n{execution['name']} ({execution['runbook_id']})\n"
            report += f"  Time: {execution['start_time']}\n"
            report += f"  Duration: {execution['duration_seconds']:.0f}s\n"
            report += f"  Status: {execution['status']}\n"
        
        return report


# Example usage
if __name__ == "__main__":
    executor = RunbookExecutor()
    
    # Register runbooks
    executor.register_runbook(
        "RB-D001",
        "Daily Health Check",
        "/opt/sdwan/runbooks/daily-health-check.sh",
        "daily@08:00"
    )
    
    executor.register_runbook(
        "RB-D002",
        "Daily Backup Verification",
        "/opt/sdwan/runbooks/daily-backup-verify.sh",
        "daily@09:00"
    )
    
    # Setup schedules
    executor.setup_schedules()
    
    # Print status
    print(executor.get_execution_report())
    
    # Run scheduler (uncomment for production)
    # executor.run_scheduler()
```

## Quick Reference

### Runbook Schedule Summary

```
+------------------------------------------------------------------+
|                    RUNBOOK SCHEDULE SUMMARY                       |
+------------------------------------------------------------------+
|                                                                    |
|  DAILY                                                            |
|  -----                                                            |
|  08:00 IST  RB-D001  Daily Health Check           L1   30 min    |
|  09:00 IST  RB-D002  Daily Backup Verification    L1   15 min    |
|  10:00 IST  RB-D003  Daily Certificate Check      L1   10 min    |
|                                                                    |
|  WEEKLY                                                           |
|  ------                                                           |
|  Mon 10:00  RB-W001  Weekly Performance Review    L2   45 min    |
|  Tue 10:00  RB-W002  Weekly Security Review       L2   30 min    |
|  Wed 10:00  RB-W003  Weekly Capacity Review       L2   30 min    |
|                                                                    |
|  MONTHLY                                                          |
|  -------                                                          |
|  1st Mon    RB-M001  Monthly System Review        L2   2 hours   |
|  1st Sat    RB-M002  Monthly Restore Test         L3   4 hours   |
|  2nd Mon    RB-M003  Monthly Security Audit       L2   3 hours   |
|                                                                    |
|  QUARTERLY                                                        |
|  ---------                                                        |
|  Q1/Q2/Q3/Q4 1st Sun  RB-Q001  DR Test            L3   8 hours   |
|  Quarterly            RB-Q002  License Audit      L2   2 hours   |
|                                                                    |
|  ANNUAL                                                           |
|  ------                                                           |
|  January    RB-A001  Architecture Review          L3   Full day  |
|                                                                    |
+------------------------------------------------------------------+
```

---

*Document version: 1.0*
*Last updated: December 2025*
*Classification: Internal Use*
