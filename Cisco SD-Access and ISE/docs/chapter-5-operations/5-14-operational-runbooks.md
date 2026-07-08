# 5.14 Operational Runbooks

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Daily Operations Runbook

### 1.1 Morning Health Check (15-30 minutes)

```yaml
Daily_Morning_Check:
  Time: 08:00 - 08:30 Local
  Owner: NOC L1 Engineer
  
  Step_1_Catalyst_Center_Dashboard:
    URL: https://catalyst.abhavtech.com
    Check:
      - [ ] Overall Health Score > 90%
      - [ ] Critical Issues = 0
      - [ ] High Issues < 5
      - [ ] All 9 fabric sites showing "Healthy"
    Screenshot: Save if issues found
    
  Step_2_ISE_Dashboard:
    URL: https://ise-pan.abhavtech.com/admin
    Check:
      - [ ] All PSN nodes "Connected" (12 nodes)
      - [ ] Authentication success rate > 99%
      - [ ] No "Critical" alarms
      - [ ] Endpoint count within expected range (±5%)
    Path: Dashboard → Summary
    
  Step_3_Wireless_Health:
    Path: Catalyst Center → Assurance → Dashboards → Wireless
    Check:
      - [ ] AP Health > 95%
      - [ ] Client Health > 90%
      - [ ] No rogue APs detected
      - [ ] Channel utilization < 70%
      
  Step_4_Critical_Application_Check:
    Applications:
      - [ ] Microsoft 365 connectivity (ThousandEyes)
      - [ ] SAP response time < 500ms
      - [ ] Webex quality MOS > 4.0
      
  Step_5_Alert_Review:
    Systems:
      - [ ] Check Splunk for overnight P1/P2 alerts
      - [ ] Review PagerDuty incident queue
      - [ ] Check email: noc@abhavtech.com
```

### 1.2 Evening Health Check (10-15 minutes)

```yaml
Daily_Evening_Check:
  Time: 17:00 - 17:15 Local
  Owner: NOC L1 Engineer
  
  Step_1_Day_Summary:
    - [ ] Authentication success rate for day
    - [ ] Any patterns in failed authentications
    - [ ] Client onboarding issues resolved?
    
  Step_2_Capacity_Spot_Check:
    - [ ] CPU utilization on border nodes < 60%
    - [ ] Memory utilization on ISE < 70%
    - [ ] DHCP pool utilization < 80%
    
  Step_3_Handover_Notes:
    - Document any ongoing issues
    - Update shift log in ServiceNow
    - Escalate unresolved P2+ to on-call
```

### 1.3 Daily Check Results Template

```
╔══════════════════════════════════════════════════════════════════╗
║           ABHAVTECH DAILY HEALTH CHECK - [DATE]                  ║
╠══════════════════════════════════════════════════════════════════╣
║ Technician: ________________  Time: ________  Shift: _______     ║
╠══════════════════════════════════════════════════════════════════╣
║ CATALYST CENTER                                                  ║
║ □ Health Score: _____%  □ Critical: ____  □ High: ____          ║
║ □ All sites healthy: YES / NO (detail: _______________)         ║
╠══════════════════════════════════════════════════════════════════╣
║ ISE                                                              ║
║ □ PSN Status: All UP / ___ DOWN  □ Auth Rate: _____%            ║
║ □ Endpoints: _______ (Expected: ~25,000)                        ║
╠══════════════════════════════════════════════════════════════════╣
║ WIRELESS                                                         ║
║ □ AP Health: _____%  □ Client Health: _____%                    ║
║ □ Rogue APs: ____  □ Channel Util: _____%                       ║
╠══════════════════════════════════════════════════════════════════╣
║ ISSUES FOUND:                                                    ║
║ 1. ________________________________________________________     ║
║ 2. ________________________________________________________     ║
║ ACTIONS TAKEN:                                                   ║
║ 1. ________________________________________________________     ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 2. Weekly Operations Runbook

### 2.1 Weekly Fabric Health Assessment (1-2 hours)

```yaml
Weekly_Fabric_Health:
  Schedule: Every Monday, 10:00 AM
  Owner: Network Engineer L2
  Duration: 1-2 hours
  
  Part_1_Fabric_Validation (30 min):
    Step_1_LISP_Control_Plane:
      Command: "show lisp site summary" on all CP nodes
      Check:
        - [ ] All edge nodes registered
        - [ ] EID registrations match expected count
        - [ ] No stale entries (>24h without refresh)
      Document: Screenshot each site CP
      
    Step_2_VXLAN_Tunnels:
      Path: Catalyst Center → Provision → Fabric Sites → [Site] → Fabric Infrastructure
      Check:
        - [ ] All tunnels "Operational"
        - [ ] No "Partial" status on any node
        - [ ] Tunnel count matches design
        
    Step_3_SGT_Propagation:
      Command: "show cts role-based sgt-map all" on edge nodes
      Check:
        - [ ] SGT assignments present for all VNs
        - [ ] No "Unknown" SGT entries
        - [ ] Count matches ISE endpoint count (±10%)
        
  Part_2_Security_Review (30 min):
    Step_1_SGACL_Enforcement:
      Command: "show cts role-based counters"
      Check:
        - [ ] Permit counters incrementing (traffic flowing)
        - [ ] Deny counters reviewed (expected blocks)
        - [ ] No unexpected deny patterns
        
    Step_2_Authentication_Trends:
      Path: ISE → Operations → Reports → Authentication Summary
      Time Range: Last 7 days
      Check:
        - [ ] Success rate trend stable (>99%)
        - [ ] Failed auth reasons documented
        - [ ] No new failure patterns
        
  Part_3_Wireless_Deep_Dive (30 min):
    Step_1_RF_Health:
      Path: Catalyst Center → Assurance → Dashboards → AP
      Check:
        - [ ] No APs with "Poor" RF health
        - [ ] Co-channel interference < 10%
        - [ ] Noise floor within acceptable range
        
    Step_2_Client_Experience:
      Path: Catalyst Center → Assurance → Client 360
      Check:
        - [ ] Onboarding time < 3 seconds (avg)
        - [ ] Roaming success rate > 99%
        - [ ] No clients stuck in "Connecting"
```

### 2.2 Weekly Report Template

```markdown
# Abhavtech SD-Access Weekly Report
## Week of: [DATE]

### Executive Summary
- Overall Health: [GREEN/YELLOW/RED]
- Incidents This Week: [#]
- Changes Implemented: [#]

### Fabric Health Metrics
| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| Fabric Health Score | __% | __% | ↑/↓/→ |
| Auth Success Rate | __% | __% | ↑/↓/→ |
| AP Health | __% | __% | ↑/↓/→ |
| Client Health | __% | __% | ↑/↓/→ |

### Issues & Resolutions
1. [Issue] - [Resolution] - [Ticket#]

### Upcoming Changes
1. [Change] - [Date] - [Risk Level]

### Action Items
- [ ] [Action] - Owner - Due Date
```

---

## 3. Monthly Operations Runbook

### 3.1 Monthly ISE Policy Audit (2-3 hours)

```yaml
Monthly_ISE_Audit:
  Schedule: First Tuesday of month
  Owner: Security Engineer
  Duration: 2-3 hours
  
  Part_1_Policy_Review:
    Step_1_Authorization_Policies:
      Path: ISE → Policy → Policy Sets → [Each Policy Set]
      Check:
        - [ ] No "Disabled" rules that should be active
        - [ ] Rule order is correct (specific before general)
        - [ ] No duplicate rules
        - [ ] Hit counts reviewed (remove unused rules)
        
    Step_2_SGT_Matrix:
      Path: ISE → Work Centers → TrustSec → Policy → Egress Policy → Matrix
      Check:
        - [ ] No unintended "Permit IP" between security zones
        - [ ] Default policy is appropriate (Deny for sensitive zones)
        - [ ] New SGTs have been added to matrix
        
    Step_3_Profiling_Accuracy:
      Path: ISE → Context Visibility → Endpoints
      Export: All endpoints with "Unknown" profile
      Check:
        - [ ] Unknown endpoints < 5% of total
        - [ ] New device types profiled correctly
        - [ ] Custom profiles working as expected
        
  Part_2_Compliance_Validation:
    Step_1_Posture_Compliance:
      Path: ISE → Operations → Reports → Endpoints → Posture Compliance
      Check:
        - [ ] Compliance rate > 95%
        - [ ] Non-compliant endpoints investigated
        - [ ] Remediation paths working
        
    Step_2_Guest_Access_Review:
      Path: ISE → Operations → Reports → Guest → Guest Access
      Check:
        - [ ] No orphaned guest accounts
        - [ ] Sponsor accounts valid (not former employees)
        - [ ] Guest VLAN isolated properly
```

### 3.2 Monthly Capacity Planning (1-2 hours)

```yaml
Monthly_Capacity:
  Schedule: Last Friday of month
  Owner: Network Architect
  
  Step_1_Endpoint_Growth:
    Current: _______ endpoints
    Last Month: _______ endpoints
    Growth Rate: _______% 
    Projected (6 months): _______
    Threshold Alert: > 80% of licensed capacity
    
  Step_2_DHCP_Pool_Utilization:
    Tool: Infoblox Reports
    Check each pool:
      - [ ] No pool > 80% utilized
      - [ ] No pool showing exhaustion trend
      - [ ] Document pools needing expansion
      
  Step_3_Switch_Port_Utilization:
    Path: Catalyst Center → Assurance → Health → Network Devices
    Check:
      - [ ] No switch stack > 80% port utilization
      - [ ] Identify IDFs needing expansion
      - [ ] Plan hardware orders if needed
      
  Step_4_ISE_Performance:
    Path: ISE → Administration → System → Deployment
    Check:
      - [ ] PSN CPU avg < 60%
      - [ ] PSN Memory avg < 70%
      - [ ] Database size growth rate
      - [ ] Log storage utilization
```

---

## 4. Quarterly Operations Runbook

### 4.1 Quarterly DR Test (Half-day)

```yaml
Quarterly_DR_Test:
  Schedule: Q1: March, Q2: June, Q3: September, Q4: December
  Owner: Infrastructure Lead
  Duration: 4-6 hours
  Approval: CAB pre-approved
  
  Pre_Test_Checklist:
    - [ ] Notify stakeholders 1 week in advance
    - [ ] Confirm DR site ready
    - [ ] Backup all configurations
    - [ ] Document current state
    
  Test_Scenario_1_Catalyst_Center_DR:
    Duration: 1-2 hours
    Steps:
      1. Simulate primary cluster failure
      2. Activate DR cluster (London)
      3. Verify all sites manageable from DR
      4. Test provisioning capability
      5. Failback to primary
    Success_Criteria:
      - RTO < 4 hours achieved
      - All sites accessible
      - No configuration loss
      
  Test_Scenario_2_ISE_PSN_Failover:
    Duration: 1 hour
    Steps:
      1. Disable primary PSN in each region
      2. Verify authentication continues via secondary
      3. Check failover time < 30 seconds
      4. Re-enable primary PSN
      5. Verify load balancing resumes
    Success_Criteria:
      - No authentication outage > 30 seconds
      - Seamless failover
      
  Test_Scenario_3_WLC_SSO_Failover:
    Duration: 1 hour
    Steps:
      1. Simulate active WLC failure
      2. Verify standby takes over
      3. Check AP association maintained
      4. Verify client connectivity
    Success_Criteria:
      - AP failover < 60 seconds
      - No client disconnect
      
  Post_Test:
    - [ ] Document results
    - [ ] Update DR runbook with lessons learned
    - [ ] Report to management
    - [ ] Schedule remediation for any failures
```

### 4.2 Quarterly Security Review (Half-day)

```yaml
Quarterly_Security_Review:
  Schedule: Mid-quarter
  Owner: Security Team
  
  Part_1_Access_Review:
    - [ ] Review admin accounts (remove terminated employees)
    - [ ] Verify MFA enabled for all admins
    - [ ] Review API credentials and rotate
    - [ ] Check certificate expiry dates
    
  Part_2_Vulnerability_Assessment:
    - [ ] Review Cisco PSIRT advisories
    - [ ] Check IOS-XE versions against advisories
    - [ ] Plan patches for critical vulnerabilities
    - [ ] Document exceptions and risk acceptance
    
  Part_3_Policy_Effectiveness:
    - [ ] Review SGACL deny logs
    - [ ] Analyze blocked traffic patterns
    - [ ] Identify potential policy gaps
    - [ ] Test segmentation with controlled scans
```

---

## 5. Annual Operations Runbook

### 5.1 Annual Full DR Exercise (Full day)

```yaml
Annual_DR_Exercise:
  Schedule: Q4 (November)
  Duration: Full business day
  Participants: IT, Security, Business Units
  
  Scenario: Complete data center failure
  
  Steps:
    - Full activation of DR site
    - All business applications tested
    - User acceptance testing
    - Performance validation
    - Complete documentation
    
  Deliverables:
    - DR exercise report
    - Gap analysis
    - Remediation plan
    - Updated BC/DR plan
```

### 5.2 Annual Architecture Review (2 days)

```yaml
Annual_Architecture_Review:
  Schedule: Q1 (January/February)
  Participants: Network Architecture, Security, Operations
  
  Day_1_Current_State:
    - Review capacity trends
    - Analyze incident patterns
    - Review change success rate
    - Identify pain points
    
  Day_2_Future_Planning:
    - Technology refresh requirements
    - New feature adoption roadmap
    - Budget planning input
    - 3-year strategic alignment
```

---

## 6. Troubleshooting Decision Trees

### 6.1 Authentication Failure Decision Tree

```
Authentication Failure Troubleshooting
│
├─► Is the client getting an IP?
│   ├─ NO → Check DHCP, check physical connectivity
│   │       → "show interface status" on switch port
│   │
│   └─ YES → Continue
│
├─► Is MAB or 802.1X?
│   ├─ MAB → Check MAC in ISE endpoint database
│   │        → ISE: Context Visibility → Endpoints → Search MAC
│   │
│   └─ 802.1X → Check supplicant configuration
│               → Check EAP type matches ISE policy
│
├─► Check ISE Live Logs
│   Path: Operations → RADIUS → Live Logs
│   Filter by MAC or Username
│   │
│   ├─ "Authentication Failed" → Check failure reason
│   │   ├─ "Wrong Password" → Reset credentials
│   │   ├─ "Certificate Error" → Check cert expiry
│   │   ├─ "User not found" → Check AD connectivity
│   │   └─ "Policy rejected" → Review authorization policy
│   │
│   └─ No log entry → Check RADIUS connectivity
│       → "test aaa group RADIUS-SERVERS user password"
│
└─► Escalate if not resolved in 30 minutes
```

### 6.2 Fabric Connectivity Decision Tree

```
Fabric Connectivity Troubleshooting
│
├─► Can endpoint ping default gateway?
│   ├─ NO → Check VLAN assignment
│   │       → "show vlan brief" on edge switch
│   │
│   └─ YES → Continue
│
├─► Can endpoint reach other VN members?
│   ├─ NO → Check SGT assignment
│   │       → "show cts role-based sgt-map all"
│   │       → Verify SGACL policy allows traffic
│   │
│   └─ YES → Continue
│
├─► Can endpoint reach across sites?
│   ├─ NO → Check VXLAN tunnel status
│   │       → "show lisp session" on border nodes
│   │       → Verify underlay connectivity (ping loopbacks)
│   │
│   └─ YES → Issue resolved
│
└─► Escalate to L3 if cross-site issue persists
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
