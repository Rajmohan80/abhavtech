# 2.9 SASE Integration Design

## Document Information
| Field | Value |
|-------|-------|
| Document Title | SASE Integration Design |
| Section Number | 2.9 |
| Version | 1.0 |
| Last Updated | December 30, 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 2.9.1 SASE Architecture Overview

### SASE Strategy

Secure Access Service Edge (SASE) converges network and security functions into a unified cloud-delivered service. Abhavtech.com's SASE strategy leverages Cisco's integrated approach combining SD-WAN with cloud-delivered security services.

### SASE Component Stack

| Layer | Component | Provider | Function |
|-------|-----------|----------|----------|
| Identity | Cisco Duo | Cisco | MFA, Zero Trust Access |
| Network | SD-WAN | Cisco | Connectivity, Routing |
| Security | Umbrella SIG | Cisco | Web Security, DNS Security |
| Access | Cisco Secure Access | Cisco | ZTNA, VPN Replacement |
| Visibility | ThousandEyes | Cisco | Digital Experience Monitoring |

### SASE Architecture Diagram

```
                         SASE ARCHITECTURE - ABHAVTECH
+==============================================================================+
|                                                                              |
|   USERS                              SASE CLOUD                              |
|   +--------+                        +------------------+                     |
|   | Office |----------------------->|                  |                     |
|   | Users  |    SD-WAN Tunnels     |  CISCO UMBRELLA  |                     |
|   +--------+                        |  Secure Internet |                     |
|                                     |  Gateway (SIG)   |                     |
|   +--------+                        |                  |                     |
|   | Remote |----------------------->|  - DNS Security  |---->  INTERNET     |
|   | Users  |    ZTNA / SWG         |  - Web Security  |                     |
|   +--------+                        |  - CASB          |---->  SaaS APPS    |
|                                     |  - DLP           |                     |
|   +--------+                        |  - Malware Prot. |                     |
|   | Branch |----------------------->|                  |---->  PRIVATE      |
|   | Sites  |    IPsec Tunnels      +------------------+       APPS          |
|   +--------+                                                                 |
|                                                                              |
|   CONTROL PLANE                                                             |
|   +------------------------------------------------------------------+      |
|   |                                                                  |      |
|   |   +----------+   +----------+   +----------+   +----------+     |      |
|   |   | SD-WAN   |   | Umbrella |   | Duo      |   | Thousand |     |      |
|   |   | Manager  |   | Dashboard|   | Admin    |   | Eyes     |     |      |
|   |   +----------+   +----------+   +----------+   +----------+     |      |
|   |                                                                  |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
+==============================================================================+
```

---

## 2.9.2 Cisco Umbrella SIG Integration

### SIG Deployment Model

| Deployment Type | Sites | Use Case | Tunnel Type |
|-----------------|-------|----------|-------------|
| Full SIG | Branches without UTD | Complete web security | IPsec |
| DNS Only | All sites | DNS-layer protection | DNS redirect |
| Selective SIG | High-risk users | Additional inspection | Per-user policy |

### Umbrella Data Centers

| Region | Data Center | Sites Served | Latency Target |
|--------|-------------|--------------|----------------|
| India | Mumbai | Mumbai, Chennai, Bangalore, Delhi, Noida | <20ms |
| EMEA | London | London | <15ms |
| EMEA | Frankfurt | Frankfurt | <15ms |
| Americas | Ashburn | New Jersey | <15ms |
| Americas | Dallas | Dallas | <20ms |

### SIG Tunnel Configuration

```
!======================================================================
! UMBRELLA SIG TUNNEL CONFIGURATION - BRANCH SITES
!======================================================================
!
! IKEv2 Proposal
crypto ikev2 proposal UMBRELLA-PROPOSAL
 encryption aes-cbc-256
 integrity sha256
 group 19
!
crypto ikev2 policy UMBRELLA-POLICY
 proposal UMBRELLA-PROPOSAL
!
! IKEv2 Profile
crypto ikev2 profile UMBRELLA-PROFILE
 match identity remote fqdn domain umbrella.com
 identity local fqdn bangalore.abhavtech.com
 authentication remote pre-share key <umbrella-psk>
 authentication local pre-share key <local-psk>
 dpd 10 3 on-demand
!
! IPsec Transform Set
crypto ipsec transform-set UMBRELLA-TS esp-aes 256 esp-sha256-hmac
 mode tunnel
!
! IPsec Profile
crypto ipsec profile UMBRELLA-IPSEC
 set transform-set UMBRELLA-TS
 set ikev2-profile UMBRELLA-PROFILE
!
! SIG Tunnel Interface
interface Tunnel200
 description UMBRELLA-SIG-PRIMARY
 ip unnumbered Loopback0
 ip mtu 1400
 ip tcp adjust-mss 1360
 tunnel source GigabitEthernet0/0/0
 tunnel mode ipsec ipv4
 tunnel destination sig.umbrella.com
 tunnel protection ipsec profile UMBRELLA-IPSEC
!
! Policy-Based Routing for SIG
ip access-list extended SIG-TRAFFIC
 10 permit tcp any any eq 80
 20 permit tcp any any eq 443
 30 permit tcp any any eq 8080
!
route-map SIG-REDIRECT permit 10
 match ip address SIG-TRAFFIC
 set interface Tunnel200
!
interface GigabitEthernet0/0/1
 ip policy route-map SIG-REDIRECT
```

### Umbrella Policy Configuration

| Policy | Scope | Action | Destinations |
|--------|-------|--------|--------------|
| Block Malware | All users | Block | Known malware domains |
| Block Phishing | All users | Block | Phishing sites |
| Block Adult Content | Guest VPN | Block | Adult categories |
| Allow Business Apps | Corporate VPN | Allow | Whitelisted SaaS |
| Inspect SSL | High-risk | Decrypt | Non-sensitive traffic |
| Log All | All users | Log | All traffic |

---

## 2.9.3 Zero Trust Network Access (ZTNA)

### ZTNA Architecture

```
                         ZTNA ARCHITECTURE
+==============================================================================+
|                                                                              |
|   REMOTE USER                        PRIVATE APPLICATIONS                   |
|   +--------+                         +------------------+                   |
|   |        |                         | DC Applications  |                   |
|   | Laptop |                         | - SAP            |                   |
|   | + Duo  |                         | - Oracle EBS     |                   |
|   | + AnyC |                         | - Internal Web   |                   |
|   +---+----+                         +--------+---------+                   |
|       |                                       ^                              |
|       |                                       |                              |
|       v                                       |                              |
|   +---+----+     +----------+     +----------+----------+                   |
|   |  Duo   |---->| Identity |---->| ZTNA               |                   |
|   |  MFA   |     | Verify   |     | Connector          |                   |
|   +--------+     +----------+     | (On-Premises)      |                   |
|       |                           +--------------------+                   |
|       |                                                                      |
|       v                                                                      |
|   +--------+     +----------+                                               |
|   | Secure |---->| App      |     ZTNA PRINCIPLES:                         |
|   | Access |     | Broker   |     - Never trust, always verify              |
|   | Cloud  |     | (Cloud)  |     - Least privilege access                  |
|   +--------+     +----------+     - Continuous validation                    |
|                                   - Application-level access                 |
|                                   - No network-level access                  |
|                                                                              |
+==============================================================================+
```

### ZTNA Policy Matrix

| User Group | Application | Device Posture | MFA Required | Access Level |
|------------|-------------|----------------|--------------|--------------|
| Employees | Internal Apps | Managed + Compliant | Yes | Full |
| Employees | SaaS Apps | Any | Yes | Full |
| Contractors | Project Apps | Managed | Yes | Limited |
| Contractors | SaaS Apps | Any | Yes | Read-only |
| Guests | Guest Portal | Any | No | Internet only |
| IT Admins | All | Managed + Compliant | Yes + Hardware | Full |

### Duo Integration Configuration

```
!======================================================================
! DUO INTEGRATION FOR ZTNA
!======================================================================
!
! Duo Authentication Proxy Configuration (on-premises)
! /etc/duoauthproxy/authproxy.cfg
!
[main]
debug=false
log_dir=/var/log/duo

[ad_client]
host=dc1.abhavtech.com
service_account_username=duo_svc
service_account_password=<encrypted>
search_dn=DC=abhavtech,DC=com

[radius_server_auto]
ikey=<integration_key>
skey=<secret_key>
api_host=api-xxxxx.duosecurity.com
radius_ip_1=10.254.1.20
radius_secret_1=<radius_secret>
client=ad_client
port=1812
failmode=safe
```

---

## 2.9.4 CASB Integration

### Cloud Access Security Broker

| Function | Implementation | Coverage |
|----------|----------------|----------|
| Visibility | API integration | M365, Salesforce, Box |
| Compliance | DLP policies | PCI, GDPR, HIPAA |
| Threat Protection | Malware scanning | File uploads |
| Data Security | Encryption enforcement | Sensitive data |

### CASB Policy Examples

```
+==============================================================================+
| CASB POLICY CONFIGURATION                                                    |
+==============================================================================+
|                                                                              |
| POLICY: Block External Sharing                                              |
| +------------------------------------------------------------------+        |
| | Application: Microsoft 365, Box, Google Drive                    |        |
| | Action: Block sharing with external domains                      |        |
| | Exceptions: Approved partner domains                             |        |
| | Alert: Yes, to Security team                                     |        |
| +------------------------------------------------------------------+        |
|                                                                              |
| POLICY: DLP - Credit Card Detection                                         |
| +------------------------------------------------------------------+        |
| | Pattern: Credit card numbers (Visa, MC, Amex)                    |        |
| | Action: Block upload, quarantine file                            |        |
| | Applications: All sanctioned SaaS                                |        |
| | Alert: Yes, to Compliance team                                   |        |
| +------------------------------------------------------------------+        |
|                                                                              |
| POLICY: Malware Prevention                                                  |
| +------------------------------------------------------------------+        |
| | Trigger: File upload/download                                    |        |
| | Action: Scan with AMP, block if malicious                       |        |
| | Applications: Box, OneDrive, Dropbox                            |        |
| +------------------------------------------------------------------+        |
|                                                                              |
+==============================================================================+
```

---

## 2.9.5 Remote Access VPN Migration

### VPN to ZTNA Migration Path

| Phase | Timeline | Users | Access Method |
|-------|----------|-------|---------------|
| Current | Now | 2,500 | AnyConnect VPN |
| Phase 1 | Month 1-3 | IT Staff (100) | ZTNA Pilot |
| Phase 2 | Month 4-6 | Remote Workers (500) | ZTNA + VPN |
| Phase 3 | Month 7-12 | All Users (2,500) | ZTNA Primary |
| Final | Month 12+ | All Users | ZTNA Only |

### Migration Criteria

| Criterion | VPN | ZTNA | Decision |
|-----------|-----|------|----------|
| Application Compatibility | All | Web/API apps | App assessment |
| Legacy Apps | Supported | Requires connector | Plan connector |
| Performance | Variable | Optimized | ZTNA preferred |
| Security | Network access | App-level | ZTNA preferred |
| User Experience | Client required | Browser-based | ZTNA preferred |

---

## 2.9.6 Digital Experience Monitoring

### ThousandEyes Integration

```
                    THOUSANDEYES INTEGRATION
+==============================================================================+
|                                                                              |
|   MONITORING POINTS                                                          |
|   +------------------------------------------------------------------+      |
|   |                                                                  |      |
|   |   ENTERPRISE AGENTS         CLOUD AGENTS        ENDPOINT AGENTS |      |
|   |   (WAN Edge integrated)     (ThousandEyes       (User devices)  |      |
|   |                              cloud)                              |      |
|   |   - Mumbai DC               - Global PoPs       - Laptops       |      |
|   |   - Chennai DR              - SaaS monitoring   - Mobile        |      |
|   |   - London                                                      |      |
|   |   - Frankfurt                                                   |      |
|   |   - New Jersey                                                  |      |
|   |   - Dallas                                                      |      |
|   |                                                                  |      |
|   +------------------------------------------------------------------+      |
|                                                                              |
|   MONITORING TARGETS:                                                       |
|   - SaaS Applications (M365, Salesforce, Zoom)                             |
|   - Internal Applications (SAP, Oracle)                                    |
|   - Internet paths (hop-by-hop visibility)                                 |
|   - DNS resolution                                                         |
|   - BGP routing                                                            |
|                                                                              |
+==============================================================================+
```

### ThousandEyes Test Configuration

| Test Type | Target | Frequency | Alert Threshold |
|-----------|--------|-----------|-----------------|
| HTTP Server | M365 | 2 min | Latency >500ms |
| Network | Salesforce | 2 min | Loss >2% |
| DNS Server | Internal DNS | 1 min | Resolution >100ms |
| Voice | Zoom | 1 min | MOS <3.5 |
| Page Load | SAP Fiori | 5 min | Load >5s |

---

## 2.9.7 SASE Monitoring and Operations

### Unified Dashboard

| Metric | Source | Threshold | Action |
|--------|--------|-----------|--------|
| SIG Tunnel Status | Umbrella | Down | Auto-failover |
| DNS Block Rate | Umbrella | >10% | Investigate |
| ZTNA Auth Failures | Duo | >5/min | Alert Security |
| DEM Score | ThousandEyes | <7 | Investigate path |
| Policy Violations | CASB | Any | Alert + Log |

### Operational Runbook

| Event | Detection | Response | Escalation |
|-------|-----------|----------|------------|
| SIG tunnel down | vManage alert | Failover to backup | L2 if >15 min |
| High block rate | Umbrella dashboard | Review blocks | Security team |
| ZTNA service degraded | ThousandEyes | Check connector | L2 support |
| DLP violation | CASB alert | Quarantine + investigate | Compliance |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 30, 2025 | Network Architecture Team | Initial release |

---

*This document is part of the Abhavtech.com SD-WAN Documentation Suite*
*Confidential - Internal Use Only*
