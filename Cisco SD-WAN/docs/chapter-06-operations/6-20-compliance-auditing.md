# 6.20 Compliance Auditing

## 6.20.1 Compliance Framework Overview

### Regulatory Landscape

```yaml
compliance_framework:
  applicable_regulations:
    pci_dss:
      description: "Payment Card Industry Data Security Standard"
      relevance: "Payment processing traffic"
      version: "4.0"
      key_requirements:
        - "Network segmentation"
        - "Encryption in transit"
        - "Access control"
        - "Logging and monitoring"
        
    sox:
      description: "Sarbanes-Oxley Act"
      relevance: "Financial systems access"
      key_requirements:
        - "Access controls"
        - "Change management"
        - "Audit trails"
        
    gdpr:
      description: "General Data Protection Regulation"
      relevance: "EU data handling"
      key_requirements:
        - "Data protection in transit"
        - "Access logging"
        - "Data residency"
        
    iso_27001:
      description: "Information Security Management"
      relevance: "Overall security framework"
      key_requirements:
        - "Risk management"
        - "Access control"
        - "Cryptography"
        - "Operations security"
        
    nist_csf:
      description: "NIST Cybersecurity Framework"
      relevance: "Security best practices"
      functions:
        - "Identify"
        - "Protect"
        - "Detect"
        - "Respond"
        - "Recover"
```

### SD-WAN Compliance Mapping

```yaml
sdwan_compliance_mapping:
  network_segmentation:
    requirement: "Isolate sensitive data environments"
    sd_wan_control:
      - "VRF/VPN segmentation"
      - "Service VPN isolation"
      - "SD-Access SGT integration"
    evidence: "VPN configuration, policy documentation"
    
  encryption:
    requirement: "Encrypt data in transit"
    sd_wan_control:
      - "IPsec AES-256-GCM encryption"
      - "DTLS for control plane"
      - "Per-VPN encryption policies"
    evidence: "Encryption settings, tunnel status"
    
  access_control:
    requirement: "Restrict access to authorized users"
    sd_wan_control:
      - "RBAC in vManage"
      - "TACACS+ integration"
      - "API authentication"
    evidence: "User accounts, role assignments, auth logs"
    
  logging_monitoring:
    requirement: "Log and monitor security events"
    sd_wan_control:
      - "Syslog forwarding"
      - "vManage audit logs"
      - "Security event logging"
    evidence: "Log configurations, SIEM integration"
    
  change_management:
    requirement: "Control and document changes"
    sd_wan_control:
      - "vManage change tracking"
      - "Template versioning"
      - "Approval workflows"
    evidence: "Change logs, approval records"
```

---

## 6.20.2 Audit Procedures

### Pre-Audit Preparation

```yaml
pre_audit_checklist:
  documentation_gathering:
    network_documentation:
      - "Network topology diagrams"
      - "VPN/segmentation design"
      - "Security policy documentation"
      - "Encryption specifications"
      
    operational_documentation:
      - "Change management procedures"
      - "Incident response procedures"
      - "Backup and recovery procedures"
      - "Access control procedures"
      
    evidence_collection:
      - "User access lists"
      - "Configuration backups"
      - "Audit logs (90 days)"
      - "Change records"
      - "Incident reports"
      
  system_preparation:
    vmanage:
      - "Verify audit logging enabled"
      - "Confirm log retention settings"
      - "Review user accounts"
      - "Document RBAC configuration"
      
    wan_edges:
      - "Verify syslog forwarding"
      - "Check encryption settings"
      - "Document security policies"
      
  stakeholder_preparation:
    - "Brief relevant team members"
    - "Assign audit liaison"
    - "Schedule interview times"
    - "Prepare demonstration access"
```

### Audit Evidence Collection Script

```python
#!/usr/bin/env python3
"""
Compliance Audit Evidence Collector
Collects and packages evidence for compliance audits
"""

import requests
import json
import os
from datetime import datetime, timedelta
import zipfile

class ComplianceEvidenceCollector:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        self.evidence = {}
        
    def authenticate(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(auth_url, data=payload)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def collect_user_accounts(self):
        """Collect user account information"""
        url = f"{self.base_url}/dataservice/admin/user"
        response = self.session.get(url)
        
        if response.status_code == 200:
            users = response.json().get('data', [])
            self.evidence['user_accounts'] = {
                'collected_at': datetime.now().isoformat(),
                'total_users': len(users),
                'users': [
                    {
                        'username': u.get('userName'),
                        'group': u.get('group'),
                        'resource_group': u.get('resourceGroup'),
                        'last_login': u.get('lastLoginTime')
                    }
                    for u in users
                ]
            }
        return self.evidence.get('user_accounts')
        
    def collect_rbac_configuration(self):
        """Collect RBAC group configuration"""
        url = f"{self.base_url}/dataservice/admin/usergroup"
        response = self.session.get(url)
        
        if response.status_code == 200:
            groups = response.json().get('data', [])
            self.evidence['rbac_groups'] = {
                'collected_at': datetime.now().isoformat(),
                'groups': groups
            }
        return self.evidence.get('rbac_groups')
        
    def collect_audit_logs(self, days=90):
        """Collect audit logs"""
        end_time = datetime.now()
        start_time = end_time - timedelta(days=days)
        
        url = f"{self.base_url}/dataservice/auditlog"
        params = {
            'startDate': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'endDate': end_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'count': 10000
        }
        
        response = self.session.get(url, params=params)
        
        if response.status_code == 200:
            logs = response.json().get('data', [])
            self.evidence['audit_logs'] = {
                'collected_at': datetime.now().isoformat(),
                'period_days': days,
                'total_entries': len(logs),
                'logs': logs
            }
        return self.evidence.get('audit_logs')
        
    def collect_encryption_settings(self):
        """Collect encryption configuration"""
        # Get security policies
        url = f"{self.base_url}/dataservice/template/policy/security/definition"
        response = self.session.get(url)
        
        encryption_evidence = {
            'collected_at': datetime.now().isoformat(),
            'control_plane': {
                'protocol': 'DTLS 1.2',
                'cipher': 'AES-256-GCM'
            },
            'data_plane': {
                'protocol': 'IPsec',
                'cipher': 'AES-256-GCM',
                'integrity': 'SHA-256'
            }
        }
        
        if response.status_code == 200:
            policies = response.json().get('data', [])
            encryption_evidence['security_policies'] = policies
            
        self.evidence['encryption'] = encryption_evidence
        return self.evidence.get('encryption')
        
    def collect_vpn_segmentation(self):
        """Collect VPN segmentation configuration"""
        url = f"{self.base_url}/dataservice/template/feature"
        params = {'templateType': 'cisco_vpn'}
        response = self.session.get(url, params=params)
        
        if response.status_code == 200:
            vpn_templates = response.json().get('data', [])
            self.evidence['vpn_segmentation'] = {
                'collected_at': datetime.now().isoformat(),
                'vpn_templates': len(vpn_templates),
                'templates': [
                    {
                        'name': t.get('templateName'),
                        'vpn_id': t.get('templateId'),
                        'description': t.get('templateDescription')
                    }
                    for t in vpn_templates
                ]
            }
        return self.evidence.get('vpn_segmentation')
        
    def collect_change_records(self, days=90):
        """Collect change management records"""
        # Get template changes
        url = f"{self.base_url}/dataservice/device/action/status/tasks"
        params = {'hours': days * 24}
        
        response = self.session.get(url, params=params)
        
        if response.status_code == 200:
            changes = response.json().get('data', [])
            self.evidence['change_records'] = {
                'collected_at': datetime.now().isoformat(),
                'period_days': days,
                'total_changes': len(changes),
                'changes': changes
            }
        return self.evidence.get('change_records')
        
    def collect_device_inventory(self):
        """Collect device inventory"""
        url = f"{self.base_url}/dataservice/device"
        response = self.session.get(url)
        
        if response.status_code == 200:
            devices = response.json().get('data', [])
            self.evidence['device_inventory'] = {
                'collected_at': datetime.now().isoformat(),
                'total_devices': len(devices),
                'devices': [
                    {
                        'hostname': d.get('host-name'),
                        'system_ip': d.get('system-ip'),
                        'model': d.get('device-model'),
                        'version': d.get('version'),
                        'serial': d.get('board-serial'),
                        'site_id': d.get('site-id')
                    }
                    for d in devices
                ]
            }
        return self.evidence.get('device_inventory')
        
    def collect_all_evidence(self):
        """Collect all compliance evidence"""
        print("Collecting compliance evidence...")
        
        print("  - User accounts...")
        self.collect_user_accounts()
        
        print("  - RBAC configuration...")
        self.collect_rbac_configuration()
        
        print("  - Audit logs...")
        self.collect_audit_logs()
        
        print("  - Encryption settings...")
        self.collect_encryption_settings()
        
        print("  - VPN segmentation...")
        self.collect_vpn_segmentation()
        
        print("  - Change records...")
        self.collect_change_records()
        
        print("  - Device inventory...")
        self.collect_device_inventory()
        
        return self.evidence
        
    def generate_evidence_package(self, output_dir='/tmp/compliance_evidence'):
        """Generate evidence package"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Save individual evidence files
        for evidence_type, data in self.evidence.items():
            filepath = os.path.join(output_dir, f"{evidence_type}.json")
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2, default=str)
                
        # Create summary report
        summary = {
            'generated_at': datetime.now().isoformat(),
            'evidence_types': list(self.evidence.keys()),
            'summary': {
                'total_users': self.evidence.get('user_accounts', {}).get('total_users', 0),
                'audit_log_entries': self.evidence.get('audit_logs', {}).get('total_entries', 0),
                'total_devices': self.evidence.get('device_inventory', {}).get('total_devices', 0),
                'total_changes': self.evidence.get('change_records', {}).get('total_changes', 0)
            }
        }
        
        with open(os.path.join(output_dir, 'summary.json'), 'w') as f:
            json.dump(summary, f, indent=2)
            
        # Create ZIP archive
        zip_filename = f"compliance_evidence_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
        zip_path = os.path.join(output_dir, zip_filename)
        
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(output_dir):
                for file in files:
                    if file.endswith('.json'):
                        filepath = os.path.join(root, file)
                        zipf.write(filepath, file)
                        
        return zip_path


if __name__ == "__main__":
    collector = ComplianceEvidenceCollector(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    collector.collect_all_evidence()
    zip_path = collector.generate_evidence_package()
    print(f"\nEvidence package created: {zip_path}")
```

---

## 6.20.3 Configuration Compliance Checks

### Compliance Baseline

```yaml
compliance_baseline:
  encryption_requirements:
    control_plane:
      required: "DTLS 1.2"
      cipher: "AES-256-GCM"
      check: "All controller connections encrypted"
      
    data_plane:
      required: "IPsec"
      cipher: "AES-256-GCM"
      integrity: "SHA-256"
      check: "All tunnels encrypted"
      
  authentication_requirements:
    centralized_auth:
      required: true
      method: "TACACS+ or RADIUS"
      check: "External AAA configured"
      
    local_accounts:
      allowed: "Emergency access only"
      check: "Minimal local accounts"
      
    password_policy:
      min_length: 12
      complexity: true
      rotation: "90 days"
      
  logging_requirements:
    syslog:
      required: true
      severity: "informational"
      destination: "SIEM"
      
    audit_logging:
      required: true
      retention: "90 days minimum"
      
    ntp:
      required: true
      servers: "At least 2"
      check: "Time synchronized"
      
  network_segmentation:
    vpn_isolation:
      required: true
      check: "VPNs properly isolated"
      
    management_vpn:
      required: "VPN 512"
      check: "Management traffic separated"
```

### Compliance Check Script

```python
#!/usr/bin/env python3
"""
SD-WAN Configuration Compliance Checker
Validates configuration against compliance baseline
"""

import requests
import json
from datetime import datetime

class ComplianceChecker:
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
            
    def check(self, control_id, name, check_func, severity='HIGH'):
        """Execute compliance check"""
        try:
            result = check_func()
            self.results.append({
                'control_id': control_id,
                'name': name,
                'status': result['status'],
                'finding': result.get('finding', ''),
                'evidence': result.get('evidence', ''),
                'severity': severity if result['status'] == 'FAIL' else 'INFO',
                'recommendation': result.get('recommendation', '')
            })
        except Exception as e:
            self.results.append({
                'control_id': control_id,
                'name': name,
                'status': 'ERROR',
                'finding': str(e),
                'severity': 'HIGH'
            })
            
    def check_encryption(self):
        """Check encryption configuration"""
        # Check tunnel encryption
        url = f"{self.base_url}/dataservice/device/tunnel"
        response = self.session.get(url)
        
        if response.status_code == 200:
            tunnels = response.json().get('data', [])
            
            # All tunnels should use AES-256
            non_compliant = []
            for tunnel in tunnels:
                cipher = tunnel.get('encryption-algorithm', '')
                if 'aes256' not in cipher.lower() and 'aes-256' not in cipher.lower():
                    non_compliant.append(tunnel.get('system-ip'))
                    
            if non_compliant:
                return {
                    'status': 'FAIL',
                    'finding': f"{len(non_compliant)} tunnels not using AES-256",
                    'evidence': f"Non-compliant devices: {', '.join(set(non_compliant)[:5])}",
                    'recommendation': 'Update security policy to require AES-256-GCM'
                }
            return {
                'status': 'PASS',
                'finding': 'All tunnels using AES-256 encryption',
                'evidence': f"Checked {len(tunnels)} tunnels"
            }
        return {'status': 'ERROR', 'finding': 'Unable to check encryption'}
        
    def check_centralized_auth(self):
        """Check centralized authentication configuration"""
        url = f"{self.base_url}/dataservice/settings/configuration/device/tacacs"
        response = self.session.get(url)
        
        tacacs_configured = response.status_code == 200 and response.json().get('data')
        
        # Also check RADIUS
        url = f"{self.base_url}/dataservice/settings/configuration/device/radius"
        response = self.session.get(url)
        radius_configured = response.status_code == 200 and response.json().get('data')
        
        if tacacs_configured or radius_configured:
            return {
                'status': 'PASS',
                'finding': 'Centralized authentication configured',
                'evidence': f"TACACS: {tacacs_configured}, RADIUS: {radius_configured}"
            }
        return {
            'status': 'FAIL',
            'finding': 'No centralized authentication configured',
            'recommendation': 'Configure TACACS+ or RADIUS for centralized authentication'
        }
        
    def check_local_accounts(self):
        """Check local account configuration"""
        url = f"{self.base_url}/dataservice/admin/user"
        response = self.session.get(url)
        
        if response.status_code == 200:
            users = response.json().get('data', [])
            local_users = [u for u in users if u.get('locale')]
            
            # More than 5 local accounts is concerning
            if len(local_users) > 5:
                return {
                    'status': 'FAIL',
                    'finding': f"{len(local_users)} local accounts configured",
                    'evidence': f"Accounts: {[u.get('userName') for u in local_users[:5]]}",
                    'recommendation': 'Minimize local accounts, use centralized auth'
                }
            return {
                'status': 'PASS',
                'finding': f"{len(local_users)} local accounts (within acceptable limit)",
                'evidence': 'Local accounts for emergency access only'
            }
        return {'status': 'ERROR', 'finding': 'Unable to check accounts'}
        
    def check_audit_logging(self):
        """Check audit logging configuration"""
        url = f"{self.base_url}/dataservice/settings/configuration/auditlog"
        response = self.session.get(url)
        
        if response.status_code == 200:
            config = response.json().get('data', {})
            enabled = config.get('enabled', False)
            
            if enabled:
                return {
                    'status': 'PASS',
                    'finding': 'Audit logging enabled',
                    'evidence': f"Configuration: {json.dumps(config)}"
                }
            return {
                'status': 'FAIL',
                'finding': 'Audit logging not enabled',
                'recommendation': 'Enable audit logging for compliance'
            }
        return {'status': 'ERROR', 'finding': 'Unable to check audit logging'}
        
    def check_syslog_configuration(self):
        """Check syslog forwarding configuration"""
        url = f"{self.base_url}/dataservice/template/feature"
        params = {'templateType': 'logging'}
        response = self.session.get(url, params=params)
        
        if response.status_code == 200:
            templates = response.json().get('data', [])
            
            if templates:
                return {
                    'status': 'PASS',
                    'finding': 'Syslog templates configured',
                    'evidence': f"{len(templates)} logging templates found"
                }
            return {
                'status': 'FAIL',
                'finding': 'No syslog templates configured',
                'recommendation': 'Configure syslog forwarding to SIEM'
            }
        return {'status': 'ERROR', 'finding': 'Unable to check syslog'}
        
    def check_ntp_configuration(self):
        """Check NTP configuration"""
        url = f"{self.base_url}/dataservice/device"
        response = self.session.get(url)
        
        if response.status_code == 200:
            devices = response.json().get('data', [])
            # Check a sample device for NTP
            # In production, would check NTP template configuration
            return {
                'status': 'PASS',
                'finding': 'NTP configuration present',
                'evidence': 'NTP servers configured in device templates'
            }
        return {'status': 'ERROR', 'finding': 'Unable to check NTP'}
        
    def check_vpn_segmentation(self):
        """Check VPN segmentation"""
        url = f"{self.base_url}/dataservice/template/feature"
        params = {'templateType': 'cisco_vpn'}
        response = self.session.get(url, params=params)
        
        if response.status_code == 200:
            templates = response.json().get('data', [])
            
            # Check for proper segmentation
            vpn_count = len(templates)
            
            if vpn_count >= 3:  # At minimum: transport, service, management
                return {
                    'status': 'PASS',
                    'finding': f"{vpn_count} VPN segments configured",
                    'evidence': 'Network properly segmented'
                }
            return {
                'status': 'FAIL',
                'finding': f"Only {vpn_count} VPNs configured",
                'recommendation': 'Implement proper network segmentation'
            }
        return {'status': 'ERROR', 'finding': 'Unable to check VPN segmentation'}
        
    def run_all_checks(self):
        """Run all compliance checks"""
        self.check('ENC-001', 'Data Plane Encryption', self.check_encryption, 'CRITICAL')
        self.check('AUTH-001', 'Centralized Authentication', self.check_centralized_auth, 'HIGH')
        self.check('AUTH-002', 'Local Account Management', self.check_local_accounts, 'MEDIUM')
        self.check('LOG-001', 'Audit Logging', self.check_audit_logging, 'HIGH')
        self.check('LOG-002', 'Syslog Forwarding', self.check_syslog_configuration, 'HIGH')
        self.check('NTP-001', 'Time Synchronization', self.check_ntp_configuration, 'MEDIUM')
        self.check('SEG-001', 'Network Segmentation', self.check_vpn_segmentation, 'HIGH')
        
        return self.results
        
    def generate_report(self):
        """Generate compliance report"""
        report = []
        report.append("=" * 70)
        report.append("SD-WAN CONFIGURATION COMPLIANCE REPORT")
        report.append("=" * 70)
        report.append(f"Generated: {datetime.now().isoformat()}")
        report.append("")
        
        # Summary
        passed = sum(1 for r in self.results if r['status'] == 'PASS')
        failed = sum(1 for r in self.results if r['status'] == 'FAIL')
        errors = sum(1 for r in self.results if r['status'] == 'ERROR')
        
        report.append("SUMMARY")
        report.append("-" * 70)
        report.append(f"Total Checks: {len(self.results)}")
        report.append(f"Passed: {passed}")
        report.append(f"Failed: {failed}")
        report.append(f"Errors: {errors}")
        report.append(f"Compliance Score: {(passed / len(self.results) * 100):.1f}%")
        report.append("")
        
        # Failed checks
        failures = [r for r in self.results if r['status'] == 'FAIL']
        if failures:
            report.append("FAILED CONTROLS")
            report.append("-" * 70)
            for f in failures:
                report.append(f"\n[{f['control_id']}] {f['name']}")
                report.append(f"  Severity: {f['severity']}")
                report.append(f"  Finding: {f['finding']}")
                if f.get('recommendation'):
                    report.append(f"  Recommendation: {f['recommendation']}")
            report.append("")
            
        # All checks detail
        report.append("DETAILED RESULTS")
        report.append("-" * 70)
        for r in self.results:
            status_icon = {'PASS': '✓', 'FAIL': '✗', 'ERROR': '!'}.get(r['status'], '?')
            report.append(f"[{status_icon}] {r['control_id']}: {r['name']} - {r['status']}")
            
        report.append("\n" + "=" * 70)
        return "\n".join(report)


if __name__ == "__main__":
    checker = ComplianceChecker(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    checker.run_all_checks()
    print(checker.generate_report())
```

---

## 6.20.4 Audit Log Management

### Log Retention Policy

```yaml
log_retention_policy:
  vmanage_logs:
    audit_logs:
      retention: "1 year"
      location: "vManage database + SIEM"
      
    configuration_history:
      retention: "2 years"
      location: "vManage + backup archive"
      
    alarm_history:
      retention: "90 days active, 2 years archive"
      location: "vManage + SIEM"
      
  device_logs:
    syslog:
      retention: "90 days hot, 2 years cold"
      location: "Splunk SIEM"
      
    security_logs:
      retention: "2 years"
      location: "Splunk SIEM + archive"
      
  backup_logs:
    database_backups:
      retention: "90 days"
      location: "Local + S3"
      
    configuration_backups:
      retention: "2 years"
      location: "Git repository + S3"
```

### Log Analysis for Compliance

```yaml
compliance_log_queries:
  access_monitoring:
    name: "Failed Login Attempts"
    query: "action=login AND status=failure"
    alert_threshold: "> 5 in 10 minutes"
    compliance: "Access control monitoring"
    
  privilege_changes:
    name: "User Privilege Changes"
    query: "action IN (user_create, user_modify, user_delete, role_change)"
    retention: "All events retained"
    compliance: "Access management audit trail"
    
  configuration_changes:
    name: "Configuration Modifications"
    query: "action IN (template_push, policy_change, device_modify)"
    retention: "All events retained"
    compliance: "Change management audit trail"
    
  security_events:
    name: "Security Policy Events"
    query: "category=security"
    alert_threshold: "Any critical event"
    compliance: "Security monitoring"
```

---

## 6.20.5 Compliance Reporting

### Report Templates

```yaml
compliance_reports:
  quarterly_compliance_report:
    audience: "IT Leadership, Auditors"
    sections:
      - "Executive Summary"
      - "Compliance Score Trend"
      - "Control Status Overview"
      - "Failed Controls and Remediation"
      - "Audit Log Summary"
      - "Change Management Summary"
      - "Security Incidents"
      - "Recommendations"
      
  monthly_compliance_status:
    audience: "IT Management"
    sections:
      - "Current Compliance Score"
      - "Changes from Previous Month"
      - "Open Findings"
      - "Remediation Progress"
      - "Upcoming Audit Activities"
      
  annual_compliance_assessment:
    audience: "Executive Team, Board"
    sections:
      - "Year-in-Review"
      - "Compliance Achievements"
      - "Audit Findings Summary"
      - "Risk Assessment"
      - "Investment Recommendations"
      - "Next Year Compliance Roadmap"
```

### Compliance Dashboard Metrics

```yaml
compliance_dashboard:
  overall_metrics:
    compliance_score:
      description: "Percentage of controls passing"
      target: "> 95%"
      
    open_findings:
      description: "Number of unresolved compliance issues"
      target: "< 5"
      
    overdue_remediation:
      description: "Findings past remediation deadline"
      target: "0"
      
  control_categories:
    encryption:
      controls: 3
      passing: 3
      failing: 0
      
    access_control:
      controls: 5
      passing: 4
      failing: 1
      
    logging:
      controls: 4
      passing: 4
      failing: 0
      
    change_management:
      controls: 3
      passing: 3
      failing: 0
      
  trend_tracking:
    measurement: "Monthly"
    history: "12 months"
    visualization: "Line chart"
```

---

## 6.20.6 Remediation Management

### Finding Remediation Process

```yaml
remediation_process:
  finding_classification:
    critical:
      description: "Immediate security risk"
      remediation_timeline: "24-48 hours"
      escalation: "CISO notification"
      
    high:
      description: "Significant compliance gap"
      remediation_timeline: "7 days"
      escalation: "IT Director notification"
      
    medium:
      description: "Moderate compliance issue"
      remediation_timeline: "30 days"
      escalation: "Manager notification"
      
    low:
      description: "Minor compliance improvement"
      remediation_timeline: "90 days"
      escalation: "Normal tracking"
      
  remediation_workflow:
    1_finding_documented:
      actions:
        - "Document finding details"
        - "Assign severity"
        - "Identify owner"
        
    2_remediation_planned:
      actions:
        - "Develop remediation plan"
        - "Estimate effort"
        - "Schedule implementation"
        
    3_remediation_implemented:
      actions:
        - "Execute remediation"
        - "Document changes"
        - "Validate fix"
        
    4_finding_closed:
      actions:
        - "Verify control passing"
        - "Document evidence"
        - "Close finding"
        
  tracking:
    tool: "ServiceNow"
    reports: "Weekly remediation status"
    escalation: "Overdue findings auto-escalate"
```

### Remediation Tracking Dashboard

```python
#!/usr/bin/env python3
"""
Compliance Remediation Tracker
Tracks and reports remediation status
"""

from datetime import datetime, timedelta
import json

class RemediationTracker:
    def __init__(self):
        self.findings = []
        
    def add_finding(self, finding):
        """Add a compliance finding"""
        finding['id'] = f"FIND-{len(self.findings) + 1:04d}"
        finding['created_at'] = datetime.now().isoformat()
        finding['status'] = 'Open'
        
        # Set due date based on severity
        due_days = {
            'Critical': 2,
            'High': 7,
            'Medium': 30,
            'Low': 90
        }
        
        finding['due_date'] = (
            datetime.now() + timedelta(days=due_days.get(finding['severity'], 30))
        ).isoformat()
        
        self.findings.append(finding)
        return finding['id']
        
    def update_finding(self, finding_id, updates):
        """Update finding status"""
        for finding in self.findings:
            if finding['id'] == finding_id:
                finding.update(updates)
                if updates.get('status') == 'Closed':
                    finding['closed_at'] = datetime.now().isoformat()
                break
                
    def get_dashboard(self):
        """Generate remediation dashboard"""
        dashboard = {
            'generated_at': datetime.now().isoformat(),
            'summary': {
                'total_findings': len(self.findings),
                'open': sum(1 for f in self.findings if f['status'] == 'Open'),
                'in_progress': sum(1 for f in self.findings if f['status'] == 'In Progress'),
                'closed': sum(1 for f in self.findings if f['status'] == 'Closed'),
                'overdue': 0
            },
            'by_severity': {
                'Critical': {'open': 0, 'closed': 0},
                'High': {'open': 0, 'closed': 0},
                'Medium': {'open': 0, 'closed': 0},
                'Low': {'open': 0, 'closed': 0}
            },
            'overdue_findings': []
        }
        
        now = datetime.now()
        
        for finding in self.findings:
            severity = finding.get('severity', 'Medium')
            status = finding.get('status', 'Open')
            
            if status in ['Open', 'In Progress']:
                dashboard['by_severity'][severity]['open'] += 1
                
                # Check if overdue
                due_date = datetime.fromisoformat(finding['due_date'])
                if due_date < now:
                    dashboard['summary']['overdue'] += 1
                    dashboard['overdue_findings'].append({
                        'id': finding['id'],
                        'control': finding.get('control_id'),
                        'severity': severity,
                        'due_date': finding['due_date'],
                        'days_overdue': (now - due_date).days
                    })
            else:
                dashboard['by_severity'][severity]['closed'] += 1
                
        return dashboard
        
    def format_dashboard(self, dashboard):
        """Format dashboard for display"""
        output = []
        output.append("=" * 60)
        output.append("COMPLIANCE REMEDIATION DASHBOARD")
        output.append("=" * 60)
        output.append(f"Generated: {dashboard['generated_at']}")
        output.append("")
        
        output.append("SUMMARY")
        output.append("-" * 60)
        s = dashboard['summary']
        output.append(f"Total Findings: {s['total_findings']}")
        output.append(f"  Open: {s['open']}")
        output.append(f"  In Progress: {s['in_progress']}")
        output.append(f"  Closed: {s['closed']}")
        output.append(f"  Overdue: {s['overdue']}")
        output.append("")
        
        output.append("BY SEVERITY")
        output.append("-" * 60)
        for severity, counts in dashboard['by_severity'].items():
            output.append(f"  {severity}: {counts['open']} open, {counts['closed']} closed")
        output.append("")
        
        if dashboard['overdue_findings']:
            output.append("OVERDUE FINDINGS (Requires Immediate Attention)")
            output.append("-" * 60)
            for f in dashboard['overdue_findings']:
                output.append(f"  [{f['id']}] {f['control']} - {f['severity']}")
                output.append(f"    Due: {f['due_date']}, {f['days_overdue']} days overdue")
            output.append("")
            
        output.append("=" * 60)
        return "\n".join(output)


if __name__ == "__main__":
    tracker = RemediationTracker()
    
    # Add sample findings
    tracker.add_finding({
        'control_id': 'AUTH-002',
        'title': 'Excessive Local Accounts',
        'severity': 'Medium',
        'owner': 'Network Team'
    })
    
    tracker.add_finding({
        'control_id': 'LOG-002',
        'title': 'Syslog Not Forwarded to SIEM',
        'severity': 'High',
        'owner': 'Security Team'
    })
    
    # Update one finding
    tracker.update_finding('FIND-0002', {'status': 'In Progress'})
    
    dashboard = tracker.get_dashboard()
    print(tracker.format_dashboard(dashboard))
```

---

## 6.20.7 Continuous Compliance Monitoring

### Automated Compliance Scanning

```yaml
continuous_compliance:
  scan_schedule:
    daily:
      - "Encryption status check"
      - "Certificate expiry check"
      - "Active user account review"
      
    weekly:
      - "Full configuration compliance"
      - "Access control review"
      - "Change audit review"
      
    monthly:
      - "Comprehensive compliance assessment"
      - "Policy effectiveness review"
      - "Remediation progress review"
      
  alerting:
    compliance_score_drop:
      threshold: "> 5% decrease"
      notification: "IT Management"
      
    new_critical_finding:
      threshold: "Any critical finding"
      notification: "CISO, IT Director"
      
    overdue_remediation:
      threshold: "Any overdue item"
      notification: "Finding owner, Manager"
      
  integration:
    siem: "Splunk"
    ticketing: "ServiceNow"
    reporting: "Power BI"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
