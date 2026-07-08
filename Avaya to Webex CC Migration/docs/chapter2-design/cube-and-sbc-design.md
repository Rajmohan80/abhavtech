# CUBE and Session Border Controller (SBC) Design

## 1. Overview

This document defines the Session Border Controller (SBC) architecture for connecting the on-premises telephony infrastructure and PSTN to Webex Contact Center cloud. It covers two primary deployment models—**on-premises CUBE** and **cloud-connected PSTN**—including detailed technical design, configuration, session capacity planning, and business impact analysis.

**Key Decision:** The SBC placement strategy directly impacts:
- **DID/Phone number management**
- **PSTN carrier relationship**
- **Operational complexity**
- **Cost structure**

---

## 2. SBC Deployment Options

### 2.1 Architectural Decision Matrix

| Factor | On-Premises CUBE | Cloud-Connected PSTN |
|--------|------------------|----------------------|
| **DID Management** | ✅ Keep existing DIDs | ❌ Port or new DIDs required |
| **Carrier Relationship** | ✅ Keep existing carrier | ❌ New Cisco/partner carrier |
| **Operational Impact** | ✅ No customer-facing changes | ⚠️ **HIGH: All DIDs change** |
| **Hardware Investment** | ❌ CUBE hardware/licenses | ✅ No hardware (cloud) |
| **Ongoing Maintenance** | ❌ IT team manages CUBE | ✅ Cisco manages SBC |
| **Setup Time** | 4-6 weeks | 2-4 weeks |
| **Monthly Cost** | Lower (CAPEX model) | Higher (OPEX model) |
| **Best For** | Migrations, large enterprises | Greenfield, small deployments |

---

### 2.2 **Recommended Approach for Avaya Migration: On-Premises CUBE**

**Rationale:**
1. **Zero business disruption:** Retain all existing phone numbers (DIDs)
2. **Existing carrier contracts:** Leverage current PSTN relationships
3. **Proven migration path:** Standard Avaya-to-Webex pattern
4. **Cost-effective long-term:** Lower TCO for large deployments

**This document focuses primarily on on-premises CUBE design, with cloud-connected PSTN as an alternative option.**

---

## 3. Critical Business Impact: DID Implications

### 3.1 On-Premises CUBE (Keep Existing DIDs) 

**Scenario:** CUBE sits between existing PSTN carrier and Webex cloud.

```
PSTN Carrier ←→ CUBE (On-Prem) ←→ Webex Contact Center Cloud
(Existing DIDs)     (Translator)        (Cloud routing)
```

**Impact:**
- ✅ **No DID changes:** All existing phone numbers remain intact
- ✅ **No customer communication:** No need to update websites, business cards, advertisements
- ✅ **No operational disruption:** Customers call the same numbers
- ✅ **Existing carrier:** No renegotiation, no porting process

**Example:**
- **Before migration:** Customer calls 1-800-555-HELP (Avaya answers)
- **After migration:** Customer calls 1-800-555-HELP (Webex Contact Center answers via CUBE)
- **Customer experience:** Identical, no awareness of backend change

---

### 3.2 Cloud-Connected PSTN (New DIDs) HIGH IMPACT

**Scenario:** Webex cloud directly connects to Cisco's cloud PSTN provider.

```
PSTN Carrier ←→ Cisco Cloud PSTN ←→ Webex Contact Center Cloud
(Cisco DIDs)      (Cisco SBC)         (Cloud routing)
```

**Critical Impact:**
- ❌ **All DIDs must change:** Existing phone numbers cannot be used
  - **Option A:** Port existing DIDs to Cisco's carrier (6-12 weeks, risk of failure)
  - **Option B:** Provision entirely new DIDs from Cisco's carrier

**Option A: Port Existing DIDs to Cisco Carrier**

**Process:**
1. Submit Letter of Authorization (LOA) to current carrier
2. Current carrier releases numbers (port-out request)
3. Cisco's carrier submits port-in request
4. Coordination window scheduled (typically late night/weekend)
5. Port executes (all or nothing—if one DID fails, all fail)

**Timeline:** 6-12 weeks

**Risks:**
- Port failure (rejected LOA, carrier disputes)
- Downtime during port window (1-4 hours)
- Toll-free numbers require separate process (RespOrg transfer)
- International DIDs may not be portable

**Option B: Provision New DIDs from Cisco Carrier**

**Process:**
1. Order new DIDs from Cisco's PSTN partner
2. Provision in Webex Control Hub
3. **Update ALL customer-facing materials:**
   - Website (every page with phone numbers)
   - Business cards (entire staff)
   - Letterheads and invoices
   - Email signatures
   - Marketing materials
   - Social media profiles
   - Google My Business listings
   - IVR recordings (outbound notification messages)
   - Partner/vendor contact databases
   - CRM systems (phone number fields)

**Timeline:** 2-4 weeks (provisioning) + **6-12 months (operational update cycle)**

**Operational Impact:**
- **Lost calls:** Customers calling old numbers reach disconnected/wrong destination
- **Brand confusion:** Multiple numbers in market simultaneously
- **Support burden:** Increased call center inquiries ("What's your new number?")
- **SEO impact:** Google search results show outdated numbers
- **Regulatory compliance:** Emergency services (E911) must be updated

**Cost Impact:**

| Activity | Estimated Cost |
|----------|----------------|
| New DID provisioning (Cisco carrier) | $5-15/DID/month × 200 DIDs = $1,000-3,000/month |
| Website updates (contractor) | $5,000-15,000 |
| Business card reprinting (1,000 staff) | $3,000-5,000 |
| Marketing material updates | $10,000-50,000 |
| Lost business (during transition) | **Difficult to quantify (high risk)** |

---

### 3.3 Decision Recommendation

| Scenario | Recommendation |
|----------|----------------|
| **Migrating from Avaya** | ✅ On-Premises CUBE (keep DIDs) |
| **Greenfield deployment** | Consider cloud-connected PSTN |
| **Small office (<50 agents)** | Consider cloud-connected PSTN |
| **Must minimize change** | ✅ On-Premises CUBE |
| **Want zero hardware** | Cloud-connected PSTN (accept DID impact) |

**For this Avaya migration: We proceed with on-premises CUBE design.**

---

## 4. CUBE Session Capacity Planning and Sizing

### 4.1 Understanding CUBE Session Capacity

#### What is a "Session"?

A **session** in CUBE terminology refers to a **single SIP dialog** (one leg of a call).

**Example: Simple Inbound Call**

```
PSTN Caller ←──(Session 1)──→ CUBE ←──(Session 2)──→ Agent (Webex)
```

- **Session 1:** PSTN carrier ↔ CUBE (inbound leg)
- **Session 2:** CUBE ↔ Webex Contact Center ↔ Agent (outbound leg)

**Total sessions for 1 active call: 2 sessions**

---

#### Encryption Impact on Session Capacity

**Critical Concept:** Enabling **TLS (signaling encryption)** and **SRTP (media encryption)** significantly reduces CUBE's session handling capacity due to CPU overhead for encryption/decryption.

| Configuration | Sessions per CUBE | Capacity Reduction |
|---------------|-------------------|-------------------|
| **No encryption** (SIP/RTP cleartext) | 3,000 sessions | Baseline (100%) |
| **TLS only** (encrypted signaling) | 1,500 sessions | 50% reduction |
| **SRTP only** (encrypted media) | 1,200 sessions | 60% reduction |
| **TLS + SRTP** (full encryption) | **1,000 sessions** | **66% reduction** |

**Why Webex Contact Center Matters:**

Webex Contact Center **requires TLS + SRTP** (mandatory encryption). Therefore, you must calculate session capacity based on the **reduced capacity** (approximately 1/3 of the base capacity).

**Formula:**

```
Effective Sessions = Base Platform Sessions ÷ 3
```

**Example:**

- Cisco ISR 4451 base capacity: 3,000 sessions
- With TLS + SRTP: 3,000 ÷ 3 = **1,000 effective sessions**

---

### 4.2 CUBE Session Sizing Formula

#### The Cisco Formula for Webex Contact Center

**For deployments with TLS + SRTP (mandatory for Webex CC):**

```
Required Sessions = ((Number of Agents × 2) + Active Queue Sessions) × 3
```

**Breaking Down the Formula:**

1. **Number of Agents × 2:**
   - Each agent on a call consumes **2 sessions** (PSTN leg + Webex leg)

2. **Active Queue Sessions:**
   - Calls waiting in queue or IVR consume **1 session** (not yet connected to agent)

3. **× 3 (Encryption Overhead):**
   - TLS + SRTP reduces capacity to 1/3, so multiply by 3 to get actual hardware sessions required

---

#### Example Calculation #1: Simple Scenario

**Scenario:**
- 100 agents on active calls
- 100 calls in queue (IVR)

**Calculation:**

```
Sessions = ((100 agents × 2) + 100 queue calls) × 3

Step 1: Agent sessions = 100 × 2 = 200
Step 2: Queue sessions = 100
Step 3: Subtotal = 200 + 100 = 300
Step 4: Encryption overhead = 300 × 3 = 900 sessions

Required CUBE capacity: 900 sessions
```

**Hardware Selection:**

- Cisco ISR 4451 (1,000 effective sessions with encryption) ✅ Sufficient

---

#### Example Calculation #2: This Migration (1,000 Agents)

**Scenario:**
- **1,000 agents** at peak
- **70% call occupancy** (700 agents on calls, 300 idle)
- **150 calls in queue/IVR**
- **10% using consult/conference** (70 agents doing transfers)

**Calculation:**

```
Base sessions:
- Active agents: 700 × 2 = 1,400 sessions
- Queue/IVR: 150 × 1 = 150 sessions
- Consult/conference: 70 × 2 (additional legs) = 140 sessions

Subtotal = 1,400 + 150 + 140 = 1,690 sessions

With encryption overhead:
Required Sessions = 1,690 × 3 = 5,070 sessions

With growth buffer (20%):
Final Requirement = 5,070 × 1.20 = 6,084 sessions
```

**Hardware Selection:**

- Need: **6,000-6,500 session capacity**
- **Recommended:** 2× Cisco ASR 1002-HX (3,500 sessions each)
- **Deployment:** Active-Active load balanced
- **Total capacity:** 7,000 sessions
- **Headroom:** 15% above peak requirement ✅

---

### 4.3 Simplified Agent-to-Session Ratio

#### Cisco's Rule of Thumb

**When using TLS + SRTP, the ratio is:**

```
1 agent ≈ 9.3 sessions (average)
```

**This assumes:**
- 50% of calls are queued (IVR), 50% active with agents
- 10% of calls use consult/conference
- 100% encryption (TLS + SRTP)

**Quick Sizing Formula:**

```
Required Sessions = (Number of Agents × Occupancy Rate × 9.3) × 1.20
                                                              └─ Growth buffer
```

**Example for This Migration:**

- 1,000 agents
- 60% occupancy (600 agents on calls at peak)
- 600 × 9.3 × 1.20 = **6,696 sessions**

**Recommended:** 2× ASR 1002-HX (7,000 sessions total) ✅

---

### 4.4 Session Consumption by Call Type

| Call Scenario | Sessions Consumed | Explanation |
|---------------|-------------------|-------------|
| **Call in IVR/queue** | 1 session | PSTN → CUBE → Webex (agent not yet involved) |
| **Agent answering call** | 2 sessions | PSTN → CUBE → Webex → Agent |
| **Agent on hold** | 2 sessions | Hold = same as active (media still flowing) |
| **Blind transfer** | 2 sessions | Original agent drops, new agent takes over |
| **Consult transfer (3-way)** | **4 sessions** | Agent + Customer + Transfer Target |
| **Conference call (3 parties)** | **6 sessions** | Customer + Agent + Manager (each = 2 legs) |

**Example: Consult Transfer Flow**

```
Step 1: Agent on call with customer
  PSTN ←→ CUBE ←→ Agent (2 sessions)

Step 2: Agent initiates consult to supervisor
  PSTN ←→ CUBE ←→ Agent (2 sessions)
  Agent ←→ CUBE ←→ Supervisor (2 additional sessions)
  Total: 4 sessions (peak)

Step 3: Agent completes transfer
  PSTN ←→ CUBE ←→ Supervisor (2 sessions, back to normal)
```

---

### 4.5 Reusing Existing CUBE Capacity

#### Decision Matrix for Existing CUBE

**If customer already has CUBE deployed for Avaya:**

| Current Utilization | Existing Capacity | Action Required |
|---------------------|-------------------|-----------------|
| **<30%** | Sufficient for Webex | ✅ Reuse existing, add licenses if needed |
| **30-60%** | Marginal | ⚠️ Add second CUBE for load balancing |
| **>60%** | Insufficient | ❌ New CUBE pair required |

**Key Questions to Ask:**

1. **What is the current CUBE model and session capacity?**
   - Example: ISR 4451 with 2,000 base sessions
   - With encryption: 2,000 ÷ 3 = **~666 effective sessions**

2. **What is the current session utilization?**
   - Check: `show sip-ua statistics`
   - If already at 60%+ utilization, insufficient capacity for Webex migration

3. **Does the existing CUBE support TLS + SRTP?**
   - IOS-XE version 17.6+ required for Webex CC
   - Older versions may need upgrade

---

#### Example: Customer Has ISR 4451 (1,000 Sessions)

**Current State:**

- CUBE: ISR 4451 (1,000 effective sessions with encryption)
- Avaya usage: 200 sessions (20% utilization)
- Migrating: 1,000 agents to Webex CC
- Required for Webex: 5,070 sessions (from calculation above)

**Analysis:**

- Current capacity: 1,000 sessions
- Required capacity: 5,070 sessions
- **Deficit: 4,070 sessions** ❌

**Options:**

**Option A: Replace with Larger CUBE**

- Sell/trade-in ISR 4451
- Buy 2× ASR 1002-HX (3,500 sessions each)
- Cost: ~$150,000

**Option B: Add Second CUBE for Webex Traffic (Recommended)**

- Keep existing ISR 4451 for Avaya (legacy)
- Add 2× ASR 1002-HX for Webex Contact Center (new)
- Cost: ~$150,000
- **Advantage:** Isolated failure domains, phased migration

---

### 4.6 Session Sizing Worksheet

**Use this template to calculate your CUBE session requirements:**

```
┌─────────────────────────────────────────────────────────────┐
│ CUBE SESSION SIZING WORKSHEET                               │
├─────────────────────────────────────────────────────────────┤
│ 1. Total Licensed Agents:                    [_______]      │
│                                                              │
│ 2. Peak Concurrent Agents (occupancy %):     [_______]      │
│    Recommended: 60-70%                                       │
│                                                              │
│ 3. Calls in Queue/IVR (average):             [_______]      │
│                                                              │
│ 4. Consult/Conference Rate (%):              [_______]      │
│    Default: 10%                                              │
│                                                              │
│ 5. CALCULATION:                                              │
│    a. Agent sessions = (2) × 2 =             [_______]      │
│    b. Queue sessions = (3) × 1 =             [_______]      │
│    c. Consult sessions = (2) × (4)/100 × 2 = [_______]      │
│    d. Subtotal = a + b + c =                 [_______]      │
│                                                              │
│ 6. Encryption Overhead:                                      │
│    Required Sessions = (5d) × 3 =            [_______]      │
│                                                              │
│ 7. Growth Buffer (20%):                                      │
│    Final Requirement = (6) × 1.20 =          [_______]      │
│                                                              │
│ 8. HARDWARE RECOMMENDATION:                                  │
│    [ ] ISR 4451 (1,000 sessions)                            │
│    [ ] ISR 4461 (1,500 sessions)                            │
│    [ ] ASR 1002-HX (3,500 sessions)                         │
│                                                              │
│ 9. Quantity Required:                         [_______]      │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.7 Hardware Selection Guide

| Agent Count | Peak Concurrent | Required Sessions | Recommended Hardware |
|-------------|----------------|-------------------|---------------------|
| <100 | 70 | ~390 | 1× ISR 4351 (500 sessions) |
| 100-200 | 140 | ~780 | 1× ISR 4451 (1,000 sessions) |
| 200-400 | 280 | ~1,560 | 2× ISR 4451 (2,000 total) |
| 400-800 | 560 | ~3,120 | 2× ISR 4461 (3,000 total) |
| **800-1,500** | **1,050** | **~5,850** | **2× ASR 1002-HX (7,000 total)** ✅ |

---

### 4.8 Session Monitoring and Capacity Management

#### Real-Time Monitoring Commands

```cisco-ios
! Show active voice calls
show call active voice brief

! Show total session count
show sip-ua statistics

! Show current session utilization
show platform hardware qfp active feature sbc dataplane stats
```

**Sample Output:**

```
Total SIP sessions: 2,847 / 3,500 (81% utilization)
Active calls: 1,423
```

---

#### Capacity Alerting Thresholds

| Utilization | Action Required | Alert Level |
|-------------|-----------------|-------------|
| <70% | Normal operation | 🟢 Green |
| 70-85% | Monitor closely, plan for growth | 🟡 Yellow |
| 85-95% | **Urgent:** Add capacity within 30 days | 🟠 Orange |
| >95% | **Critical:** Immediate action, risk of call blocking | 🔴 Red |

---

### 4.9 Common Sizing Mistakes to Avoid

| Mistake | Impact | Correction |
|---------|--------|------------|
| **Forgetting encryption overhead** | CUBE runs out of sessions at 33% agent load | Multiply by 3 for TLS+SRTP |
| **Assuming 100% occupancy** | Over-provisioning hardware | Use realistic occupancy (60-70%) |
| **Ignoring queue sessions** | Calls blocked during peak queue times | Add queue depth to calculation |
| **No growth buffer** | Need hardware refresh within 6 months | Add 20% headroom |
| **Active-standby confusion** | Thinking standby adds capacity | Standby is unused until failover |

---

### 4.10 Summary: Session Sizing for This Migration

**Your 1,000-Agent Deployment:**

- **Total agents:** 1,000
- **Peak concurrent (70% occupancy):** 700 agents
- **Calls in queue:** 150
- **Consult/conference (10%):** 70 agents

**Calculation:**

```
Base sessions: (700×2) + 150 + 140 = 1,690
With encryption: 1,690 × 3 = 5,070
With buffer (20%): 5,070 × 1.20 = 6,084 sessions
```

**Recommendation:**

- **Hardware:** 2× Cisco ASR 1002-HX
- **Capacity:** 3,500 sessions each = 7,000 total
- **Deployment:** Active-Active load balanced
- **Headroom:** 15% above peak requirement
- **Cost:** ~$150K (hardware) + $24K/year (support)

---

## 5. CUBE Hardware Specifications

### 5.1 Recommended Hardware Platform

**Primary and Secondary CUBE (Active-Standby HA Pair):**

| Component | Specification |
|-----------|---------------|
| **Model** | Cisco ISR 4451-X or Cisco ASR 1002-HX |
| **CPU** | 4-core minimum (8-core recommended) |
| **Memory** | 16 GB RAM (32 GB recommended) |
| **Storage** | 256 GB SSD |
| **Network Interfaces** | 4× 1 GbE (or 2× 10 GbE) |
| **IOS-XE Version** | 17.9.x or higher (Webex CC certified) |
| **Session License** | 2,000 concurrent sessions per CUBE |
| **Power Supply** | Dual redundant PSU |
| **Form Factor** | 2RU rackmount |

**Redundancy Model:**
- **Active-Standby HSRP pair**
- CUBE-Primary (10.50.1.10) – Normal state: Active
- CUBE-Secondary (10.50.1.11) – Normal state: Standby, takes over on failure
- Failover time: <30 seconds

---

### 5.2 Licensing Requirements

| License Type | Quantity | Cost (Estimate) |
|--------------|----------|-----------------|
| **CUBE Session License** | 2,000 sessions/CUBE | $25/session (one-time) = $50,000/CUBE |
| **IOS-XE DNA Advantage** | 2 devices | $5,000/device/year |
| **Smartnet Support (8×5)** | 2 devices | $2,000/device/year |
| **Total CAPEX (hardware + license)** | | ~$150,000 |
| **Annual OPEX (support)** | | ~$14,000/year |

---

## 6. CUBE Network Placement and Topology

### 6.1 DMZ Placement (Recommended)

**Architecture:**

```
                  Internet
                     │
          ┌──────────▼──────────┐
          │   External Firewall  │
          └──────────┬───────────┘
                     │
          ┌──────────▼──────────┐
          │      DMZ Network     │
          │  (10.50.1.0/24)     │
          │                     │
          │  ┌────────────┐    │
          │  │CUBE Primary│    │
          │  │10.50.1.10  │    │
          │  │(Pub: .110) │    │
          │  └─────┬──────┘    │
          │        │HSRP       │
          │  ┌─────▼──────┐    │
          │  │CUBE Standby│    │
          │  │10.50.1.11  │    │
          │  │(Pub: .111) │    │
          │  └────────────┘    │
          └──────────┬───────────┘
                     │
          ┌──────────▼──────────┐
          │  Internal Firewall   │
          └──────────┬───────────┘
                     │
          ┌──────────▼──────────┐
          │  Internal Network    │
          │  - CUCM Cluster     │
          │  - Agent Endpoints  │
          └─────────────────────┘
```

**IP Addressing:**

| Device | Internal IP | Public IP (NAT) | Purpose |
|--------|-------------|-----------------|---------|
| CUBE-Primary | 10.50.1.10 | 203.0.113.110 | Active SBC |
| CUBE-Secondary | 10.50.1.11 | 203.0.113.111 | Standby SBC |
| HSRP VIP | 10.50.1.1 | N/A | Internal failover |

---

## 7. SIP Trunk Configuration

### 7.1 SIP Trunk to PSTN Carrier (Inbound/Outbound)

**Carrier Details (Example):**

| Parameter | Value |
|-----------|-------|
| Carrier name | AT&T / Verizon / Lumen (example) |
| SIP proxy | sip.carrier.com (198.51.100.10) |
| Signaling protocol | SIP over TLS (port 5061) or TCP (port 5060) |
| Media encryption | SRTP (preferred) or RTP |
| Codec | G.711μ-law (primary), G.729 (backup) |
| DTMF | RFC 2833 (RTP-NTE) |

**Dial-Peer Configuration (PSTN Carrier):**

```cisco-ios
!
! SIP profile for PSTN carrier
!
voice class codec 1
 codec preference 1 g711ulaw
 codec preference 2 g729r8

voice class sip-profiles 100
 rule 1 request ANY sip-header SIP-Req-URI modify "sips:" "sip:"
 rule 2 request ANY sip-header To modify "sips:" "sip:"
 rule 3 request ANY sip-header From modify "sips:" "sip:"

voice class sip-options-keepalive 1
 transport tcp tls
 keepalive 60

!
! Outbound dial-peer to PSTN carrier
!
dial-peer voice 100 voip
 description Outbound to PSTN Carrier
 destination-pattern 9[2-9].........
 session protocol sipv2
 session target ipv4:198.51.100.10:5061
 session transport tcp tls
 voice-class codec 1
 voice-class sip profiles 100
 voice-class sip options-keepalive 1
 dtmf-relay rtp-nte
 no vad

!
! Inbound dial-peer from PSTN carrier
!
dial-peer voice 101 voip
 description Inbound from PSTN Carrier
 session protocol sipv2
 incoming called-number .%
 voice-class codec 1
 dtmf-relay rtp-nte
 no vad
```

---

### 7.2 SIP Trunk to Webex Contact Center (Cloud)

**Webex SIP Endpoint:**

| Parameter | Value |
|-----------|-------|
| FQDN | wxcc-us1.webex.com |
| IP address | Resolved via DNS (dynamic, do not hardcode) |
| Signaling protocol | SIP over TLS (port 5061) **mandatory** |
| Media encryption | SRTP **mandatory** |
| Codec | G.711μ-law, Opus (for video) |
| DTMF | RFC 2833 |

**Dial-Peer Configuration (Webex Contact Center):**

```cisco-ios
!
! SIP profile for Webex Contact Center
!
voice class codec 2
 codec preference 1 g711ulaw
 codec preference 2 opus

voice class sip-profiles 200
 rule 1 request ANY sip-header From modify "<sip:(.*)@.*>" "<sip:\1@yourcompany.com>"
 rule 2 request ANY sip-header Contact modify "10.50.1.10" "cube-primary.yourcompany.com"

voice class srtp-crypto 1
 crypto 1 AES_CM_128_HMAC_SHA1_80

!
! Outbound dial-peer to Webex Contact Center
!
dial-peer voice 200 voip
 description Outbound to Webex Contact Center
 destination-pattern 1800.......
 session protocol sipv2
 session target dns:wxcc-us1.webex.com
 session transport tcp tls
 voice-class codec 2
 voice-class sip profiles 200
 voice-class sip options-keepalive 1
 voice-class sip srtp-crypto 1
 dtmf-relay rtp-nte
 srtp
 no vad

!
! Inbound dial-peer from Webex Contact Center
!
dial-peer voice 201 voip
 description Inbound from Webex Contact Center
 session protocol sipv2
 incoming called-number T
 voice-class codec 2
 voice-class sip srtp-crypto 1
 dtmf-relay rtp-nte
 srtp
 no vad
```

---

## 8. SIP Header Manipulation

### 8.1 Common SIP Header Translation Rules

**Problem:** Webex Contact Center expects specific SIP header formats.

**Solution:** Use SIP profiles to normalize headers.

**Example: Fix "From" Header Domain**

```cisco-ios
voice class sip-profiles 200
 rule 1 request INVITE sip-header From modify "<sip:(.*)@10.50.1.10>" "<sip:\1@yourcompany.com>"
 rule 2 request INVITE sip-header Contact modify "10.50.1.10" "cube-primary.yourcompany.com"
```

**Example: Remove Unsupported SIP Headers**

```cisco-ios
voice class sip-profiles 200
 rule 10 request ANY sip-header P-Asserted-Identity remove
 rule 11 request ANY sip-header Remote-Party-ID remove
```

---

### 8.2 Caller ID Manipulation

**Scenario:** Set outbound caller ID for specific queues.

```cisco-ios
!
! Translation rule to set caller ID
!
voice translation-rule 1
 rule 1 // /18005551234/ type international plan isdn

voice translation-profile OUTBOUND-CID
 translate calling 1

!
! Apply to outbound dial-peer
!
dial-peer voice 100 voip
 description Outbound to PSTN
 translation-profile outgoing OUTBOUND-CID
```

---

## 9. Media Handling and NAT Traversal

### 9.1 Media Flow Architecture

```
┌─────────┐         ┌──────────┐         ┌─────────────┐
│  PSTN   │ ◄─RTP──►│   CUBE   │◄─SRTP──►│Webex Cloud  │
│ Carrier │         │(Private) │         │             │
└─────────┘         │  (DMZ)   │         └─────────────┘
                    └──────────┘
                         │
                    Media Anchor
                    (Transcoding)
```

**CUBE Modes:**

| Mode | Description | Use Case |
|------|-------------|----------|
| **Flow-through** | Media passes through, no transcoding | Same codec both sides (G.711↔G.711) |
| **Flow-around** | Media direct between endpoints | Not used in contact center |
| **Transcoding** | CUBE converts codec | G.729↔G.711, RTP↔SRTP |

---

### 9.2 NAT Configuration for Media

**Problem:** CUBE internal IP (10.50.1.10) in SDP causes media routing failure.

**Solution:** Enable `media-address` to advertise public IP.

```cisco-ios
voice service voip
 sip
  bind control source-interface GigabitEthernet0/0/1
  bind media source-interface GigabitEthernet0/0/1
  registrar server expires max 600 min 60

!
! Advertise public IP in SDP
!
voice class sip-options-keepalive 1
 media-address 203.0.113.110
```

---

### 9.3 STUN (Session Traversal Utilities for NAT)

**Purpose:** Discover public IP and port for media.

```cisco-ios
voice service voip
 sip
  stun usage firewall-traversal flowdata agent-id 1
  stun server-address 64.94.255.20
  stun server-address ipv4 64.94.255.21
```

---

## 10. TLS and SRTP Configuration

### 10.1 TLS Certificate Installation

**Generate Certificate Signing Request (CSR):**

```cisco-ios
crypto pki trustpoint CUBE-CERT
 enrollment terminal pem
 subject-name CN=cube-primary.yourcompany.com
 revocation-check none
 rsakeypair CUBE-KEY 2048

crypto pki enroll CUBE-CERT
```

**Import Signed Certificate:**

```cisco-ios
crypto pki import CUBE-CERT certificate
[Paste certificate from CA]

crypto pki trustpoint WEBEX-CA
 enrollment terminal
 revocation-check none

crypto pki authenticate WEBEX-CA
[Paste Webex root CA certificate]
```

---

### 10.2 Enable TLS for SIP Signaling

```cisco-ios
sip-ua
 crypto signaling default trustpoint CUBE-CERT
 transport tcp tls v1.2

voice service voip
 sip
  session refresh 1800
```

---

### 10.3 Enable SRTP for Media Encryption

```cisco-ios
voice class srtp-crypto 1
 crypto 1 AES_CM_128_HMAC_SHA1_80
 crypto 2 AES_CM_128_HMAC_SHA1_32

dial-peer voice 200 voip
 voice-class sip srtp-crypto 1
 srtp
```

---

## 11. High Availability and Redundancy

### 11.1 HSRP Configuration (Active-Standby)

**CUBE-Primary:**

```cisco-ios
interface GigabitEthernet0/0/1
 description Internal Interface
 ip address 10.50.1.10 255.255.255.0
 standby 1 ip 10.50.1.1
 standby 1 priority 110
 standby 1 preempt delay minimum 60
 standby 1 track 10 decrement 20

!
! Track internet reachability
!
track 10 ip sla 1 reachability

ip sla 1
 icmp-echo 8.8.8.8 source-ip 10.50.1.10
 frequency 10
ip sla schedule 1 life forever start-time now
```

**CUBE-Secondary:**

```cisco-ios
interface GigabitEthernet0/0/1
 description Internal Interface
 ip address 10.50.1.11 255.255.255.0
 standby 1 ip 10.50.1.1
 standby 1 priority 100
 standby 1 preempt delay minimum 60
```

**Failover Behavior:**
- **Normal:** CUBE-Primary active (priority 110)
- **Failure:** Internet unreachable → track 10 fails → priority drops to 90 → CUBE-Secondary takes over (priority 100)
- **Recovery:** CUBE-Primary internet restored → priority returns to 110 → preempts after 60 seconds

---

### 10.2 Session Replication (Optional)

**Note:** CUBE does not support stateful session replication. Failover results in active calls dropping.

**Mitigation:**
- **Agent re-login:** Agents reconnect within 30 seconds
- **Queue preservation:** Calls in queue reroute to secondary CUBE
- **Monitoring:** Real-time alerting on CUBE failure

---

## 12. Call Flow Examples

### 12.1 Inbound Call Flow (PSTN → Webex Contact Center)

```
1. Customer dials: 1-800-555-HELP
2. PSTN carrier routes to CUBE public IP: 203.0.113.110
3. CUBE receives SIP INVITE on port 5061 (TLS)
4. CUBE consults dial-peer 101 (inbound from carrier)
5. CUBE translates DID to internal routing logic
6. CUBE initiates new SIP INVITE to wxcc-us1.webex.com:5061 (TLS)
7. Webex Contact Center answers, consults routing strategy
8. Webex queues call or connects to agent
9. Agent answers on Webex desktop
10. Media path established: PSTN ↔ CUBE (RTP) ↔ Webex (SRTP) ↔ Agent

SIP Ladder:
PSTN          CUBE          Webex CC      Agent
  │            │               │            │
  │─INVITE────►│               │            │
  │            │─INVITE────────►│            │
  │            │◄100 Trying────│            │
  │◄100 Trying─│               │            │
  │            │               │─INVITE────►│
  │            │               │◄180 Ring───│
  │            │◄180 Ringing───│            │
  │◄180 Ring───│               │            │
  │            │               │◄200 OK─────│
  │            │◄200 OK────────│            │
  │◄200 OK─────│               │            │
  │─ACK───────►│               │            │
  │            │─ACK───────────►│            │
  │            │               │─ACK────────►│
  │◄═══════RTP═══════════════════SRTP══════►│
```

---

### 12.2 Outbound Call Flow (Agent → PSTN)

```
1. Agent initiates call from Webex desktop
2. Webex Contact Center sends SIP INVITE to CUBE
3. CUBE receives INVITE, consults dial-peer 201 (inbound from Webex)
4. CUBE matches destination pattern, selects dial-peer 100 (outbound to PSTN)
5. CUBE sends SIP INVITE to PSTN carrier
6. PSTN routes to customer phone
7. Customer answers
8. Media path: Agent ↔ Webex (SRTP) ↔ CUBE (RTP) ↔ PSTN ↔ Customer
```

---

### 12.3 Blind Transfer Flow

```
1. Agent on call with customer
2. Agent transfers to another queue/agent
3. Webex sends SIP REFER to CUBE
4. CUBE initiates new INVITE to transfer target
5. Transfer target answers
6. CUBE sends BYE to original agent
7. Media reconnected: Customer ↔ CUBE ↔ Transfer Target
```

---

## 13. Monitoring and Troubleshooting

### 13.1 Key Metrics to Monitor

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| **Active call sessions** | <1,500 | >1,700 | >1,900 |
| **CPU utilization** | <50% | >70% | >90% |
| **Memory utilization** | <60% | >80% | >95% |
| **SIP registration failures** | 0 | >5/hour | >20/hour |
| **Call setup time** | <2 sec | >3 sec | >5 sec |
| **One-way audio incidents** | 0 | >2/day | >10/day |

---

### 13.2 Diagnostic Commands

**Show Active Calls:**

```cisco-ios
show call active voice brief
show voice call summary
```

**Show SIP Registrations:**

```cisco-ios
show sip-ua status registrar
show sip-ua calls
```

**Show Dial-Peer Status:**

```cisco-ios
show dial-peer voice summary
show dial-peer voice 100
```

**Debug SIP Messages (Use with Caution in Production):**

```cisco-ios
debug ccsip messages
debug voice ccapi inout
```

**Show Media Statistics:**

```cisco-ios
show call active voice brief | include packets|jitter|latency
```

---

### 13.3 Common Issues and Resolutions

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| **SIP 503 Service Unavailable** | Webex cloud unreachable | Check firewall, DNS resolution, internet circuit |
| **One-way audio (PSTN hears, agent doesn't)** | Firewall blocking inbound RTP | Verify firewall rules for UDP 8000-48199 |
| **Calls drop after 30 seconds** | SIP session timer mismatch | `sip-ua session refresh 1800` |
| **TLS handshake failure** | Certificate mismatch or expired | Verify certificate SAN, check expiration date |
| **Choppy audio** | Packet loss or jitter | Check QoS, link utilization |

---

## 14. Security Hardening

### 14.1 Rate Limiting (Protection Against Toll Fraud)

```cisco-ios
voice service voip
 ip address trusted list
  ipv4 198.51.100.0 255.255.255.0
  ipv4 64.100.0.0 255.255.0.0
 allow-connections sip to sip
 max-calls 2000

dial-peer voice 100 voip
 max-conn 500
```

---

### 14.2 SIP Authentication

```cisco-ios
sip-ua
 authentication realm yourcompany.com
 authentication username cubeuser password Secur3P@ss

dial-peer voice 100 voip
 credentials username cubeuser password Secur3P@ss
```

---

### 14.3 Disable Unused Services

```cisco-ios
no ip http server
no ip http secure-server
no cdp run
no service pad
```

---

## 15. Capacity and Performance Testing

### 15.1 Pre-Production Load Test

**Objective:** Validate CUBE can handle 2,000 concurrent sessions.

**Tool:** SIPp (open-source SIP load generator)

**Test Scenario:**

```bash
sipp -sn uac -r 100 -l 2000 -d 60000 -s 18005551234 203.0.113.110:5061 -t t1 -tls_cert cube-test.pem
```

**Parameters:**
- `-r 100`: 100 calls per second ramp-up
- `-l 2000`: 2,000 concurrent calls
- `-d 60000`: 60-second call duration
- `-t t1`: TLS transport

**Success Criteria:**
- ✅ 0% call setup failures
- ✅ CPU <70% during load test
- ✅ Latency <100ms
- ✅ Jitter <20ms

---

## 16. Backup and Disaster Recovery

### 16.1 Configuration Backup

**Automated Daily Backup:**

```cisco-ios
archive
 path ftp://backup-server/cube-config-$h-$t
 write-memory
 time-period 1440
```

**Manual Backup:**

```cisco-ios
copy running-config ftp://10.10.10.50/cube-primary-config-20251101.txt
```

---

### 16.2 Disaster Recovery Runbook

**Scenario:** Primary CUBE hardware failure.

**Recovery Steps:**

1. **Immediate (0-5 minutes):**
   - HSRP triggers automatic failover to CUBE-Secondary
   - Monitor call quality, verify no one-way audio

2. **Short-term (1-4 hours):**
   - Investigate primary CUBE failure (hardware, software, network)
   - If hardware failure: Engage Cisco TAC, initiate RMA

3. **Long-term (1-7 days):**
   - Replacement hardware arrives
   - Restore configuration from backup
   - Synchronize IOS-XE version with secondary
   - Test in parallel before returning to service

---

## 17. Cloud-Connected PSTN Alternative (Reference)

### 17.1 Architecture Overview

```
PSTN (Cisco Cloud Carrier) ←→ Cisco Cloud SBC ←→ Webex Contact Center
```

**Key Differences from On-Premises CUBE:**

| Aspect | On-Prem CUBE | Cloud-Connected PSTN |
|--------|--------------|----------------------|
| Hardware | Customer-owned ISR/ASR | Cisco-managed cloud SBC |
| Configuration | Customer configures dial-peers | Cisco configures via Control Hub |
| DIDs | Keep existing (via current carrier) | Port to Cisco or new DIDs |
| Cost | CAPEX + low OPEX | Zero CAPEX + higher OPEX |
| Lead time | 4-6 weeks | 2-4 weeks |

---

### 17.2 When to Consider Cloud-Connected PSTN

✅ **Good fit for:**
- Greenfield deployments (no existing PSTN)
- Small contact centers (<50 agents)
- Organizations with no on-premises IT
- Desire for fully managed telephony

❌ **Poor fit for:**
- Avaya migrations (DID retention critical)
- Large enterprises (higher OPEX)
- Existing carrier contracts with favorable terms

---
