# 5.3 ISE Monitoring and Reporting

### 5.3.1 ISE Dashboard Overview

```
+------------------------------------------------------------------+
|                    ISE OPERATIONS DASHBOARD                       |
+------------------------------------------------------------------+
|                                                                    |
|  AUTHENTICATION SUMMARY (Last 24 Hours)                           |
|  +----------------+  +----------------+  +----------------+        |
|  | PASSED         |  | FAILED         |  | SUCCESS RATE   |        |
|  | 47,523         |  | 234            |  | 99.51%         |        |
|  +----------------+  +----------------+  +----------------+        |
|                                                                    |
|  AUTHENTICATION BY METHOD:                                         |
|  +------------------+----------+----------+----------+             |
|  | Method           | Passed   | Failed   | Rate     |             |
|  +------------------+----------+----------+----------+             |
|  | 802.1X (EAP-TLS) | 28,450   | 45       | 99.84%   |             |
|  | 802.1X (PEAP)    | 8,230    | 67       | 99.19%   |             |
|  | MAB              | 10,843   | 122      | 98.89%   |             |
|  +------------------+----------+----------+----------+             |
|                                                                    |
|  PSN NODE STATUS:                                                  |
|  +------------------+----------+----------+----------+             |
|  | Node             | Status   | Auth/sec | CPU      |             |
|  +------------------+----------+----------+----------+             |
|  | PSN-MUM-1        | Active   | 12.4     | 35%      |             |
|  | PSN-MUM-2        | Active   | 11.8     | 32%      |             |
|  | PSN-CHN-1        | Active   | 9.6      | 28%      |             |
|  | PSN-CHN-2        | Active   | 9.2      | 26%      |             |
|  | PSN-LON-1        | Active   | 11.2     | 33%      |             |
|  | PSN-LON-2        | Active   | 10.8     | 31%      |             |
|  +------------------+----------+----------+----------+             |
|                                                                    |
+------------------------------------------------------------------+
```

### 5.3.2 ISE Live Logs Analysis

```yaml
# Operations > RADIUS > Live Logs

Key_Filters:
  Failed_Authentications:
    Status: "Failed"
    Time_Range: "Last 1 Hour"
    Export: CSV for analysis
    
  Specific_User:
    Username: "user@corp.local"
    Time_Range: "Last 24 Hours"
    
  Specific_Endpoint:
    MAC_Address: "AA:BB:CC:DD:EE:FF"
    Time_Range: "Last 24 Hours"
    
  By_Policy:
    Authentication_Policy: "WIRED-ACCESS"
    Authorization_Policy: "Employee-Full"
    
Common_Failure_Reasons:
  5400: Authentication failed
  5411: Supplicant stopped responding
  5417: Dynamic authorization failed
  5440: Endpoint not found
  12302: Unknown NAS
  12514: EAP-TLS failed
  22028: Authentication timed out
  24408: User not found in identity store
  24459: Wrong password
```

### 5.3.3 ISE Reports

**Scheduled Reports Configuration**

```yaml
# Operations > Reports > Report Scheduler

Scheduled_Reports:
  Daily_Authentication_Summary:
    Report: Authentication Summary
    Schedule: Daily at 06:00 UTC
    Recipients: noc@corp.local
    Format: PDF, CSV
    
  Weekly_Profiler_Report:
    Report: Profiled Endpoints Summary
    Schedule: Weekly (Monday 08:00 UTC)
    Recipients: security-team@corp.local
    Format: PDF
    
  Monthly_Compliance_Report:
    Report: Posture Compliance
    Schedule: Monthly (1st, 08:00 UTC)
    Recipients: compliance@corp.local
    Format: PDF
    
  Weekly_Failed_Auth_Report:
    Report: RADIUS Authentication Troubleshooting
    Filter: Status = Failed
    Schedule: Weekly (Friday 17:00 UTC)
    Recipients: network-team@corp.local
    Format: CSV
```

**Key ISE Reports**

| Report Category | Report Name | Use Case |
|-----------------|-------------|----------|
| Authentication | RADIUS Authentication Summary | Overall auth health |
| Authentication | Top N Authentications by Failure | Troubleshooting |
| Authentication | RADIUS Accounting | Session tracking |
| Endpoints | Profiled Endpoints Summary | Device inventory |
| Endpoints | Endpoint MAC Authentication | MAB analysis |
| Posture | Posture Assessment by Condition | Compliance status |
| Guest | Guest Activity Report | Guest access audit |
| Device Admin | TACACS Authentication | Admin access audit |

### 5.3.4 ISE MnT (Monitoring and Troubleshooting)

```yaml
# Operations > Troubleshoot > Diagnostic Tools

Diagnostic_Tools:
  RADIUS_Authentication:
    Path: Operations > RADIUS > Live Logs
    Use: Real-time authentication monitoring
    
  Endpoint_Debug:
    Path: Operations > Troubleshoot > Endpoint Debug
    Use: Detailed endpoint troubleshooting
    Enable: Per endpoint MAC address
    Duration: 15 minutes default
    
  Evaluate_Configuration:
    Path: Operations > Troubleshoot > Evaluate Configuration
    Use: Test policy without actual authentication
    Input: Username, MAC, NAS details
    
  TCP_Dump:
    Path: Operations > Troubleshoot > TCP Dump
    Use: Packet capture for analysis
    Interface: Select PSN node
    Filter: RADIUS port 1812/1813
    
  Session_Trace:
    Path: Operations > Troubleshoot > Session Trace
    Use: End-to-end session analysis
    Enable: Per session or endpoint
```

### 5.3.5 ISE Monitoring CLI Commands

```bash
# SSH to ISE node
ssh admin@ise-pan-nj.corp.local

# Check application status
show application status ise

# Check RADIUS statistics
show logging application radius-live.log tail count 100

# Check PSN queue status
show ise internal psn-queue-status

# Check MnT database status
show ise internal mnts db-status

# Check replication status
show ise internal cluster replication

# Check certificate status
show ise internal certificates

# Check licensing
show license all

# Performance metrics
show cpu usage
show memory
show repository list
```

---
