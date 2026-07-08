# Security Functions & AI Models

## 2.1 USE CASE 1: INTELLIGENT PHYSICAL SECURITY

Use Case 1 (UC1) delivers comprehensive physical security coverage through AI-powered detection across six security functions. Unlike traditional video management systems requiring constant human monitoring, UC1 combines edge AI inference running on **Cisco Unified Edge (UCS XE9305 chassis with XE130c M8 compute nodes)** with multi-source validation from Cisco's observability platforms (ISE, Splunk MLTK, ThousandEyes, AppDynamics) to achieve <500ms automated response times while maintaining <5% false positive rates.

**Edge AI Platform:** Cisco UCS XE130c M8 compute nodes with NVIDIA L4 GPU (24GB) process video streams from 120 cameras locally in the IDF room, achieving 4ms camera-to-inference latency (vs. 15-20ms if deployed in separate datacenter).

**Network Integration:** Cameras (SGT-70) connect via Catalyst 9300 access switches to Catalyst 9500 distribution switches, with direct 10 Gbps links to XE130c M8 nodes (SGT-95) in the same IDF room for ultra-low latency.

**Observability Integration:** Edge AI validates detections against ISE pxGrid (badge events), Splunk MLTK (historical patterns), ThousandEyes (network health), and AppDynamics (application health) before triggering automated FTD blocking or XDR incident creation.

---

### 2.1.1 Security Functions & AI Models

UC1 implements six complementary security functions, each leveraging specific AI models optimized for distinct detection scenarios. The following sections provide detailed technical specifications for each function, including AI model architectures, detection logic, integration points, and performance targets.

---

#### Function 1: Perimeter Intrusion Detection

**Objective:** Detect unauthorized entry at building perimeter with <500ms response time and <5% false positive rate through multi-source validation.

**AI Model Specifications:**

| Specification | Value | Rationale |
|--------------|-------|-----------|
| **Model Architecture** | YOLO v8n (nano variant) | Optimized for edge deployment: 3.2M parameters vs. 43.7M (YOLO v8x), 6× faster inference with minimal accuracy loss |
| **Input Size** | 640×640 pixels | Standard YOLO input, balances accuracy vs. speed |
| **Training Dataset** | COCO 2017 (80 classes) + Abhavtech custom (5,000+ images) | Pre-trained on COCO, fine-tuned on Abhavtech perimeter imagery (India-specific: auto-rickshaws, delivery personnel, stray animals) |
| **Object Classes** | Person, vehicle (car, truck, motorcycle, bicycle) | Focused on security-relevant classes, ignores non-threats (birds, trees) |
| **Confidence Threshold** | ≥90% for automated action, 70-90% for manual review | High threshold ensures low false positives for automated FTD blocking |
| **Inference Time** | 18-22ms on NVIDIA L4 GPU (INT8 quantization) | Meets <500ms end-to-end SLA (inference is only 4% of total latency) |
| **Accuracy (mAP@0.5)** | 87% on Abhavtech test set (2,000 images) | Validated on actual perimeter camera footage from Mumbai/Chennai |
| **Model File Size** | 6.2 MB (INT8 quantized ONNX format) | Small size enables fast K8s pod startup (<5 seconds) |
| **GPU Memory** | 1.2 GB VRAM per inference container | Multiple containers can run on single L4 24GB GPU (20× parallel inference) |

**Detection Zones & Camera Coverage:**

Mumbai Hub - Perimeter Coverage (40 outdoor PTZ cameras):
- **North Perimeter (12 cameras):** Main entrance, visitor parking (overlapping 360° coverage, 15m detection range)
- **East Perimeter (10 cameras):** Loading dock, delivery entrance (90° FOV overlap for redundancy)
- **South Perimeter (10 cameras):** Employee parking, emergency exit (night vision IR 200m range)
- **West Perimeter (8 cameras):** Service entrance, dumpster area (thermal backup for low-light)

Chennai Hub - Perimeter Coverage (40 outdoor PTZ cameras):
- Identical distribution as Mumbai for deployment consistency

**Detection Logic Workflow:**

```
Step 1: Frame Acquisition (0ms)
- Camera captures 1080p frame @ 30 FPS (33ms interval per frame)
- RTSP stream: H.264/H.265 adaptive bitrate (4-8 Mbps per camera)
- Edge AI server receives frame via network (LAN latency <5ms)

Step 2: Pre-Processing (5ms)
- Resize frame 1920×1080 → 640×640 (letterbox padding to maintain aspect ratio)
- Normalize pixel values: [0-255] → [0-1] float32
- Convert colorspace: BGR → RGB (OpenCV to YOLO format)

Step 3: AI Inference (20ms)
- YOLO v8 inference on NVIDIA L4 GPU (TensorRT optimized)
- Output: Bounding boxes [x1, y1, x2, y2], object class, confidence score
- Example output: {"class": "person", "confidence": 0.96, "bbox": [850, 320, 970, 600]}

Step 4: Post-Processing (3ms)
- Non-Maximum Suppression (NMS): Filter overlapping detections (IoU threshold 0.45)
- Filter by confidence: Discard detections <70% (too uncertain)
- Zone validation: Check if bounding box center within restricted zone polygon

Step 5: Duplicate Check (2ms)
- Query local SQLite database: SELECT * FROM events WHERE camera_id='cam-47' AND timestamp > (NOW() - 60 seconds)
- If duplicate found: Discard (debounce prevents alert spam)
- If new detection: Proceed to multi-source validation

Step 6: Multi-Source Validation (300ms - detailed in Section 2.1.3)
- Launch 4 parallel API calls: ISE pxGrid, Splunk MLTK, ThousandEyes, AppDynamics
- Validation logic: AI confidence ≥90% AND all 4 validations pass → HIGH CONFIDENCE

Step 7: Decision & Action (20ms decision + 100ms action)
- HIGH CONFIDENCE: Execute 4 automated actions (FTD block, XDR incident, ServiceNow ticket, Webex alert)
- LOW CONFIDENCE: Route to manual review (ServiceNow ticket with "human approval required" flag)

Total Latency: 5ms (pre-process) + 20ms (inference) + 3ms (post-process) + 2ms (duplicate check) + 300ms (validation) + 20ms (decision) + 100ms (action) = 450ms
```

**Integration Points:**

| System | Integration Type | Purpose | API Endpoint | Response Time |
|--------|------------------|---------|--------------|---------------|
| **ISE pxGrid** | Real-time badge event subscription | Correlate person detection with badge swipe (authorized vs. unauthorized entry) | `https://10.30.0.1:8910/pxgrid/ise/session` | ~50ms |
| **Splunk MLTK** | Historical pattern validation | Compare current perimeter activity vs. expected activity for time/day (anomaly detection) | `https://10.182.1.50:8089/services/search/jobs` | ~100ms |
| **ThousandEyes** | Network path health | Validate camera → edge AI network path (ensures detection not false positive from packet loss) | `https://api.thousandeyes.com/v6/tests/12345/results` | ~80ms |
| **AppDynamics** | Application health | Validate RTSP video streaming service health (ensures video frames not corrupted) | `https://abhavtech.saas.appdynamics.com/controller/rest/applications/10/metric-data` | ~90ms |
| **FTD Firewall** | Automated network blocking | Create temporary block rule for perimeter zone VLAN (prevents lateral movement if intruder) | `https://ftd-mumbai.abhavtech.com/api/fmc_config/v1/domain/default/object/accessrules` | ~50ms |
| **XDR SecureX** | Security incident correlation | Create security incident, correlate with AMP/Umbrella/ISE telemetry (threat intelligence) | `https://securex.cisco.com/api/incidents` | ~40ms |
| **ServiceNow** | Automated ticketing | Create incident with video snapshot, assign to security supervisor | `https://abhavtech.service-now.com/api/now/table/incident` | ~60ms |
| **Webex Teams** | Mobile supervisor alert | Send push notification with video snapshot link to supervisor mobile device | `https://webexapis.com/v1/messages` | ~80ms |

**Performance Targets & Validation:**

| Metric | Target | Measurement Method | Validation Frequency |
|--------|--------|-------------------|---------------------|
| **End-to-End Latency** | <500ms (95th percentile) | AppDynamics Business Transaction monitoring (custom BT: "Perimeter-Intrusion-Detection") | Real-time monitoring, weekly P95 report |
| **Detection Accuracy** | >85% mAP@0.5 on Abhavtech test set | Quarterly model evaluation on 2,000-image hold-out test set (manual labeling by security team) | Quarterly (Week 12, 24, 36, 48) |
| **False Positive Rate** | <5% (validated detections that were false positives) | Manual security supervisor review: Sample 200 high-confidence alerts over 14 days, verify against video | Bi-weekly during pilot (Phase 4A-4B), monthly post-production |
| **False Negative Rate** | <2% (missed intrusions) | Red team penetration testing: 20 simulated intrusion attempts per quarter, verify detection | Quarterly (coordinated with pen test) |
| **Camera Availability** | >95% (cameras online and streaming) | SNMP traps from Catalyst 9300 switches (PoE status), RTSP stream health checks every 30 seconds | Real-time monitoring, daily availability report |
| **GPU Utilization** | 70-80% (optimal resource utilization) | `nvidia-smi` monitoring via Splunk (query every 10 seconds), dashboard panel "GPU Utilization %" | Real-time monitoring, weekly utilization report |

---

#### Function 2: Loitering Detection

**Objective:** Detect persons remaining in restricted zones >2 minutes to identify suspicious behavior (casing for burglary, unauthorized access attempts).

**AI Model Specifications:**

| Specification | Value | Rationale |
|--------------|-------|-----------|
| **Model Architecture** | DeepSORT (Deep Learning + SORT tracking) | Extends YOLO v8 detections with object tracking across frames, maintains object identity even with occlusion |
| **Re-Identification Model** | ResNet-50 feature extractor (pre-trained on Market-1501 person re-ID dataset) | Generates 128-dimensional feature vector per person, enables identity matching across frames |
| **Tracking Algorithm** | Kalman Filter + Hungarian Algorithm | Predicts object trajectory, matches detections to tracks via IoU + feature similarity |
| **Track Retention** | 30 frames (1 second @ 30 FPS) | If object not detected for 30 frames, track deleted (assumes person left FOV) |
| **Inference Time** | 25-30ms (YOLO v8 20ms + DeepSORT 10ms overhead) | Slightly slower than YOLO alone due to feature extraction and tracking |
| **GPU Memory** | 2.1 GB VRAM per inference container | Larger memory footprint due to ResNet-50 feature extractor |

**Loitering Detection Logic:**

```python
# Pseudo-code for loitering detection algorithm

def detect_loitering(tracks, restricted_zones):
    """
    Detect persons loitering in restricted zones >2 minutes
    
    Args:
        tracks: List of DeepSORT tracks (person objects with trajectory history)
        restricted_zones: List of polygon zones (server room entrance, executive floor, loading dock)
    
    Returns:
        loitering_alerts: List of alerts with track_id, zone_id, dwell_time
    """
    
    loitering_alerts = []
    
    for track in tracks:
# Check if track bounding box center is within restricted zone
        track_center = (track.bbox_center_x, track.bbox_center_y)
        
        for zone in restricted_zones:
            if point_in_polygon(track_center, zone.polygon):
# Person in restricted zone - calculate dwell time
                dwell_time = track.total_time_in_zone(zone.id)
                
                if dwell_time > 120:  # 120 seconds = 2 minutes
# Loitering detected - check if already alerted for this track
                    if not track.alerted_for_zone(zone.id):
# New loitering alert
                        loitering_alerts.append({
                            'track_id': track.id,
                            'zone_id': zone.id,
                            'zone_name': zone.name,  # e.g., "Server Room Entrance"
                            'dwell_time': dwell_time,
                            'camera_id': track.camera_id,
                            'timestamp': track.first_entry_timestamp,
                            'confidence': track.avg_confidence  # Average YOLO confidence across all detections
                        })
                        
# Mark track as alerted to prevent duplicate alerts
                        track.mark_alerted(zone.id)
    
    return loitering_alerts
```

**Restricted Zones (Mumbai Hub Example):**

| Zone ID | Zone Name | Floor | Polygon Coordinates (pixels in 1920×1080 frame) | Dwell Threshold | Alert Priority |
|---------|-----------|-------|------------------------------------------------|----------------|----------------|
| **RZ-001** | Server Room Entrance | Floor 1 | [(450, 300), (1200, 300), (1200, 800), (450, 800)] | >2 minutes | P2-High (unauthorized server room access) |
| **RZ-002** | Executive Floor Hallway | Floor 7 | [(200, 200), (1700, 200), (1700, 900), (200, 900)] | >2 minutes | P3-Medium (visitor loitering on executive floor) |
| **RZ-003** | Loading Dock Restricted Area | Ground Floor | [(800, 400), (1600, 400), (1600, 900), (800, 900)] | >5 minutes | P3-Medium (employee break area nearby, longer threshold) |

**Integration with ISE pxGrid (Badge Correlation):**

Loitering detection is enhanced by correlating with ISE badge swipe events:

```
Scenario 1: Authorized Loitering (Employee on Break)
- Camera detects person loitering in loading dock >5 minutes
- Query ISE pxGrid: Badge swipe for employee "jsmith" at loading dock entrance 8 minutes ago
- Validation: Authorized employee (SGT-10 corporate employee badge)
- Action: LOW CONFIDENCE → Manual review (supervisor verifies legitimate break, no action needed)

Scenario 2: Unauthorized Loitering (Suspicious Activity)
- Camera detects person loitering near server room entrance >2 minutes
- Query ISE pxGrid: 0 badge swipes in last 10 minutes (no legitimate access)
- Validation: Unauthorized loitering (no badge, restricted zone, suspicious behavior)
- Action: HIGH CONFIDENCE → ServiceNow P2 incident, supervisor Webex alert, video review
```

**Performance Targets:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Detection Latency** | <1 second (from 2-minute dwell threshold crossed to alert) | AppDynamics BT monitoring |
| **Tracking Accuracy** | >90% (correct person identity maintained across frames) | Manual validation: Review 50 loitering events, verify track ID consistency |
| **False Positive Rate** | <10% (legitimate activity flagged as loitering) | Security supervisor review: Badge correlation reduces false positives (employees on break) |

---

#### Function 3: Tailgating Detection

**Objective:** Detect unauthorized entry via tailgating (person following authorized employee through access-controlled entrance without badge swipe).

**AI Model Specifications:**

Same as Function 1 (YOLO v8n) for person detection, but with added badge swipe correlation logic.

**Detection Logic:**

```
Step 1: Badge Reader Event (ISE pxGrid Subscription)
- Badge reader at main entrance detects badge swipe (SGT-71 badge reader)
- ISE pxGrid publishes event: {"user": "jsmith", "location": "Main Entrance", "timestamp": "2025-01-15T09:15:30.000Z", "sgt": "SGT-10"}
- Edge AI subscribes to pxGrid WebSocket, receives event in real-time (~50ms latency)

Step 2: Camera Person Count (3-Second Window)
- Camera at main entrance detects 2 people entering within 3 seconds of badge swipe
- YOLO v8 detections:
  - Detection 1: {"class": "person", "confidence": 0.94, "timestamp": "09:15:30.500"}
  - Detection 2: {"class": "person", "confidence": 0.91, "timestamp": "09:15:32.200"}

Step 3: Correlation Logic
- Badge swipes in 3-second window: 1 (employee "jsmith")
- People detected in 3-second window: 2
- Mismatch detected: 2 people entered, but only 1 badge swipe recorded

Step 4: Tailgating Alert
- IF (people_count > badge_count) within 3-second window:
    - Suspected tailgating (2nd person entered without badge)
- ELSE:
    - Normal entry (people_count == badge_count)

Step 5: Action (LOW CONFIDENCE - Manual Review Required)
- ServiceNow incident: "Tailgating Suspected - Main Entrance - Review Required"
- Supervisor Webex notification with 10-second video clip
- NO automated FTD block (high false positive risk: employees holding door for colleagues with forgotten badge)
```

**Why LOW CONFIDENCE (Manual Review Required)?**

Tailgating detection has inherent ambiguity that prevents high-confidence automated actions:

| Tailgating Scenario | Badge Count | People Count | Action |
|---------------------|-------------|--------------|--------|
| **True Positive: Unauthorized Tailgating** | 1 badge swipe | 2 people enter | Manual review: Verify 2nd person unauthorized → Security dispatch |
| **False Positive: Courtesy Door Holding** | 1 badge swipe | 2 people enter | Manual review: Verify 2nd person is colleague with forgotten badge → No action |
| **False Positive: Visitor Entry** | 1 badge swipe (employee) | 2 people enter (employee + visitor) | Manual review: Verify visitor logged in reception → No action |
| **True Negative: Single Entry** | 1 badge swipe | 1 person enter | No alert generated (normal entry) |

Without additional context (facial recognition for identity, which is prohibited per GDPR privacy-first design), edge AI cannot distinguish true tailgating from legitimate door holding. Therefore, all tailgating alerts route to manual review.

**Integration Specifications:**

| Component | Specification | Purpose |
|-----------|--------------|---------|
| **Badge Readers** | ISE-integrated HID badge readers (SGT-71) | Generate pxGrid badge swipe events |
| **ISE pxGrid** | WebSocket persistent connection (10.30.0.1:8910) | Real-time badge event streaming to edge AI |
| **Camera Placement** | 8 main entrance cameras (Mumbai), 8 Chennai | Cover all turnstiles/access-controlled doors |
| **Time Window** | 3 seconds (configurable 1-5 seconds) | Tolerance for people entering closely together |

**Performance Targets:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Detection Latency** | <2 seconds (badge swipe → alert) | AppDynamics BT monitoring |
| **False Positive Rate** | 20-30% (acceptable for manual review workflow) | Security supervisor review: Many legitimate "door holding" scenarios |
| **False Negative Rate** | <5% (missed tailgating) | Red team testing: Simulate tailgating, verify detection |

---

#### Function 4: License Plate Recognition (LPR)

**Objective:** Automated vehicle access control via license plate OCR, validated against authorized vehicle database.

**AI Model Specifications:**

| Specification | Value | Rationale |
|--------------|-------|-----------|
| **Vehicle Detection** | YOLO v8n (vehicle class only) | Detect vehicle bounding box before plate extraction |
| **Plate Localization** | Custom CNN (MobileNetV3 backbone) | Lightweight model for edge deployment, 8-12ms inference |
| **OCR Engine** | Tesseract 5.0 + Custom LSTM (trained on India plates) | Open-source OCR with India license plate format training (e.g., "MH-01-AB-1234") |
| **Training Dataset** | 15,000+ India license plate images (Mumbai/Chennai vehicle entry logs) | Covers variations: dirt, low light, skewed angle, old/new plate formats |
| **Inference Time** | 80-120ms total (YOLO 20ms + plate localization 10ms + OCR 50-90ms) | OCR is bottleneck (character recognition slower than object detection) |
| **Accuracy** | >98% character accuracy on clean plates, >92% on dirty/skewed plates | Validated on 2,000-image test set from actual parking lot cameras |

**LPR Detection Workflow:**

```
Step 1: Vehicle Detection (20ms)
- YOLO v8 detects vehicle entering parking lot gate
- Bounding box: [x1, y1, x2, y2] for vehicle region

Step 2: Plate Localization (10ms)
- Custom CNN extracts license plate region from vehicle bounding box
- Output: Plate bounding box [x1_plate, y1_plate, x2_plate, y2_plate] relative to vehicle
- Example: Plate located at front bumper center

Step 3: Plate Image Pre-Processing (5ms)
- Crop plate region from original frame (typically 200×80 pixels)
- Apply image enhancement:
  - Grayscale conversion (removes color distractions)
  - Contrast enhancement (CLAHE algorithm, improves dirty plate readability)
  - Binarization (Otsu's thresholding, converts to black text on white background)

Step 4: OCR (50-90ms)
- Tesseract 5.0 LSTM OCR on preprocessed plate image
- Output: Text string (e.g., "MH-01-AB-1234")
- Confidence scores per character (e.g., "M"=0.98, "H"=0.95, "0"=0.92, "1"=0.97, etc.)

Step 5: Format Validation (2ms)
- Regex validation: India plate format "XX-DD-XX-DDDD" (X=letter, D=digit)
- Invalid format (e.g., "MH-01-1234" missing letters) → Retry OCR with adjusted pre-processing
- Valid format → Proceed to database lookup

Step 6: Authorized Vehicle Database Lookup (15ms)
- Query CyberArk PAM authorized vehicle database (stored in Splunk for fast indexed search)
- Query: index=authorized_vehicles license_plate="MH-01-AB-1234"
- Response: {"employee": "jsmith", "authorized": true, "expiry": "2025-12-31"}

Step 7: Access Decision (5ms)
- IF authorized=true AND expiry > current_date:
    - Grant access (log entry to Splunk, no alert)
- ELSE IF authorized=false:
    - Deny access + ServiceNow incident "Unauthorized Vehicle - Parking Gate"
    - Supervisor Webex notification
- ELSE IF authorized=true BUT expiry <= current_date:
    - Deny access + ServiceNow incident "Expired Vehicle Authorization"

Total Latency: 20ms (vehicle detect) + 10ms (plate localize) + 5ms (pre-process) + 70ms (OCR avg) + 2ms (validate) + 15ms (DB lookup) + 5ms (decision) = 127ms average
```

**Integration with CyberArk PAM (Authorized Vehicle Database):**

CyberArk PAM stores privileged access credentials, but also serves as centralized database for authorized vehicle list (since vehicle access is privilege-based: executives, senior managers, approved contractors).

**Authorized Vehicle Database Schema (Splunk Index):**

```
index=authorized_vehicles

Fields:
- license_plate (string, unique identifier): "MH-01-AB-1234"
- employee_id (string): "jsmith"
- employee_name (string): "John Smith"
- vehicle_make (string): "Toyota Camry"
- vehicle_color (string): "Silver"
- authorization_level (string): "Executive" | "Manager" | "Contractor" | "Visitor"
- authorized_by (string): "facilities-manager@abhavtech.com"
- start_date (date): "2024-01-15"
- expiry_date (date): "2025-12-31"
- parking_zones (array): ["Executive Parking", "Loading Dock"]
```

**LPR Camera Placement:**

Mumbai Hub (20× 4K LPR Cameras):
- Main Gate (4 cameras): 2 entry lanes + 2 exit lanes (bidirectional OCR)
- Parking Lot Entrance (8 cameras): 4 entry + 4 exit (multi-level parking, 2 levels × 2 entrances)
- Loading Dock Gate (6 cameras): 3 entry + 3 exit (delivery vehicle access control)
- VIP/Executive Entrance (2 cameras): 1 entry + 1 exit (separate access control for executives)

Chennai Hub (20× 4K LPR Cameras): Identical distribution

**Performance Targets:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **End-to-End Latency** | <3 seconds (vehicle arrival → access decision) | AppDynamics BT monitoring |
| **OCR Accuracy** | >98% character accuracy (clean plates), >92% (dirty/skewed) | Monthly validation: Sample 100 vehicle entries, verify OCR vs. manual review |
| **False Accept Rate** | <0.1% (unauthorized vehicle granted access) | Critical security metric: Quarterly audit of access logs vs. authorized vehicle DB |
| **False Reject Rate** | <2% (authorized vehicle denied access) | User experience metric: Track ServiceNow incidents "Authorized Vehicle Rejected" |

---

#### Function 5: Crowd Density Monitoring

**Objective:** Detect unsafe crowding in common areas (fire safety compliance, evacuation route bottleneck detection).

**AI Model Specifications:**

Same as Function 1 (YOLO v8n) for person detection, with added density heatmap generation.

**Density Calculation Algorithm:**

```python
def calculate_crowd_density(person_detections, zone_area_sqm):
    """
    Calculate people density in people per square meter
    
    Args:
        person_detections: List of YOLO person detections with bounding boxes
        zone_area_sqm: Zone area in square meters (e.g., cafeteria = 500 sqm)
    
    Returns:
        density: People per square meter (e.g., 0.4 people/sqm)
    """
    
    people_count = len(person_detections)
    density = people_count / zone_area_sqm
    
    return density

# Example: Cafeteria zone
cafeteria_area = 500  # square meters
people_detected = 180  # people (lunch hour)
density = 180 / 500 = 0.36 people/sqm  # SAFE (below 0.5 threshold)

# Example: Emergency exit hallway during fire drill
hallway_area = 50  # square meters
people_detected = 35  # people (evacuation in progress)
density = 35 / 50 = 0.70 people/sqm  # UNSAFE (exceeds 0.5 threshold, bottleneck alert)
```

**Fire Safety Threshold (India National Building Code 2016):**

- Safe Density: <0.5 people per square meter (comfortable movement)
- Unsafe Density: ≥0.5 people per square meter (restricted movement, evacuation bottleneck)
- Critical Density: ≥1.0 people per square meter (dangerous crowding, trampling risk)

**Crowd Density Monitoring Zones:**

| Zone ID | Zone Name | Floor | Area (sqm) | Density Threshold | Alert Priority |
|---------|-----------|-------|------------|------------------|----------------|
| **CD-001** | Cafeteria | Ground Floor | 500 | >0.5 people/sqm | P3-Medium (reduce crowding, open additional seating area) |
| **CD-002** | Main Lobby | Ground Floor | 300 | >0.5 people/sqm | P3-Medium (entry bottleneck, open additional entrance) |
| **CD-003** | Emergency Exit Hallway (North) | All Floors | 50 per floor | >0.5 people/sqm | P1-Critical (evacuation bottleneck, fire safety risk) |
| **CD-004** | Emergency Exit Hallway (South) | All Floors | 50 per floor | >0.5 people/sqm | P1-Critical (evacuation bottleneck, fire safety risk) |

**Integration with BMS Fire Alarm System:**

Crowd density monitoring is especially critical during fire alarm activation (evacuation scenarios):

```
Normal Operation (No Fire Alarm):
- Crowd density monitoring: P3-Medium priority (comfort/capacity management)
- Alert if density >0.5 people/sqm: Facilities notified to open additional seating/entry points

Fire Alarm Active (Evacuation in Progress):
- Crowd density monitoring: P1-Critical priority (life safety)
- Alert if density >0.5 people/sqm in emergency exit hallways: Facilities dispatch to redirect evacuees to alternate exit
- Integration: Edge AI queries BMS fire alarm status via API every 5 seconds during alarm
```

**Performance Targets:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Detection Latency** | <5 seconds (density threshold crossed → alert) | AppDynamics BT monitoring |
| **Density Accuracy** | >95% (people count accuracy × zone area accuracy) | Manual validation: Sample 50 crowd density events, verify people count and zone area calculation |
| **Fire Drill Validation** | 100% evacuation bottleneck detection (quarterly fire drill) | Quarterly fire drill: Verify all evacuation bottlenecks detected, no missed alerts |

---

#### Function 6: Access Control Correlation (Server Room / Executive Floor)

**Objective:** Correlate video detections with privileged access logs (ISE badge + CyberArk PAM) to detect unauthorized entry to high-security zones.

**AI Model Specifications:**

Same as Function 1 (YOLO v8n) for person detection, with enhanced correlation logic for privileged access.

**High-Security Zones:**

| Zone ID | Zone Name | Floor | Access Requirements | Integration |
|---------|-----------|-------|---------------------|-------------|
| **HSZ-001** | Server Room | Floor 1 | ISE badge (SGT-11 IT Admin) + CyberArk PAM access request | ISE pxGrid + CyberArk PAM API |
| **HSZ-002** | Executive Floor | Floor 7 | ISE badge (SGT-11 Executive or SGT-12 EA) | ISE pxGrid only |
| **HSZ-003** | Finance Vault | Floor 3 | ISE badge (SGT-13 Finance) + Duo MFA push notification | ISE pxGrid + Duo Admin API |

**Access Control Correlation Logic (Server Room Example):**

```
Step 1: Person Detection
- Camera detects person entering server room entrance
- YOLO v8 detection: {"class": "person", "confidence": 0.93, "timestamp": "14:45:00.000"}

Step 2: ISE pxGrid Badge Correlation (Query Last 5 Minutes)
- Query ISE pxGrid: Badge swipes at server room badge reader (SGT-71) in last 5 minutes
- API Call: GET https://10.30.0.1:8910/pxgrid/ise/session?location="Server Room Entrance"&earliest=(NOW - 5 minutes)
- Response: {"user": "jsmith", "sgt": "SGT-11", "timestamp": "14:44:58.500"}
- Result: Badge swipe detected 1.5 seconds before video detection ✅

Step 3: CyberArk PAM Access Request Correlation (Query Last 10 Minutes)
- Query CyberArk PAM: Privileged access requests for server room in last 10 minutes
- API Call: GET https://cyberark.abhavtech.com/api/access-requests?resource="Server Room"&earliest=(NOW - 10 minutes)
- Response: {"user": "jsmith", "approved": true, "timestamp": "14:40:00.000", "duration": "2 hours"}
- Result: PAM access request approved 5 minutes before entry ✅

Step 4: Multi-Source Validation Decision
- IF (ISE badge swipe detected) AND (CyberArk PAM request approved):
    - AUTHORIZED ACCESS ✅
    - Log to Splunk (audit trail), no alert
- ELSE IF (ISE badge swipe detected) BUT (CyberArk PAM request NOT found):
    - UNAUTHORIZED ACCESS ❌
    - HIGH PRIORITY ServiceNow incident "Unauthorized Server Room Entry - Badge Without PAM Request"
    - CISO immediate Webex notification
    - FTD: Create block rule (server room VLAN isolated)
- ELSE IF (No ISE badge swipe) AND (Person detected):
    - CRITICAL SECURITY INCIDENT ❌❌
    - Person entered server room without badge (physical security breach)
    - P1 ServiceNow incident
    - CISO + Security Supervisor immediate Webex/SMS notification
```

**Why Dual Validation (ISE + CyberArk PAM)?**

Server room access requires two independent authorizations:
1. **Physical Access (ISE Badge):** Employee physically authorized to enter building zone
2. **Privileged Access (CyberArk PAM):** Employee explicitly requested and approved for server room access (time-limited, e.g., 2-hour window for maintenance)

This dual validation prevents:
- **Scenario A:** IT Admin with SGT-11 badge enters server room outside of approved maintenance window → Detected as unauthorized (no PAM request)
- **Scenario B:** Badge cloning attack (attacker clones stolen badge) → Detected as unauthorized (no PAM request from attacker's identity)

**Performance Targets:**

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Detection Latency** | <2 seconds (person detected → access decision) | AppDynamics BT monitoring |
| **False Positive Rate** | <1% (authorized person flagged as unauthorized) | Critical for executive floor: Track ServiceNow incidents "False Positive Access Alert" |
| **False Negative Rate** | 0% (no missed unauthorized access) | Red team testing: Simulate unauthorized entry (badge without PAM), verify detection |

---

### Summary: Six Security Functions Comparison

| Function | AI Model | Detection Time | Integration | False Positive Target | Priority |
|----------|----------|----------------|-------------|----------------------|----------|
| **1. Perimeter Intrusion** | YOLO v8n | <500ms | ISE + Splunk + TE + AppD + FTD + XDR | <5% | P1-Critical |
| **2. Loitering** | DeepSORT | <1 second | ISE pxGrid (badge correlation) | <10% | P2-High |
| **3. Tailgating** | YOLO v8n | <2 seconds | ISE pxGrid (badge count correlation) | 20-30% (manual review) | P3-Medium |
| **4. License Plate Recognition** | YOLO + CNN + OCR | <3 seconds | CyberArk PAM (authorized vehicle DB) | <2% (false reject) | P2-High |
| **5. Crowd Density** | YOLO v8n | <5 seconds | BMS fire alarm API | <5% | P3-Medium (P1 during fire) |
| **6. Access Control** | YOLO v8n | <2 seconds | ISE pxGrid + CyberArk PAM | <1% | P1-Critical |

**Key Takeaway:** All six security functions leverage YOLO v8n as core object detection model (standardization simplifies deployment), differentiated by detection logic and integration points. Multi-source validation (ISE + Splunk + TE + AppD) applies only to Function 1 (Perimeter Intrusion) due to <5% false positive requirement for automated FTD blocking.

---

*Next: Section 2.1.2 - Camera Deployment Topology*