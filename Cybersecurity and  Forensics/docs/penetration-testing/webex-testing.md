# Webex Testing

### 5.1 Webex Threat Model

**Architecture Components Under Test:**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  ABHAVTECH WEBEX COLLABORATION ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌────────────────────────────────────────────────────────────────────┐        │
│   │                    WEBEX CLOUD SERVICES                            │        │
│   │                                                                    │        │
│   │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐          │        │
│   │  │  Webex       │   │  Webex       │   │  Webex       │          │        │
│   │  │  Calling     │   │  Meetings    │   │  Contact Ctr │          │        │
│   │  │  (3,200 usr) │   │  (Enterprise)│   │  (175 agents)│          │        │
│   │  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘          │        │
│   │         │                  │                  │                   │        │
│   │         │ SIP Trunk        │ HTTPS            │ HTTPS/SIP        │        │
│   └─────────┼──────────────────┼──────────────────┼───────────────────┘        │
│             │                  │                  │                            │
│             ▼                  ▼                  ▼                            │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │              ON-PREMISES INFRASTRUCTURE                             │      │
│   │                                                                     │      │
│   │  ┌─────────────────┐    ┌─────────────────┐   ┌─────────────────┐ │      │
│   │  │ Expressway-C/E  │    │ CUCM 14.x       │   │ Cisco Unity     │ │      │
│   │  │ (Hybrid)        │    │ (Migration)     │   │ Connection      │ │      │
│   │  │                 │    │                 │   │ (Voicemail)     │ │      │
│   │  │ • Mobile/Remote │    │ • 3,200 phones  │   │                 │ │      │
│   │  │ • B2B Calling   │    │ • SIP trunks    │   │ • Voicemail-to- │ │      │
│   │  │ • MRA           │    │ • Call routing  │   │   Email         │ │      │
│   │  └────────┬────────┘    └────────┬────────┘   └────────┬────────┘ │      │
│   │           │                      │                     │          │      │
│   │           │ SIP/TLS              │ SCCP/SIP            │ SMTP     │      │
│   └───────────┼──────────────────────┼─────────────────────┼──────────┘      │
│               │                      │                     │                  │
│               ▼                      ▼                     ▼                  │
│         Mobile Users            Desk Phones           Email System           │
│         (Remote Access)         (8861, 9971)         (M365 Exchange)         │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Attack Surfaces:**

| Component | Attack Surface | Risk Level |
|-----------|---------------|-----------|
| **Webex Calling** | SIP trunks, call routing, PSTN gateway, toll fraud | HIGH - Financial impact |
| **Webex Meetings** | Meeting IDs, passwords, participant enumeration, zoom-bombing | MEDIUM - Privacy/disruption |
| **Webex Contact Center** | Agent accounts, supervisor access, call recording, PCI compliance | HIGH - Customer data exposure |
| **Expressway-C/E** | Mobile/Remote Access (MRA), B2B calling, certificate trust | MEDIUM - External attack surface |
| **CUCM** | SIP trunks, phone registration, dial plan manipulation, eavesdropping | HIGH - Voice infrastructure |
| **Unity Connection** | Voicemail access, PIN codes, voicemail-to-email | MEDIUM - Information disclosure |

### 5.2 Webex Test Cases

#### Test Case 1: SIP Trunk Hijacking (Toll Fraud)

**Objective:** Attempt to exploit SIP trunk to place unauthorized calls (especially international toll fraud).

**MITRE ATT&CK:** T1499 (Endpoint Denial of Service), T1078 (Valid Accounts)

**Test Methodology:**

1. **SIP Trunk Enumeration:**
   ```bash
   # SIPVicious svmap (enumerate SIP servers)
   svmap 203.0.113.10-20 --verbose
   
   # Expected: SIP trunk IP discovered
   ```

2. **SIP Registration Attempt:**
   - Attempt to register SIP phone/trunk without authentication
   ```bash
   # SIPp (SIP test tool)
   sipp -sn uac -s 918001234567 203.0.113.15:5060 -m 1
   ```
   - Expected Result: SIP registration requires authentication (401 Unauthorized)

3. **Weak Authentication Brute Force:**
   - If SIP digest authentication enabled, attempt password cracking
   ```bash
   # SIPCrack (brute force SIP digest auth)
   sipcrack -w /usr/share/wordlists/rockyou.txt sip-dump.pcap
   ```
   - Expected Result: Strong passwords resist brute force (20+ chars, complex)

4. **Toll Fraud Simulation (CONTROLLED TEST):**
   - If valid credentials obtained (or test account provided), place test call to international number
   - Monitor call detail records (CDR) in CUCM
   - Expected Result: Call restrictions block unauthorized international calls

5. **Dial Plan Exploitation:**
   - Attempt to dial out using special prefixes (9, #, *, etc.) to bypass restrictions
   - Expected Result: Dial plan properly restricts access (partitions, calling search spaces)

**Success Criteria:**
- ✅ SIP trunk requires authentication (no anonymous calls)
- ✅ Strong passwords prevent brute force
- ✅ Call restrictions block unauthorized international destinations
- ✅ Dial plan partitions prevent privilege escalation

**Detection Validation:**
- CUCM CDR: Failed call attempts logged
- Splunk alert: "SIP authentication failures from IP X.X.X.X"
- XDR correlation: "Toll fraud attempt - multiple international call failures"
- Financial monitoring: No unexpected international call charges

**Detailed Test Procedure:** See Appendix H (Note: Actual toll fraud charges avoided by using test destinations or immediate call termination)

---

#### Test Case 2: Webex Meeting ID Enumeration

**Objective:** Attempt to enumerate valid Webex meeting IDs to join unauthorized meetings.

**MITRE ATT&CK:** T1087 (Account Discovery), T1589 (Gather Victim Identity Information)

**Test Methodology:**

1. **Meeting ID Structure Analysis:**
   - Observe meeting ID format (e.g., 123-456-789, 9-digit numeric)
   - Determine if IDs are sequential or random

2. **Brute Force Enumeration:**
   ```bash
   # Simple curl-based enumeration (example)
   for i in {100000000..100001000}; do
     curl -s "https://abhavtech.webex.com/abhavtech/j.php?MTID=$i" | grep -q "Join Meeting" && echo "Valid: $i"
   done
   ```
   - Expected Result: Rate limiting blocks enumeration (CAPTCHA, IP blocking)

3. **Password Bypass Attempt:**
   - For meetings requiring password, attempt common passwords (123456, meeting, abhavtech)
   - Expected Result: Strong password policy enforced (10+ chars, complexity)

4. **Participant Enumeration:**
   - If joined meeting as guest, attempt to enumerate participant names/emails
   - Expected Result: Host controls (lobby, waiting room) prevent unauthorized access

**Success Criteria:**
- ✅ Meeting IDs use random generation (not sequential)
- ✅ Rate limiting prevents brute force enumeration
- ✅ Password policy enforces strong passwords
- ✅ Lobby/waiting room prevents unauthorized join

**Detection Validation:**
- Webex admin portal: Failed join attempts logged
- Splunk alert: "Meeting enumeration attempt detected - IP X.X.X.X"

**Detailed Test Procedure:** See Appendix I

---

#### Test Case 3: Toll Fraud Detection Validation

**Objective:** Validate that Webex Calling toll fraud detection mechanisms are functional.

**MITRE ATT&CK:** T1499 (Endpoint Denial of Service)

**Test Methodology:**

1. **Abnormal Call Pattern Simulation:**
   - Place rapid successive calls to international destinations (within rate limits to avoid actual fraud)
   - Monitor if system detects abnormal pattern

2. **After-Hours Calling Test:**
   - Attempt to place international calls during non-business hours (2 AM IST)
   - Expected Result: After-hours restrictions block calls

3. **Call Volume Threshold Test:**
   - Simulate high call volume from single user (within safe limits)
   - Expected Result: Alerting triggers for unusual call volume

4. **Geographic Anomaly Test:**
   - Call from user account located in Mumbai to unusual destinations (e.g., North Korea, Iran)
   - Expected Result: Geographic restrictions block calls to sanctioned countries

**Success Criteria:**
- ✅ Toll fraud detection alerts on abnormal patterns
- ✅ After-hours restrictions functional
- ✅ Call volume thresholds enforced
- ✅ Geographic blocking prevents calls to high-risk destinations

**Detection Validation:**
- Webex Admin Portal: Toll fraud alerts generated
- Splunk: "Toll fraud pattern detected - User: user@abhavtech.com"
- Email alert to finance/security teams

**Detailed Test Procedure:** See Appendix J

---

#### Test Case 4: SBC/CUBE PSTN Gateway Security **← NEW in v2.0**

**Objective:** Test security of on-premises SBC/CUBE PSTN gateways that provide telephony connectivity for cloud Webex Calling services.

**MITRE ATT&CK:** T1499 (Endpoint DoS), T1078 (Valid Accounts), T1557 (Adversary-in-the-Middle)

**Infrastructure Scope:**
- **NJ Data Center:** CUBE-NJ-01/02 (AT&T SIP trunk)
- **Mumbai Data Center:** CUBE-MUM-01/02 (Tata Communications SIP trunk)
- **London Data Center:** CUBE-LON-01/02 (BT SIP trunk)

**Test Methodology:**

1. **SIP Authentication Bypass:**
   - Enumerate SIP trunk endpoints (svmap, nmap)
   - Attempt SIP INVITE without credentials
   - Brute force SIP digest authentication (sipcrack)
   - Expected Result: Rate limiting blocks brute force (10 attempts → IP block)

2. **Toll Fraud Simulation:**
   - Automated dialer to premium-rate international numbers
   - 15 calls to high-cost destinations (Somalia, Grenada, premium services)
   - Expected Result: Toll fraud detection blocks calls, auto-suspends extension

3. **DoS Attack (SIP Flooding):**
   - SIPp flood: 100 INVITE messages/second for 100 seconds
   - Expected Result: Rate limiting throttles to 20 calls/sec, attack source blocked

4. **PSTN Carrier Trunk Hijacking:**
   - Attempt carrier IP spoofing (Scapy packet crafting)
   - Send INVITE claiming to be from carrier gateway
   - Expected Result: Mutual TLS + IPsec source validation blocks spoofed traffic

5. **Media Plane Eavesdropping:**
   - Capture RTP packets during active call (tcpdump)
   - Attempt SRTP decryption (Wireshark)
   - Expected Result: All media encrypted with SRTP (AES-128), keys protected by TLS

**Success Criteria:**
- ✅ SIP authentication enforced (no anonymous calls)
- ✅ Toll fraud detection functional ($120K/year savings validated)
- ✅ DoS protection maintains 99.99% uptime
- ✅ Trunk hijacking prevented (mutual TLS + IPsec)
- ✅ Media encryption validated (SRTP, TLS key exchange)

**Detection Validation:**
- CUBE syslog: "SIP authentication failure from IP X.X.X.X"
- Splunk alert: "Toll fraud attempt - Extension suspended"
- XDR correlation: "Distributed SIP attack from multiple sources"
- ServiceNow: Auto-incident creation for toll fraud (INC-XXXX)

**Detailed Test Procedure:** See Appendix P (NEW in v2.0)

---

### 5.3 Webex Configuration Hardening Recommendations

**Webex Calling Hardening:**

| Configuration | Current State | Recommended State | Priority |
|--------------|---------------|-------------------|----------|
| **SIP Trunk Authentication** | Digest authentication | Certificate-based auth (TLS client certs) | HIGH |
| **Call Restrictions** | Basic international blocking | Geographic blocking (allow only approved countries) | CRITICAL |
| **After-Hours Calling** | Unrestricted | Block international calls 2000-0600 IST | HIGH |
| **Toll Fraud Detection** | Manual CDR review | Automated alerts (Splunk correlation, >$100 in 1 hour) | CRITICAL |
| **PIN Policies** | 4-digit voicemail PIN | 6-digit minimum, no sequential/repeated digits | MEDIUM |

**Webex Meetings Hardening:**

| Configuration | Current State | Recommended State | Priority |
|--------------|---------------|-------------------|----------|
| **Meeting Passwords** | Optional | Mandatory for all meetings, 10+ chars complexity | HIGH |
| **Lobby/Waiting Room** | Disabled by default | Enabled by default, host approval required | HIGH |
| **Recording Consent** | Manual announcement | Automated banner: "This meeting is being recorded" | MEDIUM |
| **Screen Sharing** | All participants | Host/co-host only (prevent hijacking) | MEDIUM |
| **Meeting Expiry** | Meetings remain active indefinitely | Auto-expire after 1 hour past scheduled end time | LOW |

**Webex Contact Center Hardening:**

| Configuration | Current State | Recommended State | Priority |
|--------------|---------------|-------------------|----------|
| **Agent Authentication** | Password + MFA (Duo) | Certificate-based auth for supervisor accounts | MEDIUM |
| **Call Recording** | Encrypted in transit | Encrypted at rest (AES-256), access logging | HIGH |
| **PCI Compliance** | Pause recording during credit card input | DTMF masking (credit card digits not recorded) | CRITICAL |
| **Supervisor Monitoring** | Silent monitor allowed | Require agent notification (compliance) | MEDIUM |

---
