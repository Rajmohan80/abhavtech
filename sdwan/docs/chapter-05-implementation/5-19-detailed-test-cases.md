# 5.19 Detailed Test Cases

## Document Information

| Field | Value |
|-------|-------|
| Document Title | Detailed Test Cases |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Abhavtech |
| Classification | Internal Use |
| Target Audience | Test Engineers, Network Engineers, QA Teams |

---

## Overview

This section provides 60+ detailed test cases for validating the Abhavtech SD-WAN deployment. Each test case includes clear pass/fail criteria, step-by-step procedures, and expected results.

### Test Case Categories

```
TEST CASE ORGANIZATION
======================

1. Control Plane Tests (TC-CP-001 to TC-CP-012)
   - Controller connectivity
   - Certificate validation
   - OMP peering

2. Data Plane Tests (TC-DP-001 to TC-DP-015)
   - Tunnel establishment
   - BFD sessions
   - Traffic forwarding

3. SD-Access Integration Tests (TC-SA-001 to TC-SA-010)
   - Fabric handoff
   - BGP peering
   - SGT propagation

4. Application Performance Tests (TC-AP-001 to TC-AP-010)
   - AAR functionality
   - SLA metrics
   - QoS enforcement

5. Security Tests (TC-SEC-001 to TC-SEC-008)
   - Segmentation
   - Firewall policies
   - Encryption

6. High Availability Tests (TC-HA-001 to TC-HA-008)
   - Failover scenarios
   - Redundancy validation
   - Recovery procedures

7. Operations Tests (TC-OPS-001 to TC-OPS-007)
   - Monitoring
   - Alerting
   - Reporting
```

---

## Control Plane Test Cases

### TC-CP-001: vManage Cluster Health

| Field | Value |
|-------|-------|
| **Test ID** | TC-CP-001 |
| **Test Name** | vManage Cluster Health Validation |
| **Priority** | Critical |
| **Category** | Control Plane |
| **Prerequisites** | vManage cluster deployed |

**Test Steps:**

1. SSH to vManage primary node
2. Execute: `show cluster-management status`
3. Verify all nodes show "healthy" status
4. Execute: `show cluster-management services`
5. Verify all services running on all nodes
6. Check cluster database sync: `request nms cluster database-status`

**Expected Results:**
- All 3 cluster nodes healthy
- Configuration DB synchronized
- Statistics DB synchronized
- All services running

**Pass Criteria:**
```
☐ All nodes showing "healthy"
☐ Database sync status: "in-sync"
☐ No service failures
☐ Cluster leadership established
```

**Fail Criteria:**
- Any node showing "unhealthy"
- Database out of sync
- Services not running
- Split-brain condition

---

### TC-CP-002: vSmart Controller Connectivity

| Field | Value |
|-------|-------|
| **Test ID** | TC-CP-002 |
| **Test Name** | vSmart Control Connections |
| **Priority** | Critical |
| **Category** | Control Plane |
| **Prerequisites** | vSmart controllers deployed |

**Test Steps:**

1. SSH to each vSmart controller
2. Execute: `show control connections`
3. Verify connections to vManage and vBond
4. Execute: `show omp peers`
5. Verify OMP peers from all WAN Edges
6. Execute: `show omp routes`
7. Verify route table populated

**Expected Results:**
- vSmart connected to vManage (state: up)
- vSmart connected to vBond (state: up)
- OMP peers established with all WAN Edges
- Routes received from all sites

**Pass Criteria:**
```
☐ vManage connection: UP
☐ vBond connection: UP
☐ OMP peers >= 12 (all WAN Edges)
☐ OMP routes > 0
```

---

### TC-CP-003: WAN Edge Control Connections

| Field | Value |
|-------|-------|
| **Test ID** | TC-CP-003 |
| **Test Name** | WAN Edge Control Plane Validation |
| **Priority** | Critical |
| **Category** | Control Plane |
| **Prerequisites** | WAN Edges onboarded |

**Test Steps:**

1. SSH to WAN Edge router
2. Execute: `show sdwan control connections`
3. Verify connections to all controllers
4. Execute: `show sdwan control local-properties`
5. Verify correct system-ip, site-id, organization
6. Execute: `show sdwan certificate installed`
7. Verify valid certificates

**Expected Results:**
- Connection to vManage: state up
- Connection to vSmart (2 controllers): state up
- Connection to vBond: state up
- Certificate valid and not expired

**Pass Criteria:**
```
☐ vManage connection: UP
☐ vSmart-1 connection: UP
☐ vSmart-2 connection: UP
☐ vBond connection: UP
☐ Certificate expiry > 30 days
```

---

### TC-CP-004: OMP Route Propagation

| Field | Value |
|-------|-------|
| **Test ID** | TC-CP-004 |
| **Test Name** | OMP Route Advertisement and Receipt |
| **Priority** | High |
| **Category** | Control Plane |
| **Prerequisites** | All WAN Edges connected to vSmart |

**Test Steps:**

1. On Mumbai WAN Edge, verify advertised routes: `show sdwan omp routes advertised`
2. On Chennai WAN Edge, verify received routes: `show sdwan omp routes vpn 10`
3. Verify routes from Mumbai are present in Chennai
4. On vSmart, verify route table: `show omp routes`
5. Verify all site routes present

**Expected Results:**
- Mumbai routes advertised to vSmart
- vSmart propagates routes to Chennai
- Chennai receives Mumbai routes
- Route attributes correct (preference, site-id)

**Pass Criteria:**
```
☐ Mumbai VPN 10 subnets visible on Chennai
☐ Route preference matches design
☐ Site-ID correctly populated
☐ No route loops detected
```

---

### TC-CP-005: Certificate Chain Validation

| Field | Value |
|-------|-------|
| **Test ID** | TC-CP-005 |
| **Test Name** | Certificate Chain Integrity |
| **Priority** | High |
| **Category** | Control Plane |
| **Prerequisites** | Certificates deployed |

**Test Steps:**

1. On vManage: `show certificate installed`
2. Verify root CA, intermediate, and device certificates
3. On WAN Edge: `show sdwan certificate root-ca-chain`
4. Verify chain matches vManage
5. Verify certificate validity dates
6. Test certificate revocation check

**Expected Results:**
- Complete certificate chain on all devices
- Certificates not expired
- Certificates from same root CA
- CRL/OCSP checking functional

**Pass Criteria:**
```
☐ Root CA certificate present
☐ Device certificate present
☐ Certificate chain validates
☐ Expiry date > 90 days
```

---

### TC-CP-006: Template Synchronization

| Field | Value |
|-------|-------|
| **Test ID** | TC-CP-006 |
| **Test Name** | Device Template Sync Status |
| **Priority** | High |
| **Category** | Control Plane |
| **Prerequisites** | Templates attached to devices |

**Test Steps:**

1. In vManage GUI, navigate to Configuration > Devices
2. Verify all devices show "In Sync" status
3. Select a device and view template status
4. Compare running config with intended config
5. Execute: `show sdwan running-config | compare`

**Expected Results:**
- All devices showing "In Sync"
- No configuration drift detected
- Template values correctly applied
- Variables resolved correctly

**Pass Criteria:**
```
☐ All devices: "In Sync"
☐ No "Out of Sync" devices
☐ Config comparison: no differences
☐ All variables resolved
```

---

### TC-CP-007: vBond Orchestrator Function

| Field | Value |
|-------|-------|
| **Test ID** | TC-CP-007 |
| **Test Name** | vBond NAT Traversal and Discovery |
| **Priority** | High |
| **Category** | Control Plane |
| **Prerequisites** | vBond accessible from Internet |

**Test Steps:**

1. SSH to vBond: `show orchestrator connections`
2. Verify connections from vManage and vSmart
3. Verify WAN Edge STUN/NAT mappings
4. From branch WAN Edge behind NAT, verify discovery
5. Check NAT detection: `show sdwan control local-properties | include nat`

**Expected Results:**
- vBond shows connections from all controllers
- NAT type correctly detected (symmetric/cone)
- STUN mappings present for NAT devices
- WAN Edge discovers vBond through NAT

**Pass Criteria:**
```
☐ vManage connection on vBond: UP
☐ vSmart connections on vBond: UP
☐ NAT type detected correctly
☐ STUN mappings functional
```

---

### TC-CP-008: Multi-Region Control Plane

| Field | Value |
|-------|-------|
| **Test ID** | TC-CP-008 |
| **Test Name** | MRF Region Controller Distribution |
| **Priority** | Medium |
| **Category** | Control Plane |
| **Prerequisites** | MRF enabled |

**Test Steps:**

1. Verify region assignment: `show sdwan control local-properties`
2. Verify primary/secondary region
3. Check OMP affinity: `show sdwan omp summary`
4. Verify transport gateway configuration
5. Test inter-region route propagation

**Expected Results:**
- Sites assigned to correct regions
- Primary region controller preferred
- Inter-region routes via transport gateway
- Region failover functional

**Pass Criteria:**
```
☐ Region assignment correct
☐ Primary vSmart preferred
☐ Transport gateway routes visible
☐ Inter-region latency acceptable
```

---

### TC-CP-009 to TC-CP-012: Additional Control Plane Tests

```
TC-CP-009: Policy Distribution
- Verify control/data policies pushed to vSmart
- Verify policy applied to OMP routes
- Pass: Policies active on vSmart, routes modified per policy

TC-CP-010: Control Plane Scaling
- Verify controller handles 100+ tunnels
- Monitor CPU/memory during scale test
- Pass: No performance degradation, all connections stable

TC-CP-011: Control Plane Recovery
- Simulate vSmart failure
- Verify WAN Edge fails over to secondary
- Pass: Failover < 30 seconds, no traffic loss

TC-CP-012: Clock Synchronization
- Verify NTP sync on all controllers
- Check time drift between nodes
- Pass: All nodes synced, drift < 1 second
```

---

## Data Plane Test Cases

### TC-DP-001: IPsec Tunnel Establishment

| Field | Value |
|-------|-------|
| **Test ID** | TC-DP-001 |
| **Test Name** | IPsec Tunnel Formation |
| **Priority** | Critical |
| **Category** | Data Plane |
| **Prerequisites** | WAN Edges onboarded |

**Test Steps:**

1. On Mumbai WAN Edge: `show sdwan bfd sessions`
2. Verify BFD sessions to all remote sites
3. Execute: `show sdwan tunnel statistics`
4. Verify tunnel up time and packet counts
5. Execute: `show crypto ipsec sa`
6. Verify IPsec security associations

**Expected Results:**
- BFD sessions established to all sites
- IPsec tunnels UP
- Packets transmitted/received
- No decrypt failures

**Pass Criteria:**
```
☐ BFD sessions: state UP for all sites
☐ IPsec SA: active for all tunnels
☐ Tunnel uptime > 0
☐ Decrypt errors: 0
```

---

### TC-DP-002: ECMP Load Balancing

| Field | Value |
|-------|-------|
| **Test ID** | TC-DP-002 |
| **Test Name** | Equal-Cost Multi-Path Forwarding |
| **Priority** | High |
| **Category** | Data Plane |
| **Prerequisites** | Multiple transports configured |

**Test Steps:**

1. Generate traffic between Mumbai and Chennai
2. Monitor tunnel statistics on both transports
3. Execute: `show sdwan policy service-path`
4. Verify traffic distributed across transports
5. Calculate load distribution percentage

**Expected Results:**
- Traffic uses both MPLS and Internet transports
- Distribution approximately 50/50
- Per-flow load balancing observed
- No single transport overloaded

**Pass Criteria:**
```
☐ MPLS tunnel traffic > 0
☐ Internet tunnel traffic > 0
☐ Distribution variance < 20%
☐ Per-flow hashing consistent
```

---

### TC-DP-003: VPN Segmentation

| Field | Value |
|-------|-------|
| **Test ID** | TC-DP-003 |
| **Test Name** | VPN Traffic Isolation |
| **Priority** | Critical |
| **Category** | Data Plane |
| **Prerequisites** | Multiple VPNs configured |

**Test Steps:**

1. From VPN 10 host, ping VPN 20 host (should fail)
2. From VPN 10 host, ping VPN 10 remote host (should succeed)
3. Execute: `show ip route vrf 10`
4. Verify no routes from VPN 20 present
5. Repeat for all VPN combinations

**Expected Results:**
- VPN 10 cannot reach VPN 20, 30, 40
- VPN 10 can reach VPN 10 at remote sites
- Route tables isolated per VPN
- No cross-VPN leakage

**Pass Criteria:**
```
☐ Inter-VPN ping: FAIL (expected)
☐ Intra-VPN ping: SUCCESS
☐ Route tables isolated
☐ No route leakage detected
```

---

### TC-DP-004: Traffic Forwarding Verification

| Field | Value |
|-------|-------|
| **Test ID** | TC-DP-004 |
| **Test Name** | End-to-End Traffic Flow |
| **Priority** | Critical |
| **Category** | Data Plane |
| **Prerequisites** | All sites connected |

**Test Steps:**

1. Ping from Mumbai endpoint to Chennai endpoint
2. Trace route to verify path
3. Execute extended ping (1000 packets, size 1500)
4. Verify no packet loss
5. Repeat for all site pairs

**Expected Results:**
- Ping successful between all sites
- Traceroute shows expected path
- 0% packet loss
- Latency within acceptable range

**Pass Criteria:**
```
☐ Ping success rate: 100%
☐ Packet loss: 0%
☐ Latency: < 200ms (India-Americas)
☐ Jitter: < 30ms
```

---

### TC-DP-005: BFD Session Monitoring

| Field | Value |
|-------|-------|
| **Test ID** | TC-DP-005 |
| **Test Name** | BFD Session Stability |
| **Priority** | High |
| **Category** | Data Plane |
| **Prerequisites** | BFD enabled |

**Test Steps:**

1. Execute: `show sdwan bfd sessions`
2. Record BFD session states for all peers
3. Monitor for 1 hour
4. Check for any session flaps
5. Verify BFD timers match design

**Expected Results:**
- All BFD sessions UP
- No flaps during monitoring
- Timers: 1000ms/3 multiplier
- Session uptime stable

**Pass Criteria:**
```
☐ All BFD sessions: UP
☐ Session flaps in 1 hour: 0
☐ BFD timer: 1000/3
☐ Uptime increasing
```

---

### TC-DP-006 to TC-DP-015: Additional Data Plane Tests

```
TC-DP-006: Fragmentation Handling
- Send 1500 byte packets across tunnel
- Verify MTU handling correct
- Pass: No fragmentation issues, PMTUD functional

TC-DP-007: GRE vs IPsec Encapsulation
- Verify encapsulation type per transport
- Pass: MPLS uses GRE, Internet uses IPsec

TC-DP-008: Tunnel Failover
- Disable primary transport
- Verify traffic fails over
- Pass: Failover < 1 second, minimal packet loss

TC-DP-009: NAT Traversal
- Test branch behind NAT
- Verify tunnels establish
- Pass: Tunnels UP, NAT-T enabled

TC-DP-010: Tunnel Statistics
- Verify TX/RX counters incrementing
- Check for errors/drops
- Pass: Counters incrementing, errors = 0

TC-DP-011: Maximum Tunnel Capacity
- Verify hub can handle 100+ tunnels
- Monitor performance
- Pass: All tunnels stable, no degradation

TC-DP-012: DIA (Direct Internet Access)
- Verify guest traffic exits locally
- Pass: Guest traffic not backhauled

TC-DP-013: Multicast Support
- Test multicast application
- Pass: Multicast traffic forwarded

TC-DP-014: QoS Marking Preservation
- Verify DSCP preserved across tunnel
- Pass: Marking unchanged end-to-end

TC-DP-015: Tunnel Interface Bandwidth
- Verify bandwidth configured correctly
- Pass: Bandwidth matches circuit capacity
```

---

## SD-Access Integration Test Cases

### TC-SA-001: BGP Peering Establishment

| Field | Value |
|-------|-------|
| **Test ID** | TC-SA-001 |
| **Test Name** | SD-Access Border BGP Session |
| **Priority** | Critical |
| **Category** | SD-Access Integration |
| **Prerequisites** | Handoff configured |

**Test Steps:**

1. On Border Node: `show bgp vpnv4 unicast all summary`
2. Verify neighbors in Established state
3. On WAN Edge: `show bgp vpnv4 unicast all summary`
4. Verify matching neighbor states
5. Check keepalive/hold timers

**Expected Results:**
- All 5 VRF BGP sessions Established
- Prefixes received from peer
- Timers matching (3/10)
- No BGP notifications

**Pass Criteria:**
```
☐ Corp VRF BGP: Established
☐ Guest VRF BGP: Established
☐ Voice VRF BGP: Established
☐ IoT VRF BGP: Established
☐ Shared VRF BGP: Established
```

---

### TC-SA-002: Route Exchange Verification

| Field | Value |
|-------|-------|
| **Test ID** | TC-SA-002 |
| **Test Name** | Bidirectional Route Advertisement |
| **Priority** | Critical |
| **Category** | SD-Access Integration |
| **Prerequisites** | BGP established |

**Test Steps:**

1. On Border Node: `show bgp vpnv4 unicast vrf Corporate-Data`
2. Verify routes received from WAN Edge (AS 65100)
3. On WAN Edge: `show ip route vrf 10 bgp`
4. Verify routes received from Border (AS 65200)
5. Verify route counts match expected

**Expected Results:**
- Border receives remote site routes from WAN Edge
- WAN Edge receives local fabric routes from Border
- Route attributes correct
- No missing routes

**Pass Criteria:**
```
☐ Border received routes > 0
☐ WAN Edge received routes > 0
☐ Routes match expected subnets
☐ No route filtering issues
```

---

### TC-SA-003: SGT Propagation

| Field | Value |
|-------|-------|
| **Test ID** | TC-SA-003 |
| **Test Name** | TrustSec SGT Inline Tagging |
| **Priority** | High |
| **Category** | SD-Access Integration |
| **Prerequisites** | CTS configured |

**Test Steps:**

1. On Border Node: `show cts interface Te1/0/1.3010`
2. Verify CTS enabled, propagate SGT configured
3. Generate traffic from fabric endpoint with SGT
4. On WAN Edge: `show cts interface Te0/0/0.10`
5. Verify SGT received
6. Execute: `show cts role-based counters`

**Expected Results:**
- CTS enabled on handoff interfaces
- SGT propagated inline
- SGT values preserved end-to-end
- Role-based counters incrementing

**Pass Criteria:**
```
☐ CTS state: enabled on both sides
☐ Propagate SGT: enabled
☐ SGT value: matches source (100, 110, etc.)
☐ Role-based counters: incrementing
```

---

### TC-SA-004: VRF-to-VPN Mapping

| Field | Value |
|-------|-------|
| **Test ID** | TC-SA-004 |
| **Test Name** | VRF to VPN Mapping Verification |
| **Priority** | Critical |
| **Category** | SD-Access Integration |
| **Prerequisites** | Handoff configured |

**Test Steps:**

1. Verify VRF/VPN mapping matches design document
2. From Corporate VN host, traceroute to remote site
3. Verify traffic uses VPN 10 (Corporate VPN)
4. Repeat for Guest (VPN 20), Voice (VPN 30), IoT (VPN 40)
5. Verify no cross-VRF/VPN contamination

**Expected Results:**

| Source VRF | Expected VPN | Handoff VLAN |
|------------|--------------|--------------|
| Corporate-Data | VPN 10 | 3010 |
| Guest-Network | VPN 20 | 3020 |
| Voice-UC | VPN 30 | 3030 |
| IoT-Network | VPN 40 | 3040 |
| Shared-Services | VPN 50 | 3050 |

**Pass Criteria:**
```
☐ Corporate: VRF -> VPN 10 mapping correct
☐ Guest: VRF -> VPN 20 mapping correct
☐ Voice: VRF -> VPN 30 mapping correct
☐ IoT: VRF -> VPN 40 mapping correct
☐ Shared: VRF -> VPN 50 mapping correct
```

---

### TC-SA-005: Fabric to WAN Edge Connectivity

| Field | Value |
|-------|-------|
| **Test ID** | TC-SA-005 |
| **Test Name** | End-to-End Fabric Connectivity via SD-WAN |
| **Priority** | Critical |
| **Category** | SD-Access Integration |
| **Prerequisites** | Full integration complete |

**Test Steps:**

1. From fabric endpoint in Mumbai (10.10.10.100)
2. Ping fabric endpoint in Chennai (10.20.10.100)
3. Traceroute to verify path through SD-WAN overlay
4. Verify SGT preserved (if CTS enabled end-to-end)
5. Repeat for all VN/VRF combinations

**Expected Results:**
- Ping successful across sites
- Path: Fabric -> Border -> WAN Edge -> SD-WAN Tunnel -> Remote WAN Edge -> Remote Border -> Remote Fabric
- Latency acceptable
- No packet loss

**Pass Criteria:**
```
☐ Ping: SUCCESS (0% loss)
☐ Path: via SD-WAN overlay
☐ Latency: < 50ms (India-India)
☐ SGT: preserved (if applicable)
```

---

### TC-SA-006 to TC-SA-010: Additional SD-Access Tests

```
TC-SA-006: Dual-Homed Border Failover
- Simulate border node failure
- Verify traffic fails over to secondary border
- Pass: Failover < 30 seconds

TC-SA-007: LISP-to-BGP Route Redistribution
- Verify LISP routes redistributed to BGP
- Pass: All fabric subnets advertised

TC-SA-008: Handoff Interface Redundancy
- Test with port-channel handoff
- Verify link failover
- Pass: Traffic continues on member failure

TC-SA-009: MTU Across Handoff
- Test jumbo frames (9000 bytes)
- Pass: No fragmentation, MTU matches

TC-SA-010: Catalyst Center API Integration
- Verify DNAC can retrieve SD-WAN info
- Pass: API calls successful, data accurate
```

---

## Application Performance Test Cases

### TC-AP-001: AAR Path Selection

| Field | Value |
|-------|-------|
| **Test ID** | TC-AP-001 |
| **Test Name** | Application-Aware Routing Validation |
| **Priority** | High |
| **Category** | Application Performance |
| **Prerequisites** | AAR policy configured |

**Test Steps:**

1. Verify AAR policy on vSmart: `show running-config policy`
2. Generate SAP traffic (DSCP AF31)
3. Monitor path selection: `show sdwan policy service-path`
4. Verify traffic uses MPLS (preferred for SAP)
5. Degrade MPLS path (add latency)
6. Verify traffic switches to Internet

**Expected Results:**
- SAP traffic prefers MPLS when healthy
- When MPLS latency exceeds SLA, traffic switches
- Switchover transparent to application
- Fallback to original path when SLA recovers

**Pass Criteria:**
```
☐ SAP on MPLS when SLA met
☐ SAP switches when SLA violated
☐ Switchback when SLA recovers
☐ No application errors during switch
```

---

### TC-AP-002: SLA Metric Collection

| Field | Value |
|-------|-------|
| **Test ID** | TC-AP-002 |
| **Test Name** | SLA Monitoring and Reporting |
| **Priority** | High |
| **Category** | Application Performance |
| **Prerequisites** | BFD enabled |

**Test Steps:**

1. Execute: `show sdwan bfd sessions | include loss|latency|jitter`
2. Record current SLA metrics
3. From vManage, view Application Performance dashboard
4. Compare CLI metrics with dashboard
5. Verify historical data available

**Expected Results:**
- BFD collecting latency, loss, jitter
- Metrics visible in vManage
- Historical trending available
- Metrics within acceptable ranges

**Pass Criteria:**
```
☐ Latency metric: collected
☐ Loss metric: collected (should be 0%)
☐ Jitter metric: collected
☐ Dashboard data: accurate
```

---

### TC-AP-003 to TC-AP-010: Additional Application Tests

```
TC-AP-003: Voice Quality (MOS)
- Place test VoIP call across SD-WAN
- Measure MOS score
- Pass: MOS > 4.0

TC-AP-004: Video Conferencing
- Conduct video call (Teams/Webex)
- Verify quality acceptable
- Pass: No freezing, clear audio/video

TC-AP-005: Cloud OnRamp for SaaS
- Access Microsoft 365
- Verify direct path to Microsoft
- Pass: Traffic bypasses hub

TC-AP-006: DRE (Data Redundancy Elimination)
- Transfer large file multiple times
- Verify DRE reduction
- Pass: Subsequent transfers faster

TC-AP-007: FEC (Forward Error Correction)
- Enable FEC for voice traffic
- Introduce packet loss
- Pass: Voice quality maintained

TC-AP-008: Packet Duplication
- Enable duplication for critical app
- Introduce loss
- Pass: Application unaffected

TC-AP-009: TCP Optimization
- Enable TCP optimization
- Measure file transfer performance
- Pass: Transfer speed improved

TC-AP-010: Bandwidth Throttling
- Configure bandwidth limit per app
- Test application adheres to limit
- Pass: Bandwidth enforced
```

---

## Security Test Cases

### TC-SEC-001: IPsec Encryption Verification

| Field | Value |
|-------|-------|
| **Test ID** | TC-SEC-001 |
| **Test Name** | Data Plane Encryption |
| **Priority** | Critical |
| **Category** | Security |
| **Prerequisites** | IPsec tunnels established |

**Test Steps:**

1. Execute: `show crypto ipsec sa`
2. Verify encryption algorithm (AES-256-GCM)
3. Capture traffic on transport interface
4. Verify payload encrypted (Wireshark)
5. Verify no clear-text sensitive data

**Expected Results:**
- IPsec SA active
- AES-256-GCM encryption
- ESP packets on wire
- No plaintext visible in capture

**Pass Criteria:**
```
☐ Encryption: AES-256-GCM
☐ IPsec SA: active
☐ Packet capture: encrypted
☐ No plaintext data visible
```

---

### TC-SEC-002: Zone-Based Firewall

| Field | Value |
|-------|-------|
| **Test ID** | TC-SEC-002 |
| **Test Name** | ZBFW Policy Enforcement |
| **Priority** | High |
| **Category** | Security |
| **Prerequisites** | ZBFW configured |

**Test Steps:**

1. Verify ZBFW policy: `show policy-firewall stats zone-pair`
2. Test allowed traffic (Corporate -> Internet)
3. Test blocked traffic (Guest -> Corporate)
4. Verify counters increment appropriately
5. Review firewall logs

**Expected Results:**
- Allowed traffic passes
- Blocked traffic dropped
- Counters accurate
- Logs capture drops

**Pass Criteria:**
```
☐ Corporate -> Internet: ALLOW
☐ Guest -> Corporate: DROP
☐ Drop counter: incrementing
☐ Logs: capturing drops
```

---

### TC-SEC-003 to TC-SEC-008: Additional Security Tests

```
TC-SEC-003: URL Filtering
- Access blocked category website
- Verify blocked
- Pass: Access denied, logged

TC-SEC-004: IPS/IDS
- Generate known attack signature
- Verify detected/blocked
- Pass: Alert generated, traffic blocked

TC-SEC-005: DNS Security
- Query known malicious domain
- Verify blocked
- Pass: DNS query blocked

TC-SEC-006: TLS Decryption
- Enable TLS decrypt for inspection
- Verify functionality
- Pass: Encrypted traffic inspected

TC-SEC-007: VPN Segmentation Security
- Attempt cross-VPN attack
- Pass: Attack blocked by segmentation

TC-SEC-008: Control Plane Security
- Attempt unauthorized API access
- Pass: Access denied, logged
```

---

## High Availability Test Cases

### TC-HA-001: WAN Edge Failover

| Field | Value |
|-------|-------|
| **Test ID** | TC-HA-001 |
| **Test Name** | Hub Site WAN Edge Failover |
| **Priority** | Critical |
| **Category** | High Availability |
| **Prerequisites** | Dual WAN Edge at hub |

**Test Steps:**

1. Verify both WAN Edges active
2. Start continuous ping from branch to hub
3. Power off primary WAN Edge
4. Measure failover time (ping loss)
5. Verify traffic flows through secondary
6. Restore primary, verify traffic rebalances

**Expected Results:**
- Failover completes < 5 seconds
- Minimal packet loss (< 10 packets)
- Secondary handles all traffic
- Restore causes no outage

**Pass Criteria:**
```
☐ Failover time: < 5 seconds
☐ Packet loss: < 10 packets
☐ Secondary active: confirmed
☐ Restore: seamless
```

---

### TC-HA-002: Transport Failover

| Field | Value |
|-------|-------|
| **Test ID** | TC-HA-002 |
| **Test Name** | Transport Circuit Failover |
| **Priority** | Critical |
| **Category** | High Availability |
| **Prerequisites** | Dual transport configured |

**Test Steps:**

1. Verify traffic flowing on MPLS (primary)
2. Simulate MPLS failure (shutdown interface)
3. Measure failover to Internet
4. Verify BFD detects failure
5. Restore MPLS, verify traffic returns

**Expected Results:**
- BFD detects failure in < 1 second
- Traffic fails over to Internet
- Applications continue functioning
- Failback occurs when MPLS restored

**Pass Criteria:**
```
☐ Detection time: < 1 second
☐ Failover time: < 3 seconds
☐ Application continuity: maintained
☐ Failback: automatic
```

---

### TC-HA-003 to TC-HA-008: Additional HA Tests

```
TC-HA-003: vSmart Controller Failover
- Stop primary vSmart
- Verify WAN Edges fail over
- Pass: Failover < 30 seconds, overlay stable

TC-HA-004: vManage Cluster Node Failure
- Stop one vManage node
- Verify cluster continues
- Pass: Management uninterrupted

TC-HA-005: Site Isolation Recovery
- Simulate complete site isolation
- Restore connectivity
- Pass: Site rejoins overlay automatically

TC-HA-006: BGP Failover (SD-Access)
- Fail primary BGP peer
- Verify traffic uses secondary
- Pass: Failover < 10 seconds

TC-HA-007: Power Failure Simulation
- Simulate power loss at site
- Verify graceful degradation
- Pass: No data corruption, clean recovery

TC-HA-008: DR Site Activation
- Activate Chennai DR
- Verify takes over from Mumbai
- Pass: DR functional within RTO
```

---

## Operations Test Cases

### TC-OPS-001 to TC-OPS-007: Operations Tests

```
TC-OPS-001: Monitoring Dashboard
- Verify all widgets populated
- Pass: Real-time data displayed

TC-OPS-002: Alert Generation
- Trigger test alert condition
- Verify alert received
- Pass: Alert in < 1 minute

TC-OPS-003: SNMP Polling
- Configure SNMP monitoring
- Verify data collected
- Pass: SNMP data in NMS

TC-OPS-004: Syslog Collection
- Verify logs sent to syslog server
- Pass: Logs received, parseable

TC-OPS-005: Configuration Backup
- Trigger manual backup
- Verify backup created
- Pass: Backup file accessible

TC-OPS-006: Software Upgrade
- Stage upgrade on test device
- Execute upgrade
- Pass: Upgrade completes, device operational

TC-OPS-007: API Automation
- Execute automation script
- Verify actions completed
- Pass: Script succeeds, changes applied
```

---

## Test Execution Summary Template

```
SD-WAN TEST EXECUTION SUMMARY
=============================

Test Date: ______________
Test Lead: ______________
Environment: ______________

RESULTS SUMMARY:
┌────────────────────────┬───────┬───────┬───────┬─────────┐
│ Category               │ Total │ Pass  │ Fail  │ Skip    │
├────────────────────────┼───────┼───────┼───────┼─────────┤
│ Control Plane          │ 12    │       │       │         │
│ Data Plane             │ 15    │       │       │         │
│ SD-Access Integration  │ 10    │       │       │         │
│ Application Perf       │ 10    │       │       │         │
│ Security               │ 8     │       │       │         │
│ High Availability      │ 8     │       │       │         │
│ Operations             │ 7     │       │       │         │
├────────────────────────┼───────┼───────┼───────┼─────────┤
│ TOTAL                  │ 70    │       │       │         │
└────────────────────────┴───────┴───────┴───────┴─────────┘

PASS RATE: ____%

FAILED TESTS:
1. _____________ - Reason: _____________
2. _____________ - Reason: _____________

BLOCKERS:
1. _____________

SIGN-OFF:
Test Lead: _____________ Date: _______
Network Lead: _____________ Date: _______
Project Manager: _____________ Date: _______
```

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| Testing & Validation | Test strategy | Section 5.14 |
| Lab Validation Checklist | Pre-production tests | Section 5.20 |
| Troubleshooting Guide | Issue resolution | Chapter 6.8 |
| Operations Runbook | Day-2 procedures | Section 6.13 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Implementation & Deployment documentation series for Abhavtech.com*
