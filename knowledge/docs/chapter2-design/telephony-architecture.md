# Telephony Architecture

## Overview

This document details the telephony infrastructure design for Webex Contact Center, including PSTN connectivity, call routing, number management, and voice quality optimization.

---

## 1. PSTN Connectivity Options

### 1.1 Design Decision: On-Premises Cisco CUBE (Selected for This Migration)

Based on the discovery phase and CUBE design chapter findings, **on-premises Cisco CUBE** has been selected as the primary PSTN connectivity option for this Avaya to Webex Contact Center migration.

**Why On-Premises CUBE Was Selected:**
- ✅ Leverage existing carrier contracts and SIP trunks
- ✅ Retain control over routing and DID management
- ✅ Keep existing DIDs without complex porting scenarios
- ✅ Maintain premises-based control during migration phases
- ✅ Support hybrid coexistence with Avaya during transition
- ✅ Meet enterprise security and compliance requirements

---

### 1.2 Selected Architecture: On-Premises Cisco CUBE

```
┌─────────────────┐
│  PSTN Network   │
│ (Existing SIP   │
│    Provider)    │
└────────┬────────┘
         │
         │ SIP Trunk (Existing)
         │
┌────────▼────────┐
│  Cisco CUBE     │
│  (On-Premises)  │
│                 │
│ • ASR 1002-HX   │
│ • Dual HA Setup │
│ • TLS 1.2+ SIP  │
│ • SRTP Media    │
└────────┬────────┘
         │
         │ Secure SIP/TLS over Internet
         │
┌────────▼────────┐
│ Webex Contact   │
│ Center Cloud    │
│ (Datacenter)    │
└─────────────────┘
```

**Key Components:**
- **CUBE Hardware**: Cisco ASR 1002-HX (2× units for HA)
- **SIP Trunks**: Existing carrier relationship maintained
- **Connectivity**: Dual ISP with 1 Gbps total bandwidth
- **Security**: TLS 1.2+ for signaling, SRTP for media encryption
- **Registration**: CUBE acts as Local Gateway to Webex Calling

**Reference Documents:**
- See **Chapter 2: CUBE & SBC Design** for complete session sizing (6,084 sessions for 1,000 agents)
- See **Chapter 3: Network and Security** for firewall rules and CUBE dial-peer configurations

---

### 1.3 Inbound Voice Call Flow (On-Premises CUBE)

```
┌─────────────────┐
│   Customer      │
│   Dials TFN     │
│ 1-800-XX5-0100  │
└────────┬────────┘
         │
         │ PSTN/SIP
         │
┌────────▼────────┐
│  SIP Provider   │
│ (Existing ITSP) │
└────────┬────────┘
         │
         │ SIP Trunk
         │ (Existing)
         │
┌────────▼────────────────────┐
│     CISCO CUBE              │
│     (On-Premises)           │
│                             │
│  ┌─────────────────────┐    │
│  │ Inbound Dial-Peer   │    │
│  │ • Match DNIS        │    │
│  │ • Apply Translation │    │
│  │ • Select Codec      │    │
│  │ • Route to WxCC     │    │
│  └──────────┬──────────┘    │
│             │               │
│  ┌──────────▼──────────┐    │
│  │ Security Processing │    │
│  │ • TLS Encryption    │    │
│  │ • SRTP Setup        │    │
│  │ • SIP Header Mods   │    │
│  └──────────┬──────────┘    │
│             │               │
└─────────────┼───────────────┘
              │
              │ SIP/TLS (Port 5061)
              │ + SRTP Media
              │
┌─────────────▼───────────────┐
│    WEBEX CONTACT CENTER     │
│    (Cloud Platform)         │
│                             │
│  ┌─────────────────────┐    │
│  │ Entry Point         │    │
│  │ • EP_Sales_TF       │    │
│  │ • Match DNIS        │    │
│  └──────────┬──────────┘    │
│             │               │
│  ┌──────────▼──────────┐    │
│  │ Flow Designer       │    │
│  │ • IVR Prompts       │    │
│  │ • Self-Service      │    │
│  │ • Queue Decision    │    │
│  └──────────┬──────────┘    │
│             │               │
│  ┌──────────▼──────────┐    │
│  │ Queue Routing       │    │
│  │ • Skills Match      │    │
│  │ • Agent Selection   │    │
│  │ • Priority Rules    │    │
│  └──────────┬──────────┘    │
│             │               │
└─────────────┼───────────────┘
              │
              │ WebRTC/Webex Media
              │
┌─────────────▼───────────────┐
│     AGENT DESKTOP           │
│     (Webex App)             │
│                             │
│  • Screen Pop (CRM Data)    │
│  • Call Controls            │
│  • Recording Active         │
└─────────────────────────────┘
```

**Detailed Call Flow Steps:**

| Step | Component | Action |
|------|-----------|--------|
| 1 | Customer | Dials 1-800-XX5-0100 |
| 2 | PSTN Carrier | Routes call via SIP to CUBE |
| 3 | CUBE (Inbound) | Receives SIP INVITE, matches dial-peer |
| 4 | CUBE (Translation) | Applies number translation rules |
| 5 | CUBE (Security) | Encrypts with TLS/SRTP for Webex |
| 6 | CUBE (Outbound) | Sends to Webex CC cloud endpoints |
| 7 | Webex CC Entry Point | Matches DNIS to EP_Sales_TF |
| 8 | Flow Designer | Executes IVR logic (menu, self-service) |
| 9 | Queue Engine | Routes to Sales_Queue based on skills |
| 10 | Agent Desktop | Call delivered to available agent |
| 11 | CRM Integration | Screen pop with customer data |
| 12 | Recording | Call recording initiated |

---

### 1.4 Alternative Option: Cisco VPOP (Cloud-Connected PSTN)

> **Note**: This option was evaluated during discovery but NOT selected for this migration. Documented here for reference and future consideration.

**Cisco VPOP (Virtual Point of Presence)**

```
┌─────────────────┐
│  PSTN Network   │
│   (Carriers)    │
└────────┬────────┘
         │
         │ Traditional TDM/SIP
         │
┌────────▼────────┐
│  Cisco VPOP     │
│  (Cloud SBC)    │
│                 │
│ • SIP Gateway   │
│ • Transcoding   │
│ • Protocol Conv │
└────────┬────────┘
         │
         │ Secure SIP (TLS)
         │
┌────────▼────────┐
│ Webex Calling   │
│   Platform      │
└────────┬────────┘
         │
┌────────▼────────┐
│ Webex Contact   │
│    Center       │
└─────────────────┘
```

**Benefits:**
- ✅ Managed by Cisco (no hardware to maintain)
- ✅ Global carrier relationships
- ✅ Automatic failover and redundancy
- ✅ Built-in SBC and security
- ✅ Simplified number porting
- ✅ Quick deployment (2-4 weeks)

**Why Not Selected for This Migration:**
- ❌ Requires porting all DIDs to Cisco-managed carriers
- ❌ Lose existing carrier contracts and negotiated rates
- ❌ Less control during phased migration
- ❌ Monthly per-seat licensing adds cost
- ❌ DID porting complexity for 265+ numbers

**Future Consideration:**
VPOP may be reconsidered post-migration for:
- Expansion to new regions
- Simplified international connectivity
- Reducing on-premises infrastructure

---

### 1.5 Hybrid Approach (Future State)

```
Primary Path (Current Design):
Customer Call ──► SIP Provider ──► On-Prem CUBE ──► Webex CC
(100% of calls during migration)

Potential Future Enhancement:
Primary: On-Prem CUBE (Existing DIDs)
Backup:  Cisco VPOP (New international numbers)
```

---

### 1.6 Comparison Matrix

| Criteria | On-Prem CUBE (Selected) | Cisco VPOP (Alternative) |
|----------|------------------------|--------------------------|
| **Control** | Full premises control | Cisco-managed |
| **Existing Carriers** | ✅ Keep existing contracts | ❌ Port to Cisco carriers |
| **DID Management** | ✅ No porting required | ❌ Complex porting process |
| **Migration Phases** | ✅ Supports hybrid coexistence | ⚠️ All-or-nothing approach |
| **Hardware** | Customer-owned ASR/ISR | No hardware required |
| **Expertise Required** | High (CUBE configuration) | Low (Cisco-managed) |
| **Cost Model** | CapEx + existing OpEx | Monthly per-seat subscription |
| **Deployment Time** | 4-8 weeks (with HA) | 2-4 weeks |
| **Security Control** | Full policy control | Cisco-managed policies |
| **Failover** | Customer-configured HSRP | Automatic Cisco failover |

**Recommendation**: On-Premises CUBE provides the best path for this enterprise migration due to existing infrastructure investments, carrier relationships, and phased migration requirements.

---
## 2. Number Management Strategy

### 2.1 Number Types and Allocation

| Number Type | Use Case | Quantity | Management |
|-------------|----------|----------|------------|
| Toll-Free | Primary customer contact | 15 | Ported to Webex |
| Local DID | Regional/office direct lines | 250 | Ported to Webex |
| International | Global customer access | 30 | New via Cisco VPOP |
| Internal Extensions | Agent/supervisor direct dial | 500 | Webex Calling |
| Test/Development | Testing environments | 10 | Temporary assignment |

### 2.2 Number Porting Process

**Phase 1: Pre-Port Planning (Weeks 1-2)**
```
Action Items:
☐ Inventory all existing numbers
☐ Obtain Letters of Authorization (LOA)
☐ Identify port-in dates
☐ Plan for port validation testing
☐ Communicate customer-facing changes
```

**Phase 2: Port Submission (Week 3)**
```
Submit to Carrier:
• LOA (signed by authorized representative)
• Current carrier account information
• CSR (Customer Service Record)
• Desired port date/time
• Emergency callback information
```

**Phase 3: Port Execution (Week 4)**
```
Port Day Timeline:
T-24 hours: Final validation testing
T-4 hours:  Activate new routes in Webex
T-0:        Port executes at carrier
T+1 hour:   Validation testing
T+4 hours:  Full production traffic
T+24 hours: Post-port monitoring
```

**Rollback Plan:**
```
If port fails:
1. Immediately contact losing carrier
2. Request port cancellation
3. Restore original routing
4. Investigate and reschedule
```

---

## 3. Call Routing Architecture

### 3.1 Entry Point Design

**Entry Point Configuration Matrix**

| Entry Point | DNIS | Purpose | Routing Destination |
|-------------|------|---------|---------------------|
| EP_Sales_TF | 1-800-XX5-0100 | Sales inquiries | Sales IVR Flow |
| EP_Support_TF | 1-800-XX5-0200 | Technical support | Support IVR Flow |
| EP_Billing | 1-800-XX5-0300 | Billing questions | Billing Queue Direct |
| EP_Spanish | 1-800-XX5-0150 | Spanish language | Spanish IVR Flow |
| EP_VIP | 1-800-XX5-0500 | Premium customers | VIP Queue Priority |

**Entry Point Routing Logic**

```
┌──────────────────┐
│  Inbound Call    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  DNIS Matching   │
│ (Number Dialed)  │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│Direct  │ │  IVR   │
│Queue   │ │ Flow   │
└────────┘ └───┬────┘
               │
         ┌─────┴─────┐
         │           │
    ┌────▼────┐ ┌────▼────┐
    │ Queue A │ │ Queue B │
    └─────────┘ └─────────┘
```

### 3.2 Queue Routing Strategies

**Strategy 1: Longest Available Agent**
- Routes to agent idle for longest time
- Ensures balanced distribution
- Best for general queues

**Strategy 2: Skills-Based with Proficiency**
- Matches call requirements to agent skills
- Considers skill level (1-10)
- Routes to highest skilled available agent

**Strategy 3: VIP Priority Routing**
- Identifies high-value customers
- Jumps queue position
- Routes to specialized agents

**Strategy 4: Business Hours Routing**
```
IF current_time IN business_hours THEN
    Route to → Live Queue
ELSE IF current_time IN after_hours THEN
    Route to → Voicemail/Callback
ELSE
    Route to → Closed Message
END IF
```

### 3.3 Overflow and Failover

**Overflow Routing Configuration**

```
Primary Queue: Sales_Queue
├─ Service Level: Answer within 20 seconds
├─ Maximum Wait: 5 minutes
│
├─ Overflow Condition 1: Wait time > 3 minutes
│   └─ Action: Route to → General_Support_Queue
│
├─ Overflow Condition 2: Queue depth > 20 calls
│   └─ Action: Route to → Overflow_Queue
│
└─ Failover Condition: All agents logged out
    └─ Action: Play message → Offer callback
```

**Geographic Failover**

```
┌──────────────────┐
│   Primary Site   │
│   (US East)      │
│   └─ 60% agents  │
└────────┬─────────┘
         │
    Site failure?
         │
         ▼
┌──────────────────┐
│  Secondary Site  │
│   (US West)      │
│   └─ 40% agents  │
└──────────────────┘
```

---

## 4. Voice Quality Optimization

### 4.1 Codec Selection

**Supported Codecs (Priority Order)**

| Codec | Bandwidth | Quality | Use Case |
|-------|-----------|---------|----------|
| G.722 | 64 kbps | HD Voice | Internal, high bandwidth |
| G.711 | 64 kbps | Toll Quality | Most common, PSTN |
| G.729 | 8 kbps | Compressed | Low bandwidth scenarios |
| Opus | Variable | Adaptive | Future/optimal performance |

**Codec Negotiation Strategy:**
```
Offer: G.722, G.711, G.729
Prefer: G.722 (HD voice when available)
Fallback: G.711 (universal compatibility)
Emergency: G.729 (bandwidth constraints)
```

### 4.2 QoS Configuration

**DSCP Marking Standards**

| Traffic Type | DSCP Value | Priority | Bandwidth |
|--------------|------------|----------|-----------|
| Voice (RTP) | EF (46) | Highest | 100 kbps/call |
| Signaling (SIP) | CS3 (24) | High | 10 kbps/call |
| Video | AF41 (34) | Medium-High | 500 kbps/call |
| Best Effort | 0 | Normal | Remaining |

**Network Requirements**

```
Per Agent Bandwidth Requirements:
├─ Voice: 100 kbps (upload/download)
├─ Signaling: 10 kbps
├─ Desktop App: 50 kbps
├─ CRM Integration: 25 kbps
└─ Total: ~200 kbps per concurrent call

For 100 concurrent agents:
Total required bandwidth: 20 Mbps (with 20% overhead = 24 Mbps)
```

### 4.3 Jitter Buffer Configuration

```
Adaptive Jitter Buffer Settings:
├─ Minimum: 20ms
├─ Maximum: 200ms
├─ Target: 60ms
└─ Adaptation: Dynamic based on network conditions
```

### 4.4 Echo Cancellation

**Built-in Echo Cancellation:**
- Webex platform provides automatic echo cancellation
- ITU-T G.168 compliant
- No configuration required

**Troubleshooting Echo Issues:**
1. Check agent headset quality
2. Verify acoustic environment
3. Review audio settings in desktop app
4. Test with alternate audio device

---

## 5. Dial Plan Design

### 5.1 Outbound Dialing

**Dial Plan Rules**

| Pattern | Description | Action |
|---------|-------------|--------|
| 9 + 1 + 10 digits | US/Canada long distance | Strip 9, route external |
| 9 + 10 digits | US/Canada local | Strip 9, route external |
| 9 + 011 + intl | International dialing | Strip 9, route external |
| 4 digits | Internal extensions | Route to Webex Calling |
| 911 | Emergency services | Route direct, alert security |
| *xx | Feature codes | Platform features |

**Example Dial Plan Configuration:**

```
RULE 1: Emergency
Pattern: 911
Action: Route immediately, no prefix, notify security

RULE 2: Internal Extensions
Pattern: [1-9]XXX (4 digits)
Action: Route to Webex Calling internal

RULE 3: Local Calls
Pattern: 9 + [2-9]XX-[2-9]XX-XXXX
Action: Strip leading 9, route to PSTN

RULE 4: Long Distance
Pattern: 9 + 1 + [2-9]XX-[2-9]XX-XXXX
Action: Strip leading 9, route to PSTN

RULE 5: International
Pattern: 9 + 011 + X+
Action: Strip leading 9, route to PSTN
```

### 5.2 Caller ID Management

**Outbound Caller ID Strategy**

| Scenario | Caller ID Displayed | Configuration |
|----------|---------------------|---------------|
| Agent outbound call | Main company number | Default ANI |
| Callback from queue | Original customer number | Preserve ANI |
| Supervisor call | Supervisor direct number | Extension ANI |
| Emergency call | Site physical address | E911 ANI |

**Caller ID Format:**
```
Format: +1-XXX-XXX-XXXX (E.164)
Example: +1-408-XX5-0100

Components:
+ = International prefix
1 = Country code (US/Canada)
408 = Area code
XX5-0100 = Local number
```

---

## 6. Emergency Services (E911)

### 6.1 E911 Configuration

**Location Registration**

```
Office Locations:
├─ HQ Campus (Building A)
│   ├─ Address: 123 Main St, San Jose, CA 95110
│   ├─ Emergency Contact: Security Desk
│   └─ Phone: +1-408-XX5-9111
│
├─ Regional Office (Building B)
│   ├─ Address: 456 Oak Ave, Austin, TX 78701
│   ├─ Emergency Contact: Facilities
│   └─ Phone: +1-512-XX5-9111
│
└─ Remote Agents
    ├─ Address: Agent's registered home address
    ├─ Emergency Contact: Agent's registered info
    └─ Phone: Agent's local 911 center
```

**E911 Call Flow**

```
Agent dials 911
    ↓
System identifies:
├─ Agent location (IP subnet or registered address)
├─ Closest PSAP (Public Safety Answering Point)
└─ Emergency callback number
    ↓
Routes to appropriate 911 center
    ↓
Simultaneously alerts:
├─ Corporate security desk
├─ Supervisor
└─ Emergency response team
```

### 6.2 Remote Agent E911

**Requirements for Remote Workers:**
- Agents must register home address in system
- System validates address against E911 database
- Agents must update address if working from different location
- Popup reminder every 90 days to confirm address

**Testing Protocol:**
```
Quarterly E911 Testing:
☐ Test call to non-emergency line (not 911!)
☐ Verify correct location information sent
☐ Confirm callback number accuracy
☐ Document test results
☐ Update any discrepancies
```

---

## 7. Call Recording Architecture

### 7.1 Recording Infrastructure

```
┌──────────────────┐
│   Active Call    │
│   (Agent+Caller) │
└────────┬─────────┘
         │
         │ RTP Stream
         │
┌────────▼─────────┐
│  Media Forking   │
│  (Real-time)     │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────────┐
│ Call   │ │ Recording  │
│ Audio  │ │ Metadata   │
│        │ │ (ANI, DNIS,│
│        │ │ Agent ID)  │
└───┬────┘ └─────┬──────┘
    │            │
    └─────┬──────┘
          │
    ┌─────▼──────┐
    │   Cloud    │
    │  Storage   │
    │ (Encrypted)│
    └────────────┘
```

### 7.2 Recording Policies

**Recording Rules**

| Queue/Type | Recording Policy | Retention | PCI Compliance |
|------------|------------------|-----------|----------------|
| Sales | 100% of calls | 90 days | No |
| Support | 100% of calls | 1 year | No |
| Billing | 100% of calls | 7 years | Yes - Pause on payment |
| Collections | 100% of calls | 7 years | Yes |
| Quality sampling | Random 10% | 30 days | No |

**PCI-DSS Compliance:**
```
When customer provides payment card:
1. Agent clicks "Pause Recording" button
2. Recording pauses immediately
3. Agent collects payment information
4. Transaction completes
5. Agent clicks "Resume Recording"
6. Recording resumes with notation in metadata
```

### 7.3 Storage and Retention

**Storage Requirements Calculation:**

```
Recording Storage per Agent per Day:
├─ Average call duration: 6 minutes
├─ Calls per day: 40 calls
├─ Total recorded time: 240 minutes = 4 hours
├─ Audio file size: ~3.6 MB per hour (G.711)
└─ Daily storage: ~14 MB per agent

For 500 agents over 1 year:
500 agents × 14 MB × 365 days = 2.5 TB
```

**Data Lifecycle Management:**

```
Timeline:
├─ 0-30 days: Hot storage (immediate access)
├─ 31-90 days: Warm storage (retrieval within minutes)
├─ 91 days-7 years: Cold storage (archive, retrieval within hours)
└─ 7+ years: Automated deletion (per retention policy)
```

---

## 8. Call Metrics and Monitoring

### 8.1 Key Telephony Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Call Setup Success Rate | >99% | <98% |
| Post-Dial Delay | <3 seconds | >5 seconds |
| Voice Quality (MOS) | >4.0 | <3.5 |
| Packet Loss | <1% | >2% |
| Jitter | <30ms | >50ms |
| Latency (Round-trip) | <150ms | >200ms |

### 8.2 Real-Time Monitoring Dashboard

**Key Indicators:**
```
┌─────────────────────────────────────────────┐
│  Real-Time Telephony Dashboard              │
├─────────────────────────────────────────────┤
│  Active Calls: 247                          │
│  Trunk Utilization: 65% (195/300)           │
│  Average MOS Score: 4.2                     │
│  Failed Calls (last hour): 3 (0.5%)         │
│  Emergency Calls Active: 0                  │
└─────────────────────────────────────────────┘
```

### 8.3 Troubleshooting Tools

**Built-in Diagnostics:**
- Real-time call quality monitoring
- SIP ladder diagrams
- RTP stream analysis
- Network path visualization

**Common Issues and Resolution:**

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| One-way audio | Firewall/NAT issue | Check firewall rules, verify RTP ports open |
| Choppy audio | Packet loss/jitter | Verify QoS, check network congestion |
| Echo | Poor acoustics | Check headset, verify echo cancellation |
| Call drops | Network instability | Review network stability, check bandwidth |

---

## 9. Security Considerations

### 9.1 SIP Security

**Security Measures:**
- TLS 1.2+ for SIP signaling encryption
- SRTP for media encryption
- SIP authentication via digest authentication
- Rate limiting to prevent DoS attacks
- Geo-blocking for international fraud prevention

### 9.2 Toll Fraud Prevention

**Protection Strategies:**

```
1. Outbound Call Restrictions:
   ├─ Block premium rate numbers (900, 976)
   ├─ Block international by default (whitelist only)
   ├─ Limit call duration (4-hour maximum)
   └─ Alert on unusual patterns

2. Authentication:
   ├─ Agent must authenticate before placing calls
   ├─ Supervisor approval for international calls
   └─ Two-factor authentication for admin changes

3. Monitoring:
   ├─ Real-time spend tracking
   ├─ Alert on spend threshold ($500/hour)
   └─ Automatic block on fraud detection
```

---

## 10. Telephony Testing Strategy

### 10.1 Pre-Production Testing

**Test Scenarios:**

```
☐ Inbound call routing to correct queues
☐ Outbound dialing (local, long distance, international)
☐ Call transfer (blind and attended)
☐ Conference calling
☐ Call recording (start, pause, resume, stop)
☐ Hold and resume
☐ DTMF tone recognition
☐ Voice quality across different codecs
☐ Failover scenarios
☐ Emergency (E911) routing
☐ After-hours routing
☐ Overflow routing
☐ CRM screen pop integration
```

### 10.2 Load Testing

**Capacity Validation:**

```
Test Profile:
├─ Concurrent calls: 500
├─ Duration: 4 hours
├─ Call arrival rate: Poisson distribution
├─ Average call duration: 5 minutes
└─ Expected behavior: No degradation

Success Criteria:
├─ All calls completed successfully
├─ Voice quality MOS > 4.0
├─ No dropped calls
├─ System response time < 3 seconds
└─ CPU/memory utilization < 80%
```

---

## Validation Checklist

Before going live:

- [ ] All numbers ported and validated
- [ ] Entry points configured and tested
- [ ] Dial plans tested for all scenarios
- [ ] Emergency services (E911) tested and verified
- [ ] Call recording operational and compliant
- [ ] Voice quality meets standards (MOS > 4.0)
- [ ] Failover scenarios validated
- [ ] Security controls implemented and tested
- [ ] Monitoring and alerting configured
- [ ] Runbook and troubleshooting procedures documented


