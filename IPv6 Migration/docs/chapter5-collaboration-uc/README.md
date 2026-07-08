# Chapter 5: Collaboration & UC

## Webex Calling and Contact Center IPv6 Enablement

This chapter covers the deployment of Webex Calling and Webex Contact Center with full IPv6 support, integrating unified communications and customer engagement platforms with the dual-stack SD-WAN and SD-Access infrastructure. The deployment establishes enterprise voice services, PSTN connectivity, contact center flows, and call quality monitoring across the global Abhavtech network.

---

## Chapter Contents

### [Phase 4: Webex UC Deployment](phase4-webex-uc-deployment.md)

**Enterprise Voice and Contact Center IPv6 Integration**

Phase 4 deploys Webex cloud-based collaboration services with IPv6 support, covering:

**Webex Calling Deployment:**

**PSTN Connectivity:**

- **Cloud Connected PSTN:** Webex Calling integrated with cloud-based SIP trunking providers
- **Local Gateway (CUBE):** Cisco Unified Border Element for on-premises PSTN connections
- **Emergency Services (E911):** IPv6-aware location services for emergency call routing
- **Number Porting:** Transfer existing DID ranges to Webex Calling

**IPv6 Call Signaling:**

- **SIP Trunks:** Dual-stack SIP trunking between CUBE and Webex Calling
- **Media Streams:** RTP/SRTP media flows over IPv6 where supported
- **Dial Plan Configuration:** E.164 routing, translation patterns, calling privileges
- **Call Admission Control:** Bandwidth management and QoS prioritization

**Endpoint Deployment:**

- **Webex Devices:** Desk phones, room systems, and soft clients with IPv6 support
- **Device Provisioning:** Zero-touch deployment via Catalyst Center integration
- **IPv6 Preference:** Configure endpoints to prefer IPv6 for signaling and media
- **Fallback Mechanisms:** Ensure IPv4 connectivity for legacy PBX interop

**Webex Contact Center:**

**Contact Center Infrastructure:**

- **Cloud Platform:** Webex Contact Center cloud service with IPv6-enabled agents
- **Agent Desktop:** Browser-based agent interface with dual-stack support
- **CTI Integration:** Computer Telephony Integration with CRM systems (Salesforce, ServiceNow)
- **IVR Flows:** Interactive Voice Response with IPv6-aware VXML scripts

**Omnichannel Routing:**

- **Voice Channels:** Inbound/outbound voice with IPv6 SIP trunking
- **Digital Channels:** Chat, email, SMS integration with IPv6 APIs
- **Unified Queue Management:** Skills-based routing across voice and digital channels
- **Screen Pop:** Customer context delivery to agent desktop on call arrival

**Analytics and Reporting:**

- **Historical Reports:** Call volume, handle time, abandonment rates per channel
- **Real-Time Dashboards:** Live agent status, queue statistics, service levels
- **Quality Management:** Call recording, screen recording, evaluation workflows
- **Speech Analytics:** Post-call transcription and sentiment analysis

**Integration with SD-WAN:**

**QoS and Traffic Prioritization:**

- **DSCP Marking:** EF (Expedited Forwarding) for voice RTP, AF41 for video
- **Application-Aware Routing:** Dedicated SaaS path for Webex Calling traffic
- **SRST (Survivability):** Local call processing during WAN failure
- **Bandwidth Reservation:** Guaranteed bandwidth for voice/video via SD-WAN policies

**Call Quality Monitoring:**

**Metrics Collection:**

- **MOS (Mean Opinion Score):** Voice quality measurement per call
- **Jitter and Packet Loss:** RTP stream analysis for troubleshooting
- **Latency Monitoring:** End-to-end delay measurement via ThousandEyes
- **Call Detail Records (CDRs):** Comprehensive logging for billing and analysis

**Troubleshooting Tools:**

- **Webex Troubleshooting API:** Diagnostic data extraction for call failures
- **CUBE Debug Commands:** SIP message tracing, media debugging
- **vManage Application Experience:** SD-WAN path quality for Webex traffic
- **ThousandEyes Voice Tests:** Proactive synthetic call testing

**Security and Compliance:**

**Call Encryption:**

- **TLS 1.2/1.3:** SIP signaling encryption (CUBE to Webex Calling)
- **SRTP:** Media stream encryption for all voice/video calls
- **Certificate Management:** PKI infrastructure for device authentication

**Compliance:**

- **Call Recording Retention:** Legal hold and retention policies (GDPR, HIPAA)
- **Data Residency:** Regional data center selection for call metadata
- **Audit Logging:** User provisioning, configuration changes, call records

---

## Deployment Architecture

**Webex Calling + Contact Center Integration:**

```
┌──────────────────────────────────────────────────────────────┐
│                  WEBEX CALLING CLOUD                         │
│         (Cisco-Managed, Global Data Centers)                 │
│         SIP Trunking + Media (IPv6-Enabled)                  │
└────────────┬─────────────────────────┬───────────────────────┘
             │                         │
             │ SIP/RTP (IPv6)          │ API Integration
             │                         │
┌────────────▼─────────┐      ┌────────▼──────────────────────┐
│  CUBE (Border        │      │ WEBEX CONTACT CENTER CLOUD    │
│  Element)            │      │   - Agent Desktop (IPv6)      │
│  Mumbai/London Hubs  │      │   - IVR Flows                 │
│  Dual-Stack SIP      │      │   - CTI Integration           │
└────────────┬─────────┘      └───────────────────────────────┘
             │                             │
             │ SD-WAN VPN 30 (Voice)       │ HTTPS API
             │                             │
┌────────────▼─────────────────────────────▼───────────────────┐
│              SD-WAN / SD-ACCESS FABRIC                       │
│   QoS Policies: EF for Voice, AF41 for Video                │
└────────────┬─────────────────────────┬───────────────────────┘
             │                         │
     ┌───────▼────────┐        ┌───────▼────────┐
     │  Webex Desk    │        │  Contact Center│
     │  Phones        │        │  Agents        │
     │  (IPv6)        │        │  (Workstations)│
     └────────────────┘        └────────────────┘
```

**IPv6 Addressing:**

- **CUBE Interfaces:** 2001:db8:abv:SITE:3000::10/64 (VPN 30 voice segment)
- **Webex Endpoints:** DHCPv6-assigned addresses from VN 30 pools
- **Contact Center Agents:** Dual-stack workstations in corporate VN

---

## Deliverables

By the end of Chapter 5, you will have:

✅ **Webex Calling Operational** — Enterprise voice service with IPv6 SIP trunking

✅ **PSTN Connectivity** — CUBE deployed at hubs, DID ranges ported to Webex

✅ **Webex Devices Provisioned** — Desk phones and room systems with IPv6 addressing

✅ **Contact Center Live** — Agent desktop functional, omnichannel routing operational

✅ **QoS Enforced** — Voice/video traffic prioritized via SD-WAN policies

✅ **Call Quality Monitored** — ThousandEyes voice tests, CDR collection, MOS reporting

✅ **Security Hardened** — TLS/SRTP encryption, call recording retention policies

---

## Prerequisites

Before starting Chapter 5:

- **Chapters 2-4 complete** — SD-WAN, SD-Access, and multi-cloud operational
- **Webex Calling licenses** — Calling Professional licenses for all users
- **Contact Center licenses** — Premium Agent licenses, supervisor seats
- **PSTN contracts** — SIP trunking provider agreements or local PSTN circuits
- **QoS design finalized** — DSCP marking, bandwidth reservation policies

---

## Key Concepts

**Cloud-Based UC:**

- **SIP Trunking:** Standards-based VoIP connectivity replacing traditional PRI/T1 circuits
- **CUBE (Cisco Unified Border Element):** Session border controller for PSTN integration
- **Webex Device Management:** Cloud-based provisioning and monitoring

**Contact Center:**

- **IVR (Interactive Voice Response):** Self-service menu systems for caller routing
- **CTI (Computer Telephony Integration):** Desktop integration with CRM platforms
- **Omnichannel:** Unified agent experience across voice, chat, email, SMS

**Voice Quality:**

- **MOS (Mean Opinion Score):** 1-5 scale for voice quality (target: 4.0+)
- **Jitter:** Variation in packet arrival time (target: <30ms)
- **Packet Loss:** Dropped RTP packets (target: <1%)

---

## Next Steps

After completing Chapter 5:

1. **Proceed to [Chapter 6: Observability](../chapter6-observability/README.md)** — Deploy comprehensive monitoring and analytics
2. **User training** — Webex Calling end-user training, contact center agent onboarding
3. **Optimize call quality** — Analyze CDRs, adjust QoS policies, improve network paths

---

**Ready to enable voice and contact center?** Start with **[Phase 4: Webex UC Deployment →](phase4-webex-uc-deployment.md)**
