# Coexistence Design

## 2.6 Interworking Design (CUCM-Webex Coexistence)

### 2.6.1 Coexistence Architecture Overview

During the migration period, CUCM and Webex Calling must coexist and interoperate seamlessly. This section details the architecture for the coexistence phase.

```
+-----------------------------------------------------------------------------+
|              CUCM - WEBEX CALLING COEXISTENCE ARCHITECTURE                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|                              +-----------------+                            |
|                              |   WEBEX CLOUD   |                            |
|                              |   (Mumbai + Chennai DCs)   |                            |
|                              +--------+--------+                            |
|                                       |                                      |
|                                       | SIP Trunk                           |
|                                       | (TLS/SRTP)                          |
|                                       |                                      |
|                              +--------v--------+                            |
|                              |   CUBE/LGW      |                            |
|                              |   Mumbai (HA)   |                            |
|                              |                 |                            |
|                              | Routes between: |                            |
|                              | * Webex Cloud   |                            |
|                              | * CUCM Cluster  |                            |
|                              | * PSTN          |                            |
|                              +---+---------+---+                            |
|                                  |         |                                 |
|              +-------------------+         +-------------------+            |
|              |                                                 |            |
|              v                                                 v            |
|  +-----------------------+                     +-----------------------+   |
|  |   CUCM CLUSTER        |                     |   WEBEX CALLING       |   |
|  |   (Remaining Users)   |                     |   (Migrated Users)    |   |
|  |   -----------------   |                     |   -----------------   |   |
|  |   * CC Agents (175)   |                     |   * Enterprise users  |   |
|  |   * Pending migration |                     |   * Hunt Groups       |   |
|  |   * UCCX integration  |                     |   * Auto Attendants   |   |
|  |                       | <-----------------> |                       |   |
|  |   Extensions:         |    Inter-cluster    |   Extensions:         |   |
|  |   Remaining batches   |    calling via      |   Migrated ranges     |   |
|  |                       |    CUBE trunk       |                       |   |
|  +-----------------------+                     +-----------------------+   |
|                                                                             |
|  COEXISTENCE PERIOD: Migration batches 1-7 (approximately 8-12 weeks)      |
|                                                                             |
|  CALL FLOW SUMMARY:                                                        |
|  ===================                                                       |
|  Webex -> CUCM:  Webex Cloud -> CUBE -> CUCM SIP Trunk -> CUCM User           |
|  CUCM -> Webex:  CUCM -> SIP Trunk -> CUBE -> Webex Cloud -> Webex User        |
|  Webex -> PSTN:  Webex Cloud -> Zone/LGW -> PSTN (India)                     |
|  CUCM -> PSTN:   CUCM -> CUBE -> PSTN (existing routing)                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 2.6.2 Coexistence Dial Plan Integration

**Routing Logic During Coexistence:**

| From | To | Route Path | Dial String |
|------|-----|------------|-------------|
| Webex User | CUCM User | Webex -> CUBE -> CUCM | Extension (4-digit) or ESN (8-XX-XXXX) |
| CUCM User | Webex User | CUCM -> CUBE -> Webex | Extension (4-digit) or ESN (8-XX-XXXX) |
| Webex User | PSTN (India) | Webex -> Zone -> LGW -> PSTN | 9 + number |
| CUCM User | PSTN | CUCM -> CUBE -> PSTN | 9 + number |
| External | Webex User | PSTN -> LGW -> Webex | DID |
| External | CUCM User | PSTN -> CUBE -> CUCM | DID |

**CUBE Dial Peer Configuration for Coexistence:**

```
! ============================================================
! CUBE Configuration - Coexistence Phase
! Routes calls between CUCM, Webex, and PSTN
! ============================================================

! --- Dial Peer for CUCM to Webex ---
dial-peer voice 300 voip
 description CUCM-to-Webex-Coexistence
 destination-pattern [1-5]...     ! Extensions migrated to Webex
 session protocol sipv2
 session target dns:webexapis.com
 session transport tcp tls
 voice-class sip tenant 100
 voice-class codec 1
 dtmf-relay rtp-nte
 srtp

! --- Dial Peer for Webex to CUCM ---
dial-peer voice 400 voip
 description Webex-to-CUCM-Coexistence
 destination-pattern [1-5]...     ! Extensions still on CUCM
 session protocol sipv2
 session target ipv4:10.1.1.10    ! CUCM Subscriber
 voice-class codec 1
 dtmf-relay rtp-nte

! --- Inbound from Webex for CUCM destinations ---
dial-peer voice 401 voip
 description Webex-Inbound-to-CUCM
 incoming uri via Webex
 session protocol sipv2
 voice-class sip tenant 100
 voice-class codec 1
 dtmf-relay rtp-nte
 srtp

! --- Translation Rules for Extension Routing ---
voice translation-rule 10
 rule 1 /^1/ /1/                  ! Mumbai extensions - check if Webex or CUCM
 rule 2 /^2/ /2/                  ! Chennai extensions
 rule 3 /^3/ /3/                  ! Branch extensions
 rule 4 /^4/ /4/                  ! EMEA extensions
 rule 5 /^5/ /5/                  ! Americas extensions
```

### 2.6.3 Coexistence Call Flow Diagrams

#### Scenario 1: Webex User Calls CUCM User (Internal)

```
+-----------------------------------------------------------------------------+
|  CALL FLOW: Webex User (Ext 1500) -> CUCM User (Ext 1001)                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------+    +---------+    +---------+    +---------+    +---------+  |
|  | Webex   |    | Webex   |    |  CUBE   |    |  CUCM   |    | CUCM    |  |
|  | User    |--->| Cloud   |--->|  LGW    |--->| Cluster |--->| User    |  |
|  | (1500)  |    |         |    |         |    |         |    | (1001)  |  |
|  +---------+    +---------+    +---------+    +---------+    +---------+  |
|                                                                             |
|  1. Webex user dials extension 1001                                        |
|  2. Webex Cloud recognizes 1001 is NOT on Webex (not yet migrated)        |
|  3. Webex routes call to CUBE via SIP trunk                               |
|  4. CUBE receives call, matches dial-peer for CUCM destinations           |
|  5. CUBE sends INVITE to CUCM cluster                                     |
|  6. CUCM routes call to extension 1001                                    |
|  7. CUCM user phone rings                                                 |
|  8. Media path: Webex User <-> CUBE <-> CUCM User                            |
|                                                                             |
|  CODEC NEGOTIATION: G.711 (transcoding at CUBE if needed)                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

#### Scenario 2: CUCM User Calls Webex User (Internal)

```
+-----------------------------------------------------------------------------+
|  CALL FLOW: CUCM User (Ext 1001) -> Webex User (Ext 2500)                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------+    +---------+    +---------+    +---------+    +---------+  |
|  | CUCM    |    |  CUCM   |    |  CUBE   |    | Webex   |    | Webex   |  |
|  | User    |--->| Cluster |--->|  LGW    |--->| Cloud   |--->| User    |  |
|  | (1001)  |    |         |    |         |    |         |    | (2500)  |  |
|  +---------+    +---------+    +---------+    +---------+    +---------+  |
|                                                                             |
|  1. CUCM user dials extension 2500                                         |
|  2. CUCM routes pattern 2XXX to SIP trunk (CUBE)                          |
|  3. CUBE receives call, matches dial-peer for Webex destinations          |
|  4. CUBE sends INVITE to Webex Cloud (TLS/SRTP)                           |
|  5. Webex Cloud routes call to extension 2500                             |
|  6. Webex user's Webex App/phone rings                                    |
|  7. Media path: CUCM User <-> CUBE <-> Webex User                            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

#### Scenario 3: External PSTN Call to Webex User (via DID)

```
+-----------------------------------------------------------------------------+
|  CALL FLOW: PSTN -> Webex User (DID +91-22-4960-1500)                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------+    +---------+    +---------+    +---------+    +---------+  |
|  | PSTN    |    |  Tata   |    |  CUBE   |    | Webex   |    | Webex   |  |
|  | Caller  |--->|  SIP    |--->|  LGW    |--->| Cloud   |--->| User    |  |
|  |         |    |         |    |         |    |         |    | (1500)  |  |
|  +---------+    +---------+    +---------+    +---------+    +---------+  |
|                                                                             |
|  1. External caller dials +91-22-4960-1500                                 |
|  2. Tata SIP trunk delivers call to CUBE                                  |
|  3. CUBE receives INVITE with To: +912249601500                           |
|  4. CUBE translates DID to extension 1500                                 |
|  5. CUBE checks: Is 1500 on Webex? YES (migrated user)                   |
|  6. CUBE sends INVITE to Webex Cloud                                      |
|  7. Webex routes to user 1500                                             |
|  8. User's Webex App/phone rings with CLI display                        |
|                                                                             |
|  KEY: DID-to-Extension translation must be maintained in CUBE             |
|       during coexistence to route calls to correct platform               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 2.6.4 Coexistence Testing Procedures

**Pre-Migration Test Matrix:**

| Test Case | From | To | Expected Result | Pass/Fail |
|-----------|------|-----|-----------------|-----------|
| TC-01 | Webex User | CUCM User (same site) | Call completes, 2-way audio | [ ] |
| TC-02 | CUCM User | Webex User (same site) | Call completes, 2-way audio | [ ] |
| TC-03 | Webex User | CUCM User (different site) | Call completes via ESN | [ ] |
| TC-04 | CUCM User | Webex User (different site) | Call completes via ESN | [ ] |
| TC-05 | Webex User | PSTN (India) | Call completes via Zone/LGW | [ ] |
| TC-06 | CUCM User | PSTN (India) | Call completes via CUBE | [ ] |
| TC-07 | PSTN | Webex User (via DID) | Call completes, CLI displayed | [ ] |
| TC-08 | PSTN | CUCM User (via DID) | Call completes, CLI displayed | [ ] |
| TC-09 | Webex User | Hunt Group (CUCM) | Call reaches HG, cycles agents | [ ] |
| TC-10 | CUCM User | Hunt Group (Webex) | Call reaches HG, cycles agents | [ ] |
| TC-11 | Webex User | Auto Attendant (Webex) | Menu prompts, transfers work | [ ] |
| TC-12 | Webex User | CUCM User (transfer) | Transfer completes | [ ] |
| TC-13 | CUCM User | Webex User (transfer) | Transfer completes | [ ] |
| TC-14 | Webex User | Conference (3-party) | All parties hear each other | [ ] |
| TC-15 | Webex User | Voicemail (Unity) | VM deposit and retrieval works | [ ] |

### 2.6.5 Coexistence Troubleshooting Guide

```
+-----------------------------------------------------------------------------+
|              COEXISTENCE TROUBLESHOOTING DECISION TREE                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SYMPTOM: Webex user cannot call CUCM user                                 |
|  ===========================================                               |
|                                                                             |
|  Step 1: Check if CUCM user extension is in CUBE dial plan                 |
|          -> Run: show dial-peer voice summary                               |
|          -> Verify destination-pattern matches CUCM extensions              |
|                                                                             |
|  Step 2: Check SIP trunk status to CUCM                                    |
|          -> Run: show sip-ua status                                         |
|          -> Verify TCP connection to CUCM is active                         |
|                                                                             |
|  Step 3: Check for 4xx/5xx errors in CUBE                                  |
|          -> Run: debug ccsip messages                                       |
|          -> Common issues:                                                  |
|            - 404 Not Found: Extension not registered on CUCM              |
|            - 503 Service Unavailable: CUCM overloaded                     |
|            - 488 Not Acceptable: Codec mismatch                           |
|                                                                             |
|  Step 4: Check Webex-to-CUBE connectivity                                  |
|          -> Control Hub -> Calling -> Trunk -> Status                         |
|          -> Verify trunk shows "Active"                                     |
|                                                                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SYMPTOM: CUCM user cannot call Webex user                                 |
|  ===========================================                               |
|                                                                             |
|  Step 1: Verify SIP trunk to CUBE in CUCM                                  |
|          -> CUCM Admin -> Device -> Trunk -> Status                           |
|          -> Should show "Full Service"                                      |
|                                                                             |
|  Step 2: Check route pattern in CUCM                                       |
|          -> Route patterns for migrated extensions should point to CUBE    |
|          -> If extension range not routed, add route pattern               |
|                                                                             |
|  Step 3: Check CUBE tenant configuration for Webex                         |
|          -> Verify credentials are correct                                  |
|          -> Check TLS certificate validity                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SYMPTOM: One-way audio between platforms                                  |
|  ========================================                                  |
|                                                                             |
|  Step 1: Check media binding in CUBE                                       |
|          -> Verify "bind media source-interface" is correct                |
|          -> Media interface must be reachable from both CUCM and Webex     |
|                                                                             |
|  Step 2: Check NAT/firewall traversal                                      |
|          -> Webex media uses UDP 19560-65535                               |
|          -> CUCM media uses UDP 16384-32767                                |
|          -> Both must be allowed through firewall                          |
|                                                                             |
|  Step 3: Verify SRTP settings match                                        |
|          -> Webex requires SRTP (encrypted)                                |
|          -> If CUCM side is RTP, CUBE must encrypt/decrypt                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 2.6.6 Coexistence Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| No direct SIP signaling Webex<->CUCM | All calls traverse CUBE | Ensure CUBE capacity |
| Codec transcoding required | CPU overhead on CUBE | Size CUBE appropriately |
| Hunt Group split not supported | HG members must be on same platform | Migrate entire HG together |
| Shared Line across platforms not supported | Virtual Line users must be on Webex | Migrate all VL users together |
| CUCM Barge/Monitor to Webex users not supported | Supervisor functions limited | Wait for Phase 2 (CC migration) |
| Extension mobility across platforms not supported | Users must use assigned platform | Plan user assignments carefully |

---

