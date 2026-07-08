# 7.4 Rollback Procedures

## 7.4.1 Rollback Strategy Overview

### Rollback Philosophy

```yaml
rollback_philosophy:
  principle: "Always have a way back"
  
  key_tenets:
    prepared:
      description: "Rollback procedure ready before migration starts"
      requirement: "Documented and tested"
      
    fast:
      description: "Minimize rollback time"
      target: "< 30 minutes for branch, < 60 minutes for hub"
      
    safe:
      description: "Rollback must not cause additional issues"
      validation: "Tested in lab or similar site"
      
    decisive:
      description: "Clear triggers for rollback decision"
      authority: "Technical Lead with PM approval"
```

### Rollback Decision Matrix

```yaml
rollback_triggers:
  immediate_rollback:
    criteria:
      - "Complete site isolation (no connectivity)"
      - "Critical application failure with no workaround"
      - "Data loss or corruption"
      - "Security incident"
    decision_time: "Immediate"
    authority: "Technical Lead"
    
  conditional_rollback:
    criteria:
      - "Multiple application issues"
      - "Performance degradation > 30%"
      - "Unable to resolve within maintenance window"
    decision_time: "Within 30 minutes of issue detection"
    authority: "Technical Lead + Project Manager"
    
  deferred_decision:
    criteria:
      - "Minor performance issues"
      - "Single application affected with workaround"
      - "Issue being actively troubleshot"
    decision_time: "Before maintenance window ends"
    authority: "Technical Lead"
    
  no_rollback_needed:
    criteria:
      - "All validation tests pass"
      - "Performance within acceptable range"
      - "Users confirm functionality"
```

---

## 7.4.2 Branch Site Rollback Procedure

### Quick Rollback (< 15 minutes)

```yaml
branch_quick_rollback:
  scenario: "SD-WAN not working, MPLS still connected"
  duration: "10-15 minutes"
  
  steps:
    step_1:
      action: "Announce rollback initiation"
      owner: "Technical Lead"
      notification: "Bridge call, NOC"
      
    step_2:
      action: "Re-enable MPLS interface"
      owner: "Network Engineer"
      commands: |
        ! On existing router (if still in place)
        interface GigabitEthernet0/0/0
         no shutdown
         
        ! Verify interface up
        show interface GigabitEthernet0/0/0
        
    step_3:
      action: "Revert routing to MPLS"
      owner: "Network Engineer"
      options:
        option_a_switch_gateway:
          action: "Change switch default gateway back to MPLS router"
          commands: |
            interface Vlan10
             ip helper-address 10.10.1.1
             
        option_b_hsrp_vrrp:
          action: "Adjust HSRP/VRRP priority"
          commands: |
            interface Vlan10
             standby 1 priority 110
             
    step_4:
      action: "Disconnect WAN Edge LAN"
      owner: "Site Contact"
      method: "Unplug LAN cable from WAN Edge"
      
    step_5:
      action: "Verify traffic via MPLS"
      owner: "Network Engineer"
      validation:
        - "Traceroute shows MPLS path"
        - "Applications accessible"
        - "No packet loss"
        
    step_6:
      action: "Announce rollback complete"
      owner: "Technical Lead"
      documentation: "Log rollback reason and actions"
```

### Full Rollback (MPLS Router Removed)

```yaml
branch_full_rollback:
  scenario: "MPLS router removed, need to restore"
  duration: "30-60 minutes"
  prerequisite: "MPLS router staged nearby or config backup available"
  
  steps:
    step_1:
      action: "Announce rollback and estimate duration"
      owner: "Technical Lead"
      
    step_2:
      action: "Power off WAN Edge"
      owner: "Site Contact"
      
    step_3:
      action: "Reinstall MPLS router"
      owner: "Site Contact"
      details:
        - "Connect power"
        - "Connect WAN interface to MPLS circuit"
        - "Connect LAN interface to switch"
        
    step_4:
      action: "Restore MPLS router configuration"
      owner: "Network Engineer"
      method: "Console or TFTP restore"
      commands: |
        ! If config backup on flash
        copy flash:backup-config running-config
        
        ! If TFTP restore needed
        copy tftp://10.100.1.100/[hostname]-config running-config
        
    step_5:
      action: "Verify MPLS connectivity"
      owner: "Network Engineer"
      commands: |
        show ip interface brief
        show ip route
        show ip bgp summary  ! If BGP used
        ping [hub-router]
        
    step_6:
      action: "Verify application connectivity"
      owner: "Network Engineer / Site Contact"
      tests:
        - "Application access"
        - "Internet access (if applicable)"
        
    step_7:
      action: "Update routing/switching"
      owner: "Network Engineer"
      action: "Point traffic to restored router"
      
    step_8:
      action: "Verify full functionality"
      owner: "Network Engineer"
      validation: "All services operational"
      
    step_9:
      action: "Announce rollback complete"
      owner: "Technical Lead"
```

---

## 7.4.3 Hub Site Rollback Procedure

### Hub HA Rollback

```yaml
hub_ha_rollback:
  scenario: "Hub with HA pair, need to rollback"
  duration: "45-60 minutes"
  complexity: "High - must maintain branch connectivity"
  
  pre_rollback_assessment:
    - "Identify which branches are affected"
    - "Determine if partial rollback possible"
    - "Notify all dependent sites"
    
  steps:
    step_1:
      action: "Announce hub rollback"
      owner: "Technical Lead"
      notification: "All teams, branch sites"
      
    step_2:
      action: "Disable SD-Access BGP peering"
      owner: "Integration Lead"
      commands: |
        router bgp 65001
         neighbor 10.10.1.2 shutdown
         neighbor 10.10.1.3 shutdown
      reason: "Prevent route flapping during rollback"
      
    step_3:
      action: "Re-enable MPLS interface on existing router"
      owner: "Network Engineer"
      commands: |
        interface GigabitEthernet0/0/0
         no shutdown
         
    step_4:
      action: "Verify MPLS BGP session"
      owner: "Network Engineer"
      commands: |
        show ip bgp summary
      expected: "BGP session to provider PE established"
      
    step_5:
      action: "Shift traffic to MPLS"
      owner: "Network Engineer"
      method: "Adjust BGP local preference"
      commands: |
        route-map PREFER-MPLS permit 10
         set local-preference 200
         
        router bgp 65000
         neighbor [MPLS-PE] route-map PREFER-MPLS in
         
    step_6:
      action: "Verify branch connectivity via MPLS"
      owner: "Network Engineer"
      validation: "All branches reachable"
      
    step_7:
      action: "Power off WAN Edge devices"
      owner: "Site Contact"
      sequence: "Secondary first, then Primary"
      
    step_8:
      action: "Re-enable SD-Access integration via MPLS"
      owner: "Integration Lead"
      condition: "If fabric was using SD-WAN path"
      
    step_9:
      action: "Full validation"
      owner: "Network Engineer"
      scope:
        - "All branch sites"
        - "SD-Access fabric traffic"
        - "Applications"
        
    step_10:
      action: "Announce rollback complete"
      owner: "Technical Lead"
```

### Hub Fabric Integration Rollback

```yaml
fabric_integration_rollback:
  scenario: "SD-Access integration issues, rollback integration only"
  duration: "15-30 minutes"
  scope: "Fabric handoff only, SD-WAN remains active"
  
  steps:
    step_1:
      action: "Disable BGP to fabric borders"
      owner: "Network Engineer"
      commands: |
        router bgp 65001
         neighbor 10.10.1.2 shutdown
         neighbor 10.10.1.3 shutdown
         
    step_2:
      action: "Verify SD-WAN still operational"
      owner: "Network Engineer"
      validation: "Branch connectivity maintained"
      
    step_3:
      action: "Re-enable MPLS path for fabric traffic"
      owner: "Network Engineer"
      method: "Adjust routing on fabric borders"
      
    step_4:
      action: "Verify fabric traffic flows via MPLS"
      owner: "Integration Lead"
      commands: |
        show ip route vrf [VN-name]
        traceroute vrf [VN-name] [destination]
```

---

## 7.4.4 Rollback Automation Script

```python
#!/usr/bin/env python3
"""
Migration Rollback Automation
Assists with rollback procedures
"""

import requests
import json
import time
from datetime import datetime

class RollbackAutomation:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        self.rollback_log = []
        
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
        """Log rollback event"""
        timestamp = datetime.now().isoformat()
        entry = f"[{timestamp}] [{level}] {message}"
        self.rollback_log.append(entry)
        print(entry)
        
    def assess_rollback_need(self, system_ip):
        """Assess if rollback is needed"""
        self.log(f"Assessing rollback need for {system_ip}")
        
        issues = []
        
        # Check device reachability
        url = f"{self.base_url}/dataservice/device"
        response = self.session.get(url)
        
        if response.status_code == 200:
            devices = response.json().get('data', [])
            device = next((d for d in devices if d.get('system-ip') == system_ip), None)
            
            if not device:
                issues.append("Device not found in vManage")
            elif device.get('reachability') != 'reachable':
                issues.append("Device unreachable")
                
        # Check control connections
        url = f"{self.base_url}/dataservice/device/control/connections?deviceId={system_ip}"
        response = self.session.get(url)
        
        if response.status_code == 200:
            connections = response.json().get('data', [])
            up_connections = sum(1 for c in connections if c.get('state') == 'up')
            
            if up_connections == 0:
                issues.append("No control connections")
                
        # Check BFD sessions
        url = f"{self.base_url}/dataservice/device/bfd/sessions?deviceId={system_ip}"
        response = self.session.get(url)
        
        if response.status_code == 200:
            sessions = response.json().get('data', [])
            up_sessions = sum(1 for s in sessions if s.get('state') == 'up')
            
            if up_sessions == 0:
                issues.append("No BFD sessions up")
                
        # Assessment result
        if len(issues) >= 2:
            recommendation = "ROLLBACK RECOMMENDED"
            severity = "CRITICAL"
        elif len(issues) == 1:
            recommendation = "INVESTIGATE - POSSIBLE ROLLBACK"
            severity = "WARNING"
        else:
            recommendation = "NO ROLLBACK NEEDED"
            severity = "INFO"
            
        result = {
            'system_ip': system_ip,
            'issues': issues,
            'recommendation': recommendation,
            'severity': severity
        }
        
        self.log(f"Assessment: {recommendation} - Issues: {issues}", severity)
        return result
        
    def prepare_rollback(self, site_name):
        """Prepare rollback documentation"""
        self.log(f"Preparing rollback for site: {site_name}")
        
        rollback_plan = {
            'site': site_name,
            'prepared_at': datetime.now().isoformat(),
            'steps': [
                "1. Announce rollback initiation",
                "2. Re-enable MPLS interface",
                "3. Revert routing configuration",
                "4. Disconnect WAN Edge LAN",
                "5. Verify MPLS connectivity",
                "6. Verify applications",
                "7. Announce rollback complete"
            ],
            'estimated_duration': "15-30 minutes",
            'contacts': {
                'technical_lead': "[Name]",
                'site_contact': "[Name]",
                'noc': "[Phone]"
            }
        }
        
        return rollback_plan
        
    def execute_device_isolation(self, system_ip):
        """Isolate device from fabric (soft rollback)"""
        self.log(f"Isolating device {system_ip} from SD-WAN fabric")
        
        # This would typically involve:
        # 1. Shutting down OMP on the device
        # 2. Clearing BFD sessions
        # 3. Removing from active routing
        
        # Note: Actual implementation would require device CLI access
        # This is a placeholder for the automation concept
        
        self.log("Device isolation would require CLI access - manual step required")
        return False
        
    def verify_mpls_restoration(self, site_ip):
        """Verify MPLS connectivity restored"""
        self.log(f"Verifying MPLS restoration for site {site_ip}")
        
        # This would typically involve:
        # 1. Ping tests via MPLS path
        # 2. Traceroute verification
        # 3. Application tests
        
        verification_steps = [
            "Verify MPLS interface up",
            "Verify BGP session to provider (if applicable)",
            "Ping hub sites via MPLS",
            "Verify application connectivity"
        ]
        
        return {
            'status': 'manual_verification_required',
            'steps': verification_steps
        }
        
    def generate_rollback_report(self):
        """Generate rollback report"""
        report = {
            'generated_at': datetime.now().isoformat(),
            'log_entries': self.rollback_log,
            'summary': {
                'total_events': len(self.rollback_log),
                'errors': sum(1 for l in self.rollback_log if 'ERROR' in l),
                'warnings': sum(1 for l in self.rollback_log if 'WARNING' in l)
            }
        }
        
        return report


if __name__ == "__main__":
    automation = RollbackAutomation(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    # Assess if rollback needed
    assessment = automation.assess_rollback_need("10.10.50.1")
    print(f"\nAssessment: {json.dumps(assessment, indent=2)}")
    
    # Prepare rollback plan
    plan = automation.prepare_rollback("Bangalore")
    print(f"\nRollback Plan: {json.dumps(plan, indent=2)}")
```

---

## 7.4.5 Rollback Documentation

### Rollback Report Template

```yaml
rollback_report_template:
  header:
    report_title: "Migration Rollback Report"
    site_name: "[Site Name]"
    date: "[Date]"
    prepared_by: "[Name]"
    
  executive_summary:
    rollback_initiated: "[Time]"
    rollback_completed: "[Time]"
    total_duration: "[Duration]"
    business_impact: "[Description]"
    
  timeline:
    - time: "[Time]"
      event: "Rollback decision made"
      actor: "[Name/Role]"
      
    - time: "[Time]"
      event: "Rollback initiated"
      actor: "[Name/Role]"
      
    - time: "[Time]"
      event: "MPLS connectivity restored"
      actor: "[Name/Role]"
      
    - time: "[Time]"
      event: "Rollback completed"
      actor: "[Name/Role]"
      
  root_cause:
    immediate_cause: "[What triggered rollback]"
    underlying_cause: "[Root cause if known]"
    contributing_factors:
      - "[Factor 1]"
      - "[Factor 2]"
      
  lessons_learned:
    what_worked:
      - "[Item 1]"
      - "[Item 2]"
      
    what_didnt_work:
      - "[Item 1]"
      - "[Item 2]"
      
    recommendations:
      - "[Recommendation 1]"
      - "[Recommendation 2]"
      
  next_steps:
    - action: "[Action item]"
      owner: "[Name]"
      due_date: "[Date]"
      
  appendices:
    - "Rollback log"
    - "Configuration backups"
    - "Troubleshooting notes"
```

---

## 7.4.6 Rollback Testing

### Pre-Migration Rollback Test

```yaml
rollback_testing:
  when: "Before each migration"
  environment: "Lab or previous similar site"
  
  test_scenarios:
    scenario_1:
      name: "Quick rollback - LAN disconnect"
      steps:
        - "Simulate LAN cable disconnection"
        - "Execute rollback procedure"
        - "Verify connectivity restored"
      expected_duration: "< 5 minutes"
      
    scenario_2:
      name: "Interface rollback"
      steps:
        - "Re-enable MPLS interface"
        - "Revert routing"
        - "Verify traffic flow"
      expected_duration: "< 15 minutes"
      
    scenario_3:
      name: "Full rollback"
      steps:
        - "Restore MPLS router"
        - "Restore configuration"
        - "Full verification"
      expected_duration: "< 60 minutes"
      
  documentation:
    - "Record actual duration"
    - "Note any issues"
    - "Update procedure if needed"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
