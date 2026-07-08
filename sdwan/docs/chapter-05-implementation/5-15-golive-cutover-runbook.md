# 5.15 Go-Live Cutover Runbook

## Document Information
- **Version**: 1.0
- **Last Updated**: December 2025
- **Author**: Abhavtech Network Engineering
- **Status**: Production Ready
- **Review Cycle**: Per Migration Event

## Table of Contents
1. [Cutover Overview](#cutover-overview)
2. [Pre-Cutover Preparation](#pre-cutover-preparation)
3. [Cutover Team and Roles](#cutover-team-and-roles)
4. [Communication Plan](#communication-plan)
5. [Detailed Cutover Procedures](#detailed-cutover-procedures)
6. [Verification Checkpoints](#verification-checkpoints)
7. [Go/No-Go Decision Points](#gono-go-decision-points)
8. [Post-Cutover Activities](#post-cutover-activities)
9. [Emergency Contacts](#emergency-contacts)

---

## Cutover Overview

### Cutover Strategy

```
+------------------------------------------------------------------+
|                    CUTOVER TIMELINE OVERVIEW                      |
+------------------------------------------------------------------+
|                                                                   |
|  T-7 Days        T-3 Days        T-1 Day         T-0 (Cutover)   |
|     |               |               |               |             |
|     v               v               v               v             |
|  +-------+     +-------+       +-------+       +-------+          |
|  | Final |     | Pre-  |       | Final |       |CUTOVER|          |
|  | Review|     | Stage |       | Prep  |       |WINDOW |          |
|  +-------+     +-------+       +-------+       +-------+          |
|                                                     |             |
|                                                     v             |
|                                              +-----------+        |
|                                              | Validation|        |
|                                              +-----------+        |
|                                                     |             |
|                                                     v             |
|                                              +-----------+        |
|                                              |  Handover |        |
|                                              +-----------+        |
|                                                                   |
+------------------------------------------------------------------+
```

### Cutover Windows by Site Type

| Site Type | Recommended Window | Duration | Business Impact |
|-----------|-------------------|----------|-----------------|
| Hub Sites (Mumbai, Chennai) | Saturday 22:00 - Sunday 06:00 IST | 8 hours | Critical - Full weekend |
| Regional Hubs (London, Frankfurt) | Saturday 22:00 - Sunday 06:00 Local | 8 hours | Critical - Full weekend |
| Americas Hubs (NJ, Dallas) | Saturday 22:00 - Sunday 06:00 EST | 8 hours | Critical - Full weekend |
| Branch Sites | Tuesday-Thursday 22:00 - 02:00 Local | 4 hours | Moderate - Night hours |

### Site Cutover Sequence

```
+------------------------------------------------------------------+
|                    SITE MIGRATION SEQUENCE                        |
+------------------------------------------------------------------+
|                                                                   |
|  Wave 1: Controllers (Week 1)                                     |
|  +----------------------------------------------------------+    |
|  | SD-WAN Manager Cluster | SD-WAN Controllers | Validators |    |
|  | (Mumbai + Chennai DR)  | (4 total)          | (Cloud)    |    |
|  +----------------------------------------------------------+    |
|                              |                                    |
|                              v                                    |
|  Wave 2: India Hubs (Week 2)                                      |
|  +----------------------------------------------------------+    |
|  | Mumbai DC Hub (Primary) | Chennai DC Hub (DR)             |    |
|  +----------------------------------------------------------+    |
|                              |                                    |
|                              v                                    |
|  Wave 3: India Branches (Week 3)                                  |
|  +----------------------------------------------------------+    |
|  | Bangalore        | Delhi            | Noida              |    |
|  +----------------------------------------------------------+    |
|                              |                                    |
|                              v                                    |
|  Wave 4: EMEA Sites (Week 4)                                      |
|  +----------------------------------------------------------+    |
|  | London Hub            | Frankfurt Hub                     |    |
|  +----------------------------------------------------------+    |
|                              |                                    |
|                              v                                    |
|  Wave 5: Americas Sites (Week 5)                                  |
|  +----------------------------------------------------------+    |
|  | New Jersey Hub        | Dallas Hub                        |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Pre-Cutover Preparation

### T-7 Days: Final Review Checklist

```yaml
# pre-cutover-t7-checklist.yaml
# Activities 7 days before cutover

checklist:
  configuration_review:
    - item: "All templates finalized and tested in lab"
      owner: "Network Engineering"
      status: ""
      
    - item: "Device inventory verified (serial numbers, UUIDs)"
      owner: "Network Engineering"
      status: ""
      
    - item: "IP addressing confirmed (transport, service VPNs)"
      owner: "Network Engineering"
      status: ""
      
    - item: "BGP peering details confirmed with SD-Access team"
      owner: "Integration Team"
      status: ""
      
    - item: "Certificate validity verified (>90 days)"
      owner: "Security Team"
      status: ""

  infrastructure_readiness:
    - item: "WAN circuits provisioned and tested"
      owner: "Carrier Team"
      status: ""
      
    - item: "Physical cabling completed"
      owner: "Site Team"
      status: ""
      
    - item: "Power (A+B feeds) verified"
      owner: "Facilities"
      status: ""
      
    - item: "Console access tested"
      owner: "Site Team"
      status: ""

  documentation:
    - item: "Runbook reviewed and approved"
      owner: "Change Manager"
      status: ""
      
    - item: "Rollback procedures documented"
      owner: "Network Engineering"
      status: ""
      
    - item: "Emergency contacts updated"
      owner: "NOC Manager"
      status: ""

  approvals:
    - item: "Change Advisory Board approval"
      owner: "Change Manager"
      status: ""
      
    - item: "Business stakeholder sign-off"
      owner: "IT Director"
      status: ""
      
    - item: "Security team approval"
      owner: "Security Lead"
      status: ""
```

### T-3 Days: Pre-Staging Activities

```bash
#!/bin/bash
#======================================================================
# PRE-STAGING SCRIPT - T-3 DAYS
#======================================================================

echo "=========================================="
echo "SD-WAN Pre-Staging Activities"
echo "Date: $(date)"
echo "=========================================="

# Variables
SITE_CODE="MUM-HUB"
DEVICE_SERIAL="FOC2401XXXX"

echo ""
echo "[1/5] Verifying device in vManage inventory..."
# API call to verify device exists
curl -sk -X GET \
  "https://10.255.0.10/dataservice/system/device/vedges?model=vedge-C8300-1N1S-6T" \
  -H "Cookie: JSESSIONID=$SESSION" \
  | jq '.data[] | select(.serialNumber=="'$DEVICE_SERIAL'")'

echo ""
echo "[2/5] Verifying template assignment..."
curl -sk -X GET \
  "https://10.255.0.10/dataservice/template/device/config/attached/$DEVICE_SERIAL" \
  -H "Cookie: JSESSIONID=$SESSION"

echo ""
echo "[3/5] Generating USB bootstrap (if required)..."
python3 generate_usb_bootstrap.py --serial $DEVICE_SERIAL --output /tmp/ciscosdwan.cfg

echo ""
echo "[4/5] Validating transport circuit connectivity..."
# Ping tests to carrier endpoints
for circuit in "MPLS:10.1.1.1" "Internet:203.0.113.1"; do
  IFS=':' read -r type ip <<< "$circuit"
  echo "Testing $type circuit to $ip..."
  ping -c 3 $ip
done

echo ""
echo "[5/5] Confirming maintenance window..."
echo "Scheduled: Saturday 22:00 - Sunday 06:00 IST"
echo "Duration: 8 hours"
echo "Site: $SITE_CODE"

echo ""
echo "Pre-staging complete. Review results above."
```

### T-1 Day: Final Preparation

```yaml
# final-prep-t1-checklist.yaml
# Final preparation checklist

date: ""
site: ""
cutover_window: ""

final_preparation:
  backups:
    - item: "vManage configuration backup"
      command: "Backup via Administration > Settings > Backup & Restore"
      completed: ""
      
    - item: "Current router configurations backed up"
      command: "show running-config | redirect flash:pre-cutover-config.txt"
      completed: ""
      
    - item: "SD-Access border configuration backed up"
      command: "copy running-config flash:pre-sdwan-config.txt"
      completed: ""

  notifications:
    - item: "Business users notified"
      method: "Email blast"
      completed: ""
      
    - item: "Help desk briefed"
      method: "Team meeting"
      completed: ""
      
    - item: "NOC briefed"
      method: "Handoff call"
      completed: ""
      
    - item: "On-call team confirmed"
      method: "Calendar check"
      completed: ""

  technical_prep:
    - item: "Console server connectivity verified"
      completed: ""
      
    - item: "Out-of-band management tested"
      completed: ""
      
    - item: "Rollback scripts staged"
      completed: ""
      
    - item: "Monitoring dashboards prepared"
      completed: ""

  team_readiness:
    - item: "All team members confirmed available"
      completed: ""
      
    - item: "Bridge line tested"
      completed: ""
      
    - item: "Screen sharing tools ready"
      completed: ""
      
    - item: "Vendor TAC case pre-opened"
      completed: ""
```

---

## Cutover Team and Roles

### Team Structure

```
+------------------------------------------------------------------+
|                    CUTOVER TEAM STRUCTURE                         |
+------------------------------------------------------------------+
|                                                                   |
|                    +------------------+                           |
|                    | Cutover Manager  |                           |
|                    | (Single Point)   |                           |
|                    +------------------+                           |
|                            |                                      |
|         +------------------+------------------+                   |
|         |                  |                  |                   |
|         v                  v                  v                   |
|  +-------------+   +---------------+   +--------------+           |
|  | Network     |   | Integration   |   | Validation   |           |
|  | Team Lead   |   | Team Lead     |   | Team Lead    |           |
|  +-------------+   +---------------+   +--------------+           |
|         |                  |                  |                   |
|         v                  v                  v                   |
|  +-------------+   +---------------+   +--------------+           |
|  | - SD-WAN    |   | - SD-Access   |   | - App Test   |           |
|  |   Engineer  |   |   Engineer    |   |   Lead       |           |
|  | - WAN Eng   |   | - ISE Admin   |   | - NOC        |           |
|  | - Site Tech |   | - API Dev     |   | - Help Desk  |           |
|  +-------------+   +---------------+   +--------------+           |
|                                                                   |
|  SUPPORT TEAMS (On-Call)                                          |
|  +----------------------------------------------------------+    |
|  | Cisco TAC | Carrier Support | Facilities | Security Team |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### Role Responsibilities

| Role | Responsibilities | Contact |
|------|-----------------|---------|
| **Cutover Manager** | Overall coordination, Go/No-Go decisions, escalation | Primary: [NAME] |
| **Network Team Lead** | SD-WAN configuration, WAN Edge deployment | [NAME] |
| **SD-WAN Engineer** | Template deployment, tunnel verification | [NAME] |
| **WAN Engineer** | Circuit testing, carrier coordination | [NAME] |
| **Integration Team Lead** | SD-Access handoff, BGP peering | [NAME] |
| **SD-Access Engineer** | Border configuration, VRF setup | [NAME] |
| **ISE Admin** | Authentication, TrustSec policies | [NAME] |
| **Validation Lead** | Test execution, sign-off | [NAME] |
| **App Test Lead** | Application testing, UAT | [NAME] |
| **NOC Representative** | Monitoring, alerting | [NAME] |
| **Site Technician** | Physical installation, console access | [NAME] |

---

## Communication Plan

### Communication Channels

| Channel | Purpose | Participants |
|---------|---------|--------------|
| **Primary Bridge** | Real-time coordination | All cutover team |
| **Slack #sdwan-cutover** | Quick updates, file sharing | All cutover team |
| **Email DL: sdwan-cutover** | Formal communications | Extended team |
| **PagerDuty** | Escalations | On-call teams |

### Communication Schedule

```
+------------------------------------------------------------------+
|                    COMMUNICATION TIMELINE                         |
+------------------------------------------------------------------+
|                                                                   |
| T-7 Days: Reminder email to stakeholders                          |
|           "SD-WAN migration scheduled for [DATE]"                 |
|                                                                   |
| T-3 Days: Detailed notification with expected impact              |
|           "Maintenance window: [TIME] - [TIME]"                   |
|                                                                   |
| T-1 Day:  Final reminder with emergency contacts                  |
|           "Migration begins tomorrow at [TIME]"                   |
|                                                                   |
| T-0:      Status updates every 30 minutes during cutover          |
|           "Cutover in progress - Step X of Y complete"            |
|                                                                   |
| T+1:      Completion notification                                 |
|           "Migration complete - systems operational"              |
|                                                                   |
| T+3:      Post-migration summary                                  |
|           "Migration summary and lessons learned"                 |
|                                                                   |
+------------------------------------------------------------------+
```

### Status Update Template

```markdown
# SD-WAN Cutover Status Update

**Time:** [HH:MM TZ]
**Site:** [SITE_NAME]
**Status:** [ON TRACK / DELAYED / ISSUE]

## Current Phase
[PHASE_NAME]: [DESCRIPTION]

## Completed Steps
- [x] Step 1: [DESCRIPTION]
- [x] Step 2: [DESCRIPTION]
- [ ] Step 3: [DESCRIPTION] (In Progress)

## Issues/Blockers
- [ISSUE_1]: [RESOLUTION]

## Next Steps
1. [NEXT_STEP_1]
2. [NEXT_STEP_2]

## ETA Completion
[TIME]

---
*Next update in 30 minutes*
```

---

## Detailed Cutover Procedures

### Phase 1: Pre-Cutover Verification (T-0, 22:00-22:30)

```yaml
# phase1-pre-cutover.yaml
# Duration: 30 minutes

phase: "Pre-Cutover Verification"
start_time: "22:00"
duration_minutes: 30
owner: "Network Team Lead"

steps:
  - step: 1
    time: "22:00"
    duration: 5
    action: "Initiate cutover bridge call"
    command: "Join bridge: [BRIDGE_NUMBER]"
    verification: "All team members present"
    rollback: "N/A"
    
  - step: 2
    time: "22:05"
    duration: 5
    action: "Verify current production state"
    command: |
      # On existing WAN router
      show ip bgp summary
      show ip route summary
      ping 10.10.10.1 source 10.20.10.1
    verification: "All BGP neighbors up, routes present"
    rollback: "Document current state"
    
  - step: 3
    time: "22:10"
    duration: 5
    action: "Verify SD-WAN controllers healthy"
    command: |
      # vManage GUI or API
      show sdwan control connections
    verification: "All controllers reachable"
    rollback: "Delay cutover if controllers unhealthy"
    
  - step: 4
    time: "22:15"
    duration: 5
    action: "Verify WAN circuits active"
    command: |
      # Check carrier portal
      # Ping PE routers
      ping 10.1.1.1  # MPLS PE
      ping 203.0.113.1  # Internet gateway
    verification: "All circuits operational"
    rollback: "Engage carrier support"
    
  - step: 5
    time: "22:20"
    duration: 5
    action: "Take pre-cutover backup"
    command: |
      copy running-config flash:pre-cutover-$(date +%Y%m%d).txt
    verification: "Backup file created"
    rollback: "Retry backup"
    
  - step: 6
    time: "22:25"
    duration: 5
    action: "Go/No-Go Decision Point #1"
    command: "Poll all team leads"
    verification: "All teams confirm GO"
    rollback: "Delay or abort if NO-GO"

checkpoint:
  name: "Pre-Cutover Verification Complete"
  criteria:
    - "All team members present"
    - "Production state documented"
    - "Controllers healthy"
    - "Circuits operational"
    - "Backups complete"
  go_no_go: true
```

### Phase 2: WAN Edge Deployment (T-0, 22:30-00:30)

```yaml
# phase2-wan-edge-deployment.yaml
# Duration: 2 hours

phase: "WAN Edge Deployment"
start_time: "22:30"
duration_minutes: 120
owner: "SD-WAN Engineer"

steps:
  - step: 1
    time: "22:30"
    duration: 15
    action: "Power on WAN Edge router"
    command: |
      # Physical: Power button or remote PDU
      # Verify console access
      terminal server connect port 1
    verification: "Device boots, console accessible"
    rollback: "Check power, reseat cables"
    
  - step: 2
    time: "22:45"
    duration: 15
    action: "Apply bootstrap configuration (if not ZTP)"
    command: |
      ! Console configuration
      system
       system-ip 10.255.1.11
       site-id 100
       organization-name Abhavtech
       vbond 13.234.56.78
      !
      vpn 512
       interface eth0
        ip address 10.10.250.11/24
        no shutdown
       !
       ip route 0.0.0.0/0 10.10.250.1
      !
    verification: "Management IP reachable"
    rollback: "Re-enter configuration"
    
  - step: 3
    time: "23:00"
    duration: 15
    action: "Verify control plane connections"
    command: |
      show sdwan control connections
      show sdwan control local-properties
    verification: |
      vBond: up
      vSmart: up
      vManage: up
    rollback: "Check certificates, firewall rules"
    
  - step: 4
    time: "23:15"
    duration: 15
    action: "Push device template"
    command: |
      # vManage GUI
      Configuration > Templates > Device Templates
      Attach Devices > Select device > Attach
    verification: "Template status: In Sync"
    rollback: "Review template variables, retry"
    
  - step: 5
    time: "23:30"
    duration: 15
    action: "Verify transport interfaces"
    command: |
      show sdwan interface
      show sdwan bfd sessions
    verification: |
      All transport interfaces: up
      BFD sessions: up
    rollback: "Check IP config, carrier circuits"
    
  - step: 6
    time: "23:45"
    duration: 15
    action: "Verify IPsec tunnels"
    command: |
      show sdwan ipsec inbound-connections
      show sdwan ipsec outbound-connections
    verification: "Tunnels established to other sites"
    rollback: "Check NAT traversal, firewall rules"
    
  - step: 7
    time: "00:00"
    duration: 15
    action: "Verify OMP routes"
    command: |
      show sdwan omp routes vpn 10
      show sdwan omp routes vpn 20
      show sdwan omp routes vpn 30
    verification: "Routes received from other sites"
    rollback: "Check OMP peers, policies"
    
  - step: 8
    time: "00:15"
    duration: 15
    action: "Go/No-Go Decision Point #2"
    command: "Verify all control/data plane operational"
    verification: "Control connections up, tunnels established"
    rollback: "If NO-GO, proceed to Phase 7 (Rollback)"

checkpoint:
  name: "WAN Edge Deployment Complete"
  criteria:
    - "Device booted and accessible"
    - "Control connections established"
    - "Template in sync"
    - "Tunnels operational"
    - "OMP routes present"
  go_no_go: true
```

### Phase 3: SD-Access Handoff Configuration (T-0, 00:30-01:30)

```yaml
# phase3-sdaccess-handoff.yaml
# Duration: 1 hour

phase: "SD-Access Handoff Configuration"
start_time: "00:30"
duration_minutes: 60
owner: "Integration Team Lead"

steps:
  - step: 1
    time: "00:30"
    duration: 10
    action: "Configure WAN Edge handoff subinterfaces"
    command: |
      ! VPN 10 - Corporate
      vpn 10
       interface GigabitEthernet0/0/0.10
        encapsulation dot1q 3010
        ip address 10.100.100.1/30
        no shutdown
      !
      ! VPN 20 - Guest
      vpn 20
       interface GigabitEthernet0/0/0.20
        encapsulation dot1q 3020
        ip address 10.100.200.1/30
        no shutdown
      !
      ! VPN 30 - Voice
      vpn 30
       interface GigabitEthernet0/0/0.30
        encapsulation dot1q 3030
        ip address 10.100.130.1/30
        no shutdown
      !
    verification: "Subinterfaces up"
    rollback: "Check VLAN trunking, IP config"
    
  - step: 2
    time: "00:40"
    duration: 10
    action: "Configure BGP peering to SD-Access border"
    command: |
      vpn 10
       router bgp 65100
        neighbor 10.100.100.2 remote-as 65200
        neighbor 10.100.100.2 send-community both
        address-family ipv4 unicast
         redistribute omp
         neighbor 10.100.100.2 activate
      !
    verification: "BGP neighbor configured"
    rollback: "Review BGP config"
    
  - step: 3
    time: "00:50"
    duration: 10
    action: "Verify BGP session establishment"
    command: |
      show bgp vpnv4 unicast all summary
    verification: |
      Neighbor: 10.100.100.2
      State: Established
      Prefixes: >0
    rollback: "Check IP reachability, AS numbers"
    
  - step: 4
    time: "01:00"
    duration: 10
    action: "Verify route exchange"
    command: |
      ! On WAN Edge
      show ip route vrf 10 bgp
      
      ! On SD-Access Border
      show bgp vpnv4 unicast vrf Corporate-Data
    verification: "Routes received from both sides"
    rollback: "Check redistribution policies"
    
  - step: 5
    time: "01:10"
    duration: 10
    action: "Enable CTS/SGT propagation"
    command: |
      ! On WAN Edge handoff interface
      interface GigabitEthernet0/0/0.10
       cts manual
        policy static sgt 100 trusted
        propagate sgt
      !
    verification: "CTS enabled"
    rollback: "Check ISE connectivity"
    
  - step: 6
    time: "01:20"
    duration: 10
    action: "Go/No-Go Decision Point #3"
    command: "Verify SD-Access integration complete"
    verification: "BGP up, routes exchanged, CTS active"
    rollback: "If NO-GO, remove handoff config, proceed to Phase 7"

checkpoint:
  name: "SD-Access Handoff Complete"
  criteria:
    - "Handoff interfaces operational"
    - "BGP sessions established"
    - "Routes exchanged bidirectionally"
    - "SGT propagation enabled"
  go_no_go: true
```

### Phase 4: Traffic Migration (T-0, 01:30-02:30)

```yaml
# phase4-traffic-migration.yaml
# Duration: 1 hour

phase: "Traffic Migration"
start_time: "01:30"
duration_minutes: 60
owner: "Network Team Lead"

steps:
  - step: 1
    time: "01:30"
    duration: 15
    action: "Adjust SD-Access border routing preference"
    command: |
      ! On SD-Access Border
      ! Lower BGP local-pref for MPLS routes
      router bgp 65200
       address-family ipv4 vrf Corporate-Data
        neighbor 10.100.100.1 route-map SD-WAN-PREFER in
      !
      route-map SD-WAN-PREFER permit 10
       set local-preference 200
      !
    verification: "SD-WAN routes preferred"
    rollback: "Remove route-map"
    
  - step: 2
    time: "01:45"
    duration: 15
    action: "Verify traffic shifting to SD-WAN"
    command: |
      ! On WAN Edge
      show sdwan bfd sessions
      show sdwan app-route statistics
      
      ! Monitor traffic counters
      show interface GigabitEthernet0/0/0.10 | include packets
    verification: "Traffic flowing through SD-WAN"
    rollback: "Revert BGP preference"
    
  - step: 3
    time: "02:00"
    duration: 15
    action: "Test application connectivity"
    command: |
      # From test client in fabric
      ping 10.20.10.100  # Remote branch server
      curl -I http://erp.abhavtech.com
      
      # Voice test call
      # Initiate test call between sites
    verification: "Applications reachable"
    rollback: "Check routing, firewall policies"
    
  - step: 4
    time: "02:15"
    duration: 15
    action: "Go/No-Go Decision Point #4"
    command: "Verify traffic migration successful"
    verification: "All applications operational over SD-WAN"
    rollback: "If NO-GO, revert BGP preference, proceed to Phase 7"

checkpoint:
  name: "Traffic Migration Complete"
  criteria:
    - "Traffic flowing through SD-WAN"
    - "Application connectivity verified"
    - "Voice/video quality acceptable"
    - "No packet loss detected"
  go_no_go: true
```

### Phase 5: Validation and Testing (T-0, 02:30-04:00)

```yaml
# phase5-validation.yaml
# Duration: 1.5 hours

phase: "Validation and Testing"
start_time: "02:30"
duration_minutes: 90
owner: "Validation Lead"

steps:
  - step: 1
    time: "02:30"
    duration: 20
    action: "Execute automated test suite"
    command: |
      cd /opt/sdwan-tests
      python3 run_all_tests.py --site MUM-HUB --output /tmp/test-results.json
    verification: ">95% tests pass"
    rollback: "Review failed tests"
    
  - step: 2
    time: "02:50"
    duration: 20
    action: "Performance baseline tests"
    command: |
      # Throughput test
      iperf3 -c 10.20.10.100 -t 60 -P 4
      
      # Latency test
      ping -c 100 10.20.10.100
      
      # Voice quality test
      # MOS measurement via monitoring tool
    verification: |
      Throughput: >100 Mbps
      Latency: <100 ms
      MOS: >4.0
    rollback: "Investigate performance issues"
    
  - step: 3
    time: "03:10"
    duration: 20
    action: "Failover testing"
    command: |
      # Simulate primary transport failure
      ! On WAN Edge
      interface GigabitEthernet0/0/0
       shutdown
      !
      # Monitor traffic failover
      show sdwan bfd sessions
      show sdwan app-route statistics
      
      # Restore interface
      interface GigabitEthernet0/0/0
       no shutdown
    verification: "Failover <30 seconds"
    rollback: "Document failover time"
    
  - step: 4
    time: "03:30"
    duration: 15
    action: "Security verification"
    command: |
      show sdwan policy security
      show cts interface
      show cts role-based permissions
    verification: "Security policies active"
    rollback: "Review security config"
    
  - step: 5
    time: "03:45"
    duration: 15
    action: "Final Go/No-Go Decision"
    command: "Review all test results"
    verification: "All critical tests pass"
    rollback: "If NO-GO, proceed to Phase 7"

checkpoint:
  name: "Validation Complete"
  criteria:
    - "Automated tests: >95% pass"
    - "Performance: meets baseline"
    - "Failover: <30 seconds"
    - "Security: policies active"
  go_no_go: true
```

### Phase 6: Cutover Completion (T-0, 04:00-06:00)

```yaml
# phase6-completion.yaml
# Duration: 2 hours

phase: "Cutover Completion"
start_time: "04:00"
duration_minutes: 120
owner: "Cutover Manager"

steps:
  - step: 1
    time: "04:00"
    duration: 30
    action: "Decommission legacy WAN path (if applicable)"
    command: |
      ! On legacy router
      interface GigabitEthernet0/0/1
       description DECOMMISSIONED-MPLS
       shutdown
      !
      ! Document circuit info for carrier disconnect
    verification: "Legacy path disabled"
    rollback: "Keep legacy path active for fallback period"
    
  - step: 2
    time: "04:30"
    duration: 30
    action: "Update monitoring systems"
    command: |
      # Add SD-WAN devices to monitoring
      # Update dashboards
      # Configure alerting
    verification: "Monitoring active"
    rollback: "N/A"
    
  - step: 3
    time: "05:00"
    duration: 30
    action: "Documentation update"
    command: |
      # Update network diagrams
      # Update CMDB
      # Archive cutover logs
    verification: "Documentation complete"
    rollback: "N/A"
    
  - step: 4
    time: "05:30"
    duration: 30
    action: "Handover to operations"
    command: |
      # NOC briefing
      # Hand over runbooks
      # Review escalation procedures
    verification: "NOC accepts handover"
    rollback: "N/A"

checkpoint:
  name: "Cutover Complete"
  criteria:
    - "All validations passed"
    - "Monitoring operational"
    - "Documentation updated"
    - "NOC handover complete"
  go_no_go: false  # Final - no rollback after this point
```

---

## Verification Checkpoints

### Automated Verification Script

```python
#!/usr/bin/env python3
"""
Cutover Verification Script
Automated checkpoint validation
"""

import requests
import json
import time
from datetime import datetime

class CutoverVerification:
    """Automated cutover verification"""
    
    def __init__(self, vmanage_host, username, password):
        self.vmanage = vmanage_host
        self.session = self._authenticate(username, password)
        self.results = []
    
    def _authenticate(self, username, password):
        session = requests.Session()
        session.verify = False
        session.post(
            f"https://{self.vmanage}/j_security_check",
            data={'j_username': username, 'j_password': password}
        )
        token = session.get(f"https://{self.vmanage}/dataservice/client/token").text
        session.headers['X-XSRF-TOKEN'] = token
        return session
    
    def checkpoint_control_plane(self):
        """Verify control plane health"""
        checks = []
        
        # Check control connections
        response = self.session.get(
            f"https://{self.vmanage}/dataservice/device/control/connections"
        )
        if response.status_code == 200:
            connections = response.json().get('data', [])
            all_up = all(c.get('state') == 'up' for c in connections)
            checks.append({
                'check': 'Control Connections',
                'status': 'PASS' if all_up else 'FAIL',
                'details': f"{sum(1 for c in connections if c.get('state') == 'up')}/{len(connections)} up"
            })
        
        # Check OMP peers
        response = self.session.get(
            f"https://{self.vmanage}/dataservice/device/omp/peers"
        )
        if response.status_code == 200:
            peers = response.json().get('data', [])
            all_up = all(p.get('state') == 'up' for p in peers)
            checks.append({
                'check': 'OMP Peers',
                'status': 'PASS' if all_up else 'FAIL',
                'details': f"{sum(1 for p in peers if p.get('state') == 'up')}/{len(peers)} up"
            })
        
        return {
            'checkpoint': 'Control Plane',
            'timestamp': datetime.now().isoformat(),
            'checks': checks,
            'overall': 'PASS' if all(c['status'] == 'PASS' for c in checks) else 'FAIL'
        }
    
    def checkpoint_data_plane(self, device_ip):
        """Verify data plane health"""
        checks = []
        
        # Check tunnels
        response = self.session.get(
            f"https://{self.vmanage}/dataservice/device/tunnel/statistics?deviceId={device_ip}"
        )
        if response.status_code == 200:
            tunnels = response.json().get('data', [])
            tunnel_count = len(tunnels)
            checks.append({
                'check': 'IPsec Tunnels',
                'status': 'PASS' if tunnel_count > 0 else 'FAIL',
                'details': f"{tunnel_count} tunnels established"
            })
        
        # Check BFD
        response = self.session.get(
            f"https://{self.vmanage}/dataservice/device/bfd/sessions?deviceId={device_ip}"
        )
        if response.status_code == 200:
            sessions = response.json().get('data', [])
            all_up = all(s.get('state') == 'up' for s in sessions)
            checks.append({
                'check': 'BFD Sessions',
                'status': 'PASS' if all_up else 'FAIL',
                'details': f"{sum(1 for s in sessions if s.get('state') == 'up')}/{len(sessions)} up"
            })
        
        return {
            'checkpoint': 'Data Plane',
            'timestamp': datetime.now().isoformat(),
            'checks': checks,
            'overall': 'PASS' if all(c['status'] == 'PASS' for c in checks) else 'FAIL'
        }
    
    def checkpoint_integration(self, device_ip):
        """Verify SD-Access integration"""
        checks = []
        
        # Check BGP neighbors
        response = self.session.get(
            f"https://{self.vmanage}/dataservice/device/bgp/neighbors?deviceId={device_ip}"
        )
        if response.status_code == 200:
            neighbors = response.json().get('data', [])
            established = [n for n in neighbors if n.get('state') == 'established']
            checks.append({
                'check': 'BGP Neighbors',
                'status': 'PASS' if len(established) > 0 else 'FAIL',
                'details': f"{len(established)} neighbors established"
            })
        
        return {
            'checkpoint': 'SD-Access Integration',
            'timestamp': datetime.now().isoformat(),
            'checks': checks,
            'overall': 'PASS' if all(c['status'] == 'PASS' for c in checks) else 'FAIL'
        }
    
    def run_all_checkpoints(self, device_ip):
        """Run all verification checkpoints"""
        results = []
        results.append(self.checkpoint_control_plane())
        results.append(self.checkpoint_data_plane(device_ip))
        results.append(self.checkpoint_integration(device_ip))
        
        overall = 'PASS' if all(r['overall'] == 'PASS' for r in results) else 'FAIL'
        
        return {
            'verification_run': datetime.now().isoformat(),
            'device': device_ip,
            'checkpoints': results,
            'overall_status': overall,
            'go_no_go': 'GO' if overall == 'PASS' else 'NO-GO'
        }


# Execute verification
if __name__ == "__main__":
    verifier = CutoverVerification(
        vmanage_host="10.255.0.10",
        username="admin",
        password="admin_password"
    )
    
    results = verifier.run_all_checkpoints("10.255.1.11")
    
    print("\n" + "="*60)
    print("CUTOVER VERIFICATION RESULTS")
    print("="*60)
    print(json.dumps(results, indent=2))
    print("\n" + "="*60)
    print(f"RECOMMENDATION: {results['go_no_go']}")
    print("="*60)
```

---

## Go/No-Go Decision Points

### Decision Matrix

| Checkpoint | Criteria | GO | NO-GO | Owner |
|------------|----------|-----|--------|-------|
| **Checkpoint 1** (Pre-Cutover) | All prerequisites met | Continue | Delay cutover | Cutover Manager |
| **Checkpoint 2** (WAN Edge) | Control plane operational | Continue | Rollback device | Network Lead |
| **Checkpoint 3** (Handoff) | BGP established, routes exchanged | Continue | Remove handoff config | Integration Lead |
| **Checkpoint 4** (Migration) | Traffic flowing, apps working | Continue | Revert BGP preference | Network Lead |
| **Checkpoint 5** (Validation) | All tests pass | Complete | Evaluate: fix or rollback | Validation Lead |

### Go/No-Go Form

```markdown
# Go/No-Go Decision Form

## Checkpoint: [NUMBER]
## Time: [HH:MM TZ]
## Site: [SITE_NAME]

### Status Summary
| Item | Status |
|------|--------|
| Control Plane | [PASS/FAIL] |
| Data Plane | [PASS/FAIL] |
| Applications | [PASS/FAIL] |
| Security | [PASS/FAIL] |

### Team Lead Votes
| Team | Vote | Comments |
|------|------|----------|
| Network | [GO/NO-GO] | |
| Integration | [GO/NO-GO] | |
| Validation | [GO/NO-GO] | |
| NOC | [GO/NO-GO] | |

### Decision
**[ ] GO** - Proceed to next phase
**[ ] NO-GO** - Execute rollback procedure

### Authorized By
Name: _____________
Role: _____________
Time: _____________
```

---

## Post-Cutover Activities

### T+1 Day Monitoring

```yaml
# post-cutover-monitoring.yaml
# First 24 hours after cutover

monitoring_checklist:
  hourly:
    - check: "Control connection status"
      command: "show sdwan control connections"
      
    - check: "Tunnel health"
      command: "show sdwan bfd sessions"
      
    - check: "Traffic statistics"
      command: "show sdwan app-route statistics"
      
    - check: "Error counters"
      command: "show interface summary"

  every_4_hours:
    - check: "Performance metrics"
      command: "show sdwan app-route sla-class"
      
    - check: "Application response times"
      command: "Check APM dashboard"
      
    - check: "User reported issues"
      command: "Review help desk tickets"

  end_of_day:
    - check: "Generate health report"
      command: "python3 generate_health_report.py"
      
    - check: "Backup configuration"
      command: "show running-config | redirect flash:day1-config.txt"
      
    - check: "Document any issues"
      command: "Update change record"
```

### Hypercare Period

| Day | Focus | Activities |
|-----|-------|------------|
| Day 1 | Stability | Hourly monitoring, immediate issue response |
| Day 2 | Performance | Performance baseline comparison |
| Day 3-5 | Optimization | AAR tuning, QoS adjustments |
| Day 6-7 | Documentation | Lessons learned, runbook updates |
| Day 14 | Review | Post-implementation review meeting |
| Day 30 | Closure | Change record closure, final sign-off |

---

## Emergency Contacts

### Escalation Matrix

| Level | Condition | Contact | Response Time |
|-------|-----------|---------|---------------|
| **L1** | Non-critical issue | NOC: +91-22-xxxx-xxxx | 15 min |
| **L2** | Service degradation | Network Lead: +91-98xxx-xxxxx | 30 min |
| **L3** | Service outage | Network Director: +91-98xxx-xxxxx | 15 min |
| **L4** | Major incident | CIO: +91-98xxx-xxxxx | Immediate |

### Vendor Support

| Vendor | Service | Contact | Case Number |
|--------|---------|---------|-------------|
| Cisco TAC | SD-WAN Support | +1-800-553-2447 | Pre-opened: SR#xxx |
| MPLS Carrier | Circuit Support | +91-xxxx-xxxx | Account: xxxx |
| Internet ISP | Circuit Support | +91-xxxx-xxxx | Account: xxxx |

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| Rollback Procedures | Recovery from failed cutover | Section 5.16 |
| Testing & Validation | Pre-cutover testing | Section 5.14 |
| Detailed Test Cases | Validation test cases | Section 5.19 |
| Operations Runbook | Day-2 operations | Chapter 6 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Implementation & Deployment documentation series for Abhavtech.com*
