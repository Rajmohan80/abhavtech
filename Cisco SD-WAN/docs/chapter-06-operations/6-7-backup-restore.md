# 6.7 Backup & Restore Procedures

## Document Information
- **Version:** 1.0
- **Last Updated:** December 30, 2025
- **Author:** Abhavtech Network Engineering
- **Status:** Production Ready
- **Classification:** Internal Use

---

## 6.7.1 Backup Strategy Overview

### Backup Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SD-WAN BACKUP ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                          vManage Cluster                             │  │
│   │  ┌───────────┐  ┌───────────┐  ┌───────────┐                       │  │
│   │  │ vManage-1 │  │ vManage-2 │  │ vManage-3 │  ← Database backup    │  │
│   │  └───────────┘  └───────────┘  └───────────┘  ← Config backup      │  │
│   │                       │                                              │  │
│   └───────────────────────│──────────────────────────────────────────────┘  │
│                           │                                                  │
│                           ▼                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                      Backup Repository                               │  │
│   │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐           │  │
│   │  │ Mumbai NFS    │  │ Chennai NFS   │  │ AWS S3        │           │  │
│   │  │ (Primary)     │  │ (Secondary)   │  │ (Offsite)     │           │  │
│   │  └───────────────┘  └───────────────┘  └───────────────┘           │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│   Backup Types:                                                             │
│   ├── Database backup (Neo4j, MongoDB, Elasticsearch)                      │
│   ├── Configuration backup (templates, policies)                            │
│   ├── Certificate backup (root CA, device certs)                           │
│   └── WAN Edge configuration backup                                         │
│                                                                             │
│   Schedule:                                                                 │
│   ├── Full backup: Daily 02:00 IST                                        │
│   ├── Incremental: Every 6 hours                                           │
│   └── Retention: 30 days local, 90 days offsite                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Backup Components

| Component | Backup Type | Frequency | Retention | Location |
|-----------|------------|-----------|-----------|----------|
| **vManage Database** | Full + Incremental | Daily/6-hourly | 30/90 days | NFS + S3 |
| **Configuration DB** | Full | Daily | 30 days | NFS + S3 |
| **Templates** | Export | Weekly | 90 days | Git + NFS |
| **Policies** | Export | Weekly | 90 days | Git + NFS |
| **Certificates** | Manual | Monthly | Indefinite | Encrypted vault |
| **WAN Edge Config** | Full | Daily | 30 days | vManage + NFS |

---

## 6.7.2 vManage Backup Procedures

### Full Database Backup

```bash
# === VMANAGE DATABASE BACKUP ===

# Option 1: Via vManage UI
# Administration > Settings > Configuration Database > Backup

# Option 2: Via API
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/system/device/config/backup" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d '{
    "scheduleOptions": {
      "immediate": true
    }
  }'

# Check backup status
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/system/device/config/backup/status" \
  -H "Cookie: JSESSIONID=${SESSION}"

# Download backup file
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/system/device/config/backup/download" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o vmanage_backup_$(date +%Y%m%d).tar.gz
```

### Scheduled Backup Configuration

```bash
# === CONFIGURE SCHEDULED BACKUPS ===

# Via vManage API - Configure daily backup at 02:00 IST
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/system/device/config/backup/schedule" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d '{
    "scheduleOptions": {
      "frequency": "daily",
      "time": "02:00",
      "timezone": "Asia/Kolkata"
    },
    "exportOptions": {
      "exportToRemote": true,
      "remoteServerType": "nfs",
      "remoteServerIP": "10.100.1.200",
      "remotePath": "/backups/sdwan/vmanage"
    }
  }'
```

### Configuration Export

```bash
# === EXPORT CONFIGURATION DATABASE ===

# Export all device configurations
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/system/device/config/export" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o config_export_$(date +%Y%m%d).json

# Export specific device configuration
DEVICE_IP="10.100.1.1"
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/system/device/${DEVICE_IP}/config" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o device_config_${DEVICE_IP}_$(date +%Y%m%d).json
```

### Template Backup

```bash
# === BACKUP DEVICE TEMPLATES ===

# List all device templates
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/template/device" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o templates_list.json

# Export specific device template
TEMPLATE_ID="template-uuid-here"
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/template/device/object/${TEMPLATE_ID}" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o device_template_${TEMPLATE_ID}.json

# === BACKUP FEATURE TEMPLATES ===

# List all feature templates
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/template/feature" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o feature_templates_list.json

# Export all feature templates
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/template/feature/bulk" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o all_feature_templates.json
```

### Policy Backup

```bash
# === BACKUP ALL POLICIES ===

# Export centralized policies
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/template/policy/vsmart" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o centralized_policies.json

# Export localized policies
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/template/policy/vedge" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o localized_policies.json

# Export security policies
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/template/policy/security" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o security_policies.json

# Export all policy definitions
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/template/policy/definition" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o policy_definitions.json
```

---

## 6.7.3 WAN Edge Backup

### Device Configuration Backup

```bash
! === WAN EDGE LOCAL BACKUP ===

! Save running config to startup
copy running-config startup-config

! Save to local flash
copy running-config bootflash:config_backup_20251230.cfg

! Export to external server
copy running-config scp://admin@10.100.1.200/backups/wan-edges/

! === VERIFY BACKUP ===

! List backup files
dir bootflash: | include config

! Verify backup contents
more bootflash:config_backup_20251230.cfg | begin hostname
```

### vManage Device Config Backup

```bash
# === BACKUP ALL WAN EDGE CONFIGS VIA VMANAGE ===

# Get all WAN Edge device IDs
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/device" \
  -H "Cookie: JSESSIONID=${SESSION}" | \
  jq -r '.data[] | select(.personality=="vedge") | ."system-ip"' > wan_edges.txt

# Backup each device config
while read DEVICE_IP; do
  echo "Backing up ${DEVICE_IP}..."
  curl -k -X GET "https://vmanage.abhavtech.com/dataservice/device/config?deviceIP=${DEVICE_IP}" \
    -H "Cookie: JSESSIONID=${SESSION}" \
    -o "wan_edge_config_${DEVICE_IP}_$(date +%Y%m%d).json"
done < wan_edges.txt
```

### Configuration Archive Script

```python
#!/usr/bin/env python3
"""
SD-WAN Configuration Backup Automation
Abhavtech.com - December 2025
"""

import requests
import json
import os
from datetime import datetime
import boto3
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class SDWANBackup:
    """Automated SD-WAN backup system"""
    
    def __init__(self, vmanage_host: str, username: str, password: str):
        self.vmanage_host = vmanage_host
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.backup_dir = "/opt/sdwan-backups"
        self.authenticate(username, password)
    
    def authenticate(self, username: str, password: str):
        """Authenticate to vManage"""
        login_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(login_url, data=payload)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
    
    def backup_database(self) -> str:
        """Trigger and download database backup"""
        print("Starting database backup...")
        
        # Trigger backup
        backup_url = f"{self.base_url}/dataservice/system/device/config/backup"
        self.session.post(backup_url, json={"scheduleOptions": {"immediate": True}})
        
        # Wait and download
        import time
        time.sleep(60)  # Wait for backup to complete
        
        download_url = f"{self.base_url}/dataservice/system/device/config/backup/download"
        response = self.session.get(download_url)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.backup_dir}/vmanage_db_{timestamp}.tar.gz"
        
        with open(filename, 'wb') as f:
            f.write(response.content)
        
        print(f"Database backup saved: {filename}")
        return filename
    
    def backup_templates(self) -> str:
        """Backup all templates"""
        print("Backing up templates...")
        
        templates = {}
        
        # Device templates
        device_url = f"{self.base_url}/dataservice/template/device"
        device_resp = self.session.get(device_url)
        templates['device_templates'] = device_resp.json().get('data', [])
        
        # Feature templates
        feature_url = f"{self.base_url}/dataservice/template/feature"
        feature_resp = self.session.get(feature_url)
        templates['feature_templates'] = feature_resp.json().get('data', [])
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.backup_dir}/templates_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(templates, f, indent=2)
        
        print(f"Templates backup saved: {filename}")
        return filename
    
    def backup_policies(self) -> str:
        """Backup all policies"""
        print("Backing up policies...")
        
        policies = {}
        
        # Centralized policies
        vsmart_url = f"{self.base_url}/dataservice/template/policy/vsmart"
        vsmart_resp = self.session.get(vsmart_url)
        policies['centralized'] = vsmart_resp.json().get('data', [])
        
        # Localized policies
        vedge_url = f"{self.base_url}/dataservice/template/policy/vedge"
        vedge_resp = self.session.get(vedge_url)
        policies['localized'] = vedge_resp.json().get('data', [])
        
        # Security policies
        security_url = f"{self.base_url}/dataservice/template/policy/security"
        security_resp = self.session.get(security_url)
        policies['security'] = security_resp.json().get('data', [])
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.backup_dir}/policies_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(policies, f, indent=2)
        
        print(f"Policies backup saved: {filename}")
        return filename
    
    def backup_device_configs(self) -> str:
        """Backup all device configurations"""
        print("Backing up device configurations...")
        
        # Get all devices
        devices_url = f"{self.base_url}/dataservice/device"
        devices_resp = self.session.get(devices_url)
        devices = devices_resp.json().get('data', [])
        
        configs = {}
        for device in devices:
            device_ip = device.get('system-ip')
            hostname = device.get('host-name')
            
            config_url = f"{self.base_url}/dataservice/device/config"
            params = {'deviceIP': device_ip}
            config_resp = self.session.get(config_url, params=params)
            
            configs[hostname] = {
                'system_ip': device_ip,
                'config': config_resp.json().get('data', {})
            }
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.backup_dir}/device_configs_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(configs, f, indent=2)
        
        print(f"Device configs backup saved: {filename}")
        return filename
    
    def upload_to_s3(self, filename: str, bucket: str = "abhavtech-sdwan-backups"):
        """Upload backup to S3"""
        print(f"Uploading {filename} to S3...")
        
        s3_client = boto3.client('s3')
        s3_key = f"backups/{os.path.basename(filename)}"
        
        s3_client.upload_file(filename, bucket, s3_key)
        print(f"Uploaded to s3://{bucket}/{s3_key}")
    
    def run_full_backup(self):
        """Execute full backup procedure"""
        print("=" * 60)
        print("SD-WAN FULL BACKUP")
        print(f"Timestamp: {datetime.now().isoformat()}")
        print("=" * 60)
        
        # Create backup directory
        os.makedirs(self.backup_dir, exist_ok=True)
        
        # Run all backups
        db_file = self.backup_database()
        templates_file = self.backup_templates()
        policies_file = self.backup_policies()
        configs_file = self.backup_device_configs()
        
        # Upload to S3
        for f in [db_file, templates_file, policies_file, configs_file]:
            self.upload_to_s3(f)
        
        print("\n" + "=" * 60)
        print("BACKUP COMPLETE")
        print("=" * 60)

def main():
    backup = SDWANBackup(
        vmanage_host="vmanage.abhavtech.com",
        username="admin",
        password="secure_password"
    )
    backup.run_full_backup()

if __name__ == "__main__":
    main()
```

---

## 6.7.4 Certificate Backup

### Certificate Export Procedures

```bash
# === BACKUP CERTIFICATES FROM VMANAGE ===

# Export root CA certificate
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/certificate/rootcacert" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o root_ca_cert.pem

# Export vManage certificate
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/certificate/vmanagecert" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o vmanage_cert.pem

# Export device serial file
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/certificate/serialfile" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -o serial_file.viptela

# === BACKUP FROM WAN EDGE ===

! Export certificate to flash
show sdwan certificate root-ca-cert > bootflash:root_ca.pem
show sdwan certificate installed > bootflash:device_cert.pem

! Copy to backup server
copy bootflash:root_ca.pem scp://admin@10.100.1.200/backups/certs/
copy bootflash:device_cert.pem scp://admin@10.100.1.200/backups/certs/
```

### Secure Certificate Storage

```yaml
# Certificate Backup Best Practices

Storage Requirements:
  - Encrypted storage (AES-256)
  - Access control (need-to-know basis)
  - Audit logging
  - Multiple copies in different locations

Certificate Types to Backup:
  Root CA:
    - Frequency: Monthly
    - Retention: Indefinite
    - Access: Security team only
    
  vManage Certificate:
    - Frequency: Monthly
    - Retention: 1 year
    - Access: Network admins
    
  Device Certificates:
    - Frequency: On change
    - Retention: 90 days
    - Access: Network team
    
  Serial File:
    - Frequency: On device add/remove
    - Retention: Current + 2 previous
    - Access: Network admins
```

---

## 6.7.5 Restore Procedures

### vManage Database Restore

```bash
# === RESTORE VMANAGE DATABASE ===

# Option 1: Via vManage UI
# Administration > Settings > Configuration Database > Restore

# Option 2: Via API
# Upload backup file
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/system/device/config/restore/upload" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -F "file=@vmanage_backup_20251230.tar.gz"

# Trigger restore
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/system/device/config/restore" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d '{
    "restoreOptions": {
      "restoreType": "full"
    }
  }'

# Monitor restore status
curl -k -X GET "https://vmanage.abhavtech.com/dataservice/system/device/config/restore/status" \
  -H "Cookie: JSESSIONID=${SESSION}"
```

### Template Restore

```bash
# === RESTORE TEMPLATES ===

# Import device template
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/template/device" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d @device_template_backup.json

# Import feature templates (bulk)
curl -k -X POST "https://vmanage.abhavtech.com/dataservice/template/feature/bulk" \
  -H "Content-Type: application/json" \
  -H "Cookie: JSESSIONID=${SESSION}" \
  -H "X-XSRF-TOKEN: ${TOKEN}" \
  -d @all_feature_templates.json
```

### WAN Edge Configuration Restore

```bash
! === RESTORE WAN EDGE CONFIGURATION ===

! Method 1: From local backup
copy bootflash:config_backup_20251230.cfg running-config

! Method 2: From SCP server
copy scp://admin@10.100.1.200/backups/wan-edges/IN-MUM-WAN-EDGE-01.cfg running-config

! Method 3: Via vManage template push
! 1. Attach device to template in vManage
! 2. Push configuration

! Verify restoration
show running-config | begin hostname
show sdwan control connections
show sdwan tunnel statistics
```

### Disaster Recovery Restore

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DISASTER RECOVERY RESTORE PROCEDURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Step 1: Assess Damage                                                     │
│   ├── Identify failed components                                            │
│   ├── Determine backup availability                                         │
│   └── Estimate recovery time                                                │
│                                                                             │
│   Step 2: Infrastructure Recovery                                           │
│   ├── Deploy replacement VMs/hardware                                       │
│   ├── Configure base OS                                                     │
│   └── Restore network connectivity                                          │
│                                                                             │
│   Step 3: vManage Cluster Restore                                          │
│   ├── Install vManage software                                              │
│   ├── Restore from backup                                                   │
│   ├── Verify cluster formation                                              │
│   └── Validate database integrity                                           │
│                                                                             │
│   Step 4: Controller Restore                                                │
│   ├── Restore vSmart from backup                                            │
│   ├── Restore vBond from backup                                             │
│   └── Verify control plane connectivity                                     │
│                                                                             │
│   Step 5: WAN Edge Recovery                                                 │
│   ├── Verify WAN Edges reconnect                                            │
│   ├── Validate tunnel formation                                             │
│   └── Test traffic flow                                                     │
│                                                                             │
│   Step 6: Validation                                                        │
│   ├── Run comprehensive health check                                        │
│   ├── Verify SD-Access integration                                          │
│   └── Test business-critical applications                                   │
│                                                                             │
│   RTO Target: 4 hours                                                       │
│   RPO Target: 1 hour (6-hourly incremental backups)                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6.7.6 Backup Verification

### Backup Integrity Testing

```python
#!/usr/bin/env python3
"""
Backup Verification Script
Abhavtech.com - December 2025
"""

import json
import hashlib
import os
import tarfile
from datetime import datetime

class BackupVerification:
    """Verify backup integrity"""
    
    def __init__(self, backup_dir: str = "/opt/sdwan-backups"):
        self.backup_dir = backup_dir
        self.verification_results = []
    
    def verify_tar_integrity(self, filename: str) -> bool:
        """Verify tar.gz file integrity"""
        try:
            with tarfile.open(filename, 'r:gz') as tar:
                tar.getnames()  # Test file listing
                return True
        except Exception as e:
            print(f"TAR integrity check failed: {e}")
            return False
    
    def verify_json_integrity(self, filename: str) -> bool:
        """Verify JSON file integrity"""
        try:
            with open(filename, 'r') as f:
                json.load(f)
            return True
        except Exception as e:
            print(f"JSON integrity check failed: {e}")
            return False
    
    def calculate_checksum(self, filename: str) -> str:
        """Calculate SHA256 checksum"""
        sha256_hash = hashlib.sha256()
        with open(filename, 'rb') as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()
    
    def verify_backup(self, filename: str) -> dict:
        """Verify single backup file"""
        result = {
            'filename': filename,
            'exists': os.path.exists(filename),
            'size': 0,
            'checksum': None,
            'integrity': False,
            'timestamp': datetime.now().isoformat()
        }
        
        if not result['exists']:
            return result
        
        result['size'] = os.path.getsize(filename)
        result['checksum'] = self.calculate_checksum(filename)
        
        if filename.endswith('.tar.gz'):
            result['integrity'] = self.verify_tar_integrity(filename)
        elif filename.endswith('.json'):
            result['integrity'] = self.verify_json_integrity(filename)
        else:
            result['integrity'] = result['size'] > 0
        
        return result
    
    def verify_all_backups(self) -> list:
        """Verify all backups in directory"""
        print("=" * 60)
        print("BACKUP VERIFICATION")
        print(f"Directory: {self.backup_dir}")
        print("=" * 60)
        
        results = []
        
        for filename in os.listdir(self.backup_dir):
            filepath = os.path.join(self.backup_dir, filename)
            if os.path.isfile(filepath):
                result = self.verify_backup(filepath)
                results.append(result)
                
                status = "✓ VALID" if result['integrity'] else "✗ INVALID"
                print(f"\n{filename}")
                print(f"  Size: {result['size']:,} bytes")
                print(f"  Checksum: {result['checksum'][:16]}...")
                print(f"  Status: {status}")
        
        # Generate verification report
        report = {
            'timestamp': datetime.now().isoformat(),
            'backup_directory': self.backup_dir,
            'total_backups': len(results),
            'valid_backups': sum(1 for r in results if r['integrity']),
            'invalid_backups': sum(1 for r in results if not r['integrity']),
            'details': results
        }
        
        print("\n" + "=" * 60)
        print(f"SUMMARY: {report['valid_backups']}/{report['total_backups']} backups valid")
        print("=" * 60)
        
        return report

def main():
    verifier = BackupVerification()
    report = verifier.verify_all_backups()
    
    # Save report
    report_file = f"backup_verification_{datetime.now().strftime('%Y%m%d')}.json"
    with open(report_file, 'w') as f:
        json.dump(report, f, indent=2)
    print(f"\nReport saved: {report_file}")

if __name__ == "__main__":
    main()
```

### Monthly Restore Testing

```yaml
# Monthly Restore Test Procedure

Schedule: First Saturday of each month, 02:00-06:00 IST

Pre-Test Checklist:
  - [ ] Latest backup available
  - [ ] Lab environment prepared
  - [ ] Test team notified
  - [ ] Rollback procedure documented

Restore Test Steps:

1. Lab vManage Restore:
   Duration: 60 minutes
   Steps:
     - Deploy fresh vManage VM
     - Restore database from backup
     - Verify cluster health
     - Check all templates present
     - Validate policy definitions
   
2. Template Verification:
   Duration: 30 minutes
   Steps:
     - Count templates match production
     - Verify template parameters
     - Check device associations
   
3. Device Config Restore:
   Duration: 30 minutes
   Steps:
     - Apply template to lab device
     - Verify configuration matches
     - Check control connections
     - Test tunnel formation

4. Certificate Restore:
   Duration: 15 minutes
   Steps:
     - Restore root CA
     - Verify certificate chain
     - Test device authentication

Test Success Criteria:
  - Database restore completes without errors
  - All templates restored correctly
  - Device accepts restored configuration
  - Control plane establishes
  - Certificate authentication works

Documentation:
  - Record restore duration
  - Note any issues encountered
  - Update procedures if needed
  - Report to management
```

---

## 6.7.7 Backup Schedule

### Automated Backup Schedule

```yaml
# SD-WAN Backup Schedule - Abhavtech.com

Daily Backups (02:00 IST):
  vManage Database:
    Type: Full backup
    Retention: 30 days local, 90 days S3
    Location: /backups/sdwan/vmanage/
    Notification: sdwan-ops@abhavtech.com
  
  WAN Edge Configs:
    Type: Configuration export
    Retention: 30 days
    Location: /backups/sdwan/wan-edges/
    Notification: On failure only

Incremental Backups (Every 6 hours):
  vManage Database:
    Type: Incremental
    Times: 08:00, 14:00, 20:00, 02:00
    Retention: 7 days
    Location: /backups/sdwan/incremental/

Weekly Backups (Sunday 03:00 IST):
  Templates:
    Type: Full export
    Retention: 90 days
    Location: /backups/sdwan/templates/
  
  Policies:
    Type: Full export
    Retention: 90 days
    Location: /backups/sdwan/policies/
  
  Git Repository:
    Type: Git push
    Destination: GitLab sdwan-config repo
    Branch: backup/weekly

Monthly Tasks (First Sunday 04:00 IST):
  Certificate Backup:
    Type: Manual verification
    Owner: Security team
    Location: Encrypted vault
  
  Restore Test:
    Type: Lab restore
    Duration: 4 hours
    Owner: Network team
    
  Cleanup:
    Action: Remove backups older than retention
    Verify: S3 lifecycle policies active
```

### Cron Configuration

```bash
# /etc/cron.d/sdwan-backup

# Daily full backup at 02:00 IST
0 2 * * * root /opt/scripts/sdwan_backup.py --type full >> /var/log/sdwan-backup.log 2>&1

# Incremental backup every 6 hours
0 8,14,20 * * * root /opt/scripts/sdwan_backup.py --type incremental >> /var/log/sdwan-backup.log 2>&1

# Weekly template/policy backup on Sunday 03:00
0 3 * * 0 root /opt/scripts/sdwan_backup.py --type templates >> /var/log/sdwan-backup.log 2>&1
0 3 * * 0 root /opt/scripts/sdwan_backup.py --type policies >> /var/log/sdwan-backup.log 2>&1

# Backup verification daily at 06:00
0 6 * * * root /opt/scripts/verify_backups.py >> /var/log/sdwan-backup-verify.log 2>&1

# Cleanup old backups monthly
0 5 1 * * root /opt/scripts/cleanup_backups.sh >> /var/log/sdwan-backup-cleanup.log 2>&1
```

---

## 6.7.8 Backup Monitoring

### Backup Health Dashboard

```python
#!/usr/bin/env python3
"""
Backup Monitoring Dashboard
Abhavtech.com - December 2025
"""

import os
import json
from datetime import datetime, timedelta

class BackupMonitor:
    """Monitor backup health and status"""
    
    def __init__(self, backup_dir: str = "/opt/sdwan-backups"):
        self.backup_dir = backup_dir
    
    def get_latest_backup(self, prefix: str) -> dict:
        """Get latest backup matching prefix"""
        backups = []
        for filename in os.listdir(self.backup_dir):
            if filename.startswith(prefix):
                filepath = os.path.join(self.backup_dir, filename)
                mtime = os.path.getmtime(filepath)
                backups.append({
                    'filename': filename,
                    'path': filepath,
                    'size': os.path.getsize(filepath),
                    'modified': datetime.fromtimestamp(mtime)
                })
        
        if not backups:
            return None
        
        return max(backups, key=lambda x: x['modified'])
    
    def check_backup_freshness(self, backup: dict, max_age_hours: int) -> bool:
        """Check if backup is within acceptable age"""
        if not backup:
            return False
        
        age = datetime.now() - backup['modified']
        return age < timedelta(hours=max_age_hours)
    
    def generate_status_report(self) -> dict:
        """Generate comprehensive backup status"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'status': 'HEALTHY',
            'components': []
        }
        
        # Check database backup
        db_backup = self.get_latest_backup('vmanage_db_')
        db_status = {
            'component': 'vManage Database',
            'latest_backup': db_backup['filename'] if db_backup else None,
            'age_hours': (datetime.now() - db_backup['modified']).total_seconds() / 3600 if db_backup else None,
            'size_mb': db_backup['size'] / (1024*1024) if db_backup else 0,
            'healthy': self.check_backup_freshness(db_backup, 24)
        }
        report['components'].append(db_status)
        
        # Check template backup
        template_backup = self.get_latest_backup('templates_')
        template_status = {
            'component': 'Templates',
            'latest_backup': template_backup['filename'] if template_backup else None,
            'age_hours': (datetime.now() - template_backup['modified']).total_seconds() / 3600 if template_backup else None,
            'size_mb': template_backup['size'] / (1024*1024) if template_backup else 0,
            'healthy': self.check_backup_freshness(template_backup, 168)  # 7 days
        }
        report['components'].append(template_status)
        
        # Check policy backup
        policy_backup = self.get_latest_backup('policies_')
        policy_status = {
            'component': 'Policies',
            'latest_backup': policy_backup['filename'] if policy_backup else None,
            'age_hours': (datetime.now() - policy_backup['modified']).total_seconds() / 3600 if policy_backup else None,
            'size_mb': policy_backup['size'] / (1024*1024) if policy_backup else 0,
            'healthy': self.check_backup_freshness(policy_backup, 168)
        }
        report['components'].append(policy_status)
        
        # Check device configs
        config_backup = self.get_latest_backup('device_configs_')
        config_status = {
            'component': 'Device Configs',
            'latest_backup': config_backup['filename'] if config_backup else None,
            'age_hours': (datetime.now() - config_backup['modified']).total_seconds() / 3600 if config_backup else None,
            'size_mb': config_backup['size'] / (1024*1024) if config_backup else 0,
            'healthy': self.check_backup_freshness(config_backup, 24)
        }
        report['components'].append(config_status)
        
        # Overall status
        unhealthy = [c for c in report['components'] if not c['healthy']]
        if len(unhealthy) > 0:
            report['status'] = 'WARNING' if len(unhealthy) < 2 else 'CRITICAL'
        
        return report
    
    def print_dashboard(self):
        """Print dashboard to console"""
        report = self.generate_status_report()
        
        print("=" * 70)
        print("SD-WAN BACKUP STATUS DASHBOARD")
        print(f"Generated: {report['timestamp']}")
        print(f"Overall Status: {report['status']}")
        print("=" * 70)
        
        print(f"\n{'Component':<20} {'Latest Backup':<30} {'Age (hrs)':<10} {'Size (MB)':<10} {'Status':<10}")
        print("-" * 80)
        
        for comp in report['components']:
            status = "✓ OK" if comp['healthy'] else "✗ STALE"
            age = f"{comp['age_hours']:.1f}" if comp['age_hours'] else "N/A"
            size = f"{comp['size_mb']:.1f}" if comp['size_mb'] else "0"
            backup = comp['latest_backup'][:28] + ".." if comp['latest_backup'] and len(comp['latest_backup']) > 30 else (comp['latest_backup'] or "MISSING")
            
            print(f"{comp['component']:<20} {backup:<30} {age:<10} {size:<10} {status:<10}")

def main():
    monitor = BackupMonitor()
    monitor.print_dashboard()

if __name__ == "__main__":
    main()
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 30, 2025 | Abhavtech | Initial backup & restore procedures |

---

**Document Classification:** Internal Use
**Next Review Date:** March 30, 2026
