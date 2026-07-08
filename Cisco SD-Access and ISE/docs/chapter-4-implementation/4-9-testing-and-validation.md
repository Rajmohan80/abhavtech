# 4.9 Testing and Validation

### 4.9.1 Test Categories

| Category | Tests | Pass Criteria |
|----------|-------|---------------|
| Infrastructure | DNAC/ISE health, cluster status | All services running |
| Underlay | IS-IS adjacency, BFD, MTU | Full mesh connectivity |
| Overlay | LISP registration, VXLAN tunnels | All nodes registered |
| Authentication | 802.1X, MAB, profiling | 95%+ success rate |
| Segmentation | SGT assignment, SGACL | Correct policy enforcement |
| Wireless | Client association, roaming | <50ms roam time |
| Failover | Node failure, WAN failover | <30 second recovery |

### 4.9.2 Infrastructure Validation

```bash
# DNAC Health Check
curl -k -u admin:<password> \
  https://dnac.corp.local/dna/intent/api/v1/network-health

# Expected response:
{
  "response": {
    "healthScore": 95,
    "totalCount": 854,
    "healthyCount": 850,
    "unhealthyCount": 4
  }
}

# ISE Health Check
# GUI: Operations > System Operations > System Summary
# CLI:
ssh admin@ise-pan-nj.corp.local
show application status ise
# All services should show "running"
```

### 4.9.3 Underlay Validation Tests

```cisco
! Test 1: IS-IS Adjacency Verification
show isis neighbors
! All expected neighbors should show "UP" state

! Test 2: Full Loopback Reachability
! From Border Node:
ping 10.250.1.1 source Loopback0  ! Self
ping 10.250.1.2 source Loopback0  ! Border-2
ping 10.250.1.3 source Loopback0  ! CP-1
ping 10.250.1.4 source Loopback0  ! CP-2
ping 10.250.1.5 source Loopback0  ! Edge-1
! ... continue for all nodes

! Test 3: BFD Session Verification
show bfd neighbors
! All BFD sessions should show "Up"

! Test 4: MTU Verification (jumbo frames)
ping 10.250.1.3 source Loopback0 size 9000 df-bit
! Should succeed (MTU 9100+ required for VXLAN)

! Test 5: Convergence Test
! Shut one uplink and verify reconvergence
interface TenGigabitEthernet1/0/1
 shutdown
! Verify traffic failover within 1 second
! Restore link
 no shutdown
```

### 4.9.4 Overlay Validation Tests

```cisco
! Test 1: LISP Registration
show lisp site
! All edge nodes should be registered

! Test 2: LISP Map-Cache
show lisp instance-id 8001 ipv4 map-cache
! Should show EID-to-RLOC mappings

! Test 3: VXLAN Tunnel Verification
show vxlan tunnel
! All VXLAN tunnels should be "UP"

! Test 4: Anycast Gateway
show ip interface brief | include BDI
! BDI interfaces should be up with anycast IPs

! Test 5: VRF Verification
show vrf
! All VNs should appear as VRFs

! Test 6: Cross-fabric Communication
! From host on Edge-1, ping host on Edge-2
ping 10.100.1.100 source 10.100.1.50
! Should succeed via VXLAN overlay
```

### 4.9.5 Authentication Validation Tests

```bash
# Test 1: 802.1X Authentication
# Connect test laptop with certificate
# On switch:
show authentication sessions interface Gi1/0/10 details
# Should show:
# - Method: dot1x
# - User-Name: user@corp.local
# - SGT: 10 (Employees)

# Test 2: MAB Authentication
# Connect unmanaged device (printer)
show authentication sessions interface Gi1/0/20 details
# Should show:
# - Method: mab
# - MAC: xxxx.xxxx.xxxx
# - SGT: 30 (Printers)

# Test 3: ISE Live Logs
# On ISE: Operations > RADIUS > Live Logs
# Verify successful authentications

# Test 4: Profiling Verification
# On ISE: Context Visibility > Endpoints
# Verify device profiled correctly
```

### 4.9.6 Segmentation Validation Tests

```bash
# Test 1: SGT Assignment Verification
show cts role-based sgt-map all
# Verify IP-to-SGT bindings

# Test 2: SGACL Policy Verification
show cts role-based permissions
# Verify SGACL policies downloaded

# Test 3: Traffic Enforcement
# From Employee (SGT 10) endpoint:
ping <server_ip>        # Should succeed (SGT 80)
ping <guest_endpoint>   # Should fail (SGT 40 blocked)

# Test 4: SXP Verification (if using)
show cts sxp connections
# SXP connections should be "On"
```

### 4.9.7 Wireless Validation Tests

```bash
# Test 1: Client Association
# Connect wireless client to Corp-Secure
show wireless client summary
# Verify client connected and authenticated

# Test 2: SGT Assignment (Wireless)
show wireless client mac-address xxxx.xxxx.xxxx detail | include SGT
# Should show correct SGT

# Test 3: Roaming Test
# Move client between APs
show wireless client mac-address xxxx.xxxx.xxxx mobility history
# Verify roam time <50ms

# Test 4: Fabric Data Path
# Verify traffic uses local switching (not centralized)
show wireless client mac-address xxxx.xxxx.xxxx detail | include Data Path
# Should show "Fabric"
```

### 4.9.8 Failover Validation Tests

```bash
# Test 1: Control Plane Failover
# On CP-1:
reload
# Verify fabric continues to operate via CP-2
# Monitor host connectivity during failover
# Recovery time should be <30 seconds

# Test 2: Border Node Failover
# On Border-1:
reload
# Verify external connectivity via Border-2
# Monitor WAN traffic during failover

# Test 3: PSN Failover
# Shut down PSN-1 in region
# Verify authentications continue via PSN-2
# Check ISE: Operations > RADIUS > Live Logs

# Test 4: WLC HA Failover (if HA pair)
# On Primary WLC:
redundancy force-switchover
# Verify AP and client continuity
# Recovery time should be <60 seconds
```

### 4.9.9 User Acceptance Testing (UAT)

| Test Case | Scenario | Expected Result | Status |
|-----------|----------|-----------------|--------|
| UAT-001 | Employee wired login | Authenticated, SGT 10, full access | [ ] |
| UAT-002 | Employee wireless login | Authenticated, SGT 10, roaming works | [ ] |
| UAT-003 | Guest wireless access | Captive portal, SGT 40, internet only | [ ] |
| UAT-004 | IP phone registration | Profiled, SGT 20, voice quality good | [ ] |
| UAT-005 | Printer discovery | Profiled, SGT 30, printing works | [ ] |
| UAT-006 | IoT device onboarding | MAC auth, SGT 50, limited access | [ ] |
| UAT-007 | Non-compliant device | Quarantine VLAN, SGT 999 | [ ] |
| UAT-008 | Cross-site communication | VXLAN overlay, <100ms latency | [ ] |
| UAT-009 | Application access | All business apps functional | [ ] |
| UAT-010 | Video conferencing | Voice/video quality acceptable | [ ] |

---
