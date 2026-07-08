# 5.6 Incident Management

### 5.6.1 Incident Classification

| Category | Sub-Category | Priority | SLA Response | SLA Resolve |
|----------|--------------|----------|--------------|-------------|
| Fabric | Site down | P1 | 15 min | 2 hours |
| Fabric | Node failure | P2 | 30 min | 4 hours |
| Authentication | Mass auth failure | P1 | 15 min | 2 hours |
| Authentication | User auth issue | P3 | 2 hours | 8 hours |
| Connectivity | Cross-site | P2 | 30 min | 4 hours |
| Connectivity | Local segment | P3 | 2 hours | 8 hours |
| Performance | Degradation >50% | P2 | 30 min | 4 hours |
| Performance | Minor degradation | P4 | 4 hours | 24 hours |
| Security | SGT bypass | P1 | 15 min | 2 hours |
| Security | Policy violation | P3 | 2 hours | 8 hours |

### 5.6.2 Incident Response Workflow

```
+------------------------------------------------------------------+
|                    INCIDENT RESPONSE WORKFLOW                     |
+------------------------------------------------------------------+

    [Alert Triggered]
           |
           v
    +-------------+
    | Detection   |---> Is this a real issue?
    | & Triage    |     NO: Close as false positive
    +-------------+
           | YES
           v
    +-------------+
    | Classify    |---> Assign Priority (P1-P4)
    | & Assign    |     Assign to appropriate team
    +-------------+
           |
           v
    +-------------+
    | Investigate |---> Gather diagnostic data
    |             |     Identify root cause
    +-------------+
           |
           v
    +-------------+
    | Resolve     |---> Implement fix
    |             |     Verify resolution
    +-------------+
           |
           v
    +-------------+
    | Close &     |---> Update knowledge base
    | Document    |     Create RCA (if P1/P2)
    +-------------+
```

### 5.6.3 Incident Response Procedures

**P1 Incident - Fabric Site Down**

```
INCIDENT: FABRIC SITE DOWN
Priority: P1
SLA: 2 hours to resolve

STEP 1: Initial Assessment (0-5 minutes)
- Identify affected site from DNAC Assurance
- Determine scope: Full site or partial
- Check recent changes in change log
- Notify stakeholders via incident bridge

STEP 2: Diagnostics (5-15 minutes)
- Check Border Node status
  show lisp site
  show vxlan tunnel
  show isis neighbors
  
- Check Control Plane status
  show lisp session
  
- Check underlay connectivity
  ping <loopback_addresses> source Loopback0
  
- Check ISE PSN connectivity
  show radius server-group RADIUS-GROUP
  
STEP 3: Isolation (15-30 minutes)
- Identify failed component(s)
- Check hardware status (fans, power, temperature)
- Check interface status
- Review syslog for errors

STEP 4: Resolution (30-120 minutes)
Option A: Hardware failure
  - Failover to redundant node (if available)
  - Initiate RMA process
  
Option B: Software issue
  - Reload affected device
  - Roll back recent configuration change
  
Option C: Connectivity issue
  - Fix underlay routing issue
  - Repair physical link
  
STEP 5: Verification
- Confirm LISP registrations restored
- Verify VXLAN tunnels established
- Test user authentication
- Confirm application connectivity

STEP 6: Post-Incident
- Complete incident ticket
- Schedule RCA within 24 hours
- Update runbook if new scenario
```

**P2 Incident - Authentication Failure**

```
INCIDENT: MASS AUTHENTICATION FAILURE
Priority: P2
SLA: 4 hours to resolve

STEP 1: Scope Assessment
- Check ISE live logs for failure patterns
- Identify affected:
  - Site(s)
  - Authentication method (dot1x, MAB)
  - User type (employees, guests, devices)

STEP 2: ISE Diagnostics
# On ISE GUI:
Operations > RADIUS > Live Logs
Filter: Status = Failed
Group by: Failure Reason

# Common failure reasons:
- 5400: Authentication failed (check AD)
- 22028: Authentication timeout (check PSN)
- 24408: User not found (check identity source)
- 12302: Unknown NAS (check RADIUS clients)

STEP 3: Resolution based on cause
Cause: ISE PSN overloaded
  - Check PSN CPU/memory
  - Redistribute load across node group
  - Add temporary PSN capacity

Cause: AD connectivity
  - Test AD connectivity from ISE
  - Check AD domain controller health
  - Verify service account credentials

Cause: Certificate issue
  - Check certificate validity
  - Verify certificate trust chain
  - Renew if expired

Cause: Policy misconfiguration
  - Review recent policy changes
  - Roll back to previous working policy
  - Test with policy evaluation tool

STEP 4: Verification
- Monitor live logs for successful auths
- Confirm auth success rate >99%
- Test sample users from affected scope
```

### 5.6.4 Root Cause Analysis Template

```markdown
# ROOT CAUSE ANALYSIS (RCA)

**Problem Statement:** [Describe what failed and user impact]

**Timeline:**
- [Time]: [Event]

**Root Cause:** [Technical root cause]

**Contributing Factors:** [List factors]

**Resolution:** [Steps taken to resolve]

**Preventive Actions:** [Changes to prevent recurrence]
```
