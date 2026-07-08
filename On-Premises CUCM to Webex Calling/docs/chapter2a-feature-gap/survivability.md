# Survivability -- Webex Calling Survivability Gateway

> **[!]️ GAP SEVERITY: CRITICAL | Affects: All 12 Abhavtech Sites**

## 2A.1.1 Problem Statement

CUCM's Survivable Remote Site Telephony (SRST) allows Cisco IP phones at branch sites to register directly to the CUBE router when the WAN link fails. Users retain basic calling capability -- extension dialing, PSTN access -- throughout the outage.

Webex Calling has no equivalent built-in survivability. When the internet circuit to a Webex Calling site fails, users lose **all** calling capability including internal extension dialing.

This is a critical gap for Abhavtech given:
- 12-site global deployment
- Dependency on internet circuits at branch offices in India (Noida, Pune, Hyderabad, Bangalore, Delhi)
- Requirement for 24/7 availability for contact center operations at Mumbai and Chennai

## 2A.1.2 Webex Calling Survivability Gateway -- Platform Requirement

Cisco introduced the Survivability Gateway feature for Webex Calling in **IOS-XE 17.6.1**. This is a configuration mode applied to the existing Local Gateway router that allows MPP phones to fall back to the CUBE/LGW for basic SIP registration when the internet is unavailable.

> **Platform Requirement:** IOS-XE 17.6.1 or later required on all LGW routers. Abhavtech's ISR 4451-X routers running IOS-XE 17.12.2 meet this requirement at all India sites. EMEA and Americas sites using CCPP PSTN (no LGW) require a new IOS-XE router deployment for survivability -- see Section 2A.1.5.

## 2A.1.3 Survivability Feature Limitations vs. SRST

| Capability | CUCM SRST | Webex Survivability GW |
|---|---|---|
| Basic extension calling | [OK] Yes | [OK] Yes (MPP only) |
| PSTN calling | [OK] Yes | [OK] Yes (via LGW PSTN trunk) |
| Hunt groups in survivability | [!]️ Yes (limited) | [X] No -- calls ring individual extension |
| Voicemail | [X] No (unless Unity local) | [X] No |
| Conference | [OK] Yes (MoH) | [X] No |
| Auto Attendant | [X] No | [X] No |
| Supported endpoints | Cisco 79xx/88xx/99xx | Cisco MPP 68xx/78xx/88xx only |
| Jabber / Webex App | [X] No | [X] No |
| Automatic failover | [OK] Yes (CCME keepalive) | [OK] Yes (SIP OPTIONS keepalive) |

## 2A.1.4 Abhavtech Survivability Design -- India Sites

All six India LGW routers (Mumbai, Chennai, Bangalore, Delhi, Noida, Hyderabad) will be configured with the Survivability Gateway feature. MPP phones at each site will use the survivability fallback profile pointing to the local LGW.

> **Note:** Non-MPP endpoints (Webex App users, soft clients) have no survivability option. These users should be trained to use mobile PSTN as backup during outages.

**Survivability Gateway LGW configuration template -- Mumbai (apply to all India sites with site-specific IP changes):**

```ios
! === Webex Calling Survivability Gateway Configuration ===
! Apply to ISR 4451-X at each India site
! IOS-XE 17.6.1+ required

voice register global
 mode webex-calling
 max-dn 200
 max-pool 200
 voip-outbound-proxy wxc.edge.bcld.webex.com
 authenticate register

survivability
 application wan-down
 keepalive register
 wan-gateway-ip 10.10.1.1         ! WAN interface IP -- update per site
 ping-options timeout 5 retries 3
 fallback local
```

## 2A.1.5 Abhavtech Survivability Design -- EMEA and Americas Sites

London, Frankfurt, New Jersey, and Dallas use Cisco Cloud Connected PSTN (CCPP/IntelePeer) without a Local Gateway. Three options are available:

| Option | Description | Recommended For |
|---|---|---|
| **Option A** | Deploy a survivability-capable IOS-XE router at each site | London only (CC presence) |
| **Option B** | Rely on mobile network (cellular) as backup during outages | New Jersey, Dallas |
| **Option C** | SD-WAN dual-WAN with automatic failover (ABV-SDWAN-2024) | London, Frankfurt |

**Abhavtech Decision:** Option C (SD-WAN dual-WAN) for London and Frankfurt, aligned with the existing ABV-SDWAN-2024 project. New Jersey and Dallas use Option B (mobile fallback).

## 2A.1.6 Validation Checklist

- [ ] Confirm IOS-XE 17.6.1+ on all India LGW routers (current: 17.12.2 -- [OK] PASS)
- [ ] Configure survivability mode on Mumbai LGW -- pilot validation
- [ ] Simulate WAN outage -- verify MPP phones fall back to local SRTP/SIP within 30 seconds
- [ ] Verify PSTN calls work during survivability mode via local PSTN trunk
- [ ] Verify Webex App users cannot call (expected -- document in user communications)
- [ ] Restore WAN -- verify MPP phones re-register to Webex within 60 seconds
- [ ] Replicate configuration to Chennai, Bangalore, Delhi, Noida, Hyderabad
- [ ] Confirm SD-WAN dual-WAN is active at London and Frankfurt

---
