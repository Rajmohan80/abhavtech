# Social Engineering

### 8.1 Social Engineering Testing

**Objective:** Test human defenses against social engineering attacks.

**MITRE ATT&CK:** T1566 (Phishing), T1598 (Phishing for Information)

#### Test Case 1: Phishing Campaign

**Methodology:**

1. **Email Phishing:**
   - Send simulated phishing emails to 200 random users
   - Email types:
     - **Credential Harvesting:** Fake Microsoft login page
     - **Malware Attachment:** Fake invoice PDF (benign test file)
     - **CEO Fraud (BEC):** Urgent wire transfer request from "CFO"
   
2. **Metrics Tracked:**
   - Email open rate (how many users opened email)
   - Click-through rate (how many clicked malicious link)
   - Credential submission rate (how many entered credentials on fake page)
   - Reporting rate (how many reported to IT/Security)

3. **Success Criteria:**
   - Click-through rate <5% (industry avg: 15-20%)
   - Credential submission rate <2%
   - Reporting rate >70%

**Remediation:**
- Users who click: Mandatory security awareness training
- Users who submit credentials: Manager notification + immediate password reset

---

#### Test Case 2: Vishing (Voice Phishing)

**Methodology:**

1. **IT Helpdesk Impersonation:**
   - Call random users pretending to be IT helpdesk
   - Request user to provide credentials or install "remote support software"
   
2. **CEO Impersonation:**
   - Call finance department pretending to be CEO
   - Request urgent wire transfer (test case, no actual transfer)

3. **Success Criteria:**
   - Users verify caller identity (call back to official number)
   - Users refuse to provide credentials over phone
   - Users report suspicious calls to security team

---

#### Test Case 3: Physical Security (Badge Cloning)

**Methodology:**

1. **Tailgating Test:**
   - Red team member follows authorized employee through secure door
   - Test if employees challenge unauthorized person

2. **Badge Cloning:**
   - With authorization, clone employee badge (RFID/NFC)
   - Attempt to access secure areas

3. **Success Criteria:**
   - Employees challenge tailgaters >80% of the time
   - Badge cloning prevented by encrypted badges (DESFire EV2)
   - Physical security cameras + badge logs detect unauthorized access

---

### 8.2 Social Engineering Hardening Recommendations

| Control | Current State | Recommended State | Priority |
|---------|--------------|-------------------|----------|
| **Security Awareness Training** | Annual training | Quarterly training + monthly phishing simulations | HIGH |
| **Email Security** | Secure Email (92% detection) | Add DMARC/DKIM/SPF validation, external sender warnings | HIGH |
| **Caller ID Verification** | No verification | IT Helpdesk uses callback verification for sensitive requests | MEDIUM |
| **Physical Badges** | RFID (125kHz) | Upgrade to NFC DESFire EV2 (encrypted, anti-cloning) | MEDIUM |
| **Visitor Management** | Paper logbook | Digital visitor management (photo, escort requirements) | LOW |

---
