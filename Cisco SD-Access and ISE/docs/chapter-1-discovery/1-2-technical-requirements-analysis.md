# 1.2 Technical Requirements Analysis

### 1.2.1 Core Technical Requirements

| Requirement ID | Category | Requirement Description | Priority |
|----------------|----------|------------------------|----------|
| **NET-001** | Segmentation | Implement micro-segmentation across all sites | Critical |
| **NET-002** | Automation | Zero-touch provisioning for new switches | High |
| **NET-003** | Policy | Centralized policy management across regions | Critical |
| **NET-004** | Visibility | End-to-end path visibility and analytics | High |
| **NET-005** | Security | 802.1X authentication for all endpoints | Critical |
| **NET-006** | Mobility | Seamless roaming within and across buildings | Medium |
| **NET-007** | Scale | Support 15,000+ concurrent endpoints | Critical |
| **NET-008** | Availability | 99.99% uptime for critical services | Critical |
| **NET-009** | Compliance | Meet PCI-DSS, SOC2, GDPR requirements | Critical |
| **NET-010** | Integration | Integrate with existing ServiceNow, Splunk | High |

### 1.2.2 SD-Access Fabric Requirements

| Component | Requirement | Sizing |
|-----------|-------------|--------|
| **Fabric Sites** | Autonomous fabric per region | 6 primary fabrics |
| **Virtual Networks (VN)** | Separate overlay for business units | 4-6 VNs |
| **Scalable Groups (SGT)** | Micro-segmentation policies | 15-20 SGTs |
| **Anycast Gateway** | Distributed gateway per VN | Per Edge Node |
| **Host Pools** | IP address pools per site | /22 to /20 per site |
| **Control Plane HA** | Redundant CP nodes per fabric | 2 CP nodes per site |
| **Border Node HA** | Redundant border for WAN/DC | 2 Border nodes per hub |

### 1.2.3 DNAC Controller Requirements

**Cluster Sizing Calculation:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DNA CENTER SIZING CALCULATION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Total Network Devices:                                                     │
│  ──────────────────────                                                     │
│  Core Switches:           24 devices                                        │
│  Distribution Switches:   44 devices                                        │
│  Access Switches:        300 devices                                        │
│  WAN Routers:             24 devices                                        │
│  Wireless Controllers:    12 devices                                        │
│  Access Points:          450 devices                                        │
│  ─────────────────────────────────────                                      │
│  TOTAL MANAGED DEVICES:  854 devices                                        │
│                                                                             │
│  DNAC Appliance Selection:                                                  │
│  ─────────────────────────                                                  │
│  DN2-HW-APL-XL (Extra Large Cluster)                                        │
│                                                                             │
│  Capacity:                                                                  │
│  - Up to 8,000 network devices                                              │
│  - Up to 200,000 endpoints                                                  │
│  - 3-node cluster for HA                                                    │
│                                                                             │
│  Deployment: Single DNAC Cluster (Primary: New Jersey, DR: London)          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2.4 ISE Deployment Requirements

**ISE Node Sizing:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ISE DEPLOYMENT SIZING                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Endpoint Population:                                                       │
│  ────────────────────                                                       │
│  Employees (Corporate Devices):     12,000 endpoints                        │
│  BYOD Devices:                       3,000 endpoints                        │
│  IoT/OT Devices:                     2,500 endpoints                        │
│  Guest Devices (Peak):               1,500 endpoints                        │
│  ─────────────────────────────────────────────────                          │
│  TOTAL CONCURRENT ENDPOINTS:        19,000 endpoints                        │
│                                                                             │
│  ISE Deployment Model: Distributed                                          │
│  ─────────────────────────────────────                                      │
│                                                                             │
│  Primary Administration Node (PAN):                                         │
│    Location: New Jersey (Primary)                                           │
│    Appliance: SNS-3695-K9 (Large)                                           │
│                                                                             │
│  Secondary Administration Node (PAN):                                       │
│    Location: London (Secondary)                                             │
│    Appliance: SNS-3695-K9 (Large)                                           │
│                                                                             │
│  Policy Service Nodes (PSN) - Regional:                                     │
│    APAC: Mumbai, Chennai (2 × SNS-3655-K9)                                  │
│    EMEA: London, Frankfurt (2 × SNS-3655-K9)                                │
│    Americas: New Jersey, Dallas (2 × SNS-3655-K9)                           │
│                                                                             │
│  Monitoring & Troubleshooting Node (MnT):                                   │
│    Location: New Jersey (Co-located with PAN)                               │
│    Location: London (Co-located with Secondary PAN)                         │
│                                                                             │
│  pxGrid Nodes:                                                              │
│    Integrated with PAN nodes for SD-Access integration                      │
│                                                                             │
│  PSN Capacity Formula:                                                      │
│  ─────────────────────                                                      │
│  Authentications per second = Endpoints × Auth Rate × Peak Factor           │
│  19,000 × 0.001 × 2.5 = 47.5 auth/sec per PSN pair                          │
│                                                                             │
│  SNS-3655 supports up to 40,000 concurrent sessions                         │
│  Total PSN capacity: 6 nodes × 40,000 = 240,000 (sufficient headroom)       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---
