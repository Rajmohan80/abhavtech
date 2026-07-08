# 5.11 Backup and Recovery

### 5.11.1 Backup Schedule

| System | Backup Type | Frequency | Retention | Location |
|--------|-------------|-----------|-----------|----------|
| DNAC | Full system | Weekly (Sunday 02:00) | 4 weeks | NFS + offsite |
| DNAC | Configuration | Daily (02:00) | 90 days | NFS |
| ISE | Full system | Weekly (Sunday 03:00) | 4 weeks | SFTP + offsite |
| ISE | Configuration | Daily (03:00) | 90 days | SFTP |
| Network Devices | Running config | Daily (02:00) | 90 days | TFTP/SCP |

### 5.11.2 DNAC Backup Procedure

```yaml
# System > Settings > Backup & Restore

Backup_Configuration:
  Destination: NFS
  NFS_Server: backup.corp.local
  NFS_Path: /backups/dnac/
  
  Schedule:
    Full_Backup: Weekly (Sunday 02:00 UTC)
    Config_Backup: Daily (02:00 UTC)
    
Manual_Backup:
  # System > Settings > Backup & Restore > Backup Now
  Type: Full Backup
  Encryption: AES-256
  Password: <backup_encryption_password>
  
Backup_Verification:
  # Monthly test restore to lab environment
  Test_Frequency: Monthly
  Validation: Confirm all data restored
```

### 5.11.3 ISE Backup Procedure

```bash
# CLI Backup
ssh admin@ise-pan-nj.corp.local

# Configure repository
repository BACKUP-REPO
 url sftp://backup.corp.local/ise-backups/
 user backup-user password plain <password>

# Perform backup
backup DAILY-BACKUP repository BACKUP-REPO ise-config encryption-key plain <key>

# Schedule backup
# Administration > System > Backup & Restore > Schedule

# Verify backup
show backup history

# Restore procedure (if needed)
restore DAILY-BACKUP repository BACKUP-REPO encryption-key plain <key>
```

### 5.11.4 Network Device Backup

```python
#!/usr/bin/env python3
"""
Network Device Configuration Backup Script
"""

import paramiko
import datetime
import os

DEVICES = [
    {'name': 'MUM-BN-01', 'ip': '10.252.12.1', 'type': 'cisco_ios'},
    {'name': 'MUM-BN-02', 'ip': '10.252.12.2', 'type': 'cisco_ios'},
    # Add all devices
]

USERNAME = 'netadmin'
PASSWORD = '<password>'
BACKUP_DIR = '/backups/network-configs/'

def backup_device(device):
    """Backup single device configuration"""
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(device['ip'], username=USERNAME, password=PASSWORD)
        
        stdin, stdout, stderr = ssh.exec_command('show running-config')
        config = stdout.read().decode()
        
        # Save to file
        date = datetime.datetime.now().strftime('%Y%m%d')
        filename = f"{BACKUP_DIR}{device['name']}_{date}.txt"
        
        with open(filename, 'w') as f:
            f.write(config)
        
        ssh.close()
        return True
        
    except Exception as e:
        print(f"Error backing up {device['name']}: {e}")
        return False

def main():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    success = 0
    failed = 0
    
    for device in DEVICES:
        if backup_device(device):
            success += 1
        else:
            failed += 1
    
    print(f"Backup complete: {success} success, {failed} failed")

if __name__ == '__main__':
    main()
```

### 5.11.5 Disaster Recovery Procedure

```
+------------------------------------------------------------------+
|                    DISASTER RECOVERY PROCEDURE                    |
+------------------------------------------------------------------+

SCENARIO: Primary DNAC Cluster Failure (New Jersey)

Step 1: Assess Situation
- Confirm primary cluster is unrecoverable
- Verify DR site (London) infrastructure ready
- Notify stakeholders

Step 2: Activate DR DNAC Cluster
- Power on DR DNAC nodes (if cold standby)
- Restore latest backup to DR cluster
- Update DNS: dnac.corp.local -> DR cluster IP

Step 3: Reconnect Network Devices
- Devices will auto-reconnect to new DNAC IP via DNS
- Verify device inventory in DR DNAC
- Re-establish Assurance data collection

Step 4: Reconnect ISE Integration
- Update DNAC-ISE integration settings
- Verify pxGrid connection
- Test authentication policies

Step 5: Validation
- Verify all sites visible in DNAC
- Confirm Assurance data flowing
- Test device provisioning
- Validate policy deployment

Step 6: Communication
- Notify operations team of new procedures
- Update runbooks with DR DNAC details
- Schedule review of incident

RTO Target: 4 hours
RPO Target: 24 hours (daily backup)
```

---
