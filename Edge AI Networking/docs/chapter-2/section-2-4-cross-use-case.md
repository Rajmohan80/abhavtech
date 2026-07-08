# Cross-Use Case Correlation

## 2.4 CROSS-USE CASE CORRELATION

### Overview

Sections 2.1-2.3 presented three distinct use cases (UC1 Security, UC2 Building Automation, UC3 Safety) as independent capabilities. In practice, these use cases **share the same Cisco Unified Edge infrastructure (UCS XE9305 + XE130c M8)** and create powerful synergies through multi-use case correlation. This section demonstrates how integrating multiple AI-driven use cases on a single platform delivers compounded value beyond the sum of individual capabilities.

**Key Architectural Principle:**

Traditional siloed deployments would require:
- Separate video analytics server for security
- Separate occupancy sensors for building automation
- Separate safety monitoring system for compliance

Abhavtech's unified approach deploys:
- **Single edge AI platform** serving all three use cases
- **Shared camera infrastructure** (same cameras feed multiple AI models)
- **Common integration layer** (ISE, Splunk, ServiceNow, Webex used across use cases)
- **Unified observability** (single GPU, single data pipeline, single management plane)

---

### 2.4.1 Infrastructure Sharing Model

**Hardware Consolidation (Per Site):**

```
Unified Edge AI Platform - UCS XE130c M8 (Slot 1, Primary)

┌─────────────────────────────────────────────────────────────┐
│ Hardware Layer (Cisco Unified Edge)                          │
├─────────────────────────────────────────────────────────────┤
│ Chassis: UCS XE9305 (3 RU, IDF Room Floor 3)                │
│ Compute: UCS XE130c M8 (Intel Xeon 6 SoC, 32 cores)         │
│ GPU: NVIDIA L4 24GB (120 TOPS INT8, 72W TDP)                │
│ Memory: 128GB DDR5-4800                                       │
│ Storage: 2TB NVMe (512GB boot + 2× 1TB event buffer)        │
│ Network: 2× 10G SFP+ LAG to Catalyst 9500                   │
│ Power: 350W per node (700W total with standby)              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Camera Layer (Shared Across Use Cases)                       │
├─────────────────────────────────────────────────────────────┤
│ 135 Cameras per Site (Mumbai/Chennai)                        │
│ ├─ 65× Indoor Fixed (Axis P3715-PLVE)                       │
│ ├─ 40× Outdoor PTZ (Axis Q6215-LE)                          │
│ ├─ 20× 4K LPR (Axis P1455-LE)                               │
│ └─ 10× Thermal (FLIR A310f)                                 │
│                                                               │
│ Multi-Use Case Camera Assignment:                            │
│ ├─ Loading Dock (6 cameras): UC1 perimeter + UC3 PPE        │
│ ├─ Hallways (14 cameras): UC1 loitering + UC3 slip/fall     │
│ ├─ Conference Rooms (21 cameras): UC1 access + UC2 occupancy│
│ ├─ Cafeteria (8 cameras): UC1 crowd + UC2 HVAC + UC3 fall   │
│ └─ Server Room (2 cameras): UC1 access + UC3 fire           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ AI Model Layer (GPU Resource Sharing)                        │
├─────────────────────────────────────────────────────────────┤
│ NVIDIA L4 GPU Utilization: 80-95% (combined UC1+UC2+UC3)    │
│                                                               │
│ UC1 Models (55-60% GPU):                                     │
│ ├─ YOLO v8n Person Detection (20ms)                         │
│ ├─ DeepSORT Object Tracking (10ms)                          │
│ ├─ PPE CNN Classification (8ms)                             │
│ └─ LPR Pipeline (127ms)                                      │
│                                                               │
│ UC2 Models (15-20% GPU):                                     │
│ └─ YOLO v8n Occupancy (reuses UC1 model, 20ms)             │
│                                                               │
│ UC3 Models (10-15% GPU):                                     │
│ ├─ YOLO v8n + PPE CNN (28ms)                                │
│ ├─ Thermal Anomaly Detection (CPU-only, 0% GPU)             │
│ └─ OpenPose Pose Estimation (45ms, FP16)                    │
│                                                               │
│ Model Reuse:                                                  │
│ └─ YOLO v8n person detection shared by UC1, UC2, UC3        │
│    (single model inference, multiple downstream consumers)   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Integration Layer (Common APIs)                              │
├─────────────────────────────────────────────────────────────┤
│ ISE pxGrid: Badge correlation (UC1, UC2 after-hours, UC3)   │
│ Splunk MLTK: Historical pattern validation (UC1, UC2)       │
│ ThousandEyes: Network health validation (UC1)               │
│ AppDynamics: Application health validation (UC1)            │
│ BMS Honeywell: HVAC/lighting control (UC2), Fire alarm (UC3)│
│ FTD Firewall: Network blocking (UC1)                        │
│ XDR SecureX: Security incidents (UC1)                       │
│ ServiceNow: Incident management (UC1, UC2, UC3)             │
│ Webex Teams: Mobile alerts (UC1, UC2, UC3)                  │
└─────────────────────────────────────────────────────────────┘
```

**Infrastructure Utilization Breakdown:**

| Resource | UC1 | UC2 | UC3 | Combined | Capacity | Utilization |
|----------|-----|-----|-----|----------|----------|-------------|
| **GPU Compute** | 55-60% | 15-20% | 10-15% | 80-95% | 100% | Optimal |
| **GPU Memory** | 18 GB | 850 MB | 4.3 GB | 23.15 GB | 24 GB | 96% (tight) |
| **CPU Cores** | 8 cores | 4 cores | 6 cores | 18 cores | 32 cores | 56% |
| **Network (Inbound)** | 960 Mbps | 0 Mbps* | 0 Mbps* | 960 Mbps | 20 Gbps | 5% |
| **Network (Outbound)** | 50 Mbps | 5 Mbps | 3 Mbps | 58 Mbps | 20 Gbps | <1% |
| **Storage (Event Buffer)** | 1.2 TB | 200 GB | 350 GB | 1.75 TB | 2 TB | 88% |

*UC2 and UC3 reuse video streams already ingested for UC1, requiring zero additional inbound bandwidth.

---

### 2.4.2 Summary: Unified Platform Benefits

**Technical Benefits:**

1. **Infrastructure Consolidation:** Single UCS XE9305 platform replaces 3 separate systems
2. **Resource Efficiency:** 80-95% GPU utilization across combined workloads (optimal target)
3. **Camera Reuse:** Same cameras serve multiple use cases (security + occupancy + safety)
4. **Model Sharing:** YOLO v8n person detection reused by UC1, UC2, UC3 (single inference, multiple consumers)
5. **Network Efficiency:** 960 Mbps inbound (cameras) + 58 Mbps outbound (APIs) = 5% of 20 Gbps capacity
6. **Integration Layer:** Common APIs (ISE, BMS, ServiceNow, Webex) shared across use cases

**Operational Benefits:**

1. **Single Management Plane:** Cisco Intersight manages entire edge AI platform (vs 3 separate consoles)
2. **Unified Monitoring:** All use cases visible in single Splunk dashboard
3. **Simplified Troubleshooting:** Single hardware platform, single software stack
4. **Reduced Vendor Complexity:** Single Cisco platform vs 3+ vendors

**Business Benefits:**

1. **Faster Deployment:** Incremental use case enablement (UC1 → UC2 → UC3) vs parallel projects
2. **Enhanced Decision Quality:** Cross-use case correlation creates context-aware automation
3. **Scalability:** Phase 5 branch expansion leverages same platform (Slots 3-5 reserved)

---

---

## Chapter 2 Summary

Chapter 2 documents three integrated use cases deployed on Abhavtech's Cisco Unified Edge platform:

- **Section 2.1 (UC1): Intelligent Physical Security** - 6 security functions, <500ms detection to response
- **Section 2.2 (UC2): Building Automation** - HVAC/lighting optimization, BMS integration
- **Section 2.3 (UC3): Safety & Compliance** - PPE detection, fire/smoke monitoring, slip/fall detection
- **Section 2.4: Cross-Use Case Correlation** - Multi-use case synergies and infrastructure sharing

**Platform:** Cisco UCS XE9305 chassis with UCS XE130c M8 compute nodes, NVIDIA L4 24GB GPU
**Network:** Catalyst 9300 access + Catalyst 9500 distribution, 4ms camera-to-inference latency
**Integration:** ISE, Splunk MLTK, ThousandEyes, AppDynamics, BMS, FTD, XDR, ServiceNow, Webex
