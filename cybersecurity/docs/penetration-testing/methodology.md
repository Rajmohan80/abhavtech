# Methodology

## 2. PENETRATION TESTING METHODOLOGY (PTES)

### 2.1 Penetration Testing Execution Standard (PTES) Framework

Abhavtech follows the industry-standard PTES methodology with 6 distinct phases:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        PTES 6-PHASE METHODOLOGY                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  PHASE 1: PRE-ENGAGEMENT                                                        │
│  ══════════════════════════════════════════════════════════════════════════     │
│  Duration: 1 week before test starts                                            │
│  Objective: Define scope, rules of engagement, obtain legal authorization       │
│                                                                                  │
│  Key Activities:                                                                │
│  ✓ Scope definition (in-scope systems, attack surfaces, prohibited attacks)     │
│  ✓ Rules of Engagement (ROE) document creation                                  │
│  ✓ Legal authorization letter (signed by CISO, Legal, CTO)                      │
│  ✓ Emergency contact escalation path (24x7 phone tree)                          │
│  ✓ Define success criteria (metrics, deliverables, reporting)                   │
│  ✓ Schedule kickoff meeting (Red Team, Blue Team, Network Engineering)          │
│                                                                                  │
│  Deliverables:                                                                  │
│  • Signed Rules of Engagement (ROE) document                                    │
│  • Penetration Testing Authorization Letter                                     │
│  • Scope definition spreadsheet (IP ranges, systems, credentials)               │
│  • Emergency stop procedures document                                           │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐         │
│  │  SAMPLE ROE COMPONENTS                                             │         │
│  │  ─────────────────────────────────────────────────────────────     │         │
│  │  • Test Window: Monday 0000 IST - Friday 2359 IST (Week of Jan 15) │         │
│  │  • Attack Sources: Red Team lab (10.200.0.0/24), Internet (external)│        │
│  │  • Permitted Techniques: All except DoS, ransomware, data deletion │         │
│  │  • Credentials Provided: 5 standard user accounts (no admin)       │         │
│  │  • Social Engineering: Email phishing (no phone vishing)            │         │
│  │  • Physical Access: Badge cloning test (HQ only, with security)    │         │
│  │  • Stop Condition: Production service disruption >5 minutes         │         │
│  │  • Daily Debriefs: 1700 IST (Red Team + Blue Team + CISO)          │         │
│  └────────────────────────────────────────────────────────────────────┘         │
│                                                                                  │
│  PHASE 2: INTELLIGENCE GATHERING (Reconnaissance)                               │
│  ══════════════════════════════════════════════════════════════════════════     │
│  Duration: Days 1-3 of test                                                     │
│  Objective: Gather information about target infrastructure                      │
│                                                                                  │
│  Passive Reconnaissance (No Direct Target Contact):                             │
│  ✓ OSINT (Open Source Intelligence) collection                                  │
│    • DNS enumeration (nslookup, dig, dnsdumpster.com)                           │
│    • WHOIS lookups (domain registration, IP ownership)                          │
│    • LinkedIn reconnaissance (employees, roles, org structure)                  │
│    • Google dorking (site:abhavtech.com, inurl:admin, filetype:pdf)             │
│    • Shodan/Censys searches (exposed services, SSL certificates)                │
│    • GitHub/GitLab code searches (leaked credentials, API keys)                 │
│  ✓ Public breach databases (HaveIBeenPwned, DeHashed - password reuse)          │
│  ✓ Social media scraping (employee emails, phone numbers)                       │
│                                                                                  │
│  Active Reconnaissance (Direct Target Interaction):                             │
│  ✓ Network mapping (Nmap, Masscan)                                              │
│    • Port scanning (TCP/UDP, service version detection)                         │
│    • OS fingerprinting (TTL analysis, TCP stack behavior)                       │
│    • Service enumeration (SSH banners, HTTP headers, SNMP walks)                │
│  ✓ Wireless network discovery (Airodump-ng, Kismet)                             │
│  ✓ Email harvesting (TheHarvester, Hunter.io)                                   │
│  ✓ Subdomain enumeration (Amass, Sublist3r, certificate transparency logs)      │
│                                                                                  │
│  Deliverables:                                                                  │
│  • Network map (IP ranges, open ports, services)                                │
│  • Employee database (names, emails, roles, departments)                        │
│  • Technology stack identification (Cisco equipment, software versions)         │
│  • Attack surface analysis (exposed services, potential entry points)           │
│                                                                                  │
│  PHASE 3: VULNERABILITY ANALYSIS                                                │
│  ══════════════════════════════════════════════════════════════════════════     │
│  Duration: Days 3-5 of test                                                     │
│  Objective: Identify exploitable vulnerabilities in discovered systems          │
│                                                                                  │
│  Automated Vulnerability Scanning:                                              │
│  ✓ Nessus Professional (comprehensive vulnerability scanner)                    │
│  ✓ OpenVAS (open-source alternative)                                            │
│  ✓ Qualys/Rapid7 Nexpose (cloud-based scanning)                                 │
│  ✓ Nmap NSE scripts (vulnerability-specific checks)                             │
│                                                                                  │
│  Manual Vulnerability Assessment:                                               │
│  ✓ Configuration review (hardening benchmarks - CIS, NIST)                      │
│    • Cisco IOS/IOS-XE config analysis (weak passwords, old protocols)           │
│    • ISE policy review (weak 802.1X configurations, default certs)              │
│    • FTD rule analysis (overly permissive firewall rules, any/any)              │
│    • vManage security posture (default credentials, API exposure)               │
│  ✓ Web application testing (OWASP Top 10)                                       │
│    • SQL injection (SQLmap)                                                     │
│    • Cross-site scripting (XSS)                                                 │
│    • Authentication bypass                                                      │
│    • Insecure direct object references (IDOR)                                   │
│  ✓ Wireless security testing                                                    │
│    • WPA2/WPA3 encryption strength                                              │
│    • Enterprise authentication (EAP-TLS certificate validation)                 │
│    • Rogue AP detection capabilities                                            │
│                                                                                  │
│  Vulnerability Prioritization:                                                  │
│  • CVSS scoring (Common Vulnerability Scoring System)                           │
│  • Exploitability assessment (public exploits available?)                       │
│  • Business impact analysis (PCI-DSS scope, customer data exposure)             │
│                                                                                  │
│  Deliverables:                                                                  │
│  • Vulnerability report (sorted by severity: Critical/High/Medium/Low)          │
│  • Exploitability matrix (likelihood vs impact)                                 │
│  • Remediation recommendations (patch, config change, compensating controls)    │
│                                                                                  │
│  PHASE 4: EXPLOITATION                                                          │
│  ══════════════════════════════════════════════════════════════════════════     │
│  Duration: Days 5-10 of test                                                    │
│  Objective: Exploit identified vulnerabilities to gain access, prove impact     │
│                                                                                  │
│  Initial Access:                                                                │
│  ✓ External attack vectors:                                                     │
│    • Phishing campaigns (credential harvesting)                                 │
│    • Exploit public-facing web apps (SQL injection, RCE)                        │
│    • VPN attacks (brute force, credential stuffing)                             │
│    • Exploit CVEs in exposed services (unpatched systems)                       │
│  ✓ Internal attack vectors (assumes compromised user):                          │
│    • 802.1X bypass attempts (MAB spoofing, VLAN hopping)                        │
│    • ARP spoofing, LLMNR/NBT-NS poisoning (Responder.py)                        │
│    • SMB relay attacks (ntlmrelayx)                                             │
│                                                                                  │
│  Post-Exploitation:                                                             │
│  ✓ Privilege escalation:                                                        │
│    • Windows: Kernel exploits, token impersonation, UAC bypass                  │
│    • Linux: SUID binaries, kernel exploits, sudo misconfiguration               │
│    • Network devices: SNMP default community strings, Cisco IOS exploits        │
│  ✓ Lateral movement:                                                            │
│    • Pass-the-Hash (Mimikatz, CrackMapExec)                                     │
│    • Kerberoasting (request TGS for service accounts)                           │
│    • RDP/SSH pivot (compromised credentials)                                    │
│    • VLAN hopping (if SGT segmentation fails)                                   │
│  ✓ Persistence:                                                                 │
│    • Registry run keys (Windows)                                                │
│    • Scheduled tasks / cron jobs                                                │
│    • Web shells on compromised servers                                          │
│    • Backdoor user accounts                                                     │
│  ✓ Data exfiltration simulation:                                                │
│    • Locate sensitive data (PCI-DSS cardholder data, PII)                       │
│    • Exfiltrate small sample (proof of concept, no actual breach)               │
│    • Test DLP controls (Umbrella, FTD, Secure Email)                            │
│                                                                                  │
│  Deliverables:                                                                  │
│  • Exploitation report (successful attacks, proof-of-concept screenshots)       │
│  • Privilege escalation paths (attack chains)                                   │
│  • Lateral movement map (compromised systems, pivot points)                     │
│                                                                                  │
│  PHASE 5: POST-EXPLOITATION                                                     │
│  ══════════════════════════════════════════════════════════════════════════     │
│  Duration: Days 10-12 of test                                                   │
│  Objective: Assess full impact, demonstrate business risk, maintain access      │
│                                                                                  │
│  Business Impact Demonstration:                                                 │
│  ✓ Crown jewel access (critical business systems):                              │
│    • ERP systems (SAP, Oracle)                                                  │
│    • CRM databases (Salesforce)                                                 │
│    • Payment processing systems (PCI-DSS in-scope)                              │
│    • Backup systems (Veeam, test recovery data access)                          │
│  ✓ Data classification and exfiltration risk:                                   │
│    • PII (Personally Identifiable Information)                                  │
│    • CHD (Cardholder Data - PCI-DSS)                                            │
│    • PHI (Protected Health Information - HIPAA if applicable)                   │
│    • Trade secrets, intellectual property                                       │
│                                                                                  │
│  Persistence & Command and Control (C2):                                        │
│  ✓ Establish covert channels:                                                   │
│    • DNS tunneling (iodine, dnscat2) - test Umbrella detection                  │
│    • HTTPS C2 beaconing (Cobalt Strike, Metasploit) - test XDR detection        │
│    • ICMP tunneling (ptunnel) - test FTD inspection                             │
│  ✓ Evade detection mechanisms:                                                  │
│    • AMP signature evasion (obfuscation, polymorphism)                          │
│    • FTD IPS bypass (fragmentation, encoding)                                   │
│    • Splunk log evasion (event log tampering, sysmon bypass)                    │
│                                                                                  │
│  Deliverables:                                                                  │
│  • Crown jewel access report (business-critical system compromises)             │
│  • Data exfiltration simulation results (what could be stolen)                  │
│  • Persistence mechanisms report (how attacker maintains access)                │
│  • Detection evasion techniques report (what bypassed security controls)        │
│                                                                                  │
│  PHASE 6: REPORTING                                                             │
│  ══════════════════════════════════════════════════════════════════════════     │
│  Duration: Days 13-14 (post-test)                                               │
│  Objective: Document findings, provide remediation roadmap, present to stakeholders│
│                                                                                  │
│  Report Components:                                                             │
│  ✓ Executive Summary (for CISO, CTO, Board):                                    │
│    • Overall security posture score (0-100)                                     │
│    • Critical findings summary (top 5 risks)                                    │
│    • Business impact (financial, reputational, regulatory)                      │
│    • High-level remediation roadmap (timeline, resources)                       │
│                                                                                  │
│  ✓ Technical Findings (for Security, Network Engineering):                      │
│    • Detailed vulnerability descriptions                                        │
│    • Exploitation procedures (step-by-step)                                     │
│    • Evidence (screenshots, packet captures, log excerpts)                      │
│    • CVSS scores, MITRE ATT&CK technique mapping                                │
│    • Remediation recommendations (technical steps)                              │
│                                                                                  │
│  ✓ Attack Narrative (for all stakeholders):                                     │
│    • Timeline of attack progression                                             │
│    • Attack chain diagram (initial access → lateral movement → data exfiltration)│
│    • Detection gaps identified (where Blue Team missed alerts)                  │
│    • Defense-in-depth analysis (which layers failed/succeeded)                  │
│                                                                                  │
│  ✓ Remediation Roadmap:                                                         │
│    • Prioritized action plan (Critical = 7 days, High = 30 days, etc.)          │
│    • Ownership assignments (Network, Security, IT Ops)                          │
│    • Re-test plan (validate fixes in next test cycle)                           │
│                                                                                  │
│  Deliverables:                                                                  │
│  • Executive summary presentation (PowerPoint, 10-15 slides)                    │
│  • Technical report (PDF, 50-100 pages)                                         │
│  • Remediation tracking spreadsheet (Excel/Google Sheets)                       │
│  • Evidence package (screenshots, PCAPs, logs - encrypted ZIP)                  │
│  • Re-test procedures document                                                  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 MITRE ATT&CK Mapping

All penetration test findings are mapped to the MITRE ATT&CK framework to provide standardized taxonomy and improve detection coverage.

**Primary Tactics Tested:**

| Tactic | Description | Test Coverage |
|--------|-------------|--------------|
| **TA0001: Initial Access** | How attackers gain initial foothold | Phishing, VPN exploitation, external web app compromise |
| **TA0002: Execution** | How attackers run malicious code | PowerShell, command-line tools, malware deployment |
| **TA0003: Persistence** | How attackers maintain access | Registry keys, scheduled tasks, backdoor accounts |
| **TA0004: Privilege Escalation** | How attackers gain higher privileges | Kernel exploits, token manipulation, sudo misconfiguration |
| **TA0005: Defense Evasion** | How attackers avoid detection | AMP bypass, log tampering, obfuscation |
| **TA0006: Credential Access** | How attackers steal credentials | Mimikatz, Kerberoasting, password cracking |
| **TA0007: Discovery** | How attackers learn about environment | Network scanning, AD enumeration, service discovery |
| **TA0008: Lateral Movement** | How attackers move through network | Pass-the-Hash, RDP pivoting, SMB exploitation |
| **TA0009: Collection** | How attackers gather data | Database queries, file server access, email harvesting |
| **TA0010: Exfiltration** | How attackers steal data | DNS tunneling, HTTPS upload, cloud storage |
| **TA0011: Command and Control** | How attackers communicate with compromised systems | Cobalt Strike beaconing, DNS C2, HTTPS C2 |

**Detection Coverage Goals:**

| ATT&CK Tactic | Current Detection Rate | Target Detection Rate | Gap Analysis |
|--------------|----------------------|---------------------|--------------|
| Initial Access | 75% | 90% | Need better phishing detection (Secure Email tuning) |
| Execution | 80% | 95% | PowerShell logging improvements (Event ID 4104) |
| Persistence | 60% | 85% | Registry monitoring, scheduled task alerts |
| Privilege Escalation | 65% | 90% | Kernel exploit detection (AMP behavioral) |
| Defense Evasion | 50% | 75% | Log tampering detection (Splunk correlation) |
| Credential Access | 70% | 90% | Mimikatz detection (AMP signatures, behavioral) |
| Discovery | 55% | 80% | Network scanning alerts (NetFlow anomalies) |
| Lateral Movement | 60% | 85% | Pass-the-Hash detection (Splunk Event ID 4624 type 3) |
| Collection | 40% | 70% | Data access monitoring (UEBA baselines) |
| Exfiltration | 55% | 80% | DLP tuning (Umbrella, FTD, Secure Email) |
| Command and Control | 65% | 85% | C2 beaconing detection (XDR, Umbrella Investigate) |

---
