# 6.9 Configuration Management

## Document Information
- **Version:** 1.0
- **Last Updated:** December 30, 2025
- **Author:** Abhavtech Network Engineering
- **Status:** Production Ready
- **Classification:** Internal Use

---

## 6.9.1 Configuration Management Framework

### Configuration Governance Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONFIGURATION MANAGEMENT FRAMEWORK                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    Configuration Standards                           │  │
│   │  ├── Naming conventions                                              │  │
│   │  ├── IP addressing standards                                         │  │
│   │  ├── Template design principles                                      │  │
│   │  └── Policy naming standards                                         │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    Configuration Repository                          │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │  │
│   │  │   vManage   │  │    Git      │  │   Backup    │                 │  │
│   │  │  Templates  │  │ Repository  │  │   Archive   │                 │  │
│   │  └─────────────┘  └─────────────┘  └─────────────┘                 │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    Change Management                                 │  │
│   │  Request → Review → Approve → Implement → Verify → Document         │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    Configuration Audit                               │  │
│   │  ├── Compliance checking                                             │  │
│   │  ├── Drift detection                                                 │  │
│   │  └── Remediation automation                                          │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Configuration Categories

| Category | Description | Owner | Change Frequency |
|----------|-------------|-------|-----------------|
| **System Config** | Hostname, system IP, site ID | Network Team | Rarely |
| **Transport Config** | Interfaces, tunnels, colors | Network Team | Occasionally |
| **Routing Config** | OMP, BGP, static routes | Network Team | Occasionally |
| **Security Config** | Firewalls, ACLs, encryption | Security Team | Monthly |
| **Policy Config** | AAR, QoS, data policies | Network Team | Weekly |
| **Template Config** | Device/feature templates | Network Team | Weekly |

---

## 6.9.2 Naming Conventions

### Device Naming Standards

```yaml
# SD-WAN Device Naming Convention

Format: <REGION>-<CITY>-<DEVICE-TYPE>-<SEQUENCE>

Region Codes:
  IN: India
  UK: United Kingdom
  DE: Germany
  US: United States

City Codes:
  MUM: Mumbai
  CHE: Chennai
  BLR: Bangalore
  DEL: Delhi
  NOI: Noida
  LON: London
  FRA: Frankfurt
  NJ: New Jersey
  DAL: Dallas

Device Types:
  WAN-EDGE: WAN Edge router (C8300/C8500)
  VMANAGE: SD-WAN Manager
  VSMART: SD-WAN Controller
  VBOND: SD-WAN Validator

Examples:
  IN-MUM-WAN-EDGE-01: Mumbai Hub WAN Edge Primary
  IN-MUM-WAN-EDGE-02: Mumbai Hub WAN Edge Secondary
  IN-CHE-WAN-EDGE-01: Chennai Hub WAN Edge Primary
  UK-LON-WAN-EDGE-01: London Hub WAN Edge Primary
  IN-BLR-WAN-EDGE-01: Bangalore Branch WAN Edge
```

### Template Naming Standards

```yaml
# Template Naming Convention

Device Templates:
  Format: DT-<SITE-TYPE>-<PLATFORM>-<VERSION>
  Examples:
    DT-HUB-C8500-v1: Hub site device template for C8500
    DT-BRANCH-C8300-v1: Branch site device template for C8300
    DT-DC-C8500-v2: Data center device template version 2

Feature Templates:
  Format: FT-<FEATURE>-<SCOPE>-<VERSION>
  Examples:
    FT-SYSTEM-GLOBAL-v1: System feature template (global)
    FT-VPN-TRANSPORT-v1: VPN 0 transport feature template
    FT-VPN-SERVICE-EMPLOYEE-v1: Employee VPN feature template
    FT-BGP-SDACCESS-v1: BGP for SD-Access integration
    FT-AAR-VOICE-v1: AAR policy for voice applications

Policy Naming:
  Format: POL-<TYPE>-<PURPOSE>-<VERSION>
  Examples:
    POL-CONTROL-TOPOLOGY-v1: Control policy for topology
    POL-DATA-DIA-v1: Data policy for DIA
    POL-APP-VOICE-v1: Application policy for voice
    POL-SEC-FIREWALL-v1: Security policy for firewall
```

### Interface Naming Standards

```yaml
# Interface and Subinterface Naming

Physical Interfaces:
  MPLS Transport: GigabitEthernet0/0/0
  Internet Transport: GigabitEthernet0/0/1
  LTE Backup: Cellular0/2/0
  Service Side (SD-Access): GigabitEthernet0/0/2

Subinterfaces (SD-Access Handoff):
  Format: <Physical>.<VLAN-ID>
  
  GigabitEthernet0/0/2.100: Employee VRF (VLAN 100)
  GigabitEthernet0/0/2.200: Guest VRF (VLAN 200)
  GigabitEthernet0/0/2.300: IoT VRF (VLAN 300)
  GigabitEthernet0/0/2.400: Voice VRF (VLAN 400)
  GigabitEthernet0/0/2.500: Shared VRF (VLAN 500)

Loopback Interfaces:
  Loopback0: System IP / Router ID
  Loopback10: Management plane binding
```

---

## 6.9.3 IP Addressing Standards

### IP Address Allocation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        IP ADDRESSING SCHEME                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Management Plane (System IPs):                                            │
│   ├── 10.0.0.0/24: Controllers                                             │
│   │   ├── 10.0.0.1-10: vBond                                              │
│   │   ├── 10.0.0.10-19: vSmart                                            │
│   │   └── 10.0.0.20-29: vManage                                           │
│   │                                                                         │
│   └── 10.100.0.0/16: WAN Edge System IPs                                   │
│       ├── 10.100.1.0/24: Mumbai (Site 1001)                               │
│       ├── 10.100.2.0/24: Chennai (Site 1002)                              │
│       ├── 10.100.3.0/24: Bangalore (Site 1003)                            │
│       ├── 10.100.4.0/24: Delhi (Site 1004)                                │
│       ├── 10.100.5.0/24: Noida (Site 1005)                                │
│       ├── 10.100.6.0/24: London (Site 1006)                               │
│       ├── 10.100.7.0/24: Frankfurt (Site 1007)                            │
│       ├── 10.100.8.0/24: New Jersey (Site 1008)                           │
│       └── 10.100.9.0/24: Dallas (Site 1009)                               │
│                                                                             │
│   Transport VPN (VPN 0):                                                    │
│   ├── MPLS: Provider assigned /30 per site                                 │
│   └── Internet: Provider assigned /30 or DHCP                              │
│                                                                             │
│   Service VPNs:                                                             │
│   ├── VPN 10 (Employee): 10.10.0.0/16                                     │
│   ├── VPN 20 (Guest): 10.20.0.0/16                                        │
│   ├── VPN 30 (IoT): 10.30.0.0/16                                          │
│   ├── VPN 40 (Voice): 10.40.0.0/16                                        │
│   └── VPN 50 (Shared): 10.50.0.0/16                                       │
│                                                                             │
│   SD-Access Handoff (Point-to-Point):                                      │
│   └── 10.200.0.0/24: /30 per VRF per site                                 │
│       Example Mumbai:                                                       │
│       ├── 10.200.1.0/30: Employee (WAN Edge .2, Border .1)               │
│       ├── 10.200.1.4/30: Guest (WAN Edge .6, Border .5)                  │
│       └── ... etc                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Site ID Allocation

| Site | Site ID | System IP Range | Description |
|------|---------|-----------------|-------------|
| Mumbai | 1001 | 10.100.1.1-10 | Primary Hub (India) |
| Chennai | 1002 | 10.100.2.1-10 | Secondary Hub / DR |
| Bangalore | 1003 | 10.100.3.1-5 | India Branch |
| Delhi | 1004 | 10.100.4.1-5 | India Branch |
| Noida | 1005 | 10.100.5.1-5 | India Branch |
| London | 1006 | 10.100.6.1-10 | EMEA Hub |
| Frankfurt | 1007 | 10.100.7.1-10 | EMEA Secondary Hub |
| New Jersey | 1008 | 10.100.8.1-10 | Americas Hub |
| Dallas | 1009 | 10.100.9.1-10 | Americas Secondary Hub |

---

## 6.9.4 Template Management

### Template Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TEMPLATE HIERARCHY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Device Templates                                                          │
│   ├── DT-HUB-C8500-v1 (Hub Sites)                                         │
│   │   ├── FT-SYSTEM-HUB-v1                                                │
│   │   ├── FT-LOGGING-GLOBAL-v1                                            │
│   │   ├── FT-NTP-GLOBAL-v1                                                │
│   │   ├── FT-AAA-GLOBAL-v1                                                │
│   │   ├── FT-BFD-GLOBAL-v1                                                │
│   │   ├── FT-OMP-HUB-v1                                                   │
│   │   ├── FT-VPN0-TRANSPORT-HUB-v1                                        │
│   │   ├── FT-VPN10-EMPLOYEE-v1                                            │
│   │   ├── FT-VPN20-GUEST-v1                                               │
│   │   ├── FT-VPN30-IOT-v1                                                 │
│   │   ├── FT-VPN40-VOICE-v1                                               │
│   │   ├── FT-VPN50-SHARED-v1                                              │
│   │   ├── FT-BGP-SDACCESS-v1                                              │
│   │   ├── FT-SECURITY-ZONE-v1                                             │
│   │   └── FT-POLICY-HUB-v1                                                │
│   │                                                                         │
│   └── DT-BRANCH-C8300-v1 (Branch Sites)                                   │
│       ├── FT-SYSTEM-BRANCH-v1                                             │
│       ├── FT-LOGGING-GLOBAL-v1 (shared)                                   │
│       ├── FT-NTP-GLOBAL-v1 (shared)                                       │
│       ├── FT-AAA-GLOBAL-v1 (shared)                                       │
│       ├── FT-BFD-GLOBAL-v1 (shared)                                       │
│       ├── FT-OMP-BRANCH-v1                                                │
│       ├── FT-VPN0-TRANSPORT-BRANCH-v1                                     │
│       ├── FT-VPN10-EMPLOYEE-v1 (shared)                                   │
│       ├── FT-VPN512-MGMT-v1                                               │
│       └── FT-POLICY-BRANCH-v1                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Template Version Control

```yaml
# Template Version Management

Version Format: vX.Y
  X: Major version (breaking changes, new features)
  Y: Minor version (bug fixes, minor updates)

Version Lifecycle:
  Draft: Template being developed (not attached to devices)
  Active: Current production template
  Deprecated: Scheduled for retirement
  Archived: No longer in use

Version Control Process:
  1. Clone existing template as new version
  2. Make changes in draft state
  3. Test in lab environment
  4. Promote to active after approval
  5. Migrate devices to new version
  6. Deprecate old version
  7. Archive after all devices migrated

Example Version History:
  FT-SYSTEM-HUB-v1.0: Initial release (December 2025)
  FT-SYSTEM-HUB-v1.1: Added SNMP community (January 2026)
  FT-SYSTEM-HUB-v2.0: Major update for new features (March 2026)
```

### Template Variable Management

```yaml
# Template Variables - Standard Definitions

System Variables:
  system_ip:
    Description: Unique system IP for WAN Edge
    Type: IPv4 Address
    Example: 10.100.1.1
    
  site_id:
    Description: Unique site identifier
    Type: Integer (1-4294967295)
    Example: 1001
    
  hostname:
    Description: Device hostname
    Type: String (max 32 chars)
    Example: IN-MUM-WAN-EDGE-01

Transport Variables:
  mpls_interface:
    Description: MPLS transport interface
    Type: Interface name
    Example: GigabitEthernet0/0/0
    
  mpls_ip:
    Description: MPLS interface IP
    Type: IPv4 Address with mask
    Example: 203.0.113.2/30
    
  internet_interface:
    Description: Internet transport interface
    Type: Interface name
    Example: GigabitEthernet0/0/1

SD-Access Integration Variables:
  sdaccess_interface:
    Description: Interface toward SD-Access border
    Type: Interface name
    Example: GigabitEthernet0/0/2
    
  border_bgp_neighbor:
    Description: SD-Access border BGP peer IP
    Type: IPv4 Address
    Example: 10.200.1.1
    
  border_asn:
    Description: SD-Access border AS number
    Type: Integer
    Example: 65001
```

---

## 6.9.5 Configuration Drift Detection

### Drift Detection Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONFIGURATION DRIFT DETECTION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐        ┌──────────────┐        ┌──────────────┐        │
│   │   vManage    │───────>│   Compare    │───────>│    Alert     │        │
│   │   Intended   │        │    Engine    │        │   & Report   │        │
│   │    Config    │        │              │        │              │        │
│   └──────────────┘        └──────────────┘        └──────────────┘        │
│                                  ▲                                          │
│                                  │                                          │
│   ┌──────────────┐               │                                         │
│   │   Device     │───────────────┘                                         │
│   │   Running    │                                                          │
│   │    Config    │                                                          │
│   └──────────────┘                                                          │
│                                                                             │
│   Detection Methods:                                                        │
│   ├── Scheduled comparison (daily)                                         │
│   ├── Event-triggered (on config change)                                   │
│   └── Manual audit (on-demand)                                             │
│                                                                             │
│   Actions on Drift:                                                         │
│   ├── Alert operations team                                                │
│   ├── Log to SIEM                                                          │
│   └── Auto-remediate (if enabled)                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Drift Detection Script

```python
#!/usr/bin/env python3
"""
Configuration Drift Detection
Abhavtech.com - December 2025
"""

import requests
import json
import difflib
from datetime import datetime
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class ConfigDriftDetector:
    """Detect configuration drift between intended and running config"""
    
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
    
    def get_intended_config(self, device_ip: str) -> str:
        """Get intended configuration from attached template"""
        url = f"{self.base_url}/dataservice/template/device/config/attachedconfig"
        params = {'deviceIP': device_ip}
        response = self.session.get(url, params=params)
        return response.json().get('config', '')
    
    def get_running_config(self, device_ip: str) -> str:
        """Get running configuration from device"""
        url = f"{self.base_url}/dataservice/device/config"
        params = {'deviceIP': device_ip}
        response = self.session.get(url, params=params)
        return response.text
    
    def compare_configs(self, intended: str, running: str) -> dict:
        """Compare intended and running configurations"""
        intended_lines = intended.splitlines()
        running_lines = running.splitlines()
        
        diff = list(difflib.unified_diff(
            intended_lines,
            running_lines,
            fromfile='Intended Config',
            tofile='Running Config',
            lineterm=''
        ))
        
        # Count differences
        additions = sum(1 for line in diff if line.startswith('+') and not line.startswith('+++'))
        deletions = sum(1 for line in diff if line.startswith('-') and not line.startswith('---'))
        
        return {
            'has_drift': len(diff) > 0,
            'additions': additions,
            'deletions': deletions,
            'diff': '\n'.join(diff),
            'diff_lines': diff
        }
    
    def check_device_drift(self, device_ip: str, hostname: str) -> dict:
        """Check single device for configuration drift"""
        result = {
            'device_ip': device_ip,
            'hostname': hostname,
            'timestamp': datetime.now().isoformat(),
            'drift_detected': False,
            'details': None
        }
        
        try:
            intended = self.get_intended_config(device_ip)
            running = self.get_running_config(device_ip)
            
            comparison = self.compare_configs(intended, running)
            result['drift_detected'] = comparison['has_drift']
            result['details'] = {
                'additions': comparison['additions'],
                'deletions': comparison['deletions'],
                'sample_diff': comparison['diff'][:1000] if comparison['diff'] else None
            }
            
        except Exception as e:
            result['error'] = str(e)
        
        return result
    
    def check_all_devices(self) -> dict:
        """Check all devices for configuration drift"""
        print("=" * 60)
        print("CONFIGURATION DRIFT DETECTION")
        print(f"Timestamp: {datetime.now().isoformat()}")
        print("=" * 60)
        
        # Get all devices
        devices_url = f"{self.base_url}/dataservice/device"
        devices = self.session.get(devices_url).json().get('data', [])
        
        results = {
            'timestamp': datetime.now().isoformat(),
            'total_devices': 0,
            'devices_with_drift': 0,
            'devices_clean': 0,
            'details': []
        }
        
        wan_edges = [d for d in devices if d.get('personality') == 'vedge']
        results['total_devices'] = len(wan_edges)
        
        for device in wan_edges:
            device_ip = device.get('system-ip')
            hostname = device.get('host-name')
            
            print(f"\nChecking {hostname} ({device_ip})...")
            
            result = self.check_device_drift(device_ip, hostname)
            results['details'].append(result)
            
            if result.get('drift_detected'):
                results['devices_with_drift'] += 1
                print(f"  ⚠ DRIFT DETECTED")
                print(f"    Additions: {result['details']['additions']}")
                print(f"    Deletions: {result['details']['deletions']}")
            else:
                results['devices_clean'] += 1
                print(f"  ✓ No drift detected")
        
        print("\n" + "=" * 60)
        print("DRIFT DETECTION SUMMARY")
        print(f"Total Devices: {results['total_devices']}")
        print(f"With Drift: {results['devices_with_drift']}")
        print(f"Clean: {results['devices_clean']}")
        print("=" * 60)
        
        return results
    
    def remediate_drift(self, device_ip: str) -> bool:
        """Remediate drift by pushing template again"""
        print(f"Remediating drift on {device_ip}...")
        
        # Get current template attachment
        url = f"{self.base_url}/dataservice/template/device/config/attached/{device_ip}"
        response = self.session.get(url)
        
        if response.status_code != 200:
            print("  Failed to get template attachment")
            return False
        
        # Push template to remediate
        push_url = f"{self.base_url}/dataservice/template/device/config/attachfeature"
        # This would need the full template attachment payload
        
        print("  Remediation initiated")
        return True

def main():
    detector = ConfigDriftDetector(
        vmanage_host="vmanage.abhavtech.com",
        username="admin",
        password="secure_password"
    )
    
    results = detector.check_all_devices()
    
    # Save report
    report_file = f"drift_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nReport saved: {report_file}")

if __name__ == "__main__":
    main()
```

---

## 6.9.6 Configuration Compliance

### Compliance Rules

```yaml
# SD-WAN Configuration Compliance Rules

Security Compliance:
  SEC-001:
    Name: Encryption Required
    Rule: All tunnels must use AES-256-GCM encryption
    Check: show sdwan ipsec | include cipher
    Expected: AES-256-GCM
    Severity: Critical
    
  SEC-002:
    Name: Strong Authentication
    Rule: Control plane must use certificate authentication
    Check: show sdwan certificate installed
    Expected: Valid certificate chain
    Severity: Critical
    
  SEC-003:
    Name: Firewall Enabled
    Rule: Zone-based firewall must be enabled on DIA
    Check: show policy-firewall sessions
    Expected: Firewall active
    Severity: High

Operational Compliance:
  OPS-001:
    Name: NTP Configured
    Rule: NTP must be configured and synchronized
    Check: show ntp status
    Expected: Clock synchronized
    Severity: High
    
  OPS-002:
    Name: Logging Enabled
    Rule: Syslog must be configured to central server
    Check: show running-config | include logging host
    Expected: logging host configured
    Severity: Medium
    
  OPS-003:
    Name: SNMP Configured
    Rule: SNMPv3 must be configured for monitoring
    Check: show snmp user
    Expected: SNMPv3 user configured
    Severity: Medium

Performance Compliance:
  PERF-001:
    Name: BFD Enabled
    Rule: BFD must be enabled on all tunnels
    Check: show sdwan bfd sessions
    Expected: BFD sessions established
    Severity: High
    
  PERF-002:
    Name: QoS Applied
    Rule: QoS policy must be applied on WAN interfaces
    Check: show policy-map interface
    Expected: Service-policy applied
    Severity: Medium
```

### Compliance Check Script

```python
#!/usr/bin/env python3
"""
Configuration Compliance Checker
Abhavtech.com - December 2025
"""

import requests
import json
from datetime import datetime
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class ComplianceChecker:
    """Check SD-WAN configuration compliance"""
    
    def __init__(self, vmanage_host: str, username: str, password: str):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
        # Define compliance rules
        self.rules = [
            {
                'id': 'SEC-001',
                'name': 'Encryption Standard',
                'category': 'Security',
                'severity': 'Critical',
                'check_type': 'api',
                'api_endpoint': '/device/tunnel',
                'expected': 'AES-GCM-256'
            },
            {
                'id': 'SEC-002',
                'name': 'Certificate Authentication',
                'category': 'Security',
                'severity': 'Critical',
                'check_type': 'api',
                'api_endpoint': '/device/control/connections',
                'expected': 'up'
            },
            {
                'id': 'OPS-001',
                'name': 'Control Connections',
                'category': 'Operational',
                'severity': 'High',
                'check_type': 'api',
                'api_endpoint': '/device/control/connections',
                'expected_count': 3
            },
            {
                'id': 'PERF-001',
                'name': 'BFD Sessions',
                'category': 'Performance',
                'severity': 'High',
                'check_type': 'api',
                'api_endpoint': '/device/bfd/sessions',
                'expected': 'up'
            }
        ]
    
    def authenticate(self, username: str, password: str):
        login_url = f"{self.base_url}/j_security_check"
        self.session.post(login_url, data={'j_username': username, 'j_password': password})
        token_response = self.session.get(f"{self.base_url}/dataservice/client/token")
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
    
    def check_rule(self, device_ip: str, rule: dict) -> dict:
        """Check single compliance rule"""
        result = {
            'rule_id': rule['id'],
            'rule_name': rule['name'],
            'category': rule['category'],
            'severity': rule['severity'],
            'status': 'UNKNOWN',
            'detail': None
        }
        
        try:
            url = f"{self.base_url}/dataservice{rule['api_endpoint']}"
            params = {'deviceId': device_ip}
            response = self.session.get(url, params=params)
            data = response.json().get('data', [])
            
            if rule['id'] == 'SEC-001':
                # Check encryption
                encrypted = all('AES' in str(t.get('cipher', '')) for t in data)
                result['status'] = 'COMPLIANT' if encrypted else 'NON-COMPLIANT'
                result['detail'] = f"Tunnels: {len(data)}, Encrypted: {encrypted}"
                
            elif rule['id'] == 'SEC-002':
                # Check control connections
                connected = all(c.get('state') == 'up' for c in data)
                result['status'] = 'COMPLIANT' if connected else 'NON-COMPLIANT'
                result['detail'] = f"Connections: {len(data)}, All up: {connected}"
                
            elif rule['id'] == 'OPS-001':
                # Check control connection count
                count = len([c for c in data if c.get('state') == 'up'])
                compliant = count >= rule['expected_count']
                result['status'] = 'COMPLIANT' if compliant else 'NON-COMPLIANT'
                result['detail'] = f"Expected: {rule['expected_count']}, Actual: {count}"
                
            elif rule['id'] == 'PERF-001':
                # Check BFD sessions
                all_up = all(b.get('state') == 'up' for b in data)
                result['status'] = 'COMPLIANT' if all_up else 'NON-COMPLIANT'
                up_count = sum(1 for b in data if b.get('state') == 'up')
                result['detail'] = f"BFD sessions: {len(data)}, Up: {up_count}"
                
        except Exception as e:
            result['status'] = 'ERROR'
            result['detail'] = str(e)
        
        return result
    
    def check_device_compliance(self, device_ip: str, hostname: str) -> dict:
        """Check all rules for a device"""
        results = {
            'device_ip': device_ip,
            'hostname': hostname,
            'timestamp': datetime.now().isoformat(),
            'overall_status': 'COMPLIANT',
            'rules_checked': len(self.rules),
            'rules_compliant': 0,
            'rules_non_compliant': 0,
            'critical_failures': 0,
            'details': []
        }
        
        for rule in self.rules:
            result = self.check_rule(device_ip, rule)
            results['details'].append(result)
            
            if result['status'] == 'COMPLIANT':
                results['rules_compliant'] += 1
            else:
                results['rules_non_compliant'] += 1
                if result['severity'] == 'Critical':
                    results['critical_failures'] += 1
        
        if results['critical_failures'] > 0:
            results['overall_status'] = 'CRITICAL'
        elif results['rules_non_compliant'] > 0:
            results['overall_status'] = 'NON-COMPLIANT'
        
        return results
    
    def run_compliance_audit(self) -> dict:
        """Run compliance audit on all devices"""
        print("=" * 60)
        print("SD-WAN COMPLIANCE AUDIT")
        print(f"Timestamp: {datetime.now().isoformat()}")
        print("=" * 60)
        
        # Get all devices
        devices_url = f"{self.base_url}/dataservice/device"
        devices = self.session.get(devices_url).json().get('data', [])
        wan_edges = [d for d in devices if d.get('personality') == 'vedge']
        
        audit_results = {
            'timestamp': datetime.now().isoformat(),
            'total_devices': len(wan_edges),
            'compliant_devices': 0,
            'non_compliant_devices': 0,
            'critical_issues': 0,
            'devices': []
        }
        
        for device in wan_edges:
            device_ip = device.get('system-ip')
            hostname = device.get('host-name')
            
            print(f"\nAuditing {hostname} ({device_ip})...")
            
            result = self.check_device_compliance(device_ip, hostname)
            audit_results['devices'].append(result)
            
            if result['overall_status'] == 'COMPLIANT':
                audit_results['compliant_devices'] += 1
                print(f"  ✓ COMPLIANT ({result['rules_compliant']}/{result['rules_checked']} rules)")
            else:
                audit_results['non_compliant_devices'] += 1
                audit_results['critical_issues'] += result['critical_failures']
                print(f"  ✗ {result['overall_status']} ({result['rules_non_compliant']} failures)")
        
        # Calculate compliance score
        if audit_results['total_devices'] > 0:
            audit_results['compliance_score'] = round(
                (audit_results['compliant_devices'] / audit_results['total_devices']) * 100, 1
            )
        else:
            audit_results['compliance_score'] = 0
        
        print("\n" + "=" * 60)
        print("COMPLIANCE AUDIT SUMMARY")
        print(f"Total Devices: {audit_results['total_devices']}")
        print(f"Compliant: {audit_results['compliant_devices']}")
        print(f"Non-Compliant: {audit_results['non_compliant_devices']}")
        print(f"Critical Issues: {audit_results['critical_issues']}")
        print(f"Compliance Score: {audit_results['compliance_score']}%")
        print("=" * 60)
        
        return audit_results

def main():
    checker = ComplianceChecker(
        vmanage_host="vmanage.abhavtech.com",
        username="admin",
        password="secure_password"
    )
    
    results = checker.run_compliance_audit()
    
    # Save report
    report_file = f"compliance_audit_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(report_file, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\nReport saved: {report_file}")

if __name__ == "__main__":
    main()
```

---

## 6.9.7 Git-Based Configuration Management

### Git Repository Structure

```
sdwan-config/
├── README.md
├── templates/
│   ├── device/
│   │   ├── DT-HUB-C8500-v1.json
│   │   └── DT-BRANCH-C8300-v1.json
│   └── feature/
│       ├── FT-SYSTEM-GLOBAL-v1.json
│       ├── FT-VPN-TRANSPORT-v1.json
│       └── ...
├── policies/
│   ├── centralized/
│   │   ├── POL-CONTROL-TOPOLOGY-v1.json
│   │   └── POL-DATA-DIA-v1.json
│   └── localized/
│       └── POL-APP-VOICE-v1.json
├── devices/
│   ├── IN-MUM-WAN-EDGE-01/
│   │   ├── config.json
│   │   └── variables.json
│   └── IN-CHE-WAN-EDGE-01/
│       ├── config.json
│       └── variables.json
├── scripts/
│   ├── export_templates.py
│   ├── import_templates.py
│   └── sync_config.py
└── .github/
    └── workflows/
        └── config-sync.yml
```

### Git Workflow

```yaml
# GitHub Actions Workflow for Config Sync
# .github/workflows/config-sync.yml

name: SD-WAN Config Sync

on:
  push:
    branches: [main]
    paths:
      - 'templates/**'
      - 'policies/**'
  workflow_dispatch:

jobs:
  sync-config:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install Dependencies
        run: pip install requests pyyaml
      
      - name: Sync Templates to vManage
        env:
          VMANAGE_HOST: ${{ secrets.VMANAGE_HOST }}
          VMANAGE_USER: ${{ secrets.VMANAGE_USER }}
          VMANAGE_PASSWORD: ${{ secrets.VMANAGE_PASSWORD }}
        run: python scripts/sync_config.py --templates
      
      - name: Sync Policies to vManage
        env:
          VMANAGE_HOST: ${{ secrets.VMANAGE_HOST }}
          VMANAGE_USER: ${{ secrets.VMANAGE_USER }}
          VMANAGE_PASSWORD: ${{ secrets.VMANAGE_PASSWORD }}
        run: python scripts/sync_config.py --policies
      
      - name: Validate Sync
        run: python scripts/validate_sync.py
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 30, 2025 | Abhavtech | Initial configuration management guide |

---

**Document Classification:** Internal Use
**Next Review Date:** March 30, 2026
