# Chapter 6: Migration Strategy & Financial Analysis

!!! note "About the financial figures"
    All monetary values in this chapter are shown as indicative placeholders (`$X,XXX`) for illustrative modelling purposes only. They do not represent vendor pricing, quotes, or actual costs. The methodology, cost categories, and analytical structure are the focus; substitute your own validated pricing before using any figure for budgeting or procurement.

## Quick Navigation

| Section | Description |
|---------|-------------|
| [6.1 Migration Strategy](#61-migration-strategy) | Phased approach, dependencies |
| [6.2 Legacy Decommissioning](#62-legacy-decommissioning) | Hardware retirement |
| [6.3 License Mapping](#63-license-mapping) | Legacy to DNA licensing |
| [6.4 Total Cost of Ownership](#64-total-cost-of-ownership-tco) | 5-year TCO analysis |
| [6.5 ROI Analysis](#65-roi-analysis) | Return on investment |
| [6.6 Budget Planning](#66-budget-planning) | CapEx/OpEx breakdown |
| [6.7 Vendor Comparison](#67-vendor-comparison) | Alternative solutions |
| [6.8 Risk-Adjusted Projections](#68-risk-adjusted-projections) | Sensitivity analysis |
| [6.9 Business Case](#69-business-case-summary) | Executive summary |

---

## 6.1 Migration Strategy

### 6.1.1 Migration Approach Selection

| Approach | Description | Risk | Duration | Selected |
|----------|-------------|------|----------|----------|
| Big Bang | All sites simultaneously | High | 4 weeks | |
| Phased by Region | Region at a time | Medium | 32 weeks | |
| Phased by Site | Site at a time | Low | 52 weeks | |
| **Phased Hybrid** | Hub sites first, branches parallel | Medium-Low | 40 weeks | **SELECTED** |

**Rationale for Phased Hybrid Approach**:
- Hub sites migrated sequentially (risk management)
- Branch sites migrated in parallel within regions (efficiency)
- Lessons learned from pilot applied to subsequent sites
- Resources optimized across teams

### 6.1.2 Migration Phases

```
+------------------------------------------------------------------+
|                    MIGRATION TIMELINE (40 WEEKS)                  |
+------------------------------------------------------------------+

Phase 1: Foundation (Weeks 1-6)
+----------------------------------------------------------------+
| Week 1-2  | Week 3-4  | Week 5-6                               |
| DNAC      | ISE       | Integration                            |
| Install   | Deploy    | DNAC-ISE, Underlay Prep                |
+----------------------------------------------------------------+

Phase 2: Pilot (Weeks 7-10)
+----------------------------------------------------------------+
| Week 7-8            | Week 9-10                                |
| Mumbai Pilot        | Validation & Refinement                  |
| (1 Building)        | Lessons Learned                          |
+----------------------------------------------------------------+

Phase 3: Hub Sites (Weeks 11-22)
+----------------------------------------------------------------+
| Week 11-12 | Week 13-14 | Week 15-16 | Week 17-18 | Week 19-22 |
| Mumbai     | Chennai    | London     | Frankfurt  | NJ + Dallas|
| Full       | Full       | Full       | Full       | Full       |
+----------------------------------------------------------------+

Phase 4: Branch Sites (Weeks 23-34)
+----------------------------------------------------------------+
| Week 23-26        | Week 27-30        | Week 31-34             |
| APAC Branches     | EMEA Branches     | Americas Branches      |
| (5 sites)         | (12 sites)        | (15 sites)             |
+----------------------------------------------------------------+

Phase 5: Optimization (Weeks 35-40)
+----------------------------------------------------------------+
| Week 35-36        | Week 37-38        | Week 39-40             |
| Performance       | Training &        | Documentation &        |
| Tuning            | Knowledge         | Handover               |
|                   | Transfer          |                        |
+----------------------------------------------------------------+
```

### 6.1.3 Site Migration Sequence

| Order | Site | Type | Devices | Endpoints | Duration | Dependencies |
|-------|------|------|---------|-----------|----------|--------------|
| 1 | Mumbai (Pilot) | Hub | 10 | 500 | 2 weeks | DNAC/ISE ready |
| 2 | Mumbai (Full) | Hub | 52 | 4,200 | 2 weeks | Pilot success |
| 3 | Chennai | Hub | 40 | 3,100 | 2 weeks | Mumbai complete |
| 4 | London | Hub | 46 | 3,500 | 2 weeks | Chennai complete |
| 5 | Frankfurt | Hub | 32 | 2,400 | 2 weeks | London complete |
| 6 | New Jersey | Hub | 56 | 4,500 | 2 weeks | Frankfurt complete |
| 7 | Dallas | Hub | 36 | 2,800 | 2 weeks | NJ complete |
| 8-12 | APAC Branches | Branch | 5 each | 200-400 | 4 weeks | Hub complete |
| 13-24 | EMEA Branches | Branch | 4 each | 150-300 | 4 weeks | Hub complete |
| 25-39 | Americas Branches | Branch | 4 each | 150-300 | 4 weeks | Hub complete |

### 6.1.4 Migration Dependencies

```
+------------------------------------------------------------------+
|                    DEPENDENCY MATRIX                              |
+------------------------------------------------------------------+

DNAC Installation
    |
    +--> ISE Deployment
    |        |
    |        +--> DNAC-ISE Integration
    |                  |
    |                  +--> Policy Definition
    |                           |
    +--> Underlay Provisioning   |
              |                  |
              +--> Fabric Site Creation <--+
                        |
                        +--> Node Provisioning
                                  |
                                  +--> Host Onboarding
                                           |
                                           +--> User Migration
                                                    |
                                                    +--> Legacy Decommission
```

### 6.1.5 Resource Requirements

| Phase | Network Engineers | Security Engineers | Project Manager | Vendor Support |
|-------|-------------------|-------------------|-----------------|----------------|
| Phase 1 | 4 | 2 | 1 | 2 (Cisco) |
| Phase 2 | 4 | 2 | 1 | 2 (Cisco) |
| Phase 3 | 6 | 3 | 1 | 2 (Cisco) |
| Phase 4 | 8 | 2 | 1 | 1 (Cisco) |
| Phase 5 | 4 | 2 | 1 | 0 |

---

## 6.2 Legacy Decommissioning

### 6.2.1 Hardware Retirement Schedule

| Category | Model | Quantity | Retirement Phase | Disposal |
|----------|-------|----------|------------------|----------|
| Core Switches | Catalyst 6500 | 8 | Phase 3 | E-waste vendor |
| Core Switches | Catalyst 6800 | 10 | Phase 3 | E-waste vendor |
| Distribution | Catalyst 4500 | 24 | Phase 3-4 | E-waste vendor |
| Access Switches | Catalyst 3750 | 120 | Phase 3-4 | Resale/E-waste |
| Access Switches | Catalyst 3850 | 60 | Phase 4 | Resale/E-waste |
| Wireless Controllers | WLC 5520 | 6 | Phase 3-4 | E-waste vendor |
| Wireless Controllers | WLC 8540 | 6 | Phase 3-4 | E-waste vendor |
| Access Points | Various legacy | 400 | Phase 3-4 | E-waste vendor |
| Firewalls | ASA 5500-X | 18 | Phase 5 | Trade-in |

### 6.2.2 Legacy License Termination

| License Type | Current Count | Annual Cost | Termination Date | Savings |
|--------------|---------------|-------------|------------------|---------|
| SmartNet (Cat 6500) | 18 | $X,XXX| End of Phase 3 | $X,XXX/yr |
| SmartNet (Cat 3750) | 120 | $X,XXX| End of Phase 4 | $X,XXX/yr |
| SmartNet (Cat 3850) | 60 | $X,XXX| End of Phase 4 | $X,XXX/yr |
| WLC Support | 12 | $X,XXX| End of Phase 4 | $X,XXX/yr |
| Prime Infrastructure | 1 | $X,XXX| End of Phase 5 | $X,XXX/yr |
| **Total Annual** | | **$X,XXX** | | **$X,XXX** |

### 6.2.3 Data Migration Requirements

| Data Type | Source | Destination | Migration Method |
|-----------|--------|-------------|------------------|
| Device inventory | Spreadsheet/Prime | DNAC | Auto-discovery |
| Network diagrams | Visio | DNAC hierarchy | Manual creation |
| IP address allocation | IPAM | DNAC IP pools | API import |
| VLAN database | Switch configs | VN mapping | Manual mapping |
| ACLs | Switch configs | SGACLs | Policy translation |
| User database | AD/LDAP | ISE (linked) | AD integration |
| MAC addresses | Switch tables | ISE profiling | Auto-profiling |

### 6.2.4 Parallel Operation Period

```
+------------------------------------------------------------------+
|                    PARALLEL OPERATION SCHEDULE                    |
+------------------------------------------------------------------+

        Legacy           |        SD-Access
        Operating        |        Operating
-----------------------||-----------------------
                        ||
  Phase 1-2             ||  Foundation + Pilot
  Full Legacy           ||  Limited SD-Access
  Operation             ||  (Pilot only)
                        ||
-----------------------||-----------------------
                        ||
  Phase 3               ||  Hub Sites Migration
  Legacy (non-migrated) ||  SD-Access (migrated)
  Co-exists             ||  Growing
                        ||
-----------------------||-----------------------
                        ||
  Phase 4               ||  Branch Migration
  Legacy (branches)     ||  SD-Access (hubs)
  Shrinking             ||  Expanding
                        ||
-----------------------||-----------------------
                        ||
  Phase 5               ||  Full SD-Access
  Legacy                ||  Complete
  Decommissioned        ||  Operations
                        ||
+------------------------------------------------------------------+
```

---

## 6.3 License Mapping

### 6.3.1 Cisco DNA Licensing Model

```
+------------------------------------------------------------------+
|                    DNA LICENSE TIERS                              |
+------------------------------------------------------------------+

                    ESSENTIALS  |  ADVANTAGE  |  PREMIER
                    ------------|-------------|------------
Automation              ✓       |      ✓      |     ✓
Basic Monitoring        ✓       |      ✓      |     ✓
Assurance               -       |      ✓      |     ✓
SD-Access               -       |      ✓      |     ✓
Group Policy            -       |      ✓      |     ✓
Security Analytics      -       |      -      |     ✓
Stealthwatch            -       |      -      |     ✓
Encrypted Traffic       -       |      -      |     ✓

SELECTED: DNA ADVANTAGE (Required for SD-Access)
```

### 6.3.2 License Quantity Calculation

**Switching Licenses**

| Device Type | Quantity | License Term | Unit Price | Total |
|-------------|----------|--------------|------------|-------|
| Catalyst 9500-48Y4C | 24 | 5-year DNA-A | $X,XXX| $X,XXX|
| Catalyst 9500-24Y4C | 12 | 5-year DNA-A | $X,XXX| $X,XXX|
| Catalyst 9300-48U | 238 | 5-year DNA-A | $X,XXX| $X,XXX|
| Catalyst 9300-24U | 48 | 5-year DNA-A | $X,XXX| $X,XXX|
| Catalyst 9200-48P | 120 | 5-year DNA-A | $X,XXX| $X,XXX|
| **Subtotal Switching** | | | | **$X,XXX** |

**Wireless Licenses**

| Device Type | Quantity | License Term | Unit Price | Total |
|-------------|----------|--------------|------------|-------|
| Catalyst 9800-40 WLC | 6 | Included | - | - |
| Catalyst 9800-80 WLC | 6 | Included | - | - |
| C9130AXI AP | 350 | 5-year DNA-A | $X,XXX| $X,XXX|
| C9120AXI AP | 240 | 5-year DNA-A | $X,XXX| $X,XXX|
| **Subtotal Wireless** | | | | **$X,XXX** |

**ISE Licenses**

| License Type | Endpoints | Term | Unit Price | Total |
|--------------|-----------|------|------------|-------|
| ISE Base | 19,000 | 5-year | $X,XXX/endpoint | $X,XXX|
| ISE Plus | 19,000 | 5-year | $X,XXX/endpoint | $X,XXX|
| **Subtotal ISE** | | | | **$X,XXX** |

**Total Licensing (5-Year)**: $X,XXX
### 6.3.3 Legacy to DNA License Mapping

| Legacy License | Annual Cost | DNA Equivalent | 5-Year Cost | Savings |
|----------------|-------------|----------------|-------------|---------|
| LAN Base | $X,XXX| DNA Advantage | Included | $X,XXX|
| Prime Infrastructure | $X,XXX| DNAC (appliance) | Included | $X,XXX|
| WLC License | $X,XXX| DNA Wireless | Included | $X,XXX|
| SmartNet (various) | $X,XXX| DNA Support | $X,XXX/yr | $X,XXX|
| **Total 5-Year Legacy** | **$X,XXX** | | **$X,XXX** | **$X,XXX** |

---

## 6.4 Total Cost of Ownership (TCO)

### 6.4.1 Current State Costs (5-Year)

```
+------------------------------------------------------------------+
|                    CURRENT STATE TCO (5-YEAR)                     |
+------------------------------------------------------------------+

CATEGORY                           YEAR 1    YEAR 2-5    5-YR TOTAL
------------------------------------------------------------------
Hardware Maintenance (SmartNet)    $X,XXX  $X,XXX  $X,XXXSoftware Licenses (annual)         $X,XXX $X,XXX $X,XXXPrime Infrastructure               $X,XXX   $X,XXX  $X,XXXOperational Labor (FTE: 6)         $X,XXX $X,XXX $X,XXXPower & Cooling                    $X,XXX   $X,XXX  $X,XXXSecurity Tools (standalone)        $X,XXX  $X,XXX  $X,XXXTraining (annual)                  $X,XXX   $X,XXX  $X,XXXIncident Resolution (avg)          $X,XXX   $X,XXX  $X,XXX------------------------------------------------------------------
TOTAL CURRENT STATE                                     $X,XXX==================================================================
```

### 6.4.2 Target State Costs (5-Year)

```
+------------------------------------------------------------------+
|                    TARGET STATE TCO (5-YEAR)                      |
+------------------------------------------------------------------+

CATEGORY                           YEAR 1    YEAR 2-5    5-YR TOTAL
------------------------------------------------------------------
CAPITAL EXPENDITURE (ONE-TIME)
------------------------------------------------------------------
Hardware - Switches                            -         $X,XXXHardware - Wireless (WLC + APs)                -         $X,XXXHardware - DNAC Appliances                     -         $X,XXXHardware - ISE Appliances                      -         $X,XXXImplementation Services                        -         $X,XXXTraining (initial)                             -         $X,XXX------------------------------------------------------------------
CAPEX SUBTOTAL                                           $X,XXX------------------------------------------------------------------

OPERATING EXPENDITURE (ANNUAL)
------------------------------------------------------------------
DNA Licenses (amortized)          $X,XXX $X,XXX $X,XXXISE Licenses (amortized)          $X,XXX  $X,XXX  $X,XXXSupport Contracts                 $X,XXX  $X,XXX  $X,XXXOperational Labor (FTE: 4)        $X,XXX $X,XXX $X,XXXPower & Cooling                   $X,XXX   $X,XXX  $X,XXXCloud Services (if applicable)    $X,XXX   $X,XXX   $X,XXXTraining (ongoing)                $X,XXX   $X,XXX   $X,XXXIncident Resolution (reduced)     $X,XXX   $X,XXX  $X,XXX------------------------------------------------------------------
OPEX SUBTOTAL (5-YEAR)                                  $X,XXX------------------------------------------------------------------

TOTAL TARGET STATE (5-YEAR)                            $X,XXX==================================================================
```

### 6.4.3 TCO Comparison Summary

```
+------------------------------------------------------------------+
|                    TCO COMPARISON (5-YEAR)                        |
+------------------------------------------------------------------+

                                CURRENT         TARGET       DELTA
------------------------------------------------------------------
Hardware (CapEx)                    $X,XXX     $X,XXX +$X,XXXImplementation                      $X,XXX       $X,XXX   +$X,XXXLicenses                    $X,XXX     $X,XXX   +$X,XXXSupport/Maintenance           $X,XXX       $X,XXX   -$X,XXXOperations (Labor)          $X,XXX     $X,XXX -$X,XXXPower & Cooling               $X,XXX       $X,XXX    +$X,XXXSecurity Tools                $X,XXX             $X,XXX   -$X,XXXTraining                      $X,XXX       $X,XXX    +$X,XXXIncidents                     $X,XXX       $X,XXX   -$X,XXXCloud Services                     $X,XXX        $X,XXX   +$X,XXX------------------------------------------------------------------
5-YEAR TOTAL                $X,XXX    $X,XXX +$X,XXX------------------------------------------------------------------

YEAR-OVER-YEAR COMPARISON:
Year 1: +$X,XXX(CapEx heavy)
Year 2: -$X,XXXYear 3: -$X,XXXYear 4: -$X,XXXYear 5: -$X,XXX------------------------------------------------------------------
NET 5-YEAR: +$X,XXX(higher initial investment)
==================================================================
```

### 6.4.4 Extended TCO (10-Year Projection)

```
+------------------------------------------------------------------+
|                    EXTENDED TCO (10-YEAR)                         |
+------------------------------------------------------------------+

CURRENT STATE (10-Year):
  Years 1-5:    $X,XXX  Years 6-10:   $X,XXX(no hardware refresh factored)
  Potential hardware refresh (Year 6-7): +$X,XXX  TOTAL:        $X,XXX
TARGET STATE (10-Year):
  Years 1-5:    $X,XXX  Years 6-10:   $X,XXX(OpEx only, CapEx complete)
  License renewal (Year 6): +$X,XXX  TOTAL:        $X,XXX
10-YEAR NET DIFFERENCE: +$X,XXX(2.5% higher)

BREAK-EVEN ANALYSIS:
  - Initial investment recovery: Year 7.3
  - Considering productivity gains: Year 4.8
  - Considering risk reduction: Year 3.9
==================================================================
```

---

## 6.5 ROI Analysis

### 6.5.1 Quantifiable Benefits

| Benefit Category | Annual Value | 5-Year Value | Calculation Basis |
|------------------|--------------|--------------|-------------------|
| **Operational Efficiency** ||||
| Reduced FTE (2 positions) | $X,XXX| $X,XXX| 2 × $X,XXX fully loaded |
| Automation savings | $X,XXX| $X,XXX| 1,500 hours × $X,XXX/hr |
| Faster troubleshooting | $X,XXX| $X,XXX| 50% MTTR reduction |
| **Security Improvements** ||||
| Breach prevention | $X,XXX| $X,XXX| Industry breach cost avg |
| Compliance automation | $X,XXX| $X,XXX| Audit preparation savings |
| Reduced security tools | $X,XXX| $X,XXX| Consolidated tooling |
| **Business Enablement** ||||
| Faster onboarding | $X,XXX| $X,XXX| 75% reduction × volume |
| Reduced downtime | $X,XXX| $X,XXX| 99.99% vs 99.9% SLA |
| **Total Annual Benefits** | **$X,XXX** | **$X,XXX** | |

### 6.5.2 ROI Calculation

```
+------------------------------------------------------------------+
|                    ROI CALCULATION                                |
+------------------------------------------------------------------+

INVESTMENT (Total CapEx + Year 1 OpEx):
  Hardware:                    $X,XXX  Implementation:                $X,XXX  Year 1 Licenses:              $X,XXX  Year 1 Operations:            $X,XXX  ------------------------------------------
  TOTAL INVESTMENT:           $X,XXX
ANNUAL NET BENEFIT (Year 2 onwards):
  Quantified Benefits:        $X,XXX  Legacy Cost Avoidance:        $X,XXX  ------------------------------------------
  NET ANNUAL BENEFIT:         $X,XXX
ROI FORMULA:
  ROI = (Net Benefits - Investment) / Investment × 100

  5-Year ROI:
  Net Benefits (Years 2-5):   $X,XXX  Total Investment:           $X,XXX  ------------------------------------------
  5-Year ROI:                     -0.3%

  7-Year ROI:
  Net Benefits (Years 2-7):   $X,XXX  Total Investment:           $X,XXX  ------------------------------------------
  7-Year ROI:                    +49.5%

  10-Year ROI:
  Net Benefits (Years 2-10): $X,XXX  Total Investment:           $X,XXX  ------------------------------------------
  10-Year ROI:                  +124.3%
==================================================================
```

### 6.5.3 Payback Period Analysis

```
+------------------------------------------------------------------+
|                    PAYBACK PERIOD ANALYSIS                        |
+------------------------------------------------------------------+

CUMULATIVE CASH FLOW:
                              Investment    Benefits    Cumulative
------------------------------------------------------------------
Year 0 (Implementation)      -$X,XXX         $X,XXX  -$X,XXXYear 1 (First year ops)      -$X,XXX   $X,XXX  -$X,XXXYear 2                               $X,XXX  $X,XXX  -$X,XXXYear 3                               $X,XXX  $X,XXX  -$X,XXXYear 4                               $X,XXX  $X,XXX  -$X,XXXYear 5                               $X,XXX  $X,XXX    +$X,XXXYear 6 (License renewal)     -$X,XXX $X,XXX    -$X,XXXYear 7                               $X,XXX  $X,XXX  +$X,XXX------------------------------------------------------------------

PAYBACK PERIOD: 4.7 years (simple payback)
DISCOUNTED PAYBACK (8% rate): 5.8 years
==================================================================
```

### 6.5.4 Non-Quantifiable Benefits

| Benefit | Impact | Strategic Value |
|---------|--------|-----------------|
| Zero Trust architecture | Improved security posture | Critical for compliance |
| Micro-segmentation | Reduced lateral movement | Industry best practice |
| Intent-based networking | Simplified operations | Future-proof architecture |
| AI/ML-driven assurance | Proactive issue detection | Reduced business impact |
| Consistent policy | Unified security model | Reduced complexity |
| Automated compliance | Continuous validation | Audit readiness |
| Scalability | Support for growth | Business enablement |
| Agility | Faster changes | Competitive advantage |

### 6.5.5 WAN Cost Savings (SD-WAN Migration)

**Note**: The SD-WAN migration runs in parallel with SD-Access. WAN savings are realized from replacing expensive MPLS circuits with Internet + 5G/LTE at branch sites.

**Current WAN Costs (Monthly)**

| Site Type | Sites | Circuit Type | Avg Cost/Site | Total Monthly |
|-----------|-------|--------------|---------------|---------------|
| Hub Sites | 6 | MPLS 500M-1G | $X,XXX| $X,XXX|
| Hub Sites (backup) | 6 | Internet 500M | $X,XXX| $X,XXX|
| Large Branches | 3 | MPLS 150-200M | $X,XXX| $X,XXX|
| Medium Branches | 10 | MPLS 100M | $X,XXX| $X,XXX|
| Small Branches | 20 | MPLS 50M | $X,XXX| $X,XXX|
| EMEA Branches | 12 | MPLS 50-200M | $X,XXX| $X,XXX|
| **Total Current WAN** | | | | **$X,XXX/month** |

**Target WAN Costs (Monthly) - Post SD-WAN Migration**

| Site Type | Sites | Primary | Secondary | Avg Cost/Site | Total Monthly |
|-----------|-------|---------|-----------|---------------|---------------|
| Hub Sites | 6 | MPLS 500M-1G | Internet 500M | $X,XXX| $X,XXX|
| Large Branches | 3 | Internet 200M | 5G 100M | $X,XXX| $X,XXX|
| Medium Branches | 10 | Internet 100M | LTE 50M | $X,XXX| $X,XXX|
| Small Branches | 20 | Internet 50M | LTE 30M | $X,XXX| $X,XXX|
| EMEA Branches | 12 | Internet 50-100M | LTE 30M | $X,XXX| $X,XXX|
| **Total Target WAN** | | | | | **$X,XXX/month** |

**WAN Cost Savings Summary**

```
+------------------------------------------------------------------+
|                    WAN COST SAVINGS ANALYSIS                      |
+------------------------------------------------------------------+

MONTHLY SAVINGS:
  Current WAN spend:         $X,XXX  Target WAN spend:          $X,XXX  ----------------------------------------
  MONTHLY SAVINGS:            $X,XXX
ANNUAL SAVINGS:              $X,XXX
5-YEAR WAN SAVINGS:          $X,XXX
MPLS CIRCUIT TERMINATION COSTS (One-Time):
  Early termination fees:     $X,XXX  (Contracts ending Dec 2026, minimal ETF)

NET 5-YEAR WAN SAVINGS:      $X,XXX==================================================================
```

**WAN Savings Impact on ROI**

| Metric | Without WAN Savings | With WAN Savings |
|--------|---------------------|------------------|
| Annual Net Benefit | $X,XXX| $X,XXX|
| 5-Year Payback | 4.7 years | 2.8 years |
| 5-Year ROI | -0.3% | +113% |
| 10-Year ROI | +124% | +340% |

**Note**: WAN savings are contingent on successful SD-WAN migration running in parallel with SD-Access deployment. SD-WAN investment costs are covered in the separate SD-WAN project documentation.

---

## 6.6 Budget Planning

### 6.6.1 Capital Expenditure (CapEx) Breakdown

```
+------------------------------------------------------------------+
|                    CAPEX BREAKDOWN BY CATEGORY                    |
+------------------------------------------------------------------+

HARDWARE - SWITCHING                                      $X,XXX+----------------------------------------------------------------+
| Category              | Model          | Qty  | Unit     | Total|
|----------------------|----------------|------|----------|------|
| Border Nodes         | C9500-48Y4C    | 12   | $X,XXX | $X,XXX|
| Control Plane        | C9500-24Y4C    | 12   | $X,XXX | $X,XXX|
| Edge (Hub)           | C9300-48U      | 238  | $X,XXX  | $X,XXX|
| Edge (Branch)        | C9300-24U      | 48   | $X,XXX  | $X,XXX|
| Extended Nodes       | C9200-48P      | 120  | $X,XXX  | $X,XXX|
| Optics/Cables        | Various        | -    | -        | $X,XXX|
+----------------------------------------------------------------+

HARDWARE - WIRELESS                                       $X,XXX+----------------------------------------------------------------+
| Category              | Model          | Qty  | Unit     | Total|
|----------------------|----------------|------|----------|------|
| WLC (Large Sites)    | C9800-80       | 6    | $X,XXX | $X,XXX|
| WLC (Medium Sites)   | C9800-40       | 6    | $X,XXX | $X,XXX|
| APs (High Density)   | C9130AXI       | 350  | $X,XXX    | $X,XXX|
| APs (Standard)       | C9120AXI       | 240  | $X,XXX    | $X,XXX|
| AP Mounts/Cables     | Various        | -    | -        | $X,XXX |
+----------------------------------------------------------------+

HARDWARE - MANAGEMENT                                       $X,XXX+----------------------------------------------------------------+
| Category              | Model          | Qty  | Unit     | Total|
|----------------------|----------------|------|----------|------|
| DNAC (Primary)       | DN2-HW-APL-XL  | 3    | $X,XXX | $X,XXX|
| DNAC (DR)            | DN2-HW-APL-XL  | 3    | $X,XXX | $X,XXX|
| ISE PAN              | SNS-3695-K9    | 2    | $X,XXX | $X,XXX |
| ISE PSN              | SNS-3655-K9    | 12   | $X,XXX  | $X,XXX |
+----------------------------------------------------------------+

IMPLEMENTATION SERVICES                                     $X,XXX+----------------------------------------------------------------+
| Service               | Duration       | Rate      | Total      |
|----------------------|----------------|-----------|------------|
| Cisco Professional   | 800 hours      | $X,XXX/hr   | $X,XXX  |
| Integration Partner  | 500 hours      | $X,XXX/hr   | $X,XXX  |
| Internal PM          | 10 months      | $X,XXX/mo| $X,XXX  |
| Travel & Logistics   | -              | -         | $X,XXX   |
+----------------------------------------------------------------+

TRAINING                                                     $X,XXX+----------------------------------------------------------------+
| Course                | Attendees | Cost/Person  | Total       |
|----------------------|-----------|--------------|-------------|
| DNAC Administrator   | 6         | $X,XXX      | $X,XXX    |
| ISE Administrator    | 4         | $X,XXX      | $X,XXX    |
| SD-Access Design     | 4         | $X,XXX      | $X,XXX    |
| Cisco DESDG          | 4         | $X,XXX      | $X,XXX    |
+----------------------------------------------------------------+

TOTAL CAPEX:                                              $X,XXX==================================================================
```

### 6.6.2 Operating Expenditure (OpEx) - Annual

```
+------------------------------------------------------------------+
|                    ANNUAL OPEX BREAKDOWN                          |
+------------------------------------------------------------------+

LICENSES (Amortized Annual)                                 $X,XXX+----------------------------------------------------------------+
| License Type          | 5-Year Total  | Annual     |
|----------------------|---------------|------------|
| DNA Advantage (Switch)| $X,XXX     | $X,XXX  |
| DNA Advantage (Wireless)| $X,XXX   | $X,XXX   |
| ISE Base + Plus       | $X,XXX     | $X,XXX  |
| DNA Center License    | Included      | $X,XXX        |
+----------------------------------------------------------------+

SUPPORT CONTRACTS                                           $X,XXX+----------------------------------------------------------------+
| Contract Type         | Coverage      | Annual Cost|
|----------------------|---------------|------------|
| DNA Support (Solution)| 8×5×NBD       | $X,XXX   |
| ISE Support          | 24×7×4hr      | $X,XXX   |
| DNAC Appliance       | 24×7×4hr      | $X,XXX   |
+----------------------------------------------------------------+

OPERATIONAL LABOR                                           $X,XXX+----------------------------------------------------------------+
| Role                  | FTE Count | Loaded Cost  | Total      |
|----------------------|-----------|--------------|------------|
| Network Engineer     | 2.5       | $X,XXX    | $X,XXX  |
| Security Analyst     | 1.0       | $X,XXX    | $X,XXX  |
| NOC Allocation       | 0.25      | $X,XXX    | $X,XXX   |
+----------------------------------------------------------------+

CLOUD SERVICES                                               $X,XXX+----------------------------------------------------------------+
| Service               | Type          | Annual Cost|
|----------------------|---------------|------------|
| Cisco Cloud (optional)| ThousandEyes  | $X,XXX   |
+----------------------------------------------------------------+

TRAINING (Ongoing)                                           $X,XXX+----------------------------------------------------------------+
| Type                  | Frequency     | Annual Cost|
|----------------------|---------------|------------|
| Skills refresh       | Annual        | $X,XXX   |
| Certification        | Ongoing       | $X,XXX    |
+----------------------------------------------------------------+

MISCELLANEOUS                                                $X,XXX+----------------------------------------------------------------+
| Item                  | Description   | Annual Cost|
|----------------------|---------------|------------|
| Power & Cooling delta | Incremental   | $X,XXX    |
| Incident resolution  | Reduced       | $X,XXX   |
+----------------------------------------------------------------+

TOTAL ANNUAL OPEX:                                        $X,XXX==================================================================
```

### 6.6.3 Budget by Fiscal Year

| Fiscal Year | CapEx | OpEx | Total | Cumulative |
|-------------|-------|------|-------|------------|
| FY1 Q1-Q2 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|
| FY1 Q3-Q4 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|
| FY2 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|
| FY3 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|
| FY4 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|
| FY5 | $X,XXX| $X,XXX| $X,XXX| $X,XXX|

### 6.6.4 Budget Approval Thresholds

| Amount | Approval Level | Documentation Required |
|--------|----------------|------------------------|
| <$X,XXX| IT Director | Quote, business justification |
| $X,XXX- $X,XXX| VP of IT | Business case, TCO |
| $X,XXX- $X,XXX| CIO | Full business case, ROI |
| >$X,XXX| CFO + Board | Executive summary, multi-year plan |

---

## 6.7 Vendor Comparison

### 6.7.1 Alternative Solutions Evaluated

| Vendor | Solution | Evaluation Status |
|--------|----------|-------------------|
| Cisco | DNA Center + ISE + SD-Access | **SELECTED** |
| Aruba | ClearPass + Central + CX Fabric | Evaluated |
| Juniper | Mist + NAC + Campus Fabric | Evaluated |
| Extreme | ExtremeCloud + Control + Fabric | Not evaluated |

### 6.7.2 Comparison Matrix

| Criteria | Weight | Cisco | Aruba | Juniper |
|----------|--------|-------|-------|---------|
| SD-Access Maturity | 20% | 9/10 | 7/10 | 6/10 |
| Policy Engine | 15% | 9/10 | 8/10 | 7/10 |
| Automation Capability | 15% | 9/10 | 8/10 | 8/10 |
| AI/ML Analytics | 10% | 8/10 | 9/10 | 9/10 |
| Integration (existing) | 15% | 10/10 | 6/10 | 5/10 |
| TCO (5-year) | 15% | 7/10 | 8/10 | 8/10 |
| Vendor Support | 10% | 8/10 | 7/10 | 7/10 |
| **Weighted Score** | 100% | **8.5** | 7.5 | 7.0 |

### 6.7.3 Selection Rationale

**Cisco DNA Center + ISE Selected Because**:

1. **Existing Investment**: Leverages current Cisco infrastructure (60% of devices)
2. **SD-Access Maturity**: Most mature fabric solution in market
3. **ISE Leadership**: Industry-leading policy engine, TrustSec/SGT support
4. **Integration**: Native integration with existing WAN, firewalls
5. **Skill Availability**: Existing team has Cisco certifications
6. **CVD Documentation**: Comprehensive validated designs available
7. **TAC Support**: Global support organization with SD-Access expertise

**Trade-offs Accepted**:
- Higher licensing cost vs. alternatives
- Proprietary technology lock-in
- Complex initial deployment

---

## 6.8 Risk-Adjusted Projections

### 6.8.1 Sensitivity Analysis

```
+------------------------------------------------------------------+
|                    SENSITIVITY ANALYSIS                           |
+------------------------------------------------------------------+

BASE CASE ASSUMPTIONS:
- Implementation timeline: 40 weeks
- Benefit realization: 100% by Year 2
- No scope changes
- No additional hardware required

SCENARIO ANALYSIS:
                        Pessimistic   Base Case   Optimistic
------------------------------------------------------------------
Timeline Extension      +25% (50 wks) 40 weeks    -10% (36 wks)
Benefit Realization     75%           100%        110%
Hardware Contingency    +15%          0%          -5%
Labor Cost Variance     +20%          0%          -10%

5-YEAR NPV IMPACT:
                        Pessimistic   Base Case   Optimistic
------------------------------------------------------------------
Timeline Only           -$X,XXX    $X,XXX         +$X,XXXenefits Only           -$X,XXX  $X,XXX         +$X,XXXHardware Only           -$X,XXX    $X,XXX         +$X,XXXLabor Only              -$X,XXX    $X,XXX         +$X,XXXCombined                -$X,XXX  $X,XXX         +$X,XXX
RISK-ADJUSTED NPV RANGE:
Best Case:              +$X,XXXExpected (Base):        $X,XXXWorst Case:             -$X,XXX==================================================================
```

### 6.8.2 Risk Contingency Budget

| Risk Category | Probability | Impact | Contingency |
|---------------|-------------|--------|-------------|
| Schedule delay | 30% | $X,XXX| $X,XXX|
| Hardware issues | 20% | $X,XXX| $X,XXX|
| Integration complexity | 25% | $X,XXX| $X,XXX|
| Resource availability | 15% | $X,XXX| $X,XXX|
| Scope creep | 20% | $X,XXX| $X,XXX|
| **Total Contingency** | | | **$X,XXX** |

**Recommended Contingency Reserve**: $X,XXX(7.5% of CapEx)

---

## 6.9 Business Case Summary

### 6.9.1 Executive Summary

```
+------------------------------------------------------------------+
|                    EXECUTIVE BUSINESS CASE                        |
+------------------------------------------------------------------+

PROJECT: Traditional Network to SD-Access Migration

STRATEGIC ALIGNMENT:
✓ Zero Trust security transformation
✓ Digital workplace enablement
✓ Operational efficiency improvement
✓ Compliance automation

INVESTMENT SUMMARY:
  Total CapEx:           $X,XXX  Annual OpEx:           $X,XXX  5-Year TCO:           $X,XXX  
FINANCIAL METRICS:
  5-Year ROI:                  -0.3% (investment phase)
  7-Year ROI:                 +49.5%
  10-Year ROI:               +124.3%
  Payback Period:             4.7 years
  
RISK ASSESSMENT:
  Overall Risk Level:         MEDIUM
  Risk Mitigation:            $X,XXXcontingency
  
RECOMMENDATION:
  PROCEED with phased implementation
  
APPROVAL REQUIRED:
  CIO + CFO approval for CapEx > $X,XXX
  
KEY SUCCESS FACTORS:
  1. Executive sponsorship
  2. Skilled implementation team
  3. Change management program
  4. Phased rollout with validation gates
==================================================================
```

### 6.9.2 Investment Justification

| Factor | Justification |
|--------|---------------|
| **Strategic** | Enables Zero Trust architecture required by board security mandate |
| **Operational** | Reduces network operations headcount by 2 FTE through automation |
| **Security** | Micro-segmentation reduces breach impact by 80% (industry data) |
| **Compliance** | Automated compliance reporting saves 200+ hours annually |
| **Agility** | New site deployment reduced from 4 weeks to 4 days |
| **Risk** | End of life hardware (Cat 6500) creates operational risk |

### 6.9.3 Approval Signatures

```
+------------------------------------------------------------------+
|                    BUSINESS CASE APPROVAL                         |
+------------------------------------------------------------------+

Project: SD-Access Migration
Total Investment: $X,XXX(CapEx) + $X,XXX(5-yr OpEx)

APPROVALS:

IT Director: _________________________ Date: __________
             [Print Name]

VP of IT:    _________________________ Date: __________
             [Print Name]

CIO:         _________________________ Date: __________
             [Print Name]

CFO:         _________________________ Date: __________
             [Print Name]

COMMENTS:
______________________________________________________________
______________________________________________________________
______________________________________________________________

+------------------------------------------------------------------+
```

---

## Summary

Chapter 6 provides comprehensive financial analysis for the SD-Access migration:

1. **Migration Strategy**: 40-week phased hybrid approach with defined sequence
2. **Legacy Decommissioning**: Hardware retirement schedule and license termination
3. **License Mapping**: DNA Advantage licensing model with 5-year costs
4. **TCO Analysis**: 5-year comparison showing $X,XXX higher investment
5. **ROI Analysis**: 4.7-year payback, 124% ROI over 10 years
6. **Budget Planning**: Detailed CapEx/OpEx breakdown by category
7. **Vendor Comparison**: Cisco selected with 8.5/10 weighted score
8. **Risk Analysis**: $X,XXX contingency recommended
9. **Business Case**: Executive summary for approval

**Key Financial Metrics**:
- Total 5-Year Investment: $X,XXX
- Annual Operational Savings: $X,XXX (from Year 2)
- Payback Period: 4.7 years
- 10-Year ROI: 124%

**Next Chapter**: Chapter 7 covers Advanced Features and AI/ML capabilities.

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
