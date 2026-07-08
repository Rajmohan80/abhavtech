# Licensing & Sizing

## 1.4 Network Readiness Assessment

### 1.4.1 Bandwidth Requirements

**Codec Bandwidth Calculations:**

| Codec | Sample Rate | Bitrate | With Headers (IP/UDP/RTP) | MOS Score |
|-------|------------|---------|---------------------------|-----------|
| G.711 (PCM) | 8 kHz | 64 kbps | 87.2 kbps | 4.1 |
| G.722 (HD Voice) | 16 kHz | 64 kbps | 87.2 kbps | 4.3 |
| G.729 | 8 kHz | 8 kbps | 31.2 kbps | 3.9 |
| Opus (Webex) | Variable | 24-64 kbps | 40-90 kbps | 4.2-4.5 |

**Site Bandwidth Requirements:**

| Site | Users | Concurrent Calls (20%) | Required BW (G.711) | Required BW (Opus) | Current WAN | Status |
|------|-------|------------------------|---------------------|--------------------|-----------| --------|
| Mumbai HQ | 1,200 | 240 | 21 Mbps | 18 Mbps | 1 Gbps DIA | [OK] Adequate |
| Chennai | 450 | 90 | 8 Mbps | 7 Mbps | 500 Mbps DIA | [OK] Adequate |
| Bangalore | 180 | 36 | 3.2 Mbps | 2.8 Mbps | 200 Mbps DIA | [OK] Adequate |
| Delhi | 150 | 30 | 2.7 Mbps | 2.4 Mbps | 200 Mbps DIA | [OK] Adequate |
| Noida | 120 | 24 | 2.2 Mbps | 1.9 Mbps | 100 Mbps DIA | [OK] Adequate |
| Pune | 100 | 20 | 1.8 Mbps | 1.5 Mbps | 100 Mbps DIA | [OK] Adequate |
| Hyderabad | 200 | 40 | 3.6 Mbps | 3.1 Mbps | 200 Mbps DIA | [OK] Adequate |
| London | 520 | 104 | 9.2 Mbps | 8 Mbps | 1 Gbps DIA | [OK] Adequate |
| Frankfurt | 280 | 56 | 5 Mbps | 4.3 Mbps | 500 Mbps DIA | [OK] Adequate |
| New Jersey | 480 | 96 | 8.5 Mbps | 7.4 Mbps | 1 Gbps DIA | [OK] Adequate |
| Dallas | 270 | 54 | 4.8 Mbps | 4.2 Mbps | 500 Mbps DIA | [OK] Adequate |

**Additional Bandwidth Considerations:**

| Traffic Type | Per-Session BW | Notes |
|--------------|----------------|-------|
| Webex Meetings (Video HD) | 2.5 Mbps | 1080p send/receive |
| Webex Meetings (Video SD) | 1 Mbps | 720p send/receive |
| Screen Sharing | 0.5-2.5 Mbps | Variable based on content |
| Messaging/Presence | 50 kbps | Per user average |
| Software Updates | Varies | Schedule during off-hours |

### 1.4.2 Internet Connectivity Assessment

> **Reference:** This section builds on the existing Abhavtech SD-WAN deployment documented in *ABV-SDWAN-2024*. The SD-WAN fabric provides the underlying transport for Webex Calling traffic.

**Existing SD-WAN Fabric Overview:**

```
+-----------------------------------------------------------------------------+
|         ABHAVTECH SD-WAN FABRIC - WEBEX CALLING INTEGRATION                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|                      +--------------------------+                           |
|                      |   vManage / vBond        |                           |
|                      |   (Mumbai DC)            |                           |
|                      |   vmanage.abhavtech.com  |                           |
|                      +------------+-------------+                           |
|                                   |                                         |
|              +--------------------+--------------------+                   |
|              |                    |                    |                   |
|        +-----+-----+       +------+------+      +-----+-----+             |
|        |  Hub 1    |       |   Hub 2     |      |  Hub 3    |             |
|        |  Mumbai   |       |   London    |      |  Dallas   |             |
|        |  cEdge    |       |   cEdge     |      |  cEdge    |             |
|        +-----+-----+       +------+------+      +-----+-----+             |
|              |                    |                    |                   |
|     +--------+--------+    +------+------+      +-----+-----+             |
|     |        |        |    |             |      |           |             |
|   India    India    India  Frankfurt   New Jersey                         |
|   Sites    Sites    Sites  (Spoke)     (Spoke)                            |
|  (Spokes) (Spokes) (Spokes)                                               |
|                                                                             |
|   TRANSPORT: DIA (Primary) + MPLS (Secondary) + LTE (Tertiary)            |
|   OVERLAY: IPsec tunnels with BFD                                         |
|   ROUTING: OMP with hub preference                                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**SD-WAN Transport Circuits (Current State):**

| Site | cEdge Model | Transport 1 (DIA) | Transport 2 | Transport 3 (LTE) | SD-WAN Status |
|------|-------------|-------------------|-------------|-------------------|---------------|
| Mumbai HQ | C8300-2N2S-4T2X | Tata 1 Gbps | MPLS 500 Mbps | Jio LTE | [OK] Dual + LTE |
| Chennai | C8300-1N1S-4T2X | Airtel 500 Mbps | MPLS 200 Mbps | Airtel LTE | [OK] Dual + LTE |
| Bangalore | C8200-1N-4T | Jio 200 Mbps | - | Jio LTE | [OK] DIA + LTE |
| Delhi | C8200-1N-4T | Tata 200 Mbps | - | Airtel LTE | [OK] DIA + LTE |
| Noida | C8200-1N-4T | Airtel 100 Mbps | - | Jio LTE | [OK] DIA + LTE |
| Pune | C8200-1N-4T | Tata 100 Mbps | MPLS 50 Mbps | - | [OK] Dual |
| Hyderabad | C8200-1N-4T | Jio 200 Mbps | - | Airtel LTE | [OK] DIA + LTE |
| London | C8300-1N1S-4T2X | BT 1 Gbps | MPLS 500 Mbps | Vodafone LTE | [OK] Dual + LTE |
| Frankfurt | C8200-1N-4T | DT 500 Mbps | - | Vodafone LTE | [OK] DIA + LTE |
| New Jersey | C8300-1N1S-4T2X | AT&T 1 Gbps | MPLS 500 Mbps | Verizon LTE | [OK] Dual + LTE |
| Dallas | C8200-1N-4T | AT&T 500 Mbps | - | Verizon LTE | [OK] DIA + LTE |

**Webex Calling Traffic Path via SD-WAN:**

```
+-----------------------------------------------------------------------------+
|         WEBEX CALLING TRAFFIC FLOW - SD-WAN INTEGRATION                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +--------------+    +--------------+    +--------------+                  |
|  |  Webex App   |    |   SD-WAN     |    |   Webex      |                  |
|  |  or Phone    |--->|   cEdge      |--->|   Cloud      |                  |
|  |  (Endpoint)  |    |   (Site)     |    |   (Region)   |                  |
|  +--------------+    +--------------+    +--------------+                  |
|                             |                                               |
|                             v                                               |
|                      +--------------+                                       |
|                      |  SD-WAN      |                                       |
|                      |  Policy      |                                       |
|                      |  ============|                                       |
|                      |  App: Webex  |                                       |
|                      |  SLA: Voice  |                                       |
|                      |  Path: DIA   |                                       |
|                      |  (preferred) |                                       |
|                      +--------------+                                       |
|                                                                             |
|  SD-WAN APPLICATION-AWARE ROUTING FOR WEBEX:                               |
|  ---------------------------------------------                             |
|  * App Recognition: Deep packet inspection identifies Webex traffic        |
|  * SLA Class: Real-time voice/video (latency <150ms, jitter <30ms)        |
|  * Preferred Path: DIA (direct internet) for lowest latency               |
|  * Failover: Automatic to MPLS/LTE if DIA degrades                        |
|  * Cloud OnRamp: Direct path to Webex cloud (where available)             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**SD-WAN Readiness for Webex Calling:**

| Requirement | Current SD-WAN State | Action Required |
|-------------|---------------------|-----------------|
| Application Recognition | [OK] Webex app signatures loaded | Verify latest signature pack |
| SLA Class for Voice | [OK] Real-time SLA class exists | Map Webex to existing class |
| DIA Breakout | [OK] Local internet exit enabled | Confirm Webex URLs in policy |
| Cloud OnRamp for SaaS | [!]️ Not configured | Enable for Webex (optional) |
| BFD for Path Monitoring | [OK] Enabled on all tunnels | No change |
| Dual/Multi Transport | [OK] All sites have 2+ transports | No change |

**Latency to Webex Data Centers (Measured via SD-WAN):**

| Site | Webex DC | Measured Latency | Jitter | Packet Loss | Status |
|------|----------|------------------|--------|-------------|--------|
| Mumbai HQ | Mumbai + Chennai | 32ms | 4ms | 0.01% | [OK] Excellent |
| Chennai | Mumbai + Chennai | 38ms | 5ms | 0.02% | [OK] Excellent |
| Bangalore | Mumbai + Chennai | 35ms | 4ms | 0.01% | [OK] Excellent |
| Delhi | Mumbai + Chennai | 42ms | 6ms | 0.03% | [OK] Good |
| Noida | Mumbai + Chennai | 45ms | 7ms | 0.02% | [OK] Good |
| Pune | Mumbai + Chennai | 38ms | 5ms | 0.02% | [OK] Excellent |
| Hyderabad | Mumbai + Chennai | 36ms | 5ms | 0.01% | [OK] Excellent |
| London | London DC | 8ms | 2ms | 0.00% | [OK] Excellent |
| Frankfurt | Frankfurt DC | 5ms | 1ms | 0.00% | [OK] Excellent |
| New Jersey | US East DC | 12ms | 3ms | 0.01% | [OK] Excellent |
| Dallas | US DC | 18ms | 4ms | 0.01% | [OK] Excellent |

### 1.4.3 QoS Readiness

> **Reference:** QoS policies build on existing configurations from *ABV-SDWAN-2024* (WAN edge) and *ABV-SDA-ISE-2025* (campus/DNA Center). Webex Calling traffic leverages the established QoS framework.

**Existing QoS Architecture (SD-WAN + DNA Center):**

```
+-----------------------------------------------------------------------------+
|         ABHAVTECH QOS ARCHITECTURE - END-TO-END                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +-------------+    +-------------+    +-------------+    +-------------+  |
|  |  Endpoint   |--->|  Access     |--->|  SD-WAN     |--->|  Webex      |  |
|  |  (Phone/App)|    |  Switch     |    |  cEdge      |    |  Cloud      |  |
|  +-------------+    +-------------+    +-------------+    +-------------+  |
|        |                  |                  |                  |          |
|        v                  v                  v                  v          |
|   DSCP Marking      DNA Center         vManage            Cloud SLA       |
|   at Source         QoS Policy         App-Route          Monitoring      |
|   (Phone/App)       (Campus)           (WAN)                              |
|                                                                             |
|  LAYER              |  PLATFORM        |  POLICY SOURCE   |  MANAGEMENT   |
|  =======================================================================  |
|  Endpoint (L2)      |  Cisco Phones    |  Phone config    |  CUCM -> Webex |
|  Access Layer       |  Cat 9300/9200   |  DNA Center      |  DNAC 2.3.5   |
|  Distribution       |  Cat 9500        |  DNA Center      |  DNAC 2.3.5   |
|  WAN Edge           |  C8300/C8200     |  vManage         |  vManage 20.12|
|  Internet           |  ISP             |  Best Effort     |  N/A          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Current DNA Center QoS Policy (Campus - SD-Access):**

| Traffic Class | DSCP | Queue | BW Allocation | Applied To |
|---------------|------|-------|---------------|------------|
| Voice | EF (46) | Priority | 10% (strict) | Voice VLANs |
| Video Conferencing | AF41 (34) | Priority | 13% | Data VLANs |
| Voice Signaling | CS3 (24) | Assured | 2% | Voice VLANs |
| Interactive Video | AF42 (36) | Assured | 15% | Data VLANs |
| Network Control | CS6 (48) | Assured | 3% | Mgmt VLANs |
| Transactional Data | AF21 (18) | Assured | 10% | Data VLANs |
| Bulk Data | AF11 (10) | Assured | 4% | Data VLANs |
| Scavenger | CS1 (8) | Best Effort | 1% | All VLANs |
| Best Effort | BE (0) | Default | 25% | All VLANs |

**Current SD-WAN QoS Policy (vManage - Centralized):**

```
! Existing SD-WAN Application-Aware Routing Policy (vManage)
! Policy Name: ABV-SDWAN-QOS-POLICY

sdwan
 app-route-policy ABV-SDWAN-QOS-POLICY
  !
  vpn-list VPN-CORPORATE
   sequence 10
    match
     app-list REAL-TIME-VOICE
     dscp 46
    action
     sla-class VOICE-SLA strict
     cloud-saas
    !
   sequence 20
    match
     app-list REAL-TIME-VIDEO
     dscp 34 36
    action
     sla-class VIDEO-SLA strict
    !
   sequence 30
    match
     app-list VOICE-SIGNALING
     dscp 24
    action
     sla-class SIGNALING-SLA
    !
   sequence 100
    match
     app-list ALL
    action
     sla-class DEFAULT-SLA
    !
  !
 !
 sla-class VOICE-SLA
  latency 150
  loss 1
  jitter 30
 !
 sla-class VIDEO-SLA
  latency 200
  loss 2
  jitter 50
 !
!
```

**Webex Calling QoS Requirements vs Current State:**

| Traffic Type | Webex Required DSCP | Current DNA Center | Current SD-WAN | Status |
|--------------|---------------------|-------------------|----------------|--------|
| Media (Audio) | EF (46) | EF (46) - Voice | VOICE-SLA | [OK] Aligned |
| Media (Video) | AF41 (34) | AF41 (34) - Video | VIDEO-SLA | [OK] Aligned |
| Signaling | CS3 (24) | CS3 (24) - Signaling | SIGNALING-SLA | [OK] Aligned |
| App Sharing | AF41 (34) | AF41 (34) - Video | VIDEO-SLA | [OK] Aligned |

**QoS Update Requirements:**

| Component | Current State | Required Update | Action |
|-----------|--------------|-----------------|--------|
| DNA Center | Voice policy exists | Add Webex app recognition | Update Application Policy |
| SD-WAN vManage | Real-time SLA exists | Add Webex to REAL-TIME-VOICE list | Update App List |
| Access Switches | Trust DSCP enabled | No change | Verify only |
| Phones (MPP) | Will mark EF | No change | Automatic |
| Webex App | Marks DSCP natively | No change | Verify firewall preserves |

**DNA Center Application Policy Update for Webex:**

```
! DNA Center Application Policy Update
! Add Webex applications to existing Voice/Video business relevance groups

Application Policy: ABV-QUEUING-POLICY
+-- Business Relevant
|   +-- Voice (Existing)
|   |   +-- cisco-phone (existing)
|   |   +-- sip (existing)
|   |   +-- webex-calling [ADD]
|   |   +-- webex-voice [ADD]
|   |
|   +-- Video Conferencing (Existing)
|   |   +-- cisco-webex-meeting (existing)
|   |   +-- webex-video [ADD]
|   |   +-- webex-share [ADD]
|   |
|   +-- Signaling (Existing)
|       +-- sip-tls (existing)
|       +-- webex-signaling [ADD]
|
+-- Default (unchanged)

! Deploy to: All Sites via Fabric Provisioning
```

**SD-WAN Application List Update for Webex:**

```
! vManage - Update Application Lists for Webex Calling

policy
 app-list REAL-TIME-VOICE
  app cisco-phone
  app sip
  app webex           ! Existing
  app webex-calling   ! ADD - Webex Calling specific
  app webex-audio     ! ADD - Webex audio streams
 !
 app-list REAL-TIME-VIDEO
  app webex-video
  app webex-share
  app webex-meetings
 !
 app-list VOICE-SIGNALING
  app sip-tls
  app webex-signaling
 !
 !
 ! Cloud OnRamp for SaaS (Optional Enhancement)
 cloud-onramp saas
  app webex
   vpn 10
   gateway direct-internet
   probe-frequency 30
  !
 !
!
```

**QoS Validation Commands:**

```
! SD-WAN cEdge - Verify Webex traffic classification
show sdwan app-route stats | include webex
show sdwan policy app-route-policy-filter

! DNA Center managed switch - Verify QoS policy
show policy-map interface GigabitEthernet1/0/1
show class-map
show mls qos interface statistics

! Verify DSCP marking preservation
show ip access-list | include permit.*46
```

**QoS Readiness Summary:**

| Area | Status | Notes |
|------|--------|-------|
| Campus QoS (DNA Center) | [OK] Ready | Minor app recognition update needed |
| WAN QoS (SD-WAN) | [OK] Ready | Add Webex to existing SLA classes |
| Voice VLAN | [OK] Ready | Already configured for Cisco phones |
| DSCP Trust | [OK] Ready | Enabled on all access ports |
| Firewall DSCP | [!]️ Verify | Confirm DSCP preservation through firewalls |
| ISP SLA | [!]️ Best Effort | Internet transit is best effort (expected) |

---

