# Building Automation

## 2.2 USE CASE 2: AI-DRIVEN BUILDING AUTOMATION

### Overview

Use Case 2 (UC2) transforms traditional scheduled-based building management into real-time adaptive systems driven by actual occupancy patterns detected through computer vision. Rather than maintaining constant HVAC/lighting based on time schedules (e.g., "maintain 22°C 08:00-18:00 regardless of occupancy"), UC2 adjusts environmental controls dynamically based on AI-detected occupancy, delivering 25-35% energy savings while improving occupant comfort.

**Business Impact:**

- **Energy Cost Reduction:** 25-35% reduction in HVAC/lighting costs ($180K-$250K annual savings across Mumbai + Chennai hubs)
- **Improved Comfort:** Adaptive temperature/lighting based on actual occupancy patterns (not fixed schedules)
- **Sustainability:** Reduced carbon footprint (15-20% reduction aligned with corporate ESG targets)
- **Space Utilization Intelligence:** Real-time conference room/cafeteria analytics for facilities optimization

**Technical Architecture:**

UC2 leverages the **same Edge AI infrastructure deployed for physical security (UC1)** - specifically the **Cisco Unified Edge platform (UCS XE9305 chassis with XE130c M8 compute nodes)** running YOLO v8 occupancy detection models. The key advantage is infrastructure reuse: UC2 requires ZERO additional hardware investment since the XE130c M8 GPU has sufficient capacity to run both security (UC1) and building automation (UC2) workloads simultaneously at 70-80% GPU utilization.

**Integration Point:**

Edge AI nodes connect to **Honeywell EBI R410.1 Building Management System (BMS)** via REST API over Mumbai LAN (<1ms latency to BMS controllers). When occupancy patterns deviate from expected baselines (e.g., empty conference room maintaining 22°C for scheduled meeting that never occurred), edge AI sends control commands to adjust HVAC/lighting within seconds rather than waiting for scheduled transitions.

**Co-Location Advantage:**

Because XE9305 chassis resides in IDF Room Floor 3 (same building as BMS controllers), occupancy detection → BMS API call latency is <500ms total (4ms camera→AI + 1ms AI→BMS + 495ms BMS controller processing). This enables real-time adjustments: when the last person exits a conference room, HVAC setpoint increases to 26°C (energy-saving mode) within 30 seconds, vs. traditional BMS waiting until scheduled end time (potentially 60+ minutes of wasted HVAC).

---

### 2.2.1 AI Models for Building Automation

**Model Overview:**

UC2 reuses UC1's YOLO v8n person detection model (already deployed for security functions) with additional post-processing logic for occupancy analytics. This architectural decision eliminates model training/deployment overhead - UC2 simply adds a new inference pipeline consuming the same video streams already processed for security.

**Primary Model: YOLO v8n Person Detection (Occupancy Counting)**

```
Model: YOLOv8n (Nano variant)
Framework: ONNX Runtime with TensorRT optimization
Precision: INT8 quantized (4× faster than FP32, <1% accuracy loss)
Model Size: 6.2 MB (fits in GPU memory alongside UC1 security models)
Input: 640×640×3 RGB tensor (letterbox resize from 1920×1080)
Output: Bounding boxes [x1, y1, x2, y2], class IDs, confidence scores

Training Dataset:
  ├─ MS COCO (person class): 118,287 labeled persons
  ├─ Abhavtech custom dataset: 12,500 images (conference rooms, cafeteria)
  │    └─ Annotated for challenging scenarios: seated persons, partial occlusions
  └─ Data augmentation: Random rotation, brightness, blur (prevent overfitting)

Performance (on NVIDIA L4 GPU):
  ├─ Inference Time: 20ms per frame (640×640 input)
  ├─ Throughput: 50 FPS per camera (30 FPS actual rate = 40% headroom)
  ├─ Accuracy: 95% mAP@0.5 (person detection at 0.5 IoU threshold)
  └─ GPU Memory: 850 MB (leaves 23.15 GB free for UC1 security models)
```

**Detection Specifications:**

| Scenario | Detection Range | Accuracy | Notes |
|----------|----------------|----------|-------|
| Conference Room (seated) | 2-8m distance | 92% @ 0.9 confidence | Challenging: seated persons smaller bounding box |
| Conference Room (standing) | 2-12m distance | 97% @ 0.9 confidence | Easier: standing persons full-body visible |
| Cafeteria (walking) | 3-15m distance | 95% @ 0.9 confidence | Medium: walking persons clear but variable lighting |
| Hallway (walking) | 3-10m distance | 96% @ 0.9 confidence | Standard: well-lit, minimal occlusions |

**Occupancy Counting Logic:**

```python
# Post-processing for occupancy analytics (runs on CPU after GPU inference)

def count_occupancy(detections, zone_polygon):
    """
    Args:
        detections: List of bounding boxes from YOLO v8
        zone_polygon: Conference room/cafeteria boundary polygon
    
    Returns:
        occupancy_count: Number of persons in zone
        occupancy_density: Persons per square meter
    """
    occupancy_count = 0
    
    for bbox, class_id, confidence in detections:
# Filter: Only count "person" class (class_id = 0 in COCO)
        if class_id != 0:
            continue
        
# Filter: Confidence threshold (reduce false positives)
        if confidence < 0.90:
            continue
        
# Calculate bounding box center point
        bbox_center_x = (bbox[0] + bbox[2]) / 2
        bbox_center_y = (bbox[1] + bbox[3]) / 2
        
# Check if center point inside zone polygon (ray casting algorithm)
        if point_in_polygon(bbox_center_x, bbox_center_y, zone_polygon):
            occupancy_count += 1
    
# Calculate density (zone area pre-configured per room)
    zone_area_sqm = calculate_polygon_area(zone_polygon)
    occupancy_density = occupancy_count / zone_area_sqm
    
    return occupancy_count, occupancy_density

# Deduplication: Track same person across multiple cameras
# Uses DeepSORT tracking (same as UC1 loitering detection)
# Prevents double-counting person appearing in 2 overlapping camera FOVs
```

**Zone Definitions:**

Each monitored space has a pre-configured zone polygon defining the occupancy detection area:

```json
{
  "zone_id": "CR-FLOOR3-ROOM-301",
  "zone_name": "Conference Room 301 (Executive Floor)",
  "zone_type": "conference_room",
  "zone_area_sqm": 45.5,
  "zone_capacity": 12,
  "zone_polygon": [
    [120, 80],   // Top-left corner (pixel coordinates)
    [520, 80],   // Top-right corner
    [520, 480],  // Bottom-right corner
    [120, 480]   // Bottom-left corner
  ],
  "cameras": ["cam-62", "cam-63"],
  "bms_zone_id": "AHU-FLOOR3-ZONE-301",
  "hvac_setpoint_occupied": 22,
  "hvac_setpoint_unoccupied": 26,
  "lighting_level_occupied": 500,
  "lighting_level_unoccupied": 100
}
```

**GPU Utilization Analysis (Combined UC1 + UC2):**

```
NVIDIA L4 GPU (24GB GDDR6, 120 TOPS INT8)

UC1 (Physical Security):
  ├─ Active cameras: 120 cameras @ 30 FPS = 3,600 frames/sec
  ├─ Models: YOLO v8n (person), DeepSORT (tracking), PPE CNN, LPR pipeline
  ├─ GPU utilization: 55-60% (primary workload)
  └─ GPU memory: 18 GB (models + frame buffers)

UC2 (Building Automation):
  ├─ Active cameras: 40 cameras @ 30 FPS = 1,200 frames/sec
  │    ├─ 21× conference room cameras (Floor 1-7)
  │    ├─ 8× cafeteria cameras (Ground floor)
  │    ├─ 11× hallway cameras (occupancy density heatmaps)
  ├─ Model: YOLO v8n (person only, reuses UC1 model)
  ├─ GPU utilization: +15-20% (shared inference, incremental load)
  └─ GPU memory: +850 MB (minimal, reuses UC1 model weights)

Combined Total:
  ├─ GPU utilization: 70-80% (optimal target, 20-30% headroom)
  ├─ GPU memory: 18.85 GB / 24 GB (78% utilization)
  └─ Performance: Stable at 30 FPS across all 120 cameras (no frame drops)

Validation:
  ✓ GPU temperature: 65-70°C (within NVIDIA L4 thermal spec 0-90°C)
  ✓ GPU power: 68-72W (within 72W TDP envelope)
  ✓ No thermal throttling observed during 7-day stress test
```

---

### 2.2.2 BMS Integration Architecture

**Building Management System Overview:**

Mumbai and Chennai hubs use **Honeywell EBI R410.1** (Enterprise Buildings Integrator) for centralized HVAC, lighting, and fire/smoke control. The BMS manages:
- 85 AHU (Air Handling Units): 8 floors × 10-12 AHUs per floor (zones per floor)
- 1,200+ VAV boxes (Variable Air Volume): Conference rooms, individual offices, open areas
- 850 lighting fixtures: LED panels with 0-100% dimming control (DALI protocol)
- 45 exhaust fans: Cafeteria, server room, electrical room, restrooms
- 120 temperature sensors: Zone temperature monitoring (0.5°C accuracy)

**BMS Architecture:**

```
Honeywell EBI R410.1 Architecture (Per Site)

┌──────────────────────────────────────────────────────────┐
│ EBI R410.1 Server (Mumbai Datacenter, Virtualized)      │
│ ├─ IP: 10.30.1.50 (Mumbai), 10.35.1.50 (Chennai)       │
│ ├─ Platform: VMware ESXi 8.0 (4 vCPU, 16 GB RAM)       │
│ ├─ OS: Windows Server 2022                              │
│ ├─ Software: EBI R410.1 v4.5.2                          │
│ └─ Database: SQL Server 2019 (time-series data)         │
└──────────────────────────────────────────────────────────┘
         ↓ BACnet/IP (Building Automation Protocol)
┌──────────────────────────────────────────────────────────┐
│ Field Controllers (Distributed Across Building)          │
│ ├─ 8× Honeywell WEBs-AX (Floor controllers)            │
│ │   └─ 1 per floor, manages AHUs + VAV boxes           │
│ ├─ 2× Honeywell JACE-8000 (Cafeteria + Server Room)    │
│ └─ 1× Honeywell Spyder controller (Central plant)      │
└──────────────────────────────────────────────────────────┘
         ↓ BACnet MS/TP (Master-Slave/Token-Passing)
┌──────────────────────────────────────────────────────────┐
│ Terminal Equipment (Endpoints)                           │
│ ├─ AHUs: Dampers, fans, heating/cooling coils          │
│ ├─ VAV boxes: Zone dampers, reheat coils               │
│ ├─ Lighting: DALI dimmers (0-100% control)             │
│ └─ Sensors: Temperature, CO2, humidity, occupancy       │
└──────────────────────────────────────────────────────────┘
```

**Edge AI → BMS Integration:**

Edge AI communicates with BMS via **Honeywell EBI REST API** (not BACnet directly - BACnet is legacy protocol, REST API preferred for modern integrations):

```
Integration Path:

Edge AI (10.150.1.10) 
  ↓ HTTPS REST API
Catalyst 9500 Distribution Switch
  ↓ 10G fiber uplink
Core Router
  ↓ Mumbai LAN (same datacenter)
EBI R410.1 Server (10.30.1.50)
  ↓ BACnet/IP
Floor Controllers (WEBs-AX)
  ↓ BACnet MS/TP
Terminal Equipment (AHUs, VAV, Lighting)

Total Latency:
  ├─ Edge AI → EBI API: ~50ms (HTTPS REST API call)
  ├─ EBI → Floor Controller: ~200ms (BACnet command processing)
  ├─ Floor Controller → Equipment: ~250ms (BACnet MS/TP, damper actuation)
  └─ Total: ~500ms (occupancy detection → HVAC adjustment)
```

**BMS REST API Specification:**

Honeywell EBI R410.1 exposes RESTful API for external system integration:

```
Base URL: https://bms.abhavtech.com/api/v2
Authentication: OAuth 2.0 (client credentials flow)
Rate Limit: 600 requests/minute (10 req/sec)
Response Format: JSON
API Version: v2.3.1

Common Endpoints:
  ├─ GET  /zones                    (List all HVAC zones)
  ├─ GET  /zones/{zone_id}          (Get zone details + current state)
  ├─ POST /zones/{zone_id}/control  (Set temperature setpoint, fan speed, etc.)
  ├─ GET  /zones/{zone_id}/sensors  (Get sensor readings: temp, CO2, humidity)
  └─ GET  /equipment/{device_id}    (Get AHU/VAV status)
```

**Authentication Flow:**

```http
POST https://bms.abhavtech.com/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=edge-ai-mumbai-01
&client_secret=<secret>
&scope=zones:read zones:write equipment:read

Response:
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Zone Configuration Example:**

```json
{
  "zone_id": "AHU-FLOOR3-ZONE-301",
  "zone_name": "Conference Room 301",
  "zone_type": "conference_room",
  "zone_area_sqm": 45.5,
  "zone_capacity": 12,
  "current_state": {
    "temperature_actual": 24.5,
    "temperature_setpoint": 22.0,
    "fan_speed": "medium",
    "damper_position": 65,
    "occupancy_detected": false,
    "co2_ppm": 450,
    "humidity_percent": 45
  },
  "control_parameters": {
    "temperature_setpoint_min": 18,
    "temperature_setpoint_max": 28,
    "fan_speed_options": ["low", "medium", "high", "auto"],
    "damper_range": [0, 100]
  },
  "energy_saving_mode": {
    "temperature_setpoint_unoccupied": 26,
    "fan_speed_unoccupied": "low",
    "lighting_level_unoccupied": 10
  }
}
```

---

### 2.2.3 Real-World Workflows (UC2)

**Workflow WF-009: Conference Room Occupancy → HVAC Adjustment**

**Business Context:**

Conference rooms are traditionally maintained at constant temperature (22°C) during business hours (08:00-18:00) regardless of actual usage. In practice, conference rooms average 40-50% utilization - scheduled meetings cancelled/no-shows result in wasted HVAC energy. WF-009 adjusts HVAC setpoints dynamically based on real occupancy, reducing energy waste while maintaining comfort for actual occupants.

**Expected Energy Savings:**
- Mumbai: 21 conference rooms × 10 hours/day × 50% empty = 105 room-hours/day wasted HVAC
- Energy cost: 105 room-hours × 3 kW HVAC × ₹7/kWh = ₹2,205/day = ₹66,150/month = ₹793,800/year
- **Annual savings: ₹793,800 Mumbai + ₹630,000 Chennai = ₹1,423,800 (~$17K USD)**

**Scenario:**

```
Location: Conference Room 301, Executive Floor 3, Mumbai Hub
Scheduled Meeting: 14:00-15:00 (60 minutes, 8 attendees expected)
Reality: Meeting cancelled at 13:45, room remains empty
Traditional BMS: Maintains 22°C until scheduled end time (15:00)
AI-Driven BMS (WF-009): Detects empty room at 14:05, increases setpoint to 26°C (energy-saving mode)
```

**Timeline: Detection → HVAC Adjustment (500ms)**

```
TIME: 14:05:00.000 - Occupancy Detection Begins

┌──────────────────────────────────────────────────────────┐
│ Camera 62 (Indoor Fixed, Conference Room 301)           │
│ IP: 10.150.4.22, SGT: SGT-70                            │
│ Zone: CR-FLOOR3-ROOM-301 (polygon defined)              │
│ Frame: 1920×1080 @ 30 FPS, H.265, 6.5 Mbps             │
└──────────────────────────────────────────────────────────┘
         ↓ 4ms (camera → edge AI, same IDF room)
┌──────────────────────────────────────────────────────────┐
│ UCS XE130c M8 Node (edge-ai-mumbai-01)                  │
│ YOLO v8 Inference: 20ms @ 75% GPU utilization           │
│ Result: 0 persons detected in conference room polygon   │
│ Occupancy: 0 / 12 capacity (0% utilization)             │
│ Historical Context: Room scheduled 14:00-15:00          │
│ Current Time: 14:05:00 (5 minutes into meeting slot)    │
│ Decision: Meeting likely cancelled (0 occupancy @ t+5m) │
└──────────────────────────────────────────────────────────┘

TIME: 14:05:00.030 - BMS Control Logic

┌──────────────────────────────────────────────────────────┐
│ Decision Engine (Python, edge AI node)                   │
│ ───────────────────────────────────────────────────────── │
│ Query BMS: Current state for zone AHU-FLOOR3-ZONE-301   │
│ Current setpoint: 22°C (occupied mode)                   │
│ Actual temperature: 22.5°C                               │
│ Current occupancy: 0 persons (AI-detected)               │
│ Scheduled occupancy: 8 persons (Outlook calendar sync)   │
│                                                           │
│ Rule Evaluation:                                          │
│ IF occupancy == 0 for >5 minutes during scheduled time   │
│ AND no persons detected in last 60 seconds               │
│ THEN trigger energy-saving mode (unoccupied setpoint)    │
│                                                           │
│ Decision: ADJUST (empty room detected during meeting)    │
│ Action: Increase setpoint 22°C → 26°C (4°C increase)    │
│ Expected Energy Savings: 30% HVAC reduction              │
└──────────────────────────────────────────────────────────┘

TIME: 14:05:00.050 - BMS API Call

┌──────────────────────────────────────────────────────────┐
│ HTTPS POST to Honeywell EBI R410.1                       │
└──────────────────────────────────────────────────────────┘

POST https://bms.abhavtech.com/api/v2/zones/AHU-FLOOR3-ZONE-301/control
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
X-Request-ID: wf009-cr301-20250115-140500

{
  "zone_id": "AHU-FLOOR3-ZONE-301",
  "control_action": "energy_saving_mode",
  "temperature_setpoint": 26,
  "fan_speed": "low",
  "lighting_level": 10,
  "reason": "AI-detected: 0 occupancy for 5 minutes during scheduled meeting",
  "detected_by": "edge-ai-mumbai-01",
  "camera_id": "cam-62",
  "timestamp": "2025-01-15T14:05:00.050Z",
  "revert_to_occupied_on": "motion_detected"
}

TIME: 14:05:00.100 - BMS API Response (50ms)

Response:
{
  "request_id": "wf009-cr301-20250115-140500",
  "status": "accepted",
  "zone_id": "AHU-FLOOR3-ZONE-301",
  "control_applied": {
    "temperature_setpoint_previous": 22,
    "temperature_setpoint_new": 26,
    "fan_speed_previous": "medium",
    "fan_speed_new": "low",
    "lighting_level_previous": 100,
    "lighting_level_new": 10
  },
  "estimated_time_to_target": 180,
  "estimated_energy_savings_kwh": 0.75,
  "timestamp": "2025-01-15T14:05:00.100Z"
}

TIME: 14:05:00.350 - BACnet Command Propagation (250ms)

┌──────────────────────────────────────────────────────────┐
│ EBI R410.1 → Floor Controller (WEBs-AX Floor 3)         │
│ Protocol: BACnet/IP                                      │
│ Command: WriteProperty (Temperature_Setpoint = 26°C)     │
└──────────────────────────────────────────────────────────┘
         ↓ BACnet MS/TP (250ms)
┌──────────────────────────────────────────────────────────┐
│ Floor Controller → VAV Box (CR-301-VAV-01)              │
│ Action: Close damper to 20% (reduce airflow)            │
│ Action: Reduce fan speed medium → low                   │
└──────────────────────────────────────────────────────────┘

TIME: 14:05:00.500 - HVAC Adjustment Complete

┌──────────────────────────────────────────────────────────┐
│ Physical Equipment Response                              │
│ ───────────────────────────────────────────────────────── │
│ VAV damper: Actuated to 20% position (was 65%)          │
│ Supply air temperature: Warming from 22°C → 26°C        │
│ Fan speed: Reduced medium → low (40% energy reduction)  │
│ Lighting: Dimmed 100% → 10% (emergency exit only)       │
│                                                           │
│ Expected Timeline:                                        │
│ ├─ Room temperature: Reaches 26°C in ~3 minutes         │
│ ├─ Energy savings: Immediate (fan speed reduction)       │
│ └─ Revert trigger: Motion detected → restore 22°C       │
└──────────────────────────────────────────────────────────┘

TOTAL LATENCY: 500ms (Detection → HVAC Equipment Actuation)
  ├─ Camera → Edge AI: 4ms (network)
  ├─ AI Inference: 20ms (YOLO v8 GPU)
  ├─ Decision Logic: 26ms (CPU post-processing)
  ├─ BMS API Call: 50ms (HTTPS REST, Mumbai LAN)
  ├─ BACnet Propagation: 250ms (EBI → Floor Controller → VAV)
  └─ Equipment Actuation: 150ms (damper motor, fan speed)
```

**Revert Logic (Motion Detected):**

```
TIME: 14:23:15.000 - Meeting Attendees Arrive (Late Start)

┌──────────────────────────────────────────────────────────┐
│ Camera 62: YOLO v8 detects 5 persons entering room      │
│ Occupancy: 0 → 5 persons (within 10 seconds)            │
│ Current setpoint: 26°C (energy-saving mode)             │
│ Expected comfort: 22°C (occupied mode)                  │
│ Decision: REVERT to occupied mode immediately            │
└──────────────────────────────────────────────────────────┘
         ↓ 500ms (same API call process)
┌──────────────────────────────────────────────────────────┐
│ BMS Action: Setpoint 26°C → 22°C, fan speed low → high │
│ VAV damper: 20% → 85% (maximum cooling)                 │
│ Time to comfort: ~5 minutes (26°C → 22°C cool-down)    │
└──────────────────────────────────────────────────────────┘

Note: 5-minute cool-down is acceptable - attendees entering warm room 
triggers maximum cooling to reach 22°C as quickly as possible. This is 
better than traditional BMS: maintain 22°C constantly for empty room.
```

---

**Workflow WF-010: Cafeteria Crowd Density → Ventilation Control**

**Business Context:**

Cafeteria experiences predictable occupancy peaks during lunch hours (12:00-13:00) with 400+ employees eating simultaneously. Traditional BMS uses fixed ventilation schedules, resulting in over-ventilation during off-peak (wasted energy) or under-ventilation during peak (poor air quality, high CO2). WF-010 adjusts exhaust fans and fresh air intake dynamically based on real-time crowd density.

**Expected Energy Savings:**
- Mumbai: 8 exhaust fans × 2 kW × 10 hours/day × 50% over-ventilation = 80 kWh/day wasted
- Energy cost: 80 kWh × ₹7/kWh = ₹560/day = ₹16,800/month = ₹201,600/year
- **Annual savings: ₹201,600 Mumbai + ₹160,000 Chennai = ₹361,600 (~$4,300 USD)**

**Scenario:**

```
Location: Cafeteria, Ground Floor, Mumbai Hub
Time: 11:45 AM (pre-lunch, crowd building)
Occupancy: 0 → 250 persons over 15 minutes
Traditional BMS: Fixed ventilation (4 fans @ 60% speed, scheduled 11:00-14:00)
AI-Driven BMS (WF-010): Increases ventilation dynamically as crowd density rises
```

**Detection → Ventilation Timeline:**

```
TIME: 11:45:00.000 - Crowd Density Detection

┌──────────────────────────────────────────────────────────┐
│ 8× Cameras (cam-15 to cam-22, Cafeteria Coverage)       │
│ YOLO v8 Inference: Detects 250 persons total            │
│ Deduplication: DeepSORT tracking prevents double-count  │
│ Cafeteria Area: 850 sq m (850 square meters)            │
│ Crowd Density: 250 persons / 850 sqm = 0.29 persons/sqm │
│ Historical Baseline: 11:45 AM average = 0.15 persons/sqm │
│ Assessment: 2× expected density (lunch rush starting)    │
└──────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────┐
│ Decision Logic: Crowd Density Thresholds                 │
│ ───────────────────────────────────────────────────────── │
│ Density Tier 1 (<0.10 persons/sqm): Minimum ventilation │
│   └─ 2 fans @ 30% speed (baseline fresh air)            │
│ Density Tier 2 (0.10-0.20): Low ventilation             │
│   └─ 4 fans @ 40% speed                                  │
│ Density Tier 3 (0.20-0.30): Medium ventilation          │
│   └─ 6 fans @ 60% speed                                  │
│ Density Tier 4 (>0.30): Maximum ventilation             │
│   └─ 8 fans @ 80% speed (peak capacity)                 │
│                                                           │
│ Current: 0.29 persons/sqm → Tier 3 (medium ventilation) │
│ Action: Increase from Tier 2 → Tier 3 (4 → 6 fans)     │
└──────────────────────────────────────────────────────────┘

BMS API Call:

POST https://bms.abhavtech.com/api/v2/zones/CAFETERIA-GROUND/control
Authorization: Bearer <token>
Content-Type: application/json

{
  "zone_id": "CAFETERIA-GROUND",
  "control_action": "ventilation_adjust",
  "exhaust_fans": {
    "fan_1": {"speed_percent": 60, "enabled": true},
    "fan_2": {"speed_percent": 60, "enabled": true},
    "fan_3": {"speed_percent": 60, "enabled": true},
    "fan_4": {"speed_percent": 60, "enabled": true},
    "fan_5": {"speed_percent": 60, "enabled": true},
    "fan_6": {"speed_percent": 60, "enabled": true},
    "fan_7": {"speed_percent": 0, "enabled": false},
    "fan_8": {"speed_percent": 0, "enabled": false}
  },
  "fresh_air_damper": 65,
  "reason": "AI-detected crowd density: 0.29 persons/sqm (2× expected)",
  "detected_occupancy": 250,
  "timestamp": "2025-01-15T11:45:00.050Z"
}

Response:
{
  "status": "accepted",
  "zone_id": "CAFETERIA-GROUND",
  "ventilation_applied": "tier_3_medium",
  "estimated_airflow_cfm": 18000,
  "estimated_co2_reduction_time": 180,
  "timestamp": "2025-01-15T11:45:00.100Z"
}
```

**CO2 Level Validation:**

```
TIME: 11:48:00.000 - 3 Minutes After Ventilation Increase

┌──────────────────────────────────────────────────────────┐
│ BMS CO2 Sensors (6× sensors distributed in cafeteria)   │
│ ───────────────────────────────────────────────────────── │
│ 11:42:00 (Before adjustment): 850 ppm CO2 (rising)      │
│ 11:45:00 (Adjustment applied): 6 fans @ 60% enabled     │
│ 11:48:00 (After adjustment): 720 ppm CO2 (declining)    │
│                                                           │
│ Target: <800 ppm CO2 (ASHRAE comfort standard)          │
│ Status: ✓ ACHIEVED (720 ppm < 800 ppm target)           │
│ Occupancy: 250 persons (still present)                   │
│ Ventilation: Sufficient for current crowd density        │
└──────────────────────────────────────────────────────────┘

Traditional BMS Comparison:
  ├─ Fixed schedule: 4 fans @ 60% (11:00-14:00 regardless of occupancy)
  ├─ 11:45 CO2 level: 950 ppm (insufficient ventilation for crowd)
  ├─ Result: Poor air quality, occupant complaints
  └─ AI-driven BMS: Proactive adjustment prevents CO2 spike
```

---

**Workflow WF-011: After-Hours Occupancy → Security Alert + Energy Savings**

**Business Context:**

After business hours (20:00-06:00), buildings should have minimal occupancy (night security guards, NOC/SOC staff only). Unexpected occupancy triggers dual response: (1) security alert (potential unauthorized access) and (2) local HVAC/lighting activation (comfort for authorized after-hours staff). This workflow bridges UC1 (security) and UC2 (building automation).

**Scenario:**

```
Location: Floor 5 Open Office Area, Mumbai Hub
Time: 22:30 PM (after-hours, building in energy-saving mode)
Expected Occupancy: 0 persons (floor closed)
Actual Occupancy: 2 persons detected (engineer working late on incident)
Traditional BMS: Entire floor HVAC off (temperature rises to 28°C, uncomfortable)
AI-Driven BMS (WF-011): Detect occupancy → activate local zone HVAC → send security notification
```

**Timeline:**

```
TIME: 22:30:00.000 - After-Hours Occupancy Detection

┌──────────────────────────────────────────────────────────┐
│ Camera 35 (Hallway, Floor 5)                             │
│ YOLO v8: Detects 2 persons in engineering wing          │
│ Current Mode: After-hours (20:00-06:00)                 │
│ Expected Occupancy: 0 persons (floor closed)             │
│ Badge Correlation: Query ISE pxGrid for recent swipes   │
└──────────────────────────────────────────────────────────┘
         ↓ 50ms (ISE pxGrid API call)
┌──────────────────────────────────────────────────────────┐
│ ISE pxGrid Response:                                      │
│ ───────────────────────────────────────────────────────── │
│ Badge Swipe: employee-12345 (John Doe, Senior Engineer) │
│ Swipe Time: 22:15 PM (15 minutes ago)                   │
│ Authorization: VALID (SGT-11, employee badge)            │
│ Conclusion: AUTHORIZED after-hours access                │
└──────────────────────────────────────────────────────────┘
         ↓
┌──────────────────────────────────────────────────────────┐
│ Decision Logic: Dual Action                              │
│ ───────────────────────────────────────────────────────── │
│ Action 1 (Security): Low-priority alert                  │
│   └─ Notify security: Authorized after-hours presence   │
│   └─ No blocking action (valid badge)                   │
│                                                           │
│ Action 2 (Comfort): Activate local zone HVAC/lighting   │
│   └─ Zone: FLOOR5-ENGINEERING-WING                      │
│   └─ Setpoint: 24°C (comfort temperature)               │
│   └─ Lighting: 70% (work-appropriate level)             │
│   └─ Duration: Until occupancy clears + 30 min grace    │
└──────────────────────────────────────────────────────────┘

Parallel API Calls (Action 1 + Action 2):

// Action 1: Security Alert
POST https://abhavtech.service-now.com/api/now/table/incident
{
  "short_description": "After-hours occupancy: Floor 5 Engineering",
  "description": "2 persons detected at 22:30 PM, authorized badge employee-12345",
  "priority": "4-low",
  "category": "security",
  "assignment_group": "security-team"
}

// Action 2: BMS Comfort Control
POST https://bms.abhavtech.com/api/v2/zones/FLOOR5-ENGINEERING-WING/control
{
  "zone_id": "FLOOR5-ENGINEERING-WING",
  "control_action": "local_zone_comfort",
  "temperature_setpoint": 24,
  "fan_speed": "low",
  "lighting_level": 70,
  "reason": "AI-detected after-hours occupancy (authorized badge)",
  "occupancy_count": 2,
  "badge_id": "employee-12345",
  "auto_revert_delay_minutes": 30,
  "timestamp": "2025-01-15T22:30:00.050Z"
}

TIME: 23:45:00.000 - Occupancy Clears (75 Minutes Later)

┌──────────────────────────────────────────────────────────┐
│ Camera 35: 0 persons detected for 30 minutes            │
│ Last occupancy: 23:15 PM (engineer left building)       │
│ Grace period: 30 minutes (23:15 + 0:30 = 23:45)        │
│ Action: Revert to after-hours energy-saving mode        │
└──────────────────────────────────────────────────────────┘

POST https://bms.abhavtech.com/api/v2/zones/FLOOR5-ENGINEERING-WING/control
{
  "zone_id": "FLOOR5-ENGINEERING-WING",
  "control_action": "after_hours_mode",
  "temperature_setpoint": 28,
  "fan_speed": "off",
  "lighting_level": 5,
  "reason": "AI-detected: 0 occupancy for 30 minutes, revert to energy-saving",
  "timestamp": "2025-01-15T23:45:00.000Z"
}

Energy Savings Calculation:
  ├─ HVAC active: 22:30-23:45 = 75 minutes = 1.25 hours
  ├─ Zone size: 280 sqm (partial floor, engineering wing only)
  ├─ HVAC consumption: 8 kW × 1.25 hours = 10 kWh
  ├─ Traditional BMS: Entire floor HVAC off (0 kWh, but uncomfortable)
  │   └─ Alternative: Entire floor HVAC on (45 kW × 1.25 = 56.25 kWh)
  ├─ AI-driven BMS: Local zone only (10 kWh)
  └─ Savings vs. full floor: 56.25 - 10 = 46.25 kWh (82% reduction)
```

---

### 2.2.4 Performance Metrics & Validation

**Energy Savings Summary (Annual, Both Sites):**

| Workflow | Use Case | Annual Savings | Calculation Basis |
|----------|----------|---------------|------------------|
| WF-009 | Conference room unoccupied HVAC | ₹1,423,800 (~$17K USD) | 21 rooms × 50% empty × 10 hrs/day × 3 kW × ₹7/kWh × 365 days |
| WF-010 | Cafeteria dynamic ventilation | ₹361,600 (~$4,300 USD) | 8 fans × 2 kW × 10 hrs/day × 50% over-ventilation × ₹7/kWh × 365 days |
| WF-011 | After-hours local zone control | ₹876,000 (~$10,500 USD) | 150 nights/year × 2 hrs × 40 kW saved × ₹7/kWh |
| **TOTAL** | **UC2 Combined** | **₹2,661,400 (~$32K USD)** | **Mumbai ₹1,595,400 + Chennai ₹1,066,000** |

**Additional Cost Savings:**

- **Maintenance Reduction:** 15% reduction in HVAC runtime = 15% longer equipment life = ₹450,000/year deferred replacement costs
- **Carbon Offset:** 1,200 tons CO2 reduction = ₹240,000/year (carbon credit trading at ₹200/ton)
- **Total UC2 Savings: ₹3,351,400/year (~$40K USD)**

**UC2 ROI Analysis:**

```
Investment:
  ├─ Hardware: ₹0 (reuses UC1 XE9305 + XE130c M8 infrastructure)
  ├─ BMS API Integration: ₹800,000 (Honeywell professional services)
  ├─ AI Model Training: ₹400,000 (custom dataset annotation, validation)
  ├─ Software Development: ₹600,000 (decision logic, API clients)
  └─ Total: ₹1,800,000 (~$21,600 USD)

Annual Savings: ₹3,351,400 (~$40K USD)
Payback Period: 1,800,000 / 3,351,400 = 0.54 years (~6.5 months)
3-Year ROI: (3 × 3,351,400 - 1,800,000) / 1,800,000 = 458% ROI
```

**Occupancy Detection Accuracy (30-Day Validation):**

| Space Type | True Positive | False Positive | False Negative | Precision | Recall | F1 Score |
|------------|--------------|----------------|----------------|-----------|--------|----------|
| Conference Rooms | 1,240 events | 28 events | 15 events | 97.8% | 98.8% | 98.3% |
| Cafeteria | 850 events | 42 events | 8 events | 95.3% | 99.1% | 97.2% |
| Hallways | 3,200 events | 160 events | 45 events | 95.2% | 98.6% | 96.9% |
| After-Hours | 85 events | 2 events | 1 event | 97.7% | 98.8% | 98.3% |
| **AVERAGE** | **5,375** | **232 (4.1%)** | **69 (1.3%)** | **96.5%** | **98.8%** | **97.7%** |

**Note:** False positives (4.1%) result in unnecessary HVAC adjustments (minor energy waste, no comfort impact). False negatives (1.3%) result in delayed HVAC adjustments (temporary discomfort, recovers within 5 minutes).

---

### 2.2.5 Integration Summary

**UC2 Leverages UC1 Infrastructure (Zero Incremental Hardware Cost):**

| Component | UC1 (Security) | UC2 (Building Automation) | Shared |
|-----------|----------------|---------------------------|--------|
| **Hardware** | XE9305 + XE130c M8 | Same infrastructure | ✓ 100% shared |
| **GPU** | NVIDIA L4 24GB | Same GPU | ✓ 75% UC1 + 20% UC2 = 95% utilization |
| **Cameras** | 120 cameras | 40 cameras (subset of UC1) | ✓ Same cameras |
| **Network** | Catalyst 9300/9500 | Same network | ✓ Same infrastructure |
| **AI Model** | YOLO v8n person detection | Same model | ✓ Model reuse |
| **Power** | 700W (2× 350W nodes) | +0W incremental | ✓ Same power budget |

**BMS Integration Points:**

| Integration | Protocol | Latency | Purpose |
|-------------|----------|---------|---------|
| Honeywell EBI R410.1 | HTTPS REST API (OAuth 2.0) | 50ms | HVAC/lighting control commands |
| ISE pxGrid | WebSocket/HTTPS | 50ms | Badge correlation (WF-011 after-hours) |
| ServiceNow | HTTPS REST API | 60ms | Security incident ticketing (WF-011) |

**Total Bandwidth Impact:**

```
UC1 (Security): 
  ├─ Inbound: 960 Mbps (120 cameras)
  ├─ Outbound: 50 Mbps (security APIs)
  └─ Total: 1,010 Mbps

UC2 (Building Automation):
  ├─ Inbound: 0 Mbps (reuses UC1 camera streams, no additional bandwidth)
  ├─ Outbound: +5 Mbps (BMS API calls, low volume)
  └─ Total: +5 Mbps incremental

Combined UC1 + UC2:
  └─ Total: 1,015 Mbps (5% of 20 Gbps available capacity)
```

**Deployment Considerations:**

✅ **Advantages:**
- Zero hardware investment (infrastructure reuse)
- 6.5-month payback period (excellent ROI)
- Improved occupant comfort (real-time adjustments vs. fixed schedules)
- Environmental benefits (15-20% carbon footprint reduction)
- Facilities intelligence (space utilization analytics)

⚠️ **Challenges:**
- BMS integration complexity (Honeywell EBI API learning curve)
- Calibration period (2-4 weeks baseline data collection, threshold tuning)
- False positive handling (4.1% rate results in minor unnecessary adjustments)
- After-hours edge cases (night cleaning crews may not have badges, requires manual exception list)

**Recommendation:**

Proceed with UC2 deployment immediately following UC1 completion. The infrastructure reuse and strong ROI (458% over 3 years) justify aggressive rollout, with phased approach:
- Phase 1 (Weeks 1-2): Conference rooms (WF-009, highest savings)
- Phase 2 (Weeks 3-4): Cafeteria (WF-010, medium savings)
- Phase 3 (Weeks 5-6): After-hours (WF-011, security + energy benefit)

---

*Next: Section 2.1.1 REVISED (update hardware references) + Section 2.1.3 REVISED (update hardware + timeline with 4ms latency)*