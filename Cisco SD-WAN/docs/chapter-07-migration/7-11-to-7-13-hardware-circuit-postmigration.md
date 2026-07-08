# 7.11 Hardware Refresh Strategy

## 7.11.1 Current Hardware Assessment

### Existing Equipment Inventory

```yaml
current_inventory:
  wan_routers:
    hub_sites:
      mumbai:
        device: "Cisco ASR 1002-HX"
        quantity: 2
        age: "4 years"
        eos_date: "2026-06"
        status: "Operational"
        
      chennai:
        device: "Cisco ASR 1001-X"
        quantity: 1
        age: "5 years"
        eos_date: "2025-12"
        status: "End of life approaching"
        
      london:
        device: "Cisco ISR 4451"
        quantity: 1
        age: "3 years"
        eos_date: "2027-06"
        status: "Operational"
        
      newjersey:
        device: "Cisco ISR 4451"
        quantity: 1
        age: "3 years"
        eos_date: "2027-06"
        status: "Operational"
        
    branch_sites:
      bangalore:
        device: "Cisco ISR 4331"
        quantity: 1
        age: "4 years"
        
      delhi:
        device: "Cisco ISR 4321"
        quantity: 1
        age: "5 years"
        
      noida:
        device: "Cisco ISR 4321"
        quantity: 1
        age: "4 years"
        
      frankfurt:
        device: "Cisco ISR 4331"
        quantity: 1
        age: "3 years"
        
      dallas:
        device: "Cisco ISR 4331"
        quantity: 1
        age: "3 years"
```

### Hardware Refresh Analysis

```yaml
refresh_analysis:
  decision_factors:
    sd_wan_support:
      factor: "Native SD-WAN capability"
      current_state: "Legacy routers - limited SD-WAN support"
      recommendation: "Replace with Catalyst 8000 series"
      
    performance:
      factor: "Throughput and feature capacity"
      current_state: "Adequate for MPLS"
      recommendation: "Upgrade for DIA + encryption overhead"
      
    lifecycle:
      factor: "Hardware end-of-life"
      current_state: "Some devices approaching EoS"
      recommendation: "Replace before EoS"
      
  refresh_decision: "Full refresh to Catalyst 8000 series"
  rationale:
    - "Native SD-WAN support"
    - "Higher throughput for encryption"
    - "Consistent platform across sites"
    - "Extended lifecycle"
```

## 7.11.2 Target Hardware Selection

### WAN Edge Platform Selection

```yaml
platform_selection:
  hub_sites:
    primary_choice: "Catalyst 8500-12X4QC"
    rationale:
      - "High throughput (40 Gbps)"
      - "Multiple 10G/40G interfaces"
      - "HA support"
      - "Future growth capacity"
    specifications:
      throughput: "40 Gbps with services"
      interfaces: "12x 10G SFP+, 4x 40G QSFP"
      memory: "32 GB"
      storage: "480 GB SSD"
      power: "Dual AC/DC"
      
  regional_branches:
    primary_choice: "Catalyst 8300-2N2S-4T"
    rationale:
      - "Right-sized for branch"
      - "Multiple WAN interfaces"
      - "Cost-effective"
    specifications:
      throughput: "10 Gbps with services"
      interfaces: "2x NIM, 4x 1G"
      memory: "16 GB"
      
  small_branches:
    primary_choice: "Catalyst 8200L-1N-4T"
    rationale:
      - "Entry-level SD-WAN"
      - "Compact form factor"
      - "Cost-optimized"
    specifications:
      throughput: "2 Gbps with services"
      interfaces: "4x 1G"
      memory: "8 GB"
```

### Hardware Bill of Materials

```yaml
hardware_bom:
  wan_edges:
    c8500_12x4qc:
      description: "Catalyst 8500-12X4QC"
      quantity: 8
      unit_price: 35000
      total: 280000
      deployment:
        - "Mumbai Hub (2)"
        - "Chennai Hub (2)"
        - "London Hub (2)"
        - "New Jersey Hub (2)"
        
    c8300_2n2s_4t:
      description: "Catalyst 8300-2N2S-4T"
      quantity: 5
      unit_price: 12000
      total: 60000
      deployment:
        - "Bangalore (1)"
        - "Delhi (1)"
        - "Noida (1)"
        - "Frankfurt (1)"
        - "Dallas (1)"
        
  accessories:
    sfp_modules:
      description: "10G SFP+ SR/LR"
      quantity: 48
      unit_price: 500
      total: 24000
      
    power_cables:
      description: "Country-specific power cables"
      quantity: 26
      total: 1000
      
    console_cables:
      description: "USB console cables"
      quantity: 13
      total: 500
      
  spare_inventory:
    c8300_spare:
      quantity: 1
      purpose: "Branch replacement"
      location: "Mumbai warehouse"
      
  total_hardware: 365500
```

## 7.11.3 Legacy Equipment Disposition

### Decommission Plan

```yaml
decommission_plan:
  timeline:
    phase_1: "Branch routers - Week 16-18"
    phase_2: "Hub routers - Week 19-22"
    
  disposition_options:
    trade_in:
      partner: "Cisco"
      program: "Cisco Refresh"
      estimated_value: 25000
      
    resale:
      channel: "Authorized reseller"
      estimated_value: 15000
      
    internal_reuse:
      purpose: "Lab equipment"
      quantity: 2
      
    recycling:
      method: "Certified e-waste recycler"
      compliance: "WEEE/RoHS"
      
  data_sanitization:
    requirement: "NIST 800-88 compliant"
    method: "Configuration wipe + factory reset"
    verification: "Documented attestation"
```

---

# 7.12 Circuit Migration Procedures

## 7.12.1 Circuit Inventory

### Current Circuit Portfolio

```yaml
circuit_inventory:
  mpls_circuits:
    provider: "Tata Communications"
    contract_end: "June 2026"
    total_monthly: 81000
    
    circuits:
      - id: "TATA-MUM-001"
        site: "Mumbai"
        type: "MPLS"
        bandwidth: "1 Gbps"
        monthly: 15000
        status: "Active"
        
      - id: "TATA-CHE-001"
        site: "Chennai"
        type: "MPLS"
        bandwidth: "500 Mbps"
        monthly: 9000
        status: "Active"
        
      # ... additional circuits
      
  new_circuits:
    internet_dia:
      provider_primary: "Jio Business"
      provider_secondary: "ACT Fibernet"
      
      circuits:
        - id: "JIO-MUM-001"
          site: "Mumbai"
          type: "Internet DIA"
          bandwidth: "1 Gbps"
          monthly: 2500
          status: "Ordered"
          
        - id: "ACT-CHE-001"
          site: "Chennai"
          type: "Internet DIA"
          bandwidth: "500 Mbps"
          monthly: 1500
          status: "Ordered"
          
    lte_backup:
      provider: "Airtel Business"
      type: "4G/5G"
      monthly_per_site: 200
```

## 7.12.2 Circuit Provisioning

### New Circuit Provisioning Process

```yaml
circuit_provisioning:
  timeline:
    order_lead_time: "4-6 weeks"
    installation: "1-2 weeks"
    testing: "1 week"
    
  process:
    step_1:
      name: "Requirements definition"
      duration: "Week 1"
      activities:
        - "Define bandwidth requirements"
        - "Specify SLA requirements"
        - "Identify delivery locations"
        
    step_2:
      name: "RFQ and selection"
      duration: "Week 2-3"
      activities:
        - "Issue RFQ to providers"
        - "Evaluate proposals"
        - "Select providers"
        
    step_3:
      name: "Contract and order"
      duration: "Week 4"
      activities:
        - "Contract negotiation"
        - "Place orders"
        - "Confirm delivery dates"
        
    step_4:
      name: "Installation"
      duration: "Week 5-8"
      activities:
        - "Provider installation"
        - "CPE configuration"
        - "Initial testing"
        
    step_5:
      name: "Acceptance testing"
      duration: "Week 9"
      activities:
        - "Speed testing"
        - "Latency verification"
        - "SLA baseline"
```

### Circuit Testing Procedures

```yaml
circuit_testing:
  speed_test:
    tool: "iPerf3"
    duration: "10 minutes"
    direction: "Bidirectional"
    acceptance: ">95% contracted bandwidth"
    
  latency_test:
    tool: "ping"
    samples: 1000
    acceptance:
      regional: "<50ms"
      intercontinental: "<150ms"
      
  packet_loss_test:
    tool: "ping"
    duration: "24 hours"
    acceptance: "<0.1%"
    
  path_diversity_test:
    tool: "traceroute"
    verification: "Different physical paths"
```

## 7.12.3 MPLS Circuit Termination

### Termination Process

```yaml
mpls_termination:
  notice_requirements:
    contract_clause: "60-day notice required"
    written_notice: "Formal letter to provider"
    
  termination_sequence:
    week_minus_8:
      - "Review contract termination clauses"
      - "Confirm sites ready for termination"
      - "Prepare termination notices"
      
    week_minus_6:
      - "Submit formal termination notices"
      - "Confirm receipt acknowledgment"
      
    week_minus_4:
      - "Final traffic verification"
      - "Confirm no MPLS dependency"
      
    week_minus_1:
      - "Schedule circuit disconnection"
      - "Arrange CPE return if applicable"
      
    week_0:
      - "Circuit disconnected by provider"
      - "Verify final billing"
      - "Document completion"
      
  termination_schedule:
    branch_circuits: "Week 15-16"
    hub_circuits: "Week 18-20"
    mumbai_primary: "Week 22"
```

---

# 7.13 Post-Migration Optimization

## 7.13.1 Optimization Framework

### Optimization Phases

```yaml
optimization_framework:
  phase_1_stabilization:
    duration: "Weeks 1-4 post-migration"
    focus:
      - "Monitoring and alerting tuning"
      - "Issue resolution"
      - "Performance baseline"
    activities:
      - "Review alarm thresholds"
      - "Tune BFD timers"
      - "Optimize routing policies"
      
  phase_2_enhancement:
    duration: "Weeks 5-8 post-migration"
    focus:
      - "Policy optimization"
      - "Application performance"
      - "Cost optimization"
    activities:
      - "Implement Cloud OnRamp for SaaS"
      - "Fine-tune QoS policies"
      - "Enable DIA where appropriate"
      
  phase_3_advanced:
    duration: "Weeks 9-12 post-migration"
    focus:
      - "Advanced features"
      - "Automation"
      - "Documentation"
    activities:
      - "Implement automated remediation"
      - "Deploy API integrations"
      - "Complete documentation"
```

## 7.13.2 Performance Optimization

### Application Performance Tuning

```yaml
application_optimization:
  saa_optimization:
    office_365:
      current: "Backhauled via hub"
      optimized: "Direct via Cloud OnRamp"
      expected_improvement: "40% latency reduction"
      
    salesforce:
      current: "Via hub"
      optimized: "Cloud OnRamp SaaS"
      expected_improvement: "35% latency reduction"
      
    sap:
      current: "Private WAN"
      optimized: "Optimized path with QoS"
      expected_improvement: "Consistent performance"
      
  qos_optimization:
    voice_video:
      dscp: "EF (46)"
      queue: "LLQ 30%"
      result: "Guaranteed quality"
      
    business_critical:
      dscp: "AF31 (26)"
      queue: "CBWFQ 40%"
      result: "Priority bandwidth"
      
    default:
      dscp: "BE (0)"
      queue: "Fair queue 30%"
      result: "Best effort"
```

### Path Optimization

```yaml
path_optimization:
  aar_tuning:
    latency_thresholds:
      voice: 150  # ms
      video: 200  # ms
      business: 300  # ms
      
    loss_thresholds:
      voice: 1  # percent
      video: 2  # percent
      business: 5  # percent
      
    jitter_thresholds:
      voice: 30  # ms
      video: 50  # ms
      
  multi_path:
    load_balancing:
      method: "ECMP"
      paths: 4
      
    failover:
      detection: "BFD"
      switchover: "<1 second"
```

## 7.13.3 Cost Optimization

### Post-Migration Cost Review

```yaml
cost_optimization:
  circuit_right_sizing:
    review_period: "90 days post-migration"
    analysis:
      - "Peak utilization"
      - "P95 utilization"
      - "Growth trends"
    actions:
      - "Downgrade underutilized circuits"
      - "Upgrade constrained circuits"
      - "Negotiate better rates"
      
  mpls_reduction:
    phase_1:
      sites: "All branches"
      action: "Terminate MPLS"
      savings: "$XX,XXX/month"
      
    phase_2:
      sites: "Secondary hub circuits"
      action: "Terminate MPLS backup"
      savings: "$XX,XXX/month"
      
    phase_3:
      sites: "Primary hub circuits"
      action: "Reduce MPLS to minimum"
      savings: "$XX,XXX/month"
      
  license_optimization:
    review:
      - "Feature utilization"
      - "License tier appropriateness"
      - "Term optimization"
```

## 7.13.4 Documentation Updates

### Post-Migration Documentation

```yaml
documentation_updates:
  network_documentation:
    topology_diagrams:
      - "Updated network diagrams"
      - "SD-WAN overlay topology"
      - "Integration diagrams"
      
    configuration:
      - "Template documentation"
      - "Policy documentation"
      - "Integration configuration"
      
  operational_documentation:
    runbooks:
      - "Day 2 operations runbook"
      - "Troubleshooting guide"
      - "Escalation procedures"
      
    procedures:
      - "Change management"
      - "Incident response"
      - "Backup and recovery"
      
  training_materials:
    - "Updated training decks"
    - "Lab exercises"
    - "Quick reference guides"
```

## 7.13.5 Success Metrics

### KPI Tracking

```yaml
success_metrics:
  technical_kpis:
    availability:
      target: "99.95%"
      measurement: "Monthly"
      
    latency:
      target: "Within 10% of baseline"
      measurement: "Daily average"
      
    packet_loss:
      target: "<0.1%"
      measurement: "Daily"
      
  business_kpis:
    cost_savings:
      target: "$XX,XXX/month"
      measurement: "Monthly"
      
    provisioning_time:
      target: "<5 days for new site"
      measurement: "Per deployment"
      
    user_satisfaction:
      target: ">90% satisfied"
      measurement: "Quarterly survey"
      
  operational_kpis:
    mttr:
      target: "<2 hours for P1"
      measurement: "Per incident"
      
    change_success:
      target: ">95%"
      measurement: "Monthly"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
