# 4.13 Detailed Test Cases and Validation

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Test Case Framework

### 1.1 Test Categories

| Category | Count | Coverage |
|----------|-------|----------|
| Fabric Connectivity | 15 | Underlay, overlay, LISP, VXLAN |
| Authentication | 12 | 802.1X, MAB, ISE policies |
| Segmentation | 10 | SGT, SGACL, VN isolation |
| Wireless | 10 | AP join, client roaming, SSID |
| High Availability | 8 | Failover, redundancy |
| Integration | 5 | SD-WAN, XDR, SIEM |
| **Total** | **60** | |

### 1.2 Test Result Criteria

```
PASS: Test meets all acceptance criteria
FAIL: Test does not meet criteria (blocks go-live)
CONDITIONAL: Partial pass with documented workaround
SKIP: Test not applicable to this deployment
```

---

## 2. Fabric Connectivity Test Cases

### TC-FC-001: Underlay IS-IS Adjacency

| Field | Details |
|-------|---------|
| **Test ID** | TC-FC-001 |
| **Category** | Fabric Connectivity |
| **Priority** | Critical |
| **Prerequisites** | Underlay deployed, IS-IS configured |

**Test Procedure:**
```
1. SSH to each fabric node (border, CP, edge)
2. Execute: show isis neighbors
3. Verify all expected adjacencies are UP
4. Execute: show isis database
5. Verify LSP count matches expected nodes
```

**Expected Results:**
- All IS-IS adjacencies in UP state
- IS-IS database contains all fabric nodes
- No IS-IS errors in logs

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Border adjacencies | 4 (2 per border) | ___ | ☐ |
| CP adjacencies | 4 (2 per CP) | ___ | ☐ |
| Edge adjacencies | 2+ per edge | ___ | ☐ |
| Convergence time | <5 seconds | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

### TC-FC-002: LISP Control Plane Registration

| Field | Details |
|-------|---------|
| **Test ID** | TC-FC-002 |
| **Category** | Fabric Connectivity |
| **Priority** | Critical |
| **Prerequisites** | Fabric site created, nodes provisioned |

**Test Procedure:**
```
1. SSH to Control Plane node
2. Execute: show lisp site summary
3. Verify all edge nodes registered
4. Execute: show lisp instance-id * ethernet server
5. Verify EID registrations present
```

**Expected Results:**
- All edge nodes registered with CP
- EID count matches connected endpoints
- No registration errors

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Edge registrations | All edges | ___ | ☐ |
| EID count | >0 per VN | ___ | ☐ |
| Registration time | <10 seconds | ___ | ☐ |
| CP redundancy | 2 CP nodes | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

### TC-FC-003: VXLAN Tunnel Verification

| Field | Details |
|-------|---------|
| **Test ID** | TC-FC-003 |
| **Category** | Fabric Connectivity |
| **Priority** | Critical |
| **Prerequisites** | Overlay deployed |

**Test Procedure:**
```
1. SSH to edge node
2. Execute: show nve peers
3. Verify tunnels to all expected peers
4. Execute: show nve vni
5. Verify VNI mappings for all VNs
6. Ping test across VXLAN tunnel
```

**Expected Results:**
- NVE peers established to all fabric nodes
- VNI mappings match Virtual Networks
- Data plane forwarding works

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| NVE peer count | All fabric nodes | ___ | ☐ |
| Tunnel state | UP | ___ | ☐ |
| VNI count | 5 (per VN count) | ___ | ☐ |
| Cross-tunnel ping | Success | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

### TC-FC-004: Border Handoff to External

| Field | Details |
|-------|---------|
| **Test ID** | TC-FC-004 |
| **Category** | Fabric Connectivity |
| **Priority** | High |
| **Prerequisites** | Border nodes configured with external handoff |

**Test Procedure:**
```
1. SSH to border node
2. Execute: show ip route vrf <VN_name>
3. Verify external routes present
4. Execute: show ip bgp summary (if BGP handoff)
5. Test connectivity to external resources
```

**Expected Results:**
- External routes learned via handoff
- BGP sessions established (if used)
- Traffic flows to external destinations

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| External routes | Present | ___ | ☐ |
| BGP state | Established | ___ | ☐ |
| Data center reach | Ping success | ___ | ☐ |
| Internet reach | Ping success | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

## 3. Authentication Test Cases

### TC-AUTH-001: 802.1X Wired Authentication

| Field | Details |
|-------|---------|
| **Test ID** | TC-AUTH-001 |
| **Category** | Authentication |
| **Priority** | Critical |
| **Prerequisites** | ISE deployed, policy configured |

**Test Procedure:**
```
1. Connect test laptop to edge switch port
2. Ensure supplicant configured (EAP-TLS or PEAP)
3. Observe authentication process
4. On switch: show authentication sessions interface <port>
5. On ISE: Check Live Logs for authentication
```

**Expected Results:**
- Authentication succeeds
- Correct VLAN assigned
- Correct SGT assigned
- Session visible in ISE

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Auth result | Success | ___ | ☐ |
| Auth time | <3 seconds | ___ | ☐ |
| VLAN assigned | Correct per policy | ___ | ☐ |
| SGT assigned | Correct per policy | ___ | ☐ |
| ISE log entry | Present | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

### TC-AUTH-002: MAB Authentication

| Field | Details |
|-------|---------|
| **Test ID** | TC-AUTH-002 |
| **Category** | Authentication |
| **Priority** | High |
| **Prerequisites** | MAB policy configured in ISE |

**Test Procedure:**
```
1. Connect device without supplicant (printer, IoT)
2. Wait for MAB timeout (default 90 seconds)
3. Observe MAB authentication
4. Verify device profiled correctly
5. Check VLAN and SGT assignment
```

**Expected Results:**
- MAB authentication succeeds
- Device profiled (if in database)
- Correct VLAN for device type
- SGT matches device profile

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| MAB result | Success | ___ | ☐ |
| Profile detected | Correct type | ___ | ☐ |
| VLAN assigned | Per profile policy | ___ | ☐ |
| SGT assigned | Per profile policy | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

### TC-AUTH-003: Wireless 802.1X (WPA3-Enterprise)

| Field | Details |
|-------|---------|
| **Test ID** | TC-AUTH-003 |
| **Category** | Authentication |
| **Priority** | Critical |
| **Prerequisites** | WLC integrated, WLAN configured |

**Test Procedure:**
```
1. Connect test device to corporate SSID
2. Enter credentials or use certificate
3. Observe authentication in WLC
4. Verify in ISE Live Logs
5. Check client details in Catalyst Center
```

**Expected Results:**
- Wireless authentication succeeds
- Client associates to correct AP
- SGT assigned via ISE
- Client visible in Assurance

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| WLAN auth | Success | ___ | ☐ |
| Auth method | EAP-TLS/PEAP | ___ | ☐ |
| SGT assignment | Correct | ___ | ☐ |
| Assurance visibility | Present | ___ | ☐ |
| Connect time | <5 seconds | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

## 4. Segmentation Test Cases

### TC-SEG-001: SGT Assignment Verification

| Field | Details |
|-------|---------|
| **Test ID** | TC-SEG-001 |
| **Category** | Segmentation |
| **Priority** | Critical |
| **Prerequisites** | TrustSec deployed, SGTs configured |

**Test Procedure:**
```
1. Authenticate test devices from different groups
2. On edge switch: show cts role-based sgt-map all
3. Verify each device has correct SGT
4. On ISE: verify SGT in session details
```

**Expected Results:**
- All devices tagged with correct SGT
- SGT visible on switch
- SGT matches ISE policy

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Employee SGT | 10 | ___ | ☐ |
| Voice SGT | 20 | ___ | ☐ |
| IoT SGT | 40 | ___ | ☐ |
| Guest SGT | 50 | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

### TC-SEG-002: SGACL Enforcement - Permit

| Field | Details |
|-------|---------|
| **Test ID** | TC-SEG-002 |
| **Category** | Segmentation |
| **Priority** | Critical |
| **Prerequisites** | SGACL policies deployed |

**Test Procedure:**
```
1. From Employee device (SGT 10), access allowed resources
2. Test: Ping to data center server
3. Test: HTTP to internal portal
4. Test: SMB to file server
5. On switch: show cts role-based counters
```

**Expected Results:**
- Permitted traffic flows successfully
- Counters increment for permit rules
- No unexpected denies

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| DC ping | Success | ___ | ☐ |
| HTTP access | Success | ___ | ☐ |
| File share | Success | ___ | ☐ |
| Permit counters | Incrementing | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

### TC-SEG-003: SGACL Enforcement - Deny

| Field | Details |
|-------|---------|
| **Test ID** | TC-SEG-003 |
| **Category** | Segmentation |
| **Priority** | Critical |
| **Prerequisites** | SGACL deny policies configured |

**Test Procedure:**
```
1. From Guest device (SGT 50), attempt blocked access
2. Test: Ping to internal servers (expect fail)
3. Test: SSH to network devices (expect fail)
4. Test: Access to corporate VLAN (expect fail)
5. On switch: show cts role-based counters
```

**Expected Results:**
- Denied traffic is blocked
- Deny counters increment
- Only permitted paths work (Internet)

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Internal ping | Blocked | ___ | ☐ |
| SSH to devices | Blocked | ___ | ☐ |
| Corporate access | Blocked | ___ | ☐ |
| Internet access | Permitted | ___ | ☐ |
| Deny counters | Incrementing | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

### TC-SEG-004: VN Isolation

| Field | Details |
|-------|---------|
| **Test ID** | TC-SEG-004 |
| **Category** | Segmentation |
| **Priority** | High |
| **Prerequisites** | Multiple VNs deployed |

**Test Procedure:**
```
1. Connect device to VN_CORPORATE
2. Attempt to reach device in VN_IOT directly
3. Verify routing table shows no cross-VN routes
4. Test via Extranet VN if shared services needed
```

**Expected Results:**
- No direct connectivity between VNs
- VRF isolation maintained
- Only Extranet paths work (if configured)

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| VN_CORP to VN_IOT | Isolated | ___ | ☐ |
| VN_VOICE to VN_GUEST | Isolated | ___ | ☐ |
| VN_CORP to Extranet | Per policy | ___ | ☐ |
| Route leaking | None unexpected | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

## 5. Wireless Test Cases

### TC-WL-001: AP Fabric Join

| Field | Details |
|-------|---------|
| **Test ID** | TC-WL-001 |
| **Category** | Wireless |
| **Priority** | Critical |
| **Prerequisites** | WLC integrated, AP deployed |

**Test Procedure:**
```
1. Power on AP at edge switch port
2. Observe AP boot and CAPWAP join
3. Check WLC: show ap summary
4. Check Catalyst Center: AP visible in inventory
5. Verify AP in fabric mode
```

**Expected Results:**
- AP joins WLC via CAPWAP
- AP registers in fabric
- AP visible in Catalyst Center
- Correct site assignment

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| CAPWAP join | Success | ___ | ☐ |
| Join time | <5 minutes | ___ | ☐ |
| Fabric mode | Enabled | ___ | ☐ |
| Inventory visible | Yes | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

### TC-WL-002: Client Roaming

| Field | Details |
|-------|---------|
| **Test ID** | TC-WL-002 |
| **Category** | Wireless |
| **Priority** | High |
| **Prerequisites** | Multiple APs, client connected |

**Test Procedure:**
```
1. Connect client to AP-1
2. Start continuous ping to gateway
3. Walk to AP-2 coverage area
4. Observe roaming in WLC
5. Count packet loss during roam
```

**Expected Results:**
- Seamless roaming (802.11r/k/v)
- Minimal packet loss (<3 packets)
- SGT maintained after roam
- No reauthentication required

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Roam success | Yes | ___ | ☐ |
| Packet loss | <3 packets | ___ | ☐ |
| Roam time | <50ms | ___ | ☐ |
| SGT maintained | Yes | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

## 6. High Availability Test Cases

### TC-HA-001: ISE PSN Failover

| Field | Details |
|-------|---------|
| **Test ID** | TC-HA-001 |
| **Category** | High Availability |
| **Priority** | Critical |
| **Prerequisites** | Dual PSN configured |

**Test Procedure:**
```
1. Verify both PSNs active (show on F5)
2. Simulate PSN-01 failure (disable interface)
3. Attempt new authentication
4. Verify auth succeeds via PSN-02
5. Measure failover time
6. Re-enable PSN-01
```

**Expected Results:**
- Authentication continues via secondary PSN
- Failover < 30 seconds
- No authentication outage
- Load balancing resumes after recovery

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Failover time | <30 seconds | ___ | ☐ |
| Auth during failover | Success | ___ | ☐ |
| Load balance resume | Yes | ___ | ☐ |
| No user impact | Yes | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

### TC-HA-002: WLC SSO Failover

| Field | Details |
|-------|---------|
| **Test ID** | TC-HA-002 |
| **Category** | High Availability |
| **Priority** | Critical |
| **Prerequisites** | WLC HA SSO configured |

**Test Procedure:**
```
1. Verify WLC HA state (show redundancy summary)
2. Connect test client
3. Force failover (redundancy force-switchover)
4. Monitor client connectivity
5. Verify AP associations maintained
```

**Expected Results:**
- Standby becomes active
- AP associations maintained
- Client connectivity maintained
- Failover < 60 seconds

**Acceptance Criteria:**
| Criteria | Expected | Actual | Pass/Fail |
|----------|----------|--------|-----------|
| Failover time | <60 seconds | ___ | ☐ |
| AP associations | Maintained | ___ | ☐ |
| Client sessions | Maintained | ___ | ☐ |
| Service impact | Minimal | ___ | ☐ |

**Test Result:** ☐ PASS ☐ FAIL ☐ CONDITIONAL
**Tester:** _______________ **Date:** _______________

---

## 7. Test Summary Template

```
╔══════════════════════════════════════════════════════════════════╗
║                    TEST EXECUTION SUMMARY                        ║
╠══════════════════════════════════════════════════════════════════╣
║ Site: ____________________  Date: ____________________          ║
║ Tester: __________________  Reviewer: ___________________       ║
╠══════════════════════════════════════════════════════════════════╣
║ CATEGORY              TOTAL    PASS    FAIL    CONDITIONAL      ║
╠══════════════════════════════════════════════════════════════════╣
║ Fabric Connectivity   15       ____    ____    ____             ║
║ Authentication        12       ____    ____    ____             ║
║ Segmentation          10       ____    ____    ____             ║
║ Wireless              10       ____    ____    ____             ║
║ High Availability     8        ____    ____    ____             ║
║ Integration           5        ____    ____    ____             ║
╠══════════════════════════════════════════════════════════════════╣
║ TOTAL                 60       ____    ____    ____             ║
╠══════════════════════════════════════════════════════════════════╣
║ GO-LIVE RECOMMENDATION: ☐ APPROVED  ☐ NOT APPROVED              ║
║                                                                  ║
║ Comments: ________________________________________________      ║
║ ___________________________________________________________     ║
╚══════════════════════════════════════════════════════════════════╝
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
