# 4.12 Policy Troubleshooting & Validation

## Document Information
- **Version:** 1.0
- **Last Updated:** December 2025
- **Author:** Abhavtech Network Engineering
- **Status:** Production Ready

## Overview

This section provides comprehensive troubleshooting methodologies and validation procedures for SD-WAN policies in the Abhavtech deployment. Proper policy validation ensures traffic flows correctly, SLA objectives are met, and security requirements are enforced across all 9 sites.

## Policy Troubleshooting Framework

### Troubleshooting Methodology

```
+------------------------------------------------------------------+
|                 POLICY TROUBLESHOOTING WORKFLOW                   |
+------------------------------------------------------------------+
|                                                                   |
|   [1] IDENTIFY    --> [2] ISOLATE    --> [3] ANALYZE             |
|   Problem Area        Policy Type        Root Cause              |
|        |                  |                   |                   |
|        v                  v                   v                   |
|   +----------+      +----------+       +----------+              |
|   | Symptom  |      | Control  |       | Config   |              |
|   | Analysis |      | Data     |       | Error    |              |
|   |          |      | App-Route|       | Sequence |              |
|   +----------+      | ACL      |       | Match    |              |
|        |            +----------+       +----------+              |
|        |                  |                   |                   |
|        v                  v                   v                   |
|   [4] VALIDATE   --> [5] REMEDIATE  --> [6] VERIFY               |
|   Policy State       Apply Fix          Confirm Fix              |
|                                                                   |
+------------------------------------------------------------------+
```

### Common Policy Issues Matrix

| Symptom | Likely Policy Type | Diagnostic Commands | Common Causes |
|---------|-------------------|---------------------|---------------|
| Traffic not steering | Data Policy | `show policy from-vsmart`, `show sdwan policy data-policy` | Match criteria, missing app list |
| SLA failures | App-Route | `show app-route statistics`, `show bfd sessions` | BFD threshold, incorrect SLA class |
| Routes missing | Control Policy | `show omp routes`, `show sdwan policy control-policy` | Export filter, sequence order |
| ACL blocking | Access List | `show access-lists`, `show policy-firewall` | Implicit deny, wrong direction |
| Service chain failure | Data Policy | `show sdwan policy service-chain`, `show track` | Tracker down, fallback missing |
| DIA not working | Data Policy + NAT | `show ip nat translations`, `show sdwan policy dia` | NAT pool, service VPN route |

## Control Policy Troubleshooting

### OMP Route Validation

```
! Verify OMP adjacency status
show sdwan omp summary

! Check OMP routes received
show sdwan omp routes

! Verify routes for specific VPN
show sdwan omp routes vpn 10

! Check TLOC routes
show sdwan omp tlocs

! Verify service routes
show sdwan omp services

! Check policy from vSmart
show policy from-vsmart
```

### Control Policy Debug Output Analysis

```
! Enable OMP debugging (use cautiously in production)
debug sdwan omp route

! Sample debug output analysis:
! OMP Route Received:
!   VPN: 10
!   Prefix: 10.10.0.0/16
!   Origin: vSmart
!   Originator: 10.0.0.1
!   Preference: 200
!   TLOC: 10.0.0.1:mpls:ipsec
!   Status: INSTALLED

! If route not installed, check:
! 1. Preference value (higher wins)
! 2. TLOC availability
! 3. Control policy filtering
```

### Control Policy Verification Commands

```
! Verify control policy on vSmart
vSmart# show running-config policy control-policy

! Check policy application
vSmart# show sdwan policy access-lists

! Verify route filtering results
vSmart# show omp routes vpn 10 detail

! Check topology groups
vSmart# show sdwan policy topology
```

### Control Policy Issue Resolution

| Issue | Diagnostic | Resolution |
|-------|-----------|------------|
| Routes not advertised | `show omp routes` shows empty | Check `export` direction in policy, verify sequence match |
| Wrong TLOC preference | Traffic on wrong transport | Verify `set tloc-list` or `set preference` action |
| Hub routes missing at branch | `show omp routes vpn X` empty | Check hub-and-spoke policy, verify site-list |
| Route loop detected | Ping shows asymmetric path | Verify `reject` action for specific routes |
| Affinity group not working | Traffic not staying regional | Check `set affinity-group` preference order |

## Data Policy Troubleshooting

### Data Policy Verification

```
! View active data policies
show sdwan policy data-policy from-vsmart

! Check data policy statistics
show sdwan policy data-policy-stats

! Verify policy application direction
show sdwan policy access-lists

! Check specific VPN data policy
show sdwan policy data-policy vpn 10

! Verify NAT translations for DIA
show ip nat translations verbose

! Check service chain status
show sdwan policy service-chain
```

### Traffic Steering Validation

```
! Verify application recognition
show sdwan app-route stats

! Check app-aware routing statistics
show sdwan app-route sla-class

! Verify traffic matches policy
show policy-map interface GigabitEthernet0/0/1

! Check DSCP marking
show sdwan policy access-lists counters

! Verify tunnel selection
show sdwan tunnel statistics
```

### Data Policy Debug Methodology

```
! Step 1: Verify traffic classification
show sdwan app-route stats | include <app-name>

! Step 2: Check SLA class assignment
show sdwan policy app-route-policy from-vsmart

! Step 3: Verify tunnel selection
show sdwan bfd sessions

! Step 4: Confirm traffic path
traceroute vrf 10 <destination> source <source>

! Step 5: Check counters
show sdwan policy data-policy-stats | include <sequence>
```

### Common Data Policy Issues

| Symptom | Root Cause | Solution |
|---------|-----------|----------|
| Traffic not matching | App-list mismatch | Verify NBAR2 app name, check custom app signature |
| Wrong tunnel selected | SLA class not applied | Verify app-route policy association |
| DIA traffic going to hub | Missing local internet breakout | Add `action accept nat pool` and service VPN route |
| Service chain bypassed | Tracker reports down | Verify endpoint tracker, check service node health |
| Duplicate packets | FEC or duplication enabled | Verify loss compensation settings, check bandwidth |

## Application-Aware Routing Troubleshooting

### SLA Monitoring Validation

```
! Check BFD session status
show sdwan bfd sessions

! Verify BFD timers
show sdwan bfd sessions | include Interval

! Check SLA metrics per tunnel
show sdwan app-route statistics

! Output example:
! TUNNEL              LATENCY   LOSS    JITTER
! mpls-10.0.0.1       45ms      0.1%    12ms
! internet-10.0.0.1   65ms      0.5%    25ms
! lte-10.0.0.1        120ms     1.2%    45ms

! Verify SLA class thresholds
show sdwan policy sla-class

! Check tunnel colors
show sdwan control connections
```

### AAR Policy Validation Matrix

| Check Point | Command | Expected Result |
|-------------|---------|-----------------|
| BFD Sessions | `show sdwan bfd sessions` | All tunnels UP |
| SLA Metrics | `show sdwan app-route stats` | Within threshold |
| App Recognition | `show sdwan app-route stats` | Apps classified |
| Policy Applied | `show policy from-vsmart` | Policy present |
| Traffic Path | `show sdwan tunnel stats` | Correct tunnel used |

### SLA Failure Troubleshooting

```
! When SLA fails:

! Step 1: Check which SLA class failed
show sdwan app-route sla-class name Realtime-SLA

! Step 2: Verify current metrics
show sdwan app-route statistics detail

! Step 3: Check failover behavior
show sdwan policy app-route-policy from-vsmart

! Step 4: Verify backup path availability
show sdwan bfd sessions

! Step 5: Check if traffic moved to backup
show sdwan tunnel statistics | include packets
```

## ACL Troubleshooting

### ACL Verification Commands

```
! View configured ACLs
show access-lists

! Check ACL statistics/counters
show access-lists counters

! Verify interface ACL application
show ip interface brief | include ACL

! Check implicit vs explicit ACL
show sdwan running-config access-list

! Verify ACL hit counts
show access-lists <acl-name> | include matches
```

### ACL Order of Operations

```
+------------------------------------------------------------------+
|                    ACL PROCESSING ORDER                           |
+------------------------------------------------------------------+
|                                                                   |
|   [1] Implicit SD-WAN ACLs (Control Plane Protection)            |
|        |                                                          |
|        v                                                          |
|   [2] Zone-Based Firewall (If Configured)                        |
|        |                                                          |
|        v                                                          |
|   [3] Interface ACLs (Explicit)                                  |
|        |                                                          |
|        v                                                          |
|   [4] Centralized Data Policy                                    |
|        |                                                          |
|        v                                                          |
|   [5] Default Action (Permit or Deny)                            |
|                                                                   |
+------------------------------------------------------------------+
```

### ACL Debug Commands

```
! Enable ACL debugging (use cautiously)
debug ip packet detail

! Log ACL matches (recommended method)
ip access-list extended VPN10-SECURITY-ACL
  10 permit tcp 10.10.0.0 0.0.255.255 any eq 443 log
  20 permit tcp 10.10.0.0 0.0.255.255 any eq 80 log
  30 deny ip any any log

! Check syslog for ACL hits
show logging | include VPN10-SECURITY-ACL
```

## Service Chain Troubleshooting

### Service Chain Validation

```
! Verify service chain configuration
show sdwan policy service-chain

! Check service node availability
show sdwan policy service-chain service FW-CHAIN

! Verify endpoint tracker status
show track

! Output example:
! Track 1
!   Reachability is Up
!   2 changes, last change 00:15:32
!   Latest operation return code: OK
!   Latest RTT (millisecs) 5

! Check service route in OMP
show sdwan omp services

! Verify traffic through service chain
show sdwan policy data-policy-stats | include service
```

### Service Chain Failure Scenarios

| Failure Type | Detection | Behavior |
|--------------|-----------|----------|
| Primary service down | Tracker probe fails | Fallback to backup service |
| All services down | All trackers fail | Bypass (if configured) or drop |
| Service timeout | No response within timer | Retry then failover |
| Network partition | BFD session loss | Reroute through available path |

### Service Chain Debug

```
! Verify service insertion path
! Traffic flow: Client --> WAN Edge --> FW --> WAN Edge --> Server

! Step 1: Check service advertisement
show sdwan omp services vpn 10

! Step 2: Verify service route learned
show ip route vrf 10 | include SDW

! Step 3: Check service chain policy match
show sdwan policy data-policy-stats | include chain

! Step 4: Verify packet counters on service node
show interface GigabitEthernet0/0/2 | include packets

! Step 5: Check return path
show sdwan tunnel statistics | include service
```

## DIA and NAT Troubleshooting

### DIA Validation

```
! Verify NAT configuration
show ip nat statistics

! Check NAT translations
show ip nat translations verbose

! Verify service VPN route
show ip route vrf 10 0.0.0.0

! Check DIA path selection
show sdwan policy data-policy-stats | include nat

! Verify Umbrella SIG tunnel (if used)
show tunnel interface Tunnel100

! Check split-tunnel policy
show sdwan policy data-policy from-vsmart | include local-internet
```

### DIA Issues and Resolution

| Issue | Diagnostic | Resolution |
|-------|-----------|------------|
| DIA not working | `show ip nat translations` empty | Verify NAT pool, check inside/outside interfaces |
| DNS not resolving | `nslookup` fails | Check Umbrella DNS (208.67.222.222), verify DNS redirect |
| SaaS slow via DIA | High latency to SaaS | Enable Cloud OnRamp for SaaS |
| DIA security bypass | Traffic not through SIG | Verify GRE/IPsec tunnel to Umbrella, check policy |
| NAT exhaustion | Connection failures | Increase NAT pool size, check PAT overload |

### SIG Tunnel Troubleshooting

```
! Verify Umbrella SIG tunnel status
show crypto ipsec sa | include Umbrella

! Check tunnel interface
show interface Tunnel100

! Verify routing through tunnel
show ip route vrf 10 | include Tunnel100

! Check Umbrella registration
show sdwan umbrella device-registration

! Verify DNS redirect
show ip name-server vrf 10
```

## QoS Policy Troubleshooting

### QoS Verification

```
! Check QoS policy application
show policy-map interface GigabitEthernet0/0/1

! Verify DSCP marking
show class-map

! Check queue statistics
show policy-map interface GigabitEthernet0/0/1 output

! Output example:
! Class-map: VOICE-QUEUE (match-any)
!   48234 packets, 4823400 bytes
!   5 minute offered rate 256000 bps
!   Match: dscp ef
!   Queue: priority percent 20
!   No packet drops

! Verify shaping rate
show policy-map interface GigabitEthernet0/0/1 | include shape
```

### QoS Issue Resolution

| Symptom | Diagnostic | Resolution |
|---------|-----------|------------|
| Voice quality poor | Check drops in queue stats | Increase priority queue percentage |
| Bandwidth not enforced | Verify shaping rate | Check interface bandwidth statement |
| Wrong DSCP marking | `show policy-map` | Verify match criteria in class-map |
| Queue starvation | Check fair-queue stats | Adjust bandwidth percentages |

## Validation Test Procedures

### Pre-Production Validation Checklist

```
+------------------------------------------------------------------+
|              POLICY VALIDATION CHECKLIST                          |
+------------------------------------------------------------------+

CONTROL POLICY VALIDATION
[ ] OMP adjacencies established with vSmart
[ ] All expected routes present per VPN
[ ] TLOC preferences correctly set
[ ] Hub-and-spoke topology working
[ ] Route leaking between VPNs functional
[ ] Failover preference (Mumbai > Chennai) verified

DATA POLICY VALIDATION
[ ] Application recognition working (NBAR2)
[ ] Traffic steering to correct tunnels
[ ] DIA breakout functional
[ ] Service chain insertion working
[ ] NAT translations active
[ ] Split-tunneling policies applied

APP-ROUTE VALIDATION
[ ] BFD sessions established all tunnels
[ ] SLA metrics within threshold
[ ] Failover behavior correct
[ ] Load balancing working
[ ] Backup path activation tested

ACL VALIDATION
[ ] VPN isolation enforced
[ ] Inter-VPN traffic controlled
[ ] PCI compliance (VPN 100) verified
[ ] Guest isolation (VPN 20) tested
[ ] ACL counters incrementing correctly

QoS VALIDATION
[ ] Voice traffic prioritized (EF)
[ ] Video traffic marked (AF41)
[ ] Bandwidth limits enforced
[ ] Queue statistics healthy
[ ] No packet drops in priority queue
```

### Automated Validation Script

```python
#!/usr/bin/env python3
"""
SD-WAN Policy Validation Script
Abhavtech.com - Production Validation
"""

import requests
import json
from datetime import datetime

class SDWANPolicyValidator:
    def __init__(self, manager_ip, username, password):
        self.base_url = f"https://{manager_ip}:8443"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
    
    def authenticate(self, username, password):
        """Authenticate to SD-WAN Manager"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {"j_username": username, "j_password": password}
        response = self.session.post(auth_url, data=payload)
        
        # Get CSRF token
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        self.csrf_token = token_response.text
        self.session.headers.update({"X-XSRF-TOKEN": self.csrf_token})
    
    def validate_omp_routes(self, vpn_id):
        """Validate OMP routes for VPN"""
        url = f"{self.base_url}/dataservice/device/omp/routes?vpn-id={vpn_id}"
        response = self.session.get(url)
        routes = response.json().get("data", [])
        
        result = {
            "vpn": vpn_id,
            "route_count": len(routes),
            "status": "PASS" if len(routes) > 0 else "FAIL"
        }
        return result
    
    def validate_bfd_sessions(self, device_ip):
        """Validate BFD sessions on device"""
        url = f"{self.base_url}/dataservice/device/bfd/sessions?deviceId={device_ip}"
        response = self.session.get(url)
        sessions = response.json().get("data", [])
        
        up_sessions = [s for s in sessions if s.get("state") == "up"]
        result = {
            "device": device_ip,
            "total_sessions": len(sessions),
            "up_sessions": len(up_sessions),
            "status": "PASS" if len(up_sessions) == len(sessions) else "WARN"
        }
        return result
    
    def validate_sla_metrics(self, device_ip):
        """Validate SLA metrics within threshold"""
        url = f"{self.base_url}/dataservice/device/app-route/statistics?deviceId={device_ip}"
        response = self.session.get(url)
        stats = response.json().get("data", [])
        
        sla_violations = []
        for tunnel in stats:
            latency = tunnel.get("latency", 0)
            loss = tunnel.get("loss", 0)
            jitter = tunnel.get("jitter", 0)
            
            # Check against Realtime SLA (most stringent)
            if latency > 150 or loss > 1 or jitter > 30:
                sla_violations.append({
                    "tunnel": tunnel.get("remote-system-ip"),
                    "latency": latency,
                    "loss": loss,
                    "jitter": jitter
                })
        
        result = {
            "device": device_ip,
            "tunnels_checked": len(stats),
            "sla_violations": sla_violations,
            "status": "PASS" if len(sla_violations) == 0 else "FAIL"
        }
        return result
    
    def validate_data_policy(self, device_ip):
        """Validate data policy application"""
        url = f"{self.base_url}/dataservice/device/policy/data?deviceId={device_ip}"
        response = self.session.get(url)
        policies = response.json().get("data", [])
        
        result = {
            "device": device_ip,
            "policies_applied": len(policies),
            "status": "PASS" if len(policies) > 0 else "WARN"
        }
        return result
    
    def run_full_validation(self, devices, vpns):
        """Run complete validation suite"""
        results = {
            "timestamp": datetime.now().isoformat(),
            "omp_validation": [],
            "bfd_validation": [],
            "sla_validation": [],
            "policy_validation": []
        }
        
        # Validate OMP routes per VPN
        for vpn in vpns:
            results["omp_validation"].append(
                self.validate_omp_routes(vpn)
            )
        
        # Validate per device
        for device in devices:
            results["bfd_validation"].append(
                self.validate_bfd_sessions(device)
            )
            results["sla_validation"].append(
                self.validate_sla_metrics(device)
            )
            results["policy_validation"].append(
                self.validate_data_policy(device)
            )
        
        # Calculate overall status
        all_results = (
            results["omp_validation"] +
            results["bfd_validation"] +
            results["sla_validation"] +
            results["policy_validation"]
        )
        
        failures = [r for r in all_results if r.get("status") == "FAIL"]
        warnings = [r for r in all_results if r.get("status") == "WARN"]
        
        results["summary"] = {
            "total_checks": len(all_results),
            "passed": len([r for r in all_results if r.get("status") == "PASS"]),
            "warnings": len(warnings),
            "failures": len(failures),
            "overall_status": "PASS" if len(failures) == 0 else "FAIL"
        }
        
        return results


# Abhavtech validation configuration
if __name__ == "__main__":
    # Initialize validator
    validator = SDWANPolicyValidator(
        manager_ip="10.0.1.10",
        username="admin",
        password="<secure_password>"
    )
    
    # Define devices and VPNs
    wan_edges = [
        "10.0.0.1",   # Mumbai Hub 1
        "10.0.0.2",   # Mumbai Hub 2
        "10.0.0.11",  # Chennai Hub 1
        "10.0.0.12",  # Chennai Hub 2
        "10.0.0.21",  # Bangalore
        "10.0.0.22",  # Delhi
        "10.0.0.23",  # Noida
        "10.0.0.31",  # London
        "10.0.0.32",  # Frankfurt
        "10.0.0.41",  # New Jersey
        "10.0.0.42"   # Dallas
    ]
    
    vpn_ids = [10, 20, 30, 40, 50, 100]  # All service VPNs
    
    # Run validation
    results = validator.run_full_validation(wan_edges, vpn_ids)
    
    # Output results
    print(json.dumps(results, indent=2))
    
    # Generate report
    print("\n" + "="*60)
    print("POLICY VALIDATION SUMMARY")
    print("="*60)
    print(f"Timestamp: {results['timestamp']}")
    print(f"Total Checks: {results['summary']['total_checks']}")
    print(f"Passed: {results['summary']['passed']}")
    print(f"Warnings: {results['summary']['warnings']}")
    print(f"Failures: {results['summary']['failures']}")
    print(f"Overall Status: {results['summary']['overall_status']}")
    print("="*60)
```

### Per-VPN Validation Tests

| VPN | Test Case | Validation Method | Expected Result |
|-----|-----------|-------------------|-----------------|
| 10 (Corp) | App routing | Generate ERP traffic | Routes via MPLS primary |
| 10 (Corp) | SaaS breakout | Access Office 365 | DIA with SIG |
| 10 (Corp) | Failover | Disable MPLS | Fails to Internet |
| 20 (Guest) | Isolation | Ping corporate | Blocked |
| 20 (Guest) | Internet | Access website | Allowed via DIA |
| 30 (IoT) | Cloud access | Connect to IoT platform | Allowed specific IPs |
| 30 (IoT) | Lateral | Ping other VPNs | Blocked |
| 40 (Voice) | Priority | Generate call during congestion | No drops |
| 40 (Voice) | SLA | Measure latency/jitter | <150ms/<30ms |
| 50 (Shared) | Route leak | Ping from VPN 10 | Reachable |
| 100 (PCI) | FW chain | Access PCI app | Through firewall |
| 100 (PCI) | DIA block | Access internet | Blocked |

## Production Monitoring Integration

### Policy Health Dashboard Metrics

```
+------------------------------------------------------------------+
|              POLICY MONITORING DASHBOARD                          |
+------------------------------------------------------------------+

REAL-TIME METRICS TO MONITOR:
┌────────────────────────────────────────────────────────────────┐
│  OMP Route Health                                              │
│  ├── Routes per VPN (expected vs actual)                       │
│  ├── Route age (new routes, withdrawn routes)                  │
│  └── Route preference changes                                  │
├────────────────────────────────────────────────────────────────┤
│  BFD/SLA Metrics                                               │
│  ├── Latency per tunnel (real-time graph)                      │
│  ├── Loss percentage per tunnel                                │
│  ├── Jitter per tunnel                                         │
│  └── SLA violations (count, duration)                          │
├────────────────────────────────────────────────────────────────┤
│  Data Policy Statistics                                        │
│  ├── Policy hit counts (per sequence)                          │
│  ├── NAT translations (active, peak)                           │
│  ├── Service chain utilization                                 │
│  └── DIA traffic volume                                        │
├────────────────────────────────────────────────────────────────┤
│  ACL Statistics                                                │
│  ├── Permit/deny counts per ACL                                │
│  ├── Top blocked sources                                       │
│  └── Security violations                                       │
└────────────────────────────────────────────────────────────────┘
```

### Alert Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| SLA Latency | >100ms | >150ms | Check path, failover |
| SLA Loss | >0.5% | >1% | Enable FEC, check circuit |
| SLA Jitter | >20ms | >30ms | Check QoS, congestion |
| Route Count Delta | >10% | >25% | Check control policy |
| Policy Hit = 0 | 1 hour | 4 hours | Verify policy match |
| NAT Exhaustion | >80% | >95% | Increase pool, investigate |
| BFD Session Down | 1 tunnel | >1 tunnel | Immediate investigation |

### SNMP OIDs for Policy Monitoring

```
! Cisco SD-WAN MIB OIDs for policy monitoring

! OMP route count
csdwanOmpRouteCnt OBJECT-TYPE
    SYNTAX      Gauge32
    OID: 1.3.6.1.4.1.9.9.888.1.1.1

! BFD session state
csdwanBfdSessionState OBJECT-TYPE
    SYNTAX      INTEGER {up(1), down(2)}
    OID: 1.3.6.1.4.1.9.9.888.1.2.1

! SLA class violation count
csdwanSlaViolationCnt OBJECT-TYPE
    SYNTAX      Counter64
    OID: 1.3.6.1.4.1.9.9.888.1.3.1

! Data policy hit count
csdwanDataPolicyHits OBJECT-TYPE
    SYNTAX      Counter64
    OID: 1.3.6.1.4.1.9.9.888.1.4.1
```

## Troubleshooting Runbook

### Runbook: Traffic Not Following Expected Path

```
RUNBOOK: TRAFFIC PATH DEVIATION
================================

SYMPTOMS:
- Traffic using wrong transport (e.g., Internet instead of MPLS)
- Higher latency than expected
- Users reporting slow application response

DIAGNOSTIC STEPS:

Step 1: Verify current traffic path
$ traceroute vrf 10 <destination>
$ show sdwan tunnel statistics

Step 2: Check BFD session status
$ show sdwan bfd sessions
└── Expected: All sessions UP
└── If DOWN: Check circuit status, firewall rules

Step 3: Verify SLA metrics
$ show sdwan app-route statistics
└── Compare metrics against SLA class thresholds
└── If exceeded: Path should have failed over

Step 4: Check app-route policy
$ show policy from-vsmart | include app-route
└── Verify application matches expected SLA class

Step 5: Verify control policy
$ show sdwan omp routes vpn 10 detail
└── Check TLOC preference values
└── Verify correct path has higher preference

RESOLUTION:
- If SLA metrics OK but wrong path: Check control policy sequence
- If SLA failed but no failover: Verify fallback configured
- If app not recognized: Check custom app signature

ESCALATION:
- If unresolved after 30 minutes: Engage TAC
- Collect: show tech-support sdwan
```

### Runbook: Service Chain Failure

```
RUNBOOK: SERVICE CHAIN NOT WORKING
===================================

SYMPTOMS:
- Traffic bypassing firewall
- Service node showing as down
- Security policy violations

DIAGNOSTIC STEPS:

Step 1: Check endpoint tracker status
$ show track
└── Expected: All trackers UP
└── If DOWN: Service node unreachable

Step 2: Verify service advertisement
$ show sdwan omp services vpn 10
└── Expected: Service routes present
└── If missing: Check service configuration

Step 3: Check data policy for service chain
$ show sdwan policy service-chain
└── Verify chain configuration
└── Check fallback action

Step 4: Verify physical connectivity
$ ping vrf 10 <service-node-inside-ip>
$ ping vrf 10 <service-node-outside-ip>

Step 5: Check service node health
$ show interface <service-inside-interface>
└── Verify packets incrementing

RESOLUTION:
- If tracker down: Check service node, restore service
- If no service route: Reconfigure service, re-advertise
- If packets not incrementing: Check VLAN, L2 connectivity

ESCALATION:
- Security incident if traffic bypassing: Notify SOC
- Service node failure: Engage service vendor
```

## Best Practices Summary

### Policy Design Best Practices

| Area | Best Practice | Rationale |
|------|--------------|-----------|
| Control Policy | Always test in lab first | Prevent route black holes |
| Control Policy | Use specific site-lists | Avoid unintended matches |
| Data Policy | Start with logging | Verify matches before enforce |
| Data Policy | Include fallback actions | Ensure traffic flows on failure |
| App-Route | Define multiple SLA classes | Appropriate thresholds per app |
| App-Route | Configure backup paths | Ensure redundancy |
| ACL | Use explicit permit/deny | Avoid implicit deny surprises |
| QoS | Monitor queue drops | Adjust percentages proactively |
| Service Chain | Always configure tracker | Detect service failures |
| DIA | Implement SIG for security | Don't expose direct internet |

### Troubleshooting Best Practices

1. **Start with verification commands** before enabling debug
2. **Check policy sequence order** - first match wins
3. **Verify application recognition** before blaming policy
4. **Use logging/counters** to confirm policy hits
5. **Test in lab** before production changes
6. **Document changes** in change management system
7. **Have rollback plan** ready before policy changes
8. **Monitor for 30 minutes** after policy activation

## References

- Cisco SD-WAN Troubleshooting Guide
- Cisco SD-WAN Policy Design Guide
- Cisco SD-WAN Application-Aware Routing Guide
- Abhavtech SD-WAN Operations Playbook
- Cisco TAC SD-WAN Troubleshooting Articles

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*Abhavtech.com SD-WAN Documentation*
*Confidential - Internal Use Only*
