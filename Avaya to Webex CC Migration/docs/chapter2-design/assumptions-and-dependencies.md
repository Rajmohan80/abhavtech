# Assumptions and Dependencies

## 1. Overview

This document captures all assumptions made during the design phase and identifies critical dependencies that must be satisfied for successful migration from Avaya to Webex Contact Center. These items represent prerequisites, external constraints, and integration requirements that impact the project timeline and architecture.

---

## 2. Network Infrastructure Assumptions

### 2.1 Bandwidth and Connectivity

**Assumptions:**
- Adequate internet bandwidth exists at all agent locations:
  - **Office locations:** Minimum 100 Mbps symmetrical per 50 agents
  - **Home agents:** Minimum 10 Mbps download / 5 Mbps upload per agent
  
- Network infrastructure supports QoS marking and prioritization
- Existing WAN links have <150ms latency to Cisco Webex cloud regions
- Network has redundant internet circuits for failover

**Dependencies:**
- [ ] ISP bandwidth upgrade completed (if required)
- [ ] Network team validates latency measurements to Webex cloud endpoints
- [ ] QoS policies configured on WAN routers and switches
- [ ] Redundant circuit provisioning confirmed

**Validation Required:**
```bash
# Test bandwidth to Webex cloud
speedtest-cli --server <webex-region-server>

# Test latency
ping -c 100 wxcc-us1.webex.com

# Validate QoS marking
tcpdump -i eth0 -vvv 'port 5060 or port 8443'
```

---

### 2.2 Firewall Rules and Security

**Assumptions:**
- Firewall team can implement required rules within 2-week SLA
- Existing firewall hardware supports required session capacity
- Security policy allows cloud-based contact center services
- TLS inspection does NOT break SIP signaling (or can be bypassed for Webex traffic)

**Critical Firewall Rules Required:**

#### Outbound from On-Premises to Webex Cloud

| Source | Destination | Protocol/Port | Purpose |
|--------|-------------|---------------|---------|
| CUBE/SBC | wxcc-us1.webex.com | TCP/5061 (TLS) | SIP signaling |
| CUBE/SBC | Webex media IPs | UDP/8000-48199 | RTP/SRTP media |
| Agent subnets | *.webex.com | TCP/443 | Agent desktop HTTPS |
| Agent subnets | Webex identity | TCP/443 | SSO authentication |
| Admin workstations | admin.webex.com | TCP/443 | Control Hub access |

#### Inbound from Internet to On-Premises

| Source | Destination | Protocol/Port | Purpose |
|--------|-------------|---------------|---------|
| Carrier SIP trunks | CUBE/SBC public IP | TCP/5060 or 5061 | Inbound calls |
| Carrier SIP trunks | CUBE/SBC public IP | UDP/8000-48199 | Inbound RTP media |

**Dependencies:**
- [ ] Firewall change requests submitted and approved
- [ ] Webex IP ranges obtained from Cisco (dynamic, requires monitoring)
- [ ] TLS inspection policy reviewed and exemptions configured
- [ ] NAT rules configured for SBC public-to-private translation
- [ ] Firewall logging enabled for troubleshooting

- Cisco Webex Contact Center Port Requirements: [Link]
- Webex IP Address Ranges (updated monthly): [Link]

---

### 2.3 DNS Requirements

**Assumptions:**
- Internal DNS servers can resolve public Webex domains
- DNS has low latency (<50ms response time)
- DNS failover mechanisms in place (multiple name servers)

**Required DNS Records:**

**External DNS (Public):**
```
; SIP trunk federation (if using Webex Calling PSTN)
_sip._tls.sip.yourcompany.com. 3600 IN SRV 10 10 5061 wxcc-us1.webex.com.
```

**Internal DNS (Private):**
```
; CUBE/SBC internal references
cube-primary.yourcompany.local.   A   10.50.1.10
cube-secondary.yourcompany.local. A   10.50.1.11
```

**Dependencies:**
- [ ] DNS team validates resolution of *.webex.com domains
- [ ] SRV records created (if using federated SIP)
- [ ] Reverse DNS (PTR) configured for CUBE public IPs
- [ ] DNS monitoring alerts configured

---

### 2.4 Network Time Protocol (NTP)

**Assumptions:**
- All infrastructure components synchronized to accurate time source
- NTP servers accessible from on-premises and cloud components
- Time drift <100ms across all systems

**Dependencies:**
- [ ] NTP sources configured on CUBE/SBC/CUCM
- [ ] Time zone consistency validated
- [ ] Stratum 1 or 2 NTP servers in use

---

## 3. PSTN and Telephony Dependencies

### 3.1 PSTN Carrier Coordination

**Assumptions:**
- Existing carrier contracts allow SIP trunk migration to new endpoints
- Carrier supports TLS/SRTP (if required for cloud-connected PSTN)
- No number porting required (DIDs remain with current carrier)

**Dependencies:**
- [ ] Carrier notification of IP address changes (CUBE/SBC)
- [ ] Carrier testing window scheduled
- [ ] Emergency services (E911) testing completed
- [ ] Toll-free number routing verified

**Critical Carrier Information Needed:**

| Item | Details | Status |
|------|---------|--------|
| Carrier name | [AT&T, Verizon, etc.] | ✅ |
| SIP trunk capacity | [Number of concurrent calls] | ✅ |
| Carrier SBC IP addresses | [List of IPs] | ⏳ |
| Supported codecs | [G.711, G.729, etc.] | ✅ |
| DTMF method | [RFC 2833, SIP INFO] | ✅ |
| Emergency services provider | [West, Intrado, etc.] | ⏳ |

---

### 3.2 DID/Number Inventory

**Assumptions:**
- Complete inventory of all DIDs exists and is accurate
- Number usage documented (which DIDs map to which services)
- No number porting required during migration

**Dependencies:**
- [ ] DID inventory audit completed
- [ ] DID-to-service mapping documented
- [ ] Unused DIDs identified for decommissioning
- [ ] International DIDs inventoried separately

**DID Inventory Template:**

| DID | Country | Type | Current Use | Migration Strategy |
|-----|---------|------|-------------|-------------------|
| +1-800-XX5-1234 | US | Toll-free | Sales main line | Keep with carrier |
| +1-512-XX5-5678 | US | Local | Support queue | Keep with carrier |
| +44-20-7123-4567 | UK | Local | London office | Evaluate porting |

---

### 3.3 CUCM (Cisco Unified Communications Manager)

**Assumptions:**
- CUCM version 12.5+ (supports SIP integration with Webex)
- CUCM has capacity for additional SIP trunks to Webex
- CUCM dial plan documented

**Dependencies:**
- [ ] CUCM version validated and upgraded if necessary
- [ ] SIP trunk license capacity confirmed
- [ ] CUCM backup completed before changes
- [ ] Dial plan analysis documented

**CUCM Integration Points:**

```
CUCM <--SIP--> CUBE <--TLS/SIP--> Webex Contact Center
      
Agent phones registered to CUCM
Contact center calls routed via CUBE to Webex
```

---

## 4. Webex Cloud and Licensing Dependencies

### 4.1 Webex Organization Setup

**Assumptions:**
- Webex organization created and activated
- Control Hub admin access provisioned
- Correct data region selected (US/EU/APAC)

**Dependencies:**
- [ ] Webex organization provisioned by Cisco or partner
- [ ] Admin accounts created with MFA enabled
- [ ] Organizational settings configured (SSO, directory sync)

**Webex Organization Details:**

| Item | Value |
|------|-------|
| Organization ID | [From Control Hub] |
| Data region | US-East |
| Primary admin | admin@yourcompany.com |
| Billing account | [Account number] |

---

### 4.2 License Procurement

**Assumptions:**
- Licenses procured for all agents and supervisors
- Premium vs Standard licensing tier decided
- Add-on features identified (recording, WFM, etc.)

**License Requirements:**

| License Type | Quantity | Unit Cost | Annual Cost |
|--------------|----------|-----------|-------------|
| **Webex Contact Center Premium Agent** | 1,000 | $120/user/month | $1,440,000 |
| **Webex Contact Center Supervisor** | 50 | $90/user/month | $54,000 |
| **Webex Calling (for agents)** | 1,000 | $25/user/month | $300,000 |
| **Call Recording Storage** | 500 hours/month | $0.10/hour | $6,000 |
| **CUBE Session License** | 2,000 sessions | One-time | $50,000 |
| **Total Annual Cost** | | | **$1,850,000** |

**Dependencies:**
- [ ] Purchase order approved and issued
- [ ] Licenses activated in Webex Control Hub
- [ ] License assignment plan documented
- [ ] True-up mechanism for growth established

---

### 4.3 SBC Interconnect Readiness

**Assumptions:**
- Cisco SBC (CUBE) chosen for on-premises connectivity
- SBC hardware procured and racked
- SBC version supports Webex Contact Center integration

**Dependencies:**
- [ ] CUBE hardware delivered: Cisco ISR 4451 or equivalent
- [ ] CUBE IOS-XE version 17.9.x or higher installed
- [ ] CUBE licenses applied (session capacity)
- [ ] CUBE networking configured (IP addresses, routing)

**SBC Hardware Specifications (Minimum):**

| Component | Specification |
|-----------|---------------|
| Model | Cisco ISR 4451 or ASR 1002-HX |
| Memory | 16 GB RAM minimum |
| Storage | 256 GB SSD |
| Network interfaces | 4× 1 GbE or 2× 10 GbE |
| Session capacity | 2,000 concurrent sessions |
| High availability | Active-standby pair required |

---

## 5. Security and Compliance Dependencies

### 5.1 Identity and Access Management

**Assumptions:**
- Azure AD (Entra ID) or Okta available for SSO integration
- SAML 2.0 supported by identity provider
- User directory synchronized and current

**Dependencies:**
- [ ] SSO integration configured between Webex and Azure AD/Okta
- [ ] SAML metadata exchanged
- [ ] User attributes mapped (email, department, location)
- [ ] MFA enabled for all users

**Required User Attributes for SSO:**

| Attribute | Source | Required? |
|-----------|--------|-----------|
| Email (UPN) | Azure AD | ✅ Yes |
| First name | Azure AD | ✅ Yes |
| Last name | Azure AD | ✅ Yes |
| Department | Azure AD | ⚠️ Recommended |
| Location/Site | Azure AD | ⚠️ Recommended |

---

### 5.2 Encryption Requirements

**Assumptions:**
- TLS 1.2 or higher required for all signaling
- SRTP required for media encryption
- Certificates from trusted CA (not self-signed)

**Dependencies:**
- [ ] TLS certificates procured for CUBE/SBC (public CA)
- [ ] Certificate lifecycle management process defined
- [ ] SRTP enabled on CUBE and Webex Contact Center
- [ ] Certificate expiration monitoring configured

**Certificate Requirements:**

```
Subject: CN=cube-primary.yourcompany.com
Subject Alternative Names:
  - cube-primary.yourcompany.com
  - 203.0.113.10 (public IP)
Issuer: DigiCert or equivalent trusted CA
Validity: 2-year maximum
Key size: 2048-bit RSA or 256-bit ECC
```

---

### 5.3 Compliance and Data Protection

**Assumptions:**
- PCI-DSS compliance required for payment card handling
- GDPR compliance required for EU customers
- Call recording consent mechanisms in place

**Dependencies:**
- [ ] Data protection impact assessment (DPIA) completed
- [ ] Webex data processing agreement (DPA) signed
- [ ] Call recording consent workflow designed
- [ ] Data retention policies defined

**Compliance Checklist:**

- [ ] PCI-DSS: Payment masking configured in IVR
- [ ] GDPR: EU data residency confirmed (Webex EU region)
- [ ] HIPAA: (if applicable) Business Associate Agreement (BAA) signed
- [ ] SOC 2: Webex SOC 2 Type II report reviewed

---

## 6. Integration Dependencies

### 6.1 CRM Integration (Salesforce)

**Assumptions:**
- Salesforce instance available for screen-pop integration
- Salesforce APIs accessible from Webex Contact Center
- CTI license available in Salesforce

**Dependencies:**
- [ ] Salesforce admin credentials and API access
- [ ] Webex Contact Center Desktop configured for Salesforce
- [ ] Screen-pop logic and data mapping defined
- [ ] Testing environment established

**Integration Architecture:**

```
Webex Contact Center --HTTPS API--> Salesforce Cloud
                      (CTI Events)
                      
Agent Desktop displays Salesforce embedded
```

---

### 6.2 WFM Integration (Calabrio or Similar)

**Assumptions:**
- Workforce management tool selected (e.g., Calabrio ONE)
- WFM vendor supports Webex Contact Center integration
- Historical data migration plan exists

**Dependencies:**
- [ ] WFM vendor integration guide reviewed
- [ ] API credentials exchanged between Webex and WFM
- [ ] Schedule sync tested
- [ ] Historical data export from Avaya CMS completed

---

### 6.3 Recording and Quality Management

**Assumptions:**
- Call recording solution selected (Webex native or 3rd party)
- Storage capacity planned (on-premises or cloud)
- Quality monitoring workflows defined

**Dependencies:**
- [ ] Recording solution licensing confirmed
- [ ] Storage provisioned: 500 hours @ 64 kbps = ~180 GB/month
- [ ] Quality scorecard templates migrated
- [ ] Regulatory retention requirements documented

---

## 7. Migration-Specific Dependencies

### 7.1 Avaya Data Export

**Assumptions:**
- Avaya CM and CMS accessible for data extraction
- Historical reports can be exported to CSV/Excel
- Vector (call flow) documentation exists

**Dependencies:**
- [ ] Avaya CM administrator access confirmed
- [ ] Agent, skill, and queue data exported
- [ ] Historical call volume reports retrieved (12 months minimum)
- [ ] Vector flowcharts documented or screenshots captured

**Data to Export from Avaya:**

| Data Type | Source | Export Method | Status |
|-----------|--------|---------------|--------|
| Agent list | CM | List agents command | ⏳ |
| Skill assignments | CM | List skills command | ⏳ |
| Queue configuration | CM | List hunt-groups | ⏳ |
| Vectors (IVR flows) | CM | List vectors | ⏳ |
| Historical CDR | CMS | Database export | ⏳ |
| Agent performance | CMS | Report export | ⏳ |

---

### 7.2 Parallel Run Period

**Assumptions:**
- Avaya and Webex can run in parallel for 2-4 weeks
- Agents can be trained on Webex while Avaya remains active
- Call volume can be split for A/B testing

**Dependencies:**
- [ ] Parallel run period approved by business stakeholders
- [ ] Call routing logic supports dual platforms
- [ ] Reporting covers both platforms during transition
- [ ] Rollback plan documented

---

### 7.3 Cutover Window

**Assumptions:**
- Production cutover during off-peak hours (weekend or overnight)
- 8-hour cutover window available
- Rollback possible within 4 hours if critical issues occur

**Dependencies:**
- [ ] Cutover date approved by executive sponsor
- [ ] Change advisory board approval obtained
- [ ] All stakeholders notified (agents, supervisors, IT, carriers)
- [ ] Go/No-Go checklist prepared

---

## 8. Operational Dependencies

### 8.1 Monitoring and Management Tools

**Assumptions:**
- SIEM available for security event correlation (Splunk, QRadar, etc.)
- Network monitoring covers Webex cloud connectivity
- ServiceNow or similar for incident management

**Dependencies:**
- [ ] Webex Contact Center integrated with SIEM
- [ ] Alerts configured for critical thresholds
- [ ] ServiceNow integration for ticket creation
- [ ] Dashboards created for NOC visibility

---

### 8.2 Operational Runbooks

**Assumptions:**
- Tier 1/2/3 support teams trained on Webex Contact Center
- Escalation procedures documented
- Troubleshooting guides created

**Dependencies:**
- [ ] Runbooks created for common scenarios:
  - Agent login issues
  - Call quality problems
  - Queue overflow
  - SBC failover
- [ ] Knowledge base articles published
- [ ] 24×7 support coverage confirmed

---

### 8.3 Business Continuity

**Assumptions:**
- Disaster recovery plan updated for Webex architecture
- RTO (Recovery Time Objective): 1 hour
- RPO (Recovery Point Objective): 15 minutes

**Dependencies:**
- [ ] DR testing completed successfully
- [ ] Alternate routing to backup carrier configured
- [ ] Agent home-office readiness validated
- [ ] Communication tree for outage notifications

---

## 9. Third-Party Vendor Dependencies

### 9.1 Implementation Partner

**Assumptions:**
- Cisco Gold/Premier partner engaged for implementation
- Partner has certified Webex Contact Center specialists
- Statement of Work (SOW) defines deliverables and timeline

**Dependencies:**
- [ ] Partner selected and SOW signed
- [ ] Kickoff meeting completed
- [ ] Partner access to Webex organization granted
- [ ] Weekly status meetings scheduled

---

### 9.2 Carrier Dependencies

**Assumptions:**
- Primary carrier: [Carrier Name]
- Backup carrier: [Carrier Name]
- Both carriers support redundant connectivity

**Dependencies:**
- [ ] Primary carrier change request submitted
- [ ] Backup carrier circuit activated
- [ ] Carrier testing schedule coordinated
- [ ] Emergency contact information exchanged

---

## 10. Training Dependencies

### 10.1 Agent Training

**Assumptions:**
- 4-hour training session per agent
- Training can be conducted in groups of 20-30
- Training environment available

**Dependencies:**
- [ ] Training curriculum developed
- [ ] Training schedule published (3 weeks minimum notice)
- [ ] Training environment provisioned (sandbox queues)
- [ ] Post-training survey prepared

**Training Timeline:**

| Week | Activity | Attendees |
|------|----------|-----------|
| -4 | Supervisor training | 50 supervisors |
| -3 | Agent training batch 1 | 250 agents |
| -2 | Agent training batch 2 | 250 agents |
| -1 | Agent training batch 3 | 250 agents |
| -1 | Agent training batch 4 | 250 agents |

---

### 10.2 IT Operations Training

**Assumptions:**
- NOC, network, and telephony teams require deep-dive training
- Cisco provides implementation training as part of deployment

**Dependencies:**
- [ ] Admin training scheduled (2-day session)
- [ ] Troubleshooting workshop completed
- [ ] Hands-on lab access provided
- [ ] Cisco TAC contact process established

---

## 11. Risk Mitigation Assumptions

### 11.1 Key Risks and Mitigation

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|------------|--------|------------|-------|
| Firewall delays | Medium | High | Submit FW requests early (4 weeks ahead) | Network team |
| License delivery delay | Low | High | Order licenses 6 weeks before cutover | Procurement |
| Carrier coordination | Medium | Critical | Weekly carrier syncs, escalation path | Telecom team |
| SSO integration issues | Medium | Medium | Test SSO 6 weeks before cutover | IAM team |
| Agent adoption resistance | High | Medium | Change management program, early wins | Training team |

---

## 12. Pre-Migration Checklist

Before proceeding to implementation, validate:

### Network Prerequisites
- [ ] Bandwidth confirmed adequate
- [ ] Firewall rules implemented and tested
- [ ] DNS resolution validated
- [ ] QoS policies configured
- [ ] Redundant circuits active

### Telephony Prerequisites
- [ ] Carrier coordination completed
- [ ] DID inventory accurate
- [ ] CUBE hardware installed and licensed
- [ ] CUCM integration tested

### Webex Cloud Prerequisites
- [ ] Organization provisioned
- [ ] Licenses activated
- [ ] SSO integration completed
- [ ] Admin accounts created

### Security Prerequisites
- [ ] TLS certificates installed
- [ ] SRTP enabled
- [ ] Compliance review passed
- [ ] Encryption validated

### Integration Prerequisites
- [ ] CRM integration tested
- [ ] WFM integration confirmed
- [ ] Recording solution active
- [ ] Monitoring tools integrated

### Operational Prerequisites
- [ ] Training completed
- [ ] Runbooks published
- [ ] DR tested
- [ ] Support team ready

---

## 14. References

- **Webex Contact Center Prerequisites:** [Cisco Documentation]
- **Enterprise Firewall Policy:** [Internal Doc]
- **Carrier Contracts:** [Legal/Procurement]
- **Compliance Requirements:** [Legal/Compliance Team]

---
