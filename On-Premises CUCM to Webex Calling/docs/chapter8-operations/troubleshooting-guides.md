# Troubleshooting Guides

## 8.6 Troubleshooting Procedures

### 8.6.1 Troubleshooting Decision Tree

```
+-----------------------------------------------------------------+
|  WEBEX CALLING TROUBLESHOOTING DECISION TREE                     |
+-----------------------------------------------------------------+
|                                                                 |
|  USER REPORTS ISSUE                                            |
|  |                                                              |
|  +-> No dial tone / Phone not working                          |
|  |   +-> Check phone registration -> 8.6.2                      |
|  |   +-> Check network connectivity -> 8.6.3                    |
|  |                                                              |
|  +-> Cannot make calls                                         |
|  |   +-> Internal calls fail -> 8.6.4                           |
|  |   +-> PSTN calls fail -> 8.6.5                               |
|  |                                                              |
|  +-> Cannot receive calls                                      |
|  |   +-> DID not ringing -> 8.6.6                               |
|  |   +-> Extension not ringing -> 8.6.7                         |
|  |                                                              |
|  +-> Poor call quality                                         |
|  |   +-> One-way audio -> 8.6.8                                 |
|  |   +-> Choppy/robotic audio -> 8.6.9                          |
|  |   +-> Echo -> 8.6.10                                         |
|  |                                                              |
|  +-> Voicemail issues                                          |
|  |   +-> Voicemail not working -> 8.6.11                        |
|  |                                                              |
|  +-> Feature not working                                       |
|      +-> Specific feature troubleshooting -> 8.6.12             |
|                                                                 |
+-----------------------------------------------------------------+
```

### 8.6.2 Phone Registration Issues

**Procedure: Troubleshoot Phone Not Registering**

| Step | Check | Action if Failed |
|------|-------|------------------|
| 1 | Phone powered on? | Check PoE / power adapter |
| 2 | Network link light on? | Check cable / switch port |
| 3 | Phone has IP address? | Settings -> Network -> IPv4 |
| 4 | Phone can ping gateway? | Network test on phone |
| 5 | Phone can reach Webex? | DNS / firewall check |
| 6 | Phone in Control Hub? | Add device if missing |
| 7 | MAC address correct? | Verify in Control Hub |
| 8 | Correct firmware? | May need factory reset |

**Control Hub Verification:**

| Step | Action | Notes |
|------|--------|-------|
| 1 | Navigate to Devices | Device list |
| 2 | Search by MAC or user | Find device |
| 3 | Check Status | Should be "Online" |
| 4 | If Offline: Check "Last Seen" | Recent = network issue |
| 5 | Click device -> Troubleshoot | Diagnostic tools |
| 6 | Run connectivity test | From Control Hub |

> **Reference:** https://help.webex.com/article/n2wfv0j (Troubleshoot Devices)

### 8.6.3 Network Connectivity Issues

**Procedure: Troubleshoot Network Path**

| Step | Check | Command/Tool |
|------|-------|--------------|
| 1 | Phone IP configuration | Phone Settings -> Network |
| 2 | VLAN assignment correct | `show mac address-table` on switch |
| 3 | DNS resolution | `nslookup webex.com` from phone subnet |
| 4 | Firewall rules | Check FW logs for blocks |
| 5 | Proxy bypass | Verify Webex domains excluded |
| 6 | SSL inspection | Must be disabled for Webex |
| 7 | QoS marking | Packet capture / `show policy-map` |

**Network Test from Phone:**

| Step | Action |
|------|--------|
| 1 | On phone: Settings -> Admin Settings -> Network |
| 2 | Run Network Test |
| 3 | Review results: DNS, HTTP, Media |
| 4 | Note any failures |

### 8.6.4 Internal Call Failures

**Procedure: Troubleshoot Internal Calls**

| Step | Check | Action |
|------|-------|--------|
| 1 | Caller phone registered? | Control Hub device status |
| 2 | Callee phone registered? | Control Hub device status |
| 3 | Extensions correct? | User -> Calling -> Numbers |
| 4 | Same location? | Verify dial plan |
| 5 | Different location? | Check site-to-site routing |
| 6 | Webex-to-CUCM call? | Check coexistence trunk |
| 7 | Check call history | User -> Calling -> Call History |
| 8 | Check error code | Analytics -> Troubleshooting |

**Common Error Codes:**

| Code | Meaning | Resolution |
|------|---------|------------|
| 404 | User not found | Check extension/routing |
| 480 | Temporarily unavailable | Device offline |
| 486 | Busy | User on another call |
| 503 | Service unavailable | Platform issue - check status |

### 8.6.5 PSTN Call Failures

**Procedure: Troubleshoot PSTN Outbound**

| Step | Check | Action |
|------|-------|--------|
| 1 | User has PSTN access? | Calling permissions |
| 2 | Correct dial string? | Include country code |
| 3 | PSTN trunk active? | Control Hub -> PSTN |
| 4 | For India: Correct Zone? | Toll bypass routing |
| 5 | LGW registered? (India) | `show voice register status` |
| 6 | PSTN provider up? | Check provider portal |
| 7 | DIDs ported complete? | Number inventory |
| 8 | Check CDR for error | Call history |

**India-Specific PSTN Troubleshooting:**

| Symptom | Likely Cause | Resolution |
|---------|--------------|------------|
| Call fails to connect | Wrong LGW routing | Verify Zone assignment |
| Call connects but no audio | NAT/firewall | Check media ports |
| PSTN rejection | Provider trunk down | Contact Tata/Airtel |
| Caller ID wrong | LGW dial-peer | Check calling party transform |

### 8.6.6 Inbound DID Issues

**Procedure: Troubleshoot DID Not Ringing**

| Step | Check | Action |
|------|-------|--------|
| 1 | DID assigned to user? | Control Hub -> Numbers |
| 2 | User phone registered? | Device status |
| 3 | DID active with provider? | Provider portal |
| 4 | Number porting complete? | Check porting status |
| 5 | Call forward active? | May be forwarding elsewhere |
| 6 | DND enabled? | User setting |
| 7 | Test from different PSTN | Carrier issue? |

### 8.6.7 Extension Not Ringing

**Procedure: Troubleshoot Extension Issues**

| Step | Check | Action |
|------|-------|--------|
| 1 | Extension assigned? | User -> Calling |
| 2 | Extension unique? | No duplicates |
| 3 | Phone registered? | Device status |
| 4 | Do Not Disturb? | Disable DND |
| 5 | Call forward set? | Check forward settings |
| 6 | Ring setting correct? | Phone audio settings |
| 7 | Webex App signed in? | May ring App not phone |

### 8.6.8 One-Way Audio

**Procedure: Troubleshoot One-Way Audio**

| Step | Check | Likely Cause |
|------|-------|--------------|
| 1 | Consistent direction? | Inbound vs outbound media |
| 2 | Specific users/locations? | Site-specific issue |
| 3 | Firewall symmetric? | Stateful inspection |
| 4 | NAT configuration | ALG disabled? |
| 5 | Media ports open | UDP 19560-65535 |
| 6 | LGW media binding | Check bind statements |

**Common Resolutions:**

| Cause | Resolution |
|-------|------------|
| Firewall blocking media | Open UDP 19560-65535 outbound |
| SIP ALG enabled | Disable SIP ALG on firewall |
| NAT issue on LGW | Verify media bind interface |
| QoS dropping packets | Check QoS policy |

### 8.6.9 Choppy/Robotic Audio

**Procedure: Troubleshoot Audio Quality**

| Step | Check | Tool |
|------|-------|------|
| 1 | Check call quality metrics | Control Hub Analytics |
| 2 | MOS score for call | Call details |
| 3 | Jitter values | Should be <30ms |
| 4 | Packet loss | Should be <1% |
| 5 | Network path | Traceroute to Webex |
| 6 | Local network congestion | Switch/router utilization |
| 7 | QoS applied? | Check DSCP marking |
| 8 | WiFi vs wired | WiFi more prone to issues |

**Quality Resolution Matrix:**

| Metric Issue | Likely Cause | Resolution |
|--------------|--------------|------------|
| High jitter | Network congestion | QoS prioritization |
| High latency | Long path / congestion | Review routing |
| Packet loss | Congestion / errors | Check interface errors |
| Low MOS | Combination above | Comprehensive review |

### 8.6.10 Echo Issues

**Procedure: Troubleshoot Echo**

| Step | Check | Resolution |
|------|-------|------------|
| 1 | Which end hears echo? | Echo is at OTHER end |
| 2 | Speakerphone in use? | Use handset or headset |
| 3 | Headset quality? | Replace if poor quality |
| 4 | Phone volume too high? | Reduce speaker volume |
| 5 | Acoustic environment? | Add dampening |
| 6 | LGW echo cancellation | Enable `echo-cancel` |

### 8.6.11 Voicemail Issues

**Procedure: Troubleshoot Voicemail**

| Step | Check | Action |
|------|-------|--------|
| 1 | Voicemail enabled? | User -> Calling -> Voicemail |
| 2 | User knows PIN? | May need reset |
| 3 | Forward to VM working? | Check no-answer forward |
| 4 | VM pilot number correct? | Location settings |
| 5 | VM notification working? | Check email settings |
| 6 | Mailbox full? | Clear old messages |

**Reset Voicemail PIN:**

| Step | Action |
|------|--------|
| 1 | Navigate to Users -> find user |
| 2 | Calling -> Voicemail |
| 3 | Click "Reset PIN" |
| 4 | User receives temporary PIN via email |
| 5 | User must set new PIN on first access |

> **Reference:** https://help.webex.com/article/n5qc5u4 (Voicemail Troubleshooting)

### 8.6.12 Feature Troubleshooting Quick Reference

| Feature | Common Issue | Check |
|---------|--------------|-------|
| Hunt Group | Calls not distributing | Verify members registered |
| Call Park | Cannot retrieve | Park extension range correct? |
| Call Forward | Not forwarding | Feature enabled? Destination valid? |
| BLF | Status not updating | Monitored user registered? |
| Shared Line | Not ringing all | Virtual line assigned to all devices? |
| Call Recording | Not recording | Policy enabled? License assigned? |

---

