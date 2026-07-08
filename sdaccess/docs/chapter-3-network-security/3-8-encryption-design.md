# 3.8 Encryption Design for SD-Access

## 3.8.1 Encryption Architecture Overview

### Encryption Layers in SD-Access

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    SD-ACCESS ENCRYPTION ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   LAYER 1: UNDERLAY ENCRYPTION (MACsec 802.1AE)                                 │
│   ─────────────────────────────────────────────                                 │
│   • Point-to-point encryption between switches                                  │
│   • Protects underlay routing and control plane                                 │
│   • Hardware-accelerated (line rate)                                            │
│                                                                                  │
│   [Edge] ══MACsec══ [Distribution] ══MACsec══ [Border]                         │
│                                                                                  │
│   LAYER 2: OVERLAY ENCRYPTION (VXLAN + Encryption)                              │
│   ─────────────────────────────────────────────────                             │
│   • VXLAN natively does NOT encrypt payload                                     │
│   • Optional: Encrypt sensitive VN traffic with IPsec                          │
│   • Typically not required if MACsec is deployed                               │
│                                                                                  │
│   LAYER 3: WAN ENCRYPTION (SD-WAN IPsec/DTLS)                                   │
│   ───────────────────────────────────────────                                   │
│   • Site-to-site encryption over WAN                                            │
│   • Handled by SD-WAN overlay                                                   │
│   • AES-256-GCM encryption                                                      │
│                                                                                  │
│   LAYER 4: MANAGEMENT ENCRYPTION (TLS/SSH)                                      │
│   ─────────────────────────────────────────                                     │
│   • HTTPS for DNAC, ISE, WLC management                                        │
│   • SSH for device CLI access                                                   │
│   • RadSec for RADIUS over TLS                                                  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Encryption Summary Table

| Layer | Protocol | Algorithm | Key Size | Use Case |
|-------|----------|-----------|----------|----------|
| Underlay P2P | MACsec (802.1AE) | AES-GCM-256 | 256-bit | Inter-switch links |
| Overlay Data | VXLAN (native) | None | N/A | Standard traffic |
| Overlay Secure | VXLAN + IPsec | AES-GCM-256 | 256-bit | Sensitive VN |
| WAN Transit | IPsec/DTLS | AES-GCM-256 | 256-bit | SD-WAN tunnels |
| Management | TLS 1.2+ | AES-256 | 256-bit | DNAC, ISE GUI |
| RADIUS | RadSec (TLS) | AES-256 | 256-bit | AAA traffic |
| Wireless | WPA3-GCMP | AES-GCM-256 | 256-bit | Wi-Fi encryption |

---

## 3.8.2 MACsec Architecture

### MACsec Deployment Topology

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         MACSEC DEPLOYMENT TOPOLOGY                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   FABRIC EDGE                 DISTRIBUTION              BORDER                  │
│   ┌───────────┐              ┌───────────┐            ┌───────────┐             │
│   │ MUM-ED-01 │══MACsec P2P══│ MUM-DS-01 │══MACsec══ │ MUM-BN-01 │             │
│   └───────────┘              └───────────┘            └───────────┘             │
│        │                          │                        │                    │
│   ┌───────────┐              ┌───────────┐            ┌───────────┐             │
│   │ MUM-ED-02 │══MACsec P2P══│ MUM-DS-02 │══MACsec══ │ MUM-BN-02 │             │
│   └───────────┘              └───────────┘            └───────────┘             │
│                                                                                  │
│   CONTROL PLANE LINKS                                                           │
│   ┌───────────┐                                                                  │
│   │ MUM-CP-01 │══MACsec══[All Fabric Nodes]                                     │
│   └───────────┘                                                                  │
│   ┌───────────┐                                                                  │
│   │ MUM-CP-02 │══MACsec══[All Fabric Nodes]                                     │
│   └───────────┘                                                                  │
│                                                                                  │
│   Legend:                                                                        │
│   ══MACsec══ = 802.1AE encrypted link (AES-256-GCM)                            │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### MACsec Benefits

| Benefit | Description |
|---------|-------------|
| Confidentiality | Encrypts all frames on the link |
| Integrity | Detects any frame modification |
| Replay Protection | Prevents replay attacks |
| Line Rate | Hardware-accelerated, no performance impact |
| Transparency | Works with all upper-layer protocols |

---

## 3.8.3 MACsec Configuration

### MKA Policy Configuration

```cisco
! ============================================================
! MACsec Key Agreement (MKA) POLICY
! ============================================================

! MKA Policy with AES-256-GCM (strongest)
mka policy MKA-256-GCMP
 key-server priority 0
 macsec-cipher-suite gcm-aes-256
 confidentiality-offset 0
 sak-rekey-interval 86400
 sak-rekey-on-live-peer-loss

! Alternative: MKA Policy with XPN (Extended Packet Numbering)
! For 100G+ links to prevent PN exhaustion
mka policy MKA-256-XPN
 key-server priority 0
 macsec-cipher-suite gcm-aes-xpn-256
 confidentiality-offset 0
 sak-rekey-interval 86400
```

### Key Chain Configuration

```cisco
! ============================================================
! KEY CHAIN FOR MACsec (Pre-Shared Key)
! ============================================================

! Key chain with rotating keys
key chain MACSEC-KEYS macsec
 key 01
  cryptographic-algorithm aes-256-cmac
  key-string 7 <encrypted-256bit-key-1>
  lifetime local 00:00:00 Jan 1 2025 duration 31536000
 key 02
  cryptographic-algorithm aes-256-cmac
  key-string 7 <encrypted-256bit-key-2>
  lifetime local 00:00:00 Jul 1 2025 duration 31536000

! Note: Keys should be rotated annually
! Use different keys for different link types if desired
```

### Interface MACsec Configuration

```cisco
! ============================================================
! MACsec INTERFACE CONFIGURATION - UPLINKS
! ============================================================

! Uplink to Distribution/Core (10G/25G/40G/100G)
interface TenGigabitEthernet1/1/1
 description UPLINK-TO-DIST-MACSEC
 no switchport
 ip address 10.251.1.0 255.255.255.254
 
 ! MACsec Configuration
 mka policy MKA-256-GCMP
 mka pre-shared-key key-chain MACSEC-KEYS
 macsec
 macsec replay-protection window-size 64
 
 ! Routing
 ip ospf network point-to-point
 ip router isis UNDERLAY

! ============================================================
! MACsec INTERFACE CONFIGURATION - DOWNLINKS (Optional)
! ============================================================

! Downlink to Access Switches (if extended nodes used)
interface GigabitEthernet1/0/48
 description DOWNLINK-TO-EXTENDED-NODE
 switchport mode trunk
 
 ! MACsec for downlink
 mka policy MKA-256-GCMP
 mka pre-shared-key key-chain MACSEC-KEYS
 macsec
```

---

## 3.8.4 MACsec Modes

### Should-Secure vs Must-Secure

```cisco
! ============================================================
! MACsec SECURITY MODES
! ============================================================

! SHOULD-SECURE (Default - Fallback allowed)
! - Attempts MACsec, falls back to clear if peer doesn't support
! - Use during migration or with legacy devices
interface TenGigabitEthernet1/1/1
 macsec
 ! Default behavior: should-secure

! MUST-SECURE (Strict - No fallback)
! - MACsec required, link down if no MACsec
! - Use for production security enforcement
interface TenGigabitEthernet1/1/1
 macsec network-link
 ! Forces must-secure mode
```

### Mode Selection Guidelines

| Scenario | Mode | Reason |
|----------|------|--------|
| Migration phase | should-secure | Allow mixed environment |
| Production uplinks | must-secure | Enforce encryption |
| Extended nodes | should-secure | May have legacy devices |
| Inter-DC links | must-secure | Critical path security |

---

## 3.8.5 MACsec with 802.1X (Downlink Encryption)

### 802.1X-2010 with MACsec to Endpoints

```cisco
! ============================================================
! MACsec TO ENDPOINTS (802.1X-2010)
! ============================================================
! Requires: Endpoint supplicant with MACsec support
! Example: Windows with Intel NIC, Cisco AnyConnect

! MKA Policy for endpoints
mka policy MKA-ENDPOINT
 key-server priority 0
 macsec-cipher-suite gcm-aes-128
 confidentiality-offset 0

! Interface configuration
interface GigabitEthernet1/0/1
 description USER-PORT-WITH-MACSEC
 switchport mode access
 switchport access vlan 100
 
 ! 802.1X configuration
 authentication port-control auto
 dot1x pae authenticator
 mab
 
 ! MACsec for authenticated sessions
 mka default-policy
 macsec

! ISE Authorization Profile must include:
! cisco-av-pair = linksec-policy=must-secure
! Or: cisco-av-pair = linksec-policy=should-secure
```

---

## 3.8.6 Certificate-Based MACsec (EAP-TLS)

### MACsec with PKI (Alternative to PSK)

```cisco
! ============================================================
! CERTIFICATE-BASED MACsec (Enterprise Deployments)
! ============================================================

! PKI Trustpoint Configuration
crypto pki trustpoint MACSEC-CA
 enrollment mode ra
 enrollment url http://10.252.1.60/certsrv/mscep/mscep.dll
 serial-number
 ip-address none
 subject-name CN=MUM-ED-01.corp.local,OU=Network,O=Corp
 revocation-check crl
 rsakeypair MACSEC-KEY 2048

! Authenticate and Enroll
crypto pki authenticate MACSEC-CA
crypto pki enroll MACSEC-CA

! MKA Policy for Certificate-Based
mka policy MKA-PKI
 key-server priority 0
 macsec-cipher-suite gcm-aes-256

! Interface with EAP-TLS MKA
interface TenGigabitEthernet1/1/1
 mka policy MKA-PKI
 macsec
 dot1x pae both
 dot1x credentials MACSEC-CRED
 
! EAP Credentials
dot1x credentials MACSEC-CRED
 username MUM-ED-01
 pki-trustpoint MACSEC-CA
```

---

## 3.8.7 RADIUS/AAA Encryption

### RadSec (RADIUS over TLS)

```cisco
! ============================================================
! RadSec CONFIGURATION (RADIUS over TLS)
! ============================================================

! PKI Trustpoint for RadSec
crypto pki trustpoint RADSEC-CA
 enrollment mode ra
 revocation-check crl

! RADIUS Server with TLS
radius server ISE-RADSEC
 address ipv4 10.252.30.10
 tls connectiontimeout 5
 tls trustpoint client RADSEC-CA
 tls trustpoint server RADSEC-CA

! AAA configuration using RadSec
aaa group server radius ISE-RADSEC-GROUP
 server name ISE-RADSEC
```

---

## 3.8.8 Management Plane Encryption

### SSH Configuration

```cisco
! ============================================================
! SSH HARDENING
! ============================================================

! Generate strong RSA key
crypto key generate rsa modulus 4096 label SSH-KEY

! SSH version 2 only
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3

! Restrict SSH access
ip ssh source-interface Loopback0

! VTY configuration
line vty 0 15
 transport input ssh
 access-class SSH-ACCESS in
 login authentication default
 
ip access-list extended SSH-ACCESS
 permit tcp host 10.252.10.10 any eq 22
 permit tcp 10.252.12.0 0.0.0.255 any eq 22
 deny ip any any log
```

### HTTPS Configuration

```cisco
! ============================================================
! HTTPS/RESTCONF CONFIGURATION
! ============================================================

! Enable HTTPS
ip http secure-server
ip http secure-port 443
ip http secure-ciphersuite aes-256-cbc-sha
ip http secure-active-session-modules all

! Disable HTTP
no ip http server

! RESTCONF
restconf
```

---

## 3.8.9 Verification Commands

### MACsec Verification

```cisco
! Show MACsec status on interface
show macsec interface Te1/1/1

! Expected output:
! MACsec is enabled
! Cipher Suite: GCM-AES-256
! Replay Protection: Enabled, Window Size: 64

! Show MKA sessions
show mka sessions

! Show MKA policy
show mka policy

! Show MKA statistics
show mka statistics interface Te1/1/1

! Show key chain
show key chain MACSEC-KEYS

! Debug MKA (use cautiously)
debug mka events
debug mka errors
```

### Troubleshooting MACsec

```cisco
! Common issues:

! 1. MKA session not establishing
show mka sessions
! Check: Key chain mismatch, policy mismatch, interface down

! 2. Traffic not passing
show macsec statistics interface Te1/1/1
! Check: Encrypt/Decrypt counters, error counters

! 3. Key rotation issues
show mka statistics interface Te1/1/1
! Check: SAK rekey counters

! 4. Performance issues
show platform hardware fed switch active fwd-asic resource tcam utilization
! Check: Hardware acceleration enabled
```

---

## 3.8.10 Performance Considerations

### MACsec Performance Impact

| Platform | MACsec Support | Performance |
|----------|---------------|-------------|
| Cat 9300 | Hardware | Line rate (1G/10G/25G) |
| Cat 9400 | Hardware | Line rate (all speeds) |
| Cat 9500 | Hardware | Line rate (10G/25G/40G/100G) |
| Cat 9600 | Hardware | Line rate (all speeds) |

### MTU Considerations

```cisco
! MACsec adds overhead to frames
! SecTAG: 8-16 bytes
! ICV: 8-16 bytes
! Total: 16-32 bytes additional

! Recommended MTU on MACsec links
interface TenGigabitEthernet1/1/1
 mtu 9216
 ! Ensures 9000-byte jumbo frames still work

! VXLAN + MACsec MTU calculation
! Original Frame: 1500
! VXLAN Header: +50
! MACsec Overhead: +32
! Required MTU: 1582 (minimum 1600 recommended)
```

---

## 3.8.11 Design Recommendations

### MACsec Deployment Guidelines

| Link Type | MACsec | Mode | Priority |
|-----------|--------|------|----------|
| Edge ↔ Distribution | Yes | must-secure | High |
| Distribution ↔ Border | Yes | must-secure | High |
| Border ↔ Control Plane | Yes | must-secure | High |
| Edge ↔ Extended Node | Optional | should-secure | Medium |
| Edge ↔ Endpoint | Optional | should-secure | Low |

### Key Management Best Practices

1. **Key Rotation**: Rotate PSK keys annually
2. **Key Diversity**: Use different keys for different link types
3. **Key Storage**: Store keys in encrypted vault
4. **Key Distribution**: Use secure out-of-band method
5. **Certificate-Based**: Consider PKI for large deployments

---

## 3.8.12 Encryption Checklist

| Component | Configuration | Status | Date |
|-----------|--------------|--------|------|
| **MACsec** |
| | MKA policy created | ☐ | |
| | Key chain configured | ☐ | |
| | Uplinks encrypted | ☐ | |
| | CP links encrypted | ☐ | |
| | must-secure enabled | ☐ | |
| **Management** |
| | SSH v2 only | ☐ | |
| | HTTPS enabled | ☐ | |
| | HTTP disabled | ☐ | |
| **RADIUS** |
| | Strong shared secrets | ☐ | |
| | RadSec (optional) | ☐ | |
| **Wireless** |
| | WPA3 enabled | ☐ | |
| | PMF required | ☐ | |

---
