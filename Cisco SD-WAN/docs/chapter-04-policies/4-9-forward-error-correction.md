# 4.9 Forward Error Correction (FEC)

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.9 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

Forward Error Correction (FEC) and Packet Duplication are techniques used in Cisco Catalyst SD-WAN to mitigate packet loss on unreliable WAN links. This section defines Abhavtech's FEC strategy for protecting real-time and business-critical traffic.

### 1.1 FEC Architecture Overview

```
+------------------------------------------------------------------+
|                 FEC & PACKET DUPLICATION                          |
+------------------------------------------------------------------+
|                                                                   |
|  Forward Error Correction (FEC):                                  |
|  +----------------------------------------------------------+    |
|  | Original Packets:  [P1] [P2] [P3] [P4]                    |    |
|  | FEC Encoded:       [P1] [P2] [P3] [P4] [FEC1] [FEC2]      |    |
|  |                                                           |    |
|  | If P2 lost:        [P1] [X ] [P3] [P4] [FEC1] [FEC2]      |    |
|  | Recovered:         [P1] [P2] [P3] [P4] (reconstructed)    |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Packet Duplication:                                              |
|  +----------------------------------------------------------+    |
|  | Original:    [P1]---> Path A --->[P1]                     |    |
|  |              [P1]---> Path B --->[P1]                     |    |
|  |                                                           |    |
|  | Receiver: First copy wins, duplicates discarded           |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 2. FEC Fundamentals

### 2.1 FEC vs Packet Duplication

| Feature | FEC | Packet Duplication |
|---------|-----|-------------------|
| Mechanism | Add parity packets | Send copies on multiple paths |
| Bandwidth Overhead | 10-30% | 100% (full duplication) |
| Loss Recovery | Up to FEC threshold | Any single path loss |
| Latency Impact | Minimal | Path difference latency |
| Use Case | Moderate loss circuits | Critical real-time traffic |
| Path Requirement | Single path | Multiple diverse paths |

### 2.2 When to Use Each

| Scenario | Recommended | Reason |
|----------|-------------|--------|
| Voice over Internet | FEC | Lower overhead |
| Video conferencing | FEC | Burst loss recovery |
| Executive calls | Duplication | Zero tolerance |
| Trading applications | Duplication | Mission-critical |
| General business | FEC | Cost-effective |

---

## 3. FEC Configuration

### 3.1 FEC Policy Configuration

```
! App-Route Policy with FEC
policy
 app-route-policy _ABHAVTECH-FEC-POLICY_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list VOICE-APPS
    action
     sla-class REALTIME
     preferred-color mpls biz-internet
     loss-correction fec-always
    !
   !
   sequence 20
    match
     app-list VIDEO-APPS
    action
     sla-class REALTIME
     preferred-color mpls biz-internet
     loss-correction fec-adaptive
    !
   !
  !
```

### 3.2 FEC Modes

| Mode | Description | Trigger | Bandwidth |
|------|-------------|---------|-----------|
| fec-always | FEC always enabled | Constant | 10-30% overhead |
| fec-adaptive | FEC on loss detection | Loss > threshold | Variable |

### 3.3 FEC Parameters

```
! FEC algorithm selection
! Default: XOR-based, lightweight
! Advanced: Reed-Solomon for higher loss tolerance

! Configure FEC threshold for adaptive mode
policy
 app-route-policy _FEC-ADAPTIVE_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list VOICE-APPS
    action
     loss-correction fec-adaptive
     ! FEC activates when loss > 1%
    !
   !
```

---

## 4. Packet Duplication Configuration

### 4.1 Packet Duplication Policy

```
! App-Route Policy with Packet Duplication
policy
 app-route-policy _ABHAVTECH-DUPLICATION_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list EXECUTIVE-CALLS
    action
     sla-class REALTIME
     preferred-color mpls biz-internet
     loss-correction packet-duplication
    !
   !
  !
```

### 4.2 Duplication Requirements

```
+------------------------------------------------------------------+
|              PACKET DUPLICATION REQUIREMENTS                      |
+------------------------------------------------------------------+
|                                                                   |
|  Source WAN Edge                      Dest WAN Edge               |
|  +------------------+                +------------------+         |
|  |                  |    Path A      |                  |         |
|  | [P1] -----+------|----------------|---+              |         |
|  |           |      |    (MPLS)      |   +----> [P1]    |         |
|  |           +------|----------------|---+              |         |
|  |                  |    Path B      |   (First wins)   |         |
|  |                  |  (Internet)    |                  |         |
|  +------------------+                +------------------+         |
|                                                                   |
|  Requirements:                                                    |
|  - At least 2 diverse paths                                       |
|  - Both paths must meet basic connectivity                        |
|  - Receiver handles de-duplication                                |
+------------------------------------------------------------------+
```

---

## 5. Application-Specific FEC

### 5.1 Voice Traffic FEC

```
policy
 app-route-policy _VOICE-FEC_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list VOICE-APPS
    action
     sla-class REALTIME
     preferred-color mpls
     backup-sla-class REALTIME
     loss-correction fec-adaptive
    !
   !
  !
!
policy
 lists
  app-list VOICE-APPS
   app rtp audio
   app sip
   app cisco-phone
   app skinny
  !
```

### 5.2 Video Conferencing FEC

```
policy
 app-route-policy _VIDEO-FEC_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list VIDEO-APPS
    action
     sla-class REALTIME
     preferred-color mpls biz-internet
     loss-correction fec-always  ! Video needs constant FEC
    !
   !
  !
!
policy
 lists
  app-list VIDEO-APPS
   app webex-meeting
   app ms-teams
   app zoom
   app rtp video
  !
```

### 5.3 Critical Business Applications

```
policy
 app-route-policy _CRITICAL-APPS-FEC_
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list TRADING-APPS
    action
     sla-class BUSINESS-CRITICAL
     preferred-color mpls
     loss-correction packet-duplication  ! Zero tolerance
    !
   !
   sequence 20
    match
     app-list DATABASE-REPLICATION
    action
     sla-class BUSINESS-CRITICAL
     preferred-color mpls
     loss-correction fec-always
    !
   !
  !
```

---

## 6. Per-VPN FEC Strategy

### 6.1 VPN 10 - Employee

| Traffic Type | FEC Mode | Bandwidth Impact |
|--------------|----------|------------------|
| Voice | fec-adaptive | ~15% when active |
| Video | fec-always | ~20% constant |
| Business Apps | None | 0% |
| General | None | 0% |

### 6.2 VPN 40 - Voice

```
policy
 app-route-policy _VPN40-VOICE-FEC_
  vpn-list VPN-40-VOICE
   sequence 10
    match
     source-ip 0.0.0.0/0
    action
     sla-class REALTIME strict
     preferred-color mpls
     loss-correction fec-adaptive
    !
   !
  !
```

### 6.3 VPN 100 - PCI

```
! PCI uses packet duplication for critical transactions
policy
 app-route-policy _VPN100-PCI-FEC_
  vpn-list VPN-100-PCI
   sequence 10
    match
     destination-port 443 1433
    action
     sla-class BUSINESS-CRITICAL
     preferred-color mpls
     loss-correction packet-duplication
    !
   !
  !
```

---

## 7. FEC Bandwidth Planning

### 7.1 Bandwidth Overhead Calculation

| FEC Mode | Overhead | Example (100 Mbps base) |
|----------|----------|------------------------|
| None | 0% | 100 Mbps |
| fec-adaptive (inactive) | 0% | 100 Mbps |
| fec-adaptive (active) | 15-25% | 115-125 Mbps |
| fec-always | 20-30% | 120-130 Mbps |
| packet-duplication | 100% | 200 Mbps |

### 7.2 Abhavtech Bandwidth Planning

| Site | Base BW | Voice FEC | Video FEC | Total Needed |
|------|---------|-----------|-----------|--------------|
| Mumbai Hub | 1 Gbps | 20 Mbps | 100 Mbps | 1.12 Gbps |
| Chennai Hub | 500 Mbps | 15 Mbps | 75 Mbps | 590 Mbps |
| Bangalore | 200 Mbps | 10 Mbps | 30 Mbps | 240 Mbps |
| Remote Sites | 100 Mbps | 5 Mbps | 15 Mbps | 120 Mbps |

---

## 8. Monitoring and Verification

### 8.1 Verification Commands

```
! Check FEC status
show sdwan app-route fec

! View FEC statistics
show sdwan app-route statistics
show sdwan app-route fec statistics

! Check packet duplication status
show sdwan app-route packet-duplication

! View per-tunnel FEC counters
show sdwan bfd sessions
show sdwan tunnel statistics

! Sample output:
! TUNNEL            FEC-TX    FEC-RX    RECOVERED
! MPLS-Mumbai       12,345    10,234    1,234
! Internet-Mumbai   15,678    14,567    2,345
```

### 8.2 FEC Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| FEC TX Packets | Parity packets sent | Info only |
| FEC RX Packets | Parity packets received | Info only |
| Recovered Packets | Packets reconstructed | >5% of total |
| Duplication TX | Duplicate packets sent | Info only |
| De-dup Discards | Duplicates discarded | Info only |

---

## 9. Best Practices

### 9.1 FEC Guidelines

| Guideline | Recommendation |
|-----------|----------------|
| Use Adaptive | For most scenarios |
| Use Always | For constant loss circuits |
| Use Duplication | Only for zero-tolerance apps |
| Monitor Overhead | Track bandwidth consumption |
| Tune Thresholds | Adjust based on baseline loss |

### 9.2 Performance Considerations

| Consideration | Impact | Mitigation |
|---------------|--------|------------|
| CPU Usage | FEC encoding overhead | Use hardware acceleration |
| Bandwidth | 10-100% overhead | Plan capacity accordingly |
| Latency | Slight increase for FEC | Minimal, acceptable for RT |

---

## 10. Summary

| Element | Abhavtech Configuration |
|---------|------------------------|
| Voice FEC | Adaptive mode |
| Video FEC | Always mode |
| Critical Apps | Packet duplication |
| VPN 40 (Voice) | Adaptive FEC |
| VPN 100 (PCI) | Packet duplication |
| Bandwidth Planning | 20% headroom for FEC |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Next Review: March 2026*
