# SD-WAN Testing

### 4.1 SD-WAN Threat Model

**Architecture Components Under Test:**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     ABHAVTECH SD-WAN ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌────────────────────────────────────────────────────────────────────┐        │
│   │                    CONTROL PLANE                                   │        │
│   │                                                                    │        │
│   │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐          │        │
│   │  │  vManage     │   │  vSmart      │   │  vBond       │          │        │
│   │  │  20.15.x     │   │  (2x cluster)│   │  (Orchestrator)         │        │
│   │  │  (2x HA)     │   │              │   │              │          │        │
│   │  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘          │        │
│   │         │                  │                  │                   │        │
│   │         │ Configuration    │ OMP routing      │ Certificate       │        │
│   │         │ NETCONF/REST API │ Control policies │ Orchestration     │        │
│   └─────────┼──────────────────┼──────────────────┼───────────────────┘        │
│             │                  │                  │                            │
│             ▼                  ▼                  ▼                            │
│   ┌─────────────────────────────────────────────────────────────────────┐      │
│   │                       DATA PLANE                                    │      │
│   │                                                                     │      │
│   │  ┌─────────────────┐    ┌─────────────────┐   ┌─────────────────┐ │      │
│   │  │ WAN Edge        │    │ WAN Edge        │   │ WAN Edge        │ │      │
│   │  │ (ISR 4451)      │    │ (ISR 1100)      │   │ (ASR 1001-X)    │ │      │
│   │  │                 │    │                 │   │                 │ │      │
│   │  │ • IPsec tunnels │    │ • TLOC          │   │ • UTD (IPS/NGFW)│ │      │
│   │  │ • Application   │    │ • Cisco SD-WAN  │   │ • DPI           │ │      │
│   │  │   Aware Routing │    │   Software      │   │ • App-Route     │ │      │
│   │  └────────┬────────┘    └────────┬────────┘   └────────┬────────┘ │      │
│   │           │                      │                     │          │      │
│   │           │ MPLS (Primary)       │ Internet (Secondary)│ 4G/LTE   │      │
│   │           │ IPsec Tunnels        │ IPsec Tunnels       │ (Backup) │      │
│   └───────────┼──────────────────────┼─────────────────────┼──────────┘      │
│               │                      │                     │                  │
│               ▼                      ▼                     ▼                  │
│         Branch Sites           Remote Sites         Mobile Sites             │
│         (12 locations)         (6 locations)        (2 mobile)               │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

**Attack Surfaces:**

| Component | Attack Surface | Risk Level |
|-----------|---------------|-----------|
| **vManage** | Web GUI (HTTPS), REST API, NETCONF, SSH, vShell | CRITICAL - Central management plane |
| **vSmart** | OMP routing protocol, control connections (DTLS), SSH | HIGH - Routing manipulation risk |
| **vBond** | Certificate orchestration, initial device onboarding, HTTPS | MEDIUM - Limited attack surface after bootstrap |
| **WAN Edge** | IPsec tunnels (IKEv2), management VPN (VPN 512), SSH/NETCONF | HIGH - Distributed attack surface |
| **IPsec Tunnels** | IKEv2 key exchange, ESP encryption (AES-256-GCM), anti-replay | MEDIUM - Strong encryption but implementation flaws possible |
| **OMP Protocol** | Route advertisements, TLOCs, service chaining | MEDIUM - Control plane protocol manipulation |

### 4.2 SD-WAN Test Cases

#### Test Case 1: vManage Unauthorized Access

**Objective:** Attempt unauthorized access to vManage to gain control of SD-WAN infrastructure.

**MITRE ATT&CK:** T1190 (Exploit Public-Facing Application), T1078 (Valid Accounts)

**Test Methodology:**

1. **Port Scanning:**
   ```bash
   # Nmap aggressive scan
   nmap -sV -sC -A -p- vmanage.abhavtech.com
   
   # Expected open ports:
   # 22 (SSH), 443 (HTTPS), 8443 (REST API), 830 (NETCONF)
   ```

2. **Default Credentials Test:**
   - Attempt login with default credentials (admin/admin)
   - Expected Result: Default credentials should be changed (should fail)

3. **Brute Force Attack:**
   - Use Hydra to brute force admin account
   ```bash
   hydra -l admin -P /usr/share/wordlists/rockyou.txt https-post-form \
   "vmanage.abhavtech.com:443:/j_security_check:j_username=^USER^&j_password=^PASS^:Login failed"
   ```
   - Expected Result: Account lockout after 5 failed attempts

4. **API Exploitation:**
   - Test REST API for unauthenticated endpoints
   ```bash
   curl -k https://vmanage.abhavtech.com:8443/dataservice/system/device/controllers
   ```
   - Expected Result: 401 Unauthorized (requires authentication token)

5. **CVE Exploitation:**
   - Check for known vManage vulnerabilities (CVE-2021-1300, CVE-2021-1479, etc.)
   - Attempt exploit using Metasploit or custom exploits
   - Expected Result: Patches applied, exploits fail

**Success Criteria:**
- ✅ Default credentials not present
- ✅ Brute force blocked by rate limiting and account lockout
- ✅ API endpoints require authentication
- ✅ Known CVEs patched (vManage 20.15.x includes fixes)

**Detection Validation:**
- vManage logs: Failed login attempts logged
- Splunk alert: "Multiple failed vManage login attempts from IP X.X.X.X"
- XDR casebook: "vManage unauthorized access attempt"

**Detailed Test Procedure:** See Appendix E

---

#### Test Case 2: IPsec Tunnel Hijacking

**Objective:** Attempt to intercept or hijack IPsec tunnel traffic between WAN edge routers.

**MITRE ATT&CK:** T1557.002 (Man-in-the-Middle), T1040 (Network Sniffing)

**Test Methodology:**

1. **Packet Capture:**
   - Use tcpdump/Wireshark to capture IPsec traffic (ESP packets)
   ```bash
   tcpdump -i eth0 -w ipsec-capture.pcap esp
   ```
   - Expected Result: Traffic is encrypted (ESP), no plaintext data visible

2. **IKEv2 Downgrade Attack:**
   - Attempt to force negotiation to weaker encryption (DES instead of AES-256)
   - Use ike-scan to test supported algorithms
   ```bash
   ike-scan --ikev2 vwan-edge-mumbai.abhavtech.com
   ```
   - Expected Result: Only strong ciphers accepted (AES-256-GCM, SHA-256+)

3. **Certificate Theft:**
   - If physical access to WAN edge router, attempt to extract IPsec certificates
   - Expected Result: Certificates stored in secure keystore (not exportable)

4. **Replay Attack:**
   - Capture ESP packets and replay to test anti-replay protection
   - Expected Result: Anti-replay window (default 64 packets) rejects duplicates

**Success Criteria:**
- ✅ IPsec traffic encrypted (AES-256-GCM)
- ✅ IKEv2 negotiation rejects weak ciphers
- ✅ Anti-replay protection functional
- ✅ Certificates not extractable without physical device access + admin credentials

**Detection Validation:**
- WAN Edge logs: IKEv2 negotiation failures logged
- vManage monitoring: Tunnel flap alerts if attack disrupts tunnels
- ThousandEyes: Path visualization detects routing anomalies

**Detailed Test Procedure:** See Appendix F

---

#### Test Case 3: OMP Route Injection

**Objective:** Attempt to inject malicious routes via OMP to redirect traffic or cause blackhole routing.

**MITRE ATT&CK:** T1557.002 (Man-in-the-Middle), T1498 (Network Denial of Service)

**Test Methodology:**

1. **OMP Route Advertisement Attempt:**
   - If compromised WAN edge router access, attempt to advertise malicious routes
   ```bash
   # CLI simulation (assumes compromised router)
   vEdge# config
   vEdge(config)# vpn 1
   vEdge(config-vpn-1)# ip route 10.0.0.0/8 null0
   # Advertise via OMP to attract traffic to blackhole
   ```

2. **Route Preference Manipulation:**
   - Modify OMP route preferences to make malicious route more attractive
   - Expected Result: vSmart policy rejects routes from untrusted sources

3. **TLOC Hijacking:**
   - Attempt to advertise fake TLOC (Transport Locator) to intercept traffic
   - Expected Result: Certificate-based authentication prevents TLOC spoofing

**Success Criteria:**
- ✅ OMP authentication prevents unauthorized route injection
- ✅ vSmart control policy validates routes from authorized edge routers only
- ✅ TLOC spoofing blocked by certificate validation

**Detection Validation:**
- vSmart logs: Unauthorized OMP route advertisement rejected
- vManage alerts: "OMP route manipulation detected"
- Splunk correlation: "SD-WAN control plane anomaly"

**Detailed Test Procedure:** See Appendix G

---

### 4.3 SD-WAN Configuration Hardening Recommendations

**vManage Hardening:**

| Configuration | Current State | Recommended State | Priority |
|--------------|---------------|-------------------|----------|
| **Admin Credentials** | Complex password (16 chars) | Rotate every 90 days, use CyberArk PAM | HIGH |
| **API Access** | Token-based auth | Restrict to mgmt network (10.200.0.0/24), IP whitelisting | CRITICAL |
| **SSH Access** | Key-based auth | Disable password auth, certificate-based SSH | HIGH |
| **Session Timeout** | 30 minutes | 15 minutes for admin sessions | MEDIUM |
| **Audit Logging** | Local logs | Forward to Splunk (syslog over TLS), 1-year retention | HIGH |

**IPsec Hardening:**

| Configuration | Current State | Recommended State | Priority |
|--------------|---------------|-------------------|----------|
| **IKEv2 Ciphers** | AES-256-GCM | Disable DES/3DES/AES-128, AES-256-GCM only | HIGH |
| **Perfect Forward Secrecy** | Enabled (DH Group 14) | Use DH Group 20+ (stronger) | MEDIUM |
| **Certificate Validity** | 1 year | Rotate every 6 months, monitor expiration | MEDIUM |
| **Anti-Replay Window** | 64 packets | 1024 packets (larger window, better protection) | LOW |

**OMP Hardening:**

| Configuration | Current State | Recommended State | Priority |
|--------------|---------------|-------------------|----------|
| **Route Filtering** | Basic prefix lists | Strict route policies (allow only known prefixes) | HIGH |
| **TLOC Authentication** | Certificate-based | Monitor for certificate mismatches, auto-alert | MEDIUM |
| **Control Connections** | DTLS encryption | Force TLS 1.2+, disable older protocols | MEDIUM |

---
