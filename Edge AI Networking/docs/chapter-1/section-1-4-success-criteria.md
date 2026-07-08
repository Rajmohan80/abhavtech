## 1.4 THREE USE CASES & BUSINESS VALUE

Phase 4 delivers business value through three core use cases that leverage Edge AI + Observability Fusion across security, operational efficiency, and compliance domains. Each use case is designed with measurable validation criteria and integration with Abhavtech's existing infrastructure from Phases 1-3.

---

# Success Criteria & Metrics

### 1.4.1 Use Case 1: Intelligent Physical Security

**Objective:** Achieve 100% perimeter coverage with AI-powered intrusion detection, reducing false positive rate from 15-30% (traditional edge AI) to <5% through multi-source validation.

**Six Security Functions:**

**Function 1: Perimeter Intrusion Detection (<500ms Response)**

Edge AI analyzes outdoor PTZ camera feeds to detect unauthorized entry at building perimeter:
- **AI Model:** YOLO v8 object detection (person, vehicle classes)
- **Camera Deployment:** 40 outdoor PTZ cameras per site (Mumbai, Chennai) covering all building perimeter zones
- **Integration:** FTD firewall API for automated network blocking, XDR for security incident correlation
- **Validation:** Multi-source (ISE pxGrid badge events, Splunk MLTK historical patterns, ThousandEyes network path, AppDynamics RTSP health)
- **Action:** High-confidence detections trigger FTD block rule (temporary 30-minute VLAN isolation), XDR security incident, ServiceNow ticket, Webex supervisor alert
- **Target Latency:** <500ms from detection to supervisor mobile notification

**Real-World Process Flow:**
```
14:32:05.000 - Outdoor camera detects person at perimeter fence (no authorized entry point)
14:32:05.020 - YOLO v8 inference: Person detected (96% confidence)
14:32:05.025 - Check ISE pxGrid: 0 badge swipes in last 5 minutes ✅
14:32:05.025 - Check Splunk MLTK: Perimeter zone expected occupancy = 0 (anomalous) ✅
14:32:05.025 - Check ThousandEyes: Camera network path healthy (0% packet loss) ✅
14:32:05.025 - Check AppDynamics: RTSP streaming service healthy (0% errors) ✅
14:32:05.150 - Decision: HIGH CONFIDENCE (all 4 validations passed)
14:32:05.170 - Execute automated actions:
              - FTD: Create block rule for perimeter zone VLAN
              - XDR: Create security incident INC-2025-0147
              - ServiceNow: Auto-ticket INC0012345 assigned to security supervisor
              - Webex: Send mobile push notification with 10-second video snapshot
14:32:05.500 - Security supervisor receives alert, dispatches physical security team

Total Response Time: 500ms (vs. 10-30 minutes traditional manual review)
```

**Function 2: Loitering Detection (<1 Second Response)**

Edge AI tracks multi-object trajectories to detect loitering behavior (person remaining in restricted zone >2 minutes):
- **AI Model:** DeepSORT multi-object tracking (maintains object identity across frames)
- **Camera Deployment:** 60 indoor fixed cameras per site monitoring restricted zones (server room entrance, executive floor, loading dock)
- **Integration:** ISE pxGrid for badge reader correlation (is this person authorized for this zone?), Splunk for historical dwell time analysis
- **Validation:** If person remains in restricted zone >2 minutes AND no badge swipe for that zone → Alert
- **Action:** ServiceNow ticket creation, supervisor Webex notification (not FTD block, as authorized employees may trigger false positives)

**Function 3: Tailgating Detection (<2 Seconds Response)**

Edge AI correlates person count (camera) with badge swipe count (ISE pxGrid) to detect unauthorized entry via tailgating:
- **AI Model:** YOLO v8 person detection + person counting algorithm
- **Camera Deployment:** 8 main entrance cameras per site (lobby turnstile, main entrance, executive entrance)
- **Integration:** ISE pxGrid real-time badge swipe events (SGT-71 badge readers)
- **Validation:** If camera detects 2 people entering within 3 seconds BUT ISE pxGrid records only 1 badge swipe → Tailgating suspected
- **Action:** ServiceNow ticket, security supervisor alert, video review (not automated FTD block due to high false positive risk - employees holding door for colleagues)

**Process Flow Example:**
```
09:15:30 - Badge reader: Employee "jsmith" badge swipe (ISE pxGrid event)
09:15:31 - Camera: 2 people detected entering within 3 seconds
09:15:32 - Correlation: 2 people detected, 1 badge swipe = Tailgating suspected
09:15:33 - Action: ServiceNow ticket created, security supervisor Webex alert
           (Manual review required - could be employee holding door for colleague with forgotten badge)
```

**Function 4: License Plate Recognition (LPR) (<3 Seconds Response)**

Edge AI performs OCR on license plates to validate vehicle access against authorized vehicle database:
- **AI Model:** Custom CNN trained on India license plate format + Tesseract OCR
- **Camera Deployment:** 20× 4K LPR cameras per site (parking lot entrances, loading dock gate)
- **Integration:** CyberArk PAM database (authorized vehicle list), ISE for employee-to-vehicle mapping
- **Validation:** OCR result compared against authorized vehicle list, if no match → Alert
- **Action:** ServiceNow ticket, security supervisor alert, gate access denied (if automated gate integration available)

**Function 5: Crowd Density Monitoring (<5 Seconds Response)**

Edge AI generates heatmap of people density to detect unsafe crowding (fire safety, evacuation compliance):
- **AI Model:** YOLO v8 person detection + density heatmap generation
- **Camera Deployment:** 50 common area cameras per site (cafeteria, lobbies, hallways)
- **Integration:** BMS fire alarm system (if fire alarm triggered, validate evacuation routes not overcrowded)
- **Validation:** If density exceeds 0.5 people per square meter (fire code threshold) → Alert
- **Action:** ServiceNow ticket, facilities alert (immediate response to clear congestion)

**Function 6: Access Control Correlation (<2 Seconds Response)**

Edge AI correlates video with ISE badge events and CyberArk PAM privileged access logs for executive/server room entry:
- **AI Model:** YOLO v8 person detection
- **Camera Deployment:** 4 server room entrance cameras per site, 8 executive floor cameras
- **Integration:** ISE pxGrid (badge swipe events), CyberArk PAM (privileged access requests for server room)
- **Validation:** If person detected in server room BUT no CyberArk PAM access request logged in last 5 minutes → Unauthorized access
- **Action:** HIGH PRIORITY ServiceNow incident, CISO immediate alert, FTD block rule (server room VLAN isolated)

**Use Case 1 Business Value:**

| Metric | Current Baseline (No Edge AI) | Phase 4 Target | Measurement Method |
|--------|-------------------------------|----------------|-------------------|
| **Perimeter Coverage** | 60% (manual security patrol gaps) | 100% (AI-powered 24/7 monitoring) | Camera FOV mapping, security audit |
| **False Positive Rate** | 15-30% (traditional edge AI benchmark) | <5% (multi-source validation) | Manual review of 200 events over 14 days |
| **Mean Time To Alert (MTTA)** | 10-30 minutes (manual patrol observation) | <500ms (automated high-confidence alerts) | AppDynamics BT latency metrics |
| **After-Hours Coverage** | Limited (1 security guard per site, patrols 20% of perimeter) | 100% (AI monitoring continues 24/7) | Incident logs (after-hours events detected) |
| **Audit Trail Completeness** | 70% (manual incident logs, gaps during patrols) | 100% (automated ServiceNow tickets with video snapshots) | ServiceNow audit report |

**Key Integration Points:**
- ✅ ISE pxGrid 2.0 WebSocket subscription (real-time badge swipe events)
- ✅ FTD REST API (automated network blocking for high-confidence intrusions)
- ✅ XDR SecureX workflows (security event correlation with AMP, Umbrella, FTD telemetry)
- ✅ CyberArk PAM API (privileged access logs for server room correlation)
- ✅ ServiceNow Incident API (automated ticket creation with video snapshot attachments)
- ✅ Webex Teams API (supervisor mobile push notifications)

---

### 1.4.2 Use Case 2: Smart Building Optimization

**Objective:** Achieve 15-20% HVAC energy savings through occupancy-based automation with <2% false positive rate (incorrect HVAC reductions) using Splunk MLTK validation.

**Four Building Automation Functions:**

**Function 1: Occupancy Detection (15-Minute Intervals)**

Edge AI performs people counting every 15 minutes to determine real-time zone occupancy:
- **AI Model:** YOLO v8 person detection + counting algorithm
- **Camera Deployment:** 60 indoor fixed cameras per site covering 110 zones (conference rooms, open workspace, private offices)
- **Integration:** BMS PIR motion sensors (sensor fusion: camera people count + PIR occupancy state)
- **Accuracy:** >95% (vs. 80-85% for PIR sensors alone, which cannot distinguish 1 person vs. 5 people)
- **Process:** Every 15 minutes, edge AI counts people per zone, exports to Splunk for WF-009 workflow trigger evaluation

**Occupancy Detection Process Flow:**
```
14:00:00 - Edge AI counts people in Conference Room 5-A: 2 people detected
14:00:05 - BMS PIR sensor status: Occupied (motion detected in last 10 minutes)
14:00:10 - Sensor fusion validation: Camera (2 people) + PIR (occupied) = CONFIRMED occupancy
14:00:15 - Export to Splunk: {"zone": "Conf-5A", "occupancy": 2, "timestamp": "2025-01-15T14:00:00Z"}

14:15:00 - Next 15-minute interval: Edge AI counts people: 0 people detected
14:15:05 - BMS PIR sensor status: Not occupied (no motion detected in last 10 minutes)
14:15:10 - Sensor fusion validation: Camera (0 people) + PIR (not occupied) = CONFIRMED vacant
14:15:15 - Export to Splunk: {"zone": "Conf-5A", "occupancy": 0, "timestamp": "2025-01-15T14:15:00Z"}
14:15:20 - WF-009 trigger evaluation: Low occupancy detected (0 people, sustained >30 minutes?)
```

**Function 2: HVAC Optimization (AgenticOps WF-009 Workflow)**

AgenticOps WF-009 automates HVAC setpoint adjustments based on validated low occupancy:

**WF-009 Trigger Criteria:**
- Occupancy <5 people for >30 minutes continuous (prevents false triggers from brief absences)
- Zone not in protected list (server rooms, executive offices always maintain 21-22°C)
- Within operational hours (08:00 - 22:00 IST, no HVAC changes during night shift when skeleton crew present)

**WF-009 Multi-Source Validation (Before HVAC Reduction):**
1. **Splunk MLTK Validation:** Query historical occupancy patterns for this zone at this time
   - Query: `index=bms zone="Conf-5A" earliest=-30d | eval expected_occupancy=predict(occupancy_count, _time)`
   - Validation: If current occupancy (0) < 50% of MLTK predicted occupancy (10 expected) → Anomalous (proceed with caution)
   - If current occupancy matches MLTK prediction (e.g., 0 expected, 0 detected) → Normal (high confidence for HVAC reduction)

2. **ThousandEyes Validation:** Verify BMS API network path healthy
   - Query: ThousandEyes test "edge-ai → BMS API" packet loss <1%, latency <100ms
   - Validation: Ensures HVAC API call will succeed

3. **AppDynamics Validation:** Verify BMS API service healthy
   - Query: AppDynamics BT "BMS-API-Control" error rate <5%, response time <2 seconds
   - Validation: Ensures HVAC setpoint change will execute correctly

**WF-009 Execution (High-Confidence Decision):**
```
14:45:00 - WF-009 trigger: Conference Room 5-A occupancy = 0 people (sustained 30 minutes)
14:45:05 - Splunk MLTK validation: Expected occupancy at 14:45 on Tuesday = 0 people ✅ (lunch hour, normal)
14:45:10 - ThousandEyes validation: BMS API network path healthy (0% packet loss) ✅
14:45:15 - AppDynamics validation: BMS API service healthy (0% error rate) ✅
14:45:20 - Decision: HIGH CONFIDENCE (all 3 validations passed, safe to reduce HVAC)
14:45:25 - Execute BMS API call:
           POST https://bms.abhavtech.com/api/v2/zones/Conf-5A/control
           Payload: {"hvac_setpoint": 24, "lighting_level": 30, "reason": "WF-009 low occupancy optimization"}
14:45:30 - BMS response: 200 OK, setpoint changed from 22°C → 24°C, lighting reduced from 100% → 30%
14:45:35 - Splunk audit log: WF-009 executed HVAC reduction (Conf-5A, 22°C → 24°C, reason: low occupancy)

Energy Impact: 2°C increase (22°C → 24°C) = ~12-15% HVAC energy reduction for this zone
```

**WF-009 Guardrails (Prevent Harmful Actions):**

**Protected Zones (NEVER reduce HVAC, regardless of occupancy):**
- Server rooms (SGT-61): Always maintain 21°C for equipment cooling
- Executive offices (SGT-11): Manual control only (executive preference override)
- Conference rooms during scheduled meetings (calendar integration): Maintain 22°C even if occupancy temporarily drops

**Rate Limits:**
- Maximum 5 HVAC adjustments per zone per hour (prevents oscillation)
- Minimum 15-minute dwell time before reversing HVAC adjustment (prevents rapid cycling)

**Manual Override:**
- Facilities manager can mark zones "manual control only" via ServiceNow (disables WF-009 for that zone)
- Emergency override: Facilities can force all zones to 22°C with single command (overrides all WF-009 automation)

**Rollback Procedure:**
```
15:15:00 - Edge AI detects occupancy increased: Conference Room 5-A = 8 people (meeting started)
15:15:05 - WF-009 rollback trigger: Occupancy increased >5 people within 10 minutes of HVAC reduction
15:15:10 - Execute BMS API call (rollback):
           POST https://bms.abhavtech.com/api/v2/zones/Conf-5A/control
           Payload: {"hvac_setpoint": 22, "lighting_level": 100, "reason": "WF-009 rollback - occupancy increased"}
15:15:15 - BMS response: 200 OK, setpoint restored 24°C → 22°C, lighting restored 30% → 100%
15:15:20 - Splunk audit log: WF-009 rollback executed (Conf-5A, occupancy increased from 0 → 8 people)
```

**Function 3: Lighting Control (If 0 People >15 Minutes)**

Similar to HVAC optimization but with shorter dwell time (15 minutes vs. 30 minutes) and deeper reduction (30% vs. 24°C):
- Trigger: Occupancy = 0 people for >15 minutes
- Action: Reduce lighting from 100% → 30% (maintains minimum safety lighting per building code)
- Guardrails: Protected zones (server rooms always 100% lighting), rate limits (max 10 adjustments per zone per hour)

**Function 4: Meeting Room Utilization Analytics**

Edge AI compares scheduled meeting occupancy (calendar integration) vs. actual occupancy (camera people count):
- **Integration:** Microsoft Exchange calendar API (meeting room bookings)
- **Analysis:** If meeting room booked 08:00-17:00 BUT actual occupancy only 6 hours → "Ghost booking" detected
- **Action:** Splunk dashboard "Meeting Room Utilization" shows actual vs. booked hours, facilities team can release unused bookings for flexible use
- **Business Value:** Improve meeting room utilization from 60% (current) to 80% (target) by releasing ghost bookings

**Use Case 2 Business Value:**

| Metric | Current Baseline | Phase 4 Target | Validation Method |
|--------|------------------|----------------|-------------------|
| **Energy Savings (HVAC)** | Baseline: Mumbai 450 kWh/day, Chennai 420 kWh/day | 15-20% reduction (68-90 kWh/day Mumbai, 63-84 kWh/day Chennai) | BMS logs: 30-day post-deployment vs. baseline (same month prior year, weather-normalized) |
| **WF-009 False Positive Rate** | N/A (no automation baseline) | <2% (incorrect HVAC reductions causing comfort complaints) | Facilities manager manual review of HVAC adjustments over 14 days |
| **Occupancy Detection Accuracy** | 80-85% (PIR sensors alone) | >95% (camera + PIR sensor fusion) | Edge AI people count vs. BMS PIR sensor state, 14-day validation |
| **Meeting Room Utilization** | 60% (booked vs. actual usage) | 80% (ghost booking release) | Splunk dashboard: Scheduled hours vs. actual occupied hours |

**Key Integration Points:**
- ✅ BMS Honeywell EBI R410.1 REST API (OAuth 2.0, HVAC/lighting control)
- ✅ Splunk MLTK (historical occupancy pattern prediction, WF-009 validation)
- ✅ ThousandEyes (BMS API network path validation)
- ✅ AppDynamics (BMS API service health validation)
- ✅ Microsoft Exchange API (meeting room calendar integration for utilization analytics)
- ✅ AgenticOps WF-009 workflow (automated HVAC/lighting control with guardrails)

---

### 1.4.3 Use Case 3: Safety & Compliance Monitoring

**Objective:** Achieve >92% PPE detection accuracy and 100% incident audit trail for regulatory compliance (India Factory Act 1948).

**Four Safety Functions:**

**Function 1: PPE Detection (Hard Hat, Safety Vest) - <2 Seconds Response**

Edge AI detects employees in designated safety zones without required PPE:
- **AI Model:** Custom CNN trained on Abhavtech loading dock imagery (5,000+ labeled images: hard hat present/absent, safety vest present/absent)
- **Camera Deployment:** 6 loading dock cameras per site (dedicated PPE monitoring zone)
- **Designated Safety Zones:** Loading dock, warehouse, maintenance areas
- **Validation:** If person detected in safety zone AND (hard hat absent OR safety vest absent) → PPE violation
- **Action:** ServiceNow incident ticket created <10 seconds, supervisor Webex notification <30 seconds

**PPE Detection Process Flow:**
```
10:35:00 - Camera detects person entering loading dock zone
10:35:02 - PPE detection inference:
           - Person detected: ✅ Yes (YOLO v8, 95% confidence)
           - Hard hat detected: ❌ No (PPE CNN, 92% confidence absent)
           - Safety vest detected: ❌ No (PPE CNN, 94% confidence absent)
10:35:03 - Decision: PPE VIOLATION (person in safety zone without hard hat AND safety vest)
10:35:04 - Create ServiceNow incident:
           POST https://abhavtech.service-now.com/api/now/table/incident
           Payload: {
             "short_description": "PPE Violation - Loading Dock - Employee without hard hat/vest",
             "priority": "3-Medium",
             "assigned_to": "loading-dock-supervisor",
             "category": "Safety",
             "attachments": ["video-snapshot-10-35-02.jpg"]
           }
10:35:09 - ServiceNow incident INC0012346 created (9 seconds elapsed)
10:35:10 - Send Webex notification to loading dock supervisor:
           POST https://webexapis.com/v1/messages
           Payload: {
             "toPersonEmail": "loading-dock-supervisor@abhavtech.com",
             "markdown": "**PPE VIOLATION:** Employee detected without hard hat/vest at loading dock. ServiceNow INC0012346 created. Please investigate immediately."
           }
10:35:30 - Supervisor receives mobile push notification (30 seconds elapsed from detection)

Compliance Impact: 100% incident audit trail (ServiceNow ticket + video snapshot)
```

**Function 2: Hazardous Zone Monitoring (ISE Badge Correlation)**

Edge AI detects unauthorized personnel in hazardous zones (chemicals storage, electrical room):
- **AI Model:** YOLO v8 person detection
- **Camera Deployment:** 4 hazardous zone cameras per site (chemicals storage, electrical room)
- **Integration:** ISE pxGrid for badge reader correlation (only employees with hazardous material training certified, SGT-72, allowed in zone)
- **Validation:** If person detected in hazardous zone BUT ISE pxGrid shows no badge swipe from SGT-72 certified employee → Unauthorized access
- **Action:** HIGH PRIORITY ServiceNow incident, facilities manager immediate alert, supervisor dispatch to escort person out

**Function 3: Slip/Fall Detection (Pilot Only, Not Production)**

Edge AI analyzes body pose estimation to detect potential slip/fall incidents:
- **AI Model:** OpenPose skeleton detection (experimental, pilot testing only)
- **Status:** Observe mode only (log detections, no automated alerts) - False positive rate currently 15-20% (too high for production)
- **Pilot Objective:** Collect training data (200+ hours of loading dock video) to improve model accuracy from 80% → >95% before production deployment
- **Future:** If pilot successful (accuracy >95%), deploy in Phase 5 for immediate slip/fall emergency response

**Function 4: Fire/Smoke Detection (Thermal Cameras)**

Thermal cameras detect temperature anomalies for early fire detection:
- **AI Model:** Temperature threshold detection (>60°C sustained for >10 seconds)
- **Camera Deployment:** 10 thermal cameras per site (FLIR A310f, 320×240 resolution, -20°C to +350°C range)
- **Zones:** Server room, electrical room, loading dock (high fire risk areas)
- **Integration:** BMS fire alarm system (edge AI detection supplements smoke detectors, not replacement)
- **Action:** If temperature >60°C detected → ServiceNow CRITICAL incident, facilities immediate alert, fire alarm system notification

**Use Case 3 Business Value:**

| Metric | Current Baseline | Phase 4 Target | Validation Method |
|--------|------------------|----------------|-------------------|
| **PPE Compliance Rate** | 85% (manual supervisor spot-checks, 30-minute patrol intervals) | 100% (AI-powered continuous monitoring) | Loading dock supervisor weekly audit (100 employee entries sampled) |
| **PPE Detection Accuracy** | N/A (no automated system baseline) | >92% (hard hat + safety vest detection) | Loading dock supervisor weekly spot-check vs. edge AI predictions (100 samples) |
| **Incident Response Time** | 5-15 minutes (supervisor patrols every 30 minutes, may miss violations) | <30 seconds (detection → supervisor Webex notification) | ServiceNow incident timestamps |
| **Incident Audit Trail** | 70% (manual supervisor logs, gaps during lunch breaks, shift changes) | 100% (automated ServiceNow tickets with video snapshots, 180-day retention) | ServiceNow audit report (regulatory compliance requirement) |
| **Compliance (India Factory Act 1948)** | Partial (manual logs insufficient for regulatory audits) | Full (100% incident audit trail, video evidence for 180 days) | Regulatory audit readiness assessment |

**Key Integration Points:**
- ✅ ServiceNow Incident API (automated PPE violation tickets, <10 second creation)
- ✅ Webex Teams API (supervisor mobile notifications, <30 second delivery)
- ✅ ISE pxGrid (hazardous zone badge correlation, SGT-72 certified employees)
- ✅ BMS Fire Alarm System (thermal camera fire detection integration)
- ✅ Splunk (180-day audit log retention for regulatory compliance)

---

### 1.4.4 Cross-Use Case Business Value Summary

**Integrated Value Across All Three Use Cases:**

| Business Dimension | UC1: Physical Security | UC2: Building Optimization | UC3: Safety Compliance | **Integrated Value** |
|--------------------|------------------------|----------------------------|------------------------|----------------------|
| **Operational Efficiency** | Alert fatigue reduction (66-83% fewer false positives) | Energy savings (15-20% HVAC reduction) | Incident response time (<30 sec vs. 5-15 min) | **Reduced NOC/SOC/Facilities operational burden** |
| **Risk Mitigation** | 100% perimeter coverage (vs. 60% manual patrol) | Occupant comfort maintained (<2% false positive HVAC reductions) | 100% PPE compliance (vs. 85% baseline) | **Comprehensive risk coverage: security, comfort, safety** |
| **Compliance & Audit** | 100% security incident audit trail (ServiceNow + video) | BMS energy logs (30-day validation for sustainability reporting) | 100% safety incident audit trail (180-day retention, regulatory compliance) | **Complete audit trail for ISO 27001, SOC 2, India Factory Act** |
| **Technology Integration** | ISE pxGrid, FTD, XDR, CyberArk PAM | BMS API, Splunk MLTK, AgenticOps WF-009 | ServiceNow, Webex, ISE pxGrid | **Leverage existing Phase 1-3 investments** |
| **Scalability** | Proven at 120 cameras per site (GPU 70-80% utilization) | Proven at 110 zones per site (HVAC/lighting automation) | Proven at loading dock (PPE detection >92% accuracy) | **Validated architecture ready for Phase 5 branch expansion** |

**Key Insight:** The three use cases are **complementary, not redundant**. UC1 provides security, UC2 provides operational efficiency, UC3 provides compliance - together they deliver comprehensive business value that justifies the $646,000 pilot investment through multiple value streams (bandwidth cost avoidance, energy savings, compliance risk mitigation, operational efficiency gains).

---

*Next: Section 1.5 - Architecture Philosophy: Distributed Intelligence + Centralized Wisdom*