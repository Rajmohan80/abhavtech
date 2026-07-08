# 3.2 Control Plane Security

## Document Information
| Item | Details |
|------|---------|
| Document ID | SDWAN-SEC-3.2 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Abhavtech Network Architecture Team |
| Classification | Internal Use |

## Executive Summary

Control plane security forms the foundation of SD-WAN trustworthiness. This section details the comprehensive security mechanisms protecting Abhavtech's SD-WAN control plane including certificate-based authentication, DTLS encryption, OMP security, and controller hardening. All control plane communications are encrypted and mutually authenticated using X.509 certificates issued by a hierarchical PKI infrastructure.

---

## 1. Control Plane Security Architecture

### 1.1 Control Plane Overview

```
+------------------------------------------------------------------+
|                    CONTROL PLANE SECURITY                         |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+    DTLS 1.2     +------------------+       |
|  |   SD-WAN Manager |<--------------->|    vSmart        |       |
|  |   (vManage)      |   Port 8443     |   Controller     |       |
|  +------------------+                 +------------------+       |
|          ^                                    ^                   |
|          | HTTPS 443                          | DTLS 12346       |
|          | TLS 1.2                            | OMP Protocol     |
|          v                                    v                   |
|  +------------------+    DTLS 12346   +------------------+       |
|  |   vBond          |<--------------->|   WAN Edge       |       |
|  |   Orchestrator   |   Orchestration |   Router         |       |
|  +------------------+                 +------------------+       |
|                                                                   |
|  Security Mechanisms:                                            |
|  - Mutual TLS/DTLS Authentication                                |
|  - X.509 Certificate Validation                                  |
|  - Certificate Revocation (OCSP/CRL)                            |
|  - Perfect Forward Secrecy                                       |
|  - Replay Protection                                             |
+------------------------------------------------------------------+
```

### 1.2 Control Plane Communication Matrix

| Source | Destination | Protocol | Port | Security | Purpose |
|--------|-------------|----------|------|----------|---------|
| WAN Edge | vBond | DTLS | 12346 | Certificate | Discovery/auth |
| WAN Edge | vSmart | DTLS | 12346 | Certificate | OMP peering |
| WAN Edge | vManage | HTTPS | 8443 | Certificate | Config/telemetry |
| vSmart | vSmart | DTLS | 12346 | Certificate | Inter-controller |
| vManage | vSmart | DTLS | 8443 | Certificate | Policy push |
| vManage | vBond | HTTPS | 443 | Certificate | Orchestration |
| Admin | vManage | HTTPS | 443 | SAML/MFA | Management |

### 1.3 Security Protocol Stack

```
+------------------------------------------------------------------+
|                     PROTOCOL SECURITY STACK                       |
+------------------------------------------------------------------+
|                                                                   |
|  Layer 7 (Application):                                          |
|  +----------------------------------------------------------+   |
|  | OMP Protocol | REST API | NETCONF | CLI (SSH)            |   |
|  +----------------------------------------------------------+   |
|                              |                                   |
|  Layer 6 (Presentation):     |                                   |
|  +----------------------------------------------------------+   |
|  | JSON/XML Encoding | Certificate Validation                |   |
|  +----------------------------------------------------------+   |
|                              |                                   |
|  Layer 5 (Session):          |                                   |
|  +----------------------------------------------------------+   |
|  | DTLS 1.2 Session | TLS 1.2 Session | Session Tickets      |   |
|  +----------------------------------------------------------+   |
|                              |                                   |
|  Layer 4 (Transport):        |                                   |
|  +----------------------------------------------------------+   |
|  | UDP (OMP/DTLS) | TCP (HTTPS/SSH) | Port Security          |   |
|  +----------------------------------------------------------+   |
|                              |                                   |
|  Layer 3 (Network):          |                                   |
|  +----------------------------------------------------------+   |
|  | IPv4/IPv6 | VPN 0 (Transport) | ACL Protection           |   |
|  +----------------------------------------------------------+   |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. Certificate-Based Authentication

### 2.1 PKI Architecture

```
+------------------------------------------------------------------+
|                    CERTIFICATE HIERARCHY                          |
+------------------------------------------------------------------+
|                                                                   |
|                    +---------------------+                        |
|                    |    Cisco Root CA    |                        |
|                    |  (Built-in Trust)   |                        |
|                    +----------+----------+                        |
|                               |                                   |
|           +-------------------+-------------------+               |
|           |                                       |               |
|   +-------v-------+                     +---------v---------+    |
|   | Cisco vManage |                     | Enterprise PKI    |    |
|   | Signing CA    |                     | (Abhavtech CA)    |    |
|   +-------+-------+                     +---------+---------+    |
|           |                                       |               |
|   +-------v-------+                     +---------v---------+    |
|   | Controller    |                     | Custom WAN Edge   |    |
|   | Certificates  |                     | Certificates      |    |
|   +---------------+                     +-------------------+    |
|                                                                   |
|   Certificate Types:                                             |
|   - Root CA: Cisco (built-in) + Enterprise CA                   |
|   - Controller: vManage/vSmart/vBond signed certs               |
|   - WAN Edge: Device identity certificates                      |
|   - Enterprise CA: Optional for custom certificates              |
+------------------------------------------------------------------+
```

### 2.2 Certificate Types and Usage

| Certificate Type | Issued By | Usage | Validity | Rotation |
|------------------|-----------|-------|----------|----------|
| Root CA | Cisco | Trust anchor | 10 years | N/A |
| Controller Identity | vManage CA | Controller auth | 10 years | Manual |
| WAN Edge Identity | vManage CA | Device auth | 1 year | Automatic |
| Enterprise CA | Internal PKI | Custom trust | 5 years | Annual |
| Admin SAML | IdP (Azure AD) | User auth | 8 hours | Session |
| API Token | vManage | Automation | 24 hours | Per-request |

### 2.3 Certificate Configuration

#### vManage Enterprise CA Integration

```
! Enterprise CA Certificate Installation
! Step 1: Upload Enterprise Root CA
! vManage UI: Administration > Settings > Enterprise Root CA

! Step 2: Generate CSR for vManage
sdwan
 certificate generate csr
  common-name "vmanage-cluster.abhavtech.com"
  organization "Abhavtech"
  organizational-unit "Network Operations"
  locality "Mumbai"
  state "Maharashtra"
  country "IN"
  email "netops@abhavtech.com"
  validity 3650
  key-size 2048

! Step 3: Install signed certificate
sdwan
 certificate install /home/admin/vmanage-signed.pem

! Verify certificate installation
show sdwan certificate installed
```

#### WAN Edge Certificate Configuration

```
! WAN Edge Device Certificate (Automatic via vManage)
! Configuration pushed during ZTP/onboarding

sdwan
 certificate
  device-certificate generate
   organization-name "Abhavtech"
   organization-unit "SD-WAN"
   validity 365
  !
 !

! Verify WAN Edge certificate
show sdwan certificate serial
show sdwan certificate root-ca-cert
show sdwan certificate installed
```

### 2.4 Certificate Validation Process

```
+------------------------------------------------------------------+
|              CERTIFICATE VALIDATION WORKFLOW                      |
+------------------------------------------------------------------+
|                                                                   |
|  WAN Edge                    vBond                   vManage     |
|     |                          |                        |        |
|     |-- 1. DTLS Hello -------->|                        |        |
|     |   (Client Certificate)   |                        |        |
|     |                          |                        |        |
|     |<-- 2. Server Hello ------|                        |        |
|     |   (Server Certificate)   |                        |        |
|     |                          |                        |        |
|     |   3. Certificate Chain   |                        |        |
|     |      Validation          |                        |        |
|     |   - Signature verify     |                        |        |
|     |   - Validity period      |                        |        |
|     |   - Revocation check     |                        |        |
|     |                          |                        |        |
|     |-- 4. Key Exchange ------>|                        |        |
|     |   (ECDHE for PFS)        |                        |        |
|     |                          |                        |        |
|     |<-- 5. vSmart List -------|                        |        |
|     |                          |                        |        |
|     |                          |                        |        |
|     |--------------------------- 6. OMP to vSmart ------------->|
|     |                          |     (Authenticated)            |
|     |                          |                        |        |
|  Certificate Checks:          Certificate Checks:               |
|  - CN matches expected        - Serial in whitelist             |
|  - Not expired                - Organization valid              |
|  - Not revoked (CRL/OCSP)     - Root CA trusted                 |
|  - Valid chain                - Device authorized               |
+------------------------------------------------------------------+
```

### 2.5 Certificate Revocation

```
! Certificate Revocation Configuration
! vManage: Configuration > Certificates > Enterprise Certificate

! Option 1: CRL Distribution Point
crypto pki trustpoint ABHAVTECH-CA
 enrollment url http://pki.abhavtech.com/certsrv
 revocation-check crl
 crl cache delete-after 60
 crl-cache query url http://pki.abhavtech.com/crl/abhavtech.crl

! Option 2: OCSP Responder
crypto pki trustpoint ABHAVTECH-CA
 revocation-check ocsp
 ocsp url http://ocsp.abhavtech.com

! Combined with fallback
crypto pki trustpoint ABHAVTECH-CA
 revocation-check crl ocsp

! Verify revocation status
show crypto pki certificates
show crypto pki crl
```

---

## 3. DTLS Security

### 3.1 DTLS Configuration

DTLS (Datagram Transport Layer Security) protects all control plane UDP communications.

```
+------------------------------------------------------------------+
|                      DTLS PARAMETERS                              |
+------------------------------------------------------------------+
|                                                                   |
|  Parameter              | Value                | Description     |
|  -----------------------+----------------------+-----------------|
|  Protocol Version       | DTLS 1.2             | TLS over UDP    |
|  Cipher Suite          | AES-256-GCM-SHA384   | Encryption      |
|  Key Exchange          | ECDHE-RSA-AES256     | PFS enabled     |
|  Certificate           | RSA-2048 / ECDSA-256 | Authentication  |
|  Session Timeout       | 86400 seconds        | 24 hours        |
|  Handshake Timeout     | 60 seconds           | Initial setup   |
|  Anti-Replay Window    | 64 packets           | Replay protect  |
|  Rekey Interval        | 3600 seconds         | Hourly rekey    |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 DTLS Connection Security

```
! WAN Edge DTLS Configuration
! Automatically configured via feature template

sdwan
 security
  tls-port 12346
  tls-version TLSv1.2
  cipher-suites
   ECDHE-RSA-AES256-GCM-SHA384
   ECDHE-ECDSA-AES256-GCM-SHA384
  !
 !

! Verify DTLS connections
show sdwan control connections
show sdwan control local-properties
show sdwan control connection-history
```

### 3.3 DTLS Session States

| State | Description | Duration | Action on Failure |
|-------|-------------|----------|-------------------|
| Initiating | Starting handshake | 0-10s | Retry 3x |
| Connecting | Certificate exchange | 10-30s | Retry with backoff |
| Handshake | Key negotiation | 30-60s | Alert, failover |
| Connected | Established session | Indefinite | Monitor |
| Rekeying | Session key refresh | 1-5s | Transparent |
| Challenged | Validation required | 0-30s | Re-authenticate |
| Tear-down | Session termination | 0-5s | Cleanup |

---

## 4. OMP Protocol Security

### 4.1 OMP Security Overview

```
+------------------------------------------------------------------+
|                    OMP SECURITY ARCHITECTURE                      |
+------------------------------------------------------------------+
|                                                                   |
|                         vSmart Controller                         |
|                    +---------------------+                        |
|                    |   OMP Route Table   |                        |
|                    |   +-------------+   |                        |
|                    |   | OMP Routes  |   |                        |
|                    |   | TLOC Info   |   |                        |
|                    |   | Service Info|   |                        |
|                    |   | Policy      |   |                        |
|                    |   +-------------+   |                        |
|                    +----------+----------+                        |
|                               |                                   |
|            OMP over DTLS      |   OMP over DTLS                  |
|            (Encrypted)        |   (Encrypted)                    |
|                               |                                   |
|    +----------------+         |        +----------------+         |
|    |   WAN Edge 1   |<--------+------->|   WAN Edge 2   |        |
|    |                |                  |                |         |
|    | OMP Attributes:|                  | OMP Attributes:|         |
|    | - Origin       |                  | - Origin       |         |
|    | - Origin-Proto |                  | - Origin-Proto |         |
|    | - Preference   |                  | - Preference   |         |
|    | - Site-ID      |                  | - Site-ID      |         |
|    | - TLOC         |                  | - TLOC         |         |
|    +----------------+                  +----------------+         |
|                                                                   |
|  Security Features:                                              |
|  - All OMP runs over authenticated DTLS                          |
|  - Route origin validation via site-ID                           |
|  - TLOC authenticity via system-IP                               |
|  - Policy integrity via controller signature                     |
+------------------------------------------------------------------+
```

### 4.2 OMP Authentication

```
! OMP graceful restart and timers
sdwan
 omp
  graceful-restart
  graceful-restart-timer 43200
  send-path-limit 4
  ecmp-limit 4
  shutdown false
  timers
   holdtime 60
   advertisement-interval 1
   graceful-restart-timer 43200
   eor-timer 300
  !
 !

! OMP Authentication (Implicit via DTLS)
! No separate OMP authentication needed - secured by DTLS session

! Verify OMP security
show sdwan omp peers
show sdwan omp summary
show sdwan omp tlocs
```

### 4.3 OMP Route Security

| Security Feature | Implementation | Purpose |
|------------------|----------------|---------|
| Route Authentication | DTLS session | Verify route source |
| Route Integrity | HMAC-SHA256 | Detect modification |
| Route Origin | Site-ID binding | Prevent spoofing |
| TLOC Binding | System-IP lock | Endpoint validation |
| Policy Signing | Controller cert | Policy authenticity |
| Prefix Filtering | Control policy | Route injection prevent |

### 4.4 OMP Security Policies

```
! Control Policy for Route Security
policy
 control-policy ROUTE-SECURITY
  sequence 10
   match route
    site-list TRUSTED-SITES
   !
   action accept
  !
  sequence 20
   match route
    prefix-list INFRASTRUCTURE
   !
   action accept
   set
    preference 1000
   !
  !
  sequence 30
   action reject
  !
  default-action reject
 !

! Site List for Trusted Sites
policy
 lists
  site-list TRUSTED-SITES
   site-id 100-105   ! Mumbai DC sites
   site-id 200-205   ! Chennai DR sites
   site-id 300-399   ! India branches
   site-id 400-499   ! EMEA sites
   site-id 500-599   ! Americas sites
  !
  prefix-list INFRASTRUCTURE
   ip-prefix 10.100.0.0/16    ! Management
   ip-prefix 10.252.0.0/16    ! Fabric handoff
   ip-prefix 10.254.0.0/16    ! Controllers
  !
 !
```

---

## 5. Controller Security Hardening

### 5.1 vManage Security

```
+------------------------------------------------------------------+
|                   vMANAGE SECURITY HARDENING                      |
+------------------------------------------------------------------+
|                                                                   |
|  +--------------------+     +--------------------+                |
|  | Access Controls    |     | Audit & Logging   |                |
|  |--------------------|     |--------------------|                |
|  | - SAML/SSO Auth    |     | - All API calls   |                |
|  | - MFA Required     |     | - Config changes  |                |
|  | - RBAC Policies    |     | - Login events    |                |
|  | - Session Timeout  |     | - Security events |                |
|  | - IP Allowlist     |     | - SIEM export     |                |
|  +--------------------+     +--------------------+                |
|                                                                   |
|  +--------------------+     +--------------------+                |
|  | Network Security   |     | Data Protection   |                |
|  |--------------------|     |--------------------|                |
|  | - TLS 1.2+ only    |     | - DB encryption   |                |
|  | - Strong ciphers   |     | - Config encrypt  |                |
|  | - Port restrictions|     | - Backup encrypt  |                |
|  | - API rate limit   |     | - Log encryption  |                |
|  +--------------------+     +--------------------+                |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 vManage Hardening Configuration

```
! vManage Cluster Security Settings
! Administration > Settings

! Session Security
system
 organization-name "Abhavtech"
 vbond vbond1.abhavtech.com port 12346
 site-id 100
 admin-tech-on-failure
 idle-timeout 30
 max-sessions 5
 password-policy
  min-password-length 12
  min-uppercase-chars 1
  min-lowercase-chars 1
  min-numeric-chars 1
  min-special-chars 1
  password-history 12
  password-max-age 90
 !
 !

! AAA Configuration with SAML
aaa
 authentication-type saml
 saml
  idp-metadata-url https://login.microsoftonline.com/abhavtech/federationmetadata.xml
  entity-id https://vmanage.abhavtech.com
  assertion-consumer-url https://vmanage.abhavtech.com/saml/SSO
  single-logout-url https://vmanage.abhavtech.com/saml/SLO
  name-id-format email
  signature-algorithm rsa-sha256
 !
 authorization
  default-role read-only
  group-mapping
   group "SD-WAN-Admins" role admin
   group "SD-WAN-Operators" role operator
   group "SD-WAN-ReadOnly" role read-only
  !
 !
!
```

### 5.3 RBAC Configuration

| Role | Permissions | Group | Users |
|------|-------------|-------|-------|
| Admin | Full access | SD-WAN-Admins | 3 |
| Operator | Config, monitor | SD-WAN-Operators | 8 |
| Read-Only | View only | SD-WAN-ReadOnly | 15 |
| Security | Security config | SD-WAN-Security | 2 |
| API-Service | API access | Service-Accounts | 5 |

```
! Custom RBAC Role
rbac
 role NETWORK-ENGINEER
  resource-group DEVICE-CONFIG
   permission read write
  !
  resource-group TEMPLATE
   permission read write
  !
  resource-group POLICY
   permission read
  !
  resource-group ADMIN
   permission deny
  !
  resource-group SECURITY
   permission read
  !
 !
```

### 5.4 vSmart Security

```
! vSmart Controller Hardening

! Limit control connections
sdwan
 control-connections
  max-connections 2000
  connection-timeout 300
  retry-interval 30
 !

! OMP security settings
 omp
  shutdown false
  overlay-as 65100
  graceful-restart
  graceful-restart-timer 43200
  send-path-limit 4
  ecmp-limit 4
  holdtime 60
  advertisement-interval 1
 !

! Port restriction
 security
  tls-port 12346
  allowed-ports 12346 443
 !
!

! SSH hardening
ssh server algorithm encryption aes256-ctr aes192-ctr aes128-ctr
ssh server algorithm mac hmac-sha2-512 hmac-sha2-256
ssh server algorithm key-exchange ecdh-sha2-nistp521 ecdh-sha2-nistp384
```

### 5.5 vBond Security

```
! vBond Orchestrator Hardening

! Strict device validation
sdwan
 vbond
  local 10.254.1.10 port 12346
  only-allow-valid-certs
  allowed-orgs "Abhavtech"
  max-connections 5000
  drain false
 !

! Connection security
 security
  tls-port 12346
  cert-validity-check true
  allowed-certificate-orgs
   organization "Abhavtech"
  !
 !
!

! Rate limiting
ip access-list extended VBOND-PROTECT
 permit udp any any eq 12346
 deny ip any any

class-map match-all DTLS-CONTROL
 match access-group name VBOND-PROTECT

policy-map VBOND-RATE-LIMIT
 class DTLS-CONTROL
  police rate 10 mbps burst 1 mb
   conform-action transmit
   exceed-action drop
```

---

## 6. Control Plane Protection

### 6.1 Anti-Spoofing Controls

```
+------------------------------------------------------------------+
|                    ANTI-SPOOFING MECHANISMS                       |
+------------------------------------------------------------------+
|                                                                   |
|  1. Certificate Binding:                                         |
|     - Device serial number locked to certificate                 |
|     - Organization name validation                               |
|     - System-IP uniqueness enforcement                           |
|                                                                   |
|  2. TLOC Validation:                                             |
|     - Color must match physical interface                        |
|     - Public-IP must be reachable                               |
|     - Private-IP must be consistent                              |
|                                                                   |
|  3. Site-ID Enforcement:                                         |
|     - Site-ID per-device binding                                |
|     - Duplicate site-ID detection                                |
|     - Geographic validation (optional)                           |
|                                                                   |
|  4. OMP Origin Validation:                                       |
|     - Routes tagged with originator system-IP                    |
|     - TLOC binding verification                                  |
|     - Path attribute integrity                                   |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 Rate Limiting and DoS Protection

```
! Control Plane Policing on WAN Edge
control-plane
 service-policy input CONTROL-PLANE-POLICY
!

class-map match-any CONTROL-PLANE-DTLS
 match access-group name DTLS-TRAFFIC

class-map match-any CONTROL-PLANE-BGP
 match access-group name BGP-TRAFFIC

policy-map CONTROL-PLANE-POLICY
 class CONTROL-PLANE-DTLS
  police rate 10 mbps burst 2 mb
   conform-action transmit
   exceed-action drop
 class CONTROL-PLANE-BGP
  police rate 5 mbps burst 1 mb
   conform-action transmit
   exceed-action drop
 class class-default
  police rate 1 mbps
   conform-action transmit
   exceed-action drop

ip access-list extended DTLS-TRAFFIC
 permit udp any any eq 12346
 permit udp any eq 12346 any

ip access-list extended BGP-TRAFFIC
 permit tcp any any eq bgp
 permit tcp any eq bgp any
```

### 6.3 Session Security

| Protection | Implementation | Threshold |
|------------|----------------|-----------|
| Connection limit | Max sessions per device | 5 |
| Authentication timeout | DTLS handshake | 60 seconds |
| Session timeout | Idle disconnect | 86400 seconds |
| Rekey interval | Session key refresh | 3600 seconds |
| Replay window | Anti-replay | 64 packets |
| Rate limiting | DTLS traffic | 10 Mbps |

---

## 7. Verification and Monitoring

### 7.1 Certificate Verification Commands

```
! Verify certificate status
show sdwan certificate root-ca-cert
show sdwan certificate installed
show sdwan certificate serial
show sdwan certificate validity
show sdwan certificate signing-request

! Verify certificate chain
show crypto pki certificates verbose
show crypto pki trustpoints status

! Check certificate expiration
show sdwan certificate installed | include Valid
```

### 7.2 Control Connection Verification

```
! Verify control plane connections
show sdwan control connections
show sdwan control local-properties
show sdwan control connection-history

! Expected Output:
! PEER    PEER PEER            SITE        DOMAIN PEER                    PRIV  PEER            PUB
! TYPE    PROT SYSTEM IP       ID          ID     PRIVATE IP              PORT  PUBLIC IP       PORT  LOCAL COLOR     PROXY STATE UPTIME
! vsmart  dtls 10.254.1.20     100         1      10.254.1.20             12346 10.254.1.20     12346 mpls            Yes   up     0:15:00:00
! vmanage dtls 10.254.1.100    100         0      10.254.1.100            12346 10.254.1.100    12346 mpls            Yes   up     0:15:00:00
! vbond   dtls 10.254.1.10     0           0      10.254.1.10             12346 10.254.1.10     12346 default         -     up     0:15:00:00

! Verify DTLS security
show sdwan control connection-info
show sdwan security-info
```

### 7.3 OMP Security Verification

```
! Verify OMP peers
show sdwan omp peers

! Expected Output:
!                     DOMAIN    OVERLAY   SITE
! PEER            TYPE  ID        ID        ID        STATE    UPTIME
! 10.254.1.20     vsmart 1         1         100       up       0:15:00:00
! 10.254.1.21     vsmart 1         1         100       up       0:15:00:00

! Verify OMP routes with security attributes
show sdwan omp routes
show sdwan omp tlocs
show sdwan omp services

! Verify route origin
show sdwan omp routes vpn 10 | include originator
```

### 7.4 Security Event Monitoring

```
! Enable security logging
logging buffered 512000 informational
logging host 10.254.2.50 vrf Mgmt-intf
logging source-interface Loopback0

! Security-specific logging
logging discriminator SECURITY severity includes 3-5 facility includes SEC
logging host 10.254.2.50 discriminator SECURITY

! Monitor security events
show sdwan security-info
show logging | include SEC
show logging | include DTLS
show logging | include certificate

! Audit log export
! vManage: Monitor > Audit Log > Export
```

### 7.5 Control Plane Health Dashboard

```
+------------------------------------------------------------------+
|               CONTROL PLANE HEALTH METRICS                        |
+------------------------------------------------------------------+
|                                                                   |
|  Metric                    | Target    | Alert      | Critical   |
|  --------------------------+-----------+------------+----------- |
|  Control Connections       | 100%      | <95%       | <90%       |
|  OMP Peer State            | All Up    | Any Down   | >1 Down    |
|  Certificate Validity      | >30 days  | <30 days   | <7 days    |
|  DTLS Session Age          | <24 hours | >24 hours  | >48 hours  |
|  Control Plane CPU         | <50%      | >70%       | >85%       |
|  OMP Route Count           | Baseline  | >20% delta | >50% delta |
|  Authentication Failures   | 0         | >5/hour    | >20/hour   |
|  Certificate Errors        | 0         | >0         | >5/hour    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 8. Security Incident Response

### 8.1 Control Plane Security Events

| Event | Severity | Detection | Response |
|-------|----------|-----------|----------|
| Certificate expired | Critical | Monitoring | Emergency renewal |
| DTLS failure | High | Alarm | Investigate, failover |
| OMP peer down | High | Health check | Verify connectivity |
| Authentication failure | Medium | Log analysis | Investigate source |
| Unknown device connect | High | Alert | Block, investigate |
| Rate limit exceeded | Medium | Threshold | Tune limits |
| Certificate revoked | Critical | CRL check | Device quarantine |

### 8.2 Incident Response Procedures

```
+------------------------------------------------------------------+
|            CONTROL PLANE INCIDENT RESPONSE                        |
+------------------------------------------------------------------+
|                                                                   |
|  1. Detection (0-5 minutes):                                     |
|     - Automated alert from monitoring                            |
|     - Security event correlation                                 |
|     - Control connection status check                            |
|                                                                   |
|  2. Triage (5-15 minutes):                                       |
|     - Verify impact scope                                        |
|     - Check affected devices/controllers                         |
|     - Review security logs                                       |
|                                                                   |
|  3. Containment (15-60 minutes):                                 |
|     - Isolate compromised devices                                |
|     - Revoke certificates if needed                              |
|     - Block malicious sources                                    |
|                                                                   |
|  4. Resolution (1-4 hours):                                      |
|     - Apply security patches                                     |
|     - Rotate credentials/certificates                            |
|     - Restore normal operations                                  |
|                                                                   |
|  5. Post-Incident (24-48 hours):                                 |
|     - Root cause analysis                                        |
|     - Update security policies                                   |
|     - Document lessons learned                                   |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 9. Best Practices Summary

### 9.1 Certificate Management
- Use enterprise CA for additional trust
- Monitor certificate expiration (30-day warning)
- Enable automatic certificate rotation
- Maintain offline backup of root CA

### 9.2 Controller Security
- Enable SAML/SSO with MFA
- Implement strict RBAC
- Set appropriate session timeouts
- Regular security audit reviews

### 9.3 Network Protection
- Rate limit control plane traffic
- Enable control plane policing
- Use strong cipher suites only
- Disable unused protocols

### 9.4 Monitoring and Response
- Centralized security logging
- Real-time alerting on events
- Regular penetration testing
- Documented incident response

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco SD-WAN Security Guide | Official security documentation | cisco.com |
| PKI Best Practices | Certificate management guide | Internal |
| Abhavtech Security Policy | Corporate security standards | SharePoint |
| NIST SP 800-57 | Key management guidelines | nist.gov |
| CIS Benchmarks | Security hardening standards | cisecurity.org |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.2*
