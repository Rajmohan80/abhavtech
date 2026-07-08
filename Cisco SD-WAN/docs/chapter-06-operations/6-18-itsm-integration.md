# 6.18 ITSM Integration

## 6.18.1 ITSM Integration Overview

### Integration Architecture

```yaml
itsm_integration_architecture:
  purpose: "Integrate SD-WAN operations with enterprise IT Service Management"
  
  primary_itsm: "ServiceNow"
  version: "Tokyo"
  
  integration_points:
    incident_management:
      direction: "SD-WAN → ServiceNow"
      trigger: "Alarms and events"
      automation: "Auto-ticket creation"
      
    change_management:
      direction: "Bidirectional"
      trigger: "Configuration changes"
      automation: "Change record sync"
      
    cmdb:
      direction: "SD-WAN → ServiceNow"
      trigger: "Device discovery/changes"
      automation: "CI sync"
      
    service_catalog:
      direction: "ServiceNow → SD-WAN"
      trigger: "Service requests"
      automation: "Provisioning workflows"
```

### ServiceNow Integration Components

```yaml
servicenow_components:
  integration_hub:
    type: "Mid Server"
    location: "Mumbai DC"
    connectivity: "HTTPS to vManage API"
    
  tables_used:
    incidents: "incident"
    changes: "change_request"
    cmdb_devices: "cmdb_ci_netgear"
    cmdb_circuits: "cmdb_ci_circuit"
    events: "em_event"
    
  integration_user:
    username: "svc_sdwan_integration"
    roles:
      - "itil"
      - "evt_mgmt_integration"
      - "cmdb_write"
    api_access: "REST API enabled"
```

---

## 6.18.2 Incident Management Integration

### Auto-Ticket Creation

```yaml
incident_auto_creation:
  trigger_events:
    severity_1:
      sd_wan_alarms:
        - "control-connection-state-change"
        - "site-down"
        - "cluster-state-change"
      auto_create: true
      priority: "1 - Critical"
      assignment_group: "Network Operations"
      
    severity_2:
      sd_wan_alarms:
        - "bfd-state-change"
        - "interface-state-change"
        - "omp-state-change"
      auto_create: true
      priority: "2 - High"
      assignment_group: "Network Operations"
      
    severity_3:
      sd_wan_alarms:
        - "certificate-expiring"
        - "memory-threshold"
        - "cpu-threshold"
      auto_create: true
      priority: "3 - Moderate"
      assignment_group: "Network Operations"
      
  deduplication:
    enabled: true
    window: "30 minutes"
    key_fields:
      - "device_id"
      - "alarm_type"
      - "interface"
```

### ServiceNow Integration Script

```python
#!/usr/bin/env python3
"""
SD-WAN to ServiceNow Incident Integration
Creates and updates incidents from SD-WAN alarms
"""

import requests
import json
from datetime import datetime
import hashlib

class ServiceNowIncidentIntegration:
    def __init__(self, snow_instance, snow_user, snow_password, vmanage_host, vmanage_user, vmanage_password):
        self.snow_url = f"https://{snow_instance}.service-now.com"
        self.snow_auth = (snow_user, snow_password)
        
        self.vmanage_url = f"https://{vmanage_host}"
        self.vmanage_session = requests.Session()
        self.vmanage_session.verify = False
        self.authenticate_vmanage(vmanage_user, vmanage_password)
        
        # Severity mapping
        self.severity_map = {
            'Critical': '1',
            'Major': '2',
            'Minor': '3',
            'Warning': '4'
        }
        
        # Assignment groups
        self.assignment_groups = {
            'Critical': 'Network Operations - Tier 3',
            'Major': 'Network Operations - Tier 2',
            'Minor': 'Network Operations - Tier 1',
            'Warning': 'Network Operations - Tier 1'
        }
        
    def authenticate_vmanage(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"{self.vmanage_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.vmanage_session.post(auth_url, data=payload)
        
        token_url = f"{self.vmanage_url}/dataservice/client/token"
        token_response = self.vmanage_session.get(token_url)
        if token_response.status_code == 200:
            self.vmanage_session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def get_active_alarms(self):
        """Get active alarms from vManage"""
        url = f"{self.vmanage_url}/dataservice/alarms"
        params = {'query': json.dumps({'rules': [{'field': 'active', 'value': ['true']}]})}
        
        response = self.vmanage_session.get(url, params=params)
        return response.json().get('data', []) if response.status_code == 200 else []
        
    def generate_dedup_key(self, alarm):
        """Generate deduplication key for alarm"""
        key_string = f"{alarm.get('system-ip')}-{alarm.get('type')}-{alarm.get('component')}"
        return hashlib.md5(key_string.encode()).hexdigest()
        
    def check_existing_incident(self, dedup_key):
        """Check if incident already exists"""
        url = f"{self.snow_url}/api/now/table/incident"
        params = {
            'sysparm_query': f"correlation_id={dedup_key}^active=true",
            'sysparm_limit': 1
        }
        
        response = requests.get(url, auth=self.snow_auth, params=params)
        if response.status_code == 200:
            results = response.json().get('result', [])
            return results[0] if results else None
        return None
        
    def create_incident(self, alarm):
        """Create ServiceNow incident from alarm"""
        dedup_key = self.generate_dedup_key(alarm)
        
        # Check for existing incident
        existing = self.check_existing_incident(dedup_key)
        if existing:
            return self.update_incident(existing['sys_id'], alarm)
            
        severity = alarm.get('severity', 'Minor')
        
        incident_data = {
            'caller_id': 'SD-WAN Monitoring',
            'category': 'Network',
            'subcategory': 'SD-WAN',
            'short_description': f"SD-WAN Alert: {alarm.get('type')} on {alarm.get('host-name')}",
            'description': self.format_description(alarm),
            'impact': self.severity_map.get(severity, '3'),
            'urgency': self.severity_map.get(severity, '3'),
            'assignment_group': self.assignment_groups.get(severity, 'Network Operations'),
            'correlation_id': dedup_key,
            'correlation_display': f"SD-WAN-{alarm.get('uuid', 'unknown')[:8]}",
            'cmdb_ci': alarm.get('host-name'),
            'u_source_system': 'Cisco SD-WAN',
            'u_alarm_id': alarm.get('uuid'),
            'u_device_ip': alarm.get('system-ip')
        }
        
        url = f"{self.snow_url}/api/now/table/incident"
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        
        response = requests.post(url, auth=self.snow_auth, headers=headers, json=incident_data)
        
        if response.status_code == 201:
            result = response.json().get('result', {})
            return {
                'status': 'created',
                'incident_number': result.get('number'),
                'sys_id': result.get('sys_id')
            }
        else:
            return {
                'status': 'error',
                'error': response.text
            }
            
    def update_incident(self, sys_id, alarm):
        """Update existing incident with new alarm info"""
        update_data = {
            'work_notes': f"[{datetime.now().isoformat()}] Alarm still active\n{self.format_description(alarm)}"
        }
        
        url = f"{self.snow_url}/api/now/table/incident/{sys_id}"
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        
        response = requests.patch(url, auth=self.snow_auth, headers=headers, json=update_data)
        
        return {
            'status': 'updated',
            'sys_id': sys_id
        }
        
    def format_description(self, alarm):
        """Format alarm details for incident description"""
        return f"""
SD-WAN Alarm Details
====================
Alarm Type: {alarm.get('type')}
Severity: {alarm.get('severity')}
Device: {alarm.get('host-name')}
System IP: {alarm.get('system-ip')}
Site ID: {alarm.get('site-id')}
Component: {alarm.get('component')}
Message: {alarm.get('message')}
Timestamp: {alarm.get('entry_time')}
UUID: {alarm.get('uuid')}

Recommended Actions:
{self.get_recommended_actions(alarm.get('type'))}
"""
        
    def get_recommended_actions(self, alarm_type):
        """Get recommended actions based on alarm type"""
        actions = {
            'control-connection-state-change': """
1. Verify network connectivity to controllers
2. Check certificate validity
3. Review firewall rules
4. Check vBond reachability""",
            'bfd-state-change': """
1. Check physical interface status
2. Verify BFD timers
3. Check for packet loss on path
4. Review MTU settings""",
            'site-down': """
1. Verify device power status
2. Check all WAN circuits
3. Verify console access
4. Escalate to site contact if needed"""
        }
        return actions.get(alarm_type, "Review alarm details and troubleshoot accordingly")
        
    def close_incident(self, sys_id, resolution_notes):
        """Close incident when alarm clears"""
        update_data = {
            'state': '6',  # Resolved
            'close_code': 'Solved (Permanently)',
            'close_notes': resolution_notes
        }
        
        url = f"{self.snow_url}/api/now/table/incident/{sys_id}"
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        
        response = requests.patch(url, auth=self.snow_auth, headers=headers, json=update_data)
        
        return response.status_code == 200
        
    def sync_alarms(self):
        """Main sync function - process all active alarms"""
        alarms = self.get_active_alarms()
        results = {
            'processed': 0,
            'created': 0,
            'updated': 0,
            'errors': 0
        }
        
        for alarm in alarms:
            try:
                result = self.create_incident(alarm)
                results['processed'] += 1
                
                if result['status'] == 'created':
                    results['created'] += 1
                elif result['status'] == 'updated':
                    results['updated'] += 1
                else:
                    results['errors'] += 1
                    
            except Exception as e:
                results['errors'] += 1
                print(f"Error processing alarm: {e}")
                
        return results


if __name__ == "__main__":
    integration = ServiceNowIncidentIntegration(
        snow_instance="abhavtech",
        snow_user="svc_sdwan_integration",
        snow_password="integration_password",
        vmanage_host="10.100.1.10",
        vmanage_user="admin",
        vmanage_password="admin_password"
    )
    
    results = integration.sync_alarms()
    print(f"Sync complete: {results}")
```

---

## 6.18.3 Change Management Integration

### Change Record Synchronization

```yaml
change_management_sync:
  sd_wan_to_servicenow:
    trigger: "Template push or policy change"
    
    change_types:
      template_attach:
        snow_type: "Normal"
        category: "Network"
        risk: "Medium"
        
      policy_modification:
        snow_type: "Normal"
        category: "Network"
        risk: "Medium-High"
        
      software_upgrade:
        snow_type: "Normal"
        category: "Infrastructure"
        risk: "High"
        
  servicenow_to_sd_wan:
    trigger: "Change approval"
    automation:
      - "Maintenance window scheduling"
      - "Notification suppression"
      - "Automated deployment trigger"
```

### Change Integration Script

```python
#!/usr/bin/env python3
"""
SD-WAN Change Management Integration
Syncs changes between SD-WAN and ServiceNow
"""

import requests
import json
from datetime import datetime, timedelta

class ChangeManagementIntegration:
    def __init__(self, snow_instance, snow_auth, vmanage_host, vmanage_auth):
        self.snow_url = f"https://{snow_instance}.service-now.com"
        self.snow_auth = snow_auth
        self.vmanage_url = f"https://{vmanage_host}"
        self.vmanage_session = self.setup_vmanage_session(vmanage_auth)
        
    def setup_vmanage_session(self, auth):
        """Setup authenticated vManage session"""
        session = requests.Session()
        session.verify = False
        
        auth_url = f"{self.vmanage_url}/j_security_check"
        session.post(auth_url, data={'j_username': auth[0], 'j_password': auth[1]})
        
        token_url = f"{self.vmanage_url}/dataservice/client/token"
        token_response = session.get(token_url)
        if token_response.status_code == 200:
            session.headers['X-XSRF-TOKEN'] = token_response.text
            
        return session
        
    def get_recent_changes(self, hours=24):
        """Get recent configuration changes from vManage"""
        url = f"{self.vmanage_url}/dataservice/device/action/status/tasks"
        params = {'hours': hours}
        
        response = self.vmanage_session.get(url, params=params)
        return response.json().get('data', []) if response.status_code == 200 else []
        
    def create_change_record(self, change_data):
        """Create ServiceNow change request"""
        change_request = {
            'type': 'normal',
            'category': 'Network',
            'short_description': f"SD-WAN: {change_data['action']} - {change_data.get('summary', '')}",
            'description': self.format_change_description(change_data),
            'assignment_group': 'Network Operations',
            'requested_by': 'SD-WAN Manager',
            'u_source_system': 'Cisco SD-WAN',
            'u_change_id': change_data.get('task_id'),
            'start_date': change_data.get('start_time'),
            'end_date': change_data.get('end_time'),
            'risk': self.assess_risk(change_data),
            'impact': self.assess_impact(change_data)
        }
        
        url = f"{self.snow_url}/api/now/table/change_request"
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        
        response = requests.post(url, auth=self.snow_auth, headers=headers, json=change_request)
        
        if response.status_code == 201:
            return response.json().get('result', {})
        return None
        
    def format_change_description(self, change_data):
        """Format change details"""
        return f"""
SD-WAN Configuration Change
===========================
Action: {change_data.get('action')}
Task ID: {change_data.get('task_id')}
Initiated By: {change_data.get('user', 'System')}
Start Time: {change_data.get('start_time')}
End Time: {change_data.get('end_time')}
Status: {change_data.get('status')}

Affected Devices:
{self.format_device_list(change_data.get('devices', []))}

Change Details:
{change_data.get('details', 'N/A')}
"""
        
    def format_device_list(self, devices):
        """Format list of affected devices"""
        if not devices:
            return "No devices specified"
        return "\n".join([f"- {d}" for d in devices[:20]])
        
    def assess_risk(self, change_data):
        """Assess change risk level"""
        action = change_data.get('action', '').lower()
        device_count = len(change_data.get('devices', []))
        
        if 'upgrade' in action or 'software' in action:
            return 'high'
        elif device_count > 10:
            return 'moderate'
        elif 'policy' in action:
            return 'moderate'
        else:
            return 'low'
            
    def assess_impact(self, change_data):
        """Assess change impact level"""
        device_count = len(change_data.get('devices', []))
        
        if device_count > 50:
            return '1'  # High
        elif device_count > 10:
            return '2'  # Medium
        else:
            return '3'  # Low
            
    def get_approved_changes(self):
        """Get approved changes from ServiceNow for scheduling"""
        url = f"{self.snow_url}/api/now/table/change_request"
        params = {
            'sysparm_query': 'state=scheduled^u_source_system=Cisco SD-WAN',
            'sysparm_fields': 'number,sys_id,short_description,start_date,end_date,u_change_id'
        }
        
        response = requests.get(url, auth=self.snow_auth, params=params)
        return response.json().get('result', []) if response.status_code == 200 else []
        
    def sync_change_status(self, snow_change_id, vmanage_task_id):
        """Sync change status between systems"""
        # Get vManage task status
        url = f"{self.vmanage_url}/dataservice/device/action/status/{vmanage_task_id}"
        response = self.vmanage_session.get(url)
        
        if response.status_code == 200:
            task_status = response.json().get('data', {})
            
            # Map vManage status to ServiceNow state
            state_map = {
                'in_progress': 'implement',
                'done': 'review',
                'failure': 'implement',
                'scheduled': 'scheduled'
            }
            
            snow_state = state_map.get(task_status.get('status'), 'implement')
            
            # Update ServiceNow
            update_url = f"{self.snow_url}/api/now/table/change_request/{snow_change_id}"
            update_data = {
                'state': snow_state,
                'work_notes': f"Status update from SD-WAN: {task_status.get('status')}"
            }
            
            requests.patch(update_url, auth=self.snow_auth, json=update_data)


if __name__ == "__main__":
    integration = ChangeManagementIntegration(
        snow_instance="abhavtech",
        snow_auth=("svc_sdwan_integration", "password"),
        vmanage_host="10.100.1.10",
        vmanage_auth=("admin", "admin_password")
    )
    
    # Sync recent changes
    changes = integration.get_recent_changes(hours=24)
    for change in changes:
        result = integration.create_change_record(change)
        if result:
            print(f"Created change: {result.get('number')}")
```

---

## 6.18.4 CMDB Integration

### Configuration Item Sync

```yaml
cmdb_integration:
  ci_types:
    wan_edge_router:
      snow_class: "cmdb_ci_ip_router"
      attributes:
        - name: "name"
          source: "host-name"
        - name: "ip_address"
          source: "system-ip"
        - name: "serial_number"
          source: "board-serial"
        - name: "model_id"
          source: "device-model"
        - name: "os_version"
          source: "version"
        - name: "location"
          source: "site-id"
        - name: "u_device_type"
          value: "SD-WAN Edge"
          
    controller:
      snow_class: "cmdb_ci_server"
      attributes:
        - name: "name"
          source: "host-name"
        - name: "ip_address"
          source: "deviceIP"
        - name: "u_device_type"
          source: "device-type"
          
    circuit:
      snow_class: "cmdb_ci_circuit"
      attributes:
        - name: "name"
          source: "interface-name"
        - name: "bandwidth"
          source: "speed"
        - name: "u_transport"
          source: "color"
          
  sync_schedule:
    full_sync: "Daily 02:00 IST"
    incremental_sync: "Every 15 minutes"
    
  relationship_mapping:
    - parent: "wan_edge_router"
      child: "circuit"
      type: "Connects to::Connected by"
```

### CMDB Sync Script

```python
#!/usr/bin/env python3
"""
SD-WAN CMDB Integration
Synchronizes SD-WAN inventory with ServiceNow CMDB
"""

import requests
import json
from datetime import datetime

class CMDBIntegration:
    def __init__(self, snow_instance, snow_auth, vmanage_host, vmanage_auth):
        self.snow_url = f"https://{snow_instance}.service-now.com"
        self.snow_auth = snow_auth
        self.vmanage_url = f"https://{vmanage_host}"
        self.vmanage_session = self.setup_vmanage_session(vmanage_auth)
        
    def setup_vmanage_session(self, auth):
        """Setup authenticated vManage session"""
        session = requests.Session()
        session.verify = False
        
        auth_url = f"{self.vmanage_url}/j_security_check"
        session.post(auth_url, data={'j_username': auth[0], 'j_password': auth[1]})
        
        token_url = f"{self.vmanage_url}/dataservice/client/token"
        token_response = session.get(token_url)
        if token_response.status_code == 200:
            session.headers['X-XSRF-TOKEN'] = token_response.text
            
        return session
        
    def get_sdwan_inventory(self):
        """Get complete SD-WAN device inventory"""
        url = f"{self.vmanage_url}/dataservice/device"
        response = self.vmanage_session.get(url)
        return response.json().get('data', []) if response.status_code == 200 else []
        
    def get_device_details(self, device_id):
        """Get detailed device information"""
        url = f"{self.vmanage_url}/dataservice/device/system/status?deviceId={device_id}"
        response = self.vmanage_session.get(url)
        return response.json().get('data', [{}])[0] if response.status_code == 200 else {}
        
    def find_existing_ci(self, serial_number):
        """Find existing CI in CMDB"""
        url = f"{self.snow_url}/api/now/table/cmdb_ci_ip_router"
        params = {
            'sysparm_query': f"serial_number={serial_number}",
            'sysparm_limit': 1
        }
        
        response = requests.get(url, auth=self.snow_auth, params=params)
        if response.status_code == 200:
            results = response.json().get('result', [])
            return results[0] if results else None
        return None
        
    def create_or_update_ci(self, device):
        """Create or update CI in CMDB"""
        serial = device.get('board-serial', device.get('uuid'))
        existing = self.find_existing_ci(serial)
        
        ci_data = {
            'name': device.get('host-name'),
            'ip_address': device.get('system-ip'),
            'serial_number': serial,
            'model_id': device.get('device-model'),
            'os_version': device.get('version'),
            'location': device.get('site-id'),
            'u_device_type': 'SD-WAN Edge',
            'u_reachability': device.get('reachability'),
            'u_last_sync': datetime.now().isoformat(),
            'operational_status': '1' if device.get('reachability') == 'reachable' else '2',
            'manufacturer': 'Cisco',
            'u_system_ip': device.get('system-ip'),
            'u_site_id': device.get('site-id')
        }
        
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
        
        if existing:
            # Update existing CI
            url = f"{self.snow_url}/api/now/table/cmdb_ci_ip_router/{existing['sys_id']}"
            response = requests.patch(url, auth=self.snow_auth, headers=headers, json=ci_data)
            action = 'updated'
        else:
            # Create new CI
            url = f"{self.snow_url}/api/now/table/cmdb_ci_ip_router"
            response = requests.post(url, auth=self.snow_auth, headers=headers, json=ci_data)
            action = 'created'
            
        if response.status_code in [200, 201]:
            return {
                'status': 'success',
                'action': action,
                'ci': response.json().get('result', {})
            }
        else:
            return {
                'status': 'error',
                'error': response.text
            }
            
    def sync_all_devices(self):
        """Full CMDB sync of all devices"""
        devices = self.get_sdwan_inventory()
        
        results = {
            'total': len(devices),
            'created': 0,
            'updated': 0,
            'errors': 0,
            'timestamp': datetime.now().isoformat()
        }
        
        for device in devices:
            try:
                result = self.create_or_update_ci(device)
                
                if result['status'] == 'success':
                    if result['action'] == 'created':
                        results['created'] += 1
                    else:
                        results['updated'] += 1
                else:
                    results['errors'] += 1
                    
            except Exception as e:
                results['errors'] += 1
                print(f"Error syncing {device.get('host-name')}: {e}")
                
        return results
        
    def create_relationships(self):
        """Create CI relationships"""
        # Get all SD-WAN CIs
        url = f"{self.snow_url}/api/now/table/cmdb_ci_ip_router"
        params = {'sysparm_query': 'u_device_type=SD-WAN Edge'}
        
        response = requests.get(url, auth=self.snow_auth, params=params)
        cis = response.json().get('result', []) if response.status_code == 200 else []
        
        # Create relationships between hub and spoke
        # This would require additional logic based on your topology
        pass


if __name__ == "__main__":
    integration = CMDBIntegration(
        snow_instance="abhavtech",
        snow_auth=("svc_sdwan_integration", "password"),
        vmanage_host="10.100.1.10",
        vmanage_auth=("admin", "admin_password")
    )
    
    results = integration.sync_all_devices()
    print(f"CMDB Sync Results: {json.dumps(results, indent=2)}")
```

---

## 6.18.5 Service Catalog Integration

### Self-Service Requests

```yaml
service_catalog_items:
  new_site_provisioning:
    name: "SD-WAN New Site Request"
    category: "Network Services"
    workflow:
      1_request: "User submits request with site details"
      2_approval: "Manager and Network team approval"
      3_provisioning: "Automated device provisioning"
      4_validation: "Connectivity verification"
      5_completion: "Handoff to user"
    variables:
      - name: "site_name"
        type: "string"
        mandatory: true
      - name: "site_type"
        type: "choice"
        choices: ["Hub", "Branch", "Remote"]
      - name: "bandwidth_required"
        type: "choice"
        choices: ["100 Mbps", "200 Mbps", "500 Mbps", "1 Gbps"]
      - name: "primary_transport"
        type: "choice"
        choices: ["MPLS", "Internet", "5G/LTE"]
        
  bandwidth_change:
    name: "SD-WAN Bandwidth Change"
    category: "Network Services"
    workflow:
      1_request: "User requests bandwidth change"
      2_assessment: "Capacity assessment"
      3_approval: "Approval based on cost"
      4_implementation: "Circuit modification"
      5_verification: "Performance validation"
      
  vpn_access_request:
    name: "SD-WAN VPN Access"
    category: "Network Services"
    workflow:
      1_request: "User requests VPN access"
      2_security_review: "Security team review"
      3_approval: "Manager approval"
      4_configuration: "Policy configuration"
      5_testing: "Access verification"
```

---

## 6.18.6 Event Management Integration

### Event Correlation Rules

```yaml
event_management:
  event_sources:
    sd_wan_alarms:
      connector: "REST API"
      poll_interval: "60 seconds"
      
  correlation_rules:
    site_outage:
      conditions:
        - "Multiple device unreachable alarms from same site"
        - "Within 5 minute window"
      action: "Create single P1 incident"
      
    controller_cluster_issue:
      conditions:
        - "Multiple controller alarms"
        - "Same cluster"
      action: "Create P1 incident with escalation"
      
    circuit_degradation:
      conditions:
        - "BFD state changes"
        - "Loss/latency threshold alarms"
      action: "Create P3 incident, correlate with provider"
      
  alert_suppression:
    maintenance_window:
      source: "Change calendar"
      action: "Suppress non-critical alerts"
      
    known_issues:
      source: "Problem records"
      action: "Link to existing problem"
```

---

## 6.18.7 Reporting Integration

### ITSM Reports

```yaml
itsm_reporting:
  operational_reports:
    daily_summary:
      metrics:
        - "Incidents created"
        - "Incidents resolved"
        - "MTTR by severity"
        - "Open incidents by priority"
      distribution: "NOC Team"
      
    weekly_report:
      metrics:
        - "SLA achievement"
        - "Change success rate"
        - "CMDB accuracy"
        - "Top incident categories"
      distribution: "IT Management"
      
    monthly_executive:
      metrics:
        - "Network availability"
        - "Incident trends"
        - "Change metrics"
        - "Cost analysis"
      distribution: "IT Leadership"
      
  dashboard_widgets:
    real_time:
      - "Open SD-WAN incidents"
      - "Active alarms count"
      - "Device health status"
      
    trending:
      - "Incidents over time"
      - "MTTR trend"
      - "Top affected sites"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
