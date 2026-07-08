# 7.4 Rollback Procedures

!!! note "A note on costing"
    Monetary values in the TCO and ROI sections of this document are shown as masked placeholders (e.g. `$X,XXX`). The figures are illustrative and intentionally redacted; percentages, ratios, quantities, and methodology are retained. Obtain current pricing from your Cisco account team and transport providers for any real-world business case.

## 7.4.1 Rollback Strategy

### Rollback Philosophy

```yaml
rollback_strategy:
  principle: "Always have a working fallback"
  
  key_elements:
    parallel_operation:
      description: "Maintain MPLS during migration"
      duration: "Until site stabilized"
      
    quick_revert:
      description: "Ability to rollback within minutes"
      method: "Disconnect SD-WAN, restore MPLS routing"
      
    tested_procedures:
      description: "All rollback procedures validated"
      requirement: "Lab tested before production"
      
  rollback_types:
    immediate:
      trigger: "Critical failure during migration"
      timeframe: "< 15 minutes"
      
    planned:
      trigger: "Issues discovered post-migration"
      timeframe: "Within maintenance window"
      
    emergency:
      trigger: "Business-critical impact"
      timeframe: "ASAP"
```

### Branch Site Rollback Procedure

```yaml
branch_rollback:
  pre_conditions:
    - "MPLS circuit still active"
    - "Original router accessible"
    - "Rollback team available"
    
  procedure:
    step_1:
      action: "Announce rollback decision"
      command: "Notify all stakeholders"
      time: "T+0"
      
    step_2:
      action: "Disconnect WAN Edge from LAN"
      physical: "Unplug LAN cable from WAN Edge"
      time: "T+2 min"
      
    step_3:
      action: "Verify MPLS router interface up"
      command: "show interface GigabitEthernet0/0/0"
      time: "T+3 min"
      
    step_4:
      action: "Verify MPLS connectivity"
      command: "ping [hub_ip] source [lan_interface]"
      time: "T+5 min"
      
    step_5:
      action: "Verify LAN routing to MPLS"
      verification: "Traceroute shows MPLS path"
      time: "T+7 min"
      
    step_6:
      action: "Test application connectivity"
      tests:
        - "SAP access"
        - "Email"
        - "File shares"
      time: "T+10 min"
      
    step_7:
      action: "Confirm with users"
      verification: "Key users validate access"
      time: "T+15 min"
      
    step_8:
      action: "Power down WAN Edge"
      action: "Graceful shutdown"
      time: "T+20 min"
      
  post_rollback:
    - "Document rollback reason"
    - "Root cause analysis"
    - "Update migration plan"
    - "Schedule retry"
```

### Hub Site Rollback Procedure

```yaml
hub_rollback:
  complexity: "Higher due to multiple dependencies"
  
  procedure:
    step_1:
      action: "Assess impact scope"
      considerations:
        - "Connected branches"
        - "SD-Access integration"
        - "Application dependencies"
        
    step_2:
      action: "Notify all affected sites"
      scope: "All sites connecting to this hub"
      
    step_3:
      action: "Disable SD-WAN routing preference"
      method: "Adjust BGP local preference"
      command: |
        router bgp 65001
         neighbor [sdwan_peer] route-map DEPREF in
        !
        route-map DEPREF permit 10
         set local-preference 50
         
    step_4:
      action: "Verify traffic shifts to MPLS"
      verification: "Monitor traffic counters"
      
    step_5:
      action: "Disable SD-Access BGP peering"
      if_applicable: true
      command: |
        router bgp 65001
         neighbor [fabric_border] shutdown
         
    step_6:
      action: "Disconnect WAN Edge HA pair"
      sequence:
        - "Shutdown secondary"
        - "Shutdown primary"
        
    step_7:
      action: "Full connectivity validation"
      tests:
        - "All branch connectivity"
        - "Application access"
        - "Inter-site communication"
```

---

# 7.5 Migration Testing

## 7.5.1 Test Strategy

### Testing Phases

```yaml
testing_strategy:
  pre_migration_testing:
    lab_validation:
      purpose: "Validate procedures"
      environment: "Lab with simulated topology"
      tests:
        - "ZTP deployment"
        - "Template attachment"
        - "Tunnel establishment"
        - "Failover scenarios"
        
    circuit_testing:
      purpose: "Verify new circuits"
      tests:
        - "Speed test"
        - "Latency measurement"
        - "Packet loss check"
        - "Path verification"
        
  migration_testing:
    connectivity:
      - "Control plane connections"
      - "BFD tunnel status"
      - "OMP route exchange"
      - "LAN connectivity"
      
    application:
      - "Critical app access"
      - "Response time"
      - "Transaction completion"
      
  post_migration_testing:
    performance:
      - "Latency comparison"
      - "Throughput verification"
      - "Application performance"
      
    failover:
      - "Circuit failover"
      - "HA failover"
      - "Path selection"
```

### Test Cases

```yaml
test_cases:
  tc_001:
    name: "Control Plane Connectivity"
    category: "Connectivity"
    priority: "Critical"
    procedure: "Verify WAN Edge connects to all controllers"
    command: "show sdwan control connections"
    expected: "vManage, vSmart (x2), vBond - all connected"
    pass_criteria: "All 4 connections established"
    
  tc_002:
    name: "BFD Tunnel Establishment"
    category: "Connectivity"
    priority: "Critical"
    procedure: "Verify BFD sessions to hub sites"
    command: "show sdwan bfd sessions"
    expected: "BFD UP to all hub TLOCs"
    pass_criteria: "All expected tunnels UP"
    
  tc_003:
    name: "OMP Route Exchange"
    category: "Routing"
    priority: "Critical"
    procedure: "Verify routes received via OMP"
    command: "show sdwan omp routes"
    expected: "Routes to all sites received"
    pass_criteria: "Route count matches expected"
    
  tc_004:
    name: "Application Latency"
    category: "Performance"
    priority: "High"
    procedure: "Measure latency to critical applications"
    tool: "ping / application monitoring"
    expected: "Within 10% of baseline"
    pass_criteria: "Latency acceptable"
    
  tc_005:
    name: "SAP Transaction"
    category: "Application"
    priority: "Critical"
    procedure: "Execute SAP test transaction"
    tool: "SAP client"
    expected: "Transaction completes successfully"
    pass_criteria: "Response time acceptable"
    
  tc_006:
    name: "Voice Quality"
    category: "Application"
    priority: "High"
    procedure: "Make test voice call"
    expected: "Clear audio, no drops"
    pass_criteria: "MOS score > 4.0"
    
  tc_007:
    name: "Circuit Failover"
    category: "Resilience"
    priority: "High"
    procedure: "Simulate primary circuit failure"
    action: "Disconnect primary WAN interface"
    expected: "Traffic fails over to backup"
    pass_criteria: "Failover < 30 seconds"
    
  tc_008:
    name: "HA Failover"
    category: "Resilience"
    priority: "High"
    applicable: "Hub sites only"
    procedure: "Simulate primary WAN Edge failure"
    action: "Shutdown primary device"
    expected: "Secondary takes over"
    pass_criteria: "Failover < 3 seconds"
```

---

# 7.6 Total Cost of Ownership (TCO)

## 7.6.1 Current State Costs

### MPLS Network Costs

```yaml
current_costs:
  monthly_recurring:
    mpls_circuits:
      mumbai: 15000
      chennai: 9000
      london: 12000
      newjersey: 11000
      bangalore: 6000
      delhi: 5500
      noida: 5500
      frankfurt: 9000
      dallas: 8000
      total: 81000
      
    equipment_support:
      cisco_smartnet: 3500
      
    management:
      noc_staff: 8000  # Allocated portion
      tools_licenses: 1500
      
    total_monthly: 94000
    
  annual_costs:
    circuits: 972000
    support: 42000
    management: 114000
    total_annual: 1128000
    
  pain_points:
    provisioning_time: "45-60 days for new circuits"
    flexibility: "Limited bandwidth changes"
    visibility: "No application-level insights"
    direct_internet: "Not available"
```

### TCO Breakdown

```
CURRENT STATE - ANNUAL TCO
==========================

Category                    Annual Cost
-----------------------------------------
MPLS Circuits               $XXX,XXX
 - Hub sites (4)            $XXX,XXX
 - Branch sites (5)         $XXX,XXX

Equipment Support           $XX,XXX
 - SmartNet coverage        $XX,XXX

Operations                  $XXX,XXX
 - NOC staff (allocated)    $XX,XXX
 - Tools & licenses         $XX,XXX

-----------------------------------------
TOTAL ANNUAL TCO            $X,XXX,XXX
Monthly Average             $XX,XXX
```

## 7.6.2 SD-WAN Target State Costs

### Projected SD-WAN Costs

```yaml
sdwan_costs:
  one_time_costs:
    wan_edge_hardware:
      c8500_units: 8
      c8500_unit_cost: 35000
      c8500_total: 280000
      
      c8300_units: 10
      c8300_unit_cost: 12000
      c8300_total: 120000
      
      total_hardware: 400000
      
    controller_infrastructure:
      vmanage_cluster: 45000  # Virtual appliances
      vsmart_pair: 20000
      vbond_pair: 10000
      total_controllers: 75000
      
    implementation_services:
      cisco_partner: 80000
      internal_labor: 40000
      total_services: 120000
      
    total_one_time: 595000
    
  monthly_recurring:
    circuits:
      mpls_retained:
        mumbai: 15000  # Retained until optimization
        chennai: 9000
        total_mpls: 24000
        
      internet_dia:
        mumbai: 2500
        chennai: 1500
        london: 2000
        newjersey: 1800
        bangalore: 800
        delhi: 700
        noida: 700
        frankfurt: 1500
        dallas: 1200
        total_internet: 12700
        
      lte_backup:
        total: 2000
        
      total_circuits: 38700
      
    licensing:
      dna_advantage:
        devices: 18
        per_device: 175  # 3-year term monthly
        total: 3150
        
    support:
      smartnet: 2500
      
    cloud_services:
      cloud_onramp: 500
      
    total_monthly: 44850
    
  annual_recurring:
    circuits: 464400
    licensing: 37800
    support: 30000
    cloud: 6000
    total_annual: 538200
```

### TCO Comparison

```
SD-WAN STATE - ANNUAL TCO (STEADY STATE)
========================================

Category                    Annual Cost
-----------------------------------------
Circuit Costs               $XXX,XXX
 - MPLS retained (2)        $XXX,XXX
 - Internet DIA (9)         $XXX,XXX
 - LTE backup               $XX,XXX

Licensing                   $XX,XXX
 - DNA Advantage            $XX,XXX

Support & Maintenance       $XX,XXX
 - SmartNet                 $XX,XXX

Cloud Services              $X,XXX
 - Cloud OnRamp             $X,XXX

-----------------------------------------
TOTAL ANNUAL TCO            $XXX,XXX
Monthly Average             $XX,XXX

SAVINGS vs CURRENT STATE
========================
Annual Savings: $XXX,XXX
Monthly Savings: $XX,XXX
Percentage: 52.3%
```

---

# 7.7 Return on Investment (ROI)

## 7.7.1 ROI Analysis

### Investment Summary

```yaml
roi_analysis:
  investment:
    one_time_costs:
      hardware: 400000
      controllers: 75000
      implementation: 120000
      total: 595000
      
  annual_savings:
    circuit_cost_reduction: 507600
    operational_efficiency: 50000
    reduced_provisioning_time: 20000
    application_performance: 12000
    total_annual: 589600
    
  roi_calculation:
    payback_period_months: 12.1
    three_year_roi: 197.4
    five_year_roi: 395.8
    npv_5_year: 1847000  # 8% discount rate
```

### ROI Timeline

```
ROI ANALYSIS - 5 YEAR VIEW
==========================

Year        Investment    Savings      Cumulative    Net Position
------------------------------------------------------------------
Year 0      ($XXX,XXX)    $X           ($XXX,XXX)    ($XXX,XXX)
Year 1      $X            $XXX,XXX     ($X,XXX)      ($X,XXX)
Year 2      $X            $XXX,XXX     $XXX,XXX      $XXX,XXX
Year 3      $X            $XXX,XXX     $X,XXX,XXX    $X,XXX,XXX
Year 4      $X            $XXX,XXX     $X,XXX,XXX    $X,XXX,XXX
Year 5      $X            $XXX,XXX     $X,XXX,XXX    $X,XXX,XXX

Payback Period: 12.1 months
5-Year ROI: 395.8%
5-Year NPV (8%): $X,XXX,XXX
```

### Benefit Categories

```yaml
benefit_breakdown:
  hard_savings:
    circuit_cost_reduction:
      current: 972000
      target: 464400
      savings: 507600
      percentage: 52.2
      
    support_cost_reduction:
      current: 42000
      target: 30000
      savings: 12000
      percentage: 28.6
      
  soft_savings:
    operational_efficiency:
      description: "Reduced manual effort"
      estimated_hours_saved: 500
      hourly_rate: 100
      annual_value: 50000
      
    faster_provisioning:
      description: "Days vs weeks for new sites"
      current_time: "45-60 days"
      new_time: "1-2 days"
      value: 20000
      
    improved_availability:
      description: "Reduced downtime"
      estimated_hours_saved: 24
      cost_per_hour: 5000
      annual_value: 120000  # Risk-adjusted
      
  strategic_benefits:
    application_visibility:
      description: "Insight into application performance"
      value: "Qualitative"
      
    cloud_readiness:
      description: "Direct cloud access"
      value: "Qualitative"
      
    security_improvement:
      description: "Integrated security features"
      value: "Qualitative"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
