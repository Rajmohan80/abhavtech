# 6.19 NOC Operations

## 6.19.1 NOC Organization Structure

### NOC Team Structure

```yaml
noc_organization:
  team_structure:
    noc_manager:
      role: "NOC Manager"
      responsibilities:
        - "Overall NOC operations"
        - "Staff management"
        - "Escalation point"
        - "Process improvement"
      reports_to: "IT Director"
      
    tier_1_operators:
      role: "NOC Operator - Tier 1"
      count: 4
      shift_coverage: "24x7"
      responsibilities:
        - "First-line alert monitoring"
        - "Initial triage and classification"
        - "Standard ticket creation"
        - "Basic troubleshooting"
        - "Escalation to Tier 2"
      skills_required:
        - "Basic networking (CCNA level)"
        - "SD-WAN fundamentals"
        - "ITSM tools"
        
    tier_2_engineers:
      role: "Network Engineer - Tier 2"
      count: 3
      shift_coverage: "Business hours + on-call"
      responsibilities:
        - "Advanced troubleshooting"
        - "Configuration changes"
        - "Incident resolution"
        - "Root cause analysis"
        - "Escalation to Tier 3"
      skills_required:
        - "CCNP level networking"
        - "SD-WAN certified"
        - "Scripting/automation"
        
    tier_3_specialists:
      role: "Senior Network Engineer - Tier 3"
      count: 2
      shift_coverage: "Business hours + on-call"
      responsibilities:
        - "Complex problem resolution"
        - "Architecture decisions"
        - "Vendor escalations"
        - "Major incident management"
        - "Knowledge transfer"
      skills_required:
        - "CCIE level expertise"
        - "SD-WAN expert"
        - "Multi-vendor experience"
```

### Shift Schedule

```yaml
noc_shifts:
  24x7_coverage:
    shift_a:
      name: "Morning Shift"
      hours: "06:00 - 14:00 IST"
      staff:
        - "1 Tier 1 Operator"
        - "1 Tier 2 Engineer (business hours)"
        
    shift_b:
      name: "Afternoon Shift"
      hours: "14:00 - 22:00 IST"
      staff:
        - "1 Tier 1 Operator"
        - "1 Tier 2 Engineer"
        
    shift_c:
      name: "Night Shift"
      hours: "22:00 - 06:00 IST"
      staff:
        - "1 Tier 1 Operator"
        - "Tier 2 on-call"
        
  on_call_rotation:
    tier_2:
      rotation: "Weekly"
      response_time: "15 minutes"
      
    tier_3:
      rotation: "Weekly"
      response_time: "30 minutes"
      
  holiday_coverage:
    approach: "Skeleton crew + enhanced on-call"
    compensation: "Time-off-in-lieu or overtime"
```

---

## 6.19.2 NOC Workspace Setup

### Physical NOC Layout

```
+------------------------------------------------------------------+
|                         NOC OPERATIONS CENTER                      |
+------------------------------------------------------------------+
|                                                                    |
|  +------------+  +------------+  +------------+  +------------+   |
|  | Operator 1 |  | Operator 2 |  | Operator 3 |  | Engineer   |   |
|  | Workstation|  | Workstation|  | Workstation|  | Workstation|   |
|  +------------+  +------------+  +------------+  +------------+   |
|                                                                    |
|  +------------------------------------------------------------+   |
|  |                      VIDEO WALL                             |   |
|  |  +----------+ +----------+ +----------+ +----------+        |   |
|  |  |SD-WAN    | |Network   | |Incident  | |SLA       |        |   |
|  |  |Dashboard | |Topology  | |Queue     | |Dashboard |        |   |
|  |  +----------+ +----------+ +----------+ +----------+        |   |
|  |  +----------+ +----------+ +----------+ +----------+        |   |
|  |  |Alarm     | |Weather/  | |News/     | |Comms     |        |   |
|  |  |Console   | |Traffic   | |Alerts    | |Status    |        |   |
|  |  +----------+ +----------+ +----------+ +----------+        |   |
|  +------------------------------------------------------------+   |
|                                                                    |
|  +------------------+                    +------------------+      |
|  | WAR ROOM         |                    | MANAGER OFFICE   |      |
|  | (Major Incidents)|                    |                  |      |
|  +------------------+                    +------------------+      |
|                                                                    |
+------------------------------------------------------------------+
```

### NOC Tools and Systems

```yaml
noc_tools:
  primary_monitoring:
    sd_wan_manager:
      url: "https://vmanage.abhavtech.com"
      purpose: "SD-WAN monitoring and management"
      screens: "Dashboard, Alarms, Topology"
      
    catalyst_center:
      url: "https://dnac.abhavtech.com"
      purpose: "SD-Access and campus monitoring"
      screens: "Assurance, Issues"
      
  itsm_tools:
    servicenow:
      url: "https://abhavtech.service-now.com"
      purpose: "Incident/change management"
      
  communication:
    teams:
      channels:
        - "#noc-operations"
        - "#noc-escalations"
        - "#network-alerts"
      purpose: "Team collaboration"
      
    pagerduty:
      purpose: "On-call alerting"
      
    bridge_line:
      number: "+91-xxx-xxx-xxxx"
      purpose: "Major incident bridge"
      
  supplementary:
    splunk:
      purpose: "Log analysis"
      
    grafana:
      purpose: "Custom dashboards"
      
    netbox:
      purpose: "IP address management"
```

---

## 6.19.3 Daily NOC Operations

### Shift Handover Procedure

```yaml
shift_handover:
  procedure_id: "NOC-SH-001"
  duration: "15 minutes"
  
  handover_checklist:
    outgoing_shift:
      - "Complete shift log entry"
      - "Document all open incidents"
      - "Note any ongoing activities"
      - "List pending tasks"
      - "Highlight critical items"
      
    incoming_shift:
      - "Review shift log"
      - "Check dashboard status"
      - "Review open incidents"
      - "Verify on-call contacts"
      - "Acknowledge handover"
      
  documentation:
    shift_log:
      location: "ServiceNow Knowledge Base"
      format: "Structured template"
      retention: "90 days"
      
  handover_template: |
    SHIFT HANDOVER LOG
    ==================
    Date: [DATE]
    Outgoing Shift: [SHIFT] - [OPERATOR NAME]
    Incoming Shift: [SHIFT] - [OPERATOR NAME]
    
    CURRENT STATUS:
    - Overall Network: [GREEN/YELLOW/RED]
    - Active Alarms: [COUNT]
    - Open Incidents: [COUNT]
    
    ONGOING ACTIVITIES:
    [List of activities]
    
    PENDING TASKS:
    [List of tasks]
    
    CRITICAL ITEMS:
    [List of critical items requiring attention]
    
    NOTES:
    [Additional information]
    
    Handover Completed: [TIME]
    Acknowledged By: [NAME]
```

### Daily Health Check Routine

```yaml
daily_health_check:
  schedule: "08:00, 16:00, 00:00 IST"
  duration: "30 minutes"
  
  check_sequence:
    step_1:
      name: "Controller Health"
      actions:
        - "Verify all controllers operational"
        - "Check cluster status"
        - "Review certificate expiry"
      dashboard: "vManage > Administration > Cluster Management"
      
    step_2:
      name: "Device Status"
      actions:
        - "Check all devices reachable"
        - "Review control connections"
        - "Verify BFD sessions"
      dashboard: "vManage > Monitor > Network"
      
    step_3:
      name: "Active Alarms"
      actions:
        - "Review all active alarms"
        - "Prioritize critical alarms"
        - "Create tickets if needed"
      dashboard: "vManage > Monitor > Alarms"
      
    step_4:
      name: "Performance Check"
      actions:
        - "Review latency metrics"
        - "Check packet loss"
        - "Verify application performance"
      dashboard: "vManage > Monitor > Application-Aware Routing"
      
    step_5:
      name: "SD-Access Integration"
      actions:
        - "Verify BGP sessions"
        - "Check handoff status"
        - "Review Catalyst Center issues"
      dashboard: "Catalyst Center > Assurance"
      
    step_6:
      name: "Documentation"
      actions:
        - "Update health check log"
        - "Note any issues"
        - "Create action items"
```

### NOC Daily Checklist Script

```python
#!/usr/bin/env python3
"""
NOC Daily Health Check Automation
Performs automated health checks and generates report
"""

import requests
import json
from datetime import datetime

class NOCHealthChecker:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        self.results = []
        
    def authenticate(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(auth_url, data=payload)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def check(self, name, check_func, severity='INFO'):
        """Execute a health check"""
        try:
            result = check_func()
            self.results.append({
                'name': name,
                'status': result['status'],
                'details': result.get('details', ''),
                'severity': severity if result['status'] != 'PASS' else 'INFO'
            })
        except Exception as e:
            self.results.append({
                'name': name,
                'status': 'ERROR',
                'details': str(e),
                'severity': 'HIGH'
            })
            
    def check_controller_status(self):
        """Check controller cluster status"""
        url = f"{self.base_url}/dataservice/clusterManagement/list"
        response = self.session.get(url)
        
        if response.status_code == 200:
            nodes = response.json().get('data', [])
            healthy = all(n.get('configurationDBClusterStatus') == 'normal' for n in nodes)
            return {
                'status': 'PASS' if healthy else 'FAIL',
                'details': f"{len(nodes)} nodes, all healthy" if healthy else "Cluster degraded"
            }
        return {'status': 'ERROR', 'details': 'Unable to check cluster status'}
        
    def check_device_reachability(self):
        """Check device reachability"""
        url = f"{self.base_url}/dataservice/device"
        response = self.session.get(url)
        
        if response.status_code == 200:
            devices = response.json().get('data', [])
            total = len(devices)
            reachable = sum(1 for d in devices if d.get('reachability') == 'reachable')
            
            if reachable == total:
                return {'status': 'PASS', 'details': f"All {total} devices reachable"}
            else:
                unreachable = [d['host-name'] for d in devices if d.get('reachability') != 'reachable']
                return {
                    'status': 'FAIL',
                    'details': f"{reachable}/{total} reachable. Unreachable: {', '.join(unreachable[:5])}"
                }
        return {'status': 'ERROR', 'details': 'Unable to check devices'}
        
    def check_active_alarms(self):
        """Check active alarms"""
        url = f"{self.base_url}/dataservice/alarms"
        params = {'query': json.dumps({'rules': [{'field': 'active', 'value': ['true']}]})}
        response = self.session.get(url, params=params)
        
        if response.status_code == 200:
            alarms = response.json().get('data', [])
            critical = sum(1 for a in alarms if a.get('severity') == 'Critical')
            major = sum(1 for a in alarms if a.get('severity') == 'Major')
            
            if critical > 0:
                return {'status': 'FAIL', 'details': f"{critical} critical, {major} major alarms"}
            elif major > 0:
                return {'status': 'WARNING', 'details': f"{major} major alarms"}
            else:
                return {'status': 'PASS', 'details': f"{len(alarms)} minor/warning alarms"}
        return {'status': 'ERROR', 'details': 'Unable to check alarms'}
        
    def check_certificate_expiry(self):
        """Check certificate expiry"""
        url = f"{self.base_url}/dataservice/certificate/vedge/list"
        response = self.session.get(url)
        
        if response.status_code == 200:
            certs = response.json().get('data', [])
            expiring_soon = []
            
            for cert in certs:
                # Check if expiring within 30 days
                expiry = cert.get('expiration-date')
                if expiry:
                    # Parse and check expiry
                    pass
                    
            if expiring_soon:
                return {
                    'status': 'WARNING',
                    'details': f"{len(expiring_soon)} certificates expiring within 30 days"
                }
            return {'status': 'PASS', 'details': 'All certificates valid'}
        return {'status': 'ERROR', 'details': 'Unable to check certificates'}
        
    def check_control_connections(self):
        """Check control plane connections"""
        url = f"{self.base_url}/dataservice/device/counters"
        response = self.session.get(url)
        
        if response.status_code == 200:
            counters = response.json().get('data', [{}])[0]
            expected = counters.get('expectedControlConnections', 0)
            actual = counters.get('controlConnections', 0)
            
            if actual >= expected:
                return {'status': 'PASS', 'details': f"{actual}/{expected} control connections"}
            else:
                return {'status': 'WARNING', 'details': f"{actual}/{expected} control connections"}
        return {'status': 'ERROR', 'details': 'Unable to check control connections'}
        
    def run_all_checks(self):
        """Run all health checks"""
        self.check("Controller Cluster", self.check_controller_status, 'CRITICAL')
        self.check("Device Reachability", self.check_device_reachability, 'HIGH')
        self.check("Active Alarms", self.check_active_alarms, 'HIGH')
        self.check("Certificate Expiry", self.check_certificate_expiry, 'MEDIUM')
        self.check("Control Connections", self.check_control_connections, 'HIGH')
        
        return self.results
        
    def generate_report(self):
        """Generate health check report"""
        report = []
        report.append("=" * 60)
        report.append("NOC DAILY HEALTH CHECK REPORT")
        report.append("=" * 60)
        report.append(f"Timestamp: {datetime.now().isoformat()}")
        report.append(f"Performed by: Automated Check")
        report.append("")
        
        # Overall status
        failed = sum(1 for r in self.results if r['status'] == 'FAIL')
        warnings = sum(1 for r in self.results if r['status'] == 'WARNING')
        
        if failed > 0:
            overall = "RED - ATTENTION REQUIRED"
        elif warnings > 0:
            overall = "YELLOW - WARNINGS PRESENT"
        else:
            overall = "GREEN - ALL SYSTEMS OPERATIONAL"
            
        report.append(f"OVERALL STATUS: {overall}")
        report.append("-" * 60)
        
        # Individual checks
        for result in self.results:
            status_icon = {
                'PASS': '✓',
                'FAIL': '✗',
                'WARNING': '⚠',
                'ERROR': '!'
            }.get(result['status'], '?')
            
            report.append(f"[{status_icon}] {result['name']}: {result['status']}")
            report.append(f"    {result['details']}")
            
        report.append("")
        report.append("=" * 60)
        
        return "\n".join(report)


if __name__ == "__main__":
    checker = NOCHealthChecker(
        vmanage_host="10.100.1.10",
        username="noc_operator",
        password="operator_password"
    )
    
    checker.run_all_checks()
    print(checker.generate_report())
```

---

## 6.19.4 Alert Management

### Alert Prioritization Matrix

```yaml
alert_prioritization:
  priority_1_critical:
    response_time: "Immediate"
    examples:
      - "Site completely unreachable"
      - "Controller cluster failure"
      - "Multiple WAN Edge failures"
      - "Security breach detected"
    actions:
      - "Immediate escalation to Tier 2"
      - "Open P1 incident"
      - "Notify on-call engineer"
      - "Start incident bridge if needed"
      
  priority_2_high:
    response_time: "15 minutes"
    examples:
      - "Single device unreachable"
      - "Control connection loss"
      - "High packet loss on critical path"
      - "Certificate expiring < 7 days"
    actions:
      - "Create P2 incident"
      - "Begin troubleshooting"
      - "Escalate if not resolved in 30 min"
      
  priority_3_medium:
    response_time: "30 minutes"
    examples:
      - "Single tunnel down with redundancy"
      - "Performance degradation"
      - "Certificate expiring < 30 days"
      - "High resource utilization"
    actions:
      - "Create P3 incident"
      - "Monitor and troubleshoot"
      - "Schedule remediation"
      
  priority_4_low:
    response_time: "2 hours"
    examples:
      - "Informational alerts"
      - "Configuration drift detected"
      - "Minor threshold breach"
    actions:
      - "Log and monitor"
      - "Create task for follow-up"
```

### Alert Response Procedures

```yaml
alert_response_procedures:
  site_unreachable:
    priority: "P1"
    initial_response:
      - "Verify alert is genuine (not false positive)"
      - "Check if multiple devices at same site"
      - "Attempt to ping device from management network"
      - "Check ISP/circuit provider status page"
      
    escalation_triggers:
      - "No response after 10 minutes"
      - "Multiple sites affected"
      - "Business-critical site"
      
    troubleshooting:
      - "Check WAN circuit status"
      - "Verify power status via site contact"
      - "Review recent changes"
      - "Check for ISP outage"
      
  controller_alarm:
    priority: "P1"
    initial_response:
      - "Verify cluster status"
      - "Check all controller nodes"
      - "Review recent controller changes"
      
    escalation_triggers:
      - "Cluster quorum lost"
      - "Primary node failure"
      - "Multiple node failures"
      
  bfd_session_down:
    priority: "P2"
    initial_response:
      - "Identify affected tunnel"
      - "Check if traffic failed over"
      - "Verify physical interface status"
      
    troubleshooting:
      - "Check circuit status"
      - "Review BFD timers"
      - "Check for packet loss"
      - "Verify MTU settings"
```

---

## 6.19.5 Escalation Procedures

### Escalation Matrix

```yaml
escalation_matrix:
  functional_escalation:
    tier_1_to_tier_2:
      triggers:
        - "Unable to resolve within 30 minutes"
        - "Issue requires CLI access"
        - "Configuration change required"
        - "Multiple related incidents"
      process:
        - "Document troubleshooting steps taken"
        - "Update incident with findings"
        - "Contact Tier 2 engineer"
        - "Brief on issue and handover"
        
    tier_2_to_tier_3:
      triggers:
        - "Unable to resolve within 1 hour"
        - "Requires architecture expertise"
        - "Potential vendor engagement"
        - "Major incident declared"
      process:
        - "Complete root cause analysis attempt"
        - "Document all findings"
        - "Escalate via on-call if after hours"
        
    tier_3_to_vendor:
      triggers:
        - "Suspected software bug"
        - "Hardware failure confirmed"
        - "Issue beyond internal expertise"
      process:
        - "Collect all diagnostic data"
        - "Open TAC case"
        - "Provide admin-tech and logs"
        
  hierarchical_escalation:
    level_1:
      time: "15 minutes for P1"
      notify: "NOC Manager"
      
    level_2:
      time: "30 minutes for P1"
      notify: "Network Manager"
      
    level_3:
      time: "1 hour for P1"
      notify: "IT Director"
      
    level_4:
      time: "2 hours for P1"
      notify: "CTO"
```

### Major Incident Process

```yaml
major_incident_process:
  declaration_criteria:
    - "Business-critical service completely unavailable"
    - "Multiple sites or regions affected"
    - "Significant customer impact"
    - "Security incident"
    
  roles:
    incident_commander:
      responsibilities:
        - "Overall incident coordination"
        - "Decision making authority"
        - "Stakeholder communication"
        
    technical_lead:
      responsibilities:
        - "Technical troubleshooting coordination"
        - "Resource allocation"
        - "Solution implementation"
        
    communications_lead:
      responsibilities:
        - "Status updates to stakeholders"
        - "External communications"
        - "Documentation"
        
  process_flow:
    1_detection:
      actions:
        - "Alert received"
        - "Initial assessment"
        - "Major incident declared"
        
    2_mobilization:
      actions:
        - "Incident commander assigned"
        - "Technical team assembled"
        - "Bridge call initiated"
        
    3_diagnosis:
      actions:
        - "Root cause investigation"
        - "Impact assessment"
        - "Solution identification"
        
    4_resolution:
      actions:
        - "Implement fix"
        - "Verify resolution"
        - "Confirm service restored"
        
    5_recovery:
      actions:
        - "Declare incident resolved"
        - "Close bridge call"
        - "Initial documentation"
        
    6_post_incident:
      actions:
        - "Post-incident review"
        - "Root cause documentation"
        - "Improvement actions"
```

---

## 6.19.6 NOC Performance Metrics

### KPI Dashboard

```yaml
noc_kpis:
  availability_metrics:
    network_availability:
      target: "99.95%"
      measurement: "Monthly"
      
    mean_time_to_detect:
      target: "< 5 minutes"
      measurement: "Per incident"
      
  response_metrics:
    mean_time_to_acknowledge:
      target:
        p1: "< 5 minutes"
        p2: "< 15 minutes"
        p3: "< 30 minutes"
      measurement: "Per incident"
      
    mean_time_to_resolve:
      target:
        p1: "< 2 hours"
        p2: "< 4 hours"
        p3: "< 8 hours"
      measurement: "Per incident"
      
  quality_metrics:
    first_call_resolution:
      target: "> 60%"
      measurement: "Monthly"
      
    escalation_rate:
      target: "< 30%"
      measurement: "Monthly"
      
    incident_reopen_rate:
      target: "< 5%"
      measurement: "Monthly"
      
  operational_metrics:
    alert_noise_ratio:
      target: "< 20%"
      measurement: "Monthly"
      description: "False positive alerts"
      
    change_success_rate:
      target: "> 95%"
      measurement: "Monthly"
```

### NOC Metrics Dashboard Script

```python
#!/usr/bin/env python3
"""
NOC Performance Metrics Dashboard
Calculates and displays NOC KPIs
"""

from datetime import datetime, timedelta
import json

class NOCMetricsDashboard:
    def __init__(self, incidents_data, alerts_data):
        self.incidents = incidents_data
        self.alerts = alerts_data
        
        self.targets = {
            'mtta_p1': 5,  # minutes
            'mtta_p2': 15,
            'mtta_p3': 30,
            'mttr_p1': 120,  # minutes
            'mttr_p2': 240,
            'mttr_p3': 480,
            'fcr': 60,  # percent
            'escalation_rate': 30,
            'reopen_rate': 5,
            'noise_ratio': 20
        }
        
    def calculate_mtta(self, priority=None):
        """Calculate Mean Time to Acknowledge"""
        filtered = self.incidents
        if priority:
            filtered = [i for i in self.incidents if i.get('priority') == priority]
            
        if not filtered:
            return None
            
        total_minutes = 0
        count = 0
        
        for incident in filtered:
            if incident.get('created_at') and incident.get('acknowledged_at'):
                created = datetime.fromisoformat(incident['created_at'])
                acknowledged = datetime.fromisoformat(incident['acknowledged_at'])
                total_minutes += (acknowledged - created).total_seconds() / 60
                count += 1
                
        return round(total_minutes / count, 2) if count > 0 else None
        
    def calculate_mttr(self, priority=None):
        """Calculate Mean Time to Resolve"""
        filtered = self.incidents
        if priority:
            filtered = [i for i in self.incidents if i.get('priority') == priority]
            
        resolved = [i for i in filtered if i.get('resolved_at')]
        
        if not resolved:
            return None
            
        total_minutes = 0
        
        for incident in resolved:
            created = datetime.fromisoformat(incident['created_at'])
            resolved_time = datetime.fromisoformat(incident['resolved_at'])
            total_minutes += (resolved_time - created).total_seconds() / 60
            
        return round(total_minutes / len(resolved), 2)
        
    def calculate_fcr(self):
        """Calculate First Call Resolution rate"""
        resolved = [i for i in self.incidents if i.get('resolved_at')]
        
        if not resolved:
            return None
            
        fcr_count = sum(1 for i in resolved if not i.get('escalated'))
        
        return round((fcr_count / len(resolved)) * 100, 2)
        
    def calculate_escalation_rate(self):
        """Calculate escalation rate"""
        if not self.incidents:
            return None
            
        escalated = sum(1 for i in self.incidents if i.get('escalated'))
        
        return round((escalated / len(self.incidents)) * 100, 2)
        
    def calculate_reopen_rate(self):
        """Calculate incident reopen rate"""
        resolved = [i for i in self.incidents if i.get('resolved_at')]
        
        if not resolved:
            return None
            
        reopened = sum(1 for i in resolved if i.get('reopened'))
        
        return round((reopened / len(resolved)) * 100, 2)
        
    def calculate_noise_ratio(self):
        """Calculate alert noise ratio"""
        if not self.alerts:
            return None
            
        false_positives = sum(1 for a in self.alerts if a.get('false_positive'))
        
        return round((false_positives / len(self.alerts)) * 100, 2)
        
    def generate_dashboard(self):
        """Generate complete metrics dashboard"""
        dashboard = {
            'generated_at': datetime.now().isoformat(),
            'period': 'Last 30 days',
            'metrics': {
                'response_times': {
                    'mtta_p1': {
                        'value': self.calculate_mtta('P1'),
                        'target': self.targets['mtta_p1'],
                        'unit': 'minutes'
                    },
                    'mtta_p2': {
                        'value': self.calculate_mtta('P2'),
                        'target': self.targets['mtta_p2'],
                        'unit': 'minutes'
                    },
                    'mttr_p1': {
                        'value': self.calculate_mttr('P1'),
                        'target': self.targets['mttr_p1'],
                        'unit': 'minutes'
                    },
                    'mttr_p2': {
                        'value': self.calculate_mttr('P2'),
                        'target': self.targets['mttr_p2'],
                        'unit': 'minutes'
                    }
                },
                'quality': {
                    'fcr': {
                        'value': self.calculate_fcr(),
                        'target': self.targets['fcr'],
                        'unit': '%'
                    },
                    'escalation_rate': {
                        'value': self.calculate_escalation_rate(),
                        'target': self.targets['escalation_rate'],
                        'unit': '%'
                    },
                    'reopen_rate': {
                        'value': self.calculate_reopen_rate(),
                        'target': self.targets['reopen_rate'],
                        'unit': '%'
                    }
                },
                'operational': {
                    'noise_ratio': {
                        'value': self.calculate_noise_ratio(),
                        'target': self.targets['noise_ratio'],
                        'unit': '%'
                    },
                    'total_incidents': len(self.incidents),
                    'total_alerts': len(self.alerts)
                }
            }
        }
        
        return dashboard
        
    def format_dashboard(self, dashboard):
        """Format dashboard for display"""
        output = []
        output.append("=" * 60)
        output.append("NOC PERFORMANCE METRICS DASHBOARD")
        output.append("=" * 60)
        output.append(f"Period: {dashboard['period']}")
        output.append(f"Generated: {dashboard['generated_at']}")
        output.append("")
        
        output.append("RESPONSE TIMES")
        output.append("-" * 60)
        for metric, data in dashboard['metrics']['response_times'].items():
            value = data['value'] if data['value'] else 'N/A'
            status = '✓' if data['value'] and data['value'] <= data['target'] else '✗'
            output.append(f"  {metric}: {value} {data['unit']} (target: {data['target']}) [{status}]")
            
        output.append("")
        output.append("QUALITY METRICS")
        output.append("-" * 60)
        for metric, data in dashboard['metrics']['quality'].items():
            value = data['value'] if data['value'] else 'N/A'
            if metric in ['escalation_rate', 'reopen_rate']:
                status = '✓' if data['value'] and data['value'] <= data['target'] else '✗'
            else:
                status = '✓' if data['value'] and data['value'] >= data['target'] else '✗'
            output.append(f"  {metric}: {value}{data['unit']} (target: {data['target']}%) [{status}]")
            
        output.append("")
        output.append("=" * 60)
        
        return "\n".join(output)


if __name__ == "__main__":
    # Sample data
    incidents = [
        {'priority': 'P1', 'created_at': '2025-01-15T10:00:00', 'acknowledged_at': '2025-01-15T10:03:00', 'resolved_at': '2025-01-15T11:30:00'},
        {'priority': 'P2', 'created_at': '2025-01-15T14:00:00', 'acknowledged_at': '2025-01-15T14:10:00', 'resolved_at': '2025-01-15T17:00:00', 'escalated': True}
    ]
    
    alerts = [
        {'type': 'bfd_down', 'false_positive': False},
        {'type': 'high_cpu', 'false_positive': True}
    ]
    
    dashboard = NOCMetricsDashboard(incidents, alerts)
    report = dashboard.generate_dashboard()
    print(dashboard.format_dashboard(report))
```

---

## 6.19.7 NOC Training and Certification

### Training Program

```yaml
noc_training:
  tier_1_training:
    duration: "2 weeks"
    topics:
      - "SD-WAN fundamentals"
      - "vManage navigation and dashboards"
      - "Alert triage and prioritization"
      - "Basic troubleshooting"
      - "ITSM tools (ServiceNow)"
      - "Communication protocols"
    certification: "Internal NOC Tier 1 Certification"
    
  tier_2_training:
    duration: "4 weeks"
    prerequisites: "Tier 1 certification, 6 months experience"
    topics:
      - "Advanced SD-WAN architecture"
      - "CLI troubleshooting"
      - "Template and policy management"
      - "Root cause analysis"
      - "Automation basics"
    certification: "Cisco SD-WAN Foundations"
    
  tier_3_training:
    duration: "Ongoing"
    prerequisites: "Tier 2 certification, 2 years experience"
    topics:
      - "Expert-level troubleshooting"
      - "Architecture design"
      - "Performance optimization"
      - "Advanced automation"
      - "Vendor engagement"
    certification: "Cisco CCNP/CCIE Enterprise"
    
  continuous_learning:
    monthly:
      - "Knowledge sharing sessions"
      - "Incident reviews"
      - "New feature training"
    quarterly:
      - "Tabletop exercises"
      - "DR simulations"
      - "Cross-training"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
