# Zero Trust Validation

### 6.1 Zero Trust Testing Framework

**Zero Trust Principles Under Test:**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   ZERO TRUST VALIDATION TEST CASES                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  VERIFY EXPLICITLY (Test Identity & Context)                                    │
│  ══════════════════════════════════════════════════════════════════════════     │
│  ✓ Multi-Factor Authentication (MFA) Bypass Attempts                            │
│  ✓ Stolen Credentials + Impossible Travel Detection                             │
│  ✓ Device Trust Validation (Jailbroken/Rooted Devices)                          │
│  ✓ Certificate Validation (X.509 PKI, Certificate Pinning)                      │
│  ✓ Behavioral Analytics (UEBA) Accuracy                                         │
│                                                                                  │
│  LEAST PRIVILEGED ACCESS (Test Micro-segmentation)                              │
│  ══════════════════════════════════════════════════════════════════════════     │
│  ✓ SGT Policy Bypass (TrustSec Segmentation)                                    │
│  ✓ Firewall Rule Exploitation (FTD Policy Gaps)                                 │
│  ✓ Privilege Escalation (Standard User â†' Admin)                                │
│  ✓ Lateral Movement Detection (East-West Traffic)                               │
│                                                                                  │
│  ASSUME BREACH (Test Detection & Response)                                      │
│  ══════════════════════════════════════════════════════════════════════════     │
│  ✓ XDR Telemetry Coverage (Endpoint, Network, Cloud)                            │
│  ✓ Automated Playbook Execution (Incident Response)                             │
│  ✓ Mean Time to Detect (MTTD) & Respond (MTTR)                                  │
│  ✓ Threat Hunting Effectiveness (Proactive Detection)                           │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Zero Trust Test Cases

#### Test Case 1: Stolen Credentials + MFA Bypass

**Objective:** Test if stolen credentials alone can grant access, or if MFA prevents unauthorized access.

**MITRE ATT&CK:** T1078 (Valid Accounts), T1556.006 (Modify Authentication Process: Multi-Factor Authentication)

**Test Methodology:**

1. **Credential Theft Simulation:**
   - Phishing campaign to harvest credentials (authorized test, limited users)
   - Or use known compromised credentials from breach databases (HaveIBeenPwned)

2. **Login Attempt Without MFA:**
   - Attempt to login to VPN, M365, Salesforce with stolen credentials
   - Expected Result: MFA challenge presented (Duo push notification)

3. **MFA Fatigue Attack:**
   - Send multiple Duo push notifications to user (50+ in short period)
   - Test if user approves out of annoyance
   - Expected Result: User training prevents approval, or Duo rate-limits push requests

4. **MFA Bypass Techniques:**
   - **Session Hijacking:** Steal session cookies after MFA (XSS, browser malware)
   - **Pass-the-Cookie:** Use stolen cookie to bypass MFA
   - Expected Result: Session timeout (30 min), re-authentication required

5. **Impossible Travel Detection:**
   - Login from Mumbai (10.252.1.10) at 10:00 AM IST
   - Login from New York (external IP) at 10:05 AM IST (impossible physical travel)
   - Expected Result: UEBA flags as impossible travel, blocks second login

**Success Criteria:**
- ✅ All logins require MFA (no MFA bypass path)
- ✅ MFA fatigue attack detected (Duo alerts after 10+ rapid push requests)
- ✅ Impossible travel detected within 5 minutes
- ✅ Session hijacking prevented by session timeout + re-authentication

**Detection Validation:**
- Duo Admin Panel: Impossible travel alert
- Splunk correlation: "Impossible travel detected - User: user@abhavtech.com"
- XDR casebook: "Credential theft + MFA bypass attempt"
- Automated response: Account locked, force password reset

**Detailed Test Procedure:** See Appendix K

---

#### Test Case 2: Device Trust Bypass

**Objective:** Test if non-compliant or untrusted devices can access corporate resources.

**MITRE ATT&CK:** T1078 (Valid Accounts), T1601 (Modify System Image)

**Test Methodology:**

1. **Jailbroken iOS Device:**
   - Jailbreak test iPhone (authorized device)
   - Attempt to install Duo Mobile and authenticate
   - Expected Result: Duo Device Health check detects jailbreak, denies access

2. **Rooted Android Device:**
   - Root test Android device
   - Attempt to access corporate resources (VPN, M365)
   - Expected Result: Device trust check fails, access denied

3. **Unmanaged Device:**
   - Use personal laptop (not joined to AD, no AMP agent)
   - Attempt to VPN into corporate network
   - Expected Result: Duo Device Trust check fails (no AMP agent detected)

4. **Certificate Cloning:**
   - Export device certificate from compliant device
   - Attempt to import into non-compliant device
   - Expected Result: Certificate tied to device hardware (TPM), cloning fails

**Success Criteria:**
- ✅ Jailbroken/rooted devices blocked
- ✅ Unmanaged devices blocked (no AMP agent = no trust)
- ✅ Certificate cloning prevented (TPM attestation)

**Detection Validation:**
- Duo Admin Portal: Device trust violation
- Splunk alert: "Non-compliant device access attempt"
- XDR casebook: "Device trust bypass attempt"

**Detailed Test Procedure:** See Appendix L

---

#### Test Case 3: UEBA Detection Validation

**Objective:** Validate User and Entity Behavior Analytics (UEBA) accurately detects anomalous behavior.

**MITRE ATT&CK:** T1087 (Account Discovery), T1083 (File and Directory Discovery)

**Test Methodology:**

1. **Baseline Establishment (Pre-Test Phase):**
   - UEBA must have 90-day baseline for normal user behavior
   - Verify baseline data exists in Splunk UEBA dashboard

2. **Anomaly Injection (Test Phase):**
   - **Unusual Login Time:** User normally logs in 9 AM - 5 PM IST; test login at 3 AM IST
   - **Unusual Data Access:** User normally accesses 10 files/day; test access 1000 files in 1 hour
   - **Unusual Application Usage:** User never uses SQL tools; test launch SQL Server Management Studio
   - **Geographic Anomaly:** User normally in Mumbai; test login from Singapore (VPN)

3. **UEBA Alerting:**
   - Monitor Splunk UEBA dashboard for anomaly alerts
   - Expected Result: Alerts generated within 15-30 minutes

4. **Risk Score Threshold:**
   - Verify user risk score increases (baseline: 0-20, anomaly: 75+)
   - Expected Result: Risk score >75 triggers SOC investigation

**Success Criteria:**
- ✅ UEBA detects all 4 anomaly types
- ✅ Alerts generated within 30 minutes
- ✅ Risk scores accurately reflect severity
- ✅ SOC receives actionable alert (not just log entry)

**Detection Validation:**
- Splunk UEBA: Anomaly alert created
- XDR correlation: "Behavioral anomaly - User: user@abhavtech.com"
- Automated playbook: Increase monitoring, notify manager for review

**Detailed Test Procedure:** See Appendix M

---

### 6.3 Zero Trust Maturity Assessment

| Control Category | Initial (Baseline) | Advanced (Phase 1 Target) | Optimized (Future State) | Current Status |
|-----------------|-------------------|-------------------------|------------------------|---------------|
| **Identity Verification** | Password + 802.1X | MFA all apps, device trust, risk-based auth | Passwordless (FIDO2), continuous auth | **Advanced** ✅ |
| **Device Security** | Basic AV | AMP endpoint protection, device trust (Duo) | EDR, device attestation (TPM) | **Advanced** ✅ |
| **Micro-segmentation** | 15 SGTs, basic policies | 30+ SGTs, FTD SGT-aware, dynamic policies | 50+ SGTs, app-layer segmentation | **Advanced** ✅ |
| **Threat Detection** | FMC + ISE logs | XDR correlated telemetry, UEBA | AI-driven threat hunting, predictive analytics | **Advanced** ✅ |
| **Incident Response** | Manual, 2-4 hours | Automated playbooks, <30 min MTTR | Autonomous response, <5 min MTTR | **Optimized** ⚠️ |
| **Data Protection** | Basic DLP (email) | DLP (email, web, firewall), encryption | Rights management, tokenization | **Advanced** ✅ |

**Overall Zero Trust Maturity Score:** 85/100 (Advanced tier)

---
