# 7.2 MPLS Migration Procedures

## 7.2.1 MPLS Migration Overview

### Current MPLS Infrastructure

```yaml
current_mpls_infrastructure:
  provider: "Tata Communications"
  contract_end: "June 2026"
  monthly_cost: "$XX,XXX"
  
  circuits:
    hub_sites:
      mumbai:
        circuit_id: "TATA-MUM-001"
        bandwidth: "1 Gbps"
        pe_router: "10.254.1.1"
        ce_interface: "GigabitEthernet0/0/0"
        monthly_cost: "$XX,XXX"
        
      chennai:
        circuit_id: "TATA-CHE-001"
        bandwidth: "500 Mbps"
        pe_router: "10.254.2.1"
        monthly_cost: "$X,XXX"
        
      london:
        circuit_id: "TATA-LON-001"
        bandwidth: "200 Mbps"
        pe_router: "10.254.3.1"
        monthly_cost: "$XX,XXX"
        
      newjersey:
        circuit_id: "TATA-NJY-001"
        bandwidth: "200 Mbps"
        pe_router: "10.254.4.1"
        monthly_cost: "$XX,XXX"
        
    branch_sites:
      bangalore:
        circuit_id: "TATA-BLR-001"
        bandwidth: "100 Mbps"
        monthly_cost: "$X,XXX"
        
      delhi:
        circuit_id: "TATA-DEL-001"
        bandwidth: "100 Mbps"
        monthly_cost: "$X,XXX"
        
      noida:
        circuit_id: "TATA-NOI-001"
        bandwidth: "100 Mbps"
        monthly_cost: "$X,XXX"
        
      frankfurt:
        circuit_id: "TATA-FRA-001"
        bandwidth: "100 Mbps"
        monthly_cost: "$X,XXX"
        
      dallas:
        circuit_id: "TATA-DAL-001"
        bandwidth: "100 Mbps"
        monthly_cost: "$X,XXX"
```

### MPLS to SD-WAN Migration Strategy

```yaml
migration_strategy:
  approach: "Parallel operation with gradual traffic shift"
  
  phases:
    phase_1_coexistence:
      description: "SD-WAN deployed alongside MPLS"
      duration: "Weeks 1-8"
      mpls_status: "Primary for all traffic"
      sdwan_status: "Secondary, testing only"
      traffic_split: "100% MPLS"
      
    phase_2_traffic_shift:
      description: "Gradual traffic migration"
      duration: "Weeks 9-12"
      mpls_status: "Backup for critical apps"
      sdwan_status: "Primary for most traffic"
      traffic_split: "30% MPLS / 70% SD-WAN"
      
    phase_3_optimization:
      description: "Full SD-WAN operation"
      duration: "Weeks 13-14"
      mpls_status: "Standby only"
      sdwan_status: "Primary for all traffic"
      traffic_split: "5% MPLS / 95% SD-WAN"
      
    phase_4_decommission:
      description: "MPLS circuit termination"
      duration: "Weeks 15-16"
      mpls_status: "Terminated"
      sdwan_status: "Full production"
      traffic_split: "100% SD-WAN"
```

---

## 7.2.2 Branch Site Migration - Day-by-Day Plan

### Bangalore Branch Migration (Pilot) - 5-Day Plan

```yaml
bangalore_migration:
  site_details:
    site_id: "BLR-001"
    current_wan: "MPLS 100 Mbps"
    new_wan:
      primary: "Internet 200 Mbps (Jio)"
      backup: "LTE (Airtel)"
    wan_edge: "C8300-2N2S-4T"
    users: 85
    critical_apps: ["SAP", "Email", "Voice"]
    
  day_minus_7:
    name: "Pre-Migration Preparation"
    activities:
      - time: "09:00"
        task: "Verify WAN Edge staged and configured"
        owner: "Network Engineer"
        duration: "2 hours"
        
      - time: "11:00"
        task: "Confirm internet circuit active"
        owner: "Procurement"
        verification: "Speed test and latency check"
        
      - time: "14:00"
        task: "Review migration runbook"
        owner: "Technical Lead"
        participants: "Migration team"
        
      - time: "15:00"
        task: "Confirm maintenance window approved"
        owner: "Project Manager"
        verification: "CAB approval documented"
        
    deliverables:
      - "Pre-migration checklist completed"
      - "All prerequisites confirmed"
      
  day_minus_3:
    name: "Final Preparation"
    activities:
      - time: "09:00"
        task: "Send user notification"
        owner: "Project Manager"
        template: "pre_migration_notice"
        
      - time: "10:00"
        task: "Verify monitoring readiness"
        owner: "NOC Lead"
        verification: "Alerts configured for site"
        
      - time: "11:00"
        task: "Prepare rollback procedure"
        owner: "Network Engineer"
        deliverable: "Rollback runbook reviewed"
        
      - time: "14:00"
        task: "Final equipment check"
        owner: "Site Contact"
        verification: "Physical installation ready"
        
  day_minus_1:
    name: "Pre-Migration Validation"
    activities:
      - time: "09:00"
        task: "Performance baseline capture"
        owner: "Network Engineer"
        measurements:
          - "Latency to all sites"
          - "Application response times"
          - "Throughput tests"
          
      - time: "11:00"
        task: "Verify backup connectivity"
        owner: "Network Engineer"
        verification: "LTE backup functional"
        
      - time: "14:00"
        task: "Team briefing"
        owner: "Technical Lead"
        participants: "All migration team"
        agenda: "Review plan, roles, escalation"
        
      - time: "16:00"
        task: "Confirm on-call team"
        owner: "Project Manager"
        verification: "Contact list current"
        
  day_0:
    name: "Migration Day"
    maintenance_window: "22:00 - 02:00 IST"
    
    activities:
      - time: "21:30"
        task: "Team assembly"
        owner: "Technical Lead"
        location: "Bridge call"
        
      - time: "21:45"
        task: "Pre-migration health check"
        owner: "Network Engineer"
        checks:
          - "Current MPLS status"
          - "Application accessibility"
          - "User connectivity"
          
      - time: "22:00"
        task: "Migration window begins"
        owner: "Technical Lead"
        announcement: "NOC and stakeholders notified"
        
      - time: "22:15"
        task: "Power on WAN Edge"
        owner: "Site Contact"
        verification: "Device boots successfully"
        
      - time: "22:30"
        task: "Verify control connections"
        owner: "Network Engineer"
        verification: |
          show sdwan control connections
          - vManage: Connected
          - vSmart: Connected (both)
          - vBond: Discovered
          
      - time: "22:45"
        task: "Verify BFD tunnels"
        owner: "Network Engineer"
        verification: |
          show sdwan bfd sessions
          - All hub tunnels UP
          - BFD timers correct
          
      - time: "23:00"
        task: "Verify OMP routes"
        owner: "Network Engineer"
        verification: |
          show sdwan omp routes
          - All site routes received
          - Proper TLOC preferences
          
      - time: "23:15"
        task: "Connect LAN interface"
        owner: "Site Contact"
        action: "Connect WAN Edge to LAN switch"
        
      - time: "23:30"
        task: "Verify LAN connectivity"
        owner: "Network Engineer"
        verification: |
          show interface status
          show ip route vrf [service-vpn]
          
      - time: "23:45"
        task: "Initial traffic test"
        owner: "Network Engineer"
        tests:
          - "Ping to hub sites"
          - "Traceroute verification"
          - "Application access test"
          
      - time: "00:00"
        task: "Shift traffic to SD-WAN"
        owner: "Network Engineer"
        action: "Update routing/switching to use WAN Edge"
        
      - time: "00:15"
        task: "MPLS interface shutdown"
        owner: "Network Engineer"
        action: "Disable MPLS interface (soft shutdown)"
        verification: "Traffic flowing via SD-WAN"
        
      - time: "00:30"
        task: "Application validation"
        owner: "Network Engineer"
        tests:
          - "SAP transaction test"
          - "Email send/receive"
          - "Voice call test"
          
      - time: "01:00"
        task: "Performance validation"
        owner: "Network Engineer"
        comparison: "Compare to baseline"
        acceptance: "Within 10% of baseline"
        
      - time: "01:30"
        task: "Final monitoring check"
        owner: "NOC"
        verification: "No critical alarms"
        
      - time: "02:00"
        task: "Migration complete"
        owner: "Technical Lead"
        announcement: "Site migrated successfully"
        
  day_plus_1:
    name: "Post-Migration Day 1"
    activities:
      - time: "08:00"
        task: "Morning health check"
        owner: "Network Engineer"
        checks:
          - "All tunnels up"
          - "No alarms"
          - "Traffic flowing"
          
      - time: "09:00"
        task: "User validation"
        owner: "Site Contact"
        action: "Confirm with key users"
        
      - time: "10:00"
        task: "Performance analysis"
        owner: "Network Engineer"
        comparison: "Full day traffic analysis"
        
      - time: "14:00"
        task: "Issue triage"
        owner: "Technical Lead"
        action: "Address any reported issues"
        
      - time: "16:00"
        task: "Day 1 status report"
        owner: "Project Manager"
        distribution: "Steering committee"
        
  day_plus_7:
    name: "Post-Migration Week 1 Review"
    activities:
      - time: "10:00"
        task: "Weekly performance review"
        owner: "Network Engineer"
        metrics:
          - "Latency trends"
          - "Packet loss"
          - "Application performance"
          - "User feedback"
          
      - time: "14:00"
        task: "Lessons learned capture"
        owner: "Technical Lead"
        output: "Update migration runbook"
        
      - time: "15:00"
        task: "Go/No-go for next site"
        owner: "Steering Committee"
        criteria: "Pilot success criteria met"
```

### Standard Branch Migration Template - 3-Day Plan

```yaml
branch_migration_template:
  day_minus_7_to_minus_3:
    preparation_tasks:
      - "Verify WAN Edge configuration"
      - "Confirm circuit readiness"
      - "Complete pre-migration checklist"
      - "Send user notification"
      - "Capture performance baseline"
      
  day_0:
    pre_migration: # T-30 minutes
      - "Team assembly on bridge"
      - "Pre-migration health check"
      - "Confirm go/no-go"
      
    migration: # T+0 to T+3 hours
      hour_1:
        - "Power on WAN Edge"
        - "Verify control connections"
        - "Verify BFD tunnels"
        - "Verify OMP routes"
        
      hour_2:
        - "Connect LAN interface"
        - "Verify LAN connectivity"
        - "Initial traffic test"
        - "Shift traffic to SD-WAN"
        
      hour_3:
        - "Application validation"
        - "Performance comparison"
        - "Final checks"
        - "Declare migration complete"
        
  day_plus_1:
    validation_tasks:
      - "Morning health check"
      - "User confirmation"
      - "Performance analysis"
      - "Issue resolution"
      - "Status report"
```

---

## 7.2.3 Hub Site Migration - Day-by-Day Plan

### Chennai Hub Migration - 7-Day Plan

```yaml
chennai_hub_migration:
  site_details:
    site_id: "CHE-HUB-001"
    current_wan: "MPLS 500 Mbps"
    new_wan:
      primary: "MPLS 500 Mbps (retained initially)"
      secondary: "Internet 500 Mbps (ACT)"
      tertiary: "LTE backup (Airtel)"
    wan_edges:
      - "C8500-12X4QC (Primary)"
      - "C8500-12X4QC (Secondary)"
    users: 350
    critical_apps: ["SAP", "Email", "Voice", "Video"]
    sd_access_integration: true
    fabric_borders: 2
    
  day_minus_14:
    name: "SD-Access Integration Preparation"
    activities:
      - time: "09:00"
        task: "Review SD-Access configuration"
        owner: "Integration Lead"
        focus: "Border node BGP readiness"
        
      - time: "11:00"
        task: "Validate VRF configuration"
        owner: "Network Engineer"
        verification: "VRF-to-VPN mapping confirmed"
        
      - time: "14:00"
        task: "Plan BGP peering"
        owner: "Technical Lead"
        deliverable: "BGP peering design document"
        
  day_minus_7:
    name: "Pre-Migration Preparation"
    activities:
      - time: "09:00"
        task: "WAN Edge pair verification"
        owner: "Network Engineer"
        checks:
          - "Both devices configured"
          - "HA configuration verified"
          - "VRRP settings confirmed"
          
      - time: "11:00"
        task: "Internet circuit testing"
        owner: "Network Engineer"
        tests:
          - "Speed test"
          - "Latency measurement"
          - "Path diversity verification"
          
      - time: "14:00"
        task: "SD-Access border preparation"
        owner: "Integration Lead"
        action: "Pre-configure BGP neighbor statements"
        
      - time: "16:00"
        task: "Stakeholder briefing"
        owner: "Project Manager"
        participants: "Business stakeholders"
        
  day_minus_3:
    name: "Final Preparation"
    activities:
      - time: "09:00"
        task: "Extended maintenance window approval"
        owner: "Project Manager"
        window: "Saturday 22:00 - Sunday 06:00 IST"
        
      - time: "11:00"
        task: "User notification"
        owner: "Project Manager"
        scope: "Chennai site + dependent branches"
        
      - time: "14:00"
        task: "Lab validation of HA failover"
        owner: "Network Engineer"
        test: "Simulate failover scenario"
        
  day_minus_1:
    name: "Pre-Migration Validation"
    activities:
      - time: "09:00"
        task: "Comprehensive baseline capture"
        owner: "Network Engineer"
        measurements:
          - "Latency to all sites"
          - "SD-Access fabric performance"
          - "Application response times"
          - "Voice quality metrics"
          
      - time: "14:00"
        task: "Team readiness check"
        owner: "Technical Lead"
        confirmation: "All team members available"
        
      - time: "16:00"
        task: "Final go/no-go meeting"
        owner: "Project Manager"
        decision: "Proceed with migration"
        
  day_0:
    name: "Migration Day"
    maintenance_window: "22:00 Saturday - 06:00 Sunday IST"
    
    activities:
      - time: "21:00"
        task: "Team assembly"
        owner: "Technical Lead"
        location: "War room + Bridge"
        participants:
          - "Migration team"
          - "SD-Access team"
          - "NOC representative"
          - "Site contact"
          
      - time: "21:30"
        task: "Pre-migration snapshot"
        owner: "Network Engineer"
        action: "Capture running configs"
        
      - time: "22:00"
        task: "Migration begins"
        owner: "Technical Lead"
        announcement: "Window opened"
        
      - time: "22:15"
        task: "Power on Primary WAN Edge"
        owner: "Site Contact"
        verification: "Device boots, console access"
        
      - time: "22:30"
        task: "Verify primary control connections"
        owner: "Network Engineer"
        commands: |
          show sdwan control connections
          show sdwan control local-properties
          
      - time: "22:45"
        task: "Power on Secondary WAN Edge"
        owner: "Site Contact"
        verification: "Device boots"
        
      - time: "23:00"
        task: "Verify HA pair formation"
        owner: "Network Engineer"
        commands: |
          show redundancy
          show vrrp brief
        verification: "Primary/Standby roles correct"
        
      - time: "23:15"
        task: "Verify all BFD tunnels"
        owner: "Network Engineer"
        verification: |
          - Tunnels to all branch sites
          - Tunnels to other hub sites
          - Both transports active
          
      - time: "23:30"
        task: "SD-Access BGP peering"
        owner: "Integration Lead"
        action: "Enable BGP peering to fabric borders"
        verification: "BGP sessions established"
        
      - time: "23:45"
        task: "Verify fabric route exchange"
        owner: "Integration Lead"
        commands: |
          show bgp vpnv4 unicast all summary
          show bgp vpnv4 unicast all
        verification: "Routes exchanged both directions"
        
      - time: "00:00"
        task: "Verify SGT propagation"
        owner: "Security Engineer"
        verification: "SGT tags visible on WAN Edge"
        
      - time: "00:15"
        task: "Connect LAN interfaces"
        owner: "Network Engineer"
        action: "Connect to distribution switches"
        
      - time: "00:30"
        task: "Initial traffic validation"
        owner: "Network Engineer"
        tests:
          - "Ping to all sites"
          - "Traceroute verification"
          - "Fabric traffic flow"
          
      - time: "01:00"
        task: "Traffic shift preparation"
        owner: "Network Engineer"
        action: "Verify routing readiness"
        
      - time: "01:15"
        task: "Execute traffic shift"
        owner: "Network Engineer"
        action: "Update routing to use SD-WAN"
        method: "Adjust BGP local preference"
        
      - time: "01:30"
        task: "Verify traffic flowing via SD-WAN"
        owner: "Network Engineer"
        verification: |
          show sdwan app-route statistics
          show interface counters
          
      - time: "02:00"
        task: "Application validation"
        owner: "Network Engineer"
        tests:
          - "SAP transaction test"
          - "Email functionality"
          - "Voice call quality"
          - "Video conference test"
          
      - time: "02:30"
        task: "HA failover test"
        owner: "Network Engineer"
        action: "Simulate primary failure"
        verification: "Traffic fails over < 3 seconds"
        
      - time: "03:00"
        task: "HA failback"
        owner: "Network Engineer"
        action: "Restore primary"
        verification: "Traffic returns to primary"
        
      - time: "03:30"
        task: "Performance validation"
        owner: "Network Engineer"
        comparison: "Compare to baseline"
        
      - time: "04:00"
        task: "Fabric integration validation"
        owner: "Integration Lead"
        tests:
          - "Cross-VN traffic"
          - "SGT-based policy enforcement"
          - "Route stability"
          
      - time: "04:30"
        task: "Branch site connectivity"
        owner: "Network Engineer"
        verification: "All branches can reach Chennai"
        
      - time: "05:00"
        task: "Final monitoring check"
        owner: "NOC"
        verification: "No critical alarms"
        
      - time: "05:30"
        task: "Migration complete"
        owner: "Technical Lead"
        announcement: "Hub migration successful"
        
      - time: "06:00"
        task: "Window closed"
        owner: "Technical Lead"
        handover: "To on-call support"
        
  day_plus_1:
    name: "Post-Migration Sunday"
    activities:
      - time: "08:00"
        task: "Morning health check"
        owner: "On-call Engineer"
        scope: "Chennai hub and connected sites"
        
      - time: "12:00"
        task: "Detailed analysis"
        owner: "Network Engineer"
        metrics: "Traffic patterns, performance"
        
  day_plus_2:
    name: "Post-Migration Monday (Business Day)"
    activities:
      - time: "07:00"
        task: "Pre-business hours check"
        owner: "Network Engineer"
        verification: "All systems ready"
        
      - time: "09:00"
        task: "Business hours monitoring"
        owner: "NOC"
        focus: "User experience, application performance"
        
      - time: "12:00"
        task: "Midday status"
        owner: "Technical Lead"
        report: "To project manager"
        
      - time: "17:00"
        task: "End of business day review"
        owner: "Network Engineer"
        analysis: "Full day performance"
        
  day_plus_7:
    name: "One Week Review"
    activities:
      - time: "10:00"
        task: "Weekly performance review"
        owner: "Technical Lead"
        deliverable: "Performance report"
        
      - time: "14:00"
        task: "Lessons learned session"
        owner: "Project Manager"
        participants: "Full migration team"
        output: "Updated runbook"
```

---

## 7.2.4 Mumbai Primary Hub Migration

### Mumbai Hub Special Considerations

```yaml
mumbai_hub_considerations:
  criticality: "Highest - Primary hub site"
  
  dependencies:
    sd_access:
      - "Primary fabric domain"
      - "Main border nodes"
      - "ISE primary node"
      
    applications:
      - "SAP primary instance"
      - "Email servers"
      - "DNS primary"
      - "Data center services"
      
    wan:
      - "Hub for all India branches"
      - "International gateway"
      
  risk_mitigation:
    extended_window: "12-hour maintenance window"
    staged_migration: "Primary then Secondary WAN Edge"
    parallel_operation: "MPLS active for 2 weeks post-migration"
    enhanced_support: "Cisco TAC on standby"
    
  rollback_readiness:
    hot_standby: "MPLS immediately available"
    tested_procedure: "Validated in lab"
    decision_point: "Every 2 hours"
```

---

## 7.2.5 MPLS Decommissioning

### Circuit Termination Process

```yaml
mpls_decommission:
  pre_decommission:
    week_minus_4:
      - "Confirm all sites stable on SD-WAN"
      - "Verify no traffic on MPLS circuits"
      - "Notify provider of termination intent"
      
    week_minus_2:
      - "Final traffic analysis"
      - "Confirm termination dates"
      - "Financial reconciliation"
      
    week_minus_1:
      - "Remove MPLS interfaces from routing"
      - "Final monitoring period"
      - "Prepare decommission checklist"
      
  decommission_execution:
    per_site:
      step_1:
        action: "Administrative shutdown MPLS interface"
        verification: "No traffic impact"
        
      step_2:
        action: "Remove MPLS configuration"
        commands: |
          no interface GigabitEthernet0/0/0
          # Remove any MPLS-specific config
          
      step_3:
        action: "Physical disconnection"
        owner: "Site contact"
        
      step_4:
        action: "Notify provider"
        type: "Official termination notice"
        
      step_5:
        action: "Equipment return"
        items: "Provider CPE if applicable"
        
  post_decommission:
    documentation:
      - "Update network diagrams"
      - "Archive old configurations"
      - "Close provider contracts"
      
    financial:
      - "Verify final billing"
      - "Confirm contract termination"
      - "Document cost savings"
```

### Decommission Schedule

```yaml
decommission_schedule:
  week_15:
    sites:
      - "Bangalore Branch"
      - "Delhi Branch"
      - "Noida Branch"
    action: "MPLS circuit termination"
    
  week_16:
    sites:
      - "Frankfurt Branch"
      - "Dallas Branch"
    action: "MPLS circuit termination"
    
  week_17:
    sites:
      - "Chennai Hub"
      - "London Hub"
    action: "MPLS circuit termination"
    
  week_18:
    sites:
      - "New Jersey Hub"
    action: "MPLS circuit termination"
    
  week_20:
    sites:
      - "Mumbai Hub"
    action: "MPLS circuit termination"
    note: "Extended observation period for primary hub"
```

---

## 7.2.6 Migration Checklists

### Pre-Migration Checklist

```yaml
pre_migration_checklist:
  infrastructure:
    - item: "WAN Edge device staged"
      verification: "Physical inspection"
      
    - item: "WAN Edge configuration loaded"
      verification: "show running-config"
      
    - item: "Control plane connectivity verified"
      verification: "show sdwan control connections"
      
    - item: "Internet circuit active"
      verification: "Speed test results"
      
    - item: "Backup circuit tested"
      verification: "Failover test"
      
  planning:
    - item: "Migration runbook reviewed"
      verification: "Team sign-off"
      
    - item: "Rollback procedure documented"
      verification: "Tested in lab"
      
    - item: "Maintenance window approved"
      verification: "CAB approval"
      
    - item: "User notification sent"
      verification: "Email confirmation"
      
  team_readiness:
    - item: "Migration team available"
      verification: "Calendar confirmed"
      
    - item: "On-call support arranged"
      verification: "Contact list current"
      
    - item: "Vendor support on standby"
      verification: "TAC case open (if needed)"
```

### Post-Migration Checklist

```yaml
post_migration_checklist:
  connectivity:
    - item: "All control connections established"
      command: "show sdwan control connections"
      
    - item: "BFD sessions up"
      command: "show sdwan bfd sessions"
      
    - item: "OMP routes received"
      command: "show sdwan omp routes"
      
    - item: "LAN connectivity verified"
      command: "show ip route vrf [vpn]"
      
  performance:
    - item: "Latency within baseline"
      measurement: "ping statistics"
      tolerance: "±10%"
      
    - item: "Packet loss acceptable"
      measurement: "show interface counters"
      threshold: "<0.1%"
      
    - item: "Application performance verified"
      measurement: "Application tests"
      
  security:
    - item: "Encryption active"
      command: "show sdwan ipsec statistics"
      
    - item: "Firewall policies applied"
      command: "show policy access-lists"
      
    - item: "SGT propagation (if applicable)"
      command: "show cts role-based sgt-map"
      
  monitoring:
    - item: "Device visible in vManage"
      verification: "Dashboard check"
      
    - item: "No critical alarms"
      verification: "Alarm console"
      
    - item: "Syslog flowing"
      verification: "SIEM receipt"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
