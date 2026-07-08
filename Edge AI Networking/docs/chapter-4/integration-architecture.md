# Integration Architecture Specifications

## Edge AI + Network + Observability Platforms

This document provides the complete integration architecture showing how **Cisco Unified Edge (UCS XE9305 + XE130c M8)** integrates with:
1. Camera infrastructure (120 cameras per site)
2. Cisco network infrastructure (Catalyst 9300/9500, ISE, FTD)
3. AI observability platforms (Splunk MLTK, ThousandEyes, AppDynamics)
4. Security response systems (XDR, ServiceNow, Webex)

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 ABHAVTECH EDGE AI INTEGRATION ARCHITECTURE              │
│                    Mumbai & Chennai Hub Sites (Identical)               │
└─────────────────────────────────────────────────────────────────────────┘

PHYSICAL LAYER: Camera Infrastructure
┌──────────────────────────────────────────────────────────────────────┐
│ 120 Cameras per Site (Mumbai/Chennai)                                │
│ ├─ 60× Indoor Fixed (Axis P3715-PLVE): Hallways, conference rooms   │
│ ├─ 40× Outdoor PTZ (Axis Q6215-LE): Perimeter, 360° coverage        │
│ ├─ 20× 4K LPR (Axis P1455-LE): Vehicle entry/exit, parking          │
│ └─ 10× Thermal (FLIR A310f): Server room, electrical room fire      │
│                                                                       │
│ Configuration:                                                        │
│ ├─ VLAN: VN_IOT (150), IPs: 10.150.2.0/24 - 10.150.9.0/24          │
│ ├─ SGT: SGT-70 (Cameras) - assigned by ISE via 802.1X/MAC          │
│ ├─ Protocol: RTSP over TCP (port 554)                               │
│ ├─ Codec: H.265 (HEVC) adaptive bitrate 4-10 Mbps                  │
│ ├─ Power: PoE+ 802.3at (25-30W per camera)                         │
│ └─ Total Bandwidth: 120 cameras × 8 Mbps avg = 960 Mbps            │
└──────────────────────────────────────────────────────────────────────┘
                            ↓
                 1 Gbps Ethernet (PoE+ injection)
                            ↓
ACCESS LAYER: Catalyst 9300 Switches
┌──────────────────────────────────────────────────────────────────────┐
│ 6× Cisco Catalyst 9300-48U per Site                                  │
│ ├─ 48 ports × 1G RJ45 (PoE+, 1,100W budget per switch)             │
│ ├─ Camera distribution: 20 cameras per switch                       │
│ ├─ PoE consumption: 20 cameras × 25W = 500W (45% utilization)      │
│ ├─ Bandwidth per switch: 160 Mbps camera traffic                   │
│ ├─ SGACL enforcement: SGT-70→SGT-95 PERMIT, SGT-70→SGT-10 DENY    │
│ └─ Uplinks: 4× 10G SFP+ fiber (LAG) to Catalyst 9500               │
└──────────────────────────────────────────────────────────────────────┘
                            ↓
                 4× 10 Gbps Fiber (40 Gbps aggregate per switch)
                            ↓
DISTRIBUTION LAYER: Catalyst 9500 Switch
┌──────────────────────────────────────────────────────────────────────┐
│ 1× Cisco Catalyst 9500-40X per Site (IDF Room, Floor 3)             │
│ ├─ 40× 10G SFP+ ports (fiber)                                       │
│ ├─ Inter-VLAN routing: VN_IOT (150) → Edge AI                      │
│ ├─ Camera uplinks: 6 switches × 40 Gbps = 240 Gbps aggregate       │
│ ├─ Camera bandwidth: 960 Mbps (0.4% of 240 Gbps capacity)          │
│ ├─ Edge AI uplinks: 2× 10G LAG per node = 20 Gbps per node        │
│ │   ├─ Primary node: Ports 1-2 (20 Gbps)                           │
│ │   └─ Standby node: Ports 3-4 (20 Gbps)                           │
│ ├─ WAN uplinks: 2× 10G to core router (observability APIs)        │
│ └─ Routing: OSPF Area 0 (internal), BGP AS 65000 (WAN to NJ)      │
└──────────────────────────────────────────────────────────────────────┘
                            ↓
                 2× 10 Gbps Fiber (Link Aggregation = 20 Gbps)
                            ↓
EDGE AI LAYER: Cisco Unified Edge
┌──────────────────────────────────────────────────────────────────────┐
│ Cisco UCS XE9305 Chassis (3 RU, 18" short-depth)                    │
│ Location: IDF Room, Floor 3 (co-located with Catalyst switches)     │
│ ├─ Form Factor: 3 RU rack mount, 40 lbs weight                     │
│ ├─ Compute Slots: 5 slots (2 used, 3 reserved for Phase 5)         │
│ ├─ Power: Dual 1,000W PSU (N+1), 700W actual consumption           │
│ ├─ Fabric: Embedded 25G switches (2× management controllers)       │
│ ├─ Cooling: 5× hot-swap fans (60dB, IDF-optimized acoustics)      │
│ └─ Management: Cisco Intersight Infrastructure Service (SaaS)       │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ SLOT 1 (Primary): UCS XE130c M8 Compute Node                    │ │
│ │ ───────────────────────────────────────────────────────────────  │ │
│ │ Hostname: edge-ai-mumbai-01                                      │ │
│ │ Management IP: 10.150.1.10                                       │ │
│ │ VRRP VIP: 10.150.1.1 (active, shared with standby)             │ │
│ │ SGT: SGT-95 (Edge AI Servers)                                   │ │
│ │                                                                   │ │
│ │ CPU: Intel Xeon 6 SoC (32 cores @ 2.6 GHz base, 4.0 GHz turbo) │ │
│ │ RAM: 128GB DDR5-4800 (4 channels × 32GB DIMMs)                  │ │
│ │ GPU: NVIDIA L4 24GB GDDR6 (PCIe Gen5 slot, 72W TDP)            │ │
│ │   └─ Performance: 120 TOPS INT8 inference                       │ │
│ │   └─ Utilization: 70-80% target (120 cameras @ 30 FPS)         │ │
│ │ Storage:                                                          │ │
│ │   ├─ Boot: Dual M.2 SATA 512GB (RAID 1)                        │ │
│ │   └─ Data: 2× E3.S NVMe 1TB (7-day event buffer)               │ │
│ │ Network:                                                          │ │
│ │   ├─ Midplane: 2× 25G (chassis fabric, management)             │ │
│ │   └─ Front-panel: 2× 10G SFP+ (LAG to Catalyst 9500)           │ │
│ │ Power: 350W avg (CPU 185W + GPU 72W + other 93W)               │ │
│ │                                                                   │ │
│ │ AI Workload:                                                      │ │
│ │ ├─ YOLO v8n: Person detection (20ms inference)                  │ │
│ │ ├─ DeepSORT: Object tracking (loitering, 10ms overhead)        │ │
│ │ ├─ Custom CNN: PPE detection (hard hat, safety vest, 25ms)     │ │
│ │ └─ LPR Pipeline: YOLO + CNN + Tesseract (127ms total)          │ │
│ │                                                                   │ │
│ │ Inbound: 960 Mbps (120 camera RTSP streams)                     │ │
│ │ Outbound: 50 Mbps (observability API calls)                     │ │
│ │ Latency: 4ms camera → edge AI (same IDF room)                  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ SLOT 2 (Standby): UCS XE130c M8 Compute Node                    │ │
│ │ ───────────────────────────────────────────────────────────────  │ │
│ │ Hostname: edge-ai-mumbai-02                                      │ │
│ │ Management IP: 10.150.1.11                                       │ │
│ │ VRRP VIP: 10.150.1.1 (standby, takes over on failover)         │ │
│ │ Hardware: Identical to Slot 1                                    │ │
│ │ Role: Hot standby (5-sec heartbeat, RTO <30 sec)               │ │
│ │ GPU: Warm standby (models pre-loaded, ready for instant use)   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ Slots 3-5: Reserved for Phase 5 (6 branch sites, 2 branches/node)  │
└──────────────────────────────────────────────────────────────────────┘
                            ↓
              Outbound: 50 Mbps (observability/security APIs)
                            ↓
OBSERVABILITY & SECURITY INTEGRATION
┌──────────────────────────────────────────────────────────────────────┐
│ Mumbai Datacenter (LAN, <50ms latency)                               │
│ ├─ ISE pxGrid (10.30.0.1:8910)                                      │
│ │   └─ Badge swipe correlation, ~5 Mbps, WebSocket                 │
│ ├─ FTD Firewall (ftd-mumbai.abhavtech.com)                         │
│ │   └─ Automated network blocking, ~2 Mbps, HTTPS API              │
│ └─ BMS Honeywell (bms.abhavtech.com)                               │
│     └─ HVAC/lighting control, ~1 Mbps, OAuth 2.0 API               │
│                                                                       │
│ NJ Datacenter (WAN, ~100ms latency, 10 Gbps MPLS)                   │
│ └─ Splunk MLTK (10.182.1.50:8089)                                   │
│     └─ Historical pattern validation, ~15 Mbps, HTTPS API           │
│                                                                       │
│ SaaS Cloud (Internet, ~80ms latency, 1 Gbps circuit)                │
│ ├─ ThousandEyes (api.thousandeyes.com)                             │
│ │   └─ Network path health, ~10 Mbps, OAuth 2.0                    │
│ ├─ AppDynamics (abhavtech.saas.appdynamics.com)                    │
│ │   └─ Application health, ~10 Mbps, API token auth                │
│ ├─ XDR SecureX (securex.cisco.com)                                  │
│ │   └─ Security incident correlation, ~2 Mbps, Bearer token        │
│ ├─ ServiceNow (abhavtech.service-now.com)                          │
│ │   └─ Incident ticketing, ~3 Mbps, Basic auth                     │
│ └─ Webex Teams (webexapis.com)                                      │
│     └─ Supervisor mobile alerts, ~2 Mbps, Bearer token             │
└──────────────────────────────────────────────────────────────────────┘
```

---

## DETAILED DATA FLOW: PERIMETER INTRUSION DETECTION

### Timeline: 0ms → 500ms (Detection → Supervisor Alert)

```
TIME: 14:32:05.000 - Frame Acquisition
┌──────────────────────────────────────────────────────────────┐
│ Camera 47 (Outdoor PTZ, Loading Dock Perimeter)              │
│ IP: 10.150.5.47, SGT: SGT-70                                 │
│ RTSP URL: rtsp://10.150.5.47:554/axis-media/media.amp       │
│ Frame: 1920×1080 @ 30 FPS, H.265, 8.2 Mbps current          │
│ Timestamp: 2025-01-15T14:32:05.000Z                         │
└──────────────────────────────────────────────────────────────┘
         ↓ 1 Gbps Ethernet, PoE+ 30W, <1ms latency
┌──────────────────────────────────────────────────────────────┐
│ Catalyst 9300-48U Access Switch #5                           │
│ Port 20, VLAN 150, SGT-70 assigned via ISE                  │
│ SGACL: Permit SGT-70 → SGT-95 (camera to edge AI)           │
│ QoS: AF31 (DSCP 26) for camera RTSP traffic                 │
└──────────────────────────────────────────────────────────────┘
         ↓ 10 Gbps Fiber (LAG, 4 ports), <1ms latency
┌──────────────────────────────────────────────────────────────┐
│ Catalyst 9500-40X Distribution Switch                        │
│ Inter-VLAN routing: 10.150.5.47 → 10.150.1.1 (VRRP VIP)    │
│ Route: OSPF Area 0, next-hop direct (same IDF room)         │
└──────────────────────────────────────────────────────────────┘
         ↓ 2× 10 Gbps Fiber (LAG), <2ms latency
┌──────────────────────────────────────────────────────────────┐
│ UCS XE130c M8 Primary Node (edge-ai-mumbai-01)              │
│ VRRP VIP: 10.150.1.1 (active), SGT: SGT-95                  │
│ Frame received at network interface (2× 10G LAG)             │
│ Total network latency: Camera → Edge AI = 4ms               │
└──────────────────────────────────────────────────────────────┘

TIME: 14:32:05.004 - Edge AI Processing Begins

┌──────────────────────────────────────────────────────────────┐
│ Container: AI Inference Service (K8s pod)                     │
│ RTSP Client: Pulls frame from camera buffer (in-memory)      │
│ Frame decoded: H.265 → raw RGB (1920×1080, 6.2 MB)          │
└──────────────────────────────────────────────────────────────┘
         ↓ 5ms - CPU pre-processing
┌──────────────────────────────────────────────────────────────┐
│ CPU Pre-Processing (Intel Xeon 6, 32 cores)                  │
│ ├─ Resize: 1920×1080 → 640×640 (letterbox padding)          │
│ ├─ Normalize: [0-255] → [0-1] float32                       │
│ ├─ Colorspace: BGR → RGB                                     │
│ └─ Transpose: HWC → CHW format (PyTorch input)              │
│ Output: 640×640×3 tensor ready for GPU                       │
└──────────────────────────────────────────────────────────────┘
         ↓ Copy tensor to GPU memory (PCIe Gen5, <1ms)
┌──────────────────────────────────────────────────────────────┐
│ GPU Inference (NVIDIA L4 24GB, PCIe Gen5 slot)              │
│ Model: YOLO v8n (INT8 quantized, 6.2 MB, TensorRT)          │
│ Input: 640×640×3 tensor                                      │
│ GPU Execution: 20ms @ 75% utilization                        │
│ Output: Bounding boxes, classes, confidences                 │
│ Result: 1 person detected at [850,320,970,600], conf=0.96   │
└──────────────────────────────────────────────────────────────┘
         ↓ 3ms - CPU post-processing
┌──────────────────────────────────────────────────────────────┐
│ CPU Post-Processing                                           │
│ ├─ Non-Max Suppression: Filter overlapping boxes             │
│ ├─ Zone validation: Bbox center in restricted zone polygon   │
│ └─ Duplicate check: Query SQLite (no duplicate last 60 sec)  │
│ Decision: NEW detection in RZ-LOADING-DOCK zone              │
└──────────────────────────────────────────────────────────────┘

TIME: 14:32:05.030 - Multi-Source Validation Launch

┌──────────────────────────────────────────────────────────────┐
│ Validation Orchestrator (Python async, 4 parallel API calls) │
└──────────────────────────────────────────────────────────────┘
         ↓ Parallel execution (max latency: 100ms)
┌──────────────────────────────────────────────────────────────┐
│ API Call 1: ISE pxGrid (Mumbai Datacenter)                   │
│ ───────────────────────────────────────────────────────────   │
│ Endpoint: https://10.30.0.1:8910/pxgrid/ise/session/query   │
│ Network: Mumbai LAN (same building)                          │
│ Request: Query badge swipes at Loading Dock (last 5 min)    │
│ Response Time: 50ms                                          │
│ Result: 0 badge swipes (UNAUTHORIZED entry)                 │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ API Call 2: Splunk MLTK (NJ Datacenter)                      │
│ ───────────────────────────────────────────────────────────   │
│ Endpoint: https://10.182.1.50:8089/services/search/jobs     │
│ Network: MPLS WAN Mumbai → NJ (10 Gbps, 200ms RTT)          │
│ Request: Historical occupancy pattern (Tuesday 14:30)        │
│ Response Time: 100ms                                          │
│ Result: Expected 0.2 people, Actual 1 (ANOMALOUS)           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ API Call 3: ThousandEyes (SaaS Cloud)                        │
│ ───────────────────────────────────────────────────────────   │
│ Endpoint: https://api.thousandeyes.com/v6/tests/12345/...   │
│ Network: Internet (1 Gbps circuit)                           │
│ Request: Camera 47 → Edge AI network path health            │
│ Response Time: 80ms                                           │
│ Result: 0% loss, 12ms latency (NETWORK HEALTHY)             │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ API Call 4: AppDynamics (SaaS Cloud)                         │
│ ───────────────────────────────────────────────────────────   │
│ Endpoint: https://abhavtech.saas.appdynamics.com/...        │
│ Network: Internet (1 Gbps circuit)                           │
│ Request: RTSP service health (Camera 47 stream)              │
│ Response Time: 90ms                                           │
│ Result: 0% error rate (APPLICATION HEALTHY)                 │
└──────────────────────────────────────────────────────────────┘

TIME: 14:32:05.135 - Validation Complete (All 4 APIs responded)

┌──────────────────────────────────────────────────────────────┐
│ Decision Logic (Python decision engine)                      │
│ ───────────────────────────────────────────────────────────   │
│ Criteria:                                                     │
│ ✓ AI confidence: 96% (≥90% threshold)                       │
│ ✓ ISE: Unauthorized (0 badge swipes)                        │
│ ✓ Splunk: Anomalous (occupancy 5× expected)                 │
│ ✓ ThousandEyes: Network healthy (0% loss)                   │
│ ✓ AppDynamics: Application healthy (0% errors)              │
│                                                               │
│ Decision: HIGH CONFIDENCE (all 5 criteria passed)           │
│ Action: AUTOMATED response authorized                        │
└──────────────────────────────────────────────────────────────┘

TIME: 14:32:05.155 - Automated Actions (4 parallel API calls)

┌──────────────────────────────────────────────────────────────┐
│ Action 1: FTD Firewall Network Block (Mumbai LAN)            │
│ ───────────────────────────────────────────────────────────   │
│ Endpoint: https://ftd-mumbai.abhavtech.com/api/...          │
│ Request: Create block rule VLAN 150 → Corporate (30 min)    │
│ Response Time: 50ms                                          │
│ Result: Rule ID 005056BB...400 created, expires 15:02       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Action 2: XDR SecureX Incident (SaaS Cloud)                  │
│ ───────────────────────────────────────────────────────────   │
│ Endpoint: https://securex.cisco.com/iroh/...                │
│ Request: Create security incident (P2-High priority)         │
│ Response Time: 40ms                                          │
│ Result: Incident ID incident-2025-0147 created              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Action 3: ServiceNow Ticket (SaaS Cloud)                     │
│ ───────────────────────────────────────────────────────────   │
│ Endpoint: https://abhavtech.service-now.com/api/...         │
│ Request: Create incident with video snapshot attachment      │
│ Response Time: 60ms                                          │
│ Result: INC0012345 created, assigned to supervisor          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Action 4: Webex Teams Alert (SaaS Cloud)                     │
│ ───────────────────────────────────────────────────────────   │
│ Endpoint: https://webexapis.com/v1/messages                 │
│ Request: Send mobile push notification to supervisor         │
│ Response Time: 80ms                                          │
│ Result: Message sent, mobile push delivered in ~2-3 sec     │
└──────────────────────────────────────────────────────────────┘

TIME: 14:32:05.500 - Supervisor Receives Mobile Notification

TOTAL LATENCY: 500ms (Detection → Mobile Alert)
  ├─ Frame acquisition: 0ms
  ├─ Network (camera → edge AI): 4ms
  ├─ Pre-processing: 5ms
  ├─ GPU inference: 20ms
  ├─ Post-processing + duplicate check: 5ms
  ├─ Multi-source validation (parallel): 100ms
  ├─ Decision logic: 20ms
  ├─ Automated actions (parallel): 80ms
  └─ Network propagation (FTD + Webex push): 266ms
```

---

## INTEGRATION ARCHITECTURE: API SPECIFICATIONS

### ISE pxGrid Integration (Badge Event Correlation)

**Purpose:** Correlate person detections with badge swipe events to distinguish authorized vs. unauthorized entry.

**Network Path:**
```
Edge AI (10.150.1.10) → Catalyst 9500 → Core Router → ISE (10.30.0.1)
Latency: ~50ms (Mumbai LAN, same datacenter)
Bandwidth: ~5 Mbps (event stream, WebSocket persistent connection)
```

**API Specification:**

```http
POST https://10.30.0.1:8910/pxgrid/ise/session/query
Authorization: Basic <base64_credentials>
Content-Type: application/json
X-Request-ID: perimeter-intrusion-20250115-143205

{
  "location": "Loading Dock",
  "startTimestamp": "2025-01-15T14:27:05.000Z",
  "endTimestamp": "2025-01-15T14:32:05.000Z",
  "sgt": ["SGT-71"]
}
```

**Response:**
```json
{
  "requestId": "perimeter-intrusion-20250115-143205",
  "timestamp": "2025-01-15T14:32:05.085Z",
  "sessions": [],
  "totalCount": 0
}
```

**Validation Logic:**
- `totalCount == 0` → UNAUTHORIZED (no badge swipes detected)
- `totalCount >= 1` → AUTHORIZED (badge swipe detected, likely employee)

---

### Splunk MLTK Integration (Historical Pattern Validation)

**Purpose:** Compare current occupancy vs. historical patterns to detect anomalies.

**Network Path:**
```
Edge AI (10.150.1.10) → Catalyst 9500 → Core Router → MPLS WAN → NJ Datacenter → Splunk (10.182.1.50)
Latency: ~100ms (200ms RTT Mumbai ↔ NJ, 10 Gbps MPLS circuit)
Bandwidth: ~15 Mbps (search queries + HEC event ingestion)
```

**API Specification:**

```http
POST https://10.182.1.50:8089/services/search/jobs
Authorization: Bearer <splunk_token>
Content-Type: application/x-www-form-urlencoded

search=index=bms location="Loading Dock" earliest=-30d latest=now 
| eval hour=strftime(_time, "%H"), day=strftime(_time, "%A")
| where hour="14" AND day="Tuesday"
| stats avg(occupancy_count) as expected_occupancy
| eval current_occupancy=1
| eval anomaly=if(current_occupancy > expected_occupancy * 1.5 OR current_occupancy < expected_occupancy * 0.5, 1, 0)
&output_mode=json
```

**Response:**
```json
{
  "sid": "1705317125.12345",
  "results": [
    {
      "expected_occupancy": 0.2,
      "current_occupancy": 1,
      "anomaly": 1
    }
  ]
}
```

**Validation Logic:**
- `anomaly == 1` → ANOMALOUS (occupancy significantly different from historical pattern)
- `anomaly == 0` → NORMAL (occupancy within expected range)

---

### ThousandEyes Integration (Network Path Health)

**Purpose:** Validate camera → edge AI network path to rule out false positives from packet loss.

**Network Path:**
```
Edge AI (10.150.1.10) → Catalyst 9500 → Core Router → Internet (1 Gbps) → ThousandEyes Cloud
Latency: ~80ms (Mumbai → ThousandEyes Singapore region)
Bandwidth: ~10 Mbps (API queries, periodic polling)
```

**API Specification:**

```http
GET https://api.thousandeyes.com/v6/tests/12345/net/path-vis
Authorization: Bearer <thousandeyes_token>
Content-Type: application/json

Parameters:
  testId: 12345
  window: 2m
  aid: 98765
```

**Response:**
```json
{
  "test": {
    "testId": 12345,
    "testName": "Camera-47 → Edge-AI-Mumbai-01 Network Path"
  },
  "net": {
    "metrics": [
      {
        "date": "2025-01-15T14:32:00",
        "avgLatency": 12,
        "minLatency": 10,
        "maxLatency": 15,
        "loss": 0.0,
        "jitter": 2
      }
    ]
  }
}
```

**Validation Logic:**
- `loss < 1% AND latency < 100ms` → NETWORK HEALTHY
- `loss >= 1% OR latency >= 100ms` → NETWORK DEGRADED (may cause false positive)

---

### AppDynamics Integration (Application Health)

**Purpose:** Validate RTSP streaming service health to rule out false positives from corrupt video.

**Network Path:**
```
Edge AI (10.150.1.10) → Catalyst 9500 → Core Router → Internet (1 Gbps) → AppDynamics Cloud
Latency: ~90ms (Mumbai → AppDynamics US East region)
Bandwidth: ~10 Mbps (metrics queries, periodic polling)
```

**API Specification:**

```http
GET https://abhavtech.saas.appdynamics.com/controller/rest/applications/10/metric-data
Authorization: Bearer <appdynamics_token>
Content-Type: application/json

Parameters:
  application: 10
  metric-path: Business Transaction Performance|...|Camera-47-Stream|Errors per Minute
  time-range-type: BEFORE_NOW
  duration-in-mins: 5
  output: JSON
```

**Response:**
```json
{
  "metric-data": [
    {
      "metricName": "BTM|BTs|BT:12345|...|Errors per Minute",
      "metricValues": [
        {"startTimeInMillis": 1705317120000, "value": 0, "count": 1}
      ]
    }
  ]
}
```

**Validation Logic:**
- `avg_error_rate < 5%` → APPLICATION HEALTHY
- `avg_error_rate >= 5%` → APPLICATION UNHEALTHY (may cause false positive)

---

## SECURITY INTEGRATION: FTD + XDR + ServiceNow + Webex

### FTD Firewall Automated Blocking

**Purpose:** Isolate compromised VLAN on high-confidence security events.

**Network Path:**
```
Edge AI (10.150.1.10) → Catalyst 9500 → Core Router → FTD (ftd-mumbai.abhavtech.com)
Latency: ~50ms (Mumbai LAN, same datacenter)
Bandwidth: ~2 Mbps (rule creation commands, low volume)
```

**API Request:**
```http
POST https://ftd-mumbai.abhavtech.com/api/fmc_config/v1/domain/default/policy/accesspolicies/.../accessrules
Authorization: Bearer <ftd_token>
Content-Type: application/json

{
  "name": "BLOCK-LoadingDock-AutoGenerated-20250115-143205",
  "action": "BLOCK",
  "enabled": true,
  "sourceZones": {
    "objects": [{"type": "SecurityZone", "id": "...", "name": "VLAN-150-LoadingDock"}]
  },
  "destinationNetworks": {
    "objects": [{"type": "Network", "id": "...", "name": "Corporate-Network"}]
  },
  "metadata": {
    "reason": "Perimeter intrusion detected by edge AI - Camera 47",
    "duration": 1800,
    "createdBy": "edge-ai-automation"
  }
}
```

**Response:**
```json
{
  "id": "005056BB-0B24-0ed3-0000-004294967400",
  "name": "BLOCK-LoadingDock-AutoGenerated-20250115-143205",
  "action": "BLOCK",
  "enabled": true,
  "metadata": {
    "timestamp": "2025-01-15T14:32:05.225Z",
    "expiryTimestamp": "2025-01-15T15:02:05.225Z"
  }
}
```

---

### Complete Integration Summary

| Integration Point | Protocol | Latency | Bandwidth | Purpose |
|------------------|----------|---------|-----------|---------|
| **ISE pxGrid** | WebSocket/HTTPS | 50ms | 5 Mbps | Badge event correlation (authorized vs. unauthorized) |
| **Splunk MLTK** | HTTPS REST | 100ms | 15 Mbps | Historical pattern validation (anomaly detection) |
| **ThousandEyes** | HTTPS REST | 80ms | 10 Mbps | Network path health (rule out packet loss false positives) |
| **AppDynamics** | HTTPS REST | 90ms | 10 Mbps | Application health (rule out corrupt stream false positives) |
| **FTD Firewall** | HTTPS REST | 50ms | 2 Mbps | Automated network blocking (contain threat) |
| **XDR SecureX** | HTTPS REST | 40ms | 2 Mbps | Security incident correlation (enrich with AMP, Umbrella, ISE) |
| **ServiceNow** | HTTPS REST | 60ms | 3 Mbps | Incident ticketing (audit trail, supervisor review) |
| **Webex Teams** | HTTPS REST | 80ms | 2 Mbps | Mobile supervisor alerts (push notifications) |
| **BMS Honeywell** | HTTPS REST | 500ms | 1 Mbps | HVAC/lighting control (UC2 building automation) |
| **TOTAL** | | Max 100ms | 50 Mbps | Multi-source validation + automated response |

---

## END OF INTEGRATION ARCHITECTURE

This document provides the complete integration architecture showing:
✓ Physical layer: 120 cameras with PoE+ power and network connectivity
✓ Access layer: Catalyst 9300 switches with SGACL enforcement
✓ Distribution layer: Catalyst 9500 inter-VLAN routing
✓ Edge AI layer: UCS XE9305 + XE130c M8 with NVIDIA L4 GPU inference
✓ Observability layer: ISE, Splunk, ThousandEyes, AppDynamics validation
✓ Security layer: FTD, XDR, ServiceNow, Webex automated response
✓ Complete data flow: 0ms → 500ms detection to mobile alert

**Total Bandwidth:** 960 Mbps inbound (cameras) + 50 Mbps outbound (APIs) = 1,010 Mbps
**Network Utilization:** 5% of 20 Gbps available capacity (ample headroom for Phase 5)