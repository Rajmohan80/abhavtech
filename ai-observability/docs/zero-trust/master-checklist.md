# Zero Trust Architecture Master Implementation Checklist
## Abhavtech Enterprise Security Transformation

---

## Document Purpose
This master checklist provides implementation tracking for Zero Trust Architecture based on **ABHAVTECH-DOCUMENT-1** and **ABHAVTECH-DOCUMENT-1B**. All tasks are derived from actual documented requirements.

**Target Architecture:**
- 6 Hub Sites (Mumbai, Chennai, London, Frankfurt, New Jersey, Dallas)
- 13 Branch Sites across APAC, EMEA, and Americas
- 18 ASA to FTD Firewall replacements
- 3,200 users with Duo Beyond authentication
- XDR/SecureX threat response platform

**Core Components (As Documented):**
- **Cisco XDR & SecureX** - Threat intelligence and automated response
- **ASA  to  FTD Migration** - 18 firewall units with SGT-aware inspection
- **Duo Beyond** - Zero Trust authentication with device trust framework
- **Cisco Secure Access (SASE/Umbrella)** - SIG, DNS security, Cloud Firewall
- **pxGrid Integration** - Real-time identity context sharing

---

## Phase 1A: XDR Platform (Weeks 1-4)

### Week 1: SecureX Tenant Setup
- [ ] Provision SecureX tenant (abhavtech-prod.securex.us.security.cisco.com)
- [ ] Configure Duo SSO for SecureX access
- [ ] Define RBAC roles (Administrator, Analyst, Viewer)
- [ ] Create API credentials for automation
- [ ] Onboard 25 users (security team, NOC)
- [ ] Store API credentials in CyberArk

**Exit Criteria:**
- [ ] SecureX tenant provisioned
- [ ] Duo SSO authentication successful
- [ ] 25 users can log in with assigned roles
- [ ] API credentials generated and secured

### Week 2: ISE pxGrid Integration
- [ ] Enable pxGrid 2.0 on ISE Primary PAN
- [ ] Register SecureX as pxGrid client
- [ ] Configure ISE ribbon in SecureX
- [ ] Validate session queries (test: query user by IP)
- [ ] Verify port 8910 connectivity

**Exit Criteria:**
- [ ] pxGrid enabled on ISE
- [ ] SecureX pxGrid certificate approved
- [ ] Test query: "Who is 10.252.1.50?" returns correct user
- [ ] Zero connectivity errors in SecureX ISE ribbon

### Week 3: FTD Integration
- [ ] Enable FMC API access
- [ ] Create API user for SecureX
- [ ] Configure FTD ribbon in SecureX
- [ ] Validate event ingestion (create test IPS event)
- [ ] Verify IPS events visible in SecureX dashboard

**Exit Criteria:**
- [ ] FMC API enabled, API user created
- [ ] SecureX FTD ribbon configured
- [ ] Test IPS event appears in SecureX within 5 minutes
- [ ] Zero API authentication errors

### Week 4: Umbrella + AMP Integration, UEBA Baseline
- [ ] Configure Umbrella API credentials
- [ ] Configure Umbrella ribbon in SecureX (DNS logs, proxy logs)
- [ ] Configure AMP ribbon (if applicable)
- [ ] Enable UEBA baseline collection (14-day minimum)
- [ ] Configure 5 automated response workflows (WF-TR-001 to WF-TR-005):
  - [ ] WF-TR-001: Phishing Response
  - [ ] WF-TR-002: Malware Containment
  - [ ] WF-TR-003: Lateral Movement Detection
  - [ ] WF-TR-004: DDoS Mitigation
  - [ ] WF-TR-005: Compromised Credentials

**Exit Criteria:**
- [ ] Umbrella ribbon configured, DNS logs ingesting
- [ ] UEBA enabled, collecting user behavior data
- [ ] 5 workflows deployed and tested
- [ ] Zero errors in SecureX event correlation

**Phase 1A Overall Exit Criteria:**
- [ ] SecureX tenant operational with 25 users
- [ ] ISE pxGrid integrated (real-time session queries)
- [ ] FTD integrated (IPS events flowing)
- [ ] Umbrella integrated (DNS logs flowing)
- [ ] UEBA baseline collection started (14+ days required)
- [ ] 5 automated response workflows operational

---

## Phase 1B: Duo Beyond + FTD Migration (Weeks 5-8)

### Week 5: Duo Beyond Deployment + FTD Lab Validation
**Duo Beyond Tasks:**
- [ ] Provision Duo Beyond tenant
- [ ] Install Duo Auth Proxy (Mumbai: 2 nodes, London: 2 nodes)
- [ ] Configure AD/LDAP integration
- [ ] Create 4 user groups:
  - [ ] Corporate Users (2,800 users)
  - [ ] Executives (50 users)
  - [ ] Contractors (200 users)
  - [ ] IT Admins (150 users)
- [ ] Enroll 50 pilot users for device trust
- [ ] Configure SAML SSO for test application

**FTD Lab Validation:**
- [ ] Set up FTD lab environment (2 FTD units)
- [ ] Test ASA configuration migration (FTD Migration Tool)
- [ ] Validate SGT propagation from ISE
- [ ] Test SGACL enforcement on FTD
- [ ] Document migration runbook

**Exit Criteria:**
- [ ] Duo tenant operational, Auth Proxy deployed
- [ ] AD integration functional, 50 pilot users enrolled
- [ ] SAML SSO working for test app
- [ ] FTD lab validated, migration runbook documented

### Week 6: Duo Policy Configuration + FTD Pilot Site
**Duo Policy Tasks:**
- [ ] Configure risk-based authentication policies (4 tiers):
  - [ ] Tier 1: Trusted devices (corporate managed)
  - [ ] Tier 2: Managed BYOD
  - [ ] Tier 3: Unmanaged devices
  - [ ] Tier 4: Unknown/blocked devices
- [ ] Configure Duo SSO integration for:
  - [ ] VPN (existing)
  - [ ] M365
  - [ ] Salesforce
  - [ ] ServiceNow
- [ ] Enable device trust health checks
- [ ] Configure remembered devices (30-day policy)

**FTD Pilot Site:**
- [ ] Deploy FTD pair at Mumbai pilot site
- [ ] Configure HA (Active/Standby)
- [ ] Migrate ASA rules to FTD
- [ ] Enable SGT tagging on FTD interfaces
- [ ] Configure SGACLs on FTD
- [ ] Test traffic flows

**Exit Criteria:**
- [ ] Duo policies configured for all 4 tiers
- [ ] SSO working for 4 applications
- [ ] Device trust health checks operational
- [ ] FTD pilot site operational, ASA rules migrated

### Week 7: Duo Rollout + FTD Hub Site Migration (Phase 1)
**Duo Rollout:**
- [ ] Enroll 500 Corporate Users
- [ ] Enroll 50 Executives
- [ ] Enroll 100 Contractors
- [ ] Enroll 50 IT Admins
- [ ] Monitor authentication success rate (target: >98%)
- [ ] Address user issues/friction

**FTD Migration (Mumbai, Chennai):**
- [ ] Deploy FTD pairs at Mumbai and Chennai
- [ ] Configure HA
- [ ] Migrate ASA configurations
- [ ] Enable SGT enforcement
- [ ] Cutover traffic (off-hours)
- [ ] Decommission ASA units
- [ ] Validate security policies

**Exit Criteria:**
- [ ] 700 users enrolled in Duo
- [ ] Authentication success rate >98%
- [ ] Mumbai and Chennai FTD operational
- [ ] ASA units decommissioned at 2 sites

### Week 8: Duo Full Rollout + FTD Hub Site Migration (Phase 2)
**Duo Rollout:**
- [ ] Enroll remaining 2,300 Corporate Users
- [ ] Enroll remaining 100 Contractors
- [ ] Enroll remaining 100 IT Admins
- [ ] Achieve 100% user coverage (3,200 users)
- [ ] Monitor helpdesk tickets, address issues

**FTD Migration (London, Frankfurt, New Jersey, Dallas):**
- [ ] Deploy FTD pairs at 4 remaining hub sites
- [ ] Configure HA
- [ ] Migrate ASA configurations
- [ ] Enable SGT enforcement
- [ ] Cutover traffic (sequential per site)
- [ ] Decommission ASA units
- [ ] Validate security policies

**Exit Criteria:**
- [ ] 3,200 users enrolled in Duo (100% coverage)
- [ ] All 6 hub sites migrated to FTD
- [ ] 12 ASA units decommissioned (6 hubs × 2)

**Phase 1B Overall Exit Criteria:**
- [ ] Duo Beyond operational: 3,200 users, 4 SSO apps
- [ ] Device trust policies enforced (4 tiers)
- [ ] FTD deployed at 6 hub sites (12 appliances)
- [ ] ASA hub sites decommissioned
- [ ] SGT enforcement operational on FTD

---

## Phase 1C: Secure Access (SASE/Umbrella) (Weeks 9-12)

### Week 9: Umbrella SIG Deployment
- [ ] Provision Umbrella tenant
- [ ] Configure Duo SSO for Umbrella dashboard
- [ ] Create location-based policies (6 hub sites, 13 branches)
- [ ] Configure DNS security policies
- [ ] Deploy Umbrella Virtual Appliances (if required)
- [ ] Configure AD integration for identity-based policies
- [ ] Test DNS resolution and categorization

**Exit Criteria:**
- [ ] Umbrella tenant provisioned
- [ ] 19 location policies configured
- [ ] DNS security operational
- [ ] AD integration functional

### Week 10: Umbrella Policy Configuration
- [ ] Configure URL filtering policies:
  - [ ] Corporate Users: Standard filtering
  - [ ] Executives: Minimal filtering
  - [ ] Contractors: Restrictive filtering
  - [ ] Guest: Internet-only
- [ ] Configure cloud firewall policies
- [ ] Enable malware protection (Cisco Talos)
- [ ] Configure application controls
- [ ] Enable SSL decryption (for inspection)
- [ ] Test policy enforcement per user group

**Exit Criteria:**
- [ ] 4 policy tiers configured
- [ ] Cloud firewall operational
- [ ] Malware protection enabled
- [ ] SSL decryption working

### Week 11: SD-WAN DIA Integration
- [ ] Configure Umbrella on SD-WAN WAN Edge routers
- [ ] Enable Direct Internet Access (DIA) at branches
- [ ] Configure application-aware routing:
  - [ ] SaaS apps (M365, Salesforce)  to  Umbrella
  - [ ] Corporate apps  to  MPLS
  - [ ] Internet browsing  to  Umbrella
- [ ] Test DIA breakout at 3 pilot branches
- [ ] Monitor bandwidth utilization
- [ ] Validate security policy enforcement

**Exit Criteria:**
- [ ] Umbrella configured on 40 WAN Edge routers
- [ ] DIA operational at 3 pilot branches
- [ ] Application-aware routing working
- [ ] Security policies enforced

### Week 12: Umbrella Full Rollout + Roaming Client
- [ ] Roll out DIA to remaining 10 branches
- [ ] Deploy Umbrella Roaming Client to remote workers
- [ ] Configure roaming client policies
- [ ] Enable device posture checks
- [ ] Integrate Umbrella with SecureX (from Week 4)
- [ ] Validate full coverage (campus, branch, remote)
- [ ] Monitor and optimize policies

**Exit Criteria:**
- [ ] DIA operational at all 13 branches
- [ ] Roaming client deployed to remote workers
- [ ] Full coverage achieved
- [ ] Umbrella telemetry flowing to SecureX

**Phase 1C Overall Exit Criteria:**
- [ ] Umbrella SIG operational (campus, branch, remote)
- [ ] DNS security active for all users
- [ ] Cloud firewall policies enforced
- [ ] SD-WAN DIA integrated (13 branches)
- [ ] Roaming client deployed
- [ ] SecureX integration complete

---

## Phase 1D: Validation & FTD Branch Migration (Weeks 13-16)

### Week 13: Branch FTD Migration (First 7 Branches)
- [ ] Deploy FTD at 7 branch sites (standalone or HA based on size)
- [ ] Migrate ASA configurations to FTD
- [ ] Configure SGT enforcement
- [ ] Cutover traffic sequentially
- [ ] Decommission 7 ASA branch units
- [ ] Validate connectivity and policies

**Exit Criteria:**
- [ ] 7 branch sites migrated to FTD
- [ ] ASA units decommissioned

### Week 14: Branch FTD Migration (Remaining 6 Branches)
- [ ] Deploy FTD at 6 remaining branch sites
- [ ] Migrate ASA configurations to FTD
- [ ] Configure SGT enforcement
- [ ] Cutover traffic sequentially
- [ ] Decommission 6 ASA branch units
- [ ] Validate connectivity and policies

**Exit Criteria:**
- [ ] All 13 branch sites migrated to FTD
- [ ] All 18 ASA units decommissioned (total)

### Week 15: End-to-End Testing & Validation
**XDR Validation:**
- [ ] Test all 5 automated response workflows
- [ ] Validate UEBA detections (14+ day baseline complete)
- [ ] Test threat correlation across platforms
- [ ] Validate incident response times (<15 minutes)

**Duo Validation:**
- [ ] Verify 100% user coverage (3,200 users)
- [ ] Test device trust enforcement (4 tiers)
- [ ] Validate SSO for 4 applications
- [ ] Test risk-based step-up authentication
- [ ] Verify helpdesk ticket volume is manageable

**FTD Validation:**
- [ ] Verify SGT enforcement on all 18 FTD units
- [ ] Test SGACLs (permit and deny scenarios)
- [ ] Validate IPS signatures
- [ ] Test HA failover
- [ ] Validate FMC central management

**Umbrella Validation:**
- [ ] Test DNS security (malicious domain blocking)
- [ ] Validate cloud firewall policies
- [ ] Test DIA at all 13 branches
- [ ] Validate roaming client functionality
- [ ] Test application-aware routing on SD-WAN

**Exit Criteria:**
- [ ] All component validations passed
- [ ] Zero critical issues
- [ ] Performance baselines documented

### Week 16: Documentation, Training & Handover
**Documentation:**
- [ ] Update network architecture diagrams
- [ ] Document all configurations (XDR, Duo, FTD, Umbrella)
- [ ] Create operational runbooks
- [ ] Document troubleshooting procedures
- [ ] Update disaster recovery procedures

**Training:**
- [ ] Train security team on XDR/SecureX operations
- [ ] Train NOC on FTD management
- [ ] Train helpdesk on Duo support
- [ ] Conduct user awareness sessions
- [ ] Provide vendor contacts and escalation paths

**Handover:**
- [ ] Transfer operations to NOC/SOC
- [ ] Conduct knowledge transfer sessions
- [ ] Validate 24/7 monitoring coverage
- [ ] Close project activities
- [ ] Obtain stakeholder sign-off

**Exit Criteria:**
- [ ] All documentation complete
- [ ] All teams trained
- [ ] Operations transferred to BAU
- [ ] Project sign-off obtained

**Phase 1D Overall Exit Criteria:**
- [ ] All 13 branch sites migrated to FTD
- [ ] All 18 ASA units decommissioned (complete)
- [ ] End-to-end validation complete
- [ ] Documentation and training complete
- [ ] Operational handover complete

---

## Phase 1 Overall Exit Criteria (16 Weeks)

### XDR Platform
- [ ] SecureX tenant operational with 8 ribbons
- [ ] 5 automated threat response workflows operational
- [ ] UEBA baseline complete (14+ days)
- [ ] Mean time to respond (MTTR) < 15 minutes

### Duo Beyond
- [ ] 100% user coverage (3,200 users)
- [ ] 4 device trust tiers operational
- [ ] 4 SSO integrations complete
- [ ] Authentication success rate > 98%

### FTD Migration
- [ ] 18 FTD units deployed (6 hubs, 13 branches)
- [ ] All 18 ASA units decommissioned
- [ ] SGT enforcement operational on all FTD
- [ ] HA validated at all hub sites

### Secure Access (Umbrella)
- [ ] Umbrella SIG operational (all locations)
- [ ] DNS security active
- [ ] Cloud firewall policies enforced
- [ ] SD-WAN DIA integrated (13 branches)
- [ ] Roaming client deployed

### Integration
- [ ] pxGrid integration between ISE and SecureX
- [ ] FMC API integration with SecureX
- [ ] Umbrella API integration with SecureX
- [ ] Duo SSO for all platforms

### Compliance
- [ ] PCI-DSS controls implemented
- [ ] SOC2 controls implemented
- [ ] GDPR controls implemented
- [ ] Audit logs centralized in SecureX/SIEM

---

## Appendix: Reference Documents

### Document Cross-Reference
| Document | Content |
|----------|---------|
| ABHAVTECH-DOCUMENT-1-ZERO-TRUST-ARCHITECTURE | Architecture, implementation phases |
| ABHAVTECH-DOCUMENT-1B-DETAILED-IMPLEMENTATION-GUIDE | Detailed configurations, scenarios |
| DNAC-ISE-MASTER-CHECKLIST | ISE/pxGrid deployment tasks |
| SDWAN-MASTER-CHECKLIST | SD-WAN DIA integration tasks |

### Detailed Implementation Guides (Document 1B)
- Section 1: XDR/SecureX Platform Implementation
- Section 2: FTD Deployment & ASA Migration
- Section 3: Duo Beyond Implementation
- Real-World Scenarios (6.1-6.4)
- Hardware BOM & Procurement (Appendix A)
- Migration Checklists (Appendix B)
- Configuration Examples (Appendix C)

### Key Appendices from Document 1
- Appendix A: Duo Policy Templates by User Group
- Appendix B: XDR Playbook Library (YAML)
- Appendix C: SASE Policy Matrix
- Appendix D: Risk Scoring Reference Table
- Appendix E: Integration API Reference
- Appendix F: Troubleshooting Guide
- Appendix G: Compliance Mapping

---

## Sign-Off

### Phase 1 Completion Checklist
- [ ] All 4 phases (1A, 1B, 1C, 1D) complete
- [ ] All exit criteria met
- [ ] Zero critical issues outstanding
- [ ] Documentation complete
- [ ] Training delivered
- [ ] Operations team handover complete

### Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| CISO | | | |
| Security Architect | | | |
| Network Architect | | | |
| IT Director | | | |
| Project Manager | | | |

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Organization:** abhavtech.com


---

*End of Checklist*
