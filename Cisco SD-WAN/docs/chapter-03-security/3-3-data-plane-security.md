# 3.3 Data Plane Security

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.3 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section provides comprehensive documentation of data plane security for Abhavtech's SD-WAN deployment. Data plane security encompasses all mechanisms protecting actual user traffic as it traverses the SD-WAN overlay network, including IPsec encryption, key management, tunnel security, and integrity protection.

### 1.1 Scope

| Aspect | Coverage |
|--------|----------|
| IPsec Tunnels | All WAN Edge tunnel configurations |
| Encryption | Algorithm selection and cipher suites |
| Key Management | IKEv2, DH groups, key rotation |
| Integrity | HMAC, packet authentication |
| Performance | Crypto acceleration, throughput |
| Compliance | Regulatory encryption requirements |

### 1.2 Security Objectives

```
+------------------------------------------------------------------+
|                    DATA PLANE SECURITY GOALS                      |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+  +------------------+  +------------------+ |
|  | CONFIDENTIALITY  |  |    INTEGRITY     |  |  AUTHENTICITY    | |
|  +------------------+  +------------------+  +------------------+ |
|  | AES-256-GCM      |  | HMAC-SHA-256     |  | IKEv2 Auth       | |
|  | ChaCha20-Poly    |  | Packet Signing   |  | Certificate Auth | |
|  | Data Encryption  |  | Tamper Detection |  | Peer Validation  | |
|  +------------------+  +------------------+  +------------------+ |
|                             |                                     |
|                             v                                     |
|  +------------------+  +------------------+  +------------------+ |
|  |  AVAILABILITY    |  | NON-REPUDIATION  |  |   COMPLIANCE     | |
|  +------------------+  +------------------+  +------------------+ |
|  | Anti-Replay      |  | Audit Logging    |  | NIST/PCI-DSS     | |
|  | DDoS Protection  |  | Traffic Records  |  | Data Sovereignty | |
|  | Tunnel Failover  |  | Key Archives     |  | Industry Reqs    | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. IPsec Architecture Overview

### 2.1 SD-WAN IPsec Design

```
+------------------------------------------------------------------+
|                   SD-WAN IPsec TUNNEL FABRIC                      |
+------------------------------------------------------------------+
|                                                                   |
|    Mumbai DC                              Chennai DR              |
|  +-------------+                        +-------------+           |
|  | WAN Edge-1  |========================| WAN Edge-1  |          |
|  | WAN Edge-2  |========================| WAN Edge-2  |          |
|  +------+------+                        +------+------+           |
|         ||                                     ||                 |
|         || IPsec Tunnels (AES-256-GCM)         ||                 |
|         ||                                     ||                 |
|  +------++------+   +-------------+    +------++------+          |
|  |   London     |   |  New Jersey |    |   Frankfurt  |          |
|  | WAN Edge-1/2 |   | WAN Edge-1/2|    |  WAN Edge-1  |          |
|  +------+-------+   +------+------+    +------+-------+          |
|         |                  |                  |                   |
|         +--------+---------+------------------+                   |
|                  |                                                |
|    +-------------+-------------+-------------+                    |
|    |             |             |             |                    |
| +--+---+     +---+--+     +---+--+     +---+--+                   |
| |Bangalore   |Delhi |     |Noida |     |Dallas|                   |
| |WAN Edge    |WAN E |     |WAN E |     |WAN E |                   |
| +------+     +------+     +------+     +------+                   |
|                                                                   |
| Legend: ===== Full-mesh IPsec    ----- Spoke IPsec               |
+------------------------------------------------------------------+
```

### 2.2 Tunnel Types and Security Profiles

| Tunnel Type | Use Case | Encryption | Key Exchange | Sites |
|-------------|----------|------------|--------------|-------|
| Hub-to-Hub | DC Interconnect | AES-256-GCM | IKEv2 DH20 | Mumbai-Chennai |
| Hub-to-Spoke | Site Connectivity | AES-256-GCM | IKEv2 DH19 | All branches |
| Spoke-to-Spoke | Direct Connect | AES-256-GCM | IKEv2 DH19 | On-demand |
| Management | Controller Comm | TLS 1.3 | ECDHE | All edges |

### 2.3 IPsec Mode Selection

```
+------------------------------------------------------------------+
|                      IPsec MODE COMPARISON                        |
+------------------------------------------------------------------+
|                                                                   |
|  TRANSPORT MODE (SD-WAN Default)                                  |
|  +------------------------------------------------------------+  |
|  | Original IP | ESP Header | Payload (encrypted) | ESP Trail |  |
|  +------------------------------------------------------------+  |
|  | - Lower overhead (no outer IP header duplication)           |  |
|  | - Used for SD-WAN DTLS/IPsec tunnels                       |  |
|  | - Protects payload only                                     |  |
|  +------------------------------------------------------------+  |
|                                                                   |
|  TUNNEL MODE (Site-to-Site / Third-Party)                        |
|  +------------------------------------------------------------+  |
|  | Outer IP | ESP | Inner IP | Payload (encrypted) | ESP Trail|  |
|  +------------------------------------------------------------+  |
|  | - Full packet encapsulation                                 |  |
|  | - Used for integration with external devices                |  |
|  | - Complete inner header protection                          |  |
|  +------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 3. Encryption Algorithms and Cipher Suites

### 3.1 Approved Cipher Suite for Abhavtech

| Parameter | Primary Selection | Fallback | Justification |
|-----------|-------------------|----------|---------------|
| Encryption | AES-256-GCM | AES-256-CBC | AEAD preferred, hardware acceleration |
| Integrity | SHA-384 | SHA-256 | Part of GCM AEAD |
| DH Group | Group 20 (384-bit ECP) | Group 19 (256-bit ECP) | ECDH performance |
| PRF | SHA-384 | SHA-256 | Key derivation |
| Key Lifetime | 4 hours (data) | 24 hours (control) | Balance security/performance |
| Rekey Margin | 10 minutes | - | Before expiration |

### 3.2 Cipher Suite Configuration

```
! IPsec Transform Set - Primary
crypto ipsec transform-set ABHAV-TS-PRIMARY esp-aes-256-gcm
 mode transport

! IPsec Transform Set - Fallback
crypto ipsec transform-set ABHAV-TS-FALLBACK esp-aes 256 esp-sha384-hmac
 mode transport

! IPsec Profile
crypto ipsec profile SDWAN-IPSEC-PROFILE
 set transform-set ABHAV-TS-PRIMARY ABHAV-TS-FALLBACK
 set pfs group20
 set security-association lifetime seconds 14400
 set security-association replay window-size 1024

! IKEv2 Proposal
crypto ikev2 proposal ABHAV-IKE-PROPOSAL
 encryption aes-cbc-256 aes-gcm-256
 integrity sha384 sha256
 group 20 19
 
! IKEv2 Policy
crypto ikev2 policy ABHAV-IKE-POLICY
 proposal ABHAV-IKE-PROPOSAL
```

### 3.3 Algorithm Security Analysis

```
+------------------------------------------------------------------+
|                    CIPHER STRENGTH ANALYSIS                       |
+------------------------------------------------------------------+
|                                                                   |
|  Algorithm         | Bit Strength | Quantum Safe | Compliance    |
|  ------------------+--------------+--------------+---------------  |
|  AES-256-GCM       | 256-bit      | Grover 128*  | NIST/PCI-DSS  |
|  SHA-384           | 384-bit      | 192-bit*     | FIPS 140-3    |
|  ECDH P-384        | 192-bit equiv| Not safe     | NSA Suite B   |
|  RSA-4096          | 140-bit equiv| Not safe     | Transitional  |
|                                                                   |
|  * Post-quantum bit strength with Grover's algorithm             |
|                                                                   |
|  Recommended Timeline:                                            |
|  2025-2027: Current suite (AES-256-GCM + ECDH)                   |
|  2027-2030: Hybrid (ECDH + Kyber)                                |
|  2030+    : Full post-quantum (ML-KEM)                           |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.4 Hardware Crypto Acceleration

| Platform | Crypto Engine | AES Throughput | Recommendation |
|----------|---------------|----------------|----------------|
| C8500-12X4QC | QAT + ISA | 25 Gbps | DC/Large Hub |
| C8300-2N2S-6T | ISA-L | 8 Gbps | Regional Hub |
| C8200-1N-4T | AES-NI | 4 Gbps | Branch |
| ISR 4461 | Built-in | 2 Gbps | Small Branch |

---

## 4. IKEv2 Key Exchange

### 4.1 IKEv2 Exchange Flow

```
+------------------------------------------------------------------+
|                     IKEv2 NEGOTIATION FLOW                        |
+------------------------------------------------------------------+
|                                                                   |
|     WAN Edge A                                    WAN Edge B      |
|         |                                              |          |
|         |-------- IKE_SA_INIT (Request) ------------->|          |
|         |  SAi1, KEi, Ni, N(NAT_DETECTION)            |          |
|         |                                              |          |
|         |<------- IKE_SA_INIT (Response) -------------|          |
|         |  SAr1, KEr, Nr, N(NAT_DETECTION), CERTREQ   |          |
|         |                                              |          |
|         |  [DH Key Exchange Complete - IKE SA Established]       |
|         |                                              |          |
|         |-------- IKE_AUTH (Request) ---------------->|          |
|         |  IDi, CERT, AUTH, SAi2, TSi, TSr           |          |
|         |  (Encrypted with IKE SA keys)               |          |
|         |                                              |          |
|         |<------- IKE_AUTH (Response) ----------------|          |
|         |  IDr, CERT, AUTH, SAr2, TSi, TSr           |          |
|         |  (Encrypted with IKE SA keys)               |          |
|         |                                              |          |
|         |  [IPsec SA (Child SA) Established]          |          |
|         |                                              |          |
|         |========= Encrypted Data Traffic ============|          |
|         |                                              |          |
+------------------------------------------------------------------+
```

### 4.2 Diffie-Hellman Group Selection

| DH Group | Type | Bit Strength | Use Case | Abhavtech Usage |
|----------|------|--------------|----------|-----------------|
| Group 14 | MODP | 2048-bit | Legacy | Deprecated |
| Group 15 | MODP | 3072-bit | Transition | Third-party |
| Group 19 | ECP | 256-bit | Default | Branch tunnels |
| Group 20 | ECP | 384-bit | High Security | DC/Hub tunnels |
| Group 21 | ECP | 521-bit | Max Security | Not used |

### 4.3 IKEv2 Configuration

```
! IKEv2 Keyring for SD-WAN
crypto ikev2 keyring SDWAN-KEYRING
 peer ANY
  address 0.0.0.0 0.0.0.0
  pre-shared-key local ABHAV-LOCAL-KEY
  pre-shared-key remote ABHAV-REMOTE-KEY

! IKEv2 Profile
crypto ikev2 profile SDWAN-IKE-PROFILE
 match identity remote any
 identity local address
 authentication remote rsa-sig
 authentication local rsa-sig
 pki trustpoint ABHAV-SDWAN-CA
 dpd 10 3 periodic
 nat keepalive 20
 
! IKEv2 Fragmentation (for NAT traversal)
crypto ikev2 fragmentation mtu 1400
```

### 4.4 Dead Peer Detection (DPD)

```
+------------------------------------------------------------------+
|                      DPD CONFIGURATION                            |
+------------------------------------------------------------------+
|                                                                   |
|  Purpose: Detect tunnel failures when no traffic flowing          |
|                                                                   |
|  Parameters:                                                      |
|  +------------------+------------------+-----------------------+  |
|  | Parameter        | Value            | Justification          | |
|  +------------------+------------------+-----------------------+  |
|  | DPD Interval     | 10 seconds       | Quick failure detect   | |
|  | DPD Retry        | 3 attempts       | Avoid false positives  | |
|  | DPD Mode         | Periodic         | Consistent monitoring  | |
|  | Total Timeout    | 30 seconds       | 10s x 3 retries        | |
|  +------------------+------------------+-----------------------+  |
|                                                                   |
|  Timeline:                                                        |
|  T+0s:   No response to DPD query                                |
|  T+10s:  First retry                                             |
|  T+20s:  Second retry                                            |
|  T+30s:  Third retry - peer declared dead                        |
|  T+31s:  Tunnel teardown and failover initiated                  |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 5. Key Rotation and Lifecycle

### 5.1 Key Hierarchy

```
+------------------------------------------------------------------+
|                     SD-WAN KEY HIERARCHY                          |
+------------------------------------------------------------------+
|                                                                   |
|                    +-------------------+                          |
|                    |   Root CA Key     |                          |
|                    | (Enterprise CA)   |                          |
|                    | Validity: 10 yrs  |                          |
|                    +--------+----------+                          |
|                             |                                     |
|              +--------------+--------------+                      |
|              |                             |                      |
|    +---------+----------+      +-----------+---------+            |
|    | Controller Cert    |      |   WAN Edge Cert     |            |
|    | Validity: 1 year   |      | Validity: 1 year    |            |
|    +--------+-----------+      +-----------+---------+            |
|             |                              |                      |
|             +---------------+--------------+                      |
|                             |                                     |
|                    +--------+----------+                          |
|                    |  IKE SA Keys      |                          |
|                    | Lifetime: 24 hrs  |                          |
|                    +--------+----------+                          |
|                             |                                     |
|                    +--------+----------+                          |
|                    |  IPsec SA Keys    |                          |
|                    | Lifetime: 4 hrs   |                          |
|                    +--------+----------+                          |
|                             |                                     |
|                    +--------+----------+                          |
|                    | Session Keys      |                          |
|                    | (Per-packet nonce)|                          |
|                    +-------------------+                          |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 Key Rotation Schedule

| Key Type | Lifetime | Rekey Before | Method | Automation |
|----------|----------|--------------|--------|------------|
| Root CA | 10 years | 6 months | Manual | Planned migration |
| Device Cert | 1 year | 30 days | Automatic | SCEP/EST |
| IKE SA | 24 hours | 30 minutes | Automatic | IKEv2 |
| IPsec SA | 4 hours | 10 minutes | Automatic | CREATE_CHILD_SA |
| PFS | Per-rekey | - | Automatic | New DH exchange |

### 5.3 Key Rotation Configuration

```
! IPsec SA Lifetime
crypto ipsec security-association lifetime seconds 14400
crypto ipsec security-association lifetime kilobytes 4608000

! IKE SA Lifetime
crypto ikev2 sa lifetime 86400

! Rekey Margin
crypto ikev2 sa rekey margin 1800
crypto ikev2 sa rekey fuzz 100

! Perfect Forward Secrecy
crypto ipsec pfs group20
```

### 5.4 Automatic Rekey Process

```
+------------------------------------------------------------------+
|                    AUTOMATIC REKEY FLOW                           |
+------------------------------------------------------------------+
|                                                                   |
|  Time: T                    T+3.5hr                 T+4hr         |
|    |                           |                       |          |
|    | IPsec SA Created          | Soft Expiry           | Hard    |
|    | Lifetime: 4 hours         | (10 min before)       | Expiry  |
|    |                           |                       |          |
|    +---------------------------+                       |          |
|    |                           |                       |          |
|    |    [Normal Traffic Flow]  |                       |          |
|    |                           |                       |          |
|    |                   +-------+-------+               |          |
|    |                   | CREATE_CHILD_SA|              |          |
|    |                   | (with new keys)|              |          |
|    |                   +-------+-------+               |          |
|    |                           |                       |          |
|    |                   [New SA Active]                |          |
|    |                   [Old SA Deleted]               |          |
|    |                           |                       |          |
|                                                                   |
|  Benefits:                                                        |
|  - Zero traffic disruption during rekey                          |
|  - Forward secrecy with PFS                                       |
|  - Automatic recovery from key compromise                         |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 6. Tunnel Security Features

### 6.1 Anti-Replay Protection

```
+------------------------------------------------------------------+
|                    ANTI-REPLAY WINDOW                             |
+------------------------------------------------------------------+
|                                                                   |
|  Window Size: 1024 packets (configurable)                         |
|                                                                   |
|  Sequence Number Tracking:                                        |
|  +----------------------------------------------------------+    |
|  | Packet arrives with Seq# N                                |    |
|  +----------------------------------------------------------+    |
|            |                                                      |
|            v                                                      |
|  +----------------------------------------------------------+    |
|  | Is N > Highest Received?                                  |    |
|  +--+-------------------------------------------------------+    |
|     |YES                              |NO                         |
|     v                                 v                           |
|  +------------------+     +----------------------------+          |
|  | Accept packet    |     | Is N within window range?  |         |
|  | Update highest   |     | (Highest - 1024 to Highest)|         |
|  +------------------+     +--+-------------------------+          |
|                              |YES              |NO                |
|                              v                 v                  |
|                   +------------------+  +------------------+      |
|                   | Check bitmap     |  | DROP packet      |      |
|                   | Already seen?    |  | (Replay attack)  |      |
|                   +--+---------------+  +------------------+      |
|                      |NO       |YES                               |
|                      v         v                                  |
|           +------------------+  +------------------+              |
|           | Accept packet    |  | DROP packet      |              |
|           | Mark in bitmap   |  | (Duplicate)      |              |
|           +------------------+  +------------------+              |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 Anti-Replay Configuration

```
! Enable extended anti-replay window
crypto ipsec security-association replay window-size 1024

! Disable replay for specific scenarios (NOT recommended)
! crypto ipsec security-association replay disable

! Verification
show crypto ipsec sa detail | include replay
```

### 6.3 NAT Traversal (NAT-T)

```
+------------------------------------------------------------------+
|                    NAT TRAVERSAL DESIGN                           |
+------------------------------------------------------------------+
|                                                                   |
|                    +-------------+                                |
|     WAN Edge       |    NAT      |       SD-WAN Controller        |
|     (Branch)       |   Device    |           (DC)                 |
|         |          +------+------+              |                 |
|         |                 |                     |                 |
|    +----+----+     +------+------+       +------+------+          |
|    | Private |     | Translated  |       | Public IP   |          |
|    | IP:4500 |---->| IP:Random   |------>| IP:4500     |          |
|    +---------+     +-------------+       +-------------+          |
|                                                                   |
|  Without NAT-T:                                                   |
|  - ESP (Protocol 50) cannot traverse most NATs                   |
|  - IKE (UDP 500) works but ESP blocked                           |
|                                                                   |
|  With NAT-T:                                                      |
|  - IKE detects NAT using NAT-D payloads                          |
|  - ESP encapsulated in UDP (port 4500)                           |
|  - Keepalives maintain NAT mappings                              |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.4 NAT-T Configuration

```
! Enable NAT-T (default in IKEv2)
crypto ikev2 nat keepalive 20

! UDP Encapsulation for ESP
crypto ipsec nat-transparency udp-encapsulation

! Verify NAT detection
show crypto ikev2 sa detail | include NAT
```

---

## 7. Per-Tunnel QoS and Traffic Protection

### 7.1 QoS Integration with IPsec

```
+------------------------------------------------------------------+
|                   QoS + IPsec INTEGRATION                         |
+------------------------------------------------------------------+
|                                                                   |
|  Traffic Flow:                                                    |
|                                                                   |
|  +--------+     +--------+     +--------+     +--------+          |
|  | App    |---->| QoS    |---->| IPsec  |---->| Tunnel |          |
|  | Traffic|     | Marking|     | Encrypt|     | Egress |          |
|  +--------+     +--------+     +--------+     +--------+          |
|                                                                   |
|  QoS Preservation:                                                |
|  +----------------------------------------------------------+    |
|  | Original Packet:                                          |    |
|  | [IP Header DSCP=EF] [UDP] [Voice Payload]                 |    |
|  +----------------------------------------------------------+    |
|                    |                                              |
|                    v IPsec Encryption                             |
|  +----------------------------------------------------------+    |
|  | Encrypted Packet:                                         |    |
|  | [Outer IP DSCP=EF] [ESP] [Encrypted Inner Packet]         |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  DSCP Copying: Inner DSCP value copied to outer IP header        |
|                                                                   |
+------------------------------------------------------------------+
```

### 7.2 Per-Tunnel Traffic Engineering

| Tunnel | Transport | DSCP Copy | Bandwidth | Priority |
|--------|-----------|-----------|-----------|----------|
| MPLS-Tunnel | mpls1 | Yes | 1 Gbps | EF, AF |
| INET-Tunnel | internet | Yes | 500 Mbps | All |
| LTE-Tunnel | lte | Yes | 100 Mbps | EF only |

### 7.3 Tunnel Bandwidth Enforcement

```
! Service VPN Policy with Bandwidth Limits
policy
 data-policy TUNNEL-BANDWIDTH
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     source-ip 0.0.0.0/0
    action accept
     set
      tloc-list MPLS-PREFERRED
      service-tloc-encapsulation ipsec
    rate-limit
     aggregate 500000000
```

---

## 8. Advanced Data Plane Security

### 8.1 Packet Duplication for Critical Traffic

```
+------------------------------------------------------------------+
|                    PACKET DUPLICATION                             |
+------------------------------------------------------------------+
|                                                                   |
|  Use Case: Voice/video requiring zero packet loss                 |
|                                                                   |
|  +--------+                                          +--------+   |
|  | Voice  |   Path 1 (MPLS)                          | Voice  |  |
|  | Source |==========[Packet Copy 1]=================>| Dest   |  |
|  |        |                                          |        |   |
|  |        |   Path 2 (Internet)                      |        |   |
|  |        |----------[Packet Copy 2]---------------->|        |   |
|  +--------+                                          +--------+   |
|                                                                   |
|  De-duplication at receiver:                                      |
|  - First copy received is delivered                               |
|  - Duplicate copies discarded                                     |
|  - Provides resilience against path failure                       |
|                                                                   |
+------------------------------------------------------------------+
```

### 8.2 Packet Duplication Configuration

```
policy
 app-route-policy VOICE-DUPLICATION
  vpn-list VPN-40-VOICE
   sequence 10
    match
     dscp 46
    action
     backup-sla-preferred-color mpls
     sla-class VOICE-SLA strict
     packet-duplication
     loss-correction fec adaptive
```

### 8.3 Forward Error Correction (FEC)

```
+------------------------------------------------------------------+
|                 FORWARD ERROR CORRECTION                          |
+------------------------------------------------------------------+
|                                                                   |
|  FEC adds redundancy to recover lost packets without retransmit   |
|                                                                   |
|  Example: 4+1 FEC (4 data packets + 1 parity)                    |
|                                                                   |
|  +----+  +----+  +----+  +----+  +----+                          |
|  | D1 |  | D2 |  | D3 |  | D4 |  | P  |  --> Sent                |
|  +----+  +----+  +----+  +----+  +----+                          |
|    |       X       |       |       |       (D2 lost in transit)  |
|    v               v       v       v                              |
|  +----+         +----+  +----+  +----+                           |
|  | D1 |         | D3 |  | D4 |  | P  |  --> Received             |
|  +----+         +----+  +----+  +----+                           |
|                                                                   |
|  D2 = D1 XOR D3 XOR D4 XOR P  --> Reconstructed                  |
|                                                                   |
|  Configuration:                                                   |
|  - Adaptive: FEC enabled only when loss detected                 |
|  - Always-on: Continuous FEC (higher bandwidth)                  |
|                                                                   |
+------------------------------------------------------------------+
```

### 8.4 FEC Configuration

```
policy
 app-route-policy FEC-POLICY
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list REAL-TIME-APPS
    action
     sla-class STRICT-SLA
     loss-correction fec adaptive
     fec-threshold 3
```

---

## 9. Site-Specific Security Profiles

### 9.1 Security Profile Matrix

| Site | Role | Encryption | DH Group | PFS | Features |
|------|------|------------|----------|-----|----------|
| Mumbai DC | Hub | AES-256-GCM | 20 | Yes | Full UTD |
| Chennai DR | Hub | AES-256-GCM | 20 | Yes | Full UTD |
| London | Hub | AES-256-GCM | 20 | Yes | Full UTD |
| New Jersey | Hub | AES-256-GCM | 20 | Yes | Full UTD |
| Bangalore | Branch | AES-256-GCM | 19 | Yes | Basic UTD |
| Delhi | Branch | AES-256-GCM | 19 | Yes | Basic UTD |
| Frankfurt | Branch | AES-256-GCM | 19 | Yes | Basic UTD |
| Dallas | Branch | AES-256-GCM | 19 | Yes | Basic UTD |
| Noida | Branch | AES-256-GCM | 19 | Yes | DNS only |

### 9.2 Data Center Security Profile

```
! Mumbai/Chennai DC Security Template
security
 ipsec
  rekey 14400
  replay-window 1024
  authentication-type ah-sha1-hmac sha1-hmac
  extended-ar-window 256
  pairwise-keying

! IKEv2 Profile for DC
crypto ikev2 profile DC-SECURITY-PROFILE
 match identity remote any
 authentication remote rsa-sig
 authentication local rsa-sig
 pki trustpoint ABHAV-SDWAN-CA
 dpd 10 3 periodic
 nat keepalive 20
 
! IPsec Profile
crypto ipsec profile DC-IPSEC
 set transform-set AES256-GCM
 set pfs group20
 set security-association lifetime seconds 14400
```

### 9.3 Branch Security Profile

```
! Branch Sites Security Template
security
 ipsec
  rekey 14400
  replay-window 512
  authentication-type sha1-hmac
  pairwise-keying

! IKEv2 Profile for Branch
crypto ikev2 profile BRANCH-SECURITY-PROFILE
 match identity remote any
 authentication remote rsa-sig
 authentication local rsa-sig
 pki trustpoint ABHAV-SDWAN-CA
 dpd 15 3 periodic
 nat keepalive 30
```

---

## 10. Tunnel Monitoring and Visibility

### 10.1 IPsec SA Monitoring

```
! View IPsec Security Associations
show crypto ipsec sa

! Detailed SA Information
show crypto ipsec sa detail

! Example Output:
interface: Tunnel100
  Crypto map tag: Tunnel100-head-0, local addr 10.100.1.1

  protected vrf: (none)
  local  ident (addr/mask/prot/port): (0.0.0.0/0.0.0.0/0/0)
  remote ident (addr/mask/prot/port): (0.0.0.0/0.0.0.0/0/0)
  current_peer 10.100.2.1 port 4500
  
  #pkts encaps: 15847293, #pkts encrypt: 15847293
  #pkts decaps: 14932847, #pkts decrypt: 14932847
  #pkts verify: 14932847, #recv errors: 0
  #pkts replay: 0, #pkts replay-window: 0
  
  inbound esp sas:
   spi: 0xA1B2C3D4(2712847316)
   transform: esp-aes-256-gcm
   in use settings: Tunnel,
   sa timing: remaining key lifetime (k/sec): (4608000/13847)
   Replay Check: Yes, Replay window size: 1024
   
  outbound esp sas:
   spi: 0xD4C3B2A1(3569587873)
   transform: esp-aes-256-gcm
```

### 10.2 IKEv2 SA Monitoring

```
! View IKE Security Associations
show crypto ikev2 sa

! Detailed IKE SA
show crypto ikev2 sa detailed

! Example Output:
IPv4 Crypto IKEv2 SA

Tunnel-id Local                 Remote                fvrf/ivrf   Status
1         10.100.1.1/4500       10.100.2.1/4500       none/none   READY
      Encr: AES-CBC-256, keysize: 256, PRF: SHA384
      Hash: SHA384, DH Grp:20, Auth sign: RSA, Auth verify: RSA
      Life/Active Time: 86400/71842 sec
      CE id: 1001, Session-id: 1
      Status Description: Negotiation done
      Local spi: 1234567890ABCDEF       Remote spi: FEDCBA0987654321
      Local id: 10.100.1.1
      Remote id: 10.100.2.1
      Local req msg id:  0              Remote req msg id: 0
      Local next msg id: 0              Remote next msg id: 0
      Local req queued:  0              Remote req queued: 0
      Local window:      5              Remote window: 5
      DPD configured for 10 seconds, retry 3
```

### 10.3 Performance Metrics

```
! Crypto Engine Performance
show platform hardware qfp active feature ipsec state

! Crypto Throughput
show platform hardware qfp active datapath utilization

! IPsec Statistics
show crypto ipsec sa statistics

! Key Metrics to Monitor:
+------------------------------------------------------------------+
| Metric               | Threshold      | Action                   |
+------------------------------------------------------------------+
| Encrypt Rate         | >80% capacity  | Scale up platform        |
| Decrypt Rate         | >80% capacity  | Scale up platform        |
| Replay Failures      | >0             | Investigate              |
| Auth Failures        | >0             | Check certificates       |
| Rekey Failures       | >0             | Check key config         |
| SA Lifetime          | <10 min        | Monitor for rekey        |
+------------------------------------------------------------------+
```

---

## 11. Troubleshooting Data Plane Security

### 11.1 Common Issues and Resolution

| Issue | Symptoms | Diagnosis | Resolution |
|-------|----------|-----------|------------|
| Tunnel Down | No connectivity | `show crypto ikev2 sa` | Check certificates, NAT |
| High Latency | Slow apps | `show crypto engine qfp active` | Check crypto acceleration |
| Packet Drops | Intermittent loss | `show crypto ipsec sa` errors | Check replay window |
| Rekey Failure | Brief outages | `debug crypto ikev2` | Verify lifetime settings |
| NAT Issues | Tunnel flapping | Check NAT-T status | Enable keepalives |

### 11.2 Debug Commands

```
! IPsec Debug (use with caution)
debug crypto ipsec
debug crypto ipsec error
debug crypto ipsec detail

! IKEv2 Debug
debug crypto ikev2
debug crypto ikev2 error
debug crypto ikev2 packet

! Conditional Debug
debug crypto condition peer ipv4 10.100.2.1
debug crypto ikev2

! Disable Debug
undebug all
```

### 11.3 Troubleshooting Workflow

```
+------------------------------------------------------------------+
|                 DATA PLANE TROUBLESHOOTING                        |
+------------------------------------------------------------------+
|                                                                   |
|  Step 1: Verify Tunnel Status                                     |
|  +----------------------------------------------------------+    |
|  | show sdwan control connections                            |    |
|  | show crypto ikev2 sa                                      |    |
|  | show crypto ipsec sa                                      |    |
|  +----------------------------------------------------------+    |
|                             |                                     |
|                             v                                     |
|  Step 2: Check for Errors                                         |
|  +----------------------------------------------------------+    |
|  | show crypto ipsec sa | include error|fail|replay         |    |
|  | show crypto ikev2 stats                                   |    |
|  +----------------------------------------------------------+    |
|                             |                                     |
|                             v                                     |
|  Step 3: Validate Configuration                                   |
|  +----------------------------------------------------------+    |
|  | show running-config | section crypto                      |    |
|  | show crypto ikev2 proposal                                |    |
|  | show crypto ipsec transform-set                           |    |
|  +----------------------------------------------------------+    |
|                             |                                     |
|                             v                                     |
|  Step 4: Enable Debug (if needed)                                 |
|  +----------------------------------------------------------+    |
|  | debug crypto condition peer ipv4 X.X.X.X                  |    |
|  | debug crypto ikev2 error                                  |    |
|  | terminal monitor                                          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 12. Compliance and Audit

### 12.1 Encryption Compliance Matrix

| Standard | Requirement | Abhavtech Implementation | Status |
|----------|-------------|--------------------------|--------|
| NIST SP 800-175B | AES-256 for data-in-transit | AES-256-GCM | ✅ Compliant |
| PCI-DSS 4.2 | Strong cryptography | TLS 1.3 / AES-256 | ✅ Compliant |
| FIPS 140-3 | Validated modules | Cisco FIPS mode | ✅ Compliant |
| ISO 27001 A.10 | Cryptographic controls | Documented policy | ✅ Compliant |
| SOC 2 | Encryption in transit | Full coverage | ✅ Compliant |

### 12.2 Audit Evidence Collection

```
! Generate Security Audit Report
show crypto ipsec sa summary
show crypto ikev2 sa summary
show crypto key mypubkey rsa
show crypto pki certificates

! Export to Log
terminal length 0
show tech-support security
! Capture output for audit records
```

### 12.3 Compliance Monitoring

```
+------------------------------------------------------------------+
|                 COMPLIANCE MONITORING CHECKLIST                   |
+------------------------------------------------------------------+
|                                                                   |
|  Daily:                                                           |
|  [ ] All IPsec tunnels operational                                |
|  [ ] No authentication failures in logs                           |
|  [ ] Crypto engine utilization <80%                               |
|                                                                   |
|  Weekly:                                                          |
|  [ ] Review rekey success rate                                    |
|  [ ] Check certificate expiration dates                           |
|  [ ] Validate DH group usage                                      |
|                                                                   |
|  Monthly:                                                         |
|  [ ] Audit cipher suite configuration                             |
|  [ ] Review security event logs                                   |
|  [ ] Test failover scenarios                                      |
|                                                                   |
|  Quarterly:                                                       |
|  [ ] Certificate renewal planning                                 |
|  [ ] Algorithm deprecation review                                 |
|  [ ] Compliance attestation                                       |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 13. Best Practices Summary

### 13.1 Encryption Best Practices

- Use AES-256-GCM as primary cipher (AEAD provides encryption + integrity)
- Enable hardware crypto acceleration on all platforms
- Use ECP groups (19/20) instead of MODP for better performance
- Enable PFS for all IPsec SAs

### 13.2 Key Management Best Practices

- Set appropriate key lifetimes (4 hours IPsec, 24 hours IKE)
- Enable automatic rekey with sufficient margin
- Use certificate-based authentication
- Plan for post-quantum crypto migration

### 13.3 Tunnel Security Best Practices

- Enable anti-replay protection with extended window
- Configure DPD for quick failure detection
- Use NAT-T for environments with NAT devices
- Monitor tunnel health continuously

### 13.4 Performance Best Practices

- Size platforms for required crypto throughput
- Use QAT-enabled platforms for high-throughput sites
- Balance security features with performance impact
- Enable FEC/duplication only for critical traffic

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco IPsec Configuration Guide | Official IPsec documentation | cisco.com |
| NIST SP 800-57 | Key Management Recommendations | nist.gov |
| RFC 7296 | IKEv2 Protocol Specification | ietf.org |
| RFC 4303 | ESP Protocol Specification | ietf.org |
| Abhavtech Security Policy | Corporate encryption standards | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.3*
