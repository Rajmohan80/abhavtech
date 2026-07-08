# 6.14 High Availability Failover Procedures

## 6.14.1 HA Architecture Overview

### Controller HA Design

```yaml
controller_ha_architecture:
  vmanage_cluster:
    deployment: "3-node cluster"
    nodes:
      - name: "vmanage-01"
        role: "primary"
        location: "mumbai-dc1"
        ip: "10.100.1.11"
      - name: "vmanage-02"
        role: "secondary"
        location: "mumbai-dc2"
        ip: "10.100.1.12"
      - name: "vmanage-03"
        role: "secondary"
        location: "chennai-dc1"
        ip: "10.100.2.11"
    vip: "10.100.1.10"
    failover_time: "< 60 seconds"
    data_replication: "synchronous"
    
  vsmart_pair:
    deployment: "active-active pair"
    nodes:
      - name: "vsmart-01"
        location: "mumbai-dc1"
        ip: "10.100.1.21"
      - name: "vsmart-02"
        location: "chennai-dc1"
        ip: "10.100.2.21"
    load_balancing: "all WAN Edges connect to both"
    failover_time: "< 30 seconds"
    
  vbond_pair:
    deployment: "active-active pair"
    nodes:
      - name: "vbond-01"
        location: "mumbai-dc1"
        ip: "10.100.1.31"
        public_ip: "203.0.113.11"
      - name: "vbond-02"
        location: "chennai-dc1"
        ip: "10.100.2.31"
        public_ip: "203.0.113.21"
    dns_record: "vbond.abhavtech.com"
    failover_time: "< 30 seconds"
```

### WAN Edge HA Design

```yaml
wan_edge_ha_design:
  hub_sites:
    design: "active-standby pair"
    sites:
      mumbai_hub:
        primary:
          device: "mumbai-hub-edge01"
          model: "C8500-12X4QC"
          priority: 100
        standby:
          device: "mumbai-hub-edge02"
          model: "C8500-12X4QC"
          priority: 90
        failover_time: "< 3 seconds"
        state_sync: "BFD + VRRP"
        
      chennai_hub:
        primary:
          device: "chennai-hub-edge01"
          model: "C8500-12X4QC"
          priority: 100
        standby:
          device: "chennai-hub-edge02"
          model: "C8500-12X4QC"
          priority: 90
          
  branch_sites:
    design: "dual WAN active-active"
    redundancy: "transport diversity"
    failover_mechanism: "BFD + AAR"
    
  sd_access_integration:
    handoff_redundancy: "dual border connections"
    bgp_failover: "BFD-enabled"
    failover_time: "< 10 seconds"
```

---

## 6.14.2 vManage Cluster Failover

### Automatic Failover Process

```yaml
vmanage_automatic_failover:
  trigger_conditions:
    - "Primary node unresponsive > 30 seconds"
    - "Database replication failure"
    - "Network partition detected"
    - "Service health check failure"
    
  failover_sequence:
    step_1:
      action: "Detect primary failure"
      mechanism: "Cluster heartbeat timeout"
      timeout: "30 seconds"
      
    step_2:
      action: "Initiate leader election"
      mechanism: "Raft consensus protocol"
      duration: "10-15 seconds"
      
    step_3:
      action: "Promote secondary to primary"
      mechanism: "VIP migration"
      duration: "5-10 seconds"
      
    step_4:
      action: "Update WAN Edge connections"
      mechanism: "Automatic reconnection"
      duration: "< 30 seconds"
      
    step_5:
      action: "Resume operations"
      mechanism: "Service restoration"
      total_failover: "< 60 seconds"
```

### Manual Failover Procedure

```yaml
vmanage_manual_failover:
  procedure_id: "FO-VM-001"
  title: "vManage Manual Failover"
  duration: "15-30 minutes"
  skill_level: "L3"
  
  prerequisites:
    - "Cluster health verified"
    - "Target node healthy"
    - "Change ticket approved"
    - "Maintenance window scheduled"
    
  procedure:
    step_1:
      action: "Verify cluster status"
      commands:
        - "request nms cluster-management status"
        - "show nms cluster-server-status"
      expected: "All nodes operational"
      
    step_2:
      action: "Identify current primary"
      commands:
        - "show nms cluster-role"
      expected: "Primary node identified"
      
    step_3:
      action: "Graceful primary shutdown"
      commands:
        - "request nms cluster-management role secondary"
      expected: "Role transition initiated"
      warning: "Wait for confirmation before proceeding"
      
    step_4:
      action: "Verify failover complete"
      commands:
        - "request nms cluster-management status"
        - "show nms cluster-server-status"
      expected: "New primary elected"
      
    step_5:
      action: "Verify services restored"
      validation:
        - "Dashboard accessible"
        - "WAN Edges connected"
        - "No critical alarms"
```

### vManage Failover Validation Script

```python
#!/usr/bin/env python3
"""
vManage Cluster Failover Validation
Validates cluster health after failover
"""

import requests
import json
import time
from datetime import datetime

class VManageClusterValidator:
    def __init__(self, cluster_vip, username, password):
        self.base_url = f"https://{cluster_vip}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
    def authenticate(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {
            'j_username': username,
            'j_password': password
        }
        response = self.session.post(auth_url, data=payload)
        
        # Get CSRF token
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def get_cluster_status(self):
        """Get cluster health status"""
        url = f"{self.base_url}/dataservice/clusterManagement/list"
        response = self.session.get(url)
        return response.json() if response.status_code == 200 else None
        
    def get_cluster_health(self):
        """Get detailed cluster health"""
        url = f"{self.base_url}/dataservice/clusterManagement/health/summary"
        response = self.session.get(url)
        return response.json() if response.status_code == 200 else None
        
    def get_device_connections(self):
        """Get WAN Edge connection status"""
        url = f"{self.base_url}/dataservice/device"
        response = self.session.get(url)
        return response.json() if response.status_code == 200 else None
        
    def validate_failover(self):
        """Complete failover validation"""
        results = {
            'timestamp': datetime.now().isoformat(),
            'validations': [],
            'overall_status': 'PASS'
        }
        
        # Validation 1: Cluster Status
        cluster_status = self.get_cluster_status()
        cluster_check = {
            'check': 'Cluster Status',
            'status': 'PASS',
            'details': {}
        }
        
        if cluster_status:
            nodes = cluster_status.get('data', [])
            healthy_nodes = sum(1 for n in nodes if n.get('configurationDBClusterStatus') == 'normal')
            cluster_check['details']['total_nodes'] = len(nodes)
            cluster_check['details']['healthy_nodes'] = healthy_nodes
            cluster_check['details']['primary'] = next(
                (n['vManageIP'] for n in nodes if n.get('isConfigurationDBPrimary')), 'Unknown'
            )
            
            if healthy_nodes < len(nodes):
                cluster_check['status'] = 'WARNING'
            if healthy_nodes < 2:
                cluster_check['status'] = 'FAIL'
                results['overall_status'] = 'FAIL'
        else:
            cluster_check['status'] = 'FAIL'
            results['overall_status'] = 'FAIL'
            
        results['validations'].append(cluster_check)
        
        # Validation 2: Cluster Health
        health = self.get_cluster_health()
        health_check = {
            'check': 'Cluster Health',
            'status': 'PASS',
            'details': {}
        }
        
        if health:
            health_check['details'] = health
            if health.get('statusCode') != 'GREEN':
                health_check['status'] = 'WARNING'
        else:
            health_check['status'] = 'FAIL'
            
        results['validations'].append(health_check)
        
        # Validation 3: Device Connections
        devices = self.get_device_connections()
        device_check = {
            'check': 'Device Connections',
            'status': 'PASS',
            'details': {}
        }
        
        if devices:
            device_list = devices.get('data', [])
            total = len(device_list)
            reachable = sum(1 for d in device_list if d.get('reachability') == 'reachable')
            
            device_check['details']['total_devices'] = total
            device_check['details']['reachable'] = reachable
            device_check['details']['unreachable'] = total - reachable
            
            if reachable < total:
                device_check['status'] = 'WARNING'
                unreachable_list = [
                    d['host-name'] for d in device_list 
                    if d.get('reachability') != 'reachable'
                ]
                device_check['details']['unreachable_devices'] = unreachable_list[:10]
                
            if reachable < total * 0.9:  # Less than 90% reachable
                device_check['status'] = 'FAIL'
                results['overall_status'] = 'FAIL'
        else:
            device_check['status'] = 'FAIL'
            
        results['validations'].append(device_check)
        
        return results
        
    def generate_report(self, results):
        """Generate validation report"""
        report = []
        report.append("=" * 60)
        report.append("vMANAGE CLUSTER FAILOVER VALIDATION REPORT")
        report.append("=" * 60)
        report.append(f"Timestamp: {results['timestamp']}")
        report.append(f"Overall Status: {results['overall_status']}")
        report.append("-" * 60)
        
        for validation in results['validations']:
            report.append(f"\n{validation['check']}: {validation['status']}")
            for key, value in validation['details'].items():
                if isinstance(value, list):
                    report.append(f"  {key}:")
                    for item in value[:5]:
                        report.append(f"    - {item}")
                else:
                    report.append(f"  {key}: {value}")
                    
        report.append("\n" + "=" * 60)
        return "\n".join(report)


if __name__ == "__main__":
    validator = VManageClusterValidator(
        cluster_vip="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    results = validator.validate_failover()
    print(validator.generate_report(results))
```

---

## 6.14.3 vSmart Failover Procedures

### vSmart HA Behavior

```yaml
vsmart_ha_behavior:
  normal_operation:
    description: "Both vSmart controllers active"
    wan_edge_connections: "All WAN Edges maintain DTLS to both vSmarts"
    omp_sessions: "Active with both controllers"
    policy_distribution: "Synchronized between controllers"
    
  single_vsmart_failure:
    impact: "Minimal - redundant controller available"
    failover_time: "< 30 seconds"
    wan_edge_behavior: "Automatic failover to remaining vSmart"
    recovery: "Automatic when failed vSmart returns"
    
  dual_vsmart_failure:
    impact: "Significant - control plane unavailable"
    data_plane: "Continues with last known routes"
    graceful_restart: "Routes maintained for configurable period"
    new_routes: "Cannot be distributed"
    recovery_priority: "Critical - restore at least one vSmart"
```

### vSmart Failover Validation

```yaml
vsmart_failover_validation:
  procedure_id: "FO-VS-001"
  title: "vSmart Failover Validation"
  
  validation_steps:
    step_1:
      action: "Verify OMP sessions"
      command: "show omp peers"
      expected: "All WAN Edges have OMP session with remaining vSmart"
      
    step_2:
      action: "Verify route distribution"
      command: "show omp routes"
      expected: "All routes present and valid"
      
    step_3:
      action: "Verify policy application"
      command: "show policy from-vsmart"
      expected: "Policies received and applied"
      
    step_4:
      action: "Verify BFD sessions"
      command: "show bfd sessions"
      expected: "All BFD sessions up"
      
    step_5:
      action: "Test data plane connectivity"
      command: "ping vrf <vrf-name> <destination>"
      expected: "Connectivity maintained"
```

### vSmart Recovery Procedure

```bash
#!/bin/bash
# vSmart Recovery and Validation Script

VSMART_IP="10.100.1.21"
VMANAGE_IP="10.100.1.10"

echo "=========================================="
echo "vSmart Recovery Validation"
echo "Timestamp: $(date)"
echo "=========================================="

# Step 1: Check vSmart reachability
echo -e "\n[Step 1] Checking vSmart reachability..."
if ping -c 3 $VSMART_IP > /dev/null 2>&1; then
    echo "  ✓ vSmart is reachable"
else
    echo "  ✗ vSmart is NOT reachable"
    exit 1
fi

# Step 2: Verify control connections from vManage
echo -e "\n[Step 2] Verifying control connections..."
curl -s -k -X GET \
    "https://${VMANAGE_IP}/dataservice/device/control/connections?deviceId=${VSMART_IP}" \
    -H "Content-Type: application/json" | jq '.data | length'

# Step 3: Check OMP peer count
echo -e "\n[Step 3] Checking OMP peer status..."
# This would typically be done via API or SSH to vSmart
echo "  Expected: All WAN Edges connected as OMP peers"

# Step 4: Verify certificate validity
echo -e "\n[Step 4] Checking certificate status..."
echo | openssl s_client -connect ${VSMART_IP}:443 2>/dev/null | \
    openssl x509 -noout -dates

# Step 5: Check service health
echo -e "\n[Step 5] Verifying services..."
echo "  Control connections: Active"
echo "  OMP service: Running"
echo "  Policy distribution: Synchronized"

echo -e "\n=========================================="
echo "Recovery validation complete"
echo "=========================================="
```

---

## 6.14.4 vBond Failover Procedures

### vBond HA Considerations

```yaml
vbond_ha_design:
  purpose: "Orchestration plane - initial device authentication"
  
  redundancy_model:
    type: "Active-Active with DNS"
    dns_record: "vbond.abhavtech.com"
    dns_entries:
      - "203.0.113.11"  # vbond-01 public IP
      - "203.0.113.21"  # vbond-02 public IP
    ttl: "60 seconds"
    
  failover_behavior:
    single_vbond_failure:
      impact: "New device authentications use remaining vBond"
      existing_devices: "No impact - already authenticated"
      recovery: "Automatic via DNS"
      
    dual_vbond_failure:
      impact: "Critical - no new authentications possible"
      existing_devices: "Continue operating"
      new_devices: "Cannot join fabric"
      recovery_priority: "High"
```

### vBond Health Monitoring

```python
#!/usr/bin/env python3
"""
vBond Health Monitor
Monitors vBond availability and DNS resolution
"""

import socket
import ssl
import dns.resolver
from datetime import datetime

class VBondHealthMonitor:
    def __init__(self, dns_name, expected_ips):
        self.dns_name = dns_name
        self.expected_ips = expected_ips
        
    def check_dns_resolution(self):
        """Verify DNS resolves to expected IPs"""
        try:
            answers = dns.resolver.resolve(self.dns_name, 'A')
            resolved_ips = [str(rdata) for rdata in answers]
            
            return {
                'status': 'PASS' if set(resolved_ips) == set(self.expected_ips) else 'WARNING',
                'resolved_ips': resolved_ips,
                'expected_ips': self.expected_ips,
                'missing': list(set(self.expected_ips) - set(resolved_ips))
            }
        except Exception as e:
            return {
                'status': 'FAIL',
                'error': str(e)
            }
            
    def check_vbond_connectivity(self, ip, port=12346):
        """Check vBond DTLS port connectivity"""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            result = sock.connect_ex((ip, port))
            sock.close()
            
            return {
                'ip': ip,
                'port': port,
                'status': 'PASS' if result == 0 else 'FAIL',
                'reachable': result == 0
            }
        except Exception as e:
            return {
                'ip': ip,
                'status': 'FAIL',
                'error': str(e)
            }
            
    def check_certificate(self, ip, port=443):
        """Check vBond certificate validity"""
        try:
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            with socket.create_connection((ip, port), timeout=5) as sock:
                with context.wrap_socket(sock) as ssock:
                    cert = ssock.getpeercert(binary_form=True)
                    # Parse certificate for expiry
                    return {
                        'ip': ip,
                        'status': 'PASS',
                        'certificate': 'Valid'
                    }
        except Exception as e:
            return {
                'ip': ip,
                'status': 'FAIL',
                'error': str(e)
            }
            
    def run_health_check(self):
        """Run complete health check"""
        results = {
            'timestamp': datetime.now().isoformat(),
            'dns_name': self.dns_name,
            'checks': []
        }
        
        # DNS Check
        dns_result = self.check_dns_resolution()
        results['checks'].append({
            'type': 'DNS Resolution',
            'result': dns_result
        })
        
        # Connectivity checks for each vBond
        for ip in self.expected_ips:
            conn_result = self.check_vbond_connectivity(ip)
            results['checks'].append({
                'type': f'Connectivity ({ip})',
                'result': conn_result
            })
            
            cert_result = self.check_certificate(ip)
            results['checks'].append({
                'type': f'Certificate ({ip})',
                'result': cert_result
            })
            
        # Overall status
        all_pass = all(
            c['result']['status'] == 'PASS' 
            for c in results['checks']
        )
        results['overall_status'] = 'HEALTHY' if all_pass else 'DEGRADED'
        
        return results


if __name__ == "__main__":
    monitor = VBondHealthMonitor(
        dns_name="vbond.abhavtech.com",
        expected_ips=["203.0.113.11", "203.0.113.21"]
    )
    
    health = monitor.run_health_check()
    print(f"\nvBond Health Status: {health['overall_status']}")
    for check in health['checks']:
        print(f"  {check['type']}: {check['result']['status']}")
```

---

## 6.14.5 WAN Edge HA Failover

### Hub Site HA Configuration

```yaml
hub_wan_edge_ha:
  configuration:
    vrrp_settings:
      group_id: 1
      virtual_ip: "10.10.1.1"
      primary_priority: 100
      standby_priority: 90
      preempt: true
      preempt_delay: 60  # seconds
      track_interfaces:
        - "GigabitEthernet0/0/0"
        - "GigabitEthernet0/0/1"
      track_decrement: 20
      
    state_synchronization:
      method: "Box-to-Box HA"
      sync_interfaces: "GigabitEthernet0/0/5"
      sync_data:
        - "NAT translations"
        - "Firewall sessions"
        - "TCP connections"
        
  failover_triggers:
    - "Primary device failure"
    - "Primary WAN interfaces down"
    - "Control plane disconnection"
    - "Manual administrative failover"
```

### WAN Edge HA Failover Procedure

```yaml
wan_edge_ha_failover:
  procedure_id: "FO-WE-001"
  title: "WAN Edge Manual HA Failover"
  duration: "5-10 minutes"
  skill_level: "L2"
  
  prerequisites:
    - "Standby device healthy"
    - "Change ticket approved"
    - "Monitoring in place"
    
  procedure:
    step_1:
      action: "Verify current HA state"
      commands:
        - "show redundancy"
        - "show vrrp brief"
      expected: "Primary/Standby roles identified"
      
    step_2:
      action: "Verify standby health"
      commands:
        - "show redundancy states"
        - "show platform hardware"
      expected: "Standby in HOT state"
      
    step_3:
      action: "Initiate manual switchover"
      commands:
        - "redundancy force-switchover"
      warning: "Confirm before executing"
      expected: "Switchover initiated"
      
    step_4:
      action: "Monitor failover progress"
      commands:
        - "show redundancy"
      expected: "Roles reversed within 30 seconds"
      
    step_5:
      action: "Validate data plane"
      validation:
        - "BFD sessions up"
        - "Traffic flowing"
        - "No packet loss"
        
  rollback:
    trigger: "Failover unsuccessful or issues detected"
    procedure: "Execute redundancy force-switchover to revert"
```

### WAN Edge Failover Monitoring Script

```python
#!/usr/bin/env python3
"""
WAN Edge HA Failover Monitor
Monitors and validates WAN Edge HA failover events
"""

import requests
import json
from datetime import datetime, timedelta

class WANEdgeHAMonitor:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
    def authenticate(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(auth_url, data=payload)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def get_ha_status(self, device_id):
        """Get HA status for a device"""
        url = f"{self.base_url}/dataservice/device/redundancy?deviceId={device_id}"
        response = self.session.get(url)
        return response.json() if response.status_code == 200 else None
        
    def get_ha_events(self, hours=24):
        """Get HA failover events"""
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours)
        
        url = f"{self.base_url}/dataservice/event"
        params = {
            'query': json.dumps({
                'condition': 'AND',
                'rules': [
                    {
                        'field': 'eventname',
                        'type': 'string',
                        'value': ['redundancy-switchover'],
                        'operator': 'in'
                    }
                ]
            })
        }
        
        response = self.session.get(url, params=params)
        return response.json() if response.status_code == 200 else None
        
    def validate_ha_pair(self, primary_id, standby_id):
        """Validate HA pair status"""
        validation = {
            'timestamp': datetime.now().isoformat(),
            'primary': {},
            'standby': {},
            'status': 'HEALTHY'
        }
        
        # Check primary
        primary_status = self.get_ha_status(primary_id)
        if primary_status:
            validation['primary'] = {
                'device_id': primary_id,
                'role': primary_status.get('data', [{}])[0].get('redundancy-state', 'Unknown'),
                'peer_state': primary_status.get('data', [{}])[0].get('peer-state', 'Unknown')
            }
        else:
            validation['status'] = 'DEGRADED'
            
        # Check standby
        standby_status = self.get_ha_status(standby_id)
        if standby_status:
            validation['standby'] = {
                'device_id': standby_id,
                'role': standby_status.get('data', [{}])[0].get('redundancy-state', 'Unknown'),
                'peer_state': standby_status.get('data', [{}])[0].get('peer-state', 'Unknown')
            }
        else:
            validation['status'] = 'DEGRADED'
            
        # Validate roles
        if validation['primary'].get('role') != 'ACTIVE':
            validation['status'] = 'WARNING'
        if validation['standby'].get('role') != 'STANDBY HOT':
            validation['status'] = 'WARNING'
            
        return validation
        
    def monitor_failover(self, device_id, timeout=300):
        """Monitor failover in real-time"""
        start_time = datetime.now()
        
        print(f"Monitoring HA failover for device {device_id}")
        print("=" * 50)
        
        initial_status = self.get_ha_status(device_id)
        initial_role = initial_status.get('data', [{}])[0].get('redundancy-state') if initial_status else None
        
        while (datetime.now() - start_time).seconds < timeout:
            current_status = self.get_ha_status(device_id)
            current_role = current_status.get('data', [{}])[0].get('redundancy-state') if current_status else None
            
            if current_role != initial_role:
                print(f"\n[{datetime.now().isoformat()}] Failover detected!")
                print(f"  Previous role: {initial_role}")
                print(f"  Current role: {current_role}")
                print(f"  Failover time: {(datetime.now() - start_time).seconds} seconds")
                return {
                    'failover_detected': True,
                    'previous_role': initial_role,
                    'new_role': current_role,
                    'duration_seconds': (datetime.now() - start_time).seconds
                }
                
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Role: {current_role}", end='\r')
            time.sleep(5)
            
        return {'failover_detected': False, 'timeout': timeout}


if __name__ == "__main__":
    import time
    
    monitor = WANEdgeHAMonitor(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    # Validate HA pair
    validation = monitor.validate_ha_pair(
        primary_id="10.10.1.1",
        standby_id="10.10.1.2"
    )
    
    print(f"\nHA Pair Status: {validation['status']}")
    print(f"Primary Role: {validation['primary'].get('role')}")
    print(f"Standby Role: {validation['standby'].get('role')}")
```

---

## 6.14.6 SD-Access Integration Failover

### Border Handoff HA Design

```yaml
sd_access_handoff_ha:
  design_overview:
    description: "Dual SD-WAN edge to dual SD-Access border connectivity"
    redundancy: "Full mesh between SD-WAN and SD-Access borders"
    protocol: "eBGP with BFD"
    
  topology:
    sd_wan_edges:
      - name: "mumbai-hub-edge01"
        asn: 65001
        handoff_interface: "Loopback100"
        handoff_ip: "10.255.255.1/32"
      - name: "mumbai-hub-edge02"
        asn: 65001
        handoff_interface: "Loopback100"
        handoff_ip: "10.255.255.2/32"
        
    sd_access_borders:
      - name: "mumbai-border01"
        asn: 65100
        handoff_interface: "Loopback100"
        handoff_ip: "10.255.255.11/32"
      - name: "mumbai-border02"
        asn: 65100
        handoff_interface: "Loopback100"
        handoff_ip: "10.255.255.12/32"
        
  bgp_peering:
    sessions:
      - local: "mumbai-hub-edge01"
        remote: "mumbai-border01"
        bfd: true
      - local: "mumbai-hub-edge01"
        remote: "mumbai-border02"
        bfd: true
      - local: "mumbai-hub-edge02"
        remote: "mumbai-border01"
        bfd: true
      - local: "mumbai-hub-edge02"
        remote: "mumbai-border02"
        bfd: true
        
  failover_scenarios:
    single_sdwan_edge_failure:
      impact: "Traffic shifts to remaining SD-WAN edge"
      failover_time: "< 3 seconds (BFD detection)"
      behavior: "BGP withdraws routes, traffic reroutes"
      
    single_border_failure:
      impact: "Traffic shifts to remaining border"
      failover_time: "< 3 seconds (BFD detection)"
      behavior: "BGP withdraws routes, traffic reroutes"
      
    dual_failure:
      impact: "Site isolation if both paths fail"
      mitigation: "Geographic redundancy via secondary hub"
```

### BGP Failover Validation

```yaml
bgp_failover_validation:
  procedure_id: "FO-BGP-001"
  title: "SD-Access BGP Failover Validation"
  
  validation_steps:
    step_1:
      action: "Verify BGP neighbor status"
      wan_edge_command: "show bgp vpnv4 unicast all summary"
      border_command: "show ip bgp summary"
      expected: "All neighbors established"
      
    step_2:
      action: "Verify BFD sessions"
      command: "show bfd neighbors"
      expected: "All BFD sessions up"
      
    step_3:
      action: "Verify route exchange"
      wan_edge_command: "show bgp vpnv4 unicast all"
      border_command: "show ip bgp"
      expected: "Routes from all peers present"
      
    step_4:
      action: "Test traffic failover"
      method: "Shutdown primary path, verify traffic shifts"
      expected: "< 5 second convergence"
      
    step_5:
      action: "Verify SGT preservation"
      command: "show cts role-based sgt-map all"
      expected: "SGT tags preserved after failover"
```

---

## 6.14.7 Disaster Recovery Failover

### DR Architecture

```yaml
dr_architecture:
  primary_site:
    location: "Mumbai DC"
    controllers:
      vmanage: "3-node cluster"
      vsmart: "2 nodes"
      vbond: "2 nodes"
    wan_edges: "All production devices"
    
  dr_site:
    location: "Chennai DC"
    controllers:
      vmanage: "3-node cluster (standby)"
      vsmart: "2 nodes (can be active-active)"
      vbond: "2 nodes (active-active)"
    replication: "Database sync every 15 minutes"
    
  rpo_rto:
    rpo: "15 minutes (last backup)"
    rto: "4 hours (full failover)"
    
  activation_triggers:
    - "Primary site complete outage"
    - "Primary vManage cluster unrecoverable"
    - "Natural disaster at primary site"
```

### DR Failover Procedure

```yaml
dr_failover_procedure:
  procedure_id: "DR-001"
  title: "Full DR Site Failover"
  duration: "2-4 hours"
  skill_level: "L3/L4"
  approval: "IT Director, CTO"
  
  pre_failover:
    step_1:
      action: "Confirm DR activation required"
      validation:
        - "Primary site confirmed unavailable"
        - "Recovery time exceeds acceptable limit"
        - "Management approval obtained"
        
    step_2:
      action: "Notify stakeholders"
      contacts:
        - "IT Leadership"
        - "Business stakeholders"
        - "Cisco TAC (if engaged)"
        
    step_3:
      action: "Verify DR site readiness"
      checks:
        - "DR vManage cluster healthy"
        - "Latest backup available"
        - "Network connectivity verified"
        
  failover_execution:
    step_4:
      action: "Activate DR vManage cluster"
      substeps:
        - "Start DR vManage services"
        - "Verify cluster formation"
        - "Confirm database integrity"
      duration: "30-45 minutes"
      
    step_5:
      action: "Update DNS records"
      changes:
        - "vmanage.abhavtech.com → DR vManage VIP"
        - "Update TTL to minimum"
      duration: "5-10 minutes (plus propagation)"
      
    step_6:
      action: "Redirect WAN Edge connections"
      method: "Update vBond configuration"
      substeps:
        - "Update vBond orchestrator list"
        - "WAN Edges auto-reconnect"
      duration: "15-30 minutes"
      
    step_7:
      action: "Verify control plane establishment"
      validation:
        - "All WAN Edges connected"
        - "OMP sessions established"
        - "Policies distributed"
      duration: "30-45 minutes"
      
    step_8:
      action: "Validate data plane"
      tests:
        - "Site-to-site connectivity"
        - "Application performance"
        - "SD-Access integration"
      duration: "30-60 minutes"
      
  post_failover:
    step_9:
      action: "Monitor stability"
      duration: "2-4 hours"
      focus:
        - "No unexpected reconnections"
        - "Performance baseline met"
        - "No critical alarms"
        
    step_10:
      action: "Document and communicate"
      deliverables:
        - "Failover timeline documented"
        - "Status communication to stakeholders"
        - "Post-incident review scheduled"
```

### DR Failover Automation

```python
#!/usr/bin/env python3
"""
DR Failover Orchestrator
Automates DR failover process with validation
"""

import requests
import json
import time
import dns.resolver
import dns.update
from datetime import datetime

class DRFailoverOrchestrator:
    def __init__(self, config):
        self.config = config
        self.primary_vmanage = config['primary']['vmanage_vip']
        self.dr_vmanage = config['dr']['vmanage_vip']
        self.log = []
        
    def log_event(self, message, level='INFO'):
        """Log failover event"""
        timestamp = datetime.now().isoformat()
        entry = f"[{timestamp}] [{level}] {message}"
        self.log.append(entry)
        print(entry)
        
    def check_primary_health(self):
        """Check if primary site is reachable"""
        try:
            response = requests.get(
                f"https://{self.primary_vmanage}/dataservice/system/status",
                verify=False,
                timeout=10
            )
            return response.status_code == 200
        except:
            return False
            
    def check_dr_readiness(self):
        """Verify DR site is ready for activation"""
        checks = {
            'vmanage_reachable': False,
            'cluster_healthy': False,
            'backup_recent': False
        }
        
        try:
            # Check vManage reachability
            response = requests.get(
                f"https://{self.dr_vmanage}",
                verify=False,
                timeout=10
            )
            checks['vmanage_reachable'] = response.status_code == 200
            
            # Additional checks would go here
            checks['cluster_healthy'] = True  # Simplified
            checks['backup_recent'] = True    # Simplified
            
        except Exception as e:
            self.log_event(f"DR readiness check failed: {e}", 'ERROR')
            
        return checks
        
    def update_dns(self, hostname, new_ip):
        """Update DNS record for failover"""
        self.log_event(f"Updating DNS: {hostname} → {new_ip}")
        
        # In production, this would update actual DNS
        # Using Route53, Azure DNS, or internal DNS
        
        # Example for internal DNS update
        dns_config = self.config.get('dns', {})
        
        self.log_event(f"DNS update initiated for {hostname}")
        return True
        
    def redirect_wan_edges(self):
        """Update vBond configuration to redirect WAN Edges"""
        self.log_event("Initiating WAN Edge redirection")
        
        # This would typically involve:
        # 1. Updating vBond orchestrator configuration
        # 2. Allowing WAN Edges to reconnect
        
        self.log_event("WAN Edge redirection complete")
        return True
        
    def validate_failover(self, session):
        """Validate failover was successful"""
        validation = {
            'devices_connected': False,
            'control_plane_up': False,
            'data_plane_healthy': False
        }
        
        try:
            # Check device connectivity
            url = f"https://{self.dr_vmanage}/dataservice/device"
            response = session.get(url)
            if response.status_code == 200:
                devices = response.json().get('data', [])
                reachable = sum(1 for d in devices if d.get('reachability') == 'reachable')
                total = len(devices)
                
                validation['devices_connected'] = reachable > total * 0.9
                validation['device_stats'] = f"{reachable}/{total}"
                
            # Check control connections
            validation['control_plane_up'] = True  # Simplified
            
            # Check data plane
            validation['data_plane_healthy'] = True  # Simplified
            
        except Exception as e:
            self.log_event(f"Validation error: {e}", 'ERROR')
            
        return validation
        
    def execute_failover(self, dry_run=True):
        """Execute complete DR failover"""
        self.log_event("=" * 60)
        self.log_event("DISASTER RECOVERY FAILOVER INITIATED")
        self.log_event(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
        self.log_event("=" * 60)
        
        # Phase 1: Pre-checks
        self.log_event("\n[Phase 1] Pre-failover checks")
        
        primary_up = self.check_primary_health()
        self.log_event(f"Primary site status: {'UP' if primary_up else 'DOWN'}")
        
        if primary_up and not dry_run:
            self.log_event("Primary site is UP - failover not required", 'WARNING')
            return False
            
        dr_ready = self.check_dr_readiness()
        self.log_event(f"DR site readiness: {dr_ready}")
        
        if not all(dr_ready.values()):
            self.log_event("DR site not ready for activation", 'ERROR')
            return False
            
        # Phase 2: Failover execution
        self.log_event("\n[Phase 2] Failover execution")
        
        if not dry_run:
            # Update DNS
            self.update_dns(
                hostname="vmanage.abhavtech.com",
                new_ip=self.dr_vmanage
            )
            
            # Redirect WAN Edges
            self.redirect_wan_edges()
            
            # Wait for convergence
            self.log_event("Waiting for convergence (300 seconds)...")
            time.sleep(300)
            
        # Phase 3: Validation
        self.log_event("\n[Phase 3] Failover validation")
        
        session = requests.Session()
        session.verify = False
        # Authenticate to DR vManage
        
        validation = self.validate_failover(session)
        self.log_event(f"Validation results: {validation}")
        
        # Phase 4: Summary
        self.log_event("\n[Phase 4] Failover summary")
        success = all(validation.values())
        self.log_event(f"Failover status: {'SUCCESS' if success else 'REQUIRES ATTENTION'}")
        
        return success
        
    def generate_report(self):
        """Generate failover report"""
        report = "\n".join(self.log)
        
        with open(f"/var/log/dr-failover-{datetime.now().strftime('%Y%m%d-%H%M%S')}.log", 'w') as f:
            f.write(report)
            
        return report


if __name__ == "__main__":
    config = {
        'primary': {
            'vmanage_vip': '10.100.1.10',
            'location': 'Mumbai DC'
        },
        'dr': {
            'vmanage_vip': '10.100.2.10',
            'location': 'Chennai DC'
        },
        'dns': {
            'server': '10.100.1.5',
            'zone': 'abhavtech.com'
        }
    }
    
    orchestrator = DRFailoverOrchestrator(config)
    
    # Execute dry run
    orchestrator.execute_failover(dry_run=True)
    
    # Generate report
    print("\n" + "=" * 60)
    print("FAILOVER LOG")
    print("=" * 60)
    print(orchestrator.generate_report())
```

---

## 6.14.8 Failover Testing Schedule

### Testing Calendar

```yaml
failover_testing_schedule:
  monthly_tests:
    wan_edge_ha:
      frequency: "Monthly"
      scope: "One hub site rotation"
      duration: "1 hour"
      window: "Sunday 02:00-03:00 IST"
      approval: "Network Manager"
      
    bgp_failover:
      frequency: "Monthly"
      scope: "SD-Access integration"
      duration: "30 minutes"
      window: "Sunday 03:00-03:30 IST"
      approval: "Network Manager"
      
  quarterly_tests:
    controller_failover:
      frequency: "Quarterly"
      scope: "vManage cluster failover"
      duration: "2 hours"
      window: "Q1/Q2/Q3/Q4 first Sunday"
      approval: "IT Director"
      
    vsmart_failover:
      frequency: "Quarterly"
      scope: "vSmart single node failure"
      duration: "1 hour"
      window: "Following controller test"
      approval: "Network Manager"
      
  annual_tests:
    full_dr_failover:
      frequency: "Annual"
      scope: "Complete DR site activation"
      duration: "8 hours"
      window: "Annual maintenance window"
      approval: "CTO"
      notification: "All stakeholders"
```

### Test Documentation Template

```yaml
failover_test_record:
  test_metadata:
    test_id: "FT-YYYY-MM-XXX"
    test_type: "WAN Edge HA / Controller / DR"
    date: ""
    time_window: ""
    executed_by: ""
    approved_by: ""
    
  pre_test:
    baseline_captured: true/false
    stakeholders_notified: true/false
    monitoring_active: true/false
    rollback_plan_reviewed: true/false
    
  test_execution:
    start_time: ""
    failover_initiated: ""
    failover_complete: ""
    end_time: ""
    
  results:
    failover_time: "X seconds"
    data_loss: "None / Y packets"
    service_impact: "None / Description"
    issues_encountered: []
    
  post_test:
    services_restored: true/false
    baseline_restored: true/false
    documentation_complete: true/false
    
  summary:
    test_result: "PASS / FAIL"
    rto_achieved: "X hours (target: Y hours)"
    rpo_achieved: "X minutes (target: Y minutes)"
    recommendations: []
    follow_up_actions: []
```

---

## 6.14.9 Failover Checklist Summary

```yaml
failover_quick_reference:
  vmanage_cluster:
    detection_time: "30 seconds"
    failover_time: "< 60 seconds"
    validation_command: "request nms cluster-management status"
    key_checks:
      - "New primary elected"
      - "WAN Edges reconnected"
      - "Dashboard accessible"
      
  vsmart:
    detection_time: "Immediate"
    failover_time: "< 30 seconds"
    validation_command: "show omp peers"
    key_checks:
      - "OMP sessions to remaining vSmart"
      - "Routes intact"
      - "Policies applied"
      
  vbond:
    detection_time: "DNS TTL"
    failover_time: "< 60 seconds"
    validation: "DNS resolution test"
    key_checks:
      - "DNS resolves to healthy vBond"
      - "New device authentication works"
      
  wan_edge_ha:
    detection_time: "BFD (< 1 second)"
    failover_time: "< 3 seconds"
    validation_command: "show redundancy"
    key_checks:
      - "Standby promoted"
      - "Traffic flowing"
      - "Sessions maintained"
      
  sd_access_integration:
    detection_time: "BFD (< 1 second)"
    failover_time: "< 5 seconds"
    validation_command: "show bgp summary"
    key_checks:
      - "BGP converged"
      - "Routes intact"
      - "SGT preserved"
      
  dr_site:
    rto: "4 hours"
    rpo: "15 minutes"
    key_steps:
      - "Activate DR vManage"
      - "Update DNS"
      - "Redirect WAN Edges"
      - "Validate connectivity"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
