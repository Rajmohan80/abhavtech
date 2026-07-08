# Chapter 8: Operations & Day 2 

> **Document Reference:** ABV-COLLAB-MIG-2026 | Chapter 8
> **Cross-References:** Chapter 4 (Compliance), Chapter 5 (Network), Chapter 6 (Implementation)
> **Style:** Operations-focused (Sonnet 4.5)

---

## 8.1 Operations Model Overview

### 8.1.1 Support Tiers

| Tier | Team | Scope | Response SLA |
|------|------|-------|--------------|
| **L1** | Help Desk | Password resets, basic config, known issues | 15 min |
| **L2** | Voice Engineering | Complex troubleshooting, feature config | 1 hour |
| **L3** | Cisco TAC | Platform issues, bugs, escalations | Per contract |
| **Vendor** | IntelePeer/Tata | PSTN issues, number porting | Per SLA |

### 8.1.2 Operations Responsibilities Matrix

| Task | Help Desk | Voice Eng | Network | Security |
|------|-----------|-----------|---------|----------|
| User provisioning | * | O | | |
| Phone deployment | * | O | | |
| Call quality issues | * | * | * | |
| Feature configuration | | * | | |
| PSTN issues | O | * | | |
| Network troubleshooting | | O | * | |
| Security incidents | | | | * |
| Compliance audits | | O | | * |
| LGW management (India) | | * | * | |

**Legend:** * Primary | O Secondary

### 8.1.3 Key Contacts

| Role | Contact | Escalation |
|------|---------|------------|
| Voice Engineering Lead | voice-lead@abhavtech.com | +91-22-4960-9001 |
| Help Desk | helpdesk@abhavtech.com | Ext 1100 |
| Network Operations | noc@abhavtech.com | +91-22-4960-9002 |
| Cisco TAC | Open case via support.cisco.com | Contract #: XXXXXXXX |
| IntelePeer Support | support@intelepeer.com | +1-XXX-XXX-XXXX |
| Tata Teleservices | enterprise.support@tata.com | 1800-XXX-XXXX |

---

## 8.2 Control Hub Administration

### 8.2.1 Daily Operations Tasks

| Task | Frequency | Owner | Procedure |
|------|-----------|-------|-----------|
| Check service status | Daily 9 AM | Help Desk | 8.2.2 |
| Review alerts/notifications | Daily | Voice Eng | 8.2.3 |
| Process new user requests | Daily | Help Desk | 8.2.4 |
| Process terminations | Daily | Help Desk | 8.2.5 |
| Review call quality reports | Daily | Voice Eng | 8.3.2 |

### 8.2.2 Check Service Status

**Procedure: Daily Health Check**

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to https://status.webex.com | Webex status page |
| 2 | Verify all services show "Operational" | Green status |
| 3 | Check Webex Calling status specifically | No incidents |
| 4 | Login to Control Hub | admin.webex.com |
| 5 | Navigate to Troubleshooting -> Service Health | Internal view |
| 6 | Verify Calling Service = Active | Green indicator |
| 7 | Verify PSTN connections = Active | All trunks green |
| 8 | Document any issues in daily log | Shift handover |

### 8.2.3 Review Alerts and Notifications

**Procedure: Alert Review**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Login to Control Hub | admin.webex.com |
| 2 | Check notification bell (top right) | Unread alerts |
| 3 | Navigate to Alerts Center | Full alert list |
| 4 | Filter by severity: Critical, Warning | Priority first |
| 5 | Review each alert: | |
| | - License threshold alerts | Capacity planning |
| | - Device offline alerts | Phone issues |
| | - Trunk status alerts | PSTN issues |
| | - Security alerts | Investigate |
| 6 | Take action per alert type | See 8.6 Troubleshooting |
| 7 | Acknowledge resolved alerts | Clear list |

> **Reference:** https://help.webex.com/article/ni3wlvw (Alerts in Control Hub)

### 8.2.4 New User Provisioning

**Procedure: Add New User (Day 2)**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Receive approved request (ServiceNow/email) | HR-approved |
| 2 | Verify user exists in Azure AD | SCIM should sync |
| 3 | If not synced, wait 30 min or trigger sync | Auto-provision |
| 4 | Login to Control Hub -> Users | Find user |
| 5 | Click user -> Calling | Enable calling |
| 6 | Assign license: Webex Calling Professional | From pool |
| 7 | Select Location | User's office |
| 8 | Assign Phone Number (DID) | From available pool |
| 9 | Assign Extension | Per dial plan |
| 10 | Configure Voicemail | Enable |
| 11 | Click Save | User calling-enabled |
| 12 | Add phone device (if desk phone) | Per Chapter 6 |
| 13 | Send welcome email to user | Include training link |
| 14 | Close service request | Document completion |

**SLA:** New user provisioning within 4 business hours of approved request.

> **Reference:** https://help.webex.com/article/v71ztb (Add Users)

### 8.2.5 User Termination/Offboarding

**Procedure: Remove User Access**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Receive termination request (HR) | Approved request |
| 2 | Login to Control Hub -> Users | Find user |
| 3 | Document current settings | For records |
| 4 | Navigate to Devices | User's devices |
| 5 | Delete assigned phone(s) | Release device |
| 6 | Navigate to user -> Calling | Calling settings |
| 7 | Release phone number (DID) | Return to pool |
| 8 | Release extension | Return to pool |
| 9 | Disable Calling license | Reclaim license |
| 10 | If full termination: Delete user | Or disable via SCIM |
| 11 | Voicemail auto-deleted | With user |
| 12 | Update service request | Document completion |

**SLA:** Termination processed within 2 hours for security terminations, 24 hours standard.

### 8.2.6 User Modification Procedures

**Procedure: Change User Location**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Login to Control Hub -> Users | Find user |
| 2 | Navigate to Calling | Calling settings |
| 3 | Note current DID and extension | May need to change |
| 4 | Change Location | New location |
| 5 | **If India:** Update Zone assignment | Critical for toll bypass |
| 6 | Assign new DID (if changing region) | Regional number |
| 7 | Update Emergency Location | E911/112 compliance |
| 8 | Click Save | Apply changes |
| 9 | Update phone device location | If moving physical phone |
| 10 | Test calling from new location | Verify routing |

> **Reference:** https://help.webex.com/article/ndki3zb (User Calling Settings)

**Procedure: Change User Phone Number/Extension**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Login to Control Hub -> Users | Find user |
| 2 | Navigate to Calling -> Numbers | Number settings |
| 3 | Click "Edit" on phone number | Modify |
| 4 | Select new DID from available pool | Or enter manually |
| 5 | Update extension if needed | New ext |
| 6 | Update Caller ID settings | Match new number |
| 7 | Click Save | Apply changes |
| 8 | Notify user of change | Email confirmation |
| 9 | Update any Hunt Groups/AA | If user is member |

---

## 8.3 Monitoring & Analytics

### 8.3.1 Control Hub Analytics Overview

**Navigation:** Control Hub -> Analytics -> Calling

| Report | Purpose | Frequency |
|--------|---------|-----------|
| Calling Usage | Call volumes, durations | Weekly |
| Quality | MOS, jitter, packet loss | Daily |
| Endpoint | Device health, firmware | Weekly |
| PSTN | PSTN minutes, costs | Monthly |
| Location | Per-site metrics | Weekly |

### 8.3.2 Call Quality Monitoring

**Procedure: Daily Quality Review**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Analytics -> Calling -> Quality | Quality dashboard |
| 2 | Set date range: Last 24 hours | Daily review |
| 3 | Review overall MOS distribution | Target >4.0 |
| 4 | Identify calls with MOS <3.5 | Poor quality |
| 5 | Click on poor quality calls | Drill down |
| 6 | Note patterns: | |
| | - Specific users affected? | User issue |
| | - Specific locations? | Site/network issue |
| | - Specific times? | Congestion |
| | - Specific call types? | PSTN vs internal |
| 7 | Export report for trending | Weekly summary |
| 8 | Create incident if widespread | Escalate to network |

**Quality Thresholds:**

| Metric | Good | Acceptable | Poor | Action |
|--------|------|------------|------|--------|
| MOS | >4.0 | 3.5-4.0 | <3.5 | Investigate |
| Jitter | <30ms | 30-50ms | >50ms | Network review |
| Latency | <150ms | 150-300ms | >300ms | Path analysis |
| Packet Loss | <1% | 1-3% | >3% | Network review |

> **Reference:** https://help.webex.com/article/nkgc89t (Calling Analytics)

### 8.3.3 PSTN Usage Monitoring

**Procedure: Monthly PSTN Review**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Analytics -> Calling -> PSTN | PSTN dashboard |
| 2 | Set date range: Last month | Monthly review |
| 3 | Review total PSTN minutes | Budget tracking |
| 4 | Review by location | Regional breakdown |
| 5 | Review by call type: | |
| | - Inbound minutes | |
| | - Outbound local | |
| | - Outbound long distance | |
| | - Outbound international | |
| 6 | Identify high-usage users | Top 20 list |
| 7 | Compare to previous month | Trend analysis |
| 8 | Export for finance/billing | Cost allocation |

### 8.3.4 Device Health Monitoring

**Procedure: Weekly Device Review**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Devices | Device list |
| 2 | Filter: Status = Offline | Problem devices |
| 3 | For each offline device: | |
| | - Check last seen date | Recent or old |
| | - Check user status | Active employee? |
| | - Contact user/site IT | Investigate |
| 4 | Filter: Firmware not current | Update needed |
| 5 | Schedule firmware updates | Maintenance window |
| 6 | Review device inventory | License reconciliation |

> **Reference:** https://help.webex.com/article/nmbjg6c (Device Management)

### 8.3.5 Custom Alerts Configuration

**Procedure: Set Up Monitoring Alerts**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Alerts Center | Alert management |
| 2 | Click "Create Alert Rule" | New rule |
| 3 | Configure recommended alerts: | |

**Recommended Alert Rules:**

| Alert Name | Trigger | Recipients | Priority |
|------------|---------|------------|----------|
| License Threshold | >90% licenses used | voice-lead@abhavtech.com | High |
| Trunk Down | PSTN trunk offline >5 min | voice-eng@abhavtech.com | Critical |
| Mass Offline | >10 devices offline | noc@abhavtech.com | Critical |
| Poor Call Quality | MOS <3.0 for >10 calls/hour | voice-eng@abhavtech.com | High |
| LGW Unreachable | Local Gateway offline | voice-eng@abhavtech.com, noc@abhavtech.com | Critical |
| Unusual Call Pattern | >200% normal volume | security@abhavtech.com | Medium |

> **Reference:** https://help.webex.com/article/ni3wlvw (Configure Alerts)

---

## 8.4 Local Gateway Operations (India)

### 8.4.1 LGW Health Check

**Procedure: Daily LGW Verification**

| Step | Action | Expected |
|------|--------|----------|
| 1 | SSH to LGW device | lgw-mum-01.abhavtech.com |
| 2 | Check Webex registration: | |
| | `show voice register status` | Registered |
| 3 | Check SIP trunk status: | |
| | `show sip-ua status` | Active |
| 4 | Check active calls: | |
| | `show call active voice brief` | No stuck calls |
| 5 | Check CPU/memory: | |
| | `show processes cpu sorted` | <70% CPU |
| | `show memory statistics` | >30% free |
| 6 | Check interface status: | |
| | `show ip interface brief` | All UP |
| 7 | Check certificate validity: | |
| | `show crypto pki certificates` | Not expiring soon |
| 8 | Document in daily log | Shift handover |

**LGW Quick Commands Reference:**

```
! Registration status
show voice register status

! Active calls
show call active voice brief
show call active voice compact

! SIP trunk status
show sip-ua status
show sip-ua connections tcp tls detail

! Voice statistics
show voice statistics
show voice call summary

! Debug (use cautiously)
debug ccsip messages
debug voip ccapi inout
```

### 8.4.2 LGW Certificate Renewal

**Procedure: Renew LGW Certificate (Before Expiry)**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Check certificate expiry date | `show crypto pki certificates` |
| 2 | Renew 30 days before expiry | Avoid service impact |
| 3 | Generate new CSR (if external CA): | |
| | `crypto pki enroll <trustpoint>` | Follow prompts |
| 4 | Submit CSR to CA | Get signed cert |
| 5 | Import signed certificate: | |
| | `crypto pki import <trustpoint> certificate` | Paste cert |
| 6 | Verify new certificate: | |
| | `show crypto pki certificates` | New expiry date |
| 7 | Test Webex registration | Should re-register |
| 8 | Document renewal | Update tracking |

> **Reference:** https://help.webex.com/article/jr1i3r (LGW Certificate Management)

### 8.4.3 LGW Failover Testing

**Procedure: Test LGW Redundancy (Quarterly)**

| Step | Action | Expected |
|------|--------|----------|
| 1 | Schedule maintenance window | User notification |
| 2 | Verify both LGWs active | Mumbai Primary + Secondary |
| 3 | On Primary LGW: | |
| | `voice service voip` | |
| | `shutdown` | Disable voice |
| 4 | Monitor Control Hub | Primary shows offline |
| 5 | Test calls from Mumbai users | Should route via Secondary |
| 6 | Verify call quality | No degradation |
| 7 | Re-enable Primary: | |
| | `voice service voip` | |
| | `no shutdown` | Enable voice |
| 8 | Verify Primary re-registers | Back to active |
| 9 | Document test results | Compliance evidence |

---

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

## 8.6 Troubleshooting Procedures

### 8.6.1 Troubleshooting Decision Tree

```
+-----------------------------------------------------------------+
|  WEBEX CALLING TROUBLESHOOTING DECISION TREE                     |
+-----------------------------------------------------------------+
|                                                                 |
|  USER REPORTS ISSUE                                            |
|  |                                                              |
|  +-> No dial tone / Phone not working                          |
|  |   +-> Check phone registration -> 8.6.2                      |
|  |   +-> Check network connectivity -> 8.6.3                    |
|  |                                                              |
|  +-> Cannot make calls                                         |
|  |   +-> Internal calls fail -> 8.6.4                           |
|  |   +-> PSTN calls fail -> 8.6.5                               |
|  |                                                              |
|  +-> Cannot receive calls                                      |
|  |   +-> DID not ringing -> 8.6.6                               |
|  |   +-> Extension not ringing -> 8.6.7                         |
|  |                                                              |
|  +-> Poor call quality                                         |
|  |   +-> One-way audio -> 8.6.8                                 |
|  |   +-> Choppy/robotic audio -> 8.6.9                          |
|  |   +-> Echo -> 8.6.10                                         |
|  |                                                              |
|  +-> Voicemail issues                                          |
|  |   +-> Voicemail not working -> 8.6.11                        |
|  |                                                              |
|  +-> Feature not working                                       |
|      +-> Specific feature troubleshooting -> 8.6.12             |
|                                                                 |
+-----------------------------------------------------------------+
```

### 8.6.2 Phone Registration Issues

**Procedure: Troubleshoot Phone Not Registering**

| Step | Check | Action if Failed |
|------|-------|------------------|
| 1 | Phone powered on? | Check PoE / power adapter |
| 2 | Network link light on? | Check cable / switch port |
| 3 | Phone has IP address? | Settings -> Network -> IPv4 |
| 4 | Phone can ping gateway? | Network test on phone |
| 5 | Phone can reach Webex? | DNS / firewall check |
| 6 | Phone in Control Hub? | Add device if missing |
| 7 | MAC address correct? | Verify in Control Hub |
| 8 | Correct firmware? | May need factory reset |

**Control Hub Verification:**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Devices | Device list |
| 2 | Search by MAC or user | Find device |
| 3 | Check Status | Should be "Online" |
| 4 | If Offline: Check "Last Seen" | Recent = network issue |
| 5 | Click device -> Troubleshoot | Diagnostic tools |
| 6 | Run connectivity test | From Control Hub |

> **Reference:** https://help.webex.com/article/n2wfv0j (Troubleshoot Devices)

### 8.6.3 Network Connectivity Issues

**Procedure: Troubleshoot Network Path**

| Step | Check | Command/Tool |
|------|-------|--------------|
| 1 | Phone IP configuration | Phone Settings -> Network |
| 2 | VLAN assignment correct | `show mac address-table` on switch |
| 3 | DNS resolution | `nslookup webex.com` from phone subnet |
| 4 | Firewall rules | Check FW logs for blocks |
| 5 | Proxy bypass | Verify Webex domains excluded |
| 6 | SSL inspection | Must be disabled for Webex |
| 7 | QoS marking | Packet capture / `show policy-map` |

**Network Test from Phone:**

| Step | Action |
|------|--------|
| 1 | On phone: Settings -> Admin Settings -> Network |
| 2 | Run Network Test |
| 3 | Review results: DNS, HTTP, Media |
| 4 | Note any failures |

### 8.6.4 Internal Call Failures

**Procedure: Troubleshoot Internal Calls**

| Step | Check | Action |
|------|-------|--------|
| 1 | Caller phone registered? | Control Hub device status |
| 2 | Callee phone registered? | Control Hub device status |
| 3 | Extensions correct? | User -> Calling -> Numbers |
| 4 | Same location? | Verify dial plan |
| 5 | Different location? | Check site-to-site routing |
| 6 | Webex-to-CUCM call? | Check coexistence trunk |
| 7 | Check call history | User -> Calling -> Call History |
| 8 | Check error code | Analytics -> Troubleshooting |

**Common Error Codes:**

| Code | Meaning | Resolution |
|------|---------|------------|
| 404 | User not found | Check extension/routing |
| 480 | Temporarily unavailable | Device offline |
| 486 | Busy | User on another call |
| 503 | Service unavailable | Platform issue - check status |

### 8.6.5 PSTN Call Failures

**Procedure: Troubleshoot PSTN Outbound**

| Step | Check | Action |
|------|-------|--------|
| 1 | User has PSTN access? | Calling permissions |
| 2 | Correct dial string? | Include country code |
| 3 | PSTN trunk active? | Control Hub -> PSTN |
| 4 | For India: Correct Zone? | Toll bypass routing |
| 5 | LGW registered? (India) | `show voice register status` |
| 6 | PSTN provider up? | Check provider portal |
| 7 | DIDs ported complete? | Number inventory |
| 8 | Check CDR for error | Call history |

**India-Specific PSTN Troubleshooting:**

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| Call fails to connect | Wrong LGW routing | Verify Zone assignment |
| Call connects but no audio | NAT/firewall | Check media ports |
| PSTN rejection | Provider trunk down | Contact Tata/Airtel |
| Caller ID wrong | LGW dial-peer | Check calling party transform |

### 8.6.6 Inbound DID Issues

**Procedure: Troubleshoot DID Not Ringing**

| Step | Check | Action |
|------|-------|--------|
| 1 | DID assigned to user? | Control Hub -> Numbers |
| 2 | User phone registered? | Device status |
| 3 | DID active with provider? | Provider portal |
| 4 | Number porting complete? | Check porting status |
| 5 | Call forward active? | May be forwarding elsewhere |
| 6 | DND enabled? | User setting |
| 7 | Test from different PSTN | Carrier issue? |

### 8.6.7 Extension Not Ringing

**Procedure: Troubleshoot Extension Issues**

| Step | Check | Action |
|------|-------|--------|
| 1 | Extension assigned? | User -> Calling |
| 2 | Extension unique? | No duplicates |
| 3 | Phone registered? | Device status |
| 4 | Do Not Disturb? | Disable DND |
| 5 | Call forward set? | Check forward settings |
| 6 | Ring setting correct? | Phone audio settings |
| 7 | Webex App signed in? | May ring App not phone |

### 8.6.8 One-Way Audio

**Procedure: Troubleshoot One-Way Audio**

| Step | Check | Likely Cause |
|------|-------|--------------|
| 1 | Consistent direction? | Inbound vs outbound media |
| 2 | Specific users/locations? | Site-specific issue |
| 3 | Firewall symmetric? | Stateful inspection |
| 4 | NAT configuration | ALG disabled? |
| 5 | Media ports open | UDP 19560-65535 |
| 6 | LGW media binding | Check bind statements |

**Common Resolutions:**

| Cause | Resolution |
|-------|------------|
| Firewall blocking media | Open UDP 19560-65535 outbound |
| SIP ALG enabled | Disable SIP ALG on firewall |
| NAT issue on LGW | Verify media bind interface |
| QoS dropping packets | Check QoS policy |

### 8.6.9 Choppy/Robotic Audio

**Procedure: Troubleshoot Audio Quality**

| Step | Check | Tool |
|------|-------|------|
| 1 | Check call quality metrics | Control Hub Analytics |
| 2 | MOS score for call | Call details |
| 3 | Jitter values | Should be <30ms |
| 4 | Packet loss | Should be <1% |
| 5 | Network path | Traceroute to Webex |
| 6 | Local network congestion | Switch/router utilization |
| 7 | QoS applied? | Check DSCP marking |
| 8 | WiFi vs wired | WiFi more prone to issues |

**Quality Resolution Matrix:**

| Metric Issue | Likely Cause | Resolution |
|--------------|--------------|------------|
| High jitter | Network congestion | QoS prioritization |
| High latency | Long path / congestion | Review routing |
| Packet loss | Congestion / errors | Check interface errors |
| Low MOS | Combination above | Comprehensive review |

### 8.6.10 Echo Issues

**Procedure: Troubleshoot Echo**

| Step | Check | Resolution |
|------|-------|------------|
| 1 | Which end hears echo? | Echo is at OTHER end |
| 2 | Speakerphone in use? | Use handset or headset |
| 3 | Headset quality? | Replace if poor quality |
| 4 | Phone volume too high? | Reduce speaker volume |
| 5 | Acoustic environment? | Add dampening |
| 6 | LGW echo cancellation | Enable `echo-cancel` |

### 8.6.11 Voicemail Issues

**Procedure: Troubleshoot Voicemail**

| Step | Check | Action |
|------|-------|--------|
| 1 | Voicemail enabled? | User -> Calling -> Voicemail |
| 2 | User knows PIN? | May need reset |
| 3 | Forward to VM working? | Check no-answer forward |
| 4 | VM pilot number correct? | Location settings |
| 5 | VM notification working? | Check email settings |
| 6 | Mailbox full? | Clear old messages |

**Reset Voicemail PIN:**

| Step | Action |
|------|--------|
| 1 | Navigate to Users -> find user |
| 2 | Calling -> Voicemail |
| 3 | Click "Reset PIN" |
| 4 | User receives temporary PIN via email |
| 5 | User must set new PIN on first access |

> **Reference:** https://help.webex.com/article/n5qc5u4 (Voicemail Troubleshooting)

### 8.6.12 Feature Troubleshooting Quick Reference

| Feature | Common Issue | Check |
|---------|--------------|-------|
| Hunt Group | Calls not distributing | Verify members registered |
| Call Park | Cannot retrieve | Park extension range correct? |
| Call Forward | Not forwarding | Feature enabled? Destination valid? |
| BLF | Status not updating | Monitored user registered? |
| Shared Line | Not ringing all | Virtual line assigned to all devices? |
| Call Recording | Not recording | Policy enabled? License assigned? |

---

## 8.7 Incident Management

### 8.7.1 Incident Classification

| Priority | Definition | Response | Resolution |
|----------|------------|----------|------------|
| **P1 - Critical** | Service outage affecting >50 users | 15 min | 4 hours |
| **P2 - High** | Feature outage or >10 users affected | 30 min | 8 hours |
| **P3 - Medium** | Single user or non-critical feature | 2 hours | 24 hours |
| **P4 - Low** | Minor issue, workaround exists | 4 hours | 72 hours |

### 8.7.2 P1 Incident Procedure

**Procedure: Critical Incident Response**

| Step | Action | Owner | Timeline |
|------|--------|-------|----------|
| 1 | Acknowledge alert/report | Help Desk | 0 min |
| 2 | Verify scope of impact | Help Desk | 5 min |
| 3 | Classify as P1 if criteria met | Help Desk | 10 min |
| 4 | Page Voice Engineering Lead | Help Desk | 10 min |
| 5 | Open bridge call | Voice Eng | 15 min |
| 6 | Check Webex status page | Voice Eng | 15 min |
| 7 | If Webex issue: Open Cisco TAC case (Sev 1) | Voice Eng | 20 min |
| 8 | If local issue: Begin troubleshooting | Voice Eng | 20 min |
| 9 | Notify stakeholders | Voice Eng Lead | 30 min |
| 10 | Provide hourly updates | Voice Eng | Ongoing |
| 11 | Document resolution | Voice Eng | Post-incident |
| 12 | Conduct post-incident review | Voice Eng Lead | Within 5 days |

### 8.7.3 Cisco TAC Escalation

**Procedure: Open TAC Case**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to support.cisco.com | Cisco support portal |
| 2 | Login with CCO ID | Linked to contract |
| 3 | Click "Open a Case" | New case |
| 4 | Select Technology: Collaboration | Webex Calling |
| 5 | Select Sub-technology: Webex Calling | Specific product |
| 6 | Set Severity: | |
| | - Severity 1: Network down | P1 |
| | - Severity 2: Severe impact | P2 |
| | - Severity 3: Moderate impact | P3/P4 |
| 7 | Enter problem description | Be specific |
| 8 | Include: | |
| | - Org ID | |
| | - Affected users/devices | |
| | - Timeline of issue | |
| | - Troubleshooting done | |
| 9 | Attach logs if requested | Control Hub exports |
| 10 | Note case number | Reference for follow-up |

**TAC Contact Numbers:**

| Region | Phone |
|--------|-------|
| Americas | +1-800-553-2447 |
| EMEA | +32-2-704-5555 |
| APAC | +61-2-8446-7411 |
| India | 1800-103-5312 |

### 8.7.4 Incident Documentation Template

```
+-----------------------------------------------------------------+
|  INCIDENT REPORT                                                 |
+-----------------------------------------------------------------+
|                                                                 |
|  Incident ID: INC-XXXXXXX                                      |
|  Priority: P1 / P2 / P3 / P4                                   |
|  Status: Open / In Progress / Resolved / Closed                |
|                                                                 |
|  TIMELINE:                                                     |
|  Reported:    YYYY-MM-DD HH:MM                                 |
|  Acknowledged: YYYY-MM-DD HH:MM                                |
|  Resolved:    YYYY-MM-DD HH:MM                                 |
|                                                                 |
|  IMPACT:                                                       |
|  Users Affected: ___                                           |
|  Locations:     ___                                            |
|  Services:      ___                                            |
|                                                                 |
|  DESCRIPTION:                                                  |
|  _______________________________________________               |
|                                                                 |
|  ROOT CAUSE:                                                   |
|  _______________________________________________               |
|                                                                 |
|  RESOLUTION:                                                   |
|  _______________________________________________               |
|                                                                 |
|  PREVENTION:                                                   |
|  _______________________________________________               |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 8.8 Change Management

### 8.8.1 Change Types

| Type | Definition | Approval | Lead Time |
|------|------------|----------|-----------|
| **Standard** | Pre-approved, low risk | None | Same day |
| **Normal** | Scheduled, assessed risk | CAB | 5 business days |
| **Emergency** | Urgent, to fix P1/P2 | Emergency CAB | Immediate |

### 8.8.2 Standard Changes (Pre-Approved)

| Change | Procedure | Owner |
|--------|-----------|-------|
| Add new user | 8.2.4 | Help Desk |
| Remove user | 8.2.5 | Help Desk |
| Add/remove phone | 6.6 | Help Desk |
| Change user extension | 8.2.6 | Help Desk |
| Reset voicemail PIN | 8.6.11 | Help Desk |
| Update call forward | User self-service | User |
| Add hunt group member | Voice Eng | Voice Eng |

### 8.8.3 Normal Change Process

**Procedure: Submit Change Request**

| Step | Action | Owner |
|------|--------|-------|
| 1 | Submit change in ServiceNow | Requestor |
| 2 | Include: Description, Impact, Rollback | Requestor |
| 3 | Risk assessment | Voice Eng |
| 4 | Schedule maintenance window | Voice Eng |
| 5 | CAB review and approval | CAB |
| 6 | Notify affected users | Comms |
| 7 | Implement change | Voice Eng |
| 8 | Validate change | Voice Eng |
| 9 | Close change record | Voice Eng |

---

## 8.9 Compliance & Reporting

### 8.9.1 India Toll Bypass Compliance

**Procedure: Monthly Compliance Audit**

| Step | Action | Owner |
|------|--------|-------|
| 1 | Export CDRs from Control Hub | Voice Eng |
| 2 | Filter PSTN calls originating from India | Voice Eng |
| 3 | Verify Zone matches call origin | Voice Eng |
| 4 | Identify any routing violations | Voice Eng |
| 5 | Investigate violations | Voice Eng |
| 6 | Document findings | Compliance |
| 7 | Remediate any issues | Voice Eng |
| 8 | Submit compliance report | Compliance |

**Compliance Report Template:**

| Metric | Value |
|--------|-------|
| Reporting Period | YYYY-MM |
| Total India PSTN Calls | X,XXX |
| Calls Audited (sample) | XXX |
| Zone Compliance Rate | XX.X% |
| Violations Found | X |
| Violations Remediated | X |

> **Reference:** Chapter 4, Section 4.3 (India Compliance)

### 8.9.2 Call Recording Compliance

**Procedure: Recording Audit**

| Step | Action | Frequency |
|------|--------|-----------|
| 1 | Verify recording policies active | Weekly |
| 2 | Sample recorded calls | Monthly |
| 3 | Verify announcement played | Listen to recordings |
| 4 | Verify regional compliance | Per Chapter 4.6 |
| 5 | Check storage retention | Per policy |
| 6 | Document audit results | Compliance report |

### 8.9.3 Monthly Operations Report

**Report Contents:**

| Section | Metrics |
|---------|---------|
| Service Availability | Uptime %, incidents by priority |
| Call Volume | Total calls, by location, by type |
| Call Quality | Average MOS, calls <3.5 MOS |
| PSTN Usage | Minutes by region, costs |
| User Statistics | Total users, adds, removes |
| Device Statistics | Total devices, firmware compliance |
| Incidents | Count by priority, MTTR |
| Changes | Count by type, success rate |
| Compliance | Audit results, violations |

---

## 8.10 Quick Reference

### Emergency Contacts

| Situation | Contact | Phone |
|-----------|---------|-------|
| Platform outage | Voice Eng Lead | +91-22-4960-9001 |
| Security incident | Security Team | +91-22-4960-9003 |
| PSTN outage (India) | Tata NOC | 1800-XXX-XXXX |
| PSTN outage (EMEA/US) | IntelePeer | +1-XXX-XXX-XXXX |
| Cisco TAC | support.cisco.com | See 8.7.3 |

### Common URLs

| Resource | URL |
|----------|-----|
| Control Hub | https://admin.webex.com |
| Webex Status | https://status.webex.com |
| User Settings | https://settings.webex.com |
| Cisco TAC | https://support.cisco.com |
| Webex Help | https://help.webex.com |

### Key Control Hub Paths

| Task | Navigation |
|------|------------|
| User management | Users -> Manage Users |
| Device management | Devices |
| Call analytics | Analytics -> Calling |
| PSTN status | Calling -> PSTN |
| Troubleshooting | Troubleshooting -> Diagnostics |
| Alerts | Alerts Center |
| Audit logs | Account -> Audit Logs |

### Daily Checklist

- [ ] Check status.webex.com
- [ ] Review Control Hub alerts
- [ ] Review call quality (MOS <3.5)
- [ ] Process user requests
- [ ] Check LGW status (India)
- [ ] Review help desk tickets
- [ ] Update shift log

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 4 | Compliance requirements |
| Chapter 5 | Network troubleshooting |
| Chapter 6 | Configuration procedures |
| Chapter 7 | Migration procedures (rollback) |
| Cisco Help | https://help.webex.com/article/ni3wlvw (Alerts) |
| Cisco Help | https://help.webex.com/article/nkgc89t (Analytics) |
| Cisco Help | https://help.webex.com/article/n2wfv0j (Troubleshooting) |

---

*End of Chapter 8: Operations & Day 2*

---
