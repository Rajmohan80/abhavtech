# 5.6 Certificate Management

## Document Information
- **Version:** 1.0
- **Last Updated:** December 2025
- **Author:** Abhavtech Network Engineering
- **Classification:** Internal Use

---

## 5.6.1 Certificate Architecture

### PKI Hierarchy

```
+------------------------------------------------------------------+
|             ABHAVTECH SD-WAN PKI ARCHITECTURE                     |
+------------------------------------------------------------------+
|                                                                   |
|                    ┌─────────────────────┐                       |
|                    │  Abhavtech Root CA  │                       |
|                    │  (Offline, HSM)     │                       |
|                    │  Validity: 20 years │                       |
|                    └──────────┬──────────┘                       |
|                               │                                   |
|              ┌────────────────┼────────────────┐                 |
|              │                │                │                  |
|              ▼                ▼                ▼                  |
|    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   |
|    │ Issuing CA      │ │ SD-WAN CA       │ │ Web CA          │   |
|    │ (General)       │ │ (Controllers)   │ │ (HTTPS)         │   |
|    │ 10 years        │ │ 10 years        │ │ 5 years         │   |
|    └────────┬────────┘ └────────┬────────┘ └────────┬────────┘   |
|             │                   │                   │             |
|             ▼                   ▼                   ▼             |
|    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   |
|    │ User/Device     │ │ vManage         │ │ vManage Web     │   |
|    │ Certificates    │ │ vSmart          │ │ Certificate     │   |
|    │ 1-2 years       │ │ vBond           │ │ 1 year          │   |
|    │                 │ │ WAN Edge        │ │                 │   |
|    │                 │ │ 2 years         │ │                 │   |
|    └─────────────────┘ └─────────────────┘ └─────────────────┘   |
|                                                                   |
+------------------------------------------------------------------+
```

### Certificate Types

| Certificate Type | Purpose | Validity | Signed By |
|------------------|---------|----------|-----------|
| Root CA | Trust anchor | 20 years | Self-signed |
| SD-WAN Issuing CA | Sign controller/edge certs | 10 years | Root CA |
| vManage Certificate | Controller authentication | 2 years | Issuing CA |
| vSmart Certificate | Controller authentication | 2 years | Issuing CA |
| vBond Certificate | Orchestrator authentication | 2 years | Issuing CA |
| WAN Edge Certificate | Device authentication | 2 years | Issuing CA |
| Web Certificate | HTTPS UI access | 1 year | Public CA |

---

## 5.6.2 Enterprise CA Setup

### CA Configuration for SD-WAN

```bash
# OpenSSL CA configuration for SD-WAN certificates
# File: /etc/pki/sdwan-ca/openssl.cnf

[ ca ]
default_ca = sdwan_ca

[ sdwan_ca ]
dir               = /etc/pki/sdwan-ca
certs             = $dir/certs
new_certs_dir     = $dir/newcerts
database          = $dir/index.txt
serial            = $dir/serial
private_key       = $dir/private/sdwan-ca.key
certificate       = $dir/certs/sdwan-ca.crt
default_days      = 730
default_md        = sha256
policy            = policy_match

[ policy_match ]
countryName             = match
organizationName        = match
commonName              = supplied

[ req ]
default_bits       = 2048
default_md         = sha256
distinguished_name = req_distinguished_name
x509_extensions    = v3_ca

[ v3_controller ]
basicConstraints       = CA:FALSE
keyUsage               = digitalSignature, keyEncipherment
extendedKeyUsage       = serverAuth, clientAuth
subjectAltName         = @alt_names

[ v3_wan_edge ]
basicConstraints       = CA:FALSE
keyUsage               = digitalSignature, keyEncipherment
extendedKeyUsage       = clientAuth
subjectAltName         = @alt_names
```

### Certificate Template (Microsoft CA)

```powershell
# SD-WAN Controller Certificate Template
# Windows Server CA Manager

Template Name: SD-WAN-Controller
Validity Period: 2 years
Renewal Period: 6 weeks

Key Usage:
  - Digital Signature
  - Key Encipherment

Extended Key Usage:
  - Server Authentication (1.3.6.1.5.5.7.3.1)
  - Client Authentication (1.3.6.1.5.5.7.3.2)

Subject Name:
  - Supply in request (from CSR)

Extensions:
  - Subject Alternative Name: Include in request

Issuance Requirements:
  - CA certificate manager approval: Yes
```

---

## 5.6.3 Certificate Signing Process

### CSR Generation and Signing Workflow

```
+------------------------------------------------------------------+
|            CERTIFICATE SIGNING WORKFLOW                           |
+------------------------------------------------------------------+
|                                                                   |
|  STEP 1: Generate CSR on Device                                  |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  vManage/vSmart/vBond/WAN-Edge:                            │  |
|  │  # request certificate generate csr                        │  |
|  │                                                             │  |
|  │  Output: PEM-encoded CSR                                   │  |
|  └────────────────────────────────────────────────────────────┘  |
|                         │                                         |
|                         ▼                                         |
|  STEP 2: Submit CSR to Enterprise CA                             |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  Method A: Web Enrollment                                  │  |
|  │    https://ca.abhavtech.com/certsrv                        │  |
|  │                                                             │  |
|  │  Method B: certreq (Windows)                               │  |
|  │    certreq -submit -config "CA\Abhavtech-CA" request.csr   │  |
|  │                                                             │  |
|  │  Method C: openssl (Linux)                                 │  |
|  │    openssl ca -config openssl.cnf -in request.csr          │  |
|  └────────────────────────────────────────────────────────────┘  |
|                         │                                         |
|                         ▼                                         |
|  STEP 3: CA Manager Approval                                     |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  - Review CSR subject and SANs                             │  |
|  │  - Verify device identity                                  │  |
|  │  - Approve certificate issuance                            │  |
|  └────────────────────────────────────────────────────────────┘  |
|                         │                                         |
|                         ▼                                         |
|  STEP 4: Install Certificate on Device                           |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  # request root-cert-chain install ca-chain.pem            │  |
|  │  # request certificate install signed-cert.pem             │  |
|  └────────────────────────────────────────────────────────────┘  |
|                                                                   |
+------------------------------------------------------------------+
```

### Automated Certificate Signing Script

```python
#!/usr/bin/env python3
"""
SD-WAN Certificate Automation
Signs CSRs using Enterprise CA API
"""

import requests
import base64
import json
from datetime import datetime

class CertificateManager:
    def __init__(self, ca_url, username, password):
        self.ca_url = ca_url
        self.auth = (username, password)
        self.session = requests.Session()
        self.session.auth = self.auth
        self.session.verify = True
    
    def sign_csr(self, csr_pem, template="SD-WAN-Controller", san_dns=None, san_ip=None):
        """Submit CSR to CA and get signed certificate"""
        
        # Prepare CSR for submission
        csr_b64 = base64.b64encode(csr_pem.encode()).decode()
        
        # Build SAN extension
        san_entries = []
        if san_dns:
            san_entries.extend([f"dns={dns}" for dns in san_dns])
        if san_ip:
            san_entries.extend([f"ipaddress={ip}" for ip in san_ip])
        
        payload = {
            "csr": csr_b64,
            "template": template,
            "san": san_entries,
            "validity_days": 730
        }
        
        response = self.session.post(
            f"{self.ca_url}/api/v1/certificate/sign",
            json=payload
        )
        
        if response.status_code == 200:
            cert_data = response.json()
            return base64.b64decode(cert_data["certificate"]).decode()
        else:
            raise Exception(f"Certificate signing failed: {response.text}")
    
    def get_ca_chain(self):
        """Retrieve CA certificate chain"""
        response = self.session.get(f"{self.ca_url}/api/v1/ca/chain")
        return response.json()["chain"]

# Usage example
if __name__ == "__main__":
    ca = CertificateManager(
        "https://ca.abhavtech.com",
        "cert-admin",
        "password"
    )
    
    # Read CSR from file
    with open("vmanage-1.csr", "r") as f:
        csr = f.read()
    
    # Sign CSR
    signed_cert = ca.sign_csr(
        csr,
        template="SD-WAN-Controller",
        san_dns=["vmanage-1.abhavtech.com", "sdwan-manager.abhavtech.com"],
        san_ip=["10.255.0.11"]
    )
    
    # Save signed certificate
    with open("vmanage-1-signed.pem", "w") as f:
        f.write(signed_cert)
    
    print("Certificate signed successfully")
```

---

## 5.6.4 Certificate Installation

### Controller Certificate Installation

```
! Install on vManage
vManage# request root-cert-chain install /home/admin/abhavtech-ca-chain.pem
Uploading root-ca-chain via VPN 0
Successfully installed root certificates

vManage# request certificate install /home/admin/vmanage-1-signed.pem
Successfully installed the certificate

! Verify installation
vManage# show certificate installed
Certificate:
  Subject: CN=vmanage-1.abhavtech.com,O=Abhavtech,C=IN
  Issuer: CN=Abhavtech-SD-WAN-CA,O=Abhavtech,C=IN
  Serial Number: 0x1234ABCD
  Not Before: Dec 15 00:00:00 2025 GMT
  Not After: Dec 15 23:59:59 2027 GMT
  Key Type: RSA 2048
  Signature: sha256WithRSAEncryption
  Status: Valid

! Check certificate chain
vManage# show certificate root-ca-cert
Root CA Certificate:
  Subject: CN=Abhavtech-Root-CA,O=Abhavtech,C=IN
  Issuer: CN=Abhavtech-Root-CA,O=Abhavtech,C=IN
  Valid Until: Dec 31 2045
```

### WAN Edge Certificate Installation

```
! For WAN Edge using Enterprise CA
! Option 1: Manual installation
wan-edge# request platform software sdwan root-cert-chain install bootflash:ca-chain.pem
wan-edge# request platform software sdwan certificate install bootflash:wan-edge-signed.pem

! Option 2: Automatic via vManage (ZTP)
! Configure Enterprise CA in vManage
vManage GUI: Administration > Settings > Enterprise Root Certificate
  - Upload CA chain
  - Enable automatic certificate distribution

! WAN Edge will receive certificate during onboarding
```

---

## 5.6.5 Certificate Monitoring

### Certificate Expiration Monitoring

```python
#!/usr/bin/env python3
"""
SD-WAN Certificate Expiration Monitor
Alerts when certificates are expiring
"""

import requests
import json
from datetime import datetime, timedelta

VMANAGE = "sdwan-manager.abhavtech.com"
ALERT_THRESHOLD_DAYS = 90

def get_certificate_status():
    session = requests.Session()
    session.verify = False
    
    # Authenticate
    session.post(
        f"https://{VMANAGE}/j_security_check",
        data={"j_username": "admin", "j_password": "password"}
    )
    
    token = session.get(f"https://{VMANAGE}/dataservice/client/token").text
    session.headers["X-XSRF-TOKEN"] = token
    
    # Get all device certificates
    response = session.get(
        f"https://{VMANAGE}/dataservice/certificate/record"
    )
    
    return response.json().get("data", [])

def check_expiration(certificates):
    alerts = []
    now = datetime.now()
    threshold = now + timedelta(days=ALERT_THRESHOLD_DAYS)
    
    for cert in certificates:
        expiry_str = cert.get("expirationDate", "")
        if expiry_str:
            expiry = datetime.strptime(expiry_str, "%Y-%m-%d")
            
            if expiry < threshold:
                days_remaining = (expiry - now).days
                alerts.append({
                    "device": cert.get("host-name"),
                    "system_ip": cert.get("system-ip"),
                    "expiry_date": expiry_str,
                    "days_remaining": days_remaining,
                    "status": "CRITICAL" if days_remaining < 30 else "WARNING"
                })
    
    return alerts

def main():
    print("=== SD-WAN Certificate Expiration Report ===")
    print(f"Generated: {datetime.now().isoformat()}")
    print()
    
    certificates = get_certificate_status()
    alerts = check_expiration(certificates)
    
    if alerts:
        print("CERTIFICATES REQUIRING ATTENTION:")
        for alert in sorted(alerts, key=lambda x: x["days_remaining"]):
            print(f"  [{alert['status']}] {alert['device']} ({alert['system_ip']})")
            print(f"          Expires: {alert['expiry_date']} ({alert['days_remaining']} days)")
    else:
        print("All certificates valid for next 90 days")

if __name__ == "__main__":
    main()
```

### vManage Certificate Dashboard

```
vManage GUI: Monitor > Certificates

Dashboard shows:
  - All device certificates
  - Expiration dates
  - Certificate status (Valid/Expiring/Expired)
  - CSR pending approval

Alerts configured:
  - 90 days before expiry: Email warning
  - 30 days before expiry: Critical alert
  - 7 days before expiry: Escalation to management
```

---

## 5.6.6 Certificate Renewal

### Renewal Procedure

```
+------------------------------------------------------------------+
|            CERTIFICATE RENEWAL WORKFLOW                           |
+------------------------------------------------------------------+
|                                                                   |
|  STEP 1: Generate New CSR (60 days before expiry)                |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  device# request certificate generate csr                  │  |
|  │  ! Old certificate remains valid during renewal            │  |
|  └────────────────────────────────────────────────────────────┘  |
|                                                                   |
|  STEP 2: Submit to CA and Get Signed                             |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  ! Same process as initial signing                         │  |
|  │  ! New certificate has new validity period                 │  |
|  └────────────────────────────────────────────────────────────┘  |
|                                                                   |
|  STEP 3: Install New Certificate                                 |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  device# request certificate install new-cert.pem          │  |
|  │  ! Traffic continues on old cert until install complete    │  |
|  │  ! Automatic switch to new cert after installation         │  |
|  └────────────────────────────────────────────────────────────┘  |
|                                                                   |
|  STEP 4: Verify and Clean Up                                     |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  device# show certificate installed                        │  |
|  │  ! Verify new expiration date                              │  |
|  │  ! Old certificate automatically removed                   │  |
|  └────────────────────────────────────────────────────────────┘  |
|                                                                   |
+------------------------------------------------------------------+
```

### Automated Renewal Script

```bash
#!/bin/bash
# certificate_renewal.sh - Automated certificate renewal

DEVICE_IP=$X
DEVICE_NAME=$X

echo "=== Certificate Renewal for $DEVICE_NAME ==="

# Step 1: Generate CSR
echo "Generating CSR..."
ssh admin@$DEVICE_IP "request certificate generate csr" > /tmp/${DEVICE_NAME}.csr

# Step 2: Submit to CA (using API)
echo "Submitting to CA..."
python3 /opt/sdwan/sign_csr.py /tmp/${DEVICE_NAME}.csr /tmp/${DEVICE_NAME}-signed.pem

# Step 3: Install certificate
echo "Installing certificate..."
scp /tmp/${DEVICE_NAME}-signed.pem admin@$DEVICE_IP:/home/admin/
ssh admin@$DEVICE_IP "request certificate install /home/admin/${DEVICE_NAME}-signed.pem"

# Step 4: Verify
echo "Verifying installation..."
ssh admin@$DEVICE_IP "show certificate installed"

echo "=== Renewal Complete ==="
```

---

## 5.6.7 Certificate Revocation

### CRL Configuration

```
! Configure CRL checking on controllers
vManage GUI: Administration > Settings > Certificate Revocation

CRL Settings:
  - Enable CRL checking: Yes
  - CRL Distribution Point: http://ca.abhavtech.com/crl/sdwan-ca.crl
  - CRL refresh interval: 24 hours
  - Cache CRL: Yes

! Manual CRL update
vManage# request certificate crl update

! Check CRL status
vManage# show certificate crl
CRL Status:
  Last Update: 2025-12-15 00:00:00 UTC
  Next Update: 2025-12-16 00:00:00 UTC
  Entries: 3
```

### Revoking a Certificate

```
! On Enterprise CA - revoke compromised certificate
# Using OpenSSL
openssl ca -config openssl.cnf -revoke compromised-cert.pem -crl_reason keyCompromise

# Generate new CRL
openssl ca -config openssl.cnf -gencrl -out sdwan-ca.crl

# Publish CRL to distribution point
scp sdwan-ca.crl webserver:/var/www/crl/

! On SD-WAN - force CRL refresh
vManage# request certificate crl update
```

---

## 5.6.8 Troubleshooting

### Common Certificate Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| Chain incomplete | Auth failure | Install full CA chain |
| Expired certificate | Control connection down | Renew certificate |
| Wrong key usage | TLS handshake fail | Reissue with correct EKU |
| Time skew | Cert appears invalid | Sync NTP on device |
| CRL unavailable | Warning in logs | Check CRL distribution point |

### Diagnostic Commands

```
! Check certificate status
device# show certificate installed
device# show certificate root-ca-cert
device# show certificate signing-request

! Verify certificate chain
device# show certificate validity

! Debug certificate issues
device# debug sdwan certificate
device# show sdwan certificate status

! Check control plane authentication
device# show sdwan control connections
device# show sdwan control local-properties | include certificate
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech Network Engineering | Initial release |

---

*Abhavtech Confidential - SD-WAN Certificate Management Guide*
