# Hardware Specifications

This document summarizes all hardware updates made to Chapter 2 (Use Case Architecture) to reflect the correct **Cisco Unified Edge platform (UCS XE9305 chassis with UCS XE130c M8 compute nodes)** 

---


### Hardware - Cisco Unified Edge
- **Hardware:** UCS XE130c M8 Compute Nodes in UCS XE9305 Chassis
- **GPU:** NVIDIA L4 24GB (edge AI GPU, 120 TOPS INT8)
- **Location:** IDF Room, Floor 3 (co-located with Catalyst switches)
- **Network Latency:** 4ms (camera → edge AI, same IDF room)
- **Power Consumption:** 350W per node (700W total for 2 nodes)
- **Form Factor:** 3 RU short-depth (18") chassis, IDF-optimized
- **Deployment:** Purpose-built edge AI platform

---

## Key Corrections Summary

### **Hardware Platform:**
- ✅ UCS XE130c M8 in UCS XE9305 chassis (everywhere)
- ✅ NVIDIA L4 24GB GPU (120 TOPS INT8, 72W TDP)
- ✅ Intel Xeon (generic) → Intel Xeon 6 SoC (specific model)

### **Deployment Location:**
- ✅ "Datacenter server room" → "IDF Room, Floor 3"
- ✅ "Separate building" → "Co-located with Catalyst switches"
- ✅ "Rack-mounted servers" → "Short-depth chassis (18 inches)"

### **Network Architecture:**
- ✅ 15-20ms latency → 4ms latency (camera to edge AI)
- ✅ Added explicit node naming: edge-ai-mumbai-01 (Slot 1, Primary)
- ✅ Updated network path: includes UCS XE130c M8 explicitly
- ✅ Added VRRP VIP: 10.150.1.1 (shared primary/standby)

### **Power & Form Factor:**
- ✅ 1,400W per server → 350W per node (700W total for 2 nodes)
- ✅ 2U full-depth → 3RU short-depth (18 inches)
- ✅ Datacenter acoustics → IDF-optimized (60dB vs. 70-80dB)

### **Scalability & Cost:**
- ✅ Limited scalability → 5 compute slots (2 used, 3 for Phase 5)
- ✅ Generic servers → Purpose-built Cisco edge AI platform

---
