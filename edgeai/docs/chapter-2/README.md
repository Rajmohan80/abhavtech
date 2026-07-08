# Chapter 2: Use Case Architecture

**Three Core Use Cases with Multi-Source Validation**

This chapter details the architecture for three Edge AI use cases deployed at Mumbai and Chennai hub sites. Each use case demonstrates Edge AI + Observability Fusion with real-time multi-source validation.

---

## Use Case 1: Intelligent Physical Security

### [2.1.1 Security Functions & AI Models](section-2-1-1-security-functions.md)
Six security functions: perimeter intrusion, loitering detection, tailgating, license plate recognition, crowd density, and access control correlation.

### [2.1.2 Camera Deployment & Network Architecture](section-2-1-2-camera-deployment.md)
Complete camera deployment design (135 cameras per site), network infrastructure, bandwidth calculations, and hardware specifications (UCS XE9305 + NVIDIA L4).

### [2.1.3 Observability Integration Timeline](section-2-1-3-observability-integration.md)
500ms end-to-end detection timeline with millisecond precision: frame capture, GPU inference, multi-source validation (ISE, Splunk, TE, AppD), and automated action.

---

## Use Case 2: Building Automation

### [2.2 Smart Building Optimization](section-2-2-building-automation.md)
HVAC and lighting optimization using occupancy detection, BMS API integration, and AgenticOps WF-009 automated workflows. Target: 15-20% energy savings.

---

## Use Case 3: Safety & Compliance

### [2.3 Safety & Compliance Monitoring](section-2-3-safety-compliance.md)
PPE detection (hard hat, safety vest), fire/smoke detection using thermal cameras, and slip/fall detection with pose estimation.

---

## Cross-Use Case Architecture

### [2.4 Infrastructure Sharing & GPU Utilization](section-2-4-cross-use-case.md)
How all three use cases share the same Edge AI platform (UCS XE9305 + NVIDIA L4), GPU utilization analysis (80-95%), and multi-pipeline processing.

---

## Architecture Highlights

- **AI Models:** YOLO v8n, DeepSORT, custom CNNs (PPE detection), OpenPose (fall detection)
- **GPU Platform:** NVIDIA L4 24GB (120 TOPS INT8, 72W TDP, 20ms inference time)
- **Network:** 960 Mbps per site, VLAN 150, SGT-70, PoE+ 3,000W budget
- **Integration:** Real-time API calls to ISE, Splunk, ThousandEyes, AppDynamics, BMS
- **Performance:** <500ms end-to-end latency, <5% false positive rate

---

**Previous:** [Chapter 1: Executive Summary](../chapter-1/README.md) | **Next:** [Chapter 3: Platform Architecture](../chapter-3/README.md)
