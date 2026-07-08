# README: Chapter 3 - Network and Security
## Avaya to Webex Contact Center Migration

---

## Document Overview

**Chapter 3: Network and Security** provides detailed implementation specifications and security hardening procedures for the network infrastructure supporting your Avaya to Webex Contact Center migration.

---

## Purpose

This chapter guides you through:
- Integrating Webex Contact Center with your existing Avaya network infrastructure
- Configuring CUBE (Cisco Unified Border Element) for SIP trunking
- Implementing firewall rules for Webex cloud connectivity
- Enforcing encryption policies (TLS/SRTP)
- Managing phased migration with Avaya and Webex coexistence

---

## Who Should Use This Document

| Role | Primary Use | Key Sections |
|------|-------------|--------------|
| **Network Engineer** | Internet upgrade, routing, QoS configuration | Sections 2, 8-10 |
| **Voice Engineer** | CUBE configuration, SIP trunks, dial plans | Section 3 |
| **Security Engineer** | Firewall rules, encryption, certificates | Sections 4, 5, 7 |
| **Project Manager** | Migration phases, validation checklists | Sections 6, 8, 11 |
| **Operations Team** | Monitoring, troubleshooting, incident response | Sections 7, 9 |

---

## Document Structure

### **Section 1: Overview**
- Document strategy and scope
- Cross-references to Chapter 2 (Design)

### **Section 2: Network Integration and Changes** MIGRATION-FOCUSED
- Minimal-change approach to existing Avaya LAN
- CUBE placement in existing network
- Internet bandwidth upgrade (200 Mbps → 1 Gbps)
- Coexistence architecture (Avaya + Webex parallel)
- QoS adjustments (not new implementation)

### **Section 3: SBC Interconnect Configuration** CRITICAL
- Complete CUBE dial-peer configurations (copy-paste ready)
- Certificate management (installation, renewal)
- SIP profiles and header manipulation
- Dial plan normalization (E.164)
- High availability and failover

### **Section 4: Firewall Rules** CRITICAL
- Detailed firewall rules table (10+ rules)
- Webex IP ranges (170.72.x.x, 170.133.x.x, 64.68.x.x)
- NAT configuration
- IPS/IDS exclusions
- Configuration examples (Palo Alto, Cisco ASA)

### **Section 5: Encryption Policy** COMPLIANCE
- In-Transit: TLS 1.2+, SRTP, HTTPS
- At-Rest: Call recordings, databases, backups
- Key Management: Certificates, SRTP keys, API tokens
- Compliance: PCI-DSS, HIPAA, GDPR, SOC 2
- Verification and testing procedures

### **Section 6: Phased Migration Network Considerations** NEW
- Coexistence architecture (Avaya + Webex parallel)
- Call routing by migration wave (10% → 90%)
- Bandwidth usage during parallel operation
- Dual system monitoring
- Rollback plan and triggers

### **Section 7: Security Monitoring and Incident Response**
- SIEM integration (Splunk/QRadar)
- Alert triggers and thresholds
- Incident classification (P1-P4)
- Security audit schedule

### **Section 8: Network and Security Validation**
- Pre-production testing checklist
- Go-live validation procedures
- Continuous monitoring KPIs

### **Section 9: Troubleshooting Guide**
- Common network issues (latency, one-way audio)
- Common security issues (TLS failures)
- Diagnostic commands
- Escalation matrix

### **Section 10: Change Management**
- Network change control process
- Configuration backup schedule
- Maintenance windows

### **Section 11: Summary and Recommendations**
- Critical implementation actions (must-do before go-live)
- Post-migration hardening (Week 1-4)
- Key success factors for migration

### **Appendix**
- Webex Contact Center IP ranges
- Recommended reading and external resources

---

## Quick Start Guide

### For Network Engineers:

1. **Read Section 2** - Understand minimal LAN changes
2. **Review Section 2.4** - Internet bandwidth upgrade requirements
3. **Review Section 2.7** - QoS policy adjustments
4. **Skip to Section 8** - Validation procedures

### For Voice Engineers:

1. **Start with Section 3** - CUBE configuration (most detailed)
2. **Focus on Section 3.2** - SIP trunk dial-peer configs
3. **Review Section 3.3** - Certificate installation
4. **Review Section 9** - Troubleshooting SIP/voice issues

### For Security Engineers:

1. **Start with Section 4** - Firewall rules (critical)
2. **Review Section 5** - Encryption policy (TLS/SRTP)
3. **Focus on Section 5.4** - Compliance requirements (PCI/HIPAA)
4. **Review Section 7** - Security monitoring and incident response

### For Project Managers:

1. **Read Section 6** - Phased migration considerations
2. **Review Section 6.2** - Call routing during migration waves
3. **Review Section 8** - Validation checklists
4. **Review Section 11** - Critical actions and success factors

---

## Critical Prerequisites

Before implementing Chapter 3, ensure you have completed:

### From Chapter 1 (Discovery):
- [ ] Existing Avaya network documentation reviewed
- [ ] Current bandwidth utilization measured
- [ ] Agent count and locations confirmed

### From Chapter 2 (Design):
- [ ] Network architecture designed (Section 2.3)
- [ ] SBC architecture designed (Section 2.4)
- [ ] Security requirements defined (Section 2.5)
- [ ] Design approvals obtained

### Additional Prerequisites:
- [ ] CUBE hardware procured (2× Cisco ASR 1002-HX or equivalent)
- [ ] Internet circuit upgrade ordered (dual 500 Mbps circuits)
- [ ] TLS certificates ordered from public CA (DigiCert, etc.)
- [ ] Firewall change control window scheduled
- [ ] Webex Contact Center licenses purchased

---

## Key Decisions Required

Before implementation, you must decide:

### Network Decisions:
- [ ] **Internet provider(s):** Which ISPs for dual circuits?
- [ ] **CUBE placement:** Which existing voice VLAN subnet?
- [ ] **Public IP addresses:** Static IPs for CUBE NAT?
- [ ] **Maintenance window:** When to perform network changes?

### Security Decisions:
- [ ] **Certificate authority:** DigiCert, Let's Encrypt, or other?
- [ ] **Firewall vendor:** Palo Alto, Cisco ASA, Fortinet?
- [ ] **Compliance requirements:** PCI-DSS, HIPAA, GDPR needed?
- [ ] **IPS/IDS:** Bypass for Webex traffic or inspect?

### Migration Decisions:
- [ ] **Migration approach:** Phased (recommended) or cutover?
- [ ] **Pilot group:** Which 100 agents for Wave 1?
- [ ] **Coexistence duration:** How long to run both systems?
- [ ] **Rollback criteria:** What triggers abort/rollback?

---

## Implementation Checklist

Use this high-level checklist to track progress:

### Phase 1: Infrastructure Preparation (Week 1-2)
- [ ] Upgrade internet circuits (200 Mbps → 1 Gbps)
- [ ] Install CUBE hardware in existing voice VLAN
- [ ] Obtain and install TLS certificates
- [ ] Add static routes to internet gateway

### Phase 2: CUBE Configuration (Week 2-3)
- [ ] Configure dial-peers for Webex trunk (Section 3.2)
- [ ] Configure SIP profiles and header manipulation (Section 3.4)
- [ ] Configure dial plan normalization (Section 3.5)
- [ ] Configure DTMF relay (Section 3.6)
- [ ] Configure SIP options keepalive (Section 3.7)

### Phase 3: Firewall Configuration (Week 3)
- [ ] Add firewall rules for Webex IP ranges (Section 4.1)
- [ ] Configure NAT for CUBE (Section 4.3)
- [ ] Configure IPS/IDS exclusions (Section 4.4)
- [ ] Enable firewall logging (Section 4.5)

### Phase 4: Security Hardening (Week 3-4)
- [ ] Enforce TLS 1.2+ on CUBE (Section 5.1.1)
- [ ] Enable SRTP encryption (Section 5.1.2)
- [ ] Configure certificate lifecycle monitoring (Section 5.3.1)
- [ ] Validate compliance requirements (Section 5.4)

### Phase 5: Testing and Validation (Week 4)
- [ ] Pre-production testing (Section 8.1)
- [ ] TLS handshake verification (Section 5.5.1)
- [ ] SRTP encryption verification (Section 5.5.1)
- [ ] Firewall rule validation (Section 4.1)
- [ ] Test call quality (MOS, latency, jitter)
- [ ] Failover testing (dual circuits)

### Phase 6: Go-Live Preparation (Week 5)
- [ ] Configure monitoring and alerting (Section 8.3)
- [ ] Document rollback procedures (Section 6.6)
- [ ] Brief operations team on troubleshooting (Section 9)
- [ ] Schedule go-live and maintenance windows

---

## Related Documents

| Document | Relationship | Key Sections |
|----------|--------------|--------------|
| **Chapter 2: Design** | Provides design rationale | Sections 2.3 (Network), 2.4 (SBC), 2.5 (Security) |
| **Chapter 4: Implementation** | Next step after Chapter 3 | Section 4.1 (CUBE config), 4.5 (Testing) |
| **capacity-and-sizing.md** | Bandwidth calculations | Section 2 (Network Bandwidth) |
| **dr-and-resiliency.md** | Network redundancy design | Section 6 (Network DR) |
| **assumptions-and-dependencies.md** | License requirements | Section 4.2 (Agent licensing) |

---

## Support and Escalation

### Internal Support:
- **Network Team:** CUBE, routing, QoS issues
- **Security Team:** Firewall, certificates, encryption
- **Voice Team:** SIP trunks, dial plans, call quality

### External Support:
- **Cisco TAC:** Webex Contact Center platform issues (1-800-553-2447)
- **Internet Provider:** Circuit outages, bandwidth issues
- **Certificate Authority:** Certificate renewal, validation issues

### Escalation Path:
1. **L1:** NOC (24/7 monitoring)
2. **L2:** Network/Voice/Security Teams
3. **L3:** Senior Engineers, Architects
4. **L4:** Cisco TAC, Vendor support

---

## Best Practices

### Network:
✅ Leverage existing Avaya LAN infrastructure (minimal changes)  
✅ Upgrade internet bandwidth BEFORE starting migration  
✅ Use dual internet circuits for 99.99% uptime  
✅ Test failover scenarios before go-live  
✅ Monitor bandwidth during coexistence (Avaya + Webex)

### Security:
✅ Enforce TLS 1.2+ and SRTP for all Webex traffic  
✅ Use public CA certificates (DigiCert, etc.)  
✅ Monitor certificate expiry (30-day alerts)  
✅ Log all firewall denied connections for 30 days  
✅ Conduct security scan before go-live (SSL Labs, Nessus)

### Migration:
✅ Start with pilot group (100 agents, 10%)  
✅ Run Avaya and Webex in parallel during coexistence  
✅ Document rollback procedures before each wave  
✅ Monitor both systems simultaneously  
✅ Remove Avaya infrastructure only after full cutover

---

## Common Pitfalls to Avoid

### Network Pitfalls:
❌ **Insufficient bandwidth:** Don't undersize internet circuits (use 1 Gbps minimum)  
❌ **QoS misconfiguration:** Ensure voice traffic marked DSCP EF (46)  
❌ **Asymmetric routing:** Verify NAT and firewall state tables  
❌ **Ignoring latency:** Monitor RTT to Webex DC (<100ms target)

### Security Pitfalls:
❌ **Expired certificates:** Set up alerts 30 days before expiry  
❌ **Weak ciphers:** Use TLS 1.2+ only (disable TLS 1.0/1.1)  
❌ **Missing firewall rules:** Verify all Webex IP ranges allowed  
❌ **IPS false positives:** Bypass inspection for SRTP traffic

### Migration Pitfalls:
❌ **Skipping testing:** Always test CUBE connectivity before migration  
❌ **No rollback plan:** Document how to revert if issues arise  
❌ **Migrating too fast:** Phased approach reduces risk  
❌ **Poor monitoring:** Set up alerts for both systems during coexistence

---

## Additional Resources

### Cisco Documentation:
- [CUBE Configuration Guide](https://www.cisco.com/c/en/en/td/docs/ios-xml/ios/voice/cube/configuration/cube-book.html)
- [Webex Contact Center Network Requirements](https://help.webex.com/en-us/article/WBX000028782/)
- [Webex Contact Center Security Whitepaper](https://www.cisco.com/c/dam/en/us/products/collateral/contact-center/webex-contact-center/white-paper-c11-744249.pdf)

### Standards and Compliance:
- [NIST Cryptographic Standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- [PCI-DSS Requirements v4.0](https://www.pcisecuritystandards.org/)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/)

### Tools:
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/) - Test TLS configuration
- [OpenSSL](https://www.openssl.org/) - Certificate management and testing
- [Wireshark](https://www.wireshark.org/) - Packet capture and analysis

---

## FAQ

### Q: Do I need to redesign my entire network for Webex migration?
**A:** No. This chapter adopts a **minimal-change approach**. You keep your existing Avaya LAN infrastructure (VLANs, IP addressing, routing). The main changes are: (1) Internet bandwidth upgrade, (2) Add CUBE to existing voice VLAN, (3) Firewall rules for Webex, (4) QoS adjustments.

### Q: Can Avaya and Webex run in parallel during migration?
**A:** Yes. Section 6 covers phased migration with both systems coexisting. You can migrate agents in waves (10% → 50% → 90% → 100%) while both platforms are active.

### Q: What bandwidth do I need for 1,000 agents?
**A:** Total: ~682 Mbps (voice: 87 Mbps, agent desktop: 500 Mbps, video: 75 Mbps, management: 20 Mbps). We recommend dual 500 Mbps circuits (1 Gbps total) for 30% headroom. See Section 2.4 for details.

### Q: Do I need to change agent IP addresses?
**A:** No. Agents remain on their existing VLAN and keep their IP addresses. They access Webex via HTTPS (port 443) through their existing network connection.

### Q: What firewall ports need to be opened for Webex?
**A:** Key ports: TCP 5061 (SIP/TLS), UDP 8000-48199 (SRTP media), TCP 443 (Agent desktop/HTTPS). See Section 4.1 for complete firewall rules table.

### Q: Is encryption mandatory for Webex Contact Center?
**A:** Yes. Webex requires TLS 1.2+ for SIP signaling and SRTP for media encryption. This is enforced by the Webex cloud platform. See Section 5.1 for configuration.

### Q: How long does the network implementation take?
**A:** Typical timeline: 4-5 weeks (Week 1-2: Infrastructure prep, Week 2-3: CUBE config, Week 3: Firewall, Week 3-4: Security hardening, Week 4: Testing). See Implementation Checklist above.

### Q: What happens if internet circuit fails during a call?
**A:** With dual circuits and proper failover configuration (Section 2.9), failover occurs in <5 seconds. Active calls are preserved via TCP keepalive. New calls route through backup circuit automatically.

---

## Success Criteria

You've successfully completed Chapter 3 when:

- [ ] Internet bandwidth upgraded to 1 Gbps (dual 500 Mbps circuits)
- [ ] CUBE installed and configured in existing voice VLAN
- [ ] TLS certificates installed and validated (no expiry warnings)
- [ ] Firewall rules deployed for all Webex IP ranges
- [ ] TLS 1.2+ and SRTP encryption verified (packet capture)
- [ ] Pre-production testing completed (all tests passed)
- [ ] Monitoring and alerting configured for CUBE and network
- [ ] Operations team trained on troubleshooting procedures
- [ ] Rollback plan documented and tested
- [ ] All validation checklists completed (Section 8.1)

---
