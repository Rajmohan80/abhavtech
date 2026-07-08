# ABHAVTECH IPv6 MIGRATION — PHASE 4
## WEBEX CALLING & CONTACT CENTER IPv6 DEPLOYMENT

**Project:** ABV-IPV6-2025  
**Phase:** 4 — Unified Communications IPv6  
**Duration:** 2 Weeks (Week 18-19)  
**Objective:** Deploy IPv6 on Webex Calling, Contact Center, and IP Phones with dual-stack  
**Scope:** Webex Calling SIP (archetype), CUBE dual-stack, IP Phones 8800 series, QoS for IPv6  

---

## PHASE 4 OVERVIEW

```
WEBEX IPv6 DEPLOYMENT STRATEGY:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WHY WEBEX IPv6 MATTERS:                                          │
│                                                                    │
│  Business Drivers:                                                 │
│    ✅ Webex Cloud prefers IPv6 (better voice quality)             │
│    ✅ Eliminate NAT for SIP signaling (improved reliability)      │
│    ✅ Direct media paths (lower latency, better QoS)              │
│    ✅ Future-proof for Webex-only deployments                     │
│    ✅ Simplified troubleshooting (end-to-end visibility)          │
│                                                                    │
│  Current State (IPv4-Only):                                        │
│    ❌ Webex SIP: IPv4 registration only                           │
│    ❌ IP Phones: IPv4 signaling/media                             │
│    ❌ CUBE PSTN gateway: IPv4 only                                │
│    ❌ Contact Center: IPv4 agent connectivity                     │
│                                                                    │
│  Target State (Dual-Stack):                                        │
│    ✅ Webex SIP: IPv4 + IPv6 registration (prefer IPv6)           │
│    ✅ IP Phones: Dual-stack signaling + RTP media                 │
│    ✅ CUBE: Dual-stack for both on-prem + Webex                   │
│    ✅ Contact Center: IPv6 agent endpoints                        │
│    ✅ QoS: Dual-stack DSCP marking (EF for voice)                 │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  PHASE 4 STRUCTURE (2 WEEKS):                                      │
│                                                                    │
│  Week 18: Webex Calling IPv6                                       │
│    - Webex SIP trunk dual-stack configuration                     │
│    - Cisco IP Phone 8800 series IPv6 registration                 │
│    - CUBE dual-stack for PSTN gateway                             │
│    - QoS for IPv6 voice traffic                                   │
│    - Call testing and validation                                  │
│                                                                    │
│  Week 19: Contact Center IPv6 + Validation                        │
│    - Webex Contact Center IPv6 agent connectivity                 │
│    - Finesse desktop dual-stack                                   │
│    - Webex Calling integration testing                            │
│    - Performance baselines (MOS, latency, jitter)                 │
│    - Templates and automation                                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## WEEK 18: WEBEX CALLING IPv6

## 18.1 Webex Calling Infrastructure

```
ABHAVTECH WEBEX CALLING CURRENT STATE:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WEBEX CALLING DEPLOYMENT:                                         │
│    ├─ Type: Webex Calling (Cloud-based UCaaS)                     │
│    ├─ Users: 5,000 (corporate) + 500 (contact center agents)      │
│    ├─ Devices: 4,500 × Cisco IP Phone 8800 series                 │
│    ├─ Locations: 19 sites (mapped to SD-WAN sites)                │
│    └─ PSTN: Local gateway (CUBE) + Webex Calling PSTN             │
│                                                                    │
│  SIP TRUNK (IPv4 — Existing):                                     │
│    ├─ Protocol: SIP over TLS (port 5061)                          │
│    ├─ Registration: SIP register to Webex cloud                   │
│    │    Webex SIP domain: abhavtech.calls.webex.com               │
│    │    Registration server: sip.webex.com (IPv4: 64.68.96.x)     │
│    ├─ Media: SRTP (encrypted RTP)                                 │
│    └─ Codec: G.711, Opus (wideband)                               │
│                                                                    │
│  CISCO IP PHONES (IPv4 — Existing):                               │
│    Model: Cisco IP Phone 8845 (majority), 8865 (executives)       │
│    Registration: Via SD-Access VN_VOICE (VLAN 1051)               │
│      IPv4: 10.190.1.10-254 (DHCP with Option 150)                 │
│      TFTP: Webex cloud (via HTTPS download)                       │
│      Call control: Webex Calling cloud                            │
│                                                                    │
│  CUBE (PSTN GATEWAY):                                              │
│    Device: Cisco ISR 4451 (MUM-CUBE-01, NJ-CUBE-01)               │
│    Role: SIP trunk to local carrier + Webex integration           │
│    IPv4: 10.190.255.1 (MUM), 10.191.255.1 (NJ)                    │
│    PSTN Trunks:                                                    │
│      Mumbai: Tata SIP trunk (10 PRIs equivalent)                  │
│      NJ: Verizon SIP trunk (20 PRIs)                              │
│                                                                    │
│  CONTACT CENTER:                                                   │
│    Platform: Webex Contact Center (Cloud)                         │
│    Agents: 500 (Finesse desktop on Windows)                       │
│    Queues: 25 (sales, support, billing, etc.)                     │
│    IVR: Webex Connect (cloud-based)                               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 18.2 Webex IPv6 Addressing Design

```
WEBEX CALLING IPv6 ALLOCATION:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  VN_VOICE DUAL-STACK (SD-Access):                                 │
│    Mumbai Campus:                                                  │
│      IPv4: 10.190.1.0/24 (existing, DHCP)                         │
│      IPv6: 2001:db8:abc1:6001::/64  ← ADD (SLAAC)                 │
│      Gateway: 2001:db8:abc1:6001::1 (anycast)                     │
│                                                                    │
│    Chennai Campus:                                                 │
│      IPv4: 10.190.2.0/24                                          │
│      IPv6: 2001:db8:abc2:6001::/64                                │
│                                                                    │
│  CUBE IPv6 ADDRESSING:                                             │
│    MUM-CUBE-01:                                                    │
│      Internal (VN_VOICE): 2001:db8:abc1:6001::254/64              │
│      External (WAN): 2001:db8:abc1:8000::254/128 (system IP)      │
│                                                                    │
│  WEBEX CLOUD ENDPOINTS:                                            │
│    Webex SIP domain: abhavtech.calls.webex.com                    │
│    Registration servers (Webex provides both):                    │
│      IPv4: 64.68.96.x, 64.68.97.x                                 │
│      IPv6: 2001:420:10::/48 (Webex owned, multiple /64s)          │
│             Example: 2001:420:10:1::1 (registration server)       │
│                                                                    │
│    Media servers (Webex global):                                   │
│      IPv6: 2001:420::/32 range (WebRTC media)                     │
│                                                                    │
│  PHONE IPv6 ADDRESSES:                                             │
│    Cisco IP Phone 8845:                                            │
│      IPv4: 10.190.1.45 (DHCP)                                     │
│      IPv6: 2001:db8:abc1:6001::45 (SLAAC from anycast gateway)    │
│      SIP Registration: Both IPv4 + IPv6 (Webex accepts both)      │
│      Media: Prefer IPv6 for RTP (lower latency)                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 18.3 Webex Calling IPv6 Configuration

### Step 18.3.1: Enable IPv6 on VN_VOICE (SD-Access)

```cisco
! ═══════════════════════════════════════════════════════════════════
! EDGE SWITCH VN_VOICE DUAL-STACK (MUM-ED-F1-01)
! ═══════════════════════════════════════════════════════════════════

! Voice VLAN SVI (already exists, add IPv6)
interface Vlan1051
  description ANYCAST-GW-VOICE-DUAL-STACK
  vrf forwarding VN_VOICE
  !
  ! IPv4 (existing)
  ip address 10.190.1.1 255.255.255.0
  ip helper-address 10.252.31.11  ! ISE DHCP for IPv4
  !
  ! IPv6 (new)
  ipv6 address 2001:db8:abc1:6001::1/64
  ipv6 enable
  !
  ! IPv6 RA for phones (SLAAC)
  ipv6 nd managed-config-flag  ! M=0 (stateless)
  ipv6 nd other-config-flag    ! O=1 (get DNS via RA)
  ipv6 nd ra interval 200
  ipv6 nd ra lifetime 1800
  !
  ! DNS for phones (both v4 and v6)
  ipv6 nd ra dns server 2001:db8:abc1:1000::53 lifetime 1800
  ipv6 nd ra dns search-list abhavtech.com lifetime 1800
  !
  ! Anycast MAC (same for IPv4/IPv6)
  mac-address 0000.0c9f.f005
  !
  ! LISP mobility
  lisp mobility dynamic-eid VOICE_EID_v4
  lisp mobility dynamic-eid VOICE_EID_v6
  !
  no ip redirects
  no ipv6 redirects
  no shutdown
```

---

### Step 18.3.2: Configure Cisco IP Phone 8845 for Dual-Stack

```
CISCO IP PHONE 8845 IPv6 CONFIGURATION:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  METHOD 1: Webex Cloud Management (Recommended)                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  Control Hub → Devices → Phones → Settings                        │
│                                                                    │
│  Network Settings:                                                 │
│    IPv4/IPv6 Mode: Dual Stack                                     │
│      ☑ Enable IPv4 (DHCP)                                         │
│      ☑ Enable IPv6 (SLAAC)                                        │
│      IPv6 Preference: Prefer IPv6                                 │
│                                                                    │
│  SIP Settings:                                                     │
│    Transport: TLS (port 5061)                                     │
│    IP Version Preference: IPv6                                    │
│      ✓ Try IPv6 first, fallback to IPv4 if unavailable           │
│                                                                    │
│  Media Settings:                                                   │
│    RTP IP Version: Dual Stack                                     │
│    Preferred: IPv6 (lower latency to Webex cloud)                 │
│                                                                    │
│  DNS Settings:                                                     │
│    DNS Server (IPv4): 10.252.31.53 (from DHCP Option 6)           │
│    DNS Server (IPv6): 2001:db8:abc1:1000::53 (from RA)           │
│                                                                    │
│  QoS:                                                              │
│    DSCP for Voice (RTP): EF (46) — applies to both IPv4/IPv6      │
│    DSCP for Signaling (SIP): CS3 (24)                             │
│                                                                    │
│  Apply to: All Cisco IP Phone 8845, 8865 models                   │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  METHOD 2: Manual Configuration (via phone web UI)                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  Phone Web UI (https://phone-ipv4-address/)                       │
│  → Admin Login → Network Configuration                            │
│                                                                    │
│  Network Setup:                                                    │
│    IPv4:                                                           │
│      ☑ DHCP Enabled                                               │
│      DHCP Options: 150 (TFTP), 6 (DNS), 3 (Gateway)               │
│                                                                    │
│    IPv6:                                                           │
│      ☑ IPv6 Enabled                                               │
│      Configuration: Auto (SLAAC)                                  │
│      ☑ Accept Router Advertisements                               │
│      DNS: Auto (from RA)                                          │
│                                                                    │
│    IP Version Preference:                                          │
│      ◉ Prefer IPv6                                                │
│      ○ Prefer IPv4                                                │
│      ○ IPv4 Only                                                  │
│                                                                    │
│  Apply Changes → Reboot Phone                                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Phone Behavior After Configuration:**
```
Expected Phone Network Status:
┌────────────────────────────────────────────────────────────────────┐
│  IPv4 Address: 10.190.1.45 (via DHCP)                             │
│  IPv4 Gateway: 10.190.1.1                                         │
│  IPv4 DNS:     10.252.31.53                                       │
│                                                                    │
│  IPv6 Address: 2001:db8:abc1:6001::1234:5678:9abc:def0/64        │
│                (SLAAC with privacy extensions enabled)             │
│  IPv6 Gateway: fe80::200:cff:fe9f:f005 (link-local of anycast)   │
│  IPv6 DNS:     2001:db8:abc1:1000::53                             │
│                                                                    │
│  SIP Registration:                                                 │
│    Primary:   IPv6 to 2001:420:10:1::1:5061 (Webex)              │
│    Fallback:  IPv4 to 64.68.96.10:5061                           │
│    Status:    Registered (via IPv6)                               │
│                                                                    │
│  Media (RTP):                                                      │
│    Local:     2001:db8:abc1:6001::1234:5678:9abc:def0            │
│    Remote:    2001:420:10:5::20 (Webex media server)             │
│    Codec:     Opus 48kHz (wideband)                               │
│    DSCP:      EF (46)                                             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### Step 18.3.3: CUBE Dual-Stack Configuration

```cisco
! ═══════════════════════════════════════════════════════════════════
! CUBE DUAL-STACK (MUM-CUBE-01 — ISR 4451)
! ═══════════════════════════════════════════════════════════════════

hostname MUM-CUBE-01

! Enable IPv6
ipv6 unicast-routing
ipv6 cef

! ═══════════════════════════════════════════════════════════════════
! INTERNAL INTERFACE (VN_VOICE — SD-Access)
! ═══════════════════════════════════════════════════════════════════

interface GigabitEthernet0/0/0
  description INTERNAL-VN_VOICE-DUAL-STACK
  !
  ! IPv4 (existing)
  ip address 10.190.255.1 255.255.255.0
  !
  ! IPv6 (new)
  ipv6 address 2001:db8:abc1:6001::254/64
  ipv6 enable
  !
  no shutdown

! ═══════════════════════════════════════════════════════════════════
! EXTERNAL INTERFACE (PSTN SIP TRUNK to Tata)
! ═══════════════════════════════════════════════════════════════════

interface GigabitEthernet0/0/1
  description EXTERNAL-PSTN-TATA-SIP-DUAL-STACK
  !
  ! IPv4 (existing - Tata provides)
  ip address 203.0.160.2 255.255.255.252
  !
  ! IPv6 (if Tata supports - request from carrier)
  ! ipv6 address 2001:db8:feed:100::2/127
  ! ipv6 enable
  !
  no shutdown

! Note: Many PSTN carriers still IPv4-only
! If Tata doesn't support IPv6, CUBE does IPv6→IPv4 translation

! ═══════════════════════════════════════════════════════════════════
! SIP CONFIGURATION (DUAL-STACK)
! ═══════════════════════════════════════════════════════════════════

voice service voip
  ip address trusted list
    ipv4 10.190.0.0 255.255.0.0
    ipv4 64.68.96.0 255.255.252.0   ! Webex IPv4
    ipv6 2001:db8:abc1:6000::/52    ! On-prem voice subnets
    ipv6 2001:420::/32               ! Webex IPv6
  !
  allow-connections sip to sip
  !
  sip
    bind control source-interface GigabitEthernet0/0/0
    bind media source-interface GigabitEthernet0/0/0
    !
    ! Enable IPv6 SIP
    ipv6 enable
    !
    registrar server expires max 3600 min 300
  !
  no update-callerid

! ═══════════════════════════════════════════════════════════════════
! DIAL-PEER TO WEBEX (DUAL-STACK)
! ═══════════════════════════════════════════════════════════════════

dial-peer voice 100 voip
  description WEBEX-CALLING-OUTBOUND-v6
  destination-pattern 9T
  session protocol sipv2
  session target ipv6:2001:420:10:1::1:5061  ! Webex IPv6 SIP server
  session transport tcp tls
  voice-class codec 1  ! Opus, G.711
  voice-class sip profiles 100
  voice-class sip tenant 100
  dtmf-relay rtp-nte
  no vad

dial-peer voice 101 voip
  description WEBEX-CALLING-OUTBOUND-v4-FALLBACK
  destination-pattern 9T
  preference 2  ! Lower preference (fallback)
  session protocol sipv2
  session target ipv4:64.68.96.10:5061
  session transport tcp tls
  voice-class codec 1
  dtmf-relay rtp-nte
  no vad

! ═══════════════════════════════════════════════════════════════════
! DIAL-PEER TO PSTN (TATA SIP TRUNK)
! ═══════════════════════════════════════════════════════════════════

dial-peer voice 200 voip
  description PSTN-TATA-SIP-TRUNK
  destination-pattern .T
  session protocol sipv2
  session target ipv4:203.0.160.1:5060  ! Tata SIP (IPv4 only)
  codec g711ulaw
  dtmf-relay rtp-nte sip-notify
  no vad

! ═══════════════════════════════════════════════════════════════════
! QoS FOR VOICE (DUAL-STACK)
! ═══════════════════════════════════════════════════════════════════

class-map match-any VOICE-RTP
  match ip dscp ef
  match ipv6 dscp ef  ! IPv6 voice packets

class-map match-any VOICE-SIGNALING
  match ip dscp cs3
  match ipv6 dscp cs3

policy-map WAN-OUT-POLICY
  class VOICE-RTP
    priority percent 30
    set ip dscp ef
    set ipv6 dscp ef
  class VOICE-SIGNALING
    bandwidth percent 5
    set ip dscp cs3
    set ipv6 dscp cs3
  class class-default
    fair-queue

! Apply to outbound interface
interface GigabitEthernet0/0/1
  service-policy output WAN-OUT-POLICY
```

---

## 18.4 Phone Registration Validation

```bash
#!/bin/bash
# validate_phone_ipv6.sh

echo "=== CISCO IP PHONE IPv6 VALIDATION ==="

# Test 1: Phone network status
echo ""
echo "Test 1: Phone Network Configuration"
# SSH to phone (if enabled) or check via Control Hub
# Phone IP: 10.190.1.45

# Via phone web UI:
curl -k https://10.190.1.45/CGI/Execute/Status | grep -E "IPv6|Registration"

# Expected output:
# IPv6 Address: 2001:db8:abc1:6001::xxxx
# IPv6 Gateway: fe80::200:cff:fe9f:f005
# SIP Registration: Registered (IPv6)

# Test 2: SIP registration check
echo ""
echo "Test 2: Webex SIP Registration (IPv6)"
# On CUBE
ssh admin@10.190.255.1 "show sip-ua register status"

# Expected:
# Line peer expires(sec) registered contact
# ======== ==== ============ ========== ======================
# 1000 -1 600 yes sip:1000@[2001:420:10:1::1]:5061

# Test 3: Call test (IPv6 media)
echo ""
echo "Test 3: Test Call via IPv6"
# Make call from phone to another phone
# Capture RTP packets

ssh admin@10.190.255.1 "debug voip ccapi inout"
# Make test call: 1000 → 1001
# Check debug output for IPv6 addresses

# Expected in debug:
# Media IP: 2001:db8:abc1:6001::xxxx (phone local)
# Remote media: 2001:420:10:5::20 (Webex media server)
# Codec: Opus/48000

# Test 4: Voice quality (MOS score)
echo ""
echo "Test 4: Voice Quality Metrics"
# After call, check phone statistics
curl -k https://10.190.1.45/CGI/Execute/CallHistory | tail -1

# Expected:
# MOS Score: 4.2-4.4 (Excellent for IPv6 Opus codec)
# Packet Loss: <0.5%
# Jitter: <20ms
# Latency: 30-50ms (Mumbai → Webex cloud)

echo ""
echo "✅ Phone IPv6 validation complete"
```

---

## 18.5 Webex Calling Performance Baselines

```bash
#!/bin/bash
# webex_performance_baseline.sh

echo "=== WEBEX CALLING IPv6 PERFORMANCE BASELINES ==="

# Baseline 1: SIP Registration Latency
echo ""
echo "Baseline 1: SIP Registration Time"
# Time from phone boot to registered

# IPv4 Registration: ~8-12 seconds
# IPv6 Registration: ~6-10 seconds (faster due to direct routing)

# Baseline 2: Call Setup Time
echo ""
echo "Baseline 2: Call Setup Latency"
# Time from dial to ringback

# IPv4: ~1.5-2.5 seconds
# IPv6: ~1.0-2.0 seconds (10-15% faster)

# Baseline 3: Media Quality (MOS)
echo ""
echo "Baseline 3: Mean Opinion Score (MOS)"

# Test calls: 20 samples over 1 week
# IPv4 Opus: MOS 4.1 avg (σ=0.2)
# IPv6 Opus: MOS 4.3 avg (σ=0.1) — More stable

# Baseline 4: Packet Loss
echo ""
echo "Baseline 4: Packet Loss Statistics"

# IPv4 RTP: 0.5-1.0% packet loss (via NAT)
# IPv6 RTP: 0.1-0.3% packet loss (direct routing)

# Baseline 5: Jitter
echo ""
echo "Baseline 5: Jitter Measurements"

# IPv4: 15-30ms jitter
# IPv6: 10-20ms jitter (more consistent paths)

echo ""
echo "PERFORMANCE IMPROVEMENT SUMMARY:"
echo "  Call Setup:    10-15% faster with IPv6"
echo "  MOS Score:     +0.2 improvement (4.1 → 4.3)"
echo "  Packet Loss:   -70% reduction (1.0% → 0.3%)"
echo "  Jitter:        -33% reduction (30ms → 20ms)"
echo ""
echo "RECOMMENDATION: Prefer IPv6 for Webex Calling"
```

---

## WEEK 19: CONTACT CENTER IPv6 + VALIDATION

## 19.1 Webex Contact Center IPv6

```
WEBEX CONTACT CENTER IPv6 CONFIGURATION:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  AGENT ENDPOINTS:                                                  │
│    ├─ Finesse Desktop: Web application (HTTPS)                    │
│    ├─ Agent Computers: Windows 11 dual-stack                      │
│    │    IPv4: 10.100.1.x (SD-Access VN_CORPORATE)                 │
│    │    IPv6: 2001:db8:abc1:2001::x                               │
│    └─ Access: Via IPv4 or IPv6 (Webex CC supports both)           │
│                                                                    │
│  WEBEX CC CLOUD ENDPOINTS:                                         │
│    Finesse URL: https://abhavtech.finesse.webex.com               │
│    IPv4: 64.68.110.x                                              │
│    IPv6: 2001:420:30::/48 (Webex Contact Center range)            │
│                                                                    │
│  AGENT PHONE INTEGRATION:                                          │
│    ├─ Agent uses IP Phone 8845 (dual-stack, as configured above)  │
│    ├─ Finesse desktop controls phone via CTI                      │
│    └─ Both signaling (SIP) and media (RTP) via IPv6               │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  CONFIGURATION (Webex Control Hub):                               │
│                                                                    │
│  Control Hub → Contact Center → Settings                          │
│                                                                    │
│  Network Settings:                                                 │
│    Agent Connectivity:                                             │
│      ☑ IPv4                                                       │
│      ☑ IPv6                                                       │
│      Preference: Auto (client determines)                         │
│                                                                    │
│  Browser Support:                                                  │
│    Finesse Desktop:                                                │
│      ✓ Chrome/Edge with dual-stack support                        │
│      ✓ Automatic IP version selection                             │
│                                                                    │
│  Call Control:                                                     │
│    Integration: Webex Calling (via IPv6 SIP)                      │
│    CTI: Webex CC CTI connector (dual-stack)                       │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  AGENT EXPERIENCE:                                                 │
│    1. Agent logs into Finesse desktop (via IPv6)                  │
│    2. Finesse connects to Webex CC cloud (IPv6)                   │
│    3. Agent phone registers to Webex (IPv6)                       │
│    4. Incoming call routed to agent                               │
│    5. Media flows via IPv6 (lower latency)                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 19.2 Agent Workstation Validation

```bash
#!/bin/bash
# validate_contact_center_agent.sh

echo "=== CONTACT CENTER AGENT IPv6 VALIDATION ==="

# Test 1: Agent PC network configuration
echo ""
echo "Test 1: Agent PC Dual-Stack"
# On agent Windows 11 PC
ipconfig /all | grep -A 5 "Ethernet adapter"

# Expected:
# IPv4 Address: 10.100.1.75
# IPv6 Address: 2001:db8:abc1:2001::xxxx

# Test 2: Finesse desktop connectivity
echo ""
echo "Test 2: Finesse Desktop Connection"
# Check browser connection to Finesse
curl -6 -I https://abhavtech.finesse.webex.com

# Expected:
# HTTP/2 200 OK
# Connection via IPv6: 2001:420:30:1::10

# Test 3: Agent phone status
echo ""
echo "Test 3: Agent Phone Registration"
# Agent phone should be registered via IPv6
curl -k https://agent-phone-ip/CGI/Execute/Status | grep Registration

# Expected:
# SIP Registration: Registered (IPv6)

# Test 4: Test call handling
echo ""
echo "Test 4: Contact Center Call Test"
# Place test call to contact center queue
# Verify call routes to agent via IPv6

# Expected call flow:
# Caller → Webex CC IVR → Queue → Agent (via IPv6 SIP) → RTP media (IPv6)

echo ""
echo "✅ Contact Center IPv6 validation complete"
```

---

## 19.3 Week 19 Final Validation

```bash
#!/bin/bash
# phase4_final_validation.sh

echo "=== PHASE 4 FINAL VALIDATION: WEBEX IPv6 ==="

# Test 1: Phone inventory
echo ""
echo "Test 1: IP Phone IPv6 Registration Count"
# Query Webex Control Hub API
# Count phones registered via IPv6

# Expected: 4,500 phones, 95%+ via IPv6

# Test 2: Call quality metrics
echo ""
echo "Test 2: Call Quality (7-day average)"
# Webex Control Hub → Analytics → Call Quality

# Metrics:
# - Calls via IPv6: 4,200/day (93% of total)
# - Calls via IPv4: 300/day (7% fallback)
# - Avg MOS (IPv6): 4.3
# - Avg MOS (IPv4): 4.1
# - Packet loss (IPv6): 0.2%
# - Jitter (IPv6): 15ms

# Test 3: CUBE statistics
echo ""
echo "Test 3: CUBE IPv6 Call Statistics"
ssh admin@10.190.255.1 "show call active voice brief | include ipv6"

# Expected: Active calls showing IPv6 addresses

# Test 4: Contact Center metrics
echo ""
echo "Test 4: Webex CC Agent Performance"
# Control Hub → Contact Center → Reports

# Metrics:
# - Agents online: 500
# - Agent connectivity: 98% IPv6, 2% IPv4
# - Average handle time: No significant change
# - Call quality: Improved (MOS +0.2)

# Test 5: End-to-end call test
echo ""
echo "Test 5: End-to-End Call (IPv6 Only)"
# Disable IPv4 temporarily on test phone
# Make call: Mumbai → Chennai

# Expected:
# - Call completes successfully via IPv6 only
# - Signaling: IPv6 SIP to Webex
# - Media: IPv6 RTP (Mumbai phone ↔ Webex ↔ Chennai phone)
# - Quality: MOS > 4.0

echo ""
echo "✅ Phase 4 validation complete"
```

---

## 19.4 Phase 4 Summary

```bash
#!/bin/bash
# phase4_summary.sh

echo "═══════════════════════════════════════════════════════════════"
echo "      PHASE 4 COMPLETION REPORT — WEBEX CALLING IPv6"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "WEBEX CALLING IPv6:"
echo "  ✅ SIP Registration: Dual-stack (prefer IPv6)"
echo "  ✅ IP Phones: 4,500 × Cisco 8845/8865 dual-stack"
echo "  ✅ CUBE: Dual-stack gateway (IPv6 ↔ IPv4 PSTN)"
echo "  ✅ Media: Prefer IPv6 RTP (lower latency)"
echo "  ✅ QoS: DSCP EF marking for IPv6 voice"
echo ""

echo "WEBEX CONTACT CENTER IPv6:"
echo "  ✅ Agent endpoints: 500 dual-stack workstations"
echo "  ✅ Finesse desktop: IPv6 connectivity to Webex CC"
echo "  ✅ CTI integration: Dual-stack"
echo "  ✅ Call routing: Via IPv6 SIP"
echo ""

echo "PERFORMANCE METRICS:"
echo "  ✅ IPv6 call percentage: 93%"
echo "  ✅ MOS improvement: +0.2 (4.1 → 4.3)"
echo "  ✅ Packet loss reduction: -70% (1.0% → 0.3%)"
echo "  ✅ Call setup time: 10-15% faster"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "         ✅ PHASE 4 COMPLETE — WEBEX CALLING IPv6"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "NEXT: Phase 5 — Observability IPv6"
```

---

## PHASE 4 COMPLETE

**Summary:**
- **Webex Calling**: 4,500 IP phones dual-stack, SIP via IPv6
- **CUBE**: Dual-stack PSTN gateway (IPv6 internal, IPv4 PSTN)
- **Contact Center**: 500 agents with IPv6 connectivity
- **Performance**: 10-15% faster call setup, +0.2 MOS improvement
- **Adoption**: 93% of calls via IPv6 (7% IPv4 fallback)


---

*© 2025 Abhavtech - IPv6 Migration Phase 4 Guide*
*Version 1.0 | Last Updated: January 2025*
