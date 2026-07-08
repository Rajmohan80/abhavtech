# Chapter 5: DNS & Network Architecture 

> **Document Reference:** ABV-COLLAB-MIG-2026 | Chapter 5
> **Cross-References:** Chapter 2 (Calling Design), Chapter 4 (Compliance), ABV-SDWAN-2024, ABV-SDA-ISE-2025
> **Style:** Implementation-focused (Sonnet 4.5)

---

## 5.1 DNS Architecture Overview

### 5.1.1 Webex DNS Requirements Summary

| Service | FQDN Pattern | Resolution | Purpose |
|---------|--------------|------------|---------|
| Webex Calling | `*.webex.com` | Public DNS | Core calling services |
| Webex Edge | `*.ucmgmt.cisco.com` | Public DNS | Device management |
| Local Gateway | `*.ciscowebex.com` | Public DNS | LGW registration |
| Media Nodes | `*.wbx2.com` | Public DNS | Voice/video media |
| Control Hub | `admin.webex.com` | Public DNS | Administration |

### 5.1.2 DNS Resolution Architecture

```
+-----------------------------------------------------------------+
|              DNS RESOLUTION - ABHAVTECH                          |
+-----------------------------------------------------------------+
|                                                                 |
|  INTERNAL CLIENTS              EXTERNAL RESOLUTION              |
|                                                                 |
|  +----------+    +----------+    +----------+    +----------+ |
|  | Webex App|--->| Internal |--->| Forwarder|--->| Public   | |
|  | / Phone  |    | DNS      |    | (SD-WAN) |    | DNS      | |
|  +----------+    +----------+    +----------+    +----------+ |
|                       |                               |        |
|                       | Split DNS                     |        |
|                       v                               v        |
|                  +----------+                   +----------+  |
|                  | Internal |                   | Webex    |  |
|                  | Zones    |                   | Cloud    |  |
|                  +----------+                   +----------+  |
|                                                                 |
|  KEY REQUIREMENT: No DNS interception for *.webex.com          |
|                                                                 |
+-----------------------------------------------------------------+
```

### 5.1.3 Critical DNS Rules

| Rule | Requirement | Validation |
|------|-------------|------------|
| No proxy | Webex domains must bypass web proxy | `nslookup webex.com` returns public IP |
| No interception | SSL inspection disabled for Webex | Certificate = DigiCert (not internal CA) |
| Low TTL respect | Honor TTL values (failover) | DNS cache TTL <= 300s |
| IPv4 preferred | Dual-stack: prefer A over AAAA | Client config or DNS policy |

---

## 5.2 India DNS Configuration

### 5.2.1 India Internal DNS Servers

| Site | DNS Server | IP Address | Forwarder |
|------|------------|------------|-----------|
| Mumbai HQ | dc-mum-01.abhavtech.com | 10.1.10.5 | 8.8.8.8, 8.8.4.4 |
| Mumbai HQ | dc-mum-02.abhavtech.com | 10.1.10.6 | 8.8.8.8, 8.8.4.4 |
| Chennai | dc-che-01.abhavtech.com | 10.2.10.5 | 10.1.10.5 (via SD-WAN) |
| Bangalore | dc-blr-01.abhavtech.com | 10.3.10.5 | 10.1.10.5 (via SD-WAN) |

### 5.2.2 India LGW DNS Records

**Internal DNS Zone: abhavtech.com**

```dns
; Local Gateway A Records
lgw-mum-01.abhavtech.com.    IN  A  10.1.50.10
lgw-mum-02.abhavtech.com.    IN  A  10.1.50.11
lgw-che-01.abhavtech.com.    IN  A  10.2.50.10
lgw-blr-01.abhavtech.com.    IN  A  10.3.50.10
lgw-del-01.abhavtech.com.    IN  A  10.4.50.10
lgw-noi-01.abhavtech.com.    IN  A  10.5.50.10
lgw-hyd-01.abhavtech.com.    IN  A  10.7.50.10

; SRV Records (if using SRV-based routing)
_sips._tcp.lgw-mum.abhavtech.com.  IN  SRV  10 10 5061 lgw-mum-01.abhavtech.com.
_sips._tcp.lgw-mum.abhavtech.com.  IN  SRV  20 10 5061 lgw-mum-02.abhavtech.com.
```

### 5.2.3 Windows DNS Configuration (Mumbai)

```powershell
## Add Conditional Forwarder for Webex (bypass internal resolution) 
Add-DnsServerConditionalForwarderZone -Name "webex.com" -MasterServers 8.8.8.8,8.8.4.4
Add-DnsServerConditionalForwarderZone -Name "wbx2.com" -MasterServers 8.8.8.8,8.8.4.4
Add-DnsServerConditionalForwarderZone -Name "ciscospark.com" -MasterServers 8.8.8.8,8.8.4.4

## Verify 
Get-DnsServerZone | Where-Object {$_.ZoneType -eq 'Forwarder'}
```

---

## 5.3 EMEA DNS Configuration

### 5.3.1 EMEA DNS Servers

| Site | DNS Server | IP Address | Forwarder |
|------|------------|------------|-----------|
| London | dc-lon-01.abhavtech.com | 10.20.10.5 | 8.8.8.8, 1.1.1.1 |
| Frankfurt | dc-fra-01.abhavtech.com | 10.21.10.5 | 8.8.8.8, 1.1.1.1 |

### 5.3.2 EMEA-Specific DNS Considerations

| Requirement | Configuration |
|-------------|---------------|
| GDPR-compliant DNS | Use EU-based public DNS or internal only |
| UK data path | London clients resolve via UK DNS first |
| No LGW records | CCPP used - no internal gateway DNS needed |

---

## 5.4 Americas DNS Configuration

### 5.4.1 Americas DNS Servers

| Site | DNS Server | IP Address | Forwarder |
|------|------------|------------|-----------|
| New Jersey | dc-nj-01.abhavtech.com | 10.30.10.5 | 8.8.8.8, 8.8.4.4 |
| Dallas | dc-dal-01.abhavtech.com | 10.31.10.5 | 10.30.10.5 |

### 5.4.2 E911 Location Service DNS

```dns
; RedSky/Intrado E911 service endpoints (if self-hosted LIS)
e911-lis.abhavtech.com.    IN  A  10.30.50.20
```

---

## 5.5 Firewall Requirements by Region

### 5.5.1 Webex Calling - Required Destinations

**Reference:** https://help.webex.com/article/b2exve

| Destination | Port | Protocol | Purpose |
|-------------|------|----------|---------|
| `*.webex.com` | 443 | TCP/TLS | Signaling, API |
| `*.wbx2.com` | 443 | TCP/TLS | Media services |
| `*.ciscospark.com` | 443 | TCP/TLS | Messaging |
| `*.webexcontent.com` | 443 | TCP/TLS | Content sharing |
| Webex Media | 19560-65535 | UDP | RTP/SRTP media |
| Webex Media | 5004 | UDP | Alternate media |

### 5.5.2 India Firewall Rules (LGW Sites)

```
+-----------------------------------------------------------------+
|  INDIA FIREWALL RULES - LOCAL GATEWAY                           |
+-----------------------------------------------------------------+
|                                                                 |
|  OUTBOUND (LGW -> Webex Cloud)                                  |
|  ----------------------------                                   |
|  Source: LGW IPs (10.x.50.10)                                  |
|  Destination: *.webex.com, *.ciscowebex.com                    |
|  Ports: 443/TCP (TLS), 8443/TCP (registration)                 |
|  Action: ALLOW                                                  |
|                                                                 |
|  OUTBOUND (LGW -> PSTN Provider)                                |
|  ------------------------------                                 |
|  Source: LGW IPs                                               |
|  Destination: Provider SBC IPs (per contract)                  |
|  Ports: 5060/TCP (SIP), 5061/TCP (SIPS)                        |
|  Ports: 10000-20000/UDP (RTP)                                  |
|  Action: ALLOW                                                  |
|                                                                 |
|  INBOUND (PSTN Provider -> LGW)                                 |
|  -----------------------------                                  |
|  Source: Provider SBC IPs                                      |
|  Destination: LGW Public/NAT IPs                               |
|  Ports: 5060-5061/TCP, 10000-20000/UDP                         |
|  Action: ALLOW                                                  |
|                                                                 |
+-----------------------------------------------------------------+
```

### 5.5.3 Firewall Rule Template (Palo Alto)

```
## Webex Calling - Outbound 
set rulebase security rules Webex-Calling-Out from trust to untrust
set rulebase security rules Webex-Calling-Out source any
set rulebase security rules Webex-Calling-Out destination Webex-Cloud-FQDN
set rulebase security rules Webex-Calling-Out application ssl web-browsing webex
set rulebase security rules Webex-Calling-Out service application-default
set rulebase security rules Webex-Calling-Out action allow

## Webex Media - Outbound 
set rulebase security rules Webex-Media-Out from trust to untrust
set rulebase security rules Webex-Media-Out source Voice-VLAN
set rulebase security rules Webex-Media-Out destination any
set rulebase security rules Webex-Media-Out application rtp
set rulebase security rules Webex-Media-Out service service-udp-19560-65535
set rulebase security rules Webex-Media-Out action allow

## SSL Decryption Bypass 
set rulebase decryption rules No-Decrypt-Webex from trust to untrust
set rulebase decryption rules No-Decrypt-Webex destination Webex-Cloud-FQDN
set rulebase decryption rules No-Decrypt-Webex action no-decrypt
```

### 5.5.4 Firewall Rule Template (Cisco FTD)

```
## Object Groups 
object-group network Webex-Cloud
 network-object object webex.com
 network-object object wbx2.com
 network-object object ciscospark.com

object-group service Webex-Ports
 service-object tcp destination eq 443
 service-object tcp destination eq 8443
 service-object udp destination range 19560 65535

## Access Rules 
access-list Outside_In extended permit object-group Webex-Ports any object-group Webex-Cloud
access-list Inside_Out extended permit object-group Webex-Ports object-group Voice-Networks object-group Webex-Cloud

## SSL Inspection Bypass 
ssl-policy-config
 match Webex-Cloud action do-not-decrypt
```

### 5.5.5 Regional Firewall Summary

| Region | LGW Rules | CCPP Rules | Media Ports |
|--------|-----------|------------|-------------|
| India (7 sites) | Required | N/A | UDP 19560-65535 |
| UK | N/A | Provider IPs | UDP 19560-65535 |
| EU | N/A | Provider IPs | UDP 19560-65535 |
| Americas | N/A | Provider IPs | UDP 19560-65535 |

---

## 5.6 QoS Configuration

### 5.6.1 Webex Traffic Classification

| Traffic Type | DSCP Marking | Queue | Bandwidth |
|--------------|--------------|-------|-----------|
| Voice (RTP) | EF (46) | Priority | 128 kbps/call |
| Video | AF41 (34) | Class 4 | 2 Mbps/call |
| Signaling (SIP/TLS) | CS3 (24) | Class 3 | 64 kbps/call |
| App Sharing | AF21 (18) | Class 2 | 1 Mbps/session |

### 5.6.2 SD-WAN QoS Policy (Existing ABV-SDWAN-2024)

**Reference:** Abhavtech SD-WAN uses Cisco SD-WAN (Viptela). QoS policies already configured.

```
! Verify existing Voice policy
show sdwan policy from-vsmart | include voice

! Expected output - Voice class mapped to EF
class voice
 bandwidth-percent 30
 buffer-percent 30
 scheduling strict
```

### 5.6.3 Campus Switch QoS (Existing ABV-SDA-ISE-2025)

**Reference:** SD-Access fabric already has QoS policies for voice VLAN.

```
! Verify voice VLAN QoS on access switch
show policy-map interface GigabitEthernet1/0/1

! Expected - Trust DSCP on voice ports
interface GigabitEthernet1/0/1
 switchport voice vlan 100
 mls qos trust dscp
```

### 5.6.4 QoS Validation Commands

| Platform | Command | Expected Output |
|----------|---------|-----------------|
| Cisco Switch | `show mls qos interface` | Trust DSCP enabled |
| Cisco Router | `show policy-map interface` | EF queue active |
| SD-WAN Edge | `show sdwan policy` | Voice policy applied |
| Palo Alto | `show qos interface` | QoS profile active |

---

## 5.7 Network Connectivity Options

### 5.7.1 Webex Calling Connectivity Architecture

```
+-----------------------------------------------------------------+
|  CONNECTIVITY OPTIONS - ABHAVTECH                                |
+-----------------------------------------------------------------+
|                                                                 |
|  OPTION 1: INTERNET (Current - All Sites)                      |
|  -----------------------------------------                      |
|  Path: Client -> SD-WAN -> Internet -> Webex Cloud                |
|  Pros: Simple, no additional cost                              |
|  Cons: Best-effort, dependent on ISP                           |
|  Status: SELECTED for Abhavtech                                |
|                                                                 |
|  OPTION 2: WEBEX EDGE CONNECT (Future Consideration)           |
|  -----------------------------------------------                |
|  Path: Client -> SD-WAN -> Equinix Fabric -> Webex Cloud          |
|  Pros: Private connectivity, SLA-backed                        |
|  Cons: Additional cost, Equinix presence required              |
|  Status: Not deployed (evaluate post-migration)                |
|                                                                 |
|  OPTION 3: CLOUD ONRAMP (Cisco SD-WAN Integration)             |
|  -------------------------------------------------              |
|  Path: Client -> SD-WAN -> Cisco Cloud OnRamp -> Webex            |
|  Pros: Integrated with existing SD-WAN                         |
|  Cons: Requires Cisco Cloud OnRamp license                     |
|  Status: Available (ABV-SDWAN-2024 compatible)                 |
|                                                                 |
+-----------------------------------------------------------------+
```

### 5.7.2 Bandwidth Requirements

| Site | Users | Concurrent Calls | Voice BW | Video BW | Total Required |
|------|-------|------------------|----------|----------|----------------|
| Mumbai HQ | 1,200 | 120 | 15 Mbps | 60 Mbps | 75 Mbps |
| Chennai | 450 | 45 | 6 Mbps | 22 Mbps | 28 Mbps |
| Bangalore | 180 | 18 | 2 Mbps | 9 Mbps | 11 Mbps |
| Delhi | 150 | 15 | 2 Mbps | 8 Mbps | 10 Mbps |
| Noida | 120 | 12 | 2 Mbps | 6 Mbps | 8 Mbps |
| Pune | 100 | 10 | 1 Mbps | 5 Mbps | 6 Mbps |
| Hyderabad | 200 | 20 | 3 Mbps | 10 Mbps | 13 Mbps |
| London | 520 | 52 | 7 Mbps | 26 Mbps | 33 Mbps |
| Frankfurt | 280 | 28 | 4 Mbps | 14 Mbps | 18 Mbps |
| New Jersey | 480 | 48 | 6 Mbps | 24 Mbps | 30 Mbps |
| Dallas | 270 | 27 | 3 Mbps | 14 Mbps | 17 Mbps |

**Calculation Basis:**
- 10% concurrent call ratio
- Voice: 128 kbps/call
- Video: 2 Mbps/call (50% video usage)

### 5.7.3 Current WAN Capacity (ABV-SDWAN-2024)

| Site | Primary Link | Backup Link | Headroom |
|------|--------------|-------------|----------|
| Mumbai HQ | 1 Gbps MPLS | 500 Mbps Internet | OK Sufficient |
| Chennai | 500 Mbps MPLS | 200 Mbps Internet | OK Sufficient |
| Bangalore | 200 Mbps MPLS | 100 Mbps Internet | OK Sufficient |
| Delhi | 200 Mbps MPLS | 100 Mbps Internet | OK Sufficient |
| Noida | 100 Mbps MPLS | 50 Mbps Internet | OK Sufficient |
| Pune | 100 Mbps MPLS | 50 Mbps Internet | OK Sufficient |
| Hyderabad | 200 Mbps MPLS | 100 Mbps Internet | OK Sufficient |
| London | 500 Mbps MPLS | 200 Mbps Internet | OK Sufficient |
| Frankfurt | 200 Mbps MPLS | 100 Mbps Internet | OK Sufficient |
| New Jersey | 500 Mbps MPLS | 200 Mbps Internet | OK Sufficient |
| Dallas | 200 Mbps MPLS | 100 Mbps Internet | OK Sufficient |

---

## 5.8 Network Validation Checklist

### 5.8.1 Pre-Deployment Validation

| Test | Command/Method | Expected Result | Pass |
|------|----------------|-----------------|------|
| DNS resolution | `nslookup webex.com` | Public IP returned | [ ] |
| DNS resolution | `nslookup wbx2.com` | Public IP returned | [ ] |
| HTTPS connectivity | `curl -I https://admin.webex.com` | HTTP 200/301 | [ ] |
| Media ports | `nc -u webex-media-test 19560` | Connection open | [ ] |
| No SSL intercept | Browser -> webex.com -> Certificate | DigiCert CA | [ ] |
| QoS marking | `show policy-map interface` | EF queue active | [ ] |
| Bandwidth test | `iperf3` to cloud endpoint | >50 Mbps sustained | [ ] |

### 5.8.2 Webex Network Test Tool

```
## Run Webex network test from client 
## URL: https://mediatest.webex.com 

## Expected Results: 
## - UDP connectivity: PASS 
## - TCP fallback: PASS 
## - Bandwidth: >2 Mbps 
## - Latency: <150ms 
## - Jitter: <30ms 
## - Packet loss: <1% 
```

### 5.8.3 LGW Connectivity Validation (India)

| Test | Command | Expected Result |
|------|---------|-----------------|
| Webex registration | `show voice register status` | Registered |
| TLS certificate | `show crypto pki certificate` | Valid, not expired |
| SIP trunk to PSTN | `show sip-ua status` | Active |
| Test call | Dial PSTN from Webex user | Completes via LGW |

---

## Chapter 5 Quick Reference

### DNS Checklist

- [ ] Conditional forwarders for webex.com, wbx2.com, ciscospark.com
- [ ] No DNS interception/proxy for Webex domains
- [ ] LGW A records in internal DNS (India only)
- [ ] TTL <= 300 seconds for failover

### Firewall Checklist

- [ ] Outbound 443/TCP to *.webex.com, *.wbx2.com
- [ ] Outbound UDP 19560-65535 for media
- [ ] SSL decryption bypass for Webex domains
- [ ] LGW <-> PSTN provider rules (India only)

### QoS Checklist

- [ ] Voice traffic marked EF (DSCP 46)
- [ ] Video traffic marked AF41 (DSCP 34)
- [ ] SD-WAN voice policy verified
- [ ] Campus switch trust DSCP enabled

### Bandwidth Checklist

- [ ] 128 kbps per voice call available
- [ ] 2 Mbps per video call available
- [ ] 10% concurrent call capacity planned
- [ ] WAN headroom >30% for peak

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 2, Section 2.3 | PSTN Design (LGW configuration) |
| Chapter 4, Section 4.3 | India Compliance (toll bypass) |
| ABV-SDWAN-2024 | SD-WAN deployment (transport) |
| ABV-SDA-ISE-2025 | SD-Access deployment (campus QoS) |
| Cisco Help | https://help.webex.com/article/b2exve (Port Reference) |
| Cisco Help | https://help.webex.com/article/WBX000028782 (Network Requirements) |

---

*End of Chapter 5: DNS & Network Architecture*

---
