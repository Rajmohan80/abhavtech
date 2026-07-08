# 2.11 Sizing & Scalability Design

## Document Information
| Field | Value |
|-------|-------|
| Document Title | SD-WAN Sizing & Scalability Design |
| Version | 1.0 |
| Author | Network Architecture Team |
| Organization | Abhavtech.com |
| Last Updated | December 2025 |
| Status | Production |

---

## Table of Contents
1. [Sizing Overview](#sizing-overview)
2. [Controller Sizing](#controller-sizing)
3. [WAN Edge Sizing](#wan-edge-sizing)
4. [Bandwidth Calculations](#bandwidth-calculations)
5. [Performance Baselines](#performance-baselines)
6. [Scalability Planning](#scalability-planning)
7. [Growth Projections](#growth-projections)
8. [Capacity Monitoring](#capacity-monitoring)

---

## 1. Sizing Overview

### 1.1 Sizing Methodology

The sizing approach follows Cisco's validated design principles with safety margins for growth.

**Sizing Factors:**
- Number of WAN edges and sites
- Aggregate throughput requirements
- Tunnel count and complexity
- Feature enablement (encryption, UTD, DPI)
- Policy complexity and rule count
- Template and configuration size
- Logging and analytics volume

### 1.2 Current Deployment Scale

| Metric | Current | Year 1 | Year 3 | Year 5 |
|--------|---------|--------|--------|--------|
| Sites | 9 | 12 | 25 | 50 |
| WAN Edges | 15 | 22 | 45 | 85 |
| Users | 2,500 | 3,500 | 6,000 | 10,000 |
| Bandwidth (Mbps) | 4,500 | 7,000 | 15,000 | 30,000 |
| VPNs/Segments | 5 | 8 | 12 | 15 |
| Policies | 50 | 100 | 200 | 350 |

---

## 2. Controller Sizing

### 2.1 SD-WAN Manager (vManage) Cluster

**Cluster Configuration:**

```
+-------------------------------------------------------------------+
|                    SD-WAN MANAGER CLUSTER                          |
+-------------------------------------------------------------------+
|                                                                    |
|  Mumbai DC (Primary)           Chennai DR (Standby)                |
|  +-------------------+         +-------------------+               |
|  | vManage-1 (Master)|         | vManage-DR1      |               |
|  | 32 vCPU, 128GB    |   ----> | 32 vCPU, 128GB   |               |
|  | 2TB SSD RAID10    |  Async  | 2TB SSD RAID10   |               |
|  +-------------------+  Repl   +-------------------+               |
|  | vManage-2         |         | vManage-DR2      |               |
|  | 32 vCPU, 128GB    |   ----> | 32 vCPU, 128GB   |               |
|  | 2TB SSD RAID10    |         | 2TB SSD RAID10   |               |
|  +-------------------+         +-------------------+               |
|  | vManage-3         |         | vManage-DR3      |               |
|  | 32 vCPU, 128GB    |   ----> | 32 vCPU, 128GB   |               |
|  | 2TB SSD RAID10    |         | 2TB SSD RAID10   |               |
|  +-------------------+         +-------------------+               |
|                                                                    |
|  Cluster VIP: 10.254.1.100    DR VIP: 10.254.2.100               |
+-------------------------------------------------------------------+
```

**vManage Server Specifications:**

| Scale | vCPU | Memory | Storage | Devices | Notes |
|-------|------|--------|---------|---------|-------|
| Small (1-100) | 16 | 64 GB | 500 GB | Up to 100 | Single node |
| Medium (100-1000) | 24 | 96 GB | 1 TB | Up to 1,000 | 3-node cluster |
| Large (1000-5000) | 32 | 128 GB | 2 TB | Up to 5,000 | 6-node cluster |
| **Abhavtech** | **32** | **128 GB** | **2 TB** | **Target: 85** | **3+3 cluster** |

**Storage Requirements:**

| Component | Size | Purpose |
|-----------|------|---------|
| OS & Software | 100 GB | Base installation |
| Configuration DB | 200 GB | Device configs, templates |
| Statistics DB | 500 GB | Performance metrics (30 days) |
| Logs | 300 GB | System and audit logs |
| Backups | 500 GB | Configuration backups |
| Growth Buffer | 400 GB | 50% growth allowance |
| **Total** | **2 TB** | Per node |

### 2.2 SD-WAN Controller (vSmart) Sizing

**vSmart Specifications:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| vCPU | 8 | Per controller |
| Memory | 16 GB | OMP table capacity |
| Storage | 100 GB | SSD recommended |
| Deployment | 4 controllers | 2 Mumbai, 2 Chennai |
| Edge Capacity | 5,000 per vSmart | Supports 20,000 total |
| OMP Routes | 128,000 per vSmart | Regional summarization |

**vSmart Distribution:**

```
Mumbai DC                        Chennai DR
+----------------+               +----------------+
| vSmart-1       |               | vSmart-3       |
| Region 1+3     |               | Region 2+3     |
| 10.254.1.20    |               | 10.254.2.20    |
+----------------+               +----------------+
| vSmart-2       |               | vSmart-4       |
| Region 1+3     |               | Region 2+3     |
| 10.254.1.21    |               | 10.254.2.21    |
+----------------+               +----------------+
```

### 2.3 SD-WAN Validator (vBond) Sizing

**vBond Specifications:**

| Parameter | Value |
|-----------|-------|
| vCPU | 4 |
| Memory | 8 GB |
| Storage | 50 GB |
| Deployment | 2 (cloud-hosted) |
| Edge Capacity | 20,000 per vBond |

---

## 3. WAN Edge Sizing

### 3.1 Platform Selection Matrix

| Site Type | Model | Throughput | Sessions | Tunnels | Sites |
|-----------|-------|------------|----------|---------|-------|
| Data Center | C8500-12X4QC | 10 Gbps | 2M | 8,000 | Mumbai, Chennai |
| Regional Hub | C8300-2N2S-6T | 2.5 Gbps | 500K | 4,000 | London, Frankfurt, NJ, Dallas |
| Large Branch | C8200-1N-4T | 1 Gbps | 250K | 2,000 | Bangalore, Delhi |
| Small Branch | C8200L-1N-4T | 500 Mbps | 100K | 1,000 | Noida |

### 3.2 Throughput Requirements by Site

**Mumbai DC (Primary Data Center):**

| Traffic Type | Current (Mbps) | Year 3 (Mbps) | Year 5 (Mbps) |
|--------------|----------------|---------------|---------------|
| Branch-to-DC | 1,500 | 3,500 | 7,000 |
| Inter-DC | 800 | 2,000 | 4,000 |
| Cloud (SaaS) | 500 | 1,500 | 3,000 |
| Cloud (IaaS) | 300 | 1,000 | 2,000 |
| **Total** | **3,100** | **8,000** | **16,000** |
| **Platform** | C8500-12X4QC (10G) | C8500-12X4QC | 2x C8500-12X4QC |

**Regional Hub (London/Frankfurt/NJ/Dallas):**

| Traffic Type | Current (Mbps) | Year 3 (Mbps) | Year 5 (Mbps) |
|--------------|----------------|---------------|---------------|
| Local Users | 200 | 400 | 800 |
| Regional Branches | 300 | 600 | 1,200 |
| Cloud Access | 200 | 500 | 1,000 |
| **Total** | **700** | **1,500** | **3,000** |
| **Platform** | C8300-2N2S-6T (2.5G) | C8300-2N2S-6T | C8300-2N2S-6T |

**Branch Site (Bangalore/Delhi):**

| Traffic Type | Current (Mbps) | Year 3 (Mbps) | Year 5 (Mbps) |
|--------------|----------------|---------------|---------------|
| Business Apps | 150 | 300 | 500 |
| Cloud/SaaS | 100 | 250 | 400 |
| Voice/Video | 50 | 100 | 200 |
| **Total** | **300** | **650** | **1,100** |
| **Platform** | C8200-1N-4T (1G) | C8200-1N-4T | C8300-2N2S-6T |

### 3.3 Feature Impact on Performance

**Throughput Reduction Factors:**

| Feature | Impact | Mitigation |
|---------|--------|------------|
| IPsec AES-256 | 10-15% | Hardware crypto engine |
| UTD IPS/IDS | 30-40% | Size for encrypted throughput |
| DPI | 20-30% | Limit to critical applications |
| Application Visibility | 5-10% | Enable selectively |
| SSL Inspection | 40-50% | SSL proxy for specific traffic |

**Effective Throughput Calculation:**

```
Effective_Throughput = Raw_Throughput × (1 - IPsec_Impact) × (1 - UTD_Impact)

Example (C8300 with IPsec + UTD):
  Raw: 2,500 Mbps
  IPsec: 2,500 × 0.85 = 2,125 Mbps
  UTD: 2,125 × 0.65 = 1,381 Mbps effective
```

---

## 4. Bandwidth Calculations

### 4.1 Site Bandwidth Requirements

**Bandwidth Planning Formula:**

```
Total_BW = (Users × BW_per_User) + (Apps × App_BW) + Overhead(20%)

Mumbai DC:
  Users: 800 × 2 Mbps = 1,600 Mbps
  Apps: 15 × 100 Mbps = 1,500 Mbps
  Overhead: 620 Mbps
  Total: 3,720 Mbps → Provision 5 Gbps
```

### 4.2 Aggregate Bandwidth Summary

| Site | Users | Calculated BW | Provisioned | Transport Mix |
|------|-------|---------------|-------------|---------------|
| Mumbai DC | 800 | 3,720 Mbps | 5,000 Mbps | MPLS 2G + DIA 2G + 5G 1G |
| Chennai DR | 600 | 2,790 Mbps | 4,000 Mbps | MPLS 2G + DIA 1.5G + 5G 500M |
| Bangalore | 400 | 1,860 Mbps | 2,000 Mbps | MPLS 500M + DIA 1G + LTE 500M |
| Delhi | 350 | 1,627 Mbps | 2,000 Mbps | MPLS 500M + DIA 1G + LTE 500M |
| Noida | 100 | 465 Mbps | 500 Mbps | DIA 300M + LTE 200M |
| London | 150 | 697 Mbps | 1,000 Mbps | MPLS 500M + DIA 500M |
| Frankfurt | 50 | 232 Mbps | 500 Mbps | MPLS 200M + DIA 300M |
| New Jersey | 30 | 139 Mbps | 500 Mbps | MPLS 200M + DIA 300M |
| Dallas | 20 | 93 Mbps | 300 Mbps | DIA 200M + LTE 100M |

### 4.3 Control Plane Bandwidth

**OMP/BFD Overhead:**

| Traffic Type | Bandwidth | Notes |
|--------------|-----------|-------|
| OMP Updates | 50-100 Kbps | Per vSmart connection |
| BFD (per tunnel) | 5 Kbps | 100ms intervals |
| DTLS Keepalives | 10 Kbps | Per controller |
| Statistics Upload | 200-500 Kbps | Per edge to vManage |
| **Total per Edge** | **~1 Mbps** | Control plane reservation |

---

## 5. Performance Baselines

### 5.1 Tunnel Performance Targets

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Tunnel Latency | <150 ms | >150 ms | >200 ms |
| Jitter | <30 ms | >30 ms | >50 ms |
| Packet Loss | <0.5% | >0.5% | >1% |
| Tunnel Flaps | 0/day | >2/day | >5/day |

### 5.2 Application Performance SLAs

| Application Class | Latency | Jitter | Loss | Bandwidth |
|-------------------|---------|--------|------|-----------|
| Real-Time (Voice) | <150 ms | <30 ms | <1% | 100 Kbps/call |
| Interactive (Video) | <200 ms | <50 ms | <2% | 2 Mbps/stream |
| Business Critical | <300 ms | <100 ms | <3% | Variable |
| Default | <500 ms | <150 ms | <5% | Best effort |

### 5.3 Controller Performance Targets

| Metric | vManage | vSmart | vBond |
|--------|---------|--------|-------|
| CPU Utilization | <70% | <60% | <50% |
| Memory Utilization | <80% | <70% | <60% |
| API Response Time | <2 sec | N/A | N/A |
| Config Push Time | <30 sec | N/A | N/A |
| OMP Convergence | N/A | <10 sec | N/A |

---

## 6. Scalability Planning

### 6.1 Scalability Limits

**Maximum Supported Scale:**

| Component | Limit | Abhavtech Current | Headroom |
|-----------|-------|-------------------|----------|
| Sites | 20,000 | 9 | 99.95% |
| WAN Edges | 20,000 | 15 | 99.92% |
| Service VPNs | 512 | 5 | 99.0% |
| Tunnels per Edge | 8,000 | 189 | 97.6% |
| OMP Routes | 512,000 | ~2,000 | 99.6% |
| Policies | 10,000 | 50 | 99.5% |
| Templates | 2,000 | 25 | 98.8% |

### 6.2 Scalability Architecture

```
+------------------------------------------------------------------+
|                    SCALABILITY ARCHITECTURE                       |
+------------------------------------------------------------------+
|                                                                   |
|  Tier 1: Regional Edges (Branch/Small Sites)                     |
|  +---------------------------------------------------------+     |
|  | 85 WAN Edges (Year 5) | C8200/C8300 | OMP to vSmart     |     |
|  +---------------------------------------------------------+     |
|                              |                                    |
|  Tier 2: Hub Sites (Aggregation)                                 |
|  +---------------------------------------------------------+     |
|  | 8 Hub Edges | C8300/C8500 | Route Summarization         |     |
|  +---------------------------------------------------------+     |
|                              |                                    |
|  Tier 3: Controllers                                             |
|  +---------------------------------------------------------+     |
|  | 4 vSmart | Regional Distribution | MRF Enabled          |     |
|  +---------------------------------------------------------+     |
|                              |                                    |
|  Tier 4: Management                                              |
|  +---------------------------------------------------------+     |
|  | 6 vManage (3+3) | Clustered | Geo-Redundant             |     |
|  +---------------------------------------------------------+     |
+------------------------------------------------------------------+
```

### 6.3 Scale-Out Triggers

| Metric | Current | Scale-Out Trigger | Action |
|--------|---------|-------------------|--------|
| WAN Edges | 15 | >100 edges | Add vSmart pair |
| OMP Routes | ~2,000 | >50,000 routes | Enable route summarization |
| vManage CPU | 35% | >70% sustained | Add cluster node |
| Templates | 25 | >500 templates | Implement hierarchy |
| Statistics Volume | 10 GB/day | >50 GB/day | Add stats node |

---

## 7. Growth Projections

### 7.1 5-Year Growth Model

```
Sites Growth:
Year 0: ████████░░░░░░░░░░░░ 9 sites (Current)
Year 1: ██████████░░░░░░░░░░ 12 sites (+33%)
Year 2: ████████████░░░░░░░░ 18 sites (+50%)
Year 3: ██████████████░░░░░░ 25 sites (+39%)
Year 4: ████████████████░░░░ 35 sites (+40%)
Year 5: ██████████████████░░ 50 sites (+43%)

WAN Edges Growth:
Year 0: 15 edges   → Year 5: 85 edges (467% growth)
Year 0: 2,500 users → Year 5: 10,000 users (300% growth)
```

### 7.2 Capacity Planning Timeline

| Year | Action | Investment |
|------|--------|------------|
| Year 0 | Initial deployment | Controllers + 15 edges |
| Year 1 | Regional expansion | +7 edges, enhanced licensing |
| Year 2 | India expansion | +15 edges, vSmart addition |
| Year 3 | APAC expansion | +10 edges, storage expansion |
| Year 4 | Americas growth | +15 edges, vManage upgrade |
| Year 5 | Global reach | +20 edges, platform refresh |

### 7.3 Resource Forecasting

**Controller Capacity Forecast:**

| Year | Edges | vManage CPU | vManage Memory | vSmart OMP Routes |
|------|-------|-------------|----------------|-------------------|
| 0 | 15 | 35% | 40% | 2,000 |
| 1 | 22 | 40% | 45% | 4,000 |
| 2 | 37 | 50% | 55% | 8,000 |
| 3 | 47 | 55% | 60% | 12,000 |
| 4 | 65 | 65% | 70% | 18,000 |
| 5 | 85 | 75% | 80% | 25,000 |

---

## 8. Capacity Monitoring

### 8.1 Key Capacity Metrics

**vManage Monitoring:**

```bash
# Check cluster status
show cluster status

# Monitor resource utilization
show system status

# Check configuration database
show configuration database status

# Statistics database health
show statistics database status
```

**vSmart Monitoring:**

```bash
# OMP peer count
show sdwan omp peers | count

# OMP route count
show sdwan omp routes | count

# Controller resources
show system status
```

### 8.2 Capacity Dashboard Metrics

| Category | Metric | Query Interval |
|----------|--------|----------------|
| Controllers | CPU/Memory/Disk | 5 min |
| WAN Edges | Throughput/Sessions | 1 min |
| Tunnels | Count/Utilization | 5 min |
| OMP | Route Count/Churn | 15 min |
| Policies | Applied/Pending | 30 min |
| Licenses | Usage/Available | Daily |

### 8.3 Alerting Thresholds

| Resource | Warning | Critical | Action |
|----------|---------|----------|--------|
| CPU | 70% | 85% | Scale out or optimize |
| Memory | 75% | 90% | Add capacity |
| Disk | 70% | 85% | Expand storage |
| Tunnels | 80% max | 90% max | Add WAN edge |
| OMP Routes | 80% limit | 90% limit | Enable summarization |
| Licenses | 80% used | 95% used | Procure additional |

### 8.4 Capacity Planning Automation

**Python Script for Capacity Forecasting:**

```python
#!/usr/bin/env python3
"""
SD-WAN Capacity Forecasting Script
Abhavtech.com
"""

import requests
from datetime import datetime, timedelta

def get_current_capacity(vmanage_host, auth):
    """Retrieve current capacity metrics"""
    metrics = {}
    
    # Get edge count
    response = requests.get(
        f"https://{vmanage_host}/dataservice/device",
        auth=auth, verify=False
    )
    metrics['edge_count'] = len(response.json()['data'])
    
    # Get OMP route count
    response = requests.get(
        f"https://{vmanage_host}/dataservice/statistics/omp/routes",
        auth=auth, verify=False
    )
    metrics['omp_routes'] = response.json()['totalCount']
    
    return metrics

def forecast_capacity(current, growth_rate, years):
    """Project capacity needs"""
    projections = []
    for year in range(years + 1):
        projected = current * ((1 + growth_rate) ** year)
        projections.append({
            'year': year,
            'value': int(projected)
        })
    return projections

# Usage
current_edges = 15
growth_rate = 0.40  # 40% annual growth
forecast = forecast_capacity(current_edges, growth_rate, 5)
```

---

## Summary

The sizing and scalability design ensures Abhavtech's SD-WAN infrastructure can support current requirements while accommodating projected 5-year growth from 9 to 50 sites.

**Key Sizing Decisions:**
- vManage: 3+3 cluster (32 vCPU, 128 GB, 2 TB each)
- vSmart: 4 controllers geo-distributed
- WAN Edges: C8500 (DC), C8300 (hub), C8200 (branch)
- Bandwidth: 20% overhead, feature impact factors applied
- Growth: 40% annual expansion capacity built-in

**Next Section:** [2.12 IP Addressing Design](2-12-ip-addressing-design.md)

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
