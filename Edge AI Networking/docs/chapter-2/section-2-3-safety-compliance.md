# Safety & Compliance Monitoring

## 2.3 USE CASE 3: SAFETY & COMPLIANCE MONITORING

### Overview

Use Case 3 (UC3) enhances workplace safety and regulatory compliance through AI-powered detection of safety violations and hazardous conditions. Unlike traditional manual safety inspections conducted weekly or monthly, UC3 provides continuous 24×7 monitoring with immediate supervisor alerts, enabling rapid intervention before incidents escalate into injuries or OSHA violations.

**Business Impact:**

- **Proactive Safety:** Real-time detection of PPE violations, fire hazards, and slip/fall risks (vs. reactive incident response)
- **Regulatory Compliance:** Automated documentation for OSHA, NFPA, insurance audits
- **Liability Reduction:** Early hazard detection prevents workplace injuries and associated costs
- **Insurance Benefits:** Demonstrated safety programs may qualify for reduced premium rates

**Technical Architecture:**

UC3 leverages the **same Cisco Unified Edge infrastructure (UCS XE9305 chassis with XE130c M8 compute nodes)** deployed for UC1 (Security) and UC2 (Building Automation). The key architectural advantage is GPU resource sharing: UC3 safety models run on the NVIDIA L4 GPU alongside existing security and occupancy detection models, achieving 85-90% combined GPU utilization with zero incremental hardware investment.

**Integration Points:**

Edge AI nodes integrate with:
- **BMS Fire Alarm System:** Thermal detection triggers fire alarm activation and HVAC smoke control sequences
- **ServiceNow ITSM:** Safety incidents create tickets with video evidence for supervisor investigation
- **Webex Teams:** Real-time mobile alerts to safety supervisors and facilities management
- **ISE pxGrid:** Badge correlation identifies specific employees for PPE violation follow-up

**Deployment Scope:**

UC3 monitors high-risk zones where safety incidents are most likely:
- **Loading Dock:** PPE violations (missing hard hats, safety vests) during delivery operations
- **Server Room / Electrical Room:** Fire/smoke detection via thermal cameras
- **Hallways / Stairwells:** Slip/fall detection via pose estimation algorithms
- **Cafeteria Kitchen (Future):** Heat stress detection for kitchen staff during equipment malfunctions

---

### 2.3.1 AI Models for Safety Monitoring

**Model Overview:**

UC3 deploys three specialized AI model pipelines on the same UCS XE130c M8 compute nodes used for UC1 and UC2:

1. **PPE Detection:** Custom CNN trained on construction/warehouse datasets to detect hard hats, safety vests, gloves
2. **Fire/Smoke Detection:** Thermal anomaly detection analyzing FLIR camera feeds for temperature spikes
3. **Slip/Fall Detection:** Pose estimation (OpenPose architecture) tracking human skeletal positions for fall events

All models run on the NVIDIA L4 GPU with INT8 quantization for optimal performance.

---

#### Model 1: PPE Detection (Hard Hat & Safety Vest)

**Objective:** Detect workers in loading dock areas without required personal protective equipment (PPE) and alert supervisors for immediate intervention.

**AI Model Specifications:**

```
Model Architecture: Custom CNN (YOLOv8 base + PPE classification head)
Framework: ONNX Runtime with TensorRT optimization
Precision: INT8 quantized (4× faster inference)
Model Size: 8.5 MB (YOLO v8n base 6.2 MB + PPE head 2.3 MB)
Input: 640×640×3 RGB tensor
Output: Person bounding box + PPE classification [hard_hat, safety_vest, gloves]

Training Dataset:
  ├─ Construction Safety Dataset (CHV): 5,000 labeled images
  ├─ Warehouse PPE Dataset (custom): 3,200 images from Abhavtech loading dock
  └─ Data augmentation: Rotation, brightness, occlusion simulation

Performance (on NVIDIA L4 GPU, UCS XE130c M8):
  ├─ Inference Time: 28ms per frame (YOLO 20ms + PPE classification 8ms)
  ├─ Accuracy: 93% mAP@0.5 (PPE detection on Abhavtech test set)
  ├─ False Positive Rate: 8% (worker wearing dark shirt misclassified as no vest)
  └─ GPU Memory: 1.8 GB VRAM (leaves 22.2 GB for UC1/UC2 models)
```

**Detection Logic:**

```python
def detect_ppe_violation(frame, zone_polygon):
    """
    Detect PPE violations in loading dock zones
    
    Args:
        frame: 1920×1080 RGB camera frame
        zone_polygon: Loading dock boundary coordinates
    
    Returns:
        violations: List of detected PPE violations with person bounding boxes
    """
    
# Step 1: Person detection (YOLO v8n base model - same as UC1)
    persons = yolo_detect_persons(frame)  # Returns bounding boxes
    
# Step 2: Filter persons within loading dock zone
    persons_in_zone = [p for p in persons if point_in_polygon(p['center'], zone_polygon)]
    
    violations = []
    
    for person in persons_in_zone:
# Step 3: Crop person bounding box region
        person_crop = crop_image(frame, person['bbox'])
        
# Step 4: PPE classification (custom CNN head)
        ppe_detected = classify_ppe(person_crop)
# Returns: {'hard_hat': True/False, 'safety_vest': True/False, 'gloves': True/False}
        
# Step 5: Violation logic (AND condition: both hard hat AND vest required)
        if not ppe_detected['hard_hat'] or not ppe_detected['safety_vest']:
            violations.append({
                'person_bbox': person['bbox'],
                'missing_ppe': [],
                'timestamp': current_timestamp(),
                'zone': 'Loading Dock'
            })
            
            if not ppe_detected['hard_hat']:
                violations[-1]['missing_ppe'].append('hard_hat')
            if not ppe_detected['safety_vest']:
                violations[-1]['missing_ppe'].append('safety_vest')
    
    return violations

# Example output:
violations = [
    {
        'person_bbox': [450, 280, 580, 620],
        'missing_ppe': ['hard_hat', 'safety_vest'],
        'timestamp': '2025-01-15T10:23:45.000Z',
        'zone': 'Loading Dock'
    }
]
```

**Monitored Zones:**

| Zone ID | Zone Name | Location | Cameras | PPE Requirements | Enforcement |
|---------|-----------|----------|---------|------------------|-------------|
| **PPE-001** | Loading Dock Interior | Ground Floor | 6× Indoor Fixed | Hard hat + Safety vest | Mandatory (delivery operations) |
| **PPE-002** | Loading Dock Exterior | Outdoor | 4× Outdoor PTZ | Hard hat + Safety vest | Mandatory (vehicle maneuvering) |
| **PPE-003** | Warehouse Storage | Ground Floor | 4× Indoor Fixed | Hard hat only | Mandatory (forklift operations) |
| **PPE-004** | Server Room Entrance | Floor 1 | 2× Indoor Fixed | None (IT staff exempted) | N/A |

**Detection Thresholds:**

```
Alert Trigger Conditions:
  ├─ Confidence Threshold: ≥85% (PPE classification confidence)
  ├─ Duration Threshold: ≥10 seconds (person in zone without PPE)
  ├─ Debounce Period: 60 seconds (prevent duplicate alerts for same person)
  └─ Badge Correlation: Query ISE pxGrid for employee identity (optional enhancement)

Alert Priority:
  ├─ P2-High: Single PPE violation (1 person, 1 missing item)
  ├─ P1-Critical: Multiple violations (3+ persons without PPE simultaneously)
  └─ P3-Medium: Repeat offender (same employee ID, 3+ violations in 7 days)
```

---

#### Model 2: Fire/Smoke Detection (Thermal Anomaly)

**Objective:** Detect fire, smoke, or abnormal heat sources in server room and electrical room before fire alarms activate, enabling faster evacuation and suppression response.

**AI Model Specifications:**

```
Model Architecture: Thermal Anomaly Detection (Threshold-based + Gradient Analysis)
Framework: OpenCV + NumPy (CPU-based, no GPU required)
Input: 320×240 thermal image (16-bit temperature values -20°C to +350°C)
Output: Anomaly bounding boxes + temperature statistics

Algorithm (runs on Intel Xeon 6 SoC CPU, UCS XE130c M8):
  ├─ Stage 1: Temperature Threshold Detection
  │   └─ Flag pixels >85°C (equipment overheating threshold)
  ├─ Stage 2: Gradient Analysis
  │   └─ Detect rapid temperature increases >10°C/second (fire signature)
  ├─ Stage 3: Blob Analysis
  │   └─ Connected component analysis: minimum 50 pixels (filter noise)
  └─ Stage 4: Persistence Check
      └─ Anomaly must persist >5 seconds (filter transient events)

Performance:
  ├─ Processing Time: 15ms per frame (CPU-based, no GPU load)
  ├─ Detection Range: 3-30 meters (thermal camera FOV)
  ├─ Temperature Accuracy: ±2°C (FLIR A310f sensor specification)
  └─ False Positive Rate: <2% (hot coffee cups occasionally flagged)
```

**Detection Logic:**

```python
def detect_thermal_anomaly(thermal_frame, baseline_temp_map):
    """
    Detect fire/smoke via thermal camera analysis
    
    Args:
        thermal_frame: 320×240 array of temperature values (°C)
        baseline_temp_map: Historical average temperature map for this camera
    
    Returns:
        anomalies: List of detected thermal anomalies with locations
    """
    
    anomalies = []
    
# Step 1: Absolute temperature threshold (equipment overheating)
    hot_pixels = np.where(thermal_frame > 85.0)  # 85°C threshold
    
    if len(hot_pixels[0]) > 50:  # Minimum 50 contiguous pixels
# Step 2: Calculate temperature gradient (rate of change)
        temp_gradient = thermal_frame - baseline_temp_map
        rapid_heating = np.where(temp_gradient > 10.0)  # >10°C increase
        
# Step 3: Blob analysis (connected component detection)
        blob_mask = np.zeros_like(thermal_frame, dtype=np.uint8)
        blob_mask[hot_pixels] = 255
        
        contours, _ = cv2.findContours(blob_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for contour in contours:
            area = cv2.contourArea(contour)
            
            if area > 50:  # Minimum blob size (filter noise)
# Calculate bounding box
                x, y, w, h = cv2.boundingRect(contour)
                
# Calculate average temperature in blob
                blob_region = thermal_frame[y:y+h, x:x+w]
                avg_temp = np.mean(blob_region)
                max_temp = np.max(blob_region)
                
                anomalies.append({
                    'bbox': [x, y, x+w, y+h],
                    'avg_temp': avg_temp,
                    'max_temp': max_temp,
                    'area_pixels': area,
                    'timestamp': current_timestamp()
                })
    
    return anomalies

# Example output:
anomalies = [
    {
        'bbox': [150, 120, 200, 180],
        'avg_temp': 92.5,
        'max_temp': 105.3,
        'area_pixels': 850,
        'timestamp': '2025-01-15T03:12:08.000Z'
    }
]
```

**Monitored Zones:**

| Zone ID | Zone Name | Location | Cameras | Baseline Temp | Alert Threshold | Integration |
|---------|-----------|----------|---------|---------------|-----------------|-------------|
| **FIRE-001** | Server Room Interior | Floor 1 | 2× Thermal | 24°C ± 2°C | >85°C or +10°C/sec | BMS Fire Alarm + HVAC Shutdown |
| **FIRE-002** | Electrical Room | Ground Floor | 2× Thermal | 28°C ± 3°C | >85°C or +10°C/sec | BMS Fire Alarm + Power Isolation |
| **FIRE-003** | Loading Dock Exterior | Outdoor | 6× Thermal | 32°C ± 5°C | >150°C (dumpster fire) | Facilities Alert Only |

**BMS Integration - Fire Detection Response:**

```
Fire Detected (Thermal Camera) → Edge AI Decision Logic

IF max_temp > 85°C AND gradient > 10°C/sec:
  └─ Trigger: HIGH CONFIDENCE fire event
     ├─ Action 1: BMS Fire Alarm Activation (API call to Honeywell EBI)
     │   POST https://bms.abhavtech.com/api/v2/fire-alarm/zones/FIRE-001/activate
     │   Response Time: ~500ms (fire alarm sounds, strobes activate)
     │
     ├─ Action 2: HVAC Emergency Shutdown (prevent smoke spread)
     │   POST https://bms.abhavtech.com/api/v2/zones/FLOOR1-ALL/control
     │   {
     │     "hvac_mode": "emergency_shutdown",
     │     "dampers": "closed",
     │     "fans": "off",
     │     "reason": "Fire detected by thermal camera FIRE-001"
     │   }
     │   Response Time: ~800ms (HVAC shuts down, dampers close)
     │
     ├─ Action 3: ServiceNow Critical Incident
     │   POST https://abhavtech.service-now.com/api/now/table/incident
     │   Priority: P1-Critical, Category: Fire/Safety
     │   Attachments: Thermal camera snapshot (320×240 heatmap image)
     │   Response Time: ~60ms
     │
     └─ Action 4: Webex Emergency Alert (Facilities + Fire Warden)
         POST https://webexapis.com/v1/messages
         Recipients: facilities-manager@abhavtech.com, fire-warden@abhavtech.com
         Message: "🔥 FIRE DETECTED - Server Room Floor 1 - Thermal Camera Alert"
         Response Time: ~80ms

Total Latency: Fire detection → Fire alarm activation = 1.5 seconds
  ├─ Thermal processing (CPU): 15ms
  ├─ Decision logic: 10ms
  ├─ BMS fire alarm API: 500ms
  ├─ BMS HVAC shutdown API: 800ms (parallel with alarm)
  └─ ServiceNow + Webex: 140ms (parallel)
```

---

#### Model 3: Slip/Fall Detection (Pose Estimation)

**Objective:** Detect slip, trip, or fall incidents in hallways and stairwells to enable immediate first-aid response and liability documentation.

**AI Model Specifications:**

```
Model Architecture: OpenPose (Human Pose Estimation)
Framework: ONNX Runtime with TensorRT optimization
Precision: FP16 (pose estimation requires higher precision than INT8)
Model Size: 25 MB (larger than YOLO due to keypoint detection complexity)
Input: 640×480×3 RGB tensor (lower resolution acceptable for pose)
Output: 18 skeletal keypoints per person [nose, neck, shoulders, elbows, wrists, hips, knees, ankles]

Training Dataset:
  ├─ COCO Keypoints (330K images with pose annotations)
  ├─ Fall Detection Dataset (custom): 1,500 videos of simulated falls
  └─ Abhavtech hallway footage: 800 videos (normal walking baseline)

Performance (on NVIDIA L4 GPU, UCS XE130c M8):
  ├─ Inference Time: 45ms per frame (pose estimation more complex than YOLO)
  ├─ Accuracy: 88% fall detection on test set (12% missed falls - rapid falls difficult)
  ├─ False Positive Rate: 15% (sitting down on floor, tying shoes misclassified)
  └─ GPU Memory: 2.5 GB VRAM (FP16 precision, higher than INT8)
```

**Detection Logic:**

```python
def detect_fall_event(frame, previous_poses):
    """
    Detect slip/trip/fall via pose estimation analysis
    
    Args:
        frame: 640×480 RGB camera frame
        previous_poses: Last 10 frames of pose keypoints (temporal context)
    
    Returns:
        fall_detected: Boolean + fall event metadata
    """
    
# Step 1: Person detection (YOLO v8n - same as UC1/UC2)
    persons = yolo_detect_persons(frame)
    
    for person in persons:
# Step 2: Crop person region for pose estimation
        person_crop = crop_image(frame, person['bbox'])
        
# Step 3: Pose estimation (OpenPose model)
        keypoints = pose_estimate(person_crop)
# Returns: 18 keypoints [x, y, confidence] for body parts
        
# Step 4: Fall detection heuristics
        
# Heuristic 1: Vertical position (rapid descent)
        hip_y = (keypoints['left_hip']['y'] + keypoints['right_hip']['y']) / 2
        shoulder_y = (keypoints['left_shoulder']['y'] + keypoints['right_shoulder']['y']) / 2
        
        if previous_poses:
            hip_y_prev = previous_poses[-1]['hip_y']
            vertical_velocity = (hip_y - hip_y_prev) / 0.033  # pixels/sec (30 FPS)
            
            if vertical_velocity > 150:  # Rapid downward movement (>150 pixels/sec)
# Heuristic 2: Body orientation (horizontal vs vertical)
                body_angle = calculate_angle(shoulder_y, hip_y, keypoints['left_ankle']['y'])
                
                if body_angle > 60:  # Body >60° from vertical (lying down)
# Heuristic 3: Temporal persistence (not just sitting down)
                    if len(previous_poses) >= 5:  # At least 5 frames history
                        standing_frames = sum(1 for p in previous_poses[-5:] if p['body_angle'] < 30)
                        
                        if standing_frames >= 3:  # Was standing in 3+ of last 5 frames
                            return {
                                'fall_detected': True,
                                'person_bbox': person['bbox'],
                                'fall_type': 'rapid_descent',
                                'body_angle': body_angle,
                                'vertical_velocity': vertical_velocity,
                                'timestamp': current_timestamp(),
                                'confidence': 0.87
                            }
    
    return {'fall_detected': False}

# Example output:
fall_event = {
    'fall_detected': True,
    'person_bbox': [320, 180, 480, 450],
    'fall_type': 'rapid_descent',
    'body_angle': 72,
    'vertical_velocity': 185,
    'timestamp': '2025-01-15T14:48:22.000Z',
    'confidence': 0.87
}
```

**Monitored Zones:**

| Zone ID | Zone Name | Location | Cameras | Priority | Response Procedure |
|---------|-----------|----------|---------|----------|-------------------|
| **FALL-001** | Hallway Floor 1-7 | All Floors | 14× Indoor Fixed | P1-Critical | First aid team dispatch + ambulance call |
| **FALL-002** | Stairwell North/South | All Floors | 4× Indoor Fixed | P1-Critical | First aid team dispatch (stairs = high injury risk) |
| **FALL-003** | Cafeteria | Ground Floor | 8× Indoor Fixed | P2-High | First aid assessment (wet floors common) |
| **FALL-004** | Loading Dock | Ground Floor | 6× Indoor Fixed | P2-High | First aid assessment + OSHA incident report |

**Alert Response - Fall Detection:**

```
Fall Detected → Immediate Response Protocol

IF fall_detected == True AND confidence > 0.80:
  └─ Trigger: HIGH CONFIDENCE fall event
     ├─ Action 1: Webex Emergency Alert (First Aid Team)
     │   POST https://webexapis.com/v1/messages
     │   Recipients: first-aid-team@abhavtech.com (5 certified responders)
     │   Message: "⚠️ FALL DETECTED - Floor 3 Hallway - Person Down - Respond Immediately"
     │   Attachment: 10-second video clip (5 sec before + 5 sec after fall)
     │   Response Time: ~80ms
     │
     ├─ Action 2: ServiceNow Critical Incident
     │   POST https://abhavtech.service-now.com/api/now/table/incident
     │   Priority: P1-Critical, Category: Safety/Fall
     │   Assignment: First Aid Team
     │   Response Time: ~60ms
     │
     ├─ Action 3: ISE Badge Correlation (Identify Person)
     │   POST https://10.30.0.1:8910/pxgrid/ise/session/query
     │   Query: Badge swipes in hallway Floor 3 (last 2 minutes)
     │   Result: employee-45678 (Jane Smith, Engineering Dept)
     │   Purpose: Alert supervisor, retrieve emergency contact, medical history
     │   Response Time: ~50ms
     │
     └─ Action 4: PA System Announcement (Future Enhancement)
         POST https://bms.abhavtech.com/api/v2/pa-system/announce
         Zone: Floor 3 (localized announcement, not building-wide)
         Message: "Medical emergency on Floor 3. First aid team en route."
         Response Time: ~500ms

Total Latency: Fall detection → First aid team notified = 200ms
  ├─ Pose estimation: 45ms
  ├─ Fall detection logic: 15ms
  ├─ Webex alert: 80ms (critical path - mobile push to first aid team)
  └─ ServiceNow + ISE: 110ms (parallel)

Expected First Aid Response Time:
  ├─ Notification to mobile: 200ms (Edge AI → Webex)
  ├─ First aider sees alert: +5 seconds (phone vibrate, unlock, read)
  ├─ First aider arrives: +60-90 seconds (average travel time within building)
  └─ Total: ~90-100 seconds from fall to first aid arrival
```

---

### 2.3.2 Workflow Examples (UC3)

**Workflow WF-012: PPE Violation → Supervisor Alert**

**Scenario:**

```
Location: Loading Dock Interior, Ground Floor, Mumbai Hub
Time: 10:23 AM (delivery truck arrival, high activity)
Detection: 1 person detected in loading dock without hard hat and safety vest
Expected: All personnel in loading dock must wear PPE during delivery operations
```

**Timeline:**

```
TIME: 10:23:15.000 - Person Enters Loading Dock (No PPE)

Camera 16 (Indoor Fixed, Loading Dock Interior):
  ├─ Person detected: YOLO v8n (confidence 0.94)
  ├─ Zone validation: Person in PPE-001 zone (loading dock)
  └─ Frame sent to PPE detection model

TIME: 10:23:15.028 - PPE Detection Result (28ms inference)

PPE Classification Result (NVIDIA L4 GPU, UCS XE130c M8):
  ├─ Hard hat: NOT DETECTED (confidence 0.91)
  ├─ Safety vest: NOT DETECTED (confidence 0.88)
  ├─ Person wearing: Dark blue shirt, jeans (no reflective vest)
  └─ Decision: PPE VIOLATION (missing both required items)

TIME: 10:23:15.038 - Duration Check (10 seconds minimum)

Edge AI monitors person continuously:
  ├─ 10:23:15 - 10:23:25: Person still in zone, no PPE (10 seconds elapsed)
  └─ Decision: Trigger alert (duration threshold met)

TIME: 10:23:25.038 - Supervisor Alert Actions

Action 1: ServiceNow Incident
POST https://abhavtech.service-now.com/api/now/table/incident
{
  "short_description": "PPE Violation - Loading Dock - Missing Hard Hat + Vest",
  "priority": "2",
  "category": "safety",
  "location": "Loading Dock Interior, Ground Floor",
  "description": "Person detected in loading dock without required PPE (hard hat, safety vest). Violation occurred at 10:23 AM. Video snapshot attached.",
  "assigned_to": "safety-supervisor-mumbai"
}

Action 2: Webex Alert (Safety Supervisor)
POST https://webexapis.com/v1/messages
{
  "toPersonEmail": "safety-supervisor-mumbai@abhavtech.com",
  "markdown": "⚠️ **PPE VIOLATION - Loading Dock**\n\n**Location:** Ground Floor Loading Dock Interior\n**Time:** 10:23 AM\n**Missing PPE:** Hard hat, Safety vest\n\n[View Video Snapshot](https://servicenow.abhavtech.com/incident/INC0012346)\n\n**Action Required:** Dispatch safety officer to loading dock immediately."
}

Action 3: Badge Correlation (Optional - Identify Employee)
POST https://10.30.0.1:8910/pxgrid/ise/session/query
{
  "location": "Loading Dock",
  "startTimestamp": "2025-01-15T10:20:00.000Z",
  "endTimestamp": "2025-01-15T10:23:25.000Z",
  "sgt": ["SGT-71"]
}

Response: Badge swipe detected - employee-12389 (delivery driver, external contractor)
Result: Notify contractor supervisor (not internal employee)

TIME: 10:23:25.178 - All Actions Complete (140ms)

Supervisor receives mobile notification:
  ├─ ServiceNow incident INC0012346 created
  ├─ Webex mobile push delivered
  └─ Safety officer dispatched to loading dock

Expected Resolution:
  ├─ 10:24:00 (35 sec): Safety officer arrives at loading dock
  ├─ 10:24:30 (1 min): Safety officer provides PPE to contractor
  └─ 10:25:00 (2 min): Contractor equipped with PPE, work resumes

Total Response Time: 2 minutes (violation detected → PPE provided → work resumed)
```

---

**Workflow WF-013: Fire Detection → Emergency Response**

**Scenario:**

```
Location: Server Room, Floor 1, Mumbai Hub
Time: 03:12 AM (after-hours, no staff present)
Detection: Thermal camera detects 105°C hotspot near server rack (equipment fire)
Expected: Immediate fire alarm activation and HVAC shutdown
```

**Timeline:**

```
TIME: 03:12:08.000 - Thermal Anomaly Detected

Camera 78 (FLIR Thermal, Server Room Interior):
  ├─ Baseline temperature: 24°C (server room HVAC setpoint)
  ├─ Hotspot detected: 105°C peak, 92°C average (server rack 3)
  ├─ Anomaly size: 850 pixels (approximately 0.5 sqm area)
  └─ Temperature gradient: +15°C/second (rapid heating - fire signature)

TIME: 03:12:08.015 - Fire Confidence Assessment (15ms CPU processing, Intel Xeon 6 SoC)

Thermal Analysis:
  ├─ Max temperature: 105.3°C (>> 85°C threshold)
  ├─ Gradient: +15°C/sec (>> 10°C/sec threshold)
  ├─ Persistence: 5 seconds (anomaly stable, not transient spike)
  └─ Decision: HIGH CONFIDENCE fire event

TIME: 03:12:08.025 - Emergency Actions Launch (Parallel)

Action 1: BMS Fire Alarm Activation (500ms)
POST https://bms.abhavtech.com/api/v2/fire-alarm/zones/FIRE-001/activate
{
  "zone_id": "FIRE-001",
  "zone_name": "Server Room Floor 1",
  "trigger_source": "thermal_camera_78",
  "temperature_detected": 105.3,
  "reason": "Thermal anomaly detected: Equipment fire in server rack 3"
}

Response (500ms):
{
  "status": "activated",
  "fire_alarm_status": "sounding",
  "strobe_lights": "activated",
  "pa_announcement": "Fire alarm activated Floor 1 Server Room. Evacuate immediately.",
  "timestamp": "2025-01-15T03:12:08.525Z"
}

Action 2: HVAC Emergency Shutdown (800ms)
POST https://bms.abhavtech.com/api/v2/zones/FLOOR1-ALL/control
{
  "control_action": "fire_emergency_shutdown",
  "hvac_mode": "off",
  "supply_fan": "off",
  "return_fan": "off",
  "dampers": "closed",
  "reason": "Fire detected in server room - prevent smoke circulation"
}

Response (800ms):
{
  "status": "shutdown_complete",
  "all_hvac_units": "offline",
  "smoke_dampers": "closed",
  "timestamp": "2025-01-15T03:12:08.825Z"
}

Action 3: ServiceNow Critical Incident (60ms)
POST https://abhavtech.service-now.com/api/now/table/incident
{
  "short_description": "🔥 FIRE DETECTED - Server Room Floor 1",
  "priority": "1",
  "category": "fire_emergency",
  "description": "Thermal camera detected fire in server room Floor 1. Temperature: 105°C. Fire alarm activated. HVAC shut down. Fire department notification required.",
  "assigned_to": "facilities-manager-mumbai"
}

Action 4: Webex Emergency Alert (80ms)
POST https://webexapis.com/v1/messages
{
  "toPersonEmail": "facilities-manager@abhavtech.com",
  "cc": ["fire-warden@abhavtech.com", "security-supervisor@abhavtech.com"],
  "markdown": "🔥🔥🔥 **FIRE EMERGENCY - SERVER ROOM FLOOR 1** 🔥🔥🔥\n\n**Time:** 03:12 AM\n**Location:** Server Room, Floor 1\n**Temperature Detected:** 105°C (server rack 3)\n**Fire Alarm:** ACTIVATED\n**HVAC:** SHUT DOWN\n\n**IMMEDIATE ACTIONS REQUIRED:**\n1. Call Fire Department: 101 (Mumbai)\n2. Evacuate building if fire spreads\n3. Do NOT enter server room until fire department arrives\n\n[View Thermal Camera Feed](https://edge-ai-mumbai-01.abhavtech.com/thermal/camera-78)"
}

TIME: 03:12:09.525 - All Actions Complete (1.5 seconds)

Emergency Response Status:
  ✅ Fire alarm sounding (building-wide notification)
  ✅ HVAC shut down (smoke containment)
  ✅ ServiceNow incident created (audit trail)
  ✅ Facilities manager notified (mobile alert)

Expected Response:
  ├─ 03:12:10 (2 sec): Facilities manager woken by mobile alert
  ├─ 03:13:00 (52 sec): Facilities manager calls fire department
  ├─ 03:20:00 (8 min): Fire department arrives on scene
  └─ 03:25:00 (13 min): Fire extinguished, server room cleared

Total Detection → Fire Department Notified: <1 minute
Total Detection → Fire Extinguished: ~13 minutes

Outcome: Early detection prevented fire spread beyond server rack. Equipment damage limited to rack 3 (8 servers destroyed, 120 servers in room protected). Zero injuries.
```

---

### 2.3.3 GPU Resource Allocation (Combined UC1 + UC2 + UC3)

**NVIDIA L4 GPU Utilization Analysis (UCS XE130c M8 Node):**

```
Combined Workload on Single NVIDIA L4 GPU (24GB GDDR6)

UC1 (Physical Security):
  ├─ Active cameras: 120 @ 30 FPS = 3,600 frames/sec
  ├─ Models: YOLO v8n (person), DeepSORT (tracking), PPE CNN, LPR pipeline
  ├─ GPU utilization: 55-60%
  ├─ GPU memory: 18 GB / 24 GB
  └─ Inference time: 20ms per frame average

UC2 (Building Automation):
  ├─ Active cameras: 40 @ 30 FPS = 1,200 frames/sec
  ├─ Model: YOLO v8n (person occupancy - reuses UC1 model)
  ├─ GPU utilization: +15-20% (incremental)
  ├─ GPU memory: +850 MB
  └─ Inference time: 20ms per frame (shared model)

UC3 (Safety & Compliance):
  ├─ Active cameras:
  │   ├─ PPE detection: 10 cameras @ 30 FPS = 300 frames/sec
  │   ├─ Fire/smoke: 10 thermal cameras @ 9 FPS = 90 frames/sec (CPU-only, no GPU)
  │   └─ Slip/fall: 14 cameras @ 30 FPS = 420 frames/sec
  ├─ Models:
  │   ├─ YOLO v8n + PPE CNN: 28ms inference
  │   ├─ Thermal anomaly: CPU-only (15ms, no GPU load)
  │   └─ OpenPose (pose estimation): 45ms inference (FP16 precision)
  ├─ GPU utilization: +10-15% (incremental)
  ├─ GPU memory: +4.3 GB (1.8 GB PPE + 2.5 GB OpenPose)
  └─ Inference time: 28ms PPE, 45ms pose (varies by model)

Combined GPU Utilization:
  ├─ Total GPU utilization: 80-95%
  ├─ Total GPU memory: 23.15 GB / 24 GB (96% utilization)
  ├─ Peak load periods: 09:00-18:00 (business hours, all use cases active)
  └─ Off-peak load: 60-70% (after-hours, reduced occupancy)

GPU Capacity Assessment:
  ✅ ACCEPTABLE: 80-95% utilization is optimal (not oversubscribed)
  ✅ Headroom: 5-20% GPU capacity available for spikes
  ⚠️ Memory Tight: 96% memory utilization (close to limit)
  ✅ Thermal: GPU temperature 65-72°C (within 0-90°C spec, NVIDIA L4)
  ✅ Power: 70-72W (within 72W TDP envelope, NVIDIA L4)

Recommendation:
  ├─ Current configuration: SUSTAINABLE for Mumbai + Chennai hubs
  ├─ Future expansion: Phase 5 branch sites will require additional compute nodes
  │   └─ XE9305 Slots 3-5 reserved for Phase 5 (240 additional cameras)
  └─ No immediate hardware upgrades required
```

---

### 2.3.4 Integration Summary

**UC3 Integration Points:**

| Integration | Protocol | Latency | Purpose | Use Case |
|-------------|----------|---------|---------|----------|
| **BMS Fire Alarm** | HTTPS REST | 500ms | Fire alarm activation, HVAC shutdown | Fire/smoke detection |
| **ISE pxGrid** | WebSocket/HTTPS | 50ms | Badge correlation (identify employees) | PPE violations, fall incidents |
| **ServiceNow** | HTTPS REST | 60ms | Safety incident ticketing | All UC3 violations |
| **Webex Teams** | HTTPS REST | 80ms | Emergency alerts (mobile push) | Critical safety events |

**Camera Distribution (UC3 Specific):**

| Camera Type | UC3 Function | Qty per Site | Total (Both Sites) | Frame Rate | Processing |
|-------------|--------------|--------------|-------------------|------------|------------|
| Indoor Fixed (Axis P3715) | PPE detection | 10 | 20 | 30 FPS | GPU (28ms inference) |
| Thermal (FLIR A310f) | Fire/smoke detection | 10 | 20 | 9 FPS | CPU-only (15ms) |
| Indoor Fixed (Axis P3715) | Slip/fall detection | 14 | 28 | 30 FPS | GPU (45ms inference) |
| **Total UC3** | | **34** | **68** | | |

**Note:** Same cameras used for multiple use cases (e.g., loading dock cameras serve UC1 perimeter + UC3 PPE detection simultaneously).

---

### 2.3.5 Performance Validation

**UC3 Detection Accuracy (30-Day Pilot Results):**

| Function | True Positives | False Positives | False Negatives | Precision | Recall | F1 Score |
|----------|---------------|-----------------|-----------------|-----------|--------|----------|
| PPE Detection | 145 violations | 12 (8.3%) | 8 (5.5%) | 92.4% | 94.8% | 93.6% |
| Fire/Smoke Detection | 3 events | 1 (coffee pot) | 0 | 75.0% | 100% | 85.7% |
| Slip/Fall Detection | 7 falls | 11 (sitting down) | 2 (rapid falls) | 38.9% | 77.8% | 51.9% |

**Notes:**
- **PPE Detection:** High accuracy, suitable for automated alerts. False positives mostly dark clothing misclassified as missing vest.
- **Fire/Smoke Detection:** Perfect recall (no missed fires), but 1 false positive (hot coffee pot 95°C flagged). Acceptable for critical safety.
- **Slip/Fall Detection:** Low precision (39%) due to sitting/tying shoes misclassifications. Requires human review before emergency response.

**Recommendation:**
- PPE violations: Automated supervisor alerts (high confidence)
- Fire/smoke: Automated fire alarm activation (zero tolerance for missed fires)
- Slip/fall: Semi-automated (Webex alert to first aid team, human confirms via video before dispatching)

---

*Next: Section 2.4 - Cross-Use Case Correlation (how UC1 + UC2 + UC3 work together)*