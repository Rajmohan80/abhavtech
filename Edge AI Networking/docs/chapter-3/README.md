# Chapter 3: Edge AI Platform Architecture

**Multi-Layer Architecture & AI Model Pipeline**

This chapter details the complete platform architecture for Abhavtech's Edge AI deployment, including the five-layer architecture design, AI model pipeline, data flow from sensor to action, and multi-site synchronization.

---

## Chapter Content

The platform architecture is delivered as a comprehensive single document covering:

### [Complete Platform Architecture](platform-architecture.md)

**Section 3.1: Multi-Layer Architecture**  
Five-layer design: Hardware Layer, Container Orchestration Layer, AI Processing Layer, Integration Layer, and Application Layer.

**Section 3.2: AI Model Pipeline**  
Model training, ONNX export, TensorRT optimization, container registry (Harbor), and automated deployment.

**Section 3.3: Data Flow (Sensor → AI → Action)**  
Complete data flow from camera/sensor input through GPU inference, multi-source validation, decision logic, and automated action execution.

**Section 3.4: Multi-Site Synchronization**  
Model synchronization between Mumbai and Chennai, configuration management, and centralized model registry.

**Section 3.5: High Availability & Failover**  
VRRP configuration, 2-node active-standby setup, <30 second failover RTO, and disaster recovery procedures.

---

## Platform Highlights

- **Compute:** Cisco UCS XE9305 chassis + UCS XE130c M8 compute nodes (Intel Xeon 6 SoC, 32 cores, 128GB RAM)
- **GPU:** NVIDIA L4 24GB (120 TOPS INT8, 20ms inference time, 72W TDP)
- **Orchestration:** Kubernetes 1.28+ with GPU device plugin
- **Container Registry:** Harbor (private registry for AI models)
- **Storage:** 2TB NVMe (7-day event buffer, 250GB/day retention)
- **Network:** 2× 10G LAG uplinks per node (20 Gbps, 5% utilization)

---

## Architecture Philosophy

**Distributed Intelligence + Centralized Wisdom:**

- **Edge:** Real-time AI inference (<500ms latency), 7-day local buffer, quick decisions
- **Centralized:** Model training, long-term storage (Splunk 90-day retention), complex correlation

---

**Previous:** [Chapter 2: Use Case Architecture](../chapter-2/README.md) | **Next:** [Chapter 4: Integration Architecture](../chapter-4/README.md)
