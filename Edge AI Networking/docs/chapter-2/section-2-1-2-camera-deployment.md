### 2.1.2 Camera Deployment Topology & Network Architecture

Physical security effectiveness depends on comprehensive camera coverage integrated with edge AI infrastructure and observability platforms. This section defines camera placement strategy, network topology, and complete integration architecture for Mumbai and Chennai hubs using **Cisco Unified Edge platform (UCS XE9305 chassis with XE130c M8 compute nodes)**.

---

# Camera Deployment & Network Architecture

#### Edge AI Infrastructure: Cisco Unified Edge Platform

**Platform Overview:**

Abhavtech deploys Cisco's purpose-built edge AI platform - **UCS XE9305 chassis with UCS XE130c M8 compute nodes** - for distributed AI inference at Mumbai and Chennai hub sites. This platform is specifically designed for edge/IDF room deployment with compact form factor, embedded networking, and GPU acceleration capabilities.

**Why Cisco Unified Edge vs. Datacenter Servers:**

| Factor | **UCS XE9305 + XE130c M8** (Deployed) | Traditional Datacenter Servers |
|--------|--------------------------------------|-------------------------------|
| **Form Factor** | 3RU short-depth (18") chassis | 1-2U full-depth (30-36") servers |
| **Deployment Location** | IDF room (co-located with Catalyst switches) | Separate datacenter server room |
| **Camera → AI Latency** | 4ms (same room, direct fiber) | 15-20ms (inter-building WAN/LAN) |
| **Power Consumption** | 700W total (chassis 100W + 2× 300W nodes) | 1,200-1,400W (2× rack servers) |
| **Acoustics** | 60dB (IDF-optimized fans) | 70-80dB (datacenter cooling) |
| **GPU Support** | NVIDIA L4 24GB (PCIe Gen5 slot, 72W) | NVIDIA L4 24GB (PCIe slot, 72W) |
| **Scalability** | 5 compute slots (2 used, 3 for Phase 5) | Limited (2 servers per rack) |
| **Management** | Cisco Intersight SaaS (embedded) | Cisco Intersight (separate integration) |
| **Edge AI Narrative** | ✅ Purpose-built Cisco edge AI platform | ❌ Generic datacenter gear at edge |

---

#### Mumbai Hub Edge AI Infrastructure (Detailed Specifications)

**Physical Installation:**

```
Location: IDF Room, Floor 3
  └── Network Equipment Rack (42U)
       ├── Position: Units 20-22 (mid-rack for cable management)
       ├── Equipment:
       │    ├── U1-U2: Catalyst 9500-40X Distribution Switch
       │    ├── U5-U8: Catalyst 9300-48U Access Switch #1
       │    ├── U10-U13: Catalyst 9300-48U Access Switch #2
       │    ├── U15-U18: Catalyst 9300-48U Access Switch #3
       │    ├── U20-U22: ⭐ UCS XE9305 Chassis (Edge AI) ⭐
       │    ├── U25-U28: Catalyst 9300-48U Access Switch #4
       │    └── U30-U33: Catalyst 9300-48U Access Switch #5
       └── Cable Management: Vertical cable managers on both sides
```

**UCS XE9305 Chassis Specifications:**

```
Cisco UCS XE9305 Unified Edge Chassis

Physical:
  ├── Form Factor: 3 RU (rack units), 18" short-depth
  ├── Weight: 40 lbs (2-person installation)
  ├── Mounting: Standard 19" rack mount (included rails)
  └── Environment: IDF/MDF optimized (0-40°C operating)

Compute Capacity:
  ├── Total Slots: 5 front-accessible hot-swappable slots
  ├── Used Slots (Phase 4): 2 of 5 (Slot 1: Primary, Slot 2: Standby)
  └── Available Slots (Phase 5): 3 slots (for 6 branch sites: 2 branches per node)

Embedded Networking:
  ├── Fabric: 2× Unified Edge Management Controllers
  ├── Switches: Embedded 25G Ethernet fabric (no external FI needed)
  ├── Uplinks: 2× 25G SFP28 per controller (to Catalyst 9500)
  └── Midplane: 25G connectivity to all compute node slots

Power & Cooling:
  ├── Power Supply: Dual redundant PSU (N+1, hot-swappable)
  ├── Total Power Budget: 2,000W (2× 1,000W PSU)
  ├── Actual Consumption: 700W (chassis 100W + 2× 300W nodes)
  ├── Cooling: 5× hot-swappable fan modules (N+1 redundancy)
  └── Acoustics: 60 dB (acoustically optimized for IDF, not datacenter)

Management:
  └── Cisco Intersight Infrastructure Service (SaaS)
       ├── Cloud-based unified management (no on-prem appliance)
       ├── Telemetry: Power, temperature, fan speed, GPU utilization
       ├── Firmware: Automated updates (scheduled maintenance windows)
       └── Zero-Touch Provisioning: Phase 5 node additions (no manual config)
```

**Slot 1 (Primary): UCS XE130c M8 Compute Node**

```
Hostname: edge-ai-mumbai-01
Management IP: 10.150.1.10 (VN_IOT management VLAN 150)
Data IP (VRRP VIP): 10.150.1.1 (shared with standby for HA)
SGT Assignment: SGT-95 (Edge AI Servers)

Processor:
  ├── CPU: Intel Xeon 6 SoC (6900 series)
  ├── Cores: 32 cores (P-cores, performance optimized)
  ├── Base Frequency: 2.6 GHz
  ├── Max Turbo: 4.0 GHz
  └── TDP: 185W (SoC includes integrated I/O, memory controllers)

Memory:
  ├── Capacity: 128GB DDR5-4800
  ├── Configuration: 4 channels × 32GB DIMMs (4× 32GB = 128GB)
  ├── ECC: Yes (Error-Correcting Code for reliability)
  └── Expansion: Up to 768GB maximum (8× 96GB DIMMs)

GPU Acceleration:
  ├── GPU: NVIDIA L4 (24GB GDDR6)
  ├── Installation: PCIe Gen5 slot (accelerator slot, NOT 75W GPU slot)
  ├── Power: 72W TDP (fits PCIe Gen5 300W power envelope)
  ├── Performance: 120 TOPS INT8 inference (optimized for YOLO v8)
  ├── Memory Bandwidth: 300 GB/s (sufficient for 120 cameras @ 30 FPS)
  └── Cooling: Dedicated GPU thermal design (chassis airflow optimized)

Storage:
  ├── Boot Storage: Dual M.2 SATA SSD 512GB (RAID 1 mirrored)
  │    ├── Purpose: Operating system (Ubuntu 24.04 LTS) + K8s containers
  │    └── Redundancy: RAID 1 (no single point of failure)
  ├── Data Storage: 2× E3.S NVMe SSD 1TB each (2TB total)
  │    ├── Purpose: 7-day event buffer (SQLite database + video snapshots)
  │    ├── Performance: PCIe Gen5 x4 (14 GB/s read, 12 GB/s write per SSD)
  │    └── Capacity Planning: 70GB/day × 7 days = 490GB used (1,510GB free)
  └── Expansion: Up to 4× E3.S NVMe (120TB total capacity if needed)

Networking:
  ├── Midplane (Chassis Fabric): 2× 25G Ethernet
  │    ├── Purpose: Management, Intersight telemetry, inter-node HA heartbeat
  │    └── Connectivity: To chassis embedded 25G switches
  ├── Front-Panel: 2× 10G SFP+ (RJ45 or fiber)
  │    ├── Purpose: Camera RTSP streams, observability API calls, uplinks
  │    ├── Configuration: Link Aggregation (LACP) = 20 Gbps aggregate
  │    └── Connectivity: Direct to Catalyst 9500 distribution switch (fiber)
  └── Total Bandwidth: 20 Gbps aggregate (camera traffic 900 Mbps = 4.5% utilization)

Power Consumption:
  ├── CPU: 185W TDP (32-core Xeon 6 SoC)
  ├── GPU: 72W (NVIDIA L4 under inference load)
  ├── Memory: 30W (128GB DDR5)
  ├── Storage: 20W (M.2 SSD + 2× NVMe)
  ├── Networking: 15W (2× 25G + 2× 10G NICs)
  ├── Other: 28W (PCIe, fans, misc)
  └── Total: 350W average (peak 400W during full GPU load)

Operating System & Software:
  ├── OS: Ubuntu 24.04 LTS (Linux kernel 6.8)
  ├── Container Runtime: Docker 26.0 (OCI-compliant)
  ├── Orchestration: K3s (lightweight Kubernetes for edge)
  ├── Container Registry: Harbor (running on NJ datacenter)
  ├── AI Inference: ONNX Runtime with TensorRT (GPU-accelerated)
  └── Monitoring: Prometheus + Grafana + Splunk forwarder

Role: Primary AI Inference
  ├── Workload: Process all 120 camera RTSP streams @ 30 FPS
  ├── AI Models: YOLO v8n (person detection), DeepSORT (tracking), custom PPE CNN
  ├── Inference Rate: 120 cameras × 30 FPS = 3,600 frames/second total
  ├── GPU Utilization Target: 70-80% (optimal balance: performance vs. headroom)
  └── HA Status: Active (VRRP VIP 10.150.1.1 assigned to this node)
```

**Slot 2 (Standby): UCS XE130c M8 Compute Node**

```
Hostname: edge-ai-mumbai-02
Management IP: 10.150.1.11 (VN_IOT management VLAN 150)
Data IP (VRRP VIP): 10.150.1.1 (shared with primary, standby takes over on failover)
SGT Assignment: SGT-95 (Edge AI Servers)

Hardware Configuration: Identical to Slot 1 (Primary)
  ├── CPU: Intel Xeon 6 SoC (32 cores)
  ├── RAM: 128GB DDR5
  ├── GPU: NVIDIA L4 24GB
  ├── Storage: Dual M.2 512GB RAID 1 + 2× E3.S NVMe 1TB
  └── Networking: 2× 25G midplane + 2× 10G front-panel

Role: Hot Standby
  ├── HA Mechanism: K8s cluster with VRRP (Virtual Router Redundancy Protocol)
  ├── Heartbeat: 5-second interval (over 25G midplane fabric)
  ├── Failover Trigger: Primary node unresponsive for 15 seconds (3 missed heartbeats)
  ├── RTO (Recovery Time Objective): <30 seconds
  │    ├── Failover Detection: 15 seconds (3× 5-second heartbeats)
  │    ├── VRRP VIP Migration: 5 seconds (IP address moves to standby)
  │    ├── Container Restart: 10 seconds (K8s reschedules pods on standby)
  │    └── Total: 30 seconds (cameras reconnect RTSP streams)
  ├── Data Synchronization: Real-time SQLite replication (5-second lag)
  │    └── SQLite database replicated via rsync every 5 seconds
  └── GPU Warm Standby: GPU initialized, models pre-loaded (no cold start delay)
```

**Slots 3-5: Reserved for Phase 5 Expansion**

```
Availability: 3 empty slots in XE9305 chassis

Phase 5 Expansion Plan (6 Branch Sites):
  ├── Slot 3: Branch Node #1 (Delhi + Bangalore)
  │    └── 2 branches × 40 cameras = 80 cameras total per node
  ├── Slot 4: Branch Node #2 (Hyderabad + Pune)
  │    └── 2 branches × 40 cameras = 80 cameras total per node
  └── Slot 5: Branch Node #3 (Kolkata + Ahmedabad)
       └── 2 branches × 40 cameras = 80 cameras total per node

Scalability Validation:
  ├── 1 XE130c M8 node capacity: 120 cameras @ 70-80% GPU (Phase 4 proven)
  ├── 1 XE130c M8 node capacity: 80 cameras @ 50-60% GPU (Phase 5 estimate)
  └── Total Phase 5: 3 nodes × 80 cameras = 240 branch cameras (in addition to 240 hub cameras)
```

---

#### Network Architecture: Complete Integration Topology

**Layer 1: Camera Layer (Data Acquisition)**

```
120 Cameras per Site (Mumbai Hub Example):

Camera Network Configuration:
  ├── VLAN Assignment: VN_IOT (VLAN 150)
  │    ├── Mumbai: 10.150.2.0/24 through 10.150.9.0/24 (8 subnets)
  │    └── IP Range: 10.150.2.1 - 10.150.9.254 (2,032 IPs available, 120 used)
  ├── SGT Assignment: SGT-70 (Cameras)
  │    └── Assigned via ISE: 802.1X authentication OR MAC address profiling
  ├── Default Gateway: 10.150.2.1 (Catalyst 9500 SVI for VLAN 150)
  ├── DNS: 10.182.1.100 (internal DNS for hostname resolution)
  └── NTP: 10.182.1.10 (time synchronization, critical for timestamp accuracy)

Camera Connectivity:
  ├── Physical: Cat6a Ethernet cable (PoE+ 802.3at)
  ├── Power: 25W average per camera (PoE+ from Catalyst 9300)
  ├── Speed: 1 Gbps Ethernet (auto-negotiated, cameras use 8 Mbps average)
  ├── Uplink Port: Catalyst 9300 access switch (1 of 48 ports per camera)
  └── Redundancy: No per-camera redundancy (edge AI HA provides resilience)

RTSP Stream Configuration:
  ├── Protocol: RTSP over TCP (port 554)
  ├── Video Codec: H.265 (HEVC) primary, H.264 fallback
  ├── Resolution: 1080p (1920×1080) for all camera types
  ├── Frame Rate: 30 FPS (frames per second)
  ├── Bitrate: 4-8 Mbps adaptive (average 6-8 Mbps depending on motion)
  ├── GOP (Group of Pictures): 60 frames (2-second I-frame interval)
  └── Audio: Disabled (no audio recording per privacy policy)

RTSP URL Format:
  rtsp://10.150.2.32:554/axis-media/media.amp
  └── Example: Camera 32 RTSP endpoint
```

**Layer 2: Access Network (Camera Aggregation)**

```
6× Catalyst 9300-48U Access Switches per Site

Switch Configuration (Per Switch):
  ├── Model: Cisco Catalyst 9300-48U (48-port PoE+)
  ├── Ports: 48× 1G RJ45 (PoE+ 802.3at, 30W per port)
  ├── PoE Budget: 1,100W total per switch
  ├── Uplinks: 4× 10G SFP+ (fiber to Catalyst 9500 distribution)
  ├── Stacking: Optional (not used, standalone switches for simplicity)
  └── Management: Cisco Catalyst Center (DNAC) for configuration/monitoring

Per-Switch Camera Load:
  ├── Cameras per Switch: 20 cameras (120 cameras ÷ 6 switches)
  ├── Bandwidth per Switch: 20 cameras × 8 Mbps = 160 Mbps average
  ├── PoE Load per Switch: 20 cameras × 25W = 500W (45% of 1,100W budget)
  └── Port Utilization: 20 of 48 ports used (42% utilization, 28 ports free)

VLAN Configuration:
  ├── VN_IOT (VLAN 150): Camera data plane (RTSP streams)
  ├── Management (VLAN 10): Switch management interface
  └── Trunk Port: 10G uplink to Catalyst 9500 (carries all VLANs)

SGACL Enforcement (Access Switch):
  ├── SGT-70 (Cameras) → SGT-95 (Edge AI): PERMIT TCP/UDP (RTSP streaming)
  ├── SGT-70 (Cameras) → SGT-10 (Corporate Users): DENY ALL (prevents lateral movement)
  ├── SGT-70 (Cameras) → SGT-61 (Servers): DENY ALL (except edge AI servers)
  └── Hardware Enforcement: TCAM-based (wire-speed, no performance impact)

QoS Configuration:
  ├── Class: AF31 (DSCP 26) for camera RTSP traffic
  ├── Priority: Medium (below voice, above best-effort data)
  ├── Bandwidth Reservation: 200 Mbps per switch (10% of 10G uplink)
  └── Buffer: 10% of switch buffer allocated to camera traffic
```

**Layer 3: Distribution Network (Core Aggregation)**

```
1× Catalyst 9500-40X Distribution Switch per Site

Switch Configuration:
  ├── Model: Cisco Catalyst 9500-40X
  ├── Ports: 40× 10G SFP+ (fiber)
  ├── Uplinks (Edge AI): 2× 10G SFP+ per XE130c M8 node (link aggregation)
  │    ├── Primary Node: Ports 1-2 (LAG, 20 Gbps aggregate)
  │    └── Standby Node: Ports 3-4 (LAG, 20 Gbps aggregate)
  ├── Uplinks (Access): 4× 10G SFP+ per Catalyst 9300 (6 switches × 4 ports = 24 ports)
  ├── Uplinks (WAN): 2× 10G SFP+ to core router (for centralized observability APIs)
  └── Remaining: 8 ports available for future expansion

Inter-VLAN Routing:
  ├── VN_IOT (VLAN 150): SVI 10.150.2.1/24 (camera default gateway)
  ├── Edge AI Management (VLAN 150): SVI 10.150.1.1/24 (edge AI management)
  ├── Corporate (VLAN 10): SVI 10.10.1.1/24 (user traffic, isolated from cameras)
  └── WAN Transit (VLAN 999): Point-to-point to core router (no local routing)

Routing Configuration:
  ├── OSPF Area 0: For internal routing (edge AI, cameras, corporate)
  ├── BGP AS 65000: For WAN routing to NJ datacenter (observability APIs)
  └── Default Route: 0.0.0.0/0 via core router (for internet, Splunk cloud, ThousandEyes)

SGACL Enforcement (Distribution Switch):
  ├── Same SGACL policies as access layer (SGT-70 → SGT-95 PERMIT)
  └── Additional SGACL: SGT-95 → SGT-50 (Observability) PERMIT (Splunk, TE, AppD)

Bandwidth Capacity:
  ├── Total Camera Traffic: 120 cameras × 8 Mbps = 960 Mbps
  ├── Uplink Capacity: 6 switches × 40 Gbps (4× 10G LAG) = 240 Gbps total
  ├── Utilization: 960 Mbps / 240 Gbps = 0.4% (ample headroom)
  └── Edge AI Uplinks: 2× 20 Gbps (primary + standby) = 40 Gbps aggregate
```

**Layer 4: Edge AI Compute (Inference & Decision)**

```
UCS XE9305 Chassis with 2× XE130c M8 Nodes

Network Connectivity (Per Node):
  ├── Midplane Fabric: 2× 25G Ethernet (to chassis embedded switches)
  │    ├── Purpose: Intersight management, HA heartbeat, telemetry
  │    └── Traffic: <100 Mbps (low bandwidth, management only)
  ├── Front-Panel: 2× 10G SFP+ (direct fiber to Catalyst 9500)
  │    ├── Configuration: Link Aggregation (LACP) = 20 Gbps aggregate
  │    ├── Purpose: Camera RTSP streams inbound, observability API calls outbound
  │    └── Traffic: 960 Mbps inbound (cameras) + 50 Mbps outbound (APIs) = 1,010 Mbps total

Data Flow (Inbound - Camera Streams):
  ├── Source: 120 cameras (10.150.2.x - 10.150.9.x)
  ├── Destination: Edge AI node VRRP VIP (10.150.1.1)
  ├── Protocol: RTSP over TCP (port 554)
  ├── Bandwidth: 120 cameras × 8 Mbps = 960 Mbps aggregate
  ├── Connection: Persistent TCP connections (1 connection per camera)
  └── Load Balancing: VRRP VIP (active node receives all traffic, standby ready)

Data Flow (Outbound - Observability APIs):
  ├── Destination 1: ISE pxGrid (10.30.0.1:8910, Mumbai datacenter)
  │    └── Bandwidth: ~5 Mbps (WebSocket events, low volume)
  ├── Destination 2: Splunk MLTK (10.182.1.50:8089, NJ datacenter via WAN)
  │    └── Bandwidth: ~15 Mbps (search queries + HEC event ingestion)
  ├── Destination 3: ThousandEyes (api.thousandeyes.com:443, SaaS)
  │    └── Bandwidth: ~10 Mbps (API queries, low volume)
  ├── Destination 4: AppDynamics (abhavtech.saas.appdynamics.com:443, SaaS)
  │    └── Bandwidth: ~10 Mbps (metrics queries, low volume)
  ├── Destination 5: BMS (bms.abhavtech.com:443, Mumbai datacenter)
  │    └── Bandwidth: ~1 Mbps (HVAC/lighting control API, very low volume)
  ├── Destination 6: FTD/XDR/ServiceNow/Webex (various, Mumbai/NJ/SaaS)
  │    └── Bandwidth: ~10 Mbps (security actions, incident creation)
  └── Total Outbound: ~50 Mbps aggregate

IP Addressing:
  ├── Primary Node (Slot 1): 10.150.1.10 (management IP)
  ├── Standby Node (Slot 2): 10.150.1.11 (management IP)
  ├── VRRP VIP: 10.150.1.1 (shared virtual IP, active on primary)
  ├── Subnet: 10.150.1.0/24 (254 IPs available)
  └── Default Gateway: 10.150.1.254 (Catalyst 9500 SVI)

DNS Resolution:
  ├── Internal: 10.182.1.100 (for internal hostnames: ftd-mumbai, bms)
  ├── External: 8.8.8.8 (Google DNS for SaaS services: ThousandEyes, AppD, Webex)
  └── Split-Horizon DNS: Internal zones (.abhavtech.com) resolve to internal IPs

NTP Synchronization:
  ├── Primary NTP: 10.182.1.10 (NJ datacenter Stratum 2)
  ├── Secondary NTP: time.google.com (internet Stratum 1, fallback)
  └── Importance: Millisecond-precision timestamps for observability correlation
```

**Layer 5: Observability Integration (Centralized Platforms)**

```
Integration Endpoints (Edge AI → Centralized Platforms):

ISE pxGrid (Mumbai Datacenter):
  ├── Endpoint: https://10.30.0.1:8910/pxgrid/ise/session
  ├── Protocol: WebSocket (persistent connection)
  ├── Authentication: TLS mutual certificate + basic auth
  ├── Purpose: Badge swipe event correlation (authorized vs. unauthorized)
  ├── Latency: ~50ms (Mumbai LAN, same datacenter)
  └── Bandwidth: ~5 Mbps (event stream, low volume)

Splunk MLTK (NJ Datacenter):
  ├── Endpoint: https://10.182.1.50:8089/services/search/jobs
  ├── Protocol: HTTPS REST API
  ├── Authentication: Bearer token (service account)
  ├── Purpose: Historical pattern validation, anomaly detection
  ├── Latency: ~100ms (Mumbai → NJ WAN, 200ms RTT)
  ├── Bandwidth: ~15 Mbps (search queries + HEC event ingestion)
  └── WAN Path: Mumbai → MPLS → NJ (10 Gbps MPLS circuit, 0.1% utilization)

ThousandEyes (SaaS - Cloud):
  ├── Endpoint: https://api.thousandeyes.com/v6/tests/{testId}/results
  ├── Protocol: HTTPS REST API
  ├── Authentication: OAuth 2.0 Bearer token
  ├── Purpose: Network path health validation (camera → edge AI)
  ├── Latency: ~80ms (Mumbai → ThousandEyes cloud Singapore region)
  ├── Bandwidth: ~10 Mbps (API queries, low volume)
  └── Internet Path: Mumbai → ISP → ThousandEyes cloud (1 Gbps internet circuit)

AppDynamics (SaaS - Cloud):
  ├── Endpoint: https://abhavtech.saas.appdynamics.com/controller/rest/applications/10/metric-data
  ├── Protocol: HTTPS REST API
  ├── Authentication: API token (X-API-Key header)
  ├── Purpose: Application health validation (RTSP service, BMS API)
  ├── Latency: ~90ms (Mumbai → AppDynamics cloud US East region)
  ├── Bandwidth: ~10 Mbps (metrics queries, low volume)
  └── Internet Path: Mumbai → ISP → AppDynamics cloud (1 Gbps internet circuit)

BMS Honeywell EBI (Mumbai Datacenter):
  ├── Endpoint: https://bms.abhavtech.com/api/v2/zones/{zone_id}/control
  ├── Protocol: HTTPS REST API
  ├── Authentication: OAuth 2.0 (client credentials flow)
  ├── Purpose: HVAC/lighting control (WF-009 workflow)
  ├── Latency: ~500ms (BMS API response time per vendor spec)
  ├── Bandwidth: ~1 Mbps (control commands, very low volume)
  └── Network Path: Mumbai LAN (same building as edge AI)

FTD Firewall (Mumbai Datacenter):
  ├── Endpoint: https://ftd-mumbai.abhavtech.com/api/fmc_config/v1/domain/default/policy/accessrules
  ├── Protocol: HTTPS REST API
  ├── Authentication: Bearer token (service account)
  ├── Purpose: Automated network blocking (perimeter intrusion)
  ├── Latency: ~50ms (FTD API response)
  ├── Bandwidth: ~2 Mbps (rule creation commands, low volume)
  └── Network Path: Mumbai LAN (same datacenter)

XDR SecureX (SaaS - Cloud):
  ├── Endpoint: https://securex.cisco.com/iroh/iroh-response/respond/trigger
  ├── Protocol: HTTPS REST API
  ├── Authentication: Bearer token (service account)
  ├── Purpose: Security incident correlation
  ├── Latency: ~40ms (SecureX cloud response)
  ├── Bandwidth: ~2 Mbps (incident creation, low volume)
  └── Internet Path: Mumbai → ISP → Cisco SecureX cloud

ServiceNow (SaaS - Cloud):
  ├── Endpoint: https://abhavtech.service-now.com/api/now/table/incident
  ├── Protocol: HTTPS REST API
  ├── Authentication: Basic auth (base64 encoded)
  ├── Purpose: Incident ticketing (security, comfort complaints)
  ├── Latency: ~60ms (ServiceNow API response)
  ├── Bandwidth: ~3 Mbps (ticket creation + attachments, low volume)
  └── Internet Path: Mumbai → ISP → ServiceNow cloud

Webex Teams (SaaS - Cloud):
  ├── Endpoint: https://webexapis.com/v1/messages
  ├── Protocol: HTTPS REST API
  ├── Authentication: Bearer token (bot account)
  ├── Purpose: Supervisor mobile alerts (security, comfort)
  ├── Latency: ~80ms (Webex API response)
  ├── Bandwidth: ~2 Mbps (message sending, low volume)
  └── Internet Path: Mumbai → ISP → Webex cloud
```

---

#### Complete Network Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     ABHAVTECH MUMBAI HUB - EDGE AI NETWORK              │
│                     (Chennai Hub: Identical Architecture)               │
└─────────────────────────────────────────────────────────────────────────┘

LAYER 1: CAMERA LAYER (120 Cameras)
┌──────────────────────────────────────────────────────────────────┐
│  Indoor: 60× Axis P3715-PLVE (360° fixed, 6 Mbps avg)          │
│  Outdoor: 40× Axis Q6215-LE (PTZ, 8 Mbps avg)                  │
│  LPR: 20× Axis P1455-LE (4K, 10 Mbps avg)                      │
│  Thermal: 10× FLIR A310f (320×240, 2 Mbps avg)                 │
│  ────────────────────────────────────────────────────────────   │
│  VLAN: VN_IOT (150), SGT: SGT-70 (Cameras)                     │
│  IPs: 10.150.2.1 - 10.150.9.254                                │
│  Total Bandwidth: 120 cameras × 8 Mbps = 960 Mbps              │
└──────────────────────────────────────────────────────────────────┘
         ↓ ↓ ↓  1 Gbps Ethernet (PoE+ 802.3at, 25W per camera)
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 2: ACCESS LAYER (6× Catalyst 9300-48U Switches)          │
│                                                                  │
│  Switch 1-6 (Each):                                             │
│  ├─ 48× 1G RJ45 ports (PoE+, 1,100W budget)                    │
│  ├─ 20 cameras per switch (500W PoE, 160 Mbps bandwidth)       │
│  ├─ 4× 10G SFP+ uplinks (fiber to Catalyst 9500)               │
│  └─ SGACL: SGT-70 → SGT-95 PERMIT, SGT-70 → SGT-10 DENY       │
│                                                                  │
│  Total Uplink: 6 switches × 4× 10G = 240 Gbps aggregate        │
│  Utilization: 960 Mbps / 240 Gbps = 0.4%                       │
└──────────────────────────────────────────────────────────────────┘
         ↓ ↓ ↓  4× 10 Gbps Fiber per switch (40 Gbps per switch)
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 3: DISTRIBUTION LAYER (1× Catalyst 9500-40X)             │
│                                                                  │
│  Cisco Catalyst 9500-40X Distribution Switch                    │
│  ├─ 40× 10G SFP+ ports                                          │
│  ├─ Inter-VLAN Routing: VN_IOT (150), Management (10)          │
│  ├─ Routing: OSPF Area 0 (internal), BGP AS 65000 (WAN)        │
│  ├─ Uplinks to Edge AI:                                         │
│  │   ├─ Primary Node: 2× 10G LAG (Ports 1-2) = 20 Gbps         │
│  │   └─ Standby Node: 2× 10G LAG (Ports 3-4) = 20 Gbps         │
│  └─ Uplinks to WAN: 2× 10G (Ports 37-38) to Core Router        │
│                                                                  │
│  Total Capacity: 40× 10G = 400 Gbps                             │
│  Camera Traffic: 960 Mbps = 0.24% utilization                   │
└──────────────────────────────────────────────────────────────────┘
         ↓ ↓  2× 10 Gbps Fiber (Link Aggregation = 20 Gbps)
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 4: EDGE AI COMPUTE (UCS XE9305 + XE130c M8 Nodes)        │
│                                                                  │
│  Cisco UCS XE9305 Chassis (IDF Room, Floor 3, 3RU)             │
│  ├─ Form Factor: 3RU short-depth (18"), 40 lbs                 │
│  ├─ Power: Dual PSU 1,000W (N+1), 700W actual consumption      │
│  ├─ Fabric: Embedded 25G switches (2× controllers)             │
│  ├─ Cooling: 5× hot-swap fans (60dB, IDF-optimized)            │
│  └─ Management: Cisco Intersight SaaS                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Slot 1 (Primary): UCS XE130c M8 Compute Node           │    │
│  │ ──────────────────────────────────────────────────────  │    │
│  │ Hostname: edge-ai-mumbai-01                             │    │
│  │ IP: 10.150.1.10 (mgmt), 10.150.1.1 (VRRP VIP, active) │    │
│  │ SGT: SGT-95 (Edge AI Servers)                          │    │
│  │                                                          │    │
│  │ Hardware:                                                │    │
│  │ ├─ CPU: Intel Xeon 6 SoC (32 cores, 2.6 GHz)           │    │
│  │ ├─ RAM: 128GB DDR5-4800                                 │    │
│  │ ├─ GPU: NVIDIA L4 24GB (PCIe Gen5, 72W, 120 TOPS)      │    │
│  │ ├─ Storage: 512GB M.2 RAID1 + 2TB NVMe (E3.S)          │    │
│  │ └─ Network: 2× 25G midplane + 2× 10G front (LAG)       │    │
│  │                                                          │    │
│  │ AI Workload:                                             │    │
│  │ ├─ YOLO v8 Inference: 120 cameras @ 30 FPS (3,600 fps) │    │
│  │ ├─ GPU Utilization: 75% (target 70-80%)                │    │
│  │ ├─ Latency: 20ms inference + 4ms network = 24ms total  │    │
│  │ └─ Event Buffer: 7 days (490GB used / 2TB capacity)    │    │
│  │                                                          │    │
│  │ Inbound Traffic: 960 Mbps (camera RTSP streams)        │    │
│  │ Outbound Traffic: 50 Mbps (observability API calls)    │    │
│  │ Power: 350W average (CPU 185W + GPU 72W + other 93W)   │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Slot 2 (Standby): UCS XE130c M8 Compute Node           │    │
│  │ ──────────────────────────────────────────────────────  │    │
│  │ Hostname: edge-ai-mumbai-02                             │    │
│  │ IP: 10.150.1.11 (mgmt), 10.150.1.1 (VRRP VIP, standby)│    │
│  │ Hardware: Identical to Slot 1                           │    │
│  │ Role: Hot Standby (5-sec heartbeat, RTO <30 sec)       │    │
│  │ Power: 350W average (GPU warm, models pre-loaded)      │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  Slots 3-5: Empty (reserved for Phase 5 branch expansion)      │
└──────────────────────────────────────────────────────────────────┘
         ↓  Outbound: 50 Mbps (observability API calls)
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 5: OBSERVABILITY INTEGRATION                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ MUMBAI DATACENTER (LAN, <50ms latency)              │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │ ✓ ISE pxGrid (10.30.0.1:8910)                        │       │
│  │   └─ Badge swipe correlation (~5 Mbps)               │       │
│  │ ✓ FTD Firewall (ftd-mumbai.abhavtech.com)           │       │
│  │   └─ Automated blocking (~2 Mbps)                    │       │
│  │ ✓ BMS Honeywell (bms.abhavtech.com)                 │       │
│  │   └─ HVAC/lighting control (~1 Mbps)                 │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ NJ DATACENTER (WAN, ~100ms latency, 10 Gbps MPLS)   │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │ ✓ Splunk MLTK (10.182.1.50:8089)                     │       │
│  │   └─ Historical pattern validation (~15 Mbps)        │       │
│  └──────────────────────────────────────────────────────┘       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │ SAAS CLOUD (Internet, ~80ms latency, 1 Gbps)        │       │
│  ├──────────────────────────────────────────────────────┤       │
│  │ ✓ ThousandEyes (api.thousandeyes.com)               │       │
│  │   └─ Network path health (~10 Mbps)                  │       │
│  │ ✓ AppDynamics (abhavtech.saas.appdynamics.com)      │       │
│  │   └─ Application health (~10 Mbps)                   │       │
│  │ ✓ XDR SecureX (securex.cisco.com)                    │       │
│  │   └─ Security incident (~2 Mbps)                     │       │
│  │ ✓ ServiceNow (abhavtech.service-now.com)            │       │
│  │   └─ Incident ticketing (~3 Mbps)                    │       │
│  │ ✓ Webex Teams (webexapis.com)                        │       │
│  │   └─ Supervisor alerts (~2 Mbps)                     │       │
│  └──────────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────────────┘

TOTAL BANDWIDTH UTILIZATION:
  ├─ Inbound (Cameras → Edge AI): 960 Mbps
  ├─ Outbound (Edge AI → Observability): 50 Mbps
  ├─ Total: 1,010 Mbps (of 20 Gbps available = 5% utilization)
  └─ Headroom: 95% capacity available for Phase 5 expansion

TOTAL POWER CONSUMPTION (Per Site):
  ├─ Cameras: 120 cameras × 25W = 3,000W (PoE from Catalyst 9300)
  ├─ Access Switches: 6× 200W = 1,200W
  ├─ Distribution Switch: 400W
  ├─ Edge AI Chassis: 700W (chassis 100W + 2× 300W nodes)
  ├─ Total: 5,300W per site (Mumbai + Chennai = 10,600W total)
  └─ Cost: ~$1,200/month electricity (at $0.15/kWh, 24×7 operation)
```

---

#### Mumbai Hub Camera Deployment (Floor-by-Floor)

**Building Specifications:**
- Total Floor Area: 185,000 sq ft (17,200 sq m)
- Building Footprint: 60m × 45m (2,700 sq m per floor)
- Floors: Ground + 7 floors above (8 floors total)
- Employees: 850+ during business hours, 50+ during night shift (24/7 NOC/SOC)

**Floor-by-Floor Camera Distribution:**

| Floor | Zone | Camera Type | Qty | Coverage Purpose | Camera IDs | Network |
|-------|------|-------------|-----|------------------|-----------|---------|
| **Ground** | Main Entrance Lobby | Indoor Fixed (P3715) | 8 | Visitor entry, reception, turnstiles | cam-1 to cam-8 | 10.150.2.1-8 |
| **Ground** | Loading Dock Interior | Indoor Fixed (P3715) | 6 | Delivery verification, PPE zone | cam-9 to cam-14 | 10.150.2.9-14 |
| **Ground** | Cafeteria | Indoor Fixed (P3715) | 8 | Crowd density, occupancy | cam-15 to cam-22 | 10.150.2.15-22 |
| **Ground** | Server Room Entrance | Indoor Fixed (P3715) | 2 | Access control (ISE + CyberArk) | cam-23, cam-24 | 10.150.2.23-24 |
| **Ground** | Emergency Exit (N/S) | Indoor Fixed (P3715) | 2 | Evacuation, crowd density | cam-25, cam-26 | 10.150.2.25-26 |
| **Floors 1-7** | Hallways (2 per floor) | Indoor Fixed (P3715) | 14 | General surveillance, loitering | cam-27 to cam-40 | 10.150.3.1-14 |
| **Floors 1-7** | Conference Rooms (3/floor) | Indoor Fixed (P3715) | 21 | Occupancy (BMS UC2), utilization | cam-41 to cam-61 | 10.150.4.1-21 |
| **Floor 7** | Executive Floor Hallway | Indoor Fixed (P3715) | 4 | Loitering, access control (SGT-11) | cam-62 to cam-65 | 10.150.4.22-25 |
| **Outdoor** | Perimeter North | Outdoor PTZ (Q6215) | 12 | Perimeter intrusion, 360° pan | cam-66 to cam-77 | 10.150.5.1-12 |
| **Outdoor** | Perimeter East | Outdoor PTZ (Q6215) | 10 | Perimeter intrusion, loading dock | cam-78 to cam-87 | 10.150.5.13-22 |
| **Outdoor** | Perimeter South | Outdoor PTZ (Q6215) | 10 | Perimeter intrusion, parking | cam-88 to cam-97 | 10.150.5.23-32 |
| **Outdoor** | Perimeter West | Outdoor PTZ (Q6215) | 8 | Perimeter intrusion, service entrance | cam-98 to cam-105 | 10.150.6.1-8 |
| **Outdoor** | Main Gate Entry/Exit | 4K LPR (P1455) | 4 | License plate recognition | cam-106 to cam-109 | 10.150.7.1-4 |
| **Outdoor** | Parking Lot (Multi-Level) | 4K LPR (P1455) | 8 | License plate, occupancy tracking | cam-110 to cam-117 | 10.150.7.5-12 |
| **Outdoor** | Loading Dock Gate | 4K LPR (P1455) | 6 | License plate, delivery vehicle | cam-118 to cam-123 | 10.150.7.13-18 |
| **Outdoor** | VIP/Executive Entrance | 4K LPR (P1455) | 2 | License plate, executive access | cam-124, cam-125 | 10.150.7.19-20 |
| **Ground** | Server Room Interior | Thermal (FLIR A310f) | 2 | Fire/smoke, equipment overheat | cam-126, cam-127 | 10.150.8.1-2 |
| **Ground** | Electrical Room | Thermal (FLIR A310f) | 2 | Fire/smoke, electrical fire | cam-128, cam-129 | 10.150.8.3-4 |
| **Outdoor** | Loading Dock Exterior | Thermal (FLIR A310f) | 6 | Fire/smoke, dumpster fire | cam-130 to cam-135 | 10.150.8.5-10 |
| **TOTAL** | All Zones | All Types | **135** | Complete coverage | cam-1 to cam-135 | 10.150.2-9.x |

**Note:** Total 135 cameras deployed (vs. 120 in original spec) - updated for complete building coverage after site survey validation.

---

#### Chennai Hub Camera Deployment

**Building Specifications:**
- Total Floor Area: 155,000 sq ft (14,400 sq m)
- Building Footprint: 55m × 42m (2,310 sq m per floor)
- Floors: Ground + 6 floors above (7 floors total)
- Employees: 650+ during business hours, 40+ during night shift (24/7 NOC/SOC)

**Camera Distribution:**

Chennai hub follows identical camera type distribution as Mumbai for deployment consistency:
- 65 Indoor Fixed (Axis P3715-PLVE)
- 40 Outdoor PTZ (Axis Q6215-LE)
- 20 4K LPR (Axis P1455-LE)
- 10 Thermal (FLIR A310f)
- **Total: 135 cameras** (same as Mumbai for validation consistency)

Floor distribution adjusted for 7 floors (vs. Mumbai 8 floors):
- Ground Floor: 30 cameras (same as Mumbai: lobby, cafeteria, loading dock, server room)
- Floors 1-6: 35 cameras (slightly denser per-floor coverage: 35 cameras ÷ 6 floors ≈ 6 per floor)
- Outdoor Perimeter: 40 cameras (smaller building compensated by closer camera spacing)
- Outdoor LPR: 20 cameras (identical vehicle entry/exit points)
- Thermal: 10 cameras (server room, electrical room, loading dock)

---

#### Camera Specifications - Complete Technical Details

**Camera Type 1: Indoor Fixed (Axis P3715-PLVE) - 65 cameras per site**

| Specification | Value | Use Case Impact |
|--------------|-------|----------------|
| **Resolution** | 4× 1080p sensors (7680×1080 panoramic) | 360° coverage eliminates blind spots, single camera replaces 4× traditional |
| **Frame Rate** | 30 FPS per sensor (30 FPS effective) | Real-time inference, no motion blur at walking speed (~1.4 m/s) |
| **Video Codec** | H.265/H.264 adaptive bitrate | H.265 saves 40% bandwidth (4-6 Mbps vs. 6-8 Mbps H.264) |
| **Bandwidth** | 4-8 Mbps adaptive (avg 6 Mbps) | Lower 4 Mbps (low motion), upper 8 Mbps (high motion: cafeteria lunch) |
| **PoE** | 802.3at (PoE+), 25W typical | Requires PoE+ capable switch (Catalyst 9300: 1,100W supports 44 cameras @ 25W) |
| **IR Illumination** | 10m range (850nm) | Night vision after-hours (22:00-06:00 ambient light insufficient) |
| **IP Rating** | Indoor only (no IP rating) | Ceiling mount climate-controlled environment |
| **Mounting** | Ceiling 2.8-4.0m height | Downward-facing 360° eliminates blind spots |
| **FOV** | 360° horizontal, 90° vertical | Complete room coverage, no pan/tilt (maintenance-free) |
| **Detection Range** | 10m radius (person 95% confidence) | YOLO v8 accurate within 10m, beyond 10m confidence <90% |
| **RTSP URL** | rtsp://10.150.2.X:554/axis-media/media.amp | Standard Axis RTSP endpoint |
| **Network Config** | VLAN 150 (VN_IOT), SGT-70 (Cameras) | ISE profiling via 802.1X or MAC address |

**Camera Type 2: Outdoor PTZ (Axis Q6215-LE) - 40 cameras per site**

| Specification | Value | Use Case Impact |
|--------------|-------|----------------|
| **Resolution** | 1080p (1920×1080) | Sufficient for person/vehicle detection, prioritizes FPS/PTZ speed over 4K |
| **Frame Rate** | 30 FPS | Real-time tracking (DeepSORT loitering requires 30 FPS smooth trajectories) |
| **Video Codec** | H.265/H.264 adaptive | H.265 critical for outdoor (high motion: wind, trees, vehicles) |
| **Bandwidth** | 6-10 Mbps adaptive (avg 8 Mbps) | Higher than indoor due to outdoor motion (swaying trees, vehicles) |
| **PoE** | 802.3at (PoE+), 30W (PTZ motors) | Requires PoE+ for pan/tilt motors |
| **IR Illumination** | 200m range (850nm) | Long-range night vision perimeter surveillance after-hours |
| **IP Rating** | IP66 (weatherproof: dust-tight, water jet) | Pole mount withstands Mumbai monsoon (2,000mm annual rainfall) |
| **Mounting** | Pole 6.0m height | Elevated view reduces obstructions (trees, vehicles), prevents vandalism |
| **Pan/Tilt/Zoom** | 360° continuous pan, +20° to -90° tilt, 32× optical zoom | PTZ enables operator zoom for incident investigation, 32× reads plates @ 50m |
| **Detection Range** | 50m person, 100m vehicle, 200m IR | YOLO v8 accurate up to 50m with zoom, beyond 50m confidence drops |
| **PTZ Presets** | 256 preset positions | Automated patrol: cycles through 8 presets every 60 sec (covers 8× larger area) |
| **RTSP URL** | rtsp://10.150.5.X:554/axis-media/media.amp | Standard Axis RTSP endpoint |
| **Network Config** | VLAN 150 (VN_IOT), SGT-70 (Cameras) | ISE profiling via 802.1X or MAC address |

**Camera Type 3: 4K LPR (Axis P1455-LE) - 20 cameras per site**

| Specification | Value | Use Case Impact |
|--------------|-------|----------------|
| **Resolution** | 4K (3840×2160) | High resolution necessary for OCR at 10-15m (plate characters 5-8cm height) |
| **Frame Rate** | 30 FPS | Real-time vehicle tracking, captures plate at multiple angles as vehicle approaches |
| **Video Codec** | H.265/H.264 adaptive | H.265 critical for 4K bandwidth management (10 Mbps vs. 15 Mbps H.264) |
| **Bandwidth** | 8-12 Mbps adaptive (avg 10 Mbps) | Higher than 1080p due to 4× pixel count (3840×2160 vs. 1920×1080) |
| **PoE** | 802.3at (PoE+), 30W (4K processing) | Requires PoE+ for higher-resolution image processing |
| **IR Illumination** | 940nm covert IR (no visible glow) | Plate capture at night without alerting driver (visible red glow distracts) |
| **IP Rating** | IP66 (weatherproof) | Gantry mount over vehicle lanes withstands rain/dust |
| **Mounting** | Gantry 4.0m height, 0° angle | Optimal plate visibility: 0° eliminates perspective distortion (skewed plates reduce OCR) |
| **FOV** | 60° horizontal (single lane, 3.5m wide) | Narrow FOV ensures plate occupies maximum pixels (higher OCR accuracy) |
| **Detection Range** | Optimal 3-15m distance | Too close (<3m): motion blur. Too far (>15m): plate <50 pixels height |
| **LPR Software** | Built-in AXIS License Plate Verifier | Pre-processes plate (contrast, perspective correction) before edge AI OCR |
| **RTSP URL** | rtsp://10.150.7.X:554/axis-media/media.amp | Standard Axis RTSP endpoint |
| **Network Config** | VLAN 150 (VN_IOT), SGT-70 (Cameras) | ISE profiling via 802.1X or MAC address |

**Camera Type 4: Thermal (FLIR A310f) - 10 cameras per site**

| Specification | Value | Use Case Impact |
|--------------|-------|----------------|
| **Resolution** | 320×240 thermal pixels (76,800 pixels) | Lower than visible cameras but sufficient for temperature anomaly detection |
| **Frame Rate** | 9 FPS (thermal sensor limitation) | Adequate for fire detection (temperature changes slowly, 9 FPS sufficient >60°C) |
| **Video Codec** | H.264 (thermal as grayscale video) | Bandwidth-efficient (thermal low entropy compresses well: ~2 Mbps avg) |
| **Bandwidth** | 1-3 Mbps (avg 2 Mbps) | Lower than visible cameras due to low resolution/FPS |
| **PoE** | 802.3af (standard PoE), 15W | Does NOT require PoE+, can use older switches with 802.3af only |
| **IR Illumination** | Not applicable (thermal detects emitted IR) | Thermal works in complete darkness (0 lux), unaffected by lighting |
| **IP Rating** | IP66 (weatherproof) | Outdoor pole mount loading dock fire detection |
| **Mounting** | Fixed (no PTZ), 3.0m indoor, 6.0m outdoor | Fixed FOV sufficient (thermal detects temperature in wide area) |
| **FOV** | 25° × 19° (narrow for long-range) | Narrow FOV enables 50m distance temperature monitoring (server room equipment) |
| **Temperature Range** | -20°C to +350°C (±2°C accuracy) | Covers ambient (-20°C winter) to fire (>60°C) to electrical fire (+350°C peak) |
| **Temperature Accuracy** | ±2°C or ±2% (whichever greater) | Example: 70°C reading accurate within 68-72°C (sufficient for >60°C fire threshold) |
| **Thermal Sensitivity** | <50 mK NETD (Noise Equivalent Temp Diff) | Can detect 0.05°C difference (detects human body heat @ 20m) |
| **RTSP URL** | rtsp://10.150.8.X:554/thermal/media.amp | Custom FLIR RTSP endpoint |
| **Network Config** | VLAN 150 (VN_IOT), SGT-70 (Cameras) | ISE profiling via MAC address (no 802.1X support) |

---

#### Network Capacity Validation

**Mumbai Hub (135 Cameras - Updated):**

| Camera Type | Quantity | Bandwidth/Camera | Total Bandwidth |
|-------------|----------|-----------------|----------------|
| Indoor Fixed | 65 | 6 Mbps avg | 390 Mbps |
| Outdoor PTZ | 40 | 8 Mbps avg | 320 Mbps |
| 4K LPR | 20 | 10 Mbps avg | 200 Mbps |
| Thermal | 10 | 2 Mbps avg | 20 Mbps |
| **TOTAL** | **135** | | **930 Mbps** |

**Switch Capacity Analysis:**

6× Catalyst 9300-48U Access Switches:
- Cameras per switch: 135 cameras ÷ 6 switches = 22.5 cameras per switch (round to 23)
- Bandwidth per switch: 930 Mbps ÷ 6 switches = 155 Mbps per switch
- Switch capacity: 48 ports × 1 Gbps = 48 Gbps per switch
- **Utilization: 155 Mbps / 48 Gbps = 0.32%** ✅ Minimal utilization

1× Catalyst 9500-40X Distribution Switch:
- Aggregate camera bandwidth: 930 Mbps (from 6 access switches)
- Edge AI uplinks: 2× 20 Gbps (primary + standby) = 40 Gbps aggregate
- **Utilization: 930 Mbps / 400 Gbps = 0.23%** ✅ Minimal utilization

**PoE Capacity Validation:**

Catalyst 9300-48U PoE Budget: 1,100W per switch

| Camera Type | Qty/Switch | PoE/Camera | Total PoE/Switch |
|-------------|-----------|-----------|-----------------|
| Indoor Fixed | 11 cameras | 25W | 275W |
| Outdoor PTZ | 7 cameras | 30W | 210W |
| 4K LPR | 3 cameras | 30W | 90W |
| Thermal | 2 cameras | 15W | 30W |
| **TOTAL** | **23 cameras** | | **605W** |

**PoE Utilization: 605W / 1,100W = 55%** ✅ Comfortable margin (1,100W supports up to 44 cameras @ 25W)

---

*Next: Section 2.1.1 REVISED (Security Functions with XE130c M8 hardware) + Section 2.1.3 REVISED (Observability Integration with complete API architecture)*