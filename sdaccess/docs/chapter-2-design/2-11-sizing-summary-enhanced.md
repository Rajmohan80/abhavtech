# 2.11 Comprehensive Sizing Summary

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Executive Sizing Summary

### 1.1 Global Infrastructure Overview

| Component | Quantity | Model | Purpose |
|-----------|----------|-------|---------|
| Catalyst Center Cluster | 6 nodes | DN2-HW-APL-XL | 3 Primary + 3 DR |
| ISE PAN/MnT | 4 nodes | SNS-3755-K9 | 2 Primary + 2 Secondary |
| ISE PSN | 12 nodes | SNS-3715-K9 | Distributed authentication |
| Fabric Sites | 9 sites | - | Global coverage |
| Total Endpoints | ~25,000 | - | Wired + Wireless |
| Total Access Points | 940 | Wi-Fi 6/6E/7 | Campus wireless |

---

## 2. Site-by-Site Hardware Sizing

### 2.1 Campus Sites (Full Fabric)

| Site | Users | Endpoints | Border | Control Plane | Edge | WLC | APs | ISE PSN |
|------|-------|-----------|--------|---------------|------|-----|-----|---------|
| **Mumbai** | 2,500 | 5,000 | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 48 × C9300 | 2 × C9800-40 | 200 | 2 × SNS-3715 |
| **Chennai** | 1,800 | 3,600 | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 36 × C9300 | 2 × C9800-40 | 120 | 2 × SNS-3715 |
| **London** | 2,000 | 4,000 | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 42 × C9300 | 2 × C9800-40 | 160 | 2 × SNS-3715 |
| **Frankfurt** | 1,400 | 2,800 | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 28 × C9300 | 2 × C9800-40 | 100 | 2 × SNS-3715 |
| **New Jersey** | 2,600 | 5,200 | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 52 × C9300 | 2 × C9800-80 | 240 | 2 × SNS-3715 |
| **Dallas** | 1,600 | 3,200 | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 32 × C9300 | 2 × C9800-40 | 120 | 2 × SNS-3715 |

### 2.2 Branch Sites (Fabric-in-a-Box)

| Site | Users | Endpoints | FiaB Stack | Edge | WLC | APs | ISE Access |
|------|-------|-----------|------------|------|-----|-----|------------|
| **Bangalore** | 500 | 1,000 | 2 × C9300-48UXM | 8 × C9300 | EWC | 50 | Mumbai PSN |
| **Delhi** | 400 | 800 | 2 × C9300-48UXM | 6 × C9300 | EWC | 40 | Mumbai PSN |
| **Noida** | 200 | 400 | 2 × C9300-48UXM | 4 × C9300 | EWC | 20 | Mumbai PSN |

---

## 3. Capacity Calculations

### 3.1 Endpoint Calculation Methodology

```
Endpoint Calculation per Site:
├── Corporate Endpoints
│   ├── Desktops/Laptops: Users × 1.2 (some users have multiple)
│   ├── IP Phones: Users × 0.8 (not all have desk phones)
│   ├── Mobile Devices (BYOD): Users × 0.5
│   └── Printers/Shared: Users × 0.05
├── IoT Devices
│   ├── Sensors: Based on building size
│   ├── Cameras: Based on security requirements
│   └── Building Management: Based on facilities
└── Guest Devices
    └── Estimated: Users × 0.1 (daily visitors)

Example - Mumbai (2,500 users):
  Desktops/Laptops:    2,500 × 1.2  = 3,000
  IP Phones:           2,500 × 0.8  = 2,000 (included in 5,000)
  BYOD Devices:        2,500 × 0.5  = 1,250
  Printers/Shared:     2,500 × 0.05 =   125
  IoT Devices:                      =   400
  Guest (daily):       2,500 × 0.1  =   250
  ─────────────────────────────────────────
  Total Endpoints:                  ≈ 5,000 (with overlap)
```

### 3.2 Access Point Calculation

```
AP Calculation Methodology:
├── High-Density Areas (Conference, Cafeteria)
│   └── 1 AP per 30 users
├── Standard Office Areas
│   └── 1 AP per 40 users (open plan)
│   └── 1 AP per 25 users (private offices)
├── Coverage-based Areas (Corridors, Lobby)
│   └── 1 AP per 2,500 sq ft
└── Outdoor Areas
    └── 1 AP per 5,000 sq ft

Example - Mumbai Campus:
  Building A (1,000 users): 30 APs
  Building B (800 users):   25 APs
  Building C (500 users):   15 APs
  Data Center area:         10 APs
  Common areas/outdoor:     20 APs
  Conference rooms (30):    30 APs (1 per room)
  Executive floor:          10 APs
  Cafeteria/Gym:            10 APs
  Lobby/Reception:           5 APs
  Parking/Outdoor:           5 APs
  Redundancy (20%):         40 APs
  ─────────────────────────────────
  Total APs:               200 APs
```

### 3.3 Edge Switch Calculation

```
Edge Switch Sizing:
├── Port Requirements
│   ├── User ports: Endpoints × 1.1 (10% spare)
│   ├── AP ports: APs × 1.0
│   ├── Uplink ports: Based on bandwidth
│   └── Management ports: 2-4 per IDF
├── Switch Selection
│   ├── C9300-48U: Standard access (48 ports)
│   ├── C9300-24U: Small IDF (24 ports)
│   └── C9300-48UXM: mGig for APs (48 ports)
└── Stack Sizing
    └── Max 8 switches per stack

Example - Mumbai:
  Total ports needed: 5,000 × 1.1 = 5,500 ports
  AP ports (mGig):    200 ports
  
  Standard switches: 5,500 / 48 = 115 switches
  mGig switches:     200 / 48   =   5 switches
  
  With stacking efficiency: ~48 switches total
  (Multiple stacks across IDFs)
```

---

## 4. Catalyst Center Sizing

### 4.1 Cluster Requirements

| Deployment Size | Devices | Cluster Type | Nodes | Specifications |
|-----------------|---------|--------------|-------|----------------|
| Small | < 1,000 | Single Node | 1 | DN2-HW-APL |
| Medium | 1,000 - 5,000 | 3-Node Cluster | 3 | DN2-HW-APL-L |
| Large | 5,000 - 10,000 | 3-Node Cluster | 3 | DN2-HW-APL-XL |
| **Enterprise** | **> 10,000** | **3-Node + DR** | **6** | **DN2-HW-APL-XL** |

### 4.2 Abhavtech Catalyst Center Sizing

```yaml
Catalyst_Center_Sizing:
  
  Total_Managed_Devices:
    Switches: 350+
    Wireless_Controllers: 14
    Access_Points: 940
    Routers: 25
    Total: ~1,350 devices
    
  Recommendation: 3-Node Cluster + 3-Node DR
  
  Primary_Cluster:
    Location: New Jersey Data Center
    Nodes: 3 × DN2-HW-APL-XL
    Specs_per_Node:
      vCPU: 56 cores
      RAM: 256 GB
      Storage: 2.4 TB SSD (RAID)
      Network: 2 × 10G + 1 × 1G CIMC
      
  DR_Cluster:
    Location: London Data Center
    Nodes: 3 × DN2-HW-APL-XL
    Replication: Warm standby
    RPO: 4 hours
    RTO: 2 hours
```

### 4.3 Catalyst Center Capacity Limits

| Resource | DN2-HW-APL-XL Limit | Abhavtech Usage | Utilization |
|----------|---------------------|-----------------|-------------|
| Network Devices | 10,000 | 1,350 | 13.5% |
| Access Points | 18,000 | 940 | 5.2% |
| Endpoints | 200,000 | 25,000 | 12.5% |
| Concurrent API Sessions | 100 | 20 | 20% |
| Sites | 500 | 9 | 1.8% |

---

## 5. ISE Sizing

### 5.1 ISE Node Requirements

```yaml
ISE_Sizing_Calculation:
  
  Total_Endpoints: 25,000
  Concurrent_Sessions: ~18,000 (70% at any time)
  Peak_Auth_Rate: 500 authentications/second
  
  PSN_Sizing:
    Model: SNS-3715-K9
    Capacity_per_PSN: 50,000 concurrent sessions
    Recommended_Load: 60% = 30,000 sessions
    
    Required_PSNs: 18,000 / 30,000 = 1 (minimum)
    With_Redundancy: 2 per region × 6 regions = 12 PSNs
    
  PAN_Sizing:
    Model: SNS-3755-K9
    Primary: New Jersey
    Secondary: London
    Purpose: Policy administration, sync
    
  MnT_Sizing:
    Model: SNS-3755-K9
    Co-located with PAN
    Storage: 2.4 TB for 90-day retention
```

### 5.2 ISE Hardware Specifications

| Role | Model | vCPU | RAM | Storage | Qty |
|------|-------|------|-----|---------|-----|
| PAN Primary | SNS-3755-K9 | 24 cores | 256 GB | 2.4 TB | 1 |
| PAN Secondary | SNS-3755-K9 | 24 cores | 256 GB | 2.4 TB | 1 |
| MnT Primary | SNS-3755-K9 | 24 cores | 256 GB | 2.4 TB | 1 |
| MnT Secondary | SNS-3755-K9 | 24 cores | 256 GB | 2.4 TB | 1 |
| PSN (×12) | SNS-3715-K9 | 16 cores | 96 GB | 600 GB | 12 |

### 5.3 ISE Performance Metrics

| Metric | SNS-3715 (PSN) | SNS-3755 (PAN/MnT) |
|--------|----------------|-------------------|
| Max Concurrent Sessions | 100,000 | N/A |
| RADIUS Auth/sec | 20,000 | N/A |
| TACACS+ Auth/sec | 10,000 | N/A |
| Profiled Endpoints | 500,000 | 500,000 |
| pxGrid Subscriptions | 100 | 100 |

---

## 6. WLC Sizing

### 6.1 Wireless Controller Requirements

```yaml
WLC_Sizing:
  
  Model_Selection:
    C9800-40: Up to 2,000 APs, 32,000 clients
    C9800-80: Up to 6,000 APs, 64,000 clients
    C9800-CL: Virtual, up to 6,000 APs
    EWC: Embedded, up to 200 APs
    
  Site_Assignments:
    Mumbai:
      APs: 200
      Clients: ~4,000 concurrent
      Model: 2 × C9800-40 (HA SSO)
      
    New_Jersey:
      APs: 240
      Clients: ~5,000 concurrent
      Model: 2 × C9800-80 (HA SSO)
      
    Branch_Sites:
      APs: 20-50 per site
      Model: EWC on C9300
```

### 6.2 WLC Hardware Summary

| Site | Model | APs Supported | Client Capacity | HA Mode |
|------|-------|---------------|-----------------|---------|
| Mumbai | 2 × C9800-40 | 200 | 8,000 | SSO |
| Chennai | 2 × C9800-40 | 120 | 4,800 | SSO |
| London | 2 × C9800-40 | 160 | 6,400 | SSO |
| Frankfurt | 2 × C9800-40 | 100 | 4,000 | SSO |
| New Jersey | 2 × C9800-80 | 240 | 9,600 | SSO |
| Dallas | 2 × C9800-40 | 120 | 4,800 | SSO |
| Bangalore | EWC | 50 | 1,000 | N+1 |
| Delhi | EWC | 40 | 800 | N+1 |
| Noida | EWC | 20 | 400 | N+1 |

---

## 7. IP Address Sizing

### 7.1 IP Pool Requirements per Site

```yaml
IP_Pool_Sizing_Mumbai:
  
  VN_CORPORATE:
    Users: 2,500
    Devices_per_user: 2.5
    Total_IPs_needed: 6,250
    Pool_size: /20 (4,096) + /21 (2,048) = 6,144
    Pools:
      - 10.100.0.0/20 (Data)
      - 10.100.16.0/21 (Overflow)
      
  VN_VOICE:
    IP_Phones: 2,000
    Pool_size: /21 (2,048)
    Pool: 10.100.32.0/21
    
  VN_IOT:
    Devices: 400
    Pool_size: /23 (512)
    Pool: 10.100.40.0/23
    
  VN_GUEST:
    Daily_visitors: 250
    Pool_size: /24 (256)
    Pool: 10.100.50.0/24
    
  INFRA_VN:
    APs: 200
    Management: 50
    Pool_size: /23 (512)
    Pool: 10.100.60.0/23
```

### 7.2 Global IP Allocation Summary

| Site | VN_CORPORATE | VN_VOICE | VN_IOT | VN_GUEST | INFRA_VN | Total IPs |
|------|--------------|----------|--------|----------|----------|-----------|
| Mumbai | /20 + /21 | /21 | /23 | /24 | /23 | 9,216 |
| Chennai | /20 | /22 | /24 | /24 | /24 | 5,120 |
| London | /20 | /21 | /23 | /24 | /23 | 7,168 |
| Frankfurt | /21 | /22 | /24 | /24 | /24 | 3,328 |
| New Jersey | /19 + /21 | /21 | /23 | /24 | /23 | 11,264 |
| Dallas | /20 | /22 | /24 | /24 | /24 | 5,120 |
| Branches | /22 each | /24 | /25 | /25 | /25 | 1,536 |

---

## 8. Licensing Requirements

### 8.1 Cisco DNA Licensing

```yaml
DNA_Licensing:
  
  License_Tier: DNA Advantage (Required for SD-Access)
  
  Term: 5-year subscription
  
  Device_Counts:
    Switches: 350
    Wireless_Controllers: 14
    Access_Points: 940
    
  License_SKUs:
    - C9300-DNA-A-48-5Y × 300 (48-port switches)
    - C9300-DNA-A-24-5Y × 50 (24-port switches)
    - C9500-DNA-A-5Y × 20 (border/CP nodes)
    - AIR-DNA-A-5Y × 940 (access points)
    - DNA-C-T1-A-5Y × 6 (Catalyst Center appliances)
```

### 8.2 ISE Licensing

```yaml
ISE_Licensing:
  
  License_Model: ISE Advantage (Required for TrustSec)
  
  Base_License:
    Type: ISE Base
    Quantity: 25,000 endpoints
    
  Plus_License:
    Type: ISE Plus (Profiling, pxGrid)
    Quantity: 25,000 endpoints
    
  Apex_License:
    Type: ISE Apex (Posture, BYOD)
    Quantity: 10,000 endpoints (mobile/BYOD)
    
  Device_Admin_License:
    Type: TACACS+
    Quantity: 400 network devices
```

### 8.3 License Summary

| License Type | Quantity | Term | Purpose |
|--------------|----------|------|---------|
| DNA Advantage - Switches | 350 | 5-year | SD-Access fabric |
| DNA Advantage - APs | 940 | 5-year | Wireless assurance |
| DNA Advantage - WLC | 14 | 5-year | Controller management |
| ISE Base | 25,000 | Perpetual | Authentication |
| ISE Plus | 25,000 | Perpetual | Profiling, pxGrid |
| ISE Apex | 10,000 | Perpetual | Posture, BYOD |
| ISE Device Admin | 400 | Perpetual | TACACS+ |
| ThousandEyes | 47 agents | Subscription | Network visibility |

---

## 9. Growth Planning

### 9.1 5-Year Growth Projections

| Year | Users | Endpoints | APs | Sites | Growth Rate |
|------|-------|-----------|-----|-------|-------------|
| Year 1 (Current) | 12,000 | 25,000 | 940 | 9 | Baseline |
| Year 2 | 13,200 | 27,500 | 1,034 | 10 | 10% |
| Year 3 | 14,500 | 30,250 | 1,137 | 11 | 10% |
| Year 4 | 16,000 | 33,275 | 1,251 | 12 | 10% |
| Year 5 | 17,600 | 36,600 | 1,376 | 14 | 10% |

### 9.2 Capacity Headroom Analysis

| Component | Current Capacity | Current Usage | Year 5 Projected | Headroom |
|-----------|------------------|---------------|------------------|----------|
| Catalyst Center | 200,000 endpoints | 25,000 | 36,600 | 82% |
| ISE Sessions | 600,000 | 18,000 | 26,000 | 96% |
| WLC AP Capacity | 2,400 | 940 | 1,376 | 43% |
| IP Address Space | /14 allocated | /16 used | /15 projected | 50% |

---

## 10. Bill of Materials Summary

### 10.1 Network Hardware

| Category | Item | Quantity | Purpose |
|----------|------|----------|---------|
| Border Nodes | C9500-48Y4C | 12 | Fabric border |
| Control Plane | C9500-24Y4C | 12 | Map server/resolver |
| Edge Switches | C9300-48UXM | 200 | mGig access |
| Edge Switches | C9300-48U | 100 | Standard access |
| Edge Switches | C9300-24U | 50 | Small IDF |
| FiaB Switches | C9300-48UXM | 6 | Branch fabric |
| WLC Campus | C9800-40 | 10 | Campus wireless |
| WLC Large | C9800-80 | 2 | Large campus |
| Wi-Fi 7 APs | CW9176I | 235 | Latest technology |
| Wi-Fi 6E APs | C9136I | 470 | Standard coverage |
| Wi-Fi 6 APs | C9130AXI | 235 | Legacy/backup |

### 10.2 Management Infrastructure

| Category | Item | Quantity | Purpose |
|----------|------|----------|---------|
| Catalyst Center | DN2-HW-APL-XL | 6 | Network management |
| ISE PAN/MnT | SNS-3755-K9 | 4 | Policy admin |
| ISE PSN | SNS-3715-K9 | 12 | Authentication |
| Infoblox Grid | IB-4030 | 2 | DDI master |
| Infoblox Members | IB-2225 | 12 | Regional DDI |

---

## 11. Validation Checklist

### 11.1 Pre-Deployment Verification

```yaml
Sizing_Validation:
  
  Catalyst_Center:
    - [ ] Cluster size matches device count
    - [ ] Appliance specs meet requirements
    - [ ] DR site provisioned
    - [ ] Network connectivity verified
    
  ISE:
    - [ ] PSN count covers all regions
    - [ ] Session capacity adequate
    - [ ] Storage for 90-day retention
    - [ ] HA pairs configured
    
  Switching:
    - [ ] Port count covers endpoints + 20%
    - [ ] mGig ports for all APs
    - [ ] Uplink bandwidth adequate
    - [ ] Stack sizes within limits
    
  Wireless:
    - [ ] AP count per coverage model
    - [ ] WLC capacity for APs + 30%
    - [ ] Client capacity verified
    - [ ] HA mode configured
    
  Licensing:
    - [ ] DNA Advantage for all devices
    - [ ] ISE licenses match endpoints
    - [ ] Smart Licensing configured
    - [ ] Term length aligned
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
