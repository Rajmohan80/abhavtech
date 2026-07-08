# 5.15 High Availability Failover Procedures

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. HA Architecture Overview

### 1.1 Abhavtech HA Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Abhavtech HA Architecture                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CATALYST CENTER                     ISE                            │
│  ┌─────────────────────┐            ┌─────────────────────┐        │
│  │ Primary Cluster     │            │ PAN/MnT Pair        │        │
│  │ (New Jersey - 3 nodes)│          │ Primary: NJ         │        │
│  │ RTO: 4 hours        │            │ Secondary: London   │        │
│  │ RPO: 4 hours        │            │ RTO: 30 seconds     │        │
│  └──────────┬──────────┘            └──────────┬──────────┘        │
│             │                                   │                   │
│             │ Warm Standby                      │ Auto Sync         │
│             │                                   │                   │
│  ┌──────────▼──────────┐            ┌──────────▼──────────┐        │
│  │ DR Cluster          │            │ PSN Pairs (per region)│      │
│  │ (London - 3 nodes)  │            │ Active-Active LB    │        │
│  └─────────────────────┘            │ RTO: 30 seconds     │        │
│                                     └─────────────────────┘        │
│                                                                     │
│  WIRELESS                            INFOBLOX                       │
│  ┌─────────────────────┐            ┌─────────────────────┐        │
│  │ WLC HA SSO Pairs    │            │ Grid Master HA      │        │
│  │ Active + Standby    │            │ Primary: NJ         │        │
│  │ RTO: <60 seconds    │            │ Secondary: London   │        │
│  └─────────────────────┘            └─────────────────────┘        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 RTO/RPO Summary

| Component | RTO | RPO | Failover Type | Trigger |
|-----------|-----|-----|---------------|---------|
| Catalyst Center | 4 hours | 4 hours | Manual | Complete cluster failure |
| ISE PAN | 30 seconds | 0 (sync) | Automatic | Node failure |
| ISE PSN | 30 seconds | 0 | Automatic | Node failure |
| WLC (SSO) | <60 seconds | 0 | Automatic | Active failure |
| Infoblox Grid | 5 minutes | 0 (sync) | Automatic | Master failure |

---

## 2. Catalyst Center Failover Procedures

### 2.1 Planned Failover (Maintenance)

```yaml
Catalyst_Center_Planned_Failover:
  
  Pre_Failover_Checklist:
    - [ ] Verify DR cluster (London) is healthy
    - [ ] Confirm latest backup completed
    - [ ] Notify stakeholders (2 hours advance)
    - [ ] Open change ticket
    - [ ] Have rollback plan ready
    
  Step_1_Verify_DR_Readiness:
    Command: Access DR cluster UI
    URL: https://catalyst-dr.abhavtech.com
    Check:
      - All 3 nodes showing healthy
      - Database replication current (check timestamp)
      - Certificates valid
    Duration: 10 minutes
    
  Step_2_Stop_Primary_Services:
    Action: Graceful shutdown of primary
    Access: SSH to primary cluster leader
    Command: |
      maglev cluster stop
    Verify: All services stopped
    Duration: 15-20 minutes
    
  Step_3_Activate_DR_Cluster:
    Action: Promote DR to primary
    Access: SSH to DR cluster leader
    Command: |
      maglev cluster promote
    Duration: 30-45 minutes
    
  Step_4_Update_DNS:
    Action: Point catalyst.abhavtech.com to DR IP
    Infoblox: Change A record from NJ to London IP
    Old: 10.105.10.10 (NJ)
    New: 10.103.10.10 (London)
    TTL: Set to 60 seconds before failover
    Duration: 5 minutes + TTL propagation
    
  Step_5_Verify_Operations:
    Check:
      - [ ] UI accessible via DNS name
      - [ ] All 9 fabric sites visible
      - [ ] Device inventory correct
      - [ ] Assurance data flowing
    Duration: 15 minutes
    
  Step_6_Communicate:
    - Update ticket with success
    - Notify stakeholders
    - Monitor for 1 hour
```

### 2.2 Unplanned Failover (Emergency DR)

```yaml
Catalyst_Center_Emergency_DR:
  
  Trigger_Conditions:
    - Primary cluster unresponsive > 30 minutes
    - Data center outage confirmed
    - All 3 nodes failed
    
  Immediate_Actions (0-15 minutes):
    - [ ] Confirm primary truly down (not network issue)
    - [ ] Page on-call infrastructure lead
    - [ ] Open P1 incident ticket
    - [ ] Notify management (email)
    
  Failover_Execution (15-60 minutes):
    Step_1: Access DR cluster directly
      URL: https://10.103.10.10 (London IP)
      Check: DR cluster healthy
      
    Step_2: Promote DR cluster
      SSH: ssh admin@catalyst-dr.abhavtech.com
      Command: maglev cluster promote --force
      Note: --force skips primary check
      
    Step_3: Update DNS immediately
      Infoblox: catalyst.abhavtech.com → 10.103.10.10
      
    Step_4: Verify critical functions
      - [ ] Fabric sites reachable
      - [ ] Can provision changes
      - [ ] Assurance collecting data
      
  Post_Failover (60+ minutes):
    - Full functionality test
    - Document data loss (if any)
    - Plan primary recovery
    - Post-incident review
```

### 2.3 Catalyst Center Failback Procedure

```yaml
Catalyst_Center_Failback:
  
  Prerequisites:
    - Primary cluster restored and healthy
    - Change window approved
    - Full backup of DR cluster taken
    
  Step_1_Sync_Primary:
    Action: Restore primary from DR backup
    Duration: 2-4 hours depending on data size
    
  Step_2_Verify_Primary:
    Check:
      - All nodes healthy
      - Database synchronized
      - Certificates valid
      
  Step_3_Planned_Failover:
    Follow "Planned Failover" procedure in reverse
    
  Step_4_Demote_DR:
    SSH: ssh admin@catalyst-dr.abhavtech.com
    Command: maglev cluster demote
    Duration: 30 minutes
    
  Step_5_Restore_Replication:
    Re-establish primary → DR replication
    Verify sync is current
```

---

## 3. ISE Failover Procedures

### 3.1 ISE PAN Failover (Automatic)

```yaml
ISE_PAN_Automatic_Failover:
  
  Design:
    Primary PAN: nj-ise-pan.abhavtech.com (10.250.10.20)
    Secondary PAN: lon-ise-pan.abhavtech.com (10.253.10.20)
    Sync: Real-time database replication
    
  Automatic_Trigger:
    - Primary PAN heartbeat lost > 10 minutes
    - Primary PAN manually demoted
    
  What_Happens_Automatically:
    1. Secondary detects primary failure
    2. Secondary promotes itself to Primary
    3. All PSNs re-register to new Primary
    4. Admin portal available on new Primary
    Duration: 5-10 minutes
    
  Manual_Verification:
    Path: ISE → Administration → System → Deployment
    Confirm:
      - New Primary shows as Primary PAN
      - Old Primary shows as Secondary (when recovered)
      - All PSNs connected
```

### 3.2 ISE PSN Failover

```yaml
ISE_PSN_Failover:
  
  Design_Per_Region:
    APAC:
      Primary PSN: mum-ise-psn-01 (10.250.10.21)
      Secondary PSN: mum-ise-psn-02 (10.250.10.22)
      Load Balancer: F5 VIP 10.250.10.25
      
  Automatic_Failover:
    Trigger: F5 health check fails (RADIUS port 1812)
    Action: F5 removes failed PSN from pool
    RTO: < 30 seconds
    
  Manual_Failover_Steps:
    Step_1: Disable PSN in ISE
      Path: Administration → System → Deployment
      Select PSN → Disable
      
    Step_2: Remove from F5 pool
      F5: Local Traffic → Pools → ISE-PSN-Pool
      Member Status: Forced Offline
      
    Step_3: Verify authentication
      Test: test aaa group RADIUS-SERVERS user pass
      Check ISE Live Logs
      
  Failback:
    1. Enable PSN in ISE
    2. Verify services running
    3. Add back to F5 pool
    4. Monitor load distribution
```

### 3.3 ISE Complete Site Failure

```yaml
ISE_Site_Failure_Mumbai:
  
  Scenario: Both Mumbai PSNs unavailable
  
  Immediate_Impact:
    - Mumbai users cannot authenticate
    - New connections fail
    - Existing sessions continue (until re-auth)
    
  Failover_To_Chennai:
    Step_1: Update NAD RADIUS configuration
      Option A: DNS-based (if using DNS for RADIUS)
        - Update ise-psn.abhavtech.com to Chennai IPs
      Option B: Manual NAD update (if using IP)
        - Push new RADIUS config via Catalyst Center
        
    Step_2: Push RADIUS change to Mumbai switches
      Catalyst Center → Provision → Network Devices
      Select Mumbai devices → Push Configuration
      
    Step_3: Verify authentication
      - Test user login
      - Check ISE Live Logs on Chennai PSNs
      
  Latency_Consideration:
    Mumbai → Chennai: ~20ms additional latency
    Impact: Authentication may take 100-200ms longer
    Acceptable for emergency situation
```

---

## 4. WLC HA SSO Failover

### 4.1 Automatic SSO Failover

```yaml
WLC_SSO_Failover:
  
  Design:
    Mumbai WLC Pair:
      Active: mum-wlc-01 (10.100.10.40)
      Standby: mum-wlc-02 (10.100.10.41)
      Redundancy IP: 10.100.10.42
      
  Automatic_Failover:
    Trigger:
      - Active WLC failure
      - Keepalive timeout (3 missed = 9 seconds)
    Action:
      - Standby becomes Active
      - APs maintain association
      - Clients experience <1 second disruption
    Duration: 30-60 seconds
    
  Verification_Commands:
    show redundancy summary
    show ap summary
    show client summary
    
  Expected_Output:
    Redundancy Mode: SSO
    Local State: ACTIVE
    Peer State: STANDBY HOT
    
  Manual_Switchover (Maintenance):
    Command: redundancy force-switchover
    Use: Planned maintenance on active WLC
```

### 4.2 WLC Failback

```yaml
WLC_Failback:
  
  After_Original_Active_Recovered:
    1. Original Active boots as Standby
    2. Synchronizes config from new Active
    3. Becomes "Standby Hot"
    
  Manual_Failback (if desired):
    Command: redundancy force-switchover
    Note: Only if original Active preferred
    Impact: Brief client disruption
    
  Recommendation:
    - Let system run with new Active
    - Failback during next maintenance window
    - Reduces unnecessary disruptions
```

---

## 5. Failover Testing Procedures

### 5.1 Quarterly Failover Test Plan

```yaml
Quarterly_Failover_Test:
  
  Schedule: Second Saturday of Q2, Q4 (June, December)
  Duration: 4 hours (8 AM - 12 PM)
  Owner: Infrastructure Lead
  
  Test_1_ISE_PSN_Failover (30 min):
    - Disable one PSN per region
    - Verify authentication continues
    - Re-enable PSN
    - Verify load balancing
    Success: Auth success rate > 99%
    
  Test_2_WLC_SSO_Failover (30 min):
    - Force switchover on one WLC pair
    - Verify AP associations maintained
    - Verify client connectivity
    - Switchover back
    Success: No client disconnect > 2 seconds
    
  Test_3_ISE_PAN_Failover (60 min):
    - Coordinate with ISE admin
    - Stop Primary PAN services
    - Verify Secondary promotes
    - Verify admin access
    - Restore Primary PAN
    Success: Secondary promotion < 15 minutes
    
  Test_4_Catalyst_Center_DR (90 min):
    - Use read-only DR verification
    - Do NOT promote DR (unless full DR test)
    - Verify DR data is current
    - Test DR cluster health
    Success: DR data < 4 hours old
    
  Documentation:
    - Record all test results
    - Document any issues
    - Update runbooks if needed
    - Report to management
```

### 5.2 Failover Test Results Template

```
╔══════════════════════════════════════════════════════════════════╗
║           FAILOVER TEST RESULTS - [DATE]                         ║
╠══════════════════════════════════════════════════════════════════╣
║ Test: ISE PSN Failover                                           ║
║ Start Time: ________ End Time: ________                          ║
║ Tester: __________________                                       ║
╠══════════════════════════════════════════════════════════════════╣
║ Pre-Test State:                                                  ║
║ • Active PSN: _________________ Status: UP                       ║
║ • Standby PSN: ________________ Status: UP                       ║
║ • Auth Rate Before: _________ auths/min                          ║
╠══════════════════════════════════════════════════════════════════╣
║ Test Execution:                                                  ║
║ • PSN Disabled: ________________ Time: ________                  ║
║ • Failover Detected: Time: ________                              ║
║ • Auth Continued: YES / NO                                       ║
║ • Failover Duration: ________ seconds                            ║
╠══════════════════════════════════════════════════════════════════╣
║ Post-Test Verification:                                          ║
║ • PSN Re-enabled: Time: ________                                 ║
║ • Load Balanced: YES / NO                                        ║
║ • Auth Rate After: _________ auths/min                           ║
╠══════════════════════════════════════════════════════════════════╣
║ RESULT: PASS / FAIL                                              ║
║ Issues Found: ________________________________________________   ║
║ Remediation: _________________________________________________   ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 6. Emergency Contacts

| Role | Name | Phone | Escalation Time |
|------|------|-------|-----------------|
| NOC On-Call | Rotation | +91-xxx-xxx-xxxx | Immediate |
| Infrastructure Lead | [Name] | +91-xxx-xxx-xxxx | 15 minutes |
| Network Architect | [Name] | +91-xxx-xxx-xxxx | 30 minutes |
| Cisco TAC | - | 1-800-553-2447 | As needed |

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
