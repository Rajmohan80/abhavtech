# Chapter 3: Network and Security

## Avaya to Webex Contact Center Migration


## 1. Overview


**Purpose:** This chapter provides detailed implementation specifications, configuration parameters, and security hardening procedures for the network and security infrastructure supporting the Webex Contact Center migration.


### Document Strategy


**This document covers:**

- ✅ **Network topology implementation** (VLAN, IP addressing, routing, QoS)

- ✅ **SBC interconnect configuration** (trunk setup, certificates, dial plans)

- ✅ **Firewall rules and port requirements** (detailed rules table, NAT, ACLs)

- ✅ **Encryption policies** (TLS/SRTP, at-rest encryption, key management, compliance)

- ✅ **Security validation and testing** (verification procedures, penetration testing)


### Use This Document To:

1. Implement network infrastructure changes for Webex CC

2. Configure SBC trunks and interconnects

3. Define and deploy firewall rules

4. Enforce encryption and security policies

5. Validate security posture before go-live


### Cross-References to Chapter 2 (Design)


| Design Topic | Chapter 2 Section | Implementation in This Chapter |

|--------------|-------------------|--------------------------------|

| Network Architecture | 2.3 Network Design | Section 2: Network Topology |

| SBC Architecture | 2.4 SBC Design | Section 3: SBC Interconnect |

| Security Requirements | 2.5 Security Design | Sections 4 & 5: Firewall & Encryption |


---


## 2. Network Integration and Changes


**📍 Design Reference:** See Chapter 2, Section 2.3 for network architecture design rationale.


### 2.1 Migration Network Strategy


**Principle: Leverage Existing Avaya LAN Infrastructure**


This migration adopts a **minimal-change approach** to the existing Avaya network:


✅ **KEEP EXISTING:**

- Agent desktop VLANs and IP addressing

- Voice/telephony VLAN structure

- Internal routing (OSPF/static routes)

- DNS/DHCP servers and configuration

- Core switching infrastructure

- WFM, CRM, and server VLANs


🔄 **MODIFY/ADD:**

- Internet bandwidth (upgrade for Webex cloud traffic)

- CUBE placement in existing voice VLAN

- Firewall rules for Webex IP ranges

- QoS policies adjusted for Webex traffic patterns

- External DNS records for CUBE


**Why This Approach?**

- ✅ Minimizes risk and complexity

- ✅ Reduces downtime during migration

- ✅ Allows Avaya and Webex coexistence

- ✅ Agents remain on same network/IPs

- ✅ Faster implementation timeline


### 2.2 Coexistence Architecture (Phased Migration)


**Network Topology During Migration:**


```

                    ┌──────────────────┐

                    │  Webex Contact   │

                    │     Center       │

                    │     (Cloud)      │

                    └────────┬─────────┘

                             │ SIP/TLS

                             │ Port 5061

                    ┌────────▼─────────┐

    Internet ───────│  Cisco CUBE      │ ← NEW

    (Upgraded)      │  (Primary)       │

                    └────────┬─────────┘

                             │

    ┌────────────────────────┼────────────────────────┐

    │     EXISTING AVAYA NETWORK (No major changes)   │

    ├────────────────────────┼────────────────────────┤

    │                        │                         │

    │  ┌──────────────┐  ┌──▼───────────┐  ┌────────┐│

    │  │ Avaya CM     │  │ Existing     │  │ Agents ││

    │  │ (Legacy)     │◄─┤ Voice VLAN   │◄─┤ (Same  ││

    │  │              │  │              │  │ IPs)   ││

    │  └──────────────┘  └──────────────┘  └────────┘│

    └─────────────────────────────────────────────────┘

```


**Migration Phases:**


| Phase | Duration | Avaya Status | Webex Status | Agents |

|-------|----------|--------------|--------------|--------|

| Phase 0 | Week 1-2 | Active (100%) | Infrastructure setup | 0 migrated |

| Phase 1 | Week 3-4 | Active (90%) | Pilot (10%) | 100 agents |

| Phase 2 | Week 5-8 | Active (50%) | Scaling (50%) | 500 agents |

| Phase 3 | Week 9-10 | Active (10%) | Primary (90%) | 900 agents |

| Phase 4 | Week 11-12 | Decommission | Full production | 1,000 agents |


### 2.3 CUBE Placement in Existing Network


**Integration Points:**


| Component | Location | Integration Method | Notes |

|-----------|----------|-------------------|-------|

| CUBE (Primary) | Existing Voice VLAN | Add as new device | Use available IP in voice subnet |

| CUBE (Secondary) | Existing Voice VLAN | Add as new device | HA pair with primary |

| Avaya CM | Existing | Parallel operation | No changes during coexistence |

| Agent Desktops | Existing Agent VLAN | No changes | Access Webex via HTTPS (port 443) |

| Internet Gateway | Existing | Bandwidth upgrade | 200 Mbps → 1 Gbps |


**Example IP Allocation (Using Existing Scheme):**


*Assumption: Existing voice VLAN is 10.50.100.0/24*


| Device | IP Address | Notes |

|--------|------------|-------|

| Avaya Session Manager | 10.50.100.10 | Existing - no change |

| Avaya SBC | 10.50.100.20 | Existing - no change |

| **CUBE Primary** | **10.50.100.50** | **NEW - add to existing VLAN** |

| **CUBE Secondary** | **10.50.100.51** | **NEW - add to existing VLAN** |


### 2.4 Internet Bandwidth Upgrade


**Current vs. Required Bandwidth:**


| Circuit | Current (Avaya) | Required (Webex) | Upgrade Needed |

|---------|----------------|------------------|----------------|

| Primary ISP | 200 Mbps | 500 Mbps | ✅ Yes - 2.5× increase |

| Secondary ISP | None or small | 500 Mbps | ✅ Yes - add redundancy |


**Bandwidth Breakdown for 1,000 Agents:**


```

Total Bandwidth Required: ~682 Mbps

├─ Voice (G.711):         87 Mbps  (1,000 concurrent calls)

├─ Agent Desktop (HTTPS): 500 Mbps (1,000 agents @ 0.5 Mbps)

├─ Video:                 75 Mbps  (50 concurrent sessions)

├─ Management/API:        20 Mbps  (Monitoring, integrations)

└─ TOTAL:                 682 Mbps → Provision: 1,000 Mbps (dual 500 Mbps)

```


**Why Dual Circuits?**

- ✅ High availability (99.99% uptime target)

- ✅ Active-active load balancing

- ✅ Sub-5-second failover

- ✅ Required for cloud contact center architecture


### 2.5 External DNS Records (NEW)


**Required Public DNS Entries:**


| Record Type | Hostname | Target/IP | Purpose |

|-------------|----------|-----------|---------|

| A | cube-ext.company.com | 203.0.113.10 | External CUBE IP (NAT) |

| SRV | _sip._tcp.company.com | cube-ext.company.com:5061 | SIP service discovery |

| CNAME | webex-cc.company.com | company.webexcc.com | Redirect to Webex portal |


**Internal DNS (Existing - May Need Update):**


| Record Type | Hostname | IP | Purpose |

|-------------|----------|-----|---------|

| A | cube-pri.company.com | 10.50.100.50 | Primary CUBE internal IP |

| A | cube-sec.company.com | 10.50.100.51 | Secondary CUBE internal IP |


### 2.6 Routing Changes (Minimal)


**Add Static Routes for Webex Cloud (on Internet Gateway):**


```

! Route to Webex Contact Center subnet

ip route 170.72.0.0 255.255.0.0 GigabitEthernet0/0/1

ip route 170.72.0.0 255.255.0.0 GigabitEthernet0/0/2 10


! Route to Webex Calling subnet

ip route 64.68.96.0 255.255.224.0 GigabitEthernet0/0/1

ip route 64.68.96.0 255.255.224.0 GigabitEthernet0/0/2 10


! Route to Webex media servers

ip route 170.133.0.0 255.255.0.0 GigabitEthernet0/0/1

ip route 170.133.0.0 255.255.0.0 GigabitEthernet0/0/2 10

```


**Internal Routing: NO CHANGES**

- Existing OSPF or static routes remain unchanged

- CUBE added to existing voice VLAN (automatically routable)


### 2.7 Quality of Service (QoS) Adjustments


**Principle: Enhance Existing Avaya QoS for Webex Traffic**


**Current State (Avaya):**

- Voice traffic marked DSCP EF (46)

- Existing QoS policies on WAN edge

- Bandwidth: 200 Mbps total


**Target State (Webex + Avaya Coexistence):**

- Preserve existing voice QoS markings

- Add Webex cloud traffic to priority queues

- Upgrade bandwidth to accommodate both systems


**DSCP Marking Strategy (No Changes to Existing):**


| Traffic Type | DSCP Value | Queue | Description |

|--------------|------------|-------|-------------|

| Voice RTP (Avaya + Webex) | EF (46) | Priority | Real-time voice media |

| Video RTP | AF41 (34) | High | Real-time video media |

| SIP Signaling | CS3 (24) | Medium-High | Call control signaling |

| Agent Desktop | AF21 (18) | Medium | Web applications, CRM |

| Bulk Data | AF11 (10) | Low | File transfers, backups |

| Best Effort | 0 | Default | General traffic |


**Updated QoS Policy (Internet Gateway - Adjust Existing):**

```

! Modify existing policy-map to accommodate increased bandwidth

policy-map WAN-QOS

 class VOICE

  priority percent 30

  set dscp ef

 class VIDEO

  bandwidth percent 20

  set dscp af41

 class SIGNALING

  bandwidth percent 10

  set dscp cs3

 class AGENT-DESKTOP

  bandwidth percent 25

  set dscp af21

 class class-default

  bandwidth percent 15

  random-detect

 !

! Apply to upgraded internet circuits

interface GigabitEthernet0/0/1

 description Internet Circuit 1 - Upgraded to 500 Mbps

 service-policy output WAN-QOS

 !

interface GigabitEthernet0/0/2

 description Internet Circuit 2 - New 500 Mbps

 service-policy output WAN-QOS

```


**Bandwidth Allocation (Total 1 Gbps - Post-Upgrade):**

```

QoS Bandwidth Distribution:

├─ Voice (EF):          300 Mbps (30%) → Avaya + Webex calls

├─ Video (AF41):        200 Mbps (20%) → Video sessions

├─ Signaling (CS3):     100 Mbps (10%) → SIP messages, API calls

├─ Agent Desktop:       250 Mbps (25%) → Webex desktop, CRM

└─ Best Effort:         150 Mbps (15%) → General traffic

```


**During Coexistence:**

```

Priority Queue Usage (300 Mbps Voice):

├─ Avaya calls:         43 Mbps (500 agents @ G.729 = 86 kbps/call)

├─ Webex calls:         43 Mbps (500 agents @ G.711 = 87 kbps/call)

├─ Buffer:              214 Mbps (71% available)

└─ Status:              ✅ Sufficient capacity for both systems

```


### 2.8 Network Performance Targets


**SLA Targets (Same as Avaya, but to Webex Cloud):**


| KPI | Target | Measurement Method | Alerting Threshold |

|-----|--------|--------------------|--------------------|

| Latency (RTT) | <100ms to Webex DC | ICMP/IP SLA | >150ms |

| Jitter | <20ms | RTP analysis | >30ms |

| Packet Loss | <0.1% | RTP/RTCP stats | >0.5% |

| MOS Score | >4.0 | Voice quality monitoring | <3.8 |

| Bandwidth Utilization | <70% sustained | SNMP/NetFlow | >85% |


**Latency Comparison:**


| Path | Avaya (On-Prem) | Webex (Cloud) | Impact |

|------|-----------------|---------------|--------|

| Agent to Voice Platform | 5-10 ms | 40-60 ms | +30-50 ms (acceptable) |

| Internal calls | 10-15 ms | 80-120 ms | Cloud-to-cloud delay |

| PSTN calls | 50-80 ms | 60-100 ms | Similar quality |


**Note:** Cloud-based contact centers typically add 30-50ms latency vs. on-premise, but this is well within ITU-T G.114 recommendation (<150ms one-way).


### 2.9 Network Redundancy


**Dual Internet Circuit Configuration:**


```

Primary Circuit (ISP1) - UPGRADED:

├─ Bandwidth:              500 Mbps (was 200 Mbps)

├─ Interface:              GigabitEthernet0/0/1

├─ IP Address:             203.0.113.10/30 (existing, no change)

├─ Gateway:                203.0.113.9

├─ Routing:                Primary path (AD 1)

└─ Status:                 Active


Secondary Circuit (ISP2) - NEW:

├─ Bandwidth:              500 Mbps (new circuit)

├─ Interface:              GigabitEthernet0/0/2

├─ IP Address:             198.51.100.10/30 (new)

├─ Gateway:                198.51.100.9

├─ Routing:                Backup path (AD 10)

└─ Status:                 Standby


Failover Mechanism:

├─ Protocol:               IP SLA + Track

├─ Detection:              3 seconds (3× 1-second probes)

├─ Convergence:            <5 seconds

└─ Webex CC impact:        Active calls preserved (TCP keepalive)

```


**IP SLA Configuration (Add to Existing Router):**

```

ip sla 10

 icmp-echo 170.72.1.1 source-interface GigabitEthernet0/0/1

 frequency 1

 !

ip sla schedule 10 life forever start-time now

!

track 10 ip sla 10 reachability

 delay down 3 up 10

```


### 2.10 Network Capacity Summary


**Current vs. Design Capacity:**


| Metric | Avaya (Pre-Migration) | Webex (Post-Migration) | Improvement |

|--------|----------------------|------------------------|-------------|

| Total Bandwidth | 200 Mbps (single) | 1 Gbps (dual 500) | 5× increase |

| Voice Bandwidth | 43 Mbps (G.729) | 87 Mbps (G.711) | 2× + better quality |

| Agent Desktop | 150 Mbps | 500 Mbps | 3.3× increase |

| Redundancy | Single circuit | Dual circuits | 99.9% → 99.99% |

| Jitter | <30ms | <20ms (target) | 33% improvement |

| Packet Loss | <1% | <0.1% (target) | 10× improvement |


---


## 3. SBC Interconnect Configuration


**📍 Design Reference:** See Chapter 2, Section 2.4 for SBC architecture and design rationale.


### 3.1 CUBE Overview


**Deployment Architecture:**

```

                    ┌──────────────────┐

                    │  Webex Contact   │

                    │     Center       │

                    │   (Cloud SBC)    │

                    └────────┬─────────┘

                             │ SIP/TLS

                             │ Port 5061

                    ┌────────▼─────────┐

    Internet ───────│  Cisco CUBE      │

    (Public IP)     │  (Primary)       │

                    │  203.0.113.10    │

                    └────────┬─────────┘

                             │

                    ┌────────▼─────────┐

                    │  Internal SIP    │

                    │  Infrastructure  │

                    │  (Avaya/Legacy)  │

                    └──────────────────┘

```


**CUBE Specifications:**


| Parameter | Value | Notes |

|-----------|-------|-------|

| Platform | Cisco ASR 1002-HX | 3,500 sessions each (2 units) |

| IOS-XE Version | 17.6.3 or later | Required for Webex CC support |

| Total Capacity | 7,000 sessions | Current need: 6,084 sessions |

| Headroom | 13% | For growth and burst traffic |

| High Availability | Active-Standby | Failover via DNS SRV records |


### 3.2 SIP Trunk Configuration (CUBE to Webex)


**Dial-Peer Configuration (Webex Trunk):**


```

voice service voip

 ip address trusted list

  ipv4 170.72.0.0 255.255.0.0

  ipv4 64.68.96.0 255.255.224.0

  ipv4 170.133.0.0 255.255.0.0

 allow-connections sip to sip

 sip

  bind control source-interface GigabitEthernet0/0/1

  bind media source-interface GigabitEthernet0/0/1

  registrar server expires max 3600 min 60

  early-offer forced

 !


! Webex Inbound Dial-Peer

dial-peer voice 100 voip

 description Webex CC Inbound Trunk

 destination-pattern +1..........

 session protocol sipv2

 session target ipv4:170.72.1.1:5061

 session transport tcp tls

 voice-class codec 1

 voice-class sip profiles 100

 voice-class sip tenant 100

 dtmf-relay rtp-nte

 srtp

 no vad

 !


! Webex Outbound Dial-Peer

dial-peer voice 200 voip

 description Webex CC Outbound Trunk

 translation-profile outgoing NORMALIZE-E164

 destination-pattern .T

 session protocol sipv2

 session target ipv4:170.72.1.1:5061

 session transport tcp tls

 voice-class codec 1

 voice-class sip profiles 100

 voice-class sip tenant 100

 dtmf-relay rtp-nte

 srtp

 no vad

```


**Codec Configuration:**

```

voice class codec 1

 codec preference 1 g711ulaw

 codec preference 2 g711alaw

 codec preference 3 g729r8

 codec preference 4 opus

```


**Why G.711 is preferred:**

- Best voice quality (MOS 4.1-4.4)

- No transcoding delay

- Compatible with all devices

- Bandwidth impact: 87 kbps per call (vs. 31 kbps for G.729)


### 3.3 Certificate Management


**Certificate Requirements for TLS/SRTP:**


| Certificate Type | Issuer | Key Size | Validity | Purpose |

|------------------|--------|----------|----------|---------|

| CUBE Server Cert | DigiCert (Public CA) | RSA 2048 | 1 year | TLS authentication |

| Webex Root CA | Cisco | RSA 2048 | 10 years | Trust chain |

| Intermediate CA | Cisco | RSA 2048 | 5 years | Trust chain |


**Certificate Installation on CUBE:**


```

! Step 1: Import Root CA Certificate

crypto pki trustpoint WEBEX-ROOT-CA

 enrollment terminal

 revocation-check none

 !

crypto pki authenticate WEBEX-ROOT-CA

! Paste Webex Root CA certificate here


! Step 2: Generate CSR for CUBE

crypto pki trustpoint CUBE-CERT

 enrollment terminal

 subject-name CN=cube-ext.company.com,O=Company Inc,C=US

 revocation-check none

 rsakeypair CUBE-KEY 2048

 !

crypto pki enroll CUBE-CERT

! Generate CSR → Submit to DigiCert → Obtain signed certificate


! Step 3: Import Signed Certificate

crypto pki import CUBE-CERT certificate

! Paste signed certificate here


! Step 4: Apply Certificate to SIP

sip-ua

 crypto signaling default trustpoint CUBE-CERT

 !

```


**Certificate Renewal Process:**

1. **60 days before expiry:** Generate new CSR

2. **Submit to DigiCert:** Obtain new certificate

3. **Install new cert:** Parallel to existing (no downtime)

4. **Test:** Verify TLS handshake

5. **Switch:** Update SIP profile to use new cert

6. **Monitor:** Ensure no failures for 24 hours

7. **Remove old cert:** After 7 days


### 3.4 SIP Profiles and Header Manipulation


**SIP Profile for Webex CC:**


```

voice class sip-profiles 100

 rule 1 request ANY sip-header SIP-Req-URI modify "sip:(.*)@" "sip:\\1@company.webexcc.com"

 rule 2 request INVITE sip-header Contact modify "<sip:(.*)@.*>" "<sip:\\1@203.0.113.10:5061>"

 rule 3 request INVITE sip-header From modify "\\"(.*)\\"(.*)" "\\"\\1\\"\\2"

 rule 4 response ANY sip-header Server modify ".*" "CUBE"

 rule 5 request ANY sip-header User-Agent modify ".*" "Cisco-CUBE/IOS-XE"

 !

```


**Purpose of Header Manipulation:**

- **Rule 1:** Ensure proper domain routing to Webex

- **Rule 2:** Advertise correct Contact address

- **Rule 3:** Preserve caller name

- **Rule 4-5:** Security hardening (hide platform details)


### 3.5 Dial Plan and Number Normalization


**Translation Profile (E.164 Normalization):**


```

voice translation-rule 100

 rule 1 /^91\(...........\)/ /+91\\1/

 rule 2 /^1\(...........\)/ /+1\\1/

 rule 3 /^44\(...........\)/ /+44\\1/

 rule 4 /^\\+\(.*\)/ /\\1/

 !


voice translation-profile NORMALIZE-E164

 translate calling 100

 translate called 100

```


**Example Transformations:**


| Input | Translation Rule | Output | Format |

|-------|------------------|--------|--------|

| 914045551234 | Rule 1 | +914045551234 | India (E.164) |

| 12125551234 | Rule 2 | +12125551234 | USA (E.164) |

| 442075551234 | Rule 3 | +442075551234 | UK (E.164) |

| +14045551234 | Rule 4 | 14045551234 | Strip + (internal) |


### 3.6 DTMF Relay Configuration


**DTMF Method: RFC 2833 (Preferred):**


```

dial-peer voice 100 voip

 dtmf-relay rtp-nte

 !


! Why RFC 2833?

! ✅ Out-of-band (no audio interference)

! ✅ Reliable with SRTP encryption

! ✅ Supported by Webex CC

! ❌ Avoid in-band DTMF (not reliable with codecs)

```


**DTMF Testing Command:**

```

test voice translation-rule 100 914045551234

```


### 3.7 SIP Options Ping (Keepalive)


**Configuration:**

```

voice class sip-options-keepalive 1

 transport tcp tls

 up-interval 60

 down-interval 30

 retry 3

 !


dial-peer voice 100 voip

 voice-class sip options-keepalive 1

```


**Purpose:**

- Monitor trunk health

- Detect failures within 30 seconds

- Trigger automatic failover to secondary CUBE


### 3.8 Session Refresh Timer (TCP Keepalive)


**Configuration:**

```

voice service voip

 sip

  session refresh 1800

 !

```


**Why 1800 seconds (30 minutes)?**

- Prevents NAT timeout on firewalls

- Webex CC requires periodic session refresh

- Keeps TCP connections alive

- Prevents premature call termination


### 3.9 High Availability and Failover


**DNS SRV Record Strategy:**


| Priority | Weight | Port | Target | Status |

|----------|--------|------|--------|--------|

| 10 | 50 | 5061 | cube-pri.company.com | Active |

| 20 | 50 | 5061 | cube-sec.company.com | Standby |


**Failover Behavior:**

```

Primary CUBE Failure Scenario:

├─ Detection time:         30 seconds (SIP OPTIONS timeout)

├─ Webex retries:          3 attempts (90 seconds total)

├─ Failover to secondary:  Automatic via DNS SRV

├─ Active calls:           Maintained (TCP persists if network intact)

├─ New calls:              Route to secondary CUBE

└─ Recovery:               Automatic when primary returns (5 min delay)

```


**CUBE Health Monitoring:**

```

! SNMP Monitoring

snmp-server enable traps syslog

snmp-server enable traps voice


! Syslog to Monitoring Server

logging host 10.100.40.10 transport udp port 514

logging trap informational

```


### 3.10 Security Hardening for CUBE


**Access Control:**

```

! Restrict SIP access to Webex IP ranges only

ip access-list extended WEBEX-SIP

 permit tcp host 170.72.1.1 any eq 5061

 permit tcp 170.72.0.0 0.0.255.255 any eq 5061

 permit tcp 64.68.96.0 0.0.31.255 any eq 5061

 deny ip any any log

 !


interface GigabitEthernet0/0/1

 ip access-group WEBEX-SIP in

```


**Rate Limiting (DoS Protection):**

```

voice service voip

 sip

  max-forwards 10

  min-se 1800

  call threshold global 6000

  early-offer forced

 !

```


---


## 4. Firewall Rules and Port Requirements


**📍 Design Reference:** See Chapter 2, Section 2.5 for security architecture.


### 4.1 Webex Contact Center Required Ports


**Outbound Firewall Rules (Enterprise → Webex Cloud):**


| # | Source | Destination | Protocol | Port | Purpose | Action |

|---|--------|-------------|----------|------|---------|--------|

| 1 | CUBE<br>10.100.10.10 | Webex CC SBC<br>170.72.0.0/16 | TCP | 5061 | SIP over TLS (signaling) | ALLOW |

| 2 | CUBE<br>10.100.10.10 | Webex Media<br>170.133.0.0/16 | UDP | 8000-48199 | SRTP (encrypted voice media) | ALLOW |

| 3 | Agents<br>10.100.20.0/22 | Webex Agent Desktop<br>webex.com | TCP | 443 | HTTPS (agent desktop, APIs) | ALLOW |

| 4 | Agents<br>10.100.20.0/22 | Webex Media<br>170.133.0.0/16 | UDP | 9000 | WebRTC media (browser softphone) | ALLOW |

| 5 | Agents<br>10.100.20.0/22 | Webex SSO<br>idbroker.webex.com | TCP | 443 | SAML authentication | ALLOW |

| 6 | Servers<br>10.100.30.0/24 | Webex APIs<br>webexapis.com | TCP | 443 | API integrations, webhooks | ALLOW |

| 7 | Servers<br>10.100.30.0/24 | Webex Control Hub<br>admin.webex.com | TCP | 443 | Management, provisioning | ALLOW |


**Inbound Firewall Rules (Webex Cloud → Enterprise):**


| # | Source | Destination | Protocol | Port | Purpose | Action |

|---|--------|-------------|----------|------|---------|--------|

| 8 | Webex CC SBC<br>170.72.0.0/16 | CUBE (Public IP)<br>203.0.113.10 | TCP | 5061 | SIP over TLS (signaling) | ALLOW |

| 9 | Webex Media<br>170.133.0.0/16 | CUBE (Public IP)<br>203.0.113.10 | UDP | 8000-48199 | SRTP (encrypted voice media) | ALLOW |

| 10 | Webex Webhooks<br>64.68.96.0/19 | Integration Server<br>203.0.113.20 | TCP | 443 | Webhook callbacks (events) | ALLOW |


**Default Deny Rule:**


| # | Source | Destination | Protocol | Port | Purpose | Action |

|---|--------|-------------|----------|------|---------|--------|

| 999 | Any | Any | Any | Any | Implicit deny (log all dropped) | DENY + LOG |


### 4.2 Firewall Configuration Examples


**Palo Alto Firewall Configuration:**


```xml

<!-- Security Policy: Allow Webex SIP -->

<entry name="Webex-SIP-Outbound">

  <from><member>INTERNAL</member></from>

  <to><member>INTERNET</member></to>

  <source><member>10.100.10.10</member></source>

  <destination><member>170.72.0.0/16</member></destination>

  <service><member>service-tcp-5061</member></service>

  <application><member>sip</member></application>

  <action>allow</action>

  <log-start>yes</log-start>

  <log-end>yes</log-end>

  <profile-setting>

    <group><member>Webex-Security-Profile</member></group>

  </profile-setting>

</entry>


<!-- Security Policy: Allow Webex SRTP -->

<entry name="Webex-SRTP-Outbound">

  <from><member>INTERNAL</member></from>

  <to><member>INTERNET</member></to>

  <source><member>10.100.10.10</member></source>

  <destination><member>170.133.0.0/16</member></destination>

  <service><member>service-udp-8000-48199</member></service>

  <application><member>rtp</member></application>

  <action>allow</action>

  <log-start>no</log-start>

  <log-end>yes</log-end>

</entry>

```


**Cisco ASA Firewall Configuration:**


```

! Object Groups

object-group network WEBEX-SIP-SERVERS

 network-object 170.72.0.0 255.255.0.0

 network-object 64.68.96.0 255.255.224.0


object-group network WEBEX-MEDIA-SERVERS

 network-object 170.133.0.0 255.255.0.0


object-group service WEBEX-MEDIA-PORTS udp

 port-object range 8000 48199


! Access Control List

access-list OUTSIDE-IN extended permit tcp object-group WEBEX-SIP-SERVERS host 203.0.113.10 eq 5061

access-list OUTSIDE-IN extended permit udp object-group WEBEX-MEDIA-SERVERS host 203.0.113.10 object-group WEBEX-MEDIA-PORTS

access-list OUTSIDE-IN extended deny ip any any log


! Apply ACL to Outside Interface

access-group OUTSIDE-IN in interface outside

```


### 4.3 NAT Configuration


**Static NAT for CUBE:**


```

! Cisco ASA NAT Configuration

object network CUBE-INTERNAL

 host 10.100.10.10

 nat (inside,outside) static 203.0.113.10 service tcp 5061 5061


object network CUBE-MEDIA

 host 10.100.10.10

 nat (inside,outside) static 203.0.113.10 service udp 8000 48199

```


**Port Forwarding Table:**


| Public IP | Public Port | Internal IP | Internal Port | Protocol | Purpose |

|-----------|-------------|-------------|---------------|----------|---------|

| 203.0.113.10 | 5061 | 10.100.10.10 | 5061 | TCP | SIP TLS |

| 203.0.113.10 | 8000-48199 | 10.100.10.10 | 8000-48199 | UDP | SRTP Media |


### 4.4 IPS/IDS Exclusions


**Disable Inspection for SRTP (Encrypted Media):**


```

! Palo Alto: Disable decryption for Webex media

set rulebase security rules Webex-SRTP-Outbound profile-setting group Webex-Security-Profile

set profiles decryption-profile Webex-Security-Profile ssl-forward-proxy no

set profiles decryption-profile Webex-Security-Profile ssl-inbound-inspection no


! Cisco Firepower: Bypass inspection for trusted Webex IPs

access-list WEBEX-BYPASS extended permit ip host 10.100.10.10 170.133.0.0 255.255.0.0

access-list WEBEX-BYPASS extended permit ip 170.133.0.0 255.255.0.0 host 10.100.10.10


firepower access-control-config

 bypass-traffic WEBEX-BYPASS

```


**Why bypass IPS for SRTP?**

- ✅ Prevents false positives (encrypted traffic looks like anomalies)

- ✅ Reduces firewall CPU load (no deep packet inspection needed)

- ✅ Improves call quality (eliminates inspection latency)

- ✅ SRTP is already encrypted (no additional security value)


### 4.5 Logging and Monitoring


**Firewall Logging Requirements:**


| Log Type | Severity | Retention | Destination | Purpose |

|----------|----------|-----------|-------------|---------|

| Connection Logs | Informational | 30 days | SIEM (Splunk) | Traffic analysis |

| Threat Logs | Warning+ | 90 days | SIEM + Email | Security incidents |

| Denied Traffic | Informational | 30 days | SIEM | Troubleshooting |

| Config Changes | Notice | 365 days | SIEM + Audit | Compliance |


**Syslog Configuration (Palo Alto):**

```

set deviceconfig system syslog-server SPLUNK

  server 10.100.40.10

  transport UDP

  port 514

  format BSD

  facility LOG_USER

```


### 4.6 Firewall Performance Impact


**Latency Added by Firewall:**


| Firewall Model | Throughput (Gbps) | Latency (Typical) | Max Sessions | Suitable? |

|----------------|-------------------|-------------------|--------------|-----------|

| Palo Alto PA-3220 | 3.2 Gbps | 3-5 ms | 500,000 | ✅ Yes |

| Cisco ASA 5516-X | 1.5 Gbps | 5-8 ms | 100,000 | ⚠️ Marginal |

| Fortinet FG-200F | 3 Gbps | 2-4 ms | 500,000 | ✅ Yes |


**Expected Impact:**

```

Voice Latency Budget:

├─ WAN latency:               40 ms (average to Webex DC)

├─ Firewall latency:          5 ms

├─ CUBE processing:           2 ms

├─ Internal network:          3 ms

└─ Total:                     50 ms ✅ Well within 150ms target

```


---


## 5. Encryption Policy


**📍 Design Reference:** See Chapter 2, Section 2.5 for encryption design rationale.


### 5.1 In-Transit Encryption


#### 5.1.1 SIP Signaling Encryption (TLS 1.2+)


**TLS Configuration on CUBE:**


```

! Force TLS 1.2 minimum

crypto pki certificate chain CUBE-CERT

 certificate ca 01

  [Root CA Certificate]

 certificate 01

  [CUBE Server Certificate]

 quit


! TLS Version Control

voice service voip

 sip

  transport tcp tls v1.2

 !

```


**Cipher Suite Configuration:**


| Priority | Cipher Suite | Key Exchange | Encryption | MAC | Strength |

|----------|--------------|--------------|------------|-----|----------|

| 1 | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 | ECDHE | AES-256-GCM | SHA384 | Strong |

| 2 | TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 | ECDHE | AES-128-GCM | SHA256 | Strong |

| 3 | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 | ECDHE | AES-256-CBC | SHA384 | Moderate |


**Disabled Cipher Suites (Security):**

- ❌ TLS_RSA_WITH_3DES_EDE_CBC_SHA (Weak encryption)

- ❌ TLS_RSA_WITH_RC4_128_SHA (RC4 vulnerability)

- ❌ TLS_RSA_WITH_NULL_SHA (No encryption)


**CUBE TLS Configuration:**

```

crypto tls-cipher-suite ecdhe

 cipher aes256-sha2

 cipher aes128-sha2

```


#### 5.1.2 RTP Media Encryption (SRTP)


**SRTP Configuration on CUBE:**


```

voice service voip

 media

  srtp-crypto 1 AES_CM_128_HMAC_SHA1_80

  srtp-crypto 2 AES_CM_128_HMAC_SHA1_32

 !


dial-peer voice 100 voip

 srtp

 !

```


**SRTP Cipher Suites:**


| Algorithm | Encryption | Authentication | Key Size | Recommended |

|-----------|------------|----------------|----------|-------------|

| AES_CM_128_HMAC_SHA1_80 | AES-128 | HMAC-SHA1 (80-bit tag) | 128-bit | ✅ Yes |

| AES_CM_128_HMAC_SHA1_32 | AES-128 | HMAC-SHA1 (32-bit tag) | 128-bit | ✅ Yes (low bandwidth) |

| AES_256_CM_HMAC_SHA1_80 | AES-256 | HMAC-SHA1 (80-bit tag) | 256-bit | ⚠️ Higher CPU |


**Bandwidth Impact of SRTP:**

```

G.711 Call Bandwidth Comparison:

├─ RTP (Unencrypted):        87 kbps

├─ SRTP (AES-128):            89 kbps (+2 kbps)

└─ Impact:                    ~2% overhead (negligible)

```


**SRTP Key Exchange:**

- **Method:** SDES (Session Description Protocol Security Descriptions)

- **Key Lifetime:** Renegotiated every call

- **Key Size:** 128-bit AES

- **Perfect Forward Secrecy:** Yes (new keys per session)


#### 5.1.3 HTTPS for Agent Desktop


**Certificate Pinning (Webex Agent Desktop):**


| Endpoint | Certificate | Issuer | Expiry Monitoring |

|----------|-------------|--------|-------------------|

| webexapis.com | Wildcard *.webexapis.com | DigiCert | 30 days before expiry |

| admin.webex.com | Wildcard *.webex.com | DigiCert | 30 days before expiry |

| idbroker.webex.com | Wildcard *.webex.com | DigiCert | 30 days before expiry |


**Browser TLS Requirements:**

- **Minimum:** TLS 1.2

- **Recommended:** TLS 1.3

- **Cipher Suites:** Modern browsers default (ECDHE, AES-GCM)


#### 5.1.4 API Encryption


**Webex API Authentication:**

```

POST /v1/telephony/config/premises HTTP/1.1

Host: webexapis.com

Authorization: Bearer <OAuth_Access_Token>

Content-Type: application/json


{

  "orgId": "Y2lzY29zcGFyazovL3VzL09SR0FOSVpBVElPTi85NmFiYzJhYS0z...",

  "premises": {

    "name": "Company HQ",

    "location": "Austin, TX"

  }

}

```


**API Security Requirements:**

- ✅ OAuth 2.0 Bearer Token (expires every 12 hours)

- ✅ HTTPS only (TLS 1.2+)

- ✅ IP allowlisting (optional, for CI/CD automation)

- ✅ Rate limiting: 300 requests/minute per token


### 5.2 At-Rest Encryption


#### 5.2.1 Call Recording Encryption


**Storage Architecture:**

```

Call Recordings Storage:

├─ Provider:              AWS S3 (Cisco-managed)

├─ Encryption:            AES-256 (SSE-S3)

├─ Key Management:        AWS KMS (Cisco-managed)

├─ Access Control:        IAM roles + Webex RBAC

├─ Retention:             90 days (configurable)

└─ Compliance:            SOC 2, PCI-DSS, HIPAA-ready

```


**Encryption Details:**


| Property | Value | Notes |

|----------|-------|-------|

| Algorithm | AES-256-CBC | Industry standard |

| Key Rotation | Automatic (90 days) | AWS KMS managed |

| Key Storage | AWS KMS | FIPS 140-2 Level 2 |

| Access Logging | CloudTrail | All access logged |


**Recording Encryption Verification:**

```bash

# Check if recordings are encrypted (AWS CLI)

aws s3api head-object \\

  --bucket webex-recordings-prod \\

  --key 1234567890-recording.wav \\

  --query 'ServerSideEncryption'


# Expected output:

"AES256"

```


#### 5.2.2 Database Encryption


**Webex Contact Center Data Encryption:**


| Data Type | Encryption Method | Key Management | Compliance |

|-----------|-------------------|----------------|------------|

| Agent passwords | Bcrypt + Salt (rounds=12) | Application-level | PCI-DSS 4.0 |

| PII (customer data) | AES-256-GCM | AWS KMS | GDPR, CCPA |

| Payment card data | Tokenization (no storage) | PCI-compliant vault | PCI-DSS 4.0 |

| API keys/secrets | AWS Secrets Manager | AWS KMS | SOC 2 |


**Encryption at Rest (Webex CC Platform):**

- ✅ All data encrypted using AES-256

- ✅ Encryption keys rotated every 90 days

- ✅ Multi-tenant isolation (dedicated encryption keys per customer)


#### 5.2.3 Backup Encryption


**Configuration Backup Encryption:**

```

CUBE Configuration Backup:

├─ Backup tool:           Cisco Prime Infrastructure

├─ Encryption:            AES-256

├─ Storage location:      Local NAS + AWS S3 (geo-redundant)

├─ Access control:        RBAC (only network admins)

└─ Retention:             90 days

```


### 5.3 Key Management


#### 5.3.1 Certificate Lifecycle Management


**Certificate Inventory:**


| Certificate | Type | Issuer | Expiry Date | Auto-Renewal | Owner |

|-------------|------|--------|-------------|--------------|-------|

| cube-ext.company.com | Server | DigiCert | 2026-01-15 | No (manual) | Network Team |

| Webex Root CA | Root | Cisco | 2030-12-31 | No (Cisco manages) | Cisco |

| *.webexapis.com | Wildcard | DigiCert | 2025-06-20 | Yes (Cisco manages) | Cisco |


**Certificate Renewal Workflow:**

```

Certificate Expiry Timeline:

├─ Day -60:  Generate new CSR

├─ Day -55:  Submit to DigiCert

├─ Day -50:  Receive signed certificate

├─ Day -45:  Install on CUBE (parallel to old cert)

├─ Day -30:  Update SIP profile to use new cert

├─ Day -7:   Monitor for TLS handshake failures

├─ Day 0:    Old certificate expires

└─ Day +7:   Remove old certificate from trustpoint

```


**Automated Expiry Monitoring:**

```bash

# Script to check certificate expiry (run daily)

#!/bin/bash

CERT_FILE="/etc/ssl/certs/cube-ext.company.com.crt"

EXPIRY_DATE=$(openssl x509 -in $CERT_FILE -noout -enddate | cut -d= -f2)

EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s)

CURRENT_EPOCH=$(date +%s)

DAYS_REMAINING=$(( ($EXPIRY_EPOCH - $CURRENT_EPOCH) / 86400 ))


if [ $DAYS_REMAINING -lt 30 ]; then

  echo "ALERT: Certificate expires in $DAYS_REMAINING days!"

  # Send email/Slack notification

fi

```


#### 5.3.2 SRTP Key Management


**Key Exchange Mechanism:**

- **Protocol:** SDP (Session Description Protocol) via SIP INVITE

- **Key Derivation:** SDES (Session Description Protocol Security)

- **Key Lifetime:** Per-call (new key for each call)

- **Key Size:** 128-bit AES key + 112-bit HMAC salt


**SRTP Key Exchange Example:**

```

SIP INVITE (with SDES):

v=0

o=CiscoSystemsSIP-GW-UserAgent 1234 5678 IN IP4 10.100.10.10

s=SIP Call

c=IN IP4 10.100.10.10

t=0 0

m=audio 16384 RTP/SAVP 0

a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:PS1uQCVeeCFCanVmcjkpPjjgSDA4MzEyN3hkfGF8fQ==|2^31

a=rtpmap:0 PCMU/8000

```


**Key Rotation Policy:**

- **Frequency:** Every call (not reused)

- **Method:** New SDES key in SIP re-INVITE

- **Trigger:** Automatic (per-call basis)

- **Fallback:** If SRTP fails, call is rejected (no fallback to unencrypted RTP)


#### 5.3.3 API Key/Token Management


**Webex API Token Security:**


| Token Type | Lifetime | Storage | Rotation | Access Control |

|------------|----------|---------|----------|----------------|

| OAuth Access Token | 12 hours | Memory only | Automatic refresh | Service account |

| OAuth Refresh Token | 90 days | Encrypted vault | Manual rotation | Admin only |

| Integration Token | 1 year | AWS Secrets Manager | Manual (60 days) | CI/CD pipeline |


**Token Storage Best Practices:**

```python

# Example: Secure token retrieval from AWS Secrets Manager

import boto3

import json


def get_webex_token():

    client = boto3.client('secretsmanager', region_name='us-east-1')

    response = client.get_secret_value(SecretId='webex/api/token')

    secret = json.loads(response['SecretString'])

    return secret['access_token']


# Never hardcode tokens in code:

# BAD: webex_token = "Y2lzY29zcGFyazovL3VzL1BFT1BM..."

# GOOD: webex_token = get_webex_token()

```


### 5.4 Compliance


#### 5.4.1 PCI-DSS Compliance


**Requirements for Payment Card Data Handling:**


| PCI-DSS Requirement | Implementation | Status |

|---------------------|----------------|--------|

| 2.2.2 - Encryption in transit | TLS 1.2+ for all connections | ✅ |

| 3.4.1 - Unreadable PANs | Tokenization (no PAN storage) | ✅ |

| 4.1 - Strong cryptography | AES-256, RSA 2048 | ✅ |

| 8.2.1 - Strong authentication | MFA for admin access | ✅ |

| 10.2 - Audit logging | All access logged to SIEM | ✅ |


**Payment IVR Configuration:**

```

Payment IVR Flows (Webex Connect):

├─ DTMF masking:         Enabled (asterisks in logs)

├─ PCI-compliant vault:  Third-party (e.g., TokenEx)

├─ Tokenization:         PAN replaced with token

├─ Recording pause:      Automatic during payment collection

└─ Compliance:           PCI-DSS 4.0 certified

```


#### 5.4.2 HIPAA Compliance (Healthcare)


**If handling Protected Health Information (PHI):**


| HIPAA Requirement | Implementation | Status |

|-------------------|----------------|--------|

| §164.312(a)(2)(iv) - Encryption | AES-256 for data at rest | ✅ |

| §164.312(e)(1) - Transmission security | TLS 1.2+ for all PHI transfers | ✅ |

| §164.308(a)(5)(ii)(C) - Login monitoring | Logged to SIEM (90 days) | ✅ |

| §164.312(a)(1) - Access control | RBAC + MFA | ✅ |

| §164.312(b) - Audit controls | All PHI access logged | ✅ |


**Business Associate Agreement (BAA):**

- ✅ Cisco provides BAA for Webex Contact Center

- ✅ Valid for healthcare customers

- ✅ Covers recordings, transcripts, customer data


#### 5.4.3 GDPR Compliance (EU Data)


**Data Residency and Protection:**


| GDPR Article | Requirement | Implementation | Status |

|--------------|-------------|----------------|--------|

| Article 32 | Encryption of personal data | AES-256 at rest, TLS 1.2+ in transit | ✅ |

| Article 17 | Right to erasure | Manual deletion via Control Hub | ✅ |

| Article 25 | Data protection by design | Encryption enabled by default | ✅ |

| Article 33 | Breach notification | 72-hour notification process | ✅ |


**Data Retention Policy:**

```

GDPR Data Retention:

├─ Call recordings:      90 days (then auto-deleted)

├─ Transcripts:          90 days (then auto-deleted)

├─ Customer data:        As per business requirement

├─ Audit logs:           365 days (compliance)

└─ Right to delete:      Manual via Webex Control Hub

```


#### 5.4.4 SOC 2 Type II Compliance


**Trust Service Criteria:**


| Criteria | Description | Webex CC Compliance | Evidence |

|----------|-------------|---------------------|----------|

| CC6.1 | Logical and physical access controls | RBAC + MFA + Physical security | SOC 2 Report |

| CC6.7 | Encryption of data at rest | AES-256 | SOC 2 Report |

| CC6.6 | Encryption of data in transit | TLS 1.2+ | SOC 2 Report |

| CC7.2 | Threat detection and monitoring | SIEM + IDS/IPS | SOC 2 Report |


**Cisco SOC 2 Report Availability:**

- Request from Cisco Account Manager

- Updated annually

- Covers entire Webex Contact Center platform


### 5.5 Encryption Verification and Testing


#### 5.5.1 TLS/SRTP Verification


**Test 1: Verify TLS Version and Cipher Suite**

```bash

# OpenSSL test for TLS 1.2 on CUBE

openssl s_client -connect 203.0.113.10:5061 -tls1_2


# Expected output:

Protocol  : TLSv1.2

Cipher    : ECDHE-RSA-AES256-GCM-SHA384

```


**Test 2: Verify Certificate Chain**

```bash

# Check certificate chain validity

openssl s_client -showcerts -connect 203.0.113.10:5061 | openssl x509 -noout -text


# Expected:

# Issuer: CN=DigiCert TLS RSA SHA256 2020 CA1

# Validity: Not Before: Jan 15 00:00:00 2025 GMT

# Not After : Jan 15 23:59:59 2026 GMT

```


**Test 3: SRTP Encryption Verification (Packet Capture)**

```bash

# Capture RTP traffic

tcpdump -i eth0 -s 0 -w capture.pcap 'udp port 16384'


# Analyze in Wireshark:

# - Look for "RTP" packets

# - If encrypted (SRTP), payload will be unreadable random data

# - If NOT encrypted, you'll see audio waveform in RTP payload

```


#### 5.5.2 Security Scanning


**Quarterly Security Scan Checklist:**


| Test Type | Tool | Frequency | Remediation SLA |

|-----------|------|-----------|-----------------|

| Vulnerability scan | Nessus/Qualys | Monthly | Critical: 7 days<br>High: 30 days |

| SSL/TLS scan | SSL Labs | Quarterly | 14 days |

| Penetration test | External vendor | Annually | 30 days |

| Compliance audit | Internal audit team | Annually | 90 days |


**SSL Labs Scan Target Score:**

- **Target:** A+ rating

- **Current:** A (as of November 2025)

- **Remediation:** Enable TLS 1.3, disable TLS 1.1


**Example: SSL Labs Scan Command**

```bash

# Run SSL scan via API

curl -s "https://api.ssllabs.com/api/v3/analyze?host=cube-ext.company.com" | jq .

```


#### 5.5.3 Encryption Performance Testing


**Impact of Encryption on CUBE Performance:**


| Scenario | Sessions (No Encryption) | Sessions (TLS+SRTP) | Performance Impact |

|----------|--------------------------|---------------------|--------------------|

| CUBE (ASR 1002-HX) | 10,500 | 3,500 | 70% reduction |

| Latency added | 0 ms | 1-2 ms | Negligible |

| CPU utilization | 40% | 75% | +35% |


**Formula:**

```

Encrypted Session Capacity = (Hardware Max Capacity) ÷ 3

Example: 10,500 ÷ 3 = 3,500 sessions per CUBE

```


**Monitoring Encryption Performance:**

```

! CUBE CLI command to check CPU usage

show processes cpu sorted | include IP RTP


! Alert threshold:

! CPU > 80% → Add additional CUBE

```


---


## 6. Phased Migration Network Considerations


### 6.1 Coexistence Architecture


**Network Topology During Migration (Both Systems Active):**


```

                ┌──────────────────┐

                │  Webex Contact   │

                │     Center       │

                │     (Cloud)      │

                └────────┬─────────┘

                         │ SIP/TLS

                         │

                ┌────────▼─────────┐

                │  Cisco CUBE      │

                │  (New)           │

                └────────┬─────────┘

                         │

    ┌────────────────────┼────────────────────┐

    │    EXISTING AVAYA NETWORK              │

    ├────────────────────┼────────────────────┤

    │                    │                    │

    │   ┌────────────────▼────────────┐      │

    │   │   Voice VLAN (Shared)       │      │

    │   │   Avaya CM ◄──┬──► CUBE    │      │

    │   └───────────────┬─────────────┘      │

    │                   │                     │

    │   ┌───────────────▼─────────────┐      │

    │   │   Agent VLAN (No changes)   │      │

    │   │   1,000 agents               │      │

    │   │   - Some on Avaya            │      │

    │   │   - Some on Webex            │      │

    │   └──────────────────────────────┘      │

    └─────────────────────────────────────────┘

```


**Key Principles:**

- ✅ Avaya and Webex share same physical network

- ✅ No IP changes for agents during migration

- ✅ Both systems route through same internet gateway

- ✅ QoS policies accommodate both Avaya and Webex traffic

- ✅ Firewall rules allow both Avaya SIP and Webex SIP


### 6.2 Call Routing During Migration


**Routing Strategy by Migration Wave:**


| Migration Wave | Avaya Agents | Webex Agents | Inbound Call Routing | Outbound Call Routing |

|----------------|--------------|--------------|----------------------|-----------------------|

| Wave 1 (Pilot) | 900 (90%) | 100 (10%) | Avaya (90%) / Webex (10%) | Both systems active |

| Wave 2 | 500 (50%) | 500 (50%) | Split 50/50 by skill group | Both systems active |

| Wave 3 | 100 (10%) | 900 (90%) | Webex (90%) / Avaya (10%) | Both systems active |

| Wave 4 (Cutover) | 0 (0%) | 1,000 (100%) | 100% Webex | Avaya decommissioned |


**Dual Trunking Configuration:**


```

PSTN Carriers:

├─ Primary: AT&T SIP trunk

│  ├─ Avaya connection: Active (during coexistence)

│  ├─ Webex CUBE connection: Active (during coexistence)

│  └─ Call distribution: Based on agent availability

└─ Secondary: Verizon SIP trunk

   └─ Backup for both systems

```


### 6.3 Network Bandwidth During Coexistence


**Peak Load Scenario (Wave 2: 50% Avaya, 50% Webex):**


```

Total Bandwidth Usage:

├─ Avaya voice (500 agents):    43 Mbps  (G.729 codec)

├─ Webex voice (500 agents):    43 Mbps  (G.711 codec)

├─ Avaya signaling:              5 Mbps

├─ Webex signaling:              10 Mbps  (more API traffic)

├─ Agent desktops (all):         500 Mbps (1,000 agents)

├─ Video:                        75 Mbps

├─ Management:                   20 Mbps

└─ TOTAL PEAK:                   696 Mbps (70% of 1 Gbps) ✅ Sufficient

```


**Why This Works:**

- Both systems use different codecs (Avaya G.729, Webex G.711)

- Total voice bandwidth: 86 Mbps (well within 300 Mbps voice queue)

- Agent desktop bandwidth: Same regardless of backend system

- 30% headroom available for burst traffic


### 6.4 Firewall Rules During Coexistence


**Additional Rules Required:**


| # | Source | Destination | Protocol | Port | Purpose | Status |

|---|--------|-------------|----------|------|---------|--------|

| 5 | Avaya SBC<br>10.50.100.20 | Avaya Cloud<br>(if applicable) | TCP | 5061 | Legacy Avaya SIP | KEEP during migration |

| 6 | CUBE<br>10.50.100.50 | Webex CC<br>170.72.0.0/16 | TCP | 5061 | New Webex SIP | ADD for migration |


**Rule Management Strategy:**

- Keep Avaya firewall rules active during coexistence

- Add Webex firewall rules in parallel

- No conflicts (different destination IPs)

- Remove Avaya rules only after full cutover


### 6.5 Monitoring During Coexistence


**Dual System Monitoring:**


| System | Metrics to Monitor | Alert Threshold | Tool |

|--------|-------------------|-----------------|------|

| Avaya | Active calls, CPU, trunk utilization | >80% | Avaya SMGR |

| Webex | Active calls, MOS score, API errors | MOS <4.0 | Webex Analyzer |

| Network | Total bandwidth, latency, packet loss | >85% util | SNMP/NetFlow |

| CUBE | Session count, CPU, TLS failures | >75% capacity | Cisco Prime |


**Comparative Analysis Dashboard:**


```

Side-by-Side Metrics (Daily Review):

├─ Call quality (MOS): Avaya vs. Webex

├─ Average handle time: Avaya vs. Webex

├─ Call drops: Avaya vs. Webex

├─ Agent satisfaction: Survey both groups

└─ Network utilization: Monitor for congestion

```


### 6.6 Rollback Plan (If Needed)


**Network Rollback Procedure:**


| Step | Action | Time | Impact |

|------|--------|------|--------|

| 1 | Stop new agent migrations to Webex | 5 min | None (agents stay on Avaya) |

| 2 | Redirect migrated agents back to Avaya | 30 min | Agents re-login to Avaya phones |

| 3 | Disable Webex trunk (CUBE) | 5 min | No new Webex calls |

| 4 | Keep firewall rules (no changes) | N/A | No impact |

| 5 | Downgrade internet bandwidth (optional) | N/A | Only if cost-critical |


**Rollback Triggers:**

- Voice quality degradation (MOS <3.5 for >1 hour)

- >5% call drop rate

- Network congestion (>90% utilization sustained)

- Critical security incident

- Business decision (customer complaints, etc.)


### 6.7 Migration Wave Planning


**Network Readiness Checklist (Before Each Wave):**


| Check | Wave 1 | Wave 2 | Wave 3 | Wave 4 |

|-------|--------|--------|--------|--------|

| Internet bandwidth sufficient | ✅ | ✅ | ✅ | ✅ |

| CUBE capacity available | ✅ | ✅ | ✅ | ✅ |

| Firewall rules validated | ✅ | ⬜ | ⬜ | ⬜ |

| QoS policies tested | ✅ | ⬜ | ⬜ | ⬜ |

| Monitoring dashboard active | ✅ | ⬜ | ⬜ | ⬜ |

| Rollback plan documented | ✅ | ⬜ | ⬜ | ⬜ |


**Post-Wave Review:**

- Review call quality metrics

- Analyze bandwidth utilization

- Check for any security incidents

- Document lessons learned

- Adjust next wave plan if needed


---


## 7. Security Monitoring and Incident Response


### 7.1 Security Event Monitoring


**SIEM Integration (Splunk/QRadar):**


| Log Source | Event Type | Severity | Retention | Alert |

|------------|------------|----------|-----------|-------|

| CUBE | Authentication failure | High | 90 days | Yes |

| CUBE | TLS handshake failure | Medium | 90 days | Yes |

| Firewall | Denied connections | Low | 30 days | No |

| Firewall | Port scan detected | High | 90 days | Yes |

| Webex CC | API rate limit exceeded | Medium | 30 days | Yes |

| Webex CC | Login from new location | Medium | 90 days | Yes |


**Alert Triggers:**

```

Use Case: Multiple TLS Handshake Failures

├─ Threshold:         10 failures in 5 minutes (same source IP)

├─ Action:            Block source IP for 1 hour

├─ Notification:      Email + Slack to security team

└─ Escalation:        If >100 failures, page on-call engineer


Use Case: Suspicious API Activity

├─ Threshold:         5× API calls from unauthorized IP

├─ Action:            Revoke API token

├─ Notification:      Email to API owner + security team

└─ Investigation:     Manual review within 1 hour

```


### 7.2 Incident Response Plan


**Security Incident Classification:**


| Severity | Description | Response Time | Escalation |

|----------|-------------|---------------|------------|

| P1 (Critical) | Active breach, data exfiltration | 15 minutes | CISO, Legal |

| P2 (High) | Attempted breach, DoS attack | 1 hour | Security Manager |

| P3 (Medium) | Suspicious activity, failed logins | 4 hours | Security Analyst |

| P4 (Low) | Policy violation, config drift | 24 hours | Team Lead |


**Incident Response Workflow:**

```

1. Detection (SIEM alert)

   ↓

2. Triage (Assess severity)

   ↓

3. Containment (Block IP, disable account)

   ↓

4. Investigation (Log analysis, forensics)

   ↓

5. Remediation (Patch, reconfigure)

   ↓

6. Documentation (Incident report)

   ↓

7. Post-mortem (Lessons learned)

```


### 7.3 Security Audit and Compliance Review


**Audit Schedule:**


| Audit Type | Frequency | Owner | Deliverable |

|------------|-----------|-------|-------------|

| Firewall rule review | Quarterly | Network Team | Updated rule set |

| Certificate audit | Monthly | Security Team | Expiry report |

| Access control review | Quarterly | Identity Team | RBAC matrix |

| Encryption compliance | Annually | Compliance Team | Audit report |

| Penetration test | Annually | External vendor | Remediation plan |


---


## 8. Network and Security Validation


### 8.1 Pre-Production Testing


**Network Validation Checklist:**


| Test # | Test Description | Expected Result | Status |

|--------|------------------|-----------------|--------|

| 1 | CUBE to Webex SIP connectivity | TLS handshake successful | ⬜ |

| 2 | SRTP media encryption | Wireshark shows encrypted RTP | ⬜ |

| 3 | DNS resolution (cube-ext.company.com) | Resolves to public IP | ⬜ |

| 4 | Firewall rule validation | No denied connections in logs | ⬜ |

| 5 | QoS marking verification | DSCP EF on voice packets | ⬜ |

| 6 | Failover test (ISP1 → ISP2) | Convergence <5 seconds | ⬜ |

| 7 | Agent desktop access (HTTPS) | No certificate warnings | ⬜ |

| 8 | API connectivity (Webex APIs) | 200 OK responses | ⬜ |


### 8.2 Go-Live Validation


**Day 1 Post-Migration Checks:**


| Check | Time | Owner | Success Criteria |

|-------|------|-------|------------------|

| Active call count | Every 15 min | NOC | Matches expected load |

| TLS certificate status | 8 AM | Security | Valid, no expiry warnings |

| Firewall denied connections | 10 AM | Security | <10 denies/hour |

| CUBE CPU utilization | Every hour | Network | <75% |

| Network latency (RTT) | Every hour | Network | <100ms to Webex DC |

| MOS score | Every hour | Voice Team | >4.0 |


### 8.3 Continuous Monitoring


**Key Performance Indicators (KPIs):**


| KPI | Target | Warning | Critical | Alert Method |

|-----|--------|---------|----------|--------------|

| Network latency | <80ms | >100ms | >150ms | SNMP trap + Email |

| Packet loss | <0.1% | >0.5% | >1% | SNMP trap + Page |

| Jitter | <10ms | >20ms | >30ms | SNMP trap + Email |

| CUBE sessions used | <70% | >75% | >85% | SNMP trap + Page |

| Firewall CPU | <60% | >70% | >85% | SNMP trap + Email |

| TLS handshake failures | 0 | >5/min | >10/min | Syslog + Slack |


---


## 9. Troubleshooting Guide


### 9.1 Common Network Issues


**Issue: High Latency (>150ms)**


| Symptom | Root Cause | Resolution |

|---------|------------|------------|

| Voice choppy, robotic | Internet circuit congestion | Enable QoS priority queue for voice |

| One-way audio | Asymmetric routing | Verify NAT, check firewall state table |

| Call drops after 30 sec | TCP keepalive timeout | Configure SIP session refresh timer |


**Diagnostic Commands:**

```bash

# Measure latency to Webex DC

ping 170.72.1.1 -c 100


# Traceroute to identify hop with high latency

traceroute 170.72.1.1


# Check QoS packet drops

show policy-map interface GigabitEthernet0/0/1

```


### 9.2 Common Security Issues


**Issue: TLS Handshake Failure:**


| Symptom | Root Cause | Resolution |

|---------|------------|------------|

| "TLS negotiation failed" | Certificate expired | Renew certificate (see Section 5.3.1) |

| "Cipher mismatch" | Weak cipher disabled on Webex side | Enable TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 |

| "Certificate chain invalid" | Missing intermediate CA | Import intermediate CA cert |


**Diagnostic Commands:**

```bash

# Test TLS handshake

openssl s_client -connect 170.72.1.1:5061 -tls1_2


# Check certificate expiry on CUBE

show crypto pki certificates CUBE-CERT

```


### 9.3 Escalation Matrix


**Support Escalation Path:**


| Level | Team | Scope | Response Time |

|-------|------|-------|---------------|

| L1 | NOC (24/7) | Basic troubleshooting, monitoring | 15 minutes |

| L2 | Network Team | CUBE, firewall, routing issues | 1 hour |

| L3 | Security Team | Certificate, encryption issues | 2 hours |

| L4 | Cisco TAC | Webex CC platform issues | 4 hours (Sev 2) |


---


## 10. Change Management


### 10.1 Network Change Control


**Change Request Process:**


| Change Type | Approval Required | Downtime Window | Notification |

|-------------|-------------------|-----------------|--------------|

| Emergency (outage) | CISO + CTO | Immediate | Post-change report |

| High-risk (firewall rules) | Security Manager | Maintenance window | 72 hours notice |

| Medium-risk (CUBE config) | Network Manager | Maintenance window | 48 hours notice |

| Low-risk (monitoring) | Team Lead | Anytime | 24 hours notice |


**Maintenance Windows:**

- **Primary:** Sunday 2:00 AM - 6:00 AM (local time)

- **Backup:** Saturday 10:00 PM - 2:00 AM (local time)

- **Emergency:** Anytime (with approval)


### 10.2 Configuration Backup


**Backup Schedule:**


| Device | Frequency | Method | Retention |

|--------|-----------|--------|-----------|

| CUBE | Daily | Cisco Prime | 90 days |

| Firewall | Daily | Palo Alto Panorama | 90 days |

| Switch/Router | Weekly | TFTP | 90 days |


**Backup Verification:**

```bash

# Test backup restore (monthly)

# 1. Restore to test CUBE

# 2. Verify configuration loads

# 3. Test SIP connectivity

# 4. Document results

```


---


## 11. Summary and Recommendations


### 11.1 Critical Implementation Actions


**Must Complete Before Go-Live:**


1. ✅ **Internet Upgrade:** Increase from 200 Mbps → 1 Gbps (dual 500 Mbps circuits)

2. ✅ **CUBE Placement:** Add CUBE to existing voice VLAN, configure SIP trunks to Webex

3. ✅ **TLS Certificates:** Install certificates on CUBE, enable TLS 1.2+ and SRTP

4. ✅ **Firewall Rules:** Add rules for Webex IP ranges (170.72.x.x, 170.133.x.x, 64.68.x.x)

5. ✅ **QoS Adjustment:** Modify existing QoS policies to accommodate Webex traffic

6. ✅ **Monitoring:** Configure SIEM, set up alerting for both Avaya and Webex

7. ✅ **Testing:** Validate TLS handshake, SRTP encryption, coexistence scenarios


**Do NOT Change (Keep Existing):**

- ❌ Agent VLAN IP addressing

- ❌ Internal routing (OSPF/static routes)

- ❌ DNS/DHCP servers

- ❌ Core switching infrastructure


### 11.2 Post-Migration Hardening


**Week 1-4 After Go-Live:**


| Week | Task | Owner |

|------|------|-------|

| 1 | Review firewall denied connections, tune rules | Security Team |

| 2 | Analyze call quality metrics (MOS, latency, jitter) | Voice Team |

| 3 | Optimize QoS policies based on actual traffic | Network Team |

| 4 | Conduct security scan (SSL Labs, Nessus) | Security Team |


### 11.3 Key Success Factors


**Network and Security Best Practices for Migration:**


**Pre-Migration:**

- ✅ Leverage existing Avaya LAN infrastructure (minimal changes)

- ✅ Upgrade internet bandwidth before starting migration

- ✅ Add CUBE to existing voice VLAN (no IP readdressing)

- ✅ Implement dual internet circuits for redundancy


**During Migration (Coexistence):**

- ✅ Monitor both Avaya and Webex systems simultaneously

- ✅ Keep Avaya firewall rules active during coexistence

- ✅ Ensure QoS accommodates both systems (G.729 + G.711)

- ✅ Test rollback procedures before each migration wave

- ✅ Document bandwidth usage patterns during coexistence


**Post-Migration:**

- ✅ Enforce TLS 1.2+ and SRTP for all Webex traffic

- ✅ Monitor certificate expiry (30-day alerts)

- ✅ Log all firewall denied connections for 30 days

- ✅ Test failover scenarios quarterly

- ✅ Conduct annual penetration tests

- ✅ Review access control lists quarterly

- ✅ Remove Avaya network components only after successful cutover


---


## 12. Document Cross-References


### Related Design Documents


| Topic | Document | Section |

|-------|----------|---------|

| Network Design | Chapter 2: Design | Section 2.3 |

| SBC Architecture | Chapter 2: Design | Section 2.4 |

| Security Requirements | Chapter 2: Design | Section 2.5 |

| Capacity Planning | capacity-and-sizing.md | Section 2 (Bandwidth) |

| DR Strategy | dr-and-resiliency.md | Section 6 (Network DR) |


### Related Implementation Documents


| Topic | Document | Section |

|-------|----------|---------|

| CUBE Configuration | Chapter 4: Implementation | Section 4.1 |

| Agent Provisioning | Chapter 4: Implementation | Section 4.3 |

| Testing Procedures | Chapter 4: Implementation | Section 4.5 |


---


## 14. Appendix


### 14.1 Webex Contact Center IP Ranges


**Webex CC IP Addresses (For Firewall Allowlist):**


| Service | IP Range | Protocol | Port | Purpose |

|---------|----------|----------|------|---------|

| SIP Signaling | 170.72.0.0/16 | TCP | 5061 | SIP over TLS |

| Media (SRTP) | 170.133.0.0/16 | UDP | 8000-48199 | Voice/Video media |

| Agent Desktop | 64.68.96.0/19 | TCP | 443 | HTTPS web app |

| Webhooks | 64.68.96.0/19 | TCP | 443 | Event callbacks |


**Note:** These IP ranges are subject to change. Always verify with Cisco documentation:

https://help.webex.com/en-us/article/WBX000028782/Network-Requirements-for-Webex-Services


### 14.2 Recommended Reading


**External Resources:**


1. **Cisco CUBE Configuration Guide:**

   https://www.cisco.com/c/en/en/td/docs/ios-xml/ios/voice/cube/configuration/cube-book.html


2. **Webex Contact Center Security Whitepaper:**

   https://www.cisco.com/c/dam/en/us/products/collateral/contact-center/webex-contact-center/white-paper-c11-744249.pdf


3. **NIST Cryptographic Standards:**

   https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines


4. **PCI-DSS Requirements:**

   https://www.pcisecuritystandards.org/


---


**Next Steps:** Begin CUBE configuration (Chapter 4, Section 4.1)  


---


**💡 Key Takeaway:** This chapter provides network and security implementation details specifically for Avaya to Webex Contact Center migration. The approach leverages existing Avaya network infrastructure, focuses on WAN/Internet changes (CUBE, bandwidth, firewall rules), and supports phased migration with both systems running in parallel. Follow the configuration examples, validate encryption settings, and monitor continuously during coexistence period for optimal performance and security posture.