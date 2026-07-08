# 6.10 Change Management

## Document Information
- **Version**: 1.0
- **Last Updated**: December 2025
- **Author**: Abhavtech Network Team
- **Classification**: Internal Use

## Overview

This section defines the change management framework for Abhavtech's SD-WAN infrastructure. Effective change management ensures controlled modifications to the production network while minimizing service disruptions and maintaining compliance.

## Change Management Framework

### Framework Architecture

```
+------------------------------------------------------------------+
|                    CHANGE MANAGEMENT FRAMEWORK                    |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------+    +------------------+    +----------------+ |
|  | Change Request   |    | Change Advisory  |    | Implementation | |
|  |                  |    | Board (CAB)      |    | Team           | |
|  | - Requestor      |--->| - Review         |--->| - Execute      | |
|  | - Classification |    | - Approve/Reject |    | - Validate     | |
|  | - Risk Assessment|    | - Schedule       |    | - Document     | |
|  +------------------+    +------------------+    +----------------+ |
|           |                      |                      |          |
|           v                      v                      v          |
|  +------------------+    +------------------+    +----------------+ |
|  | ITSM System      |    | Change Calendar  |    | Post-Implement | |
|  | (ServiceNow)     |    |                  |    | Review         | |
|  | - Ticket Tracking|    | - Maintenance    |    | - Success      | |
|  | - Workflow       |    |   Windows        |    | - Lessons      | |
|  | - Approvals      |    | - Blackouts      |    | - Metrics      | |
|  +------------------+    +------------------+    +----------------+ |
|                                                                    |
+------------------------------------------------------------------+
```

### Change Categories

| Category | Description | Approval Required | Lead Time |
|----------|-------------|-------------------|-----------|
| Standard | Pre-approved routine changes | Pre-approved | None |
| Normal | Scheduled changes requiring CAB review | CAB | 5 business days |
| Emergency | Urgent changes for critical issues | Emergency CAB | 2 hours |
| Major | High-risk or significant changes | Full CAB + Management | 10 business days |

### SD-WAN Change Types

| Change Type | Category | Examples | Risk Level |
|-------------|----------|----------|------------|
| Template Parameter | Standard | Variable update, description change | Low |
| Feature Template | Normal | New feature configuration | Medium |
| Device Template | Normal | Template assignment change | Medium |
| Policy Modification | Normal | AAR, QoS, security policy | Medium-High |
| Software Upgrade | Major | Controller or WAN Edge upgrade | High |
| Controller Change | Major | vManage cluster modification | High |
| Architecture Change | Major | New site, topology change | Very High |
| Emergency Fix | Emergency | Critical security patch, outage | Variable |

## Change Request Process

### Request Workflow

```
+-------------------------------------------------------------------------+
|                        CHANGE REQUEST WORKFLOW                           |
+-------------------------------------------------------------------------+
|                                                                          |
|    [Submit]     [Review]     [Approve]    [Schedule]   [Implement]      |
|       |            |            |             |             |            |
|       v            v            v             v             v            |
|   +-------+    +-------+    +-------+    +--------+    +--------+       |
|   |Request|    |Tech   |    |CAB    |    |Calendar|    |Execute |       |
|   |Form   |--->|Review |--->|Meeting|--->|Slot    |--->|Change  |       |
|   |       |    |       |    |       |    |        |    |        |       |
|   +-------+    +-------+    +-------+    +--------+    +--------+       |
|       |            |            |             |             |            |
|       |            v            v             |             v            |
|       |       +-------+    +-------+         |        +--------+        |
|       |       |Risk   |    |Reject/|         |        |Validate|        |
|       |       |Assess |    |Defer  |         |        |& Close |        |
|       |       +-------+    +-------+         |        +--------+        |
|       |                                      |                          |
|       +--------------------------------------+                          |
|                    Automated Notifications                              |
+-------------------------------------------------------------------------+
```

### Change Request Form

```yaml
# Change Request Template
change_request:
  # Request Information
  request_id: "CHG-SDWAN-2025-001234"
  request_date: "2025-12-30"
  requestor:
    name: "Network Engineer"
    email: "engineer@abhavtech.com"
    department: "Network Operations"
  
  # Change Details
  change_details:
    title: "Update AAR Policy for Voice Traffic"
    description: |
      Modify Application-Aware Routing policy to prioritize
      voice traffic over MPLS circuit when latency exceeds
      150ms on Internet transport.
    
    category: "Normal"
    change_type: "Policy Modification"
    environment: "Production"
    
    affected_systems:
      - "All WAN Edge devices (16 total)"
      - "Voice VPN (VPN 40)"
      - "AAR Policy POL-AAR-VOICE-v2"
    
    affected_sites:
      - "All 9 sites"
    
  # Business Justification
  business_justification:
    reason: "Improve voice quality during peak hours"
    benefits:
      - "Reduce voice quality complaints by 50%"
      - "Automatic failover for voice traffic"
    
    risk_of_not_implementing: |
      Continued voice quality issues affecting business communications.
  
  # Technical Details
  technical_details:
    current_configuration: |
      AAR policy with 100ms latency threshold on all transports.
    
    proposed_configuration: |
      AAR policy with 150ms latency threshold on Internet,
      100ms on MPLS for voice traffic.
    
    implementation_steps:
      - "Clone existing AAR policy"
      - "Modify SLA class thresholds"
      - "Update policy definition"
      - "Push to vSmart controllers"
      - "Verify policy application"
    
    rollback_procedure: |
      Revert to previous policy version stored in vManage.
      Estimated rollback time: 5 minutes.
    
    testing_plan:
      - "Verify policy syntax in lab"
      - "Test on Noida pilot site first"
      - "Monitor voice quality metrics"
      - "Gradual rollout to remaining sites"
  
  # Risk Assessment
  risk_assessment:
    impact_level: "Medium"
    probability_of_failure: "Low"
    risk_score: 6  # (Impact 3 x Probability 2)
    
    potential_impacts:
      - "Voice traffic may briefly reroute during policy push"
      - "Incorrect SLA class could affect voice path selection"
    
    mitigation_measures:
      - "Test in lab environment first"
      - "Staged rollout starting with pilot site"
      - "Real-time monitoring during implementation"
      - "Documented rollback procedure"
  
  # Schedule
  schedule:
    requested_date: "2025-01-05"
    maintenance_window: "Sunday 02:00-04:00 IST"
    estimated_duration: "45 minutes"
    implementation_duration: "30 minutes"
    validation_duration: "15 minutes"
  
  # Approvals
  approvals:
    technical_lead: "pending"
    change_manager: "pending"
    cab_decision: "pending"
```

### Risk Assessment Matrix

```
+------------------------------------------------------------------+
|                      RISK ASSESSMENT MATRIX                       |
+------------------------------------------------------------------+
|                                                                    |
|  IMPACT    |  RARE   |  UNLIKELY  |  POSSIBLE  |  LIKELY  |       |
|  LEVEL     |   (1)   |    (2)     |    (3)     |   (4)    |       |
|------------|---------|------------|------------|----------|       |
|  Critical  |    5    |    10      |    15      |   20     |       |
|    (5)     |         |            |   MAJOR    |  MAJOR   |       |
|------------|---------|------------|------------|----------|       |
|  High      |    4    |     8      |    12      |   16     |       |
|    (4)     |         |            |  NORMAL+   |  MAJOR   |       |
|------------|---------|------------|------------|----------|       |
|  Medium    |    3    |     6      |     9      |   12     |       |
|    (3)     |         |   NORMAL   |   NORMAL   | NORMAL+  |       |
|------------|---------|------------|------------|----------|       |
|  Low       |    2    |     4      |     6      |    8     |       |
|    (2)     | STANDARD|  STANDARD  |   NORMAL   |  NORMAL  |       |
|------------|---------|------------|------------|----------|       |
|  Minimal   |    1    |     2      |     3      |    4     |       |
|    (1)     | STANDARD|  STANDARD  |  STANDARD  | STANDARD |       |
+------------------------------------------------------------------+
|                                                                    |
|  Risk Score Ranges:                                                |
|  1-4:   Standard Change (Pre-approved)                            |
|  5-9:   Normal Change (CAB approval)                              |
|  10-15: Normal+ Change (CAB + Technical Lead)                     |
|  16-20: Major Change (Full CAB + Management)                      |
+------------------------------------------------------------------+
```

## Standard Changes (Pre-Approved)

### Pre-Approved Change Catalog

| Change ID | Description | Scope | Constraints |
|-----------|-------------|-------|-------------|
| STD-001 | Device description update | Single device | No service impact |
| STD-002 | Variable value change | Template variable | Non-critical parameter |
| STD-003 | Banner message update | System banner | Text only |
| STD-004 | NTP server addition | Time synchronization | Additional server only |
| STD-005 | Syslog server addition | Logging | Additional destination |
| STD-006 | SNMP community addition | Monitoring | Read-only community |
| STD-007 | Interface description | Interface config | Description field only |
| STD-008 | ACL comment addition | Access list | Comment lines only |
| STD-009 | User password reset | Local users | Password rotation |
| STD-010 | Certificate renewal | Device certificates | Before expiry |

### Standard Change Execution

```python
#!/usr/bin/env python3
"""
Standard Change Executor
Automated execution of pre-approved standard changes
"""

import requests
import json
import logging
from datetime import datetime
from typing import Dict, List, Optional

class StandardChangeExecutor:
    def __init__(self, vmanage_host: str, username: str, password: str):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
        # Pre-approved change catalog
        self.approved_changes = {
            'STD-001': self._update_device_description,
            'STD-002': self._update_template_variable,
            'STD-003': self._update_banner,
            'STD-004': self._add_ntp_server,
            'STD-005': self._add_syslog_server,
            'STD-006': self._add_snmp_community,
            'STD-007': self._update_interface_description,
        }
    
    def authenticate(self, username: str, password: str):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        response = self.session.post(
            auth_url,
            data={'j_username': username, 'j_password': password}
        )
        
        # Get XSRF token
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
    
    def execute_standard_change(
        self,
        change_id: str,
        parameters: Dict,
        requestor: str
    ) -> Dict:
        """Execute a pre-approved standard change"""
        
        # Validate change is in approved catalog
        if change_id not in self.approved_changes:
            return {
                'status': 'rejected',
                'reason': f'Change {change_id} not in pre-approved catalog'
            }
        
        # Log change initiation
        change_record = {
            'change_id': change_id,
            'timestamp': datetime.now().isoformat(),
            'requestor': requestor,
            'parameters': parameters,
            'status': 'in_progress'
        }
        
        logging.info(f"Executing standard change: {change_record}")
        
        try:
            # Execute the change
            handler = self.approved_changes[change_id]
            result = handler(parameters)
            
            change_record['status'] = 'completed'
            change_record['result'] = result
            
        except Exception as e:
            change_record['status'] = 'failed'
            change_record['error'] = str(e)
            logging.error(f"Standard change failed: {e}")
        
        return change_record
    
    def _update_device_description(self, params: Dict) -> Dict:
        """STD-001: Update device description"""
        device_id = params['device_id']
        description = params['description']
        
        url = f"{self.base_url}/dataservice/system/device/{device_id}"
        response = self.session.put(
            url,
            json={'description': description}
        )
        
        return {
            'device_id': device_id,
            'new_description': description,
            'status_code': response.status_code
        }
    
    def _update_template_variable(self, params: Dict) -> Dict:
        """STD-002: Update template variable value"""
        device_id = params['device_id']
        template_id = params['template_id']
        variable_name = params['variable_name']
        new_value = params['new_value']
        
        # Get current device values
        url = f"{self.base_url}/dataservice/template/device/config/input"
        response = self.session.get(
            url,
            params={'templateId': template_id, 'deviceIds': [device_id]}
        )
        
        device_input = response.json()['data'][0]
        device_input[variable_name] = new_value
        
        # Push updated values
        push_url = f"{self.base_url}/dataservice/template/device/config/attachfeature"
        push_response = self.session.post(
            push_url,
            json={
                'deviceTemplateList': [{
                    'templateId': template_id,
                    'device': [device_input],
                    'isEdited': True
                }]
            }
        )
        
        return {
            'device_id': device_id,
            'variable': variable_name,
            'new_value': new_value,
            'push_id': push_response.json().get('id')
        }
    
    def _update_banner(self, params: Dict) -> Dict:
        """STD-003: Update system banner"""
        template_id = params['template_id']
        banner_text = params['banner_text']
        
        # Update banner feature template
        url = f"{self.base_url}/dataservice/template/feature/{template_id}"
        
        # Get current template
        response = self.session.get(url)
        template = response.json()
        
        # Update banner
        template['templateDefinition']['banner']['login'] = banner_text
        
        # Save template
        put_response = self.session.put(url, json=template)
        
        return {
            'template_id': template_id,
            'banner_updated': True,
            'status_code': put_response.status_code
        }
    
    def _add_ntp_server(self, params: Dict) -> Dict:
        """STD-004: Add NTP server"""
        template_id = params['template_id']
        ntp_server = params['ntp_server']
        
        url = f"{self.base_url}/dataservice/template/feature/{template_id}"
        response = self.session.get(url)
        template = response.json()
        
        # Add NTP server to list
        if 'server' not in template['templateDefinition']['ntp']:
            template['templateDefinition']['ntp']['server'] = []
        
        template['templateDefinition']['ntp']['server'].append({
            'name': {'vipType': 'constant', 'vipValue': ntp_server},
            'prefer': {'vipType': 'constant', 'vipValue': False}
        })
        
        put_response = self.session.put(url, json=template)
        
        return {
            'template_id': template_id,
            'ntp_server_added': ntp_server,
            'status_code': put_response.status_code
        }
    
    def _add_syslog_server(self, params: Dict) -> Dict:
        """STD-005: Add syslog server"""
        template_id = params['template_id']
        syslog_server = params['syslog_server']
        
        url = f"{self.base_url}/dataservice/template/feature/{template_id}"
        response = self.session.get(url)
        template = response.json()
        
        # Add syslog server
        if 'server' not in template['templateDefinition']['logging']:
            template['templateDefinition']['logging']['server'] = []
        
        template['templateDefinition']['logging']['server'].append({
            'name': {'vipType': 'constant', 'vipValue': syslog_server}
        })
        
        put_response = self.session.put(url, json=template)
        
        return {
            'template_id': template_id,
            'syslog_server_added': syslog_server,
            'status_code': put_response.status_code
        }
    
    def _add_snmp_community(self, params: Dict) -> Dict:
        """STD-006: Add SNMP community (read-only)"""
        template_id = params['template_id']
        community = params['community']
        
        url = f"{self.base_url}/dataservice/template/feature/{template_id}"
        response = self.session.get(url)
        template = response.json()
        
        # Add SNMP community (read-only only)
        if 'community' not in template['templateDefinition']['snmp']:
            template['templateDefinition']['snmp']['community'] = []
        
        template['templateDefinition']['snmp']['community'].append({
            'name': {'vipType': 'constant', 'vipValue': community},
            'authorization': {'vipType': 'constant', 'vipValue': 'read-only'}
        })
        
        put_response = self.session.put(url, json=template)
        
        return {
            'template_id': template_id,
            'community_added': community,
            'access': 'read-only',
            'status_code': put_response.status_code
        }
    
    def _update_interface_description(self, params: Dict) -> Dict:
        """STD-007: Update interface description"""
        device_id = params['device_id']
        interface = params['interface']
        description = params['description']
        
        # Use CLI template for interface description
        cli_config = f"interface {interface}\n description {description}"
        
        url = f"{self.base_url}/dataservice/template/config/device/mode/cli"
        response = self.session.post(
            url,
            json={
                'deviceId': device_id,
                'deviceConfig': cli_config
            }
        )
        
        return {
            'device_id': device_id,
            'interface': interface,
            'description': description,
            'status_code': response.status_code
        }


# Example usage
if __name__ == "__main__":
    executor = StandardChangeExecutor(
        vmanage_host="vmanage.abhavtech.com",
        username="admin",
        password="secure_password"
    )
    
    # Execute standard change
    result = executor.execute_standard_change(
        change_id='STD-001',
        parameters={
            'device_id': 'IN-MUM-WAN-EDGE-01',
            'description': 'Mumbai Primary WAN Edge - Updated Dec 2025'
        },
        requestor='engineer@abhavtech.com'
    )
    
    print(json.dumps(result, indent=2))
```

## Normal Change Process

### CAB Meeting Structure

```
+------------------------------------------------------------------+
|                    CAB MEETING STRUCTURE                          |
+------------------------------------------------------------------+
|                                                                    |
|  Frequency: Weekly (Thursday 14:00-15:00 IST)                     |
|  Emergency CAB: On-demand (2-hour notice minimum)                 |
|                                                                    |
|  +------------------------------------------------------------+  |
|  |                      CAB Members                            |  |
|  |------------------------------------------------------------|  |
|  | Role                    | Responsibility                    |  |
|  |-------------------------|-----------------------------------|  |
|  | Change Manager (Chair)  | Meeting facilitation, decisions   |  |
|  | Network Manager         | Technical approval, risk sign-off |  |
|  | Security Lead           | Security impact assessment        |  |
|  | Operations Lead         | Operational readiness             |  |
|  | Application Owner       | Business impact assessment        |  |
|  | Service Desk Lead       | User communication                |  |
|  +------------------------------------------------------------+  |
|                                                                    |
|  Agenda:                                                          |
|  1. Review of previous changes (5 min)                            |
|  2. Emergency changes since last meeting (5 min)                  |
|  3. Normal change requests (40 min)                               |
|  4. Major change planning (10 min)                                |
|                                                                    |
|  Decision Options:                                                 |
|  - Approved (proceed as planned)                                  |
|  - Approved with conditions (requires modifications)              |
|  - Deferred (needs more information)                              |
|  - Rejected (risk too high or not justified)                      |
+------------------------------------------------------------------+
```

### Change Implementation Checklist

```yaml
# Change Implementation Checklist
change_implementation:
  pre_implementation:
    - task: "Verify change approval"
      responsible: "Change Manager"
      verification: "CAB approval email received"
    
    - task: "Review implementation plan"
      responsible: "Implementation Lead"
      verification: "Plan reviewed and understood"
    
    - task: "Verify backup completed"
      responsible: "Operations Team"
      verification: "Backup timestamp within 24 hours"
    
    - task: "Confirm rollback procedure"
      responsible: "Implementation Lead"
      verification: "Rollback steps documented and tested"
    
    - task: "Notify stakeholders"
      responsible: "Service Desk"
      verification: "Notification sent to distribution list"
    
    - task: "Verify maintenance window"
      responsible: "Change Manager"
      verification: "Window confirmed, no conflicts"
    
    - task: "Gather implementation team"
      responsible: "Implementation Lead"
      verification: "All required personnel available"
  
  implementation:
    - task: "Start implementation log"
      time: "T+0"
      action: "Document start time and initial state"
    
    - task: "Take pre-change snapshot"
      time: "T+5 min"
      action: "Capture current configuration and metrics"
    
    - task: "Execute change steps"
      time: "T+10 min"
      action: "Follow implementation procedure"
    
    - task: "Verify change applied"
      time: "T+30 min"
      action: "Confirm configuration change active"
    
    - task: "Run validation tests"
      time: "T+35 min"
      action: "Execute test cases per plan"
    
    - task: "Monitor for issues"
      time: "T+45 min"
      action: "Watch dashboards and alerts"
  
  post_implementation:
    - task: "Document results"
      responsible: "Implementation Lead"
      verification: "Implementation log completed"
    
    - task: "Update CMDB"
      responsible: "Operations Team"
      verification: "Configuration items updated"
    
    - task: "Close change ticket"
      responsible: "Change Manager"
      verification: "Ticket closed with outcomes"
    
    - task: "Send completion notification"
      responsible: "Service Desk"
      verification: "Stakeholders notified"
    
    - task: "Schedule PIR if required"
      responsible: "Change Manager"
      verification: "PIR scheduled for major changes"
```

## Emergency Change Process

### Emergency Change Workflow

```
+------------------------------------------------------------------+
|                   EMERGENCY CHANGE WORKFLOW                       |
+------------------------------------------------------------------+
|                                                                    |
|  Trigger: Critical incident requiring immediate change            |
|                                                                    |
|  [Incident]                                                       |
|      |                                                            |
|      v                                                            |
|  +------------------+                                             |
|  | Emergency Change |    Criteria:                                |
|  | Required?        |    - Critical service impacted              |
|  +------------------+    - No workaround available                |
|      |     |             - Immediate action needed                |
|     Yes    No                                                      |
|      |      |                                                      |
|      v      v                                                      |
|  +------+  [Normal Process]                                       |
|  |Create|                                                         |
|  |ECAB  |                                                         |
|  |Request|                                                        |
|  +------+                                                         |
|      |                                                            |
|      v                                                            |
|  +------------------+                                             |
|  | Emergency CAB    |    Members:                                 |
|  | (Virtual/Call)   |    - On-call Network Manager                |
|  +------------------+    - On-call Security Lead                  |
|      |                   - Incident Manager                       |
|      v                                                            |
|  +------------------+                                             |
|  | Verbal Approval  |    Documentation:                           |
|  | + Implementation |    - Record approvers                       |
|  +------------------+    - Record decision time                   |
|      |                   - Implementation log                     |
|      v                                                            |
|  +------------------+                                             |
|  | Post-Implement   |    Within 24 hours:                         |
|  | Documentation    |    - Complete change record                 |
|  +------------------+    - PIR scheduled                          |
|      |                   - Lessons learned                        |
|      v                                                            |
|  [Next CAB Review]                                                |
|                                                                    |
+------------------------------------------------------------------+
```

### Emergency Change Record

```python
#!/usr/bin/env python3
"""
Emergency Change Record
Documents emergency changes for compliance
"""

import json
from datetime import datetime
from typing import Dict, List

class EmergencyChangeRecord:
    def __init__(self):
        self.record = {
            'change_type': 'Emergency',
            'status': 'initiated',
            'timestamps': {},
            'approvals': [],
            'implementation': [],
            'validation': []
        }
    
    def initiate(
        self,
        incident_id: str,
        description: str,
        requestor: str,
        justification: str
    ):
        """Initiate emergency change record"""
        self.record['incident_id'] = incident_id
        self.record['description'] = description
        self.record['requestor'] = requestor
        self.record['justification'] = justification
        self.record['timestamps']['initiated'] = datetime.now().isoformat()
        self.record['change_id'] = f"ECAB-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        return self.record['change_id']
    
    def record_approval(
        self,
        approver: str,
        role: str,
        decision: str,
        method: str = "verbal"
    ):
        """Record ECAB approval"""
        approval = {
            'approver': approver,
            'role': role,
            'decision': decision,
            'method': method,
            'timestamp': datetime.now().isoformat()
        }
        self.record['approvals'].append(approval)
        
        if decision == 'approved':
            self.record['status'] = 'approved'
            self.record['timestamps']['approved'] = datetime.now().isoformat()
    
    def record_implementation_step(
        self,
        step: str,
        result: str,
        executor: str
    ):
        """Record implementation step"""
        impl_step = {
            'step': step,
            'result': result,
            'executor': executor,
            'timestamp': datetime.now().isoformat()
        }
        self.record['implementation'].append(impl_step)
        
        if self.record['status'] == 'approved':
            self.record['status'] = 'in_progress'
            self.record['timestamps']['started'] = datetime.now().isoformat()
    
    def record_validation(
        self,
        test: str,
        result: str,
        evidence: str
    ):
        """Record validation test result"""
        validation = {
            'test': test,
            'result': result,
            'evidence': evidence,
            'timestamp': datetime.now().isoformat()
        }
        self.record['validation'].append(validation)
    
    def complete(self, outcome: str, notes: str):
        """Complete the emergency change"""
        self.record['outcome'] = outcome
        self.record['notes'] = notes
        self.record['status'] = 'completed'
        self.record['timestamps']['completed'] = datetime.now().isoformat()
        
        # Calculate duration
        start = datetime.fromisoformat(self.record['timestamps']['initiated'])
        end = datetime.fromisoformat(self.record['timestamps']['completed'])
        self.record['duration_minutes'] = (end - start).total_seconds() / 60
    
    def generate_report(self) -> str:
        """Generate emergency change report"""
        report = f"""
EMERGENCY CHANGE REPORT
=======================
Change ID: {self.record['change_id']}
Incident ID: {self.record['incident_id']}
Status: {self.record['status']}

JUSTIFICATION
-------------
{self.record['justification']}

DESCRIPTION
-----------
{self.record['description']}

APPROVALS
---------
"""
        for approval in self.record['approvals']:
            report += f"- {approval['approver']} ({approval['role']}): "
            report += f"{approval['decision']} via {approval['method']} "
            report += f"at {approval['timestamp']}\n"
        
        report += """
IMPLEMENTATION STEPS
--------------------
"""
        for step in self.record['implementation']:
            report += f"- [{step['timestamp']}] {step['step']}: {step['result']}\n"
        
        report += """
VALIDATION
----------
"""
        for val in self.record['validation']:
            report += f"- {val['test']}: {val['result']}\n"
        
        if self.record['status'] == 'completed':
            report += f"""
OUTCOME
-------
{self.record['outcome']}

Duration: {self.record['duration_minutes']:.1f} minutes
Notes: {self.record['notes']}
"""
        
        return report
    
    def save(self, filepath: str):
        """Save record to file"""
        with open(filepath, 'w') as f:
            json.dump(self.record, f, indent=2)


# Example usage
if __name__ == "__main__":
    # Create emergency change record
    ecr = EmergencyChangeRecord()
    
    # Initiate
    change_id = ecr.initiate(
        incident_id="INC-2025-005678",
        description="Apply critical security patch to vSmart controllers",
        requestor="security@abhavtech.com",
        justification="CVE-2025-XXXX vulnerability requires immediate patching"
    )
    
    # Record approvals
    ecr.record_approval(
        approver="John Smith",
        role="On-call Network Manager",
        decision="approved",
        method="phone"
    )
    
    ecr.record_approval(
        approver="Jane Doe",
        role="Security Lead",
        decision="approved",
        method="email"
    )
    
    # Record implementation
    ecr.record_implementation_step(
        step="Backup vSmart configuration",
        result="Success",
        executor="engineer@abhavtech.com"
    )
    
    ecr.record_implementation_step(
        step="Apply security patch to vSmart-1",
        result="Success",
        executor="engineer@abhavtech.com"
    )
    
    ecr.record_implementation_step(
        step="Apply security patch to vSmart-2",
        result="Success",
        executor="engineer@abhavtech.com"
    )
    
    # Record validation
    ecr.record_validation(
        test="vSmart control connections",
        result="Pass",
        evidence="show sdwan control connections - all established"
    )
    
    ecr.record_validation(
        test="WAN Edge reconnection",
        result="Pass",
        evidence="All 16 WAN Edges reconnected within 5 minutes"
    )
    
    # Complete
    ecr.complete(
        outcome="Successful",
        notes="Security patch applied to both vSmart controllers with no service impact"
    )
    
    # Generate report
    print(ecr.generate_report())
    
    # Save record
    ecr.save(f"/var/log/sdwan/emergency_changes/{change_id}.json")
```

## Change Calendar Management

### Maintenance Windows

| Window Type | Schedule | Duration | Scope |
|-------------|----------|----------|-------|
| Weekly Maintenance | Sunday 02:00-06:00 IST | 4 hours | Standard changes |
| Monthly Maintenance | First Sunday 00:00-06:00 IST | 6 hours | Major changes |
| Quarterly Maintenance | First Sunday of Q1/Q2/Q3/Q4 | 8 hours | Architecture changes |
| Emergency Window | On-demand | As needed | Critical fixes |

### Change Blackout Periods

```yaml
# Change Blackout Configuration
blackout_periods:
  annual:
    - name: "Fiscal Year End"
      start: "2025-03-25"
      end: "2025-04-05"
      reason: "Financial close activities"
      exceptions: "Emergency changes only"
    
    - name: "Holiday Freeze"
      start: "2025-12-20"
      end: "2026-01-05"
      reason: "Holiday period - reduced staff"
      exceptions: "Security patches only"
  
  recurring:
    - name: "Month End"
      days: [28, 29, 30, 31, 1]
      reason: "Financial processing"
      exceptions: "Pre-approved standard changes"
    
    - name: "Quarter End"
      months: [3, 6, 9, 12]
      days: [25, 26, 27, 28, 29, 30, 31]
      reason: "Quarter close activities"
      exceptions: "Emergency changes only"
  
  business_critical:
    - name: "Board Meeting Week"
      dates: ["2025-02-15", "2025-05-15", "2025-08-15", "2025-11-15"]
      window: 3  # days before and after
      reason: "Executive connectivity critical"
      exceptions: "None"
```

## Post-Implementation Review (PIR)

### PIR Process

```
+------------------------------------------------------------------+
|                 POST-IMPLEMENTATION REVIEW                        |
+------------------------------------------------------------------+
|                                                                    |
|  When Required:                                                   |
|  - All Major changes                                              |
|  - Failed changes                                                 |
|  - Emergency changes                                              |
|  - Changes with unexpected outcomes                               |
|                                                                    |
|  Timeline: Within 5 business days of implementation               |
|                                                                    |
|  +------------------------------------------------------------+  |
|  |                    PIR Template                             |  |
|  |------------------------------------------------------------|  |
|  | Section              | Contents                             |  |
|  |----------------------|--------------------------------------|  |
|  | Change Summary       | ID, description, date, outcome       |  |
|  | What Went Well       | Successful aspects                   |  |
|  | What Could Improve   | Areas for improvement                |  |
|  | Unexpected Issues    | Problems encountered                 |  |
|  | Root Cause           | Analysis of any failures             |  |
|  | Lessons Learned      | Key takeaways                        |  |
|  | Action Items         | Follow-up tasks with owners          |  |
|  +------------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### PIR Report Template

```markdown
# Post-Implementation Review Report

## Change Information
| Field | Value |
|-------|-------|
| Change ID | CHG-SDWAN-2025-001234 |
| Title | AAR Policy Update for Voice Traffic |
| Implementation Date | 2025-01-05 02:00 IST |
| Implementer | Network Engineer |
| Outcome | Successful |

## Summary
Brief description of the change and its business purpose.

## What Went Well
- Implementation completed within scheduled window
- No service disruption observed
- All validation tests passed
- Rollback procedure ready but not needed

## What Could Be Improved
- Pre-change testing could include more edge cases
- Communication to application team was delayed
- Documentation could be more detailed

## Unexpected Issues
None encountered during this change.

## Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| Implementation Time | 45 min | 38 min |
| Validation Time | 15 min | 12 min |
| Service Impact | 0 min | 0 min |
| Rollback Required | No | No |

## Lessons Learned
1. Voice traffic SLA improvements visible within 30 minutes
2. AAR policy changes propagate faster than expected
3. Consider pilot site testing for all policy changes

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Update change template with pilot step | Change Manager | 2025-01-15 | Open |
| Create voice traffic monitoring dashboard | Operations | 2025-01-20 | Open |

## Approvals
- Change Manager: [Signature]
- Technical Lead: [Signature]
- Date: 2025-01-07
```

## Change Metrics and Reporting

### Key Performance Indicators

| KPI | Target | Measurement |
|-----|--------|-------------|
| Change Success Rate | >95% | Successful / Total changes |
| Emergency Change Rate | <5% | Emergency / Total changes |
| Mean Time to Implement | <2 hours | Average implementation time |
| Change-Related Incidents | <2% | Incidents caused by changes |
| PIR Completion Rate | 100% | PIRs completed / Required |
| Change on Time | >90% | Implemented on schedule |

### Monthly Change Report

```python
#!/usr/bin/env python3
"""
Change Management Metrics Reporter
Generates monthly change management metrics
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List
from collections import Counter

class ChangeMetricsReporter:
    def __init__(self, change_records: List[Dict]):
        self.records = change_records
    
    def calculate_metrics(self, month: int, year: int) -> Dict:
        """Calculate change metrics for specified month"""
        
        # Filter records for the month
        month_records = [
            r for r in self.records
            if self._is_in_month(r['implementation_date'], month, year)
        ]
        
        total = len(month_records)
        if total == 0:
            return {'error': 'No changes found for specified month'}
        
        # Calculate metrics
        successful = len([r for r in month_records if r['outcome'] == 'Successful'])
        failed = len([r for r in month_records if r['outcome'] == 'Failed'])
        rollback = len([r for r in month_records if r.get('rollback_required', False)])
        
        emergency = len([r for r in month_records if r['category'] == 'Emergency'])
        standard = len([r for r in month_records if r['category'] == 'Standard'])
        normal = len([r for r in month_records if r['category'] == 'Normal'])
        major = len([r for r in month_records if r['category'] == 'Major'])
        
        # Implementation time
        impl_times = [r.get('implementation_duration', 0) for r in month_records]
        avg_impl_time = sum(impl_times) / len(impl_times) if impl_times else 0
        
        # Change-related incidents
        incidents = len([r for r in month_records if r.get('caused_incident', False)])
        
        metrics = {
            'period': f"{year}-{month:02d}",
            'total_changes': total,
            'by_category': {
                'standard': standard,
                'normal': normal,
                'major': major,
                'emergency': emergency
            },
            'outcomes': {
                'successful': successful,
                'failed': failed,
                'rollback': rollback
            },
            'kpis': {
                'success_rate': round((successful / total) * 100, 1),
                'emergency_rate': round((emergency / total) * 100, 1),
                'avg_implementation_minutes': round(avg_impl_time, 1),
                'incident_rate': round((incidents / total) * 100, 1)
            },
            'trends': self._calculate_trends(month, year)
        }
        
        return metrics
    
    def _is_in_month(self, date_str: str, month: int, year: int) -> bool:
        """Check if date is in specified month"""
        try:
            date = datetime.fromisoformat(date_str)
            return date.month == month and date.year == year
        except:
            return False
    
    def _calculate_trends(self, month: int, year: int) -> Dict:
        """Calculate trends compared to previous month"""
        # Previous month
        prev_month = month - 1 if month > 1 else 12
        prev_year = year if month > 1 else year - 1
        
        current = self.calculate_metrics(month, year) if month != datetime.now().month else None
        previous = self.calculate_metrics(prev_month, prev_year)
        
        if not current or 'error' in current or 'error' in previous:
            return {'available': False}
        
        return {
            'available': True,
            'volume_change': current['total_changes'] - previous['total_changes'],
            'success_rate_change': current['kpis']['success_rate'] - previous['kpis']['success_rate']
        }
    
    def generate_report(self, month: int, year: int) -> str:
        """Generate formatted metrics report"""
        metrics = self.calculate_metrics(month, year)
        
        if 'error' in metrics:
            return metrics['error']
        
        report = f"""
CHANGE MANAGEMENT MONTHLY REPORT
================================
Period: {metrics['period']}

VOLUME SUMMARY
--------------
Total Changes: {metrics['total_changes']}
  - Standard: {metrics['by_category']['standard']}
  - Normal: {metrics['by_category']['normal']}
  - Major: {metrics['by_category']['major']}
  - Emergency: {metrics['by_category']['emergency']}

OUTCOMES
--------
Successful: {metrics['outcomes']['successful']}
Failed: {metrics['outcomes']['failed']}
Rollback Required: {metrics['outcomes']['rollback']}

KEY PERFORMANCE INDICATORS
--------------------------
Success Rate: {metrics['kpis']['success_rate']}% (Target: >95%)
Emergency Rate: {metrics['kpis']['emergency_rate']}% (Target: <5%)
Avg Implementation: {metrics['kpis']['avg_implementation_minutes']} min (Target: <120 min)
Incident Rate: {metrics['kpis']['incident_rate']}% (Target: <2%)

STATUS
------
"""
        # Add status indicators
        if metrics['kpis']['success_rate'] >= 95:
            report += "✓ Success Rate: ON TARGET\n"
        else:
            report += "✗ Success Rate: BELOW TARGET\n"
        
        if metrics['kpis']['emergency_rate'] <= 5:
            report += "✓ Emergency Rate: ON TARGET\n"
        else:
            report += "✗ Emergency Rate: ABOVE TARGET\n"
        
        return report


# Example usage
if __name__ == "__main__":
    # Sample change records
    sample_records = [
        {'implementation_date': '2025-01-05', 'category': 'Normal', 
         'outcome': 'Successful', 'implementation_duration': 45},
        {'implementation_date': '2025-01-10', 'category': 'Standard', 
         'outcome': 'Successful', 'implementation_duration': 15},
        {'implementation_date': '2025-01-15', 'category': 'Emergency', 
         'outcome': 'Successful', 'implementation_duration': 60, 'caused_incident': False},
    ]
    
    reporter = ChangeMetricsReporter(sample_records)
    print(reporter.generate_report(1, 2025))
```

## Quick Reference

### Change Process Cheat Sheet

```
+------------------------------------------------------------------+
|                  CHANGE PROCESS QUICK REFERENCE                   |
+------------------------------------------------------------------+
|                                                                    |
|  STANDARD CHANGE                                                  |
|  ---------------                                                  |
|  1. Verify change is in pre-approved catalog                      |
|  2. Execute change                                                |
|  3. Document completion                                           |
|  Lead Time: None | Approval: Pre-approved                         |
|                                                                    |
|  NORMAL CHANGE                                                    |
|  -------------                                                    |
|  1. Submit change request (5 days before)                         |
|  2. Technical review and risk assessment                          |
|  3. CAB review and approval                                       |
|  4. Schedule maintenance window                                   |
|  5. Execute and validate                                          |
|  6. Close change ticket                                           |
|  Lead Time: 5 days | Approval: CAB                                |
|                                                                    |
|  MAJOR CHANGE                                                     |
|  ------------                                                     |
|  1. Submit detailed change request (10 days before)               |
|  2. Technical and security review                                 |
|  3. Full CAB + management approval                                |
|  4. Pilot/staged implementation plan                              |
|  5. Execute with dedicated monitoring                             |
|  6. PIR within 5 days                                             |
|  Lead Time: 10 days | Approval: CAB + Management                  |
|                                                                    |
|  EMERGENCY CHANGE                                                 |
|  ----------------                                                 |
|  1. Identify critical need                                        |
|  2. Convene emergency CAB (phone/virtual)                         |
|  3. Verbal approval from authorized personnel                     |
|  4. Execute immediately                                           |
|  5. Document within 24 hours                                      |
|  6. PIR mandatory                                                 |
|  Lead Time: 2 hours | Approval: Emergency CAB                     |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  CAB Contact: cab@abhavtech.com                                   |
|  Emergency: +91-XXXX-XXXXXX (Network On-Call)                     |
|  Change Portal: https://servicenow.abhavtech.com/change           |
|                                                                    |
+------------------------------------------------------------------+
```

---

*Document version: 1.0*
*Last updated: December 2025*
*Classification: Internal Use*
