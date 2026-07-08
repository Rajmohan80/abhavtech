# Chapter 2: Webex Calling Design -- 2.3 PSTN Design

## 2.3 PSTN Design

!!! note "Inherited from Phase 1 — CUCM to Webex Calling"
    The full PSTN architecture — Local Gateway design per telecom circle, Cloud Connected PSTN for EMEA/Americas, India DoT/TRAI toll bypass compliance, Zone/Edge configuration, and DID migration plan — was established in the **Phase 1 CUCM to Webex Calling project** and is not redesigned here. This chapter documents only the contact centre-specific PSTN elements (entry point DID assignments and WxCC entry point configuration).

    For the authoritative PSTN design, see:
    - [CUCM project: 2.3 PSTN Design](https://webex-calling.abhavtech.com/chapter2-calling-design/pstn-integration/) — Global strategy, LGW design, CCPP, provider selection
    - [CUCM project: 4.3 India DoT/TRAI Compliance](https://webex-calling.abhavtech.com/chapter4-compliance/india-compliance/) — Toll bypass rules, Zone/Edge, telecom circle mapping
    - [CUCM project: 2.3.2 Toll Bypass Enforcement Scenarios](https://webex-calling.abhavtech.com/chapter2-calling-design/pstn-integration/#232-india-lgw-design) — 3 compliance scenarios (compliant, blocked roaming, WFH ITN)

    **Key inherited decisions:**

    | Element | Decision |
    |---|---|
    | India PSTN | Local Gateway per telecom circle (Tata/Airtel) — mandatory for geographic DID toll bypass |
    | EMEA/Americas PSTN | Cloud Connected PSTN (IntelePeer) — no LGW required |
    | CC Entry Point DIDs | Provisioned on existing Webex Calling LGW infrastructure |
    | India WFH agents | Use ITN numbers (9XXXXXXXXX) — exempt from toll bypass |
    | Toll-free | 1800-266-1000 (India), +44-800-096-1000 (UK) |

### 2.3.1 Global PSTN Strategy Overview

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH GLOBAL PSTN STRATEGY                                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|                         PSTN CONNECTIVITY OPTIONS                           |
|                                                                             |
|  +-----------------+  +-----------------+  +-----------------+             |
|  | LOCAL GATEWAY   |  | CCPP            |  | ITN (India)     |             |
|  | (Premises PSTN) |  | (Cloud PSTN)    |  | (Non-Geographic)|             |
|  +-----------------+  +-----------------+  +-----------------+             |
|  | * Customer SBC  |  | * Provider SBC  |  | * Cloud-native  |             |
|  | * Existing PSTN |  | * Port numbers  |  | * 9XXXXXXXXX    |             |
|  | * Zone/Edge     |  | * No hardware   |  | * No Zone/Edge  |             |
|  |   (India only)  |  | * Zone/Edge     |  | * India WFH     |             |
|  |                 |  |   (India only)  |  |                 |             |
|  +--------+--------+  +--------+--------+  +--------+--------+             |
|           |                    |                    |                       |
|           v                    v                    v                       |
|  +-----------------+  +-----------------+  +-----------------+             |
|  | INDIA OFFICES   |  | EMEA & AMERICAS |  | INDIA WFH       |             |
|  | * Mumbai        |  | * London (CCPP) |  | * 150 users     |             |
|  | * Chennai       |  | * Frankfurt     |  | * Toll bypass   |             |
|  | * Bangalore     |  | * New Jersey    |  |   exempt        |             |
|  | * Delhi/Noida   |  | * Dallas        |  |                 |             |
|  | * Pune/Hyd      |  |                 |  |                 |             |
|  +-----------------+  +-----------------+  +-----------------+             |
|                                                                             |
|  STRATEGIC RATIONALE:                                                      |
|  ====================                                                      |
|  India (LGW):   * Leverage existing Tata/Airtel contracts                 |
|                 * Maintain CUBE investment                                 |
|                 * DoT toll bypass compliance via Zone/Edge                |
|                                                                             |
|  EMEA/Americas (CCPP): * No local compliance restrictions                 |
|                        * Simplified management                            |
|                        * Provider handles regulatory                      |
|                                                                             |
|  India WFH (ITN): * Exempt from toll bypass                               |
|                   * Works from any India location                         |
|                   * Tata Communications provider                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 2.3.2 India: Local Gateway Architecture

#### 2.3.2.1 Per-Circle LGW Requirements

```
+-----------------------------------------------------------------------------+
|              INDIA LOCAL GATEWAY ARCHITECTURE                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|                         +-------------------------+                        |
|                         |    WEBEX CALLING        |                        |
|                         |  (Mumbai + Chennai DC)  |                        |
|                         +-----------+-------------+                        |
|                                     |                                       |
|                    +----------------+----------------=                     |
|                    |                |                |                     |
|                    v                v                v                     |
|            +--------------+ +--------------+ +--------------+             |
|            | Zone:        | | Zone:        | | Zone:        |             |
|            | Mumbai       | | Karnataka    | | Tamil Nadu   |             |
|            | Circle       | | Circle       | | Circle       |             |
|            +--------------+ +--------------+ +--------------+             |
|            |Trusted Edge: | |Trusted Edge: | |Trusted Edge: |             |
|            |103.15.XX.XXX/24| |103.20.XX.XXX/24| |103.25.XX.XXX/24|             |
|            |10.1.x.x/16   | |10.3.x.x/20   | |10.2.x.x/16   |             |
|            +------+-------+ +------+-------+ +------+-------+             |
|                   |                |                |                      |
|                   v                v                v                      |
|            +--------------+ +--------------+ +--------------+             |
|            | LGW: CUBE    | | LGW: CUBE    | | LGW: CUBE    |             |
|            | Mumbai (HA)  | | Bangalore    | | Chennai (HA) |             |
|            | ISR 4451-X   | | ISR 4331     | | ISR 4351     |             |
|            | IOS-XE 17.12 | | IOS-XE 17.12 | | IOS-XE 17.12 |             |
|            +------+-------+ +------+-------+ +------+-------+             |
|                   |                |                |                      |
|                   v                v                v                      |
|            +--------------+ +--------------+ +--------------+             |
|            | PSTN: Tata   | | PSTN: Tata   | | PSTN: Tata   |             |
|            | Mumbai SIP   | | Bangalore    | | Chennai SIP  |             |
|            | +91-22-XXXX  | | +91-80-XXXX  | | +91-44-XXXX  |             |
|            +--------------+ +--------------+ +--------------+             |
|                                                                             |
|            +--------------+ +--------------+ +--------------+             |
|            | Zone:        | | Zone:        | | Zone:        |             |
|            | Delhi        | | UP West      | | AP/Telangana |             |
|            | Circle       | | Circle       | | Circle       |             |
|            +--------------+ +--------------+ +--------------+             |
|            |Trusted Edge: | |Trusted Edge: | |Trusted Edge: |             |
|            |103.30.XX.XXX/24| |103.35.XX.XXX/24| |103.40.XX.XXX |             |
|            +------+-------+ +------+-------+ +------+-------+             |
|                   |                |                |                      |
|                   v                v                v                      |
|            +--------------+ +--------------+ +--------------+             |
|            | LGW: CUBE    | | LGW: CUBE    | | LGW: CUBE    |             |
|            | Delhi        | | Noida        | | Hyderabad    |             |
|            | ISR 4331     | | ISR 4331     | | ISR 4331     |             |
|            +------+-------+ +------+-------+ +------+-------+             |
|                   |                |                |                      |
|                   v                v                v                      |
|            +--------------+ +--------------+ +--------------+             |
|            | PSTN: Tata   | | PSTN: Tata   | | PSTN: Tata   |             |
|            | Delhi SIP    | | Noida SIP    | | Hyderabad    |             |
|            | +91-11-XXXX  | | +91-120-XXX  | | +91-40-XXXX  |             |
|            +--------------+ +--------------+ +--------------+             |
|                                                                             |
|  TOLL BYPASS ENFORCEMENT:                                                  |
|  ========================                                                  |
|  Webex checks user IP against Trusted Network Edge definitions             |
|  Routes PSTN calls ONLY through user's assigned Zone LGW                  |
|  Roaming users (different zone) -> PSTN call BLOCKED                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**LGW Specifications by Circle:**

| LGW | Platform | IOS-XE | Capacity | HA | PSTN Circuits | Locations Served |
|-----|----------|--------|----------|----|--------------:|------------------|
| lgw-mumbai-01/02 | ISR 4451-X | 17.12.2 | 1000 calls | Yes | 30 SIP channels | Mumbai, Pune |
| lgw-chennai-01/02 | ISR 4351 | 17.12.2 | 500 calls | Yes | 15 SIP channels | Chennai |
| lgw-bangalore-01 | ISR 4331 | 17.12.2 | 350 calls | No | 10 SIP channels | Bangalore |
| lgw-delhi-01 | ISR 4331 | 17.12.2 | 250 calls | No | 8 SIP channels | Delhi |
| lgw-noida-01 | ISR 4331 | 17.12.2 | 200 calls | No | 6 SIP channels | Noida |
| lgw-hyderabad-01 | ISR 4331 | 17.12.2 | 80 calls | No | 3 SIP channels | Hyderabad |

#### 2.3.2.2 Zone & Trusted Network Edge Configuration

**Step-by-Step: Creating Zones in Control Hub**

1. Navigate to **Control Hub** > **Calling** > **Service Settings** > **Zones**
2. Click **Create Zone**
3. Configure zone settings per circle

**Abhavtech Zone Configuration:**

| Zone Name | Telecom Circle | Locations | LGW | Trusted Edge IPs (Public) | Internal Subnets |
|-----------|----------------|-----------|-----|---------------------------|------------------|
| Zone-Mumbai-Circle | Mumbai | Mumbai HQ, Pune | lgw-mumbai-01/02 | 103.15.XX.XXX/24 | 10.1.0.0/16, 10.6.0.0/20 |
| Zone-TamilNadu-Circle | Tamil Nadu | Chennai | lgw-chennai-01/02 | 103.25.XX.XXX/24 | 10.2.0.0/16 |
| Zone-Karnataka-Circle | Karnataka | Bangalore | lgw-bangalore-01 | 103.20.XX.XXX/24 | 10.3.0.0/20 |
| Zone-Delhi-Circle | Delhi | Delhi | lgw-delhi-01 | 103.30.XX.XXX/24 | 10.4.0.0/20 |
| Zone-UPWest-Circle | UP West | Noida | lgw-noida-01 | 103.35.XX.XXX/24 | 10.5.0.0/20 |
| Zone-APTelangana-Circle | AP/Telangana | Hyderabad | lgw-hyderabad-01 | 103.40.XX.XXX/24 | 10.7.0.0/20 |

**Step-by-Step: Adding Trusted Network Edge**

1. Navigate to **Control Hub** > **Calling** > **Service Settings** > **Trusted Network Edge**
2. Click **Add Trusted Edge**
3. Configure IP ranges

```yaml
# Control Hub - Trusted Network Edge Configuration
trusted_network_edges:
  - name: "Mumbai-Edge"
    description: "Mumbai office public IP range"
    ip_addresses:
      - "103.15.XX.XXX/24"
    internal_subnets:
      - "10.1.0.0/16"
      - "10.6.0.0/20"  # Pune backhauls through Mumbai
      
  - name: "Chennai-Edge"
    description: "Chennai office public IP range"
    ip_addresses:
      - "103.25.XX.XXX/24"
    internal_subnets:
      - "10.2.0.0/16"
      
  - name: "Bangalore-Edge"
    description: "Bangalore office public IP range"
    ip_addresses:
      - "103.20.XX.XXX/24"
    internal_subnets:
      - "10.3.0.0/20"
      
  - name: "Delhi-Edge"
    description: "Delhi office public IP range"
    ip_addresses:
      - "103.30.XX.XXX/24"
    internal_subnets:
      - "10.4.0.0/20"
      
  - name: "Noida-Edge"
    description: "Noida office public IP range"
    ip_addresses:
      - "103.35.XX.XXX/24"
    internal_subnets:
      - "10.5.0.0/20"
      
  - name: "Hyderabad-Edge"
    description: "Hyderabad office public IP range"
    ip_addresses:
      - "103.40.XX.XXX/24"
    internal_subnets:
      - "10.7.0.0/20"
```

#### 2.3.2.3 Toll Bypass Enforcement Scenarios

> These three scenarios apply equally to contact centre agents and enterprise Webex Calling users. The same Zone/Edge infrastructure enforces compliance for both. This is a reference copy — the authoritative version with full configuration steps is in the [CUCM to Webex Calling project, section 2.3.2](https://webex-calling.abhavtech.com/chapter2-calling-design/pstn-integration/).
>
> **Note on the destination number `+91-80-12345678`** used in the scenarios below: this is a fictional external Bangalore landline being dialled by the user — it is not one of Abhavtech's DID assignments. It illustrates the compliance enforcement logic when a user dials any external India number.

```
+-----------------------------------------------------------------------------+
|              TOLL BYPASS ENFORCEMENT - CALL FLOW SCENARIOS                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SCENARIO 1: COMPLIANT - Mumbai User calling from Mumbai Office            |
|  ===============================================================           |
|                                                                             |
|  1. User at Mumbai HQ dials +91-80-12345678 (Bangalore external number)   |
|  2. Webex detects user source IP: 10.1.50.25                              |
|  3. IP matches Trusted Edge: Mumbai-Edge (10.1.0.0/16)                    |
|  4. Zone lookup: Zone-Mumbai-Circle                                        |
|  5. Route Group: RG-Mumbai-LGW                                            |
|  6. Call routes to lgw-mumbai-01                                          |
|  7. LGW sends call to Tata SIP trunk (Mumbai)                             |
|  8. [OK] CALL COMPLETES - Toll charged at Mumbai egress point               |
|                                                                             |
|  +---------+    +---------+    +---------+    +---------+    +---------+  |
|  | User    |--->| Webex   |--->| Zone    |--->| Mumbai  |--->| Tata    |  |
|  | Mumbai  |    | Cloud   |    | Lookup  |    | LGW     |    | Mumbai  |  |
|  |10.1.x.x |    |         |    | [OK] Match |    |         |    | PSTN    |  |
|  +---------+    +---------+    +---------+    +---------+    +---------+  |
|                                                                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SCENARIO 2: BLOCKED - Mumbai User Roaming to Bangalore Office             |
|  ===============================================================           |
|                                                                             |
|  1. Mumbai user visits Bangalore office, uses office WiFi                  |
|  2. User dials +91-11-12345678 (Delhi external number)                    |
|  3. Webex detects user source IP: 10.3.50.100                             |
|  4. IP matches Trusted Edge: Bangalore-Edge (10.3.0.0/20)                 |
|  5. User's assigned Zone: Zone-Mumbai-Circle                              |
|  6. MISMATCH: User in Bangalore but assigned to Mumbai zone               |
|  7. [X] PSTN CALL BLOCKED - Toll bypass prevention                         |
|  8. User receives "PSTN calling not available" message                    |
|                                                                             |
|  +---------+    +---------+    +---------+    +---------+                  |
|  | Mumbai  |--->| Webex   |--->| Zone    |--->| [X] CALL  |                  |
|  | User    |    | Cloud   |    | Lookup  |    | BLOCKED |                  |
|  | @B'lore |    |         |    | Mismatch|    |         |                  |
|  |10.3.x.x |    |         |    |         |    |         |                  |
|  +---------+    +---------+    +---------+    +---------+                  |
|                                                                             |
|  WORKAROUND OPTIONS:                                                       |
|  * Use Webex-to-Webex calling (always works)                              |
|  * VPN back to Mumbai network                                             |
|  * Mobile cellular (outside Webex)                                        |
|                                                                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SCENARIO 3: WFH USER WITH ITN - Working from Home in Tier-2 City         |
|  ===============================================================           |
|                                                                             |
|  1. WFH user assigned ITN number: +91-9XX-1000-XX                         |
|  2. User dials +91-22-12345678 (Mumbai external number)                   |
|  3. ITN numbers are EXEMPT from toll bypass rules                         |
|  4. No Zone/Edge check required                                           |
|  5. Call routes directly to Tata cloud                                    |
|  6. [OK] CALL COMPLETES                                                     |
|                                                                             |
|  +---------+    +---------+    +---------+    +---------+                  |
|  | WFH     |--->| Webex   |--->| ITN     |--->| Tata    |                  |
|  | User    |    | Cloud   |    | Exempt  |    | Cloud   |                  |
|  | Home    |    |         |    | [OK] Pass |    | PSTN    |                  |
|  +---------+    +---------+    +---------+    +---------+                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

#### 2.3.2.4 LGW CUBE Configuration Template

```
! ============================================================
! CUBE Local Gateway Configuration Template - Mumbai
! Abhavtech.com - ABV-COLLAB-MIG-2026
! IOS-XE Version: 17.12.2 or later (REQUIRED)
! Platform: ISR 4451-X
! ============================================================

! --- Global SIP Settings ---
voice service voip
 ip address trusted list
  ipv4 52.114.148.0 255.255.252.0    ! Webex Calling signaling
  ipv4 52.114.152.0 255.255.252.0
  ipv4 52.114.156.0 255.255.252.0
 mode border-element
 media disable-detailed-stats
 allow-connections sip to sip
 no supplementary-service sip refer
 stun
  stun flowdata agent-id 1 boot-count 4
  stun flowdata shared-secret 0 <secret>
 sip
  session refresh
  early-offer forced
  asymmetric payload full
  
! --- Codec Class ---
voice class codec 1
 codec preference 1 opus
 codec preference 2 g711ulaw
 codec preference 3 g711alaw
 codec preference 4 g729r8

! --- SIP Profile for Webex ---
voice class sip-profiles 100
 rule 10 request ANY sip-header SIP-Req-URI modify "sips:" "sip:"
 rule 20 request ANY sip-header To modify "<sips:" "<sip:"
 rule 30 request ANY sip-header From modify "<sips:" "<sip:"
 rule 40 request ANY sip-header Contact modify "<sips:" "<sip:"
 rule 50 response ANY sip-header To modify "<sips:" "<sip:"
 rule 60 response ANY sip-header From modify "<sips:" "<sip:"
 rule 70 response ANY sip-header Contact modify "<sips:" "<sip:"

! --- Tenant for Webex Calling ---
voice class tenant 100
 registrar dns:webexapis.com scheme sips expires 3600
 credentials number +91226XXX0000 username <LGW-USERNAME> password 0 <PASSWORD> realm webex.com
 authentication username <LGW-USERNAME> password 0 <PASSWORD> realm webex.com
 sip-server dns:webexapis.com
 srtp-crypto 1 AES_CM_128_HMAC_SHA1_80
 session transport tcp tls
 url sips
 error-passthru
 bind control source-interface GigabitEthernet0/0/0
 bind media source-interface GigabitEthernet0/0/0

! --- Dial Peer to Webex Calling ---
dial-peer voice 100 voip
 description Webex-Calling-Outbound
 preference 1
 destination-pattern .T
 session protocol sipv2
 session target dns:webexapis.com
 session transport tcp tls
 voice-class sip tenant 100
 voice-class sip profiles 100
 voice-class codec 1
 dtmf-relay rtp-nte
 srtp
 no vad

! --- Dial Peer to PSTN (Tata Mumbai) ---
dial-peer voice 200 voip
 description PSTN-Tata-Mumbai-Outbound
 preference 1
 destination-pattern 9[0-9].T
 session protocol sipv2
 session target ipv4:203.130.X.X    ! Tata SIP SBC IP
 voice-class codec 1
 dtmf-relay rtp-nte

! --- Inbound from PSTN ---
dial-peer voice 201 voip
 description PSTN-Tata-Mumbai-Inbound
 incoming called-number .
 session protocol sipv2
 voice-class codec 1
 dtmf-relay rtp-nte

! --- Inbound from Webex ---
dial-peer voice 101 voip
 description Webex-Calling-Inbound
 incoming uri via Webex
 session protocol sipv2
 voice-class sip tenant 100
 voice-class codec 1
 dtmf-relay rtp-nte
 srtp

! --- URI Class ---
voice class uri Webex sip
 host webexapis.com

! --- Certificate Configuration ---
crypto pki trustpoint WEBEX-TRUSTPOINT
 enrollment terminal
 revocation-check none
 
! --- TLS Profile ---
voice class tls-profile 1
 trustpoint WEBEX-TRUSTPOINT
 cipher suites tls13-aes128-gcm-sha256
 cn-san-validate server
 sni send webexapis.com
```

### 2.3.3 EMEA: Cloud Connected PSTN

#### 2.3.3.1 UK CCPP Configuration

| Configuration Item | Value |
|--------------------|-------|
| CCPP Provider | IntelePeer UK |
| Service Type | Cloud Connected PSTN |
| Route Group | RG-UK-CCPP |
| Numbers to Port | +44-20-7946-0001 to +44-20-7946-0799 |
| Main Number | +44-20-7946-0000 |
| Toll-Free | +44-800-123-4567 |
| Emergency | 999 / 112 (auto-configured by CCPP) |
| Zone/Edge Required | NO (UK has no toll bypass regulations) |
| Data Residency | UK Data Centers (London/Manchester) |

**Number Porting Process (UK):**
1. Submit Letter of Authorization (LOA) to IntelePeer
2. IntelePeer coordinates with existing provider (BT)
3. Typical porting window: 10 business days
4. Port validation test conducted 24 hours before cutover
5. Numbers active on Webex Calling after port complete

#### 2.3.3.2 EU CCPP Configuration (Frankfurt)

| Configuration Item | Value |
|--------------------|-------|
| CCPP Provider | IntelePeer EU |
| Service Type | Cloud Connected PSTN |
| Route Group | RG-EU-CCPP |
| Numbers to Port | +49-69-8888-0001 to +49-69-8888-0499 |
| Main Number | +49-69-8888-0000 |
| Toll-Free | +49-800-123-4567 (German) |
| Emergency | 112 (EU standard, auto-configured) |
| Zone/Edge Required | NO |
| Data Residency | EU Data Centers (Frankfurt/Amsterdam) |
| BSI C5 Compliance | Webex certified |
| EU Cloud CoC | Level 3 |

### 2.3.4 Americas: Cloud Connected PSTN

| Configuration Item | New Jersey | Dallas |
|--------------------|------------|--------|
| CCPP Provider | IntelePeer US | IntelePeer US |
| Route Group | RG-US-CCPP | RG-US-CCPP |
| Numbers to Port | +1-201-555-0001 to 0799 (800) | +1-214-555-0001 to 0499 (500) |
| Main Number | +1-201-555-0000 | +1-214-555-0000 |
| Toll-Free | +1-800-555-0123 (shared) | Shared with NJ |
| Emergency | 911 (E911 enabled) | 911 (E911 enabled) |
| E911 Address | Validated per user | Validated per user |

### 2.3.5 DID Migration Plan by Region

**DID Inventory Summary (from Chapter 1.1.8):**

| Region | City | Current Provider | DID Range | Count | Migration Method | Timeline |
|--------|------|------------------|-----------|-------|------------------|----------|
| India | Mumbai (Primary) | Tata Communications | +91-22-4960-0000 to 1999 | 2,000 | Keep on LGW | Week 1-2 |
| India | Mumbai (Backup) | Airtel | +91-22-4960-0000 to 0499 | 500 | Keep on LGW | Week 1-2 |
| India | Chennai | Tata Communications | +91-44-4960-0000 to 0799 | 800 | Keep on LGW | Week 3 |
| India | Bangalore | Tata Communications | +91-80-4321-0000 to 0399 | 400 | Keep on LGW | Week 3 |
| India | Delhi | Tata Communications | +91-11-4765-0000 to 0299 | 300 | Keep on LGW | Week 3-4 |
| India | Noida | Tata Communications | +91-120-456-0000 to 0249 | 250 | Keep on LGW | Week 4 |
| India | Pune | Tata Communications | +91-20-6789-0000 to 0199 | 200 | Keep on LGW | Week 4 |
| India | Hyderabad | Tata Communications | +91-40-4960-0000 to 0349 | 350 | Keep on LGW | Week 4 |
| India | Toll-Free | Tata Communications | 1800-266-1000, 1800-266-1001 | 2 | Keep on LGW | Week 2 |
| **India Total** | - | - | - | **4,802** | - | - |
| UK | London | BT | +44-20-7946-0000 to 0799 | 800 | Port to CCPP | Week 5-6 |
| UK | Toll-Free | BT | +44-800-123-4567 | 1 | Port to CCPP | Week 5 |
| Germany | Frankfurt | Deutsche Telekom | +49-69-8888-0000 to 0499 | 500 | Port to CCPP | Week 6-7 |
| Germany | Toll-Free | Deutsche Telekom | +49-800-123-4567 | 1 | Port to CCPP | Week 6 |
| **EMEA Total** | - | - | - | **1,302** | - | - |
| USA | New Jersey | AT&T | +1-201-555-0000 to 0799 | 800 | Port to CCPP | Week 7-8 |
| USA | Dallas | AT&T | +1-214-555-0000 to 0499 | 500 | Port to CCPP | Week 8 |
| USA | Toll-Free | AT&T | +1-800-555-0123 | 1 | Port to CCPP | Week 7 |
| **Americas Total** | - | - | - | **1,301** | - | - |
| **GLOBAL TOTAL** | - | - | - | **7,405** | - | **8 weeks** |

> **Note:** India DIDs remain on Local Gateway (existing Tata/Airtel contracts). EMEA and Americas DIDs will be ported to Cloud Connected PSTN (IntelePeer).

---
