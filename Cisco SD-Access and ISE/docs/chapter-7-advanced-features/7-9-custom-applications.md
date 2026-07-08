# 7.9 Custom Applications

### 7.9.1 Automation Workflow Examples

**Workflow 1: Automated Guest VLAN Provisioning**

```python
#!/usr/bin/env python3
"""
Automated Guest VLAN Provisioning Workflow
Triggered by: New branch site request
"""

import requests
import json

DNAC_HOST = "https://dnac.corp.local"
ISE_HOST = "https://ise-pan-nj.corp.local:9060"

def provision_guest_network(site_name, vlan_id, ip_pool):
    """
    End-to-end guest network provisioning
    1. Create IP pool in DNAC
    2. Add pool to VN_GUEST
    3. Create guest portal in ISE
    4. Configure authorization policy
    """
    
    # Step 1: Create IP Pool in DNAC
    create_ip_pool(site_name, ip_pool)
    
    # Step 2: Add to VN_GUEST in fabric
    add_pool_to_vn(site_name, "VN_GUEST", ip_pool)
    
    # Step 3: Configure ISE guest portal
    create_guest_portal(site_name)
    
    # Step 4: Update authorization policy
    update_auth_policy(site_name)
    
    return {"status": "success", "site": site_name}

def create_ip_pool(site_name, ip_pool):
    """Create IP pool in DNAC"""
    # Implementation
    pass

def add_pool_to_vn(site_name, vn_name, ip_pool):
    """Add IP pool to Virtual Network"""
    # Implementation
    pass

def create_guest_portal(site_name):
    """Create guest portal in ISE"""
    # Implementation
    pass

def update_auth_policy(site_name):
    """Update ISE authorization policy"""
    # Implementation
    pass
```

**Workflow 2: Automated Endpoint Onboarding**

```python
#!/usr/bin/env python3
"""
Automated IoT Device Onboarding Workflow
Triggered by: New IoT device MAC registration
"""

def onboard_iot_device(mac_address, device_type, location):
    """
    IoT device onboarding workflow
    1. Add to ISE endpoint database
    2. Assign profile based on device type
    3. Assign to appropriate SGT
    4. Update authorization policy
    5. Notify operations team
    """
    
    # Determine profile and SGT based on device type
    profile_mapping = {
        "sensor": {"profile": "IoT-Building-Sensor", "sgt": "SGT-IOT-SENSORS"},
        "camera": {"profile": "IP-Camera", "sgt": "SGT-CAMERAS"},
        "hvac": {"profile": "HVAC-Controller", "sgt": "SGT-OT-DEVICES"},
        "printer": {"profile": "Printer", "sgt": "SGT-PRINTERS"}
    }
    
    config = profile_mapping.get(device_type, {"profile": "Unknown", "sgt": "SGT-QUARANTINE"})
    
    # Add endpoint to ISE
    add_endpoint_to_ise(mac_address, config["profile"])
    
    # Assign SGT
    assign_sgt(mac_address, config["sgt"])
    
    # Notify operations
    send_notification(mac_address, device_type, location, config["sgt"])
    
    return {"status": "onboarded", "mac": mac_address, "sgt": config["sgt"]}
```

### 7.9.2 Custom Dashboard Development

```python
#!/usr/bin/env python3
"""
Custom Executive Dashboard - Flask Application
"""

from flask import Flask, render_template, jsonify
import requests
from datetime import datetime

app = Flask(__name__)

DNAC_HOST = "https://dnac.corp.local"
ISE_HOST = "https://ise-pan-nj.corp.local:9060"

@app.route('/api/dashboard/summary')
def get_dashboard_summary():
    """Get executive dashboard summary"""
    
    summary = {
        "timestamp": datetime.now().isoformat(),
        "network_health": get_network_health(),
        "client_health": get_client_health(),
        "authentication": get_auth_summary(),
        "issues": get_active_issues(),
        "sites": get_site_status()
    }
    
    return jsonify(summary)

@app.route('/api/dashboard/sites/<site_name>')
def get_site_details(site_name):
    """Get detailed site information"""
    
    details = {
        "site": site_name,
        "devices": get_site_devices(site_name),
        "clients": get_site_clients(site_name),
        "health_score": get_site_health(site_name),
        "issues": get_site_issues(site_name)
    }
    
    return jsonify(details)

@app.route('/api/dashboard/compliance')
def get_compliance_status():
    """Get compliance dashboard"""
    
    compliance = {
        "posture_compliant": get_posture_compliance(),
        "software_compliant": get_software_compliance(),
        "policy_compliant": get_policy_compliance(),
        "certificate_status": get_certificate_status()
    }
    
    return jsonify(compliance)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

---
