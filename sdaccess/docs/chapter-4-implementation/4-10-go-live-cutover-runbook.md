# 4.10 Go-Live Cutover Runbook

### 4.10.1 Pre-Cutover Checklist

| Item | Owner | Status | Sign-off |
|------|-------|--------|----------|
| All test cases passed | QA Lead | [ ] | _______ |
| Rollback plan documented | Network Lead | [ ] | _______ |
| Support teams on standby | Operations | [ ] | _______ |
| Change ticket approved | Change Manager | [ ] | _______ |
| Communication sent to users | Comms Lead | [ ] | _______ |
| Backup configs verified | Network Lead | [ ] | _______ |
| Monitoring dashboards ready | NOC | [ ] | _______ |

### 4.10.2 Cutover Schedule (Per Site)

```
SITE CUTOVER: MUMBAI HQ
Date: [Cutover Date]
Time: 22:00 - 06:00 IST (Off-peak hours)

+--------+--------+------------------------------------------------+----------+
| Time   | Phase  | Activity                                       | Owner    |
+--------+--------+------------------------------------------------+----------+
| 22:00  | Prep   | Team assembly, bridge open                     | PM       |
| 22:15  | Prep   | Final backup of legacy configs                 | Network  |
| 22:30  | Prep   | Verify DNAC/ISE health                         | Network  |
| 22:45  | Prep   | Pre-cutover validation tests                   | QA       |
| 23:00  | Start  | Begin Floor 1 migration                        | Network  |
| 23:15  | Exec   | Enable 802.1X on Floor 1 Edge switches         | Network  |
| 23:30  | Test   | Validate Floor 1 user authentication           | QA       |
| 23:45  | Exec   | Enable fabric on Floor 1 (VNs, SGTs)           | Network  |
| 00:00  | Test   | Full Floor 1 validation                        | QA       |
| 00:15  | Exec   | Begin Floor 2 migration                        | Network  |
| 00:45  | Test   | Full Floor 2 validation                        | QA       |
| 01:00  | Exec   | Begin Floor 3 migration                        | Network  |
| 01:30  | Test   | Full Floor 3 validation                        | QA       |
| 02:00  | Exec   | Begin Floor 4 migration                        | Network  |
| 02:30  | Test   | Full Floor 4 validation                        | QA       |
| 03:00  | Exec   | Begin Floor 5-6 migration                      | Network  |
| 03:30  | Test   | Full Floor 5-6 validation                      | QA       |
| 04:00  | Exec   | Migrate wireless to fabric                     | Wireless |
| 04:30  | Test   | Full wireless validation                       | QA       |
| 05:00  | Test   | End-to-end validation                          | QA       |
| 05:30  | Comm   | Success notification / Rollback decision       | PM       |
| 06:00  | Close  | Cutover complete, hypercare begins             | All      |
+--------+--------+------------------------------------------------+----------+
```

### 4.10.3 Floor Migration Procedure

**Step 1: Pre-Migration (per floor)**

```bash
# Verify current state
show running-config interface range Gi1/0/1-48
show authentication sessions
show mac address-table dynamic

# Document baseline
# Save outputs to cutover log
```

**Step 2: Enable Fabric Configuration**

```bash
# From DNAC: Provision > Fabric Sites > [Mumbai] > [Floor]
# Enable Host Onboarding for floor edge switches

# DNAC pushes:
# - LISP configuration
# - VXLAN interfaces
# - VN/VLAN mappings
# - 802.1X configuration

# Monitor provisioning status
# Wait for "Success" status
```

**Step 3: Validate Floor Migration**

```bash
# On edge switch:
show authentication sessions
# Verify users authenticated with correct SGT

show lisp site
# Verify edge registered to control plane

show vxlan tunnel
# Verify VXLAN tunnels established

# Test user connectivity
ping <test_server> from user workstation
# Verify application access
```

**Step 4: Rollback Procedure (if needed)**

```bash
# From DNAC: Provision > Fabric Sites > [Mumbai] > [Floor]
# Disable Host Onboarding

# Or manual CLI:
# Remove fabric configuration
no lisp instance-id 8001
no vlan configuration <fabric_vlans>

# Restore legacy configuration from backup
configure replace flash:backup-config.txt

# Verify legacy operation restored
show vlan brief
show spanning-tree summary
```

### 4.10.4 Post-Cutover Validation

```bash
# Comprehensive validation checklist

# 1. Authentication
show authentication sessions | count
# Compare to pre-cutover baseline

# 2. Network Health (DNAC)
# Assurance > Network Health
# Score should be >90%

# 3. Client Health (DNAC)
# Assurance > Client Health
# Wireless and Wired clients healthy

# 4. Application Health
# Verify critical applications accessible
# Test: Email, ERP, CRM, File shares

# 5. Voice Quality
# Test phone calls
# Check DSCP marking preserved

# 6. Security Policy
show cts role-based permissions
# Verify SGACLs active
```

---
