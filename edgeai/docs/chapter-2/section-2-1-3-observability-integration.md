# Observability Integration

### 2.1.3 Observability Integration - Real-World Scenario

This section provides a complete walkthrough of Function 1 (Perimeter Intrusion Detection) with millisecond-precision timing, actual API endpoints, JSON payloads, and validation logic. The scenario demonstrates how Edge AI + Observability Fusion achieves <500ms automated response while maintaining <5% false positive rate.

---

#### Scenario Context: Unauthorized Perimeter Intrusion at Loading Dock

**Date/Time:** Tuesday, January 15, 2025, 14:32:05 IST (lunch hour)  
**Location:** Mumbai Hub, Loading Dock Perimeter Fence (North-East corner)  
**Camera:** Camera 47 (Outdoor PTZ, Axis Q6215-LE)  
**Detection:** Person detected entering restricted zone (no authorized entry point nearby)  
**Expected Occupancy:** 0 people (lunch hour, loading dock typically vacant 14:00-15:00)

---

#### Complete Timeline: 500ms End-to-End Detection → Response

**Frame 0ms - 14:32:05.000: Frame Acquisition**

```
Camera 47 State:
- Position: PTZ Preset #3 (Loading Dock North-East perimeter)
- Resolution: 1080p (1920×1080 pixels)
- Frame Rate: 30 FPS (33.3ms per frame)
- Codec: H.265 adaptive bitrate
- Bandwidth: 8.2 Mbps (current frame, high motion due to wind)

RTSP Stream:
- URL: rtsp://10.150.2.47:554/axis-media/media.amp
- Protocol: RTSP over TCP (port 554)
- Network Path: Camera → Catalyst 9300-48U (access) → Catalyst 9500-40X (distribution) → UCS XE130c M8 Node (edge-ai-mumbai-01, IDF Room Floor 3)
- LAN Latency: 4ms (camera to edge AI, same IDF room co-location)

Edge AI Node receives frame (UCS XE130c M8 in XE9305 chassis):
- Node: edge-ai-mumbai-01 (Slot 1, Primary)
- Timestamp: 14:32:05.000
- Frame size: 1920×1080 pixels (2,073,600 pixels)
- Color depth: 24-bit RGB (3 bytes per pixel)
- Frame buffer size: 6.2 MB uncompressed (H.265 compressed to 256 KB for network transmission)
```

**Frame 5ms - 14:32:05.005: Pre-Processing**

```python
# Pseudo-code: Frame pre-processing pipeline

def preprocess_frame(raw_frame):
    """
    Prepare frame for YOLO v8 inference
    
    Input: raw_frame (1920×1080 RGB image)
    Output: preprocessed_tensor (640×640 normalized float32 tensor)
    """
    
# Step 1: Resize 1920×1080 → 640×640 (letterbox padding to maintain aspect ratio)
# Letterbox adds black bars to sides/top to avoid distortion
    resized_frame = cv2.resize(raw_frame, (640, 640), interpolation=cv2.INTER_LINEAR)
    
# Step 2: Normalize pixel values [0-255] → [0-1] float32
# Neural networks train on normalized inputs for faster convergence
    normalized_frame = resized_frame.astype(np.float32) / 255.0
    
# Step 3: Convert colorspace BGR → RGB (OpenCV uses BGR, YOLO expects RGB)
    rgb_frame = cv2.cvtColor(normalized_frame, cv2.COLOR_BGR2RGB)
    
# Step 4: Transpose HWC (Height, Width, Channels) → CHW (Channels, Height, Width)
# PyTorch expects channels-first format (C, H, W)
    chw_frame = np.transpose(rgb_frame, (2, 0, 1))
    
# Step 5: Add batch dimension (1, C, H, W) for single-frame inference
    batched_tensor = np.expand_dims(chw_frame, axis=0)
    
    return batched_tensor

# Execution time: ~5ms on CPU (Intel Xeon 6 SoC, 32 cores, UCS XE130c M8)
preprocessed_tensor = preprocess_frame(raw_frame)
```

**Frame 25ms - 14:32:05.025: GPU Inference (YOLO v8)**

```python
# Pseudo-code: YOLO v8 GPU inference

def yolo_inference(preprocessed_tensor):
    """
    Run YOLO v8 object detection on GPU
    
    Input: preprocessed_tensor (1, 3, 640, 640) - single frame, RGB, 640×640
    Output: detections (list of bounding boxes, classes, confidences)
    """
    
# Load model from GPU memory (model already loaded at container startup)
    model = torch.load('/models/yolo_v8n_int8.onnx')  # INT8 quantized ONNX format
    model = model.to('cuda:0')  # NVIDIA L4 GPU device
    
# Convert numpy array to PyTorch tensor, move to GPU
    input_tensor = torch.from_numpy(preprocessed_tensor).to('cuda:0')
    
# Run inference (forward pass through neural network)
    with torch.no_grad():  # Disable gradient computation (inference only, not training)
        outputs = model(input_tensor)
    
# Post-process outputs: Non-Maximum Suppression (NMS) to filter overlapping detections
# NMS parameters: IoU threshold 0.45 (filter boxes with >45% overlap), confidence threshold 0.70
    detections = non_max_suppression(outputs, conf_thres=0.70, iou_thres=0.45)
    
    return detections

# Execution time: ~20ms on NVIDIA L4 GPU (INT8 quantization, TensorRT optimization)

# YOLO v8 output example:
detections = [
    {
        'bbox': [850, 320, 970, 600],  # [x1, y1, x2, y2] in 640×640 frame
        'class': 'person',
        'confidence': 0.96,
        'class_id': 0  # COCO class ID for 'person'
    }
]
```

**Frame 28ms - 14:32:05.028: Post-Processing & Zone Validation**

```python
# Pseudo-code: Post-processing and restricted zone validation

def validate_detection_in_zone(detection, restricted_zones):
    """
    Check if detection bounding box center is within restricted zone polygon
    
    Input:
        detection: {'bbox': [x1, y1, x2, y2], 'class': 'person', 'confidence': 0.96}
        restricted_zones: [{'id': 'RZ-LOADING-DOCK', 'polygon': [(x1,y1), (x2,y2), ...]}]
    
    Output:
        zone_match: {'zone_id': 'RZ-LOADING-DOCK', 'zone_name': 'Loading Dock Perimeter'} or None
    """
    
# Calculate bounding box center (midpoint of x1,x2 and y1,y2)
    bbox_center_x = (detection['bbox'][0] + detection['bbox'][2]) / 2
    bbox_center_y = (detection['bbox'][1] + detection['bbox'][3]) / 2
    bbox_center = (bbox_center_x, bbox_center_y)
    
# Check if bbox center is within any restricted zone polygon (point-in-polygon algorithm)
    for zone in restricted_zones:
        if point_in_polygon(bbox_center, zone['polygon']):
            return {
                'zone_id': zone['id'],
                'zone_name': zone['name'],
                'bbox_center': bbox_center
            }
    
    return None  # Detection not in restricted zone, discard

# Example restricted zone polygon (Loading Dock Perimeter in 640×640 frame coordinates)
restricted_zones = [
    {
        'id': 'RZ-LOADING-DOCK',
        'name': 'Loading Dock Perimeter',
        'polygon': [(200, 150), (550, 150), (550, 500), (200, 500)]  # Rectangle in 640×640 frame
    }
]

# Execution time: ~3ms on CPU

zone_match = validate_detection_in_zone(detections[0], restricted_zones)
# Result: {'zone_id': 'RZ-LOADING-DOCK', 'zone_name': 'Loading Dock Perimeter', 'bbox_center': (910, 460)}
```

**Frame 30ms - 14:32:05.030: Duplicate Check (Local Database Query)**

```sql
-- SQLite query: Check for duplicate events in last 60 seconds

SELECT * FROM events 
WHERE camera_id = 'cam-47' 
  AND zone_id = 'RZ-LOADING-DOCK'
  AND timestamp > datetime('now', '-60 seconds')
LIMIT 1;

-- Query execution time: ~2ms (SQLite on NVMe SSD, indexed on camera_id and timestamp)

-- Result: No rows returned (no duplicate event in last 60 seconds)
-- Decision: Proceed to multi-source validation (this is a new detection, not duplicate alert)
```

**Frame 35ms - 14:32:05.035: Multi-Source Validation Launch (4 Parallel API Calls)**

Edge AI server launches 4 simultaneous API calls to centralized observability platforms. These calls execute in parallel (not sequential) to minimize total latency.

---

#### API Call 1: ISE pxGrid - Badge Swipe Events (~50ms)

**Objective:** Correlate person detection with badge swipe events to distinguish authorized vs. unauthorized entry.

**API Request:**

```http
POST https://10.30.0.1:8910/pxgrid/ise/session/query
Content-Type: application/json
Authorization: Basic <base64_encoded_credentials>
X-Request-ID: perimeter-intrusion-20250115-143205

{
  "location": "Loading Dock",
  "startTimestamp": "2025-01-15T14:27:05.000Z",  // 5 minutes before detection
  "endTimestamp": "2025-01-15T14:32:05.000Z",    // detection timestamp
  "sgt": ["SGT-71"]  // Badge reader security group tag
}
```

**API Response (50ms later - 14:32:05.085):**

```json
{
  "requestId": "perimeter-intrusion-20250115-143205",
  "timestamp": "2025-01-15T14:32:05.085Z",
  "sessions": [],  // Empty array: No badge swipes in last 5 minutes
  "totalCount": 0
}
```

**Validation Logic:**

```python
def validate_ise_pxgrid(api_response):
    """
    Interpret ISE pxGrid response for authorization validation
    
    Logic:
      - sessions.length == 0: No badge swipes → UNAUTHORIZED entry
      - sessions.length >= 1: Badge swipe detected → AUTHORIZED entry (likely employee)
    
    Returns:
      validation_result: {'source': 'ISE', 'authorized': False, 'confidence': 'high'}
    """
    
    if api_response['totalCount'] == 0:
        return {
            'source': 'ISE pxGrid',
            'authorized': False,  # No badge swipe = unauthorized
            'confidence': 'high',
            'reasoning': '0 badge swipes in last 5 minutes at Loading Dock location'
        }
    else:
        return {
            'source': 'ISE pxGrid',
            'authorized': True,  # Badge swipe detected = authorized
            'confidence': 'medium',
            'reasoning': f"{api_response['totalCount']} badge swipe(s) detected, likely authorized employee",
            'users': [session['userName'] for session in api_response['sessions']]
        }

# Validation result for this scenario:
ise_validation = validate_ise_pxgrid(api_response)
# Result: {'source': 'ISE pxGrid', 'authorized': False, 'confidence': 'high', 'reasoning': '0 badge swipes...'}
```

---

#### API Call 2: Splunk MLTK - Historical Pattern Analysis (~100ms)

**Objective:** Compare current occupancy (1 person detected) vs. expected occupancy for this time/location based on historical patterns.

**API Request (Splunk Search Job Creation):**

```http
POST https://10.182.1.50:8089/services/search/jobs
Content-Type: application/x-www-form-urlencoded
Authorization: Bearer <splunk_token>

search=index=bms location="Loading Dock" earliest=-30d latest=now 
| eval hour=strftime(_time, "%H"), day=strftime(_time, "%A")
| where hour="14" AND day="Tuesday"
| stats avg(occupancy_count) as expected_occupancy
| eval current_occupancy=1
| eval anomaly=if(current_occupancy > expected_occupancy * 1.5 OR current_occupancy < expected_occupancy * 0.5, 1, 0)
&output_mode=json
```

**API Response (100ms later - 14:32:05.135):**

```json
{
  "sid": "1705317125.12345",  // Search job ID
  "results": [
    {
      "expected_occupancy": 0.2,  // Historical average: 0.2 people at Loading Dock on Tuesday 14:00
      "current_occupancy": 1,     // Current detection: 1 person
      "anomaly": 1                // Anomaly detected (current 5× higher than expected)
    }
  ]
}
```

**Validation Logic:**

```python
def validate_splunk_mltk(api_response):
    """
    Interpret Splunk MLTK response for occupancy anomaly detection
    
    Logic:
      - anomaly == 1: Current occupancy significantly different from historical pattern → ANOMALOUS
      - anomaly == 0: Current occupancy within expected range → NORMAL
    
    Returns:
      validation_result: {'source': 'Splunk MLTK', 'anomalous': True, 'confidence': 'high'}
    """
    
    result = api_response['results'][0]
    
    if result['anomaly'] == 1:
        return {
            'source': 'Splunk MLTK',
            'anomalous': True,
            'confidence': 'high',
            'reasoning': f"Current occupancy ({result['current_occupancy']}) is 5× higher than expected ({result['expected_occupancy']}) for Tuesday 14:00 at Loading Dock",
            'expected_occupancy': result['expected_occupancy'],
            'current_occupancy': result['current_occupancy']
        }
    else:
        return {
            'source': 'Splunk MLTK',
            'anomalous': False,
            'confidence': 'high',
            'reasoning': f"Current occupancy within expected range for this time/location"
        }

# Validation result for this scenario:
splunk_validation = validate_splunk_mltk(api_response)
# Result: {'source': 'Splunk MLTK', 'anomalous': True, 'confidence': 'high', 'reasoning': 'Current occupancy 5× higher...'}
```

---

#### API Call 3: ThousandEyes - Network Path Quality (~80ms)

**Objective:** Validate Camera 47 → Edge AI Server network path health to ensure detection is not false positive from packet loss causing frame corruption.

**API Request:**

```http
GET https://api.thousandeyes.com/v6/tests/12345/net/path-vis
Authorization: Bearer <thousandeyes_token>
Content-Type: application/json

Parameters:
  testId: 12345  // Test ID for "Camera-47 → Edge-AI-Mumbai-01" network path
  window: 2m     // Last 2 minutes of data
  aid: 98765     // Account group ID
```

**API Response (80ms later - 14:32:05.115):**

```json
{
  "test": {
    "testId": 12345,
    "testName": "Camera-47 → Edge-AI-Mumbai-01 Network Path",
    "type": "agent-to-server"
  },
  "net": {
    "metrics": [
      {
        "date": "2025-01-15T14:32:00",
        "roundId": 1705317120,
        "avgLatency": 12,      // 12ms average latency (excellent)
        "minLatency": 10,
        "maxLatency": 15,
        "loss": 0.0,           // 0% packet loss (perfect)
        "jitter": 2            // 2ms jitter (low)
      }
    ]
  }
}
```

**Validation Logic:**

```python
def validate_thousandeyes(api_response):
    """
    Interpret ThousandEyes response for network path health
    
    Logic:
      - loss < 1% AND latency < 100ms: Network healthy → Detection reliable
      - loss >= 1% OR latency >= 100ms: Network degraded → Detection may be false positive from frame corruption
    
    Returns:
      validation_result: {'source': 'ThousandEyes', 'network_healthy': True, 'confidence': 'high'}
    """
    
    metrics = api_response['net']['metrics'][0]
    
    if metrics['loss'] < 1.0 and metrics['avgLatency'] < 100:
        return {
            'source': 'ThousandEyes',
            'network_healthy': True,
            'confidence': 'high',
            'reasoning': f"Network path healthy: {metrics['loss']}% packet loss, {metrics['avgLatency']}ms latency",
            'latency': metrics['avgLatency'],
            'loss': metrics['loss']
        }
    else:
        return {
            'source': 'ThousandEyes',
            'network_healthy': False,
            'confidence': 'high',
            'reasoning': f"Network path degraded: {metrics['loss']}% packet loss, {metrics['avgLatency']}ms latency (may cause false positive)",
            'latency': metrics['avgLatency'],
            'loss': metrics['loss']
        }

# Validation result for this scenario:
te_validation = validate_thousandeyes(api_response)
# Result: {'source': 'ThousandEyes', 'network_healthy': True, 'confidence': 'high', 'reasoning': 'Network path healthy...'}
```

---

#### API Call 4: AppDynamics - RTSP Application Health (~90ms)

**Objective:** Validate RTSP video streaming service health to ensure video frames are not corrupted by application errors.

**API Request:**

```http
GET https://abhavtech.saas.appdynamics.com/controller/rest/applications/10/metric-data
Authorization: Bearer <appdynamics_token>
Content-Type: application/json

Parameters:
  application: 10                          // Application ID for "Camera-RTSP-Streaming"
  metric-path: Business Transaction Performance|Business Transactions|Camera-RTSP-Streaming|Camera-47-Stream|Errors per Minute
  time-range-type: BEFORE_NOW
  duration-in-mins: 5
  rollup: false
  output: JSON
```

**API Response (90ms later - 14:32:05.125):**

```json
{
  "metric-data": [
    {
      "metricName": "BTM|BTs|BT:12345|Component:67890|Errors per Minute",
      "metricPath": "Business Transaction Performance|Business Transactions|Camera-RTSP-Streaming|Camera-47-Stream|Errors per Minute",
      "frequency": "ONE_MIN",
      "metricValues": [
        {
          "startTimeInMillis": 1705316940000,  // 14:29:00
          "value": 0,
          "count": 1
        },
        {
          "startTimeInMillis": 1705317000000,  // 14:30:00
          "value": 0,
          "count": 1
        },
        {
          "startTimeInMillis": 1705317060000,  // 14:31:00
          "value": 0,
          "count": 1
        },
        {
          "startTimeInMillis": 1705317120000,  // 14:32:00
          "value": 0,  // 0 errors in last minute
          "count": 1
        }
      ]
    }
  ]
}
```

**Validation Logic:**

```python
def validate_appdynamics(api_response):
    """
    Interpret AppDynamics response for RTSP application health
    
    Logic:
      - error_rate < 5%: Application healthy → Video stream reliable
      - error_rate >= 5%: Application unhealthy → Video stream may be corrupt (false positive risk)
    
    Returns:
      validation_result: {'source': 'AppDynamics', 'app_healthy': True, 'confidence': 'high'}
    """
    
# Calculate average error rate over last 5 minutes
    metric_values = api_response['metric-data'][0]['metricValues']
    avg_error_rate = sum([m['value'] for m in metric_values]) / len(metric_values)
    
    if avg_error_rate < 5.0:
        return {
            'source': 'AppDynamics',
            'app_healthy': True,
            'confidence': 'high',
            'reasoning': f"RTSP service healthy: {avg_error_rate}% error rate (below 5% threshold)",
            'error_rate': avg_error_rate
        }
    else:
        return {
            'source': 'AppDynamics',
            'app_healthy': False,
            'confidence': 'high',
            'reasoning': f"RTSP service unhealthy: {avg_error_rate}% error rate (above 5% threshold, may cause false positive)",
            'error_rate': avg_error_rate
        }

# Validation result for this scenario:
appd_validation = validate_appdynamics(api_response)
# Result: {'source': 'AppDynamics', 'app_healthy': True, 'confidence': 'high', 'reasoning': 'RTSP service healthy...'}
```

---

#### Frame 135ms - 14:32:05.135: Multi-Source Validation Complete (All 4 API Responses Received)

**Validation Results Summary:**

| Source | Response Time | Result | Confidence |
|--------|--------------|--------|-----------|
| **ISE pxGrid** | 50ms | ❌ **Unauthorized** (0 badge swipes) | High |
| **Splunk MLTK** | 100ms | ❌ **Anomalous** (occupancy 5× higher than expected) | High |
| **ThousandEyes** | 80ms | ✅ **Network Healthy** (0% loss, 12ms latency) | High |
| **AppDynamics** | 90ms | ✅ **Application Healthy** (0% error rate) | High |

**Total Validation Time:** max(50ms, 100ms, 80ms, 90ms) = **100ms** (parallel execution)

---

#### Frame 155ms - 14:32:05.155: Decision Logic - High Confidence Determination

```python
def make_decision(ai_detection, ise_validation, splunk_validation, te_validation, appd_validation):
    """
    Combine AI inference with 4 validation sources to make high/low confidence decision
    
    HIGH CONFIDENCE Criteria (ALL must be true):
      1. AI confidence >= 90%
      2. ISE pxGrid: No badge swipe detected (unauthorized)
      3. Splunk MLTK: Occupancy anomalous (unexpected for time/location)
      4. ThousandEyes: Network healthy (rules out false positive from packet loss)
      5. AppDynamics: Application healthy (rules out false positive from corrupt stream)
    
    If ANY validation fails, route to LOW CONFIDENCE → Manual review
    """
    
# Criterion 1: AI confidence >= 90%
    ai_confidence_check = (ai_detection['confidence'] >= 0.90)
    
# Criterion 2: ISE unauthorized
    ise_check = (ise_validation['authorized'] == False)
    
# Criterion 3: Splunk anomalous
    splunk_check = (splunk_validation['anomalous'] == True)
    
# Criterion 4: ThousandEyes network healthy
    te_check = (te_validation['network_healthy'] == True)
    
# Criterion 5: AppDynamics app healthy
    appd_check = (appd_validation['app_healthy'] == True)
    
# HIGH CONFIDENCE: All 5 criteria pass
    if ai_confidence_check and ise_check and splunk_check and te_check and appd_check:
        return {
            'decision': 'HIGH_CONFIDENCE',
            'reasoning': 'AI 96% confidence + ISE unauthorized + Splunk anomalous + ThousandEyes healthy + AppDynamics healthy',
            'action': 'AUTOMATED',
            'criteria_passed': 5,
            'criteria_total': 5
        }
    
# LOW CONFIDENCE: At least 1 criterion failed
    else:
        failed_criteria = []
        if not ai_confidence_check: failed_criteria.append('AI confidence < 90%')
        if not ise_check: failed_criteria.append('ISE: Badge swipe detected (authorized)')
        if not splunk_check: failed_criteria.append('Splunk: Occupancy normal (expected pattern)')
        if not te_check: failed_criteria.append('ThousandEyes: Network degraded')
        if not appd_check: failed_criteria.append('AppDynamics: RTSP service unhealthy')
        
        return {
            'decision': 'LOW_CONFIDENCE',
            'reasoning': f"One or more validations failed: {', '.join(failed_criteria)}",
            'action': 'MANUAL_REVIEW',
            'criteria_passed': sum([ai_confidence_check, ise_check, splunk_check, te_check, appd_check]),
            'criteria_total': 5
        }

# Decision for this scenario:
decision = make_decision(
    ai_detection={'confidence': 0.96},
    ise_validation=ise_validation,
    splunk_validation=splunk_validation,
    te_validation=te_validation,
    appd_validation=appd_validation
)

# Result: {'decision': 'HIGH_CONFIDENCE', 'reasoning': 'AI 96% + ISE unauthorized + Splunk anomalous + TE healthy + AppD healthy', 'action': 'AUTOMATED'}
```

---

#### Frame 175ms - 14:32:05.175: Automated Action Execution (4 Parallel API Calls)

High-confidence decision triggers 4 automated actions simultaneously:

---

**Action 1: FTD Firewall - Create Network Block Rule (~50ms)**

**API Request:**

```http
POST https://ftd-mumbai.abhavtech.com/api/fmc_config/v1/domain/default/policy/accesspolicies/005056BB-0B24-0ed3-0000-004294967296/accessrules
Authorization: Bearer <ftd_token>
Content-Type: application/json

{
  "name": "BLOCK-LoadingDock-AutoGenerated-20250115-143205",
  "action": "BLOCK",
  "enabled": true,
  "sendEventsToFMC": true,
  "sourceZones": {
    "objects": [
      {
        "type": "SecurityZone",
        "id": "005056BB-0B24-0ed3-0000-004294967299",  // VLAN 150 Loading Dock security zone
        "name": "VLAN-150-LoadingDock"
      }
    ]
  },
  "destinationNetworks": {
    "objects": [
      {
        "type": "Network",
        "id": "005056BB-0B24-0ed3-0000-004294967300",  // Corporate network (0.0.0.0/0 except VN_IOT)
        "name": "Corporate-Network"
      }
    ]
  },
  "metadata": {
    "reason": "Perimeter intrusion detected by edge AI - Camera 47",
    "duration": 1800,  // 30 minutes (auto-expire)
    "createdBy": "edge-ai-automation"
  }
}
```

**API Response (50ms later - 14:32:05.225):**

```json
{
  "id": "005056BB-0B24-0ed3-0000-004294967400",
  "name": "BLOCK-LoadingDock-AutoGenerated-20250115-143205",
  "action": "BLOCK",
  "enabled": true,
  "metadata": {
    "timestamp": "2025-01-15T14:32:05.225Z",
    "expiryTimestamp": "2025-01-15T15:02:05.225Z"  // Auto-expires in 30 minutes
  }
}
```

**Result:** Loading Dock VLAN 150 isolated from corporate network for 30 minutes (prevents lateral movement if intruder gains network access).

---

**Action 2: XDR SecureX - Create Security Incident (~40ms)**

**API Request:**

```http
POST https://securex.cisco.com/iroh/iroh-response/respond/trigger
Authorization: Bearer <xdr_token>
Content-Type: application/json

{
  "observables": [
    {
      "type": "ip",
      "value": "10.150.2.47"  // Camera 47 IP address (source of detection)
    },
    {
      "type": "mac-address",
      "value": "00:40:8c:cd:ab:47"  // Camera 47 MAC address
    }
  ],
  "targets": [
    {
      "type": "endpoint",
      "observables": [
        {
          "type": "hostname",
          "value": "edge-ai-mumbai-01"
        }
      ],
      "observed_time": {
        "start_time": "2025-01-15T14:32:05.000Z"
      }
    }
  ],
  "severity": "High",
  "title": "Perimeter Intrusion Detected - Loading Dock - Camera 47",
  "description": "Edge AI detected unauthorized person at loading dock perimeter fence. Multi-source validation: 0 badge swipes (ISE), anomalous occupancy (Splunk MLTK), network healthy (ThousandEyes), application healthy (AppDynamics). FTD block rule applied to VLAN 150.",
  "status": "New",
  "tlp": "amber"  // Traffic Light Protocol: Amber (limited disclosure)
}
```

**API Response (40ms later - 14:32:05.215):**

```json
{
  "id": "incident-2025-0147",
  "title": "Perimeter Intrusion Detected - Loading Dock - Camera 47",
  "status": "New",
  "severity": "High",
  "created": "2025-01-15T14:32:05.215Z",
  "workflow_status": "enrichment_in_progress"  // XDR auto-correlates with AMP, Umbrella, ISE telemetry
}
```

**Result:** XDR incident created, correlates with AMP (malware detection), Umbrella (DNS queries), ISE (network sessions) for complete threat picture.

---

**Action 3: ServiceNow - Create Incident Ticket with Video Snapshot (~60ms)**

**API Request:**

```http
POST https://abhavtech.service-now.com/api/now/table/incident
Authorization: Basic <base64_encoded_credentials>
Content-Type: application/json

{
  "short_description": "Perimeter Intrusion Detected - Loading Dock - Camera 47",
  "description": "Edge AI detected unauthorized person at loading dock perimeter fence (14:32:05 IST, Tuesday Jan 15). Multi-source validation confirms high-confidence unauthorized entry: 0 ISE badge swipes, occupancy 5× higher than historical pattern (Splunk MLTK), network healthy (ThousandEyes 0% loss), RTSP service healthy (AppDynamics 0% errors). Automated actions executed: FTD block rule applied to VLAN 150 (30-minute duration), XDR incident #incident-2025-0147 created. Video snapshot attached for supervisor review.",
  "priority": "2",  // 2-High priority (P1 reserved for life-safety emergencies)
  "assigned_to": "security-supervisor-mumbai",
  "category": "Security",
  "subcategory": "Physical Security",
  "u_camera_id": "cam-47",
  "u_zone_id": "RZ-LOADING-DOCK",
  "u_ai_confidence": "96%",
  "u_ftd_rule_id": "005056BB-0B24-0ed3-0000-004294967400",
  "u_xdr_incident_id": "incident-2025-0147"
}
```

**Video Snapshot Attachment (Separate API Call):**

```http
POST https://abhavtech.service-now.com/api/now/attachment/file
Authorization: Basic <base64_encoded_credentials>
Content-Type: multipart/form-data

table_name: incident
table_sys_id: <incident_sys_id_from_previous_response>
file_name: camera-47-perimeter-intrusion-20250115-143205.jpg
file: <base64_encoded_jpeg_image>  // 10-second video clip extracted as 10 JPEG snapshots
```

**API Response (60ms later - 14:32:05.235):**

```json
{
  "result": {
    "sys_id": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "number": "INC0012345",
    "short_description": "Perimeter Intrusion Detected - Loading Dock - Camera 47",
    "priority": "2",
    "assigned_to": {
      "value": "security-supervisor-mumbai",
      "display_value": "Amit Sharma"
    },
    "state": "2",  // State: In Progress (auto-assigned to supervisor)
    "opened_at": "2025-01-15T14:32:05.235Z"
  }
}
```

**Result:** ServiceNow incident INC0012345 created with full context, assigned to security supervisor for review.

---

**Action 4: Webex Teams - Mobile Supervisor Alert (~80ms)**

**API Request:**

```http
POST https://webexapis.com/v1/messages
Authorization: Bearer <webex_token>
Content-Type: application/json

{
  "toPersonEmail": "security-supervisor-mumbai@abhavtech.com",
  "markdown": "**🚨 PERIMETER INTRUSION DETECTED 🚨**\n\n**Location:** Loading Dock Perimeter Fence - Camera 47\n**Time:** 14:32:05 IST, Tuesday Jan 15, 2025\n**AI Confidence:** 96%\n\n**Validations:**\n✅ ISE pxGrid: 0 badge swipes (unauthorized)\n✅ Splunk MLTK: Occupancy anomalous (5× higher than expected)\n✅ ThousandEyes: Network healthy (0% loss)\n✅ AppDynamics: RTSP healthy (0% errors)\n\n**Automated Actions:**\n✅ FTD: VLAN 150 blocked (30 minutes)\n✅ XDR: Incident #incident-2025-0147 created\n✅ ServiceNow: INC0012345 assigned to you\n\n**Video Snapshot:** [View 10-second clip](https://servicenow.abhavtech.com/incident/INC0012345/attachments)\n\n**Next Steps:** Review video, dispatch security guard to loading dock if needed."
}
```

**API Response (80ms later - 14:32:05.255):**

```json
{
  "id": "Y2lzY29zcGFyazovL3VzL01FU1NBR0UvMTIzNDU2Nzg5MA",
  "roomType": "direct",
  "toPersonEmail": "security-supervisor-mumbai@abhavtech.com",
  "created": "2025-01-15T14:32:05.255Z"
}
```

**Result:** Supervisor receives mobile push notification on Webex Teams within 2-3 seconds (Webex mobile app push delivery).

---

#### Frame 255ms - 14:32:05.255: All Automated Actions Complete

**Action Execution Summary:**

| Action | API Response Time | Status |
|--------|------------------|--------|
| **FTD Network Block** | 50ms | ✅ Block rule active (VLAN 150 isolated, 30-minute duration) |
| **XDR Security Incident** | 40ms | ✅ Incident #incident-2025-0147 created, enrichment in progress |
| **ServiceNow Ticket** | 60ms | ✅ INC0012345 created, assigned to supervisor, video snapshot attached |
| **Webex Mobile Alert** | 80ms | ✅ Mobile push notification sent to supervisor |

**Total Action Time:** max(50ms, 40ms, 60ms, 80ms) = **80ms** (parallel execution)

---

#### Frame 500ms - 14:32:05.500: Supervisor Receives Mobile Notification

**Total End-to-End Latency:**

| Stage | Time | Cumulative |
|-------|------|-----------|
| Frame acquisition | 0ms | 0ms |
| Pre-processing | 5ms | 5ms |
| GPU inference | 20ms | 25ms |
| Post-processing | 3ms | 28ms |
| Duplicate check | 2ms | 30ms |
| Multi-source validation (parallel) | 100ms | 130ms |
| Decision logic | 20ms | 150ms |
| Automated actions (parallel) | 80ms | 230ms |
| Network propagation (FTD rule deployment + Webex mobile push) | 270ms | 500ms |
| **TOTAL** | | **500ms** |

**Human Response Timeline:**

```
14:32:05.500 - Supervisor receives Webex mobile push notification on smartphone
14:32:07.000 - Supervisor taps notification, opens Webex app (1.5 seconds)
14:32:10.000 - Supervisor clicks video snapshot link, opens ServiceNow incident (3 seconds)
14:32:20.000 - Supervisor reviews 10-second video clip, confirms unauthorized entry (10 seconds)
14:32:30.000 - Supervisor dispatches security guard to loading dock via radio (10 seconds)
14:35:00.000 - Security guard arrives at loading dock (2.5 minutes travel time from main entrance)

Total: 2 minutes 30 seconds from detection to physical security arrival at scene
```

**Contrast with Traditional Edge AI (No Multi-Source Validation):**

```
Traditional Edge AI - Manual Review Workflow:

14:32:05.000 - Camera detects person (AI 85% confidence, below 90% automated action threshold)
14:32:05.030 - Email sent to security-supervisor@abhavtech.com (no mobile push)
14:45:00.000 - Supervisor checks email during routine patrol (13 minutes elapsed)
14:47:00.000 - Supervisor reviews video, confirms unauthorized entry
14:48:00.000 - Supervisor dispatches security guard
14:55:00.000 - Security guard arrives at loading dock (7 minutes after dispatch)

Total: 23 minutes from detection to physical security arrival
Outcome: Intruder has 23-minute window to access building interior, exfiltrate data, or plant malware
```

**Key Differentiator:** Abhavtech's multi-source validation enables **high-confidence automated actions within 500ms**, reducing response time from 23 minutes (traditional manual review) to 2.5 minutes (automated containment + rapid supervisor dispatch).

---

#### Validation Failure Scenarios - What Happens If...

**Scenario 1: ISE pxGrid API Timeout (Network Issue)**

```
14:32:05.030 - Launch ISE pxGrid API call
14:32:05.530 - ISE pxGrid timeout (500ms elapsed, no response)

Decision Logic:
- ISE validation: INCONCLUSIVE (timeout, cannot confirm authorized vs. unauthorized)
- Splunk MLTK: Anomalous ✅
- ThousandEyes: Network healthy ✅
- AppDynamics: App healthy ✅

Decision: LOW CONFIDENCE (1 validation inconclusive)
Action: Route to MANUAL REVIEW (ServiceNow ticket created, no automated FTD block)
Reasoning: Cannot confidently determine unauthorized entry without ISE badge correlation
```

**Scenario 2: Splunk MLTK Shows Normal Occupancy Pattern**

```
14:32:05.135 - Splunk MLTK response:
  {
    "expected_occupancy": 0.8,   // Historical average: 0.8 people (lunch break, employees present)
    "current_occupancy": 1,      // Current detection: 1 person
    "anomaly": 0                 // Normal (within expected range)
  }

Decision Logic:
- ISE validation: Unauthorized ✅
- Splunk MLTK: Normal (NOT anomalous) ❌
- ThousandEyes: Network healthy ✅
- AppDynamics: App healthy ✅

Decision: LOW CONFIDENCE (Splunk validation failed)
Action: Route to MANUAL REVIEW
Reasoning: Occupancy is normal for this time, person may be legitimate employee on break (ISE badge reader may have failed to capture swipe)
```

**Scenario 3: ThousandEyes Detects Network Degradation**

```
14:32:05.115 - ThousandEyes response:
  {
    "avgLatency": 120,  // 120ms latency (above 100ms threshold)
    "loss": 5.0         // 5% packet loss (above 1% threshold)
  }

Decision Logic:
- ISE validation: Unauthorized ✅
- Splunk MLTK: Anomalous ✅
- ThousandEyes: Network degraded ❌
- AppDynamics: App healthy ✅

Decision: LOW CONFIDENCE (ThousandEyes validation failed)
Action: Route to MANUAL REVIEW + NOC escalation
Reasoning: Network path degraded, 5% packet loss may cause frame corruption (false positive risk). Escalate to NOC to investigate Camera 47 network path.
```

**Scenario 4: AppDynamics Detects RTSP Service Errors**

```
14:32:05.125 - AppDynamics response:
  {
    "avg_error_rate": 12.0  // 12% error rate (above 5% threshold)
  }

Decision Logic:
- ISE validation: Unauthorized ✅
- Splunk MLTK: Anomalous ✅
- ThousandEyes: Network healthy ✅
- AppDynamics: RTSP unhealthy ❌

Decision: LOW CONFIDENCE (AppDynamics validation failed)
Action: Route to MANUAL REVIEW + NOC escalation
Reasoning: RTSP service unhealthy, 12% error rate may cause corrupt video frames (false positive risk). Escalate to NOC to restart RTSP service.
```

---

*Next: Section 2.2 - Use Case 2: Smart Building Optimization (BMS integration, WF-009 workflow, energy savings validation)*