# SD-Access Testing

### 3.1 SD-Access Threat Model

**Architecture Components Under Test:**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   ABHAVTECH SD-ACCESS ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌────────────────────────────────────────────────────────────────────┐        │
│   │                    CONTROL PLANE                                   │        │
│   │                                                                    │        │
│   │  ┌──────────────┐        ┌──────────────┐       ┌──────────────┐ │        │
│   │  │  DNAC 2.3.7.x│◄──────►│  ISE 3.3/3.4 │◄─────►│ Active       │ │        │
│   │  │  (2x HA)     │        │  (14 nodes)  │       │ Directory    │ │        │
│   │  └──────┬───────┘        └──────┬───────┘       └──────────────┘ │        │
│   │         │                       │                                 │        │
│   │         │ LISP/RLOC mapping     │ pxGrid (SGT, session, threat)   │        │
│   │         │ Fabric automation     │ 802.1X authentication           │        │
│   └─────────┼───────────────────────┼─────────────────────────────────┘        │
│             │                       │                                          │
│             ▼                       ▼                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │                       DATA PLANE                                    │      │
│   │                                                                     │      │
│   │  ┌─────────────────┐    ┌─────────────────┐   ┌─────────────────┐ │      │
│   │  │ Fabric Border   │    │ Fabric Edge     │   │ Fabric Edge     │ │      │
│   │  │ (Catalyst 9500) │    │ (Catalyst 9300) │   │ (Catalyst 9800  │ │      │
│   │  │                 │    │                 │   │  WLC)           │ │      │
│   │  │ • LISP xTR      │    │ • LISP xTR      │   │                 │ │      │
│   │  │ • SGT injection │    │ • 802.1X        │   │ • 802.1X (EAP)  │ │      │
│   │  │ • VRF routing   │    │ • SGACL enforce │   │ • FlexConnect   │ │      │
│   │  └────────┬────────┘    └────────┬────────┘   └────────┬────────┘ │      │
│   │           │                      │                     │          │      │
│   │           │ VXLAN Overlay        │ VXLAN Overlay       │ CAPWAP   │      │
│   │           │ (SGT in VXLAN header)│                     │          │      │
│   └───────────┼──────────────────────┼─────────────────────┼──────────┘      │
│               │                      │                     │                  │
│               ▼                      ▼                     ▼                  │
│        External Networks        Wired Endpoints      Wireless Clients        │
│        (Internet, MPLS)         (12,000 devices)     (3,000 devices)         │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Attack Surfaces:**

| Component | Attack Surface | Risk Level |
|-----------|---------------|-----------|
| **DNAC** | Web GUI (HTTPS), REST API, SSH management, LISP control protocols | HIGH - Central control point |
| **ISE** | Admin portal (HTTPS), RADIUS (1812/1813), TACACS+ (49), pxGrid (8910), Guest portal | HIGH - Identity authority |
| **802.1X** | EAP-TLS/PEAP authentication, certificate validation, RADIUS communication | MEDIUM - Well-tested protocol |
| **TrustSec SGT** | SGT assignment logic, SGACL enforcement, SGT propagation (SXP, inline tagging) | MEDIUM - Policy bypass risk |
| **LISP Fabric** | LISP Map-Server/Map-Resolver, EID-to-RLOC mapping, VXLAN encapsulation | LOW - Internal control plane |
| **Wireless (9800 WLC)** | FlexConnect, EAP authentication, rogue AP detection, management frame protection | MEDIUM - Wireless attack vectors |

### 3.2 SD-Access Test Cases

#### Test Case 1: TrustSec SGT Bypass (Micro-segmentation Violation)

**Objective:** Attempt to bypass SGT-based micro-segmentation to access restricted network segments.

**MITRE ATT&CK:** T1021 (Remote Services), T1210 (Exploitation of Remote Services)

**Scenario:** Attacker compromises a standard user endpoint (SGT 10 = Corporate Users) and attempts to access HR database server (SGT 85 = HR Production, SGACL blocks SGT 10).

**Test Methodology:**

1. **Direct Connection Attempt:**
   - Connect from SGT 10 endpoint to HR server IP (10.252.85.10)
   - Expected Result: FTD/Fabric Edge blocks traffic based on SGACL (SGT 10 → SGT 85 DENY)
   
2. **MAC Address Spoofing:**
   - Change MAC address to match authorized device (HR admin laptop)
   - Attempt ISE MAB (MAC Authentication Bypass) re-authentication
   - Expected Result: ISE detects MAC spoofing (profiling mismatch), applies quarantine SGT 999

3. **ARP Spoofing:**
   - Use Ettercap/arpspoof to impersonate HR gateway (10.252.85.1)
   - Intercept HR traffic to steal credentials
   - Expected Result: DHCP snooping + Dynamic ARP Inspection (DAI) blocks spoofed ARP packets

4. **VLAN Hopping (Double-Tagging):**
   - Craft 802.1Q double-tagged frames (outer: Corporate VLAN, inner: HR VLAN)
   - Expected Result: Not applicable (SD-Access uses VXLAN overlay, no Layer 2 VLAN adjacency)

**Success Criteria:**
- ✅ All bypass attempts blocked by fabric security controls
- ✅ ISE logs show authentication failures, SGT violations
- ✅ Splunk receives pxGrid alerts for suspicious activity
- ✅ XDR creates incident if multiple violation attempts detected

**Detection Validation:**
- ISE pxGrid alert: "Unauthorized SGT access attempt"
- Splunk correlation: Multiple failed connection attempts from same endpoint
- XDR casebook creation: "TrustSec policy violation - potential lateral movement"

**Detailed Test Procedure:** See Appendix A (Step-by-step commands, expected outputs)

---

#### Test Case 2: Rogue Access Point (Evil Twin Attack)

**Objective:** Deploy rogue wireless AP to capture user credentials or intercept traffic.

**MITRE ATT&CK:** T1557.002 (Man-in-the-Middle: ARP Cache Poisoning), T1040 (Network Sniffing)

**Scenario:** Attacker sets up rogue AP with SSID "Abhavtech-Corp" to trick users into connecting.

**Test Methodology:**

1. **Evil Twin AP Setup:**
   - Use Raspberry Pi 4 with Alfa AWUS036ACH wireless adapter
   - Configure hostapd with SSID "Abhavtech-Corp" (same as legitimate network)
   - Run captive portal (fake login page) or WPA2-PSK with known password
   
2. **Certificate Pinning Test:**
   - Attempt to present fake RADIUS certificate (self-signed)
   - Expected Result: Corporate devices with certificate pinning reject connection

3. **Open Network Deception:**
   - Advertise as open network (no encryption) to attract guests
   - Run Wireshark to capture HTTP/FTP credentials
   - Expected Result: Users should not connect (training awareness)

4. **DNAC Rogue AP Detection:**
   - Wait for Cisco 9800 WLC to detect rogue AP
   - Expected Result: DNAC "Rogue and aWIPS" alerts within 5-10 minutes
   - Verify automated containment (flood rogue AP with deauth frames)

**Success Criteria:**
- ✅ DNAC detects rogue AP within 10 minutes
- ✅ WLC automatically classifies as "Malicious" (same SSID as corporate)
- ✅ Automated containment activated (if configured)
- ✅ Security team receives alert (email, Splunk, XDR)

**Detection Validation:**
- DNAC Alert: "Rogue AP detected - SSID: Abhavtech-Corp"
- Splunk syslog from WLC: "Rogue AP containment initiated"
- XDR correlation: "Potential evil twin attack - multiple rogue AP detections"

**Detailed Test Procedure:** See Appendix B

---

#### Test Case 3: 802.1X Authentication Bypass

**Objective:** Bypass 802.1X network access control to gain unauthorized access.

**MITRE ATT&CK:** T1078 (Valid Accounts), T1110 (Brute Force)

**Test Methodology:**

1. **MAB Spoofing:**
   - Clone MAC address of authorized printer (MAB-authenticated device)
   - Connect to network port
   - Expected Result: ISE profiling detects OS mismatch (laptop vs printer), denies access

2. **EAP Downgrade Attack:**
   - Force negotiation to weaker EAP method (PEAP instead of EAP-TLS)
   - Attempt to crack MSCHAPv2 handshake
   - Expected Result: ISE enforces EAP-TLS requirement, rejects PEAP negotiation

3. **RADIUS Brute Force:**
   - Use wpa_supplicant to test multiple username/password combinations
   - Expected Result: ISE rate limiting (5 failed attempts = account lockout)

4. **Unauthorized Device Enrollment:**
   - Attempt to enroll personal device in corporate certificate store
   - Expected Result: SCEP (Simple Certificate Enrollment Protocol) requires approval

**Success Criteria:**
- ✅ All bypass attempts blocked by ISE authentication policies
- ✅ Rate limiting prevents brute force attacks
- ✅ Profiling accurately identifies device type mismatches

**Detection Validation:**
- ISE Authentication Report: Failed authentication attempts logged
- Splunk alert: "Multiple failed 802.1X attempts from MAC XX:XX:XX:XX:XX:XX"
- Duo (if integrated): Device trust check fails for unknown devices

**Detailed Test Procedure:** See Appendix C

---

#### Test Case 4: Wireless Deauthentication Attack (DoS)

**Objective:** Test wireless network resilience against deauthentication attacks.

**MITRE ATT&CK:** T1499.004 (Endpoint Denial of Service: Application or System Exploitation)

**Test Methodology:**

1. **Deauth Attack Execution:**
   - Use aircrack-ng suite (aireplay-ng) to send deauth frames
   ```bash
   # Monitor mode
   airmon-ng start wlan0
   
   # Capture target AP BSSID
   airodump-ng wlan0mon
   
   # Deauth attack (target AP: AA:BB:CC:DD:EE:FF)
   aireplay-ng --deauth 100 -a AA:BB:CC:DD:EE:FF wlan0mon
   ```
   
2. **Management Frame Protection (MFP) Validation:**
   - Expected Result: 802.11w MFP (IEEE 802.11w-2009) protects management frames
   - Clients with MFP support should ignore unauthenticated deauth frames

3. **DNAC aWIPS Detection:**
   - Verify DNAC detects deauth attack as security threat
   - Expected Result: "Deauthentication attack detected" alert

4. **Client Impact Assessment:**
   - Monitor if corporate clients (with MFP) remain connected
   - Monitor if legacy clients (without MFP) disconnect

**Success Criteria:**
- ✅ MFP-enabled clients (Windows 10/11, modern iOS/Android) resist attack
- ✅ DNAC aWIPS detects attack within 2-3 minutes
- ✅ Attack source location identified (Rogue AP location tracking)

**Detection Validation:**
- DNAC Alert: "Deauthentication flood detected - AP: Abhavtech-Corp-Floor3"
- WLC logs: "Management frame protection violation"
- Splunk correlation: "Wireless DoS attack - deauth frames"

**Detailed Test Procedure:** See Appendix D

---

### 3.3 SD-Access Configuration Hardening Recommendations

Based on penetration test findings, the following hardening measures are recommended:

**ISE Hardening:**

| Configuration | Current State | Recommended State | Priority |
|--------------|---------------|-------------------|----------|
| **Default Passwords** | Some service accounts use defaults | Rotate all passwords, 16+ chars, complexity | CRITICAL |
| **RADIUS Shared Secrets** | 12 characters | 32+ characters, random generation | HIGH |
| **pxGrid Certificates** | Default validity 1 year | Rotate every 90 days, monitor expiration | MEDIUM |
| **Admin Access** | SSH + HTTPS | HTTPS only, IP whitelisting (management VLAN) | HIGH |
| **TACACS+ Command Authorization** | Partial implementation | Full command authorization for network devices | HIGH |
| **Guest Portal Captive Portal** | HTTP redirect | HTTPS only, certificate validation | MEDIUM |

**DNAC Hardening:**

| Configuration | Current State | Recommended State | Priority |
|--------------|---------------|-------------------|----------|
| **API Authentication** | Basic auth | OAuth 2.0 token-based authentication | HIGH |
| **Role-Based Access** | Admin + Read-only | Granular RBAC (Network Admin, Security Analyst, Viewer) | MEDIUM |
| **Audit Logging** | Local logs only | Forward to Splunk (syslog), 1-year retention | HIGH |
| **Firmware Updates** | Manual process | Automated vulnerability scanning, patch SLA (30 days) | MEDIUM |

**TrustSec/SGT Hardening:**

| Configuration | Current State | Recommended State | Priority |
|--------------|---------------|-------------------|----------|
| **SGT Assignment** | Static + Dynamic | Enforce dynamic SGT (ISE profiling only), minimize static | MEDIUM |
| **SGACL Policy** | Explicit permits + implicit deny | Regular review (quarterly), least privilege principle | HIGH |
| **SGT Propagation** | Inline tagging | Disable SXP where possible (use inline tagging for scalability) | LOW |
| **Default SGT** | SGT 0 (Unknown) | Quarantine SGT 999 for unknown devices | CRITICAL |

---
