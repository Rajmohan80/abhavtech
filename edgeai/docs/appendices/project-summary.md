# Solution Summary

## Project Overview

**Project:** ABV-SECOPS-AI-2025 - PHASE 4: AI Edge Networking Architecture
**Scope:** Mumbai Hub + Chennai Hub edge AI deployment with observability fusion

This appendix consolidates the technical solution across all use cases and the edge AI platform architecture for quick reference.

---

## Solution Deliverables

### **Chapter 2: Use Case Architecture**

#### **Section 2.1: UC1 - Intelligent Physical Security**

**2.1.1 Security Functions & AI Models**
- 6 security functions: Perimeter intrusion, loitering, tailgating, LPR, crowd density, access control
- AI models: YOLO v8n (person detection), DeepSORT (tracking), PPE CNN, LPR pipeline
- Performance targets: <500ms response, <5% false positive rate
- Hardware: NVIDIA L4 24GB GPU on UCS XE130c M8

**2.1.2 Camera Deployment & Network Architecture**
- Complete UCS XE9305 + UCS XE130c M8 specifications
- 135 cameras per site (60 indoor, 40 outdoor PTZ, 20 4K LPR, 10 thermal)
- 5-layer network architecture (Camera → Cat9300 → Cat9500 → Edge AI → Observability)
- 4ms camera-to-inference latency (IDF Room Floor 3 co-location)
- Complete Bill of Materials with vendor-neutral pricing

**2.1.3 Observability Integration**
- Complete 500ms detection → response timeline
- Multi-source validation: ISE pxGrid (50ms), Splunk MLTK (100ms), ThousandEyes (80ms), AppDynamics (90ms)
- Complete JSON API payloads for all integrations
- Automated actions: FTD blocking, XDR incidents, ServiceNow tickets, Webex alerts
- Real-world scenario walkthrough: Loading dock perimeter intrusion

#### **Section 2.2: UC2 - Building Automation**

- AI-driven HVAC/lighting optimization using occupancy detection
- BMS integration (Honeywell EBI R410.1) with REST API specifications
- 3 complete workflows:
  - WF-009: Conference room occupancy → HVAC adjustment
  - WF-010: Cafeteria crowd density → ventilation control
  - WF-011: After-hours occupancy → security alert + local HVAC
- Infrastructure reuse: Zero incremental hardware (uses UC1 platform)
- GPU impact: +15-20% utilization (combined total 70-80%)
- 30-day validation results: 97.7% F1 score occupancy detection

#### **Section 2.3: UC3 - Safety & Compliance Monitoring**

- 3 AI-powered safety functions:
  - **PPE Detection:** Hard hat + safety vest monitoring (loading dock)
  - **Fire/Smoke Detection:** Thermal anomaly detection (server room, electrical room)
  - **Slip/Fall Detection:** Pose estimation for fall incidents (hallways, stairwells)
- AI Models:
  - YOLO v8n + PPE CNN (28ms inference, 93% accuracy)
  - Thermal processing (CPU-only, 15ms, >85°C threshold)
  - OpenPose pose estimation (45ms inference, 88% fall detection)
- 2 complete workflows:
  - WF-012: PPE violation → supervisor alert (2-minute response)
  - WF-013: Fire detection → BMS fire alarm + HVAC shutdown (1.5-second response)
- Hardware: Same UCS XE9305 infrastructure (+10-15% GPU utilization)
- Integration: BMS fire alarm, ISE badge correlation, ServiceNow, Webex

#### **Section 2.4: Cross-Use Case Correlation**

- Infrastructure sharing model: Single platform serves all three use cases
- GPU utilization breakdown: UC1 (55-60%) + UC2 (15-20%) + UC3 (10-15%) = 80-95% combined
- Camera reuse: Same cameras feed multiple AI models simultaneously
- Model sharing: YOLO v8n person detection reused by UC1, UC2, UC3
- Network efficiency: 960 Mbps inbound + 58 Mbps outbound = 5% of 20 Gbps capacity
- Operational benefits: Single management plane, unified monitoring, simplified troubleshooting

---

### **Chapter 3: Edge AI Platform Architecture**

#### **3.1 Multi-Layer Architecture**
- 5-layer architecture diagram:
  - Layer 1: Camera & Sensor Layer (135 cameras per site)
  - Layer 2: Access Network (Catalyst 9300-48U, PoE+)
  - Layer 3: Distribution Network (Catalyst 9500-40X, routing/aggregation)
  - Layer 4: Edge AI Compute (UCS XE9305 + XE130c M8, NVIDIA L4 GPU)
  - Layer 5: Observability & Integration (ISE, Splunk, TE, AppD, BMS, FTD, XDR, ServiceNow, Webex)
- Complete latency breakdown: 2ms network + 30ms AI processing + 100ms validation + 100ms actions = 232ms minimum
- Layer responsibilities and criticality assessment

#### **3.2 AI Model Pipeline**
- Model deployment architecture: ONNX models + Kubernetes (K3s) orchestration
- Complete inference pipeline (frame-by-frame):
  - Stage 1: Pre-processing (CPU, 5ms) - resize, normalize, colorspace conversion
  - Stage 2: GPU inference (NVIDIA L4, 20ms) - YOLO v8n forward pass
  - Stage 3: Post-processing (CPU, 3ms) - NMS, confidence filtering, zone validation
  - Stage 4: Decision logic (CPU, 2ms) - duplicate check, validation trigger
  - Stage 5: Multi-source validation (parallel, 100ms) - ISE, Splunk, TE, AppD
  - Stage 6: Automated actions (parallel, 80ms) - FTD, XDR, ServiceNow, Webex
- GPU memory layout: 23.15 GB / 24 GB (96% utilization)
- CPU core allocation: 18 cores active / 32 cores total (56% utilization)

#### **3.3 Data Flow (Sensor → AI → Action)**
- Complete data flow diagram with timing:
  - T=0ms: Camera frame acquisition
  - T=4ms: Network path (camera → Cat9300 → Cat9500 → edge AI)
  - T=34ms: AI processing complete (pre-process + GPU + post-process + decision)
  - T=134ms: Multi-source validation complete (4 parallel API calls)
  - T=214ms: Automated actions complete (4 parallel actions)
  - T=500ms: Supervisor receives mobile notification
- Bandwidth analysis:
  - Inbound: 900 Mbps camera streams (4.5% of 20 Gbps capacity)
  - Outbound: 50 Mbps API calls (0.25% of 20 Gbps capacity)
  - Peak burst handling: 1,150 Mbps (5.75% utilization)

#### **3.4 Multi-Site Synchronization**
- Two-site deployment model: Mumbai + Chennai (independent operation)
- Site independence: Each site operates autonomously during WAN/Internet failures
- Model synchronization: Blue-green deployment with zero downtime updates
- Configuration synchronization: GitOps model (FluxCD) with 5-minute reconciliation
- Update frequency: Quarterly major updates, monthly minor updates, as-needed patches

#### **3.5 High Availability & Failover**
- VRRP failover architecture: Primary/standby nodes per site
- RTO: <30 seconds (15-sec detection + 5-sec VIP migration + 10-sec container restart)
- Heartbeat: 5-second interval over 25G midplane fabric
- Data loss: Minimal (in-flight detections only, event log preserved)

---

### **Supporting Documents**

#### **Complete Integration Architecture**
- 5-layer architecture diagram with complete data flow
- 500ms detection timeline with millisecond precision
- Complete API specifications for all 8 integration points:
  - ISE pxGrid (WebSocket, 50ms)
  - Splunk MLTK (HTTPS REST, 100ms)
  - ThousandEyes (HTTPS REST, 80ms)
  - AppDynamics (HTTPS REST, 90ms)
  - FTD Firewall (HTTPS REST, 50ms)
  - XDR SecureX (HTTPS REST, 40ms)
  - ServiceNow (HTTPS REST, 60ms)
  - Webex Teams (HTTPS REST, 80ms)
  - BMS Honeywell (HTTPS REST, 500ms)
- Request/response JSON examples for all APIs
- Bandwidth analysis: 1,010 Mbps total (5% utilization)

#### **Hardware Revision Summary**
- Complete hardware specification for the Cisco Unified Edge platform (UCS XE9305 + UCS XE130c M8)
- Before/after comparisons for every section

---

## Technical Specifications - Final

### **Hardware Platform (Cisco Unified Edge)**

**UCS XE9305 Chassis:**
- Form factor: 3 RU short-depth (18" / 457mm)
- Compute slots: 5 front-accessible (2 used, 3 reserved for Phase 5)
- Embedded networking: 2× Unified Edge Management Controllers with 25G Ethernet fabric
- Power: Dual redundant PSU (2× 1,000W, N+1), 700W actual consumption (2 nodes)
- Cooling: 5× hot-swappable fan modules (N+1), 60dB acoustically optimized
- Location: IDF Room, Floor 3 (co-located with Catalyst switches)
- Management: Cisco Intersight Infrastructure Service (SaaS, cloud-based)

**UCS XE130c M8 Compute Node (Per Node):**
- CPU: Intel Xeon 6 SoC (32 cores, 2.6 GHz base, 4.0 GHz turbo, 185W TDP)
- RAM: 128GB DDR5-4800 (4× 32GB DIMMs, ECC)
- GPU: NVIDIA L4 24GB GDDR6 (PCIe Gen5 slot, 72W TDP, 120 TOPS INT8 inference)
- Storage: Dual M.2 SATA 512GB RAID 1 (boot) + 2× E3.S NVMe 1TB (event buffer)
- Networking: 2× 25G midplane (chassis fabric) + 2× 10G SFP+ front-panel (LACP to Cat9500)
- Power: 350W per node average
- OS: Ubuntu 24.04 LTS, Docker 26.0, K3s, ONNX Runtime with TensorRT

**Deployment:**
- Mumbai: 2× UCS XE130c M8 nodes (Slots 1-2, primary + standby)
- Chennai: 2× UCS XE130c M8 nodes (Slots 1-2, primary + standby)
- Total: 4 compute nodes across 2 sites

### **Camera Infrastructure**

**Per Site (135 Cameras Total):**
- 65× Axis P3715-PLVE (Indoor Fixed, 360° panoramic, 6 Mbps avg, PoE+ 25W)
- 40× Axis Q6215-LE (Outdoor PTZ, 1080p 32× zoom, 8 Mbps avg, PoE+ 30W)
- 20× Axis P1455-LE (4K LPR, license plate recognition, 10 Mbps avg, PoE+ 30W)
- 10× FLIR A310f (Thermal, 320×240 thermal, 2 Mbps avg, PoE 15W)

**Total Deployment (Both Sites):**
- 270 cameras (135 Mumbai + 135 Chennai)
- 1,920 Mbps aggregate bandwidth (960 Mbps per site)
- 6,000W PoE consumption (3,000W per site)

### **Network Infrastructure**

**Access Layer:**
- 6× Catalyst 9300-48U per site (12 switches total)
- 48× 1G PoE+ ports, 1,100W PoE budget per switch
- 4× 10G SFP+ uplinks (LAG to distribution)
- 20 cameras per switch (160 Mbps, 505W PoE = 46% utilization)

**Distribution Layer:**
- 1× Catalyst 9500-40X per site (2 switches total)
- 40× 10G SFP+ ports (400 Gbps total capacity per switch)
- 2× 10G LAG per edge AI node (20 Gbps per node)
- 6× 40G LAG to access switches (240 Gbps aggregate)
- 2× 10G WAN uplinks (observability APIs)
- Utilization: 0.25% (1,018 Mbps / 400 Gbps)

### **GPU/CPU Utilization**

**NVIDIA L4 GPU (24GB per node):**
- UC1 (Security): 55-60% GPU, 18 GB memory
- UC2 (Building): 15-20% GPU, 850 MB memory (reuses UC1 YOLO model)
- UC3 (Safety): 10-15% GPU, 4.3 GB memory
- **Combined: 80-95% GPU utilization, 23.15 GB / 24 GB memory (96%)**
- Thermal: 65-72°C (within 0-90°C NVIDIA L4 spec)
- Power: 70-72W (within 72W TDP envelope)

**Intel Xeon 6 SoC CPU (32 cores per node):**
- Pre-processing: 8 cores (H.265 decode, resize, normalize)
- Post-processing: 6 cores (NMS, zone validation, decision logic)
- Thermal processing: 2 cores (UC3 fire/smoke detection, CPU-only)
- API clients: 4 cores (ISE, Splunk, TE, AppD, BMS, FTD API calls)
- Kubernetes + system: 12 cores (K3s control plane, container runtime, OS)
- **Combined: 18 cores active / 32 cores total (56% utilization)**
- Peak: 85% during business hours (all use cases active)

### **Network Latency Breakdown**

**Camera to Edge AI (4ms total):**
- Camera → Catalyst 9300 (access): 1ms (1G Ethernet)
- Catalyst 9300 → Catalyst 9500 (distribution): 1ms (10G fiber LAG)
- Catalyst 9500 → UCS XE130c M8 (edge AI): 2ms (10G fiber LAG)

**AI Processing (30ms total):**
- Pre-processing (CPU): 5ms
- GPU inference (NVIDIA L4): 20ms
- Post-processing (CPU): 3ms
- Decision logic (CPU): 2ms

**Multi-Source Validation (100ms parallel):**
- ISE pxGrid (Mumbai DC): 50ms
- Splunk MLTK (NJ DC): 100ms (longest pole)
- ThousandEyes (SaaS): 80ms
- AppDynamics (SaaS): 90ms

**Automated Actions (80ms parallel):**
- FTD Firewall: 50ms
- XDR SecureX: 40ms
- ServiceNow: 60ms
- Webex Teams: 80ms (longest pole)

**Total End-to-End: 4ms + 30ms + 100ms + 80ms = 214ms minimum, 500ms typical (including BMS/FTD actuation + Webex push delivery)**
