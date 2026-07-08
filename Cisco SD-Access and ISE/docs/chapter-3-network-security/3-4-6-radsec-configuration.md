# 3.4.6 RadSec Configuration (RADIUS over TLS)

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. RadSec Overview

### 1.1 Why RadSec?

RadSec (RADIUS over TLS) encrypts RADIUS traffic that traditionally uses UDP with shared secrets. This addresses several security concerns:

| Traditional RADIUS | RadSec (RADIUS/TLS) |
|-------------------|---------------------|
| UDP ports 1812/1813 | TCP port 2083 |
| Shared secret (weak) | TLS certificates (strong) |
| No encryption of attributes | Full TLS encryption |
| Vulnerable to replay attacks | Protected by TLS |
| No mutual authentication | Certificate-based mutual auth |

### 1.2 When to Use RadSec

```
RadSec Required:
├── PCI-DSS environments (encrypted AAA)
├── Untrusted network segments
├── WAN-connected authenticators
├── High-security zones
└── Compliance requirements (SOC 2, ISO 27001)

RadSec Optional (but recommended):
├── Campus LAN (defense in depth)
├── Data center access
└── Any 802.1X deployment
```

---

## 2. Certificate Infrastructure

### 2.1 Certificate Hierarchy for Abhavtech

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Abhavtech PKI for RadSec                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────────┐                          │
│                    │   Root CA           │                          │
│                    │   abhavtech-root-ca │                          │
│                    │   Validity: 20 years│                          │
│                    └──────────┬──────────┘                          │
│                               │                                      │
│              ┌────────────────┼────────────────┐                    │
│              │                │                │                    │
│              ▼                ▼                ▼                    │
│    ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐         │
│    │ ISE Issuing CA  │ │ Network CA  │ │ User CA         │         │
│    │ ise-ca          │ │ network-ca  │ │ user-ca         │         │
│    │ 10 years        │ │ 10 years    │ │ 10 years        │         │
│    └────────┬────────┘ └──────┬──────┘ └────────┬────────┘         │
│             │                 │                  │                  │
│             ▼                 ▼                  ▼                  │
│    ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐         │
│    │ ISE Server Cert │ │ Switch Cert │ │ EAP-TLS Certs   │         │
│    │ 2 years         │ │ 2 years     │ │ 1 year          │         │
│    └─────────────────┘ └─────────────┘ └─────────────────┘         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Certificate Requirements

| Certificate | Subject | SAN | Key Size | Validity | Purpose |
|-------------|---------|-----|----------|----------|---------|
| ISE RadSec Server | CN=ise-psn-01.abhavtech.com | DNS:ise-psn-01.abhavtech.com | RSA 2048+ | 2 years | ISE as RadSec server |
| Switch RadSec Client | CN=mum-ed-01.abhavtech.com | DNS:mum-ed-01.abhavtech.com | RSA 2048+ | 2 years | Switch as RadSec client |
| Root CA | CN=Abhavtech Root CA | - | RSA 4096 | 20 years | Trust anchor |

### 2.3 Generate Switch Certificate (Using PKI)

```
! On Catalyst 9300 Edge Node
! Step 1: Generate RSA keypair
crypto key generate rsa label RADSEC-KEY modulus 2048

! Step 2: Create trustpoint for RadSec
crypto pki trustpoint RADSEC-TP
 enrollment terminal pem
 subject-name CN=mum-ed-01.abhavtech.com,O=Abhavtech,C=IN
 revocation-check crl
 rsakeypair RADSEC-KEY

! Step 3: Authenticate CA (import Root CA cert)
crypto pki authenticate RADSEC-TP
! Paste Root CA certificate when prompted

! Step 4: Enroll switch (generate CSR)
crypto pki enroll RADSEC-TP
! Copy CSR to CA for signing

! Step 5: Import signed certificate
crypto pki import RADSEC-TP certificate
! Paste signed certificate when prompted
```

---

## 3. ISE RadSec Server Configuration

### 3.1 Enable RadSec on ISE

```
Administration → System → Settings → Protocols → RADIUS

RADIUS Settings:
  ☑ Enable RADIUS/UDP (legacy - keep for migration)
  ☑ Enable RADIUS/TLS (RadSec)
  
RadSec Settings:
  RadSec Port: 2083
  TLS Version: TLS 1.2 minimum
  
  Server Certificate: ise-psn-01.abhavtech.com (EAP Authentication)
  
  Client Authentication:
    ☑ Require client certificate
    Trusted CA: Abhavtech-Network-CA
    
  Certificate Validation:
    ☑ Validate certificate chain
    ☑ Check certificate revocation (CRL)
    CRL URL: http://pki.abhavtech.com/crl/network-ca.crl
```

### 3.2 ISE Network Device Configuration for RadSec

```
Administration → Network Resources → Network Devices

Device Name: MUM-ED-01
IP Address: 10.100.1.11

RADIUS Authentication Settings:
  Protocol: RADIUS/TLS
  RadSec Port: 2083
  
  Shared Secret: (not required for RadSec - certificate-based)
  
  Client Certificate DN:
    CN=mum-ed-01.abhavtech.com,O=Abhavtech,C=IN
    
  ☑ Enable RadSec for this device
```

### 3.3 ISE Certificate Configuration

```
Administration → System → Certificates → System Certificates

Import/Generate RadSec Server Certificate:
  Friendly Name: ISE-RadSec-Server
  Usage: 
    ☑ EAP Authentication
    ☑ RADIUS DTLS
    
  Certificate should contain:
    - Extended Key Usage: Server Authentication (1.3.6.1.5.5.7.3.1)
    - Subject Alternative Name: DNS:ise-psn-01.abhavtech.com

Administration → System → Certificates → Trusted Certificates

Import Network Device CA:
  Friendly Name: Abhavtech-Network-CA
  Trust for:
    ☑ Trust for client authentication
    ☑ Trust for authenticating Cisco Services
```

---

## 4. Switch RadSec Client Configuration

### 4.1 Catalyst 9300 RadSec Configuration

```
! Configure RadSec on Edge Node MUM-ED-01

! Step 1: Define RADIUS server with TLS
radius server ISE-PSN-01-RADSEC
 address ipv4 10.250.10.21 auth-port 2083 acct-port 2083
 tls connectiontimeout 10
 tls idletimeout 60
 tls retransmit 3
 tls trustpoint client RADSEC-TP
 tls trustpoint server RADSEC-TP

radius server ISE-PSN-02-RADSEC
 address ipv4 10.250.10.22 auth-port 2083 acct-port 2083
 tls connectiontimeout 10
 tls idletimeout 60
 tls trustpoint client RADSEC-TP
 tls trustpoint server RADSEC-TP

! Step 2: Create server group
aaa group server radius RADSEC-SERVERS
 server name ISE-PSN-01-RADSEC
 server name ISE-PSN-02-RADSEC

! Step 3: Apply to AAA methods
aaa authentication dot1x default group RADSEC-SERVERS
aaa authorization network default group RADSEC-SERVERS
aaa accounting dot1x default start-stop group RADSEC-SERVERS

! Step 4: Enable RadSec globally
radius-server attribute 6 on-for-login-auth
radius-server attribute 8 include-in-access-req
radius-server attribute 25 access-request include
radius-server dead-criteria time 10 tries 3
radius-server deadtime 5
```

### 4.2 Verification Commands

```
! Verify TLS connection to ISE
MUM-ED-01# show radius server-group RADSEC-SERVERS

RADIUS server group RADSEC-SERVERS
    Server: ISE-PSN-01-RADSEC
        Address: 10.250.10.21
        Ports: Auth 2083, Acct 2083
        Status: UP (TLS Connected)
        TLS Version: TLSv1.2
        Cipher: ECDHE-RSA-AES256-GCM-SHA384
        
! Verify RadSec statistics
MUM-ED-01# show radius statistics

RADIUS Statistics:
  TLS Sessions Established: 47
  TLS Handshake Failures: 0
  Authentication Requests (TLS): 12,456
  Authentication Accepts: 12,398
  Authentication Rejects: 58

! Test RadSec connectivity
MUM-ED-01# test aaa group RADSEC-SERVERS testuser Cisco123 new-code
User successfully authenticated
```

---

## 5. Certificate Lifecycle Management

### 5.1 Certificate Renewal Procedure

```yaml
Certificate_Renewal_Workflow:

  90_Days_Before_Expiry:
    - ISE alerts via email/SNMP
    - Create change ticket
    - Generate new CSR
    
  60_Days_Before_Expiry:
    - Submit CSR to CA
    - Obtain signed certificate
    - Test in lab environment
    
  30_Days_Before_Expiry:
    - Schedule maintenance window
    - Import new certificate (don't delete old yet)
    - Update network devices to trust new cert
    
  14_Days_Before_Expiry:
    - Execute certificate rotation
    - Switch devices to new certificate
    - Verify RadSec connectivity
    
  After_Rotation:
    - Remove old certificate
    - Update documentation
    - Close change ticket
```

### 5.2 ISE Certificate Monitoring

```
Administration → System → Settings → Alarm Settings

Certificate Expiry Alarms:
  ☑ Enable certificate expiry notification
  Warning: 90 days before expiry
  Critical: 30 days before expiry
  
  Notification:
    Email: pki-admin@abhavtech.com, noc@abhavtech.com
    SNMP Trap: Enabled
    Syslog: Enabled
```

### 5.3 Automated Certificate Monitoring Script

```python
#!/usr/bin/env python3
# /opt/abhavtech/scripts/radsec_cert_monitor.py

import ssl
import socket
from datetime import datetime, timedelta

RADSEC_HOSTS = [
    ("ise-psn-01.abhavtech.com", 2083),
    ("ise-psn-02.abhavtech.com", 2083),
    ("mum-ed-01.abhavtech.com", 2083),
]

WARNING_DAYS = 90
CRITICAL_DAYS = 30

def check_certificate_expiry(host, port):
    context = ssl.create_default_context()
    with socket.create_connection((host, port), timeout=10) as sock:
        with context.wrap_socket(sock, server_hostname=host) as ssock:
            cert = ssock.getpeercert()
            expiry = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
            days_remaining = (expiry - datetime.now()).days
            return days_remaining, expiry

for host, port in RADSEC_HOSTS:
    try:
        days, expiry = check_certificate_expiry(host, port)
        if days <= CRITICAL_DAYS:
            print(f"CRITICAL: {host} cert expires in {days} days ({expiry})")
        elif days <= WARNING_DAYS:
            print(f"WARNING: {host} cert expires in {days} days ({expiry})")
        else:
            print(f"OK: {host} cert valid for {days} days")
    except Exception as e:
        print(f"ERROR: Cannot check {host}: {e}")
```

---

## 6. Migration from RADIUS/UDP to RadSec

### 6.1 Phased Migration Plan

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RadSec Migration Phases                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Phase 1: Preparation (Week 1-2)                                    │
│  ├── Deploy PKI infrastructure                                      │
│  ├── Generate ISE server certificates                               │
│  ├── Configure ISE to accept both UDP and TLS                       │
│  └── Test in lab environment                                        │
│                                                                     │
│  Phase 2: Pilot (Week 3-4)                                          │
│  ├── Select 2-3 pilot switches                                      │
│  ├── Generate switch certificates                                   │
│  ├── Configure RadSec on pilot devices                              │
│  └── Validate authentication works                                  │
│                                                                     │
│  Phase 3: Site Rollout (Week 5-8)                                   │
│  ├── Deploy certificates to all switches (site by site)            │
│  ├── Configure RadSec (keep UDP as fallback)                        │
│  ├── Monitor authentication success rate                            │
│  └── Troubleshoot issues per site                                   │
│                                                                     │
│  Phase 4: Cutover (Week 9-10)                                       │
│  ├── Remove RADIUS/UDP configuration                                │
│  ├── Disable UDP on ISE                                             │
│  ├── Update firewall rules (block UDP 1812/1813)                    │
│  └── Final validation and documentation                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Rollback Procedure

```
! If RadSec fails, rollback to RADIUS/UDP

! Step 1: Re-add UDP RADIUS server
radius server ISE-PSN-01-UDP
 address ipv4 10.250.10.21 auth-port 1812 acct-port 1813
 key 0 $SharedSecret$

! Step 2: Update server group
aaa group server radius RADIUS-FALLBACK
 server name ISE-PSN-01-UDP

! Step 3: Apply fallback
aaa authentication dot1x default group RADIUS-FALLBACK
```

---

## 7. Troubleshooting RadSec

### 7.1 Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| TLS handshake failure | Certificate mismatch | Verify CN/SAN matches hostname |
| Connection refused | Port blocked | Open TCP 2083 in firewall |
| Certificate validation error | Missing CA | Import full certificate chain |
| Intermittent failures | Certificate expiry | Check certificate validity dates |
| Authentication timeout | TLS renegotiation | Increase tls connectiontimeout |

### 7.2 Debug Commands

```
! Enable RadSec debugging
MUM-ED-01# debug radius authentication
MUM-ED-01# debug radius tls
MUM-ED-01# debug crypto pki transactions

! Check TLS session state
MUM-ED-01# show radius server-group all
MUM-ED-01# show crypto pki certificates
MUM-ED-01# show crypto pki trustpoints status

! ISE debugging
Operations → Troubleshoot → Diagnostic Tools → TCP Dump
Filter: port 2083
```

---

## 8. Compliance Mapping

| Requirement | Standard | RadSec Control |
|-------------|----------|----------------|
| Encrypt authentication traffic | PCI-DSS 4.1 | TLS 1.2+ encryption |
| Strong authentication | PCI-DSS 8.2 | Certificate-based mutual auth |
| Audit trail | SOC 2 CC6.1 | TLS session logging |
| Secure transmission | ISO 27001 A.13.2.1 | End-to-end encryption |

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
