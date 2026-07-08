# 3.4.7 Change of Authorization (CoA) Workflow Examples

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. CoA Overview

### 1.1 CoA Types

| CoA Type | RFC | Purpose | Use Case |
|----------|-----|---------|----------|
| **Session Terminate** | RFC 5176 | Disconnect user immediately | Security incident |
| **Session Reauthenticate** | RFC 5176 | Force re-authentication | Policy change |
| **Port Bounce** | Cisco | Reset port | VLAN change |
| **Port Disable** | Cisco | Administratively disable | Quarantine |
| **CoA Push** | Cisco | Update session attributes | SGT change |

### 1.2 CoA Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                       CoA Message Flow                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────┐         ┌─────────┐         ┌─────────┐              │
│   │   ISE   │────────►│ Switch  │────────►│Endpoint │              │
│   │   PSN   │  CoA    │  (NAD)  │  Action │         │              │
│   └─────────┘ Request └─────────┘         └─────────┘              │
│        │                   │                   │                    │
│        │    CoA-Request    │                   │                    │
│        │ (Session-Terminate│                   │                    │
│        │  or Reauthenticate)                   │                    │
│        │──────────────────►│                   │                    │
│        │                   │                   │                    │
│        │                   │   Disconnect      │                    │
│        │                   │──────────────────►│                    │
│        │                   │                   │                    │
│        │                   │   (Reconnect)     │                    │
│        │                   │◄──────────────────│                    │
│        │                   │                   │                    │
│        │  CoA-ACK          │   New Auth        │                    │
│        │◄──────────────────│──────────────────►│                    │
│        │                   │                   │                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Real-World CoA Workflows

### 2.1 Workflow: Security Incident - Quarantine Endpoint

**Scenario:** XDR detects malware on endpoint. Automatically quarantine.

```yaml
Workflow_Quarantine_Malicious_Endpoint:
  
  Trigger: XDR threat score >= 90
  
  Step_1_XDR_Detection:
    Event: Malware detected on 10.100.10.150
    Endpoint MAC: AA:BB:CC:DD:EE:FF
    User: jsmith@abhavtech.com
    Threat Score: 95
    
  Step_2_XDR_to_ISE_Integration:
    pxGrid: XDR sends threat context to ISE
    ISE Action: Threat-Centric NAC evaluates
    Decision: Quarantine required
    
  Step_3_ISE_CoA_Execution:
    ISE Console Path: Operations → Adaptive Network Control → Quarantine
    
    Automatic via API:
      POST /admin/API/mnt/CoA/Disconnect/{macAddress}
      
    Or Manual:
      - Search endpoint by MAC
      - Select "Quarantine"
      - Reason: "XDR Malware Detection"
      
  Step_4_CoA_Message:
    Type: Reauthenticate + Authorization Change
    New Authorization Profile: QUARANTINE-PROFILE
    Attributes:
      - VLAN: 999 (Quarantine)
      - SGT: 999 (Quarantine)
      - dACL: QUARANTINE-DACL
      - URL Redirect: remediation.abhavtech.com
      
  Step_5_Switch_Action:
    Switch: MUM-ED-01
    Port: Gi1/0/15
    Actions:
      - Apply QUARANTINE-DACL
      - Change VLAN to 999
      - Redirect HTTP to remediation portal
      
  Step_6_User_Experience:
    - User loses network access
    - Browser redirects to: https://remediation.abhavtech.com
    - Message: "Your device has been quarantined due to security threat"
    - Instructions: Contact IT Security
    
  Step_7_SOC_Notification:
    - PagerDuty alert: P1 Security Incident
    - ServiceNow ticket created
    - Email to soc@abhavtech.com
```

### 2.2 Workflow: Posture Non-Compliance

**Scenario:** Endpoint fails posture check (missing patches). Limit access.

```yaml
Workflow_Posture_NonCompliance:
  
  Trigger: Posture assessment fails
  
  Step_1_Initial_Authentication:
    User: mwilliams@abhavtech.com
    MAC: 11:22:33:44:55:66
    Initial Auth: SUCCESS
    Posture Status: PENDING
    Initial Profile: POSTURE-REDIRECT
    
  Step_2_Posture_Assessment:
    Secure Client checks:
      - [ ] Antivirus updated: FAIL (definitions 14 days old)
      - [ ] Windows patches: FAIL (KB5034441 missing)
      - [ ] Firewall enabled: PASS
      - [ ] Disk encryption: PASS
    Result: NON-COMPLIANT
    
  Step_3_ISE_Policy_Decision:
    Policy: "Posture_NonCompliant_Limited"
    Action: CoA with limited access profile
    
  Step_4_CoA_Execution:
    CoA Type: Session Reauthenticate
    New Profile: LIMITED-ACCESS-PROFILE
    Attributes:
      - VLAN: 10 (same - no VLAN change)
      - SGT: 997 (Non-Compliant)
      - dACL: LIMITED-INTERNET-ONLY
      - URL Redirect: posture-remediation.abhavtech.com
      
  Step_5_Limited_Access:
    Permitted:
      - Internet access (for updates)
      - Windows Update servers
      - Antivirus update servers
      - DNS
    Blocked:
      - Internal corporate resources
      - File shares
      - Internal applications
      
  Step_6_Remediation_Portal:
    URL: https://posture-remediation.abhavtech.com
    Shows:
      - "Your device is non-compliant"
      - Missing: Antivirus update, Windows patch KB5034441
      - "Click to remediate automatically"
      - Secure Client triggers remediation
      
  Step_7_Re-Posture_After_Fix:
    User fixes issues → Secure Client re-checks
    Result: COMPLIANT
    ISE: Automatic CoA to full access
    New Profile: EMPLOYEE-FULL-ACCESS
    SGT: 10 (Employee)
```

### 2.3 Workflow: Employee Termination

**Scenario:** HR terminates employee. Immediate network access revocation.

```yaml
Workflow_Employee_Termination:
  
  Trigger: HR system notifies ISE of termination
  
  Step_1_HR_Integration:
    Source: Workday HR system
    Event: Employee termination - John Smith
    Username: jsmith@abhavtech.com
    Effective: Immediate
    
  Step_2_AD_Account_Disable:
    Automatic: AD account disabled
    ISE: Receives AD sync update
    
  Step_3_Active_Session_Identification:
    ISE Query: All active sessions for jsmith
    Results:
      - Session 1: Laptop, MUM-ED-05 Gi1/0/23, MAC: AA:BB:CC:11:22:33
      - Session 2: Phone, MUM-ED-05 Gi1/0/24, MAC: AA:BB:CC:11:22:34
      - Session 3: Wireless, MUM-WLC-01, MAC: AA:BB:CC:11:22:35
      
  Step_4_CoA_All_Sessions:
    ISE: Send CoA to all NADs
    CoA Type: Session Terminate (disconnect immediately)
    
    API Call (for automation):
      POST /admin/API/mnt/CoA/Disconnect/jsmith@abhavtech.com
      Body: { "command": "Terminate", "reason": "Employee Termination" }
      
  Step_5_Switch_Actions:
    MUM-ED-05: Disconnects ports Gi1/0/23, Gi1/0/24
    MUM-WLC-01: Deauthenticates wireless client
    
  Step_6_Prevent_Reconnection:
    AD: Account disabled - auth will fail
    ISE: Logs attempt as "User Disabled in AD"
    
  Step_7_Audit_Trail:
    ISE Log: "Session terminated - Employee Termination"
    SIEM: Alert logged for compliance
    HR System: Confirmation of access revocation
```

### 2.4 Workflow: VLAN Change (No Reauth)

**Scenario:** Network team needs to move endpoints to new VLAN without disruption.

```yaml
Workflow_VLAN_Change:
  
  Trigger: Planned VLAN migration for Building A
  
  Step_1_Update_ISE_Policy:
    Authorization Profile: BUILDING-A-EMPLOYEES
    Old VLAN: 10
    New VLAN: 110
    Save profile
    
  Step_2_CoA_Push_New_Attributes:
    Target: All endpoints in Building A
    Filter: Location = "Building A"
    CoA Type: CoA Push (no disconnect)
    
  Step_3_Bulk_CoA_Execution:
    ISE Console: Operations → Troubleshoot → Endpoint Debug
    Select all Building A endpoints
    Action: "Reauthenticate"
    
    Or via API:
      POST /admin/API/mnt/CoA/Reauth
      Body: {
        "filter": "Location:Building-A",
        "command": "Reauthenticate"
      }
      
  Step_4_Switch_Behavior:
    Switch receives CoA-Reauthenticate
    Triggers new RADIUS authentication
    Gets new VLAN assignment (110)
    Applies new VLAN without bouncing port
    
  Step_5_User_Experience:
    - Minimal disruption (TCP sessions may reset)
    - IP address changes (DHCP in new VLAN)
    - User may notice brief connectivity blip
    
  Step_6_Verification:
    ISE: Check endpoints have new VLAN
    Switch: "show authentication sessions interface GiX/X/X"
    Confirm: VLAN = 110
```

---

## 3. CoA Configuration

### 3.1 ISE CoA Settings

```
Administration → Network Resources → Network Devices → [Device]

RADIUS Authentication Settings:
  ☑ Enable Change of Authorization (CoA)
  CoA Port: 1700 (default)
  
Device Profile:
  ☑ Cisco (default)
  
Advanced Settings:
  ☑ RADIUS Dynamic Authorization
```

### 3.2 Switch CoA Configuration

```
! Enable CoA on Catalyst 9300

aaa server radius dynamic-author
 client 10.250.10.21 server-key $RadiusKey$
 client 10.250.10.22 server-key $RadiusKey$
 port 1700
 auth-type any

! Enable CoA for 802.1X
dot1x system-auth-control

! Interface configuration
interface GigabitEthernet1/0/1
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
```

### 3.3 CoA Verification Commands

```
! Check CoA statistics
show aaa servers | include CoA

! Check recent CoA events
show authentication sessions | include CoA

! Debug CoA (use sparingly)
debug radius
debug aaa coa

! Check specific session
show authentication sessions interface Gi1/0/15 details
```

---

## 4. ISE Authorization Profiles for CoA

### 4.1 Quarantine Profile

```
Profile Name: QUARANTINE-PROFILE

Access Type: ACCESS_ACCEPT

Common Tasks:
  VLAN: 999
  
Advanced Attributes:
  cisco-av-pair = cts:security-group-tag=0999-00
  cisco-av-pair = url-redirect-acl=QUARANTINE-REDIRECT-ACL
  cisco-av-pair = url-redirect=https://remediation.abhavtech.com/quarantine
  
DACL: QUARANTINE-DACL
  permit udp any any eq 53
  permit tcp any host 10.250.10.100 eq 443
  deny ip any any log
```

### 4.2 Limited Access Profile (Posture Remediation)

```
Profile Name: LIMITED-ACCESS-PROFILE

Access Type: ACCESS_ACCEPT

Common Tasks:
  VLAN: (no change - use current)
  
Advanced Attributes:
  cisco-av-pair = cts:security-group-tag=0997-00
  cisco-av-pair = url-redirect-acl=POSTURE-REDIRECT-ACL
  cisco-av-pair = url-redirect=https://posture.abhavtech.com
  
DACL: LIMITED-INTERNET-DACL
  permit udp any any eq 53
  permit tcp any any eq 80
  permit tcp any any eq 443
  permit tcp any host 10.250.10.50 eq 8443   ! Posture server
  deny ip any 10.0.0.0 0.255.255.255 log     ! Block internal
  permit ip any any
```

---

## 5. Troubleshooting CoA

### 5.1 Common CoA Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| CoA not received | Firewall blocking UDP 1700 | Open port from ISE to switches |
| CoA NAK | Wrong shared secret | Verify RADIUS key matches |
| Session not found | Session ID mismatch | Use MAC-based CoA instead |
| VLAN not changing | Switch not supporting | Check IOS version, enable DAI |
| URL redirect fails | dACL not applied | Verify dACL configured on switch |

### 5.2 CoA Debug Procedure

```yaml
CoA_Troubleshooting:
  
  Step_1_Verify_ISE_Sending:
    ISE: Operations → RADIUS → Live Logs
    Filter: CoA
    Look for: "CoA Request sent"
    
  Step_2_Check_Switch_Receiving:
    Switch: debug radius
    Look for: "CoA received from [ISE IP]"
    
  Step_3_Check_Switch_Response:
    Switch log: "CoA-ACK" = success
    Switch log: "CoA-NAK" = failure (check reason)
    
  Step_4_Verify_Session_Updated:
    Switch: show authentication sessions interface GiX/X/X
    Confirm new VLAN/dACL applied
    
  Step_5_Check_ISE_Confirmation:
    ISE: Live Logs
    Look for: "CoA Acknowledgement received"
```

---

## 6. Automation Scripts

### 6.1 Python Script: Quarantine Endpoint

```python
#!/usr/bin/env python3
# /opt/abhavtech/scripts/quarantine_endpoint.py

import requests
import sys

ISE_HOST = "ise-pan.abhavtech.com"
ISE_USER = "api-admin"
ISE_PASS = "********"

def quarantine_endpoint(mac_address, reason):
    """Send CoA to quarantine an endpoint"""
    
    url = f"https://{ISE_HOST}:9060/ers/config/ancendpoint"
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    payload = {
        "OperationAdditionalData": {
            "additionalData": [
                {"name": "macAddress", "value": mac_address},
                {"name": "policyName", "value": "QUARANTINE"}
            ]
        }
    }
    
    response = requests.put(
        url,
        auth=(ISE_USER, ISE_PASS),
        headers=headers,
        json=payload,
        verify=False
    )
    
    if response.status_code == 204:
        print(f"SUCCESS: Endpoint {mac_address} quarantined")
        print(f"Reason: {reason}")
    else:
        print(f"FAILED: {response.status_code} - {response.text}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: quarantine_endpoint.py <MAC> <reason>")
        sys.exit(1)
    
    quarantine_endpoint(sys.argv[1], sys.argv[2])
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
