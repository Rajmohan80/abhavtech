# Edge AI Platform Architecture

## Overview

Chapter 2 documented three integrated use cases (Security, Building Automation, Safety) demonstrating WHAT the edge AI platform delivers. Chapter 3 explains HOW the platform works - the technical architecture, AI model pipeline, data processing flow, and multi-site deployment model that enables real-time intelligent decision-making at the network edge.

**Architectural Philosophy:**

Abhavtech's edge AI platform is built on **Cisco Unified Edge** - purpose-built hardware designed for distributed AI workloads. Unlike traditional centralized cloud AI (video streams to datacenter) or generic edge servers (repurposed datacenter hardware), Cisco Unified Edge delivers:

- **Co-located Processing:** Edge AI nodes in IDF Room Floor 3 (same room as Catalyst switches, 4ms latency)
- **Purpose-Built Hardware:** UCS XE9305 chassis optimized for edge environments (short-depth, low-power, acoustically optimized)
- **Unified Management:** Cisco Intersight SaaS platform manages compute, network, and AI workloads from single console
- **Standards-Based:** Kubernetes orchestration, ONNX model format, standard REST APIs (portable, vendor-neutral)

**Key Differentiator:**

Edge AI + Observability Fusion - AI inference at the edge correlates with centralized observability platforms (ISE, Splunk, ThousandEyes, AppDynamics) to achieve high-confidence automated decisions that traditional edge AI cannot deliver alone.

---

## 3.1 MULTI-LAYER ARCHITECTURE

The edge AI platform consists of five logical layers, each with distinct responsibilities:

```
┌─────────────────────────────────────────────────────────────┐
│ LAYER 5: OBSERVABILITY & INTEGRATION                         │
│ (Centralized Platforms - Mumbai DC, NJ DC, Cloud SaaS)      │
├─────────────────────────────────────────────────────────────┤
│ ISE pxGrid          │ Splunk MLTK      │ ThousandEyes       │
│ Badge Events        │ Historical ML    │ Network Monitoring │
│ SGT Enforcement     │ Pattern Analysis │ Path Visualization │
│ Location: MUM DC    │ Location: NJ DC  │ Location: SaaS     │
│ Latency: 50ms       │ Latency: 100ms   │ Latency: 80ms      │
├─────────────────────┼──────────────────┼────────────────────┤
│ AppDynamics         │ BMS Honeywell    │ FTD Firewall       │
│ Application Health  │ HVAC/Fire Alarm  │ Network Blocking   │
│ Location: SaaS      │ Location: MUM DC │ Location: MUM DC   │
│ Latency: 90ms       │ Latency: 50ms    │ Latency: 50ms      │
└─────────────────────────────────────────────────────────────┘
                            ↑ HTTPS REST APIs
┌─────────────────────────────────────────────────────────────┐
│ LAYER 4: EDGE AI COMPUTE                                     │
│ (UCS XE9305 + XE130c M8 - IDF Room Floor 3)                 │
├─────────────────────────────────────────────────────────────┤
│ Compute Nodes:                                                │
│ ├─ edge-ai-mumbai-01 (Slot 1, Primary, VRRP Active)         │
│ │   ├─ IP: 10.150.1.10 (management), 10.150.1.1 (VRRP VIP) │
│ │   ├─ GPU: NVIDIA L4 24GB @ 80-95% utilization             │
│ │   ├─ CPU: Intel Xeon 6 SoC, 32 cores @ 56% utilization    │
│ │   └─ Memory: 128GB DDR5 @ 65% utilization                 │
│ └─ edge-ai-mumbai-02 (Slot 2, Standby, VRRP Standby)        │
│     └─ Hot standby: <30 sec RTO (VRRP failover)             │
│                                                               │
│ AI Models (GPU):                                              │
│ ├─ YOLO v8n Person Detection (shared UC1/UC2/UC3)           │
│ ├─ DeepSORT Object Tracking (UC1)                           │
│ ├─ PPE CNN Classification (UC1, UC3)                        │
│ ├─ LPR Pipeline: YOLO + CNN + OCR (UC1)                     │
│ └─ OpenPose Pose Estimation (UC3)                            │
│                                                               │
│ Thermal Processing (CPU):                                     │
│ └─ Thermal Anomaly Detection (UC3, OpenCV/NumPy)            │
│                                                               │
│ Orchestration: K3s (lightweight Kubernetes)                  │
│ Management: Cisco Intersight (SaaS, cloud-based)             │
│ Storage: 2TB NVMe (event buffer, 10-sec video clips)        │
└─────────────────────────────────────────────────────────────┘
                            ↑ 2× 10G SFP+ LAG (20 Gbps)
┌─────────────────────────────────────────────────────────────┐
│ LAYER 3: DISTRIBUTION NETWORK                                │
│ (Catalyst 9500-40X - IDF Room Floor 3)                      │
├─────────────────────────────────────────────────────────────┤
│ Catalyst 9500-40X Distribution Switch:                       │
│ ├─ 40× 10G SFP+ ports (400 Gbps total capacity)             │
│ ├─ Uplinks to Edge AI: 2× 10G LAG per node (20 Gbps each)  │
│ ├─ Downlinks from Access: 6× 40G LAG (240 Gbps aggregate)  │
│ ├─ WAN Uplinks: 2× 10G to core router (observability APIs)  │
│ ├─ Routing: OSPF Area 0 (internal), BGP AS 65000 (WAN)     │
│ └─ Security: SGT enforcement (SGT-70 cameras → SGT-95 AI)  │
│                                                               │
│ Bandwidth Utilization:                                        │
│ ├─ Inbound (cameras): 960 Mbps / 400 Gbps = 0.24%          │
│ ├─ Outbound (APIs): 58 Mbps / 400 Gbps = 0.01%             │
│ └─ Total: 1,018 Mbps / 400 Gbps = 0.25% utilization        │
└─────────────────────────────────────────────────────────────┘
                            ↑ 4× 10G LAG per access switch
┌─────────────────────────────────────────────────────────────┐
│ LAYER 2: ACCESS NETWORK                                      │
│ (6× Catalyst 9300-48U - Distributed Across Floors)          │
├─────────────────────────────────────────────────────────────┤
│ Catalyst 9300-48U Access Switches:                           │
│ ├─ 48× 1G PoE+ ports (48 Gbps total per switch)            │
│ ├─ PoE Budget: 1,100W per switch (505W utilized = 46%)     │
│ ├─ Cameras per Switch: 20 cameras (160 Mbps per switch)    │
│ ├─ Uplinks: 4× 10G SFP+ LAG to distribution (40 Gbps)      │
│ └─ Security: 802.1X + MAB, SGT tagging (SGT-70 cameras)    │
│                                                               │
│ Switch Distribution:                                          │
│ ├─ Floor 1-7: 1 switch per floor (7 switches)              │
│ ├─ Ground Floor: 2 switches (high camera density)           │
│ └─ Outdoor Perimeter: Daisy-chained to nearest floor        │
└─────────────────────────────────────────────────────────────┘
                            ↑ 1G Ethernet + PoE+
┌─────────────────────────────────────────────────────────────┐
│ LAYER 1: CAMERA & SENSOR LAYER                               │
│ (135 Cameras per Site - Mumbai/Chennai)                      │
├─────────────────────────────────────────────────────────────┤
│ 65× Axis P3715-PLVE (Indoor Fixed):                         │
│ ├─ 360° panoramic, 4× 1080p sensors, H.265, 6 Mbps avg     │
│ ├─ PoE+ 25W, 10m IR range, ceiling mount                    │
│ └─ RTSP: rtsp://10.150.X.X:554/axis-media/media.amp         │
│                                                               │
│ 40× Axis Q6215-LE (Outdoor PTZ):                            │
│ ├─ 1080p 30 FPS, 32× optical zoom, 8 Mbps avg              │
│ ├─ PoE+ 30W, 200m IR, IP66 weatherproof                     │
│ └─ PTZ: 256 presets, automated patrol (8 presets/60 sec)   │
│                                                               │
│ 20× Axis P1455-LE (4K LPR):                                 │
│ ├─ 4K (3840×2160) 30 FPS, H.265, 10 Mbps avg               │
│ ├─ PoE+ 30W, 940nm covert IR, gantry mount                  │
│ └─ LPR: 3-15m optimal distance, single lane                 │
│                                                               │
│ 10× FLIR A310f (Thermal):                                   │
│ ├─ 320×240 thermal pixels, 9 FPS, 2 Mbps avg               │
│ ├─ PoE 15W (standard, NOT PoE+), -20°C to +350°C range     │
│ └─ Thermal RTSP: rtsp://10.150.8.X:554/thermal/media.amp   │
│                                                               │
│ Total Bandwidth: 960 Mbps (960 cameras × avg bitrate)       │
│ Total Power: 3,000W PoE (distributed across 6 switches)     │
│ Network: VLAN 150 (VN_IOT), SGT-70 (Cameras)                │
└─────────────────────────────────────────────────────────────┘
```

**Layer Responsibilities:**

| Layer | Responsibility | Latency Contribution | Criticality |
|-------|---------------|---------------------|-------------|
| **Layer 1 (Cameras)** | Video acquisition, encoding, RTSP streaming | 0ms (baseline) | High - source of truth |
| **Layer 2 (Access)** | PoE delivery, VLAN isolation, SGT tagging | 1ms (switch forwarding) | High - camera power/connectivity |
| **Layer 3 (Distribution)** | Aggregation, routing, WAN connectivity | 1ms (L3 routing) | Critical - single point of failure |
| **Layer 4 (Edge AI)** | AI inference, decision logic, local storage | 30ms (pre-process + GPU + post-process) | Critical - intelligence layer |
| **Layer 5 (Observability)** | Multi-source validation, automated actions | 100ms (parallel API calls) | Medium - enhances confidence |

**Total End-to-End Latency:** 2ms (network) + 30ms (AI processing) + 100ms (validation) + 100ms (actions) = **232ms minimum**, **500ms typical** (including BMS/FTD actuation delays)

---

## 3.2 AI MODEL PIPELINE

The AI model pipeline transforms raw video frames into actionable intelligence through a multi-stage processing architecture:

### 3.2.1 Model Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ MODEL REGISTRY (Cisco Container Registry or Harbor)         │
├─────────────────────────────────────────────────────────────┤
│ ONNX Models:                                                  │
│ ├─ yolo-v8n-person-int8.onnx (6.2 MB, UC1/UC2/UC3)         │
│ ├─ deepsort-tracking-fp16.onnx (12 MB, UC1)                │
│ ├─ ppe-classifier-int8.onnx (2.3 MB, UC1/UC3)              │
│ ├─ lpr-ocr-fp16.onnx (8.5 MB, UC1)                         │
│ └─ openpose-fp16.onnx (25 MB, UC3)                          │
│                                                               │
│ Version Control: Semantic versioning (v1.2.3)                │
│ Rollback: Blue-green deployment (zero downtime)              │
│ Validation: Test dataset accuracy >90% required              │
└─────────────────────────────────────────────────────────────┘
                            ↓ K3s Pull
┌─────────────────────────────────────────────────────────────┐
│ KUBERNETES ORCHESTRATION (K3s on UCS XE130c M8)             │
├─────────────────────────────────────────────────────────────┤
│ Namespaces:                                                   │
│ ├─ uc1-security (6 pods: perimeter, loitering, etc.)       │
│ ├─ uc2-building (3 pods: occupancy, BMS integration)       │
│ ├─ uc3-safety (3 pods: PPE, fire, slip/fall)               │
│ └─ observability (4 pods: ISE, Splunk, TE, AppD clients)   │
│                                                               │
│ Resource Limits (per pod):                                   │
│ ├─ GPU: 0.1-0.3 GPU shares (Kubernetes GPU sharing)         │
│ ├─ CPU: 2-4 cores (Intel Xeon 6 SoC)                        │
│ ├─ Memory: 4-8 GB RAM                                        │
│ └─ Storage: 10-50 GB NVMe (event buffer)                    │
│                                                               │
│ Scaling:                                                      │
│ ├─ Horizontal: Auto-scale pods based on GPU utilization     │
│ └─ Vertical: Fixed (single node, cannot scale vertically)   │
└─────────────────────────────────────────────────────────────┘
                            ↓ Container Runtime
┌─────────────────────────────────────────────────────────────┐
│ INFERENCE RUNTIME (ONNX Runtime + TensorRT)                 │
├─────────────────────────────────────────────────────────────┤
│ NVIDIA L4 GPU (24GB GDDR6, 120 TOPS INT8):                  │
│ ├─ TensorRT Optimization Engine                             │
│ │   ├─ INT8 Quantization: 4× speedup, <1% accuracy loss    │
│ │   ├─ Kernel Fusion: Reduce memory bandwidth              │
│ │   └─ Layer Precision: FP16 for pose, INT8 for detection  │
│ ├─ CUDA 12.3 (GPU driver)                                   │
│ └─ ONNX Runtime 1.16 (inference framework)                  │
│                                                               │
│ CPU Fallback (Intel Xeon 6 SoC, 32 cores):                  │
│ └─ Thermal processing, pre/post-processing, decision logic  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2.2 Inference Pipeline (Frame-by-Frame)

**Example: UC1 Perimeter Intrusion Detection**

```
FRAME N (Time T=0ms):

Camera 47 → RTSP Stream → Edge AI Node (10.150.1.1 VRRP VIP)

┌─────────────────────────────────────────────────────────────┐
│ STAGE 1: PRE-PROCESSING (CPU, 5ms)                          │
├─────────────────────────────────────────────────────────────┤
│ Input: 1920×1080 RGB frame (H.265 decoded)                  │
│ Operations:                                                   │
│ ├─ Resize: 1920×1080 → 640×640 (letterbox padding)         │
│ ├─ Normalize: [0-255] → [0-1] float32                      │
│ ├─ Colorspace: BGR → RGB                                    │
│ ├─ Transpose: HWC → CHW (channels-first)                   │
│ └─ Batch: Add dimension (1, 3, 640, 640)                   │
│ Output: 640×640×3 tensor (preprocessed for YOLO)            │
│ CPU Load: 2 cores @ 100% (parallel with other frames)       │
└─────────────────────────────────────────────────────────────┘
                            ↓ GPU Memory Transfer (PCIe Gen5)
┌─────────────────────────────────────────────────────────────┐
│ STAGE 2: GPU INFERENCE (NVIDIA L4, 20ms)                    │
├─────────────────────────────────────────────────────────────┤
│ Model: YOLO v8n (INT8 quantized, 6.2 MB)                    │
│ Input: 640×640×3 tensor (GPU memory)                         │
│ Operations:                                                   │
│ ├─ Backbone: Feature extraction (Conv + Batch Norm + ReLU) │
│ ├─ Neck: Feature Pyramid Network (FPN)                      │
│ └─ Head: Bounding box regression + class prediction         │
│ Output: [N, 85] tensor (N detections × [x,y,w,h + 80 cls + conf]) │
│ GPU Utilization: 20ms @ 75% GPU (parallel with 50 streams)  │
│ GPU Memory: 1.2 GB VRAM (model + activations)               │
└─────────────────────────────────────────────────────────────┘
                            ↓ GPU → CPU Memory Transfer
┌─────────────────────────────────────────────────────────────┐
│ STAGE 3: POST-PROCESSING (CPU, 3ms)                         │
├─────────────────────────────────────────────────────────────┤
│ Input: Raw YOLO detections (N bounding boxes)                │
│ Operations:                                                   │
│ ├─ Non-Maximum Suppression (NMS):                           │
│ │   └─ Filter overlapping boxes (IoU threshold 0.45)       │
│ ├─ Confidence Filtering:                                     │
│ │   └─ Discard detections <70% confidence                  │
│ ├─ Zone Validation:                                          │
│ │   └─ Check bbox center within restricted zone polygon    │
│ └─ Class Filtering:                                          │
│     └─ Keep only "person" class (class_id = 0)             │
│ Output: Filtered detections [person @ (x,y,w,h), conf=0.96] │
│ CPU Load: 1 core @ 80% (NumPy operations)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STAGE 4: DECISION LOGIC (CPU, 2ms)                          │
├─────────────────────────────────────────────────────────────┤
│ Input: Filtered detection (person in restricted zone)        │
│ Operations:                                                   │
│ ├─ Duplicate Check:                                          │
│ │   └─ SELECT * FROM events WHERE camera_id=47 AND         │
│ │       timestamp > (NOW - 60 sec) LIMIT 1;                │
│ ├─ Result: No duplicate (new detection)                     │
│ └─ Decision: Proceed to multi-source validation             │
│ Output: Detection object + metadata                          │
│ Storage: Write to SQLite (event log)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STAGE 5: MULTI-SOURCE VALIDATION (Parallel, 100ms)          │
├─────────────────────────────────────────────────────────────┤
│ Launch 4 parallel HTTPS REST API calls:                      │
│ ├─ ISE pxGrid: Badge correlation (50ms)                     │
│ ├─ Splunk MLTK: Historical pattern validation (100ms)       │
│ ├─ ThousandEyes: Network path health (80ms)                 │
│ └─ AppDynamics: Application health (90ms)                    │
│ Wait for all responses: max(50, 100, 80, 90) = 100ms        │
│ Decision: HIGH CONFIDENCE (all 4 validations pass)          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STAGE 6: AUTOMATED ACTIONS (Parallel, 80ms)                 │
├─────────────────────────────────────────────────────────────┤
│ Execute 4 parallel actions:                                  │
│ ├─ FTD Firewall: Network blocking (50ms)                    │
│ ├─ XDR SecureX: Security incident (40ms)                    │
│ ├─ ServiceNow: Create ticket (60ms)                         │
│ └─ Webex Teams: Mobile alert (80ms)                         │
│ Wait for all completions: max(50, 40, 60, 80) = 80ms        │
│ Total Actions Time: 80ms                                     │
└─────────────────────────────────────────────────────────────┘

TOTAL PIPELINE LATENCY: 5ms + 20ms + 3ms + 2ms + 100ms + 80ms = 210ms
(Actual end-to-end: ~500ms including network propagation delays)
```

### 3.2.3 Model Resource Allocation

**GPU Memory Layout (NVIDIA L4 24GB):**

```
┌─────────────────────────────────────────────────────────────┐
│ NVIDIA L4 GPU Memory Map (24GB Total)                        │
├─────────────────────────────────────────────────────────────┤
│ UC1 Models (18 GB):                                          │
│ ├─ YOLO v8n weights: 1.2 GB (shared with UC2/UC3)          │
│ ├─ YOLO activations: 8 GB (50 parallel streams × 160 MB)   │
│ ├─ DeepSORT tracker: 4 GB (tracking state for 500 objects) │
│ ├─ PPE classifier: 1.8 GB (weights + activations)          │
│ └─ LPR pipeline: 3 GB (YOLO + CNN + OCR models)            │
│                                                               │
│ UC2 Models (850 MB):                                         │
│ └─ YOLO v8n (REUSED from UC1, shared weights)              │
│     ├─ Additional activations: 850 MB (40 streams)          │
│     └─ No separate model loading (memory efficient)         │
│                                                               │
│ UC3 Models (4.3 GB):                                         │
│ ├─ YOLO v8n + PPE: 1.8 GB (reuses YOLO, adds PPE head)    │
│ └─ OpenPose: 2.5 GB (FP16 precision, pose estimation)      │
│                                                               │
│ System Reserved (850 MB):                                    │
│ └─ CUDA runtime, TensorRT engine cache                      │
│                                                               │
│ TOTAL: 23.15 GB / 24 GB (96% utilization)                   │
│ Available: 850 MB (headroom for spikes)                     │
└─────────────────────────────────────────────────────────────┘
```

**CPU Core Allocation (Intel Xeon 6 SoC, 32 cores):**

```
┌─────────────────────────────────────────────────────────────┐
│ CPU Core Assignment (32 Total Cores)                         │
├─────────────────────────────────────────────────────────────┤
│ Pre-Processing Pool (8 cores):                               │
│ ├─ Decode H.265 streams (4 cores)                           │
│ ├─ Resize/normalize frames (3 cores)                        │
│ └─ Colorspace conversion (1 core)                           │
│                                                               │
│ Post-Processing Pool (6 cores):                              │
│ ├─ NMS filtering (2 cores)                                  │
│ ├─ Zone validation (2 cores)                                │
│ └─ Decision logic (2 cores)                                 │
│                                                               │
│ Thermal Processing (2 cores):                                │
│ └─ UC3 thermal anomaly detection (CPU-only, no GPU)         │
│                                                               │
│ API Client Pool (4 cores):                                   │
│ └─ ISE, Splunk, TE, AppD, BMS, FTD API calls               │
│                                                               │
│ Kubernetes + System (12 cores):                              │
│ ├─ K3s control plane (4 cores)                              │
│ ├─ Container runtime (4 cores)                              │
│ └─ OS + system services (4 cores)                           │
│                                                               │
│ TOTAL: 32 cores @ 56% average utilization                   │
│ Peak: 85% (business hours, all use cases active)            │
└─────────────────────────────────────────────────────────────┘
```

---

## 3.3 DATA FLOW (SENSOR → AI → ACTION)

### 3.3.1 Complete Data Flow Diagram

```
TIME: T=0ms (Detection Event Begins)

SENSOR LAYER (Camera 47, Loading Dock Perimeter)
  ├─ Video Frame: 1920×1080 @ 30 FPS, H.265
  ├─ Bitrate: 8.2 Mbps (current frame, high motion)
  ├─ RTSP URL: rtsp://10.150.5.47:554/axis-media/media.amp
  ├─ Network: VLAN 150, SGT-70 (Cameras)
  └─ Stream to: 10.150.1.1 (VRRP VIP, edge AI load-balanced)
                            ↓ 1ms (1G Ethernet)
ACCESS LAYER (Catalyst 9300-48U, Port 20)
  ├─ Receive: 1G Ethernet frame (camera → switch)
  ├─ PoE Delivery: 30W (PTZ motors active)
  ├─ VLAN: 150 (VN_IOT)
  ├─ SGT: Tag with SGT-70 (Cameras)
  ├─ SGACL: Permit SGT-70 → SGT-95 (cameras to edge AI)
  └─ Forward to: Catalyst 9500 (4× 10G LAG uplink)
                            ↓ 1ms (10G Fiber)
DISTRIBUTION LAYER (Catalyst 9500-40X)
  ├─ Receive: 10G Ethernet frame (access → distribution)
  ├─ Routing: L3 lookup (10.150.5.47 → 10.150.1.1)
  ├─ SGT: Enforce SGACL (SGT-70 permitted to SGT-95)
  ├─ Load Balance: ECMP/LAG to edge-ai-mumbai-01
  └─ Forward to: 10.150.1.1 (VRRP VIP, active node)
                            ↓ 2ms (10G Fiber, IDF Room)
EDGE AI LAYER (UCS XE130c M8, edge-ai-mumbai-01)
  ├─ VRRP: VIP 10.150.1.1 active on node 01
  ├─ K3s: Route to uc1-security namespace
  ├─ Container: perimeter-intrusion-detection pod
  ├─ RTSP: Decode H.265 stream → 1920×1080 RGB frame
  └─ Pipeline: Pre-process → GPU → Post-process → Decide
                            ↓ 30ms (AI processing)
DECISION LAYER (Edge AI Node, Application Logic)
  ├─ Detection: Person in restricted zone (confidence 0.96)
  ├─ Duplicate Check: SQLite (no duplicate last 60 sec)
  ├─ Decision: Proceed to multi-source validation
  └─ Launch: 4 parallel API calls
                            ↓ 100ms (parallel validation)
OBSERVABILITY LAYER (Multi-Source Validation)
  ├─ ISE pxGrid (Mumbai DC, 50ms): 0 badge swipes → UNAUTHORIZED
  ├─ Splunk MLTK (NJ DC, 100ms): Occupancy 5× expected → ANOMALOUS
  ├─ ThousandEyes (SaaS, 80ms): 0% loss, 12ms latency → NETWORK HEALTHY
  └─ AppDynamics (SaaS, 90ms): 0% errors → APPLICATION HEALTHY
                            ↓
  Decision: HIGH CONFIDENCE (all 4 validations pass)
                            ↓ 80ms (parallel actions)
ACTION LAYER (Automated Response)
  ├─ FTD Firewall (Mumbai DC, 50ms): Block VLAN 150 → Corporate (30 min rule)
  ├─ XDR SecureX (SaaS, 40ms): Create incident #incident-2025-0147
  ├─ ServiceNow (SaaS, 60ms): Create ticket INC0012345 with video snapshot
  └─ Webex Teams (SaaS, 80ms): Mobile push notification to supervisor
                            ↓
  Outcome: Supervisor receives mobile alert
  Total Latency: 0 + 4ms (network) + 30ms (AI) + 100ms (validation) + 80ms (actions) = 214ms

ACTUAL END-TO-END: ~500ms (includes FTD rule propagation + Webex push delivery)
```

### 3.3.2 Data Flow Bandwidth Analysis

**Inbound Traffic (Cameras → Edge AI):**

```
120 Cameras Total:
  ├─ 60× Indoor Fixed: 60 × 6 Mbps = 360 Mbps
  ├─ 40× Outdoor PTZ: 40 × 8 Mbps = 320 Mbps
  ├─ 20× 4K LPR: 20 × 10 Mbps = 200 Mbps
  └─ 10× Thermal: 10 × 2 Mbps = 20 Mbps
  TOTAL: 900 Mbps inbound

Network Capacity: 20 Gbps (2× 10G LAG to edge AI)
Utilization: 900 Mbps / 20 Gbps = 4.5%

Peak Burst Handling:
  ├─ Assume 50% cameras burst to max bitrate simultaneously
  ├─ Indoor: 60 × 8 Mbps = 480 Mbps (vs 360 Mbps avg)
  ├─ Outdoor: 40 × 10 Mbps = 400 Mbps (vs 320 Mbps avg)
  ├─ LPR: 20 × 12 Mbps = 240 Mbps (vs 200 Mbps avg)
  ├─ Thermal: 10 × 3 Mbps = 30 Mbps (vs 20 Mbps avg)
  └─ PEAK: 1,150 Mbps / 20 Gbps = 5.75% (still well within capacity)
```

**Outbound Traffic (Edge AI → Observability/Actions):**

```
API Calls (Outbound):
  ├─ ISE pxGrid: 5 Mbps (WebSocket subscriptions + periodic queries)
  ├─ Splunk MLTK: 15 Mbps (search results, historical data)
  ├─ ThousandEyes: 10 Mbps (network path metrics)
  ├─ AppDynamics: 10 Mbps (application metrics)
  ├─ BMS Honeywell: 1 Mbps (HVAC control commands)
  ├─ FTD Firewall: 2 Mbps (ACL create/delete operations)
  ├─ XDR SecureX: 2 Mbps (incident creation)
  ├─ ServiceNow: 3 Mbps (ticket creation + attachments)
  └─ Webex Teams: 2 Mbps (mobile push notifications)
  TOTAL: 50 Mbps outbound

Network Capacity: 20 Gbps (2× 10G LAG)
Utilization: 50 Mbps / 20 Gbps = 0.25%

Note: Outbound traffic minimal because:
  ├─ No video egress to cloud (privacy-preserving edge AI)
  ├─ Only metadata + small video snapshots (10-sec clips)
  └─ API calls lightweight (JSON payloads, <10 KB each)
```

---

## 3.4 MULTI-SITE SYNCHRONIZATION

### 3.4.1 Deployment Model

**Two-Site Deployment (Mumbai + Chennai Hubs):**

```
┌─────────────────────────────────────────────────────────────┐
│ MUMBAI HUB (Primary Site)                                    │
├─────────────────────────────────────────────────────────────┤
│ Edge AI Nodes:                                                │
│ ├─ edge-ai-mumbai-01 (10.150.1.10, Slot 1, Primary)        │
│ └─ edge-ai-mumbai-02 (10.150.1.11, Slot 2, Standby)        │
│ Cameras: 135 cameras (same as Chennai)                       │
│ Network: Catalyst 9300/9500 (IDF Room Floor 3)              │
│ Observability: ISE + BMS local (Mumbai DC)                   │
│ WAN: 10 Gbps MPLS to NJ DC (Splunk MLTK)                    │
│ Internet: 1 Gbps DIA (TE, AppD, XDR, ServiceNow, Webex)    │
└─────────────────────────────────────────────────────────────┘
                            ↕ WAN (MPLS + Internet)
┌─────────────────────────────────────────────────────────────┐
│ CHENNAI HUB (Secondary Site)                                 │
├─────────────────────────────────────────────────────────────┤
│ Edge AI Nodes:                                                │
│ ├─ edge-ai-chennai-01 (10.155.1.10, Slot 1, Primary)       │
│ └─ edge-ai-chennai-02 (10.155.1.11, Slot 2, Standby)       │
│ Cameras: 135 cameras (identical deployment to Mumbai)        │
│ Network: Catalyst 9300/9500 (IDF Room Floor 3)              │
│ Observability: ISE + BMS local (Chennai DC)                  │
│ WAN: 10 Gbps MPLS to NJ DC (Splunk MLTK)                    │
│ Internet: 1 Gbps DIA (TE, AppD, XDR, ServiceNow, Webex)    │
└─────────────────────────────────────────────────────────────┘
```

**Site Independence:**

```
CRITICAL DESIGN PRINCIPLE: Sites operate independently.

Mumbai Site Failure Scenario:
  ├─ Chennai site: CONTINUES OPERATING (no impact)
  ├─ Mumbai cameras: Still stream to edge-ai-mumbai-02 (standby node)
  ├─ Mumbai observability: ISE + BMS still available (local Mumbai DC)
  └─ Only Splunk MLTK unavailable (NJ DC via WAN)
      └─ Fallback: Operate without Splunk validation (lower confidence decisions)

Chennai Site Failure Scenario:
  ├─ Mumbai site: CONTINUES OPERATING (no impact)
  └─ Same independence as above

WAN Failure Scenario (MPLS to NJ DC down):
  ├─ Both sites: Continue operating with local observability (ISE, BMS)
  ├─ Splunk MLTK: Unavailable (NJ DC unreachable)
  ├─ Fallback: Operate without Splunk historical validation
  └─ Impact: Reduced confidence (3 of 4 validations instead of 4 of 4)

Internet Failure Scenario (DIA circuit down):
  ├─ ThousandEyes, AppDynamics, XDR, ServiceNow, Webex: Unavailable
  ├─ Critical functions: Still work (local ISE badge, BMS HVAC, FTD firewall)
  └─ Impact: No supervisor mobile alerts (Webex), no cloud incident tracking
```

### 3.4.2 Model Synchronization

**AI Model Updates (Centralized Push Model):**

```
┌─────────────────────────────────────────────────────────────┐
│ CENTRALIZED MODEL REGISTRY (Harbor, Mumbai DC)               │
├─────────────────────────────────────────────────────────────┤
│ ML Engineer Updates Model:                                    │
│ ├─ Train new YOLO v8n version on updated dataset            │
│ ├─ Validate accuracy >90% on hold-out test set              │
│ ├─ Convert to ONNX + TensorRT INT8 quantization             │
│ ├─ Push to registry: yolo-v8n-person-int8:v1.3.0           │
│ └─ Tag as "production-ready"                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓ Kubernetes Pull (Automated)
┌─────────────────────────────────────────────────────────────┐
│ EDGE AI NODES (Mumbai + Chennai, Independent)                │
├─────────────────────────────────────────────────────────────┤
│ K3s Auto-Update (Blue-Green Deployment):                     │
│ ├─ Step 1: Pull new model v1.3.0 to standby node           │
│ │   └─ edge-ai-mumbai-02 downloads model (no traffic)      │
│ ├─ Step 2: Validate model on standby (10 min test)         │
│ │   └─ Run test dataset, verify accuracy >90%              │
│ ├─ Step 3: Switch VRRP VIP to standby node                 │
│ │   └─ 10.150.1.1 VIP: mumbai-01 → mumbai-02 (5 sec)      │
│ ├─ Step 4: Primary becomes new standby                      │
│ │   └─ edge-ai-mumbai-01 now standby, pulls v1.3.0        │
│ └─ Result: Zero downtime model update                       │
│                                                               │
│ Rollback Procedure (if model fails validation):             │
│ ├─ Standby node: Revert to v1.2.0 (previous version)       │
│ ├─ Alert: Notify ML engineer (model validation failed)      │
│ └─ Primary node: Continue running v1.2.0 (stable)          │
└─────────────────────────────────────────────────────────────┘

Model Version Control:
  ├─ Production: v1.2.0 (current stable)
  ├─ Staging: v1.3.0 (testing in progress)
  └─ Archive: v1.1.0, v1.0.0 (rollback available)

Update Frequency:
  ├─ Major updates: Quarterly (new model architecture)
  ├─ Minor updates: Monthly (dataset refresh, accuracy improvement)
  └─ Patch updates: As needed (bug fixes)
```

### 3.4.3 Configuration Synchronization

**Site-Specific Configuration (GitOps Model):**

```
┌─────────────────────────────────────────────────────────────┐
│ CONFIGURATION REPOSITORY (GitLab, Mumbai DC)                 │
├─────────────────────────────────────────────────────────────┤
│ Repository Structure:                                         │
│ ├─ config/                                                    │
│ │   ├─ mumbai/                                               │
│ │   │   ├─ cameras.yaml (135 camera IPs, zones)            │
│ │   │   ├─ zones.yaml (restricted zone polygons)           │
│ │   │   ├─ thresholds.yaml (confidence, duration)           │
│ │   │   └─ integrations.yaml (ISE, BMS, Splunk endpoints)  │
│ │   └─ chennai/ (identical structure)                       │
│ └─ models/                                                    │
│     └─ production.yaml (model versions per site)            │
└─────────────────────────────────────────────────────────────┘
                            ↓ Git Pull (Automated)
┌─────────────────────────────────────────────────────────────┐
│ EDGE AI NODES (FluxCD GitOps Operator)                       │
├─────────────────────────────────────────────────────────────┤
│ FluxCD reconciles configuration every 5 minutes:             │
│ ├─ Git pull: Fetch latest config from repository            │
│ ├─ Diff: Compare current vs desired state                   │
│ ├─ Apply: Update K3s ConfigMaps/Secrets                     │
│ └─ Reload: Graceful pod restart (rolling update)            │
│                                                               │
│ Example: Add new camera to Mumbai                            │
│ ├─ Engineer: Edit config/mumbai/cameras.yaml               │
│ │   └─ Add camera-136: IP 10.150.9.20, zone PPE-001        │
│ ├─ Git commit + push: Trigger GitLab CI pipeline           │
│ ├─ FluxCD: Detect change (next 5-min sync)                 │
│ └─ Edge AI: Reload camera list, start processing stream     │
│     └─ Downtime: 0 seconds (other cameras unaffected)      │
└─────────────────────────────────────────────────────────────┘

Configuration Validation:
  ├─ Pre-commit: Schema validation (YAML syntax, IP format)
  ├─ CI Pipeline: Integration test (connectivity to new camera)
  └─ Production: Gradual rollout (Mumbai first, Chennai 24h later)
```

---

## 3.5 HIGH AVAILABILITY & FAILOVER

**VRRP Failover Architecture:**

```
Normal Operation (edge-ai-mumbai-01 Primary):

VRRP VIP 10.150.1.1 → edge-ai-mumbai-01 (10.150.1.10)
  ├─ VRRP Priority: 200 (Primary)
  ├─ Heartbeat: 5-second interval over 25G midplane
  └─ Health Check: GPU utilization, K3s API, RTSP streams

edge-ai-mumbai-02 (10.150.1.11) Standby:
  ├─ VRRP Priority: 100 (Standby)
  ├─ Receives heartbeat: Every 5 seconds from Primary
  └─ Ready to take over: <30 seconds RTO

Failure Scenario (Primary Node Failure):

T=0 sec: edge-ai-mumbai-01 fails (power loss, hardware failure, GPU hang)
T=15 sec: Standby detects missing heartbeat (3 × 5-sec intervals)
T=15 sec: Standby promotes to Primary (VRRP priority 100 → 200)
T=20 sec: VRRP VIP 10.150.1.1 migrates to edge-ai-mumbai-02
T=30 sec: K3s containers restart on new Primary
T=30 sec: RTSP streams reconnect to 10.150.1.1 (now mumbai-02)

Impact:
  ├─ Detection gap: 15 seconds (no AI processing)
  ├─ VRRP failover: 5 seconds (VIP migration)
  ├─ K3s restart: 10 seconds (container startup)
  └─ TOTAL RTO: 30 seconds (camera → AI → action restored)

Data Loss:
  ├─ In-flight detections: Lost (last 15 seconds of processing)
  └─ Event log: Preserved (SQLite on shared NVMe storage)
```

---

*Chapter 3 has documented the technical architecture of Abhavtech's Cisco Unified Edge platform: multi-layer architecture, AI model pipeline, complete data flow (sensor → AI → action), and multi-site deployment model for Mumbai + Chennai hubs.*

**Key Topics Covered:**
- 5-layer architecture (Camera, Access, Distribution, Edge AI, Observability)
- AI model deployment (ONNX + TensorRT, Kubernetes orchestration)
- Complete inference pipeline (pre-process, GPU, post-process, validation, actions)
- GPU/CPU resource allocation (80-95% GPU, 56% CPU utilization)
- Data flow with latency breakdown (500ms end-to-end)
- Multi-site independence (Mumbai + Chennai operate autonomously)
- Model synchronization (blue-green deployment, zero downtime updates)
- High availability (VRRP failover, <30 sec RTO)

*Next: Wrap-up summary of all completed work*