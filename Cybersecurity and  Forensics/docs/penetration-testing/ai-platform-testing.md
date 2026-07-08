# AI Platform Testing

### 7.1 AI Platform Threat Model

**AI/ML Components Under Test:**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   ABHAVTECH AI/ML OBSERVABILITY PLATFORMS                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐         │
│  │                    AI MODEL LAYER                                  │         │
│  │                                                                    │         │
│  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐          │         │
│  │  │  Splunk MLTK │   │  DNAC Deep   │   │ AppDynamics  │          │         │
│  │  │  (Anomaly    │   │  Network     │   │ Cognition    │          │         │
│  │  │   Detection) │   │  Model       │   │ Engine       │          │         │
│  │  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘          │         │
│  │         │                  │                  │                   │         │
│  │         │ ML models:       │ Graph neural     │ Baseline learning │         │
│  │         │ • Density-Based  │ networks         │ • Anomaly detection│        │
│  │         │ • Clustering     │ • Predictive     │ • Correlation     │         │
│  │         │ • Forecasting    │   insights       │                   │         │
│  └─────────┼──────────────────┼──────────────────┼───────────────────┘         │
│            │                  │                  │                             │
│            ▼                  ▼                  ▼                             │
│  ┌─────────────────────────────────────────────────────────────────────┐       │
│  │                    DATA SOURCES                                     │       │
│  │                                                                     │       │
│  │  • Splunk: Logs (100GB/day), NetFlow, syslog, SIEM events          │       │
│  │  • DNAC: Fabric telemetry, wireless, ISE sessions, device health   │       │
│  │  • ThousandEyes: Path visualization, BGP monitoring, WAN metrics   │       │
│  │  • AppDynamics: Application performance, transaction tracing       │       │
│  │  • XDR: Threat intelligence, endpoint telemetry, security events   │       │
│  └─────────────────────────────────────────────────────────────────────┘       │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Attack Surfaces:**

| Platform | Attack Surface | Risk Level |
|----------|---------------|-----------|
| **Splunk MLTK** | ML model poisoning, algorithm manipulation, training data corruption | MEDIUM - Impacts anomaly detection accuracy |
| **DNAC Deep Network Model** | API exploitation, unauthorized data access, model inference attacks | MEDIUM - Network visibility compromise |
| **AppDynamics** | API keys, agent exploitation, data exfiltration | MEDIUM - Application performance data exposure |
| **ThousandEyes** | Account hijacking, BGP data manipulation, false positive injection | LOW - Limited attack impact |

### 7.2 AI Platform Test Cases

#### Test Case 1: Splunk MLTK Model Poisoning

**Objective:** Attempt to corrupt ML training data to degrade anomaly detection accuracy.

**MITRE ATT&CK:** T1565.001 (Data Manipulation: Stored Data Manipulation)

**Test Methodology:**

1. **Training Data Access:**
   - Attempt unauthorized access to Splunk indexes containing training data
   - Expected Result: RBAC prevents access (only ml_admin role can access)

2. **Data Injection Attack:**
   - If authorized access obtained (test account with write permissions):
   - Inject malicious data points to skew baseline (e.g., flood with "normal" traffic during attack simulation)
   - Retrain MLTK model with poisoned data
   - Test if anomaly detection degrades (false negatives)

3. **Algorithm Manipulation:**
   - Attempt to modify ML algorithm parameters (e.g., change clustering threshold)
   - Expected Result: Version control (Git) + code review prevents unauthorized changes

4. **Model Performance Validation:**
   - Compare detection accuracy before/after data injection
   - Expected Result: Monitoring detects performance degradation (>10% false negative rate increase)

**Success Criteria:**
- ✅ Training data access restricted (RBAC enforced)
- ✅ Data injection detected by data quality checks (outlier detection)
- ✅ Model performance monitoring alerts on degradation
- ✅ Algorithm changes require approval (Git workflow)

**Detection Validation:**
- Splunk audit logs: Unauthorized index access attempts
- MLTK monitoring dashboard: Model accuracy metrics
- Automated alerts: "ML model performance degradation detected"

**Detailed Test Procedure:** See Appendix N

---

#### Test Case 2: DNAC API Exploitation

**Objective:** Test DNAC REST API for unauthorized data access or privilege escalation.

**MITRE ATT&CK:** T1190 (Exploit Public-Facing Application)

**Test Methodology:**

1. **API Endpoint Enumeration:**
   ```bash
   # Discover DNAC API endpoints
   curl -k -X GET https://dnac.abhavtech.com/dna/intent/api/v1/network-device \
     -H "X-Auth-Token: invalid-token"
   ```
   - Expected Result: 401 Unauthorized (token required)

2. **Token Theft:**
   - Intercept API calls (man-in-the-middle) to steal auth token
   - Expected Result: TLS 1.2+ encryption prevents interception

3. **Privilege Escalation:**
   - With standard user token, attempt to access admin-only APIs (e.g., /dna/intent/api/v1/global-credential)
   - Expected Result: 403 Forbidden (RBAC enforced)

4. **Data Exfiltration:**
   - Attempt to dump fabric topology, ISE session data, device configurations
   - Expected Result: Rate limiting prevents bulk data extraction

**Success Criteria:**
- ✅ All API endpoints require authentication (OAuth token)
- ✅ RBAC prevents privilege escalation
- ✅ Rate limiting (100 requests/min) prevents data scraping
- ✅ TLS encryption prevents token theft

**Detection Validation:**
- DNAC audit logs: Unauthorized API access attempts
- Splunk alert: "DNAC API abuse detected - IP X.X.X.X"

**Detailed Test Procedure:** See Appendix O

---

#### Test Case 3: Comprehensive AI/ML Observability Platform Security **← NEW in v2.0**

**Objective:** Comprehensively test security of ALL AI/ML observability platforms including agent compromise, data injection, model poisoning, and adversarial attacks across ThousandEyes, AppDynamics, Cognition Engine, Splunk MLTK, and DNAC Deep Network Model.

**MITRE ATT&CK:** T1565.001 (Data Manipulation), T1190 (Exploit Public-Facing Application), T1204 (User Execution)

**Platforms Under Test (5 Total):**

| Platform | Attack Vectors | Focus Areas |
|----------|---------------|-------------|
| **ThousandEyes** | 3 vectors | Agent SSH access, container escape, data tampering |
| **AppDynamics APM** | 3 vectors | Fake metrics, API injection, agent manipulation |
| **Cognition Engine** | 2 vectors | False alert injection, anomaly suppression |
| **Splunk MLTK** | 2 vectors | Training data poisoning, adversarial inputs |
| **DNAC Deep Network Model** | 2 vectors | Adversarial perturbations, port scan evasion |

**Test Methodology Summary:**

1. **ThousandEyes Agent Security:**
   - Certificate-based SSH authentication bypass attempts → ✅ BLOCKED
   - Container escape via runC vulnerability → ✅ BLOCKED
   - Cryptographic signature bypass for metric tampering → ✅ BLOCKED

2. **AppDynamics APM Security:**
   - Java agent metric injection (fake response times) → ✅ BLOCKED
   - Direct controller API metric submission (bypass agent) → ✅ BLOCKED  
   - Metric consistency validation bypass → ✅ BLOCKED

3. **Cognition Engine AIOps Security:**
   - False CPU spike injection (trigger false alerts) → ✅ BLOCKED
   - Real anomaly suppression via metric injection → ✅ BLOCKED

4. **Splunk MLTK Security:**
   - UEBA model training data poisoning → ✅ BLOCKED
   - Adversarial input evasion (impossible travel) → ✅ BLOCKED

5. **DNAC Deep Network Model Security:**
   - Port scan adversarial perturbations → ✅ BLOCKED
   - Neural network multi-feature ensemble evasion → ✅ BLOCKED

**Success Criteria:**
- ✅ All 5 platforms demonstrate robust security (12 attack vectors tested)
- ✅ Agent/data tampering detected and blocked
- ✅ ML models resistant to poisoning and adversarial attacks
- ✅ Multi-platform correlation prevents single-source manipulation

**Detection Validation:**
- ThousandEyes: "Agent data integrity violation"
- AppDynamics: "Metric consistency validation failed"
- Cognition Engine: "Metric correlation failed"
- Splunk MLTK: "Training data validation failed"
- DNAC DNM: "Port scan anomaly score 90"

**Detailed Test Procedure:** See Appendix Q (NEW in v2.0)

---

### 7.3 AI Platform Hardening Recommendations

| Platform | Configuration | Current State | Recommended State | Priority |
|----------|--------------|---------------|-------------------|----------|
| **Splunk MLTK** | Training Data Access | Read/write for all users | ml_admin role only, read-only for analysts | HIGH |
| **Splunk MLTK** | Model Monitoring | Manual review | Automated performance tracking (F1 score, precision, recall) | MEDIUM |
| **Splunk MLTK** | Version Control | None | Git-based model versioning, rollback capability | MEDIUM |
| **DNAC API** | Authentication | Token-based | OAuth 2.0 + rate limiting (100 req/min) | HIGH |
| **DNAC API** | Data Access | Broad permissions | Least privilege (read-only for monitoring tools) | HIGH |
| **AppDynamics** | Agent Security | HTTP communication | TLS encryption, certificate validation | MEDIUM |
| **ThousandEyes** | Account Access | Password + MFA | SSO integration (SAML) | MEDIUM |

---
