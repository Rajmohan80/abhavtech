# 3.1 SD-WAN Security Overview

## Document Information
| Field | Value |
|-------|-------|
| Document Title | SD-WAN Security Architecture Overview |
| Version | 1.0 |
| Author | Network Security Team |
| Organization | Abhavtech.com |
| Last Updated | December 2025 |
| Status | Production |

---

## Table of Contents
1. [Security Architecture Overview](#security-architecture-overview)
2. [Security Principles](#security-principles)
3. [Threat Landscape](#threat-landscape)
4. [Defense-in-Depth Model](#defense-in-depth-model)
5. [Security Components](#security-components)
6. [Security Governance](#security-governance)

---

## 1. Security Architecture Overview

### 1.1 SD-WAN Security Philosophy

Cisco Catalyst SD-WAN implements a comprehensive security architecture built on zero-trust principles, encryption by default, and layered defense mechanisms.

**Security Architecture Pillars:**
- Encrypted transport (IPsec by default)
- Identity-based access control
- Network segmentation
- Integrated threat detection
- Centralized policy management
- Continuous monitoring and compliance

### 1.2 Security Architecture Diagram

```
+--------------------------------------------------------------------+
|                    SD-WAN SECURITY ARCHITECTURE                     |
+--------------------------------------------------------------------+
|                                                                     |
|  Layer 7: Security Operations                                      |
|  +---------------------------------------------------------------+ |
|  | SIEM Integration | SOC Dashboards | Incident Response | Audit | |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Layer 6: Threat Intelligence                                      |
|  +---------------------------------------------------------------+ |
|  | Talos Feeds | Umbrella | Third-Party TI | Custom IoCs          | |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Layer 5: Application Security                                     |
|  +---------------------------------------------------------------+ |
|  | DPI | App Firewall | UTD/IPS | URL Filter | DNS Security       | |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Layer 4: Network Segmentation                                     |
|  +---------------------------------------------------------------+ |
|  | VPN Segmentation | SGT/TrustSec | Zone-Based FW | ACLs         | |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Layer 3: Data Plane Security                                      |
|  +---------------------------------------------------------------+ |
|  | IPsec Tunnels | AES-256-GCM | Key Management | Anti-Replay     | |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Layer 2: Control Plane Security                                   |
|  +---------------------------------------------------------------+ |
|  | TLS 1.3 | Certificate Auth | Controller Auth | OMP Security    | |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Layer 1: Infrastructure Security                                  |
|  +---------------------------------------------------------------+ |
|  | Hardware Trust | Secure Boot | Hardened OS | Access Control    | |
|  +---------------------------------------------------------------+ |
|                                                                     |
+--------------------------------------------------------------------+
```

### 1.3 Security Scope

| Domain | Coverage | Components |
|--------|----------|------------|
| Control Plane | Controller-to-edge communications | TLS, certificates, OMP |
| Data Plane | Site-to-site tunnel encryption | IPsec, key rotation |
| Management Plane | Administrative access | RBAC, MFA, audit logs |
| Application Layer | Traffic inspection | UTD, IPS, URL filter |
| Integration | Campus/Cloud security | SGT, ISE, SASE |

---

## 2. Security Principles

### 2.1 Zero Trust Architecture

**Zero Trust Principles Applied:**

| Principle | SD-WAN Implementation |
|-----------|----------------------|
| Never trust, always verify | Certificate-based device authentication |
| Least privilege access | Role-based VPN access, SGT policies |
| Assume breach | Segmentation, micro-perimeters |
| Verify explicitly | Continuous authentication, posture checks |
| Secure all paths | Encryption everywhere, no implicit trust |

### 2.2 Defense in Depth

```
+--------------------------------------------------------------------+
|                    DEFENSE IN DEPTH MODEL                           |
+--------------------------------------------------------------------+
|                                                                     |
|  External Perimeter                                                |
|  +---------------------------------------------------------------+ |
|  | DDoS Protection | Rate Limiting | Geo-Blocking | IP Reputation| |
|  +---------------------------------------------------------------+ |
|         |                                                          |
|         v                                                          |
|  Network Perimeter                                                 |
|  +---------------------------------------------------------------+ |
|  | Zone-Based Firewall | ACLs | Stateful Inspection              | |
|  +---------------------------------------------------------------+ |
|         |                                                          |
|         v                                                          |
|  Internal Segmentation                                             |
|  +---------------------------------------------------------------+ |
|  | VPN Separation | VRF Isolation | SGT Enforcement               | |
|  +---------------------------------------------------------------+ |
|         |                                                          |
|         v                                                          |
|  Application Security                                              |
|  +---------------------------------------------------------------+ |
|  | UTD IPS/IDS | URL Filtering | Malware Protection              | |
|  +---------------------------------------------------------------+ |
|         |                                                          |
|         v                                                          |
|  Data Protection                                                   |
|  +---------------------------------------------------------------+ |
|  | Encryption | DLP | Access Control | Audit                      | |
|  +---------------------------------------------------------------+ |
|                                                                     |
+--------------------------------------------------------------------+
```

### 2.3 Security Design Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| Encryption by Default | All WAN traffic encrypted | IPsec AES-256-GCM |
| Centralized Policy | Consistent security across sites | vManage templates |
| Visibility | Complete traffic insight | DPI, NetFlow, logs |
| Automation | Rapid response to threats | Automated remediation |
| Compliance | Meet regulatory requirements | Built-in controls |

---

## 3. Threat Landscape

### 3.1 Threat Categories

| Threat Category | Examples | Risk Level |
|-----------------|----------|------------|
| External Attacks | DDoS, exploitation, scanning | High |
| Insider Threats | Data exfiltration, privilege abuse | High |
| Malware | Ransomware, trojans, spyware | Critical |
| Man-in-the-Middle | Traffic interception, spoofing | High |
| Denial of Service | Resource exhaustion, flooding | Medium |
| Data Breaches | Unauthorized access, leakage | Critical |

### 3.2 Attack Vectors

```
+--------------------------------------------------------------------+
|                    ATTACK VECTOR ANALYSIS                           |
+--------------------------------------------------------------------+
|                                                                     |
|  Internet-Facing Attack Vectors:                                   |
|  +---------------------+  +---------------------+                   |
|  | DIA Breakout Points |  | Cloud Gateways      |                   |
|  | - Port scanning     |  | - API attacks       |                   |
|  | - Exploitation      |  | - Credential theft  |                   |
|  | - DDoS              |  | - Cloud misconfig   |                   |
|  +---------------------+  +---------------------+                   |
|                                                                     |
|  WAN Attack Vectors:                                               |
|  +---------------------+  +---------------------+                   |
|  | Transport Links     |  | Remote Workers      |                   |
|  | - Traffic analysis  |  | - Compromised devs  |                   |
|  | - Injection attacks |  | - Credential theft  |                   |
|  | - Link manipulation |  | - Phishing          |                   |
|  +---------------------+  +---------------------+                   |
|                                                                     |
|  Internal Attack Vectors:                                          |
|  +---------------------+  +---------------------+                   |
|  | Lateral Movement    |  | Privilege Escalation|                   |
|  | - Inter-VPN attacks |  | - Admin compromise  |                   |
|  | - East-west traffic |  | - Policy bypass     |                   |
|  | - Pivot attacks     |  | - Config tampering  |                   |
|  +---------------------+  +---------------------+                   |
|                                                                     |
+--------------------------------------------------------------------+
```

### 3.3 Threat Mitigation Summary

| Threat | Mitigation Control | SD-WAN Feature |
|--------|-------------------|----------------|
| Eavesdropping | Encryption | IPsec AES-256-GCM |
| Spoofing | Authentication | Certificates, IKEv2 |
| Tampering | Integrity checks | HMAC-SHA-256 |
| DoS | Rate limiting | Control policies |
| Lateral movement | Segmentation | VPN isolation, SGT |
| Malware | Threat detection | UTD Snort 3.0 |
| Data exfiltration | DLP | URL filtering, DPI |

---

## 4. Defense-in-Depth Model

### 4.1 Security Layers for Abhavtech

| Layer | Function | Technologies |
|-------|----------|--------------|
| Perimeter | External threat prevention | Zone FW, ACLs, DDoS |
| Network | Traffic security | IPsec, VPN isolation |
| Segment | Micro-segmentation | SGT, VRF separation |
| Application | Content inspection | UTD, URL filter |
| Endpoint | Device security | Posture, compliance |
| Data | Information protection | Encryption, DLP |
| Identity | Access control | ISE, MFA, RBAC |

### 4.2 Security Zone Model

```
+--------------------------------------------------------------------+
|                    SECURITY ZONE ARCHITECTURE                       |
+--------------------------------------------------------------------+
|                                                                     |
|  UNTRUSTED (Internet)                                              |
|  +---------------------------------------------------------------+ |
|  | Public Internet | Cloud Services | Third-Party Networks       | |
|  +---------------------------------------------------------------+ |
|         | Firewall + IPS + URL Filter                              |
|         v                                                          |
|  DMZ (Semi-Trusted)                                                |
|  +---------------------------------------------------------------+ |
|  | Public Services | VPN Termination | Proxy Services            | |
|  +---------------------------------------------------------------+ |
|         | Zone-Based Firewall                                      |
|         v                                                          |
|  CORPORATE (Trusted)                                               |
|  +-------------------------------+-------------------------------+ |
|  | Employee_VPN (SGT 3)          | Guest_VPN (SGT 4)             | |
|  | - Full corporate access       | - Internet only               | |
|  +-------------------------------+-------------------------------+ |
|  | IoT_VPN (SGT 7-8)             | Voice_VPN (SGT 9)             | |
|  | - Limited cloud access        | - Voice services only         | |
|  +-------------------------------+-------------------------------+ |
|         | Strict ACLs                                              |
|         v                                                          |
|  RESTRICTED (High Security)                                        |
|  +---------------------------------------------------------------+ |
|  | Management_VPN (512) | PCI Zone (SGT 12) | Executive (SGT 10) | |
|  +---------------------------------------------------------------+ |
|                                                                     |
+--------------------------------------------------------------------+
```

---

## 5. Security Components

### 5.1 Security Feature Matrix

| Feature | Description | Deployment | License |
|---------|-------------|------------|---------|
| IPsec VPN | Tunnel encryption | All edges | Base |
| Zone-Based FW | Stateful firewall | All edges | Base |
| UTD IPS/IDS | Threat detection | Hub edges | Advantage |
| URL Filtering | Web security | All edges | Advantage |
| DNS Security | Umbrella integration | All edges | Umbrella |
| SGT/TrustSec | Identity segmentation | All edges | Advantage |
| DDoS Protection | Rate limiting | Internet edges | Base |
| SSL Inspection | Encrypted traffic inspection | Select edges | Premier |

### 5.2 Security Component Deployment

| Site Type | Zone FW | UTD | URL Filter | DDoS | SGT |
|-----------|---------|-----|------------|------|-----|
| Mumbai DC | ✅ | ✅ Full | ✅ | ✅ | ✅ |
| Chennai DR | ✅ | ✅ Full | ✅ | ✅ | ✅ |
| Bangalore | ✅ | ✅ Basic | ✅ | ✅ | ✅ |
| Delhi | ✅ | ✅ Basic | ✅ | ✅ | ✅ |
| Noida | ✅ | ❌ | ✅ DNS | ✅ | ✅ |
| London | ✅ | ✅ Full | ✅ | ✅ | ✅ |
| Frankfurt | ✅ | ✅ Basic | ✅ | ✅ | ✅ |
| New Jersey | ✅ | ✅ Full | ✅ | ✅ | ✅ |
| Dallas | ✅ | ✅ Basic | ✅ | ✅ | ✅ |

---

## 6. Security Governance

### 6.1 Security Responsibilities

| Role | Responsibilities |
|------|------------------|
| Security Architect | Design, policy definition, compliance |
| Network Operations | Implementation, monitoring |
| Security Operations | Incident response, threat hunting |
| Compliance Team | Audits, regulatory alignment |
| Management | Risk acceptance, resource allocation |

### 6.2 Security Review Cadence

| Review Type | Frequency | Scope |
|-------------|-----------|-------|
| Policy Review | Quarterly | All security policies |
| Vulnerability Scan | Monthly | All WAN edges |
| Penetration Test | Annual | Full infrastructure |
| Compliance Audit | Annual | PCI, SOC2, ISO27001 |
| Incident Review | Per incident | Lessons learned |

### 6.3 Security Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Mean Time to Detect (MTTD) | <15 minutes | Security events |
| Mean Time to Respond (MTTR) | <1 hour | Incident resolution |
| Encryption Coverage | 100% | All WAN traffic |
| Policy Compliance | >98% | Automated checks |
| Vulnerability Remediation | <30 days | Critical/High CVEs |

---

## Summary

The SD-WAN security architecture for Abhavtech implements a comprehensive, layered defense model with zero-trust principles applied throughout.

**Key Security Highlights:**
- Encryption by default (AES-256-GCM)
- Seven-layer defense-in-depth model
- Zero-trust network access
- Integrated threat detection (UTD)
- End-to-end SGT propagation
- Centralized policy management

**Next Section:** [3.2 Control Plane Security](3-2-control-plane-security.md)

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
