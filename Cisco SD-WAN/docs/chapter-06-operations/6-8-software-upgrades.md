# 6.8 Software Upgrade Procedures

## Document Information
- **Version:** 1.0
- **Last Updated:** December 30, 2025
- **Author:** Abhavtech Network Engineering
- **Status:** Production Ready
- **Classification:** Internal Use

---

## 6.8.1 Upgrade Strategy Overview

### Software Release Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SD-WAN SOFTWARE LIFECYCLE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Release Types:                                                            │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│   │    Standard     │  │    Extended     │  │   Engineering   │           │
│   │   Maintenance   │  │   Maintenance   │  │    Special      │           │
│   ├─────────────────┤  ├─────────────────┤  ├─────────────────┤           │
│   │ • 18-month      │  │ • 36-month      │  │ • Bug fixes     │           │
│   │   support       │  │   support       │  │ • Hot patches   │           │
│   │ • Regular       │  │ • Critical      │  │ • TAC driven    │           │
│   │   updates       │  │   fixes only    │  │                 │           │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘           │
│                                                                             │
│   Current Software Strategy (Abhavtech):                                    │
│   ├── Production: Extended Maintenance (20.15.x / 17.15.x)                 │
│   ├── Staging: N+1 version for testing                                      │
│   └── Lab: Latest for feature evaluation                                    │
│                                                                             │
│   Upgrade Approach:                                                         │
│   ├── Controllers: Rolling upgrade (maintain quorum)                        │
│   ├── WAN Edges: Phased by site type (lab → branch → hub)                  │
│   └── Rollback: Always maintain N-1 version capability                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Current Software Versions

| Component | Current Version | Target Version | Release Type |
|-----------|----------------|----------------|--------------|
| **SD-WAN Manager** | 20.15.1 | 20.15.2 | Extended Maintenance |
| **SD-WAN Controller** | 20.15.1 | 20.15.2 | Extended Maintenance |
| **SD-WAN Validator** | 20.15.1 | 20.15.2 | Extended Maintenance |
| **WAN Edge (C8300)** | 17.15.1 | 17.15.2 | Extended Maintenance |
| **WAN Edge (C8500)** | 17.15.1 | 17.15.2 | Extended Maintenance |

### Upgrade Prerequisites

```yaml
Pre-Upgrade Checklist:

Environment Validation:
  - [ ] Current software version documented
  - [ ] All devices reachable from vManage
  - [ ] No critical alarms active
  - [ ] Control plane healthy
  - [ ] All tunnels operational
  - [ ] SD-Access integration verified

Backup Verification:
  - [ ] vManage database backup (< 24 hours old)
  - [ ] Configuration export complete
  - [ ] Templates exported
  - [ ] Policies exported
  - [ ] Certificates verified

Release Validation:
  - [ ] Release notes reviewed
  - [ ] Known bugs/caveats documented
  - [ ] Compatibility matrix verified
  - [ ] TAC case for known issues (if any)

Resources:
  - [ ] Upgrade window scheduled (Sunday 02:00-06:00 IST)
  - [ ] Change ticket approved
  - [ ] Rollback procedure documented
  - [ ] On-call team notified
  - [ ] Cisco TAC case opened (proactive)
```

---

## 6.8.2 Controller Upgrade Procedures

### vManage Cluster Upgrade

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VMANAGE CLUSTER UPGRADE SEQUENCE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Phase 1: Pre-Upgrade (T-24 hours)                                         │
│   ├── Full backup of all vManage nodes                                     │
│   ├── Verify cluster health                                                 │
│   └── Upload software image                                                 │
│                                                                             │
│   Phase 2: Rolling Upgrade                                                  │
│   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐               │
│   │ vManage-1   │      │ vManage-2   │      │ vManage-3   │               │
│   │ (Upgrade 1) │      │ (Upgrade 2) │      │ (Upgrade 3) │               │
│   │  ~45 min    │──────│  ~45 min    │──────│  ~45 min    │               │
│   └─────────────┘      └─────────────┘      └─────────────┘               │
│                                                                             │
│   Note: Maintain 2/3 nodes operational during upgrade                      │
│                                                                             │
│   Phase 3: Post-Upgrade                                                     │
│   ├── Verify cluster sync                                                   │
│   ├── Test all functions                                                    │
│   └── Monitor for 24 hours                                                  │
│                                                                             │
│   Total Duration: ~3 hours                                                  │
│   Impact: Brief GUI unavailability per node                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### vManage Upgrade Steps

```bash
# === VMANAGE UPGRADE PROCEDURE ===

# Step 1: Pre-Upgrade Checks
# Via API - Check cluster health
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/clusterManagement/list" \
  -H "Cookie: JSESSIONID=${SESSION}"

# Check all nodes are healthy
# Expected: All nodes showing "normal" status

# Step 2: Upload Software Image
# Via vManage GUI: Maintenance > Software Repository > Upload

# Or via API:
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/device/action/software/package" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -F "file=@vmanage-20.15.2-x86_64.tar.gz"

# Step 3: Verify Image Upload
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/device/action/software" \
  -H "Cookie: JSESSIONID=${SESSION}"

# Step 4: Start Rolling Upgrade
# Via vManage GUI: Maintenance > Software Upgrade > vManage
# Select cluster > Upgrade

# Or via API:
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/device/action/install" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d '{
    "action": "install",
    "devices": [{"deviceId": "vmanage-node-1-uuid"}],
    "input": {
      "version": "20.15.2",
      "versionType": "vmanage"
    }
  }'

# Step 5: Monitor Upgrade Progress
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/device/action/status/<action-id>" \
  -H "Cookie: JSESSIONID=${SESSION}"

# Step 6: Verify Each Node After Upgrade
# Check version
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/clusterManagement/list" \
  -H "Cookie: JSESSIONID=${SESSION}"
```

### vSmart Upgrade

```bash
# === VSMART UPGRADE PROCEDURE ===

# Note: Upgrade vSmarts one at a time to maintain OMP connectivity

# Step 1: Pre-Checks
# Verify current vSmart connections from WAN Edges
! On WAN Edge:
show sdwan control connections | include vsmart

# Expected: Connections to both vSmarts (10.0.0.10 and 10.0.0.11)

# Step 2: Upload Image to vSmart
# Via vManage: Maintenance > Software Repository
# Install to vSmart devices

# Step 3: Upgrade First vSmart
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/device/action/install" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d '{
    "action": "install",
    "devices": [{"deviceId": "10.0.0.10"}],
    "input": {
      "version": "20.15.2",
      "versionType": "vsmart"
    }
  }'

# Step 4: Wait for First vSmart to Come Back Online
# Monitor until all WAN Edges reconnect
# Verify on WAN Edges:
show sdwan control connections | include vsmart

# Step 5: Upgrade Second vSmart
# Repeat for 10.0.0.11

# Step 6: Post-Upgrade Verification
# All WAN Edges should have connections to both vSmarts
```

### vBond Upgrade

```bash
# === VBOND UPGRADE PROCEDURE ===

# Note: vBonds are stateless - brief outage is acceptable

# Step 1: Verify Current vBond Connectivity
! On WAN Edge:
show sdwan control connections | include vbond

# Step 2: Upload Image
# Via vManage: Maintenance > Software Repository

# Step 3: Upgrade vBonds (can be parallel if needed)
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/device/action/install" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d '{
    "action": "install",
    "devices": [
      {"deviceId": "vbond-aws-mumbai"},
      {"deviceId": "vbond-aws-singapore"}
    ],
    "input": {
      "version": "20.15.2",
      "versionType": "vbond"
    }
  }'

# Step 4: Verify vBond Services
# Check from WAN Edges that vBond connections restore
```

---

## 6.8.3 WAN Edge Upgrade Procedures

### Upgrade Sequence Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WAN EDGE UPGRADE SEQUENCE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Phase 1: Lab Validation (Week 1)                                          │
│   ├── Lab WAN Edge upgrade                                                  │
│   ├── Functional testing (24-48 hours)                                     │
│   └── Go/No-Go decision                                                    │
│                                                                             │
│   Phase 2: Pilot Sites (Week 2)                                            │
│   ├── One branch site (Noida) - single WAN Edge                            │
│   ├── Monitor for 48 hours                                                 │
│   └── Collect feedback                                                      │
│                                                                             │
│   Phase 3: Branch Rollout (Week 3)                                         │
│   ├── Remaining India branches (Bangalore, Delhi)                          │
│   ├── EMEA/Americas branches (if any)                                      │
│   └── 24-hour stabilization between sites                                  │
│                                                                             │
│   Phase 4: Hub Sites (Week 4)                                              │
│   ├── Secondary hubs (Frankfurt, Dallas)                                   │
│   ├── Regional hubs (London, Chennai)                                      │
│   ├── Primary hubs (Mumbai, New Jersey)                                    │
│   └── Dual WAN Edge sites: Upgrade secondary, then primary                │
│                                                                             │
│   Total Duration: ~4 weeks for full rollout                                │
│   Rollback: Maintain N-1 version ready                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### WAN Edge Upgrade Order

| Phase | Site | Device | Order | Maintenance Window |
|-------|------|--------|-------|-------------------|
| 1 | Lab | Lab-WAN-Edge | 1 | Week 1, Sunday |
| 2 | Noida | IN-NOI-WAN-EDGE-01 | 2 | Week 2, Sunday |
| 3 | Bangalore | IN-BLR-WAN-EDGE-01 | 3 | Week 3, Sunday |
| 3 | Delhi | IN-DEL-WAN-EDGE-01 | 4 | Week 3, Sunday |
| 4 | Frankfurt | DE-FRA-WAN-EDGE-02 | 5 | Week 4, Saturday |
| 4 | Frankfurt | DE-FRA-WAN-EDGE-01 | 6 | Week 4, Saturday |
| 4 | Dallas | US-DAL-WAN-EDGE-02 | 7 | Week 4, Saturday |
| 4 | Dallas | US-DAL-WAN-EDGE-01 | 8 | Week 4, Saturday |
| 4 | London | UK-LON-WAN-EDGE-02 | 9 | Week 4, Sunday |
| 4 | London | UK-LON-WAN-EDGE-01 | 10 | Week 4, Sunday |
| 4 | Chennai | IN-CHE-WAN-EDGE-02 | 11 | Week 4, Sunday |
| 4 | Chennai | IN-CHE-WAN-EDGE-01 | 12 | Week 4, Sunday |
| 4 | New Jersey | US-NJ-WAN-EDGE-02 | 13 | Week 4, Sunday |
| 4 | New Jersey | US-NJ-WAN-EDGE-01 | 14 | Week 4, Sunday |
| 4 | Mumbai | IN-MUM-WAN-EDGE-02 | 15 | Week 4, Sunday |
| 4 | Mumbai | IN-MUM-WAN-EDGE-01 | 16 | Week 4, Sunday |

### Single WAN Edge Upgrade

```bash
# === SINGLE WAN EDGE UPGRADE ===

# Step 1: Pre-Upgrade Verification
! On WAN Edge:
show version
show sdwan control connections
show sdwan tunnel statistics

# Via vManage API - Get current state
DEVICE_IP="10.100.3.1"  # IN-NOI-WAN-EDGE-01
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/device?deviceIP=${DEVICE_IP}" \
  -H "Cookie: JSESSIONID=${SESSION}"

# Step 2: Stage Software Image
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/device/action/image-install" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d '{
    "action": "install",
    "devices": [{"deviceId": "'"${DEVICE_IP}"'"}],
    "input": {
      "versionName": "17.15.2",
      "family": "vedge-cloud"
    }
  }'

# Step 3: Activate New Version (triggers reboot)
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/device/action/changepartition" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d '{
    "action": "changepartition",
    "devices": [{"deviceId": "'"${DEVICE_IP}"'"}],
    "input": {
      "versionName": "17.15.2"
    }
  }'

# Step 4: Monitor Upgrade Progress
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/device/action/status/<action-id>" \
  -H "Cookie: JSESSIONID=${SESSION}"

# Step 5: Post-Upgrade Verification
! On WAN Edge after reboot:
show version
show sdwan control connections
show sdwan tunnel statistics
show sdwan bfd sessions

# Verify software version
# Expected: Cisco IOS XE Software, Version 17.15.2
```

### Dual WAN Edge Upgrade (Hub Sites)

```bash
# === DUAL WAN EDGE UPGRADE (MUMBAI HUB) ===

# Mumbai has 2 WAN Edges:
# IN-MUM-WAN-EDGE-01: 10.100.1.1 (Primary)
# IN-MUM-WAN-EDGE-02: 10.100.1.2 (Secondary)

# Phase A: Upgrade Secondary (IN-MUM-WAN-EDGE-02)

# Step A1: Pre-Check Traffic Distribution
! On IN-MUM-WAN-EDGE-01:
show sdwan app-route stats

# Step A2: Verify Failover Ready
! Confirm primary can handle all traffic
show interface summary | include Up
show platform resources

# Step A3: Upgrade Secondary
DEVICE_IP="10.100.1.2"
# Follow single WAN Edge upgrade procedure

# Step A4: Wait for Secondary to Come Back Online
# Monitor vManage for device to become reachable
# ~5-10 minutes

# Step A5: Verify Secondary Post-Upgrade
! On IN-MUM-WAN-EDGE-02:
show version
show sdwan control connections
show sdwan tunnel statistics

# Step A6: Verify Tunnels Reestablish
show sdwan bfd sessions | count up
# Should match pre-upgrade count

# Step A7: Wait Stabilization Period (30 minutes minimum)

# Phase B: Upgrade Primary (IN-MUM-WAN-EDGE-01)

# Step B1: Verify Secondary Handling Traffic
show sdwan app-route stats

# Step B2: Upgrade Primary
DEVICE_IP="10.100.1.1"
# Follow single WAN Edge upgrade procedure

# Step B3: Monitor Failover to Secondary
# Traffic should automatically shift to secondary during primary reboot

# Step B4: Verify Primary Post-Upgrade
! On IN-MUM-WAN-EDGE-01:
show version
show sdwan control connections

# Step B5: Verify Traffic Rebalance
show sdwan app-route stats
# Traffic should distribute across both WAN Edges
```

---

## 6.8.4 Rollback Procedures

### Controller Rollback

```bash
# === VMANAGE ROLLBACK ===

# If upgrade fails, rollback to previous partition

# Step 1: Check Available Versions
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/device/action/software/images/${VMANAGE_UUID}" \
  -H "Cookie: JSESSIONID=${SESSION}"

# Step 2: Trigger Rollback
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/device/action/changepartition" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d '{
    "action": "changepartition",
    "devices": [{"deviceId": "vmanage-node-uuid"}],
    "input": {
      "versionName": "20.15.1"
    }
  }'

# Step 3: Verify Rollback
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/clusterManagement/list" \
  -H "Cookie: JSESSIONID=${SESSION}"
```

### WAN Edge Rollback

```bash
# === WAN EDGE ROLLBACK ===

# Method 1: Via vManage - Change Partition

# Step 1: Check Available Versions
DEVICE_IP="10.100.1.1"
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/device/action/software?deviceIP=${DEVICE_IP}" \
  -H "Cookie: JSESSIONID=${SESSION}"

# Step 2: Activate Previous Version
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/device/action/changepartition" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d '{
    "action": "changepartition",
    "devices": [{"deviceId": "'"${DEVICE_IP}"'"}],
    "input": {
      "versionName": "17.15.1"
    }
  }'

# Method 2: Via Device CLI

! On WAN Edge:
! Check installed versions
request platform software package list

! Switch to previous version
request platform software package activate switch

! Or specify version
request platform software package activate version 17.15.1

! Verify after reboot
show version
```

### Rollback Decision Criteria

```yaml
Rollback Triggers:

Immediate Rollback (within 15 minutes):
  - Device fails to boot
  - Control connections don't establish
  - More than 50% tunnels remain down
  - Critical functionality broken

Planned Rollback (within 2 hours):
  - Performance degradation >20%
  - Intermittent control plane issues
  - SD-Access integration broken
  - Application SLA violations

Deferred Rollback (within 24 hours):
  - Minor feature regression
  - Non-critical bugs discovered
  - Operational concerns

No Rollback Needed:
  - All validations pass
  - Performance within tolerance
  - No critical issues after 24 hours
```

---

## 6.8.5 Post-Upgrade Validation

### Validation Checklist

```bash
# === POST-UPGRADE VALIDATION SCRIPT ===

#!/bin/bash
# Run after each upgrade

echo "=== SD-WAN POST-UPGRADE VALIDATION ==="
echo "Timestamp: $(date)"
echo "========================================="

# 1. Version Check
echo -e "\n--- Version Verification ---"
show version | include "Cisco IOS XE"

# 2. Control Connections
echo -e "\n--- Control Connections ---"
show sdwan control connections
# Expected: All connections UP

# 3. Tunnels
echo -e "\n--- Tunnel Status ---"
show sdwan tunnel statistics | include "up|down"
# Expected: All tunnels UP

# 4. BFD Sessions
echo -e "\n--- BFD Sessions ---"
show sdwan bfd sessions summary
# Expected: All sessions UP

# 5. OMP Routes
echo -e "\n--- OMP Routes ---"
show sdwan omp summary
# Expected: Routes received = routes installed

# 6. Interface Status
echo -e "\n--- Interface Status ---"
show ip interface brief | exclude unassigned
# Expected: All configured interfaces UP

# 7. Resource Utilization
echo -e "\n--- Resource Utilization ---"
show platform resources
# Expected: CPU <70%, Memory <80%

# 8. Alarms
echo -e "\n--- Active Alarms ---"
show sdwan notification stream viptela | head -20
# Expected: No critical/major alarms

echo -e "\n=== VALIDATION COMPLETE ==="
```

### API-Based Validation

```python
#!/usr/bin/env python3
"""
Post-Upgrade Validation Script
Abhavtech.com - December 2025
"""

import requests
import json
import urllib3
from datetime import datetime

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class UpgradeValidation:
    """Validate SD-WAN post-upgrade"""
    
    def __init__(self, vmanage_host: str, username: str, password: str):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
    
    def authenticate(self, username: str, password: str):
        login_url = f"{self.base_url}/j_security_check"
        self.session.post(login_url, data={'j_username': username, 'j_password': password})
        token_response = self.session.get(f"{self.base_url}/dataservice/client/token")
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
    
    def validate_device(self, device_ip: str) -> dict:
        """Validate single device post-upgrade"""
        results = {
            'device_ip': device_ip,
            'timestamp': datetime.now().isoformat(),
            'checks': [],
            'overall_status': 'PASS'
        }
        
        # Check 1: Device Reachability
        device_url = f"{self.base_url}/dataservice/device?deviceIP={device_ip}"
        device_resp = self.session.get(device_url)
        device_data = device_resp.json().get('data', [{}])[0]
        
        reachability = device_data.get('reachability') == 'reachable'
        results['checks'].append({
            'check': 'Device Reachability',
            'status': 'PASS' if reachability else 'FAIL',
            'detail': device_data.get('reachability')
        })
        
        # Check 2: Control Connections
        control_url = f"{self.base_url}/dataservice/device/control/connections?deviceId={device_ip}"
        control_resp = self.session.get(control_url)
        connections = control_resp.json().get('data', [])
        
        all_up = all(c.get('state') == 'up' for c in connections)
        results['checks'].append({
            'check': 'Control Connections',
            'status': 'PASS' if all_up else 'FAIL',
            'detail': f"{sum(1 for c in connections if c.get('state')=='up')}/{len(connections)} up"
        })
        
        # Check 3: Tunnels
        tunnel_url = f"{self.base_url}/dataservice/device/tunnel?deviceId={device_ip}"
        tunnel_resp = self.session.get(tunnel_url)
        tunnels = tunnel_resp.json().get('data', [])
        
        tunnels_up = sum(1 for t in tunnels if t.get('tunnel-state') == 'up')
        tunnel_status = tunnels_up >= len(tunnels) * 0.95  # Allow 5% down
        results['checks'].append({
            'check': 'Tunnel Status',
            'status': 'PASS' if tunnel_status else 'FAIL',
            'detail': f"{tunnels_up}/{len(tunnels)} up"
        })
        
        # Check 4: BFD Sessions
        bfd_url = f"{self.base_url}/dataservice/device/bfd/sessions?deviceId={device_ip}"
        bfd_resp = self.session.get(bfd_url)
        bfd_sessions = bfd_resp.json().get('data', [])
        
        bfd_up = sum(1 for b in bfd_sessions if b.get('state') == 'up')
        bfd_status = bfd_up >= len(bfd_sessions) * 0.95
        results['checks'].append({
            'check': 'BFD Sessions',
            'status': 'PASS' if bfd_status else 'FAIL',
            'detail': f"{bfd_up}/{len(bfd_sessions)} up"
        })
        
        # Check 5: Software Version
        version = device_data.get('version', 'Unknown')
        version_check = '17.15.2' in version  # Expected version
        results['checks'].append({
            'check': 'Software Version',
            'status': 'PASS' if version_check else 'WARN',
            'detail': version
        })
        
        # Overall status
        failed_checks = [c for c in results['checks'] if c['status'] == 'FAIL']
        if failed_checks:
            results['overall_status'] = 'FAIL'
        
        return results
    
    def validate_all_devices(self) -> dict:
        """Validate all devices"""
        print("=" * 60)
        print("POST-UPGRADE VALIDATION")
        print(f"Timestamp: {datetime.now().isoformat()}")
        print("=" * 60)
        
        # Get all devices
        devices_url = f"{self.base_url}/dataservice/device"
        devices = self.session.get(devices_url).json().get('data', [])
        
        all_results = []
        for device in devices:
            device_ip = device.get('system-ip')
            hostname = device.get('host-name')
            
            print(f"\nValidating {hostname} ({device_ip})...")
            result = self.validate_device(device_ip)
            result['hostname'] = hostname
            all_results.append(result)
            
            # Print results
            for check in result['checks']:
                status_icon = "✓" if check['status'] == 'PASS' else "✗"
                print(f"  {status_icon} {check['check']}: {check['detail']}")
        
        # Summary
        print("\n" + "=" * 60)
        print("VALIDATION SUMMARY")
        passed = sum(1 for r in all_results if r['overall_status'] == 'PASS')
        print(f"Devices Passed: {passed}/{len(all_results)}")
        print("=" * 60)
        
        return {
            'timestamp': datetime.now().isoformat(),
            'total_devices': len(all_results),
            'passed': passed,
            'failed': len(all_results) - passed,
            'details': all_results
        }

def main():
    validator = UpgradeValidation(
        vmanage_host="vmanage.abhavtech.com",
        username="admin",
        password="secure_password"
    )
    results = validator.validate_all_devices()
    
    # Save results
    with open(f"upgrade_validation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", 'w') as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    main()
```

---

## 6.8.6 Upgrade Automation

### Ansible Upgrade Playbook

```yaml
---
# sdwan_upgrade.yml
# SD-WAN Upgrade Automation Playbook
# Abhavtech.com - December 2025

- name: SD-WAN WAN Edge Upgrade
  hosts: localhost
  gather_facts: no
  
  vars:
    vmanage_host: "vmanage.abhavtech.com"
    vmanage_user: "admin"
    vmanage_password: "{{ vault_vmanage_password }}"
    target_version: "17.15.2"
    upgrade_batch_size: 2
    stabilization_delay: 1800  # 30 minutes
    
  tasks:
    - name: Authenticate to vManage
      uri:
        url: "https://{{ vmanage_host }}/j_security_check"
        method: POST
        body_format: form-urlencoded
        body:
          j_username: "{{ vmanage_user }}"
          j_password: "{{ vmanage_password }}"
        validate_certs: no
        status_code: 200
      register: login_response
    
    - name: Get XSRF Token
      uri:
        url: "https://{{ vmanage_host }}/dataservice/client/token"
        method: GET
        headers:
          Cookie: "{{ login_response.cookies_string }}"
        validate_certs: no
      register: token_response
    
    - name: Set Authentication Headers
      set_fact:
        auth_headers:
          Cookie: "{{ login_response.cookies_string }}"
          X-XSRF-TOKEN: "{{ token_response.content }}"
    
    - name: Get WAN Edge Devices
      uri:
        url: "https://{{ vmanage_host }}/dataservice/device"
        method: GET
        headers: "{{ auth_headers }}"
        validate_certs: no
      register: devices_response
    
    - name: Filter WAN Edges for Upgrade
      set_fact:
        wan_edges: "{{ devices_response.json.data | selectattr('personality', 'equalto', 'vedge') | list }}"
    
    - name: Pre-Upgrade Health Check
      include_tasks: tasks/health_check.yml
      loop: "{{ wan_edges }}"
      loop_control:
        loop_var: device
    
    - name: Upgrade WAN Edges in Batches
      include_tasks: tasks/upgrade_device.yml
      loop: "{{ wan_edges | batch(upgrade_batch_size) | list }}"
      loop_control:
        loop_var: batch
        pause: "{{ stabilization_delay }}"
    
    - name: Post-Upgrade Validation
      include_tasks: tasks/post_validation.yml
      loop: "{{ wan_edges }}"
      loop_control:
        loop_var: device
    
    - name: Generate Upgrade Report
      template:
        src: templates/upgrade_report.j2
        dest: "reports/upgrade_report_{{ ansible_date_time.iso8601 }}.html"
```

---

## 6.8.7 Upgrade Schedule

### Standard Upgrade Windows

```yaml
# SD-WAN Upgrade Windows - Abhavtech.com

Standard Maintenance Windows:
  
  Controllers (vManage/vSmart/vBond):
    Primary Window: Sunday 02:00-06:00 IST
    Backup Window: Saturday 02:00-06:00 IST
    Notification: 7 days advance
    Approval: Change Advisory Board
    
  Hub WAN Edges (Mumbai, Chennai, London, NJ):
    Primary Window: Sunday 02:00-06:00 IST
    Backup Window: Saturday 02:00-06:00 IST
    Notification: 5 days advance
    Approval: Network Manager
    
  Branch WAN Edges (Bangalore, Delhi, Noida, Frankfurt, Dallas):
    Primary Window: Saturday 22:00 - Sunday 02:00 local time
    Backup Window: Sunday 22:00 - Monday 02:00 local time
    Notification: 3 days advance
    Approval: Network Team Lead

Emergency Patches:
  Window: Any time with 4-hour notice
  Approval: Network Manager + IT Director
  Notification: Immediate to stakeholders
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 30, 2025 | Abhavtech | Initial upgrade procedures |

---

**Document Classification:** Internal Use
**Next Review Date:** March 30, 2026
