# Firewall Design for SD-Access Deployment

<span class="ai-badge">AI-Assisted Documentation</span>

---

**EXECUTIVE SUMMARY**

This document covers firewall architecture, placement, capacity planning, security zones, 
and integration with Cisco SD-Access fabric for Abhavtech's India region deployment.

**DESIGN PHILOSOPHY**

1. Firewalls operate OUTSIDE the fabric (traditional security model)
2. Border nodes hand off traffic to firewalls for inspection
3. Firewalls perform: stateful inspection, NAT, IPS, URL filtering, malware protection
4. SGT tags passed to firewall via SXP for policy enforcement
5. Firewalls in HA pairs at each site for redundancy

## SECTION 1: FIREWALL PLACEMENT ARCHITECTURE

### 1.1 MUMBAI HUB FIREWALL TOPOLOGY

```text
                    Internet (ISP)
                         │
                    DIA Circuit (1 Gbps)
                         │
                    ┌────┴─────┐
                    │ ISP Router│
                    └────┬─────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
  ┌─────┴─────┐    ┌─────┴─────┐   ┌─────┴─────┐
  │  FW-DIA-1 │════│  FW-DIA-2 │   │  FW-MPLS  │
  │  FTD 4150 │ HA │  FTD 4150 │   │  FTD 4150 │
  └─────┬─────┘    └─────┬─────┘   └─────┬─────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                    ┌────┴─────┐
                    │ Border-1 │────────┐
                    │ Border-2 │        │
                    │ (SVL Pair)        │
                    └────┬──────┘       │
                         │              │
                    SD-ACCESS FABRIC    │
                         │              │
                    [CP Nodes]          │
                         │              │
                    [Edge Nodes]   Data Center
                                   (Separate FW)
```

**Placement Rationale:**

✓ Firewalls positioned BEFORE Border nodes (north-south traffic)
✓ All Internet traffic inspected (DIA + MPLS breakout)
✓ HA pairs for redundancy (active-standby or active-active)
✓ SGT integration via SXP (TrustSec eXchange Protocol)
✓ East-west traffic (within fabric) bypasses firewall (inspected at Border via SGACL)

### 1.2 CHENNAI HUB FIREWALL TOPOLOGY

Similar to Mumbai but smaller scale:
- 2 × FTD 2130 (HA pair) for DIA
- 1 × FTD 2130 for MPLS (standalone, lower priority)
- Throughput: 15 Gbps (vs Mumbai 70 Gbps)

### 1.3 NOIDA BRANCH FIREWALL TOPOLOGY

Simplified branch design:
- 2 × FTD 1150 (HA pair)
- Single firewall pair handles all traffic (DIA + MPLS)
- Throughput: 3 Gbps
- No separate MPLS firewall (cost optimization)

## SECTION 2: FIREWALL CAPACITY PLANNING

### 2.1 MUMBAI FIREWALL SIZING

Traffic Requirements:
- Internet (DIA): 10 Gbps peak
- MPLS Breakout: 5 Gbps peak
- VPN: 3 Gbps peak
- Total: 18 Gbps peak (40 Gbps with growth)

**Platform: Cisco Firepower FTD 4150**

Specifications:
- Firewall Throughput: 70 Gbps (stateful)
- IPS Throughput: 25 Gbps
- VPN Throughput: 18 Gbps (IPSec)
- Connections per Second: 120,000 CPS
- Max Concurrent Connections: 20 million
- Interfaces: 8 × 10GE + 2 × 40GE
- RAM: 128 GB
- Storage: 2 × 960 GB SSD (RAID 1)
- Power: 2 × 750W PSU (redundant)
- Rack Units: 1U
- Cost: $X,XXXper appliance

Deployment:
- Quantity: 2 (HA pair for DIA)
- HA Mode: Active-Standby (stateful failover)
- Total Cost: $X,XXX
Additional Firewall for MPLS:
- Quantity: 1 × FTD 4150 (standalone, lower priority)
- Cost: $X,XXX- Total Mumbai Firewalls: $X,XXX
Utilization Analysis:
- Current Load: 18 Gbps / 70 Gbps = 25.7%
- IPS Load: 18 Gbps / 25 Gbps = 72% (acceptable)
- 3-Year Growth: 28 Gbps / 70 Gbps = 40%
- Verdict: ✓ Well-sized

### 2.2 CHENNAI FIREWALL SIZING

Traffic Requirements:
- Internet (DIA): 5 Gbps peak
- MPLS Breakout: 3 Gbps peak
- VPN: 1 Gbps peak
- Total: 9 Gbps peak (15 Gbps with growth)

**Platform: Cisco Firepower FTD 2130**

Specifications:
- Firewall Throughput: 15 Gbps
- IPS Throughput: 6 Gbps
- VPN Throughput: 5 Gbps
- Connections per Second: 50,000 CPS
- Max Concurrent Connections: 5 million
- Interfaces: 6 × 10GE + 2 × 40GE
- RAM: 64 GB
- Storage: 2 × 480 GB SSD
- Power: 2 × 450W PSU
- Rack Units: 1U
- Cost: $X,XXXper appliance

Deployment:
- Quantity: 2 (HA pair)
- Total Cost: $X,XXX
Utilization: 9 Gbps / 15 Gbps = 60% (good)

### 2.3 NOIDA BRANCH FIREWALL SIZING

Traffic Requirements:
- Internet: 1.5 Gbps
- MPLS: 0.5 Gbps
- Total: 2 Gbps peak

**Platform: Cisco Firepower FTD 1150**

Specifications:
- Firewall Throughput: 3 Gbps
- IPS Throughput: 1.5 Gbps
- VPN Throughput: 1 Gbps
- Interfaces: 4 × 1GE + 2 × 10GE
- RAM: 16 GB
- Cost: $X,XXXper appliance

Deployment:
- Quantity: 2 (HA pair)
- Total Cost: $X,XXX
## SECTION 3: SECURITY ZONES & POLICIES

### 3.1 SECURITY ZONES DEFINITION

| Zone Name | Trust Level | Interfaces | Description |
|---|---|---|---|
| INSIDE | Trusted | To Border nodes | SD-Access fabric (trusted) |
| OUTSIDE | Untrusted | To Internet ISP | Public Internet |
| DMZ | Semi-Trust | To DMZ switches | Public-facing servers |
| MPLS-WAN | Trusted | To MPLS PE router | Corporate WAN |
| GUEST | Restricted | To Guest anchor | Guest wireless |
| MGMT | Highly Trusted | Management network | Firewall management |

Interface Assignments:
- FW-DIA-1 Port 1-2: INSIDE (to Border-1, Border-2) - 10GE LAG
- FW-DIA-1 Port 3: OUTSIDE (to ISP router) - 10GE
- FW-DIA-1 Port 4: DMZ (to DMZ switch) - 10GE
- FW-DIA-1 Port 5: GUEST (to guest anchor) - 10GE
- FW-DIA-1 Port 6: MGMT (to management VLAN) - 1GE

### 3.2 FIREWALL POLICY RULESET (HIGH-LEVEL)

| Priority | Source Zone | Dest Zone | SGT Source | SGT Dest | Action | Service | Inspection |
|---|---|---|---|---|---|---|---|
| 1 | INSIDE | OUTSIDE | 10 (Employee) | Internet | PERMIT | HTTP, HTTPS | IPS + URL |
| 2 | INSIDE | OUTSIDE | 20 (Voice) | Internet | DENY | ANY | N/A |
| 3 | INSIDE | OUTSIDE | 40 (Guest) | Internet | PERMIT | HTTP, HTTPS | IPS + URL + Sandbox |
| 4 | INSIDE | OUTSIDE | 50 (IoT) | Internet | PERMIT | HTTPS (443) | IPS + Strict DPI |
| 5 | INSIDE | DMZ | 10 (Employee) | 70 (Srv) | PERMIT | HTTP, HTTPS | IPS |
| 6 | OUTSIDE | DMZ | Internet | 70 (Srv) | PERMIT | HTTPS (443) | IPS + WAF |
| 7 | OUTSIDE | INSIDE | Internet | ANY | DENY | ANY | N/A (default deny) |
| 8 | DMZ | INSIDE | 70 (Servers) | ANY | DENY | ANY | N/A (isolation) |
| 9 | GUEST | INSIDE | 40 (Guest) | ANY | DENY | ANY | N/A (isolation) |
| 10 | MPLS-WAN | INSIDE | Trusted | ANY | PERMIT | ANY | Light inspection |
| 11 | ANY | MGMT | ANY | ANY | DENY | ANY | N/A (strict MGMT) |

Default Policy: DENY ALL (implicit deny at end)

### 3.3 NAT POLICIES

| NAT Type | Source Zone | Source IP/SGT | Dest Zone | Translated IP | Use Case |
|---|---|---|---|---|---|
| PAT | INSIDE | 10.100.0.0/16 | OUTSIDE | 203.0.113.50 | Employee Internet access |
| PAT | GUEST | 10.101.0.0/16 | OUTSIDE | 203.0.113.51 | Guest Internet access |
| Static NAT | OUTSIDE | Internet | DMZ | 203.0.113.100 | Inbound web server (1:1) |
| PAT | INSIDE | 10.102.0.0/16 (IoT) | OUTSIDE | 203.0.113.52 | IoT cloud telemetry |
| No NAT | MPLS-WAN | 10.0.0.0/8 | INSIDE | No translation | Corporate WAN (private) |

NAT Pool: 203.0.113.50 - 203.0.113.100 (50 public IPs allocated)

## SECTION 4: INTEGRATION WITH SD-ACCESS FABRIC

### 4.1 SGT PROPAGATION TO FIREWALL

Challenge: Fabric uses inline SGT tagging (CMD header in VXLAN), but firewall doesn't 
           understand VXLAN. How do we pass SGT to firewall?

Solution: SXP (SGT eXchange Protocol)

Architecture:
```text
┌────────────────────────────────────────────────────────────┐
│  SD-Access Fabric (Border Node)                            │
│  ├─ Maintains IP-to-SGT binding table                      │
│  ├─ Example: 10.100.1.50 → SGT 10 (Employee)              │
│  └─ Sends bindings to firewall via SXP (TCP 64999)        │
└────────────────────────────────────────────────────────────┘
                         │
                    SXP Connection
                    (TCP 64999)
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│  Cisco Firepower FTD                                        │
│  ├─ Receives IP-to-SGT bindings via SXP                    │
│  ├─ Stores in local database                               │
│  ├─ Applies SGT-based policies to traffic                  │
│  └─ Example: Traffic from 10.100.1.50 → Apply Employee rules│
└────────────────────────────────────────────────────────────┘
```

Configuration Requirements:
- Border Node: Enable SXP speaker (exports bindings)
- Firewall: Enable SXP listener (imports bindings)
- Authentication: Shared password for SXP connection
- Refresh: Bindings updated every 120 seconds (default)

### 4.2 TRAFFIC FLOW: FABRIC TO FIREWALL TO INTERNET

Step-by-Step Flow:

```text
[1] Employee PC (10.100.1.50, SGT 10) sends HTTP request to google.com

[2] Edge Node:
    - Assigns SGT 10 (Employee-Full) via ISE RADIUS
    - VXLAN encap to Border (VNI 8001)
    - Outer: 10.250.1.15 (Edge) → 10.250.1.1 (Border)

[3] Border Node:
    - VXLAN decap
    - Lookup: google.com (203.0.113.46, documentation IP) → Not in fabric
    - Default route: Send to Firewall
    - Remove VXLAN, send native IP packet to FW
    - SXP: Border told FW "10.100.1.50 = SGT 10"

[4] Firewall (FTD 4150):
    - Receive packet from Border (INSIDE zone)
    - Lookup source IP: 10.100.1.50 → SGT 10 (from SXP)
    - Policy match: SGT 10 → Internet = PERMIT (HTTP/HTTPS)
    - IPS inspection: PASS
    - URL filtering: google.com = Allowed
    - NAT: 10.100.1.50 → 203.0.113.50 (PAT)
    - Forward to ISP router (OUTSIDE zone)

[5] Internet (response flow reverses, stateful firewall allows return)
```

### 4.3 VXLAN TERMINATION POINT

Question: Does firewall terminate VXLAN?
Answer: NO! Border terminates VXLAN.

Border Role:
- Terminates VXLAN tunnels from fabric
- Strips VXLAN header
- Sends native IP packets to firewall
- Firewall sees regular IP packets (no VXLAN awareness needed)

This is why Border is called "Fusion Router" - it fuses fabric (VXLAN) with traditional routing.

## SECTION 5: HIGH AVAILABILITY & FAILOVER

### 5.1 FIREWALL HA CONFIGURATION

Mumbai FTD 4150 HA Pair:
- Mode: Active-Standby
- Failover Link: Dedicated 10GE link between FW-DIA-1 and FW-DIA-2
- State Sync Link: Dedicated 10GE link (separate from failover)
- Failover Time: <3 seconds (sub-second with SSO)
- Health Monitoring: Interface monitoring + system health
- Failover Triggers: Interface down, CPU >95%, Memory >90%, power failure

Shared IP Addressing (Virtual IPs):
- INSIDE interface: 10.252.1.254 (shared VIP)
  - FW-DIA-1: 10.252.1.252 (physical)
  - FW-DIA-2: 10.252.1.253 (physical)
- OUTSIDE interface: 203.0.113.1 (shared VIP)
  - FW-DIA-1: 203.0.113.2
  - FW-DIA-2: 203.0.113.3

Border Node Configuration:
- Default route: 10.252.1.254 (VIP, not physical IP)
- If FW-DIA-1 fails, FW-DIA-2 assumes VIP (transparent)

### 5.2 DUAL-FIREWALL DESIGN (ACTIVE-ACTIVE)

For higher throughput, deploy active-active:

```text
                    Internet
                        │
            ┌───────────┼───────────┐
            │                       │
       ┌────┴─────┐            ┌────┴─────┐
       │ FW-DIA-1 │            │ FW-DIA-2 │
       │ (Active) │            │ (Active) │
       └────┬─────┘            └────┬─────┘
            │                       │
            └───────────┼───────────┘
                        │
                  ┌─────┴─────┐
                  │ Border-1  │
                  │ Border-2  │
                  │ (ECMP)    │
                  └───────────┘
```

Configuration:
- ECMP (Equal-Cost Multi-Path) on Border
- Two default routes:
  - via FW-DIA-1 (10.252.1.252)
  - via FW-DIA-2 (10.252.1.253)
- Load balancing: Per-flow hashing
- Throughput: 2× (140 Gbps combined vs 70 Gbps single)

Consideration: Active-active requires:
- Asymmetric routing handling
- Session synchronization between firewalls
- More complex configuration
- Recommended only if >60 Gbps sustained load

## SECTION 6: ADVANCED FEATURES

### 6.1 INTRUSION PREVENTION SYSTEM (IPS)

Cisco Firepower IPS (Snort 3):
- Signature Database: 60,000+ signatures
- Update Frequency: Daily automatic updates
- Inspection Modes:
  - Inline (drop malicious packets)
  - Inline Tap (monitor only)
  - Passive (out-of-band monitoring)
- Performance Impact: 60-70% throughput reduction when enabled
- Mumbai Load: 18 Gbps firewall / 25 Gbps IPS = 72% utilization

Recommended Policies:
- Balanced Security & Connectivity (default)
- Maximum Detection (for DMZ traffic)
- Connectivity over Security (for trusted MPLS)

### 6.2 URL FILTERING & MALWARE PROTECTION

Cisco Talos Intelligence:
- URL Categories: 80+ (social media, gambling, malware, etc.)
- Malware Detection: File reputation, sandboxing (Threat Grid)
- File Types Inspected: EXE, PDF, DOC, ZIP, etc.
- Cloud Lookup: Real-time Talos cloud query

Configuration Example:
- Block: Malware, Phishing, High Risk
- Warn: Gambling, Adult Content
- Allow: Business, Education
- Guest Network: Block All except Business, Education, News

### 6.3 VPN CONCENTRATOR FUNCTION

Remote Access VPN (AnyConnect):
- Protocol: SSL-VPN (port 443) + IPSec (IKEv2)
- Capacity: 10,000 concurrent sessions (FTD 4150)
- Authentication: ISE RADIUS integration
- Split Tunneling: Enabled (Internet direct, corporate via VPN)
- Posture Assessment: AnyConnect ISE posture module

Site-to-Site VPN:
- Tunnels: 5,000 maximum (FTD 4150)
- Current: 20 tunnels (branches + partners)
- Protocol: IKEv2 with AES-256
- Routing: Dynamic (BGP over IPSec)

## SECTION 7: MONITORING & LOGGING

### 7.1 FIREWALL MANAGEMENT CENTER (FMC)

Centralized Management Platform:
- Platform: Cisco Firepower Management Center (Virtual)
- Deployment: VM on ESXi (Mumbai data center)
- Resources: 28 vCPU, 64 GB RAM, 2.2 TB storage
- Managed Devices: All FTD appliances (Mumbai, Chennai, Noida)
- Licensing: FMC License (included with FTD)

Features:
- Centralized policy management
- Dashboard & reporting
- Health monitoring
- Software updates
- Backup & restore

### 7.2 LOGGING & SIEM INTEGRATION

Syslog Export:
- Destination: Mumbai Syslog Server (10.252.10.30)
- Log Types:
  - Connection events (allow/deny)
  - IPS alerts
  - URL filtering blocks
  - VPN logins
  - File malware detections
- Volume: ~50 GB/day (Mumbai), 25 GB/day (Chennai)
- Retention: 90 days local, 1 year archive

SIEM Integration:
- Platform: Splunk Enterprise (recommended)
- Connector: Firepower eStreamer (encrypted syslog)
- Use Cases:
  - Security incident correlation
  - Compliance reporting (PCI-DSS, GDPR)
  - Threat hunting
  - User behavior analytics

## SECTION 8: DESIGN SUMMARY & COST

| Site | Firewall Model | Quantity | Role | Throughput | Cost ($) |
|---|---|---|---|---|---|
| Mumbai | FTD 4150 | 2 | DIA HA Pair | 70 Gbps | $X,XXX |
| Mumbai | FTD 4150 | 1 | MPLS Standalone | 70 Gbps | $X,XXX |
| Chennai | FTD 2130 | 2 | DIA HA Pair | 15 Gbps | $X,XXX |
| Noida | FTD 1150 | 2 | Branch HA Pair | 3 Gbps | $X,XXX |
| Management | FMC Virtual | 2 | Centralized Mgmt | N/A | $X,XXX |

TOTAL                                                                       $X,XXX

Annual Licensing:
- IPS Subscriptions: $X,XXX/year
- URL Filtering: $X,XXX/year
- Malware Protection: $X,XXX/year
- Total OpEx: $X,XXX/year

Grand Total:
- CapEx: $X,XXX- Annual OpEx: $X,XXX-Year TCO: $X,XXX
## SECTION 9: WHAT WAS MISSING (ADDRESSED)

Previously Missed Items (NOW COVERED):
✓ Firewall placement in topology
✓ Firewall capacity planning (Mumbai, Chennai, Noida)
✓ Security zones & policy ruleset
✓ NAT policies
✓ SGT integration via SXP
✓ Traffic flows through firewall
✓ HA configuration & failover
✓ IPS, URL filtering, malware protection
✓ VPN concentrator function
✓ FMC management platform
✓ Logging & SIEM integration
✓ Cost breakdown

Still Missing (IDENTIFIED FOR FUTURE):
⚠ QoS policy across fabric (marking, queuing, shaping)
⚠ Multicast routing (if required for video distribution)
⚠ IPv6 dual-stack design
⚠ Backup infrastructure (DNAC/ISE backup targets, retention)
⚠ Load balancer for ISE PSN (F5 or Cisco ACE)
⚠ Monitoring infrastructure (NetFlow collectors, SNMP trap receivers)
⚠ DCI (Data Center Interconnect) design
⚠ Disaster recovery procedures
⚠ Change management workflows

END OF FIREWALL DESIGN DOCUMENT
