# Appendix 10G: Jabber to Webex Complete Migration Guide

> **Document Reference:** ABV-COLLAB-MIG-2026 | Appendix 10G
> **Cross-References:** Chapter 7 (Migration), Appendix 10E (Identity), Appendix 10F (Remote Access)
> **Style:** Comprehensive Migration Guide (Opus 4.5)
> **Applicability:** Organizations with existing Cisco Jabber & Expressway infrastructure

---

## Document Purpose

This appendix provides a **complete migration guide for organizations with existing Cisco Jabber and Expressway infrastructure**. It covers all migration layers from legacy on-premises UC to Webex cloud, including:

- Identity & Directory Services
- Authentication & SSO
- Expressway & Remote Access
- Jabber Client Migration
- IM & Presence Services
- Voice Services (CUCM to Webex Calling)
- Coexistence & Cross-Platform Communication

**If your organization has Jabber deployed, this is your migration blueprint.**

---

## Table of Contents

**Part 1: Jabber Architecture Assessment**
- 10G.1 Jabber Deployment Architecture Overview
- 10G.2 Component Inventory Checklist
- 10G.3 Integration Dependencies Map

**Part 2: Migration Layers Overview**
- 10G.4 Seven-Layer Migration Model
- 10G.5 Migration Sequence & Dependencies

**Part 3: Layer 1 - Identity & Directory Migration**
- 10G.6 AD/LDAP to Azure AD + Webex Directory
- 10G.7 Directory Connector Deployment
- 10G.8 User Attribute Mapping

**Part 4: Layer 2 - Authentication & SSO Migration**
- 10G.9 CUCM/Jabber SSO to Webex SSO
- 10G.10 SAML Configuration Migration
- 10G.11 Certificate Management

**Part 5: Layer 3 - Expressway & Remote Access Migration**
- 10G.12 MRA to Webex Cloud-Native Access
- 10G.13 Expressway Decommissioning
- 10G.14 Firewall & Network Changes

**Part 6: Layer 4 - Jabber Client to Webex App Migration**
- 10G.15 Feature Parity Analysis
- 10G.16 Client Deployment Strategy
- 10G.17 User Migration Procedures

**Part 7: Layer 5 - IM & Presence Migration**
- 10G.18 CUPS to Webex Messaging
- 10G.19 Presence Federation
- 10G.20 Chat History Considerations

**Part 8: Layer 6 - Voice Services Migration**
- 10G.21 CUCM to Webex Calling
- 10G.22 Voicemail Migration (Unity to Webex)

**Part 9: Layer 7 - Coexistence & Cross-Platform Communication**
- 10G.23 Coexistence Architecture
- 10G.24 Cross-Platform Calling
- 10G.25 Interoperability Matrix

**Part 10: Implementation Playbook**
- 10G.26 Pre-Migration Planning
- 10G.27 Implementation Phases
- 10G.28 Cutover Runbook
- 10G.29 Post-Migration Validation
- 10G.30 Legacy Decommissioning

---

## Part 1: Jabber Architecture Assessment

## 10G.1 Jabber Deployment Architecture Overview

### Typical Enterprise Jabber Architecture

```
+-----------------------------------------------------------------------------+
|                    TYPICAL JABBER DEPLOYMENT ARCHITECTURE                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  EXTERNAL USERS (Internet)                                                  |
|  =========================                                                  |
|                                                                             |
|  +--------------+    +--------------+    +--------------+                  |
|  | Jabber Win   |    | Jabber Mac   |    | Jabber Mobile|                  |
|  | (Remote/WFH) |    | (Remote/WFH) |    | (iOS/Android)|                  |
|  +------+-------+    +------+-------+    +------+-------+                  |
|         |                   |                   |                           |
|         +-------------------+-------------------+                           |
|                             |                                               |
|                             v                                               |
|  ==================== INTERNET ====================                        |
|                             |                                               |
|                             v                                               |
|  +---------------------------------------------------------------------+   |
|  |                        DMZ / PERIMETER                               |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |                    EXPRESSWAY-E (Edge)                       |   |   |
|  |  |  +-------------+              +-------------+               |   |   |
|  |  |  | exp-e-01    |--(cluster)---| exp-e-02    |               |   |   |
|  |  |  | Public IP   |              | Public IP   |               |   |   |
|  |  |  +-------------+              +-------------+               |   |   |
|  |  |         |                            |                       |   |   |
|  |  |         |  Traversal Zone (TLS 7400) |                       |   |   |
|  |  |         +------------+---------------+                       |   |   |
|  |  +----------------------+---------------------------------------+   |   |
|  +-------------------------+-------------------------------------------+   |
|                            |                                               |
|  ================== INTERNAL FIREWALL =================                    |
|                            |                                               |
|  +-------------------------+-------------------------------------------+   |
|  |                    INTERNAL NETWORK                                  |   |
|  |                         |                                            |   |
|  |  +----------------------+----------------------+                    |   |
|  |  |              EXPRESSWAY-C (Core)             |                    |   |
|  |  |  +-------------+              +-------------+|                    |   |
|  |  |  | exp-c-01    |--(cluster)---| exp-c-02    ||                    |   |
|  |  |  +-------------+              +-------------+|                    |   |
|  |  +----------------------+----------------------+                    |   |
|  |                         |                                            |   |
|  |         +---------------+---------------+---------------+           |   |
|  |         |               |               |               |           |   |
|  |         v               v               v               v           |   |
|  |  +-----------+   +-----------+   +-----------+   +-----------+     |   |
|  |  |   CUCM    |   |  IM&P     |   |  Unity    |   |   LDAP    |     |   |
|  |  |  Cluster  |   |  (CUPS)   |   |Connection |   |   (AD)    |     |   |
|  |  |           |   |           |   |           |   |           |     |   |
|  |  | Publisher |   | Publisher |   |  Primary  |   |   DC-01   |     |   |
|  |  |Subscriber |   |Subscriber |   |  Backup   |   |   DC-02   |     |   |
|  |  +-----------+   +-----------+   +-----------+   +-----------+     |   |
|  |        |               |               |               |           |   |
|  |        +---------------+---------------+---------------+           |   |
|  |                                |                                    |   |
|  |                                v                                    |   |
|  |  +--------------+    +--------------+    +--------------+          |   |
|  |  | Jabber Win   |    | Jabber Mac   |    |  IP Phones   |          |   |
|  |  | (On-Network) |    | (On-Network) |    |  (On-Network)|          |   |
|  |  +--------------+    +--------------+    +--------------+          |   |
|  |                                                                     |   |
|  |  INTERNAL USERS (Corporate Network)                                |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Jabber Services & Dependencies

| Service | Server | Purpose | Webex Equivalent |
|---------|--------|---------|------------------|
| **Phone Service** | CUCM | Soft phone, desk phone control | Webex Calling |
| **IM Service** | IM&P (CUPS) | Instant messaging | Webex Messaging |
| **Presence Service** | IM&P (CUPS) | Availability status | Webex Presence |
| **Voicemail** | Unity Connection | Visual voicemail | Webex Voicemail |
| **Directory** | LDAP/AD | Contact search | Webex Directory |
| **Remote Access** | Expressway | MRA for remote users | Webex Cloud (native) |
| **Video** | CUCM + Endpoints | Video calling | Webex Meetings/Calling |
| **Meeting Join** | WebEx/TMS | Meeting integration | Webex Meetings |
| **Extend & Connect** | CUCM (CTIRD) | India WFH compliance | Webex Remote Office |

---

## 10G.1A India WFH Users: Extend and Connect Architecture

### Regulatory Context

**Why Extend and Connect is Used in India:**

India's Department of Telecommunications (DoT) and TRAI regulations prohibit toll bypass - routing PSTN calls over internet to avoid telecom charges. For Work-From-Home (WFH) users in India, using a softphone to make/receive PSTN calls from home could violate these regulations because:

1. **Toll Bypass Concern:** Softphone call from Mumbai user's home in Pune could bypass Mumbai telecom circle
2. **OSP Regulations:** Other Service Provider guidelines require PSTN calls to egress from registered locations
3. **Compliance Risk:** Organizations face penalties for telecom regulation violations

**Extend and Connect (CTI Remote Device) Solution:**

```
+-----------------------------------------------------------------------------+
|            EXTEND AND CONNECT ARCHITECTURE (INDIA WFH COMPLIANCE)            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SCENARIO: WFH User in India Receiving a Call                              |
|  =============================================                              |
|                                                                             |
|  +--------------+                                                          |
|  |   External   |                                                          |
|  |    Caller    |                                                          |
|  |  (Customer)  |                                                          |
|  +------+-------+                                                          |
|         |                                                                   |
|         | ① Calls user's office number                                     |
|         |    +91-22-4960-1234                                              |
|         v                                                                   |
|  +--------------+         +--------------+                                 |
|  |     PSTN     |-------->|     CUBE     |                                 |
|  |   (Carrier)  |         |   Gateway    |                                 |
|  +--------------+         +------+-------+                                 |
|                                  |                                          |
|                                  | ② Call arrives at CUCM                  |
|                                  v                                          |
|                           +--------------+                                 |
|                           |     CUCM     |                                 |
|                           |   Cluster    |                                 |
|                           +------+-------+                                 |
|                                  |                                          |
|              +-------------------+-------------------+                     |
|              |                   |                   |                     |
|              v                   v                   v                     |
|       ③ Ring Jabber      ④ Ring Remote       ⑤ Ring Desk Phone           |
|         (Softphone)         Destination         (if in office)            |
|              |                   |                                          |
|              |                   |                                          |
|  +-----------+-------+  +-------+-------------------------------+         |
|  |                   |  |                                        |         |
|  |  +-------------+  |  |  CUCM dials out to user's mobile:     |         |
|  |  |   Jabber    |  |  |  +91-98765-43210                       |         |
|  |  |  (Control   |  |  |                                        |         |
|  |  |   Only -    |  |  |  +-------------+      +-------------+ |         |
|  |  |  No Audio)  |  |  |  |    PSTN     |----->|   User's    | |         |
|  |  +-------------+  |  |  |   (Proper   |      |   Mobile    | |         |
|  |                   |  |  |   routing)  |      |   Phone     | |         |
|  |  User sees call   |  |  +-------------+      +-------------+ |         |
|  |  in Jabber, can   |  |                                        |         |
|  |  control it, but  |  |  ⑥ User answers mobile phone          |         |
|  |  audio is on      |  |     Audio path: Caller <-> PSTN <-> Mobile|         |
|  |  mobile phone     |  |                                        |         |
|  |                   |  |  ⑦ User controls call from Jabber:    |         |
|  +-------------------+  |     * Hold/Resume                      |         |
|                         |     * Transfer                         |         |
|                         |     * Conference                       |         |
|                         |     * End call                         |         |
|                         +----------------------------------------+         |
|                                                                             |
|  KEY COMPLIANCE POINT:                                                     |
|  ---------------------                                                     |
|  Audio NEVER traverses internet. PSTN call routes through proper          |
|  telecom circles. Only SIGNALING (call control) goes to Jabber.           |
|  This ensures DoT/TRAI compliance for WFH users.                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Extend and Connect Configuration in CUCM

```
CUCM EXTEND AND CONNECT CONFIGURATION
=================================================================

1. CTI Remote Device (CTIRD) Configuration:
-------------------------------------------
Device Type: CTI Remote Device
Device Name: CTIRD_<username>
Owner User ID: <username>
Remote Destination Profile: RDP_<username>

2. Remote Destination Profile:
------------------------------
Profile Name: RDP_<username>
User ID: <username>
Remote Destination Name: Mobile_<username>
Destination Number: +91-98765-43210 (user's mobile)
Enable Single Number Reach: Yes
Answer Too Soon Timer: 1500 ms
Answer Too Late Timer: 19000 ms
Delay Before Ringing: 4000 ms

3. User Device Association:
---------------------------
Primary Extension: 1234
Controlled Devices:
  - CTIRD_<username> (CTI Remote Device)
  - SEPXXXXXXXXXXXX (Desk phone - if applicable)

4. Jabber Configuration:
------------------------
Softphone Mode: Desk Phone Control Only
  (Cannot make calls directly - only control)
Extend and Connect: Enabled
```

### Current Extend and Connect User Inventory

| Location | WFH Users | Extend & Connect Users | Mobile Destinations |
|----------|-----------|------------------------|---------------------|
| Mumbai | 150 | 150 | Indian mobiles |
| Chennai | 50 | 50 | Indian mobiles |
| Bangalore | 30 | 30 | Indian mobiles |
| Delhi | 15 | 15 | Indian mobiles |
| Other India | 5 | 5 | Indian mobiles |
| **India Total** | **250** | **250** | **All using E&C** |
| EMEA/Americas | 100 | 0 | N/A (no restriction) |

### Migration to Webex Calling: India WFH Considerations

**Webex Calling Equivalent Features:**

| Extend & Connect Feature | Webex Calling Equivalent | Notes |
|--------------------------|-------------------------|-------|
| Remote Destination (Mobile) | **Simultaneous Ring** | Ring mobile + Webex App |
| CTI Remote Device | **Webex App Control** | Full call control |
| Single Number Reach | **Single Number Reach** | Same feature name |
| Desk Phone Control | **Webex App + Desk Phone** | Native integration |

**Critical Question: Does Webex Calling Comply with India DoT/TRAI?**

```
+-----------------------------------------------------------------------------+
|  WEBEX CALLING: INDIA COMPLIANCE ARCHITECTURE                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  OPTION 1: LOCAL GATEWAY (LGW) + ZONE-BASED ROUTING                        |
|  ==================================================                         |
|                                                                             |
|  WFH User in Pune (Mumbai Circle)                                          |
|         |                                                                   |
|         | Webex App (over internet)                                        |
|         v                                                                   |
|  +--------------+                                                          |
|  | Webex Cloud  |                                                          |
|  |   (India DC) |                                                          |
|  +------+-------+                                                          |
|         |                                                                   |
|         | Zone-based routing determines:                                   |
|         | "User is Mumbai zone -> route via Mumbai LGW"                     |
|         v                                                                   |
|  +--------------+      +--------------+                                    |
|  | Mumbai LGW   |----->|    PSTN      |                                    |
|  | (CUBE)       |      | Mumbai Circle|                                    |
|  +--------------+      +--------------+                                    |
|                                                                             |
|  OK COMPLIANT: PSTN call egresses from Mumbai (user's registered circle)   |
|  OK Media optimized through Local Gateway                                   |
|  OK No toll bypass - proper routing enforced                                |
|                                                                             |
|  =======================================================================   |
|                                                                             |
|  OPTION 2: SIMULTANEOUS RING TO MOBILE (Extend & Connect Equivalent)       |
|  ====================================================================      |
|                                                                             |
|  If regulatory concern persists, configure:                                |
|                                                                             |
|  Webex Calling -> Simultaneous Ring -> User's Indian Mobile                  |
|                                                                             |
|  +--------------+      +--------------+      +--------------+             |
|  |   Incoming   |----->| Webex Cloud  |----->|   LGW        |             |
|  |     Call     |      |              |      |  (dial out)  |             |
|  +--------------+      +--------------+      +------+-------+             |
|                               |                      |                     |
|                               |                      v                     |
|                               |               +--------------+             |
|                               |               |    PSTN      |             |
|                               |               |  to Mobile   |             |
|                               |               +------+-------+             |
|                               |                      |                     |
|                               v                      v                     |
|                        +--------------+      +--------------+             |
|                        |  Webex App   |      |   User's     |             |
|                        |  (Control)   |      |   Mobile     |             |
|                        +--------------+      |  (Audio)     |             |
|                                              +--------------+             |
|                                                                             |
|  OK Same behavior as CUCM Extend & Connect                                  |
|  OK Audio on mobile (PSTN), control on Webex App                           |
|  OK Full compliance with DoT/TRAI                                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Recommended Migration Approach for India WFH Users

```
INDIA WFH MIGRATION DECISION TREE
=================================================================

+-----------------------------------------------------------------+
|  START: India WFH User on Extend & Connect                      |
+--------------------------+--------------------------------------+
                           |
                           v
+-----------------------------------------------------------------+
|  Q1: Is Zone-Based Routing configured for user's location?      |
+--------------------------+--------------------------------------+
                           |
              +------------+------------+
              |                         |
              v                         v
         +--------+               +--------+
         |  YES   |               |   NO   |
         +----+---+               +----+---+
              |                        |
              v                        v
+-------------------------+  +-------------------------+
| User can use Webex App  |  | Configure Zone first:   |
| directly for calls.     |  | * Create Zone for user's|
|                         |  |   telecom circle        |
| Webex routes PSTN via   |  | * Assign LGW to Zone    |
| correct LGW based on    |  | * Map user to Zone      |
| Zone configuration.     |  |                         |
|                         |  | Then proceed to YES     |
| OK COMPLIANT             |  +-------------------------+
+-------------------------+
              |
              v
+-----------------------------------------------------------------+
|  Q2: Does user/compliance team require mobile-only audio?       |
|      (Exactly like current Extend & Connect behavior)           |
+--------------------------+--------------------------------------+
                           |
              +------------+------------+
              |                         |
              v                         v
         +--------+               +--------+
         |  YES   |               |   NO   |
         +----+---+               +----+---+
              |                        |
              v                        v
+-------------------------+  +-------------------------+
| Configure Simultaneous  |  | User uses Webex App     |
| Ring to Mobile:         |  | for all calls (voice    |
|                         |  | over WebRTC).           |
| Control Hub > User >    |  |                         |
| Calling > Simultaneous  |  | Zone routing ensures    |
| Ring > Add Mobile #     |  | PSTN compliance.        |
|                         |  |                         |
| User answers mobile,    |  | OK SIMPLER               |
| controls from Webex App |  | OK COMPLIANT             |
|                         |  | OK BETTER UX             |
| OK COMPLIANT             |  +-------------------------+
| OK Same as E&C behavior  |
+-------------------------+
```

### Webex Calling Configuration for India WFH

**Option A: Zone-Based Routing (Recommended)**

```
WEBEX CONTROL HUB CONFIGURATION
===============================================================

1. Verify Zone Configuration (from Chapter 2):
----------------------------------------------
   Zones already configured:
   * Zone-Mumbai-Circle -> LGW: lgw-mumbai-01/02
   * Zone-TamilNadu-Circle -> LGW: lgw-chennai-01/02
   * Zone-Karnataka-Circle -> LGW: lgw-bangalore-01
   * Zone-Delhi-Circle -> LGW: lgw-delhi-01
   
2. Assign WFH Users to Correct Zone:
------------------------------------
   Control Hub > Calling > Locations > [Location] > Zones
   
   User: ramesh.kumar@abhavtech.com
   Home Location: Pune (Maharashtra)
   Telecom Circle: Mumbai
   Assigned Zone: Zone-Mumbai-Circle
   
   Result: All PSTN calls route via Mumbai LGW regardless
           of user's physical location (Pune, home, etc.)

3. Trusted Network Edge (Optional):
-----------------------------------
   If user connects from office:
   * Webex detects office network
   * Uses optimized media path
   
   If user connects from home:
   * Webex uses cloud media
   * PSTN still routes via assigned Zone's LGW
```

**Option B: Simultaneous Ring (Extend & Connect Equivalent)**

```
SIMULTANEOUS RING CONFIGURATION
===============================================================

Control Hub > Users > [User] > Calling > Call Handling

1. Call Forwarding & Simultaneous Ring:
---------------------------------------
   [x] Enable Simultaneous Ring
   
   Ring these numbers when my line is called:
   +---------------------------------------------------------+
   | Number                    Ring Delay    Answer Confirm  |
   | ------------------------------------------------------- |
   | +91-98765-43210 (Mobile)  0 seconds     [x] Yes          |
   |                                                         |
   | [+ Add another number]                                  |
   +---------------------------------------------------------+
   
   Answer Confirm: Prevents voicemail pickup
   Ring Delay: 0 = immediate, matches Webex App ring

2. Webex App Settings:
----------------------
   User's Webex App still rings
   User can answer on:
   * Webex App (audio via WebRTC) - OR -
   * Mobile phone (audio via PSTN)
   
   Once answered on mobile:
   * Webex App shows active call
   * User can control: Hold, Transfer, Conference
   * Audio remains on mobile

3. Outbound Calls:
------------------
   From Webex App: Uses Webex Calling (Zone routing)
   From Mobile: Uses mobile carrier (separate)
   
   For outbound from Webex App to use mobile audio:
   Configure "Call Me" or "Dial via Office" feature
```

### Migration Checklist for India WFH Users

| Task | Status | Notes |
|------|--------|-------|
| **Pre-Migration** | | |
| [ ] Inventory all Extend & Connect users | | 250 users expected |
| [ ] Capture current Remote Destination numbers | | Mobile numbers |
| [ ] Verify Zone configuration for each circle | | Chapter 2 reference |
| [ ] Verify LGW operational in each circle | | Chapter 2 reference |
| [ ] Legal/compliance review of Webex approach | | DoT/TRAI sign-off |
| **Configuration** | | |
| [ ] Assign users to correct Zones | | Based on registered location |
| [ ] Configure Simultaneous Ring (if required) | | For E&C equivalent behavior |
| [ ] Test PSTN routing from each zone | | Verify correct LGW used |
| **User Migration** | | |
| [ ] Communicate change to WFH users | | Explain new behavior |
| [ ] Provide mobile answer instructions | | If using Sim Ring |
| [ ] Migrate users to Webex Calling | | Per batch schedule |
| [ ] Validate PSTN routing post-migration | | Check CDRs |
| **Post-Migration** | | |
| [ ] Decommission CTIRD devices in CUCM | | After validation |
| [ ] Remove Remote Destination Profiles | | Cleanup |
| [ ] Monitor for compliance issues | | Ongoing |

---

## 10G.2 Component Inventory Checklist

### Infrastructure Inventory

```
+-----------------------------------------------------------------+
|  JABBER INFRASTRUCTURE INVENTORY                                |
+-----------------------------------------------------------------+
|                                                                 |
|  CUCM CLUSTER                                                   |
|  ===============                                                |
|  Publisher:     ________________  Version: ________             |
|  Subscriber 1:  ________________  Version: ________             |
|  Subscriber 2:  ________________  Version: ________             |
|  TFTP Server:   ________________                                |
|  Total Users:   ________  Total Devices: ________               |
|                                                                 |
|  IM & PRESENCE (CUPS)                                           |
|  =====================                                          |
|  Publisher:     ________________  Version: ________             |
|  Subscriber:    ________________  Version: ________             |
|  IM Users:      ________  Peak Concurrent: ________             |
|  XMPP Federation: [ ] Enabled  [ ] Disabled                         |
|                                                                 |
|  UNITY CONNECTION                                               |
|  =================                                              |
|  Primary:       ________________  Version: ________             |
|  Backup:        ________________  Version: ________             |
|  Mailboxes:     ________                                        |
|  Integration:   [ ] SCCP  [ ] SIP                                   |
|                                                                 |
|  EXPRESSWAY-C (Core)                                            |
|  ===================                                            |
|  Node 1:        ________________  Version: ________             |
|  Node 2:        ________________  Version: ________             |
|  Type:          [ ] VM  [ ] Appliance (CE-series)                  |
|  Features:      [ ] MRA  [ ] B2B  [ ] Webex Hybrid                   |
|                                                                 |
|  EXPRESSWAY-E (Edge)                                            |
|  ===================                                            |
|  Node 1:        ________________  Version: ________             |
|  Node 2:        ________________  Version: ________             |
|  Public IP 1:   ________________                                |
|  Public IP 2:   ________________                                |
|  DNS SRV:       _collab-edge._tls.________________              |
|  Certificates:  [ ] Public CA  [ ] Internal CA                     |
|                                                                 |
|  ACTIVE DIRECTORY                                               |
|  =================                                              |
|  Domain:        ________________                                |
|  DC 1:          ________________                                |
|  DC 2:          ________________                                |
|  Azure AD Sync: [ ] Yes (hybrid)  [ ] No (on-prem only)            |
|  LDAP Base DN:  ________________                                |
|                                                                 |
|  JABBER CLIENTS                                                 |
|  ===============                                                |
|  Windows:       ________ users   Version: ________              |
|  Mac:           ________ users   Version: ________              |
|  iOS:           ________ users   Version: ________              |
|  Android:       ________ users   Version: ________              |
|  TOTAL:         ________ users                                  |
|                                                                 |
|  ACCESS METHODS                                                 |
|  ===============                                                |
|  On-Network:    ________ users (direct to CUCM)                |
|  MRA (Remote):  ________ users (via Expressway)                |
|  VPN + Jabber:  ________ users (VPN required)                  |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 10G.3 Integration Dependencies Map

### Jabber Service Dependencies

```
+-----------------------------------------------------------------+
|  JABBER SERVICE DEPENDENCY MAP                                  |
+-----------------------------------------------------------------+
|                                                                 |
|  JABBER CLIENT FEATURES -> BACKEND DEPENDENCIES                  |
|  ===========================================================    |
|                                                                 |
|  +-----------------+                                            |
|  |  JABBER CLIENT  |                                            |
|  +--------+--------+                                            |
|           |                                                     |
|     +-----+-----+-------------+-------------+-------------+    |
|     |           |             |             |             |    |
|     v           v             v             v             v    |
|  +------+  +--------+  +-----------+  +---------+  +-------+  |
|  |Phone |  |   IM   |  | Presence  |  |Voicemail|  |Directory| |
|  |Service| |Service |  | Service   |  | Service |  |Service |  |
|  +---+--+  +---+----+  +-----+-----+  +----+----+  +---+---+  |
|      |         |             |             |           |       |
|      v         v             v             v           v       |
|  +------+  +--------+  +-----------+  +---------+  +-------+  |
|  | CUCM |  | IM&P   |  |   IM&P    |  |  Unity  |  |  LDAP |  |
|  |      |  | (CUPS) |  |  (CUPS)   |  |Connection| |  (AD) |  |
|  +---+--+  +---+----+  +-----+-----+  +----+----+  +---+---+  |
|      |         |             |             |           |       |
|      |         |             |             |           |       |
|  +---+---------+-------------+-------------+-----------+---+  |
|  |                     EXPRESSWAY                           |  |
|  |              (Required for Remote/MRA Users)             |  |
|  |                                                          |  |
|  |  Expressway-C <----- Traversal Zone -----> Expressway-E |  |
|  |  (Internal)                                  (DMZ)       |  |
|  +----------------------------------------------------------+  |
|                                                                 |
|  ===========================================================    |
|                                                                 |
|  MIGRATION IMPACT:                                              |
|  -----------------                                              |
|  * Phone Service: CUCM -> Webex Calling                         |
|  * IM Service: IM&P -> Webex Messaging                          |
|  * Presence: IM&P -> Webex Presence                             |
|  * Voicemail: Unity -> Webex Voicemail                          |
|  * Directory: LDAP -> Directory Connector -> Webex               |
|  * Remote Access: Expressway -> ELIMINATED (cloud-native)       |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## Part 2: Migration Layers Overview

## 10G.4 Seven-Layer Migration Model

### Migration Stack

```
+-----------------------------------------------------------------+
|           JABBER TO WEBEX: SEVEN-LAYER MIGRATION MODEL          |
+-----------------------------------------------------------------+
|                                                                 |
|  LAYER 7: VOICE SERVICES                                        |
|  ========================                                       |
|  CUCM -> Webex Calling                                           |
|  Unity Connection -> Webex Voicemail                             |
|  Phone Features -> Webex Calling Features                        |
|                                                                 |
|  -----------------------------------------------------------    |
|                                                                 |
|  LAYER 6: COEXISTENCE & INTEROPERABILITY                        |
|  =======================================                        |
|  CUCM <-> Webex trunk (CUBE)                                      |
|  Cross-platform calling during migration                        |
|  Dial plan integration                                          |
|                                                                 |
|  -----------------------------------------------------------    |
|                                                                 |
|  LAYER 5: IM & PRESENCE                                         |
|  =======================                                        |
|  IM&P (CUPS) -> Webex Messaging                                  |
|  XMPP -> Webex Protocol                                          |
|  Presence Federation -> Webex Presence                           |
|                                                                 |
|  -----------------------------------------------------------    |
|                                                                 |
|  LAYER 4: CLIENT APPLICATION                                    |
|  ===========================                                    |
|  Jabber Windows -> Webex App Windows                             |
|  Jabber Mac -> Webex App Mac                                     |
|  Jabber Mobile -> Webex App Mobile                               |
|                                                                 |
|  -----------------------------------------------------------    |
|                                                                 |
|  LAYER 3: REMOTE ACCESS                                         |
|  =====================                                          |
|  Expressway MRA -> Webex Cloud-Native Access                     |
|  VPN Dependency -> No VPN Required                               |
|  Firewall Traversal -> Standard HTTPS (443)                      |
|                                                                 |
|  -----------------------------------------------------------    |
|                                                                 |
|  LAYER 2: AUTHENTICATION & SSO                                  |
|  =============================                                  |
|  CUCM SSO (SAML) -> Webex SSO (SAML)                            |
|  Jabber OAuth -> Webex OAuth                                     |
|  Certificate Auth -> Modern Auth                                 |
|                                                                 |
|  -----------------------------------------------------------    |
|                                                                 |
|  LAYER 1: IDENTITY & DIRECTORY                                  |
|  =============================                                  |
|  On-Prem AD -> Azure AD (hybrid or full)                        |
|  LDAP Sync -> Directory Connector                                |
|  User Provisioning -> SCIM/Automated                             |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 10G.5 Migration Sequence & Dependencies

### Recommended Migration Order

```
+-----------------------------------------------------------------+
|  MIGRATION SEQUENCE (Bottom-Up Approach)                        |
+-----------------------------------------------------------------+
|                                                                 |
|  PHASE 1: FOUNDATION (Weeks 1-2)                                |
|  ===============================                                |
|                                                                 |
|  +---------------------------------------------------------+   |
|  | LAYER 1: Identity & Directory                            |   |
|  | -----------------------------                            |   |
|  | [ ] Deploy Directory Connector                             |   |
|  | [ ] Sync users to Webex Cloud                              |   |
|  | [ ] Configure Azure AD integration (if hybrid)             |   |
|  | [ ] Validate user attributes                               |   |
|  +---------------------------------------------------------+   |
|                           |                                     |
|                           v                                     |
|  +---------------------------------------------------------+   |
|  | LAYER 2: Authentication & SSO                            |   |
|  | -----------------------------                            |   |
|  | [ ] Configure Webex SSO with Azure AD/IdP                  |   |
|  | [ ] Test SSO authentication                                |   |
|  | [ ] Configure OAuth for services                           |   |
|  | [ ] Document certificate expiry dates                      |   |
|  +---------------------------------------------------------+   |
|                           |                                     |
|                           v                                     |
|  PHASE 2: CLIENT & ACCESS (Weeks 3-4)                          |
|  ====================================                          |
|                                                                 |
|  +---------------------------------------------------------+   |
|  | LAYER 3: Remote Access                                   |   |
|  | -------------------------                                |   |
|  | [ ] Document current MRA users                             |   |
|  | [ ] Webex cloud-native access is automatic                 |   |
|  | [ ] No migration required - just works!                    |   |
|  | [ ] Plan Expressway decommission (later)                   |   |
|  +---------------------------------------------------------+   |
|                           |                                     |
|                           v                                     |
|  +---------------------------------------------------------+   |
|  | LAYER 4: Client Application                              |   |
|  | ---------------------------                              |   |
|  | [ ] Deploy Webex App to all devices                        |   |
|  | [ ] Configure Webex App settings                           |   |
|  | [ ] Users login to Webex App (parallel with Jabber)        |   |
|  | [ ] Conduct user training                                  |   |
|  +---------------------------------------------------------+   |
|                           |                                     |
|                           v                                     |
|  PHASE 3: SERVICES (Weeks 5-8)                                 |
|  =============================                                 |
|                                                                 |
|  +---------------------------------------------------------+   |
|  | LAYER 5: IM & Presence                                   |   |
|  | -------------------------                                |   |
|  | [ ] Evaluate IM migration requirements                     |   |
|  | [ ] Webex Messaging available immediately                  |   |
|  | [ ] No message history migration (fresh start)             |   |
|  | [ ] Presence automatic with Webex App                      |   |
|  +---------------------------------------------------------+   |
|                           |                                     |
|                           v                                     |
|  +---------------------------------------------------------+   |
|  | LAYER 6: Coexistence & Interoperability                  |   |
|  | ---------------------------------------                  |   |
|  | [ ] Configure CUBE trunk (CUCM <-> Webex)                    |   |
|  | [ ] Test cross-platform calling                            |   |
|  | [ ] Validate dial plan integration                         |   |
|  | [ ] Enable during entire migration period                  |   |
|  +---------------------------------------------------------+   |
|                           |                                     |
|                           v                                     |
|  +---------------------------------------------------------+   |
|  | LAYER 7: Voice Services                                  |   |
|  | --------------------------                               |   |
|  | [ ] Migrate users batch-by-batch to Webex Calling          |   |
|  | [ ] Configure Webex Voicemail                              |   |
|  | [ ] Port phone numbers                                     |   |
|  | [ ] Validate all calling features                          |   |
|  +---------------------------------------------------------+   |
|                           |                                     |
|                           v                                     |
|  PHASE 4: CLEANUP (Weeks 9-12)                                 |
|  =============================                                 |
|                                                                 |
|  [ ] Uninstall Jabber clients                                    |
|  [ ] Decommission Expressway                                     |
|  [ ] Decommission IM&P                                           |
|  [ ] Decommission CUCM                                           |
|  [ ] Decommission Unity Connection                               |
|                                                                 |
+-----------------------------------------------------------------+
```

### Critical Dependencies

| Migration Step | Depends On | Blocks |
|----------------|------------|--------|
| Directory Connector | AD accessible | SSO, User migration |
| SSO Configuration | Directory sync complete | Client login |
| Webex App Deployment | SSO working | User migration |
| CUBE Trunk | CUCM operational | Coexistence calling |
| User Migration (batch) | Webex App deployed | Jabber decom |
| Expressway Decom | All users on Webex | - |
| CUCM Decom | All users migrated | - |

---

## Part 3: Layer 1 - Identity & Directory Migration

## 10G.6 AD/LDAP to Azure AD + Webex Directory

### Current State vs. Target State

```
+-----------------------------------------------------------------+
|  DIRECTORY ARCHITECTURE: BEFORE & AFTER                         |
+-----------------------------------------------------------------+
|                                                                 |
|  BEFORE (Jabber/CUCM)                                          |
|  ===================                                            |
|                                                                 |
|  +-------------+      LDAP        +-------------+              |
|  |  On-Prem AD |<---------------->|    CUCM     |              |
|  |             |                   |             |              |
|  +------+------+                   +-------------+              |
|         |                                                       |
|         | LDAP                                                  |
|         v                                                       |
|  +-------------+      LDAP        +-------------+              |
|  |    IM&P     |<---------------->|  On-Prem AD |              |
|  |   (CUPS)    |                   |             |              |
|  +-------------+                   +-------------+              |
|                                                                 |
|  Issues:                                                        |
|  * Multiple LDAP sync configurations                            |
|  * No cloud directory                                           |
|  * Manual user provisioning in CUCM                             |
|                                                                 |
|  ===========================================================    |
|                                                                 |
|  AFTER (Webex)                                                  |
|  =============                                                  |
|                                                                 |
|  +-------------+    AD Connect    +-------------+              |
|  |  On-Prem AD |----------------->|  Azure AD   |              |
|  |             |                   |             |              |
|  +-------------+                   +------+------+              |
|                                           |                     |
|                                           | SCIM/SAML           |
|                                           v                     |
|  +-------------+    Dir Connector +-------------+              |
|  |  On-Prem AD |----------------->|Webex Cloud  |              |
|  |             |                   |  Directory  |              |
|  +-------------+                   +-------------+              |
|                                                                 |
|  Benefits:                                                      |
|  * Single source of truth (AD)                                  |
|  * Automated provisioning to Webex                              |
|  * SSO via Azure AD                                             |
|  * Real-time sync via SCIM                                      |
|                                                                 |
+-----------------------------------------------------------------+
```

### Migration Steps

| Step | Action | Details |
|------|--------|---------|
| 1 | Assess AD health | Verify user attributes, clean duplicates |
| 2 | Install Directory Connector | Windows Server, service account |
| 3 | Configure OU selection | Select OUs containing Jabber users |
| 4 | Map attributes | AD -> Webex attribute mapping |
| 5 | Run initial sync | Dry run, then full sync |
| 6 | Verify in Control Hub | Check user count, attributes |
| 7 | Configure auto-sync | Schedule (every 4 hours) |
| 8 | Configure license templates | Auto-assign based on groups |

---

## 10G.7 Directory Connector Deployment

### Pre-Requisites

| Requirement | Specification | Status |
|-------------|---------------|--------|
| Windows Server | 2016 or later | [ ] |
| .NET Framework | 4.6.2 or later | [ ] |
| AD Service Account | Read access to user OUs | [ ] |
| Network Access | HTTPS to cloudconnector.webex.com | [ ] |
| Webex Admin Account | Full administrator | [ ] |

### Installation Procedure

```
DIRECTORY CONNECTOR INSTALLATION
================================================================

Step 1: Prepare Service Account
-------------------------------
In Active Directory:
1. Create service account: svc-webex-dc@domain.com
2. Add to "Domain Users" group
3. Grant "Read" permission to user OUs
4. Set password to never expire

Step 2: Download Installer
--------------------------
1. Login: https://admin.webex.com
2. Navigate: Users > Manage Users > Directory Integration
3. Click "Download Directory Connector"
4. Save: CiscoDirectoryConnector_x64.msi

Step 3: Install
---------------
1. Copy MSI to Windows Server
2. Run as Administrator
3. Accept license agreement
4. Configure proxy (if required)
5. Complete installation

Step 4: Activate
----------------
1. Launch Directory Connector
2. Click "Sign In"
3. Authenticate with Webex admin account
4. Authorize application access
5. Status: "Connected to Webex"

Step 5: Configure AD Connection
-------------------------------
1. Click "Configuration"
2. Domain: corp.abhavtech.com
3. Authentication: Service Account
4. Username: svc-webex-dc@corp.abhavtech.com
5. Password: [service account password]
6. Click "Test Connection" -> Success
7. Click "Save"

Step 6: Select OUs
------------------
1. Click "Object Selection"
2. Expand domain tree
3. Select OUs containing Jabber users:
   [x] Users/Mumbai
   [x] Users/Chennai
   [x] Users/London
   [x] Users/Frankfurt
   [x] Users/Americas
   [ ] Service Accounts (exclude)
   [ ] Disabled Users (exclude)
4. Click "Save"

Step 7: Configure Groups
------------------------
1. Click "Groups" tab
2. Enable group sync: [x]
3. Select groups:
   [x] Webex-Calling-Users
   [x] Webex-CC-Agents
   [x] Webex-Admins
4. Click "Save"

Step 8: Run Sync
----------------
1. Click "Dry Run" -> Review results
2. Fix any errors in AD
3. Click "Sync Now" -> Initial sync
4. Monitor progress
5. Verify in Control Hub
```

---

## 10G.8 User Attribute Mapping

### Attribute Mapping Table

| AD Attribute | Webex Attribute | Required | Notes |
|--------------|-----------------|----------|-------|
| mail | email | **Yes** | Primary identifier |
| displayName | displayName | Yes | Full name |
| givenName | firstName | Yes | First name |
| sn | lastName | Yes | Surname |
| telephoneNumber | workPhone | No | Office phone |
| mobile | mobilePhone | No | Mobile number |
| title | title | No | Job title |
| department | department | No | Department |
| manager | manager | No | Manager reference |
| physicalDeliveryOfficeName | location | No | Office location |
| thumbnailPhoto | avatar | No | User photo |
| extensionAttribute1 | externalId | No | CUCM extension (custom) |

### Jabber-Specific Attribute Preservation

```
PRESERVING JABBER USER DATA DURING MIGRATION
=================================================================

Store these in AD extensionAttributes for reference during migration:

extensionAttribute1 = CUCM Extension (e.g., "1234")
extensionAttribute2 = CUCM Device Name (e.g., "SEP001122334455")
extensionAttribute3 = Jabber Username (if different from UPN)
extensionAttribute4 = Unity Mailbox (e.g., "mailbox_1234")
extensionAttribute5 = MRA Status (e.g., "MRA-Enabled")

Purpose:
* Reference during Webex provisioning
* Audit trail for migration
* Rollback information if needed
* License assignment automation
```

---

## Part 4: Layer 2 - Authentication & SSO Migration

## 10G.9 CUCM/Jabber SSO to Webex SSO

### SSO Architecture Comparison

```
+-----------------------------------------------------------------+
|  SSO ARCHITECTURE: JABBER vs WEBEX                              |
+-----------------------------------------------------------------+
|                                                                 |
|  JABBER SSO (Current)                                          |
|  ====================                                           |
|                                                                 |
|  +----------+                      +----------+                |
|  |  Jabber  |----- SAML Auth ----->|   IdP    |                |
|  |  Client  |                      |(ADFS/Azure)               |
|  +----+-----+                      +----------+                |
|       |                                  |                      |
|       |                                  | SAML Assertion       |
|       |                                  v                      |
|       |                            +----------+                |
|       |                            |   CUCM   |                |
|       |<----- OAuth Token ---------|   SSO    |                |
|       |                            +----------+                |
|       |                                                        |
|       | OAuth Token                                            |
|       v                                                        |
|  +----------+                                                  |
|  |   CUCM   |                                                  |
|  |   IM&P   |                                                  |
|  |  Unity   |                                                  |
|  +----------+                                                  |
|                                                                 |
|  Components:                                                    |
|  * CUCM SSO enabled                                            |
|  * IM&P SSO enabled                                            |
|  * Unity Connection SSO enabled                                |
|  * IdP metadata imported to each server                        |
|  * Certificates managed per server                             |
|                                                                 |
|  ===========================================================   |
|                                                                 |
|  WEBEX SSO (Target)                                            |
|  ==================                                             |
|                                                                 |
|  +----------+                      +----------+                |
|  |  Webex   |----- SAML Auth ----->|   IdP    |                |
|  |   App    |                      |(Azure AD)|                |
|  +----+-----+                      +----+-----+                |
|       |                                 |                       |
|       |                                 | SAML Assertion        |
|       |                                 v                       |
|       |                           +----------+                 |
|       |<----- Auth Token ---------|  Webex   |                 |
|       |                           |  Cloud   |                 |
|       |                           |   IdP    |                 |
|       v                           +----------+                 |
|  +----------------------------------------+                    |
|  |           Webex Cloud Services          |                    |
|  |  * Webex Calling                        |                    |
|  |  * Webex Messaging                      |                    |
|  |  * Webex Meetings                       |                    |
|  |  * Webex Contact Center                 |                    |
|  +----------------------------------------+                    |
|                                                                 |
|  Benefits:                                                      |
|  * Single SSO configuration (not per-server)                   |
|  * Centralized in Control Hub                                  |
|  * Cloud-managed certificates                                  |
|  * Simpler architecture                                        |
|                                                                 |
+-----------------------------------------------------------------+
```

### SSO Migration Steps

| Step | Action | Details |
|------|--------|---------|
| 1 | Document current IdP | ADFS, Azure AD, Okta, Ping, etc. |
| 2 | Export IdP metadata | Federation metadata XML |
| 3 | Configure Webex SSO | Control Hub > SSO |
| 4 | Upload IdP metadata | Or enter manually |
| 5 | Configure IdP for Webex | Add Webex as relying party |
| 6 | Test SSO | Use test user |
| 7 | Enable SSO | Organization-wide |
| 8 | Verify Jabber SSO still works | During coexistence |

---

## 10G.10 SAML Configuration Migration

### IdP Configuration for Webex

```
AZURE AD SAML CONFIGURATION FOR WEBEX
=================================================================

1. Create Enterprise Application
---------------------------------
   Azure Portal > Enterprise Applications > New
   Select: "Cisco Webex" from gallery
   Name: Abhavtech-Webex-SSO

2. Configure SAML
-----------------
   Single sign-on > SAML
   
   Basic SAML Configuration:
   +--------------------------------------------------------+
   | Identifier (Entity ID):                                |
   | https://idbroker.webex.com/{org-id}                   |
   |                                                        |
   | Reply URL (ACS):                                       |
   | https://idbroker.webex.com/idb/saml2/sso/{org-id}     |
   |                                                        |
   | Sign-on URL:                                           |
   | https://web.webex.com                                  |
   |                                                        |
   | Relay State: (leave blank)                             |
   |                                                        |
   | Logout URL:                                            |
   | https://idbroker.webex.com/idb/saml2/slo/{org-id}     |
   +--------------------------------------------------------+

3. Configure Claims
-------------------
   Attributes & Claims:
   +--------------------------------------------------------+
   | Claim Name              Source Attribute               |
   | -----------------------------------------------------  |
   | uid                     user.mail                      |
   | email                   user.mail                      |
   | firstName               user.givenname                 |
   | lastName                user.surname                   |
   | displayName             user.displayname               |
   +--------------------------------------------------------+
   
   [!]️ CRITICAL: "uid" claim must match the email address
      used in Webex directory.

4. Download Certificate
-----------------------
   SAML Signing Certificate > Download:
   * Certificate (Base64)
   * Federation Metadata XML

5. Configure Webex Control Hub
------------------------------
   Control Hub > Organization Settings > SSO
   Upload: Federation Metadata XML
   
   OR manually enter:
   * IdP Entity ID
   * SSO Login URL
   * SSO Logout URL
   * Certificate

6. Test & Enable
----------------
   Click "Test SSO" -> Complete login
   If successful -> "Enable SSO"
```

---

## 10G.11 Certificate Management

### Certificate Inventory

| Certificate | Current Location | Expiry | Webex Equivalent |
|-------------|------------------|--------|------------------|
| CUCM Tomcat | CUCM servers | Check | N/A (cloud) |
| CUCM CallManager | CUCM servers | Check | N/A (cloud) |
| IM&P Tomcat | IM&P servers | Check | N/A (cloud) |
| Expressway | Exp-C/E servers | Check | N/A (decom) |
| IdP Signing | ADFS/Azure AD | Check | Same IdP |
| IdP Encryption | ADFS/Azure AD | Check | Same IdP |

### Certificate Migration Notes

```
CERTIFICATE CONSIDERATIONS
=================================================================

ON-PREMISES CERTIFICATES (No Migration Required):
-------------------------------------------------
* CUCM certificates -> Not needed after decommission
* IM&P certificates -> Not needed after decommission
* Expressway certificates -> Not needed after decommission
* Unity certificates -> Not needed after decommission

These remain valid during coexistence, then become irrelevant.

IDENTITY PROVIDER CERTIFICATES (Continue to Manage):
----------------------------------------------------
* IdP signing certificate -> Used by both Jabber SSO and Webex SSO
* Set calendar reminder for IdP certificate renewal
* When IdP cert renews, update in Webex Control Hub

WEBEX CLOUD CERTIFICATES (Managed by Cisco):
--------------------------------------------
* Webex service certificates -> Cisco managed
* No customer action required
* Trust chain pre-installed in Webex App
```

---

## Part 5: Layer 3 - Expressway & Remote Access Migration

## 10G.12 MRA to Webex Cloud-Native Access

### Remote Access Architecture Comparison

```
+-----------------------------------------------------------------+
|  REMOTE ACCESS: MRA vs WEBEX CLOUD                              |
+-----------------------------------------------------------------+
|                                                                 |
|  JABBER MRA (Current) - Complex                                |
|  ==============================                                 |
|                                                                 |
|  Remote                                                         |
|   User     +-------------------------------------+             |
|    |       |           INTERNET                  |             |
|    |       +---------------+---------------------+             |
|    |                       |                                    |
|    |                       v                                    |
|    |              +-----------------+                          |
|    |              |  Expressway-E   |<-- Public IP             |
|    |              |  (DMZ)          |<-- Port 443, 5061        |
|    |              +--------+--------+<-- Public Certificate    |
|    |                       |                                    |
|    |              +--------+--------+                          |
|    |              | Traversal Zone  |<-- TLS 7400              |
|    |              | (Firewall)      |<-- Complex firewall      |
|    |              +--------+--------+                          |
|    |                       |                                    |
|    |              +--------+--------+                          |
|    |              |  Expressway-C   |<-- Internal              |
|    |              |  (Internal)     |                          |
|    |              +--------+--------+                          |
|    |                       |                                    |
|    |        +--------------+--------------+                    |
|    |        v              v              v                    |
|    |   +--------+    +--------+    +--------+                 |
|    |   |  CUCM  |    |  IM&P  |    | Unity  |                 |
|    |   +--------+    +--------+    +--------+                 |
|    |                                                           |
|    +--> Jabber -> Expressway-E -> Traversal -> Exp-C -> Services  |
|                                                                 |
|  Complexity:                                                    |
|  X Expressway infrastructure required                          |
|  X Complex firewall rules                                      |
|  X Certificate management                                      |
|  X DNS SRV records                                             |
|  X Traversal zone configuration                                |
|  X Ongoing maintenance                                         |
|                                                                 |
|  ===========================================================   |
|                                                                 |
|  WEBEX CLOUD (Target) - Simple                                 |
|  =============================                                  |
|                                                                 |
|  Remote                                                         |
|   User     +-------------------------------------+             |
|    |       |           INTERNET                  |             |
|    |       +---------------+---------------------+             |
|    |                       |                                    |
|    |                       | HTTPS (443)                       |
|    |                       | Standard TLS                      |
|    |                       v                                    |
|    |              +-----------------+                          |
|    |              |   Webex Cloud   |                          |
|    |              |   (Cisco DC)    |                          |
|    |              +-----------------+                          |
|    |                                                           |
|    +--> Webex App ------> Webex Cloud (DONE!)                  |
|                                                                 |
|  Simplicity:                                                    |
|  OK No Expressway required                                      |
|  OK No special firewall rules (standard HTTPS)                  |
|  OK No certificate management                                   |
|  OK No DNS SRV records                                          |
|  OK Works automatically anywhere                                |
|  OK Zero on-premises maintenance                                |
|                                                                 |
+-----------------------------------------------------------------+
```

### MRA User Migration

| MRA User Type | Migration Action | Notes |
|---------------|------------------|-------|
| Remote workers | Deploy Webex App | Works immediately over internet |
| WFH employees | Deploy Webex App | No VPN needed |
| Mobile users | Deploy Webex App Mobile | Same experience everywhere |
| Travel users | Deploy Webex App | Works in any location |

**Key Point:** Webex App users don't need ANY special remote access configuration. The cloud-native architecture handles everything.

---

## 10G.13 Expressway Decommissioning

### Decommissioning Timeline

```
EXPRESSWAY DECOMMISSIONING TIMELINE
=================================================================

PHASE 1: Preparation (During Migration)
---------------------------------------
Week 1-4:
[ ] Document all Expressway configurations
[ ] Export Expressway config backup
[ ] List all MRA-enabled users
[ ] Identify any B2B calling dependencies
[ ] Check for Webex Hybrid Services connectors

PHASE 2: Migration (User Cutover)
---------------------------------
Week 5-8:
[ ] Migrate users batch-by-batch to Webex
[ ] Monitor MRA session count decreasing
[ ] Verify migrated users working on Webex App
[ ] MRA sessions should approach zero

PHASE 3: Monitoring (Post-Migration)
------------------------------------
Week 9-10:
[ ] Confirm zero MRA sessions for 7+ consecutive days
[ ] Check Expressway logs for any stray connections
[ ] Verify no B2B calls traversing Expressway
[ ] Final notification to any remaining MRA users

PHASE 4: Decommission (Cleanup)
-------------------------------
Week 11-12:
[ ] Disable MRA on Expressway-C
[ ] Remove Traversal Zone
[ ] Update firewall rules (block MRA ports)
[ ] Remove DNS SRV records
[ ] Shutdown Expressway-E
[ ] Shutdown Expressway-C
[ ] Reclaim VM resources or retire appliances
[ ] Archive configuration backups
```

### Pre-Decommission Checklist

| Check | Status | Notes |
|-------|--------|-------|
| [ ] Zero MRA registrations for 7+ days | | |
| [ ] All Jabber users migrated to Webex | | |
| [ ] No B2B SIP/H.323 calls | | |
| [ ] Webex Hybrid connectors moved/removed | | |
| [ ] Configuration backup exported | | |
| [ ] Certificate expiry documented | | |
| [ ] DNS records identified for removal | | |
| [ ] Firewall rules identified for removal | | |
| [ ] Change request approved | | |
| [ ] Rollback plan documented | | |

---

## 10G.14 Firewall & Network Changes

### Firewall Rules to Remove (Post-Expressway Decom)

| Rule | Source | Destination | Ports | Action |
|------|--------|-------------|-------|--------|
| MRA SIP | Internet | Expressway-E | 5061/TCP | **Remove** |
| MRA HTTPS | Internet | Expressway-E | 443/TCP | **Remove** |
| MRA Media | Internet | Expressway-E | 36000-59999/UDP | **Remove** |
| Traversal | Exp-E | Exp-C | 7400/TCP | **Remove** |
| Traversal | Exp-E | Exp-C | 2222/TCP | **Remove** |
| Traversal Media | Exp-E | Exp-C | 36000-59999/UDP | **Remove** |
| CUCM from Exp | Exp-C | CUCM | 5060-5061/TCP | **Remove** |
| IM&P from Exp | Exp-C | IM&P | 5222/TCP, 7400/TCP | **Remove** |

### DNS Records to Remove

| Record | Type | Name | Value |
|--------|------|------|-------|
| MRA Discovery | SRV | _collab-edge._tls.abhavtech.com | exp-e.abhavtech.com |
| Expressway-E | A | exp-e.abhavtech.com | [Public IP] |
| Expressway-E | A | exp-e-02.abhavtech.com | [Public IP 2] |

### Firewall Rules to ADD (Webex)

```
WEBEX CLOUD FIREWALL REQUIREMENTS
=================================================================

Webex requires OUTBOUND access only (no inbound rules needed):

Destination                         Ports       Protocol
----------------------------------------------------------------
*.webex.com                         443         TCP (HTTPS)
*.wbx2.com                          443         TCP (HTTPS)
*.ciscospark.com                    443         TCP (HTTPS)
*.webexcontent.com                  443         TCP (HTTPS)

Media (if not using HTTPS media):
*.webex.com                         5004        UDP
*.wbx2.com                          5004        UDP
Media IP ranges                     33434-33598 UDP

Note: Webex App can operate with HTTPS-only (port 443).
      UDP ports improve media quality but are optional.

Reference: https://help.webex.com/article/WBX000028782
```

---

## Part 6: Layer 4 - Jabber Client to Webex App Migration

## 10G.15 Feature Parity Analysis

### Complete Feature Comparison

```
+-----------------------------------------------------------------+
|  JABBER vs WEBEX APP: COMPLETE FEATURE MATRIX                   |
+-----------------------------------------------------------------+
|                                                                 |
|  Feature                    Jabber    Webex App    Status       |
|  ===========================================================    |
|                                                                 |
|  CALLING                                                        |
|  ------------------------------------------------------------   |
|  Make/receive calls         OK         OK           [OK] Same       |
|  Hold/resume               OK         OK           [OK] Same       |
|  Blind transfer            OK         OK           [OK] Same       |
|  Consultative transfer     OK         OK           [OK] Same       |
|  Conference (ad-hoc)       OK         OK           [OK] Same       |
|  Conference (meet-me)      OK         OK           [OK] Same       |
|  Call park                 OK         OK           [OK] Same       |
|  Call pickup               OK         OK           [OK] Same       |
|  Call forward              OK         OK           [OK] Same       |
|  Do Not Disturb            OK         OK           [OK] Same       |
|  Call history (local)      OK         OK           [OK] Same       |
|  Call history (cloud sync) X         OK           ⬆️ Better     |
|  Visual voicemail          OK         OK           [OK] Same       |
|  Voicemail transcription   X         OK           ⬆️ Better     |
|  Call recording            Server    Cloud       ⬆️ Better     |
|  AI noise removal          X         OK           ⬆️ Better     |
|  Desk phone control (CTI)  OK         OK           [OK] Same       |
|                                                                 |
|  MESSAGING                                                      |
|  ------------------------------------------------------------   |
|  1:1 instant messaging     OK         OK           [OK] Same       |
|  Group chat                OK         OK           [OK] Same       |
|  Persistent rooms          OK (MUC)   OK (Spaces)  ⬆️ Better     |
|  Message search            Limited   Full-text   ⬆️ Better     |
|  File sharing              OK         OK           [OK] Same       |
|  Screen capture sharing    OK         OK           [OK] Same       |
|  Message reactions         X         OK           ⬆️ Better     |
|  Threaded replies          X         OK           ⬆️ Better     |
|  @mentions                 X         OK           ⬆️ Better     |
|  Message editing           X         OK           ⬆️ Better     |
|  Message deletion          X         OK           ⬆️ Better     |
|  Read receipts             OK         OK           [OK] Same       |
|  Typing indicators         OK         OK           [OK] Same       |
|                                                                 |
|  PRESENCE                                                       |
|  ------------------------------------------------------------   |
|  Available/Busy/Away       OK         OK           [OK] Same       |
|  Do Not Disturb            OK         OK           [OK] Same       |
|  Custom status message     Limited   Full        ⬆️ Better     |
|  Calendar integration      OK         OK           [OK] Same       |
|  Auto-status from meeting  OK         OK           [OK] Same       |
|  Presence across devices   OK         OK           [OK] Same       |
|                                                                 |
|  MEETINGS                                                       |
|  ------------------------------------------------------------   |
|  Join Webex meetings       Via WebEx Native     ⬆️ Better     |
|  Schedule meetings         Via WebEx Native     ⬆️ Better     |
|  Personal meeting room     OK         OK           [OK] Same       |
|  Screen sharing            OK         OK           [OK] Same       |
|  Remote desktop control    OK         OK           [OK] Same       |
|  Whiteboard                X         OK           ⬆️ Better     |
|  Meeting recording         OK         Cloud       ⬆️ Better     |
|  Meeting transcription     X         OK           ⬆️ Better     |
|  AI meeting summary        X         OK           ⬆️ Better     |
|                                                                 |
|  VIDEO                                                          |
|  ------------------------------------------------------------   |
|  1:1 video calling         OK         OK           [OK] Same       |
|  Group video               OK         OK           [OK] Same       |
|  Virtual backgrounds       X         OK           ⬆️ Better     |
|  Blur background           X         OK           ⬆️ Better     |
|  HD video                  OK         OK           [OK] Same       |
|                                                                 |
|  DIRECTORY & CONTACTS                                           |
|  ------------------------------------------------------------   |
|  Corporate directory       OK         OK           [OK] Same       |
|  Personal contacts         OK         OK           [OK] Same       |
|  Contact photos            OK         OK           [OK] Same       |
|  Favorites                 OK         OK           [OK] Same       |
|  Contact sync (cloud)      X         OK           ⬆️ Better     |
|                                                                 |
|  PLATFORMS                                                      |
|  ------------------------------------------------------------   |
|  Windows                   OK         OK           [OK] Same       |
|  Mac                       OK         OK           [OK] Same       |
|  iOS                       OK         OK           [OK] Same       |
|  Android                   OK         OK           [OK] Same       |
|  Web browser               X         OK           ⬆️ Better     |
|  Linux                     X         OK           ⬆️ Better     |
|                                                                 |
|  OVERALL: Webex App provides feature parity or improvement     |
|           in ALL categories. No features are lost.             |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 10G.16 Client Deployment Strategy

### Deployment Phases

```
WEBEX APP DEPLOYMENT STRATEGY
=================================================================

PHASE 1: Parallel Deployment (Week 1-2)
---------------------------------------
Goal: Get Webex App on all devices while Jabber still works

[ ] Deploy Webex App via:
  * SCCM/Intune (Windows)
  * JAMF (Mac)
  * MDM (Mobile)
  
[ ] Users have BOTH apps installed:
  * Jabber: Still connected to CUCM (primary for calls)
  * Webex: Connected to Webex Cloud (for familiarization)

[ ] Communicate to users:
  "Webex App is installed. Feel free to explore, but 
   continue using Jabber for phone calls until notified."

PHASE 2: User Training (Week 2-3)
---------------------------------
Goal: Ensure users are comfortable with Webex App

[ ] Conduct training sessions:
  * Online webinars (record for later viewing)
  * Quick reference guides
  * FAQs and comparison guides

[ ] Training topics:
  * Making and receiving calls
  * Using messaging
  * Finding contacts
  * Voicemail access
  * Settings and preferences

PHASE 3: Migration Cutover (Week 4+)
------------------------------------
Goal: Move users from CUCM/Jabber to Webex Calling

[ ] Migrate users batch-by-batch
[ ] On cutover:
  * User's phone number moves to Webex
  * Webex App becomes PRIMARY
  * Jabber STOPS WORKING for calls

[ ] Communicate to users:
  "Your phone service has moved to Webex. 
   Please use Webex App for all calls. 
   Jabber will no longer work for phone calls."

PHASE 4: Jabber Removal (Week 6+)
---------------------------------
Goal: Clean up old clients

[ ] Wait 2+ weeks after last user migration
[ ] Remove Jabber via:
  * SCCM uninstall task
  * Intune uninstall
  * JAMF removal policy
  * MDM app removal

[ ] Users should only have Webex App
```

---

## 10G.17 User Migration Procedures

### Per-User Migration Checklist

```
USER MIGRATION CHECKLIST
=================================================================

USER: _______________________  DATE: _______________

PRE-MIGRATION
-------------
[ ] Webex App installed on user's device(s)
[ ] User can login to Webex App (SSO working)
[ ] User attended training or watched video
[ ] User's AD account synced to Webex
[ ] Webex Calling license assigned
[ ] Phone number identified for migration

MIGRATION DAY
-------------
[ ] User notified of migration time
[ ] Migration executed (backend)
[ ] Phone number active in Webex
[ ] User signs out of Jabber
[ ] User signs into Webex App

VALIDATION
----------
[ ] Inbound call test (call user's number)
[ ] Outbound call test (user makes call)
[ ] Voicemail test (leave message, retrieve)
[ ] Directory search works
[ ] Messaging works
[ ] Presence shows correctly

POST-MIGRATION
--------------
[ ] User confirms everything working
[ ] User knows how to contact support
[ ] Follow-up scheduled for Day+1

SIGN-OFF
--------
Migration completed: [ ] Yes  [ ] No (issues: _____________)
Validated by: _______________________
User confirmation: _______________________
```

---

## Part 7: Layer 5 - IM & Presence Migration

## 10G.18 CUPS to Webex Messaging

### IM Migration Considerations

```
IM & PRESENCE MIGRATION CONSIDERATIONS
=================================================================

QUESTION: Do your users rely on IM & Presence?

Assess IM Usage:
----------------
[ ] Heavy IM usage (primary communication)
[ ] Moderate IM usage (supplement to email)
[ ] Light IM usage (occasional)
[ ] No IM usage (phone only)

If Heavy/Moderate:
------------------
* Plan for messaging migration
* Communicate change to users
* Consider chat history requirements

If Light/None:
--------------
* Migration is straightforward
* Webex Messaging available immediately
* No special planning needed

CHAT HISTORY:
-------------
[!]️ Jabber/CUPS chat history does NOT migrate to Webex

Options:
1. Start fresh in Webex (recommended)
   * Clean slate
   * No technical complexity
   * Users adapt quickly

2. Archive old messages
   * Export from CUPS database
   * Provide to users as archive
   * Does NOT import to Webex

Recommendation: Start fresh. Most organizations find that
historical IM messages have limited value.
```

### Feature Mapping

| CUPS/Jabber IM Feature | Webex Messaging Equivalent |
|------------------------|---------------------------|
| 1:1 Chat | Direct Messages |
| Group Chat | Group Spaces |
| Persistent Chat Rooms (MUC) | Spaces (persistent) |
| File Transfer | File Sharing in Spaces |
| Presence | Webex Presence (automatic) |
| XMPP Federation | Webex Connect (external) |

---

## 10G.19 Presence Federation

### Federation Comparison

| Aspect | Jabber/CUPS | Webex |
|--------|-------------|-------|
| Internal presence | IM&P server | Webex Cloud |
| External federation | XMPP federation | Webex Connect |
| Microsoft Teams | N/A or complex | Native integration |
| Cisco partners | XMPP | Webex B2B |

### Presence Behavior After Migration

```
PRESENCE BEHAVIOR IN WEBEX
=================================================================

Automatic Presence:
-------------------
Webex automatically shows presence based on:
* Calendar status (in meeting = busy)
* Call status (on call = busy)
* Focus time (DND)
* User-set status

Status Synchronization:
-----------------------
Presence syncs across all Webex surfaces:
* Webex App (desktop)
* Webex App (mobile)
* Webex Meetings
* Microsoft Teams (if integrated)

User-Configurable Status:
-------------------------
* Available
* Busy
* Do Not Disturb
* Away
* Custom status message (e.g., "Working remotely")
* Scheduled status (e.g., DND from 6 PM - 8 AM)
```

---

## 10G.20 Chat History Considerations

### Chat History Decision Matrix

| Scenario | Recommendation | Action |
|----------|----------------|--------|
| Compliance requirement | Archive | Export CUPS DB, store per retention policy |
| Users request history | Inform | Explain history doesn't migrate, start fresh |
| Legal hold | Archive | Export and retain per legal requirements |
| No requirement | Skip | Start fresh in Webex |

### CUPS Chat Export (If Required)

```
CUPS CHAT HISTORY EXPORT (For Archival Only)
=================================================================

Note: This is for ARCHIVAL purposes. Chat history cannot be
      imported into Webex Messaging.

Step 1: Access CUPS Database
----------------------------
Connect to IM&P Publisher via CLI or Informix tools

Step 2: Export Messages
-----------------------
-- SQL to export messages (simplified)
SELECT 
    sender_jid,
    recipient_jid,
    message_text,
    timestamp
FROM tc_messages
WHERE timestamp > '2024-01-01'
ORDER BY timestamp;

Step 3: Format for Archive
--------------------------
Export to CSV or XML format
Store in compliance archive system
Document retention period

Step 4: Communicate to Users
----------------------------
"Your chat history from Jabber has been archived. 
 It will not appear in Webex. New conversations in 
 Webex will be retained according to company policy."
```

---

## Part 8: Layer 6 - Voice Services Migration

## 10G.21 CUCM to Webex Calling

### Voice Migration Overview

The voice services migration is covered extensively in:
- **Chapter 7: Migration Execution** (detailed procedures)
- **Appendix 10E: Identity & Directory** (user provisioning)

Key aspects specific to Jabber users:

```
JABBER USER VOICE MIGRATION
=================================================================

Jabber Phone Features -> Webex Calling Features:

CUCM Feature              Webex Calling Feature
----------------------------------------------------------------
Softphone (CSF device)    Webex App (native calling)
Desk phone control (CTI)  Webex App desk phone control
Extension Mobility        Webex App (login anywhere)
Single Number Reach       Webex multi-device ringing
Mobile Connect            Webex App mobile
Cisco Jabber for VDI      Webex App for VDI

Migration Impact:
-----------------
* CSF device deleted from CUCM
* User's DN moves to Webex Calling
* Calling features configured in Webex
* Jabber stops working for calls immediately
* Webex App becomes the calling client
```

---

## 10G.22 Voicemail Migration (Unity to Webex)

### Voicemail Migration Strategy

```
VOICEMAIL MIGRATION: UNITY CONNECTION -> WEBEX
=================================================================

OPTION 1: Fresh Start (Recommended)
-----------------------------------
* Users get new Webex Voicemail mailbox
* Old Unity messages remain accessible during coexistence
* Users record new greetings in Webex
* After coexistence, Unity decommissioned

Pros:
OK Simple migration
OK No technical complexity
OK Clean start

Cons:
X Old messages not migrated
X Users must re-record greetings

OPTION 2: Message Export (Complex)
----------------------------------
* Export messages from Unity as WAV files
* Provide to users as archive
* Messages do NOT import to Webex Voicemail

Pros:
OK Users have access to old messages

Cons:
X Time-consuming
X Still need new Webex setup
X Messages not integrated

RECOMMENDATION: Fresh Start
---------------------------
Most voicemail messages have short-term value. 
Users adapt quickly to new mailbox.

USER COMMUNICATION:
-------------------
"Your voicemail has moved to Webex. 
 Please set up your new voicemail PIN:
 1. Dial *86 from your phone
 2. Follow prompts to set PIN and record greeting
 
 Old messages in Unity remain accessible at [pilot number]
 for 30 days."
```

---

## Part 9: Layer 7 - Coexistence & Cross-Platform Communication

## 10G.23 Coexistence Architecture

### Architecture During Migration

```
+-----------------------------------------------------------------+
|  COEXISTENCE ARCHITECTURE                                       |
+-----------------------------------------------------------------+
|                                                                 |
|                    +-----------------------+                    |
|                    |      CUBE/LGW         |                    |
|                    |  (Interworking Trunk) |                    |
|                    +-----------+-----------+                    |
|                                |                                |
|              +-----------------+-----------------+              |
|              |                                   |              |
|              v                                   v              |
|  +-----------------------+       +-----------------------+     |
|  |   CUCM ENVIRONMENT    |       |   WEBEX ENVIRONMENT   |     |
|  |                       |       |                       |     |
|  |  +-----------------+  |       |  +-----------------+  |     |
|  |  |     CUCM        |  |       |  |  Webex Calling  |  |     |
|  |  |   (Remaining    |  |       |  |   (Migrated     |  |     |
|  |  |    Users)       |  |       |  |    Users)       |  |     |
|  |  +-----------------+  |       |  +-----------------+  |     |
|  |                       |       |                       |     |
|  |  +-----------------+  |       |  +-----------------+  |     |
|  |  |     IM&P        |  |       |  |Webex Messaging  |  |     |
|  |  |   (Remaining    |  |       |  |   (Migrated     |  |     |
|  |  |    Users)       |  |       |  |    Users)       |  |     |
|  |  +-----------------+  |       |  +-----------------+  |     |
|  |                       |       |                       |     |
|  |  +-----------------+  |       |  +-----------------+  |     |
|  |  |   Jabber        |  |       |  |   Webex App     |  |     |
|  |  |   Clients       |  |       |  |   Clients       |  |     |
|  |  +-----------------+  |       |  +-----------------+  |     |
|  |                       |       |                       |     |
|  |  +-----------------+  |       |                       |     |
|  |  |   Expressway    |  |       |  (No Expressway      |     |
|  |  |   (MRA)         |  |       |   needed - cloud)    |     |
|  |  +-----------------+  |       |                       |     |
|  |                       |       |                       |     |
|  +-----------------------+       +-----------------------+     |
|                                                                 |
|  COEXISTENCE FEATURES:                                          |
|  ---------------------                                          |
|  OK Jabber users can call Webex users                           |
|  OK Webex users can call Jabber users                           |
|  OK Directory shows all users                                   |
|  OK Transfer between platforms works                            |
|  X IM between Jabber/Webex NOT supported natively              |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## 10G.24 Cross-Platform Calling

### Calling Matrix During Coexistence

| From | To | Path | Works? |
|------|-----|------|--------|
| Jabber (CUCM) | Webex User | CUCM -> CUBE -> Webex | [OK] Yes |
| Webex User | Jabber (CUCM) | Webex -> CUBE -> CUCM | [OK] Yes |
| Jabber (MRA) | Webex User | Jabber -> Exp -> CUCM -> CUBE -> Webex | [OK] Yes |
| Webex User | Jabber (MRA) | Webex -> CUBE -> CUCM -> Exp -> Jabber | [OK] Yes |
| Jabber | PSTN | CUCM -> CUBE -> PSTN | [OK] Yes |
| Webex | PSTN | Webex -> LGW -> PSTN | [OK] Yes |
| Jabber | Jabber | Direct via CUCM | [OK] Yes |
| Webex | Webex | Direct via Webex Cloud | [OK] Yes |

---

## 10G.25 Interoperability Matrix

### Feature Interoperability

| Feature | Jabber <-> Jabber | Webex <-> Webex | Jabber <-> Webex |
|---------|-----------------|---------------|----------------|
| Voice Call | [OK] | [OK] | [OK] |
| Video Call | [OK] | [OK] | [OK] |
| Transfer | [OK] | [OK] | [OK] |
| Conference | [OK] | [OK] | [OK] |
| IM/Chat | [OK] | [OK] | [X] |
| Presence | [OK] | [OK] | [X] |
| File Share | [OK] | [OK] | [X] |
| Screen Share | [OK] | [OK] | Via meeting only |

**Note:** IM/Presence between Jabber and Webex users is NOT supported during coexistence. Users must use one platform for messaging.

---

## Part 10: Implementation Playbook

## 10G.26 Pre-Migration Planning

### Planning Checklist (4-6 Weeks Before Migration)

| Task | Owner | Target Date | Status |
|------|-------|-------------|--------|
| **Discovery & Assessment** | | | |
| [ ] Complete Jabber inventory (10G.2) | Voice Eng | | |
| [ ] Document integration dependencies | Voice Eng | | |
| [ ] Assess IM usage patterns | Voice Eng | | |
| [ ] Identify MRA user count | Voice Eng | | |
| **Planning** | | | |
| [ ] Define migration batches | Voice Eng | | |
| [ ] Create migration schedule | PM | | |
| [ ] Develop training plan | Training | | |
| [ ] Draft user communications | Comms | | |
| **Infrastructure** | | | |
| [ ] Deploy Directory Connector | Voice Eng | | |
| [ ] Configure Webex SSO | Identity | | |
| [ ] Configure CUBE trunk | Voice Eng | | |
| [ ] Test coexistence calling | Voice Eng | | |
| **Client Deployment** | | | |
| [ ] Package Webex App for deployment | Desktop | | |
| [ ] Test Webex App deployment | Desktop | | |
| [ ] Deploy to pilot users | Desktop | | |
| **Training** | | | |
| [ ] Create training materials | Training | | |
| [ ] Schedule training sessions | Training | | |
| [ ] Create quick reference guides | Training | | |

---

## 10G.27 Implementation Phases

### Phase Timeline

```
IMPLEMENTATION TIMELINE
=================================================================

WEEK 1-2: FOUNDATION
--------------------
[ ] Directory Connector deployed and syncing
[ ] Webex SSO configured and tested
[ ] CUBE trunk configured for coexistence
[ ] Cross-platform calling validated

WEEK 2-3: CLIENT DEPLOYMENT
---------------------------
[ ] Webex App deployed to all devices (parallel with Jabber)
[ ] Users can login to Webex App
[ ] User training sessions conducted
[ ] Quick reference guides distributed

WEEK 4-6: USER MIGRATION (Batches)
----------------------------------
[ ] Batch 1: Pilot users (50 users)
  * IT staff, early adopters
  * Validate all features
  * Collect feedback
  
[ ] Batch 2: Department A (200 users)
  * First production batch
  * Monitor closely
  
[ ] Batch 3: Department B (300 users)
[ ] Batch 4: Department C (400 users)
[ ] Batch 5: Remaining users

WEEK 7-8: VALIDATION
--------------------
[ ] All users migrated to Webex
[ ] Zero Jabber registrations
[ ] Zero MRA sessions
[ ] Issues resolved

WEEK 9-12: CLEANUP
------------------
[ ] Jabber uninstalled from all devices
[ ] Expressway decommissioned
[ ] IM&P decommissioned
[ ] CUCM decommissioned (after CC migration if applicable)
[ ] Unity Connection decommissioned
```

---

## 10G.28 Cutover Runbook

### Migration Day Procedures

```
MIGRATION CUTOVER RUNBOOK
=================================================================

PRE-CUTOVER (T-24 Hours)
------------------------
[ ] Confirm batch user list finalized
[ ] Verify all users have Webex App installed
[ ] Send reminder communication to users
[ ] Confirm support team availability
[ ] Prepare rollback procedures

CUTOVER DAY (T-0)
-----------------

T-1 Hour:
[ ] Final go/no-go decision
[ ] Notify users: "Migration starting in 1 hour"
[ ] Confirm bridge line for support

T-0 (Migration Start):
[ ] Execute user migration (Control Hub or bulk tool)
[ ] Monitor migration progress
[ ] Notify users: "Migration in progress - use Webex App"

T+15 Minutes:
[ ] Verify users appearing in Webex Calling
[ ] Begin validation testing

T+30 Minutes:
[ ] First validation checkpoint
[ ] Test calls for sample users
[ ] Address any immediate issues

T+2 Hours:
[ ] All users in batch migrated
[ ] Send confirmation: "Migration complete"
[ ] Provide support contact info

POST-CUTOVER (T+24 Hours)
-------------------------
[ ] Follow up with users
[ ] Check for reported issues
[ ] Document lessons learned
[ ] Update status report
```

---

## 10G.29 Post-Migration Validation

### Validation Checklist

```
POST-MIGRATION VALIDATION CHECKLIST
=================================================================

PER-USER VALIDATION:
--------------------
[ ] Can login to Webex App
[ ] Shows correct name and extension
[ ] Inbound calls ring on Webex App
[ ] Outbound calls connect (internal)
[ ] Outbound calls connect (PSTN)
[ ] Voicemail working
[ ] Can access directory
[ ] Presence shows correctly
[ ] Can send/receive messages

SYSTEM VALIDATION:
------------------
[ ] All batch users show "Registered" in Control Hub
[ ] No orphaned users in CUCM
[ ] CUBE trunk handling cross-platform calls
[ ] No error logs in Webex admin
[ ] Call quality metrics within thresholds

JABBER CLEANUP VALIDATION:
--------------------------
[ ] Migrated users not registering to Jabber
[ ] MRA session count decreasing
[ ] Jabber error count decreasing (expected - users migrated)
```

---

## 10G.30 Legacy Decommissioning

### Decommissioning Sequence

```
LEGACY INFRASTRUCTURE DECOMMISSIONING
=================================================================

ORDER OF DECOMMISSIONING (Critical - Follow This Sequence):

1. JABBER CLIENTS (Week 1 after last migration)
   ---------------------------------------------
   [ ] Uninstall Jabber from managed devices
   [ ] Remove from MDM
   [ ] Notify users of removal date
   
2. EXPRESSWAY (Week 2 after last migration)
   ------------------------------------------
   Prerequisites:
   [ ] Zero MRA registrations for 7+ days
   [ ] No B2B calls
   
   Actions:
   [ ] Disable MRA
   [ ] Remove DNS records
   [ ] Update firewall rules
   [ ] Shutdown Expressway-E
   [ ] Shutdown Expressway-C
   [ ] Archive configurations

3. IM & PRESENCE (Week 3 after last migration)
   ----------------------------------------------
   Prerequisites:
   [ ] All IM users on Webex Messaging
   [ ] Chat archives exported (if required)
   
   Actions:
   [ ] Disable XMPP services
   [ ] Export compliance data
   [ ] Shutdown IM&P servers
   [ ] Archive configurations

4. UNITY CONNECTION (Week 4 or after CUCM)
   ----------------------------------------
   Prerequisites:
   [ ] All users on Webex Voicemail
   [ ] No active mailboxes
   
   Actions:
   [ ] Export any required messages
   [ ] Shutdown Unity servers
   [ ] Archive configurations

5. CUCM (Last - After All Dependencies)
   -------------------------------------
   Prerequisites:
   [ ] All users migrated
   [ ] Contact Center migrated (if applicable)
   [ ] All integrations removed
   
   Actions:
   [ ] Final configuration backup
   [ ] Shutdown subscribers
   [ ] Shutdown publisher
   [ ] Archive databases
   [ ] Decommission servers

POST-DECOMMISSION:
------------------
[ ] Update network documentation
[ ] Remove monitoring for decommissioned servers
[ ] Reclaim IP addresses
[ ] Reclaim licenses
[ ] Update asset inventory
[ ] Celebrate! 🎉
```

---

## Summary: Jabber to Webex Migration Checklist

## Complete Migration Checklist

| Phase | Task | Status |
|-------|------|--------|
| **DISCOVERY** | | |
| | Complete Jabber infrastructure inventory | [ ] |
| | Document integration dependencies | [ ] |
| | Assess IM/Presence usage | [ ] |
| | Identify MRA user count | [ ] |
| **LAYER 1: IDENTITY** | | |
| | Deploy Directory Connector | [ ] |
| | Sync users to Webex | [ ] |
| | Configure license templates | [ ] |
| **LAYER 2: AUTHENTICATION** | | |
| | Configure Webex SSO | [ ] |
| | Test SSO authentication | [ ] |
| | Enable SSO organization-wide | [ ] |
| **LAYER 3: REMOTE ACCESS** | | |
| | Document MRA users | [ ] |
| | Plan Expressway decommission | [ ] |
| **LAYER 4: CLIENT** | | |
| | Deploy Webex App | [ ] |
| | Conduct user training | [ ] |
| | Distribute quick reference guides | [ ] |
| **LAYER 5: IM & PRESENCE** | | |
| | Assess IM migration requirements | [ ] |
| | Communicate messaging changes | [ ] |
| **LAYER 6: COEXISTENCE** | | |
| | Configure CUBE trunk | [ ] |
| | Test cross-platform calling | [ ] |
| **LAYER 7: VOICE** | | |
| | Migrate users (batch by batch) | [ ] |
| | Configure Webex Voicemail | [ ] |
| | Validate all users | [ ] |
| **CLEANUP** | | |
| | Uninstall Jabber | [ ] |
| | Decommission Expressway | [ ] |
| | Decommission IM&P | [ ] |
| | Decommission CUCM | [ ] |
| | Decommission Unity | [ ] |

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 1 | Discovery Assessment |
| Chapter 7 | Migration Execution Procedures |
| Appendix 10E | Identity & Directory Configuration |
| Appendix 10F | Remote Access Assessment |
| Cisco Docs | Webex Calling Deployment Guide |
| Cisco Docs | Jabber to Webex App Migration |
| Cisco Docs | Expressway MRA Deployment Guide |

---

*End of Appendix 10G: Jabber to Webex Complete Migration Guide*
