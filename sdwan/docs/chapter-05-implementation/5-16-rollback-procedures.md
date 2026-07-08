# 5.16 Rollback Procedures

## Document Information
- **Version**: 1.0
- **Last Updated**: December 2025
- **Author**: Abhavtech Network Engineering
- **Status**: Production Ready
- **Review Cycle**: Per Migration Event

## Table of Contents
1. [Rollback Strategy Overview](#rollback-strategy-overview)
2. [Rollback Decision Criteria](#rollback-decision-criteria)
3. [Rollback Scenarios](#rollback-scenarios)
4. [Detailed Rollback Procedures](#detailed-rollback-procedures)
5. [Rollback Verification](#rollback-verification)
6. [Post-Rollback Activities](#post-rollback-activities)
7. [Rollback Automation Scripts](#rollback-automation-scripts)

---

## Rollback Strategy Overview

### Rollback Philosophy

```
+------------------------------------------------------------------+
|                    ROLLBACK DECISION TREE                         |
+------------------------------------------------------------------+
|                                                                   |
|                      Issue Detected                               |
|                           |                                       |
|                           v                                       |
|                    +-------------+                                |
|                    | Severity?   |                                |
|                    +-------------+                                |
|                     /     |     \                                 |
|                    /      |      \                                |
|                   v       v       v                               |
|              Critical  Major  Minor                               |
|                 |        |       |                                |
|                 v        v       v                                |
|            +---------+  +----+  +------+                          |
|            |Immediate|  |Time|  |Fix    |                         |
|            |Rollback |  |Box |  |Forward|                         |
|            +---------+  +----+  +------+                          |
|                 |        |                                        |
|                 |        v                                        |
|                 |   Fix within    No                              |
|                 |   30 min? -------->  Rollback                   |
|                 |      |                                          |
|                 |     Yes                                         |
|                 |      |                                          |
|                 |      v                                          |
|                 |   Continue                                      |
|                 |                                                 |
|                 v                                                 |
|            Execute Rollback                                       |
|                                                                   |
+------------------------------------------------------------------+
```

### Rollback Types

| Type | Trigger | Scope | Duration | Impact |
|------|---------|-------|----------|--------|
| **Full Rollback** | Complete failure | Entire site | 2-4 hours | Full service restoration |
| **Partial Rollback** | Component failure | Single device/service | 30-60 min | Limited disruption |
| **Configuration Rollback** | Config issue | Template/policy | 15-30 min | Minimal impact |
| **Traffic Rollback** | Performance issue | Routing preference | 5-15 min | No outage |

### Pre-Positioned Rollback Assets

```yaml
# rollback-assets-checklist.yaml
# Required before any cutover

rollback_assets:
  configurations:
    - name: "Pre-cutover router configs"
      location: "flash:pre-cutover-config.txt"
      verified: ""
      
    - name: "SD-Access border configs"
      location: "flash:pre-sdwan-border.txt"
      verified: ""
      
    - name: "vManage configuration backup"
      location: "vManage backup store"
      verified: ""

  connectivity:
    - name: "Console server access"
      verified: ""
      
    - name: "Out-of-band management"
      verified: ""
      
    - name: "Legacy WAN path (active/standby)"
      verified: ""

  documentation:
    - name: "Rollback runbook printed"
      verified: ""
      
    - name: "Emergency contacts list"
      verified: ""
      
    - name: "Vendor TAC case pre-opened"
      verified: ""

  team:
    - name: "Rollback lead identified"
      verified: ""
      
    - name: "All team members briefed"
      verified: ""
```

---

## Rollback Decision Criteria

### Automatic Rollback Triggers

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Control plane down | >10 minutes | Immediate rollback |
| All tunnels down | >5 minutes | Immediate rollback |
| >50% applications unreachable | >15 minutes | Evaluate/rollback |
| Voice quality <3.0 MOS | >10 minutes | Traffic rollback |
| Packet loss >5% | >15 minutes | Evaluate/rollback |
| Cutover window exceeded | 80% elapsed | Mandatory rollback |

### Manual Rollback Triggers

| Condition | Decision Maker | Criteria |
|-----------|----------------|----------|
| Business critical application failure | Business Owner | Any duration |
| Security policy violation | Security Lead | Any duration |
| Unexpected behavior | Cutover Manager | Team consensus |
| Unable to verify success criteria | Validation Lead | Per checkpoint |

### Rollback Authorization Matrix

```
+------------------------------------------------------------------+
|                ROLLBACK AUTHORIZATION LEVELS                      |
+------------------------------------------------------------------+
|                                                                   |
|  Level 1: Configuration Rollback                                  |
|  +----------------------------------------------------------+    |
|  | Authorized By: Network Team Lead                          |    |
|  | Scope: Single device configuration                        |    |
|  | Duration: <30 minutes                                     |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Level 2: Partial Rollback                                        |
|  +----------------------------------------------------------+    |
|  | Authorized By: Cutover Manager                            |    |
|  | Scope: Single site or service                             |    |
|  | Duration: 30-60 minutes                                   |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Level 3: Full Rollback                                           |
|  +----------------------------------------------------------+    |
|  | Authorized By: Cutover Manager + IT Director              |    |
|  | Scope: Entire migration                                   |    |
|  | Duration: 2-4 hours                                       |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Rollback Scenarios

### Scenario 1: Control Plane Failure

```
+------------------------------------------------------------------+
|                SCENARIO 1: CONTROL PLANE FAILURE                  |
+------------------------------------------------------------------+
|                                                                   |
|  Symptoms:                                                        |
|  - WAN Edge cannot reach vBond/vSmart/vManage                    |
|  - OMP peers not established                                      |
|  - No routes received via OMP                                     |
|                                                                   |
|  Root Causes:                                                     |
|  - Certificate issues                                             |
|  - Transport connectivity failure                                 |
|  - Controller overload                                            |
|  - Firewall blocking control ports                                |
|                                                                   |
|  Rollback Action: Configuration Rollback (Level 1)                |
|  - Remove SD-WAN configuration from WAN Edge                      |
|  - Restore legacy routing configuration                           |
|  - Verify legacy WAN connectivity                                 |
|                                                                   |
|  Time to Rollback: 30 minutes                                     |
|                                                                   |
+------------------------------------------------------------------+
```

### Scenario 2: Tunnel Establishment Failure

```
+------------------------------------------------------------------+
|                SCENARIO 2: TUNNEL FAILURE                         |
+------------------------------------------------------------------+
|                                                                   |
|  Symptoms:                                                        |
|  - IPsec tunnels not forming                                      |
|  - BFD sessions down                                              |
|  - No data plane connectivity                                     |
|                                                                   |
|  Root Causes:                                                     |
|  - NAT/firewall blocking IPsec                                    |
|  - MTU issues                                                     |
|  - Transport circuit problems                                     |
|  - Incorrect TLOC configuration                                   |
|                                                                   |
|  Rollback Action: Configuration Rollback (Level 1)                |
|  - Revert transport interface configuration                       |
|  - Re-enable legacy WAN connectivity                              |
|  - Verify end-to-end connectivity                                 |
|                                                                   |
|  Time to Rollback: 30 minutes                                     |
|                                                                   |
+------------------------------------------------------------------+
```

### Scenario 3: SD-Access Handoff Failure

```
+------------------------------------------------------------------+
|                SCENARIO 3: SD-ACCESS HANDOFF FAILURE              |
+------------------------------------------------------------------+
|                                                                   |
|  Symptoms:                                                        |
|  - BGP session not establishing                                   |
|  - No routes from SD-Access                                       |
|  - Fabric users cannot reach branch sites                         |
|                                                                   |
|  Root Causes:                                                     |
|  - VLAN/subinterface mismatch                                     |
|  - BGP AS number incorrect                                        |
|  - IP addressing conflict                                         |
|  - Missing route redistribution                                   |
|                                                                   |
|  Rollback Action: Partial Rollback (Level 2)                      |
|  - Remove handoff configuration from WAN Edge                     |
|  - Remove handoff configuration from border                       |
|  - Restore previous border-to-WAN routing                         |
|  - Verify fabric connectivity via legacy path                     |
|                                                                   |
|  Time to Rollback: 45 minutes                                     |
|                                                                   |
+------------------------------------------------------------------+
```

### Scenario 4: Application Performance Degradation

```
+------------------------------------------------------------------+
|                SCENARIO 4: PERFORMANCE DEGRADATION                |
+------------------------------------------------------------------+
|                                                                   |
|  Symptoms:                                                        |
|  - Application response times increased                           |
|  - Voice quality below acceptable (MOS <4.0)                      |
|  - Packet loss or high latency                                    |
|                                                                   |
|  Root Causes:                                                     |
|  - QoS misconfiguration                                           |
|  - Suboptimal path selection                                      |
|  - Circuit oversubscription                                       |
|  - AAR policy issues                                              |
|                                                                   |
|  Rollback Action: Traffic Rollback                                |
|  - Adjust BGP preference on SD-Access border                      |
|  - Force traffic back to legacy MPLS path                         |
|  - Maintain SD-WAN for non-critical traffic                       |
|                                                                   |
|  Time to Rollback: 15 minutes                                     |
|                                                                   |
+------------------------------------------------------------------+
```

### Scenario 5: Complete Site Failure

```
+------------------------------------------------------------------+
|                SCENARIO 5: COMPLETE SITE FAILURE                  |
+------------------------------------------------------------------+
|                                                                   |
|  Symptoms:                                                        |
|  - Site completely unreachable                                    |
|  - All services impacted                                          |
|  - Multiple component failures                                    |
|                                                                   |
|  Root Causes:                                                     |
|  - Hardware failure                                               |
|  - Power outage                                                   |
|  - Multiple simultaneous failures                                 |
|  - Catastrophic configuration error                               |
|                                                                   |
|  Rollback Action: Full Rollback (Level 3)                         |
|  - Power cycle WAN Edge (if accessible)                           |
|  - Restore pre-cutover configuration                              |
|  - Re-enable all legacy paths                                     |
|  - Full verification of all services                              |
|                                                                   |
|  Time to Rollback: 2-4 hours                                      |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Detailed Rollback Procedures

### Procedure 1: Traffic Rollback (BGP Preference)

```yaml
# rollback-traffic.yaml
# Duration: 15 minutes
# Authorization: Network Team Lead

procedure: "Traffic Rollback - BGP Preference"
duration_minutes: 15
authorization: "Network Team Lead"

steps:
  - step: 1
    time: "T+0"
    duration: 2
    action: "Announce rollback decision"
    command: "Bridge announcement: Initiating traffic rollback"
    verification: "Team acknowledged"
    
  - step: 2
    time: "T+2"
    duration: 5
    action: "Revert BGP preference on SD-Access border"
    device: "SD-Access Border Node"
    command: |
      configure terminal
      !
      ! Remove SD-WAN preference route-map
      no route-map SD-WAN-PREFER
      !
      router bgp 65200
       address-family ipv4 vrf Corporate-Data
        no neighbor 10.100.100.1 route-map SD-WAN-PREFER in
       !
       address-family ipv4 vrf Voice-UC
        no neighbor 10.100.130.1 route-map SD-WAN-PREFER in
      !
      end
      write memory
    verification: |
      show ip bgp vpnv4 vrf Corporate-Data
      ! Verify MPLS routes now preferred
    
  - step: 3
    time: "T+7"
    duration: 3
    action: "Verify traffic shifted to legacy path"
    command: |
      ! On legacy WAN router
      show interface GigabitEthernet0/0/1 | include packets
      ! Verify traffic counters increasing
      
      ! On SD-WAN WAN Edge
      show sdwan app-route statistics
      ! Verify traffic counters decreasing
    verification: "Traffic on legacy path"
    
  - step: 4
    time: "T+10"
    duration: 5
    action: "Verify application connectivity"
    command: |
      ! Test connectivity from fabric to branch
      ping vrf Corporate-Data 10.20.10.100
      
      ! Test application
      curl -I http://erp.abhavtech.com
    verification: "Applications reachable via legacy path"

post_rollback:
  - "Document reason for rollback"
  - "Schedule troubleshooting session"
  - "Keep SD-WAN active for non-production traffic"
```

### Procedure 2: Configuration Rollback (Single Device)

```yaml
# rollback-configuration.yaml
# Duration: 30 minutes
# Authorization: Network Team Lead

procedure: "Configuration Rollback - Single Device"
duration_minutes: 30
authorization: "Network Team Lead"

steps:
  - step: 1
    time: "T+0"
    duration: 2
    action: "Announce rollback decision"
    command: "Bridge announcement: Initiating configuration rollback for [DEVICE]"
    verification: "Team acknowledged"
    
  - step: 2
    time: "T+2"
    duration: 3
    action: "Access device via console"
    command: |
      ! Connect via terminal server
      terminal server connect [PORT]
      ! Or direct console
      screen /dev/ttyUSB0 9600
    verification: "Console access established"
    
  - step: 3
    time: "T+5"
    duration: 10
    action: "Restore pre-cutover configuration"
    device: "WAN Edge Router"
    command: |
      ! Enter enable mode
      enable
      
      ! Verify backup exists
      dir flash: | include pre-cutover
      
      ! Restore configuration
      configure replace flash:pre-cutover-config.txt force
      
      ! If configure replace not available:
      ! copy flash:pre-cutover-config.txt running-config
    verification: |
      show running-config | include hostname
      ! Verify configuration restored
    
  - step: 4
    time: "T+15"
    duration: 5
    action: "Remove SD-WAN configuration (if needed)"
    command: |
      configure terminal
      !
      ! Remove SD-WAN system config
      no system
      !
      ! Remove SD-WAN VPNs
      no vpn 0
      no vpn 10
      no vpn 20
      no vpn 30
      !
      end
      write memory
    verification: "SD-WAN config removed"
    
  - step: 5
    time: "T+20"
    duration: 5
    action: "Re-enable legacy routing"
    command: |
      configure terminal
      !
      ! Re-enable legacy BGP
      router bgp 65000
       no shutdown
       neighbor 10.1.1.1 remote-as 65001
       neighbor 10.1.1.1 activate
      !
      ! Re-enable legacy interfaces
      interface GigabitEthernet0/0/1
       description MPLS-PE
       no shutdown
      !
      end
      write memory
    verification: |
      show ip bgp summary
      ! BGP neighbors established
    
  - step: 6
    time: "T+25"
    duration: 5
    action: "Verify connectivity"
    command: |
      ! Test reachability to remote sites
      ping 10.20.10.1
      ping 10.30.10.1
      
      ! Verify routes
      show ip route summary
    verification: "Connectivity restored"

post_rollback:
  - "Document exact rollback steps taken"
  - "Capture show tech-support for analysis"
  - "Update change record"
```

### Procedure 3: SD-Access Handoff Rollback

```yaml
# rollback-sdaccess-handoff.yaml
# Duration: 45 minutes
# Authorization: Cutover Manager

procedure: "SD-Access Handoff Rollback"
duration_minutes: 45
authorization: "Cutover Manager"

steps:
  - step: 1
    time: "T+0"
    duration: 2
    action: "Announce rollback decision"
    command: "Bridge announcement: Initiating SD-Access handoff rollback"
    verification: "Team acknowledged"
    
  - step: 2
    time: "T+2"
    duration: 10
    action: "Remove WAN Edge handoff configuration"
    device: "WAN Edge Router"
    command: |
      ! Access via console or SSH
      configure terminal
      !
      ! Remove BGP peering to border
      vpn 10
       no router bgp 65100
      !
      vpn 20
       no router bgp 65100
      !
      vpn 30
       no router bgp 65100
      !
      ! Remove handoff subinterfaces
      vpn 10
       no interface GigabitEthernet0/0/0.10
      !
      vpn 20
       no interface GigabitEthernet0/0/0.20
      !
      vpn 30
       no interface GigabitEthernet0/0/0.30
      !
      end
      write memory
    verification: "Handoff config removed from WAN Edge"
    
  - step: 3
    time: "T+12"
    duration: 10
    action: "Remove border node handoff configuration"
    device: "SD-Access Border Node"
    command: |
      configure terminal
      !
      ! Remove BGP neighbor for WAN Edge
      router bgp 65200
       address-family ipv4 vrf Corporate-Data
        no neighbor 10.100.100.1
       !
       address-family ipv4 vrf Guest-Network
        no neighbor 10.100.200.1
       !
       address-family ipv4 vrf Voice-UC
        no neighbor 10.100.130.1
      !
      ! Remove handoff subinterfaces
      no interface TenGigabitEthernet1/0/1.3010
      no interface TenGigabitEthernet1/0/1.3020
      no interface TenGigabitEthernet1/0/1.3030
      !
      ! Remove trunk interface (if dedicated to SD-WAN)
      interface TenGigabitEthernet1/0/1
       shutdown
      !
      end
      write memory
    verification: "Handoff config removed from border"
    
  - step: 4
    time: "T+22"
    duration: 10
    action: "Restore legacy WAN connectivity"
    device: "SD-Access Border Node"
    command: |
      configure terminal
      !
      ! Re-enable legacy WAN routing
      router bgp 65200
       address-family ipv4 vrf Corporate-Data
        neighbor 10.1.1.1 remote-as 65001
        neighbor 10.1.1.1 activate
      !
      ! Or restore from backup
      copy flash:pre-sdwan-border.txt running-config
      !
      end
      write memory
    verification: |
      show ip bgp vpnv4 vrf Corporate-Data summary
      ! Legacy BGP neighbor established
    
  - step: 5
    time: "T+32"
    duration: 8
    action: "Verify fabric connectivity"
    command: |
      ! From fabric host
      ping 10.20.10.100  # Branch destination
      traceroute 10.20.10.100
      
      ! Verify path via legacy MPLS
      ! Traceroute should show MPLS PE, not SD-WAN
    verification: "Fabric connectivity via legacy path"
    
  - step: 6
    time: "T+40"
    duration: 5
    action: "Application verification"
    command: |
      # Test critical applications
      curl -I http://erp.abhavtech.com
      ping voice-server.abhavtech.com
    verification: "Applications accessible"

post_rollback:
  - "Document handoff failure details"
  - "Collect logs from both devices"
  - "Schedule joint troubleshooting with SD-Access team"
```

### Procedure 4: Full Site Rollback

```yaml
# rollback-full-site.yaml
# Duration: 2-4 hours
# Authorization: Cutover Manager + IT Director

procedure: "Full Site Rollback"
duration_minutes: 240
authorization: "Cutover Manager + IT Director"

pre_requisites:
  - "IT Director approval obtained"
  - "All team members on bridge"
  - "Console access verified"
  - "Legacy path verified operational"

steps:
  - step: 1
    time: "T+0"
    duration: 5
    action: "Announce full rollback"
    command: |
      Bridge announcement:
      "Initiating FULL SITE ROLLBACK for [SITE]
       Authorization: [NAME] (Cutover Manager), [NAME] (IT Director)
       Estimated duration: 2-4 hours"
    verification: "All teams acknowledged"
    
  - step: 2
    time: "T+5"
    duration: 15
    action: "Disconnect SD-WAN WAN Edge from network"
    command: |
      ! Via console
      configure terminal
      !
      ! Shutdown all interfaces
      interface range GigabitEthernet0/0/0 - 2
       shutdown
      !
      interface range TenGigabitEthernet0/0/0 - 1
       shutdown
      !
      interface Cellular0/1/0
       shutdown
      !
      end
    verification: "WAN Edge isolated"
    
  - step: 3
    time: "T+20"
    duration: 30
    action: "Restore legacy WAN router"
    command: |
      ! If legacy router powered off:
      # Power on via PDU or physical
      
      ! Wait for boot (5-10 minutes)
      
      ! Verify configuration
      show running-config | include hostname
      
      ! If config missing, restore from backup
      copy tftp://backup-server/[site]-legacy-config.txt running-config
      
      ! Enable interfaces
      configure terminal
      interface GigabitEthernet0/0/1
       description MPLS-PE
       no shutdown
      !
      end
      write memory
    verification: "Legacy router operational"
    
  - step: 4
    time: "T+50"
    duration: 30
    action: "Restore SD-Access border to legacy configuration"
    command: |
      ! On SD-Access Border
      configure terminal
      !
      ! Restore from backup
      copy flash:pre-sdwan-border.txt running-config
      !
      ! Or manually reconfigure
      ! [Include full legacy config]
      !
      end
      write memory
    verification: "Border in legacy state"
    
  - step: 5
    time: "T+80"
    duration: 20
    action: "Verify legacy WAN routing"
    command: |
      ! On legacy router
      show ip bgp summary
      show ip route summary
      
      ! On border
      show ip bgp vpnv4 vrf Corporate-Data summary
      show ip route vrf Corporate-Data
    verification: "BGP established, routes present"
    
  - step: 6
    time: "T+100"
    duration: 20
    action: "Verify end-to-end connectivity"
    command: |
      ! From fabric host
      ping 10.20.10.100  # Remote branch
      traceroute 10.20.10.100
      
      ! From branch
      ping 10.10.10.100  # Fabric server
    verification: "End-to-end connectivity"
    
  - step: 7
    time: "T+120"
    duration: 30
    action: "Application verification"
    command: |
      # Test all critical applications
      # ERP
      curl -I http://erp.abhavtech.com
      
      # Voice
      # Initiate test call
      
      # Video
      # Test video call
      
      # File services
      # Access file share
    verification: "All applications operational"
    
  - step: 8
    time: "T+150"
    duration: 30
    action: "Remove SD-WAN from vManage (optional)"
    command: |
      # vManage GUI
      Configuration > Devices
      Select device > ... > Invalidate
      
      # Or keep for troubleshooting
      # Just ensure device is powered off or isolated
    verification: "Device removed or isolated"
    
  - step: 9
    time: "T+180"
    duration: 30
    action: "Post-rollback verification"
    command: |
      # Run full verification suite
      python3 verify_legacy_wan.py --site [SITE]
    verification: "All checks pass"
    
  - step: 10
    time: "T+210"
    duration: 30
    action: "Documentation and handover"
    command: |
      # Update change record
      # Document rollback reason
      # Capture all relevant logs
      # Brief NOC on current state
    verification: "Documentation complete"

post_rollback:
  critical:
    - "Incident report within 24 hours"
    - "Root cause analysis within 48 hours"
    - "Remediation plan within 1 week"
    
  documentation:
    - "Full timeline of events"
    - "All commands executed"
    - "Logs and captures collected"
    - "Lessons learned"
    
  communication:
    - "Business stakeholder notification"
    - "Executive summary"
    - "Revised migration plan"
```

---

## Rollback Verification

### Verification Checklist

```yaml
# rollback-verification-checklist.yaml
# Use after any rollback to verify success

rollback_verification:
  network_connectivity:
    - check: "Legacy WAN router powered on and accessible"
      command: "ping [ROUTER_MGMT_IP]"
      expected: "Response received"
      actual: ""
      
    - check: "Legacy BGP sessions established"
      command: "show ip bgp summary"
      expected: "All neighbors Established"
      actual: ""
      
    - check: "Routes present in routing table"
      command: "show ip route summary"
      expected: ">0 BGP routes"
      actual: ""
      
    - check: "End-to-end ping to remote sites"
      command: "ping [REMOTE_SITE_IP]"
      expected: "0% packet loss"
      actual: ""

  sdaccess_integration:
    - check: "Border BGP to legacy WAN established"
      command: "show bgp vpnv4 unicast all summary"
      expected: "Legacy peer Established"
      actual: ""
      
    - check: "Routes to remote sites via legacy"
      command: "show ip route vrf Corporate-Data"
      expected: "Routes via MPLS PE"
      actual: ""
      
    - check: "Fabric to branch connectivity"
      command: "ping vrf Corporate-Data [BRANCH_IP]"
      expected: "0% packet loss"
      actual: ""

  application_services:
    - check: "ERP application accessible"
      command: "curl -I http://erp.abhavtech.com"
      expected: "HTTP 200"
      actual: ""
      
    - check: "Voice call quality"
      command: "MOS measurement"
      expected: ">4.0 MOS"
      actual: ""
      
    - check: "File share accessible"
      command: "Access \\\\fileserver\\shared"
      expected: "Folder contents display"
      actual: ""

  sdwan_cleanup:
    - check: "SD-WAN WAN Edge isolated or powered off"
      expected: "Device isolated"
      actual: ""
      
    - check: "Handoff interfaces shutdown"
      expected: "Interfaces down"
      actual: ""

sign_off:
  verified_by: ""
  date_time: ""
  comments: ""
```

### Automated Rollback Verification

```python
#!/usr/bin/env python3
"""
Rollback Verification Script
Verifies successful rollback to legacy state
"""

import subprocess
import json
from datetime import datetime

class RollbackVerification:
    """Automated rollback verification"""
    
    def __init__(self):
        self.results = []
        self.timestamp = datetime.now().isoformat()
    
    def check_connectivity(self, target, description):
        """Verify IP connectivity"""
        result = subprocess.run(
            ['ping', '-c', '4', target],
            capture_output=True,
            text=True
        )
        
        success = result.returncode == 0
        
        self.results.append({
            'check': description,
            'target': target,
            'status': 'PASS' if success else 'FAIL',
            'output': result.stdout if success else result.stderr
        })
        
        return success
    
    def check_bgp_via_ssh(self, router_ip, username, password):
        """Check BGP status via SSH"""
        import paramiko
        
        try:
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(router_ip, username=username, password=password)
            
            stdin, stdout, stderr = ssh.exec_command('show ip bgp summary')
            output = stdout.read().decode()
            
            # Check for Established state
            established = 'Established' in output or 'established' in output
            
            self.results.append({
                'check': 'Legacy BGP Status',
                'target': router_ip,
                'status': 'PASS' if established else 'FAIL',
                'output': output[:500]  # Truncate for readability
            })
            
            ssh.close()
            return established
            
        except Exception as e:
            self.results.append({
                'check': 'Legacy BGP Status',
                'target': router_ip,
                'status': 'ERROR',
                'output': str(e)
            })
            return False
    
    def check_application(self, url, description):
        """Check application accessibility"""
        import requests
        
        try:
            response = requests.get(url, timeout=10, verify=False)
            success = response.status_code == 200
            
            self.results.append({
                'check': description,
                'target': url,
                'status': 'PASS' if success else 'FAIL',
                'output': f"HTTP {response.status_code}"
            })
            
            return success
            
        except Exception as e:
            self.results.append({
                'check': description,
                'target': url,
                'status': 'FAIL',
                'output': str(e)
            })
            return False
    
    def run_verification(self, config):
        """Run all verification checks"""
        
        # Connectivity checks
        for target in config.get('connectivity_targets', []):
            self.check_connectivity(target['ip'], target['description'])
        
        # BGP checks
        for router in config.get('legacy_routers', []):
            self.check_bgp_via_ssh(
                router['ip'],
                router['username'],
                router['password']
            )
        
        # Application checks
        for app in config.get('applications', []):
            self.check_application(app['url'], app['description'])
        
        return self.generate_report()
    
    def generate_report(self):
        """Generate verification report"""
        passed = sum(1 for r in self.results if r['status'] == 'PASS')
        failed = sum(1 for r in self.results if r['status'] == 'FAIL')
        errors = sum(1 for r in self.results if r['status'] == 'ERROR')
        
        overall = 'PASS' if failed == 0 and errors == 0 else 'FAIL'
        
        report = {
            'timestamp': self.timestamp,
            'summary': {
                'total': len(self.results),
                'passed': passed,
                'failed': failed,
                'errors': errors,
                'overall': overall
            },
            'results': self.results
        }
        
        return report


# Example usage
if __name__ == "__main__":
    verifier = RollbackVerification()
    
    config = {
        'connectivity_targets': [
            {'ip': '10.10.10.1', 'description': 'Legacy Router'},
            {'ip': '10.20.10.1', 'description': 'Remote Branch'},
        ],
        'legacy_routers': [
            {'ip': '10.10.250.1', 'username': 'admin', 'password': 'password'}
        ],
        'applications': [
            {'url': 'http://erp.abhavtech.com', 'description': 'ERP Application'}
        ]
    }
    
    report = verifier.run_verification(config)
    
    print("\n" + "="*60)
    print("ROLLBACK VERIFICATION REPORT")
    print("="*60)
    print(json.dumps(report, indent=2))
```

---

## Post-Rollback Activities

### Immediate Actions (Within 1 Hour)

```yaml
# post-rollback-immediate.yaml
# Activities within 1 hour of rollback

immediate_actions:
  - action: "Notify stakeholders"
    owner: "Cutover Manager"
    template: |
      Subject: SD-WAN Migration Rollback - [SITE]
      
      Stakeholders,
      
      The SD-WAN migration for [SITE] has been rolled back to the legacy 
      WAN configuration due to [BRIEF_REASON].
      
      Current Status: Legacy WAN operational
      Services: All services restored
      Next Steps: Root cause analysis in progress
      
      We will provide an update within 24 hours.
      
      Regards,
      Network Team
    
  - action: "Document timeline"
    owner: "Network Team Lead"
    details: |
      - Cutover start time
      - Issue detection time
      - Rollback decision time
      - Rollback completion time
      - Service restoration confirmation
    
  - action: "Collect diagnostic data"
    owner: "SD-WAN Engineer"
    data:
      - "show tech-support from all devices"
      - "vManage logs"
      - "Packet captures (if available)"
      - "Screenshots of errors"
    
  - action: "Update monitoring"
    owner: "NOC"
    details: |
      - Disable SD-WAN alerts
      - Re-enable legacy WAN alerts
      - Update dashboards
```

### Short-Term Actions (Within 48 Hours)

```yaml
# post-rollback-48hours.yaml
# Activities within 48 hours

short_term_actions:
  - action: "Root Cause Analysis"
    owner: "Network Engineering"
    deliverable: "RCA Document"
    contents:
      - "Problem statement"
      - "Timeline of events"
      - "Technical analysis"
      - "Root cause identification"
      - "Contributing factors"
    
  - action: "Vendor Engagement"
    owner: "Network Team Lead"
    details: |
      - Open TAC case with collected data
      - Schedule call with Cisco engineer
      - Request RCA from vendor
    
  - action: "Update Change Record"
    owner: "Change Manager"
    details: |
      - Mark change as rolled back
      - Document reason
      - Attach RCA when available
    
  - action: "Stakeholder Briefing"
    owner: "Cutover Manager"
    details: |
      - Schedule meeting with business owners
      - Present RCA findings
      - Discuss revised timeline
```

### Long-Term Actions (Within 1 Week)

```yaml
# post-rollback-1week.yaml
# Activities within 1 week

long_term_actions:
  - action: "Remediation Plan"
    owner: "Network Engineering"
    deliverable: "Remediation Document"
    contents:
      - "Identified fixes"
      - "Lab validation plan"
      - "Updated procedures"
      - "Additional prerequisites"
    
  - action: "Lessons Learned"
    owner: "Project Manager"
    deliverable: "Lessons Learned Document"
    questions:
      - "What went wrong?"
      - "What warning signs were missed?"
      - "What would we do differently?"
      - "What processes need updating?"
    
  - action: "Revised Migration Plan"
    owner: "Project Manager"
    deliverable: "Updated Project Plan"
    contents:
      - "New timeline"
      - "Updated risk assessment"
      - "Additional testing requirements"
      - "Go/No-Go criteria updates"
    
  - action: "Lab Validation"
    owner: "Network Engineering"
    details: |
      - Reproduce issue in lab
      - Validate fix
      - Document new procedures
      - Sign-off from team leads
```

---

## Rollback Automation Scripts

### Quick Rollback Script

```bash
#!/bin/bash
#======================================================================
# QUICK ROLLBACK SCRIPT
# Use in emergency situations
#======================================================================

# Configuration
LEGACY_ROUTER_IP="10.10.250.1"
LEGACY_ROUTER_USER="admin"
LEGACY_ROUTER_PASS="password"
BORDER_IP="10.10.50.1"
BORDER_USER="admin"
BORDER_PASS="password"

echo "========================================"
echo "SD-WAN EMERGENCY ROLLBACK"
echo "Time: $(date)"
echo "========================================"

read -p "Are you sure you want to rollback? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Rollback cancelled."
    exit 1
fi

echo ""
echo "[1/4] Reverting BGP preference on border..."
sshpass -p "$BORDER_PASS" ssh -o StrictHostKeyChecking=no $BORDER_USER@$BORDER_IP << 'EOF'
configure terminal
no route-map SD-WAN-PREFER
router bgp 65200
 address-family ipv4 vrf Corporate-Data
  no neighbor 10.100.100.1 route-map SD-WAN-PREFER in
 exit
exit
end
write memory
EOF

echo ""
echo "[2/4] Verifying legacy BGP..."
sshpass -p "$LEGACY_ROUTER_PASS" ssh -o StrictHostKeyChecking=no $LEGACY_ROUTER_USER@$LEGACY_ROUTER_IP "show ip bgp summary"

echo ""
echo "[3/4] Verifying connectivity..."
ping -c 4 10.20.10.1

echo ""
echo "[4/4] Rollback complete."
echo "Please verify application connectivity manually."
echo ""
echo "Post-rollback actions:"
echo "1. Notify stakeholders"
echo "2. Document timeline"
echo "3. Collect diagnostics"
echo "4. Update change record"
```

### Full Rollback Automation

```python
#!/usr/bin/env python3
"""
Full Rollback Automation
Comprehensive rollback with verification
"""

import paramiko
import time
import json
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FullRollback:
    """Full site rollback automation"""
    
    def __init__(self, config):
        self.config = config
        self.results = []
        self.start_time = datetime.now()
    
    def log_step(self, step, status, details=""):
        """Log rollback step"""
        entry = {
            'timestamp': datetime.now().isoformat(),
            'step': step,
            'status': status,
            'details': details
        }
        self.results.append(entry)
        logger.info(f"{step}: {status}")
    
    def ssh_command(self, host, username, password, commands):
        """Execute SSH commands"""
        try:
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(host, username=username, password=password, timeout=30)
            
            outputs = []
            for cmd in commands:
                stdin, stdout, stderr = ssh.exec_command(cmd)
                output = stdout.read().decode()
                outputs.append(output)
                time.sleep(1)
            
            ssh.close()
            return True, outputs
            
        except Exception as e:
            return False, str(e)
    
    def revert_bgp_preference(self):
        """Step 1: Revert BGP preference"""
        self.log_step("Revert BGP Preference", "IN_PROGRESS")
        
        commands = [
            "configure terminal",
            "no route-map SD-WAN-PREFER",
            "router bgp 65200",
            "address-family ipv4 vrf Corporate-Data",
            "no neighbor 10.100.100.1 route-map SD-WAN-PREFER in",
            "end",
            "write memory"
        ]
        
        success, output = self.ssh_command(
            self.config['border']['ip'],
            self.config['border']['username'],
            self.config['border']['password'],
            commands
        )
        
        status = "SUCCESS" if success else "FAILED"
        self.log_step("Revert BGP Preference", status, str(output))
        return success
    
    def remove_handoff_config(self):
        """Step 2: Remove handoff configuration"""
        self.log_step("Remove Handoff Config", "IN_PROGRESS")
        
        # WAN Edge commands
        wan_commands = [
            "configure terminal",
            "vpn 10",
            "no interface GigabitEthernet0/0/0.10",
            "no router bgp 65100",
            "end",
            "write memory"
        ]
        
        success1, output1 = self.ssh_command(
            self.config['wan_edge']['ip'],
            self.config['wan_edge']['username'],
            self.config['wan_edge']['password'],
            wan_commands
        )
        
        # Border commands
        border_commands = [
            "configure terminal",
            "no interface TenGigabitEthernet1/0/1.3010",
            "router bgp 65200",
            "address-family ipv4 vrf Corporate-Data",
            "no neighbor 10.100.100.1",
            "end",
            "write memory"
        ]
        
        success2, output2 = self.ssh_command(
            self.config['border']['ip'],
            self.config['border']['username'],
            self.config['border']['password'],
            border_commands
        )
        
        success = success1 and success2
        status = "SUCCESS" if success else "FAILED"
        self.log_step("Remove Handoff Config", status)
        return success
    
    def restore_legacy_routing(self):
        """Step 3: Restore legacy routing"""
        self.log_step("Restore Legacy Routing", "IN_PROGRESS")
        
        commands = [
            "configure terminal",
            "router bgp 65200",
            "address-family ipv4 vrf Corporate-Data",
            "neighbor 10.1.1.1 remote-as 65001",
            "neighbor 10.1.1.1 activate",
            "end",
            "write memory"
        ]
        
        success, output = self.ssh_command(
            self.config['border']['ip'],
            self.config['border']['username'],
            self.config['border']['password'],
            commands
        )
        
        status = "SUCCESS" if success else "FAILED"
        self.log_step("Restore Legacy Routing", status)
        return success
    
    def verify_rollback(self):
        """Step 4: Verify rollback"""
        self.log_step("Verify Rollback", "IN_PROGRESS")
        
        # Check BGP
        commands = ["show ip bgp vpnv4 vrf Corporate-Data summary"]
        success, output = self.ssh_command(
            self.config['border']['ip'],
            self.config['border']['username'],
            self.config['border']['password'],
            commands
        )
        
        bgp_ok = 'Established' in str(output) if success else False
        
        # Check connectivity
        import subprocess
        ping_result = subprocess.run(
            ['ping', '-c', '4', self.config['test_target']],
            capture_output=True
        )
        connectivity_ok = ping_result.returncode == 0
        
        success = bgp_ok and connectivity_ok
        status = "SUCCESS" if success else "FAILED"
        details = f"BGP: {'OK' if bgp_ok else 'FAIL'}, Connectivity: {'OK' if connectivity_ok else 'FAIL'}"
        self.log_step("Verify Rollback", status, details)
        return success
    
    def execute_rollback(self):
        """Execute full rollback"""
        logger.info("="*60)
        logger.info("STARTING FULL ROLLBACK")
        logger.info("="*60)
        
        steps = [
            ("Revert BGP Preference", self.revert_bgp_preference),
            ("Remove Handoff Config", self.remove_handoff_config),
            ("Restore Legacy Routing", self.restore_legacy_routing),
            ("Verify Rollback", self.verify_rollback),
        ]
        
        for step_name, step_func in steps:
            if not step_func():
                logger.error(f"Rollback step failed: {step_name}")
                # Continue with remaining steps
        
        # Generate report
        end_time = datetime.now()
        duration = (end_time - self.start_time).total_seconds()
        
        report = {
            'start_time': self.start_time.isoformat(),
            'end_time': end_time.isoformat(),
            'duration_seconds': duration,
            'steps': self.results,
            'overall_status': 'SUCCESS' if all(
                r['status'] == 'SUCCESS' for r in self.results
            ) else 'PARTIAL'
        }
        
        # Save report
        with open(f"rollback-report-{self.start_time.strftime('%Y%m%d-%H%M%S')}.json", 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info("="*60)
        logger.info(f"ROLLBACK COMPLETE - Status: {report['overall_status']}")
        logger.info(f"Duration: {duration:.0f} seconds")
        logger.info("="*60)
        
        return report


# Execute rollback
if __name__ == "__main__":
    config = {
        'border': {
            'ip': '10.10.50.1',
            'username': 'admin',
            'password': 'password'
        },
        'wan_edge': {
            'ip': '10.10.250.11',
            'username': 'admin',
            'password': 'password'
        },
        'test_target': '10.20.10.1'
    }
    
    rollback = FullRollback(config)
    
    print("\n" + "="*60)
    print("SD-WAN FULL ROLLBACK")
    print("="*60)
    
    confirm = input("Are you sure you want to execute full rollback? (yes/no): ")
    if confirm.lower() == 'yes':
        report = rollback.execute_rollback()
        print(json.dumps(report, indent=2))
    else:
        print("Rollback cancelled.")
```

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| Go-Live Cutover Runbook | Production cutover procedures | Section 5.15 |
| Testing & Validation | Pre-cutover testing | Section 5.14 |
| Troubleshooting Guide | Issue diagnosis | Chapter 6.8 |
| HA Failover Procedures | High availability | Section 6.14 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Implementation & Deployment documentation series for Abhavtech.com*
