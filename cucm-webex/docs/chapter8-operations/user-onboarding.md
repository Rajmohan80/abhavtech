# User Onboarding

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

