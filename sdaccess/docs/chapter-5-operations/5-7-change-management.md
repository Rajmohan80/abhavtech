# 5.7 Change Management

### 5.7.1 Change Types

| Type | Description | Approval | Lead Time | Window |
|------|-------------|----------|-----------|--------|
| Standard | Pre-approved, low risk | Auto-approved | 24 hours | Anytime |
| Normal | Planned, documented | CAB | 5 business days | Maintenance |
| Emergency | Critical fix required | Emergency CAB | 2 hours | Immediate |
| Major | High impact, multiple sites | CAB + Steering | 10 business days | Weekend |

### 5.7.2 Change Request Template

```yaml
# CHANGE REQUEST FORM

CR_Number: CHG-XXXXXX
Requestor: [Name]
Date_Submitted: YYYY-MM-DD

# Change Details
Title: [Short description]
Description: |
  [Detailed description of the change]
  
Change_Type: [Standard | Normal | Emergency | Major]
Category: [Network | Security | Application | Infrastructure]
Priority: [Low | Medium | High | Critical]

# Scope
Affected_Systems:
  - [Device/System 1]
  - [Device/System 2]
  
Affected_Sites:
  - [Site 1]
  - [Site 2]
  
Affected_Users: [Number]

# Schedule
Requested_Date: YYYY-MM-DD
Requested_Time: HH:MM UTC
Estimated_Duration: [X hours]
Maintenance_Window: [Yes/No]

# Risk Assessment
Risk_Level: [Low | Medium | High]
Risk_Description: |
  [Potential risks and mitigations]
  
# Implementation Plan
Pre_Change_Steps:
  1. [Step 1]
  2. [Step 2]
  
Change_Steps:
  1. [Step 1]
  2. [Step 2]
  
Post_Change_Steps:
  1. [Validation 1]
  2. [Validation 2]
  
# Rollback Plan
Rollback_Trigger: [Conditions for rollback]
Rollback_Steps:
  1. [Step 1]
  2. [Step 2]
Rollback_Duration: [X minutes]

# Approvals
Technical_Approval: [Name] Date: _______
Business_Approval: [Name] Date: _______
CAB_Approval: [Date of CAB meeting]
```

### 5.7.3 DNAC Configuration Archive

```yaml
# Design > Network Settings > Configuration Archive

Archive_Settings:
  Schedule: Daily at 02:00 UTC
  Retention: 90 days
  Storage: Local + External SFTP
  
  External_Repository:
    Type: SFTP
    Server: config-backup.corp.local
    Path: /backups/dnac-configs/
    Username: backup-user
    Authentication: SSH Key
    
Compare_Configurations:
  # Tools > Configuration Archive > Compare
  Baseline: [Select reference config]
  Current: [Select current config]
  View: Side-by-side diff
  
Configuration_Compliance:
  # Provision > Templates > Compliance
  Enable: Yes
  Check_Interval: 24 hours
  Alert_on_Drift: Yes
  Auto_Remediate: No (manual approval)
```

### 5.7.4 Change Calendar

```
+------------------------------------------------------------------+
|                    MONTHLY CHANGE CALENDAR                        |
+------------------------------------------------------------------+
| Week 1                                                            |
|   Mon: No changes (Month-end close)                               |
|   Tue-Thu: Normal changes                                         |
|   Fri: Standard changes only                                      |
|   Sat-Sun: Major changes (if approved)                            |
|                                                                    |
| Week 2                                                            |
|   Mon-Thu: Normal changes                                         |
|   Fri: Standard changes only                                      |
|   Sat-Sun: Major changes (if approved)                            |
|                                                                    |
| Week 3                                                            |
|   Mon-Thu: Normal changes                                         |
|   Fri: Standard changes only                                      |
|   Sat-Sun: Major changes (if approved)                            |
|                                                                    |
| Week 4                                                            |
|   Mon-Wed: Normal changes                                         |
|   Thu: Change freeze begins                                       |
|   Fri-Sun: Emergency changes only                                 |
|                                                                    |
| Blackout Dates: [List company-specific blackout periods]          |
+------------------------------------------------------------------+
```

---
