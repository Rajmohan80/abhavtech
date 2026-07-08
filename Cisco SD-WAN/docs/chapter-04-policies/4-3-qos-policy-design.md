# 4.3 QoS Policy Design

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.3 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section documents the Quality of Service (QoS) policy design for Abhavtech's SD-WAN deployment. The QoS framework ensures consistent application performance across all WAN transports through classification, marking, queuing, and shaping mechanisms.

### 1.1 QoS Architecture

```
+------------------------------------------------------------------+
|                    SD-WAN QoS ARCHITECTURE                        |
+------------------------------------------------------------------+
|                                                                   |
|  Ingress (LAN → WAN)                                              |
|  +----------------------------------------------------------+    |
|  |  1. Classification    2. Marking      3. Queuing         |    |
|  |  +----------------+  +-------------+  +---------------+  |    |
|  |  | NBAR2 / ACL    |->| DSCP Set    |->| 8 Queues      |  |    |
|  |  | Match criteria |  | Per class   |  | Per transport |  |    |
|  |  +----------------+  +-------------+  +---------------+  |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Egress (WAN → LAN)                                               |
|  +----------------------------------------------------------+    |
|  |  1. Rewrite       2. Schedule       3. Shape             |    |
|  |  +-------------+  +---------------+  +---------------+   |    |
|  |  | DSCP Trust  |->| CBWFQ + LLQ   |->| Interface     |   |    |
|  |  | or Remark   |  | Per class     |  | Shaper        |   |    |
|  |  +-------------+  +---------------+  +---------------+   |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 QoS Model Summary

| Component | Method | Configuration |
|-----------|--------|---------------|
| Classification | NBAR2, DSCP, ACL | Policy map |
| Marking | DSCP rewrite | Per-class |
| Queuing | 8 queues per interface | Template |
| Scheduling | CBWFQ + LLQ | Bandwidth % |
| Shaping | Per-interface | Circuit speed |

---

## 2. Traffic Classification

### 2.1 Traffic Class Definitions

```
+------------------------------------------------------------------+
|                    TRAFFIC CLASS MATRIX                           |
+------------------------------------------------------------------+
|                                                                   |
|  Class            | DSCP   | PHB  | % BW | Queue | Priority     |
|  -----------------+--------+------+------+-------+--------------|
|  Voice            | EF(46) | EF   | 10%  | LLQ   | Strict       |
|  Video-Realtime   | AF41   | AF41 | 20%  | Q1    | High         |
|  Video-Streaming  | AF31   | AF31 | 10%  | Q2    | Medium-High  |
|  Business-Critical| AF21   | AF21 | 20%  | Q3    | Medium       |
|  Signaling        | CS3    | CS3  | 5%   | Q4    | Medium       |
|  Transactional    | AF11   | AF11 | 15%  | Q5    | Low-Medium   |
|  Best-Effort      | DF(0)  | BE   | 15%  | Q6    | Low          |
|  Scavenger        | CS1    | CS1  | 5%   | Q7    | Lowest       |
|                                                                   |
|  Total: 100%                                                      |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 Classification Configuration

```
! Class Maps for Traffic Classification
class-map match-any CM-VOICE
 match dscp ef
 match protocol cisco-phone
 match protocol sip
 match protocol rtp audio

class-map match-any CM-VIDEO-REALTIME
 match dscp af41
 match protocol cisco-webex
 match protocol ms-teams
 match protocol zoom

class-map match-any CM-VIDEO-STREAMING
 match dscp af31
 match protocol youtube
 match protocol netflix
 match protocol vimeo

class-map match-any CM-BUSINESS-CRITICAL
 match dscp af21
 match protocol salesforce
 match protocol sap
 match protocol oracle-db

class-map match-any CM-SIGNALING
 match dscp cs3
 match protocol sip-tls
 match protocol h323

class-map match-any CM-TRANSACTIONAL
 match dscp af11
 match protocol http
 match protocol https
 match protocol ms-office-365

class-map match-any CM-SCAVENGER
 match dscp cs1
 match protocol bittorrent
 match protocol windows-update
!
```

---

## 3. DSCP Marking

### 3.1 Marking Policy

```
! QoS Marking Policy (Applied to Service VPN Interfaces)
policy-map PM-QOS-MARKING
 class CM-VOICE
  set dscp ef
 class CM-VIDEO-REALTIME
  set dscp af41
 class CM-VIDEO-STREAMING
  set dscp af31
 class CM-BUSINESS-CRITICAL
  set dscp af21
 class CM-SIGNALING
  set dscp cs3
 class CM-TRANSACTIONAL
  set dscp af11
 class CM-SCAVENGER
  set dscp cs1
 class class-default
  set dscp default
!

! Apply to LAN interface
interface GigabitEthernet0/0/1
 description "LAN - Service VPN 10"
 service-policy input PM-QOS-MARKING
!
```

### 3.2 DSCP Preservation

```
+------------------------------------------------------------------+
|                    DSCP PRESERVATION                              |
+------------------------------------------------------------------+
|                                                                   |
|  Traffic Flow with DSCP:                                          |
|                                                                   |
|  LAN Side          IPsec Tunnel        WAN Side                   |
|  +--------+       +------------+       +--------+                 |
|  | Packet |       | Outer: EF  |       | Packet |                 |
|  | DSCP:EF|------>| Inner: EF  |------>| DSCP:EF|                 |
|  +--------+       +------------+       +--------+                 |
|                                                                   |
|  Configuration:                                                   |
|  - Copy inner DSCP to outer header                               |
|  - Preserve DSCP across tunnel                                   |
|  - Trust DSCP on LAN interfaces                                  |
|                                                                   |
+------------------------------------------------------------------+

! DSCP Copy Configuration
sdwan
 interface GigabitEthernet0/0/0
  tunnel-interface
   color mpls
   qos-map
    dscp-policy COPY-INNER-TO-OUTER
!
```

---

## 4. Queuing and Scheduling

### 4.1 Queue Structure

```
+------------------------------------------------------------------+
|                    8-QUEUE MODEL                                  |
+------------------------------------------------------------------+
|                                                                   |
|  Queue    | Type  | BW %  | DSCP        | Application           |
|  ---------+-------+-------+-------------+-----------------------|
|  LLQ      | LLQ   | 10%   | EF          | Voice                 |
|  Queue 1  | CBWFQ | 20%   | AF41        | Video Realtime        |
|  Queue 2  | CBWFQ | 10%   | AF31        | Video Streaming       |
|  Queue 3  | CBWFQ | 20%   | AF21        | Business Critical     |
|  Queue 4  | CBWFQ | 5%    | CS3         | Signaling             |
|  Queue 5  | CBWFQ | 15%   | AF11        | Transactional         |
|  Queue 6  | CBWFQ | 15%   | DF(0)       | Best Effort           |
|  Queue 7  | CBWFQ | 5%    | CS1         | Scavenger             |
|                                                                   |
|  Scheduling: Strict Priority for LLQ, then weighted round-robin  |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.2 Queuing Configuration

```
! QoS Scheduling Policy (Applied to WAN Interfaces)
policy-map PM-QOS-SCHEDULING
 class CM-VOICE
  priority percent 10
 class CM-VIDEO-REALTIME
  bandwidth percent 20
  random-detect dscp-based
 class CM-VIDEO-STREAMING
  bandwidth percent 10
  random-detect dscp-based
 class CM-BUSINESS-CRITICAL
  bandwidth percent 20
  random-detect dscp-based
 class CM-SIGNALING
  bandwidth percent 5
  queue-limit 64 packets
 class CM-TRANSACTIONAL
  bandwidth percent 15
  random-detect dscp-based
 class CM-SCAVENGER
  bandwidth percent 5
  random-detect dscp-based
 class class-default
  bandwidth percent 15
  random-detect
!

! Apply to WAN interface
interface GigabitEthernet0/0/0
 description "WAN - MPLS Transport"
 service-policy output PM-QOS-SCHEDULING
!
```

---

## 5. Traffic Shaping

### 5.1 Interface Shaping

```
+------------------------------------------------------------------+
|                    TRAFFIC SHAPING                                |
+------------------------------------------------------------------+
|                                                                   |
|  Site          | Transport  | Circuit BW | Shape Rate | Buffer   |
|  ---------------+-----------+------------+------------+----------|
|  Mumbai DC     | MPLS       | 1 Gbps     | 950 Mbps   | 250 ms   |
|  Mumbai DC     | Internet   | 500 Mbps   | 480 Mbps   | 250 ms   |
|  Chennai DR    | MPLS       | 500 Mbps   | 480 Mbps   | 250 ms   |
|  Bangalore     | MPLS       | 100 Mbps   | 95 Mbps    | 250 ms   |
|  Bangalore     | Internet   | 100 Mbps   | 95 Mbps    | 250 ms   |
|  London        | MPLS       | 200 Mbps   | 190 Mbps   | 250 ms   |
|  New Jersey    | MPLS       | 200 Mbps   | 190 Mbps   | 250 ms   |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 Shaping Configuration

```
! Hierarchical QoS with Shaping
policy-map PM-WAN-SHAPER
 class class-default
  shape average 950000000
  service-policy PM-QOS-SCHEDULING
!

! Apply to WAN interface
interface GigabitEthernet0/0/0
 description "WAN - MPLS 1G"
 service-policy output PM-WAN-SHAPER
!

! Per-Tunnel Shaping (vManage Template)
! Configured via Feature Template:
! - Shaper Rate: Match circuit speed
! - Per-tunnel QoS: Enabled
! - Adapt QoS: Enabled (for bandwidth changes)
```

---

## 6. Policing

### 6.1 Ingress Policing

```
! Police specific traffic classes
policy-map PM-INGRESS-POLICE
 class CM-VIDEO-STREAMING
  police rate 50000000 burst 1500000 peak-rate 75000000 peak-burst 2000000
   conform-action transmit
   exceed-action set-dscp-transmit af32
   violate-action drop
 class CM-SCAVENGER
  police rate 10000000 burst 500000
   conform-action transmit
   exceed-action drop
 class class-default
  police rate 100000000 burst 3000000
   conform-action transmit
   exceed-action set-dscp-transmit default
!
```

### 6.2 Per-Application Rate Limiting

```
! Rate limit specific applications
policy-map PM-APP-RATE-LIMIT
 class CM-YOUTUBE
  police rate 25000000
   conform-action transmit
   exceed-action drop
 class CM-SOCIAL-MEDIA
  police rate 10000000
   conform-action transmit
   exceed-action drop
!
```

---

## 7. SD-WAN QoS Templates

### 7.1 vManage QoS Configuration

```
! SD-WAN Manager QoS Policy Template
policy
 qos-map QOS-POLICY-ABHAV
  qos-scheduler VOICE-QUEUE
   class EF
   bandwidth 10
   scheduling llq
   drops tail-drop
  !
  qos-scheduler VIDEO-RT-QUEUE
   class AF41
   bandwidth 20
   scheduling wrr
   drops red-drop
  !
  qos-scheduler VIDEO-STREAM-QUEUE
   class AF31
   bandwidth 10
   scheduling wrr
   drops red-drop
  !
  qos-scheduler BUSINESS-CRIT-QUEUE
   class AF21
   bandwidth 20
   scheduling wrr
   drops red-drop
  !
  qos-scheduler SIGNALING-QUEUE
   class CS3
   bandwidth 5
   scheduling wrr
   drops tail-drop
  !
  qos-scheduler TRANSACTION-QUEUE
   class AF11
   bandwidth 15
   scheduling wrr
   drops red-drop
  !
  qos-scheduler BEST-EFFORT-QUEUE
   class default
   bandwidth 15
   scheduling wrr
   drops red-drop
  !
  qos-scheduler SCAVENGER-QUEUE
   class CS1
   bandwidth 5
   scheduling wrr
   drops red-drop
  !
 !
!
```

### 7.2 Adaptive QoS

```
+------------------------------------------------------------------+
|                    ADAPTIVE QOS                                   |
+------------------------------------------------------------------+
|                                                                   |
|  Feature: Automatically adjusts QoS based on path conditions      |
|                                                                   |
|  Scenario 1: Full Bandwidth Available                             |
|  +----------------------------------------------------------+    |
|  | Voice: 10% of 100 Mbps = 10 Mbps                          |   |
|  | Video: 20% of 100 Mbps = 20 Mbps                          |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Scenario 2: Path Degraded (50 Mbps available)                    |
|  +----------------------------------------------------------+    |
|  | Voice: 10% of 50 Mbps = 5 Mbps (LLQ maintained)           |   |
|  | Video: 20% of 50 Mbps = 10 Mbps (proportional)            |   |
|  | Scavenger: Heavily throttled                              |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+

! Enable Adaptive QoS
sdwan
 interface GigabitEthernet0/0/0
  tunnel-interface
   adapt-qos
!
```

---

## 8. QoS Verification

### 8.1 Verification Commands

```
! Verify QoS policy application
show policy-map interface GigabitEthernet0/0/0

! Verify queue statistics
show sdwan policy qos-scheduler-info

! Verify class drops
show policy-map interface GigabitEthernet0/0/0 class CM-VOICE

! Verify DSCP marking
show class-map

! Real-time QoS statistics
show sdwan tunnel statistics

! Per-application QoS
show sdwan app-route statistics
```

### 8.2 QoS Monitoring Dashboard

```
+------------------------------------------------------------------+
|                    QOS MONITORING DASHBOARD                       |
+------------------------------------------------------------------+
|                                                                   |
|  Queue Statistics (Mumbai DC - MPLS):                             |
|  +----------------------------------------------------------+    |
|  | Queue      | Packets In | Packets Out | Drops   | % Drop |    |
|  +----------------------------------------------------------+    |
|  | Voice LLQ  | 1,245,678  | 1,245,678   | 0       | 0.00%  |    |
|  | Video RT   | 5,678,901  | 5,650,234   | 28,667  | 0.50%  |    |
|  | Business   | 8,901,234  | 8,876,543   | 24,691  | 0.28%  |    |
|  | Best Effort| 12,345,678 | 11,987,654  | 358,024 | 2.90%  |    |
|  | Scavenger  | 2,345,678  | 2,100,123   | 245,555 | 10.5%  |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  DSCP Distribution:                                               |
|  EF:   ████░░░░░░ 12%                                            |
|  AF41: ██████████ 25%                                            |
|  AF21: ████████░░ 20%                                            |
|  DF:   ██████████████████████ 43%                                |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 9. Best Practices Summary

### 9.1 Classification Best Practices

- Use NBAR2 for application-based classification
- Trust DSCP from known endpoints (IP phones, video)
- Re-mark untrusted traffic at network edge
- Document classification criteria

### 9.2 Queuing Best Practices

- Reserve LLQ bandwidth for voice (<= 33% of link)
- Use WRED for TCP-based applications
- Size queues appropriately for latency requirements
- Monitor queue depths regularly

### 9.3 Shaping Best Practices

- Shape to 95% of circuit speed to avoid ISP drops
- Enable adaptive QoS for dynamic environments
- Test failover scenarios with reduced bandwidth
- Coordinate with ISP QoS policies

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco SD-WAN QoS Guide | Official QoS documentation | cisco.com |
| Enterprise QoS Design | QoS best practices | cisco.com |
| Abhavtech QoS Standards | Internal QoS requirements | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-POL-4.3*
