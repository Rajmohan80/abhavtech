# 5.20 Lab Validation Checklist

## Document Information

| Field | Value |
|-------|-------|
| Document Title | Lab Validation Checklist |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Abhavtech |
| Classification | Internal Use |
| Target Audience | Network Engineers, Test Teams, Project Managers |

---

## Overview

This section provides a comprehensive lab validation checklist for pre-production testing of the Abhavtech SD-WAN deployment. All items must be validated in the lab environment before proceeding to production deployment.

### Lab Validation Objectives

```
LAB VALIDATION FRAMEWORK
========================

Purpose:
- Validate all configurations before production
- Identify and resolve issues in safe environment
- Train operations team on new platform
- Document baseline performance metrics
- Verify integration with SD-Access fabric

Lab Environment:
- Scaled-down production replica
- All controller components represented
- Representative WAN Edge models
- SD-Access border node for handoff testing
- ISE integration enabled

Exit Criteria:
- 100% of critical items passed
- 95% of all items passed
- No outstanding P1/P2 issues
- Operations team sign-off
- Documentation validated
```

---

## Lab Environment Checklist

### LE-001: Lab Infrastructure Validation

| # | Item | Status | Verified By | Date |
|---|------|--------|-------------|------|
| 1 | Lab vManage deployed and accessible | ☐ Pass ☐ Fail ☐ N/A | | |
| 2 | Lab vSmart controllers operational | ☐ Pass ☐ Fail ☐ N/A | | |
| 3 | Lab vBond validators reachable | ☐ Pass ☐ Fail ☐ N/A | | |
| 4 | Lab ISE node configured | ☐ Pass ☐ Fail ☐ N/A | | |
| 5 | Lab DNS/NTP services available | ☐ Pass ☐ Fail ☐ N/A | | |
| 6 | Lab DHCP server configured | ☐ Pass ☐ Fail ☐ N/A | | |
| 7 | Lab network connectivity verified | ☐ Pass ☐ Fail ☐ N/A | | |
| 8 | Lab SD-Access border node available | ☐ Pass ☐ Fail ☐ N/A | | |

### LE-002: Lab WAN Edge Inventory

| Device | Model | Serial | Role | Status |
|--------|-------|--------|------|--------|
| LAB-MUM-WE-01 | C8300-2N2S-6T | LAB001 | Hub WAN Edge | ☐ Ready |
| LAB-MUM-WE-02 | C8300-2N2S-6T | LAB002 | Hub WAN Edge (HA) | ☐ Ready |
| LAB-BLR-WE-01 | C8300-1N1S-6T | LAB003 | Branch WAN Edge | ☐ Ready |
| LAB-BORDER-01 | C9300-48P | LAB004 | SD-Access Border | ☐ Ready |

### Lab Topology Diagram

```
                    LAB VALIDATION TOPOLOGY
                    =======================
                    
                        ┌─────────────┐
                        │   Lab ISE   │
                        │ 192.168.1.5 │
                        └──────┬──────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────┴───────┐      ┌───────┴───────┐      ┌───────┴───────┐
│  Lab vManage  │      │  Lab vSmart   │      │  Lab vBond    │
│ 192.168.1.10  │      │ 192.168.1.11  │      │ 192.168.1.12  │
└───────────────┘      └───────────────┘      └───────────────┘
                               │
                    ┌──────────┴──────────┐
                    │    Lab Transport    │
                    │  (MPLS + Internet)  │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────┴───────┐      ┌───────┴───────┐      ┌───────┴───────┐
│ LAB-MUM-WE-01 │      │ LAB-MUM-WE-02 │      │ LAB-BLR-WE-01 │
│   Hub Site    │      │   Hub HA      │      │   Branch      │
└───────┬───────┘      └───────┬───────┘      └───────────────┘
        │                      │
        └──────────┬───────────┘
                   │
           ┌───────┴───────┐
           │ LAB-BORDER-01 │
           │  SD-Access    │
           └───────────────┘
```

---

## Control Plane Validation Checklist

### CP-001: Controller Connectivity

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | vManage reachable via HTTPS | GUI accessible | ☐ Pass ☐ Fail | |
| 2 | vManage API responding | 200 OK on /dataservice | ☐ Pass ☐ Fail | |
| 3 | vSmart control connections | All WAN Edges connected | ☐ Pass ☐ Fail | |
| 4 | vBond DTLS connections | Authentication working | ☐ Pass ☐ Fail | |
| 5 | Inter-controller communication | vSmart ↔ vManage | ☐ Pass ☐ Fail | |

**Verification Commands:**

```bash
# On vManage
show control connections
show orchestrator connections

# On vSmart
show control connections
show omp summary

# On WAN Edge
show sdwan control connections
show sdwan control local-properties
```

### CP-002: Certificate Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | Root CA certificate installed | Valid and trusted | ☐ Pass ☐ Fail | |
| 2 | vManage certificate valid | Not expired, correct CN | ☐ Pass ☐ Fail | |
| 3 | vSmart certificate valid | Not expired, correct CN | ☐ Pass ☐ Fail | |
| 4 | vBond certificate valid | Not expired, correct CN | ☐ Pass ☐ Fail | |
| 5 | WAN Edge certificates valid | Signed by Root CA | ☐ Pass ☐ Fail | |
| 6 | Certificate chain complete | Full chain verifiable | ☐ Pass ☐ Fail | |

**Verification Commands:**

```bash
# On any device
show certificate installed
show certificate root-ca-cert
show certificate validity

# Certificate expiry check
show certificate serial
```

### CP-003: OMP Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | OMP sessions established | All peers up | ☐ Pass ☐ Fail | |
| 2 | OMP routes received | Expected prefixes present | ☐ Pass ☐ Fail | |
| 3 | OMP TLOCs advertised | All transports visible | ☐ Pass ☐ Fail | |
| 4 | OMP services advertised | Services registered | ☐ Pass ☐ Fail | |
| 5 | OMP policy applied | Control policy active | ☐ Pass ☐ Fail | |

**Verification Commands:**

```bash
# On WAN Edge
show sdwan omp summary
show sdwan omp peers
show sdwan omp routes
show sdwan omp tlocs
show sdwan omp services
```

---

## Data Plane Validation Checklist

### DP-001: Tunnel Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | IPsec tunnels established | All tunnels up | ☐ Pass ☐ Fail | |
| 2 | BFD sessions active | All sessions up | ☐ Pass ☐ Fail | |
| 3 | Tunnel MTU correct | 1400 bytes or configured | ☐ Pass ☐ Fail | |
| 4 | Tunnel encryption | AES-256-GCM active | ☐ Pass ☐ Fail | |
| 5 | TLOC colors correct | Expected colors advertised | ☐ Pass ☐ Fail | |
| 6 | Multi-transport tunnels | MPLS + Internet tunnels | ☐ Pass ☐ Fail | |

**Verification Commands:**

```bash
# On WAN Edge
show sdwan ipsec local-sa
show sdwan bfd sessions
show sdwan tunnel statistics
show interface tunnel statistics
```

### DP-002: Traffic Forwarding

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | VPN 10 traffic flows | End-to-end ping | ☐ Pass ☐ Fail | |
| 2 | VPN 20 traffic isolated | No cross-VPN leak | ☐ Pass ☐ Fail | |
| 3 | VPN 30 traffic QoS | Priority queuing | ☐ Pass ☐ Fail | |
| 4 | Inter-VPN routing | Route leaking works | ☐ Pass ☐ Fail | |
| 5 | DIA traffic flows | Internet reachable | ☐ Pass ☐ Fail | |
| 6 | NAT functioning | Source NAT applied | ☐ Pass ☐ Fail | |

**Traffic Test Matrix:**

```
TRAFFIC FLOW VALIDATION MATRIX
==============================

Source VPN → Dest VPN → Expected Result

VPN 10 (Corp)  → VPN 10 (Corp)  → ALLOW (same segment)
VPN 10 (Corp)  → VPN 20 (Guest) → DENY (isolated)
VPN 10 (Corp)  → VPN 30 (Voice) → DENY (isolated)
VPN 10 (Corp)  → VPN 50 (Shared)→ ALLOW (shared services)
VPN 20 (Guest) → VPN 10 (Corp)  → DENY (isolated)
VPN 20 (Guest) → Internet       → ALLOW (DIA)
VPN 30 (Voice) → VPN 30 (Voice) → ALLOW (same segment)
VPN 30 (Voice) → VPN 50 (Shared)→ ALLOW (shared services)
```

### DP-003: Performance Baseline

| # | Metric | Target | Measured | Status |
|---|--------|--------|----------|--------|
| 1 | Throughput (Hub-Hub) | ≥ 1 Gbps | _______ Mbps | ☐ Pass ☐ Fail |
| 2 | Throughput (Hub-Branch) | ≥ 500 Mbps | _______ Mbps | ☐ Pass ☐ Fail |
| 3 | Latency (Hub-Hub) | ≤ 50 ms | _______ ms | ☐ Pass ☐ Fail |
| 4 | Latency (Hub-Branch) | ≤ 100 ms | _______ ms | ☐ Pass ☐ Fail |
| 5 | Jitter | ≤ 30 ms | _______ ms | ☐ Pass ☐ Fail |
| 6 | Packet Loss | ≤ 0.1% | _______ % | ☐ Pass ☐ Fail |

---

## SD-Access Integration Checklist

### SA-001: Fabric Handoff Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | Physical connectivity | Link up, no errors | ☐ Pass ☐ Fail | |
| 2 | VLAN trunking | All handoff VLANs passing | ☐ Pass ☐ Fail | |
| 3 | IP addressing | /30 subnets configured | ☐ Pass ☐ Fail | |
| 4 | Layer 3 reachability | Ping across handoff | ☐ Pass ☐ Fail | |

**Handoff VLAN Verification:**

| Handoff VLAN | VRF/VPN | Border IP | WAN Edge IP | Status |
|--------------|---------|-----------|-------------|--------|
| 3010 | Corporate/VPN10 | 10.100.100.2 | 10.100.100.1 | ☐ Pass |
| 3020 | Guest/VPN20 | 10.100.200.2 | 10.100.200.1 | ☐ Pass |
| 3030 | Voice/VPN30 | 10.100.130.2 | 10.100.130.1 | ☐ Pass |
| 3040 | IoT/VPN40 | 10.100.140.2 | 10.100.140.1 | ☐ Pass |
| 3050 | Shared/VPN50 | 10.100.150.2 | 10.100.150.1 | ☐ Pass |

### SA-002: BGP Peering Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | BGP sessions established | State: Established | ☐ Pass ☐ Fail | |
| 2 | BGP prefixes received | Routes from SD-Access | ☐ Pass ☐ Fail | |
| 3 | BGP prefixes advertised | Routes to SD-Access | ☐ Pass ☐ Fail | |
| 4 | BGP AS numbers correct | 65200 ↔ 65100 | ☐ Pass ☐ Fail | |
| 5 | BGP authentication | MD5 password working | ☐ Pass ☐ Fail | |
| 6 | BGP route redistribution | LISP ↔ OMP | ☐ Pass ☐ Fail | |

**Verification Commands:**

```bash
# On SD-Access Border
show bgp vpnv4 unicast all summary
show bgp vpnv4 unicast vrf Corporate-Data
show ip route vrf Corporate-Data bgp

# On WAN Edge
show bgp vpnv4 unicast all summary
show ip route vrf 10 bgp
show sdwan omp routes vpn 10
```

### SA-003: SGT/TrustSec Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | CTS global enabled | cts authorization list | ☐ Pass ☐ Fail | |
| 2 | ISE connectivity | RADIUS reachable | ☐ Pass ☐ Fail | |
| 3 | SGT inline tagging | Enabled on handoff | ☐ Pass ☐ Fail | |
| 4 | SGT propagation | Tags visible across handoff | ☐ Pass ☐ Fail | |
| 5 | SGACL policies | Downloaded from ISE | ☐ Pass ☐ Fail | |
| 6 | Role-based enforcement | Traffic enforced by SGT | ☐ Pass ☐ Fail | |

**SGT Propagation Test:**

```
SGT PROPAGATION VALIDATION
==========================

Test: Verify SGT maintained across fabric handoff

1. Source: SD-Access client (SGT 100 - Employees)
2. Path: Client → Fabric Edge → Border → WAN Edge → Remote Site
3. Verify: SGT 100 visible at each hop

Border Node Check:
  show cts interface Te1/0/1
  show cts role-based sgt-map all

WAN Edge Check:
  show cts interface Te0/0/0.10
  show cts role-based counters
```

### SA-004: End-to-End Traffic Flow

| # | Test Case | Source | Destination | Expected | Status |
|---|-----------|--------|-------------|----------|--------|
| 1 | Corp to Corp | SD-Access Client | Remote Branch | Allow | ☐ Pass |
| 2 | Corp to Shared | SD-Access Client | Shared Services | Allow | ☐ Pass |
| 3 | Guest to Internet | Guest SSID | Internet | Allow (DIA) | ☐ Pass |
| 4 | Voice to Voice | IP Phone | Remote Phone | Allow (QoS) | ☐ Pass |
| 5 | IoT Isolation | IoT Device | Corp Network | Deny | ☐ Pass |

---

## Security Validation Checklist

### SEC-001: Segmentation Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | VPN isolation | No cross-VPN traffic | ☐ Pass ☐ Fail | |
| 2 | VRF separation | Routing tables isolated | ☐ Pass ☐ Fail | |
| 3 | ACL enforcement | Policies applied | ☐ Pass ☐ Fail | |
| 4 | SGT enforcement | SGACL blocking | ☐ Pass ☐ Fail | |

### SEC-002: Firewall Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | ZBFW zones configured | All zones defined | ☐ Pass ☐ Fail | |
| 2 | Zone pairs active | Policies applied | ☐ Pass ☐ Fail | |
| 3 | Inspect rules working | Stateful inspection | ☐ Pass ☐ Fail | |
| 4 | URL filtering | Categories blocked | ☐ Pass ☐ Fail | |
| 5 | IPS/IDS active | Signatures loaded | ☐ Pass ☐ Fail | |
| 6 | AMP enabled | File inspection | ☐ Pass ☐ Fail | |

**Verification Commands:**

```bash
# On WAN Edge
show policy-firewall stats zone-pair
show utd engine standard status
show utd engine standard threat-inspection summary
show utd ips statistics
show sdwan zbfw zonepair-statistics
```

### SEC-003: Encryption Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | Control plane DTLS | TLS 1.2+ active | ☐ Pass ☐ Fail | |
| 2 | Data plane IPsec | AES-256-GCM | ☐ Pass ☐ Fail | |
| 3 | Key rotation | Automatic rekey working | ☐ Pass ☐ Fail | |
| 4 | PFS enabled | DH group 16+ | ☐ Pass ☐ Fail | |

---

## High Availability Validation Checklist

### HA-001: Controller Redundancy

| # | Test Case | Action | Expected Result | Status |
|---|-----------|--------|-----------------|--------|
| 1 | vManage failover | Shutdown primary | Services continue on secondary | ☐ Pass |
| 2 | vSmart failover | Disconnect vSmart-1 | OMP re-establishes to vSmart-2 | ☐ Pass |
| 3 | vBond failover | Block vBond-1 | New devices use vBond-2 | ☐ Pass |
| 4 | Database sync | Modify config | Replicated to all nodes | ☐ Pass |

### HA-002: WAN Edge Redundancy

| # | Test Case | Action | Expected Result | Status |
|---|-----------|--------|-----------------|--------|
| 1 | Active/Active ECMP | Both routers active | Traffic load balanced | ☐ Pass |
| 2 | Primary failure | Shutdown WE-01 | Traffic fails over to WE-02 | ☐ Pass |
| 3 | Primary recovery | Restore WE-01 | Traffic rebalances | ☐ Pass |
| 4 | BGP failover | Break BGP to primary | Routes via secondary | ☐ Pass |

### HA-003: Transport Redundancy

| # | Test Case | Action | Expected Result | Status |
|---|-----------|--------|-----------------|--------|
| 1 | MPLS failure | Disconnect MPLS | Traffic shifts to Internet | ☐ Pass |
| 2 | Internet failure | Disconnect Internet | Traffic shifts to MPLS | ☐ Pass |
| 3 | Dual transport failure | Disconnect both | LTE backup activates | ☐ Pass |
| 4 | Transport recovery | Restore MPLS | Traffic returns to preferred | ☐ Pass |

**Failover Timing Validation:**

| Scenario | Target RTO | Measured RTO | Status |
|----------|------------|--------------|--------|
| Transport failover | < 10 seconds | _______ sec | ☐ Pass ☐ Fail |
| WAN Edge failover | < 30 seconds | _______ sec | ☐ Pass ☐ Fail |
| Controller failover | < 60 seconds | _______ sec | ☐ Pass ☐ Fail |
| Site failover | < 120 seconds | _______ sec | ☐ Pass ☐ Fail |

---

## Application Performance Validation Checklist

### AP-001: AAR Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | SLA classes defined | All 5 classes configured | ☐ Pass ☐ Fail | |
| 2 | SLA thresholds correct | Latency/Loss/Jitter | ☐ Pass ☐ Fail | |
| 3 | App-aware routing active | DPI enabled | ☐ Pass ☐ Fail | |
| 4 | Preferred path selection | Best path chosen | ☐ Pass ☐ Fail | |
| 5 | Path failover | SLA violation triggers | ☐ Pass ☐ Fail | |

**Application SLA Test Matrix:**

| Application | SLA Class | Preferred Path | Backup Path | Status |
|-------------|-----------|----------------|-------------|--------|
| Voice (RTP) | Real-Time | MPLS | Internet | ☐ Pass |
| Video (Teams) | Streaming | MPLS | Internet | ☐ Pass |
| ERP (SAP) | Business-Critical | MPLS | Internet | ☐ Pass |
| Web | Default | Internet | MPLS | ☐ Pass |
| Guest | Best-Effort | Internet | None | ☐ Pass |

### AP-002: QoS Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | DSCP marking | Correct values applied | ☐ Pass ☐ Fail | |
| 2 | Queue scheduling | Priority/CBWFQ | ☐ Pass ☐ Fail | |
| 3 | Bandwidth allocation | Per-class limits | ☐ Pass ☐ Fail | |
| 4 | Traffic shaping | Rate limiting active | ☐ Pass ☐ Fail | |
| 5 | Congestion behavior | Correct drop policy | ☐ Pass ☐ Fail | |

**QoS Queue Verification:**

```bash
# On WAN Edge
show sdwan policy qos-scheduler interface
show class-map
show policy-map interface
show sdwan interface statistics
```

---

## Operations Validation Checklist

### OPS-001: Monitoring Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | vManage dashboards | All widgets loading | ☐ Pass ☐ Fail | |
| 2 | Device health metrics | CPU/Memory/Disk visible | ☐ Pass ☐ Fail | |
| 3 | Tunnel statistics | All tunnels monitored | ☐ Pass ☐ Fail | |
| 4 | Application visibility | DPI data populated | ☐ Pass ☐ Fail | |
| 5 | SNMP polling | Traps received | ☐ Pass ☐ Fail | |
| 6 | Syslog collection | Logs centralized | ☐ Pass ☐ Fail | |

### OPS-002: Alerting Validation

| # | Alert Condition | Expected Notification | Status | Notes |
|---|-----------------|----------------------|--------|-------|
| 1 | Device unreachable | Email + PagerDuty | ☐ Pass ☐ Fail | |
| 2 | Tunnel down | Email + Slack | ☐ Pass ☐ Fail | |
| 3 | High CPU | Email | ☐ Pass ☐ Fail | |
| 4 | Certificate expiry | Email (30 day warning) | ☐ Pass ☐ Fail | |
| 5 | SLA violation | Email + Dashboard | ☐ Pass ☐ Fail | |

### OPS-003: Backup/Restore Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | Config backup automated | Daily backups running | ☐ Pass ☐ Fail | |
| 2 | Backup files accessible | Retrievable from storage | ☐ Pass ☐ Fail | |
| 3 | Config restore tested | Successful restoration | ☐ Pass ☐ Fail | |
| 4 | Database backup | vManage DB backed up | ☐ Pass ☐ Fail | |
| 5 | DR replication | Chennai DR sync'd | ☐ Pass ☐ Fail | |

---

## Template and Policy Validation Checklist

### TP-001: Device Templates

| Template Name | Device Type | Variables | Attached Devices | Status |
|---------------|-------------|-----------|------------------|--------|
| Hub-C8500-Template | C8500-12X4QC | 25 | LAB-MUM-WE-01 | ☐ Pass |
| Hub-C8300-Template | C8300-2N2S-6T | 22 | LAB-MUM-WE-02 | ☐ Pass |
| Branch-C8300-Template | C8300-1N1S-6T | 18 | LAB-BLR-WE-01 | ☐ Pass |

### TP-002: Feature Templates

| Feature | Template Name | Validated | Status |
|---------|---------------|-----------|--------|
| System | System-Common | ☐ | ☐ Pass ☐ Fail |
| VPN 0 Transport | VPN0-MPLS-Internet | ☐ | ☐ Pass ☐ Fail |
| VPN 512 Management | VPN512-OOB | ☐ | ☐ Pass ☐ Fail |
| Service VPN | ServiceVPN-Corporate | ☐ | ☐ Pass ☐ Fail |
| Security | ZBFW-Standard | ☐ | ☐ Pass ☐ Fail |
| AAA | AAA-ISE | ☐ | ☐ Pass ☐ Fail |
| Logging | Logging-Central | ☐ | ☐ Pass ☐ Fail |
| SNMP | SNMP-v3 | ☐ | ☐ Pass ☐ Fail |
| NTP | NTP-Stratum2 | ☐ | ☐ Pass ☐ Fail |

### TP-003: Policy Validation

| Policy Type | Policy Name | Validated | Status |
|-------------|-------------|-----------|--------|
| Control Policy | Hub-Prefer-MPLS | ☐ | ☐ Pass ☐ Fail |
| Data Policy | Corp-AAR-Policy | ☐ | ☐ Pass ☐ Fail |
| App-Aware Routing | Voice-Video-Priority | ☐ | ☐ Pass ☐ Fail |
| Centralized | Corp-Segmentation | ☐ | ☐ Pass ☐ Fail |
| Security | UTD-Enterprise | ☐ | ☐ Pass ☐ Fail |

---

## Automation Validation Checklist

### AUTO-001: API Validation

| # | Validation Item | Expected Result | Status | Notes |
|---|-----------------|-----------------|--------|-------|
| 1 | API authentication | Token generated | ☐ Pass ☐ Fail | |
| 2 | Device query | Inventory returned | ☐ Pass ☐ Fail | |
| 3 | Template operations | CRUD working | ☐ Pass ☐ Fail | |
| 4 | Policy operations | Deploy/activate | ☐ Pass ☐ Fail | |
| 5 | Monitoring APIs | Statistics returned | ☐ Pass ☐ Fail | |

**API Test Script:**

```python
#!/usr/bin/env python3
"""Lab API Validation Script"""

import requests
import urllib3
urllib3.disable_warnings()

VMANAGE = "192.168.1.10"
USERNAME = "admin"
PASSWORD = "admin"

def validate_api():
    """Validate vManage API endpoints"""
    session = requests.Session()
    
    # Test 1: Authentication
    print("Test 1: API Authentication... ", end="")
    auth_url = f"https://{VMANAGE}/j_security_check"
    auth_data = {"j_username": USERNAME, "j_password": PASSWORD}
    resp = session.post(auth_url, data=auth_data, verify=False)
    
    token_url = f"https://{VMANAGE}/dataservice/client/token"
    token_resp = session.get(token_url, verify=False)
    if token_resp.status_code == 200:
        print("PASS")
        session.headers["X-XSRF-TOKEN"] = token_resp.text
    else:
        print("FAIL")
        return
    
    # Test 2: Device Inventory
    print("Test 2: Device Inventory... ", end="")
    devices_url = f"https://{VMANAGE}/dataservice/device"
    resp = session.get(devices_url, verify=False)
    if resp.status_code == 200 and resp.json().get("data"):
        print(f"PASS ({len(resp.json()['data'])} devices)")
    else:
        print("FAIL")
    
    # Test 3: Template List
    print("Test 3: Template List... ", end="")
    templates_url = f"https://{VMANAGE}/dataservice/template/device"
    resp = session.get(templates_url, verify=False)
    if resp.status_code == 200:
        print(f"PASS ({len(resp.json().get('data', []))} templates)")
    else:
        print("FAIL")
    
    # Test 4: Policy List
    print("Test 4: Policy List... ", end="")
    policy_url = f"https://{VMANAGE}/dataservice/template/policy/vsmart"
    resp = session.get(policy_url, verify=False)
    if resp.status_code == 200:
        print(f"PASS ({len(resp.json().get('data', []))} policies)")
    else:
        print("FAIL")
    
    print("\nAPI Validation Complete")

if __name__ == "__main__":
    validate_api()
```

### AUTO-002: Ansible Validation

| # | Playbook | Purpose | Status | Notes |
|---|----------|---------|--------|-------|
| 1 | device_health.yml | Health check | ☐ Pass ☐ Fail | |
| 2 | backup_config.yml | Configuration backup | ☐ Pass ☐ Fail | |
| 3 | deploy_template.yml | Template deployment | ☐ Pass ☐ Fail | |
| 4 | upgrade_device.yml | Software upgrade | ☐ Pass ☐ Fail | |

---

## Documentation Validation Checklist

### DOC-001: Runbook Validation

| # | Runbook | Tested By Operations | Status | Notes |
|---|---------|----------------------|--------|-------|
| 1 | Day-1 deployment | ☐ | ☐ Pass ☐ Fail | |
| 2 | Troubleshooting guide | ☐ | ☐ Pass ☐ Fail | |
| 3 | Failover procedures | ☐ | ☐ Pass ☐ Fail | |
| 4 | Rollback procedures | ☐ | ☐ Pass ☐ Fail | |
| 5 | Upgrade procedures | ☐ | ☐ Pass ☐ Fail | |
| 6 | Backup/restore | ☐ | ☐ Pass ☐ Fail | |

### DOC-002: Diagram Validation

| # | Diagram | Accurate | Status | Notes |
|---|---------|----------|--------|-------|
| 1 | Physical topology | ☐ | ☐ Pass ☐ Fail | |
| 2 | Logical topology | ☐ | ☐ Pass ☐ Fail | |
| 3 | IP addressing | ☐ | ☐ Pass ☐ Fail | |
| 4 | VLAN/VRF mapping | ☐ | ☐ Pass ☐ Fail | |
| 5 | Traffic flows | ☐ | ☐ Pass ☐ Fail | |

---

## Lab Exit Criteria

### Critical Items (Must Pass 100%)

| # | Critical Item | Status |
|---|---------------|--------|
| 1 | Controller cluster healthy | ☐ Pass ☐ Fail |
| 2 | All WAN Edges online | ☐ Pass ☐ Fail |
| 3 | All tunnels established | ☐ Pass ☐ Fail |
| 4 | SD-Access handoff working | ☐ Pass ☐ Fail |
| 5 | BGP peering established | ☐ Pass ☐ Fail |
| 6 | SGT propagation verified | ☐ Pass ☐ Fail |
| 7 | VPN segmentation enforced | ☐ Pass ☐ Fail |
| 8 | HA failover tested | ☐ Pass ☐ Fail |
| 9 | Rollback procedure validated | ☐ Pass ☐ Fail |
| 10 | Monitoring/alerting functional | ☐ Pass ☐ Fail |

### Overall Pass Rate

```
LAB VALIDATION SUMMARY
======================

Total Items: _______
Passed: _______
Failed: _______
N/A: _______

Pass Rate: _______%

Critical Items: 10
Critical Passed: _______

Exit Criteria Met: ☐ Yes ☐ No

If No, Blocking Issues:
1. _______________________________
2. _______________________________
3. _______________________________
```

---

## Sign-Off

### Lab Validation Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Network Architect | | | |
| Network Engineer | | | |
| Test Lead | | | |
| Security Engineer | | | |
| Operations Lead | | | |

### Approval for Production

| Approver | Name | Signature | Date |
|----------|------|-----------|------|
| IT Director | | | |
| Network Manager | | | |
| Security Manager | | | |

---

## Appendix: Lab Validation Scripts

### Complete Lab Validation Script

```python
#!/usr/bin/env python3
"""
Comprehensive Lab Validation Script
Abhavtech SD-WAN Lab Validation
"""

import requests
import json
import time
from datetime import datetime
import urllib3
urllib3.disable_warnings()

class LabValidator:
    """SD-WAN Lab Validation Class"""
    
    def __init__(self, vmanage_ip, username, password):
        self.vmanage = vmanage_ip
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "tests": [],
            "summary": {}
        }
    
    def authenticate(self):
        """Authenticate to vManage"""
        auth_url = f"https://{self.vmanage}/j_security_check"
        auth_data = {"j_username": self.username, "j_password": self.password}
        self.session.post(auth_url, data=auth_data, verify=False)
        
        token_url = f"https://{self.vmanage}/dataservice/client/token"
        token_resp = self.session.get(token_url, verify=False)
        if token_resp.status_code == 200:
            self.session.headers["X-XSRF-TOKEN"] = token_resp.text
            return True
        return False
    
    def add_result(self, category, test_name, passed, details=""):
        """Add test result"""
        self.results["tests"].append({
            "category": category,
            "test": test_name,
            "passed": passed,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
    
    def validate_controllers(self):
        """Validate controller health"""
        print("\n=== Controller Validation ===")
        
        # Check vManage cluster
        url = f"https://{self.vmanage}/dataservice/clusterManagement/list"
        resp = self.session.get(url, verify=False)
        if resp.status_code == 200:
            data = resp.json().get("data", [])
            healthy = all(node.get("configState") == "in-sync" for node in data)
            self.add_result("Control Plane", "vManage Cluster Health", healthy, 
                          f"{len(data)} nodes")
            print(f"  vManage Cluster: {'PASS' if healthy else 'FAIL'}")
        
        # Check control connections
        url = f"https://{self.vmanage}/dataservice/device/control/connections"
        resp = self.session.get(url, verify=False)
        if resp.status_code == 200:
            connections = resp.json().get("data", [])
            self.add_result("Control Plane", "Control Connections", 
                          len(connections) > 0, f"{len(connections)} connections")
            print(f"  Control Connections: {len(connections)}")
    
    def validate_devices(self):
        """Validate device status"""
        print("\n=== Device Validation ===")
        
        url = f"https://{self.vmanage}/dataservice/device"
        resp = self.session.get(url, verify=False)
        if resp.status_code == 200:
            devices = resp.json().get("data", [])
            reachable = sum(1 for d in devices if d.get("reachability") == "reachable")
            self.add_result("Devices", "Device Reachability", 
                          reachable == len(devices),
                          f"{reachable}/{len(devices)} reachable")
            print(f"  Devices Reachable: {reachable}/{len(devices)}")
    
    def validate_tunnels(self):
        """Validate tunnel status"""
        print("\n=== Tunnel Validation ===")
        
        url = f"https://{self.vmanage}/dataservice/device/tunnel"
        resp = self.session.get(url, verify=False)
        if resp.status_code == 200:
            tunnels = resp.json().get("data", [])
            up_tunnels = sum(1 for t in tunnels if t.get("state") == "up")
            self.add_result("Data Plane", "Tunnel Status",
                          up_tunnels == len(tunnels),
                          f"{up_tunnels}/{len(tunnels)} up")
            print(f"  Tunnels Up: {up_tunnels}/{len(tunnels)}")
    
    def validate_bfd(self):
        """Validate BFD sessions"""
        print("\n=== BFD Validation ===")
        
        url = f"https://{self.vmanage}/dataservice/device/bfd/sessions"
        resp = self.session.get(url, verify=False)
        if resp.status_code == 200:
            sessions = resp.json().get("data", [])
            up_sessions = sum(1 for s in sessions if s.get("state") == "up")
            self.add_result("Data Plane", "BFD Sessions",
                          up_sessions == len(sessions),
                          f"{up_sessions}/{len(sessions)} up")
            print(f"  BFD Sessions Up: {up_sessions}/{len(sessions)}")
    
    def validate_omp(self):
        """Validate OMP peers"""
        print("\n=== OMP Validation ===")
        
        url = f"https://{self.vmanage}/dataservice/device/omp/peers"
        resp = self.session.get(url, verify=False)
        if resp.status_code == 200:
            peers = resp.json().get("data", [])
            up_peers = sum(1 for p in peers if p.get("state") == "up")
            self.add_result("Control Plane", "OMP Peers",
                          up_peers == len(peers),
                          f"{up_peers}/{len(peers)} up")
            print(f"  OMP Peers Up: {up_peers}/{len(peers)}")
    
    def generate_report(self):
        """Generate validation report"""
        passed = sum(1 for t in self.results["tests"] if t["passed"])
        total = len(self.results["tests"])
        
        self.results["summary"] = {
            "total_tests": total,
            "passed": passed,
            "failed": total - passed,
            "pass_rate": round(passed / total * 100, 1) if total > 0 else 0
        }
        
        print("\n" + "=" * 50)
        print("LAB VALIDATION SUMMARY")
        print("=" * 50)
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Pass Rate: {self.results['summary']['pass_rate']}%")
        print("=" * 50)
        
        # Save report
        with open("lab_validation_report.json", "w") as f:
            json.dump(self.results, f, indent=2)
        print("\nReport saved to: lab_validation_report.json")
    
    def run_validation(self):
        """Run complete validation"""
        print("=" * 50)
        print("ABHAVTECH SD-WAN LAB VALIDATION")
        print(f"Timestamp: {datetime.now().isoformat()}")
        print("=" * 50)
        
        if not self.authenticate():
            print("ERROR: Authentication failed")
            return
        
        self.validate_controllers()
        self.validate_devices()
        self.validate_tunnels()
        self.validate_bfd()
        self.validate_omp()
        self.generate_report()


if __name__ == "__main__":
    validator = LabValidator(
        vmanage_ip="192.168.1.10",
        username="admin",
        password="admin"
    )
    validator.run_validation()
```

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| Detailed Test Cases | Individual test procedures | Section 5.19 |
| Testing & Validation | Test strategy | Section 5.14 |
| Go-Live Cutover Runbook | Production deployment | Section 5.15 |
| Rollback Procedures | Recovery procedures | Section 5.16 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Implementation & Deployment documentation series for Abhavtech.com*
