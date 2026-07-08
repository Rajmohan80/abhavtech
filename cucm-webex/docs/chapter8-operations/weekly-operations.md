# Weekly Operations

## 8.5 Routine Maintenance

### 8.5.1 Maintenance Schedule

| Task | Frequency | Window | Owner |
|------|-----------|--------|-------|
| Phone firmware updates | Monthly | Sunday 2-6 AM | Voice Eng |
| LGW IOS-XE updates | Quarterly | Sunday 2-6 AM | Voice Eng + Network |
| Certificate review | Monthly | Business hours | Voice Eng |
| License reconciliation | Monthly | Business hours | Voice Eng |
| Analytics report generation | Weekly | Friday PM | Voice Eng |
| Disaster recovery test | Quarterly | Scheduled weekend | Voice Eng |
| Compliance audit | Quarterly | Business hours | Compliance |

### 8.5.2 Phone Firmware Updates

**Procedure: Update Phone Firmware**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Devices -> Device Settings | Firmware management |
| 2 | Check current firmware versions | Per model |
| 3 | Check latest available versions | Webex-managed |
| 4 | Review release notes | Known issues |
| 5 | Select device group for update | By location or model |
| 6 | Schedule update window | Off-hours |
| 7 | Configure update: | |
| | - Apply to selected devices | |
| | - Set schedule (date/time) | |
| | - Allow auto-reboot | |
| 8 | Monitor update progress | Control Hub |
| 9 | Verify devices on new firmware | Post-update check |
| 10 | Document update completion | Change record |

> **Reference:** https://help.webex.com/article/o3lne1 (Device Firmware)

### 8.5.3 License Management

**Procedure: Monthly License Reconciliation**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Account -> Subscriptions | License overview |
| 2 | Record current usage: | |
| | - Webex Calling Professional: X/3,200 | |
| | - Common Area: X/50 | |
| 3 | Navigate to Users | Active users |
| 4 | Export user list | Compare to HR roster |
| 5 | Identify: | |
| | - Terminated users still licensed | Reclaim |
| | - Users without licenses (if needed) | Provision |
| 6 | Reclaim unused licenses | Per 8.2.5 |
| 7 | Project future needs | 3-month forecast |
| 8 | If >85% utilized: | Request additional |
| 9 | Document reconciliation | Monthly report |

### 8.5.4 Backup Procedures

**What's Backed Up Automatically:**

| Data | Backup Method | Retention |
|------|---------------|-----------|
| User configurations | Webex Cloud (automatic) | Continuous |
| Device configurations | Webex Cloud (automatic) | Continuous |
| Call Detail Records | Webex Cloud | 13 months |
| Voicemails | Webex Cloud | Per policy |
| Admin audit logs | Webex Cloud | 12 months |

**What Requires Manual Backup:**

| Data | Backup Method | Frequency | Owner |
|------|---------------|-----------|-------|
| LGW configuration | `copy running-config tftp:` | Weekly | Network |
| Custom audio prompts | Export from Control Hub | After changes | Voice Eng |
| Documentation | SharePoint/Git | After changes | Voice Eng |
| User mapping | Export to CSV | Monthly | Voice Eng |

**Procedure: LGW Configuration Backup**

| Step | Action | Notes |
|------|--------|-------|
| 1 | SSH to LGW device | Each LGW |
| 2 | Execute backup: | |
| | `copy running-config tftp://10.1.10.100/lgw-mum-01-YYYYMMDD.cfg` | TFTP server |
| 3 | Verify file transferred | Check TFTP server |
| 4 | Repeat for all LGWs | 7 devices |
| 5 | Archive backups | Retention: 90 days |

---

