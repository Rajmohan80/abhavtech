# 5.5 SD-WAN Validator Configuration

## Document Information
- **Version:** 1.0
- **Last Updated:** December 2025
- **Author:** Abhavtech Network Engineering
- **Classification:** Internal Use

---

## 5.5.1 Validator Architecture

### vBond Topology

```
+------------------------------------------------------------------+
|            ABHAVTECH SD-WAN VALIDATOR ARCHITECTURE                |
+------------------------------------------------------------------+
|                                                                   |
|                        CLOUD-HOSTED                               |
|  ┌──────────────────────────────────────────────────────────┐    |
|  │                                                           │    |
|  │    ┌─────────────────┐      ┌─────────────────┐          │    |
|  │    │  vBond-Primary  │      │  vBond-Secondary│          │    |
|  │    │  AWS Mumbai     │      │  AWS Singapore  │          │    |
|  │    │ Public IP: A.B.C.D│    │ Public IP: E.F.G.H│         │    |
|  │    │ System: 10.255.2.1│    │ System: 10.255.2.2│         │    |
|  │    └────────┬────────┘      └────────┬────────┘          │    |
|  │             │                        │                    │    |
|  └─────────────┼────────────────────────┼────────────────────┘   |
|                │                        │                         |
|                ▼                        ▼                         |
|  ┌──────────────────────────────────────────────────────────┐    |
|  │                    INTERNET                               │    |
|  └──────────────────────────────────────────────────────────┘    |
|                │                        │                         |
|                ▼                        ▼                         |
|  ┌─────────────────────┐   ┌─────────────────────┐               |
|  │   WAN Edge          │   │   WAN Edge          │               |
|  │   (Branch)          │   │   (Hub)             │               |
|  │   Behind NAT        │   │   Public IP         │               |
|  └─────────────────────┘   └─────────────────────┘               |
|                                                                   |
|  VALIDATOR FUNCTIONS:                                             |
|  - Orchestrator: Initial device authentication                   |
|  - NAT Traversal: Facilitate connections behind NAT              |
|  - STUN Server: Determine public IP/port mappings                |
|  - Controller Discovery: Direct devices to vSmart/vManage        |
|                                                                   |
+------------------------------------------------------------------+
```

### Validator Specifications

| Parameter | vBond-Primary | vBond-Secondary |
|-----------|---------------|-----------------|
| Location | AWS Mumbai (ap-south-1) | AWS Singapore (ap-southeast-1) |
| Instance Type | c5.xlarge | c5.xlarge |
| vCPU | 4 | 4 |
| Memory | 8 GB | 8 GB |
| Public IP | Elastic IP | Elastic IP |
| System-IP | 10.255.2.1 | 10.255.2.2 |
| Site-ID | 0 | 0 |

---

## 5.5.2 vBond Deployment

### AWS Deployment

```bash
# Deploy vBond in AWS using Terraform
# File: vbond.tf

provider "aws" {
  region = "ap-south-1"
}

resource "aws_instance" "vbond_primary" {
  ami           = "ami-0xyz..."  # Cisco vBond AMI
  instance_type = "c5.xlarge"
  
  network_interface {
    network_interface_id = aws_network_interface.vbond_mgmt.id
    device_index         = 0
  }
  
  network_interface {
    network_interface_id = aws_network_interface.vbond_transport.id
    device_index         = 1
  }
  
  tags = {
    Name = "vBond-Primary-Mumbai"
    Environment = "Production"
  }
}

resource "aws_eip" "vbond_primary" {
  instance = aws_instance.vbond_primary.id
  domain   = "vpc"
}

resource "aws_security_group" "vbond" {
  name = "vbond-sg"
  
  ingress {
    from_port   = 12346
    to_port     = 12346
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "DTLS control"
  }
  
  ingress {
    from_port   = 12346
    to_port     = 12346
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "TLS control"
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

### Initial Configuration

```
! vBond-Primary Configuration
vbond# config terminal

system
 host-name vbond-primary
 system-ip 10.255.2.1
 site-id 0
 organization-name "Abhavtech"
 vbond <public-ip> local vbond-only
!
vpn 0
 ip route 0.0.0.0/0 <gateway>
 interface ge0/0
  ip address <public-ip>/32
  tunnel-interface
   encapsulation dtls
   allow-service all
   no allow-service netconf
   allow-service sshd
  !
  no shutdown
 !
!
vpn 512
 ip route 0.0.0.0/0 <mgmt-gateway>
 interface eth0
  ip address 10.255.100.31/24
  no shutdown
 !
!
commit
```

---

## 5.5.3 Certificate Installation

### vBond Certificate

```
! Generate CSR on vBond
vbond-primary# request certificate generate csr

! Submit to Enterprise CA with:
! Subject: CN=vbond-primary.abhavtech.com,O=Abhavtech,C=IN
! SAN: DNS:sdwan-validator.abhavtech.com, IP:<public-ip>

! Install CA chain
vbond-primary# request root-cert-chain install /home/admin/abhavtech-ca-chain.pem

! Install signed certificate
vbond-primary# request certificate install /home/admin/vbond-primary-signed.pem

! Verify
vbond-primary# show certificate installed
Certificate:
  Subject: CN=vbond-primary.abhavtech.com,O=Abhavtech,C=IN
  Issuer: CN=Abhavtech-Issuing-CA,O=Abhavtech,C=IN
  Valid: Dec 15 2025 - Dec 15 2027
  Status: Valid
```

### Authorize vBond in vManage

```
! After vBond certificate is installed
vManage GUI: Configuration > Devices > Controllers

Add vBond:
  - vBond IP: <public-ip>
  - Username: admin
  - Password: ********
  - Generate CSR: Yes (if not already done)

! Verify authorization
vManage# show orchestrator connections
```

---

## 5.5.4 NAT Traversal Configuration

### NAT Traversal Modes

```
+------------------------------------------------------------------+
|                NAT TRAVERSAL SCENARIOS                            |
+------------------------------------------------------------------+
|                                                                   |
|  SCENARIO 1: Both endpoints behind NAT                           |
|  ┌─────────────────────────────────────────────────────────────┐ |
|  │  Branch A         NAT         Internet        NAT    Branch B│ |
|  │  10.1.1.1 ──► 203.x.x.x ──────────────── 204.x.x.x ◄── 10.2.2.2│|
|  │             └─────── vBond mediates STUN ───────┘            │ |
|  │                                                               │ |
|  │  Result: IPsec tunnel through symmetric NAT                  │ |
|  └─────────────────────────────────────────────────────────────┘ |
|                                                                   |
|  SCENARIO 2: One endpoint with public IP                         |
|  ┌─────────────────────────────────────────────────────────────┐ |
|  │  Branch          NAT         Internet              Hub       │ |
|  │  10.1.1.1 ──► 203.x.x.x ─────────────────────► 198.x.x.x    │ |
|  │             └── vBond discovers NAT type ──┘                 │ |
|  │                                                               │ |
|  │  Result: Direct tunnel, NAT keepalives enabled               │ |
|  └─────────────────────────────────────────────────────────────┘ |
|                                                                   |
|  SCENARIO 3: Restrictive NAT / Firewall                          |
|  ┌─────────────────────────────────────────────────────────────┐ |
|  │  Branch ──► Strict FW ──► Internet ──► Hub                   │ |
|  │                                                               │ |
|  │  If UDP blocked: Fall back to TCP/TLS (port 443)             │ |
|  │  If both blocked: Use vBond as relay (last resort)           │ |
|  └─────────────────────────────────────────────────────────────┘ |
|                                                                   |
+------------------------------------------------------------------+
```

### NAT Configuration on WAN Edge

```
! WAN Edge behind NAT
wan-edge# config terminal

vpn 0
 interface GigabitEthernet0/0/0
  tunnel-interface
   encapsulation ipsec prefer
   color biz-internet
   no allow-service bgp
   allow-service dhcp
   allow-service dns
   allow-service icmp
   allow-service sshd
   allow-service netconf
   allow-service ntp
   allow-service ospf
   allow-service stun
   ! NAT traversal settings
   vbond-as-stun-server
   exclude-controller-group-list 0
  !
 !
!
commit
```

### STUN Configuration

```
! Enable STUN on vBond
vbond# show system status | include stun

! On WAN Edge, verify STUN discovery
wan-edge# show sdwan control local-properties | include public
public-ip           203.145.67.89
public-port         12346

! If behind carrier-grade NAT
wan-edge# show sdwan tunnel statistics
Tunnel statistics:
  NAT type:    symmetric
  NAT traversal: vbond-stun
```

---

## 5.5.5 DNS Configuration

### DNS Records for vBond

```
; DNS Zone: abhavtech.com

; Primary vBond (Mumbai)
vbond-primary    IN    A    <public-ip-mumbai>

; Secondary vBond (Singapore)
vbond-secondary  IN    A    <public-ip-singapore>

; Load-balanced FQDN (Round-robin or GeoDNS)
sdwan-validator  IN    A    <public-ip-mumbai>
sdwan-validator  IN    A    <public-ip-singapore>

; For GeoDNS (if using Route 53 or similar)
; IN region: Mumbai vBond primary
; APAC region: Singapore vBond primary
```

### vBond DNS in vManage

```
vManage GUI: Administration > Settings

vBond Settings:
  DNS/IP: sdwan-validator.abhavtech.com
  Port: 12346
```

---

## 5.5.6 High Availability

### vBond HA Architecture

```
! vBond HA uses DNS-based failover
! Both vBonds are active-active

! Primary vBond (Mumbai)
system
 vbond <public-ip-mumbai> local vbond-only

! Secondary vBond (Singapore)
system  
 vbond <public-ip-singapore> local vbond-only

! WAN Edge configuration for redundant vBonds
vpn 0
 interface ge0/0
  tunnel-interface
   vbond sdwan-validator.abhavtech.com
   ! Falls back to secondary if primary unreachable
  !
 !
!
```

### HA Failover Test

```bash
#!/bin/bash
# vbond_ha_test.sh

echo "=== VBOND HA TEST ==="

# Test 1: Both vBonds reachable
echo "Test 1: Connectivity Check"
nc -zvu vbond-primary.abhavtech.com 12346
nc -zvu vbond-secondary.abhavtech.com 12346

# Test 2: DNS resolution
echo "Test 2: DNS Round-Robin"
for i in {1..10}; do
    dig +short sdwan-validator.abhavtech.com
done | sort | uniq -c

# Test 3: Failover simulation
echo "Test 3: Primary Failure Simulation"
echo "ACTION: Block vBond primary at firewall"
echo "EXPECTED: New device auth uses secondary vBond"
echo "VERIFY: show sdwan control connections on WAN Edge"
```

---

## 5.5.7 Security Hardening

### vBond Security Best Practices

```
! Disable unnecessary services
vbond# config terminal

system
 no telnet
 ssh-pubkey-auth
!

! Restrict management access
vpn 512
 interface eth0
  tunnel-interface
   encapsulation dtls
   allow-service sshd
   no allow-service netconf
   no allow-service all
  !
 !
!

! Rate limiting (protect against DoS)
security
 control-plane
  control-plane-policing
   rate-limit 1000
  !
 !
!
commit

! AWS Security Group (additional layer)
# Restrict source IPs if possible
# Allow only corporate IP ranges for SSH
```

### Access Control

```
! Management ACL
vbond# config terminal

policy
 access-list MGMT-ACCESS
  sequence 10
   match
    source-ip 10.0.0.0/8
   !
   action accept
  !
  sequence 20
   match
    source-ip 172.16.0.0/12
   !
   action accept
  !
  default-action drop
 !
!

vpn 512
 interface eth0
  access-list MGMT-ACCESS in
 !
!
commit
```

---

## 5.5.8 Monitoring

### vBond Health Monitoring

```python
#!/usr/bin/env python3
"""vBond Health Monitor"""

import socket
import ssl
import time

VBONDS = [
    ("vbond-primary.abhavtech.com", 12346),
    ("vbond-secondary.abhavtech.com", 12346)
]

def check_vbond(host, port):
    try:
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(5)
        sock.sendto(b"ping", (host, port))
        
        return "UP"
    except Exception as e:
        return f"DOWN: {e}"

def main():
    print("=== vBond Health Check ===")
    for host, port in VBONDS:
        status = check_vbond(host, port)
        print(f"{host}:{port} - {status}")

if __name__ == "__main__":
    main()
```

### SNMP Monitoring

```
! Enable SNMP on vBond
vbond# config terminal

snmp
 view ALL-VIEW
  oid 1
 !
 group MONITOR-GROUP view ALL-VIEW
 user snmpuser group MONITOR-GROUP auth sha-256 Auth123! priv aes-256 Priv123!
 trap group TRAP-GROUP
  target-ip 10.10.1.50 port 162
 !
!
commit
```

---

## 5.5.9 Verification Checklist

| Check | Command/Method | Expected | Status |
|-------|----------------|----------|--------|
| vBond reachable from internet | nc -zvu <ip> 12346 | Connection success | ☐ |
| Certificate valid | show certificate installed | Valid | ☐ |
| DNS resolving | dig sdwan-validator.abhavtech.com | Both IPs | ☐ |
| Registered in vManage | show orchestrator connections | Connected | ☐ |
| WAN Edge can auth | show sdwan control connections | vbond up | ☐ |
| HA failover works | Test with primary down | Secondary takes over | ☐ |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech Network Engineering | Initial release |

---

*Abhavtech Confidential - SD-WAN Validator Configuration Guide*
