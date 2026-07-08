# DNS & Network Architecture

This chapter covers DNS configuration, network requirements, QoS policies, firewall rules, and edge architecture for Webex Calling and Contact Center.

## Chapter Overview

### Sections

**[5.1 DNS Configuration ->](dns-configuration.md)**  
Complete DNS and network architecture including DNS requirements, network bandwidth calculations, QoS policies, firewall rules, edge/zone architecture, and troubleshooting

**[5.2 Network Requirements ->](network-requirements.md)**  
Bandwidth calculations per site, WAN optimization, SD-WAN integration, MPLS vs Internet transport

**[5.3 QoS & Bandwidth ->](qos-bandwidth.md)**  
Traffic marking (DSCP), queue prioritization, bandwidth reservation, WAN QoS policies

**[5.4 Firewall Rules ->](firewall-rules.md)**  
Required ports and protocols, IP address ranges, NAT configuration, security policies

**[5.5 Edge Architecture ->](edge-architecture.md)**  
Network edge design, public IP allocation, SIP ALG disable, session border controller requirements

**[5.6 Zone Configuration ->](zone-configuration.md)**  
Webex Zone deployment (India), Trusted Network Edge configuration, SIP trunk setup, trunk groups

**[5.7 Troubleshooting ->](troubleshooting.md)**  
Network connectivity tests, SIP trunk diagnostics, media path verification, latency/jitter analysis

---

## Network Requirements Overview

### Bandwidth per Site

| Site Type | Users | Calls (Busy Hour) | Bandwidth Required |
|-----------|-------|-------------------|-------------------|
| **Large Hub** | 1,000+ | 200+ | 10 Mbps (signaling + media) |
| **Regional Hub** | 300-1,000 | 60-200 | 5 Mbps |
| **Branch** | <300 | <60 | 2 Mbps |
| **Remote/WFH** | Individual | 1-2 | 100 Kbps per user |

### Port Requirements

| Service | Protocol | Ports | Direction |
|---------|----------|-------|-----------|
| **SIP Signaling** | TCP/TLS | 5060-5061 | Outbound |
| **Media (RTP)** | UDP | 8000-12000 | Bidirectional |
| **HTTPS (Control Hub)** | TCP | 443 | Outbound |
| **STUN/TURN** | UDP | 3478 | Outbound |

---

## DNS Configuration

### Required DNS Records

**Public DNS (External)**:
```
; Webex Calling - SIP Federation
_sipfederationtls._tcp.abhavtech.com.    SRV 0 0 5061 sipdir.online.lync.com.

; Webex Meetings - Not part of this migration but often co-deployed
_sip._tls.abhavtech.com.                 SRV 0 0 443 sipdir.online.lync.com.
```

**Internal DNS (Split-brain for on-premises devices)**:
```
; Webex Edge for Devices (if deployed)
edge-device.abhavtech.com.               A    <edge-IP-address>
```

---

## QoS Policy

### DSCP Marking

| Traffic Type | DSCP | CoS | Queue | Description |
|--------------|------|-----|-------|-------------|
| **Voice (RTP)** | EF (46) | 5 | Priority | Real-time voice media |
| **SIP Signaling** | CS3 (24) | 3 | Control | Call setup/teardown |
| **Video** | AF41 (34) | 4 | Real-time | Video conferencing |
| **Best Effort** | 0 | 0 | Default | All other traffic |

### WAN QoS Configuration

```
! Priority Queue for Voice
policy-map WAN-OUT
 class VOICE-MEDIA
  priority percent 33
  set dscp ef
 class SIP-SIGNALING
  bandwidth percent 5
  set dscp cs3
 class class-default
  fair-queue
```

---

## Firewall Configuration

### Webex Calling IP Ranges

**APAC (Mumbai + Chennai DCs)**:
- Signaling: 202.177.192.0/19
- Media: 210.4.192.0/20

**UK (London)**:
- Signaling: 185.115.196.0/22
- Media: 62.109.192.0/18

**EU (Frankfurt)**:
- Signaling: 64.68.96.0/19
- Media: 170.133.128.0/18

**Americas (US)**:
- Signaling: 64.68.96.0/19
- Media: 170.133.128.0/18

!!! note "Dynamic IP Ranges"
    Webex IP ranges are subject to change. Always verify current ranges at: https://help.webex.com/article/b2exve

---

## Edge & Zone Architecture

### India Zone Deployment

**Required for**: Geographic DIDs (toll bypass compliance)

```
+-------------------------------------------------------------+
|              INDIA ZONE/EDGE ARCHITECTURE                    |
+-------------------------------------------------------------+
|                                                             |
|  +--------------+                      +--------------+    |
|  |  Webex Edge  |                      |  Local Gateway|    |
|  |   (DMZ)      |<-------------------->|   (PSTN)     |    |
|  +------+-------+                      +------+-------+    |
|         |                                     |            |
|         | SIP Trunk                           | SIP Trunk  |
|         v                                     v            |
|  +--------------+                      +--------------+    |
|  |  Webex Zone  |                      | Tata/Airtel  |    |
|  | (Enterprise) |                      |  SIP Trunks  |    |
|  +--------------+                      +--------------+    |
|                                                             |
+-------------------------------------------------------------+
```

**Components**:
- **Webex Zone**: On-premises signaling gateway
- **Trusted Network Edge**: Public IP for PSTN connectivity
- **Local Gateway**: ISR 4K series router with CUBE

---

## Network Validation

Before go-live:

- [ ] DNS records created and validated
- [ ] Bandwidth capacity confirmed per site
- [ ] QoS policies configured on WAN
- [ ] Firewall rules implemented
- [ ] Zone/Edge deployed (India sites)
- [ ] Network connectivity tests passed

---

## Next Steps

1. Review [Implementation](../chapter6-implementation/README.md) for deployment procedures
2. Review **Appendix F** for DNS record templates
3. Review **Appendix G** for firewall rule templates
