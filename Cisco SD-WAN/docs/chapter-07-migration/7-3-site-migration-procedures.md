# 7.3 Site Migration Procedures

## 7.3.1 Site Classification and Migration Approach

### Site Classification Matrix

```yaml
site_classification:
  hub_sites:
    characteristics:
      - "Multiple WAN Edge devices (HA)"
      - "High bandwidth requirements (500 Mbps+)"
      - "SD-Access fabric integration"
      - "Data center services"
      - "Regional aggregation point"
    sites:
      - site: "Mumbai"
        type: "Primary Hub"
        complexity: "Very High"
        migration_window: "12 hours"
      - site: "Chennai"
        type: "Secondary Hub"
        complexity: "High"
        migration_window: "8 hours"
      - site: "London"
        type: "Regional Hub"
        complexity: "High"
        migration_window: "6 hours"
      - site: "New Jersey"
        type: "Regional Hub"
        complexity: "High"
        migration_window: "6 hours"
        
  branch_sites:
    characteristics:
      - "Single or dual WAN Edge"
      - "Standard bandwidth (100-200 Mbps)"
      - "No fabric integration"
      - "End-user focused"
    sites:
      - site: "Bangalore"
        type: "Large Branch"
        complexity: "Medium"
        migration_window: "4 hours"
      - site: "Delhi"
        type: "Medium Branch"
        complexity: "Low"
        migration_window: "3 hours"
      - site: "Noida"
        type: "Medium Branch"
        complexity: "Low"
        migration_window: "3 hours"
      - site: "Frankfurt"
        type: "Medium Branch"
        complexity: "Medium"
        migration_window: "4 hours"
      - site: "Dallas"
        type: "Medium Branch"
        complexity: "Medium"
        migration_window: "4 hours"
```

### Migration Approach by Site Type

```yaml
migration_approaches:
  greenfield:
    description: "New site with no existing infrastructure"
    approach:
      - "Deploy WAN Edge directly"
      - "No coexistence required"
      - "Fastest migration"
    typical_duration: "2-4 hours"
    
  brownfield_parallel:
    description: "Existing MPLS with parallel SD-WAN deployment"
    approach:
      - "Deploy SD-WAN alongside MPLS"
      - "Validate before cutover"
      - "Gradual traffic migration"
    typical_duration: "4-8 hours"
    sites: "All Abhavtech sites"
    
  brownfield_replacement:
    description: "Direct replacement of existing WAN equipment"
    approach:
      - "Remove old, install new"
      - "Higher risk, faster execution"
      - "Requires longer maintenance window"
    typical_duration: "6-12 hours"
```

---

## 7.3.2 Standard Branch Migration Procedure

### Pre-Migration Phase (T-7 Days to T-1 Day)

```yaml
pre_migration_t_minus_7:
  infrastructure_verification:
    wan_edge_device:
      - task: "Verify device staged and configured"
        owner: "Network Engineer"
        validation: |
          - Device model matches plan
          - IOS-XE version 17.15.x
          - Bootstrap configuration loaded
          
    circuits:
      - task: "Verify internet circuit active"
        owner: "Procurement/Network"
        validation: |
          - Provider confirms active
          - Speed test matches SLA
          - Static IP configured (if applicable)
          
      - task: "Verify backup circuit ready"
        owner: "Network Engineer"
        validation: |
          - LTE/5G SIM activated
          - Signal strength adequate
          - Data plan confirmed
          
    controller_readiness:
      - task: "Verify site configured in vManage"
        owner: "Network Engineer"
        validation: |
          - Site ID assigned
          - Templates attached
          - Policies configured

pre_migration_t_minus_3:
  notifications:
    - task: "Send user notification"
      owner: "Project Manager"
      recipients: "Site users, Help Desk, NOC"
      
    - task: "Confirm maintenance window"
      owner: "Project Manager"
      validation: "CAB approval documented"
      
  technical_preparation:
    - task: "Capture performance baseline"
      owner: "Network Engineer"
      measurements:
        latency:
          - "Site to Mumbai hub"
          - "Site to Chennai hub"
          - "Site to critical applications"
        throughput:
          - "Maximum bandwidth test"
          - "Concurrent session test"
        application:
          - "SAP response time"
          - "Email latency"
          - "Voice MOS score"

pre_migration_t_minus_1:
  final_checks:
    - task: "Verify all prerequisites complete"
      owner: "Technical Lead"
      checklist: "pre_migration_checklist"
      
    - task: "Confirm team availability"
      owner: "Project Manager"
      participants:
        - "Network Engineer (on-site or remote)"
        - "Site Contact (on-site)"
        - "NOC (monitoring)"
        - "On-call support"
        
    - task: "Test rollback procedure"
      owner: "Network Engineer"
      validation: "Documented and understood"
```

### Migration Execution Phase

```yaml
migration_execution:
  phase_1_preparation:
    duration: "30 minutes"
    
    step_1:
      time: "T-30"
      action: "Team assembly"
      details:
        - "Join bridge call"
        - "Confirm all participants present"
        - "Review migration plan"
        
    step_2:
      time: "T-15"
      action: "Pre-flight checks"
      commands: |
        # Check current MPLS status
        show interface summary
        show ip route
        
        # Verify no active incidents
        # Check monitoring dashboards
        
    step_3:
      time: "T-0"
      action: "Announce migration start"
      notification: "NOC, stakeholders"
      
  phase_2_deployment:
    duration: "60-90 minutes"
    
    step_4:
      time: "T+5"
      action: "Power on WAN Edge"
      owner: "Site Contact"
      validation: |
        - Power LED on
        - Boot sequence starts
        - Console accessible
        
    step_5:
      time: "T+15"
      action: "Verify bootstrap completion"
      owner: "Network Engineer"
      commands: |
        show version
        show sdwan running-config
        show sdwan certificate installed
        
    step_6:
      time: "T+20"
      action: "Verify control connections"
      owner: "Network Engineer"
      commands: |
        show sdwan control connections
        show sdwan control local-properties
      expected_output: |
        vManage: Connected
        vSmart-1: Connected
        vSmart-2: Connected
        vBond: Discovered
        
    step_7:
      time: "T+30"
      action: "Verify data plane"
      owner: "Network Engineer"
      commands: |
        show sdwan bfd sessions
        show sdwan omp routes
        show sdwan omp tlocs
      expected_output: |
        - BFD sessions to hub sites UP
        - OMP routes received from all sites
        - Local TLOC advertised
        
    step_8:
      time: "T+45"
      action: "Connect LAN interface"
      owner: "Site Contact / Network Engineer"
      steps:
        - "Connect WAN Edge LAN port to switch"
        - "Verify interface up"
        - "Check VLAN trunking (if applicable)"
      commands: |
        show interface GigabitEthernet0/0/1
        show ip interface brief
        
    step_9:
      time: "T+60"
      action: "Verify LAN connectivity"
      owner: "Network Engineer"
      commands: |
        show ip route vrf 10
        ping vrf 10 [default-gateway]
        ping vrf 10 [test-host]
        
  phase_3_cutover:
    duration: "30-45 minutes"
    
    step_10:
      time: "T+70"
      action: "Initial traffic test"
      owner: "Network Engineer"
      tests:
        - "Ping to hub sites"
        - "Traceroute verification"
        - "Basic application test"
        
    step_11:
      time: "T+80"
      action: "Execute traffic cutover"
      owner: "Network Engineer"
      method: "Update routing/switching to prefer SD-WAN"
      options:
        option_a: "Adjust switch default gateway"
        option_b: "Modify HSRP/VRRP priority"
        option_c: "Update static routes"
        
    step_12:
      time: "T+90"
      action: "Verify traffic flowing via SD-WAN"
      owner: "Network Engineer"
      commands: |
        show sdwan app-route statistics
        show interface counters rate
      validation: "Traffic counters incrementing"
      
    step_13:
      time: "T+100"
      action: "MPLS soft shutdown"
      owner: "Network Engineer"
      action_detail: "Administratively disable MPLS interface"
      commands: |
        interface GigabitEthernet0/0/0
         shutdown
      note: "Keep config for rollback"
      
  phase_4_validation:
    duration: "45-60 minutes"
    
    step_14:
      time: "T+110"
      action: "Application validation"
      owner: "Network Engineer / Site Contact"
      tests:
        sap:
          - "Login test"
          - "Transaction test"
          - "Response time measurement"
        email:
          - "Send test email"
          - "Receive test email"
          - "Calendar sync"
        voice:
          - "Place test call"
          - "Verify audio quality"
          - "Check MOS score"
          
    step_15:
      time: "T+130"
      action: "Performance validation"
      owner: "Network Engineer"
      comparison: "Against baseline captured T-1"
      acceptance_criteria:
        latency: "Within 10% of baseline"
        packet_loss: "< 0.1%"
        jitter: "< 30ms"
        
    step_16:
      time: "T+150"
      action: "User validation"
      owner: "Site Contact"
      method: "Contact key users for confirmation"
      
    step_17:
      time: "T+165"
      action: "Final monitoring check"
      owner: "NOC"
      validation:
        - "No critical alarms"
        - "All tunnels up"
        - "Steady state traffic"
        
    step_18:
      time: "T+180"
      action: "Declare migration complete"
      owner: "Technical Lead"
      announcement: "All stakeholders"
      documentation: "Update migration tracker"
```

### Post-Migration Phase

```yaml
post_migration:
  day_plus_1:
    activities:
      - time: "08:00"
        task: "Morning health check"
        owner: "Network Engineer"
        
      - time: "09:00"
        task: "Business hours validation"
        owner: "NOC"
        focus: "Monitor for user issues"
        
      - time: "17:00"
        task: "End of day review"
        owner: "Network Engineer"
        output: "Day 1 status report"
        
  day_plus_3:
    activities:
      - task: "72-hour stability review"
        owner: "Technical Lead"
        metrics:
          - "Uptime percentage"
          - "Performance trends"
          - "Issue count"
          
  day_plus_7:
    activities:
      - task: "One-week review"
        owner: "Project Manager"
        deliverables:
          - "Performance report"
          - "Lessons learned"
          - "Go/no-go for next site"
```

---

## 7.3.3 Hub Site Migration Procedure

### Hub-Specific Considerations

```yaml
hub_considerations:
  high_availability:
    requirement: "Dual WAN Edge with HA"
    procedure: "Staged migration - Primary then Secondary"
    failover_testing: "Required during migration"
    
  sd_access_integration:
    requirement: "Fabric border handoff"
    procedure: "BGP peering after control plane stable"
    validation: "Route exchange and SGT propagation"
    
  branch_dependencies:
    requirement: "Hub serves as transit for branches"
    procedure: "Ensure branch connectivity maintained"
    validation: "All branch sites reachable"
    
  extended_window:
    requirement: "Longer maintenance window"
    duration: "6-12 hours depending on complexity"
    timing: "Weekend preferred"
```

### Hub Migration Detailed Steps

```yaml
hub_migration_steps:
  stage_1_primary_wan_edge:
    duration: "2-3 hours"
    
    steps:
      - step: "Deploy Primary WAN Edge"
        details:
          - "Power on device"
          - "Verify control connections"
          - "Verify BFD tunnels"
          
      - step: "Configure HA pairing"
        commands: |
          show redundancy
          show vrrp brief
          
      - step: "Verify OMP routes"
        validation: "Routes from all sites received"
        
  stage_2_secondary_wan_edge:
    duration: "1-2 hours"
    
    steps:
      - step: "Deploy Secondary WAN Edge"
        details:
          - "Power on device"
          - "Verify joins HA pair"
          
      - step: "Verify HA status"
        commands: |
          show redundancy
        expected: |
          Primary: ACTIVE
          Secondary: STANDBY HOT
          
      - step: "Test failover"
        action: "Simulate primary failure"
        validation: "Traffic fails over < 3 seconds"
        
  stage_3_fabric_integration:
    duration: "1-2 hours"
    condition: "Sites with SD-Access integration"
    
    steps:
      - step: "Enable BGP peering"
        commands: |
          # On WAN Edge
          router bgp 65001
           neighbor 10.10.1.2 remote-as 65100
           neighbor 10.10.1.2 update-source GigabitEthernet0/0/1.101
           address-family vpnv4 unicast
            neighbor 10.10.1.2 activate
            
      - step: "Verify BGP sessions"
        commands: |
          show bgp vpnv4 unicast all summary
        expected: "State: Established"
        
      - step: "Verify route exchange"
        commands: |
          show bgp vpnv4 unicast all
        validation: "Fabric routes received"
        
      - step: "Verify SGT propagation"
        commands: |
          show cts role-based sgt-map all
        validation: "SGT mappings present"
        
  stage_4_traffic_cutover:
    duration: "1-2 hours"
    
    steps:
      - step: "Shift traffic to SD-WAN"
        method: "BGP local preference adjustment"
        
      - step: "Verify branch connectivity"
        validation: "All branches can reach hub"
        
      - step: "Disable MPLS interface"
        action: "Administrative shutdown"
        
  stage_5_validation:
    duration: "1-2 hours"
    
    steps:
      - step: "Full application testing"
        scope: "All critical applications"
        
      - step: "Performance comparison"
        baseline: "Pre-migration metrics"
        
      - step: "HA validation"
        test: "Failover and failback"
```

---

## 7.3.4 Site Migration Automation

### Migration Automation Script

```python
#!/usr/bin/env python3
"""
Site Migration Automation
Automates validation steps during site migration
"""

import requests
import json
import time
from datetime import datetime

class SiteMigrationAutomation:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        self.migration_log = []
        
    def authenticate(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(auth_url, data=payload)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def log(self, message, level='INFO'):
        """Log migration event"""
        timestamp = datetime.now().isoformat()
        entry = f"[{timestamp}] [{level}] {message}"
        self.migration_log.append(entry)
        print(entry)
        
    def verify_device_online(self, system_ip, timeout=300):
        """Wait for device to come online"""
        self.log(f"Waiting for device {system_ip} to come online...")
        
        start_time = time.time()
        while time.time() - start_time < timeout:
            url = f"{self.base_url}/dataservice/device"
            response = self.session.get(url)
            
            if response.status_code == 200:
                devices = response.json().get('data', [])
                for device in devices:
                    if device.get('system-ip') == system_ip:
                        if device.get('reachability') == 'reachable':
                            self.log(f"Device {system_ip} is online")
                            return True
                            
            time.sleep(10)
            
        self.log(f"Timeout waiting for device {system_ip}", 'ERROR')
        return False
        
    def verify_control_connections(self, system_ip):
        """Verify control plane connections"""
        self.log(f"Verifying control connections for {system_ip}...")
        
        url = f"{self.base_url}/dataservice/device/control/connections?deviceId={system_ip}"
        response = self.session.get(url)
        
        if response.status_code == 200:
            connections = response.json().get('data', [])
            
            vmanage_connected = False
            vsmart_connected = 0
            
            for conn in connections:
                if conn.get('peer-type') == 'vmanage' and conn.get('state') == 'up':
                    vmanage_connected = True
                elif conn.get('peer-type') == 'vsmart' and conn.get('state') == 'up':
                    vsmart_connected += 1
                    
            if vmanage_connected and vsmart_connected >= 1:
                self.log(f"Control connections verified: vManage=Yes, vSmart={vsmart_connected}")
                return True
            else:
                self.log(f"Control connections incomplete: vManage={vmanage_connected}, vSmart={vsmart_connected}", 'WARNING')
                return False
                
        self.log("Failed to check control connections", 'ERROR')
        return False
        
    def verify_bfd_sessions(self, system_ip):
        """Verify BFD tunnel sessions"""
        self.log(f"Verifying BFD sessions for {system_ip}...")
        
        url = f"{self.base_url}/dataservice/device/bfd/sessions?deviceId={system_ip}"
        response = self.session.get(url)
        
        if response.status_code == 200:
            sessions = response.json().get('data', [])
            
            up_count = sum(1 for s in sessions if s.get('state') == 'up')
            total_count = len(sessions)
            
            self.log(f"BFD sessions: {up_count}/{total_count} up")
            return up_count > 0
            
        self.log("Failed to check BFD sessions", 'ERROR')
        return False
        
    def verify_omp_routes(self, system_ip):
        """Verify OMP route reception"""
        self.log(f"Verifying OMP routes for {system_ip}...")
        
        url = f"{self.base_url}/dataservice/device/omp/routes?deviceId={system_ip}"
        response = self.session.get(url)
        
        if response.status_code == 200:
            routes = response.json().get('data', [])
            route_count = len(routes)
            
            self.log(f"OMP routes received: {route_count}")
            return route_count > 0
            
        self.log("Failed to check OMP routes", 'ERROR')
        return False
        
    def run_migration_validation(self, system_ip):
        """Run complete migration validation sequence"""
        self.log(f"Starting migration validation for {system_ip}")
        self.log("=" * 60)
        
        results = {
            'device_online': False,
            'control_connections': False,
            'bfd_sessions': False,
            'omp_routes': False,
            'overall': False
        }
        
        # Step 1: Wait for device online
        results['device_online'] = self.verify_device_online(system_ip)
        if not results['device_online']:
            self.log("MIGRATION VALIDATION FAILED: Device not online", 'ERROR')
            return results
            
        # Step 2: Verify control connections
        results['control_connections'] = self.verify_control_connections(system_ip)
        
        # Step 3: Verify BFD sessions
        results['bfd_sessions'] = self.verify_bfd_sessions(system_ip)
        
        # Step 4: Verify OMP routes
        results['omp_routes'] = self.verify_omp_routes(system_ip)
        
        # Overall result
        results['overall'] = all([
            results['control_connections'],
            results['bfd_sessions'],
            results['omp_routes']
        ])
        
        self.log("=" * 60)
        if results['overall']:
            self.log("MIGRATION VALIDATION PASSED", 'SUCCESS')
        else:
            self.log("MIGRATION VALIDATION FAILED", 'ERROR')
            
        return results
        
    def get_migration_log(self):
        """Get migration log"""
        return "\n".join(self.migration_log)


if __name__ == "__main__":
    automation = SiteMigrationAutomation(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    # Run validation for migrating device
    results = automation.run_migration_validation("10.10.50.1")
    
    print("\n" + automation.get_migration_log())
```

---

## 7.3.5 Migration Tracking

### Migration Status Dashboard

```yaml
migration_tracking:
  dashboard_metrics:
    overall_progress:
      total_sites: 9
      completed: 0
      in_progress: 0
      pending: 9
      
    by_phase:
      pilot: "1 site"
      branch_rollout: "4 sites"
      hub_migration: "3 sites"
      primary_hub: "1 site"
      
  site_status_template:
    site_name: ""
    status: "Pending|Scheduled|In Progress|Completed|Rolled Back"
    scheduled_date: ""
    actual_start: ""
    actual_end: ""
    duration: ""
    issues: []
    notes: ""
```

### Migration Tracker Spreadsheet

```
| Site       | Phase | Status    | Scheduled   | Start       | End         | Duration | Issues |
|------------|-------|-----------|-------------|-------------|-------------|----------|--------|
| Bangalore  | Pilot | Pending   | 2025-02-01  | -           | -           | -        | -      |
| Delhi      | 2     | Pending   | 2025-02-08  | -           | -           | -        | -      |
| Noida      | 2     | Pending   | 2025-02-10  | -           | -           | -        | -      |
| Frankfurt  | 2     | Pending   | 2025-02-15  | -           | -           | -        | -      |
| Dallas     | 2     | Pending   | 2025-02-17  | -           | -           | -        | -      |
| Chennai    | 3     | Pending   | 2025-02-22  | -           | -           | -        | -      |
| London     | 3     | Pending   | 2025-02-24  | -           | -           | -        | -      |
| New Jersey | 3     | Pending   | 2025-03-01  | -           | -           | -        | -      |
| Mumbai     | 4     | Pending   | 2025-03-08  | -           | -           | -        | -      |
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
