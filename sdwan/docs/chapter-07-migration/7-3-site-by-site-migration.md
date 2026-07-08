# 7.3 Site-by-Site Migration Plan

## 7.3.1 Site Migration Matrix

### Complete Site Migration Schedule

```yaml
site_migration_matrix:
  overview:
    total_sites: 9
    migration_duration: "16 weeks"
    approach: "Phased rollout"
    
  site_schedule:
    bangalore:
      site_id: "BLR-001"
      type: "Branch"
      region: "India"
      phase: "Phase 1 - Pilot"
      week: "Week 3-4"
      migration_window: "Saturday 22:00-02:00"
      complexity: "Low"
      risk: "Low"
      dependencies: []
      
    delhi:
      site_id: "DEL-001"
      type: "Branch"
      region: "India"
      phase: "Phase 2"
      week: "Week 5"
      migration_window: "Saturday 22:00-02:00"
      complexity: "Low"
      risk: "Low"
      dependencies: ["Bangalore successful"]
      
    noida:
      site_id: "NOI-001"
      type: "Branch"
      region: "India"
      phase: "Phase 2"
      week: "Week 6"
      migration_window: "Saturday 22:00-02:00"
      complexity: "Low"
      risk: "Low"
      dependencies: ["Delhi successful"]
      
    frankfurt:
      site_id: "FRA-001"
      type: "Branch"
      region: "EMEA"
      phase: "Phase 2"
      week: "Week 7"
      migration_window: "Saturday 22:00-02:00 CET"
      complexity: "Medium"
      risk: "Medium"
      dependencies: ["Noida successful"]
      
    dallas:
      site_id: "DAL-001"
      type: "Branch"
      region: "Americas"
      phase: "Phase 2"
      week: "Week 8"
      migration_window: "Saturday 22:00-02:00 CST"
      complexity: "Medium"
      risk: "Medium"
      dependencies: ["Frankfurt successful"]
      
    chennai:
      site_id: "CHE-HUB-001"
      type: "Hub"
      region: "India"
      phase: "Phase 3"
      week: "Week 9-10"
      migration_window: "Saturday 22:00-06:00"
      complexity: "High"
      risk: "Medium"
      dependencies: ["All India branches"]
      special: "SD-Access integration"
      
    london:
      site_id: "LON-HUB-001"
      type: "Hub"
      region: "EMEA"
      phase: "Phase 3"
      week: "Week 11"
      migration_window: "Saturday 22:00-06:00 GMT"
      complexity: "High"
      risk: "Medium"
      dependencies: ["Chennai successful"]
      
    newjersey:
      site_id: "NJY-HUB-001"
      type: "Hub"
      region: "Americas"
      phase: "Phase 3"
      week: "Week 12"
      migration_window: "Saturday 22:00-06:00 EST"
      complexity: "High"
      risk: "Medium"
      dependencies: ["London successful"]
      
    mumbai:
      site_id: "MUM-HUB-001"
      type: "Primary Hub"
      region: "India"
      phase: "Phase 4"
      week: "Week 13-16"
      migration_window: "Saturday 20:00-08:00"
      complexity: "Critical"
      risk: "High"
      dependencies: ["All sites migrated"]
      special: "Primary SD-Access, DR site ready"
```

### Migration Timeline Gantt

```
MIGRATION TIMELINE (16 WEEKS)
=============================

Week:  1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16
       |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

PHASE 1 - FOUNDATION & PILOT
[Controller Deploy ]
            [Bangalore Pilot]
                    [Stabilize]

PHASE 2 - BRANCH ROLLOUT
                    [Delhi  ]
                        [Noida ]
                            [Frankfurt]
                                [Dallas ]

PHASE 3 - HUB MIGRATION
                                    [Chennai Hub   ]
                                            [London Hub ]
                                                [New Jersey]

PHASE 4 - PRIMARY HUB
                                                    [Mumbai Hub     ]
                                                            [Optimize]

MPLS DECOMMISSION
                                                        [Branch MPLS]
                                                            [Hub MPLS  ]
```

---

## 7.3.2 Site-Specific Migration Details

### Bangalore Branch (Pilot Site)

```yaml
bangalore_details:
  site_profile:
    address: "Outer Ring Road, Bangalore 560103"
    building: "Tech Park Tower A"
    floor: "3rd Floor"
    rack_location: "Rack B-12"
    
  current_infrastructure:
    wan_router: "Cisco ISR 4331"
    wan_circuit: "MPLS 100 Mbps (Tata)"
    lan_switch: "Catalyst 9300-48P"
    users: 85
    vlans: 5
    
  target_infrastructure:
    wan_edge: "C8300-2N2S-4T"
    primary_wan: "Internet 200 Mbps (Jio Fiber)"
    backup_wan: "LTE (Airtel 4G)"
    
  migration_specifics:
    pilot_objectives:
      - "Validate migration procedures"
      - "Test ZTP deployment"
      - "Verify application performance"
      - "Confirm rollback procedures"
      
    success_criteria:
      - "Control connections < 2 minutes"
      - "BFD tunnels established < 5 minutes"
      - "Application latency within 10% baseline"
      - "Zero user-reported issues for 7 days"
      
  contacts:
    site_contact: "Priya Sharma"
    phone: "+91-98xxx-xxxxx"
    email: "priya.sharma@abhavtech.com"
    backup_contact: "Facility Manager"
```

### Delhi Branch

```yaml
delhi_details:
  site_profile:
    address: "Nehru Place, New Delhi 110019"
    building: "Corporate Tower"
    floor: "5th Floor"
    
  current_infrastructure:
    wan_router: "Cisco ISR 4321"
    wan_circuit: "MPLS 100 Mbps"
    users: 120
    
  target_infrastructure:
    wan_edge: "C8300-2N2S-4T"
    primary_wan: "Internet 200 Mbps (ACT)"
    backup_wan: "Internet 100 Mbps (Airtel)"
    
  special_considerations:
    - "High user count - schedule during low usage"
    - "Finance team critical apps"
    - "Verify SAP connectivity post-migration"
```

### Chennai Hub

```yaml
chennai_hub_details:
  site_profile:
    address: "OMR, Chennai 600096"
    building: "Abhavtech Data Center"
    type: "Regional Hub + DR"
    
  current_infrastructure:
    wan_routers:
      - "Cisco ASR 1001-X (Primary)"
      - "Cisco ISR 4451 (Backup)"
    wan_circuits:
      - "MPLS 500 Mbps (Tata)"
      - "Internet 200 Mbps"
    lan_infrastructure:
      - "Catalyst 9500 (Core)"
      - "SD-Access Fabric Border (2x)"
    users: 350
    
  target_infrastructure:
    wan_edges:
      - "C8500-12X4QC (Primary)"
      - "C8500-12X4QC (Secondary)"
    transports:
      - "MPLS 500 Mbps (retained Phase 1)"
      - "Internet 500 Mbps (ACT)"
      - "LTE Backup"
      
  sd_access_integration:
    fabric_borders: 2
    vns_mapped: 5
    bgp_peering: "eBGP to both borders"
    sgt_propagation: true
    
  special_considerations:
    - "DR site for Mumbai - verify replication"
    - "SD-Access integration critical"
    - "Extended maintenance window required"
    - "Staged WAN Edge deployment"
```

### Mumbai Primary Hub

```yaml
mumbai_hub_details:
  site_profile:
    address: "BKC, Mumbai 400051"
    building: "Abhavtech HQ"
    type: "Primary Hub + Data Center"
    
  current_infrastructure:
    wan_routers:
      - "Cisco ASR 1002-HX (Primary)"
      - "Cisco ASR 1002-HX (Secondary)"
    wan_circuits:
      - "MPLS 1 Gbps (Tata Primary)"
      - "MPLS 500 Mbps (Reliance Backup)"
      - "Internet 500 Mbps (DIA)"
    data_center:
      - "SAP Primary"
      - "Email Servers"
      - "DNS/DHCP"
      - "Application Servers"
    sd_access:
      - "Primary Fabric Domain"
      - "ISE Primary Node"
      - "Catalyst Center"
    users: 500
    
  target_infrastructure:
    wan_edges:
      - "C8500-12X4QC (Primary)"
      - "C8500-12X4QC (Secondary)"
    transports:
      - "MPLS 1 Gbps (retained until final cutover)"
      - "Internet 1 Gbps (Jio)"
      - "Internet 500 Mbps (ACT - backup)"
      
  critical_dependencies:
    - "All other sites migrated first"
    - "Chennai DR validated"
    - "SD-Access integration tested"
    - "Extended observation period"
    
  risk_mitigations:
    - "12-hour maintenance window"
    - "Cisco TAC on standby"
    - "Executive approval required"
    - "Staged traffic migration"
```

---

## 7.3.3 Migration Runbook Template

### Standard Migration Runbook

```yaml
migration_runbook:
  document_header:
    title: "SD-WAN Migration Runbook"
    site: "[SITE_NAME]"
    date: "[MIGRATION_DATE]"
    version: "1.0"
    author: "[ENGINEER_NAME]"
    approver: "[TECHNICAL_LEAD]"
    
  section_1_overview:
    site_id: ""
    site_type: ""
    migration_window: ""
    expected_duration: ""
    rollback_deadline: ""
    
  section_2_contacts:
    migration_lead:
      name: ""
      phone: ""
      role: "Technical Lead"
      
    site_contact:
      name: ""
      phone: ""
      role: "On-site Support"
      
    escalation:
      level_1: "NOC Manager"
      level_2: "IT Director"
      level_3: "CTO"
      
  section_3_prerequisites:
    infrastructure:
      - "[ ] WAN Edge device staged"
      - "[ ] Circuits active and tested"
      - "[ ] Templates configured"
      - "[ ] Monitoring configured"
      
    approvals:
      - "[ ] CAB approval received"
      - "[ ] User notification sent"
      - "[ ] Site contact confirmed"
      
    validation:
      - "[ ] Lab testing completed"
      - "[ ] Rollback tested"
      - "[ ] Baseline captured"
      
  section_4_migration_steps:
    pre_migration:
      step_1:
        time: "T-30"
        action: "Team assembly"
        verification: "All team members on bridge"
        
      step_2:
        time: "T-15"
        action: "Pre-migration health check"
        verification: "Current state documented"
        
      step_3:
        time: "T-5"
        action: "Go/No-go decision"
        verification: "Approval to proceed"
        
    migration:
      step_4:
        time: "T+0"
        action: "Begin migration window"
        verification: "NOC notified"
        
      step_5:
        time: "T+15"
        action: "Power on WAN Edge"
        verification: "Device booted"
        command: "show version"
        
      step_6:
        time: "T+30"
        action: "Verify control connections"
        verification: "All controllers connected"
        command: "show sdwan control connections"
        
      step_7:
        time: "T+45"
        action: "Verify tunnels"
        verification: "BFD sessions up"
        command: "show sdwan bfd sessions"
        
      step_8:
        time: "T+60"
        action: "Connect LAN"
        verification: "LAN interface up"
        
      step_9:
        time: "T+75"
        action: "Traffic validation"
        verification: "Applications accessible"
        
      step_10:
        time: "T+90"
        action: "Cutover to SD-WAN"
        verification: "Traffic flowing"
        
    post_migration:
      step_11:
        time: "T+120"
        action: "Performance validation"
        verification: "Within baseline"
        
      step_12:
        time: "T+150"
        action: "Final checks"
        verification: "All tests pass"
        
      step_13:
        time: "T+180"
        action: "Migration complete"
        verification: "Sign-off obtained"
        
  section_5_rollback:
    trigger_conditions:
      - "Critical application failure"
      - "Unable to establish connectivity"
      - "Performance severely degraded"
      - "Exceeding maintenance window"
      
    rollback_steps:
      step_1: "Disconnect WAN Edge from LAN"
      step_2: "Verify MPLS still active"
      step_3: "Restore original routing"
      step_4: "Confirm user connectivity"
      step_5: "Document issues"
      
  section_6_signoff:
    migration_engineer: ""
    technical_lead: ""
    noc_confirmation: ""
    timestamp: ""
```

---

## 7.3.4 Go/No-Go Criteria

### Pre-Migration Gate

```yaml
pre_migration_gate:
  mandatory_criteria:
    infrastructure:
      - criterion: "WAN Edge device configured and staged"
        owner: "Network Engineer"
        evidence: "Configuration backup"
        
      - criterion: "Primary circuit active"
        owner: "Procurement"
        evidence: "Speed test results"
        
      - criterion: "Backup circuit tested"
        owner: "Network Engineer"
        evidence: "Failover test log"
        
    planning:
      - criterion: "Migration runbook approved"
        owner: "Technical Lead"
        evidence: "Signed document"
        
      - criterion: "Rollback procedure documented"
        owner: "Network Engineer"
        evidence: "Tested procedure"
        
      - criterion: "CAB approval obtained"
        owner: "Project Manager"
        evidence: "CAB minutes"
        
    communication:
      - criterion: "User notification sent"
        owner: "Project Manager"
        evidence: "Email confirmation"
        
      - criterion: "Site contact confirmed"
        owner: "Project Manager"
        evidence: "Acknowledgment"
        
    team_readiness:
      - criterion: "Migration team available"
        owner: "Technical Lead"
        evidence: "Attendance confirmed"
        
      - criterion: "On-call support arranged"
        owner: "NOC Lead"
        evidence: "Schedule confirmed"
        
  go_decision:
    authority: "Technical Lead"
    escalation: "Project Manager"
    documentation: "Go/No-Go checklist signed"
```

### Post-Migration Gate

```yaml
post_migration_gate:
  success_criteria:
    connectivity:
      - "All control connections established"
      - "BFD tunnels to all required sites"
      - "OMP routes exchanged"
      - "LAN connectivity verified"
      
    performance:
      - "Latency within 10% of baseline"
      - "Packet loss < 0.1%"
      - "Application response acceptable"
      
    stability:
      - "No critical alarms"
      - "No tunnel flapping"
      - "No user complaints"
      
  observation_period:
    immediate: "2 hours post-migration"
    next_business_day: "Full day monitoring"
    one_week: "Trend analysis"
    
  close_criteria:
    - "All success criteria met"
    - "User acceptance confirmed"
    - "Documentation completed"
    - "Lessons learned captured"
```

---

## 7.3.5 Site Migration Tracking

### Migration Status Dashboard

```yaml
migration_tracking:
  dashboard_fields:
    site_name: ""
    planned_date: ""
    actual_date: ""
    status: "[Not Started|In Progress|Completed|Failed|Rolled Back]"
    health: "[Green|Yellow|Red]"
    notes: ""
    
  current_status:
    bangalore:
      status: "Completed"
      date: "2025-01-15"
      health: "Green"
      
    delhi:
      status: "Scheduled"
      date: "2025-01-22"
      health: "N/A"
      
    noida:
      status: "Scheduled"
      date: "2025-01-29"
      health: "N/A"
      
    # Continue for all sites...
    
  metrics:
    total_sites: 9
    completed: 1
    in_progress: 0
    scheduled: 8
    issues: 0
    
  blockers:
    - site: ""
      issue: ""
      owner: ""
      resolution_date: ""
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
