# 6.10 Hardware Refresh Strategy

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Hardware Lifecycle Overview

### 1.1 Current Inventory EoL Status

| Hardware Category | Model | Qty | EoS Date | EoL Date | Status |
|-------------------|-------|-----|----------|----------|--------|
| **Border Nodes** | C9500-48Y4C | 12 | TBD | TBD | ✅ Current |
| **Control Plane** | C9500-24Y4C | 12 | TBD | TBD | ✅ Current |
| **Edge (mGig)** | C9300-48UXM | 200 | TBD | TBD | ✅ Current |
| **Edge (Standard)** | C9300-48U | 100 | TBD | TBD | ✅ Current |
| **WLC** | C9800-40 | 10 | Feb 2025 | Feb 2030 | ⚠️ EoS Soon |
| **WLC Large** | C9800-80 | 2 | Feb 2025 | Feb 2030 | ⚠️ EoS Soon |
| **Wi-Fi 6 APs** | C9130AXI | 235 | TBD | TBD | ✅ Current |
| **Wi-Fi 6E APs** | C9136I | 470 | TBD | TBD | ✅ Current |
| **Wi-Fi 7 APs** | CW9176I | 235 | TBD | TBD | ✅ Current |
| **ISE** | SNS-3755-K9 | 4 | TBD | TBD | ✅ Current |
| **ISE PSN** | SNS-3715-K9 | 12 | TBD | TBD | ✅ Current |
| **Catalyst Center** | DN2-HW-APL-XL | 6 | TBD | TBD | ✅ Current |

### 1.2 EoL Definitions

```
End of Sale (EoS): No longer available for purchase
End of Software Maintenance (EoSM): No new software releases
End of Vulnerability Support (EoVS): No security patches
End of Life (EoL): No support whatsoever

Timeline:
  EoS ──► EoSM (typically +3 years) ──► EoVS (+1 year) ──► EoL (+1 year)
```

---

## 2. 5-Year Refresh Roadmap

### 2.1 Refresh Timeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                5-Year Hardware Refresh Roadmap                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ Year 1 (2026): Initial Deployment                                   │
│ ├── All new hardware deployed                                       │
│ ├── SmartNet contracts active                                       │
│ └── Baseline established                                            │
│                                                                     │
│ Year 2 (2027): WLC Refresh                                          │
│ ├── C9800-40/80 reaching EoS                                        │
│ ├── Evaluate C9800-L or next-gen WLC                                │
│ ├── Budget: $X,XXX                                               │
│ └── Timeline: Q2 2027                                               │
│                                                                     │
│ Year 3 (2028): Branch Optimization                                  │
│ ├── Evaluate branch switch refresh needs                            │
│ ├── Consider Meraki for small branches (if applicable)              │
│ ├── Wi-Fi 6 AP refresh to Wi-Fi 7 (oldest locations)                │
│ ├── Budget: $X,XXX                                               │
│ └── Timeline: Q3-Q4 2028                                            │
│                                                                     │
│ Year 4 (2029): AP Technology Refresh                                │
│ ├── Wi-Fi 6 APs (C9130) reach 4+ years                              │
│ ├── Replace with Wi-Fi 7/8 APs                                      │
│ ├── Evaluate 6 GHz only deployments                                 │
│ ├── Budget: $X,XXX                                               │
│ └── Timeline: Q2-Q4 2029                                            │
│                                                                     │
│ Year 5 (2030): Major Platform Review                                │
│ ├── Full architecture review                                        │
│ ├── Catalyst Center appliance refresh                               │
│ ├── ISE appliance capacity review                                   │
│ ├── Switch platform evaluation                                      │
│ ├── Budget: $X,XXX+                                               │
│ └── Timeline: Full year planning                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Annual Refresh Budget

| Year | Category | Budget | Notes |
|------|----------|--------|-------|
| Year 1 | Initial CapEx | $X,XXX| Full deployment |
| Year 2 | WLC Refresh | $X,XXX| 12 WLC replacement |
| Year 3 | Branch Optimization | $X,XXX| Selective upgrades |
| Year 4 | AP Refresh | $X,XXX| 235 APs (Wi-Fi 6→7) |
| Year 5 | Major Platform | $X,XXX| Full review |
| **5-Year Total** | | **$X,XXX** | |

---

## 3. Component-Specific Refresh Plans

### 3.1 Wireless LAN Controller Refresh (Year 2)

```yaml
WLC_Refresh_Plan:
  
  Current_State:
    Model: C9800-40 (10 units), C9800-80 (2 units)
    EoS: February 2025
    EoL: February 2030
    Support: SmartNet until 2030
    
  Risk_Assessment:
    - EoS means no new purchases
    - Still supported until 2030
    - No new features after EoSM
    - Security patches until EoVS
    
  Recommendation:
    Option_A: Refresh in Year 2 (2027)
      - Replace with successor model
      - Take advantage of new features
      - Stay ahead of EoSM
      Cost: ~$X,XXX      
    Option_B: Run until Year 4 (2029)
      - Maximize investment
      - Risk: No new features, fewer spare parts
      - Must refresh before EoL (2030)
      Cost: Deferred
      
  Decision: Option A (Proactive refresh Year 2)
  
  Migration_Plan:
    Q1_2027:
      - Evaluate successor models
      - Lab testing
      - Budget approval
    Q2_2027:
      - Purchase new WLCs
      - Staging and configuration
    Q3_2027:
      - Rolling replacement (site by site)
      - Old WLCs as spares
    Q4_2027:
      - Complete migration
      - Decommission old WLCs
```

### 3.2 Access Point Refresh (Year 4)

```yaml
AP_Refresh_Plan:
  
  Current_State:
    Wi-Fi 6 (C9130AXI): 235 APs - Deployed 2026
    Wi-Fi 6E (C9136I): 470 APs - Deployed 2026
    Wi-Fi 7 (CW9176I): 235 APs - Deployed 2026
    
  Refresh_Strategy:
    Year_4_Refresh (2029):
      Target: Wi-Fi 6 APs (oldest technology)
      Replace_With: Wi-Fi 7/8 APs (whatever is current)
      Quantity: 235 APs
      Budget: $X,XXX(~$X,XXX/AP with licenses)
      
    Year_6_Refresh (2031):
      Target: Wi-Fi 6E APs
      Replace_With: Current technology
      Quantity: 470 APs
      Budget: ~$X,XXX(future estimate)
      
  Technology_Considerations:
    - Wi-Fi 7 (802.11be) widespread by 2029
    - 6 GHz spectrum fully utilized
    - Consider Wi-Fi 8 (802.11bn) if available
    - MLO (Multi-Link Operation) standard
```

### 3.3 Catalyst Center Appliance Refresh (Year 5)

```yaml
Catalyst_Center_Refresh:
  
  Current_State:
    Model: DN2-HW-APL-XL
    Quantity: 6 (3 primary + 3 DR)
    Deployment: 2026
    Expected_Life: 5-7 years
    
  Year_5_Review:
    Evaluate:
      - [ ] Performance metrics (CPU, memory, storage)
      - [ ] Capacity vs. growth projections
      - [ ] New appliance capabilities
      - [ ] Cloud-managed options
      
    Options:
      Option_A: Hardware refresh
        - New appliances
        - On-premises continues
        - Cost: ~$X,XXX        
      Option_B: Cloud migration
        - Cisco managed cloud
        - Reduced on-prem hardware
        - Cost: OpEx model
        
      Option_C: Extend existing
        - If capacity sufficient
        - Continue SmartNet
        - Minimal cost
```

---

## 4. SmartNet and Support Planning

### 4.1 SmartNet Contract Summary

| Category | Coverage | Expiry | Annual Cost | Renewal Strategy |
|----------|----------|--------|-------------|------------------|
| Switching | 24x7x4 | 2031 | $X,XXX| 5-year prepaid |
| Wireless | 24x7xNBD | 2031 | $X,XXX| 5-year prepaid |
| ISE/Catalyst Center | 24x7x4 | 2031 | $X,XXX| 5-year prepaid |
| **Total Annual** | | | **$X,XXX** | |

### 4.2 Support Renewal Timeline

```yaml
Support_Renewal_Schedule:
  
  Year_3 (2028):
    Action: Evaluate renewal options
    Tasks:
      - Review support utilization
      - Assess hardware health
      - Get renewal quotes
      - Negotiate multi-year discount
      
  Year_4 (2029):
    Action: Execute renewal
    Tasks:
      - Renew SmartNet (3-5 year term)
      - Update coverage levels if needed
      - Align with refresh plans
      - Budget for refresh items
      
  Negotiation_Tips:
    - Bundle with new purchases
    - Multi-year commits (3-5 years)
    - Volume discounts
    - Include refreshed hardware
```

---

## 5. License Management

### 5.1 DNA License Renewal

```yaml
DNA_License_Management:
  
  Current_Licenses:
    Term: 5-year subscription
    Start: 2026
    Expiry: 2031
    Tier: DNA Advantage
    
  Devices_Licensed:
    Switches: 350 units
    Wireless Controllers: 14 units
    Access Points: 940 units
    
  Year_5_Renewal (2031):
    Action: Renew DNA licenses
    Considerations:
      - Device count may have grown
      - New devices need licenses
      - Evaluate Essentials vs. Advantage
      - Consider perpetual vs. subscription
      
    Budget_Planning:
      Current_Annual_Equivalent: ~$X,XXX      Growth_Factor: 10% per year
      Year_5_Estimate: ~$X,XXX```

### 5.2 ISE License Planning

```yaml
ISE_License_Management:
  
  Current_Licenses:
    Base: 25,000 endpoints (perpetual)
    Plus: 25,000 endpoints (perpetual)
    Apex: 10,000 endpoints (perpetual)
    Device Admin: 400 devices (perpetual)
    
  Growth_Planning:
    Current_Usage: 25,000 endpoints
    Year_5_Projected: 37,000 endpoints
    Gap: 12,000 endpoint licenses
    
  License_True-Up_Schedule:
    Year_2: Review usage, order if >90% utilized
    Year_3: True-up purchase if needed
    Year_5: Major review with refresh
    
  Budget:
    ISE_Base_per_endpoint: ~$X,XXX(list)
    ISE_Plus_per_endpoint: ~$X,XXX(list)
    Additional_12K_endpoints: ~$X,XXX```

---

## 6. Spare Parts Strategy

### 6.1 Recommended Spares Inventory

| Component | Model | Quantity | Location | Purpose |
|-----------|-------|----------|----------|---------|
| Edge Switch | C9300-48UXM | 4 | Mumbai (2), NJ (2) | Hot spare |
| Border Module | C9500-NM-8X | 2 | Mumbai, London | Uplink spare |
| Power Supply | PWR-C1-1100WAC | 6 | Regional | Switch PS spare |
| WLC | C9800-40 | 1 | Mumbai | HA spare |
| AP | C9136I | 20 | Regional (5 each) | Replacement |
| ISE | SNS-3715-K9 | 1 | NJ | PSN spare |

### 6.2 Spares Budget

| Year | Spares Investment | Notes |
|------|-------------------|-------|
| Year 1 | $X,XXX| Initial spares pool |
| Year 2 | $X,XXX| Replenishment |
| Year 3 | $X,XXX| Add WLC spares |
| Year 4 | $X,XXX| Replenishment |
| Year 5 | $X,XXX| Pre-refresh buffer |
| **Total** | **$X,XXX** | 5-year spares |

---

## 7. Technology Watch

### 7.1 Emerging Technologies to Monitor

| Technology | Timeline | Impact | Action |
|------------|----------|--------|--------|
| Wi-Fi 8 (802.11bn) | 2028-2030 | Next-gen wireless | Monitor standards |
| 400G Switching | 2026-2028 | Data center | Evaluate for DC |
| AI-Native Networking | Ongoing | Operations | Early adoption |
| Private 5G | 2027+ | IoT/OT coverage | Pilot potential |
| SASE Maturity | Ongoing | Remote access | Continued integration |

### 7.2 Annual Technology Review Checklist

```yaml
Annual_Tech_Review:
  
  Q1_Activities:
    - [ ] Review Cisco product roadmaps
    - [ ] Attend Cisco Live sessions
    - [ ] Evaluate new features in current products
    - [ ] Assess competitor offerings
    
  Q2_Activities:
    - [ ] Lab test new features
    - [ ] Pilot promising technologies
    - [ ] Update 3-year roadmap
    
  Q3_Activities:
    - [ ] Budget planning for next year
    - [ ] Refresh recommendations to leadership
    - [ ] Training needs assessment
    
  Q4_Activities:
    - [ ] Finalize budget
    - [ ] Initiate procurement for approved items
    - [ ] Update documentation
```

---

## 8. Summary: 5-Year Financial Plan

| Year | CapEx | OpEx (Support) | Total |
|------|-------|----------------|-------|
| Year 1 | $X,XXX| $X,XXX| $X,XXX|
| Year 2 | $X,XXX| $X,XXX| $X,XXX|
| Year 3 | $X,XXX| $X,XXX| $X,XXX|
| Year 4 | $X,XXX| $X,XXX| $X,XXX|
| Year 5 | $X,XXX| $X,XXX* | $X,XXX|
| **Total** | **$X,XXX** | **$X,XXX** | **$X,XXX** |

*Year 5 includes license renewals

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
