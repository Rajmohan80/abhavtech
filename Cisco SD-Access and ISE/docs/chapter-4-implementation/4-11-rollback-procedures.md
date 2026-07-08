# 4.11 Rollback Procedures

### 4.11.1 Rollback Decision Matrix

| Issue | Severity | Impact | Rollback Trigger |
|-------|----------|--------|------------------|
| >25% users cannot authenticate | Critical | Business impact | Immediate rollback |
| Voice quality degraded | High | Communication impact | Rollback if >15 min |
| Single floor issues | Medium | Limited impact | Floor-level rollback |
| Minor issues, workaround available | Low | Minimal impact | Continue, fix forward |

### 4.11.2 Full Site Rollback Procedure

```
FULL ROLLBACK PROCEDURE - MUMBAI

Step 1: Declare Rollback (PM Decision)
        Time: T+0
        
Step 2: Notify Stakeholders
        Time: T+5 minutes
        - Send rollback notification
        - Update bridge call
        
Step 3: Disable Fabric on All Edge Nodes
        Time: T+10 minutes
        # From DNAC: Provision > Fabric Sites > Mumbai
        # Disable Host Onboarding (all floors)
        
Step 4: Restore Legacy Switch Configuration
        Time: T+20 minutes
        # For each edge switch:
        configure replace flash:pre-cutover-backup.txt
        
Step 5: Verify Legacy Operation
        Time: T+40 minutes
        show vlan brief
        show spanning-tree summary
        show mac address-table dynamic
        
Step 6: User Validation
        Time: T+50 minutes
        - Test user authentication
        - Test application access
        - Test voice quality
        
Step 7: Rollback Complete
        Time: T+60 minutes
        - Confirm all users operational
        - Schedule post-mortem
        - Plan remediation
```

### 4.11.3 Partial Rollback (Single Floor)

```bash
# Floor-level rollback if issues isolated to one floor

# Step 1: Identify affected floor edge switches
# Example: MUM-ED-01, MUM-ED-02 (Floor 1)

# Step 2: Disable fabric on affected switches only
# DNAC: Provision > Inventory > [MUM-ED-01] > Actions > Delete from Fabric Site

# Step 3: Restore legacy configuration
configure terminal
 interface range GigabitEthernet1/0/1-48
  switchport mode access
  switchport access vlan 100
  no authentication port-control auto
  no dot1x pae authenticator
  no mab

# Step 4: Verify floor operation
show vlan brief
show interface status

# Other floors continue on fabric
```

### 4.11.4 Rollback Configuration Backup

```bash
# Pre-cutover backup script (run on all devices)

#!/bin/bash
# backup_configs.sh

DEVICES="MUM-ED-01 MUM-ED-02 MUM-ED-03 ..."
DATE=$(date +%Y%m%d)

for device in $DEVICES; do
  ssh netadmin@$device "show running-config" > backup/${device}_${DATE}.txt
  ssh netadmin@$device "copy running-config flash:pre-cutover-backup.txt"
done

# Verify backups
ls -la backup/
```

---
