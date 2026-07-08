# Scope & Rules of Engagement

## 1. EXECUTIVE SUMMARY & TESTING OVERVIEW

### 1.1 Abhavtech Security Testing Context

Abhavtech operates a complex, multi-platform enterprise infrastructure serving 19 global sites with 15,000+ users across APAC, EMEA, and Americas regions. The security validation program must comprehensively test:

**Infrastructure Under Test:**
- **SD-Access Fabric:** DNAC 2.3.7.x, ISE 14-node cluster, TrustSec SGT micro-segmentation (30+ SGTs)
- **SD-WAN:** vManage 20.15.x, 40+ WAN Edge routers, IPsec/TLOC tunnels, OMP routing
- **Webex Collaboration (Cloud):** 3,200 Webex Calling users, 175 WxCC agents, cloud-based SIP trunks
- **SBC/CUBE (On-Premise):** PSTN gateways in NJ, Mumbai, London (bridge to cloud Webex)
- **Zero Trust Platform:** XDR/SecureX (8 ribbons), Duo Beyond (3,200 users), FTD firewalls (18 units), Umbrella SASE
- **AI/ML Platforms:** Splunk SIEM (100GB/day, MLTK), ThousandEyes (6 agents), AppDynamics APM, Cognition Engine, DNAC Deep Network Model
- **AgenticOps Workflows:** 8 AI-driven automation workflows (WF-001 to WF-008) with guardrail protection

**Migration Status:**
- ✅ **Webex Calling:** Migrated to cloud (from on-premise CUCM)
- ✅ **Webex Contact Center:** Migrated to cloud WxCC (from on-premise UCCX)
- ❌ **CUCM/UCCX:** Decommissioned - NOT in testing scope
- ✅ **SBC/CUBE:** Active on-premise PSTN gateways - IN testing scope

**Business Context:**
- **Regulatory Requirements:** PCI-DSS, SOC2, GDPR, ISO 27001:2022
- **Industry Sector:** Financial Services (high threat landscape - ransomware, BEC, nation-state APTs)
- **Risk Tolerance:** Low (financial services sector with customer trust dependencies)
- **Testing Constraints:** Production environment (must avoid service disruption), 24x7 operations

### 1.2 Penetration Testing Program Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│              ABHAVTECH PENETRATION TESTING PROGRAM STRUCTURE                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  PROGRAM GOVERNANCE                                                              │
│  ══════════════════════════════════════════════════════════════════════════     │
│  • Testing Authority: CISO approval required for all tests                      │
│  • Scope Definition: Network Engineering + Security Team collaboration          │
│  • Rules of Engagement (ROE): Documented, signed before each test               │
│  • Emergency Stop: 24x7 escalation path if production impact detected           │
│  • Legal Protection: Penetration testing authorization letter (legal dept)      │
│                                                                                  │
│  TESTING FREQUENCY                                                               │
│  ══════════════════════════════════════════════════════════════════════════     │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐     │
│  │  QUARTERLY TESTS    │  │   MONTHLY TESTS     │  │  CONTINUOUS TESTS   │     │
│  │  (External Red Team)│  │   (Internal Team)   │  │  (Purple Team)      │     │
│  │                     │  │                     │  │                     │     │
│  │ • Full scope tests  │  │ • Targeted scenarios│  │ • Detection tuning  │     │
│  │ • All platforms     │  │ • Specific platforms│  │ • Blue team drills  │     │
│  │ • 2 weeks duration  │  │ • 2-3 days duration │  │ • Weekly scenarios  │     │
│  │ • Formal report     │  │ • Quick report      │  │ • Iterative improve │     │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘     │
│                                                                                  │
│  TESTING TYPES                                                                   │
│  ══════════════════════════════════════════════════════════════════════════     │
│                                                                                  │
│  External Black-Box Testing (Quarterly)                                         │
│  • Zero knowledge of infrastructure                                             │
│  • Simulates real attacker perspective                                          │
│  • Validates perimeter defenses, detection capabilities                         │
│                                                                                  │
│  Internal Gray-Box Testing (Monthly)                                            │
│  • Standard user credentials (no admin)                                         │
│  • Simulates insider threat, compromised user                                   │
│  • Tests lateral movement, privilege escalation                                 │
│                                                                                  │
│  Purple Team Exercises (Weekly/Bi-weekly)                                       │
│  • Collaborative Red + Blue team                                                │
│  • Focus on detection tuning, response improvement                              │
│  • Iterative testing of specific attack paths                                   │
│                                                                                  │
│  Compliance-Driven Testing (Annual + As Required)                               │
│  • PCI-DSS ASV scans (quarterly)                                                │
│  • PCI-DSS penetration test (annual)                                            │
│  • SOC2 Type II validation (annual)                                             │
│  • ISO 27001 audit support (annual)                                             │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Testing Scope & Boundaries

#### 1.3.1 In-Scope Systems

| Platform Category | Systems Included | Attack Surfaces | Test Depth |
|------------------|-----------------|----------------|-----------|
| **SD-Access Fabric** | DNAC 2.3.7.x, ISE 3.3/3.4 (14 nodes), fabric edge switches, fabric border nodes, wireless controllers | 802.1X bypass, SGT manipulation, rogue AP, VLAN hopping, MAC spoofing | **DEEP:** Full attack simulation, exploit attempts allowed (non-destructive) |
| **SD-WAN** | vManage 20.15.x, vSmart controllers, vBond orchestrators, 40 WAN Edge routers (ISR/ASR platforms) | vManage unauthorized access, OMP route injection, IPsec tunnel hijacking, certificate theft | **DEEP:** Management plane, control plane, data plane testing |
| **Webex Collaboration** | Webex Calling (3,200 users), Webex Contact Center (175 agents), SIP trunks, CUCM (migration state), Expressway-C/E | SIP trunk hijacking, toll fraud simulation, meeting enumeration, conference bridge abuse | **MEDIUM:** Test call scenarios, avoid actual toll fraud charges |
| **Zero Trust Platform** | XDR/SecureX, Duo Beyond (3,200 users), FTD firewalls (18 units), Umbrella SASE, AMP for Endpoints | Credential bypass, MFA fatigue, device trust bypass, firewall policy bypass, DNS hijacking | **DEEP:** Authentication flows, policy enforcement, threat detection |
| **AI/ML Platforms** | Splunk Enterprise (100GB/day), DNAC Deep Network Model, ThousandEyes, AppDynamics, MLTK models | API exploitation, data poisoning attempts, model inference attacks, unauthorized data access | **MEDIUM:** API security, access controls (avoid production ML model corruption) |
| **Cloud Services** | Azure AD, M365, Salesforce, ServiceNow, AWS (limited workloads) | SSO bypass, OAuth token theft, cloud tenant enumeration, API abuse | **MEDIUM:** Test authentication, authorization (avoid cloud service disruption) |
| **End-User Devices** | Windows 10/11 endpoints (12,000), macOS devices (800), mobile devices (iOS/Android 2,500) | Malware execution, credential harvesting, endpoint protection bypass, USB attack vectors | **MEDIUM:** Test on isolated endpoints, avoid production user disruption |

#### 1.3.2 Out-of-Scope / Restricted

**PROHIBITED ATTACKS (Will Cause Production Outage):**
- Denial-of-Service (DoS/DDoS) attacks on production infrastructure
- Resource exhaustion attacks (CPU/memory/storage flooding)
- Database deletion or corruption (production databases)
- Active Directory domain controller attacks (e.g., DC compromise, Kerberos Golden Ticket)
- BGP route injection to ISPs (affects external connectivity)
- Physical destruction of equipment
- Actual toll fraud (international calls generating charges >$100)
- Ransomware deployment (even in test mode)

**RESTRICTED TESTING (Requires Special Approval):**
- Production database queries (read-only, CISO approval)
- IoT/OT systems (manufacturing, building controls - separate approval required)
- Third-party SaaS platforms (vendor permission required)
- Customer-facing systems during business hours (after-hours only)
- Privileged account compromise simulations (Domain Admin, Enterprise Admin - tabletop only)

### 1.4 Success Metrics & KPIs

**Test Execution Metrics:**

| Metric | Measurement | Target | Actual (Baseline) |
|--------|-------------|--------|------------------|
| **Mean Time to Detect (MTTD)** | Time from attack initiation to first alert | <15 minutes | 45 minutes |
| **Mean Time to Respond (MTTR)** | Time from alert to containment action | <30 minutes | 2-4 hours |
| **Detection Rate** | Percentage of attack techniques detected | >85% | 68% |
| **False Positive Rate** | Alerts triggered without actual attack activity | <5% | 12% |
| **Lateral Movement Containment** | Time to detect/block lateral movement after initial compromise | <10 minutes | 60+ minutes |
| **Privilege Escalation Detection** | Ability to detect unauthorized privilege escalation | >90% | 65% |

**Vulnerability Metrics:**

| Severity | Definition | SLA Remediation | Current Count | Target |
|----------|-----------|----------------|---------------|--------|
| **Critical** | Remote code execution, domain admin compromise, direct data breach | 7 days | 0 | 0 |
| **High** | Privilege escalation, authentication bypass, significant data exposure | 30 days | 3 | 0 |
| **Medium** | Information disclosure, configuration weaknesses, limited access | 90 days | 12 | <5 |
| **Low** | Best practice violations, minor exposures | 180 days | 25 | <10 |

**Purple Team Effectiveness:**

| Metric | Description | Target |
|--------|-------------|--------|
| **Detection Coverage Improvement** | Increase in MITRE ATT&CK technique detection after purple team exercises | +15% per quarter |
| **Playbook Execution Speed** | Reduction in automated playbook execution time | -20% per quarter |
| **Alert Tuning** | Reduction in false positives through collaborative refinement | -30% per quarter |

### 1.5 Testing Team Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                   ABHAVTECH PENETRATION TESTING TEAMS                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  RED TEAM (Offensive Security)                                                  │
│  ══════════════════════════════════════════════════════════════════════════     │
│  ┌────────────────────────────────────────────────────────────────────┐         │
│  │  INTERNAL RED TEAM (3 FTE)                                         │         │
│  │  • Lead Penetration Tester (OSCP, OSWP, GPEN)                      │         │
│  │  • Network Security Tester (CCNP Security, CEH)                    │         │
│  │  • Application Security Tester (OWASP, CSSLP)                      │         │
│  │                                                                    │         │
│  │  Responsibilities:                                                 │         │
│  │  • Monthly internal penetration tests                              │         │
│  │  • Purple team exercise execution                                  │         │
│  │  • Social engineering campaigns                                    │         │
│  │  • Custom exploit development (zero-day research)                  │         │
│  └────────────────────────────────────────────────────────────────────┘         │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐         │
│  │  EXTERNAL RED TEAM (Quarterly Engagement)                          │         │
│  │  • Third-party security firm (e.g., Mandiant, CrowdStrike Services)│         │
│  │  • Fresh perspective, unbiased assessment                          │         │
│  │  • Advanced persistent threat (APT) simulation                     │         │
│  │  • Compliance-driven testing (PCI-DSS, SOC2)                       │         │
│  └────────────────────────────────────────────────────────────────────┘         │
│                                                                                  │
│  BLUE TEAM (Defensive Security)                                                 │
│  ══════════════════════════════════════════════════════════════════════════     │
│  ┌────────────────────────────────────────────────────────────────────┐         │
│  │  SOC ANALYSTS (12 FTE, 3 Shifts)                                   │         │
│  │  • Tier 1: Alert triage, initial investigation                     │         │
│  │  • Tier 2: Incident response, threat hunting                       │         │
│  │  • Tier 3: Forensics, advanced threat analysis                     │         │
│  │                                                                    │         │
│  │  Responsibilities:                                                 │         │
│  │  • 24x7 monitoring (XDR, Splunk, DNAC, ISE)                        │         │
│  │  • Incident response playbook execution                            │         │
│  │  • Purple team exercise defense                                    │         │
│  │  • Detection rule tuning                                           │         │
│  └────────────────────────────────────────────────────────────────────┘         │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐         │
│  │  NETWORK ENGINEERING (6 FTE)                                       │         │
│  │  • SD-Access engineers (DNAC, ISE, fabric troubleshooting)         │         │
│  │  • SD-WAN engineers (vManage, OMP, IPsec tunnels)                  │         │
│  │  • Security engineers (FTD, Umbrella, Duo)                         │         │
│  │                                                                    │         │
│  │  Responsibilities:                                                 │         │
│  │  • Configuration review and hardening                              │         │
│  │  • Vulnerability remediation                                       │         │
│  │  • Purple team technical support                                   │         │
│  └────────────────────────────────────────────────────────────────────┘         │
│                                                                                  │
│  PURPLE TEAM (Collaborative)                                                    │
│  ══════════════════════════════════════════════════════════════════════════     │
│  • Weekly/bi-weekly exercises combining Red + Blue teams                        │
│  • Focused on specific MITRE ATT&CK techniques                                  │
│  • Iterative improvement: Attack → Detect → Tune → Retest                       │
│  • Knowledge transfer: Red team teaches Blue team attack methods                │
│  • Metrics-driven: Track detection improvements over time                       │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---
