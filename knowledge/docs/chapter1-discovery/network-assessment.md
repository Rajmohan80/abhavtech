# Network Assessment

## Overview

Network readiness is **critical** for cloud contact center performance and quality of service. A thorough network assessment ensures your infrastructure can support high-quality voice and data traffic to the Cisco Webex Cloud Contact Center.

Poor network performance directly impacts customer experience, agent productivity, and overall migration success.

## Why Network Assessment Matters

**Impact on Contact Center Performance:**

| Network Issue | Impact on WxCC | Business Consequence |
|---------------|----------------|---------------------|
| High Latency (>80ms RTD) | Poor voice quality, choppy audio | Customer frustration, repeat calls |
| Packet Loss (>1%) | Audio dropouts, one-way audio | Failed interactions, escalations |
| Insufficient Bandwidth | Call failures, degraded quality | Lost revenue, poor CSAT |
| Jitter (>30ms) | Inconsistent audio quality | Agent fatigue, longer handle times |
| Network Congestion | Unpredictable performance | Service level failures |

## Cisco Webex Network Requirements

### Minimum Requirements

**Voice Quality Targets:**
- **Round-Trip Delay (RTD):** ≤ 80ms for optimal voice quality
- **Packet Loss:** ≤ 1% for acceptable quality
- **Jitter:** ≤ 30ms for stable audio
- **Bandwidth per Agent:** 100 kbps (voice) + 50 kbps (signaling)

**Network Connectivity:**
- Reliable internet connectivity with redundancy
- Quality of Service (QoS) configured for voice traffic
- Firewall rules allowing Webex traffic
- DNS resolution for Webex services

**Supported Protocols:**
- SIP (Session Initiation Protocol) for voice signaling
- RTP/SRTP (Real-time Transport Protocol) for media
- HTTPS for control and management traffic

### Bandwidth Calculation

**Per Agent Bandwidth:**
- Voice codec (G.711): ~100 kbps
- Signaling: ~50 kbps
- Agent desktop application: ~50 kbps
- **Total per agent:** ~200 kbps

**Total Contact Center Bandwidth:**

```
Formula: (Number of Concurrent Agents × 200 kbps) + 20% overhead

Example: 100 concurrent agents
= (100 × 200 kbps) + 20%
= 20 Mbps + 4 Mbps
= 24 Mbps total bandwidth required
```

**Additional Considerations:**
- Peak concurrent agent count (not total agents)
- Add bandwidth for supervisor monitoring
- Include bandwidth for quality monitoring and recording
- Account for other business applications sharing the circuit

## Network Assessment Activities

### 1. Current State Documentation

**Network Topology:**
- Document WAN architecture and circuit types
- Identify Internet Service Providers (ISPs) and circuits
- Map data center and branch office connectivity
- Note redundancy and failover configurations

**Current Bandwidth Utilization:**
- Measure current bandwidth consumption
- Identify peak usage periods
- Calculate available headroom for WxCC
- Document Quality of Service (QoS) policies

**Network Equipment Inventory:**

| Device Type | Location | Model | Capacity | Age | Replacement Needed? |
|-------------|----------|-------|----------|-----|---------------------|
| Router | HQ | [Model] | [Capacity] | [Years] | Yes/No |
| Firewall | HQ | [Model] | [Capacity] | [Years] | Yes/No |
| Switch | Branch 1 | [Model] | [Capacity] | [Years] | Yes/No |
| SBC | Data Center | [Model] | [Capacity] | [Years] | Yes/No |

### 2. Network Performance Testing

**Test Locations:**
- Data center/main office
- All branch offices with agents
- Remote/home office locations
- Backup/disaster recovery sites

**Key Metrics to Test:**

**Latency (Round-Trip Delay):**
- Use ping tests to Webex data centers
- Test during peak and off-peak hours
- Measure over multiple days
- Target: ≤80ms for voice quality

**Packet Loss:**
- Use continuous ping with large sample size
- Test sustained periods (30+ minutes)
- Measure during peak business hours
- Target: ≤1% packet loss

**Jitter:**
- Measure variation in packet arrival times
- Test with voice-sized packets (160 bytes)
- Document worst-case jitter values
- Target: ≤30ms jitter

**Bandwidth:**
- Test available bandwidth using tools like Speedtest
- Measure upload and download speeds
- Test during peak usage periods
- Verify sufficient headroom for WxCC

### 3. Testing Tools & Methods

**Recommended Tools:**

| Tool | Purpose | Usage |
|------|---------|-------|
| **Cisco RWAN** | Webex readiness testing | Automated assessment for Webex connectivity |
| **iPerf3** | Bandwidth testing | Measure throughput between sites |
| **PingPlotter** | Latency and packet loss | Visual analysis of network path |
| **Wireshark** | Packet analysis | Troubleshoot specific issues |
| **Speedtest CLI** | Quick bandwidth check | Verify ISP speeds |

**Testing Methodology:**

1. **Baseline Testing** (1 week)
   - Test all locations during business hours
   - Capture performance during peak periods
   - Document normal traffic patterns

2. **Stress Testing**
   - Simulate WxCC traffic load
   - Test with expected agent count
   - Verify QoS prioritization works

3. **Failover Testing**
   - Test backup circuits and redundancy
   - Verify automatic failover works
   - Measure failover time

4. **Geographic Testing**
   - Test from different regions
   - Measure latency to nearest Webex data centers
   - Identify optimal routing paths

### 4. Firewall & Security Assessment

**Required Firewall Rules:**

Configure firewall to allow outbound traffic to Webex:

| Protocol | Port | Direction | Purpose | Webex Domain/IP |
|----------|------|-----------|---------|-----------------|
| HTTPS | 443 | Outbound | Control Hub, APIs | *.webex.com |
| SIP/TLS | 5061 | Outbound | Voice signaling | *.broadcloudpbx.net |
| RTP/SRTP | 8000-65535 UDP | Outbound | Voice media | Webex media IPs |
| WebSocket | 443 | Outbound | Real-time events | *.webex.com |

**Security Considerations:**
- Enable SIP ALG bypass (often causes issues)
- Configure proper NAT traversal
- Whitelist Webex IP ranges
- Implement certificate trust for Webex domains

**Inspection Policies:**
- Disable deep packet inspection for voice traffic
- Configure SSL/TLS inspection exceptions
- Ensure firewall rules don't introduce latency

### 5. Quality of Service (QoS) Configuration

**QoS Requirements:**

Voice traffic must be prioritized over other traffic to ensure quality.

**Recommended QoS Configuration:**

| Traffic Type | DSCP Marking | Priority | Bandwidth % |
|--------------|-------------|----------|-------------|
| Voice (RTP) | EF (46) | Highest | 30-40% |
| SIP Signaling | CS3 (24) | High | 5% |
| Agent Desktop | AF21 (18) | Medium | 10% |
| Best Effort | 0 | Normal | Remaining |

**QoS Implementation Steps:**
1. Classify WxCC traffic (voice, signaling, data)
2. Mark packets with appropriate DSCP values
3. Configure priority queuing on routers and switches
4. Allocate bandwidth guarantees for voice traffic
5. Test QoS effectiveness under load

**Validation:**
- Verify markings are preserved end-to-end
- Test voice quality during network congestion
- Monitor queue depths and drops

## Network Upgrade Recommendations

### Infrastructure Upgrades

Based on assessment results, potential upgrades may include:

**1. Circuit Upgrades**

| Current Circuit | Bandwidth | Issue | Recommended Upgrade | Estimated Cost |
|-----------------|-----------|-------|---------------------|----------------|
| MPLS Circuit 1 | 50 Mbps | Insufficient for 100 agents | Upgrade to 100 Mbps | $XXX/month |
| Internet Circuit | 20 Mbps | High latency | Add secondary ISP | $XXX/month |
| Branch Circuit | 10 Mbps | Packet loss during peaks | Upgrade to 25 Mbps | $XXX/month |

**2. Hardware Upgrades**

**Routers:**
- Replace legacy routers lacking QoS capabilities
- Ensure routers support required throughput
- Enable advanced features (SD-WAN, dynamic QoS)

**Firewalls:**
- Upgrade if unable to handle inspection throughput
- Ensure modern SIP/RTP support
- Verify SSL/TLS inspection capabilities

**Switches:**
- Replace switches without QoS support
- Ensure adequate port density
- Consider PoE for IP phones

**3. SD-WAN Deployment**

Consider SD-WAN for:
- Intelligent path selection
- Application-aware routing
- Automatic failover
- Centralized management

**Benefits:**
- Improved application performance
- Cost optimization (use cheaper internet circuits)
- Better visibility and control
- Simplified branch connectivity

## Network Architecture Options

### 1. Dual ISP with Failover

```
                    ┌─────────────┐
                    │   ISP 1     │
                    │  (Primary)  │
                    └──────┬──────┘
                           │
┌──────────┐        ┌──────▼──────┐         ┌─────────────┐
│  WxCC    │◄───────┤   Router    │◄────────┤   Agents    │
│  Cloud   │        │  (SD-WAN)   │         │             │
└──────────┘        └──────▲──────┘         └─────────────┘
                           │
                    ┌──────┴──────┐
                    │   ISP 2     │
                    │  (Backup)   │
                    └─────────────┘
```

**Benefits:**
- Redundancy and high availability
- Automatic failover
- Cost optimization (use cheaper internet for primary)

**2. Local Internet Breakout**

For branch offices:
- Enable direct internet access for WxCC traffic
- Avoid backhauling to headquarters
- Reduce latency and improve performance
- Implement local QoS policies

**3. Geographic Distribution**

**Data Center Selection:**
- Webex automatically routes to nearest data center
- Understand data residency requirements
- Plan for multi-region disaster recovery

**Agent Distribution:**
- Support remote/home office agents
- Provide adequate home internet guidelines
- Consider agent location in capacity planning

## Network Readiness Checklist

Use this checklist to validate network readiness:

### Connectivity
- [ ] Internet bandwidth meets WxCC requirements
- [ ] Redundant internet circuits configured
- [ ] Firewall rules allow Webex traffic
- [ ] DNS resolution for Webex domains works
- [ ] Network Time Protocol (NTP) synchronized

### Performance
- [ ] Latency (RTD) ≤ 80ms to Webex data centers
- [ ] Packet loss ≤ 1% sustained
- [ ] Jitter ≤ 30ms for voice traffic
- [ ] Bandwidth testing shows adequate headroom
- [ ] Performance tested during peak hours

### Quality of Service
- [ ] QoS policies configured on all routers/switches
- [ ] Voice traffic marked with DSCP EF (46)
- [ ] Priority queuing enabled for voice
- [ ] QoS effectiveness validated under load
- [ ] Monitoring in place for queue drops

### Security
- [ ] Firewall rules documented and implemented
- [ ] SIP ALG disabled or properly configured
- [ ] NAT traversal configured correctly
- [ ] SSL/TLS inspection exceptions for Webex
- [ ] Webex IP ranges whitelisted

### Redundancy
- [ ] Backup circuits configured and tested
- [ ] Automatic failover validated
- [ ] Failover time meets requirements
- [ ] Disaster recovery sites have connectivity
- [ ] Monitoring alerts configured

### Documentation
- [ ] Network topology diagrams updated
- [ ] Bandwidth calculations documented
- [ ] Test results recorded and analyzed
- [ ] Upgrade recommendations documented
- [ ] Network change windows scheduled

## Remote Agent Considerations

With cloud contact centers, remote agents become feasible. Consider:

**Home Internet Requirements:**
- Minimum 25 Mbps download, 5 Mbps upload
- Stable connection (not mobile hotspot)
- Low latency to Webex (use RWAN tool to test)
- Wired connection preferred over WiFi

**Remote Agent Challenges:**
- Variable home network quality
- Lack of control over home ISP
- WiFi interference and congestion
- Shared bandwidth with family members

**Recommendations:**
- Provide internet stipend or requirements
- Use Webex RWAN tool for pre-hire testing
- Require wired Ethernet connection
- Monitor remote agent quality metrics
- Provide VPN for security if needed

## Network Monitoring Strategy

**Continuous Monitoring Tools:**

| Tool | Purpose | Metrics |
|------|---------|---------|
| **Network Performance Monitor** | Overall network health | Bandwidth, latency, packet loss |
| **Webex Control Hub** | WxCC-specific metrics | Call quality, MOS scores, jitter |
| **SNMP Monitoring** | Device health | Interface errors, CPU, memory |
| **Application Performance Monitoring** | End-to-end experience | Agent desktop response time |

**Key Metrics to Monitor:**

**Network Level:**
- Circuit utilization and bandwidth
- Packet loss and error rates
- Latency to Webex data centers
- QoS queue depths and drops

**Voice Quality:**
- Mean Opinion Score (MOS)
- R-factor (voice quality rating)
- Jitter and packet loss per call
- Call setup success rate

**Agent Experience:**
- Login success rates
- Desktop application performance
- Screen pop latency
- Integration response times

**Alerting Thresholds:**

| Metric | Warning Threshold | Critical Threshold | Action |
|--------|------------------|-------------------|--------|
| Latency | >60ms | >80ms | Investigate routing |
| Packet Loss | >0.5% | >1% | Escalate to ISP |
| Jitter | >20ms | >30ms | Check QoS config |
| Bandwidth Utilization | >70% | >85% | Plan circuit upgrade |

## Network Assessment Deliverables

**1. Network Assessment Report**

Comprehensive document including:
- Current network topology
- Performance test results
- Identified gaps and risks
- Upgrade recommendations
- Cost estimates for upgrades
- Implementation timeline

**2. Network Readiness Score**

Scorecard rating network readiness:

| Area | Weight | Score (1-5) | Weighted Score |
|------|--------|-------------|----------------|
| Bandwidth | 25% | [Score] | [Calculation] |
| Latency | 25% | [Score] | [Calculation] |
| Redundancy | 20% | [Score] | [Calculation] |
| QoS | 15% | [Score] | [Calculation] |
| Security | 15% | [Score] | [Calculation] |
| **Total** | **100%** | | **[Total Score]** |

**Rating Scale:**
- 4.5 - 5.0: Excellent - Ready for migration
- 3.5 - 4.4: Good - Minor improvements needed
- 2.5 - 3.4: Fair - Moderate upgrades required
- 1.5 - 2.4: Poor - Major work required
- 0.0 - 1.4: Critical - Network not ready

**3. Upgrade Project Plan**

If upgrades are needed:
- Prioritized list of improvements
- Cost-benefit analysis
- Implementation timeline
- Resource requirements
- Risk mitigation strategies

**4. Network Diagrams**

Updated diagrams showing:
- Current state topology
- Future state with WxCC
- Traffic flows and routing
- Redundancy paths
- Security zones

## Best Practices

**Network Preparation:**
✅ Start network assessment early (3-6 months before migration)  
✅ Test from all agent locations, not just headquarters  
✅ Perform tests during peak business hours  
✅ Involve ISPs early if upgrades are needed  
✅ Document baseline metrics for comparison  

**Performance Optimization:**
✅ Implement QoS on all network devices  
✅ Use SD-WAN for intelligent routing  
✅ Enable local internet breakout for branches  
✅ Configure redundant circuits with automatic failover  
✅ Monitor continuously and tune as needed  

**Security:**
✅ Whitelist Webex IP ranges and domains  
✅ Disable SIP ALG on firewalls  
✅ Configure NAT traversal properly  
✅ Implement SSL inspection exceptions  
✅ Follow Cisco's security best practices  

**Remote Agents:**
✅ Define home internet requirements  
✅ Use RWAN tool for pre-hire testing  
✅ Require wired connections  
✅ Monitor remote agent quality closely  
✅ Provide support for connectivity issues  

## Common Network Issues & Solutions

| Issue | Symptom | Root Cause | Solution |
|-------|---------|------------|----------|
| **One-way audio** | Caller can't hear agent or vice versa | NAT/firewall blocking RTP | Configure SIP ALG bypass, open RTP ports |
| **Choppy audio** | Audio cuts in and out | Packet loss or jitter | Implement QoS, upgrade circuit |
| **Echo** | Caller hears their own voice | Acoustic echo or network delay | Check headsets, reduce latency |
| **Call drops** | Calls disconnect unexpectedly | Session timer mismatch | Configure SIP session timers |
| **Poor quality during peaks** | Quality degrades at busy times | Insufficient bandwidth or QoS | Upgrade bandwidth, tune QoS |

